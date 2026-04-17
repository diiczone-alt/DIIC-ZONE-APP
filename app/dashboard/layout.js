'use client';

import DynamicSidebar from '../../components/shared/DynamicSidebar';
import SlimMasterHeader from '../../components/shared/SlimMasterHeader';
import AIAssistant from '../../components/ui/AIAssistant';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function DashboardContent({ children }) {
    const { isExpanded, isSuppressed } = useSidebar();
    const pathname = usePathname();

    const isHQ = pathname.startsWith('/dashboard/hq');
    const isCreative = pathname.startsWith('/dashboard/creative-zone');
    const shouldHideSidebar = isSuppressed || isHQ || isCreative;

    const { user } = useAuth();
    const isClient = user?.role === 'CLIENT';

    return (
        <div className="h-screen bg-[#050511] text-foreground flex overflow-hidden font-sans selection:bg-indigo-500/30">
            {!shouldHideSidebar && <DynamicSidebar />}
            <main
                className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden`}
            >
                {/* ─── Role-Based Header ─── */}
                {!shouldHideSidebar && !isClient && <SlimMasterHeader />}

                {/* ─── Cinematic Neon Hexagon Backdrop ─── */}
                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden bg-[#050510]">
                    {/* Dark Hexagon Base Pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-30">
                        <defs>
                            <pattern id="hexagons" width="104" height="90" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
                                <path 
                                    d="M26 0 L78 0 L104 45 L78 90 L26 90 L0 45 Z" 
                                    fill="none" 
                                    stroke="#2a2a40" 
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexagons)" />
                    </svg>

                    {/* Animated Neon Flows */}
                    <svg className="absolute inset-0 w-full h-full">
                        <defs>
                            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        
                        <AnimatePresence>
                            {/* Fluid Path: Cyan */}
                            <motion.path 
                                d="M 0 45 L 26 90 L 78 90 L 104 45 L 156 45 L 182 90 L 234 90" 
                                stroke="#22d3ee" 
                                strokeWidth="2" 
                                fill="none"
                                filter="url(#neon-glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: [0, 1, 0],
                                    opacity: [0, 0.6, 0],
                                    pathOffset: [0, 1.5]
                                }}
                                transition={{ 
                                    duration: 8, 
                                    repeat: Infinity, 
                                    ease: "linear" 
                                }}
                                className="opacity-40"
                            />

                            {/* Fluid Path: Magenta (Offset) */}
                            <motion.path 
                                d="M 500 200 L 526 245 L 578 245 L 604 200 L 656 200 L 682 245" 
                                stroke="#f472b6" 
                                strokeWidth="2" 
                                fill="none"
                                filter="url(#neon-glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: [0, 1, 0],
                                    opacity: [0, 0.4, 0],
                                    pathOffset: [0, 1]
                                }}
                                transition={{ 
                                    duration: 12, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    delay: 2
                                }}
                                className="opacity-30"
                            />

                            {/* Fluid Path: Gold (Global Scale) */}
                            <motion.path 
                                d="M 800 600 L 852 600 L 878 645 L 930 645 L 956 600 L 1008 600" 
                                stroke="#fbbf24" 
                                strokeWidth="2" 
                                fill="none"
                                filter="url(#neon-glow)"
                                animate={{ 
                                    pathLength: [0, 1, 0],
                                    opacity: [0, 0.5, 0],
                                    pathOffset: [0, 2]
                                }}
                                transition={{ 
                                    duration: 10, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    delay: 5
                                }}
                            />
                        </AnimatePresence>
                    </svg>
                    
                    {/* Ambient Atmospheric Glows */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#050510_90%)]" />
                    <div className="absolute top-1/4 -left-1/4 w-[60rem] h-[60rem] bg-indigo-500/10 rounded-full blur-[12rem] animate-pulse" />
                    <div className="absolute bottom-1/4 -right-1/4 w-[50rem] h-[50rem] bg-cyan-500/5 rounded-full blur-[10rem]" />
                </div>

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
    const { user, loading, getHomeRoute } = useAuth(); // Official Auth

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
        // Guard Logic based on Unified Routing
        const isDashboardBase = pathname === '/dashboard' || pathname === '/dashboard/';
        const isAdminArea = pathname.startsWith('/dashboard/hq');
        const isWorkstationUnderDashboard = pathname.startsWith('/dashboard/editing') || pathname.startsWith('/dashboard/design');

        if (role === 'ADMIN') {
            const allowedAdminPaths = ['/dashboard/hq', '/dashboard/strategy', '/dashboard/systemcore'];
            if (!allowedAdminPaths.some(p => pathname.startsWith(p)) && pathname !== '/dashboard') {
                router.push(home);
            }
        } else {
            // Non-admins should usually be in their home workstation
            // If they are in the generic dashboard area, force them to their homeRoute
            if ((isDashboardBase || isAdminArea) && home !== pathname) {
                console.log(`[DashboardLayout] Restricting access for ${role}. Redirecting to ${home}`);
                router.push(home);
            }
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
