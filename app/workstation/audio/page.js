'use client';

import { useState } from 'react';
import {
    Mic2, Music, Download, Share2, Play, Pause,
    Filter, Search, Plus, MoreVertical, X, CheckCircle,
    Copy, Volume2, Calendar, List, Clock, User,
    MessageSquare, Disc, Radio, Sliders, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const AUDIO_PROJECTS = [
    { id: 1, title: 'Podcast "Emprende" Ep. 45', client: 'DIIC Media', type: 'Podcast', duration: '45:30', status: 'mixing', progress: 60, thumb: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=800&auto=format&fit=crop&q=60' },
    { id: 2, title: 'Jingle Comercial Navidad', client: 'EcoStore', type: 'Advertising', duration: '00:30', status: 'mastering', progress: 90, thumb: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Voz en Off - Video Corp', client: 'Tech Solutions', type: 'Voiceover', duration: '02:15', status: 'recording', progress: 20, thumb: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=60' },
    { id: 4, title: 'Banda Sonora Docu-Serie', client: 'Indie Film', type: 'Scoring', duration: '12:00', status: 'queue', progress: 0, thumb: 'https://images.unsplash.com/photo-1507838153414-b4b713384ebd?w=800&auto=format&fit=crop&q=60' },
];

const SESSIONS = [
    { id: 'SES-001', title: 'Rodaje Voz en Off', client: 'Clínica Dental', time: '10:00 - 12:00', date: 'Hoy', studio: 'Studio A' },
    { id: 'SES-002', title: 'Grabación Baterías', client: 'Rock Band', time: '14:00 - 18:00', date: 'Hoy', studio: 'Studio B' },
    { id: 'SES-003', title: 'Revisión Final Mix', client: 'EcoStore', time: '11:00 - 12:00', date: 'Mañana', studio: 'Control Room' },
];

export default function AudioDashboard() {
    const [activeTab, setActiveTab] = useState('queue');
    const [selectedProject, setSelectedProject] = useState(null);
    const [isPlaying, setIsPlaying] = useState(null);

    const togglePlay = (id) => {
        if (isPlaying === id) {
            setIsPlaying(null);
        } else {
            setIsPlaying(id);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        <Mic2 className="w-5 h-5 text-amber-500" /> Estación de Audio
                    </h1>
                    <div className="flex bg-[#121212] p-1 rounded-lg border border-white/10">
                        <button onClick={() => setActiveTab('queue')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'queue' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Sliders className="w-3.5 h-3.5" /> Mezcla
                        </button>
                        <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${activeTab === 'schedule' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Calendar className="w-3.5 h-3.5" /> Agenda Estudio
                            {SESSIONS.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        <UploadCloud className="w-3.5 h-3.5" /> Nuevo Proyecto
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative p-8">
                <AnimatePresence mode="wait">

                    {/* --- MIXING QUEUE --- */}
                    {activeTab === 'queue' && (
                        <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex gap-8">
                            {/* Project List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-amber-600/20 rounded-lg text-amber-400"><Disc className="w-6 h-6 animate-spin-slow" /></div>
                                    Cola de Producción
                                </h2>
                                <div className="space-y-4">
                                    {AUDIO_PROJECTS.map(project => (
                                        <div
                                            key={project.id}
                                            onClick={() => setSelectedProject(project)}
                                            className="group relative bg-[#121212] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-amber-500/30 transition-all flex items-center gap-6"
                                        >
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                                                <img src={project.thumb} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); togglePlay(project.id); }}
                                                        className="p-2 bg-amber-500 text-black rounded-full hover:scale-110 transition-transform shadow-lg shadow-amber-500/40"
                                                    >
                                                        {isPlaying === project.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-white font-bold text-lg truncate pr-4">{project.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${project.status === 'mastering' ? 'border-purple-500 text-purple-400' : 'border-gray-500 text-gray-400'}`}>{project.status}</span>
                                                </div>
                                                <p className="text-amber-500/80 text-xs font-mono mb-3">{project.client} • {project.type}</p>

                                                {/* Fake Waveform */}
                                                <div className="flex items-center gap-2 h-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    {Array(30).fill(0).map((_, i) => (
                                                        <div key={i} className="flex-1 bg-white rounded-full transition-all duration-300" style={{ height: `${Math.random() * 100}%`, opacity: isPlaying === project.id ? 1 : 0.3 }} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="text-right pl-4 border-l border-white/5 shrink-0 w-32">
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Duración</div>
                                                <div className="text-white font-mono text-sm mb-3">{project.duration}</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Progreso</div>
                                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${project.progress}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Now Playing / Quick Stats */}
                            <div className="w-80 bg-[#121212] border border-white/5 rounded-2xl p-6 hidden xl:block">
                                <h3 className="text-gray-400 text-xs font-bold uppercase mb-6">Estadísticas de Estudio</h3>
                                <div className="space-y-6">
                                    <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-bold">Uso de CPU</span>
                                            <span className="text-green-400 text-xs font-mono">12%</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[12%]" /></div>
                                    </div>
                                    <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-bold">Almacenamiento</span>
                                            <span className="text-amber-400 text-xs font-mono">1.2TB / 4TB</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[30%]" /></div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            <span className="text-white text-sm font-bold">En Vivo: Studio A</span>
                                        </div>
                                        <div className="aspect-video bg-black rounded-lg border border-white/10 flex items-center justify-center text-gray-600 text-xs">
                                            [Camera Feed Placeholder]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- STUDIO SCHEDULE --- */}
                    {activeTab === 'schedule' && (
                        <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full max-w-5xl mx-auto overflow-y-auto custom-scrollbar">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="p-2 bg-amber-600/20 rounded-lg text-amber-400"><Calendar className="w-6 h-6" /></div>
                                Agenda de Estudio
                            </h2>
                            <div className="grid gap-4">
                                {SESSIONS.map(session => (
                                    <div key={session.id} className="bg-[#121212] border-l-4 border-amber-500 rounded-r-xl p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold text-white">{session.time}</h3>
                                                <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-xs font-mono uppercase">{session.date}</span>
                                            </div>
                                            <p className="text-gray-400">{session.title} <span className="text-gray-600 mx-2">•</span> <span className="text-amber-500">{session.client}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Ubicación</div>
                                            <div className="text-white font-bold flex items-center gap-2 justify-end"><Mic2 className="w-4 h-4 text-gray-500" /> {session.studio}</div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white"><MoreVertical className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* --- PROJECT DETAIL MODAL (Placeholder for future expansion) --- */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8" onClick={() => setSelectedProject(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#121212] border border-white/10 rounded-2xl p-8 max-w-2xl w-full text-center" onClick={e => e.stopPropagation()}>
                            <Music className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
                            <p className="text-gray-400 mb-8">Gestión avanzada de pistas próximamente...</p>
                            <button onClick={() => setSelectedProject(null)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">Cerrar</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
