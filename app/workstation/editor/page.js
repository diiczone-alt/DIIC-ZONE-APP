'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Clock, AlertTriangle, CheckCircle2, MoreVertical,
    ArrowRight, FileVideo, Zap, Calendar, Inbox, DollarSign,
    Layers, Download
} from 'lucide-react';
import { motion } from 'framer-motion';

import { EDITOR_TASKS, EDITOR_STATS } from '@/data/workstationData';

export default function EditorDashboard() {
    const router = useRouter();

    return (
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#050511]">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Panel de Edición</h1>
                    <p className="text-sm text-gray-400">Gestiona tus cortes, revisiones y entregas.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-[#0E0E18] px-4 py-3 rounded-2xl border border-white/10 flex flex-col items-end min-w-[140px] shadow-lg shadow-emerald-500/5">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Pago Acumulado</span>
                        <span className="text-2xl font-black text-emerald-400 leading-none">{EDITOR_STATS.accumulatedPay}</span>
                    </div>
                </div>
            </div>

            {/* Project List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileVideo className="w-5 h-5 text-purple-400" /> Proyectos Activos
                    </h2>
                    <button 
                        onClick={() => router.push('/workstation/editor/task')}
                        className="text-xs font-bold text-purple-400 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                        Ver todos <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {EDITOR_TASKS.map((task) => (
                        <EditorTaskCard 
                            key={task.id} 
                            task={task} 
                            onClick={() => router.push(`/workstation/editor/task/${task.id}`)}
                        />
                    ))}
                </div>
            </div>

            {/* Notifications Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 pb-12">
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-gray-400" /> Material Recibido
                    </h3>
                    <div className="space-y-4">
                        {EDITOR_STATS.recentDownloads.map((dl, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all"><Download className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{dl.name}</p>
                                        <p className="text-[10px] text-gray-400">{dl.size} • {dl.date}</p>
                                    </div>
                                </div>
                                <button className="text-xs text-blue-400 hover:text-white font-bold underline px-2">Descargar</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" /> Correcciones Recientes
                    </h3>
                    <div className="space-y-4">
                        {EDITOR_STATS.recentCorrections.map((corr, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] group-hover:bg-amber-500 group-hover:text-black transition-all">{corr.version}</div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{corr.title}</p>
                                        <p className="text-[10px] text-gray-400 italic truncate max-w-[200px]">{corr.feedback}</p>
                                    </div>
                                </div>
                                <button className="text-xs text-amber-400 hover:text-white font-bold px-2">Ver Feedback</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditorTaskCard({ task, onClick }) {
    // Phase Logic: 1: En Edición, 2: Primera Versión, 3: Correcciones (Review), 4: Final, 5: Entregado

    const getPhaseLabel = (p) => {
        if (p === 1) return { label: 'En Edición', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        if (p === 2) return { label: 'V1 Lista', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
        if (p === 3) return { label: 'Revisión Cliente', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
        if (p === 4) return { label: 'Versión Final', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
        return { label: 'Pendiente', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
    }

    const style = getPhaseLabel(task.phase);

    return (
        <div 
            onClick={onClick}
            className="bg-[#1A1A24] border border-white/5 rounded-2xl p-5 hover:border-purple-500/50 hover:bg-purple-500/[0.02] transition-all group flex items-center justify-between cursor-pointer"
        >
            <div className="flex items-center gap-6">
                {/* Phase Indicator */}
                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0 font-black text-lg transition-all ${style.bg} ${style.border} ${style.color} group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]`}>
                    {task.phase}
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-purple-400 transition-colors uppercase tracking-tight">{task.title}</h3>
                    <p className="text-sm text-gray-500 font-medium">{task.client}</p>
                </div>
            </div>

            <div className="flex items-center gap-8 text-right">
                <div className="hidden sm:block">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Pago Estimado</p>
                    <p className="text-sm font-black text-emerald-400">{task.pay}</p>
                </div>
                <div className="hidden md:block">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Deadline</p>
                    <p className="text-sm font-bold text-white">{task.deadline}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.bg} ${style.color} ${style.border}`}>
                    {style.label}
                </div>
                <button className="p-3 bg-white/5 group-hover:bg-purple-500 group-hover:text-white rounded-xl text-gray-500 transition-all">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
