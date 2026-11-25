import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, Leaf, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
    const { register: registerAuth, loading } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
    });

    const passwordValue = watch('password', '');

    const onSubmit = async (data) => {
        try {
            await registerAuth({
                name: data.name,
                email: data.email,
                password: data.password
            });
            toast.success('Account created successfully! Welcome to WasteLess.');
            navigate('/pantry');
        } catch (error) {
            const errData = error.response?.data;
            const message =
                errData?.error ||
                (errData?.errors?.length ? errData.errors.map(e => e.msg).join(', ') : null) ||
                'Registration failed. Please check your information and try again.';
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center relative overflow-hidden selection:bg-green-500/30">
            {/* Ambient Lighting Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] right-[-10%] w-[650px] h-[650px] bg-green-500/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[650px] h-[650px] bg-emerald-500/10 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            </div>

            <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex items-center justify-center">
                <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column: Brand Showcase (Desktop) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-4"
                    >
                        <div>
                            {/* Logo Pill */}
                            <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
                                <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-105 transition-transform duration-300">
                                    <Leaf size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-xl font-black tracking-tight text-white">
                                    Waste<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Less</span>
                                    <span className="text-green-500">.</span>
                                </span>
                            </Link>

                            <h1 className="text-5xl font-black tracking-tight text-white leading-[1.1] mb-6">
                                Start saving food, money, and time <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-serif italic font-normal">from day one.</span>
                            </h1>

                            <p className="text-gray-400 text-base font-light leading-relaxed mb-10 max-w-md">
                                Join thousands of conscious households using intelligent shelf-life tracking and AI culinary creativity to eliminate kitchen food waste.
                            </p>

                            {/* Trust Metrics */}
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-2xl font-black text-green-400 mb-1">₹2,500+</div>
                                    <div className="text-xs text-gray-400 font-light">Avg. monthly household grocery savings</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-2xl font-black text-emerald-400 mb-1">12.5 kg</div>
                                    <div className="text-xs text-gray-400 font-light">Food waste prevented per month</div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-12 flex items-center gap-3 text-xs text-gray-500">
                            <ShieldCheck size={16} className="text-green-400" />
                            <span>Encrypted sessions &middot; Private pantry data &middot; Cancel anytime</span>
                        </div>
                    </motion.div>

                    {/* Right Column: Modern Registration Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="w-full lg:col-span-6 max-w-md mx-auto"
                    >
                        <div className="bg-zinc-950/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-black relative">
                            
                            {/* Card Header */}
                            <div className="mb-7">
                                <div className="lg:hidden mb-6 flex items-center justify-between">
                                    <Link to="/" className="inline-flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                                            <Leaf size={14} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-black text-white text-lg">WasteLess.</span>
                                    </Link>
                                    <Link to="/" className="text-xs text-gray-500 hover:text-white transition-colors">
                                        Back to home &rarr;
                                    </Link>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                                    Create account
                                </h2>
                                <p className="text-sm text-gray-400 font-light">
                                    Set up your pantry and start tracking freshness.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                
                                {/* Name Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors pointer-events-none" size={17} />
                                        <input
                                            {...register('name', { required: 'Name is required' })}
                                            type="text"
                                            autoComplete="name"
                                            className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/40 transition-all font-medium"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-red-400 text-xs font-medium pl-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors pointer-events-none" size={17} />
                                        <input
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Please enter a valid email address'
                                                }
                                            })}
                                            type="email"
                                            autoComplete="email"
                                            className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/40 transition-all font-medium"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-xs font-medium pl-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors pointer-events-none" size={17} />
                                        <input
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                            })}
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/40 transition-all font-medium"
                                            placeholder="Minimum 6 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-xs font-medium pl-1">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                        Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors pointer-events-none" size={17} />
                                        <input
                                            {...register('confirmPassword', {
                                                required: 'Please confirm your password',
                                                validate: value => value === passwordValue || 'Passwords do not match'
                                            })}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/40 transition-all font-medium"
                                            placeholder="Re-enter password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-400 text-xs font-medium pl-1">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-3 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:from-green-300 hover:to-emerald-400 transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.25)] hover:shadow-[0_0_35px_rgba(34,197,94,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 tracking-wide uppercase"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Create Account <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Switch to Sign In */}
                            <div className="mt-7 pt-5 border-t border-white/[0.08] text-center">
                                <p className="text-sm text-gray-400 font-light">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors underline-offset-4 hover:underline">
                                        Sign in instead
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
