'use client';

import { useState, useEffect } from 'react';
import {
    Activity, CheckCircle2, AlertTriangle, XCircle,
    BarChart3, Calendar, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { agencyService } from '@/services/agencyService';

export default function HQCapacityPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [capacityData, setCapacityData] = useState({
        total: 1050,
        committed: 0,
        available: 1050,
        breakdown: [
            { dept: 'Diseño', used: 0, total: 400, percent: 0, alert: false },
            { dept: 'Video (Edición)', used: 0, total: 300, percent: 0, alert: false },
            { dept: 'Filmmaker (Grabación)', used: 0, total: 150, percent: 0, alert: false },
            { dept: 'Community Manager', used: 0, total: 200, percent: 0, alert: false },
        ]
    });

    useEffect(() => {
        const loadCapacityData = async () => {
            try {
                const clientList = await agencyService.getClients();
                const activeClients = clientList.filter(c => c.status === 'active');
                setClients(activeClients);

                // Calculate dynamic workloads based on client financial sheets
                let designHours = 0;
                let videoHours = 0;
                let filmmakerHours = 0;
                let cmHours = 0;

                activeClients.forEach(client => {
                    const sheet = client.financial_sheet || {};
                    const pm = sheet.production_monthly || {};

                    // 1. Design workload: 3.5 hours per design layout
                    const designsCount = Number(pm.designs) || 0;
                    designHours += designsCount * 3.5;

                    // 2. Video edit workload: reels * 4.5h + tiktok * 4.5h + vid_corp * 10h
                    const reelsCount = Number(pm.reels) || 0;
                    const tiktokCount = Number(pm.tiktok) || 0;
                    const vidCorpCount = Number(pm.vid_corp) || 0;
                    videoHours += (reelsCount * 4.5) + (tiktokCount * 4.5) + (vidCorpCount * 10);

                    // 3. Filmmaker workload: shoots * 6h (recording + setup + travel)
                    const shootsCount = Number(pm.shoots) || 0;
                    filmmakerHours += shootsCount * 6;

                    // 4. CM workload: 25h/month per client with active CM
                    if (pm.cm) {
                        cmHours += 25;
                    }
                });

                // Round hours
                designHours = Math.round(designHours);
                videoHours = Math.round(videoHours);
                filmmakerHours = Math.round(filmmakerHours);
                cmHours = Math.round(cmHours);

                const totalCommitted = designHours + videoHours + filmmakerHours + cmHours;
                const totalCapacity = 1050; // Sum of department capacities: 400 + 300 + 150 + 200

                setCapacityData({
                    total: totalCapacity,
                    committed: totalCommitted,
                    available: Math.max(0, totalCapacity - totalCommitted),
                    breakdown: [
                        { dept: 'Diseño', used: designHours, total: 400, percent: Math.min(100, Math.round((designHours / 400) * 100)), alert: (designHours / 400) > 0.85 },
                        { dept: 'Video (Edición)', used: videoHours, total: 300, percent: Math.min(100, Math.round((videoHours / 300) * 100)), alert: (videoHours / 300) > 0.85 },
                        { dept: 'Filmmaker (Grabación)', used: filmmakerHours, total: 150, percent: Math.min(100, Math.round((filmmakerHours / 150) * 100)), alert: (filmmakerHours / 150) > 0.85 },
                        { dept: 'Community Manager', used: cmHours, total: 200, percent: Math.min(100, Math.round((cmHours / 200) * 100)), alert: (cmHours / 200) > 0.85 },
                    ]
                });
            } catch (err) {
                console.error("Error loading capacity data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCapacityData();
    }, []);

    // Smart Suggestion Logic
    const getAdvice = () => {
        if (capacityData.total === 0) return { status: 'GREEN', title: 'Capacidad Disponible', desc: 'Sistemas listos.', action: 'Onboarding' };
        
        const usageRatio = capacityData.committed / capacityData.total;
        const saturatedDepts = capacityData.breakdown.filter(d => d.alert).map(d => d.dept);

        if (usageRatio > 0.85) {
            return {
                status: 'RED',
                title: 'Bloquear Nuevos Contratos',
                desc: `La agencia está al ${Math.round(usageRatio * 100)}% de capacidad operativa. Departamentos saturados: ${saturatedDepts.join(', ') || 'Edición/CM'}. Aceptar más clientes pondría en riesgo la calidad.`,
                action: 'Lista de Espera'
            };
        } else if (usageRatio > 0.65) {
            return {
                status: 'YELLOW',
                title: 'Capacidad Limitada',
                desc: `La agencia está al ${Math.round(usageRatio * 100)}% de ocupación. Se sugiere optimizar o renegociar contratos antes de aceptar nuevos socios.`,
                action: 'Filtrar Clientes'
            };
        }
        return { 
            status: 'GREEN', 
            title: 'Capacidad Disponible', 
            desc: `Sistemas estables al ${Math.round(usageRatio * 100)}% de ocupación. Contamos con disponibilidad para incorporar nuevos clientes de alta rentabilidad.`, 
            action: 'Onboarding' 
        };
    };

    const advice = getAdvice();

    const adviceColorClass = 
        advice.status === 'RED' 
        ? 'bg-red-500/5 border-red-500/20' 
        : advice.status === 'YELLOW' 
        ? 'bg-amber-500/5 border-amber-500/20' 
        : 'bg-green-500/5 border-green-500/20';

    const adviceIconBg = 
        advice.status === 'RED' 
        ? 'bg-red-500/10 text-red-500 shadow-lg shadow-red-500/20' 
        : advice.status === 'YELLOW' 
        ? 'bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/20' 
        : 'bg-green-500/10 text-green-500 shadow-lg shadow-green-500/20';

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            <div>
                <header className="h-20 border-b border-white/5 flex items-center px-8 bg-[#050511]/80 backdrop-blur-xl sticky top-0 z-40">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" /> Planificación de Capacidad
                    </h2>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="space-y-4 text-center">
                            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Analizando capacidad de la escuadra...</p>
                        </div>
                    </div>
                ) : (
                    <main className="p-8 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Decision Card */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className={`p-8 rounded-3xl border relative overflow-hidden flex flex-col items-center text-center justify-center min-h-[300px] ${adviceColorClass}`}>
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${adviceIconBg}`}>
                                    {advice.status === 'RED' ? (
                                        <XCircle className="w-10 h-10" />
                                    ) : advice.status === 'YELLOW' ? (
                                        <AlertTriangle className="w-10 h-10" />
                                    ) : (
                                        <CheckCircle2 className="w-10 h-10" />
                                    )}
                                </div>

                                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight italic">{advice.title}</h3>
                                <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed mb-8">{advice.desc}</p>

                                <div className="flex gap-4">
                                    <button className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform text-xs uppercase tracking-wider">
                                        Acción: {advice.action}
                                    </button>
                                    <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors text-xs uppercase tracking-wider">
                                        Ver Carga Detallada
                                    </button>
                                </div>
                            </div>

                            {/* Department Capacity Bars */}
                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                                <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wider italic">
                                    <BarChart3 className="w-5 h-5 text-gray-400" /> Desglose por Departamento
                                </h3>
                                <div className="space-y-6">
                                    {capacityData.breakdown.map((dept, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-2 font-medium">
                                                <span className="text-gray-300 font-bold uppercase tracking-wider">{dept.dept}</span>
                                                <span className={dept.alert ? 'text-rose-400 font-black' : 'text-gray-400'}>
                                                    {dept.used} / {dept.total} hrs ({dept.percent}%)
                                                </span>
                                            </div>
                                            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${dept.percent}%` }}
                                                    className={`h-full rounded-full ${
                                                        dept.alert 
                                                        ? 'bg-rose-500' 
                                                        : dept.percent > 70 
                                                        ? 'bg-amber-500' 
                                                        : 'bg-indigo-500'
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
                                <h4 className="font-bold text-gray-455 text-[10px] uppercase tracking-wider mb-4 font-black">Resumen Global</h4>
                                <div className="text-center py-6">
                                    <div className="text-6xl font-black text-white mb-2">{Math.round((capacityData.committed / capacityData.total) * 100)}%</div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Ocupación Total</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center mt-4 pt-4 border-t border-white/5">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{capacityData.available}h</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Disponibles</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-400">{capacityData.total}h</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-bold">Totales</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-6">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                                    <Users className="w-4 h-4 text-indigo-400" /> Sugerencia de Contratación
                                </h4>
                                {capacityData.breakdown.some(d => d.alert) ? (
                                    <>
                                        <p className="text-xs text-gray-300 leading-relaxed mb-4 uppercase tracking-wide">
                                            Sistemas reportan saturación en {capacityData.breakdown.filter(d => d.alert).map(d => d.dept).join(', ')}.
                                        </p>
                                        <button className="w-full py-3 bg-indigo-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-750 transition-colors shadow-lg shadow-indigo-600/20">
                                            Publicar Solicitud Staff
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs text-gray-300 leading-relaxed mb-4">
                                            Carga del equipo balanceada. No se requieren contrataciones inmediatas.
                                        </p>
                                        <button className="w-full py-3 bg-white/5 rounded-xl text-gray-400 text-[10px] font-black uppercase tracking-widest border border-white/10 cursor-not-allowed">
                                            Sin Vacantes Necesarias
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                    </main>
                )}
            </div>
        </div>
    );
}
