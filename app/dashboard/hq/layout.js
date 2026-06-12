'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import HQSidebar from '@/components/layout/HQSidebar';

export default function HQLayout({ children }) {
    const { user, loading, getHomeRoute } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ADMIN') {
                console.log('[HQLayout] Unauthorized access, redirecting...');
                const home = getHomeRoute(user?.role);
                router.push(home || '/login');
            }
        }
    }, [user, loading, router, getHomeRoute]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050511] flex flex-col items-center justify-center text-white gap-6">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div className="font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Verificando Credenciales...</div>
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="flex h-screen bg-[#050511] overflow-hidden">
            <HQSidebar />
            <main className="flex-1 overflow-y-auto pl-64 pb-24 custom-scrollbar relative">
                {children}
            </main>
        </div>
    );
}
