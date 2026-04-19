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
    ChevronLeft as ChevronLeftIcon, Layers, MapPin, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import StrategyBoard from '../../shared/Strategy/StrategyBoard';
import CreativeStudio from '../../events/CreativeBoard';
import ContentKanban from '../../shared/Kanban/ContentKanban';
import UnifiedCalendar from '../../calendar/UnifiedCalendar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { aiService } from '@/services/aiService';

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
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const handleMarkAsRead = async (id) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('id', id);
            
            if (!error) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

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
    
    const fetchNotifications = async () => {
        if (!user?.id) return;
        setLoadingNotifications(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (data) setNotifications(data);
        setLoadingNotifications(false);
    };


    useEffect(() => {
        if (activeTab === 'tasks') fetchAllTasks();
        if (activeTab === 'notifications') fetchNotifications();
    }, [activeTab, clients]);

    const menuItems = selectedClient ? [
        { id: 'dashboard', label: 'Dashboard Cliente', icon: LayoutDashboard },
        { id: 'projects', label: 'Proyectos', icon: FolderOpen },
        { id: 'contents', label: 'Contenidos (Kanban)', icon: LayoutDashboard },
        { id: 'chat', label: 'Centro de Comunicación', icon: MessageSquare },
        { id: 'meta', label: 'Módulo Meta (Ads)', icon: BarChart3 },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'strategy', label: 'Pizarra Estratégica', icon: Share2 },
        { id: 'creative', label: 'Estudio Creativo', icon: Sparkles },
        { id: 'team', label: 'Equipo Asignado', icon: Palette },
        { id: 'reports', label: 'Generador de Reportes', icon: FileText },
    ] : [
        { id: 'dashboard_cm', label: 'Dashboard CM', icon: LayoutDashboard },
        { id: 'clients', label: 'Empresas', icon: Users },
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
                                <span className="font-bold text-sm tracking-wide truncate">{item.label}</span>
                                {item.badge > 0 && (
                                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                                        {item.badge}
                                    </span>
                                )}
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
                {/* Global Workstation Header */}
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#050511]/50 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                        <h1 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                            System <span className="text-white">Live</span> / {activeTab?.toUpperCase()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`relative p-3 rounded-2xl border transition-all group ${
                                activeTab === 'notifications' 
                                ? 'bg-cyan-600/10 border-cyan-500/30 text-cyan-400' 
                                : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                            }`}
                        >
                            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {notifications.filter(n => n.status === 'unread').length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#050511] animate-pulse">
                                    {notifications.filter(n => n.status === 'unread').length}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={() => setActiveTab('profile')}
                            className="flex items-center gap-3 pl-6 border-l border-white/5 hover:bg-white/5 transition-all group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">{user?.full_name || 'Leslie'}</p>
                                <p className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest leading-none opacity-60">Lead Estratega</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                {user?.full_name?.charAt(0) || 'L'}
                            </div>
                        </button>
                    </div>
                </header>

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
                            {renderContent(activeTab, selectedClient, setSelectedClient, setActiveTab, clients, loading, clientTasks, loadingTasks, user, squad, globalTasks, notifications, loadingNotifications, handleMarkAsRead)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function renderContent(tab, selectedClient, setSelectedClient, setActiveTab, clients, loading, clientTasks, loadingTasks, user, squad, globalTasks, notifications, loadingNotifications, handleMarkAsRead) {
    if (!selectedClient) {
        if (tab === 'dashboard_cm') return <CMOverviewDashboard clients={clients} loading={loading} />;
        if (tab === 'academy') return <CMAcademy />;
        if (tab === 'growth') return <CMGrowth />;
        if (tab === 'tasks') return <GlobalTasksView tasks={globalTasks} loading={loadingTasks} onSelectClient={(c) => { setSelectedClient(c); setActiveTab('dashboard'); }} />;
        if (tab === 'notifications') return <NotificationsView notifications={notifications} loading={loadingNotifications} onMarkAsRead={handleMarkAsRead} />;
        if (tab === 'profile') return <CMProfileView user={user} />;
        
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
        case 'dashboard': return <CMDashboard client={selectedClient} user={user} tasks={clientTasks} />;
        case 'projects': return <CMProjects client={selectedClient} tasks={clientTasks} loading={loadingTasks} />;
        case 'contents': return <ContentKanban role="cm" client={selectedClient} />;
        case 'chat': return <CommunicationCenter client={selectedClient} squad={squad} tasks={clientTasks} />;
        case 'meta': return <MetaAdsModule client={selectedClient} />;
        case 'calendar': return <UnifiedCalendar role="cm" />;
        case 'strategy': return <StrategyBoard role="cm" isSubcomponent={true} onClose={() => setActiveTab('dashboard')} />;
        case 'creative': return <CreativeStudio isSubcomponent={true} />;
        case 'team': return <TeamView client={selectedClient} tasks={clientTasks} squad={squad} />;
        case 'reports': return <CMReports client={selectedClient} />;
        case 'profile': return <CMProfileView user={user} />;
        case 'academy': return <CMAcademy />;
        case 'growth': return <CMGrowth />;
        default: return <CMDashboard client={selectedClient} />;
    }
}

function CMDashboard({ client, user, tasks = [] }) {
    const [checklist, setChecklist] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`cm_checklist_${client.id}`);
            return saved ? JSON.parse(saved) : [
                { id: 1, label: "Revisar material recibido (videos/fotos)", completed: false },
                { id: 2, label: "Enviar instrucciones a editores", completed: true },
                { id: 3, label: "Confirmar fechas de publicación", completed: false },
                { id: 4, label: "Verificar reporte de métricas semanal", completed: false },
                { id: 5, label: "Escalar leads importantes a Ventas", completed: false }
            ];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(`cm_checklist_${client.id}`, JSON.stringify(checklist));
    }, [checklist, client.id]);

    const toggleCheckItem = (id) => {
        setChecklist(prev => prev.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
        toast.success("Protocolo Actualizado", {
            description: "Estado de ejecución guardado localmente."
        });
    };

    // Calculate real metrics from Supabase tasks
    const metrics = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        urgent: tasks.filter(t => (t.priority || '').toLowerCase() === 'high' || (t.priority || '').toLowerCase() === 'urgente').length
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard title="Proyectos" value={metrics.total} sub="Activos en Nube" icon={FolderOpen} color="text-cyan-400" />
                <StatCardMini title="Pendientes" value={metrics.pending} color="text-orange-400" icon={Clock} />
                <StatCardMini title="Para Revisión" value={metrics.review} color="text-purple-400" icon={Eye} />
                <StatCardMini title="Urgente" value={metrics.urgent} color="text-red-400" icon={AlertTriangle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" /> Checklist Operativo
                    </h3>
                    <div className="space-y-4">
                        {checklist.map(item => (
                            <CheckItem 
                                key={item.id} 
                                label={item.label} 
                                completed={item.completed} 
                                onToggle={() => toggleCheckItem(item.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-400" /> Actividad Reciente
                    </h3>
                    <div className="space-y-4">
                        {tasks.length > 0 ? (
                            tasks.slice(0, 3).map((task, i) => (
                                <ActivityItem 
                                    key={task.id || i}
                                    text={`${task.assigned_to || 'Equipo'} actualizó '${task.title}'`} 
                                    time={task.created_at ? new Date(task.created_at).toLocaleDateString() : 'Reciente'} 
                                />
                            ))
                        ) : (
                            <p className="text-xs text-gray-500 italic">No hay actividad registrada aún.</p>
                        )}
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
            className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all cursor-pointer shadow-xl shadow-black/20"
        >
            <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{title}</p>
                <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
            </div>
            <Icon className={`w-8 h-8 ${color} opacity-20 group-hover:opacity-40 transition-opacity`} />
        </div>
    );
}

function CheckItem({ label, completed, onToggle }) {
    return (
        <div 
            onClick={onToggle}
            className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer active:scale-[0.98]"
        >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${completed ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/20'}`}>
                {completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={`text-xs font-medium transition-colors ${completed ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
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

function CommunicationCenter({ client, squad, tasks = [] }) {
    const [subTab, setSubTab] = useState('ia');
    const [showPopover, setShowPopover] = useState(false);
    const [activeChat, setActiveChat] = useState({ id: 'ia', type: 'ia', name: 'Asistente IA' });
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, chatId: 'ia', text: '¡Hola Leslie! Soy tu Estratega IA. Estoy listo para optimizar tu flujo de trabajo de hoy.', sender: 'ai', time: '10:00 AM' },
        { id: 2, chatId: 'general', text: 'Equipo, ¿cómo vamos con los reels de Clínica Dental?', sender: 'me', time: '10:05 AM' },
    ]);

    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;
        
        const userMsg = inputValue.trim();
        const newMessage = {
            id: Date.now(),
            chatId: activeChat.id,
            text: userMsg,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMessage]);
        setInputValue('');

        if (activeChat.type === 'ia') {
            setIsTyping(true);
            try {
                // Prepare chat history for the API
                const history = messages.filter(m => m.chatId === 'ia');
                const combinedMessages = [...history, newMessage];
                
                const result = await aiService.chatWithAgent(combinedMessages, client);
                
                if (result?.text) {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        chatId: 'ia',
                        text: result.text,
                        sender: 'ai',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                }
            } catch (error) {
                console.error("AI Chat Error:", error);
                toast.error("Error del Agente", { description: "No pude procesar tu solicitud estratégica." });
            } finally {
                setIsTyping(false);
            }
        } else {
            toast.success("Mensaje Enviado", { description: `Enviado a ${activeChat.name}` });
        }
    };

    const selectChat = (chat) => {
        setActiveChat(chat);
        setSubTab(chat.type === 'ia' ? 'ia' : chat.type === 'enterprise' ? 'empresa' : 'team');
        setShowPopover(false);
    };

    const tabs = [
        { id: 'ia', label: 'Asistente IA', icon: Bot },
        { id: 'empresa', label: 'Chat Empresa / Marca', icon: MessageSquare },
        { id: 'team', label: 'Mi Equipo', icon: Palette },
    ];

    return (
        <div className="h-full flex flex-col bg-[#0E0E18] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            
            {/* ─── Top Navigation ─── */}
            <div className="flex p-2 bg-white/[0.02] border-b border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setSubTab(tab.id);
                            if (tab.id === 'ia') setActiveChat({ id: 'ia', type: 'ia', name: 'Asistente IA' });
                            if (tab.id === 'empresa') setActiveChat({ id: 'enterprise', type: 'enterprise', name: client.name });
                        }}
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

            {/* ─── Chat Area ─── */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${subTab}-${activeChat.id}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4"
                    >
                        {/* If in 'team' tab but no specific member selected yet, show the team list */}
                        {subTab === 'team' && activeChat.type !== 'member' && activeChat.id !== 'general' ? (
                            <TeamChatView 
                                client={client} 
                                squad={squad} 
                                activeMemberId={null}
                                onSelectMember={(m) => selectChat({ id: m.id, type: 'member', name: m.name })}
                                onSendMember={(m) => selectChat({ id: m.id, type: 'member', name: m.name })}
                                onViewKPIs={() => {}}
                            />
                        ) : (
                            /* Else show the message history for the active chat */
                            <div className="flex flex-col h-full">
                                {subTab === 'ia' && messages.filter(m => m.chatId === 'ia').length === 0 && <AIChatView tasks={tasks} />}
                                {subTab === 'empresa' && messages.filter(m => m.chatId === 'enterprise').length === 0 && <EnterpriseChatView client={client} />}
                                
                                <div className="space-y-6">
                                    {messages.filter(m => m.chatId === activeChat.id).map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-3xl ${
                                                msg.sender === 'me' 
                                                ? 'bg-cyan-600 text-white rounded-tr-none' 
                                                : msg.sender === 'ai' 
                                                    ? 'bg-white/5 border border-indigo-500/30 text-gray-200 rounded-tl-none backdrop-blur-md'
                                                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                                            }`}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                <p className="text-[9px] mt-2 opacity-50 font-bold uppercase tracking-widest">{msg.time}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && activeChat.type === 'ia' && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/5 border border-indigo-500/30 p-4 rounded-3xl rounded-tl-none backdrop-blur-md flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic animate-pulse">Analizando Estrategia...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* ─── Input Area ─── */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01] relative">
                    {/* Action Popover (ChatGPT Style) */}
                    <AnimatePresence>
                        {showPopover && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-full left-4 mb-4 z-[60] bg-[#161625]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-2xl min-w-[240px]"
                            >
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2 italic">Canales de Control</p>
                                <div className="space-y-1">
                                    <button 
                                        onClick={() => selectChat({ id: 'general', type: 'member', name: 'Chat General' })}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center text-cyan-400">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-300 group-hover:text-white">Chat General</span>
                                    </button>
                                    <div className="h-px bg-white/5 my-2 mx-2" />
                                    {squad?.map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => selectChat({ id: m.id, type: 'member', name: m.name })}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-[10px]">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-300 group-hover:text-white">{m.name}</p>
                                                <p className="text-[8px] text-gray-500 font-bold uppercase">{m.role}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {(!squad || squad.length === 0) && (
                                        <>
                                            <button onClick={() => selectChat({ id: 'fausto', type: 'member', name: 'Fausto' })} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all group">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold">F</div>
                                                <span className="text-xs font-bold text-gray-300 group-hover:text-white">Fausto (Video)</span>
                                            </button>
                                            <button onClick={() => selectChat({ id: 'anthony', type: 'member', name: 'Anthony' })} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all group">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold">A</div>
                                                <span className="text-xs font-bold text-gray-300 group-hover:text-white">Anthony (Diseño)</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPopover(!showPopover)}
                            className={`w-12 h-12 rounded-2xl border transition-all flex items-center justify-center shadow-lg active:scale-95 group ${
                                showPopover ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-cyan-400'
                            }`}
                        >
                            <Plus className={`w-6 h-6 transition-transform ${showPopover ? 'rotate-45' : 'group-hover:rotate-90'}`} />
                        </button>
                        <div className="flex-1 relative">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={`Hablar con ${activeChat.name}...`}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all pr-12"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AIChatView({ tasks = [] }) {
    const { user } = useAuth();
    const [isThinking, setIsThinking] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);

    const handleAISuggestion = (type) => {
        setIsThinking(true);
        setAiResponse(null);
        
        setTimeout(() => {
            setIsThinking(false);
            if (type === 'report') {
                const total = tasks.length;
                const completed = tasks.filter(t => t.status === 'completed').length;
                setAiResponse(`He analizado tus ${total} tareas actuales. Tienes un ${Math.round((completed/total)*100 || 0)}% de avance semanal. ¿Deseas que prepare el PDF de resumen para el cliente?`);
            } else {
                const pending = tasks.filter(t => t.status !== 'completed');
                setAiResponse(`Hay ${pending.length} tareas activas. La más urgente es "${pending[0]?.title || 'ninguna'}" asignada a ${pending[0]?.assigned_role || 'el equipo'}.`);
            }
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 shrink-0 relative overflow-hidden">
                    <Bot className="w-6 h-6" />
                    {isThinking && (
                        <motion.div 
                            className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            <Sparkles className="w-4 h-4 text-white animate-spin" />
                        </motion.div>
                    )}
                </div>
                <div className="space-y-4 max-w-[85%]">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 rounded-tl-none backdrop-blur-md shadow-xl">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {aiResponse || `¡Hola, ${user?.full_name?.split(' ')[0] || 'Estratega'}! Soy tu **Estratega IA**. He analizado los datos y observo un flujo constante en la producción. 
                            
                            Recuerda que esta es tu zona de control: aquí organizamos la estrategia directa con la marca. ¿Quieres que redacte un reporte rápido de desempeño para enviar al cliente ahora mismo?`}
                        </p>
                    </div>

                    {!aiResponse && !isThinking && (
                        <div className="grid grid-cols-1 gap-2">
                            <button 
                                onClick={() => handleAISuggestion('report')}
                                className="text-left px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-[11px] text-cyan-400 font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-between group"
                            >
                                <span>"Generar reporte de desempeño semanal"</span>
                                <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => handleAISuggestion('status')}
                                className="text-left px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-gray-400 font-bold hover:text-white transition-all flex items-center justify-between group"
                            >
                                <span>"¿Cuál es el estado de los videos en edición?"</span>
                                <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {aiResponse && (
                        <button 
                            onClick={() => { setAiResponse(null); toast.info("Memoria de IA despejada."); }}
                            className="text-[10px] text-gray-500 font-bold uppercase hover:text-white transition-colors"
                        >
                            &larr; Hacer otra consulta
                        </button>
                    )}
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

function TeamChatView({ client, squad, commMode, onSetCommMode, activeMemberId, onSelectMember, onSendMember, onViewKPIs }) {
    const team = (squad && squad.length > 0) ? squad.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        status: m.status || 'Disponible',
        avatar: (m.name || 'User').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase(),
        kpis: Array.isArray(m.skills) ? m.skills : (typeof m.skills === 'string' && m.skills ? JSON.parse(m.skills) : [])
    })) : [
        { id: 1, name: 'Anthony (Sto Dgo)', role: 'Diseñador', status: 'Disponible', avatar: 'A', kpis: [] },
        { id: 2, name: 'Fausto', role: 'Editor de Video', status: 'Disponible', avatar: 'F', kpis: [] }
    ];

    return (
        <div className="space-y-8">
            <div className="flex gap-4 border-b border-white/5 pb-6">
                <button 
                    onClick={() => {
                        onSetCommMode('general');
                        toast.info("Accediendo al Chat General", { description: "Conectando con todos los creativos del proyecto." });
                    }}
                    className={`flex-1 p-4 border rounded-2xl text-center group transition-all shadow-lg ${
                        commMode === 'general' 
                        ? 'bg-cyan-600/10 border-cyan-500/50 shadow-cyan-900/10' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                >
                    <h4 className="text-xs font-bold text-cyan-400 mb-1">Chat General</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Proyecto Completo</p>
                </button>
                <button 
                    onClick={() => {
                        onSetCommMode('dept');
                        toast.info("Seleccionando Departamento", { description: "Filtra la comunicación por Video, Diseño o Copy." });
                    }}
                    className={`flex-1 p-4 border rounded-2xl text-center group transition-all ${
                        commMode === 'dept'
                        ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                >
                    <h4 className={`text-xs font-bold mb-1 ${commMode === 'dept' ? 'text-white' : 'text-white'}`}>Departamentos</h4>
                    <p className={`text-[9px] uppercase font-bold tracking-widest ${commMode === 'dept' ? 'text-cyan-100' : 'text-gray-500'}`}>Ej: Video / Diseño</p>
                </button>
            </div>

            <div>
                <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Chat Directo con el Equipo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {team.map(m => (
                        <div 
                            key={m.id} 
                            onClick={() => onSelectMember(m)}
                            className={`p-5 border rounded-[2rem] transition-all group relative overflow-hidden shadow-xl cursor-pointer ${
                                activeMemberId === m.id
                                ? 'bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/30'
                                : 'bg-white/[0.03] border-white/10 hover:border-cyan-500/30'
                            }`}
                        >
                            {activeMemberId === m.id && (
                                <div className="absolute top-0 right-0 p-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg transition-transform group-hover:scale-110 ${
                                    activeMemberId === m.id ? 'bg-indigo-500 shadow-indigo-600/40' : 'bg-indigo-600 shadow-indigo-500/20'
                                }`}>
                                    {m.avatar}
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-sm font-bold text-white italic">{m.name}</h5>
                                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{m.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-bold uppercase text-gray-500">
                                <span className={m.status === 'Disponible' ? 'text-emerald-400' : 'text-orange-400'}>● {activeMemberId === m.id ? 'CHAT ACTIVO' : m.status}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onViewKPIs(m); }}
                                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onSendMember(m); }}
                                        className="p-2 bg-cyan-600 rounded-lg text-white hover:bg-cyan-500 shadow-md shadow-cyan-600/20 transition-all active:scale-95"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
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

function MessageContextModal({ member, onClose }) {
    const { user } = useAuth();
    const [sending, setSending] = useState(false);
    const [selectedContext, setSelectedContext] = useState(null);

    const contexts = [
        { id: 'proj', label: 'Proyecto', icon: FolderOpen },
        { id: 'task', label: 'Tarea', icon: CheckCircle2 },
        { id: 'video', label: 'Edición de Video', icon: Eye },
        { id: 'design', label: 'Diseño', icon: Palette },
        { id: 'meeting', label: 'Reunión', icon: Calendar },
        { id: 'payment', label: 'Pago / Cotización', icon: BarChart3 },
        { id: 'general', label: 'Consulta General', icon: MessageSquare },
    ];

    const handleSend = () => {
        if (!selectedContext) {
            toast.warning("Selecciona un contexto", { description: "Es vital para que el equipo entienda tu mensaje rápidamente." });
            return;
        }
        setSending(true);
        setTimeout(() => {
            setSending(false);
            toast.success("Mensaje Enviado", {
                description: `Enviado a ${member?.name || 'equipo'} con contexto: ${selectedContext.label}`
            });
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                <div className="p-10 border-b border-white/5 text-center">
                    <div className="w-16 h-16 bg-cyan-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Canal de Control DIIC</h3>
                    <p className="text-gray-500 text-sm italic">Define el contexto antes de enviar a {member?.name || 'este creativo'}.</p>
                </div>

                <div className="p-10 grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                    {contexts.map(ctx => (
                        <button
                            key={ctx.id}
                            onClick={() => setSelectedContext(ctx)}
                            className={`flex items-center gap-3 p-4 border rounded-2xl transition-all text-left group ${selectedContext?.id === ctx.id 
                                ? 'bg-cyan-600 border-cyan-500 shadow-lg shadow-cyan-600/20' 
                                : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedContext?.id === ctx.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500 group-hover:text-cyan-400'}`}>
                                <ctx.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedContext?.id === ctx.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{ctx.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-10 bg-white/[0.02] flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cancelar</button>
                    <button 
                        onClick={handleSend}
                        disabled={sending}
                        className="flex-[2] py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-cyan-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        {sending ? 'Encriptando & Enviando...' : 'Confirmar & Enviar'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function MemberKPIModal({ member, onClose }) {
    const kpis = [
        { label: 'Calidad Creativa', value: '98%', color: 'from-cyan-600 to-blue-500' },
        { label: 'Tiempo de Entrega', value: '1.2d', color: 'from-purple-600 to-indigo-500' },
        { label: 'Asertividad', value: '95%', color: 'from-emerald-600 to-teal-500' },
        { label: 'Revisiones Avg.', value: '0.8', color: 'from-orange-600 to-red-500' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                <div className="flex h-full">
                    <div className="w-1/3 bg-[#11111E] p-10 flex flex-col items-center justify-center border-r border-white/5 text-center">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-600/20 mb-6">
                            {member.avatar}
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">{member.name}</h3>
                        <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-6">{member.role}</p>
                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full inline-flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black text-emerald-400 uppercase">Activo Ahora</span>
                        </div>
                    </div>

                    <div className="flex-1 p-10 flex flex-col">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">Audit Report</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Desempeño acumulado en DIIC Zone</p>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 flex-1">
                            {kpis.map((kpi, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${kpi.color}`} />
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">{kpi.label}</p>
                                    <h5 className="text-3xl font-black text-white group-hover:translate-x-1 transition-transform">{kpi.value}</h5>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                onClick={() => toast.success("Hoja de Vida en camino", { description: "Enviando PDF histórico a tu correo." })}
                                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                            >
                                Perfil Completo
                            </button>
                            <button 
                                onClick={() => { onClose(); toast.info("Canal seguro conectado."); }}
                                className="flex-[2] py-4 bg-cyan-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-cyan-600/20 hover:bg-cyan-500 transition-all"
                            >
                                Abrir Chat Directo
                            </button>
                        </div>
                    </div>
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
    const [isSyncing, setIsSyncing] = useState(false);
    const [showAudienceModal, setShowAudienceModal] = useState(false);
    const [showCreativeModal, setShowCreativeModal] = useState(false);
    const [selectedAdForMetrics, setSelectedAdForMetrics] = useState(null);

    const handleSync = () => {
        setIsSyncing(true);
        toast.info("Conectando con Meta API...", { description: "Sincronizando Business Manager y cuentas publicitarias." });
        setTimeout(() => {
            setIsSyncing(false);
            toast.success("DIIC Sync Completado", { description: "Datos de pauta actualizados en tiempo real." });
        }, 2200);
    };

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
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="px-6 py-3 bg-cyan-600 rounded-2xl text-[11px] font-bold text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                    {isSyncing && <Zap className="w-3 h-3 animate-spin" />}
                    {isSyncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR BUSINESS MANAGER'}
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
                                    onClick={(e) => {
                                        const el = e.currentTarget;
                                        el.style.opacity = '0.5';
                                        el.style.pointerEvents = 'none';
                                        const p = el.querySelector('p:last-child');
                                        const original = p.innerText;
                                        p.innerText = 'Aplicando...';
                                        setTimeout(() => {
                                            p.innerText = '¡Aplicado con Éxito!';
                                            el.style.opacity = '1';
                                            setTimeout(() => { p.innerText = original; el.style.pointerEvents = 'auto'; }, 2000);
                                        }, 1500);
                                    }}
                                    className="flex-1 min-w-[150px] p-4 bg-cyan-600/10 rounded-2xl border border-cyan-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-cyan-600/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Zap className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-cyan-400 font-bold uppercase">Optimizar</p>
                                    </div>
                                    <p className="text-[9px] text-cyan-400/60 italic">IA Sugiere: +5% Presupuesto</p>
                                </div>

                                <div 
                                    onClick={() => {
                                        setSelectedAdForMetrics(ad);
                                        setShowAudienceModal(true);
                                    }}
                                    className="flex-1 min-w-[150px] p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-amber-500/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Users className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-amber-500 font-bold uppercase">Público & Metas</p>
                                    </div>
                                    <p className="text-[9px] text-amber-500/60 italic">H: 45% | M: 55%</p>
                                </div>

                                <div 
                                    onClick={() => {
                                        toast.success("Público Guardado", {
                                            description: `Audiencia de '${ad.name}' sincronizada con DIIC Database.`
                                        });
                                    }}
                                    className="flex-1 min-w-[150px] p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-emerald-500/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Target className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-emerald-500 font-bold uppercase">Guardar Público</p>
                                    </div>
                                    <p className="text-[9px] text-emerald-500/60 italic">Sincronizar Meta</p>
                                </div>

                                <div 
                                    onClick={() => {
                                        toast.info("Advantage+ Activado", {
                                            description: "IA optimizando creatividades dinámicamente."
                                        });
                                    }}
                                    className="flex-1 min-w-[150px] p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-purple-500/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Sparkles className="w-3 h-3 text-purple-400 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-purple-400 font-bold uppercase">Advantage+</p>
                                    </div>
                                    <p className="text-[9px] text-purple-400/60 italic">IA Creativa ON</p>
                                </div>

                                <div 
                                    onClick={() => setShowCreativeModal(true)}
                                    className="flex-1 min-w-[150px] p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-indigo-500/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Layers className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase">Escalar / Nueva</p>
                                    </div>
                                    <p className="text-[9px] text-indigo-400/60 italic">+ Nueva Pieza</p>
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

            <AnimatePresence>
                {showAudienceModal && (
                    <AudienceMetricsModal 
                        ad={selectedAdForMetrics} 
                        onClose={() => setShowAudienceModal(false)} 
                    />
                )}
                {showCreativeModal && (
                    <CreativeTestingModal 
                        onClose={() => setShowCreativeModal(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function AudienceMetricsModal({ ad, onClose }) {
    const demography = [
        { label: 'Mujeres', value: 55, color: 'bg-rose-500' },
        { label: 'Hombres', value: 45, color: 'bg-blue-500' }
    ];

    const cities = [
        { name: 'Guayaquil', reach: '45%', color: 'bg-emerald-500' },
        { name: 'Quito', reach: '30%', color: 'bg-indigo-500' },
        { name: 'Cuenca', reach: '15%', color: 'bg-amber-500' },
        { name: 'Manta', reach: '10%', color: 'bg-cyan-500' }
    ];

    const interests = [
        { name: 'Estética & Salud', ctr: '3.4%', icon: Activity },
        { name: 'Lujo & Estilo de vida', ctr: '2.8%', icon: Sparkles },
        { name: 'Cirugía Plástica', ctr: '2.1%', icon: Target }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex"
            >
                <div className="w-1/3 bg-[#11111E] p-10 border-r border-white/5">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Audience Audit</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Sincronización de Meta Graph API en tiempo real.</p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center border-b border-white/5 pb-4">Distribución por Género</p>
                        {demography.map(d => (
                            <div key={d.label} className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                    <span className="text-gray-400">{d.label}</span>
                                    <span className="text-white">{d.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${d.value}%` }}
                                        className={`h-full ${d.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl italic text-[10px] text-amber-400/80 leading-relaxed">
                        "El 62% de tu público interactúa más a las 8:00 PM."
                    </div>
                </div>

                <div className="flex-1 p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">Impacto Geográfico & Intereses</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{ad?.name || 'Campaña Activa'}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">Top Ciudades</p>
                            <div className="space-y-4">
                                {cities.map(city => (
                                    <div key={city.name} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><MapPin className="w-4 h-4 text-gray-500" /></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                                                <span className="text-white">{city.name}</span>
                                                <span className="text-gray-500">{city.reach}</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${city.color}`} style={{ width: city.reach }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">Intereses Ganadores</p>
                            <div className="space-y-3">
                                {interests.map(interest => (
                                    <div key={interest.name} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <interest.icon className="w-4 h-4 text-cyan-400" />
                                            <span className="text-[11px] font-bold text-gray-300">{interest.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-emerald-400">{interest.ctr} <span className="text-[8px] opacity-50">CTR</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/5"
                        >
                            Listo
                        </button>
                        <button 
                            onClick={() => toast.success("Público Guardado en DIIC Database")}
                            className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                        >
                            Exportar Audiencia
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function CreativeTestingModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Creative Testing</h3>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-relaxed">ESCALADO & NUEVAS PIEZAS DINÁMICAS</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <div className="space-y-6 relative z-10">
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 group hover:border-indigo-500/30 transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 font-black" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-1">Nueva Pieza Creativa</h4>
                            <p className="text-xs text-gray-500 italic">Sube un nuevo Reel o Imagen para probar contra el control actual.</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 group hover:border-cyan-500/30 transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-600/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 font-black" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-1">Escalar Campaign</h4>
                            <p className="text-xs text-gray-500 italic">Duplicar conjunto de anuncios con presupuestos de escalado horizontal.</p>
                        </div>
                    </div>

                    <div className="p-8 mt-10 border border-dashed border-white/10 rounded-[2rem] text-center">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-4">Metodología DIIC Zone</p>
                        <p className="text-xs text-gray-400 leading-relaxed italic italic">"La pauta no es gasto, es compra de data. Cada nueva pieza nos acerca al CPA ideal para tu marca."</p>
                    </div>
                </div>

                <div className="mt-10 flex gap-4 relative z-10">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-5 bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        Abrir Gestor de Carga
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function CMReports({ client }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ content: { total: 0, pending: 0, finished: 0 }, tasks: { total: 0, completed: 0 } });
    const [showPreview, setShowPreview] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Fetch Content Stats
                const { data: contentData } = await supabase
                    .from('content')
                    .select('stage')
                    .eq('client', client.id);
                
                // Fetch Task Stats
                const { data: taskData } = await supabase
                    .from('tasks')
                    .select('status')
                    .eq('client', client.id);

                const cTotal = contentData?.length || 0;
                const cFinished = contentData?.filter(c => 
                    ['PUBLISHED', 'FINISHED', 'READY', 'LISTO'].includes(c.stage?.toUpperCase())
                ).length || 0;
                
                const tTotal = taskData?.length || 0;
                const tCompleted = taskData?.filter(t => 
                    ['COMPLETED', 'DONE', 'FINISHED', 'LISTO'].includes(t.status?.toUpperCase())
                ).length || 0;

                setStats({
                    content: { total: cTotal, pending: cTotal - cFinished, finished: cFinished },
                    tasks: { total: tTotal, completed: tCompleted }
                });
            } catch (error) {
                console.error("Error fetching report stats:", error);
            } finally {
                setLoading(false);
            }
        };
        if (client?.id) fetchStats();
    }, [client.id]);

    const handleShareWhatsApp = (type) => {
        const message = `Hola ${client.name}! 👋 Soy ${user?.full_name || 'tu CM'}. %0A%0AAquí tienes el *Resumen de Rendimiento Semanal*: %0A- Contenidos Producidos: ${stats.content.finished}/${stats.content.total} %0A- Tareas Completadas: ${stats.tasks.completed}/${stats.tasks.total} %0A- Estado de Ads: Óptimo ✅ %0A%0APuedes ver el detalle completo en el dashboard de DIIC Zone.`;
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Reportes Automáticos</h2>
                    <p className="text-gray-500 italic">{user?.full_name || 'Estratega'}, genera reportes visuales y compártelos por WhatsApp en un clic.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 group hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Rendimiento de Producción</h4>
                    <p className="text-xs text-gray-500 mb-6 italic flex-1">Consolidado de contenidos creados, publicados y en revisión de la semana.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                setSelectedReport({ type: 'Producción', icon: BarChart3 });
                                setShowPreview(true);
                            }}
                            className="flex-1 py-3 bg-cyan-600 rounded-xl text-[10px] font-bold text-white hover:bg-cyan-500 transition-all uppercase tracking-widest"
                        >
                            Ver Preview
                        </button>
                        <button 
                            onClick={() => handleShareWhatsApp('Producción')}
                            className="w-12 h-12 bg-emerald-600 rounded-xl text-white hover:bg-emerald-500 transition-all flex items-center justify-center"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 group hover:border-purple-500/30 transition-all cursor-pointer flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Auditoría de Pauta (Ads)</h4>
                    <p className="text-xs text-gray-500 mb-6 italic flex-1">Desglose de inversión Meta Ads, CTR, Leads y Retorno de Inversión esperado.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                setSelectedReport({ type: 'Ads & Pauta', icon: Share2 });
                                setShowPreview(true);
                            }}
                            className="flex-1 py-3 bg-purple-600 rounded-xl text-[10px] font-bold text-white hover:bg-purple-500 transition-all uppercase tracking-widest"
                        >
                            Ver Preview
                        </button>
                        <button 
                            onClick={() => handleShareWhatsApp('Ads')}
                            className="w-12 h-12 bg-emerald-600 rounded-xl text-white hover:bg-emerald-500 transition-all flex items-center justify-center"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 group hover:border-amber-500/30 transition-all cursor-pointer flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Eficiencia de Equipo</h4>
                    <p className="text-xs text-gray-500 mb-6 italic flex-1">Análisis de tiempos de entrega y calidad de respuesta del staff asignado.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                setSelectedReport({ type: 'Eficiencia', icon: Activity });
                                setShowPreview(true);
                            }}
                            className="flex-1 py-3 bg-amber-600 rounded-xl text-[10px] font-bold text-white hover:bg-amber-500 transition-all uppercase tracking-widest"
                        >
                            Ver Preview
                        </button>
                        <button 
                            onClick={() => handleShareWhatsApp('Eficiencia')}
                            className="w-12 h-12 bg-emerald-600 rounded-xl text-white hover:bg-emerald-500 transition-all flex items-center justify-center"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showPreview && (
                    <ReportPreviewModal 
                        report={selectedReport} 
                        stats={stats}
                        client={client}
                        onClose={() => setShowPreview(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ReportPreviewModal({ report, stats, client, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[85vh] relative"
            >
                {/* Header Estilo Reporte */}
                <div className="p-10 bg-[#0E0E18] text-white flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
                                <report.icon className="w-4 h-4" />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">DIIC ZONE <span className="text-cyan-400">AUDIT</span></h3>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Resumen Ejecutivo Semanal</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold uppercase tracking-widest">{client.name}</p>
                        <p className="text-[10px] font-bold text-gray-500 italic">Fecha: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Cuerpo del Reporte (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-12 text-[#0E0E18]">
                    <div className="mb-12 border-b border-gray-100 pb-8">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 border-cyan-600 pl-4">{report.type === 'Producción' ? 'Productividad de Contenido' : 'Análisis Operativo'}</h4>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-6 bg-gray-50 rounded-3xl text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total</p>
                                <p className="text-3xl font-black">{stats.content.total}</p>
                            </div>
                            <div className="p-6 bg-cyan-50 rounded-3xl text-center">
                                <p className="text-[10px] font-black text-cyan-600 uppercase mb-1">Listos</p>
                                <p className="text-3xl font-black text-cyan-700">{stats.content.finished}</p>
                            </div>
                            <div className="p-6 bg-amber-50 rounded-3xl text-center">
                                <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Pendientes</p>
                                <p className="text-3xl font-black text-amber-700">{stats.content.pending}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 border-b border-gray-100 pb-8">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 border-purple-600 pl-4">Cumplimiento de Objetivos</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase mb-1">
                                <span>Tareas Completadas</span>
                                <span>{Math.round((stats.tasks.completed / (stats.tasks.total || 1)) * 100)}%</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats.tasks.completed / (stats.tasks.total || 1)) * 100}%` }}
                                    className="h-full bg-purple-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 border-emerald-600 pl-4">Métricas Meta Ads</h4>
                        <div className="p-8 bg-emerald-50 rounded-[2rem] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase">Estado de Pauta</p>
                                    <p className="text-[10px] text-emerald-600 font-bold italic">Rendimiento Óptimo detectado por IA</p>
                                </div>
                            </div>
                            <p className="text-2xl font-black text-emerald-700">9.2 <span className="text-[8px] opacity-50">Score</span></p>
                        </div>
                    </div>

                    <div className="mt-12 p-8 bg-gray-900 rounded-[2rem] text-white">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Comentarios del CM</p>
                        <p className="text-xs leading-relaxed italic opacity-80">"Semana de alta tracción en Reels. El costo por lead se mantiene estable. Sugerimos incrementar inversión en el Asset #4 el próximo Lunes."</p>
                    </div>
                </div>

                {/* Footer del Reporte */}
                <div className="p-10 border-t border-gray-100 flex gap-4">
                    <button 
                        onClick={(e) => {
                            const btn = e.currentTarget;
                            btn.innerText = 'GENERANDO PDF...';
                            setTimeout(() => {
                                btn.innerText = 'PDF DESCARGADO ✅';
                                toast.success("PDF Generado", { description: `El reporte de ${client.name} se ha guardado en tu dispositivo.` });
                                setTimeout(() => btn.innerText = 'DESCARGAR PDF (OFICIAL)', 2000);
                            }, 2000);
                        }}
                        className="flex-1 py-5 bg-[#0E0E18] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-900/10"
                    >
                        DESCARGAR PDF (OFICIAL)
                    </button>
                    <button onClick={onClose} className="px-8 py-5 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
                        Cerrar
                    </button>
                </div>
            </motion.div>
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
                    <p className="text-2xl font-black text-white italic uppercase tracking-tighter">{user?.rank || 'Estratega Junior'}</p>
                    <div className="mt-4 px-4 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                        {user?.xp || 0} / {(user?.level || 1) * 1000} XP
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
                                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">{user?.rank || 'Estratega Junior'}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Próxima meta</p>
                                <h4 className="text-xl font-black text-emerald-400 italic uppercase">Senior Mastery</h4>
                            </div>
                        </div>

                        <div className="space-y-3 mb-12">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-1">
                                <span className="text-gray-500">Progreso de Nivel</span>
                                <span className="text-white font-black italic">{user?.xp || 0} / {(user?.level || 1) * 1000} XP</span>
                            </div>
                            <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(((user?.xp || 0) / ((user?.level || 1) * 1000)) * 100, 100)}%` }}
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
        }, 2000);
    };

    
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
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                                downloadSuccess 
                                ? 'bg-emerald-500 text-white' 
                                : isDownloading 
                                    ? 'bg-gray-200 text-gray-500 cursor-wait' 
                                    : 'bg-white text-black hover:scale-105 active:scale-95'
                            }`}
                        >
                            {isDownloading ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                            ) : downloadSuccess ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <FileText className="w-4 h-4" />
                            )}
                            {isDownloading ? 'Descargando...' : downloadSuccess ? '¡Completado!' : 'Bajar PDF Guía'}
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

function NotificationsView({ notifications, loading, onMarkAsRead }) {
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
                                
                                <div className="flex gap-4">
                                    {n.link && (
                                        <button 
                                            onClick={() => alert(`Iniciando acción estratégica: ${n.title}`)}
                                            className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-white/5"
                                        >
                                            EJECUTAR ACCIÓN ESTRATÉGICA &rarr;
                                        </button>
                                    )}
                                    {n.status === 'unread' && (
                                        <button 
                                            onClick={() => onMarkAsRead(n.id)}
                                            className="px-8 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white hover:text-black transition-all"
                                        >
                                            MARCAR COMO LEÍDA
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
function CMProfileView({ user }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="bg-gradient-to-br from-[#0E0E18] to-[#050511] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full" />
                
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-cyan-500/20">
                        {user?.full_name?.charAt(0) || "R"}
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">{user?.full_name || "Reyshell"}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="px-4 py-1 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest">Lead Estratega</span>
                            <span className="px-4 py-1 bg-white/5 border border-white/5 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">DIIC Zone HQ</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Ecosistemas</p>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter">14 ACTIVOS</h4>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Rendimiento</p>
                        <h4 className="text-2xl font-black text-emerald-400 italic tracking-tighter">98.4% SCORE</h4>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Sincronización</p>
                        <h4 className="text-2xl font-black text-cyan-400 italic tracking-tighter">NIVEL ÉLITE</h4>
                    </div>
                </div>
            </div>

            <div className="bg-[#0E0E18] border border-white/5 rounded-[3rem] p-10">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    Configuración de Operaciones
                </h3>
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm font-medium italic">Próximamente: Personalización de notificaciones y temas de workstation.</p>
                </div>
            </div>
        </div>
    );
}
