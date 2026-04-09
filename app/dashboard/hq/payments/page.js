'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    DollarSign, ArrowUpRight, ArrowDownRight, 
    Calendar, Download, PieChart, TrendingUp,
    CreditCard, Wallet, Banknote
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Ene', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 9800 },
    { name: 'Abr', income: 2780, expenses: 3908 },
    { name: 'May', income: 1890, expenses: 4800 },
    { name: 'Jun', income: 2390, expenses: 3800 },
];

export default function HQFinancePage() {
    return (
        <div className="p-8 space-y-8">
             {/* Header */}
             <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Finanzas Agency</h1>
                    <p className="text-gray-400">Control de ingresos, egresos y proyecciones de rentabilidad.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-white/5 text-gray-400 font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 2026
                    </button>
                    <button className="px-6 py-3 bg-white text-black font-black rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-all shadow-xl">
                        <Download className="w-5 h-5" /> Exportar
                    </button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinanceCard title="Total Ingresos" value="$12,450.00" trend="+12.5%" icon={Wallet} color="green" />
                <FinanceCard title="Total Gastos (Equipo)" value="$4,200.00" trend="-2.4%" icon={CreditCard} color="red" />
                <FinanceCard title="Utilidad Neta" value="$8,250.00" trend="+18.2%" icon={Banknote} color="blue" />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Flujo de Caja</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Comparativa Ingresos vs Gastos</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ingresos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gastos</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0E0E18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6">Distribución</h3>
                        <div className="space-y-6">
                            <CategoryItem label="Sueldos Equipo" amount="$3,500" percent={85} color="indigo" />
                            <CategoryItem label="Software / Herramientas" amount="$450" percent={10} color="purple" />
                            <CategoryItem label="Marketing / Ads" amount="$250" percent={5} color="blue" />
                        </div>
                    </div>
                    <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all text-sm">
                        Ver Detalle de Gastos
                    </button>
                </div>
            </div>
        </div>
    );
}

function FinanceCard({ title, value, trend, icon: Icon, color }) {
    return (
        <div className="p-8 bg-[#0E0E18] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-7 h-7 ${color === 'green' ? 'text-green-500' : color === 'red' ? 'text-red-500' : 'text-indigo-500'}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {trend} {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
            </div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</div>
            <div className="text-3xl font-black text-white">{value}</div>
        </div>
    );
}

function CategoryItem({ label, amount, percent, color }) {
    const colors = {
        indigo: 'bg-indigo-500',
        purple: 'bg-purple-500',
        blue: 'bg-blue-500'
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-bold">{amount}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${colors[color]}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
