'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Folder, FolderPlus, Search, Filter, Calendar, Tag, Trash2, 
    ExternalLink, Printer, Sparkles, Database, CheckCircle2, 
    Layers, ArrowUpRight, ChevronRight, Eye, MoreVertical, 
    FileText, X, AlertCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { generateResearchPdf } from './ResearchPdfExporter';

export default function SavedResearchesManager({
    researches = [],
    folders = [],
    onDeleteResearch = () => {},
    onCreateFolder = () => {},
    onDeleteFolder = () => {},
    onLoadIntoProfile = () => {},
    onConsolidateWithAI = () => {},
    clientName = 'Marca DIIC'
}) {
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [previewResearch, setPreviewResearch] = useState(null);
    const [selectedResearches, setSelectedResearches] = useState([]);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isConsolidating, setIsConsolidating] = useState(false);

    // Extract unique categories & months for filters
    const categories = useMemo(() => {
        const cats = new Set(researches.map(r => r.category || r.type || 'Auditoría de Nicho'));
        return ['all', ...Array.from(cats)];
    }, [researches]);

    const months = useMemo(() => {
        const monthSet = new Set();
        researches.forEach(r => {
            if (r.createdAt) {
                const d = new Date(r.createdAt);
                if (!isNaN(d.getTime())) {
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    monthSet.add(key);
                }
            }
        });
        return ['all', ...Array.from(monthSet).sort().reverse()];
    }, [researches]);

    // Filter researches
    const filteredResearches = useMemo(() => {
        return researches.filter(r => {
            // Folder match
            if (selectedFolderId !== 'all') {
                const rFolder = r.folderId || r.folder_id || 'general';
                if (rFolder !== selectedFolderId) return false;
            }

            // Category match
            if (selectedCategory !== 'all') {
                const rCat = r.category || r.type || 'Auditoría de Nicho';
                if (rCat !== selectedCategory) return false;
            }

            // Month match
            if (selectedMonth !== 'all' && r.createdAt) {
                const d = new Date(r.createdAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (key !== selectedMonth) return false;
            }

            // Search query match
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const titleMatch = (r.title || '').toLowerCase().includes(q);
                const queryMatch = (r.query || '').toLowerCase().includes(q);
                const tagMatch = (r.tags || []).some(t => t.toLowerCase().includes(q));
                const summaryMatch = (r.summary || '').toLowerCase().includes(q);
                if (!titleMatch && !queryMatch && !tagMatch && !summaryMatch) return false;
            }

            return true;
        });
    }, [researches, selectedFolderId, selectedCategory, selectedMonth, searchQuery]);

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        const newFolder = {
            id: `folder_${Date.now()}`,
            name: newFolderName.trim(),
            color: 'indigo'
        };
        onCreateFolder(newFolder);
        setNewFolderName('');
        setShowNewFolderModal(false);
        toast.success(`Carpeta "${newFolder.name}" creada.`);
    };

    const toggleSelectResearch = (id) => {
        if (selectedResearches.includes(id)) {
            setSelectedResearches(selectedResearches.filter(rId => rId !== id));
        } else {
            setSelectedResearches([...selectedResearches, id]);
        }
    };

    const handleBatchConsolidate = async () => {
        const items = researches.filter(r => selectedResearches.includes(r.id));
        if (items.length === 0) {
            toast.error('Selecciona al menos una investigación para consolidar.');
            return;
        }

        setIsConsolidating(true);
        try {
            await onConsolidateWithAI(items);
            toast.success(`Consolidados ${items.length} documentos con Inteligencia Estratégica.`);
            setSelectedResearches([]);
        } catch (err) {
            toast.error('Error al consolidar investigaciones: ' + err.message);
        } finally {
            setIsConsolidating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-[#0e1026]/90 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl shadow-indigo-950/20">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                    {/* Search bar */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar en investigaciones por título, dolor, gancho o etiqueta..."
                            className="w-full bg-[#080918]/80 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Month Filter */}
                        <div className="flex items-center gap-1.5 bg-[#080918]/80 border border-white/10 rounded-2xl px-3 py-2 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-transparent text-gray-200 outline-none cursor-pointer text-xs"
                            >
                                <option value="all" className="bg-[#0e1026] text-white">Todos los meses</option>
                                {months.filter(m => m !== 'all').map(m => (
                                    <option key={m} value={m} className="bg-[#0e1026] text-white">{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-1.5 bg-[#080918]/80 border border-white/10 rounded-2xl px-3 py-2 text-xs">
                            <Filter className="w-3.5 h-3.5 text-fuchsia-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-transparent text-gray-200 outline-none cursor-pointer text-xs"
                            >
                                <option value="all" className="bg-[#0e1026] text-white">Todas las categorías</option>
                                {categories.filter(c => c !== 'all').map(c => (
                                    <option key={c} value={c} className="bg-[#0e1026] text-white">{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* New Folder Button */}
                        <button
                            onClick={() => setShowNewFolderModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-2xl text-xs font-semibold transition-all shadow-sm"
                        >
                            <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Nueva Carpeta</span>
                        </button>
                    </div>
                </div>

                {/* Folder Tabs */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                        onClick={() => setSelectedFolderId('all')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            selectedFolderId === 'all'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'bg-[#080918]/60 text-gray-400 hover:text-gray-200 border border-white/5'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Todas ({researches.length})</span>
                    </button>

                    <button
                        onClick={() => setSelectedFolderId('general')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            selectedFolderId === 'general'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'bg-[#080918]/60 text-gray-400 hover:text-gray-200 border border-white/5'
                        }`}
                    >
                        <Folder className="w-3.5 h-3.5 text-indigo-400" />
                        <span>General ({researches.filter(r => (r.folderId || r.folder_id || 'general') === 'general').length})</span>
                    </button>

                    {folders.map(f => {
                        const count = researches.filter(r => (r.folderId || r.folder_id) === f.id).length;
                        return (
                            <div key={f.id} className="relative group flex items-center">
                                <button
                                    onClick={() => setSelectedFolderId(f.id)}
                                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                        selectedFolderId === f.id
                                            ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30'
                                            : 'bg-[#080918]/60 text-gray-400 hover:text-gray-200 border border-white/5'
                                    }`}
                                >
                                    <Folder className="w-3.5 h-3.5 text-fuchsia-400" />
                                    <span>{f.name} ({count})</span>
                                </button>
                                {f.id !== 'general' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`¿Eliminar la carpeta "${f.name}"? Las investigaciones pasarán a General.`)) {
                                                onDeleteFolder(f.id);
                                            }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 ml-1 p-1 text-gray-500 hover:text-rose-400 transition-opacity"
                                        title="Eliminar carpeta"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Batch Action Bar if selected */}
            {selectedResearches.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-indigo-950/80 border border-indigo-500/40 rounded-2xl shadow-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                            <Sparkles className="w-4 h-4 text-indigo-300" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-white">
                                {selectedResearches.length} {selectedResearches.length === 1 ? 'investigación seleccionada' : 'investigaciones seleccionadas'}
                            </span>
                            <p className="text-[11px] text-indigo-300/80">
                                Consolida múltiples hallazgos en el Perfil Estratégico 360° con Inteligencia Artificial
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedResearches([])}
                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            Deseleccionar
                        </button>
                        <button
                            onClick={handleBatchConsolidate}
                            disabled={isConsolidating}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                        >
                            {isConsolidating ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                            )}
                            Consolidar al Perfil Estratégico
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Researches List / Grid */}
            {filteredResearches.length === 0 ? (
                <div className="p-12 text-center bg-[#0e1026]/40 border border-white/5 rounded-3xl backdrop-blur-md">
                    <Folder className="w-12 h-12 text-indigo-400/40 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-gray-300 mb-1">
                        No se encontraron investigaciones
                    </h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                        Realiza una búsqueda en la Capa 1 y presiona "Guardar Investigación" para organizarla por carpetas y dossiers temáticos.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResearches.map((r) => {
                        const isSelected = selectedResearches.includes(r.id);
                        const dateFormatted = r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }) : 'Reciente';

                        return (
                            <motion.div
                                key={r.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`relative group flex flex-col justify-between bg-[#0e1026]/80 hover:bg-[#121533] border transition-all rounded-3xl p-5 shadow-lg ${
                                    isSelected
                                        ? 'border-indigo-500 shadow-indigo-500/20 bg-indigo-950/20'
                                        : 'border-white/10 hover:border-indigo-500/40'
                                }`}
                            >
                                <div>
                                    {/* Top badges & Select checkbox */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelectResearch(r.id)}
                                                className="w-4 h-4 rounded border-gray-600 bg-black/40 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                                {r.category || r.type || 'Auditoría'}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-gray-500 font-medium">
                                            {dateFormatted}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-indigo-200 transition-colors">
                                        {r.title}
                                    </h4>

                                    {/* Summary preview */}
                                    <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed font-normal">
                                        {r.summary || (typeof r.data === 'string' ? r.data : 'Documento estratégico consolidado con insights, dolores y ganchos de conversión.')}
                                    </p>

                                    {/* Tags */}
                                    {r.tags && r.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {r.tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-400 font-medium"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {r.tags.length > 3 && (
                                                <span className="text-[10px] text-gray-500">
                                                    +{r.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions footer */}
                                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        {/* Preview Button */}
                                        <button
                                            onClick={() => setPreviewResearch(r)}
                                            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                            title="Ver detalles completos"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        {/* Print PDF Dossier */}
                                        <button
                                            onClick={() => generateResearchPdf(r, clientName)}
                                            className="p-2 text-indigo-400 hover:text-indigo-300 rounded-xl hover:bg-indigo-500/10 transition-colors"
                                            title="Exportar PDF Dossier"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => {
                                                if (confirm(`¿Estás seguro de eliminar "${r.title}"?`)) {
                                                    onDeleteResearch(r.id);
                                                }
                                            }}
                                            className="p-2 text-gray-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                                            title="Eliminar investigación"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Load to Profile Action */}
                                    <button
                                        onClick={() => onLoadIntoProfile(r)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm"
                                        title="Cargar hallazgos al Perfil Estratégico"
                                    >
                                        <span>Cargar al Perfil</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Modal: New Folder */}
            {showNewFolderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-sm bg-[#0e1026] border border-indigo-500/20 rounded-3xl p-6 text-white shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                <FolderPlus className="w-4 h-4 text-indigo-400" />
                                Crear Carpeta Temática
                            </h4>
                            <button onClick={() => setShowNewFolderModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs text-gray-300 mb-1 font-semibold">Nombre de la carpeta</label>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Ej. Objeciones de Artrosis, Competencia Quito..."
                                    className="w-full bg-[#080918] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowNewFolderModal(false)}
                                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateFolder}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
                                >
                                    Guardar Carpeta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Preview Research */}
            {previewResearch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-3xl max-h-[85vh] bg-[#0e1026] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-y-auto flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
                            <div>
                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {previewResearch.category || previewResearch.type || 'Auditoría'}
                                </span>
                                <h3 className="text-xl font-bold text-white mt-2">
                                    {previewResearch.title}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    Guardado el {new Date(previewResearch.createdAt || Date.now()).toLocaleDateString('es-ES', { dateStyle: 'full' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => generateResearchPdf(previewResearch, clientName)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>PDF</span>
                                </button>
                                <button
                                    onClick={() => setPreviewResearch(null)}
                                    className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 space-y-5 text-xs sm:text-sm text-gray-200">
                            {typeof previewResearch.data === 'string' ? (
                                <div className="p-4 bg-[#080918] rounded-2xl border border-white/5 leading-relaxed whitespace-pre-line font-mono text-xs">
                                    {previewResearch.data}
                                </div>
                            ) : previewResearch.data && typeof previewResearch.data === 'object' ? (
                                <div className="space-y-4">
                                    {previewResearch.data.summary && (
                                        <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl">
                                            <h5 className="font-bold text-indigo-300 mb-1 uppercase tracking-wider text-[11px]">Resumen Ejecutivo</h5>
                                            <p className="text-xs text-gray-300 leading-relaxed">{previewResearch.data.summary}</p>
                                        </div>
                                    )}

                                    {previewResearch.data.frictionPoints && previewResearch.data.frictionPoints.length > 0 && (
                                        <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
                                            <h5 className="font-bold text-rose-300 mb-2 uppercase tracking-wider text-[11px]">Puntos de Fricción & Dolores</h5>
                                            <ul className="space-y-1.5">
                                                {previewResearch.data.frictionPoints.map((f, i) => (
                                                    <li key={i} className="text-xs text-rose-200/90 flex items-start gap-2">
                                                        <span className="text-rose-400 font-bold">•</span>
                                                        <span>{typeof f === 'object' ? `${f.pain || f.title}: ${f.description || ''}` : f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {previewResearch.data.hooks && previewResearch.data.hooks.length > 0 && (
                                        <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl">
                                            <h5 className="font-bold text-purple-300 mb-2 uppercase tracking-wider text-[11px]">Ganchos de Alta Retención</h5>
                                            <ul className="space-y-1.5">
                                                {previewResearch.data.hooks.map((h, i) => (
                                                    <li key={i} className="text-xs text-purple-200/90 flex items-start gap-2">
                                                        <span className="text-purple-400 font-bold">•</span>
                                                        <span>{typeof h === 'object' ? `${h.hook || h.title}: ${h.script || ''}` : h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-400">{previewResearch.summary || 'Sin contenido adicional'}</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    onLoadIntoProfile(previewResearch);
                                    setPreviewResearch(null);
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                                Cargar al Perfil Estratégico
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
