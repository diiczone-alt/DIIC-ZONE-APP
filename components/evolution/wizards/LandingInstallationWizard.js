'use client';

import { useState } from 'react';
import {
    Layout, ArrowRight, CheckCircle, Smartphone,
    Palette, Type, MousePointer2, Image as ImageIcon,
    FileText, Send, Database, Zap, Globe, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingInstallationWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        objective: '', // 'booking', 'info', 'quote', 'download', 'register'
        info: { title: '', subtitle: '', benefits: [], services: [] },
        formFields: ['name', 'phone', 'service', 'message'],
        destination: [], // 'crm', 'whatsapp', 'email'
        design: '' // 'professional', 'modern', 'minimal', 'corporate'
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
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Layout className="w-12 h-12 text-emerald-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Landing Page Inteligente</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Aquí tus clientes dejarán sus datos para que tu sistema los atienda automáticamente.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 mx-auto">
                <Palette className="w-5 h-5" /> Comenzar Configuración
            </button>
        </div>
    );

    const ObjectiveStep = () => (
        <div className="space-y-6">
            <StepHeader title="Objetivo de la Página" subtitle="¿Qué quieres que haga esta página?" />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Smartphone} label="Agendar Citas" selected={formData.objective === 'booking'} onClick={() => setSingle('objective', 'booking')} color="emerald" />
                <SelectCard icon={MessageSquare} label="Solicitar Info" selected={formData.objective === 'info'} onClick={() => setSingle('objective', 'info')} color="emerald" />
                <SelectCard icon={FileText} label="Cotizar Servicio" selected={formData.objective === 'quote'} onClick={() => setSingle('objective', 'quote')} color="emerald" />
                <SelectCard icon={MousePointer2} label="Inscribirse" selected={formData.objective === 'register'} onClick={() => setSingle('objective', 'register')} color="emerald" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.objective} color="emerald" />
        </div>
    );

    const InfoStep = () => (
        <div className="space-y-6">
            <StepHeader title="Información Principal" subtitle="Define el contenido clave (IA sugerida)." />
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Título Principal</label>
                    <input type="text" placeholder="Ej: Transforma tu cuerpo hoy" className="w-full bg-black/30 text-white rounded-lg p-3 border border-white/10 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Subtítulo</label>
                    <input type="text" placeholder="Ej: Planes personalizados para ti" className="w-full bg-black/30 text-white rounded-lg p-3 border border-white/10 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center text-sm text-gray-400">
                        <span className="block font-bold text-emerald-400 mb-1">Beneficios</span>
                        3 Puntos Clave
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center text-sm text-gray-400">
                        <span className="block font-bold text-emerald-400 mb-1">Servicios</span>
                        Lista de Oferta
                    </div>
                </div>
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={false} color="emerald" />
        </div>
    );

    const FormStep = () => (
        <div className="space-y-6">
            <StepHeader title="Formulario de Captación" subtitle="¿Qué datos pedimos al cliente?" />
            <div className="space-y-3">
                <ActionCheck label="Nombre Completo" desc="Obligatorio." checked={true} color="emerald" />
                <ActionCheck label="Teléfono / WhatsApp" desc="Para contactar." checked={true} color="emerald" />
                <ActionCheck label="Servicio de Interés" desc="Menú desplegable." checked={formData.formFields.includes('service')} onChange={() => toggleSelection('formFields', 'service')} color="emerald" />
                <ActionCheck label="Mensaje Adicional" desc="Campo de texto libre." checked={formData.formFields.includes('message')} onChange={() => toggleSelection('formFields', 'message')} color="emerald" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={false} color="emerald" />
        </div>
    );

    const DestinationStep = () => (
        <div className="space-y-6">
            <StepHeader title="¿A dónde van los Leads?" subtitle="Conecta con tus sistemas." />
            <div className="space-y-3">
                <ActionCheck label="Guardar en CRM" desc="Crear tarjeta de cliente." checked={formData.destination.includes('crm')} onChange={() => toggleSelection('destination', 'crm')} color="emerald" />
                <ActionCheck label="Notificar por WhatsApp" desc="Aviso inmediato a ti." checked={formData.destination.includes('whatsapp')} onChange={() => toggleSelection('destination', 'whatsapp')} color="emerald" />
                <ActionCheck label="Enviar Email" desc="Respaldo de información." checked={formData.destination.includes('email')} onChange={() => toggleSelection('destination', 'email')} color="emerald" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.destination.length === 0} color="emerald" />
        </div>
    );

    const DesignStep = () => (
        <div className="space-y-6">
            <StepHeader title="Diseño Visual" subtitle="Elige la estética de tu landing." />
            <div className="grid grid-cols-2 gap-4">
                <StyleCard label="Profesional" value="professional" current={formData.design} set={v => setSingle('design', v)} color="emerald" />
                <StyleCard label="Moderno" value="modern" current={formData.design} set={v => setSingle('design', v)} color="emerald" />
                <StyleCard label="Minimalista" value="minimal" current={formData.design} set={v => setSingle('design', v)} color="emerald" />
                <StyleCard label="Corporativo" value="corporate" current={formData.design} set={v => setSingle('design', v)} color="emerald" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.design} color="emerald" />
        </div>
    );

    const SummaryStep = () => (
        <div className="space-y-6">
            <StepHeader title="Página Lista" subtitle="Tu sistema de captación:" />

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold text-white">Objetivo: <span className="text-emerald-400 capitalize">{formData.objective}</span></span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2">
                    <SummaryItem text={`Diseño: ${formData.design}`} color="emerald" />
                    <SummaryItem text="Formulario Inteligente Activado" color="emerald" />
                    <SummaryItem text={`Destino: ${formData.destination.join(', ')}`} color="emerald" />
                    <SummaryItem text="Conectado a: CRM, Chatbot y Agenda" color="emerald" />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">
                    Atrás
                </button>
                <button onClick={onComplete} className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" /> Crear Landing Page
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
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }} />
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
                            {step === 2 && <ObjectiveStep />}
                            {step === 3 && <InfoStep />}
                            {step === 4 && <FormStep />}
                            {step === 5 && <DestinationStep />}
                            {step === 6 && <DesignStep />}
                            {step === 7 && <SummaryStep />}
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
    const bg = color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-purple-600';
    return (
        <div className="flex justify-between pt-8 border-t border-white/5 mt-8">
            <button onClick={back} className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium">Atrás</button>
            <button
                onClick={next}
                disabled={disabled}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${disabled ? 'bg-white/5 text-gray-600 cursor-not-allowed' : `${bg} text-black shadow-lg`}`}
            >
                Siguiente <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function SelectCard({ icon: Icon, label, selected, onClick, color = 'emerald' }) {
    const activeClass = color === 'emerald' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-blue-500/20 border-blue-500';
    const activeText = color === 'emerald' ? 'text-emerald-400' : 'text-blue-400';

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

function StyleCard({ label, value, current, set, color = 'emerald' }) {
    const isSelected = current === value;
    const activeClass = color === 'emerald' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-blue-500/20 border-blue-500';
    const dotClass = color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500';

    return (
        <div
            onClick={() => set(value)}
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all ${isSelected ? activeClass : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`w-4 h-4 rounded-full border border-white/20 ${isSelected ? dotClass : 'bg-transparent'}`} />
            <div>
                <div className={`font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{label}</div>
            </div>
        </div>
    );
}

function ActionCheck({ label, desc, checked, onChange, color = 'emerald' }) {
    const activeClass = color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5';
    const checkClass = color === 'emerald' ? 'bg-emerald-500 border-emerald-500' : 'bg-blue-500 border-blue-500';

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

function SummaryItem({ text, color = 'emerald' }) {
    const col = color === 'emerald' ? 'text-emerald-500' : 'text-green-500';
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className={`w-4 h-4 ${col}`} />
            <span>{text}</span>
        </div>
    );
}
