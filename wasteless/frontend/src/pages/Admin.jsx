import { Settings, Users, ShoppingBag, Heart, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
    return (
        <div className="min-h-screen bg-black pb-20 pt-10">
            {/* Global Gradient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black text-white flex items-center gap-4 mb-8"
                >
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                        <Settings className="text-white" size={32} />
                    </div>
                    Admin Panel
                </motion.h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart2 className="text-green-500" /> System Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                                <span className="text-gray-400 flex items-center gap-2"><Users size={16} /> Total Users</span>
                                <span className="font-bold text-white">5,234</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                                <span className="text-gray-400 flex items-center gap-2"><ShoppingBag size={16} /> Active Listings</span>
                                <span className="font-bold text-green-400">156</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                                <span className="text-gray-400 flex items-center gap-2"><Heart size={16} /> Donations</span>
                                <span className="font-bold text-red-400">89</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors text-left px-4">
                                Manage Users
                            </button>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors text-left px-4">
                                View Reports
                            </button>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors text-left px-4">
                                System Settings
                            </button>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500 bg-black/20 rounded-xl border border-white/5 border-dashed">
                            <p>No recent activity logs</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
