'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Camera, UploadCloud,
    CheckSquare, Clock, Film, MoreVertical, Search, Filter,
    ArrowRight, Bell, MessageSquare, PlayCircle, Plus,
    Layout, List, Inbox, Video, FileText, Download,
    MoreHorizontal, CheckCircle, AlertCircle, ChevronLeft, ChevronRight,
    Sparkles, Grid as GridIcon, X, Users, Send
} from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';

// --- MOCK DATA ---
const INITIAL_PROJECTS = [
    { id: 'PRJ-204', client: 'Clínica Smith', title: 'Video Corporativo', type: 'Corporativo', deadline: '2026-02-10', status: 'pre-pro', priority: 'high', thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60', progress: 30 },
    { id: 'PRJ-205', client: 'FitLife Gym', title: 'Reels Rutina', type: 'Redes', deadline: '2026-02-12', status: 'shooting', priority: 'medium', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60', progress: 60 },
    { id: 'PRJ-206', client: 'Tech Solutions', title: 'Cobertura Evento', type: 'Evento', deadline: '2026-02-14', status: 'post-pro', priority: 'high', thumb: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60', progress: 85 },
    { id: 'PRJ-207', client: 'EcoStore', title: 'Campaña Lanzamiento', type: 'Publicidad', deadline: '2026-02-15', status: 'review', priority: 'critical', thumb: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=60', progress: 95 }
];

const INBOX_TASKS = [
    { id: 'TSK-001', from: 'Laura G. (Strategy)', title: '3 Reels - Tendencias Gym', desc: 'Requerimos 3 videos cortos formato 9:16 para la campaña de febrero. Guiones adjuntos.', date: 'Hace 2 horas', deadline: '2026-02-20', assets: 2, type: 'Redes' },
    { id: 'TSK-002', from: 'Carlos R. (CM)', title: 'Edición Entrevista CEO', desc: 'El material bruto está en la carpeta compartida. Necesitamos un corte de 2min.', date: 'Hace 5 horas', deadline: '2026-02-18', assets: 15, type: 'Corporativo' }
];

const COLUMNS = [
    { id: 'pre-pro', label: 'Pre-Pro', color: 'border-blue-500', bg: 'bg-blue-500/5' },
    { id: 'shooting', label: 'En Rodaje', color: 'border-red-500', bg: 'bg-red-500/5' },
    { id: 'post-pro', label: 'Edición', color: 'border-purple-500', bg: 'bg-purple-500/5' },
    { id: 'review', label: 'Revisión', color: 'border-amber-500', bg: 'bg-amber-500/5' },
    { id: 'done', label: 'Finalizado', color: 'border-emerald-500', bg: 'bg-emerald-500/5' }
];

export default function FilmmakerDashboard() {
    const [activeTab, setActiveTab] = useState('board');
    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [inbox, setInbox] = useState(INBOX_TASKS);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    // --- ACTIONS ---
    const moveTaskToBoard = (taskId) => {
        const task = inbox.find(t => t.id === taskId);
        if (!task) return;
        const newProject = {
            id: `PRJ-${Math.floor(Math.random() * 1000)}`,
            client: 'Nuevo Cliente',
            title: task.title,
            type: task.type || 'General',
            deadline: task.deadline,
            status: 'pre-pro',
            priority: 'medium',
            thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=60',
            progress: 0
        };
        setProjects([...projects, newProject]);
        setInbox(inbox.filter(t => t.id !== taskId));
    };

    const handleDragStart = (e, projectId) => {
        e.dataTransfer.setData('projectId', projectId);
    };

    const handleDrop = (e, status) => {
        const projectId = e.dataTransfer.getData('projectId');
        if (projectId) {
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    // --- CALENDAR HELPERS ---
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-white">Estación de Producción</h1>
                    <div className="flex bg-[#0E0E18] p-1 rounded-lg border border-white/10">
                        <button onClick={() => setActiveTab('board')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'board' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Layout className="w-3.5 h-3.5" /> Tablero
                        </button>
                        <button onClick={() => setActiveTab('inbox')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${activeTab === 'inbox' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Inbox className="w-3.5 h-3.5" /> Solicitudes
                            {inbox.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                        </button>
                        <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'calendar' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <CalendarIcon className="w-3.5 h-3.5" /> Agenda
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        <Plus className="w-3.5 h-3.5" /> Nuevo Proyecto
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {/* --- KANBAN BOARD --- */}
                    {activeTab === 'board' && (
                        <motion.div key="board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex gap-6 p-8 overflow-x-auto">
                            {COLUMNS.map(col => (
                                <div
                                    key={col.id}
                                    className={`min-w-[300px] flex flex-col h-full rounded-2xl transition-colors ${col.bg}`}
                                    onDrop={(e) => handleDrop(e, col.id)}
                                    onDragOver={handleDragOver}
                                >
                                    <div className={`flex items-center justify-between mb-4 p-4 border-b-2 ${col.color}`}>
                                        <h3 className="font-bold text-white text-sm">{col.label}</h3>
                                        <span className="text-xs text-gray-500 font-mono bg-black/20 px-2 py-0.5 rounded-full">{projects.filter(p => p.status === col.id).length}</span>
                                    </div>
                                    <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 custom-scrollbar">
                                        {projects.filter(p => p.status === col.id).map(project => (
                                            <div
                                                key={project.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, project.id)}
                                                onClick={() => setSelectedProject(project)}
                                                className="cursor-pointer active:cursor-grabbing"
                                            >
                                                <ProjectCard project={project} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* --- INBOX --- */}
                    {activeTab === 'inbox' && (
                        <motion.div key="inbox" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full p-8 max-w-5xl mx-auto overflow-y-auto custom-scrollbar">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-cyan-600/20 rounded-lg text-cyan-400"><Inbox className="w-6 h-6" /></div>
                                Solicitudes de Producción
                            </h2>
                            <div className="space-y-4">
                                {inbox.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500"><CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" /><p>¡Todo al día!</p></div>
                                ) : (
                                    inbox.map(task => (
                                        <div key={task.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">{task.from.substring(0, 2)}</div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{task.title}</h3>
                                                        <p className="text-xs text-cyan-400 font-medium">De: {task.from} • {task.date}</p>
                                                    </div>
                                                </div>
                                                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">Deadline: {task.deadline}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-6 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{task.desc}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1 hover:text-white cursor-pointer"><FileText className="w-4 h-4" /> {task.assets} Archivos</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => setInbox(inbox.filter(t => t.id !== task.id))} className="px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">Rechazar</button>
                                                    <button onClick={() => moveTaskToBoard(task.id)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/40 transition-all flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Aceptar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* --- CALENDAR (Adapted) --- */}
                    {activeTab === 'calendar' && (
                        <motion.div key="calendar" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full flex gap-6 p-8 overflow-hidden">
                            <div className="flex-1 bg-gradient-to-br from-[#0E0E18] to-[#050511] relative p-8 rounded-[2rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-3xl font-bold text-white capitalize">{currentDate.toLocaleString('es-ES', { month: 'long' })} <span className="text-white/30 text-xl font-light">{currentDate.getFullYear()}</span></h2>
                                        <div className="flex gap-1 bg-white/5 rounded-full p-1">
                                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1 hover:bg-white/10 rounded-full text-white"><ChevronLeft className="w-5 h-5" /></button>
                                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1 hover:bg-white/10 rounded-full text-white"><ChevronRight className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {['Producción', 'Entrega'].map(label => (
                                            <div key={label} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 text-gray-400 border border-white/5 flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${label === 'Producción' ? 'bg-red-500' : 'bg-emerald-500'}`}></span> {label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex-1">
                                    {DAYS.map(d => <div key={d} className="bg-black/20 py-3 text-center text-[10px] font-bold text-gray-500 uppercase">{d}</div>)}
                                    {Array(getFirstDayOfMonth(currentDate)).fill(null).map((_, i) => <div key={`blank-${i}`} className="bg-black/10"></div>)}
                                    {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(day => {
                                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const dayProjects = projects.filter(p => p.deadline === dateStr);
                                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                                        return (
                                            <div key={day} onClick={() => setSelectedDay(day)} className={`relative p-2 min-h-[100px] cursor-pointer hover:bg-white/5 transition-colors ${isToday ? 'bg-cyan-900/10' : 'bg-black/20'}`}>
                                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-500'}`}>{day}</span>
                                                <div className="space-y-1">
                                                    {dayProjects.map(p => (
                                                        <div key={p.id} className={`text-[9px] px-1.5 py-1 rounded border truncate ${p.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                            {p.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* --- PROJECT DETAIL MODAL --- */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function ProjectCard({ project }) {
    return (
        <motion.div layoutId={project.id} whileHover={{ y: -2 }} className="bg-[#0E0E18] border border-white/5 rounded-xl p-3 hover:border-white/20 transition-all shadow-lg group">
            <div className="relative h-28 mb-3 rounded-lg overflow-hidden">
                <img src={project.thumb} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">{project.type}</div>
                {project.priority === 'critical' && <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-md"><AlertCircle className="w-3 h-3" /> URGENTE</div>}
            </div>
            <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">{project.title}</h4>
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
                <span>{project.client}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.deadline}</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: `${project.progress}%` }} />
            </div>
        </motion.div>
    );
}

function ProjectDetailModal({ project, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#0E0E18] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-48 relative shrink-0">
                    <img src={project.thumb} alt={project.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] via-[#0E0E18]/50 to-transparent" />
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors z-10"><X className="w-5 h-5" /></button>

                    <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{project.type}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${project.priority === 'critical' ? 'border-red-500/50 text-red-400' : 'border-gray-500/50 text-gray-400'}`}>{project.priority}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-1">{project.title}</h2>
                            <p className="text-gray-400 flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-blue-500" /> {project.client}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Deadline</div>
                            <div className="text-xl font-bold text-white flex items-center gap-2 justify-end"><Clock className="w-5 h-5 text-red-500" /> {project.deadline}</div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Main Info */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-white/5 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-500" /> Descripción / Briefing</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Este proyecto consiste en la producción de {project.title.toLowerCase()} para {project.client}.
                                El objetivo principal es capturar la esencia de la marca con un estilo dinámico y moderno.
                                Se requiere especial atención a la iluminación y el audio directo. Entregables en formato 16:9 y 9:16.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-gray-500" /> Checklist de Producción</h3>
                            <div className="space-y-2">
                                {['Guión Aprobado', 'Locaciones Confirmadas', 'Equipo Técnico Reservado', 'Casting / Talento', 'Plan de Rodaje Creado'].map((item, i) => (
                                    <label key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${i < 2 ? 'bg-blue-600 border-blue-600' : 'border-gray-600 group-hover:border-blue-500'}`}>
                                            {i < 2 && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className={`text-sm ${i < 2 ? 'text-white line-through opacity-50' : 'text-gray-300'}`}>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><UploadCloud className="w-5 h-5 text-gray-500" /> Archivos & Assets</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400"><FileText className="w-5 h-5" /></div>
                                    <div><div className="text-white text-sm font-bold">Guión_v2.pdf</div><div className="text-xs text-gray-500">2.4 MB</div></div>
                                </div>
                                <div className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400"><MapPin className="w-5 h-5" /></div>
                                    <div><div className="text-white text-sm font-bold">Locaciones.jpg</div><div className="text-xs text-gray-500">5.1 MB</div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-80 bg-[#13131f] p-6 flex flex-col gap-6 overflow-y-auto">
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Estado del Proyecto</h4>
                            <div className="p-1 bg-black/20 rounded-xl border border-white/5">
                                {COLUMNS.map(col => (
                                    <button
                                        key={col.id}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold mb-1 transition-all flex items-center justify-between ${project.status === col.id ? `${col.bg} ${col.color.replace('border', 'text')} border border-current` : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {col.label}
                                        {project.status === col.id && <CheckCircle className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Equipo Asignado</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500" />
                                    <div><div className="text-white text-xs font-bold">Carlos R.</div><div className="text-[10px] text-gray-500">Director</div></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500" />
                                    <div><div className="text-white text-xs font-bold">Ana M.</div><div className="text-[10px] text-gray-500">Prod. Manager</div></div>
                                </div>
                                <button className="w-full py-2 border border-dashed border-gray-700 rounded-lg text-xs text-gray-500 hover:text-white hover:border-gray-500 transition-colors">+ Asignar Miembro</button>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all text-sm flex items-center justify-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Abrir Chat de Proyecto
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
