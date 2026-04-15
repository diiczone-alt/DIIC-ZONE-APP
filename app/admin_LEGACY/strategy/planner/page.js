'use client';

import { 
    Calendar as CalendarIcon, 
    Grid, List, Filter, 
    ChevronLeft, ChevronRight,
    Instagram, Facebook, Video, 
    Type, Share2, MoreHorizontal,
    Plus, Clock, CheckCircle2,
    PlayCircle, FileEdit, Send
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StrategyPlannerPage() {
    const [view, setView] = useState('calendar');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const contentItems = [
        { 
            id: 'n1', 
            type: 'video', 
            label: 'Reel Viral: Beneficios Dieta', 
            platform: 'Instagram', 
            format: 'Reel',
            status: 'programado',
            date: '2026-03-25T18:00:00',
            copy: '¿Sabías que la dieta influye en tu rendimiento? #salud #bienestar',
            tags: '#vlog #fitness'
        },
        { 
            id: 'n2', 
            type: 'image', 
            label: 'Post: Caso de Éxito Hospital Nova', 
            platform: 'Facebook', 
            format: 'Post',
            status: 'aprobado',
            date: '2026-03-26T10:00:00',
            copy: 'Felices de compartir los resultados de la última cirugía de alta complejidad.',
            tags: '#medicina #exito'
        },
        { 
            id: 'n3', 
            type: 'video', 
            label: 'Story: Detrás de cámaras', 
            platform: 'Instagram', 
            format: 'Story',
            status: 'en_produccion',
            date: '2026-03-24T20:00:00',
            copy: 'Preparando la sesión de hoy ✨',
            tags: '#backstage'
        }
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'borrador': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
            case 'en_produccion': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'revision': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'aprobado': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
            case 'programado': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'publicado': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Planner de Contenido</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] tracking-[0.2em]">Sincronización Estratégica & Calendario</p>
                </div>
                
                <div className="flex bg-[#0A0A12] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
                    <button onClick={() => setView('calendar')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'calendar' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                        Calendario
                    </button>
                    <button onClick={() => setView('grid')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                        Vista Grid
                    </button>
                    <button onClick={() => setView('list')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                        Lista
                    </button>
                </div>
            </header>

            {/* Content Area */}
            {view === 'calendar' && (
                <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl min-h-[600px]">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-6">
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Marzo 2026</h2>
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
                            <Plus className="w-4 h-4" /> Nuevo Evento
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-4">
                                {d}
                            </div>
                        ))}
                        {/* Placeholder for days */}
                        {Array.from({ length: 31 }).map((_, i) => {
                            const day = i + 1;
                            const hasEvent = day === 24 || day === 25 || day === 26;
                            return (
                                <div key={i} className={`h-32 rounded-3xl border border-white/5 p-4 transition-all hover:bg-white/[0.02] relative group ${day === 24 ? 'bg-indigo-600/5 border-indigo-500/20' : ''}`}>
                                    <span className={`text-xs font-black ${day === 24 ? 'text-indigo-400' : 'text-gray-600'}`}>{day}</span>
                                    {hasEvent && (
                                        <div className="mt-2 space-y-1">
                                            {contentItems.filter(item => new Date(item.date).getDate() === day).map(item => (
                                                <div key={item.id} className={`p-2 rounded-lg text-[8px] font-black uppercase tracking-tight truncate border ${getStatusColor(item.status)}`}>
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {view === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {contentItems.map(item => (
                        <div key={item.id} className="bg-[#0A0A12] border border-white/5 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl">
                            <div className="aspect-square bg-white/[0.02] flex items-center justify-center relative">
                                {item.type === 'video' ? <PlayCircle className="w-12 h-12 text-gray-700" /> : <Grid className="w-12 h-12 text-gray-700" />}
                                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                                    {item.platform}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{item.label}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${getStatusColor(item.status)}`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    {new Date(item.date).toLocaleDateString()} — {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
