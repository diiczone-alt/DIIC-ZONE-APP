'use client';

import { useState } from 'react';
import {
    Trophy, Star, Clock,
    MessageSquare, ShieldCheck,
    TrendingUp, AlertCircle,
    UserCheck, BadgeCheck,
    Search, Filter, BrainCircuit,
    ArrowUpRight, Target, Users,
    Zap, DollarSign, Award, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminTalentPayments from './AdminTalentPayments';
import AdminTalentTraining from './AdminTalentTraining';

export default function AdminTeamReputation({ teamData = [], activeRisks = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('reputation'); // 'reputation', 'payments', 'training', 'incentives'

    // Map real team to visualization format
    const creatives = teamData.map(member => {
        // Simple logic to map score to a level based on load and role for now, 
        // until we have a real reputation score in DB
        const baseScore = member.load > 90 ? 10 : (member.load > 70 ? 14 : 18);
        const level = baseScore >= 18 ? "ÉLITE" : (baseScore >= 14 ? "PRO" : "ACTIVO");
        
        return {
            id: member.id,
            name: member.name,
            role: member.role,
            points: { 
                quality: Math.floor(baseScore / 4.5), 
                timing: Math.floor(baseScore / 6), 
                corrections: 3, 
                prof: 3, 
                client: 4 
            },
            score: baseScore,
            level: level,
            history: `Activo con ${member.activeTasksCount} tareas asignadas.`,
            color: level === "ÉLITE" ? "purple" : (level === "PRO" ? "blue" : "emerald"),
            load: member.load
        };
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-purple-500/5 border border-purple-500/10 p-6 rounded-3xl">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <Users className="w-7 h-7 text-purple-500" /> Gestión de Talento
                    </h2>
                    <p className="text-gray-400 text-sm">Control de calidad, pagos y formación para la red creativa</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl mr-4">
                        <button
                            onClick={() => setActiveTab('reputation')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'reputation' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Reputación
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'payments' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Contratos & Pagos
                        </button>
                        <button
                            onClick={() => setActiveTab('training')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'training' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Formación
                        </button>
                        <button
                            onClick={() => setActiveTab('incentives')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'incentives' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Incentivos
                        </button>
                    </div>
                    {activeTab === 'reputation' && (
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar creativo..."
                                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-purple-500/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'reputation' ? (
                    <motion.div
                        key="reputation"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        {/* MAIN DASHBOARD */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* LIST OF CREATIVES */}
                            <div className="lg:col-span-3 bg-[#0A0A12] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-400" /> Dashboard del Equipo
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-7 text-[10px] font-bold text-gray-500 uppercase px-4 pb-2 border-b border-white/5 text-center">
                                        <div className="col-span-2 text-left">Creativo</div>
                                        <div>Calidad</div>
                                        <div>Tiempo</div>
                                        <div>Corr.</div>
                                        <div>Score</div>
                                        <div className="text-right">Nivel</div>
                                    </div>

                                    {creatives.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((c, i) => (
                                        <CreativeRow key={i} data={c} />
                                    ))}
                                </div>
                            </div>

                            {/* RULES & STATUS */}
                            <div className="space-y-6">
                                <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6">
                                    <h3 className="text-sm font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                                        <Target className="w-4 h-4 text-purple-500" /> Niveles de Acceso
                                    </h3>
                                    <div className="space-y-4">
                                        <LevelInfo level="ÉLITE" desc="Proyectos Premium + Clientes Top" color="purple" icon={Trophy} />
                                        <LevelInfo level="PRO" desc="Sistemas & Campañas Importantes" color="blue" icon={BadgeCheck} />
                                        <LevelInfo level="ACTIVO" desc="Producción Regular" color="emerald" icon={UserCheck} />
                                        <LevelInfo level="DESARROLLO" desc="Proyectos Simples / Apoyo" color="yellow" icon={Clock} />
                                    </div>
                                </div>

                                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BrainCircuit className="w-5 h-5 text-indigo-400" />
                                        <span className="text-xs font-black text-indigo-300 uppercase">IA Smart Suggest</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-gray-400 leading-relaxed italic">
                                            "El sistema de inteligencia sugerirá ascensos basados en la consistencia de entrega y score IQ."
                                        </div>
                                        <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 text-[11px] text-red-500/60 leading-relaxed italic">
                                            "Las alertas de riesgo de saturación se activarán cuando la carga de un miembro supere el 90%."
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SCORING RULES LEGEND */}
                        <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-8">
                            <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">Métrica Detallada de Reputación (Max 16 pts)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                <RuleItem label="Calidad" icon={Star} points="1-4 pts" />
                                <RuleItem label="Puntualidad" icon={Clock} points="0-3 pts" />
                                <RuleItem label="Correcciones" icon={MessageSquare} points="0-3 pts" />
                                <RuleItem label="Profesionalismo" icon={ShieldCheck} points="1-3 pts" />
                                <RuleItem label="Satisfacción" icon={UserCheck} points="1-3 pts" />
                            </div>
                        </div>
                    </motion.div>
                ) : activeTab === 'payments' ? (
                    <motion.div
                        key="payments"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <AdminTalentPayments />
                    </motion.div>
                ) : activeTab === 'training' ? (
                    <motion.div
                        key="training"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminTalentTraining />
                    </motion.div>
                ) : (
                    <motion.div
                        key="incentives"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <AdminIncentivesView creatives={creatives} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- INCENTIVES VIEW COMPONENTS ---

function AdminIncentivesView({ creatives }) {
    const incentives = [
        { title: "Prioridad de Proyectos", icon: Zap, level: "ÉLITE", benefit: "Fila 1 de asignación", color: "purple" },
        { title: "Bono por Rendimiento", icon: DollarSign, level: "ÉLITE / PRO", benefit: "+10% / +5% extra", color: "pink" },
        { title: "Prioridad de Pago", icon: Clock, level: "ÉLITE", benefit: "Cobro Inmediato (Grupo 1)", color: "blue" },
        { title: "Acceso Especial", icon: Star, level: "ÉLITE / PRO", benefit: "Campañas Corporativas", color: "emerald" },
    ];

    return (
        <div className="space-y-6">
            {/* INCENTIVES SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {incentives.map((inc, i) => (
                    <div key={i} className={`bg-[#0A0A12] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-${inc.color}-500/30 transition-all`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${inc.color}-500/5 rounded-full blur-2xl group-hover:bg-${inc.color}-500/10 transition-all`} />
                        <inc.icon className={`w-8 h-8 text-${inc.color}-500 mb-4`} />
                        <div className="text-sm font-black text-white mb-1">{inc.title}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Para: {inc.level}</div>
                        <div className={`text-xs font-bold text-${inc.color}-400`}>{inc.benefit}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ACTIVE BONUS ELIGIBILITY */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-pink-500" /> Creativos Aptos para Bonos (Este Mes)
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 text-[10px] font-bold text-gray-500 uppercase px-4 pb-2 border-b border-white/5">
                            <div>Creativo</div>
                            <div>Nivel</div>
                            <div>Cumplimiento</div>
                            <div className="text-right">Bono Sugerido</div>
                        </div>
                        {creatives.filter(c => c.score >= 12).map((c, i) => (
                            <div key={i} className="grid grid-cols-4 items-center p-4 rounded-xl bg-white/5 border border-transparent hover:border-pink-500/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full bg-${c.color}-500/20 flex items-center justify-center font-bold text-${c.color}-400 text-xs`}>{c.name.substring(0, 1)}</div>
                                    <div className="text-xs font-bold text-white uppercase">{c.name}</div>
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase">{c.level}</div>
                                <div>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="text-[9px] text-gray-500 font-bold uppercase mt-1">Consistency (3m)</div>
                                </div>
                                <div className="text-right font-black text-emerald-400">+10% Fee</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GROWTH ENGINE */}
                <div className="bg-purple-600/5 border border-purple-500/20 rounded-3xl p-6">
                    <h3 className="text-sm font-black text-purple-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Escalado de Tarifas
                    </h3>
                    <div className="space-y-4">
                        <ScalingRule time="3 meses" benefit="Aumento 5% base" icon={ArrowUpRight} />
                        <ScalingRule time="6 meses" benefit="Dirección Creativa Jr" icon={Activity} />
                        <ScalingRule time="1 año" benefit="Líder de Nodo/Equipo" icon={ShieldCheck} />
                    </div>

                    <div className="mt-8 p-4 bg-[#0A0A12] border border-white/5 rounded-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <BrainCircuit className="w-4 h-4 text-pink-400" />
                            <span className="text-[10px] font-black text-white uppercase">Growth Alerta</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed italic">
                            "Las sugerencias de formación aparecerán aquí basadas en las áreas de mejora detectadas en QA."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScalingRule({ time, benefit, icon: Icon }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="p-2 rounded bg-purple-500/10 text-purple-400">
                <Icon className="w-3 h-3" />
            </div>
            <div>
                <div className="text-[9px] font-black text-gray-500 uppercase">{time}</div>
                <div className="text-xs font-bold text-white leading-tight">{benefit}</div>
            </div>
        </div>
    );
}

// --- HELPER COMPONENTS ---

function CreativeRow({ data }) {
    const levelColors = {
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        red: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01, x: 5 }}
            className="grid grid-cols-7 items-center p-4 rounded-xl bg-white/5 border border-transparent hover:border-purple-500/20 hover:bg-purple-500/5 transition-all text-sm group"
        >
            <div className="col-span-2 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-${data.color}-500/20 flex items-center justify-center font-black text-${data.color}-400`}>
                    {data.name.substring(0, 1)}
                </div>
                <div>
                    <div className="font-bold text-white group-hover:text-purple-400 transition-colors uppercase text-xs">{data.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold">{data.role}</div>
                </div>
            </div>

            <ScoreDot value={data.points.quality} max={4} color="purple" />
            <ScoreDot value={data.points.timing} max={3} color="blue" />
            <ScoreDot value={data.points.corrections} max={3} color="orange" />

            <div className="text-center">
                <div className="text-lg font-black text-white">{data.score}</div>
                <div className="text-[9px] text-gray-500 uppercase font-bold">Total</div>
            </div>

            <div className="text-right">
                <span className={`px-2 py-1 rounded text-[10px] font-black border ${levelColors[data.color]}`}>
                    {data.level}
                </span>
            </div>
        </motion.div>
    );
}

function ScoreDot({ value, max, color }) {
    const dots = Array.from({ length: max }, (_, i) => i < value);
    return (
        <div className="flex justify-center gap-1">
            {dots.map((active, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${active ? `bg-${color}-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]` : 'bg-white/10'}`} />
            ))}
        </div>
    );
}

function LevelInfo({ level, desc, color, icon: Icon }) {
    const colors = {
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    };
    return (
        <div className="flex gap-3 items-start group">
            <div className={`p-2 rounded-lg border ${colors[color]} group-hover:scale-110 transition-transform`}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${colors[color].split(' ')[0]}`}>{level}</div>
                <div className="text-[10px] text-gray-500 leading-tight">{desc}</div>
            </div>
        </div>
    );
}

function RuleItem({ label, icon: Icon, points }) {
    return (
        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group">
            <Icon className="w-5 h-5 text-purple-400 mx-auto mb-2 group-hover:scale-125 transition-transform" />
            <div className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{label}</div>
            <div className="text-[10px] text-gray-500 font-bold">{points}</div>
        </div>
    );
}
