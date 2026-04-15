'use client';

import { useState } from 'react';
import {
    MapPin, Globe, Users,
    FileText, TrendingUp, BarChart3,
    ArrowUpRight, Building2, Phone,
    Mail, Calendar, ShieldCheck,
    Search, Filter, LayoutGrid,
    Briefcase, Zap, Star,
    MousePointer2, Network, Video,
    Camera, Truck, UploadCloud,
    ArrowRight, ChevronRight,
    Trophy, AlertTriangle, DollarSign,
    CheckCircle2, XCircle, HandCoins,
    Gem, Activity, ShieldAlert, AlertCircle,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminNodeManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [activeView, setActiveView] = useState('map'); // 'map', 'workflow', 'economics'

    const nodes = [
        {
            id: 1,
            city: "Quito",
            name: "Nodo DM Quito",
            director: "Andrés P.",
            status: "active",
            level: "premium",
            creatives: 14,
            activeProjects: 28,
            monthlyRevenue: "$8,400",
            health: 94,
            team: ["Filmmaker Senior", "Fotógrafo", "Editor Apoyo", "Coord. Logística"],
            reputation: {
                puntuality: 98,
                quality: 95,
                uploads: 99,
                clientSat: 92
            }
        },
        {
            id: 2,
            city: "Guayaquil",
            name: "Nodo Puerto GYE",
            director: "Mariana L.",
            status: "active",
            level: "operativo",
            creatives: 8,
            activeProjects: 12,
            monthlyRevenue: "$4,200",
            health: 82,
            team: ["Filmmaker", "Editor Junior"],
            reputation: {
                puntuality: 85,
                quality: 90,
                uploads: 80,
                clientSat: 88
            }
        },
        {
            id: 3,
            city: "Manta",
            name: "Nodo Costa Manta",
            director: "Roberto G.",
            status: "active",
            level: "premium",
            creatives: 6,
            activeProjects: 15,
            monthlyRevenue: "$5,800",
            health: 96,
            team: ["Filmmaker Pro", "Fotógrafo Moda"],
            reputation: {
                puntuality: 99,
                quality: 98,
                uploads: 95,
                clientSat: 94
            }
        },
        {
            id: 4,
            city: "Loja",
            name: "Nodo Sur Loja",
            director: "Karla V.",
            status: "observation",
            level: "basico",
            creatives: 3,
            activeProjects: 4,
            monthlyRevenue: "$1,200",
            health: 62,
            team: ["Filmmaker Jr"],
            reputation: {
                puntuality: 65,
                quality: 70,
                uploads: 60,
                clientSat: 72
            }
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* NODE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Globe className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-indigo-500" /> Red de Nodos Locales
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Infraestructura Operativa de Expansión Territorial</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                        <TabBtn active={activeView === 'map'} icon={Globe} onClick={() => setActiveView('map')} label="Ranking Glocal" />
                        <TabBtn active={activeView === 'workflow'} icon={Network} onClick={() => setActiveView('workflow')} label="Flujo de Producción" />
                        <TabBtn active={activeView === 'economics'} icon={HandCoins} onClick={() => setActiveView('economics')} label="Modelo Económico" />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeView === 'map' ? (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                    >
                        {/* NODE GRID */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {nodes.map((node) => (
                                <NodeCard
                                    key={node.id}
                                    data={node}
                                    onClick={() => setSelectedNode(node)}
                                    isSelected={selectedNode?.id === node.id}
                                />
                            ))}
                            <div className="border-2 border-dashed border-white/5 rounded-[40px] p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-all cursor-pointer bg-white/[0.01]">
                                <div className="p-4 rounded-full bg-white/5 group-hover:bg-indigo-500/10 transition-all mb-4">
                                    <PlusIcon className="w-8 h-8 text-gray-500 group-hover:text-indigo-400" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Aperturar Ciudad</h4>
                                <p className="text-[10px] text-gray-600 mt-1 uppercase font-black tracking-widest text-indigo-400/50">Expansión 2026</p>
                            </div>
                        </div>

                        {/* NODE PANEL (DETAILS) */}
                        <div className="space-y-6">
                            {selectedNode ? (
                                <NodeFocusPanel node={selectedNode} />
                            ) : (
                                <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center text-center opacity-40 h-full min-h-[400px]">
                                    <MapPin className="w-12 h-12 text-gray-600 mb-4" />
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Seleccionar Nodo Local</h3>
                                    <p className="text-[10px] text-gray-600 mt-2">Monitorea la ejecución territorial de DIIC ZONE</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : activeView === 'workflow' ? (
                    <motion.div
                        key="workflow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-12 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Network className="w-96 h-96 text-indigo-500" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-12 flex items-center gap-4">
                            <Zap className="w-8 h-8 text-yellow-500" /> Flujo de Producción Territorial
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            <FlowStep n="1" icon={Calendar} title="Agenda Cliente" desc="El sistema detecta la ciudad y tipo de servicio." color="blue" />
                            <FlowStep n="2" icon={MapPin} title="Detección Ciudad" desc="Asignación automática al nodo local certificado." color="indigo" />
                            <FlowStep n="3" icon={AlertCircle} title="Alerta Nodo" desc="Nodo recibe orden de producción en su ciudad." color="indigo" highlight={true} />
                            <FlowStep n="4" icon={Camera} title="Grabación Local" desc="Ejecución de rodaje y captura de activos fisicos." color="emerald" />
                            <FlowStep n="5" icon={UploadCloud} title="Carga Material" desc="Nodo sube BRUTO para auditoría técnica inmediata." color="pink" />
                            <FlowStep n="6" icon={Activity} title="Post-Prod Central" desc="Equipo DIIC central edita y automatiza piezas." color="purple" />
                            <FlowStep n="7" icon={CheckCircle2} title="Aprobación" desc="Validación final bajo estándares DIIC ZONE." color="emerald" />
                            <FlowStep n="8" icon={ArrowRight} title="Entrega" desc="Envío final al ecosistema digital del cliente." color="blue" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="economics"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-10">
                            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-emerald-500" /> Modelo Económico de Expansión
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <EconomicCard label="Cliente Paga" value="100%" desc="DIIC ZONE Central" color="white" />
                                <EconomicCard label="Pago a Nodo" value="Local Fee" desc="Solo ejecución física" color="indigo" />
                                <EconomicCard label="DIIC Margin" value="Retención" desc="Margen + Post-Prod" color="emerald" />
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Ejemplo de Distribución</h4>
                                <ComparisonRow service="Pack 4 Reels" client="$240" node="$45" diic="$195" />
                                <ComparisonRow service="Video Médico" client="$350" node="$60" diic="$290" />
                                <ComparisonRow service="Campaña Premium" client="$1.2k" node="$250" diic="$950" />
                            </div>
                        </div>

                        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-10">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Blindaje de Marca
                            </h4>
                            <div className="space-y-8">
                                <BlindajeItem title="Propiedad Intelectual" desc="Todos los brutos grabados por el nodo pertenecen a DIIC ZONE desde el minuto 1." />
                                <BlindajeItem title="Exclusividad Regional" desc="El nodo no puede prestar servicios similares fuera del ecosistema DIIC." />
                                <BlindajeItem title="Auditoría de Equipo" desc="Mantenimiento de cámaras y luces verificado trimestralmente." />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, icon: Icon, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon className="w-4 h-4" /> {label}
        </button>
    );
}

function NodeCard({ data, onClick, isSelected }) {
    const levels = {
        premium: { label: "Premium", icon: Gem, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
        operativo: { label: "Operativo", icon: Award, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
        basico: { label: "Básico", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        observation: { label: "Observación", icon: ShieldAlert, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
    };

    const lvl = levels[data.level === 'basico' && data.status === 'observation' ? 'observation' : data.level];
    const LvlIcon = lvl.icon;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={onClick}
            className={`bg-[#0A0A12] border rounded-[40px] p-8 cursor-pointer transition-all relative overflow-hidden group ${isSelected ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}
        >
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{data.city}</h3>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${lvl.bg} ${lvl.color} w-fit`}>
                        <LvlIcon className="w-3 h-3" /> {lvl.label}
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-2xl font-black ${data.health > 85 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {data.health}%
                    </div>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Salud Operativa</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 relative border-t border-white/5 pt-8">
                <MiniBar label="Calidad de Captura" value={data.reputation.quality} color="indigo" />
                <MiniBar label="Puntualidad" value={data.reputation.puntuality} color="blue" />
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> {data.creatives} Creativos
                </div>
                <div className="text-white bg-white/5 px-4 py-1.5 rounded-xl border border-white/5">
                    {data.monthlyRevenue} <span className="text-gray-600 ml-1">Facturado</span>
                </div>
            </div>
        </motion.div>
    );
}

function MiniBar({ label, value, color }) {
    const colors = {
        indigo: "bg-indigo-500",
        blue: "bg-blue-500"
    };
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase text-gray-500">
                <span>{label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${colors[color]} rounded-full shadow-[0_0_5px_rgba(99,102,241,0.5)]`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function NodeFocusPanel({ node }) {
    return (
        <div className="bg-[#0A0A12] border border-indigo-500/20 rounded-[40px] p-10 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 className="w-32 h-32" />
            </div>

            <div className="relative mb-12">
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{node.name}</h3>
                <span className="px-4 py-1.5 bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">Sede Regional {node.city}</span>
            </div>

            <div className="space-y-8 mb-12">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Equipo Local Certificado</p>
                    <div className="flex flex-wrap gap-2">
                        {node.team.map((t, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-300">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <StatBlock label="Activos" value={node.activeProjects} color="indigo" />
                    <StatBlock label="Nivel" value={node.level.toUpperCase()} color="amber" />
                </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Director de Nodo</p>
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xl">
                            {node.director.substring(0, 1)}
                        </div>
                        <div>
                            <div className="text-sm font-black text-white uppercase">{node.director}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase">Gestor Regional</div>
                        </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
            </div>
        </div>
    );
}

function FlowStep({ n, icon: Icon, title, desc, color, highlight }) {
    const colors = {
        blue: "text-blue-400 border-blue-400/20 bg-blue-500/5",
        indigo: "text-indigo-400 border-indigo-400/20 bg-indigo-500/5",
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-500/5",
        pink: "text-pink-400 border-pink-400/20 bg-pink-500/5",
        purple: "text-purple-400 border-purple-400/20 bg-purple-500/5"
    };

    return (
        <div className={`p-8 rounded-[32px] border transition-all relative text-center group ${colors[color]} ${highlight ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105 z-20 bg-black/40' : 'hover:bg-white/[0.02]'}`}>
            <span className="absolute top-4 left-4 text-[40px] font-black opacity-5 pointer-events-none">{n}</span>
            <div className="inline-flex p-5 rounded-full bg-[#0A0A12] border border-inherit mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3 leading-tight">{title}</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed font-bold">{desc}</p>
        </div>
    );
}

function EconomicCard({ label, value, desc, color }) {
    const colors = {
        white: "text-white border-white/10 bg-white/5",
        indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
    };
    return (
        <div className={`p-6 rounded-[32px] border text-center ${colors[color]}`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">{label}</p>
            <p className="text-2xl font-black mb-1">{value}</p>
            <p className="text-[10px] font-bold opacity-40 uppercase">{desc}</p>
        </div>
    );
}

function ComparisonRow({ service, client, node, diic }) {
    return (
        <div className="flex justify-between items-center p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 transition-all">
            <span className="text-xs font-black text-white uppercase w-1/3">{service}</span>
            <div className="flex gap-8 text-right">
                <div>
                    <p className="text-[8px] font-black text-gray-500 uppercase">Cliente</p>
                    <p className="text-sm font-bold text-white">{client}</p>
                </div>
                <div>
                    <p className="text-[8px] font-black text-indigo-400 uppercase">Nodo</p>
                    <p className="text-sm font-bold text-indigo-400">{node}</p>
                </div>
                <div>
                    <p className="text-[8px] font-black text-emerald-400 uppercase">DIIC</p>
                    <p className="text-sm font-bold text-emerald-400">{diic}</p>
                </div>
            </div>
        </div>
    );
}

function BlindajeItem({ title, desc }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
                <h5 className="text-[10px] font-black uppercase tracking-widest">{title}</h5>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed font-bold ml-6">{desc}</p>
        </div>
    );
}

function StatBlock({ label, value, color }) {
    const colors = {
        indigo: "text-indigo-400 bg-indigo-400/10",
        amber: "text-amber-400 bg-amber-400/10"
    };
    return (
        <div className={`p-4 rounded-2xl ${colors[color]} text-center border border-white/5`}>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">{label}</p>
            <p className="text-xs font-black">{value}</p>
        </div>
    );
}

function PlusIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M12 5v14" /></svg>
    );
}
