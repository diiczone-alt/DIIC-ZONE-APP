'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    LayoutDashboard, FolderOpen, Palette, Calendar,
    Share2, MessageSquare, BarChart3, ShieldCheck,
    CheckCircle2, Clock, AlertTriangle, Plus,
    Send, Eye, MoreHorizontal, ChevronRight as ChevronRightIcon,
    Bot, Users, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StrategyBoard from '../../shared/Strategy/StrategyBoard';
import ContentKanban from '../../shared/Kanban/ContentKanban';
import UnifiedCalendar from '../../calendar/UnifiedCalendar';
import { supabase } from '@/lib/supabase';




export default function CMWorkstationLayout() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'dashboard';

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
        fetchClients();
    }, [searchParams]);

    const fetchClients = async () => {
        setLoading(true);
        // In this workspace, Leslie is the main CM role
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('cm', 'Leslie');
        
        if (data) setClients(data);
        setLoading(false);
    };

    const menuItems = selectedClient ? [
        { id: 'dashboard', label: 'Dashboard Cliente', icon: LayoutDashboard },
        { id: 'projects', label: 'Proyectos', icon: FolderOpen },
        { id: 'contents', label: 'Contenidos (Kanban)', icon: LayoutDashboard }, // Placeholder for Kanban
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
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Leslie (Manager)</p>
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
                        "Que Leslie no edite, no diseñe, pero controle, organice, revise y haga que todo fluya."
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
                            {renderContent(activeTab, selectedClient, setSelectedClient, setActiveTab, clients, loading)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function renderContent(tab, selectedClient, setSelectedClient, setActiveTab, clients, loading) {
    if (!selectedClient) {
        if (tab === 'dashboard_cm') return <CMOverviewDashboard clients={clients} loading={loading} />;
        return (
            <CMSettingsClients 
                clients={clients} 
                loading={loading}
                onSelectClient={(client) => { 
                    setSelectedClient(client); 
                    setActiveTab('dashboard'); 
                }} 
            />
        );
    }

    switch (tab) {
        case 'dashboard': return <CMDashboard client={selectedClient} />;
        case 'projects': return <CMProjects client={selectedClient} />;
        case 'contents': return <ContentKanban role="cm" />;

        case 'chat': return <CommunicationCenter client={selectedClient} />;
        case 'meta': return <MetaAdsModule client={selectedClient} />;
        case 'calendar': return <UnifiedCalendar role="cm" />;

        case 'strategy': return <StrategyBoard role="cm" onClose={() => setActiveTab('dashboard')} />;

        case 'team': return <TeamView client={selectedClient} />;
        case 'reports': return <CMReports client={selectedClient} />;
        default: return <CMDashboard client={selectedClient} />;
    }
}

function CMDashboard() {
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
                        <ActivityItem text="Leslie aprobó 'Video Intro Branding'" time="Hace 2h" />
                        <ActivityItem text="Mateo G. reportó 'Grabación Completada'" time="Ayer" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CMProjects() {
    const [selectedProject, setSelectedProject] = useState(null);

    if (selectedProject) {
        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedProject(null)} className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1">
                    &larr; Volver a Proyectos
                </button>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{selectedProject.client}</h3>
                            <p className="text-sm text-gray-500">{selectedProject.type}</p>
                        </div>
                        <span className="px-4 py-1.5 bg-cyan-600/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
                            {selectedProject.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <FolderCard name="/Videos" count="12 archivos" icon={Eye} color="text-indigo-400" />
                        <FolderCard name="/Fotos" count="45 archivos" icon={Palette} color="text-pink-400" />
                        <FolderCard name="/Audios & SFX" count="5 archivos" icon={Plus} color="text-emerald-400" />
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
                {[
                    { client: 'Clínica Dental RM', type: 'Reel Producido', status: 'En revisión', responsible: 'Andrés V.' },
                    { client: 'Inmobiliaria City', type: 'Video Corporativo', status: 'Producción', responsible: 'Kevin R.' },
                    { client: 'Restaurante K', type: 'Social Content', status: 'Publicado', responsible: 'Leslie' },
                ].map((p, i) => (
                    <div key={i} onClick={() => setSelectedProject(p)} className="p-6 flex items-center justify-between hover:bg-white/[0.02] border-b border-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400">
                                <FolderOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{p.client}</h4>
                                <p className="text-xs text-gray-500">{p.type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Responsable</p>
                                <p className="text-xs text-white font-bold">{p.responsible}</p>
                            </div>
                            <div className="w-32">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'Publicado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                                    }`}>
                                    {p.status}
                                </span>
                            </div>
                            <MoreHorizontal className="w-5 h-5 text-gray-600 group-hover:text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
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
    )
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
    )
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
    )
}

function CheckItem({ label, completed }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${completed ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                {completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={`text-sm ${completed ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
        </div>
    )
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
    )
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
                        tasks={["Sesión Clínica RM (Pendiente)", "B-Roll Restaurante", "Entrevista Fundadora"]}
                        color="border-orange-500/30"
                    />
                </div>
            </div>

            {/* Reflection: How creatives see client messages */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Centro de Tickets (Visión Creativo)</h3>
                        <p className="text-xs text-gray-500 italic">Mensajes filtrados por Leslie antes de llegar al workstation creativo.</p>
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

function PublicationQueue() {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Cola de Publicación (Post-Vetting)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" /> Checklist Final (Pre-Post)
                    </h4>
                    <div className="space-y-3">
                        <CheckItem label="Caption & Copy optimizado para SEO" completed={true} />
                        <CheckItem label="Música de tendencia vinculada" completed={false} />
                        <CheckItem label="Hashtags y etiquetas de cuenta" completed={false} />
                        <CheckItem label="Portada (Thumbnail) de alto impacto" completed={false} />
                        <CheckItem label="Link en Bio / CTA activado" completed={false} />
                    </div>
                    <button className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all">
                        PUBLICAR AHORA
                    </button>
                    <button className="w-full mt-2 py-3 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-xl hover:text-white transition-all">
                        Programar
                    </button>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h4 className="text-white font-bold mb-4">Vista Previa</h4>
                    <div className="aspect-[9/16] bg-black/50 rounded-2xl flex items-center justify-center border border-white/5">
                        <p className="text-gray-500 text-xs italic">Simulador de Visualización Instagram</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommunityInbox() {
    return (
        <div className="flex flex-col h-full bg-[#0E0E18] rounded-3xl border border-white/5 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" /> Inbox de Comunidad (Unificado)
            </h3>
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-600/20 flex items-center justify-center text-cyan-400 font-bold text-xs">U{i}</div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Usuario Pregunta #{i}</h4>
                                <p className="text-xs text-gray-500">"Hola, ¿qué precio tiene el servicio dental?"</p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-cyan-600 rounded-lg text-white"><Send className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}




function CommunicationCenter({ client }) {
    const [subTab, setSubTab] = useState('ia'); // ia, cm, team
    const [showContextModal, setShowContextModal] = useState(false);

    const tabs = [
        { id: 'ia', label: 'Asistente IA', icon: Bot },
        { id: 'empresa', label: 'Chat Empresa / Marca', icon: MessageSquare },
        { id: 'team', label: 'Mi Equipo', icon: Palette },
    ];

    return (
        <div className="h-full flex flex-col bg-[#0E0E18] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Header Tabs */}
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

            {/* Content Area */}
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
                        {subTab === 'team' && <TeamChatView client={client} onSend={() => setShowContextModal(true)} />}
                    </motion.div>
                </AnimatePresence>

                {/* Input Bar (Simplified) */}
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

            {/* Context Modal */}
            {showContextModal && (
                <MessageContextModal onClose={() => setShowContextModal(false)} />
            )}
        </div>
    );
}

function AIChatView() {
    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 shrink-0">
                    <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-4 max-w-[85%]">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 rounded-tl-none backdrop-blur-md">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            ¡Hola, Leslie! Soy tu **Estratega IA**. He analizado los datos de **Clínica Dental RM** y observo un incremento del 15% en engagement. 
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
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Leslie Online (CM)</span>
                </div>
            </div>
            <p className="text-[11px] text-gray-600 max-w-xs text-center leading-relaxed">
                Aquí es donde Leslie (Tú) se comunica directamente con la marca para coordinar la ejecución estratégica.
            </p>
        </div>
    );
}

function TeamChatView({ client, onSend }) {
    const [subTab, setSubTab] = useState('formats'); // formats, individuals

    const team = [
        { name: 'Andrés Vera', role: 'Editor Video', status: 'En producción', avatar: 'AV' },
        { name: 'Mateo G.', role: 'Diseñador', status: 'Disponible', avatar: 'MG' },
        { name: 'Kevin R.', role: 'Filmmaker', status: 'En revisión', avatar: 'KR' },
    ];

    return (
        <div className="space-y-8">
            {/* Format Selectors */}
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

            {/* Individual Cards */}
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
                    <p className="text-gray-500 text-sm italic">Para que no sea caos, Leslie necesita contexto antes de enviar.</p>
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

function TeamView({ client }) {
    const team = [
        { name: 'Andrés Vera', role: 'Editor de Video', load: 85, status: 'Online' },
        { name: 'Mateo G.', role: 'Diseñador', load: 40, status: 'Busy' },
        { name: 'Kevin R.', role: 'Filmmaker', load: 15, status: 'Offline' },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-2">Equipo Asignado a {client.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member, i) => (
                    <div key={i} className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{member.name}</h4>
                                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{member.role}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                                    <span className="text-gray-500">Carga de Trabajo</span>
                                    <span className={member.load > 80 ? 'text-red-400' : 'text-emerald-400'}>{member.load}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${member.load > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${member.load}%` }} />
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-bold uppercase pt-4 border-t border-white/5">
                                <span className="text-gray-500">Estado</span>
                                <span className={member.status === 'Online' ? 'text-emerald-400' : 'text-gray-500'}>● {member.status}</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                            Enviar Guía de Edición
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CMOverviewDashboard({ clients, loading }) {
    const stats = [
        { label: 'Contenidos Activos', value: clients.reduce((acc, c) => acc + (c.projects || 0), 0).toString(), icon: FileText, color: 'text-cyan-400' },
        { label: 'Campañas en Curso', value: '3', icon: Share2, color: 'text-purple-400' },
        { label: 'Marcas Activas', value: clients.filter(c => c.status === 'active').length.toString(), icon: ShieldCheck, color: 'text-emerald-400' },
        { label: 'Alertas de Hoy', value: '2', icon: AlertTriangle, color: 'text-red-400' },
    ];

    if (loading) return <div className="h-full flex items-center justify-center text-cyan-400 italic">Sincronizando con Admin HQ...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">¡Hola, Leslie!</h2>
                    <p className="text-gray-500 italic">Aquí tienes el pulso general de tus {clients.length} marcas asignadas.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-balance">Limit: {clients.length}/10 Clientes Capacidad</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[#0E0E18] border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all">
                        <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                        <h4 className="text-3xl font-bold text-white mb-1">{stat.value}</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Critical Alerts */}
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
    const ads = [
        { id: 1, name: 'Campaña Limpieza', status: 'Activo', reach: '12.4K', clicks: 840, leads: 12, budget: '$450/mo' },
        { id: 2, name: 'Blanqueamiento PRO', status: 'Pausado', reach: '5.2K', clicks: 120, leads: 3, budget: '$200/mo' },
    ];

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
                    <div key={ad.id} className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 hover:border-cyan-500/20 transition-all">
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

                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Alcance</p>
                                <p className="text-lg font-bold text-white">{ad.reach}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Clics</p>
                                <p className="text-lg font-bold text-white">{ad.clicks}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Leads</p>
                                <p className="text-lg font-bold text-white">{ad.leads}</p>
                            </div>
                            <div className="p-4 bg-cyan-600/10 rounded-2xl border border-cyan-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-cyan-600/20 transition-all">
                                <p className="text-[10px] text-cyan-400 font-bold uppercase">Optimizar</p>
                                <p className="text-[9px] text-cyan-400/60 italic">IA Sugiere: +5% Presupuesto</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl italic text-[11px] text-indigo-400 font-medium">
                💡 **Estrategia CM:** Los leads de "Campaña Limpieza" están costando $2 menos que el promedio. Considera mover presupuesto orgánico a este anuncio.
            </div>
        </div>
    );
}

function CMReports({ client }) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Reportes Automáticos</h2>
                    <p className="text-gray-500 italic">Leslie, genera reportes visuales y compártelos por WhatsApp en un clic.</p>
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

function CMSettingsClients({ clients, onSelectClient, loading }) {
    if (loading) return <div className="h-full flex items-center justify-center text-cyan-400 italic font-bold">Conectando con DIIC ADMIN...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Empresas Asignadas</h2>
                <p className="text-gray-500 italic">Leslie, selecciona una empresa para comenzar a sincronizar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <motion.div
                        key={client.id}
                        whileHover={{ y: -5 }}
                        onClick={() => onSelectClient(client)}
                        className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 cursor-pointer group hover:border-cyan-500/30 transition-all shadow-2xl relative overflow-hidden"
                    >
                        {/* Priority Batch */}
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
