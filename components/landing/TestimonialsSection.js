'use client';

import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Carlos Mendoza',
            role: 'Fundador',
            company: 'Spiga de Oro (Gastronomía)',
            avatar: 'C',
            text: 'Antes contrataba editores independientes que demoraban semanas y no entendían el ritmo gastronómico. Con DIIC ZONE, el filmmaker viene a nuestro obrador, grabamos el contenido de todo el mes en una sola mañana y los reels han llenado nuestras mesas cada fin de semana.',
            metric: '+340% de alcance orgánico y mesas llenas',
            rating: 5,
            color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
        },
        {
            name: 'Dra. Andrea Ortega',
            role: 'Directora Médica',
            company: 'Clínica Dermatológica',
            avatar: 'A',
            text: 'El estándar visual en mi consultorio transmite la pulcritud y confianza médica que mi especialidad exige. Los pacientes nuevos llegan diciendo que vieron mis videos educativos sobre cuidado facial en Instagram y agendan directamente por WhatsApp.',
            metric: 'Agenda completa con 3 meses de anticipación',
            rating: 5,
            color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
        },
        {
            name: 'Esteban Salazar',
            role: 'Director Comercial',
            company: 'Urban Living Propiedades',
            avatar: 'E',
            text: 'Los recorridos 4K de departamentos y casas de lujo con tomas de dron y color grading cinematográfico nos permitieron cerrar negociaciones con compradores internacionales que compraron sin viajar físicamente.',
            metric: '$1.2M en ventas inmobiliarias cerradas',
            rating: 5,
            color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
        },
        {
            name: 'Valeria Ramos',
            role: 'Educadora & Podcaster',
            company: 'Finanzas con Propósito',
            avatar: 'V',
            text: 'Grabar mi podcast en el estudio y recibir los micro-clips editados con subtítulos dinámicos y sonido impecable me ahorró más de 20 horas a la semana. Lanzamos nuestro taller digital y logramos sold out en 48 horas.',
            metric: 'Comunidad creció de 5k a 48k seguidores',
            rating: 5,
            color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
        }
    ];

    return (
        <section id="testimonios" className="py-24 bg-[#050510] relative overflow-hidden border-t border-white/5">
            {/* Glow Light */}
            <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-pink-400 mb-4">
                        <Quote className="w-3.5 h-3.5" />
                        Casos de Éxito Reales
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight mb-6">
                        Lo que dicen los fundadores <br />
                        <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                            que transformaron su marca con nosotros.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Historias de crecimiento respaldadas por números, producción constante y resultados comerciales medibles.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                        >
                            <div>
                                {/* Stars & Quote Icon */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-1">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <Quote className="w-6 h-6 text-white/10 group-hover:text-pink-400/40 transition-colors" />
                                </div>

                                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                                    "{t.text}"
                                </p>
                            </div>

                            <div>
                                {/* Impact Metric Tag */}
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 mb-5">
                                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="text-xs font-bold text-emerald-400 font-mono">
                                        {t.metric}
                                    </span>
                                </div>

                                {/* Author Profile */}
                                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${t.color}`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white leading-none">
                                            {t.name}
                                        </h4>
                                        <span className="text-[11px] text-gray-500 mt-1 block">
                                            {t.role} · {t.company}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
