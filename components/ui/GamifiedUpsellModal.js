'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, X, ShieldPlus, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GamifiedUpsellModal({ isOpen, onClose }) {
    const router = useRouter();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 50, rotate: -2 }}
                        animate={{ scale: 1, y: 0, rotate: 0 }}
                        exit={{ scale: 0.9, y: 50, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="bg-[#0A0A1F] border-2 border-indigo-500/30 max-w-2xl w-full rounded-[2rem] p-8 md:p-12 text-center shadow-[0_0_100px_rgba(99,102,241,0.2)] relative overflow-hidden"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Background Effects */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0 opacity-80" />
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

                        {/* Icon/Avatar */}
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 relative transform rotate-3">
                            <ShieldAlert className="w-12 h-12 text-indigo-400" strokeWidth={1.5} />
                            <div className="absolute -inset-4 bg-indigo-500/20 animate-ping rounded-2xl opacity-50" style={{ animationDuration: '3s' }} />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            ¡INVASIÓN DE MENSAJES!
                        </h2>
                        
                        <p className="text-lg text-indigo-200 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
                            Comandante, nuestras líneas de comunicación están colapsando. El flujo de interacciones es masivo. <strong className="text-white">Necesitamos refuerzos inmediatos</strong> para organizar la batalla y no perder ninguna venta.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                            {/* Power Up: CRM */}
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    onClose();
                                    router.push('/dashboard/profile?upgrade=crm');
                                }}
                                className="group p-6 rounded-2xl bg-gradient-to-b from-blue-900/40 to-[#0A0A1F] border border-blue-500/30 hover:border-blue-400 relative overflow-hidden transition-all shadow-[0_0_30px_rgba(59,130,246,0)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ShieldPlus className="w-24 h-24 text-blue-500" />
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 relative z-10 border border-blue-500/30">
                                    <ShieldPlus className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tight relative z-10">Desplegar CRM</h3>
                                <p className="text-sm text-blue-200/70 mb-4 font-medium relative z-10">Escudo táctico. Organiza, etiqueta y gestiona el flujo de clientes sin perder el control.</p>
                                <span className="text-xs font-black text-blue-400 uppercase tracking-widest relative z-10 flex items-center gap-2">
                                    Activar Defensa <Zap className="w-3 h-3" />
                                </span>
                            </motion.button>

                            {/* Power Up: AI Agents */}
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    onClose();
                                    router.push('/dashboard/profile?upgrade=ai');
                                }}
                                className="group p-6 rounded-2xl bg-gradient-to-b from-amber-900/40 to-[#0A0A1F] border border-amber-500/30 hover:border-amber-400 relative overflow-hidden transition-all shadow-[0_0_30px_rgba(245,158,11,0)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Bot className="w-24 h-24 text-amber-500" />
                                </div>
                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 relative z-10 border border-amber-500/30">
                                    <Bot className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tight relative z-10">Escuadrón IA</h3>
                                <p className="text-sm text-amber-200/70 mb-4 font-medium relative z-10">Autómatas tácticos. Responden 24/7 y filtran a las tropas enemigas (clientes no calificados).</p>
                                <span className="text-xs font-black text-amber-400 uppercase tracking-widest relative z-10 flex items-center gap-2">
                                    Activar Escuadrón <Zap className="w-3 h-3" />
                                </span>
                            </motion.button>
                        </div>

                        <button 
                            onClick={onClose}
                            className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            Seguir luchando sin refuerzos (No recomendado)
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
