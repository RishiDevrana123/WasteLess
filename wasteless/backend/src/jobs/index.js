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

        // Find items expiring within 3 days that haven't been alerted
        const expiringItems = await InventoryItem.find({
            expiryDate: { $lte: threeDaysFromNow, $gt: now },
            status: { $in: ['fresh', 'expiring-soon'] },
            alertSent: false,
        }).populate('user');

        if (expiringItems.length > 0) {
            console.log(`Found ${expiringItems.length} expiring items to alert.`);
        }

        for (const item of expiringItems) {
            const daysUntilExpiry = Math.ceil(
                (item.expiryDate - now) / (1000 * 60 * 60 * 24)
            );

            // Update item status
            item.status = 'expiring-soon';
            item.alertSent = true;
            await item.save();

            // Create notification
            await createNotification({
                user: item.user._id,
                type: 'expiry-alert',
                title: 'Item Expiring Soon!',
                message: `Your ${item.name} will expire in ${daysUntilExpiry} day(s)`,
                data: { itemId: item._id, daysUntilExpiry },
            });

            // Send email if enabled
            if (item.user.preferences?.notificationSettings?.email) {
                try {
                    await sendEmail({
                        to: item.user.email,
                        subject: 'Food Expiry Alert - WasteLess',
                        html: `
                            <h2>Item Expiring Soon!</h2>
                            <p>Hi ${item.user.name},</p>
                            <p>Your <strong>${item.name}</strong> will expire in <strong>${daysUntilExpiry} day(s)</strong>.</p>
                            <p>Consider using it soon or check our recipe suggestions!</p>
                            <p>Best regards,<br>WasteLess Team</p>
                        `,
                    });
                } catch (emailErr) {
                    console.error("Could not send email, skipping", emailErr.message);
                }
            }
        }

        // Mark expired items
        const expiredResult = await InventoryItem.updateMany(
            {
                expiryDate: { $lte: now },
                status: { $ne: 'expired' },
            },
            {
                status: 'expired',
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
