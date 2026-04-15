'use client';

import { motion } from 'framer-motion';
import {
    DollarSign, TrendingUp, CreditCard, Download,
    Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function FinanceDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Finanzas & ROI</h1>
                <p className="text-gray-400">Control total de tu inversión y retornos.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Inversión Mensual"
                    value="$1,250.00"
                    change="+12%"
                    isPositive={false} // Spend inc is usually negative functionally, but here just showing direction
                    icon={CreditCard}
                />
                <MetricCard
                    title="Retorno (ROAS)"
                    value="4.2x"
                    change="+0.5"
                    isPositive={true}
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Ingresos Atribuidos"
                    value="$5,250.00"
                    change="+24%"
                    isPositive={true}
                    icon={DollarSign}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Invoices List */}
                <div className="lg:col-span-2 bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Download className="w-5 h-5 text-gray-400" /> Facturación Reciente
                    </h3>
                    <div className="space-y-2">
                        <InvoiceRow id="#INV-2024-001" date="10 Feb, 2024" amount="$450.00" status="Paid" service="Producción Video" />
                        <InvoiceRow id="#INV-2024-002" date="01 Feb, 2024" amount="$1,200.00" status="Paid" service="Plan Growth Mensual" />
                        <InvoiceRow id="#INV-2024-003" date="15 Ene, 2024" amount="$850.00" status="Paid" service="Campaña Meta Ads" />
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Método de Pago</h3>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 mb-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CreditCard className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tarjeta Principal</p>
                                <p className="text-xl font-mono text-white mb-4">•••• •••• •••• 4242</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-500">Titular</p>
                                        <p className="text-sm font-bold text-white">Mike Creator</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500">Expira</p>
                                        <p className="text-sm font-bold text-white">12/28</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/5">
                        Administrar Métodos
                    </button>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, isPositive, icon: Icon }) {
    return (
        <div className="p-6 rounded-3xl bg-[#0E0E18] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h2 className="text-4xl font-black text-white">{value}</h2>
                </div>
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change} vs mes anterior
            </div>
        </div>
    );
}

function InvoiceRow({ id, date, amount, status, service }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                    <Download className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{service}</h4>
                    <p className="text-xs text-gray-500">{id} • {date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-white">{amount}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold uppercase tracking-wide">{status}</span>
            </div>
        </div>
    );
}
