'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, Stethoscope, UtensilsCrossed, Cpu, Gavel, HeartHandshake, Home,
    MoreHorizontal, Sprout, Briefcase, User, HeartPulse, Mic, Megaphone, ShoppingBag,
    Coins, Store, Factory, HardHat, Truck, Plane, Landmark, Croissant, X
} from 'lucide-react';

export default function ProfileSelectorStep({ onNext, updateData }) {
    const [showModal, setShowModal] = useState(false);
    const [customNiche, setCustomNiche] = useState('');

    const profiles = [
        { id: 'general', label: 'Estrategia General', desc: 'Crecimiento estándar y marca', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500' },
        { id: 'personal', label: 'Marca Personal', desc: 'Autoridad para profesionales', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500' },
        { id: 'doctor', label: 'Marketing Médico', desc: 'Funnels para médicos y especialistas', icon: Stethoscope, color: 'text-red-400', bg: 'bg-red-500/10', border: 'hover:border-red-500' },
        { id: 'hospital', label: 'Sistema Hospitales', desc: 'Reputación & directorio médico', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'hover:border-rose-500' },
        { id: 'education', label: 'Cursos / Talleres', desc: 'Conversión para cursos y talleres', icon: GraduationCap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'hover:border-yellow-500' },
        { id: 'horeca', label: 'Restaurantes', desc: 'Atracción foodie & delivery', icon: UtensilsCrossed, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'hover:border-orange-500' },
        { id: 'realestate', label: 'Bienes Raíces', desc: 'Leads inmobiliarios de alta gama', icon: Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500' },
        { id: 'agro', label: 'Agropecuario', desc: 'Venta mayorista e insumos', icon: Sprout, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500' },
        { id: 'creator', label: 'Blog / Podcast', desc: 'Viralidad y monetización de marca', icon: Mic, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500' },
        { id: 'marketing', label: 'Marketing Digital', desc: 'Embudo de captación B2B', icon: Megaphone, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'hover:border-pink-500' },
        { id: 'ecommerce', label: 'E-commerce', desc: 'Conversión y escala de ventas web', icon: ShoppingBag, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'hover:border-fuchsia-500' },
        { id: 'finance', label: 'Finanzas / Seguros', desc: 'Captación de capital e inversiones', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'hover:border-amber-500' },
        { id: 'tech', label: 'Tecnología / SaaS', desc: 'Adquisición de usuarios y SaaS', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500' },
        { id: 'legal', label: 'Legal / Abogados', desc: 'Posicionamiento y casos complejos', icon: Gavel, color: 'text-stone-400', bg: 'bg-stone-500/10', border: 'hover:border-stone-500' },
        { id: 'retail', label: 'Retail / Tiendas', desc: 'Tráfico al punto de venta físico', icon: Store, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'hover:border-teal-500' },
        { id: 'consulting', label: 'Consultoría', desc: 'Asesoría de negocio high-ticket', icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'hover:border-violet-500' },
        { id: 'manufacturing', label: 'Manufactura', desc: 'Licitaciones y clientes corporativos', icon: Factory, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'hover:border-slate-500' },
        { id: 'construction', label: 'Construcción', desc: 'Pre-ventas y portafolio de obra', icon: HardHat, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'hover:border-amber-500' },
        { id: 'transport', label: 'Logística', desc: 'Logística y distribución B2B', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500' },
        { id: 'travel', label: 'Viajes / Turismo', desc: 'Reservas y branding de turismo', icon: Plane, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'hover:border-sky-500' },
        { id: 'ong', label: 'ONG / Sin Fines', desc: 'Recaudación y concientización social', icon: HeartHandshake, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'hover:border-rose-500' },
        { id: 'government', label: 'Gubernamental', desc: 'Comunicación institucional', icon: Landmark, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'hover:border-gray-500' },
        { id: 'bakery', label: 'Panificadora', desc: 'Ventas de productos y panadería', icon: Croissant, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'hover:border-orange-500' },
        { id: 'other', label: 'Otro Sector', desc: 'Estrategias a la medida', icon: MoreHorizontal, color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'hover:border-zinc-500' }
    ];

    const handleSelect = (id) => {
        if (id === 'other') {
            setShowModal(true);
            return;
        }
        updateData({ 
            profileType: id,
            niche: id,
            business_niche: id,
            industry: id
        });
        onNext();
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customNiche.trim()) return;
        updateData({
            profileType: 'other',
            niche: customNiche.trim(),
            business_niche: customNiche.trim(),
            industry: customNiche.trim()
        });
        setShowModal(false);
        onNext();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
    };

    return (
        <div className="flex flex-col h-full max-w-7xl mx-auto w-full relative">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                    ¿A qué se dedica tu <span className="text-indigo-500">negocio?</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium">
                    DIIC ZONE adaptará su inteligencia, procesos y estrategia a tu modelo de negocio.
                </p>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12 overflow-y-auto custom-scrollbar px-2 content-start animate-fade-in"
            >
                {profiles.map((p) => (
                    <motion.button
                        key={p.id}
                        variants={itemVariants}
                        onClick={() => handleSelect(p.id)}
                        className="group relative p-4 rounded-3xl border transition-all hover:bg-white/[0.05] border-white/5 bg-white/[0.02] flex items-start gap-4 text-left backdrop-blur-sm overflow-hidden"
                    >
                        {/* Background Glow on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl ${p.bg} -z-10 scale-150`} />

                        <div className={`p-3 rounded-2xl ${p.bg} ${p.color} transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 shadow-xl flex-shrink-0`}>
                            <p.icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col pr-2 mt-1">
                            <span className="font-black text-white text-[11px] uppercase tracking-wider leading-tight">
                                {p.label}
                            </span>
                            <span className="text-[10px] text-gray-500 group-hover:text-gray-400 mt-1 transition-colors leading-normal">
                                {p.desc}
                            </span>
                        </div>
                    </motion.button>
                ))}
            </motion.div>

            {/* Modal for Custom Niche */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0A0A16] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-2xl mb-4">
                                    <MoreHorizontal className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">
                                    Define tu nicho
                                </h3>
                                <p className="text-gray-400 text-sm mt-2">
                                    Escribe a qué se dedica tu negocio para adaptar nuestra estrategia.
                                </p>
                            </div>

                            <form onSubmit={handleCustomSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={customNiche}
                                        onChange={(e) => setCustomNiche(e.target.value)}
                                        placeholder="Ej. Limpieza, Consultorio Dental, etc."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 font-bold text-sm hover:bg-white/5 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!customNiche.trim()}
                                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
