'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp, DollarSign, PieChart, Activity,
    Calendar, ArrowUpRight, ArrowDownRight, Target,
    RefreshCw, Layers, ShieldCheck, Database, FileText,
    Zap, Home, Cpu, Fingerprint, Copy, Plus, TrendingDown,
    Search, Filter
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    LineChart, Line, ComposedChart, Bar, Cell
} from 'recharts';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function FinancialDashboard() {
    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [activeClient, setActiveClient] = useState(null);
    const [currentMonth] = useState(new Date().toISOString().substring(0, 7));

    const [clientStats, setClientStats] = useState({
        revenue: 0,
        leadsCount: 0
    });

    useEffect(() => {
        loadData();
    }, [clientId]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (clientId) {
                // Client-specific mode
                const [txs, clientData, leadsData] = await Promise.all([
                    agencyService.getFinancialTransactions(), // We might still want global txs for expenses if they are not client-bound yet
                    supabase.from('clients').select('name').eq('id', clientId).single(),
                    supabase.from('crm_leads').select('price_estimated').eq('client_id', clientId)
                ]);
                
                setTransactions(txs);
                setActiveClient(clientData.data);
                
                const revenue = leadsData.data?.reduce((sum, lead) => sum + Number(lead.price_estimated || 0), 0) || 0;
                setClientStats({
                    revenue,
                    leadsCount: leadsData.data?.length || 0
                });

            } else {
                // HQ Mode
                const [txs, budgetsData] = await Promise.all([
                    agencyService.getFinancialTransactions(),
                    agencyService.getFinancialBudgets(currentMonth)
                ]);
                setTransactions(txs);
                setBudgets(budgetsData);
                setActiveClient(null);
            }
        } catch (err) {
            console.error("Financial Sync Error:", err);
            toast.error("Error al sincronizar datos financieros");
        } finally {
            setLoading(false);
        }
    };

    // --- FINANCIAL EXPERT ENGINE ---
    const hqMetrics = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
        const balance = income - expense;
        
        // Distribution Buckets (Burn categories)
        const staffCost = transactions.filter(t => t.category === "Pago a Profesionales").reduce((acc, t) => acc + Number(t.amount), 0);
        const infraCost = transactions.filter(t => t.category === "Gastos Administrativos").reduce((acc, t) => acc + Number(t.amount), 0);
        const prodCost = transactions.filter(t => t.type === 'expense' && t.category !== "Pago a Profesionales" && t.category !== "Gastos Administrativos").reduce((acc, t) => acc + Number(t.amount), 0);

        const totalBudget = budgets.reduce((acc, b) => acc + Number(b.amount), 0);

        // Generate Daily Trend for Burn Rate Analysis
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const currentDay = new Date().getDate();
        
        const burnTrend = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
            
            // Cumulative Real Expense
            const realExpenseUpToDay = transactions
                .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth) && new Date(t.date).getDate() <= day)
                .reduce((acc, t) => acc + Number(t.amount), 0);

            // Linear Projection based on budget
            const projectedExpense = (totalBudget / daysInMonth) * day;

            return {
                day,
                real: day <= currentDay ? realExpenseUpToDay : null,
                projection: projectedExpense
            };
        });

        const distribution = [
            { name: 'NÓMINA STAFF', value: staffCost, total: staffCost + infraCost + prodCost, color: '#6366f1', icon: Zap },
            { name: 'SAAS & INFRA', value: infraCost, total: staffCost + infraCost + prodCost, color: '#a855f7', icon: Cpu },
            { name: 'PRODUCCIÓN REAL', value: prodCost, total: staffCost + infraCost + prodCost, color: '#34d399', icon: Layers }
        ];

        return { 
            income, expense, balance, 
            totalBudget, burnTrend, distribution,
            savingsRate: income > 0 ? ((balance / income) * 100).toFixed(1) : 0
        };
    }, [transactions, budgets]);

    if (loading) return <HQ_Loading />;

    return (
        <div className="p-8 space-y-8 relative bg-[#05050C] min-h-full overflow-y-auto custom-scrollbar selection:bg-indigo-500/30">
            {/* NEW CARTERA-STYLE HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter italic">
                        {activeClient ? `${activeClient.name} - Finanzas` : 'Control de Costos'}
                    </h1>
                    <p className="text-gray-400 font-medium italic">
                        {activeClient 
                            ? `Auditoría operativa y financiera exclusiva para la marca ${activeClient.name}.`
                            : 'Auditoría en tiempo real de lo que se está pagando y lo que se está haciendo.'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={loadData}
                        className={`px-6 py-3 bg-white/5 text-gray-400 font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
                        Sincronizar Datos {activeClient ? 'Privados' : 'Reales'}
                    </button>
                    {!activeClient && (
                        <button className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95">
                            <FileText className="w-4 h-4" /> Informe
                        </button>
                    )}
                </div>
            </div>

            {/* AUDIT PROTOCOL BANNER (Image 1 Style) */}
            {!activeClient && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-xs italic">Protocolo de Auditoría Real</h3>
                            <p className="text-gray-400 text-[10px] font-medium tracking-tight">Cálculos basados en Production Rates internos y flujos de facturación de Supabase.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-3 px-6 py-4 rounded-2xl border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 group relative overflow-hidden">
                            <DollarSign className="w-4 h-4" /> REVISAR INGRESOS
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                        <button className="flex items-center gap-3 px-6 py-4 rounded-2xl border bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 group relative overflow-hidden">
                            <PieChart className="w-4 h-4" /> AUDITAR GASTOS
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* GLOBAL METRICS (Image 1 Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title={activeClient ? "Ingresos Clave" : "Ingresos Totales"}
                    value={`$${(activeClient ? clientStats.revenue : hqMetrics.income).toLocaleString()}`} 
                    icon={TrendingUp} 
                    color="green" 
                />
                <StatCard 
                    title={activeClient ? "Leads Registrados" : "Gastos Operativos"}
                    value={activeClient ? clientStats.leadsCount : `$${hqMetrics.expense.toLocaleString()}`} 
                    icon={activeClient ? Users : TrendingDown} 
                    color={activeClient ? "indigo" : "red"} 
                />
                <StatCard 
                    title={activeClient ? "Estado de Cuenta" : "Utilidad Neta"}
                    value={activeClient ? "ACTIVO" : `$${hqMetrics.balance.toLocaleString()}`} 
                    icon={ShieldCheck} 
                    color="indigo" 
                />
            </div>

            {/* Filters & Search (Simulated for parity) */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar transacciones, centros de costo o ingresos..."
                        className="w-full bg-[#0E0E18] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-indigo-500/50 transition-all border-dashed"
                        disabled
                    />
                </div>
                <button className="px-6 rounded-2xl border border-white/5 text-gray-400 hover:bg-white/5 transition-all flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Periodo
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* BURN RATE ANALYSIS */}
                    <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Activity className="w-40 h-40 text-indigo-500" />
                        </div>
                        
                        <div className="flex justify-between items-end mb-12 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">ANÁLISIS DE BURN RATE</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">HISTORIAL REAL V/S PROYECCIÓN PRESUPUESTARIA</p>
                            </div>
                            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-3 text-indigo-400"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 " /> Ingresos</span>
                                <span className="flex items-center gap-3 text-gray-600"><div className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-gray-600 " /> Gastos</span>
                            </div>
                        </div>

                        <div className="h-[400px] relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={hqMetrics.burnTrend}>
                                    <defs>
                                        <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#444', fontWeight: 900 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#444', fontWeight: 900 }} />
                                    <Tooltip content={<AuditTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
                                    
                                    {/* Projection line */}
                                    <Line 
                                        type="monotone" 
                                        dataKey="projection" 
                                        stroke="#ffffff10" 
                                        strokeWidth={2} 
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                    
                                    {/* Real burn area */}
                                    <Area 
                                        type="stepAfter" 
                                        dataKey="real" 
                                        stroke="#6366f1" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#colorReal)" 
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* DISTRIBUTION PANEL */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between">
                        <div>
                             <h3 className="text-[11px] font-black text-white italic uppercase tracking-[0.3em] mb-12 flex flex-col">
                                DISTRIBUCIÓN
                                <span className="text-[9px] text-gray-500 normal-case not-italic tracking-[0.1em] mt-1 font-bold">INTERNAL OUTFLOW</span>
                             </h3>
                             
                             <div className="space-y-10">
                                {hqMetrics.distribution.map(item => (
                                    <div key={item.name} className="space-y-4 group">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                                                    <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-white">{Math.round((item.value / (item.total || 1)) * 100)}%</span>
                                        </div>
                                        <div className="space-y-1.5 pt-1">
                                             <div className="flex justify-between items-end">
                                                <span className="text-2xl font-black text-white italic tracking-tighter">${item.value.toLocaleString()}</span>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.color} animate-pulse`} />
                                             </div>
                                             <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min((item.value / (item.total || 1)) * 100, 100)}%` }}
                                                    className={`h-full ${item.color}`} 
                                                />
                                             </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 mt-10">
                            <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/10 flex items-center justify-between">
                                 <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">PUNTO EQUILIBRIO</p>
                                    <span className="text-lg font-black text-emerald-400 italic">${hqMetrics.expense.toLocaleString()}</span>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[8px] font-black text-gray-700 uppercase leading-none mb-2">TARGET ROI</p>
                                    <span className="text-lg font-black text-white italic tracking-tighter">4.5X</span>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOMLINE INSIGHT */}
                <div className="bg-gradient-to-r from-indigo-950/20 via-black to-purple-950/20 border border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-8 text-left">
                        <div className="w-20 h-20 rounded-[2rem] bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/10">
                            <Database className="w-9 h-9 text-white" />
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">Auditoría de Escalabilidad</h4>
                            <p className="text-sm text-gray-500 font-medium max-w-md leading-relaxed">Infraestructura financiera validada para soportar crecimiento agresivo. Basado en tu burn rate actual, la agencia es operativa con <span className="text-white font-bold">{hqMetrics.savingsRate}% de eficiencia</span>.</p>
                        </div>
                    </div>
                    <div className="flex gap-10 items-center">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Ratio de Ahorro</p>
                            <p className="text-4xl font-black text-emerald-500 italic tracking-tighter">+{hqMetrics.savingsRate}%</p>
                        </div>
                        <div className="w-px h-16 bg-white/5" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Status HQ</p>
                            <p className="text-2xl font-black text-white italic uppercase tracking-widest flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" /> ACTIVE
                            </p>
                        </div>
                    </div>
                </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon: Icon, color }) {
    const colors = {
        indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <motion.div 
            whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.02)' }}
            whileTap={{ scale: 0.98 }}
            className={`p-10 border border-white/5 bg-[#0E0E18] rounded-[2.5rem] transition-all group`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${colors[color]}`}>
                <Icon className="w-7 h-7" />
            </div>
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 leading-none">{title}</div>
            <div className={`text-5xl font-black italic tracking-tighter ${color === 'red' ? 'text-rose-500' : color === 'green' ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
        </motion.div>
    );
}

function AuditTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/90 border border-white/10 p-8 rounded-[2rem] shadow-2xl backdrop-blur-2xl text-left min-w-[220px]">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-3">DÍA {data.day} DE AUDITORÍA</p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center gap-10">
                        <span className="text-[10px] font-black text-indigo-400 italic uppercase">REAL:</span>
                        <span className="text-2xl font-black text-white italic tracking-tighter">{data.real !== null ? `$${data.real.toLocaleString()}` : '---'}</span>
                    </div>
                    <div className="flex justify-between items-center gap-10">
                        <span className="text-[10px] font-black text-gray-600 italic uppercase tracking-wider">PLAN:</span>
                        <span className="text-2xl font-black text-gray-600 italic tracking-tighter">${Math.round(data.projection).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

function HQ_Loading() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-10 bg-[#05050C]">
             <div className="relative">
                 <div className="w-24 h-24 rounded-full border-t-2 border-indigo-500 animate-spin" />
                 <div className="absolute inset-0 bg-indigo-500/10 blur-3xl animate-pulse" />
                 <DollarSign className="absolute inset-0 m-auto w-8 h-8 text-indigo-400" />
             </div>
             <div className="text-center">
                 <h2 className="text-3xl font-black italic text-white tracking-[0.3em] uppercase mb-4">FINANZAS HQ</h2>
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-[1em] animate-pulse">Iniciando Terminal de Auditoría Operativa</p>
             </div>
        </div>
    );
}
