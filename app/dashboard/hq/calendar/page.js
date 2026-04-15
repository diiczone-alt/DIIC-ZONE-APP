'use client';

import { useState } from 'react';
import HQSidebar from '@/components/layout/HQSidebar';
import {
    CalendarDays, ChevronLeft, ChevronRight,
    Video, Users, FileCheck, MapPin, Clock
} from 'lucide-react';

export default function GlobalCalendarPage() {
    const [view, setView] = useState('week'); // 'day', 'week', 'month'

    const events = [
        { id: 1, title: 'Rodaje: Clínica Smith', type: 'shoot', time: '09:00 - 14:00', person: 'Pedro L.', status: 'confirmed', day: 'Lun' },
        { id: 2, title: 'Entrega: Reels Black Friday', type: 'delivery', time: '18:00', person: 'Carlos R.', status: 'pending', day: 'Lun' },
        { id: 3, title: 'Reunión: Estrategia Q3', type: 'meeting', time: '10:00 - 11:30', person: 'Laura CM', status: 'done', day: 'Mar' },
        { id: 4, title: 'Entrega: Branding Kit', type: 'delivery', time: '16:00', person: 'Ana G.', status: 'pending', day: 'Mié' },
        { id: 5, title: 'Rodaje: Evento Corporativo', type: 'shoot', time: '19:00 - 23:00', person: 'Pedro L.', status: 'confirmed', day: 'Vie' },
    ];

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <div className="min-h-screen bg-[#050511] text-white font-sans">
            <HQSidebar />
            <div className="pl-20 lg:pl-64 transition-all duration-300">
                <main className="p-8 max-w-[1600px] mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                <CalendarDays className="w-8 h-8 text-indigo-500" /> Calendario Global
                            </h1>
                            <p className="text-gray-400 mt-1">Visión unificada de Rodajes, Reuniones y Entregas.</p>
                        </div>

                        <div className="flex items-center gap-4 bg-[#0E0E18] p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => setView('day')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === 'day' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Día
                            </button>
                            <button
                                onClick={() => setView('week')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === 'week' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Semana
                            </button>
                            <button
                                onClick={() => setView('month')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === 'month' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Mes
                            </button>
                        </div>
                    </div>

                    {/* Controls & Legend */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                            <h2 className="text-xl font-bold">Febrero 2026</h2>
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                        <div className="flex gap-4 text-xs font-bold uppercase">
                            <span className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-full bg-cyan-500" /> Rodajes</span>
                            <span className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-full bg-indigo-500" /> Reuniones</span>
                            <span className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Entregas</span>
                        </div>
                    </div>

                    {/* Week Grid */}
                    <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {weekDays.map((day, i) => (
                            <div key={day} className="bg-[#0A0A12] min-h-[500px] flex flex-col p-4 group hover:bg-[#0E0E18] transition-colors relative">
                                <div className="text-center mb-6 border-b border-white/5 pb-2">
                                    <span className="text-sm font-bold text-gray-400 block uppercase">{day}</span>
                                    <span className={`text-2xl font-black ${i === 2 ? 'text-indigo-400' : 'text-white'}`}>{10 + i}</span>
                                </div>

                                <div className="space-y-3 flex-1">
                                    {events.filter(e => e.day === day).map(event => (
                                        <div key={event.id} className={`p-3 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer hover:scale-[1.02] ${event.type === 'shoot' ? 'bg-cyan-900/10 border-cyan-500/20 hover:border-cyan-500/50' :
                                                event.type === 'meeting' ? 'bg-indigo-900/10 border-indigo-500/20 hover:border-indigo-500/50' :
                                                    'bg-emerald-900/10 border-emerald-500/20 hover:border-emerald-500/50'
                                            }`}>
                                            <div className="flex justify-between items-start">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${event.type === 'shoot' ? 'bg-cyan-500/20 text-cyan-300' :
                                                        event.type === 'meeting' ? 'bg-indigo-500/20 text-indigo-300' :
                                                            'bg-emerald-500/20 text-emerald-300'
                                                    }`}>
                                                    {event.time}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-white leading-tight">{event.title}</p>

                                            <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
                                                {event.type === 'shoot' && <Video className="w-3 h-3 text-cyan-400" />}
                                                {event.type === 'meeting' && <Users className="w-3 h-3 text-indigo-400" />}
                                                {event.type === 'delivery' && <FileCheck className="w-3 h-3 text-emerald-400" />}
                                                <span className="text-[10px] text-gray-400 truncate">{event.person}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Empty Slot Placeholder */}
                                    <div className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
}
