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
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[LoginPage] handleSubmit starting');
        setError('');
        setLoading(true);

        try {
            console.log('[LoginPage] Calling login()');
            const { role } = await login(email, password);
            console.log('[LoginPage] login() returned role:', role);
            
            // Redirect happens here, so we DON'T set loading to false. We let it stay 'Verificando...' while router navigates!
            if (role === 'ADMIN') {
                console.log('[LoginPage] pushing to /admin/strategy/map');
                router.push('/admin/strategy/map');
            } else if (role === 'CLIENT') {
                console.log('[LoginPage] pushing to /dashboard');
                router.push('/dashboard');
            } else {
                console.log(`[LoginPage] pushing to /dashboard/creative-zone/${role.toLowerCase()}`);
                router.push(`/dashboard/creative-zone/${role.toLowerCase()}`);
            }
        } catch (err) {
            console.error('[LoginPage] Login failed:', err);
            setError('Credenciales incorrectas o acceso no autorizado.');
            setLoading(false); // Only stop loading if there was an actual error
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

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-4 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Verificando...' : 'Acceder al Sistema'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
