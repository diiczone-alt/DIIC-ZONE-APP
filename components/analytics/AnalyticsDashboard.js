'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Calendar, ChevronDown, Download, TrendingUp, Users, Eye, MousePointer, Activity, Zap, BrainCircuit, Smartphone, Monitor } from 'lucide-react';
import GrowthChart from './GrowthChart';
import PredictiveInsights from './PredictiveInsights';
import DeviceBreakdown from './DeviceBreakdown';
import ContentPerformance from './ContentPerformance';

export default function AnalyticsDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('Last 30 Days');

    return (
        <div className="min-h-screen bg-[#050511] p-6 md:p-8 space-y-8 text-white relative overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">

                {/* HEADER & CONTROLS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                <Activity className="w-3 h-3 inline mr-1" /> Live Data Stream
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                            Centro de Comando <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Analítico</span>
                        </h1>
                        <p className="text-gray-400 font-light mt-2 max-w-2xl">
                            Visualización estratégica de rendimiento. Datos en tiempo real procesados por DIIC Intelligence.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A24] border border-white/10 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {dateRange}
                            <ChevronDown className="w-3 h-3 text-gray-500" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-sm font-bold transition-colors shadow-lg shadow-cyan-500/20">
                            <Download className="w-4 h-4" /> Exportar Reporte
                        </button>
                    </div>
                </div>

                {/* HUD SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard title="Alcance Total" value="842.5K" change="+12.5%" icon={Eye} color="cyan" />
                    <SummaryCard title="Interacciones" value="124.2K" change="+8.2%" icon={MousePointer} color="purple" />
                    <SummaryCard title="Conversión" value="3.8%" change="+1.2%" icon={Zap} color="yellow" />
                    <SummaryCard title="Seguidores" value="42.8K" change="+240" icon={Users} color="green" />
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* MAIN CHART */}
                        <GrowthChart />

                        {/* CONTENT PERFORMANCE */}
                        <ContentPerformance />
                    </div>

                    {/* RIGHT COLUMN (1/3) */}
                    <div className="space-y-6">
                        {/* AI PREDICTIONS */}
                        <PredictiveInsights />

                        {/* DEVICE BREAKDOWN */}
                        <DeviceBreakdown />
                    </div>
                </div>

            </div>
        </div>
    );
}

function SummaryCard({ title, value, change, icon: Icon, color }) {
    const colors = {
        cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
        purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
        yellow: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
        green: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl border ${colors[color].split(' ')[1]} ${colors[color].split(' ')[2]} relative overflow-hidden group`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${colors[color].split(' ')[0]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/5 ${colors[color].split(' ')[0]}`}>
                    <TrendingUp className="w-3 h-3" /> {change}
                </div>
            </div>
            <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
                <div className="text-3xl font-black text-white tracking-tight">{value}</div>
            </div>
        </motion.div>
    );
}
