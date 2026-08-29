'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/components/layout/SidebarContext';
import HQSidebar from '@/components/layout/HQSidebar';
import { Menu } from 'lucide-react';

export default function HQLayout({ children }) {
    const { user, loading, getHomeRoute } = useAuth();
    const { isMobileOpen, setIsMobileOpen } = useSidebar();
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
            <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
                {/* Mobile Top Bar */}
                <header className="lg:hidden h-16 border-b border-white/5 bg-[#050510]/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-40">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-colors shrink-0 cursor-pointer"
                            aria-label="Abrir menú"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                                <span className="font-black text-white text-xs tracking-tighter">HQ</span>
                            </div>
                            <div className="ml-1">
                                <h1 className="font-black text-white leading-none tracking-tight text-xs italic whitespace-nowrap">DIIC ZONE</h1>
                                <span className="text-[8px] text-indigo-400 uppercase tracking-[0.2em] font-black whitespace-nowrap block mt-0.5">Internal OS</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pl-0 lg:pl-64 pb-24 custom-scrollbar relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
