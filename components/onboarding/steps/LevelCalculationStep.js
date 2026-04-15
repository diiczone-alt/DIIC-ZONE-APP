'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, CheckCircle2 } from 'lucide-react';

export default function LevelCalculationStep({ onNext, formData }) {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Analizando estructura de negocio...');

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onNext, 800);
                    return 100;
                }

                // Mensajes dinámicos según progreso
                if (prev === 20) setMessage('Evaluando capacidad operativa...');
                if (prev === 45) setMessage('Calculando potencial de escalamiento...');
                if (prev === 70) setMessage('Diseñando arquitectura de carpetas...');
                if (prev === 90) setMessage('Personalizando entorno DIIC ZONE...');

                return prev + 1;
            });
        }, 40); // 40ms * 100 = 4 seg total

        return () => clearInterval(timer);
    }, [onNext]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#1f2937" strokeWidth="8" fill="none" />
                    <motion.circle
                        cx="50" cy="50" r="45"
                        stroke="#6366f1" strokeWidth="8" fill="none"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progress) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className={`w-12 h-12 transition-colors ${progress === 100 ? 'text-emerald-500' : 'text-indigo-400 animate-pulse'}`} />
                </div>
            </div>

            <div className="space-y-3 max-w-sm">
                <h2 className="text-2xl font-black text-white">
                    {progress === 100 ? '¡Análisis Completado!' : 'Procesando Perfil'}
                </h2>
                <div className="h-6 overflow-hidden relative">
                    <motion.p
                        key={message}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-gray-400 text-sm absolute w-full left-0 top-0"
                    >
                        {message}
                    </motion.p>
                </div>
            </div>

            {/* Matrix rain effect simplified */}
            <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent animate-[drop_3s_infinite]" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-[drop_4s_infinite_1s]" />
            </div>
        </div>
    );
}
