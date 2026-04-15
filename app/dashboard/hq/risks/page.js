'use client';

import { useState } from 'react';
import HQSidebar from '@/components/layout/HQSidebar';
import {
    ShieldAlert, AlertTriangle, TrendingDown,
    Users, Clock, DollarSign, Activity
} from 'lucide-react';

export default function OperationalRisksPage() {
    // Mock Data simulating the "Risk Engine"
    const [risks] = useState([
        {
            id: 1,
            type: 'Sobrecarga de Equipo',
            severity: 'Critical',
            target: 'Depto. Video',
            metric: '92% Capacidad',
            desc: 'El equipo de video no podrá tomar nuevos pedidos hasta el martes.',
            action: 'Pausar nuevos ingresos de video'
        },
        {
            id: 2,
            type: 'Baja Rentabilidad',
            severity: 'High',
            target: 'Cliente: Power Gym',
            metric: 'Margen 25%',
            desc: 'Los costos operativos superan el umbral seguro del 30%.',
            action: 'Revisar plan o renegociar fee'
        },
        {
            id: 3,
            type: 'Retraso Frecuente',
            severity: 'Medium',
            target: 'Creativo: Carlos R.',
            metric: '3 Entregas tarde',
            desc: 'Carlos ha entregado 3 proyectos fuera de plazo este mes.',
            action: 'Asignar mentoría o reducir carga'
        },
        {
            id: 4,
            type: 'Dependencia Excesiva',
            severity: 'Low',
            target: 'Cuenta: Clínica Smith',
            metric: '80% Revenue',
            desc: 'Clínica Smith representa un porcentaje riesgoso de la facturación.',
            action: 'Diversificar cartera de clientes'
        }
    ]);

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            <HQSidebar />
            <div className="pl-64">
                <header className="h-20 border-b border-white/5 flex items-center px-8 bg-[#050511]/80 backdrop-blur-xl sticky top-0 z-40">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" /> Riesgos Operativos
                    </h2>
                </header>

                <main className="p-8 max-w-[1800px] mx-auto space-y-8">
                    {/* Risk Heatmap / Matrix Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <RiskMetricCard
                            title="Nivel de Riesgo Global"
                            status="Medio"
                            color="orange"
                            icon={Activity}
                        />
                        <RiskMetricCard
                            title="Rentabilidad en Riesgo"
                            status="$2.4k / Mes"
                            color="red"
                            icon={DollarSign}
                        />
                        <RiskMetricCard
                            title="Salud del Equipo"
                            status="Estable (Video Crítico)"
                            color="yellow"
                            icon={Users}
                        />
                    </div>

                    {/* Active Risks */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider text-xs">Alertas Activas</h3>
                        {risks.map((risk) => (
                            <div key={risk.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex items-start gap-6 hover:border-white/10 transition-colors group">
                                <div className={`p-4 rounded-xl shrink-0 ${risk.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                                        risk.severity === 'High' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    <AlertTriangle className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                {risk.type}
                                            </h4>
                                            <p className="text-sm text-gray-400 font-medium">
                                                Objetivo: <span className="text-white">{risk.target}</span> • Métrica: <span className="text-white">{risk.metric}</span>
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${risk.severity === 'Critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                                risk.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {risk.severity}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-4">
                                        {risk.desc}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors border border-white/5">
                                            Acción Recomendada: {risk.action}
                                        </button>
                                        <button className="text-xs text-gray-500 hover:text-white transition-colors underline">
                                            Ignorar por ahora
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

function RiskMetricCard({ title, status, color, icon: Icon }) {
    const colors = {
        red: 'border-red-500/20 text-red-400 bg-red-500/5',
        orange: 'border-orange-500/20 text-orange-400 bg-orange-500/5',
        yellow: 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5',
    };

    return (
        <div className={`p-6 rounded-2xl bg-[#0E0E18] border ${colors[color]} flex items-center gap-4`}>
            <div className={`p-3 rounded-xl bg-white/5`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">{title}</p>
                <p className="text-xl font-black text-white">{status}</p>
            </div>
        </div>
    );
}
