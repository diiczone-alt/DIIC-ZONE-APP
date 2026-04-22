'use client';

import { motion } from 'framer-motion';
import { 
    Activity, ChevronRight, DollarSign, Target, 
    Users, Zap, Shield, ArrowUpRight,
    TrendingUp, Bell, Search, Briefcase
} from 'lucide-react';

export default function ProductivityView() {
    return (
        <div className="w-full h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8 relative isolate">
            {/* Atmosphere */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            
            {/* Header / Intro */}
            <div className="mb-10">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 italic uppercase">
                    <Zap className="w-8 h-8 text-indigo-500 fill-current" /> Modo Productividad
                </h2>
                <p className="text-gray-500 mt-2 text-[10px] font-black uppercase tracking-[0.3em]">Vista Optimizada • Entrenamiento Real en tiempo real</p>
            </div>

            {/* Main Stats Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-indigo-600 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(79,70,229,0.2)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4 block opacity-80 italic">ROI de Facturación Proyectado (Hoy)</span>
                        <div className="flex items-end gap-3">
                            <h3 className="text-6xl font-black italic tracking-tighter text-white">$4,850</h3>
                            <div className="flex items-center gap-1 text-emerald-300 text-lg font-black mb-2">
                                <ArrowUpRight className="w-5 h-5" /> +12%
                            </div>
                        </div>
                        <p className="text-[10px] text-indigo-200/60 font-medium mt-4 uppercase tracking-widest group-hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                            Ver Desglose de Pauta Masiva <ChevronRight className="w-3 h-3" />
                        </p>
                    </div>
                    <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <DollarSign className="w-48 h-48 text-white" />
                    </div>
                </motion.div>

                <div className="bg-[#151520]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] flex flex-col justify-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Acciones Rápidas</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Leads', value: '24', icon: Users, color: 'text-blue-400' },
                            { label: 'Citas', value: '8', icon: Target, color: 'text-emerald-400' },
                            { label: 'Chats', value: '142', icon: Activity, color: 'text-indigo-400' },
                            { label: 'Alertas', value: '2', icon: Bell, color: 'text-red-400' },
                        ].map((stat, i) => (
                            <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all cursor-pointer group">
                                <stat.icon className={`w-4 h-4 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
                                <div className="text-xl font-black text-white italic">{stat.value}</div>
                                <div className="text-[7px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Critical Alerts & VIP List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Alertas */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Alertas de Atención Inmediata</h3>
                    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] flex items-center gap-5 group hover:bg-red-500/10 transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0 shadow-lg shadow-red-500/10">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-base font-black text-white italic uppercase tracking-tight">Fuga en Cotización</h4>
                            <p className="text-[10px] font-medium text-red-400/80 uppercase tracking-widest mt-1">3 Clientes VIP esperan respuesta técnica</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="p-6 bg-indigo-500/5 border border-white/5 rounded-[2.5rem] flex items-center gap-5 group hover:border-indigo-500/30 transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
                            <Zap className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-base font-black text-white italic uppercase tracking-tight">Campaña de Reactivación</h4>
                            <p className="text-[10px] font-medium text-indigo-400/80 uppercase tracking-widest mt-1">Impacto proyectado: 85% de efectividad</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </div>
                </div>

                {/* Leads VIP */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Prospectos VIP Calificados</h3>
                        <span className="text-[8px] font-black text-indigo-400 cursor-pointer hover:underline uppercase">Ver Todo el Pipeline</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Roberto Mendez', procedure: 'Cirugía Robótica', value: '$8,500', score: 98 },
                            { name: 'Diana Valery', procedure: 'Urología Estética', value: '$2,400', score: 85 },
                            { name: 'Marco Antonio', procedure: 'Paquete Elite 3', value: '$12,000', score: 92 },
                        ].map((lead, i) => (
                            <div key={i} className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-2xl flex items-center gap-4 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center text-white font-black italic shadow-inner">
                                    {lead.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight italic">{lead.name}</h4>
                                    <p className="text-[9px] font-black text-indigo-400/60 uppercase">{lead.procedure}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-base font-black text-emerald-400 italic tracking-tighter">{lead.value}</div>
                                    <div className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border mt-1 ${lead.score > 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border-white/5'}`}>
                                        SCORE: {lead.score}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
