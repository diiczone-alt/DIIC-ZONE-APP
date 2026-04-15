'use client';

import { motion } from 'framer-motion';
import { Bot, Sparkles, ArrowRight, Code, Layout, Rocket } from 'lucide-react';

export default function WebWelcome({ onStart }) {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-15 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                {/* Assistant Avatar / Visual */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center"
                >
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse blur-xl" />
                        <div className="relative bg-gradient-to-b from-[#0E0E18] to-[#050511] border border-cyan-500/30 rounded-full w-full h-full flex items-center justify-center overflow-hidden shadow-2xl">
                            <Bot className="w-32 h-32 text-cyan-400" />
                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute top-10 right-10 p-2 bg-[#0E0E18] border border-white/10 rounded-lg shadow-lg"
                            >
                                <Code className="w-5 h-5 text-blue-400" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                                className="absolute bottom-10 left-10 p-2 bg-[#0E0E18] border border-white/10 rounded-lg shadow-lg"
                            >
                                <Layout className="w-5 h-5 text-purple-400" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-bold text-cyan-300 uppercase tracking-widest">
                            Tu Departamento Tech
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                        Hola <span className="text-2xl align-middle">👋</span><br />
                        Soy tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Desarrollador Web</span> dentro de DIIC ZONE.
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                        Te ayudaré a crear, optimizar y escalar tu presencia digital.
                        <br />
                        <span className="text-gray-300 font-medium">Cuéntame... ¿qué tipo de sitio necesitas desarrollar hoy?</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            onClick={() => onStart('create')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 group"
                        >
                            <Layout className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Quiero crear mi sitio web
                        </motion.button>

                        <motion.button
                            onClick={() => onStart('improve')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 px-6 bg-[#0E0E18] border border-white/10 rounded-xl font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
                        >
                            <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform text-gray-500 group-hover:text-white" />
                            Quiero mejorar mi sitio actual
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
