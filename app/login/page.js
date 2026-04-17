'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    ShieldCheck, User, Palette, Video, Clapperboard,
    Mic, Camera, ArrowRight, MessageSquare, UserCheck, Globe, Printer
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const { login, signInWithGoogle, resetPassword, getHomeRoute } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[LoginPage] handleSubmit starting');
        setError('');
        setLoading(true);
        
        // Safety Timeout: 15 seconds
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn('[LoginPage] Login timeout reached (15s)');
                setLoading(false);
                setError('La conexión está tardando demasiado. Por favor, intenta de nuevo o revisa tu conexión.');
            }
        }, 15000);

        try {
            console.log('[LoginPage] Calling login()');
            const { role, error: loginError } = await login(email, password);
            
            // Clear timeout if we get a response
            clearTimeout(timeoutId);

            if (loginError) {
                console.warn('[LoginPage] Login error received (expected):', loginError);
                setError('Credenciales incorrectas o acceso no autorizado.');
                setLoading(false);
                return;
            }

            console.log('[LoginPage] login() success with role:', role);
            const home = getHomeRoute(role);
            console.log(`[LoginPage] Redirecting ${role} to ${home}`);
            router.push(home);
        } catch (err) {
            clearTimeout(timeoutId);
            console.error('[LoginPage] Unexpected exception during handleSubmit (FATAL):', err);
            setError('Error inesperado al iniciar sesión. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError('Por favor, ingresa tu correo electrónico.');
            return;
        }
        setError('');
        setSuccess('');
        setResetLoading(true);
        try {
            await resetPassword(email);
            setSuccess('Se ha enviado un enlace de recuperación a tu correo.');
        } catch (err) {
            console.error('Reset failed:', err);
            setError('Error al enviar el correo de recuperación.');
        } finally {
            setResetLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error('Google login failed:', err);
            setError('Error al conectar con Google.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[128px]" />

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">DIIC ZONE OS</h1>
                    <p className="text-gray-400 text-sm">Ingreso Seguro a tu Plataforma de Monitoreo</p>
                </div>

                <div className="p-8 rounded-3xl bg-[#0E0E18] border border-white/10 relative overflow-hidden shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium text-center">
                                {success}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1A1A24] text-white rounded-xl px-4 py-3 outline-none border border-white/5 focus:border-indigo-500/50 focus:bg-[#20202A] transition-all"
                                placeholder="tu@empresa.com"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contraseña</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1A1A24] text-white rounded-xl px-4 py-3 outline-none border border-white/5 focus:border-indigo-500/50 focus:bg-[#20202A] transition-all pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[34px] text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>

                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                disabled={resetLoading}
                                className="text-[10px] font-bold text-gray-500 hover:text-indigo-400 uppercase tracking-widest transition-all"
                            >
                                {resetLoading ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-4 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Verificando...' : 'Acceder al Sistema'} <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0E0E18] px-2 text-gray-600 font-bold tracking-widest">O continúa con</span></div>
                        </div>

                        <button 
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-3.5 font-bold transition-all flex items-center justify-center gap-3 group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5.04c1.94 0 3.14.83 3.88 1.52l2.84-2.84C16.96 2.11 14.7 1 12 1 7.48 1 3.66 3.62 1.88 7.37l3.37 2.61C6.07 7.02 8.81 5.04 12 5.04z" />
                                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.92 3.71-8.7z" />
                                <path fill="#FBBC05" d="M5.25 14.76c-.26-.76-.41-1.57-.41-2.41s.15-1.65.41-2.41L1.88 7.37C1.21 8.78.82 10.35.82 12s.39 3.22 1.06 4.63l3.37-2.61z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.71-2.88c-1.01.68-2.31 1.08-3.57 1.08-3.19 0-5.93-1.98-6.91-4.93l-3.37 2.61C3.66 20.38 7.48 23 12 23z" />
                            </svg>
                            Ingresar con Google
                        </button>

                        <div className="pt-4 border-t border-white/5 mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => router.push('/onboarding?type=client')}
                                className="text-gray-500 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-all"
                            >
                                ¿Sin cuenta? Crear Nueva Identidad
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
