'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Video, Mic, Instagram } from 'lucide-react';

export default function CreativeCalendarPage() {
    const [currentMonth] = useState('Octubre 2026');
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const events = [
        { day: 5, title: 'Rodaje Cliente Alpha', type: 'shoot', time: '09:00 AM' },
        { day: 12, title: 'Entrega Corte v1', type: 'deadline', time: '06:00 PM' },
        { day: 15, title: 'Revisión Guiones', type: 'meeting', time: '11:00 AM' },
        { day: 22, title: 'Publicación Reels', type: 'social', time: '07:00 PM' },
    ];

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mi Calendario</h1>
                    <p className="text-gray-400">Agenda de rodajes, entregas y reuniones.</p>
                </div>
                <div className="flex items-center gap-4 bg-[#0A0A12] p-1 rounded-xl border border-white/10">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="font-bold text-white px-2">{currentMonth}</span>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </header>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                {/* Weekdays */}
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2">
                        {d}
                    </div>
                ))}

                {/* Days */}
                {days.map(day => {
                    const dayEvents = events.filter(e => e.day === day);
                    return (
                        <div key={day} className="min-h-[120px] bg-[#0A0A12] border border-white/5 rounded-2xl p-3 hover:border-indigo-500/30 transition-colors flex flex-col gap-2">
                            <span className={`text-sm font-bold ${dayEvents.length > 0 ? 'text-white' : 'text-gray-600'}`}>{day}</span>

                            {dayEvents.map((evt, idx) => (
                                <div key={idx} className={`p-2 rounded-lg text-xs border ${evt.type === 'shoot' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' :
                                        evt.type === 'deadline' ? 'bg-red-500/10 border-red-500/20 text-red-300' :
                                            evt.type === 'social' ? 'bg-pink-500/10 border-pink-500/20 text-pink-300' :
                                                'bg-white/5 border-white/10 text-gray-300'
                                    }`}>
                                    <p className="font-bold truncate">{evt.title}</p>
                                    <div className="flex items-center gap-1 mt-1 opacity-70">
                                        <Clock className="w-3 h-3" /> {evt.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
