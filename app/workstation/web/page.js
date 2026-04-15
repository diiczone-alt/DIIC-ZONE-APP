'use client';

import { useState } from 'react';
import {
    Globe, ShoppingBag, Layout, Server,
    ArrowRight, CheckCircle, FileText, Smartphone,
    Zap, Users, DollarSign, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WebClientWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: null,
        objective: null,
        info: { name: '', url: '', desc: '' },
        scope: []
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511] relative">

            {/* Progress Bar */}
            <div className="h-2 bg-white/5 w-full fixed top-0 left-80 z-50">
                <div
                    className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 5) * 100}%` }}
                />
            </div>

            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-40">
                <div>
                    <h1 className="text-2xl font-bold text-white">Nuevo Proyecto Web</h1>
                    <p className="text-sm text-gray-400">Paso {step} de 5: {getStepTitle(step)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=client" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
                <div className="w-full max-w-5xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <StepType
                                key="step1"
                                selected={formData.type}
                                onSelect={(val) => setFormData({ ...formData, type: val })}
                            />
                        )}
                        {step === 2 && (
                            <StepObjective
                                key="step2"
                                selected={formData.objective}
                                onSelect={(val) => setFormData({ ...formData, objective: val })}
                            />
                        )}
                        {step === 3 && (
                            <StepInfo
                                key="step3"
                                data={formData.info}
                                onChange={(val) => setFormData({ ...formData, info: val })}
                            />
                        )}
                        {step === 4 && (
                            <StepScope
                                key="step4"
                                selected={formData.scope}
                                onChange={(val) => setFormData({ ...formData, scope: val })}
                            />
                        )}
                        {step === 5 && (
                            <StepConfirm
                                key="step5"
                                data={formData}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="h-20 border-t border-white/5 bg-[#050511] px-8 flex items-center justify-between shrink-0 z-40">
                <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-xl font-bold transition-colors ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Atrás
                </button>
                <button
                    onClick={handleNext}
                    disabled={!canProceed(step, formData)}
                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${!canProceed(step, formData)
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                        }`}
                >
                    {step === 5 ? 'Iniciar Proyecto' : 'Siguiente'}
                    {step !== 5 && <ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}

function getStepTitle(step) {
    switch (step) {
        case 1: return 'Tipo de Proyecto';
        case 2: return 'Objetivo Principal';
        case 3: return 'Información Base';
        case 4: return 'Alcance';
        case 5: return 'Confirmación';
        default: return '';
    }
}

function canProceed(step, data) {
    if (step === 1) return !!data.type;
    if (step === 2) return !!data.objective;
    if (step === 3) return data.info.name.length > 3;
    if (step === 4) return data.scope.length > 0;
    return true;
}

// --- Step Components ---

