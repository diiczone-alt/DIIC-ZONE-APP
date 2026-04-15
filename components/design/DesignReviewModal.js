'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, MessageSquare, Download, Share2, History } from 'lucide-react';

export default function DesignReviewModal({ item, onClose, onApprove, onRequestChanges }) {
    const [comment, setComment] = useState('');

    if (!item) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-6xl h-[85vh] bg-[#0A0A12] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                >
                    {/* Left: Image Viewer */}
                    <div className="flex-1 bg-black/50 relative flex items-center justify-center p-8 group">
                        <div className="relative max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden">
                            <img
                                src={item.file_url}
                                alt={item.title}
                                className="max-w-full max-h-[75vh] object-contain"
                            />
                        </div>

                        {/* Top Overlay Controls */}
                        <div className="absolute top-6 left-6 flex gap-3">
                            <span className="px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-bold border border-white/10 backdrop-blur-md">
                                v{item.version || 1}
                            </span>
                        </div>
                    </div>

                    {/* Right: Sidebar Controls */}
                    <div className="w-full md:w-96 bg-[#0B0B15] border-l border-white/5 flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                <p className="text-xs text-gray-400">Creado el {new Date(item.created_at || Date.now()).toLocaleDateString()}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Comments / History Placeholder */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                                <h4 className="text-blue-400 font-bold text-sm mb-1 flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Instrucciones Creador
                                </h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    "Adjunto la versión 1 basada en las referencias. Por favor revisar los colores corporativos."
                                </p>
                            </div>

                            {/* Timeline Placeholder */}
                            <div className="relative pl-4 border-l border-white/10 space-y-6 mt-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-primary ring-4 ring-[#0B0B15]" />
                                    <p className="text-xs text-gray-500 mb-1">Hoy, 10:30 AM</p>
                                    <p className="text-sm text-white font-medium">Versión 1 subida por Equipo</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Deja un comentario o feedback..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 resize-none h-24"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-3 px-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm border border-white/10">
                                    <History className="w-4 h-4" /> Solicitar Cambio
                                </button>
                                <button className="py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/25">
                                    <Check className="w-4 h-4" /> Aprobar Diseño
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
