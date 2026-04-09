'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, Briefcase, Zap,
    CreditCard, Layout, Star, DollarSign, Map as MapIcon
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import AdminOperationalMap from '@/components/admin/AdminOperationalMap';

export default function HQDashboardPage() {
    const [portfolio, setPortfolio] = useState([]);
    const [team, setTeam] = useState([]);

    useEffect(() => {
        const loadGlobalData = async () => {
            const clients = await agencyService.getClients();
            const teamData = await agencyService.getTeam();
            setPortfolio(clients);
            setTeam(teamData);
        };
        loadGlobalData();
    }, []);
    return (
        <div className="bg-[#050511] text-white font-sans selection:bg-yellow-500/30">
            <main className="p-10 max-w-[1700px] mx-auto space-y-12">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">HQ <span className="text-indigo-500">Phase 1</span></h1>
                        <p className="text-gray-500 mt-2 font-medium">Enfoque: Cierre y Validación de Mercado.</p>
                    </div>
                </div>

                {/* Sales Roadmap Banner (OBLIGATORIO PHASE 1) */}
                <div className="bg-indigo-600 rounded-[32px] p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Meta de Validación (5 - 10 Clientes)</h2>
                            <p className="text-indigo-100/60 text-sm mb-6">Al alcanzar esta meta, activaremos automáticamente la Fase 2 (Automatización & Escala).</p>
                            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden mb-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '45%' }}
                                    transition={{ duration: 1.5 }}
                                    className="h-full bg-white shadow-lg"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                                <span>0 Clientes</span>
                                <span>4.5 / 10 Clientes</span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Próximo Hito</p>
                            <p className="text-3xl font-black text-white">Fase 2</p>
                        </div>
                    </div>
                </div>

                {/* Top Stats - 4 Units */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Ingresos Mensuales"
                        value="$45,280"
                        change="+18%"
                        icon={DollarSign}
                        color="text-yellow-500"
                    />
                    <MetricCard
                        title="Usuarios Totales"
                        value="1,204"
                        change="84 Activos hoy"
                        icon={Users}
                        color="text-indigo-400"
                    />
                    <MetricCard
                        title="Proyectos Activos"
                        value="32"
                        change="12 en Post-producción"
                        icon={Briefcase}
                        color="text-purple-400"
                    />
                    <MetricCard
                        title="Estado del Sistema"
                        value="99.9%"
                        change="Uptime (Últimos 30 días)"
                        icon={Activity}
                        color="text-emerald-500"
                    />
                </div>

                {/* Middle Section: Sales Stats Refined */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Creative Reputation - Recalibrated for Sales */}
                    <div className="lg:col-span-1 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <Users className="w-5 h-5 text-blue-500" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Validación de Mercado</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <RepBox value="5/10" label="Clientes Objetivo" color="text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-center text-center">
                        <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-white mb-4 italic">"No construyo perfecto, <span className="text-indigo-500">construyo lo que vende</span>"</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">Enfoque absoluto en el cierre y la entrega de valor real antes de escalar sistemas complejos.</p>
                    </div>
                </div>

                {/* Territory Map Hidden (OBLIGATORIO PHASE 1) */}
                <div className="pt-10 border-t border-white/5 text-center py-20 bg-white/[0.01] rounded-[40px]">
                    <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                        <MapIcon className="w-12 h-12 text-gray-500" />
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Módulo de Expansión (FASE 2)</h3>
                            <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">Sincronizará al alcanzar 10 clientes activos.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

function MetricCard({ title, value, change, icon: Icon, color }) {
    return (
        <div className="bg-[#0A0A1F] border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{title}</span>
                <Icon className={`w-10 h-10 opacity-10 group-hover:opacity-20 transition-all absolute top-6 right-6 ${color}`} />
            </div>
            <div className="space-y-2">
                <span className="text-4xl font-black text-white block">{value}</span>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    {change.includes('+') && <span className="w-3 h-3 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[8px] font-black">↑</span>}
                    {change}
                </p>
            </div>
        </div>
    );
}

function LoadBar({ label, value, status, color }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-gray-400 tracking-[0.2em]">{label}</span>
                <span className="text-[10px] font-black tracking-widest font-mono text-gray-500">
                    <span className={status === 'TIGHT' ? 'text-amber-500' : 'text-emerald-500'}>{value}% - {status}</span>
                </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${color}`}
                />
            </div>
            <div className="flex justify-between text-[8px] font-black text-gray-700 uppercase tracking-widest">
                <span>0 CP</span>
                <span>{label === 'WEB' ? '40 CP' : '100 CP'}</span>
            </div>
        </div>
    );
}

function RepBox({ value, label, color }) {
    return (
        <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
            <span className={`text-5xl font-black mb-2 ${color}`}>{value}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
        </div>
    );
}
