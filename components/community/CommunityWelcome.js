'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Users, MessageSquare } from 'lucide-react';

export default function CommunityWelcome({ onStart }) {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#050511]">

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050511] to-[#050511]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left: Persona Intro */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-8"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                        <span className="text-xs font-bold tracking-[0.2em] text-indigo-300 uppercase">Núcleo Estratégico</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                        Hola, soy tu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Manager.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-8 font-light leading-relaxed border-l-4 border-indigo-500/30 pl-6">
                        Estoy aquí para ayudarte a planificar, supervisar y hacer crecer tu marca.
                        Desde aquí conectamos la estrategia con la acción.
                    </p>

                    <div className="bg-[#0E0E18] border border-white/10 rounded-2xl p-6 mb-8 max-w-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Tu equipo está listo</h3>
                                <p className="text-xs text-gray-500">Diseñadores, Editores y Estrategas conectados.</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 italic">"Los reportes de esta semana muestran un crecimiento del 15% en engagement. ¿Revisamos la estrategia?"</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={onStart}
                            className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Entrar al Control Room</span>
                        </button>
                    </div>
                </div>

                {/* Right: Quick Stats / Hologram Concept */}
                <div className="relative hidden lg:block">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 grid grid-cols-2 gap-4"
                    >
                        {/* Stat Card 1 */}
                        <div className="bg-[#0E0E18]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:border-indigo-500/50 transition-colors group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-3xl font-black text-white mb-1">+24%</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Crecimiento</div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-[#0E0E18]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:border-purple-500/50 transition-colors group cursor-pointer mt-8">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Target className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-3xl font-black text-white mb-1">3/5</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Objetivos</div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-[#0E0E18]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:border-pink-500/50 transition-colors group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calendar className="w-5 h-5 text-pink-400" />
                            </div>
                            <div className="text-3xl font-black text-white mb-1">12</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Eventos</div>
                        </div>

                        {/* Interactive Element */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-2xl mt-8 flex flex-col justify-between">
                            <div>
                                <div className="text-indigo-200 text-xs font-bold uppercase mb-2">Próxima Reunión</div>
                                <div className="text-white font-bold text-lg leading-tight">Revisión Mensual de Estrategia</div>
                            </div>
                            <div className="text-indigo-200 text-sm mt-4">Jueves, 10:00 AM</div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
