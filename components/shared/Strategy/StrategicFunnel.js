'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ChevronUp, ChevronDown, Rocket, Target, Zap } from 'lucide-react';

import { NODE_TYPES } from './StrategyConstants';

const FUNNEL_STAGES = [
    { 
        id: 'conciencia', 
        label: '1. CONCIENCIA', 
        desc: 'Alcanzar nuevas personas', 
        color: '#6366f1', 
        tactics: ['Anuncios en redes', 'Publicaciones en blogs', 'Colaboraciones'],
        metrics: ['Tráfico web', 'Impresiones', 'Alcance']
    },
    { 
        id: 'interés', 
        label: '2. INTERÉS', 
        desc: 'Despertar curiosidad', 
        color: '#22c55e', 
        tactics: ['Newsletters', 'Ebooks o webinars', 'Retargeting'],
        metrics: ['Suscripciones', 'Descargas', 'Seguidores']
    },
    { 
        id: 'consideración', 
        label: '3. CONSIDERACIÓN', 
        desc: 'Educar y ayudar', 
        color: '#a855f7', 
        tactics: ['Pruebas gratuitas', 'Demos de producto', 'Casos de estudio'],
        metrics: ['Solicitudes demo', 'Registros prueba', 'Tiempo en sitio']
    },
    { 
        id: 'conversión', 
        label: '4. CONVERSIÓN', 
        desc: 'Convertir leads', 
        color: '#ec4899', 
        tactics: ['Ofertas tiempo limitado', 'Llamadas de venta', 'Descuentos'],
        metrics: ['Tasa conv.', 'Ingresos', 'Valor pedido']
    },
    { 
        id: 'retención', 
        label: '5. RETENCIÓN', 
        desc: 'Mantener comprometidos', 
        color: '#06b6d4', 
        tactics: ['Programas fidelización', 'Seguimiento', 'Recompensas'],
        metrics: ['Compras repetidas', 'Valor vida (LTV)']
    }
];

