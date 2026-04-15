'use client';

import {
    Users, Mail, MoreHorizontal, UserPlus,
    BarChart2, Clock, CheckCircle, AlertCircle,
    Zap, Activity, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamPage() {
    const teamMembers = [
        {
            id: 1, name: 'Ana Garcia', role: 'Diseñadora Gráfica', status: 'Active',
            avatar: 'AG', color: 'bg-pink-500',
            stats: { tasks: 8, efficiency: '94%', load: 75 },
            activeTasks: ['Branding Kit', 'Posts Instagram', 'Banner Web']
        },
        {
            id: 2, name: 'Carlos Ruiz', role: 'Editor de Video', status: 'Active',
            avatar: 'CR', color: 'bg-blue-500',
            stats: { tasks: 5, efficiency: '88%', load: 92 }, // High Load
            activeTasks: ['Vlog Semanal', 'Reels Q4', 'Promo Evento']
        },
        {
            id: 3, name: 'Elena Diaz', role: 'Copywriter', status: 'Offline',
            avatar: 'ED', color: 'bg-amber-500',
            stats: { tasks: 3, efficiency: '98%', load: 45 },
            activeTasks: ['Guiones YouTube', 'Blog Post']
        },
        {
            id: 4, name: 'David Lee', role: 'Ads Specialist', status: 'In Call',
            avatar: 'DL', color: 'bg-emerald-500',
            stats: { tasks: 12, efficiency: '91%', load: 60 },
            activeTasks: ['Campaña FB', 'Google Ads Setup']
        },
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Gestión de Equipo</h1>
                        <p className="text-xs text-gray-400">Distribución de carga y rendimiento</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    <UserPlus className="w-4 h-4" />
                    <span>Invitar Miembro</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Activity className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Carga Total</p>
                            <p className="text-2xl font-black text-white">68%</p>
                        </div>
                    </div>
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><CheckCircle className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Tareas Completadas</p>
                            <p className="text-2xl font-black text-white">124 <span className="text-xs font-medium text-emerald-500">+12%</span></p>
                        </div>
                    </div>
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Clock className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Tiempo Promedio</p>
                            <p className="text-2xl font-black text-white">1.2d <span className="text-xs font-medium text-emerald-500">-5%</span></p>
                        </div>
                    </div>
                </div>

                <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Miembros Activos</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 relative group hover:border-indigo-500/30 hover:bg-[#13131f] transition-all">
                            <div className="absolute top-4 right-4">
                                <button className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center mt-2">
                                <div className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center text-xl font-bold text-white mb-3 shadow-lg shadow-black/50 relative border-4 border-[#0E0E18] group-hover:border-[#13131f] transition-colors`}>
                                    {member.avatar}
                                    <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#0E0E18] group-hover:border-[#13131f] transition-colors
                                        ${member.status === 'Active' ? 'bg-emerald-500' : member.status === 'Offline' ? 'bg-gray-500' : 'bg-amber-500'}`}
                                    />
                                </div>
                                <h3 className="text-white font-bold text-lg">{member.name}</h3>
                                <p className="text-indigo-400 text-xs font-bold bg-indigo-500/10 px-2 py-0.5 rounded mb-6">{member.role}</p>

                                {/* Workload Bar */}
                                <div className="w-full space-y-2 mb-6 text-left">
                                    <div className="flex justify-between text-xs font-bold text-gray-400">
                                        <span>Carga de Trabajo</span>
                                        <span className={member.stats.load > 90 ? 'text-red-400' : 'text-emerald-400'}>{member.stats.load}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${member.stats.load}%` }}
                                            className={`h-full rounded-full ${member.stats.load > 90 ? 'bg-red-500' : member.stats.load > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        />
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-2 w-full mb-6">
                                    <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Tareas</p>
                                        <p className="text-white font-bold">{member.stats.tasks}</p>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Eficacia</p>
                                        <p className="text-white font-bold">{member.stats.efficiency}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 w-full">
                                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold">
                                        <Mail className="w-3.5 h-3.5" /> Mensaje
                                    </button>
                                    <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-indigo-900/20">
                                        Ver Perfil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <button className="bg-[#0E0E18] border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UserPlus className="w-8 h-8 opacity-50 group-hover:opacity-100" />
                        </div>
                        <span className="font-bold text-sm">Contratar Freelancer</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
