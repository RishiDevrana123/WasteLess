import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Package, AlertTriangle, CheckCircle, XCircle, Trash2, Edit2, Apple, Carrot, Leaf, Wheat, X, ChefHat, Info } from 'lucide-react';
import { inventoryAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Pantry() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [editingItem, setEditingItem] = useState(null);
    const [aiStorageAdvice, setAiStorageAdvice] = useState(null);
    const queryClient = useQueryClient();
    const containerRef = useRef(null);

    // Parallax setup for background elements
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const yAbstract1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const yAbstract2 = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const rotateAbstract = useTransform(scrollYProgress, [0, 1], [0, 180]);

    const { data: inventoryData, isLoading } = useQuery({
        queryKey: ['inventory', filterStatus],
        queryFn: () => inventoryAPI.getAll(filterStatus !== 'all' ? { status: filterStatus } : {}),
        placeholderData: { data: { data: [] } }
    });

    const items = inventoryData?.data?.data || [];

    const deleteMutation = useMutation({
        mutationFn: inventoryAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['inventory']);
            toast.success('Ingredient removed from Pantry');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => inventoryAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['inventory']);
            toast.success('Ingredient updated successfully');
            setEditingItem(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update ingredient');
        }
    });

    const getStorageAdviceMutation = useMutation({
        mutationFn: aiAPI.getStorageAdvice,
        onSuccess: (data) => {
            setAiStorageAdvice(data.data.data.advice);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to get Storage Advice');
        }
    });

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        if (!editingItem) return;

        updateMutation.mutate({
            id: editingItem._id,
            data: {
                name: editingItem.name,
                category: editingItem.category,
                quantity: editingItem.quantity,
                status: editingItem.status,
                expiryDate: editingItem.expiryDate,
            }
        });
    };

    const getStatusInfo = (status) => {
        const statuses = {
            fresh: { color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', icon: CheckCircle, label: 'Fresh' },
            'expiring-soon': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle, label: 'Expiring Soon' },
            expired: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle, label: 'Expired' },
            consumed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle, label: 'Consumed' },
        };
        return statuses[status] || statuses.fresh;
    };

    const getCategoryIcon = (category) => {
        const cats = {
            vegetables: <Carrot size={18} strokeWidth={1.5} />,
            fruits: <Apple size={18} strokeWidth={1.5} />,
            grains: <Wheat size={18} strokeWidth={1.5} />,
            default: <Package size={18} strokeWidth={1.5} />
        };
        return cats[category] || cats.default;
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white pb-24 pt-12 relative overflow-hidden">

            {/* Parallax Background Elements */}
            <motion.div style={{ y: yAbstract1, rotate: rotateAbstract }} className="absolute -top-40 -left-20 text-green-500/[0.04] pointer-events-none z-0">
                <Leaf size={700} strokeWidth={0.5} />
            </motion.div>
            <motion.div style={{ y: yAbstract2, rotate: rotateAbstract }} className="absolute top-[50%] -right-40 text-green-500/[0.04] pointer-events-none z-0">
                <Carrot size={800} strokeWidth={0.5} className="-rotate-45" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-10"
                >
                    <div className="relative">
                        <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-5 block flex items-center gap-2">
                            <Package size={14} /> Inventory Management
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-2">
                            Your Kitchen <br /><span className="text-gray-500 italic font-medium">Pantry.</span>
                        </h1>
                    </div>

                    <div className="flex flex-col items-end gap-6 text-right">
                        <p className="text-gray-400 max-w-md text-sm leading-relaxed hidden md:block font-light">
                            Keep track of fresh ingredients, monitor expiration dates, and minimize food waste beautifully.
                        </p>
                        <Link
                            to="/scanner"
                            className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2"
                        >
                            <Plus size={18} strokeWidth={2.5} /> Add Ingredients
                        </Link>
                    </div>
                </motion.div>

                {/* Filters & Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-5 mb-12 bg-white/[0.02] p-4 rounded-[2rem] border border-white/5 backdrop-blur-md relative z-20"
                >
                    <div className="relative flex-grow group">
                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search ingredients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-zinc-950/50 border border-white/10 rounded-[1.5rem] text-white placeholder-gray-600 focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 outline-none transition-all shadow-sm font-medium"
                        />
                    </div>
                    <div className="relative min-w-[240px] group">
                        <Filter className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors z-10" size={20} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-14 pr-10 py-4 bg-zinc-950/50 border border-white/10 rounded-[1.5rem] text-white focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 outline-none transition-all shadow-sm font-bold appearance-none cursor-pointer relative"
                        >
                            <option value="all" className="bg-zinc-900 text-white">All Ingredients</option>
                            <option value="fresh" className="bg-zinc-900 text-white">Fresh Only</option>
                            <option value="expiring-soon" className="bg-zinc-900 text-white">Expiring Soon</option>
                            <option value="expired" className="bg-zinc-900 text-white">Expired</option>
                        </select>
                        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50 text-gray-400">
                            ▼
                        </div>
                    </div>
                </motion.div>

                {/* Items Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-32">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-green-500 rounded-full animate-spin shadow-xl"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-sm border-dashed"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Apple size={36} className="text-gray-500" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Pantry is empty</h3>
                        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">Stock up on fresh ingredients to start creating culinary masterpieces.</p>
                        <Link to="/scanner" className="bg-green-500/10 text-green-400 px-6 py-2.5 rounded-xl font-bold hover:bg-green-500/20 transition-colors text-sm tracking-wide border border-green-500/20">
                            Add First Item
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {filteredItems.map((item, index) => {
                            const dynamicStatus = (() => {
                                if (item.status === 'consumed') return 'consumed';
                                if (!item.expiryDate) return item.status;

                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const exp = new Date(item.expiryDate);
                                exp.setHours(0, 0, 0, 0);

                                const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                if (diffDays < 0) return 'expired';
                                if (diffDays <= 3) return 'expiring-soon';
                                return 'fresh';
                            })();

                            const status = getStatusInfo(dynamicStatus);
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: (index % 10) * 0.05, ease: "easeOut" }}
                                    className="group bg-[#111] rounded-[1.5rem] border border-white/5 hover:border-white/10 hover:bg-[#151515] hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden"
                                >
                                    {/* Item Image with Gradient Overlay */}
                                    {item.image && (
                                        <div className="absolute top-0 left-0 w-full h-32 z-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]"></div>
                                        </div>
                                    )}

                                    {/* Hover Decorator */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 rounded-tr-[1.5rem] rounded-bl-[100%] transition-opacity duration-500 pointer-events-none z-0"></div>

                                    <div className="p-6 flex flex-col h-full relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-white/10 p-2.5 rounded-xl text-gray-400 group-hover:text-white group-hover:bg-white/20 transition-colors shadow-sm">
                                                {getCategoryIcon(item.category)}
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${status.bg} ${status.color} ${status.border} border shadow-sm`}>
                                                <StatusIcon size={12} strokeWidth={2.5} />
                                                {status.label}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1 tracking-tight transition-colors truncate">{item.name}</h3>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-4">{item.category}</p>

                                        <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center text-[12px]">
                                                <span className="text-gray-500 font-light">Quantity</span>
                                                <span className="text-gray-300 font-medium bg-white/5 px-2 py-1 rounded-lg">{item.quantity.value} {item.quantity.unit}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[12px]">
                                                <span className="text-gray-500 font-light">Expires</span>
                                                <span className={`font-medium ${item.expiryDate && new Date(item.expiryDate) < new Date() ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded-lg' : 'text-gray-300 bg-white/5 px-2 py-1 rounded-lg'}`}>
                                                    {item.expiryDate ? format(new Date(item.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons overlay that appears on hover - Clean Circular Dock */}
                                        {/* Action Buttons overlay that appears on hover - Clean Circular Dock */}
                                        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20 rounded-b-[1.5rem] pt-16">
                                            <button
                                                onClick={() => {
                                                    toast.loading(`Asking AI how to store ${item.name}...`, { id: 'ai-storage' });
                                                    getStorageAdviceMutation.mutate({ itemName: item.name }, {
                                                        onSuccess: () => toast.dismiss('ai-storage'),
                                                        onError: () => toast.dismiss('ai-storage')
                                                    });
                                                }}
                                                className="group/btn relative w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:scale-110 transition-all shadow-lg"
                                            >
                                                <span className="absolute -top-10 left-0 bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 border border-white/10 pointer-events-none whitespace-nowrap shadow-xl">AI Store Tips</span>
                                                <Info size={14} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => updateMutation.mutate({ id: item._id, data: { status: 'consumed' } })}
                                                className="group/btn relative w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all shadow-lg"
                                            >
                                                <span className="absolute -top-10 left-1 bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 border border-white/10 pointer-events-none whitespace-nowrap shadow-xl">Mark Consumed</span>
                                                <CheckCircle size={14} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => updateMutation.mutate({ id: item._id, data: { status: 'expired' } })}
                                                className="group/btn relative w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-white hover:scale-110 transition-all shadow-lg"
                                            >
                                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 border border-white/10 pointer-events-none whitespace-nowrap shadow-xl">Mark Expired</span>
                                                <AlertTriangle size={14} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="group/btn relative w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all shadow-lg"
                                            >
                                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 border border-white/10 pointer-events-none whitespace-nowrap shadow-xl">Edit Item</span>
                                                <Edit2 size={14} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => deleteMutation.mutate(item._id)}
                                                className="group/btn relative w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white hover:scale-110 transition-all shadow-lg"
                                            >
                                                <span className="absolute -top-10 right-0 bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 border border-white/10 pointer-events-none whitespace-nowrap shadow-xl">Delete</span>
                                                <Trash2 size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setEditingItem(null)}
                    ></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit2 size={18} className="text-green-500" /> Edit Ingredient
                            </h2>
                            <button
                                onClick={() => setEditingItem(null)}
                                className="text-gray-500 hover:text-white transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="input bg-white/[0.02]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                                    <select
                                        value={editingItem.category}
                                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                        className="input bg-white/[0.02] appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="vegetables" className="bg-black">Vegetables</option>
                                        <option value="fruits" className="bg-black">Fruits</option>
                                        <option value="dairy" className="bg-black">Dairy</option>
                                        <option value="meat" className="bg-black">Meat</option>
                                        <option value="grains" className="bg-black">Grains</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
                                    <select
                                        value={editingItem.status}
                                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                                        className="input bg-white/[0.02] appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="fresh" className="bg-black">Fresh</option>
                                        <option value="expiring-soon" className="bg-black">Expiring Soon</option>
                                        <option value="expired" className="bg-black text-red-400">Expired</option>
                                        <option value="consumed" className="bg-black text-blue-400">Consumed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Quantity</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={editingItem.quantity.value}
                                            onChange={(e) => setEditingItem({ ...editingItem, quantity: { ...editingItem.quantity, value: parseFloat(e.target.value) } })}
                                            className="input bg-white/[0.02] w-2/3"
                                        />
                                        <select
                                            value={editingItem.quantity.unit}
                                            onChange={(e) => setEditingItem({ ...editingItem, quantity: { ...editingItem.quantity, unit: e.target.value } })}
                                            className="input bg-white/[0.02] w-1/3 px-2 appearance-none text-center cursor-pointer"
                                        >
                                            <option value="kg" className="bg-black">kg</option>
                                            <option value="g" className="bg-black">g</option>
                                            <option value="l" className="bg-black">l</option>
                                            <option value="ml" className="bg-black">ml</option>
                                            <option value="items" className="bg-black">items</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={editingItem.expiryDate ? new Date(editingItem.expiryDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                                        className="input bg-white/[0.02] invert-[1] hue-rotate-180 brightness-110 contrast-90"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all text-sm border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-lg shadow-green-600/20 hover:shadow-green-500/40 text-sm border border-green-500/40 disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* AI Storage Advice Modal */}
            {aiStorageAdvice && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setAiStorageAdvice(null)}
                    ></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl"
                    >
                        <button
                            onClick={() => setAiStorageAdvice(null)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">
                            <Info size={16} /> AI Storage Expert
                        </div>

                        <h3 className="text-xl font-bold text-white mb-6">Traditional Indian Preservation</h3>
                        <p className="text-gray-300 leading-relaxed font-light whitespace-pre-line text-sm border-t border-white/10 pt-4">
                            {aiStorageAdvice}
                        </p>

                        <button
                            onClick={() => setAiStorageAdvice(null)}
                            className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all shadow-inner text-sm"
                        >
                            Got It
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
