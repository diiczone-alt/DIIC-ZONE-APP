'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Stethoscope, UtensilsCrossed, Home, User, ShoppingBag, 
    Briefcase, GraduationCap, Sprout, ArrowRight, CheckCircle2, 
    Layers, Video, Camera, Sparkles 
} from 'lucide-react';

export default function NicheExplorer() {
    const niches = [
        {
            id: 'doctor',
            label: 'Médico & Salud',
            icon: Stethoscope,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            glow: 'rgba(239, 68, 68, 0.15)',
            headline: 'Autoridad clínica que transforma visitas en pacientes agendados.',
            description: 'Producción audiovisual ética, lenguaje médico riguroso y estética premium para clínicas, cirujanos y especialistas que quieren liderar su sector.',
            deliverables: [
                'Sesiones de rodaje en consultorio/clínica con iluminación suave',
                'Explicación de procedimientos y testimonios con consentimiento',
                'Campañas Meta Ads para agenda directa por WhatsApp',
                'Estrategia de posicionamiento de alta confianza'
            ],
            metrics: '+40% Agendamientos de primeras citas'
        },
        {
            id: 'horeca',
            label: 'Gastronomía & Food',
            icon: UtensilsCrossed,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            glow: 'rgba(249, 115, 22, 0.15)',
            headline: 'Contenido sensorial y tentador que llena tus mesas todos los días.',
            description: 'Planificación de tomas B-Roll en cocina, preparación de platos, ambiente del local y promociones diseñadas para despertar el apetito y la viralidad local.',
            deliverables: [
                'Macro-tomas de textura, humo, corte y preparación culinaria',
                'Reels dinámicos con audio en tendencia y ganchos adictivos',
                'Campañas de geolocalización para fines de semana y delivery',
                'Diseño de menú digital y piezas promocionales'
            ],
            metrics: '+300% Tráfico al local en fines de semana'
        },
        {
            id: 'realestate',
            label: 'Bienes Raíces',
            icon: Home,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            glow: 'rgba(99, 102, 241, 0.15)',
            headline: 'Recorridos cinematográficos que aceleran el cierre de propiedades de lujo.',
            description: 'Tours arquitectónicos 4K con estabilización pro, tomas de dron y narrativa inmobiliaria enfocada en inversionistas y compradores de alta gama.',
            deliverables: [
                'Tours cinematográficos con locución y detalles arquitectónicos',
                'Reels de impacto con datos de rentabilidad y metros cuadrados',
                'Campañas segmentadas para inversionistas locales e internacionales',
                'Portafolio digital sincronizado para brokers'
            ],
            metrics: 'Leads calificados con ticket > $100k'
        },
        {
            id: 'personal',
            label: 'Marca Personal',
            icon: User,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            glow: 'rgba(59, 130, 246, 0.15)',
            headline: 'Conviértete en la voz referente de tu industria y monetiza tu conocimiento.',
            description: 'Producción de podcasts en estudio, micro-cápsulas de conocimiento, storytelling de vida y embudos de captación para consultores, conferencistas y líderes.',
            deliverables: [
                'Grabación multi-cámara en estudio con micrófonos Shure broadcast',
                'Edición dinámica con subtítulos animados y b-rolls ilustrativos',
                'Estrategia de contenidos en LinkedIn, Instagram y YouTube Shorts',
                'Embudos de conversión para asesorías y programas high-ticket'
            ],
            metrics: '10x Crecimiento en solicitudes de conferencias/asesorías'
        },
        {
            id: 'ecommerce',
            label: 'E-commerce & Retail',
            icon: ShoppingBag,
            color: 'text-fuchsia-400',
            bg: 'bg-fuchsia-500/10',
            border: 'border-fuchsia-500/20',
            glow: 'rgba(217, 70, 239, 0.15)',
            headline: 'Video-ads directos a venta y catálogos que rompen objeciones.',
            description: 'UGC creativo, demostraciones de uso del producto, unboxings cuidados y creatividades optimizadas para alto rendimiento en pauta digital.',
            deliverables: [
                'Demostración visual de producto y resolución de objeciones',
                'Creatividades en formatos 9:16 y 1:1 listas para Meta y TikTok Ads',
                'Copywriting persuasivo enfocado en carritos de compra',
                'Testeo continuo de creatividades ganadoras'
            ],
            metrics: '4.5x Retorno sobre inversión en pauta (ROAS)'
        },
        {
            id: 'education',
            label: 'Educación & Cursos',
            icon: GraduationCap,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            glow: 'rgba(234, 179, 8, 0.15)',
            headline: 'Lanza programas formativos y llena salones o plataformas virtuales.',
            description: 'Producción de masterclasses, videos testimoniales de alumnos y estrategias de lanzamientos digitales para academias e instructores.',
            deliverables: [
                'Grabación y estructuración de módulos formativos en alta resolución',
                'Reels educativos con ganchos de retención para captación de leads',
                'Páginas de aterrizaje y funnels de webinar automatizados',
                'Estrategia de lanzamiento orgánico y pagado'
            ],
            metrics: 'Sold Out en convocatorias de talleres'
        },
        {
            id: 'consulting',
            label: 'B2B & Corporativo',
            icon: Briefcase,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            glow: 'rgba(16, 185, 129, 0.15)',
            headline: 'Credibilidad institucional para ganar licitaciones y contratos de alto valor.',
            description: 'Videos de presentación empresarial, casos de estudio en video, cobertura de eventos y posicionamiento corporativo.',
            deliverables: [
                'Spot institucional corporativo con estética premium',
                'Entrevistas a clientes y testimonios de casos de éxito',
                'Estrategia de contenidos para tomadores de decisiones en LinkedIn',
                'Diseño de propuestas comerciales y brochures interactivos'
            ],
            metrics: 'Cierres de contratos B2B con empresas líderes'
        }
    ];

    const [selectedNiche, setSelectedNiche] = useState(niches[0]);

    return (
        <section id="nichos" className="py-24 bg-[#050510] relative overflow-hidden border-t border-white/5">
            {/* Ambient Background Glow */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-all duration-700"
                style={{ backgroundColor: selectedNiche.glow }}
            />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Ecosistema Adaptativo
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight mb-6">
                        Tu nicho es único. <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                            Nuestra producción se adapta a tu industria.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Selecciona tu sector para ver cómo DIIC ZONE diseña el flujo de grabación, el tono visual y la estrategia exacta para tu tipo de cliente.
                    </p>
                </div>

                {/* Niches Tab Selector (Horizontal scrollable or grid) */}
                <div className="flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
                    {niches.map((n) => {
                        const Icon = n.icon;
                        const isSelected = selectedNiche.id === n.id;
                        return (
                            <button
                                key={n.id}
                                onClick={() => setSelectedNiche(n)}
                                className={`px-4 py-3 rounded-2xl border text-xs font-bold whitespace-nowrap flex items-center gap-2.5 transition-all duration-300 shrink-0 ${
                                    isSelected
                                        ? 'bg-white/10 border-white/30 text-white shadow-xl scale-105'
                                        : `${n.border} ${n.color} bg-white/[0.02] hover:bg-white/[0.06] opacity-70 hover:opacity-100`
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {n.label}
                            </button>
                        );
                    })}
                </div>

                {/* Active Niche Detailed Showcase Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedNiche.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="p-8 md:p-12 rounded-3xl bg-[#08081a]/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="grid lg:grid-cols-12 gap-8 items-center">
                            {/* Left Info (7 cols) */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl ${selectedNiche.bg} border ${selectedNiche.border} flex items-center justify-center ${selectedNiche.color}`}>
                                        <selectedNiche.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold block">
                                            Estrategia de Nicho Especializado
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-black text-white">
                                            {selectedNiche.label}
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-lg font-bold text-gray-200 leading-snug">
                                    "{selectedNiche.headline}"
                                </p>

                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {selectedNiche.description}
                                </p>

                                {/* Deliverables List */}
                                <div className="space-y-3 pt-2">
                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                        Entregables & Sistema Incluido:
                                    </span>
                                    <div className="grid sm:grid-cols-2 gap-2.5">
                                        {selectedNiche.deliverables.map((deliv, idx) => (
                                            <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{deliv}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Action & Metric Callout (5 cols) */}
                            <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 space-y-6">
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-black block mb-2">
                                        Métrica Promedio Alcanzada
                                    </span>
                                    <div className="text-2xl md:text-3xl font-black text-emerald-400 italic">
                                        {selectedNiche.metrics}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-2">
                                        Resultados medidos en marcas bajo plan de aceleración constante durante los primeros 90 días.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <Link
                                        href={`/onboarding?type=client&niche=${selectedNiche.id}`}
                                        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white hover:bg-gray-100 text-black font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                                    >
                                        Elegir Plan para {selectedNiche.label}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <p className="text-[10px] text-center text-gray-500">
                                        Configuración guiada en menos de 2 minutos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
