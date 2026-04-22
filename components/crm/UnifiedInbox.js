'use client';

import { useState } from 'react';
import { 
    Search, Bot, User, MessageCircle, MoreVertical, Paperclip, 
    Send, CheckCircle2, AlertCircle, Phone, X, Shield, Wallet, MapPin, DollarSign, BrainCircuit, ShoppingCart,
    Mic, Volume2, Waveform
} from 'lucide-react';
import MedicalCatalog from './MedicalCatalog';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for the Inbox Demo
const mockConversations = [
    {
        id: 'c1',
        name: 'Dr. Roberto M.',
        avatar: 'https://i.pravatar.cc/150?u=roberto',
        niche: 'Médico',
        lastMessage: 'Sí, me interesa el paquete pro.',
        time: '10:42 AM',
        unread: 2,
        botActive: false,
        source: 'whatsapp',
        score: 85,
        status: 'Negociación',
        value: 1500,
        messages: [
            { id: 1, sender: 'bot', text: '¡Hola! Bienvenido a DIIC ZONE. Soy el asistente IA. ¿En qué puedo ayudarte hoy?', time: '10:30 AM' },
            { id: 2, sender: 'user', text: 'Me gustaría información sobre gestión de redes para mi clínica.', time: '10:32 AM' },
            { id: 3, sender: 'bot', text: '¡Claro! Manejamos paquetes especializados para el sector Salud. ¿Cuál es tu presupuesto mensual aproximado?', time: '10:32 AM' },
            { id: 4, sender: 'user', text: 'Alrededor de $1,000 a $2,000 USD.', time: '10:40 AM' },
            { id: 5, sender: 'human', text: 'Hola Dr. Roberto, soy Carlos. He pausado el asistente automático. Puedo ofrecerte nuestro Paquete Pro que se ajusta exacto a tu presupuesto.', time: '10:41 AM' },
            { id: 6, sender: 'user', text: 'Sí, me interesa el paquete pro.', time: '10:42 AM' },
        ]
    },
    {
        id: 'c2',
        name: 'Inmobiliaria City',
        avatar: 'https://i.pravatar.cc/150?u=inmo',
        niche: 'Real Estate',
        lastMessage: '¿Tienen soporte 24/7?',
        time: 'Ayer',
        unread: 0,
        botActive: true,
        source: 'instagram',
        score: 60,
        status: 'Contactado',
        value: 3200,
        messages: [
            { id: 1, sender: 'user', text: 'Hola, vi un anuncio suyo en Instagram', time: 'Ayer, 4:00 PM' },
            { id: 2, sender: 'bot', text: '¡Hola! Qué gusto saludarte. Soy el bot de respuesta rápida de DIIC ZONE. ¿Eres agencia o negocio local?', time: 'Ayer, 4:00 PM' },
            { id: 3, sender: 'user', text: 'Agencia.', time: 'Ayer, 4:05 PM' },
            { id: 4, sender: 'user', text: '¿Tienen soporte 24/7?', time: 'Ayer, 4:06 PM' },
        ]
    }
];

