'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { 
    CheckCircle2, Clock, AlertCircle, 
    Play, Pause, Send, Filter, 
    Search, User, Layers, Video, 
    Image as ImageIcon, MoreHorizontal
} from 'lucide-react';

export default function CreativeZonePage() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('Todos');

    useEffect(() => {
        const loadTasks = () => {
            try {
                const storedTasks = JSON.parse(localStorage.getItem('diic_creative_tasks') || '[]');
                setTasks(storedTasks);
            } catch (e) { console.error(e); }
        };
        loadTasks();
        window.addEventListener('storage', loadTasks);
        return () => window.removeEventListener('storage', loadTasks);
    }, []);

    const filteredTasks = tasks.filter(t => filter === 'Todos' || t.status === filter);

    return (
        <div className="min-h-screen bg-[#050511] text-white font-sans selection:bg-indigo-500/30">
            <Sidebar />

            <div className="pl-64 transition-all duration-300">
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

                    {/* Task Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input type="text" placeholder="Buscar tarea..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none" />
                        </div>
                    </div>

                    {/* Tasks Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTasks.length === 0 ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                                <Layers className="w-12 h-12 text-gray-700 mb-4" />
                                <p className="text-gray-500 font-bold italic">Esperando aprobación de estrategia...</p>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <CreativeTaskCard key={task.id} task={task} />
                            ))
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
}

function CreativeTaskCard({ task }) {
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
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-black">{task.type?.replace('_', ' ')}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                            {task.responsible[0]}
                        </div>
                        <span className="text-[10px] text-gray-400">{task.responsible}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-600 uppercase italic">#{task.nodeId?.slice(-4)}</span>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-2">
                    <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2">
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
