'use client';

import { motion } from 'framer-motion';
import { Clapperboard, Scissors, X } from 'lucide-react';

export default function EditingWelcome({ onClose, onStartEditing }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-4xl bg-[#0B0B15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white z-20 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side - Visual / Brand */}
                <div className="md:w-1/2 bg-gradient-to-br from-purple-800 via-violet-900 to-indigo-900 p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574717436401-097d83789740?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white border border-white/20">
                            <Scissors className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2 leading-tight">Editing<br />Suite</h2>
                        <p className="text-purple-200 text-lg">Post-producción cinematográfica.</p>
                    </div>

                    <div className="relative z-10 mt-10">
                        <blockquote className="text-white/80 italic text-lg border-l-2 border-white/30 pl-4">
                            "Transformamos tu material crudo en piezas maestras."
                        </blockquote>
                    </div>
                </div>

                {/* Right Side - Actions */}
                <div className="md:w-1/2 p-10 flex flex-col justify-center bg-[#0B0B15]">
                    <h3 className="text-2xl font-bold text-white mb-2">Bienvenido al Estudio</h3>
                    <p className="text-gray-400 mb-8">
                        Sube tus archivos, elige el estilo y deja que nuestros editores expertos hagan su magia.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={onStartEditing}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-purple-600/20 group"
                        >
                            <Clapperboard className="w-6 h-6 fill-white text-purple-600 group-hover:scale-110 transition-transform" />
                            Nuevo Encargo
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                            Ver Dashboard
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
