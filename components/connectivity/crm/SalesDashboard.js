'use client';

import { DollarSign, Calendar, Tag, ExternalLink, Filter, Download } from 'lucide-react';

const MOCK_SALES = [
    { id: 1, client: 'Clínica Dental Elite', service: 'Video Corporativo', value: 800, status: 'Cerrado', date: '12 Ene', source: 'Instagram Ads', sourceColor: 'text-pink-500' },
    { id: 2, client: 'Dr. Alejandro Pérez', service: 'Reels Mensuales', value: 350, status: 'Cerrado', date: '14 Ene', source: 'WhatsApp', sourceColor: 'text-green-500' },
    { id: 3, client: 'Inmobiliaria Horizonte', service: 'Tour Virtual 360', value: 1200, status: 'Cerrado', date: '15 Ene', source: 'Facebook Ads', sourceColor: 'text-blue-500' },
    { id: 4, client: 'Restaurante Sabor', service: 'Fotografía Menú', value: 450, status: 'Cerrado', date: '16 Ene', source: 'Referido', sourceColor: 'text-yellow-500' },
    { id: 5, client: 'Tech StartUp One', service: 'Branding Kit', value: 1500, status: 'Negociación', date: '18 Ene', source: 'LinkedIn', sourceColor: 'text-blue-400' },
];

export default function SalesDashboard() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header / stats compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 flex flex-col justify-center">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Ventas (Mes)</span>
                    <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold text-white">$4,300</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 flex flex-col justify-center">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Ticket Promedio</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-white">$860</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center items-start">
                    <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors w-full h-full">
                        <Download className="w-4 h-4" />
                        <span>Exportar Reporte CSV</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0A0A12] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" /> Historial de Transacciones
                    </h3>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="p-4 font-medium">Cliente</th>
                                <th className="p-4 font-medium">Servicio</th>
                                <th className="p-4 font-medium">Valor</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 font-medium">Fecha</th>
                                <th className="p-4 font-medium">Fuente</th>
                                <th className="p-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {MOCK_SALES.map((sale) => (
                                <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-medium text-white">{sale.client}</td>
                                    <td className="p-4 text-gray-300">
                                        <span className="flex items-center gap-2">
                                            <Tag className="w-3 h-3 text-gray-500" /> {sale.service}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-green-400">${sale.value}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${sale.status === 'Cerrado' ? 'bg-green-500/10 text-green-500' :
                                                sale.status === 'Perdido' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> {sale.date}
                                    </td>
                                    <td className={`p-4 font-medium ${sale.sourceColor}`}>
                                        {sale.source}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
                                            <ExternalLink className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
