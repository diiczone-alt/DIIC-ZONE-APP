'use client';

import { motion } from 'framer-motion';
import {
    X, Star, MapPin, CheckCircle,
    Calendar, Instagram, Video, Camera
} from 'lucide-react';

export default function TalentProfile({ talent, onClose }) {
    if (!talent) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                layoutId={`card-${talent.id}`}
                className="relative z-10 w-full max-w-4xl bg-[#0E0E18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-white/20 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left: Image & Quick Stats */}
                <div className="w-full md:w-2/5 relative">
                    <img
                        src={talent.image}
                        alt={talent.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] via-transparent to-transparent opacity-90 md:opacity-40" />

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                            {talent.isVerified && (
                                <span className="px-2 py-0.5 rounded bg-blue-500 text-[10px] font-bold text-white uppercase flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verificado
                                </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white uppercase">
                                {talent.experience} Exp.
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-white">{talent.name}</h2>
                        <p className="text-rose-400 font-bold uppercase tracking-wider text-sm">{talent.role}</p>
                    </div>
                </div>

                {/* Right: Details & Booking */}
                <div className="w-full md:w-3/5 p-8 overflow-y-auto">

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <span className="block text-2xl font-black text-white">{talent.rating}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold flex items-center justify-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Rating
                            </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <span className="block text-2xl font-black text-white">{talent.reviews}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">Reseñas</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <span className="block text-2xl font-black text-white text-green-400">{talent.rate}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">Tarifa</span>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Sobre el talento</h3>
                        <p className="text-gray-300 leading-relaxed font-light">
                            Profesional con amplia experiencia en {talent.category === 'video' ? 'presentación ante cámara y conducción de eventos.' : 'modelaje comercial y fotografía de producto.'}
                            Disponible para proyectos en {talent.location} y alrededores.
                            Comprometida con la puntualidad y la excelencia en cada producción.
                        </p>
                    </div>

                    {/* Gallery Preview (Mock) */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Galería Reciente</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/5 relative overflow-hidden group cursor-pointer">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 group-hover:text-white transition-colors">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hiring Actions */}
                    <div className="space-y-3 pt-6 border-t border-white/10">
                        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold uppercase tracking-wider shadow-lg hover:shadow-rose-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Contratar Ahora
                        </button>
                        <div className="flex gap-3">
                            <button className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors border border-white/10">
                                Ver Portafolio Completo
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2">
                                <Instagram className="w-4 h-4" /> Instagram
                            </button>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
