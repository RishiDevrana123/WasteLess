import Notification from '../models/Notification.js';
import { io } from '../server.js';

/**
 * Create and send notification to user
 */
export const createNotification = async ({ user, type, title, message, data }) => {
    try {
        const notification = await Notification.create({
            user,
            type,
            title,
            message,
            data,
        });

        // Send real-time notification via Socket.io
        io.to(`user:${user}`).emit('notification', notification);

        // TODO: Send push notification via FCM
        // TODO: Send email notification if enabled
        // TODO: Send SMS notification if enabled

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

/**
 * Send push notification (mock implementation)
 */
export const sendPushNotification = async (userId, { title, body, data }) => {
    // Mock implementation - in production, use FCM
    console.log('📱 Mock Push Notification:');
    console.log('To:', userId);
    console.log('Title:', title);
    console.log('Body:', body);
    console.log('Data:', data);
};
