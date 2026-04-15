'use client';

import { motion } from 'framer-motion';
import { Stethoscope, Utensils, Dumbbell, GraduationCap, Video, Shirt, Briefcase, Zap } from 'lucide-react';

const niches = [
    { id: 'medical', label: 'Salud / Médico', icon: Stethoscope },
    { id: 'hospitality', label: 'Gastronomía', icon: Utensils },
    { id: 'fitness', label: 'Fitness / Wellness', icon: Dumbbell },
    { id: 'education', label: 'Educación / Cursos', icon: GraduationCap },
    { id: 'creator', label: 'Content Creator', icon: Video },
    { id: 'fashion', label: 'Moda / Retail', icon: Shirt },
    { id: 'services', label: 'Servicios Profesionales', icon: Briefcase },
    { id: 'tech', label: 'Tecnología / SaaS', icon: Zap },
];

export default function NicheSelectorStep({ onNext, updateData }) {

    const handleSelect = (nicheId) => {
        updateData(nicheId);
        onNext();
    };

    return (
        <div className="space-y-8 text-center">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">¿En qué industria operas?</h2>
                <p className="text-gray-400">Esto configurará tus plantillas y flujos de automatización.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {niches.map((niche, i) => (
                    <motion.button
                        key={niche.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleSelect(niche.id)}
                        className="group flex flex-col items-center justify-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/50 hover:-translate-y-1 transition-all"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#0A0A12] flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                            <niche.icon className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-300 group-hover:text-white">{niche.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
