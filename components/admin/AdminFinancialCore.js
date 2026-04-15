import { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, PieChart, BarChart3,
    ArrowUpRight, ArrowDownRight, Wallet,
    CreditCard, Users, Briefcase, Cpu,
    ShieldCheck, Calendar, Filter, Download,
    Target, Zap, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { agencyService } from '@/services/agencyService';

export default function AdminFinancialCore() {
    const [activeTab, setActiveTab] = useState('revenue');
    const [financial, setFinancial] = useState(null);
    const [scale, setScale] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [fin, sc] = await Promise.all([
                agencyService.getFinancialSummary(),
                agencyService.getScaleData()
            ]);
            setFinancial(fin);
            setScale(sc);
            setLoading(false);
        };
        fetchData();
    }, []);

    const metrics = financial?.metrics || { income: 0, variable_costs: 0, gross_profit: 0, gross_margin: 0 };
    const netProfit = scale?.net_profit || 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* FINANCIAL HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <Wallet className="w-7 h-7 text-emerald-500" /> Núcleo Financiero Admin
                    </h2>
                    <p className="text-gray-400 text-sm">Control total de flujo, sueldos y rentabilidad de DIIC ZONE</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => toast.info("Generando reporte...")} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-black hover:bg-emerald-400 transition-all">
                        <Filter className="w-4 h-4" /> Periodo: Real-Time
                    </button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FinCard label="Ingresos Totales (MRR)" value={`$${metrics.income?.toLocaleString()}`} trend="Real" up={true} icon={DollarSign} color="emerald" />
                <FinCard label="Costos Operativos" value={`$${metrics.variable_costs?.toLocaleString()}`} trend="Production" up={false} icon={ArrowDownRight} color="red" />
                <FinCard label="Utilidad Neta Real" value={`$${netProfit?.toLocaleString()}`} trend="Net" up={netProfit > 0} icon={TrendingUp} color="blue" />
                <FinCard label="Margen Bruto" value={`${metrics.gross_margin}%`} trend="Target 50%" up={metrics.gross_margin >= 50} icon={PieChart} color="purple" />
            </div>

            {/* MODULE NAVIGATION */}
            <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <TabBtn id="revenue" label="Ingresos" active={activeTab} setter={setActiveTab} />
                <TabBtn id="distribution" label="Distribución" active={activeTab} setter={setActiveTab} />
                <TabBtn id="costs" label="Costos" active={activeTab} setter={setActiveTab} />
                <TabBtn id="profit" label="Rentabilidad" active={activeTab} setter={setActiveTab} />
                <TabBtn id="projection" label="Proyección" active={activeTab} setter={setActiveTab} />
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'revenue' && <RevenueModule key="revenue" data={financial?.transactions || []} />}
                    {activeTab === 'distribution' && <DistributionModule key="dist" />}
                    {activeTab === 'costs' && <CostsModule key="costs" scale={scale} />}
                    {activeTab === 'profit' && <ProfitModule key="profit" metrics={metrics} scale={scale} />}
                    {activeTab === 'projection' && <ProjectionModule key="proj" scale={scale} />}
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- SUB-MODULES ---

