'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, FileText, Download, UploadCloud,
    Clock, CheckCircle2, Play, Music, Layout,
    MessageSquare, AlertCircle, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function EditorDashboard({ user }) {
    const [selectedTask, setSelectedTask] = useState(null);

    // Mock Assignments for Editor
    const tasks = [
        {
            id: 101,
            title: 'Campaña Dental - Reel Viral',
            client: 'Clínica Santa Ana',
            deadline: 'Hoy 18:00',
            status: 'PENDING',
            guide: {
                format: '9:16',
                style: 'DINÁMICO',
                hook: '¿Sabías que el 80% de tus anuncios fallan por esto?',
                music: 'Trendy Tech / Upbeat',
                notes: 'Usar los cortes rápidos del B-Roll de la entrada.'
            },
            assets: {
                main: 12,
                broll: 45,
                drone: 5
            }
        },
        {
            id: 102,
            title: 'Testimonio Dr. Pérez',
            client: 'Personal Brand',
            deadline: 'Mañana',
            status: 'IN_PROGRESS',
            guide: {
                format: '16:9',
                style: 'CORPORATE',
                hook: 'La verdad sobre los implantes.',
                music: 'Soft Piano',
                notes: 'Limpiar el audio de fondo.'
            },
            assets: {
                main: 4,
                broll: 10,
                drone: 0
            }
        },
    ];

    const handleUpload = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Subiendo versión V1...',
            success: 'Versión enviada a revisión (QC)',
            error: 'Error al subir versión'
        });
        setTimeout(() => setSelectedTask(null), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: Task List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-400" /> Cola de Edición
                    </h2>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 font-bold">
                        {tasks.length} Activos
                    </span>
                </div>

                <div className="space-y-4">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group relaitve overflow-hidden ${selectedTask?.id === task.id
                                    ? 'bg-purple-600/10 border-purple-500'
                                    : 'bg-[#0E0E18] border-white/10 hover:border-purple-500/50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${task.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {task.status}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {task.deadline}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.client}</p>

                            {selectedTask?.id === task.id && (
                                <motion.div layoutId="active-indicator" className="w-1 h-full absolute left-0 top-0 bg-purple-500" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Workspace (Detail) */}
            <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                    {selectedTask ? (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-[#0A0A12] border border-white/10 rounded-3xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-1">{selectedTask.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Layout className="w-4 h-4 text-gray-500" /> {selectedTask.guide.format}</span>
                                        <span className="flex items-center gap-1"><Music className="w-4 h-4 text-gray-500" /> {selectedTask.guide.music}</span>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white border border-white/10 transition-colors flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Bajar Material Raw
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* The Guide */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-400" /> Guía del Community Manager
                                    </h3>

                                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-5 space-y-4">
                                        <div>
                                            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Gancho (0-3s)</div>
                                            <p className="text-white text-sm font-medium">"{selectedTask.guide.hook}"</p>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Notas de Edición</div>
                                            <p className="text-gray-300 text-sm italic">"{selectedTask.guide.notes}"</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-blue-500/20 rounded text-[10px] text-blue-300 border border-blue-500/30">{selectedTask.guide.style}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="p-3 bg-white/5 rounded-xl text-center border border-white/5">
                                            <div className="text-lg font-black text-white">{selectedTask.assets.main}</div>
                                            <div className="text-[9px] text-gray-500 uppercase">Principal</div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl text-center border border-white/5">
                                            <div className="text-lg font-black text-white">{selectedTask.assets.broll}</div>
                                            <div className="text-[9px] text-gray-500 uppercase">B-Roll</div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl text-center border border-white/5">
                                            <div className="text-lg font-black text-white">{selectedTask.assets.drone}</div>
                                            <div className="text-[9px] text-gray-500 uppercase">Dron</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Zone */}
                                <div className="space-y-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                                            <UploadCloud className="w-4 h-4 text-green-400" /> Entrega de Versión
                                        </h3>
                                        <div className="border-2 border-dashed border-white/10 hover:border-green-500/50 rounded-2xl p-8 text-center transition-all bg-white/5 hover:bg-green-500/5 cursor-pointer">
                                            <Play className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                            <div className="text-sm font-bold text-white">Arrastra el render final aquí</div>
                                            <div className="text-[10px] text-gray-500 mt-1">MP4, H.264, Max 2GB</div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0E0E18] p-4 rounded-xl border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-400">Control de Calidad (QC)</span>
                                            <span className="text-xs text-green-400 font-bold">Automático</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <CheckCircle2 className="w-3 h-3 text-gray-600" /> Formato y Codec
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <CheckCircle2 className="w-3 h-3 text-gray-600" /> Niveles de Audio
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <CheckCircle2 className="w-3 h-3 text-gray-600" /> Color Safe
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpload}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-600/20"
                                    >
                                        Subir Versión V1
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 border border-white/5 rounded-3xl bg-white/5 text-center">
                            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 animate-pulse">
                                <Video className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Editor Workstation Ready</h3>
                            <p className="text-gray-500 max-w-sm">Selecciona una tarea de la izquierda para ver la guía del CM y los archivos disponibles.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
