'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, Calendar, CheckCircle2, AlertCircle, 
    ArrowRight, MoreHorizontal, Target, Zap, 
    TrendingUp, Shield, Box
} from 'lucide-react';

export default function StrategyPlanner({ activeCampaign }) {
    const nodes = activeCampaign?.nodes || [];
    
    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'completado': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
            case 'en proceso': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock };
            case 'analizando': return { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: Zap };
            case 'listo': return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Box };
            default: return { color: 'text-gray-400', bg: 'bg-white/5', border: 'border-white/10', icon: AlertCircle };
        }
    };

    const getProgress = (status) => {
        switch(status?.toLowerCase()) {
            case 'completado': return 100;
            case 'en proceso': return 65;
            case 'analizando': return 30;
            case 'listo': return 0;
            default: return 0;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                {/* Header Context */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                Módulo de Seguimiento Profesional
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-700" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">v1.2.0 Pipeline</span>
                        </div>
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">
                            Planner <span className="text-indigo-500">Master</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.2em] opacity-60">
                            Hoja de ruta táctica para: <span className="text-white">{activeCampaign?.name || 'Selecciona una estrategia'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                         <div className="text-right">
                             <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Carga Operativa</span>
                             <span className="text-2xl font-black text-white italic">{nodes.length} Nodos</span>
                         </div>
                         <div className="h-10 w-px bg-white/10" />
                         <div className="text-right">
                             <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Meta Global</span>
                             <span className="text-2xl font-black text-emerald-400 italic">{activeCampaign?.progress || 0}%</span>
                         </div>
                    </div>
                </div>

                {/* Planner Table/List */}
                <div className="space-y-4">
                    {nodes.length === 0 ? (
                        <div className="py-24 text-center border border-white/5 rounded-[40px] bg-white/[0.01]">
                            <Target className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-gray-600 uppercase tracking-widest">No hay nodos en esta pizarra</h3>
                            <p className="text-gray-700 text-sm mt-2">Crea componentes en la pizarra de flujo para verlos aquí.</p>
                        </div>
                    ) : (
                        nodes.map((node, i) => {
                            const status = node.data?.status || 'Sin asignar';
                            const style = getStatusStyle(status);
                            const StatusIcon = style.icon;
                            const progress = getProgress(status);

                            return (
                                <motion.div 
                                    key={node.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all cursor-pointer"
                                >
                                    {/* Task Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[9px] font-black text-indigo-500/60 uppercase tracking-widest">
                                                ID_{node.id.slice(0,6)}
                                            </span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                                {node.data?.category || 'General'}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                                            {node.data?.label || 'Sin título'}
                                        </h4>
                                    </div>

                                    {/* Status Chip */}
                                    <div className="w-40 flex-shrink-0">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${style.bg} ${style.border}`}>
                                            <StatusIcon className={`w-3.5 h-3.5 ${style.color}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${style.color}`}>
                                                {status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="w-48 flex-shrink-0 flex items-center gap-4">
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-400'}`}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 w-8">{progress}%</span>
                                    </div>

                                    {/* Delivery / Timeline */}
                                    <div className="w-48 flex-shrink-0 flex items-center gap-4 border-l border-white/5 pl-6">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Entrega</span>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                                                <span className="text-xs font-bold text-gray-300">
                                                    {node.data?.deadline || 'A definir'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    {/* Hover Indicator */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_#6366f1]" />
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Footer Metrics */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                        <div>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Eficiencia Media</span>
                            <span className="text-3xl font-black text-white italic">94.2%</span>
                        </div>
                    </div>
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
                        <Shield className="w-6 h-6 text-indigo-400" />
                        <div>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Seguridad del Pipeline</span>
                            <span className="text-3xl font-black text-white italic">Estable</span>
                        </div>
                    </div>
                    <div className="p-8 rounded-[32px] bg-[#4ADE80] border border-white/5 space-y-4 shadow-[0_20px_40px_rgba(74,222,128,0.1)]">
                        <Zap className="w-6 h-6 text-black" />
                        <div>
                            <span className="text-[10px] font-black text-black/40 uppercase tracking-widest block">Optimización IA</span>
                            <span className="text-3xl font-black text-black italic">Activa</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
