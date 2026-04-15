'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    BarChart3, TrendingUp, DollarSign,
    Users, Globe, Compass,
    PieChart, LineChart, Target,
    Building2, MapPin, Briefcase,
    Zap, AlertTriangle, ShieldCheck,
    ChevronDown, ArrowUpRight, ArrowDownRight,
    BrainCircuit, Info, Lightbulb, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { agencyService } from '@/services/agencyService';

export default function AdminBusinessIntelligence() {
    const [scenRatio, setScenRatio] = useState(1); // Scenario Simulator: 1.0 (Current) to 1.5 (+50%)
    const [loading, setLoading] = useState(true);
    const [financialData, setFinancialData] = useState(null);
    const [scaleData, setScaleData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fin, sc] = await Promise.all([
                    agencyService.getFinancialSummary(),
                    agencyService.getScaleData()
                ]);
                setFinancialData(fin);
                setScaleData(sc);
            } catch (error) {
                console.error("Error fetching BI data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const strategicKpis = useMemo(() => {
        if (!financialData || !scaleData) return [
            { label: "Ingresos Mensuales", value: "-", diff: "0%", isUp: true, icon: DollarSign, color: "emerald" },
            { label: "Margen Promedio", value: "-", diff: "0%", isUp: true, icon: PieChart, color: "indigo" },
            { label: "Carga Operativa", value: "-", diff: "0%", isUp: false, icon: Briefcase, color: "yellow" },
            { label: "CSAT (Satis.)", value: "4.6/5", diff: "0", isUp: false, icon: Users, color: "blue" }
        ];

        const metrics = financialData.metrics;
        return [
            { 
                label: "Ingresos Mensuales", 
                value: `$${(metrics.income * scenRatio).toLocaleString()}`, 
                diff: metrics.income > 0 ? "+100%" : "0%", 
                isUp: true, 
                icon: DollarSign, 
                color: "emerald" 
            },
            { 
                label: "Margen Promedio", 
                value: `${metrics.gross_margin}%`, 
                diff: "+2%", 
                isUp: true, 
                icon: PieChart, 
                color: "indigo" 
            },
            { 
                label: "Carga Operativa", 
                value: `${scaleData?.capacity?.percent || 0}%`, 
                diff: "+5%", 
                isUp: (scaleData?.capacity?.percent || 0) > 85, 
                icon: Briefcase, 
                color: "yellow" 
            },
            { 
                label: "CSAT (Satis.)", 
                value: "4.6/5", 
                diff: "-0.2", 
                isUp: false, 
                icon: Users, 
                color: "blue" 
            }
        ];
    }, [financialData, scaleData, scenRatio]);

    const serviceMargins = [
        { name: "Automatizaciones IA", margin: 78, trend: "+12%", color: "bg-emerald-500" },
        { name: "Planes Médicos Pro", margin: 65, trend: "+5%", color: "bg-blue-500" },
        { name: "Edición Cinematic", margin: 52, trend: "-2%", color: "bg-indigo-500" },
        { name: "Fotografía Onsite", margin: 42, trend: "-8%", color: "bg-yellow-500" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* STRATEGIC HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Compass className="w-32 h-32 text-indigo-500" />
                </div>
                <div className="relative z-10 text-left">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Compass className="w-8 h-8 text-indigo-500" /> Inteligencia Empresarial (BI)
                    </h2>
                    <p className="text-gray-400 text-sm font-medium italic">Dirección Estratégica & Decisión Basada en Datos</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Periodo</span>
                        <span className="text-xs font-black text-white uppercase tracking-widest">Q1 2026 (Actual)</span>
                    </div>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {strategicKpis.map((kpi, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-[#0A0A12] border border-white/5 rounded-[32px] p-6 text-left group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${kpi.color}-500/10 text-${kpi.color}-400`}>
                                <kpi.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black ${kpi.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {kpi.diff}
                            </div>
                        </div>
                        <p className="text-3xl font-black text-white leading-tight mb-1">{kpi.value}</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{kpi.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RENTABILIDAD & SERVICIOS */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 relative overflow-hidden text-left">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-400" /> Radar de Rentabilidad
                            </h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">Comparativa de Margen de Contribución por Servicio</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            {serviceMargins.map((svc, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-400">{svc.name}</span>
                                        <span className="text-white">{svc.margin}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${svc.margin}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className={`h-full rounded-full ${svc.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-3xl p-6">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> Insight Estratégico
                            </h4>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                "El margen de <span className="text-emerald-400 font-black">Automatizaciones IA</span> es un <span className="text-white font-black text-sm">78% mayor</span> que el promedio de servicios físicos. Se recomienda pivotar el 40% del presupuesto de marketing hacia soluciones de software para maximizar la utilidad bruta de Q2."
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <button className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                    Ver plan de pivotaje <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SCENARIO SIMULATOR */}
                <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 text-left">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-pink-500" /> Simulador de Escenario
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ajuste de Precios</span>
                                <span className="text-xs font-black text-pink-500">+{Math.round((scenRatio - 1) * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="1.5"
                                step="0.05"
                                value={scenRatio}
                                onChange={(e) => setScenRatio(parseFloat(e.target.value))}
                                className="w-full accent-pink-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Impacto ROI</span>
                                <span className="text-xs font-black text-emerald-400">Excelente</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Riesgo Churn</span>
                                <span className={`text-xs font-black ${scenRatio > 1.3 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {scenRatio > 1.3 ? 'Crítico' : 'Controlado'}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 rounded-3xl bg-pink-500/10 border border-pink-500/20 text-[10px] text-pink-400 font-bold leading-relaxed italic">
                            "Un incremento del 20% en precios médicos pro absorbería el 100% de la inflación operativa manteniendo un margen del 68%."
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SAI CONFIG */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 relative overflow-hidden text-left">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2 mb-8">
                        <BrainCircuit className="w-5 h-5 text-indigo-400" /> Configuración SAI (Smart Alerts)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* RISK THRESHOLDS */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Umbrales de Riesgo
                            </h4>
                            <ThresholdInput label="Caída Interacción (24h)" value={25} unit="%" color="red" />
                            <ThresholdInput label="Silencio Editorial" value={7} unit="Días" color="red" />
                            <ThresholdInput label="Retención Crítica" value={40} unit="%" color="red" />
                        </div>
                        {/* OPPORTUNITY THRESHOLDS */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Disparadores de Oportunidad
                            </h4>
                            <ThresholdInput label="Ratio de Compartidos" value={15} unit="%" color="emerald" />
                            <ThresholdInput label="Potencial de Viralidad" value={85} unit="Score" color="emerald" />
                            <ThresholdInput label="Saves vs Alcance" value={5} unit="%" color="emerald" />
                        </div>
                    </div>
                </div>

                {/* IA DIRECTION BOARD */}
                <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-8 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <BrainCircuit className="w-40 h-40 text-indigo-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                            <BrainCircuit className="w-7 h-7 text-indigo-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white leading-tight uppercase tracking-tight">IA Global Director</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Aggregated Intel Engine</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Escalabilidad Segura</span>
                            </div>
                            <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                "DIIC ZONE está listo para escalar un <span className="text-white font-black underline">25% adicional</span> en carga operativa antes de requerir nueva infraestructura. El próximo punto de quiebre es la capacidad de Renderizado Central."
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="py-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                                Reporte Q1
                            </button>
                            <button className="py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 active:scale-95 transition-all">
                                Auditoría
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DECISION MATRIX */}
            <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-indigo-400" /> Matriz de Decisiones Directivas
                </h3>
                <div className="space-y-4">
                    <DecisionRow
                        type="Contratación"
                        text="Contratar 1 editor Senior en 45 días para evitar cuello de botella en Q2."
                        status="Sugerido"
                        priority="Alta"
                    />
                    <DecisionRow
                        type="Expansión"
                        text="Abrir Nodo Cuenca (Demanda detectada: 12 leads médicos/mes)."
                        status="En estudio"
                        priority="Media"
                    />
                    <DecisionRow
                        type="Servicios"
                        text="Eliminar 'Fotografía Onsite Local' (Bajo margen y alto costo operativo)."
                        status="Urgente"
                        priority="Crítica"
                    />
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function DecisionRow({ type, text, status, priority }) {
    const priorityColors = {
        Crítica: "text-red-400 bg-red-400/10",
        Alta: "text-orange-400 bg-orange-400/10",
        Media: "text-blue-400 bg-blue-400/10"
    };

    return (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all">
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{type}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>{priority}</span>
                </div>
                <p className="text-xs text-gray-300 font-medium">{text}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
                <span className="text-[10px] font-black text-gray-500 uppercase">{status}</span>
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function ThresholdInput({ label, value, unit, color }) {
    const colors = {
        red: "bg-red-500",
        emerald: "bg-emerald-500"
    };
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-left">
                <span className="text-gray-500">{label}</span>
                <span className="text-white">{value}{unit}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colors[color]} opacity-50 transition-all duration-1000`}
                    style={{ width: `${(value / (unit === '%' ? 100 : 30)) * 100}%` }}
                />
            </div>
        </div>
    );
}
