'use client';

import { useState, useEffect } from 'react';
import {
    AlertTriangle, CheckCircle, TrendingUp, Zap,
    ArrowRight, Star, Brain, PlayCircle, BarChart2, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SCENARIOS = {
    'low_growth': {
        label: 'Crecimiento Bajo',
        level: 1,
        message: 'Tu contenido no está logrando conectar con tu audiencia.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: AlertTriangle,
        recommendations: [
            { type: 'strategy', text: 'Crear más videos tipo Reels', priority: 'high' },
            { type: 'content', text: 'Usar ganchos más fuertes en los primeros 3s', priority: 'high' },
            { type: 'action', text: 'Publicar 3 veces por semana', priority: 'medium' }
        ]
    },
    'good_content_low_sales': {
        label: 'Sin Conversión',
        level: 2,
        message: 'Tu contenido genera interés, pero no convierte en ventas.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: Brain,
        recommendations: [
            { type: 'strategy', text: 'Implementar llamado a la acción (CTA) más claro', priority: 'high' },
            { type: 'automation', text: 'Activar automatización de respuestas en DM', priority: 'high' },
            { type: 'crm', text: 'Mejorar proceso de seguimiento de leads', priority: 'medium' }
        ]
    },
    'low_roas': {
        label: 'Ads Sin Retorno',
        level: 3,
        message: 'Tu inversión en publicidad no está siendo rentable (ROAS < 1.5).',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: TrendingUp,
        recommendations: [
            { type: 'ads', text: 'Pausar campaña "Tráfico Frío"', priority: 'high' },
            { type: 'strategy', text: 'Cambiar público objetivo a "Similares 1%"', priority: 'high' },
            { type: 'content', text: 'Usar contenido educativo en vez de promocional', priority: 'medium' }
        ]
    },
    'low_automation': {
        label: 'Trabajo Manual',
        level: 2,
        message: 'Tu negocio depende demasiado de atención manual (>2h respuesta).',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        icon: Zap,
        recommendations: [
            { type: 'automation', text: 'Activar bot de respuestas frecuentes', priority: 'high' },
            { type: 'automation', text: 'Automatizar agendamiento de citas', priority: 'medium' },
            { type: 'strategy', text: 'Conectar WhatsApp Business con CRM', priority: 'medium' }
        ]
    },
    'production_bottleneck': {
        label: 'Cuello de Botella',
        level: 3,
        message: 'La producción está retrasando tu estrategia.',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        icon: ClockIcon,
        recommendations: [
            { type: 'production', text: 'Priorizar contenido "Hero" sobre relleno', priority: 'high' },
            { type: 'strategy', text: 'Reducir piezas menos efectivas', priority: 'medium' },
            { type: 'team', text: 'Delegar edición básica a IA', priority: 'low' }
        ]
    }
};

const LEVELS = {
    1: { label: 'Presencia Básica', color: 'text-gray-400' },
    2: { label: 'Crecimiento', color: 'text-blue-400' },
    3: { label: 'Autoridad', color: 'text-purple-400' },
    4: { label: 'Monetización', color: 'text-green-400' },
    5: { label: 'Escalabilidad', color: 'text-amber-400' }
};

export default function StrategicAdvisor() {
    const [scenarioKey, setScenarioKey] = useState('good_content_low_sales');
    const data = SCENARIOS[scenarioKey];

    // Auto-update visual simulation
    useEffect(() => {
        // Just for effect, we could rotate scenarios or keep it static
    }, []);

    return (
        <section className="bg-gradient-to-br from-[#0E0E18] to-[#151525] border border-white/10 rounded-3xl p-6 lg:p-8 relative overflow-hidden group">

            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${data.bg.replace('10', '5')} rounded-full blur-[100px] -mr-20 -mt-20 transition-colors duration-500`} />

            <div className="relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-2xl ${data.bg} ${data.color} border ${data.border} shadow-lg shadow-${data.color.split('-')[1]}-500/10 transition-all duration-500`}>
                            <Brain className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-black text-white">Recomendaciones Inteligentes</h3>
                                <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-400" />
                                    AI LIVE
                                </div>
                            </div>
                            <p className={`text-lg transition-colors duration-300 ${data.color}`}>
                                {data.message}
                            </p>
                        </div>
                    </div>

                    {/* Business Level Indicator */}
                    <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col items-end min-w-[200px]">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Nivel del Negocio</span>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(lvl => (
                                <div
                                    key={lvl}
                                    className={`w-2 h-8 rounded-full transition-all duration-500 ${lvl <= data.level
                                        ? LEVELS[data.level].color.replace('text', 'bg')
                                        : 'bg-white/5'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className={`mt-2 font-bold ${LEVELS[data.level].color}`}>
                            {LEVELS[data.level].label}
                        </div>
                    </div>
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.recommendations.map((rec, idx) => (
                        <motion.div
                            key={scenarioKey + idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col justify-between group/card transition-colors"
                        >
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/20 ${rec.priority === 'high' ? 'text-red-400 border border-red-500/20' : 'text-blue-400 border border-blue-500/20'}`}>
                                        {rec.priority === 'high' ? 'Prioridad Alta' : 'Sugerencia'}
                                    </span>
                                    <IconForType type={rec.type} className="w-4 h-4 text-gray-500 group-hover/card:text-white transition-colors" />
                                </div>
                                <p className="font-bold text-gray-200 group-hover/card:text-white leading-snug">
                                    {rec.text}
                                </p>
                            </div>
                            <button className="text-xs font-bold text-gray-500 hover:text-white py-2 flex items-center gap-2 transition-colors border-t border-white/5 pt-3">
                                Ejecutar Acción <ArrowRight className="w-3 h-3" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Debug Scenarios Switcher (Hidden in production, convenient for demo) */}
                <div className="mt-8 pt-4 border-t border-white/5 flex gap-2 overflow-x-auto pb-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-gray-600 self-center uppercase mr-2">Simular:</span>
                    {Object.keys(SCENARIOS).map(k => (
                        <button
                            key={k}
                            onClick={() => setScenarioKey(k)}
                            className={`px-3 py-1 rounded text-[10px] uppercase font-bold border transition-colors whitespace-nowrap ${scenarioKey === k ? 'bg-white text-black border-white' : 'text-gray-500 border-white/10 hover:border-white/30'
                                }`}
                        >
                            {SCENARIOS[k].label}
                        </button>
                    ))}
                </div>

            </div>
        </section>
    );
}

function IconForType({ type, className }) {
    switch (type) {
        case 'strategy': return <Brain className={className} />;
        case 'content': return <Video className={className} />;
        case 'automation': return <Zap className={className} />;
        case 'ads': return <TrendingUp className={className} />;
        case 'production': return <PlayCircle className={className} />;
        default: return <CheckCircle className={className} />;
    }
}

function ClockIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    )
}
