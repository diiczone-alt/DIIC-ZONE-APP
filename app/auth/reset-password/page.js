'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Pequeña espera por si Supabase está procesando el fragmento de URL
                await new Promise(r => setTimeout(r, 1000));
                const { data: { session: retrySession } } = await supabase.auth.getSession();
                if (!retrySession) {
                    setError('Enlace de recuperación inválido o expirado. Por favor, solicita uno nuevo en la página de login.');
                }
            }
            setCheckingSession(false);
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Verificar sesión antes de actualizar
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                setError('El enlace de recuperación ha expirado o no es válido. Por favor, solicita uno nuevo.');
                setLoading(false);
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                setError(updateError.message || 'Error al actualizar la contraseña.');
                setLoading(false);
            } else {
                setSuccess(true);
                // Cerrar sesión después de cambiar clave por seguridad (opcional, pero recomendado)
                await supabase.auth.signOut();
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (err) {
            console.error('Unexpected error during password update:', err);
            setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none" />
            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Nueva Identidad</h1>
                    <p className="text-gray-400 text-sm italic">Establece tu nueva clave de acceso seguro</p>
                </div>

                <div className="p-8 rounded-3xl bg-[#0E0E18] border border-white/10 relative overflow-hidden shadow-2xl">
                    {checkingSession ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500 text-sm italic font-medium">Validando identidad segura...</p>
                        </div>
                    ) : success ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white">¡Contraseña Actualizada!</h3>
                            <p className="text-gray-500 text-sm">Redirigiendo a la terminal de acceso...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center italic">
                                    {error}
                                </div>
                            )}
                            
                            {!error && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-[#1A1A24] text-white rounded-xl px-4 py-3 outline-none border border-white/5 focus:border-emerald-500/50 focus:bg-[#20202A] transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-[#1A1A24] text-white rounded-xl px-4 py-3 outline-none border border-white/5 focus:border-emerald-500/50 focus:bg-[#20202A] transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-4 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Actualizando...' : 'Actualizar Acceso'} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                            
                            {error && error.includes('inválido') && (
                                <button
                                    type="button"
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    Volver al Login <ArrowRight className="w-4 h-4 rotate-180" />
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
