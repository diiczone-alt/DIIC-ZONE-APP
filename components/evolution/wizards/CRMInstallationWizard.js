'use client';

import { useState } from 'react';
import {
    Users, ArrowRight, CheckCircle, BarChart3,
    Layers, Filter, Tag, Zap, Database, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CRMInstallationWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        focus: '', // 'services', 'products', 'realestate', 'consulting'
        pipeline: [],
        automation: [],
        dataPoints: []
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
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Database className="w-12 h-12 text-blue-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Instalando tu CRM</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Vamos a crear la estructura perfecta para organizar tus clientes y multiplicar tus cierres.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 mx-auto">
                <Users className="w-5 h-5" /> Configurar Pipeline
            </button>
        </div>
    );

    const FocusStep = () => (
        <div className="space-y-6">
            <StepHeader title="Enfoque del Negocio" subtitle="¿Qué vas a gestionar principalmente?" />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Users} label="Servicios" selected={formData.focus === 'services'} onClick={() => setSingle('focus', 'services')} />
                <SelectCard icon={Tag} label="Productos" selected={formData.focus === 'products'} onClick={() => setSingle('focus', 'products')} />
                <SelectCard icon={Layers} label="Inmobiliaria" selected={formData.focus === 'realestate'} onClick={() => setSingle('focus', 'realestate')} />
                <SelectCard icon={Briefcase} label="Consultoría" selected={formData.focus === 'consulting'} onClick={() => setSingle('focus', 'consulting')} />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.focus} color="blue" />
        </div>
    );

    const PipelineStep = () => (
        <div className="space-y-6">
            <StepHeader title="Etapas del Embudo" subtitle="Define los pasos de tu proceso de venta." />
            <div className="space-y-3">
                <ActionCheck label="Prospecto (Nuevo Lead)" desc="Etapa inicial automática." checked={true} />
                <ActionCheck label="Contactado" desc="Cuando ya hubo respuesta." checked={formData.pipeline.includes('contacted')} onChange={() => toggleSelection('pipeline', 'contacted')} />
                <ActionCheck label="Cita Agendada" desc="Para negocios de servicios." checked={formData.pipeline.includes('meeting')} onChange={() => toggleSelection('pipeline', 'meeting')} />
                <ActionCheck label="Cotización Enviada" desc="Se envió propuesta formal." checked={formData.pipeline.includes('proposal')} onChange={() => toggleSelection('pipeline', 'proposal')} />
                <ActionCheck label="En Negociación" desc="Ajustes finales/resolución." checked={formData.pipeline.includes('negotiation')} onChange={() => toggleSelection('pipeline', 'negotiation')} />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.pipeline.length === 0} color="blue" />
        </div>
    );

    const AutomationStep = () => (
        <div className="space-y-6">
            <StepHeader title="Automatizaciones CRM" subtitle="¿Qué debe pasar cuando muevas un cliente?" />
            <div className="space-y-3">
                <ActionCheck label="Auto-asignar a Vendedor" desc="Reparto equitativo de leads." checked={formData.automation.includes('assign')} onChange={() => toggleSelection('automation', 'assign')} />
                <ActionCheck label="Crear Tarea de Seguimiento" desc="Recordatorio a las 24h." checked={formData.automation.includes('task')} onChange={() => toggleSelection('automation', 'task')} />
                <ActionCheck label="Enviar Email de Bienvenida" desc="Al entrar a etapa 'Prospecto'." checked={formData.automation.includes('email')} onChange={() => toggleSelection('automation', 'email')} />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={false} color="blue" />
        </div>
    );

    const SummaryStep = () => (
        <div className="space-y-6">
            <StepHeader title="Resumen de CRM" subtitle="Tu máquina de ventas está lista:" />

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    <span className="font-bold text-white">Modelo: <span className="text-blue-400 capitalize">{formData.focus}</span></span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2">
                    <SummaryItem text={`Etapas: Prospecto, Cierre + ${formData.pipeline.length} intermedias`} color="blue" />
                    <SummaryItem text={`Automatizaciones: ${formData.automation.length} activas`} color="blue" />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">
                    Atrás
                </button>
                <button onClick={onComplete} className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" /> Instalar CRM
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
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
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
                            {step === 2 && <FocusStep />}
                            {step === 3 && <PipelineStep />}
                            {step === 4 && <AutomationStep />}
                            {step === 5 && <SummaryStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white">✕</button>
            </motion.div>
        </div>
    );
}

// Reuse components where possible or duplicate for independence if style varies drastically. 
// For this snippet, I'll inline the helper components again to ensure the file is self-contained copy-paste.

function StepHeader({ title, subtitle }) {
    return (
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
}

function NavButtons({ back, next, disabled, color = 'purple' }) {
    const bg = color === 'blue' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' : 'bg-purple-600';
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

function SelectCard({ icon: Icon, label, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${selected ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
        >
            <Icon className={`w-8 h-8 ${selected ? 'text-blue-400' : 'text-gray-500'}`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
}

function ActionCheck({ label, desc, checked, onChange }) {
    return (
        <div
            onClick={onChange}
            className={`cursor-pointer p-4 rounded-xl border flex items-start gap-4 transition-all ${checked ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
                <div className={`font-bold text-sm ${checked ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
        </div>
    );
}

function SummaryItem({ text, color = 'green' }) {
    const col = color === 'blue' ? 'text-blue-500' : 'text-green-500';
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className={`w-4 h-4 ${col}`} />
            <span>{text}</span>
        </div>
    );
}
