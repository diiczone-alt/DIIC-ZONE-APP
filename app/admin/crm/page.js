'use client';

import { useState, useEffect } from 'react';
import { 
    Search, Filter, ExternalLink, 
    TrendingUp, Briefcase, UserPlus, 
    Clock, CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AdminCRMPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const pipelineStates = [
        { id: 'lead', label: 'Nuevo lead', color: 'blue' },
        { id: 'contacted', label: 'Contactado', color: 'indigo' },
        { id: 'interested', label: 'Interesado', color: 'purple' },
        { id: 'proposal', label: 'Propuesta enviada', color: 'amber' },
        { id: 'closure', label: 'Cierre pendiente', color: 'orange' },
        { id: 'confirmed', label: 'Confirmado', color: 'emerald' },
        { id: 'production', label: 'En producción', color: 'cyan' },
    ];

    const CLIENTES_INICIALES = [
        { 
            entity_name: 'Hospital Nova Clínica Santa Anita', 
            business_type: 'Salud',
            contact_email: 'gerencia@novaclinica.com', 
            status: 'production', 
        },
        { 
            entity_name: 'Nova Urology', 
            business_type: 'Especialistas',
            contact_email: 'dr.patino@urology.com', 
            status: 'confirmed', 
        },
        { 
            entity_name: 'Global Media Group', 
            business_type: 'Agencia',
            contact_email: 'admin@globalmedia.com', 
            status: 'interested', 
        },
    ];

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            let { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                // Seed if empty
                await supabase.from('clients').insert(CLIENTES_INICIALES);
                const { data: seededData } = await supabase.from('clients').select('*');
                data = seededData;
            }

            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Error al cargar clientes desde Supabase');
        } finally {
            setLoading(false);
        }
    };

    const updateClientStatus = async (clientId, newStatus) => {
        try {
            const { error } = await supabase
                .from('clients')
                .update({ status: newStatus })
                .eq('id', clientId);

            if (error) throw error;
            
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, status: newStatus } : c));
            toast.success('Estado actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar el estado');
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">CRM Clientes</h1>
                    <p className="text-gray-400">Panel Maestro de Relaciones y Pipeline Comercial.</p>
                </div>
                <button 
                    onClick={() => toast.success('Módulo de Alta de Clientes activado')}
                    className="h-12 px-6 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-amber-500/10 active:scale-95 text-xs uppercase tracking-widest"
                >
                    <UserPlus className="w-5 h-5" />
                    Añadir Cliente Express
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#0A0A12] border border-white/5 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <TrendingUp className="w-8 h-8 text-emerald-500 opacity-50" />
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-lg">+12% Mes</span>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Valor Pipeline</p>
                    <h3 className="text-3xl font-black text-white">$142,800</h3>
                </div>
                <div className="bg-[#0A0A12] border border-white/5 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <Briefcase className="w-8 h-8 text-amber-500 opacity-50" />
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Cuentas Activas</p>
                    <h3 className="text-3xl font-black text-white">24</h3>
                </div>
                <div className="bg-[#0A0A12] border border-white/5 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <Clock className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Leads en Pausa</p>
                    <h3 className="text-3xl font-black text-white">8</h3>
                </div>
            </div>

            {/* Client List */}
            <div className="bg-[#0A0A12] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl shadow-black relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-[#050511]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Sincronizando Leads...</p>
                    </div>
                )}

                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center bg-white/[0.01]">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                        <input 
                            type="text" 
                            placeholder="Buscar en el ecosistema de clientes..."
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 group">
                            <Filter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Filtrar</span>
                        </button>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">ID / Entidad</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado Pipeline</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contacto</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha Alta</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {clients.map((client) => {
                            const state = pipelineStates.find(s => s.id === client.status) || pipelineStates[0];
                            return (
                                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-black text-sm group-hover:text-amber-400 transition-colors uppercase tracking-tight">{client.entity_name}</span>
                                                <ExternalLink className="w-3 h-3 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase truncate max-w-[200px]">{client.id} — {client.business_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <select 
                                                value={client.status}
                                                onChange={(e) => updateClientStatus(client.id, e.target.value)}
                                                className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer appearance-none"
                                                style={{ color: `var(--${state.color}-500)` }}
                                            >
                                                {pipelineStates.map(s => (
                                                    <option key={s.id} value={s.id} className="bg-[#0A0A12] text-white">{s.label}</option>
                                                ))}
                                            </select>
                                            <div className={`w-2 h-2 rounded-full ${
                                                state.color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' :
                                                state.color === 'indigo' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' :
                                                state.color === 'purple' ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' :
                                                state.color === 'amber' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                                                state.color === 'orange' ? 'bg-orange-500 shadow-[0_0_10_rgba(249,115,22,0.3)]' :
                                                state.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                                'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                            }`} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-[10px] font-medium">{client.contact_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-[10px] font-medium">
                                                {new Date(client.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-[10px] font-black text-white uppercase tracking-widest bg-white/5 px-3 py-2 rounded-xl border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                            Gestionar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
