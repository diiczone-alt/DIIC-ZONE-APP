'use client';

import { motion } from 'framer-motion';
import { Sparkles, PenTool, Layout, Palette, Ruler, Layers, Grid } from 'lucide-react';

export default function DesignWelcome({ onStart }) {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#050511]">

            {/* Background: Geometric Studio Grid */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Technical Grid Overlay */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                {/* Ambient Color Floods */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">

                {/* Left: Creative Director Persona & Intro */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold tracking-[0.2em] text-gray-300 uppercase">DIIC ZONE • CREATIVE STUDIO</span>
                            </div>
                        </div>

                        {/* Hero Headline */}
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">
                            Hola, soy tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
                                Diseñador Gráfico.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-12 max-w-xl font-light leading-relaxed border-l-4 border-fuchsia-500/30 pl-6">
                            Aquí puedes CREAR, SOLICITAR y GESTIONAR todos tus diseños de forma profesional. <br />
                            <span className="text-white font-bold">¿Qué deseas diseñar hoy?</span>
                        </p>

                        <div className="grid sm:grid-cols-2 gap-5 mb-6">
                            {/* Card 1: AI */}
                            <button
                                onClick={() => onStart('ai')}
                                className="group relative overflow-hidden rounded-2xl bg-[#0E0E18] border border-white/10 hover:border-fuchsia-500/50 transition-all duration-500 text-left p-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-6 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform border border-fuchsia-500/20">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div className="px-2 py-0.5 rounded bg-fuchsia-500/20 border border-fuchsia-500/30 text-[10px] text-fuchsia-300 font-bold uppercase">Rápido</div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-fuchsia-400 transition-colors">Crear diseño con IA</h3>
                                        <p className="text-xs text-gray-500 font-mono">GENERAR • AUTOMÁTICO • INSTANTÁNEO</p>
                                    </div>
                                </div>
                            </button>

                            {/* Card 2: Professional */}
                            <button
                                onClick={() => onStart('selection')}
                                className="group relative overflow-hidden rounded-2xl bg-[#0E0E18] border border-white/10 hover:border-indigo-500/50 transition-all duration-500 text-left p-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-6 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-500/20">
                                            <PenTool className="w-6 h-6" />
                                        </div>
                                        <Layers className="w-4 h-4 text-indigo-500/50" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Encargar a Profesional</h3>
                                        <p className="text-xs text-gray-500 font-mono">PERSONALIZADO • EXPERTO • ALTA CALIDAD</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Secondary Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-sm font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors">
                                <Layout className="w-4 h-4" /> Explorar Plantillas
                            </button>
                            <button className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-sm font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors">
                                <Grid className="w-4 h-4" /> Ver Proyectos
                            </button>
                        </div>
                    </motion.div>

                    {/* Footer Stats / Credentials */}
                    <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
                        <div>
                            <div className="text-2xl font-black text-white">RGB<span className="text-sm text-gray-500 font-normal">/CMYK</span></div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Color Space</div>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div>
                            <div className="text-2xl font-black text-white">300<span className="text-sm text-gray-500 font-normal">DPI</span></div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Print Ready</div>
                        </div>
                        <div className="ml-auto flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050511] bg-gray-800 flex items-center justify-center">
                                    <Palette className="w-4 h-4 text-gray-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Technical Motif (Visual System) */}
                <div className="hidden lg:block lg:col-span-5 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative z-10 perspective-[1000px]"
                    >
                        {/* Golden Ratio / Grid Concept */}
                        <div className="relative w-full aspect-[4/5] max-w-sm mx-auto bg-[#0E0E18] rounded-2xl border border-white/10 shadow-2xl p-6 overflow-hidden group">

                            {/* Inner Grid Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                            {/* Floating Elements (Layers) */}
                            <div className="absolute top-10 left-10 w-32 h-32 bg-fuchsia-500 rounded-full blur-[60px] opacity-40 animate-pulse"></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-40 animate-pulse"></div>

                            {/* Color Swatches */}
                            <div className="absolute top-6 right-6 flex flex-col gap-2">
                                {['#a855f7', '#ec4899', '#6366f1'].map((c, i) => (
                                    <div key={i} className="w-8 h-8 rounded-lg shadow-lg" style={{ backgroundColor: c }}></div>
                                ))}
                            </div>

                            {/* Center Visual */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute -inset-4 border border-white/20 rounded-full animate-[spin_20s_linear_infinite] border-dashed"></div>
                                    <div className="w-32 h-32 bg-gradient-to-br from-fuchsia-600 to-indigo-600 rounded-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700 shadow-2xl flex items-center justify-center">
                                        <Layout className="w-12 h-12 text-white" />
                                    </div>
                                    {/* Measurement Specs */}
                                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-500 rotate-90">1080px</div>
                                    <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-[9px] font-mono text-gray-500">1080px</div>
                                </div>
                            </div>

                            {/* Toolkit Toolbar */}
                            <div className="absolute bottom-6 left-6 right-6 p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex justify-between">
                                <Grid className="w-5 h-5 text-gray-400" />
                                <Ruler className="w-5 h-5 text-gray-400" />
                                <Layers className="w-5 h-5 text-gray-400" />
                                <div className="w-px h-full bg-white/10"></div>
                                <div className="text-xs font-bold text-white pt-0.5">Vector Mode</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
