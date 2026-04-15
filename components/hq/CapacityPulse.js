'use client';

import { Activity } from 'lucide-react';

export default function CapacityPulse() {
    const capacity = [
        { role: 'Editor Video', load: 92, status: 'critical' },
        { role: 'Filmmaker', load: 45, status: 'safe' },
        { role: 'Diseñador', load: 78, status: 'warning' },
        { role: 'Audio/Mix', load: 30, status: 'safe' },
        { role: 'Community', load: 85, status: 'warning' },
    ];

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Capacidad de Equipo</h3>
            </div>

            <div className="space-y-4">
                {capacity.map((cap, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-bold text-gray-300">{cap.role}</span>
                            <span className={`font-mono font-bold ${cap.status === 'critical' ? 'text-red-400' :
                                    cap.status === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
                                }`}>
                                {cap.load}%
                            </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${cap.status === 'critical' ? 'bg-red-500' :
                                        cap.status === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'
                                    }`}
                                style={{ width: `${cap.load}%` }}
                            />
                        </div>
                        {cap.status === 'critical' && (
                            <p className="text-[10px] text-red-400 mt-1">⚠ No aceptar nuevos proyectos</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-gray-500">Capacidad Global Agencia</p>
                <p className="text-2xl font-black text-white mt-1">76%</p>
                <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20">Atención Moderada</span>
            </div>
        </div>
    );
}
