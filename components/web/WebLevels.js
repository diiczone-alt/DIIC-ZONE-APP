'use client';

import { motion } from 'framer-motion';
import {
    Check, ArrowRight, Zap, Target,
    TrendingUp, Rocket, Shield, Globe
} from 'lucide-react';

const LEVELS = [
    {
        level: 1,
        title: 'Presencia Básica',
        subtitle: 'Ideal para iniciar',
        description: 'Tener una presencia digital funcional y profesional.',
        price: 'Desde $X',
        color: 'green',
        icon: Globe,
        features: [
            'Landing Page optimizada',
            'Información de contacto',
            'Integración WhatsApp',
            'Diseño Responsivo (Móvil)',
            'Botón de llamada'
        ]
    },
    {
        level: 2,
        title: 'Web Profesional',
        subtitle: 'Construir autoridad',
        description: 'Genera confianza y muestra tu portafolio o servicios.',
        price: 'Desde $XX',
        color: 'yellow',
        icon: Shield,
        features: [
            'Todo lo del Nivel 1',
            'Múltiples secciones (Home, Nosotros)',
            'Blog / Noticias',
            'Galería de proyectos',
            'SEO Básico',
            'Formularios inteligentes'
        ]
    },
    {
        level: 3,
        title: 'Web Avanzada',
        subtitle: 'Convertir clientes',
        description: 'Automatiza procesos y capta leads activamente.',
        price: 'Desde $XXX',
        color: 'blue',
        icon: Target,
        features: [
            'Todo lo del Nivel 2',
            'Integración CRM',
            'Chatbot básico',
            'Agenda Online automatizada',
            'Analíticas avanzadas',
            'Pixel de Facebook/Google'
        ]
    },
    {
        level: 4,
        title: 'Sistema Completo',
        subtitle: 'Escalar negocio',
        description: 'Tu negocio operando 100% en digital.',
        price: 'A medida',
        color: 'purple',
        icon: Rocket,
        features: [
            'Todo lo del Nivel 3',
            'E-commerce / Pagos Online',
            'Panel Administrativo',
            'Embudos de venta complejos',
            'Integración total DIIC ZONE',
            'Automatizaciones a medida'
        ]
    }
];

export default function WebLevels({ objective, onSelect, onBack }) {

    const getColorClasses = (color) => {
        const maps = {
            green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500',
            yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:border-yellow-500',
            blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:border-blue-500',
            purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:border-purple-500'
        };
        return maps[color];
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center mb-16">
                <button
                    onClick={onBack}
                    className="mb-6 px-4 py-1.5 rounded-full border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors"
                >
                    ← Cambiar Objetivo
                </button>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4">
                        Modelo de Crecimiento Escalable
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Elige el nivel que mejor se adapte a tu etapa actual. Siempre podrás escalar al siguiente nivel cuando tu negocio lo requiera.
                    </p>
                </motion.div>
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {LEVELS.map((lvl, idx) => (
                    <motion.div
                        key={lvl.level}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className={`relative flex flex-col h-full bg-[#0E0E18] border rounded-3xl p-6 transition-all duration-300 group hover:-translate-y-2 ${getColorClasses(lvl.color).split(' ')[1]}`} // Use border color for base
                    >
                        {/* Level Badge */}
                        <div className={`w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${getColorClasses(lvl.color)}`}>
                            Nivel {lvl.level}
                        </div>

                        {/* Title & Icon */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">{lvl.title}</h3>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">{lvl.subtitle}</p>
                            </div>
                            <lvl.icon className={`w-8 h-8 ${getColorClasses(lvl.color).match(/text-\w+-\d+/)[0]}`} />
                        </div>

                        <p className="text-gray-400 text-sm mb-8 leading-relaxed min-h-[40px]">
                            {lvl.description}
                        </p>

                        {/* Features List */}
                        <div className="flex-grow space-y-3 mb-8">
                            {lvl.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getColorClasses(lvl.color).match(/text-\w+-\d+/)[0]}`} />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => onSelect(lvl.level)}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${lvl.color === 'purple'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                                    : `bg-white/5 text-white hover:bg-white/10`
                                }`}
                        >
                            Seleccionar
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
