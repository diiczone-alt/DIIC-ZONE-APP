'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Search, Folder, File, Video, Image, 
    MoreVertical, Download, ExternalLink, Filter,
    Check, Cloud, Layout, Clock, Grid, List
} from 'lucide-react';

const MOCK_FILES = [
    { id: 'f1', name: 'Intro_Marzo_Final.mp4', type: 'video', size: '45MB', date: 'Hace 2 días', folder: 'Marketing' },
    { id: 'f2', name: 'Thumbnail_Estrategia.png', type: 'image', size: '2.4MB', date: 'Ayer', folder: 'Design' },
    { id: 'f3', name: 'Script_Lanzamiento_V2.pdf', type: 'pdf', size: '1.1MB', date: 'Hace 4 horas', folder: 'Copy' },
    { id: 'f4', name: 'Moodboard_Inspiracion.jpg', type: 'image', size: '5.8MB', date: 'Hace 3 días', folder: 'Design' },
    { id: 'f5', name: 'Video_Testimonio_Cliente.mov', type: 'video', size: '128MB', date: 'Hace 1 hora', folder: 'Testimonials' },
    { id: 'f6', name: 'B-Roll_Oficina.mp4', type: 'video', size: '84MB', date: 'Semana pasada', folder: 'Assets' },
];

export default function MemoryAssetPicker({ onSelect, onClose }) {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedId, setSelectedId] = useState(null);

    const filteredFiles = MOCK_FILES.filter(f => 
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-4xl h-[80vh] bg-[#0A0A0F] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                            <Cloud className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Diiczone <span className="text-cyan-400">Memory Cloud</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Explora y vincula tus activos de producción</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                        <input 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="BUSCAR ARCHIVOS O CARPETAS..."
                            className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-gray-800 uppercase tracking-widest"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 p-1 bg-black/40 border border-white/5 rounded-xl">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                        <Filter className="w-3.5 h-3.5" /> Filtrar
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-4 gap-6">
                            {filteredFiles.map((file) => (
                                <button 
                                    key={file.id}
                                    onClick={() => setSelectedId(file.id)}
                                    className={`group relative aspect-square bg-white/[0.02] border rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] ${selectedId === file.id ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-black/60 flex items-center justify-center border transition-all ${selectedId === file.id ? 'border-cyan-500/50 text-cyan-400' : 'border-white/10 text-gray-500 group-hover:text-white'}`}>
                                        {file.type === 'video' ? <Video className="w-8 h-8" /> : file.type === 'image' ? <Image className="w-8 h-8" /> : <File className="w-8 h-8" />}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-[11px] font-black text-white uppercase tracking-tight truncate w-32">{file.name}</h3>
                                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">{file.size} • {file.date}</p>
                                    </div>
                                    {selectedId === file.id && (
                                        <div className="absolute top-4 right-4 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                            <Check className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredFiles.map((file) => (
                                <button 
                                    key={file.id}
                                    onClick={() => setSelectedId(file.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedId === file.id ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl bg-black/60 border ${selectedId === file.id ? 'border-cyan-500/50 text-cyan-400' : 'border-white/10 text-gray-600'}`}>
                                            {file.type === 'video' ? <Video className="w-4 h-4" /> : file.type === 'image' ? <Image className="w-4 h-4" /> : <File className="w-4 h-4" />}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-[11px] font-black text-white uppercase tracking-tight">{file.name}</h3>
                                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">{file.folder} • {file.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-[9px] font-black text-gray-700 uppercase">{file.size}</span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedId === file.id ? 'bg-cyan-500 border-cyan-500 shadow-lg' : 'border-white/5'}`}>
                                            {selectedId === file.id && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] bg-gray-800 flex items-center justify-center text-[8px] font-black text-white">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">3 Equipos con acceso a estos recursos</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose}
                            className="px-8 py-4 text-[11px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button 
                            disabled={!selectedId}
                            onClick={() => onSelect(MOCK_FILES.find(f => f.id === selectedId))}
                            className={`group relative px-10 py-4 rounded-2xl overflow-hidden transition-all shadow-2xl ${selectedId ? 'bg-cyan-600 hover:bg-cyan-500 active:scale-95 cursor-pointer' : 'bg-white/5 text-gray-700 cursor-not-allowed'}`}
                        >
                            <span className={`relative z-10 text-[11px] font-black uppercase tracking-[0.2em] ${selectedId ? 'text-white' : 'text-gray-700'}`}>Vincular al Nodo</span>
                            {selectedId && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
