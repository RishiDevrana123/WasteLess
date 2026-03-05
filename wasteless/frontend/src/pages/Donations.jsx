import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Coffee, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';

const DONATION_TIERS = [
    {
        id: 'coffee',
        amount: 100,
        title: 'Buy Us Coffee',
        desc: 'Help keep the servers running and our developers caffeinated.',
        icon: Coffee,
        color: 'from-orange-400 to-amber-600',
        shadow: 'shadow-orange-500/20'
    },
    {
        id: 'supporter',
        amount: 500,
        title: 'True Supporter',
        desc: 'Fund active maintenance, bug fixes, and continuous improvements.',
        icon: Heart,
        color: 'from-green-400 to-emerald-600',
        shadow: 'shadow-green-500/20',
        popular: true
    },
    {
        id: 'sponsor',
        amount: 1500,
        title: 'Platinum Sponsor',
        desc: 'Directly support new AI features and long-term sustainability.',
        icon: ShieldCheck,
        color: 'from-purple-400 to-violet-600',
        shadow: 'shadow-purple-500/20'
    }
];

export default function Donations() {
    const [searchParams] = useSearchParams();
    const [selectedAmount, setSelectedAmount] = useState(500);
    const [customAmount, setCustomAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        if (paymentStatus === 'success') {
            toast.success('Thank you for your generous donation!', { duration: 5000 });
        } else if (paymentStatus === 'cancelled') {
            toast.error('Donation cancelled. You can try again anytime.');
        }
    }, [searchParams]);

    const handleCheckout = async () => {
        const amount = customAmount ? parseInt(customAmount) : selectedAmount;
        if (!amount || amount < 50) {
            toast.error('Minimum donation amount is ₹50');
            return;
        }

        setIsLoading(true);
        try {
            const response = await paymentAPI.createDonationOrder({ amount });
            if (response.data?.data?.url) {
                window.location.href = response.data.data.url;
            } else {
                toast.error('Failed to initialize Stripe checkout session');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Donation error:', error);
            toast.error('An error occurred while setting up your donation.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-20 pb-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-green-400 to-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-xl shadow-green-500/20"
                    >
                        <Heart size={36} className="text-white fill-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4"
                    >
                        Support <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 italic font-serif">WasteLess.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        We build tools to save food, reduce waste, and protect the environment. If our platform has helped you save money and reduce waste, consider supporting our open-source development!
                    </motion.p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Why Donate Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl font-black text-white mb-6">Why we need your help</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Server & API Costs", desc: "AI integrations and server hosting cost money to maintain every month." },
                                    { title: "Continuous Development", desc: "We are actively developing new features to make the platform even better." },
                                    { title: "Ad-Free Experience", desc: "We refuse to show annoying ads or sell your personal data to fund ourselves." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                            <p className="text-gray-400 text-sm font-light mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#111] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors" />
                            <p className="relative z-10 text-gray-400 italic font-serif text-lg leading-relaxed">
                                "WasteLess started as a passion project to reduce global food waste. Every contribution ensures this platform stays running entirely independent and accessible to everyone."
                            </p>
                            <div className="mt-4 flex items-center gap-3 relative z-10">
                                <span className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center font-bold font-serif text-white border border-white/10">WL</span>
                                <span className="text-sm font-bold text-white uppercase tracking-wider">The WasteLess Team</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Donation Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#111] rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl relative"
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">Choose an amount</h3>

                        {/* Tiers Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {DONATION_TIERS.map((tier) => {
                                const isSelected = selectedAmount === tier.amount && !customAmount;
                                const Icon = tier.icon;

                                return (
                                    <div
                                        key={tier.id}
                                        onClick={() => { setSelectedAmount(tier.amount); setCustomAmount(''); }}
                                        className={`relative p-5 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${isSelected
                                                ? `bg-gradient-to-br ${tier.color} scale-105 shadow-xl ${tier.shadow}`
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {/* Popular Badge */}
                                        {tier.popular && (
                                            <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-bl-xl border-b border-l border-white/20">
                                                Popular
                                            </div>
                                        )}

                                        <div className={`mb-3 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className={`text-2xl font-black tracking-tight mb-1 ${isSelected ? 'text-white' : 'text-white'}`}>
                                            ₹{tier.amount}
                                        </div>
                                        <div className={`text-xs font-semibold ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                            {tier.title}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Custom Amount */}
                        <div className="mb-10 relative">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Or enter custom amount</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-6 text-gray-400 text-xl font-bold">₹</span>
                                <input
                                    type="number"
                                    min="50"
                                    placeholder="Enter amount"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setCustomAmount(e.target.value);
                                        if (e.target.value) setSelectedAmount(0);
                                        else setSelectedAmount(500);
                                    }}
                                    className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-xl font-bold transition-all focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Stripe info */}
                        <div className="bg-white/5 rounded-xl p-4 mb-6 flex gap-3 text-sm text-gray-400">
                            <ShieldCheck size={20} className="text-green-500 shrink-0" />
                            <p>Secure payment powered by <strong>Stripe</strong>. You will be redirected to the secure portal to complete your transaction.</p>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-green-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-green-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Support with ₹{customAmount || selectedAmount} <ChevronRight size={18} />
                                </>
                            )}
                        </button>

                    </motion.div>

                </div>
            </div>
        </div>
    );
}
