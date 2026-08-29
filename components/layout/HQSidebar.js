'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Layout, Users, Clapperboard, Activity,
    DollarSign, Shield, Sparkles, Settings, ShieldCheck,
    CalendarDays, Package, MessageSquare, ChevronLeft, ChevronRight,
    Trophy, ChevronDown, LogOut, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/components/layout/SidebarContext';

export default function HQSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { isMobileOpen, setIsMobileOpen } = useSidebar();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebar-collapsed') === 'true';
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-collapsed', isCollapsed);
            if (isCollapsed) {
                document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
            } else {
                document.documentElement.removeAttribute('data-sidebar-collapsed');
            }
        }
    }, [isCollapsed]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
            localStorage.clear();
            window.location.href = '/';
        }
    };

    const menuItems = [
        { icon: Layout, label: 'HQ CENTRAL', href: '/dashboard/hq', color: 'text-indigo-400', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
        { icon: Trophy, label: 'Mi Progreso', href: '/dashboard/hq/progress', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
        { icon: Users, label: 'Clientes', href: '/dashboard/hq/clients', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
        { icon: DollarSign, label: 'Finanzas', href: '/dashboard/hq/payments', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
        { icon: Shield, label: 'Equipo', href: '/dashboard/hq/team', color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
        { icon: MessageSquare, label: 'Mensajes', href: '/dashboard/hq/messages', color: 'text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/30' },
        { icon: Package, label: 'Servicios', href: '/dashboard/hq/services', color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
        { icon: Activity, label: 'Control Maestro', href: '/dashboard/hq/control', color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
    ];

    return (
        <>
            {/* Mobile Backdrop - Direct sibling to the drawer so the drawer is ALWAYS in front at z-[100] */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[90] lg:hidden cursor-pointer"
                        aria-label="Cerrar menú lateral"
                    />
                )}
            </AnimatePresence>

            <aside 
                className={`fixed left-0 top-0 h-screen w-72 max-w-[85vw] bg-[#08081a] border-r border-white/10 flex flex-col z-[100] shadow-2xl transition-transform duration-300 ease-out lg:w-64 lg:translate-x-0 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Collapse/Expand Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-[#08081a] border border-white/20 hidden md:flex items-center justify-center text-slate-300 hover:text-white hover:border-white/50 transition-all shadow-lg hover:scale-110 z-50 cursor-pointer"
                    title={isCollapsed ? 'Expandir barra' : 'Colapsar barra'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                        <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                </button>

                {/* Logo Area */}
                <div className={`h-24 flex items-center justify-between border-b border-white/10 transition-all duration-300 px-6 ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                            <span className="font-black text-white text-lg tracking-tighter">HQ</span>
                        </div>
                        {/* Always visible on mobile, toggleable on desktop via isCollapsed */}
                        <div className={`transition-all duration-300 overflow-hidden ml-4 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                            <h1 className="font-black text-white leading-none tracking-tight text-lg italic whitespace-nowrap">DIIC ZONE</h1>
                            <span className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] font-black whitespace-nowrap">Internal OS</span>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                        aria-label="Cerrar menú"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 transition-all duration-300 px-4 ${isCollapsed ? 'lg:px-2' : ''} custom-scrollbar`}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="block"
                            >
                                <div className={`flex items-center rounded-xl transition-all duration-200 group relative px-4 py-3 cursor-pointer select-none ${isCollapsed ? 'lg:justify-center lg:p-3.5' : 'gap-3'} ${isActive
                                    ? `${item.bg} ${item.border} border text-white font-bold shadow-lg shadow-black/40`
                                    : 'text-slate-200 hover:text-white hover:bg-white/[0.08] border border-transparent'
                                    }`}>
                                    <item.icon className={`w-5 h-5 shrink-0 transition-all ${isActive ? `${item.color} drop-shadow-[0_0_8px_currentColor]` : `${item.color} opacity-85 group-hover:opacity-100 group-hover:scale-110`}`} />
                                    
                                    {/* Label: Show on desktop when not collapsed, AND always show on mobile */}
                                    <span className={`font-black text-xs uppercase tracking-wider ml-2 whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''} ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                        {item.label}
                                    </span>

                                    {/* Tooltip for collapsed desktop view */}
                                    {isCollapsed && (
                                        <div className="hidden lg:block absolute left-20 bg-[#0c0c24] border border-white/20 text-white text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 shadow-2xl whitespace-nowrap border-l-2 border-l-indigo-500">
                                            {item.label}
                                        </div>
                                    )}

                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className={`absolute left-0 w-1 h-3/5 ${item.color.replace('text', 'bg')} rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)] ${isCollapsed ? 'lg:hidden' : ''}`}
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* System Status */}
                <div className={`transition-all duration-300 px-4 mb-3 ${isCollapsed ? 'lg:px-2 lg:mb-2' : ''}`}>
                    <div className={`bg-black/40 rounded-2xl border border-white/10 relative overflow-hidden group/load flex transition-all duration-300 p-3.5 flex-col ${isCollapsed ? 'lg:p-2.5 lg:justify-center lg:items-center' : ''}`}>
                        {isCollapsed ? (
                            <>
                                <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Core: Online" />
                                <div className="lg:hidden flex justify-between items-center w-full">
                                    <span className="text-[10px] text-slate-300 uppercase font-black tracking-[0.2em]">System Core</span>
                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Online
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-2.5">
                                    <span className="text-[10px] text-slate-300 uppercase font-black tracking-[0.2em]">System Core</span>
                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Online
                                    </span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[15%] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* User Profile / Logout */}
                <div className={`border-t border-white/10 bg-black/40 pb-6 transition-all duration-300 p-4 shrink-0 relative ${isCollapsed ? 'lg:p-2' : ''}`}>
                    <div className="relative">
                        {/* Trigger: Clickable Profile Card */}
                        <button 
                            type="button"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className={`flex items-center rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all relative overflow-hidden w-full text-left bg-indigo-500/[0.05] p-3 gap-3 ${isCollapsed ? 'lg:p-1.5 lg:justify-center' : ''}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                            
                            <div className="relative shrink-0 transition-all">
                                {/* Colorful Avatar Border (HQ Indigo-Purple Style) */}
                                <div 
                                    className="w-9 h-9 rounded-xl p-[1.5px] shadow-lg shadow-black/30 bg-gradient-to-tr from-indigo-500 to-purple-600"
                                >
                                    <div className="w-full h-full rounded-[9px] bg-[#08081a] flex items-center justify-center text-white font-black text-xs uppercase">
                                        {user?.full_name 
                                            ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                                            : (user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD')}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#08081a] rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full border border-[#08081a] bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                </div>
                            </div>

                            <div className={`flex-1 min-w-0 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : ''}`}>
                                <div className="truncate pr-1">
                                    <h4 className="text-xs font-black text-white truncate uppercase tracking-wider leading-tight">
                                        {user?.full_name || 'Admin DIIC'}
                                    </h4>
                                    <p className="text-[9px] text-indigo-300 font-black uppercase tracking-wider opacity-90 leading-none mt-0.5">
                                        {user?.role === 'ADMIN' ? 'Director General' : (user?.role || 'Staff')}
                                    </p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        {/* Popover Profile Menu */}
                        <AnimatePresence>
                            {showProfileMenu && (
                                <>
                                    {/* Backdrop to close dropdown */}
                                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowProfileMenu(false)} />
                                    
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-16 left-0 w-60 bg-[#0E0E18] border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/10 mb-2">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Usuario Administrativo</p>
                                            <p className="text-xs font-bold text-white truncate">
                                                {user?.full_name || 'Admin DIIC'}
                                            </p>
                                            <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mt-1 truncate">{user?.email}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <Link href="/dashboard/hq/settings" onClick={() => { setShowProfileMenu(false); setIsMobileOpen(false); }} className="block w-full">
                                                <ProfileMenuItem 
                                                    as="div"
                                                    icon={<Settings className="w-4 h-4" />} 
                                                    label="Configuración" 
                                                />
                                            </Link>
                                            
                                            <div className="h-px bg-white/10 my-2 mx-2" />
                                            
                                            <ProfileMenuItem 
                                                icon={<LogOut className="w-4 h-4 text-red-400" />} 
                                                label="Cerrar Sesión" 
                                                variant="danger"
                                                onClick={handleLogout}
                                            />
                                        </div>

                                        {/* App Info */}
                                        <div className="p-3 mt-2 bg-black/40 rounded-xl border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nivel 5 / Admin</span>
                                                <span className="text-[9px] font-black text-indigo-400 uppercase">DIIC ZONE</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </aside>
        </>
    );
}

function ProfileMenuItem({ icon, label, onClick, variant = 'default', as = 'button' }) {
    const Component = as;
    return (
        <Component 
            type={Component === 'button' ? 'button' : undefined}
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                variant === 'danger' 
                ? 'text-red-400 hover:bg-red-500/20' 
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
        >
            {icon}
            {label}
        </Component>
    );
}
