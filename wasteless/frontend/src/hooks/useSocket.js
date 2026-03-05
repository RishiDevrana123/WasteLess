import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const useSocket = () => {
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (user && !socket) {
            socket = io(SOCKET_URL, {
                transports: ['websocket'],
            });

            socket.on('connect', () => {
                console.log('✅ Socket connected');
                socket.emit('join', user.id);
            });

            socket.on('notification', (notification) => {
                console.log('📬 New notification:', notification);
                addNotification(notification);
                toast(notification.message, {
                    icon: notification.type === 'expiry-alert' ? '⏰' : '🔔',
                });
            });

            socket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, [user, addNotification]);

    return socket;
};
