'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CheckSquare, Clock, AlertCircle, Play, CheckCircle2,
    Search, Filter, ArrowRight, Layers, Tag, User, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function DesignerTasksPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            try {
                setLoading(true);
                // Fetch tasks assigned to this specific user OR to the DESIGNER / Diseño role
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .or(`assigned_to.eq.${user.full_name},assigned_role.eq.Diseño,assigned_role.eq.DESIGNER,assigned_role.eq.DESIGN`)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTasks(data || []);
            } catch (err) {
                console.error('[DesignerOS] Error fetching tasks:', err);
                // Fallback to rich mock data if query fails or table doesn't exist yet
                setTasks([
                    { id: '1', title: 'Diseño Carrusel Educativo - Blanqueamiento', client: 'Clínica Dental', priority: 'high', deadline: 'Hoy, 18:00', status: 'pending', desc: '5 slides con información clave sobre el tratamiento dental.', comments_count: 2 },
                    { id: '2', title: 'Banner Promocional - Cyber Monday', client: 'Ecom Store', priority: 'high', deadline: 'Mañana, 09:00', status: 'in_progress', desc: 'Banner web hero en alta definición (1920x600 px).', comments_count: 4 },
                    { id: '3', title: 'Retoque Fotográfico de Productos', client: 'EcoStore', priority: 'medium', deadline: 'En 3 días', status: 'review', desc: 'Edición y corrección de color para 15 productos nuevos.', comments_count: 1 },
                    { id: '4', title: 'Diseño Flyer - Evento Anual', client: 'Tech Solutions', priority: 'low', deadline: '25 Jun', status: 'ready', desc: 'Diseño en formato A4 listo para imprenta.', comments_count: 0 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.client?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'all' || task.priority?.toLowerCase() === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase() || 'pending';
        switch (s) {
            case 'in_progress':
            case 'in-progress':
                return { label: 'En Diseño', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' };
            case 'review':
                return { label: 'Bajo Revisión', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
            case 'ready':
            case 'approved':
            case 'completed':
                return { label: 'Aprobado', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
            default:
                return { label: 'Pendiente', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-white/5' };
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050511] p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <CheckSquare className="w-6 h-6 text-pink-500" /> Tareas Asignadas
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Revisa y gestiona las solicitudes de diseño gráfico activas.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar tarea..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#0E0E18] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-pink-500 w-64 transition-colors"
                        />
                    </div>

                    <div className="flex items-center bg-[#0E0E18] rounded-xl border border-white/10 px-3 py-2 gap-2">
                        <Filter className="w-3.5 h-3.5 text-gray-500" />
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="bg-transparent text-xs text-gray-400 font-bold uppercase tracking-wider outline-none cursor-pointer"
                        >
                            <option value="all" className="bg-[#0E0E18]">Todas</option>
                            <option value="high" className="bg-[#0E0E18]">Alta</option>
                            <option value="medium" className="bg-[#0E0E18]">Media</option>
                            <option value="low" className="bg-[#0E0E18]">Baja</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center py-20 text-pink-500">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-3" />
                    <span className="text-xs font-black uppercase tracking-widest">Sincronizando tareas...</span>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center bg-[#0E0E18] rounded-[2.5rem] border border-dashed border-white/10 space-y-6">
                    <CheckSquare className="w-12 h-12 text-gray-700" />
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-black text-white italic uppercase">Sin tareas pendientes</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto tracking-wide uppercase text-xs">
                            No tienes tareas que coincidan con los filtros aplicados.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 pb-20">
                    {filteredTasks.map((task) => {
                        const style = getStatusStyle(task.status);
                        return (
                            <div
                                key={task.id}
                                onClick={() => router.push(`/workstation/designer/project/${task.nodeId || task.id}`)}
                                className="bg-[#13131F] border border-white/5 rounded-2xl p-6 hover:border-pink-500/50 hover:bg-pink-500/[0.01] transition-all group flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all border ${style.bg} ${style.border} ${style.color} group-hover:scale-105 shrink-0`}>
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight italic">{task.title}</h3>
                                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3 text-pink-500" /> {task.client || 'Cliente'}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Tag className={`w-3 h-3 ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                                                Prioridad {task.priority}
                                            </span>
                                            {task.comments_count > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-pink-400"><MessageSquare className="w-3 h-3" /> {task.comments_count} Feedback</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-left md:text-right">
                                        <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-0.5">Deadline</p>
                                        <p className="text-xs font-bold text-white/80">{task.deadline || 'Bajo demanda'}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${style.bg} ${style.color} ${style.border}`}>
                                            {style.label}
                                        </span>
                                        <button className="p-3 bg-white/5 group-hover:bg-pink-600 group-hover:text-white rounded-xl text-gray-600 transition-all">
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
