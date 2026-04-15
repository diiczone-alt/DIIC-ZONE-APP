'use client';

import { useState } from 'react';
import {
    Bot, ArrowRight, CheckCircle, MessageSquare,
    Globe, Smartphone, Sparkles, BrainCircuit,
    Calendar, Users, DollarSign, Smile, Briefcase, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatbotWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        objectives: [],
        businessInfo: { name: '', services: '', hours: '', phone: '' },
        channels: [],
        tone: '',
        actions: []
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

    // --- STEP COMPONENTS ---

    const WelcomeStep = () => (
        <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Bot className="w-12 h-12 text-purple-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Vamos a crear tu Asistente</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Este bot responderá clientes, captará datos y trabajará 24/7 por ti.
                    Configúralo en unos minutos.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 mx-auto">
                Comenzar Configuración <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );

    const ObjectiveStep = () => (
        <div className="space-y-6">
            <StepHeader title="Objetivo Principal" subtitle="¿Para qué quieres usar este asistente?" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectCard
                    icon={Calendar}
                    label="Agendar Citas"
                    selected={formData.objectives.includes('agendar')}
                    onClick={() => toggleSelection('objectives', 'agendar')}
                />
                <SelectCard
                    icon={MessageSquare}
                    label="Responder FAQs"
                    selected={formData.objectives.includes('faq')}
                    onClick={() => toggleSelection('objectives', 'faq')}
                />
                <SelectCard
                    icon={Users}
                    label="Calificar Clientes"
                    selected={formData.objectives.includes('qualify')}
                    onClick={() => toggleSelection('objectives', 'qualify')}
                />
                <SelectCard
                    icon={DollarSign}
                    label="Vender Servicios"
                    selected={formData.objectives.includes('sales')}
                    onClick={() => toggleSelection('objectives', 'sales')}
                />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.objectives.length === 0} />
        </div>
    );

    const BusinessInfoStep = () => (
        <div className="space-y-6">
            <StepHeader title="Información del Negocio" subtitle="Entrena a tu bot con tus datos básicos." />
            <div className="space-y-4">
                <Input
                    label="Nombre del Negocio"
                    value={formData.businessInfo.name}
                    onChange={e => setFormData({ ...formData, businessInfo: { ...formData.businessInfo, name: e.target.value } })}
                />
                <Input
                    label="Servicios Principales"
                    value={formData.businessInfo.services}
                    onChange={e => setFormData({ ...formData, businessInfo: { ...formData.businessInfo, services: e.target.value } })}
                />
                <Input
                    label="Horario de Atención"
                    placeholder="Ej: Lun-Vie 9am-6pm"
                    value={formData.businessInfo.hours}
                    onChange={e => setFormData({ ...formData, businessInfo: { ...formData.businessInfo, hours: e.target.value } })}
                />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.businessInfo.name} />
        </div>
    );

    const ChannelStep = () => (
        <div className="space-y-6">
            <StepHeader title="Canales de Atención" subtitle="¿Dónde funcionará tu asistente?" />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard
                    icon={Smartphone}
                    label="WhatsApp"
                    selected={formData.channels.includes('whatsapp')}
                    onClick={() => toggleSelection('channels', 'whatsapp')}
                />
                <SelectCard
                    icon={Globe}
                    label="Sitio Web"
                    selected={formData.channels.includes('web')}
                    onClick={() => toggleSelection('channels', 'web')}
                />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.channels.length === 0} />
        </div>
    );

    const ToneStep = () => (
        <div className="space-y-6">
            <StepHeader title="Personalidad" subtitle="¿Cómo debe hablar tu asistente?" />
            <div className="grid grid-cols-1 gap-3">
                <ToneCard label="Formal y Directo" desc="Hola, ¿en qué puedo ayudarle hoy?" icon={Briefcase} value="formal" current={formData.tone} set={v => setSingle('tone', v)} />
                <ToneCard label="Amigable y Cercano" desc="¡Hola! 👋 ¿Qué necesitas?" icon={Smile} value="friendly" current={formData.tone} set={v => setSingle('tone', v)} />
                <ToneCard label="Profesional y Experto" desc="Bienvenido. Soy su asistente especializado." icon={Sparkles} value="expert" current={formData.tone} set={v => setSingle('tone', v)} />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.tone} />
        </div>
    );

    const ActionsStep = () => (
        <div className="space-y-6">
            <StepHeader title="Acciones Automáticas" subtitle="¿Qué poderes tendrá tu bot?" />
            <div className="space-y-3">
                <ActionCheck
                    label="Guardar Lead en CRM"
                    desc="Registrará nombre y teléfono automáticamente."
                    checked={formData.actions.includes('crm')}
                    onChange={() => toggleSelection('actions', 'crm')}
                />
                <ActionCheck
                    label="Agendar Cita en Calendario"
                    desc="Buscará huecos libres y confirmará."
                    checked={formData.actions.includes('calendar')}
                    onChange={() => toggleSelection('actions', 'calendar')}
                />
                <ActionCheck
                    label="Enviar Cotización PDF"
                    desc="Generará un presupuesto estándar."
                    checked={formData.actions.includes('quote')}
                    onChange={() => toggleSelection('actions', 'quote')}
                />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.actions.length === 0} />
        </div>
    );

    const SummaryStep = () => (
        <div className="space-y-6">
            <StepHeader title="Resumen de Instalación" subtitle="Esto hará tu asistente una vez activado:" />

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                    <span className="font-bold text-white">IA Configurada: <span className="text-purple-400 capitalize">{formData.tone}</span></span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2">
                    <SummaryItem text={`Canales: ${formData.channels.join(', ')}`} />
                    <SummaryItem text={`Objetivos: ${formData.objectives.length} seleccionados`} />
                    <SummaryItem text={`Acciones Auto.: ${formData.actions.length} activas`} />
                </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <p className="text-xs text-purple-200">
                    Al instalar, se crearán los flujos en CRM y se conectará la API de WhatsApp.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">
                    Atrás
                </button>
                <button onClick={onComplete} className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-black rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                    <Bot className="w-5 h-5" /> Instalar Asistente
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
                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }} />
                </div>

                {/* Content */}
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
                            {step === 3 && <BusinessInfoStep />}
                            {step === 4 && <ChannelStep />}
                            {step === 5 && <ToneStep />}
                            {step === 6 && <ActionsStep />}
                            {step === 7 && <SummaryStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
                    ✕
                </button>
            </motion.div>
        </div>
    );
}

