import cron from 'node-cron';
import InventoryItem from '../models/InventoryItem.js';
import User from '../models/User.js';
import { createNotification } from '../services/notification.service.js';
import { sendEmail } from '../services/email.service.js';

/**
 * Initialize background jobs
 */
export const initializeJobs = () => {
    // Run the expiry check once immediately on startup to get initial alerts
    console.log('🔄 Running initial expiry check on startup...');
    checkExpiringItems();

    // Add recurring job to check expiring items every 1 hour (0 * * * *)
    cron.schedule('0 * * * *', async () => {
        console.log('🔄 Running scheduled expiry check job...');
        await checkExpiringItems();
    });

    console.log('✅ Background jobs initialized (using node-cron)');
};

/**
 * Check for expiring items and send alerts
 */
const checkExpiringItems = async () => {
    try {
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // 1. Optimized Find using our compound index
        const expiringItems = await InventoryItem.find({
            expiryDate: { $lte: threeDaysFromNow, $gt: now },
            status: { $in: ['fresh', 'expiring-soon'] },
            alertSent: false,
        }).populate('user');

        if (expiringItems.length > 0) {
            console.log(`Found ${expiringItems.length} expiring items to alert.`);
            
            const inventoryBulkOps = [];
            const notificationPromises = [];
            const emailPromises = [];

            for (const item of expiringItems) {
                const daysUntilExpiry = Math.ceil(
                    (item.expiryDate - now) / (1000 * 60 * 60 * 24)
                );

                // Stage the update for the database instead of executing an immediate await item.save()
                inventoryBulkOps.push({
                    updateOne: {
                        filter: { _id: item._id },
                        update: { $set: { status: 'expiring-soon', alertSent: true } }
                    }
                });

                // Batch the internal notifications asynchronously
                notificationPromises.push(
                    createNotification({
                        user: item.user._id,
                        type: 'expiry-alert',
                        title: 'Item Expiring Soon!',
                        message: `Your ${item.name} will expire in ${daysUntilExpiry} day(s)`,
                        data: { itemId: item._id, daysUntilExpiry },
                    }).catch(err => console.error(`Notification failed for item ${item._id}:`, err.message))
                );

                // Send email asynchronously if permitted by user configuration
                if (item.user?.preferences?.notificationSettings?.email) {
                    emailPromises.push(
                        sendEmail({
                            to: item.user.email,
                            subject: 'Food Expiry Alert - WasteLess',
                            html: `
                                <h2>Item Expiring Soon!</h2>
                                <p>Hi ${item.user.name},</p>
                                <p>Your <strong>${item.name}</strong> will expire in <strong>${daysUntilExpiry} day(s)</strong>.</p>
                                <p>Consider using it soon or check our recipe suggestions!</p>
                                <p>Best regards,<br>WasteLess Team</p>
                            `,
                        }).catch(emailErr => console.error(`Could not send email to ${item.user.email}:`, emailErr.message))
                    );
                }
            }

            // Execute all database writes and notifications concurrently
            // This condenses hundreds of database roundtrips into exactly ONE database call
            await Promise.all([
                InventoryItem.bulkWrite(inventoryBulkOps),
                Promise.all(notificationPromises),
                Promise.all(emailPromises)
            ]);
        }

        // 2. Mark expired items using an explicit positive enum match to guarantee index utilization
        const expiredResult = await InventoryItem.updateMany(
            {
                expiryDate: { $lte: now },
                status: { $in: ['fresh', 'expiring-soon'] }, // Upgraded from $ne to utilize the compound index
            },
            {
                $set: { status: 'expired' },
            }
        );

        if (expiredResult.modifiedCount > 0) {
            console.log(`Marked ${expiredResult.modifiedCount} items as expired.`);
        }

        return { processed: expiringItems.length };
    } catch (error) {
        console.error('Error in checkExpiringItems:', error);
    }
};
