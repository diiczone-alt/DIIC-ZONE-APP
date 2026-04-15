'use client';

import {
    BarChart2, TrendingUp, Users, MessageCircle, Send,
    Bot, DollarSign, Calendar, ArrowUpRight, ArrowDownRight,
    PieChart, Activity
} from 'lucide-react';
import { useState } from 'react';

export default function DataView() {
    const [activeTab, setActiveTab] = useState('general'); // general, chats, status, broadcast

    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-0 relative flex flex-col">

            {/* Sub-Navigation (Tabs) */}
            <div className="h-14 border-b border-white/5 bg-[#0E0E18] flex items-center px-6 gap-6 sticky top-0 z-10">
                {[
                    { id: 'general', label: 'Visión General', icon: Activity },
                    { id: 'chats', label: 'Chats & IA', icon: MessageCircle },
                    { id: 'status', label: 'Estados', icon: TrendingUp },
                    { id: 'broadcast', label: 'Difusión', icon: Send },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 text-xs font-bold py-4 border-b-2 transition-colors ${activeTab === tab.id ? 'text-indigo-400 border-indigo-400' : 'text-gray-500 border-transparent hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Content */}
            <div className="p-8">
                {activeTab === 'general' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Resumen Ejecutivo</h2>

                        {/* Big Numbers */}
                        <div className="grid grid-cols-4 gap-6">
                            <StatCard label="Leads Generados" value="1,240" trend="+15%" positive={true} icon={Users} />
                            <StatCard label="Ventas WhatsApp" value="$12,450" trend="+8%" positive={true} icon={DollarSign} />
                            <StatCard label="Tasa Conversión" value="4.2%" trend="-0.5%" positive={false} icon={BarChart2} />
                            <StatCard label="Ahorro en Ads" value="$850" trend="+22%" positive={true} icon={TrendingUp} />
                        </div>

                        {/* Charts Area (Mock) */}
                        <div className="grid grid-cols-3 gap-6 h-80">
                            <div className="col-span-2 bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                                <h3 className="text-white font-bold text-sm">Rendimiento Mensual</h3>
                                <div className="flex-1 flex items-end gap-2 mt-4 px-2">
                                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/40 rounded-t-lg transition-all relative group" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">{h * 10} leads</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-1 bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex flex-col">
                                <h3 className="text-white font-bold text-sm mb-4">Origen de Leads</h3>
                                <div className="flex-1 flex items-center justify-center relative">
                                    <div className="w-40 h-40 rounded-full border-[12px] border-indigo-600/20 border-t-indigo-500 border-r-emerald-500"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-white">85%</span>
                                        <span className="text-[10px] text-gray-500">Orgánico</span>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <div className="flex justify-between text-xs">
                                        <span className="flex items-center gap-2 text-gray-400"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Estados</span>
                                        <span className="text-white font-bold">45%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="flex items-center gap-2 text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Difusión</span>
                                        <span className="text-white font-bold">40%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab !== 'general' && (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                            <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm">Análisis detallado de {activeTab} en construcción</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ label, value, trend, positive, icon: Icon }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</p>
        </div>
    )
}
