'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FileVideo, ArrowRight, Filter, Search, 
    Calendar, DollarSign, ChevronLeft, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function TasksListPage() {
    const router = useRouter();
    const [toast, setToast] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            // Filtrar por assigned_role = 'editor'
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('assigned_role', 'editor')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            showToast('Error al conectar con el servidor de tareas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col px-12 py-10 space-y-10 overflow-y-auto bg-[#050511]">
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-8 right-8 z-[200] px-6 py-3 bg-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-2 group cursor-pointer" onClick={() => router.push('/workstation/editor')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">Volver a Bandeja</span>
                    </div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Mis Tareas</h1>
                    <p className="text-gray-500 font-medium">Listado completo de proyectos asignados y sus estados.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar proyecto..." 
                            className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 w-72 transition-all font-medium"
                        />
                    </div>
                    <button 
                        onClick={() => showToast('Abriendo filtros avanzados...')}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin opacity-50" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                    <FileVideo className="w-16 h-16" />
                    <p className="text-sm font-bold uppercase tracking-widest text-white">Sin tareas pendientes</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 pb-12">
                    {tasks.map((task, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={task.id}
                            onClick={() => router.push(`/workstation/editor/task/${task.id}`)}
                            className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 hover:bg-white/[0.02] transition-all cursor-pointer group flex items-center justify-between shadow-xl"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl bg-white/5 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner`}>
                                    <FileVideo className="w-6 h-6" />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight truncate">{task.title}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-3 h-3" /> {task.deadline || 'Pendiente'}
                                        </span>
                                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                                            <DollarSign className="w-3 h-3" /> {task.pay || '$0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                                    {task.client}
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                    task.status === 'in-progress' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                    task.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    'bg-white/5 border-white/10 text-gray-500'
                                }`}>
                                    {task.status}
                                </div>
                                <button className="p-2 text-gray-600 group-hover:text-white transition-colors">
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
