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
import ProductionItem from '@/components/production/ProductionItem';

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
            priority: n.data?.funnelLevel === 'conversión' ? 'Alta' : 'Media',
            rawNode: n
        }));
    }, [nodes]);

    // Translate strategy stage to pipeline status
    const getPipelineStatus = (strategyStage) => {
        switch(strategyStage) {
            case 'idea': return 'start';
            case 'producción': return 'production';
            case 'revisión': return 'review';
            case 'aprobado': return 'approval';
            case 'programado': return 'scheduled';
            case 'publicado': return 'published';
            default: return 'start';
        }
    };

    // Translate format type to department
    const getDepartment = (nodeType) => {
        if (nodeType === 'video' || nodeType === 'reel_viral') return 'video';
        if (nodeType === 'post_carrusel') return 'design';
        if (nodeType === 'podcast') return 'audio';
        return 'design';
    };

    const pipelineItems = React.useMemo(() => {
        return mappedNodes.map(n => ({
            id: n.id.substring(0,8).toUpperCase(),
            name: n.title,
            type: n.type,
            department: getDepartment(n.rawNode.type),
            status: getPipelineStatus(n.stage),
            startDate: 'Hoy',
            targetDate: n.deadline,
            owner: n.responsible,
            thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80',
            sla: n.priority === 'Alta' ? 'risk' : 'on-track'
        }));
    }, [mappedNodes]);

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
                    <div className="space-y-4 max-w-[1600px] mx-auto pt-4">
                        <AnimatePresence>
                            {pipelineItems.map((item, index) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductionItem 
                                        item={item} 
                                        viewMode="list" 
                                        onClick={() => {}} 
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
