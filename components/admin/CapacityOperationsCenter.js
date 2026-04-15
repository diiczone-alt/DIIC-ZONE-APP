'use client';

import { useState } from 'react';
import { TrendingUp, Users, AlertTriangle, Server, Activity, PauseCircle, UserPlus, ArrowUpRight } from 'lucide-react';

const DEPARTMENTS = [
    {
        id: 'video',
        name: 'Edición de Video',
        capacity: 60,
        current: 52, // 86% -> Saturated
        trend: '+12% (7d)',
        unit: 'videos/mes'
    },
    {
        id: 'design',
        name: 'Diseño Gráfico',
        capacity: 120,
        current: 55, // 45% -> Normal
        trend: '-5% (7d)',
        unit: 'artes/mes'
    },
    {
        id: 'ia',
        name: 'Automatización IA',
        capacity: 40,
        current: 28, // 70% -> Warning
        trend: '+20% (15d)',
        unit: 'bots/mes'
    }
];

export default function CapacityOperationsCenter() {

    const getStatus = (current, capacity) => {
        const percentage = (current / capacity) * 100;
        if (percentage >= 85) return { status: 'saturated', color: 'bg-red-500', text: 'text-red-500', label: 'CRÍTICO' };
        if (percentage >= 60) return { status: 'warning', color: 'bg-orange-500', text: 'text-orange-500', label: 'PRECAUCIÓN' };
        return { status: 'normal', color: 'bg-emerald-500', text: 'text-emerald-500', label: 'ESTABLE' };
    };

    return (
        <div className="bg-[#0F0F1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Monitor de Capacidad</h3>
                        <p className="text-[10px] text-gray-400">Predicción de carga y escalamiento</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-300">Live Analysis</span>
                </div>
            </div>

            {/* Department Metrics */}
            <div className="space-y-6 z-10 flex-1">
                {DEPARTMENTS.map((dept) => {
                    const { status, color, text, label } = getStatus(dept.current, dept.capacity);
                    const percent = Math.round((dept.current / dept.capacity) * 100);

                    return (
                        <div key={dept.id}>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        {dept.name}
                                        {status === 'saturated' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                                    </h4>
                                    <p className="text-[10px] text-gray-500">
                                        Uso: {dept.current} / {dept.capacity} {dept.unit}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-black ${text}`}>{percent}%</span>
                                    <p className={`text-[9px] font-bold uppercase ${text}`}>{label}</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                                <div className={`h-full ${color} transition-all duration-1000 relative`} style={{ width: `${percent}%` }}>
                                    {status === 'saturated' && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                                </div>
                            </div>

                            {/* Prediction / Trend */}
                            <div className="mt-2 flex justify-between items-center text-[10px]">
                                <span className="text-gray-500 flex items-center gap-1">
                                    Tendencia: <strong className={dept.trend.includes('+') ? 'text-orange-400' : 'text-emerald-400'}>{dept.trend}</strong>
                                </span>
                                {status === 'saturated' && (
                                    <button className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 transition-colors">
                                        <PauseCircle className="w-3 h-3" /> Pausar Ventas
                                    </button>
                                )}
                                {status === 'warning' && (
                                    <button className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 transition-colors">
                                        <UserPlus className="w-3 h-3" /> Sugarir Contratación
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* AI Insight Footer */}
            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex gap-3">
                    <Activity className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                        <h5 className="text-xs font-bold text-purple-300">Predicción del Sistema</h5>
                        <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
                            El departamento de <strong>Video</strong> colapsará en 14 días al ritmo actual.
                            <span className="block mt-1 text-white cursor-pointer hover:underline">
                                👉 Recomendación: Activar Nodo "Sur" (Carga actual: 10%) para balanceo.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
