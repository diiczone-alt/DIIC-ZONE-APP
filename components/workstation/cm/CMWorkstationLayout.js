'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    LayoutDashboard, Users, Calendar, BarChart3, 
    Settings, Search, Bell, Mail, Plus,
    ExternalLink, CheckCircle2, AlertTriangle, 
    Smartphone, Globe, MessageSquare, Share2, Database,
    MoreHorizontal, Filter, Play, Check, ChevronRight as ChevronRightIcon, X,
    FolderOpen, Palette, Clock, Bot, FileText, Zap, ShieldCheck, Eye, Send,
    GraduationCap, Award, TrendingUp, Target, Brain, Sparkles, PenTool, Edit3,
    ChevronLeft as ChevronLeftIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StrategyBoard from '../../shared/Strategy/StrategyBoard';
import ContentKanban from '../../shared/Kanban/ContentKanban';
import UnifiedCalendar from '../../calendar/UnifiedCalendar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';

export default function CMWorkstationLayout() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'dashboard';

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [clientTasks, setClientTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [loading, setLoading] = useState(true);
    const [squad, setSquad] = useState([]);
    const [loadingSquad, setLoadingSquad] = useState(false);
    const [globalTasks, setGlobalTasks] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
        
        if (user) {
            if (user.full_name) {
                fetchClients();
                if (user.team_id) fetchSquad(user.team_id);
            } else {
                setLoading(false);
            }
        }
    }, [searchParams, user]);

    const fetchSquad = async (teamId) => {
        setLoadingSquad(true);
        try {
            const data = await agencyService.getTeamByLead(teamId);
            if (data) setSquad(data);
        } catch (err) {
            console.error('Error fetching squad:', err);
        } finally {
            setLoadingSquad(false);
        }
    };

    const fetchClientTasks = async (clientId) => {
        setLoadingTasks(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('client', clientId);
            
            if (data) setClientTasks(data);
        } catch (err) {
            console.error('Error fetching client tasks:', err);
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (selectedClient) {
            fetchClientTasks(selectedClient.id);
        }
    }, [selectedClient]);

    const fetchClients = async () => {
        if (!user?.full_name) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('cm', user.full_name);
        
        if (data) setClients(data);
        setLoading(false);
    };

    const fetchAllTasks = async () => {
        if (clients.length === 0) return;
        setLoadingTasks(true);
        const clientNames = clients.map(c => c.name);
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .in('client', clientNames)
            .order('created_at', { ascending: false });
        
        if (data) setGlobalTasks(data);
        setLoadingTasks(false);
    };


    useEffect(() => {
        if (activeTab === 'tasks') fetchAllTasks();
    }, [activeTab, clients]);

    const menuItems = selectedClient ? [
        { id: 'dashboard', label: 'Dashboard Cliente', icon: LayoutDashboard },
        { id: 'projects', label: 'Proyectos', icon: FolderOpen },
        { id: 'contents', label: 'Contenidos (Kanban)', icon: LayoutDashboard },
        { id: 'chat', label: 'Centro de Comunicación', icon: MessageSquare },
        { id: 'meta', label: 'Módulo Meta (Ads)', icon: BarChart3 },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'strategy', label: 'Pizarra Estratégica', icon: Share2 },
        { id: 'team', label: 'Equipo Asignado', icon: Palette },
        { id: 'reports', label: 'Generador de Reportes', icon: FileText },
    ] : [
        { id: 'dashboard_cm', label: 'Dashboard CM', icon: LayoutDashboard },
        { id: 'clients', label: 'Empresas', icon: Users },
        { id: 'tasks', label: 'Mis Tareas', icon: Edit3 },
    ];

    if (!loading && (!user || (user.role !== 'COMMUNITY' && user.role !== 'CM'))) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#050511] text-white p-10 text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Acceso Denegado</h1>
                <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium">Debes iniciar sesión con tu cuenta de Estratega para acceder a esta área.</p>
                <button 
                    onClick={() => window.location.href = '/login'}
                    className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all shadow-2xl shadow-white/5"
                >
                    Ir al Inicio de Sesión
                </button>
            </div>
        );
    }

    const isFullWidthTab = activeTab === 'academy' || activeTab === 'growth';

    return (
        <div className="flex h-full bg-[#050511] overflow-hidden">
            {!isFullWidthTab && (
                <div className="w-64 bg-[#0E0E18] border-r border-white/5 flex flex-col shrink-0">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                                {selectedClient ? selectedClient.name.charAt(0) : 'CM'}
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-sm truncate max-w-[120px]">
                                    {selectedClient ? selectedClient.name : 'Workstation CM'}
                                </h2>
                                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{user?.full_name || 'Estratega'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 py-4 px-3 space-y-1">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id
                                    ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/5 bg-cyan-950/20 mt-auto">
                        {selectedClient && (
                            <button
                                onClick={() => { setSelectedClient(null); setActiveTab('clients'); }}
                                className="w-full mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                            >
                                &larr; Cambiar Cliente
                            </button>
                        )}
                        <p className="text-[10px] text-cyan-400 font-bold uppercase mb-2">Objetivo del Rol</p>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                            "Que {user?.full_name?.split(' ')[0] || 'el estratega'} no edite, no diseñe, pero controle, organice, revise y haga que todo fluya."
                        </p>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {renderContent(activeTab, selectedClient, setSelectedClient, setActiveTab, clients, loading, clientTasks, loadingTasks, user, squad, globalTasks)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function renderContent(tab, selectedClient, setSelectedClient, setActiveTab, clients, loading, clientTasks, loadingTasks, user, squad, globalTasks) {
    if (!selectedClient) {
        if (tab === 'dashboard_cm') return <CMOverviewDashboard clients={clients} loading={loading} />;
        if (tab === 'academy') return <CMAcademy />;
        if (tab === 'growth') return <CMGrowth />;
        if (tab === 'tasks') return <GlobalTasksView tasks={globalTasks} loading={loadingTasks} onSelectClient={(c) => { setSelectedClient(c); setActiveTab('dashboard'); }} />;
        
        return (
            <CMSettingsClients 
                clients={clients} 
                loading={loading}
                userMissingProfile={user && !user.full_name}
                onSelectClient={(client) => { 
                    setSelectedClient(client); 
                    setActiveTab('dashboard'); 
                }} 
            />
        );
    }

    switch (tab) {
        case 'dashboard': return <CMDashboard client={selectedClient} user={user} />;
        case 'projects': return <CMProjects client={selectedClient} tasks={clientTasks} loading={loadingTasks} />;
        case 'contents': return <ContentKanban role="cm" />;
        case 'chat': return <CommunicationCenter client={selectedClient} squad={squad} />;
        case 'meta': return <MetaAdsModule client={selectedClient} />;
        case 'calendar': return <UnifiedCalendar role="cm" />;
        case 'strategy': return <StrategyBoard role="cm" onClose={() => setActiveTab('dashboard')} />;
        case 'team': return <TeamView client={selectedClient} tasks={clientTasks} squad={squad} />;
        case 'reports': return <CMReports client={selectedClient} />;
        case 'academy': return <CMAcademy />;
        case 'growth': return <CMGrowth />;
        default: return <CMDashboard client={selectedClient} />;
    }
}

function CMDashboard({ client, user }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard title="Proyectos" value="12" sub="Activos" icon={FolderOpen} color="text-cyan-400" />
                <StatCardMini title="Pendientes" value="5" color="text-orange-400" icon={Clock} />
                <StatCardMini title="Para Revisión" value="3" color="text-purple-400" icon={Eye} />
                <StatCardMini title="Urgente" value="1" color="text-red-400" icon={AlertTriangle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" /> Checklist Operativo
                    </h3>
                    <div className="space-y-4">
                        <CheckItem label="Revisar material recibido (videos/fotos)" completed={false} />
                        <CheckItem label="Enviar instrucciones a editores" completed={true} />
                        <CheckItem label="Confirmar fechas de publicación" completed={false} />
                        <CheckItem label="Verificar reporte de métricas semanal" completed={false} />
                        <CheckItem label="Escalar leads importantes a Ventas" completed={false} />
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-400" /> Actividad Reciente
                    </h3>
                    <div className="space-y-4">
                        <ActivityItem text="Andrés Vera subió 'Reel Pro Clínica RM'" time="Hace 10 min" />
                        <ActivityItem text={`${user?.full_name?.split(' ')[0] || 'CM'} aprobó 'Video Intro Branding'`} time="Hace 2h" />
                        <ActivityItem text="Mateo G. reportó 'Grabación Completada'" time="Ayer" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CMProjects({ client, tasks, loading }) {
    const [selectedProject, setSelectedProject] = useState(null);

    if (loading) return <div className="h-full flex items-center justify-center text-cyan-400 italic font-bold">Cargando proyectos reales de Supabase...</div>;

    if (selectedProject) {
        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedProject(null)} className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1">
                    &larr; Volver a Proyectos
                </button>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                            <p className="text-sm text-gray-500 uppercase">{selectedProject.format || 'Proyecto'}</p>
                        </div>
                        <span className="px-4 py-1.5 bg-cyan-600/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
                            {selectedProject.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <FolderCard name="/Videos" count="Material de Origen" icon={Eye} color="text-indigo-400" />
                        <FolderCard name="/Fotos" count="Recursos" icon={Palette} color="text-pink-400" />
                        <FolderCard name="/Assets" count="Archivos Finales" icon={Plus} color="text-emerald-400" />
                    </div>

                    <div 
                        onClick={() => alert('Abriendo panel de carga de material...\nSoporte para: .mp4, .png, .mp3')}
                        className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center group hover:border-cyan-500/50 transition-all cursor-pointer bg-white/[0.01]"
                    >
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-gray-500 group-hover:text-cyan-400" />
                        </div>
                        <p className="text-white font-bold mb-1">Subir Material Nuevo</p>
                        <p className="text-xs text-gray-500">Arrastra aquí tus archivos (.mp4, .png, .mp3)</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Proyectos Asignados</h3>
                <button 
                    onClick={() => alert('Abriendo asistente de creación de proyectos...') }
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-600/20"
                >
                    <Plus className="w-4 h-4" /> Nuevo Proyecto
                </button>
            </div>

            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 italic uppercase text-xs tracking-widest">No hay proyectos activos para este cliente.</div>
                ) : (
                    tasks.map((p, i) => (
                        <div key={i} onClick={() => setSelectedProject(p)} className="p-6 flex items-center justify-between hover:bg-white/[0.02] border-b border-white/5 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400">
                                    <FolderOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{p.title}</h4>
                                    <p className="text-xs text-gray-500 uppercase">{p.format || 'Tarea'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Responsable</p>
                                    <p className="text-xs text-white font-bold uppercase">{p.assigned_role}</p>
                                </div>
                                <div className="w-32">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>
                                <MoreHorizontal className="w-5 h-5 text-gray-600 group-hover:text-white" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function FolderCard({ name, count, icon: Icon, color }) {
    return (
        <div 
            onClick={() => alert(`Abriendo recursos en carpeta: ${name}`)}
            className="bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer group"
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h5 className="text-white font-bold text-sm">{name}</h5>
                    <p className="text-[10px] text-gray-500 font-bold">{count}</p>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ title, value, sub, icon: Icon, color }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-600 text-xs font-medium">{sub}</p>
        </div>
    );
}

function StatCardMini({ title, value, icon: Icon, color }) {
    return (
        <div 
            onClick={() => alert(`Filtrando dashboard por estado: ${title}`)}
            className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all cursor-pointer"
        >
            <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{title}</p>
                <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
            </div>
            <Icon className={`w-8 h-8 ${color} opacity-20 group-hover:opacity-40 transition-opacity`} />
        </div>
    );
}

function CheckItem({ label, completed }) {
    return (
        <div 
            onClick={() => alert(`Protocolo Operativo: ${label}\nEstado actualizado exitosamente.`)}
            className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer"
        >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${completed ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                {completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={`text-sm ${completed ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
        </div>
    );
}

function ActivityItem({ text, time }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
            <div>
                <p className="text-sm text-gray-300">{text}</p>
                <p className="text-[10px] text-gray-500 font-bold">{time}</p>
            </div>
        </div>
    );
}

function CreativeCoordination() {
    return (
        <div className="space-y-12">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">Instrucciones & Coordinación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RoleTaskCard
                        role="Editor de Video"
                        staff="Andrés Vera"
                        tasks={["Ajustar color en Reel #4", "Subtitulado dinámico", "Exportar 9:16"]}
                        color="border-purple-500/30"
                    />
                    <RoleTaskCard
                        role="Diseñador"
                        staff="Mateo G."
                        tasks={["Portada para YouTube", "Grillas de Instagram", "Assets para Stories"]}
                        color="border-cyan-500/30"
                    />
                    <RoleTaskCard
                        role="Filmmaker"
                        staff="Kevin R."
                        tasks={["Sesión Clínica RM", "B-Roll Restaurante", "Entrevista Fundadora"]}
                        color="border-orange-500/30"
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Centro de Tickets (Visión Creativo)</h3>
                        <p className="text-xs text-gray-500 italic">Mensajes filtrados antes de llegar al workstation creativo.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[
                        { client: 'Clínica Dental', ctx: 'Edición de video', msg: '¿Podemos cambiar la música del reel #4?', priority: 'Urgente', staff: 'Andrés V.' },
                        { client: 'Inmobiliaria City', ctx: 'Diseño', msg: 'Favor usar el nuevo logo en la portada.', priority: 'Normal', staff: 'Mateo G.' },
                    ].map((ticket, i) => (
                        <div key={i} className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex gap-6 hover:border-cyan-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 shrink-0">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{ticket.client}</h4>
                                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{ticket.ctx}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${ticket.priority === 'Urgente' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-gray-400'}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4 bg-white/[0.02] p-3 rounded-xl border border-white/5 italic">"{ticket.msg}"</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); alert('Abriendo chat de respuesta rápida...'); }}
                                        className="flex-1 py-2 bg-cyan-600 rounded-lg text-[10px] font-bold text-white hover:bg-cyan-500"
                                    >
                                        RESPONDER
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); alert('Convirtiendo ticket en tarea para el equipo...'); }}
                                        className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white"
                                    >
                                        CONVERTIR EN TAREA
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); alert('Escalando ticket como alerta estratégica por posible riesgo...'); }}
                                        className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-orange-400 transition-colors"
                                    >
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function RoleTaskCard({ role, staff, tasks, color }) {
    return (
        <div className={`bg-[#0E0E18] border ${color} rounded-2xl p-6 hover:translate-y-[-4px] transition-all`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-white font-bold">{role}</h4>
                    <p className="text-xs text-cyan-400 font-bold">{staff}</p>
                </div>
                <Palette className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-3">
                {tasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-4 h-4 rounded border border-white/20" />
                        <span className="text-xs text-gray-300">{t}</span>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => alert(`Enviando reporte de feedback a ${staff} vía WhatsApp...`)}
                className="w-full mt-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
            >
                Enviar Feedback (WhatsApp)
            </button>
        </div>
    );
}

function CommunicationCenter({ client, squad }) {
    const [subTab, setSubTab] = useState('ia');
    const [showContextModal, setShowContextModal] = useState(false);

    const tabs = [
        { id: 'ia', label: 'Asistente IA', icon: Bot },
        { id: 'empresa', label: 'Chat Empresa / Marca', icon: MessageSquare },
        { id: 'team', label: 'Mi Equipo', icon: Palette },
    ];

    return (
        <div className="h-full flex flex-col bg-[#0E0E18] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="flex p-2 bg-white/[0.02] border-b border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSubTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all font-bold text-xs ${subTab === tab.id
                            ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={subTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 overflow-y-auto custom-scrollbar p-6"
                    >
                        {subTab === 'ia' && <AIChatView />}
                        {subTab === 'empresa' && <EnterpriseChatView client={client} />}
                        {subTab === 'team' && <TeamChatView client={client} squad={squad} onSend={() => setShowContextModal(true)} />}
                    </motion.div>
                </AnimatePresence>

                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                    <div className="relative">
                        <input
                            placeholder="Escribe un mensaje..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all pr-12"
                        />
                        <button
                            onClick={() => setShowContextModal(true)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {showContextModal && (
                <MessageContextModal onClose={() => setShowContextModal(false)} />
            )}
        </div>
    );
}

function AIChatView() {
    const { user } = useAuth();
    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 shrink-0">
                    <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-4 max-w-[85%]">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 rounded-tl-none backdrop-blur-md">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            ¡Hola, {user?.full_name?.split(' ')[0] || 'Estratega'}! Soy tu **Estratega IA**. He analizado los datos y observo un flujo constante en la producción. 
                            <br /><br />
                            Recuerda que esta es tu zona de control: aquí organizamos la estrategia directa con la marca. ¿Quieres que redacte un reporte rápido de desempeño para enviar al cliente ahora mismo?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <button 
                            onClick={() => alert('IA Estratégica: Generando reporte de desempeño semanal...')}
                            className="text-left px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-[11px] text-cyan-400 font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-between group"
                        >
                            <span>"Generar reporte de desempeño semanal"</span>
                            <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => alert('IA Estratégica: Consultando estado de ediciones en DIIC Cloud...')}
                            className="text-left px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-gray-400 font-bold hover:text-white transition-all flex items-center justify-between group"
                        >
                            <span>"¿Cuál es el estado de los videos en edición?"</span>
                            <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EnterpriseChatView({ client }) {
    const { user } = useAuth();
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full" />
                <MessageSquare className="w-10 h-10 text-cyan-400 relative z-10" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2 italic">Portal de Comunicación Directa</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mb-4">Canal Privado con {client.name}</p>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full inline-flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{user?.full_name?.split(' ')[0] || 'CM'} Online</span>
                </div>
            </div>
            <p className="text-[11px] text-gray-600 max-w-xs text-center leading-relaxed">
                Aquí es donde {user?.full_name?.split(' ')[0] || 'el CM'} se comunica directamente con la marca para coordinar la ejecución estratégica.
            </p>
        </div>
    );
}

function TeamChatView({ client, squad, onSend }) {
    const team = (squad && squad.length > 0) ? squad.map(m => ({
        name: m.name,
        role: m.role,
        status: m.status || 'Disponible',
        avatar: m.name.split(' ').map(n => n[0]).join('').toUpperCase()
    })) : [
        { name: 'Cargando equipo...', role: 'No asignado', status: '-', avatar: '?' }
    ];

    return (
        <div className="space-y-8">
            <div className="flex gap-4 border-b border-white/5 pb-6">
                <button 
                    onClick={() => alert('Abriendo Chat General del Proyecto')}
                    className="flex-1 p-4 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl text-center group hover:bg-cyan-600/20 transition-all"
                >
                    <h4 className="text-xs font-bold text-cyan-400 mb-1">Chat General</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Proyecto Completo</p>
                </button>
                <button 
                    onClick={() => alert('Filtrando Chat por Departamentos')}
                    className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-center group hover:bg-white/10 transition-all"
                >
                    <h4 className="text-xs font-bold text-white mb-1">Departamentos</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Ej: Video / Diseño</p>
                </button>
            </div>

            <div>
                <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Chat Directo con el Equipo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {team.map(m => (
                        <div key={m.name} className="p-5 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:border-cyan-500/30 transition-all group cursor-pointer relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">{m.avatar}</div>
                                <div className="flex-1">
                                    <h5 className="text-sm font-bold text-white">{m.name}</h5>
                                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{m.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-bold uppercase text-gray-500">
                                <span className={m.status === 'Disponible' ? 'text-emerald-400' : 'text-orange-400'}>● {m.status}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); alert(`Visualizando hoja de vida y KPIs de ${m.name}...`); }}
                                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={onSend} className="p-2 bg-cyan-600 rounded-lg text-white hover:bg-cyan-500"><Send className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                    <span className="text-orange-400 font-bold">REGLA DE SEGURIDAD:</span> El cliente no ve datos financieros ni contratos. Los creativos no obtienen el número directo si el modo controlado está activo.
                </p>
            </div>
        </div>
    );
}

function MessageContextModal({ onClose }) {
    const { user } = useAuth();
    const contexts = [
        { id: 'proj', label: 'Proyecto', icon: FolderOpen },
        { id: 'task', label: 'Tarea', icon: CheckCircle2 },
        { id: 'video', label: 'Edición de Video', icon: Eye },
        { id: 'design', label: 'Diseño', icon: Palette },
        { id: 'meeting', label: 'Reunión', icon: Calendar },
        { id: 'payment', label: 'Pago / Cotización', icon: BarChart3 },
        { id: 'general', label: 'Consulta General', icon: MessageSquare },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-white/5">
                    <h3 className="text-2xl font-bold text-white mb-2">¿Sobre qué es este mensaje?</h3>
                    <p className="text-gray-500 text-sm italic">Para que no sea caos, el CM necesita contexto antes de enviar.</p>
                </div>

                <div className="p-8 grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {contexts.map(ctx => (
                        <button
                            key={ctx.id}
                            onClick={() => alert(`Contexto seleccionado: ${ctx.label}\nEsto ayudará al equipo a entender mejor tu mensaje.`)}
                            className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-cyan-600/10 hover:border-cyan-500/30 transition-all text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-cyan-400 transition-colors">
                                <ctx.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{ctx.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-8 bg-white/[0.02] flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 text-xs font-bold text-gray-500 hover:text-white transition-colors">Cancelar</button>
                    <button 
                        onClick={() => { alert('¡Mensaje enviado con éxito al equipo!'); onClose(); }}
                        className="flex-[2] py-4 bg-cyan-600 rounded-2xl text-xs font-bold text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 transition-all"
                    >
                        CONFIRMAR & ENVIAR
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function TeamView({ client, tasks, squad }) {
    const roles = [
        { id: 'editor', name: 'Editor de Video', avatar: 'ED' },
        { id: 'designer', name: 'Diseñador', avatar: 'DS' },
        { id: 'filmmaker', name: 'Filmmaker/Ph', avatar: 'FK' }
    ];

    const getSquadMemberByRole = (roleName) => {
        if (!squad) return null;
        return squad.find(m => m.role.toLowerCase().includes(roleName.toLowerCase()));
    };

    return (
        <div className="space-y-12">
            <div>
                <h3 className="text-3xl font-bold text-white mb-2">Equipo Asignado</h3>
                <p className="text-gray-500 italic mb-8">Monitorea el progreso de los creativos para {client.name}.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roles.map((role) => {
                        const member = getSquadMemberByRole(role.id === 'editor' ? 'Editor' : role.id === 'designer' ? 'Diseñador' : 'Filmmaker');
                        const roleTasks = tasks.filter(t => t.assigned_role === role.id);
                        const completedTasks = roleTasks.filter(t => t.status === 'completed').length;
                        const progress = roleTasks.length > 0 ? (completedTasks / roleTasks.length) * 100 : 0;
                        
                        return (
                            <div key={role.id} className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 hover:border-cyan-500/30 transition-all group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                        {member ? member.name.split(' ').map(n=>n[0]).join('') : role.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{member ? member.name : role.name}</h4>
                                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{member ? member.role : role.name}</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{roleTasks.length} Tareas Asignadas</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                                            <span className="text-gray-500">Progreso del Plan</span>
                                            <span className="text-cyan-400">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-3">Tareas Recientes</p>
                                        <div className="space-y-2">
                                            {roleTasks.slice(0, 3).map((t, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-400">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                                    <span className="truncate">{t.title}</span>
                                                </div>
                                            ))}
                                            {roleTasks.length === 0 && <p className="text-[10px] text-gray-600 italic">Sin tareas asignadas aún.</p>}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => alert(`Enviando feedback a ${member ? member.name : role.name}...`)}
                                    className="w-full mt-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest"
                                >
                                    Enviar Feedback
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <CreativeCoordination />
        </div>
    );
}

function CMOverviewDashboard({ clients, loading }) {
    const { user } = useAuth();
    const stats = [
        { label: 'Contenidos Activos', value: clients.reduce((acc, c) => acc + (c.projects || 0), 0).toString(), icon: FileText, color: 'text-cyan-400' },
        { label: 'Campañas en Curso', value: '3', icon: Share2, color: 'text-purple-400' },
        { label: 'Marcas Activas', value: clients.filter(c => c.status === 'active').length.toString(), icon: ShieldCheck, color: 'text-emerald-400' },
        { label: 'Alertas de Hoy', value: '2', icon: AlertTriangle, color: 'text-red-400' },
    ];

    if (loading) return <div className="h-full flex items-center justify-center text-cyan-400 italic font-bold">Sincronizando con Admin HQ...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">¡Hola, {user?.full_name?.split(' ')[0] || 'Estratega'}!</h2>
                    <p className="text-gray-500 italic">Aquí tienes el pulso general de tus {clients.length} marcas asignadas.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-balance">Limit: {clients.length}/10 Clientes Capacidad</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[#0E0E18] border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all">
                        <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                        <h4 className="text-3xl font-bold text-white mb-1">{stat.value}</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold text-white">Alertas Prioritarias</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xs italic">AD</div>
                            <div>
                                <p className="text-sm font-bold text-white">Anuncio Pausado: Clínica Dental RM</p>
                                <p className="text-[10px] text-gray-500 italic">Motivo: Presupuesto agotado en campaña "Limpieza 50%"</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => alert('Abriendo panel de resolución de anuncios...')}
                            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                            Gestionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetaAdsModule({ client }) {
    const [ads, setAds] = useState([
        { 
            id: 1, name: 'Campaña Limpieza', status: 'Activo', budget: '$450/mo',
            metrics: { reach: '12.4K', clicks: 840, leads: 12 },
            advanced: { ctr: '2.4%', cpc: '$0.54', roas: '4.2x', cpm: '$8.20', watchTime: '18s', cpl: '$3.50' },
            activeAdvanced: [] 
        },
        { 
            id: 2, name: 'Blanqueamiento PRO', status: 'Pausado', budget: '$200/mo',
            metrics: { reach: '5.2K', clicks: 120, leads: 3 },
            advanced: { ctr: '1.2%', cpc: '$1.10', roas: '2.1x', cpm: '$12.50', watchTime: '8s', cpl: '$15.20' },
            activeAdvanced: [] 
        },
    ]);

    const [showSelectorFor, setShowSelectorFor] = useState(null);

    const AVAILABLE_METRICS = [
        { id: 'ctr', label: 'CTR', color: 'text-indigo-400' },
        { id: 'cpc', label: 'CPC', color: 'text-emerald-400' },
        { id: 'roas', label: 'ROAS', color: 'text-purple-400' },
        { id: 'cpm', label: 'CPM', color: 'text-amber-400' },
        { id: 'watchTime', label: 'Avg. Watch', color: 'text-rose-400' },
        { id: 'cpl', label: 'CPL', color: 'text-cyan-400' },
    ];

    const toggleMetric = (adId, metricId) => {
        setAds(prev => prev.map(ad => {
            if (ad.id === adId) {
                const isAlreadyActive = ad.activeAdvanced.includes(metricId);
                return {
                    ...ad,
                    activeAdvanced: isAlreadyActive 
                        ? ad.activeAdvanced.filter(m => m !== metricId)
                        : [...ad.activeAdvanced, metricId]
                };
            }
            return ad;
        }));
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Módulo Meta (Ads)</h2>
                    <p className="text-gray-500 italic">Monitorea y optimiza la pauta de {client.name}.</p>
                </div>
                <button 
                    onClick={() => alert('Sincronizando con Meta Business Manager API...')}
                    className="px-6 py-3 bg-cyan-600 rounded-2xl text-[11px] font-bold text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20"
                >
                    SINCRONIZAR BUSINESS MANAGER
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {ads.map(ad => (
                    <div key={ad.id} className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 hover:border-cyan-500/20 transition-all relative">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${ad.status === 'Activo' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                                <div>
                                    <h4 className="text-xl font-bold text-white">{ad.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ad.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Presupuesto</p>
                                <p className="text-xl font-bold text-white">{ad.budget}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-stretch">
                            <div className="flex-1 min-w-[120px] p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Alcance</p>
                                <p className="text-lg font-bold text-white">{ad.metrics.reach}</p>
                            </div>
                            <div className="flex-1 min-w-[120px] p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Clics</p>
                                <p className="text-lg font-bold text-white">{ad.metrics.clicks}</p>
                            </div>
                            <div className="flex-1 min-w-[120px] p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Leads</p>
                                <p className="text-lg font-bold text-white">{ad.metrics.leads}</p>
                            </div>

                            {ad.activeAdvanced.map(mId => {
                                const metricInfo = AVAILABLE_METRICS.find(m => m.id === mId);
                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={mId} 
                                        className="flex-1 min-w-[120px] p-4 bg-cyan-600/5 rounded-2xl border border-cyan-500/10 text-center relative group"
                                    >
                                        <p className={`text-[10px] font-bold uppercase mb-1 ${metricInfo.color}`}>{metricInfo.label}</p>
                                        <p className="text-lg font-bold text-white">{ad.advanced[mId]}</p>
                                        <button 
                                            onClick={() => toggleMetric(ad.id, mId)}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-[#050511] border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-rose-500"
                                        >
                                            <X className="w-3 h-3 text-rose-500" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowSelectorFor(showSelectorFor === ad.id ? null : ad.id)}
                                        className={`w-full h-full aspect-square min-w-[56px] rounded-2xl border transition-all flex items-center justify-center ${showSelectorFor === ad.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400'}`}
                                    >
                                        {showSelectorFor === ad.id ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                    </button>

                                    <AnimatePresence>
                                        {showSelectorFor === ad.id && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute bottom-full mb-4 right-0 z-50 bg-[#161625] border border-white/10 rounded-3xl p-4 shadow-2xl min-w-[200px]"
                                            >
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2 italic">Métricas de Estratega</p>
                                                <div className="space-y-1">
                                                    {AVAILABLE_METRICS.map(m => (
                                                        <button
                                                            key={m.id}
                                                            onClick={() => toggleMetric(ad.id, m.id)}
                                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${ad.activeAdvanced.includes(m.id) ? 'bg-cyan-600/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                                                        >
                                                            <span className="text-[11px] font-bold">{m.label}</span>
                                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${ad.activeAdvanced.includes(m.id) ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-white/10 bg-white/5'}`}>
                                                                {ad.activeAdvanced.includes(m.id) && <Check className="w-3 h-3" />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div 
                                    onClick={() => alert('IA Meta Optimizer: Aplicando ajustes de presupuesto sugeridos...')}
                                    className="flex-1 min-w-[160px] p-4 bg-cyan-600/10 rounded-2xl border border-cyan-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-cyan-600/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Zap className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-cyan-400 font-bold uppercase">Optimizar</p>
                                    </div>
                                    <p className="text-[9px] text-cyan-400/60 italic">IA Sugiere: +5% Presupuesto</p>
                                </div>
                            </div>
                        </div>
                ))}
            </div>

            <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl italic text-[11px] text-indigo-400 font-medium flex items-center gap-3">
                <span className="text-lg">💡</span>
                <p>
                    <strong>Estrategia CM:</strong> Los leads de "Campaña Limpieza" están costando $2 menos que el promedio. Considera mover presupuesto orgánico a este anuncio.
                </p>
            </div>
        </div>
    );
}

function CMReports({ client }) {
    const { user } = useAuth();
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Reportes Automáticos</h2>
                    <p className="text-gray-500 italic">{user?.full_name || 'Estratega'}, genera reportes visuales y compártelos por WhatsApp en un clic.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 group hover:border-cyan-500/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Reporte Semanal de Rendimiento</h4>
                    <p className="text-xs text-gray-500 mb-6 italic">Métricas de alcance, interacción y mejores contenidos de los últimos 7 días.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => alert('Generando Reporte Semanal en PDF...')}
                            className="flex-1 py-3 bg-cyan-600 rounded-xl text-[10px] font-bold text-white hover:bg-cyan-500 transition-all"
                        >
                            GENERAL PDF
                        </button>
                        <button 
                            onClick={() => alert('Preparando Reporte para enviar por WhatsApp...')}
                            className="flex-1 py-3 bg-emerald-600 rounded-xl text-[10px] font-bold text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-3.5 h-3.5" /> WHATSAPP
                        </button>
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 group hover:border-purple-500/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Reporte de Auditoría de Pauta</h4>
                    <p className="text-xs text-gray-500 mb-6 italic">Desglose de inversión, CPC, CTR y retorno de inversión esperado.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => alert('Generando Auditoría de Pauta en PDF...')}
                            className="flex-1 py-3 bg-purple-600 rounded-xl text-[10px] font-bold text-white hover:bg-purple-500 transition-all"
                        >
                            GENERAL PDF
                        </button>
                        <button 
                            onClick={() => alert('Enviando Auditoría de Pauta al cliente vía WhatsApp...')}
                            className="flex-1 py-3 bg-emerald-600 rounded-xl text-[10px] font-bold text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-3.5 h-3.5" /> WHATSAPP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CMSettingsClients({ clients, onSelectClient, loading, userMissingProfile }) {
    const { user } = useAuth();
    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="relative">
                 <div className="w-16 h-16 rounded-full border-t-2 border-cyan-500 animate-spin" />
                 <Database className="absolute inset-0 m-auto w-6 h-6 text-cyan-500/50" />
            </div>
            <div className="text-center">
                <p className="text-cyan-400 italic font-bold text-sm tracking-widest uppercase animate-pulse">Conectando con DIIC ADMIN...</p>
                <p className="text-[10px] text-gray-600 mt-2 font-black uppercase tracking-widest">Sincronizando Protocolos de Seguridad</p>
            </div>
        </div>
    );

    if (userMissingProfile) return (
        <div className="h-full flex flex-col items-center justify-center gap-8 p-10 bg-red-500/5 border border-red-500/10 rounded-[3rem] text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500">
                <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">ERROR DE SINCRONIZACIÓN</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Tu cuenta no tiene un **Nombre de Perfil** configurado. El sistema no puede asignar empresas sin una identidad válida.
                    <br /><br />
                    <span className="text-red-400 font-bold">ACCIÓN REQUERIDA:</span> Contacta con el Administrador para activar el perfil y vincular tus proyectos.
                </p>
            </div>
        </div>
    );

    if (clients.length === 0) return (
        <div className="h-full flex flex-col items-center justify-center gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-gray-600">
                <Users className="w-10 h-10" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">SIN EMPRESAS ASIGNADAS</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                    No tienes ninguna empresa vinculada a tu perfil de Estratega actualmente.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Empresas Asignadas</h2>
                <p className="text-gray-500 italic">{user?.full_name || 'Estratega'}, selecciona una empresa para comenzar a sincronizar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <motion.div
                        key={client.id}
                        whileHover={{ y: -5 }}
                        onClick={() => onSelectClient(client)}
                        className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 cursor-pointer group hover:border-cyan-500/30 transition-all shadow-2xl relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-bold tracking-widest uppercase ${client.priority === 'ALTA' ? 'bg-red-500/10 text-red-500' :
                            client.priority === 'MEDIA' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-gray-500/10 text-gray-500'
                            }`}>
                            Prioridad {client.priority}
                        </div>

                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                            {client.name.charAt(0)}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${client.status === 'active' ? 'text-emerald-400' : 'text-gray-500'}`}>
                            ● {client.status === 'active' ? 'Activo' : 'En Pausa'}
                        </p>
                        <p className="text-[9px] text-cyan-400/60 font-black uppercase tracking-widest mb-6 italic">{client.plan || 'Sin Plan Asignado'}</p>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Archivos</p>
                                <p className="text-white font-bold">{client.projects || 0}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Publicación</p>
                                <p className="text-white font-bold text-xs truncate">{client.nextPost || 'Pendiente'}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between text-cyan-400 font-bold text-xs group-hover:translate-x-2 transition-all">
                            Gestionar Estrategia <ChevronRightIcon className="w-4 h-4" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function CMAcademy() {
    const [selectedModule, setSelectedModule] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const handleStartModule = (mod) => {
        setSelectedModule(mod);
        console.log(`Accediendo a: ${mod.title}`);
    };

    const categories = [
        { id: 'all', label: 'Todo', icon: GraduationCap },
        { id: 'strategy', label: 'Mente Maestra', icon: Brain, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { id: 'content', label: 'Factor Creativo', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { id: 'ops', label: 'Control Maestro', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ];

    const modules = [
        {
            id: 1,
            category: 'strategy',
            title: "Ingeniería de Retención",
            focus: "Viral Mastery",
            level: "Master",
            desc: "Cómo retener al usuario en los primeros 3 segundos y mantener la atención hasta el CTA final.",
            icon: Target,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20",
            bullets: ["Hooks Psicológicos", "Curva de Interés", "Optimización de Watchtime"]
        },
        {
            id: 2,
            category: 'strategy',
            title: "Arquitectura de Pauta",
            focus: "Meta Ads Elite",
            level: "Expert",
            desc: "Diseño de campañas que no solo gastan presupuesto, sino que construyen autoridad y ventas escalables.",
            icon: BarChart3,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20",
            bullets: ["Audiencias Premium", "Escalado Horizontal", "Creative Testing"]
        },
        {
            id: 4,
            category: 'content',
            title: "Narrativas de Autoridad",
            focus: "Storytelling",
            level: "Master",
            desc: "Convierte cualquier marca en un referente mediante historias que conectan con el dolor y deseo del cliente.",
            icon: PenTool,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            border: "border-purple-400/20",
            bullets: ["Estructura de Tres Actos", "Tone of Voice Elite", "Copywriting de Conversión"]
        },
    ];

    const filteredModules = activeCategory === 'all' 
        ? modules 
        : modules.filter(m => m.category === activeCategory);

    if (selectedModule) {
        return <ModulePlayer module={selectedModule} onBack={() => setSelectedModule(null)} />;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 bg-[#0E0E18] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <GraduationCap className="w-48 h-48 text-cyan-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full mb-6">
                            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Estratega Elite v2</span>
                        </div>
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-[0.9]">
                            Academia de <br /> <span className="text-cyan-400">Maestría CM</span>
                        </h2>
                        <p className="text-gray-500 italic max-w-sm font-medium text-sm">
                            Tu centro de mando para dominar la pauta, el contenido y la gestión operativa sin tocar un software de edición.
                        </p>
                    </div>
                </div>

                <div className="bg-[#0E0E18] p-8 rounded-[3rem] border border-white/5 flex flex-col justify-center items-center text-center group">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Tu Nivel Actual</p>
                    <div className="w-20 h-20 rounded-3xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                        <Award className="w-10 h-10" />
                    </div>
                    <p className="text-2xl font-black text-white italic uppercase tracking-tighter">Estratega Pro II</p>
                    <div className="mt-4 px-4 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                        750 / 2500 XP
                    </div>
                </div>

                <div className="bg-cyan-600 p-8 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-125 transition-transform duration-700">
                        <Brain className="w-40 h-40" />
                    </div>
                    <div>
                        <p className="text-[10px] text-cyan-100 font-black uppercase tracking-widest mb-1">Módulos</p>
                        <p className="text-4xl font-black italic">3<span className="text-xl opacity-60 ml-2">/ 9</span></p>
                    </div>
                    <button 
                        onClick={() => handleStartModule("Curso de Maestría CM")}
                        className="w-full py-4 bg-white text-cyan-600 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all"
                    >
                        Continuar Curso
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/5 w-fit">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
                            px-6 py-3 rounded-2xl flex items-center gap-3 transition-all
                            ${activeCategory === cat.id 
                                ? 'bg-white text-black font-black' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5 font-bold'}
                        `}
                    >
                        <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-black' : cat.color}`} />
                        <span className="text-xs uppercase tracking-tight">{cat.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                <AnimatePresence mode="popLayout">
                    {filteredModules.map((mod, idx) => (
                        <motion.div
                            key={mod.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -10 }}
                            className="bg-[#0E0E18] border border-white/5 rounded-[3rem] p-10 group hover:border-white/20 transition-all relative overflow-hidden flex flex-col"
                        >
                            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all group-hover:scale-110 ${mod.color}`}>
                                <mod.icon className="w-32 h-32" />
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={`w-14 h-14 rounded-[1.4rem] ${mod.bg} flex items-center justify-center ${mod.color} shadow-xl`}>
                                    <mod.icon className="w-7 h-7" />
                                </div>
                                <div className={`px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest ${mod.color}`}>
                                    {mod.level}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter leading-tight relative z-10">{mod.title}</h3>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${mod.color} relative z-10`}>{mod.focus}</p>
                            <p className="text-sm text-gray-500 leading-relaxed font-bold mb-8 italic relative z-10 line-clamp-3">"{mod.desc}"</p>

                            <div className="space-y-3 mb-10 mt-auto relative z-10">
                                {mod.bullets.map((b, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${mod.bg.replace('/10', '/60')}`} />
                                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">{b}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleStartModule(mod)}
                                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${mod.border} ${mod.color} hover:bg-white hover:text-black hover:border-white shadow-xl relative z-10`}
                            >
                                Comenzar Módulo
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function GlobalTasksView({ tasks, loading, onSelectClient }) {
    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-full border-t-2 border-indigo-500 animate-spin" />
            <p className="text-indigo-400 italic font-bold text-sm tracking-widest uppercase animate-pulse">Sincronizando todas las tareas...</p>
        </div>
    );

    const grouped = tasks.reduce((acc, t) => {
        if (!acc[t.client]) acc[t.client] = [];
        acc[t.client].push(t);
        return acc;
    }, {});

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Mis Tareas Globales</h2>
                    <p className="text-gray-500 italic max-w-xl font-medium">Control total de la producción de todas tus marcas asignadas.</p>
                </div>
            </div>

            <div className="space-y-8 pb-20">
                {Object.keys(grouped).length === 0 ? (
                    <div className="bg-[#0E0E18] border border-white/5 rounded-[3.5rem] p-20 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700 mx-auto mb-8">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Bandeja de Tareas Limpia</h3>
                        <p className="text-gray-500 italic mt-2">No hay acciones pendientes en este ciclo. Todo fluye correctamente.</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([clientName, clientTasks]) => (
                        <div key={clientName} className="bg-[#0E0E18] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                            <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                                        {clientName.charAt(0)}
                                    </div>
                                    {clientName}
                                </h3>
                                <button 
                                    onClick={() => onSelectClient({ name: clientName })}
                                    className="px-6 py-2 rounded-xl bg-white/5 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    Ver Ecosistema &rarr;
                                </button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {clientTasks.map(t => (
                                    <div key={t.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.01] transition-all group">
                                        <div className="flex items-start gap-5 mb-4 md:mb-0">
                                            <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 ${
                                                t.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 
                                                t.status === 'in_progress' ? 'bg-cyan-500 animate-pulse' : 'bg-orange-500'
                                            }`} />
                                            <div>
                                                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{t.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t.format || 'Tarea'}</span>
                                                    <span className="text-gray-700">•</span>
                                                    <span className="text-[10px] text-gray-400 font-bold italic">{t.assigned_role || 'General'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <div className="text-right">
                                                <p className="text-[9px] text-gray-600 uppercase font-black mb-1">Cierre Estratégico</p>
                                                <p className="text-sm text-white font-black italic">{t.deadline || 'Pendiente'}</p>
                                            </div>
                                            <div className={`w-28 text-center py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                t.priority === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                                                t.priority === 'Medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                                'bg-white/5 border-white/10 text-gray-500'
                                            }`}>
                                                {t.priority === 'High' ? 'Prioridad Alta' : t.priority || 'Normal'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function NotificationsView({ notifications, loading }) {
    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-full border-t-2 border-cyan-500 animate-spin" />
            <p className="text-cyan-400 italic font-bold text-sm tracking-widest uppercase animate-pulse">Actualizando centro de mando...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full mb-4">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Protocolo de Alerta DIIC</span>
                    </div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Centro de Notificaciones</h2>
                    <p className="text-gray-500 italic max-w-xl font-medium">Alertas del sistema, feedback estratégico de clientes y actualizaciones críticas de producción.</p>
                </div>
                <button 
                    onClick={() => alert('Limpiando historial de notificaciones leídas...') }
                    className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-all pb-2 border-b border-transparent hover:border-white"
                >
                    Depurar historial de lectura
                </button>
            </div>

            <div className="space-y-5">
                {notifications.length === 0 ? (
                    <div className="bg-[#0E0E18] border border-white/5 rounded-[3.5rem] p-24 text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-gray-800 mx-auto mb-10 opacity-30">
                            <Bell className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tu Bandeja está Sincronizada</h3>
                        <p className="text-gray-600 italic mt-2">No hay alertas críticas que requieran tu atención inmediata.</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`p-10 rounded-[3rem] border transition-all flex flex-col md:flex-row gap-8 group relative overflow-hidden ${
                            n.status === 'unread' ? 'bg-[#121220] border-white/10 shadow-2xl' : 'bg-transparent border-white/5 opacity-50'
                        }`}>
                            {n.status === 'unread' && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />
                            )}
                            
                            <div className={`w-16 h-16 rounded-[1.4rem] flex items-center justify-center shrink-0 shadow-lg ${
                                n.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                n.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                'bg-cyan-500/10 text-cyan-400'
                            }`}>
                                {n.type === 'error' ? <AlertTriangle className="w-8 h-8" /> :
                                 n.type === 'warning' ? <AlertTriangle className="w-8 h-8" /> :
                                 n.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> :
                                 <Plus className="w-8 h-8" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-4">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter transition-all group-hover:text-cyan-400">{n.title}</h4>
                                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        {new Date(n.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed font-bold italic mb-6">"{n.message}"</p>
                                
                                {n.link && (
                                    <button 
                                        onClick={() => alert(`Iniciando acción estratégica: ${n.title}`)}
                                        className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-white/5"
                                    >
                                        EJECUTAR ACCIÓN ESTRATÉGICA &rarr;
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function CMGrowth() {
    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sistema de Evolución</span>
                    </div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Mi Crecimiento</h2>
                    <p className="text-gray-500 italic max-w-xl font-medium">Visualiza tu evolución, desbloquea nuevos rangos y gestiona tus recompensas por eficiencia estratégica.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-2 bg-[#0E0E18] border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                        <TrendingUp className="w-96 h-96" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Rango Actual</p>
                                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Estratega Junior II</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Próxima meta</p>
                                <h4 className="text-xl font-black text-emerald-400 italic uppercase">Senior Mastery</h4>
                            </div>
                        </div>

                        <div className="space-y-3 mb-12">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-1">
                                <span className="text-gray-500">Progreso de Nivel</span>
                                <span className="text-white font-black italic">750 / 1000 XP</span>
                            </div>
                            <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    className="h-full bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] text-center group hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">KPI Eficiencia</p>
                                <p className="text-3xl font-black text-emerald-400 italic">98<span className="text-xs font-normal opacity-50 ml-1">%</span></p>
                            </div>
                            <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] text-center group hover:border-cyan-500/30 transition-all">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Audit Accuracy</p>
                                <p className="text-3xl font-black text-cyan-400 italic">94<span className="text-xs font-normal opacity-50 ml-1">%</span></p>
                            </div>
                            <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] text-center group hover:border-purple-500/30 transition-all">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Marcas bajo mando</p>
                                <p className="text-3xl font-black text-purple-400 italic">12</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Award className="w-6 h-6 text-emerald-400" /> Recompensas
                        </h3>
                        
                        <div className="space-y-4">
                            <RewardItem title="Bono Eficiencia Q2" status="Desbloqueable" xp="250 XP+" available={false} />
                            <RewardItem title="Acceso Mastermind IA" status="ACTIVO" xp="Canjeado" available={true} />
                            <RewardItem title="Descuento en Certificación" status="Disponible" xp="500 XP+" available={false} />
                            <RewardItem title="Badge Estratega Elite" status="Nivel 5" xp="1500 XP+" available={false} />
                        </div>
                    </div>

                    <button 
                        onClick={() => alert('Sistema de Canje: Próximamente disponible. ¡Sigue acumulando XP!')}
                        className="w-full mt-10 py-5 bg-white text-black font-black uppercase text-[11px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-white/10"
                    >
                        Canjear XP acumulada
                    </button>
                </div>
            </div>
        </div>
    );
}


function ModulePlayer({ module, onBack }) {
    const [activeLesson, setActiveLesson] = useState(0);
    
    // Contenido simulado de alta fidelidad para el módulo
    const lessons = [
        {
            title: "Introducción: El Arte de la Retención",
            duration: "04:20",
            status: "completed",
            desc: "Conceptos fundamentales sobre por qué el 80% de los videos fallan en captar la atención inicial."
        },
        {
            title: "Psicología del Hook (Gancho)",
            duration: "08:45",
            status: "active",
            desc: "Análisis de los primeros 3 segundos. Patrones visuales y auditivos que disparan la dopamina."
        },
        {
            title: "La Curva de Retención Vital",
            duration: "12:10",
            status: "pending",
            desc: "Cómo evitar la caída de audiencia a la mitad del video mediante micro-tensiones narrativas."
        },
        {
            title: "CTAs que Convierten",
            duration: "06:15",
            status: "pending",
            desc: "Técnicas para transformar espectadores en leads calificados sin sonar desesperado."
        }
    ];

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-700">
            {/* Header del Reproductor */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-3 bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                    >
                        <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${module.color}`}>● {module.focus}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">/ Módulo {module.id}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{module.title}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => alert('Abriendo pad de notas estratégicas para este módulo...')}
                            className="p-3 bg-white/5 rounded-2xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-black"
                        >
                            <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => alert('Generando link de acceso temporal para compartir con el equipo...')}
                            className="p-3 bg-white/5 rounded-2xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-black"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Progreso del Módulo</p>
                        <p className="text-sm font-black text-emerald-400 italic">25% COMPLETADO</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* Visualización de la Lección (Main Content) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Video Area (Placeholder Premium) */}
                    <div className="aspect-video bg-[#050510] rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12 opacity-0 group-hover:opacity-100 transition-opacity">
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Lección {activeLesson + 1}: {lessons[activeLesson].title}</h3>
                            <p className="text-gray-400 font-medium mb-6 max-w-xl italic">"{lessons[activeLesson].desc}"</p>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl w-fit backdrop-blur-md">
                                <Play className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                                <div className="h-1 flex-1 min-w-[300px] bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400 w-1/3 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">{lessons[activeLesson].duration}</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
                            <module.icon className={`w-40 h-40 ${module.color}`} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/20 hover:scale-110 active:scale-95 transition-all">
                                <Play className="w-8 h-8 fill-white translate-l-0.5" />
                            </button>
                        </div>
                    </div>

                    {/* Lesson Info */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-10 flex justify-between items-center group">
                        <div className="max-w-2xl">
                            <h4 className="text-xl font-bold text-white mb-2">Recursos de Valor</h4>
                            <p className="text-sm text-gray-500 leading-relaxed italic">Descarga la guía rápida de "Estructura de Tres Actos" y los templates de hooks que usamos en esta lección.</p>
                        </div>
                        <button 
                            onClick={() => alert('Iniciando descarga de: Guía Rápida - Ingeniería de Retención v2.pdf')}
                            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            <FileText className="w-4 h-4" /> Bajar PDF Guía
                        </button>
                    </div>
                </div>

                {/* Sidebar de Lecciones */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Plan de Estudios</h4>
                    <div className="space-y-3">
                        {lessons.map((lesson, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveLesson(index)}
                                className={`w-full text-left p-5 rounded-[2rem] border transition-all relative group ${
                                    activeLesson === index 
                                    ? 'bg-cyan-600 border-cyan-500 shadow-lg shadow-cyan-600/20' 
                                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${activeLesson === index ? 'text-cyan-100' : 'text-gray-500'}`}>
                                        Lección 0{index + 1}
                                    </span>
                                    {lesson.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                </div>
                                <p className={`text-xs font-bold leading-tight uppercase tracking-tight mb-2 ${activeLesson === index ? 'text-white' : 'text-gray-300'}`}>
                                    {lesson.title}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Clock className={`w-3 h-3 ${activeLesson === index ? 'text-cyan-200' : 'text-gray-600'}`} />
                                    <span className={`text-[9px] font-bold ${activeLesson === index ? 'text-cyan-200' : 'text-gray-500'}`}>{lesson.duration}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] text-center">
                        <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Próxima Recompensa</p>
                        <p className="text-[9px] text-gray-400 italic">Completa este módulo para desbloquear: <br /><span className="text-white font-black">"Badge de Retención Élite"</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RewardItem({ title, status, xp, available }) {
    return (
        <div 
            onClick={() => alert(available ? `¡Has activado: ${title}!\nEsta recompensa ya está acreditada en tu perfil.` : `Esta recompensa está bloqueada. Se desbloquea con ${xp} acumulada.`)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${available ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5 hover:bg-emerald-500/20' : 'bg-white/5 border-white/5 opacity-50 hover:opacity-70'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">{title}</h4>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${available ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                    {status}
                </div>
            </div>
            <p className={`text-[10px] font-black italic ${available ? 'text-emerald-400' : 'text-gray-600'}`}>{xp}</p>
        </div>
    );
}

