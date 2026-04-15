'use client';

import { useState, useEffect } from 'react';
import {
    Folder, FileText, Image as ImageIcon, Video,
    MoreVertical, Cloud, CheckCircle2, UploadCloud,
    ArrowLeft, Search, Grid, List as ListIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '@/services/storageService';

export default function FilesPage() {
    const [currentPath, setCurrentPath] = useState([{ id: 'root', name: 'Inicio' }]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState({ folders: [], files: [] });
    const [integrations, setIntegrations] = useState([]);
    const [dragging, setDragging] = useState(false);

    // Initial Fetch
    useEffect(() => {
        loadData('root');
        loadIntegrations();
    }, []);

    const loadData = async (folderId) => {
        setLoading(true);
        try {
            const data = await storageService.listFiles(folderId);
            setContent(data);
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadIntegrations = async () => {
        const ints = await storageService.getIntegrations();
        setIntegrations(ints);
    };

    const handleNavigate = (folder) => {
        setCurrentPath([...currentPath, folder]);
        loadData(folder.id);
    };

    const handleBreadcrumbClick = (index) => {
        const newPath = currentPath.slice(0, index + 1);
        setCurrentPath(newPath);
        loadData(newPath[newPath.length - 1].id);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);

        // Mock Upload of first file
        if (files.length > 0) {
            setLoading(true);
            const newFile = await storageService.uploadFile(files[0], currentPath[currentPath.length - 1].id);
            setContent(prev => ({ ...prev, files: [...prev.files, newFile] }));
            setLoading(false);
        }
    };

    return (
        <div
            className="h-full flex flex-col p-6 relative"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
        >
            {/* Drag Overlay */}
            <AnimatePresence>
                {dragging && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-primary/20 backdrop-blur-sm border-4 border-dashed border-primary rounded-3xl flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center text-white">
                            <UploadCloud className="w-16 h-16 mx-auto mb-4 text-primary" />
                            <h3 className="text-2xl font-bold">Suelta tus archivos aquí</h3>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Sync Status */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Folder className="w-8 h-8 text-primary" />
                        Archivos & Sincronización
                    </h1>
                    <p className="text-gray-400 text-sm">Repositorio central sincronizado con tu nube.</p>
                </div>

                <div className="flex gap-4">
                    {integrations.map(int => (
                        <div key={int.id} className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${int.connected ? 'bg-white/5 border-green-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                            <Cloud className={`w-5 h-5 ${int.connected ? 'text-green-400' : 'text-gray-400'}`} />
                            <div>
                                <div className="text-xs font-bold text-white">{int.name}</div>
                                <div className="text-[10px] text-gray-400">{int.connected ? 'Sincronizado' : 'Desconectado'}</div>
                            </div>
                            {int.connected && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 bg-white/5 p-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 px-2">
                    {currentPath.map((folder, idx) => (
                        <div key={folder.id} className="flex items-center text-sm">
                            {idx > 0 && <span className="mx-2 text-gray-600">/</span>}
                            <button
                                onClick={() => handleBreadcrumbClick(idx)}
                                className={`hover:text-white transition-colors ${idx === currentPath.length - 1 ? 'text-white font-bold' : 'text-gray-400'}`}
                            >
                                {folder.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-400'}`}>
                        <Grid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-400'}`}>
                        <ListIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <>
                        {/* Folders */}
                        {content.folders.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Carpetas</h3>
                                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
                                    {content.folders.map(folder => (
                                        <div
                                            key={folder.id}
                                            onClick={() => handleNavigate(folder)}
                                            className="group cursor-pointer bg-[#0B0B15] border border-white/5 hover:border-primary/50 p-4 rounded-xl transition-all hover:bg-white/5 flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <Folder className="w-5 h-5 fill-current" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">{folder.name}</div>
                                                <div className="text-xs text-gray-500">{folder.updated}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Archivos</h3>
                            {content.files.length === 0 && content.folders.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <UploadCloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Carpeta vacía</p>
                                </div>
                            ) : (
                                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
                                    {content.files.map(file => (
                                        <div key={file.id} className="group bg-[#0B0B15] border border-white/5 hover:border-white/20 p-4 rounded-xl transition-all hover:bg-white/5 relative">
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3 text-gray-400 group-hover:scale-110 transition-transform">
                                                {file.type === 'pdf' && <FileText className="w-5 h-5 text-red-400" />}
                                                {file.type === 'image' && <ImageIcon className="w-5 h-5 text-blue-400" />}
                                                {file.type === 'video' && <Video className="w-5 h-5 text-purple-400" />}
                                                {!['pdf', 'image', 'video'].includes(file.type) && <FileText className="w-5 h-5" />}
                                            </div>

                                            <div className="text-sm font-medium text-white truncate mb-1">{file.name}</div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{file.size}</span>
                                                {file.status === 'synced' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                                {file.status === 'syncing' && <UploadCloud className="w-3 h-3 text-blue-500 animate-bounce" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
