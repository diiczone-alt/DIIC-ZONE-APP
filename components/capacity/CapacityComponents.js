'use client';

import {
    Activity, AlertTriangle, CheckCircle,
    User, Battery, BatteryCharging, BatteryWarning, BatteryFull
} from 'lucide-react';

export function CapacityBar({ current, max, label, mini = false }) {
    const percentage = Math.min((current / max) * 100, 100);

    let color = 'bg-emerald-500';
    let textColor = 'text-emerald-400';
    let Icon = Battery;

    if (percentage >= 50) {
        color = 'bg-amber-500';
        textColor = 'text-amber-400';
        Icon = BatteryCharging;
    }
    if (percentage >= 85) {
        color = 'bg-red-500';
        textColor = 'text-red-400';
        Icon = BatteryWarning;
    }

    if (mini) {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{label || 'Carga'}</span>
                    <span className={`text-[10px] font-bold ${textColor}`}>{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${textColor}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{label}</p>
                        <p className="text-xs text-gray-500">{current} / {max} Asignaciones</p>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold bg-white/5 ${textColor}`}>
                    {percentage.toFixed(0)}%
                </span>
            </div>

            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-[10px] text-gray-500 text-right">
                {percentage >= 90 ? '⛔ Sobrecarga Inminente' : percentage >= 70 ? '⚠️ Alta Demanda' : '✅ Capacidad Óptima'}
            </p>
        </div>
    );
}

export function TeamMemberLoad({ name, role, avatar, currentLoad, maxLoad, activeProjects }) {
    const percentage = (currentLoad / maxLoad) * 100;
    let statusColor = 'border-emerald-500/30 bg-emerald-500/5';

    if (percentage >= 60) statusColor = 'border-amber-500/30 bg-amber-500/5';
    if (percentage >= 90) statusColor = 'border-red-500/30 bg-red-500/5';

    return (
        <div className={`border rounded-xl p-4 flex items-center justify-between transition-all hover:bg-white/5 ${statusColor}`}>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img src={avatar || `https://ui-avatars.com/api/?name=${name}&background=random`} alt={name} className="w-10 h-10 rounded-full" />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#050511] flex items-center justify-center text-[8px] font-bold text-white ${percentage >= 90 ? 'bg-red-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                        {percentage.toFixed(0)}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{name}</h4>
                    <p className="text-xs text-gray-400">{role}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Proyectos</p>
                    <p className="text-white font-bold text-sm">{activeProjects}</p>
                </div>
                <div className="w-24">
                    <CapacityBar current={currentLoad} max={maxLoad} mini />
                </div>
            </div>
        </div>
    );
}
