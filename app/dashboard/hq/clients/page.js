'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Plus, MoreVertical, ExternalLink, Shield, TrendingUp, AlertCircle, CheckCircle2, Trash2, Edit, Pause, Play, BookOpen, Target, Clock, MessageSquare, ArrowRight, ArrowLeft, ChevronDown, Building2, Fingerprint, Copy, UserPlus, Zap, DollarSign, Star, Layout, Sparkles, Globe, Activity, Mail, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { agencyService } from '@/services/agencyService';
import VisionEcosystem from '@/components/VisionEcosystem';
import { toast } from 'sonner';
import { isCloudConnected, supabase } from '@/lib/supabase';
import StrategicOutliner from '@/components/shared/Strategy/StrategicOutliner';
import StrategyCreationWizard from '@/components/shared/Strategy/StrategyCreationWizard';
import { ECUADOR_CITIES, MEDICAL_SPECIALTIES, AGRO_SPECIALTIES, INDUSTRY_OPTIONS, MARKETING_TYPES, PLAN_OPTIONS, CREATIVE_RATES } from '@/lib/constants';
import PremiumDropdown from '@/components/shared/PremiumDropdown';
import GlassInput from '@/components/shared/GlassInput';
import AdminClientAIHub from '@/components/admin/AdminClientAIHub';

