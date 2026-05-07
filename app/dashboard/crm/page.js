'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Search, Filter, MoreHorizontal, 
    Instagram, MessageCircle, Zap, TrendingUp,
    Target, UserPlus, Phone, Mail, DollarSign, Calendar,
    CheckCircle2, AlertCircle, Sparkles, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { X, ChevronDown, Check, Send, Clock, Activity, FileText, ClipboardList } from 'lucide-react';
import { MEDICAL_PROTOCOLS, getUrologyTags } from '@/services/medicalInstructions';
import PipelineBoard from '@/components/crm/PipelineBoard';
import UnifiedInbox from '@/components/crm/UnifiedInbox';
import CRMAnalytics from '@/components/crm/CRMAnalytics';
import BroadcastCenter from '@/components/crm/BroadcastCenter';
import ProductivityView from '@/components/crm/ProductivityView';
import { LayoutGrid, List, MessageSquare as InboxIcon, BarChart3, Settings2, megaphone } from 'lucide-react';

// Helper para terminología dinámica según el nicho
const getCRMTerminology = (niche = '', role = '') => {
    const val = niche.toLowerCase();
    const isMedical = ['doctor', 'medico', 'médico', 'medical', 'salud', 'clinica', 'clínica', 'urologia', 'urología'].some(k => val.includes(k));
    const isAgro = ['agro', 'campo', 'agropecuario', 'agropecuaria', 'vete', 'veterinaria'].some(k => val.includes(k));
    
    return {
        unitName: isMedical ? 'Paciente' : isAgro ? 'Productor' : 'Lead',
        unitPlural: isMedical ? 'Pacientes' : isAgro ? 'Clientes Agro' : 'Prospectos',
        statusLabel: isMedical ? 'Estado Clínico' : isAgro ? 'Venta Agropecuaria' : 'Estado de Venta',
        processLabel: isMedical ? 'Protocolo Médico' : isAgro ? 'Pipeline Agro' : 'Pipeline Comercial',
        serviceLabel: isMedical ? 'Tratamiento' : isAgro ? 'Insumo / Servicio' : 'Servicio / Interés',
        sectionTitle: isMedical ? 'Gestión de Pacientes' : isAgro ? 'Inteligencia del Campo' : 'Control de Leads',
        selectionRequired: role === 'CLIENT' ? 'Cargando Marca...' : 'Operativo Global: Selección Requerida',
        placeholder: isMedical ? 'Sincronizando Pacientes Reales' : isAgro ? 'Sincronizando Gestión del Campo' : 'Sincronizando Leads de Marca'
    };
};

const getNicheLabel = (niche = '') => {
    const val = niche.toLowerCase();
    if (['doctor', 'medico', 'médico', 'medical', 'salud', 'clinica', 'clínica', 'urologia', 'urología'].some(k => val.includes(k))) return 'MARKETING PARA MÉDICOS';
    if (['gym', 'fitness', 'gimnasio', 'deporte', 'entrenador'].some(k => val.includes(k))) return 'MARKETING PARA GIMNASIOS';
    if (['curso', 'formacion', 'formación', 'educacion', 'educación', 'mentoria', 'mentoría'].some(k => val.includes(k))) return 'FORMACIONES Y CURSOS';
    if (['agro', 'campo', 'agropecuario', 'agropecuaria', 'vete', 'veterinaria'].some(k => val.includes(k))) return 'MARKETING AGROPECUARIO';
    if (['industrial', 'fabrica', 'fábrica', 'manufactura'].some(k => val.includes(k))) return 'MARKETING INDUSTRIAL';
    return 'ESTRATEGIA DE NEGOCIOS';
};

