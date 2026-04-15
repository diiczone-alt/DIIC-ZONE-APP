'use client';

import { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, Star, Zap, User } from 'lucide-react';
import { talentService } from '@/services/talentService';

export default function CreativesDashboard() {
    const [creatives, setCreatives] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setCreatives(talentService.getCreatives());
        setStats(talentService.getSystemHealth());
    }, []);

    const getLevelBadge = (levelInfo) => {
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-current ${levelInfo.color} bg-white/5`}>
                {levelInfo.name}
            </span>
        );
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 70) return 'text-blue-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-red-400';
    };

    if (!stats) return <div className="p-10 text-center text-gray-500">Cargando Sistema de Talento...</div>;

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-8">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Admin Zone</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Reputación de Creativos</h2>
                    <p className="text-gray-400 text-sm">Monitor de rendimiento y asignación automática.</p>
                </div>

                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-3xl font-black text-white">{stats.avgScore}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Score Promedio</div>
                    </div>
                    <div className="w-px bg-white/10 h-10"></div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-red-400">{stats.lowPerformersCount}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">En Riesgo</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden bg-white/5 rounded-2xl border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/10">
                            <th className="p-4 font-bold">Creativo</th>
                            <th className="p-4 font-bold">Rol</th>
                            <th className="p-4 font-bold text-center">Nivel</th>
                            <th className="p-4 font-bold text-right">Score</th>
                            <th className="p-4 font-bold text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {creatives.map((c) => (
                            <tr key={c.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                <td className="p-4 font-medium text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                        {c.name.charAt(0)}
                                    </div>
                                    {c.name}
                                    {c.score < 50 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                    {c.score > 90 && <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                </td>
                                <td className="p-4 text-gray-400 capitalize">{c.role}</td>
                                <td className="p-4 text-center">
                                    {getLevelBadge(c.levelInfo)}
                                </td>
                                <td className={`p-4 text-right font-black text-lg ${getScoreColor(c.score)}`}>
                                    {c.score}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${c.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="text-xs font-mono text-gray-400">{c.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-center">
                <Shield className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                    <h4 className="text-white font-bold text-sm">Algoritmo de Asignación Activo</h4>
                    <p className="text-xs text-gray-400">
                        El sistema está asignando automáticamente tareas de nivel "Pro" solo a creativos con Score {'>'} 85.
                    </p>
                </div>
            </div>

        </div>
    );
}
