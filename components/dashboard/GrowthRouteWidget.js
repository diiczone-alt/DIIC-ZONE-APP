'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle, Circle, ArrowUpRight, TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { toast } from 'sonner';

const GOALS_DB = {
    1: { // Etapa 1: Presencia
        title: 'Fase 1: Presencia Solida',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        icon: Users,
        goals: [
            { id: 1, text: 'Perfil Optimizado (Bio + Link)', progress: 100, status: 'completed', target: 1, current: 1 },
            { id: 2, text: 'Publicar primeros 10 posts', progress: 70, status: 'in_progress', target: 10, current: 7 },
            { id: 3, text: 'Definir Paleta de Colores', progress: 100, status: 'completed', target: 1, current: 1 },
            { id: 4, text: 'Subir 1 Video de Presentación', progress: 0, status: 'pending', target: 1, current: 0 },
        ]
    },
    2: { // Etapa 2: Autoridad
        title: 'Fase 2: Construcción de Autoridad',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        icon: Award,
        goals: [
            { id: 5, text: 'Publicar 3 Videos Educativos', progress: 33, status: 'in_progress', target: 3, current: 1 },
            { id: 6, text: 'Conseguir 5 Testimonios', progress: 0, status: 'pending', target: 5, current: 0 },
            { id: 7, text: 'Mejorar Fotos de Perfil', progress: 100, status: 'completed', target: 1, current: 1 },
        ]
    },
    3: { // Etapa 3: Conversión
        title: 'Fase 3: Motor de Conversión',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        icon: DollarSign,
        goals: [
            { id: 8, text: 'Activar Primera Campaña Ads', progress: 50, status: 'in_progress', target: 1, current: 0.5 },
            { id: 9, text: 'Automatizar Citas (Agenda)', progress: 100, status: 'completed', target: 1, current: 1 },
            { id: 10, text: 'Responder 100% Leads en <1h', progress: 80, status: 'in_progress', target: 100, current: 80 },
        ]
    },
    4: { // Etapa 4: Escala
        title: 'Fase 4: Escala y Automatización',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        icon: TrendingUp,
        goals: [
            { id: 11, text: 'Crear Embudo de Ventas', progress: 20, status: 'in_progress', target: 100, current: 20 },
            { id: 12, text: 'Delegar Edición de Video', progress: 100, status: 'completed', target: 1, current: 1 },
            { id: 13, text: 'Lograr ROI > 3 en Campañas', progress: 0, status: 'pending', target: 3, current: 1.5 },
        ]
    },
    5: { // Etapa 5: Máximo Potencial
        title: 'Fase 5: Dominio del Mercado',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        icon: TrendingUp,
        goals: [
            { id: 14, text: 'Expansión Internacional', progress: 10, status: 'in_progress', target: 100, current: 10 },
            { id: 15, text: 'Auditoría Trimestral', progress: 0, status: 'pending', target: 1, current: 0 },
        ]
    }
};

export default function GrowthRouteWidget({ userLevel }) {
    const activeStage = GOALS_DB[userLevel] || GOALS_DB[1];

    const getStatusColor = (status) => {
        if (status === 'completed') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (status === 'in_progress') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') return CheckCircle;
        if (status === 'in_progress') return ArrowUpRight;
        return Circle;
    };

    return (
        <div className="rounded-3xl bg-[#0F0F1A] border border-white/5 relative overflow-hidden flex flex-col h-full shadow-xl">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${activeStage.bg} ${activeStage.color}`}>
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Mi Ruta de Crecimiento</h3>
                        <p className={`text-xs font-bold ${activeStage.color} mt-0.5`}>
                            {activeStage.title}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Progreso de Etapa</span>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${activeStage.bg.replace('/10', '')} ${activeStage.color.replace('text', 'bg')} w-2/3 rounded-full`}></div>
                        </div>
                        <span className="text-xs font-bold text-white">65%</span>
                    </div>
                </div>
            </div>

            {/* Goals List */}
            <div className="p-4 space-y-3">
                {activeStage.goals.map((goal) => {
                    const StatusIcon = getStatusIcon(goal.status);
                    const statusStyles = getStatusColor(goal.status);

                    return (
                        <div key={goal.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <StatusIcon className={`w-4 h-4 ${goal.status === 'completed' ? 'text-emerald-400' : goal.status === 'in_progress' ? 'text-blue-400' : 'text-gray-600'}`} />
                                    <span className={`text-sm font-medium ${goal.status === 'completed' ? 'text-gray-400 line-through decoration-emerald-500/50' : 'text-white'}`}>
                                        {goal.text}
                                    </span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${statusStyles}`}>
                                    {goal.status === 'in_progress' ? 'En Curso' : goal.status === 'completed' ? 'Listo' : 'Pendiente'}
                                </span>
                            </div>

                            {/* Progress Bar (Only for non-pending) */}
                            {goal.status !== 'pending' && (
                                <div className="ml-7 mt-1">
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                        <span>Progreso</span>
                                        <span>{goal.current} / {goal.target}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${goal.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Action */}
            <div className="p-3 border-t border-white/5 bg-white/5 flex justify-center">
                <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    VER MAPA COMPLETO <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
