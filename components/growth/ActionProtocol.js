'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, Circle, Zap, ShieldCheck, 
    ArrowRight, Bell, User, Shield, Info 
} from 'lucide-react';

export default function ActionProtocol({ 
    protocols = [], 
    level = 'presencia',
    role = 'CLIENT', // 'CLIENT' o 'ADMIN'/'CM'
    onComplete 
}) {
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(0);

    // Inicializar tareas con estado local (demo)
    useEffect(() => {
        const initialTasks = protocols[level]?.map(t => ({
            ...t,
            completed: false,
            completedBy: null,
            completedAt: null
        })) || [];
        setTasks(initialTasks);
    }, [protocols, level]);

    useEffect(() => {
        const completedCount = tasks.filter(t => t.completed).length;
        setProgress(tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0);
    }, [tasks]);

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const isNowCompleted = !t.completed;
                return {
                    ...t,
                    completed: isNowCompleted,
                    completedBy: isNowCompleted ? (role === 'CLIENT' ? 'médica' : 'estratega') : null,
                    completedAt: isNowCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
                };
            }
            return t;
        }));
        if (onComplete) onComplete(id);
    };

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Protocolo de Acción</h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nivel Actual: <span className="text-indigo-400">{level.toUpperCase()}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-3xl border border-white/5">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Progreso del Día</p>
                        <p className="text-xl font-black text-white italic">{Math.round(progress)}%</p>
                    </div>
                    <div className="w-12 h-12 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                            <motion.circle 
                                cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="4" fill="transparent" 
                                strokeDasharray={126}
                                initial={{ strokeDashoffset: 126 }}
                                animate={{ strokeDashoffset: 126 - (126 * progress) / 100 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <Zap className={`absolute w-4 h-4 transition-colors ${progress === 100 ? 'text-amber-500 scale-125' : 'text-gray-700'}`} />
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4 relative z-10">
                {tasks.map((task, index) => (
                    <motion.div 
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleTask(task.id)}
                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer group/task flex items-center justify-between gap-4 ${
                            task.completed 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                        }`}
                    >
                        <div className="flex items-center gap-5 flex-1">
                            <div className={`shrink-0 transition-transform duration-500 group-hover/task:scale-110 ${task.completed ? 'text-emerald-500' : 'text-gray-600'}`}>
                                {task.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                            </div>
                            <div className="space-y-1">
                                <h4 className={`text-sm font-bold transition-colors ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                                    {task.task}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400/70">Impacto: {task.impact}</span>
                                    {task.completed && (
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                                            {task.completedBy === 'médica' ? <User className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                            Marcado por {task.completedBy} • {task.completedAt}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!task.completed && (
                            <ArrowRight className="w-5 h-5 text-gray-700 group-hover/task:text-white transition-colors animate-pulse" />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Notification Bar (Conditioned) */}
            <AnimatePresence>
                {progress < 100 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 relative z-10"
                    >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Bell className="w-5 h-5 animate-bounce" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Protocolo Incompleto</p>
                            <p className="text-xs text-white/80 font-bold">Aún quedan {tasks.filter(t => !t.completed).length} acciones críticas para consolidar tu autoridad hoy.</p>
                        </div>
                        <Info className="w-4 h-4 text-gray-600 cursor-help" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Strategy Insight */}
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Siguiente Nivel: {level === 'crecimiento' ? 'AUTORIDAD' : 'SCALADO'}
                </p>
                <div className="flex gap-4">
                    <button className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors">Solicitar Mentoría 1-a-1</button>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
            </div>
        </div>
    );
}
