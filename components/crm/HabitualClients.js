'use client';

import { useState } from 'react';
import { 
    Users, DollarSign, Phone, MessageSquare, 
    Calendar, CheckCircle2, ArrowUpRight, Search, 
    Plus, Sparkles, ShoppingBag, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function HabitualClients({ leads = [], activeClient, onLeadUpdate }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [newSaleAmount, setNewSaleAmount] = useState('');
    const [newSaleProduct, setNewSaleProduct] = useState('');
    const [registering, setRegistering] = useState(false);

    // Filter leads who are in won / cerrado-venta stage
    const habitualClients = leads.filter(lead => {
        const status = (lead.status || '').toLowerCase();
        const matchesStatus = ['won', 'cerrado', 'cerrado - venta', 'exito'].includes(status);
        const matchesSearch = lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             lead.city?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleLogSale = async (e) => {
        e.preventDefault();
        if (!selectedClient || !newSaleAmount || isNaN(newSaleAmount)) {
            toast.error('Por favor, ingresa un monto válido');
            return;
        }

        setRegistering(true);
        try {
            const currentAmount = Number(selectedClient.price_estimated || 0);
            const addedAmount = Number(newSaleAmount);
            const updatedAmount = currentAmount + addedAmount;

            const { data, error } = await supabase
                .from('crm_leads')
                .update({ 
                    price_estimated: updatedAmount,
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedClient.id)
                .select()
                .single();

            if (error) throw error;

            onLeadUpdate(data);
            toast.success('Venta recurrente registrada', {
                description: `Se sumaron $${addedAmount} a la facturación de ${selectedClient.full_name}.`
            });
            
            setShowSaleModal(false);
            setNewSaleAmount('');
            setNewSaleProduct('');
            setSelectedClient(null);
        } catch (err) {
            console.error('Error logging sale:', err);
            toast.error('Error al registrar la venta');
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-3xl space-y-6">
            {/* Header / Stats Panel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-400" /> Clientes Habituales
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                        Consumidores recurrentes y cuentas cerradas activas de {activeClient?.name || 'la marca'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente habitual..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#050510] border border-white/5 focus:border-indigo-500/40 rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-none text-white w-48 transition-all placeholder:text-gray-600 focus:w-60" 
                        />
                    </div>
                </div>
            </div>

            {/* Main Stats Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#050510]/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Clientes Recurrentes</span>
                        <span className="text-xl font-black text-white block mt-1">{habitualClients.length}</span>
                    </div>
                    <div className="p-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-indigo-400">
                        <Users className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-[#050510]/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Facturación Acumulada</span>
                        <span className="text-xl font-black text-emerald-400 block mt-1">
                            ${habitualClients.reduce((sum, c) => sum + Number(c.price_estimated || 0), 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-400">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-[#050510]/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block">Ticket Promedio</span>
                        <span className="text-xl font-black text-amber-400 block mt-1">
                            ${habitualClients.length > 0 
                                ? Math.round(habitualClients.reduce((sum, c) => sum + Number(c.price_estimated || 0), 0) / habitualClients.length).toLocaleString()
                                : 0}
                        </span>
                    </div>
                    <div className="p-2 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Clients List/Grid */}
            {habitualClients.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-white/5 rounded-3xl bg-black/10">
                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-bounce" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No hay clientes habituales registrados aún</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
                        Mueve leads a la columna "Cerrado - Venta" para activarlos aquí.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                <th className="pb-4 pl-4">Cliente / Cuenta</th>
                                <th className="pb-4">Contacto & Ubicación</th>
                                <th className="pb-4 text-center">Última Compra</th>
                                <th className="pb-4 text-right">Facturación</th>
                                <th className="pb-4 pr-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {habitualClients.map(client => (
                                <tr key={client.id} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs">
                                                {client.full_name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-white uppercase tracking-wider">{client.full_name}</h4>
                                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mt-0.5">
                                                    ID: {client.id.substring(0, 8)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="space-y-1">
                                            <span className="text-xs font-medium text-gray-300 block">{client.phone || 'Sin Teléfono'}</span>
                                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">{client.city || 'Ubicación pendiente'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-wider">
                                            <Calendar className="w-3 h-3 text-indigo-400" />
                                            {new Date(client.updated_at || client.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-xs font-black text-emerald-400 font-mono">
                                            ${Number(client.price_estimated || 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setShowSaleModal(true);
                                                }}
                                                title="Registrar Nueva Venta"
                                                className="p-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg border border-indigo-500/20 transition-all active:scale-95"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                            
                                            {client.phone && (
                                                <a 
                                                    href={`https://wa.me/${client.phone.replace(/\D/g, '')}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    title="Mensaje de WhatsApp"
                                                    className="p-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/20 transition-all active:scale-95"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dynamic Modal to Log Recurring Sale */}
            <AnimatePresence>
                {showSaleModal && selectedClient && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0A0A15]/95 border border-white/10 p-6 rounded-[2rem] w-full max-w-md shadow-2xl relative"
                        >
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles className="w-4.5 h-4.5 text-indigo-400" /> Registrar Pedido Recurrente
                            </h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">
                                Agrega una nueva transacción para el cliente habitual **{selectedClient.full_name}**.
                            </p>

                            <form onSubmit={handleLogSale} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Monto de la Venta ($)</label>
                                    <input 
                                        type="number"
                                        required
                                        placeholder="Ej. 150"
                                        value={newSaleAmount}
                                        onChange={(e) => setNewSaleAmount(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:border-indigo-500/50 outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Detalle de Productos / Pedido</label>
                                    <input 
                                        type="text"
                                        placeholder="Ej. 100 panes integrales, 20 tortas"
                                        value={newSaleProduct}
                                        onChange={(e) => setNewSaleProduct(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:border-indigo-500/50 outline-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 justify-end">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setShowSaleModal(false);
                                            setSelectedClient(null);
                                        }}
                                        className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={registering}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        {registering ? 'Registrando...' : 'Registrar Venta'} <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
