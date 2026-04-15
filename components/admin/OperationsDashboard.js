'use client';

import { useState, useEffect } from 'react';
import { Activity, Layers, AlertCircle, TrendingUp, Clock, Filter } from 'lucide-react';
import { prioritizationService } from '@/services/prioritizationService';

export default function OperationsDashboard() {
    // Mock Data for Demo
    const [queue, setQueue] = useState([
        { id: 1, name: 'Lanzamiento Dr. Perez', client: 'Dr. Perez', plan: 'PREMIUM', type: 'SALES_CAMPAIGN', deadline: '2025-10-25', history: 'VIP' },
        { id: 2, name: 'Reels Mes Noviembre', client: 'Burger King Local', plan: 'PRO', type: 'CONTENT', deadline: '2025-11-01', history: 'GOOD' },
        { id: 3, name: 'Diseño Menú', client: 'Café Start', plan: 'BASIC', type: 'DESIGN', deadline: '2025-10-30', history: 'CONFLICTIVE' },
        { id: 4, name: 'Automatización Leads', client: 'Inmobiliaria X', plan: 'PRO', type: 'AUTOMATION', deadline: '2025-10-22', history: 'GOOD' },
    ]);

    const [processedQueue, setProcessedQueue] = useState([]);

    useEffect(() => {
        // Process priorities
        const processed = queue.map(item => {
            const result = prioritizationService.calculateScore(
                { plan: item.plan, history: item.history },
                { type: item.type, deadline: item.deadline }
            );
            return { ...item, ...result, priorityScore: result.score };
        });

        // Reorder
        const sorted = prioritizationService.prioritizeQueue(processed);
        setProcessedQueue(sorted);
    }, []);

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-8">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Ops Center</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Cola de Prioridad Inteligente</h2>
                    <p className="text-gray-400 text-sm">Ordeamiento automático por Valor del Negocio.</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl text-right">
                    <div className="text-xs text-gray-500 font-bold uppercase">Capacidad Actual</div>
                    <div className={`text-xl font-black ${prioritizationService.networkCapacity > 80 ? 'text-red-400' : 'text-green-400'}`}>
                        {prioritizationService.networkCapacity}%
                    </div>
                </div>
            </div>

            {/* Queue Visualization */}
            <div className="space-y-4">
                {processedQueue.map((project, index) => (
                    <div
                        key={project.id}
                        className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${project.status === 'QUEUE' ? 'bg-red-900/10 border-red-500/20 opacity-75' :
                                'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                    >
                        {/* Rank */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0E0E18] border border-white/20 flex items-center justify-center text-xs font-bold text-gray-400 font-mono shadow-xl">
                            #{index + 1}
                        </div>

                        {/* Info */}
                        <div className="pl-6 flex items-center gap-4">
                            <div>
                                <h4 className="font-bold text-white text-lg">{project.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{project.client}</span>
                                    <span>•</span>
                                    <span>{project.plan}</span>
                                    <span>•</span>
                                    <span>{project.deadline}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="flex items-center gap-6">

                            {/* Score Breakdown (Mini) */}
                            <div className="hidden lg:flex gap-2 text-[10px] text-gray-500 font-mono">
                                <div title="Impacto">IMP: {project.breakdown.sImpact}</div>
                                <div title="Urgencia">URG: {project.breakdown.sUrgency}</div>
                            </div>

                            {/* Badge */}
                            {project.status === 'QUEUE' ? (
                                <span className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> En Espera
                                </span>
                            ) : (
                                <div className={`text-right ${project.tier === 'HIGH' ? 'text-red-400' :
                                        project.tier === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                    <div className="text-2xl font-black leading-none">{project.score}</div>
                                    <div className="text-[10px] font-bold uppercase opacity-80">{project.tier} PRIORITY</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4 flex gap-4 items-center">
                <Filter className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                    <h4 className="text-white font-bold text-sm">Filtro de Capacidad Activo</h4>
                    <p className="text-xs text-gray-400">
                        La capacidad supera el 85%. Proyectos nuevos con Score {'<'} 75 están entrando automáticamente a cola de espera.
                    </p>
                </div>
            </div>

        </div>
    );
}
