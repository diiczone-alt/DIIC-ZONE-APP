'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BusinessProfileStep({ onNext, updateData, userType }) {
    const [answers, setAnswers] = useState({});

    // Preguntas dinámicas según el tipo de usuario o nicho
    const getQuestions = () => {
        // Ejemplo simplificado. En producción usaríamos el userType o niche real.
        const common = [
            { id: 'goal', label: '¿Cuál es tu objetivo principal?', type: 'select', options: ['Más Ventas', 'Reconocimiento', 'Automatización', 'Retención'] },
            { id: 'ticket', label: 'Ticket Promedio (USD)', type: 'number', placeholder: 'Ej: 150' }
        ];

        // Lógica condicional (simulada por ahora, expandible con userType real)
        const specific = [
            { id: 'service_main', label: 'Producto/Servicio Estrella', type: 'text', placeholder: 'Ej: Ortodoncia Invisible / Curso de Inglés' },
            { id: 'pain_point', label: '¿Qué problema resuelves?', type: 'textarea', placeholder: 'Ayudo a...' }
        ];

        return [...common, ...specific];
    };

    const handleChange = (id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateData(answers);
        onNext();
    };

    return (
        <div className="space-y-6 text-center h-full flex flex-col">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Perfil Estratégico</h2>
                <p className="text-gray-400">Entrenaremos a la IA con estos datos.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-4 text-left overflow-y-auto pr-2 max-h-[400px]">
                {getQuestions().map((q, i) => (
                    <div key={q.id} className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">{q.label}</label>
                        {q.type === 'select' ? (
                            <select
                                required
                                className="w-full bg-[#0A0A12] border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 outline-none appearance-none"
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            >
                                <option value="">Selecciona una opción...</option>
                                {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : q.type === 'textarea' ? (
                            <textarea
                                required
                                rows={3}
                                placeholder={q.placeholder}
                                className="w-full bg-[#0A0A12] border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 outline-none resize-none"
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        ) : (
                            <input
                                type={q.type}
                                required
                                placeholder={q.placeholder}
                                className="w-full bg-[#0A0A12] border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 outline-none"
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </form>

            <button
                onClick={handleSubmit}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
            >
                Guardar Perfil
            </button>
        </div>
    );
}
