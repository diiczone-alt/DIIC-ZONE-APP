'use client';

import { useState } from 'react';
import {
    Trophy, Star, Target,
    ChevronRight, Search, Filter,
    CheckCircle2, Circle, Zap,
    TrendingUp, Rocket, Award,
    MoreVertical, User, Briefcase
} from 'lucide-react';
import AdminGoalValidation from './AdminGoalValidation';
import AdminClientAIHub from './AdminClientAIHub';
import { calculateClientHealth } from '../connectivity/ClientHealthEngine';
import { analyzeClientGrowth, detectUpsellOpportunities } from '../connectivity/ClientGrowthEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminClientEvolution() {
    const [selectedClient, setSelectedClient] = useState(null);
    const [detailTab, setDetailTab] = useState('goals'); // 'goals' | 'ai'

    if (selectedClient) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <button
                        onClick={() => setSelectedClient(null)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" /> Volver a Cartera
                    </button>

                    <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <button
                            onClick={() => setDetailTab('goals')}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${detailTab === 'goals' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            Hoja de Ruta (Metas)
                        </button>
                        <button
                            onClick={() => setDetailTab('ai')}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${detailTab === 'ai' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            Cerebro de Marca (IA)
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={detailTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {detailTab === 'goals' ? (
                            <AdminGoalValidation />
                        ) : (
                            <AdminClientAIHub client={selectedClient} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    const clients = [
        { id: 1, name: "Clínica Dental A", level: 4, progress: 85, niche: "Corporativo", status: "Madura", alerts: 0, healthData: { activity: 95, metaCompletion: 90, roi: 85, toolUsage: 80, approvals: 90, payments: 100 }, metrics: { followerGrowth: 0.05, engagementRate: 0.03, leadVolume: 800, salesRoi: 2.5, currentLevel: 4 } },
        { id: 2, name: "Empresa Tech B", level: 3, progress: 45, niche: "Empresa", status: "En Crecimiento", alerts: 2, healthData: { activity: 60, metaCompletion: 50, roi: 65, toolUsage: 40, approvals: 50, payments: 80 }, metrics: { followerGrowth: 0.02, engagementRate: 0.01, leadVolume: 100, salesRoi: 1.5, currentLevel: 3 } },
        { id: 3, name: "Restaurante C (Ready)", level: 2, progress: 95, niche: "Emprendedor", status: "Próximo Salto", alerts: 1, healthData: { activity: 85, metaCompletion: 95, roi: 70, toolUsage: 80, approvals: 90, payments: 90 }, metrics: { followerGrowth: 0.18, engagementRate: 0.08, leadVolume: 180, salesRoi: 4.0, currentLevel: 2 } }, // Ready for upgrade
        { id: 4, name: "Startup D", level: 1, progress: 30, niche: "Marca Personal", status: "Inicio", alerts: 0, healthData: { activity: 90, metaCompletion: 30, roi: 50, toolUsage: 70, approvals: 80, payments: 100 }, metrics: { followerGrowth: 0.10, engagementRate: 0.04, leadVolume: 20, salesRoi: 2.0, currentLevel: 1 } },
        { id: 5, name: "Inmobiliaria E", level: 4, progress: 20, niche: "Empresa", status: "Estable", alerts: 1, healthData: { activity: 40, metaCompletion: 20, roi: 30, toolUsage: 20, approvals: 10, payments: 40 }, metrics: { followerGrowth: 0.01, engagementRate: 0.01, leadVolume: 500, salesRoi: 1.2, currentLevel: 4 } },
    ];

    const getLevelColor = (lvl) => {
        const colors = ["emerald", "yellow", "orange", "blue", "purple"];
        return colors[lvl - 1] || "gray";
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Trophy className="w-32 h-32 text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-indigo-400" /> Evolución de Cartera
                    </h2>
                    <p className="text-gray-400 text-sm font-medium italic">"Gestión Estratégica de Madurez Digital DIIC ZONE"</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 py-2">
                        <Search className="w-4 h-4 text-gray-500 mr-2" />
                        <input type="text" placeholder="Buscar cliente..." className="bg-transparent border-none outline-none text-xs text-white" />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <Filter className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* CLIENTS GRID */}
            <div className="grid grid-cols-1 gap-4">
                {clients.map(client => (
                    <motion.div
                        key={client.id}
                        whileHover={{ x: 10 }}
                        className="bg-[#0A0A12] border border-white/5 rounded-[32px] p-6 grid grid-cols-12 items-center gap-6 group hover:border-white/20 transition-all"
                    >
                        {(() => {
                            const health = calculateClientHealth(client.healthData);
                            const growth = analyzeClientGrowth(client.metrics); // Analyze growth
                            return (
                                <>
                                    <div className="col-span-3 flex items-center gap-4">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-2xl bg-${getLevelColor(client.level)}-500/10 flex items-center justify-center`}>
                                                <User className={`w-6 h-6 text-${getLevelColor(client.level)}-400`} />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0A0A12] ${health.styles.bg.replace('/10', '')} ${health.status === 'red' ? 'bg-red-500' : health.status === 'yellow' ? 'bg-yellow-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                                                {client.name}
                                                {growth.status === 'upgrade_ready' && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="px-1.5 py-0.5 rounded-full bg-indigo-500 text-[8px] text-white flex items-center gap-1 shadow-lg shadow-indigo-500/20"
                                                    >
                                                        <Rocket className="w-2.5 h-2.5" /> UPGRADE
                                                    </motion.div>
                                                )}
                                            </h4>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{client.niche}</span>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}

                        <div className="col-span-3 text-center">
                            <div className="flex justify-center -space-x-2">
                                {[1, 2, 3, 4, 5].map(l => (
                                    <div
                                        key={l}
                                        className={`w-8 h-8 rounded-full border-4 border-[#0A0A12] flex items-center justify-center text-[10px] font-black ${l <= client.level ? `bg-${getLevelColor(client.level)}-500 text-black` : 'bg-white/5 text-gray-700'}`}
                                    >
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2 block">Nivel Actual</span>
                        </div>

                        <div className="col-span-3 px-8">
                            <div className="flex justify-between text-[10px] font-black text-gray-500 tracking-widest mb-2">
                                <span>PROGRESO LVL {client.level + 1}</span>
                                <span className="text-white">{client.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-${getLevelColor(client.level)}-500`}
                                    style={{ width: `${client.progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 text-right flex flex-col items-end justify-center gap-2">
                            {(() => {
                                const health = calculateClientHealth(client.healthData);
                                const growth = analyzeClientGrowth(client.metrics);

                                // Si está listo para upgrade, mostramos eso con prioridad
                                if (growth.status === 'upgrade_ready') {
                                    return (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.success(`Sugerencia enviada: ${growth.recommendation.detail}`);
                                                }}
                                                className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-indigo-500/50 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ml-auto"
                                            >
                                                <Rocket className="w-3 h-3" /> {growth.recommendation.action}
                                            </button>
                                            <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">{growth.recommendation.detail}</span>
                                        </>
                                    );
                                }

                                return (
                                    <>
                                        {client.alerts > 0 && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-[9px] font-black text-red-500 uppercase">{client.alerts} ALERTAS</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.success(`Iniciando: ${health.recommendation.action} para ${client.name}`);
                                            }}
                                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-white/10 ${health.recommendation.btnColor} text-white shadow-lg transition-all hover:scale-105 active:scale-95`}
                                        >
                                            {health.recommendation.action}
                                        </button>
                                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">{health.recommendation.msg}</span>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="col-span-1 flex justify-end">
                            <button
                                onClick={() => setSelectedClient(client)}
                                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* STRATEGIC INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InsightCard
                    title="Potencial de Upgrade"
                    value="12 Clientes"
                    desc="Listos para dar el salto al Nivel 4 (Autoridad)."
                    icon={TrendingUp}
                    color="indigo"
                />
                <InsightCard
                    title="Nivel Promedio Cartera"
                    value="2.8"
                    desc="Tendencia positiva. +0.4 vs mes anterior."
                    icon={Star}
                    color="yellow"
                />
                <InsightCard
                    title="Nuevos Desbloqueables"
                    value="8 Servicios"
                    desc="Habilitados esta semana por madurez del cliente."
                    icon={Zap}
                    color="emerald"
                />
            </div>
        </div>
    );
}

function InsightCard({ title, value, desc, icon: Icon, color }) {
    const colors = {
        indigo: "text-indigo-400 bg-indigo-500/10",
        yellow: "text-yellow-400 bg-yellow-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10"
    };

    return (
        <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 text-left group hover:border-white/20 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</h4>
            <div className="text-3xl font-black text-white mb-4">{value}</div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed italic">"{desc}"</p>
        </div>
    );
}
