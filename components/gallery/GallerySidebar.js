'use client';

import {
    LayoutGrid, Image as ImageIcon, Video, Mic2, FileText,
    Folder, Star, Clock, Trash2, Cloud, Bookmark, Radio, Music, User, Disc, AudioWaveform, Sparkles, Heart,
    Zap, Globe, Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
    { id: 'videos', label: 'Videos', icon: Video, color: 'text-blue-400', glow: 'shadow-blue-500/20' },
    { id: 'music', label: 'Música', icon: Music, color: 'text-purple-400', glow: 'shadow-purple-500/20' },
    { id: 'audios', label: 'Audios', icon: AudioWaveform, color: 'text-rose-400', glow: 'shadow-rose-500/20' },
    { id: 'photos', label: 'Fotografías', icon: ImageIcon, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    { id: 'images', label: 'Imágenes', icon: LayoutGrid, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
    { id: 'albums', label: 'Álbumes', icon: Disc, color: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
];

const PLAYLISTS = [
    { id: 'favorites', label: 'Favoritos', icon: Heart, color: 'text-rose-500' },
    { id: 'featured', label: 'Destacados', icon: Sparkles, color: 'text-indigo-400' },
];

export default function GallerySidebar({ selected, onSelect }) {
    return (
        <div className="h-full bg-[#08080C] border-r border-white/5 flex flex-col pt-12 pb-32 relative overflow-hidden">
            
            {/* Ambient Background Glow for Sidebar */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

            {/* BRAND LOGO AREA */}
            <div className="px-10 mb-16 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Command className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase leading-none">
                        GALERÍA
                    </h1>
                </div>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em] ml-11">Creative Node</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-12 relative z-10">

                {/* MAIN CATEGORIES */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-5 px-4">Explorador</h3>
                    {MENU_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black transition-all duration-500 group relative overflow-hidden ${selected.id === item.id
                                ? `${item.color} bg-white/[0.03] shadow-xl border border-white/5`
                                : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            {/* Accent indicator */}
                            <AnimatePresence>
                                {selected.id === item.id && (
                                    <motion.div 
                                        layoutId="sidebar-active"
                                        className={`absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </AnimatePresence>

                            <div className={`p-2 rounded-xl transition-all duration-500 ${
                                selected.id === item.id 
                                ? `bg-white/10 ${item.glow} scale-110` 
                                : 'bg-white/[0.02] group-hover:scale-110'
                            }`}>
                                <item.icon className={`w-4 h-4 ${selected.id === item.id ? item.color : 'text-gray-600'}`} />
                            </div>
                            
                            <span className="relative z-10 uppercase tracking-widest leading-none">{item.label}</span>

                            {selected.id === item.id && (
                                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`} />
                            )}
                        </button>
                    ))}
                </div>

                {/* COLLECTIONS SECTION */}
                <div>
                    <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-5 px-4">Colecciones</h3>
                    <div className="space-y-2">
                        {PLAYLISTS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all group ${selected.id === item.id
                                    ? 'text-white bg-white/[0.05] border border-white/5 shadow-inner'
                                    : 'text-gray-600 hover:text-gray-300'
                                    }`}
                            >
                                <item.icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-125 ${selected.id === item.id ? item.color : 'text-gray-700'}`} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {selected.id === item.id && (
                                     <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* BOTTOM TOOLS (Optional but adds value) */}
                <div className="pt-8 border-t border-white/5 space-y-4">
                     <button className="flex items-center gap-4 px-5 text-gray-600 hover:text-white transition-colors group">
                        <Cloud className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sync Cloud</span>
                     </button>
                     <button className="flex items-center gap-4 px-5 text-gray-600 hover:text-white transition-colors group">
                        <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Optimizar</span>
                     </button>
                </div>

            </div>
        </div>
    );
}
