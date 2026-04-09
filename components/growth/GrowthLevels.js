import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, ChevronRight, X, Check, Target, Zap, TrendingUp, ShieldCheck, Rocket, Sparkles } from 'lucide-react';

const LEVELS = [
    { 
        id: "presencia",
        title: "Nivel 1 — Presencia", 
        subtitle: "Base digital y orden", 
        color: "text-blue-400", 
        bg: "bg-blue-500/10", 
        border: "border-blue-500/20",
        icon: Sparkles,
        fullDesc: "El primer paso para cualquier negocio que quiera dominar su mercado. Nos enfocamos en crear una base sólida que transmita confianza y profesionalismo desde el primer contacto.",
        features: ["Optimización de perfil social", "Diseño de identidad visual", "Calendario de contenidos base", "Estrategia de Reels iniciales", "Configuración de biografía y links"],
        goal: "Establecer una identidad coherente y atractiva.",
        metric: "Alcance Orgánico Initial"
    },
    { 
        id: "crecimiento",
        title: "Nivel 2 — Crecimiento", 
        subtitle: "Interacción y visibilidad", 
        color: "text-yellow-400", 
        bg: "bg-yellow-500/10", 
        border: "border-yellow-500/20",
        icon: TrendingUp,
        fullDesc: "Una vez que la base está lista, es hora de atraer miradas. Implementamos estrategias agresivas de alcance para que tu marca llegue a personas que aún no te conocen.",
        features: ["Estrategia de Reels virales", "Pauta publicitaria básica", "Gestión de interacción proactiva", "Colaboraciones estratégicas", "Análisis de competencia directa"],
        goal: "Maximizar la visibilidad y atraer nuevos seguidores.",
        metric: "Tasa de Crecimiento de Seguidores"
    },
    { 
        id: "autoridad",
        title: "Nivel 3 — Autoridad", 
        subtitle: "Posicionamiento fuerte", 
        color: "text-rose-400", 
        bg: "bg-rose-500/10", 
        border: "border-rose-500/20",
        icon: ShieldCheck,
        fullDesc: "No basta con que te vean, deben respetarte. En este nivel, posicionamos tu marca como la autoridad indiscutible en tu nicho mediante contenido de alto valor y prueba social.",
        features: ["Contenido experto (Long-form)", "Casos de éxito y testimonios", "Lead Magnets especializados", "PR Digital y entrevistas", "Estrategia de Webinar / VSL"],
        goal: "Convertir la atención en respeto y confianza absoluta.",
        metric: "Conversión de Visitante a Lead"
    },
    { 
        id: "sistemas",
        title: "Nivel 4 — Sistemas", 
        subtitle: "Automatización y organización", 
        color: "text-amber-400", 
        bg: "bg-amber-500/10", 
        border: "border-amber-500/20",
        icon: Zap,
        fullDesc: "El error de muchos negocios es crecer sin estructura. Aquí implementamos la tecnología necesaria para que tu negocio funcione sin que tú tengas que estar presente en cada paso.",
        features: ["Implementación de CRM", "Automatización de Chatbots", "Funnels de venta automáticos", "Secuencias de Email Marketing", "Sistemas de agendamiento"],
        goal: "Liberar tiempo del fundador y escalar procesos.",
        metric: "ROI de Automatización"
    },
    { 
        id: "escala",
        title: "Nivel 5 — Escala", 
        subtitle: "Ventas y expansión", 
        color: "text-cyan-400", 
        bg: "bg-cyan-500/10", 
        border: "border-cyan-500/20",
        icon: Rocket,
        fullDesc: "El nivel maestro. Una vez que los sistemas están en su lugar, abrimos el grifo. Multiplicamos la inversión y expandimos el alcance a niveles masivos para dominar el mercado.",
        features: ["Escalada de Ads masiva", "Creación de productos digitales", "Lanzamientos de alto impacto", "Expansión a nuevos canales", "Optimización de LTV"],
        goal: "Lograr el máximo potencial de ingresos y dominación.",
        metric: "Revenue Total y LTV (Lifetime Value)"
    }
];

