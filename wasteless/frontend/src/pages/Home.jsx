import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Leaf, TrendingDown, Users, Award, ArrowRight, Sparkles, Package, Heart, ChefHat, Globe, Shield, ShoppingBag, BarChart3, CloudLightning, Check, Globe2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { useRef } from 'react';
import SplashParallax from '../components/SplashParallax';

/* --- Components --- */



function FeatureCard({ icon: Icon, title, description, delay }) {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.5 }}
            className="card h-full flex flex-col group hover:border-green-500/30 p-8"
        >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-green-900/10 group-hover:shadow-green-500/20">
                <Icon size={22} strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-green-400 transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm flex-grow font-light">{description}</p>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-green-500 font-bold text-xs uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-all mt-auto w-full">
                Learn more <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
        </motion.div>
    );
}

/* --- Main Page --- */

export default function Home() {
    return (
        <div className="min-h-screen text-white">

            {/* 1. HERO SECTION (Inside Parallax) */}
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

            {/* 2. HOW IT WORKS SECTION */}
            <section className="py-24 relative border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-4 block">Workflow</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            How beautifully it <span className="text-gray-500 italic font-medium font-serif">works.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-6 shadow-xl text-green-400">
                                <span className="text-2xl font-black">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Add Groceries</h3>
                            <p className="text-gray-400 font-light text-sm max-w-xs">Use smart text prompts or manual entry to quickly add what you bought.</p>
                        </div>
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 rounded-full bg-[#111] border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.1)] text-green-400">
                                <span className="text-2xl font-black">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Get Notified</h3>
                            <p className="text-gray-400 font-light text-sm max-w-xs">AI monitors expiration windows and notifies you when food is about to go bad.</p>
                        </div>
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-6 shadow-xl text-green-400">
                                <span className="text-2xl font-black">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Cook AI Recipes</h3>
                            <p className="text-gray-400 font-light text-sm max-w-xs">Instantly generate recipes utilizing precisely the ingredients that need to be eaten.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURES GRID (Impeccable Layout) */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-4 block">Ecosystem</span>
                            <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                                Complete toolkit for <br /><span className="text-gray-500 italic font-medium font-serif">sustainable living.</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 max-w-sm text-sm leading-relaxed text-right md:text-left">
                            We've built a comprehensive suite of tools designed to help you minimize waste at every step of the consumption cycle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Package}
                            title="Smart Pantry"
                            description="AI-powered inventory tracking that alerts you before food expires, helping you cook what you have."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={ChefHat}
                            title="Intelligent Recipes"
                            description="Generate delicious recipes instantly based on ingredient availability and dietary preferences."
                            delay={0.2}
                        />


                        <FeatureCard
                            icon={BarChart3}
                            title="Impact Analytics"
                            description="Visualize your carbon footprint reduction and money saved with detailed dashboards."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Safety & Guidelines"
                            description="Access verified food safety standards and storage guidelines."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* 4. CALL TO ACTION (Redesigned) */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-neutral-900/50 backdrop-blur-xl rounded-[40px] p-12 md:p-20 text-center border border-white/5 relative overflow-hidden group shadow-2xl"
                    >
                        {/* Subtle Glows */}
                        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:bg-green-500 group-hover:text-black transition-all duration-500 text-green-500">
                                <Sparkles size={32} />
                            </div>

                            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                                Ready to join the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-serif italic font-medium">
                                    Revolution?
                                </span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-10 max-w-lg mx-auto font-light leading-relaxed">
                                Join thousands of individuals making a difference. Start your zero-waste journey today.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/signup" className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-green-400 hover:scale-105 transition-all shadow-xl shadow-white/5 hover:shadow-green-400/20 text-lg flex items-center justify-center gap-2">
                                    Create Account <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="px-10 py-4 bg-transparent hover:bg-white/5 text-white font-bold rounded-full border border-white/10 transition-all text-lg">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
