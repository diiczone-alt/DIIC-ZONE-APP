'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function TikTokCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('processing');
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setError(`TikTok Error: ${errorParam}`);
                setStatus('error');
                return;
            }

            if (!code) {
                // Si no hay código pero sí terminó la carga, mostrar error
                setError('No se recibió el código de autorización.');
                setStatus('error');
                return;
            }

            try {
                // Obtener sesión actual
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    throw new Error("No se encontró una sesión activa. Por favor, inicia sesión de nuevo.");
                }

                // Llamar a nuestra Edge Function con PKCE
                const verifier = localStorage.getItem('tiktok_code_verifier');

                const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tiktok-connect`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify({ 
                        code,
                        code_verifier: verifier
                    })
                });

                const result = await response.json();

                if (!response.ok || result.error) {
                    throw new Error(result.error || 'Error desconocido en la función de sincronización');
                }

                setStatus('success');
                toast.success(`TikTok (${result.display_name}) conectado correctamente`);
                
                // Redirigir de vuelta al onboarding después de un breve delay
                setTimeout(() => {
                    router.push('/onboarding?status=social_connected');
                }, 2000);

            } catch (err) {
                console.error('Callback error:', err);
                setError(err.message);
                setStatus('error');
                toast.error('Error al sincronizar TikTok');
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full space-y-8 bg-[#0A0A12] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
        >
            {/* Background decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

            {status === 'processing' && (
                <div className="space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                        <Loader2 className="w-20 h-20 text-indigo-500 animate-spin absolute inset-0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Estableciendo Protocolo</h1>
                        <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">SYNCING_TIKTOK_DATA_STREAM</p>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-6">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                    >
                        <CheckCircle2 className="w-10 h-10 text-black" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Sincronización Exitosa</h1>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">CONEXIÓN_VERIFICADA_Y_ACTIVA</p>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-6">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto"
                    >
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-red-500">Error de Protocolo</h1>
                        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                            <p className="text-gray-400 text-[10px] font-mono leading-relaxed">{error}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => router.push('/onboarding')}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                    >
                        Regresar a la Central
                    </button>
                </div>
            )}
        </motion.div>
    );
}

export default function TikTokCallback() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white text-center font-sans selection:bg-indigo-500/30">
            <Suspense fallback={
                <div className="space-y-6 animate-pulse">
                    <div className="w-20 h-20 bg-white/5 rounded-full mx-auto" />
                    <div className="h-8 w-48 bg-white/5 mx-auto rounded" />
                </div>
            }>
                <TikTokCallbackContent />
            </Suspense>
        </div>
    );
}
