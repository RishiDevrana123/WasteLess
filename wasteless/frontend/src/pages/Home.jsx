import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, ArrowRight, Sparkles, Package, ChefHat, BarChart3,
    CheckCircle2, Clock, Flame, AlertTriangle, ArrowUpRight,
    Zap, RefreshCcw, ShieldCheck, ShoppingCart, MessageSquare,
    SlidersHorizontal, TrendingUp, IndianRupee, HeartHandshake
} from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import SplashParallax from '../components/SplashParallax';
import FUIBentoGridDark from '../components/ui/bento';

/* --- Interactive Demo Recipes for the Bento Matcher --- */
const DEMO_RECIPES = {
    'paneer-tomato': {
        name: 'Kadai Paneer Pepper Fry',
        time: '20 min',
        difficulty: 'Easy',
        match: 96,
        description: 'Tender paneer cubes tossed in freshly crushed spices and rich tomato gravy. Zero waste, restaurant grade.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
        tags: ['High Protein', 'Gluten Free']
    },
    'spinach-paneer': {
        name: 'Velvety Homestyle Palak Paneer',
        time: '25 min',
        difficulty: 'Easy',
        match: 100,
        description: 'Blanched garden spinach simmered with pan-seared paneer cubes and mild cumin aroma.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
        tags: ['Iron Rich', 'Low Carb']
    },
    'tomato-rice': {
        name: 'Spicy South-Indian Tomato Sadam',
        time: '15 min',
        difficulty: 'Quick',
        match: 92,
        description: 'Fragrant steamed rice tempered with mustard seeds, curry leaves, and tangy spiced tomato reduction.',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba8219d?w=600&q=80',
        tags: ['Quick Lunch', 'Vegan']
    },
    'milk-bread': {
        name: 'Crispy Royal Shahi Tukda Bites',
        time: '12 min',
        difficulty: 'Easy',
        match: 98,
        description: 'Toasted bread quarters soaked in condensed cardamom milk and garnished with roasted pistachios.',
        image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&q=80',
        tags: ['Dessert', 'Zero Waste']
    }
};

