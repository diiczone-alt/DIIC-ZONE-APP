'use client';

import { TrendingUp, Activity, CheckCircle2, ArrowRight, Zap, Layers, Sparkles } from 'lucide-react';

export default function DashboardProfile({ userLevel = 1 }) {

    // Dynamic Configuration based on Level
    const LEVEL_CONFIG = {
        1: { title: "Ecosistema Digital Activo", badge: "Flujo Operativo", color: "emerald", message: "Sincronización de activos y métricas en tiempo real." },
        2: { title: "Arquitectura de Crecimiento", badge: "Optimización", color: "amber", message: "Calibrando vectores de conversión y alcance." },
        3: { title: "Dominio de Mercado", badge: "Escalabilidad", color: "blue", message: "Expansión de nodos de audiencia y retención." },
        4: { title: "Automatización Integral", badge: "Autonomía", color: "purple", message: "Sistemas auto-gestión en máxima eficiencia." },
        5: { title: "Liderazgo de Industria", badge: "Autoridad", color: "indigo", message: "Referente absoluto en cuota de mercado digital." },
    };

    const config = LEVEL_CONFIG[userLevel] || LEVEL_CONFIG[1];

    // Color Maps for Badges/Glows
    const colorStyles = {
        emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
        amber: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
        blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20' },
    };

    const style = colorStyles[config.color];

    return (
        <div className="mb-8">
            {/* Greeting Section */}
            <div className="mb-8 pl-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Panel de Control</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Carlos.</span>
                </h1>
                <p className="text-gray-400 mt-2 max-w-xl">
                    Bienvenido de nuevo a tu <span className="text-white font-bold">Zona Creativa</span>. Aquí tienes el pulso de tu ecosistema digital en tiempo real.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* HERO CARD: SYSTEM HEALTH (Purple Gradient) */}
                <div className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white p-8 md:p-12 shadow-2xl shadow-indigo-900/30 group">
                    {/* Background Noise/Texture */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-50" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-4">
                                <Sparkles className="w-3 h-3" /> Ecosistema Activo
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-2">
                                {config.title}
                            </h2>
                            <p className="text-white/80 font-medium max-w-md text-lg">
                                {config.message}
                            </p>

                            <div className="mt-8 flex items-center gap-4">
                                <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm uppercase tracking-wide hover:shadow-lg hover:scale-105 transition-all">
                                    Ver Métricas
                                </button>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-indigo-800 flex items-center justify-center text-xs font-bold">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white/10 flex items-center justify-center text-xs font-bold backdrop-blur-md">
                                        +5
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Circular Progress Mock (CSS) */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <div className="absolute inset-0 rounded-full border-[12px] border-black/10" />
                            <svg className="w-full h-full rotate-[-90deg]">
                                <circle
                                    cx="96" cy="96" r="84"
                                    stroke="currentColor" strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray="527"
                                    strokeDashoffset="100" // 80% filled roughly
                                    className="text-white opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black">98%</span>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Salud</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDE CARDS: QUICK STATS */}
                <div className="lg:col-span-4 space-y-4">

                    {/* Stat Card 1: Blue/Dark */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Activity className="w-6 h-6" />
                            </div>
                            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">+12.5%</span>
                        </div>
                        <div className="text-3xl font-black text-white mb-1">2,450</div>
                        <div className="text-gray-500 text-sm font-medium">Interacciones Totales</div>

                        {/* Mini Graph Line */}
                        <div className="h-1 w-full bg-white/5 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[70%]" />
                        </div>
                    </div>

                    {/* Stat Card 2: Indigo/Dark */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">PENDIENTE</span>
                        </div>
                        <div className="text-3xl font-black text-white mb-1">3 Activos</div>
                        <div className="text-gray-500 text-sm font-medium">En Producción</div>

                        {/* Mini Graph Line */}
                        <div className="h-1 w-full bg-white/5 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 w-[40%]" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
