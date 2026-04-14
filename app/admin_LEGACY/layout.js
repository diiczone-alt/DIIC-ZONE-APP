'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, Settings,
    Shield, Activity, DollarSign, LogOut,
    Briefcase, Palette, CalendarDays, Map
} from 'lucide-react';

import NotificationCenter from '@/components/ui/NotificationCenter';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard Maestro', path: '/admin', color: 'text-blue-400' },
        { icon: Users, label: 'Control de Clientes', path: '/admin/users', color: 'text-emerald-400' },
        { icon: Map, label: 'Mapa Estratégico', path: '/admin/strategy/map', color: 'text-indigo-400' },
        { icon: Briefcase, label: 'CRM / Pipeline IA', path: '/admin/crm', color: 'text-amber-400' },
        { icon: DollarSign, label: 'Monetización & Planes', path: '/admin/monetization', color: 'text-yellow-400' },
        { icon: CalendarDays, label: 'Planner de Contenido', path: '/admin/strategy/planner', color: 'text-rose-400' },
        { icon: Activity, label: 'Métricas & Resultados', path: '/admin/strategy/results', color: 'text-cyan-400' },
        { icon: Palette, label: 'Equipo Operativo', path: '/admin/creative', color: 'text-purple-400' },
        { icon: Settings, label: 'Ajustes Hub', path: '/admin/settings', color: 'text-gray-400' },
    ];

    return (
        <div className="flex h-screen bg-[#050511] text-white font-sans overflow-hidden">
            {/* Admin Sidebar */}
            <aside 
                className={`bg-[#0A0A12] border-r border-amber-500/10 flex flex-col z-20 shadow-2xl shadow-amber-900/10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${
                    isCollapsed ? 'w-24' : 'w-72'
                }`}
            >
                {/* Collapse Toggle */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-amber-500/20 hover:scale-110 transition-transform z-30"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <div className={`h-22 flex items-center px-6 border-b border-white/5 transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black shrink-0 shadow-lg shadow-amber-500/20">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div className={`transition-all duration-500 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                            <h1 className="font-black text-lg tracking-tight text-white whitespace-nowrap">DIIC ADMIN</h1>
                            <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase leading-none">God Mode</p>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <NotificationCenter />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                                    isActive 
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-900/10' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                } ${isCollapsed ? 'justify-center px-0' : 'gap-4'}`}
                            >
                                <Icon className={`w-5.5 h-5.5 shrink-0 transition-all duration-300 ${
                                    isActive ? 'text-amber-400' : (item.color || 'text-gray-500 group-hover:text-white')
                                } ${isCollapsed ? 'scale-110' : ''}`} />
                                
                                <span className={`text-[13px] font-black tracking-tight whitespace-nowrap transition-all duration-500 ${
                                    isCollapsed ? 'opacity-0 w-0 overflow-hidden translate-x-4' : 'opacity-100 w-auto'
                                }`}>
                                    {item.label}
                                </span>

                                {isActive && isCollapsed && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-amber-500 rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                 <div className={`p-4 pb-24 border-t border-white/5 space-y-6 bg-black/40 transition-all duration-500 ${isCollapsed ? 'px-2' : 'p-4'}`}>
                    <div className={`bg-[#050511] rounded-2xl p-4 border border-white/5 shadow-2xl shadow-black relative overflow-hidden group/load transition-all duration-500 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden p-0' : 'opacity-100'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover/load:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-center mb-3 relative z-10">
                            <span className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] leading-none">System Core</span>
                            <span className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] leading-none flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative z-10">
                            <div className="h-full w-[12%] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_12px_#10b981]" />
                        </div>
                        <div className="mt-2 flex justify-between items-center relative z-10">
                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Server Load</span>
                            <span className="text-[8px] text-gray-400 font-black tracking-widest">12.4%</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }}
                        className={`w-full py-4 flex flex-col items-center justify-center gap-1 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/10 rounded-2xl transition-all font-black shadow-2xl group/logout active:scale-95 ${isCollapsed ? 'h-14 py-0' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className={`w-4 h-4 transition-transform group-hover/logout:rotate-12 ${isCollapsed ? 'w-5 h-5' : ''}`} />
                            {!isCollapsed && <span className="text-[10px] uppercase tracking-[0.2em]">Cerrar Sesión</span>}
                        </div>
                        {!isCollapsed && <span className="text-[7px] uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100">Exit God Mode</span>}
                    </button>
                </div>
            </aside>

            {/* Main Admin Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                {/* Subtle Background Pattern - Resizes with layout */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] transition-all duration-500" style={{ backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
