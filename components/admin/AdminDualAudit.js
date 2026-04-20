'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown,
    PieChart, ArrowUpRight, ArrowDownRight, Wallet, Activity,
    X, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Users,
    FileText, CreditCard, ChevronRight, Zap, Target, ClipboardList,
    Plus, Edit3, Save, Trash2, Calendar, Clock, ArrowLeft, ArrowRight,
    LayoutDashboard, Briefcase, Settings, Award, Layers, Search, Eye,
    Home, UserCheck, Shield, Filter, CalendarDays, History, TrendingUp as UpTrend,
    MoreHorizontal, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, LineChart, Line, PieChart as RePieChart, Pie, ComposedChart
} from 'recharts';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

// CONFIGURACIÓN DE ÁREAS MAESTRAS (Business Rules)
const FINANCIAL_CONFIG = {
    income: {
        label: "Área 1: Ingresos (Clientes)",
        desc: "Flujo de entrada por servicios y asesorías",
        color: "#10b981",
        gradient: "from-emerald-500/20 to-emerald-500/0",
        categories: {
            "Ingresos Operativos": [
                "Venta de planes de marketing",
                "Producción de video",
                "Fotografía",
                "Diseños",
                "Servicios profesionales por asesorías"
            ]
        }
    },
    team: {
        label: "Área 2: Egresos - Equipo (Zona Creativa)",
        desc: "Compensación de talento y capacitación",
        color: "#6366f1",
        gradient: "from-indigo-500/20 to-indigo-500/0",
        categories: {
            "Pago a Profesionales": [
                "Pago mensual a creativos",
                "Bonos por rendimiento",
                "Servicios Tercerizados (Freelance)",
                "Capacitación de equipo"
            ]
        }
    },
    agency: {
        label: "Área 3: Egresos - Oficina (Administración)",
        desc: "Costos fijos y estructura administrativa",
        color: "#a855f7",
        gradient: "from-purple-500/20 to-purple-500/0",
        categories: {
            "Gastos Administrativos": [
                "Alquiler de local / oficina",
                "Servicios (Luz, Agua, Internet)",
                "Impuestos y Contabilidad",
                "Suscripciones (Adobe, Sora, AI)",
                "Insumos de oficina"
            ]
        }
    }
};

export default function AdminDualAudit() {
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState('overview'); 
    
    // Data States
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [clientCount, setClientCount] = useState(0);
    const [currentMonth] = useState(new Date().toISOString().substring(0, 7));
    
    // Form States
    const [isRegistering, setIsRegistering] = useState(false);
    const [isManagingBudgets, setIsManagingBudgets] = useState(false);
    
    const [newTx, setNewTx] = useState({
        type: 'income',
        category: 'Ingresos Operativos',
        subcategory: '',
        amount: '',
        currency: 'USD',
        payment_method: 'Transferencia',
        description: '',
        date: new Date().toISOString()
    });

    useEffect(() => {
        loadData();
    }, [currentMonth]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [txs, goalsData, budgetsData, count] = await Promise.all([
                agencyService.getFinancialTransactions(),
                agencyService.getFinancialGoals(),
                agencyService.getFinancialBudgets(currentMonth),
                agencyService.getClientCount()
            ]);
            setTransactions(txs);
            setGoals(goalsData);
            setBudgets(budgetsData);
            setClientCount(count);
        } catch (err) {
            console.error("Error loading financial data:", err);
            toast.error("Error de sincronización financiera");
        } finally {
            setLoading(false);
        }
    };

    // --- BI ENGINE: CALCULATIONS ---
    const financialMetrics = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
        const balance = income - expense;
        
        const teamCost = transactions.filter(t => t.category === "Pago a Profesionales").reduce((acc, t) => acc + Number(t.amount), 0);
        const officeCost = transactions.filter(t => t.category === "Gastos Administrativos").reduce((acc, t) => acc + Number(t.amount), 0);

        const teamBudget = budgets.find(b => b.category === "Pago a Profesionales")?.amount || 0;
        const officeBudget = budgets.find(b => b.category === "Gastos Administrativos")?.amount || 0;

        const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
        const burnRate = expense;
        const runway = income > 0 ? (balance > 0 ? (balance / (burnRate || 1)).toFixed(1) : 0) : 0;

        const distribution = [
            { name: 'Equipo', value: teamCost, color: '#6366f1', budget: teamBudget, area: 'team' },
            { name: 'Oficina', value: officeCost, color: '#a855f7', budget: officeBudget, area: 'agency' }
        ];

        return { 
            income, expense, balance, teamCost, officeCost, 
            teamBudget, officeBudget, savingsRate, burnRate, runway, 
            distribution, clientCount 
        };
    }, [transactions, budgets, clientCount]);