export default function Home() {
    // Interactive state for the live Recipe Matcher Bento
    const [selectedIngredients, setSelectedIngredients] = useState(['paneer', 'tomato']);
    
    // Interactive state for the live pantry card simulator
    const [mockStatus, setMockStatus] = useState('expiring'); // 'fresh' | 'expiring' | 'cooked'

    const getActiveRecipeKey = () => {
        const has = (item) => selectedIngredients.includes(item);
        if (has('paneer') && has('spinach')) return 'spinach-paneer';
        if (has('paneer') && has('tomato')) return 'paneer-tomato';
        if (has('tomato') && has('rice')) return 'tomato-rice';
        if (has('milk') && has('bread')) return 'milk-bread';
        return 'paneer-tomato';
    };

    const toggleIngredient = (id) => {
        if (selectedIngredients.includes(id)) {
            if (selectedIngredients.length > 2) {
                setSelectedIngredients(selectedIngredients.filter(i => i !== id));
            }
        } else {
            // Keep at most 2 for the live demo pairing
            setSelectedIngredients([selectedIngredients[1] || selectedIngredients[0], id]);
        }
    };

    const activeRecipe = DEMO_RECIPES[getActiveRecipeKey()];

    const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });

    return (
        <div className="min-h-screen text-white bg-black selection:bg-green-500/30">

            {/* 1. HERO SECTION (Untouched SplashParallax) */}
            <SplashParallax>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-20 pb-32">
                    <div className="flex flex-col items-center justify-center text-center mt-20">
                        {/* Centered Hero Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col items-center max-w-4xl"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="overflow-hidden mb-8"
                            >
                                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase">WasteLess Operating System</span>
                                </div>
                            </motion.div>

                            {/* Heading */}
                            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1] mb-8 text-white font-display">
                                Refined. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-serif italic font-light overflow-visible mt-2 block">
                                    Sustainable.
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light">
                                The intelligent platform for managing food inventory, eliminating waste, and optimizing planetary resources through seamless ecosystem design.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                                <Link
                                    to="/signup"
                                    className="group px-10 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-green-400 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-10px_rgba(74,222,128,0.5)] flex items-center justify-center gap-3"
                                >
                                    Start Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SplashParallax>

            {/* =========================================================================
                2. LIVE INTERACTIVE BENTO GRID (The Software in Action)
               ========================================================================= */}
            <section className="py-24 sm:py-32 relative border-t border-white/[0.08] overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-green-500/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
                                <Sparkles size={12} /> Interactive Preview
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                                Designed like software. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-serif italic font-normal">
                                    Crafted for your kitchen.
                                </span>
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm sm:text-base font-light max-w-sm leading-relaxed">
                            No rigid spreadsheets. Tap below to see how our live shelf-life radar and AI recipe matcher think ahead for you.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* BENTO CARD 1: Interactive Live Recipe Matcher (7 Cols) */}
                        <div className="lg:col-span-7 bg-zinc-950/80 border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                            
                            {/* Card Header & Controls */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                                            <ChefHat size={16} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Live AI Recipe Engine</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Interactive Demo
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                    Pick ingredients. Watch dinner materialize.
                                </h3>
                                <p className="text-sm text-gray-400 font-light mb-6">
                                    Tap any combination below to simulate our custom Indian culinary generator:
                                </p>

                                {/* Ingredient Chips Picker */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {[
                                        { id: 'paneer', label: 'Paneer (250g)', emoji: '🧀' },
                                        { id: 'tomato', label: 'Tomatoes (3 pcs)', emoji: '🍅' },
                                        { id: 'spinach', label: 'Palak (1 bunch)', emoji: '🥬' },
                                        { id: 'rice', label: 'Basmati Rice', emoji: '🍚' },
                                        { id: 'milk', label: 'Full Cream Milk', emoji: '🥛' },
                                        { id: 'bread', label: 'Sandwich Bread', emoji: '🍞' }
                                    ].map(item => {
                                        const isSelected = selectedIngredients.includes(item.id);
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => toggleIngredient(item.id)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${
                                                    isSelected
                                                        ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105 font-bold'
                                                        : 'bg-zinc-900 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                                                }`}
                                            >
                                                <span>{item.emoji}</span>
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dynamically Generated Recipe Showcase Card */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeRecipe.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-black/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center"
                                >
                                    <div className="w-full sm:w-40 h-36 rounded-xl overflow-hidden relative flex-shrink-0 border border-white/10">
                                        <img
                                            src={activeRecipe.image}
                                            alt={activeRecipe.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-black text-green-400 border border-white/10">
                                            {activeRecipe.match}% Match
                                        </div>
                                    </div>

                                    <div className="flex-1 text-left w-full">
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 font-medium">
                                            <span className="flex items-center gap-1 text-gray-300">
                                                <Clock size={12} className="text-green-400" /> {activeRecipe.time}
                                            </span>
                                            <span>&middot;</span>
                                            <span className="flex items-center gap-1 text-gray-300">
                                                <Flame size={12} className="text-amber-400" /> {activeRecipe.difficulty}
                                            </span>
                                            <span>&middot;</span>
                                            <span className="text-emerald-400 font-semibold">Zero-Waste</span>
                                        </div>

                                        <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
                                            {activeRecipe.name}
                                        </h4>
                                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                                            {activeRecipe.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5">
                                            {activeRecipe.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-300">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* BENTO CARD 2: The Live Pantry Expiry Radar (5 Cols) */}
                        <div className="lg:col-span-5 bg-zinc-950/80 border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                            <AlertTriangle size={16} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Freshness Radar</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono">SIMULATION</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                    Never let good food spoil silently.
                                </h3>
                                <p className="text-sm text-gray-400 font-light mb-6">
                                    Every item gets an algorithmic shelf-life countdown. Interactive status card below:
                                </p>

                                {/* Interactive Item Card Simulation */}
                                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-base font-bold text-white">Full Cream Buffalo Milk</span>
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">1 L</span>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">Category: Dairy &middot; Fridge</span>
                                        </div>

                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all ${
                                            mockStatus === 'expiring'
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                : mockStatus === 'cooked'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                : 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                                        }`}>
                                            {mockStatus === 'expiring' ? '⏰ Expiring in 24h' : mockStatus === 'cooked' ? '✓ Consumed' : 'Fresh & Safe'}
                                        </span>
                                    </div>

                                    {/* Expiry Gauge Bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[11px] text-gray-400">
                                            <span>Freshness Window</span>
                                            <span className="font-mono text-white">
                                                {mockStatus === 'expiring' ? 'Day 3 of 4' : mockStatus === 'cooked' ? '100% Utilized' : 'Day 1 of 4'}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-black/60 border border-white/5 overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${
                                                    mockStatus === 'expiring'
                                                        ? 'w-3/4 bg-gradient-to-r from-amber-400 to-rose-500'
                                                        : mockStatus === 'cooked'
                                                        ? 'w-full bg-emerald-500'
                                                        : 'w-1/4 bg-teal-400'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Interactive Simulator Controls */}
                                    <div className="pt-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setMockStatus('fresh')}
                                            className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                                                mockStatus === 'fresh' ? 'bg-white text-black font-bold' : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Fresh
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMockStatus('expiring')}
                                            className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                                                mockStatus === 'expiring' ? 'bg-amber-400 text-black font-bold' : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Warn Me
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMockStatus('cooked')}
                                            className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                                                mockStatus === 'cooked' ? 'bg-emerald-400 text-black font-bold' : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Cooked
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                <span>Zero barcode scanning required</span>
                                <span className="text-green-400 font-medium">Automatic Alerts &rarr;</span>
                            </div>
                        </div>

                        {/* BENTO CARD 3: Natural Language Haul Ingestion (6 Cols) */}
                        <div className="lg:col-span-6 bg-zinc-950/80 border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                        <MessageSquare size={16} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Groq-Powered Smart Log</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                    Speak or paste what you bought. Done.
                                </h3>
                                <p className="text-sm text-gray-400 font-light mb-6">
                                    No tedious dropdowns. Just type your grocery bill or natural text:
                                </p>

                                {/* Simulated Terminal / Input Block */}
                                <div className="p-4 rounded-2xl bg-black border border-white/10 font-mono text-xs space-y-3">
                                    <div className="flex items-center gap-2 text-gray-500 border-b border-white/5 pb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                        <span className="text-[10px] text-gray-600 ml-1">natural_language_ingestion.ai</span>
                                    </div>

                                    <div className="text-green-400">
                                        <span className="text-gray-500">&gt; </span>"I bought 1kg potatoes, half kg paneer, and 1 bunch coriander"
                                    </div>

                                    <div className="space-y-1.5 pt-2 text-gray-300 border-t border-white/5 font-sans">
                                        <div className="flex items-center justify-between text-xs bg-white/[0.03] px-2.5 py-1.5 rounded-lg">
                                            <span>🥔 Potatoes</span>
                                            <span className="text-emerald-400 font-mono text-[11px]">1 kg &middot; 30d shelf life</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs bg-white/[0.03] px-2.5 py-1.5 rounded-lg">
                                            <span>🧀 Paneer</span>
                                            <span className="text-amber-400 font-mono text-[11px]">500 g &middot; 5d shelf life</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs bg-white/[0.03] px-2.5 py-1.5 rounded-lg">
                                            <span>🌿 Coriander</span>
                                            <span className="text-amber-400 font-mono text-[11px]">1 bunch &middot; 4d shelf life</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-6 text-xs text-gray-500 font-light">
                                Automatically accounts for Indian climatic shelf-life differences.
                            </p>
                        </div>

                        {/* BENTO CARD 4: Impact & Savings Metrics (6 Cols) */}
                        <div ref={statsRef} className="lg:col-span-6 bg-zinc-950/80 border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                                        <TrendingUp size={16} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Household Impact</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                    Tangible numbers. Real savings.
                                </h3>
                                <p className="text-sm text-gray-400 font-light mb-6">
                                    Average verified statistics from our active zero-waste homes:
                                </p>

                                {/* 3 Big Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                        <div className="text-2xl sm:text-3xl font-black text-green-400 mb-1">
                                            ₹{statsInView ? <CountUp end={2850} duration={2.5} separator="," /> : '2,850'}
                                        </div>
                                        <span className="text-[11px] text-gray-400 font-light block leading-tight">Monthly Money Saved</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                        <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">
                                            {statsInView ? <CountUp end={14} duration={2} /> : '14'} kg
                                        </div>
                                        <span className="text-[11px] text-gray-400 font-light block leading-tight">Food Kept from Landfill</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                        <div className="text-2xl sm:text-3xl font-black text-teal-400 mb-1">
                                            {statsInView ? <CountUp end={35} duration={2.5} /> : '35'} kg
                                        </div>
                                        <span className="text-[11px] text-gray-400 font-light block leading-tight">CO₂ Equivalent Prevented</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                <span>Based on standard Indian urban food waste metrics</span>
                                <Link to="/analytics" className="text-green-400 hover:text-green-300 font-medium">
                                    View Full Impact &rarr;
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* =========================================================================
                3. BENTO GRID ARCHITECTURE SHOWCASE
               ========================================================================= */}
            <section className="relative border-t border-white/[0.08] bg-black">
                <FUIBentoGridDark />
            </section>

            {/* =========================================================================
                4. BEFORE VS. AFTER (The Emotional & Financial Contrast)
               ========================================================================= */}
            <section className="py-24 sm:py-32 relative bg-zinc-950 border-t border-white/[0.08]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full mb-4 inline-block">
                            The Paradigm Shift
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                            Why typical kitchens throw out ₹35,000 every year.
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base font-light">
                            Food waste isn't laziness — it's an information problem. Here is how WasteLess fixes it:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        
                        {/* THE OLD WAY (CHAOS) */}
                        <div className="p-8 sm:p-10 rounded-[2rem] bg-black/60 border border-red-500/20 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                            
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-6 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg">
                                    Without WasteLess
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">The Sunday Fridge Purge</h3>
                                
                                <ul className="space-y-4 text-sm text-gray-400 font-light">
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-400 font-bold mt-0.5">&times;</span>
                                        <span>Vegetables decay inside opaque plastic bags at the back of the crisper drawer.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-400 font-bold mt-0.5">&times;</span>
                                        <span>You buy curd or tomatoes at the store, only to discover you already had two at home.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-400 font-bold mt-0.5">&times;</span>
                                        <span>7:00 PM exhaustion: "There is nothing to eat," so you order expensive takeout instead.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-400 font-bold mt-0.5">&times;</span>
                                        <span>Guiltily scraping spoiled paneer and limp spinach directly into the compost bin.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-red-500/10 flex items-center justify-between text-xs font-semibold text-red-400/80">
                                <span>Annual loss</span>
                                <span className="font-mono text-base">~ ₹30,000 - ₹40,000</span>
                            </div>
                        </div>

                        {/* THE WASTLESS WAY */}
                        <div className="p-8 sm:p-10 rounded-[2rem] bg-gradient-to-b from-green-950/20 to-black/80 border border-green-500/30 relative overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-400 mb-6 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg">
                                    With WasteLess OS
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">The Autonomous Kitchen</h3>

                                <ul className="space-y-4 text-sm text-gray-300 font-light">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Smart alerts 48 hours before ingredients cross their natural expiration date.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>AI generates recipes matching 100% of your expiring ingredients with 1 tap.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Traditional preservation advice tells you exactly how to double shelf-life.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Missing ingredients from recipes seamlessly transfer to your smart shopping list.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-green-500/20 flex items-center justify-between text-xs font-semibold text-green-400">
                                <span>Zero-Waste Rate</span>
                                <span className="font-mono text-base text-white font-black">94.8% Average</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* =========================================================================
                4. REFINED CALL TO ACTION (Production Craft)
               ========================================================================= */}
            <section className="py-24 sm:py-32 relative overflow-hidden bg-black">
                {/* Background Ring Lighting */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-teal-500/20 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="p-10 sm:p-16 rounded-[3rem] bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                        
                        <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <Leaf size={24} strokeWidth={2.5} />
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
                            Start conquering kitchen waste <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-serif italic font-normal">
                                this evening.
                            </span>
                        </h2>

                        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed mb-10">
                            Join conscious home cooks across India saving money and saving food. Free forever for household use.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:from-green-300 hover:to-emerald-400 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                Create Free Account <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors uppercase tracking-wide"
                            >
                                Sign In
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-500 font-light">
                            <span>No credit card required</span>
                            <span>&middot;</span>
                            <span>Instant web app access</span>
                            <span>&middot;</span>
                            <span>Secure & private</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
