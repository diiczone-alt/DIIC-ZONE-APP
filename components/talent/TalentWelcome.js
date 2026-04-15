'use client';

import { motion } from 'framer-motion';
import { Star, Sparkles, ArrowRight, Users, Camera, Video, Mic } from 'lucide-react';

export default function TalentWelcome({ onStart }) {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-8 backdrop-blur-sm">
                        <Star className="w-4 h-4 text-rose-400 fill-rose-400" />
                        <span className="text-sm font-bold text-rose-300 uppercase tracking-widest">
                            DIIC ZONE Casting
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-none">
                        Bienvenido a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400">
                            Modelos & Talento
                        </span>
                    </h1>

                    {/* Description Copy */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Aquí encontrarás el talento ideal para impulsar tu marca, tu contenido y tus producciones.
                        <br />
                        <span className="text-white font-medium">Selecciona el tipo de talento que necesitas y nosotros nos encargamos del resto.</span>
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={onStart}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-8 py-4 bg-white text-black text-lg font-bold uppercase tracking-wider rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-200 via-white to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-3">
                            Explorar Talentos Disponibles
                            <ArrowRight className="w-5 h-5" />
                        </span>
                    </motion.button>

                    {/* Features/Roles Teaser */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60">
                        <div className="flex items-center gap-2">
                            <Video className="w-5 h-5 text-gray-400" />
                            <span className="text-sm uppercase tracking-wider text-gray-400">Presentadoras</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <div className="flex items-center gap-2">
                            <Camera className="w-5 h-5 text-gray-400" />
                            <span className="text-sm uppercase tracking-wider text-gray-400">Modelos</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-sm uppercase tracking-wider text-gray-400">Anfitrionas</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <div className="flex items-center gap-2">
                            <Mic className="w-5 h-5 text-gray-400" />
                            <span className="text-sm uppercase tracking-wider text-gray-400">Voceros</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
