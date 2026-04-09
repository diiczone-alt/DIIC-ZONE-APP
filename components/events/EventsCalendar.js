'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Plus, MoreHorizontal, List, Trello, Calendar as CalendarIcon, Grid, FileText, UserPlus, ChevronDown, Check, X } from 'lucide-react';

export default function EventsCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeView, setActiveView] = useState('schedule');
    const [selectedEventId, setSelectedEventId] = useState(1);

    const views = [
        { id: 'list', label: 'Lista', icon: List },
        { id: 'board', label: 'Tablero', icon: Trello },
        { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
        { id: 'table', label: 'Tabla', icon: Grid },
        { id: 'file', label: 'Archivos', icon: FileText },
    ];

    const days = [
        { name: 'Mon', num: 8 },
        { name: 'Tue', num: 9 },
        { name: 'Wed', num: 10, active: true },
        { name: 'Thu', num: 11 },
        { name: 'Fri', num: 12 },
    ];

    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    const events = [
        { 
            id: 1, 
            title: 'Sesión de Rodaje', 
            timeStr: '08:00 - 10:00',
            dayIndex: 2, // Wed
            startHour: 8,
            duration: 2,
            bgColor: 'bg-[#B19CFF]',
            textColor: 'text-white',
            image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
            note: 'Dress code: All black',
            desc: 'Sesión de grabación principal para la campaña comercial de la marca deportiva en estudio fotográfico.',
            timeline: [
                { time: '08:00', title: 'Set Up Equipo', desc: '15 minutos' },
                { time: '08:15', title: 'Pruebas de Luz', desc: '15 minutos' },
                { time: '09:15', title: 'Grabación Main', desc: '1 hora' },
                { time: '10:00', title: 'Wrap up', desc: '10 minutos' },
            ]
        },
        { 
            id: 2, 
            title: 'Shopping for prop', 
            timeStr: '11:00 - 13:00',
            dayIndex: 0, // Mon
            startHour: 11.5,
            duration: 1.5,
            bgColor: 'bg-[#FF9166]',
            textColor: 'text-white',
            image: null
        },
        { 
            id: 3, 
            title: 'Edición Offline', 
            timeStr: '12:00 - 14:00',
            dayIndex: 3, // Thu
            startHour: 12,
            duration: 2,
            bgColor: 'bg-[#98D8C9]',
            textColor: 'text-[#0E0E18]',
            image: null
        }
    ];

    const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

    return (
        <div className="h-full flex flex-col md:flex-row bg-[#0E0E18] text-white overflow-hidden p-6 gap-6 font-sans">
            
            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col bg-[#161622] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
                
                {/* Header Superior */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight">Mi Actividad</h2>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-[#161622] flex items-center justify-center text-[10px] font-bold">
                                        JD
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#161622] flex items-center justify-center text-[10px] font-bold text-gray-400">
                                    +5
                                </div>
                            </div>
                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Vistas / Tabs */}
                    <div className="flex items-center gap-6">
                        {views.map(view => (
                            <button 
                                key={view.id}
                                onClick={() => setActiveView(view.id)}
                                className={`flex items-center gap-2 pb-2 text-sm font-medium transition-all ${
                                    activeView === view.id 
                                    ? 'text-[#4A85F6]' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                <view.icon className={`w-4 h-4 ${activeView === view.id ? 'text-[#4A85F6]' : 'text-gray-500'}`} />
                                {view.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid del Cronograma (Schedule) */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-6 relative">
                    
                    {/* Botones Navegación Días */}
                    <div className="flex px-12 mb-4">
                        <div className="w-16 flex justify-between pr-4 items-center">
                            <button className="p-1 hover:bg-white/10 rounded-md text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
                            <button className="p-1 hover:bg-white/10 rounded-md text-gray-500"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <div className="flex-1 grid grid-cols-5 text-center">
                            {days.map((day, i) => (
                                <div key={i} className={`flex flex-col items-center justify-center space-y-1 pb-4 rounded-t-xl transition-all ${day.active ? 'bg-[#2E3146]/40 text-white' : 'text-gray-500'}`}>
                                    <span className="text-xl font-medium">{day.num}</span>
                                    <span className="text-xs font-semibold">{day.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Horarios y Grilla */}
                    <div className="flex-1 flex relative">
                        {/* Current Time Indicator Line (Ejemplo: 10:30) */}
                        <div className="absolute top-[28%] left-12 right-0 border-t-2 border-[#4A85F6] z-20 pointer-events-none">
                            <div className="absolute -left-2 -top-1.5 w-3 h-3 bg-[#4A85F6] rounded-full shadow-[0_0_10px_#4A85F6]" />
                        </div>

                        {/* Etiquetas de Horas */}
                        <div className="w-16 flex flex-col pt-3">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 text-xs font-medium text-gray-500">
                                    {hour}
                                </div>
                            ))}
                        </div>

                        {/* Cuadrícula (Líneas y Tarjetas Flotantes) */}
                        <div className="flex-1 relative">
                            {/* Columnas (Días) */}
                            <div className="absolute inset-0 grid grid-cols-5 z-0">
                                {days.map((day, i) => (
                                    <div key={i} className={`h-full border-l border-white/[0.03] transition-all ${day.active ? 'bg-[#2E3146]/20' : ''}`} />
                                ))}
                            </div>

                            {/* Filas (Horas) */}
                            <div className="absolute inset-0 z-0 flex flex-col pt-3">
                                {hours.map(hour => (
                                    <div key={hour} className="h-20 border-t border-white/[0.03] w-full" />
                                ))}
                            </div>

                            {/* Tarjetas Flotantes */}
                            <div className="absolute top-3 left-0 right-0 bottom-0 z-10 grid grid-cols-5">
                                {events.map(event => {
                                    // Cálculo simple: cada hora equivale a 80px (h-20), empezamos en index 0 = 08:00
                                    const topOffset = (event.startHour - 8) * 80;
                                    const heightPixels = event.duration * 80;

                                    return (
                                        <div key={event.id} style={{ gridColumnStart: event.dayIndex + 1 }} className="relative h-full pointer-events-none">
                                            <div 
                                                onClick={() => setSelectedEventId(event.id)}
                                                className={`absolute w-[92%] left-[4%] pointer-events-auto rounded-[20px] p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl hover:z-30 flex flex-col justify-between overflow-hidden shadow-lg border border-white/10 ${event.bgColor} ${event.textColor}`}
                                                style={{ top: `${topOffset}px`, height: `${heightPixels - 8}px` }}
                                            >
                                                <div>
                                                    <h3 className="font-bold text-sm leading-tight mb-1">{event.title}</h3>
                                                    <p className="text-[10px] font-medium opacity-80">{event.timeStr}</p>
                                                </div>
                                                {event.image && (
                                                    <div className="h-10 mt-2 rounded-xl overflow-hidden shadow-inner">
                                                        <img src={event.image} alt="preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sidebar Derecho de Detalles del Evento */}
            <div className="w-[320px] shrink-0 bg-[#1C1F2E] rounded-[32px] border border-white/5 shadow-2xl p-6 flex flex-col relative overflow-y-auto">
                {/* Botón Volver */}
                <button className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
                    <X className="w-4 h-4" />
                </button>

                {/* Header Evento */}
                <h2 className="text-xl font-bold pr-8 mb-4">Detalle de Sesión</h2>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2E3146] text-gray-300 rounded-lg text-xs font-semibold w-fit">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    10 Octubre 2026
                </div>

                {selectedEvent.note && (
                    <div className="mt-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5 text-gray-400 font-medium italic">
                        Nota: {selectedEvent.note}
                    </div>
                )}

                {/* Participantes */}
                <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-3">Equipo Técnico</h4>
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 border-2 border-[#1C1F2E] flex items-center justify-center font-bold text-[10px]" />
                            ))}
                            <div className="w-8 h-8 rounded-full bg-[#4A85F6] border-2 border-[#1C1F2E] flex items-center justify-center font-bold text-[10px] text-white">
                                4+
                            </div>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs font-medium text-gray-300 transition-colors">
                            Añadir <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Descripción */}
                <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-2">Descripción</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        {selectedEvent.desc}
                    </p>
                </div>

                {/* Timeline Rundown */}
                {selectedEvent.timeline && (
                    <div className="mt-8 flex-1">
                        <h4 className="text-sm font-semibold mb-4">Línea de Tiempo (Rundown)</h4>
                        
                        <div className="space-y-0">
                            {selectedEvent.timeline.map((item, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full mt-1.5 transition-colors border-2 border-[#1C1F2E] box-content ${i === 0 ? 'bg-[#4A85F6]' : 'bg-gray-600 group-hover:bg-gray-400'}`} />
                                        {i !== selectedEvent.timeline.length - 1 && (
                                            <div className="w-[1.5px] h-12 bg-gray-700/50 my-1 group-hover:bg-gray-600 transition-colors" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-medium ${i === 0 ? 'text-[#4A85F6]' : 'text-gray-300 group-hover:text-white transition-colors'}`}>{item.time}</span>
                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div className="mt-1 bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-center min-h-[50px] group-hover:bg-white/10 transition-colors">
                                            <h5 className="text-xs font-bold text-gray-200">{item.title}</h5>
                                            <span className="text-[10px] text-gray-500 font-medium">{item.desc}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Acciones */}
                <div className="mt-8 pt-4 border-t border-white/5 flex gap-3">
                    <button className="flex-1 py-3.5 bg-[#4A85F6] hover:bg-[#346CE3] transition-colors rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 text-white">
                        <Check className="w-4 h-4" /> Unirse a Sesión
                    </button>
                    <button className="px-6 py-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl text-xs font-bold tracking-wide text-gray-400">
                        Ignorar
                    </button>
                </div>

            </div>
        </div>
    );
}
