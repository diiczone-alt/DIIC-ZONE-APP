'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Instagram, Youtube, Users, ShoppingCart, Award, ArrowRight, Video } from 'lucide-react';

export default function EditorIA_Config({ onContinue }) {

    // CONFIG STATE
    const [config, setConfig] = useState({
        format: null,   // 'REEL', 'STORY', 'POST', 'YOUTUBE'
        goal: null,     // 'SALES', 'AUTHORITY', 'ENGAGEMENT'
        style: null     // 'DYNAMIC', 'CORPORATE', 'MINIMAL'
    });

    const isReady = config.format && config.goal && config.style;

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col justify-center">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-2">Estrategia del Video</h2>
                <p className="text-gray-400">Define el formato y el objetivo para que la IA estructure tu edición.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* 1. FORMATO */}
                <div className="space-y-4">
                    <StepTitle number="01" title="Formato" />
                    <div className="space-y-3">
                        <SelectionCard
                            icon={Instagram}
                            label="Reel / TikTok (9:16)"
                            active={config.format === 'REEL'}
                            onClick={() => setConfig({ ...config, format: 'REEL' })}
                        />
                        <SelectionCard
                            icon={Smartphone}
                            label="Historia (9:16)"
                            active={config.format === 'STORY'}
                            onClick={() => setConfig({ ...config, format: 'STORY' })}
                        />
                        <SelectionCard
                            icon={Video}
                            label="Post Feed (4:5)"
                            active={config.format === 'POST'}
                            onClick={() => setConfig({ ...config, format: 'POST' })}
                        />
                        <SelectionCard
                            icon={Youtube}
                            label="YouTube (16:9)"
                            active={config.format === 'YOUTUBE'}
                            onClick={() => setConfig({ ...config, format: 'YOUTUBE' })}
                        />
                    </div>
                </div>

                {/* 2. OBJETIVO */}
                <div className="space-y-4">
                    <StepTitle number="02" title="Objetivo" />
                    <div className="space-y-3">
                        <SelectionCard
                            icon={ShoppingCart}
                            label="Ventas / Conversión"
                            desc="Gancho fuerte + CTA directo"
                            active={config.goal === 'SALES'}
                            onClick={() => setConfig({ ...config, goal: 'SALES' })}
                        />
                        <SelectionCard
                            icon={Award}
                            label="Autoridad / Marca"
                            desc="Narrativa profesional y limpia"
                            active={config.goal === 'AUTHORITY'}
                            onClick={() => setConfig({ ...config, goal: 'AUTHORITY' })}
                        />
                        <SelectionCard
                            icon={Users}
                            label="Engagement / Viral"
                            desc="Ritmo rápido y tendencias"
                            active={config.goal === 'ENGAGEMENT'}
                            onClick={() => setConfig({ ...config, goal: 'ENGAGEMENT' })}
                        />
                    </div>
                </div>

                {/* 3. ESTILO */}
                <div className="space-y-4">
                    <StepTitle number="03" title="Estilo Visual" />
                    <div className="grid grid-cols-2 gap-3">
                        <StyleCard
                            label="Dinámico"
                            color="from-yellow-400 to-orange-500"
                            active={config.style === 'DYNAMIC'}
                            onClick={() => setConfig({ ...config, style: 'DYNAMIC' })}
                        />
                        <StyleCard
                            label="Corporativo"
                            color="from-blue-400 to-indigo-500"
                            active={config.style === 'CORPORATE'}
                            onClick={() => setConfig({ ...config, style: 'CORPORATE' })}
                        />
                        <StyleCard
                            label="Cinemático"
                            color="from-purple-400 to-pink-500"
                            active={config.style === 'CINEMATIC'}
                            onClick={() => setConfig({ ...config, style: 'CINEMATIC' })}
                        />
                        <StyleCard
                            label="Minimalista"
                            color="from-gray-200 to-white"
                            active={config.style === 'MINIMAL'}
                            onClick={() => setConfig({ ...config, style: 'MINIMAL' })}
                        />
                    </div>
                </div>
            </div>

            {/* CONTINUE BUTTON */}
            <div className="mt-12 flex justify-center">
                <button
                    onClick={() => onContinue(config)}
                    disabled={!isReady}
                    className={`px-12 py-4 rounded-xl font-black uppercase tracking-widest text-lg flex items-center gap-3 transition-all
                        ${isReady
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30 hover:scale-105'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}
                >
                    Continuar a Carga <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

function StepTitle({ number, title }) {
    return (
        <div className="flex items-baseline gap-3 border-b border-white/10 pb-2">
            <span className="text-2xl font-black text-white/20">{number}</span>
            <span className="text-lg font-bold text-white uppercase tracking-wide">{title}</span>
        </div>
    );
}

function SelectionCard({ icon: Icon, label, desc, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 group
                ${active
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-900/20'
                    : 'bg-[#0A0A12] border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5'}`}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                 ${active ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-500 group-hover:bg-white/10'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className={`font-bold ${active ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                {desc && <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{desc}</div>}
            </div>
        </div>
    );
}

function StyleCard({ label, color, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`relative h-24 rounded-xl border cursor-pointer overflow-hidden group transition-all
                ${active ? 'border-white ring-2 ring-cyan-500 ring-offset-2 ring-offset-[#050511]' : 'border-white/10 hover:border-white/30'}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-40 transition-opacity`} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-bold uppercase tracking-wider text-xs ${active ? 'text-white scale-110' : 'text-gray-400'}`}>
                    {label}
                </span>
            </div>
        </div>
    );
}
