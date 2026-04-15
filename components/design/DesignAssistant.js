'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PenTool, X, Bot, Palette, ArrowRight } from 'lucide-react';
import AIGenerator from './AIGenerator';
import ProfessionalOrder from './ProfessionalOrder';

export default function DesignAssistant({ isOpen, onClose }) {
    const [mode, setMode] = useState('initial'); // initial, ai, pro

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-3xl h-auto bg-[#0B0B15] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0B0B15]/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Asistente de Diseño</h3>
                                <p className="text-[10px] text-gray-400">Powered by DIIC AI</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative overflow-hidden flex flex-col justify-center p-6">
                        {/* Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
                        </div>

                        {mode === 'initial' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center relative z-10"
                            >
                                {/* Hero Section with Robot - Image Removed */}
                                <div className="flex flex-col items-center mb-8 w-full justify-center">
                                    <div className="text-center">
                                        <motion.h1
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-3xl font-bold text-white mb-2 leading-tight"
                                        >
                                            Hola, soy tu asistente <br />
                                            de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Diseño Gráfico</span>.
                                        </motion.h1>
                                        <motion.p
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-sm text-gray-400 max-w-md mx-auto"
                                        >
                                            Aquí puedes <span className="text-white font-bold">crear con IA</span> o encargar un <span className="text-white font-bold">diseño profesional</span>.
                                        </motion.p>
                                    </div>
                                </div>

                                {/* Cards Container */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl px-4">
                                    {/* Option 1: AI (Blue/Cyan Glow) */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setMode('ai')}
                                        className="group relative p-1 rounded-3xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                        <div className="relative h-full bg-[#0F111A]/90 backdrop-blur-xl border border-blue-500/30 group-hover:border-blue-400 rounded-[22px] p-6 text-left flex flex-col justify-between overflow-hidden">
                                            {/* Glow overlay */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[60px] rounded-full group-hover:bg-cyan-400/30 transition-colors" />

                                            <div>
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                                                    <Sparkles className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">Crear con IA</h3>
                                                <p className="text-gray-400 text-sm font-medium">
                                                    Crea artes rápidos y personalizados.
                                                </p>
                                            </div>

                                            <div className="mt-8 flex items-center text-cyan-400 font-bold text-sm tracking-wide group-hover:translate-x-1 transition-transform">
                                                INICIAR GENERADOR <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </div>
                                    </motion.button>

                                    {/* Option 2: Professional (Purple/Orange Glow) */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setMode('pro')}
                                        className="group relative p-1 rounded-3xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-orange-400 opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                        <div className="relative h-full bg-[#0F111A]/90 backdrop-blur-xl border border-purple-500/30 group-hover:border-purple-400 rounded-[22px] p-6 text-left flex flex-col justify-between overflow-hidden">
                                            {/* Glow overlay */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full group-hover:bg-purple-400/30 transition-colors" />

                                            <div>
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                                                    <Palette className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">Encargar Diseño</h3>
                                                <p className="text-gray-400 text-sm font-medium">
                                                    Nuestro equipo experto se encarga de todo.
                                                </p>
                                            </div>

                                            <div className="mt-8 flex items-center text-purple-400 font-bold text-sm tracking-wide group-hover:translate-x-1 transition-transform">
                                                INICIAR SOLICITUD <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {mode === 'ai' && <AIGenerator onBack={() => setMode('initial')} />}
                        {mode === 'pro' && <ProfessionalOrder onBack={() => setMode('initial')} onClose={onClose} />}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
