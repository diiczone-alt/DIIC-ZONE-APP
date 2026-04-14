'use client';

import { use } from 'react';
import {
    Phone, Mail, MapPin, Globe,
    Calendar, CheckCircle, Clock, FileText,
    MessageSquare, MoreVertical, Edit3
} from 'lucide-react';
import { InteractionLog } from '@/components/crm/CRMComponents';
import Link from 'next/link';

export default function ClientDetailPage({ params }) {
    const { id } = use(params);
    // Mock Data based on ID (In real app, fetch from DB)
    const client = {
        id: id,
        name: 'Roberto Gómez',
        company: 'Tech Solutions Inc.',
        role: 'CEO',
        email: 'roberto@techsolutions.com',
        phone: '+52 55 1234 5678',
        address: 'Av. Reforma 222, CDMX',
        website: 'techsolutions.com',
        status: 'active',
        ltv: '12,500',
        joined: 'Jan 2025',
        tags: ['Corporate', 'High Value', 'Recurring'],
        team: [
            { name: 'Sarah Editor', role: 'Lead', avatar: '' },
            { name: 'Mike Film', role: 'Support', avatar: '' }
        ]
    };

    const interactions = [
        { author: 'Ana (CM)', type: 'Reunión', date: 'Ayer, 10:00 AM', content: 'Revisión de estrategia Q3. Cliente solicita enfoque en LinkedIn.', tags: ['Strategy', 'LinkedIn'] },
        { author: 'Sistema', type: 'Factura', date: '15 Feb 2026', content: 'Factura #F-9092 enviada por $2,500 USD.', tags: ['Finance'] },
        { author: 'Carlos (Sales)', type: 'Nota', date: '10 Feb 2026', content: 'El cliente mencionó interés en servicios de Podcast. Dar seguimiento en 2 semanas.', tags: ['Upsell'] },
    ];

    const projects = [
        { id: 'P-101', name: 'Campaña Lanzamiento App', status: 'En Proceso', deadline: '20 Mar 2026', progress: 65 },
        { id: 'P-098', name: 'Video Corporativo Anual', status: 'Completado', deadline: '15 Jan 2026', progress: 100 },
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/workstation/crm" className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                        <span className="text-gray-400">←</span>
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-white flex items-center gap-3">
                            {client.name}
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-bold">Activo</span>
                        </h1>
                        <p className="text-sm text-gray-400">{client.company} • {client.role}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-white/5">
                        <Edit3 className="w-4 h-4" /> Editar
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20">
                        + Nueva Tarea
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Info & Value */}
                    <div className="space-y-6">

                        {/* Contact Card */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider text-gray-500">Contacto</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Mail className="w-4 h-4 text-gray-500" /> {client.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Phone className="w-4 h-4 text-gray-500" /> {client.phone}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Globe className="w-4 h-4 text-gray-500" /> {client.website}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <MapPin className="w-4 h-4 text-gray-500" /> {client.address}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-gray-500">Equipo Asignado</h3>
                                <div className="flex -space-x-2">
                                    {client.team.map((member, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0E0E18] flex items-center justify-center text-[10px] text-white font-bold" title={member.name}>
                                            {member.name.charAt(0)}
                                        </div>
                                    ))}
                                    <button className="w-8 h-8 rounded-full bg-white/5 border border-dashed border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors text-xs">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Value Card */}
                        <div className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-indigo-500/20 rounded-2xl p-6">
                            <h3 className="font-bold text-indigo-400 mb-2 text-xs uppercase tracking-wider">Lifetime Value (LTV)</h3>
                            <p className="text-3xl font-black text-white">${client.ltv}</p>
                            <p className="text-xs text-gray-500 mt-1">Cliente desde {client.joined}</p>
                        </div>

                    </div>

                    {/* Middle Column: Activity & History */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Projects */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="font-bold text-white text-sm">Proyectos</h3>
                                <Link href="#" className="text-[10px] text-indigo-400 hover:text-white uppercase font-bold">Ver Todo</Link>
                            </div>
                            <div className="divide-y divide-white/5">
                                {projects.map(project => (
                                    <div key={project.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{project.name}</h4>
                                                <p className="text-xs text-gray-500">{project.id} • Deadline: {project.deadline}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${project.status === 'En Proceso' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interaction Log */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white text-lg">Bitácora de Interacción</h3>
                                <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> Agregar Nota
                                </button>
                            </div>
                            <InteractionLog interactions={interactions} />
                        </div>

                    </div>

                </div>

            </main>
        </div>
    );
}
