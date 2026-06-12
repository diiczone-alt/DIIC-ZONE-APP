'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Server, FolderGit2, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { onboardingService } from '@/services/onboardingService';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { driveService } from '@/services/driveService';
import { toast } from 'sonner';

export default function EnvironmentSuccessStep({ onNext, formData }) {
    const router = useRouter();
    const [status, setStatus] = useState('initializing'); // initializing, processing, ready
    const [logs, setLogs] = useState([]);
    const [identityCode, setIdentityCode] = useState('');
    const [countdown, setCountdown] = useState(5);
    const [showForceEnter, setShowForceEnter] = useState(false);

    const { user, session, refreshUser } = useAuth();
    const currentUser = user || session?.user;
    const [retryCount, setRetryCount] = useState(0);
    const [isAlreadyMember, setIsAlreadyMember] = useState(false);
    const isMounted = useRef(true);
    const retryTimeoutRef = useRef(null);
    const hasExecuted = useRef(false);
    const finalSlugs = useRef({ industry: 'general', client: 'workspace', clientId: null });

    const isCreative = formData.type === 'creative';

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const runFinalization = async () => {
            if (hasExecuted.current) return;
            hasExecuted.current = true;

            let activeUser = currentUser || session?.user;

            if (!activeUser && retryCount < 2) {
                if (isMounted.current) setLogs(prev => [...prev, 'Buscando protocolo de identidad...']);
                retryTimeoutRef.current = setTimeout(() => {
                    if (isMounted.current) {
                        hasExecuted.current = false; 
                        setRetryCount(prev => prev + 1);
                    }
                }, 2000);
                return;
            }

            try {
                if (isMounted.current) setStatus('processing');
                
                // 1. Database Persistence
                if (activeUser) {
                    if (isMounted.current) setLogs(prev => [...prev, 'Sincronizando perfil con el servidor...']);
                    
                    try {
                        const dbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_SAFE')), 6000));
                        const result = await Promise.race([
                            onboardingService.finalizeOnboarding(formData, activeUser),
                            dbTimeout
                        ]);

                        if (isMounted.current && result) {
                            if (result.industry_slug && result.client_slug) {
                                finalSlugs.current = {
                                    industry: result.industry_slug,
                                    client: result.client_slug,
                                    clientId: result.clientId
                                };
                            }

                            if (result.isUpdate) {
                                setIsAlreadyMember(true);
                                setLogs(prev => [...prev, 'Actualizando credenciales de acceso...']);
                            } else {
                                setLogs(prev => [...prev, 'Entorno de cliente registrado exitosamente.']);
                            }
                        }
                    } catch (dbErr) {
                        if (dbErr.message === 'TIMEOUT_SAFE') {
                            console.warn('[EnvironmentSuccessStep] Database timeout.');
                            setLogs(prev => [...prev, 'Sincronización optimizada en segundo plano.']);
                        } else {
                            console.error('Finalization error:', dbErr);
                        }
                    }
                }

                // 2. Drive Ecosystem Setup (Creative Only during onboarding)
                if (isCreative && activeUser) {
                    if (isMounted.current) setLogs(prev => [...prev, 'Buscando llave de ecosistema...']);
                    
                    const backupToken = typeof window !== 'undefined' ? localStorage.getItem('diic_google_token') : null;
                    const providerToken = session?.provider_token || backupToken;

                    if (providerToken && isMounted.current) {
                        try {
                            setLogs(prev => [...prev, 'Llave detectada. Creando entorno en Google Drive...']);
                            const brandName = formData.brand || activeUser?.user_metadata?.brand || 'Mi Marca';
                            
                            const driveResult = await driveService.automatedSetup(providerToken, brandName);
                            
                            for (const folder of driveResult.subfolders) {
                                if (!isMounted.current) break;
                                setLogs(prev => [...prev, `Carpeta creada: ${folder.name}`]);
                                await new Promise(r => setTimeout(r, 200));
                            }
                            
                            if (isMounted.current) {
                                setLogs(prev => [...prev, 'Ecosistema Cloud activado.']);
                                
                                await supabase.from('profiles').update({
                                    drive_root_link: driveResult.rootLink,
                                    drive_root_id: driveResult.rootId
                                }).eq('id', activeUser.id);

                                localStorage.removeItem('diic_google_token');
                                localStorage.removeItem('diic_google_refresh_token');
                            }
                        } catch (driveErr) {
                            console.error('Drive Setup failed:', driveErr);
                        }
                    }
                }

                await new Promise(r => setTimeout(r, 1000));
                
                if (isMounted.current) {
                    setLogs(prev => [...prev, 'Inicialización completada.']);
                    
                    if (isCreative) {
                        const brandPref = (formData.brand || 'CORP').substring(0, 4).toUpperCase();
                        setIdentityCode(`DIIC-${brandPref}-${Math.floor(1000 + Math.random() * 9000)}`);
                    }

                    setStatus('ready');
                    toast.success('Entorno activado con éxito.');
                }

            } catch (err) {
                console.error('Finalization failed:', err);
                if (isMounted.current) {
                    setStatus('ready'); 
                }
            }
        };

        runFinalization();
    }, [currentUser, retryCount]);
    
    useEffect(() => {
        let timer;
        if (status === 'processing') {
            timer = setTimeout(() => {
                if (isMounted.current) setShowForceEnter(true);
            }, 5000);
        } else {
            setShowForceEnter(false);
        }
        return () => clearTimeout(timer);
    }, [status]);

    useEffect(() => {
        if (status === 'ready' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (status === 'ready' && countdown === 0) {
            handleEnterDashboard();
        }
    }, [status, countdown]);

    const handleEnterDashboard = () => {
        localStorage.removeItem('diic_onboarding_progress');
        
        if (isCreative) {
            const roleRoutes = {
                editor: '/workstation/editor',
                filmmaker: '/workstation/filmmaker',
                designer: '/workstation/designer',
                audio: '/workstation/audio',
                community: '/workstation/community-manager',
                photo: '/workstation/photography',
                model: '/workstation/talent',
                web: '/workstation/web',
                print: '/workstation/print',
                event: '/workstation/event'
            };
            const route = roleRoutes[formData.role] || '/dashboard';
            router.push(route);
        } else {
            const finalClientId = finalSlugs.current.clientId || user?.client_id || '';
            const query = finalClientId ? `?client=${finalClientId}` : '';
            router.push(`/dashboard${query}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
            {status !== 'ready' ? (
                // LOADING STATE
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Server className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <div className="space-y-2 text-left bg-black/40 p-6 rounded-xl border border-white/10 font-mono text-sm h-48 overflow-y-auto custom-scrollbar w-80 max-w-full">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-gray-400 flex items-center gap-2"
                            >
                                <span className="text-emerald-500">➜</span> {log}
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-gray-500 animate-pulse font-mono text-[10px] uppercase">Protocolo de Finalización Activo</p>
                    
                    {showForceEnter && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleEnterDashboard}
                            className="group relative w-full mt-6 rounded-2xl p-[2px] overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/20"
                        >
                            <div className="relative bg-[#0A0A12] hover:bg-transparent transition-colors rounded-[14px] py-4 px-6 flex items-center justify-center gap-3">
                                <span className="text-white font-black text-xs uppercase tracking-[0.2em]">🚀 ENTRAR AL DASHBOARD</span>
                                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:text-white" />
                            </div>
                        </motion.button>
                    )}
                </motion.div>
            ) : (
                // SUCCESS STATE
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    {isCreative ? (
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                                {isAlreadyMember ? '¡Bienvenido de Nuevo!' : '¡Entorno Listo!'}
                            </h2>
                            <p className="text-gray-400 text-lg">
                                {isAlreadyMember 
                                    ? 'Tu perfil ha sido actualizado y sincronizado. Tu sistema de producción y de trabajo te espera.'
                                    : `Bienvenido al equipo, ${formData.name || 'Creativo'}. Tu nodo de trabajo está configurado.`
                                }
                            </p>
                            
                            {identityCode && (
                                <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl inline-block">
                                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-2 text-center">Código de Identidad DIIC ZONE</p>
                                    <p className="text-3xl font-black text-white font-mono tracking-widest">{identityCode}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                                Tu espacio está listo.
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Ya puedes comenzar a utilizar DIIC ZONE.
                            </p>
                            
                            <div className="mt-6 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl inline-block w-full">
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-2 text-center">Licencia Activa</p>
                                <p className="text-2xl font-black text-white italic">PRUEBA GRATUITA: 15 DÍAS</p>
                            </div>
                        </div>
                    )}

                    {isCreative && (
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 py-6 border-y border-white/5">
                            <div className="flex flex-col items-center gap-2">
                                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                                <span>Drive Conectado</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Server className="w-5 h-5 text-purple-400" />
                                <span>CRM Activo</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                                <span>Panel de Control</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleEnterDashboard}
                        className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:scale-[1.02] transition-transform shadow-xl hover:shadow-indigo-500/20 flex flex-col items-center justify-center gap-1"
                    >
                        <div className="flex items-center gap-3">
                            🚀 Entrar al Dashboard
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                            Redirigiendo automáticamente en {countdown}s...
                        </span>
                    </button>
                </motion.div>
            )}
        </div>
    );
}
