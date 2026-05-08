'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ChevronUp, ChevronDown, Rocket, Target, Zap, Info } from 'lucide-react';

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
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 right-0 left-[64px] z-[200] bg-[#050511] overflow-hidden flex flex-col border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
        >
            {/* 1. FUTURISTIC NEURAL BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2)_0%,transparent_70%)] animate-pulse" />
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-[spin_240s_linear_infinite]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 w-full h-[30vh] bg-[linear-gradient(to_top,#050511,transparent)] z-10" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <header className="px-10 py-8 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                            <Filter className="w-7 h-7 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
                                Embudo <span className="text-indigo-400">Estratégico</span>
                                <div className="h-px w-20 bg-gradient-to-r from-indigo-500 to-transparent opacity-30" />
                            </h1>
                            <div className="flex items-center gap-3 mt-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    Analizando: <span className="text-white italic">{activeCampaign?.name || 'DIIC ARCHITECTURE'}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Estado del Backlog</p>
                            <div className="flex items-center gap-10">
                                <div className="flex flex-col">
                                    <span className="text-[18px] font-black text-white leading-none">{100 - completionPct}%</span>
                                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Pendiente</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[18px] font-black text-white leading-none">{completionPct}%</span>
                                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1">Resuelto</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white flex items-center justify-center transition-all border border-white/10 group"
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>
                </header>

                {/* HUD Bar */}
                <div className="px-10 h-1.5 w-full shrink-0">
                    <div className="h-full w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            className="absolute inset-y-0.5 left-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                        />
                    </div>
                </div>

                {/* Main Workspace */}
                <div className="flex-1 flex gap-8 px-10 pb-10 mt-6 overflow-hidden">
                    
                    <aside className="w-80 flex flex-col gap-5 shrink-0 overflow-hidden">
                        <div className="flex-1 flex flex-col bg-white/[0.03] border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 overflow-hidden">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Target className="w-3.5 h-3.5 text-indigo-400" /> Seleccionar Estrategia
                            </h3>
                            
                            <div className="flex-1 overflow-y-auto pr-3 space-y-3 custom-scrollbar">
                                {campaigns.map(camp => (
                                    <button 
                                        key={camp.id}
                                        onClick={() => {
                                            setSelectedId(camp.id);
                                            onSelectCampaign?.(camp.id);
                                        }}
                                        className={`w-full flex flex-col items-start p-5 rounded-3xl transition-all border group relative overflow-hidden ${
                                            selectedId === camp.id 
                                            ? 'bg-indigo-600/10 border-indigo-500/40 shadow-2xl' 
                                            : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center w-full mb-1">
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedId === camp.id ? 'text-indigo-400' : 'text-gray-600'}`}>
                                                {camp.type || 'Campaign Node'}
                                            </span>
                                            {selectedId === camp.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />}
                                        </div>
                                        <span className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors truncate w-full">
                                            {camp.name}
                                        </span>
                                        <div className="mt-4 flex items-center gap-4 w-full">
                                            <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${camp.progress || 0}%` }} />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500">{camp.progress || 0}%</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 flex flex-col items-center justify-center relative bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
                        
                        <div className="relative transform scale-[1.3] translate-y-[-10px]">
                            <svg width="450" height="500" viewBox="0 0 450 500" fill="none" className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                                {stages.map((stage, i) => {
                                    const yBase = 60 + (i * 70);
                                    const nextY = 60 + ((i + 1) * 70);
                                    const widthTop = 380 - (i * 60);
                                    const widthBottom = 380 - ((i + 1) * 60);
                                    const xTopStart = (450 - widthTop) / 2;
                                    const xBottomStart = (450 - widthBottom) / 2;
                                    
                                    const isActive = activeStageId === stage.id;

                                    return (
                                        <motion.g 
                                            key={stage.id} 
                                            className="group cursor-pointer"
                                            onClick={() => setActiveStageId(stage.id)}
                                            onMouseEnter={() => setActiveStageId(stage.id)}
                                            animate={{ opacity: activeStageId ? (isActive ? 1 : 0.3) : 0.8 }}
                                        >
                                            <defs>
                                                <linearGradient id={`grad-${stage.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor={stage.color} stopOpacity="0.8" />
                                                    <stop offset="100%" stopColor={stage.color} stopOpacity="0.2" />
                                                </linearGradient>
                                            </defs>
                                            
                                            <path 
                                                d={`M ${xTopStart} ${yBase} L ${xTopStart + widthTop} ${yBase} L ${xBottomStart + widthBottom} ${nextY} L ${xBottomStart} ${nextY} Z`}
                                                fill={`url(#grad-${stage.id})`}
                                                stroke={stage.color}
                                                strokeWidth={isActive ? "3" : "1"}
                                                strokeOpacity={isActive ? "1" : "0.3"}
                                                className="transition-all duration-700"
                                            />

                                            <ellipse 
                                                cx="225" cy={yBase} rx={widthTop / 2} ry="15"
                                                fill={stage.color} fillOpacity="0.3"
                                                stroke={stage.color} strokeWidth="1" strokeOpacity="0.5"
                                            />

                                            <text 
                                                x="225" y={yBase + 45} 
                                                textAnchor="middle" 
                                                className="text-[20px] font-black fill-white pointer-events-none"
                                                style={{ filter: isActive ? `drop-shadow(0 0 10px ${stage.color})` : 'none' }}
                                            >
                                                {stage.value}%
                                            </text>

                                            <motion.g
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: isActive ? 1 : 0.4, x: 0 }}
                                                className="pointer-events-none"
                                            >
                                                <text x={xTopStart - 20} y={yBase + 35} textAnchor="end" className="text-[11px] font-black fill-white uppercase tracking-widest" style={{ color: stage.color }}>{stage.label}</text>
                                                <text x={xTopStart - 20} y={yBase + 48} textAnchor="end" className="text-[7px] font-bold fill-gray-500 uppercase tracking-widest">{stage.desc}</text>
                                            </motion.g>
                                        </motion.g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    <aside className="w-80 shrink-0 flex flex-col gap-5 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeStageId ? (
                                <motion.div 
                                    key={activeStageId}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 50, opacity: 0 }}
                                    className="flex-1 flex flex-col bg-white/[0.04] border border-white/10 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl"
                                >
                                    {(() => {
                                        const stage = stages.find(s => s.id === activeStageId);
                                        return (
                                            <>
                                                <div className="p-8 border-b border-white/5 relative">
                                                    <div className="flex items-center gap-5 mb-6">
                                                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: `${stage.color}20`, border: `1px solid ${stage.color}40` }}>
                                                            <Zap className="w-6 h-6" style={{ color: stage.color }} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-white uppercase tracking-tighter leading-none">{stage.label}</h4>
                                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2 italic">Intelligence Hub</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                                        <p className="text-[11px] font-medium text-gray-400 italic leading-relaxed">"{stage.desc}"</p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                                    <div className="space-y-5">
                                                        <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-3">
                                                            <div className="h-px w-6 bg-indigo-500/40" /> Tácticas Sugeridas
                                                        </h5>
                                                        <div className="space-y-2.5">
                                                            {stage.tactics.map(t => (
                                                                <div key={t} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-indigo-600/10 hover:border-indigo-500/20 transition-all cursor-pointer">
                                                                    <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: stage.color, backgroundColor: stage.color }} />
                                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{t}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-5">
                                                        <h5 className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em] flex items-center gap-3">
                                                            <div className="h-px w-6 bg-purple-500/40" /> Métricas Clave
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {stage.metrics.map(m => (
                                                                <span key={m} className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[8px] font-black text-purple-300 uppercase italic tracking-widest">{m}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-black/40">
                                                    <button 
                                                        onClick={() => setActiveStageId(null)}
                                                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-gray-500 hover:text-white flex items-center justify-center gap-2"
                                                    >
                                                        Cerrar Análisis <ChevronDown className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 border-dashed rounded-[3rem] p-10 text-center"
                                >
                                    <div className="h-20 w-20 bg-indigo-500/5 rounded-full flex items-center justify-center mb-6 border border-indigo-500/10 animate-pulse">
                                        <Info className="w-8 h-8 text-indigo-500/20" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Selecciona una Fase</h4>
                                    <p className="text-[9px] text-gray-700 mt-2 uppercase font-bold leading-relaxed">Para ver tácticas y métricas personalizadas</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </aside>
                </div>
            </div>
        </motion.div>
    );
}

