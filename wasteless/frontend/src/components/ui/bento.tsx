"use client";
import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export default function FUIBentoGridDark() {
    return (
        <div className="py-24 container mx-auto flex flex-col px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest w-fit mb-4">
                Architecture
            </div>
            <h1 className="tracking-tight text-3xl sm:text-5xl lg:text-6xl font-black text-white">
                Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-serif italic font-normal">Zero Food Waste.</span>
            </h1>
            <p className="max-w-3xl text-lg sm:text-xl font-light tracking-tight mt-3 text-gray-400">
                A unified ecosystem that monitors expiry windows, suggests chef-grade recipes, and tracks real-world household impact.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
                <BentoCard
                    eyebrow="Pantry Radar"
                    title="Predictive Expiry Detection"
                    description="Algorithmic freshness tracking calculates precise shelf-life countdowns for Indian climates before food ever begins to spoil."
                    graphic={
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584473457406-624048518851?w=900&q=80')] bg-cover bg-center" />
                    }
                    className="max-lg:rounded-3xl lg:col-span-3 lg:rounded-tl-3xl"
                />
                <BentoCard
                    eyebrow="AI Culinary Engine"
                    title="Zero-Waste Recipe Matching"
                    description="Instantly turns whatever is currently expiring in your fridge into high-protein, homestyle Indian recipes with step-by-step instructions."
                    graphic={
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80')] bg-cover bg-center" />
                    }
                    className="max-lg:rounded-3xl lg:col-span-3 lg:rounded-tr-3xl"
                />
                <BentoCard
                    eyebrow="Speed"
                    title="Instant Grocery Ingestion"
                    description="Speak or paste your raw grocery haul text. WasteLess automatically parses items, quantities, and realistic shelf lives in milliseconds."
                    graphic={
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80')] bg-cover bg-center" />
                    }
                    className="max-lg:rounded-3xl lg:col-span-2 lg:rounded-bl-3xl"
                />
                <BentoCard
                    eyebrow="Preservation"
                    title="Traditional Storage Advice"
                    description="Access culinary preservation tips tailored for Indian households to maximize shelf-life across delicate produce and dairy."
                    graphic={
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=80')] bg-cover bg-center" />
                    }
                    className="max-lg:rounded-3xl lg:col-span-2"
                />
                <BentoCard
                    eyebrow="Sustainability"
                    title="Verified Environmental Impact"
                    description="Monitor real-time kilograms of food preserved, money saved, and CO₂ emissions prevented across your household."
                    graphic={
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80')] bg-cover bg-center" />
                    }
                    className="max-lg:rounded-3xl lg:col-span-2 lg:rounded-br-3xl"
                />
            </div>
        </div>
    );
}

export function BentoCard({
    dark = false,
    className = "",
    eyebrow,
    title,
    description,
    graphic,
    fade = [],
}: {
    dark?: boolean;
    className?: string;
    eyebrow: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
    graphic?: React.ReactNode;
    fade?: ("top" | "bottom")[];
}) {
    return (
        <motion.div
            initial="idle"
            whileHover="active"
            variants={{ idle: {}, active: {} }}
            data-dark={dark ? "true" : undefined}
            className={clsx(
                className,
                "group relative flex flex-col overflow-hidden rounded-2xl",
                "bg-zinc-950 border border-white/10 shadow-2xl ring-1 ring-white/5",
                "transition-all duration-500 hover:border-green-500/30 hover:shadow-[0_20px_50px_rgba(34,197,94,0.15)]"
            )}
        >
            <div className="relative h-[22rem] sm:h-[26rem] shrink-0 overflow-hidden">
                {graphic}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                {fade.includes("top") && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black to-50% opacity-40" />
                )}
                {fade.includes("bottom") && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-50% opacity-40" />
                )}
            </div>
            <div className="relative p-6 sm:p-8 z-20 isolate mt-[-100px] h-auto backdrop-blur-xl bg-black/70 border-t border-white/10 text-white rounded-b-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-green-400 block mb-1">
                    {eyebrow}
                </span>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-green-300 transition-colors">
                    {title}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}

