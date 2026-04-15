'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Layers, Sparkles, MessageSquare, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';

export default function EditingAssistant({ isOpen, onClose }) {
    const [mode, setMode] = useState('initial'); // 'initial', 'templates', 'text', 'professional'

    if (!isOpen) return null;

    const handleClose = () => {
        setMode('initial');
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#0B0B15] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto min-h-[600px]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0B0B15]/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Film className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Nuevo Proyecto de Video</h3>
                                <p className="text-xs text-orange-400 font-medium tracking-wide">
                                    {mode === 'initial' ? 'Elige cómo quieres crear' :
                                        mode === 'templates' ? 'Crear con Plantillas (IA)' :
                                            mode === 'text' ? 'Generar desde Texto (IA)' : 'Delegar a Profesional'}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 flex flex-col relative overflow-y-auto">
                        {/* Background Ambience */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                            <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-orange-600/5 rounded-full blur-[120px]" />
                        </div>

                        {mode === 'initial' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative z-10 flex flex-col items-center h-full justify-center"
                            >
                                <div className="text-center mb-10 max-w-2xl">
                                    <h2 className="text-3xl font-bold text-white mb-3">Elige cómo quieres crear tu contenido</h2>
                                    <p className="text-gray-400">Desde generación automática con IA hasta edición profesional detallada.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

                                    {/* Option A: Templates (IA) */}
                                    <button
                                        onClick={() => setMode('templates')}
                                        className="group p-1 rounded-3xl relative overflow-hidden text-left h-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                        <div className="relative bg-[#121420] border border-white/5 group-hover:border-orange-500/30 rounded-2xl p-6 h-full flex flex-col hover:translate-y-[-4px] transition-all duration-300 shadow-xl shadow-black/20 group-hover:shadow-orange-500/10">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-5 group-hover:scale-110 transition-transform">
                                                <Sparkles className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Crear con Plantillas <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded ml-2">IA</span></h3>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                                                Genera un video listo usando plantillas profesionales. Solo sube tus clips o fotos y elige un estilo.
                                            </p>
                                            <div className="flex items-center text-orange-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                                Usar Plantillas <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Option B: Text to Video (IA) */}
                                    <button
                                        onClick={() => setMode('text')}
                                        className="group p-1 rounded-3xl relative overflow-hidden text-left h-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                        <div className="relative bg-[#121420] border border-white/5 group-hover:border-blue-500/30 rounded-2xl p-6 h-full flex flex-col hover:translate-y-[-4px] transition-all duration-300 shadow-xl shadow-black/20 group-hover:shadow-blue-500/10">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                                                <MessageSquare className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Generar desde Texto <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-2">IA</span></h3>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                                                Escribe tu idea, sube una imagen o recursos, y crea un video completo con IA automáticamente.
                                            </p>
                                            <div className="flex items-center text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                                Crear desde Texto <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Option C: Professional (Delegate) */}
                                    <button
                                        onClick={() => setMode('professional')}
                                        className="group p-1 rounded-3xl relative overflow-hidden text-left h-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                                        <div className="relative bg-[#121420] border border-white/5 group-hover:border-purple-500/30 rounded-2xl p-6 h-full flex flex-col hover:translate-y-[-4px] transition-all duration-300 shadow-xl shadow-black/20 group-hover:shadow-purple-500/10">
                                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Delegar a Profesional</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                                                Sube tu material y nuestro equipo de expertos DIIC ZONE lo edita con calidad cinematográfica.
                                            </p>
                                            <div className="flex items-center text-purple-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                                Delegar Edición <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </div>
                                    </button>

                                </div>
                            </motion.div>
                        )}

                        {/* FLOW: TEMPLATES (IA) */}
                        {mode === 'templates' && (
                            <div className="relative z-10 h-full flex flex-col">
                                <button onClick={() => setMode('initial')} className="flex items-center text-gray-400 hover:text-white mb-6 w-fit transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                                </button>
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Flujo A: Selección de Plantillas IA (Próximamente)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FLOW: TEXT (IA) */}
                        {mode === 'text' && (
                            <div className="relative z-10 h-full flex flex-col">
                                <button onClick={() => setMode('initial')} className="flex items-center text-gray-400 hover:text-white mb-6 w-fit transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                                </button>
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Flujo B: Generación desde Texto IA (Próximamente)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FLOW: PROFESSIONAL (Delegation) */}
                        {mode === 'professional' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative z-10 h-full flex flex-col"
                            >
                                <button onClick={() => setMode('initial')} className="flex items-center text-gray-400 hover:text-white mb-6 w-fit transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                                </button>

                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Estructura del Proyecto</h2>
                                    <p className="text-gray-400">¿Qué tipo de edición necesitas?</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                                    {/* Sub-Option 1: Video Unico */}
                                    <button
                                        onClick={() => setMode('briefing_pro')}
                                        className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/50 transition-all text-left relative overflow-hidden"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                                            <Film className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Video Unico</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Para archivos continuos como podcasts, entrevistas o grabaciones de una sola toma.
                                        </p>
                                    </button>

                                    {/* Sub-Option 2: Multi-Escena */}
                                    <button
                                        onClick={() => setMode('briefing_pro')}
                                        className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-500/50 transition-all text-left relative overflow-hidden"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4 group-hover:scale-110 transition-transform">
                                            <Layers className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">Multi-Escena</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Ideal para Reels, TikToks o videos comerciales con estructura compleja y múltiples cortes.
                                        </p>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* FLOW: PROFESSIONAL BRIEFING (Active) */}
                        {mode === 'briefing_pro' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative z-10 h-full flex flex-col"
                            >
                                <button onClick={() => setMode('professional')} className="flex items-center text-gray-400 hover:text-white mb-6 w-fit transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                                </button>

                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Detalles del Proyecto</h2>
                                    <p className="text-gray-400">Cuéntanos más para empezar a trabajar</p>
                                </div>

                                <div className="max-w-3xl mx-auto w-full">
                                    <div className="bg-[#121420] p-8 rounded-3xl border border-white/5 shadow-2xl">

                                        {/* Upload Section */}
                                        <div className="mb-8">
                                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">1</div>
                                                Sube tus Archivos
                                            </h3>
                                            <div className="border-2 border-dashed border-white/10 rounded-2xl h-48 flex flex-col items-center justify-center hover:border-purple-500/50 hover:bg-white/5 transition-all text-center p-6 cursor-pointer group">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 mb-4 group-hover:scale-110 group-hover:text-purple-400 transition-all">
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <p className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors">Arrastra tus videos aquí</p>
                                                <p className="text-xs text-gray-500">MP4, MOV, WAV (Máx 5GB)</p>
                                            </div>
                                        </div>

                                        {/* Instructions Section */}
                                        <div className="mb-8">
                                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">2</div>
                                                Instrucciones del Director
                                            </h3>
                                            <textarea
                                                placeholder="Describe el estilo, ritmo, música o referencias para tu video..."
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple-500/50 outline-none h-32 resize-none placeholder-gray-600 focus:bg-purple-500/5 transition-all"
                                            ></textarea>
                                        </div>

                                        {/* Submit Action */}
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="text-xs text-gray-500">
                                                <p>Tiempo estimado de entrega:</p>
                                                <p className="text-white font-bold">24 - 48 Horas</p>
                                            </div>
                                            <button
                                                onClick={handleClose}
                                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-1 flex items-center gap-2"
                                            >
                                                Enviar Proyecto <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
}
