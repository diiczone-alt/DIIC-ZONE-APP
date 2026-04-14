'use client';

import { useState, useEffect } from 'react';
import {
    Clock, Scissors, CheckCircle2, PlayCircle,
    MoreHorizontal, FileVideo, LayoutGrid, List, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function ActiveEdits({ onNewProject }) {
    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');
    const [edits, setEdits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEdits = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('assigned_role', 'editor')
                    .order('created_at', { ascending: false });

                if (data) {
                    setEdits(data.map(t => ({
                        id: t.id,
                        title: t.title,
                        type: t.client || 'Proyecto Interno',
                        status: t.status || 'queue',
                        version: t.priority === 'high' ? 'PRIORIDAD ALTA' : 'Estándar',
                        date: new Date(t.created_at).toLocaleDateString(),
                        progress: t.status === 'completed' ? 100 : t.status === 'in-progress' ? 65 : 10
                    })));
                }
            } catch (err) {
                console.error('Error fetching edits:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEdits();
    }, []);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'queue': return { label: 'En Cola', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: Clock };
            case 'editing': 
            case 'in-progress': return { label: 'En Edición', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Scissors };
            case 'review': return { label: 'Control Calidad', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertCircle };
            case 'ready': 
            case 'completed': return { label: 'Listo/Entregado', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 };
            default: return { label: 'Pendiente', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: Clock };
        }
    };

    const StatusTab = ({ id, label, count, active }) => (
        <button
            onClick={() => setFilter(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-purple-500 text-white border-purple-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
        >
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-500'}`}>{count}</span>
        </button>
    );

    const filteredEdits = filter === 'all' ? edits : edits.filter(e => e.status === filter);

    if (loading) {
        return <div className="p-20 text-center text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando Proyectos...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 xl:pb-0 hide-scrollbar">
                    <StatusTab id="all" label="Todos" count={edits.length} active={filter === 'all'} />
                    <StatusTab id="queue" label="En Cola" count={edits.filter(e => e.status === 'queue').length} active={filter === 'queue'} />
                    <StatusTab id="editing" label="En Sala" count={edits.filter(e => e.status === 'editing' || e.status === 'in-progress').length} active={filter === 'editing'} />
                    <StatusTab id="ready" label="Listos" count={edits.filter(e => e.status === 'ready' || e.status === 'completed').length} active={filter === 'ready'} />
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><LayoutGrid className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><List className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {filteredEdits.length === 0 ? (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                        <FileVideo className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Sin proyectos en esta área</h3>
                    <p className="text-sm text-gray-500 font-bold max-w-xs uppercase tracking-widest leading-loose">
                        No hay tareas de edición asignadas en este momento.
                    </p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredEdits.map((project) => {
                        const status = getStatusConfig(project.status);
                        const StatusIcon = status.icon;
                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={project.id}
                                className="group bg-[#0B0B15] border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 transition-all hover:bg-white/5 relative overflow-hidden flex flex-col h-[280px]"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.bg} ${status.color}`}>
                                        <StatusIcon className="w-5 h-5" />
                                    </div>
                                    <button className="text-gray-500 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg leading-tight mb-1">{project.title}</h3>
                                    <p className="text-sm text-gray-500">{project.type}</p>
                                </div>

                                <div className="bg-black/30 rounded-xl p-3 border border-white/5 mb-4 space-y-2">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Estado Operativo</span>
                                        <span className="text-white font-mono">{project.version}</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div className={`h-full ${status.bg.replace('/10', '')}`} style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
                                    <span className="text-gray-500">{project.date}</span>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${status.color} bg-black/30`}>{status.label}</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filteredEdits.map((project) => (
                        <div key={project.id} className="bg-[#0B0B15] border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                            <div className="p-2 bg-white/5 rounded-lg text-gray-400"><FileVideo className="w-5 h-5" /></div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold">{project.title}</h4>
                                <p className="text-xs text-gray-500">{project.type} • {project.version}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusConfig(project.status).bg} ${getStatusConfig(project.status).color}`}>
                                    {getStatusConfig(project.status).label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
