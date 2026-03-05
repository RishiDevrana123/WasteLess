import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, ScanLine, ArrowLeft, Barcode, RefreshCcw, CheckCircle, Sparkles, MessageSquareText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Webcam from "react-webcam";

export default function Scanner() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isScanning, setIsScanning] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('smart'); // 'smart' or 'manual'
    const [smartPrompt, setSmartPrompt] = useState('');
    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setIsScanning(false);
    }, [webcamRef]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const createMutation = useMutation({
        mutationFn: inventoryAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['inventory']);
            toast.success('Item added successfully');
            navigate('/pantry');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to add item');
        },
    });

    const smartMutation = useMutation({
        mutationFn: inventoryAPI.smartEntry,
        onSuccess: (res) => {
            queryClient.invalidateQueries(['inventory']);
            const count = res.data?.count || 0;
            if (count > 0) {
                toast.success(`Successfully added ${count} items!`);
                navigate('/pantry');
            } else {
                toast.error('Could not interpret any items. Please try again.');
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to process smart entry');
        }
    });

    const onSubmit = (data) => {
        createMutation.mutate({
            name: data.name,
            category: data.category,
            quantity: {
                value: parseFloat(data.quantityValue),
                unit: data.quantityUnit,
            },
            expiryDate: data.expiryDate,
            image: capturedImage || '',
        });
    };

    return (
        <div className="min-h-screen bg-black pb-20 pt-12">

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="mb-10 text-center">
                    <span className="text-green-500 font-bold tracking-widest uppercase text-xs mb-4 block">INVENTORY UPDATE</span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-2">
                        Scan & <span className="text-gray-500 italic font-medium font-serif">Track.</span>
                    </h1>
                    <button
                        onClick={() => navigate('/pantry')}
                        className="text-gray-500 text-sm hover:text-white transition-colors mt-4 flex items-center gap-2 mx-auto uppercase tracking-wide font-medium"
                    >
                        <ArrowLeft size={16} /> Return to Pantry
                    </button>
                </div>

                <div className="flex bg-[#111] p-1.5 rounded-2xl mb-6 shadow-xl border border-white/5 max-w-sm mx-auto relative z-10">
                    <button
                        onClick={() => setActiveTab('smart')}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'smart' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Sparkles size={16} /> AI Smart Log
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <ScanLine size={16} /> Manual / Cam
                    </button>
                </div>

                {activeTab === 'smart' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl p-8 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none blur-xl"></div>

                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-4 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                                <MessageSquareText size={32} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white text-center mb-1 tracking-tight">Tell AI what you bought.</h3>
                        <p className="text-gray-500 text-center text-sm font-light mb-8 max-w-md mx-auto">
                            Just type out your grocery haul naturally. Our AI will automatically categorize items and predict precise Indian-climate expiration dates.
                        </p>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!smartPrompt.trim()) return;
                                smartMutation.mutate({ prompt: smartPrompt });
                            }}
                            className="space-y-6 relative z-10"
                        >
                            <div className="relative">
                                <textarea
                                    value={smartPrompt}
                                    onChange={(e) => setSmartPrompt(e.target.value)}
                                    placeholder='e.g., "I just bought half a kg of paneer, 2 liters of full cream milk, a dozen eggs, and a bunch of coriander."'
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 hover:border-white/20 transition-all font-light shadow-inner min-h-[140px] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={smartMutation.isPending || !smartPrompt.trim()}
                                className="w-full py-5 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-black rounded-xl uppercase tracking-widest text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {smartMutation.isPending ? 'Analyzing Haul & Predicting Expirations...' : 'Auto-Generate Pantry Items'}
                                {!smartMutation.isPending && <Sparkles size={18} />}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                        {/* Scanner Section */}
                        <div className="bg-neutral-900 border-b border-white/5 p-8 text-center relative group min-h-[300px] flex flex-col items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 w-full max-w-md mx-auto">
                                {!isScanning && !capturedImage && (
                                    <>
                                        <motion.div
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-green-500/30 group-hover:text-green-400 transition-colors"
                                        >
                                            <Camera size={32} strokeWidth={1.5} />
                                        </motion.div>

                                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Camera Feed</h3>
                                        <p className="text-gray-500 font-light mb-8 max-w-sm mx-auto text-sm">
                                            Take a picture of your food to instantly attach it to the pantry item card.
                                        </p>

                                        <button
                                            onClick={() => setIsScanning(true)}
                                            type="button"
                                            className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/20 text-sm tracking-wide uppercase"
                                        >
                                            Activate Camera
                                        </button>
                                    </>
                                )}

                                {isScanning && (
                                    <div className="space-y-4">
                                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center">
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="w-full h-full object-cover"
                                                videoConstraints={{ facingMode: "environment" }}
                                            />
                                            {/* Scanner UI overlay */}
                                            <div className="absolute inset-0 pointer-events-none border-2 border-white/10 m-4 rounded-xl">
                                                <motion.div animate={{ y: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-full h-0.5 bg-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.8)] absolute top-0" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setIsScanning(false)}
                                                className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all font-bold text-xs uppercase"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={capture}
                                                className="px-6 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] font-black text-xs uppercase"
                                            >
                                                Capture Photo
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {capturedImage && !isScanning && (
                                    <div className="space-y-4">
                                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-green-500/30">
                                            <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
                                            <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg backdrop-blur-md flex items-center gap-1">
                                                <CheckCircle size={10} /> Saved
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCapturedImage(null);
                                                setIsScanning(true);
                                            }}
                                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all font-bold text-xs uppercase mx-auto"
                                        >
                                            <RefreshCcw size={14} /> Retake Photo
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Manual Entry Form */}
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-white/5 flex-1" />
                                <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Manual Entry</span>
                                <div className="h-px bg-white/5 flex-1" />
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Item Name</label>
                                        <input
                                            {...register('name', { required: 'Name is required' })}
                                            className="input bg-white/[0.02]"
                                            placeholder="e.g. Organic Tomatoes"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                                        <select
                                            {...register('category', { required: true })}
                                            className="input bg-white/[0.02] appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-black text-gray-400">Select</option>
                                            <option value="vegetables" className="bg-black">Vegetables</option>
                                            <option value="fruits" className="bg-black">Fruits</option>
                                            <option value="dairy" className="bg-black">Dairy</option>
                                            <option value="meat" className="bg-black">Meat</option>
                                            <option value="grains" className="bg-black">Grains</option>
                                            <option value="spices" className="bg-black">Spices</option>
                                            <option value="beverages" className="bg-black">Beverages</option>
                                            <option value="snacks" className="bg-black">Snacks</option>
                                            <option value="other" className="bg-black">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Quantity</label>
                                                <input
                                                    {...register('quantityValue', { required: true })}
                                                    type="number" step="0.01"
                                                    className="input bg-white/[0.02]"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Unit</label>
                                                <select
                                                    {...register('quantityUnit', { required: true })}
                                                    className="input bg-white/[0.02] appearance-none px-2 text-center cursor-pointer"
                                                >
                                                    <option value="kg" className="bg-black">kg</option>
                                                    <option value="g" className="bg-black">g</option>
                                                    <option value="l" className="bg-black">l</option>
                                                    <option value="pieces" className="bg-black">pcs</option>
                                                    <option value="packets" className="bg-black">pkts</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Expires</label>
                                            <input
                                                {...register('expiryDate', { required: true })}
                                                type="date"
                                                className="input bg-white/[0.02] [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="w-full btn btn-primary mt-4"
                                >
                                    {createMutation.isPending ? 'Processing...' : 'Add Item'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
