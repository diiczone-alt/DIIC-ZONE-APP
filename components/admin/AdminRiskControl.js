'use client';

import { useState } from 'react';
import {
    ShieldAlert, Users, Briefcase,
    Zap, BarChart3, Clock,
    AlertTriangle, Octagon, CheckCircle2,
    ChevronRight, Info, Search,
    Filter, MoreVertical, Terminal,
    Activity, ArrowUpRight, Ban,
    MessageSquare, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRiskControl({ risks = [], stats: globalMetrics = {} }) {
    const [filter, setFilter] = useState('all');

    const alerts = risks.map(r => ({
        id: Math.random(),
        category: r.category,
        severity: r.severity,
        title: r.severity === 'critical' ? `CRÍTICO: ${r.message}` : r.message,
        msg: r.description || r.message, // Fallback to message
        impact: r.category === 'creative' ? 'Riesgo de retraso en entregas por saturación' : (r.category === 'project' ? 'Incumplimiento de cronograma' : (r.category === 'client' ? 'Desconexión del cliente detectada' : 'Afectación operativa general')),
        action: r.category === 'creative' ? 'Reasignar / Reforzar' : (r.category === 'project' ? 'Llamar a Cliente/Agencia' : 'Intervención Directa'),
        color: r.severity === 'critical' ? 'red' : 'yellow',
        icon: r.category === 'creative' ? Zap : (r.category === 'project' ? Briefcase : Users)
    }));

    const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.category === filter);

    const riskStats = [
        { label: 'Amenazas Críticas', val: risks.filter(r => r.severity === 'critical').length, color: 'red' },
        { label: 'Alertas Totales', val: risks.length, color: 'yellow' },
        { label: 'Saturación Promedio', val: `${globalMetrics.globalLoad || 0}%`, color: 'blue' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left pb-16">
            {/* HUD HEADER */}
            <div className="bg-[#0A0A12] border border-red-500/20 p-10 rounded-[40px] relative overflow-hidden shadow-2xl shadow-red-500/5">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <ShieldAlert className="w-64 h-64 text-red-500" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Risk Intelligence</span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Centro de Rescate</h2>
                        <p className="text-gray-500 font-bold italic text-sm">"Donde la dirección de DIIC ZONE neutraliza crisis antes de que ocurran."</p>
                    </div>

                    <div className="flex gap-4">
                        {riskStats.map((s, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[32px] min-w-[140px] text-center backdrop-blur-md">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">{s.label}</span>
                                <span className={`text-3xl font-black text-${s.color}-500`}>{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-4 px-4">
                {['all', 'client', 'project', 'creative', 'operation', 'results'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'}`}
                    >
                        {f === 'all' ? 'Ver Todo' : f}
                    </button>
                ))}
            </div>

            {/* ALERTS GRID */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAlerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -100 }}
                            className={`bg-[#0A0A12] border border-${alert.color}-500/20 rounded-[40px] p-10 flex flex-col lg:flex-row items-start lg:items-center gap-10 group hover:border-${alert.color}-500/40 transition-all relative overflow-hidden`}
                        >
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-${alert.color}-500/5 blur-3xl rounded-full -mr-32 -mt-32`} />

                            <div className={`w-20 h-20 rounded-[30px] bg-${alert.color}-500/10 border border-${alert.color}-500/20 flex items-center justify-center shrink-0`}>
                                <alert.icon className={`w-10 h-10 text-${alert.color}-400`} />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{alert.title}</h4>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-${alert.color}-500/20 bg-${alert.color}-500/10 text-${alert.color}-400`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-3xl">
                                    {alert.msg}
                                </p>
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-gray-700" />
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">IMPACTO: <span className="text-white">{alert.impact}</span></span>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full lg:w-auto mt-6 lg:mt-0 relative z-10">
                                <button className="flex-1 lg:flex-none px-10 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all">
                                    Ignorar
                                </button>
                                <button className={`flex-1 lg:flex-none px-10 py-5 bg-${alert.color}-500 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-${alert.color}-500/20 flex items-center justify-center gap-3`}>
                                    {alert.action} <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ANALYTICS PREVIEW FOOTER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-10 space-y-8">
                    <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Salud Operativa por Departamento</h5>
                    <div className="space-y-6">
                        {[
                            { dep: 'Edición de Vídeo', level: 85, color: 'emerald' },
                            { dep: 'Diseño Creativo', level: 40, color: 'red' },
                            { dep: 'CM & Estrategia', level: 65, color: 'yellow' }
                        ].map((d, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white">{d.dep}</span>
                                    <span className={`text-${d.color}-500`}>{d.level}% CAPACIDAD</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${d.color}-500`} style={{ width: `${d.level}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[40px] p-10 flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <RefreshCcw className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Modo Inteligencia Activo</h4>
                        <p className="text-xs text-gray-500 font-bold italic">"Analizando 48 variables de riesgo en tiempo real."</p>
                    </div>
                    <button className="px-10 py-5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-indigo-500/20">
                        Generar Reporte de Crisis
                    </button>
                </div>
            </div>
        </div>
    );
}
