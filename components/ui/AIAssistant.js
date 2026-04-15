'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', text: 'Hola! Soy DIIC Bot 🤖. ¿En qué puedo ayudarte hoy? Consultas sobre proyectos, métricas o ideas de contenido...' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: input }]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: 'Entendido. Estoy procesando tu solicitud... Un asesor humano revisará esto en breve si es complejo.'
            }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-50 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-primary text-white hover:shadow-primary/50'
                    }`}
            >
                <Bot className="w-8 h-8" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 right-8 w-96 h-[500px] z-50"
                    >
                        <GlassCard className="h-full flex flex-col border border-primary/20 shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 bg-primary/10 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-primary rounded-lg">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Asistente DIIC</h3>
                                        <p className="text-xs text-green-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                            En línea
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                    ? 'bg-primary text-white rounded-tr-sm'
                                                    : 'bg-white/10 text-gray-200 rounded-tl-sm'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#050510]/50">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Escribe tu consulta..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
