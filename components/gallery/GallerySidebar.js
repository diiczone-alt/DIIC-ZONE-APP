'use client';

import {
    LayoutGrid, Image as ImageIcon, Video, Mic2, FileText,
    Folder, Star, Clock, Trash2, Cloud, Bookmark, Radio, Music, User, Disc, AudioWaveform, Sparkles, Heart
} from 'lucide-react';

const MENU_ITEMS = [
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'music', label: 'Música', icon: Music },
    { id: 'audios', label: 'Audios', icon: AudioWaveform },
    { id: 'photos', label: 'Fotografías', icon: ImageIcon },
    { id: 'images', label: 'Imágenes', icon: LayoutGrid },
    { id: 'albums', label: 'Álbumes', icon: Disc },
];

const PLAYLISTS = [
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'featured', label: 'Destacados', icon: Sparkles },
];

export default function GallerySidebar({ selected, onSelect }) {
    return (
        <div className="h-full bg-[#0F0F13] flex flex-col pt-10 pb-32">

            {/* BRAND LOGO AREA */}
            <div className="px-8 mb-12">
                <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1 drop-shadow-2xl">
                    GALERÍA
                </h1>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-80" />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-10">

                {/* MENU SECTION */}
                <div className="space-y-2">
                    {MENU_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group relative overflow-hidden ${selected.id === item.id
                                ? 'text-blue-400 bg-white/5 shadow-[0_0_20px_rgba(59,130,246,0.15)] border border-white/5'
                                : 'text-gray-500 hover:text-white hover:bg-white/5 hover:pl-6'
                                }`}
                        >
                            {/* Accent Bar for Active State */}
                            {selected.id === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]" />
                            )}

                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${selected.id === item.id
                                ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                                : 'text-gray-600 group-hover:text-gray-300'
                                }`} />
                            <span className="relative z-10 font-medium tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* PLAYLISTS SECTION */}
                <div>
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 px-5">Colecciones</h3>
                    <div className="space-y-1">
                        {PLAYLISTS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-sm font-medium transition-colors group ${selected.id === item.id
                                    ? 'text-white bg-white/5'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border border-white/5 ${selected.id === item.id
                                    ? 'bg-[#25252E] border-blue-500/30'
                                    : 'bg-[#1A1A20] group-hover:bg-[#25252E]'
                                    }`}>
                                    <item.icon className={`w-4 h-4 ${selected.id === item.id ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
                                </div>
                                <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
