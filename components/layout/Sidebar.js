'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home, LayoutGrid, Clapperboard, BarChart3, Settings, LogOut,
    Kanban, GraduationCap, CalendarDays, Share2, Images, Zap, Bot,
    CreditCard, Megaphone, Award, ChevronDown, ChevronRight, Command, ShoppingBag,
    Network, Box, Users, ShieldAlert, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// Static Items (Always Visible)
const MAIN_ITEMS = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', color: 'text-blue-400' },
    { name: 'Mi Progreso', icon: Zap, href: '/dashboard/profile', color: 'text-yellow-400' },
    { name: 'Zona Creativa', icon: LayoutGrid, href: '/dashboard/studio', color: 'text-fuchsia-400', glow: true },
    { name: 'Flujo de Contenido', icon: Kanban, href: '/dashboard/pipeline', color: 'text-emerald-400' },
    { name: 'Calendarios', icon: CalendarDays, href: '/dashboard/calendar', color: 'text-rose-400', glow: true },
    { name: 'Proyectos', icon: Clapperboard, href: '/dashboard/projects', color: 'text-indigo-400' },
];

// Accordion Groups
const ACCORDION_GROUPS = [
    {
        id: 'strategy',
        title: 'STRATEGIA',
        icon: Network,
        color: 'text-indigo-400',
        items: [
            { name: 'Pizarra de Estrategia', icon: Network, href: '/dashboard/strategy', color: 'text-indigo-400' },
            { name: 'Estudio Creativo 3D', icon: Box, href: '/dashboard/creative-3d', color: 'text-purple-400' },
        ]
    },
    {
        id: 'growth',
        title: 'Crecimiento Digital',
        icon: BarChart3,
        items: [
            { name: 'Planes y Crecimiento', icon: Rocket, href: '/dashboard/growth', color: 'text-cyan-400', special: true },
            { name: 'CRM Inteligente', icon: Users, href: '/dashboard/crm', color: 'text-indigo-400' },
            { name: 'Conectividad & Auto.', icon: Share2, href: '/dashboard/connectivity' },
            { name: 'Ventas & IA', icon: Zap, href: '/dashboard/sales' },
            { name: 'Tienda Online', icon: ShoppingBag, href: '/dashboard/store' },
            { name: 'Analíticas', icon: BarChart3, href: '/dashboard/analytics' },
            { name: 'Finanzas', icon: CreditCard, href: '/dashboard/finance' },
            { name: 'Campañas', icon: Megaphone, href: '/dashboard/campaigns' },
        ]
    },
    {
        id: 'evolution',
        title: 'Aprendizaje y Evolución',
        icon: GraduationCap,
        items: [
            { name: 'Academia', icon: GraduationCap, href: '/dashboard/academy', color: 'text-amber-400', special: true },
            { name: 'IA & Auto', icon: Bot, href: '/dashboard/ai-automation' },
            { name: 'Recompensas', icon: Award, href: '/dashboard/rewards' },
        ]
    }
];

