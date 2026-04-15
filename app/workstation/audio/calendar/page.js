'use client';

import { useState } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight,
    Mic2, Disc, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

export default function AudioAgenda() {

    // Mock Events
    const events = [
        {
            id: 1,
            title: 'Grabación Voz en Off - Spot TV',
            date: 'Hoy, 14:00 - 16:00',
            studio: 'Sonic Boom Studios',
            type: 'recording',
            status: 'confirmed'
        },
        {
            id: 2,
            title: 'Entrega Mezcla Final - Podcast Ep. 45',
            date: 'Mañana, 10:00',
            studio: 'Remoto',
            type: 'deadline',
            status: 'pending'
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-white">Agenda de Audio</h1>
                    <div className="flex items-center gap-2 bg-[#0E0E18] rounded-lg p-1 border border-white/10 ml-4">
                        <button className="p-1 hover:bg-white/10 rounded transition-colors">
                            <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </button>
                        <span className="text-sm font-bold text-white px-2">Febrero 2026</span>
                        <button className="p-1 hover:bg-white/10 rounded transition-colors">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Upcoming Sessions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Mic2 className="w-5 h-5 text-violet-400" /> Próximas Sesiones
                        </h2>

                        {events.filter(e => e.type === 'recording').map(event => (
                            <div key={event.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-xs font-bold text-gray-500 uppercase">FEB</span>
                                            <span className="text-xl font-black text-white">12</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{event.title}</h3>
                                            <p className="text-sm text-gray-400">{event.studio}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Confirmado
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <Clock className="w-4 h-4 text-violet-500" />
                                    {event.date}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Deadlines */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Disc className="w-5 h-5 text-rose-400" /> Entregas Pendientes
                        </h2>

                        {events.filter(e => e.type === 'deadline').map(event => (
                            <div key={event.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-rose-500/30 transition-all group">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">{event.title}</h3>
                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>{event.date}</span>
                                    <span className="text-rose-400 font-bold">Urgente</span>
                                </div>
                                <div className="mt-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-rose-500 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
