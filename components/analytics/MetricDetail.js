'use client';

import { motion } from 'framer-motion';
import {
    X, Scan, Cpu, Radio, Network,
    Share2, MessageCircle, Heart, Eye
} from 'lucide-react';

export default function MetricDetail({ type, data, onClose }) {
    // Simulated "Scanning" phase
    const isScanning = false; // We can add state for this later if we want a delay

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0b0b14] w-[90%] max-w-5xl h-[85vh] rounded-3xl border border-white/10 overflow-hidden relative flex flex-col shadow-2xl shadow-blue-500/20"
            >
                {/* Robot HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-blue-500 rounded-tl-3xl" />
                    <div className="absolute bottom-8 right-8 w-32 h-32 border-r-2 border-b-2 border-blue-500 rounded-br-3xl" />
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/20" />
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-blue-500/20" />
                </div>

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0E0E18] z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-blue-500 tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                MODO ANÁLISIS NEURAL ACTIVO
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase">{data?.title || 'ANÁLISIS DE DATOS'}</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-red-500 hover:rotate-90 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative z-10">

                    {/* Simulated Analysis Text */}
                    <div className="mb-8 font-mono text-sm text-blue-400/80 leading-relaxed border-l-2 border-blue-500/50 pl-4 py-2 bg-blue-900/10">
                        {`>> INICIANDO ESCANEO PROFUNDO DE ${data?.title || 'SECTOR'}...\n>> CORRELACIONANDO DATOS DE RENDIMIENTO...\n>> DETECTANDO PATRONES DE CRECIMIENTO EXPONENCIAL.\n>> REPORTE LISTO.`}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Column 1: Core Metrics */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Scan className="w-4 h-4" /> Métricas Clave
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-gray-500 text-xs mb-1">Impacto Total</div>
                                    <div className="text-2xl font-black text-white">2.4M</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-gray-500 text-xs mb-1">Conversión</div>
                                    <div className="text-2xl font-black text-emerald-400">4.2%</div>
                                </div>
                            </div>

                            {/* Detailed List */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400 flex items-center gap-2"><Eye className="w-4 h-4" /> Vistas de Perfil</span>
                                        <span className="font-bold text-white">45.2k</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Interacciones</span>
                                        <span className="font-bold text-white">8.5k</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400 flex items-center gap-2"><Share2 className="w-4 h-4" /> Compartidos</span>
                                        <span className="font-bold text-white">1.2k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Visual Analysis */}
                        <div className="lg:col-span-2">
                            <div className="h-64 bg-gradient-to-b from-blue-500/10 to-transparent rounded-2xl border border-blue-500/20 relative overflow-hidden flex items-end px-8 pb-0 gap-2">
                                <div className="absolute top-4 left-4 text-xs font-bold text-blue-400">ACTIVIDAD NEURONAL (ÚLTIMAS 24H)</div>

                                {/* Bars */}
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: "10%" }}
                                        animate={{ height: `${Math.random() * 80 + 20}%` }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                                        className="flex-1 bg-blue-500/50 hover:bg-blue-400 transition-colors rounded-t-sm"
                                    />
                                ))}
                            </div>

                            <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="text-xs font-bold text-emerald-400 mb-2">Recomendación IA</div>
                                    <p className="text-sm text-white">"Aumentar frecuencia de posting a las 18:00hrs para maximizar engagement."</p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <div className="text-xs font-bold text-purple-400 mb-2">Tendencia Detectada</div>
                                    <p className="text-sm text-white">"Formato Reels cortos (15s) tiene un +45% de retención."</p>
                                </div>
                                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 hidden lg:block">
                                    <div className="text-xs font-bold text-orange-400 mb-2">Alerta de Oportunidad</div>
                                    <p className="text-sm text-white">"Audiencia similar detectada en sector de Tecnología."</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer HUD */}
                <div className="p-4 border-t border-white/5 bg-[#0E0E18] flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <div className="flex items-center gap-4">
                        <span>SYSTEM: ONLINE</span>
                        <span>LATENCY: 12ms</span>
                        <span>ENCRYPTION: AES-256</span>
                    </div>
                    <div className="flex items-center gap-2">
                        DIIC ZONE INTELLIGENCE <Network className="w-3 h-3" />
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
}
