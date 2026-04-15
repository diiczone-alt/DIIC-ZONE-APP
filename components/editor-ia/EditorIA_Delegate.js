'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, UserCheck, Bot } from 'lucide-react';
import {
    StepType, StepObjective, StepStyle, StepFormat,
    StepUploads, StepGuide
} from './sub/EditorIA_DelegateSteps';
import GuideAssistantModal from './sub/GuideAssistantModal';
import { projectService } from '@/services/projectService';
import { toast } from 'sonner';

const STEPS = [
    { id: 'TYPE', title: 'Tipo de Video', component: StepType },
    { id: 'Objective', title: 'Objetivo Principal', component: StepObjective },
    { id: 'STYLE', title: 'Estilo Visual', component: StepStyle },
    { id: 'FORMAT', title: 'Duración y Formato', component: StepFormat },
    { id: 'UPLOADS', title: 'Carga de Material', component: StepUploads },
    { id: 'GUIDE', title: 'Guía de Edición', component: StepGuide },
];

export default function EditorIA_Delegate({ onBack, onFinish }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);

    const [formData, setFormData] = useState({
        type: null,
        objective: null,
        style: null,
        format: { duration: '30s', ratio: '9:16 (Vertical)' },
        files: [],
        guide: { message: '', style_notes: '' }
    });

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // FINISH & CREATE PROJECT
            try {
                const newProject = await projectService.create({
                    title: `Proyecto ${formData.type} - ${new Date().toLocaleDateString()}`,
                    type: formData.type,
                    client: 'Usuario Actual', // Replace with auth user
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
                    priority: 'HIGH',
                    details: formData
                });

                toast.success('¡Orden de Producción Creada!', {
                    description: `ID: ${newProject.id} - Enviado al equipo de editores.`
                });

                onFinish();
            } catch (error) {
                toast.error('Error al crear la orden');
                console.error(error);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            onBack();
        }
    };

    const updateData = (key, val) => {
        setFormData(prev => ({ ...prev, [key]: val }));
    };

    const handleAssistantComplete = (guideData) => {
        setFormData(prev => ({
            ...prev,
            guide: {
                ...prev.guide,
                message: guideData.message,
                style_notes: `${guideData.style_notes}\n\n[CTA]: ${guideData.cta}\n[BRAND]: ${guideData.brand_assets}`,
            }
        }));
    };

    const CurrentComponent = STEPS[currentStep].component;

    // Progress Calculation
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <div className="max-w-5xl mx-auto h-[90%] flex flex-col">

            {/* BUILDER HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
                        <UserCheck className="w-3 h-3" /> Delegar a Profesional
                    </div>
                    <h2 className="text-3xl font-black text-white">
                        {STEPS[currentStep].title}
                    </h2>
                </div>

                {/* Progress Bar */}
                <div className="w-48">
                    <div className="flex justify-between text-xs text-gray-500 mb-1 font-bold">
                        <span>Paso {currentStep + 1}/{STEPS.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 bg-[#0E0E18] border border-white/5 rounded-3xl p-8 overflow-y-auto custom-scrollbar relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <CurrentComponent
                            value={formData[STEPS[currentStep].id.toLowerCase()]}
                            onChange={(val) => updateData(STEPS[currentStep].id.toLowerCase(), val)}
                            onAssistant={() => setIsAssistantOpen(true)}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* FOOTER CONTROLS */}
            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 text-gray-400 font-bold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Atrás
                </button>

                <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/10"
                >
                    {currentStep === STEPS.length - 1 ? 'Enviar a Producción' : 'Continuar'} <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* AI ASSISTANT MODAL */}
            <GuideAssistantModal
                isOpen={isAssistantOpen}
                onClose={() => setIsAssistantOpen(false)}
                onComplete={handleAssistantComplete}
            />

        </div>
    );
}
