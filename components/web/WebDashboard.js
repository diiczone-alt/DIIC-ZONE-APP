'use client';

import { motion } from 'framer-motion';
import {
    Activity, CheckCircle, Clock,
    BarChart3, Settings, ExternalLink,
    MessageSquare, AlertCircle
} from 'lucide-react';

export default function WebDashboard({ projectData, onBack }) {
    // Mock data based on selection
    const levelName = ['Desconocido', 'Presencia Básica', 'Web Profesional', 'Web Avanzada', 'Sistema Completo'][projectData.level] || 'Nivel 1';

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Tu Departamento Web</h1>
                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase">
                            Activo
                        </span>
                    </div>
                    <p className="text-gray-400">Gestionando tu proyecto: <span className="text-white font-bold">{levelName}</span></p>
                </div>

                <div className="flex gap-3">
                    <button onClick={onBack} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-sm font-bold transition-colors">
                        Ver Planes
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20">
                        Solicitar Soporte
                    </button>
                </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Main Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-[#0E0E18] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Activity className="w-24 h-24 text-cyan-500" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-6">Estado del Proyecto</h3>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-white/10 flex items-center justify-center">
                                <span className="text-xl font-black text-white">15%</span>
                            </div>
                            <svg className="absolute top-0 left-0 w-20 h-20 -rotate-90">
                                <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4" fill="none" className="text-cyan-500" strokeDasharray="238" strokeDashoffset="200" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white mb-1">Fase: Briefing Inicial</h4>
                            <p className="text-gray-400 text-sm">Estamos recopilando la información necesaria para iniciar tu {levelName}.</p>
                        </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10" />

                        {[
                            { label: 'Brief', status: 'current' },
                            { label: 'Propuesta', status: 'pending' },
                            { label: 'Diseño', status: 'pending' },
                            { label: 'Desarrollo', status: 'pending' },
                            { label: 'Launch', status: 'pending' }
                        ].map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 bg-[#0E0E18] px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step.status === 'completed' ? 'bg-cyan-500 border-cyan-500 text-black' :
                                        step.status === 'current' ? 'bg-[#0E0E18] border-cyan-500 text-cyan-500' :
                                            'bg-[#0E0E18] border-white/10 text-gray-600'
                                    }`}>
                                    {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide ${step.status === 'current' ? 'text-cyan-400' : 'text-gray-600'
                                    }`}>{step.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions / Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0E0E18] border border-white/10 rounded-3xl p-6 flex flex-col"
                >
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Acciones Pendientes</h3>

                    <div className="space-y-3 flex-grow">
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3 items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-yellow-100 mb-1">Completar Brief</h4>
                                <p className="text-xs text-yellow-200/60 leading-relaxed">Necesitamos detalles sobre tu marca para generar la propuesta.</p>
                                <button className="mt-3 px-3 py-1.5 rounded-lg bg-yellow-500 text-black text-xs font-bold hover:bg-yellow-400 transition-colors">
                                    Comenzar Brief
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Metrics & Tools Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Visitas Mensuales', value: '0', icon: BarChart3, color: 'text-blue-400' },
                    { label: 'Velocidad de Carga', value: '--', icon: Zap, color: 'text-yellow-400' },
                    { label: 'Leads Captados', value: '0', icon: MessageSquare, color: 'text-green-400' },
                    { label: 'Uptime', value: '100%', icon: Activity, color: 'text-purple-400' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center hover:border-white/10 transition-colors">
                        <stat.icon className={`w-6 h-6 mb-2 ${stat.color} opacity-80`} />
                        <span className="text-2xl font-black text-white mb-1">{stat.value}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">¿Necesitas funciones avanzadas?</h3>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                    Integra chatbots, CRM, pasarelas de pago y más automatizaciones directamente desde aquí.
                </p>
                <button className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform">
                    Explorar Integraciones
                </button>
            </div>
        </div>
    );
}

// Add import since I used it inside the map
import { Zap } from 'lucide-react';
