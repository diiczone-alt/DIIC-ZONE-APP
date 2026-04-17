'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown,
    PieChart, ArrowUpRight, ArrowDownRight, Wallet, Activity,
    X, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Users,
    FileText, CreditCard, ChevronRight, Zap, Target, ClipboardList,
    Plus, Edit3, Save, Trash2, Calendar, Clock, ArrowLeft, ArrowRight,
    LayoutDashboard, Briefcase, Settings, Award, Layers, Search, Eye,
    Home, UserCheck
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
        color: "#10b981",
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
        color: "#6366f1",
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
        color: "#a855f7",
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

            <header className="relative mb-14 flex flex-col lg:flex-row justify-between items-end gap-10">
                <div className="flex flex-col gap-6">
                     <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-5"
                    >
                        <div className="w-2 h-20 bg-gradient-to-b from-emerald-400 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
                        <div>
                            <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.85]">FINANZAS<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-purple-500">GLOBALES</span></h1>
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.6em] mt-3 italic">DIIC HQ — Control Central de Tesorería v7.0</p>
                        </div>
                    </motion.div>

                    <nav className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 overflow-x-auto no-scrollbar">
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
                                className={`flex items-center gap-3 px-8 py-3.5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeModule === mod.id 
                                    ? 'bg-white text-black shadow-2xl scale-105' 
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
                        className="p-7 bg-white/5 border border-white/10 text-white rounded-[2.5rem] hover:bg-white/10 transition-all flex flex-col items-center justify-center min-w-[130px] group border-dashed"
                    >
                        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform text-white" />
                        <span className="text-[9px] font-black uppercase mt-3 tracking-widest">Presupuestos</span>
                    </button>
                     <button 
                        onClick={() => {
                            setNewTx(prev => ({ ...prev, type: 'income', category: 'Ingresos Operativos', subcategory: '' }));
                            setIsRegistering(true);
                        }}
                        className="p-7 bg-emerald-500 text-black rounded-[2.5rem] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 flex flex-col items-center justify-center min-w-[150px] group"
                    >
                        <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-3 tracking-[0.2em]">Registrar EN</span>
                    </button>
                    <button 
                        onClick={() => {
                            setNewTx(prev => ({ ...prev, type: 'expense', category: 'Pago a Profesionales', subcategory: '' }));
                            setIsRegistering(true);
                        }}
                        className="p-7 bg-white/5 border border-white/10 text-white rounded-[2.5rem] hover:bg-rose-500 transition-all flex flex-col items-center justify-center min-w-[150px] group"
                    >
                        <ArrowDownRight className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-3 tracking-[0.2em]">Registrar OUT</span>
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

// --- TAB: MONITOR GLOBAL ---
function OverviewTab({ metrics }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="col-span-full lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* CAJA PRINCIPAL: UTILIDAD OPERATIVA */}
                <motion.div 
                    className="p-14 rounded-[4rem] bg-indigo-500/[0.04] border border-indigo-500/10 backdrop-blur-3xl relative overflow-hidden flex flex-col justify-between min-h-[420px]"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                            <p className="text-xs font-black text-gray-500 uppercase tracking-[0.5em]">Utilidad Neta de Operación</p>
                        </div>
                        <h2 className="text-[7.5rem] font-black italic tracking-tighter leading-none text-white">
                            ${metrics.balance.toLocaleString()}
                        </h2>
                        <div className="flex gap-6 mt-12">
                            <KPI_Badge icon={TrendingUp} label="Total Ingresos" val={`$${metrics.income.toLocaleString()}`} color="text-emerald-400" />
                            <KPI_Badge icon={TrendingDown} label="Egresos Totales" val={`-$${metrics.expense.toLocaleString()}`} color="text-rose-400" />
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 top-1/2 opacity-30 pointer-events-none">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[{ x: 0, b: metrics.income/2 }, { x: 1, b: metrics.balance }]}>
                                <Area type="monotone" dataKey="b" stroke="#6366f1" fill="url(#colorBal)" strokeWidth={6} />
                                <defs>
                                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                         </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* KPI: METAS DE CRECIMIENTO (CLIENTES) */}
                <div className="p-14 rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-10">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-400" />
                                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Crecimiento Institucional</p>
                            </div>
                            <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full uppercase italic border border-emerald-500/20">Expandiendo</span>
                        </div>
                        <h3 className="text-6xl font-black italic text-white tracking-tighter mb-10 leading-tight">Meta Principal:<br/><span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">10 Clientes</span></h3>
                        
                        <div className="space-y-10">
                            <ProgressControl label="Ratio de Expansión" val={(metrics.clientCount / 10) * 100} color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" textOverride={`${metrics.clientCount} / 10 Clientes`} />
                            <ProgressControl label="Eficiencia Operativa" val={metrics.savingsRate} color="bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* RADAR DE EGRESOS (SEMÁFORO) */}
            <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 flex flex-col">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-12 text-center">Salud de Egresos</h3>
                <div className="w-full h-64 mb-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie
                                data={metrics.distribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={15}
                                cornerRadius={10}
                                dataKey="value"
                            >
                                {metrics.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-5">
                    {metrics.distribution.map(d => {
                        const usage = d.budget > 0 ? (d.value / d.budget) * 100 : 0;
                        const statusColor = usage > 100 ? 'bg-rose-500 shadow-rose-500/50' : usage > 85 ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50';
                        return (
                             <div key={d.name} className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 relative group hover:border-white/20 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`} />
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{d.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-black ${usage > 100 ? 'text-rose-500' : 'text-gray-600'}`}>${d.budget.toLocaleString()} Plan</span>
                                </div>
                                <div className="text-3xl font-black text-white italic tracking-tighter leading-none">
                                    ${d.value.toLocaleString()}
                                </div>
                             </div>
                        );
                    })}
                </div>
            </div>

            {/* TABLERO MAESTRO DE FLUJO */}
            <div className="col-span-full p-16 bg-white/[0.02] border border-white/5 rounded-[4.5rem] text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[150px] -mr-48 -mt-48" />
                <div className="flex justify-between items-end mb-16 relative z-10">
                     <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.6em] mb-4">Master Distribution Flow</h3>
                        <p className="text-4xl font-black text-white italic uppercase tracking-tighter">Comparativa Real vs. Presupuesto Planificado</p>
                     </div>
                     <div className="flex gap-10">
                        <ChartLegend color="bg-indigo-500" label="Presupuesto" />
                        <ChartLegend color="bg-emerald-500" label="Ejecutado (Equipo / Oficina)" />
                     </div>
                </div>
                <div className="h-[450px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={metrics.distribution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888', fontWeight: 900, textAnchor: 'middle' }} dy={20} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666', fontWeight: 900 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                            <Bar dataKey="value" barSize={120} radius={[30, 30, 0, 0]}>
                                {metrics.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.1} stroke={entry.color} strokeWidth={3} />
                                ))}
                            </Bar>
                            <Line type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={5} dot={{ r: 8, fill: '#6366f1', strokeWidth: 0 }} />
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
    
    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end px-10 text-left">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`w-4 h-4 rounded-full ${usage > 100 ? 'bg-rose-500' : usage > 85 ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">{config.label}</h2>
                    </div>
                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Seguimiento de costos operativos y ejecución financiera</p>
                </div>
                <div className="text-right">
                    <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest block mb-2 px-3 bg-white/5 py-1 rounded-full">TOTAL AREA ACTUAL</span>
                    <span className="text-7xl font-black text-indigo-500 italic tracking-tighter leading-none">${total.toLocaleString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                 <SummaryCard label="Presupuesto Asignado" val={`$${budget.toLocaleString()}`} icon={Target} color="text-indigo-400" />
                 <SummaryCard label="Variación Neta" val={`${budget - total >= 0 ? '+' : ''}${(budget - total).toLocaleString()}`} icon={ClipboardList} color={budget - total >= 0 ? 'text-emerald-400' : 'text-rose-400'} />
                 <SummaryCard label="Uso de Recursos" val={`${Math.round(usage)}%`} icon={BarChart3} color={usage > 100 ? 'text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-white'} />
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-[4.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="grid grid-cols-1 divide-y divide-white/5">
                    {transactions.length > 0 ? transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-10 px-16 hover:bg-white/[0.03] transition-all group">
                            <div className="flex items-center gap-10 text-left">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center font-black text-xl text-gray-500 transition-all group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                    {tx.subcategory[0]}
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{tx.subcategory}</h4>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{tx.description || 'Proceso Logístico Estándar'}</p>
                                        <div className="w-1 h-1 rounded-full bg-gray-800" />
                                        <span className="text-[10px] font-black text-gray-700 uppercase">{tx.payment_method}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">${Number(tx.amount).toLocaleString()}</p>
                                <div className="flex items-center justify-end gap-2 text-gray-800">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase">{tx.date.split('T')[0]}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-32 text-center opacity-20">
                            <Layers className="w-16 h-16 mx-auto mb-6" />
                            <p className="text-[12px] font-black uppercase tracking-[1em]">Sin registros operativos</p>
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
            <header className="px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                     <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter text-left">Metas Estratégicas</h2>
                     <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3 text-left italic">Escalado Institucional y Objetivos de Negocio</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{metrics.clientCount} Clientes Activos</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* META FIJA: LOS 10 CLIENTES */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-16 rounded-[4.5rem] bg-emerald-500/[0.04] border border-emerald-500/20 relative overflow-hidden group text-left"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-all">
                        <Users className="w-48 h-48 text-emerald-500" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <Award className="w-5 h-5 text-emerald-400" />
                                <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em]">Hito Progresivo</span>
                            </div>
                            <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-6">Misión:<br/>DIIC 10 Clientes</h3>
                            <p className="text-sm text-gray-500 font-bold mb-14 leading-relaxed max-w-sm">Objetivo prioritario para estabilizar el flujo operativo y alcanzar el punto máximo de rentabilidad de la infraestructura actual.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-7xl font-black text-emerald-400 italic tracking-tighter leading-none">{metrics.clientCount}/10</span>
                                <span className="text-[11px] font-black text-gray-600 uppercase mb-2">Completado</span>
                            </div>
                            <div className="w-full h-4 bg-black rounded-full overflow-hidden p-1 border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(metrics.clientCount / 10) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* OTRAS METAS */}
                <div className="grid grid-cols-1 gap-10">
                    {goals.length > 0 ? goals.map(goal => (
                         <div key={goal.id} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-indigo-500/20 transition-all text-left relative overflow-hidden">
                             <div className="absolute right-0 top-0 p-8 opacity-5">
                                <Activity className="w-20 h-20 text-indigo-400" />
                             </div>
                             <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${goal.priority === 'High' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>PRIORIDAD {goal.priority.toUpperCase()}</span>
                                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">{goal.deadline || 'Sin Fecha'}</span>
                                </div>
                                <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">{goal.name}</h4>
                             </div>
                             <div className="flex items-end justify-between mt-10">
                                <div>
                                    <span className="text-4xl font-black text-white italic tracking-tighter">${Number(goal.target_amount).toLocaleString()}</span>
                                    <span className="text-[10px] font-black text-gray-600 uppercase ml-2">Target Inversión</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                     <span className="text-[10px] font-black text-indigo-500 uppercase italic">Activo</span>
                                </div>
                             </div>
                         </div>
                    )) : (
                        <div className="flex items-center justify-center h-full border border-dashed border-white/5 rounded-[3rem] opacity-20">
                            <p className="text-[11px] font-black uppercase tracking-[0.6em]">Awaiting Growth Engines</p>
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
