import { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Phone, MapPin, Shield, Edit2, LogOut, ChefHat, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, logout, updateUser } = useAuthStore();
    const fileInputRef = useRef(null);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { data: profileData } = useQuery({
        queryKey: ['profile'],
        queryFn: () => userAPI.getProfile()
    });

    const cookedRecipes = profileData?.data?.data?.cookedRecipes || [];

    const uploadAvatarMutation = useMutation({
        mutationFn: (base64) => userAPI.uploadAvatar({ avatar: base64 }),
        onSuccess: (res) => {
            updateUser({ avatar: res.data.data.avatar });
            toast.success('Profile photo updated!');
        },
        onError: () => toast.error('Failed to update photo')
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data) => userAPI.changePassword(data),
        onSuccess: () => {
            toast.success("Password changed successfully");
            setPasswordModalOpen(false);
            setCurrentPassword('');
            setNewPassword('');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to change password');
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                uploadAvatarMutation.mutate(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-black pb-20 pt-12">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header (Premium Layout) */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-10">
                    <div>
                        <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-5 block flex items-center gap-2">
                            <User size={14} /> ACCOUNT SETTINGS
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-2">
                            My <span className="text-gray-500 italic font-medium font-serif">Profile.</span>
                        </h1>
                    </div>

                    <button
                        onClick={logout}
                        className="text-red-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wide bg-red-500/10 hover:bg-red-500 px-4 py-2 rounded-lg border border-red-500/20"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar / User Card */}
                    <div className="md:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#111] rounded-[1.5rem] border border-white/5 p-8 text-center sticky top-24 shadow-2xl"
                        >
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full border-2 border-green-500/30 p-1 mx-auto relative group">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative z-10">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-white tracking-tighter">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadAvatarMutation.isPending}
                                        className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg hover:bg-green-400 transition-colors z-20 disabled:opacity-50"
                                    >
                                        {uploadAvatarMutation.isPending ? (
                                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Edit2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{user?.name}</h2>
                            <span className="inline-block bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded border border-green-500/20 uppercase tracking-wider mb-6">
                                {user?.role || 'Member'}
                            </span>

                            <div className="border-t border-white/5 pt-6 space-y-4 text-left">
                                <div className="flex items-center gap-4 text-gray-400 text-sm font-light hover:text-white transition-colors group">
                                    <div className="p-2 bg-white/5 rounded-lg text-gray-500 group-hover:text-green-400 transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <span className="truncate">{user?.email}</span>
                                </div>
                                {user?.phone && (
                                    <div className="flex items-center gap-4 text-gray-400 text-sm font-light hover:text-white transition-colors group">
                                        <div className="p-2 bg-white/5 rounded-lg text-gray-500 group-hover:text-green-400 transition-colors">
                                            <Phone size={16} />
                                        </div>
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                {user?.address?.city && (
                                    <div className="flex items-center gap-4 text-gray-400 text-sm font-light hover:text-white transition-colors group">
                                        <div className="p-2 bg-white/5 rounded-lg text-gray-500 group-hover:text-green-400 transition-colors">
                                            <MapPin size={16} />
                                        </div>
                                        <span>{user.address.city}, {user.address.state}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Account Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#111] rounded-[1.5rem] border border-white/5 p-8 shadow-2xl"
                        >
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 tracking-tight border-b border-white/5 pb-4">
                                <Shield className="text-gray-500" size={18} />
                                Security & Privacy
                            </h3>

                            <div className="space-y-4">
                                <div
                                    onClick={() => setPasswordModalOpen(true)}
                                    className="flex items-center justify-between p-5 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-white/5 transition-colors cursor-pointer group"
                                >
                                    <div>
                                        <h4 className="text-white font-bold text-sm tracking-wide mb-1">Password</h4>
                                        <p className="text-xs text-gray-500 font-light">Change your password</p>
                                    </div>
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">Update</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Cooked Recipes History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#111] rounded-[1.5rem] border border-white/5 p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3 tracking-tight">
                                    <ChefHat className="text-green-500" size={18} />
                                    Recipes Cooked History
                                </h3>
                                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">{cookedRecipes.length} Total</span>
                            </div>

                            <div className="space-y-3">
                                {cookedRecipes.length > 0 ? (
                                    cookedRecipes.map((recipe, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl transition-colors">
                                            <span className="text-gray-300 text-sm font-semibold truncate mb-1 sm:mb-0" title={recipe.title}>{recipe.title}</span>
                                            <span className="text-gray-500 text-[11px] uppercase tracking-wider whitespace-nowrap bg-white/5 px-2.5 py-1 rounded-md">
                                                {new Date(recipe.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    )).reverse()
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm mb-2 font-medium">No recipes cooked yet.</p>
                                        <p className="text-gray-600 text-xs">Explore recipes in the Recipes tab to start cooking!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <AnimatePresence>
                {passwordModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPasswordModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#1a1a1a] rounded-[2rem] w-full max-w-md relative z-10 overflow-hidden shadow-2xl border border-white/10"
                        >
                            <div className="p-8">
                                <button
                                    onClick={() => setPasswordModalOpen(false)}
                                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
                                >
                                    <X size={18} />
                                </button>
                                <h3 className="text-2xl font-bold text-white mb-2">Change Password</h3>
                                <p className="text-gray-400 text-sm mb-6">Enter your current password and a new strong password.</p>

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    changePasswordMutation.mutate({ currentPassword, newPassword });
                                }} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={changePasswordMutation.isPending}
                                        className="w-full py-4 mt-4 bg-green-500 text-black font-black uppercase text-sm rounded-xl tracking-widest hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                                    >
                                        {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
