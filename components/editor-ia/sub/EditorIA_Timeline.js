'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Scissors, Music, Wand2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function EditorIA_Timeline() {
    const [isPlaying, setIsPlaying] = useState(false);

    const timelineBlocks = [
        { id: 1, type: 'Intro', label: 'Intro', duration: '2s', color: 'bg-indigo-500' },
        { id: 2, type: 'Hook', label: 'Gancho Visual', duration: '3s', color: 'bg-pink-500' },
        { id: 3, type: 'Body', label: 'Desarrollo Conceptual', duration: '15s', color: 'bg-blue-600', width: 'flex-1' },
        { id: 4, type: 'B-Roll', label: 'B-Roll Dinámico', duration: '5s', color: 'bg-cyan-600' },
        { id: 5, type: 'CTA', label: 'Llamado Acción', duration: '4s', color: 'bg-purple-600' },
        { id: 6, type: 'Outro', label: 'Logo Final', duration: '2s', color: 'bg-slate-700' },
    ];

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col h-full relative group">

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
                    </button>
                    <div className="bg-black/30 px-3 py-1.5 rounded-full border border-white/5 text-xs font-mono text-gray-400">
                        00:12:04 / 00:30:00
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ActionButton icon={Scissors} label="Recortar" />
                    <ActionButton icon={Music} label="Música" />
                    <div className="h-6 w-px bg-white/10 mx-1" />
                    <ActionButton icon={RefreshCw} label="Re-Analizar" color="text-orange-400 hover:text-orange-300" />
                </div>
            </div>

            {/* Timeline Visualizer */}
            <div className="flex-1 relative flex items-center bg-black/20 rounded-xl overflow-hidden px-4 border border-white/5">
                {/* Time Cursor */}
                <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-red-500 z-20 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rotate-45" />
                </div>

                {/* Blocks Container */}
                <div className="flex gap-1 w-full h-24 relative z-10">
                    {timelineBlocks.map((block) => (
                        <motion.div
                            key={block.id}
                            whileHover={{ scaleY: 1.05, zIndex: 10 }}
                            className={`${block.width || 'w-24'} ${block.color} rounded-lg opacity-80 hover:opacity-100 transition-all border border-white/10 relative flex flex-col justify-center items-center cursor-pointer group/block`}
                        >
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">{block.label}</span>
                            <span className="text-[9px] text-white/70">{block.duration}</span>

                            {/* Hover Edit Icon */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/block:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                <Wand2 className="w-4 h-4 text-white" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Audio Waveform Decoration */}
            <div className="mt-2 h-8 flex items-end gap-0.5 opacity-30 px-4">
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className="w-full bg-cyan-500 rounded-t-sm"
                        style={{ height: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

function ActionButton({ icon: Icon, label, color = "text-gray-400 hover:text-white" }) {
    return (
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{label}</span>
        </button>
    );
}
