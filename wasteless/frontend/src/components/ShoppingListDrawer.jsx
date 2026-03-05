import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, ShoppingCart, Trash2, PackagePlus, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingAPI, inventoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'beverages', 'snacks', 'other'];
const UNITS = ['kg', 'g', 'l', 'ml', 'pieces', 'packets'];

export default function ShoppingListDrawer({ isOpen, onClose, recipeId, recipeName }) {
    const queryClient = useQueryClient();

    const [isPantryModalOpen, setIsPantryModalOpen] = useState(false);
    const [pantryForms, setPantryForms] = useState({});
    const [itemsToClearParams, setItemsToClearParams] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['shopping-list'],
        queryFn: () => shoppingAPI.getAll(),
        enabled: isOpen,
    });

    const markAsPurchasedMutation = useMutation({
        mutationFn: (id) => shoppingAPI.markAsPurchased(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
        },
        onError: () => toast.error('Failed to update item')
    });

    const clearListMutation = useMutation({
        mutationFn: (params) => shoppingAPI.clearList(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
            toast.success('Shopping list cleared');
            if (isPantryModalOpen) setIsPantryModalOpen(false);
        }
    });

    const addToPantryMutation = useMutation({
        mutationFn: async (itemsPayload) => {
            const promises = itemsPayload.map(item => inventoryAPI.create(item));
            return Promise.all(promises);
        },
        onSuccess: () => {
            toast.success('Items correctly added to Pantry!');
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            // Proceed to clear list
            clearListMutation.mutate(itemsToClearParams);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to add items to pantry');
        }
    });

    const handleMarkPurchased = (id) => {
        markAsPurchasedMutation.mutate(id);
    };

    const allItems = data?.data?.data || [];
    const displayItems = recipeId
        ? allItems.filter(item => item.recipeId == recipeId)
        : allItems;

    const purchasedItems = displayItems.filter(i => i.isPurchased);

    const triggerPantryFlow = (clearParams) => {
        if (purchasedItems.length > 0) {
            const initialForms = {};
            purchasedItems.forEach(item => {
                initialForms[item._id] = {
                    category: 'other',
                    quantityValue: 1,
                    quantityUnit: 'pieces',
                    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 1 week
                };
            });
            setPantryForms(initialForms);
            setItemsToClearParams(clearParams);
            setIsPantryModalOpen(true);
        } else {
            clearListMutation.mutate(clearParams);
        }
    };

    const handleClearPurchased = () => {
        const params = { purchasedOnly: 'true' };
        if (recipeId) params.recipeId = recipeId;
        triggerPantryFlow(params);
    };

    const handleClearAll = () => {
        const params = {};
        if (recipeId) params.recipeId = recipeId;
        triggerPantryFlow(params);
    };

    const handlePantryFormChange = (itemId, field, value) => {
        setPantryForms(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    const handleConfirmPantry = () => {
        const payload = purchasedItems.map(item => {
            const form = pantryForms[item._id];
            return {
                name: item.name,
                category: form.category,
                quantity: {
                    value: Number(form.quantityValue),
                    unit: form.quantityUnit
                },
                expiryDate: form.expiryDate,
                storage: 'pantry'
            };
        });
        addToPantryMutation.mutate(payload);
    };

    const handleSkipPantry = () => {
        clearListMutation.mutate(itemsToClearParams);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isPantryModalOpen && onClose()}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-zinc-950/90 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-40 flex flex-col backdrop-blur-xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                                        <ShoppingCart size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Shopping List</h2>
                                        {recipeName && (
                                            <p className="text-xs text-gray-400 font-medium">For {recipeName}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                {isLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : displayItems.length === 0 ? (
                                    <div className="text-center py-20">
                                        <ShoppingCart size={48} className="mx-auto text-white/10 mb-4" />
                                        <p className="text-gray-400 font-light">No items in your list yet.</p>
                                    </div>
                                ) : (
                                    <motion.div
                                        className="space-y-3"
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                        }}
                                    >
                                        <AnimatePresence>
                                            {displayItems.map((item) => (
                                                <motion.div
                                                    layout
                                                    key={item._id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                                    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${item.isPurchased
                                                        ? 'bg-white/[0.02] border-white/5 opacity-60'
                                                        : 'bg-zinc-900/50 border-white/10 hover:border-green-500/50 hover:bg-zinc-800 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleMarkPurchased(item._id)}
                                                            className={`transition-colors flex-shrink-0 ${item.isPurchased ? 'text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] rounded-full' : 'text-gray-500 hover:text-green-400'}`}
                                                            disabled={markAsPurchasedMutation.isPending}
                                                        >
                                                            {item.isPurchased ? <CheckCircle2 size={24} /> : <Circle size={24} strokeWidth={1.5} />}
                                                        </motion.button>
                                                        <span className={`text-sm font-medium transition-all ${item.isPurchased ? 'text-gray-500 line-through decoration-gray-600 decoration-2' : 'text-white group-hover:text-green-50'}`}>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    {!recipeName && item.recipeName && (
                                                        <span className="text-[10px] bg-white/5 text-gray-400 px-2.5 py-1.5 rounded-lg max-w-[120px] truncate border border-white/5">
                                                            {item.recipeName}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            {displayItems.length > 0 && (
                                <div className="p-6 border-t border-white/5 bg-zinc-950 flex flex-col gap-3 relative z-10">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleClearPurchased}
                                        disabled={clearListMutation.isPending}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-yellow-500 font-bold text-sm transition-colors border-2 border-yellow-500/20 hover:bg-yellow-500/10 hover:border-yellow-500/40"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                        Clear Purchased Items
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleClearAll}
                                        disabled={clearListMutation.isPending}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-red-500 font-bold text-sm transition-colors bg-red-500/10 hover:bg-red-500/20 border-2 border-transparent"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                        Clear Entire List
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Pantry Import Modal */}
            <AnimatePresence>
                {isPantryModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex items-start justify-between bg-zinc-950">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                                        <PackagePlus className="text-green-500" size={24} />
                                        Move to Pantry?
                                    </h3>
                                    <p className="text-sm text-gray-400 font-light">
                                        You are clearing {purchasedItems.length} purchased item(s). Save them directly to your inventory.
                                    </p>
                                </div>
                                <button onClick={() => setIsPantryModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6 bg-zinc-900/50">
                                {purchasedItems.map(item => (
                                    <div key={item._id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                                        <div className="flex font-semibold text-green-400 items-center gap-2 text-lg">
                                            <CheckCircle2 size={18} /> {item.name}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</label>
                                                <select
                                                    value={pantryForms[item._id]?.category || 'other'}
                                                    onChange={(e) => handlePantryFormChange(item._id, 'category', e.target.value)}
                                                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                                                >
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Quantity</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        min="0.1"
                                                        step="0.1"
                                                        value={pantryForms[item._id]?.quantityValue || ''}
                                                        onChange={(e) => handlePantryFormChange(item._id, 'quantityValue', e.target.value)}
                                                        className="w-1/2 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                                                    />
                                                    <select
                                                        value={pantryForms[item._id]?.quantityUnit || 'pieces'}
                                                        onChange={(e) => handlePantryFormChange(item._id, 'quantityUnit', e.target.value)}
                                                        className="w-1/2 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                                                    >
                                                        {UNITS.map(u => (
                                                            <option key={u} value={u}>{u}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-span-2 space-y-1.5">
                                                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <Calendar size={12} /> Expiry Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={pantryForms[item._id]?.expiryDate || ''}
                                                    onChange={(e) => handlePantryFormChange(item._id, 'expiryDate', e.target.value)}
                                                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-zinc-950 flex justify-end gap-3">
                                <button
                                    onClick={handleSkipPantry}
                                    disabled={clearListMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl font-medium text-sm text-red-400 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                >
                                    Skip & Just Clear
                                </button>
                                <button
                                    onClick={handleConfirmPantry}
                                    disabled={addToPantryMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all"
                                >
                                    {addToPantryMutation.isPending ? 'Saving...' : 'Save to Pantry & Clear'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
