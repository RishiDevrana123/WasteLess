import { useQuery } from '@tanstack/react-query';
import { Bell, Check, Trash2, Clock, CheckCheck, Loader2, Inbox } from 'lucide-react';
import { notificationAPI } from '../services/api';
import { useNotificationStore } from '../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notifications() {
    const { markAsRead, markAllAsRead } = useNotificationStore();

    const { data, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            try {
                return await notificationAPI.getAll();
            } catch (e) {
                return { data: { data: [] } }
            }
        },
        placeholderData: { data: { data: [] } }
    });

    const notifications = data?.data?.data || [];
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            markAsRead(id);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            markAllAsRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black pb-20 pt-12">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header (Premium Layout) */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-white/10 pb-10">
                    <div>
                        <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-5 block flex items-center gap-2">
                            <Bell size={14} /> ALERTS CENTER
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-2">
                            Your <span className="text-gray-500 italic font-medium font-serif">Notifications.</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-light mt-4">
                            You have <span className="text-white font-semibold">{unreadCount}</span> unread messages
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-bold text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-green-500/20 uppercase tracking-wide"
                            >
                                <CheckCheck size={14} />
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-3xl border-dashed"
                    >
                        <Inbox size={48} className="mx-auto text-white/10 mb-6" strokeWidth={1} />
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">All caught up</h3>
                        <p className="text-gray-500 font-light max-w-sm mx-auto">
                            You have no new notifications at the moment.
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence mode='popLayout'>
                            {notifications.map((notification, index) => (
                                <motion.div
                                    key={notification._id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                                    layout
                                    className={`group relative card p-5 flex gap-4 cursor-pointer transition-all hover:bg-white/[0.03] ${!notification.read ? 'border-l-2 border-l-green-500' : 'border-l-2 border-l-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`mt-1 p-2 rounded-full ${!notification.read ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                                        <Bell size={16} fill={!notification.read ? "currentColor" : "none"} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-sm font-bold ${!notification.read ? 'text-white' : 'text-gray-300'} tracking-tight`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap ml-2">
                                                {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : 'Just now'}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm font-light leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>

                                    {/* Hover action (optional) */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Could add delete button here if API supported it per item */}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
