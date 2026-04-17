'use client';

import { useState } from 'react';
import { 
    Folder, FileVideo, FileImage, Download, 
    MoreVertical, Search, Filter, Plus, 
    FileText, Trash2, Edit2, Share2, 
    X, Check, ChevronLeft, Eye, ExternalLink
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
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const currentFolder = files.find(f => f.id === currentFolderId);

    const filteredFiles = files.filter(file => {
        const matchesFolder = file.parentId === currentFolderId;
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || file.type === filterType;
        return matchesFolder && matchesSearch && matchesFilter;
    });

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        const newFolder = {
            id: Date.now(),
            name: newFolderName.toUpperCase(),
            type: 'folder',
            size: '--',
            date: 'Recién creado',
            status: 'ready',
            parentId: currentFolderId
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

    const handleItemClick = (file) => {
        if (file.type === 'folder') {
            setCurrentFolderId(file.id);
        } else {
            setPreviewFile(file);
        }
    };

    return (
        <div className="flex-1 flex flex-col px-12 py-10 overflow-y-auto bg-[#050511] custom-scrollbar">
            <header className="flex items-center justify-between mb-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-2 group cursor-pointer" onClick={() => {
                        if (currentFolderId) setCurrentFolderId(null);
                        else router.push('/workstation/editor');
                    }}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                            {currentFolderId ? `Volver a ${currentFolder?.name ? 'Mis Archivos' : 'Bandeja'}` : 'Volver a Bandeja'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
                            {currentFolderId ? currentFolder?.name : 'Mis Archivos'}
                        </h1>
                        {currentFolderId && (
                            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2">
                                Directorio Activo
                            </div>
                        )}
                    </div>
                    <p className="text-gray-500 font-medium">
                        {currentFolderId ? `Explorando contenidos de ${currentFolder?.name}` : 'Gestiona los activos y entregables de tus proyectos.'}
                    </p>
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
                        placeholder="Buscar en esta carpeta..."
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
                            onClick={() => handleItemClick(file)}
                            key={file.id} 
                            className="group p-6 bg-[#0E0E18] border border-white/5 hover:border-indigo-500/30 rounded-3xl transition-all cursor-pointer relative shadow-xl hover:shadow-indigo-500/5"
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
                                        if (file.type === 'folder') setCurrentFolderId(file.id);
                                        else setPreviewFile(file);
                                    }}
                                    className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-white transition-all tracking-[0.2em]"
                                >
                                    {file.type === 'folder' ? <ExternalLink className="w-3 h-3" /> : <Eye className="w-3 h-3" />} 
                                    {file.type === 'folder' ? 'ABRIR' : 'PREVISUALIZAR'}
                                </button>
                                <Download className="w-4 h-4 text-gray-700 hover:text-white transition-colors" onClick={(e) => {
                                    e.stopPropagation();
                                    showToast(`Descargando ${file.name}...`);
                                }} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredFiles.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20">
                    <Folder className="w-20 h-20 mb-4" />
                    <p className="text-xl font-bold uppercase tracking-widest">Esta carpeta está vacía</p>
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

            {/* File Preview Modal */}
            <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} onToast={showToast} />

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

function FilePreviewModal({ file, onClose, onToast }) {
    if (!file) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="bg-[#0E0E18] border border-white/10 rounded-[40px] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]"
                >
                    {/* Media Preview Area */}
                    <div className="flex-1 bg-black relative flex items-center justify-center group">
                        <div className="absolute top-6 left-6 z-10">
                            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Vista Previa HQ</span>
                            </div>
                        </div>

                        {file.type === 'video' ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all shadow-2xl">
                                    <FileVideo className="w-8 h-8 text-white" />
                                </div>
                                <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-40" alt="Video Placeholder" />
                            </div>
                        ) : file.type === 'image' ? (
                            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-contain" alt="Preview" />
                        ) : (
                            <div className="flex flex-col items-center gap-6 opacity-30">
                                {file.type === 'archive' ? <Folder className="w-32 h-32 text-indigo-500" /> : <FileText className="w-32 h-32 text-indigo-500" />}
                                <p className="font-black uppercase tracking-[0.4em] text-white">Archivo de sistema</p>
                            </div>
                        )}
                    </div>

                    {/* Info Sidebar */}
                    <div className="w-full md:w-80 border-l border-white/10 p-8 flex flex-col justify-between bg-[#0E0E18]">
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight break-all">{file.name}</h2>
                                <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Metadatos</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-[9px] text-gray-600 uppercase font-black mb-1">Tamaño</p>
                                            <p className="text-xs text-white font-bold">{file.size}</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-[9px] text-gray-600 uppercase font-black mb-1">Fecha</p>
                                            <p className="text-xs text-white font-bold">{file.date}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-2">Comentarios de Producción</p>
                                    <p className="text-[11px] text-gray-400 leading-relaxed italic">Asset validado por auditoría. Listo para ser utilizado en el corte final Q4.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-8">
                            <button 
                                onClick={() => { onToast(`Descargando ${file.name}...`); onClose(); }}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Download className="w-5 h-5" /> Descargar Ahora
                            </button>
                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-3">
                                <Share2 className="w-4 h-4" /> Generar Link
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
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

