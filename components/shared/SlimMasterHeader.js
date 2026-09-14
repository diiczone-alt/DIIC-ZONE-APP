'use client';

import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Zap, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/components/layout/SidebarContext';

export default function SlimMasterHeader({ isClient }) {
    const { user } = useAuth();
    const [searchFocused, setSearchFocused] = useState(false);
    const { setIsMobileOpen } = useSidebar();

    return (
        <header className="h-14 border-b border-white/5 bg-[#050510]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-[40]">
            {/* Left: Search & Mobile Navigation */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Hamburger Button for Mobile */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg lg:hidden transition-colors shrink-0"
                    aria-label="Abrir menú"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className={`relative hidden md:flex items-center transition-all duration-300 ${searchFocused ? 'w-80' : 'w-52'}`}>
                    <Search className={`absolute left-3 w-3.5 h-3.5 transition-colors ${searchFocused ? 'text-indigo-400' : 'text-gray-600'}`} />
                    <input 
                        type="text"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Buscar nodo, tarea o reporte..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-[11px] text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.05] transition-all"
                    />
                </div>
            </div>

            {/* Center: Official DIIC ZONE Brand Logo */}
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 shadow-inner shrink-0 select-none">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-black italic text-xs text-white shadow-md shadow-indigo-500/20">
                    D
                </div>
                <span className="text-xs font-black tracking-widest text-white uppercase italic">
                    DIIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-extrabold">ZONE</span>
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </div>

            {/* Right: Actions & User Profile Badge */}
            <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                {/* Interaction Actions */}
                <div className="flex items-center gap-1 border-r border-white/5 pr-3">
                    <button className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all relative">
                         <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                         <Bell className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all">
                         <MessageSquare className="w-4 h-4" />
                    </button>
                </div>

                {/* User / Partner Context */}
                <div className="flex items-center gap-2.5 pl-1">
                    <div className="text-right hidden sm:block leading-none">
                        <p className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[130px]">
                            {(user?.user_metadata?.brand || user?.user_metadata?.full_name || user?.full_name || 'DIIC Socio').replace(/[-_\s]+workspace\s*$/i, '').trim()}
                        </p>
                        <p className="text-[7px] font-black text-emerald-400 uppercase tracking-widest mt-1">
                            {user?.role === 'CLIENT' ? 'Ecosistema Activo' : (user?.role || 'Socio')}
                        </p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-xl p-[1px] bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shrink-0">
                        <div className="w-full h-full rounded-[11px] bg-[#050510] flex items-center justify-center text-white font-black text-[10px]">
                            {(user?.user_metadata?.full_name || user?.full_name || 'DZ').substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
