'use client';

import { useState, useEffect } from 'react';
import {
    Clock, Play, Square, Calendar, Plus, List,
    TrendingUp, Award, CheckCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function DesignerTimesPage() {
    const [isTracking, setIsTracking] = useState(false);
    const [time, setTime] = useState(0); // in seconds
    const [selectedProject, setSelectedProject] = useState('1');
    const [recentLogs, setRecentLogs] = useState([
        { id: 1, task: 'Diseño de Storyboards', project: 'Campaña Black Friday', duration: '2h 15m', date: 'Hoy' },
        { id: 2, task: 'Corrección de Paleta e Identidad', project: 'Logo Clínica Dental', duration: '1h 30m', date: 'Ayer' },
        { id: 3, task: 'Layout de Newsletter Mensual', project: 'Tech Solutions', duration: '3h 45m', date: '12 de Jun' },
        { id: 4, task: 'Retoque de Fotografía de Producto', project: 'EcoStore', duration: '4h 10m', date: '10 de Jun' }
    ]);

    useEffect(() => {
        let interval = null;
        if (isTracking) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isTracking && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTracking, time]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartStop = () => {
        if (isTracking) {
            // Stop tracking and save log
            setIsTracking(false);
            const hrs = Math.floor(time / 3600);
            const mins = Math.floor((time % 3600) / 60);
            const durationString = `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
            
            const newLog = {
                id: Date.now(),
                task: 'Trabajo de Diseño General',
                project: selectedProject === '1' ? 'Campaña Black Friday' : selectedProject === '2' ? 'Logo Clínica Dental' : 'Tech Solutions',
                duration: durationString || '1m',
                date: 'Hoy'
            };
            setRecentLogs([newLog, ...recentLogs]);
            setTime(0);
            toast.success('Sesión de diseño guardada correctamente.');
        } else {
            setIsTracking(true);
            toast.info('Tiempo iniciado para el proyecto seleccionado.');
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050511] p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                    <Clock className="w-6 h-6 text-pink-500" /> Registro de Tiempos
                </h1>
                <p className="text-sm text-gray-400 mt-1">Monitorea las horas invertidas en tus procesos creativos.</p>
            </div>

            {/* Time Tracker Control Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0E0E18] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-2">
                            <span className="text-[8px] font-black text-pink-400 uppercase tracking-widest block pl-0.5">PROYECTO ACTIVO</span>
                            <select
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="bg-[#13131F] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-pink-500 cursor-pointer min-w-[240px]"
                            >
                                <option value="1">Campaña Black Friday - Ecom Store</option>
                                <option value="2">Logo Versión Dark - Clínica Dental</option>
                                <option value="3">Newsletter Mensual - Tech Solutions</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 w-fit">
                            <div className={`w-1.5 h-1.5 rounded-full ${isTracking ? 'bg-pink-500 animate-pulse' : 'bg-gray-500'}`} />
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">{isTracking ? 'TRACKING ACTIVO' : 'PAUSADO'}</span>
                        </div>
                    </div>

                    <div className="text-center py-6 relative z-10">
                        <div className="text-5xl md:text-7xl font-mono font-black text-white tracking-widest leading-none drop-shadow-md select-none">
                            {formatTime(time)}
                        </div>
                    </div>

                    <div className="flex justify-center relative z-10 pt-4 border-t border-white/5">
                        <button
                            onClick={handleStartStop}
                            className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 ${
                                isTracking 
                                ? 'bg-red-500 text-white shadow-red-950/40' 
                                : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-900/40'
                            }`}
                        >
                            {isTracking ? <><Square className="w-4 h-4" /> Detener Tracker</> : <><Play className="w-4 h-4" /> Iniciar Tracker</>}
                        </button>
                    </div>
                </div>

                {/* Tracking stats */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-2xl">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">HORAS ESTA SEMANA</span>
                                <h2 className="text-3xl font-black text-white italic">11h 30m</h2>
                                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide mt-1">+15% comparado con la semana anterior</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">META SEMANAL</span>
                                <h2 className="text-3xl font-black text-white italic">25 Horas</h2>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-1">Vas al 46% del objetivo semanal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Logs List */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-black text-white/50 flex items-center gap-3 uppercase tracking-[0.2em] mb-4">
                    <List className="w-4 h-4 text-pink-400" /> Registro Histórico
                </h3>

                <div className="space-y-3">
                    {recentLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-pink-500/20 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-pink-400 group-hover:scale-105 transition-transform">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">{log.task}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">{log.project}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-mono text-sm font-black">{log.duration}</div>
                                <div className="text-[9px] text-gray-600 font-bold uppercase mt-0.5">{log.date}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
