'use client';

import { motion } from 'framer-motion';
import {
    HardHat, Megaphone, ShoppingBag, GraduationCap,
    Coins, Landmark, Stethoscope, UtensilsCrossed,
    Cpu, Gavel, Factory, HeartHandshake,
    Home, Store, Truck, Plane,
    Briefcase, MoreHorizontal, Mic, User
} from 'lucide-react';

export default function ProfileSelectorStep({ onNext, updateData }) {
    const profiles = [
        { id: 'personal', label: 'Marca Personal', icon: User, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500' },
        { id: 'doctor', label: 'Médico', icon: Stethoscope, color: 'text-red-400', bg: 'bg-red-500/10', border: 'hover:border-red-500' },
        { id: 'creator', label: 'Blog / Podcast', icon: Mic, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'hover:border-pink-500' },
        { id: 'marketing', label: 'Marketing Digital', icon: Megaphone, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500' },
        { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500' },
        { id: 'education', label: 'Educación', icon: GraduationCap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'hover:border-yellow-500' },
        { id: 'finance', label: 'Finanzas', icon: Coins, color: 'text-green-400', bg: 'bg-green-500/10', border: 'hover:border-green-500' },
        { id: 'health', label: 'Servicios de Salud', icon: Stethoscope, color: 'text-red-400', bg: 'bg-red-500/10', border: 'hover:border-red-500' },
        { id: 'horeca', label: 'Hostelería / HoReCa', icon: UtensilsCrossed, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'hover:border-orange-500' },
        { id: 'tech', label: 'Tecnología / TI', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500' },
        { id: 'legal', label: 'Legal / Abogados', icon: Gavel, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'hover:border-amber-500' },
        { id: 'realestate', label: 'Bienes Raíces', icon: Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500' },
        { id: 'retail', label: 'Ventas Minoristas', icon: Store, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'hover:border-violet-500' },
        { id: 'consulting', label: 'Consultoría', icon: Briefcase, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'hover:border-teal-500' },
        { id: 'manufacturing', label: 'Manufactura', icon: Factory, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'hover:border-gray-500' },
        { id: 'construction', label: 'Construcción', icon: HardHat, color: 'text-orange-600', bg: 'bg-orange-600/10', border: 'hover:border-orange-600' },
        { id: 'transport', label: 'Logística / Transp.', icon: Truck, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'hover:border-slate-500' },
        { id: 'travel', label: 'Viajes / Turismo', icon: Plane, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'hover:border-sky-500' },
        { id: 'ong', label: 'Sin fines de lucro', icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'hover:border-rose-500' },
        { id: 'government', label: 'Gubernamental', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'hover:border-blue-600' },
        { id: 'other', label: 'Otro Sector', icon: MoreHorizontal, color: 'text-gray-500', bg: 'bg-gray-500/5', border: 'hover:border-gray-500' }
    ];

    const handleSelect = (id) => {
        updateData({ profileType: id });
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
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                    ¿A qué se <span className="text-indigo-500">dedica?</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium">
                    Selecciona tu sector para que DIIC ZONE adapte su <br className="hidden md:block" /> inteligencia a tu modelo de negocio.
                </p>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12 overflow-y-auto custom-scrollbar px-2 content-start"
            >
                {profiles.map((p) => (
                    <motion.button
                        key={p.id}
                        variants={itemVariants}
                        onClick={() => handleSelect(p.id)}
                        className={`group relative p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.05] ${p.border} flex flex-col items-center justify-center gap-4 text-center backdrop-blur-sm overflow-hidden`}
                    >
                        {/* Background Glow on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl ${p.bg} -z-10 scale-150`} />
                        
                        <div className={`p-4 rounded-2xl ${p.bg} ${p.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xl`}>
                            <p.icon className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-white text-sm md:text-base uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                            {p.label}
                        </span>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}
