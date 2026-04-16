'use client';

import { useState, useEffect } from 'react';
import {
    Users, Mail, MoreHorizontal, UserPlus,
    BarChart2, Clock, CheckCircle, AlertCircle,
    Zap, Activity, Shield, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            setLoading(true);
            try {
                // Fetch all members from the team table
                const { data, error } = await supabase
                    .from('team')
                    .select('*');

                if (error) throw error;

                // Filter to exclude other CMs and Admins (unless they are specifically part of the creative team)
                // We'll show members whose roles are related to production/creative
                const filtered = (data || [])
                    .filter(m => {
                        const role = (m.role || '').toLowerCase();
                        return !role.includes('community manager') && !role.includes('admin');
                    })
                    .map(m => {
                        // Map database fields to UI fields
                        // Extract initials for avatar
                        const names = m.name.split(' ');
                        const initials = names.length > 1 
                            ? `${names[0][0]}${names[names.length-1][0]}`.toUpperCase()
                            : names[0][0]?.toUpperCase() || '??';

                        // Assign a color based on the role
                        const role = m.role.toLowerCase();
                        let color = 'bg-blue-500';
                        if (role.includes('editor')) color = 'bg-indigo-500';
                        if (role.includes('designer') || role.includes('diseñador')) color = 'bg-pink-500';
                        if (role.includes('social')) color = 'bg-purple-500';
                        if (role.includes('web') || role.includes('dev')) color = 'bg-cyan-500';
                        if (role.includes('filmmaker') || role.includes('photo')) color = 'bg-rose-500';

                        return {
                            id: m.id,
                            name: m.name,
                            role: m.role,
                            status: m.status || 'Active',
                            avatar: initials,
                            color: color,
                            stats: { 
                                tasks: m.activetasks || 0, 
                                efficiency: '92%', // Default/Calculated elsewhere
                                load: Math.min(((m.activetasks || 0) / 10) * 100, 100) // Assumed 10 tasks = 100% load
                            },
                        };
                    });

                setTeamMembers(filtered);
            } catch (err) {
                console.error('Error fetching team:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#050511] text-white gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando Equipo CM...</p>
            </div>
        );
    }

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
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer group">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform"><Activity className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Carga Total</p>
                            <p className="text-2xl font-black text-white">
                                {Math.round(teamMembers.reduce((acc, m) => acc + m.stats.load, 0) / (teamMembers.length || 1))}%
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer group">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform"><CheckCircle className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Tareas en Curso</p>
                            <p className="text-2xl font-black text-white">
                                {teamMembers.reduce((acc, m) => acc + m.stats.tasks, 0)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer group">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-110 transition-transform"><Clock className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Productividad</p>
                            <p className="text-2xl font-black text-white">96% <span className="text-xs font-medium text-emerald-500">+4%</span></p>
                        </div>
                    </div>
                </div>

                <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Miembros del Equipo</h3>

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
                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded mb-6">{member.role}</p>

                                {/* Workload Bar */}
                                <div className="w-full space-y-2 mb-6 text-left">
                                    <div className="flex justify-between text-xs font-bold text-gray-400">
                                        <span>Carga de Trabajo</span>
                                        <span className={member.stats.load > 90 ? 'text-red-400' : 'text-emerald-400'}>{Math.round(member.stats.load)}%</span>
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
                                    <div className="bg-black/20 p-2 rounded-lg border border-white/5 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Tareas</p>
                                        <p className="text-white font-bold">{member.stats.tasks}</p>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded-lg border border-white/5 text-center">
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
                    <button className="bg-[#0E0E18] border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[350px]">
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
