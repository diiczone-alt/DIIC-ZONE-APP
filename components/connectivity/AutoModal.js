'use client';

import { useState } from 'react';
import { X, Bot, Zap, MessageSquare, Instagram, FileText, Calendar, Users, Sparkles, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AutoModal({ isOpen, onClose, onCreate }) {
    const [step, setStep] = useState(1);
    const [trigger, setTrigger] = useState(null);
    const [action, setAction] = useState(null);

    const TRIGGERS = [
        { id: 'msg', label: 'Nuevo Mensaje', icon: MessageSquare, desc: 'Se activa al recibir un mensaje en Inbox.', color: 'text-indigo-500' },
        { id: 'comment', label: 'Comentario Post', icon: Instagram, desc: 'Se activa cuando comentan en IG/FB.', color: 'text-purple-500' },
        { id: 'lead', label: 'Lead Form', icon: FileText, desc: 'Se activa al completar formulario de meta.', color: 'text-blue-500' },
        { id: 'calendar', label: 'Agendamiento', icon: Calendar, desc: 'Se activa al reservar en el calendario.', color: 'text-amber-500' },
    ];

    const ACTIONS = [
        { id: 'ai', label: 'Responder con IA', icon: Bot, desc: 'Analiza el contexto y responde automáticamente.', color: 'text-indigo-400' },
        { id: 'crm', label: 'Asignar a Pipeline CRM', icon: Users, desc: 'Crea un prospecto y lo asigna a un comercial.', color: 'text-emerald-400' },
    ];

    const handleCreate = () => {
        if (trigger && action) {
            onCreate(trigger.id, action.id);
            // Reset for next time
            setStep(1);
            setTrigger(null);
            setAction(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#050511] border border-white/10 rounded-[40px] w-full max-w-2xl shadow-2xl relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="p-10 relative z-10">
                    <button 
                        onClick={() => { setStep(1); onClose(); }} 
                        className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter">DIIC Automation Builder</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'w-8 bg-indigo-500' : 'w-4 bg-white/10'}`}></div>
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'w-8 bg-indigo-500' : 'w-4 bg-white/10'}`}></div>
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 3 ? 'w-8 bg-indigo-500' : 'w-4 bg-white/10'}`}></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Paso {step} de 3</span>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-[350px]">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <h4 className="text-lg font-bold text-white mb-6">1. ¿Qué inicia este flujo? <span className="text-gray-500">(Gatillo)</span></h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {TRIGGERS.map((t) => (
                                        <button 
                                            key={t.id}
                                            onClick={() => { setTrigger(t); setStep(2); }}
                                            className="p-6 bg-white/5 border border-white/5 rounded-3xl text-left hover:border-indigo-500/50 hover:bg-white/10 transition-all group"
                                        >
                                            <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform ${t.color}`}>
                                                <t.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-black text-white block mb-1">{t.label}</span>
                                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{t.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest">Atrás</button>
                                    <h4 className="text-lg font-bold text-white">2. ¿Qué acción debe ocurrir?</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {ACTIONS.map((a) => (
                                        <button 
                                            key={a.id}
                                            onClick={() => { setAction(a); setStep(3); }}
                                            className="p-6 bg-white/5 border border-white/5 rounded-3xl text-left hover:border-indigo-500/50 hover:bg-white/10 transition-all group"
                                        >
                                            <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform ${a.color}`}>
                                                <a.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-black text-white block mb-1">{a.label}</span>
                                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{a.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-8 py-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                                    <div className="flex items-center gap-10 relative z-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`p-5 rounded-[24px] bg-white/10 border border-white/10 ${trigger?.color}`}>
                                                {trigger && <trigger.icon className="w-10 h-10" />}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Inicio</span>
                                        </div>
                                        <Zap className="w-8 h-8 text-indigo-500 animate-pulse" />
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`p-5 rounded-[24px] bg-white/10 border border-white/10 ${action?.color}`}>
                                                {action && <action.icon className="w-10 h-10" />}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fin</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-white">Confirmar Nuevo Flujo</h4>
                                    <p className="text-gray-500 text-sm italic">Se inyectará un nodo de lógica en la pizarra maestra.</p>
                                </div>

                                <div className="flex gap-4 w-full pt-6">
                                    <button 
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-4 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Reajustar
                                    </button>
                                    <button 
                                        onClick={handleCreate}
                                        className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Activar Sincronización
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