+
+    // --- HELPER: GROUP TRANSACTIONS BY DATE ---
+    const groupedTransactions = useMemo(() => {
+        const groups = {};
+        transactions.forEach(tx => {
+            const date = tx.date.split('T')[0];
+            if (!groups[date]) groups[date] = [];
+            groups[date].push(tx);
+        });
+        return Object.entries(groups)
+            .sort(([a], [b]) => b.localeCompare(a))
+            .map(([date, items]) => ({ date, items }));
+    }, [transactions]);

    const handleAddTransaction = async () => {
        if (!newTx.subcategory || !newTx.amount) {
            toast.error("Completa los campos obligatorios");
            return;
        }
        try {
            await agencyService.addFinancialTransaction(newTx);
            toast.success("Operación registrada en libro mayor");
            setIsRegistering(false);
            loadData();
        } catch (err) { toast.error("Fallo al registrar operación"); }
    };

    const handleUpdateBudget = async (category, amount) => {
        try {
            await agencyService.upsertFinancialBudget({ category, amount: Number(amount), month: currentMonth });
            toast.success("Presupuesto maestro actualizado");
            loadData();
        } catch (err) { toast.error("Error al actualizar presupuesto"); }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="relative min-h-screen py-10 px-4 lg:px-12 overflow-hidden selection:bg-indigo-500/30 text-left">
            {/* AMBIENT EFFECTS */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative mb-20 flex flex-col lg:flex-row justify-between items-end gap-10">
                <div className="flex flex-col gap-10 w-full lg:w-auto">
                     <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-8 group"
                    >
                        <div className="w-3 h-24 bg-gradient-to-b from-emerald-400 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] group-hover:h-28 transition-all duration-500" />
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-4 h-4 text-indigo-400 animate-pulse" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Audit Mode Active</span>
                            </div>
                            <h1 className="text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">FINANZAS<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-purple-500">GLOBALES</span></h1>
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mt-6 italic opacity-60">DIIC HQ — Control Central de Tesorería v8.0</p>
                        </div>
                    </motion.div>

                    <nav className="flex items-center gap-2 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-2 overflow-x-auto no-scrollbar shadow-2xl">
                        {[
                            { id: 'overview', label: 'Monitor Global', icon: LayoutDashboard },
                            { id: 'income', label: 'Ingresos (Área 1)', icon: Users },
                            { id: 'team', label: 'Equipo (Área 2)', icon: Zap },
                            { id: 'agency', label: 'Agencia (Área 3)', icon: Home },
                            { id: 'goals', label: 'Metas de Expansión', icon: Target }
                        ].map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveModule(mod.id)}
                                className={`flex items-center gap-3 px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeModule === mod.id 
                                    ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <mod.icon className="w-4 h-4" />
                                <span>{mod.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsManagingBudgets(true)}
                        className="p-8 bg-white/5 border border-white/10 text-white rounded-[3rem] hover:bg-white/10 transition-all flex flex-col items-center justify-center min-w-[140px] group border-dashed"
                    >
                        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform text-gray-400 group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase mt-4 tracking-widest text-gray-500 group-hover:text-white">Presupuestos</span>
                    </button>
                     <button 
                        onClick={() => {
                            setNewTx(prev => ({ ...prev, type: 'income', category: 'Ingresos Operativos', subcategory: '' }));
                            setIsRegistering(true);
                        }}
                        className="p-8 bg-emerald-500 text-black rounded-[3rem] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 flex flex-col items-center justify-center min-w-[160px] group"
                    >
                        <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-4 tracking-[0.2em]">Registrar EN</span>
                    </button>
                    <button 
                        onClick={() => {
                            setNewTx(prev => ({ ...prev, type: 'expense', category: 'Pago a Profesionales', subcategory: '' }));
                            setIsRegistering(true);
                        }}
                        className="p-8 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[3rem] hover:bg-rose-500 hover:text-white transition-all flex flex-col items-center justify-center min-w-[160px] group"
                    >
                        <ArrowDownRight className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-4 tracking-[0.2em]">Registrar OUT</span>
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeModule}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    className="space-y-12"
                >
                    {activeModule === 'overview' && <OverviewTab metrics={financialMetrics} />}
                    {activeModule === 'income' && <AreaDetailTab type="income" transactions={transactions.filter(t => t.type === 'income')} budget={0} />}
                    {activeModule === 'team' && <AreaDetailTab type="team" transactions={transactions.filter(t => t.category === 'Pago a Profesionales')} budget={financialMetrics.teamBudget} />}
                    {activeModule === 'agency' && <AreaDetailTab type="agency" transactions={transactions.filter(t => t.category === 'Gastos Administrativos')} budget={financialMetrics.officeBudget} />}
                    {activeModule === 'goals' && <GoalsTab goals={goals} metrics={financialMetrics} onAdd={() => {}} />}
                </motion.div>
            </AnimatePresence>

            {/* MODALS */}
            <AnimatePresence>
                {isRegistering && (
                    <TransactionModal 
                        tx={newTx} 
                        setTx={setNewTx} 
                        onClose={() => setIsRegistering(false)} 
                        onSave={handleAddTransaction}
                    />
                )}
                {isManagingBudgets && (
                    <BudgetManagerModal 
                        budgets={budgets}
                        onUpdate={handleUpdateBudget}
                        onClose={() => setIsManagingBudgets(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- TAB: MONITOR GLOBAL (COMMAND CENTER) ---
function OverviewTab({ metrics }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* MAIN PERFORMANCE COCKPIT (Left Col) */}
            <div className="lg:col-span-8 space-y-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 lg:p-14 rounded-[3.5rem] bg-[#0A0A12] border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[450px] shadow-2xl text-left"
                >
                    {/* CINEMATIC BACKGROUND GLOW */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield className="w-5 h-5 text-indigo-400" />
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Libro Mayor • Status: <span className="text-emerald-400">Verificado</span></p>
                                </div>
                                <h2 className="text-8xl font-black italic tracking-tighter leading-none text-white">
                                    ${metrics.balance.toLocaleString()}
                                </h2>
                                <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-[0.2em] italic underline decoration-indigo-500/50 underline-offset-8">Resultado Neto Operativo</p>
                            </div>
                            <div className="flex flex-col items-end gap-4">
                                <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-Time Sync</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-600 uppercase">Margen de Ahorro</p>
                                    <p className="text-3xl font-black text-emerald-400 italic">+{metrics.savingsRate}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <UpTrend className="w-7 h-7 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Ingresos</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter">${metrics.income.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                                    <TrendingDown className="w-7 h-7 text-rose-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Salida Total</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter shadow-sm">-${metrics.expense.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MINI CHART OVERLAY */}
                    <div className="absolute inset-x-0 bottom-0 h-40 opacity-20 pointer-events-none overflow-hidden">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[{ x: 0, b: metrics.income*0.4 }, { x: 1, b: metrics.balance*0.8 }, { x: 2, b: metrics.balance }]}>
                                <Area type="monotone" dataKey="b" stroke="#6366f1" fill="url(#colorBal2)" strokeWidth={4} />
                                <defs>
                                    <linearGradient id="colorBal2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                         </ResponsiveContainer>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KPI: SCALE VELOCITY */}
                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:bg-white/[0.04] transition-all text-left">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <Target className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Phase 1: Scale 10</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Meta de Expansión</p>
                            <h3 className="text-5xl font-black italic text-white tracking-tighter mb-8 leading-[0.9]">10 Clientes<br/><span className="text-gray-600">Institucionales</span></h3>
                            <ProgressControl label="Progreso Real" val={(metrics.clientCount / 10) * 100} color="bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" textOverride={`${metrics.clientCount} / 10`} />
                        </div>
                    </div>

                    {/* KPI: LIQUIDITY RUNWAY */}
                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:bg-white/[0.04] transition-all text-left">
                         <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                <History className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Estabilidad Ops</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Relación Ingreso/Gasto</p>
                            <h3 className="text-5xl font-black italic text-white tracking-tighter mb-8 leading-[0.9]">Eficiencia<br/><span className="text-gray-600">de Red</span></h3>
                            <ProgressControl label="Optimización" val={metrics.savingsRate > 50 ? 95 : 70} color="bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* RADAR & SECTORS (Right Col) */}
            <div className="lg:col-span-4 space-y-6">
                <div className="h-full p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col items-center">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10">Distribución de Recursos</h3>
                    
                    <div className="w-full h-64 mb-10 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Total Ops</p>
                                <p className="text-4xl font-black text-white italic tracking-tighter">${metrics.expense.toLocaleString()}</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={metrics.distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    cornerRadius={12}
                                    dataKey="value"
                                >
                                    {metrics.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" className="hover:opacity-80 transition-opacity cursor-pointer" />
                                    ))}
                                </Pie>
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-4">
                        {metrics.distribution.map(d => {
                            const usage = d.budget > 0 ? (d.value / d.budget) * 100 : 0;
                            const status = usage > 100 ? 'exceeded' : usage > 85 ? 'warning' : 'healthy';
                            const colors = {
                                exceeded: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
                                warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                                healthy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                            };

                            return (
                                <div key={d.name} className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-white/10 transition-all flex justify-between items-center text-left w-full">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{d.name}</span>
                                        </div>
                                        <p className="text-2xl font-black text-white italic tracking-tighter">${d.value.toLocaleString()}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase italic ${colors[status]}`}>
                                        {status === 'healthy' ? 'Óptimo' : status === 'warning' ? 'Límite' : 'Exceso'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase text-gray-400 tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        <Download className="w-4 h-4 text-indigo-400" /> Exportar Reporte Mensual
                    </button>
                </div>
            </div>

            {/* MASTER CHART (Bottom Row) */}
            <div className="lg:col-span-12 p-10 lg:p-14 bg-[#0A0A12] border border-white/10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="flex justify-between items-end mb-12 relative z-10">
                     <div>
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 animate-pulse" /> Benchmarking de Ejecución
                        </h3>
                        <p className="text-4xl font-black text-white italic uppercase tracking-tighter">Planificado vs. Realizado</p>
                     </div>
                     <div className="flex gap-10">
                        <ChartLegend color="bg-indigo-500" label="Capital Planificado" />
                        <ChartLegend color="bg-emerald-500" label="Gasto Ejecutado" />
                     </div>
                </div>
                <div className="h-[400px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={metrics.distribution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 900, textAnchor: 'middle' }} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#444', fontWeight: 900 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                            <Bar dataKey="value" barSize={100} radius={[20, 20, 0, 0]}>
                                {metrics.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.05} stroke={entry.color} strokeWidth={2} />
                                ))}
                            </Bar>
                            <Line type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 0 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function AreaDetailTab({ type, transactions, budget }) {
    const config = FINANCIAL_CONFIG[type];
    const total = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
    const usage = budget > 0 ? (total / budget) * 100 : 0;
    
    // Group transactions by date for the timeline
    const grouped = useMemo(() => {
        const groups = {};
        transactions.forEach(tx => {
            const date = tx.date.split('T')[0];
            if (!groups[date]) groups[date] = [];
            groups[date].push(tx);
        });
        return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
    }, [transactions]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end px-6 lg:px-10 gap-8">
                <div>
                    <div className="flex items-center gap-5 mb-4">
                        <div className={`w-3 h-12 rounded-full bg-gradient-to-b ${config.color === '#10b981' ? 'from-emerald-400 to-emerald-600' : config.color === '#6366f1' ? 'from-indigo-400 to-indigo-600' : 'from-purple-400 to-purple-600'}`} />
                        <div>
                            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">{config.label}</h2>
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3">{config.desc}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Volumen Total del Área</span>
                    <span className="text-6xl font-black text-indigo-400 italic tracking-tighter leading-none">${total.toLocaleString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <SummaryCard label="Capital Planificado" val={`$${budget.toLocaleString()}`} icon={Target} color="text-indigo-400" />
                 <SummaryCard label="Balance Maestro" val={`${budget - total >= 0 ? '+' : ''}${(budget - total).toLocaleString()}`} icon={ClipboardList} color={budget - total >= 0 ? 'text-emerald-400' : 'text-rose-400'} />
                 <SummaryCard label="Ratio de Ejecución" val={`${Math.round(usage)}%`} icon={BarChart3} color={usage > 100 ? 'text-rose-500' : 'text-white'} />
            </div>

            {/* TIMELINE LEDGER */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-10">
                    <History className="w-5 h-5 text-gray-600" />
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">Historial de Auditoría Local</h3>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="space-y-12">
                    {grouped.length > 0 ? grouped.map(([date, items]) => (
                        <div key={date} className="relative pl-10 lg:pl-16">
                            {/* DATE MARKER */}
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 lg:left-6">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            </div>
                            
                            <div className="mb-6 flex items-center gap-4">
                                <span className="text-lg font-black text-white italic tracking-tighter uppercase">{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest">{items.length} Operaciones</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {items.map(tx => (
                                    <motion.div 
                                        key={tx.id}
                                        whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        className="flex items-center justify-between p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] transition-all group"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xl text-gray-600 transition-all group-hover:bg-indigo-500/10 group-hover:text-indigo-400 border border-white/5 group-hover:border-indigo-500/20">
                                                {tx.subcategory[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{tx.subcategory}</h4>
                                                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">Ref: {tx.id.substring(0, 8)}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{tx.description || 'Operación Certificada'}</p>
                                                    <div className="w-1 h-1 rounded-full bg-gray-800" />
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 uppercase">
                                                        <CreditCard className="w-3 h-3" />
                                                        {tx.payment_method}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-4xl font-black italic tracking-tighter leading-none mb-2 ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                                {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                                            </p>
                                            <div className="flex items-center justify-end gap-2 text-[9px] font-black text-gray-700 uppercase">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(tx.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="py-40 text-center opacity-20">
                            <Layers className="w-20 h-20 mx-auto mb-8 animate-pulse text-gray-500" />
                            <p className="text-[14px] font-black uppercase tracking-[1em]">Awaiting Financial Data</p>
                            <p className="mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">El libro mayor local no registra movimientos para este periodo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ label, val, icon: Icon, color }) {
    return (
        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all text-left shadow-xl">
            <div className="space-y-3">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest block">{label}</span>
                <span className={`text-5xl font-black italic tracking-tighter ${color} transition-all group-hover:scale-105 block origin-left`}>{val}</span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                 <Icon className="w-7 h-7 opacity-20 group-hover:opacity-60 transition-opacity" />
            </div>
        </div>
    );
}

function BudgetManagerModal({ budgets, onUpdate, onClose }) {
    const [localBudgets, setLocalBudgets] = useState({
        "Pago a Profesionales": budgets.find(b => b.category === "Pago a Profesionales")?.amount || 0,
        "Gastos Administrativos": budgets.find(b => b.category === "Gastos Administrativos")?.amount || 0
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white/[0.03] border border-white/10 rounded-[4rem] p-20 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />
                <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-12">Planificación <span className="text-indigo-500">Financiera</span></h3>
                <div className="space-y-10 mb-16">
                    {Object.keys(localBudgets).map(cat => (
                         <div key={cat} className="space-y-5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] pl-3 block">{cat}</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-hover:text-indigo-500" />
                                <input 
                                    type="number"
                                    value={localBudgets[cat]}
                                    onChange={(e) => setLocalBudgets({...localBudgets, [cat]: e.target.value})}
                                    className="w-full bg-black/50 border border-white/5 rounded-[2rem] px-16 py-8 text-4xl text-white font-black italic focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>
                         </div>
                    ))}
                </div>
                <div className="flex gap-6">
                    <button 
                        onClick={() => {
                            Object.entries(localBudgets).forEach(([cat, val]) => onUpdate(cat, val));
                            onClose();
                        }}
                        className="flex-1 py-7 bg-indigo-500 text-white text-[13px] font-black uppercase tracking-[0.4em] rounded-3xl hover:bg-indigo-400 transition-all shadow-2xl shadow-indigo-500/20"
                    >
                        Confirmar Métrica
                    </button>
                    <button onClick={onClose} className="px-12 py-7 bg-white/5 text-gray-500 text-[11px] font-black uppercase rounded-3xl hover:text-white transition-all">Anular</button>
                </div>
            </motion.div>
        </div>
    );
}

function TransactionModal({ tx, setTx, onClose, onSave }) {
    const activeConfig = tx.type === 'income' ? FINANCIAL_CONFIG.income : (tx.category === 'Pago a Profesionales' ? FINANCIAL_CONFIG.team : FINANCIAL_CONFIG.agency);
    const subcategories = activeConfig.categories[tx.category] || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white/[0.03] border border-white/10 rounded-[4rem] p-20 max-w-3xl w-full shadow-2xl">
                <div className="flex items-center gap-4 mb-12">
                     <div className={`w-3 h-10 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                     <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter">Registrar {tx.type === 'income' ? 'Ingreso Fiscal' : 'Desembolso Operativo'}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 block">Área de Responsabilidad</label>
                        <select 
                            value={tx.category}
                            onChange={(e) => setTx({...tx, category: e.target.value, subcategory: ''})}
                            className="w-full bg-black border border-white/5 rounded-3xl px-8 py-5 text-white font-black italic focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {tx.type === 'income' ? (
                                <option value="Ingresos Operativos">Área 1: Clientes e Ingresos</option>
                            ) : (
                                <>
                                    <option value="Pago a Profesionales">Área 2: Equipo (Zona Creativa)</option>
                                    <option value="Gastos Administrativos">Área 3: Agencia (Oficina)</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 block">Clasificación Técnica</label>
                        <select 
                            value={tx.subcategory}
                            onChange={(e) => setTx({...tx, subcategory: e.target.value})}
                            className="w-full bg-black border border-white/5 rounded-3xl px-8 py-5 text-white font-black italic focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Seleccionar Clasificación...</option>
                            {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 block">Monto Transaccional ($)</label>
                        <input 
                            type="number"
                            value={tx.amount}
                            onChange={(e) => setTx({...tx, amount: e.target.value})}
                            className="w-full bg-black border border-white/5 rounded-3xl px-10 py-5 text-4xl text-white font-black italic focus:border-indigo-500 transition-all outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 block">Canal de Pago</label>
                         <select 
                            value={tx.payment_method}
                            onChange={(e) => setTx({...tx, payment_method: e.target.value})}
                            className="w-full bg-black border border-white/5 rounded-3xl px-8 py-5 text-white font-black italic focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="Transferencia">Transferencia Bancaria</option>
                            <option value="Efectivo">Efectivo / Caja Chica</option>
                            <option value="Tarjeta">Tarjeta Corporativa</option>
                            <option value="Paypal / Binance">Cripto / Paypal</option>
                        </select>
                    </div>

                    <div className="col-span-full space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 block">Nota de Auditoría</label>
                        <input 
                            value={tx.description}
                            onChange={(e) => setTx({...tx, description: e.target.value})}
                            className="w-full bg-black border border-white/5 rounded-3xl px-10 py-6 text-white font-black italic focus:border-indigo-500 transition-all outline-none"
                            placeholder="Justificación de la operación..."
                        />
                    </div>
                </div>

                <div className="flex gap-6">
                    <button onClick={onSave} className="flex-1 py-7 bg-indigo-500 text-white text-[13px] font-black uppercase tracking-[0.4em] rounded-3xl transition-all shadow-2xl shadow-indigo-500/30">Confirmar en Libro Mayor</button>
                    <button onClick={onClose} className="px-12 py-7 bg-white/5 text-gray-500 text-[11px] font-black uppercase rounded-3xl hover:text-white transition-all">Cancelar</button>
                </div>
            </motion.div>
        </div>
    );
}

function GoalsTab({ goals, metrics }) {
    return (
        <div className="space-y-16">
            <header className="px-6 lg:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="text-left">
                     <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter">Escalado Maestro</h2>
                     <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3 italic">Objetivos de Expansión Corporativa y ROI</p>
                </div>
                <div className="flex items-center gap-5 p-6 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-xl">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{metrics.clientCount} Clientes en Cartera Activa</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* META FIJA: LOS 10 CLIENTES */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-14 lg:p-20 rounded-[4rem] bg-[#0A0A12] border border-white/10 relative overflow-hidden group text-left shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                        <Users className="w-64 h-64 text-emerald-500" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[400px]">
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <Award className="w-5 h-5 text-emerald-400" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Hito Progresivo: Nivel 1</span>
                            </div>
                            <h3 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-8">Objetivo<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Scale-10</span></h3>
                            <p className="text-sm text-gray-500 font-bold mb-14 leading-relaxed max-w-sm italic">Consolidación de los primeros 10 clientes fijos para alcanzar el equilibrio de rentabilidad neta superior al 40%.</p>
                        </div>
                        
                        <div className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/10">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ejecución del Plan</span>
                                <span className="text-6xl font-black text-emerald-400 italic tracking-tighter leading-none">{metrics.clientCount}<span className="text-2xl text-gray-700">/10</span></span>
                            </div>
                            <div className="w-full h-4 bg-black rounded-full overflow-hidden p-1 border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(metrics.clientCount / 10) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)]" 
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* OTRAS METAS */}
                <div className="grid grid-cols-1 gap-10">
                    {goals.length > 0 ? goals.map(goal => (
                         <div key={goal.id} className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-indigo-500/30 transition-all text-left relative overflow-hidden shadow-xl">
                             <div className="absolute right-0 top-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
                                <Activity className="w-32 h-32 text-indigo-400" />
                             </div>
                             <div className="relative z-10">
                                <div className="flex justify-between items-center mb-8">
                                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${goal.priority === 'High' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'} uppercase italic tracking-widest`}>Prioridad {goal.priority}</span>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600 uppercase tracking-tighter">
                                        <CalendarDays className="w-3.5 h-3.5 text-gray-700" />
                                        {goal.deadline || 'A largo plazo'}
                                    </div>
                                </div>
                                <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight mb-4 group-hover:text-indigo-400 transition-colors">{goal.name}</h4>
                             </div>
                             <div className="flex items-end justify-between mt-12 bg-white/5 p-8 rounded-[2.5rem] relative z-10 border border-white/10 group-hover:bg-white/10 transition-all">
                                <div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase block mb-2 tracking-widest">Inversión Necesaria</span>
                                    <span className="text-5xl font-black text-white italic tracking-tighter shadow-sm">${Number(goal.target_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                     <div className="flex items-center gap-2">
                                         <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-[pulse_2s_infinite]" />
                                         <span className="text-[10px] font-black text-indigo-400 uppercase italic tracking-widest">En Análisis</span>
                                     </div>
                                     <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-500 transition-all">
                                         <Plus className="w-4 h-4 text-white" />
                                     </div>
                                </div>
                             </div>
                         </div>
                    )) : (
                        <div className="flex items-center justify-center h-full border-4 border-dashed border-white/5 rounded-[4rem] opacity-20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                            <div className="text-center">
                                <Target className="w-16 h-16 mx-auto mb-6 text-gray-600" />
                                <p className="text-[12px] font-black uppercase tracking-[0.8em]">Awaiting Expansion Orders</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-8 bg-black">
             <div className="relative">
                 <RefreshCw className="w-16 h-16 text-indigo-500 animate-[spin_3s_linear_infinite]" />
                 <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-pulse" />
             </div>
             <div className="text-center">
                 <h2 className="text-3xl font-black italic text-white tracking-widest uppercase mb-3">GLOBAL FINANCE</h2>
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.8em] animate-pulse">Sincronizando Libro de Tesorería v7.0</p>
             </div>
        </div>
    );
}

// Helpers
function ChartLegend({ color, label }) {
    return (
        <div className="flex items-center gap-4">
             <div className={`w-3.5 h-3.5 rounded-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
             <span className="text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] italic">{label}</span>
        </div>
    );
}

function KPI_Badge({ icon: Icon, label, val, color }) {
    return (
        <div className="px-6 py-3 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-all">
            <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="text-left">
                <span className="text-[9px] font-black text-gray-500 uppercase block leading-none tracking-widest mb-1.5">{label}</span>
                <span className={`text-[15px] font-black italic block leading-none ${color}`}>{val}</span>
            </div>
        </div>
    );
}

function ProgressControl({ label, val, color, textOverride }) {
    return (
        <div className="space-y-4 text-left">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">{label}</span>
                <span className="text-white text-xl font-black italic tracking-tighter">{textOverride || `${Math.round(val)}%`}</span>
            </div>
            <div className="w-full h-2.5 bg-black rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(val, 100)}%` }}
                    className={`h-full rounded-full ${color} transition-all duration-1000`} 
                />
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/90 border border-white/10 p-8 rounded-[2rem] shadow-2xl backdrop-blur-2xl text-left min-w-[200px]">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5 border-b border-white/5 pb-3">Análisis: {data.name}</p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center gap-10">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Ejecutado:</span>
                        <span className="text-2xl font-black text-white italic">${data.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-10">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Planificado:</span>
                        <span className="text-2xl font-black text-gray-600 italic tracking-tighter">${data.budget.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 mt-4">
                        <div className={`text-[11px] font-black uppercase italic ${data.value > data.budget ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {data.value > data.budget ? `Exceso: $${(data.value - data.budget).toLocaleString()}` : `Margen: $${(data.budget - data.value).toLocaleString()}`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}
