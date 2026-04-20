'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Users, Briefcase, Zap,
    CreditCard, Layout, Star, DollarSign, Map as MapIcon,
    Target
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import AdminOperationalMap from '@/components/admin/AdminOperationalMap';

export default function HQDashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, getHomeRoute } = useAuth();
    const [portfolio, setPortfolio] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isHQLive, setIsHQLive] = useState(false);
    const [metrics, setMetrics] = useState({
        income: 0,
        netProfit: 0,
        pending: 0,
        risk: 0
    });

    const loadGlobalData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        try {
            console.log('[HQ] Sincronizando datos globales...');
            const [clientData, taskData, financialSum] = await Promise.all([
                agencyService.getClients(),
                agencyService.getTasks(),
                agencyService.getFinancialSummary()
            ]);
            
            if (Array.isArray(clientData)) setPortfolio(clientData);
            if (Array.isArray(taskData)) setTasks(taskData);
            
            if (financialSum?.metrics) {
                setMetrics({
                    income: financialSum.metrics.income || 0,
                    netProfit: financialSum.metrics.net_profit || 0,
                    pending: clientData?.filter(c => c.status === 'paused').length || 0,
                    risk: clientData?.filter(c => (c.priority || '').toUpperCase() === 'ALTA').length || 0
                });
            }
        } catch (err) {
            console.error('[HQ] Sync Error:', err);
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        
        if (!user || user.role !== 'ADMIN') {
            const home = getHomeRoute(user?.role);
            if (home !== '/dashboard/hq') router.push(home);
            return;
        }
        
        // 1. Initial Load (Try Cache first)
        const cached = localStorage.getItem('diic_clients');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                setPortfolio(parsed);
                setLoading(false); 
            } catch(e) {}
        }

        loadGlobalData(!!cached);

        // 2. Realtime Sync
        setIsHQLive(true);
        const hqChannel = supabase
            .channel('hq-global-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => loadGlobalData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, () => loadGlobalData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadGlobalData(true))
            .subscribe((status) => {
                setIsHQLive(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(hqChannel);
        };
    }, [user, authLoading]);

    // Consistent KPI Calculations
    const currentClients = portfolio.length;
    const clientGoal = 10;
    const goalPercentage = Math.min((currentClients / clientGoal) * 100, 100);
    const activeProjects = tasks.filter(t => t.status !== 'completed').length;

    if (loading && portfolio.length === 0) {
        return (
            <div className="min-h-screen bg-[#050511] flex flex-col items-center justify-center text-white gap-6">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div className="font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Iniciando Comando Central...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#050511] text-white font-sans selection:bg-yellow-500/30">
            <main className="p-10 max-w-[1700px] mx-auto space-y-12">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl font-black text-white tracking-tight italic uppercase">GOD <span className="text-indigo-500">MODE</span></h1>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-500 ${isHQLive ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/20 animate-pulse'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isHQLive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-red-500'}`} />
                            <span className={`text-[8px] font-black tracking-[0.2em] uppercase ${isHQLive ? 'text-emerald-500' : 'text-red-500'}`}>HQ {isHQLive ? 'LIVE' : 'OFFLINE'}</span>
                        </div>
                    </div>
                    <div>
                        <AnimatePresence>
                            {isSyncing && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl animate-pulse"
                                >
                                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Sincronización en curso</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sales Roadmap Banner */}
                <div className="bg-indigo-600 rounded-[32px] p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Meta de Validación ({clientGoal} Clientes)</h2>
                            <p className="text-indigo-100/60 text-sm mb-6 uppercase tracking-wider font-bold">Estamos al {goalPercentage.toFixed(0)}% de activar automáticamente la Fase 2 (Automatización & Escala).</p>
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
                        title="Utilidad Neta (God Mode)"
                        value={`$${(metrics.netProfit || 0).toLocaleString()}`}
                        change={`Facturación: $${(metrics.income || 0).toLocaleString()}`}
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
                        change="HQ Realtime Active"
                        icon={Activity}
                        color="text-emerald-500"
                    />
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <Target className="w-5 h-5 text-blue-500" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Validación de Mercado</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <RepBox value={`${currentClients}/${clientGoal}`} label="Clientes Objetivo" color="text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-center text-center">
                        <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-white mb-4 italic uppercase">"Transformamos <span className="text-indigo-500">atención en activos</span> reales"</h3>
                        <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest max-w-md mx-auto">Gestión globalizada de las cuentas de alto valor mediante arquitectura de vanguardia.</p>
                    </div>
                </div>

                {/* Territory Map Hidden */}
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
                    {change}
                </p>
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
