'use client';

import { useState } from 'react';
import {
    LayoutDashboard, Users, Activity, AlertTriangle, DollarSign,
    TrendingUp, ShieldAlert, Cpu, Globe, Power, BarChart2,
    PieChart, Clock, MessageSquare, Briefcase, Zap, Lock,
    CheckCircle, XCircle, MoreVertical, Search, FileText,
    BrainCircuit, Target, Scale, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const MASTER_STATS = [
    { label: 'Clientes Activos', value: '42', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/20' },
    { label: 'Ingresos Mes', value: '$24.5k', change: '+8%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
    { label: 'Proyectos Curso', value: '18', change: '-2%', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/20' },
    { label: 'Riesgos Activos', value: '3', change: '⚠️', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/20' },
];

const DEPARTMENTS = [
    { id: 'video', name: 'Video Promocional', status: 'critical', load: 92, team: 4 },
    { id: 'design', name: 'Diseño Gráfico', status: 'heavy', load: 78, team: 6 },
    { id: 'social', name: 'Community Manager', status: 'optimal', load: 45, team: 3 },
    { id: 'audio', name: 'Audio Production', status: 'optimal', load: 30, team: 2 },
    { id: 'dev', name: 'Web Development', status: 'heavy', load: 65, team: 2 },
];

const ALERTS = [
    { id: 1, type: 'delay', msg: 'Retraso crítico: Campaña Nike > 24h', severity: 'critical', time: '2h ago' },
    { id: 2, type: 'margin', msg: 'Margen bajo en Proyecto #451 (<15%)', severity: 'high', time: '4h ago' },
    { id: 3, type: 'client', msg: 'Cliente Inactivo: TechSolutions (30 días)', severity: 'medium', time: '5h ago' },
];

const FINANCIAL_INSIGHTS = [
    { service: 'Video Ads', profit: '68%', revenue: '$12.5k', status: 'star' },
    { service: 'Branding', profit: '55%', revenue: '$5.2k', status: 'good' },
    { service: 'Web Dev', profit: '30%', revenue: '$4.1k', status: 'review' },
    { service: 'Hosting', profit: '12%', revenue: '$0.8k', status: 'drain' },
];

const SCALING_QUESTIONS = [
    { q: '¿Podemos aceptar más clientes?', a: 'Sí, en Diseño y CM.', type: 'positive' },
    { q: '¿A qué ritmo?', a: 'Moderado (2-3/mes). Video está saturado.', type: 'warning' },
    { q: '¿Dónde contratar?', a: 'Urgente: Editor de Video Senior.', type: 'urgent' },
];

export default function GovernanceDashboard() {
    const [showRedButton, setShowRedButton] = useState(false);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-600/20 rounded-lg text-red-500 border border-red-500/30">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-wide">GOBERNANZA & CONTROL</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cerebro Central DIIC ZONE</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        SYSTEM OPTIMAL
                    </div>
                    <button
                        onClick={() => setShowRedButton(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-900/40 flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Power className="w-4 h-4" /> PANEL DE EMERGENCIA
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto space-y-8 pb-20">

                    {/* 1. MASTER PANEL (STATS) */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {MASTER_STATS.map((stat, i) => (
                            <div key={i} className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                                    <span className={`text-xs font-bold ${stat.label === 'Riesgos Activos' ? 'text-red-400' : 'text-green-400'}`}>{stat.change}</span>
                                </div>
                                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: OPS & ALERTS */}
                        <section className="lg:col-span-2 space-y-8">

                            {/* 2. OPERATION MAP */}
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-500" /> Mapa de Operación (Tiempo Real)
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {DEPARTMENTS.map(dept => (
                                        <div key={dept.id} className="bg-[#151520] border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full shadow-lg shadow-current ${dept.status === 'optimal' ? 'bg-green-500 text-green-500' : dept.status === 'heavy' ? 'bg-yellow-500 text-yellow-500' : 'bg-red-500 text-red-500 animate-pulse'}`} />
                                                <div>
                                                    <h3 className="text-white font-bold">{dept.name}</h3>
                                                    <p className="text-xs text-gray-500">{dept.team} Creativos Activos</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${dept.load > 85 ? 'text-red-500' : dept.load > 70 ? 'text-yellow-500' : 'text-white'}`}>{dept.load}%</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold">Carga</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. INTELLIGENT ALERTS */}
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-500" /> Alertas del Sistema
                                </h2>
                                <div className="space-y-3">
                                    {ALERTS.map(alert => (
                                        <div key={alert.id} className={`p-4 rounded-xl border flex items-center justify-between ${alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' : alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'high' ? 'text-orange-500' : 'text-blue-500'}`} />
                                                <span className="text-white font-medium text-sm">{alert.msg}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-gray-500 font-mono">{alert.time}</span>
                                                <button className="text-xs font-bold underline hover:text-white text-gray-400">Verificar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 5. FINANCIAL CONTROL (NEW) */}
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Control Financiero Estratégico
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="h-40 bg-black/20 rounded-xl border border-white/5 flex items-center justify-center text-gray-600 text-xs">
                                        [Gráfico: Inversión vs Retorno vs Producción]
                                    </div>
                                    <div className="space-y-3">
                                        {FINANCIAL_INSIGHTS.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                                                <span className="text-gray-300">{item.service}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-white font-mono">{item.revenue}</span>
                                                    <span className={`font-bold ${item.status === 'star' ? 'text-emerald-400' : item.status === 'drain' ? 'text-red-400' : 'text-gray-400'}`}>{item.profit} Utilidad</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </section>

                        {/* RIGHT COLUMN: AI & SCALING */}
                        <section className="space-y-8">

                            {/* 7. AI ASSISTED DECISIONS */}
                            <div className="bg-gradient-to-b from-indigo-900/20 to-[#0E0E18] border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit className="w-32 h-32 text-indigo-500" /></div>
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/50"><BrainCircuit className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Decisiones Asistidas</h3>
                                        <p className="text-xs text-indigo-300">Inteligencia de Negocio IA</p>
                                    </div>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4 mb-4 border border-white/5 relative z-10">
                                    <p className="text-sm text-gray-300 leading-relaxed italic">
                                        "Este mes conviene vender más <strong className="text-white not-italic">Video Ads</strong>. El margen es alto ($12.5k) y el equipo de Audio tiene capacidad ociosa para apoyar."
                                    </p>
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                                        <Target className="w-3 h-3 text-indigo-400" /> <span>Sugerencia: Subir precios 10% en Video</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                                        <Users className="w-3 h-3 text-indigo-400" /> <span>Sugerencia: Contratar Editor Junior</span>
                                    </div>
                                </div>
                            </div>

                            {/* 6. SCALING CONTROL (NEW) */}
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-cyan-500" /> Control de Escalado
                                </h2>
                                <div className="space-y-4">
                                    {SCALING_QUESTIONS.map((item, i) => (
                                        <div key={i} className="bg-[#151520] rounded-xl p-4 border border-white/5">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                <HelpCircle className="w-3 h-3" /> {item.q}
                                            </h4>
                                            <p className={`text-sm font-bold ${item.type === 'positive' ? 'text-green-400' : item.type === 'urgent' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                {item.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. QUALITY SNAPSHOT */}
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><Target className="w-4 h-4 text-purple-500" /> Top Performer</h2>
                                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Nivel 5</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-lg shadow-lg shadow-yellow-500/20">A</div>
                                    <div>
                                        <div className="text-white font-bold">Ana Design</div>
                                        <div className="text-xs text-gray-400">Senior Designer • 98 Score</div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-lg transition-colors">Ver Ranking Completo</button>
                                </div>
                            </div>

                        </section>
                    </div>

                    {/* 8. NODE GOVERNANCE (FOOTER) */}
                    <section className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Globe className="w-5 h-5 text-cyan-500" /> Gobernanza de Nodos (Expansión)
                            </h2>
                            <button className="text-xs text-blue-400 font-bold hover:text-white transition-colors">+ Añadir Territorio</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#151520] p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:border-green-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-2"><div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" /></div>
                                <h3 className="text-white font-bold mb-1 group-hover:text-green-400 transition-colors">Nodo Quito (HQ)</h3>
                                <p className="text-xs text-gray-500 mb-4">Operación Central</p>
                                <div className="flex justify-between text-xs border-t border-white/5 pt-3 mt-2">
                                    <span className="text-gray-400">Ingresos: <span className="text-white font-bold">$18.2k</span></span>
                                    <span className="text-gray-400">Team: <span className="text-white font-bold">12</span></span>
                                </div>
                            </div>
                            <div className="bg-[#151520] p-4 rounded-xl border border-white/5 relative overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer hover:opacity-100 hover:border-cyan-500/30 group">
                                <div className="absolute top-0 right-0 p-2"><div className="w-2 h-2 rounded-full bg-gray-500 group-hover:bg-cyan-500 transition-colors" /></div>
                                <h3 className="text-white font-bold mb-1 group-hover:text-cyan-400 transition-colors">Nodo Guayaquil</h3>
                                <p className="text-xs text-gray-500 mb-4">Próxima Apertura</p>
                                <div className="flex justify-between text-xs border-t border-white/5 pt-3 mt-2">
                                    <span className="text-gray-400">Meta: <span className="text-white font-bold">$5.0k</span></span>
                                    <span className="text-cyan-400 font-bold">Activar</span>
                                </div>
                            </div>
                            <div className="bg-[#151520] p-4 rounded-xl border border-white/5 relative overflow-hidden border-dashed flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer group">
                                <span className="text-gray-600 font-bold text-sm group-hover:text-white transition-colors">+ Nodo Internacional</span>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            {/* 9. RED BUTTON MODAL (EMERGENCY) */}
            <AnimatePresence>
                {showRedButton && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-red-950/90 backdrop-blur-md flex items-center justify-center p-8">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1a0505] border border-red-500/50 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden p-8 text-center ring-1 ring-red-500/50 shadow-red-900/50">
                            <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">PANEL DE EMERGENCIA</h2>
                            <p className="text-red-300 mb-10 text-lg font-medium">ESTAS ACCIONES TIENEN CONSECUENCIAS IRREVERSIBLES.</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button className="p-4 bg-red-950/50 border border-red-500/30 rounded-xl hover:bg-red-900/80 hover:border-red-500 transition-all group text-left">
                                    <h4 className="text-white font-bold group-hover:text-red-400 flex items-center gap-2"><Lock className="w-4 h-4" /> Pausar Cliente</h4>
                                    <p className="text-xs text-red-400/60 mt-1Group-hover:text-red-400/80">Detener servicios por impago</p>
                                </button>
                                <button className="p-4 bg-red-950/50 border border-red-500/30 rounded-xl hover:bg-red-900/80 hover:border-red-500 transition-all group text-left">
                                    <h4 className="text-white font-bold group-hover:text-red-400 flex items-center gap-2"><XCircle className="w-4 h-4" /> Congelar Creativo</h4>
                                    <p className="text-xs text-red-400/60 mt-1Group-hover:text-red-400/80">Suspender acceso por seguridad</p>
                                </button>
                                <button className="p-4 bg-red-950/50 border border-red-500/30 rounded-xl hover:bg-red-900/80 hover:border-red-500 transition-all group text-left">
                                    <h4 className="text-white font-bold group-hover:text-red-400 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Ajuste Global Precios</h4>
                                    <p className="text-xs text-red-400/60 mt-1Group-hover:text-red-400/80">Impacto en todos los planes</p>
                                </button>
                                <button className="p-4 bg-red-950/50 border border-red-500/30 rounded-xl hover:bg-red-900/80 hover:border-red-500 transition-all group text-left">
                                    <h4 className="text-white font-bold group-hover:text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Modo Contingencia</h4>
                                    <p className="text-xs text-red-400/60 mt-1Group-hover:text-red-400/80">Protocolos de respaldo</p>
                                </button>
                            </div>

                            <button onClick={() => setShowRedButton(false)} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors w-full border border-white/5">CANCELAR Y SALIR</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
