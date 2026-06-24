'use client';

import { useState, useEffect } from 'react';
import DynamicSidebar from '@/components/shared/DynamicSidebar';
import { 
    CheckCircle2, Clock, AlertCircle, 
    Play, Pause, Send, Filter, 
    Search, User, Layers, Video, 
    Image as ImageIcon, MoreHorizontal, Loader2
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import EditorWorkspace from '@/components/creative/EditorWorkspace';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function CreativeZonePage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [freelanceTasks, setFreelanceTasks] = useState([]);
    const [creativeTab, setCreativeTab] = useState('my-tasks'); // my-tasks, freelance
    const [filter, setFilter] = useState('Todos');
    const [activeWorkspaceTask, setActiveWorkspaceTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingTasks, setLoadingTasks] = useState(true);

    const loadTasks = async () => {
        if (!user) return;
        setLoadingTasks(true);
        try {
            console.log('[CreativeZone] Loading tasks from database...');
            const allTasks = await agencyService.getTasks();
            
            // 1. Get user identification fields
            const assigneeId = user.team_id || user.full_name || '';
            const email = user.email || '';
            const name = user.full_name || '';

            // 2. Filter My Tasks (assigned to this creative user)
            const myTasks = allTasks.filter(t => 
                t.assigned_to && (
                    t.assigned_to === assigneeId ||
                    t.assigned_to === name ||
                    t.assigned_to === email
                )
            );

            // 3. Filter Freelance Tasks (unassigned tasks with a budget)
            const freeTasks = allTasks.filter(t => 
                (t.status === 'disponible' || (!t.assigned_to && t.pay))
            );
            
            setTasks(myTasks);
            setFreelanceTasks(freeTasks);
        } catch (e) { 
            console.error('[CreativeZone] Error loading tasks:', e); 
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user]);

    const handleAcceptFreelanceTask = async (task) => {
        if (!user) {
            toast.error("Debes iniciar sesión para aceptar servicios.");
            return;
        }
        
        const assigneeId = user.team_id || user.full_name || user.id;
        const assigneeName = user.full_name || "Creativo";

        if (!confirm(`¿Deseas aceptar el servicio "${task.title}" con un presupuesto de ${task.pay || 'no especificado'}?`)) {
            return;
        }

        try {
            // Update task in database
            const { error: updateError } = await supabase
                .from('tasks')
                .update({
                    assigned_to: assigneeId,
                    status: 'Pendiente' // Move to pending queue for the creative
                })
                .eq('id', task.id);

            if (updateError) throw updateError;

            // Create admin notifications
            try {
                const { data: admins } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('role', 'ADMIN');

                if (admins && admins.length > 0) {
                    const notifs = admins.map(admin => ({
                        user_id: admin.id,
                        title: 'Servicio Freelance Aceptado',
                        message: `El creativo "${assigneeName}" (${user.role || 'Creativo'}) ha aceptado el servicio freelance "${task.title}" por un presupuesto de ${task.pay || '$0'}.`,
                        type: 'FREELANCE_ACCEPTED',
                        status: 'unread',
                        link: '/dashboard/hq/control',
                        metadata: {
                            task_id: task.id,
                            task_title: task.title,
                            creative_name: assigneeName,
                            pay: task.pay
                        }
                    }));
                    await supabase.from('notifications').insert(notifs);
                }
            } catch (notifErr) {
                console.error('Error creating admin notification for freelance accept:', notifErr);
            }

            toast.success("¡Servicio aceptado con éxito! Se ha añadido a tus proyectos.");
            loadTasks();
        } catch (err) {
            console.error('Error accepting freelance task:', err);
            toast.error("Error al aceptar el servicio freelance.");
        }
    };

    const filteredTasks = tasks.filter(t => 
        (filter === 'Todos' || t.status === filter) &&
        (t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.client?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredFreelanceTasks = freelanceTasks.filter(t => 
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.assigned_role && t.assigned_role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen bg-[#050511] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <DynamicSidebar />

            <div className="flex-1 transition-all duration-300 min-w-0">
                <main className="p-8 max-w-[1600px] mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Zona Creativa</h1>
                            <p className="text-gray-400 mt-1">Ejecución de tareas y producción de contenido</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050511] bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                                        U{i}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-2">Equipo Activo</span>
                        </div>
                    </div>

                    {/* High-level Tab Switcher */}
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 w-fit">
                        <button
                            onClick={() => { setCreativeTab('my-tasks'); setSearchQuery(''); }}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${creativeTab === 'my-tasks' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            Mis Proyectos (Squad)
                        </button>
                        <button
                            onClick={() => { setCreativeTab('freelance'); setSearchQuery(''); }}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${creativeTab === 'freelance' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Área Libre (Freelance / Gigs)
                        </button>
                    </div>

                    {/* Task Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {creativeTab === 'my-tasks' ? (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {['Todos', 'Pendiente', 'En Proceso', 'Revisión', 'Aprobado'].map(f => (
                                    <button 
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Servicios Abiertos (Uber-Style)
                            </div>
                        )}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Buscar servicio..." 
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none" 
                            />
                        </div>
                    </div>

                    {/* Tasks Matrix */}
                    {loadingTasks ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Sincronizando Tablero...</p>
                        </div>
                    ) : creativeTab === 'my-tasks' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredTasks.length === 0 ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                                    <Layers className="w-12 h-12 text-gray-700 mb-4" />
                                    <p className="text-gray-500 font-bold italic">No tienes proyectos activos asignados en tu squad.</p>
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <CreativeTaskCard 
                                        key={task.id} 
                                        task={task} 
                                        onOpenWorkspace={() => setActiveWorkspaceTask(task)} 
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredFreelanceTasks.length === 0 ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                                    <Layers className="w-12 h-12 text-gray-700 mb-4" />
                                    <p className="text-gray-500 font-bold italic">No hay servicios freelance disponibles en este momento.</p>
                                </div>
                            ) : (
                                filteredFreelanceTasks.map(task => (
                                    <FreelanceTaskCard 
                                        key={task.id} 
                                        task={task} 
                                        onAccept={handleAcceptFreelanceTask} 
                                    />
                                ))
                            )}
                        </div>
                    )}

                </main>
            </div>

            {/* Editor Workspace Modal */}
            <AnimatePresence>
                {activeWorkspaceTask && (
                    <EditorWorkspace 
                        task={activeWorkspaceTask} 
                        onClose={() => setActiveWorkspaceTask(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function CreativeTaskCard({ task, onOpenWorkspace }) {
    const isVideo = task.type?.includes('video') || task.type?.includes('reel');
    
    return (
        <div className="bg-[#0A0A15] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{task.client}</span>
                <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'Alta' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    {isVideo ? <Video className="w-6 h-6 text-gray-400" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">{task.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-black">{task.type?.replace('_', ' ') || 'General'}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                            {(task.assigned_to || 'S')?.[0]}
                        </div>
                        <span className="text-[10px] text-gray-400">{task.assigned_to || 'Sin asignar'}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-600 uppercase italic">#{String(task.id).slice(-4)}</span>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-2">
                    <button 
                        onClick={onOpenWorkspace}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Play className="w-3 h-3" /> Iniciar
                    </button>
                    <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function FreelanceTaskCard({ task, onAccept }) {
    const isVideo = task.type?.includes('video') || task.type?.includes('reel') || task.title?.toLowerCase().includes('reel') || task.title?.toLowerCase().includes('video');
    
    return (
        <div className="bg-[#0A0A15] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[260px]">
            {/* Glowing Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-20 group-hover:opacity-100 transition-opacity" />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                        {task.assigned_role || 'Freelance'}
                    </span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        {task.pay || '$50 USD'}
                    </span>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        {isVideo ? <Video className="w-6 h-6 text-gray-400" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">{task.title}</h3>
                        <p className="text-[9px] text-gray-500 mt-1 uppercase font-black tracking-wider">Cliente: {task.client}</p>
                    </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-3 mb-6 bg-white/[0.01] p-3 rounded-lg border border-white/5">
                    {task.objective || 'Sin descripción detallada.'}
                </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Formato: <strong className="text-white">{task.format || 'Varios'}</strong></span>
                    <span>Plazo: <strong className="text-white">{task.deadline || 'flexible'}</strong></span>
                </div>
                
                <button 
                    onClick={() => onAccept(task)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
                >
                    Aceptar Servicio
                </button>
            </div>
        </div>
    );
}
