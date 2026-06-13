'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Bot, Zap, ArrowRight, X, Play, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CRMGuard({ user, children }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isBlocked, setIsBlocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Trial States
    const [trialDaysLeft, setTrialDaysLeft] = useState(15);
    const [hasCrm, setHasCrm] = useState(false);
    const [showTrialBanner, setShowTrialBanner] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'CLIENT') {
            setLoading(false);
            return;
        }

        const checkCRMStatus = async () => {
            try {
                // 1. Calculate trial days based on user creation date
                let daysLeft = 15;
                if (user.created_at) {
                    const creationDate = new Date(user.created_at);
                    const currentDate = new Date();
                    const differenceInTime = currentDate.getTime() - creationDate.getTime();
                    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
                    daysLeft = 15 - differenceInDays;
                }

                // URL simulation override for testing (e.g. ?trial_days=5 or ?trial_days=0)
                const paramTrialDays = searchParams.get('trial_days');
                if (paramTrialDays !== null) {
                    daysLeft = parseInt(paramTrialDays, 10);
                }

                setTrialDaysLeft(daysLeft);

                // 2. Fetch linked client record check if crm is active
                let hasCRMAddon = false;
                if (user.client_id) {
                    const { data: clientData } = await supabase
                        .from('clients')
                        .select('has_crm, onboarding_data')
                        .eq('id', user.client_id)
                        .maybeSingle();

                    hasCRMAddon = clientData?.has_crm === true || clientData?.onboarding_data?.has_crm === true;
                }
                
                setHasCrm(hasCRMAddon);

                // 3. Evaluate restriction rules
                if (hasCRMAddon) {
                    setIsBlocked(false);
                    setShowTrialBanner(false);
                } else if (daysLeft > 0) {
                    setIsBlocked(false);
                    setShowTrialBanner(true);
                } else {
                    setShowTrialBanner(false);
                    // 3s delay (gamified peeking experience before block)
                    setTimeout(() => {
                        setIsBlocked(true);
                    }, 3000);
                }
            } catch (err) {
                console.error("Error checking CRM access status:", err);
            } finally {
                setLoading(false);
            }
        };

        checkCRMStatus();
    }, [user, searchParams]);

    if (loading) {
        return <div className="h-full w-full flex items-center justify-center text-white/50 animate-pulse py-20">Verificando Licencia del CRM...</div>;
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Premium Countdown Trial Banner */}
            <AnimatePresence>
                {showTrialBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="sticky top-0 z-[40] bg-[#070719]/90 backdrop-blur-md border-b border-indigo-500/20 py-2.5 px-4 text-xs shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                    >
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <span className="flex items-center gap-1.5 text-indigo-400 font-black uppercase tracking-widest text-[9px] bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full animate-pulse">
                                    <Sparkles className="w-3.5 h-3.5" /> Periodo de Prueba
                                </span>
                                <span className="text-gray-300 font-medium">
                                    Tienes acceso completo al CRM y Agentes de IA. Te quedan <strong className="text-indigo-400 font-extrabold">{trialDaysLeft} {trialDaysLeft === 1 ? 'día' : 'días'}</strong> de prueba gratuita.
                                </span>
                            </div>
                            <button 
                                onClick={() => router.push('/dashboard/profile?upgrade=crm')}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[9px] px-3.5 py-1.5 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 flex items-center gap-1.5"
                            >
                                Activar CRM Permanente <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1">
                {children}
            </div>

            <AnimatePresence>
                {isBlocked && (
                    <motion.div 
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 md:p-10"
                    >
                        {/* Gamified Modal */}
                        <motion.div 
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-[#050511]/90 border border-indigo-500/30 max-w-5xl w-full rounded-[2.5rem] p-1 shadow-[0_0_15px_rgba(99,102,241,0.15)] relative overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Visual Glow */}
                            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

                            {/* Left Side: Cinematic Video Placeholder */}
                            <div className="w-full md:w-[55%] relative rounded-[2rem] overflow-hidden bg-black aspect-video md:aspect-auto group border border-white/5">
                                {/* Imagen de fondo (Thumbnail) */}
                                <img 
                                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
                                    alt="CRM IA Video" 
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-50 group-hover:opacity-40'}`}
                                />
                                
                                {!isPlaying ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 text-center">
                                        <button 
                                            onClick={() => setIsPlaying(true)}
                                            className="w-20 h-20 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:scale-110 transition-all border border-indigo-400/50 mb-6 group-hover:shadow-[0_0_80px_rgba(99,102,241,0.8)]"
                                        >
                                            <Play className="w-8 h-8 ml-1" fill="currentColor" />
                                        </button>
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Mira cómo escalar tu marca</span>
                                        </div>
                                    </div>
                                ) : (
                                    // REEMPLAZAR ESTO CON EL VIDEO REAL DESPUÉS
                                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                                        <p className="text-white text-xs font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
                                            <Bot className="w-4 h-4 text-indigo-400" /> [Reproduciendo Video de Upsell...]
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Copy & CTA */}
                            <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full mb-6 w-fit">
                                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">ADD-ON PROFESIONAL</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-[1.1]">
                                    Tu volumen está <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Creciendo.</span>
                                </h2>
                                
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                    El <strong className="text-white">40% de las ventas se pierden</strong> si no respondes en menos de 5 minutos. Desbloquea el CRM Profesional y deja que nuestros Agentes de IA respondan, filtren y agenden por ti 24/7.
                                </p>

                                <div className="space-y-4 mb-10">
                                    {[
                                        { icon: Zap, title: 'CRM Kanban Inteligente', desc: 'Controla el estado de cada Lead' },
                                        { icon: Bot, title: 'Agentes de IA (24/7)', desc: 'Respuestas automáticas en WhatsApp/IG' },
                                        { icon: Sparkles, title: 'Analíticas en Tiempo Real', desc: 'Mide conversiones y cuellos de botella' }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                                <feature.icon className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white mb-0.5">{feature.title}</h4>
                                                <p className="text-xs text-gray-500">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => {
                                            router.push('/dashboard/profile?upgrade=crm');
                                        }}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        Activar por $50/mes <ArrowRight className="w-4 h-4" />
                                    </button>
                                    
                                    <button 
                                        onClick={() => router.push('/dashboard')}
                                        className="w-full py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Aún no necesito esto, volver al inicio
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

