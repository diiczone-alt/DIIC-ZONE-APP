'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, CheckCircle, ArrowRight, Mic, Music, Radio } from 'lucide-react';

export default function AudioRequest({ onBack, onSubmit }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        serviceType: '',
        goal: '',
        duration: '',
        date: '',
        time: ''
    });

    const services = [
        { id: 'podcast', title: 'Podcast Pro', icon: Mic, price: '$150' },
        { id: 'voiceover', title: 'Locución / Voice Over', icon: Radio, price: '$80' },
        { id: 'production', title: 'Producción Musical', icon: Music, price: '$300' },
    ];

    const handleSubmit = () => {
        // Mock submission
        onSubmit(formData);
    };

    return (
        <div className="min-h-screen bg-[#050511] p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full bg-[#0E0E18] rounded-3xl border border-white/10 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white">
                    <h2 className="text-2xl font-black mb-2">Solicitud de Grabación Profesional</h2>
                    <p className="opacity-80">Agenda tu sesión con nuestros ingenieros de sonido.</p>
                </div>

                <div className="p-8">
                    {/* Step Indicator */}
                    <div className="flex items-center gap-4 mb-8 text-sm font-bold text-gray-500">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-white/10'}`}>1</div>
                        <div className="h-1 flex-1 bg-white/5"><div className={`h-full bg-orange-500 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} /></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-white/10'}`}>2</div>
                        <div className="h-1 flex-1 bg-white/5"><div className={`h-full bg-orange-500 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} /></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-white/10'}`}>3</div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white">Selecciona el Servicio</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {services.map((srv) => (
                                    <button
                                        key={srv.id}
                                        onClick={() => setFormData({ ...formData, serviceType: srv.id })}
                                        className={`p-6 rounded-2xl border text-left transition-all ${formData.serviceType === srv.id
                                                ? 'bg-orange-500/20 border-orange-500 text-white'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
                                            }`}
                                    >
                                        <srv.icon className="w-8 h-8 mb-4" />
                                        <div className="font-bold mb-1">{srv.title}</div>
                                        <div className="text-sm opacity-60">Desde {srv.price}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between mt-8">
                                <button onClick={onBack} className="text-gray-500 hover:text-white">Cancelar</button>
                                <button
                                    disabled={!formData.serviceType}
                                    onClick={() => setStep(2)}
                                    className="bg-white text-black px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white">Detalles del Proyecto</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Objetivo del Audio</label>
                                    <textarea
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none h-32"
                                        placeholder="Ej: Podcast sobre tecnología, entrevista a experto..."
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duración Aprox.</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="15">15 min</option>
                                            <option value="30">30 min</option>
                                            <option value="60">1 hora</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Fecha Preferida</label>
                                        <input
                                            type="date"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white">Atrás</button>
                                <button
                                    disabled={!formData.goal}
                                    onClick={() => setStep(3)}
                                    className="bg-white text-black px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                                <CreditCard className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirmar Solicitud</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                Se enviará una pre-autorización de <span className="text-white font-bold">$50.00</span> para reservar tu espacio. El resto se paga al finalizar.
                            </p>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" /> Confirmar y Agendar
                            </button>
                            <button onClick={() => setStep(2)} className="mt-4 text-sm text-gray-500 hover:text-white">Volver a editar</button>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
}
