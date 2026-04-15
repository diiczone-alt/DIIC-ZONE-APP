'use client';

import {
    Search, Filter, MoreVertical,
    MessageSquare, Phone, Mail, Calendar,
    CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import Link from 'next/link';

export function ClientTable({ clients }) {
    // Status Styles
    const getStatusStyle = (status) => {
        if (status === 'active') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (status === 'lead') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (status === 'churn_risk') return 'bg-red-500/10 text-red-400 border-red-500/20';
        if (status === 'inactive') return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        return 'bg-gray-800 text-gray-400';
    };

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, empresa o email..."
                        className="w-full bg-[#1A1A24] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <button className="px-4 py-2 bg-[#1A1A24] border border-white/5 rounded-xl text-gray-400 hover:text-white flex items-center gap-2 text-xs font-bold transition-colors">
                    <Filter className="w-4 h-4" /> Filtros
                </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <div className="col-span-4">Cliente / Empresa</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2">Valor (LTV)</div>
                <div className="col-span-3">Última Actividad</div>
                <div className="col-span-1 text-right">Acción</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
                {clients.map((client) => (
                    <div key={client.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group">

                        {/* Name/Company */}
                        <div className="col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-white font-bold text-xs border border-white/10">
                                {client.initials}
                            </div>
                            <div>
                                <Link href={`/workstation/crm/${client.id}`}>
                                    <h4 className="font-bold text-white text-sm hover:text-purple-400 transition-colors cursor-pointer">{client.name}</h4>
                                </Link>
                                <p className="text-xs text-gray-500">{client.company}</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border uppercase ${getStatusStyle(client.status)}`}>
                                {client.statusLabel}
                            </span>
                        </div>

                        {/* Value */}
                        <div className="col-span-2">
                            <p className="font-bold text-white text-sm">${client.ltv}</p>
                            <p className="text-[10px] text-gray-500">{client.projectsCount} Proyectos</p>
                        </div>

                        {/* Last Activity */}
                        <div className="col-span-3">
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <MessageSquare className="w-3 h-3" />
                                <span>{client.lastActivity}</span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="col-span-1 text-right">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export function InteractionLog({ interactions }) {
    return (
        <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
            {interactions.map((item, index) => (
                <div key={index} className="relative pl-10">
                    {/* Icon Dot */}
                    <div className="absolute left-2 -translate-x-1/2 top-0 w-4 h-4 rounded-full bg-[#0E0E18] border-2 border-purple-500 z-10 box-content" />

                    <div className="bg-[#1A1A24] border border-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{item.author}</span>
                                <span className="text-xs text-gray-500">• {item.type}</span>
                            </div>
                            <span className="text-[10px] text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{item.content}</p>
                        {item.tags && (
                            <div className="flex gap-2 mt-3">
                                {item.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
