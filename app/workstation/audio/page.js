'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Mic2, Music, Download, Share2, Play, Pause,
    Filter, Search, Plus, MoreVertical, X, CheckCircle,
    Copy, Volume2, Calendar, List, Clock, User,
    MessageSquare, Disc, Radio, Sliders, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import WorkstationProfileDropdown from '@/components/workstation/WorkstationProfileDropdown';

// --- MOCK DATA ---
const INITIAL_AUDIO_PROJECTS = [
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
    const router = useRouter();
    const [projects, setProjects] = useState(INITIAL_AUDIO_PROJECTS);
    const [activeTab, setActiveTab] = useState('queue');
    const [isPlaying, setIsPlaying] = useState(null);
    
    // CPU fluctuation
    const [cpuUsage, setCpuUsage] = useState(12);

    // Live Camera Timecode
    const [timecode, setTimecode] = useState('12:01:24');

    // New Project Modal State
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    
    // New Project Form State
    const [newTitle, setNewTitle] = useState('');
    const [newClient, setNewClient] = useState('');
    const [newType, setNewType] = useState('Podcast');
    const [newDuration, setNewDuration] = useState('');
    const [newStatus, setNewStatus] = useState('queue');

    // CPU load simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuUsage(prev => {
                const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const nextVal = prev + delta;
                return Math.max(5, Math.min(30, nextVal));
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Timecode simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            setTimecode(`${hrs}:${mins}:${secs}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const togglePlay = (id) => {
        if (isPlaying === id) {
            setIsPlaying(null);
            toast.info('Audio en pausa');
        } else {
            setIsPlaying(id);
            const proj = projects.find(p => p.id === id);
            toast.success(`Reproduciendo: ${proj?.title}`);
        }
    };

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newClient.trim() || !newDuration.trim()) {
            toast.error('Por favor, rellena todos los campos');
            return;
        }

        const newProject = {
            id: Date.now(),
            title: newTitle,
            client: newClient,
            type: newType,
            duration: newDuration,
            status: newStatus,
            progress: newStatus === 'queue' ? 0 : newStatus === 'recording' ? 10 : newStatus === 'mixing' ? 50 : 90,
            thumb: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=60'
        };

        setProjects([newProject, ...projects]);
        setIsNewProjectModalOpen(false);
        toast.success('¡Nuevo proyecto creado con éxito!');

        // Reset form
        setNewTitle('');
        setNewClient('');
        setNewType('Podcast');
        setNewDuration('');
        setNewStatus('queue');
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Custom CSS for animations */}
            <style>{`
                @keyframes bounce-height {
                    0% { transform: scaleY(0.2); }
                    100% { transform: scaleY(1.2); }
                }
                @keyframes live-bar {
                    0% { height: 15%; }
                    50% { height: 95%; }
                    100% { height: 25%; }
                }
            `}</style>

            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        <Mic2 className="w-5 h-5 text-amber-500" /> Estación de Audio
                    </h1>
                    <div className="flex bg-[#0d0d1a] p-1 rounded-lg border border-white/10">
                        <button onClick={() => setActiveTab('queue')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'queue' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Sliders className="w-3.5 h-3.5" /> Mezcla
                        </button>
                        <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${activeTab === 'schedule' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Calendar className="w-3.5 h-3.5" /> Agenda Estudio
                            {SESSIONS.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsNewProjectModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg hover:scale-105 transition-all shadow-lg shadow-amber-500/10"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Proyecto
                    </button>
                    <WorkstationProfileDropdown role="Audio" />
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
                                    <div className="p-2 bg-amber-600/20 rounded-lg text-amber-400"><Disc className={`w-6 h-6 ${isPlaying !== null ? 'animate-spin-slow text-amber-500' : ''}`} /></div>
                                    Cola de Producción
                                </h2>
                                <div className="space-y-4">
                                    {projects.map(project => (
                                        <div
                                            key={project.id}
                                            onClick={() => router.push(`/workstation/audio/project/${project.id}`)}
                                            className="group relative bg-[#0e0e1a] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-amber-500/30 hover:bg-white/[0.02] transition-all flex items-center gap-6"
                                        >
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                                                <img src={project.thumb} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); togglePlay(project.id); }}
                                                        className="p-2 bg-amber-500 text-black rounded-full hover:scale-110 transition-transform shadow-lg shadow-amber-500/40"
                                                    >
                                                        {isPlaying === project.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current pl-0.5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-white font-bold text-lg truncate pr-4 group-hover:text-amber-400 transition-colors">{project.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${project.status === 'mastering' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : project.status === 'mixing' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : project.status === 'recording' ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-gray-500 text-gray-400'}`}>{project.status}</span>
                                                </div>
                                                <p className="text-amber-500/80 text-xs font-mono mb-3">{project.client} • {project.type}</p>

                                                {/* Animated Waveform */}
                                                <div className="flex items-center gap-1.5 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {Array(34).fill(0).map((_, i) => {
                                                        const randomDelay = i * 0.04;
                                                        const randomDuration = 0.5 + (i % 5) * 0.15;
                                                        return (
                                                            <div 
                                                                key={i} 
                                                                className={`flex-1 rounded-full transition-all duration-300 ${isPlaying === project.id ? 'bg-amber-500' : 'bg-gray-700'}`} 
                                                                style={{ 
                                                                    height: isPlaying === project.id ? '100%' : `${15 + (i % 4) * 15}%`,
                                                                    transformOrigin: 'bottom',
                                                                    animation: isPlaying === project.id ? `bounce-height ${randomDuration}s ease-in-out infinite alternate` : 'none',
                                                                    animationDelay: `${randomDelay}s`
                                                                }} 
                                                            />
                                                        );
                                                    })}
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
                            <div className="w-80 bg-[#0e0e1a] border border-white/5 rounded-2xl p-6 hidden xl:block flex flex-col justify-between h-fit gap-6">
                                <div>
                                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-6 tracking-widest">Estadísticas de Estudio</h3>
                                    <div className="space-y-6">
                                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-white text-sm font-bold">Uso de CPU</span>
                                                <span className="text-green-400 text-xs font-mono">{cpuUsage}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-green-500 transition-all duration-1000" 
                                                    style={{ width: `${cpuUsage}%` }} 
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-white text-sm font-bold">Almacenamiento</span>
                                                <span className="text-amber-400 text-xs font-mono">1.2TB / 4TB</span>
                                            </div>
                                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[30%]" /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${isPlaying !== null ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                                            <span className="text-white text-xs font-bold uppercase tracking-wider">
                                                {isPlaying !== null ? 'En Vivo: Studio A (Monitoreo)' : 'Cámara: Studio A'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-500">{timecode}</span>
                                    </div>

                                    {/* Interactive Live Screen */}
                                    <div className="aspect-video bg-black rounded-lg border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group/screen">
                                        {isPlaying !== null ? (
                                            /* Simulated Audio Spectrum Analyzer */
                                            <div className="absolute inset-0 flex items-end justify-center gap-[3px] p-4 bg-gradient-to-t from-violet-950/60 to-black/80">
                                                {Array(16).fill(0).map((_, i) => {
                                                    const duration = 0.6 + (i % 4) * 0.15;
                                                    const delay = i * 0.03;
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="flex-1 bg-gradient-to-t from-violet-600 via-amber-500 to-amber-400 rounded-t-sm"
                                                            style={{
                                                                height: '100%',
                                                                transformOrigin: 'bottom',
                                                                animation: `live-bar ${duration}s ease-in-out infinite alternate`,
                                                                animationDelay: `${delay}s`
                                                            }}
                                                        />
                                                    );
                                                })}
                                                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                                                    <span className="text-[9px] font-bold text-red-500 tracking-widest bg-black/40 px-1.5 py-0.5 rounded w-fit border border-red-500/20">LIVE AUDIO</span>
                                                    <span className="text-[9px] font-mono text-violet-400 text-right">RMS: -14.2 dB</span>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Simulated Standby CCTV Feed */
                                            <>
                                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.07] pointer-events-none">
                                                    {Array(36).fill(0).map((_, i) => (
                                                        <div key={i} className="border border-white" />
                                                    ))}
                                                </div>
                                                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none" />
                                                <Radio className="w-8 h-8 text-gray-700 group-hover/screen:text-amber-500/50 transition-colors mb-2" />
                                                <span className="text-gray-500 text-[10px] font-mono tracking-wider uppercase">[Studio A - STANDBY]</span>
                                            </>
                                        )}
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
                                    <div key={session.id} className="bg-[#0e0e1a] border-l-4 border-amber-500 rounded-r-xl p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
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

            {/* --- NEW PROJECT DIALOG --- */}
            <AnimatePresence>
                {isNewProjectModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsNewProjectModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.95, y: 20 }} 
                            className="bg-[#0e0e1a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-amber-500/5"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <UploadCloud className="w-5 h-5 text-amber-500" /> Crear Nuevo Proyecto
                                </h3>
                                <button 
                                    onClick={() => setIsNewProjectModalOpen(false)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Título del Proyecto</label>
                                    <input 
                                        type="text" 
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        placeholder="e.g. Grabación Single Artista"
                                        className="w-full bg-[#050511] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/80 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Cliente</label>
                                    <input 
                                        type="text" 
                                        value={newClient}
                                        onChange={e => setNewClient(e.target.value)}
                                        placeholder="e.g. Warner Music"
                                        className="w-full bg-[#050511] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/80 transition-colors"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Tipo</label>
                                        <select 
                                            value={newType}
                                            onChange={e => setNewType(e.target.value)}
                                            className="w-full bg-[#050511] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/80 transition-colors"
                                        >
                                            <option value="Podcast">Podcast</option>
                                            <option value="Advertising">Publicidad</option>
                                            <option value="Voiceover">Voz en Off</option>
                                            <option value="Scoring">Banda Sonora</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Duración estimada</label>
                                        <input 
                                            type="text" 
                                            value={newDuration}
                                            onChange={e => setNewDuration(e.target.value)}
                                            placeholder="e.g. 03:45"
                                            className="w-full bg-[#050511] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/80 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Fase Inicial</label>
                                    <select 
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value)}
                                        className="w-full bg-[#050511] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/80 transition-colors"
                                    >
                                        <option value="queue">En Cola</option>
                                        <option value="recording">Grabación</option>
                                        <option value="mixing">Mezcla</option>
                                        <option value="mastering">Masterización</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5 mt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setIsNewProjectModalOpen(false)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg transition-colors shadow-lg shadow-amber-500/10"
                                    >
                                        Crear Proyecto
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
