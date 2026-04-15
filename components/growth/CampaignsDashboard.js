'use client';

import { motion } from 'framer-motion';
import {
    Megaphone, Target, Users, MousePointer2, Plus,
    MoreHorizontal, PauseCircle, PlayCircle
} from 'lucide-react';

export default function CampaignsDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Mis Campañas</h1>
                    <p className="text-gray-400">Publicidad activa en Meta, Google y TikTok.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-black uppercase tracking-wide transition-colors shadow-lg shadow-blue-600/20">
                    <Plus className="w-5 h-5" /> Nueva Campaña
                </button>
            </div>

            {/* Overview Stats */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <StatBadge label="Alcance Total" value="1.2M" trend="+5%" />
                <StatBadge label="Clics (Link)" value="45.2k" trend="+12%" />
                <StatBadge label="CTR Promedio" value="2.8%" trend="+0.2%" />
                <StatBadge label="Costo por Lead" value="$0.45" trend="-10%" positive />
            </div>

            {/* Campaign List */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-500" /> Campañas Activas
                    </h3>
                    <div className="flex gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Filtrar por:</span>
                        <select className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer">
                            <option>Estado: Todas</option>
                            <option>Estado: Activas</option>
                        </select>
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    <CampaignRow
                        name="Lanzamiento Verano 2024"
                        platform="Meta Ads"
                        status="Active"
                        results="1,204 Leads"
                        cost="$542.00"
                        roas="4.5x"
                    />
                    <CampaignRow
                        name="Retargeting Carrito Abandonado"
                        platform="Instagram"
                        status="Active"
                        results="45 Ventas"
                        cost="$120.00"
                        roas="12.0x"
                    />
                    <CampaignRow
                        name="Awareness Marca - Video"
                        platform="TikTok Ads"
                        status="Paused"
                        results="50k Views"
                        cost="$80.00"
                        roas="--"
                    />
                </div>
            </div>
        </div>
    );
}

function StatBadge({ label, value, trend, positive }) {
    return (
        <div className="min-w-[180px] p-4 rounded-2xl bg-[#0E0E18] border border-white/5 hover:border-white/10 transition-colors">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-white">{value}</span>
                <span className={`text-xs font-bold mb-1 ${positive ? 'text-green-400' : 'text-blue-400'}`}>{trend}</span>
            </div>
        </div>
    );
}

function CampaignRow({ name, platform, status, results, cost, roas }) {
    const isActive = status === 'Active';

    return (
        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4 w-1/3">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                <div>
                    <h4 className="font-bold text-white text-sm">{name}</h4>
                    <p className="text-xs text-gray-500">{platform}</p>
                </div>
            </div>

            <div className="flex-1 flex justify-around">
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Resultados</p>
                    <p className="text-sm font-bold text-white">{results}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Inversión</p>
                    <p className="text-sm font-bold text-white">{cost}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">ROAS</p>
                    <p className="text-sm font-bold text-blue-400">{roas}</p>
                </div>
            </div>

            <div className="w-10 text-right">
                <button className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
