'use client';

import { useState } from 'react';
import { 
    Truck, Package, ShoppingBag, CheckCircle2, 
    ArrowRight, MapPin, Phone, MessageSquare, Calendar,
    Plus, Sparkles, Clock, AlertCircle, RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const LOGISTICS_COLUMNS = [
    { id: 'pending', title: 'Por Empacar', icon: Package, color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' },
    { id: 'packed', title: 'Empacado / Listo', icon: ShoppingBag, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
    { id: 'shipped', title: 'En Ruta / Enviado', icon: Truck, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' },
    { id: 'delivered', title: 'Entregado', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' }
];

export default function LogisticsPipeline({ leads = [], activeClient, onLeadUpdate }) {
    const [updatingLeadId, setUpdatingLeadId] = useState(null);

    // Filter leads who are in won / cerrado-venta stage
    const activeCustomers = leads.filter(lead => {
        const status = (lead.status || '').toLowerCase();
        return ['won', 'cerrado', 'cerrado - venta', 'exito'].includes(status);
    });

    const handleUpdateDeliveryStatus = async (leadId, currentStatus, action) => {
        let nextStatus = 'pending';
        if (action === 'next') {
            if (currentStatus === 'pending') nextStatus = 'packed';
            else if (currentStatus === 'packed') nextStatus = 'shipped';
            else if (currentStatus === 'shipped') nextStatus = 'delivered';
            else return;
        } else if (action === 'prev') {
            if (currentStatus === 'delivered') nextStatus = 'shipped';
            else if (currentStatus === 'shipped') nextStatus = 'packed';
            else if (currentStatus === 'packed') nextStatus = 'pending';
            else return;
        } else {
            return;
        }

        setUpdatingLeadId(leadId);
        try {
            const { data, error } = await supabase
                .from('crm_leads')
                .update({ 
                    delivery_status: nextStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', leadId)
                .select()
                .single();

            if (error) throw error;

            onLeadUpdate(data);
            toast.success('Estado logístico actualizado', {
                description: `Pedido movido a: ${LOGISTICS_COLUMNS.find(c => c.id === nextStatus)?.title || nextStatus}`
            });
        } catch (err) {
            console.error('Error updating delivery status:', err);
            toast.error('Error al actualizar el estado logístico');
        } finally {
            setUpdatingLeadId(null);
        }
    };

    const getColumnLeads = (columnId) => {
        return activeCustomers.filter(lead => {
            const devStatus = lead.delivery_status || 'pending';
            return devStatus === columnId;
        });
    };

    return (
        <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-3xl space-y-6">
            {/* Header */}
            <div className="border-b border-white/5 pb-6">
                <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                    <Truck className="w-5 h-5 text-indigo-400" /> Logística y Entregas
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                    Control de distribución física, despachos y entregas de {activeClient?.name || 'la marca'}
                </p>
            </div>

            {/* Pipeline Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {LOGISTICS_COLUMNS.map(col => {
                    const colLeads = getColumnLeads(col.id);
                    return (
                        <div key={col.id} className="flex flex-col h-[600px] bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
                            {/* Column Header */}
                            <div className={`p-4 border-b border-white/5 flex items-center justify-between ${col.color}`}>
                                <div className="flex items-center gap-2">
                                    <col.icon className="w-4.5 h-4.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{col.title}</span>
                                </div>
                                <span className="px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-bold text-white tracking-wider">
                                    {colLeads.length}
                                </span>
                            </div>

                            {/* Column Body / Cards List */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                {colLeads.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-8">
                                        <col.icon className="w-8 h-8 text-gray-600 mb-2" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Sin pedidos</span>
                                    </div>
                                ) : (
                                    colLeads.map(lead => (
                                        <div 
                                            key={lead.id} 
                                            className="bg-[#050510]/60 border border-white/5 rounded-xl p-4 space-y-3 hover:border-white/10 transition-all shadow-md group relative"
                                        >
                                            {/* Card Header */}
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{lead.full_name}</h4>
                                                    <span className="text-[7px] text-gray-500 font-mono tracking-tight block mt-0.5">
                                                        ID: {lead.id.substring(0, 8)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Address / Location */}
                                            <div className="flex items-start gap-1.5 text-gray-400">
                                                <MapPin className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                                                <div className="text-[9px] leading-tight">
                                                    <span className="font-bold text-gray-300 block">{lead.city}</span>
                                                    <span className="text-[8px] text-gray-500 block">Santom Domingo, Ecuador</span>
                                                </div>
                                            </div>

                                            {/* Logistics Notes */}
                                            {lead.notes_logistics && (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 text-[9px] text-gray-400 italic">
                                                    {lead.notes_logistics}
                                                </div>
                                            )}

                                            {/* Phone / Message shortcuts */}
                                            <div className="flex items-center gap-2 border-t border-white/5 pt-2">
                                                {lead.phone && (
                                                    <>
                                                        <a 
                                                            href={`tel:${lead.phone.replace(/\D/g, '')}`} 
                                                            className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-500 hover:text-white transition-all"
                                                        >
                                                            <Phone className="w-2.5 h-2.5" /> Llamar
                                                        </a>
                                                        <a 
                                                            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-500 hover:text-emerald-400 transition-all ml-auto"
                                                        >
                                                            <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
                                                        </a>
                                                    </>
                                                )}
                                            </div>

                                            {/* Quick Actions (Move Status) */}
                                            <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 mt-1">
                                                {col.id !== 'pending' ? (
                                                    <button 
                                                        disabled={updatingLeadId === lead.id}
                                                        onClick={() => handleUpdateDeliveryStatus(lead.id, col.id, 'prev')}
                                                        className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-md text-[7px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                                    >
                                                        Regresar
                                                    </button>
                                                ) : (
                                                    <div />
                                                )}

                                                {col.id !== 'delivered' ? (
                                                    <button 
                                                        disabled={updatingLeadId === lead.id}
                                                        onClick={() => handleUpdateDeliveryStatus(lead.id, col.id, 'next')}
                                                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[7px] font-black uppercase tracking-wider transition-all flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {updatingLeadId === lead.id ? '...' : (
                                                            <>
                                                                Siguiente <ArrowRight className="w-2 h-2" />
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-emerald-500 text-[8px] font-black uppercase tracking-widest">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Entregado
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
