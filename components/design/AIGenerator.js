'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, Download, Share2, Image as ImageIcon, Zap, GripHorizontal } from 'lucide-react';

const STYLES = [
    { id: 'photorealistic', name: 'Fotorealista', image: 'https://images.unsplash.com/photo-1633113087654-c49c74577f80?w=150&q=80' },
    { id: '3d-render', name: '3D Render', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80' },
    { id: 'minimalist', name: 'Minimalista', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=150&q=80' },
    { id: 'cyberpunk', name: 'Cyberpunk', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=150&q=80' },
    { id: 'abstract', name: 'Abstracto', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=150&q=80' },
];

export default function AIGenerator({ onBack }) {
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedImage('https://images.unsplash.com/photo-1620641784316-92f741366113?w=800&q=80'); // Mock result
        }, 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col"
        >
            {/* Header / Nav */}
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-pink-500" /> Generador IA
                </h2>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Controls */}
                <div className="w-1/3 border-r border-white/5 p-6 overflow-y-auto space-y-6 bg-[#0E0E15]">
                    {/* Prompt Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Descripción del Diseño</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-32 bg-[#050510] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none resize-none transition-all placeholder:text-gray-600"
                            placeholder="Ej: Un banner futurista para una tienda de zapatos deportivos, colores neón, estilo cyberpunk..."
                        />
                    </div>

                    {/* Style Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-300">Estilo Artístico</label>
                        <div className="grid grid-cols-2 gap-3">
                            {STYLES.map((style) => (
                                <div
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${selectedStyle === style.id ? 'border-pink-500' : 'border-transparent hover:border-white/20'}`}
                                >
                                    <img src={style.image} alt={style.name} className="w-full h-20 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white shadow-sm">{style.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!prompt || isGenerating}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!prompt || isGenerating ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg hover:shadow-pink-500/25 hover:scale-[1.02]'}`}
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creando Magia...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" /> Generar Diseño
                            </>
                        )}
                    </button>
                </div>

                {/* Right Panel - Preview */}
                <div className="flex-1 p-8 bg-[#050510] flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #EC4899 0%, transparent 40%)' }}></div>

                    {generatedImage ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative max-w-2xl w-full z-10"
                        >
                            <img src={generatedImage} alt="Generated" className="w-full rounded-2xl shadow-2xl border border-white/10" />

                            <div className="flex justify-center gap-4 mt-8">
                                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-2 transition-colors">
                                    <Download className="w-4 h-4" /> Descargar
                                </button>
                                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20">
                                    <Share2 className="w-4 h-4" /> Enviar a Revisión
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center z-10 opacity-50">
                            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto mb-6">
                                <ImageIcon className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300">Tu lienzo está vacío</h3>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                                Describe tu idea en el panel izquierdo y deja que la IA haga el resto.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
