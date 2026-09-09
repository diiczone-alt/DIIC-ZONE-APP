'use client';

import { motion } from 'framer-motion';
import { Award, Star, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function BrandsShowcase() {
    const brands = [
        {
            name: 'Spiga de Oro',
            niche: 'Gastronomía & Panadería',
            result: '+340% Alcance en Reels',
            tag: 'Plan Aceleración',
            badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            initial: 'S'
        },
        {
            name: 'Dra. Andrea Ortega',
            niche: 'Medicina & Dermatología',
            result: 'Agenda Llena 3 Meses',
            tag: 'Plan Autoridad',
            badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
            initial: 'A'
        },
        {
            name: 'Urban Living Propiedades',
            niche: 'Bienes Raíces High-Ticket',
            result: '$1.2M en Ventas Inmobiliarias',
            tag: 'Plan Élite',
            badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
            initial: 'U'
        },
        {
            name: 'Dr. Viteri & Asociados',
            niche: 'Cirugía & Salud Visual',
            result: '+45 Pacientes Nuevos/Mes',
            tag: 'Plan Crecimiento',
            badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            initial: 'V'
        },
        {
            name: 'Kroma Tech Studio',
            niche: 'SaaS & Innovación',
            result: '15.2k Usuarios Registrados',
            tag: 'Plan Presencia',
            badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
            initial: 'K'
        },
        {
            name: 'Terra Natural Foods',
            niche: 'E-commerce & Agro',
            result: '4.8x ROAS en Meta Ads',
            tag: 'Plan Aceleración',
            badgeColor: 'text-green-400 bg-green-500/10 border-green-500/20',
            initial: 'T'
        }
    ];

    return (
        <section id="marcas" className="py-20 bg-[#04040e] relative border-t border-white/5 overflow-hidden">
            {/* Ambient Line */}
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-indigo-400 mb-3">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                            Portafolio & Confianza
                        </div>
                        <h2 className="text-2xl md:text-4xl font-display font-black text-white">
                            Marcas que escalan su presencia con DIIC ZONE
                        </h2>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm max-w-md">
                        Desde marcas personales y profesionales médicos hasta cadenas gastronómicas y empresas de real estate.
                    </p>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {brands.map((b, i) => (
                        <motion.div
                            key={b.name}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-black text-white text-base group-hover:scale-105 transition-transform">
                                        {b.initial}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                                            {b.name}
                                        </h3>
                                        <span className="text-[11px] text-gray-500 block">{b.niche}</span>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${b.badgeColor}`}>
                                    {b.tag}
                                </span>
                            </div>

                            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                <span className="text-gray-400 font-medium flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    Impacto:
                                </span>
                                <span className="font-bold text-emerald-400 font-mono">
                                    {b.result}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust bar */}
                <div className="mt-12 py-6 px-8 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-wrap items-center justify-around gap-6 text-center text-gray-500 text-xs font-mono">
                    <span className="flex items-center gap-2 text-gray-400">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Calidad Audiovisual Cinema 4K
                    </span>
                    <span className="hidden sm:inline text-white/20">|</span>
                    <span className="flex items-center gap-2 text-gray-400">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" /> Nodos Creativos Certificados
                    </span>
                    <span className="hidden sm:inline text-white/20">|</span>
                    <span className="flex items-center gap-2 text-gray-400">
                        <Award className="w-4 h-4 text-pink-400" /> Contratos de Confidencialidad & Propiedad Intelectual
                    </span>
                </div>
            </div>
        </section>
    );
}
