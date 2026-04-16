'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, Briefcase, Zap,
    CreditCard, Layout, Star, DollarSign, Map as MapIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminOperationalMap from '@/components/admin/AdminOperationalMap';

export default function HQDashboardPage() {
    const [portfolio, setPortfolio] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGlobalData = async () => {
            setLoading(true);
            try {
                const [clientsRes, tasksRes] = await Promise.all([
                    supabase.from('clients').select('*'),
                    supabase.from('tasks').select('*')
                ]);

                if (clientsRes.data) setPortfolio(clientsRes.data);
                if (clientsRes.error) console.warn('[HQ] Clients fetch error:', clientsRes.error.message);

                if (tasksRes.data) setTasks(tasksRes.data);
                if (tasksRes.error) console.warn('[HQ] Tasks fetch error:', tasksRes.error.message);
            } catch (err) {
                console.error('[HQ] Unexpected exception in loadGlobalData:', err);
            } finally {
                setLoading(false);
            }
        };
        loadGlobalData();
    }, []);

    const realFacturacion = portfolio.reduce((acc, c) => acc + (Number(c.price) || 0), 0);
    const activeProjects = tasks.filter(t => t.status !== 'completed').length;
    const clientGoal = 10;
    const currentClients = portfolio.length;
    const goalPercentage = Math.min((currentClients / clientGoal) * 100, 100);

    if (loading) {
        return <div className="min-h-screen bg-[#050511] flex items-center justify-center text-white font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando HQ...</div>;
    }

    return (
        <div className="bg-[#050511] text-white font-sans selection:bg-yellow-500/30">
            <main className="p-10 max-w-[1700px] mx-auto space-y-12">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">HQ <span className="text-indigo-500">Executive HQ</span></h1>
                        <p className="text-gray-500 mt-2 font-medium">Enfoque: Cierre y Gestión de Producción Global.</p>
                    </div>
                </div>

                {/* Sales Roadmap Banner (OBLIGATORIO PHASE 1) */}
                <div className="bg-indigo-600 rounded-[32px] p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Meta de Validación ({clientGoal} Clientes)</h2>
                            <p className="text-indigo-100/60 text-sm mb-6">Estamos al {goalPercentage.toFixed(0)}% de activar automáticamente la Fase 2 (Automatización & Escala).</p>
                            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden mb-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${goalPercentage}%` }}
                                    transition={{ duration: 1.5 }}
                                    className="h-full bg-white shadow-lg"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                                <span>0 Clientes</span>
                                <span>{currentClients} / {clientGoal} Clientes</span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Estado de Escalado</p>
                            <p className="text-3xl font-black text-white">{currentClients >= 10 ? 'FASE 2' : 'FASE 1'}</p>
                        </div>
                    </div>
                </div>

                {/* Top Stats - 4 Units */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Facturación Proyectada"
                        value={`$${realFacturacion.toLocaleString()}`}
                        change="+12% mes actual"
                        icon={DollarSign}
                        color="text-yellow-500"
                    />
                    <MetricCard
                        title="Aliados Activos"
                        value={currentClients.toString()}
                        change={`${portfolio.filter(c => c.status === 'active').length} Operativos`}
                        icon={Users}
                        color="text-indigo-400"
                    />
                    <MetricCard
                        title="Carga de Producción"
                        value={activeProjects.toString()}
                        change={`${tasks.filter(t => t.priority === 'high').length} Urgentes`}
                        icon={Briefcase}
                        color="text-purple-400"
                    />
                    <MetricCard
                        title="Salud de Operaciones"
                        value="99.9%"
                        change="Sincronización Supabase OK"
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
                                <RepBox value={`${currentClients}/${clientGoal}`} label="Clientes Objetivo" color="text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-center text-center">
                        <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-white mb-4 italic">"Transformamos <span className="text-indigo-500">atención en activos</span> reales"</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">Gestión globalizada de las cuentas de alto valor mediante arquitectura de vanguardia.</p>
                    </div>
                </div>

                {/* Territory Map Hidden (OBLIGATORIO PHASE 1) */}
                <div className="pt-10 border-t border-white/5 text-center py-20 bg-white/[0.01] rounded-[40px]">
                    <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                        <MapIcon className="w-12 h-12 text-gray-500" />
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Módulo de Expansión (Mapa Operativo)</h3>
                            <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">Activado para el monitoreo de logística en tiempo real.</p>
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
