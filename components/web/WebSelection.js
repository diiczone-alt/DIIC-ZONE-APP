'use client';

import { motion } from 'framer-motion';
import {
    Layout, Building2, ShoppingBag,
    Calendar, BookOpen, Presentation,
    ArrowRight, Sparkles
} from 'lucide-react';

const WEB_TYPES = [
    {
        id: 'landing',
        title: 'Landing Page',
        description: 'Una sola página optimizada para captar clientes o presentar un producto.',
        icon: Layout,
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'corporate',
        title: 'Sitio Corporativo',
        description: 'Presencia digital completa para empresas, con múltiples secciones.',
        icon: Building2,
        gradient: 'from-slate-500 to-gray-500'
    },
    {
        id: 'ecommerce',
        title: 'Tienda Online',
        description: 'Vende productos físicos o digitales con pasarela de pagos integrada.',
        icon: ShoppingBag,
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        id: 'booking',
        title: 'Sistema de Reservas',
        description: 'Ideal para médicos, consultores y servicios que requieren agenda.',
        icon: Calendar,
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        id: 'academy',
        title: 'Plataforma Educativa',
        description: 'Vende cursos online, gestiona alumnos y contenido exclusivo.',
        icon: BookOpen,
        gradient: 'from-orange-500 to-red-500'
    },
    {
        id: 'funnel',
        title: 'Embudo de Ventas',
        description: 'Sistema estratégico de páginas para maximizar conversiones.',
        icon: Presentation,
        gradient: 'from-indigo-500 to-violet-500'
    }
];

export default function WebSelection({ goal, onSelect, onBack }) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <button
                    onClick={onBack}
                    className="mb-6 px-4 py-1.5 rounded-full border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors"
                >
                    ← Volver
                </button>
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        ¿Para qué necesitas tu sitio web?
                    </h2>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    Selecciona el tipo de proyecto para recomendarte la mejor estructura y herramientas.
                </p>
            </motion.div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WEB_TYPES.map((type, idx) => (
                    <motion.button
                        key={type.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => onSelect(type.id)}
                        className="group relative h-full text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                        />

                        <div className="relative h-full bg-[#0E0E18] border border-white/10 rounded-3xl p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-cyan-500/30 group-hover:shadow-lg group-hover:shadow-cyan-500/10 overflow-hidden">
                            {/* Hover Gradient Border Effect */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${type.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                <type.icon className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                                {type.title}
                            </h3>

                            <p className="text-gray-400 text-sm leading-relaxed mb-8 group-hover:text-gray-300">
                                {type.description}
                            </p>

                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                                Seleccionar
                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>

                            {/* Decorative Glow */}
                            <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${type.gradient} rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
