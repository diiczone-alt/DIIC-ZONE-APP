'use client';

import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function AudioPlayer({ currentTrack }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(33);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-6">
                {/* Album Art / Visualizer Placeholder */}
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                    <div className="flex gap-1 items-end h-10">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 bg-primary rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-2'}`}
                                style={{ height: isPlaying ? `${Math.random() * 100}%` : '20%' }}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-white">{currentTrack?.title || 'Selecciona una pista'}</h3>
                            <p className="text-sm text-gray-400">{currentTrack?.artist || 'Sin artista'}</p>
                        </div>
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">WAV • 44.1kHz</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mb-4 relative cursor-pointer group">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary rounded-full relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <SkipBack className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 group">
                            <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-gray-400 group-hover:bg-white transition-colors"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
