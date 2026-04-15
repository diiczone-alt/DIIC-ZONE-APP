'use client';

import { motion } from 'framer-motion';
import { X, Server, Database, Activity, Sparkles } from 'lucide-react';

export default function GalleryWelcome({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-8"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0A0A12] border border-white/10 rounded-[2rem] w-full max-w-4xl p-1 relative shadow-2xl overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>

                {/* Content */}
                <div className="relative z-10 p-10 flex flex-col items-center text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                        <Database className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-2">Bienvenido a tu Galería Creativa</h1>
                    <p className="text-gray-400 max-w-lg text-lg mb-10 leading-relaxed">
                        El centro neurálgico visual de tu marca. Aquí vive tu historia, tus archivos y tu futuro creativo.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mb-10">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:bg-white/10 transition-colors">
                            <Server className="w-6 h-6 text-indigo-400 mb-3" />
                            <span className="text-2xl font-bold text-white">450 GB</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Sincronizado</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:bg-white/10 transition-colors">
                            <Activity className="w-6 h-6 text-emerald-400 mb-3" />
                            <span className="text-2xl font-bold text-white">100%</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Estado de Salud</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:bg-white/10 transition-colors">
                            <Sparkles className="w-6 h-6 text-purple-400 mb-3" />
                            <span className="text-2xl font-bold text-white">12.5k</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Archivos Totales</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2"
                    >
                        Explorar Galería
                        <Sparkles className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
