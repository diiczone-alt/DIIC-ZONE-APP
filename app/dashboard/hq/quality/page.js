'use client';

import { useState } from 'react';
import HQSidebar from '@/components/layout/HQSidebar';
import {
    ShieldCheck, Star, AlertTriangle, CheckCircle,
    Search, Award, Clock
} from 'lucide-react';

export default function QualityHubPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white">
            <HQSidebar />
            <div className="pl-64">
                <header className="h-20 border-b border-white/5 flex items-center px-8 bg-[#050511]/80 backdrop-blur-xl sticky top-0 z-40">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" /> Quality Hub (Control Interno)
                    </h2>
                </header>

                <main className="p-8 max-w-[1800px] mx-auto space-y-8">

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <QualityStat label="NPS Promedio" value="9.2/10" sub="+0.4 vs mes pasado" icon={Star} color="yellow" />
                        <QualityStat label="Tasa de Error" value="4.8%" sub="Meta: <5%" icon={AlertTriangle} color="red" />
                        <QualityStat label="Entregas a Tiempo" value="96%" sub="Excelente" icon={Clock} color="blue" />
                        <QualityStat label="Auditorías QH" value="24" sub="Esta semana" icon={ShieldCheck} color="emerald" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* 1. Creative Performance (Hidden Scoring) */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Award className="w-5 h-5 text-purple-400" /> Ranking de Creativos (Interno)
                                </h3>
                                <button className="text-xs text-gray-500 hover:text-white transition-colors">Ver Detalles</button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Creativo</th>
                                        <th className="px-6 py-4">Rol</th>
                                        <th className="px-6 py-4 text-center">Score QH</th>
                                        <th className="px-6 py-4 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    <CreativeRow name="Carlos R." role="Editor" score={94} status="Top Talent" />
                                    <CreativeRow name="Ana G." role="Diseño" score={88} status="Estable" />
                                    <CreativeRow name="Pedro L." role="Filmmaker" score={72} status="Riesgo" />
                                    <CreativeRow name="Sofia M." role="Community" score={91} status="Top Talent" />
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Audit Queue (Checklists) */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" /> Auditoría Pendiente
                                </h3>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white">3 Pendientes</span>
                            </div>
                            <div className="flex-1 p-6 space-y-4">
                                <AuditCard
                                    project="Reels Dr. Smith"
                                    creative="Carlos R."
                                    stage="Edición Final"
                                    checkpoints={['Audio Limpio', 'Branding Correcto', 'Ritmo Dinámico']}
                                />
                                <AuditCard
                                    project="Campaña Black Friday"
                                    creative="Ana G."
                                    stage="Diseño"
                                    checkpoints={['Specs Técnicos', 'Ortografía', 'Guía de Estilo']}
                                />
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

function QualityStat({ label, value, sub, icon: Icon, color }) {
    const colors = {
        yellow: 'text-yellow-400 bg-yellow-500/10',
        red: 'text-red-400 bg-red-500/10',
        blue: 'text-blue-400 bg-blue-500/10',
        emerald: 'text-emerald-400 bg-emerald-500/10',
    };
    return (
        <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
                <p className={`text-[10px] mt-1 ${color === 'red' ? 'text-red-400' : 'text-green-400'}`}>{sub}</p>
            </div>
        </div>
    );
}

function CreativeRow({ name, role, score, status }) {
    const getScoreColor = (s) => {
        if (s >= 90) return 'text-emerald-400';
        if (s >= 80) return 'text-blue-400';
        return 'text-yellow-400';
    };

    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 font-bold text-white">{name}</td>
            <td className="px-6 py-4 text-gray-400">{role}</td>
            <td className={`px-6 py-4 text-center font-black text-lg ${getScoreColor(score)}`}>{score}</td>
            <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${status === 'Top Talent' ? 'bg-emerald-500/10 text-emerald-400' :
                        status === 'Riesgo' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                    {status}
                </span>
            </td>
        </tr>
    );
}

function AuditCard({ project, creative, stage, checkpoints }) {
    return (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/30 transition-all group">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{project}</h4>
                    <p className="text-xs text-gray-500">Creativo: {creative} • Fase: {stage}</p>
                </div>
                <button className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors">
                    Auditar
                </button>
            </div>
            <div className="space-y-1">
                {checkpoints.map((cp, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                        {cp}
                    </div>
                ))}
            </div>
        </div>
    );
}
