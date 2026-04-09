'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    Video, Camera, Image, Music, 
    Users, Globe, Box, Layout, 
    ArrowLeft, Clock, CheckCircle2, 
    AlertCircle, Play, Settings, MessageSquare
} from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { agencyService } from '@/services/agencyService';

const ROLE_DATA = {
    editor: { name: 'Editor', icon: Video, color: 'text-indigo-400' },
    filmmaker: { name: 'Filmmaker', icon: Camera, color: 'text-rose-400' },
    design: { name: 'Diseño', icon: Image, color: 'text-fuchsia-400' },
    community: { name: 'Community Manager', icon: MessageSquare, color: 'text-blue-400' },
    audio: { name: 'Audio', icon: Music, color: 'text-indigo-500' },
    photo: { name: 'Fotografía', icon: Camera, color: 'text-purple-400' },
    dev: { name: 'Desarrollo Web', icon: Globe, color: 'text-cyan-400' },
};

export default function WorkstationPage() {
    const params = useParams();
    const roleId = params.role;
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState([]);
    const [currentMember, setCurrentMember] = useState(null);

    const roleConfig = ROLE_DATA[roleId] || { name: roleId, icon: Layout, color: 'text-gray-400' };

    useEffect(() => {
        const init = async () => {
            const teamData = await agencyService.getTeam();
            const roleTeam = teamData.filter(m => m.role.toLowerCase().includes(roleId.toLowerCase()));
            setTeam(roleTeam);
            
            // Auto-select first member for simulation
            if (roleTeam.length > 0 && !currentMember) {
                setCurrentMember(roleTeam[0]);
            }

            const taskData = await agencyService.getTasks(roleConfig.name);
            setTasks(taskData);
            setLoading(false);
        };
        init();
    }, [roleId, currentMember]);

    // Filter tasks for the current member
    const filteredTasks = currentMember 
        ? tasks.filter(t => t.assigned_to_id === currentMember.id)
        : tasks;

    const role = { ...roleConfig, tasks };

    return (
        <div className="min-h-screen bg-[#050511] text-white p-8 md:p-12 font-sans">
            
            {/* Nav */}
            <div className="flex items-center justify-between mb-12">
                <Link href="/hub" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Volver al Hub</span>
                </Link>
                <div className="flex items-center gap-6">
                    {team.length > 1 && (
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                            {team.map(m => (
                                <button 
                                    key={m.id}
                                    onClick={() => setCurrentMember(m)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        currentMember?.id === m.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                            {currentMember ? `Sesión: ${currentMember.name}` : 'Workstation'}
                        </p>
                        <p className="text-sm font-black text-white">{role.name}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <role.icon className={`w-5 h-5 ${role.color}`} />
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-2 lowercase tracking-tighter">panel operativo <span className={role.color}>/ {roleId}</span></h1>
                <p className="text-gray-500 font-medium">Gestión de tareas y entregas específicas.</p>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard label="Pendientes" value={role.tasks.filter(t => t.status === 'Pendiente').length} icon={Clock} color="text-amber-500" />
                <StatCard label="En Proceso" value={role.tasks.filter(t => t.status === 'En proceso').length} icon={Play} color="text-indigo-400" />
                <StatCard label="En Revisión" value={role.tasks.filter(t => t.status === 'En revisión').length} icon={AlertCircle} color="text-fuchsia-400" />
                <StatCard label="Aprobadas" value={role.tasks.filter(t => t.status === 'Aprobado').length} icon={CheckCircle2} color="text-emerald-500" />
            </div>

            {/* Task List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Pipeline Personal</h3>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{filteredTasks.length} Tareas</span>
                </div>
                {filteredTasks.length === 0 ? (
                    <div className="py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600">
                        <AlertCircle className="w-10 h-10 mb-4 opacity-20" />
                        <p className="font-medium">No hay tareas asignadas aún.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div key={task.id} className="bg-[#0A0A1F] border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                    <role.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">{task.title}</h4>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            task.status === 'En proceso' ? 'text-indigo-400' : 
                                            task.status === 'En revisión' ? 'text-fuchsia-400' :
                                            task.status === 'Aprobado' ? 'text-emerald-500' :
                                            'text-amber-500'
                                        }`}>{task.status}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-800" />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${task.priority === 'Alta' ? 'text-rose-500' : 'text-gray-600'}`}>{task.priority}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {task.delivery_link && (
                                    <a 
                                        href={task.delivery_link} 
                                        target="_blank" 
                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                                    >
                                        Ver Entrega
                                    </a>
                                )}
                                {task.status === 'Pendiente' && (
                                    <button 
                                        onClick={async () => {
                                            await agencyService.updateTask(task.id, { status: 'En proceso' });
                                            window.location.reload();
                                        }}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        Empezar
                                    </button>
                                )}
                                {task.status === 'En proceso' && (
                                    <button 
                                        onClick={async () => {
                                            const link = prompt("Ingresa el link del entregable (Drive, Frame.io, etc.):");
                                            if (link) {
                                                await agencyService.updateTask(task.id, { 
                                                    status: 'En revisión',
                                                    delivery_link: link 
                                                });
                                                window.location.reload();
                                            }
                                        }}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20"
                                    >
                                        Entregar
                                    </button>
                                )}
                                {task.status === 'En revisión' && (
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic px-4">
                                        Esperando Aprobación...
                                    </span>
                                )}
                                {task.status === 'Aprobado' && (
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Listo</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Setup Hub Footer */}
            <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-gray-600">
                <p className="text-[10px] font-black uppercase tracking-widest">DIIC ZONE OS v2.0</p>
                <div className="flex gap-4">
                    <Settings className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                </div>
            </div>

        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }) {
    return (
        <div className="bg-[#0A0A1F] border border-white/5 p-8 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
            <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-white">{value}</p>
            </div>
            <Icon className={`w-10 h-10 ${color} opacity-20 group-hover:opacity-40 transition-opacity`} />
        </div>
    );
}
