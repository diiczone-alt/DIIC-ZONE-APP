'use client';

import { motion } from 'framer-motion';
import { 
    Sparkles, Film, Video, Palette, Users, Camera, 
    Mic, ArrowRight, ShieldCheck, CheckCircle2, UserCheck 
} from 'lucide-react';
import Link from 'next/link';

export default function CreativeZoneBanner() {
    const roles = [
        { name: 'Video Editors', icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { name: 'Filmmakers', icon: Film, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { name: 'Diseñadores', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { name: 'Community Mgrs', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { name: 'Fotógrafos', icon: Camera, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { name: 'Locutores & Audio', icon: Mic, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    ];

    return (
        <section id="zona-creativa" className="py-24 bg-gradient-to-b from-[#060614] to-[#03030a] relative overflow-hidden border-t border-white/5">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="p-8 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-transparent border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono uppercase tracking-widest text-amber-300 mb-4">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            Ecosistema de Creadores & Talento
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight mb-6">
                            ¿Eres creador o profesional audiovisual? <br />
                            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-pink-400 bg-clip-text text-transparent">
                                Únete a la Zona Creativa de DIIC ZONE.
                            </span>
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            Conviértete en un <strong>Nodo Certificado</strong>. Conectamos tu talento con marcas líderes que necesitan rodajes, edición de élite, diseño y estrategia mensual constante.
                        </p>
                    </div>

                    {/* Roles Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <div
                                    key={role.name}
                                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/20 transition-all flex flex-col items-center gap-2.5 text-center group"
                                >
                                    <div className={`w-10 h-10 rounded-xl ${role.bg} ${role.border} border flex items-center justify-center ${role.color} group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-300">{role.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Benefits Row */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-12 py-6 border-y border-white/5 text-xs text-gray-300">
                        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Flujo constante de marcas y proyectos</span>
                        </div>
                        <div className="flex items-center gap-2.5 justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Pagos puntuales y seguros por producción</span>
                        </div>
                        <div className="flex items-center gap-2.5 justify-center sm:justify-end">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Acceso a DIIC Academy & Recursos Pro</span>
                        </div>
                    </div>

                    {/* Side-by-Side Quick Action CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/onboarding?type=creative"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            <UserCheck className="w-4 h-4" />
                            Postularme como Creador
                        </Link>

                        <Link
                            href="/onboarding?type=client"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            Soy una Empresa / Registrar Marca
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
