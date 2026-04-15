'use client';

import { Scan, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function AIRadarWidget() {
    return (
        <div className="bg-[#0A0F1F] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden h-full flex flex-col">
            {/* Radar Animation Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="w-[150%] h-[150%] absolute -top-1/4 -left-1/4 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="w-[100%] h-[100%] absolute top-0 left-0 border border-cyan-500/20 rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rotate-45" />
            </div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Scan className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">IA Monitor Active</h3>
                    <p className="text-[10px] text-cyan-400 animate-pulse">Escaneando ecosistema...</p>
                </div>
            </div>

            <div className="space-y-4 flex-1 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                <RadarItem
                    type="warning"
                    title="Falta Contenido Semanal"
                    desc="Se recomienda programar 3 posts."
                />
                <RadarItem
                    type="success"
                    title="Rendimiento en Reels"
                    desc="+15% de actividad vs semana pasada."
                />
                <RadarItem
                    type="info"
                    title="Oportunidad de Pauta"
                    desc="El video 'Lanzamiento' tiene alta retención."
                />
                <RadarItem
                    type="pending"
                    title="Automatización Pendiente"
                    desc="Revisar flujo de bienvenida en WhatsApp."
                />
            </div>
        </div>
    );
}

function RadarItem({ type, title, desc }) {
    const config = {
        warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        info: { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        pending: { icon: Scan, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    };

    const { icon: Icon, color, bg, border } = config[type];

    return (
        <div className={`p-4 rounded-xl border ${border} ${bg} backdrop-blur-sm flex gap-3 transition-transform hover:translate-x-1`}>
            <Icon className={`w-5 h-5 ${color} shrink-0 mt-0.5`} />
            <div>
                <h4 className={`text-xs font-bold ${color} uppercase tracking-wide mb-0.5`}>{title}</h4>
                <p className="text-xs text-gray-300 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
