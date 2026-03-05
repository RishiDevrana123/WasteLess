import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChefHat, Clock, Sparkles, Flame, Check, ArrowRight, ShoppingCart, List, Coffee, UtensilsCrossed, Leaf, X } from 'lucide-react';
import { recipeAPI, shoppingAPI, userAPI } from '../services/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';
import ShoppingListDrawer from '../components/ShoppingListDrawer';

export default function Recipes() {
    const queryClient = useQueryClient();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerRecipeProps, setDrawerRecipeProps] = useState({ id: null, name: null });
    const [customPrompt, setCustomPrompt] = useState('');
    const [customRecipes, setCustomRecipes] = useState(null);
    const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const yAbstract1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const yAbstract2 = useTransform(scrollYProgress, [0, 1], [0, 400]);
    const rotateAbstract = useTransform(scrollYProgress, [0, 1], [0, 120]);

    const { data, isLoading } = useQuery({
        queryKey: ['recipes'],
        queryFn: () => recipeAPI.getSuggestions({ limit: 10 }),
        placeholderData: { data: { data: [] } }
    });

    const { data: shoppingData } = useQuery({
        queryKey: ['shopping-list'],
        queryFn: () => shoppingAPI.getAll(),
    });

    const shoppingList = shoppingData?.data?.data || [];
    const purchasedItemNames = new Set(
        shoppingList.filter(item => item.isPurchased).map(item => item.name.toLowerCase())
    );

    const addToListMutation = useMutation({
        mutationFn: (data) => shoppingAPI.addItems(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
            toast.success('Added missing ingredients to shopping list!');
            setIsDrawerOpen(true);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to add items to list')
    });

    const handleAddToList = (recipe) => {
        if (!recipe.missingIngredients?.length) return;
        setDrawerRecipeProps({ id: recipe.id, name: recipe.name });
        addToListMutation.mutate({
            items: recipe.missingIngredients,
            recipeId: recipe.id,
            recipeName: recipe.name
        });
    };

    const handleOpenDrawer = (recipe = null) => {
        if (recipe) {
            setDrawerRecipeProps({ id: recipe.id, name: recipe.name });
        } else {
            setDrawerRecipeProps({ id: null, name: null });
        }
        setIsDrawerOpen(true);
    };

    const recordRecipeMutation = useMutation({
        mutationFn: (title) => userAPI.recordCookedRecipe({ title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });

    const handleViewRecipe = (recipe) => {
        recordRecipeMutation.mutate(recipe.name);
    };

    const customMutation = useMutation({
        mutationFn: (data) => recipeAPI.getCustomSuggestions(data),
        onSuccess: (response) => {
            setCustomRecipes(response.data.data);
            setCustomPrompt('');
            toast.success('Generated custom recipes!');
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to generate custom recipes')
    });

    const recipes = customRecipes || data?.data?.data || [];

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white pb-24 pt-12 relative overflow-hidden selection:bg-green-500/30">
            {/* Dark Parallax Food Elements */}
            <motion.div style={{ y: yAbstract1, rotate: rotateAbstract }} className="absolute -top-32 -right-32 text-green-500/[0.04] pointer-events-none z-0">
                <Coffee size={600} strokeWidth={0.5} />
            </motion.div>
            <motion.div style={{ y: yAbstract2 }} className="absolute top-[40%] -left-64 text-green-500/[0.04] pointer-events-none z-0">
                <Leaf size={800} strokeWidth={0.5} className="rotate-45" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header (Dark Elegant) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col md:flex-row justify-between items-end mb-10 gap-8"
                >
                    <div className="relative">
                        <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-5 block flex items-center gap-2">
                            <UtensilsCrossed size={14} /> Chef's Recommendation
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-2">
                            Culinary <br /><span className="text-gray-500 italic font-medium">Inspirations.</span>
                        </h1>
                    </div>

                    <p className="text-gray-400 max-w-sm text-sm leading-relaxed text-right hidden md:block font-light">
                        Discover vibrant, delicious recipes tailored precisely to your kitchen inventory. Cook smart, eat beautifully, and reduce waste.
                    </p>
                </motion.div>

                {/* --- Custom AI Recipe Prompt --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-16 border-b border-white/10 pb-12 max-w-4xl"
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!customPrompt.trim()) {
                                setCustomRecipes(null);
                                return;
                            }
                            customMutation.mutate({ prompt: customPrompt });
                        }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/[0.05] to-emerald-500/0 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="relative">
                            <Sparkles size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-green-500/50 group-focus-within:text-green-400 transition-colors" strokeWidth={1.5} />
                            <input
                                type="text"
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="Describe your perfect meal... e.g. A high-protein vegan dinner without onions"
                                className="w-full bg-[#111] backdrop-blur-3xl border border-white/10 rounded-[3rem] py-7 pl-20 pr-44 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 hover:border-white/20 transition-all font-light shadow-2xl"
                            />
                            <button
                                type="submit"
                                disabled={customMutation.isPending || !customPrompt.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-green-400 text-black px-8 py-5 rounded-[2.5rem] font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(74,222,128,0.3)] hover:scale-105"
                            >
                                {customMutation.isPending ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : (
                                    <>
                                        Generate
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    <div className="flex justify-between items-center mt-6 px-4">
                        <p className="text-gray-500 text-xs tracking-wider flex items-center gap-2 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            AI WILL AUTO-INCLUDE YOUR PANTRY INGREDIENTS
                        </p>
                        {customRecipes && (
                            <button onClick={() => setCustomRecipes(null)} className="text-gray-400 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-1.5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5">
                                <X size={12} /> Clear Results
                            </button>
                        )}
                    </div>
                </motion.div>

                {isLoading || customMutation.isPending ? (
                    <div className="flex justify-center py-32">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-green-500 rounded-full animate-spin shadow-xl"></div>
                    </div>
                ) : recipes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl border-dashed shadow-xl"
                    >
                        <ChefHat size={56} className="mx-auto text-white/20 mb-6" strokeWidth={1} />
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No recipes matching</h3>
                        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
                            Add fresh ingredients to your pantry to unlock personalized culinary magic.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map((recipe, index) => {
                            const purchasedFromMissing = (recipe.missingIngredients || []).filter(ing =>
                                purchasedItemNames.has(ing.toLowerCase())
                            );
                            const actualMissing = (recipe.missingIngredients || []).filter(ing =>
                                !purchasedItemNames.has(ing.toLowerCase())
                            );
                            const actualAvailable = [...(recipe.availableIngredients || []), ...purchasedFromMissing];

                            return (
                                <motion.div
                                    key={recipe.id || index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                                    className="group bg-[#111] rounded-[1.5rem] p-5 border border-white/5 hover:border-green-500/30 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] transition-all duration-500 flex flex-col h-full relative overflow-hidden"
                                >
                                    {/* Subtle hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/0 via-white/0 to-green-500/0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"></div>

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center gap-1.5 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border border-green-500/20">
                                            <Sparkles size={12} className="text-green-400" />
                                            {recipe.matchPercentage}% Match
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                                            <ChefHat size={18} strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300 tracking-tight leading-snug relative z-10">
                                        {recipe.name}
                                    </h3>

                                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-widest relative z-10">
                                        <span className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                                            <Clock size={12} className="text-gray-400" />
                                            {recipe.cookingTime} MIN
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                                            <Flame size={12} className="text-red-400" />
                                            {recipe.difficulty}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 text-xs mb-5 line-clamp-2 font-light leading-relaxed flex-grow relative z-10">
                                        {recipe.description}
                                    </p>

                                    <div className="space-y-4 pt-4 border-t border-white/10 relative z-10">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                In Your Pantry
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {actualAvailable.slice(0, 5).map((ing, i) => (
                                                    <span key={i} className="text-gray-300 bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] font-medium">
                                                        {ing}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {actualMissing.length > 0 ? (
                                            <div>
                                                <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2 mt-4">
                                                    Need to Buy
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {actualMissing.slice(0, 5).map((ing, i) => (
                                                        <span key={`missing-${i}`} className="text-red-300 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md text-[10px] font-medium">
                                                            {ing}
                                                        </span>
                                                    ))}
                                                    {actualMissing.length > 5 && (
                                                        <span className="text-gray-500 text-[10px] py-1 italic">+{actualMissing.length - 5} more</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 w-full">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={(e) => { e.preventDefault(); handleOpenDrawer(recipe); }}
                                                        className="w-1/2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 text-white font-bold text-[11px] transition-all tracking-wide"
                                                    >
                                                        <List size={14} strokeWidth={2.5} />
                                                        View List
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={(e) => { e.preventDefault(); handleAddToList(recipe); }}
                                                        disabled={addToListMutation.isPending}
                                                        className="w-1/2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold text-[11px] transition-all tracking-wide shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:opacity-50"
                                                    >
                                                        <ShoppingCart size={14} strokeWidth={2.5} />
                                                        Add Items
                                                    </motion.button>
                                                </div>
                                            </div>
                                        ) : purchasedFromMissing.length > 0 ? (
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl py-4 px-4 flex flex-col items-center justify-center text-center mt-4">
                                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                                                    <Check size={20} className="text-green-500" strokeWidth={3} />
                                                </div>
                                                <p className="text-[11px] text-green-400 font-bold uppercase tracking-widest mb-1.5">Ready to Cook</p>
                                                <p className="text-xs text-gray-400 mb-4 leading-relaxed font-light px-2">
                                                    You've gathered all ingredients. Let's start cooking!
                                                </p>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={(e) => { e.preventDefault(); handleOpenDrawer(recipe); }}
                                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 border border-green-500/30 text-green-400 font-bold text-[11px] transition-all tracking-wide hover:bg-green-500/10"
                                                >
                                                    <List size={14} strokeWidth={2.5} />
                                                    Review Checklist
                                                </motion.button>
                                            </div>
                                        ) : null}

                                        {recipe.sourceUrl ? (
                                            <a
                                                href={recipe.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => handleViewRecipe(recipe)}
                                                className="w-full group/btn flex items-center justify-between text-xs font-bold text-white pt-4 mt-3 border-t border-white/5 border-dashed"
                                            >
                                                <span className="group-hover/btn:text-green-400 transition-colors duration-300">View Full Directions</span>
                                                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-green-500/20 group-hover/btn:text-green-400 transition-all duration-300 transform group-hover/btn:translate-x-1">
                                                    <ArrowRight size={12} strokeWidth={2.5} />
                                                </div>
                                            </a>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleViewRecipe(recipe);
                                                    setSelectedRecipeModal(recipe);
                                                }}
                                                className="w-full group/btn flex items-center justify-between text-xs font-bold text-white pt-4 mt-3 border-t border-white/5 border-dashed"
                                            >
                                                <span className="group-hover/btn:text-green-400 transition-colors duration-300">Read AI Recipe Steps</span>
                                                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-green-500/20 group-hover/btn:text-green-400 transition-all duration-300 transform group-hover/btn:translate-x-1">
                                                    <ArrowRight size={12} strokeWidth={2.5} />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Floating Global Shopping List Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => handleOpenDrawer(null)}
                className="fixed bottom-10 right-10 z-50 bg-gradient-to-tr from-emerald-500 to-green-600 border border-green-400 text-black p-5 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] flex items-center justify-center overflow-hidden group"
                title="View All Shopping Items"
            >
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <List size={26} strokeWidth={2.5} className="relative z-10" />
            </motion.button>

            <ShoppingListDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                recipeId={drawerRecipeProps.id}
                recipeName={drawerRecipeProps.name}
            />

            {/* AI Generated Recipe Instructions Modal */}
            {selectedRecipeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedRecipeModal(null)}
                    ></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl"
                    >
                        <button
                            onClick={() => setSelectedRecipeModal(null)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        <div className="flex items-center gap-2 text-green-500 font-bold uppercase tracking-widest text-xs mb-4">
                            <ChefHat size={16} /> Recipe Instructions
                        </div>

                        <h2 className="text-3xl font-extrabold text-white mb-6 pr-10">{selectedRecipeModal.name}</h2>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light pb-6 border-b border-white/10">{selectedRecipeModal.description}</p>

                        <div className="space-y-6">
                            {(selectedRecipeModal.instructions || []).map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-white/5 text-gray-300 flex items-center justify-center text-xs font-bold mt-0.5 border border-white/10">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed font-light">{step}</p>
                                </div>
                            ))}
                            {(!selectedRecipeModal.instructions || selectedRecipeModal.instructions.length === 0) && (
                                <p className="text-gray-500 italic">No specific steps were provided for this generative recipe.</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
