'use client';

import { useState } from 'react';
import { Folder, FileVideo, FileImage, Download, MoreVertical, Search, Filter } from 'lucide-react';

export default function CreativeFilesPage() {
    const [files] = useState([
        { id: 1, name: 'Proyecto_Alpha_Cut_v1.mp4', type: 'video', size: '1.2 GB', date: 'Hace 2 horas' },
        { id: 2, name: 'Assets_Graficos_Pack.zip', type: 'archive', size: '450 MB', date: 'Ayer' },
        { id: 3, name: 'Guion_Tecnico_Final.pdf', type: 'doc', size: '2.4 MB', date: '20 Oct' },
        { id: 4, name: 'B-Roll_Drone_Shots.mp4', type: 'video', size: '3.1 GB', date: '18 Oct' },
        { id: 5, name: 'Referencia_Estilo.jpg', type: 'image', size: '5.2 MB', date: '15 Oct' },
    ]);

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mis Archivos</h1>
                    <p className="text-gray-400">Recursos y entregables de tus proyectos asignados.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium flex items-center gap-2">
                    <Folder className="w-4 h-4" /> Nuevo Folder
                </button>
            </header>

            {/* Toolbar */}
            <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar archivos..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <button className="p-2 text-gray-400 hover:text-white bg-black/20 border border-white/10 rounded-lg">
                    <Filter className="w-4 h-4" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {files.map(file => (
                    <div key={file.id} className="group p-4 bg-[#0A0A12] border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${file.type === 'video' ? 'bg-purple-500/10 text-purple-400' :
                                    file.type === 'image' ? 'bg-pink-500/10 text-pink-400' :
                                        file.type === 'archive' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-blue-500/10 text-blue-400'
                                }`}>
                                {file.type === 'video' ? <FileVideo className="w-6 h-6" /> :
                                    file.type === 'image' ? <FileImage className="w-6 h-6" /> :
                                        <Folder className="w-6 h-6" />}
                            </div>
                            <button className="text-gray-600 group-hover:text-white transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-white font-medium truncate mb-1">{file.name}</h3>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{file.size}</span>
                            <span>{file.date}</span>
                        </div>

                        {/* Hover Action */}
                        <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                            <button className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                                <Download className="w-3 h-3" /> DESCARGAR
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
