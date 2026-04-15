'use client';

import { Bell, ChevronDown, Heart, MoreHorizontal, Play, SkipBack, SkipForward, Repeat, Shuffle, User } from 'lucide-react';

const CONTRIBUTORS = [
    { name: 'Sammy Simorangkir', role: 'Editor', albums: 20, img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
    { name: 'Rossa', role: 'Designer', albums: 15, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { name: 'Dewa 19', role: 'Filmmaker', albums: 10, img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
    { name: 'Juicy Luicy', role: 'Audio', albums: 11, img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80' },
];

export default function GalleryRightSidebar({ selectedFile }) {
    // Default mock if none selected
    const activeFile = selectedFile || {
        name: 'Selecciona un archivo',
        department: 'Galería',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        author: 'Sistema'
    };

    return (
        <div className="w-80 h-full flex flex-col gap-8 pl-4 border-l border-white/5">

            {/* USER PROFILE HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                        <img src="https://github.com/shadcn.png" alt="User" className="w-full h-full rounded-full border-2 border-[#0A0F1F]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1">
                            Oji Ganteng <ChevronDown className="w-3 h-3 text-gray-500" />
                        </h4>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Member</span>
                    </div>
                </div>
                <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-[#0A0F1F]"></span>
                </button>
            </div>

            {/* TOP CONTRIBUTORS / ARTISTS */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Top Creators</h3>
                    <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">See all</button>
                </div>
                <div className="space-y-4">
                    {CONTRIBUTORS.map((user, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{user.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <FolderIcon className="w-3 h-3 text-gray-600" />
                                        <span className="text-[10px] text-gray-500 font-bold">{user.albums} Files</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-black text-gray-600 group-hover:text-white transition-colors">0{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* PREVIEW WIDGET (Bottom Card) */}
            <div className="mt-auto relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-2xl shadow-purple-900/10">
                <img src={activeFile.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1F] via-[#0A0F1F]/40 to-transparent" />

                {/* Vinyl/Brand Logo Top Right */}
                <div className="absolute top-6 right-6 p-2 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="text-[#FDBB2F] font-black text-xs tracking-tighter">pro-M</div>
                    <div className="text-[8px] text-gray-400 leading-none">STUDIO</div>
                </div>

                {/* Content Info */}
                <div className="absolute bottom-0 w-full p-6">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{activeFile.name}</h3>
                    <p className="text-sm text-gray-400 mb-6">{activeFile.department || 'Unknown Dept'}</p>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/20 rounded-full mb-2 group-hover:h-2 transition-all cursor-pointer">
                        <div className="w-1/3 h-full bg-white rounded-full relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-6">
                        <span>5:16</span>
                        <span>5:41</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <button className="text-gray-400 hover:text-white"><Shuffle className="w-4 h-4" /></button>
                        <button className="text-white hover:text-purple-400"><SkipBack className="w-5 h-5 fill-current" /></button>
                        <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-1" />
                        </button>
                        <button className="text-white hover:text-purple-400"><SkipForward className="w-5 h-5 fill-current" /></button>
                        <button className="text-gray-400 hover:text-white"><Repeat className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FolderIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
    )
}
