'use client';

import {
    CreditCard, Download, ShieldCheck, Zap, TrendingUp,
    DollarSign, Briefcase, Activity, Calendar, ArrowUpRight,
    PieChart, Lock
} from 'lucide-react';

const DIIC_SERVICES = [
    { name: 'Reels Mensuales', plan: 'Plan Pro', status: 'Activo', value: '$350', next: '20 Feb' },
    { name: 'Web Médica', plan: 'Landing', status: 'Pagado', value: '$480', next: '—' },
    { name: 'Video Corporativo', plan: 'Único', status: 'Pagado', value: '$800', next: '—' },
];

const BUSINESS_INCOME = [
    { name: 'Consulta Médica', sales: 18, income: '$900', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Cirugía Láser', sales: 3, income: '$3,600', color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Tratamientos', sales: 5, income: '$450', color: 'text-green-400', bg: 'bg-green-500/10' },
];

const INVOICES = [
    { id: 'INV-001', date: '20 Oct', concept: 'Plan Mensual Oct', amount: '$350', status: 'Pagado' },
    { id: 'INV-002', date: '12 Oct', concept: 'Video Corporativo', amount: '$800', status: 'Pagado' },
    { id: 'INV-003', date: '20 Sep', concept: 'Plan Mensual Sep', amount: '$350', status: 'Pagado' },
];

const ADMIN_PROJECTS = [
    { name: 'Video Corporativo', cost: '$220', income: '$800', profit: '$580' },
    { name: 'Reels (Mes)', cost: '$90', income: '$350', profit: '$260' },
];

export default function FinanceDashboard({ isDrawer = false }) {
    return (
        <div className="space-y-8 pb-20 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                        Finanzas & Rentabilidad <TrendingUp className="w-8 h-8 text-green-500" />
                    </h1>
                    <p className="text-gray-400">Tu dinero: Lo que inviertes, lo que vendes y lo que ganas.</p>
                </div>
            </div>

            {/* Top Cards: Financial Summary */}
            <div className={`grid gap-4 ${isDrawer ? 'grid-cols-1' : 'md:grid-cols-4'}`}>
                <SummaryCard title="Inversión Marketing" value="$1,200" icon={CreditCard} color="text-gray-400" />
                <SummaryCard title="Ventas del Negocio" value="$4,950" icon={DollarSign} color="text-green-400" highlight />
                <SummaryCard title="ROI General" value="375%" icon={Activity} color="text-purple-400" sub="x3.7 Retorno" />
                <SummaryCard title="Servicios Activos" value="3" icon={Briefcase} color="text-blue-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BLOCK 2: Business Income (The Goal) */}
                <section className="bg-[#0A0A12] rounded-3xl border border-white/5 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Ingresos de tu Negocio</h3>
                            <p className="text-xs text-gray-400">Ventas generadas a través de ofertas y CRM.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {BUSINESS_INCOME.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${item.bg} ${item.color}`}>
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.sales} ventas</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-white text-lg">{item.income}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-green-900/10 border border-green-500/20 flex gap-3">
                        <TrendingUp className="w-5 h-5 text-green-400 shrink-0" />
                        <p className="text-sm text-green-200">
                            <strong>Insight:</strong> La "Cirugía Láser" representa el 72% de tus ingresos este mes.
                        </p>
                    </div>
                </section>

                {/* BLOCK 1: Contracted Services (The Cost) */}
                <section className="bg-[#0A0A12] rounded-3xl border border-white/5 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Servicios DIIC ZONE</h3>
                            <p className="text-xs text-gray-400">Tu inversión creativa activa.</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-500 uppercase border-b border-white/5">
                                <tr>
                                    <th className="pb-3 pl-2">Servicio</th>
                                    <th className="pb-3">Valor</th>
                                    <th className="pb-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {DIIC_SERVICES.map((srv, idx) => (
                                    <tr key={idx} className="group">
                                        <td className="py-4 pl-2">
                                            <div className="font-bold text-white">{srv.name}</div>
                                            <div className="text-xs text-gray-500">{srv.plan}</div>
                                        </td>
                                        <td className="py-4 text-gray-300 font-medium">{srv.value}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${srv.status === 'Activo' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                {srv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BLOCK 4: Real Profitability */}
                <section className="lg:col-span-2 bg-[#0A0A12] rounded-3xl border border-white/5 p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <PieChart className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Análisis de Rentabilidad</h3>
                            <p className="text-xs text-gray-400">¿Realmente funciona tu marketing?</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                        <MetricBlock label="Inversión Total" value="$1,550" sub="Marketing + Ads" />
                        <MetricBlock label="Ventas Totales" value="$4,950" sub="Generadas" highlight />
                        <MetricBlock label="Costo x Lead" value="$2.10" sub="Optimo" />
                        <MetricBlock label="Costo x Cliente" value="$31.00" sub="Rentable" />
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Retorno de Inversión (ROI)</span>
                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2">319%</div>
                            </div>
                            <div className="text-right">
                                <span className="text-green-400 text-sm font-bold flex items-center gap-1 justify-end">
                                    <ArrowUpRight className="w-4 h-4" /> En crecimiento
                                </span>
                                <p className="text-gray-500 text-xs mt-1">Por cada $1 invertido, recuperas $3.19</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BLOCK 5: Internal Profitability (Admin View) */}
                <section className="bg-[#05050A] rounded-3xl border border-white/5 p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Vista Admin</span>
                        </div>
                        <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">Utilidad Neta</span>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {ADMIN_PROJECTS.map((proj, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-white text-sm">{proj.name}</span>
                                    <span className="text-green-400 font-bold text-sm">+{proj.profit}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Ingreso: {proj.income}</span>
                                    <span>Costo: {proj.cost}</span>
                                </div>
                                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[70%]"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* BLOCK 3: Payments History */}
            <div className="bg-[#0A0A12] rounded-3xl border border-white/5 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Pagos a DIIC ZONE</h3>
                    <button className="text-sm text-blue-400 font-bold hover:text-white transition-colors">Ver todas las facturas</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="pb-4 pl-4 font-medium">Factura</th>
                                <th className="pb-4 font-medium">Concepto</th>
                                <th className="pb-4 font-medium">Monto</th>
                                <th className="pb-4 font-medium">Estado</th>
                                <th className="pb-4 pr-4 font-medium text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {INVOICES.map(inv => (
                                <tr key={inv.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="text-white font-medium text-sm">{inv.id}</div>
                                        <div className="text-xs text-gray-500">{inv.date}</div>
                                    </td>
                                    <td className="py-4 text-gray-300 text-sm">{inv.concept}</td>
                                    <td className="py-4 text-white font-bold text-sm">{inv.amount}</td>
                                    <td className="py-4">
                                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase border border-emerald-500/20">
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Trust */}
            <div className="flex justify-center items-center gap-2 text-gray-600 text-xs py-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Gestión financiera segura y transparente.</span>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon: Icon, color, highlight, sub }) {
    return (
        <div className="bg-[#0A0A12] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`p-3 rounded-xl w-fit mb-4 ${color === 'text-green-400' ? 'bg-green-500/10' : 'bg-white/5'} ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
            <div className={`text-3xl font-black ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</div>
            {sub && <div className="text-xs text-purple-400 font-bold mt-2">{sub}</div>}
        </div>
    );
}

function MetricBlock({ label, value, sub, highlight }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</div>
            <div className={`text-2xl font-black ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{sub}</div>
        </div>
    );
}
