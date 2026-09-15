'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, ShieldCheck, Instagram, Facebook, Youtube, Video, Twitter, Linkedin,
    Lock, CheckCircle2, RefreshCw, ArrowRight 
} from 'lucide-react';
import { socialService } from '@/services/socialService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function IntegrationModal({ 
    isOpen, 
    onClose, 
    platform = 'meta', // 'meta' | 'whatsapp'
    clientName = 'tu marca',
    clientId = null,
    onSuccess 
}) {
    const [step, setStep] = useState('CHOICE'); // CHOICE, CONNECTING, SUCCESS
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConnect = async () => {
        setLoading(true);
        setStep('CONNECTING');
        
        try {
            // Save client id so we associate it when returning from redirect
            if (clientId) {
                localStorage.setItem('diic_waiting_client_id', clientId);
            } else {
                localStorage.removeItem('diic_waiting_client_id');
            }
            localStorage.setItem('diic_waiting_provider', platform === 'facebook' || platform === 'meta' ? 'facebook' : platform);

            toast.info(`Iniciando conexión segura con ${platform === 'facebook' || platform === 'meta' ? 'Meta' : platform}...`);
            await socialService.connect(platform);
        } catch (err) {
            console.error("Error al conectar:", err);
            toast.error(`Error al iniciar conexión con ${platform}`);
            setStep('CHOICE');
            setLoading(false);
        }
    };

    const getPlatformConfig = () => {
        switch(platform) {
            case 'facebook':
            case 'meta':
                return { 
                    name: 'Meta (Facebook & Instagram)', 
                    icon: Facebook, 
                    color: '#1877F2', 
                    label: 'Conectar con Facebook & Instagram',
                    description: 'Sincroniza tus páginas oficiales y cuenta comercial de Instagram.'
                };
            case 'tiktok': 
                return { 
                    name: 'TikTok Business', 
                    icon: Video, 
                    color: '#000000', 
                    label: 'Conectar con TikTok',
                    description: 'Sincroniza tus métricas de videos y campañas de anuncios.'
                };
            case 'google': 
                return { 
                    name: 'Google & YouTube', 
                    icon: Youtube, 
                    color: '#EA4335', 
                    label: 'Conectar con Google & YouTube',
                    description: 'Acceso a métricas de canal, Drive y calendario.'
                };
            case 'twitter': 
                return { 
                    name: 'X (Twitter)', 
                    icon: Twitter, 
                    color: '#000000', 
                    label: 'Conectar con X',
                    description: 'Sincroniza publicaciones e interacción en tiempo real.'
                };
            case 'linkedin': 
                return { 
                    name: 'LinkedIn Business', 
                    icon: Linkedin, 
                    color: '#0A66C2', 
                    label: 'Conectar con LinkedIn',
                    description: 'Gestión de perfil profesional y páginas de empresa.'
                };
            default: 
                return { 
                    name: 'Redes Sociales', 
                    icon: Facebook, 
                    color: '#1877F2', 
                    label: 'Iniciar Conexión Oficial',
                    description: 'Sincroniza tus plataformas autorizadas.'
                };
        }
    };

    const config = getPlatformConfig();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/75 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-lg bg-[#0c0c1d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Top Accent Bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />
                    
                    <div className="p-8 md:p-10 space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                                    Vincular {config.name}
                                </h2>
                                <p className="text-xs text-gray-400">
                                    {clientName && clientName !== 'tu marca' ? `Ecosistema de ${clientName}` : 'Conexión oficial directa'}
                                </p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Steps UI */}
                        {step === 'CHOICE' && (
                            <motion.div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                                    <div className="flex items-center gap-2.5 text-indigo-400 text-xs font-semibold">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        <span>Integración Oficial y Segura</span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        {config.description} DIIC ZONE se conecta mediante la API oficial sin acceder a tus contraseñas personales.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={handleConnect}
                                        disabled={loading}
                                        className="w-full text-white p-5 rounded-2xl flex items-center justify-between group transition-all font-semibold shadow-lg hover:brightness-110 active:scale-[0.99]"
                                        style={{ backgroundColor: config.color }}
                                    >
                                        <div className="flex items-center gap-3.5 text-left">
                                            <config.icon className="w-5 h-5" />
                                            <div>
                                                <p className="text-sm font-bold leading-tight">{config.label}</p>
                                                <p className="text-[11px] font-normal opacity-85">Autorización mediante diálogo oficial</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-90" />
                                    </button>

                                    <div className="pt-2 flex items-center justify-center gap-2 text-gray-500 text-[11px]">
                                        <Lock className="w-3.5 h-3.5 text-gray-500" />
                                        <span>Conexión cifrada de extremo a extremo</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'CONNECTING' && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-5">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                                        <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 w-16 h-16 rounded-full border-t-2 border-indigo-400 animate-spin" />
                                </div>
                                <div className="text-center space-y-1.5">
                                    <p className="text-sm font-bold text-white">Conectando con {config.name}...</p>
                                    <p className="text-xs text-gray-400">Verificando permisos y sincronizando activos</p>
                                </div>
                            </div>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="flex flex-col items-center justify-center py-6 space-y-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h4 className="text-xl font-bold text-white">¡Conexión Exitosa!</h4>
                                    <p className="text-xs text-gray-300 max-w-[280px] leading-relaxed mx-auto">
                                        Tu cuenta ha sido vinculada correctamente al ecosistema de DIIC ZONE.
                                    </p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="w-full bg-white text-black py-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all shadow-lg"
                                >
                                    Continuar al Panel
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
