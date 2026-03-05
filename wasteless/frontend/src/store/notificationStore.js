import { create } from 'zustand';
import { notificationAPI } from '../services/api';

export const useNotificationStore = create((set) => ({
    notifications: [],
    unreadCount: 0,

    setNotifications: (notifications) => set({ notifications }),

    fetchNotifications: async () => {
        try {
            const response = await notificationAPI.getAll();
            const notifications = response.data.data || [];

            // Use backend count if available, otherwise calculate from list
            const unreadCount = response.data.unreadCount !== undefined
                ? response.data.unreadCount
                : (Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0);

            set({
                notifications: Array.isArray(notifications) ? notifications : [],
                unreadCount: unreadCount
            });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            // Optionally set empty if error, but keeping old data might be better
        }
    },

    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        })),

    markAsRead: async (id) => {
        try {
            // Optimistic update
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n._id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));

            // API call
            await notificationAPI.markAsRead(id);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            // Optimistic update
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true })),
                unreadCount: 0,
            }));

            // API call
            await notificationAPI.markAllAsRead();
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    },

    setUnreadCount: (count) => set({ unreadCount: count }),
}));
