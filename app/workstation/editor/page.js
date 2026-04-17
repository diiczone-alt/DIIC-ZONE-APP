'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Clock, AlertTriangle, CheckCircle2, MoreVertical,
    ArrowRight, FileVideo, Zap, Calendar, Inbox, DollarSign,
    Layers, Download, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function EditorDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                // Fetch tasks assigned to this specific user OR to the general EDITOR role
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .or(`assigned_to.eq.${user.full_name},assigned_role.eq.EDITOR`)
                    .neq('status', 'delivered')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTasks(data || []);
            } catch (err) {
                console.error('[EditorOS] Error fetching tasks:', err);
                toast.error('Error al sincronizar proyectos.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#050511] text-indigo-500">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando Nodo de Edición</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#050511]">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Panel de Edición</h1>
                    <p className="text-sm text-gray-400">Control maestro de cortes y entregas.</p>
                </div>
                <div className="flex gap-3">
                    {/* Financial data hidden as requested */}
                    <div className="bg-[#0E0E18]/50 px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-end min-w-[140px]">
                        <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Status Nodo</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-black text-white leading-none">ACTIVO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileVideo className="w-5 h-5 text-purple-400" /> Proyectos Activos
                    </h2>
                    <button 
                        onClick={() => router.push('/workstation/editor/task')}
                        className="text-xs font-bold text-purple-400 hover:text-white transition-colors flex items-center gap-1 group uppercase tracking-widest"
                    >
                        Ver todos <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {tasks.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-[#0E0E18] rounded-[2.5rem] border border-dashed border-white/10 space-y-6">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-700">
                            <Inbox className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white italic uppercase">Bandeja Despejada</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto uppercase tracking-tighter font-mono">
                                No tienes proyectos asignados en este momento. Espera a que el CM active un nuevo protocolo.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {tasks.map((task) => (
                            <EditorTaskCard 
                                key={task.id} 
                                task={task} 
                                onClick={() => router.push(`/workstation/editor/task/${task.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Notifications Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 pb-12">
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xs font-black text-white/50 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <Inbox className="w-4 h-4" /> Material Recibido
                    </h3>
                    <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl">
                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest leading-relaxed">
                            No hay archivos <br /> pendientes de descarga
                        </p>
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xs font-black text-white/50 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <AlertTriangle className="w-4 h-4 text-amber-500/50" /> Correcciones Recientes
                    </h3>
                    <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl">
                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest leading-relaxed">
                            Sin revisiones <br /> pendientes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditorTaskCard({ task, onClick }) {
    // Phase Logic simplified for real data
    const getPhaseStyle = (status) => {
        const s = status?.toLowerCase() || 'pending';
        if (s === 'in_progress' || s === 'active') return { label: 'En Edición', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', phase: 1 };
        if (s === 'review') return { label: 'Revisión Cliente', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', phase: 3 };
        if (s === 'ready' || s === 'final') return { label: 'Versión Final', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', phase: 4 };
        return { label: 'Pendiente', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', phase: 0 };
    }

    const style = getPhaseStyle(task.status);

    return (
        <div 
            onClick={onClick}
            className="bg-[#13131F] border border-white/5 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-purple-500/[0.02] transition-all group flex items-center justify-between cursor-pointer"
        >
            <div className="flex items-center gap-6">
                {/* Phase Indicator */}
                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0 font-black text-lg transition-all ${style.bg} ${style.border} ${style.color} group-hover:scale-110 shadow-lg`}>
                    {style.phase || '?'}
                </div>

                <div>
                    <h3 className="text-lg font-black text-white leading-tight group-hover:text-purple-400 transition-colors uppercase tracking-tight italic">{task.title}</h3>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">{task.client || 'Marca Sin Nombre'}</p>
                </div>
            </div>

            <div className="flex items-center gap-8 text-right">
                <div className="hidden md:block">
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Deadline</p>
                    <p className="text-xs font-bold text-white/80">{task.deadline || 'Bajo demanda'}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${style.bg} ${style.color} ${style.border}`}>
                    {style.label}
                </div>
                <button className="p-3 bg-white/5 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-gray-600 transition-all">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
