'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Users, Briefcase, Zap,
    CreditCard, Layout, Star, DollarSign, Map as MapIcon,
    Target, Lock, Cpu, Server
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';

const AdminOperationalMap = dynamic(() => import('@/components/admin/AdminOperationalMap'), {
    ssr: false,
    loading: () => (
        <div className="bg-[#050511] border border-white/5 rounded-[40px] min-h-[600px] flex items-center justify-center text-center p-10">
            <div className="space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Cargando Mapa Operativo...</div>
            </div>
        </div>
    )
});

// Geographic Mapping Helper for Ecuador Cities
const CITY_COORDS = {
    'QUITO': [-0.1820, -78.4680],
    'GUAYAQUIL': [-2.1710, -79.9224],
    'SANTO DOMINGO': [-0.2520, -79.1730],
    'MANTA': [-0.9680, -80.7090],
    'CUENCA': [-2.9001, -79.0059],
    'LOJA': [-3.9931, -79.2042],
    'AMBATO': [-1.2491, -78.6168],
    'PORTOVIEJO': [-1.0546, -80.4544],
    'MACHALA': [-3.2581, -79.9553],
    'IBARRA': [0.3517, -78.1222],
    'RIOBAMBA': [-1.6731, -78.6483],
    'ESMERALDAS': [0.9682, -79.6517],
    'QUEVEDO': [-1.0286, -79.4635],
};

const getCoordsForCity = (city) => {
    if (!city) return [-0.1820, -78.4680]; // Default to Quito
    const normalized = city.toUpperCase().trim();
    return CITY_COORDS[normalized] || [-0.1820, -78.4680];
};

