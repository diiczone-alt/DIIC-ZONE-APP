'use client';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, PieChart, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RoiDashboard() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Inversión Publicidad"
                    value="$500"
                    trend="+12%"
                    trendUp={false} // Spending increased (bad? or good for scaling? context dependent, usually red if cost up)
                    icon={DollarSign}
                    color="text-blue-400"
                    bg="from-blue-500/10"
                />
                <MetricCard
                    title="Ventas Generadas"
                    value="$2,300"
                    trend="+45%"
                    trendUp={true}
                    icon={TrendingUp}
                    color="text-green-400"
                    bg="from-green-500/10"
                />
                <MetricCard
                    title="ROI Total"
                    value="360%"
                    trend="+15%"
                    trendUp={true}
                    icon={PieChart}
                    color="text-purple-400"
                    bg="from-purple-500/10"
                />
                <MetricCard
                    title="Costo por Lead"
                    value="$2.10"
                    trend="-5%"
                    trendUp={true} // Cost down is good
                    icon={Target}
                    color="text-orange-400"
                    bg="from-orange-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Source Breakdown */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F0F1A] border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" /> Fuente de Conversión
                    </h3>

                    <div className="space-y-6">
                        <SourceBar label="Instagram Ads" value={1200} total={2300} color="bg-gradient-to-r from-pink-500 to-purple-500" icon="📸" />
                        <SourceBar label="WhatsApp Business" value={600} total={2300} color="bg-gradient-to-r from-green-500 to-emerald-400" icon="💬" />
                        <SourceBar label="TikTok" value={500} total={2300} color="bg-gradient-to-r from-black to-gray-700 border border-white/20" icon="🎵" />
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <h4 className="text-sm font-bold text-blue-400 mb-2">Insight de Inteligencia</h4>
                        <p className="text-sm text-gray-400">
                            Tu canal más rentable es <span className="text-white font-bold">Instagram</span>, generando el <span className="text-white font-bold">52%</span> de tus ingresos con un ROI de 4.2x. Considera aumentar el presupuesto aquí.
                        </p>
                    </div>
                </div>

                {/* Automation Funnel Status */}
                <div className="p-6 rounded-2xl bg-[#0F0F1A] border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">Embudo Automático</h3>

                    <div className="relative space-y-8 pl-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                        <FunnelStep title="Anuncio Visto" value="12,400" label="Impresiones" color="bg-blue-500" />
                        <FunnelStep title="Click / Mensaje" value="850" label="Interacciones" color="bg-purple-500" />
                        <FunnelStep title="Lead Calificado" value="120" label="En CRM" color="bg-orange-500" />
                        <FunnelStep title="Venta Cerrada" value="34" label="Conversiones (28%)" color="bg-green-500" isLast />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, trendUp, icon: Icon, color, bg }) {
    return (
        <div className={`p-5 rounded-xl bg-gradient-to-br ${bg} to-transparent border border-white/5 hover:border-white/10 transition-all`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                    {trend}
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
            </div>
            <h4 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h4>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
    );
}

function SourceBar({ label, value, total, color, icon }) {
    const percentage = Math.round((value / total) * 100);

    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                    <span className="text-base">{icon}</span> {label}
                </span>
                <span className="text-white font-bold">${value.toLocaleString()} ({percentage}%)</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );
}

function FunnelStep({ title, value, label, color, isLast }) {
    return (
        <div className="relative">
            <div className={`absolute -left-[27px] w-3 h-3 rounded-full border-2 border-[#0F0F1A] ${color} z-10 box-content`} />
            {isLast && (
                <div className={`absolute -left-[31px] -bottom-1 w-5 h-5 rounded-full ${color} opacity-20 animate-ping`} />
            )}
            <div>
                <h5 className={`font-bold text-sm ${isLast ? 'text-green-400' : 'text-white'}`}>{title}</h5>
                <div className="flex justify-between items-baseline mt-1">
                    <span className="text-xl font-bold text-white">{value}</span>
                    <span className="text-xs text-gray-500">{label}</span>
                </div>
            </div>
        </div>
    );
}
