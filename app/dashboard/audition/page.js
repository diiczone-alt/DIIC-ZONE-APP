'use client';

import { Mic2, Music2, UploadCloud, Plus } from 'lucide-react';
import AudioPlayer from '../../../components/ui/AudioPlayer';
import TrackList from '../../../components/audition/TrackList';

export default function AuditionPage() {
    const demoTracks = [
        { id: 1, title: 'Podcast Intro - Corporativo', artist: 'DIIC Studio', genre: 'Jingle', duration: '0:15' },
        { id: 2, title: 'Voz en Off - Spot Comercial', artist: 'Maria Voiceover', genre: 'Locución', duration: '0:45' },
        { id: 3, title: 'Beat Urbano - Fondo', artist: 'Beatmaker Pro', genre: 'Hiphop', duration: '2:30' },
        { id: 4, title: 'Sonido Ambiente - Oficina', artist: 'SFX Library', genre: 'Efectos', duration: '1:00' },
        { id: 5, title: 'Entrevista Cliente - Raw', artist: 'Grabación Campo', genre: 'Entrevista', duration: '15:20' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <Mic2 className="w-8 h-8 text-primary" />
                        Audition
                    </h2>
                    <p className="text-muted-foreground">Gestión de grabaciones, locuciones y biblioteca musical.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 transition-colors">
                        <UploadCloud className="w-4 h-4" />
                        <span className="text-sm font-medium">Subir Pista</span>
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Nueva Grabación</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Player Area */}
                <div className="lg:col-span-8 space-y-6">
                    <section>
                        <h3 className="text-lg font-bold text-white mb-4">Reproduciendo Ahora</h3>
                        <AudioPlayer currentTrack={demoTracks[0]} />
                    </section>

                    <section className="bg-[#0A0A15]/50 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Music2 className="w-5 h-5 text-purple-400" />
                                Biblioteca de Proyecto
                            </h3>
                            <div className="flex gap-2">
                                <select className="bg-black/20 border border-white/10 rounded-lg text-xs text-gray-400 px-3 py-1 outline-none focus:border-primary/50">
                                    <option>Todos los Tipos</option>
                                    <option>Locuciones</option>
                                    <option>Música</option>
                                    <option>SFX</option>
                                </select>
                            </div>
                        </div>
                        <TrackList tracks={demoTracks} />
                    </section>
                </div>

                {/* Sidebar / Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gradient-to-br from-primary/20 to-purple-900/20 border border-primary/20 rounded-2xl p-6">
                        <h4 className="text-white font-bold mb-1">Espacio Disponible</h4>
                        <div className="w-full h-2 bg-black/40 rounded-full mt-2 mb-1 overflow-hidden">
                            <div className="w-[65%] h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>6.5 GB usados</span>
                            <span>10 GB total</span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h4 className="text-white font-bold mb-4">Sesiones Recientes</h4>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-black/20 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-200 font-medium group-hover:text-primary transition-colors">Sesión #42 - Voz</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Finalizado</span>
                                </div>
                                <span className="text-xs text-gray-500">Hace 2 horas • 3 tomas</span>
                            </div>
                            <div className="p-3 rounded-lg bg-black/20 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-200 font-medium group-hover:text-primary transition-colors">Jingle Campaña</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Editando</span>
                                </div>
                                <span className="text-xs text-gray-500">Ayer • 12 tomas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
