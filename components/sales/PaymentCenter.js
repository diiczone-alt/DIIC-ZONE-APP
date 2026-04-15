'use client';

import { useState } from 'react';
import {
    CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft,
    FileText, Plus, Search, Calendar, MoreHorizontal,
    Wallet, Receipt
} from 'lucide-react';
import BillingView from './BillingView';

export default function PaymentCenter() {
    const [subTab, setSubTab] = useState('dashboard'); // dashboard, invoices, links

    return (
        <div className="flex-1 h-full bg-[#050511] overflow-hidden flex flex-col">
            {/* Header / Sub-nav */}
            <div className="h-16 border-b border-white/5 bg-[#0E0E18] flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm">Centro de Pagos</h2>
                        <div className="flex gap-4 mt-1">
                            <button
                                onClick={() => setSubTab('dashboard')}
                                className={`text-xs font-bold transition-colors ${subTab === 'dashboard' ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setSubTab('invoices')}
                                className={`text-xs font-bold transition-colors ${subTab === 'invoices' ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                Facturas
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#151520] hover:bg-[#20202a] text-white rounded-lg text-xs font-bold border border-white/10 transition-colors">
                        <Plus className="w-4 h-4" /> Crear Link de Pago
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-600/20 transition-colors">
                        <DollarSign className="w-4 h-4" /> Registrar Pago Manual
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {subTab === 'dashboard' && <DashboardContent />}
                {subTab === 'invoices' && <BillingView />}
            </div>
        </div>
    );
}

function DashboardContent() {
    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    title="Ingresos este Mes"
                    value="$12,450"
                    trend="+15%"
                    trendUp={true}
                    icon={DollarSign}
                    color="text-emerald-400"
                />
                <KPICard
                    title="Pendiente de Cobro"
                    value="$3,200"
                    trend="5 facturas"
                    trendUp={false}
                    icon={Clock}
                    color="text-orange-400"
                />
                <KPICard
                    title="Suscripciones Activas"
                    value="24"
                    trend="+2"
                    trendUp={true}
                    icon={CreditCard}
                    color="text-blue-400"
                />
                <KPICard
                    title="Ticket Promedio"
                    value="$850"
                    trend="+5%"
                    trendUp={true}
                    icon={ArrowUpRight}
                    color="text-purple-400"
                />
            </div>

            {/* Main Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Transactions */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <ArrowDownLeft className="w-5 h-5 text-emerald-500" /> Transacciones Recientes
                    </h3>
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
                        {[
                            { id: 1, client: 'Clínica Dental RM', desc: 'Mensualidad Plan Pro', amount: '$1,500', date: 'Hoy, 10:30 AM', status: 'Exitoso' },
                            { id: 2, client: 'Inmobiliaria City', desc: 'Campaña Ads Extra', amount: '$300', date: 'Ayer, 04:15 PM', status: 'Exitoso' },
                            { id: 3, client: 'Restaurante K', desc: 'Producción de Video', amount: '$1,200', date: '18 Feb, 2024', status: 'Pendiente', pending: true },
                            { id: 4, client: 'Dr. Roberto Martínez', desc: 'Diseño Gráfico', amount: '$450', date: '17 Feb, 2024', status: 'Exitoso' },
                        ].map((tx, i) => (
                            <div key={tx.id} className={`p-4 flex items-center justify-between ${i !== 3 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.pending ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        {tx.pending ? <Clock className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{tx.client}</h4>
                                        <p className="text-gray-500 text-xs">{tx.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">{tx.amount}</p>
                                    <p className="text-gray-500 text-xs">{tx.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Payment Links */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-500" /> Links Activos
                    </h3>
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 space-y-3">
                        <PaymentLinkItem title="Asesoría Express" price="$150" clicks="12" />
                        <PaymentLinkItem title="Pack Contenido Intro" price="$500" clicks="5" />
                        <PaymentLinkItem title="Reserva de Fecha" price="$200" clicks="8" />

                        <button className="w-full py-3 mt-2 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 hover:text-white hover:border-white/30 transition-colors">
                            + Crear Nuevo Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPICard({ title, value, trend, trendUp, icon: Icon, color }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    )
}

function PaymentLinkItem({ title, price, clicks }) {
    return (
        <div className="flex items-center justify-between p-3 bg-[#151520] rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors group cursor-pointer">
            <div>
                <h4 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{title}</h4>
                <p className="text-gray-500 text-xs">${price} • Stripe</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{clicks} clics</span>
                <MoreHorizontal className="w-4 h-4 text-gray-600 hover:text-white" />
            </div>
        </div>
    )
}

function Clock({ className }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
