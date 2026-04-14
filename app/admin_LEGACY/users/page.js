'use client';

import { 
    Search, Filter, ExternalLink, 
    MoreVertical, Shield, Ban, 
    Edit, Trash2, CheckCircle2, 
    Clock, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const clients = [
        {
            status: 'Activos',
            color: 'emerald',
            icon: CheckCircle2,
            list: [
                { id: 'C1', name: 'Hospital Nova Clínica', plan: 'Plan Anual', contact: 'gerencia@novaclinica.com', joined: '12 Jan 2025' },
                { id: 'C2', name: 'Global Media Group', plan: 'Plan 6 Meses', contact: 'admin@globalmedia.com', joined: '01 Feb 2025' },
            ]
        },
        {
            status: 'En Proceso',
            color: 'blue',
            icon: Clock,
            list: [
                { id: 'C3', name: 'Nova Urology', plan: 'Plan Standard', contact: 'dr.patino@urology.com', joined: '15 Mar 2025' },
                { id: 'C4', name: 'Tech Solutions Inc', plan: 'Plan 3 Meses', contact: 'sales@techsolutions.io', joined: 'Today' },
            ]
        },
        {
            status: 'Inactivos',
            color: 'rose',
            icon: AlertCircle,
            list: [
                { id: 'C5', name: 'Old Partner S.A.', plan: 'Freemium', contact: 'legacy@oldpartner.com', joined: 'Oct 2024' },
            ]
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Control de Clientes</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Ecosistema de Cuentas y Contratos</p>
                </div>
                <button 
                    onClick={() => toast.success('Módulo de Alta de Clientes activado')}
                    className="h-14 px-8 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-amber-500/20 active:scale-95 text-xs uppercase tracking-widest"
                >
                    + Nuevo Registro
                </button>
            </header>

            <div className="space-y-12">
                {clients.map((group) => (
                    <div key={group.status} className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        {/* Group Header */}
                        <div className="px-10 py-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl bg-${group.color}-500/10 flex items-center justify-center text-${group.color}-500`}>
                                    <group.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight">{group.status}</h2>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{group.list.length} Cuentas vinculadas</p>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest">ID / Entidad</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">Plan Administrativo</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest">Registro</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-right">Mantenimiento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {group.list.map((client) => (
                                    <tr key={client.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-10 py-7">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-white font-black text-base uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{client.name}</span>
                                                    <ExternalLink className="w-3 h-3 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <span className="text-[10px] text-gray-600 font-mono tracking-tight">{client.id} — {client.contact}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10 uppercase tracking-widest">
                                                {client.plan}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            {client.joined}
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500 hover:text-white transition-all text-gray-400">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500 hover:text-white transition-all text-gray-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}


