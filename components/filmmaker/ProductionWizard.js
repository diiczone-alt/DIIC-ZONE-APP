'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X, ArrowRight, Check } from 'lucide-react';
import {
    StepTypeSelection,
    StepPayment,
    StepCommonLogistics,
    StepCommonSummary,
    StepCorpBrief,
    StepContentGuide,
    StepResources,
    StepEquipment,
    StepDeliverables,
    StepPromoDetails,
    StepPromoStyle,
    StepSocialStrategy,
    StepEventDetails,
    StepEventScope,
    StepTestimonialDetails,
    StepEducationalDetails,
    StepProductDetails,
    StepYouTubeDetails,
    StepPersonalBrandDetails
} from './FilmmakerSteps';

export default function ProductionWizard({ onClose }) {
    const [step, setStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);

    // Consolidated Form Data
    const [formData, setFormData] = useState({
        type: '',
        // Common
        date: '', time: '', location: '', contactPerson: '',
        productionLevel: 'basic',
        deliverables: [],

        // Corp
        title: '', objective: '', message: '', contentGuide: '', resources: '',

        // Promo
        productName: '', cta: '', promoType: 'Producto', promoFormat: 'Vertical (Reels/TikTok)', promoStyle: '', promoReferences: '',

        // Social
        platforms: [], packSize: '',

        // Event
        eventType: '', eventName: '', duration: '', attendees: '',

        // Testimonial
        interviewCount: 1, intervieweeType: 'Clientes', questions: '',

        // Education
        eduFormat: 'Clase Magistral', moduleCount: 1,

        // Product
        productVideoType: 'Comercial Estético',

        // YouTube
        ytFormat: 'Vlog',

        // Personal
        // ... uses shared fields
    });

    const updateData = (newData) => setFormData(prev => ({ ...prev, ...newData }));

    const nextStep = () => {
        setCompletedSteps(prev => [...prev, step]);
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    // CONFIGURATION MAP
    // Defines the sequence of steps for each flow type
    const FLOW_CONFIG = {
        'Video Corporativo': {
            steps: ['Tipo', 'Brief', 'Logística', 'Guía', 'Recursos', 'Nivel', 'Entregables', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepCorpBrief,
                StepCommonLogistics,
                StepContentGuide,
                StepResources,
                StepEquipment,
                StepDeliverables,
                StepCommonSummary,
                StepPayment
            ],
            price: 1500
        },
        'Video Promocional': {
            steps: ['Tipo', 'Detalles', 'Estilo', 'Nivel', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepPromoDetails,
                StepPromoStyle,
                StepEquipment,
                StepCommonSummary,
                StepPayment
            ],
            price: 850
        },
        'Redes Sociales': {
            steps: ['Tipo', 'Estrategia', 'Estilo', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepSocialStrategy,
                StepPromoStyle, // Reusing style for social vibe
                StepCommonSummary,
                StepPayment
            ],
            price: formData.packSize === '20' ? 1200 : formData.packSize === '10' ? 700 : 400
        },
        'Cobertura de Evento': {
            steps: ['Tipo', 'Detalles', 'Alcance', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepEventDetails,
                StepEventScope,
                StepCommonSummary,
                StepPayment
            ],
            price: 1200
        },
        'Testimoniales': {
            steps: ['Tipo', 'Configuración', 'Logística', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepTestimonialDetails,
                StepCommonLogistics,
                StepCommonSummary,
                StepPayment
            ],
            price: 600
        },
        'Video Educativo': {
            steps: ['Tipo', 'Contenido', 'Logística', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepEducationalDetails,
                StepCommonLogistics,
                StepCommonSummary,
                StepPayment
            ],
            price: 900
        },
        'Video de Producto': {
            steps: ['Tipo', 'Producto', 'Logística', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepProductDetails,
                StepCommonLogistics,
                StepCommonSummary,
                StepPayment
            ],
            price: 750
        },
        'Video para YouTube': {
            steps: ['Tipo', 'Detalles', 'Logística', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepYouTubeDetails,
                StepCommonLogistics,
                StepCommonSummary,
                StepPayment
            ],
            price: 500
        },
        'Marca Personal': {
            steps: ['Tipo', 'Estrategia', 'Logística', 'Resumen', 'Pago'],
            components: [
                StepTypeSelection,
                StepPersonalBrandDetails,
                StepCommonLogistics,
                StepCommonSummary,
                StepPayment
            ],
            price: 1000
        }
    };

    // Determine current flow configuration
    const activeFlow = formData.type && FLOW_CONFIG[formData.type] ? FLOW_CONFIG[formData.type] : { steps: ['Selección'], components: [StepTypeSelection], price: 0 };
    const TOTAL_STEPS = activeFlow.steps.length;

    // Get current component to render
    const CurrentStepComponent = activeFlow.components[step - 1] || StepTypeSelection;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-5xl bg-[#0F0F1A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A12]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <Video className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {formData.type || 'Nueva Producción'}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Paso {step} de {TOTAL_STEPS}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-0 flex">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block w-72 bg-[#0A0A12] border-r border-white/5 p-6 space-y-1">
                        {activeFlow.steps.map((label, idx) => {
                            const stepNum = idx + 1;
                            const isActive = step === stepNum;
                            const isCompleted = completedSteps.includes(stepNum) || stepNum < step;
                            return (
                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-white/5 border border-white/5' : 'opacity-50'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isActive ? 'border-orange-500 text-orange-500' : isCompleted ? 'bg-green-500 border-green-500 text-black' : 'border-gray-600 text-gray-600'}`}>
                                        {isCompleted ? <Check className="w-3 h-3" /> : stepNum}
                                    </div>
                                    <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-gray-500'}`}>{label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8 md:p-12 relative overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step} // Key change triggers animation
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CurrentStepComponent
                                    data={formData}
                                    onChange={updateData}
                                    onSelect={(type) => { updateData({ type }); nextStep(); }}
                                    totalPrice={activeFlow.price}
                                    price={activeFlow.price}
                                    deposit={activeFlow.price / 2}
                                    onClose={onClose}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                {step > 1 && step < TOTAL_STEPS && (
                    <div className="p-6 border-t border-white/5 bg-[#0A0A12] flex justify-between items-center z-10">
                        <button onClick={prevStep} className="px-6 py-3 rounded-xl hover:bg-white/5 text-gray-400 font-bold transition-colors text-sm">
                            Atrás
                        </button>
                        <button onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                            Continuar <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
