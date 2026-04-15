'use client';

import {
    Users, DollarSign, Briefcase,
    ArrowUpRight, AlertTriangle, Activity,
    BatteryCharging
} from 'lucide-react';
import { calculateDepartmentLoad, getLoadStatusColor } from '@/utils/workloadEngine';

// Mock Data for Workload
const workloadData = {
    VIDEO: calculateDepartmentLoad([{ cp_estimate: 85 }], 'VIDEO'),
    DESIGN: calculateDepartmentLoad([{ cp_estimate: 95 }], 'DESIGN'), // Saturated
    WEB: calculateDepartmentLoad([{ cp_estimate: 20 }], 'WEB'),
};

export default function AdminDashboard() {
    return (
        <div className="flex-1 overflow-y-auto p-10">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-white mb-2">Resumen Global</h1>
                <p className="text-gray-400">Visión general del ecosistema DIIC ZONE.</p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Revenue */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-24 h-24 text-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Ingresos Mensuales</p>
                        <h3 className="text-3xl font-black text-white">$45,280</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> +18%
                            </span>
                            <span className="text-xs text-gray-500">vs mes anterior</span>
                        </div>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Usuarios Totales</p>
                        <h3 className="text-3xl font-black text-white">1,204</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 font-bold flex items-center gap-1">
                                <Activity className="w-3 h-3" /> 84 Activos hoy
                            </span>
                        </div>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Briefcase className="w-24 h-24 text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Proyectos Activos</p>
                        <h3 className="text-3xl font-black text-white">32</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">12 en Post-producción</span>
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Estado del Sistema</p>
                        <h3 className="text-3xl font-black text-emerald-400">99.9%</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">Uptime (Últimos 30 días)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Operational Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Workload Prediction (CP System) */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <BatteryCharging className="w-5 h-5 text-purple-500" />
                        Predicción de Carga (CP System)
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(workloadData).map(([dept, data]) => (
                            <div key={dept}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400 font-bold">{dept}</span>
                                    <span className={`text-xs font-bold ${getLoadStatusColor(data.status)}`}>
                                        {data.percentage}% - {data.status}
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${data.percentage > 90 ? 'bg-orange-500' : data.percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${data.percentage}%` }}
                                    />
                                </div>
                                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                                    <span>0 CP</span>
                                    <span>{data.currentCP}/{data.maxCP} CP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Internal Reputation Summary */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Salud de Reputación Creativa
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                            <span className="block text-3xl font-black text-emerald-400">12</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">Nivel Elite</span>
                        </div>
                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                            <span className="block text-3xl font-black text-amber-400">5</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">En Observación</span>
                        </div>
                        <div className="col-span-2 p-4 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white font-bold">Confianza Promedio</p>
                                <p className="text-xs text-gray-500">Global del equipo</p>
                            </div>
                            <span className="text-2xl font-black text-white">88/100</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-8">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-400" /> Actividad Reciente
                </h3>
                <div className="space-y-6">
                    {[
                        { time: 'Hace 5 min', action: 'Nuevo usuario registrado', user: 'carlos.video@mail.com', type: 'user' },
                        { time: 'Hace 12 min', action: 'Pago procesado ($450)', user: 'Cliente: Nike Campaign', type: 'money' },
                        { time: 'Hace 45 min', action: 'Reporte de error (Login)', user: 'Sistema', type: 'alert' },
                        { time: 'Hace 1 h', action: 'Proyecto finalizado', user: 'Boda Civil Luis & Carla', type: 'project' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] -mx-4 px-4 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${item.type === 'alert' ? 'bg-red-500' : item.type === 'money' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                <div>
                                    <p className="text-sm text-gray-200 font-medium">{item.action}</p>
                                    <p className="text-xs text-gray-500">{item.user}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-600 font-mono">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
