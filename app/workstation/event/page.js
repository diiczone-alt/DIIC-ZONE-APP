'use client';

import { useState } from 'react';
import {
    CalendarDays, MapPin, Users, Clock, CheckCircle,
    MoreVertical, Plus, Search, Filter, ArrowRight,
    Camera, Video, Mic2, AlertCircle, FileText,
    Share2, Download, List, Grid, LayoutTemplate
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const UPCOMING_EVENTS = [
    {
        id: 1,
        title: 'Festival de Música "Soundwave"',
        client: 'Live Nation',
        date: '15 Oct, 2026',
        time: '14:00 - 02:00',
        location: 'Parque Central, Zona VIP',
        status: 'confirmed',
        type: 'Music Festival',
        crew: 8,
        thumb: 'https://images.unsplash.com/photo-1459749411177-2c4f5206d8d8?w=800&auto=format&fit=crop&q=60',
        rundown: [
            { time: '14:00', activity: 'Acceso Prensa & Montaje', role: 'Todos' },
            { time: '16:00', activity: 'Inicio Show Principal', role: 'Camera A + Drone' },
            { time: '20:00', activity: 'Acto Central (Pyros)', role: 'Full Crew' },
        ]
    },
    {
        id: 2,
        title: 'Boda Civil: Ana & Carlos',
        client: 'Wedding Planner Co.',
        date: '22 Oct, 2026',
        time: '11:00 - 18:00',
        location: 'Hacienda Los Ficus',
        status: 'planning',
        type: 'Social Event',
        crew: 3,
        thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=60',
        rundown: []
    },
    {
        id: 3,
        title: 'Lanzamiento Producto Tech',
        client: 'Innovate Corp',
        date: '05 Nov, 2026',
        time: '19:00 - 22:00',
        location: 'Hotel Westin, Salón A',
        status: 'pending',
        type: 'Corporate',
        crew: 5,
        thumb: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60',
        rundown: []
    },
];

const CREW_MEMBERS = [
    { id: 1, name: 'Alex Director', role: 'Lead Shooter', status: 'available', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Sarah Drone', role: 'Drone Op', status: 'assigned', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Mike Sound', role: 'Audio Tech', status: 'busy', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function EventDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-amber-500" /> Cobertura & Eventos
                    </h1>
                    <div className="flex bg-[#121212] p-1 rounded-lg border border-white/10">
                        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <LayoutTemplate className="w-3.5 h-3.5" /> Dashboard
                        </button>
                        <button onClick={() => setActiveTab('map')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'map' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <MapPin className="w-3.5 h-3.5" /> Mapa Logístico
                        </button>
                        <button onClick={() => setActiveTab('crew')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'crew' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Users className="w-3.5 h-3.5" /> Crew
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar evento..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#121212] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        <Plus className="w-3.5 h-3.5" /> Nuevo Evento
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative p-8">
                <AnimatePresence mode="wait">

                    {/* --- OVERVIEW TAB --- */}
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col gap-8">

                            {/* Stats Row */}
                            <div className="grid grid-cols-4 gap-6 shrink-0">
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500"><CalendarDays className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">12</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Eventos este Mes</div>
                                    </div>
                                </div>
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-green-500/20 rounded-xl text-green-500"><CheckCircle className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">98%</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Éxito en Cobertura</div>
                                    </div>
                                </div>
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500"><Users className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">8</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Crew Disponible</div>
                                    </div>
                                </div>
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-500"><Camera className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">45</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Assets Pendientes</div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Events List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <h2 className="text-xl font-bold text-white mb-6">Próximos Eventos</h2>
                                <div className="grid gap-4">
                                    {UPCOMING_EVENTS.map(event => (
                                        <div key={event.id} onClick={() => setSelectedEvent(event)} className="group bg-[#0E0E18] border border-white/5 rounded-xl p-4 flex gap-6 hover:border-amber-500/50 hover:bg-[#151520] transition-all cursor-pointer">
                                            {/* Date Banner */}
                                            <div className="flex flex-col items-center justify-center bg-[#1a1a2e] w-24 rounded-lg border border-white/5 shrink-0">
                                                <span className="text-xs text-gray-400 uppercase font-bold">{event.date.split(' ')[1]}</span>
                                                <span className="text-2xl font-bold text-white">{event.date.split(' ')[0]}</span>
                                                <span className="text-[10px] text-gray-500">{event.date.split(' ')[2]}</span>
                                            </div>

                                            {/* Image & Info */}
                                            <div className="w-32 aspect-video rounded-lg overflow-hidden relative shrink-0">
                                                <img src={event.thumb} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                                            </div>

                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-lg font-bold text-white truncate group-hover:text-amber-400 transition-colors">{event.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${event.status === 'confirmed' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-gray-500/30 text-gray-400 bg-gray-500/10'}`}>
                                                        {event.status === 'confirmed' ? 'Confirmado' : event.status === 'planning' ? 'Planificación' : 'Pendiente'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                                                    <span className="text-amber-500 font-bold">{event.client}</span> • {event.type}
                                                </p>

                                                <div className="flex items-center gap-6 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                                                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {event.crew} Pax</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center px-4">
                                                <button className="p-2 rounded-full border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- CREW TAB (Simplified) --- */}
                    {activeTab === 'crew' && (
                        <motion.div key="crew" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                            {CREW_MEMBERS.map(member => (
                                <div key={member.id} className="bg-[#0E0E18] border border-white/5 rounded-xl p-6 flex items-center gap-4 hover:border-white/20 transition-all">
                                    <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full border-2 border-white/10" />
                                    <div>
                                        <h3 className="text-white font-bold">{member.name}</h3>
                                        <p className="text-amber-500 text-xs font-bold uppercase mb-2">{member.role}</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${member.status === 'available' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}>
                                            {member.status === 'available' ? 'Disponible' : 'Ocupado'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* --- MAP TAB (Placeholder) --- */}
                    {activeTab === 'map' && (
                        <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center bg-[#0E0E18] rounded-2xl border border-white/5">
                            <div className="text-center text-gray-500">
                                <MapPin className="w-16 h-16 mx-auto mb-4 text-amber-500/50" />
                                <h2 className="text-xl font-bold text-white mb-2">Mapa Logístico</h2>
                                <p>Integración con Google Maps / Waze para logística de transporte.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* --- EVENT DETAIL MODAL (RUNDOWN) --- */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setSelectedEvent(null)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#0E0E18] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                            {/* Modal Header */}
                            <div className="h-40 relative shrink-0">
                                <img src={selectedEvent.thumb} className="w-full h-full object-cover opacity-40" alt="Cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] to-transparent" />
                                <div className="absolute bottom-6 left-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-amber-600 text-white px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider">{selectedEvent.type}</span>
                                        <span className="text-gray-300 text-sm font-mono flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {selectedEvent.date}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">{selectedEvent.title}</h2>
                                </div>
                                <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 hover:rotate-90 transition-all"><X className="w-5 h-5" /></button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Left: Rundown */}
                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-white/5">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><List className="w-5 h-5 text-amber-500" /> Rundown Minuto a Minuto</h3>
                                        <button className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"><Download className="w-3 h-3" /> PDF</button>
                                    </div>

                                    <div className="space-y-4 relative before:absolute before:left-[4.5rem] before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                                        {selectedEvent.rundown && selectedEvent.rundown.length > 0 ? (
                                            selectedEvent.rundown.map((item, i) => (
                                                <div key={i} className="flex gap-6 relative group">
                                                    <div className="w-16 pt-1 text-right text-sm font-mono text-amber-500 font-bold shrink-0">{item.time}</div>
                                                    <div className="absolute left-[4.25rem] top-2 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#0E0E18] z-10 box-content group-hover:scale-125 transition-transform" />
                                                    <div className="flex-1 bg-[#151520] border border-white/5 rounded-lg p-3 group-hover:border-amber-500/30 transition-colors">
                                                        <h4 className="text-white font-bold">{item.activity}</h4>
                                                        <p className="text-xs text-gray-400 mt-1">Role: {item.role}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 text-gray-500 italic">No hay rundown cargado aún.</div>
                                        )}

                                        <button className="ml-24 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border-t border-dashed border-gray-700 pt-4 mt-4 w-full">
                                            <Plus className="w-4 h-4" /> Agregar Actividad
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Logistics */}
                                <div className="w-80 bg-[#13131f] p-6 overflow-y-auto">
                                    <div className="mb-8">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Ubicación</h4>
                                        <div className="aspect-video bg-black/40 rounded-lg mb-2 border border-white/5 flex items-center justify-center text-gray-600 text-xs">[Map Preview]</div>
                                        <p className="text-white text-sm font-medium">{selectedEvent.location}</p>
                                        <button className="text-xs text-blue-400 mt-2 hover:underline">Ver en Google Maps</button>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Crew Asignado</h4>
                                        <div className="space-y-3">
                                            {/* Fake assigned crew based on available crew */}
                                            {CREW_MEMBERS.slice(0, 2).map(m => (
                                                <div key={m.id} className="flex items-center gap-3">
                                                    <img src={m.avatar} className="w-8 h-8 rounded-full" alt={m.name} />
                                                    <div>
                                                        <div className="text-white text-sm font-bold">{m.name}</div>
                                                        <div className="text-[10px] text-gray-400">{m.role}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-lg font-bold transition-colors mt-2">+ Asignar Crew</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
