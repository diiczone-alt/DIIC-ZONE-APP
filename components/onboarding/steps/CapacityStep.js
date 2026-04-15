'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';

export default function CapacityStep({ onNext, updateData, userType, niche }) {
    const [stats, setStats] = useState({});

    // Configuración dinámica de preguntas
    const getQuestions = () => {
        // Lógica simplificada basada en nicho/tipo
        if (niche === 'medical' || userType === 'freelance') {
            return [
                { id: 'daily_appointments', label: '¿Cuántas citas atiendes por día?', icon: Calendar, type: 'range', min: 0, max: 40, step: 1 },
                { id: 'new_patients', label: '¿Pacientes nuevos por mes?', icon: Users, type: 'number' },
                { id: 'schedule_full', label: '¿Tu agenda suele llenarse?', icon: TrendingUp, type: 'select', options: ['Siempre', 'A veces', 'Rara vez'] }
            ];
        } else if (niche === 'education' || niche === 'creator') {
            return [
                { id: 'students_count', label: '¿Cuántos alumnos/seguidores tienes?', icon: Users, type: 'number' },
                { id: 'monthly_launches', label: '¿Lanzamientos al año?', icon: TrendingUp, type: 'number' },
                { id: 'avg_ticket', label: 'Ticket promedio de curso (USD)', icon: DollarSign, type: 'number' }
            ];
        } else {
            // Default Empresa / Business
            return [
                { id: 'clients_active', label: 'Clientes activos mensuales', icon: Users, type: 'number' },
                { id: 'team_size', label: 'Tamaño del equipo', icon: Users, type: 'range', min: 1, max: 50, step: 1 },
                { id: 'monthly_revenue', label: 'Facturación aprox. mensual (USD)', icon: DollarSign, type: 'select', options: ['< 1k', '1k - 5k', '5k - 20k', '20k - 50k', '> 50k'] }
            ];
        }
    };

    const handleChange = (id, val) => {
        setStats(prev => ({ ...prev, [id]: val }));
    };

    return (
        <div className="space-y-6 text-center h-full flex flex-col pt-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Capacidad Operativa</h2>
                <p className="text-gray-400">Analizaremos tu volumen actual para proyectar tu escalamiento.</p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-2">
                {getQuestions().map((q, i) => (
                    <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                                <q.icon className="w-5 h-5" />
                            </div>
                            <label className="font-bold text-gray-200">{q.label}</label>
                        </div>

                        {q.type === 'range' && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-gray-500">
                                    <span>{q.min}</span>
                                    <span className="text-white font-bold">{stats[q.id] || q.min}</span>
                                    <span>{q.max}+</span>
                                </div>
                                <input
                                    type="range"
                                    min={q.min}
                                    max={q.max}
                                    step={q.step}
                                    className="w-full accent-indigo-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                                    onChange={(e) => handleChange(q.id, e.target.value)}
                                />
                            </div>
                        )}

                        {q.type === 'number' && (
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full bg-[#0A0A12] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        )}

                        {q.type === 'select' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {q.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleChange(q.id, opt)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${stats[q.id] === opt ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={() => { updateData(stats); onNext(); }}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
            >
                Continuar
            </button>
        </div>
    );
}
