'use client';

import { useState, useEffect } from 'react';
import {
    Flame, Star, Scale, Clock,
    TrendingUp, Shield, Zap,
    ArrowUpRight, ListOrdered,
    User, DollarSign, Award,
    CheckCircle2, AlertTriangle,
    GripVertical, FastForward, Timer
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { prioritizationService } from '@/services/prioritizationService';

export default function AdminClientPrioritization() {
    // Simulation of DB Clients + Service Calculation
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suggestedQueue, setSuggestedQueue] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Clients
                const { data: dbClients, error: clientErr } = await supabase
                    .from('clients')
                    .select('*')
                    .neq('status', 'inactive');
                
                if (clientErr) throw clientErr;

                // 2. Fetch Pending Tasks
                const { data: dbTasks, error: taskErr } = await supabase
                    .from('tasks')
                    .select('*')
                    .neq('status', 'done');

                if (taskErr) throw taskErr;

                // 3. Process Scoring
                const processed = dbClients.map(client => {
                    // Find most urgent task for this client
                    const clientTasks = dbTasks.filter(t => t.client === client.id);
                    const mostUrgentTask = clientTasks.sort((a, b) => {
                        if (!a.deadline) return 1;
                        if (!b.deadline) return -1;
                        return new Date(a.deadline) - new Date(b.deadline);
                    })[0];

                    const result = prioritizationService.calculateScore(
                        { 
                            plan: client.plan || 'BASIC', 
                            history: client.history || 'GOOD' // Future: could fetch from a metadata/profile table
                        },
                        { 
                            type: mostUrgentTask?.format || 'CONTENT', 
                            deadline: mostUrgentTask?.deadline 
                        }
                    );

                    return {
                        ...client,
                        income: `$${(client.price || 0).toLocaleString()}`,
                        pp: result.score,
                        level: result.tier === 'HIGH' ? 'high' : result.tier === 'MEDIUM' ? 'medium' : 'low',
                        isCritical: result.score >= 90,
                        topTask: mostUrgentTask
                    };
                }).sort((a, b) => b.pp - a.pp);

                setClients(processed);

                // 4. Build Suggested Queue
                const queue = processed
                    .filter(c => c.topTask)
                    .map(c => ({
                        client: c.name,
                        task: c.topTask.title,
                        time: c.topTask.deadline ? new Date(c.topTask.deadline).toLocaleDateString() : 'Pendiente',
                        level: c.level
                    }))
                    .slice(0, 10);
                
                setSuggestedQueue(queue);

            } catch (err) {
                console.error('Error fetching prioritization data:', err);
                toast.error('Error al cargar datos de priorización');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left pb-10">

            {/* 🧠 PRIORITIZATION LOGIC HEADER */}
            <div className="bg-gradient-to-r from-red-500/10 to-[#0A0A12] border border-red-500/20 p-8 rounded-[32px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Scale className="w-24 h-24 text-red-500" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Scale className="w-7 h-7 text-red-500" /> Motor de Priorización Inteligente
                        </h2>
                        <p className="text-gray-400 text-sm max-w-xl">
                            El sistema asigna un **Puntaje de Prioridad (PP)** basado en ingresos, tipo de plan, urgencia y potencial estratégico. Decide quién va primero en la cola de producción.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <LogicBadge label="Ingreso" weight="30%" />
                        <LogicBadge label="Plan" weight="20%" />
                        <LogicBadge label="Urgencia" weight="15%" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📊 RANKING AUTOMÁTICO */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[32px] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <ListOrdered className="w-6 h-6 text-indigo-400" /> Ranking por Puntaje de Prioridad (PP)
                        </h3>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Actualizado hace 5m</span>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                                <Timer className="w-8 h-8 text-indigo-500 animate-spin" />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Calculando Prioridades...</p>
                            </div>
                        ) : (
                            clients.map((client, index) => (
                                <RankingRow key={client.id} client={client} rank={index + 1} />
                            ))
                        )}
                        {!loading && clients.length === 0 && (
                            <div className="py-20 text-center text-gray-500 font-bold uppercase text-xs">No hay clientes activos</div>
                        )}
                    </div>
                </div>

                {/* 🤖 ACCIONES ESTRATÉGICAS */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8"> Cola de Producción Sugerida</h3>
                        <div className="space-y-4">
                            {suggestedQueue.length > 0 ? (
                                <>
                                    {suggestedQueue.filter(i => i.time !== 'Pospuesto').map((item, idx) => (
                                        <QueueItem key={idx} {...item} />
                                    ))}
                                    {suggestedQueue.filter(i => i.time === 'Pospuesto').length > 0 && (
                                        <div className="pt-4 mt-4 border-t border-white/10 opacity-40">
                                            {suggestedQueue.filter(i => i.time === 'Pospuesto').map((item, idx) => (
                                                <QueueItem key={idx} {...item} />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-[10px] text-gray-500 font-bold uppercase py-10 text-center">No hay tareas pendientes</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-[32px] p-8">
                        <div className="flex items-center gap-3 text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">
                            <Zap className="w-4 h-4" /> DiiC IA Decision Hub
                        </div>
                        <p className="text-xs text-indigo-200/70 leading-relaxed italic mb-6">
                            "Saturación de carga detectada (85%). He reordenado la cola de producción priorizando a los clientes <strong className="text-white">Críticos y High</strong>. Los proyectos de nivel Bajo han sido reprogramados para mañana 09:00 AM."
                        </p>
                        <button
                            onClick={() => toast.success("Equipos notificados de la nueva prioridad")}
                            className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                        >
                            Confirmar & Notificar Equipo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function RankingRow({ client, rank }) {
    const levelStyles = {
        critical: { icon: Flame, text: "text-red-500", bg: "bg-red-500/10 border-red-500/20", label: "Prioridad Crítica" },
        high: { icon: Star, text: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Prioridad Alta" },
        medium: { icon: Scale, text: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", label: "Prioridad Media" },
        low: { icon: Clock, text: "text-gray-500", bg: "bg-white/5 border-white/5", label: "Prioridad Baja" },
    };

    const style = levelStyles[client.level];
    const Icon = style.icon; // Just in case we use it later

    return (
        <motion.div
            whileHover={{ scale: 1.01, x: 5 }}
            className="grid grid-cols-12 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
        >
            <div className="col-span-1 text-center font-black text-gray-700 group-hover:text-indigo-500 transition-colors">#{rank}</div>
            <div className="col-span-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center font-black ${style.text}`}>
                    {client.name.substring(0, 1)}
                </div>
                <div>
                    <div className="text-sm font-black text-white uppercase">{client.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">{client.plan} • {client.income}</div>
                </div>
            </div>
            <div className="col-span-2 text-center">
                <div className={`text-xl font-black ${style.text}`}>{client.pp}</div>
                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Score PP</div>
            </div>
            <div className="col-span-3 text-center">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${style.bg} ${style.text}`}>
                    {style.label}
                </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
                <button
                    onClick={() => toast.info(`Calculando ruta crítica para ${client.name}...`)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                    <FastForward className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

function QueueItem({ client, task, time, level }) {
    const levelColors = {
        critical: "bg-red-500",
        high: "bg-yellow-500",
        medium: "bg-blue-500",
        low: "bg-gray-600"
    };

    return (
        <div className="flex items-center gap-4 group">
            <GripVertical className="w-4 h-4 text-gray-700 group-hover:text-gray-400 cursor-grab" />
            <div className={`w-1.5 h-10 rounded-full ${levelColors[level]} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
            <div className="flex-1">
                <div className="text-[10px] font-black text-white uppercase truncate">{client}</div>
                <div className="text-[9px] text-gray-500 font-bold">{task}</div>
            </div>
            <div className="text-[10px] font-black text-gray-400 text-right">
                {time}
            </div>
        </div>
    );
}

function LogicBadge({ label, weight }) {
    return (
        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-center">
            <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">{label}</div>
            <div className="text-xs font-black text-white">{weight}</div>
        </div>
    );
}
