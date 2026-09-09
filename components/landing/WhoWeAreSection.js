'use client';

import { motion } from 'framer-motion';
import { 
    Film, Cpu, Sparkles, Target, Zap, Award, 
    TrendingUp, Video, Compass, Layers, CheckCircle2 
} from 'lucide-react';

export default function WhoWeAreSection() {
    const values = [
        {
            icon: Film,
            title: 'Narrativa Cinematográfica',
            desc: 'No hacemos contenido genérico. Desarrollamos producciones con estándares de cine (4K/6K S-Log, color grading e iluminación de estudio) que elevan el estatus de tu marca.',
            color: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20'
        },
        {
            icon: Cpu,
            title: 'Inteligencia Artificial Aplicada',
            desc: 'Integramos agentes de IA y automatización para análisis de audiencia, optimización de copies, transcripción y optimización de flujos de post-producción sin fricción.',
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20'
        },
        {
            icon: Target,
            title: 'Obsesión por la Conversión',
            desc: 'La estética sin estrategia es un costo; la estética con estrategia es inversión. Cada pieza audiovisual y campaña está diseñada para atraer clientes calificados.',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            icon: Zap,
            title: 'Agilidad y Ecosistema Centralizado',
            desc: 'Olvídate de coordinar por WhatsApp a 5 freelancers sueltos. En DIIC ZONE todo tu equipo (filmmaker, editor, diseñador, CM) opera sincronizado en una sola plataforma.',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        }
    ];

    const stats = [
        { value: '+500', label: 'Piezas Producidas', sub: 'Reels, Anuncios & Spots' },
        { value: '4K Cinema', label: 'Estándar Audiovisual', sub: 'Sony FX3 & Cinema Glass' },
        { value: '98%', label: 'Satisfacción', sub: 'Aprobaciones en primera fase' },
        { value: '3.4x', label: 'Retorno Promedio', sub: 'Crecimiento de leads calificados' },
    ];

    return (
        <section id="quienes-somos" className="py-24 relative overflow-hidden bg-[#060614] border-t border-white/5">
            {/* Ambient Background Lights */}
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
                            <Compass className="w-3.5 h-3.5" />
                            Quiénes Somos & Manifiesto
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight mb-6">
                            El estudio audiovisual del futuro, <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                                impulsado por talento & tecnología.
                            </span>
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                            Nacimos para romper el modelo tradicional de las agencias lentas y costosas. 
                            <strong> DIIC ZONE</strong> es un estudio híbrido de producción audiovisual, marketing estratégico y desarrollo tecnológico donde directores creativos, cineastas, editores y algoritmos de IA trabajan bajo un mismo pulso.
                        </p>
                    </motion.div>
                </div>

                {/* Manifesto Feature Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-xl relative overflow-hidden mb-16 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Film className="w-64 h-64 text-indigo-400" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                        <div className="space-y-6">
                            <div className="inline-block px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[11px] font-black uppercase tracking-wider">
                                Nuestra Filosofía
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white leading-snug">
                                "La atención humana no se compra con fórmulas baratas: se conquista con historias visuales de alto impacto."
                            </h3>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                Cada marca tiene un ADN irrepetible. Por eso no usamos plantillas genéricas. 
                                Diseñamos sistemas audiovisuales personalizados según tu nicho (médico, gastronómico, inmobiliario, e-commerce o corporativo), garantizando que tu contenido respire autoridad, elegancia y rentabilidad.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {[
                                    'Dirección de arte personalizada',
                                    'Flujo de render y aprobación en tiempo real',
                                    'Estrategia de distribución omnicanal',
                                    'Monitoreo y métricas de conversión'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metric Highlights Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-6 rounded-2xl bg-[#08081a]/80 border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col justify-between"
                                >
                                    <span className="text-3xl md:text-4xl font-black italic text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                                        {stat.value}
                                    </span>
                                    <div className="mt-3">
                                        <div className="text-xs font-bold text-gray-200">{stat.label}</div>
                                        <div className="text-[10px] text-gray-500">{stat.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Studio Core Pillars */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v, i) => {
                        const Icon = v.icon;
                        return (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className={`p-6 rounded-2xl bg-white/[0.02] border ${v.border} hover:bg-white/[0.05] transition-all duration-300 group flex flex-col justify-between`}
                            >
                                <div>
                                    <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center ${v.color} mb-5 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-base font-bold text-white mb-2.5">{v.title}</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
