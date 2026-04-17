'use client';

import { useState } from 'react';
import {
    GraduationCap, BookOpen, Users,
    Video, Palette, Zap,
    MessageSquare, CheckCircle2, Clock,
    BarChart3, BrainCircuit, ArrowUpRight,
    TrendingUp, ShieldCheck, PlayCircle,
    Trophy, Award, AlertCircle, FileText,
    Search, Filter, LayoutGrid, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminTalentTraining() {
    const [activeTab, setActiveTab] = useState('academy'); // 'academy', 'students', 'curriculum'
    const [selectedStudent, setSelectedStudent] = useState(null);

    const students = [];

    const courses = [
        {
            id: "protocol",
            title: "Protocolo DIIC ZONE",
            target: "Todos",
            icon: ShieldCheck,
            modules: 8,
            duration: "10h",
            desc: "Cultura, estándares de comunicación y flujos de trabajo internos.",
            color: "blue"
        },
        {
            id: "editing",
            title: "Edición Profesional",
            target: "Editores",
            icon: Video,
            modules: 12,
            duration: "25h",
            desc: "Narrativa, colorización avanzada y automatización en Premiere/Resolve.",
            color: "purple"
        },
        {
            id: "design",
            title: "Diseño Estratégico",
            target: "Diseñadores",
            icon: Palette,
            modules: 10,
            duration: "15h",
            desc: "Psicología del color, UI/UX y branding enfocado a conversión.",
            color: "pink"
        },
        {
            id: "comm",
            title: "Gestión de Cliente",
            target: "Community",
            icon: MessageSquare,
            modules: 6,
            duration: "8h",
            desc: "Manejo proactivo de crisis, reportes de BI y tono de voz DIIC.",
            color: "emerald"
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* ACADEMY HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-purple-500/5 border border-purple-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <GraduationCap className="w-32 h-32 text-purple-500" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-purple-500" /> La Academia DIIC ZONE
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Formación de Élite para el Ecosistema Creativo</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                        <TabBtn active={activeTab === 'academy'} onClick={() => setActiveTab('academy')} label="Dashboard" />
                        <TabBtn active={activeTab === 'students'} onClick={() => setActiveTab('students')} label="Alumnos" />
                        <TabBtn active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')} label="Módulos" />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'academy' ? (
                    <motion.div
                        key="academy"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* STATS BENTO */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AcademyStat
                                title="Certificados DIIC"
                                value="24"
                                trend="+3 este mes"
                                icon={Trophy}
                                color="purple"
                            />
                            <AcademyStat
                                title="En Formación"
                                value="08"
                                trend="Baja Reputación: 3"
                                icon={Clock}
                                color="blue"
                            />

                            <div className="md:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Impacto en Reputación (Promedio)
                                </h3>
                                <div className="space-y-6">
                                    <ProgressionTrack label="Antes de Academia" value={58} color="bg-red-500" />
                                    <ProgressionTrack label="Después de Academia" value={92} color="bg-emerald-500" />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-6 italic">* Datos basados en los últimos 6 meses de formación interna.</p>
                            </div>
                        </div>

                        {/* TRIGGERS PANEL */}
                        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-8">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-indigo-400" /> Disparadores Inteligentes
                            </h3>
                            <div className="space-y-6">
                                <TriggerItem
                                    title="Reputación Crítica"
                                    desc="SR < 60 activa capacitación obligatoria."
                                    status="active"
                                />
                                <TriggerItem
                                    title="Onboarding"
                                    desc="Nuevos ingresos deben pasar Protocolo Nivel 1."
                                    status="active"
                                />
                                <TriggerItem
                                    title="Up-Skilling"
                                    desc="Opcional para desbloquear proyectos Premium."
                                    status="idle"
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : activeTab === 'students' ? (
                    <motion.div
                        key="students"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {students.length === 0 && (
                                <div className="lg:col-span-4 py-20 text-center text-gray-500 font-bold italic border border-white/5 rounded-[40px] bg-[#0A0A12]">
                                    <GraduationCap className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
                                    No hay creativos inscritos en cursos actualmente.
                                </div>
                            )}
                            {students.map(student => (
                                <StudentRow
                                    key={student.id}
                                    data={student}
                                    onClick={() => setSelectedStudent(student)}
                                    isSelected={selectedStudent?.id === student.id}
                                />
                            ))}
                        </div>
                        {selectedStudent && (
                            <StudentFocusPanel student={selectedStudent} />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="curriculum"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {courses.map(course => (
                            <CourseCard key={course.id} data={course} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {label}
        </button>
    );
}

function AcademyStat({ title, value, trend, icon: Icon, color }) {
    const colors = {
        purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5"
    };

    return (
        <div className={`p-8 rounded-[40px] border ${colors[color]} relative group overflow-hidden`}>
            <Icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{title}</p>
            <p className="text-4xl font-black mb-1">{value}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase">{trend}</p>
        </div>
    );
}

function ProgressionTrack({ label, value, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase">
                <span className="text-gray-500">{label}</span>
                <span className="text-white">{value} SR</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}

function TriggerItem({ title, desc, status }) {
    return (
        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-black text-white uppercase">{title}</h4>
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`} />
            </div>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{desc}</p>
        </div>
    );
}

function StudentRow({ data, onClick, isSelected }) {
    return (
        <motion.div
            whileHover={{ x: 5 }}
            onClick={onClick}
            className={`p-6 rounded-[32px] border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-purple-500/10 border-purple-500/30' : 'bg-[#0A0A12] border-white/5 hover:border-white/10'}`}
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xl">
                    {data.name.substring(0, 1)}
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase">{data.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{data.role}</p>
                </div>
            </div>

            <div className="hidden md:block">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Motivo</p>
                <p className="text-xs font-bold text-white uppercase">{data.reason}</p>
            </div>

            <div className="text-right w-32">
                <div className="flex justify-between text-[8px] font-black uppercase text-gray-500 mb-1">
                    <span>Progreso</span>
                    <span className="text-white">{data.progress}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${data.progress}%` }} />
                </div>
            </div>
        </motion.div>
    );
}

function StudentFocusPanel({ student }) {
    return (
        <div className="bg-[#0A0A12] border border-purple-500/20 rounded-[40px] p-8 h-full sticky top-0">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Expediente Formativo</h3>

            <div className="space-y-6 mb-10">
                <div className="p-5 bg-white/5 rounded-[24px] border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Curso en Curso</p>
                    <p className="text-sm font-bold text-purple-400 uppercase">{student.course}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Inicio</p>
                        <p className="text-[10px] font-bold text-white">{student.startDate}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Deadline</p>
                        <p className="text-[10px] font-bold text-white">{student.deadline}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Habilidades a desbloquear</p>
                <div className="flex flex-wrap gap-2">
                    <SkillBadge label="Criterio DIIC" />
                    <SkillBadge label="Eficiencia Pro" />
                    <SkillBadge label="Elite Workflow" />
                </div>
            </div>

            <button className="w-full mt-10 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20">
                Evaluar Completion
            </button>
        </div>
    );
}

function CourseCard({ data }) {
    const colors = {
        blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
        pink: "text-pink-400 bg-pink-400/10 border-pink-400/20",
        emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    };

    return (
        <div className={`p-8 rounded-[40px] border bg-[#0A0A12] transition-all group hover:scale-[1.02] border-white/5`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colors[data.color]}`}>
                <data.icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{data.title}</h3>
            <p className="text-[10px] text-gray-500 font-bold mb-6 leading-relaxed line-clamp-2">{data.desc}</p>

            <div className="flex justify-between items-center pt-6 border-t border-white/5 text-[10px] font-black uppercase text-gray-500">
                <span>{data.modules} Módulos</span>
                <span>{data.duration}</span>
            </div>
        </div>
    );
}

function SkillBadge({ label }) {
    return (
        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-gray-300 uppercase">
            {label}
        </span>
    );
}
