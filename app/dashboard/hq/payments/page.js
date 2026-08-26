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
        clients: []
    });
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null); 
    const [selectedYear, setSelectedYear] = useState('2026');

    const loadFinance = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [finData, scaleData, clientsData] = await Promise.all([
                agencyService.getFinancialSummary(),
                agencyService.getScaleData(),
                agencyService.getClients()
            ]);
            setFinanceData({
                ...finData,
                scale: scaleData,
                clients: clientsData
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

    const { metrics, scale, clients } = financeData;
    
    // Cost calculations
    const prodCosts = scale?.estimated_production || scale?.production || 0;
    const payrollCosts = scale?.payroll || 0; 
    const swCosts = scale?.software || 0;
    const officeCosts = 450; // Mock average office/sedes cost
    const totalExpenses = prodCosts + payrollCosts + swCosts + officeCosts;
    const netProfit = (metrics.income || 0) - totalExpenses;

    const [liveTicker, setLiveTicker] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveTicker(prev => {
                const step = (Math.random() - 0.5) * 15;
                if (Math.abs(prev + step) > 200) return prev - step;
                return prev + step;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Chart mock data synced with database scale
    const chartData = useMemo(() => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const baseIncome = metrics.income || 9400;
        const baseExpenses = totalExpenses || 8500;

        return months.map((month, idx) => {
            const waveOffset = Math.sin(idx * 0.8) * (baseExpenses * 0.08);
            const trend = idx * 120;
            const ticker = idx === 7 ? liveTicker : 0; // Highlight current month dynamics

            return {
                name: month,
                ingresos: Math.round(baseIncome - 1200 + trend + ticker),
                gastos: Math.max(0, Math.round(baseExpenses - 800 + waveOffset + trend * 0.7 + ticker * 0.5))
            };
        });
    }, [metrics.income, totalExpenses, liveTicker]);

    // Donut chart distribution data
    const donutData = useMemo(() => {
        return [
            { name: 'Producción Real', value: prodCosts || 2020, color: '#38bdf8' },
            { name: 'Nómina Staff', value: payrollCosts || 1200, color: '#a855f7' },
            { name: 'SaaS & Infra', value: swCosts || 45, color: '#6366f1' },
            { name: 'Oficina & Sedes', value: officeCosts, color: '#f43f5e' },
            { name: 'Otros', value: 150, color: '#e2e8f0' }
        ];
    }, [prodCosts, payrollCosts, swCosts]);

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
                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 shadow-2xl shadow-orange-500/10 flex flex-col justify-between h-[150px] text-white hover:scale-[1.02] transition-transform duration-300">
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
                                <GoalProgressItem label="Producción Real" value={823} percent={91} color="from-[#38bdf8] to-[#0ea5e9]" />
                                <GoalProgressItem label="Nómina Staff" value={548} percent={49} color="from-purple-500 to-indigo-600" />
                                <GoalProgressItem label="SaaS & Licencias" value={758} percent={42} color="from-blue-500 to-indigo-600" />
                                <GoalProgressItem label="Gastos Oficina" value={612} percent={41} color="from-rose-500 to-pink-600" />
                            </div>
                        </div>

                        {/* Box 2: Sedes / Accounts */}
                        <div className="p-8 rounded-[2.5rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Distribución Sedes</p>
                                <span className="text-[9px] text-[#38bdf8] font-bold italic">$7,519</span>
                            </div>
                            <div className="space-y-4">
                                <SedeCostRow label="Santo Domingo" value={2257} percent={30} icon={Building} />
                                <SedeCostRow label="Quito Nodo" value={1849} percent={25} icon={MapPin} />
                                <SedeCostRow label="Manta Sede" value={1778} percent={24} icon={Activity} />
                                <SedeCostRow label="Remoto Global" value={1635} percent={21} icon={Home} />
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
                                                <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}44)` }} />
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
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL: AREA & RADAR CHARTS (2 Cols wide) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Box 1: Expenses Dynamics Curve (Burn Rate) */}
                        <div className="p-8 rounded-[2.5rem] bg-[#0E0F1D]/80 border border-[#1E2235]/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Expenses Dynamics</h3>
                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                        <span className="text-[9px] font-black text-gray-400 italic">
                                            Ticker: ${(metrics.income + liveTicker).toFixed(2)} USD
                                        </span>
                                        <div className="flex items-center gap-2 px-3 py-0.5 bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded-full text-[8px] font-black uppercase tracking-widest text-[#38bdf8] animate-pulse">
                                            <span className="w-1 h-1 rounded-full bg-[#38bdf8]" />
                                            <span>Trading Mode</span>
                                        </div>
                                    </div>
                                </div>

                                {/* period selection tabs matching mockup */}
                                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                    {['2026', '2027', '2028'].map(year => (
                                        <button 
                                            key={year}
                                            onClick={() => setSelectedYear(year)}
                                            className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${selectedYear === year ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {year}
                                        </button>
                                    ))}
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
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-3xl"
                        />
                        <motion.div 
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-5xl bg-[#0A0B1A]/95 border border-[#1E2235]/80 rounded-t-[3rem] md:rounded-[4rem] p-10 md:p-14 shadow-2xl relative overflow-hidden backdrop-blur-3xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setActiveModal(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 hover:bg-rose-500/20 text-gray-500 hover:text-white transition-all flex items-center justify-center border border-white/5"><X className="w-5 h-5" /></button>

                            {/* 1. COSTS / LIBRO DE OPERACIONES */}
                            {activeModal === 'costs' && (
                                <div className="space-y-12">
                                     <div className="space-y-2 border-b border-white/5 pb-10">
                                         <div className="flex items-center gap-3">
                                             <div className="w-2.5 h-8 bg-indigo-500 rounded-full" />
                                             <h4 className="text-4xl font-black uppercase italic tracking-tighter text-white">Libro de Operaciones</h4>
                                         </div>
                                         <p className="text-gray-500 text-xs font-medium italic pl-5 tracking-wide">Desglose de tareas realizadas y sus costos internos asociados.</p>
                                     </div>

                                     <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                                         <table className="w-full text-left">
                                             <thead>
                                                 <tr className="bg-[#0D0E1D] border-b border-white/5">
                                                     <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest">Lo que se está haciendo (Tarea)</th>
                                                     <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest text-center">Cliente</th>
                                                     <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">Lo que estamos pagando</th>
                                                 </tr>
                                             </thead>
                                             <tbody className="divide-y divide-white/5">
                                                 {(scale?.production_ledger || []).map((t, i) => (
                                                     <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                         <td className="px-8 py-6">
                                                             <div className="flex items-center gap-3">
                                                                 <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                                                                 <div>
                                                                     <p className="text-sm font-black text-white uppercase italic tracking-tight">{t.title}</p>
                                                                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.format}</p>
                                                                 </div>
                                                             </div>
                                                         </td>
                                                         <td className="px-8 py-6 text-center">
                                                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{t.client}</span>
                                                         </td>
                                                         <td className="px-8 py-6 text-right font-black text-emerald-400 italic text-xl">${t.cost}</td>
                                                     </tr>
                                                 ))}
                                             </tbody>
                                         </table>
                                     </div>
                                     <div className="flex justify-between items-center bg-indigo-500/5 p-8 rounded-[2rem] border border-indigo-500/10">
                                          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 italic">Total Costos Producción</span>
                                          <span className="text-4xl font-black italic tracking-tighter text-white">${prodCosts?.toLocaleString()}</span>
                                     </div>
                                </div>
                            )}

                            {/* 2. EXPENSES AUDIT */}
                            {activeModal === 'expenses' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-8 bg-indigo-500 rounded-full" />
                                                <h4 className="text-4xl font-black uppercase italic tracking-tighter text-white">Auditoría Egresos</h4>
                                            </div>
                                            <p className="text-gray-500 text-xs font-medium italic pl-5 tracking-wide">Reporte Consolidado de Gastos Operativos — Abril 2026</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Gasto Mensual Real</p>
                                            <p className="text-5xl font-black text-white italic tracking-tighter">${totalExpenses?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <section className="space-y-8">
                                            <div className="flex justify-between items-center">
                                                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Nómina Talento HQ</h5>
                                                <span className="text-[9px] font-black p-1.5 px-3 bg-indigo-500/10 text-indigo-300 rounded-lg">{scale?.itemized_payroll?.length || 0} Integrantes</span>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                                                <table className="w-full text-left">
                                                    <tbody className="divide-y divide-white/5">
                                                        {(scale?.itemized_payroll || []).map((m, i) => (
                                                            <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                                                                <td className="px-8 py-5">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/20">{m.name[0]}</div>
                                                                        <div>
                                                                            <p className="text-sm font-black text-white uppercase italic tracking-tight leading-none mb-1">{m.name}</p>
                                                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{m.role}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-5 text-right font-black text-white/90 italic tracking-tighter text-lg">${m.salary?.toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>

                                        <div className="space-y-10">
                                            <section className="space-y-8">
                                                <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] italic">Infraestructura & SaaS</h5>
                                                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-5">
                                                    {(scale?.itemized_software || []).map((sw, i) => (
                                                        <div key={i} className="flex justify-between items-center group">
                                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] group-hover:text-white transition-colors">{sw.name}</span>
                                                            <span className="font-black text-sm italic text-white">${Number(sw.amount || 0).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    <div className="h-px bg-white/5 my-2" />
                                                    <div className="flex justify-between items-center text-blue-400 px-2 py-1.5 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Inversión mensual</span>
                                                        <span className="text-xl font-black italic">${scale?.software}</span>
                                                    </div>
                                                </div>
                                            </section>

                                            <section className="space-y-8">
                                                <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] italic">Análisis Estructural</h5>
                                                <div className="bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[220px]">
                                                    <div className="space-y-5">
                                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                                            <Zap className="w-3.5 h-3.5" /> Punto de Equilibrio
                                                        </p>
                                                        <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden p-[4px] border border-white/5 shadow-inner">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.min(((metrics.income || 1) / (totalExpenses || 1)) * 100, 100)}%` }}
                                                                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                                                                className="h-full bg-gradient-to-r from-indigo-500 to-[#38bdf8] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 italic">
                                                            <span>Ingreso: ${metrics.income}</span>
                                                            <span>Target: ${totalExpenses}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 italic font-medium leading-relaxed pl-6 border-l-2 border-indigo-500/30">
                                                        Actualmente cubres el **{Math.round(((metrics.income || 0) / (totalExpenses || 1)) * 100)}%** de tus egresos. <br/>
                                                        <span className="text-white">Déficit a optimizar: **${(totalExpenses - (metrics.income || 0)).toLocaleString()}**</span>
                                                    </p>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. MRR AUDIT */}
                            {activeModal === 'mrr' && (
                                <div className="space-y-10">
                                    <h4 className="text-4xl font-black uppercase italic tracking-tighter text-indigo-400">MRR REAL AUDIT</h4>
                                    <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                        <table className="w-full text-left">
                                            <thead className="sticky top-0 bg-[#0A0B1A] border-b border-white/10">
                                                <tr>
                                                    <th className="py-4 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em]">Cliente</th>
                                                    <th className="py-4 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em]">Status DB</th>
                                                    <th className="py-4 text-right text-[10px] font-black uppercase text-gray-600 tracking-[0.3em]">Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {clients.map((c, i) => (
                                                    <tr key={i} className="group hover:bg-white/[0.02]">
                                                        <td className="py-6 font-black text-lg italic uppercase">{c.name}</td>
                                                        <td className="py-6">
                                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                                (c.status === 'active' || c.status === 'ONBOARDING_COMPLETED') 
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                                    : c.status === 'trial'
                                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                            }`}>
                                                                {(c.status === 'active' || c.status === 'ONBOARDING_COMPLETED') ? 'Contratado' : c.status === 'trial' ? 'En Prueba' : 'Sin Pago'}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 text-right text-2xl font-black italic text-emerald-400">
                                                            ${(c.status === 'active' || c.status === 'trial' || c.status === 'ONBOARDING_COMPLETED') ? Number(c.price || 0).toLocaleString() : '0'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* 4. FINAL UTILITY AUDIT */}
                            {activeModal === 'final' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                                                <h4 className="text-4xl font-black uppercase italic tracking-tighter text-white">Análisis de Utilidad</h4>
                                            </div>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] pl-7 opacity-70">Auditoría Operativa Final — Q2 2026</p>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 px-10 flex items-center gap-6 backdrop-blur-xl">
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Balance de Operación</p>
                                                <p className={`text-4xl font-black italic tracking-tighter ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'} drop-shadow-glow-sm`}>
                                                    ${netProfit?.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${netProfit > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'} border border-white/5 shadow-inner`}>
                                                {netProfit > 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                                        <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-10 py-6">
                                            <div className="relative w-72 h-72">
                                                <UtilityDonutChart 
                                                    percentage={Math.max(0, Math.min(100, (netProfit / (metrics.income || 1)) * 100))} 
                                                    color={netProfit > 0 ? '#10b981' : '#f43f5e'} 
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Margen Neto</p>
                                                    <p className={`text-5xl font-black italic tracking-tighter ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                                        {Math.round((netProfit / (metrics.income || 1)) * 100)}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                                                <div className="flex justify-between items-center px-2">
                                                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic leading-none">Distribución de Capital</h5>
                                                    <RefreshCw className="w-3.5 h-3.5 text-gray-700 animate-spin-slow" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <DistributionTag label="Operativo" color="emerald" active={netProfit > 0} />
                                                    <DistributionTag label="Gastos" color="rose" active={totalExpenses > 0} />
                                                    <DistributionTag label="Staff" color="indigo" active={payrollCosts > 0} />
                                                    <DistributionTag label="Infra" color="purple" active={swCosts > 0} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-3 space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <CalculationRow 
                                                    icon={TrendingUp}
                                                    label="Total Ingresos (MRR Real)" 
                                                    description="Facturación bruta acumulada en DB"
                                                    value={`$${metrics.income?.toLocaleString()}`} 
                                                    type="income" 
                                                    delay={0}
                                                />
                                                <CalculationRow 
                                                    icon={Clapperboard}
                                                    label="Costos Producción" 
                                                    description="Gasto por tareas y entregables"
                                                    value={`-$${prodCosts?.toLocaleString()}`} 
                                                    type="expense" 
                                                    delay={0.1}
                                                />
                                                <CalculationRow 
                                                    icon={Users}
                                                    label="Nómina Talento" 
                                                    description="Sueldos y bonificaciones de staff"
                                                    value={`-$${payrollCosts?.toLocaleString()}`} 
                                                    type="expense" 
                                                    delay={0.2}
                                                />
                                                <CalculationRow 
                                                    icon={Activity}
                                                    label="Infraestructura & SaaS" 
                                                    description="Servidores, dominios y software"
                                                    value={`-$${swCosts?.toLocaleString()}`} 
                                                    type="expense" 
                                                    delay={0.3}
                                                />
                                            </div>

                                            <motion.div 
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className={`mt-8 p-10 rounded-[3rem] border-2 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden relative ${
                                                    netProfit > 0 
                                                    ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_20px_50px_rgba(16,185,129,0.1)]' 
                                                    : 'bg-rose-500/5 border-rose-500/20 shadow-[0_20px_50px_rgba(244,63,94,0.1)]'
                                                }`}
                                            >
                                                <div className={`absolute -right-20 -bottom-20 w-64 h-64 blur-[120px] opacity-30 rounded-full ${netProfit > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                
                                                <div className="relative z-10">
                                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-2">Utilidad Operativa</h3>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic max-w-[240px]">
                                                        Balance final tras deducir costos de producción y mantenimiento.
                                                    </p>
                                                </div>
                                                <div className="relative z-10 text-center md:text-right">
                                                    <span className={`text-6xl font-black italic tracking-tighter drop-shadow-glow leading-none ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                                        ${netProfit?.toLocaleString()}
                                                    </span>
                                                    <div className="flex items-center justify-center md:justify-end gap-2 mt-4">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${netProfit > 0 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-rose-500/30 text-rose-500 bg-rose-500/5'}`}>
                                                            {netProfit > 0 ? 'Rentabilidad Positiva' : 'Punto de Equilibrio Requerido'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
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

function GoalProgressItem({ label, value, percent, color }) {
    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[130px]">{label}</span>
                <span className="text-[9px] font-mono text-gray-400 font-bold">${value} ({percent}%)</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
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
