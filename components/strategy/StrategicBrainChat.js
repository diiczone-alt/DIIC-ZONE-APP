'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bot, Send, Sparkles, Folder, RefreshCw, Copy, Check, 
    Lightbulb, ShieldCheck, Target, Zap, MessageSquare, 
    HelpCircle, ChevronRight, Maximize2, Minimize2
} from 'lucide-react';
import { toast } from 'sonner';

export default function StrategicBrainChat({
    clientName = 'Marca DIIC',
    profile = {},
    researches = [],
    folders = []
}) {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'ai',
            text: `¡Hola! Soy tu **Cerebro Estratégico DIIC Brain** para **${clientName}**.\n\nTengo cargadas **${researches.length} investigaciones estratégicas** y el **Perfil Estratégico 360°** de la marca.\n\n¿En qué podemos trabajar hoy? Puedes pedirme análisis de dolores, ideas de guiones virales, copys para Meta Ads o respuestas a objeciones de clientes.`,
            createdAt: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const quickPills = [
        { label: '💡 Ganchos virales para Reels', query: `Genera 5 ganchos irresistibles (0 a 3 seg) para Reels sobre los dolores y deseos más frecuentes de los clientes de ${clientName}.` },
        { label: '🎯 Plan de Contenidos Mensual', query: `Diseña un calendario de contenidos semanal estructurado en 4 pilares basado en las investigaciones de ${clientName}.` },
        { label: '⚔️ Ventajas vs Competencia', query: `Compara la propuesta de valor de ${clientName} frente a la competencia y dime qué ángulos no están explotando.` },
        { label: '💬 Respuestas para WhatsApp', query: `Crea 3 respuestas persuasivas y empáticas para cerrar ventas o citas en WhatsApp para ${clientName}.` },
        { label: '🚀 Copys para Meta Ads', query: `Escribe 2 copys publicitarios de alta conversión para Meta Ads dirigidos al público objetivo de ${clientName}.` }
    ];

    const handleSendMessage = async (textToSend) => {
        const query = textToSend || input;
        if (!query.trim() || isLoading) return;

        const userMsg = {
            id: `msg_${Date.now()}`,
            sender: 'user',
            text: query.trim(),
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/strategy/brain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'chat',
                    message: query.trim(),
                    history: messages.slice(-8),
                    clientName,
                    profile,
                    researches,
                    selectedFolderId
                })
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Error al procesar la consulta');
            }

            const aiMsg = {
                id: `msg_ai_${Date.now()}`,
                sender: 'ai',
                text: data.reply,
                createdAt: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('[StrategicBrainChat] Error:', err);
            toast.error('Error del Cerebro Estratégico: ' + err.message);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg_err_${Date.now()}`,
                    sender: 'ai',
                    text: `⚠️ Hubo un error al procesar tu consulta: ${err.message}. Por favor intenta nuevamente.`,
                    createdAt: new Date().toISOString()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyMessage = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Copiado al portapapeles');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col h-[650px] bg-[#0e1026]/90 border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl">
            {/* Chat Header */}
            <div className="px-6 py-4 bg-[#080918]/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#080918] rounded-full" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            DIIC Strategic Brain
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                Gemini 2.5 Flash
                            </span>
                        </h4>
                        <p className="text-[11px] text-gray-400">
                            IA con memoria en tiempo real de tus investigaciones y perfil de marca
                        </p>
                    </div>
                </div>

                {/* Scope selector */}
                <div className="flex items-center gap-2 bg-[#080918] border border-white/10 rounded-2xl px-3 py-1.5 text-xs">
                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-gray-400 text-[11px]">Contexto:</span>
                    <select
                        value={selectedFolderId}
                        onChange={(e) => setSelectedFolderId(e.target.value)}
                        className="bg-transparent text-white font-medium text-xs outline-none cursor-pointer"
                    >
                        <option value="all" className="bg-[#0e1026] text-white">Todas las investigaciones ({researches.length})</option>
                        <option value="general" className="bg-[#0e1026] text-white">Carpeta General</option>
                        {folders.map(f => (
                            <option key={f.id} value={f.id} className="bg-[#0e1026] text-white">Carpeta: {f.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin">
                {messages.map((m) => {
                    const isAi = m.sender === 'ai';
                    return (
                        <div
                            key={m.id}
                            className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                        >
                            {isAi && (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shrink-0 flex items-center justify-center mt-1 shadow-md shadow-indigo-500/20">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <div
                                className={`relative group max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                                    isAi
                                        ? 'bg-[#080918]/80 text-gray-200 border border-white/10 shadow-lg'
                                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-indigo-600/20'
                                }`}
                            >
                                <div className="whitespace-pre-line">
                                    {m.text.split('**').map((part, i) =>
                                        i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
                                    )}
                                </div>

                                {isAi && (
                                    <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-white/5 text-[10px] text-gray-400">
                                        <span>DIIC AI Strategy</span>
                                        <button
                                            onClick={() => handleCopyMessage(m.id, m.text)}
                                            className="flex items-center gap-1 hover:text-white transition-colors"
                                        >
                                            {copiedId === m.id ? (
                                                <>
                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                    <span className="text-emerald-400 font-semibold">Copiado</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Copiar</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 shrink-0 flex items-center justify-center mt-1">
                            <Sparkles className="w-4 h-4 text-indigo-300 animate-spin" />
                        </div>
                        <div className="bg-[#080918]/80 border border-white/10 rounded-3xl p-4 text-xs text-indigo-300 flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Analizando investigaciones y generando estrategia...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="px-6 py-2 bg-[#080918]/60 border-t border-white/5 overflow-x-auto whitespace-nowrap flex items-center gap-2 scrollbar-none">
                {quickPills.map((pill, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSendMessage(pill.query)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 text-[11px] text-gray-300 hover:text-indigo-200 transition-all font-medium disabled:opacity-50 shrink-0"
                    >
                        {pill.label}
                    </button>
                ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-[#080918]/90 border-t border-white/10">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Pregúntale al Cerebro de ${clientName}...`}
                        disabled={isLoading}
                        className="flex-1 bg-[#0e1026] border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-2xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
