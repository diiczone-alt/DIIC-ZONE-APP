'use client';

import { motion } from 'framer-motion';
import { Bot, CreditCard, Receipt, TrendingUp, Wallet } from 'lucide-react';

export default function FinanceWelcome({ onSelect, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0E0E18] max-w-3xl w-full rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]" />

                <div className="p-8 relative z-10">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2">Finance OS 💳</h2>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Control total de tu inversión y crecimiento.</p>

                            <p className="text-xl text-white leading-relaxed mb-6">
                                <span className="text-violet-400 font-bold">Hola, soy tu asistente financiero 🤖</span><br />
                                Gestiona tu suscripción, facturas y saldo disponible para potenciar tu marca.
                                <br /><span className="text-gray-400 text-base font-normal mt-2 block">¿Qué deseas revisar hoy?</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button onClick={() => onSelect('plan')} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all text-left flex items-start gap-4">
                            <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform mt-1"><TrendingUp className="w-5 h-5" /></div>
                            <div>
                                <div className="font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">Mi Plan</div>
                                <div className="text-xs text-gray-500">Estado de suscripción.</div>
                            </div>
                        </button>

                        <button onClick={() => onSelect('invoices')} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all text-left flex items-start gap-4">
                            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform mt-1"><Receipt className="w-5 h-5" /></div>
                            <div>
                                <div className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Facturas</div>
                                <div className="text-xs text-gray-500">Historial de pagos.</div>
                            </div>
                        </button>

                        <button onClick={() => onSelect('wallet')} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all text-left flex items-start gap-4">
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform mt-1"><Wallet className="w-5 h-5" /></div>
                            <div>
                                <div className="font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">Billetera</div>
                                <div className="text-xs text-gray-500">Saldo y métodos.</div>
                            </div>
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-8 w-full py-3 rounded-xl border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                    >
                        Ver Panel Financiero Completo
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
