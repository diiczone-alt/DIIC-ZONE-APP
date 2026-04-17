'use client';

import { useState } from 'react';
import {
    Clock, Users, Activity, AlertTriangle,
    BarChart3, Zap, Rocket, UserPlus,
    DollarSign, TrendingUp, Calendar,
    CheckCircle2, AlertCircle, ChevronRight,
    Scale, Gauge, Box, LayoutPanelLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { assignTask, TEAM_DB } from '../connectivity/WorkloadBalancer';

export default function AdminWorkloadManager({ teamData = [], globalMetrics = {} }) {
    // SEMAPHORE LOGIC: 0-60 (Green), 61-80 (Yellow), 81-100 (Red), 100+ (Danger/Black)
    const getStatusColor = (load) => {
        if (load <= 60) return 'emerald';
        if (load <= 80) return 'yellow';
        if (load <= 100) return 'red';
        return 'rose'; // Colapso
    };

    const getStatusLabel = (load) => {
        if (load <= 60) return 'OPERACIÓN SANA';
        if (load <= 80) return 'PRECAUCIÓN';
        if (load <= 100) return 'SATURACIÓN';
        return 'COLAPSO INMINENTE';
    };

    const projectWeights = [
        { type: "Post Simple", weight: 1, time: "1.2h" },
        { type: "Reel Editado", weight: 2, time: "1.8h" },
        { type: "Video Médico", weight: 4, time: "4.5h" },
        { type: "Campaña Completa", weight: 6, time: "12h" },
        { type: "Producción Premium", weight: 8, time: "25h" }
    ];

    // Estado inicial de la carga (simulado con DB local)
    const [teamLoad, setTeamLoad] = useState(TEAM_DB.map(m => ({
        ...m,
        assigned: Math.round(m.capacity * (m.load / 100)), // Convertir % a horas para UI actual
        status: m.load > 90 ? 'red' : m.load > 70 ? 'yellow' : 'emerald'
    })));

    const [assignmentSuggestion, setAssignmentSuggestion] = useState(null);

    const simulateIncomingTask = (type) => {
        // Mapear tipo de proyecto a requerimientos (mock)
        const taskReqs = {
            "Reel Editado": { requiredRole: "Editor", tags: ['Reels', 'Dinámico'] },
            "Video Médico": { requiredRole: "Editor", tags: ['Corporate', 'Clean'] },
            "Campaña Completa": { requiredRole: "Filmmaker", tags: ['Cine', 'Docu'] },
            "Diseño Web": { requiredRole: "Web Dev", tags: ['React', 'Landing'] }
        };

        const task = taskReqs[type];
        if (!task) return;

        const result = assignTask(task, TEAM_DB); // Usamos DB pura para cálculo, en app real usaríamos estado actual

        if (result.status === 'success') {
            setAssignmentSuggestion({
                task: type,
                winner: result.assignedTo,
                score: result.score,
                allCandidates: result.candidates
            });
            toast.success(`Mejor candidato: ${result.assignedTo.name} (Score: ${result.score})`);
        } else {
            toast.error(`No se pudo asignar: ${result.reason}`);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 text-left">
            {/* 📊 GLOBAL CAPACITY HEADER */}
            <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Gauge className="w-40 h-40 text-indigo-500" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                            Capacidad Usada: <span className={`text-${getStatusColor(globalMetrics.globalLoad)}-500`}>{globalMetrics.globalLoad}%</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border bg-${getStatusColor(globalMetrics.globalLoad)}-500/10 text-${getStatusColor(globalMetrics.globalLoad)}-500 border-${getStatusColor(globalMetrics.globalLoad)}-500/20 uppercase`}>
                                {getStatusLabel(globalMetrics.globalLoad)}
                            </span>
                            <span className="text-gray-500 text-xs font-bold">{globalMetrics.assignedHours}h de {globalMetrics.totalCapacity}h mensuales</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 👤 CARGA POR CREATIVO (40h Base) */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[32px] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-500" /> Carga por Creativo (40h / Sem)
                        </h3>
                        <div className="flex gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <LegendItem label="0-60" color="bg-emerald-500" />
                            <LegendItem label="61-80" color="bg-yellow-500" />
                            <LegendItem label="81-100" color="bg-red-500" />
                            <LegendItem label="100+" color="bg-rose-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-12 text-[10px] font-black text-gray-500 uppercase px-4 pb-2 border-b border-white/5">
                            <div className="col-span-5 text-left">Creativo / Rol</div>
                            <div className="col-span-2 text-center">Asignado</div>
                            <div className="col-span-2 text-center">Restante</div>
                            <div className="col-span-3 text-right">Estado</div>
                        </div>
                        {teamLoad.map((member, idx) => (
                            <CreativeWorkloadCard
                                key={idx}
                                member={member}
                                isWinner={assignmentSuggestion?.winner?.id === member.id}
                                matchScore={assignmentSuggestion?.allCandidates.find(c => c.id === member.id)?.matchScore}
                            />
                        ))}
                    </div>
                </div>

                {/* ⚖️ PESO DE PROYECTOS & IA */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Scale className="w-4 h-4" /> Peso por Tipo de Proyecto
                        </h3>
                        <div className="space-y-3">
                            {projectWeights.map((pw, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xs font-bold text-gray-300">{pw.type}</div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => simulateIncomingTask(pw.type)}
                                            className="px-2 py-0.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 rounded text-[10px] font-black uppercase transition-colors"
                                        >
                                            Simular Asignación
                                        </button>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{pw.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-500/30 rounded-[32px] p-8">
                        <div className="flex items-center gap-3 text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-6">
                            <Zap className="w-4 h-4" /> Decisiones Automáticas
                        </div>
                        <div className="space-y-4">
                            <DecisionAlert
                                condition="Carga > 80%"
                                action="Bloquear Proyectos Grandes"
                                active={globalMetrics.globalLoad > 80}
                            />
                            <DecisionAlert
                                condition="Carga > 90%"
                                action="Activar Refuerzo Freelance"
                                active={globalMetrics.globalLoad > 90}
                            />
                            <DecisionAlert
                                condition="Carga < 50%"
                                action="Lanzar Promociones"
                                active={globalMetrics.globalLoad < 50}
                            />
                            <DecisionAlert
                                condition="IA Predictiva"
                                action="Saturación en 21 días"
                                active={true}
                                variant="prediction"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* AREA TRENDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AreaMiniCard label="Video" load={92} />
                <AreaMiniCard label="Diseño" load={45} />
                <AreaMiniCard label="Social Media" load={70} />
                <AreaMiniCard label="Web Dev" load={37} />
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function CreativeWorkloadCard({ member, isWinner, matchScore }) {
    const remaining = member.capacity - member.assigned;
    const colors = {
        emerald: "bg-emerald-500 text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
        yellow: "bg-yellow-500 text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
        red: "bg-red-500 text-red-500 border-red-500/20 bg-red-500/10",
        rose: "bg-rose-500 text-rose-500 border-rose-500/20 bg-rose-500/10",
    };

    // Si hay un status en member que no matchee las keys, fallback a emerald, o calcular dinámico
    const theme = colors[member.status] || colors.emerald;
    const barTheme = theme.split(' ')[0]; // bg-emerald-500

    return (
        <motion.div
            whileHover={{ x: 5 }}
            className={`grid grid-cols-12 items-center p-4 rounded-2xl border transition-all text-sm group ${isWinner ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-[1.02]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
        >
            <div className="col-span-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${theme.split(' ')[1]}`}>
                    {member.name.substring(0, 1)}
                </div>
                <div>
                    <div className="font-black text-white uppercase text-xs">{member.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase flex gap-2">
                        {member.role}
                        {matchScore !== undefined && (
                            <span className={`text-[9px] px-1 rounded ${isWinner ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                Match: {matchScore}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-span-2 text-center font-bold text-gray-300">{member.assigned}h</div>
            <div className={`col-span-2 text-center font-bold ${remaining < 0 ? 'text-red-500' : 'text-gray-500'}`}>{remaining}h</div>
            <div className="col-span-3 text-right">
                <div className="flex flex-col items-end">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border mb-2 ${theme}`}>
                        {member.load}%
                    </span>
                    <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(member.load, 100)}%` }}
                            className={`h-full rounded-full ${barTheme}`}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function DecisionAlert({ condition, action, active, variant }) {
    return (
        <div className={`p-4 rounded-2xl border ${active ? 'bg-white/5 border-white/10 opacity-100' : 'opacity-30'} flex items-center justify-between text-left`}>
            <div>
                <div className="text-[9px] text-gray-500 font-black uppercase mb-1">{condition}</div>
                <div className={`text-xs font-black ${variant === 'prediction' ? 'text-indigo-400' : 'text-white'} uppercase`}>{action}</div>
            </div>
            {active && (
                <div className={`w-2 h-2 rounded-full ${variant === 'prediction' ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-500'}`} />
            )}
        </div>
    );
}

function AreaMiniCard({ label, load }) {
    const getC = (l) => {
        if (l <= 60) return 'emerald-500';
        if (l <= 80) return 'yellow-500';
        if (l <= 100) return 'red-500';
        return 'rose-500';
    };
    const color = getC(load);

    return (
        <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/10 text-left">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                <span className={`text-xs font-black text-${color}`}>{load}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-${color}`} style={{ width: `${load}%` }} />
            </div>
        </div>
    );
}

function LegendItem({ label, color }) {
    return (
        <div className="flex items-center gap-2 mr-3">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span>{label}</span>
        </div>
    );
}
