'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, Building2, Store, GraduationCap } from 'lucide-react';

const options = [
    { id: 'freelance', label: 'Profesional Independiente', icon: User, desc: 'Consultores, freelancers, expertos.' },
    { id: 'business', label: 'Empresa / PyME', icon: Building2, desc: 'Equipos, ventas B2B/B2C, estructura.', highlight: true },
    { id: 'personal_brand', label: 'Marca Personal', icon: GraduationCap, desc: 'Influencers, coaches, creadores.' },
    { id: 'local_business', label: 'Negocio Local', icon: Store, desc: 'Restaurantes, tiendas físicas, clínicas.' },
    { id: 'institution', label: 'Institución', icon: Briefcase, desc: 'ONGs, educativas, gobierno.' },
];

export default function ProfileTypeStep({ onNext, updateData }) {

    const handleSelect = (option) => {
        updateData(option.id);
        onNext();
    };

    return (
        <div className="space-y-8 text-center">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">¿Cuál es tu perfil?</h2>
                <p className="text-gray-400">Adaptaremos el sistema a tu modelo de operación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((opt, i) => (
                    <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleSelect(opt)}
                        className={`group relative p-6 rounded-2xl border text-left transition-all hover:scale-[1.03] ${opt.highlight ? 'bg-indigo-600/10 border-indigo-500/50 hover:bg-indigo-600/20' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${opt.highlight ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                            <opt.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{opt.label}</h3>
                        <p className="text-xs text-gray-400 font-medium">{opt.desc}</p>

                        {/* Interactive Highlight */}
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
