'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, FolderPlus, Folder, Tag, X, CheckCircle2, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SavedResearchesModal({
    isOpen,
    onClose,
    onSave,
    currentSearchQuery = '',
    currentData = null,
    folders = [],
    onCreateFolder = () => {}
}) {
    const [title, setTitle] = useState(currentSearchQuery ? `Auditoría: ${currentSearchQuery}` : 'Investigación Estratégica');
    const [category, setCategory] = useState('Auditoría de Nicho');
    const [selectedFolderId, setSelectedFolderId] = useState(folders[0]?.id || 'general');
    const [newFolderName, setNewFolderName] = useState('');
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [customTag, setCustomTag] = useState('');
    const [tags, setTags] = useState(['Estrategia', 'Crecimiento', 'Competencia']);

    if (!isOpen) return null;

    const handleAddTag = () => {
        if (!customTag.trim()) return;
        if (!tags.includes(customTag.trim())) {
            setTags([...tags, customTag.trim()]);
        }
        setCustomTag('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleCreateNewFolder = () => {
        if (!newFolderName.trim()) return;
        const newFolder = {
            id: `folder_${Date.now()}`,
            name: newFolderName.trim(),
            color: 'indigo'
        };
        onCreateFolder(newFolder);
        setSelectedFolderId(newFolder.id);
        setNewFolderName('');
        setShowCreateFolder(false);
        toast.success(`Carpeta "${newFolder.name}" creada con éxito`);
    };

    const handleSaveSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Por favor ingresa un título para la investigación');
            return;
        }

        const newResearch = {
            id: `res_${Date.now()}`,
            title: title.trim(),
            category,
            query: currentSearchQuery,
            folderId: selectedFolderId,
            tags,
            createdAt: new Date().toISOString(),
            data: currentData || {},
            summary: typeof currentData === 'string' ? currentData.substring(0, 300) : (currentData?.executiveSummary || currentData?.summary || 'Investigación estratégica guardada.')
        };

        onSave(newResearch);
        toast.success('¡Investigación guardada correctamente!');
        onClose();
    };

    const categories = [
        'Auditoría de Nicho',
        'Análisis de Competencia',
        'Puntos de Fricción & Objeciones',
        'Ganchos & Contenidos Virales',
        'Tendencias & Mercado',
        'Estrategia de Pauta Meta'
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-xl bg-[#0e1026]/95 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl text-white overflow-hidden"
                >
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Bookmark className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    Guardar Búsqueda Estratégica
                                </h3>
                                <p className="text-xs text-indigo-300/80">
                                    Organiza tus hallazgos en carpetas y añade etiquetas temáticas
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSaveSubmit} className="mt-6 space-y-5 relative z-10">
                        {/* Title input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                                Título de la Investigación
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej. Auditoría Traumatología y Dolores de Rodilla"
                                className="w-full bg-[#080918]/80 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Category selection */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                                Tipo / Categoría Estratégica
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                                            category === cat
                                                ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold shadow-sm shadow-indigo-500/20'
                                                : 'bg-[#080918]/60 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Folder selection */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                    Carpeta Temática
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateFolder(!showCreateFolder)}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                                >
                                    <FolderPlus className="w-3.5 h-3.5" />
                                    {showCreateFolder ? 'Cancelar' : 'Nueva Carpeta'}
                                </button>
                            </div>

                            {showCreateFolder ? (
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder="Nombre de la nueva carpeta..."
                                        className="flex-1 bg-[#080918]/90 border border-indigo-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateNewFolder}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                                    >
                                        Crear
                                    </button>
                                </div>
                            ) : null}

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedFolderId('general')}
                                    className={`px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 border transition-all ${
                                        selectedFolderId === 'general'
                                            ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                                            : 'bg-[#080918]/60 border-white/5 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                    <Folder className="w-4 h-4 text-indigo-400" />
                                    <span className="truncate">General</span>
                                </button>
                                {folders.map((f) => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setSelectedFolderId(f.id)}
                                        className={`px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 border transition-all ${
                                            selectedFolderId === f.id
                                                ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                                                : 'bg-[#080918]/60 border-white/5 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        <Folder className="w-4 h-4 text-fuchsia-400" />
                                        <span className="truncate">{f.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                                Etiquetas
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-indigo-200 font-medium"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customTag}
                                    onChange={(e) => setCustomTag(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    placeholder="Añadir etiqueta (Presiona Enter)..."
                                    className="flex-1 bg-[#080918]/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-medium transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Guardar Investigación
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
