'use client';

import { useState, useEffect } from 'react';
import { Bot, Save, MessageSquare, BookOpen, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import InteractiveChatbotDemo from './InteractiveChatbotDemo';

export default function ChatbotConfig() {
    const [config, setConfig] = useState({
        name: 'Asistente Virtual',
        tone: 'professional',
        temperature: 0.7,
        active: true
    });

    useEffect(() => {
        const saved = localStorage.getItem('diic_chatbot_config');
        if (saved) {
            setConfig(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('diic_chatbot_config', JSON.stringify(config));
        // Simple toast using native browser alert for now, or could use a custom toaster if available. 
        // Given constraints, I'll add a visual indicator button state or just alert for clarity.
        alert('✅ Configuración guardada correctamente');
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-full">

            {/* Left Column: Configuration */}
            <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Configuración del Chatbot</h3>
                            <p className="text-xs text-gray-400">Personaliza tu asistente de IA.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${config.active ? 'text-green-400' : 'text-gray-400'}`}>
                            {config.active ? 'Activo' : 'Inactivo'}
                        </span>
                        <button
                            onClick={() => setConfig(prev => ({ ...prev, active: !prev.active }))}
                            className={`w-10 h-5 rounded-full relative transition-colors ${config.active ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${config.active ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Nombre del Asistente</label>
                        <input
                            type="text"
                            value={config.name}
                            onChange={(e) => setConfig({ ...config, name: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    {/* Tone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Tono de Conversación</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['professional', 'friendly', 'enthusiastic'].map((tone) => (
                                <button
                                    key={tone}
                                    onClick={() => setConfig({ ...config, tone })}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all capitalized
                                        ${config.tone === tone
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                            : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'}`}
                                >
                                    {tone === 'professional' ? 'Profesional' : tone === 'friendly' ? 'Amigable' : 'Entusiasta'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Knowledge Base Placeholder */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center justify-between">
                            Base de Conocimiento
                            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">PDF, Docs, URLs</span>
                        </label>
                        <div className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group">
                            <BookOpen className="w-8 h-8 text-gray-500 mb-2 group-hover:text-purple-400 transition-colors" />
                            <p className="text-xs text-gray-400 text-center">Arrastra documentos aquí para entrenar a tu chatbot.</p>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-4 text-gray-300 font-bold text-sm">
                            <Settings2 className="w-4 h-4" /> Ajustes Avanzados
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Creatividad (Temperatura)</span>
                                    <span>{config.temperature}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={config.temperature}
                                    onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" /> Guardar Cambios
                </button>
            </div>

            {/* Right Column: Live Demo */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Vista Previa en Vivo</h3>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">Simulación Cliente</span>
                </div>
                <InteractiveChatbotDemo />
            </div>

        </div>
    );
}
