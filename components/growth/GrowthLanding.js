'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import GrowthHero from './GrowthHero';
import GrowthProblem from './GrowthProblem';
import GrowthSolution from './GrowthSolution';
import GrowthProcess from './GrowthProcess';
import GrowthLevels from './GrowthLevels';
import GrowthPricing from './GrowthPricing';
import GrowthUpsell from './GrowthUpsell';
import GrowthFinalCTA from './GrowthFinalCTA';

export default function GrowthLanding() {
    const pricingRef = useRef(null);

    const scrollToPlans = () => {
        pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white selection:bg-cyan-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10">
                <GrowthHero onScrollToPlans={scrollToPlans} />
                
                <div className="max-w-7xl mx-auto px-6 space-y-32 py-20 pb-40">
                    <GrowthProblem />
                    <GrowthSolution />
                    <GrowthProcess />
                    <GrowthLevels />
                    
                    <div ref={pricingRef} className="scroll-mt-20">
                        <GrowthPricing />
                    </div>
                    
                    <GrowthUpsell />
                    
                    {/* Aclaración Section */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="py-12 border-y border-white/5 text-center"
                    >
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            La pauta publicitaria no está incluida. Se define según objetivos del cliente.
                        </p>
                    </motion.div>

                    <GrowthFinalCTA />
                </div>
            </div>

            {/* Footer Phrase */}
            <div className="py-20 text-center border-t border-white/5 opacity-50">
                <p className="text-2xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                    “Esto ya no es una página… es tu vendedor digital.”
                </p>
            </div>
        </div>
    );
}
