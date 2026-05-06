'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Users, Truck, Camera, Video, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { agencyService } from '@/services/agencyService';

export default function LogisticsCrew() {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await agencyService.getEquipmentRequirements();
            setRequirements(data || []);
        } catch (error) {
            console.error('Error loading logistics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-8 bg-[#0E0E18] text-white">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                            <Truck className="w-8 h-8 text-amber-500" /> Logística & Crew
                        </h2>
                        <p className="text-gray-400 font-medium tracking-wide mt-2">
                            Gestión de equipos, locaciones y requerimientos técnicos para rodajes.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                        Nuevo Requerimiento
                    </button>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Map className="w-12 h-12 text-amber-500 animate-pulse mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Cargando Manifiesto...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT COLUMN: EQUIPMENT REQS */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-indigo-400" /> Manifiesto de Equipos
                                </h3>
                                <div className="space-y-4">
                                    {requirements.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 text-sm font-medium border border-dashed border-white/10 rounded-2xl">
                                            No hay requerimientos activos.
                                        </div>
                                    ) : (
                                        requirements.map((req, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                        {req.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white uppercase">{req.name}</h4>
                                                        <span className="text-xs text-gray-500 tracking-widest uppercase">Req: {req.requester} • {req.date}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ACTIVE LOCATIONS / CALL SHEETS */}
                        <div className="space-y-6">
                            <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-6">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Map className="w-4 h-4 text-indigo-400" /> Locaciones Activas
                                </h3>
                                <div className="space-y-4">
                                    {/* MOCK DATA FOR NOW */}
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                                        <h4 className="text-sm font-bold text-white mb-1">Clínica Santa Anita Sur</h4>
                                        <p className="text-xs text-gray-400">Rodaje de Quirófano - 10:00 AM</p>
                                        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                            <Users className="w-3 h-3" /> Crew: 3 personas
                                        </div>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                                        <h4 className="text-sm font-bold text-white mb-1">Estudio Central DIIC</h4>
                                        <p className="text-xs text-gray-400">Grabación de Podcast - 15:00 PM</p>
                                        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                            <Users className="w-3 h-3" /> Crew: 2 personas
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-rose-900/10 border border-rose-500/20 rounded-3xl p-6">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-rose-400" /> Alertas Logísticas
                                </h3>
                                <p className="text-xs text-gray-400 font-medium">Todo el equipo se encuentra verificado y asignado correctamente para los rodajes de la semana.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
