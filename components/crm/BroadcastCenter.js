'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Users, BarChart2, MessageSquare, 
    Calendar, CheckCircle2, Clock, AlertCircle, 
    Plus, Search, Filter, MoreVertical, Sparkles,
    Zap, Target, MousePointer2, ChevronRight
} from 'lucide-react';

const mockCampaigns = [
    { 
        id: 'c1', 
        name: 'Recordatorio Preventivo Próstata', 
        status: 'completed', 
        sent: 450, 
        delivered: 442, 
        read: 310, 
        replied: 85,
        date: '2026-04-15'
    },
    { 
        id: 'c2', 
        name: 'Promoción Cirugía Robótica Q2', 
        status: 'active', 
        sent: 1200, 
        delivered: 1150, 
        read: 890, 
        replied: 120,
        date: '2026-04-20'
    },
    { 
        id: 'c3', 
        name: 'Aviso Cierre por Feriado', 
        status: 'draft', 
        sent: 0, 
        delivered: 0, 
        read: 0, 
        replied: 0,
        date: 'Planificada'
    }
];

export default function BroadcastCenter() {
    const [campaigns, setCampaigns] = useState(mockCampaigns);
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="h-full w-full bg-[#050511] p-8 space-y-8 overflow-y-auto custom-scrollbar">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Enviados', value: '1,650', icon: Send, color: 'text-blue-400' },
                    { label: 'Tasa de Apertura', value: '74.2%', icon: MousePointer2, color: 'text-emerald-400' },
                    { label: 'Conversión (Chat)', value: '12.4%', icon: MessageSquare, color: 'text-indigo-400' },
                    { label: 'Leads Potenciales', value: '205', icon: Target, color: 'text-purple-400' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#0A0A12] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                        <div className="relative z-10 flex flex-col gap-2">
                            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-2xl font-black text-white italic">{stat.value}</span>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-16 h-16 text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Campaign Central Control */}
            <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.01]">
                    <div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                            <Zap className="w-6 h-6 text-indigo-500 fill-current" /> Broadcast Terminal
                        </h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Gestión de Difusión Masiva Inteligente</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-2">
                            <Search className="w-4 h-4 text-gray-500" />
                            <input type="text" placeholder="Buscar campaña..." className="bg-transparent border-none text-xs text-white focus:outline-none w-48" />
                        </div>
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <Plus className="w-4 h-4" /> Crear Campaña
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre de Campaña</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Enviados</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Leídos</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Conversión</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((camp) => (
                                <tr key={camp.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-black text-white uppercase tracking-tight">{camp.name}</div>
                                                <div className="text-[8px] font-bold text-gray-600 uppercase mt-1">{camp.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                            camp.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            camp.status === 'active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                camp.status === 'completed' ? 'bg-emerald-500' :
                                                camp.status === 'active' ? 'bg-blue-500' :
                                                'bg-yellow-500'
                                            }`} />
                                            {camp.status === 'completed' ? 'Finalizada' : camp.status === 'active' ? 'En Curso' : 'Borrador'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center font-mono font-bold text-white text-xs">{camp.sent}</td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-mono font-bold text-white text-xs">{camp.read}</span>
                                            <span className="text-[8px] text-gray-600">({Math.round(camp.read/camp.sent*100 || 0)}%)</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="text-xs font-black text-indigo-400">{Math.round(camp.replied/camp.sent*100 || 0)}%</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Magic Bar */}
                <div className="p-6 bg-gradient-to-r from-indigo-600/10 to-transparent flex justify-between items-center border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            TIP: Las campañas enviadas entre las <span className="text-indigo-400">09:00 AM y 11:00 AM</span> tienen un <span className="text-emerald-400">22% más de respuesta</span>.
                        </p>
                    </div>
                    <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-300 flex items-center gap-2">
                        Ver Reporte Avanzado <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Creation Modal (Mock) */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#050510]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0A0A12] border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 relative shadow-[0_0_100px_rgba(79,70,229,0.2)]"
                        >
                            <button onClick={() => setIsCreating(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Configurar Difusión</h3>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Nueva campaña de impacto masivo</p>
                                </div>

                                <div className="space-y-6 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Nombre de Campaña</label>
                                        <input type="text" placeholder="Ej: Invitación Masterclass Urología" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Público Objetivo</label>
                                            <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
                                                <option>Todos los leads (1,650)</option>
                                                <option>Etapa: Interesados (240)</option>
                                                <option>Etapa: Nuevos (45)</option>
                                                <option>Tag: Paciente Recurrente (312)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Programación</label>
                                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-gray-400 flex items-center gap-3">
                                                <Clock className="w-4 h-4" /> Enviar ahora
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Mensaje (Template)</label>
                                        <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed" placeholder="Escribe el mensaje aquí... usa {nombre} para personalizar." />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setIsCreating(false)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all">Cancelar</button>
                                    <button className="flex-2 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                                        <Zap className="w-4 h-4 fill-current" /> Lanzar Campaña Masiva
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
