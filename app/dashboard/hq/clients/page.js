'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Plus, MoreVertical, ExternalLink, Shield, TrendingUp, AlertCircle, CheckCircle2, Trash2, Edit, Pause, Play, BookOpen, Target, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { agencyService } from '@/services/agencyService';
import VisionEcosystem from '@/components/VisionEcosystem';

export default function HQClientsPage() {
    const [activeMenu, setActiveMenu] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const router = useRouter();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
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
        cm: ''
    });

    const fetchClients = async () => {
        setLoading(true);
        try {
            const data = await agencyService.getClients();
            setClients(data || []);
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleCreateClient = async (e) => {
        e.preventDefault();
        console.log("Submitting Client Data:", newClient);
        setIsSubmitting(true);
        try {
            await agencyService.createClient(newClient);
            await fetchClients();
            setIsModalOpen(false);
            setNewClient({ name: '', plan: 'Basic', price: 0, target: 0, cm: '' });
            toast.success("Socio registrado correctamente");
        } catch (error) {
            console.error("Error creating client:", error);
            toast.error("Error al registrar socio");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateClient = async (id, data) => {
        try {
            await agencyService.updateClient(id, data);
            await fetchClients();
        } catch (error) {
            console.error("Error updating client:", error);
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

    const handleToggleCM = async (id, currentCM) => {
        const cms = ['Leslie', 'Andrea', 'Jimmy'];
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
            cm: client.cm || ''
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await agencyService.updateClient(editingClient.id, newClient);
            await fetchClients();
            setIsEditModalOpen(false);
            setEditingClient(null);
        } catch (error) {
            console.error("Error saving client:", error);
        } finally {
            setIsSubmitting(false);
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
        try {
            await agencyService.deleteClient(clientToDelete);
            await fetchClients();
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            console.log("Client deleted successfully");
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };

    const filteredClients = clients.filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        onClick={() => {
                            agencyService.forceSyncMocks();
                            window.location.reload();
                        }}
                        className="px-6 py-3 bg-white/5 text-gray-400 font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10"
                    >
                        🔄 Sincronizar Datos Reales
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Clientes Activos" value={clients.filter(c => c.status === 'active').length} icon={Users} color="indigo" />
                <StatCard title="MRR Proyectado" value={`$${clients.reduce((acc, c) => acc + (c.price || 0), 0)}`} icon={TrendingUp} color="green" />
                <StatCard title="En Riesgo" value="1" icon={AlertCircle} color="red" />
                <StatCard title="Pendientes Pago" value="2" icon={CheckCircle2} color="blue" />
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
                                                <div className="text-xs text-gray-500">Marca: {client?.name?.split(' ')[0] || '-'}</div>
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Plan</label>
                                            <select
                                                id="client-plan"
                                                value={newClient.plan}
                                                onChange={(e) => setNewClient({ ...newClient, plan: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                                            >
                                                <option value="Basic">Basic</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Enterprise">Agency Enterprise</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Community Manager</label>
                                            <input
                                                id="client-cm"
                                                type="text"
                                                placeholder="Ej: Leslie"
                                                value={newClient.cm}
                                                onChange={(e) => setNewClient({ ...newClient, cm: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold placeholder:text-gray-700"
                                            />
                                        </div>
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

            {/* Modal de Editar Cliente */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#11111D] border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Edit className="w-32 h-32 text-indigo-500" />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter">Editar Perfil del Socio</h2>

                                <form onSubmit={handleSaveEdit} className="space-y-6 text-sm">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Nombre / Marca</label>
                                        <input
                                            type="text"
                                            required
                                            value={newClient.name}
                                            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold placeholder:text-gray-700"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Plan</label>
                                            <select
                                                value={newClient.plan}
                                                onChange={(e) => setNewClient({ ...newClient, plan: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                                            >
                                                <option value="Basic">Basic</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Agency">Agency Enterprise</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Community Manager</label>
                                            <select
                                                value={newClient.cm}
                                                onChange={(e) => setNewClient({ ...newClient, cm: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                                            >
                                                <option value="Leslie">Leslie</option>
                                                <option value="Andrea">Andrea</option>
                                                <option value="Jimmy">Jimmy</option>
                                                <option value="Sin asignar">Sin asignar</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Precio Mensual ($)</label>
                                            <input
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
                                                type="number"
                                                value={newClient.target}
                                                onChange={(e) => setNewClient({ ...newClient, target: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-mono font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all text-xs"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Guardando...' : 'Actualizar Perfil'}
                                        </button>
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
                                    className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-red-500/20"
                                >
                                    Elininar Ahora
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const colors = {
        indigo: 'text-indigo-500 bg-indigo-500/10',
        green: 'text-green-500 bg-green-500/10',
        red: 'text-red-500 bg-red-500/10',
        blue: 'text-blue-500 bg-blue-500/10',
    };

    return (
        <div className="p-6 bg-[#0E0E18] border border-white/5 rounded-3xl hover:border-white/10 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</div>
            <div className="text-2xl font-black text-white">{value}</div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-white/5">
            <td className="px-6 py-6 h-20 bg-white/[0.01]" colSpan={6}></td>
        </tr>
    );
}
