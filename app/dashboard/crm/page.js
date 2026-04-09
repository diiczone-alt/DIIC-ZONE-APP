'use client';

import { 
    Users, Target, Zap, Clock, 
    MessageSquare, Phone, Mail, 
    ChevronRight, Filter, Plus,
    Search, AlertCircle, TrendingUp,
    Calendar, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardCRMPage() {
    const [activeTab, setActiveTab] = useState('pipeline');

    const pipelineStages = [
        { id: 'lead', name: 'Nuevo Lead', count: 3, color: 'blue' },
        { id: 'interested', name: 'Interesado', count: 2, color: 'purple' },
        { id: 'proposal', name: 'Propuesta', count: 1, color: 'amber' },
        { id: 'closed', name: 'Cerrado', count: 12, color: 'emerald' },
    ];

    const leads = [
        { 
            id: 'l1', 
            name: 'Carlos Mendoza', 
            company: 'Mendoza Logistics', 
            stage: 'lead', 
            time: '2h ago',
            score: 85,
            lastAction: 'Registro Web',
            needsFollowup: true
        },
        { 
            id: 'l2', 
            name: 'Dra. Ana Rivas', 
            company: 'Clínica Dental Rivas', 
            stage: 'interested', 
            time: '1d ago',
            score: 92,
            lastAction: 'Descargó Guía Estratégica',
            needsFollowup: true
        },
        { 
            id: 'l3', 
            name: 'Roberto Gómez', 
            company: 'FitCenter', 
            stage: 'proposal', 
            time: '3d ago',
            score: 70,
            lastAction: 'Propuesta Enviada',
            needsFollowup: false
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">CRM Inteligente</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] tracking-[0.2em]">Crecimiento Digital & Seguimiento IA</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar contacto..." 
                            className="h-12 pl-12 pr-6 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-all w-64"
                        />
                    </div>
                    <button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
                        <Plus className="w-4 h-4" /> Nuevo Lead
                    </button>
                </div>
            </header>

            {/* Pipeline Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {pipelineStages.map((stage) => (
                    <div key={stage.id} className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                            stage.color === 'blue' ? 'bg-blue-500/50' :
                            stage.color === 'purple' ? 'bg-purple-500/50' :
                            stage.color === 'amber' ? 'bg-amber-500/50' :
                            'bg-emerald-500/50'
                        }`} />
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stage.name}</h3>
                            <span className={`text-xl font-black text-white`}>{stage.count}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${
                                stage.color === 'blue' ? 'bg-blue-500' :
                                stage.color === 'purple' ? 'bg-purple-500' :
                                stage.color === 'amber' ? 'bg-amber-500' :
                                'bg-emerald-500'
                            }`} style={{ width: `${(stage.count / 20) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leads List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Leads Activos</h2>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {leads.map((lead) => (
                        <motion.div 
                            key={lead.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0A0A12] border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-black text-lg border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                                    {lead.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-white uppercase tracking-tight mb-1">{lead.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{lead.company}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-800" />
                                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{lead.lastAction}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-white mb-1">{lead.score}%</div>
                                    <div className="text-[7px] font-bold text-gray-700 uppercase tracking-widest">IA Score</div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                                        <Phone className="w-4 h-4" />
                                    </button>
                                    {lead.needsFollowup && (
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10 animate-pulse">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                
                                <button className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Intelligence Panel */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-xl">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Cerebro de Cierre</h2>
                        <p className="text-indigo-100 text-xs font-medium opacity-80 mb-8 leading-relaxed">
                            Detecto que 3 clientes están listos para renovar su plan este mes basándome en su engagement actual.
                        </p>

                        <div className="space-y-4 flex-1">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <h5 className="text-[9px] font-black uppercase tracking-widest mb-1">Próxima Venta Sugerida</h5>
                                <p className="text-[10px] font-bold opacity-90">Upgrade "Plan Autoridad" para Hospital Nova.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <h5 className="text-[9px] font-black uppercase tracking-widest mb-1">Alerta de Inactividad</h5>
                                <p className="text-[10px] font-bold opacity-90">Ana Rivas no responde hace 3 días. Enviar oferta recordatorio.</p>
                            </div>
                        </div>

                        <button className="w-full mt-10 h-14 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all uppercase text-[10px] tracking-widest shadow-2xl">
                            Ejecutar Seguimiento IA
                        </button>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                </div>
            </div>
        </div>
    );
}
