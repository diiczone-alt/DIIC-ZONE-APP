'use client';

import { useState } from 'react';
import {
    ShieldCheck, CheckCircle2, AlertCircle,
    Video, Layout, Camera, Globe,
    ListChecks, History, AlertTriangle,
    CheckSquare, XCircle, Search,
    User, ChevronRight, LayoutGrid,
    Flame, Zap, ArrowRight, ClipboardList,
    ShieldAlert, Ban, Info, RefreshCcw,
    Activity, LifeBuoy, Fingerprint, Lock,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { calculateQualityIndex, analyzeProjectRisk, QUALITY_THRESHOLDS } from '../connectivity/QualityEngine';

export default function AdminQualityControl() {
    const [activeTab, setActiveTab] = useState('review'); // 'review', 'history', 'brand'
    const [selectedProject, setSelectedProject] = useState(null);

    // Mock enhanced with metrics needed for calculation
    const pendingProjects = [
        { id: 1, name: "Reel Autoridad Médica", type: "video", author: "Carla M.", phase: 3, riskLevel: 'low', activators: [] },
        { id: 2, name: "Producción Campo - Santo Domingo", type: "video", author: "Mateo R.", phase: 2, riskLevel: 'low', activators: [] },
        { id: 3, name: "Diseño Landing Page Elite", type: "design", author: "Jorge L.", phase: 1, riskLevel: 'low', activators: [] }
    ];

    // Mock historial data for a selected author (in production this comes from DB)
    const authorMetrics = {
        onTimeDeliveries: 18,
        totalProjects: 20,
        quickApprovals: 15,
        totalAdjustments: 25, // 1.25 avg
        delays: 1
    };

    // Calculate IQ for demo purposes (using static mock metrics for now)
    const qualityAssessment = calculateQualityIndex(authorMetrics);

    const checklists = {
        video: [
            "Duración correcta conforme al brief",
            "Audio limpio (sin ruidos/picos)",
            "Logo e indentidad visual aplicada",
            "Color grading alineado a marca",
            "Resolución y formato correcto"
        ],
        design: [
            "Tipografía corporativa correcta",
            "Ortografía y gramática perfecta",
            "Márgenes y composición equilibrada",
            "Colores de marca exactos",
            "Tamaño adecuado para plataforma"
        ],
        photo: [
            "Iluminación y exposición correcta",
            "Corrección de color realizada",
            "Enfoque y nitidez perfecta",
            "Marca de agua/logo si aplica"
        ],
        web: [
            "Todos los links funcionan (404 check)",
            "Velocidad de carga óptima",
            "Diseño Responsive (Mobile first)",
            "Formularios de contacto conectados"
        ]
    };

    const nodeHealth = [];

    const penaltiesMatrix = [
        { level: "Amarillo", trigger: "Retraso leve", action: "Advertencia Interna", color: "text-yellow-400" },
        { level: "Naranja", trigger: "Queja cliente / Calidad baja", action: "Solo proyectos simples", color: "text-orange-400" },
        { level: "Rojo", trigger: "Daño reputacional / Marca mal usada", action: "Bloqueo asignación automática", color: "text-red-400" }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* QA HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <ShieldCheck className="w-7 h-7 text-emerald-500" /> Control de Calidad (QA)
                    </h2>
                    <p className="text-gray-400 text-sm">Filtro final para la excelencia de DIIC ZONE</p>
                </div>
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('review')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'review' ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Revisión Activa
                    </button>
                    <button
                        onClick={() => setActiveTab('brand')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'brand' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Marca & Penalizaciones
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Historial QA
                    </button>
                </div>
            </div>

            {activeTab === 'brand' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* NODE RISK STATUS */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <ShieldAlert className="w-6 h-6 text-red-500" /> Monitoreo de Riesgo de Nodos
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {nodeHealth.map(node => (
                                        <NodeHealthCard key={node.id} node={node} />
                                    ))}
                                    {nodeHealth.length === 0 && (
                                        <div className="col-span-full py-10 text-center text-gray-600 font-bold italic">
                                            No se han registrado auditorías de nodos territoriales.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Ban className="w-5 h-5 text-orange-400" /> Matriz de Penalizaciones Automáticas
                                </h3>
                                <div className="space-y-4">
                                    {penaltiesMatrix.map((p, i) => (
                                        <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
                                            <div>
                                                <div className={`text-sm font-black uppercase tracking-widest ${p.color} mb-1`}>Nivel {p.level}</div>
                                                <div className="text-xs text-gray-500">Disparador: <span className="text-gray-300 italic">{p.trigger}</span></div>
                                            </div>
                                            <div className="mt-4 md:mt-0 flex items-center gap-3">
                                                <Zap className="w-4 h-4 text-purple-400" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl">{p.action}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BRAND PROTECTION STANDARDS */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-b from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-[40px] p-8">
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">DIIC Brand Protection</h3>
                                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-1">Garantía Hub de Inteligencia</p>
                                </div>
                                <div className="space-y-4">
                                    <StandardItem label="Uso de Logo & Visuals" desc="Prohibido alterar proporciones o paleta DIIC." />
                                    <StandardItem label="Protocolos de Rodaje" desc="Uso obligatorio de SOPs de vestimenta y conducta." />
                                    <StandardItem label="Calidad de Entrega" desc="Checklist de exportación centralizado." />
                                    <StandardItem label="Comunicación DIIC" desc="Tono de voz y tiempos de respuesta oficiales." />
                                </div>
                                <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <Lock className="w-3 h-3 text-purple-400" /> Retirar Derechos de Marca
                                </button>
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] p-8">
                                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <RefreshCcw className="w-4 h-4" /> Plan de Recuperación
                                </h4>
                                <p className="text-[11px] text-gray-400 leading-relaxed mb-6 italic">
                                    "Un nodo en Rojo puede volver a Verde bajo supervisión estricta."
                                </p>
                                <div className="space-y-3">
                                    <RecoveryStep label="Capacitación Obligatoria" status="pending" />
                                    <RecoveryStep label="Supervisión de Proyecto 1" status="locked" />
                                    <RecoveryStep label="Evaluación de Calidad Final" status="locked" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* PROJECT LIST */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Pendientes de Aprobación</h3>
                        {pendingProjects.length === 0 && (
                            <div className="py-20 text-center text-gray-500 font-bold italic border border-white/5 rounded-3xl">
                                No hay proyectos pendientes de QA.
                            </div>
                        )}
                        {pendingProjects.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProject(p)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedProject?.id === p.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0A0A12] border-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        {p.type === 'video' ? <Video className="w-4 h-4 text-blue-400" /> :
                                            p.type === 'design' ? <Layout className="w-4 h-4 text-purple-400" /> :
                                                p.type === 'web' ? <Globe className="w-4 h-4 text-emerald-400" /> :
                                                    <Camera className="w-4 h-4 text-pink-400" />}
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase">Fase {p.phase}</span>
                                        {analyzeProjectRisk(p).riskLevel === 'high' && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 uppercase">Riesgo</span>}
                                        {analyzeProjectRisk(p).riskLevel === 'critical' && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white uppercase animate-pulse">Crítico</span>}
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-white mb-1">{p.name}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase">{p.author}</div>
                            </div>
                        ))}
                    </div>

                    {/* INSPECTION AREA */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {selectedProject ? (
                                <motion.div
                                    key={selectedProject.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-[#0A0A12] border border-white/10 rounded-3xl p-8 h-full"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-2 h-2 rounded-full animate-pulse ${analyzeProjectRisk(selectedProject).riskLevel === 'high' || analyzeProjectRisk(selectedProject).riskLevel === 'critical' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Inspección: {selectedProject.name}</h3>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <User className="w-3 h-3" /> Creado por: <span className="text-gray-300 font-bold">{selectedProject.author}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Activity className="w-3 h-3" /> IQ Autor: <span className={`font-black ${qualityAssessment.iq > 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>{qualityAssessment.iq}/100</span>
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <ClipboardList className="w-3 h-3" /> Auditoría: <span className="text-white font-black">Fase {selectedProject.phase}</span>
                                                </div>
                                            </div>
                                            {analyzeProjectRisk(selectedProject).activators.length > 0 && (
                                                <div className="mt-3 flex gap-2">
                                                    {analyzeProjectRisk(selectedProject).activators.map((risk, i) => (
                                                        <span key={i} className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase text-xs flex items-center gap-1 border ${risk.level === 'critical' ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                            <AlertTriangle className="w-3 h-3" /> {risk.msg}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Ver Archivo Fuente</button>
                                        </div>
                                    </div>

                                    {/* CHECKLIST DYNAMIC */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-gray-500 uppercase flex items-center gap-2">
                                                <ListChecks className="w-4 h-4" /> Checklist de Validación ({selectedProject.type})
                                            </h4>
                                            <div className="space-y-3">
                                                {checklists[selectedProject.type].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                                                        <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-emerald-500 transition-all">
                                                            <div className="w-2 h-2 rounded-sm bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                                                        </div>
                                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-gray-500 uppercase flex items-center gap-2">
                                                <History className="w-4 h-4" /> Historial de Fase
                                            </h4>
                                            <div className="space-y-4 border-l-2 border-white/5 ml-2 pl-6 pt-2">
                                                <PhaseStep active={true} phase="1" title="Creativo (Auto-Check)" role="Creador" date="Hace 2h" />
                                                <PhaseStep active={selectedProject.phase >= 2} phase="2" title="Community / Líder" role="Líder Operativo" date="Hace 15min" />
                                                <PhaseStep active={selectedProject.phase >= 3} phase="3" title="QA Admin Central" role="Audit Room" date="Pendiente" current={true} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* VERDICT PANEL */}
                                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs font-bold text-gray-500 uppercase">Veredicto QA:</div>
                                            <VerdictBtn color="red" label="Error Crítico" icon={XCircle} onClick={() => toast.error("Proyecto rechazado por errores críticos")} />
                                            <VerdictBtn color="yellow" label="Ajuste Menor" icon={AlertTriangle} onClick={() => toast.warning("Solicitud de ajustes menores enviada")} />
                                            <VerdictBtn color="emerald" label="Aprobado QA" icon={CheckCircle2} onClick={() => toast.success("Proyecto aprobado para entrega final")} />
                                        </div>
                                        <div className="text-[10px] text-gray-600 font-bold italic">
                                            * Esta acción impactará en el Score de Reputación de {selectedProject.author}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-20 flex flex-col items-center justify-center text-center opacity-40">
                                    <LayoutGrid className="w-16 h-16 text-gray-600 mb-6" />
                                    <h3 className="text-xl font-bold text-gray-400">Selecciona un proyecto</h3>
                                    <p className="text-sm text-gray-600">Inicia la auditoría técnica seleccionando un item de la izquierda</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* ERROR PATTERNS (GLOBAL METRICS) */}
            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-500" /> Patrones de Error & Diagnóstico
                    </h3>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enero 2026 Audit Room</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PatternCard title="Errores de Branding" rate="0%" trend="-- %" color="blue" desc="Sin datos de auditoría aún." />
                    <PatternCard title="Retrasos en Fase 2" rate="0%" trend="-- %" color="red" desc="Sin datos de auditoría aún." />
                    <PatternCard title="Ortografía / Copy" rate="0%" trend="-- %" color="emerald" desc="Sin datos de auditoría aún." />
                </div>
            </div>
        </div>
    );
}

// --- HELPER COMPONENTS ---

function PhaseStep({ active, phase, title, role, date, current }) {
    return (
        <div className="relative mb-6 last:mb-0">
            <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-[#0A0A12] ${active ? (current ? 'bg-emerald-500 animate-ping' : 'bg-emerald-500') : 'bg-white/10'}`} />
            {current && active && <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0A12]" />}
            <div className={`transition-opacity ${active ? 'opacity-100' : 'opacity-20'}`}>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Fase {phase}</div>
                <div className="text-sm font-bold text-white">{title}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">{role} • {date}</div>
            </div>
        </div>
    );
}

function VerdictBtn({ color, label, icon: Icon, onClick }) {
    const colors = {
        red: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
        yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20",
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${colors[color]}`}
        >
            <Icon className="w-3 h-3" /> {label}
        </button>
    );
}

function PatternCard({ title, rate, trend, color, desc }) {
    const textColors = {
        red: "text-red-400",
        blue: "text-blue-400",
        emerald: "text-emerald-400"
    };
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <div className="text-xs font-bold text-white uppercase">{title}</div>
                <div className={`text-xl font-black ${textColors[color]}`}>{rate}</div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-${color === 'red' ? 'red' : color === 'blue' ? 'blue' : 'emerald'}-500 w-[${rate}]`} />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-500">{desc}</span>
                <span className={trend.startsWith('-') ? 'text-emerald-400' : 'text-red-400'}>{trend} Tendencia</span>
            </div>
        </div>
    );
}

function NodeHealthCard({ node }) {
    const statusConfig = {
        green: { color: "bg-emerald-500", text: "Operación Normal", label: "Verde" },
        yellow: { color: "bg-yellow-500", text: "Bajo Observación", label: "Amarillo" },
        orange: { color: "bg-orange-500", text: "Restringido", label: "Naranja" },
        red: { color: "bg-red-500", text: "Suspendido", label: "Rojo" }
    };
    const config = statusConfig[node.status];

    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-tighter">{node.team}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">{node.city}</div>
                </div>
                <div className={`w-3 h-3 rounded-full ${config.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-gray-500">Estado</span>
                    <span className={node.status === 'red' ? 'text-red-400' : 'text-white'}>{config.text}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-gray-500">Alertas</span>
                    <span className={node.alerts > 0 ? 'text-orange-400' : 'text-white'}>{node.alerts} detectadas</span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">LVL {config.label}</span>
                <button className="text-[9px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">Ver Historial</button>
            </div>
        </div>
    );
}

function StandardItem({ label, desc }) {
    return (
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-purple-500/20 transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed font-medium pl-4">{desc}</p>
        </div>
    );
}

function RecoveryStep({ label, status }) {
    const icons = {
        pending: <Clock className="w-3 h-3 text-yellow-400" />,
        locked: <Lock className="w-3 h-3 text-gray-600" />,
        done: <CheckCircle2 className="w-3 h-3 text-emerald-400" />
    };
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-black/20 rounded-xl border border-white/5">
            {icons[status]}
            <span className={`text-[10px] font-bold ${status === 'locked' ? 'text-gray-600' : 'text-gray-300'}`}>{label}</span>
        </div>
    );
}
