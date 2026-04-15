'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Layout, Users, Clapperboard, Activity,
    DollarSign, Shield, Sparkles, Settings, ShieldCheck,
    CalendarDays, Package
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HQSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: Layout, label: 'GOD MODE', href: '/dashboard/hq', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { icon: Users, label: 'Clientes', href: '/dashboard/hq/clients', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { icon: DollarSign, label: 'Finanzas', href: '/dashboard/hq/payments', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { icon: Shield, label: 'Equipo', href: '/dashboard/hq/team', color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { icon: Package, label: 'Servicios', href: '/dashboard/hq/services', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { icon: Activity, label: 'Control Maestro', href: '/dashboard/hq/control', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#08081a] border-r border-white/5 flex flex-col z-50">
            {/* Logo Area */}
            <div className="h-24 flex items-center px-8 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mr-4 shadow-lg shadow-indigo-600/20">
                    <span className="font-black text-white text-lg tracking-tighter">HQ</span>
                </div>
                <div>
                    <h1 className="font-black text-white leading-none tracking-tight text-lg italic">DIIC ZONE</h1>
                    <span className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] font-black">Internal OS</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? `${item.bg} text-white`
                                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                }`}>
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? item.color : 'group-hover:text-white'}`} />
                                <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>

                                {isActive && (
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

            {/* System Status - Migrated from Legacy Admin */}
            <div className="px-6 mb-4">
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 relative overflow-hidden group/load">
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
                </div>
            </div>

            {/* User Profile / Logout */}
            <div className="p-6 border-t border-white/5 bg-black/20 pb-10">
                <div className="flex items-center gap-3 w-full px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center font-black text-white shadow-lg">
                        A
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-black text-white uppercase tracking-widest">Admin</div>
                        <div className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">Director General</div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all group font-black uppercase text-[10px] tracking-[0.2em] border border-rose-500/20"
                >
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
