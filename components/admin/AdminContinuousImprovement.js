'use client';

import { useState } from 'react';
import {
    BrainCircuit, TrendingUp, Zap,
    Clock, DollarSign, Award,
    MessageSquare, ShieldCheck, Activity,
    ChevronRight, ArrowUpRight,
    Search, Filter, Plus,
    FileText, Lightbulb, Settings2,
    CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminContinuousImprovement() {
    const [activeTab, setActiveTab] = useState('insights'); // 'insights', 'processes', 'profitability', 'training'

    const metrics = [
        { label: "Oportunidades", value: "0", sub: "Detectadas hoy", icon: Lightbulb, color: "yellow" },
        { label: "ROI Optimizado", value: "0%", sub: "Últimos 30 días", icon: TrendingUp, color: "emerald" },
        { label: "Procesos en Mejora", value: "0", sub: "Flujos activos", icon: RefreshCw, color: "blue" },
        { label: "Tasa de Error", value: "0%", sub: "vs mes anterior", icon: ShieldCheck, color: "indigo" }
    ];

    const recommendations = [];

    const handleAction = (id, action) => {
        toast.success(`Acción executada: ${action} para recomendación #${id}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-yellow-500/5 border border-yellow-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BrainCircuit className="w-32 h-32 text-yellow-500" />
                </div>
                <div className="relative z-10 text-left">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-yellow-500" /> Sistema de Mejora Continua
                    </h2>
                    <p className="text-gray-400 text-sm font-medium italic">"El cerebro de auto-optimización de DIIC ZONE"</p>
                </div>
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl relative z-10 shrink-0">
                    <TabBtn active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} label="Insights IA" />
                    <TabBtn active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} label="Auditoría" />
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-[#0A0A12] border border-white/5 rounded-[32px] p-6 hover:border-white/10 transition-all group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-${m.color}-500/10 text-${m.color}-400`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-black text-white mb-1">{m.value}</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{m.label}</p>
                        <p className={`text-[9px] font-bold mt-2 ${m.color === 'emerald' ? 'text-emerald-400' : 'text-gray-400 opacity-60'}`}>{m.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECOMMENDATIONS TABLE */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 relative overflow-hidden text-left">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                                <Zap className="w-5 h-5 text-yellow-500" /> Panel de Optimización
                            </h3>
                            <p className="text-xs text-gray-500 font-medium">Sugerencias basadas en el análisis de flujo real</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recommendations.length === 0 && (
                            <div className="py-20 text-center text-gray-500 font-bold italic border border-white/5 rounded-[32px]">
                                No se han detectado brechas de optimización en el flujo actual.
                            </div>
                        )}
                        {recommendations.map(rec => (
                            <RecommendationCard key={rec.id} rec={rec} onAction={handleAction} />
                        ))}
                    </div>
                </div>

                {/* DATA SOURCES & INTELLIGENCE */}
                <div className="space-y-8">
                    <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-8 text-left">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Settings2 className="w-4 h-4 text-indigo-400" /> Motores Activos
                        </h3>
                        <div className="space-y-4">
                            <EngineStatus label="Auditoría Interna" status="Analizando..." />
                            <EngineStatus label="Rendimiento de Talento" status="Actualizado" isGood />
                            <EngineStatus label="ROI Predictivo" status="Simulando..." />
                            <EngineStatus label="Feedback Consumidor" status="Procesando" />
                        </div>
                    </div>

                    <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 text-left">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <BrainCircuit className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Next-Gen Agent</h4>
                                <p className="text-[10px] text-gray-500 font-bold">Optimización Autónoma</p>
                            </div>
                        </div>
                        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 mb-6">
                            <p className="text-xs text-gray-400 italic leading-relaxed">
                                "Analizando patrones de rendimiento... Esperando datos operativos suficientes para generar sugerencias autónomas."
                            </p>
                        </div>
                        <button className="w-full py-4 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                            Evaluar Inversión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {label}
        </button>
    );
}

function EngineStatus({ label, status, isGood }) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] font-bold text-gray-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase ${isGood ? 'text-emerald-400' : 'text-indigo-400 animate-pulse'}`}>
                    {status}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${isGood ? 'bg-emerald-500' : 'bg-indigo-500 pulse'}`} />
            </div>
        </div>
    );
}

function RecommendationCard({ rec, onAction }) {
    return (
        <motion.div
            whileHover={{ x: 10 }}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-[32px] bg-white/5 border border-white/5 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all text-left"
        >
            <div className="md:col-span-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">{rec.area}</span>
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase ${rec.impact === 'Crítico' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    Impacto {rec.impact}
                </div>
            </div>

            <div className="md:col-span-6 space-y-2">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic">"{rec.issue}"</p>
                </div>
                <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-white font-bold leading-relaxed">{rec.suggestion}</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <Award className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-400">{rec.benefit}</span>
                </div>
            </div>

            <div className="md:col-span-3 flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onAction(rec.id, 'Implementar')}
                    className="w-full py-2 bg-white text-black text-[9px] font-black uppercase rounded-xl hover:scale-105 active:scale-95 transition-all"
                >
                    Implementar
                </button>
                <button
                    onClick={() => onAction(rec.id, 'Agendar Tarea')}
                    className="w-full py-2 bg-white/10 text-white text-[9px] font-black uppercase rounded-xl hover:bg-white/20 active:scale-95 transition-all"
                >
                    Agendar Tarea
                </button>
            </div>
        </motion.div>
    );
}
