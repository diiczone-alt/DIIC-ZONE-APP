'use client';

import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Zap, ChevronDown, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function SlimMasterHeader() {
    const { user } = useAuth();
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header className="h-14 border-b border-white/5 bg-[#050510]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-[60]">
            {/* Left: Search & Branding Context */}
            <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-7 h-7 bg-white text-black rounded-lg flex items-center justify-center font-black italic text-sm">D</div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Ecosistema Pro</span>
                </div>

                <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'w-96' : 'w-64'}`}>
                    <Search className={`absolute left-3 w-3.5 h-3.5 transition-colors ${searchFocused ? 'text-indigo-400' : 'text-gray-600'}`} />
                    <input 
                        type="text"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Buscar nodo, tarea o estrategia..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-[11px] text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.05] transition-all"
                    />
                    {!searchFocused && (
                        <div className="absolute right-3 px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-black text-gray-700">
                            ⌘ K
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Actions & High-End Profile */}
            <div className="flex items-center gap-4">
                {/* Interaction Pulse */}
                <div className="flex items-center gap-1 mr-4 border-r border-white/5 pr-4">
                    <button className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/5 rounded-lg transition-all relative">
                         <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                         <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                         <Bell className="w-4.5 h-4.5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all">
                         <MessageSquare className="w-4.5 h-4.5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-amber-400 hover:bg-amber-500/5 rounded-lg transition-all">
                         <Zap className="w-4.5 h-4.5" />
                    </button>
                </div>

                {/* Jessica's Professional Badge */}
                <div className="flex items-center gap-3 pl-4 border-l border-white/5 cursor-pointer group">
                    <div className="text-right hidden sm:block leading-none">
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">
                            {user?.user_metadata?.full_name || user?.full_name || 'Jessica Rey'}
                        </p>
                        <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {user?.role === 'CM' || user?.role === 'COMMUNITY' ? 'Community Manager Master' : 
                             user?.role === 'CLIENT' ? 'Socio Estratégico' : 
                             user?.role === 'ADMIN' ? 'System Architect' : 'Socio Diic Zone'}
                        </p>
                    </div>
                    
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/10">
                            <div className="w-full h-full rounded-[7px] bg-[#050510] overflow-hidden">
                                <img 
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=transparent" 
                                    alt="Profile" 
                                    className="w-full h-full object-cover p-1"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#050510]" />
                    </div>
                    
                    <ChevronDown className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                </div>
            </div>
        </header>
    );
}
