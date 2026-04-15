'use client';

import { motion } from 'framer-motion';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeStep({ onNext, type = 'client' }) {
    const isCreative = type === 'creative';

    return (
        <div className="space-y-8 text-center h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-32 h-32 relative"
            >
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 rounded-full animate-pulse" />
                <div className="relative bg-[#0A0A12] border border-white/10 w-full h-full rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                    <Bot className="w-16 h-16 text-indigo-400 z-10" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t border-indigo-500/50 rounded-full"
                    />
                </div>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: -10, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -right-4 top-0 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                >
                    Hola 👋
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Soy tu Asistente <span className="text-indigo-400">DIIC ZONE</span>
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed max-w-lg mx-auto">
                    {isCreative 
                        ? "Configuraremos tu perfil profesional para conectarte con las mejores marcas y optimizar tu flujo creativo."
                        : "Antes de construir tu entorno para escalar tu marca, quiero conocerte para diseñar un sistema a tu medida."
                    }
                </p>
            </motion.div>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onNext}
                className="group relative px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="flex items-center gap-3">
                    Comenzar Experiencia
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
            </motion.button>
        </div>
    );
}
