'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid, CheckSquare, FolderOpen, Clock,
    MessageCircle, Star, GraduationCap, Settings, LogOut,
    ChevronLeft, ChevronRight, Palette, Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CapacityBar } from '@/components/capacity/CapacityComponents';

export default function DesignerSidebar() {
    const [collapsed, setCollapsed] = useState(true);
    const pathname = usePathname();

    const menuItems = [
        { icon: LayoutGrid, label: 'Proyectos', path: '/workstation/designer' },
        { icon: CheckSquare, label: 'Tareas', path: '/workstation/designer/tasks' },
        { icon: FolderOpen, label: 'Archivos', path: '/workstation/designer/files' },
        { icon: Clock, label: 'Tiempos', path: '/workstation/designer/times' },
        { icon: MessageCircle, label: 'Feedback', path: '/workstation/designer/feedback' },
        { icon: Star, label: 'Reputación', path: '/workstation/designer/reputation' },
        { icon: GraduationCap, label: 'Academia', path: '/workstation/designer/academy' },
        { icon: Wallet, label: 'Mi Wallet', path: '/workstation/finance' },
    ];

    return (
        <motion.aside
            initial={{ width: 80 }}
            animate={{ width: collapsed ? 80 : 240 }}
            className="h-screen bg-[#050511] border-r border-white/5 flex flex-col relative z-20 transition-all duration-300"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-30"
            >
                {collapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center font-bold text-white shadow-lg shadow-pink-500/20">
                    <Palette className="w-6 h-6" />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 overflow-hidden"
                    >
                        <span className="block font-bold text-white whitespace-nowrap">Graphic Designer</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Workstation</span>
                    </motion.div>
                )}
            </div>

            {/* Menu */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.path || (item.path !== '/workstation/designer' && pathname.startsWith(item.path));
                    return (
                        <Link key={index} href={item.path}>
                            <div className={`
                                flex items-center p-3 rounded-xl transition-all duration-200 group relative
                                ${isActive ? 'bg-pink-600/10 text-pink-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                ${collapsed ? 'justify-center' : ''}
                            `}>
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-pink-400' : 'group-hover:text-white'}`} />

                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>
                                )}

                                {/* Tooltip for collapsed mode */}
                                {collapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}

                {!collapsed && (
                    <div className="px-3 mt-4 mb-2">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <CapacityBar current={30} max={100} label="Mi Carga" mini />
                        </div>
                    </div>
                )}
            </nav>

            {/* Footer Actions */}
            <div className="p-3 border-t border-white/5">
                <button className={`
                    w-full flex items-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all
                    ${collapsed ? 'justify-center' : ''}
                `}>
                    <Settings className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="ml-3 text-sm font-medium">Ajustes</span>}
                </button>
                <Link href="/login">
                    <button className={`
                        w-full flex items-center p-3 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all mt-1
                        ${collapsed ? 'justify-center' : ''}
                    `}>
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!collapsed && <span className="ml-3 text-sm font-medium">Cerrar Sesión</span>}
                    </button>
                </Link>
            </div>
        </motion.aside>
    );
}
