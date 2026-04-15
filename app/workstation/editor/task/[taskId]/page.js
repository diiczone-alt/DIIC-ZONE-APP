'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Download, FileVideo, Music, MessageSquare,
    UploadCloud, CheckCircle, ChevronLeft, Flag, Play, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BlockerModal from '@/components/workstation/editor/BlockerModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskDetailPage({ params }) {
    const { taskId } = use(params);
    const router = useRouter();
    const [isBlockerModalOpen, setIsBlockerModalOpen] = useState(false);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    const fetchTask = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .single();

            if (error) throw error;
            setTask(data);
        } catch (err) {
            console.error('Error fetching task details:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511]">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin opacity-20" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#050511] text-gray-500 space-y-4">
                <Flag className="w-12 h-12 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Tarea no encontrada</p>
                <button onClick={() => router.back()} className="text-purple-400 text-xs font-bold hover:underline">Volver a la lista</button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-20 border-b border-white/5 bg-[#050511]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/5 border border-white/5 rounded-xl transition-all active:scale-90">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-0.5">
                            <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">{task.title}</h1>
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                task.status === 'in-progress' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                'bg-white/5 border-white/10 text-gray-500'
                            }`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
                             <span className="text-purple-500">PROT_ID:</span> {task.id} | <span className="text-emerald-500">CLIENT:</span> {task.client}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsBlockerModalOpen(true)}
                        className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white border border-white/5 hover:border-white/10 rounded-xl transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Flag className="w-4 h-4" /> Reportar Bloqueo
                    </button>
                    <button
                        onClick={() => router.push(`/workstation/editor/deliver/${task.id}`)}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-purple-600/10 flex items-center gap-3 active:scale-95"
                    >
                        <UploadCloud className="w-4 h-4" /> Subir Entrega
                    </button>
                </div>
            </header>

            {/* 3-Column Layout */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">

                {/* Column A: Guide (Left) - 3 cols */}
                <aside className="col-span-3 border-r border-white/5 bg-[#080812] p-8 overflow-y-auto custom-scrollbar shadow-inner">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Protocolo de Producción
                    </h3>

                    <div className="space-y-8">
                        <Section title="Objetivo Estratégico" content={task.objective || 'Sin objetivo definido.'} />
                        <Section title="Especificaciones Técnicas" content={`${task.format || 'F_DEF'} • ${task.duration || '0:00'}`} />
                        <Section title="Estructura de Narrativa" content={task.structure || 'Seguir guía estándar de marca.'} />

                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 shadow-xl">
                            <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5" /> Brief del CM
                            </h4>
                            <p className="text-amber-200/60 text-xs leading-relaxed italic">{task.notes || 'No hay notas adicionales del CM.'}</p>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <label className="flex items-start gap-4 cursor-pointer group p-4 bg-white/5 rounded-2xl border border-transparent hover:border-purple-500/30 transition-all">
                                <div className="mt-0.5 w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center group-hover:border-purple-500 transition-all shadow-inner">
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-sm opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-purple-500/50" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Protocolo Validado</p>
                                    <p className="text-[9px] text-gray-600 mt-1 uppercase">Entiendo las guías y estoy listo para ejecutar.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Column B: Player & Versions (Center) - 6 cols */}
                <main className="col-span-6 bg-[#050511] flex flex-col relative">
                    {/* Player Area */}
                    <div className="flex-1 flex items-center justify-center bg-black relative shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-1" />
                        
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <motion.div 
                                whileHover={{ scale: 1.1 }}
                                whileActive={{ scale: 0.9 }}
                                className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all shadow-2xl"
                            >
                                <Play className="w-10 h-10 text-white fill-white ml-1.5" />
                            </motion.div>
                        </div>

                        <img
                            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000"
                            className="h-full w-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
                            alt="Preview"
                        />

                        {/* Timeline HUD */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-white/10 rounded-full overflow-hidden z-20">
                            <div className="h-full w-1/3 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                        </div>
                    </div>

                    {/* Feedback System */}
                    <div className="h-72 border-t border-white/5 bg-[#0A0A12] overflow-hidden flex flex-col shadow-inner">
                        <div className="h-14 border-b border-white/5 flex items-center px-8 justify-between bg-[#050511]/40">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Registro de Ajustes (V1_DRAFT)</span>
                            <button className="text-[10px] text-purple-400 hover:text-white font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5" /> Resolver Todo
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <Comment user="Leslie (CM)" time="00:03" text="El gancho es un poco lento, adelanta el primer corte a 2ms." />
                            <Comment user="Leslie (CM)" time="00:12" text="La música en esta parte opaca el testimonio." />
                            <Comment user="Editor_Core" time="00:15" text="Recibido. Ajustando niveles en V2." self />
                        </div>
                        <div className="p-4 bg-[#050511]/40 border-t border-white/5">
                            <input
                                type="text"
                                placeholder="Escribe un feedback técnico..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium placeholder:text-gray-700"
                            />
                        </div>
                    </div>
                </main>

                {/* Column C: Assets (Right) - 3 cols */}
                <aside className="col-span-3 border-l border-white/5 bg-[#080812] p-8 overflow-y-auto custom-scrollbar shadow-inner">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <Download className="w-4 h-4 text-purple-500" /> Bóveda de Archivos
                    </h3>

                    <div className="space-y-3 mb-10">
                        {task.assets && Array.isArray(task.assets) ? task.assets.map((asset, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 hover:bg-purple-500/5 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors shadow-inner">
                                    {asset.type === 'video' ? <FileVideo className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[11px] font-black text-gray-300 truncate group-hover:text-white transition-colors">{asset.name}</p>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mt-0.5">{asset.size}</p>
                                </div>
                            </div>
                        )) : (
                           <p className="text-[10px] text-gray-600 italic">No hay archivos vinculados.</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button className="w-full py-4 bg-white/5 hover:bg-white text-gray-500 hover:text-black border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group">
                            <Download className="w-4 h-4 group-hover:animate-bounce" /> Abrir Carpeta Drive
                        </button>
                        <button className="w-full py-3 text-[9px] font-black text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-all">
                            Solicitar Archivo Faltante
                        </button>
                    </div>

                </aside>

            </div>

            <BlockerModal
                isOpen={isBlockerModalOpen}
                onClose={() => setIsBlockerModalOpen(false)}
                onSubmit={(data) => console.log('Bloqueo reportado:', data)}
            />
        </div>
    );
}

function Section({ title, content }) {
    return (
        <div className="space-y-3">
            <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h4>
            <p className="text-gray-300 text-sm leading-relaxed font-medium">{content}</p>
        </div>
    );
}

function Comment({ user, time, text, self }) {
    return (
        <div className={`flex gap-4 ${self ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-[10px] font-black text-white shadow-xl ${self ? 'bg-purple-600' : 'bg-[#151525] border border-white/10'}`}>
                {user.charAt(0)}
            </div>
            <div className={`p-4 rounded-3xl max-w-[85%] relative ${self ? 'bg-purple-600/10 text-purple-100 border border-purple-500/20 rounded-tr-none' : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'}`}>
                <div className={`flex items-center gap-3 mb-2 font-black text-[9px] ${self ? 'flex-row-reverse' : ''}`}>
                    <span className="opacity-80 uppercase tracking-widest">{user}</span>
                    <span className="opacity-30 font-mono bg-black/40 px-1.5 py-0.5 rounded uppercase">{time}</span>
                </div>
                <p className="text-sm leading-relaxed font-medium">{text}</p>
            </div>
        </div>
    );
}
