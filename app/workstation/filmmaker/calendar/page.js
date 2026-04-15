'use client';

import { useState } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Clock,
    User, Camera, MoreVertical, CheckCircle,
    XCircle, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FilmmakerCalendar() {

    // Mock Data
    const events = [
        {
            id: 1,
            title: 'Rodaje: Video Corporativo Clínica Smith',
            date: 'Hoy',
            time: '14:00 - 18:00',
            location: 'Av. Libertador 1234',
            contact: 'Dr. Roberto Smith',
            equipment: ['Sony FX3', 'Gimbal', 'Audio Kit', 'Luces LED'],
            status: 'confirmed'
        },
        {
            id: 2,
            title: 'Rodaje: Reels FitLife Gym',
            date: 'Mañana',
            time: '09:00 - 13:00',
            location: 'FitLife Center - Zona Norte',
            contact: 'Ana Pérez (Marketing)',
            equipment: ['Sony FX3', 'Lente 16-35mm', 'Micrófono Corbatero'],
            status: 'pending'
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md">
                <div>
                    <h1 className="text-lg font-bold text-white">Agenda de Rodajes</h1>
                    <p className="text-xs text-gray-400">Organiza tus próximas producciones.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#0E0E18] rounded-lg p-1 border border-white/10">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm font-bold text-white px-2">Febrero 2026</span>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-8 space-y-6">

                {events.map((event) => (
                    <div key={event.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all group">
                        <div className="flex flex-col md:flex-row">
                            {/* Date Column */}
                            <div className="w-full md:w-48 bg-white/5 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/5">
                                <span className="text-cyan-400 font-bold text-lg mb-1">{event.date}</span>
                                <span className="text-2xl font-black text-white">{event.time.split(' - ')[0]}</span>
                                <span className="text-xs text-gray-500 mt-1">{event.time}</span>
                            </div>

                            {/* Details Column */}
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {event.title}
                                    </h3>
                                    <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span>Contacto: {event.contact}</span>
                                    </div>
                                </div>

                                <div className="bg-[#0A0A0E] rounded-xl p-4 border border-white/5">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <Camera className="w-4 h-4" /> Equipo Requerido
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {event.equipment.map((item, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs text-gray-300">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Column */}
                            <div className="w-full md:w-48 bg-[#0A0A0E] p-6 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-white/5">
                                <button className="w-full py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                    <CheckCircle className="w-4 h-4" /> Confirmar
                                </button>
                                <button className="w-full py-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                    <RefreshCw className="w-4 h-4" /> Reagendar
                                </button>
                                <button className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                    <XCircle className="w-4 h-4" /> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </main>
        </div>
    );
}
