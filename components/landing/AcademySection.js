'use client';

import { motion } from 'framer-motion';
import { 
    GraduationCap, Megaphone, Users, PenTool, Video, 
    Palette, Camera, Bot, Sparkles, BookOpen, Clock, 
    Award, CheckCircle2, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function AcademySection() {
    const courses = [
        {
            id: 1,
            title: 'Fundamentos de Marketing Digital & Embudos',
            level: 'Básico',
            instructor: 'Directores de Estrategia DIIC',
            desc: 'Aprende a diferenciar likes de ventas reales, estructura embudos de captación y construye mentalidad de marca sólida.',
            topics: ['Embudos de captación', 'Psicología de compra', 'Estrategia de contenidos vs anuncios'],
            icon: Megaphone,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            id: 2,
            title: 'Community Management Profesional',
            level: 'Intermedio',
            instructor: 'Especialistas en Redes & Engagement',
            desc: 'Gestión de comunidades reales, calendarios editoriales, resolución de crisis y métricas de salud en redes.',
            topics: ['Calendarios de 30 días', 'Gestión de crisis en comentarios', 'Reportes de conversión'],
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            id: 3,
            title: 'Creación de Contenido Audiovisual que Vende',
            level: 'Intermedio',
            instructor: 'Guionistas & Creadores de la Zona Creativa',
            desc: 'Ganchos en los primeros 3 segundos, storytelling de alto impacto y estructuras de guiones para reels que retienen.',
            topics: ['Ganchos virales', 'Estructuras de guión de 30s y 60s', 'Storytelling persuasivo'],
            icon: PenTool,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20'
        },
        {
            id: 4,
            title: 'Edición de Video Cinematográfico para Redes',
            level: 'Intermedio / Avanzado',
            instructor: 'Senior Video Editors de DIIC ZONE',
            desc: 'Montaje de ritmo dinámico, corrección de color cinemática (LUTs), subtitulado animado y sound design profesional.',
            topics: ['Color grading S-Log', 'Sound design & SFX', 'Subtítulos animados y transiciones'],
            icon: Video,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        },
        {
            id: 5,
            title: 'Filmmaking & Dirección de Rodaje',
            level: 'Avanzado',
            instructor: 'Directores de Fotografía & Cineastas',
            desc: 'Manejo de cámaras de cine, esquemas de iluminación de 3 puntos, dirección en set y encuadres de alta gama.',
            topics: ['Iluminación suave y contrastes', 'Uso de gimbals y ópticas fijas', 'Dirección de actores/clientes'],
            icon: Camera,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            id: 6,
            title: 'IA y Automatización para Creadores & Agencias',
            level: 'Avanzado',
            instructor: 'Ingenieros de IA de DIIC ZONE',
            desc: 'Aprende a integrar agentes de inteligencia artificial, automatización de prospección y flujos de trabajo sin fricción.',
            topics: ['Agentes de atención 24/7', 'Workflows automáticos', 'Generación asistida con IA'],
            icon: Bot,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        }
    ];

    return (
        <section id="academy" className="py-24 bg-[#050510] relative overflow-hidden border-t border-white/5">
            {/* Ambient Lights */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono uppercase tracking-widest text-yellow-400 mb-4">
                        <GraduationCap className="w-4 h-4" />
                        DIIC ACADEMY
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight mb-6">
                        Capacitaciones & Cursos de élite <br />
                        <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                            dictados por los profesionales de la Zona Creativa.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Aprende directamente de los directores, editores, filmmakers y estrategas que producen las campañas de las mejores marcas del ecosistema.
                    </p>
                </div>

                {/* Academy Banner Hero Highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-yellow-950/20 via-amber-950/10 to-transparent border border-yellow-500/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="space-y-3 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-400 text-xs font-black uppercase tracking-wider">
                            <Award className="w-4 h-4" /> Certificación Oficial DIIC ZONE
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white">
                            Formación Práctica con Casos y Proyectos Reales
                        </h3>
                        <p className="text-gray-400 text-xs md:text-sm max-w-2xl">
                            No enseñamos teoría obsoleta. Cada taller incluye acceso a recursos, LUTs cinematográficos, plantillas de guiones y la oportunidad de postular como talento oficial de la Zona Creativa.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/academy"
                        className="px-8 py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-500/20 hover:scale-105 transition-all shrink-0 flex items-center gap-2"
                    >
                        Ver Todos los Cursos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, idx) => {
                        const Icon = course.icon;
                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08, duration: 0.4 }}
                                className="p-7 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div className={`w-12 h-12 rounded-2xl ${course.bg} border ${course.border} flex items-center justify-center ${course.color} group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                                            {course.level}
                                        </span>
                                    </div>

                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                                        {course.title}
                                    </h4>

                                    <span className="text-[11px] font-mono text-indigo-400 block mb-3">
                                        Instructor: {course.instructor}
                                    </span>

                                    <p className="text-gray-400 text-xs leading-relaxed mb-5">
                                        {course.desc}
                                    </p>

                                    {/* Key Topics */}
                                    <div className="space-y-2 pt-3 border-t border-white/5 mb-6">
                                        {course.topics.map((top, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[11px] text-gray-300">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400/80 shrink-0" />
                                                <span>{top}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Link
                                    href="/dashboard/academy"
                                    className="w-full py-3 text-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
                                    Acceder al Módulo
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