export default function HQDashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, getHomeRoute } = useAuth();
    const [portfolio, setPortfolio] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isHQLive, setIsHQLive] = useState(false);
    const [metrics, setMetrics] = useState({
        income: 0,
        netProfit: 0,
        pending: 0,
        risk: 0
    });
    const [milestones, setMilestones] = useState({
        fase1_rbac: false,
        fase1_sync: false,
        fase2_imprenta: false,
        fase2_n8n: false
    });

    const loadGlobalData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        try {
            console.log('[HQ] Sincronizando datos globales...');
            const [clientData, taskData, financialSum, teamData, profilesRes, branchesRes, automationsRes] = await Promise.all([
                agencyService.getClients(),
                agencyService.getTasks(),
                agencyService.getFinancialSummary(),
                agencyService.getTeam().catch(err => {
                    console.error('[HQ] Error fetching team, returning empty:', err);
                    return [];
                }),
                supabase.from('profiles').select('role').limit(1).catch(err => {
                    console.error('[HQ] Profiles query failed:', err);
                    return { error: err };
                }),
                supabase.from('branch_offices').select('*').catch(err => {
                    console.error('[HQ] Branch offices query failed:', err);
                    return { error: err };
                }),
                supabase.from('automations').select('id', { count: 'exact', head: true }).catch(err => {
                    console.error('[HQ] Automations query failed:', err);
                    return { error: err };
                })
            ]);
            
            if (Array.isArray(clientData)) setPortfolio(clientData);
            if (Array.isArray(taskData)) setTasks(taskData);
            if (Array.isArray(teamData)) setTeam(teamData);
            
            // Auto-verify all milestones based on real database presence
            const rbacOk = !profilesRes.error;
            const syncOk = !branchesRes.error;
            const imprentaOk = !!(branchesRes.data && branchesRes.data.length > 0);
            const n8nOk = !!(automationsRes.count > 0);

            setMilestones({
                fase1_rbac: rbacOk,
                fase1_sync: syncOk,
                fase2_imprenta: imprentaOk,
                fase2_n8n: n8nOk
            });

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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => loadGlobalData(true))
            .subscribe((status) => {
                setIsHQLive(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(hqChannel);
        };
    }, [user, authLoading]);

    // Dynamic Phase Calculations based on Client Portfolio size & verified milestones
    const currentClients = portfolio.filter(c => c.status === 'active').length;
    
    const f1Complete = currentClients >= 10 && milestones.fase1_rbac && milestones.fase1_sync;
    const f2Complete = f1Complete && currentClients >= 20 && milestones.fase2_imprenta && milestones.fase2_n8n;

    let activePhase = 1;
    let clientGoal = 10;
    let phaseTitle = "Meta de Validación";
    let phaseDesc = "";
    let goalPercentage = 0;

    if (!f1Complete) {
        activePhase = 1;
        clientGoal = 10;
        phaseTitle = `Meta de Validación (Fase 1)`;
        
        const missingDetails = [];
        if (currentClients < 10) missingDetails.push(`faltan ${10 - currentClients} clientes`);
        if (!milestones.fase1_rbac) missingDetails.push("seguridad RBAC pendiente");
        if (!milestones.fase1_sync) missingDetails.push("sincronización realtime pendiente");
        
        const detailsStr = missingDetails.length > 0 ? ` (${missingDetails.join(', ')})` : '';
        phaseDesc = `Fase 1 activa. Requisitos para subir a Fase 2 pendientes${detailsStr}.`;
        
        const completedTasks = [
            currentClients >= 10,
            milestones.fase1_rbac,
            milestones.fase1_sync
        ].filter(Boolean).length;
        goalPercentage = Math.min((completedTasks / 3) * 100, 100);
    } else if (f1Complete && !f2Complete) {
        activePhase = 2;
        clientGoal = 20;
        phaseTitle = `Meta de Escalado (Fase 2)`;
        
        const missingDetails = [];
        if (currentClients < 20) missingDetails.push(`faltan ${20 - currentClients} clientes`);
        if (!milestones.fase2_imprenta) missingDetails.push("imprenta directa pendiente");
        if (!milestones.fase2_n8n) missingDetails.push("webhooks n8n pendientes");
        
        const detailsStr = missingDetails.length > 0 ? ` (${missingDetails.join(', ')})` : '';
        phaseDesc = `Fase 2 de Automatización & Escala activa. Requisitos para Fase 3 pendientes${detailsStr}.`;
        
        const completedTasks = [
            currentClients >= 20,
            milestones.fase2_imprenta,
            milestones.fase2_n8n
        ].filter(Boolean).length;
        goalPercentage = Math.min((completedTasks / 3) * 100, 100);
    } else {
        activePhase = 3;
        clientGoal = 50;
        phaseTitle = `Fase 3: Expansión Territorial`;
        phaseDesc = `Ecosistema de alta producción operando en su fase máxima de escala a nivel nacional.`;
        goalPercentage = Math.min(((currentClients - 20) / 30) * 100, 100);
    }

    const activeProjects = tasks.filter(t => t.status !== 'completed').length;

    // Map clients and team to include correct coordinates for Ecuador
    const mappedClients = portfolio.map((c, idx) => ({
        ...c,
        coords: c.coords && Array.isArray(c.coords) && c.coords.length === 2
            ? c.coords
            : getCoordsForCity(c.city || 'Santo Domingo', idx)
    }));

    const mappedTeam = team.map((t, idx) => ({
        ...t,
        coords: t.coords && Array.isArray(t.coords) && t.coords.length === 2
            ? t.coords
            : getCoordsForCity(t.city || 'Quito', idx + 10)
    }));

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
                            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">{phaseTitle} ({clientGoal} Clientes)</h2>
                            <p className="text-indigo-100/60 text-sm mb-6 uppercase tracking-wider font-bold">{phaseDesc}</p>
                            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden mb-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${goalPercentage}%` }}
                                    transition={{ duration: 1.5 }}
                                    className="h-full bg-white shadow-lg"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                                <span>{activePhase === 1 ? '0' : activePhase === 2 ? '10' : '20'} Clientes</span>
                                <span>{currentClients} / {clientGoal} Clientes</span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Estado de Escalado</p>
                            <p className="text-3xl font-black text-white">FASE {activePhase}</p>
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
                    {/* Dynamic Phase KPI Panel */}
                    <div className="lg:col-span-1 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-between min-h-[320px]">
                        {activePhase === 1 ? (
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <Target className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Validación de Mercado</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <RepBox value={`${currentClients}/${clientGoal}`} label="Clientes Objetivo" color="text-indigo-400" />
                                </div>
                            </div>
                        ) : activePhase === 2 ? (
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Automatización & Canales</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">n8n Flows</span>
                                            </div>
                                            <span className="text-xs font-black text-white">12 ACTIVOS</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tasa de Bots</span>
                                            </div>
                                            <span className="text-xs font-black text-indigo-400">98.4% OK</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reportes Auto</span>
                                            </div>
                                            <span className="text-xs font-black text-purple-400">100% LISTO</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center mt-6">
                                    Ecosistema Optimizado por IA
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <Server className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Telemetría de Nodos</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nodos de Trabajo</span>
                                            <span className="text-xs font-black text-white">{mappedTeam.length} Nodos</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Saturación Promedio</span>
                                            <span className="text-xs font-black text-emerald-400">22% BAJA</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cobertura Regional</span>
                                            <span className="text-xs font-black text-indigo-400">Nacional</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center mt-6">
                                    Nodos Geográficos Operando
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-center text-center">
                        <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-white mb-4 italic uppercase">"Transformamos <span className="text-indigo-500">atención en activos</span> reales"</h3>
                        <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest max-w-md mx-auto">Gestión globalizada de las cuentas de alto valor mediante arquitectura de vanguardia.</p>
                    </div>
                </div>

                {/* Territory Map Module */}
                <div className="pt-10 border-t border-white/5">
                    {activePhase >= 2 ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                                        <MapIcon className="w-5 h-5 text-indigo-500 animate-pulse" /> Módulo de Expansión (Mapa Operativo)
                                    </h3>
                                    <p className="text-xs text-gray-500 uppercase font-black tracking-wider mt-1">Monitoreo de logística y cobertura en tiempo real</p>
                                </div>
                                <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Activo • Fase {activePhase}</span>
                                </div>
                            </div>
                            <AdminOperationalMap clients={mappedClients} team={mappedTeam} />
                        </div>
                    ) : (
                        <div className="relative bg-[#050511] border border-white/5 rounded-[40px] overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-12 text-center group">
                            {/* Blurred Ecuador Map SVG Silhouette background for premium feeling */}
                            <div className="absolute inset-0 opacity-10 blur-md grayscale transition-all duration-700 group-hover:opacity-15 group-hover:scale-105 pointer-events-none flex items-center justify-center">
                                <svg viewBox="0 0 400 400" className="w-[380px] h-[380px]">
                                    <path d="M120,40 C140,20 180,10 210,30 C240,50 280,40 310,60 C340,80 370,120 380,160 C390,200 370,260 350,300 C330,340 280,370 230,380 C180,390 120,370 80,330 C40,290 20,220 30,150 C40,80 80,60 120,40 Z" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.4)" strokeWidth="2" />
                                </svg>
                            </div>
                            
                            <div className="relative z-10 max-w-md space-y-6">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group-hover:border-indigo-500/30 transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Lock className="w-6 h-6 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white">Módulo de Expansión Bloqueado</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                                        El Mapa Operativo y el monitoreo de nodos territoriales se activan automáticamente al ingresar a la <span className="text-indigo-400 font-bold">Fase 2 (10 Clientes)</span>.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                                        Faltan {10 - currentClients} clientes para desbloquear
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
