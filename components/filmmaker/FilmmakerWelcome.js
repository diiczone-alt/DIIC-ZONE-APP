'use client';

import { motion } from 'framer-motion';
import { PlayCircle, Film, X } from 'lucide-react';

export default function FilmmakerWelcome({ onClose, onStartProduction }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-4xl bg-[#0F0F1A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white z-20 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side - Visual / Brand */}
                <div className="md:w-1/2 bg-gradient-to-br from-orange-600 via-red-600 to-purple-800 p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white border border-white/20">
                            <Film className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2 leading-tight">Filmmaker<br />Pro</h2>
                        <p className="text-orange-200 text-lg">Producción audiovisual de alto nivel.</p>
                    </div>

                    <div className="relative z-10 mt-10">
                        <blockquote className="text-white/80 italic text-lg border-l-2 border-white/30 pl-4">
                            "Tu rodaje se agenda en minutos. Nuestro equipo confirma y produce."
                        </blockquote>
                    </div>
                </div>

                {/* Right Side - Actions */}
                <div className="md:w-1/2 p-10 flex flex-col justify-center bg-[#0F0F1A]">
                    <h3 className="text-2xl font-bold text-white mb-2">¡Hola!</h3>
                    <p className="text-gray-400 mb-8">
                        Soy tu asistente de producción. Cuéntame qué deseas grabar hoy y lo producimos contigo de principio a fin.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={onStartProduction}
                            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-orange-500/20 group"
                        >
                            <PlayCircle className="w-6 h-6 fill-white text-orange-500 group-hover:scale-110 transition-transform" />
                            Crear Producción
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                            Ver Producciones Activas
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
