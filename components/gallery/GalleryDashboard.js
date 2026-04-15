'use client';

import { Play, MoreHorizontal, ChevronDown, Search, Bell, Settings, Cloud, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import StorageWidget from '@/components/gallery/StorageWidget'; // Imported StorageWidget

export default function GalleryDashboard({ files, category, onSelectFile }) {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden pt-6 px-10">

            {/* PREMIUM TOP BAR */}
            <header className="flex justify-between items-center mb-10">
                {/* Left: Search */}
                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar archivos, álbumes, proyectos..."
                        className="w-full bg-[#1A1A20] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/30 focus:bg-[#25252E] transition-all shadow-inner"
                    />
                </div>

                {/* Right: Storage & User */}
                <div className="flex items-center gap-6">
                    {/* INTEGRATED STORAGE WIDGET (Google Drive, Local, etc.) */}
                    <div className="hidden md:block">
                        <StorageWidget />
                    </div>

                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1A1A20]"></span>
                    </button>

                    <div className="h-8 w-px bg-white/5" />

                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right hidden md:block">
                            <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Crystal Hopper</h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Admin</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px] shadow-lg shadow-purple-900/20">
                            <img src="https://github.com/shadcn.png" alt="User" className="w-full h-full rounded-[10px] border border-[#121212] object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            {/* FILTERS & SORTING (Clean & Minimal) */}
            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
                <div className="flex gap-8">
                    <button className="text-sm font-bold text-white border-b-2 border-blue-500 pb-4 -mb-[17px] z-10 transition-colors">
                        Recientes
                    </button>
                    <button className="text-sm font-bold text-gray-500 hover:text-white transition-colors pb-4">
                        Favoritos
                    </button>
                    <button className="text-sm font-bold text-gray-500 hover:text-white transition-colors pb-4">
                        Compartidos
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Ordenar por:</span>
                    <button className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                        Fecha Añadida <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* CARDS GRID */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {files.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group cursor-pointer"
                            onClick={() => onSelectFile(file)}
                        >
                            {/* Card Image */}
                            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-2xl bg-[#1A1A1A] group-hover:shadow-blue-900/20 transition-all duration-500">
                                <img src={file.image} alt={file.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                {/* Hover Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 hover:bg-white hover:text-black text-white hover:scale-110 shadow-lg">
                                        <Play className="w-6 h-6 fill-current ml-1" />
                                    </div>
                                </div>

                                {/* Top Right Options */}
                                <button className="absolute top-2 right-2 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40 rounded-lg backdrop-blur-sm">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                {/* Department Tag */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-wider rounded flex items-center gap-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${index % 2 === 0 ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                                        {file.department}
                                    </span>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="px-1">
                                <h3 className="text-white font-bold text-base leading-tight mb-1 group-hover:text-blue-400 transition-colors truncate">{file.name}</h3>
                                <div className="flex justify-between items-center bg-[#1A1A20] rounded-lg p-2 mt-2 group-hover:bg-[#25252E] transition-colors">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pro-M Studio</div>
                                    <div className="text-[10px] text-gray-600 font-mono">24MB</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add Dummy Cards to fill grid if few items */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`dummy-${i}`} className="opacity-0 pointer-events-none"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
