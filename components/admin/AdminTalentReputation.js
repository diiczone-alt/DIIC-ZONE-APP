'use client';

import { useState, useEffect } from 'react';
import {
    Trophy, Star, Clock,
    MessageSquare, ShieldCheck,
    TrendingUp, AlertCircle,
    UserCheck, BadgeCheck,
    Zap, Award, Activity,
    Search, Filter, BrainCircuit,
    ArrowUpRight, Target, Users, User,
    CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { talentService } from '@/services/talentService';

export default function AdminTalentReputation() {
    const [talent, setTalent] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Fetch from Service
        const data = talentService.getCreatives().map(c => ({
            ...c,
            // Map Service logic to UI expected props if needed, or use directly
            // Service: level (1-5), levelInfo { name: 'Elite', ... }
            // UI expects 'level' string key for the style map.
            levelKey: getLevelKey(c.level),
            metrics: { quality: 90, time: 85, comms: 88, eff: 92, const: 89, complexity: 85 } // Mocked granulars for now if service doesn't have them
        })).sort((a, b) => b.score - a.score);

        setTalent(data);
        setStats(talentService.getSystemHealth());
    }, []);

    const getLevelKey = (levelNum) => {
        switch (levelNum) {
            case 5: return 'elite';
            case 4: return 'senior';
            case 3: return 'profesional';
            case 2: return 'intermedio';
            default: return 'junior';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left pb-10">
            {/* ... Header stays same ... */}
            <div className="bg-gradient-to-r from-purple-500/10 to-[#0A0A12] border border-purple-500/20 p-8 rounded-[32px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Trophy className="w-24 h-24 text-purple-500" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <BadgeCheck className="w-7 h-7 text-purple-500" /> Sistema de Reputación de Creativos
                        </h2>
                        <p className="text-gray-400 text-sm max-w-xl">
                            Datos en tiempo real del <strong>TalentService</strong>. Evaluación basada en: Calidad (30%), Puntualidad (25%), Correcciones (15%) y más.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 🏆 TALENT RANKING */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[32px] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Users className="w-6 h-6 text-purple-400" /> Clasificación de Talento Interno
                        </h3>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-gray-500 uppercase">
                                Promedio: <span className="text-white">{stats?.avgScore || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-12 text-[10px] font-black text-gray-500 uppercase px-4 pb-2 border-b border-white/5">
                            <div className="col-span-5">Creativo / Especialidad</div>
                            <div className="col-span-2 text-center">Score SR</div>
                            <div className="col-span-3 text-center">Nivel</div>
                            <div className="col-span-2 text-right">Acción</div>
                        </div>
                        {talent.map((person) => (
                            <TalentRow key={person.id} person={person} />
                        ))}
                    </div>
                </div>

                {/* 🤖 AUTOMATIONS & ALERTS */}
                <div className="space-y-6">
                    <div className="bg-[#0A0A12] border border-white/10 rounded-[32px] p-8">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Métricas de Evaluación (SR)</h3>
                        <div className="space-y-4">
                            <MetricRule label="Entrega a Tiempo" weight="30%" color="blue" />
                            <MetricRule label="Calidad Aprobada" weight="25%" color="purple" />
                            <MetricRule label="Nivel Técnico" weight="20%" color="indigo" />
                            <MetricRule label="Correcciones" weight="15%" color="orange" />
                            <MetricRule label="Comunicación" weight="10%" color="emerald" />
                        </div>
                    </div>

                    <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-[32px] p-8">
                        <div className="flex items-center gap-3 text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">
                            <BrainCircuit className="w-4 h-4" /> Gestión IA de Talento
                        </div>
                        <div className="space-y-4">
                            {stats?.lowPerformersCount > 0 && (
                                <TalentAlert
                                    type="danger"
                                    title="Alerta de Rendimiento"
                                    desc={`${stats.lowPerformersCount} creativo(s) por debajo del umbral de calidad.`}
                                />
                            )}
                            <TalentAlert
                                type="elite"
                                title="Top Performer"
                                desc={`${stats?.topPerformer?.name || 'N/A'} lidera el ranking actual.`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TalentRow({ person }) {
    const levels = {
        elite: { label: "Elite", icon: Trophy, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
        senior: { label: "Senior", icon: Award, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
        profesional: { label: "Profesional", icon: Star, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
        intermedio: { label: "Intermedio", icon: UserCheck, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        junior: { label: "Junior", icon: User, color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" },
    };

    const level = levels[person.levelKey] || levels.junior;
    const Icon = level.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.01, x: 5 }}
            className="grid grid-cols-12 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
        >
            <div className="col-span-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${level.bg} flex items-center justify-center font-black ${level.color}`}>
                    {person.name.substring(0, 1)}
                </div>
                <div>
                    <div className="text-sm font-black text-white uppercase">{person.name}</div>
                    <div className={`text-[10px] font-bold uppercase truncate ${person.status === 'BUSY' ? 'text-red-400' : 'text-gray-500'}`}>
                        {person.role} • {person.status === 'BUSY' ? 'Ocupado' : 'Disponible'}
                    </div>
                </div>
            </div>
            <div className="col-span-2 text-center">
                <div className={`text-xl font-black ${person.score > 80 ? 'text-white' : person.score > 60 ? 'text-gray-300' : 'text-gray-500'}`}>{person.score}</div>
                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Score SR</div>
            </div>
            <div className="col-span-3 text-center">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${level.bg} ${level.color} inline-flex items-center gap-1.5`}>
                    <Icon className="w-3 h-3" /> {level.label}
                </span>
            </div>
            <div className="col-span-2 flex justify-end">
                <button
                    onClick={() => toast.info(`Abriendo expediente de ${person.name}`)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

function MetricRule({ label, weight, color }) {
    const colors = {
        purple: "bg-purple-500",
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        orange: "bg-orange-500",
        pink: "bg-pink-500",
        indigo: "bg-indigo-500",
    };

    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${colors[color]}`} />
                <span className="text-gray-400 font-bold">{label}</span>
            </div>
            <span className="font-black text-white">{weight}</span>
        </div>
    );
}

function TalentAlert({ type, title, desc }) {
    const styles = {
        elite: "border-yellow-500/20 bg-yellow-500/5 text-yellow-500",
        warning: "border-orange-500/20 bg-orange-500/5 text-orange-500",
        danger: "border-red-500/20 bg-red-500/5 text-red-500"
    };

    const icons = {
        elite: Trophy,
        warning: AlertTriangle,
        danger: AlertCircle
    };

    const StatusIcon = icons[type];

    return (
        <div className={`p-4 rounded-2xl border ${styles[type]} flex items-start gap-3`}>
            <StatusIcon className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
                <div className="text-[10px] font-black uppercase mb-0.5">{title}</div>
                <div className="text-[9px] text-gray-400 font-medium leading-tight">{desc}</div>
            </div>
        </div>
    );
}
