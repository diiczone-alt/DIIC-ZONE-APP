'use client';

import { motion } from 'framer-motion';
import {
    Package, Clock, Truck, CheckCircle,
    Printer, FileText, AlertCircle
} from 'lucide-react';

export default function PrintDashboard({ activeOrder, onBack }) {
    // Mock tracking status
    const currentStep = 3; // 0: Design, 1: Quote, 2: Production, 3: Shipping...

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <button
                onClick={onBack}
                className="mb-8 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors"
            >
                ← Nuevo Pedido
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Order Card */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0E0E18] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase mb-1">Tu Pedido #8492</h2>
                                <p className="text-gray-400 text-sm">Tarjetas de Presentación Premium (1000u)</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase rounded-full">
                                En Producción
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative mb-12 px-4">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -z-10" />
                            <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 -z-10 transition-all duration-1000" style={{ width: '60%' }} />

                            <div className="flex justify-between">
                                {[
                                    { icon: FileText, label: 'Diseño' },
                                    { icon: Clock, label: 'Revisión' },
                                    { icon: Printer, label: 'Producción' },
                                    { icon: Truck, label: 'Envío' },
                                    { icon: Package, label: 'Entrega' }
                                ].map((step, idx) => {
                                    const isCompleted = idx < 2;
                                    const isCurrent = idx === 2;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-[#0E0E18] z-10 transition-colors ${isCompleted ? 'border-yellow-500 text-yellow-500' :
                                                    isCurrent ? 'border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
                                                        'border-white/10 text-gray-600'
                                                }`}>
                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase ${isCurrent ? 'text-white' : 'text-gray-500'
                                                }`}>{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Log */}
                        <div className="bg-white/5 rounded-xl p-4 space-y-3">
                            <div className="flex gap-3 text-sm">
                                <span className="text-gray-500 w-16">10:30 AM</span>
                                <span className="text-white">Entró a máquina de impresión offset.</span>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <span className="text-gray-500 w-16">09:15 AM</span>
                                <span className="text-gray-400">Archivos verificados y aprobados por preprensa.</span>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <span className="text-gray-500 w-16">Ayer</span>
                                <span className="text-gray-400">Pago confirmado. Pedido iniciado.</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-[#0E0E18] border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Detalles del Pedido</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Cantidad</span>
                                <span className="text-white font-bold">1000 u.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Material</span>
                                <span className="text-white">Couché 300g</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Acabado</span>
                                <span className="text-white">Mate + UV</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-white/10">
                                <span className="text-gray-400">Total</span>
                                <span className="text-yellow-400 font-bold">$45.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0E0E18] border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">¿Necesitas Ayuda?</h3>
                        <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-xl mb-4">
                            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <p className="text-xs text-blue-200">
                                Si necesitas cambiar el destino de envío, contáctanos antes de que el estado cambie a "Enviado".
                            </p>
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-gray-200">
                            Chat con Imprenta
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
