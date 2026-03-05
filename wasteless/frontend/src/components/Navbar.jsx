import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Package, ShoppingBag, Heart, BarChart3, Leaf, ChefHat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const { unreadCount, fetchNotifications } = useNotificationStore();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every 15 seconds
            const intervalId = setInterval(() => {
                fetchNotifications();
            }, 15000);
            return () => clearInterval(intervalId);
        }
    }, [user, fetchNotifications]);

    const handleLogout = () => {
        queryClient.clear();
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        ...(user ? [
            { to: '/pantry', label: 'Pantry', icon: Package },
            { to: '/recipes', label: 'Recipes', icon: ChefHat },
            { to: '/donations', label: 'Donate', icon: Heart },
            { to: '/analytics', label: 'Impact', icon: BarChart3 },
        ] : []),
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="bg-black/80 backdrop-blur-xl shadow-lg sticky top-0 z-[100] border-b border-white/5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo (Refined) */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-white/5 rounded-xl border border-white/5 group-hover:border-green-500/30 transition-colors">
                            <Leaf className="text-green-500 transform -rotate-12 group-hover:rotate-0 transition-all duration-500" size={20} strokeWidth={2.5} />
                            <div className="absolute inset-0 bg-green-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">
                            Waste<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Less</span>
                            <span className="text-green-500">.</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all group flex items-center gap-2 tracking-wide ${isActive(link.to)
                                    ? 'text-black bg-white shadow-lg shadow-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive(link.to) && <link.icon size={16} strokeWidth={2.5} />}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to="/notifications"
                                    className="relative p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                                >
                                    <Bell size={20} strokeWidth={2} className="group-hover:text-green-400 transition-colors" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 bg-green-500 text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-black">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <div className="h-8 w-px bg-white/10 mx-2" />

                                <div className="flex items-center gap-3 pl-2">
                                    <Link to="/profile" className="flex items-center gap-3 group bg-white/5 pr-4 pl-1 py-1 rounded-full hover:bg-white/10 transition-all border border-white/5 hover:border-white/10">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-green-500/20">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white font-bold px-5 py-2.5 rounded-full hover:bg-white/5 transition-all text-sm"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-2.5 bg-white text-black rounded-full font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transition-all transform hover:scale-105 text-sm flex items-center gap-2"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-bold ${isActive(link.to)
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <link.icon size={20} />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
