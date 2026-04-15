'use client';

import {
    DollarSign, TrendingUp, TrendingDown, FileText,
    CheckCircle, Clock, AlertCircle, Download
} from 'lucide-react';

const sales = [
    { id: 'INV-001', client: 'Clínica Dental RM', service: 'Paquete Social Media', amount: 800, date: '15 Feb 2024', status: 'Pagado' },
    { id: 'INV-002', client: 'Tech Solutions', service: 'Desarrollo Web (50%)', amount: 1500, date: '10 Feb 2024', status: 'Pagado' },
    { id: 'INV-003', client: 'Inmobiliaria City', service: 'Campaña Ads Facebook', amount: 450, date: '05 Feb 2024', status: 'Pendiente' },
    { id: 'INV-004', client: 'Restaurante K', service: 'Diseño Menú', amount: 200, date: '28 Ene 2024', status: 'Vencido' },
];

export default function SalesRegistry() {
    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8">

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Registro de Ventas</h2>
                    <p className="text-gray-400 text-sm">Control de facturación y pagos en tiempo real.</p>
                </div>
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                    Nueva Venta / Factura
                </button>
            </div>

            {/* Financial KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPICard label="Facturado este Mes" value="$2,950" trend="+12%" positive={true} icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" />
                <KPICard label="Pendiente de Cobro" value="$650" trend="Atención" positive={false} icon={Clock} color="text-yellow-400" bg="bg-yellow-500/10" />
                <KPICard label="Ticket Promedio" value="$737" trend="+5%" positive={true} icon={TrendingUp} color="text-blue-400" bg="bg-blue-500/10" />
            </div>

            {/* Sales Table */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-[#151520]">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Factura</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Servicio</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sales.map(sale => (
                            <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 text-sm font-mono text-gray-500">{sale.id}</td>
                                <td className="px-6 py-4">
                                    <span className="block text-white font-bold text-sm">{sale.client}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">{sale.service}</td>
                                <td className="px-6 py-4 text-sm font-bold text-white">${sale.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{sale.date}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={sale.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function KPICard({ label, value, trend, positive, icon: Icon, color, bg }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex flex-col items-start relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className={`p-2 rounded-lg mb-3 ${bg} ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-white mb-1">{value}</span>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend}
                </span>
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    if (status === 'Pagado') {
        return <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><CheckCircle className="w-3 h-3" /> Pagado</span>
    }
    if (status === 'Pendiente') {
        return <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20"><Clock className="w-3 h-3" /> Pendiente</span>
    }
    if (status === 'Vencido') {
        return <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20"><AlertCircle className="w-3 h-3" /> Vencido</span>
    }
    return null;
}
