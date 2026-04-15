'use client';

import { useState } from 'react';
import {
    Coins, ArrowRight, CheckCircle, FileText,
    Tag, Send, Bell, Zap, Briefcase, ShoppingBag,
    Stethoscope, Utensils, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteInstallationWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        niche: '', // 'medical', 'gym', 'restaurant', 'brand', 'services'
        items: [], // { name: '', price: 0, discount: false }
        format: '', // 'formal', 'modern', 'corporate'
        formatOptions: [], // 'logo', 'terms', 'payment'
        triggers: [], // 'ask', 'interested', 'booking', 'manual'
        channels: [], // 'whatsapp', 'email'
        reminders: [] // '24h', 'pay', 'followup'
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const toggleSelection = (field, value) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(value)) return { ...prev, [field]: list.filter(item => item !== value) };
            return { ...prev, [field]: [...list, value] };
        });
    };

    const setSingle = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- STEPS ---

    const WelcomeStep = () => (
        <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Coins className="w-12 h-12 text-amber-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Automatiza tus Cotizaciones</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Crea y envía propuestas comerciales claras, profesionales y sin escribir ni una sola palabra.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 mx-auto">
                <FileText className="w-5 h-5" /> Comenzar Configuración
            </button>
        </div>
    );

    const NicheStep = () => (
        <div className="space-y-6">
            <StepHeader title="¿Qué ofreces?" subtitle="Adaptamos el sistema a tu tipo de negocio." />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Stethoscope} label="Salud / Médico" selected={formData.niche === 'medical'} onClick={() => setSingle('niche', 'medical')} color="amber" />
                <SelectCard icon={Zap} label="Gimnasio / Fit" selected={formData.niche === 'gym'} onClick={() => setSingle('niche', 'gym')} color="amber" />
                <SelectCard icon={Utensils} label="Restaurante" selected={formData.niche === 'restaurant'} onClick={() => setSingle('niche', 'restaurant')} color="amber" />
                <SelectCard icon={ShoppingBag} label="E-commerce" selected={formData.niche === 'brand'} onClick={() => setSingle('niche', 'brand')} color="amber" />
                <SelectCard icon={Briefcase} label="Servicios Pro" selected={formData.niche === 'services'} onClick={() => setSingle('niche', 'services')} color="amber" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.niche} color="amber" />
        </div>
    );

    const PriceStep = () => (
        <div className="space-y-6">
            <StepHeader title="Precios Base" subtitle="Define tus servicios principales para autocompletar." />

            {/* Simple visual representation of pricing config */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-xs font-bold text-gray-500 uppercase">
                    <span className="col-span-1">Servicio</span>
                    <span className="col-span-1">Precio</span>
                    <span className="col-span-1 text-center">¿Descuento?</span>
                </div>

                {[1, 2, 3].map(i => (
                    <div key={i} className="grid grid-cols-3 gap-2 items-center">
                        <div className="col-span-1 h-8 bg-white/5 rounded px-2 flex items-center text-gray-400 text-sm">Servicio {i}</div>
                        <div className="col-span-1 h-8 bg-white/5 rounded px-2 flex items-center text-gray-400 text-sm">$ 0.00</div>
                        <div className="col-span-1 flex justify-center">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-transparent text-amber-500 focus:ring-amber-500" />
                        </div>
                    </div>
                ))}

                <div className="text-center pt-2">
                    <button className="text-xs text-amber-400 font-bold hover:text-white transition-colors">+ Agregar Servicio</button>
                </div>
            </div>

            <NavButtons back={prevStep} next={nextStep} disabled={false} color="amber" />
        </div>
    );

    const FormatStep = () => (
        <div className="space-y-6">
            <StepHeader title="Formato de Propuesta" subtitle="Elige el estilo que verá tu cliente." />
            <div className="grid grid-cols-1 gap-3">
                <StyleCard label="Formal & Serio" desc="Mucha info técnica, ideal corporativo." value="formal" current={formData.format} set={v => setSingle('format', v)} color="amber" />
                <StyleCard label="Visual & Moderno" desc="Más imágenes, menos texto, alto impacto." value="modern" current={formData.format} set={v => setSingle('format', v)} color="amber" />
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Incluir en el PDF:</h4>
                <ActionCheck label="Logotipo de Marca" checked={formData.formatOptions.includes('logo')} onChange={() => toggleSelection('formatOptions', 'logo')} color="amber" />
                <ActionCheck label="Términos y Condiciones" checked={formData.formatOptions.includes('terms')} onChange={() => toggleSelection('formatOptions', 'terms')} color="amber" />
                <ActionCheck label="Botón de Pago Directo" checked={formData.formatOptions.includes('payment')} onChange={() => toggleSelection('formatOptions', 'payment')} color="amber" />
            </div>

            <NavButtons back={prevStep} next={nextStep} disabled={!formData.format} color="amber" />
        </div>
    );

    const TriggerStep = () => (
        <div className="space-y-6">
            <StepHeader title="¿Cuándo se genera?" subtitle="Automatiza la creación de la cotización." />
            <div className="space-y-3">
                <ActionCheck label="Al solicitar precio (Keyword)" desc="Ej: si escriben 'precio' o 'info'." checked={formData.triggers.includes('ask')} onChange={() => toggleSelection('triggers', 'ask')} color="amber" />
                <ActionCheck label="Al mover etapa a 'Interesado'" desc="Integración directa con CRM." checked={formData.triggers.includes('interested')} onChange={() => toggleSelection('triggers', 'interested')} color="amber" />
                <ActionCheck label="Al agendar una cita" desc="Se envía confirmación + presupuesto." checked={formData.triggers.includes('booking')} onChange={() => toggleSelection('triggers', 'booking')} color="amber" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.triggers.length === 0} color="amber" />
        </div>
    );

    const ChannelStep = () => (
        <div className="space-y-6">
            <StepHeader title="Canal de Envío" subtitle="¿Por dónde recibe la propuesta el cliente?" />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Send} label="WhatsApp" selected={formData.channels.includes('whatsapp')} onClick={() => toggleSelection('channels', 'whatsapp')} color="amber" />
                <SelectCard icon={FileText} label="Email" selected={formData.channels.includes('email')} onClick={() => toggleSelection('channels', 'email')} color="amber" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.channels.length === 0} color="amber" />
        </div>
    );

    const ReminderStep = () => (
        <div className="space-y-6">
            <StepHeader title="Seguimiento Automático" subtitle="No dejes dinero en la mesa." />
            <div className="space-y-3">
                <ActionCheck label="Avisar si no responde (24h)" desc="Reactiva la conversación." checked={formData.reminders.includes('24h')} onChange={() => toggleSelection('reminders', '24h')} color="amber" />
                <ActionCheck label="Recordatorio de Pago" desc="Si aceptó pero no ha pagado." checked={formData.reminders.includes('pay')} onChange={() => toggleSelection('reminders', 'pay')} color="amber" />
                <ActionCheck label="Seguimiento a Largo Plazo" desc="Nurturing sequence 7 días." checked={formData.reminders.includes('followup')} onChange={() => toggleSelection('reminders', 'followup')} color="amber" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.reminders.length === 0} color="amber" />
        </div>
    );

    const SummaryStep = () => (
        <div className="space-y-6">
            <StepHeader title="Sistema Listo" subtitle="Tu motor de ventas automático:" />

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <Coins className="w-6 h-6 text-amber-400" />
                    <span className="font-bold text-white">Nicho: <span className="text-amber-400 capitalize">{formData.niche}</span></span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2">
                    <SummaryItem text={`Formato: ${formData.format}`} color="amber" />
                    <SummaryItem text={`Disparadores: ${formData.triggers.length} activos`} color="amber" />
                    <SummaryItem text={`Seguimiento: ${formData.reminders.length} reglas`} color="amber" />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">
                    Atrás
                </button>
                <button onClick={onComplete} className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" /> Instalar Sistema
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0A12] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
                <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${(step / 8) * 100}%` }} />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && <WelcomeStep />}
                            {step === 2 && <NicheStep />}
                            {step === 3 && <PriceStep />}
                            {step === 4 && <FormatStep />}
                            {step === 5 && <TriggerStep />}
                            {step === 6 && <ChannelStep />}
                            {step === 7 && <ReminderStep />}
                            {step === 8 && <SummaryStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white">✕</button>
            </motion.div>
        </div>
    );
}

// --- Helpers ---

function StepHeader({ title, subtitle }) {
    return (
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
}

function NavButtons({ back, next, disabled, color = 'emerald' }) {
    const bg = color === 'amber' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' : 'bg-purple-600';
    return (
        <div className="flex justify-between pt-8 border-t border-white/5 mt-8">
            <button onClick={back} className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium">Atrás</button>
            <button
                onClick={next}
                disabled={disabled}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${disabled ? 'bg-white/5 text-gray-600 cursor-not-allowed' : `${bg} text-white shadow-lg`}`}
            >
                Siguiente <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function SelectCard({ icon: Icon, label, selected, onClick, color = 'amber' }) {
    const activeClass = color === 'amber' ? 'bg-amber-500/20 border-amber-500' : 'bg-blue-500/20 border-blue-500';
    const activeText = color === 'amber' ? 'text-amber-400' : 'text-blue-400';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${selected ? `${activeClass} text-white` : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
        >
            <Icon className={`w-8 h-8 ${selected ? activeText : 'text-gray-500'}`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
}

function StyleCard({ label, desc, value, current, set, color = 'amber' }) {
    const isSelected = current === value;
    const activeClass = color === 'amber' ? 'bg-amber-500/20 border-amber-500' : 'bg-blue-500/20 border-blue-500';
    const dotClass = color === 'amber' ? 'bg-amber-500' : 'bg-blue-500';

    return (
        <div
            onClick={() => set(value)}
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all ${isSelected ? activeClass : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`w-4 h-4 rounded-full border border-white/20 ${isSelected ? dotClass : 'bg-transparent'}`} />
            <div>
                <div className={`font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                <div className="text-xs text-gray-500 italic mt-1">{desc}</div>
            </div>
        </div>
    );
}

function ActionCheck({ label, desc, checked, onChange, color = 'amber' }) {
    const activeClass = color === 'amber' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/5';
    const checkClass = color === 'amber' ? 'bg-amber-500 border-amber-500' : 'bg-blue-500 border-blue-500';

    return (
        <div
            onClick={onChange}
            className={`cursor-pointer p-4 rounded-xl border flex items-start gap-4 transition-all ${checked ? activeClass : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? checkClass : 'border-gray-600'}`}>
                {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
                <div className={`font-bold text-sm ${checked ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
        </div>
    );
}

function SummaryItem({ text, color = 'amber' }) {
    const col = color === 'amber' ? 'text-amber-500' : 'text-green-500';
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className={`w-4 h-4 ${col}`} />
            <span>{text}</span>
        </div>
    );
}
