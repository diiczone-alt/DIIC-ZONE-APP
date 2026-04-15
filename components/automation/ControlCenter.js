'use client';

import { Activity, Users, DollarSign, MessageCircle, BarChart, AlertTriangle } from 'lucide-react';

export default function ControlCenter() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            <MetricCard
                label="Canales"
                value="4/6"
                icon={Activity}
                color="text-blue-400"
                sub="Conectados"
            />
            <MetricCard
                label="Leads Mes"
                value="142"
                icon={Users}
                color="text-purple-400"
                sub="+15% vs ayer"
                trend="up"
            />
            <MetricCard
                label="Ventas"
                value="$3,400"
                icon={DollarSign}
                color="text-green-400"
                sub="Registradas"
            />
            <MetricCard
                label="ROI Est."
                value="4.2x"
                icon={BarChart}
                color="text-yellow-400"
                sub="Retorno"
            />
            <MetricCard
                label="Mensajes"
                value="89"
                icon={MessageCircle}
                color="text-pink-400"
                sub="Pendientes: 3"
                alert
            />
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-red-500/20 transition-colors">
                <AlertTriangle className="w-5 h-5 text-red-500 mb-1" />
                <span className="text-[10px] text-red-300 font-bold uppercase">Estado Sistema</span>
                <span className="text-xs text-white">1 Alerta</span>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, sub, trend, alert }) {
    return (
        <div className={`bg-[#0A0A12] border ${alert ? 'border-red-500/30' : 'border-white/5'} rounded-xl p-3 flex flex-col justify-between hover:border-white/10 transition-colors`}>
            <div className="flex justify-between items-start mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                {trend === 'up' && <span className="text-[10px] text-green-500 font-bold">↗</span>}
            </div>
            <div>
                <div className="text-lg font-bold text-white leading-none mb-1">{value}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</div>
                <div className="text-[9px] text-gray-500 mt-1 truncate">{sub}</div>
            </div>
        </div>
    );
}
