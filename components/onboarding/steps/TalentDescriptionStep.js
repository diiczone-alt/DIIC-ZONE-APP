'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function TalentDescriptionStep({ onNext, updateData }) {
    const [description, setDescription] = useState('');

    const handleContinue = () => {
        if (description.length < 10) return;
        updateData({ description });
        onNext();
    };

    return (
        <div className="space-y-8 text-center max-w-2xl mx-auto w-full">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20"
            >
                <Sparkles className="w-10 h-10 text-blue-400" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Cuéntanos sobre tu talento</h2>
                <p className="text-gray-400 text-lg">¿En qué te destacas? Esto nos ayudará a situarte en el flujo y nodo ideal para ti.</p>
            </div>

            <div className="relative group">
                <textarea
                    autoFocus
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Soy editor especializado en storytelling para marcas de lujo, manejo After Effects y davinci..."
                    className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg focus:outline-none focus:border-blue-500 transition-all resize-none custom-scrollbar"
                />
                <div className="absolute bottom-4 right-6 text-xs text-gray-500 font-mono">
                    {description.length} caracteres (mín. 10)
                </div>
            </div>

            <button
                onClick={handleContinue}
                disabled={description.length < 10}
                className={`w-full py-5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 ${
                    description.length >= 10 
                    ? 'bg-white text-black hover:scale-[1.02] shadow-xl shadow-white/5' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
            >
                Continuar
                <ArrowRight className="w-6 h-6" />
            </button>
        </div>
    );
}
