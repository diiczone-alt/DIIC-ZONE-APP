'use client';

import { useState } from 'react';
import {
    Search, Filter, MoreVertical, Smartphone, Mail,
    Calendar, Tag, Star, ChevronDown, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadProfileView from './LeadProfileView';

// Mock Data
const leadsData = [
    { id: 1, name: 'Dr. Roberto Martínez', company: 'Clínica Dental RM', email: 'roberto@clinica.com', phone: '+52 55 1234 5678', source: 'WhatsApp', status: 'Nuevo', score: 85, tags: ['Salud', 'Urgente'], lastContact: 'Hoy, 10:42 AM' },
    { id: 2, name: 'Ana García', company: 'Inmobiliaria City', email: 'ana@cityrealestate.mx', phone: '+52 55 8765 4321', source: 'Ads', status: 'Contactado', score: 62, tags: ['Real Estate'], lastContact: 'Ayer, 4:15 PM' },
    { id: 3, name: 'Carlos López', company: 'Restaurante K', email: 'carlos@restk.com', phone: '+52 55 1122 3344', source: 'Instagram', status: 'Cotización', score: 92, tags: ['Gastronomía', 'Alto Valor'], lastContact: 'Hace 2 días' },
    { id: 4, name: 'Lucía Méndez', company: 'Abogados & Co', email: 'lucia@abogados.com', phone: '+52 55 4433 2211', source: 'Web', status: 'Negociación', score: 78, tags: ['Legal'], lastContact: 'Hace 5 días' },
    { id: 5, name: 'Pedro Sánchez', company: 'Tech Solutions', email: 'pedro@tech.com', phone: '+52 55 9988 7766', source: 'Referido', status: 'Ganado', score: 98, tags: ['Tecnología'], lastContact: 'Semana pasada' },
];

export default function LeadList() {
    const [selectedLead, setSelectedLead] = useState(null);
    const [filter, setFilter] = useState('all');

    return (
        <div className="flex h-full bg-[#050511] relative">

            {/* List Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* List Header */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E18]">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="font-bold text-white">Todos los Leads ({leadsData.length})</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 bg-[#0E0E18]/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1 flex items-center justify-center"><Square className="w-4 h-4" /></div>
                    <div className="col-span-3">Nombre / Empresa</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-2">Origen</div>
                    <div className="col-span-2">Último Contacto</div>
                </div>

                {/* Rows */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {leadsData.map(lead => (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-[#151520] transition-colors cursor-pointer group items-center"
                        >
                            <div className="col-span-1 flex items-center justify-center text-gray-600 group-hover:text-gray-400">
                                <Square className="w-4 h-4" />
                            </div>
                            <div className="col-span-3">
                                <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                                <p className="text-xs text-gray-500">{lead.company}</p>
                            </div>
                            <div className="col-span-2">
                                <StatusBadge status={lead.status} />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <div className={`px-2 py-0.5 rounded textxs font-bold border ${getScoreColor(lead.score)}`}>
                                    {lead.score}
                                </div>
                            </div>
                            <div className="col-span-2 flex items-center gap-2 text-sm text-gray-400">
                                {getSourceIcon(lead.source)}
                                <span>{lead.source}</span>
                            </div>
                            <div className="col-span-2 text-xs text-gray-500">
                                {lead.lastContact}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Profile Slide-over */}
            <AnimatePresence>
                {selectedLead && (
                    <LeadProfileView lead={selectedLead} onClose={() => setSelectedLead(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}

function StatusBadge({ status }) {
    let color = 'bg-gray-700/20 text-gray-400 border-gray-600/30';
    if (status === 'Nuevo') color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (status === 'Contactado') color = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (status === 'Ganado') color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${color}`}>
            {status}
        </span>
    )
}

function getScoreColor(score) {
    if (score >= 80) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (score >= 50) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
}

function getSourceIcon(source) {
    if (source === 'WhatsApp') return <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />;
    if (source === 'Ads') return <Tag className="w-3.5 h-3.5 text-blue-400" />;
    if (source === 'Instagram') return <Star className="w-3.5 h-3.5 text-pink-500" />;
    return <Mail className="w-3.5 h-3.5 text-gray-400" />;
}
