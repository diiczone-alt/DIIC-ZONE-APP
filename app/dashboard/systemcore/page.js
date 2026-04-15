'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MasterCommandCenter from '@/components/admin/MasterCommandCenter';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function SystemCorePage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking Role Check: In a real app, this would come from an Auth Provider/JWT
        // For DIIC ZONE Internal Architecture:
        const user = {
            role: 'super_admin' // This would be dynamic
        };

        const authorizedRoles = ['super_admin', 'system_admin', 'owner'];

        if (authorizedRoles.includes(user.role)) {
            setIsAuthorized(true);
        } else {
            // Unauthorized: Redirect back to safety
            setTimeout(() => router.push('/dashboard'), 2000);
        }

        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h1>
                <p className="text-gray-400 max-w-xs">
                    No tienes los permisos necesarios para acceder al Modo Sistema de DIIC ZONE.
                </p>
                <div className="mt-8 text-xs text-gray-600 uppercase tracking-widest font-bold">
                    Redirigiendo...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05050A]">
            {/* Header Indicating System Mode */}
            <div className="bg-indigo-600/10 border-b border-indigo-500/20 py-2 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Capa del Sistema Directiva</span>
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                    Salir del Modo Sistema
                </button>
            </div>
            <MasterCommandCenter />
        </div>
    );
}
