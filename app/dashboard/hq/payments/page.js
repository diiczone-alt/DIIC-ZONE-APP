'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown,
    PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Wallet, Activity,
    X, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Users,
    FileText, CreditCard, ChevronRight, Zap, Target, ClipboardList, Clapperboard,
    Home, Download, Calendar, Settings, MapPin, Sparkles, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { agencyService } from '@/services/agencyService';
import useRealtimeSync from '@/hooks/useRealtimeSync';

export default function HQFinancePage() {
    const [financeData, setFinanceData] = useState({
        metrics: { income: 0, variable_costs: 0, gross_profit: 0, gross_margin: 0 },
        transactions: [],
        clients: [],
        operatingExpenses: [],
        branches: []
    });
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null); 
    const [selectedYear, setSelectedYear] = useState('2026');

    const loadFinance = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [finData, scaleData, clientsData, opExData, branchesData] = await Promise.all([
                agencyService.getFinancialSummary(),
                agencyService.getScaleData(),
                agencyService.getClients(),
                agencyService.getOperatingExpenses(),
                agencyService.getBranchOffices()
            ]);
            setFinanceData({
                ...finData,
                scale: scaleData,
                clients: clientsData,
                operatingExpenses: opExData || [],
                branches: branchesData || []
            });
        } catch (err) {
            console.error("Error loading finance details:", err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        loadFinance();
    }, []);

    useRealtimeSync(['clients', 'financial_transactions', 'production_rates', 'agency_expenses', 'tasks', 'team'], () => loadFinance(true));

    const { metrics, scale, clients, operatingExpenses = [], branches = [] } = financeData;
    
    // Cost calculations
    const prodCosts = scale?.estimated_production || scale?.production || 0;
    const payrollCosts = scale?.payroll || 0; 
    const swCosts = scale?.software || 0;
    
    // Dynamic calculation of office costs from operating expenses database
    const officeCosts = useMemo(() => {
        return operatingExpenses
            .filter(e => e.status === 'PAGADO' || e.status === 'APROBADO')
            .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    }, [operatingExpenses]);

    const totalExpenses = prodCosts + payrollCosts + swCosts + officeCosts;
    const netProfit = (metrics.income || 0) - totalExpenses;

    const [timeView, setTimeView] = useState('month'); // 'day' | 'week' | 'month'

    // Chart data calculated directly from real database transactions
    const chartData = useMemo(() => {
        const txs = financeData.transactions || [];
        const baseIncome = metrics.income || 9400;
        const baseExpenses = totalExpenses || 8500;

        // Filter transactions for the selected year
        const filteredTxs = txs.filter(tx => {
            if (!tx.date) return false;
            return tx.date.startsWith(selectedYear);
        });

        // 1. If no transactions exist for the selected year (e.g. future years 2027/2028), generate budget projection forecast
        if (filteredTxs.length === 0) {
            const monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const factor = selectedYear === '2027' ? 1.25 : 1.55; 
            
            if (timeView === 'day') {
                return Array.from({ length: 15 }, (_, i) => ({
                    name: `${(i + 1).toString().padStart(2, '0')} Apr`,
                    ingresos: Math.round(baseIncome * factor / 15 * (1 + (Math.sin(i) * 0.1))),
                    gastos: Math.round(baseExpenses * factor / 15 * (1 + (Math.cos(i) * 0.1)))
                }));
            }
            if (timeView === 'week') {
                return Array.from({ length: 5 }, (_, i) => ({
                    name: `Sem ${i + 1}`,
                    ingresos: Math.round(baseIncome * factor / 4 * (1 + (Math.sin(i) * 0.08))),
                    gastos: Math.round(baseExpenses * factor / 4 * (1 + (Math.cos(i) * 0.08)))
                }));
            }
            return monthsShort.map((month, idx) => {
                const waveOffset = Math.sin(idx * 0.8) * (baseExpenses * 0.08);
                const trend = idx * 120;
                return {
                    name: month,
                    ingresos: Math.round((baseIncome - 1200 + trend) * factor),
                    gastos: Math.max(0, Math.round((baseExpenses - 800 + waveOffset + trend * 0.7) * factor))
                };
            });
        }

        // 2. Group by Day
        if (timeView === 'day') {
            const monthsInYear = filteredTxs.map(tx => tx.date.substring(5, 7));
            const latestMonth = monthsInYear.length > 0 ? [...monthsInYear].sort().pop() : '04'; 
            const monthTxs = filteredTxs.filter(tx => tx.date.substring(5, 7) === latestMonth);
            
            const groups = {};
            monthTxs.forEach(tx => {
                const day = tx.date;
                if (!groups[day]) groups[day] = { ingresos: 0, gastos: 0 };
                if (tx.type === 'INCOME') groups[day].ingresos += Number(tx.amount) || 0;
                else if (tx.type === 'EXPENSE') groups[day].gastos += Number(tx.amount) || 0;
            });

            return Object.keys(groups).sort().map(day => {
                const dayLabel = day.substring(8, 10);
                const monthNum = day.substring(5, 7);
                const monthsShort = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
                return {
                    name: `${dayLabel} ${monthsShort[monthNum] || 'M'}`,
                    ingresos: Math.round(groups[day].ingresos),
                    gastos: Math.round(groups[day].gastos)
                };
            });
        } 
        
        // 3. Group by Week
        if (timeView === 'week') {
            const getWeekNumber = (d) => {
                const date = new Date(d);
                const oneJan = new Date(date.getFullYear(), 0, 1);
                const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
                return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
            };

            const groups = {};
            filteredTxs.forEach(tx => {
                const weekNum = getWeekNumber(tx.date);
                const label = `W${weekNum}`;
                if (!groups[label]) groups[label] = { week: weekNum, ingresos: 0, gastos: 0 };
                if (tx.type === 'INCOME') groups[label].ingresos += Number(tx.amount) || 0;
                else if (tx.type === 'EXPENSE') groups[label].gastos += Number(tx.amount) || 0;
            });

            return Object.values(groups)
                .sort((a, b) => a.week - b.week)
                .map(g => ({
                    name: `Sem ${g.week}`,
                    ingresos: Math.round(g.ingresos),
                    gastos: Math.round(g.gastos)
                }));
        }

        // 4. Group by Month (Default)
        const monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyGroups = Array.from({ length: 12 }, (_, i) => ({
            name: monthsShort[i],
            ingresos: 0,
            gastos: 0
        }));

        filteredTxs.forEach(tx => {
            const monthIdx = parseInt(tx.date.substring(5, 7), 10) - 1;
            if (monthIdx >= 0 && monthIdx < 12) {
                if (tx.type === 'INCOME') monthlyGroups[monthIdx].ingresos += Number(tx.amount) || 0;
                else if (tx.type === 'EXPENSE') monthlyGroups[monthIdx].gastos += Number(tx.amount) || 0;
            }
        });

        return monthlyGroups.map(g => ({
            name: g.name,
            ingresos: Math.round(g.ingresos),
            gastos: Math.round(g.gastos)
        }));
    }, [financeData.transactions, selectedYear, timeView, metrics.income, totalExpenses]);

    // Donut chart distribution data
    const donutData = useMemo(() => {
        return [
            { name: 'Producción Real', value: prodCosts || 2020, color: '#38bdf8' },
            { name: 'Nómina Staff', value: payrollCosts || 1200, color: '#a855f7' },
            { name: 'SaaS & Infra', value: swCosts || 45, color: '#6366f1' },
            { name: 'Oficina & Sedes', value: officeCosts || 450, color: '#f43f5e' },
            { name: 'Otros', value: 150, color: '#e2e8f0' }
        ];
    }, [prodCosts, payrollCosts, swCosts, officeCosts]);

    // Radar chart data for department evaluation
    const radarData = useMemo(() => {
        return [
            { subject: 'Diseño / UX', A: 85, B: 90, fullMark: 100 },
            { subject: 'Edición Video', A: 95, B: 85, fullMark: 100 },
            { subject: 'SaaS / Licencias', A: 70, B: 60, fullMark: 100 },
            { subject: 'Oficinas', A: 60, B: 75, fullMark: 100 },
            { subject: 'Marketing / Ads', A: 80, B: 90, fullMark: 100 }
        ];
    }, []);

    // Sparkline data for Cash Flow
    const sparklineData = useMemo(() => {
        return [
            { value: 12000 },
            { value: 13500 },
            { value: 12800 },
            { value: 15000 },
            { value: 16200 },
            { value: 17900 }
        ];
    }, []);

    // Dynamic Sede expenses distribution calculated from branches and operating expenses database
    const sedeDistribution = useMemo(() => {
        if (!branches.length) return [];
        
        const distribution = branches.map(branch => {
            const branchExpenses = operatingExpenses
                .filter(e => e.branch_id === branch.id && (e.status === 'PAGADO' || e.status === 'APROBADO'))
                .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
                
            return {
                id: branch.id,
                name: branch.name,
                value: branchExpenses,
                city: branch.city || 'Remoto'
            };
        });
        
        // Add a "Remoto Global" or "Otros" if there are expenses with no branch_id
        const remoteExpenses = operatingExpenses
            .filter(e => !e.branch_id && (e.status === 'PAGADO' || e.status === 'APROBADO'))
            .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
            
        if (remoteExpenses > 0 || distribution.length === 0) {
            distribution.push({
                id: 'remote',
                name: 'Remoto Global',
                value: remoteExpenses || 120, 
                city: 'Remoto'
            });
        }
        
        const total = distribution.reduce((acc, d) => acc + d.value, 0) || 1;
        return distribution.map(d => ({
            ...d,
            percent: Math.round((d.value / total) * 100)
        })).sort((a, b) => b.value - a.value);
    }, [branches, operatingExpenses]);

    const handlePieClick = (name) => {
        if (name.includes('Producción')) {
            setActiveModal('costs');
        } else if (name.includes('Nómina') || name.includes('Staff')) {
            setActiveModal('expenses');
        } else if (name.includes('SaaS') || name.includes('Infra')) {
            setActiveModal('expenses');
        } else if (name.includes('Oficina') || name.includes('Sedes')) {
            setActiveModal('sedes');
        } else {
            setActiveModal('expenses');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-indigo-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Auditando Costos Operativos...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05050A] text-white selection:bg-indigo-500/30 font-sans pb-20">
            {/* FULL WIDTH STICKY HEADER - Eliminates upper cutoff visual leaks */}
            <div className="sticky top-0 z-50 w-full bg-[#05050A]/90 backdrop-blur-xl border-b border-white/5 py-5 px-8">
                <header className="max-w-[1800px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight uppercase italic leading-none">Gobernanza Financiera</h2>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Realtime Trading Mode — DIIC ZONE 2026</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                         <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                             <span>Live Feed</span>
                         </div>
                         <button 
                            onClick={() => loadFinance(false)}
                            className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl active:scale-95"
                         >
                             <RefreshCw className="w-3.5 h-3.5" /> Sincronizar
                         </button>
                    </div>
                </header>
            </div>

            <main className="p-8 max-w-[1800px] mx-auto space-y-10">
                
                {/* 1. UPPER ROW: PREMIUM KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    
                    {/* CARD 1: Total Cash Flow with Sparkline */}
                    <div className="p-6 rounded-[2rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-[150px] relative group hover:border-[#38bdf8]/30 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Total Cash Flow</p>
                            <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
                                <ArrowUpRight className="w-2.5 h-2.5" /> +19%
                            </span>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                            <div>
                                <h4 className="text-3xl font-black italic tracking-tighter text-white">${(metrics.income * 1.9).toLocaleString(undefined, {maximumFractionDigits: 0})}</h4>
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1 font-mono">Real vs Project</p>
                            </div>
                            <div className="w-[80px] h-[35px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sparklineData}>
                                        <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} fill="rgba(56, 189, 248, 0.1)" dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Total Balance */}
                    <div className="p-6 rounded-[2rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-[150px] relative group hover:border-purple-500/30 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Total Balance</p>
                            <span className="text-[8px] font-black bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-0.5">
                                <ArrowDownRight className="w-2.5 h-2.5" /> -63%
                            </span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black italic tracking-tighter text-white">${netProfit.toLocaleString(undefined, {maximumFractionDigits: 0})}</h4>
                            <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1 font-mono">vs last month</p>
                        </div>
                    </div>

                    {/* CARD 3: SOLID EXPENSES CARD (Vibrant Orange/Red Block Card) */}
                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 shadow-2xl shadow-orange-500/10 flex flex-col justify-between h-[150px] text-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer" onClick={() => setActiveModal('expenses')}>
                        <div className="flex justify-between items-start">
                            <p className="text-[9px] font-black text-white/80 uppercase tracking-widest leading-none">Expenses</p>
                            <span className="text-[8px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <ArrowUpRight className="w-2.5 h-2.5" /> +21%
                            </span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black italic tracking-tighter text-white">${totalExpenses.toLocaleString(undefined, {maximumFractionDigits: 0})}</h4>
                            <p className="text-[8px] text-white/70 uppercase tracking-widest mt-1 font-mono">vs last month</p>
                        </div>
                    </div>

                    {/* CARD 4: Income */}
                    <div className="p-6 rounded-[2rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-[150px] relative group hover:border-[#10b981]/30 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Income</p>
                            <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
                                <ArrowDownRight className="w-2.5 h-2.5" /> -0%
                            </span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black italic tracking-tighter text-white">${metrics.income.toLocaleString(undefined, {maximumFractionDigits: 0})}</h4>
                            <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1 font-mono">vs last month</p>
                        </div>
                    </div>

                    {/* CARD 5: Goals Accumulation */}
                    <div className="p-6 rounded-[2rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-[150px] relative group hover:border-blue-500/30 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Goals Accumulation</p>
                            <button onClick={() => setActiveModal('costs')} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                <Download className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[8px] text-gray-500 uppercase tracking-widest">Average</span>
                                <span className="text-xs font-black text-white italic">56%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full p-[1px]">
                                <div className="h-full rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" style={{ width: '56%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. GRID SYSTEM LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* LEFT PANEL: GOALS & SEDES */}
                    <div className="space-y-6">
                        
                        {/* Box 1: Goals progress meters */}
                        <div className="p-8 rounded-[2.5rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Goals progress</p>
                                <span className="text-[8px] text-indigo-400 font-bold uppercase font-mono">56% Total</span>
                            </div>
                            <div className="space-y-4">
                                <GoalProgressItem label="Producción Real" value={823} percent={91} color="from-[#38bdf8] to-[#0ea5e9]" onClick={() => setActiveModal('costs')} />
                                <GoalProgressItem label="Nómina Staff" value={548} percent={49} color="from-purple-500 to-indigo-600" onClick={() => setActiveModal('expenses')} />
                                <GoalProgressItem label="SaaS & Licencias" value={758} percent={42} color="from-blue-500 to-indigo-600" onClick={() => setActiveModal('expenses')} />
                                <GoalProgressItem label="Gastos Oficina" value={612} percent={41} color="from-rose-500 to-pink-600" onClick={() => setActiveModal('sedes')} />
                            </div>
                        </div>

                        {/* Box 2: Sedes / Accounts */}
                        <div className="p-8 rounded-[2.5rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Distribución Sedes</p>
                                <span className="text-[9px] text-[#38bdf8] font-bold italic">${officeCosts.toLocaleString()}</span>
                            </div>
                            <div className="space-y-4">
                                {sedeDistribution.map((sede, idx) => {
                                    const icon = idx === 0 ? Building : (idx === 1 ? MapPin : (idx === 2 ? Activity : Home));
                                    return (
                                        <button 
                                            key={sede.id}
                                            onClick={() => setActiveModal('sedes')}
                                            className="w-full flex items-center justify-between py-1.5 border-b border-white/[0.02] hover:bg-white/5 px-2 rounded-lg transition-all text-left"
                                        >
                                            <div className="flex items-center gap-2.5 truncate max-w-[160px]">
                                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <Building className="w-3.5 h-3.5 text-gray-500" />
                                                </div>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider truncate">{sede.name}</span>
                                            </div>
                                            <div className="text-right flex items-center gap-1.5">
                                                <span className="text-[10px] font-black text-white font-mono">${sede.value.toLocaleString()}</span>
                                                <span className="text-[8px] text-gray-500 font-mono">({sede.percent}%)</span>
                                            </div>
                                        </button>
                                    );
                                })}
                                {sedeDistribution.length === 0 && (
                                    <p className="text-center text-[9px] text-gray-600 font-black uppercase py-4">Sin datos de sedes</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CENTER PANEL: EXPENSES DONUT CHART */}
                    <div className="p-8 rounded-[2.5rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-full min-h-[480px]">
                        <div>
                            <div className="space-y-1 mb-8 text-left">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">Distribución Egresos</h3>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em]">Expenses Breakdown</p>
                            </div>

                            {/* Donut Chart with glowing center */}
                            <div className="relative w-full h-[220px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {donutData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color} 
                                                    onClick={() => handlePieClick(entry.name)}
                                                    className="cursor-pointer hover:opacity-80 transition-all outline-none"
                                                    style={{ filter: `drop-shadow(0 0 6px ${entry.color}44)` }} 
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 font-mono">Gastos Totales</p>
                                    <p className="text-3xl font-black italic tracking-tighter text-white">
                                        ${totalExpenses.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Colored Legenda matching the donut colors */}
                        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/5">
                            {donutData.map((item, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => handlePieClick(item.name)}
                                    className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-lg transition-all text-left group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate group-hover:text-white transition-colors">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL: AREA & RADAR CHARTS (2 Cols wide) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Box 1: Expenses Dynamics Curve (Burn Rate) */}
                        <div className="p-8 rounded-[2.5rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 relative z-10 gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Dinámica de Gastos</h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[9px] font-bold uppercase tracking-wider text-gray-500 text-left">
                                        <span>Ingresos: <strong className="text-emerald-400 font-mono">${metrics.income?.toLocaleString()}</strong></span>
                                        <span>•</span>
                                        <span>Gastos: <strong className="text-rose-400 font-mono">${totalExpenses?.toLocaleString()}</strong></span>
                                        <span>•</span>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black ${netProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                            Neto: ${netProfit?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Temporal zoom selection tabs */}
                                    <div className="flex items-center gap-1.5 bg-[#090A15]/60 p-1 rounded-xl border border-white/[0.08] backdrop-blur-md">
                                        {[
                                            { id: 'day', label: 'Día (1D)' },
                                            { id: 'week', label: 'Sem. (7D)' },
                                            { id: 'month', label: 'Mes (30D)' }
                                        ].map(view => (
                                            <button 
                                                key={view.id}
                                                onClick={() => setTimeView(view.id)}
                                                className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${timeView === view.id ? 'bg-gradient-to-r from-[#38bdf8] to-indigo-500 text-black shadow-[0_0_8px_rgba(56,189,248,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Year selection tabs */}
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                        {['2026', '2027', '2028'].map(year => (
                                            <button 
                                                key={year}
                                                onClick={() => setSelectedYear(year)}
                                                className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${selectedYear === year ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[200px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="glowIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="glowExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid 
                                            strokeDasharray="3 3" 
                                            stroke="rgba(255, 255, 255, 0.02)" 
                                            vertical={true}
                                            horizontal={true}
                                        />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#4b5563', fontSize: 8, fontWeight: '700' }} 
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.2rem' }}
                                            labelStyle={{ color: '#38bdf8', fontWeight: '900', fontSize: '9px', marginBottom: '4px' }}
                                            itemStyle={{ textTransform: 'uppercase', fontWeight: '800', fontSize: '8px' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="ingresos" 
                                            stroke="#38bdf8" 
                                            strokeWidth={3} 
                                            fillOpacity={1} 
                                            fill="url(#glowIncome)" 
                                            activeDot={{ r: 5, strokeWidth: 2, fill: '#05050A' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="gastos" 
                                            stroke="#f43f5e" 
                                            strokeWidth={3} 
                                            fillOpacity={1}
                                            fill="url(#glowExpense)" 
                                            activeDot={{ r: 5, strokeWidth: 2, fill: '#05050A' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Box 2: Radar Chart Comparison & Action */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Department Radar Chart */}
                            <div className="p-6 rounded-[2rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl h-[230px] flex flex-col justify-between">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic px-1 block">Áreas de impacto</span>
                                <div className="w-full h-[160px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                            <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 7, fontWeight: '700' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Meta" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
                                            <Radar name="Real" dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Tactical Call To Action Panel */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-tr from-indigo-500/10 via-transparent to-[#38bdf8]/10 border border-white/5 shadow-2xl flex flex-col justify-between h-[230px] relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#38bdf8]/5 rounded-full blur-[80px]" />
                                <div className="space-y-3 relative z-10">
                                    <p className="text-[9px] font-black text-[#38bdf8] uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5" /> Auditoría Central
                                    </p>
                                    <h4 className="text-lg font-black italic text-white uppercase tracking-tight leading-tight">Control de Libro Contable</h4>
                                    <p className="text-[9px] text-gray-400 leading-relaxed font-bold uppercase tracking-wide">
                                        Visualiza el desglose completo del personal asignado y las licencias de software activas en DIIC ZONE.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setActiveModal('expenses')}
                                    className="w-full py-4 rounded-xl bg-white text-black hover:bg-gray-100 transition-all font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-xl relative z-10"
                                >
                                     <span>Auditar lo que pagamos</span>
                                     <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            {/* MODALS SECTION */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-transparent"
                        />
                        <motion.div 
                            drag
                            dragMomentum={false}
                            dragElastic={0.05}
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 50, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="w-full max-w-md bg-[#080916]/75 border border-white/20 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl z-10 max-h-[80vh] overflow-y-auto custom-scrollbar shadow-[#38bdf8]/10 hover:border-[#38bdf8]/40 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* iPhone Sheet Handle / Drag Bar */}
                            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing hover:bg-white/30 transition-colors" title="Arrastra para mover" />
                            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-white transition-all flex items-center justify-center border border-white/5 z-50"><X className="w-4 h-4" /></button>

                            {/* 1. COSTS / LIBRO DE OPERACIONES */}
                            {activeModal === 'costs' && (
                                <div className="space-y-6">
                                     <div className="space-y-1 border-b border-white/5 pb-4">
                                         <div className="flex items-center gap-2">
                                             <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                             <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Libro de Operaciones</h4>
                                         </div>
                                         <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider pl-4">Desglose de tareas y costos internos.</p>
                                     </div>

                                     <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                         {(scale?.production_ledger || []).map((t, i) => (
                                             <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-4 text-left">
                                                 <div className="flex items-center gap-3">
                                                     <div className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] animate-pulse" />
                                                     <div>
                                                         <p className="text-xs font-black text-white uppercase tracking-tight">{t.title}</p>
                                                         <div className="flex items-center gap-2 mt-1">
                                                             <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t.format}</span>
                                                             <span className="text-[8px] text-gray-700">•</span>
                                                             <span className="text-[8px] font-black text-[#a855f7] uppercase tracking-wider">{t.assigned_to || 'Sin asignar'}</span>
                                                         </div>
                                                     </div>
                                                 </div>
                                                 <div className="text-right flex flex-col items-end">
                                                     <p className="text-sm font-black text-emerald-400 font-mono">${t.cost}</p>
                                                     <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5 mt-1 inline-block">{t.client}</span>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                     <div className="flex justify-between items-center bg-indigo-500/5 p-5 rounded-2xl border border-indigo-500/10">
                                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 italic font-mono">Total Producción</span>
                                          <span className="text-xl font-black italic tracking-tighter text-white">${prodCosts?.toLocaleString()}</span>
                                     </div>
                                </div>
                            )}

                            {/* 2. EXPENSES AUDIT */}
                            {activeModal === 'expenses' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2 border-b border-white/5 pb-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Auditoría Egresos</h4>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pl-4">
                                            <p className="text-gray-500 text-[8px] font-black uppercase tracking-wider">Reporte Consolidado Egresos</p>
                                            <p className="text-lg font-black text-white italic tracking-tighter">${totalExpenses?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        <section className="space-y-4">
                                            <div className="flex justify-between items-center px-1">
                                                <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic">Nómina Talento HQ</h5>
                                                <span className="text-[8px] font-black p-1 px-2.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">{scale?.itemized_payroll?.length || 0} Integrantes</span>
                                            </div>
                                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                                {(scale?.itemized_payroll || []).map((m, i) => (
                                                    <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-3 text-left">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-[9px] font-black text-indigo-400 border border-indigo-500/20">{m.name[0]}</div>
                                                            <div>
                                                                <p className="font-black text-white text-xs uppercase truncate max-w-[120px]">{m.name}</p>
                                                                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-0.5">{m.role}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-black text-white italic text-sm font-mono">${m.salary?.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-widest italic px-1">Infraestructura & SaaS</h5>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                                                {(scale?.itemized_software || []).map((sw, i) => (
                                                    <div key={i} className="flex justify-between items-center group text-[11px]">
                                                        <span className="font-bold text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">{sw.name}</span>
                                                        <span className="font-black italic text-white">${Number(sw.amount || 0).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                                <div className="h-px bg-white/5 my-1" />
                                                <div className="flex justify-between items-center text-blue-400 px-2 py-1 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[10px]">
                                                    <span className="font-black uppercase tracking-wider">Inversión mensual</span>
                                                    <span className="font-black italic text-sm">${scale?.software}</span>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h5 className="text-[9px] font-black text-purple-400 uppercase tracking-widest italic px-1">Análisis Estructural</h5>
                                            <div className="bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-4">
                                                <div className="space-y-3">
                                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Zap className="w-3 h-3" /> Punto de Equilibrio
                                                    </p>
                                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(((metrics.income || 1) / (totalExpenses || 1)) * 100, 100)}%` }}
                                                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-[#38bdf8] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]" 
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase tracking-wider px-1 italic">
                                                        <span>Ingreso: ${metrics.income}</span>
                                                        <span>Target: ${totalExpenses}</span>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 italic leading-relaxed pl-4 border-l-2 border-indigo-500/30">
                                                    Cubres el **{Math.round(((metrics.income || 0) / (totalExpenses || 1)) * 100)}%** de tus egresos. <br/>
                                                    <span className="text-white">Déficit: **${(totalExpenses - (metrics.income || 0)).toLocaleString()}**</span>
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}

                            {/* 3. MRR AUDIT */}
                            {activeModal === 'mrr' && (
                                <div className="space-y-6">
                                     <div className="space-y-1 border-b border-white/5 pb-4">
                                         <div className="flex items-center gap-2">
                                             <div className="w-1.5 h-6 bg-[#38bdf8] rounded-full" />
                                             <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">MRR Real Audit</h4>
                                         </div>
                                         <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider pl-4">Auditoría de Ingresos Recurrentes.</p>
                                     </div>
                                     <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                         {clients.map((c, i) => (
                                             <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#38bdf8]/20 transition-all flex items-center justify-between gap-4 text-left">
                                                 <div>
                                                     <p className="text-xs font-black text-white uppercase tracking-tight">{c.name}</p>
                                                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1 inline-block ${
                                                         (c.status === 'active' || c.status === 'ONBOARDING_COMPLETED') 
                                                             ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                             : c.status === 'trial'
                                                                 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                 : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                     }`}>
                                                         {(c.status === 'active' || c.status === 'ONBOARDING_COMPLETED') ? 'Contratado' : c.status === 'trial' ? 'Prueba' : 'Inactivo'}
                                                     </span>
                                                 </div>
                                                 <span className="text-sm font-black italic text-emerald-400 font-mono">
                                                     ${(c.status === 'active' || c.status === 'trial' || c.status === 'ONBOARDING_COMPLETED') ? Number(c.price || 0).toLocaleString() : '0'}
                                                 </span>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            )}

                            {/* 4. FINAL UTILITY AUDIT */}
                            {activeModal === 'final' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2 border-b border-white/5 pb-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Análisis de Utilidad</h4>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pl-4">
                                            <p className="text-gray-500 text-[8px] font-black uppercase tracking-wider">Balance Operativo</p>
                                            <p className={`text-lg font-black italic tracking-tighter ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                                ${netProfit?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6 items-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 py-2 w-full">
                                            <div className="relative w-44 h-44">
                                                <UtilityDonutChart 
                                                    percentage={Math.max(0, Math.min(100, (netProfit / (metrics.income || 1)) * 100))} 
                                                    color={netProfit > 0 ? '#10b981' : '#f43f5e'} 
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Margen Neto</p>
                                                    <p className={`text-2xl font-black italic tracking-tighter ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                                        {Math.round((netProfit / (metrics.income || 1)) * 100)}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-3">
                                                <div className="grid grid-cols-2 gap-2 text-[8px]">
                                                    <DistributionTag label="Operativo" color="emerald" active={netProfit > 0} />
                                                    <DistributionTag label="Gastos" color="rose" active={totalExpenses > 0} />
                                                    <DistributionTag label="Staff" color="indigo" active={payrollCosts > 0} />
                                                    <DistributionTag label="Infra" color="purple" active={swCosts > 0} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-3">
                                            <div className="space-y-2">
                                                <CalculationRow 
                                                    icon={TrendingUp}
                                                    label="Ingresos (MRR)" 
                                                    description="Facturación bruta total"
                                                    value={`$${metrics.income?.toLocaleString()}`} 
                                                    type="income" 
                                                    delay={0}
                                                />
                                                <CalculationRow 
                                                    icon={Clapperboard}
                                                    label="Producción" 
                                                    description="Costo dinámico tareas"
                                                    value={`-$${prodCosts?.toLocaleString()}`} 
                                                    type="expense" 
                                                    delay={0.05}
                                                />
                                                <CalculationRow 
                                                    icon={Users}
                                                    label="Nómina" 
                                                    description="Sueldos staff"
                                                    value={`-$${payrollCosts?.toLocaleString()}`} 
                                                    type="expense" 
                                                    delay={0.1}
                                                />
                                            </div>

                                            <motion.div 
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className={`mt-4 p-6 rounded-2xl border flex justify-between items-center overflow-hidden relative ${
                                                    netProfit > 0 
                                                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                                                    : 'bg-rose-500/5 border-rose-500/20'
                                                }`}
                                            >
                                                <div>
                                                    <h3 className="text-sm font-black italic text-white uppercase tracking-tight mb-1">Utilidad Operativa</h3>
                                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">
                                                        Balance Neto Operacional.
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-2xl font-black italic tracking-tighter ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                                        ${netProfit?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 5. OFICINAS & SEDES AUDIT MODAL */}
                            {activeModal === 'sedes' && (
                                <div className="space-y-6">
                                     <div className="flex flex-col gap-2 border-b border-white/5 pb-4 text-left">
                                         <div className="flex items-center gap-2">
                                             <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                                             <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Egresos por Sedes</h4>
                                         </div>
                                         <div className="flex justify-between items-center mt-2 pl-4">
                                             <p className="text-gray-500 text-[8px] font-black uppercase tracking-wider">Gasto Total por Oficinas</p>
                                             <p className="text-lg font-black text-white italic tracking-tighter">${officeCosts?.toLocaleString()}</p>
                                         </div>
                                     </div>

                                     <div className="grid grid-cols-1 gap-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                         {branches.map(branch => {
                                             const branchItems = operatingExpenses.filter(e => e.branch_id === branch.id);
                                             const branchSum = branchItems.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
                                             return (
                                                 <section key={branch.id} className="space-y-3">
                                                     <div className="flex justify-between items-center px-1">
                                                         <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-wider italic">{branch.name}</h5>
                                                         <span className="text-[9px] font-mono font-black p-0.5 px-2 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">${branchSum.toLocaleString()}</span>
                                                     </div>
                                                     <div className="space-y-2">
                                                         {branchItems.map((e, idx) => (
                                                             <div key={idx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-3 text-left text-[11px]">
                                                                 <div>
                                                                     <p className="font-bold text-white uppercase">{e.item}</p>
                                                                     <p className="text-[8px] text-gray-500 uppercase font-mono mt-0.5">{e.category} • {e.type}</p>
                                                                 </div>
                                                                 <div className="text-right flex flex-col items-end">
                                                                     <span className="font-bold text-white font-mono">${Number(e.amount || 0).toLocaleString()}</span>
                                                                     <span className={`px-1.5 py-0.5 text-[7px] font-black uppercase rounded mt-1 inline-block ${e.status === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                                         {e.status}
                                                                     </span>
                                                                 </div>
                                                             </div>
                                                         ))}
                                                         {branchItems.length === 0 && (
                                                             <p className="text-center text-[9px] text-gray-600 font-black uppercase py-4">Sin egresos registrados</p>
                                                         )}
                                                     </div>
                                                 </section>
                                             );
                                         })}
                                     </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function GoalProgressItem({ label, value, percent, color, onClick }) {
    return (
        <button onClick={onClick} className="w-full text-left block group">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[130px] group-hover:text-white transition-colors">{label}</span>
                <span className="text-[9px] font-mono text-gray-400 font-bold group-hover:text-white transition-colors">${value} ({percent}%)</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${percent}%` }} />
            </div>
        </button>
    );
}

function SedeCostRow({ label, value, percent, icon: Icon }) {
    return (
        <div className="flex items-center justify-between py-1 border-b border-white/[0.02]">
            <div className="flex items-center gap-2.5 truncate max-w-[160px]">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider truncate">{label}</span>
            </div>
            <div className="text-right">
                <span className="text-[10px] font-black text-white font-mono">${value}</span>
                <span className="text-[8px] text-gray-500 font-mono ml-2">({percent}%)</span>
            </div>
        </div>
    );
}

function CalculationRow({ label, value, type, icon: Icon, description, delay = 0 }) {
    const isIncome = type === 'income';
    return (
        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="flex justify-between items-center group py-5 px-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-105 ${
                     isIncome 
                     ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                     : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                 }`}>
                     <Icon className="w-5 h-5" />
                 </div>
                 <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest mb-1 leading-none">{label}</p>
                      <p className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] leading-none">{description}</p>
                 </div>
            </div>
            <div className="text-right">
                 <span className={`text-2xl font-black italic tracking-tighter ${isIncome ? 'text-emerald-400' : 'text-white/90'}`}>
                     {value}
                 </span>
            </div>
        </motion.div>
    );
}

function UtilityDonutChart({ percentage, color }) {
    const size = 280;
    const strokeWidth = 12;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth={strokeWidth}
            />
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 10px ${color}55)` }}
            />
        </svg>
    );
}

function DistributionTag({ label, color, active }) {
    const colorMap = {
        emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5',
        rose: 'text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-rose-500/5',
        indigo: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5 shadow-indigo-500/5',
        purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5 shadow-purple-500/5',
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${
            active ? colorMap[color] : 'text-gray-700 border-white/5 opacity-50'
        }`}>
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: active ? 'currentColor' : '#1e293b' }} />
            {label}
        </div>
    );
}
