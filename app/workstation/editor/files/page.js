'use client';

import { useState } from 'react';
import { 
    Folder, FileVideo, FileImage, Download, 
    MoreVertical, Search, Filter, Plus, 
    FileText, Trash2, Edit2, Share2, 
    X, Check, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { EDITOR_FILES } from '@/data/workstationData';

export default function EditorFilesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [files, setFiles] = useState(EDITOR_FILES);
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || file.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        const newFolder = {
            id: Date.now(),
            name: newFolderName,
            type: 'folder',
            size: '--',
            date: 'Recién creado',
            status: 'ready'
        };
        setFiles([newFolder, ...files]);
        setNewFolderName('');
        setIsNewFolderModalOpen(false);
        showToast(`Carpeta "${newFolderName}" creada con éxito`);
    };

    const handleDelete = (id, name) => {
        setFiles(files.filter(f => f.id !== id));
        showToast(`"${name}" eliminado`);
    };

    return (
        <div className="flex-1 flex flex-col px-12 py-10 overflow-y-auto bg-[#050511]">
            <header className="flex items-center justify-between mb-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-2 group cursor-pointer" onClick={() => router.push('/workstation/editor')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">Volver a Bandeja</span>
                    </div>
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Mis Archivos</h1>
                    <p className="text-gray-500 font-medium">Gestiona los activos y entregables de tus proyectos.</p>
                </div>
                <button 
                    onClick={() => setIsNewFolderModalOpen(true)}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-600/30 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Nuevo Folder
                </button>
            </header>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 mb-8 bg-white/5 border border-white/5 p-4 rounded-3xl backdrop-blur-md">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre de archivo..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'video', 'image', 'doc', 'archive'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                filterType === type 
                                ? 'bg-white text-black border-white' 
                                : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                            }`}
                        >
                            {type === 'all' ? 'Todos' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredFiles.map(file => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={file.id} 
                            className="group p-6 bg-[#0E0E18] border border-white/5 hover:border-indigo-500/30 rounded-3xl transition-all cursor-pointer relative"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-4 rounded-2xl ${
                                    file.type === 'video' ? 'bg-purple-500/10 text-purple-400' :
                                    file.type === 'image' ? 'bg-pink-500/10 text-pink-400' :
                                    file.type === 'archive' ? 'bg-yellow-500/10 text-yellow-400' :
                                    file.type === 'folder' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-indigo-500/10 text-indigo-400'
                                }`}>
                                    {file.type === 'video' ? <FileVideo className="w-8 h-8" /> :
                                     file.type === 'image' ? <FileImage className="w-8 h-8" /> :
                                     file.type === 'folder' ? <Folder className="w-8 h-8" /> :
                                     <FileText className="w-8 h-8" />}
                                </div>
                                
                                <FileActionMenu file={file} onDelete={() => handleDelete(file.id, file.name)} onToast={showToast} />
                            </div>
                            <h3 className="text-white font-bold truncate mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight text-sm">{file.name}</h3>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                                <span>{file.size}</span>
                                <span>{file.date}</span>
                            </div>

                            {/* Hover Actions */}
                            <div className="mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-between">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showToast(`Descargando ${file.name}...`);
                                    }}
                                    className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-white transition-all tracking-[0.2em]"
                                >
                                    <Download className="w-3 h-3" /> DESCARGAR
                                </button>
                                <Share2 className="w-4 h-4 text-gray-700 hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredFiles.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20">
                    <Search className="w-20 h-20 mb-4" />
                    <p className="text-xl font-bold uppercase tracking-widest">No se encontraron archivos</p>
                </div>
            )}

            {/* New Folder Modal */}
            <AnimatePresence>
                {isNewFolderModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0E0E18] border border-white/10 p-8 rounded-[40px] w-full max-w-md shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setIsNewFolderModalOpen(false)}
                                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-black text-white italic uppercase mb-6">Nueva Carpeta</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nombre de la carpeta</label>
                                    <input 
                                        autoFocus
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                        type="text" 
                                        placeholder="Ej: Brackets de Proyecto_X" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                                    />
                                </div>
                                <button 
                                    onClick={handleCreateFolder}
                                    className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    Crear Carpeta <Check className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Feedback */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-[200] px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FileActionMenu({ file, onDelete, onToast }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
                <MoreVertical className="w-5 h-5" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 10 }}
                            className="absolute right-0 top-12 w-48 bg-[#1A1A24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-2"
                        >
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); onToast('Abriendo detalles...'); }} className="w-full flex items-center gap-3 p-3 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest">
                                <Edit2 className="w-4 h-4" /> Renombrar
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); onToast('Moviendo archivo...'); }} className="w-full flex items-center gap-3 p-3 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest">
                                <Folder className="w-4 h-4" /> Mover
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 p-3 text-[10px] font-bold text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest"
                            >
                                <Trash2 className="w-4 h-4" /> Eliminar
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
