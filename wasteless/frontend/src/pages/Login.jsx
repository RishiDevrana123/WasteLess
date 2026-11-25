import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Leaf, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';

export default function Login() {
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [forgotModalOpen, setForgotModalOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            toast.success('Welcome back to WasteLess!');
            navigate('/pantry');
        } catch (error) {
            const errData = error.response?.data;
            const message =
                errData?.error ||
                (errData?.errors?.length ? errData.errors.map(e => e.msg).join(', ') : null) ||
                'Invalid email or password. Please try again.';
            toast.error(message);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error('Please enter your email address');
            return;
        }
        setForgotLoading(true);
        try {
            const res = await authAPI.forgotPassword(forgotEmail);
            toast.success(res.data?.message || 'Password reset link sent to your email!');
            setForgotModalOpen(false);
            setForgotEmail('');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send reset link');
        } finally {
            setForgotLoading(false);
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
                    
                    {/* Left Column: Brand Showcase & Value Proposition (Desktop) */}
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
                                Refined food management for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-serif italic font-normal">conscious home.</span>
                            </h1>

                            <p className="text-gray-400 text-base font-light leading-relaxed mb-10 max-w-md">
                                Intelligent inventory monitoring, chef-grade AI recipe suggestions, and automated expiry tracking in one cohesive ecosystem.
                            </p>

                            {/* Feature Bullets */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={13} strokeWidth={2.5} />
                                    </div>
                                    <span>Real-time expiration warnings before food spoils</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={13} strokeWidth={2.5} />
                                    </div>
                                    <span>Smart Indian-climate culinary preservation tips</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={13} strokeWidth={2.5} />
                                    </div>
                                    <span>AI recipes tuned directly to your kitchen pantry</span>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Quote Pill */}
                        <div className="mt-14 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                            <p className="text-xs text-gray-400 italic mb-3 leading-relaxed">
                                "WasteLess turned our chaotic kitchen inventory into a zero-spoilage haven in less than two weeks."
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-[10px] font-black text-black">
                                    R
                                </div>
                                <span className="text-xs font-semibold text-gray-300">Rishi &middot; Verified Home Chef</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Modern Sign In Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="w-full lg:col-span-6 max-w-md mx-auto"
                    >
                        <div className="bg-zinc-950/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-black relative">
                            
                            {/* Card Header */}
                            <div className="mb-8">
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
                                    Sign in
                                </h2>
                                <p className="text-sm text-gray-400 font-light">
                                    Enter your credentials to access your pantry and recipes.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-2">
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
                                            className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/40 transition-all font-medium"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-xs font-medium pl-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setForgotModalOpen(true)}
                                            className="text-xs text-gray-400 hover:text-green-400 transition-colors font-medium"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors pointer-events-none" size={17} />
                                        <input
                                            {...register('password', { required: 'Password is required' })}
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3.5 pl-11 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/40 transition-all font-medium"
                                            placeholder="••••••••"
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

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:from-green-300 hover:to-emerald-400 transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.25)] hover:shadow-[0_0_35px_rgba(34,197,94,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 tracking-wide uppercase"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Sign In <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Switch to Sign Up */}
                            <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
                                <p className="text-sm text-gray-400 font-light">
                                    New to WasteLess?{' '}
                                    <Link to="/signup" className="text-green-400 hover:text-green-300 font-semibold transition-colors underline-offset-4 hover:underline">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Forgot Password Modal */}
            {forgotModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
                        <p className="text-sm text-gray-400 font-light mb-6">
                            Enter your registered email address and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
                                required
                            />
                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setForgotModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-green-500 text-black hover:bg-green-400 transition-colors disabled:opacity-50"
                                >
                                    {forgotLoading ? 'Sending...' : 'Send Link'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
