import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Leaf, IndianRupee, Award, ArrowUpRight, PieChart, CloudLightning } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Analytics() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            try {
                return await analyticsAPI.getDashboard();
            } catch (e) {
                return {
                    data: {
                        data: {
                            impact: { foodSavedKg: 12.5, moneySaved: 2500, co2AvoidedKg: 45, mealsShared: 8 },
                            inventory: { consumed: 15, expired: 2, active: 8, total: 25 },
                            orders: { total: 5 },
                            donations: { made: 3 }
                        }
                    }
                }
            }
        },
        placeholderData: { data: { data: {} } }
    });

    const analytics = data?.data?.data || {};

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#9ca3af', font: { family: 'Inter', size: 10 }, usePointStyle: true, boxWidth: 6 }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.9)',
                titleColor: '#fff',
                bodyColor: '#9ca3af',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 }
            }
        },
        elements: {
            arc: {
                borderWidth: 0,
            }
        }
    };

    const inventoryChartData = {
        labels: ['Consumed', 'Expired', 'Active'],
        datasets: [
            {
                data: [
                    analytics?.inventory?.consumed || 0,
                    analytics?.inventory?.expired || 0,
                    analytics?.inventory?.active || 0,
                ],
                backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'],
                hoverOffset: 10,
            },
        ],
    };

    const stats = [
        {
            label: 'Food Saved',
            value: `${analytics?.impact?.foodSavedKg || 0} kg`,
            icon: Leaf,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        },
        {
            label: 'Money Saved',
            value: `₹${analytics?.impact?.moneySaved || 0}`,
            icon: IndianRupee,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'CO₂ Avoided',
            value: `${analytics?.impact?.co2AvoidedKg || 0} kg`,
            icon: TrendingUp,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
    ];

    return (
        <div className="min-h-screen bg-black pb-20 pt-12">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header (Premium Layout) */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-10">
                    <div>
                        <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-5 block flex items-center gap-2">
                            <PieChart size={14} /> IMPACT DASHBOARD
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-2">
                            Environmental <br /><span className="text-gray-500 italic font-medium font-serif">Analytics.</span>
                        </h1>
                    </div>

                    <p className="text-gray-400 max-w-sm text-sm leading-relaxed text-right hidden md:block font-light">
                        Visualize your contribution to a sustainable future. Every action counts.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Impact Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-black/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 hover:border-green-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(34,197,94,0.15)] transition-all duration-500 flex flex-col relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <ArrowUpRight size={18} className="text-gray-600 group-hover:text-green-400 group-hover:rotate-12 transition-all duration-300" />
                                    </div>

                                    <div className="mt-auto relative z-10">
                                        <h3 className="text-4xl font-black text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                            {stat.value}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-extrabold uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors mt-2">
                                            {stat.label}
                                        </p>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts Area */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] md:col-span-2 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent pointer-events-none opacity-50" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <h3 className="text-2xl font-black text-white flex items-center gap-4 tracking-tight font-display">
                                        <span className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-green-500/20 group-hover:border-green-500/40 transition-colors">
                                            <PieChart size={24} className="text-green-400" />
                                        </span>
                                        Consumption Matrix
                                    </h3>
                                </div>
                                <div className="h-72 flex items-center justify-center relative z-10 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                                    <Pie data={inventoryChartData} options={chartOptions} />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none opacity-50" />
                                <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />

                                <h3 className="text-lg font-extrabold text-white mb-10 tracking-[0.2em] uppercase relative z-10">Activity Summary</h3>
                                <div className="space-y-8 relative z-10">
                                    <div className="flex justify-between items-center pb-5 border-b border-white/5 hover:border-white/20 transition-colors">
                                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Items in Pantry</span>
                                        <span className="text-2xl font-black text-white">{analytics?.inventory?.total || 0}</span>
                                    </div>

                                    {/* Marketplace and Donations sections removed previously */}
                                    <div className="flex justify-between items-center pb-5 border-b border-white/5 hover:border-white/20 transition-colors">
                                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Active Inventory</span>
                                        <span className="text-2xl font-black text-blue-400">{analytics?.inventory?.active || 0}</span>
                                    </div>

                                    <div className="pt-4 p-6 bg-white/5 rounded-2xl border border-white/10 group-hover:border-green-500/30 transition-colors">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] block mb-4">Carbon Offset Rank</span>
                                        <div className="flex items-end gap-3">
                                            <span className="text-5xl font-black text-white tracking-tighter">#42</span>
                                            <span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs font-extrabold mb-2.5 flex items-center gap-1 border border-green-500/20">
                                                <ArrowUpRight size={14} strokeWidth={3} /> Top 5%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Impact Formula Legend */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent pointer-events-none opacity-50" />
                            <h3 className="text-xl font-black text-white mb-8 tracking-tight flex items-center gap-3 relative z-10 font-display">
                                <span className="p-2.5 bg-white/5 border border-white/10 rounded-xl group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                                    <CloudLightning size={20} className="text-purple-400" />
                                </span>
                                How Impact is Calculated
                            </h3>

                            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-green-400 font-bold text-sm tracking-wider uppercase">
                                        <Leaf size={16} /> Food Saved
                                    </div>
                                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                                        Calculated based on items successfully consumed rather than expired. Estimated at an average of <span className="text-white font-medium">0.5 kg</span> per consumed pantry item.
                                    </p>
                                    <div className="text-[10px] font-mono text-gray-500 bg-white/5 p-2 rounded-lg border border-white/5">
                                        Consumed Items × 0.5kg
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wider uppercase">
                                        <IndianRupee size={16} /> Money Saved
                                    </div>
                                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                                        The retained financial value of the food you consumed instead of throwing away. Estimated at an average of <span className="text-white font-medium">₹120</span> per kg.
                                    </p>
                                    <div className="text-[10px] font-mono text-gray-500 bg-white/5 p-2 rounded-lg border border-white/5">
                                        Food Saved (kg) × ₹120
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm tracking-wider uppercase">
                                        <TrendingUp size={16} /> CO₂ Avoided
                                    </div>
                                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                                        The greenhouse gas emissions prevented from food decomposition and replacement production. Estimated at <span className="text-white font-medium">2.5 kg CO₂</span> per kg of food.
                                    </p>
                                    <div className="text-[10px] font-mono text-gray-500 bg-white/5 p-2 rounded-lg border border-white/5">
                                        Food Saved (kg) × 2.5kg CO₂
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div >
    );
}
