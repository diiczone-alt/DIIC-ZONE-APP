'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Share2, Megaphone, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PULSE_DATA = [
    {
        id: 'finance',
        label: 'ROI Actual',
        value: '4.2x',
        sub: '+0.5 vs mes anterior',
        icon: TrendingUp,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        link: '/dashboard/finance'
    },
    {
        id: 'campaigns',
        label: 'Top Campaña',
        value: 'Verano 24',
        sub: 'ROAS: 4.5x • 1.2k Leads',
        icon: Megaphone,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        link: '/dashboard/campaigns'
    },
    {
        id: 'connect',
        label: 'Conectividad',
        value: '98% Salud',
        sub: '3 Flujos Activos',
        icon: Share2,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        link: '/dashboard/connect'
    }
];

export default function GrowthPulseWidget() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % PULSE_DATA.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const current = PULSE_DATA[index];

    return (
        <div className="h-full rounded-2xl bg-[#0E0E18] border border-white/5 relative overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Growth Pulse</h3>
                <div className="flex gap-1">
                    {PULSE_DATA.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-center relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        <div className={`w-10 h-10 rounded-xl ${current.bg} flex items-center justify-center mb-2`}>
                            <current.icon className={`w-5 h-5 ${current.color}`} />
                        </div>
                        <p className="text-sm text-gray-400">{current.label}</p>
                        <h2 className="text-3xl font-black text-white tracking-tight">{current.value}</h2>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${current.color}`}>{current.sub}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Action */}
            <Link href={current.link} className="p-3 bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center group">
                <span className="text-xs font-bold text-gray-300 group-hover:text-white">Ver Detalles</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
            </Link>
        </div>
    );
}