export default function HQClientsPage() {
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const router = useRouter();

    const [clients, setClients] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(false);
    const [syncStep, setSyncStep] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessView, setShowSuccessView] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [activeEditTab, setActiveEditTab] = useState('operative');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isHQLive, setIsHQLive] = useState(false);
    const [isStrategicWizardOpen, setIsStrategicWizardOpen] = useState(false);
    const [activeStrategyNodes, setActiveStrategyNodes] = useState([]);
    const [newClient, setNewClient] = useState({
        name: '',
        plan: 'Presencia',
        price: 250,
        target: 0,
        cm: '',
        email: '',
        password_initial: '',
        whatsapp_number: '',
        google_drive_folder_id: '',
        notes: '',
        onboarding_data: {}
    });

    const fetchClients = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        setSyncStep('connecting');
        
        try {
            console.log(`🚀 [Clients] ${isBackground ? 'Background' : 'Initial'} DB Syncing...`);
            const [clientData, teamData] = await Promise.all([
                agencyService.getClients(),
                agencyService.getTeam()
            ]);
            
            setSyncStep('processing');
            if (Array.isArray(clientData)) setClients(clientData);
            if (Array.isArray(teamData)) setTeam(teamData);
            
            setSyncStep('done');
        } catch (error) {
            console.error("❌ [Clients] Sync Failure:", error);
            setSyncStep('error');
            if (!isBackground) toast.error("Error de Sincronización");
        } finally {
            setLoading(false);
            setIsSyncing(false);
            setTimeout(() => setSyncStep(''), 2000);
        }
    };

    useEffect(() => {
        // 1. Instant Load from Cache
        const loadCache = () => {
            try {
                const cachedClients = localStorage.getItem('diic_clients');
                const cachedTeam = localStorage.getItem('diic_team');
                
                if (cachedClients && cachedTeam) {
                    setClients(JSON.parse(cachedClients));
                    setTeam(JSON.parse(cachedTeam));
                    setLoading(false); // Immediate unlock
                    console.log("⚡ [Clients] Loaded from Cache");
                    return true;
                }
            } catch (e) {
                console.warn("⚠️ [Clients] Cache load failed");
            }
            return false;
        };

        const hasCache = loadCache();
        
        // 2. Background Sync
        fetchClients(hasCache);

        // 3. Realtime Subscription with Channel Management
        setIsHQLive(true);
        const clientChannel = supabase
            .channel('hq-clients-realtime')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'clients' 
            }, () => {
                console.log("🔄 [Clients] Realtime Update Detected");
                fetchClients(true);
            })
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'team' 
            }, () => fetchClients(true))
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') setIsHQLive(true);
                if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setIsHQLive(false);
            });

        // 4. Auto-Revalidate on Window Focus
        const handleFocus = () => {
            console.log("📡 [Clients] Re-fetching on Focus...");
            fetchClients(true);
        };
        window.addEventListener('focus', handleFocus);

        return () => {
            supabase.removeChannel(clientChannel);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const handleCreateClient = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const tempId = `C-${Math.floor(Math.random() * 9000) + 1000}`;
        const clientWithId = { ...newClient, id: tempId, status: 'active', created_at: new Date().toISOString() };
        
        try {
            const created = await agencyService.createClient(clientWithId);
            setClients(prev => [created, ...prev]);
            setShowSuccessView(true);
            toast.success("Socio registrado exitosamente");
        } catch (error) {
            console.error("❌ [Flow] Creation Error:", error);
            toast.error("Error al registrar cliente");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateClient = async (id, data) => {
        try {
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
            await agencyService.updateClient(id, data);
        } catch (error) {
            console.error("❌ [Flow] Update Error:", error);
            toast.error("Fallo de Sincronización Local");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        await handleUpdateClient(id, { status: newStatus });
    };

    const handleCyclePlan = async (id, currentPlan) => {
        const plans = PLAN_OPTIONS.map(p => p.value);
        const nextIdx = (plans.indexOf(currentPlan) + 1) % plans.length;
        const nextPlan = plans[nextIdx];
        const planDef = PLAN_OPTIONS.find(p => p.value === nextPlan);
        await handleUpdateClient(id, { plan: nextPlan, price: planDef ? planDef.price : 0 });
    };

    const cmOptions = useMemo(() => {
        const staff = team.filter(m => 
            m.role?.toLowerCase().includes('community manager') || 
            m.role?.toLowerCase().includes('estratega')
        );
        return [
            ...staff.map(m => ({ value: m.name, label: m.name })),
            { value: 'Sin asignar', label: 'Sin asignar' }
        ];
    }, [team]);

    const editorOptions = useMemo(() => {
        const staff = team.filter(m => 
            m.role?.toLowerCase().includes('editor')
        );
        return [
            ...staff.map(m => ({ value: m.name, label: m.name })),
            { value: 'Sin asignar', label: 'Sin asignar' }
        ];
    }, [team]);

    const filmmakerOptions = useMemo(() => {
        const staff = team.filter(m => 
            m.role?.toLowerCase().includes('filmmaker') || 
            m.role?.toLowerCase().includes('videógrafo')
        );
        return [
            ...staff.map(m => ({ value: m.name, label: m.name })),
            { value: 'Sin asignar', label: 'Sin asignar' }
        ];
    }, [team]);

    const handleToggleCM = async (id, currentCM) => {
        const cms = cmOptions.map(o => o.value);
        const nextIdx = (cms.indexOf(currentCM) + 1) % cms.length;
        await handleUpdateClient(id, { cm: cms[nextIdx] });
    };

    const handleOpenEdit = (client) => {
        setEditingClient(client);
        setNewClient({
            ...client,
            onboarding_data: client.onboarding_data || {},
            editor: client.editor || '',
            filmmaker: client.filmmaker || '',
            growth_level: client.growth_level || 1,
            business_type: client.business_type || '',
            industry: client.industry || '',
            city: client.city || ''
        });
        setActiveEditTab('operative');
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingClient?.id) return;

        setIsEditModalOpen(false);
        const updatedData = { ...newClient };
        setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...updatedData } : c));

        try {
            await agencyService.updateClient(editingClient.id, updatedData);
            toast.success("Cambios Guardados");
        } catch (error) {
            console.error("❌ [Sync] Save Failure:", error);
        } finally {
            setEditingClient(null);
        }
    };

    const handleOpenPreview = async (client) => {
        setEditingClient(client);
        setLoading(true);
        try {
            const summary = await agencyService.getStrategySummary(client.id);
            setPreviewData(summary);
            if (summary?.nodes) {
                setActiveStrategyNodes(summary.nodes);
            } else {
                setActiveStrategyNodes([
                    { id: '1', type: 'label', data: { title: 'Objetivo Principal' } },
                    { id: '2', type: 'video', data: { title: 'Reel de Lanzamiento', subtype: 'reel' } }
                ]);
            }
            setIsPreviewModalOpen(true);
        } catch (error) {
            console.error("Error opening preview:", error);
            toast.error("Error al cargar estrategia");
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateStrategy = (clientId) => {
        router.push(`/dashboard/hq/strategy?client=${clientId}`);
    };

    const handleDeleteClient = (id) => {
        setClientToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!clientToDelete) return;
        setIsSubmitting(true);
        try {
            await agencyService.deleteClient(clientToDelete);
            await fetchClients();
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            toast.success("Socio eliminado");
        } catch (error) {
            console.error("Error deleting client:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredClients = Array.isArray(clients) ? clients.filter(c => {
        const matchesSearch = (c?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        if (activeFilter === 'risk') return matchesSearch && (c?.priority || '').toUpperCase() === 'ALTA';
        if (activeFilter === 'pending') return matchesSearch && c?.status === 'paused';
        if (activeFilter === 'active') return matchesSearch && c?.status === 'active';
        return matchesSearch;
    }) : [];

    const mrr = Array.isArray(clients) ? clients.reduce((acc, c) => acc + (Number(c.price) || 0), 0) : 0;
    const riskCount = Array.isArray(clients) ? clients.filter(c => (c?.priority || '').toUpperCase() === 'ALTA').length : 0;
    const pendingCount = Array.isArray(clients) ? clients.filter(c => c?.status === 'paused').length : 0;
    const activeCount = Array.isArray(clients) ? clients.filter(c => c?.status === 'active').length : 0;

    return (
        <div className="p-8 space-y-8 relative">
            <div className="fixed inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 80%)' }}></div>
            
            {/* Header */}
            <div className="flex justify-between items-end relative z-10">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Cartera de Clientes</h1>
                    <p className="text-gray-400 font-medium">Gestión centralizada de socios y cuentas activas.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className={`px-4 py-1.5 rounded-2xl border flex items-center gap-2 transition-all duration-500 ${
                        isHQLive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isHQLive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">HQ {isHQLive ? 'LIVE' : 'OFFLINE'}</span>
                    </div>
                    {isSyncing && (
                        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Activity className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Central Sync</span>
                        </div>
                    )}
                    <button
                        onClick={() => fetchClients()}
                        className={`px-6 py-3 bg-white/5 text-gray-400 font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10 ${isSyncing ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {isSyncing ? 'Sincronizando...' : '🔄 Sincronizar'}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Invitations */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                        <Fingerprint className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-xs italic">Protocolo de Entrada Separada</h3>
                        <p className="text-gray-400 text-[10px] font-medium tracking-tight">Genera el acceso correcto para cada tipo de perfil.</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <InviteButton label="Invitación para SOCIO" type="client" color="indigo" icon={Building2} />
                    <InviteButton label="Acceso para EQUIPO" type="team" color="purple" icon={UserPlus} />
                </div>
            </motion.div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                <StatCard title="Clientes Activos" value={activeCount} icon={Users} color="indigo" isActive={activeFilter === 'active'} onClick={() => setActiveFilter(activeFilter === 'active' ? 'all' : 'active')} />
                <StatCard title="MRR Proyectado" value={`$${mrr}`} icon={TrendingUp} color="green" isActive={false} onClick={() => setActiveFilter('all')} />
                <StatCard title="En Riesgo" value={riskCount} icon={AlertCircle} color="red" isActive={activeFilter === 'risk'} onClick={() => setActiveFilter(activeFilter === 'risk' ? 'all' : 'risk')} />
                <StatCard title="Pendientes Pago" value={pendingCount} icon={CheckCircle2} color="blue" isActive={activeFilter === 'pending'} onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')} />
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4 relative z-10">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o marca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0E0E18]/80 backdrop-blur-md border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-indigo-500/50 transition-all border-dashed"
                    />
                </div>
                <button className="px-6 rounded-2xl border border-white/5 text-gray-400 hover:bg-white/5 transition-all flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filtros
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#0E0E18]/80 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Cliente / Marca</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Plan Actual</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Community</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Ingreso Mensual</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading && clients.length === 0 ? (
                            [1, 2, 3].map(i => <SkeletonRow key={i} />)
                        ) : (
                            filteredClients.map((client) => (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={client.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                                                {client?.name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">{client?.name || 'Cliente sin nombre'}</div>
                                                <div className="text-xs text-gray-500 font-medium">Ubicación: {client?.city || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <button onClick={() => handleCyclePlan(client.id, client.plan)} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:border-indigo-500/50 hover:text-white transition-all active:scale-95">
                                            {client?.plan || 'Presencia'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-6 font-medium">
                                        <button onClick={() => handleToggleCM(client.id, client.cm)} className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-xl transition-all active:scale-95 group/cm">
                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-400 font-bold group-hover/cm:border-indigo-500">
                                                {client?.cm?.[0] || '?'}
                                            </div>
                                            <span className="text-gray-400 text-sm group-hover/cm:text-white">{client?.cm || 'Sin asignar'}</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-white">${client?.price || 0}</td>
                                    <td className="px-6 py-6">
                                        <button
                                            onClick={() => handleToggleStatus(client.id, client.status)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 hover:brightness-125 ${client.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            {client.status === 'active' ? 'Activo' : 'Pausado'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap relative">
                                        <div className="flex justify-end items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                                            <button className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all font-black uppercase tracking-widest text-[9px]" onClick={() => handleNavigateStrategy(client.id)}>
                                                Ver Estrategia
                                            </button>
                                            <button onClick={() => handleDeleteClient(client.id)} className="p-2 bg-white/5 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all border border-white/5">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleOpenEdit(client)} className="p-2 bg-white/5 hover:bg-indigo-500/10 rounded-xl text-gray-400 hover:text-indigo-500 transition-all border border-white/5">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-[#11111D] border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
                            {!showSuccessView ? (
                                <>
                                    <h2 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter">Registrar Nuevo Socio</h2>
                                    <form onSubmit={handleCreateClient} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre / Marca</label>
                                            <input type="text" required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all" placeholder="Ej: Spiga de Oro" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email de Contacto (Para invitación)</label>
                                            <input type="email" required value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-mono text-sm" placeholder="cliente@ejemplo.com" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <PremiumDropdown label="Plan" value={newClient.plan} onChange={(val) => setNewClient({ ...newClient, plan: val })} options={PLAN_OPTIONS} />
                                            <PremiumDropdown label="CM" value={newClient.cm} onChange={(val) => setNewClient({ ...newClient, cm: val })} options={cmOptions} />
                                        </div>
                                        <PremiumDropdown 
                                            label="Ciudad Base" 
                                            value={newClient.city} 
                                            onChange={(val) => setNewClient({ ...newClient, city: val })} 
                                            options={ECUADOR_CITIES} 
                                            searchable={true}
                                            icon={Globe}
                                        />
                                        <div className="flex gap-4 pt-4">
                                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest text-xs">Cancelar</button>
                                            <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">{isSubmitting ? 'Registrando...' : 'Confirmar Registro'}</button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-8">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">¡Socio Pre-Registrado!</h3>
                                        <p className="text-gray-400 text-sm font-medium">El registro base de <span className="text-white font-bold">{newClient.name}</span> está listo. Envía este enlace para que complete su identidad.</p>
                                    </div>

                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-left">Link de Invitación Estratégica</p>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-gray-500 text-[10px] font-mono truncate">
                                                {`${typeof window !== 'undefined' ? window.location.origin : ''}/onboarding?type=client`}
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const url = `${window.location.origin}/onboarding?type=client`;
                                                    navigator.clipboard.writeText(url);
                                                    toast.success("Link copiado al portapapeles");
                                                }}
                                                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-95"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => {
                                                const url = `${window.location.origin}/onboarding?type=client`;
                                                const text = `¡Hola ${newClient.name}! Bienvenido a DIIC ZONE. Para activar tu ecosistema de marca y sincronizar tu estrategia, por favor completa tu onboarding aquí: ${url}`;
                                                window.open(`https://wa.me/${newClient.whatsapp_number}?text=${encodeURIComponent(text)}`, '_blank');
                                            }}
                                            className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/10"
                                        >
                                            <MessageSquare className="w-4 h-4" /> Enviar por WhatsApp
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setShowSuccessView(false);
                                                setNewClient({ name: '', plan: 'Presencia', price: 250, target: 0, cm: '', email: '', password_initial: '', whatsapp_number: '', google_drive_folder_id: '', notes: '', onboarding_data: {} });
                                            }} 
                                            className="w-full py-4 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                                        >
                                            Finalizar y Cerrar
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal (Strategist Hub) - Premium God Mode Redesign */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative w-full max-w-6xl bg-[#080814] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[85vh]">
                            
                            {/* LEFT SIDEBAR: Visual Branding (Fixed) */}
                            <div className="w-full md:w-[35%] h-full relative border-r border-white/5 bg-[#05050A] flex flex-col justify-between p-10 overflow-hidden">
                                {/* Ambient Background */}
                                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                                    <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[120px]" />
                                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[100px]" />
                                </div>

                                {/* Top: Brand Visual */}
                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between items-start">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] leading-none">
                                            0.6 — Final Identity
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                                            <Shield className="w-3.5 h-3.5 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="relative group mb-8">
                                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                                            <div className="relative w-32 h-32 rounded-[32px] bg-[#0A0A1F] border border-white/10 flex items-center justify-center text-5xl font-black text-white shadow-2xl overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                                                {editingClient?.onboarding_data?.brand?.logo ? (
                                                    <img src={editingClient.onboarding_data.brand.logo} alt="Brand Logo" className="w-full h-full object-contain p-2 relative z-10" />
                                                ) : (
                                                    <span className="relative z-10">{editingClient?.name?.[0] || 'D'}</span>
                                                )}
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter text-center leading-tight">
                                            {editingClient?.name || 'Partner'}
                                        </h2>
                                        <div className="h-[1px] w-12 bg-indigo-500/30 my-6" />
                                        <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.3em] text-center">
                                            OPERATIONAL ECOSYSTEM
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom: Meta Data */}
                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                                            <span>Security Protocol</span>
                                            <span className="text-indigo-400">ENCRYPTED</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Partner ID</span>
                                                <span className="text-xs font-mono font-bold text-white tracking-widest">{editingClient?.id}</span>
                                            </div>
                                            <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Status</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${editingClient?.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${editingClient?.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {editingClient?.status === 'active' ? 'Active' : 'Paused'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-end justify-between opacity-20 group-hover:opacity-40 transition-opacity">
                                        <div className="space-y-1">
                                            <div className="w-16 h-[1px] bg-white" />
                                            <div className="w-10 h-[1px] bg-white" />
                                            <div className="w-14 h-[1px] bg-white" />
                                        </div>
                                        <div className="text-[8px] font-mono text-white leading-none text-right">
                                            ADMIN_HUB_V4.8<br />
                                            SYSTEMS_CORE_INIT
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT CONTENT: Control Panel (Scrollable) */}
                            <div className="flex-1 h-full flex flex-col bg-[#080814]">
                                {/* Header / Nav */}
                                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-[18px]">
                                        {[
                                            { id: 'operative', label: 'Logística', icon: Layout },
                                            { id: 'team', label: 'Escuadra', icon: Users },
                                            { id: 'strategy', label: 'Hojas de Ruta', icon: Target },
                                            { id: 'growth', label: 'Performance', icon: TrendingUp },
                                            { id: 'ai', label: 'Cerebro AI', icon: Sparkles }
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveEditTab(tab.id)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-[14px] transition-all text-[9.5px] font-black uppercase tracking-widest ${
                                                    activeEditTab === tab.id 
                                                        ? 'bg-white text-black shadow-xl ring-4 ring-white/5' 
                                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                <tab.icon className={`w-3.5 h-3.5 ${activeEditTab === tab.id ? 'text-indigo-600' : ''}`} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content Grid */}
                                <div className="flex-1 overflow-y-auto p-10 pb-60 custom-scrollbar">
                                    <form onSubmit={handleSaveEdit} id="edit-client-form">
                                        <AnimatePresence mode="wait">
                                            {activeEditTab === 'operative' && (
                                                <motion.div 
                                                    key="operative"
                                                    initial={{ opacity: 0, x: 10 }} 
                                                    animate={{ opacity: 1, x: 0 }} 
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="space-y-12"
                                                >
                                                    {/* Technical Specs Header */}
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <SpecItem label="Plan Actual" value={editingClient?.plan || 'Standard'} icon={Shield} />
                                                        <SpecItem label="MRR Revenue" value={`$${editingClient?.price || 0}`} icon={DollarSign} />
                                                        <SpecItem label="Location" value={editingClient?.city || 'HQ'} icon={Globe} />
                                                        <SpecItem label="Sector" value={editingClient?.industry || 'General'} icon={Activity} />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                                        <div className="space-y-10">
                                                            <GlassInput 
                                                                label="Nombre de la Marca" 
                                                                value={newClient.name} 
                                                                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} 
                                                                icon={Building2}
                                                                placeholder="Nombre comercial..."
                                                            />
                                                            <PremiumDropdown 
                                                                label="Ubicación Estratégica" 
                                                                value={newClient.city} 
                                                                onChange={(val) => setNewClient({ ...newClient, city: val })} 
                                                                options={ECUADOR_CITIES} 
                                                                searchable={true}
                                                                icon={Globe}
                                                            />
                                                            <PremiumDropdown 
                                                                label="Industria / Sector" 
                                                                value={newClient.industry} 
                                                                onChange={(val) => setNewClient({ ...newClient, industry: val })} 
                                                                options={INDUSTRY_OPTIONS}
                                                                icon={Shield}
                                                                searchable={true}
                                                            />
                                                            {newClient.industry?.toLowerCase().includes('médico') && (
                                                                <PremiumDropdown 
                                                                    label="Especialidad Médica" 
                                                                    value={newClient.specialty} 
                                                                    onChange={(val) => setNewClient({ ...newClient, specialty: val })} 
                                                                    options={MEDICAL_SPECIALTIES} 
                                                                    icon={Stethoscope}
                                                                />
                                                            )}
                                                            {(newClient.industry?.toLowerCase().includes('agro') || newClient.industry?.toLowerCase().includes('ganader')) && (
                                                                <PremiumDropdown 
                                                                    label="Rama Agropecuaria" 
                                                                    value={newClient.specialty} 
                                                                    onChange={(val) => setNewClient({ ...newClient, specialty: val })} 
                                                                    options={AGRO_SPECIALTIES} 
                                                                    icon={Activity}
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="space-y-10">
                                                            <GlassInput 
                                                                label="WhatsApp de Contacto" 
                                                                value={newClient.whatsapp_number} 
                                                                onChange={(e) => setNewClient({ ...newClient, whatsapp_number: e.target.value })} 
                                                                icon={MessageSquare}
                                                                placeholder="+593 ..."
                                                                className="font-mono"
                                                            />
                                                            <GlassInput 
                                                                label="Inversión Mensual (USD)" 
                                                                value={newClient.price} 
                                                                onChange={(e) => setNewClient({ ...newClient, price: parseInt(e.target.value) || 0 })} 
                                                                icon={DollarSign}
                                                                type="number"
                                                                placeholder="0.00"
                                                            />
                                                            <GlassInput 
                                                                label="Email Sync" 
                                                                value={newClient.email} 
                                                                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} 
                                                                icon={Mail}
                                                                type="email"
                                                                placeholder="cliente@ejemplo.com"
                                                            />
                                                            <PremiumDropdown 
                                                                label="Modelo de Negocio" 
                                                                value={newClient.business_type} 
                                                                onChange={(val) => setNewClient({ ...newClient, business_type: val })} 
                                                                options={[
                                                                    { value: 'Servicios', label: 'Servicios Profesionales' }, 
                                                                    { value: 'Productos', label: 'E-commerce / Retail' }, 
                                                                    { value: 'Personal', label: 'Marca Personal' },
                                                                    { value: 'Educativo', label: 'Capacitación / Formación' },
                                                                    { value: 'Infoproductos', label: 'Infoproductos / Cursos' }
                                                                ]} 
                                                                icon={Zap}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Notas / Biografía (Synced from Client Profile) */}
                                                    <div className="space-y-2 mt-8">
                                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                            <BookOpen className="w-3.5 h-3.5" /> Biografía / Notas de la Marca
                                                        </label>
                                                        <textarea
                                                            value={newClient.notes || ''}
                                                            onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                                                            placeholder="Biografía corta ingresada por el cliente..."
                                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all min-h-[100px] resize-none text-sm"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeEditTab === 'team' && (
                                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <PremiumDropdown label="CM Responsable" icon={Star} value={newClient.cm} onChange={(val) => setNewClient({ ...newClient, cm: val })} options={cmOptions} />
                                                        <PremiumDropdown label="Editor Asignado" icon={Zap} value={newClient.editor} onChange={(val) => setNewClient({ ...newClient, editor: val })} options={editorOptions} />
                                                        <PremiumDropdown label="Filmmaker / Videógrafo" icon={Zap} value={newClient.filmmaker} onChange={(val) => setNewClient({ ...newClient, filmmaker: val })} options={filmmakerOptions} />
                                                        <PremiumDropdown label="Plan Estratégico" icon={Shield} value={newClient.plan} onChange={(val) => {
                                                            const planDef = PLAN_OPTIONS.find(p => p.value === val);
                                                            setNewClient({ ...newClient, plan: val, price: planDef ? planDef.price : newClient.price });
                                                        }} options={PLAN_OPTIONS} />
                                                    </div>

                                                    {/* Desglose de Gastos Operativos (Creativos) */}
                                                    {(() => {
                                                        const planSelected = PLAN_OPTIONS.find(p => p.value === newClient.plan) || PLAN_OPTIONS[0];
                                                        const { videos, reels } = planSelected.deliverables;
                                                        const editorEarnings = (reels * CREATIVE_RATES.reel_edit) + (videos * CREATIVE_RATES.vid_promo);
                                                        const filmmakerEarnings = reels * CREATIVE_RATES.reel_prod;
                                                        const remainingMargin = (newClient.price || 0) - editorEarnings - filmmakerEarnings - CREATIVE_RATES.cm_base;

                                                        return (
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                <div className="p-6 rounded-[2rem] bg-indigo-900/10 border border-indigo-500/20 relative overflow-hidden group">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2"><Layout className="w-3 h-3" /> Pago a Editor</h4>
                                                                    <div className="text-3xl font-black text-white italic relative z-10">${editorEarnings}</div>
                                                                    <div className="text-[10px] text-gray-500 mt-2 relative z-10">({reels} reels x ${CREATIVE_RATES.reel_edit}, {videos} vids x ${CREATIVE_RATES.vid_promo})</div>
                                                                </div>
                                                                <div className="p-6 rounded-[2rem] bg-emerald-900/10 border border-emerald-500/20 relative overflow-hidden group">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2"><Video className="w-3 h-3" /> Pago Filmmaker</h4>
                                                                    <div className="text-3xl font-black text-white italic relative z-10">${filmmakerEarnings}</div>
                                                                    <div className="text-[10px] text-gray-500 mt-2 relative z-10">Rodaje: {reels} reels x ${CREATIVE_RATES.reel_prod}</div>
                                                                </div>
                                                                <div className="p-6 rounded-[2rem] bg-amber-900/10 border border-amber-500/20 relative overflow-hidden group">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Margen Base</h4>
                                                                    <div className="text-3xl font-black text-white italic relative z-10">${remainingMargin > 0 ? remainingMargin : 0}</div>
                                                                    <div className="text-[10px] text-gray-500 mt-2 relative z-10">CM Base: ${CREATIVE_RATES.cm_base} descontado.</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                                            <Shield className="w-6 h-6 text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Squad Synchronization Notice</h4>
                                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Cualquier cambio en la escuadra afectará el cálculo de rentabilidad del cliente y las notificaciones de tareas automáticas del sistema central.</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeEditTab === 'strategy' && (
                                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                                                    
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2 mb-6">
                                                        <Sparkles className="w-4 h-4" /> Perfil Estratégico Sincronizado
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {[
                                                            { title: 'Liderazgo / Fundadores', key: 'leadership' },
                                                            { title: '¿Qué Hace?', key: 'whatItDoes' },
                                                            { title: 'Público Objetivo', key: 'targetAudience' },
                                                            { title: 'Problema que Resuelve', key: 'problemSolved' },
                                                            { title: '¿Qué Ofrece?', key: 'whatItOffers' },
                                                            { title: 'Contexto del Mercado', key: 'marketContext' }
                                                        ].map((item, i) => (
                                                            <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                                                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors" />
                                                                <p className="text-[9px] font-black text-indigo-400/80 uppercase tracking-widest relative z-10">{item.title}</p>
                                                                <p className="text-gray-300 text-xs font-medium italic leading-relaxed relative z-10 line-clamp-4 group-hover:line-clamp-none transition-all">
                                                                    {newClient.onboarding_data?.strategic?.[item.key] ? `"${newClient.onboarding_data.strategic[item.key]}"` : <span className="text-gray-600">Pendiente de infiltración...</span>}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="p-8 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 flex justify-between items-center mt-6">
                                                        <div>
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Meta Estratégica (Target)</span>
                                                            <span className="text-emerald-400 font-black text-2xl italic tracking-tighter leading-none">{newClient.onboarding_data?.strategic?.target || newClient.target || 0} Seguidores / Leads</span>
                                                        </div>
                                                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                                            <p className="text-[10px] text-emerald-500/60 font-medium italic uppercase tracking-tight">"Sincronizado en tiempo real"</p>
                                                        </div>
                                                    </div>

                                                </motion.div>
                                            )}

                                            {activeEditTab === 'growth' && (
                                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col items-center justify-center space-y-12 py-10">
                                                    <div className="w-full max-w-lg space-y-12">
                                                        <div className="text-center space-y-8">
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Current Growth Level</p>
                                                                <div className="h-[1px] w-24 bg-indigo-500/30 mx-auto" />
                                                            </div>
                                                            <div className="flex justify-center gap-6">
                                                                {[1, 2, 3, 4, 5].map(level => (
                                                                    <button
                                                                        key={level}
                                                                        type="button"
                                                                        onClick={() => setNewClient({ ...newClient, growth_level: level })}
                                                                        className={`w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                                                                            newClient.growth_level >= level 
                                                                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_40px_rgba(79,70,229,0.25)]' 
                                                                                : 'bg-white/5 border-white/5 text-gray-700'
                                                                        }`}
                                                                    >
                                                                        <span className="text-2xl font-black">{level}</span>
                                                                        <div className={`w-1.5 h-1.5 rounded-full mt-2 ${newClient.growth_level >= level ? 'bg-white' : 'bg-gray-800'}`} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <p className="text-sm font-black text-indigo-400 tracking-[0.2em] uppercase italic">
                                                                {['Estancado', 'Estable', 'En Crecimiento', 'Aceleración', 'Escalado Total'][newClient.growth_level - 1]}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-4 pt-12 border-t border-white/5 relative">
                                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 rounded-full bg-[#080814] border border-white/5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                                                STRATEGIST LOG BOOK
                                                            </div>
                                                            <textarea 
                                                                value={newClient.notes} 
                                                                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })} 
                                                                className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 text-gray-300 outline-none focus:border-indigo-500/30 transition-all font-medium text-sm italic resize-none shadow-inner" 
                                                                rows="6"
                                                                placeholder="Anota aquí las observaciones estratégicas, cuellos de botella o hitos alcanzados..."
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeEditTab === 'ai' && (
                                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                                                    <AdminClientAIHub client={editingClient} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </form>
                                </div>

                                {/* Footer Action Bar */}
                                <div className="px-10 py-10 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-indigo-500/40 text-[9px] font-black uppercase tracking-[0.3em]">
                                            <Shield className="w-3.5 h-3.5" /> SECURE_INIT
                                        </div>
                                        <div className="h-4 w-[1px] bg-white/5" />
                                        <div className="flex items-center gap-4 text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">
                                            <span>REV 0.04</span>
                                            <span>HQ:LATAM</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 w-full md:w-auto">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsEditModalOpen(false)} 
                                            className="px-6 py-4 text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all active:scale-95"
                                        >
                                            Discard Changes
                                        </button>
                                        <button 
                                            form="edit-client-form"
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className="group relative flex-1 md:flex-none px-12 py-4 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all overflow-hidden flex items-center gap-4"
                                        >
                                            {isSubmitting ? 'Syncing...' : 'Deploy Roadmap'}
                                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                )}
            </AnimatePresence>

            {/* Advanced Strategy Preview Modal */}
            <AnimatePresence>
                {isPreviewModalOpen && previewData && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewModalOpen(false)} className="absolute inset-0 bg-[#020205]/95 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} className="relative w-full max-w-[95vw] h-[90vh] bg-[#0A0B14] border border-white/10 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
                            <div className="hidden md:block w-80 h-full border-r border-white/5">
                                <StrategicOutliner nodes={activeStrategyNodes} onNodeSelect={() => {}} onUpdateNode={(id, data) => setActiveStrategyNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n))} />
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col items-center">
                                <div className="w-full max-w-2xl text-center space-y-6">
                                    <div className="inline-flex px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">Ecosistema de Marca v2.1</div>
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter">{editingClient?.name}</h2>
                                    <div className="relative py-10 w-full flex justify-center">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-indigo-600/5 blur-[120px] rounded-full" />
                                        <VisionEcosystem client={editingClient} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-left">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Visión IA</p>
                                            <p className="text-gray-300 text-sm italic font-medium">"Este cliente muestra un potencial de escalabilidad del 40% en canales orgánicos. Se recomienda intensificar Reels de autoridad."</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-left">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Estado de Sincronización</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-white font-bold text-sm">Google Drive: Activo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 justify-center pt-8 pb-10">
                                        <button onClick={() => handleNavigateStrategy(editingClient?.id)} className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl uppercase tracking-widest text-xs hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-600/20">Abrir Tablero de Guerra</button>
                                        <button onClick={() => setIsStrategicWizardOpen(true)} className="px-10 py-5 bg-white/5 text-white font-black rounded-3xl border border-white/10 uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Re-Diseñar Hoja de Ruta</button>
                                        <button onClick={() => setIsPreviewModalOpen(false)} className="px-10 py-5 bg-transparent text-gray-500 font-black rounded-3xl uppercase tracking-widest text-xs hover:text-white transition-all">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Strategic Wizard Integration */}
            <AnimatePresence>
                {isStrategicWizardOpen && (
                    <StrategyCreationWizard 
                        onComplete={(config) => {
                            console.log("Strategic config deployed:", config);
                            setIsStrategicWizardOpen(false);
                            toast.success("Estrategia Desplegada con éxito");
                        }}
                        onCancel={() => setIsStrategicWizardOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#0A0A1F] border border-white/10 p-10 rounded-[40px] max-w-md w-full text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-white mb-2">¿Eliminar Socio?</h3>
                            <p className="text-gray-500 mb-8">Esta acción es permanente.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="py-3 bg-white/5 text-gray-400 font-bold rounded-xl font-black uppercase tracking-widest text-[10px]">Cancelar</button>
                                <button onClick={confirmDelete} disabled={isSubmitting} className="py-3 bg-red-600 text-white font-bold rounded-xl font-black uppercase tracking-widest text-[10px]">{isSubmitting ? 'Eliminando...' : 'Eliminar'}</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, isActive, onClick }) {
    const colors = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        red: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    };

    return (
        <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-6 border rounded-3xl cursor-pointer bg-[#0E0E18]/60 backdrop-blur-sm transition-all ${isActive ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.15)] bg-indigo-500/5' : 'border-white/5 hover:border-white/10'}`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">{value}</div>
        </motion.div>
    );
}

function SkeletonRow() {
    return (
        <tr className="border-b border-white/5 animate-pulse">
            <td className="px-6 py-6" colSpan={6}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="h-4 w-1/4 bg-white/5 rounded-full" />
                </div>
            </td>
        </tr>
    );
}

function InviteButton({ label, type, color, icon: Icon }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const url = `${window.location.origin}/onboarding?type=${type}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success(`Enlace copiado`, {
            description: `Se ha generado el link de acceso para ${type === 'client' ? 'Socio' : 'Equipo'}.`
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const colors = {
        indigo: 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20 hover:bg-indigo-600 hover:text-white',
        purple: 'bg-purple-500/5 text-purple-400 border-purple-500/20 hover:bg-purple-600 hover:text-white'
    };

    return (
        <button 
            onClick={handleCopy}
            className={`flex items-center gap-3 px-5 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group/invite ${colors[color]}`}
        >
            <Icon className={`w-4 h-4 transition-transform ${copied ? 'scale-0' : 'group-hover/invite:rotate-12'}`} />
            {copied ? '¡Enlace Copiado!' : label}
            <div className={`w-1 h-1 rounded-full ml-auto ${copied ? 'bg-current animate-ping' : 'bg-current/10'}`} />
        </button>
    );
}

function SpecItem({ label, value, icon: Icon }) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2 group hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-2 opacity-40">
                <Icon className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-white font-bold text-xs truncate">
                {value}
            </div>
        </div>
    );
}
