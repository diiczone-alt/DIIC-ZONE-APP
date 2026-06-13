'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldAlert, Zap, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PaywallGuard({ user, children }) {
    const router = useRouter();
    const [isBlocked, setIsBlocked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'CLIENT') {
            setLoading(false);
            return;
        }

        const checkStatus = async () => {
            try {
                // Determine Trial Days
                const creationDate = new Date(user.created_at);
                const currentDate = new Date();
                const differenceInTime = currentDate.getTime() - creationDate.getTime();
                const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
                const trialDaysLeft = 15 - differenceInDays;

                let isActuallyPaid = false;

                if (user.client_id) {
                    const { data: clientData } = await supabase
                        .from('clients')
                        .select('status')
                        .eq('id', user.client_id)
                        .maybeSingle();

                    if (clientData && clientData.status === 'active') {
                        isActuallyPaid = true;
                    }
                }

                // If trial is over and they haven't paid, block them
                if (trialDaysLeft <= 0 && !isActuallyPaid) {
                    setIsBlocked(true);
                }
            } catch (err) {
                console.error("Error checking paywall status:", err);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [user]);

    if (loading) {
        return <div className="h-full w-full flex items-center justify-center text-white/50 animate-pulse">Verificando Licencia...</div>;
    }

    return (
        <>
            {children}

            <AnimatePresence>
                {isBlocked && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#050511] border border-red-500/20 max-w-2xl w-full rounded-[2rem] p-8 md:p-12 text-center shadow-[0_0_100px_rgba(239,68,68,0.1)] relative overflow-hidden"
                        >
                            {/* Visuals */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 opacity-50" />
                            <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-[100px] pointer-events-none" />

                            <div className="mx-auto w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6 relative">
                                <Lock className="w-8 h-8 text-red-500" strokeWidth={1.5} />
                                <div className="absolute inset-0 bg-red-500/20 animate-ping rounded-full" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic mb-4">
                                PERIODO DE PRUEBA FINALIZADO
                            </h2>
                            <p className="text-gray-400 font-medium mb-10 max-w-lg mx-auto">
                                Tu acceso gratuito de 15 días ha concluido. Para seguir utilizando DIICZONE y mantener a tu equipo creativo en línea, debes adquirir un paquete de producción o la Licencia Base del sistema.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                                        <Zap className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">Paquete de Producción</h3>
                                    <p className="text-sm text-gray-500 mb-4">Obtén contenido mes a mes (Videos, Posts). La licencia de la app está incluida 100% gratis.</p>
                                    <button 
                                        onClick={() => {
                                            setIsBlocked(false); // Temporarily unblock to let them navigate
                                            router.push('/dashboard/profile');
                                        }}
                                        className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-300"
                                    >
                                        Ver Planes <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                                        <ShieldAlert className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">Licencia Base</h3>
                                    <p className="text-sm text-gray-500 mb-4">Solo acceso al Hub, calendarios y reportes para tu equipo. Cuesta $70/mes.</p>
                                    <button 
                                        onClick={() => {
                                            setIsBlocked(false);
                                            router.push('/dashboard/profile');
                                        }}
                                        className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-white"
                                    >
                                        Pagar $70/mes <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-8">
                                Si crees que esto es un error, contacta a soporte.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
