'use client';

import { useRouter } from 'next/navigation';
import {
    Mic2, Music, Radio, Podcast, X, ArrowRight,
    MapPin, Headphones, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioFlowModal({ isOpen, onClose }) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleSelect = (id) => {
        onClose();
        if (id === 'studio') {
            router.push('/workstation/audio/studios');
        } else {
            // Future flows for other types
            console.log('Selected flow:', id);
        }
    };

    const options = [
        {
            id: 'edit',
            title: 'Editar Audio',
            desc: 'Limpieza, mezcla o masterización de archivos existentes.',
            icon: Sliders,
            color: 'bg-blue-500',
            textColor: 'text-blue-400'
        },
        {
            id: 'studio',
            title: 'Grabar en Estudio',
            desc: 'Reserva un estudio físico profesional cerca de ti.',
            icon: MapPin,
            color: 'bg-rose-500',
            textColor: 'text-rose-400'
        },
        {
            id: 'podcast',
            title: 'Podcast',
            desc: 'Producción completa de episodios, intros y outros.',
            icon: Mic2,
            color: 'bg-violet-500',
            textColor: 'text-violet-400'
        },
        {
            id: 'music',
            title: 'Producción Musical',
            desc: 'Beats, arreglos, mezcla y mastering musical.',
            icon: Music,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-400'
        },
        {
            id: 'promo',
            title: 'Audio Publicitario',
            desc: 'Cuñas, spots de radio y audio para video.',
            icon: Radio,
            color: 'bg-amber-500',
            textColor: 'text-amber-400'
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#0E0E18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10"
                >
                    {/* Header */}
                    <div className="p-8 pb-0 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                                    <Headphones className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Asistente de Audio</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">¿Qué deseas crear hoy?</h2>
                            <p className="text-gray-400 mt-2">Selecciona el tipo de proyecto para iniciar el flujo adecuado.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-400 hover:text-white" />
                        </button>
                    </div>

                    {/* Options Grid */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                className="group text-left p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all relative overflow-hidden"
                            >
                                <div className={`w-10 h-10 rounded-lg ${opt.color}/20 flex items-center justify-center mb-4 group-hover:${opt.color} transition-colors`}>
                                    <opt.icon className={`w-5 h-5 ${opt.textColor} group-hover:text-white transition-colors`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{opt.title}</h3>
                                <p className="text-xs text-gray-400 group-hover:text-gray-300 leading-relaxed">{opt.desc}</p>

                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
