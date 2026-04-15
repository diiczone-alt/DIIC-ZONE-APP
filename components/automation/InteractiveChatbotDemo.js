'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, Brain, Zap } from 'lucide-react';

export default function InteractiveChatbotDemo() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: 'Hola! Soy tu asistente de DIIC ZONE. Analizando tu marca en este momento... 🧠', thinking: false }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Simulate AI thinking process
        setTimeout(() => {
            setIsThinking(false);
            const responses = [
                "Basado en tus métricas actuales, sugiero aumentar el presupuesto en Reels un 15%. 📈",
                "He detectado una tendencia viral en tu nicho. ¿Quieres que prepare un borrador? 🎨",
                "Tu engagement ha subido un 5% esta semana. ¡Buen trabajo! 🚀",
                "Analizando los comentarios... el sentimiento es muy positivo hoy. 😊",
                "Puedo automatizar esa respuesta para futuros clientes. ¿Lo configuro? ⚙️"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: randomResponse
            }]);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-[500px] bg-black/40 rounded-3xl border border-white/10 overflow-hidden relative">

            {/* Header / Brain Visualization */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Neural Assistant v2.0</h3>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" /> Online & Learning
                        </p>
                    </div>
                </div>

                {/* Brain Activity Pulse */}
                <div className="flex items-center gap-1">
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 20, 10] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 bg-purple-500/50 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-tr-none'
                                    : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Thinking Indicator */}
                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-3">
                            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-0" />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                            </div>
                            <span className="text-xs text-gray-500 italic">Analizando datos...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/5">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe un mensaje..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-500 rounded-lg text-white hover:bg-purple-400 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                    <div className="absolute right-14 top-1/2 -translate-y-1/2">
                        <Sparkles className="w-4 h-4 text-purple-500/50" />
                    </div>
                </div>
            </div>

        </div>
    );
}
