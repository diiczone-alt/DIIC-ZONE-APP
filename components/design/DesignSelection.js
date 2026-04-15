'use client';

import { motion } from 'framer-motion';
import {
    Layout, PenTool, Image, Globe, ArrowLeft,
    Layers, Palette, Type, Box, Monitor, Smartphone, Printer
} from 'lucide-react';

const DEPARTMENTS = [
    {
        id: 'branding',
        name: 'Branding & Identidad',
        subtitle: 'El ADN de tu Marca',
        desc: 'Logotipos, manuales y sistemas visuales completos.',
        icon: Palette,
        color: 'from-purple-500 to-fuchsia-600',
        tags: ['Logo', 'Manual', 'Paleta'],
        services: [
            { id: 'logo-pack', label: 'Logotipo Profesional', tag: 'Core' },
            { id: 'brand-book', label: 'Manual de Marca', tag: 'Guías' },
            { id: 'rebranding', label: 'Rebranding Total', tag: 'Full' }
        ]
    },
    {
        id: 'social-media',
        name: 'Redes Sociales',
        subtitle: 'Contenido que Conecta',
        desc: 'Diseño estratégico para Instagram, LinkedIn y más.',
        icon: Smartphone,
        color: 'from-pink-500 to-rose-500',
        tags: ['Posts', 'Stories', 'Reels'],
        services: [
            { id: 'carousel', label: 'Carrusel (10 slides)', tag: 'Viral' },
            { id: 'social-pack', label: 'Pack de Posts Mensual', tag: 'Kit' },
            { id: 'story-set', label: 'Set de Historias', tag: 'Motion' }
        ]
    },
    {
        id: 'print',
        name: 'Diseño para Imprenta',
        subtitle: 'Material Físico',
        desc: 'Flyers, catálogos, tarjetas y gran formato.',
        icon: Printer,
        color: 'from-cyan-500 to-blue-500',
        tags: ['CMYK', 'Vector', '300 DPI'],
        services: [
            { id: 'flyer', label: 'Flyer / Tríptico', tag: 'Promo' },
            { id: 'business-card', label: 'Tarjetas de Presentación', tag: 'Network' },
            { id: 'catalog', label: 'Catálogo / Revista', tag: 'Edit' }
        ]
    },
    {
        id: 'digital',
        name: 'Diseño Digital',
        subtitle: 'Web & Pantallas',
        desc: 'Interfaces, landing pages, banners y presentaciones.',
        icon: Layout,
        color: 'from-blue-600 to-indigo-600',
        tags: ['UI', 'Web', 'PDF'],
        services: [
            { id: 'landing-ui', label: 'UI Landing Page', tag: 'Web' },
            { id: 'presentation', label: 'Presentación PPT/PDF', tag: 'Corp' },
            { id: 'banner-web', label: 'Banners Web / Email', tag: 'Ads' }
        ]
    },
    {
        id: 'ads',
        name: 'Publicidad & Ads',
        subtitle: 'Conversión Visual',
        desc: 'Creatividades optimizadas para campañas de pago.',
        icon: Globe, // Substituting for Megaphone if not imported, or keep default icon set
        color: 'from-orange-500 to-red-500',
        tags: ['Meta', 'Google', 'CTR'],
        services: [
            { id: 'ad-creative', label: 'Creativo Publicitario', tag: 'Performance' },
            { id: 'campaign-pack', label: 'Pack Campaña Completa', tag: 'Launch' },
            { id: 'youtube-thumb', label: 'Miniatura YouTube', tag: 'Click' }
        ]
    },
    {
        id: 'merch',
        name: 'Merchandising',
        subtitle: 'Productos de Marca',
        desc: 'Diseño para ropa, gorras y artículos promocionales.',
        icon: Box, // Using Box or ShoppingBag
        color: 'from-green-500 to-emerald-500',
        tags: ['Ropa', 'Swag', 'Packaging'],
        services: [
            { id: 'apparel', label: 'Camiseta / Hoodie', tag: 'Wear' },
            { id: 'stationery', label: 'Kit de Bienvenida', tag: 'Gift' },
            { id: 'packaging', label: 'Packaging / Caja', tag: 'Retail' }
        ]
    }
];

export default function DesignSelection({ onSelect, onBack }) {
    return (
        <div className="min-h-screen bg-[#050511] p-6 lg:p-12 text-white">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onBack}
                            className="group p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/20 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-bold uppercase tracking-widest border border-fuchsia-500/20">Departments</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                Selecciona tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Área Creativa</span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {DEPARTMENTS.map((dept, index) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-all"
                        >
                            <div className="bg-[#0E0E18] rounded-[2.3rem] h-full p-8 flex flex-col relative z-10 selection:bg-fuchsia-500/30">

                                {/* Header with Icon */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${dept.color} p-0.5 shadow-lg`}>
                                        <div className="w-full h-full bg-[#0E0E18] rounded-[0.7rem] flex items-center justify-center">
                                            <dept.icon className="w-7 h-7 text-white opacity-90" />
                                        </div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10 border border-[#0E0E18]"></div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-[#0E0E18]"></div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{dept.name}</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{dept.subtitle}</p>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">{dept.desc}</p>

                                {/* Capability Tags */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {dept.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400 font-mono">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Service List (Interactive) */}
                                <div className="space-y-2 mt-auto">
                                    {dept.services.map((srv) => (
                                        <button
                                            key={srv.id}
                                            onClick={() => onSelect({ ...srv, category: dept })}
                                            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group/btn"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover/btn:bg-white transition-colors"></div>
                                                <span className="font-bold text-sm text-gray-300 group-hover/btn:text-white">{srv.label}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-600 group-hover/btn:text-gray-400 uppercase tracking-wider">{srv.tag}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Ambient Glow */}
                            <div className={`absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tl ${dept.color} opacity-0 group-hover:opacity-10 blur-[80px] rounded-full transition-opacity duration-700 pointer-events-none`}></div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
