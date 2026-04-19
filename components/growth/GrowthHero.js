'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function GrowthHero({ onScrollToPlans, config, adaptedLabel }) {
    const terms = config.terms || {};

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
            {/* Animated Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full animate-pulse" />
            
            <div className="relative z-10 max-w-4xl text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mb-4"
                >
                    <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        {terms.strategyLabel} 2026
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic tracking-tight leading-[1.1] md:leading-[1.0]"
                >
                    {terms.heroTitle} <span className="inline-block pb-2 px-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 uppercase">{terms.heroGradient}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg md:text-2xl font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed"
                >
                    No se trata solo de publicar. <span className="text-white">Construimos un {terms.protocolLabel.toLowerCase()}</span> que atrae, posiciona y convierte {terms.customerLabel.toLowerCase()}.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8"
                >
                    <button 
                        onClick={() => window.open('https://wa.me/5491100000000', '_blank')}
                        className="group relative px-8 py-5 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    >
                        <MessageCircle className="w-5 h-5" />
                        {terms.ctaLabel}
                    </button>
                    
                    <button 
                        onClick={onScrollToPlans}
                        className="group px-8 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                    >
                        <Rocket className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
                        Ver planes
                    </button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Scroll</span>
                <ChevronDown className="w-5 h-5 text-gray-700" />
            </motion.div>
        </section>
    );
}
