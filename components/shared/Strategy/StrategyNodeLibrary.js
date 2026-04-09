'use client';

import React, { useState } from 'react';
import { Search, ChevronRight, Plus, Info, X, Sparkles, Box, Target, Zap, Layout, FileText, Video, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NODE_CATEGORIES, NODE_TYPES, NODE_CONTENT_TYPES, NODE_CONTENT_SUBTYPES } from './StrategyConstants';

export default function StrategyNodeLibrary({ onAddNode, onApplyTemplate, onClose, isStandalone = false }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedType, setExpandedType] = useState(null);
    const [viewMode, setViewMode] = useState('format'); // 'format' or 'strategy'

    // Grouping by Format
    const contentTypesWithSubtypes = Object.entries(NODE_CONTENT_TYPES).map(([typeId, typeConfig]) => {
        const subtypes = (NODE_CONTENT_SUBTYPES[typeId] || []).filter(s => 
            s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return { 
            id: typeId, 
            ...typeConfig, 
            subtypes 
        };
    });

    // Grouping by Strategy
    const strategicCategories = Object.entries(NODE_CATEGORIES)
        .filter(([id]) => id !== 'especial')
        .map(([catId, catConfig]) => {
            const subtypes = Object.entries(NODE_TYPES)
                .filter(([typeId, typeConfig]) => typeConfig.category === catId)
                .map(([typeId, typeConfig]) => ({
                    id: typeId,
                    label: typeConfig.label,
                    icon: typeConfig.icon,
                    desc: typeConfig.desc,
                    parentType: typeId
                }))
                .filter(s => 
                    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
                );
            return { ...catConfig, subtypes };
        });

    if (isStandalone) {
        // --- PREMIUM STANDALONE LABORATORY LAYOUT ---
        return (
            <div className="w-full h-full bg-[#050511] flex flex-col overflow-hidden animate-in fade-in duration-700">
                {/* 🌌 Background Ambience */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />
                </div>

                {/* --- STANDALONE HEADER --- */}
                <div className="px-12 py-10 flex items-center justify-between relative z-10 shrink-0">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                                LIBRERÍA DE <span className="text-indigo-500">COMPONENTES</span>
                            </h2>
                            <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                ONLINE HUB
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1">DIICZONE ARCHITECTURE ENGINE / NODOS ESTRATÉGICOS</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Standalone Search */}
                        <div className="relative group/search">
                            <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within/search:bg-indigo-500/10 transition-all rounded-full" />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/search:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="BUSCAR COMPONENTE TÁCTICO..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-[450px] bg-white/[0.03] border border-white/10 group-hover/search:border-white/20 group-focus-within/search:border-indigo-500/50 rounded-[2rem] pl-16 pr-8 py-5 text-sm font-black text-white placeholder:text-gray-600 focus:outline-none backdrop-blur-3xl transition-all shadow-2xl relative z-10"
                            />
                        </div>

                        {/* View Switcher (Large) */}
                                    <div className="flex bg-white/[0.03] border border-white/5 p-1.5 rounded-[2rem] relative z-10">
                            {[
                                { id: 'format', label: 'POR FORMATO', icon: Layout },
                                { id: 'strategy', label: 'POR ETAPA', icon: Target }
                            ].map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setViewMode(v.id)}
                                    className={`px-8 py-3.5 rounded-[1.5rem] flex items-center gap-3 transition-all ${
                                        viewMode === v.id 
                                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-xl shadow-indigo-500/20' 
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <v.icon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{v.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Back Button */}
                        <button 
                            onClick={onClose}
                            className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3 group/back"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest pl-2">Cerrar Librería</span>
                            <X className="w-5 h-5 group-hover/back:rotate-90 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* --- GRID SCROLL AREA --- */}
                <div className="flex-1 overflow-y-auto px-12 pb-20 custom-scrollbar relative z-10">
                    <div className="space-y-16">
                        {(viewMode === 'format' ? contentTypesWithSubtypes : strategicCategories).map((group, gIdx) => (
                            <div key={group.id} className="space-y-8">
                                {/* Group Title Floating UI */}
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl" 
                                         style={{ backgroundColor: `${group.color}15`, color: group.color }}>
                                        <group.icon className="w-7 h-7 drop-shadow-[0_0_15px_currentColor]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">{group.label}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-20 bg-gradient-to-r from-indigo-500 to-transparent opacity-40" />
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">{group.subtypes.length} COMPONENTES RECOMENDADOS</span>
                                        </div>
                                    </div>
                                </div>

                                {/* STANDALONE GRID (3 and 4 Columns depending on width/available space) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {group.subtypes.map((subtype, sIdx) => {
                                        const masterType = viewMode === 'format' ? group.id : subtype.parentType;
                                        return (
                                            <motion.div
                                                key={subtype.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: (gIdx * 0.1) + (sIdx * 0.02) }}
                                                onClick={() => onAddNode({ 
                                                    type: subtype.metadata?.id || (viewMode === 'format' ? group.id : subtype.parentType), 
                                                    subtype: subtype.id,
                                                    masterType: masterType || group.id,
                                                    category: viewMode === 'strategy' ? group.id : (subtype.metadata?.category || 'atracción'),
                                                    label: subtype.label,
                                                    desc: subtype.desc
                                                })}
                                                className="group relative h-[220px] bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden group/card shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 perspective-1000"
                                            >
                                                {/* Background Accent Mesh */}
                                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl pointer-events-none group-hover/card:opacity-30 transition-opacity" 
                                                     style={{ backgroundColor: group.color || '#6366f1' }} />
                                                
                                                <div className="flex justify-between items-start relative z-10">
                                                    <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center group-hover/card:border-white/20 transition-all shadow-xl">
                                                        <subtype.icon className="w-6 h-6 text-gray-500 group-hover/card:text-white transition-all transform group-hover/card:scale-110" />
                                                    </div>
                                                    <div className="p-2.5 rounded-full bg-white/5 border border-white/10 opacity-40 group-hover/card:opacity-100 transition-opacity">
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>

                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: group.color }} />
                                                        <h4 className="text-sm font-black text-white uppercase tracking-wider group-hover/card:text-indigo-400 transition-colors uppercase">{subtype.label}</h4>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-600 group-hover/card:text-gray-400 uppercase tracking-tight leading-relaxed line-clamp-2">
                                                        {subtype.desc}
                                                    </p>
                                                </div>

                                                {/* Hover Overlay Action */}
                                                <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover/card:opacity-10 mix-blend-overlay transition-opacity" />
                                                <div className="absolute bottom-6 right-8 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all flex items-center gap-2 text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] italic">
                                                    <Zap className="w-3 h-3" />
                                                    Sincronizar Nodo
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Standalone Templates Section */}
                    <div className="mt-24 pt-16 border-t border-white/5">
                        <div className="flex flex-col mb-10">
                            <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Plantillas Maestras</h3>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-2 italic shadow-inner">Layouts Arquitectónicos Predeterminados de I.A.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: 'Estrategia Médico', desc: 'Optimizado para autoridad y confianza.', icon: Zap, color: '#10b981' },
                                { name: 'Marca Personal', desc: 'Foco en conexión y storytelling viral.', icon: Sparkles, color: '#f59e0b' },
                                { name: 'Ecommerce Pro', desc: 'Arquitectura de venta directa y ofertas.', icon: Target, color: '#ef4444' }
                            ].map((template) => (
                                <button 
                                    key={template.name} 
                                    onClick={() => onApplyTemplate?.(template.name)}
                                    className="relative p-10 rounded-[3rem] bg-[#0E0E18] border border-white/5 hover:border-indigo-500/30 text-left transition-all group active:scale-[0.98] overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex flex-col gap-6 relative z-10">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                            <template.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <span className="block text-xl font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight mb-2">{template.name}</span>
                                            <span className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">{template.desc}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
                                                Cargar Plantilla
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- LEGACY/MODAL LAYOUT PRESERVED FOR INTERNAL CANVAS USE ---
    const containerClasses = "absolute left-[100px] top-[10%] bottom-[10%] w-80 bg-[#0A0A0F]/90 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col z-[80] overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500";

    return (
        <div className={containerClasses}>
                {/* Header / Search */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Biblioteca de Nodos</p>
                        <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar nodo estratégico..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold text-white placeholder:text-gray-600 focus:outline-none"
                        />
                    </div>
                </div>

                {/* View Switcher */}
                <div className="px-6 py-2 flex gap-1 mb-2">
                    <button 
                        onClick={() => setViewMode('format')}
                        className={`flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'format' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                        Por Formato
                    </button>
                    <button 
                        onClick={() => setViewMode('strategy')}
                        className={`flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'strategy' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                        Por Estrategia
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="space-y-4 pb-6">
                        {(viewMode === 'format' ? contentTypesWithSubtypes : strategicCategories).map((item) => (
                            <div key={item.id} className="space-y-2">
                                <button
                                    onClick={() => setExpandedType(expandedType === item.id ? null : item.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${expandedType === item.id ? 'bg-white/5 border border-white/10 shadow-lg' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[11px] font-[900] uppercase tracking-[0.2em] text-white/90">{item.label}</span>
                                            <span className="block text-[8px] font-black text-gray-600 italic uppercase mt-0.5">{item.subtypes.length} OPCIONES</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-3.5 h-3.5 text-gray-700 transition-transform duration-300 ${expandedType === item.id ? 'rotate-90 text-indigo-400' : ''}`} />
                                </button>
                                {expandedType === item.id && (
                                    <div className="grid grid-cols-1 gap-2.5 mt-2 px-1">
                                        {item.subtypes.map((subtype) => (
                                            <div
                                                key={subtype.id}
                                                onClick={() => onAddNode({ 
                                                    type: subtype.metadata?.id || (viewMode === 'format' ? item.id : subtype.parentType), 
                                                    subtype: subtype.id,
                                                    masterType: viewMode === 'format' ? item.id : subtype.parentType,
                                                    category: viewMode === 'strategy' ? item.id : (subtype.metadata?.category || 'atracción'),
                                                    label: subtype.label,
                                                    desc: subtype.desc
                                                })}
                                                className="group relative flex items-center gap-4 p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-pointer"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                                                    <subtype.icon className="w-4.5 h-4.5 text-gray-500 group-hover:text-white transition-colors" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-black text-white/80 uppercase tracking-tight leading-tight">{subtype.label}</p>
                                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tight mt-0.5 leading-tight line-clamp-1">{subtype.desc}</p>
                                                </div>
                                                <Plus className="w-3.5 h-3.5 text-gray-700 group-hover:text-white transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
}