export default function CRMPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientId = searchParams.get('client');

    const [leads, setLeads] = useState([]);
    const [clients, setClients] = useState([]);
    const [activeClient, setActiveClient] = useState(null);
    const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);
    
    // AI Suggestion State
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [suggesting, setSuggesting] = useState(false);

    // View State: 'pipeline' | 'list' | 'inbox' | 'analytics'
    const [activeView, setActiveView] = useState('list');

    const [stats, setStats] = useState({
        totalLeads: 0,
        pendingAppointments: 0,
        monthlyRevenue: 0,
        aiDraftsCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('reales'); // 'reales' | 'recientes'
    const [newLead, setNewLead] = useState({
        full_name: '',
        phone: '',
        email: '',
        industry: '',
        status: 'PROSPECTO',
        city: '',
        price_estimated: 0,
        source: 'Ads'
    });

    const labels = getCRMTerminology(activeClient?.industry || activeClient?.niche || '', user?.role);

    useEffect(() => {
        if (!user) return;
        
        async function loadInitialData() {
            setLoading(true);
            try {
                // Priority: URL Param -> User Metadata -> Auth Context ID
            const isStaff = user.role !== 'CLIENT';
            // Isolation Rule: Client users see ONLY their own brand. Staff see selected or global.
            const targetId = isStaff 
                ? (clientId || user.user_metadata?.client_id || user.client_id)
                : (user.client_id || user.user_metadata?.client_id);

            const { data: clientData } = await supabase
                .from('clients')
                .select('id, name, city, growth_level, industry, niche, price');
            
            // If Client, filter the selector data too
            setClients(isStaff ? (clientData || []) : (clientData?.filter(c => c.id === targetId) || []));

            // Find the active client
            let active = null;
            if (targetId) {
                active = clientData?.find(c => c.id === targetId);
                
                // Si es un cliente y no lo encontramos en la lista, creamos un objeto base
                if (!active && user.role === 'CLIENT') {
                    active = { 
                        id: targetId, 
                        name: user.user_metadata?.brand_name || user.user_metadata?.client_name || user.client_name || 'Mi Marca',
                        industry: user.user_metadata?.industry || user.industry || 'Agropecuario'
                    };
                }
                setActiveClient(active);
            } else if (user.role === 'CLIENT') {
                // Fallback extremo para asegurar que el cliente vea SU marca
                const fallbackId = user.client_id || user.user_metadata?.client_id;
                setActiveClient({
                    id: fallbackId,
                    name: user.user_metadata?.brand_name || user.user_metadata?.client_name || 'Servicios Agropecuarios',
                    industry: user.user_metadata?.industry || 'Agropecuario'
                });
            } else {
                setActiveClient(null);
            }

            // Load Leads logic
            let query = supabase.from('crm_leads').select('*');
            if (targetId) {
                query = query.eq('client_id', targetId);
            } else if (!isStaff) {
                // If not staff and no ID, return empty to prevent data leak
                setLeads([]);
                setLoading(false);
                return;
            }
            
            const { data: leadData, error: leadError } = await query.order('created_at', { ascending: false });
            if (leadError) throw leadError;
            setLeads(leadData || []);

            // Stats calculation
            const revenue = leadData?.reduce((sum, item) => sum + Number(item.price_estimated || 0), 0) || 0;

            setStats({
                totalLeads: leadData?.length || 0,
                pendingAppointments: 12, 
                monthlyRevenue: revenue,
                aiDraftsCount: Math.floor(Math.random() * 20)
            });

        } catch (err) {
            console.error('[CRM] Load Failed:', err);
        } finally {
            setLoading(false);
        }
    }
    loadInitialData();
}, [user, clientId]);

const handleSelectClient = (client) => {
    if (user.role === 'CLIENT') return; // Restriction
    const params = new URLSearchParams(searchParams);
    if (client) {
        params.set('client', client.id);
    } else {
        params.delete('client');
    }
    router.push(`?${params.toString()}`);
    setIsClientSelectorOpen(false);
};

const handleGenerateSuggestion = async (lead) => {
    if (!lead || !activeClient) return;
    setSuggesting(true);
    setAiSuggestion(null);
    try {
        const { aiService } = await import('@/services/aiService');
        const result = await aiService.generateResponseSuggestion(lead, activeClient);
        setAiSuggestion(result.text);
    } catch (error) {
        console.error("AI Suggestion Error:", error);
    } finally {
        setSuggesting(false);
    }
};

const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
        const targetId = user.role === 'CLIENT' ? user.client_id : (clientId || user.user_metadata?.client_id || user.client_id || 'C-REYS');
            const { data, error } = await supabase
                .from('crm_leads')
                .insert([{ ...newLead, client_id: targetId }])
                .select();

            if (error) throw error;
            setLeads([data[0], ...leads]);
            setIsRegisterModalOpen(false);
            setNewLead({
                full_name: '',
                phone: '',
                email: '',
                industry: 'Urología General',
                status: 'PROSPECTO',
                city: '',
                price_estimated: 0,
                source: 'Instagram'
            });
            toast.success(`${labels.unitName} registrado correctamente`, {
                description: `${data[0].full_name} añadido al CRM.`
            });
        } catch (err) {
            console.error("Error creating lead:", err);
            toast.error(`Error al registrar ${labels.unitName.toLowerCase()}`);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             lead.city?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeTab === 'recientes') {
            const isRecent = new Date(lead.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
            return matchesSearch && isRecent;
        }
        return matchesSearch;
    });

    const sendProtocol = (lead, protocol) => {
        const message = protocol.whatsappTemplate.replace('[NAME]', lead.full_name.split(' ')[0]);
        const phone = lead.phone?.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        toast.info(`Enviando protocolo: ${protocol.title}`);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050510]">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Activity className="w-12 h-12 text-indigo-500 opacity-50" />
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mt-6 animate-pulse">{labels.placeholder}</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#050510] text-white p-6 md:p-10 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 relative overflow-hidden group">
                    <div className="flex flex-col gap-2 relative z-10">
                        {/* High-Performance Breadcrumb Navigation */}
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">
                            <span 
                                onClick={() => router.push('/dashboard')}
                                className="hover:text-indigo-400 cursor-pointer transition-colors"
                            >
                                DIIC ZONE
                            </span>
                            <div className="w-1 h-1 bg-gray-700 rounded-full" />
                            <span className="text-indigo-400">
                                {activeClient ? getNicheLabel(activeClient.industry || activeClient.niche) : 'GLOBAL HUB'}
                            </span>
                             {activeClient && (
                                <>
                                    <div className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span className="text-white">CRM</span>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col gap-0">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
                                    {labels.unitName === 'Lead' ? 'CRM HUB' : 'SISTEMA DE GESTIÓN'}
                                </span>
                                <div className="h-[1px] w-12 bg-gradient-to-r from-indigo-500/50 to-transparent" />
                            </div>
                            
                            <h1 className="text-6xl md:text-[9rem] font-black text-white tracking-tighter uppercase leading-[0.75] -ml-1 mt-2">
                                {activeClient ? (
                                    <div className="flex flex-col">
                                        <span className="opacity-40 text-4xl md:text-6xl -mb-2">{labels.unitName}</span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-purple-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                            {activeClient.name}
                                        </span>
                                    </div>
                                ) : 'CENTRAL CRM'}
                            </h1>
                        </div>
                                           
                        {(!activeClient || (user?.role !== 'CLIENT')) ? (
                            <div className="flex items-center gap-4 mt-6">
                                <div className="relative">
                                     <button 
                                         onClick={() => setIsClientSelectorOpen(!isClientSelectorOpen)}
                                         className="flex items-center gap-4 px-8 py-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all shadow-2xl group overflow-hidden relative"
                                     >
                                         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors relative z-10">
                                             Desplegar Nodo de Marca
                                         </span>
                                         <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform relative z-10 ${isClientSelectorOpen ? 'rotate-180 text-white' : ''}`} />
                                     </button>

                                     <AnimatePresence>
                                         {isClientSelectorOpen && (
                                             <motion.div 
                                                 initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                                 exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                 className="absolute top-full left-0 mt-4 w-72 bg-[#050510]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden p-3"
                                             >
                                                 <div className="space-y-1">
                                                     <button 
                                                         onClick={() => handleSelectClient(null)}
                                                         className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!activeClient ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:bg-white/5'}`}
                                                     >
                                                         Vista Operativa Global
                                                         {!activeClient && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]" />}
                                                     </button>
                                                     <div className="h-[1px] bg-white/5 my-2 mx-4" />
                                                     {clients.map(client => (
                                                         <button 
                                                             key={client.id}
                                                             onClick={() => handleSelectClient(client)}
                                                             className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeClient?.id === client.id ? 'bg-white/10 text-white border border-white/10' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                                                         >
                                                             {client.name}
                                                             {activeClient?.id === client.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />}
                                                         </button>
                                                     ))}
                                                 </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 mt-8">
                                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Nodo Operativo Live</span>
                                </div>
                                <div className="h-4 w-[1px] bg-white/10" />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Terminal de Control Exclusiva</span>
                            </div>
                        )}
                    <p className="text-[10px] font-black text-gray-500/40 uppercase tracking-[0.5em] mt-8 flex items-center gap-4">
                        <span className="h-[1px] w-8 bg-gray-800" />
                        {activeClient ? `Engine Insight: ${activeClient.name}` : 'Security Protocol DIIC v3.2'}
                        <span className="h-[1px] w-8 bg-gray-800" />
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                        <Search className="w-4 h-4 text-gray-500 mr-3" />
                        <input 
                            type="text" 
                            placeholder={`Buscar ${labels.unitName?.toLowerCase() || 'dato'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm font-bold outline-none text-white w-48" 
                        />
                    </div>
                    <button 
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                    >
                        <UserPlus className="w-4 h-4" /> Nuevo {labels.unitName}
                    </button>
                </div>
            </div>

            {/* CONTROL BAR: VIEW SELECTOR (Bitrix24 Standard) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
                <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5 overflow-hidden">
                    {[
                        { id: 'pipeline', label: 'Pipeline Kanban', icon: LayoutGrid },
                        { id: 'list', label: 'Lista CRM', icon: List },
                        { id: 'inbox', label: 'Inbox Omnicanal', icon: InboxIcon },
                        { id: 'broadcast', label: 'Difusión Masiva', icon: Send },
                        { id: 'analytics', label: 'Dashboard Inteligente', icon: BarChart3 },
                    ].map(view => (
                        <button
                            key={view.id}
                            onClick={() => setActiveView(view.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeView === view.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            <view.icon className="w-3.5 h-3.5" />
                            {view.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Vista Optimizada para Productividad</p>
                    <button 
                        onClick={() => setActiveView('productivity')}
                        className={`p-2.5 border rounded-xl transition-all ${activeView === 'productivity' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                    >
                        <Settings2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* DYNAMIC CONTENT PER VIEW */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 w-full"
                >
                    {activeView === 'pipeline' && (
                        <div className="h-[750px] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                             <PipelineBoard leads={leads} />
                        </div>
                    )}

                    {activeView === 'inbox' && (
                        <div className="h-[750px] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                             <UnifiedInbox />
                        </div>
                    )}

                    {activeView === 'analytics' && (
                        <div className="min-h-[750px] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                             <CRMAnalytics />
                        </div>
                    )}

                    {activeView === 'productivity' && (
                        <div className="h-[750px] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                             <ProductivityView />
                        </div>
                    )}

                    {activeView === 'broadcast' && (
                        <div className="h-[750px] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                             <BroadcastCenter />
                        </div>
                    )}

                    {activeView === 'list' && (
                        <div className="space-y-10">
                            {/* Business Intelligence Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Facturación Total', val: `$${stats.monthlyRevenue.toLocaleString()}`, sub: 'ACUMULADO REAL', icon: DollarSign, color: '#10b981' },
                                    { label: `${labels.unitPlural} Activos`, val: stats.totalLeads, sub: 'EN SEGUIMIENTO', icon: Users, color: '#6366f1' },
                                    { label: 'Agendamientos', val: '12', sub: 'ESTA SEMANA', icon: Calendar, color: '#f59e0b' },
                                    { label: 'IA Sugerencias', val: stats.aiDraftsCount, sub: 'PENDIENTES BOTS', icon: Sparkles, color: '#ec4899' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-all">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <s.icon className="w-12 h-12" style={{ color: s.color }} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
                                            <p className="text-2xl font-black text-white italic tracking-tighter">{s.val}</p>
                                            <p className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">{s.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Medical CRM Table */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setActiveTab('reales')}
                                            className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reales' ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {labels.unitPlural}
                                        </button>
                                        <div className="h-4 w-[1px] bg-white/10" />
                                        <button 
                                            onClick={() => setActiveTab('recientes')}
                                            className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'recientes' ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            Últimos Registros
                                        </button>
                                    </div>
                                </div>
                                
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">Identidad {labels.unitName}</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">{labels.statusLabel}</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">{labels.serviceLabel}</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">Inversión Est.</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">IA Bot</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {filteredLeads.map((lead, i) => (
                                            <motion.tr 
                                                key={lead.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="group hover:bg-white/[0.03] transition-all cursor-pointer"
                                                onClick={() => {
                                                    setSelectedLead(lead);
                                                    setAiSuggestion(null);
                                                }}
                                            >
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                                            {lead.full_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase italic">{lead.full_name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {lead.source === 'Instagram' && <Instagram className="w-2.5 h-2.5 text-pink-500" />}
                                                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{lead.city || 'Ciudad No Registrada'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'ACTIVE' || lead.status === 'AGENDADO' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{lead.status || labels.unitName.toUpperCase()}</span>
                                                    </div>
                                                    {/* Journey Progress Bar */}
                                                    <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                                                            style={{ width: lead.status === 'AGENDADO' ? '60%' : lead.status === 'TRATADO' ? '100%' : '20%' }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest">
                                                        {lead.industry || 'Urología General'}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <p className="text-sm font-black text-white italic tracking-tighter">${(lead.price_estimated || 0).toLocaleString()}</p>
                                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">Monto Estimado</p>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {(i % 3 === 0) && (
                                                            <motion.div 
                                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                                transition={{ repeat: Infinity, duration: 2 }}
                                                                className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center gap-2"
                                                            >
                                                                <Sparkles className="w-3 h-3 text-pink-500" />
                                                                <span className="text-[7px] font-black text-pink-400 uppercase tracking-widest">Sugerencia Bot</span>
                                                            </motion.div>
                                                        )}
                                                        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>

                                {leads.length === 0 && (
                                    <div className="py-32 flex flex-col items-center justify-center gap-8 text-center max-w-xl mx-auto">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                            <Users className="w-10 h-10 text-indigo-500 opacity-50" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                                                {activeClient ? `Sin ${labels.unitPlural} en esta Marca` : labels.selectionRequired}
                                            </h3>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                                {activeClient 
                                                    ? `Aún no hay ${labels.unitPlural.toLowerCase()} registrados para ${activeClient.name}. Comienza vinculando tus redes sociales o realizando una importación.`
                                                    : 'Por seguridad y privacidad de datos, el acceso al CRM requiere la vinculación de un nodo de marca operativo.'}
                                            </p>
                                        </div>
                                        {!activeClient && (
                                           <button 
                                                onClick={() => setIsClientSelectorOpen(true)}
                                                className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-white/10"
                                           >
                                                Abrir Selector de Marcas
                                           </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Side Panel for Detail */}
            <AnimatePresence>
                {selectedLead && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed top-0 right-0 w-[450px] h-screen bg-[#050510] border-l border-white/10 shadow-3xl z-50 p-10 space-y-8 overflow-y-auto custom-scrollbar"
                    >
                        <button onClick={() => setSelectedLead(null)} className="absolute top-6 left-[-20px] w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                                    {selectedLead.full_name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{selectedLead.full_name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{selectedLead.status || 'PROSPECTO'}</p>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedLead.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Communication Actions */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Llamar', icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
                                { label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
                                { label: 'Email', icon: Mail, color: 'text-indigo-500', bg: 'bg-indigo-500/5', border: 'border-indigo-500/20' },
                            ].map((btn, i) => (
                                <button key={i} className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${btn.bg} ${btn.border} border hover:bg-white/5 transition-all group`}>
                                    <btn.icon className={`w-5 h-5 ${btn.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{btn.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Urology Specialized Protocols */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                <ClipboardList className="w-3 h-3" /> Protocolos de Preparación
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.values(MEDICAL_PROTOCOLS).map((proto) => (
                                    <button 
                                        key={proto.id}
                                        onClick={() => sendProtocol(selectedLead, proto)}
                                        className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-tight">{proto.title}</p>
                                                <p className="text-[8px] text-gray-500 font-medium uppercase mt-0.5">Enviar vía WhatsApp</p>
                                            </div>
                                        </div>
                                        <Send className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Tratamiento & IA Insight</h4>
                                <button 
                                    onClick={() => handleGenerateSuggestion(selectedLead)}
                                    disabled={suggesting}
                                    className="flex items-center gap-2 text-pink-500 hover:text-pink-400 disabled:opacity-50 transition-all"
                                >
                                    <Sparkles className={`w-3 h-3 ${suggesting ? 'animate-spin' : ''}`} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">{suggesting ? 'Consultando...' : 'Sugerir Respuesta IA'}</span>
                                </button>
                            </div>

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] border border-white/5 space-y-4 relative overflow-hidden group">
                                {aiSuggestion ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-3 h-3 text-pink-500" />
                                            <p className="text-[8px] font-black text-pink-500 uppercase tracking-widest">Respuesta Optimizada para Venta</p>
                                        </div>
                                        <p className="text-xs text-gray-300 font-medium leading-relaxed italic border-l-2 border-pink-500/30 pl-4">"{aiSuggestion}"</p>
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(aiSuggestion);
                                                toast.success("¡Copiado!", { description: "Pégalo en el chat de mensajería." });
                                            }}
                                            className="text-[8px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <ClipboardList className="w-3 h-3" /> Copiar Borrador
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Diagnóstico de Interés</p>
                                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[7px] font-black uppercase tracking-widest">
                                                {selectedLead.industry || 'Urología General'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-12 bg-indigo-500/20 rounded-full" />
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                                                El paciente muestra interés en "{selectedLead.industry || 'Consulta General'}". 
                                                Se recomienda enviar protocolo de **Vejiga Llena** si requiere ecografía.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 active:scale-95">
                            <Activity className="w-4 h-4" /> Registrar Venta / Cobro
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* REGISTER MODAL */}
            <AnimatePresence>
                {isRegisterModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRegisterModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0a0a1a] border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Nuevo {labels.unitName}</h2>
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">{labels.processLabel} CRM</p>
                                    </div>
                                    <button onClick={() => setIsRegisterModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateLead} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder={labels.unitName === 'Paciente' ? "Ej. Dr. Mario Perez" : "Ej. Juan Perez"}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-emerald-500/50 outline-none transition-all font-bold text-sm"
                                                value={newLead.full_name}
                                                onChange={(e) => setNewLead({...newLead, full_name: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Teléfono (WhatsApp)</label>
                                            <input 
                                                required
                                                type="tel" 
                                                placeholder="+52 1 234 567 890"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-emerald-500/50 outline-none transition-all font-bold text-sm text-emerald-400"
                                                value={newLead.phone}
                                                onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">{labels.unitName === 'Paciente' ? 'Patología / Servicio' : 'Segmento / Interés'}</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-emerald-500/50 outline-none transition-all font-bold text-sm text-white appearance-none"
                                                value={newLead.industry}
                                                onChange={(e) => setNewLead({...newLead, industry: e.target.value})}
                                            >
                                                {labels.unitName === 'Paciente' ? (
                                                     getUrologyTags().map(tag => (
                                                        <option key={tag} value={tag} className="bg-[#0a0a1a]">{tag}</option>
                                                     ))
                                                ) : (
                                                    ['Interés General', 'Servicio Premium', 'Consulta Directa', 'Seguimiento Ads'].map(tag => (
                                                        <option key={tag} value={tag} className="bg-[#0a0a1a]">{tag}</option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Estado Inicial</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-emerald-500/50 outline-none transition-all font-bold text-sm text-white appearance-none"
                                                value={newLead.status}
                                                onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                                            >
                                                <option value="PROSPECTO" className="bg-[#0a0a1a]">LEAD ENTRANTE</option>
                                                <option value="AGENDADO" className="bg-[#0a0a1a]">CITA AGENDADA</option>
                                                <option value="NEGOCIO" className="bg-[#0a0a1a]">NEGOCIACIÓN</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Origen del Lead</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-emerald-500/50 outline-none transition-all font-bold text-sm text-white appearance-none"
                                                value={newLead.source}
                                                onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                                            >
                                                <option value="Instagram" className="bg-[#0a0a1a]">Instagram</option>
                                                <option value="Facebook" className="bg-[#0a0a1a]">Facebook</option>
                                                <option value="WhatsApp" className="bg-[#0a0a1a]">WhatsApp</option>
                                                <option value="Búsqueda Directa" className="bg-[#0a0a1a]">Búsqueda Directa</option>
                                                <option value="Referido" className="bg-[#0a0a1a]">Referido</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Ciudad / Ubicación</label>
                                            <input 
                                                type="text" 
                                                placeholder="Ej. Santo Domingo"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-emerald-500/50 outline-none transition-all font-bold text-sm"
                                                value={newLead.city}
                                                onChange={(e) => setNewLead({...newLead, city: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl text-xs font-black uppercase tracking-[0.4em] transition-all shadow-2xl shadow-emerald-900/30 active:scale-95"
                                    >
                                        Finalizar Registro de {labels.unitName}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