import { useSidebar } from './SidebarContext';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isClientCenterOpen, setIsClientCenterOpen] = useState(false);
    const [openGroup, setOpenGroup] = useState(null); // 'growth' | 'evolution' | null
    const { setIsExpanded } = useSidebar();
    const { user } = useAuth();
    const [hasConnectivity, setHasConnectivity] = useState(true);

    useEffect(() => {
        const checkConnectivity = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('social_analytics')
                .select('id')
                .eq('user_id', user.id);
            
            setHasConnectivity(data && data.length > 0);
        };
        checkConnectivity();
    }, [user]);

    // Auto-expand group if active route is inside
    useEffect(() => {
        ACCORDION_GROUPS.forEach(group => {
            if (group.items.some(item => pathname.startsWith(item.href))) {
                setOpenGroup(group.id);
            }
        });
    }, [pathname]);

    const toggleGroup = (groupId) => {
        setOpenGroup(openGroup === groupId ? null : groupId);
    };

    const renderAccordionGroup = (group) => {
        const isOpen = openGroup === group.id;
        const isActiveGroup = group.items.some(item => pathname.startsWith(item.href));

        // Premium Styles based on ID
        const isGrowth = group.id === 'growth';
        const isEvolution = group.id === 'evolution';
        const isStrategy = group.id === 'strategy';

        let bgClass = "hover:bg-white/5";
        let borderClass = "border border-transparent";
        let textClass = isActiveGroup ? "text-white" : "text-gray-400 hover:text-white";

        if (isStrategy) {
            bgClass = isActiveGroup
                ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/40 shadow-lg shadow-indigo-900/20"
                : "bg-gradient-to-r from-indigo-900/10 to-purple-900/10 hover:from-indigo-900/20 hover:to-purple-900/20";
            borderClass = "border border-indigo-500/30";
            textClass = isActiveGroup ? "text-indigo-100" : "text-indigo-200/70 hover:text-indigo-100";
        }

        if (isGrowth) {
            bgClass = isActiveGroup
                ? "bg-gradient-to-r from-blue-900/40 to-cyan-900/40 shadow-lg shadow-blue-900/20"
                : "bg-gradient-to-r from-blue-900/10 to-cyan-900/10 hover:from-blue-900/20 hover:to-cyan-900/20";
            borderClass = "border border-blue-500/30";
            textClass = isActiveGroup ? "text-blue-100" : "text-blue-200/70 hover:text-blue-100";
        }

        if (isEvolution) {
            bgClass = isActiveGroup
                ? "bg-gradient-to-r from-amber-900/40 to-orange-900/40 shadow-lg shadow-amber-900/20"
                : "bg-gradient-to-r from-amber-900/10 to-orange-900/10 hover:from-amber-900/20 hover:to-orange-900/20";
            borderClass = "border border-amber-500/30";
            textClass = isActiveGroup ? "text-amber-100" : "text-amber-200/70 hover:text-amber-100";
        }

        return (
            <div key={group.id} className="overflow-hidden mt-3">
                {/* Group Header Button */}
                <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group/header mb-1 ${bgClass} ${borderClass} ${textClass}`}
                >
                    <div className="flex items-center gap-4">
                        <group.icon className={`w-5 h-5 shrink-0 transition-colors ${isActiveGroup ? 'text-white' : 'text-current group-hover/header:text-white'}`} />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-left flex-1">
                            {group.title}
                        </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {/* Group Content (Collapsible) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-black/20 rounded-xl my-1"
                        >
                            <div className="py-2 space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href} className="block pl-12 pr-3">
                                            <div className={`flex items-center justify-between py-2 rounded-lg transition-colors ${isActive ? (item.color || 'text-indigo-400') + ' font-medium' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'} ${item.special ? 'bg-amber-500/10 border border-amber-500/20 my-1' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    {!isActive && !item.special && <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />}
                                                    {isActive && <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${item.color?.replace('text-', 'bg-') || 'bg-indigo-500'}`} />}
                                                    {item.special && !isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                    <span className={`text-xs ${item.special ? 'text-amber-400 font-bold' : ''}`}>{item.name}</span>
                                                </div>
                                                
                                                {/* Connectivity Alert Badge */}
                                                {item.href === '/dashboard/connectivity' && !hasConnectivity && (
                                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className="group w-[72px] hover:w-[260px] h-full border-r border-white/5 bg-[#050510]/95 backdrop-blur-xl flex flex-col z-50 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shadow-2xl shadow-black/50 shrink-0 relative"
        >
            {/* Logo */}
            <div className="h-20 flex items-center justify-center group-hover:justify-start group-hover:px-6 transition-all duration-300 shrink-0 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20 z-10">
                    <Command className="w-6 h-6 text-white" />
                </div>
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                <h1 className="ml-3 text-lg font-black font-display text-white tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                    CLIENT <span className="text-indigo-500 italic">HUB</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 mt-2 overflow-y-auto custom-scrollbar pt-2 pb-4 space-y-1">

                {/* 1. Main Items (Flat List) */}
                {MAIN_ITEMS.map((item, index) => (
                    <div key={item.href}>
                        <Link href={item.href} className="block">
                            <div
                                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden group/item ${pathname === item.href
                                    ? 'bg-white/10 text-white'
                                    : item.glow
                                        ? 'bg-gradient-to-r from-fuchsia-900/20 to-purple-900/10 border border-fuchsia-500/20 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="activeTabStudio"
                                        className="absolute left-0 top-1 bottom-1 w-1 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${pathname === item.href ? 'text-indigo-400' : (item.color || 'text-gray-500')} ${item.glow ? 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]' : ''}`} />
                                <span className={`text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${item.glow ? 'text-fuchsia-100' : ''}`}>
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                        
                        {/* INYECCIÓN DE STRATEGIA DEBAJO DE ZONA CREATIVA (índice 2) */}
                        {index === 2 && ACCORDION_GROUPS.filter(g => g.id === 'strategy').map(renderAccordionGroup)}
                    </div>
                ))}

                <div className="my-2 border-t border-white/5" />

                {/* 2. Other Accordion Groups */}
                {ACCORDION_GROUPS.filter(g => g.id !== 'strategy').map(renderAccordionGroup)}

            </nav>

            {/* System Footer (Fixed) - Premium User Profile */}
            <div className="p-4 pb-8 border-t border-white/5 bg-black/20 shrink-0 relative z-50">
                <div className="relative group/profile">

                    {/* Premium Profile Card */}
                    <div className="flex items-center gap-3 p-2 rounded-2xl bg-indigo-500/5 border border-white/5 group-hover/profile:bg-indigo-500/10 transition-all relative overflow-hidden group/item w-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        
                        <div className="relative shrink-0 ml-1.5 group-hover:ml-0 transition-all">
                            {/* Colorful Avatar Border (Master Admin Style) */}
                            <div className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 shadow-lg shadow-indigo-500/20">
                                <div className="w-full h-full rounded-[9px] bg-[#050510] flex items-center justify-center text-white font-black text-[10px]">
                                    {(user?.user_metadata?.full_name || user?.full_name || 'DZ').substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#050510] rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full border border-[#050510] shadow-[0_0_8px_#10b981]" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h4 className="text-[10px] font-black text-white truncate uppercase tracking-tight leading-tight">
                                {user?.user_metadata?.brand || 'DIIC Admin'}
                            </h4>
                            <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest opacity-80 leading-none mt-0.5">
                                {user?.user_metadata?.city || 'Centro de Mando'}
                            </p>
                        </div>

                        {/* Quick Settings Icon */}
                        <Link href="/dashboard/settings" title="Configuración" className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-white transition-all shrink-0">
                            <Settings className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Integrated Logout Button */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 h-0 group-hover:h-auto overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                localStorage.clear();
                                window.location.href = '/';
                            }}
                            className="w-full h-11 flex items-center gap-4 px-3 rounded-2xl bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 transition-all group/logout active:scale-95 shadow-xl"
                        >
                            <LogOut className="w-4.5 h-4.5 shrink-0 transition-transform group-hover/logout:rotate-12" />
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                    Cerrar Sesión
                                </span>
                                <span className="text-[7px] font-bold uppercase opacity-60 tracking-widest leading-none">Salir del Hub</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

        </aside>
    );
}
