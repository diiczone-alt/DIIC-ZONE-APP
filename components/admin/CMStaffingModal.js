'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, X, Send, AlertTriangle } from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

export default function CMStaffingModal({ isOpen, onClose, cmMember, onSubmitted }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: 'Editor',
        urgency: 'normal',
        reason: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const success = await agencyService.submitTeamRequest({
                cm_id: cmMember.id,
                role: formData.role,
                reason: formData.reason,
                urgency: formData.urgency
            });

            if (success) {
                toast.success("Solicitud enviada al HQ con éxito");
                onSubmitted?.();
                onClose();
            } else {
                toast.error("Error al enviar la solicitud");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

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
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0E0E18] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                    <Zap className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Solicitar Refuerzo</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Petición de recursos para Squad {cmMember.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Perfil Requerido</span>
                                    <select 
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
                                    >
                                        <option value="Editor">Editor de Video</option>
                                        <option value="Diseñador">Diseñador Gráfico</option>
                                        <option value="Filmmaker">Filmmaker / Cámara</option>
                                        <option value="Otro">Otro / Auxiliar</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Nivel de Urgencia</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['normal', 'high', 'critical'].map((u) => (
                                            <button
                                                key={u}
                                                type="button"
                                                onClick={() => setFormData({...formData, urgency: u})}
                                                className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    formData.urgency === u 
                                                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                                    : 'bg-white/5 border-transparent text-gray-500 hover:text-gray-300'
                                                }`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Justificación (Motivo)</span>
                                    <textarea 
                                        required
                                        value={formData.reason}
                                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                        placeholder="Ej: Aumento de carga por ingreso de nuevo cliente inmobiliario..."
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white h-32 focus:border-indigo-500/50 outline-none transition-all resize-none"
                                    />
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-black text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? "Procesando..." : (
                                    <>
                                        <Send className="w-4 h-4" /> Enviar Solicitud a HQ
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white/5 p-6 border-t border-white/5">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                            <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                                Nota: Las solicitudes son revisadas por el Director General. Una vez aprobada, se te asignará un miembro del pool general a tu escuadrón.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