export default function UnifiedInbox() {
    const [selectedId, setSelectedId] = useState(mockConversations[0].id);
    const [filter, setFilter] = useState('Todos');
    const [showCatalog, setShowCatalog] = useState(false);

    const activeChat = mockConversations.find(c => c.id === selectedId);

    return (
        <div className="flex-1 flex h-full min-h-[600px] overflow-hidden bg-[#050511]">
            
            {/* COLUMN 1: CHAT LIST */}
            <div className="w-[320px] bg-[#0A0A12] border-r border-white/5 flex flex-col z-10">
                <div className="p-4 border-b border-white/5 bg-[#0E0E18]">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente, número o tag..." 
                            className="w-full bg-[#151520] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 custom-scrollbar">
                        {['Todos', 'No Leídos', 'IA Activa', 'Humanos'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${
                                    filter === f 
                                        ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' 
                                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {mockConversations.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setSelectedId(chat.id)}
                            className={`p-3 mb-1 rounded-2xl cursor-pointer transition-all border ${
                                selectedId === chat.id 
                                    ? 'bg-[#1A1A28] border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                                    : 'bg-transparent border-transparent hover:bg-white/5'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full border-2 border-[#151520]" />
                                        {chat.botActive && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-[#1A1A28]">
                                                <Bot className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                        {chat.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#1A1A28]">
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-bold truncate w-28">{chat.name}</h4>
                                        <span className="text-[10px] text-gray-500 block">{chat.source}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1">{chat.time}</span>
                            </div>
                            <p className={`text-xs truncate ml-12 ${chat.unread > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                                {chat.lastMessage}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMN 2: CONVERSATION AREA */}
            <div className="flex-1 flex flex-col relative bg-[#050511]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-white/5 bg-[#0A0A12]/80 backdrop-blur-md px-6 flex items-center justify-between z-10 sticky top-0">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        {activeChat.name}
                                        {activeChat.score > 80 && (
                                            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                                                <Shield className="w-3 h-3" /> Verificado
                                            </div>
                                        )}
                                        {activeChat.botActive 
                                            ? <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1"><Bot className="w-3 h-3" /> IA Respondiendo</span>
                                            : <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1"><User className="w-3 h-3" /> Humano</span>
                                        }
                                    </h3>
                                    <p className="text-[11px] text-gray-400 font-mono">ID: {activeChat.id} • {activeChat.source}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors tooltip relative group">
                                    <AlertCircle className="w-5 h-5" />
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
                                    Tomar Control
                                </button>
                            </div>
                        </div>

                        {/* Chat Bubbles */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 relative z-0">
                            {activeChat.messages.map(msg => {
                                const isBot = msg.sender === 'bot';
                                const isHuman = msg.sender === 'human';
                                const isUser = msg.sender === 'user'; // The client

                                return (
                                    <div key={msg.id} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[75%] rounded-2xl p-4 flex flex-col ${
                                            isUser ? 'bg-[#151520] border border-white/5 rounded-tl-sm' : 
                                            isBot ? 'bg-indigo-600/10 border border-indigo-500/20 rounded-tr-sm' : 
                                            'bg-emerald-600/10 border border-emerald-500/20 rounded-tr-sm'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-1.5 opacity-60">
                                                {isBot && <Bot className="w-3 h-3 text-indigo-400" />}
                                                {isHuman && <User className="w-3 h-3 text-emerald-400" />}
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isUser ? 'text-gray-400' : isBot ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                                    {isUser ? 'Cliente' : isBot ? 'Asistente IA' : 'Admin'}
                                                </span>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${isUser ? 'text-gray-200' : 'text-white'}`}>
                                                {msg.text}
                                            </p>
                                            <span className="text-[9px] text-gray-500 text-right mt-2 block">{msg.time}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-[#0A0A12] border-t border-white/5 z-10 w-full relative">
                            {activeChat.botActive && (
                                <div className="absolute -top-10 left-0 right-0 py-2 bg-indigo-500/10 text-center border-t border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-center gap-2">
                                    <Bot className="w-4 h-4 animate-pulse" /> La IA está administrando esta conversación. Escribir pausará el bot.
                                </div>
                            )}
                            <div className="flex bg-[#151520] border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                                <button className="p-4 text-gray-500 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /></button>
                                <button 
                                    onClick={() => setShowCatalog(!showCatalog)}
                                    className={`p-4 transition-colors ${showCatalog ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-500 hover:text-white'}`}
                                    title="Catálogo Médico"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                                <div className="flex-1 relative bg-transparent">
                                    <textarea 
                                        className="w-full bg-transparent text-white text-sm p-4 resize-none focus:outline-none custom-scrollbar"
                                        placeholder="Mensaje o comando para la IA..."
                                        rows="1"
                                    ></textarea>
                                    
                                    {/* AI VOICE PREVIEW OVERLAY (Tactical) */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group/voice">
                                        <div className="flex gap-1 items-end h-3">
                                            <div className="w-[2px] h-full bg-indigo-400 animate-[bounce_1s_infinite]" />
                                            <div className="w-[2px] h-[60%] bg-indigo-400 animate-[bounce_1.2s_infinite]" />
                                            <div className="w-[2px] h-[80%] bg-indigo-400 animate-[bounce_0.8s_infinite]" />
                                            <div className="w-[2px] h-[40%] bg-indigo-400 animate-[bounce_1.5s_infinite]" />
                                        </div>
                                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest group-hover/voice:text-white transition-colors">Voz IA Lista</span>
                                    </div>
                                </div>
                                <button className="p-4 text-emerald-400 hover:text-emerald-300 transition-colors relative group/mic">
                                    <Mic className="w-5 h-5 group-hover/mic:scale-110 transition-transform" />
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-black border border-white/10 rounded-xl text-[9px] font-black uppercase text-white whitespace-nowrap opacity-0 group-hover/mic:opacity-100 transition-opacity pointer-events-none">
                                        Enviar Nota de Voz IA (Voz de Dra. Rey)
                                    </div>
                                </button>
                                <button className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center min-w-[60px]">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 flex-col">
                        <MessageCircle className="w-16 h-16 mb-4 opacity-10" />
                        <p>Selecciona una conversación</p>
                    </div>
                )}
            </div>

            {/* COLUMN 3: CRM LEAD INTELLIGENCE DOCK / CATALOG */}
            {activeChat && (
                <div className="w-[340px] bg-[#0A0A12] border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar z-10">
                    <AnimatePresence mode="wait">
                        {showCatalog ? (
                            <motion.div 
                                key="catalog" 
                                initial={{ opacity: 0, x: 20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full"
                            >
                                <MedicalCatalog 
                                    onClose={() => setShowCatalog(false)} 
                                    onSelect={(service) => {
                                        // Simulator: Add message to chat (UI only)
                                        console.log("Selected service:", service);
                                        setShowCatalog(false);
                                    }} 
                                />
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="intelligence" 
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col"
                            >
                                <div className="h-16 border-b border-white/5 flex items-center px-6 sticky top-0 bg-[#0A0A12]/80 backdrop-blur-md z-10">
                                    <h3 className="font-bold text-white text-sm tracking-widest uppercase">Perfil del Lead</h3>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    {/* Header Stats */}
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-[#151520] to-[#202030] rounded-full mx-auto mb-3 border-2 border-white/10 flex items-center justify-center relative shadow-xl shadow-black">
                                            <span className="text-2xl font-bold text-white">{activeChat.name.charAt(0)}</span>
                                            <div className="absolute -bottom-2 -right-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                Score: {activeChat.score}
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold text-white">{activeChat.name}</h2>
                                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1"><BriefcaseIcon /> {activeChat.niche}</p>
                                    </div>

                        {/* CRM Pipeline Status */}
                        <div className="bg-[#151520] p-4 rounded-2xl border border-white/5">
                            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Estado en Pipeline</h4>
                            <select className="w-full bg-[#0A0A12] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 appearance-none">
                                <option>Nuevo Lead</option>
                                <option>Contactado</option>
                                <option selected={activeChat.status === 'Negociación'}>Negociación</option>
                                <option selected={activeChat.status === 'Propuesta Enviada'}>Propuesta Enviada</option>
                                <option>Cerrado / Ganado</option>
                            </select>
                        </div>

                        {/* Financial Value Indicator */}
                        <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mb-1 relative z-10">Valor del Lead</p>
                            <p className="text-3xl font-bold text-emerald-300 relative z-10">${activeChat.value.toLocaleString()}</p>
                        </div>

                        {/* AI Copilot Sidekick */}
                        <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
                            <BrainCircuit className="absolute -right-4 -top-4 w-20 h-20 text-indigo-500/10" />
                            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Bot className="w-4 h-4" /> Sugerencia IA
                            </h4>
                            <p className="text-sm text-indigo-200 leading-relaxed relative z-10">
                                {activeChat.score < 50 
                                    ? "Este lead parece ser un 'curioso'. No ha respondido sobre presupuesto. ¿Mover a archivo?"
                                    : "El cliente ha denotado interés técnico. Sugiero enviar el Catálogo Interactivo y agendar una llamada de 15 min."
                                }
                            </p>
                            <div className="flex gap-2 mt-4 relative z-10">
                                <button className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 flex items-center justify-center py-2 text-indigo-300 hover:text-white text-xs font-bold rounded-lg border border-indigo-500/30 transition-all">
                                    {activeChat.score < 50 ? "Archivar" : "Agendar Cita"}
                                </button>
                                {activeChat.score < 50 && (
                                    <button className="px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white rounded-lg border border-red-500/30 transition-all" title="Descartar como Curioso">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Basic Info Fields */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-white">+52 55 1234 5678</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-white">Ciudad de México</span>
                            </div>
                        </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

function BriefcaseIcon() {
    return <Wallet className="w-3.5 h-3.5 text-gray-400" />
}
