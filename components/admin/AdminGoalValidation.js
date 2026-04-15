'use client';

import { useState } from 'react';
import {
    CheckCircle2, Circle, Target,
    User, ChevronRight, Trophy,
    Flag, Zap, Search, Filter,
    Activity, ShieldCheck, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminGoalValidation() {
    const [selectedClient, setSelectedClient] = useState(null);

    const clientData = [
        {
            id: 1, name: "Clínica Dental A", level: 2,
            goals: [
                { id: 'calendar', label: "Calendario activo", done: true },
                { id: 'posts12', label: "12 posts/mes", done: true },
                { id: 'reels2', label: "2 Reels Pro", done: false },
                { id: 'profile', label: "Perfil optimizado", done: true },
                { id: 'message', label: "Mensaje servicios", done: false }
            ]
        },
        {
            id: 2, name: "Empresa Tech B", level: 3,
            goals: [
                { id: 'testimonio3', label: "3 testimonios", done: true },
                { id: 'corpvideo', label: "Video corp", done: false },
                { id: 'solidbrand', label: "Branding sólido", done: true },
                { id: 'educontent', label: "Contenido edu", done: false }
            ]
        }
    ];

    const handleToggleGoal = (clientId, goalId) => {
        toast.success("Hito de madurez validado correctamente");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left pb-16">
            {/* HEADER */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target className="w-32 h-32 text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Target className="w-8 h-8 text-indigo-400" /> Validación de Metas
                    </h2>
                    <p className="text-gray-400 text-sm font-medium italic">"Aprobación Estratégica de Madurez Digital DIIC ZONE"</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CLIENT LIST */}
                <div className="lg:col-span-1 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 space-y-4">
                    <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Clientes Pendientes</h3>
                    {clientData.map(client => (
                        <button
                            key={client.id}
                            onClick={() => setSelectedClient(client)}
                            className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${selectedClient?.id === client.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-indigo-400">
                                    {client.level}
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xs font-black text-white uppercase">{client.name}</h4>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Nivel Actual</span>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    ))}
                </div>

                {/* GOAL VALIDATION PANEL */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedClient ? (
                        <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-10 text-left min-h-[500px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <ShieldCheck className="w-40 h-40 text-white" />
                            </div>

                            <div className="flex justify-between items-start mb-12 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Validar Hoja de Ruta</h3>
                                    <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mt-1">{selectedClient.name} • Planeación Nivel {selectedClient.level}</p>
                                </div>
                                <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Coach Activo
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {selectedClient.goals.map(goal => (
                                    <div
                                        key={goal.id}
                                        className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${goal.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${goal.done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-600'}`}>
                                                {goal.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-sm font-black uppercase tracking-tight ${goal.done ? 'text-white' : 'text-gray-400'}`}>{goal.label}</span>
                                        </div>
                                        <button
                                            onClick={() => handleToggleGoal(selectedClient.id, goal.id)}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${goal.done ? 'bg-white/5 text-gray-500 border border-white/5 hover:text-white' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'}`}
                                        >
                                            {goal.done ? 'Revertir' : 'Validar Logro'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5 flex justify-end gap-4">
                                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                                    Enviar Reporte a Cliente
                                </button>
                                <button className="px-8 py-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20">
                                    Promover Siguiente Nivel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#0A0A12] border border-white/5 border-dashed rounded-[40px] p-10 text-center flex flex-col items-center justify-center min-h-[500px]">
                            <Info className="w-12 h-12 text-gray-700 mb-6" />
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Selecciona un cliente para validar sus metas</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
