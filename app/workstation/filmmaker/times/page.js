'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    Clock, Play, Pause, RotateCcw, 
    Save, Plus, Trash2, Calendar, FileText, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_LOGS = [
    { id: 1, title: 'Rodaje Principal - Clínica Smith', project: 'Clínica Smith', date: '2026-05-25', hours: '4.5', type: 'Filmación' },
    { id: 2, title: 'Scouting Técnico y Luces', project: 'FitLife Gym', date: '2026-05-24', hours: '2.0', type: 'Scouting' },
    { id: 3, title: 'Rodaje Dron y Exteriores', project: 'EcoStore', date: '2026-05-22', hours: '3.0', type: 'Filmación' },
    { id: 4, title: 'Reunión de Guión y Storyboard', project: 'Tech Solutions', date: '2026-05-20', hours: '1.5', type: 'Pre-Pro' },
];

export default function FilmmakerTimesPage() {
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [sessionTitle, setSessionTitle] = useState('');
    const [sessionProject, setSessionProject] = useState('Clínica Smith');
    const [sessionType, setSessionType] = useState('Filmación');
    const increment = useRef(null);

    // Form inputs for manual log
    const [manualTitle, setManualTitle] = useState('');
    const [manualProject, setManualProject] = useState('Clínica Smith');
    const [manualHours, setManualHours] = useState('');
    const [manualType, setManualType] = useState('Filmación');

    // Live Timer control
    const handleStart = () => {
        setIsActive(true);
        increment.current = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
    };

    const handlePause = () => {
        clearInterval(increment.current);
        setIsActive(false);
    };

    const handleReset = () => {
        clearInterval(increment.current);
        setIsActive(false);
        setSeconds(0);
    };

    const formatTime = () => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const hours = Math.floor(seconds / 3600);
        const getHours = `0${hours}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    const handleSaveSession = () => {
        if (seconds === 0) return;
        const loggedHours = (seconds / 3600).toFixed(1);
        const newLog = {
            id: Date.now(),
            title: sessionTitle || `Sesión de ${sessionType}`,
            project: sessionProject,
            date: new Date().toISOString().split('T')[0],
            hours: loggedHours,
            type: sessionType
        };
        setLogs([newLog, ...logs]);
        handleReset();
        setSessionTitle('');
    };

    const handleAddManualLog = (e) => {
        e.preventDefault();
        if (!manualTitle || !manualHours) return;
        const newLog = {
            id: Date.now(),
            title: manualTitle,
            project: manualProject,
            date: new Date().toISOString().split('T')[0],
            hours: parseFloat(manualHours).toFixed(1),
            type: manualType
        };
        setLogs([newLog, ...logs]);
        setManualTitle('');
        setManualHours('');
    };

    const handleDeleteLog = (id) => {
        setLogs(logs.filter(log => log.id !== id));
    };

    // Calculate stats
    const totalHours = logs.reduce((acc, curr) => acc + parseFloat(curr.hours), 0).toFixed(1);
    const filmacionHours = logs.filter(l => l.type === 'Filmación').reduce((acc, curr) => acc + parseFloat(curr.hours), 0).toFixed(1);
    const preproHours = logs.filter(l => l.type === 'Pre-Pro' || l.type === 'Scouting').reduce((acc, curr) => acc + parseFloat(curr.hours), 0).toFixed(1);

    useEffect(() => {
        return () => clearInterval(increment.current);
    }, []);

    return (
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#050511] text-white custom-scrollbar">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                        <Clock className="w-8 h-8 text-cyan-500" /> Registro de Tiempos
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Registra tus horas en set, scoutings y preparación técnica de equipos.</p>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Horas Totales del Mes</span>
                        <span className="text-3xl font-black text-white mt-1 block">{totalHours} horas</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Horas de Rodaje (Set)</span>
                        <span className="text-3xl font-black text-white mt-1 block">{filmacionHours} horas</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Horas de Pre-Pro & Scouting</span>
                        <span className="text-3xl font-black text-white mt-1 block">{preproHours} horas</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                        <Calendar className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Live Timer */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-[#0E0E18] to-[#0A0A12] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-3xl rounded-full -mr-16 -mt-16" />
                        
                        <div>
                            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-cyan-500/20 inline-block mb-6">
                                Cronómetro en Vivo
                            </span>
                            <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-4">Temporizador de Rodaje</h2>
                        </div>

                        {/* Large digital clock */}
                        <div className="py-8 flex justify-center items-center">
                            <span className="text-6xl md:text-7xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-500">
                                {formatTime()}
                            </span>
                        </div>

                        {/* Inputs for live session */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Título de Sesión</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: Filmación Toma A"
                                    value={sessionTitle}
                                    onChange={(e) => setSessionTitle(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/30"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Proyecto</label>
                                <select 
                                    value={sessionProject}
                                    onChange={(e) => setSessionProject(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                >
                                    <option>Clínica Smith</option>
                                    <option>FitLife Gym</option>
                                    <option>EcoStore</option>
                                    <option>Tech Solutions</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Especialidad</label>
                                <select 
                                    value={sessionType}
                                    onChange={(e) => setSessionType(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                >
                                    <option>Filmación</option>
                                    <option>Scouting</option>
                                    <option>Pre-Pro</option>
                                </select>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
                            <div className="flex gap-2">
                                {!isActive ? (
                                    <button 
                                        onClick={handleStart}
                                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-white" /> Iniciar
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handlePause}
                                        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <Pause className="w-4 h-4 fill-black" /> Pausar
                                    </button>
                                )}
                                <button 
                                    onClick={handleReset}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5"
                                    title="Reiniciar"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>

                            <button 
                                onClick={handleSaveSession}
                                disabled={seconds === 0}
                                className={`px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${seconds === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 shadow-xl'}`}
                            >
                                <Save className="w-4 h-4" /> Guardar Log
                            </button>
                        </div>
                    </div>

                    {/* Logs History */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-[32px] p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" /> Historial de Sesiones Recientes
                        </h3>

                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div key={log.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">{log.title}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Cliente: <span className="text-cyan-400 font-semibold">{log.project}</span> • {log.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-white">{log.hours} hrs</div>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{log.type}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteLog(log.id)}
                                            className="p-2 text-gray-700 hover:text-red-500 hover:bg-red-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            title="Eliminar registro"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side: Manual Log Form */}
                <div className="space-y-6">
                    <div className="bg-[#0E0E18] border border-white/5 rounded-[32px] p-6 shadow-2xl">
                        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-cyan-400" /> Registro Manual
                        </h3>

                        <form onSubmit={handleAddManualLog} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Descripción de la Tarea</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: Rodaje de entrevistas"
                                    value={manualTitle}
                                    onChange={(e) => setManualTitle(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Proyecto Asociado</label>
                                <select 
                                    value={manualProject}
                                    onChange={(e) => setManualProject(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                                >
                                    <option>Clínica Smith</option>
                                    <option>FitLife Gym</option>
                                    <option>EcoStore</option>
                                    <option>Tech Solutions</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Tipo de Trabajo</label>
                                <select 
                                    value={manualType}
                                    onChange={(e) => setManualType(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                                >
                                    <option>Filmación</option>
                                    <option>Scouting</option>
                                    <option>Pre-Pro</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Horas Invertidas</label>
                                <input 
                                    type="number" 
                                    step="0.5" 
                                    min="0.5" 
                                    max="24"
                                    placeholder="Ej: 3.5"
                                    value={manualHours}
                                    onChange={(e) => setManualHours(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                            >
                                <Save className="w-4 h-4" /> Registrar Log Manual
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
