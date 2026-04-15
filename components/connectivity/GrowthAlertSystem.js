'use client';

import { useState } from 'react';
import {
    AlertTriangle, TrendingDown, Clock,
    Zap, Ban, ArrowUpRight,
    CheckCircle2, Info, Sparkles,
    BarChart3, LayoutGrid, Globe,
    Activity, ShieldAlert, Rocket,
    Target, Orbit, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIRecommendationHUD from './AIRecommendationHUD';
import { analyzePerformance } from './SmartAlertEngine';

export default function GrowthAlertSystem() {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'activity',
            severity: 'critical',
            title: 'Baja Actividad Detectada',
            msg: 'Tu presencia digital está bajando. No hemos detectado publicaciones en los últimos 7 días. La constancia es clave para retener a tu audiencia.',
            action: 'Activar Plan de Contenido',
            service: 'Community Manager',
            icon: Clock,
            color: 'red'
        },
        {
            id: 2,
            type: 'performance',
            severity: 'warning',
            title: 'Caída de Alcance (-24%)',
            msg: 'Tus últimos reels han tenido un alcance menor al promedio. Necesitamos optimizar la edición y los ganchos iniciales.',
            action: 'Optimizar Contenido',
            service: 'Revisión Creativa',
            icon: TrendingDown,
            color: 'yellow'
        },
        {
            id: 3,
            type: 'system',
            severity: 'info',
            title: 'Sistema Incompleto',
            msg: 'Tu negocio aún no tiene un CRM activo ni automatización de citas. Esto limita tu capacidad de escala y gestión de leads.',
            action: 'Completar Sistema',
            service: 'CRM / Automatización',
            icon: Globe,
            color: 'blue'
        },
        {
            id: 4,
            type: 'operational',
            severity: 'info',
            title: 'Sugerencia de Revisión',
            msg: 'Es un buen momento para una revisión estratégica de tus ganchos de vídeo. Hemos detectado una oportunidad de mejora en tus últimos contenidos.',
            action: 'Agendar Revisión',
            service: 'Consultoría Estratégica',
            icon: Sparkles,
            color: 'indigo'
        },
        {
            id: 5,
            type: 'operational',
            severity: 'info',
            title: 'Optimización de Contenido',
            msg: 'Recomendamos ajustar el tono de tus publicaciones de la próxima semana para alinearlos con las nuevas tendencias de tu nicho.',
            action: 'Ver Sugerencias',
            service: 'Estrategia de Contenido',
            icon: Target,
            color: 'blue'
        },
        {
            id: 6,
            type: 'intelligence_insight',
            severity: 'success',
            title: 'Tip de IA: Éxito en Nicho',
            msg: 'En tu nicho de mercado, los videos testimoniales cortos (20s) están generando un +40% de retención que los anuncios directos.',
            action: 'Usar este Formato',
            service: 'Producción de Testimonios',
            icon: Sparkles,
            color: 'indigo'
        },
        {
            id: 7,
            type: 'intelligence_insight',
            severity: 'success',
            title: 'Sugerencia de Horario',
            msg: 'Nuestra IA detectó que tu audiencia interactúa un 25% más los Martes a las 7:00 PM. Recomendamos programar tu próximo Reel estrella en ese horario.',
            action: 'Programar Ahora',
            service: 'Community Manager',
            icon: Clock,
            color: 'emerald'
        },
        {
            id: 8,
            type: 'recommendation_insight',
            severity: 'info',
            title: 'Recomendación Estratégica IA',
            msg: 'Tu nueva entrega de video ha sido analizada. Tenemos sugerencias tácticas basadas en patrones de éxito de tu nicho.',
            action: 'Ver Estrategia Pro',
            service: 'Motor de Recomendaciones',
            icon: Sparkles,
            color: 'indigo',
            recommendation_data: {
                focus: 'Retención Temprana',
                insight: 'En tu nicho, los videos educativos con ganchos de pregunta directa retienen un 40% más de audiencia.',
                suggestions: [
                    'El gancho visual de los primeros 2s es potente. Mantener este estilo.',
                    'Añade un CTA de "Guarda este post" al final para aumentar el alcance algorítmico.'
                ],
                bestTime: "7:30 PM",
                confidence: 94
            }
        },
        // --- ALERTAS DEL SAI (Sistema de Alertas Inteligentes) ---
        {
            id: 9,
            type: 'smart_risk',
            severity: 'critical',
            title: '🚨 Alerta de Rendimiento',
            msg: 'Tu audiencia está respondiendo menos (Caída del 28% en comentarios).',
            action: 'Ver recomendación táctica',
            service: 'Smart Alert System',
            icon: AlertTriangle,
            color: 'red',
            strategy: 'Se recomienda ajustar estrategia de contenido y probar un nuevo gancho visual educativo.'
        },
        {
            id: 10,
            type: 'smart_opportunity',
            severity: 'success',
            title: '✨ Oportunidad detectada',
            msg: 'Tu último video educativo está generando un 45% más de compartidos.',
            action: 'Impulsar con pauta',
            service: 'Smart Alert System',
            icon: Sparkles,
            color: 'emerald',
            strategy: 'Este formato está funcionado excepcionalmente bien. Repite este estilo y escala con pauta.'
        }
    ]);

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> Alertas de Crecimiento ({alerts.length})
                </h3>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Supervisión en tiempo real</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <div key={alert.id} className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`relative overflow-hidden bg-[#0A0A12] border border-${alert.color}-500/20 rounded-[32px] p-8 group hover:border-${alert.color}-500/40 transition-all`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${alert.color}-500/5 blur-3xl rounded-full -mr-16 -mt-16`} />

                                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                    <div className={`p-5 rounded-2xl bg-${alert.color}-500/10 text-${alert.color}-400 border border-${alert.color}-500/20`}>
                                        <alert.icon className="w-8 h-8 font-black" />
                                    </div>

                                    <div className="flex-1 space-y-4 text-left">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tight">{alert.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border border-${alert.color}-500/20 bg-${alert.color}-500/10 text-${alert.color}-400`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">
                                            {alert.msg}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-6 pt-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-${alert.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Activaría: <span className="text-white">{alert.service}</span></span>
                                            </div>
                                            <button
                                                onClick={() => removeAlert(alert.id)}
                                                className="ml-auto text-gray-600 hover:text-white transition-colors p-2"
                                            >
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto self-stretch flex items-center">
                                        <button className={`w-full md:w-auto px-10 py-5 bg-${alert.color}-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-${alert.color}-500/20 flex items-center justify-center gap-3 group`}>
                                            {alert.action} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {alert.type === 'recommendation_insight' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4"
                                >
                                    <AIRecommendationHUD data={alert.recommendation_data} />
                                </motion.div>
                            )}

                            {(alert.type === 'smart_risk' || alert.type === 'smart_opportunity') && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`mt-4 p-6 rounded-[32px] border ${alert.type === 'smart_risk' ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${alert.type === 'smart_risk' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            <Lightbulb className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${alert.type === 'smart_risk' ? 'text-red-400' : 'text-emerald-400'}`}>
                                                Orientación Profesional
                                            </span>
                                            <p className="text-sm font-bold text-gray-200 leading-relaxed italic">
                                                "{alert.strategy}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {/* AI GROWTH ADVISOR SUMMARY */}
            <div className="mt-8 bg-indigo-600/5 border border-indigo-500/30 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 text-left relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Sparkles className="w-40 h-40 text-indigo-400" />
                </div>
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Target className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Resumen de Supervisión IA
                    </h4>
                    <p className="text-sm text-gray-300 font-bold italic leading-relaxed">
                        "Detecto que tu velocidad de crecimiento ha bajado un <span className="text-red-400 font-black">15%</span> este mes. Si no corregimos la <span className="text-white">CONSTANCIA</span> y completamos tu <span className="text-white">WEB PROFESIONAL</span>, el salto al Nivel 4 se retrasará 3 meses."
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                        Ver Roadmap
                    </button>
                    <button className="px-8 py-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 border border-white/10">
                        Corregir Ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
