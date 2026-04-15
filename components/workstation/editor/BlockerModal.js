'use client';

import { useState } from 'react';
import { AlertTriangle, X, Upload, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlockerModal({ isOpen, onClose, onSubmit }) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send data to backend
        onSubmit({ reason, description });
        onClose();
        setReason('');
        setDescription('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0E0E18] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-red-500/10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6 text-red-400">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Reportar Bloqueo</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Motivo del Bloqueo</label>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none"
                                    required
                                >
                                    <option value="" disabled>Selecciona una opción</option>
                                    <option value="missing_assets">Falta material / assets</option>
                                    <option value="incomplete_guide">Guía incompleta o confusa</option>
                                    <option value="technical_issue">Problema técnico</option>
                                    <option value="feedback_needed">Esperando feedback crítico</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Descripción Detallada</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Explica el problema para que el CM pueda resolverlo..."
                                    className="w-full h-32 bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                                    required
                                />
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-2 text-sm text-gray-400 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
                                <Upload className="w-4 h-4" />
                                <span>Adjuntar captura (Opcional)</span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Reportar Bloqueo
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
