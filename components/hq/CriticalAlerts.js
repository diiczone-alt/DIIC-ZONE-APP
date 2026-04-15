'use client';

import { AlertTriangle, Clock, UserX, Ban } from 'lucide-react';

export default function CriticalAlerts() {
    const alerts = [
        { id: 1, type: 'deadline', msg: 'Entrega "Spot TV" vence en 4h', project: 'Clínica Smith', priority: 'critical' },
        { id: 2, type: 'approval', msg: 'Cliente no aprueba "Campaña Black Friday"', project: 'Ecom Store', priority: 'high' },
        { id: 3, type: 'overload', msg: 'Editor (Carlos) al 120% de capacidad', project: 'General', priority: 'medium' }
    ];

    return (
        <div className="bg-[#1A0505] border border-red-500/20 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Alertas Críticas (3)</h3>
            </div>

            <div className="space-y-3">
                {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors cursor-pointer group flex items-start gap-4">
                        <div className={`mt-1 ${alert.priority === 'critical' ? 'text-red-500' : 'text-orange-500'}`}>
                            {alert.type === 'deadline' && <Clock className="w-4 h-4" />}
                            {alert.type === 'approval' && <Ban className="w-4 h-4" />}
                            {alert.type === 'overload' && <UserX className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm group-hover:underline decoration-red-500">{alert.msg}</p>
                            <p className="text-xs text-red-400/60 mt-0.5">{alert.project}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
