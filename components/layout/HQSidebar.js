'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Layout, Users, Clapperboard, Activity,
    DollarSign, Shield, Sparkles, Settings, ShieldCheck,
    CalendarDays, Package, MessageSquare, ChevronLeft, ChevronRight,
    Trophy, ChevronDown, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function HQSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
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
        { icon: Layout, label: 'HQ CENTRAL', href: '/dashboard/hq', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { icon: Trophy, label: 'Mi Progreso', href: '/dashboard/hq/progress', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { icon: Users, label: 'Clientes', href: '/dashboard/hq/clients', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { icon: DollarSign, label: 'Finanzas', href: '/dashboard/hq/payments', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { icon: Shield, label: 'Equipo', href: '/dashboard/hq/team', color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { icon: MessageSquare, label: 'Mensajes', href: '/dashboard/hq/messages', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { icon: Package, label: 'Servicios', href: '/dashboard/hq/services', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { icon: Activity, label: 'Control Maestro', href: '/dashboard/hq/control', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#08081a] border-r border-white/5 flex flex-col z-50">
            {/* Collapse/Expand Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-[#08081a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all shadow-lg hover:scale-110 z-50 cursor-pointer"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                )}
            </button>

            {/* Logo Area */}
            <div className={`h-24 flex items-center border-b border-white/5 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-8'}`}>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                    <span className="font-black text-white text-lg tracking-tighter">HQ</span>
                </div>
                {!isCollapsed && (
                    <div className="transition-all duration-300 overflow-hidden ml-4">
                        <h1 className="font-black text-white leading-none tracking-tight text-lg italic whitespace-nowrap">DIIC ZONE</h1>
                        <span className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] font-black whitespace-nowrap">Internal OS</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto py-8 space-y-2 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={`flex items-center rounded-2xl transition-all duration-300 group relative ${isCollapsed ? 'justify-center p-3.5' : 'gap-3 px-5 py-3.5'} ${isActive
                                ? `${item.bg} text-white`
                                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                }`}>
                                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? item.color : 'group-hover:text-white'}`} />
                                {!isCollapsed && (
                                    <span className="font-black text-[11px] uppercase tracking-widest ml-3 whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}

                                {isCollapsed && (
                                    <div className="absolute left-20 bg-[#08081a] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 shadow-2xl whitespace-nowrap border-l-2 border-l-indigo-500">
                                        {item.label}
                                    </div>
                                )}

                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className={`absolute left-0 w-1 h-3/5 ${item.color.replace('text', 'bg')} rounded-r-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* System Status */}
            <div className={`transition-all duration-300 ${isCollapsed ? 'px-2 mb-2' : 'px-6 mb-4'}`}>
                <div className={`bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden group/load flex transition-all duration-300 ${isCollapsed ? 'p-2.5 justify-center' : 'p-4 flex-col'}`}>
                    {isCollapsed ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Core: Online" />
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em]">System Core</span>
                                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Online
                                </span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[12%] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* User Profile / Logout */}
            <div className={`border-t border-white/5 bg-black/20 pb-8 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'} shrink-0 relative`}>
                <div className="relative">
                    {/* Trigger: Clickable Profile Card */}
                    <button 
                        type="button"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`flex items-center rounded-2xl border border-white/5 hover:bg-white/5 transition-all relative overflow-hidden w-full text-left bg-indigo-500/[0.03] ${isCollapsed ? 'p-1.5 justify-center' : 'p-3 gap-3'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                        
                        <div className="relative shrink-0 transition-all">
                            {/* Colorful Avatar Border (HQ Indigo-Purple Style) */}
                            <div 
                                className="w-9 h-9 rounded-xl p-[1.5px] shadow-lg shadow-black/20 bg-gradient-to-tr from-indigo-500 to-purple-600"
                            >
                                <div className="w-full h-full rounded-[9px] bg-[#08081a] flex items-center justify-center text-white font-black text-xs uppercase">
                                    {user?.full_name 
                                        ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                                        : (user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD')}
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#08081a] rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full border border-[#08081a] bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                            </div>
                        </div>

                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 flex items-center justify-between">
                                <div className="truncate pr-1">
                                    <h4 className="text-[10px] font-black text-white truncate uppercase tracking-widest leading-tight">
                                        {user?.full_name || 'Admin DIIC'}
                                    </h4>
                                    <p className="text-[8px] text-indigo-400 font-black uppercase tracking-wider opacity-80 leading-none mt-0.5">
                                        {user?.role === 'ADMIN' ? 'Director General' : (user?.role || 'Staff')}
                                    </p>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </div>
                        )}
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
                                    className="absolute bottom-14 left-0 w-60 bg-[#0E0E18]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/5 mb-2">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Usuario Administrativo</p>
                                        <p className="text-xs font-bold text-white truncate">
                                            {user?.full_name || 'Admin DIIC'}
                                        </p>
                                        <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1 truncate">{user?.email}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Link href="/dashboard/hq/settings" onClick={() => setShowProfileMenu(false)} className="block w-full">
                                            <ProfileMenuItem 
                                                as="div"
                                                icon={<Settings className="w-4 h-4" />} 
                                                label="Configuración" 
                                            />
                                        </Link>
                                        
                                        <div className="h-px bg-white/5 my-2 mx-2" />
                                        
                                        <ProfileMenuItem 
                                            icon={<LogOut className="w-4 h-4" />} 
                                            label="Cerrar Sesión" 
                                            variant="danger"
                                            onClick={handleLogout}
                                        />
                                    </div>

                                    {/* App Info */}
                                    <div className="p-4 mt-2 bg-black/20 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Nivel 5 / Admin</span>
                                            <span className="text-[8px] font-black text-indigo-400 uppercase">DIIC ZONE</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </aside>
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
                ? 'text-red-400 hover:bg-red-500/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            {label}
        </Component>
    );
}
