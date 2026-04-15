'use client';

import { useState } from 'react';
import {
    FileText, CheckCircle2, ChevronRight, Wand2,
    Send, Download, Edit3, DollarSign, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateByNiche } from './ProposalTemplates';

// Mock Leads from CRM
const availableLeads = [
    { id: 1, name: 'Dr. Roberto Martínez', niche: 'Salud', company: 'Clínica Dental RM' },
    { id: 2, name: 'Inmobiliaria City', niche: 'Real Estate', company: 'City Real Estate' },
    { id: 3, name: 'Restaurante K', niche: 'Gastronomía', company: 'Restaurante K' },
];

export default function ProposalBuilder() {
    const [step, setStep] = useState(1); // 1: Lead, 2: AI Plan, 3: Edit, 4: Preview
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [customizations, setCustomizations] = useState([]);

    const handleLeadSelect = (lead) => {
        setSelectedLead(lead);
        setTimeout(() => setStep(2), 500);
    };

    const handlePlanSelect = (planKey, planData) => {
        setSelectedPlan({ key: planKey, ...planData });
        setStep(3);
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <StepLeadSelect onSelect={handleLeadSelect} />;
            case 2: return <StepAIPlan lead={selectedLead} onSelect={handlePlanSelect} />;
            case 3: return <StepEditor lead={selectedLead} plan={selectedPlan} onNext={() => setStep(4)} />;
            case 4: return <StepPreview lead={selectedLead} plan={selectedPlan} />;
            default: return <div>Error</div>;
        }
    };

    return (
        <div className="flex-1 h-full bg-[#050511] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-white/5 bg-[#0E0E18] flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm">Constructor de Propuestas</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className={step >= 1 ? 'text-indigo-400 font-bold' : ''}>1. Lead</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 2 ? 'text-indigo-400 font-bold' : ''}>2. Plan IA</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 3 ? 'text-indigo-400 font-bold' : ''}>3. Editar</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 4 ? 'text-indigo-400 font-bold' : ''}>4. Enviar</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-4xl mx-auto"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- Steps Components ---

function StepLeadSelect({ onSelect }) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center mb-8">¿A quién le enviaremos esta propuesta?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableLeads.map(lead => (
                    <div
                        key={lead.id}
                        onClick={() => onSelect(lead)}
                        className="bg-[#151520] border border-white/5 rounded-2xl p-6 hover:border-indigo-500 hover:bg-indigo-600/5 cursor-pointer transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                {lead.name.charAt(0)}
                            </div>
                            <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 uppercase tracking-widest border border-white/5">
                                {lead.niche}
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-white leading-tight mb-1">{lead.name}</h4>
                        <p className="text-sm text-gray-500">{lead.company}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function StepAIPlan({ lead, onSelect }) {
    const template = getTemplateByNiche(lead.niche);

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold mb-2">
                    <Bot className="w-3 h-3" /> IA Analysis
                </div>
                <h3 className="text-2xl font-bold text-white">Hemos detectado el nicho "{lead.niche}"</h3>
                <p className="text-gray-400">Recomendamos la estrategia: <span className="text-white font-bold">{template.name}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(template.plans).map(([key, plan]) => {
                    const isRecommended = key === 'pro';
                    return (
                        <div
                            key={key}
                            onClick={() => onSelect(key, plan)}
                            className={`relative bg-[#0E0E18] border rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-transform duration-300 ${isRecommended ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-white/5 hover:border-white/20'
                                }`}
                        >
                            {isRecommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    Recomendado IA
                                </div>
                            )}
                            <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                            <div className="text-3xl font-bold text-emerald-400 mb-6 flex items-baseline">
                                ${plan.price}<span className="text-sm text-gray-500 font-normal ml-1">/mes</span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.includes.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isRecommended ? 'text-indigo-400' : 'text-gray-600'}`} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${isRecommended ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}>
                                Seleccionar este Plan
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function StepEditor({ lead, plan, onNext }) {
    const [price, setPrice] = useState(plan.price);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-indigo-400" /> Editar Propuesta
                </h3>

                <div className="bg-[#151520] rounded-2xl p-6 border border-white/5 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre del Paquete</label>
                        <input type="text" defaultValue={plan.name} className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-4 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Precio Final ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-4 py-2 text-emerald-400 font-bold mt-1 focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Incluye</label>
                        <div className="space-y-2">
                            {plan.includes.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 bg-[#0E0E18] px-3 py-2 rounded-lg border border-white/5">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                                    <input type="text" defaultValue={item} className="bg-transparent border-none text-sm text-gray-300 w-full focus:outline-none" />
                                </div>
                            ))}
                            <button className="text-xs text-indigo-400 font-bold px-2 py-1 hover:bg-indigo-500/10 rounded">+ Añadir Item</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Vista Previa (Resumen)</h3>
                <div className="bg-white rounded-2xl p-8 text-black shadow-2xl relative overflow-hidden h-[400px]">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wand2 className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-bold text-2xl tracking-tighter">DIIC ZONE</h4>
                            <span className="text-xs font-mono text-gray-500">{new Date().toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold mb-2 text-indigo-900">{plan.name}</h1>
                        <p className="text-gray-500 text-sm mb-6">Preparado especialmente para <span className="font-bold text-black">{lead.name}</span></p>

                        <div className="border-t border-b border-gray-100 py-6 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-gray-400 uppercase">Inversión Mensual</span>
                                <span className="text-4xl font-bold text-black">${price}</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-black text-white font-bold rounded-xl text-sm">
                            Aceptar Propuesta
                        </button>
                    </div>
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                    Continuar a Enviar <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

function StepPreview({ lead, plan }) {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Propuesta Lista!</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">La propuesta para <span className="text-white font-bold">{lead.name}</span> ha sido generada correctamente. Elige cómo quieres enviarla.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <button className="bg-[#25D366] hover:bg-[#20bd5a] p-6 rounded-2xl flex flex-col items-center gap-3 transition-transform hover:scale-105 group">
                    <Send className="w-8 h-8 text-white" />
                    <span className="text-white font-bold text-lg">Enviar por WhatsApp</span>
                    <span className="text-xs text-white/80 bg-black/10 px-2 py-1 rounded">Recomendado</span>
                </button>

                <button className="bg-[#151520] border border-white/10 hover:border-white/30 p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors group">
                    <Download className="w-8 h-8 text-white" />
                    <span className="text-white font-bold text-lg">Descargar PDF</span>
                    <span className="text-xs text-gray-500">Para enviar por correo</span>
                </button>
            </div>

            <div className="mt-8 bg-[#0E0E18] p-4 rounded-xl border border-white/5 max-w-2xl w-full">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Mensaje Sugerido (WhatsApp)</p>
                <p className="text-sm text-gray-300 italic">
                    "Hola {lead.name} 👋. Te comparto la propuesta que armamos para {lead.company} según lo conversado. Incluye la estrategia de {plan.name}. Quedo atento a tus comentarios para ajustarla si es necesario."
                </p>
                <div className="flex justify-end mt-2">
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">Copiar Texto</button>
                </div>
            </div>
        </div>
    )
}
