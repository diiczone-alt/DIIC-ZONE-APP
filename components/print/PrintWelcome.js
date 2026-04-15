'use client';

import { motion } from 'framer-motion';
import { Printer, Sparkles, ArrowRight, Package, Palette } from 'lucide-react';

export default function PrintWelcome({ onStart }) {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]" />
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
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse blur-xl" />
                        <div className="relative bg-gradient-to-b from-[#0E0E18] to-[#050511] border border-yellow-500/30 rounded-3xl rotate-3 w-full h-full flex items-center justify-center overflow-hidden shadow-2xl">
                            {/* Abstract Printer/Box Graphic */}
                            <div className="relative z-10">
                                <Printer className="w-32 h-32 text-yellow-500" />
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: -20, opacity: 1 }}
                                    transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
                                    className="absolute -top-10 left-1/2 -translate-x-1/2"
                                >
                                    <div className="w-20 h-24 bg-gradient-to-t from-white/20 to-transparent rounded-sm backdrop-blur-sm border border-white/20" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute -top-4 -right-4 px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl shadow-xl flex items-center gap-2"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold text-white">Imprentas Online</span>
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-300 uppercase tracking-widest">
                            Tu Asistente de Producción
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                        Hola <span className="text-2xl align-middle">👋</span><br />
                        Soy tu asistente de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Imprenta & Merch</span>.
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                        Conectamos con imprentas aliadas para brindarte calidad, rapidez y entregas eficientes.
                        <br />
                        <strong className="text-white font-bold">Cuéntame... ¿qué necesitas imprimir o producir hoy?</strong>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            onClick={() => onStart('print')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-3 group"
                        >
                            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Quiero imprimir algo
                        </motion.button>

                        <motion.button
                            onClick={() => onStart('branding')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 px-6 bg-[#0E0E18] border border-white/10 rounded-xl font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
                        >
                            <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform text-gray-500 group-hover:text-white" />
                            Crear material de branding
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
