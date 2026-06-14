'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, Search, Filter, Play, Pause, Download, Plus,
    Music, Disc, FileText, UploadCloud, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const SAMPLE_LIBRARY = [
    { id: 1, name: 'Lo-Fi Chill Snare & Kick Kit', category: 'Loops', type: 'Drum Kit', duration: '00:45', size: '8.4 MB' },
    { id: 2, name: 'Cyberpunk Bass Drop Sweep', category: 'SFX', type: 'Synthesizer', duration: '00:08', size: '1.2 MB' },
    { id: 3, name: 'Soulful Vocal Adlibs (Female)', category: 'Vocals', type: 'Acapella', duration: '01:20', size: '15.6 MB' },
    { id: 4, name: 'Acoustic Guitar Strum Loop E-Min', category: 'Loops', type: 'Guitar', duration: '00:30', size: '5.2 MB' },
    { id: 5, name: 'Cinematic Risers & Whooshes Pack', category: 'SFX', type: 'Transition', duration: '00:12', size: '2.4 MB' },
];

export default function AudioLibraryPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [playingSampleId, setPlayingSampleId] = useState(null);

    const categories = ['All', 'Loops', 'SFX', 'Vocals'];

    const filteredSamples = SAMPLE_LIBRARY.filter(sample => {
        const matchesSearch = sample.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              sample.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || sample.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handlePlayToggle = (id) => {
        if (playingSampleId === id) {
            setPlayingSampleId(null);
            toast.info('Vista previa en pausa');
        } else {
            setPlayingSampleId(id);
            const sample = SAMPLE_LIBRARY.find(s => s.id === id);
            toast.success(`Escuchando: ${sample?.name}`);
        }
    };

    const handleDownload = (name) => {
        toast.success(`Descargando muestra: ${name}`);
    };

    const handleAddToProject = (name) => {
        toast.success(`Añadido al proyecto activo: ${name}`);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        toast.success('Muestra subida correctamente a tu biblioteca privada');
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Music className="w-5 h-5 text-amber-500" /> Biblioteca de Sonidos
                        </h1>
                        <p className="text-xs text-gray-400 font-medium">Librería de efectos, loops y herramientas de audio de uso libre</p>
                    </div>
                </div>
            </header>

            {/* Content Split */}
            <div className="flex-1 flex overflow-hidden">
                {/* Search & List */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                placeholder="Buscar muestras, loops..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0e0e1a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/80 transition-colors"
                            />
                        </div>

                        {/* Category Selector */}
                        <div className="flex bg-[#0e0e1a] p-1 rounded-xl border border-white/5 w-fit">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredSamples.map(sample => (
                            <div 
                                key={sample.id} 
                                className={`bg-[#0e0e1a] border rounded-xl p-4 flex items-center justify-between hover:border-amber-500/30 transition-all ${playingSampleId === sample.id ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => handlePlayToggle(sample.id)}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${playingSampleId === sample.id ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                                    >
                                        {playingSampleId === sample.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                                    </button>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{sample.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{sample.type} • {sample.duration} • {sample.size}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleAddToProject(sample.name)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black text-xs font-bold transition-all border border-amber-500/20"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Añadir
                                    </button>
                                    <button 
                                        onClick={() => handleDownload(sample.name)}
                                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredSamples.length === 0 && (
                            <div className="p-8 text-center bg-[#0e0e1a]/50 rounded-xl border border-white/5 text-gray-500 text-sm">
                                Ningún recurso coincide con tu búsqueda.
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload & Info Sidebar */}
                <div className="w-80 border-l border-white/5 bg-[#0e0e1a] p-6 hidden lg:flex flex-col gap-6">
                    <div>
                        <h3 className="text-white font-bold text-sm mb-2">Importar Recursos</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Sube tus propias grabaciones, librerías o efectos de sonido directamente para usarlos en la consola.</p>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="flex-1 border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/[0.02] rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all gap-3"
                    >
                        <UploadCloud className="w-8 h-8 text-gray-500" />
                        <div>
                            <p className="text-xs text-white font-bold">Arrastra tus archivos</p>
                            <p className="text-[10px] text-gray-500 mt-1">Soporta WAV, MP3, FLAC (Max. 100MB)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
