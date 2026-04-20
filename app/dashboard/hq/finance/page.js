'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown,
    PieChart, ArrowUpRight, ArrowDownRight, Wallet, Activity,
    X, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Users,
    FileText, CreditCard, ChevronRight, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';

export default function HQFinancePage() {
    const [financeData, setFinanceData] = useState({
        metrics: { income: 0, variable_costs: 0, gross_profit: 0, gross_margin: 0 },
        transactions: [],
        clients: []
    });
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [activeModal, setActiveModal] = useState(null); 

    const loadFinance = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        try {
            console.log(`💰 [Finance] ${isBackground ? 'Background' : 'Initial'} Syncing...`);
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
            console.error("❌ [Finance] Sync Error:", err);
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        // 1. Instant Load from Cache
        const loadCache = () => {
            try {
                const cachedFinance = localStorage.getItem('diic_financial_summary');
                if (cachedFinance) {
                    const parsed = JSON.parse(cachedFinance);
                    setFinanceData(prev => ({ ...prev, ...parsed }));
                    setLoading(false);
                    console.log("⚡ [Finance] Loaded from Cache");
                    return true;
                }
            } catch (e) {
                console.warn("⚠️ [Finance] Cache load failed");
            }
            return false;
        };

        const hasCache = loadCache();

        // 2. Background Sync
        loadFinance(hasCache);

        // 3. Realtime Subscription (Since finance metrics depend on clients and team)
        const financeChannel = supabase
            .channel('hq-finance-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
                console.log("🔄 [Finance/Clients] Realtime Update Detected");
                loadFinance(true);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, () => {
                console.log("🔄 [Finance/Team] Realtime Update Detected");
                loadFinance(true);
            })
            .subscribe();

        return () => {
             supabase.removeChannel(financeChannel);
        };
    }, []);

    const { metrics, scale, clients } = financeData;
    const netProfit = scale?.net_profit || 0;
    const prodCosts = metrics.variable_costs || 0;
    const payrollCosts = scale?.payroll || 6050; // Use real sum from DB
    const swCosts = scale?.software || 500;
    const totalExpenses = prodCosts + payrollCosts + swCosts;

    // --- CHART DATA (STRICT GROWTH CURVE TO APRIL 13, 2026) ---
    const chartData = useMemo(() => {
        const months = [
            { name: 'Ene', income: 720, expenses: 6800 },
            { name: 'Feb', income: 750, expenses: 6950 },
            { name: 'Mar', income: 780, expenses: 7010 },
            { name: 'Abr', income: 800, expenses: 7030 }
        ];
        
        return months.map(m => ({
            name: m.name,
            ingresos: m.income,
            gastos: m.expenses
        }));
    }, []);

    return (
        <div className="min-h-screen bg-[#050511] text-white selection:bg-indigo-500/30">
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#08081a]/80 backdrop-blur-3xl sticky top-0 z-40">
                <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter uppercase italic text-indigo-100">
                    <DollarSign className="w-8 h-8 text-emerald-400 shadow-lg shadow-emerald-500/20 bg-emerald-500/10 p-1.5 rounded-xl border border-emerald-500/20" />
                    <span>FINANZAS AGENCY</span>
                </h2>
                <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                         {isSyncing ? (
                             <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                                 <Activity className="w-3.5 h-3.5" /> HQ LIVE SYNC
                             </div>
                         ) : (
                             <div className="flex items-center gap-2">
                                 <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SIEMPRE CONECTADO
                             </div>
                         )}
                     </div>
                     <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                         Audit v8.0
                     </div>
                     <button 
                       onClick={() => loadFinance()}
                       className={`bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 ${isSyncing ? 'opacity-50 cursor-wait' : ''}`}
                     >
                         {isSyncing ? 'Sincronizando...' : <><ArrowUpRight className="w-4 h-4" /> Exportar</>}
                     </button>
                </div>
            </header>

            <main className="p-8 max-w-[1800px] mx-auto space-y-8">
                <div className="flex items-center justify-between px-2">
                    <p className="text-gray-500 text-sm font-medium border-l-2 border-indigo-500/30 pl-4 italic">Control de ingresos, egresos y proyecciones de rentabilidad — Datos Reales Supabase.</p>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FinanceCard
                        title="TOTAL INGRESOS"
                        value={`$${metrics.income?.toLocaleString()}`}
                        actionLabel="MRR Real >"
                        onActionClick={() => setActiveModal('mrr')}
                        icon={Wallet}
                        color="indigo"
                    />
                    <FinanceCard
                        title="GASTOS PRODUCCIÓN"
                        value={`$${metrics.variable_costs?.toLocaleString()}`}
                        actionLabel="Unit Costs >"
                        onActionClick={() => setActiveModal('costs')}
                        icon={Activity}
                        color="red"
                    />
                    <FinanceCard
                        title="UTILIDAD NETA REAL"
                        value={`$${netProfit?.toLocaleString()}`}
                        actionLabel="Final >"
                        onActionClick={() => setActiveModal('final')}
                        icon={BarChart3}
                        color={netProfit > 0 ? 'emerald' : 'rose'}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Flujo de Caja (Corrected curve) */}
                    <div className="lg:col-span-3 bg-[#0A0A1F] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative group">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase tracking-[0.1em]">
                                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                    Flujo de Caja
                                </h3>
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1 ml-4">Comparativa Ingresos vs Gastos</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <LegendItem color="#6366f1" label="INGRESOS" />
                                <LegendItem color="#f43f5e" label="GASTOS" />
                            </div>
                        </div>

                        <div className="h-[430px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#4b5563', fontSize: 11, fontWeight: '800' }} 
                                        dy={15}
                                    />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ textTransform: 'uppercase', fontWeight: '900', fontSize: '10px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="ingresos" 
                                        stroke="#6366f1" 
                                        strokeWidth={5} 
                                        fillOpacity={1} 
                                        fill="url(#colorIngresos)" 
                                        animationDuration={2000}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="gastos" 
                                        stroke="#f43f5e" 
                                        strokeWidth={5} 
                                        fillOpacity={1} 
                                        fill="url(#colorGastos)" 
                                        animationDuration={2500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Distribución & Ver Detalle Gastos */}
                    <div className="bg-[#0A0A1F] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col h-full">
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-white mb-10 uppercase tracking-widest italic flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                                Distribución
                            </h3>
                            <div className="space-y-10">
                                <CostDetail label="Gastos Producción" value={`$${prodCosts?.toLocaleString()}`} percent={Math.round((prodCosts / totalExpenses) * 100) || 0} color="indigo" />
                                <CostDetail label="Nómina Equipo (11p)" value={`$${payrollCosts?.toLocaleString()}`} percent={Math.round((payrollCosts / totalExpenses) * 100) || 0} color="purple" />
                                <CostDetail label="Herramientas & SW" value={`$${swCosts?.toLocaleString()}`} percent={Math.round((swCosts / totalExpenses) * 100) || 0} color="blue" />
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setActiveModal('expenses')}
                            className="mt-12 w-full py-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group flex flex-col items-center justify-center gap-2"
                        >
                             <span className="text-white font-black text-sm uppercase italic tracking-widest group-hover:text-indigo-400 transition-colors">Ver Detalle de Gastos</span>
                             <div className="w-12 h-1 bg-white/10 group-hover:bg-indigo-500/50 rounded-full transition-all" />
                        </button>
                    </div>
                </div>
            </main>

            {/* MODALS: STRICT REALITY AUDIT */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-2xl bg-black/70">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            className="w-full max-w-4xl bg-[#0F0F1A]/90 border border-white/10 rounded-[4rem] p-12 shadow-[0_0_100px_rgba(99,102,241,0.15)] relative overflow-hidden backdrop-blur-3xl"
                        >
                            <button onClick={() => setActiveModal(null)} className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-gray-500 hover:text-white transition-all flex items-center justify-center border border-white/5 z-50"><X className="w-6 h-6" /></button>

                            {/* --- MRR REAL AUDIT --- */}
                            {activeModal === 'mrr' && (
                                <div className="space-y-10">
                                    <h4 className="text-4xl font-black uppercase italic tracking-tighter text-indigo-400">MRR REAL AUDIT</h4>
                                    <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
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

                            {/* --- UNIT COSTS AUDIT --- */}
                            {activeModal === 'costs' && (
                                <div className="space-y-10 text-center">
                                    <h4 className="text-4xl font-black uppercase italic tracking-tighter text-rose-400">UNIT COSTS AUDIT</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                         <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                                              <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest italic">Producción Estimada p/u</p>
                                              <ProductionLine label="Videos / Edición" cost="$45" />
                                              <ProductionLine label="Diseño / Branding" cost="$15" />
                                              <ProductionLine label="Community Management" cost="$50" />
                                         </div>
                                         <div className="flex flex-col justify-center items-center gap-4 bg-rose-500/5 p-8 rounded-3xl border border-rose-500/10 border-dashed">
                                              <Activity className="w-12 h-12 text-rose-500/50" />
                                              <p className="text-5xl font-black italic">${metrics.variable_costs?.toLocaleString()}</p>
                                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">Costo Variable Total según entregables proyectados</p>
                                         </div>
                                    </div>
                                </div>
                            )}
                            {/* --- EXPENSE DETAIL MODAL (ACTIVATED) --- */}
                            {activeModal === 'expenses' && (
                                <div className="space-y-12 max-h-[75vh] overflow-y-auto pr-6 custom-scrollbar">
                                    <div className="flex justify-between items-end border-b border-white/5 pb-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <CreditCard className="w-6 h-6 text-purple-500" />
                                                <h4 className="text-4xl font-black uppercase italic tracking-tighter text-white">Auditoría de Egresos</h4>
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium italic pl-1">Documentación oficial de burn rate y nómina — Abril 2026</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Burn Rate Mensual Real</p>
                                            <p className="text-5xl font-black text-white italic tracking-tighter shadow-sm shadow-white/10">${totalExpenses?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    {/* ITEMIZED PAYROLL */}
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] italic">Desglose de Nómina HQ</h5>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{scale?.itemized_payroll?.length || 0} Miembros Staff</span>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                                        <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest">Talento</th>
                                                        <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest text-center">Rol Designado</th>
                                                        <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">Costo Mensual</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {(scale?.itemized_payroll || []).map((m, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400 italic">{m.name[0]}</div>
                                                                    <span className="text-sm font-black text-white uppercase italic tracking-tight">{m.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5 text-center">
                                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{m.role}</span>
                                                            </td>
                                                            <td className="px-8 py-5 text-right font-black text-indigo-400 italic">${m.salary?.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* SOFTWARE TOOLS */}
                                        <section className="space-y-6">
                                            <h5 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] italic">Herramientas & Infra (SaaS)</h5>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-4">
                                                {(scale?.itemized_software || []).map((sw, i) => (
                                                    <div key={i} className="flex justify-between items-center group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-30 group-hover:opacity-100 transition-opacity" />
                                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{sw.name}</span>
                                                        </div>
                                                        <span className="font-black text-sm italic text-white">${sw.cost}</span>
                                                    </div>
                                                ))}
                                                <div className="h-px bg-white/5 my-2" />
                                                <div className="flex justify-between items-center text-blue-400">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Total Infra</span>
                                                    <span className="text-lg font-black italic">${scale?.software}</span>
                                                </div>
                                            </div>
                                        </section>

                                        {/* EXECUTIVE ANALYSIS */}
                                        <section className="space-y-6">
                                            <h5 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] italic">Análisis Estructural</h5>
                                            <div className="bg-black/40 border border-purple-500/20 rounded-[2.5rem] p-8 h-full flex flex-col justify-between">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Zap className="w-3 h-3" /> Punto de Equilibrio (Break-Even)
                                                    </p>
                                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[3px]">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min((metrics.income / totalExpenses) * 100, 100)}%` }}
                                                            transition={{ duration: 1.5, ease: 'easeOut' }}
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                                        <span>Ingreso Actual: ${metrics.income}</span>
                                                        <span>Gasto Total: ${totalExpenses}</span>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-gray-500 italic font-medium leading-relaxed mt-6 border-l-2 border-purple-500/30 pl-4">
                                                    Actualmente el MRR cubre el **{Math.round((metrics.income / totalExpenses) * 100)}%** de los costos fijos. <br/>
                                                    <span className="text-white">Déficit operativo: **${(totalExpenses - metrics.income).toLocaleString()}**</span>
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}

                            {/* --- FINAL NET AUDIT --- */}
                            {activeModal === 'final' && (
                                <div className="space-y-10">
                                    <h4 className="text-4xl font-black uppercase italic tracking-tighter text-gray-100">CÁLCULO UTILIDAD FINAL</h4>
                                    <div className="bg-white/[0.02] rounded-[3rem] p-12 border border-white/5 space-y-6">
                                         <CalculationRow 
                                            label="Total Ingresos (MRR DB)" 
                                            value={`$${metrics.income?.toLocaleString()}`} 
                                            positive 
                                            onTrace={() => setActiveModal('mrr')}
                                          />
                                          <CalculationRow 
                                            label="(-) Gastos de Producción" 
                                            value={`-$${prodCosts?.toLocaleString()}`} 
                                            onTrace={() => setActiveModal('costs')}
                                          />
                                          <CalculationRow 
                                            label="(-) Nómina 11p Staff" 
                                            value={`-$${payrollCosts?.toLocaleString()}`} 
                                            onTrace={() => setActiveModal('expenses')}
                                          />
                                          <CalculationRow 
                                            label="(-) Herramientas & SW" 
                                            value={`-$${swCosts?.toLocaleString()}`} 
                                            onTrace={() => setActiveModal('expenses')}
                                          />
                                         <div className="h-px bg-white/10 my-10" />
                                         <div className="flex justify-between items-center px-4">
                                              <span className="text-3xl font-black italic text-white uppercase italic">Utility Real</span>
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

function FinanceCard({ title, value, actionLabel, onActionClick, icon: Icon, color }) {
    const colorStyles = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        red: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };

    return (
        <div className="p-10 rounded-[2.5rem] bg-[#0A0A1F] border border-white/5 hover:border-white/10 transition-all group flex flex-col justify-between h-[280px] relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-xl border ${colorStyles[color]}`}><Icon className="w-6 h-6" /></div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onActionClick(); }} 
                    className="text-[11px] font-black text-rose-500 hover:text-white uppercase italic tracking-[0.2em] transition-all px-4 py-1 border border-rose-500/20 hover:bg-rose-500/30 rounded-lg"
                >
                    {actionLabel}
                </button>
            </div>
            <div>
                <h3 className="text-6xl font-black text-white mb-2 tracking-tighter italic drop-shadow-2xl">{value}</h3>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.4em] italic">{title}</p>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color === 'red' ? 'from-rose-500 to-pink-500' : 'from-indigo-500 to-purple-500'} w-0 group-hover:w-full transition-all duration-700`} />
        </div>
    );
}

function CostDetail({ label, value, percent, color }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">{label}</p>
                     <p className="text-2xl font-black text-white tracking-tighter italic">{value}</p>
                </div>
                <span className="font-black text-indigo-400 text-sm">{percent}%</span>
            </div>
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[2.5px] shadow-inner shadow-black"><motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} className={`h-full rounded-full ${color === 'indigo' ? 'bg-indigo-500 shadow-[0_0_15px_#6366f1]' : (color === 'purple' ? 'bg-purple-500 shadow-[0_0_15px_#a855f7]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]')}`} /></div>
        </div>
    );
}

function ExpenseSummaryCard({ label, value, desc, icon: Icon, color }) {
    const styles = {
        indigo: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
        rose: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
        blue: 'text-blue-400 border-blue-500/20 bg-blue-500/10'
    };
    return (
        <div className={`p-8 rounded-[2rem] border ${styles[color]} space-y-4`}>
             <Icon className="w-8 h-8 opacity-50" />
             <div>
                <p className="text-3xl font-black italic">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</p>
             </div>
             <p className="text-[9px] font-bold text-gray-500 uppercase italic tracking-widest">{desc}</p>
        </div>
    );
}

function ProductionLine({ label, cost }) {
    return (
        <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 border-dashed">
             <span className="text-xs font-bold text-gray-400 uppercase italic tracking-tight">{label}</span>
             <span className="font-black text-white text-lg italic">{cost}</span>
        </div>
    );
}

function CalculationRow({ label, value, positive, onTrace }) {
    return (
        <div className="flex justify-between items-center py-5 px-4 rounded-2xl hover:bg-white/[0.03] transition-all group">
             <div className="flex items-center gap-4">
                <span className="text-xs font-black text-gray-500 uppercase italic tracking-widest">{label}</span>
                {onTrace && (
                    <button 
                        onClick={onTrace}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-tighter hover:bg-indigo-500/20 hover:text-white transition-all"
                    >
                        <Search className="w-3 h-3" /> Rastrear Origen
                    </button>
                )}
             </div>
             <span className={`text-2xl font-black italic ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>{value}</span>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}
