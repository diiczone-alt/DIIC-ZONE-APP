'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, TrendingUp, DollarSign, Zap, Target,
    Share2, ArrowRight, Brain, UserCheck
} from 'lucide-react';

export default function AnalyticsWelcome({ onStart }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-[#0A0A12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                {/* Background FX */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 p-8 md:p-12">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            <Brain className="w-3 h-3 text-purple-400" /> Centro de Inteligencia
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Analíticas en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">tiempo real</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                            Hola, soy tu asistente de analíticas. Dime qué quieres revisar hoy y te muestro los datos clave con recomendaciones estratégicas.
                        </p>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        <OptionCard
                            icon={TrendingUp} color="blue"
                            title="Crecimiento Digital"
                            subtitle="Seguidores, alcance, comunidad"
                        />
                        <OptionCard
                            icon={Target} color="purple"
                            title="Impacto del Contenido"
                            subtitle="Qué piezas generan negocio"
                        />
                        <OptionCard
                            icon={DollarSign} color="green"
                            title="Ventas & Conversiones"
                            subtitle="Ingresos reales generados"
                        />
                        <OptionCard
                            icon={Zap} color="amber"
                            title="Automatización"
                            subtitle="Nivel de eficiencia IA"
                        />
                        <OptionCard
                            icon={Share2} color="pink"
                            title="Publicidad & Retorno"
                            subtitle="Ads vs ROI (ROAS)"
                        />
                        <OptionCard
                            icon={BarChart3} color="cyan"
                            title="Eficiencia Producción"
                            subtitle="Flujo creativo y tiempos"
                        />
                    </div>

                    {/* Footer Action */}
                    <div className="flex justify-center">
                        <button
                            onClick={onStart}
                            className="group relative px-8 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-white/10"
                        >
                            Ver Panel Estratégico General
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                            {/* Shiny Overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-shine pointer-events-none" />
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}

function OptionCard({ icon: Icon, color, title, subtitle }) {
    const colors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50',
        green: 'text-green-400 bg-green-500/10 border-green-500/20 group-hover:border-green-500/50',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/50',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20 group-hover:border-pink-500/50',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/50',
    };

    return (
        <button className={`group text-left p-6 rounded-2xl border transition-all hover:bg-white/5 ${colors[color].split(' group')[0]} border-white/5`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                {title}
            </h3>
            <p className="text-sm text-gray-400 font-light group-hover:text-gray-300">
                {subtitle}
            </p>
        </button>
    );
}
