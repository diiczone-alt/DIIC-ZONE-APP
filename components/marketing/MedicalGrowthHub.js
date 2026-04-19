'use client';

import { motion } from 'framer-motion';
import { 
    Stethoscope, Users, TrendingUp, MessageSquare, Zap, 
    CheckCircle2, ArrowRight, Award, BarChart3, Target,
    Activity, Shield
} from 'lucide-react';

export default function MedicalGrowthHub({ isInternal = false }) {
    const levels = [
        {
            level: 1,
            title: "Presencia Digital",
            subtitle: "Empieza a verte profesional en redes",
            investment: { monthly: "$200 – $250" },
            color: "indigo",
            features: [
                "Auditoría de redes",
                "Optimización de perfil",
                "Definición de marca personal",
                "2 reels + 2 piezas gráficas"
            ],
            result: "Ideal para comenzar con orden y coherencia."
        },
        {
            level: 2,
            title: "Estrategia",
            subtitle: "Empieza a generar pacientes constantes",
            investment: { monthly: "$400 – $600" },
            color: "blue",
            recommended: true,
            features: [
                "Estrategia mensual personalizada",
                "4–6 reels de alta calidad",
                "Gestión de Community Manager",
                "Calendario estratégico"
            ],
            result: "Tu contenido deja de informar y empieza a convertir."
        },
        {
            level: 3,
            title: "Automatización",
            subtitle: "Convierte mensajes en pacientes sin perder tiempo",
            investment: { monthly: "$150 – $300" },
            color: "emerald",
            features: [
                "Implementación de CRM",
                "Automatización en WhatsApp",
                "Embudo de mensajes",
                "Captación de leads"
            ],
            result: "Menos tiempo respondiendo, más pacientes agendados."
        },
        {
            level: 4,
            title: "Autoridad",
            subtitle: "Posiciónate como referente en tu especialidad",
            investment: { monthly: "$800 – $1200+" },
            color: "purple",
            features: [
                "Producción avanzada (2 sesiones)",
                "6–10 reels premium",
                "Videos de alto impacto",
                "Branding institucional fuerte"
            ],
            result: "Mayor valor percibido y reconocimiento sectorial."
        },
        {
            level: 5,
            title: "Performance",
            subtitle: "Acelera tus resultados con publicidad",
            investment: { management: "$200 – $400" },
            color: "amber",
            features: [
                "Campañas en Meta Ads",
                "Generación masiva de leads",
                "Optimización constante",
                "Reporte de conversiones"
            ],
            result: "Flujo constante y predecible de pacientes nuevos."
        }
    ];

    return (
        <div className={`text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden ${isInternal ? '' : 'min-h-screen bg-[#05050a]'}`}>
            
            {!isInternal && (
                <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter italic">DIIC <span className="text-indigo-500 italic">HEALTH</span></span>
                    </div>
                </nav>
            )}

            {/* HERO SECTION */}
            <section className={`relative z-10 px-6 max-w-5xl mx-auto text-center ${isInternal ? 'pt-8 pb-12' : 'pt-20 pb-16'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                >
                    <Shield className="w-3 h-3" /> Protocolo de Crecimiento Médico
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-black italic uppercase tracking-tighter leading-[0.9] mb-8 ${isInternal ? 'text-4xl md:text-6xl' : 'text-5xl md:text-8xl'}`}
                >
                    Escala tu consulta con una <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-400 to-purple-500">estrategia de alto impacto</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-lg md:text-xl font-medium max-w-3xl mx-auto mb-12"
                >
                    Estrategias diseñadas para que especialistas generen confianza y logren que el seguidor se convierta en paciente de forma recurrente.
                </motion.p>
            </section>

            {/* LEVELS SECTION */}
            <section className="relative z-10 px-6 py-12">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Mapa Estretégico</span>
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
                        Sistema Institucional <span className="text-indigo-500">DIIC HEALTH</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {levels.map((lvl, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-[32px] border flex flex-col h-full relative group transition-all ${
                                lvl.recommended 
                                ? 'bg-indigo-600 border-indigo-400 shadow-[0_20px_60px_rgba(79,70,229,0.3)] scale-[1.02] z-20' 
                                : 'bg-white/5 border-white/5 hover:border-white/20 z-10'
                            }`}
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <span className={`text-4xl font-black italic opacity-20 ${lvl.recommended ? 'text-white' : 'text-gray-500'}`}>0{lvl.level}</span>
                                <div className={`p-3 rounded-2xl ${lvl.recommended ? 'bg-white/10 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                    {lvl.level === 1 && <Users className="w-6 h-6" />}
                                    {lvl.level === 2 && <TrendingUp className="w-6 h-6" />}
                                    {lvl.level === 3 && <Zap className="w-6 h-6" />}
                                    {lvl.level === 4 && <Award className="w-6 h-6" />}
                                    {lvl.level === 5 && <Target className="w-6 h-6" />}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black italic uppercase leading-tight mb-2">{lvl.title}</h3>
                                <p className={`text-xs ${lvl.recommended ? 'text-white/80' : 'text-gray-500'}`}>{lvl.subtitle}</p>
                            </div>

                            <div className="mb-8 space-y-3 flex-1">
                                {lvl.features.map((feat, fi) => (
                                    <div key={fi} className="flex items-start gap-3">
                                        <CheckCircle2 className={`w-4 h-4 mt-1 flex-shrink-0 ${lvl.recommended ? 'text-emerald-400' : 'text-indigo-500'}`} />
                                        <span className={`text-sm font-semibold ${lvl.recommended ? 'text-white' : 'text-gray-300'}`}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={`mt-auto pt-8 border-t ${lvl.recommended ? 'border-white/10' : 'border-white/5'} space-y-4`}>
                                <div className={`p-3 rounded-xl text-xs font-bold leading-relaxed ${lvl.recommended ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-400'}`}>
                                    {lvl.result}
                                </div>
                                <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    lvl.recommended ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                                }`}>
                                    Solicitar este Nivel
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {!isInternal && (
                <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
                    © 2026 DIIC ZONE v2.0 • Protocolo de Salud Digital
                </footer>
            )}
        </div>
    );
}
