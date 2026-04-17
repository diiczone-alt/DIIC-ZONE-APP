'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    LayoutDashboard, Users, Calendar, BarChart3, 
    Settings, Search, Bell, Mail, Plus,
    ExternalLink, CheckCircle2, AlertTriangle, 
    Smartphone, Globe, MessageSquare, Share2, Database,
    MoreHorizontal, Filter, Play, Check, ChevronRight as ChevronRightIcon, X,
    FolderOpen, Palette, Clock, Bot, FileText
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

    const { user } = useAuth();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
        
        if (user) {
            if (user.full_name) {
                fetchClients();
                if (user.team_id) fetchSquad(user.team_id);
            } else {
                // Si el usuario existe pero no tiene nombre, liberamos carga para mostrar estado vacío/error
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
        // Filtramos por el nombre del CM logueado
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('cm', user.full_name);
        
        if (data) setClients(data);
        setLoading(false);
    };

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
    ];

    // Guard de Autenticación - Si no hay usuario logueado después de cargar, mostramos error de acceso
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

    return (
        <div className="flex h-full bg-[#050511] overflow-hidden">
            {/* Inner Sidebar for Workstation */}
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

                {/* Objective Card */}
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

            {/* Main Content Area */}
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
                            {renderContent(activeTab, selectedClient, setSelectedClient, setActiveTab, clients, loading, clientTasks, loadingTasks, user, squad)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function renderContent(tab, selectedClient, setSelectedClient, setActiveTab, clients, loading, clientTasks, loadingTasks, user, squad) {
    if (!selectedClient) {
        if (tab === 'dashboard_cm') return <CMOverviewDashboard clients={clients} loading={loading} />;
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
                {/* Pending Tasks Checklist */}
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

                {/* Recent Activity */}
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

                    <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center group hover:border-cyan-500/50 transition-all cursor-pointer bg-white/[0.01]">
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
                <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-600/20">
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

function FolderCard({ name, count, color }) {
    return (
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                    <FolderOpen className="w-5 h-5" />
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
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all cursor-pointer">
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
        <div className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer">
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
    const { user } = useAuth();
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
                        <p className="text-xs text-gray-500 italic">Mensajes filtrados por {user?.full_name?.split(' ')[0] || 'el CM'} antes de llegar al workstation creativo.</p>
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
                                    <button className="flex-1 py-2 bg-cyan-600 rounded-lg text-[10px] font-bold text-white hover:bg-cyan-500">RESPONDER</button>
                                    <button className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white">CONVERTIR EN TAREA</button>
                                    <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-orange-400 transition-colors"><AlertTriangle className="w-3.5 h-3.5" /></button>
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
            <button className="w-full mt-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
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
                        <button className="text-left px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-[11px] text-cyan-400 font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-between group">
                            <span>"Generar reporte de desempeño semanal"</span>
                            <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="text-left px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-gray-400 font-bold hover:text-white transition-all flex items-center justify-between group">
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
                <button className="flex-1 p-4 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl text-center group hover:bg-cyan-600/20 transition-all">
                    <h4 className="text-xs font-bold text-cyan-400 mb-1">Chat General</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Proyecto Completo</p>
                </button>
                <button className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-center group hover:bg-white/10 transition-all">
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
                                    <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
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
                    <p className="text-gray-500 text-sm italic">Para que no sea caos, {user?.full_name?.split(' ')[0] || 'el CM'} necesita contexto antes de enviar.</p>
                </div>

                <div className="p-8 grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {contexts.map(ctx => (
                        <button
                            key={ctx.id}
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
                    <button className="flex-[2] py-4 bg-cyan-600 rounded-2xl text-xs font-bold text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 transition-all">
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

    // Helper to find specific squad member by role
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

                                <button className="w-full mt-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest">
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
                        <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Gestionar</button>
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
                <button className="px-6 py-3 bg-cyan-600 rounded-2xl text-[11px] font-bold text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20">
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
                            {/* Main Metrics */}
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

                            {/* Advanced Metrics Render */}
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

                            <div className="flex gap-2">
                                {/* Plus Selector Toggle */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowSelectorFor(showSelectorFor === ad.id ? null : ad.id)}
                                        className={`w-full h-full aspect-square min-w-[56px] rounded-2xl border transition-all flex items-center justify-center ${showSelectorFor === ad.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400'}`}
                                    >
                                        {showSelectorFor === ad.id ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                    </button>

                                    {/* Selector Menu Popover */}
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

                                {/* Optimization Suggestion */}
                                <div className="flex-1 min-w-[160px] p-4 bg-cyan-600/10 rounded-2xl border border-cyan-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-cyan-600/20 transition-all group">
                                    <div className="flex items-center justify-center gap-2">
                                        <Zap className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-cyan-400 font-bold uppercase">Optimizar</p>
                                    </div>
                                    <p className="text-[9px] text-cyan-400/60 italic">IA Sugiere: +5% Presupuesto</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl italic text-[11px] text-indigo-400 font-medium flex items-center gap-3">
                <span className="text-lg">💡</span>
                <p>
                    **Estrategia CM:** Los leads de "Campaña Limpieza" están costando $2 menos que el promedio. Considera mover presupuesto orgánico a este anuncio.
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
                        <button className="flex-1 py-3 bg-cyan-600 rounded-xl text-[10px] font-bold text-white hover:bg-cyan-500 transition-all">GENERAL PDF</button>
                        <button className="flex-1 py-3 bg-emerald-600 rounded-xl text-[10px] font-bold text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
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
                        <button className="flex-1 py-3 bg-purple-600 rounded-xl text-[10px] font-bold text-white hover:bg-purple-500 transition-all">GENERAL PDF</button>
                        <button className="flex-1 py-3 bg-emerald-600 rounded-xl text-[10px] font-bold text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
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
