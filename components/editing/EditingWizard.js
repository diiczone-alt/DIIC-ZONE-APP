'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scissors, UploadCloud, Music, Type, CheckCircle,
    MonitorPlay, Share2, Clapperboard, Briefcase,
    ArrowRight, X, Clock, FileText, Smartphone
} from 'lucide-react';

export default function EditingWizard({ onClose }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ type: '', style: '', format: '', subtitles: false });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-[#0B0B15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#080810]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
                            <Scissors className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Nuevo Encargo de Edición</h2>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-1 w-6 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-gray-800'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-12 relative bg-gradient-to-b from-[#0B0B15] to-black">
                    <AnimatePresence mode="wait">
                        {step === 1 && <StepType key="s1" onSelect={(t) => { setFormData({ ...formData, type: t }); nextStep(); }} />}
                        {step === 2 && <StepUpload key="s2" onNext={nextStep} />}
                        {step === 3 && <StepStyle key="s3" data={formData} onChange={d => setFormData({ ...formData, ...d })} />}
                        {step === 4 && <StepSpecs key="s4" data={formData} onChange={d => setFormData({ ...formData, ...d })} />}
                        {step === 5 && <StepPayment key="s5" onClose={onClose} />}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {step > 1 && step < 5 && (
                    <div className="p-6 border-t border-white/5 bg-[#080810] flex justify-between">
                        <button onClick={prevStep} className="px-6 py-3 rounded-xl hover:bg-white/5 text-gray-400 font-bold transition-colors">Atrás</button>
                        <button onClick={nextStep} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2">
                            Continuar <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// --- Steps ---

function StepType({ onSelect }) {
    const TYPES = [
        { id: 'social', label: 'Reels / TikTok', icon: Smartphone, desc: 'Edición dinámica vertical, cortes rápidos.' },
        { id: 'youtube', label: 'Video YouTube', icon: MonitorPlay, desc: 'Narrativa horizontal, ritmo medio.' },
        { id: 'corp', label: 'Corporativo', icon: Briefcase, desc: 'Estilo limpio, profesional y sobrio.' },
        { id: 'event', label: 'Evento / Aftermovie', icon: Clapperboard, desc: 'Montaje musical, highlights.' },
    ];
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-white mb-2">¿Qué vamos a editar?</h3>
            <p className="text-gray-400 text-center mb-10">Selecciona el formato para configurar el flujo de trabajo.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TYPES.map(t => (
                    <button key={t.id} onClick={() => onSelect(t.label)} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-purple-600/10 hover:border-purple-600/50 transition-all text-left flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-black/40 text-gray-400 group-hover:text-purple-400 transition-colors">
                            <t.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{t.label}</h4>
                            <p className="text-sm text-gray-500">{t.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepUpload({ onNext }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto text-center space-y-8">
            <h3 className="text-2xl font-bold text-white">Sube tu Material Raw</h3>
            <div className="border-2 border-dashed border-white/10 rounded-3xl h-64 flex flex-col items-center justify-center hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4 group-hover:scale-110 group-hover:text-purple-400 transition-all">
                    <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-lg text-white font-medium group-hover:text-purple-400">Arrastra archivos aquí</p>
                <p className="text-sm text-gray-500 mt-2">Soporta MP4, MOV, WAV, ZIP (Hasta 50GB)</p>
            </div>
            <div className="flex justify-center">
                <button className="text-sm text-purple-400 hover:text-purple-300 underline">Usar enlace de Google Drive / Dropbox</button>
            </div>
        </motion.div>
    );
}

function StepStyle({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-2xl font-bold text-white text-center">Estilo y Ritmo</h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Ritmo de Edición</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Lento / Calmado', 'Normal / Narrativo', 'Rápido / Dinámico'].map(opt => (
                            <button key={opt} onClick={() => onChange({ style: opt })} className={`p-3 rounded-xl border text-sm font-medium transition-all ${data.style === opt ? 'bg-purple-600/20 border-purple-600 text-purple-400' : 'bg-white/5 border-white/5 text-gray-400'}`}>{opt}</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Música / Vibe</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Corporativa / Inspiring', 'Urbana / Trendy', 'Cinemática / Épica', 'Lo-Fi / Chill'].map(opt => (
                            <button key={opt} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-left">
                                <Music className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-300 text-sm">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Referencias (Links)</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-purple-600 outline-none" placeholder="https://instagram.com/p/..." />
                </div>
            </div>
        </motion.div>
    );
}

function StepSpecs({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-2xl font-bold text-white text-center">Especificaciones Técnicas</h3>

            <div className="bg-[#080810] rounded-2xl p-6 border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Type className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-white font-bold">Subtítulos</h4>
                            <p className="text-xs text-gray-500">Generar subtítulos animados estilo hormozi</p>
                        </div>
                    </div>
                    <input type="checkbox" className="w-6 h-6 rounded border-gray-600 text-purple-600 bg-transparent focus:ring-purple-600" />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500"><Share2 className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-white font-bold">Adaptación de Formato</h4>
                            <p className="text-xs text-gray-500">Entregar versión 9:16 y 16:9</p>
                        </div>
                    </div>
                    <input type="checkbox" className="w-6 h-6 rounded border-gray-600 text-purple-600 bg-transparent focus:ring-purple-600" />
                </div>
            </div>
        </motion.div>
    );
}

function StepPayment({ onClose }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center pt-10">
            <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">¡Todo Listo!</h3>
            <p className="text-gray-400 mb-8">El material se está subiendo en segundo plano. Nuestro editor asignado revisará los archivos en breve.</p>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Servicio</span>
                    <span className="text-white font-bold">Edición Pro</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-400">Entrega Estimada</span>
                    <span className="text-purple-400 font-bold">48 Horas</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-gray-400 text-xs">Costo Estimado</span>
                    <span className="text-2xl font-bold text-white">$150.00</span>
                </div>
            </div>

            <button onClick={onClose} className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20">
                Confirmar y Subir
            </button>
        </motion.div>
    );
}
