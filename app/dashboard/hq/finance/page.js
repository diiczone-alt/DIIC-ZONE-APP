'use client';

import { useState } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown,
    PieChart, ArrowUpRight, ArrowDownRight, Wallet, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HQFinancePage() {
    // Mock Financial Data
    const metrics = {
        income: 14200,
        costs: 8400,
        profit: 5800,
        margin: 40.8
    };

    const recentTransactions = [
        { id: 1, client: 'Clínica Smith', desc: 'Fee Mensual - Plan Médico Pro', amount: 1200, type: 'income', date: 'Hoy, 10:30' },
        { id: 2, client: 'Freelancer', desc: 'Pago Editor Video (Carlos R.)', amount: -450, type: 'expense', date: 'Ayer, 18:00' },
        { id: 3, client: 'Power Gym', desc: 'Fee Mensual - Pyme Standard', amount: 800, type: 'income', date: 'Ayer, 14:20' },
        { id: 4, client: 'Software', desc: 'Suscripción Adobe CC', amount: -120, type: 'expense', date: '10 Feb' },
    ];

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            <header className="h-24 border-b border-white/5 flex items-center px-10 bg-[#08081a]/80 backdrop-blur-3xl sticky top-0 z-40">
                <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter uppercase italic text-indigo-100">
                    <DollarSign className="w-8 h-8 text-emerald-400 shadow-lg shadow-emerald-500/20 bg-emerald-500/10 p-1.5 rounded-xl border border-emerald-500/20" />
                    <span>Finanzas & Rentabilidad</span>
                </h2>
            </header>

            <main className="p-8 max-w-[1800px] mx-auto space-y-8">

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FinanceCard
                        title="Ingreso Mensual"
                        value={`$${metrics.income.toLocaleString()}`}
                        trend="+12%"
                        icon={ArrowUpRight}
                        color="blue"
                    />
                    <FinanceCard
                        title="Costos Operativos"
                        value={`$${metrics.costs.toLocaleString()}`}
                        trend="+5%"
                        icon={ArrowDownRight}
                        color="red"
                    />
                    <FinanceCard
                        title="Utilidad Neta"
                        value={`$${metrics.profit.toLocaleString()}`}
                        trend="+8.4%"
                        icon={TrendingUp}
                        color="green"
                        highlight
                    />
                    <FinanceCard
                        title="Margen Global"
                        value={`${metrics.margin}%`}
                        trend="Saludable"
                        icon={PieChart}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cash Flow Feed */}
                    <div className="lg:col-span-2 bg-[#0A0A1F] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                        <h3 className="font-bold text-white mb-8 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" /> Flujo de Caja en Vivo
                        </h3>
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {tx.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-md tracking-tight uppercase">{tx.desc}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{tx.client} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xl font-black ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Profitability Breakdown */}
                    <div className="bg-[#0A0A1F] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                        <h3 className="font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-widest text-sm">
                            <PieChart className="w-5 h-5 text-purple-500" /> Distribución de Costos
                        </h3>
                        <div className="space-y-8">
                            <CostBar label="Equipo Creativo" percent={45} color="bg-indigo-500" />
                            <CostBar label="Software & Herramientas" percent={15} color="bg-blue-500" />
                            <CostBar label="Publicidad (Ads)" percent={20} color="bg-purple-500" />
                            <CostBar label="Administración" percent={10} color="bg-gray-500" />
                            <CostBar label="Utilidad Bruta" percent={10} color="bg-emerald-500" striped />
                        </div>

                        <div className="mt-12 p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 text-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-2">Proyección Anual</p>
                                <p className="text-4xl font-black text-white tracking-tighter">$170,400</p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp className="w-20 h-20 text-indigo-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FinanceCard({ title, value, trend, icon: Icon, color, highlight }) {
    const colors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        red: 'text-red-400 bg-red-500/10 border-red-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    };

    return (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${highlight ? 'bg-gradient-to-br from-indigo-950/40 to-emerald-950/40 border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.1)]' : 'bg-[#0A0A1F] border-white/5 hover:border-white/10 shadow-2xl'}`}>
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl border ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${color === 'red' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {color !== 'red' && <TrendingUp className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{value}</h3>
            <p className="text-xs text-gray-500 font-black uppercase tracking-widest">{title}</p>
        </div>
    );
}

function CostBar({ label, percent, color, striped }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                <span className="font-black text-white text-xs">{percent}%</span>
            </div>
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color} ${striped ? 'bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)]' : ''}`}
                />
            </div>
        </div>
    );
}
