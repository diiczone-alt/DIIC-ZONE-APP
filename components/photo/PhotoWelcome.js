'use client';

import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Layers } from 'lucide-react';

export default function PhotoWelcome({ onStart }) {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[#050511]" style={{ backgroundImage: 'radial-gradient(#1a1a2e 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)', opacity: 0.15 }}></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Visual / Avatar */}
                <div className="relative hidden md:block">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            {/* Abstract Camera Lens Representation */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full" />
                            <div className="absolute inset-4 border border-white/10 rounded-full flex items-center justify-center bg-[#0E0E18]/80 backdrop-blur-sm">
                                <Camera className="w-32 h-32 text-pink-400 opacity-80" strokeWidth={1} />
                            </div>

                            {/* Floating Badges */}
                            <motion.div
                                initial={{ y: 0 }}
                                animate={{ y: -10 }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 bg-[#1a1a2e] border border-white/10 p-4 rounded-2xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 font-bold uppercase">Calidad</div>
                                        <div className="text-white font-bold">Premium 8K</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 0 }}
                                animate={{ y: 10 }}
                                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
                                className="absolute -bottom-4 -left-4 bg-[#1a1a2e] border border-white/10 p-4 rounded-2xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 font-bold uppercase">Equipo</div>
                                        <div className="text-white font-bold">Full Frame</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        Zona Creativa
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Hola <span className="text-3xl align-middle">👋</span><br />
                        Soy tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Fotógrafo Profesional</span>.
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                        En DIIC ZONE capturamos tus mejores momentos con calidad de estudio.
                        Desde retratos corporativos hasta cobertura médica especializada.
                        <br /><br />
                        <strong className="text-white font-bold">¿Qué tipo de fotografía deseas hacer hoy?</strong>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onStart('schedule')}
                            className="px-8 py-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Camera className="w-4 h-4" />
                            Agendar Sesión
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onStart('explore')}
                            className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            Explorar Tipos
                        </motion.button>
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 font-mono">
                        <button className="hover:text-pink-400 transition-colors border-b border-transparent hover:border-pink-400">
                            ▶ Ver sesiones en curso
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
