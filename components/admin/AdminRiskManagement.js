'use client';

import { useState } from 'react';
import {
    Activity, ShieldAlert, AlertTriangle,
    Users, DollarSign, Award,
    Zap, TrendingUp, BarChart3,
    CheckCircle2, XCircle, Clock,
    FileText, ShieldCheck, Scale,
    Flame, Briefcase, Network,
    BrainCircuit, AlertCircle, TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminRiskManagement() {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'saturation', 'financial', 'quality', 'growth', 'legal'

    const riskKpis = [
        { label: "Carga de Trabajo", value: "84%", status: "warning", color: "yellow", icon: Activity },
        { label: "Pagos Atrasados", value: "$1,200", status: "good", color: "emerald", icon: DollarSign },
        { label: "Calidad Promedio", value: "92/100", status: "good", color: "emerald", icon: Award },
        { label: "Saturación Crítica", value: "2 Nodos", status: "critical", color: "red", icon: Flame }
    ];

    const risks = [
        {
            id: 'saturation',
            title: "Saturación del Equipo",
            risk: "Exceso de proyectos compromete la calidad.",
            status: "crítico",
            impact: "Alto",
            mitigation: "Reasignación a Nodos de apoyo / Bloqueo de ventas",
            icon: Users,
            color: "red"
        },
        {
            id: 'financial',
            title: "Riesgo Financiero",
            risk: "Cartera morosa o desbalance en costos.",
            status: "estable",
            impact: "Medio",
            mitigation: "Pago anticipado 50% / Bloqueo de servicios",
            icon: DollarSign,
            color: "emerald"
        },
        {
            id: 'dependency',
            title: "Dependencia de Talento",
            risk: "Concentración de conocimiento en una sola persona.",
            status: "en observación",
            impact: "Alto",
            mitigation: "Documentación obligatoria en Master Docs",
            icon: Network,
            color: "yellow"
        },
        {
            id: 'quality',
            title: "Caída de Calidad",
            risk: "Entregas mediocres dañan la marca DIIC ZONE.",
            status: "estable",
            impact: "Crítico",
            mitigation: "QA Nivel 3 obligatorio + Academia",
            icon: ShieldCheck,
            color: "blue"
        },
        {
            id: 'growth',
            title: "Crecimiento Descontrolado",
            risk: "Ventas por encima de la capacidad instalada.",
            status: "riesgo alto",
            impact: "Crítico",
            mitigation: "Predicción de carga con IA + Pausa de pauta",
            icon: TrendingUp,
            color: "pink"
        },
        {
            id: 'legal',
            title: "Cumplimiento Legal",
            risk: "Uso indebido de material o falta de contratos.",
            status: "protegido",
            impact: "Medio",
            mitigation: "Contratos digitales auto-gestionados",
            icon: Scale,
            color: "indigo"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* RISK HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-red-500/5 border border-red-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldAlert className="w-32 h-32 text-red-500" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-red-500" /> Mapa de Riesgos Operativos
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Sistema Inmunológico / Control de Crisis DIIC ZONE</p>
                </div>
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl relative z-10">
                    <TabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Salud Operativa" />
                    <TabBtn active={activeTab === 'matrix'} onClick={() => setActiveTab('matrix')} label="Matriz de Riesgos" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'dashboard' ? (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                    >
                        {riskKpis.map((kpi, i) => (
                            <HealthCard key={i} {...kpi} />
                        ))}

                        <div className="lg:col-span-3 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                <BarChart3 className="w-40 h-40 text-blue-500" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-400" /> Proyección de Saturación (Próximas 3 semanas)
                            </h3>
                            <div className="h-64 flex items-end gap-4">
                                <CapBar value={60} label="Semana 1" />
                                <CapBar value={85} label="Semana 2" isCritical />
                                <CapBar value={95} label="Semana 3" isCritical />
                            </div>
                            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-[11px] text-red-400 font-bold leading-relaxed">
                                    ¡ALERTA!: Riesgo de saturación total en Semana 3. Se sugiere pausar campañas de captación de nuevos clientes en Nodos Premium.
                                </p>
                            </div>
                        </div>

                        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-8">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-indigo-400" /> IA Risk Advisor
                            </h3>
                            <div className="space-y-6">
                                <AIAgentMessage
                                    text="Detectada alta dependencia en el editor Fausto R. (82% de carga). Sugiero reasignar 2 proyectos a Nodo Quito."
                                    type="action"
                                />
                                <AIAgentMessage
                                    text="Cliente 'Nova Clínica' ha superado los 15 días de morosidad. Sistema ha bloqueado el acceso a revisión de Reel 4."
                                    type="block"
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="matrix"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {risks.map(risk => (
                            <RiskDetailCard key={risk.id} risk={risk} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
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

function HealthCard({ label, value, color, icon: Icon }) {
    const statusColors = {
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
        red: "text-red-400 border-red-500/20 bg-red-500/5"
    };

    return (
        <div className={`p-8 rounded-[40px] border ${statusColors[color]} group relative overflow-hidden`}>
            <Icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</p>
            <p className="text-4xl font-black">{value}</p>
        </div>
    );
}

function CapBar({ value, label, isCritical }) {
    return (
        <div className="flex-1 flex flex-col items-center gap-4 group">
            <div className="w-full bg-white/5 rounded-2xl flex flex-col justify-end h-full overflow-hidden relative">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={`w-full ${isCritical ? 'bg-red-500' : 'bg-blue-500'} relative`}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
                </motion.div>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function AIAgentMessage({ text, type }) {
    return (
        <div className={`p-5 rounded-[24px] border ${type === 'block' ? 'bg-red-500/5 border-red-500/20' : 'bg-indigo-500/5 border-indigo-500/20'} relative group`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${type === 'block' ? 'bg-red-400 animate-pulse' : 'bg-indigo-400'}`} />
                <span className="text-[9px] font-black text-white uppercase opacity-40">Sugerencia Preventiva</span>
            </div>
            <p className="text-[10px] font-medium text-gray-300 leading-relaxed italic">"{text}"</p>
        </div>
    );
}

function RiskDetailCard({ risk }) {
    const statusColor = risk.color === 'red' ? 'text-red-400 border-red-500/30 bg-red-500/5' :
        risk.color === 'emerald' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' :
            risk.color === 'yellow' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' :
                `text-${risk.color}-400 border-${risk.color}-500/30 bg-${risk.color}-500/5`;

    return (
        <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 hover:border-white/10 transition-all group flex flex-col h-full">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 ${risk.color === 'red' ? 'text-red-500' : risk.color === 'emerald' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                <risk.icon className="w-7 h-7" />
            </div>

            <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{risk.title}</h4>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase mb-6 ${statusColor}`}>
                {risk.status}
            </div>

            <div className="space-y-6 flex-grow">
                <div>
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 items-center flex gap-1">
                        <ShieldAlert className="w-3 h-3" /> Riesgo Detectado
                    </h5>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{risk.risk}</p>
                </div>

                <div>
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 items-center flex gap-1">
                        <Zap className="w-3 h-3" /> Mitigación en Sistema
                    </h5>
                    <p className="text-xs text-indigo-400 font-black">{risk.mitigation}</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-500 uppercase">Impacto:</span>
                <span className={`text-[10px] font-black uppercase ${risk.impact === 'Crítico' || risk.impact === 'Alto' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {risk.impact}
                </span>
            </div>
        </div>
    );
}
