import Notification from '../models/Notification.js';
import { AppError } from '../middleware/errorHandler.js';

export const getNotifications = async (req, res, next) => {
    try {
        const { read, limit = 50 } = req.query;

        const filter = { user: req.user._id };
        if (read !== undefined) filter.read = read === 'true';

        const notifications = await Notification.find(filter)
            .sort('-createdAt')
            .limit(parseInt(limit));

        const unreadCount = await Notification.countDocuments({
            user: req.user._id,
            read: false,
        });

        res.json({
            success: true,
            count: notifications.length,
            unreadCount,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!notification) {
            return next(new AppError('Notification not found', 404));
        }

        notification.read = true;
        notification.readAt = new Date();
        await notification.save();

        res.json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { read: true, readAt: new Date() }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!notification) {
            return next(new AppError('Notification not found', 404));
        }

        await notification.deleteOne();

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
};