export default function GrowthLevels() {
    const [selectedLevel, setSelectedLevel] = useState(null);

    return (
        <section className="relative py-20">
            <div className="space-y-16">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Etapas del Negocio
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tight leading-[1.1]">
                        NIVELES DE <span className="inline-block px-1 text-blue-500 italic font-black">CRECIMIENTO</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-black uppercase tracking-widest pt-2">
                        Haz clic en cada nivel para ver los detalles estratégicos.
                    </p>
                </motion.div>

                <div className="space-y-4 max-w-3xl">
                    {LEVELS.map((level, idx) => {
                        const pureBg = level.bg.replace('/10', '');
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => setSelectedLevel(level)}
                                className="group relative p-6 md:p-8 rounded-3xl border border-white/5 transition-all duration-500 flex items-center justify-between cursor-pointer overflow-hidden bg-[#05050B] hover:bg-[#0A0A12] shadow-xl hover:shadow-2xl hover:border-white/10"
                            >
                                {/* External Ambient Glow (Behind border) */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 ${pureBg}`} />

                                {/* Neon Left Accent Bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${pureBg} opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_20px_2px_currentColor]`} />
                                
                                {/* Inner glass highlight */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Content Container */}
                                <div className="flex items-center gap-6 md:gap-8 relative z-10 w-full">
                                    {/* Elevated Icon Container */}
                                    <div className="relative shrink-0">
                                        <div className={`absolute inset-0 ${pureBg} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl`} />
                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#090910] flex items-center justify-center ${level.color} border border-white/[0.05] group-hover:border-white/20 group-hover:scale-110 transition-all duration-500 relative z-10 shadow-inner`}>
                                            <level.icon className="w-6 h-6 md:w-7 md:h-7 fill-current opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_12px_currentColor]" />
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-gray-300 group-hover:text-white transition-colors drop-shadow-md">
                                                {level.title}
                                            </h3>
                                            {/* Dynamic Neon Tag */}
                                            <div className={`hidden sm:flex px-2.5 py-0.5 rounded-full ${level.bg} border ${level.border} items-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${pureBg} animate-pulse mr-1.5 shadow-[0_0_8px_currentColor]`} />
                                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${level.color}`}>ACTIVATE</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-gray-600 group-hover:text-gray-400 transition-colors">
                                            {level.subtitle}
                                        </p>
                                    </div>

                                    {/* Action Arrow */}
                                    <div className="flex items-center gap-5 relative z-10 shrink-0">
                                        <div className="hidden sm:block text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                                            EXPLORAR
                                        </div>
                                        <div className={`p-3 rounded-full bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.05] group-hover:${level.border} transition-colors duration-300 shadow-md`}>
                                            <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${level.color} group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_currentColor] transition-all duration-300`} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Premium Level Modal */}
            <AnimatePresence>
                {selectedLevel && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
                        {/* Backdrop with extreme blur for focus */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLevel(null)}
                            className="absolute inset-0 bg-[#02020A]/95 backdrop-blur-[32px]"
                        />

                        {/* Modal Content - Neon & World Class */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, shadow: 0, y: 40 }}
                            className={`relative w-full max-w-5xl max-h-[90vh] bg-[#050510] border ${selectedLevel.border} rounded-[56px] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col`}
                            style={{ 
                                boxShadow: `0 0 60px -15px ${selectedLevel.id === 'presencia' ? '#3b82f6' : selectedLevel.id === 'crecimiento' ? '#eab308' : selectedLevel.id === 'autoridad' ? '#f43f5e' : selectedLevel.id === 'sistemas' ? '#f59e0b' : '#06b6d4'}44`
                            }}
                        >
                            {/* Animated Neon Border Effect */}
                            <div className={`absolute inset-0 border-2 ${selectedLevel.border} opacity-20 pointer-events-none rounded-[56px]`} />
                            
                            {/* Decorative Background Dynamic Glows */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute top-0 right-0 w-[500px] h-[500px] ${selectedLevel.bg} blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2 z-0`} 
                            />
                            <motion.div 
                                animate={{ 
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${selectedLevel.bg} blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2 z-0`} 
                            />

                            {/* Header Section - Compact */}
                            <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between border-b border-white/5 bg-white/[0.01] backdrop-blur-xl z-20 overflow-hidden">
                                <button 
                                    onClick={() => setSelectedLevel(null)}
                                    className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/10 group active:scale-90 z-30"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left w-full">
                                    <div className={`shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-black shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10 flex items-center justify-center ${selectedLevel.color} relative group`}>
                                        <div className={`absolute inset-0 ${selectedLevel.bg} blur-2xl opacity-30 group-hover:opacity-60 transition-opacity`} />
                                        <selectedLevel.icon className="w-10 h-10 md:w-12 md:h-12 relative z-10 drop-shadow-[0_0_10px_currentColor]" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                            <span className={`px-3 py-1 ${selectedLevel.bg} ${selectedLevel.color} border ${selectedLevel.border} rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                                STRATEGIC EVOLUTION
                                            </span>
                                            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                                <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest">Active Hub</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                                                {selectedLevel.title}
                                            </h2>
                                            <p className="text-gray-500 text-sm md:text-base font-bold uppercase tracking-[0.2em] opacity-80">{selectedLevel.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Scrollable Content - Refined "Perfect Measure" */}
                            <div className="relative flex-1 overflow-y-auto px-10 md:px-14 py-10 lg:py-14 custom-scrollbar z-20">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    
                                    {/* Left Column: Context */}
                                    <div className="lg:col-span-12 xl:col-span-7 space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-1 bg-gradient-to-r ${selectedLevel.id === 'presencia' ? 'from-blue-500' : selectedLevel.id === 'crecimiento' ? 'from-yellow-500' : selectedLevel.id === 'autoridad' ? 'from-rose-500' : selectedLevel.id === 'sistemas' ? 'from-amber-500' : 'from-cyan-500'} to-transparent rounded-full`} />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Strategic Insight</h4>
                                            </div>
                                            <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-medium leading-[1.3] italic tracking-tight font-display">
                                                "{selectedLevel.fullDesc}"
                                            </p>
                                        </div>

                                        {/* Features Tiles */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Operational Roadmap</h4>
                                                <div className="flex-1 h-px bg-white/5" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedLevel.features.map((feature, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 + (i * 0.05) }}
                                                        className="flex items-start gap-4 p-5 rounded-[28px] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group/feat relative overflow-hidden"
                                                    >
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${selectedLevel.bg} opacity-0 group-hover/feat:opacity-5 transition-opacity`} />
                                                        <div className={`mt-1 shrink-0 w-5 h-5 rounded-lg flex items-center justify-center bg-black border border-white/10 ${selectedLevel.color} shadow-lg group-hover/feat:scale-110 transition-transform`}>
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                        <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-gray-400 group-hover/feat:text-white transition-colors leading-tight">
                                                            {feature}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: KPIs & Action */}
                                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                                        <div className="p-8 md:p-10 rounded-[48px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 space-y-10 shadow-3xl relative overflow-hidden group/card shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                                            <div className={`absolute top-0 right-0 w-32 h-32 ${selectedLevel.bg} blur-[60px] rounded-full opacity-20`} />
                                            
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 text-center relative z-10">Strategic Success</h4>
                                            
                                            <div className="space-y-8 relative z-10">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-rose-500/80">
                                                        <Target className="w-5 h-5" />
                                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-none">Primary Objective</span>
                                                    </div>
                                                    <div className="text-xl md:text-2xl lg:text-3xl font-black italic uppercase tracking-tighter text-white leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                                        {selectedLevel.goal}
                                                    </div>
                                                </div>

                                                <div className="w-full h-px bg-white/10" />

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-cyan-500/80">
                                                        <Zap className="w-5 h-5" />
                                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-none">Critical Metric</span>
                                                    </div>
                                                    <div className="text-xl md:text-2xl lg:text-3xl font-black italic uppercase tracking-tighter text-white leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                                        {selectedLevel.metric}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 relative z-10">
                                                <button 
                                                    className={`w-full py-6 rounded-[28px] ${selectedLevel.bg} ${selectedLevel.color} border ${selectedLevel.border} font-black uppercase tracking-[0.4em] text-[10px] hover:brightness-125 transition-all shadow-2xl shadow-black/80 group relative overflow-hidden active:scale-95`}
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                                        EXECUTE PROTOCOL
                                                        <Rocket className="w-5 h-5 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-all duration-500" />
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Status Tag */}
                                        <div className="px-10 py-5 rounded-[28px] bg-white/[0.01] border border-white/5 flex items-center justify-center gap-3 shadow-xl">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-400 group-hover:text-white transition-colors">READY FOR DEPLOYMENT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Accent Decoration */}
                            <div className="h-2.5 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
