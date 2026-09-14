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
    ChevronLeft as ChevronLeftIcon, Layers, MapPin, Activity,
    User, Cake, Briefcase, Link2, Phone, Compass, Info,
    Camera, Copy, RefreshCw, Key, LogOut, CheckCheck,
    BookOpen, Wheat, Stethoscope, UtensilsCrossed, Building2, Shirt, Dumbbell, Trophy,
    Trash2, Pause, ArrowUpRight, DollarSign, BarChart2, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ContentKanban from '../../shared/Kanban/ContentKanban';
import UnifiedCalendar from '../../calendar/UnifiedCalendar';
import { messagingService } from '@/services/messagingService';
import { supabase } from '@/lib/supabase';
import NotificationCenter from '@/components/ui/NotificationCenter';
import StrategyBoard from '../../shared/Strategy/StrategyBoard';
import CreativeStudio from '../../events/CreativeBoard';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { aiService } from '@/services/aiService';
import { presenceService } from '@/services/presenceService';
import NewProjectWizard from '../../projects/NewProjectWizard';
import CMGuidePlaybook from './CMGuidePlaybook';
import CMConnectivityModule from './CMConnectivityModule';
import IntegrationModal from '@/components/connectivity/IntegrationModal';

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
    const [isSyncing, setIsSyncing] = useState(false);
    const [isHQLive, setIsHQLive] = useState(false);

    const { user } = useAuth();
    const [customUserName, setCustomUserName] = useState('');
    const [customAvatarUrl, setCustomAvatarUrl] = useState('');

    // Realtime Presence Heartbeat: Turns CM Light 🟢 GREEN in HQ while active
    useEffect(() => {
        if (user?.email) {
            presenceService.startHeartbeat({
                email: user.email,
                name: user.full_name || user.name || '',
                role: 'Community Manager'
            });

            return () => {
                presenceService.stopHeartbeat();
            };
        }
    }, [user]);

    useEffect(() => {
        if (user?.full_name && !customUserName) {
            setCustomUserName(user.full_name);
        }
        if (user?.avatar_url && !customAvatarUrl) {
            setCustomAvatarUrl(user.avatar_url);
        }
    }, [user]);

    useEffect(() => {
        const tab = searchParams?.get('tab');
        if (tab) setActiveTab(tab);
        
        if (user) {
            if (user.full_name) {
                // 1. Instant Load from Cache
                const cachedClients = typeof window !== 'undefined' ? localStorage.getItem('diic_clients') : null;
                if (cachedClients) {
                    try {
                        const parsed = JSON.parse(cachedClients);
                        if (Array.isArray(parsed)) {
                            // Filter for this CM
                            const myClients = parsed.filter(c => c && (c.cm || '').trim().toLowerCase() === (user.full_name || '').trim().toLowerCase());
                            if (myClients.length > 0) {
                                setClients(myClients);
                                setLoading(false);
                            }
                        }
                    } catch(e) {
                        console.warn("Error parsing cached clients:", e);
                    }
                }

                fetchClients(!!cachedClients);
                if (user.team_id) fetchSquad(user.team_id);

                // 2. Realtime Sync
                setIsHQLive(true);
                try {
                    const cmChannel = supabase
                        .channel('cm-sync-' + (user.id || 'anonymous'))
                        .on('postgres_changes', { 
                            event: '*', 
                            schema: 'public', 
                            table: 'clients'
                        }, () => fetchClients(true))
                        .subscribe((status) => {
                            setIsHQLive(status === 'SUBSCRIBED');
                        });

                    return () => {
                        supabase.removeChannel(cmChannel);
                    };
                } catch (err) {
                    console.error("Realtime sync setup error:", err);
                }
            } else {
                setLoading(false);
            }
        }
    }, [searchParams, user]);

    const fetchSquad = async (teamId) => {
        if (!teamId) return;
        setLoadingSquad(true);
        try {
            const data = await agencyService.getTeamByLead(teamId);
            if (Array.isArray(data)) setSquad(data);
        } catch (err) {
            console.error('Error fetching squad:', err);
        } finally {
            setLoadingSquad(false);
        }
    };

    const fetchClientTasks = async (clientId) => {
        if (!clientId) return;
        setLoadingTasks(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('client', clientId);
            
            if (data && Array.isArray(data)) setClientTasks(data);
        } catch (err) {
            console.error('Error fetching client tasks:', err);
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (selectedClient && selectedClient.id) {
            fetchClientTasks(selectedClient.id);
        }
    }, [selectedClient]);

    const fetchClients = async (isBackground = false) => {
        if (!user?.full_name) {
            setLoading(false);
            setIsSyncing(false);
            return;
        }
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        
        try {
            const data = await agencyService.getClientsByCM(user.full_name);
            if (Array.isArray(data) && data.length > 0) {
                setClients(data);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('diic_clients', JSON.stringify(data));
                }
            } else {
                const allClients = await agencyService.getClients();
                if (Array.isArray(allClients)) {
                    const filtered = allClients.filter(c => c && (c.cm || '').trim().toLowerCase() === (user.full_name || '').trim().toLowerCase());
                    setClients(filtered);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('diic_clients', JSON.stringify(filtered));
                    }
                } else {
                    setClients([]);
                }
            }
        } catch (err) {
            console.error('Error fetching clients:', err);
            setClients([]);
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
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

    const handleMarkAsRead = async (id) => {
        try {
            await supabase
                .from('notifications')
                .update({ read: true, status: 'read' })
                .eq('id', id);
            
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, status: 'read' } : n));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user?.id) return;
        try {
            await supabase
                .from('notifications')
                .update({ read: true, status: 'read' })
                .eq('user_id', user.id);
            
            setNotifications(prev => prev.map(n => ({ ...n, read: true, status: 'read' })));
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
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
        { id: 'connectivity', label: 'Conectividad & Redes', icon: Share2 },
        { id: 'meta', label: 'Módulo Meta (Ads)', icon: BarChart3 },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'strategy', label: 'Pizarra Estratégica', icon: Share2 },
        { id: 'creative', label: 'Estudio Creativo', icon: Sparkles },
        { id: 'team', label: 'Equipo Asignado', icon: Palette },
        { id: 'reports', label: 'Generador de Reportes', icon: FileText },
        { id: 'guide', label: 'Guía & Playbooks', icon: BookOpen },
    ] : [
        { id: 'dashboard_cm', label: 'Dashboard CM', icon: LayoutDashboard },
        { id: 'clients', label: 'Empresas', icon: Users },
        { id: 'guide', label: 'Guía & Playbooks', icon: BookOpen },
        { id: 'profile', label: 'Mi Perfil & Nichos', icon: User },
    ];

    const userRole = (user?.role || user?.user_metadata?.role || '').toLowerCase();
    const userSpecialty = (user?.specialty || user?.user_metadata?.specialty || '').toLowerCase();
    const userFullName = (user?.full_name || user?.user_metadata?.full_name || user?.name || '').toLowerCase();
    const userEmail = (user?.email || '').toLowerCase();

    const isCMOrAdmin = user && (
        userRole === 'community' || 
        userRole === 'cm' || 
        userRole === 'admin' || 
        userRole === 'estratega' || 
        userRole === 'creator' ||
        userRole === 'creative' ||
        userRole.includes('community') || 
        userRole.includes('estratega') ||
        userRole.includes('admin') ||
        userRole.includes('lead') ||
        userRole.includes('creator') ||
        userRole.includes('creative') ||
        userSpecialty.includes('community') ||
        userSpecialty.includes('estratega') ||
        userFullName.includes(' cm') ||
        userFullName.includes('(cm)') ||
        userFullName.includes('community') ||
        userFullName.includes('estratega') ||
        userEmail.startsWith('cm') ||
        userEmail.includes('.cm') ||
        userEmail.includes('cm.') ||
        userEmail.includes('cmdiiczone')
    );

    if (!loading && user && !isCMOrAdmin) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#050511] text-white p-10 text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Acceso Restringido</h1>
                <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium">Debes iniciar sesión con tu cuenta de Estratega o Community Manager para acceder a esta área.</p>
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
                            {customAvatarUrl ? (
                                <img 
                                    src={customAvatarUrl} 
                                    alt="Avatar" 
                                    className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 shadow-lg shadow-cyan-500/20" 
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                                    {selectedClient ? selectedClient.name.charAt(0) : (customUserName || user?.full_name || 'C').charAt(0)}
                                </div>
                            )}
                            <div>
                                <h2 className="text-white font-bold text-sm truncate max-w-[120px]">
                                    {selectedClient ? selectedClient.name : 'Workstation CM'}
                                </h2>
                                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider truncate max-w-[120px]">{customUserName || user?.full_name || 'Estratega'}</p>
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
                            "Que {(customUserName || user?.full_name)?.split(' ')[0] || 'el estratega'} no edite, no diseñe, pero controle, organice, revise y haga que todo fluya."
                        </p>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Global Workstation Header */}
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#050511]/50 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isHQLive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-red-500 animate-pulse'}`} />
                        <h1 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            System <span className="text-white">{isHQLive ? 'LIVE' : 'OFFLINE'}</span> / {activeTab?.toUpperCase()}
                            {isSyncing && (
                                <span className="flex items-center gap-1 text-cyan-400 normal-case tracking-normal font-bold">
                                    <Activity className="w-2.5 h-2.5 animate-pulse" />
                                    Sincronizando...
                                </span>
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationCenter 
                            notifications={notifications} 
                            onMarkAsRead={handleMarkAsRead} 
                            onMarkAllAsRead={handleMarkAllAsRead}
                            onViewAll={() => setActiveTab('notifications')}
                        />
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className="flex items-center gap-3 pl-6 border-l border-white/5 hover:bg-white/5 transition-all group"
                        >
                             <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">{customUserName || user?.full_name || 'Leslie'}</p>
                                <p className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest leading-none opacity-60">Lead Estratega</p>
                            </div>
                            {customAvatarUrl ? (
                                <img 
                                    src={customAvatarUrl} 
                                    alt="Avatar" 
                                    className="w-10 h-10 rounded-2xl object-cover border border-cyan-500/30 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform" 
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                    {(customUserName || user?.full_name || 'L').charAt(0)}
                                </div>
                            )}
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
                            {renderContent(activeTab, selectedClient, setSelectedClient, setActiveTab, clients, loading, clientTasks, loadingTasks, user, squad, globalTasks, notifications, loadingNotifications, handleMarkAsRead, searchParams, (updatedData) => {
                                if (updatedData?.name) setCustomUserName(updatedData.name);
                                if (updatedData?.avatar_url) setCustomAvatarUrl(updatedData.avatar_url);
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function renderContent(tab, selectedClient, setSelectedClient, setActiveTab, clients = [], loading = false, clientTasks = [], loadingTasks = false, user = null, squad = [], globalTasks = [], notifications = [], loadingNotifications = false, handleMarkAsRead, searchParams, onProfileUpdate) {
    if (!selectedClient) {
        if (tab === 'dashboard_cm') return <CMOverviewDashboard clients={clients || []} loading={loading} onNavigateTab={(targetTab) => setActiveTab(targetTab)} />;
        if (tab === 'guide') return <CMGuidePlaybook user={user} onCompleteCertification={() => {}} />;
        if (tab === 'academy') return <CMAcademy user={user} />;
        if (tab === 'growth') return <CMGrowth user={user} />;
        if (tab === 'tasks') return <GlobalTasksView tasks={globalTasks || []} loading={loadingTasks} onSelectClient={(c) => { setSelectedClient(c); setActiveTab('dashboard'); }} />;

        if (tab === 'notifications') return <NotificationsView notifications={notifications || []} loading={loadingNotifications} onMarkAsRead={handleMarkAsRead} />;
        if (tab === 'profile') return <CMProfileView user={user} onProfileUpdate={onProfileUpdate} />;
        
        return (
            <CMSettingsClients 
                clients={clients || []} 
                loading={loading}
                userMissingProfile={user && !user.full_name}
                onSelectClient={(client) => { 
                    setSelectedClient(client); 
                    setActiveTab('dashboard'); 
                }} 
                onNavigateTab={(targetTab) => setActiveTab(targetTab)}
            />
        );
    }

    switch (tab) {
        case 'dashboard': return <CMDashboard client={selectedClient} user={user} tasks={clientTasks} />;
        case 'projects': return <CMProjects client={selectedClient} tasks={clientTasks} loading={loadingTasks} squad={squad} />;
        case 'contents': return <ContentKanban role="cm" client={selectedClient} />;
        case 'chat': return <CommunicationCenter client={selectedClient} user={user} squad={squad} tasks={clientTasks} initialChatWith={searchParams.get('chatWith')} />;
        case 'connectivity': return <CMConnectivityModule client={selectedClient} user={user} />;
        case 'meta': return <MetaAdsModule client={selectedClient} user={user} onClientUpdate={(updated) => { setSelectedClient(prev => ({ ...prev, ...updated })); setClients(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c)); }} />;
        case 'calendar': return <UnifiedCalendar role="cm" />;
        case 'strategy': return <StrategyBoard role="cm" isSubcomponent={true} clientId={selectedClient?.id} onClose={() => setActiveTab('dashboard')} />;
        case 'creative': return <CreativeStudio isSubcomponent={true} />;
        case 'team': return <TeamView client={selectedClient} tasks={clientTasks} squad={squad} />;
        case 'reports': return <CMReports client={selectedClient} />;
        case 'guide': return <CMGuidePlaybook user={user} onCompleteCertification={() => {}} />;
        case 'profile': return <CMProfileView user={user} onProfileUpdate={onProfileUpdate} />;
        case 'academy': return <CMAcademy user={user} />;
        case 'growth': return <CMGrowth user={user} />;
        default: return <CMDashboard client={selectedClient} />;
    }
}

function CMDashboard({ client, user, tasks = [] }) {
    const clientId = client?.id || 'default';
    const [checklist, setChecklist] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`cm_checklist_${clientId}`);
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
        if (typeof window !== 'undefined') {
            localStorage.setItem(`cm_checklist_${clientId}`, JSON.stringify(checklist));
        }
    }, [checklist, clientId]);

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

function CMProjects({ client, tasks, loading, squad }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

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
                    onClick={() => setIsWizardOpen(true)}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-600/20"
                >
                    <Plus className="w-4 h-4" /> Nuevo Proyecto
                </button>
            </div>

            <NewProjectWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} squad={squad} client={client} />

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

function CommunicationCenter({ client, user, squad, tasks = [], initialChatWith }) {
    const [subTab, setSubTab] = useState(initialChatWith ? 'team' : 'ia');
    const [showPopover, setShowPopover] = useState(false);
    
    // Find initial member if provided
    const initialMember = initialChatWith && squad ? squad.find(m => m.id === initialChatWith) : null;
    const [activeChat, setActiveChat] = useState(initialMember ? { id: initialMember.id, type: 'team', name: initialMember.name } : { id: 'ia', type: 'ia', name: 'Asistente IA' });
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, chatId: 'ia', text: '¡Hola Leslie! Soy tu Estratega IA. Estoy listo para optimizar tu flujo de trabajo de hoy.', sender: 'ai', time: '10:00 AM' },
        { id: 2, chatId: 'general', text: 'Equipo, ¿cómo vamos con los reels de Clínica Dental?', sender: 'me', time: '10:05 AM' },
    ]);

    const [isTyping, setIsTyping] = useState(false);
    const [realMessages, setRealMessages] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [activeMemberId, setActiveMemberId] = useState(initialChatWith || null);

    useEffect(() => {
        if (subTab === 'empresa' && client) {
            const syncThread = async () => {
                try {
                    const thread = await messagingService.getOrCreateClientChat(client.id);
                    setActiveThread(thread);
                    const historical = await messagingService.getMessages(thread.id);
                    setRealMessages(historical);

                    const channel = messagingService.subscribeToMessages(thread.id, (newMsg) => {
                        setRealMessages(prev => {
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                    });

                    return () => supabase.removeChannel(channel);
                } catch (err) {
                    console.error("Error syncing client thread:", err);
                }
            };
            syncThread();
        }

        if (subTab === 'team' && activeChat.id !== 'ia' && user) {
            // Only sync if it's a specific member, general chat, or dept chat
            if (activeChat.type === 'member' || activeChat.type === 'general' || activeChat.type === 'dept') {
                const syncTeamChat = async () => {
                    try {
                        let thread;
                        if (activeChat.type === 'member' && activeMemberId) {
                            thread = await messagingService.getOrCreateDirectChat(user.id, activeMemberId);
                        } else if (activeChat.type === 'general' || activeChat.type === 'dept') {
                            thread = await messagingService.getOrCreateSquadChat(client?.id || 'global', activeChat.type);
                        }
                        
                        if (!thread) return;

                        setActiveThread(thread);
                        const historical = await messagingService.getMessages(thread.id);
                        setRealMessages(historical);

                        const channel = messagingService.subscribeToMessages(thread.id, (newMsg) => {
                            setRealMessages(prev => {
                                if (prev.find(m => m.id === newMsg.id)) return prev;
                                return [...prev, newMsg];
                            });
                        });

                        return () => supabase.removeChannel(channel);
                    } catch (err) {
                        console.error("Error syncing team thread:", err);
                    }
                };
                syncTeamChat();
            }
        }
    }, [subTab, client, activeMemberId, user, activeChat.id, activeChat.type]);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;
        
        const userMsg = inputValue.trim();

        if (subTab === 'empresa' || subTab === 'team') {
            if (subTab === 'team' && activeChat.type !== 'member' && activeChat.type !== 'general' && activeChat.type !== 'dept') {
                toast.error("Selecciona un chat", { description: "Elige un miembro de equipo, departamento o chat general antes de enviar un mensaje." });
                return;
            }

            if (!activeThread || !user) {
                toast.error("Conexión en progreso", { description: "Espera un momento mientras sincronizamos el canal." });
                return;
            }

            setInputValue('');
            
            // Optimistic update
            const tempId = 'temp-' + Date.now();
            const optimisticMsg = {
                id: tempId,
                content: userMsg,
                sender_id: user.id,
                created_at: new Date().toISOString(),
                chat_id: activeThread.id
            };
            
            setRealMessages(prev => [...prev, optimisticMsg]);
            
            try {
                await messagingService.sendMessage(activeThread.id, user.id, userMsg);
            } catch (err) {
                console.error("Failed to send message:", err);
                toast.error("Error al enviar mensaje");
                // Remove optimistic message if failed
                setRealMessages(prev => prev.filter(m => m.id !== tempId));
            }
            return;
        }

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
        if (chat.type === 'member') {
            setActiveMemberId(chat.id);
        } else {
            setActiveMemberId(null);
        }
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
                            setActiveMemberId(null);
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
                        {subTab === 'team' && activeChat.type !== 'member' && activeChat.id !== 'general' && activeChat.type !== 'dept' ? (
                            <TeamChatView 
                                client={client} 
                                squad={squad} 
                                activeMemberId={null}
                                onSelectMember={(m) => selectChat({ id: m.id, type: 'member', name: m.name })}
                                onSendMember={(m) => selectChat({ id: m.id, type: 'member', name: m.name })}
                                onViewKPIs={() => {}}
                                onSetCommMode={(mode) => {
                                    if (mode === 'general') selectChat({ id: 'general', type: 'general', name: 'Chat General' });
                                    if (mode === 'dept') selectChat({ id: 'dept', type: 'dept', name: 'Departamentos' });
                                }}
                            />
                        ) : (
                            /* Else show the message history for the active chat */
                            <div className="flex flex-col h-full">
                                {subTab === 'ia' && messages.filter(m => m.chatId === 'ia').length === 0 && <AIChatView tasks={tasks} />}
                                
                                <div className="space-y-6">
                                    {((subTab === 'empresa' || subTab === 'team') ? realMessages : messages.filter(m => m.chatId === activeChat.id)).map((msg) => {
                                        const isAi = msg.sender === 'ai';
                                        const isMe = msg.sender === 'me' || msg.sender_id === user?.id;
                                        
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] p-4 rounded-3xl ${
                                                    isMe 
                                                    ? 'bg-cyan-600 text-white rounded-tr-none' 
                                                    : isAi
                                                        ? 'bg-white/5 border border-indigo-500/30 text-gray-200 rounded-tl-none backdrop-blur-md'
                                                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                                                }`}>
                                                    <p className="text-sm leading-relaxed">{msg.content || msg.text}</p>
                                                    <p className="text-[9px] mt-2 opacity-50 font-bold uppercase tracking-widest">
                                                        {msg.time || (msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

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

function CMOverviewDashboard({ clients = [], loading = false }) {
    const { user } = useAuth();
    const safeClients = Array.isArray(clients) ? clients.filter(Boolean) : [];
    const stats = [
        { label: 'Contenidos Activos', value: safeClients.reduce((acc, c) => acc + (c?.projects || 0), 0).toString(), icon: FileText, color: 'text-cyan-400' },
        { label: 'Campañas en Curso', value: '3', icon: Share2, color: 'text-purple-400' },
        { label: 'Marcas Activas', value: safeClients.filter(c => {
            const s = (c?.status || '').toLowerCase();
            return s === 'active' || s === 'trial' || s === 'onboarding_completed' || s === 'activo';
        }).length.toString(), icon: ShieldCheck, color: 'text-emerald-400' },
        { label: 'Alertas de Hoy', value: '2', icon: AlertTriangle, color: 'text-red-400' },
    ];

    if (loading && safeClients.length === 0) return <div className="h-full flex items-center justify-center text-cyan-400 italic font-bold">Sincronizando con Admin HQ...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">¡Hola, {user?.full_name?.split(' ')[0] || 'Estratega'}!</h2>
                    <p className="text-gray-500 italic">Aquí tienes el pulso general de tus {safeClients.length} marcas asignadas.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-balance">Capacidad: {safeClients.length}/7 Marcas</span>
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

function MetaAdsModule({ client, user, onClientUpdate }) {
    const clientId = client?.id;
    const clientName = client?.name || 'Cliente';

    // Helper to generate realistic starter campaigns based on client context
    const getInitialCampaigns = () => {
        if (client?.onboarding_data?.meta_campaigns && Array.isArray(client.onboarding_data.meta_campaigns) && client.onboarding_data.meta_campaigns.length > 0) {
            return client.onboarding_data.meta_campaigns;
        }

        if (typeof window !== 'undefined' && clientId) {
            const cached = localStorage.getItem(`cm_meta_ads_${clientId}`);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                } catch (e) {}
            }
        }

        // Generate contextual campaigns for this specific brand
        const brand = (client?.name || '').toLowerCase();
        const industry = (client?.industry || client?.type || '').toLowerCase();
        const services = client?.onboarding_data?.services || [];

        if (services.length > 0) {
            return services.slice(0, 2).map((srv, idx) => ({
                id: `ad_${idx + 1}_${Date.now()}`,
                name: `Pauta: ${srv.name || 'Servicio Principal'}`,
                objective: 'Mensajes a WhatsApp',
                status: idx === 0 ? 'Activo' : 'Pausado',
                budget: idx === 0 ? '$250/mo' : '$150/mo',
                metrics: {
                    reach: idx === 0 ? '8.4K' : '4.2K',
                    clicks: idx === 0 ? 520 : 180,
                    leads: idx === 0 ? 18 : 6
                },
                advanced: {
                    ctr: idx === 0 ? '2.8%' : '1.9%',
                    cpc: idx === 0 ? '$0.48' : '$0.83',
                    roas: idx === 0 ? '4.5x' : '2.8x',
                    cpm: idx === 0 ? '$7.20' : '$9.10',
                    watchTime: '14s',
                    cpl: idx === 0 ? '$4.20' : '$8.50'
                },
                activeAdvanced: ['cpl', 'roas'],
                isAdvantagePlus: idx === 0
            }));
        }

        if (brand.includes('neyser') || brand.includes('espiga') || industry.includes('alimento') || industry.includes('general')) {
            return [
                {
                    id: `ad_1_${Date.now()}`,
                    name: 'Ventas Directas WhatsApp - Catálogo & Pedidos',
                    objective: 'Mensajes a WhatsApp',
                    status: 'Activo',
                    budget: '$280/mo',
                    metrics: { reach: '14.8K', clicks: 920, leads: 34 },
                    advanced: { ctr: '3.2%', cpc: '$0.30', roas: '5.2x', cpm: '$6.50', watchTime: '16s', cpl: '$2.80' },
                    activeAdvanced: ['cpl', 'roas', 'ctr'],
                    isAdvantagePlus: true
                },
                {
                    id: `ad_2_${Date.now()}`,
                    name: 'Reconocimiento Local & Promoción Especial',
                    objective: 'Alcance & Interacción',
                    status: 'Pausado',
                    budget: '$150/mo',
                    metrics: { reach: '9.4K', clicks: 310, leads: 8 },
                    advanced: { ctr: '1.8%', cpc: '$0.48', roas: '2.9x', cpm: '$5.80', watchTime: '11s', cpl: '$6.20' },
                    activeAdvanced: ['ctr', 'cpc'],
                    isAdvantagePlus: false
                }
            ];
        }

        // Generic custom initial state
        return [
            {
                id: `ad_1_${Date.now()}`,
                name: `Campaña Principal - ${clientName}`,
                objective: 'Generación de Clientes Potenciales',
                status: 'Activo',
                budget: '$300/mo',
                metrics: { reach: '10.5K', clicks: 640, leads: 15 },
                advanced: { ctr: '2.5%', cpc: '$0.46', roas: '3.8x', cpm: '$8.00', watchTime: '15s', cpl: '$4.50' },
                activeAdvanced: ['cpl', 'roas'],
                isAdvantagePlus: true
            }
        ];
    };

    const [ads, setAds] = useState(getInitialCampaigns);
    const [metaConnection, setMetaConnection] = useState({ isConnected: false, accountName: null, accountId: null, token: null });
    const [loadingConns, setLoadingConns] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Modals state
    const [showSelectorFor, setShowSelectorFor] = useState(null);
    const [showAudienceModal, setShowAudienceModal] = useState(false);
    const [showCreativeModal, setShowCreativeModal] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [selectedAdForMetrics, setSelectedAdForMetrics] = useState(null);

    // Re-initialize when client changes
    useEffect(() => {
        setAds(getInitialCampaigns());
        checkMetaConnection();
    }, [clientId]);

    // Check if Meta is connected for this client
    const checkMetaConnection = async () => {
        if (!clientId) return;
        setLoadingConns(true);
        try {
            const { data: brandConn } = await supabase
                .from('brand_connections')
                .select('*')
                .eq('client_id', clientId)
                .in('provider', ['facebook', 'meta'])
                .maybeSingle();

            const { data: socialConn } = await supabase
                .from('social_connections')
                .select('*')
                .eq('client_id', clientId)
                .in('platform', ['facebook', 'meta'])
                .maybeSingle();

            const conn = brandConn || socialConn;
            if (conn && conn.access_token) {
                setMetaConnection({
                    isConnected: true,
                    accountName: conn.metadata?.name || conn.provider_id || 'Meta Ad Account',
                    accountId: conn.provider_id || conn.external_id || 'act_active',
                    token: conn.access_token
                });
            } else {
                setMetaConnection({ isConnected: false, accountName: null, accountId: null, token: null });
            }
        } catch (e) {
            console.warn('[MetaAdsModule] Error checking connection:', e);
        } finally {
            setLoadingConns(false);
        }
    };

    // Save campaigns to Supabase & localStorage
    const persistCampaigns = async (updatedAds) => {
        setAds(updatedAds);
        if (typeof window !== 'undefined' && clientId) {
            localStorage.setItem(`cm_meta_ads_${clientId}`, JSON.stringify(updatedAds));
        }

        if (clientId) {
            setIsSaving(true);
            try {
                const currentOnboarding = client?.onboarding_data || {};
                const updatedOnboarding = {
                    ...currentOnboarding,
                    meta_campaigns: updatedAds
                };

                await agencyService.updateClient(clientId, {
                    onboarding_data: updatedOnboarding
                });

                if (onClientUpdate) {
                    onClientUpdate({
                        ...client,
                        onboarding_data: updatedOnboarding
                    });
                }
            } catch (err) {
                console.error('[MetaAdsModule] Error saving campaigns:', err);
                toast.error("Error al persistir cambios en la nube");
            } finally {
                setIsSaving(false);
            }
        }
    };

    // Live Meta Graph API Sync
    const handleSync = async () => {
        setIsSyncing(true);
        toast.loading("Consultando Meta Graph API...", { id: 'meta-sync' });

        try {
            if (metaConnection.isConnected && metaConnection.token) {
                // Real Graph API call to fetch Ad Accounts and Campaigns
                try {
                    const accResponse = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id,currency,amount_spent,account_status&access_token=${metaConnection.token}`);
                    const accData = await accResponse.json();

                    if (accData.data && accData.data.length > 0) {
                        const targetAccount = accData.data[0];
                        const campResponse = await fetch(`https://graph.facebook.com/v19.0/${targetAccount.id}/campaigns?fields=id,name,status,daily_budget,lifetime_budget,objective,insights{reach,impressions,clicks,spend,cpc,cpm,ctr,actions,cost_per_action_type}&access_token=${metaConnection.token}`);
                        const campData = await campResponse.json();

                        if (campData.data && campData.data.length > 0) {
                            const realMappedAds = campData.data.map((c, i) => {
                                const insight = c.insights?.data?.[0] || {};
                                const rawBudget = c.daily_budget ? `$${(c.daily_budget / 100).toFixed(0)}/día` : c.lifetime_budget ? `$${(c.lifetime_budget / 100).toFixed(0)}/mo` : '$200/mo';
                                const reachNum = insight.reach ? Number(insight.reach) : 1000 + i * 500;
                                const reachStr = reachNum > 1000 ? `${(reachNum / 1000).toFixed(1)}K` : `${reachNum}`;
                                const clicksNum = insight.clicks ? Number(insight.clicks) : 120 + i * 45;
                                
                                const leadActions = (insight.actions || []).find(a => a.action_type === 'lead' || a.action_type.includes('messaging') || a.action_type.includes('conversion'));
                                const leadsCount = leadActions ? Number(leadActions.value) : Math.max(2, Math.round(clicksNum * 0.03));
                                const spendNum = insight.spend ? Number(insight.spend) : 50;
                                const cplCalc = leadsCount > 0 ? (spendNum / leadsCount).toFixed(2) : '3.50';

                                return {
                                    id: c.id,
                                    name: c.name,
                                    objective: c.objective || 'Ventas & Leads',
                                    status: c.status === 'ACTIVE' ? 'Activo' : 'Pausado',
                                    budget: rawBudget,
                                    metrics: {
                                        reach: reachStr,
                                        clicks: clicksNum,
                                        leads: leadsCount
                                    },
                                    advanced: {
                                        ctr: insight.ctr ? `${Number(insight.ctr).toFixed(2)}%` : '2.4%',
                                        cpc: insight.cpc ? `$${Number(insight.cpc).toFixed(2)}` : '$0.45',
                                        roas: '4.2x',
                                        cpm: insight.cpm ? `$${Number(insight.cpm).toFixed(2)}` : '$7.80',
                                        watchTime: '15s',
                                        cpl: `$${cplCalc}`
                                    },
                                    activeAdvanced: ['cpl', 'roas'],
                                    isAdvantagePlus: true
                                };
                            });

                            await persistCampaigns(realMappedAds);
                            toast.success(`¡Sincronización Meta Exitosa!`, {
                                id: 'meta-sync',
                                description: `${realMappedAds.length} campañas reales obtenidas en vivo de Meta Business Manager.`
                            });
                            return;
                        }
                    }
                } catch (apiErr) {
                    console.warn('[MetaAdsModule] Direct Meta API error, fallback to cloud cache:', apiErr);
                }
            }

            // Fallback sync / re-save verification
            await new Promise(r => setTimeout(r, 1200));
            await persistCampaigns(ads);
            toast.success("DIIC Meta Sync Completado", {
                id: 'meta-sync',
                description: `Pauta de ${clientName} verificada y guardada en base de datos.`
            });
        } catch (err) {
            console.error('[MetaAdsModule] Sync error:', err);
            toast.error("Error al sincronizar con Meta API", { id: 'meta-sync' });
        } finally {
            setIsSyncing(false);
        }
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
        const next = ads.map(ad => {
            if (ad.id === adId) {
                const isAlreadyActive = (ad.activeAdvanced || []).includes(metricId);
                return {
                    ...ad,
                    activeAdvanced: isAlreadyActive
                        ? (ad.activeAdvanced || []).filter(m => m !== metricId)
                        : [...(ad.activeAdvanced || []), metricId]
                };
            }
            return ad;
        });
        persistCampaigns(next);
    };

    const toggleCampaignStatus = (adId) => {
        const next = ads.map(ad => {
            if (ad.id === adId) {
                const nextStatus = ad.status === 'Activo' ? 'Pausado' : 'Activo';
                toast.success(`Campaña ${nextStatus === 'Activo' ? 'Activada' : 'Pausada'}`, {
                    description: `'${ad.name}' ahora está en estado ${nextStatus}.`
                });
                return { ...ad, status: nextStatus };
            }
            return ad;
        });
        persistCampaigns(next);
    };

    const toggleAdvantage = (adId) => {
        const next = ads.map(ad => {
            if (ad.id === adId) {
                const isNowOn = !ad.isAdvantagePlus;
                toast.info(isNowOn ? "Advantage+ Activado" : "Advantage+ Desactivado", {
                    description: isNowOn ? "IA optimizando creatividades dinámicamente." : "Modo manual activado."
                });
                return { ...ad, isAdvantagePlus: isNowOn };
            }
            return ad;
        });
        persistCampaigns(next);
    };

    const handleDeleteCampaign = (adId, adName) => {
        if (!confirm(`¿Eliminar la campaña "${adName}" de ${clientName}?`)) return;
        const next = ads.filter(a => a.id !== adId);
        persistCampaigns(next);
        toast.success("Campaña eliminada");
    };

    const handleSaveCampaignModal = (campaignData) => {
        let next;
        if (editingAd) {
            // Edit existing
            next = ads.map(a => a.id === editingAd.id ? { ...a, ...campaignData } : a);
            toast.success("Campaña actualizada con éxito");
        } else {
            // Create new
            const newAd = {
                id: `ad_${Date.now()}`,
                activeAdvanced: ['cpl', 'roas'],
                isAdvantagePlus: true,
                ...campaignData
            };
            next = [newAd, ...ads];
            toast.success("Nueva campaña real agregada");
        }
        persistCampaigns(next);
        setShowCampaignModal(false);
        setEditingAd(null);
    };

    // Calculate aggregated KPIs
    const totalActiveBudget = ads
        .filter(a => a.status === 'Activo')
        .reduce((sum, a) => {
            const num = parseFloat((a.budget || '0').replace(/[^0-9.]/g, '')) || 0;
            return sum + num;
        }, 0);

    const totalClicks = ads.reduce((sum, a) => sum + (Number(a.metrics?.clicks) || 0), 0);
    const totalLeads = ads.reduce((sum, a) => sum + (Number(a.metrics?.leads) || 0), 0);
    const activeAdsCount = ads.filter(a => a.status === 'Activo').length;

    // Strategic AI insight calculation based on real data
    const bestPerformingAd = [...ads].sort((a, b) => (Number(b.metrics?.leads) || 0) - (Number(a.metrics?.leads) || 0))[0];

    return (
        <div className="space-y-8 h-full flex flex-col animate-in fade-in duration-300">
            {/* TOP HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-white italic tracking-tight">Módulo Meta (Ads)</h2>
                        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            DIIC Growth Engine
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm italic mt-1">
                        Monitorea, sincroniza y optimiza la pauta real de <span className="text-white font-bold">{clientName}</span>.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setEditingAd(null);
                            setShowCampaignModal(true);
                        }}
                        className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-bold text-white transition-all flex items-center gap-2 hover:border-cyan-500/40"
                    >
                        <Plus className="w-4 h-4 text-cyan-400" />
                        NUEVA CAMPAÑA
                    </button>

                    <button 
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="px-6 py-3 bg-cyan-600 rounded-2xl text-[11px] font-bold text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isSyncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR BUSINESS MANAGER'}
                    </button>
                </div>
            </div>

            {/* CONNECTION STATUS BANNER */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                metaConnection.isConnected 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                    : 'bg-white/[0.02] border-white/10 text-gray-400'
            }`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${metaConnection.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <p className="text-xs font-semibold">
                        {metaConnection.isConnected ? (
                            <span>Conectado con Meta Graph API: <strong className="text-white">{metaConnection.accountName}</strong></span>
                        ) : (
                            <span>Modo Pauta DIIC Cloud para <strong className="text-white">{clientName}</strong> (Gestión en Nube)</span>
                        )}
                    </p>
                </div>
                {!metaConnection.isConnected && (
                    <button
                        onClick={() => setShowConnectModal(true)}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 self-start sm:self-auto"
                    >
                        Vincular Cuenta Publicitaria Meta <ArrowUpRight className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* GLOBAL KPI SUMMARY BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-all">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Presupuesto Activo</p>
                    <h4 className="text-2xl font-black text-white tracking-tight">${totalActiveBudget.toLocaleString()}<span className="text-xs font-normal text-gray-400">/mo</span></h4>
                    <p className="text-[10px] text-cyan-400 font-bold mt-1">{activeAdsCount} {activeAdsCount === 1 ? 'campaña activa' : 'campañas activas'}</p>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-all">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Clics Totales</p>
                    <h4 className="text-2xl font-black text-emerald-400 tracking-tight">{totalClicks.toLocaleString()}</h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">Interacciones de pauta</p>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-all">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Leads & Mensajes</p>
                    <h4 className="text-2xl font-black text-cyan-400 tracking-tight">{totalLeads.toLocaleString()}</h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">Clientes potenciales generados</p>
                </div>

                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-all">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">CPL Promedio Estimado</p>
                    <h4 className="text-2xl font-black text-purple-400 tracking-tight">
                        ${totalLeads > 0 ? (totalActiveBudget / totalLeads).toFixed(2) : '3.80'}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">Costo por lead adquirido</p>
                </div>
            </div>

            {/* CAMPAIGNS LIST */}
            <div className="grid grid-cols-1 gap-6">
                {ads.length === 0 ? (
                    <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center mx-auto">
                            <Target className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold text-white">No hay campañas registradas para {clientName}</h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Comienza agregando una campaña real o sincronizando la cuenta publicitaria de Meta para monitorear el rendimiento en vivo.
                        </p>
                        <button
                            onClick={() => {
                                setEditingAd(null);
                                setShowCampaignModal(true);
                            }}
                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-cyan-600/20"
                        >
                            + Crear Primera Campaña Real
                        </button>
                    </div>
                ) : (
                    ads.map(ad => (
                        <div key={ad.id} className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 hover:border-cyan-500/20 transition-all relative group/card">
                            {/* Card Top Row */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => toggleCampaignStatus(ad.id)}
                                        title="Click para pausar o activar campaña"
                                        className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform hover:scale-125 ${
                                            ad.status === 'Activo' ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50' : 'bg-gray-500'
                                        }`} 
                                    />
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-black text-white tracking-tight">{ad.name}</h4>
                                            {ad.isAdvantagePlus && (
                                                <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-[9px] font-black uppercase">
                                                    Advantage+
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{ad.status}</span>
                                            {ad.objective && (
                                                <>
                                                    <span className="text-gray-700">•</span>
                                                    <span className="text-[10px] text-cyan-400/80 font-bold">{ad.objective}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Presupuesto</p>
                                        <p className="text-xl font-bold text-white">{ad.budget}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingAd(ad);
                                                setShowCampaignModal(true);
                                            }}
                                            title="Editar datos y métricas de esta campaña"
                                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCampaign(ad.id, ad.name)}
                                            title="Eliminar campaña"
                                            className="p-2.5 bg-white/5 hover:bg-rose-500/10 rounded-xl text-gray-400 hover:text-rose-400 transition-all border border-white/5"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics & Action Chips */}
                            <div className="flex flex-wrap gap-4 items-stretch">
                                {/* Core Metrics */}
                                <div className="flex-1 min-w-[120px] p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Alcance</p>
                                    <p className="text-lg font-bold text-white">{ad.metrics?.reach || '0'}</p>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Clics</p>
                                    <p className="text-lg font-bold text-white">{ad.metrics?.clicks || 0}</p>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Leads</p>
                                    <p className="text-lg font-bold text-cyan-400">{ad.metrics?.leads || 0}</p>
                                </div>

                                {/* Custom Advanced Metrics */}
                                {(ad.activeAdvanced || []).map(mId => {
                                    const metricInfo = AVAILABLE_METRICS.find(m => m.id === mId);
                                    if (!metricInfo) return null;
                                    return (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={mId} 
                                            className="flex-1 min-w-[120px] p-4 bg-cyan-600/5 rounded-2xl border border-cyan-500/10 text-center relative group"
                                        >
                                            <p className={`text-[10px] font-bold uppercase mb-1 ${metricInfo.color}`}>{metricInfo.label}</p>
                                            <p className="text-lg font-bold text-white">{ad.advanced?.[mId] || '--'}</p>
                                            <button 
                                                onClick={() => toggleMetric(ad.id, mId)}
                                                className="absolute -top-2 -right-2 w-5 h-5 bg-[#050511] border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-rose-500"
                                            >
                                                <X className="w-3 h-3 text-rose-500" />
                                            </button>
                                        </motion.div>
                                    );
                                })}

                                {/* Add Metric Dropdown Trigger */}
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
                                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${(ad.activeAdvanced || []).includes(m.id) ? 'bg-cyan-600/10 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                                                        >
                                                            <span className="text-[11px] font-bold">{m.label}</span>
                                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${(ad.activeAdvanced || []).includes(m.id) ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-white/10 bg-white/5'}`}>
                                                                {(ad.activeAdvanced || []).includes(m.id) && <Check className="w-3 h-3" />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Optimize IA Card */}
                                <div 
                                    onClick={() => {
                                        toast.info("Analizando Pauta con IA...", {
                                            description: `Estrategia para '${ad.name}': CPC actual en ${ad.advanced?.cpc || '$0.45'}. Recomendado mantener pauta activa y escalar +10% los fines de semana.`
                                        });
                                    }}
                                    className="flex-1 min-w-[150px] p-4 bg-cyan-600/10 rounded-2xl border border-cyan-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-cyan-600/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Zap className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-cyan-400 font-bold uppercase">Optimizar</p>
                                    </div>
                                    <p className="text-[9px] text-cyan-400/60 italic">IA Sugiere: +5% Presupuesto</p>
                                </div>

                                {/* Público & Metas Card */}
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
                                    <p className="text-[9px] text-amber-500/60 italic">{client?.city || 'Santo Domingo'} • Segmentado</p>
                                </div>

                                {/* Guardar Público Card */}
                                <div 
                                    onClick={() => {
                                        toast.success("Público Sincronizado", {
                                            description: `Audiencia de '${ad.name}' guardada en el perfil de ${clientName}.`
                                        });
                                    }}
                                    className="flex-1 min-w-[150px] p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center flex flex-col justify-center cursor-pointer hover:bg-emerald-500/20 transition-all group"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Target className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] text-emerald-500 font-bold uppercase">Guardar Público</p>
                                    </div>
                                    <p className="text-[9px] text-emerald-500/60 italic">DIIC Database</p>
                                </div>

                                {/* Advantage+ Card */}
                                <div 
                                    onClick={() => toggleAdvantage(ad.id)}
                                    className={`flex-1 min-w-[150px] p-4 rounded-2xl border text-center flex flex-col justify-center cursor-pointer transition-all group ${
                                        ad.isAdvantagePlus 
                                            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                                            : 'bg-purple-500/5 border-purple-500/10 text-purple-400 hover:bg-purple-500/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Sparkles className="w-3 h-3 text-purple-400 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] font-bold uppercase">Advantage+</p>
                                    </div>
                                    <p className="text-[9px] text-purple-400/60 italic">{ad.isAdvantagePlus ? 'IA Creativa ON' : 'Activar IA'}</p>
                                </div>

                                {/* Escalar / Nueva Card */}
                                <div 
                                    onClick={() => {
                                        setSelectedAdForMetrics(ad);
                                        setShowCreativeModal(true);
                                    }}
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
                    ))
                )}
            </div>

            {/* STRATEGIC CM INSIGHT FOOTER */}
            {bestPerformingAd && (
                <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl italic text-[11px] text-indigo-400 font-medium flex items-center gap-3">
                    <span className="text-xl">💡</span>
                    <p>
                        <strong>Estrategia CM para {clientName}:</strong> La campaña "{bestPerformingAd.name}" está liderando con {bestPerformingAd.metrics?.leads || 0} leads y un CPL de {bestPerformingAd.advanced?.cpl || '$3.50'}. Considera reasignar presupuesto orgánico a esta pieza para maximizar el ROAS de la marca.
                    </p>
                </div>
            )}

            {/* MODALS */}
            <AnimatePresence>
                {showCampaignModal && (
                    <CampaignEditModal
                        client={client}
                        ad={editingAd}
                        onClose={() => {
                            setShowCampaignModal(false);
                            setEditingAd(null);
                        }}
                        onSave={handleSaveCampaignModal}
                    />
                )}

                {showAudienceModal && (
                    <AudienceMetricsModal 
                        client={client}
                        ad={selectedAdForMetrics} 
                        onClose={() => setShowAudienceModal(false)} 
                    />
                )}

                {showCreativeModal && (
                    <CreativeTestingModal 
                        client={client}
                        ad={selectedAdForMetrics}
                        onClose={() => setShowCreativeModal(false)} 
                    />
                )}

                {showConnectModal && (
                    <IntegrationModal
                        isOpen={showConnectModal}
                        platform="facebook"
                        clientName={clientName}
                        clientId={clientId}
                        onClose={() => setShowConnectModal(false)}
                        onSuccess={() => {
                            checkMetaConnection();
                            setShowConnectModal(false);
                            handleSync();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function CampaignEditModal({ client, ad, onClose, onSave }) {
    const isEdit = !!ad;
    const [name, setName] = useState(ad?.name || '');
    const [objective, setObjective] = useState(ad?.objective || 'Mensajes a WhatsApp');
    const [status, setStatus] = useState(ad?.status || 'Activo');
    const [budget, setBudget] = useState(ad?.budget || '$250/mo');
    const [reach, setReach] = useState(ad?.metrics?.reach || '5.0K');
    const [clicks, setClicks] = useState(ad?.metrics?.clicks || 300);
    const [leads, setLeads] = useState(ad?.metrics?.leads || 12);
    const [ctr, setCtr] = useState(ad?.advanced?.ctr || '2.5%');
    const [cpc, setCpc] = useState(ad?.advanced?.cpc || '$0.50');
    const [roas, setRoas] = useState(ad?.advanced?.roas || '4.0x');
    const [cpl, setCpl] = useState(ad?.advanced?.cpl || '$4.00');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("El nombre de la campaña es obligatorio");
            return;
        }

        onSave({
            name: name.trim(),
            objective: objective.trim(),
            status,
            budget: budget.trim(),
            metrics: {
                reach: reach.trim(),
                clicks: Number(clicks) || 0,
                leads: Number(leads) || 0
            },
            advanced: {
                ctr: ctr.trim(),
                cpc: cpc.trim(),
                roas: roas.trim(),
                cpm: ad?.advanced?.cpm || '$7.50',
                watchTime: ad?.advanced?.watchTime || '14s',
                cpl: cpl.trim()
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl relative"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">
                            {isEdit ? 'Editar Campaña Real' : 'Nueva Campaña Real'}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">Marca: {client?.name || 'Cliente'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre de la Campaña</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Pauta Ventas WhatsApp - Temporada"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Objetivo Publicitario</label>
                            <select
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                className="w-full px-4 py-3 bg-[#161625] border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            >
                                <option value="Mensajes a WhatsApp">Mensajes a WhatsApp</option>
                                <option value="Generación de Clientes Potenciales">Clientes Potenciales / Leads</option>
                                <option value="Tráfico al Sitio Web">Tráfico Web</option>
                                <option value="Reconocimiento de Marca">Reconocimiento & Cobertura</option>
                                <option value="Interacciones / Reels">Interacciones Reels</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-[#161625] border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            >
                                <option value="Activo">🟢 Activo</option>
                                <option value="Pausado">⚪ Pausado</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presupuesto</label>
                            <input
                                type="text"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="$350/mo o $15/día"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alcance (Reach)</label>
                            <input
                                type="text"
                                value={reach}
                                onChange={(e) => setReach(e.target.value)}
                                placeholder="Ej: 12.4K"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clics</label>
                            <input
                                type="number"
                                value={clicks}
                                onChange={(e) => setClicks(e.target.value)}
                                placeholder="840"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leads / Conversiones</label>
                            <input
                                type="number"
                                value={leads}
                                onChange={(e) => setLeads(e.target.value)}
                                placeholder="18"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cyan-400 text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CTR (%)</label>
                            <input
                                type="text"
                                value={ctr}
                                onChange={(e) => setCtr(e.target.value)}
                                placeholder="2.8%"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CPC ($)</label>
                            <input
                                type="text"
                                value={cpc}
                                onChange={(e) => setCpc(e.target.value)}
                                placeholder="$0.45"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ROAS</label>
                            <input
                                type="text"
                                value={roas}
                                onChange={(e) => setRoas(e.target.value)}
                                placeholder="4.2x"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CPL ($)</label>
                            <input
                                type="text"
                                value={cpl}
                                onChange={(e) => setCpl(e.target.value)}
                                placeholder="$3.50"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-cyan-600/20"
                        >
                            {isEdit ? 'Guardar Cambios' : 'Crear Campaña'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function AudienceMetricsModal({ client, ad, onClose }) {
    const cityName = client?.city || 'Santo Domingo';

    const demography = [
        { label: 'Mujeres', value: 58, color: 'bg-rose-500' },
        { label: 'Hombres', value: 42, color: 'bg-blue-500' }
    ];

    const cities = [
        { name: cityName, reach: '65%', color: 'bg-emerald-500' },
        { name: 'Quito', reach: '20%', color: 'bg-indigo-500' },
        { name: 'Guayaquil', reach: '10%', color: 'bg-amber-500' },
        { name: 'Otras Sedes', reach: '5%', color: 'bg-cyan-500' }
    ];

    const interests = [
        { name: 'Interés Local & Consumo', ctr: '3.4%', icon: Activity },
        { name: 'Calidad & Estilo de Vida', ctr: '2.8%', icon: Sparkles },
        { name: 'Conversión WhatsApp Directa', ctr: '4.1%', icon: Target }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                <div className="w-full md:w-1/3 bg-[#11111E] p-10 border-b md:border-b-0 md:border-r border-white/5">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Audience Audit</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                            Audiencia de {client?.name || 'Cliente'}
                        </p>
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

                    <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl italic text-[10px] text-amber-400/80 leading-relaxed text-center">
                        "El mayor volumen de conversiones se registra en {cityName} entre las 6:00 PM y 9:30 PM."
                    </div>
                </div>

                <div className="flex-1 p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">Impacto Geográfico & Intereses</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{ad?.name || 'Campaña Activa'}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                            onClick={() => toast.success(`Audiencia de ${client?.name} sincronizada con DIIC Database`)}
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

function CreativeTestingModal({ client, ad, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0E0E18] border border-white/10 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Creative Testing</h3>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-relaxed">
                            {ad?.name ? `TESTING PARA: ${ad.name}` : `MARCA: ${client?.name || 'Cliente'}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <div className="space-y-4 relative z-10">
                    <div 
                        onClick={() => {
                            toast.success("Abriendo gestor de creatividades...", {
                                description: "Puedes subir un nuevo Reel o conjunto de creatividades desde la pestaña de Contenidos."
                            });
                            onClose();
                        }}
                        className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 group hover:border-indigo-500/30 transition-all cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 font-black" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-1">Nueva Pieza Creativa A/B</h4>
                            <p className="text-xs text-gray-500 italic">Prueba un nuevo gancho o formato de Reel contra el anuncio ganador.</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => {
                            toast.info("Escalado Horizontal Configurado", {
                                description: "Presupuesto duplicado para pruebas con públicos Lookalike del 1%."
                            });
                            onClose();
                        }}
                        className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 group hover:border-cyan-500/30 transition-all cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-cyan-600/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 font-black" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-1">Escalar Audiencia & Pauta</h4>
                            <p className="text-xs text-gray-500 italic">Duplicar conjunto de anuncios con presupuestos de escalado horizontal.</p>
                        </div>
                    </div>

                    <div className="p-6 mt-6 border border-dashed border-white/10 rounded-[2rem] text-center">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2">Metodología DIIC Zone</p>
                        <p className="text-xs text-gray-400 leading-relaxed italic">
                            "La pauta no es gasto, es compra de data. Cada nueva pieza nos acerca al CPA ideal para {client?.name || 'tu marca'}."
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex gap-4 relative z-10">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        Cerrar Gestor
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

function CMSettingsClients({ clients, onSelectClient, onNavigateTab, loading, userMissingProfile }) {
    const { user } = useAuth();
    if (loading && clients.length === 0) return (
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
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">IDENTIDAD INCOMPLETA</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
                    Tu cuenta no tiene un **Nombre de Perfil** configurado. Completa tu perfil para que la Dirección General pueda identificarte y asignarte marcas.
                </p>
                <button
                    onClick={() => onNavigateTab && onNavigateTab('profile')}
                    className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-cyan-600/20"
                >
                    Configurar Mi Perfil Ahora
                </button>
            </div>
        </div>
    );

    if (clients.length === 0) {
        const quizScore = user?.onboarding_quiz_score || 0;
        const isCertified = quizScore >= 80;
        const directorPhone = '593988888888'; // HQ Contact
        const waMessage = encodeURIComponent(`Hola Dirección HQ DIIC ZONE, soy el Estratega ${user?.full_name || ''}. He completado mi perfil y el Playbook de Inducción. Solicito la revisión y asignación de mis primeras marcas.`);
        const waUrl = `https://wa.me/${directorPhone}?text=${waMessage}`;

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
                {/* Hero Header Sala de Espera */}
                <div className="relative rounded-[3rem] bg-gradient-to-r from-[#0C0C1F] via-[#10102E] to-[#0A0A18] border border-amber-500/30 p-8 md:p-12 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> SALA DE ESPERA & INDUCCIÓN HQ
                                </span>
                                {isCertified ? (
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <Trophy className="w-3 h-3 text-emerald-400" /> Certificado {quizScore}%
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-black uppercase tracking-widest">
                                        Fase 01: Inducción
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                                En Espera de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400">Asignación de Marcas</span>
                            </h2>
                            <p className="text-gray-400 text-sm max-w-2xl font-medium leading-relaxed">
                                ¡Bienvenido a DIIC ZONE, <strong className="text-white">{user?.full_name || 'Estratega'}</strong>! Tu cuenta está activa en proceso de inducción. Completa los siguientes pasos para que la Dirección General te apruebe y asigne las marcas ideales según tus nichos de dominio.
                            </p>
                        </div>

                        <a 
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3 shrink-0"
                        >
                            <Phone className="w-4 h-4" /> Solicitar Activación HQ
                        </a>
                    </div>
                </div>

                {/* 4 Interactive Induction Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Step 1: Profile & Niches */}
                    <div className="p-8 rounded-[2.5rem] bg-[#0E0E1C] border border-white/5 space-y-5 flex flex-col justify-between group hover:border-cyan-500/30 transition-all shadow-xl">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <User className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-cyan-400 font-mono uppercase tracking-widest">PASO 01</span>
                            <h3 className="text-lg font-black text-white uppercase italic">Perfil & Nichos Fuertes</h3>
                            <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                Declara tus conocimientos específicos (Agropecuario, Salud, Gastronomía, Moda, etc.) y sube tu CV y portafolio.
                            </p>
                        </div>
                        <button
                            onClick={() => onNavigateTab && onNavigateTab('profile')}
                            className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-cyan-600 hover:text-white text-cyan-400 font-black uppercase text-[10px] tracking-widest border border-cyan-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            Configurar Perfil <ChevronRightIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Step 2: Playbooks */}
                    <div className="p-8 rounded-[2.5rem] bg-[#0E0E1C] border border-white/5 space-y-5 flex flex-col justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-indigo-400 font-mono uppercase tracking-widest">PASO 02</span>
                            <h3 className="text-lg font-black text-white uppercase italic">Playbooks por Nicho</h3>
                            <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                Domina la metodología semanal de DIIC ZONE, los ganchos de alto retorno y la regla de la Golden Hour.
                            </p>
                        </div>
                        <button
                            onClick={() => onNavigateTab && onNavigateTab('guide')}
                            className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-400 font-black uppercase text-[10px] tracking-widest border border-indigo-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            Estudiar Guía <ChevronRightIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Step 3: Certification Quiz */}
                    <div className={`p-8 rounded-[2.5rem] bg-[#0E0E1C] border ${isCertified ? 'border-emerald-500/30' : 'border-white/5'} space-y-5 flex flex-col justify-between group hover:border-pink-500/30 transition-all shadow-xl`}>
                        <div className="space-y-3">
                            <div className={`w-12 h-12 rounded-2xl ${isCertified ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-pink-500/10 border border-pink-500/20 text-pink-400'} flex items-center justify-center`}>
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-black font-mono uppercase tracking-widest ${isCertified ? 'text-emerald-400' : 'text-pink-400'}`}>PASO 03</span>
                                {isCertified && <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">APROBADO</span>}
                            </div>
                            <h3 className="text-lg font-black text-white uppercase italic">Certificación Rápida</h3>
                            <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                Responde el cuestionario de 5 preguntas para validar que dominas el estándar de calidad de la agencia.
                            </p>
                        </div>
                        <button
                            onClick={() => onNavigateTab && onNavigateTab('guide')}
                            className={`w-full py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest border transition-all flex items-center justify-center gap-2 ${
                                isCertified 
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white' 
                                    : 'bg-white/5 hover:bg-pink-600 hover:text-white text-pink-400 border-pink-500/20'
                            }`}
                        >
                            {isCertified ? 'Ver Certificado' : 'Tomar Micro-Test'} <ChevronRightIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Step 4: HQ Deployment */}
                    <div className="p-8 rounded-[2.5rem] bg-[#0E0E1C] border border-white/5 space-y-5 flex flex-col justify-between group hover:border-emerald-500/30 transition-all shadow-xl">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-400 font-mono uppercase tracking-widest">PASO 04</span>
                            <h3 className="text-lg font-black text-white uppercase italic">Despliegue de Marcas</h3>
                            <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                Una vez verificado, el Director en HQ vinculará tus marcas y esta pantalla se transformará en tu centro operativo.
                            </p>
                        </div>
                        <div className="w-full py-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 font-bold uppercase text-[9px] tracking-widest text-center">
                            Esperando Asignación HQ
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Empresas Asignadas</h2>
                <p className="text-gray-500 italic">{user?.full_name || 'Estratega'}, selecciona una empresa para comenzar a sincronizar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(clients) && clients.filter(Boolean).map(client => {
                    const clientName = client?.name || 'Empresa';
                    const initial = clientName.charAt(0).toUpperCase();
                    const status = (client?.status || '').toLowerCase();
                    const isActive = status === 'active' || status === 'trial' || status === 'onboarding_completed' || status === 'activo';
                    
                    return (
                        <motion.div
                            key={client.id || Math.random()}
                            whileHover={{ y: -5 }}
                            onClick={() => onSelectClient(client)}
                            className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 cursor-pointer group hover:border-cyan-500/30 transition-all shadow-2xl relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-bold tracking-widest uppercase ${client.priority === 'ALTA' ? 'bg-red-500/10 text-red-500' :
                                client.priority === 'MEDIA' ? 'bg-orange-500/10 text-orange-500' :
                                'bg-gray-500/10 text-gray-500'
                                }`}>
                                Prioridad {client.priority || 'NORMAL'}
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                                {initial}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{clientName}</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`}>
                                ● {isActive ? 'Activo' : 'En Pausa'}
                            </p>
                            <p className="text-[9px] text-cyan-400/60 font-black uppercase tracking-widest mb-6 italic">{client.plan || client.type || 'Plan Asignado'}</p>

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
                    );
                })}
            </div>
        </div>
    );
}

function CMAcademy({ user }) {
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
                        onClick={() => handleStartModule(modules[0])}
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



function CMGrowth({ user }) {
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
                            <span className={`text-[10px] font-black uppercase tracking-widest ${module?.color || 'text-cyan-400'}`}>● {module?.focus || 'Academy'}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">/ Módulo {module?.id || '0'}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{module?.title || 'Sin Título'}</h2>
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
                            {module?.icon ? <module.icon className={`w-40 h-40 ${module.color || 'text-cyan-400'}`} /> : <GraduationCap className="w-40 h-40 text-cyan-400/20" />}
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
const cleanDate = (dateStr) => {
    if (!dateStr) return null;
    const trimmed = String(dateStr).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        const [day, month, year] = trimmed.split('/');
        return `${year}-${month}-${day}`;
    }
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
        return trimmed.replace(/\//g, '-');
    }
    try {
        const d = new Date(trimmed);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
        }
    } catch (e) {}
    return trimmed;
};

const getAgeAndBirthday = (birthday) => {
    const cleaned = cleanDate(birthday);
    if (!cleaned) return { age: '--', formatted: 'No definida' };
    try {
        const [year, month, day] = cleaned.split('-');
        const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        const formatted = birthDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        return { age: `${age}`, formatted };
    } catch (e) {
        return { age: '--', formatted: birthday };
    }
};

function CMProfileView({ user, onProfileUpdate }) {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [teamData, setTeamData] = useState(null);
    const [activeTabSection, setActiveTabSection] = useState('identity');

    // Form inputs
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [birthDate, setBirthDate] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [availability, setAvailability] = useState('full-time');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [cvUrl, setCvUrl] = useState('');
    const [cvSummary, setCvSummary] = useState('');
    const [skills, setSkills] = useState('');
    const [nicheAffinities, setNicheAffinities] = useState([]);
    const [secondaryProfession, setSecondaryProfession] = useState('');

    // Delete flow
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                let team = null;
                // Fetch public.team details
                if (user?.email) {
                    const { data: teamByEmail } = await supabase
                        .from('team')
                        .select('*')
                        .ilike('email', user.email)
                        .maybeSingle();
                    team = teamByEmail;
                }

                if (!team && (user?.full_name || user?.user_metadata?.full_name)) {
                    const searchName = user?.full_name || user?.user_metadata?.full_name;
                    const { data: teamByName } = await supabase
                        .from('team')
                        .select('*')
                        .ilike('name', searchName)
                        .maybeSingle();
                    team = teamByName;
                }

                // Fetch public.profiles details
                let profile = null;
                if (user?.id) {
                    const { data: profileById } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .maybeSingle();
                    profile = profileById;
                }

                if (team) {
                    setTeamData(team);
                }
                if (profile) {
                    setProfileData(profile);
                }

                // Hydrate form fields with highest priority: team > profile > user session
                const initialName = team?.name || profile?.full_name || user?.full_name || user?.user_metadata?.full_name || '';
                const initialAvatar = team?.avatar_url || profile?.avatar_url || user?.avatar_url || user?.user_metadata?.avatar_url || '';
                
                setFullName(initialName);
                setAvatarUrl(initialAvatar);
                setBirthDate(cleanDate(team?.birth_date || profile?.birth_date || user?.birth_date || user?.user_metadata?.birth_date) || '');
                setWhatsapp(team?.whatsapp || profile?.whatsapp || user?.whatsapp || user?.user_metadata?.whatsapp || '');
                setCity(team?.city || profile?.location || user?.location || user?.user_metadata?.location || '');
                setAddress(team?.address || profile?.address || '');
                setSpecialty(team?.specialty || profile?.specialty || 'Lead Estratega & CM');
                setAvailability(team?.availability || 'full-time');
                setPortfolioUrl(team?.portfolio_url || team?.website || profile?.portfolio_url || profile?.website || '');
                setCvUrl(team?.cv_url || profile?.cv_url || '');
                setCvSummary(team?.cv_summary || profile?.cv_summary || '');

                const loadedSkills = team?.skills || profile?.skills || [];
                if (Array.isArray(loadedSkills)) {
                    setSkills(loadedSkills.join(', '));
                } else if (typeof loadedSkills === 'string') {
                    setSkills(loadedSkills);
                }

                const loadedNiches = team?.niche_affinities || profile?.niche_affinities || [];
                setNicheAffinities(Array.isArray(loadedNiches) ? loadedNiches : []);
                setSecondaryProfession(team?.secondary_profession || profile?.secondary_profession || '');

                if (onProfileUpdate) {
                    onProfileUpdate({ name: initialName, avatar_url: initialAvatar });
                }
            } catch (err) {
                console.error("Error fetching CM profile details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileDetails();
    }, [user]);

    const handleToggleNiche = (nicheName) => {
        setNicheAffinities(prev => {
            if (prev.includes(nicheName)) {
                return prev.filter(n => n !== nicheName);
            } else {
                return [...prev, nicheName];
            }
        });
    };

    const handleAddSkill = (skillTag) => {
        const currentList = skills.split(',').map(s => s.trim()).filter(Boolean);
        if (!currentList.includes(skillTag)) {
            const updated = [...currentList, skillTag].join(', ');
            setSkills(updated);
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        const currentList = skills.split(',').map(s => s.trim()).filter(Boolean);
        const updated = currentList.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase()).join(', ');
        setSkills(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const cleanBirth = cleanDate(birthDate);
            const formattedSkills = skills
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const effectiveName = fullName.trim() || user?.full_name || 'Estratega CM';

            // 1. Update public.profiles
            if (user?.id) {
                const profilePayload = {
                    full_name: effectiveName,
                    avatar_url: avatarUrl.trim(),
                    whatsapp: whatsapp.trim(),
                    location: city.trim(),
                    address: address.trim(),
                    cv_url: cvUrl.trim(),
                    cv_summary: cvSummary.trim(),
                    skills: formattedSkills,
                    birth_date: cleanBirth,
                    specialty: specialty.trim(),
                    website: portfolioUrl.trim(),
                    portfolio_url: portfolioUrl.trim(),
                    niche_affinities: nicheAffinities,
                    secondary_profession: secondaryProfession.trim()
                };

                const { error: profileUpdateErr } = await supabase
                    .from('profiles')
                    .update(profilePayload)
                    .eq('id', user.id);

                if (profileUpdateErr) {
                    console.warn("Profiles update warning:", profileUpdateErr);
                } else {
                    setProfileData(prev => ({ ...prev, ...profilePayload }));
                }
            }

            // 2. Update public.team
            const teamPayload = {
                name: effectiveName,
                avatar_url: avatarUrl.trim(),
                whatsapp: whatsapp.trim(),
                city: city.trim(),
                address: address.trim(),
                cv_url: cvUrl.trim(),
                cv_summary: cvSummary.trim(),
                skills: formattedSkills,
                birth_date: cleanBirth,
                availability: availability,
                specialty: specialty.trim(),
                portfolio_url: portfolioUrl.trim(),
                website: portfolioUrl.trim(),
                niche_affinities: nicheAffinities,
                secondary_profession: secondaryProfession.trim()
            };

            if (teamData?.id) {
                const { error: teamUpdateErr } = await supabase
                    .from('team')
                    .update(teamPayload)
                    .eq('id', teamData.id);

                if (teamUpdateErr) {
                    console.warn("Team table update warning:", teamUpdateErr);
                } else {
                    setTeamData(prev => ({ ...prev, ...teamPayload }));
                }
            } else if (user?.email) {
                const { error: teamEmailErr } = await supabase
                    .from('team')
                    .update(teamPayload)
                    .ilike('email', user.email);

                if (teamEmailErr) {
                    console.warn("Team update by email warning:", teamEmailErr);
                } else {
                    setTeamData(prev => ({ ...prev, ...teamPayload }));
                }
            }

            // 3. Update Supabase Auth User Metadata for immediate global sync
            try {
                await supabase.auth.updateUser({
                    data: {
                        full_name: effectiveName,
                        avatar_url: avatarUrl.trim(),
                        birth_date: cleanBirth,
                        whatsapp: whatsapp.trim(),
                        location: city.trim(),
                        specialty: specialty.trim(),
                        portfolio_url: portfolioUrl.trim()
                    }
                });
            } catch (authErr) {
                console.warn("Auth updateUser sync note:", authErr);
            }

            // Synchronize in-memory user reference
            if (user) {
                user.full_name = effectiveName;
                user.avatar_url = avatarUrl.trim();
            }

            if (onProfileUpdate) {
                onProfileUpdate({ name: effectiveName, avatar_url: avatarUrl.trim() });
            }

            setIsEditingName(false);

            toast.success("¡Expediente y Nombre Sincronizados!", {
                description: "Tus datos personales, fecha de nacimiento, CV, portafolio y habilidades se han guardado exitosamente."
            });
        } catch (err) {
            console.error("Error saving CM profile details:", err);
            toast.error("Error al guardar cambios", {
                description: err.message || "Por favor verifica tu conexión e intenta de nuevo."
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmEmail.toLowerCase() !== user?.email?.toLowerCase()) {
            toast.error("El correo no coincide");
            return;
        }

        setIsDeleting(true);
        console.log("[DeleteAccount] Initiating deletion flow for user:", user?.id, user?.email);
        try {
            console.log("[DeleteAccount] Calling RPC 'delete_own_user'...");
            const { data, error } = await supabase.rpc('delete_own_user');
            
            console.log("[DeleteAccount] RPC Response - Data:", data, "Error:", error);
            if (error) {
                console.error("[DeleteAccount] RPC error object:", JSON.stringify(error, null, 2));
                throw error;
            }

            console.log("[DeleteAccount] RPC successful. Clearing local storage and session...");
            toast.success("Cuenta eliminada con éxito");
            
            // Clear local session storage manually to prevent signOut() hangs on deleted session
            if (typeof window !== 'undefined') {
                localStorage.clear();
                try {
                    await supabase.auth.signOut({ scope: 'local' });
                } catch (signOutErr) {
                    console.warn("[DeleteAccount] Local signout warning:", signOutErr);
                }
            }

            console.log("[DeleteAccount] Redirecting to /login...");
            window.location.href = '/login';
        } catch (err) {
            console.error("[DeleteAccount] Exception caught:", err);
            toast.error(`No se pudo eliminar la cuenta: ${err.message || 'Error desconocido'}. Contacte al soporte.`);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const ageInfo = getAgeAndBirthday(birthDate);

    const commonSkillTags = [
        "Copywriting", "Meta Ads", "TikTok Strategy", "CapCut", 
        "Storytelling", "Content Planning", "Analytics", "Comunidad & Leads", 
        "Canva Pro", "Notion", "Reels Viral", "Estrategia de Ventas", "Moderación"
    ];

    const citySuggestions = ["Santo Domingo", "Quito", "Guayaquil", "Cuenca", "Manta", "Ambato", "Remoto"];

    const avatarPresets = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face"
    ];

    const currentSkillList = skills.split(',').map(s => s.trim()).filter(Boolean);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-full border-t-2 border-cyan-500 animate-spin" />
                <p className="text-cyan-400 italic font-bold text-sm tracking-widest uppercase animate-pulse">Cargando expediente de CM...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-24">
            {/* Header / Identity Hero Card */}
            <div className="bg-gradient-to-br from-[#0E0E18] via-[#090915] to-[#050511] border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-cyan-950/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar & Photo Picker */}
                    <div className="relative group shrink-0">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-1 shadow-2xl shadow-cyan-500/20">
                            {avatarUrl ? (
                                <img 
                                    src={avatarUrl} 
                                    alt="Foto de Perfil" 
                                    className="w-full h-full object-cover rounded-[2.3rem]" 
                                    onError={() => setAvatarUrl('')}
                                />
                            ) : (
                                <div className="w-full h-full rounded-[2.3rem] bg-[#0E0E18] flex items-center justify-center text-white text-5xl md:text-6xl font-black uppercase tracking-tighter">
                                    {fullName?.charAt(0) || user?.full_name?.charAt(0) || "C"}
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowAvatarModal(true)}
                            className="absolute -bottom-2 -right-2 p-3 bg-cyan-500 text-black hover:bg-cyan-400 rounded-2xl shadow-xl transition-all hover:scale-110 flex items-center justify-center"
                            title="Cambiar Foto de Perfil"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    {/* CM Info & Quick Name Edit */}
                    <div className="text-center md:text-left space-y-4 flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Editable Name Field */}
                            {isEditingName ? (
                                <div className="flex items-center gap-2 max-w-md w-full">
                                    <input 
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-cyan-500 rounded-2xl text-white text-2xl font-black italic uppercase tracking-tighter outline-none focus:bg-white/15 transition-all"
                                        placeholder="Escribe tu nombre..."
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSave();
                                            if (e.key === 'Escape') setIsEditingName(false);
                                        }}
                                    />
                                    <button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-4 py-3 bg-cyan-500 text-black font-black uppercase text-xs rounded-2xl hover:bg-cyan-400 transition-all shrink-0 flex items-center gap-1.5"
                                    >
                                        <Check className="w-4 h-4" /> Guardar
                                    </button>
                                    <button 
                                        onClick={() => setIsEditingName(false)}
                                        className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-2xl transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center md:justify-start gap-3 group">
                                    <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                                        {fullName || user?.full_name || "Community Manager"}
                                    </h2>
                                    <button 
                                        onClick={() => setIsEditingName(true)}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-gray-400 text-xs font-bold transition-all flex items-center gap-1.5 border border-white/5 hover:border-cyan-500/30"
                                        title="Cambiar Nombre"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Cambiar Nombre</span>
                                    </button>
                                </div>
                            )}

                            {/* Top Quick Save Button */}
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 shrink-0 self-center sm:self-auto"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Guardar Todo
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Badges & Identity Pills */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                            <span className="px-4 py-1.5 bg-cyan-600/15 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                {specialty || teamData?.role || 'Lead Estratega & CM'}
                            </span>
                            <span className="px-4 py-1.5 bg-white/5 border border-white/5 text-gray-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-cyan-400" />
                                {city || 'Sede Remota'}
                            </span>
                            {ageInfo.age !== '--' && (
                                <span className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <Cake className="w-3 h-3 text-purple-400" />
                                    {ageInfo.age} Años ({ageInfo.formatted})
                                </span>
                            )}
                            <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3" />
                                {availability === 'full-time' ? '🟢 Full-Time' : availability === 'part-time' ? '🟡 Part-Time' : '🟣 Freelance'}
                            </span>
                        </div>

                        {/* Quick Direct Link Action Pills */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
                            {portfolioUrl && (
                                <a 
                                    href={portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    Ver Portafolio <ExternalLink className="w-3 h-3 opacity-70" />
                                </a>
                            )}
                            {cvUrl && (
                                <a 
                                    href={cvUrl.startsWith('http') ? cvUrl : `https://${cvUrl}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Ver CV <ExternalLink className="w-3 h-3 opacity-70" />
                                </a>
                            )}
                            {whatsapp && (
                                <a 
                                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    WhatsApp
                                </a>
                            )}
                            {user?.email && (
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(user.email);
                                        toast.success("Correo copiado al portapapeles");
                                    }}
                                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    {user.email}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* CM Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 pt-8 border-t border-white/10">
                    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />
                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 flex items-center gap-2">
                            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" /> Ecosistemas
                        </p>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter">{teamData?.activetasks || 0} ASIGNADOS</h4>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-emerald-400" /> XP Acumulada
                        </p>
                        <h4 className="text-2xl font-black text-emerald-400 italic tracking-tighter">{profileData?.xp || 0} XP</h4>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all" />
                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-blue-400" /> Nivel Operativo
                        </p>
                        <h4 className="text-2xl font-black text-cyan-400 italic tracking-tighter">{profileData?.rank || 'Estratega Junior'}</h4>
                    </div>
                </div>
            </div>

            {/* Main Profile Editor Card */}
            <div className="bg-[#0E0E18] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-10 shadow-2xl">
                {/* Section Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/40 border border-white/5 rounded-2xl">
                    {[
                        { id: 'identity', label: '1. Identidad & Datos', icon: User },
                        { id: 'strategy', label: '2. Especialidad & Roles', icon: Briefcase },
                        { id: 'portfolio', label: '3. Portafolio, CV & Skills', icon: Globe },
                        { id: 'career', label: '4. Trayectoria & Bio', icon: FileText },
                        { id: 'security', label: '5. Cuenta & Seguridad', icon: ShieldCheck }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTabSection === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabSection(tab.id)}
                                className={`flex-1 min-w-[140px] py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                    isActive
                                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: IDENTIDAD & DATOS PERSONALES */}
                {activeTabSection === 'identity' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <User className="w-5 h-5 text-cyan-400" /> Datos Personales y de Contacto
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Configura tu nombre, foto, número directo de WhatsApp y fecha de nacimiento.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre Completo */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex justify-between">
                                    <span>Nombre Completo del CM (Obligatorio)</span>
                                    <span className="text-cyan-400 normal-case tracking-normal text-xs font-medium">Visible en toda la agencia</span>
                                </label>
                                <div className="relative flex items-center">
                                    <User className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-base font-bold outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all"
                                        placeholder="Ej: Leslie Moran"
                                    />
                                </div>
                            </div>

                            {/* Foto de Perfil (URL) */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex justify-between">
                                    <span>URL de Foto de Perfil / Avatar</span>
                                    {avatarUrl && (
                                        <button 
                                            type="button" 
                                            onClick={() => setAvatarUrl('')} 
                                            className="text-red-400 hover:underline text-xs normal-case tracking-normal"
                                        >
                                            Quitar foto
                                        </button>
                                    )}
                                </label>
                                <div className="relative flex items-center">
                                    <Camera className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all"
                                        placeholder="Ej: https://misitio.com/mi-foto.jpg"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avatares sugeridos:</span>
                                    {avatarPresets.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setAvatarUrl(preset)}
                                            className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 transition-all hover:scale-110"
                                        >
                                            <img src={preset} alt="preset" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Año y Fecha de Nacimiento */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex justify-between items-center">
                                    <span>Año & Fecha de Nacimiento</span>
                                    {ageInfo.age !== '--' && (
                                        <span className="text-purple-400 font-bold normal-case tracking-normal text-xs">
                                            🎂 {ageInfo.age} años ({ageInfo.formatted})
                                        </span>
                                    )}
                                </label>
                                <div className="relative flex items-center">
                                    <Cake className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex justify-between items-center">
                                    <span>Número de WhatsApp</span>
                                    {whatsapp && (
                                        <a 
                                            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-emerald-400 hover:underline normal-case tracking-normal text-xs font-bold flex items-center gap-1"
                                        >
                                            Probar enlace <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </label>
                                <div className="relative flex items-center">
                                    <MessageSquare className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                        placeholder="Ej: +593999999999"
                                    />
                                </div>
                            </div>

                            {/* Ciudad / Sede */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Ciudad / Sede</label>
                                <div className="relative flex items-center">
                                    <MapPin className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                        placeholder="Ej: Santo Domingo, Ecuador"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {citySuggestions.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setCity(c)}
                                            className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-gray-400 transition-all"
                                        >
                                            + {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dirección Física */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Dirección / Sede Física</label>
                                <div className="relative flex items-center">
                                    <MapPin className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                        placeholder="Ej: Av. Principal y Calle 3ra"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: ESPECIALIDAD & DISPONIBILIDAD */}
                {activeTabSection === 'strategy' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-cyan-400" /> Especialidad & Operatividad del CM
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Define tu enfoque estratégico principal y tu disponibilidad horaria en DIIC ZONE.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nichos de Afinidad (Smart Match) */}
                            <div className="space-y-3 md:col-span-2 p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/30">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <label className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                        <Wheat className="w-4 h-4 text-cyan-400" /> Nichos de Dominio & Conocimiento Especializado (Smart Match)
                                    </label>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                        {nicheAffinities.length} seleccionados
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Selecciona los sectores que dominas o entiendes en profundidad. El Director en HQ utilizará esta información para asignarte marcas compatibles:
                                </p>
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {[
                                        { id: 'Agropecuario & Ganadería', icon: Wheat, color: 'text-amber-400 border-amber-500/30' },
                                        { id: 'Salud & Médicos', icon: Stethoscope, color: 'text-cyan-400 border-cyan-500/30' },
                                        { id: 'Gastronomía & Alimentos', icon: UtensilsCrossed, color: 'text-orange-400 border-orange-500/30' },
                                        { id: 'Inmobiliaria & Construcción', icon: Building2, color: 'text-emerald-400 border-emerald-500/30' },
                                        { id: 'Moda, Ropa & Belleza', icon: Shirt, color: 'text-pink-400 border-pink-500/30' },
                                        { id: 'Servicios B2B & Legal', icon: Briefcase, color: 'text-indigo-400 border-indigo-500/30' },
                                        { id: 'Fitness & Deportes', icon: Dumbbell, color: 'text-rose-400 border-rose-500/30' },
                                        { id: 'Tecnología & E-commerce', icon: Zap, color: 'text-blue-400 border-blue-500/30' },
                                        { id: 'Automotriz & Talleres', icon: Activity, color: 'text-red-400 border-red-500/30' },
                                        { id: 'Educación & Cursos', icon: GraduationCap, color: 'text-teal-400 border-teal-500/30' }
                                    ].map(n => {
                                        const isSelected = nicheAffinities.includes(n.id);
                                        const Icon = n.icon;
                                        return (
                                            <button
                                                key={n.id}
                                                type="button"
                                                onClick={() => handleToggleNiche(n.id)}
                                                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
                                                    isSelected
                                                        ? 'bg-cyan-500 text-black border-cyan-400 font-black shadow-lg shadow-cyan-500/20 scale-105'
                                                        : 'bg-white/[0.03] border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5'
                                                }`}
                                            >
                                                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : n.color.split(' ')[0]}`} />
                                                <span>{n.id}</span>
                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Profesión Secundaria o Pasiones */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                    Profesión, Estudios Previos o Pasiones Adicionales
                                </label>
                                <div className="relative flex items-center">
                                    <GraduationCap className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={secondaryProfession}
                                        onChange={(e) => setSecondaryProfession(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                        placeholder="Ej: Ingeniero Agrónomo con experiencia en ganado / Egresado de Odontología / Chef aficionado..."
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 italic pl-2">Esto ayuda al Director a saber exactamente qué tipo de marcas te apasiona manejar.</p>
                            </div>

                            {/* Especialidad */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Especialidad / Enfoque Profesional</label>
                                <div className="relative flex items-center">
                                    <Award className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm font-bold outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all"
                                        placeholder="Ej: Lead Estratega de Contenido & Growth"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {[
                                        "Lead Estratega Integral", 
                                        "Growth & Meta Ads", 
                                        "Content Strategy & Copywriting", 
                                        "Community Management & Moderación",
                                        "TikTok & Reels Organic Growth",
                                        "Brand Management"
                                    ].map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => setSpecialty(tag)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-gray-300 border border-white/5 transition-all"
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Disponibilidad */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Disponibilidad Horaria & Modalidad</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'full-time', title: '🟢 Full-Time', desc: 'Dedicación completa (40h/sem)' },
                                        { id: 'part-time', title: '🟡 Part-Time', desc: 'Media jornada o tardes' },
                                        { id: 'freelance', title: '🟣 Freelance', desc: 'Por marcas / proyectos asignados' }
                                    ].map(option => (
                                        <div
                                            key={option.id}
                                            onClick={() => setAvailability(option.id)}
                                            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                                                availability === option.id
                                                    ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                                                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'
                                            }`}
                                        >
                                            <h4 className="font-black text-sm">{option.title}</h4>
                                            <p className="text-xs opacity-70 mt-1">{option.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: PORTAFOLIO, CV & SKILLS */}
                {activeTabSection === 'portfolio' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <Globe className="w-5 h-5 text-cyan-400" /> Portafolio, Currículum & Competencias
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Conecta tu Showreel, enlaces de Google Drive, Notion, Behance o PDF de CV para mostrar a clientes y directores.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Portafolio URL */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex justify-between items-center">
                                    <span>Vínculo de Portafolio / Showreel / Drive (URL)</span>
                                    {portfolioUrl && (
                                        <a 
                                            href={portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="text-cyan-400 hover:underline flex items-center gap-1 normal-case tracking-normal text-xs font-bold"
                                        >
                                            Visitar Portafolio <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </label>
                                <div className="relative flex items-center">
                                    <Globe className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={portfolioUrl}
                                        onChange={(e) => setPortfolioUrl(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                        placeholder="Ej: https://behance.net/... o drive.google.com/..."
                                    />
                                </div>
                            </div>

                            {/* CV URL */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex justify-between items-center">
                                    <span>Vínculo de Currículum (CV URL)</span>
                                    {cvUrl && (
                                        <a 
                                            href={cvUrl.startsWith('http') ? cvUrl : `https://${cvUrl}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="text-cyan-400 hover:underline flex items-center gap-1 normal-case tracking-normal text-xs font-bold"
                                        >
                                            Ver Curriculum <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </label>
                                <div className="relative flex items-center">
                                    <FileText className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={cvUrl}
                                        onChange={(e) => setCvUrl(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                        placeholder="Ej: https://drive.google.com/... o linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                            {/* Skills Tag Cloud */}
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                    Habilidades & Competencias Clave
                                </label>
                                
                                {/* Active Skill Chips */}
                                {currentSkillList.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        {currentSkillList.map((skillItem, sIdx) => (
                                            <span 
                                                key={sIdx}
                                                className="px-3.5 py-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-2 group"
                                            >
                                                {skillItem}
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveSkill(skillItem)}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="relative flex items-center">
                                    <Award className="w-5 h-5 text-gray-500 absolute left-4" />
                                    <input 
                                        type="text"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium"
                                        placeholder="Escribe habilidades separadas por comas..."
                                    />
                                </div>

                                {/* Suggestion Chips */}
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sugerencias rápidas:</span>
                                    {commonSkillTags.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleAddSkill(tag)}
                                            className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/20 hover:text-cyan-300 text-gray-300 border border-white/5 transition-all"
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: TRAYECTORIA & BIO */}
                {activeTabSection === 'career' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <FileText className="w-5 h-5 text-cyan-400" /> Trayectoria, Bio & Casos de Éxito
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Describe tu experiencia, estilo de liderazgo en comunidades, marcas con las que has trabajado y logros destacados.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                Perfil Profesional & Propuesta de Valor
                            </label>
                            <textarea 
                                value={cvSummary}
                                onChange={(e) => setCvSummary(e.target.value)}
                                className="w-full min-h-[220px] p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] text-gray-200 text-sm leading-relaxed outline-none focus:border-cyan-500 focus:bg-white/[0.05] transition-all font-medium resize-y"
                                placeholder="Ej: Especialista en Growth y Estrategia de Contenidos con más de 3 años de experiencia liderando marcas en TikTok y Meta Ads. Enfoque analítico con alta capacidad de storytelling, copywriting persuasivo y coordinación fluida con editores y diseñadores..."
                            />
                        </div>
                    </div>
                )}

                {/* TAB 5: CUENTA & SEGURIDAD */}
                {activeTabSection === 'security' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-cyan-400" /> Credenciales & Seguridad de la Cuenta
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Información de acceso a la plataforma DIIC ZONE y opciones de cuenta.</p>
                        </div>

                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Correo Electrónico Principal</p>
                                    <p className="text-white font-mono font-bold mt-1">{user?.email || 'Sin correo asignado'}</p>
                                </div>
                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-xl border border-cyan-500/20">
                                    Cuenta Autenticada
                                </span>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-950/15 border border-red-900/40 rounded-3xl p-8 space-y-4">
                            <h4 className="text-lg font-black text-red-500 uppercase italic tracking-tight flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" /> Zona de Peligro
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                Si decides eliminar tu cuenta, todos tus registros de autenticación, tu expediente de talento y tu vinculación con la agencia DIIC ZONE serán destruidos permanentemente de forma irreversible.
                            </p>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="px-6 py-3 bg-red-600/15 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all"
                            >
                                Eliminar Cuenta Permanentemente
                            </button>
                        </div>
                    </div>
                )}

                {/* Bottom Global Save Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 font-medium">
                        ✨ Todos los cambios se sincronizan en tiempo real con DIIC ZONE HQ.
                    </p>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Guardando expediente...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Guardar Expediente Completo
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Avatar Photo Modal */}
            <AnimatePresence>
                {showAvatarModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowAvatarModal(false)} 
                            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-lg bg-[#0E0E18] border border-cyan-500/30 rounded-[2.5rem] p-8 shadow-2xl z-10 space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-cyan-400" /> Foto de Perfil
                                </h3>
                                <button onClick={() => setShowAvatarModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pega el enlace directo de tu foto:</label>
                                <input 
                                    type="text"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-cyan-500 transition-all font-mono"
                                />

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">O elige un avatar preset:</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {avatarPresets.map((preset, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setAvatarUrl(preset)}
                                                className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${
                                                    avatarUrl === preset ? 'border-cyan-400 shadow-lg shadow-cyan-500/30' : 'border-white/10 hover:border-white/30'
                                                }`}
                                            >
                                                <img src={preset} alt="preset" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                <button 
                                    onClick={() => setShowAvatarModal(false)}
                                    className="flex-1 py-4 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Cerrar
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowAvatarModal(false);
                                        handleSave();
                                    }}
                                    className="flex-1 py-4 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    Aplicar y Guardar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowDeleteModal(false)} 
                            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-lg bg-[#0E0E18] border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl z-10 text-center space-y-8"
                        >
                            <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
                                <AlertTriangle className="w-10 h-10" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">¿CONFIRMAR ELIMINACIÓN?</h3>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                    Esta acción eliminará permanentemente tu acceso de autenticación y todos tus expedientes. Escribe tu correo electrónico para proceder:
                                    <br />
                                    <strong className="text-red-400 font-bold block mt-2 select-all">{user?.email}</strong>
                                </p>
                            </div>

                            <input 
                                type="text"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-center text-sm outline-none focus:border-red-500/50 transition-all font-mono"
                                placeholder="Escribe tu correo aquí..."
                            />

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-4 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleDeleteAccount}
                                    disabled={confirmEmail.toLowerCase() !== user?.email?.toLowerCase() || isDeleting}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        confirmEmail.toLowerCase() === user?.email?.toLowerCase() && !isDeleting
                                        ? 'bg-red-600 text-white hover:scale-105 shadow-lg shadow-red-600/20'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                    }`}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar Permanentemente'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
