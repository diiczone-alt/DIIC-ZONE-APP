'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, ShieldCheck, Instagram, Facebook, 
    Zap, Lock, CheckCircle2, RefreshCw, 
    ArrowRight, AlertCircle, ExternalLink 
} from 'lucide-react';

export default function IntegrationModal({ 
    isOpen, 
    onClose, 
    platform = 'meta', // 'meta' | 'whatsapp'
    onSuccess 
}) {
    const [step, setStep] = useState('CHOICE'); // CHOICE, CONNECTING, SUCCESS
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConnectMeta = async () => {
        setLoading(true);
        setStep('CONNECTING');
        
        // Simulación del flujo de Meta SDK (FB.login)
        setTimeout(() => {
            setLoading(false);
            setStep('SUCCESS');
            if (onSuccess) onSuccess();
        }, 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a1a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    {/* Top Accent Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
                    
                    <div className="p-10 space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Vinculación Real</h2>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocolo de Seguridad DIIC v3.2</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Steps UI */}
                        {step === 'CHOICE' && (
                            <motion.div className="space-y-6">
                                <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                                    <div className="flex items-center gap-3 text-indigo-400">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Conexión Segura Meta</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                        Para conectar de verdad tu Instagram y Ads, iniciaremos un flujo oficial de Meta. DIIC ZONE no guardará tu contraseña, solo el permiso de lectura.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button 
                                        onClick={handleConnectMeta}
                                        className="w-full bg-[#1877F2] hover:bg-[#166fe1] text-white p-6 rounded-2xl flex items-center justify-between group transition-all"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <Facebook className="w-6 h-6" />
                                            <div>
                                                <p className="text-sm font-bold">Continuar con Facebook</p>
                                                <p className="text-[9px] font-medium opacity-70 italic">Vincular Instagram & Ads Business</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    
                                    <div className="flex items-center gap-3 px-4 text-gray-600">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-[8px] font-black uppercase tracking-widest italic tracking-tighter">Cifrado de grado médico compatible con GDPR</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'CONNECTING' && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-2 border-indigo-500/10 flex items-center justify-center">
                                        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 w-20 h-20 rounded-full border-t-2 border-indigo-500 animate-spin" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-bold text-white">Sincronizando con Meta...</p>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Autenticando Permisos de Administrador</p>
                                </div>
                            </div>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="flex flex-col items-center justify-center py-6 space-y-8">
                                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                                </div>
                                <div className="text-center space-y-3">
                                    <h4 className="text-2xl font-black text-white italic uppercase italic">¡Conexión Exitosa!</h4>
                                    <p className="text-xs text-gray-400 font-bold max-w-[280px] leading-relaxed mx-auto">
                                        Tu cuenta de <span className="text-white">Nova Estética</span> ha sido vinculada de forma segura al ecosistema DIIC.
                                    </p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="w-full bg-white text-black p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-all"
                                >
                                    Ir al Dashboard Real
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Estado: Encriptado</span>
                         </div>
                         <div className="flex gap-4">
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">v1.2</span>
                         </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
