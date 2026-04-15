'use client';

import { motion } from 'framer-motion';
import { Calendar, Video, Camera, Sparkles, UserCheck } from 'lucide-react';

export default function EventsWelcome({ onStart }) {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-15 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                {/* Assistant Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center order-2 md:order-1"
                >
                    <div className="relative w-72 h-72 md:w-96 md:h-96">
                        <div className="absolute inset-0 bg-lime-500/20 rounded-full animate-pulse blur-xl" />
                        <div className="relative bg-gradient-to-b from-[#0E0E18] to-[#050511] border border-lime-500/30 rounded-full w-full h-full flex items-center justify-center overflow-hidden shadow-2xl p-8">
                            {/* Abstract Icon Graphic */}
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <div className="flex gap-4">
                                    <Video className="w-16 h-16 text-lime-500" />
                                    <Camera className="w-16 h-16 text-green-400" />
                                </div>
                                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                                    <span className="text-lime-400 font-bold uppercase tracking-widest text-xs">DIIC ZONE Live</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute top-10 -left-4 px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl shadow-xl flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold text-white">Recording</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="order-1 md:order-2"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 mb-6 backdrop-blur-sm">
                        <UserCheck className="w-4 h-4 text-lime-400" />
                        <span className="text-sm font-bold text-lime-300 uppercase tracking-widest">
                            Tu Asistente de Cobertura
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                        Hola <span className="text-2xl align-middle">👋</span><br />
                        Soy tu asistente de <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">Cobertura de Eventos</span>.
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                        Aquí te ayudamos a capturar tus momentos más importantes con calidad profesional.
                        <br />
                        <strong className="text-white font-bold">Cuéntame... ¿qué evento deseas cubrir hoy?</strong>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            onClick={() => onStart('quote')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 px-6 bg-gradient-to-r from-lime-600 to-green-600 rounded-xl font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-lime-500/20 transition-all flex items-center justify-center gap-3 group"
                        >
                            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Quiero cotizar un evento
                        </motion.button>

                        <motion.button
                            onClick={() => onStart('schedule')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 px-6 bg-[#0E0E18] border border-white/10 rounded-xl font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
                        >
                            <Calendar className="w-5 h-5 group-hover:text-lime-400 transition-colors" />
                            Quiero agendar cobertura
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
