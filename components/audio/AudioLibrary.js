'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Download, Search, Filter, MoreVertical, Music2, Clock } from 'lucide-react';
import { useState } from 'react';

export default function AudioLibrary({ onBack }) {
    const [isPlaying, setIsPlaying] = useState(null);

    const MOCK_FILES = [
        { id: 1, name: 'Podcast_Intro_Final.wav', date: '2024-03-10', duration: '00:45', type: 'Master' },
        { id: 2, name: 'Background_Ambience_v2.mp3', date: '2024-03-08', duration: '02:30', type: 'SFX' },
        { id: 3, name: 'Voiceover_Take_05.wav', date: '2024-03-05', duration: '01:15', type: 'Raw' },
    ];

    return (
        <div className="min-h-screen bg-[#050511] text-white p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Music2 className="w-5 h-5" />
                            </span>
                            Audio Vault
                        </h1>
                        <p className="text-gray-500 text-sm">Gestiona tus masters, stems y grabaciones.</p>
                    </div>
                    <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Standard View</button>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex gap-4 mb-8 bg-[#0E0E18] p-2 rounded-2xl border border-white/5">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar en el vault..."
                            className="w-full bg-transparent h-12 pl-12 pr-4 text-sm text-white outline-none placeholder-gray-600"
                        />
                    </div>
                    <div className="w-px bg-white/10 my-2"></div>
                    <button className="px-6 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        <Filter className="w-4 h-4" />
                        Filtrar
                    </button>
                </div>

                {/* High-End List View */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-[2rem] overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="col-span-6">Filename</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Date Added</div>
                        <div className="col-span-1">Duration</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-white/5">
                        {MOCK_FILES.map((file) => (
                            <div key={file.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors group">
                                <div className="col-span-6 flex items-center gap-4">
                                    <button
                                        onClick={() => setIsPlaying(isPlaying === file.id ? null : file.id)}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all"
                                    >
                                        {isPlaying === file.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                                    </button>
                                    <div>
                                        <div className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{file.name}</div>
                                        <div className="flex gap-2 mt-1">
                                            {isPlaying === file.id && (
                                                <div className="flex items-end gap-0.5 h-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite]" style={{ height: `${Math.random() * 100}%` }}></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase border ${file.type === 'Master' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            file.type === 'SFX' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                'bg-gray-800 border-gray-700 text-gray-400'
                                        }`}>
                                        {file.type}
                                    </span>
                                </div>
                                <div className="col-span-2 text-xs text-gray-500 font-mono flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {file.date}
                                </div>
                                <div className="col-span-1 text-xs text-gray-500 font-mono">{file.duration}</div>
                                <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-white">
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
