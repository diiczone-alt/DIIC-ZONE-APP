'use client';

import { motion } from 'framer-motion';
import { 
    Video, Clapperboard, Palette, Users, Mic, Megaphone, 
    Check, Sparkles, ArrowRight, ShieldCheck, Film, Layers 
} from 'lucide-react';
import Link from 'next/link';

export default function ServicesSection() {
    const services = [
        {
            icon: Clapperboard,
            title: 'Filmmaking & Rodaje Presencial',
            category: 'Producción Audiovisual',
            desc: 'Dirección de arte y filmación in situ con cámaras de cine (Sony FX3/FX6, gimbals, óptica fija e iluminación cinematográfica).',
            features: [
                'Sesiones presenciales mensuales o quincenales',
                'Dirección de actores, médicos y fundadores',
                'Iluminación profesional de 3 puntos y audio lavalier inalámbrico'
            ],
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            icon: Video,
            title: 'Suite de Edición & Color Grading',
            category: 'Post-Producción',
            desc: 'Transformamos material en bruto en reels y piezas dinámicas que atrapan en los primeros 2 segundos y retienen hasta el final.',
            features: [
                'Color grading cinematográfico (LUTs S-Log3)',
                'Subtitulado animado de alta retención',
                'Diseño de sonido (SFX) y música libre de copyright'
            ],
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            icon: Users,
            title: 'Community Management & Estrategia',
            category: 'Social Media',
            desc: 'Tu marca activa los 365 días del año. Estrategia editorial, copies de conversión, moderación y análisis de crecimiento.',
            features: [
                'Calendario mensual aprobado en plataforma',
                'Copywriting persuasivo enfocado en ventas',
                'Monitoreo semanal del nivel de salud de la cuenta'
            ],
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            icon: Palette,
            title: 'Diseño Gráfico & Branding Visual',
            category: 'Diseño & Marca',
            desc: 'Diseño visual que eleva el valor percibido de tus servicios. Carruseles educativos, portadas y material publicitario.',
            features: [
                'Carruseles de alto guardado y compartidos',
                'Identidad gráfica coherente y paletas de color',
                'Piezas de catálogo, menús y brochures digitales'
            ],
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20'
        },
        {
            icon: Mic,
            title: 'Audition Pro & Podcasts',
            category: 'Audio Profesional',
            desc: 'Grabación de podcasts en cabina o estudio, limpieza de ruido, masterización y micro-clips optimizados para TikTok e Instagram.',
            features: [
                'Grabación multi-micrófono Shure SM7B',
                'Mastering de voz y ecualización profesional',
                'Extracción de mejores momentos en formato vertical'
            ],
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        },
        {
            icon: Megaphone,
            title: 'Campañas Meta & TikTok Ads',
            category: 'Pauta & Captación',
            desc: 'Funnels publicitarios optimizados para generar clientes calificados directamente a tu WhatsApp, DM o sitio web.',
            features: [
                'Estructura de testeo de creatividades ganadoras',
                'Segmentación demográfica y por intereses de compra',
                'Retargeting para cerrar prospectos indecisos'
            ],
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        }
    ];

    return (
        <section id="servicios" className="py-24 bg-[#060614] relative overflow-hidden border-t border-white/5">
            {/* Ambient Lighting */}
            <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-1/3 -left-60 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-indigo-400 mb-4">
                        <Film className="w-3.5 h-3.5" />
                        Capacidades del Estudio
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight mb-6">
                        Servicios integrales de producción, <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                            estrategia y amplificación digital.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Todo lo que tu marca necesita para verse como una productora de primer nivel sin tener que contratar a 6 agencias separadas.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((svc, i) => {
                        const Icon = svc.icon;
                        return (
                            <motion.div
                                key={svc.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-12 h-12 rounded-2xl ${svc.bg} border ${svc.border} flex items-center justify-center ${svc.color} group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                                            {svc.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                        {svc.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                        {svc.desc}
                                    </p>

                                    {/* Feature items */}
                                    <div className="space-y-2.5 pt-2 border-t border-white/5">
                                        {svc.features.map((feat, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <Link
                                        href="/onboarding?type=client"
                                        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white transition-colors group/link"
                                    >
                                        Contratar este servicio
                                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
