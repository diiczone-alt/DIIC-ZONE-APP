'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Star, Clock, MessageCircle, AlertTriangle, 
    ChevronLeft, Download, Settings 
} from 'lucide-react';
import { toast } from 'sonner';

export default function DesignerReputationPage() {
    const router = useRouter();

    const stats = [
        { label: 'Calidad de Arte', value: '4.9/5.0', icon: Star, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { label: 'Puntualidad Entrega', value: '98%', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Feedback Positivo', value: '100%', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Correcciones Avg', value: '0.8', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    const history = [
        { project: 'Campaña Cyber Monday - Ecom Store', date: 'Hoy', score: '+180 XP', result: 'Excelente' },
        { project: 'Rediseño de Identidad - Dental Care', date: 'Hace 3 días', score: '+220 XP', result: 'Aprobado V1' },
        { project: 'Stories Redes Sociales - Tech Solutions', date: 'Hace 1 semana', score: '+100 XP', result: 'A tiempo' },
    ];

    const handleExport = () => {
        toast.success('Generando certificado de reputación en PDF...');
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050511] p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <Trophy className="w-6 h-6 text-pink-500" /> Reputación y Rendimiento
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Monitorea tus métricas profesionales, nivel y feedback promedio.</p>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleExport}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-pink-500/5"
                    >
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                </div>
            </div>

            {/* Progress Card & Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Level / Trust Score Card */}
                <div className="lg:col-span-2 bg-[#0F0F1A] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 blur-3xl rounded-full -mr-16 -mt-16" />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/20 font-black text-white text-3xl italic">
                            A+
                        </div>
                        <div>
                            <div className="text-xs font-black text-pink-400 uppercase tracking-widest mb-0.5">CREATIVE TRUST SCORE</div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight italic">Nivel 4 - Senior Creativo</h2>
                            <p className="text-gray-400 text-xs mt-1">Desempeño sobresaliente. Estás a <span className="text-pink-400 font-bold">150 XP</span> del Nivel 5.</p>
                        </div>
                    </div>

                    <div className="space-y-2 relative z-10 pt-4">
                        <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-wider">
                            <span>Progreso Nivel 5</span>
                            <span>1,850 / 2,000 XP</span>
                        </div>
                        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-px">
                            <div className="h-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-full w-[92.5%]" />
                        </div>
                    </div>
                </div>

                {/* Metrics list */}
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:border-pink-500/20 transition-all group">
                            <div className={`p-3 rounded-xl mb-3 ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="text-xl font-black text-white mb-0.5 font-mono">{stat.value}</div>
                            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance History */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-4">Historial de Logros y Entregas</h3>
                
                <div className="space-y-3">
                    {history.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-pink-500/10 transition-all">
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-tight">{item.project}</h4>
                                <span className="text-[9px] text-gray-500 font-mono font-bold uppercase">{item.date}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-pink-400 font-black text-sm font-mono">{item.score}</div>
                                <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">{item.result}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
