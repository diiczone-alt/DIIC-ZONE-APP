'use client';

import {
    Building2, MoreVertical, Wallet, Calendar,
    CheckCircle2, Clock, Smartphone
} from 'lucide-react';

const clients = [
    { id: 1, name: 'Clínica Dental RM', contact: 'Dr. Roberto', ltv: 4500, status: 'Activo', projects: 2, services: ['Social Media', 'Ads'], lastPayment: '15 Feb 2024' },
    { id: 2, name: 'Tech Solutions', contact: 'Pedro Sánchez', ltv: 12000, status: 'VIP', projects: 1, services: ['Desarrollo Web'], lastPayment: '10 Feb 2024' },
    { id: 3, name: 'Restaurante K', contact: 'Carlos López', ltv: 850, status: 'Riesgo', projects: 1, services: ['Menú Digital'], lastPayment: '01 Ene 2024' },
];

export default function ClientList() {
    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Directorio de Clientes</h2>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div key={client.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
                                    <Building2 className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">{client.name}</h3>
                                    <p className="text-xs text-gray-500">{client.contact}</p>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">LTV (Valor)</p>
                                <p className="text-lg font-bold text-emerald-400">${client.ltv.toLocaleString()}</p>
                            </div>
                            <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Estado</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${client.status === 'VIP' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        client.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>{client.status}</span>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="mb-6">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Servicios Activos</p>
                            <div className="flex flex-wrap gap-2">
                                {client.services.map(s => (
                                    <span key={s} className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-300 border border-white/5">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 pt-4 border-t border-white/5">
                            <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-colors">
                                Ver Perfil
                            </button>
                            <button className="p-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl transition-colors">
                                <Smartphone className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
