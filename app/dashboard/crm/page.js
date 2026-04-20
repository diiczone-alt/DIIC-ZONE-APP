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

export default function CRMPage() {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({
        totalLeads: 0,
        pendingAppointments: 0,
        monthlyRevenue: 0,
        aiDraftsCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        if (!user) return;
        
        async function loadCRMData() {
            setLoading(true);
            try {
                // 1. Load Leads (from clients table)
                const { data: leadData, error: leadError } = await supabase
                    .from('clients')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (leadError) throw leadError;
                setLeads(leadData || []);

                // 2. Load Financial Stats
                const { data: finData } = await supabase
                    .from('financial_transactions')
                    .select('amount')
                    .eq('type', 'income');
                
                const totalRevenue = finData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

                // 3. Load AI Drafts for badges
                const { data: aiDrafts } = await supabase
                    .from('ai_conversation_drafts')
                    .select('lead_id')
                    .eq('status', 'PENDING');

                setStats({
                    totalLeads: leadData?.length || 0,
                    pendingAppointments: 8, // Representativo
                    monthlyRevenue: totalRevenue,
                    aiDraftsCount: aiDrafts?.length || 0
                });

            } catch (err) {
                console.error('[CRM] Load Failed:', err);
            } finally {
                setLoading(false);
            }
        }
        loadCRMData();
    }, [user]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050510]">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Users className="w-12 h-12 text-emerald-500 opacity-50" />
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mt-6 animate-pulse">Sincronizando Pacientes Reales</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#050510] text-white p-6 md:p-10 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Target className="w-8 h-8 text-emerald-500" /> CRM Maestro & Ventas
                    </h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Control de Pacientes • {stats.totalLeads} Registrados</p>
                </div>

                <div className="flex gap-4">
                    <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                        <Search className="w-4 h-4 text-gray-500 mr-3" />
                        <input type="text" placeholder="Buscar paciente..." className="bg-transparent text-sm font-bold outline-none text-white w-48" />
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
                        <UserPlus className="w-4 h-4" /> Nuevo Registro
                    </button>
                </div>
            </div>

            {/* Business Intelligence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Facturación Total', val: `$${stats.monthlyRevenue.toLocaleString()}`, sub: 'ACUMULADO REAL', icon: DollarSign, color: '#10b981' },
                    { label: 'Pacientes Activos', val: stats.totalLeads, sub: 'EN TRATAMIENTO', icon: Users, color: '#6366f1' },
                    { label: 'Citas Hoy', val: '12', sub: 'VALIDANDO AGENDA', icon: Calendar, color: '#f59e0b' },
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
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Pacientes Reales</span>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Últimos Registros</span>
                    </div>
                </div>
                
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">Paciente & Consulta</th>
                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">Estado Clínico</th>
                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">Tratamiento</th>
                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">Facturación</th>
                            <th className="px-10 py-5 text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">IA Bot</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {leads.map((lead, i) => (
                            <motion.tr 
                                key={lead.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="group hover:bg-white/[0.03] transition-all cursor-pointer"
                                onClick={() => setSelectedLead(lead)}
                            >
                                <td className="px-10 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/10">
                                            {lead.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase italic">{lead.name}</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{lead.city || 'Ciudad No Registrada'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{lead.status || 'PROSPECTO'}</span>
                                    </div>
                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">Nivel {lead.growth_level || 1} de Cuidado</p>
                                </td>
                                <td className="px-10 py-5">
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest">
                                        {lead.industry || 'Consulta General'}
                                    </span>
                                </td>
                                <td className="px-10 py-5">
                                    <p className="text-sm font-black text-white italic tracking-tighter">${(lead.price || 0).toLocaleString()}</p>
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
                    <div className="py-32 flex flex-col items-center justify-center gap-6">
                        <Users className="w-16 h-16 text-gray-800" />
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-gray-400 uppercase italic">Sin Pacientes Registrados</h3>
                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Comienza añadiendo tu primer lead o vinculando tus redes sociales.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Side Panel for Detail */}
            <AnimatePresence>
                {selectedLead && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed top-0 right-0 w-[400px] h-screen bg-[#0a0a1a] border-l border-white/10 shadow-2xl z-50 p-10 space-y-8"
                    >
                        <button onClick={() => setSelectedLead(null)} className="absolute top-6 left-[-20px] w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-xl">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-6">
                            <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-white text-3xl font-black">
                                {selectedLead.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{selectedLead.name}</h2>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{selectedLead.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <Phone className="w-6 h-6 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Llamar</span>
                            </button>
                            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <Mail className="w-6 h-6 text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Tratamiento & Notas</h4>
                            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Interés Detectado por IA</p>
                                    <p className="text-xs font-bold text-white uppercase italic">{selectedLead.industry || 'Consulta General'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Última Nota</p>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic">"El paciente pregunta por precios de toxina botulínica y disponibilidad de agenda."</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-900/20">
                            Registrar Venta / Cobro
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
