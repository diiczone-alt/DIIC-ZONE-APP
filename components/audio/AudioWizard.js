'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, Speaker, FileAudio, Grip } from 'lucide-react';

export default function AudioWizard({ service, onBack, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        script: '',
        duration: '1-5 min',
        quality: '48khz/24bit (Video Standard)',
        format: 'WAV + MP3',
        date: '',
        mode: 'remoto'
    });

    const totalSteps = 3;

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => step === 1 ? onBack() : setStep(prev => prev - 1);

    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col items-center pt-10 pb-20 px-4">

            {/* Circular Progress Header */}
            <div className="mb-12 flex items-center gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step === i ? 'border-sky-500 text-sky-400 bg-sky-500/10 shadow-[0_0_15px_rgba(14,165,233,0.3)]' :
                                step > i ? 'border-sky-500 bg-sky-500 text-white' :
                                    'border-gray-800 text-gray-600 bg-[#0E0E18]'
                            }`}>
                            {step > i ? <Check className="w-5 h-5" /> : i}
                        </div>
                        {i < 3 && (
                            <div className={`w-12 h-1 bg-gray-800 mx-2 rounded-full overflow-hidden`}>
                                <div className={`h-full bg-sky-500 transition-all duration-500 ${step > i ? 'w-full' : 'w-0'}`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="w-full max-w-4xl bg-[#0E0E18] border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {/* STEP 1: TECHNICAL BRIEF */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Especificaciones Técnicas</h2>
                                <p className="text-gray-400 text-sm">Define los parámetros de tu producción para el ingeniero.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2 block">Nombre del Proyecto</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-sky-500 outline-none transition-colors placeholder-gray-600"
                                            placeholder="Ej: Campaña Nike - Radio Spot"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Calidad de Entrega</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {['44.1kHz/16bit (Streaming)', '48kHz/24bit (Video Standard)', '96kHz/24bit (High Res)'].map(q => (
                                                <button
                                                    key={q}
                                                    onClick={() => setFormData({ ...formData, quality: q })}
                                                    className={`p-3 text-left rounded-lg text-sm border transition-all ${formData.quality === q ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' : 'bg-[#1a1a2e] border-transparent text-gray-400'}`}
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Instrucciones / Guion</label>
                                    <textarea
                                        value={formData.script}
                                        onChange={e => setFormData({ ...formData, script: e.target.value })}
                                        className="w-full h-full min-h-[200px] bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-sky-500 outline-none resize-none placeholder-gray-600 font-mono text-sm leading-relaxed"
                                        placeholder="// Escribe aquí el guion técnico o notas de producción..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: LOGISTICS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Logística de Sesión</h2>
                                <p className="text-gray-400 text-sm">Coordina el tiempo de estudio o entrega.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-8">
                                {[
                                    { id: 'remoto', label: 'Remote Link', icon: Speaker },
                                    { id: 'estudio', label: 'Studio A', icon: Grip },
                                    { id: 'hibrido', label: 'Hybrid', icon: FileAudio }
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setFormData({ ...formData, mode: m.id })}
                                        className={`p-8 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all group ${formData.mode === m.id
                                                ? 'bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-violet-500 text-white shadow-xl'
                                                : 'bg-[#1a1a2e] border-white/5 text-gray-500 hover:border-white/20'
                                            }`}
                                    >
                                        <m.icon className={`w-8 h-8 ${formData.mode === m.id ? 'text-violet-400' : ''}`} />
                                        <span className="font-bold uppercase tracking-widest text-xs">{m.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-[#1a1a2e] p-8 rounded-3xl border border-white/5 flex items-center gap-6">
                                <Calendar className="w-8 h-8 text-violet-500" />
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Booking Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: PRE-FLIGHT CHECK */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                                    <Check className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Pre-Flight Check Complete</span>
                                </div>
                                <h2 className="text-4xl font-black mb-4">Confirmar Orden</h2>
                                <p className="text-gray-400 max-w-md mx-auto">Tu solicitud será enviada directamente a la cola de producción del estudio.</p>
                            </div>

                            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16162a] p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[50px]"></div>

                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase mb-1">Service</div>
                                        <div className="text-lg font-bold text-white">{service?.label || 'Custom Session'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase mb-1">Format</div>
                                        <div className="text-lg font-bold text-white font-mono">{formData.quality.split(' ')[0]}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase mb-1">Mode</div>
                                        <div className="text-lg font-bold text-white capitalize">{formData.mode}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase mb-1">Est. Turnaround</div>
                                        <div className="text-lg font-bold text-white">48h Standard</div>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 mt-8 pt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-400">Total Provisorio</div>
                                    <div className="text-3xl font-black text-white">$250<span className="text-lg text-gray-500">.00</span></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Navigation */}
                <div className="mt-16 flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        className="px-6 py-3 rounded-full text-gray-400 hover:text-white font-bold text-sm transition-colors"
                    >
                        {step === 1 ? 'Cancelar' : 'Regresar'}
                    </button>
                    <button
                        onClick={step === 3 ? onComplete : handleNext}
                        className="group flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <span>{step === 3 ? 'Enviar a Producción' : 'Continuar'}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
}
