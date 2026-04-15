'use client';

import { useState } from 'react';
import {
    Stethoscope, Activity, Pill, FileText, Plus, Check,
    ChevronRight, ArrowLeft, DollarSign, Send, MessageCircle,
    Zap, TrendingUp, Calendar, Clock, MapPin, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BUSINESS_OFFERS = [
    { id: 'consulta', name: 'Consulta Médica', icon: Stethoscope, color: 'text-blue-400', bg: 'bg-blue-500/10', basePrice: 50, desc: 'Evaluación general y diagnóstico inicial.' },
    { id: 'cirugia', name: 'Cirugía Especializada', icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10', basePrice: 1200, desc: 'Procedimiento quirúrgico ambulatorio.' },
    { id: 'tratamiento', name: 'Tratamiento', icon: Pill, color: 'text-green-400', bg: 'bg-green-500/10', basePrice: 300, desc: 'Ciclo completo de seguimiento.' },
    { id: 'checkup', name: 'Chequeo General', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10', basePrice: 150, desc: 'Exámenes preventivos anuales.' },
];

export default function QuoteGenerator({ onBack, onFinish }) {
    const [step, setStep] = useState(1);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [config, setConfig] = useState({
        modality: 'Presencial',
        duration: '30 min',
        benefit: 'Evaluación completa + Plan de acción'
    });
    const [price, setPrice] = useState(0);

    const handleSelectOffer = (offer) => {
        setSelectedOffer(offer);
        setPrice(offer.basePrice);
        handleNext();
    };

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const generatedMessage = selectedOffer ? `Hola Ana, gusto saludarte. 👋
    
Te comparto los detalles de la *${selectedOffer.name}* que conversamos:

📍 **Modalidad:** ${config.modality}
⏱ **Duración:** ${config.duration}
✅ **Incluye:** ${config.benefit}

💰 **Inversión:** $${price}

¿Te gustaría que agendemos tu cita para esta semana? Quedan pocos cupos.` : '';

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={step === 1 ? onBack : handlePrev} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Generador de Ofertas
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                            Médico
                        </span>
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className={step >= 1 ? 'text-blue-400 font-bold' : ''}>1. Selección</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className={step >= 2 ? 'text-blue-400 font-bold' : ''}>2. Configuración</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className={step >= 3 ? 'text-blue-400 font-bold' : ''}>3. Mensaje</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className={step >= 4 ? 'text-blue-400 font-bold' : ''}>4. Impacto</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pb-20">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 text-center">¿Qué vas a vender hoy?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                {BUSINESS_OFFERS.map(offer => (
                                    <button
                                        key={offer.id}
                                        onClick={() => handleSelectOffer(offer)}
                                        className="p-6 rounded-2xl bg-[#0A0A12] border border-white/5 hover:border-blue-500 hover:bg-blue-500/5 hover:scale-105 transition-all group flex flex-col items-center gap-4 text-center"
                                    >
                                        <div className={`p-4 rounded-full ${offer.bg} ${offer.color}`}>
                                            <offer.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{offer.name}</h4>
                                            <p className="text-xs text-gray-400 mt-2">{offer.desc}</p>
                                        </div>
                                        <span className="mt-auto pt-4 text-green-400 font-bold font-mono">
                                            ${offer.basePrice}
                                        </span>
                                    </button>
                                ))}
                                <button className="p-6 rounded-2xl border border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-4 transition-all bg-transparent group min-h-[200px]">
                                    <div className="p-4 rounded-full bg-white/5 text-gray-400 group-hover:text-white">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <span className="font-bold text-gray-400 group-hover:text-white text-center">Oferta Personalizada</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-lg mx-auto">
                            <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                                    <div className={`p-2 rounded-lg ${selectedOffer.bg} ${selectedOffer.color}`}>
                                        <selectedOffer.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{selectedOffer.name}</h3>
                                        <p className="text-xs text-gray-400">Configura los detalles para el paciente</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <InputGroup label="Modalidad" value={config.modality} icon={MapPin} onChange={(v) => setConfig({ ...config, modality: v })} />
                                    <InputGroup label="Duración Estimada" value={config.duration} icon={Clock} onChange={(v) => setConfig({ ...config, duration: v })} />
                                    <InputGroup label="Precio ($)" value={price} icon={DollarSign} onChange={(v) => setPrice(v)} type="number" />

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 font-bold uppercase ml-1">Beneficio Principal</label>
                                        <textarea
                                            value={config.benefit}
                                            onChange={(e) => setConfig({ ...config, benefit: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none h-20 resize-none"
                                        />
                                    </div>
                                </div>

                                <button onClick={handleNext} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-600/20">
                                    Crear Propuesta
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">

                            {/* Message Preview */}
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" /> Vista Previa Mensaje
                                </h3>
                                <div className="bg-[#0f0f15] p-6 rounded-xl border border-white/5 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {generatedMessage}
                                </div>
                                <button className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="w-full md:w-80 space-y-4">
                                <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                                    <div className="mb-6">
                                        <span className="text-xs text-gray-500 font-bold uppercase">Valor Potencial</span>
                                        <div className="text-3xl font-bold text-green-400">${price}</div>
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-3 mb-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-4 h-4" /> Enviar por WhatsApp
                                    </button>
                                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2">
                                        <MessageCircle className="w-4 h-4" /> Enviar por DM
                                    </button>
                                </div>

                                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-purple-200">
                                            Al enviar, el sistema vinculará este ingreso potencial al contenido <strong>"Reel Cirugía Láser"</strong> para recalcular tu ROI.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center pt-10">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
                                <Check className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">¡Oferta Enviada!</h2>
                            <p className="text-gray-400 mb-8">El CRM ha registrado esta oportunidad.</p>

                            <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 mb-8 text-left">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Impacto Proyectado</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Ventas Totales</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-xs line-through">$2,300</span>
                                            <span className="text-green-400 font-bold">+${price}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">ROI de Campaña</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-xs line-through">360%</span>
                                            <span className="text-purple-400 font-bold">385% 🚀</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={onFinish} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-colors">
                                Volver al Lead
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function InputGroup({ label, value, icon: Icon, onChange, type = "text" }) {
    return (
        <div className="space-y-2">
            <label className="text-xs text-gray-400 font-bold uppercase ml-1">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
            </div>
        </div>
    );
}
