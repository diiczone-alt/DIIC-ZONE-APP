'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Network, Map, Share2, Zap, Filter, Search, MoreHorizontal, Settings } from 'lucide-react';
import EventsCalendar from './EventsCalendar';
import StrategyBoard from '../shared/Strategy/StrategyBoard';


export default function EventsDashboard() {
    const [activeTab, setActiveTab] = useState('calendar');

    const tabs = [
        { id: 'calendar', label: 'Agenda & Shoots', icon: Calendar },
        { id: 'strategy', label: 'Pizarra de Estrategia', icon: Network },
        { id: 'logistics', label: 'Logística & Crew', icon: Map },
    ];

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] overflow-hidden bg-[#0E0E18]">
            {/* Module Sidebar */}
            <div className="w-64 border-r border-white/5 bg-[#0E0E18]/50 flex flex-col p-4 shrink-0">
                <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-violet-600/20 text-violet-300">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-white">Event OS</h2>
                    </div>
                    <p className="text-xs text-indigo-300">Planificación estratégica de producciones.</p>
                </div>

                <nav className="space-y-2 flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Quick Stats / Mini Calendar could go here */}
                <div className="mt-auto p-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Próximo Evento</span>
                        <span className="text-primary">2d</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="font-bold text-white text-sm">Rodaje Campaña Nike</div>
                        <div className="text-xs text-gray-400 mt-1">14:00 - Estudio A</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0E0E18]/80 backdrop-blur-sm z-10 shrink-0">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-gray-400">
                            <Search className="w-4 h-4" />
                            <input className="bg-transparent outline-none w-32 placeholder:text-gray-600" placeholder="Buscar..." />
                        </div>
                        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="hidden sm:inline">Nuevo Evento</span>
                        </button>
                    </div>
                </header>

                {/* Views */}
                <main className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-full"
                        >
                            {activeTab === 'calendar' && <EventsCalendar />}
                            {activeTab === 'strategy' && <StrategyBoard />}
                            {activeTab === 'logistics' && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <Map className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
                                    <h3 className="text-xl font-bold text-white mb-2">Logística & Crew</h3>
                                    <p className="text-gray-400 max-w-md">Gestiona mapas de locaciones, asignación de equipos y transporte. Próximamente.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
