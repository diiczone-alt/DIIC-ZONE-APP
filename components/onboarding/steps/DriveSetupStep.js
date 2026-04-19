'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { driveService } from '@/services/driveService';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Folder, CheckCircle, HardDrive, AlertCircle, Cloud } from 'lucide-react';
import { toast } from 'sonner';

export default function DriveSetupStep({ onNext, updateData, data }) {
    const { session, loading } = useAuth();
    const [status, setStatus] = useState('initializing'); // initializing, idle, connecting, creating, complete, error
    const [folders, setFolders] = useState([]);
    const [currentAction, setCurrentAction] = useState('Verificando estado de sincronización...');
    const [error, setError] = useState(null);
    const [showBypass, setShowBypass] = useState(false);
    const [showRescue, setShowRescue] = useState(false);

    const [selectedCloud, setSelectedCloud] = useState('google');

    const clouds = [
        {
            id: 'google',
            name: 'Google Drive',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
            ),
            description: 'Sincronización nativa y carpetas automáticas.',
            active: true
        },
        {
            id: 'dropbox',
            name: 'Dropbox',
            icon: <div className="w-8 h-8 text-blue-500"><Cloud /></div>,
            description: 'Sincronización experimental activa.',
            active: true
        },
        {
            id: 'onedrive',
            name: 'OneDrive',
            icon: <div className="w-8 h-8 text-blue-400"><Cloud /></div>,
            description: 'Sincronización experimental activa.',
            active: true
        }
    ];

    const providerToken = session?.provider_token;

    useEffect(() => {
        // --- SENSOR DE CAPTURA RELÁMPAGO (BAJO NIVEL) ---
        const scanForToken = () => {
            try {
                const hash = window.location.hash;
                if (hash && hash.includes('provider_token')) {
                    const params = new URLSearchParams(hash.substring(1));
                    const token = params.get('provider_token');
                    if (token) {
                        console.log('[DriveSetupStep] ¡Llave detectada en URL! Captura directa exitosa.');
                        localStorage.setItem('diic_google_token', token);
                        
                        // Limpiar URL para seguridad
                        window.history.replaceState(null, null, window.location.pathname);
                        onNext();
                        return true;
                    }
                }
            } catch (e) {
                console.warn('Error en sensor de URL:', e);
            }
            return false;
        };

        if (scanForToken()) return;

        if (loading) return; // Esperar a que la sesión se hidrate

        // Si ya tenemos datos de drive o el token, avanzamos al FINAL (Paso 15)
        if (data.driveData || providerToken) {
            console.log('[DriveSetupStep] Conexión verificada. Procediendo al cierre del ecosistema...');
            onNext();
            return;
        }

        // Si recordamos que estábamos esperando (vuelta de OAuth)
        const waitingForGoogle = localStorage.getItem('diic_waiting_oauth') === 'true';
        if (waitingForGoogle && !providerToken && status === 'initializing') {
            setStatus('connecting');
            setCurrentAction('Validando acceso con Google Drive...');
            return;
        }

        if (status === 'initializing') {
            const timer = setTimeout(() => {
                setStatus('idle');
                setCurrentAction('');
            }, 4000); 
            return () => clearTimeout(timer);
        }

        // Aumentar la paciencia del bypass
        const bypassTimer = setTimeout(() => {
            if (status !== 'creating' && status !== 'complete') {
                setShowBypass(true);
            }
        }, 30000);
        return () => clearTimeout(bypassTimer);

    }, [providerToken, data.driveData, status, loading]);

    // Timer de Rescate Independiente (Para evitar reseteos por render)
    useEffect(() => {
        let rescueTimer;
        if (status === 'connecting' && !providerToken) {
            rescueTimer = setTimeout(() => {
                setShowRescue(true);
            }, 4000);
        } else {
            setShowRescue(false);
        }
        return () => {
            if (rescueTimer) clearTimeout(rescueTimer);
        };
    }, [status, providerToken]);

    const handleConnectClick = async () => {
        if (selectedCloud === 'google') {
            try {
                localStorage.setItem('diic_waiting_oauth', 'true');
                setStatus('connecting');
                await driveService.connectGoogle();
            } catch (err) {
                setError(err.message);
                setStatus('error');
            }
        } else {
            toast.info(`Iniciando protocolo de enlace con ${selectedCloud.toUpperCase()}...`);
            setStatus('connecting');
            setTimeout(() => {
                toast.success(`Conexión con ${selectedCloud.toUpperCase()} establecida (Modo Demo).`);
                onNext();
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 max-w-4xl mx-auto py-10 relative">
            
            <div className="space-y-4 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        Ecosistema Digital
                    </span>
                    <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
                        {status === 'idle' && <>Cloud <span className="text-indigo-500">Sync</span></>}
                        {status === 'connecting' && <>Conectando <span className="text-indigo-500">Cloud</span></>}
                        {status === 'error' && <>Error de <span className="text-red-500">Protocolo</span></>}
                    </h2>
                </motion.div>
                
                <p className="text-gray-400 text-sm max-w-lg mx-auto font-medium leading-relaxed">
                    {status === 'idle' ? 'Vincular el almacenamiento cloud es el paso final para activar tu entorno de trabajo inteligente.' : currentAction}
                </p>
                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 justify-center max-w-sm mx-auto">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-400 font-mono text-[10px] uppercase tracking-wider">{error}</p>
                    </div>
                )}
            </div>

            {status === 'idle' && !providerToken ? (
                <div className="w-full space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 max-w-4xl mx-auto">
                        {clouds.map((cloud) => (
                            <motion.button
                                key={cloud.id}
                                whileHover={cloud.active ? { scale: 1.02, translateY: -5 } : {}}
                                whileTap={cloud.active ? { scale: 0.98 } : {}}
                                onClick={() => cloud.active && setSelectedCloud(cloud.id)}
                                className={`relative p-8 rounded-[2.5rem] border transition-all text-left flex flex-col items-center gap-4 ${
                                    selectedCloud === cloud.id 
                                        ? 'bg-white/10 border-indigo-500 shadow-[0_20px_40px_rgba(79,70,229,0.15)]' 
                                        : 'bg-black/20 border-white/5 hover:border-white/10'
                                } ${!cloud.active && 'opacity-30 cursor-not-allowed'}`}
                            >
                                {selectedCloud === cloud.id && (
                                    <div className="absolute top-6 right-6 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                
                                <div className={`p-5 rounded-3xl ${selectedCloud === cloud.id ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                                    {cloud.icon}
                                </div>
                                
                                <div className="text-center">
                                    <h3 className="font-black text-white text-base mb-1">{cloud.name}</h3>
                                    <p className="text-[9px] text-gray-500 leading-tight uppercase tracking-tight font-black">{cloud.description}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className="w-full max-w-sm mx-auto space-y-6">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConnectClick}
                            className="group relative w-full rounded-[2rem] p-1 overflow-hidden transition-all shadow-2xl shadow-indigo-500/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-[#0A0A12]/90 backdrop-blur-xl rounded-[1.9rem] flex items-center justify-center gap-4 py-5 px-10 text-white font-black text-lg uppercase tracking-[0.2em] border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                                <span>CONECTAR <span className="text-indigo-400">CLOUD</span></span>
                            </div>
                        </motion.button>

                        {showBypass && (
                            <button
                                onClick={() => {
                                    toast.warning('Sincronización omitida. Finalizando entorno...');
                                    onNext();
                                }}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-all"
                            >
                                Finalizar y Entrar al Dashboard
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center gap-12">
                     <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full opacity-50" />
                        <div className={`w-40 h-40 rounded-[3.5rem] flex items-center justify-center transition-all duration-1000 relative z-10 border bg-white/[0.03] border-white/10 text-white`}>
                            <div className="relative">
                                <Loader2 className="w-20 h-20 animate-spin opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                        <HardDrive className="w-10 h-10 text-indigo-500" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-sm space-y-4">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                className="h-full rounded-full relative bg-indigo-500"
                            />
                        </div>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block font-mono">
                            VERIFICANDO ACCESO CON GOOGLE...
                        </span>
                    </div>

                    {showRescue && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => {
                                setShowRescue(false);
                                handleConnectClick();
                            }}
                            className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-[10px] font-black text-red-400 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            ¿Tarda mucho? Reintentar Verificación
                        </motion.button>
                    )}
                </div>
            )}

            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}

