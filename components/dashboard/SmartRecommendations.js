'use client';

import { useState, useEffect } from 'react';
import { Bot, Sparkles, Video, Megaphone, Target, Settings, TrendingUp, Palette, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Simulación de base de conocimiento experta
const getRecommendations = (level, niche = 'health') => {
    // Textos adaptados por nicho
    const nicheTexts = {
        health: {
            content: 'Los doctores que educan a sus pacientes fidelizan un 40% más.',
            campaign: 'Los pacientes buscan "confianza". Lanza una campaña de testimonios.',
            noun: 'pacientes'
        },
        real_estate: {
            content: 'Muestra tours virtuales. El video vende 3x más propiedades.',
            campaign: 'Segmenta por código postal para captar compradores locales.',
            noun: 'clientes'
        },
        general: {
            content: 'El contenido educativo posiciona tu marca como autoridad.',
            campaign: 'Activa campañas de retargeting para recuperar visitas.',
            noun: 'seguidores'
        }
    };

    const context = nicheTexts[niche] || nicheTexts.general;

    const db = {
        1: [ // Nivel 1: Presencia Básica
            {
                id: 'rec_1_1',
                type: 'content',
                title: 'Estrategia de Contenido',
                desc: context.content, // Dynamic context
                action: 'Grabar Video',
                icon: Video,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
            },
            {
                id: 'rec_1_2',
                type: 'branding',
                title: 'Identidad Visual',
                desc: 'Tu imagen debe transmitir profesionalismo inmediato.',
                action: 'Crear Branding',
                icon: Palette,
                color: 'text-pink-400',
                bg: 'bg-pink-500/10'
            },
            {
                id: 'rec_1_3',
                type: 'strategy',
                title: 'Objetivo de Negocio',
                desc: `Define: ¿Buscas más ${context.noun} o reconocimiento?`,
                action: 'Definir Meta',
                icon: Target,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10'
            }
        ],
        2: [ // Nivel 2: Presencia Digital
            {
                id: 'rec_2_1',
                type: 'growth',
                title: 'Campaña de Atracción',
                desc: context.campaign, // Dynamic context
                action: 'Crear Campaña',
                icon: Megaphone,
                color: 'text-orange-400',
                bg: 'bg-orange-500/10'
            },
            {
                id: 'rec_2_2',
                type: 'content',
                title: 'Prueba Social',
                desc: 'Sube 3 testimonios para aumentar la conversión.',
                action: 'Subir Casos',
                icon: Video,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
            },
            {
                id: 'rec_2_3',
                type: 'system',
                title: 'Canal de Captación',
                desc: 'Centraliza todas tus consultas en un solo lugar.',
                action: 'Conectar',
                icon: Settings,
                color: 'text-gray-400',
                bg: 'bg-gray-500/10'
            }
        ],
        3: [ // Nivel 3: Gestión de Clientes
            {
                id: 'rec_3_1',
                type: 'sales',
                title: 'CRM Activo',
                desc: 'No pierdas leads. Activa el seguimiento automático.',
                action: 'Ir al CRM',
                icon: Target,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10'
            },
            {
                id: 'rec_3_2',
                type: 'growth',
                title: 'Reactivación',
                desc: 'Envía una oferta flash a tu base de datos actual.',
                action: 'Enviar Email',
                icon: Megaphone,
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
            },
            {
                id: 'rec_3_3',
                type: 'automation',
                title: 'Respuestas IA',
                desc: 'Automatiza las preguntas frecuentes (precios, horarios).',
                action: 'Configurar Bot',
                icon: Bot,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10'
            }
        ],
        4: [ // Nivel 4: Automatización
            {
                id: 'rec_4_1',
                type: 'automation',
                title: 'Asistente Full IA',
                desc: 'Delega el 90% de la atención al cliente.',
                action: 'Activar IA',
                icon: Bot,
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10'
            },
            {
                id: 'rec_4_2',
                type: 'system',
                title: 'Funnels Automáticos',
                desc: 'Nutre leads mientras duermes con secuencias de email.',
                action: 'Crear Funnel',
                icon: Settings,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
            },
            {
                id: 'rec_4_3',
                type: 'finance',
                title: 'Optimización de Margen',
                desc: 'Analiza la rentabilidad por servicio.',
                action: 'Ver Reporte',
                icon: TrendingUp,
                color: 'text-red-400',
                bg: 'bg-red-500/10'
            }
        ],
        5: [ // Nivel 5: Escala
            {
                id: 'rec_5_1',
                type: 'scale',
                title: 'Expansión de Mercado',
                desc: 'Datos sugieren oportunidad en nuevas regiones.',
                action: 'Ver Mapa',
                icon: TrendingUp,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10'
            },
            {
                id: 'rec_5_2',
                type: 'investment',
                title: 'Escalado de Ads',
                desc: 'Incrementa presupuesto en campañas ganadoras (ROI > 3).',
                action: 'Ajustar Ads',
                icon: Target,
                color: 'text-green-400',
                bg: 'bg-green-500/10'
            },
            {
                id: 'rec_5_3',
                type: 'delegation',
                title: 'Dashboard Equipo',
                desc: 'Monitorea KPIs de rendimiento de tu equipo.',
                action: 'Auditar',
                icon: Settings,
                color: 'text-gray-400',
                bg: 'bg-gray-500/10'
            }
        ]
    };

    return db[level] || db[1];
};

export default function SmartRecommendations({ userLevel, userNiche = 'health' }) {
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        setLoading(true);
        // Simulate advanced analysis based on Niche + Level
        const timer = setTimeout(() => {
            const recs = getRecommendations(userLevel, userNiche);
            setRecommendations(recs);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [userLevel, userNiche]);

    const handleAction = (action) => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Iniciando herramienta para: ${action}...`,
            success: 'Herramienta lista. Vamos a trabajar.',
            error: 'Error al cargar herramienta'
        });
    };

    return (
        <div className="rounded-3xl bg-gradient-to-b from-[#13111C] to-[#0F0F1A] border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20 animate-pulse-slow">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg leading-none">Asesor Estratégico</h3>
                    <p className="text-xs text-purple-300 font-medium mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Análisis de Nicho: <span className="uppercase text-white font-bold">{userNiche === 'health' ? 'Salud' : userNiche}</span>
                    </p>
                </div>
            </div>

            {/* Chat Bubble Intro */}
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 mb-6 relative z-10 transition-all hover:bg-white/10">
                <p className="text-gray-300 text-sm leading-relaxed">
                    <span className="text-white font-medium">Hola, he analizado tus métricas hoy.</span>
                    <br />
                    Para un negocio de <span className="text-purple-400 font-semibold">{userNiche === 'health' ? 'Salud' : 'tu sector'}</span> en Nivel {userLevel}, prioriza esto:
                </p>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3 relative z-10">
                {loading ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>
                    ))
                ) : (
                    recommendations.map((rec, index) => (
                        <div
                            key={rec.id}
                            className="bg-[#1A1A24] hover:bg-[#22222E] border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 transition-all duration-300 group/item flex gap-4 items-start"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`shrink-0 p-3 rounded-xl ${rec.bg} ${rec.color} mt-1 shadow-sm`}>
                                <rec.icon className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white text-sm truncate pr-2">{rec.title}</h4>
                                <p className="text-gray-400 text-xs mt-0.5 line-clamp-2 leading-relaxed mb-3">
                                    {rec.desc}
                                </p>

                                <button
                                    onClick={() => handleAction(rec.action)}
                                    className="w-full text-xs bg-white/5 hover:bg-purple-600 text-gray-300 hover:text-white py-2 rounded-lg font-medium transition-all duration-300 border border-white/5 flex items-center justify-center gap-2 group-hover/item:border-purple-500/50"
                                >
                                    {rec.action} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
