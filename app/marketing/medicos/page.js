'use client';

import { motion } from 'framer-motion';
import { 
    Stethoscope, 
    Users, 
    TrendingUp, 
    MessageSquare, 
    Zap, 
    CheckCircle2, 
    ArrowRight, 
    Award, 
    BarChart3, 
    Target,
    Activity,
    Shield
} from 'lucide-react';

export default function MedicalMarketingLanding() {
    const levels = [
        {
            level: 1,
            title: "Presencia Digital",
            subtitle: "Empieza a verte profesional en redes",
            investment: { setup: "$100 – $150", monthly: "$200 – $250" },
            color: "indigo",
            features: [
                "Auditoría de redes",
                "Optimización de perfil",
                "Definición de marca personal",
                "1 sesión de grabación mensual",
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
                "1 video profesional de autoridad",
                "Gestión de Community Manager",
                "Calendario estratégico"
            ],
            result: "Tu contenido deja de informar y empieza a convertir."
        },
        {
            level: 3,
            title: "Automatización",
            subtitle: "Convierte mensajes en pacientes sin perder tiempo",
            investment: { setup: "$300 – $800", monthly: "$150 – $300" },
            color: "emerald",
            features: [
                "Implementación de CRM",
                "Automatización en WhatsApp",
                "Embudo de mensajes",
                "Landing page básica",
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
                "Estrategia de posicionamiento",
                "Branding institucional fuerte"
            ],
            result: "Mayor valor percibido y reconocimiento sectorial."
        },
        {
            level: 5,
            title: "Performance",
            subtitle: "Acelera tus resultados con publicidad",
            investment: { management: "$200 – $400", ads: "Presupuesto variable" },
            color: "amber",
            features: [
                "Campañas en Meta Ads",
                "Generación masiva de leads",
                "Optimización constante",
                "Reporte de conversiones",
                "Retargeting avanzado"
            ],
            result: "Flujo constante y predecible de pacientes nuevos."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
            {/* BACKGROUND DECORATION */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            {/* NAVBAR */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter italic">DIIC <span className="text-indigo-500 italic">HEALTH</span></span>
                </div>
                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    Inicia Sesión
                </button>
            </nav>

            {/* HERO SECTION */}
            <section className="relative z-10 px-6 pt-20 pb-16 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                >
                    <Shield className="w-3 h-3" /> Exclusivo para Médicos & Especialistas
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8"
                >
                    Convierte tus redes en una <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-400 to-purple-500">máquina de atraer pacientes</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-12"
                >
                    Creamos estrategias, contenido y sistemas para que médicos generen confianza, posicionamiento y más consultas sin depender del boca a boca.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <button className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                        Agendar una asesoría
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full md:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        Ver planes
                    </button>
                </motion.div>
            </section>

            {/* THE PROBLEM */}
            <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                            El problema no es <br /> tu contenido...
                        </h2>
                        <div className="space-y-4">
                            {[
                                "Publicas sin una estrategia clara",
                                "Tus seguidores no se convierten en pacientes",
                                "No logras transmitir autoridad real"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">×</div>
                                    <p className="text-gray-300 font-bold">{text}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-3xl font-black text-indigo-400 italic">
                            Es que no existe un sistema detrás.
                        </p>
                    </div>
                    <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] to-transparent z-10" />
                        <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-indigo-600/30 transition-colors z-0" />
                        <div className="absolute inset-x-8 bottom-8 z-20 space-y-2">
                            <span className="p-2 bg-indigo-500 rounded text-[8px] font-black uppercase tracking-widest">DIIC ZONE STRATEGY</span>
                            <p className="text-2xl font-black italic uppercase italic tracking-tighter">Dejamos de ser informativos para ser convertidores.</p>
                        </div>
                        <Stethoscope className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-white/5" />
                    </div>
                </div>
            </section>

            {/* LEVELS SECTION */}
            <section className="relative z-10 px-6 py-24 bg-white/5">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Hoja de Ruta de Crecimiento</span>
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                        No hacemos solo contenido. <br /> Creamos un <span className="text-indigo-500">Sistema</span>.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Te ayudamos a escalar desde lo básico hasta convertirte en el referente de tu especialidad mediante 5 niveles estratégicos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto content-start">
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
                                : 'bg-black/40 border-white/5 hover:border-white/20 z-10'
                            }`}
                        >
                            {lvl.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                                    Recomendado
                                </div>
                            )}

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
                                <p className={`text-sm ${lvl.recommended ? 'text-white/80' : 'text-gray-500'}`}>{lvl.subtitle}</p>
                            </div>

                            <div className="mb-8 space-y-3 flex-1 text-left">
                                {lvl.features.map((feat, fi) => (
                                    <div key={fi} className="flex items-start gap-3">
                                        <CheckCircle2 className={`w-4 h-4 mt-1 flex-shrink-0 ${lvl.recommended ? 'text-emerald-400' : 'text-indigo-500'}`} />
                                        <span className={`text-sm font-semibold ${lvl.recommended ? 'text-white' : 'text-gray-300'}`}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={`mt-auto pt-8 border-t ${lvl.recommended ? 'border-white/10' : 'border-white/5'} space-y-4`}>
                                <div className="space-y-1">
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${lvl.recommended ? 'text-white/60' : 'text-gray-600'}`}>Inversión Estimada</span>
                                    {Object.entries(lvl.investment).map(([key, val]) => (
                                        <p key={key} className="text-xl font-black italic">
                                            <span className="text-[10px] uppercase font-bold text-gray-500 mr-2">{key}:</span>
                                            {val}
                                        </p>
                                    ))}
                                </div>
                                <div className={`p-3 rounded-xl text-xs font-bold leading-relaxed ${lvl.recommended ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-400'}`}>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mr-2">➜</span>
                                    {lvl.result}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative z-10 px-6 py-32 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-16 rounded-[60px] bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <MessageSquare className="w-64 h-64 rotate-12" />
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4 relative z-10">
                        No necesitas <br /> más seguidores...
                    </h2>
                    <p className="text-3xl md:text-5xl font-black text-indigo-500 italic uppercase mb-12 relative z-10">
                        Necesitas más pacientes
                    </p>
                    
                    <div className="space-y-6 relative z-10">
                        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                            Tu contenido puede ser la diferencia entre que te vean... o que confíen en ti. Entre que te sigan... o que te escriban.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                            <button className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                                Agendar Asesoría Ahora
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full md:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                WhatsApp Directo
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 px-6 py-12 border-t border-white/5 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
                © 2026 DIIC ZONE v2.0 • Protocolo de Salud Digital • Todos los derechos reservados
            </footer>
        </div>
    );
}
