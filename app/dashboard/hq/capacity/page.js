'use client';

import { useState } from 'react';
import HQSidebar from '@/components/layout/HQSidebar';
import {
    Activity, CheckCircle2, AlertTriangle, XCircle,
    BarChart3, Calendar, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HQCapacityPage() {

    // Logic: 
    // Total Agency Capacity = 1000 hours/month
    // Committed Hours = Sum of all active projects
    // Available = Total - Committed

    const [capacityData] = useState({
        total: 1000,
        committed: 820,
        available: 180,
        breakdown: [
            { dept: 'Diseño', used: 280, total: 400, percent: 70 },
            { dept: 'Video', used: 255, total: 300, percent: 85, alert: true },
            { dept: 'Audio', used: 40, total: 100, percent: 40 },
            { dept: 'Community', used: 180, total: 200, percent: 90, alert: true },
        ]
    });

    // Smart Suggestion Logic
    const getAdvice = () => {
        if (capacityData.committed / capacityData.total > 0.85) {
            return {
                status: 'RED',
                title: 'No Aceptar Nuevos Clientes',
                desc: 'La agencia está al 82% de capacidad. Video y Community están saturados. Aceptar más clientes pondría en riesgo la calidad.',
                action: 'Lista de Espera'
            };
        }
        return { status: 'GREEN', title: 'Capacidad Disponible', desc: 'Sistemas operativos. Puedes aceptar nuevos clientes.', action: 'Onboarding' };
    };

    const advice = getAdvice();

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            <HQSidebar />
            <div className="pl-64">
                <header className="h-20 border-b border-white/5 flex items-center px-8 bg-[#050511]/80 backdrop-blur-xl sticky top-0 z-40">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" /> Planificación de Capacidad
                    </h2>
                </header>

                <main className="p-8 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Decision Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className={`p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center text-center justify-center min-h-[300px] ${advice.status === 'RED' ? 'bg-red-500/5' : 'bg-green-500/5'
                            }`}>
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${advice.status === 'RED' ? 'bg-red-500/10 text-red-500 shadow-lg shadow-red-500/20' : 'bg-green-500/10 text-green-500'
                                }`}>
                                {advice.status === 'RED' ? <XCircle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                            </div>

                            <h3 className="text-3xl font-black text-white mb-2">{advice.title}</h3>
                            <p className="text-gray-400 max-w-lg mx-auto text-lg mb-8">{advice.desc}</p>

                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform">
                                    Acción Prohibida: Nuevo Cliente
                                </button>
                                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">
                                    Ver Proyección Próx. Mes
                                </button>
                            </div>
                        </div>

                        {/* Department Capacity Bars */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-gray-400" /> Desglose por Departamento
                            </h3>
                            <div className="space-y-6">
                                {capacityData.breakdown.map((dept, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-2 font-medium">
                                            <span className="text-gray-300">{dept.dept}</span>
                                            <span className={dept.alert ? 'text-red-400' : 'text-gray-400'}>
                                                {dept.used} / {dept.total} hrs ({dept.percent}%)
                                            </span>
                                        </div>
                                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${dept.percent}%` }}
                                                className={`h-full rounded-full ${dept.alert ? 'bg-red-500 striped' : 'bg-indigo-500'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Context */}
                    <div className="space-y-6">
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                            <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Resumen Global</h4>
                            <div className="text-center py-6">
                                <div className="text-6xl font-black text-white mb-2">{Math.round((capacityData.committed / capacityData.total) * 100)}%</div>
                                <p className="text-gray-500 font-medium">Ocupación Total</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center mt-4 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-2xl font-bold text-white">{capacityData.available}h</p>
                                    <p className="text-xs text-gray-500">Disponibles</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-400">{capacityData.total}h</p>
                                    <p className="text-xs text-gray-500">Totales</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-6">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-400" /> Sugerencia de Contratación
                            </h4>
                            <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                Se requieren <strong>+40 horas/mes</strong> en edición de video para reducir la carga al 70%.
                            </p>
                            <button className="w-full py-2 bg-indigo-600 rounded-lg text-white text-xs font-bold hover:bg-indigo-700 transition-colors">
                                Publicar Vacante Editor
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
