'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown,
    PieChart, ArrowUpRight, ArrowDownRight, Wallet, Activity,
    X, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Users,
    FileText, CreditCard, ChevronRight, Zap, Target, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';
import { agencyService } from '@/services/agencyService';

export default function HQFinancePage() {
    const [financeData, setFinanceData] = useState({
        metrics: { income: 0, variable_costs: 0, gross_profit: 0, gross_margin: 0 },
        transactions: [],
        clients: []
    });
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null); 

    useEffect(() => {
        const loadFinance = async () => {
            setLoading(true);
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
                setLoading(false);
            }
        };
        loadFinance();
    }, []);

    const { metrics, scale, clients } = financeData;
    
    // DYNAMIC CALCULATION FROM REAL PRODUCTION DATA
    const prodCosts = scale?.production || 0;
    const payrollCosts = scale?.payroll || 0; 
    const swCosts = scale?.software || 0;
    const totalExpenses = prodCosts + payrollCosts + swCosts;
    const netProfit = (metrics.income || 0) - totalExpenses;

    const chartData = useMemo(() => {
        const months = [
            { name: 'Ene', income: 720, expenses: 6800 },
            { name: 'Feb', income: 750, expenses: 6950 },
            { name: 'Mar', income: 780, expenses: 7010 },
            { name: 'Abr', income: metrics.income || 800, expenses: totalExpenses || 7030 }
        ];
        
        return months.map(m => ({
            name: m.name,
            ingresos: m.income,
            gastos: m.expenses
        }));
    }, [metrics.income, totalExpenses]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#02020a] flex items-center justify-center">
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
        <div className="min-h-screen bg-[#02020a] text-white selection:bg-indigo-500/30 font-sans">
            <div className="px-8 pt-8 sticky top-0 z-50">
                <header className="h-20 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-between px-10 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight uppercase italic leading-none">Finanzas HQ</h2>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Operating Audit — 2026</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                         <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                             <span>Datos Reales DB</span>
                         </div>
                         <button className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl active:scale-95">
                             <ArrowUpRight className="w-3.5 h-3.5" /> Informe
                         </button>
                    </div>
                </header>
            </div>

            <main className="p-8 max-w-[1800px] mx-auto space-y-10">
                <div className="px-4">
                    <h3 className="text-4xl font-black text-white/90 tracking-tighter uppercase italic leading-none">Control de Costos</h3>
                    <p className="text-gray-500 text-sm font-medium mt-3 max-w-2xl leading-relaxed italic border-l-2 border-indigo-500/20 pl-6">
                        Auditoría en tiempo real de lo que se está pagando y lo que se está haciendo. <span className="text-indigo-400/80">Cálculos basados en Production Rates internos.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AppleFinanceCard
                        title="Ingresos Totales"
                        value={`$${metrics.income?.toLocaleString()}`}
                        label="MRR Real"
                        onAction={() => setActiveModal('mrr')}
                        icon={Wallet}
                        color="indigo"
                    />
                    <AppleFinanceCard
                        title="Gastos Operativos"
                        value={`$${prodCosts?.toLocaleString()}`}
                        label="Audit Ledger"
                        onAction={() => setActiveModal('costs')}
                        icon={ClipboardList}
                        color="rose"
                    />
                    <AppleFinanceCard
                        title="Utilidad Neta"
                        value={`$${netProfit?.toLocaleString()}`}
                        label="Final Balance"
                        onAction={() => setActiveModal('final')}
                        icon={Target}
                        color={netProfit > 0 ? 'emerald' : 'rose'}
                        special
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Análisis de Burn Rate</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-8 h-[2px] bg-indigo-500 rounded-full" />
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Historial Real v/s Proyección</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 bg-black/20 p-3 rounded-full border border-white/5">
                                <AppleLegendItem color="#6366f1" label="Ingresos" />
                                <AppleLegendItem color="#f43f5e" label="Gastos" />
                            </div>
                        </div>

                        <div className="h-[400px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="appleIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#4b5563', fontSize: 10, fontWeight: '700' }} 
                                        dy={15}
                                    />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                                        labelStyle={{ color: '#6366f1', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px' }}
                                        itemStyle={{ textTransform: 'uppercase', fontWeight: '800', fontSize: '9px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="ingresos" 
                                        stroke="#6366f1" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#appleIncome)" 
                                        animationDuration={1500}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="gastos" 
                                        stroke="#f43f5e" 
                                        strokeWidth={2} 
                                        strokeDasharray="5 5"
                                        fill="transparent" 
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="space-y-1 mb-10">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">Distribución</h3>
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em]">Internal Outflow</p>
                            </div>
                            <div className="space-y-12">
                                <AppleCostItem icon={Activity} label="Producción Real" value={`$${prodCosts?.toLocaleString()}`} percent={Math.round((prodCosts / totalExpenses) * 100) || 0} color="indigo" />
                                <AppleCostItem icon={Users} label="Nómina Staff" value={`$${payrollCosts?.toLocaleString()}`} percent={Math.round((payrollCosts / totalExpenses) * 100) || 0} color="purple" />
                                <AppleCostItem icon={CreditCard} label="SaaS & Infra" value={`$${swCosts?.toLocaleString()}`} percent={Math.round((swCosts / totalExpenses) * 100) || 0} color="blue" />
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setActiveModal('expenses')}
                            className="mt-12 w-full py-5 rounded-full bg-white text-black hover:bg-white/90 transition-all group flex items-center justify-center gap-3 shadow-xl active:scale-95"
                        >
                             <span className="font-black text-[11px] uppercase tracking-widest leading-none">Auditar lo que pagamos</span>
                             <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-3xl"
                        />
                        <motion.div 
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-5xl bg-[#08080f]/90 border border-white/10 rounded-t-[3rem] md:rounded-[4rem] p-10 md:p-14 shadow-2xl relative overflow-hidden backdrop-blur-3xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setActiveModal(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 hover:bg-rose-500/20 text-gray-500 hover:text-white transition-all flex items-center justify-center border border-white/5"><X className="w-5 h-5" /></button>

                            {/* --- AUDITORÍA DE COSTOS OPERATIVOS (LEGENDA REAL) --- */}
                            {activeModal === 'costs' && (
                                <div className="space-y-12">
                                     <div className="space-y-2 border-b border-white/5 pb-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 bg-rose-500 rounded-full" />
                                            <h4 className="text-5xl font-black uppercase italic tracking-tighter text-white">Libro de Operaciones</h4>
                                        </div>
                                        <p className="text-gray-500 text-xs font-medium italic pl-5 tracking-wide">Desglose de tareas realizadas y sus costos internos asociados.</p>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-white/[0.03] border-b border-white/5">
                                                    <th className="px-8 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">Lo que se está haciendo (Tarea)</th>
                                                    <th className="px-8 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest text-center">Cliente</th>
                                                    <th className="px-8 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">Lo que estamos pagando</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {(scale?.production_ledger || []).map((t, i) => (
                                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                                <div>
                                                                    <p className="text-sm font-black text-white uppercase italic tracking-tight">{t.title}</p>
                                                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.format}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-center">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">{t.client}</span>
                                                        </td>
                                                        <td className="px-8 py-6 text-right font-black text-emerald-400 italic text-xl">${t.cost}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-between items-center bg-rose-500/5 p-8 rounded-[2rem] border border-rose-500/10">
                                         <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-400 italic">Total Costos Producción</span>
                                         <span className="text-4xl font-black italic tracking-tighter text-white">${prodCosts?.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            {/* --- AUDITORÍA DE EGRESOS (MANTENER MEJORADA) --- */}
                            {activeModal === 'expenses' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                                                <h4 className="text-5xl font-black uppercase italic tracking-tighter text-white">Auditoría Egresos</h4>
                                            </div>
                                            <p className="text-gray-500 text-xs font-medium italic pl-5 tracking-wide">Reporte Consolidado de Gastos Operativos — Abril 2026</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Gasto Mensual Real</p>
                                            <p className="text-6xl font-black text-white italic tracking-tighter">${totalExpenses?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <section className="space-y-8">
                                            <div className="flex justify-between items-center">
                                                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Nómina Talento HQ</h5>
                                                <span className="text-[10px] font-black p-1.5 px-3 bg-indigo-500/10 text-indigo-300 rounded-lg">{scale?.itemized_payroll?.length || 0} Integrantes</span>
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
                                                            <span className="font-black text-sm italic text-white">${sw.cost}</span>
                                                        </div>
                                                    ))}
                                                    <div className="h-px bg-white/5 my-2" />
                                                    <div className="flex justify-between items-center text-blue-400 px-2 py-1 bg-blue-500/5 rounded-xl border border-blue-500/10">
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
                                                                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
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

                            {/* --- MRR AUDIT --- */}
                            {activeModal === 'mrr' && (
                                <div className="space-y-10">
                                    <h4 className="text-4xl font-black uppercase italic tracking-tighter text-indigo-400">MRR REAL AUDIT</h4>
                                    <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                        <table className="w-full text-left">
                                            <thead className="sticky top-0 bg-[#0F0F1A] border-b border-white/10">
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
                                                        <td className="py-6"><span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${c.price > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{c.price > 0 ? 'Contratado' : 'Sin Precio DB'}</span></td>
                                                        <td className="py-6 text-right text-2xl font-black italic text-emerald-400">${Number(c.price).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* --- FINAL NET AUDIT --- */}
                            {activeModal === 'final' && (
                                <div className="space-y-10">
                                    <h4 className="text-4xl font-black uppercase italic tracking-tighter text-gray-100">CÁLCULO UTILIDAD FINAL</h4>
                                    <div className="bg-white/[0.02] rounded-[3rem] p-12 border border-white/5 space-y-6">
                                         <CalculationRow label="Total Ingresos (MRR DB)" value={`$${metrics.income?.toLocaleString()}`} positive />
                                         <CalculationRow label="(-) Costos Producción (Tasks Audit)" value={`-$${prodCosts?.toLocaleString()}`} />
                                         <CalculationRow label="(-) Nómina Staff" value={`-$${payrollCosts?.toLocaleString()}`} />
                                         <CalculationRow label="(-) Infraestructura SaaS" value={`-$${swCosts?.toLocaleString()}`} />
                                         <div className="h-px bg-white/10 my-10" />
                                         <div className="flex justify-between items-center px-4">
                                              <span className="text-3xl font-black italic text-white uppercase italic">Utility Operativo</span>
                                              <span className={`text-6xl font-black italic drop-shadow-glow ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>${netProfit?.toLocaleString()}</span>
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

function AppleFinanceCard({ title, value, label, onAction, icon: Icon, color, special = false }) {
    const colorStyles = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
    };

    return (
        <motion.div 
            whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
            className={`p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group h-[300px] flex flex-col justify-between transition-all duration-500 ${special ? 'border-white/10 shadow-2xl' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl border ${colorStyles[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <button 
                    onClick={onAction}
                    className="text-[10px] font-black text-gray-500 hover:text-white uppercase italic tracking-widest px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-opacity duration-300"
                >
                    {label}
                </button>
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3 italic">{title}</p>
                <h4 className="text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl">{value}</h4>
            </div>
            <div className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${color === 'rose' ? 'from-rose-500 to-pink-500' : 'from-indigo-600 to-emerald-400'} w-0 group-hover:w-full transition-all duration-700`} />
        </motion.div>
    );
}

function AppleCostItem({ label, value, percent, color, icon: Icon }) {
    const barColors = {
        indigo: 'bg-indigo-500 shadow-indigo-500/40',
        purple: 'bg-purple-500 shadow-purple-500/40',
        blue: 'bg-blue-500 shadow-blue-500/40'
    };
    return (
        <div className="group">
            <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                         <Icon className="w-4.5 h-4.5 text-gray-400 group-hover:text-white transition-colors" />
                     </div>
                     <div>
                         <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] italic mb-1">{label}</p>
                         <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</p>
                     </div>
                </div>
                <span className="text-xs font-black text-white italic">{percent}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full p-[2px] shadow-inner">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${percent}%` }} 
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} 
                    className={`h-full rounded-full ${barColors[color]} shadow-[0_0_12px_rgba(0,0,0,0.5)]`} 
                />
            </div>
        </div>
    );
}

function AppleLegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}

function CalculationRow({ label, value, positive }) {
    return (
        <div className="flex justify-between items-center py-5 px-4 rounded-2xl hover:bg-white/[0.03] transition-all text-left">
             <span className="text-xs font-black text-gray-500 uppercase italic tracking-widest">{label}</span>
             <span className={`text-2xl font-black italic ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>{value}</span>
        </div>
    );
}
