'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Bot, Layout, Globe, ArrowUpRight, X, Check, Zap, Target, Rocket } from 'lucide-react';

const ADDONS = [
    { 
        id: 'crm',
        title: "CRM (Gestión de Clientes)", 
        icon: Users, 
        color: "text-indigo-400",
        bg: "from-indigo-500/20 to-transparent",
        border: "border-indigo-500/30",
        glow: "shadow-[0_0_50px_rgba(99,102,241,0.2)]",
        description: "Centraliza tu base de datos y automatiza el seguimiento comercial para no perder ni una sola oportunidad de venta.",
        impact: "Aumento del 40% en retención y conversión de leads.",
        features: ["Base de datos inteligente", "Embudo de ventas visual", "Automatización de emails", "Reportes de rendimiento en tiempo real"]
    },
    { 
        id: 'bots',
        title: "Chatbots (Automatización)", 
        icon: Bot, 
        color: "text-emerald-400",
        bg: "from-emerald-500/20 to-transparent",
        border: "border-emerald-500/30",
        glow: "shadow-[0_0_50px_rgba(16,185,129,0.2)]",
        description: "Inteligencia Artificial atendiendo a tus clientes 24/7. Califica leads y cierra citas automáticamente.",
        impact: "Reducción del 60% en tiempo de respuesta inicial.",
        features: ["IA Conversacional Avanzada", "Integración con WhatsApp/IG", "Agendamiento automático", "Calificación de prospectos"]
    },
    { 
        id: 'landings',
        title: "Landing Pages", 
        icon: Layout, 
        color: "text-blue-400",
        bg: "from-blue-400/20 to-transparent",
        border: "border-blue-400/30",
        glow: "shadow-[0_0_50px_rgba(96,165,250,0.2)]",
        description: "Páginas de alta conversión diseñadas para una sola acción: capturar el contacto o vender un producto específico.",
        impact: "Incremento directo en el ROI de tus campañas de pago.",
        features: ["Diseño Mobile-First", "Optimización de velocidad (A+)", "Copywriting persuasivo", "Análisis de mapas de calor"]
    },
    { 
        id: 'web',
        title: "Sitios Web", 
        icon: Globe, 
        color: "text-purple-400",
        bg: "from-purple-500/20 to-transparent",
        border: "border-purple-500/30",
        glow: "shadow-[0_0_50_rgba(168,85,247,0.2)]",
        description: "Tu matriz de autoridad digital. Un ecosistema completo para posicionar tu marca como líder en la industria.",
        impact: "Consolidación total de autoridad y confianza de marca.",
        features: ["Arquitectura escalable", "Optimización SEO Pro", "Blog de contenidos", "Panel de administración intuitivo"]
    }
];

export default function GrowthUpsell() {
    const [selectedAddon, setSelectedAddon] = useState(null);

    return (
        <section className="relative py-20">
            <div className="space-y-16">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="space-y-4 text-center"
                >
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Escalamiento Avanzado
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tight leading-[1.1]">
                        LLEVA TU NEGOCIO AL <span className="inline-block px-1 text-indigo-500 italic">SIGUIENTE NIVEL</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest pt-2">
                        Estas herramientas permiten convertir más y optimizar procesos.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ADDONS.map((addon, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedAddon(addon)}
                            className="group p-8 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center text-center space-y-6 relative overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${addon.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            <div className={`relative z-10 w-16 h-16 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center ${addon.color} group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500`}>
                                <addon.icon className="w-8 h-8" />
                            </div>
                            <div className="relative z-10 space-y-2">
                                <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">
                                    {addon.title}
                                </h3>
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 group-hover:text-white transition-colors duration-300">
                                    Saber más <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Premium Upsell Modal */}
            <AnimatePresence>
                {selectedAddon && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-10 pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAddon(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-3xl pointer-events-auto"
                        />

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`relative w-full max-w-4xl bg-black rounded-[48px] border border-white/10 overflow-hidden pointer-events-auto shadow-2xl ${selectedAddon.glow}`}
                        >
                            {/* Animated Background Lights */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute -top-20 -right-20 w-80 h-80 ${selectedAddon.bg} blur-[100px] rounded-full z-0`} 
                            />

                            <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
                                {/* Compact Header */}
                                <div className="relative p-8 md:p-10 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
                                    <button 
                                        onClick={() => setSelectedAddon(null)}
                                        className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/10 group active:scale-90 z-20"
                                    >
                                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    </button>

                                    <div className={`shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-black border border-white/10 flex items-center justify-center ${selectedAddon.color} shadow-2xl`}>
                                        <selectedAddon.icon className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_currentColor]" />
                                    </div>
                                    <div className="space-y-2 flex-1 text-center md:text-left">
                                        <span className={`px-3 py-1 ${selectedAddon.bg} ${selectedAddon.color} border ${selectedAddon.border} rounded-full text-[9px] font-black uppercase tracking-[0.4em]`}>
                                            Advanced Solution
                                        </span>
                                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                                            {selectedAddon.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                        
                                        <div className="lg:col-span-7 space-y-10">
                                            <div className="space-y-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Service Briefing</h4>
                                                <p className="text-xl md:text-2xl text-gray-300 font-medium leading-[1.4] italic tracking-tight font-display">
                                                    "{selectedAddon.description}"
                                                </p>
                                            </div>

                                            <div className="space-y-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Core Features</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {selectedAddon.features.map((feature, i) => (
                                                        <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                                                            <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center bg-black border border-white/10 ${selectedAddon.color}`}>
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-5 space-y-8">
                                            <div className="p-8 rounded-[48px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 space-y-8 shadow-2xl relative overflow-hidden group/card shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                                                <div className={`absolute top-0 right-0 w-32 h-32 ${selectedAddon.bg} blur-[60px] rounded-full opacity-20`} />
                                                
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 text-center relative z-10">Strategic Impact</h4>
                                                
                                                <div className="space-y-6 relative z-10">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3 text-rose-500/80">
                                                            <Target className="w-4 h-4" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-none">Expected Result</span>
                                                        </div>
                                                        <div className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white leading-tight">
                                                            {selectedAddon.impact}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 relative z-10">
                                                    <button 
                                                        onClick={() => {
                                                            const message = encodeURIComponent(`Hola DIIC ZONE! 👋 Estoy interesado en activar el servicio de "${selectedAddon.title}" para mi negocio. Me gustaría recibir más información.`);
                                                            window.open(`https://wa.me/5491100000000?text=${message}`, '_blank');
                                                        }}
                                                        className={`w-full py-6 rounded-[28px] ${selectedAddon.bg} ${selectedAddon.color} border ${selectedAddon.border} font-black uppercase tracking-[0.4em] text-[10px] hover:brightness-125 transition-all shadow-2xl group active:scale-95`}
                                                    >
                                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                                            SOLICITAR ACTIVACIÓN
                                                            <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="px-10 py-5 rounded-[28px] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center gap-3">
                                                <Zap className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-emerald-500 italic">AVAILABLE FOR INSTANT DEPLOY</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
