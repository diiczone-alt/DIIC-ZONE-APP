'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
    {
        id: 'MESSAGE',
        question: '¿Qué debe entender la persona al final del video?',
        placeholder: 'Ej: Que mi servicio de coaching les ahorra tiempo...',
        type: 'text'
    },
    {
        id: 'GOAL',
        question: '¿Cuál es el objetivo principal?',
        options: ['Agendar Cita', 'Ventas Directas', 'Seguir Cuenta', 'Mensaje DM', 'Solo Branding'],
        type: 'select'
    },
    {
        id: 'TONE',
        question: '¿Qué tono emocional prefieres?',
        options: ['Profesional (Limpio)', 'Emocional (Inspirador)', 'Dinámico (Rápido)', 'Educativo (Claro)', 'Impactante (High Energy)'],
        type: 'select'
    },
    {
        id: 'CTA',
        question: '¿Cuál es el llamado a la acción (CTA) exacto?',
        placeholder: 'Ej: Dale clic al link de mi perfil...',
        type: 'text'
    },
    {
        id: 'BRAND',
        question: '¿Elementos de marca obligatorios?',
        options: ['Logo', 'Colores Corporativos', 'Tipografía Específica', 'Intro/Outro Estándar'],
        type: 'multi'
    },
    {
        id: 'STRUCTURE',
        question: '¿Prefieres alguna estructura específica?',
        options: ['Gancho-Problema-Solución', 'Lista (3 Tips)', 'Storytelling', 'Testimonial Clásico', 'Lo que la IA recomiende'],
        type: 'select'
    }
];

export default function GuideAssistantModal({ isOpen, onClose, onComplete }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAnswer = (val) => {
        const key = QUESTIONS[currentQ].id;

        // Handle Multi-select
        if (QUESTIONS[currentQ].type === 'multi') {
            const currentVals = answers[key] || [];
            const newVals = currentVals.includes(val)
                ? currentVals.filter(v => v !== val)
                : [...currentVals, val];
            setAnswers(prev => ({ ...prev, [key]: newVals }));
            return;
        }

        setAnswers(prev => ({ ...prev, [key]: val }));
    };

    const nextStep = () => {
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(prev => prev + 1);
        } else {
            generateGuide();
        }
    };

    const generateGuide = () => {
        setIsGenerating(true);
        setTimeout(() => {
            // Transform answers into the final Guide DIIC structure
            const guide = {
                message: answers.MESSAGE,
                cta: answers.CTA,
                style_notes: `Tono: ${answers.TONE}. Estructura: ${answers.STRUCTURE}.`,
                brand_assets: (answers.BRAND || []).join(', '),
                texts: {
                    main: "Frase Principal Generada...",
                    secondary: "Frase secundaria opcional..."
                }
            };
            onComplete(guide);
            setIsGenerating(false);
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    const q = QUESTIONS[currentQ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg bg-[#1A1A24] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-cyan-500 text-black">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Asistente de Producción</h3>
                                <p className="text-xs text-cyan-400">Paso {currentQ + 1} de {QUESTIONS.length}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[300px] flex flex-col">

                        {isGenerating ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <Sparkles className="w-12 h-12 text-cyan-400 animate-spin-slow" />
                                <h3 className="text-xl font-black text-white">Redactando tu Guía DIIC...</h3>
                                <p className="text-sm text-gray-400">Analizando respuestas y estructurando el brief perfecto.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6 leading-tight">
                                    {q.question}
                                </h2>

                                <div className="flex-1 space-y-3">
                                    {q.type === 'text' && (
                                        <textarea
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswer(e.target.value)}
                                            placeholder={q.placeholder}
                                            className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500/50 outline-none resize-none transition-all"
                                            autoFocus
                                        />
                                    )}

                                    {(q.type === 'select' || q.type === 'multi') && (
                                        <div className="grid grid-cols-1 gap-3">
                                            {q.options.map(opt => {
                                                const isSelected = q.type === 'multi'
                                                    ? (answers[q.id] || []).includes(opt)
                                                    : answers[q.id] === opt;

                                                return (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleAnswer(opt)}
                                                        className={`p-4 rounded-xl text-left font-medium transition-all flex items-center justify-between
                                                            ${isSelected
                                                                ? 'bg-cyan-500/20 border border-cyan-500 text-white'
                                                                : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10'}`
                                                        }
                                                    >
                                                        {opt}
                                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={nextStep}
                                        disabled={!answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0)}
                                        className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {currentQ === QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente'} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
