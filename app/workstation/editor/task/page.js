'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FileVideo, ArrowRight, Filter, Search, 
    Calendar, ChevronLeft, Loader2, Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function TasksListPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch tasks assigned to this user OR general EDITOR role
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .or(`assigned_to.eq.${user.full_name},assigned_role.eq.EDITOR`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            toast.error('Error al sincronizar listado de tareas.');
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.client?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col px-12 py-10 space-y-10 overflow-y-auto bg-[#050511]">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-600 mb-2 group cursor-pointer" onClick={() => router.push('/workstation/editor')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">Volver a Bandeja</span>
                    </div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Archivo de Proyectos</h1>
                    <p className="text-gray-500 font-medium">Control histórico y operativo de asignaciones.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar en el histórico..." 
                            className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 w-72 transition-all font-medium placeholder:text-gray-700"
                        />
                    </div>
                    <button 
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin opacity-50" />
                    <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Consultando Archivo...</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 bg-[#0E0E18] rounded-[3rem] border border-dashed border-white/5">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-800">
                        <Inbox className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-500 uppercase italic">Sin Resultados</h3>
                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">No se encontraron tareas registradas</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 pb-12">
                    {filteredTasks.map((task, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={task.id}
                            onClick={() => router.push(`/workstation/editor/task/${task.id}`)}
                            className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all cursor-pointer group flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl bg-white/5 text-gray-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner`}>
                                    <FileVideo className="w-6 h-6" />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight truncate italic">{task.title}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-[10px] text-gray-600 flex items-center gap-2 font-black uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" /> {task.deadline || 'Bajo Demanda'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="px-5 py-2.5 rounded-2xl bg-black/40 border border-white/5 text-[10px] font-black uppercase text-gray-600 tracking-wider">
                                    {task.client || 'Marca Sin Nombre'}
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                                    task.status === 'in_progress' || task.status === 'active' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                    task.status === 'review' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    task.status === 'completed' || task.status === 'final' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    'bg-white/5 border-white/10 text-gray-600'
                                }`}>
                                    {task.status || 'Pending'}
                                </div>
                                <button className="p-3 bg-white/5 text-gray-700 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all shadow-lg active:scale-95">
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
