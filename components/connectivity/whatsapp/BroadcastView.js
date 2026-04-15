'use client';

import {
    Send, Users, AlertTriangle, FileText, Plus,
    Calendar, CheckCircle, Search, BarChart2, X,
    ShieldCheck, Clock
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BroadcastView() {
    const [showWizard, setShowWizard] = useState(false);

    const campaigns = [
        {
            id: 1, name: 'Promo Fin de Mes', segment: 'Leads Tibios',
            sent: 1200, delivered: '98%', replies: '45 (3.7%)',
            status: 'completed', time: 'Hace 2d', risk: 'low'
        },
        {
            id: 2, name: 'Recordatorio Webinar', segment: 'Inscritos',
            sent: 350, delivered: '99%', replies: '12 (3.4%)',
            status: 'active', time: 'En progreso', risk: 'low'
        },
        {
            id: 3, name: 'Reactivación 2024', segment: 'Ex-Clientes',
            sent: 0, delivered: '-', replies: '-',
            status: 'scheduled', time: 'Mañana 10:00', risk: 'medium'
        },
    ];

    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8 relative">

            {/* Header & Actions */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Difusión Inteligente</h2>
                    <p className="text-gray-400 text-sm">Envíos masivos seguros con segmentación IA.</p>
                </div>
                <button
                    onClick={() => setShowWizard(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-105"
                >
                    <Plus className="w-5 h-5" /> Nueva Campaña
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <KPICard icon={Send} label="Envíos Mes" value="5.4k" color="text-indigo-400" bg="bg-indigo-500/10" />
                <KPICard icon={CheckCircle} label="Tasa Entrega" value="98.2%" color="text-emerald-400" bg="bg-emerald-500/10" />
                <KPICard icon={Users} label="Leads Reactivados" value="312" color="text-blue-400" bg="bg-blue-500/10" />
                <KPICard icon={AlertTriangle} label="Riesgo Bloqueo" value="Bajo" color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            {/* Campaign List */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" /> Historial de Campañas
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar campaña..."
                            className="bg-[#151520] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 w-64"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {campaigns.map(camp => (
                        <div key={camp.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex items-center gap-6 hover:bg-[#151520] transition-colors group">

                            {/* Status Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 
                                ${camp.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                    camp.status === 'active' ? 'bg-indigo-500/10 text-indigo-500 animate-pulse' :
                                        'bg-gray-700/20 text-gray-500'}`}>
                                {camp.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                                    camp.status === 'active' ? <Send className="w-6 h-6" /> :
                                        <Clock className="w-6 h-6" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                                <div className="col-span-1">
                                    <h4 className="text-white font-bold text-sm mb-1">{camp.name}</h4>
                                    <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{camp.segment}</span>
                                </div>

                                <div className="text-center">
                                    <span className="block text-xs font-bold text-gray-300">{camp.sent}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Enviados</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xs font-bold text-emerald-400">{camp.replies}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Respuestas</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1
                                        ${camp.risk === 'low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        <ShieldCheck className="w-3 h-3" /> Riesgo {camp.risk === 'low' ? 'Bajo' : 'Medio'}
                                    </span>
                                </div>
                            </div>

                            <button className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
                                <BarChart2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Campaign Wizard Modal */}
            <AnimatePresence>
                {showWizard && (
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
                            className="bg-[#0E0E18] border border-white/10 rounded-3xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl"
                        >
                            {/* Left: Steps */}
                            <div className="w-64 bg-[#151520] border-r border-white/5 p-6 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-6">Nueva Campaña</h3>
                                <div className="space-y-4">
                                    <WizardStep num="1" label="Objetivo" active={true} />
                                    <WizardStep num="2" label="Segmentación" />
                                    <WizardStep num="3" label="Mensaje" />
                                    <WizardStep num="4" label="Anti-Bloqueo" />
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                                    <h4 className="text-xl font-bold text-white mb-2">1. Define el Objetivo</h4>
                                    <p className="text-sm text-gray-400 mb-8">Esto ayuda a la IA a clasificar las respuestas.</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        {['Venta Directa', 'Recordatorio', 'Contenido Educativo', 'Reactivación'].map(obj => (
                                            <button key={obj} className="p-4 rounded-xl bg-[#151520] border border-white/5 text-left hover:border-indigo-500 hover:bg-indigo-600/10 transition-all group">
                                                <span className="block text-white font-bold mb-1 group-hover:text-indigo-400">{obj}</span>
                                                <span className="text-xs text-gray-500">Optimizado para conversión</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-[#0E0E18]">
                                    <button onClick={() => setShowWizard(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold">Continuar</button>
                                </div>
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

function WizardStep({ num, label, active }) {
    return (
        <div className={`flex items-center gap-3 ${active ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border 
                ${active ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-transparent border-gray-600 text-gray-400'}`}>
                {num}
            </div>
            <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
        </div>
    )
}
