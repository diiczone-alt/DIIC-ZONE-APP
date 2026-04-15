'use client';

import {
    Smartphone, Eye, MessageCircle, TrendingUp, Plus,
    Calendar, Image as ImageIcon, Video, Type, MoreVertical,
    CheckCircle2, X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StatusView() {
    const [showCreator, setShowCreator] = useState(false);

    const statuses = [
        {
            id: 1, thumb: 'bg-emerald-500', type: 'image',
            objective: 'Venta', views: 245, replies: 12, leads: 5,
            status: 'active', time: 'Hace 2h', title: 'Promo Flash 24h'
        },
        {
            id: 2, thumb: 'bg-purple-500', type: 'video',
            objective: 'Branding', views: 180, replies: 3, leads: 0,
            status: 'active', time: 'Hace 5h', title: 'Behind the Scenes'
        },
        {
            id: 3, thumb: 'bg-blue-500', type: 'text',
            objective: 'Educación', views: 560, replies: 25, leads: 8,
            status: 'expired', time: 'Ayer', title: 'Tip del Día'
        },
    ];

    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8 relative">

            {/* Header & Actions */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Estado Center</h2>
                    <p className="text-gray-400 text-sm">Convierte visualizaciones en ventas pasivas.</p>
                </div>
                <button
                    onClick={() => setShowCreator(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#050511] rounded-xl font-bold shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all transform hover:scale-105"
                >
                    <Plus className="w-5 h-5" /> Nuevo Estado
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <KPICard icon={Smartphone} label="Publicados Hoy" value="3" color="text-gray-200" bg="bg-white/5" />
                <KPICard icon={Eye} label="Vistas Totales" value="1.2k" color="text-blue-400" bg="bg-blue-500/10" />
                <KPICard icon={MessageCircle} label="Respuestas" value="48" color="text-emerald-400" bg="bg-emerald-500/10" />
                <KPICard icon={TrendingUp} label="Leads Activados" value="15" color="text-yellow-400" bg="bg-yellow-500/10" />
                <KPICard icon={TrendingUp} label="ROI Estimado" value="$450" color="text-purple-400" bg="bg-purple-500/10" />
            </div>

            {/* Timeline & List */}
            <div className="space-y-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" /> Línea de Tiempo
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {statuses.map(status => (
                        <div key={status.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex items-center gap-6 hover:bg-[#151520] transition-colors group">

                            {/* Thumbnail */}
                            <div className={`w-16 h-28 rounded-lg ${status.thumb} relative overflow-hidden flex-shrink-0 border border-white/10 shadow-lg`}>
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    {status.type === 'image' && <ImageIcon className="w-6 h-6 text-white/80" />}
                                    {status.type === 'video' && <Video className="w-6 h-6 text-white/80" />}
                                    {status.type === 'text' && <Type className="w-6 h-6 text-white/80" />}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-white font-bold text-base">{status.title}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${status.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gray-700/50 text-gray-400 border-gray-600'
                                        }`}>
                                        {status.status === 'active' ? 'Activo' : 'Expirado'}
                                    </span>
                                </div>
                                <div className="flex gap-4 text-xs text-gray-400">
                                    <span>{status.time}</span>
                                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Obj: {status.objective}</span>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="flex gap-8 mr-8">
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-white">{status.views}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Vistas</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-emerald-400">{status.replies}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Chats</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-yellow-400">{status.leads}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Leads</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <button className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Creation Modal */}
            <AnimatePresence>
                {showCreator && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0E0E18] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Nuevo Estado Estratégico</h3>
                                <button onClick={() => setShowCreator(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Step 1: Type */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">1. Tipo de Contenido</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Imagen / Video', 'Solo Texto', 'Secuencia'].map(t => (
                                            <button key={t} className="p-3 rounded-xl bg-[#151520] border border-white/5 text-gray-300 text-sm hover:border-indigo-500 hover:text-indigo-400 transition-colors">
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 2: Objective */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">2. Objetivo (Define la IA)</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500 text-indigo-400 text-sm font-bold flex flex-col items-center gap-2">
                                            <span>💰 Venta Directa</span>
                                            <span className="text-[10px] font-normal opacity-80">IA cierra citas</span>
                                        </button>
                                        <button className="p-3 rounded-xl bg-[#151520] border border-white/5 text-gray-300 text-sm hover:border-white/20 transition-colors flex flex-col items-center gap-2">
                                            <span>🎓 Educación</span>
                                            <span className="text-[10px] font-normal opacity-50">IA nutre leads</span>
                                        </button>
                                        <button className="p-3 rounded-xl bg-[#151520] border border-white/5 text-gray-300 text-sm hover:border-white/20 transition-colors flex flex-col items-center gap-2">
                                            <span>📢 Branding</span>
                                            <span className="text-[10px] font-normal opacity-50">IA agradece</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Step 3: Content Upload */}
                                <div className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-white/20 hover:text-gray-400 transition-colors cursor-pointer bg-[#151520]">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <p className="text-sm">Arrastra tu archivo o <span className="text-indigo-400 font-bold underline">Usa Zona Creativa</span></p>
                                </div>

                                <button className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#050511] font-bold rounded-xl text-lg shadow-lg shadow-green-500/20 transition-all">
                                    Programar Estado
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function KPICard({ label, value, icon: Icon, color, bg }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center group hover:bg-[#151520] transition-colors">
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${bg} ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white mb-1">{value}</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
        </div>
    )
}
