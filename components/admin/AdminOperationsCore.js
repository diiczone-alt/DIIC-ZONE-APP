'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
    Activity, Clock, Star, Users,
    CheckCircle2, AlertTriangle,
    BarChart3, Layout, Gauge,
    UserCheck, Briefcase, Globe,
    Search, Filter, ArrowUpRight,
    TrendingUp, MessageSquare, ShieldCheck,
    Zap, ListOrdered, CheckSquare, BrainCircuit,
    AlertCircle, Flame, GraduationCap, MapPin, ExternalLink, FileText, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import AdminWorkloadManager from './AdminWorkloadManager';
import AdminClientPrioritization from './AdminClientPrioritization';
import AdminTalentReputation from './AdminTalentReputation';
import AdminTalentPayments from './AdminTalentPayments';
import AdminTalentTraining from './AdminTalentTraining';
import AdminProductionDashboard from './AdminProductionDashboard';

export default function AdminOperationsCore() {
    const [activeTab, setActiveTab] = useState('production');
    const [teamData, setTeamData] = useState([]);
    const [globalMetrics, setGlobalMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const isMounted = useRef(true);

    const loadOperationsData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        try {
            const [team, metrics] = await Promise.all([
                agencyService.getTeam(),
                agencyService.getGlobalMetrics() // Using existing service methods
            ]);
            
            if (isMounted.current) {
                setTeamData(team || []);
                setGlobalMetrics(metrics || {});
                
                // Persistence
                localStorage.setItem('diic_operations_cache', JSON.stringify({
                    team, metrics
                }));
            }
        } catch (err) {
            console.error("OperationsCore: Sync Error", err);
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setIsSyncing(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;

        // 1. Initial Cache Load
        const cached = localStorage.getItem('diic_operations_cache');
        if (cached) {
            try {
                const { team, metrics } = JSON.parse(cached);
                setTeamData(team || []);
                setGlobalMetrics(metrics || {});
                setLoading(false);
            } catch (e) {
                console.warn("Operations Cache invalid");
            }
        }

        // 2. Background Sync
        loadOperationsData(!!cached);

        // 3. Realtime Listeners
        const opsChannel = supabase
            .channel('operations-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, () => loadOperationsData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadOperationsData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => loadOperationsData(true))
            .subscribe();

        return () => {
            isMounted.current = false;
            supabase.removeChannel(opsChannel);
        };
    }, []);

    // Helper component for tabs
    const TabBtn = ({ id, label, active, setter }) => (
        <button
            onClick={() => setter(id)}
            className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-tighter transition-all ${active === id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* OPERATIONS HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-500/5 border border-blue-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                    {isSyncing ? (
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">
                            <Activity className="w-3 h-3" /> HQ OPS SYNC
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3 text-blue-500" /> SIEMPRE CONECTADO
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-2">
                        <Gauge className="w-8 h-8 text-blue-500" /> Núcleo de Operaciones
                    </h2>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">Arquitectura de control: Producción, Calidad y Asignación</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:bg-white/10 transition-all">
                        <Filter className="w-4 h-4" /> Todos los Nodos
                    </button>
                </div>
            </div>

            {/* MODULE NAVIGATION */}
            <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit overflow-x-auto max-w-full">
                <TabBtn id="production" label="Producción" active={activeTab} setter={setActiveTab} />
                <TabBtn id="talent-explorer" label="Explorer Talento" active={activeTab} setter={setActiveTab} />
                <TabBtn id="capacity" label="Capacidad" active={activeTab} setter={setActiveTab} />
                <TabBtn id="priority" label="Priorización" active={activeTab} setter={setActiveTab} />
                <TabBtn id="talent" label="Reputación" active={activeTab} setter={setActiveTab} />
                <TabBtn id="assignment" label="Asignación Smart" active={activeTab} setter={setActiveTab} />
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[600px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'production' && <AdminProductionDashboard key="production" />}
                    {activeTab === 'talent-explorer' && <TalentExplorer key="talent-explorer" teamData={teamData} />}
                    {activeTab === 'capacity' && <AdminWorkloadManager key="capacity" teamData={teamData} globalMetrics={globalMetrics} />}
                    {activeTab === 'priority' && <AdminClientPrioritization key="priority" />}
                    {activeTab === 'talent' && <AdminTalentReputation key="talent" teamData={teamData} />}
                    {activeTab === 'payments' && <AdminTalentPayments key="payments" />}
                    {activeTab === 'assignment' && <AssignmentModule key="assignment" />}
                </AnimatePresence>
            </div>
        </div>
    );
}

function TalentExplorer({ teamData = [] }) {
    const [selectedProfile, setSelectedProfile] = useState(null);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 text-left">
            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 italic">
                    <Users className="w-6 h-6 text-blue-500" /> Directorio Global de Talento (Nodos)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamData.map((m, i) => (
                        <div key={m.id || i} className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group relative">
                            <div className="absolute top-6 right-6 text-[8px] font-black text-white/20 uppercase tracking-widest">{m.id}</div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center font-black text-blue-500">
                                    {m.name.substring(0, 1)}
                                </div>
                                <div>
                                    <div className="font-black text-white italic group-hover:text-blue-400 transition-colors uppercase">{m.name}</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">{m.role}</div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-gray-500 uppercase">Ubicación</span>
                                    <span className="text-white flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> {m.city || 'Nodo Central'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-gray-500 uppercase">Nivel</span>
                                    <span className={`px-2 py-0.5 rounded border ${m.load < 70 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{m.load < 70 ? 'ÉLITE' : (m.load < 90 ? 'PRO' : 'LIMIT')}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-gray-500 uppercase">Carga</span>
                                    <span className={`font-black ${m.load > 90 ? 'text-red-500' : 'text-emerald-400'}`}>{m.load}% ({m.activeTasksCount} Tareas)</span>
                                </div>
                            </div>

                            <div className="flex gap-2 relative z-10">
                                <button onClick={() => setSelectedProfile(m)} className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Perfil</button>
                                <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Contactar</button>
                            </div>
                        </div>
                    ))}
                    {teamData.length === 0 && (
                         <div className="col-span-full py-20 text-center text-gray-500 font-bold italic">
                            No se detectaron miembros del equipo en el nodo actual.
                         </div>
                    )}
                </div>
            </div>

            {/* Modal de Perfil */}
            <AnimatePresence>
                {selectedProfile && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setSelectedProfile(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                            className="w-full max-w-md bg-[#0A0A12] border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="flex justify-between items-start mb-8 relative">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center font-black text-3xl text-blue-500 shadow-inner">
                                        {selectedProfile.name.substring(0, 1)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase italic">{selectedProfile.name}</h2>
                                        <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">{selectedProfile.role}</div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedProfile(null)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                                    ✕
                                </button>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">Nodo Operativo</span>
                                    <span className="text-sm font-bold text-white flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-500" /> {selectedProfile.city}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">Clasificación</span>
                                    <span className={`px-3 py-1 rounded text-[11px] font-black uppercase tracking-widest ${selectedProfile.level === 'Pro' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                                        LEVEL: {selectedProfile.level}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">Carga Actual</span>
                                    <span className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 
                                        {selectedProfile.activetasks || 0} Tareas Activas
                                    </span>
                                </div>

                                {/* CV SECTION */}
                                <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-indigo-400" />
                                        <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">Perfil Profesional / CV</span>
                                    </div>
                                    
                                    {selectedProfile.cv_summary ? (
                                        <p className="text-xs text-gray-400 leading-relaxed italic">
                                            "{selectedProfile.cv_summary}"
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500 italic">No se ha cargado un resumen profesional aún.</p>
                                    )}

                                    {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {selectedProfile.skills.map(skill => (
                                                <span key={skill} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[9px] font-black rounded-md uppercase border border-indigo-500/10">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {selectedProfile.cv_url && (
                                        <a 
                                            href={selectedProfile.cv_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-white transition-colors pt-2 uppercase tracking-tighter"
                                        >
                                            <ExternalLink className="w-3" /> Ver Curriculum Original
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Mensate Interno
                                </button>
                                {selectedProfile.whatsapp && (
                                    <button 
                                        onClick={() => {
                                            const cleanNum = selectedProfile.whatsapp.replace(/\D/g, '');
                                            const msg = encodeURIComponent(`Hola ${selectedProfile.name}, tienes una notificación pendiente en tu Workstation de DIIC ZONE. Por favor revisa tus tareas.`);
                                            window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
                                        }}
                                        className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                    >
                                        <Phone className="w-4 h-4" /> Recordatorio WA
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function ReputationModule() {
    const scores = [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 text-left">
            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-yellow-500" /> Ranking de Reputación Interna
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-6 text-[10px] font-bold text-gray-500 uppercase px-4 pb-2 border-b border-white/5">
                        <div className="col-span-2">Creativo / Nodo</div>
                        <div className="text-center">Score</div>
                        <div className="text-center">Entregas</div>
                        <div className="text-center">Revisiones</div>
                        <div className="text-right">Estatus</div>
                    </div>
                    {scores.map((s, i) => (
                        <div key={i} className="grid grid-cols-6 items-center p-4 rounded-xl hover:bg-white/5 transition-all group text-sm">
                            <div className="col-span-2 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-indigo-400">
                                    {s.name.substring(0, 1)}
                                </div>
                                <div>
                                    <div className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase">{s.name}</div>
                                    <div className="text-[10px] text-gray-500 font-bold">{s.role}</div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-black text-white">{s.score}</div>
                                <div className={`h-1 w-12 mx-auto rounded-full bg-white/5 overflow-hidden mt-1`}>
                                    <div className={`h-full ${s.score > 90 ? 'bg-emerald-500' : s.score > 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${s.score}%` }} />
                                </div>
                            </div>
                            <div className="text-center font-bold text-gray-400">{s.deliveries}</div>
                            <div className="text-center font-bold text-gray-400">{s.revisions}</div>
                            <div className="flex justify-end">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${s.status === 'Priority' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    s.status === 'Risk' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    }`}>
                                    {s.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {scores.length === 0 && (
                        <div className="py-20 text-center text-gray-500 font-bold italic">
                            No hay datos de reputación disponibles. Comienza a asignar tareas para generar métricas.
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
                    <ShieldCheck className="w-12 h-12 text-indigo-500 mb-6" />
                    <h4 className="text-xl font-black text-white mb-2">Asignación Inteligente (Smart Rules)</h4>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        El sistema prioriza automáticamente a los creativos con score {">"} 90 para proyectos de altos ingresos o clientes críticos (Nivel Master).
                    </p>
                    <div className="flex gap-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center flex-1">
                            <div className="text-xs font-bold text-emerald-400 mb-1">PRO-ASSIGN</div>
                            <div className="text-[10px] text-gray-500 uppercase">Activo</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center flex-1">
                            <div className="text-xs font-bold text-red-400 mb-1">RISK-LIMIT</div>
                            <div className="text-[10px] text-gray-500 uppercase">Restringido</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2 underline decoration-yellow-500/50 underline-offset-4">Impacto en la Red</h4>
                        <p className="text-sm text-gray-500">
                            La reputación afecta directamente el flujo de proyectos y el nivel de los Nodos. Un Nodo con score promedio bajo no puede subir de BASIC a PRO.
                        </p>
                    </div>
                    <button className="mt-8 w-full py-4 bg-yellow-500 text-black font-black text-sm rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                        Revisar Tabla de Ascensos de Nodos <ArrowUpRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function AssignmentModule() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]);
    
    // New Task Form State
    const [newTask, setNewTask] = useState({ title: '', clientId: '', role: 'editor' });
    const [isCreating, setIsCreating] = useState(false);

    const refreshTasks = async () => {
        const data = await agencyService.getTasks();
        setTasks(data.slice(0, 5));
    };

    useEffect(() => {
        const loadInitialData = async () => {
            const [tasksData, clientsData] = await Promise.all([
                agencyService.getTasks(),
                agencyService.getClients()
            ]);
            setTasks(tasksData.slice(0, 5));
            setClients(clientsData);
            setLoading(false);
        };
        loadInitialData();
    }, []);

    const handleCreateIntelligentTask = async (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.clientId) return toast.error("Completa los campos");
        
        setIsCreating(true);
        try {
            const client = clients.find(c => c.id === newTask.clientId);
            const taskToCreate = {
                title: newTask.title,
                city: client?.city,
                assigned_role: newTask.role,
                status: 'todo',
                priority: 'medium',
                client_name: client?.name
            };

            const created = await agencyService.createTask(taskToCreate);
            toast.success(`Asignado a ${created.assigned_to} por ${created.assignment_reason}`);
            setNewTask({ title: '', clientId: '', role: 'editor' });
            await refreshTasks();
        } catch (error) {
            toast.error("Error al asignar tarea");
        } finally {
            setIsCreating(false);
        }
    };

    const priorities = [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 text-left">
            
            {/* 0. INTELLIGENT TASK DISPATCHER FORM */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden mb-8">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-end">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2">
                             <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Generador de Producción Inteligente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Título de Tarea</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: Rodaje Reel Médico"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cliente / Ciudad</label>
                                <select 
                                    value={newTask.clientId}
                                    onChange={(e) => setNewTask({...newTask, clientId: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                                >
                                    <option value="" className="bg-[#050511]">Seleccionar Cliente</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id} className="bg-[#050511]">{c.name} ({c.city})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rol Requerido</label>
                                <select 
                                    value={newTask.role}
                                    onChange={(e) => setNewTask({...newTask, role: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                                >
                                    <option value="editor" className="bg-[#050511]">Editor de Video</option>
                                    <option value="design" className="bg-[#050511]">Diseñador</option>
                                    <option value="community" className="bg-[#050511]">Community Manager</option>
                                    <option value="filmmaker" className="bg-[#050511]">Filmmaker (Logística)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleCreateIntelligentTask}
                        disabled={isCreating}
                        className="p-4 px-8 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {isCreating ? 'ASIGNANDO...' : 'EJECUTAR DISPATCHER'} <ArrowUpRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. CUSTOMER PRIORITIZATION (SEMAFORO) */}
                <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-500" /> Priorización de Clientes (Score)
                    </h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-4 text-[10px] font-bold text-gray-500 uppercase px-4 pb-2 border-b border-white/5">
                            <div className="col-span-2">Cliente / Motivo</div>
                            <div className="text-center">Score</div>
                            <div className="text-right">Nivel</div>
                        </div>
                        {priorities.map((p, i) => (
                            <div key={i} className="grid grid-cols-4 items-center p-4 rounded-xl hover:bg-white/5 transition-all text-sm group">
                                <div className="col-span-2">
                                    <div className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase">{p.client}</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{p.reason}</div>
                                </div>
                                <div className="text-center font-black text-white text-lg">{p.score}</div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black border ${p.level === 'critical' ? 'bg-red-500 text-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                                        p.level === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                            p.level === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        }`}>
                                        {p.level.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {priorities.length === 0 && (
                            <div className="py-20 text-center text-gray-500 font-bold italic">
                                No hay alertas de priorización. Todos los flujos están estables.
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. AUTO-DISPATCHER (ASSIGNMENTS) */}
                <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-blue-500" /> Asignación Inteligente
                    </h3>
                    <div className="space-y-4">
                        {tasks.map((t, i) => (
                            <div key={t.id || i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group/task">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-[10px] text-gray-500 font-black uppercase">ID: {t.id}</div>
                                            {t.tags?.includes('Requiere Logística') && (
                                                <div className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[8px] font-black uppercase rounded-full border border-red-500/20 animate-pulse">
                                                    Requiere Logística 🚁
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-bold text-white group-hover/task:text-blue-400 transition-colors">{t.title}</div>
                                    </div>
                                    <div className={`p-1 px-2 rounded text-[10px] font-black ${t.assignment_reason ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {t.assignment_reason || 'MANUAL'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400">
                                            {t.assigned_to?.[0] || '?'}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-300">Asignado: <span className="text-white">{t.assigned_to || 'Sin asignar'}</span></div>
                                            <div className="text-[10px] text-gray-500 italic">Motivo: {t.assignment_reason || 'Definido por Admin'}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">Prioridad</div>
                                        <div className={`text-[10px] font-black ${t.priority === 'high' ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {t.priority?.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-600 font-bold italic">No hay tareas inteligentes en cola.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* SCORING LOGIC LEGEND */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-8">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Lógica de Priorización Automatizada</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <LogicItem label="Valor Económico" rules={["Premium: 3 pts", "Service Add: +1"]} />
                    <LogicItem label="Urgencia Temporal" rules={["< 3 días: 3 pts", "Evento: +2"]} />
                    <LogicItem label="Impacto Estratégico" rules={["Marca Top: 2 pts", "Alianza: 3 pts"]} />
                    <LogicItem label="Riesgo Operativo" rules={["Insatisfecho: 2 pts", "Evento Vivo: 3 pts"]} />
                </div>
            </div>
        </motion.div>
    );
}

// --- HELPER UI ---

function LogicItem({ label, rules }) {
    return (
        <div className="space-y-2">
            <div className="text-xs font-bold text-indigo-400">{label}</div>
            <div className="space-y-1">
                {rules.map((r, i) => (
                    <div key={i} className="text-[10px] text-gray-500 flex items-center gap-1">
                        <CheckSquare className="w-2.5 h-2.5" /> {r}
                    </div>
                ))}
            </div>
        </div>
    );
}

function WorkloadRow({ name, load, projects, color }) {
    const barColors = {
        red: "bg-red-500",
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        emerald: "bg-emerald-500",
    };
    return (
        <div className="space-y-1.5 text-left">
            <div className="flex justify-between text-xs font-bold">
                <span className="text-white">{name}</span>
                <span className="text-gray-500">{projects} Proyectos</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${load}%` }} transition={{ duration: 1.5 }} className={`h-full ${barColors[color]}`} />
            </div>
        </div>
    );
}

function QualityCard({ label, value, icon: Icon, color }) {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        red: "text-red-400 bg-red-500/10",
    };
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 text-left">
            <div className={`p-2.5 rounded-xl ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-xl font-black text-white leading-none">{value}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">{label}</div>
            </div>
        </div>
    );
}

function NodeRow({ name, projects, onTime, level }) {
    const levelColor = {
        MASTER: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
        PRO: "text-blue-400 border-blue-400/20 bg-blue-400/5",
        BASIC: "text-gray-400 border-white/20 bg-white/5",
    };
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-all text-left">
            <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <div>
                    <div className="text-sm font-bold text-white uppercase">{name}</div>
                    <div className="text-[10px] text-gray-500">{projects} Producciones</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs font-black text-emerald-400 mb-1">{onTime} a tiempo</div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${levelColor[level]}`}>
                    {level}
                </span>
            </div>
        </div>
    );
}

