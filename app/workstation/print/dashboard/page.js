'use client';

import { useState, useEffect } from 'react';
import {
    Printer, Package, Clock, CheckCircle,
    MoreHorizontal, Download, AlertTriangle, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function PrintProviderDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('print_orders')
                .select('*, clients(name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error("Error loading print orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        const toastId = toast.loading(`Actualizando estado a ${newStatus}...`);
        try {
            const { error } = await supabase
                .from('print_orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            toast.success("Estado actualizado con éxito.", { id: toastId });
            fetchOrders();
        } catch (err) {
            console.error("Error updating print order status:", err);
            toast.error("Error al actualizar estado", { id: toastId });
        }
    };

    const newOrders = orders.filter(o => o.status === 'new');
    const productionOrders = orders.filter(o => o.status === 'production');
    const readyOrders = orders.filter(o => o.status === 'ready');

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex items-center justify-center font-black text-yellow-500 uppercase tracking-widest animate-pulse">
                Cargando Production Hub...
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md z-10 shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-white">Production Hub</h1>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Operativo
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-white">Imprenta Rápida Centro</p>
                        <p className="text-[10px] text-gray-400">ID: PRT-2024-88</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-yellow-600/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30 font-bold text-xs">
                        IR
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Por Aceptar" value={newOrders.length} icon={Clock} color="text-yellow-400" />
                    <StatCard title="En Proceso" value={productionOrders.length} icon={Printer} color="text-blue-400" />
                    <StatCard title="Listos / Entregar" value={readyOrders.length} icon={Package} color="text-emerald-400" />
                    <StatCard title="Incidencias" value="0" icon={AlertTriangle} color="text-red-400" />
                </div>

                {/* Orders Board */}
                <div className="space-y-8">

                    {/* New Orders Section */}
                    <Section title="Nuevas Órdenes (Por Aceptar)" count={newOrders.length}>
                        {newOrders.length === 0 ? (
                            <p className="text-xs text-gray-500 col-span-full">No hay nuevas órdenes pendientes.</p>
                        ) : (
                            newOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onUpdate={handleUpdateStatus}
                                />
                            ))
                        )}
                    </Section>

                    {/* Production Section */}
                    <Section title="En Producción" count={productionOrders.length}>
                        {productionOrders.length === 0 ? (
                            <p className="text-xs text-gray-500 col-span-full">No hay órdenes en producción activa.</p>
                        ) : (
                            productionOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onUpdate={handleUpdateStatus}
                                />
                            ))
                        )}
                    </Section>

                    {/* Ready Section */}
                    <Section title="Listas para Entrega" count={readyOrders.length}>
                        {readyOrders.length === 0 ? (
                            <p className="text-xs text-gray-500 col-span-full">No hay órdenes listas para entrega.</p>
                        ) : (
                            readyOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onUpdate={handleUpdateStatus}
                                />
                            ))
                        )}
                    </Section>

                </div>

            </main>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-white">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

function Section({ title, count, children }) {
    return (
        <div>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                {title}
                <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-xs">{count}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
}

function OrderCard({ order, onUpdate }) {
    const isNew = order.status === 'new';
    const isProduction = order.status === 'production';
    const isReady = order.status === 'ready';

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-gray-500">#ORD-{order.id}</span>
                    <button className="text-gray-500 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                <h3 className="text-white font-bold mb-1 group-hover:text-yellow-400 transition-colors">
                    {order.clients?.name || 'Cliente Particular'}
                </h3>
                <p className="text-sm text-gray-400 capitalize">{order.product_id?.replace('-', ' ')}</p>
                <p className="text-xs text-gray-500 mt-1">Cantidad: {order.quantity} | Acabado: {order.material}</p>
                <p className="text-xs font-bold text-yellow-500 mt-1">Valor: ${parseFloat(order.price).toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <span className={`text-[10px] font-bold uppercase ${isNew ? 'text-blue-400' : isProduction ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {order.status}
                </span>

                {isNew && (
                    <button 
                        onClick={() => onUpdate(order.id, 'production')}
                        className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                        Aceptar
                    </button>
                )}
                {isProduction && (
                    <button 
                        onClick={() => onUpdate(order.id, 'ready')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                        Completar
                    </button>
                )}
                {isReady && (
                    <button 
                        onClick={() => onUpdate(order.id, 'delivered')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-black text-xs font-bold rounded-lg transition-colors"
                    >
                        Entregar
                    </button>
                )}
            </div>
        </div>
    );
}
