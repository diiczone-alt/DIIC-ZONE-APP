'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Send, X, Bot, Users, 
    Palette, Smile, Paperclip, MoreHorizontal,
    ChevronDown, User, Check, CheckCheck, Sparkles,
    Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { messagingService } from '@/services/messagingService';
import { aiService } from '@/services/aiService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function UnifiedMessagingCenter({ 
    isOpen, 
    onClose, 
    clientContext = null,
    initialChatType = 'client_cm' 
}) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Initial load and subscription
    useEffect(() => {
        if (!isOpen || !user) return;

        const initChat = async () => {
            setIsLoading(true);
            try {
                let chat;
                if (initialChatType === 'client_cm') {
                    // Context for Client <-> CM
                    const clientId = user.role === 'CLIENT' ? user.client_id : clientContext?.id;
                    if (!clientId) throw new Error("No client ID provided for chat");
                    
                    chat = await messagingService.getOrCreateClientChat(clientId);
                }
                
                if (chat) {
                    setActiveChat(chat);
                    const historical = await messagingService.getMessages(chat.id);
                    setMessages(historical);

                    // Subscribe to real-time
                    const channel = messagingService.subscribeToMessages(chat.id, (newMsg) => {
                        setMessages(prev => {
                            // Avoid duplicates
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                    });

                    return () => {
                        supabase.removeChannel(channel);
                    };
                }
            } catch (err) {
                console.error("Messaging Error:", err);
                toast.error("Error de Conexión", { description: "No pudimos conectar con el canal de mensajería." });
            } finally {
                setIsLoading(false);
            }
        };

        const cleanup = initChat();
        return () => {
             if (cleanup && typeof cleanup.then === 'function') {
                 cleanup.then(unsub => unsub && unsub());
             }
        };
    }, [isOpen, user, clientContext, initialChatType]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || !activeChat || !user) return;
        
        const content = inputValue.trim();
        setInputValue('');

        try {
            await messagingService.sendMessage(activeChat.id, user.id, content);
            
            // If it's a chat with IA (optional future expansion), trigger response here
        } catch (err) {
            console.error("Send Error:", err);
            toast.error("Error al enviar", { description: "Verifica tu conexión." });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
                    {/* Background Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#050511]/40 backdrop-blur-[2px] pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Chat Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-[#0E0E18] border border-white/10 rounded-[2.5rem] w-full max-w-md h-[600px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden pointer-events-auto relative z-10"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -z-10 pointer-events-none" />

                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 relative">
                                    <MessageSquare className="w-6 h-6" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0E0E18]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                        Canal de Comunicación
                                        <Sparkles className="w-3 h-3 text-indigo-400" />
                                    </h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        {user?.role === 'CLIENT' ? 'Estratega DIIC Asignado' : 'Panel de Control de Marca'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
                        >
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Sincronizando Nodo...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700">
                                        <Bot className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed italic">
                                        ¡Inicia la conversación! Tu estratega asignado recibirá este mensaje en tiempo real.
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.sender_id === user?.id;
                                    return (
                                        <motion.div 
                                            key={msg.id || idx}
                                            initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex flex-col gap-1 max-w-[85%]">
                                                <div className={`p-4 rounded-[1.8rem] text-sm ${
                                                    isMe 
                                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                                                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                                <div className={`flex items-center gap-2 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest lowercase">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && <CheckCheck className="w-3 h-3 text-cyan-400 opacity-60" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <input 
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Escribe un mensaje..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-400 transition-colors">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                </div>
                                <button 
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                        <Users className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                    <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">DIIC Hub Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
