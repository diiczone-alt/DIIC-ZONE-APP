'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Plus, MoreVertical, ExternalLink, Shield, TrendingUp, AlertCircle, CheckCircle2, Trash2, Edit, Pause, Play, BookOpen, Target, Clock, MessageSquare, ArrowRight, ChevronDown, Building2, Fingerprint, Copy, UserPlus, Zap, DollarSign, Star, Layout, Sparkles, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { agencyService } from '@/services/agencyService';
import VisionEcosystem from '@/components/VisionEcosystem';
import { toast } from 'sonner';
import { isCloudConnected } from '@/lib/supabase';
import StrategicOutliner from '@/components/shared/Strategy/StrategicOutliner';
import StrategyCreationWizard from '@/components/shared/Strategy/StrategyCreationWizard';

// --- PREMIUM DROPDOWN COMPONENT ---
const PremiumDropdown = ({ value, onChange, options, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className="space-y-3 relative" ref={containerRef}>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 flex items-center gap-2">
                {Icon && <Icon className="w-3 h-3" />} {label}
            </label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/[0.03] border ${isOpen ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'border-white/5'} rounded-2xl py-4 px-6 text-white cursor-pointer transition-all flex items-center justify-between group`}
            >
                <span className="font-bold">{selectedOption?.label || value}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[200] top-full left-0 right-0 mt-2 bg-[#0A0A1F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-4xl overflow-hidden p-2"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`px-5 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group
                                    ${value === option.value ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="font-bold text-sm">{option.label}</span>
                                {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]" />}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [activeEditTab, setActiveEditTab] = useState('operative');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStrategicWizardOpen, setIsStrategicWizardOpen] = useState(false);
    const [activeStrategyNodes, setActiveStrategyNodes] = useState([]);
    const [newClient, setNewClient] = useState({
        name: '',
        plan: 'Basic',
        price: 0,
        target: 0,
        cm: '',
        email: '',
        password_initial: '',
        whatsapp_number: '',
        google_drive_folder_id: '',
        notes: '',
        onboarding_data: {}
    });

    const fetchClients = async () => {
        if (loading) return;
        setLoading(true);
        setSyncStep('connecting');
        
        try {
            console.log("📡 [Tracker] Milestone: Connecting...");
            const [clientData, teamData] = await Promise.all([
                agencyService.getClients(),
                agencyService.getTeam()
            ]);
            
            setSyncStep('processing');
            if (Array.isArray(clientData)) setClients(clientData);
            if (Array.isArray(teamData)) setTeam(teamData);
            
            setSyncStep('done');
        } catch (error) {
            console.error("❌ [Tracker] Milestone: Failure.", error);
            setSyncStep('error');
            toast.error("Error de Sincronización", {
                description: "Revisa tu conexión a Supabase."
            });
        } finally {
            setLoading(false);
            setTimeout(() => setSyncStep(''), 2000);
        }
    };

    useEffect(() => {
        fetchClients();
        console.log("🚦 [Dashboard] Active and Synchronized.");
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
            setIsModalOpen(false); 
            setNewClient({ name: '', plan: 'Basic', price: 0, target: 0, cm: '', email: '', password_initial: '', whatsapp_number: '', google_drive_folder_id: '', notes: '', onboarding_data: {} });
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
        const plans = ['Basic', 'Premium', 'Agency'];
        const nextIdx = (plans.indexOf(currentPlan) + 1) % plans.length;
        await handleUpdateClient(id, { plan: plans[nextIdx] });
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

    const handleToggleCM = async (id, currentCM) => {
        const cms = cmOptions.map(o => o.value);
        const nextIdx = (cms.indexOf(currentCM) + 1) % cms.length;
        await handleUpdateClient(id, { cm: cms[nextIdx] });
    };

    const handleOpenEdit = (client) => {
        setEditingClient(client);
        setNewClient({
            name: client.name || '',
            plan: client.plan || 'Basic',
            price: client.price || 0,
            target: client.target || 0,
            cm: client.cm || '',
            email: client.email || '',
            password_initial: client.password_initial || '',
            whatsapp_number: client.whatsapp_number || '',
            google_drive_folder_id: client.google_drive_folder_id || '',
            notes: client.notes || '',
            onboarding_data: client.onboarding_data || {}
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
            // Si el resumen tiene nodos de estrategia, los cargamos para el Outliner
            if (summary?.nodes) {
                setActiveStrategyNodes(summary.nodes);
            } else {
                // Fallback default nodes for demonstration
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
        router.push(`/dashboard/strategy?client=${clientId}`);
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
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Cartera de Clientes</h1>
                    <p className="text-gray-400">Gestión centralizada de socios y cuentas activas.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                        isCloudConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-amber-500 animate-pulse'}`} />
                        {isCloudConnected ? 'Real Cloud Connected' : 'Local Mock Active'}
                    </div>
                    <button
                        onClick={fetchClients}
                        className={`px-6 py-3 bg-white/5 text-gray-400 font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {loading ? 'Sincronizando...' : '🔄 Sincronizar'}
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
                className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6"
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
                    <InviteButton label="Invitación para EQUIPO" type="creative" color="purple" icon={UserPlus} />
                </div>
            </motion.div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Clientes Activos" value={activeCount} icon={Users} color="indigo" isActive={activeFilter === 'active'} onClick={() => setActiveFilter(activeFilter === 'active' ? 'all' : 'active')} />
                <StatCard title="MRR Proyectado" value={`$${mrr}`} icon={TrendingUp} color="green" isActive={false} onClick={() => setActiveFilter('all')} />
                <StatCard title="En Riesgo" value={riskCount} icon={AlertCircle} color="red" isActive={activeFilter === 'risk'} onClick={() => setActiveFilter(activeFilter === 'risk' ? 'all' : 'risk')} />
                <StatCard title="Pendientes Pago" value={pendingCount} icon={CheckCircle2} color="blue" isActive={activeFilter === 'pending'} onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')} />
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o marca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0E0E18] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-indigo-500/50 transition-all border-dashed"
                    />
                </div>
                <button className="px-6 rounded-2xl border border-white/5 text-gray-400 hover:bg-white/5 transition-all flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filtros
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
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
                        {loading ? (
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
                                                <div className="text-xs text-gray-500">Ubicación: {client?.city || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <button onClick={() => handleCyclePlan(client.id, client.plan)} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:border-indigo-500/50 hover:text-white transition-all active:scale-95">
                                            {client?.plan || 'Básico'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-6">
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
                                        <div className="flex justify-end items-center gap-2">
                                            <button className="px-4 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all" onClick={() => handleOpenPreview(client)}>
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
                            <h2 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter">Registrar Nuevo Socio</h2>
                            <form onSubmit={handleCreateClient} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre / Marca</label>
                                    <input type="text" required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <PremiumDropdown label="Plan" value={newClient.plan} onChange={(val) => setNewClient({ ...newClient, plan: val })} options={[{ value: 'Basic', label: 'Basic' }, { value: 'Premium', label: 'Premium' }, { value: 'Enterprise', label: 'Enterprise' }]} />
                                    <PremiumDropdown label="CM" value={newClient.cm} onChange={(val) => setNewClient({ ...newClient, cm: val })} options={cmOptions} />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest text-xs">Cancelar</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs">{isSubmitting ? 'Registrando...' : 'Confirmar'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative w-full max-w-xl bg-[#080814] border border-white/10 rounded-[3rem] p-10 overflow-hidden">
                            <h2 className="text-2xl font-black text-white mb-6 uppercase">Editar Socio</h2>
                            <form onSubmit={handleSaveEdit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre / Marca</label>
                                    <input type="text" required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none font-bold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Inversión (USD)</label>
                                        <input type="number" value={newClient.price} onChange={(e) => setNewClient({ ...newClient, price: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">WhatsApp</label>
                                        <input type="text" value={newClient.whatsapp_number} onChange={(e) => setNewClient({ ...newClient, whatsapp_number: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Cerrar</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl uppercase tracking-widest text-xs">Guardar</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Advanced Strategy Preview Modal */}
            <AnimatePresence>
                {isPreviewModalOpen && previewData && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setIsPreviewModalOpen(false)} 
                            className="absolute inset-0 bg-[#020205]/95 backdrop-blur-3xl" 
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 30 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 30 }} 
                            className="relative w-full max-w-[95vw] h-[90vh] bg-[#0A0B14] border border-white/10 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Left: Strategic Outliner (The Missing Implementation) */}
                            <div className="hidden md:block w-80 h-full border-r border-white/5">
                                <StrategicOutliner 
                                    nodes={activeStrategyNodes} 
                                    onNodeSelect={() => {}} 
                                    onUpdateNode={(id, data) => setActiveStrategyNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n))}
                                />
                            </div>

                            {/* Center: Ecosystem & Details */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col items-center">
                                <div className="w-full max-w-2xl text-center space-y-6">
                                    <div className="inline-flex px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                        Ecosistema de Marca v2.1
                                    </div>
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter">{editingClient?.name}</h2>
                                    
                                    <div className="relative py-10 w-full flex justify-center">
                                        {/* Dynamic Glow background */}
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
                                        <button 
                                            onClick={() => handleNavigateStrategy(editingClient?.id)} 
                                            className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl uppercase tracking-widest text-xs hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-600/20"
                                        >
                                            Abrir Tablero de Guerra
                                        </button>
                                        <button 
                                            onClick={() => setIsStrategicWizardOpen(true)}
                                            className="px-10 py-5 bg-white/5 text-white font-black rounded-3xl border border-white/10 uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                        >
                                            Re-Diseñar Hoja de Ruta
                                        </button>
                                        <button 
                                            onClick={() => setIsPreviewModalOpen(false)} 
                                            className="px-10 py-5 bg-transparent text-gray-500 font-black rounded-3xl uppercase tracking-widest text-xs hover:text-white transition-all"
                                        >
                                            Cerrar
                                        </button>
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
                                <button onClick={() => setIsDeleteModalOpen(false)} className="py-3 bg-white/5 text-gray-400 font-bold rounded-xl">Cancelar</button>
                                <button onClick={confirmDelete} disabled={isSubmitting} className="py-3 bg-red-600 text-white font-bold rounded-xl">{isSubmitting ? 'Eliminando...' : 'Eliminar'}</button>
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
        indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            onClick={onClick}
            className={`p-6 border rounded-3xl cursor-pointer bg-[#0E0E18] ${isActive ? 'border-indigo-500/50' : 'border-white/5'}`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</div>
            <div className="text-2xl font-black text-white italic">{value}</div>
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
        toast.success(`Enlace copiado`);
        setTimeout(() => setCopied(false), 2000);
    };

    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white'
    };

    return (
        <button onClick={handleCopy} className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${colors[color]} font-black uppercase text-[10px] transition-all`}>
            <Icon className="w-4 h-4" />
            {copied ? '¡COPIADO!' : label}
            <Copy className="w-3 h-3 opacity-30 ml-2" />
        </button>
    );
}
