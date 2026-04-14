'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Mic2, Play, Pause, Square, ChevronLeft, UploadCloud,
    Sliders, Save, Volume2, SkipBack, SkipForward,
    MessageSquare, CheckCircle, Clock, Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioProjectPage({ params }) {
    const { projectId } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('studio');
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock Data
    const project = {
        id: projectId,
        title: 'Podcast Ep. 45 - El Futuro',
        client: 'Cliente Alpha',
        type: 'Podcast',
        deadline: 'Hoy, 18:00',
        objective: 'Discusión sobre IA con tono informativo pero relajado.',
        resources: [
            { name: 'Intro_Music.wav', type: 'Music' },
            { name: 'Host_Voice.wav', type: 'Voice' },
            { name: 'Guest_Interview.wav', type: 'Voice' }
        ]
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">{project.title}</h1>
                        <p className="text-xs text-violet-400 font-bold uppercase tracking-wider">{project.client}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 animate-pulse flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-500" />
                        En Sesión
                    </div>
                    <button
                        onClick={() => setActiveTab('studio')}
                        className="px-4 py-2 bg-white text-black text-sm font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-white/10 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Guardar Mix
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-white/5 px-6 flex items-center gap-6 shrink-0 bg-[#050511]">
                {[
                    { id: 'brief', label: 'Brief' },
                    { id: 'studio', label: 'Estudio de Grabación' },
                    { id: 'feedback', label: 'Feedback' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 text-sm font-bold relative transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'brief' && <BriefTab key="brief" project={project} />}
                    {activeTab === 'studio' && <StudioTab key="studio" isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
                    {activeTab === 'feedback' && <FeedbackTab key="feedback" />}
                </AnimatePresence>
            </div>
        </div>
    );
}

function BriefTab({ project }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5 text-gray-300">
                    <h3 className="text-white font-bold mb-4">Detalles del Proyecto</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">Objetivo</label>
                            <p className="mt-1">{project.objective}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">Tipo de Audio</label>
                            <p className="mt-1 text-violet-400">{project.type}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">Entrega</label>
                            <p className="mt-1">{project.deadline}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Music className="w-5 h-5 text-gray-400" /> Recursos Disponibles
                    </h3>
                    <div className="space-y-2">
                        {project.resources.map((res, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="p-2 bg-gray-800 rounded-lg">
                                    <Volume2 className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-300">{res.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">{res.type}</p>
                                </div>
                                <button className="ml-auto text-xs text-violet-400 hover:text-white hover:underline">
                                    Cargar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StudioTab({ isPlaying, setIsPlaying }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col max-w-6xl mx-auto space-y-6">

            {/* Visualizer / Waveform Area */}
            <div className="flex-1 bg-[#0A0A12] border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 flex items-center justify-center gap-1 px-10">
                    {[...Array(100)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-full transition-all duration-100 ${isPlaying ? 'bg-violet-500 animate-pulse' : 'bg-gray-800'}`}
                            style={{
                                height: `${isPlaying ? Math.random() * 80 + 10 : 20}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Playhead */}
                <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-red-500 z-10">
                    <div className="absolute top-0 -translate-x-1/2 bg-red-500 text-white text-[10px] px-1 rounded-sm">00:15</div>
                </div>
            </div>

            {/* Controls */}
            <div className="h-24 bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex items-center justify-between px-8">
                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-white"><SkipBack className="w-5 h-5" /></button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isPlaying ? 'bg-red-500/20 text-red-500 border border-red-500' : 'bg-white text-black hover:scale-105'}`}
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>

                    <button className="text-gray-400 hover:text-white"><SkipForward className="w-5 h-5" /></button>
                    <button className="w-10 h-10 rounded-full border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors pb-1">
                        <div className="w-3 h-3 rounded-full bg-current" />
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-3xl font-mono font-bold text-white tracking-widest">{isPlaying ? '00:15:24' : '00:00:00'}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Timecode</span>
                </div>

                <div className="flex items-center gap-4 w-48">
                    <Volume2 className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-violet-500" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function FeedbackTab() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto space-y-4">
            {/* Review Item */}
            <div className="bg-[#0E0E18] border border-white/5 p-4 rounded-xl flex gap-4">
                <div className="p-3 bg-white/5 rounded-lg flex flex-col items-center justify-center shrink-0 w-16">
                    <span className="text-xs font-bold text-violet-400">00:45</span>
                    <Clock className="w-4 h-4 text-gray-500 mt-1" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-white">Volumen de la música</h4>
                        <span className="text-xs text-gray-500">Ayer</span>
                    </div>
                    <p className="text-sm text-gray-300">En esta parte la música está muy alta y tapa la voz del invitado. Bajar -3dB.</p>
                </div>
                <button className="h-8 px-3 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    Corregido
                </button>
            </div>
        </motion.div>
    );
}
