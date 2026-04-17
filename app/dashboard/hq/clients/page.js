'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Plus, MoreVertical, ExternalLink, Shield, TrendingUp, AlertCircle, CheckCircle2, Trash2, Edit, Pause, Play, BookOpen, Target, Clock, MessageSquare, ArrowRight, ChevronDown, Building2, Fingerprint, Copy, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { agencyService } from '@/services/agencyService';
import VisionEcosystem from '@/components/VisionEcosystem';
import { toast } from 'sonner';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newClient, setNewClient] = useState({
        name: '',
        plan: 'Basic',
        price: 0,
        target: 0,
        cm: '',
        email: '',
        password_initial: ''
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

    const handleEmergencyReset = () => {
        if (!confirm("⚠️ ¿Resetear sistema? Esto borrará la memoria local y refrescará la página para solucionar bloqueos.")) return;
        localStorage.clear();
        window.location.reload();
    };

    useEffect(() => {
        fetchClients(); // Restored: Automatic load on mount
        console.log("🚦 [Dashboard] Active and Synchronized.");
    }, []);

    const handleCreateClient = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // 1. DIRECT-FIRE UI (CLOSE MODAL & SHOW LOCAL DATA)
        setIsModalOpen(false); 
        
        const tempId = `C-${Math.floor(Math.random() * 9000) + 1000}`;
        const clientWithId = { ...newClient, id: tempId, status: 'active', created_at: new Date().toISOString() };
        
        setClients(prev => [clientWithId, ...prev]);
        setNewClient({ name: '', plan: 'Basic', price: 0, target: 0, cm: '', email: '', password_initial: '' });

        // 2. BACKGROUND SYNC (SILENT)
        try {
            await agencyService.createClient(clientWithId);
            toast.success("Socio registrado en la nube");
        } catch (error) {
            console.error("❌ [Flow] Creation Error:", error);
            toast.error("Error de Nube", { description: "Guardado localmente. Se sincronizará luego." });
        }
    };

    const handleUpdateClient = async (id, data) => {
        try {
            // Optimistic UI update
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
            
            // Execute silent cloud sync
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
            password_initial: client.password_initial || ''
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingClient?.id) return;

        // 1. DIRECT-FIRE UI (CLOSE MODAL IMMEDIATELY)
        setIsEditModalOpen(false);
        
        // 2. UPDATE LOCAL STATE
        const updatedData = { ...newClient };
        setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...updatedData } : c));

        // 3. BACKGROUND SYNC (SILENT)
        try {
            await agencyService.updateClient(editingClient.id, updatedData);
            toast.success("Cambios Guardados", {
                icon: '⚡',
                description: "Nube actualizada."
            });
        } catch (error) {
            console.error("❌ [Sync] Save Failure:", error);
            toast.error("Pendiente de Sincro", {
                description: "Tus cambios están a salvo en este dispositivo."
            });
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
            setIsPreviewModalOpen(true);
        } catch (error) {
            console.error("Error opening preview:", error);
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
            toast.success("Socio eliminado", {
                description: "Los datos han sido removidos de la nube."
            });
        } catch (error) {
            console.error("Error deleting client:", error);
            toast.error("Error al eliminar", {
                description: "No se pudo retirar al socio de la base de datos."
            });
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
                <div className="flex gap-4">
                    <button
                        onClick={fetchClients}
                        className={`px-6 py-3 bg-white/5 text-gray-400 font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Clock className="w-4 h-4" />
                                </motion.div>
                                {syncStep === 'connecting' ? 'Conectando...' : 
                                 syncStep === 'processing' ? 'Recibiendo...' : 'Sincronizando...'}
                            </span>
                        ) : '🔄 Sincronizar Datos Reales'}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* CENTRO DE INVITACIONES (PROTOCOL SEPARATION) */}
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
                        <p className="text-gray-400 text-[10px] font-medium tracking-tight">Genera el acceso correcto para cada tipo de perfil y evita cruce de datos.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <InviteButton 
                        label="Invitación para SOCIO" 
                        type="client" 
                        color="indigo" 
                        icon={Building2} 
                    />
                    <InviteButton 
                        label="Invitación para EQUIPO" 
                        type="creative" 
                        color="purple" 
                        icon={UserPlus} 
                    />
                </div>
            </motion.div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    title="Clientes Activos" 
                    value={activeCount} 
                    icon={Users} 
                    color="indigo" 
                    isActive={activeFilter === 'active'}
                    onClick={() => setActiveFilter(activeFilter === 'active' ? 'all' : 'active')}
                />
                <StatCard 
                    title="MRR Proyectado" 
                    value={`$${mrr}`} 
                    icon={TrendingUp} 
                    color="green" 
                    isActive={false}
                    onClick={() => setActiveFilter('all')}
                />
                <StatCard 
                    title="En Riesgo" 
                    value={riskCount} 
                    icon={AlertCircle} 
                    color="red" 
                    isActive={activeFilter === 'risk'}
                    onClick={() => setActiveFilter(activeFilter === 'risk' ? 'all' : 'risk')}
                />
                <StatCard 
                    title="Pendientes Pago" 
                    value={pendingCount} 
                    icon={CheckCircle2} 
                    color="blue" 
                    isActive={activeFilter === 'pending'}
                    onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
                />
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
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={client.id}
                                    className="hover:bg-white/[0.01] transition-colors group"
                                >
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                                                {client?.name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">{client?.name || 'Cliente sin nombre'}</div>
                                                <div className="text-xs text-gray-500">Ubicación: {client?.city || '-'} • Tipo: {client?.type || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <button
                                            onClick={() => handleCyclePlan(client.id, client.plan)}
                                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:border-indigo-500/50 hover:text-white transition-all active:scale-95"
                                        >
                                            {client?.plan || 'Básico'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-6">
                                        <button
                                            onClick={() => handleToggleCM(client.id, client.cm)}
                                            className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-xl transition-all active:scale-95 group/cm"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-400 font-bold group-hover/cm:border-indigo-500">
                                                {client?.cm?.[0] || '?'}
                                            </div>
                                            <span className="text-gray-400 text-sm group-hover/cm:text-white">{client?.cm || 'Sin asignar'}</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-white font-bold">${client?.price || 0}</div>
                                        <div className="text-[10px] text-green-500 font-bold">Meta: ${client?.target || client?.price || 0}</div>
                                    </td>
                                    <td className="px-6 py-6 font-mono">
                                        <button
                                            onClick={() => handleToggleStatus(client.id, client.status)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 hover:brightness-125 ${client.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            {client.status === 'active' ? 'Activo' : 'Pausado'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap relative">
                                        <div className="flex justify-end items-center gap-2">
                                            <button
                                                className="px-4 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all group/btn"
                                                onClick={() => handleOpenPreview(client)}
                                            >
                                                Ver Estrategia
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClient(client.id)}
                                                className="p-2 bg-white/5 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all border border-white/5"
                                                title="Eliminar Cliente"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                                                    className={`p-2 rounded-xl transition-all border ${activeMenu === client.id ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/5 text-gray-400 hover:text-white border-white/5'}`}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                <AnimatePresence>
                                                    {activeMenu === client.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                className="absolute right-0 top-full mt-2 w-48 bg-[#11111D] border border-white/10 rounded-2xl shadow-2xl z-40 p-2 overflow-hidden"
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        handleOpenEdit(client);
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-xs font-bold"
                                                                >
                                                                    <Edit className="w-4 h-4" /> Editar Perfil
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleToggleStatus(client.id, client.status);
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-xs font-bold"
                                                                >
                                                                    {client.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                                    {client.status === 'active' ? 'Pausar SOCIO' : 'Reactivar SOCIO'}
                                                                </button>
                                                                <div className="h-px bg-white/5 my-1" />
                                                                <button
                                                                    onClick={() => {
                                                                        handleDeleteClient(client.id);
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-xs font-bold"
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> Eliminar Definitivo
                                                                </button>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Nuevo Cliente */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#11111D] border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Users className="w-32 h-32 text-indigo-500" />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter">Registrar Nuevo Socio</h2>

                                <form onSubmit={handleCreateClient} className="space-y-6 text-sm">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Nombre / Marca</label>
                                        <input
                                            id="client-name"
                                            type="text"
                                            required
                                            placeholder="Ej: Nova Clínica"
                                            value={newClient.name}
                                            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold placeholder:text-gray-700"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <PremiumDropdown 
                                            label="Plan"
                                            value={newClient.plan}
                                            onChange={(val) => {
                                                const defaults = {
                                                    'Basic': { price: 250, target: 400 },
                                                    'Premium': { price: 450, target: 800 },
                                                    'Enterprise': { price: 850, target: 1500 }
                                                };
                                                const data = defaults[val] || { price: 0, target: 0 };
                                                setNewClient({ ...newClient, plan: val, price: data.price, target: data.target });
                                            }}
                                            options={[
                                                { value: 'Basic', label: 'Basic' },
                                                { value: 'Premium', label: 'Premium' },
                                                { value: 'Enterprise', label: 'Agency Enterprise' }
                                            ]}
                                        />
                                        <PremiumDropdown 
                                            label="Community Manager"
                                            value={newClient.cm}
                                            onChange={(val) => setNewClient({ ...newClient, cm: val })}
                                            options={cmOptions}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Precio Mensual ($)</label>
                                            <input
                                                id="client-price"
                                                type="number"
                                                required
                                                value={newClient.price}
                                                onChange={(e) => setNewClient({ ...newClient, price: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-mono font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Meta Proyectada ($)</label>
                                            <input
                                                id="client-target"
                                                type="number"
                                                value={newClient.target}
                                                onChange={(e) => setNewClient({ ...newClient, target: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-mono font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            id="client-cancel"
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all text-xs"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            id="client-submit"
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Registrando...' : 'Confirmar Socio'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-[#02020A]/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative w-full max-w-xl bg-[#080814]/40 border border-white/10 rounded-[3rem] shadow-4xl backdrop-blur-3xl overflow-hidden p-10"
                        >
                            {/* Premium Vibe Background */}
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <Edit className="w-48 h-48 text-indigo-500" />
                            </div>
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                            <div className="relative z-10">
                                <header className="mb-10 text-center">
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
                                        Editar Perfil del Socio
                                    </h2>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-px w-8 bg-indigo-500/50" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Internal OS • Master Admin</span>
                                        <div className="h-px w-8 bg-indigo-500/50" />
                                    </div>
                                </header>

                                <form onSubmit={handleSaveEdit} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 flex items-center gap-2">
                                            <Target className="w-3 h-3" /> Nombre / Marca Comercial
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newClient.name}
                                            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-8 text-white outline-none focus:border-indigo-500/40 focus:bg-indigo-500/5 transition-all font-bold text-lg placeholder:text-gray-800"
                                            placeholder="Nombre de la marca..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <PremiumDropdown 
                                            label="Estrategia Asignada"
                                            value={newClient.plan}
                                            onChange={(val) => {
                                                const defaults = {
                                                    'Basic': { price: 250, target: 400 },
                                                    'Premium': { price: 450, target: 800 },
                                                    'Agency': { price: 850, target: 1500 }
                                                };
                                                const data = defaults[val] || { price: 0, target: 0 };
                                                setNewClient({ ...newClient, plan: val, price: data.price, target: data.target });
                                            }}
                                            options={[
                                                { value: 'Basic', label: 'Basic' },
                                                { value: 'Premium', label: 'Premium' },
                                                { value: 'Agency', label: 'Agency Enterprise' }
                                            ]}
                                        />
                                        <PremiumDropdown 
                                            label="CM Responsable"
                                            value={newClient.cm}
                                            onChange={(val) => setNewClient({ ...newClient, cm: val })}
                                            options={cmOptions}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> Inversión Mensual ($)
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={newClient.price}
                                                onChange={(e) => setNewClient({ ...newClient, price: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-8 text-white outline-none focus:border-emerald-500/40 focus:bg-emerald-500/5 transition-all font-mono font-black text-xl"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 flex items-center gap-2">
                                                <TrendingUp className="w-3 h-3" /> Meta de Retorno ($)
                                            </label>
                                            <input
                                                type="number"
                                                value={newClient.target}
                                                onChange={(e) => setNewClient({ ...newClient, target: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-8 text-white outline-none focus:border-indigo-500/40 transition-all font-mono font-black text-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="flex-1 py-5 text-gray-500 font-black uppercase tracking-[0.2em] hover:text-white transition-all text-[10px]"
                                        >
                                            Cancelar
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(79, 70, 229, 0.9)', boxShadow: '0 0 30px rgba(79, 70, 229, 0.4)' }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-3xl uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sincronizando...
                                                </>
                                            ) : 'Actualizar Perfil'}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Strategy Preview Modal */}
            <AnimatePresence>
                {isPreviewModalOpen && previewData && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPreviewModalOpen(false)}
                            className="absolute inset-0 bg-[#050511]/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0A0A1F] border border-white/10 rounded-[40px] shadow-3xl overflow-hidden p-12"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                <Shield className="w-64 h-64 text-indigo-500" />
                            </div>

                            <div className="relative z-10 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                            <BookOpen className="w-3 h-3" /> Preview Estratégico
                                        </div>
                                        <h2 className="text-4xl font-black text-white italic tracking-tighter">{editingClient?.name}</h2>
                                    </div>
                                    <div className="w-16 h-16 rounded-[24px] bg-indigo-500 text-white flex items-center justify-center text-2xl font-black">
                                        {editingClient?.name?.[0]}
                                    </div>
                                </div>

                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-center min-h-[400px]">
                                    <VisionEcosystem client={editingClient} />
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <Target className="w-5 h-5 text-indigo-500" />
                                        {previewData.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                        {previewData.focus}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <Clock className="w-3 h-3" /> Última Actividad
                                        </div>
                                        <div className="text-white font-bold">{previewData.lastUpdate}</div>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <Users className="w-3 h-3 text-purple-400" /> CM Responsable
                                        </div>
                                        <div className="text-white font-bold">{editingClient?.cm}</div>
                                    </div>
                                </div>

                                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[32px] p-6 space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                        <MessageSquare className="w-3 h-3" /> Notas del Operativo
                                    </div>
                                    <div className="text-gray-300 text-xs italic font-medium leading-relaxed">
                                        "{previewData.cmNotes}"
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <button
                                        onClick={() => handleNavigateStrategy(editingClient?.id)}
                                        className="flex-1 py-5 bg-indigo-500 text-white font-black rounded-[24px] uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-400 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20"
                                    >
                                        Ir al Portal Completo <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsPreviewModalOpen(false)}
                                        className="px-10 py-5 bg-white/5 text-gray-400 border border-white/5 font-black rounded-[24px] uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-[#050511]/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A1F] border border-white/10 p-10 rounded-[40px] shadow-2xl max-w-md w-full relative z-10 text-center"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">¿Eliminar Socio?</h3>
                            <p className="text-gray-500 font-medium mb-10">
                                Esta acción es permanente y eliminará todos los nodos estratégicos asociados.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-white/5"
                                >
                                    Cancelar
                                </button>
                                <button
                                    id="confirm-delete-btn"
                                    onClick={confirmDelete}
                                    disabled={isSubmitting}
                                    className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Eliminando...' : 'Eliminar Ahora'}
                                </button>
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

    const activeStyles = isActive ? `border-${color}-500/50 bg-${color}-500/5 shadow-[0_0_30px_rgba(79,70,229,0.1)] ring-1 ring-${color}-500/20` : 'border-white/5 bg-[#0E0E18]';

    return (
        <motion.div 
            whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.02)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-6 border rounded-3xl transition-all cursor-pointer group ${activeStyles}`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">{value}</div>
            
            {isActive && (
                <motion.div 
                    layoutId="active-indicator"
                    className={`h-1 w-12 rounded-full mt-4 bg-${color === 'indigo' ? 'indigo' : color}-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]`}
                />
            )}
        </motion.div>
    );
}

function SkeletonRow() {
    return (
        <tr className="border-b border-white/5 relative overflow-hidden">
            <td className="px-6 py-6" colSpan={6}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/4 bg-white/5 rounded-full animate-pulse" />
                        <div className="h-2 w-1/3 bg-white/5 rounded-full animate-pulse opacity-50" />
                    </div>
                </div>
                {/* Visual Glow Overlay during loading */}
                <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent w-full h-full skew-x-12"
                />
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
        toast.success(`Enlace para ${type === 'client' ? 'Socio' : 'Equipo'} copiado`, {
            description: "Puedes enviarlo por WhatsApp o Correo."
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white'
    };

    return (
        <button 
            onClick={handleCopy}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${colors[color]} font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 group relative overflow-hidden`}
        >
            <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {copied ? '¡COPIADO!' : label}
            {!copied && <Copy className="w-3 h-3 opacity-30 ml-2" />}
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
    );
}
