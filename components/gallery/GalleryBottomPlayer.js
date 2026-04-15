'use client';

import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GalleryBottomPlayer({ activeFile }) {
    if (!activeFile) return null;

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 h-24 bg-[#121212]/95 backdrop-blur-xl border-t border-white/5 flex items-center px-8 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
            {/* LEFT: INFO */}
            <div className="flex items-center gap-4 w-1/4">
                <img
                    src={activeFile.image}
                    alt={activeFile.name}
                    className="w-14 h-14 rounded-lg object-cover shadow-lg"
                />
                <div>
                    <h4 className="text-white font-bold text-sm line-clamp-1">{activeFile.name}</h4>
                    <p className="text-gray-400 text-xs hover:text-white cursor-pointer transition-colors">{activeFile.department}</p>
                </div>
                <button className="text-gray-400 hover:text-green-500 transition-colors ml-2">
                    <Heart className="w-4 h-4" />
                </button>
            </div>

            {/* CENTER: CONTROLS */}
            <div className="flex flex-col items-center justify-center flex-1 gap-2">
                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-white transition-colors"><Shuffle className="w-4 h-4" /></button>
                    <button className="text-gray-200 hover:text-white transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>

                    <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-1" />
                    </button>

                    <button className="text-gray-200 hover:text-white transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
                    <button className="text-gray-400 hover:text-white transition-colors"><Repeat className="w-4 h-4" /></button>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xl flex items-center gap-3 text-xs font-mono text-gray-500">
                    <span>1:24</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-white rounded-full group-hover:bg-green-500 transition-colors">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                        </div>
                    </div>
                    <span>4:12</span>
                </div>
            </div>

            {/* RIGHT: VOLUME / EXTRA */}
            <div className="w-1/4 flex items-center justify-end gap-4">
                <button className="text-gray-400 hover:text-white transition-colors"><Volume2 className="w-5 h-5" /></button>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full w-3/4 bg-white rounded-full hover:bg-green-500 transition-colors" />
                </div>
                <button className="text-gray-400 hover:text-white transition-colors ml-2"><Maximize2 className="w-4 h-4" /></button>
            </div>

        </motion.div>
    );
}
