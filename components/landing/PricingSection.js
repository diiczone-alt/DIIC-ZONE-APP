'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
    const plans = [
        {
            id: 'presence',
            name: 'NIVEL PRESENCIA',
            price: '250',
            period: '/mes',
            badge: 'Punto de Partida',
            popular: false,
            narrative: 'Deja de ser invisible. Construimos tu autoridad digital con contenido profesional desde el primer día.',
            features: [
                'Estrategia de contenido mensual',
                'Calendario editorial estructurado',
                'Edición de video y diseño gráfico',
                'Community Management base',
                'Reporte mensual de métricas y salud'
            ],
            cta: 'Comenzar con Presencia',
            highlight: 'border-white/10 hover:border-white/20'
        },
        {
            id: 'growth',
            name: 'NIVEL CRECIMIENTO',
            price: '450',
            period: '/mes',
            badge: 'Más Elegido ✨',
            popular: true,
            narrative: 'Captación activa de clientes. Creamos el sistema audiovisual y publicitario que atrae prospectos a tu WhatsApp 24/7.',
            features: [
                'Todo lo del Plan Presencia',
                'Filmmaker presencial (Sesión de rodaje/mes)',
                'Cámaras de cine 4K e iluminación pro',
                'Gestión de campañas Meta Ads de captación',
                'Monitoreo semanal del Nivel de Salud de marca'
            ],
            cta: 'Escalar Mi Marca',
            highlight: 'border-indigo-500/50 bg-indigo-950/20 shadow-2xl shadow-indigo-950/40'
        },
        {
            id: 'authority',
            name: 'NIVEL AUTORIDAD',
            price: '700',
            period: '/mes',
            badge: 'Máximo Prestigio',
            popular: false,
            narrative: 'Conviértete en el referente #1 de tu nicho. Producción y narrativa cinematográfica para cobrar lo que realmente vales.',
            features: [
                'Todo lo del Plan Crecimiento',
                '2 Sesiones de Rodaje Cinema 4K al mes',
                'Dirección de arte y guiones persuasivos',
                'Embudos de conversión y Retargeting avanzado',
                'Suite completa de post-producción y color grading'
            ],
            cta: 'Dominar Mi Sector',
            highlight: 'border-purple-500/30 hover:border-purple-500/50'
        },
        {
            id: 'elite',
            name: 'NIVEL ÉLITE / CONTROL',
            price: '999',
            period: '/mes',
            badge: 'Full Ecosistema',
            popular: false,
            narrative: 'Dominio omnicanal, viralidad agresiva y automatizaciones para marcas de alto volumen y corporativos.',
            features: [
                'Todo lo del Plan Autoridad',
                'Filmmaker dedicado / Producciones a demanda',
                'Sistemas automatizados e IA de prospección',
                'Funnels High-Ticket y B2B personalizados',
                'Soporte directo con Dirección Creativa'
            ],
            cta: 'Ecosistema Élite',
            highlight: 'border-amber-500/30 hover:border-amber-500/50'
        }
    ];

    return (
        <section id="planes" className="py-24 bg-[#060614] relative overflow-hidden border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-indigo-400 mb-4">
                        <Zap className="w-3.5 h-3.5" />
                        Inversión Transparente
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight mb-6">
                        Planes diseñados para cada etapa <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                            de crecimiento de tu negocio.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Sin contratos de permanencia abusivos ni costos ocultos. Elige el nivel de acompañamiento audiovisual y estratégico que tu empresa necesita.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                    {plans.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className={`p-7 rounded-3xl bg-white/[0.02] border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${p.highlight} ${
                                p.popular ? 'scale-105 z-20 bg-[#0c0c24]/90' : 'hover:bg-white/[0.04]'
                            }`}
                        >
                            {/* Popular Glow Indicator */}
                            {p.popular && (
                                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                            )}

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400">
                                        {p.name}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                                        p.popular ? 'bg-indigo-500 text-white shadow-md' : 'bg-white/5 text-gray-400 border border-white/10'
                                    }`}>
                                        {p.badge}
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl md:text-5xl font-black text-white italic tracking-tight">
                                        ${p.price}
                                    </span>
                                    <span className="text-gray-400 text-xs font-mono">{p.period}</span>
                                </div>

                                <p className="text-gray-400 text-xs leading-relaxed mb-6 min-h-[48px]">
                                    {p.narrative}
                                </p>

                                {/* Features */}
                                <div className="space-y-3 pt-4 border-t border-white/5 mb-8">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block">
                                        Lo que incluye:
                                    </span>
                                    {p.features.map((feat, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href={`/onboarding?type=client&plan=${p.id}`}
                                className={`w-full py-3.5 rounded-2xl text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    p.popular
                                        ? 'bg-white text-black hover:bg-gray-100 shadow-xl shadow-white/10 hover:scale-105'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                }`}
                            >
                                {p.cta}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Guarantee Banner */}
                <div className="mt-16 p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white">Garantía de Satisfacción Creativa</div>
                            <div className="text-[11px] text-gray-400">Ronda de ajustes y revisiones garantizadas en cada entrega de video y diseño.</div>
                        </div>
                    </div>
                    <Link
                        href="/onboarding?type=client"
                        className="text-xs font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-1 shrink-0"
                    >
                        ¿Necesitas un plan personalizado a medida? Contáctanos <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
