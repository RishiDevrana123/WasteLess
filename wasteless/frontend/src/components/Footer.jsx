import { Link } from 'react-router-dom';
import { Heart, Mail, Github, Twitter, Linkedin, Facebook, Instagram, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 mt-auto relative z-10 text-white">
            {/* Background Glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <div className="relative flex items-center justify-center">
                                <Leaf className="text-green-500 transform -rotate-12 group-hover:rotate-12 transition-all duration-500" size={28} strokeWidth={2.5} />
                                <div className="absolute inset-0 bg-green-500/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white font-display">
                                Waste<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Less</span>
                                <span className="text-green-500">.</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            Empowering communities to fight food waste together. Save money, help the environment, and create a sustainable future for everyone.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-500 hover:border-green-500 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Donations', 'Recipes', 'Analytics', 'Pantry'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-green-500 transition-colors" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <span className="block text-white font-medium mb-0.5">Email Support</span>
                                    <span className="text-sm">hello@wasteless.app</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                                    <Heart size={18} />
                                </div>
                                <div>
                                    <span className="block text-white font-medium mb-0.5">Partner with NGOs</span>
                                    <span className="text-sm">partners@wasteless.app</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} WasteLess. Made with <Heart size={14} className="inline text-red-500 animate-pulse" /> for the planet.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