function RevenueModule() {
    const revenueData = [
        { type: "Suscripción", client: "Dr. Patiño", plan: "Scale Plan", amount: "$2,500", date: "24 Ene", status: "Pagado" },
        { type: "Servicio Único", client: "Nova Clínica", plan: "Full Branding", amount: "$4,200", date: "20 Ene", status: "Pagado" },
        { type: "Servicio Nodo", client: "AgroFértil", plan: "Grabación Campo", amount: "$1,800", date: "15 Ene", status: "Pendiente" },
        { type: "Suscripción", client: "Inmobiliaria Elite", plan: "Content Plan", amount: "$3,100", date: "12 Ene", status: "Pagado" },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" /> Registro de Ingresos
                </h3>
                <div className="space-y-3">
                    <div className="grid grid-cols-5 text-[10px] font-bold text-gray-500 uppercase px-4 pb-2 border-b border-white/5">
                        <div>Tipo / Cliente</div>
                        <div>Plan / Servicio</div>
                        <div className="text-right">Monto</div>
                        <div className="text-center">Fecha</div>
                        <div className="text-right">Estado</div>
                    </div>
                    {revenueData.map((item, i) => (
                        <div key={i} className="grid grid-cols-5 items-center p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5">
                            <div>
                                <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{item.client}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase">{item.type}</div>
                            </div>
                            <div className="text-sm text-gray-300">{item.plan}</div>
                            <div className="text-sm font-black text-white text-right">{item.amount}</div>
                            <div className="text-xs text-gray-500 text-center">{item.date}</div>
                            <div className="flex justify-end">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${item.status === 'Pagado' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                    {item.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function DistributionModule() {
    const splits = [
        { label: "Producción Creativa", value: "25%", amount: "$4,612", desc: "Edición, Diseño, Guiones", color: "blue", icon: Briefcase },
        { label: "Nodo Territorial", value: "15%", amount: "$2,767", desc: "Producción local, eventos", color: "indigo", icon: Users },
        { label: "Tecnología / IA", value: "20%", amount: "$3,690", desc: "Servidores, licencias, bots", color: "purple", icon: Cpu },
        { label: "Operación & Admin", value: "10%", amount: "$1,845", desc: "Soporte, impuestos, legal", color: "pink", icon: ShieldCheck },
        { label: "Utilidad DIIC ZONE", value: "30%", amount: "$5,535", desc: "Ganancia real acumulada", color: "emerald", icon: DollarSign },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {splits.map((s, i) => (
                    <div key={i} className={`p-6 rounded-3xl border border-white/10 bg-[#0A0A12] relative overflow-hidden group hover:border-${s.color}-500/30 transition-all`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-500/5 rounded-full blur-3xl`} />
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl bg-${s.color}-500/10 text-${s.color}-400`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-white">{s.value}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{s.amount}</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold text-white">{s.label}</div>
                            <div className="text-xs text-gray-500">{s.desc}</div>
                        </div>
                        <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: s.value }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full bg-${s.color}-500`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <PieChart className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
                <h4 className="text-lg font-bold text-white mb-2">Motor de Reparto Automático Activo</h4>
                <p className="text-sm text-gray-500 max-w-lg mx-auto">
                    Cada pago recibido se liquida internamente según el modelo DIIC ZONE PRO.
                    Las carteras de Nodos y Creativos se actualizan en tiempo real.
                </p>
            </div>
        </motion.div>
    );
}

function CostsModule() {
    const costs = [
        { item: "Pago Fausto (Senior Editor)", category: "Producción", amount: "$1,200", status: "Liquidado", type: "out" },
        { item: "Suscripción Supabase / AWS", category: "Tecnología", amount: "$350", status: "Deducido", type: "out" },
        { item: "Pago CM Agro (Community)", category: "Producción", amount: "$850", status: "Pendiente", type: "pending" },
        { item: "Licencia Adobe Teams", category: "Tecnología", amount: "$220", status: "Liquidado", type: "out" },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-red-400" /> Salida de Capital
                </h3>
                <div className="space-y-3">
                    {costs.map((c, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-transparent hover:border-red-500/20 transition-all">
                            <div>
                                <div className="text-sm font-bold text-white">{c.item}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase">{c.category}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-red-400">-{c.amount}</div>
                                <div className="text-[10px] text-gray-500">{c.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center text-center">
                <div className="mb-6">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Costo de Operación vs Ingreso</div>
                    <div className="text-5xl font-black text-white">22.7%</div>
                </div>
                <p className="text-sm text-gray-400 px-6">
                    El sistema mantiene un ratio saludable de costos. Cada dólar invertido en tecnología genera $5.2 en ingresos por escalabilidad.
                </p>
                <button className="mt-8 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all">
                    Generar Reporte de Gastos Detallado
                </button>
            </div>
        </motion.div>
    );
}

function ProfitModule() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="ROI de Nodo Promedio" value="12X" color="emerald" />
                <StatCard label="Churn Rate" value="1.2%" color="indigo" />
                <StatCard label="LTV Promedio" value="$12.4k" color="blue" />
                <StatCard label="CAC (Costo Adquisición)" value="$420" color="purple" />
            </div>

            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-white mb-6">Servicios Más Rentables (Ranking)</h3>
                <div className="space-y-4">
                    <RankRow label="Automatizaciones IA / SaaS" value="92%" width="w-[92%]" color="emerald" />
                    <RankRow label="Websites & Landing Pages" value="85%" width="w-[85%]" color="blue" />
                    <RankRow label="Estrategia & Social Media" value="68%" width="w-[68%]" color="indigo" />
                    <RankRow label="Videos Corporativos" value="55%" width="w-[55%]" color="purple" />
                </div>
            </div>
        </motion.div>
    );
}

function ProjectionModule({ scale }) {
    if (!scale) return null;

    const breakEvenPercent = Math.min((scale.net_profit / scale.fixed_total) * 100 + 100, 100);
    const capacityPercent = scale.capacity?.percent || 0;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    {/* BREAK-EVEN CALCULATOR */}
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <Target className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Simulador de Escala</h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Punto de Equilibrio & Payroll</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Costo Fijo Mensual (Payroll + SW)</div>
                                <div className="text-3xl font-black text-white">${scale.fixed_total?.toLocaleString()}</div>
                                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Break-even MRR: <span className="text-emerald-500">${scale.break_even?.toLocaleString()}</span></p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Salud del Punto de Equilibrio</div>
                                <div className="flex items-end gap-2">
                                    <div className={`text-3xl font-black ${scale.net_profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {scale.net_profit >= 0 ? 'Operativo' : 'Infragasto'}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-bold mb-1">({Math.round(breakEvenPercent)}%)</div>
                                </div>
                                <div className="mt-4 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${breakEvenPercent}%` }} className={`h-full ${scale.net_profit >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0A0A12]/50 border border-white/5 p-6 rounded-3xl">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-500" /> Gatillos de Contratación
                            </h4>
                            <div className="space-y-3">
                                <div className={`flex justify-between items-center p-3 rounded-2xl border ${capacityPercent > 80 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-transparent'}`}>
                                    <span className="text-[10px] font-bold text-gray-300">Saturación de Equipo Actual</span>
                                    <span className={`text-xs font-black ${capacityPercent > 80 ? 'text-rose-500' : 'text-white'}`}>{capacityPercent}%</span>
                                </div>
                                {capacityPercent > 70 ? (
                                    <p className="text-[10px] text-rose-400 font-bold italic px-2">
                                        ⚠️ Advertencia: Estás llegando al límite de producción. Recomendado abrir vacante de Editor o CM.
                                    </p>
                                ) : (
                                    <p className="text-[10px] text-gray-500 font-bold italic px-2">
                                        ✓ Capacidad óptima. Puedes absorber hasta {(scale.capacity?.total - scale.capacity?.used)} proyectos más.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* GROWTH MILESTONES */}
                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Hitos de Crecimiento</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Scale Stage 1</div>
                                <div className="text-sm font-bold text-white mb-1">Nómina de 11 miembros</div>
                                <p className="text-[10px] text-gray-500">Break-even superado. Foco en captación masiva.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50">
                                <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Scale Stage 2</div>
                                <div className="text-sm font-bold text-gray-400 mb-1">Nómina de 20+ miembros</div>
                                <p className="text-[10px] text-gray-600">Requerido MRR de $35k+</p>
                            </div>
                        </div>

                        <div className="pt-4 mt-auto">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Valuación DIIC ZONE</div>
                            <div className="text-3xl font-black text-white">$250k <span className="text-xs text-indigo-500">(PRE-SEED)</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- HELPER UI ---

function FinCard({ label, value, trend, up, icon: Icon, color }) {
    const colors = {
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        red: "bg-red-500/10 text-red-400 border-red-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-400/20",
    };

    return (
        <div className="bg-[#0A0A12] border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend}
                </div>
            </div>
            <div className="text-2xl font-black text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</div>
        </div>
    );
}

function TabBtn({ id, label, active, setter }) {
    const isActive = active === id;
    return (
        <button
            onClick={() => setter(id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {label}
        </button>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        emerald: "text-emerald-400",
        indigo: "text-indigo-400",
        blue: "text-blue-400",
        purple: "text-purple-400",
    };
    return (
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
            <div className={`text-2xl font-black ${colors[color]} mb-1`}>{value}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
        </div>
    );
}

function RankRow({ label, value, width, color }) {
    const colors = {
        emerald: "bg-emerald-500",
        indigo: "bg-indigo-500",
        blue: "bg-blue-500",
        purple: "bg-purple-500",
    };
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-400">{label}</span>
                <span className="text-white">{value}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: value }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={`h-full ${colors[color]}`}
                />
            </div>
        </div>
    );
}

function ProjMetric({ label, value }) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-2xl font-black text-white mb-1">{value}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
        </div>
    );
}
