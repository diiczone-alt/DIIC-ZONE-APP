'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, Video, Layout, Box, 
    CheckCircle2, Clock, PlayCircle,
    ChevronDown, MoreHorizontal, ExternalLink,
    Paperclip, MessageSquare, Send, ArrowLeft,
    Sparkles, Filter, ChevronLeft, ChevronRight,
    Image as ImageIcon, Layers, Zap
} from 'lucide-react';
import { PARRILLA_COLUMNS, CONTENT_STATUS, CONTENT_FORMATS, NODE_CONTENT_SUBTYPES } from './StrategyConstants';
import ContentKanban from '../Kanban/ContentKanban';


const DatePickerOverlay = ({ currentDate, onSelect, onClose }) => {
    // Simple custom calendar implementation for the floating effect
    const [viewDate, setViewDate] = useState(new Date(2026, 2, 1));
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-[100] w-64 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl"
        >
            <div className="flex items-center justify-between mb-4">
                <button className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Marzo 2026</span>
                <button className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-400"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {['D','L','M','X','J','V','S'].map(d => (
                    <div key={d} className="text-center text-[8px] font-black text-gray-600 py-1">{d}</div>
                ))}
                {days.map(d => (
                    <button 
                        key={d} 
                        onClick={() => { onSelect(`${d}/3/2026`); onClose(); }}
                        className={`text-[10px] font-bold py-1.5 rounded-lg transition-all ${
                            d === 8 ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default function StrategyContentParrilla({ nodes, onUpdateNode, onBack }) {
    const [activePicker, setActivePicker] = useState(null); // { id: nodeId, type: 'date' | 'format' | 'focus' }
    const [viewMode, setViewMode] = useState('lista'); // 'lista' | 'kanban'

    const mappedNodes = React.useMemo(() => {
        return nodes.map(n => ({
            id: n.id,
            title: n.data?.title || 'Contenido Estratégico',
            type: n.type === 'video' ? 'Video' : n.type === 'reel_viral' ? 'Reel' : 'Imagen',
            platform: n.data?.platform || 'IG',
            mode: n.data?.funnelLevel === 'conversión' ? 'Pauta' : 'Orgánico',
            stage: 'idea',
            responsible: 'Sin Asignar',
            deadline: n.data?.publishDate || 'Por Definir',
            priority: n.data?.funnelLevel === 'conversión' ? 'Alta' : 'Media'
        }));
    }, [nodes]);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#050511] relative overflow-hidden">
            {/* Background Grain/Depth */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,#4f46e533,transparent_60%)]" />

            {/* Tactical Header */}
            <div className="px-8 py-8 flex items-center justify-between z-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all group/back"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover/back:scale-110 transition-transform" />
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">Parrilla Operativa</h2>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Ejecución táctica de la estrategia activa</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1 mr-4">
                        <button 
                            onClick={() => setViewMode('lista')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'lista' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            Lista
                        </button>
                        <button 
                            onClick={() => setViewMode('kanban')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            Tablero
                        </button>
                    </div>

                    {viewMode === 'lista' && (
                        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest gap-3">
                            <Filter className="w-3.5 h-3.5" />
                            Filtrar por Etapa
                            <ChevronDown className="w-3 h-3 opacity-30" />
                        </div>
                    )}
                    <button className="px-6 py-2.5 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                        <Sparkles className="w-4 h-4 fill-current" />
                        Exportar a Producción
                    </button>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <div className="flex-1 overflow-hidden px-4 pb-4">
                    <ContentKanban isEmbedded={true} initialContents={mappedNodes} />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar">
                    <div className="space-y-4 max-w-[1600px] mx-auto">
                        {/* Floating Table Header */}
                        <div className="grid grid-cols-[80px_120px_140px_160px_140px_1fr_160px_120px_140px] items-center px-8 py-3 bg-white/[0.02] rounded-2xl border border-white/5 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] sticky top-0 z-20 backdrop-blur-sm shadow-xl">
                            <span>IMG</span>
                            <span>FECHA</span>
                            <span>FORMATO</span>
                            <span>ENFOQUE</span>
                            <span>TIPO</span>
                            <span>TEMA / TÍTULO</span>
                            <span>ACTIVO / PRODUCTO</span>
                            <span>ESTADO</span>
                            <span className="text-right pr-4">ACCIONES</span>
                        </div>

                        {nodes.map((node, i) => {
                            const format = CONTENT_FORMATS[node.type] || CONTENT_FORMATS.post;
                            
                            return (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative"
                                >
                                    <div className="grid grid-cols-[80px_120px_140px_160px_140px_1fr_160px_120px_140px] items-center p-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-indigo-500/30 rounded-3xl transition-all shadow-lg hover:shadow-indigo-500/10 hover:translate-x-1 group-hover:scale-[1.01] perspective-1000 origin-left">
                                        
                                        {/* ASSET PREVIEW (3D Feel) */}
                                        <div className="relative w-14 h-14 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-indigo-500/50 transition-colors shadow-2xl">
                                            {node.type === 'video' || node.type === 'reel_viral' ? (
                                                <Video className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="w-[40%] h-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* FECHA (Interactive) */}
                                        <div className="relative pl-4">
                                            <button 
                                                onClick={() => setActivePicker(activePicker?.id === node.id ? null : { id: node.id, type: 'date' })}
                                                className="px-3 py-1.5 rounded-xl hover:bg-white/5 flex items-center gap-2 group/btn transition-colors"
                                            >
                                                <Calendar className="w-3.5 h-3.5 text-gray-500 group-hover/btn:text-indigo-400" />
                                                <span className="text-[10px] font-black text-gray-400 group-hover/btn:text-white uppercase tracking-widest">{node.data?.publishDate || '8/3/2026'}</span>
                                            </button>
                                            <AnimatePresence>
                                                {activePicker?.id === node.id && activePicker.type === 'date' && (
                                                    <DatePickerOverlay 
                                                        onSelect={(date) => onUpdateNode(node.id, { ...node.data, publishDate: date })} 
                                                        onClose={() => setActivePicker(null)} 
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* FORMATO (Interactive) */}
                                        <div className="pl-4">
                                            <button className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-tighter shadow-sm flex items-center gap-2">
                                                {format.label}
                                                <ChevronDown className="w-3 h-3 opacity-40" />
                                            </button>
                                        </div>

                                        {/* ENFOQUE */}
                                        <div className="pl-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">INSTITUCIONAL</span>
                                                <div className="flex gap-1">
                                                    {[1,2,3].map(d => <div key={d} className="w-3 h-1 rounded-full bg-emerald-500/20" />)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* TIPO */}
                                        <div className="pl-4">
                                            <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest hover:border-blue-500 transition-all cursor-pointer">
                                                HUMANIZACIÓN
                                            </span>
                                        </div>

                                        {/* TEMA */}
                                        <div className="pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-white uppercase tracking-tight line-clamp-1">{node.data?.title}</span>
                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">PROYECTO: CORPORATIVO X</span>
                                            </div>
                                        </div>

                                        {/* PRODUCTO */}
                                        <div className="pl-4 pr-4">
                                            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3 group/link cursor-pointer hover:border-indigo-500/30 transition-all">
                                                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                                                    <Zap className="w-3 h-3" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-gray-400 group-hover/link:text-white transition-colors">DÍA DE LA MUJER</span>
                                                    <span className="text-[7px] text-gray-600 font-bold tracking-widest uppercase">Ver Video</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ESTADO */}
                                        <div className="pl-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[8px] font-black text-emerald-500 uppercase">COMPARTIDO</span>
                                            </div>
                                        </div>

                                        {/* ACCIONES */}
                                        <div className="flex items-center justify-end gap-3 pr-4">
                                            <button className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                                                <Send className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-xl text-indigo-400 hover:text-white hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/30">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
