'use client';

import {
    FileText, Download, Send, AlertCircle,
    CheckCircle2, Clock, Search, Filter
} from 'lucide-react';

const mockInvoices = [
    { id: 'INV-001', client: 'Clínica Dental RM', amount: '$1,500', date: '19 Feb 2026', status: 'Pagado', items: 'Plan Pro + Ads' },
    { id: 'INV-002', client: 'Inmobiliaria City', amount: '$300', date: '18 Feb 2026', status: 'Pagado', items: 'Campaña Ads Extra' },
    { id: 'INV-003', client: 'Restaurante K', amount: '$1,200', date: '15 Feb 2026', status: 'Pendiente', items: 'Producción Video' },
    { id: 'INV-004', client: 'Dr. Roberto Martínez', amount: '$450', date: '10 Feb 2026', status: 'Vencido', items: 'Diseño Gráfico' },
    { id: 'INV-005', client: 'Constructora Elite', amount: '$2,500', date: '01 Feb 2026', status: 'Pagado', items: 'Paquete Corporativo' },
];

export default function BillingView() {
    return (
        <div className="space-y-6">
            {/* Filters bar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar factura por cliente o ID..."
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#151520] border border-white/10 rounded-xl text-gray-400 hover:text-white text-sm font-medium">
                    <Filter className="w-4 h-4" /> Filtros
                </button>
            </div>

            {/* Invoices Table */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-[#151520]/50 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="p-4 font-bold">Estado</th>
                            <th className="p-4 font-bold">Folio / Fecha</th>
                            <th className="p-4 font-bold">Cliente</th>
                            <th className="p-4 font-bold">Concepto</th>
                            <th className="p-4 font-bold text-right">Monto</th>
                            <th className="p-4 font-bold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockInvoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <StatusBadge status={inv.status} />
                                </td>
                                <td className="p-4">
                                    <p className="text-white font-mono font-bold text-sm">{inv.id}</p>
                                    <p className="text-gray-500 text-xs">{inv.date}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-white font-bold text-sm">{inv.client}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-gray-400 text-sm max-w-[200px] truncate">{inv.items}</p>
                                </td>
                                <td className="p-4 text-right">
                                    <p className="text-white font-bold">{inv.amount}</p>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <button className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Descargar PDF">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Reenviar">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Footer */}
            <div className="flex justify-between items-center text-xs text-gray-500 px-2">
                <p>Mostrando 5 de 128 facturas</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#151520] rounded-lg border border-white/5 hover:border-white/20 hover:text-white transition-colors">Anterior</button>
                    <button className="px-3 py-1 bg-[#151520] rounded-lg border border-white/5 hover:border-white/20 hover:text-white transition-colors">Siguiente</button>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    const styles = {
        'Pagado': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Pendiente': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'Vencido': 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const icons = {
        'Pagado': CheckCircle2,
        'Pendiente': Clock,
        'Vencido': AlertCircle,
    };

    const StatusIcon = icons[status] || Clock;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles['Pendiente']}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status}
        </div>
    )
}
