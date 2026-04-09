'use client';

import { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, Video, FileText,
    Instagram, Linkedin, Calendar as CalendarIcon,
    Camera, Users, CheckCircle2, Clock, Star, Plus as PlusIcon,
    Grid as GridIcon, Radio, Layout, Sparkles, Zap, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Drawers
import ContentDrawer from './drawers/ContentDrawer';
import ProductionDrawer from './drawers/ProductionDrawer';
import MeetingsDrawer from './drawers/MeetingsDrawer';
import DatesDrawer from './drawers/DatesDrawer';

const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

const CATEGORIES = [
    { id: 'content', label: 'Contenido', color: 'bg-indigo-500', text: 'text-indigo-400' },
    { id: 'production', label: 'Producción', color: 'bg-rose-500', text: 'text-rose-400' },
    { id: 'meetings', label: 'Reuniones', color: 'bg-emerald-500', text: 'text-emerald-400' }
];

export default function UnifiedCalendar({ role = 'cm', campaignId = null, embedded = false }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeDrawer, setActiveDrawer] = useState(null); // 'content', 'production', 'meetings', 'dates'
    const [selectedDay, setSelectedDay] = useState(null);
    const [strategyEvents, setStrategyEvents] = useState([]);
    const [isCampaignActive, setIsCampaignActive] = useState(false);

    const isCM = role === 'cm';
    const isClient = role === 'client';

    // 1. Load Strategy Data from LocalStorage (Sync with Strategy Board)
    useEffect(() => {
        const loadStrategyData = () => {
            if (typeof window === 'undefined') return;
            const data = localStorage.getItem('diic_creative_projects');
            if (data) {
                let parsed = JSON.parse(data);
                
                // If embedded/campaignId is provided, filter specifically
                if (campaignId) {
                    parsed = parsed.filter(p => p.campaignId === campaignId);
                }

                setStrategyEvents(parsed);
                setIsCampaignActive(parsed.some(p => p.publishDate !== null));
            }
        };

        loadStrategyData();
        window.addEventListener('storage', loadStrategyData);
        return () => window.removeEventListener('storage', loadStrategyData);
    }, [campaignId]);

    // 2. Activate Campaign Logic (Ported from IntelligentPlanner)
    const handleActivateCampaign = () => {
        if (strategyEvents.length === 0) {
            alert("No hay proyectos pendientes desde el Estudio Creativo.");
            return;
        }

        const today = new Date();
        const updated = strategyEvents.map((p, index) => {
            const daysOffset = index * 3;
            const pubDate = new Date(today);
            pubDate.setDate(pubDate.getDate() + daysOffset);

            return {
                ...p,
                plannerStatus: 'en_produccion',
                publishDate: pubDate.toISOString()
            };
        });

        setStrategyEvents(updated);
        setIsCampaignActive(true);
        localStorage.setItem('diic_creative_projects', JSON.stringify(updated));
    };

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleDrawerToggle = (drawerId) => {
        setActiveDrawer(prev => prev === drawerId ? null : drawerId);
    };

    // Combine static items with strategy events
    const allItems = [
        ...strategyEvents.map(e => ({
            id: e.id,
            date: e.publishDate ? new Date(e.publishDate).getDate() : null,
            month: e.publishDate ? new Date(e.publishDate).getMonth() : null,
            year: e.publishDate ? new Date(e.publishDate).getFullYear() : null,
            type: 'content',
            title: e.title,
            status: e.plannerStatus,
            isStrategy: true
        })).filter(e => e.date !== null && e.month === currentDate.getMonth() && e.year === currentDate.getFullYear())
    ];

    return (
        <div className={`flex flex-col h-full gap-6 relative font-sans ${embedded ? 'p-0' : 'p-2'}`}>

            {/* Drawers Container */}
            <ContentDrawer isOpen={activeDrawer === 'content'} onClose={() => setActiveDrawer(null)} />
            {isCM && <ProductionDrawer isOpen={activeDrawer === 'production'} onClose={() => setActiveDrawer(null)} />}
            <MeetingsDrawer isOpen={activeDrawer === 'meetings'} onClose={() => setActiveDrawer(null)} />
            <DatesDrawer isOpen={activeDrawer === 'dates'} onClose={() => setActiveDrawer(null)} niche="health" />

            {/* --- TOP CREATIVE TOOLBAR --- */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-4 shrink-0 mt-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-6 group">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/10">
                                <CalendarIcon className="w-5 h-5 text-indigo-300" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black text-white capitalize tracking-tight drop-shadow-md">
                                    {currentDate.toLocaleString('es-ES', { month: 'long' })}
                                </h2>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{currentDate.getFullYear()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                                className="p-2.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all transform active:scale-90"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="w-px h-4 bg-white/10"></div>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                                className="p-2.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all transform active:scale-90"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Activar Campaña Button (Unified) */}
                    {!isCampaignActive && strategyEvents.length > 0 && (
                        <button 
                            onClick={handleActivateCampaign}
                            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Zap className="w-4 h-4 animate-pulse group-hover:rotate-12 transition-transform" />
                            Activar Estrategia
                        </button>
                    )}

                    <div className="flex items-center bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-xl gap-2">
                        <button
                            onClick={() => handleDrawerToggle('dates')}
                            className={`group relative px-6 py-2.5 text-xs font-black transition-all rounded-full flex items-center gap-2 ${activeDrawer === 'dates'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="uppercase tracking-widest text-[9px]">Fechas Clave</span>
                        </button>

                        <div className="h-6 w-px bg-white/10"></div>

                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleDrawerToggle(cat.id)}
                                className={`group px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-full flex items-center gap-2 ${activeDrawer === cat.id
                                    ? `${cat.color} text-white`
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${cat.color} ${activeDrawer === cat.id ? 'animate-pulse' : 'opacity-40'}`}></span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- CORE CONTENT AREA --- */}
            <div className="flex flex-1 gap-6 min-h-0 overflow-hidden px-4 pb-4">
                {/* Main Calendar View */}
                <div className="flex-1 bg-[#090912]/40 relative p-6 rounded-[2.5rem] border border-white/5 flex flex-col transition-all shadow-2xl overflow-y-auto custom-scrollbar">
                    <div className="relative grid grid-cols-7 gap-1">
                        {DAYS.map(d => (
                            <div key={d} className="py-4 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                                {d}
                            </div>
                        ))}

                        {Array(getFirstDayOfMonth(currentDate)).fill(null).map((_, i) => (
                            <div key={`blank-${i}`} className="bg-white/[0.01] rounded-2xl m-0.5 border border-white/[0.02]"></div>
                        ))}

                        {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(day => {
                            const items = allItems.filter(item => item.date === day);
                            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`
                                        relative p-4 rounded-3xl cursor-pointer group transition-all duration-300 m-0.5 min-h-[120px]
                                        ${isToday
                                            ? 'bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/30'
                                            : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.07] hover:border-white/10'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`
                                            text-sm font-black flex items-center justify-center w-8 h-8 rounded-2xl transition-all
                                            ${isToday ? 'bg-white text-black scale-110 shadow-xl shadow-white/10' : 'text-gray-500 group-hover:text-white'}
                                        `}>
                                            {day}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 relative z-10">
                                        {items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="relative overflow-hidden text-[8px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 truncate"
                                            >
                                                {item.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Sidebar Summary */}
                <div className="w-80 flex flex-col shrink-0">
                    <div className="flex-1 bg-[#090912]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-2xl relative overflow-hidden group/sidebar">
                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                {selectedDay ? `Agenda · Día ${selectedDay}` : 'Resumen Semanal'}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                            {selectedDay ? (
                                <div className="space-y-4">
                                    {allItems.filter(i => i.date === selectedDay).map((item, idx) => (
                                        <div key={idx} className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                                <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">TACTICAL CONTENT</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">{item.title}</h4>
                                            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase">
                                                <Clock className="w-3.5 h-3.5" />
                                                ESTADO: {item.status || 'PROGRAMADO'}
                                            </div>
                                        </div>
                                    ))}
                                    {allItems.filter(i => i.date === selectedDay).length === 0 && (
                                        <div className="text-center py-20 opacity-20 flex flex-col items-center">
                                            <Sparkles className="w-12 h-12 mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Día Libre</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex flex-col gap-10 opacity-60">
                                        <div className="flex flex-col items-center text-center">
                                            <Target className="w-10 h-10 text-indigo-400 mb-4 opacity-50" />
                                            <span className="text-[32px] font-black text-white leading-none">{allItems.length}</span>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Piezas Totales</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                                                <span className="text-xl font-black text-emerald-400 leading-none">{allItems.filter(i => i.status === 'listo').length}</span>
                                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2">Listas</p>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                                                <span className="text-xl font-black text-amber-500 leading-none">{allItems.filter(i => i.status === 'en_produccion').length}</span>
                                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2">En Prod.</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-10 p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10">
                                        <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Próximo Hito</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <Video className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white uppercase tracking-tight">Gran Lanzamiento</p>
                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">En 3 días</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
