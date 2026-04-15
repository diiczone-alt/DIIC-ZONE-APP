'use client';

import { Users, Clapperboard, Megaphone, Bot, ShieldAlert, DollarSign, TrendingUp } from 'lucide-react';

export default function GlobalStatusBlock() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <StatusCard label="Clientes Activos" value="12" icon={Users} color="blue" />
            <StatusCard label="Producciones" value="8" sub="En curso" icon={Clapperboard} color="purple" />
            <StatusCard label="Campañas" value="6" sub="Activas" icon={Megaphone} color="pink" />
            <StatusCard label="Automatizaciones" value="ON" sub="4 flujos" icon={Bot} color="cyan" />
            <StatusCard label="Alertas" value="2" sub="Pendientes" icon={ShieldAlert} color="red" alert />
            <StatusCard label="Ingresos" value="$14.2k" sub="Mes actual" icon={DollarSign} color="green" />
            <StatusCard label="Utilidad Est." value="$4.8k" sub="+12%" icon={TrendingUp} color="emerald" />
        </div>
    );
}

function StatusCard({ label, value, sub, icon: Icon, color, alert }) {
    const colors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        red: 'text-red-400 bg-red-500/10 border-red-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    };

    return (
        <div className={`p-4 rounded-2xl bg-[#0E0E18] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden`}>
            {alert && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}

            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
                <Icon className="w-4 h-4" />
            </div>

            <div className="relative z-10">
                <div className="text-2xl font-black text-white leading-none mb-1">{value}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</div>
                {sub && <div className="text-[10px] text-gray-500 mt-1">{sub}</div>}
            </div>
        </div>
    );
}
