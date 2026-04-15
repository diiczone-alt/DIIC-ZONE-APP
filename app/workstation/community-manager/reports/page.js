'use client';

import { useState } from 'react';
import {
    BarChart2, Download, Filter, Calendar,
    ArrowUpRight, ArrowDownRight, Share2,
    Users, Eye, MousePointer
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
    const [period, setPeriod] = useState('Este Mes');

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <BarChart2 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Reportes de Rendimiento</h1>
                        <p className="text-xs text-gray-400">Analíticas detalladas y exportación de datos</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-[#0E0E18] p-1 rounded-lg border border-white/10">
                        {['Esta Semana', 'Este Mes', 'Este Trimestre'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${period === p ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        <Download className="w-4 h-4" />
                        <span>Exportar PDF</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        label="Alcance Total"
                        value="124.5K"
                        trend="+12%"
                        icon={Eye}
                        color="text-blue-400"
                        bg="bg-blue-500"
                    />
                    <MetricCard
                        label="Engagement Rate"
                        value="4.8%"
                        trend="+0.5%"
                        icon={MousePointer}
                        color="text-emerald-400"
                        bg="bg-emerald-500"
                    />
                    <MetricCard
                        label="Nuevos Seguidores"
                        value="+1,203"
                        trend="-2%"
                        isNegative
                        icon={Users}
                        color="text-amber-400"
                        bg="bg-amber-500"
                    />
                    <MetricCard
                        label="Shares & Saves"
                        value="856"
                        trend="+8%"
                        icon={Share2}
                        color="text-purple-400"
                        bg="bg-purple-500"
                    />
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Chart (Mock) */}
                    <div className="lg:col-span-2 bg-[#0E0E18] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Crecimiento de Audiencia</h3>
                            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>

                        {/* CSS Bar Chart Simulation */}
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                                <div key={i} className="w-full bg-white/5 rounded-t-lg relative group/bar hover:bg-indigo-500/20 transition-colors cursor-pointer">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 via-indigo-500 to-cyan-400 opacity-60 group-hover/bar:opacity-100 transition-opacity rounded-t-lg mx-1"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-4 text-xs text-gray-500 font-medium">
                            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
                        </div>
                    </div>

                    {/* Top Posts */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6">Top Contenido</h3>
                        <div className="space-y-4">
                            <TopPostItem
                                title="Reel: Tendencias 2026"
                                views="45.2K"
                                type="Reel"
                                rank={1}
                            />
                            <TopPostItem
                                title="Carrusel: Tips de Diseño"
                                views="22.1K"
                                type="Carrusel"
                                rank={2}
                            />
                            <TopPostItem
                                title="Story: Q&A Live"
                                views="18.5K"
                                type="Story"
                                rank={3}
                            />
                            <TopPostItem
                                title="Post: Frase Motivacional"
                                views="12.3K"
                                type="Imagen"
                                rank={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white">Desglose por Plataforma</h3>
                        <button className="text-xs text-indigo-400 font-bold hover:text-indigo-300">Ver Todo</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-gray-300">
                                <tr>
                                    <th className="px-6 py-4">Plataforma</th>
                                    <th className="px-6 py-4">Seguidores</th>
                                    <th className="px-6 py-4">Alcance</th>
                                    <th className="px-6 py-4">Interacciones</th>
                                    <th className="px-6 py-4 text-right">Crecimiento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <PlatformRow platform="Instagram" followers="54,230" reach="120K" engagement="4.5%" growth="+12%" color="bg-pink-500" />
                                <PlatformRow platform="LinkedIn" followers="12,450" reach="45K" engagement="3.2%" growth="+5%" color="bg-blue-600" />
                                <PlatformRow platform="TikTok" followers="85,120" reach="340K" engagement="6.8%" growth="+24%" color="bg-black border border-white/20" />
                                <PlatformRow platform="Facebook" followers="24,100" reach="15K" engagement="1.5%" growth="-1%" isNegative color="bg-blue-500" />
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}

function MetricCard({ label, value, trend, isNegative, icon: Icon, color, bg }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon className={`w-16 h-16 ${color}`} />
            </div>

            <div className={`w-10 h-10 rounded-xl ${bg}/10 flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>

            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</h3>
            <div className="flex items-end gap-3">
                <span className="text-2xl font-black text-white">{value}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 mb-1
                    ${isNegative ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {isNegative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {trend}
                </span>
            </div>
        </div>
    );
}

function TopPostItem({ title, views, type, rank }) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                ${rank === 1 ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-gray-500'}`}>
                #{rank}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate group-hover:text-indigo-400 transition-colors">{title}</h4>
                <p className="text-xs text-gray-500">{type} • {views} vistas</p>
            </div>
            <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${100 - (rank * 15)}%` }}
                />
            </div>
        </div>
    );
}

function PlatformRow({ platform, followers, reach, engagement, growth, isNegative, color }) {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-xs">{platform[0]}</span>
                </div>
                <span className="font-bold text-white text-sm">{platform}</span>
            </td>
            <td className="px-6 py-4 font-mono text-gray-300">{followers}</td>
            <td className="px-6 py-4 font-mono text-gray-300">{reach}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: engagement.replace('%', '') * 10 + '%' }} />
                    </div>
                    <span className="font-mono text-xs">{engagement}</span>
                </div>
            </td>
            <td className={`px-6 py-4 text-right font-bold text-xs ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>
                {growth}
            </td>
        </tr>
    );
}