export function StrategicFunnel({ 
    campaigns = [], 
    activeCampaignId, 
    onSelectCampaign, 
    onClose 
}) {
    const [selectedId, setSelectedId] = useState(activeCampaignId);
    const [activeStageId, setActiveStageId] = useState(null);

    const activeCampaign = useMemo(() => 
        campaigns.find(c => c.id === selectedId) || campaigns[0], 
    [campaigns, selectedId]);

    const nodes = activeCampaign?.nodes || [];

    // Map actual nodes to stages
    const total = nodes.length || 1;
    const stages = FUNNEL_STAGES.map(stage => {
        let count = 0;
        
        nodes.forEach(n => {
            const typeConfig = NODE_TYPES[n.type];
            if (!typeConfig) return;
            
            const category = typeConfig.category;
            if (stage.id === category) count++;
        });

        const calculatedPct = nodes.length > 0 ? Math.round((count / total) * 100) : stage.pct;
        return { ...stage, value: calculatedPct };
    });

    const completionPct = stages.find(s => s.id === 'conversión')?.value || 0;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#050511] overflow-hidden flex flex-col"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full bg-[#08081a] flex flex-col md:flex-row overflow-hidden"
            >
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                
                {/* LEFT COLUMN: Campaign Selection List */}
                <div className="w-full md:w-80 flex flex-col relative z-10 border-r border-white/5 p-8 bg-[#0A0A1F]/50">
                    <div className="flex items-center gap-3 mb-8">
                        <Target className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Seleccionar Estrategia</h3>
                    </div>
                    
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                        {campaigns.map(camp => (
                            <button 
                                key={camp.id}
                                onClick={() => {
                                    setSelectedId(camp.id);
                                    onSelectCampaign?.(camp.id);
                                }}
                                className={`flex flex-col items-start p-5 rounded-2xl transition-all border ${
                                    selectedId === camp.id 
                                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                                } group text-left`}
                            >
                                <span className={`text-[9px] font-black mb-1 uppercase tracking-widest ${selectedId === camp.id ? 'text-indigo-400' : 'text-gray-600'}`}>
                                    {camp.type || 'Estrategia'}
                                </span>
                                <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate w-full">
                                    {camp.name}
                                </span>
                                <div className="mt-3 flex items-center gap-3 w-full">
                                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${camp.progress || 0}%` }} />
                                    </div>
                                    <span className="text-[9px] font-black text-gray-500">{camp.progress || 0}%</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <p className="text-[9px] text-indigo-300/60 font-medium leading-relaxed uppercase tracking-tighter">
                            Selecciona una estrategia para previsualizar su conversión y estado actual en el embudo.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Funnel Visualizer */}
                <div className="flex-1 flex flex-col relative z-10 p-10 lg:p-16 overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Filter className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-wider">Embudo Estratégico</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-cyan-400" />
                                    Analizando: <span className="text-white italic">{activeCampaign?.name}</span>
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Backlog Bar */}
                    <div className="mb-14">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Backlog Operativo</span>
                            <div className="flex gap-16 font-black text-lg tracking-tighter">
                                <span className="text-cyan-400">{100 - completionPct}% PENDIENTE</span>
                                <span className="text-pink-500">{completionPct}% RESUELTO</span>
                            </div>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex p-1 border border-white/10 shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - completionPct}%` }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full"
                            />
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPct}%` }}
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Funnel Body */}
                    <div className="flex items-center gap-12 py-6">
                        {/* Left Labels */}
                        <div className="flex flex-col justify-between h-[420px] text-right w-48 py-4">
                            {stages.map((stage, i) => (
                                <motion.div 
                                    key={stage.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col group cursor-help"
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="text-[14px] font-[900] uppercase tracking-[0.1em]" style={{ color: stage.color }}>{stage.label}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.05em] mt-0.5">{stage.desc}</span>
                                    
                                    {/* Tactics & Metrics Tooltip-style info */}
                                    <div className="mt-2 flex flex-col items-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <div className="flex gap-2 mb-1">
                                            {stage.metrics.slice(0, 2).map(m => (
                                                <span key={m} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[7px] text-gray-400">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                                           {/* Funnel SVG */}
                        <div className="flex-1 flex justify-center scale-110 lg:scale-125 py-4">
                            <svg width="260" height="420" viewBox="0 0 260 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {stages.map((stage, i) => {
                                    const yBase = i * 75; 
                                    const widthTop = 220 - (i * 35);
                                    const widthBottom = 220 - ((i + 1) * 35);
                                    const height = 65;
                                    
                                    return (
                                        <g 
                                            key={stage.id} 
                                            className="group cursor-pointer"
                                            onClick={() => setActiveStageId(stage.id)}
                                        >
                                            <defs>
                                                <linearGradient id={`fp-grad-${stage.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor={stage.color} />
                                                    <stop offset="100%" stopColor={stage.color} stopOpacity="0.3" />
                                                </linearGradient>
                                                <filter id={`glow-${stage.id}`}>
                                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                            </defs>
                                            
                                            {/* Tactics on hover (Left Side of ring) */}
                                            <foreignObject x="-100" y={yBase + 10} width="100" height="80" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex flex-col items-end pr-4 pointer-events-none">
                                                    <span className="text-[7px] font-black text-gray-500 uppercase mb-1">Tácticas</span>
                                                    {stage.tactics.map(t => (
                                                        <span key={t} className="text-[6px] font-bold text-white uppercase text-right leading-tight mb-0.5">{t}</span>
                                                    ))}
                                                </div>
                                            </foreignObject>

                                            <motion.ellipse 
                                                initial={{ rx: 0, ry: 0 }}
                                                animate={{ rx: widthTop / 2, ry: 15 }}
                                                cx="130" cy={30 + yBase}
                                                fill={`url(#fp-grad-${stage.id})`}
                                                className="transition-all duration-300 group-hover:filter group-hover:brightness-150"
                                                filter={stage.value > 0 ? `url(#glow-${stage.id})` : ''}
                                            />
                                            <motion.path 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.15 }}
                                                d={`M ${130 - widthTop/2} ${30 + yBase} L ${130 - widthBottom/2} ${30 + yBase + height} L ${130 + widthBottom/2} ${30 + yBase + height} L ${130 + widthTop/2} ${30 + yBase} Z`}
                                                fill={stage.color}
                                                className="transition-all group-hover:opacity-30"
                                            />
                                            <motion.text 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                x="130" y={35 + yBase}
                                                textAnchor="middle"
                                                className="text-[16px] font-black fill-white pointer-events-none drop-shadow-lg"
                                            >
                                                {stage.value}%
                                            </motion.text>

                                            {/* Metrics on hover (Right Side of ring) */}
                                            <foreignObject x="210" y={yBase + 10} width="100" height="80" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex flex-col items-start pl-4 pointer-events-none">
                                                    <span className="text-[7px] font-black border-l border-white/20 pl-2 text-gray-500 uppercase mb-1">Métricas</span>
                                                    {stage.metrics.map(m => (
                                                        <span key={m} className="text-[6px] font-bold text-white uppercase leading-tight mb-0.5 pl-2">{m}</span>
                                                    ))}
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                })}
                                <ellipse cx="130" cy="400" rx="50" ry="10" stroke="white" strokeOpacity="0.1" strokeDasharray="4 4" fill="none" />
                            </svg>
                        </div>
                        
                        {/* Right Sidebar: Stage Details */}
                        <div className="w-80 flex flex-col gap-6">
                            <AnimatePresence mode="wait">
                                {activeStageId ? (
                                    <motion.div 
                                        key={activeStageId}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md h-full flex flex-col"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div 
                                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                                                style={{ backgroundColor: FUNNEL_STAGES.find(s => s.id === activeStageId)?.color + '20' }}
                                            >
                                                <Target className="w-5 h-5" style={{ color: FUNNEL_STAGES.find(s => s.id === activeStageId)?.color }} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-white uppercase tracking-widest">
                                                    {FUNNEL_STAGES.find(s => s.id === activeStageId)?.label}
                                                </h4>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">Procesos & KPIS</span>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-8">
                                            {FUNNEL_STAGES.find(s => s.id === activeStageId)?.desc}
                                        </p>

                                        {/* Tactics */}
                                        <div className="space-y-4 mb-8">
                                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] pl-1">Tácticas Sugeridas</span>
                                            <div className="grid gap-2">
                                                {FUNNEL_STAGES.find(s => s.id === activeStageId)?.tactics.map((t, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: FUNNEL_STAGES.find(s => s.id === activeStageId)?.color }} />
                                                        <span className="text-[10px] font-black text-gray-300 uppercase truncate">{t}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Metrics */}
                                        <div className="space-y-4">
                                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] pl-1">Métricas de Éxito</span>
                                            <div className="flex flex-wrap gap-2">
                                                {FUNNEL_STAGES.find(s => s.id === activeStageId)?.metrics.map((m, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white italic">
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6">
                                            <button 
                                                onClick={() => setActiveStageId(null)}
                                                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest transition-all"
                                            >
                                                Cerrar Detalles
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center p-8 border border-white/5 rounded-3xl border-dashed"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-6">
                                            <Rocket className="w-8 h-8 text-white/10" />
                                        </div>
                                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Explorador de Procesos</h4>
                                        <p className="text-[9px] text-gray-700 font-bold uppercase leading-relaxed">
                                            Haz clic en cualquier fase del embudo para ver tácticas detalladas y métricas clave.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-black tracking-[0.3em]">
                        <div className="flex items-center gap-4 text-gray-500">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                <span>Engine_Connected</span>
                             </div>
                             <span>v4.8.2_Sync</span>
                        </div>
                        <button 
                            onClick={onClose}
                            className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-indigo-400 hover:text-indigo-300 hover:bg-white/10 transition-all"
                        >
                            Volver a la Pizarra
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
