'use client';

import Sidebar from '../../components/layout/Sidebar';
import AIAssistant from '../../components/ui/AIAssistant';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext';
import { useAuth } from '@/context/AuthContext';

function DashboardContent({ children }) {
    const { isExpanded, isSuppressed } = useSidebar();
    const pathname = usePathname();

    const isHQ = pathname.startsWith('/dashboard/hq');
    const isCreative = pathname.startsWith('/dashboard/creative-zone');
    const shouldHideSidebar = isSuppressed || isHQ || isCreative;

    return (
        <div className="h-screen bg-[#050511] text-foreground flex overflow-hidden">
            {!shouldHideSidebar && <Sidebar />}
            <main
                className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden`}
            >
                {/* Futurustic Grid & Particles - Hidden in studio mode to avoid visual noise */}
                {!isSuppressed && (
                    <>
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_50%)]" />
                    </>
                )}

                {/* Main Content Area - Padding depends on suppression or route */}
                <div className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${shouldHideSidebar || pathname === '/dashboard/strategy' ? '' : 'p-8'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth(); // Official Auth

    useEffect(() => {
        if (loading) return; // Wait for auth to initialize

        if (!user) {
            router.push('/');
            return;
        }

        const role = user.role || 'CLIENT';
        const home = getHomeRoute(role);
        
        // Guard Logic based on Real Role
        // Guard Logic based on Unified Routing
        if (role === 'ADMIN') {
            const allowedAdminPaths = ['/dashboard/hq', '/dashboard/strategy', '/dashboard/systemcore'];
            if (!allowedAdminPaths.some(p => pathname.startsWith(p))) {
                router.push(home);
            }
        } else if (pathname === '/dashboard' || pathname === '/dashboard/') {
             // If they land on generic dashboard but have a specialized role
             if (home !== '/dashboard') router.push(home);
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return <div className="h-screen bg-[#050511] flex items-center justify-center text-white">Verificando Credenciales...</div>;
    }

    return (
        <SidebarProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </SidebarProvider>
    );
}
