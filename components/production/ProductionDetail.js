'use client';

import { motion } from 'framer-motion';
import { X, MessageSquare, Paperclip, Send, CheckCircle, RefreshCcw, Calendar, User, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ProductionDetail({ item, onClose }) {
    const [comment, setComment] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0E0E18] w-full max-w-4xl h-[90vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                {item.type}
                            </span>
                            <span className="text-gray-500 text-xs font-mono">ID: {item.id}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white">{item.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                    {/* Left: Project Info & Preview */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-white/5">

                        {/* Status Bar */}
                        <div className="flex items-center justify-between mb-8 bg-[#151520] p-4 rounded-xl border border-white/5">
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Estado Actual</div>
                                <div className="text-white font-bold flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                    <span className="capitalize">{item.status}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Tiempo Restante</div>
                                <div className="text-white font-bold">2 días</div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Responsable</label>
                                <div className="flex items-center gap-2 text-white bg-white/5 p-3 rounded-lg border border-white/5">
                                    <User className="w-4 h-4 text-gray-400" /> {item.owner}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Fecha Entrega</label>
                                <div className="flex items-center gap-2 text-white bg-white/5 p-3 rounded-lg border border-white/5">
                                    <Calendar className="w-4 h-4 text-gray-400" /> {item.targetDate}
                                </div>
                            </div>
                        </div>

                        {/* Preview Area (Placeholder) */}
                        <div className="aspect-video bg-[#050511] rounded-2xl border border-white/10 flex items-center justify-center relative group overflow-hidden mb-8">
                            <img src={item.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                            <div className="relative z-10 text-center">
                                <p className="text-gray-400 text-sm mb-2">Vista Previa no disponible</p>
                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white font-bold transition-colors">
                                    Descargar Archivos
                                </button>
                            </div>
                        </div>

                        {/* Approval Actions */}
                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
                                <CheckCircle className="w-5 h-5" /> Aprobar Entrega
                            </button>
                            <button className="flex-1 py-4 bg-[#151520] hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                <RefreshCcw className="w-5 h-5" /> Solicitar Cambios
                            </button>
                        </div>

                    </div>

                    {/* Right: Communication Hub */}
                    <div className="w-full lg:w-96 bg-[#0E0E18] flex flex-col">
                        <div className="p-4 border-b border-white/5 font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-indigo-500" /> Comentarios del Proyecto
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white font-bold">CM</div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-white">Carlos M.</span>
                                        <span className="text-[10px] text-gray-500">10 Oct 14:30</span>
                                    </div>
                                    <p className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg rounded-tl-none mt-1">
                                        Iniciando edición. ¿Tienen los assets del logo en alta?
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center text-xs text-white font-bold">YO</div>
                                <div className="text-right">
                                    <div className="flex items-baseline gap-2 justify-end">
                                        <span className="text-sm font-bold text-white">Tú</span>
                                        <span className="text-[10px] text-gray-500">10 Oct 14:35</span>
                                    </div>
                                    <p className="text-sm text-white bg-indigo-600 p-3 rounded-lg rounded-tr-none mt-1 text-left">
                                        Sí, están en la carpeta "Brand Assets" del módulo de Archivos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-[#151520]">
                            <div className="flex items-center gap-2 bg-[#050511] border border-white/10 rounded-xl p-2 focus-within:border-indigo-500/50 transition-colors">
                                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Escribe un comentario..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
