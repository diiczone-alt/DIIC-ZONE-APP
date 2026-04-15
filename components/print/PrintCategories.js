'use client';

import { motion } from 'framer-motion';
import {
    Printer, ShoppingBag, Map, Image as ImageIcon,
    Shirt, Package, ArrowRight, Sparkles
} from 'lucide-react';

const CATEGORIES = [
    {
        id: 'print',
        title: 'Material Impreso',
        description: 'Papelería corporativa de alta calidad. Offset y Digital.',
        icon: Printer,
        gradient: 'from-blue-500 to-cyan-500',
        products: [
            'Tarjetas de Presentación', 'Flyers & Volantes', 'Afiches',
            'Trípticos & Dípticos', 'Carpetas Corporativas', 'Hojas Membretadas',
            'Catálogos', 'Revistas', 'Invitaciones', 'Menús'
        ]
    },
    {
        id: 'merch',
        title: 'Merchandising / Branding',
        description: 'Artículos promocionales para posicionar tu marca.',
        icon: ShoppingBag,
        gradient: 'from-purple-500 to-pink-500',
        products: [
            'Camisetas', 'Gorras', 'Esferos', 'Termos', 'Llaveros',
            'Cuadernos', 'Bolsos', 'Stickers', 'Pines', 'Pulseras'
        ]
    },
    {
        id: 'signage',
        title: 'Señalética',
        description: 'Visibilidad interior y exterior para tu negocio.',
        icon: Map,
        gradient: 'from-orange-500 to-red-500',
        products: [
            'Rótulos', 'Letreros Luminosos', 'Señalización Interna',
            'Vinilos Decorativos', 'Letras Corpóreas', 'Acrílicos'
        ]
    },
    {
        id: 'large_format',
        title: 'Gran Formato',
        description: 'Impresiones a gran escala para máximo impacto.',
        icon: ImageIcon,
        gradient: 'from-green-500 to-emerald-500',
        products: [
            'Lonas Publicitarias', 'Roll Ups', 'Banners X',
            'Backings para Eventos', 'Vinilos Adhesivos', 'Microperforados', 'Vallas'
        ]
    },
    {
        id: 'textiles',
        title: 'Textiles',
        description: 'Vestimenta corporativa y personalización textil.',
        icon: Shirt,
        gradient: 'from-yellow-500 to-amber-500',
        products: [
            'Uniformes Corporativos', 'Bordados', 'Sublimados',
            'Estampado DTF', 'Chalecos', 'Mandiles'
        ]
    },
    {
        id: 'packaging',
        title: 'Empaques',
        description: 'Presentación profesional para tus productos.',
        icon: Package,
        gradient: 'from-indigo-500 to-violet-500',
        products: [
            'Cajas Personalizadas', 'Etiquetas Adhesivas', 'Cintas de Embalaje',
            'Fundas de Papel', 'Envolturas', 'Empaques Ecológicos'
        ]
    }
];

export default function PrintCategories({ onSelect, onBack }) {
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
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        ¿Qué deseas producir hoy?
                    </h2>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    Selecciona una categoría para ver el catálogo de productos disponibles.
                </p>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CATEGORIES.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => onSelect(cat)}
                        className="group relative h-full text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                        />

                        <div className="relative h-full bg-[#0E0E18] border border-white/10 rounded-3xl p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-yellow-500/30 group-hover:shadow-lg overflow-hidden flex flex-col">
                            {/* Hover Gradient Border Effect */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                    <cat.icon className="w-7 h-7 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 -rotate-45 group-hover:rotate-0 group-hover:text-yellow-500 transition-all duration-300" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                                {cat.title}
                            </h3>

                            <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300">
                                {cat.description}
                            </p>

                            <div className="mt-auto flex flex-wrap gap-2">
                                {cat.products.slice(0, 3).map((prod, i) => (
                                    <span key={i} className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-gray-500 uppercase">
                                        {prod}
                                    </span>
                                ))}
                                <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-gray-500 uppercase">+</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
