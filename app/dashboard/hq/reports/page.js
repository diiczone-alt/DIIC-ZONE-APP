'use client';

import HQSidebar from '@/components/layout/HQSidebar';
import { 
    BarChart3, TrendingUp, Users, 
    AlertTriangle, PieChart, Calendar,
    Filter, Download, ChevronRight,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white font-sans selection:bg-indigo-500/30">
            <HQSidebar />

            <div className="pl-64 transition-all duration-300">
                <main className="p-8 max-w-[1600px] mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Reportes y Analíticas</h1>
                            <p className="text-gray-400 mt-1">Visión estratégica del rendimiento de la agencia</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10">
                                <Filter className="w-4 h-4" /> Periodo
                            </button>
                            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                                <Download className="w-5 h-5" /> Generar PDF
                            </button>
                        </div>
                    </div>

                    {/* Critical Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <ReportStat label="ROI Mensual" value="+24%" trend="up" />
                        <ReportStat label="Retención" value="92%" trend="up" />
                        <ReportStat label="Costo Operativo" value="$420" trend="down" />
                        <ReportStat label="Margen" value="68%" trend="up" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Income Growth Chart Placeholder */}
                        <div className="bg-[#0A0A15] border border-white/5 p-6 rounded-3xl h-80 flex flex-col group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Crecimiento de Ingresos</h3>
                                <BarChart3 className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div className="flex-1 flex items-end gap-3 pb-2">
                                {[40, 65, 45, 80, 55, 95, 75].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-lg relative group/bar hover:bg-indigo-500/40 transition-all cursor-pointer" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                            ${h * 20}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">
                                <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span>
                            </div>
                        </div>

                        {/* Client Distribution (Pie Placeholder) */}
                        <div className="bg-[#0A0A15] border border-white/5 p-6 rounded-3xl h-80 flex flex-col">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8">Distribución de Clientes</h3>
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="w-48 h-48 rounded-full border-[16px] border-indigo-500/20 border-t-indigo-500 border-r-purple-500 relative flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-white">7</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Activos</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <LegendItem label="Empresas" color="bg-indigo-500" value="71%" />
                                <LegendItem label="Marca Personal" color="bg-purple-500" value="29%" />
                            </div>
                        </div>
                    </div>

                    {/* Client Performance Ranking */}
                    <div className="bg-[#0A0A15] border border-white/5 rounded-3xl overflow-hidden mb-8">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Rendimiento por Cliente</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <RankingRow name="Nova Clínica Santa Anita" score="9.8" workload="Alta" />
                            <RankingRow name="Entre Panas y Parcelas" score="9.2" workload="Media" />
                            <RankingRow name="Dr. Cristian Patiño" score="8.7" workload="Baja" />
                            <RankingRow name="Innovacorp" score="4.2" workload="Nula" alert />
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

function ReportStat({ label, value, trend }) {
    return (
        <div className="bg-[#0A0A15] border border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
            <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-black text-white">{value}</span>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend === 'up' ? '+8%' : '-2%'}
                </div>
            </div>
        </div>
    );
}

function LegendItem({ label, color, value }) {
    return (
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-xs font-bold text-white">{value}</span>
        </div>
    );
}

function RankingRow({ name, score, workload, alert = false }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${alert ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-indigo-400'}`}>
                    {score}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Carga: {workload}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
        </div>
    );
}