function StepType({ selected, onSelect }) {
    const types = [
        { id: 'landing', title: 'Landing Page', desc: 'Una sola página enfocada en conversión.', icon: Layout },
        { id: 'corporate', title: 'Sitio Corporativo', desc: 'Presencia digital para empresas completas.', icon: Globe },
        { id: 'ecommerce', title: 'Tienda Online', desc: 'Venta de productos con carrito y pagos.', icon: ShoppingBag },
        { id: 'system', title: 'Panel / Sistema', desc: 'Herramientas internas o software a medida.', icon: Server },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="text-3xl font-black text-white text-center">¿Qué vamos a construir?</h2>
            <div className="grid grid-cols-2 gap-6">
                {types.map(type => (
                    <button
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        className={`p-8 rounded-3xl border text-left transition-all relative overflow-hidden group ${selected === type.id
                                ? 'bg-cyan-600/10 border-cyan-500 ring-1 ring-cyan-500'
                                : 'bg-[#0E0E18] border-white/5 hover:border-white/20'
                            }`}
                    >
                        <type.icon className={`w-10 h-10 mb-4 ${selected === type.id ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`} />
                        <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                        <p className="text-sm text-gray-400">{type.desc}</p>
                        {selected === type.id && (
                            <div className="absolute top-4 right-4 text-cyan-500">
                                <CheckCircle className="w-6 h-6 fill-cyan-500/20" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepObjective({ selected, onSelect }) {
    const objectives = [
        { id: 'leads', title: 'Generar Contactos', icon: Users },
        { id: 'sales', title: 'Vender Productos', icon: DollarSign },
        { id: 'branding', title: 'Autoridad de Marca', icon: Zap },
        { id: 'automation', title: 'Automatizar Procesos', icon: Settings },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="text-3xl font-black text-white text-center">¿Cuál es la meta principal?</h2>
            <div className="grid grid-cols-2 gap-6">
                {objectives.map(obj => (
                    <button
                        key={obj.id}
                        onClick={() => onSelect(obj.id)}
                        className={`p-8 rounded-3xl border text-left transition-all flex items-center gap-6 group ${selected === obj.id
                                ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500'
                                : 'bg-[#0E0E18] border-white/5 hover:border-white/20'
                            }`}
                    >
                        <div className={`p-4 rounded-xl ${selected === obj.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                            <obj.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{obj.title}</h3>
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepInfo({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-white text-center">Cuéntanos sobre el proyecto</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Nombre del Proyecto / Negocio</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => onChange({ ...data, name: e.target.value })}
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Ej. Boutique Moda, Consultorio Dr. Pérez"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">URL Actual (Opcional)</label>
                    <input
                        type="text"
                        value={data.url}
                        onChange={(e) => onChange({ ...data, url: e.target.value })}
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="www.tunsitio.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Descripción Breve</label>
                    <textarea
                        value={data.desc}
                        onChange={(e) => onChange({ ...data, desc: e.target.value })}
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors h-32 resize-none"
                        placeholder="¿Qué hace el negocio? ¿Quién es el cliente ideal?"
                    />
                </div>
            </div>
        </motion.div>
    );
}

function StepScope({ selected, onChange }) {
    const scopeItems = [
        { id: 'design', label: 'Diseño Personalizado', icon: Palette },
        { id: 'mobile', label: 'Optimización Móvil', icon: Smartphone },
        { id: 'seo', label: 'SEO Básico', icon: Globe },
        { id: 'copy', label: 'Redacción de Textos', icon: FileText },
    ];

    const toggle = (id) => {
        if (selected.includes(id)) {
            onChange(selected.filter(item => item !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="text-3xl font-black text-white text-center">Define el alcance</h2>
            <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                {scopeItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${selected.includes(item.id)
                                ? 'bg-emerald-500/10 border-emerald-500 text-white'
                                : 'bg-[#0E0E18] border-white/5 text-gray-400 hover:border-white/20'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${selected.includes(item.id) ? 'bg-emerald-500 text-black' : 'bg-white/5'}`}>
                            {selected.includes(item.id) ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5" />}
                        </div>
                        <span className="font-bold">{item.label}</span>
                    </button>
                ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">
                * Todos los proyectos incluyen Hosting básico y Dominio por 1 año.
            </p>
        </motion.div>
    );
}

function StepConfirm({ data }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/30">
                <Globe className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-black text-white">¡Todo listo para empezar!</h2>
            <p className="text-gray-400">Revisa los detalles antes de enviar la solicitud a tu desarrollador.</p>

            <div className="bg-[#0E0E18] border border-white/10 rounded-2xl p-8 text-left space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-gray-400">Proyecto</span>
                    <span className="text-white font-bold">{data.info.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-gray-400">Tipo</span>
                    <span className="text-cyan-400 font-bold uppercase">{data.type}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-gray-400">Entrega Estimada</span>
                    <span className="text-white font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 2-3 Semanas
                    </span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Inversión Inicial</span>
                    <span className="text-2xl font-black text-emerald-400">$350.00 USD</span>
                </div>
            </div>
        </motion.div>
    );
}

import { Palette } from 'lucide-react';
