'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Upload, Calendar, Film, Mic, Sparkles, FolderOpen } from 'lucide-react';

export default function FilmmakerAssistant({ isOpen, onClose }) {
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
                    className="relative w-full max-w-4xl h-auto min-h-[500px] bg-[#0B0B15] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0B0B15]/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                                <Film className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Filmmaker Pro</h3>
                                <p className="text-xs text-red-400 font-medium tracking-wide">ASISTENTE DE PRODUCCIÓN</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative overflow-hidden flex flex-col justify-center p-10">
                        {/* Background Ambience */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-600/5 rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[100px]" />
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Left Text */}
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8"
                                >
                                    <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                                        Luces, Cámara, <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Acción.</span>
                                    </h1>
                                    <p className="text-gray-400 text-lg">
                                        Gestiona tus rodajes, organiza material y coordina la post-producción en un solo lugar.
                                    </p>
                                </motion.div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">¿Qué deseas hacer hoy?</h4>

                                    <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/30 transition-all group flex items-start gap-4 text-left">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors text-red-500">
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold group-hover:text-red-400 transition-colors">Agendar Grabación</h5>
                                            <p className="text-sm text-gray-500">Coordina un equipo de rodaje para tu proyecto.</p>
                                        </div>
                                    </button>

                                    <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all group flex items-start gap-4 text-left">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-500">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold group-hover:text-blue-400 transition-colors">Subir Material</h5>
                                            <p className="text-sm text-gray-500">Carga crudos, audios o recursos para edición.</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Right Options / Visuals */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="aspect-square rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/5 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-purple-500/50 transition-colors shadow-2xl"
                                >
                                    <Sparkles className="w-10 h-10 text-purple-400 mb-4" />
                                    <h4 className="font-bold text-white mb-1">Edición IA</h4>
                                    <p className="text-xs text-gray-500">Crear clips automáticos</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="aspect-square rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/5 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-green-500/50 transition-colors shadow-2xl"
                                >
                                    <Calendar className="w-10 h-10 text-green-400 mb-4" />
                                    <h4 className="font-bold text-white mb-1">Eventos</h4>
                                    <p className="text-xs text-gray-500">Cobertura completa</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="aspect-square rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/5 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-orange-500/50 transition-colors shadow-2xl"
                                >
                                    <FolderOpen className="w-10 h-10 text-orange-400 mb-4" />
                                    <h4 className="font-bold text-white mb-1">Archivo</h4>
                                    <p className="text-xs text-gray-500">Gestor de medios</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="aspect-square rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/5 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-pink-500/50 transition-colors shadow-2xl"
                                >
                                    <Mic className="w-10 h-10 text-pink-400 mb-4" />
                                    <h4 className="font-bold text-white mb-1">Podcast</h4>
                                    <p className="text-xs text-gray-500">Grabación de audio</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
