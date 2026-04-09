'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { agencyService } from '@/services/agencyService';
import {
    TrendingUp, DollarSign, PieChart, Activity,
    Calendar, ArrowUpRight, ArrowDownRight, Target
} from 'lucide-react';
import ROICalculator from './ROICalculator';

export default function FinancialDashboard() {
    const [view, setView] = useState('overview'); // overview, roi-calc
    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');
    const [clientData, setClientData] = useState(null);

    useEffect(() => {
        if (clientId) {
            const data = agencyService.getClientById(clientId);
            if (data) setClientData(data);
        }
    }, [clientId]);

    return (
        <div className="flex-1 h-full bg-[#050511] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-white/5 bg-[#0E0E18] flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm">Control Tower: {clientData?.name || 'Financiera'}</h2>
                        <div className="flex gap-4 mt-1">
                            <button
                                onClick={() => setView('overview')}
                                className={`text-xs font-bold transition-colors ${view === 'overview' ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setView('roi-calc')}
                                className={`text-xs font-bold transition-colors ${view === 'roi-calc' ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                Calculadora ROI
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-[#151520] rounded-lg p-1 border border-white/5">
                    {['Día', 'Semana', 'Mes', 'Año'].map(t => (
                        <button key={t} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${t === 'Mes' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {view === 'overview' ? <OverviewContent clientData={clientData} /> : <ROICalculator />}
            </div>
        </div>
    );
}

function OverviewContent({ clientData }) {
    const monthlyPrice = clientData?.price || 5000;
    const targetValue = clientData?.target || 28000;

    return (
        <div className="space-y-8">
            {/* Big KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <BigCard title="Inversión Mensual" value={`$${monthlyPrice}`} sub="Marketing + Ops" color="text-blue-400" />
                <BigCard title="Ventas Generadas" value={`$${(monthlyPrice * 4.5).toLocaleString()}`} sub="Confirmadas" color="text-emerald-400" />
                <BigCard title="ROI Global" value="450%" sub="Retorno x Inversión" color="text-purple-400" icon={TrendingUp} />
                <BigCard title="Meta Proyectada" value={`$${targetValue.toLocaleString()}`} sub="Objetivo Mensual" color="text-orange-400" />
            </div>

            {/* Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart (Investment vs Return) */}
                <div className="lg:col-span-2 bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold text-lg">Inversión vs Retorno</h3>
                        <div className="flex gap-4 text-xs font-bold">
                            <span className="flex items-center gap-2 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Inversión</span>
                            <span className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Retorno</span>
                        </div>
                    </div>
                    {/* Mock Chart Visualization */}
                    <div className="h-64 flex items-end justify-between gap-2 px-4 relative">
                        {/* Bars for 7 days */}
                        {[30, 45, 25, 60, 40, 75, 55].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group cursor-pointer">
                                {/* Profit Tooltip */}
                                <div className="hidden group-hover:block absolute top-0 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
                                    +${Math.round(monthlyPrice / 30 * h * 0.1)}
                                </div>
                                <div className="w-full bg-emerald-500/20 hover:bg-emerald-500 transition-colors rounded-t-sm relative" style={{ height: `${h}%` }}>
                                    <div className="absolute bottom-0 w-full bg-blue-500/30 hover:bg-blue-500 transition-colors" style={{ height: `${h * 0.4}%` }}></div>
                                </div>
                                <span className="text-[10px] text-gray-600 text-center">Día {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Services */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">Top Servicios Rentables</h3>
                    <div className="space-y-4">
                        <ServiceItem name="Paquete Médico Pro" roi="450%" profit={`$${Math.round(monthlyPrice * 0.4)}`} />
                        <ServiceItem name="Video Corporativo" roi="320%" profit={`$${Math.round(monthlyPrice * 0.2)}`} />
                        <ServiceItem name="Gestión Redes" roi="180%" profit={`$${Math.round(monthlyPrice * 0.1)}`} />
                        <ServiceItem name="Diseño Web" roi="210%" profit={`$${Math.round(monthlyPrice * 0.15)}`} />
                    </div>
                    <button className="w-full mt-4 py-3 bg-[#151520] hover:bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors">
                        Ver Reporte Completo
                    </button>
                </div>
            </div>

            {/* Projections */}
            <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-2xl p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-1">
                        <Target className="w-5 h-5 text-indigo-400" /> Proyección IA
                    </h3>
                    <p className="text-gray-400 text-sm">Basado en tu tendencia actual, cerrarás el mes con <span className="text-white font-bold">${targetValue.toLocaleString()}</span>.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Crecimiento Est.</p>
                    <p className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
                        <ArrowUpRight className="w-5 h-5" /> +22%
                    </p>
                </div>
            </div>
        </div>
    )
}

function BigCard({ title, value, sub, color, icon: Icon }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">{title}</p>
            <div className="flex justify-between items-end">
                <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
                {Icon && <Icon className={`w-6 h-6 ${color} opacity-50`} />}
            </div>
            <p className="text-gray-600 text-xs mt-2">{sub}</p>
        </div>
    )
}

function ServiceItem({ name, roi, profit }) {
    return (
        <div className="flex justify-between items-center p-3 bg-[#151520] rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
            <div>
                <h4 className="text-white text-sm font-bold">{name}</h4>
                <div className="flex gap-2 text-[10px] mt-0.5">
                    <span className="text-emerald-400">ROI: {roi}</span>
                </div>
            </div>
            <div className="text-right">
                <span className="block text-white font-bold text-sm">+{profit}</span>
                <span className="text-[10px] text-gray-500">Utilidad</span>
            </div>
        </div>
    )
}
