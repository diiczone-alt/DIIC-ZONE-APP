'use client';

import { Play, MoreHorizontal, ChevronDown, Search, Bell, Activity, HardDrive, Download, Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StorageWidget from '@/components/gallery/StorageWidget';

export default function GalleryDashboard({ files, category, onSelectFile }) {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden pt-8 px-12 pb-32">

            {/* PREMIUM TOP BAR */}
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-10 flex-1">
                    {/* Left: Search - Expanded and stylized */}
                    <div className="relative max-w-xl flex-1 group">
                        <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar en tu ecosistema creativo..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-blue-500/20 focus:bg-white/[0.05] transition-all backdrop-blur-md placeholder:text-gray-600"
                        />
                    </div>

                    {/* Navigation Tabs (Moved from middle to top-bar area for space optimization) */}
                    <nav className="hidden xl:flex items-center gap-8 px-6 py-2 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-sm">
                        {['Recientes', 'Favoritos', 'Compartidos'].map((tab) => (
                            <button
                                key={tab}
                                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-400 ${
                                    tab === 'Recientes' ? 'text-blue-400' : 'text-gray-500'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right: Tools & Storage */}
                <div className="flex items-center gap-6 ml-10">
                    <div className="hidden lg:block bg-white/[0.02] border border-white/5 p-1 rounded-2xl backdrop-blur-sm">
                        <StorageWidget />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5 relative group">
                            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#1A1A20] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        </button>
                        
                        <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5 group">
                            <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </header>

            {/* SECTION HEADER & SORTING */}
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                        {category?.label || 'Recientes'}
                    </h2>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                        Mostrando {files.length} activos en este nodo
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl backdrop-blur-sm">
                         <button className="px-4 py-2 text-[10px] font-black text-white bg-blue-500/20 border border-blue-500/20 rounded-lg uppercase tracking-widest leading-none">
                            Grid
                         </button>
                         <button className="px-4 py-2 text-[10px] font-black text-gray-600 hover:text-gray-300 rounded-lg uppercase tracking-widest leading-none transition-colors">
                            Lista
                         </button>
                    </div>
                    <button className="flex items-center gap-3 text-[10px] font-black text-white bg-white/[0.03] border border-white/5 px-5 py-3 rounded-xl hover:bg-white/[0.05] transition-all uppercase tracking-widest shadow-xl">
                        Fecha Añadida <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                </div>
            </div>

            {/* CARDS GRID */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {files.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                                duration: 0.5,
                                delay: index * 0.04,
                                ease: [0.23, 1, 0.32, 1]
                            }}
                            className="group cursor-pointer perspective-1000"
                            onClick={() => onSelectFile(file)}
                        >
                            {/* Card Media Container */}
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-5 shadow-2xl bg-[#121218] border border-white/5 group-hover:border-blue-500/30 transition-all duration-700 active:scale-95 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <img 
                                    src={file.image} 
                                    alt={file.name} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                                />

                                {/* Ambient Glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Cinematic Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

                                {/* Play/Action Icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-white hover:text-black shadow-2xl">
                                        <Play className="w-7 h-7 fill-current ml-1" />
                                    </div>
                                </div>

                                {/* Floating Header Info */}
                                <div className="absolute top-5 left-5 right-5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                        {file.department}
                                    </div>
                                    <button className="p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white hover:text-black transition-all">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Bottom Quick Info */}
                                <div className="absolute bottom-6 left-6 right-6">
                                     <div className="flex gap-2 mb-3">
                                        <div className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/5 rounded text-[7px] font-black uppercase tracking-widest text-white/70">
                                            {file.type}
                                        </div>
                                     </div>
                                     <h3 className="text-lg font-black text-white italic leading-tight group-hover:text-blue-400 transition-colors truncate tracking-tighter">
                                        {file.name}
                                     </h3>
                                </div>
                            </div>

                            {/* External Card Details (Simplified for Focus) */}
                             <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                        <Activity className="w-3 h-3 text-blue-500/50" />
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">DIIC / HQ</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                                    <Heart className="w-3.5 h-3.5 text-gray-600 hover:text-rose-500 transition-colors" />
                                    <Share2 className="w-3.5 h-3.5 text-gray-600 hover:text-blue-400 transition-colors" />
                                </div>
                             </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
