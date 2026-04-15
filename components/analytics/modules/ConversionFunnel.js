'use client';

import { Funnel, MessageCircle, CalendarCheck, CheckCircle2 } from 'lucide-react';

export default function ConversionFunnel() {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                    <Funnel className="w-6 h-6" /> // Fixed Icon name import if needed or use filter icon visually
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Leads & Conversiones</h3>
                    <p className="text-sm text-gray-400">Tu embudo de ventas en tiempo real</p>
                </div>
            </div>

            <div className="space-y-2 relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-amber-500 to-green-500 opacity-30"></div>

                <FunnelStep
                    label="Leads Generados"
                    value="34"
                    icon={MessageCircle}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    percentage="100%"
                />
                <FunnelStep
                    label="Conversaciones Activas"
                    value="26"
                    icon={MessageCircle}
                    color="text-indigo-400"
                    bg="bg-indigo-500/10"
                    percentage="76%"
                    sub="Cualificados"
                />
                <FunnelStep
                    label="Citas Agendadas"
                    value="18"
                    icon={CalendarCheck}
                    color="text-amber-400"
                    bg="bg-amber-500/10"
                    percentage="52%"
                />
                <FunnelStep
                    label="Clientes Cerrados"
                    value="9"
                    icon={CheckCircle2}
                    color="text-green-400"
                    bg="bg-green-500/10"
                    percentage="26%"
                    isFinal
                />
            </div>
        </div>
    );
}

function FunnelStep({ label, value, icon: Icon, color, bg, percentage, isFinal, sub }) {
    return (
        <div className={`relative flex items-center gap-4 p-3 rounded-xl transition-colors ${isFinal ? 'bg-green-500/5 border border-green-500/20' : 'hover:bg-white/5'}`}>
            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color} border border-white/5 shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-bold ${isFinal ? 'text-white' : 'text-gray-300'}`}>{label}</span>
                    <span className="text-xs font-mono text-gray-500">{percentage}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: percentage }}></div>
                </div>
            </div>
            <div className="text-right min-w-[50px]">
                <div className={`text-xl font-black ${isFinal ? 'text-green-400' : 'text-white'}`}>{value}</div>
                {sub && <div className="text-[9px] text-gray-500 uppercase">{sub}</div>}
            </div>
        </div>
    );
}
