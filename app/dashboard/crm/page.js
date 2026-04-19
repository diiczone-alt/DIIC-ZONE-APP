'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, Search, Filter, MoreHorizontal, 
    Instagram, Facebook, Zap, TrendingUp,
    Target, UserPlus, Phone, Mail
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function CRMPage() {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLeads() {
            setLoading(true);
            try {
                const { MOCK_DATA } = require('@/lib/mockData');
                // En un entorno real esto vendría de Supabase
                setLeads(MOCK_DATA.crm_leads.filter(l => l.user_id === 'jessica_user_id'));
            } catch (err) {
                console.error('Error loading leads:', err);
            } finally {
                setLoading(false);
            }
        }
        loadLeads();
    }, [user]);

    return (
        <main className="min-h-screen bg-[#050510] text-white p-8 md:p-16 space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">CRM Inteligente</h1>
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Gestionando {leads.length} Pacientes Potenciales</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar paciente..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none w-64 transition-all"
                        />
                    </div>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                        <Filter className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        <UserPlus className="w-4 h-4" /> Nuevo Paciente
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Leads Nuevos', val: '24', icon: Zap, color: '#f59e0b' },
                    { label: 'En Calificación', val: '12', icon: Target, color: '#10b981' },
                    { label: 'Citas Próximas', val: '8', icon: TrendingUp, color: '#6366f1' },
                    { label: 'Facturación Est.', val: '$12,400', icon: TrendingUp, color: '#ec4899' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${s.color}10`, color: s.color, border: `1px solid ${s.color}20` }}>
                            <s.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
                            <p className="text-xl font-black text-white italic">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Leads Table */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Paciente</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Fuente</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tratamiento</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leads.map((lead, i) => (
                            <motion.tr 
                                key={i} 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs">
                                            {lead.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{lead.full_name}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">{lead.email || 'Sin email'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-gray-400 italic">
                                   <div className="flex items-center gap-2">
                                       {lead.source === 'INSTAGRAM' ? <Instagram className="w-3 h-3 text-pink-500" /> : <Zap className="w-3 h-3 text-emerald-500" />}
                                       <span className="text-[10px] font-black uppercase tracking-widest">{lead.source}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{lead.campaign_id ? 'Anuncio' : 'Orgánico'}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{lead.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-4">
                                        <button className="p-2 text-gray-600 hover:text-white transition-colors"><Phone className="w-4 h-4" /></button>
                                        <button className="p-2 text-gray-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                                        <button className="p-2 text-gray-600 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
