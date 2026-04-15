'use client';

import { Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function SmartSuggestions() {
    const [suggestions, setSuggestions] = useState([
        { id: 1, text: 'Este tipo de video convierte más: Intenta hacer otro testimonial corto similar al #2.', type: 'content' },
        { id: 2, text: 'Tu campaña "Autoridad" tiene un costo por lead alto. Sugiero pausarla por 2 días.', type: 'ads' },
        { id: 3, text: 'Tienes 5 leads calientes en CRM sin respuesta hace 24h. ¡Escríbeles ahora!', type: 'sales' }
    ]);

    const removeSuggestion = (id) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className="col-span-1 lg:col-span-2 xl:col-span-3">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white">Recomendaciones del Centro de Inteligencia</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {suggestions.map((suggestion) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="bg-gradient-to-br from-[#1A1A2E] to-[#0E0E18] border border-amber-500/20 p-4 rounded-2xl relative group hover:border-amber-500/40 transition-colors shadow-lg shadow-black/20"
                        >
                            <button
                                onClick={() => removeSuggestion(suggestion.id)}
                                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            <div className="flex gap-3 mb-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${suggestion.type === 'content' ? 'bg-pink-500' :
                                        suggestion.type === 'ads' ? 'bg-blue-500' : 'bg-green-500'
                                    }`} />
                                <p className="text-sm text-gray-200 font-medium leading-relaxed">
                                    "{suggestion.text}"
                                </p>
                            </div>

                            <div className="flex justify-end mt-2">
                                <button className="text-xs text-amber-400 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Aplicar <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {suggestions.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-gray-500 italic border border-dashed border-white/5 rounded-2xl">
                        Todo optimizado. No hay nuevas recomendaciones por ahora.
                    </div>
                )}
            </div>
        </div>
    );
}
