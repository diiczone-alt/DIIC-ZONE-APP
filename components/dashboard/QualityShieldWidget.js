'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Clock, ThumbsUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export default function QualityShieldWidget() {
    const [score, setScore] = useState(0); // Animation start

    useEffect(() => {
        // Animate score to 98
        const timer = setTimeout(() => setScore(98), 500);
        return () => clearTimeout(timer);
    }, []);

    const metrics = [
        { id: 1, label: 'Calidad Entregas', value: '100%', icon: ThumbsUp, status: 'good' },
        { id: 2, label: 'Carga Equipo', value: '45%', icon: Users, status: 'good' },
        { id: 3, label: 'Tiempo Entrega', value: 'On Time', icon: Clock, status: 'good' },
    ];

    return (
        <div className="rounded-3xl bg-gradient-to-br from-[#0F0F1A] to-[#141422] border border-white/5 relative overflow-hidden flex flex-col shadow-2xl">
            {/* Decorative Shield BG */}
            <div className="absolute -right-6 -top-6 text-[#1A1A2E] opacity-50">
                <Shield size={120} strokeWidth={0.5} />
            </div>

            {/* Header */}
            <div className="p-5 flex items-center justify-between relative z-10">
                <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        Escudo de Calidad
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Protección activa 24/7</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-white">{score}%</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Rating Global</span>
                </div>
            </div>

            {/* Monitors Grid */}
            <div className="p-4 pt-0 grid grid-cols-3 gap-2 relative z-10">
                {metrics.map((m) => (
                    <div key={m.id} className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 border border-white/5 hover:bg-white/10 transition-colors">
                        <m.icon className={`w-4 h-4 ${m.status === 'good' ? 'text-emerald-400' : 'text-yellow-400'}`} />
                        <span className="text-sm font-bold text-white leading-tight">{m.value}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{m.label}</span>
                    </div>
                ))}
            </div>

            {/* Active Protections List */}
            <div className="px-5 pb-5 pt-2 space-y-3 relative z-10">
                <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Protecciones Activas</h4>

                <div className="flex items-center gap-3 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Control de Calidad: <span className="text-emerald-400">Automático</span></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Balanceo de Carga: <span className="text-emerald-400">Activo</span></span>
                </div>

                {/* Risk Warning (Demo) */}
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/10 flex items-start gap-2 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[10px] font-bold text-orange-300">Alerta de Riesgo Preventiva</p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                            Cliente "TechCorp" presenta cambios frecuentes (+4). <br />
                            <span className="text-white hover:underline cursor-pointer">Activar Modo "Alta Gestión"</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-1 w-full bg-emerald-500/20 mt-auto">
                <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]"></div>
            </div>
        </div>
    );
}
