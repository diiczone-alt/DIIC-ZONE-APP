'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, Play, Pause, Volume2, Download, Share2,
    Sliders, Radio, Trash2, CheckCircle, Music, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import WorkstationProfileDropdown from '@/components/workstation/WorkstationProfileDropdown';

const MOCK_TRACKS = [
    { id: 1, name: 'Voz Principal - Podcast Ep. 45', type: 'Vocal Stem', size: '42.1 MB', duration: '45:30', date: 'Hace 2 horas', status: 'ready', volume: 80, isMuted: false, isSolo: false },
    { id: 2, name: 'Música de Fondo - Intro / Outro', type: 'Background Beat', size: '4.8 MB', duration: '02:15', date: 'Hace 1 día', status: 'ready', volume: 65, isMuted: false, isSolo: false },
    { id: 3, name: 'Efectos Especiales - Transición Rápida', type: 'SFX Stem', size: '1.2 MB', duration: '00:15', date: 'Hace 3 días', status: 'draft', volume: 90, isMuted: false, isSolo: false },
];

export default function AudioTracksPage() {
    const router = useRouter();
    const [tracks, setTracks] = useState(MOCK_TRACKS);
    const [playingTrackId, setPlayingTrackId] = useState(null);

    const handlePlayToggle = (id) => {
        if (playingTrackId === id) {
            setPlayingTrackId(null);
            toast.info('Pista pausada');
        } else {
            setPlayingTrackId(id);
            const track = tracks.find(t => t.id === id);
            toast.success(`Reproduciendo stem: ${track?.name}`);
        }
    };

    const handleVolumeChange = (id, newVolume) => {
        setTracks(tracks.map(track => 
            track.id === id ? { ...track, volume: newVolume } : track
        ));
    };

    const handleMuteToggle = (id) => {
        setTracks(tracks.map(track => {
            if (track.id === id) {
                const nextMuted = !track.isMuted;
                if (nextMuted) toast.warning(`Pista ${track.name} silenciada`);
                else toast.info(`Pista ${track.name} activa`);
                return { ...track, isMuted: nextMuted };
            }
            return track;
        }));
    };

    const handleSoloToggle = (id) => {
        setTracks(tracks.map(track => {
            if (track.id === id) {
                const nextSolo = !track.isSolo;
                if (nextSolo) toast.success(`Solo activado para: ${track.name}`);
                return { ...track, isSolo: nextSolo };
            }
            return track;
        }));
    };

    const handleDownload = (name) => {
        toast.success(`Iniciando descarga: ${name}`);
    };

    const handleShare = (name) => {
        toast.info(`Enlace de revisión copiado para: ${name}`);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <style>{`
                @keyframes track-pulse {
                    0% { opacity: 0.3; transform: scaleY(0.4); }
                    100% { opacity: 1; transform: scaleY(1.1); }
                }
            `}</style>

            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Radio className="w-5 h-5 text-violet-400" /> Mis Pistas
                        </h1>
                        <p className="text-xs text-gray-400">Canales de audio y stems de producción activos</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <WorkstationProfileDropdown role="Audio" />
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Consola de Stems</h2>
                        <button 
                            onClick={() => {
                                setTracks(MOCK_TRACKS);
                                toast.success('Consola restablecida');
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors border border-white/10"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Restablecer Consola
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {tracks.map(track => (
                            <div 
                                key={track.id} 
                                className={`bg-[#0e0e1a] border rounded-2xl p-6 transition-all flex flex-col gap-4 ${playingTrackId === track.id ? 'border-violet-500/40 bg-violet-950/5' : 'border-white/5'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => handlePlayToggle(track.id)}
                                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${playingTrackId === track.id ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/15'}`}
                                        >
                                            {playingTrackId === track.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                        </button>
                                        <div>
                                            <h3 className="font-bold text-white text-base flex items-center gap-2">
                                                {track.name}
                                                {track.status === 'ready' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{track.type} • {track.size} • {track.duration}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleDownload(track.name)}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors border border-white/5"
                                            title="Descargar"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleShare(track.name)}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors border border-white/5"
                                            title="Compartir enlace"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Mixer Strips */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5 items-center">
                                    {/* Waveform / Visualizer */}
                                    <div className="h-10 bg-black/40 rounded-xl px-4 flex items-center gap-1 overflow-hidden border border-white/5 relative">
                                        {Array(40).fill(0).map((_, i) => {
                                            const pulseDelay = i * 0.03;
                                            const duration = 0.4 + (i % 4) * 0.15;
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`flex-1 rounded-full transition-all duration-300 ${playingTrackId === track.id ? (track.isMuted ? 'bg-gray-700' : 'bg-violet-400') : 'bg-gray-800'}`}
                                                    style={{
                                                        height: playingTrackId === track.id && !track.isMuted ? '90%' : '25%',
                                                        transformOrigin: 'center',
                                                        animation: playingTrackId === track.id && !track.isMuted ? `track-pulse ${duration}s ease-in-out infinite alternate` : 'none',
                                                        animationDelay: `${pulseDelay}s`
                                                    }}
                                                />
                                            );
                                        })}
                                        {track.isMuted && (
                                            <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center text-[10px] uppercase font-bold text-red-400 tracking-wider">
                                                SILENCIADO
                                            </div>
                                        )}
                                    </div>

                                    {/* Mixer Fader, Mute, Solo */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleMuteToggle(track.id)}
                                                className={`px-3 py-1 rounded text-xs font-bold transition-all border ${track.isMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                            >
                                                M
                                            </button>
                                            <button 
                                                onClick={() => handleSoloToggle(track.id)}
                                                className={`px-3 py-1 rounded text-xs font-bold transition-all border ${track.isSolo ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                            >
                                                S
                                            </button>
                                        </div>

                                        <div className="flex-1 flex items-center gap-3">
                                            <Volume2 className={`w-4 h-4 ${track.isMuted ? 'text-red-500' : 'text-gray-400'}`} />
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                value={track.isMuted ? 0 : track.volume}
                                                disabled={track.isMuted}
                                                onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value))}
                                                className="w-full accent-violet-500 bg-white/10 rounded-lg cursor-pointer h-1.5"
                                            />
                                            <span className="text-xs font-mono text-gray-400 w-8 text-right">{track.isMuted ? 0 : track.volume}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
