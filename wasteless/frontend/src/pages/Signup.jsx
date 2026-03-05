import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, UserPlus, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
    const { register: registerAuth, loading } = useAuthStore();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            await registerAuth({ name: data.name, email: data.email, password: data.password });
            toast.success('Account created successfully!');
            navigate('/pantry');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center p-4 relative overflow-hidden py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20 rotate-3 hover:rotate-6 transition-transform">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Join WasteLess and conquer food waste</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs ml-1 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    type="email"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs ml-1 font-medium">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    type="password"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-xs ml-1 font-medium">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    type="password"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-xs ml-1 font-medium">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-black rounded-xl uppercase tracking-widest text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/10">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-green-400 hover:text-green-300 font-bold transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
