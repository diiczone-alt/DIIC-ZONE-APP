'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Sparkles, MoreHorizontal, Bot, CheckCheck, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InboxChat({ conversation }) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Initialize messages when conversation changes
    useEffect(() => {
        if (conversation) {
            setMessages([
                { type: 'received', text: "Hola, quisiera saber si tienen espacio para una reunión hoy.", time: "10:28 AM" },
                { type: 'sent', text: "Hola Carlos! Claro, déjame revisar la agenda un momento.", time: "10:29 AM", status: "read" },
                { type: 'received', text: conversation.lastMessage || "Quedo atento.", time: "10:30 AM" }
            ]);
        }
    }, [conversation]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (text = inputValue) => {
        if (!text.trim()) return;

        const newMessage = {
            type: 'sent',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');

        // Simulate AI Reply
        setTimeout(() => {
            const reply = {
                type: 'received',
                text: "Gracias por la información. ¿Me confirmas entonces?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    if (!conversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                <p>Selecciona una conversación para empezar</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative">
            {/* Chat Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                        {conversation.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-white leading-tight">{conversation.name}</h3>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> En línea
                        </span>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* AI Assistant Banner */}
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200">AI Sugerencia:</span>
                    <span className="text-gray-400">El cliente pregunta por disponibilidad hoy a las 4pm.</span>
                </div>
                <div className="flex gap-2">
                    <button className="text-[10px] px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors">
                        Confirmar Cita
                    </button>
                    <button className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded hover:bg-white/10 transition-colors">
                        Ignorar
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Date Separator */}
                <div className="flex justify-center">
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-gray-500">Hoy</span>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <Bubble
                            key={i}
                            type={msg.type}
                            text={msg.text}
                            time={msg.time}
                            status={msg.status}
                        />
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (AI Chips) */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
                <AIChip text="Agendar Cita" icon={Sparkles} onClick={() => handleSend("Hola, me gustaría agendar una cita.")} />
                <AIChip text="Enviar Precios" onClick={() => handleSend("Claro, aquí tienes nuestra lista de precios actualizada.")} />
                <AIChip text="Pedir más detalles" onClick={() => handleSend("¿Podrías darme más detalles sobre lo que necesitas?")} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/5 focus-within:border-white/20 transition-colors"
                >
                    <button type="button" className="text-gray-400 hover:text-white transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder-gray-500 h-10"
                    />
                    <button type="button" className="text-gray-400 hover:text-white transition-colors">
                        <Mic className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

function Bubble({ type, text, time, status }) {
    const isSent = type === 'sent';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}
        >
            <div className={`
                max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${isSent
                    ? 'bg-blue-600/90 text-white rounded-tr-none shadow-lg shadow-blue-900/20'
                    : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                }
            `}>
                {text}
            </div>
            <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-gray-500">{time}</span>
                {isSent && <CheckCheck className={`w-3 h-3 ${status === 'read' ? 'text-blue-400' : 'text-gray-500'}`} />}
            </div>
        </motion.div>
    )
}

function AIChip({ text, icon: Icon, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300 hover:bg-purple-500/20 transition-all whitespace-nowrap active:scale-95"
        >
            {Icon && <Icon className="w-3 h-3" />}
            {text}
        </button>
    )
}
