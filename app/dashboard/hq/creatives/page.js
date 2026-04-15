'use client';

import { useState } from 'react';
import HQSidebar from '@/components/layout/HQSidebar';
import {
    Users, UserPlus, Filter, MoreHorizontal,
    Star, Shield, Ban, CheckCircle2
} from 'lucide-react';

export default function CreativesManagerPage() {
    const [filter, setFilter] = useState('all');

    const creatives = [
        { id: 1, name: 'Carlos Rodriguez', role: 'Editor Video', level: 4, status: 'active', load: 85, projects: 3 },
        { id: 2, name: 'Ana Garcia', role: 'Diseñador', level: 3, status: 'active', load: 45, projects: 1 },
        { id: 3, name: 'Pedro Lopez', role: 'Filmmaker', level: 2, status: 'paused', load: 0, projects: 0 },
        { id: 4, name: 'Sofia Martinez', role: 'Community', level: 5, status: 'active', load: 90, projects: 5 },
        { id: 5, name: 'Lucas Studio', role: 'Audio/Mix', level: 3, status: 'active', load: 20, projects: 1 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'paused': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'banned': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white font-sans">
            <HQSidebar />
            <div className="pl-20 lg:pl-64 transition-all duration-300">
                <main className="p-8 max-w-[1600px] mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                <Users className="w-8 h-8 text-indigo-500" /> Gestión de Creativos
                            </h1>
                            <p className="text-gray-400 mt-1">Administra accesos, roles y niveles de tu equipo.</p>
                        </div>
                        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all">
                            <UserPlus className="w-5 h-5" /> Invitar Creativo
                        </button>
                    </div>

                    {/* Filters & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#0E0E18] border border-white/5 p-4 rounded-xl">
                            <p className="text-gray-500 text-xs font-bold uppercase">Total Equipo</p>
                            <p className="text-2xl font-black text-white">12 Miembros</p>
                        </div>
                        <div className="bg-[#0E0E18] border border-white/5 p-4 rounded-xl">
                            <p className="text-gray-500 text-xs font-bold uppercase">Activos Hoy</p>
                            <p className="text-2xl font-black text-emerald-400">8 Online</p>
                        </div>
                        <div className="bg-[#0E0E18] border border-white/5 p-4 rounded-xl">
                            <p className="text-gray-500 text-xs font-bold uppercase">Carga Promedio</p>
                            <p className="text-2xl font-black text-yellow-400">72%</p>
                        </div>
                        <div className="bg-[#0E0E18] border border-white/5 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                            <span className="text-gray-400 font-bold">Filtros</span>
                            <Filter className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>

                    {/* Creatives List */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5 text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="p-6 font-bold">Nombre / Rol</th>
                                    <th className="p-6 font-bold text-center">Nivel</th>
                                    <th className="p-6 font-bold text-center">Estado</th>
                                    <th className="p-6 font-bold text-center">Carga</th>
                                    <th className="p-6 font-bold text-center">Proyectos</th>
                                    <th className="p-6 font-bold text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {creatives.map((creator) => (
                                    <tr key={creator.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white border border-white/10">
                                                    {creator.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{creator.name}</p>
                                                    <p className="text-xs text-gray-500">{creator.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1A1A2E] border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                                                <Star className="w-3 h-3 fill-indigo-300" /> Lvl {creator.level}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(creator.status)}`}>
                                                {creator.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="w-24 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${creator.load > 80 ? 'bg-red-500' : creator.load > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${creator.load}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">{creator.load}% Ocupación</p>
                                        </td>
                                        <td className="p-6 text-center font-bold text-white">
                                            {creator.projects}
                                        </td>
                                        <td className="p-6 text-end">
                                            <button className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}
