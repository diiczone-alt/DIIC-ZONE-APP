'use client';

import { useState } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight,
    Instagram, Facebook, Twitter, Linkedin, Video, Image as ImageIcon,
    MoreHorizontal, Filter, Plus, Clock, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContentCalendar() {
    const [view, setView] = useState('month'); // 'month' | 'week'
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 15)); // Feb 2026

    // Mock Week Days
    const days = [
        { date: 9, day: 'Lun', events: [{ id: 1, type: 'reel', platform: 'instagram', status: 'published', title: 'Reel Motivacional' }] },
        { date: 10, day: 'Mar', events: [] },
        { date: 11, day: 'Mié', events: [{ id: 2, type: 'carousel', platform: 'linkedin', status: 'draft', title: 'Infografía B2B' }] },
        { date: 12, day: 'Jue', events: [{ id: 3, type: 'story', platform: 'instagram', status: 'scheduled', title: 'Q&A Sesión' }] },
        { date: 13, day: 'Vie', events: [{ id: 4, type: 'video', platform: 'youtube', status: 'editing', title: 'Vlog Semanal' }] },
        { date: 14, day: 'Sáb', events: [] },
        { date: 15, day: 'Dom', events: [{ id: 5, type: 'post', platform: 'twitter', status: 'scheduled', title: 'Hilo Reflexión' }] },
    ];

    const getIcon = (platform) => {
        switch (platform) {
            case 'instagram': return <Instagram className="w-3.5 h-3.5" />;
            case 'facebook': return <Facebook className="w-3.5 h-3.5" />;
            case 'linkedin': return <Linkedin className="w-3.5 h-3.5" />;
            case 'youtube': return <Video className="w-3.5 h-3.5" />;
            case 'twitter': return <Twitter className="w-3.5 h-3.5" />;
            default: return <ImageIcon className="w-3.5 h-3.5" />;
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-emerald-500 text-white';
            case 'scheduled': return 'bg-blue-500 text-white';
            case 'draft': return 'bg-gray-500 text-gray-300';
            case 'editing': return 'bg-amber-500 text-white';
            default: return 'bg-gray-500';
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050511]">

            {/* HEADER */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Calendario Editorial</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Febrero 2026</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-2"></div>

                    <div className="flex bg-[#0E0E18] rounded-lg p-1 border border-white/10">
                        <button onClick={() => setView('month')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'month' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Mes</button>
                        <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'week' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Semana</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-9 px-3 border border-white/10 rounded-lg text-xs font-bold text-gray-400 flex items-center gap-2 hover:bg-white/5 transition-colors">
                        <Filter className="w-3.5 h-3.5" /> Filtrar
                    </button>
                    <button className="h-9 px-4 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-white/10">
                        <Plus className="w-3.5 h-3.5" /> Nueva Entrada
                    </button>
                </div>
            </header>

            {/* CALENDAR GRID */}
            <div className="flex-1 overflow-y-auto p-6 bg-[url('/grid-pattern.svg')] bg-opacity-5">
                <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Headers */}
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                        <div key={day} className="bg-[#0E0E18] p-3 text-center border-b border-white/5">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{day}</span>
                        </div>
                    ))}

                    {/* Days */}
                    {days.map((day, i) => (
                        <div key={i} className="bg-[#0A0A0E] min-h-[180px] p-2 hover:bg-[#13131f] transition-colors relative group">
                            <span className={`text-sm font-mono font-bold absolute top-2 right-3 ${day.date === 12 ? 'text-indigo-400 bg-indigo-500/10 px-2 rounded' : 'text-gray-600'}`}>
                                {day.date}
                            </span>

                            <div className="mt-8 space-y-2">
                                {day.events.map(event => (
                                    <motion.div
                                        key={event.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-[#1A1A24] p-2.5 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer shadow-sm group/card"
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`p-1 rounded ${event.platform === 'instagram' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {getIcon(event.platform)}
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">{event.platform}</span>
                                            </div>
                                            <MoreHorizontal className="w-3 h-3 text-gray-600 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                        </div>

                                        <h4 className="text-xs font-bold text-gray-200 leading-snug mb-2">{event.title}</h4>

                                        <div className="flex items-center justify-between">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                            <div className="w-4 h-4 rounded-full bg-gray-700 border border-black flex items-center justify-center text-[8px] text-white font-bold">
                                                CM
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Add Button Placeholder */}
                                <button className="w-full h-8 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-white/5 hover:text-white transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty Days Fillers */}
                    {Array.from({ length: 28 }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-[#0A0A0E] min-h-[180px] p-2 hover:bg-[#13131f] transition-colors relative opacity-50">
                            <span className="text-sm font-mono font-bold absolute top-2 right-3 text-gray-700">{16 + i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
