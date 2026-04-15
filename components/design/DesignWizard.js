'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Palette, Lightbulb, Monitor, Layers, Type, Download } from 'lucide-react';

export default function DesignWizard({ service, onBack, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 2: Brief
        objective: '',
        message: '',
        copy: '',
        target: '',
        style: '',
        colors: '',
        refs: '',
        // Internal
        category: service?.category?.name || 'General',
        format: service?.label || 'Custom'
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => step === 1 ? onBack() : setStep(prev => prev - 1);

    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col items-center pt-10 pb-20 px-4">

            {/* Progress Header */}
            <div className="mb-12 flex items-center gap-4">
                {[
                    { n: 1, label: 'Selección' },
                    { n: 2, label: 'Brief' },
                    { n: 3, label: 'Método' },
                    { n: 4, label: 'Confirmar' }
                ].map((s) => (
                    <div key={s.n} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step === s.n
                                ? 'border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                : step > s.n
                                    ? 'border-fuchsia-500 bg-fuchsia-500 text-white'
                                    : 'border-gray-800 text-gray-600 bg-[#0E0E18]'
                            }`}>
                            {step > s.n ? <Check className="w-5 h-5" /> : s.n}
                        </div>
                        <span className={`ml-2 text-xs font-bold uppercase ${step === s.n ? 'text-white' : 'text-gray-600 hidden md:block'}`}>{s.label}</span>
                        {s.n < 4 && (
                            <div className={`hidden md:block w-12 h-1 bg-gray-800 mx-4 rounded-full overflow-hidden`}>
                                <div className={`h-full bg-fuchsia-500 transition-all duration-500 ${step > s.n ? 'w-full' : 'w-0'}`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="w-full max-w-5xl bg-[#0E0E18] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none" />

                <AnimatePresence mode="wait">

                    {/* STEP 1: REVIEW SELECTION (Automated based on previous screen) */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            <h2 className="text-3xl font-bold mb-8">Confirmar Selección</h2>

                            <div className="bg-[#151525] p-8 rounded-3xl border border-white/10 flex items-center gap-6 mb-8">
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service?.category?.color || 'from-gray-700 to-gray-800'} flex items-center justify-center`}>
                                    {service?.category?.icon ? <service.category.icon className="w-10 h-10 text-white" /> : <Layers className="w-10 h-10 text-white" />}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{formData.category}</div>
                                    <h3 className="text-3xl font-black text-white mb-2">{formData.format}</h3>
                                    <p className="text-gray-400">Estás a punto de iniciar un nuevo proyecto de diseño.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <h4 className="font-bold text-white mb-2">Entregables</h4>
                                    <p className="text-sm text-gray-400">Archivos finales en alta resolución y editables si aplica.</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <h4 className="font-bold text-white mb-2">Tiempo Estimado</h4>
                                    <p className="text-sm text-gray-400">2-4 días hábiles dependiendo de la complejidad.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BRIEF CREATIVO */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Brief Creativo</h2>
                                    <p className="text-gray-400 text-sm">Cuéntanos qué necesitas para que el resultado sea perfecto.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Objetivo del Diseño</label>
                                    <textarea
                                        value={formData.objective}
                                        onChange={e => setFormData({ ...formData, objective: e.target.value })}
                                        className="w-full h-24 bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-fuchsia-500 outline-none resize-none"
                                        placeholder="Ej: Aumentar ventas de producto X, invitar a un evento..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Mensaje Principal</label>
                                    <input
                                        type="text"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-fuchsia-500 outline-none"
                                        placeholder="Título o frase clave..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Público Objetivo</label>
                                    <input
                                        type="text"
                                        value={formData.target}
                                        onChange={e => setFormData({ ...formData, target: e.target.value })}
                                        className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-fuchsia-500 outline-none"
                                        placeholder="Ej: Jóvenes de 20-30 años..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Textos / Copy (Opcional)</label>
                                    <textarea
                                        value={formData.copy}
                                        onChange={e => setFormData({ ...formData, copy: e.target.value })}
                                        className="w-full h-24 bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-fuchsia-500 outline-none resize-none"
                                        placeholder="Pega aquí los textos exactos que debe llevar el diseño..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Estilo Visual</label>
                                    <select
                                        value={formData.style}
                                        onChange={e => setFormData({ ...formData, style: e.target.value })}
                                        className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-fuchsia-500 outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="minimalist">Minimalista</option>
                                        <option value="corporate">Corporativo</option>
                                        <option value="bold">Bold / Llamativo</option>
                                        <option value="luxury">Lujoso / Premium</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Colores / Referencias</label>
                                    <input
                                        type="text"
                                        value={formData.colors}
                                        onChange={e => setFormData({ ...formData, colors: e.target.value })}
                                        className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-fuchsia-500 outline-none"
                                        placeholder="Ej: Azul y Dorado, ver link..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: CREATION METHOD (AI vs MANUAL) - Mock for this flow as it usually is pre-selected, but user requested explicit paths */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold mb-6">Método de Creación</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <button className="group relative bg-[#151525] border border-white/10 hover:border-fuchsia-500 p-8 rounded-3xl text-left transition-all overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-50"><Lightbulb className="w-8 h-8 text-fuchsia-500" /></div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-fuchsia-400">Crear con IA</h3>
                                    <p className="text-gray-400 text-sm mb-4">Genera propuestas instantáneas basadas en tu brief.</p>
                                    <div className="inline-block px-3 py-1 bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold rounded-lg border border-fuchsia-500/30">EXPERIMENTAL</div>
                                </button>

                                <button
                                    onClick={() => { }} // Usually this is the default for "Professional"
                                    className="group relative bg-[#151525] border-2 border-indigo-500 p-8 rounded-3xl text-left shadow-2xl shadow-indigo-500/20"
                                >
                                    <div className="absolute top-0 right-0 p-4"><Check className="w-8 h-8 text-indigo-500" /></div>
                                    <h3 className="text-2xl font-bold text-white mb-2 text-indigo-400">Diseñador Senior</h3>
                                    <p className="text-gray-400 text-sm mb-4">Asigna tu proyecto a nuestro equipo de expertos.</p>
                                    <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg border border-indigo-500/30">RECOMENDADO</div>
                                </button>
                            </div>

                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mt-4">
                                <h4 className="font-bold text-white mb-2">Resumen del Pedido</h4>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    <li>• Tipo: {formData.category} - {formData.format}</li>
                                    <li>• Objetivo: {formData.objective || 'Pendiente'}</li>
                                    <li>• Entrega: Formatos editables y finales</li>
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: PRODUCTION / CONFIRMATION */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col items-center justify-center h-full text-center space-y-6"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-fuchsia-600/30 mb-4 animate-pulse">
                                <Check className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-4xl font-black text-white">¡Todo Listo!</h2>
                            <p className="text-xl text-gray-400 max-w-lg">Tu solicitud ha sido creada. Un diseñador revisará tu brief y comenzará a trabajar en breve.</p>

                            <div className="w-full max-w-md bg-[#151525] rounded-xl p-6 border border-white/10 mt-6 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500 text-sm">Estado Inicial</span>
                                    <span className="text-yellow-400 text-sm bold">En espera de revisión</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div className="w-1/4 h-full bg-yellow-400"></div>
                                </div>
                                <p className="text-[10px] text-gray-600 mt-2">Te notificaremos cuando el estado cambie a "En Diseño".</p>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4">
                {step > 1 && step < 4 && (
                    <button onClick={handlePrev} className="px-6 py-3 rounded-xl hover:bg-white/10 text-gray-400 transition-colors">
                        Atrás
                    </button>
                )}
                {step < 4 ? (
                    <button
                        onClick={handleNext}
                        disabled={step === 2 && !formData.objective}
                        className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente Paso
                    </button>
                ) : (
                    <button
                        onClick={onComplete}
                        className="px-8 py-3 bg-fuchsia-600 text-white rounded-xl font-bold hover:bg-fuchsia-500 transition-colors shadow-lg shadow-fuchsia-600/20"
                    >
                        Ir al Dashboard
                    </button>
                )}
            </div>
        </div>
    );
}
