'use client';

import { useState } from 'react';
import { Wand2, Type, Sparkles, Send, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditorIA_Generative({ onBack, onFinish }) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate generation
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setIsGenerating(false);
                onFinish(); // Go to results/editor
            }
        }, 100);
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Wand2 className="w-3 h-3" /> Generación Generativa V2
                </div>
                <h2 className="text-4xl font-black text-white mb-4">De Texto a Video</h2>
                <p className="text-gray-400 text-lg">Escribe tu idea, guion o concepto. La IA creará el video por ti.</p>
            </div>

            {/* Prompt Input */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 relative group focus-within:border-purple-500/50 transition-colors">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe el video que quieres crear... (Ej: Un video dinámico sobre las 5 tendencias de marketing en 2026, con estilo futurista y música electrónica)"
                    className="w-full h-40 bg-transparent text-white text-lg placeholder:text-gray-600 resize-none outline-none custom-scrollbar"
                />

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                            <Type className="w-3 h-3" /> Mejorar Prompt
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                            <Sparkles className="w-3 h-3" /> Estilo: Cinemático
                        </button>
                    </div>
                </div>
            </div>

            {/* ACTION */}
            <div className="mt-8 flex justify-center">
                {isGenerating ? (
                    <div className="w-full max-w-md space-y-3 text-center">
                        <div className="flex justify-between text-xs font-bold text-purple-400 uppercase tracking-widest">
                            <span>Generando Escenas...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 animate-pulse">Buscando stock footage • Generando voz neural • Sincronizando audio</p>
                    </div>
                ) : (
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="px-12 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all flex items-center gap-3 shadow-lg shadow-purple-500/30 text-lg uppercase tracking-wide"
                    >
                        <Wand2 className="w-5 h-5" /> Generar Video Mágico
                    </button>
                )}
            </div>
        </div>
    );
}
