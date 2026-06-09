'use client';

import { useState } from 'react';
import {
    FolderOpen, FileText, Download, Eye, Plus, Search,
    Filter, Layout, FileImage, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function DesignerFilesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    const files = [
        { id: 1, name: 'Propuesta_Branding_v2.ai', type: 'vector', size: '14.8 MB', date: 'Ayer, 18:24', thumb: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&auto=format&fit=crop&q=60' },
        { id: 2, name: 'Banner_CyberMonday_Hero.psd', type: 'photoshop', size: '42.1 MB', date: 'Hace 2 días', thumb: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60' },
        { id: 3, name: 'Carrusel_Dental_Post1.png', type: 'image', size: '2.1 MB', date: '14 de Jun', thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60' },
        { id: 4, name: 'Flyer_Evento_A4_Print.pdf', type: 'pdf', size: '8.4 MB', date: '08 de Jun', thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60' },
        { id: 5, name: 'Recursos_Kit_Marca.zip', type: 'zip', size: '124 MB', date: '01 de Jun', thumb: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=60' }
    ];

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || file.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleDownload = (name) => {
        toast.success(`Descargando archivo: ${name}`);
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050511] p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <FolderOpen className="w-6 h-6 text-pink-500" /> Repositorio de Archivos
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Gestiona y descarga tus recursos gráficos y editables.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar archivo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#0E0E18] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-pink-500 w-64 transition-colors"
                        />
                    </div>

                    <button 
                        onClick={() => toast.info('Abre explorador de archivos para subir...')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-pink-600/20"
                    >
                        <Plus className="w-3.5 h-3.5" /> Subir Editable
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                    { id: 'all', label: 'Todos los archivos' },
                    { id: 'vector', label: 'Vectores (.AI / .SVG)' },
                    { id: 'photoshop', label: 'Photoshop (.PSD)' },
                    { id: 'image', label: 'Imágenes (.PNG / .JPG)' },
                    { id: 'pdf', label: 'Documentos PDF' },
                    { id: 'zip', label: 'Comprimidos (.ZIP)' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterType(tab.id)}
                        className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                            filterType === tab.id 
                            ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-900/40' 
                            : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {filteredFiles.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center bg-[#0E0E18] rounded-[2.5rem] border border-dashed border-white/10 space-y-6">
                    <FolderOpen className="w-12 h-12 text-gray-700" />
                    <h3 className="text-lg font-black text-white italic uppercase">Bandeja de archivos vacía</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto tracking-wide uppercase text-xs text-center">
                        No se encontraron archivos cargados en esta categoría.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {filteredFiles.map(file => (
                        <div
                            key={file.id}
                            className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-pink-500/50 hover:bg-pink-500/[0.01] transition-all group flex flex-col h-72 shadow-lg"
                        >
                            <div className="flex-1 bg-black/40 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                                <img src={file.thumb} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" alt={file.name} />
                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#050511]/80 backdrop-blur-md border border-white/10 text-[8px] font-black text-pink-400 uppercase tracking-widest">
                                    {file.type}
                                </div>
                            </div>
                            <div className="p-4 space-y-3 shrink-0">
                                <h3 className="text-xs font-black text-white truncate uppercase tracking-tight">{file.name}</h3>
                                <div className="flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                                    <span>{file.size}</span>
                                    <span>{file.date}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <button
                                        onClick={() => handleDownload(file.name)}
                                        className="py-2 bg-pink-600/10 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/10 hover:border-pink-500 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                                    >
                                        <Download className="w-3 h-3" /> Descargar
                                    </button>
                                    <button
                                        onClick={() => toast.info('Generando vista previa del editable...')}
                                        className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[8px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                    >
                                        <Eye className="w-3 h-3" /> Previsualizar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
