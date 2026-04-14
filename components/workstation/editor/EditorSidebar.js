'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Inbox, Clapperboard, FileText, Folder, CheckCircle,
    Star, GraduationCap, Settings, ChevronLeft, ChevronRight,
    LogOut, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { CapacityBar } from '@/components/capacity/CapacityComponents';

export default function EditorSidebar() {
    const [collapsed, setCollapsed] = useState(false); // Changed to false for better initial visibility
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
            window.location.href = '/';
        }
    };

    const menuItems = [
        { icon: Inbox, label: 'Bandeja', path: '/workstation/editor' },
        { icon: Clapperboard, label: 'Tareas', path: '/workstation/editor/task' },
        { icon: FileText, label: 'Guías', path: '/workstation/editor/guides' },
        { icon: Folder, label: 'Archivos', path: '/workstation/editor/files' },
        { icon: CheckCircle, label: 'Entregas', path: '/workstation/editor/deliveries' },
        { icon: Star, label: 'Reputación', path: '/workstation/editor/reputation' },
        { icon: GraduationCap, label: 'Academia', path: '/workstation/editor/academy' },
        { icon: Wallet, label: 'Mi Wallet', path: '/workstation/editor/finance' },
    ];

    return (
        <motion.aside
            initial={{ width: 240 }}
            animate={{ width: collapsed ? 80 : 240 }}
            className="h-screen bg-[#0E0E18] border-r border-white/5 flex flex-col relative z-20 transition-all duration-300"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-30"
            >
                {collapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Logo Area */}
            <Link href="/workstation/editor">
                <div className="h-20 flex items-center justify-center border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                        ED
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="ml-3 font-bold text-white whitespace-nowrap"
                        >
                            Editor OS
                        </motion.span>
                    )}
                </div>
            </Link>

            {/* Menu */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.path || (item.path !== '/workstation/editor' && pathname.startsWith(item.path));
                    return (
                        <Link key={index} href={item.path}>
                            <div className={`
                                flex items-center p-3 rounded-xl transition-all duration-300 group relative
                                ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                ${collapsed ? 'justify-center' : ''}
                            `}>
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />

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
                            <CapacityBar current={82} max={100} label="Mi Carga" mini />
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
                    {!collapsed && <span className="ml-3 text-sm font-medium">Preferencias</span>}
                </button>
                <button 
                    onClick={handleLogout}
                    className={`
                    w-full flex items-center p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all mt-1
                    ${collapsed ? 'justify-center' : ''}
                `}>
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="ml-3 text-sm font-medium">Cerrar Sesión</span>}
                </button>
            </div>
        </motion.aside>
    );
}
