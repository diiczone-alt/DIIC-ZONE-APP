'use client';

import { CheckCircle2, Clock, PlayCircle, Image, PenTool, Layout } from 'lucide-react';

export default function ProductionStats({ kpis }) {
    // Default values if data hasn't loaded
    const stats = kpis || {
        videos_edited: 12,
        arts_approved: 18,
        copywriting_tasks: 24,
        web_updates: 3,
        efficiency_score: 95
    };

    const STAT_ITEMS = [
        { label: 'Videos Editados', value: stats.videos_edited, icon: PlayCircle, color: 'text-orange-400' },
        { label: 'Artes Aprobados', value: stats.arts_approved, icon: Image, color: 'text-blue-400' },
        { label: 'Copywritings', value: stats.copywriting_tasks, icon: PenTool, color: 'text-pink-400' },
        { label: 'Web Updates', value: stats.web_updates, icon: Layout, color: 'text-indigo-400' }
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Producción del Mes
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {STAT_ITEMS.map((kpi, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <kpi.icon className={`w-6 h-6 mb-2 ${kpi.color}`} />
                        <span className="text-2xl font-bold text-white">{kpi.value}</span>
                        <span className="text-xs text-gray-400">{kpi.label}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Eficiencia de Flujo</h4>

                <div className="relative pt-6 pb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-2 absolute top-0 w-full font-medium">
                        <span>Inicio</span>
                        <span>Entrega</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full bg-blue-500/50 w-[20%]" title="Guion"></div>
                        <div className="h-full bg-orange-500/50 w-[30%]" title="Grabación"></div>
                        <div className="h-full bg-purple-500/50 w-[40%]" title="Edición"></div>
                        <div className="h-full bg-green-500 w-[10%]" title="Aprobado"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500/50"></div> Estrategia</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500/50"></div> Rodaje</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500/50"></div> Post-Prod</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Listo</div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-sm text-green-300 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Tasa de Aprobación
                    </span>
                    <span className="text-xl font-bold text-green-400">
                        {stats.efficiency_score}%
                    </span>
                </div>
            </div>
        </div>
    );
}
