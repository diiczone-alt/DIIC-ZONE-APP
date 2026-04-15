'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, Users, TrendingUp, PieChart, Activity,
    ArrowRight, MessageCircle, Video, Image as ImageIcon,
    Target, Zap, BarChart3, ChevronRight, Rocket,
    Clock
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';

export default function CommercialIntelligenceDashboard({ onOpenLead }) {
    const [loading, setLoading] = useState(true);
    const [commercialData, setCommercialData] = useState(null);

    useEffect(() => {
        const loadCRMData = async () => {
            try {
                const data = await agencyService.getCommercialSummary();
                setCommercialData(data);
            } catch (error) {
                console.error("CRM dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCRMData();
    }, []);

    const metrics = commercialData?.metrics || {
        sales_month: 0,
        leads_total: 0,
        roi_actual: 0,
        closing_rate: 0,
        ad_spend: 0
    };

    const funnel = commercialData?.funnel || [];
    const recentSales = commercialData?.recent_sales || [];
    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Activity className="w-6 h-6" />
                    </span>
                    Centro de Inteligencia Comercial
                </h2>
                <p className="text-gray-400 mt-2 ml-12">
                    Aquí se conectan tus leads, tus ventas y el dinero que genera tu contenido.
                </p>
            </div>

            {/* BLOCK 1: Executive Summary */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    title="Ventas del Mes"
                    value={loading ? "..." : `$${metrics.sales_month.toLocaleString()}`}
                    icon={DollarSign}
                    color="text-green-400"
                    bg="from-green-500/10"
                    trend="+15% vs mes ant."
                />
                <SummaryCard
                    title="Leads Generados"
                    value={loading ? "..." : metrics.leads_total.toString()}
                    icon={Users}
                    color="text-blue-400"
                    bg="from-blue-500/10"
                    trend="+12 nuevos hoy"
                />
                <SummaryCard
                    title="ROI Actual"
                    value={loading ? "..." : `${metrics.roi_actual}%`}
                    icon={TrendingUp}
                    color="text-purple-400"
                    bg="from-purple-500/10"
                    trend="Excelente"
                    footer={loading ? "Calculando..." : `Tus campañas generan ${(metrics.roi_actual / 100).toFixed(1)}x lo que inviertes.`}
                />
                <SummaryCard
                    title="Tasa de Cierre"
                    value={loading ? "..." : `${metrics.closing_rate}%`}
                    icon={PieChart}
                    color="text-orange-400"
                    bg="from-orange-500/10"
                    trend="+2% mejora"
                />
            </section>

            {/* BLOCK 2: Visual Sales Funnel */}
            <section className="bg-[#0A0A12] rounded-2xl border border-white/5 p-6 overflow-hidden relative">
                <h3 className="text-lg font-bold text-white mb-6">Funnel de Ventas en Tiempo Real</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                    <FunnelStage label="Leads Entrantes" value={funnel.find(s => s.id === 'lead')?.items || 0} color="bg-blue-500" width="w-full md:w-1/4" />
                    <ArrowConnector />
                    <FunnelStage label="Conversaciones" value={funnel.find(s => s.id === 'qualifying')?.items || 0} color="bg-purple-500" width="w-full md:w-[22%]" />
                    <ArrowConnector />
                    <FunnelStage label="Propuestas" value={funnel.find(s => s.id === 'offer')?.items || 0} color="bg-orange-500" width="w-full md:w-[20%]" />
                    <ArrowConnector />
                    <FunnelStage label="Ventas Cerradas" value={funnel.find(s => s.id === 'closing')?.items || 0} color="bg-green-500" width="w-full md:w-[15%]" isFinal />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BLOCK 4: ROI Analysis (Main Card) */}
                <div className="lg:col-span-2 bg-[#0A0A12] rounded-2xl border border-white/5 p-6 md:p-8">
                    <div className="flex justify-between items-start mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" /> Análisis de Rentabilidad (ROI)
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                            Rentable
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <RoiRow label="Inversión en Publicidad" value={`$${metrics.ad_spend.toLocaleString()}.00`} />
                            <RoiRow label="Ventas Generadas" value={`$${metrics.sales_month.toLocaleString()}.00`} highlight />
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl border border-purple-500/20">
                            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">ROI Total</span>
                            <span className="text-5xl font-bold text-white mt-2">{loading ? "..." : `${metrics.roi_actual}%`}</span>
                            <span className="text-purple-400 text-sm font-bold mt-1">+{ (metrics.roi_actual / 100).toFixed(1) }x Rendimiento</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                        <div className="p-4 rounded-xl bg-white/5">
                            <span className="text-gray-500 text-xs uppercase">Costo por Lead</span>
                            <div className="text-xl font-bold text-white mt-1">$2.10</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5">
                            <span className="text-gray-500 text-xs uppercase">Costo por Cliente</span>
                            <div className="text-xl font-bold text-white mt-1">$31.00</div>
                        </div>
                    </div>
                </div>

                {/* BLOCK 5: Sales Source */}
                <div className="bg-[#0A0A12] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">¿Quién vende más?</h3>
                    <div className="space-y-5">
                        <SourceRow channel="Instagram" sales="$1,200" clients="7" icon="📸" color="text-pink-500" progress={80} />
                        <SourceRow channel="WhatsApp" sales="$600" clients="5" icon="💬" color="text-green-500" progress={45} />
                        <SourceRow channel="TikTok" sales="$500" clients="4" icon="🎵" color="text-white" progress={30} />
                    </div>
                    <div className="mt-8 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                        <p className="text-sm text-blue-300">
                            <strong className="text-white">Insight:</strong> Instagram te trae clientes de mayorticket promedio ($171 vs $120).
                        </p>
                    </div>
                </div>
            </div>

            {/* BLOCK 3: Sales Table */}
            <section className="bg-[#0A0A12] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-400" /> Servicios Vendidos (Últimos 30 días)
                    </h3>
                    <button className="text-xs font-bold text-blue-400 hover:text-white transition-colors">Ver Todo</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-xs text-gray-400 uppercase">
                            <tr>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Servicio</th>
                                <th className="p-4">Valor</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Fuente</th>
                                <th className="p-4">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {recentSales.map((sale, i) => (
                                <TableRow 
                                    key={i}
                                    client={sale.name} 
                                    service={sale.plan || "Servicio"} 
                                    value={`$${(Number(sale.price) || 0).toLocaleString()}`} 
                                    date="Activo" 
                                    source="Directo" 
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* BLOCK 8: DIGITAL MATURITY & SCALING PIPELINE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-[#0A0A12] border border-white/5 rounded-3xl p-8 text-left">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-400" /> Segmentación de Madurez
                    </h3>
                    <div className="space-y-6">
                        <MaturityLevel label="Nivel 1: Inicio" count={12} color="bg-blue-500" total={40} />
                        <MaturityLevel label="Nivel 2: Presencia" count={15} color="bg-amber-500" total={40} />
                        <MaturityLevel label="Nivel 3: Marca" count={8} color="bg-emerald-500" total={40} />
                        <MaturityLevel label="Nivel 4: Autoridad" count={4} color="bg-purple-500" total={40} />
                        <MaturityLevel label="Nivel 5: Escalado" count={1} color="bg-indigo-600" total={40} />
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/5 rounded-3xl p-8 text-left">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" /> Pipeline de Escalamiento
                        </h3>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Oportunidades de Up-sell</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] text-gray-500 uppercase font-black border-b border-white/5">
                                    <th className="pb-4 pr-4">Cliente</th>
                                    <th className="pb-4 pr-4 text-center">Nivel Actual</th>
                                    <th className="pb-4 pr-4">Sugerencia de Salto</th>
                                    <th className="pb-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-bold">
                                <ScalingRow client="Burger King Local" level={2} suggest="Automatización CRM" color="text-amber-500" />
                                <ScalingRow client="Inmobiliaria Elite" level={4} suggest="Pauta Ads Escalada" color="text-purple-500" />
                                <ScalingRow client="Nova Clínica" level={3} suggest="Setup AI Agents" color="text-emerald-500" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BLOCK 6: Hot Leads (AI) */}
                <div className="bg-gradient-to-br from-[#0F0F1A] to-blue-900/10 rounded-2xl border border-blue-500/20 p-6 relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" /> Leads Calientes (IA)
                    </h3>
                    <div className="space-y-4 relative z-10 text-left">
                        <HotLeadRow name="Ana Torres" channel="Instagram" interaction="6 mensajes" prob="78%" onClick={onOpenLead} />
                        <HotLeadRow name="Carlos M." channel="WhatsApp" interaction="Solicitó Cotización" prob="83%" onClick={onOpenLead} />
                        <HotLeadRow name="Empresa Tech" channel="Email" interaction="Abrió Propuesta" prob="92%" onClick={onOpenLead} />
                    </div>
                </div>

                {/* BLOCK 7: Content Relation */}
                <div className="bg-[#0A0A12] rounded-2xl border border-white/5 p-6 text-left">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Video className="w-5 h-5 text-purple-400" /> Impacto de Contenido
                    </h3>
                    <div className="space-y-4">
                        <ContentRow title="Reel 'Cirugía Láser'" sales="3 clientes" revenue="$2,400" icon={Video} color="text-pink-500" />
                        <ContentRow title="Carrusel 'Tips Dentales'" sales="1 cliente" revenue="$350" icon={ImageIcon} color="text-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components (Internal for cohesion) ---

function SummaryCard({ title, value, icon: Icon, color, bg, trend, footer }) {
    return (
        <div className={`p-5 rounded-2xl bg-gradient-to-br ${bg} to-transparent border border-white/5 hover:border-white/10 transition-all group`}>
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-xl bg-[#050510] border border-white/5 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</div>
            <div className="text-2xl font-bold text-white mb-2">{value}</div>
            {footer && <div className="text-xs text-purple-300 font-medium mt-2 pt-2 border-t border-white/5">{footer}</div>}
            {!footer && <div className="text-xs text-gray-500">{trend}</div>}
        </div>
    );
}

function FunnelStage({ label, value, color, width, isFinal }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${width} p-4 rounded-xl bg-white/5 border border-white/5 relative group cursor-pointer hover:bg-white/10 transition-all`}
        >
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${color}`}></div>
            <div className="pl-3">
                <div className="text-xs text-gray-400 uppercase font-bold mb-1">{label}</div>
                <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{value}</div>
            </div>
            {isFinal && (
                <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
            )}
        </motion.div>
    );
}

function ArrowConnector() {
    return (
        <div className="hidden md:block text-gray-600">
            <ArrowRight className="w-5 h-5" />
        </div>
    );
}

function RoiRow({ label, value, highlight }) {
    return (
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className={`font-bold text-lg ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</span>
        </div>
    );
}

function SourceRow({ channel, sales, clients, icon, color, progress }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="font-bold text-white">{channel}</span>
                </div>
                <div className="text-right">
                    <div className={`font-bold ${color}`}>{sales}</div>
                    <div className="text-xs text-gray-500">{clients} clientes</div>
                </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}

function TableRow({ client, service, value, date, source }) {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4 font-bold text-white">{client}</td>
            <td className="p-4 text-gray-300">{service}</td>
            <td className="p-4 font-bold text-green-400">{value}</td>
            <td className="p-4 text-gray-500">{date}</td>
            <td className="p-4 text-white">
                <span className="flex items-center gap-1">
                    {source.includes('Instagram') ? '📸' : source.includes('WhatsApp') ? '💬' : '🌐'} {source}
                </span>
            </td>
            <td className="p-4">
                <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                    ✔ Pagado
                </span>
            </td>
        </tr>
    );
}

function HotLeadRow({ name, channel, interaction, prob, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xs text-white border border-white/10">
                    {name.substring(0, 2)}
                </div>
                <div>
                    <div className="font-bold text-white text-sm">{name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                        {channel === 'Instagram' && <span className="text-pink-400">IG</span>}
                        {channel === 'WhatsApp' && <span className="text-green-400">WA</span>}
                        • {interaction}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm font-bold text-yellow-400">{prob}</div>
                <button className="text-[10px] uppercase font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Priorizar
                </button>
            </div>
        </div>
    );
}

function ContentRow({ title, sales, revenue, icon: Icon, color }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-[#0F0F1A]">
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="font-bold text-white text-sm">{title}</div>
                <div className="text-xs text-gray-400 mt-0.5">Generó: <span className="text-white font-bold">{revenue}</span></div>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-300 border border-white/10">
                {sales}
            </div>
        </div>
    );
}

function MaturityLevel({ label, count, color, total }) {
    const percentage = (count / total) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>{label}</span>
                <span className="text-white">{count} ({Math.round(percentage)}%)</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function ScalingRow({ client, level, suggest, color }) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td className="py-4 pr-4">
                <div className="text-white">{client}</div>
            </td>
            <td className="py-4 pr-4 text-center">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/5 ${color}`}>
                    NVL {level}
                </span>
            </td>
            <td className="py-4 pr-4">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-tight">{suggest}</div>
            </td>
            <td className="py-4 text-right">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500 hover:text-white transition-all text-gray-400 group-hover:scale-110">
                    <Rocket className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}
