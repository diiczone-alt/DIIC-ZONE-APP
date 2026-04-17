'use client';

import { useState, useEffect } from 'react';
import {
    Users, Mail, MoreHorizontal, UserPlus,
    BarChart2, Clock, CheckCircle, AlertCircle,
    Zap, Activity, Shield, Loader2, X,
    Phone, MessageSquare, ExternalLink, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function TeamPage() {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [activeTab, setActiveTab] = useState('performance');

    useEffect(() => {
        const fetchTeam = async () => {
            if (!user?.team_id) {
                // If user is loaded but no team_id, we might still be loading or they have no squad
                if (user) setLoading(false);
                return;
            }

            setLoading(true);
            const timeoutId = setTimeout(() => {
                setLoading(true); // Ensure we don't accidentally set false before fetch starts
                setLoading(false);
            }, 4000);

            try {
                // Fetch members belonging to this CM's squad
                const { data, error } = await supabase
                    .from('team')
                    .select('*')
                    .eq('squad_lead_id', user.team_id);

                clearTimeout(timeoutId);
                if (error) throw error;

                // Filter to exclude other CMs and Admins (unless they are specifically part of the creative team)
                // We'll show members whose roles are related to production/creative
                const filtered = (data || [])
                    .filter(m => {
                        const role = (m.role || '').toLowerCase();
                        return !role.includes('community manager') && !role.includes('admin');
                    })
                    .map(m => {
                        // Safe extraction for names and roles
                        const fullName = m.name || 'Sin Nombre';
                        const initials = fullName
                            .split(' ')
                            .map(n => n.replace(/[^a-zA-Z0-9]/g, ''))
                            .filter(n => n.length > 0)
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || '??';

                        // Assign a color based on the role
                        const rawRole = m.role || 'Freelancer';
                        const lowerRole = rawRole.toLowerCase();
                        let color = 'bg-blue-500';
                        if (lowerRole.includes('editor')) color = 'bg-indigo-500';
                        if (lowerRole.includes('designer') || lowerRole.includes('diseñador')) color = 'bg-pink-500';
                        if (lowerRole.includes('social')) color = 'bg-purple-500';
                        if (lowerRole.includes('web') || lowerRole.includes('dev')) color = 'bg-cyan-500';
                        if (lowerRole.includes('filmmaker') || lowerRole.includes('photo')) color = 'bg-rose-500';

                        // Support both camelCase and lowercase for active tasks (Mock vs Real DB)
                        const activeTasksCount = m.activetasks ?? m.activeTasks ?? 0;

                        return {
                            id: m.id,
                            name: fullName,
                            role: rawRole,
                            status: m.status || 'Active',
                            avatar: initials,
                            color: color,
                            stats: { 
                                tasks: activeTasksCount, 
                                efficiency: '92%', 
                                load: Math.min((activeTasksCount / 10) * 100, 100)
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
    }, [user]);

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
                <button 
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                >
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
                                    <button 
                                        onClick={() => setSelectedMember({ ...member, action: 'message' })}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold"
                                    >
                                        <Mail className="w-3.5 h-3.5" /> Mensaje
                                    </button>
                                    <button 
                                        onClick={() => setSelectedMember(member)}
                                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-indigo-900/20"
                                    >
                                        Ver Perfil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <button 
                        onClick={() => setShowInviteModal(true)}
                        className="bg-[#0E0E18] border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[350px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UserPlus className="w-8 h-8 opacity-50 group-hover:opacity-100" />
                        </div>
                        <span className="font-bold text-sm">Contratar Freelancer</span>
                    </button>
                </div>
            </main>

            {/* MODALS */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMember(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0E0E18] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                                <button 
                                    onClick={() => setSelectedMember(null)}
                                    className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute -bottom-12 left-10">
                                    <div className={`w-24 h-24 rounded-3xl ${selectedMember.color} border-8 border-[#0E0E18] flex items-center justify-center text-3xl font-bold text-white shadow-xl`}>
                                        {selectedMember.avatar}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 px-10 pb-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-1">{selectedMember.name}</h2>
                                        <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">{selectedMember.role}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-6 border-b border-white/5 mb-8">
                                    {['performance', 'workload', 'contact'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'performance' && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Award className="w-4 h-4 text-yellow-500" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rating</span>
                                            </div>
                                            <div className="text-4xl font-black text-white italic">4.9<span className="text-lg text-gray-600">/5</span></div>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Zap className="w-4 h-4 text-indigo-500" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency</span>
                                            </div>
                                            <div className="text-4xl font-black text-white italic">{selectedMember.stats.efficiency}</div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'workload' && (
                                    <div className="space-y-6">
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                            <div className="flex justify-between items-end mb-4">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Tasks Distribution</span>
                                                <span className="text-2xl font-black text-white italic">{selectedMember.stats.tasks}</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${selectedMember.color}`} 
                                                    style={{ width: `${selectedMember.stats.load}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contact' && (
                                    <div className="space-y-4">
                                        <button className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-bold flex items-center justify-between group transition-all">
                                            <div className="flex items-center gap-4">
                                                <MessageSquare className="w-5 h-5" />
                                                <span>Enviar Mensaje Interno</span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                        <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold flex items-center justify-between group transition-all">
                                            <div className="flex items-center gap-4">
                                                <Shield className="w-5 h-5" />
                                                <span>Ajustes de Permisos</span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {showInviteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInviteModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="relative w-full max-w-lg bg-[#0E0E18] border border-white/10 rounded-[3rem] p-10 shadow-2xl"
                        >
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
                                    <UserPlus className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Expandir Equipo</h2>
                                <p className="text-gray-500 text-sm">Escala tu departamento creativo invitando nuevos talentos.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Nombre del Talento</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                                        placeholder="Ej: David Ruiz"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Rol / Especialidad</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                                        <option value="editor">Editor de Video</option>
                                        <option value="designer">Diseñador Gráfico</option>
                                        <option value="filmmaker">Filmmaker</option>
                                        <option value="copy">Copywriter</option>
                                    </select>
                                </div>

                                <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all mt-4">
                                    Enviar Invitación
                                </button>
                                <button 
                                    onClick={() => setShowInviteModal(false)}
                                    className="w-full py-4 text-gray-500 hover:text-white transition-colors text-sm font-bold"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