// --- UI COMPONENTS ---

function StepHeader({ title, subtitle }) {
    return (
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
}

function NavButtons({ back, next, disabled }) {
    return (
        <div className="flex justify-between pt-8 border-t border-white/5 mt-8">
            <button onClick={back} className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium">
                Atrás
            </button>
            <button
                onClick={next}
                disabled={disabled}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${disabled ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'}`}
            >
                Siguiente <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function SelectCard({ icon: Icon, label, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${selected ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'}`}
        >
            <Icon className={`w-8 h-8 ${selected ? 'text-purple-400' : 'text-gray-500'}`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
}

function Input({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
            />
        </div>
    );
}

function ToneCard({ label, desc, icon: Icon, value, current, set }) {
    const isSelected = current === value;
    return (
        <div
            onClick={() => set(value)}
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all ${isSelected ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`p-3 rounded-full ${isSelected ? 'bg-purple-500 text-white' : 'bg-black/20 text-gray-500'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className={`font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                <div className="text-xs text-gray-500 italic mt-1">"{desc}"</div>
            </div>
        </div>
    );
}

function ActionCheck({ label, desc, checked, onChange }) {
    return (
        <div
            onClick={onChange}
            className={`cursor-pointer p-4 rounded-xl border flex items-start gap-4 transition-all ${checked ? 'bg-purple-500/10 border-purple-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}>
                {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
                <div className={`font-bold text-sm ${checked ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
        </div>
    );
}

function SummaryItem({ text }) {
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{text}</span>
        </div>
    );
}
