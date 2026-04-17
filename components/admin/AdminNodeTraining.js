'use client';

import { useState } from 'react';
import {
    GraduationCap, ClipboardCheck, Award,
    BookOpen, BarChart3, ChevronRight,
    Video, Mic, MapPin, Briefcase,
    CheckCircle2, Clock, Star,
    FileText, Zap, ShieldCheck,
    Search, Filter, LayoutGrid,
    ArrowUpRight, AlertCircle, TrendingUp,
    BrainCircuit, Sparkles, Target, BarChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminNodeTraining() {
    const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline', 'levels', 'curriculum', 'intelligence'
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const applicants = [
        // ... previous data
        {
            id: 1,
            city: "Manta",
            team: "Vista Media",
            equipment: "Sony A7IV, Ronin RS3, Lavaliers Wireless",
            experience: "5 años",
            portfolio: "vimeo.com/vistamedia",
            status: "training",
            step: 3, // 1: Request, 2: Evaluation, 3: Training, 4: Certify, 5: Activation
            progress: 65
        },
        {
            id: 2,
            idName: "Loja Hub",
            city: "Loja",
            team: "Creativos del Sur",
            equipment: "LUMIX S5II, Godox Lighting Set",
            experience: "3 años",
            portfolio: "behance.net/creativosur",
            status: "evaluation",
            step: 2,
            progress: 20
        }
    ];

    const trainingLevels = [
        {
            lvl: 1,
            title: "Nodo Básico",
            desc: "Captura simple y recolección.",
            access: ["Grabaciones Simples", "Fotografía Básica", "Dumps de Material"],
            supervision: "Alta Dirección Central"
        },
        {
            lvl: 2,
            title: "Nodo Certificado",
            desc: "Producción media corporativa.",
            access: ["Videos Corporativos", "Coberturas de Eventos", "Entrevistas"],
            supervision: "Media"
        },
        {
            lvl: 3,
            title: "Nodo Premium",
            desc: "Sucursal estratégica regional.",
            access: ["Producción High-End", "Eventos Ejecutivos", "Campañas"],
            supervision: "Autonomía Operativa"
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* TRAINING HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-purple-500/5 border border-purple-500/10 p-6 rounded-3xl">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <GraduationCap className="w-7 h-7 text-purple-500" /> Sistema de Formación de Nodos
                    </h2>
                    <p className="text-gray-400 text-sm">Certificación y Estandarización de Sedes Territoriales</p>
                </div>
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                    <TabBtn active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} label="Pipeline Ingreso" />
                    <TabBtn active={activeTab === 'levels'} onClick={() => setActiveTab('levels')} label="Niveles & Escalas" />
                    <TabBtn active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')} label="Contenido Formativo" />
                    <TabBtn active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} label="Inteligencia IA" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* APPLICANT LIST / STATS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Aspirantes Activos</h3>
                        <div className="space-y-4">
                            {applicants.map(app => (
                                <div
                                    key={app.id}
                                    onClick={() => setSelectedApplicant(app)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedApplicant?.id === app.id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm font-bold text-white">{app.city}</div>
                                        <span className="text-[9px] font-black uppercase text-purple-400">Step {app.step}/5</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${app.progress}%` }}
                                            className="h-full bg-purple-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-black text-emerald-300 uppercase">Garantía de Calidad</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                            "Este sistema asegura que la grabación en Bogotá sea idéntica en calidad a la de Miami."
                        </p>
                    </div>
                </div>

                {/* MAIN DASHBOARD AREA */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'pipeline' ? (
                            <motion.div
                                key="pipeline"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {selectedApplicant ? (
                                    <ApplicantDetail applicant={selectedApplicant} />
                                ) : (
                                    <div className="bg-[#0A0A12] border border-white/5 border-dashed rounded-[40px] p-20 flex flex-col items-center justify-center text-center opacity-40">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                            <Search className="w-10 h-10 text-gray-700" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-400">Selecciona un aspirante para ver su formación</h3>
                                    </div>
                                )}
                            </motion.div>
                        ) : activeTab === 'levels' ? (
                            <motion.div
                                key="levels"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {trainingLevels.map(lvl => (
                                    <LevelCard key={lvl.lvl} data={lvl} />
                                ))}
                            </motion.div>
                        ) : activeTab === 'intelligence' ? (
                            <motion.div
                                key="intelligence"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8"
                            >
                                <div className="bg-[#0A0A12] border border-indigo-500/20 p-10 rounded-[40px] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-5">
                                        <BrainCircuit className="w-48 h-48 text-indigo-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Entrenamiento del Modelo</h3>
                                    <p className="text-gray-400 font-medium italic">"DIIC ZONE aprende de cada contenido para predecir el éxito."</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <NicheProfileCard
                                        niche="Médicos"
                                        format="Educativo / Autoridad"
                                        hook="Pregunta Directa"
                                        stats="+45% Retención"
                                        color="indigo"
                                    />
                                    <NicheProfileCard
                                        niche="Restaurantes"
                                        format="Visual / Emocional"
                                        hook="Impacto Visual 1s"
                                        stats="+60% Engagement"
                                        color="emerald"
                                    />
                                    <NicheProfileCard
                                        niche="Gimnasios"
                                        format="Motivacional / Tutorial"
                                        hook="Resultado Visual"
                                        stats="+35% Conversión"
                                        color="pink"
                                    />
                                    <NicheProfileCard
                                        niche="Políticos"
                                        format="Cercanía / Historia"
                                        hook="Problema Común"
                                        stats="+50% Alcance Orgánico"
                                        color="blue"
                                    />
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Tendencias de Formato Globales
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <TrendBox label="Duración Ideal" value="15-22s" trend="+18%" />
                                        <TrendBox label="Frecuencia Reels" value="3x Semana" trend="Estable" />
                                        <TrendBox label="Uso de Subtítulos" value="Activo" trend="+90% Retención" />
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-purple-400" /> Efectividad de Recomendaciones
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <AccuracyMetric label="Éxito de Estructuras Sugeridas" accuracy={94} color="purple" />
                                            <AccuracyMetric label="ROI de ganchos tácticos" accuracy={88} color="emerald" />
                                            <AccuracyMetric label="Conversión por Sugerencias CTA" accuracy={82} color="blue" />
                                        </div>
                                        <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-3xl flex flex-col justify-center text-left">
                                            <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Estado del Servidor de Estrategia</h5>
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed mb-6">
                                                "El motor está procesando 1,200 nuevos patrones de éxito detectados esta semana. El índice de utilidad estratégica subió un <span className="text-emerald-400">+5.2%</span>."
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-white uppercase">Sincronizado con Tendencias</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'curriculum' ? (
                            <motion.div
                                key="curriculum"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-10"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-purple-400" /> Plan de Estudios DIIC Node
                                    </h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsFormOpen(true)}
                                            className="px-4 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase rounded-xl hover:bg-white/10 transition-all"
                                        >
                                            Nueva Solicitud
                                        </button>
                                        <button className="px-4 py-2 bg-purple-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-purple-500/20">Actualizar Contenido</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ModuleItem icon={Video} title="🎥 Estándares de Grabación" desc="Líneas de composición, ISO, Log-C y perfiles de color DIIC." />
                                    <ModuleItem icon={Mic} title="🎙️ Audio Profesional" desc="Micrófonos de solapa, ambiente y sincronización en post." />
                                    <ModuleItem icon={FileText} title="📂 Protocolos de Transferencia" desc="Organización de carpetas, proxies y subida prioritaria." />
                                    <ModuleItem icon={ShieldCheck} title="🧩 Flujo de Trabajo" desc="Comunicación con Central Hub y uso de la plataforma." />
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* REPUTACIÓN WEIGHTS (FIXED PANEL) */}
                    <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-white/10 p-8 rounded-[40px]">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-purple-400" /> Motor de Evaluación de Nodos
                                </h4>
                                <p className="text-xs text-gray-400 font-bold max-w-md">Pesos porcentuales que definen la reputación operativa de cada sede regional.</p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <WeightBadge label="Visual" weight="30%" color="purple" />
                                <WeightBadge label="Audio" weight="20%" color="blue" />
                                <WeightBadge label="Puntualidad" weight="20%" color="emerald" />
                                <WeightBadge label="Guion" weight="15%" color="pink" />
                                <WeightBadge label="Feedback" weight="15%" color="indigo" />
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            {/* APPLICATION FORM MODAL */}
            < AnimatePresence >
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
                        onClick={() => setIsFormOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0A0A12] border border-white/10 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nueva Solicitud de Nodo</h3>
                                    <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mt-1">Programa de Ingreso Territorial</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                                    <LayoutGrid className="w-5 h-5 text-gray-500 rotate-45" />
                                </button>
                            </div>

                            <form className="p-10 space-y-6" onSubmit={(e) => {
                                e.preventDefault();
                                toast.success("Solicitud registrada con éxito", { description: "Iniciando fase de evaluación." });
                                setIsFormOpen(false);
                            }}>
                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput label="Ciudad / Región" placeholder="Ej: Medellín, Colombia" />
                                    <FormInput label="Experiencia (Años)" placeholder="Ej: 5 años" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Equipo Técnico (Cámaras, Luces, Audio)</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-purple-500/50 transition-all h-24 resize-none"
                                        placeholder="Lista de equipos principales..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput label="Portafolio / Reel" placeholder="Link a Vimeo/Behance" />
                                    <FormInput label="Capacidad Humana" placeholder="Nro de personas" />
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-[20px] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20">
                                        Registrar Aspirante & Iniciar Evaluación
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )
                }
            </AnimatePresence >
        </div >
    );
}

// --- NEW HELPER ---
function FormInput({ label, placeholder, type = "text" }) {
    return (
        <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-purple-500/50 transition-all"
            />
        </div>
    );
}

// --- HELPER COMPONENTS ---

function TabBtn({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {label}
        </button>
    );
}

function ApplicantDetail({ applicant }) {
    const steps = ["Solicitud", "Evaluación", "Capacitación", "Certificación", "Activación"];

    return (
        <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <GraduationCap className="w-64 h-64 text-purple-500" />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">{applicant.team}</h3>
                        <p className="text-xs text-purple-400 font-bold flex items-center gap-1 group">
                            <MapPin className="w-3 h-3" /> Aspirante para {applicant.city}
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experiencia: <span className="text-white">{applicant.experience}</span></span>
                    </div>
                </div>

                {/* VISUAL PIPELINE */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
                    {steps.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${i + 1 <= applicant.step ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/10 text-gray-600'}`}>
                                {i + 1 <= applicant.step - 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${i + 1 === applicant.step ? 'text-white' : 'text-gray-600'}`}>{s}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InfoBox title="Equipo Técnico" content={applicant.equipment} icon={Video} />
                    <InfoBox title="Portafolio / Reel" content={applicant.portfolio} icon={ArrowUpRight} isLink={true} />
                </div>

                {/* PERFORMANCE METRICS SECTION */}
                <div className="mb-10 p-8 bg-white/5 border border-white/5 rounded-[32px]">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BarChart3 className="w-3 h-3 text-purple-400" /> Evaluación de Performance (Pesos DIIC)
                    </h4>
                    <div className="space-y-5">
                        <MetricBar label="Calidad Visual" weight="30%" progress={92} color="bg-purple-500" />
                        <MetricBar label="Calidad de Audio" weight="20%" progress={88} color="bg-blue-500" />
                        <MetricBar label="Puntualidad" weight="20%" progress={100} color="bg-emerald-500" />
                        <MetricBar label="Apego a Guion" weight="15%" progress={85} color="bg-pink-500" />
                        <MetricBar label="Feedback Cliente" weight="15%" progress={95} color="bg-indigo-500" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20">
                        Aprobar para Siguiente Fase
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-500 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                        Rechazar
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoBox({ title, content, icon: Icon, isLink }) {
    return (
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon className="w-3 h-3" /> {title}
            </p>
            <p className={`text-xs font-bold ${isLink ? 'text-purple-400 underline decoration-purple-500/30' : 'text-gray-300'} leading-relaxed`}>
                {content}
            </p>
        </div>
    );
}

function MetricBar({ label, weight, progress, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 uppercase">{label}</span>
                    <span className="text-gray-600">({weight})</span>
                </div>
                <span className="text-white">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${color} shadow-[0_0_10px_rgba(168,85,247,0.2)]`}
                />
            </div>
        </div>
    );
}

function LevelCard({ data }) {
    return (
        <div className="bg-[#0A0A12] border border-white/10 rounded-[32px] p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className={`absolute top-0 right-0 p-6 text-[40px] font-black opacity-[0.03] transition-all group-hover:scale-110 group-hover:opacity-[0.07] text-purple-500`}>
                NVL {data.lvl}
            </div>

            <h3 className="text-lg font-black text-white mb-2 leading-tight uppercase tracking-tighter">{data.title}</h3>
            <p className="text-[10px] text-gray-500 font-bold mb-6 leading-relaxed italic">{data.desc}</p>

            <div className="space-y-4 mb-8">
                <p className="text-[9px] font-black text-white uppercase tracking-widest border-l-2 border-purple-500 pl-2">Capacidades:</p>
                {data.access.map((acc, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> {acc}
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-white/5">
                <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Supervisión:</div>
                <div className="text-sm font-black text-indigo-400 uppercase tracking-tighter">{data.supervision}</div>
            </div>
        </div>
    );
}

function ModuleItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex gap-5 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-purple-400 transition-all shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h4 className="text-sm font-black text-white mb-1 uppercase tracking-tight">{title}</h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function TrendBox({ label, value, trend }) {
    const isUp = trend?.startsWith('+');
    return (
        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl text-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">{label}</span>
            <div className="text-2xl font-black text-white mb-1">{value}</div>
            <div className={`text-[10px] font-black uppercase ${isUp ? 'text-emerald-400' : 'text-gray-400'}`}>{trend}</div>
        </div>
    );
}

function NicheProfileCard({ niche, format, hook, stats, color }) {
    const colors = {
        indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        pink: "text-pink-400 border-pink-500/20 bg-pink-500/5",
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5"
    };

    return (
        <div className={`p-8 rounded-[40px] border ${colors[color]} relative overflow-hidden group hover:border-white/20 transition-all text-left`}>
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform`}>
                <Target className="w-24 h-24" />
            </div>

            <div className="flex justify-between items-start mb-6">
                <h4 className="text-xl font-black text-white uppercase tracking-tighter">{niche}</h4>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/10 ${colors[color].split(' ')[0]}`}>
                    {stats}
                </span>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 opacity-40 text-white" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Formato: <span className="text-white">{format}</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 opacity-40 text-white" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Gancho: <span className="text-white italic">"{hook}"</span></span>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex gap-2">
                <button className="flex-1 py-3 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Ver Datos</button>
                <button className="flex-1 py-3 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Editar Plan</button>
            </div>
        </div>
    );
}

function WeightBadge({ label, weight, color }) {
    const colors = {
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    };

    return (
        <div className={`px-4 py-2 rounded-xl border ${colors[color]} flex flex-col items-center min-w-[100px]`}>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</span>
            <span className="text-xl font-black">{weight}</span>
        </div>
    );
}
function AccuracyMetric({ label, accuracy, color }) {
    const colorStyles = {
        purple: "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        emerald: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        blue: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-xl font-black text-white italic">{accuracy}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${colorStyles[color]}`}
                />
            </div>
        </div>
    );
}
