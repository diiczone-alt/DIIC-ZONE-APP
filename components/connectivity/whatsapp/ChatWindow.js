'use client';

import {
    MoreVertical, Phone, Video, Bot, User, Paperclip, Mic, Send,
    Smile, Image as ImageIcon, FileText, X
} from 'lucide-react';
import { useState } from 'react';

export default function ChatWindow({ chat }) {
    const [message, setMessage] = useState('');
    const [iaActive, setIaActive] = useState(chat?.status === 'bot');

    if (!chat) return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#0B0B14]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-gray-600" />
            </div>
            <p>Selecciona una conversación para comenzar</p>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0B0B14] relative">

            {/* Chat Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E18]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                        {chat.name[0]}
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">{chat.name}</h3>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* IA Toggle Switch */}
                    <div
                        onClick={() => setIaActive(!iaActive)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors border ${iaActive ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-gray-800 border-white/5'}`}
                    >
                        {iaActive ? <Bot className="w-3.5 h-3.5 text-indigo-400" /> : <User className="w-3.5 h-3.5 text-gray-400" />}
                        <span className={`text-xs font-bold ${iaActive ? 'text-indigo-400' : 'text-gray-400'}`}>
                            {iaActive ? 'IA Activa' : 'Solo Humano'}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                    <button className="text-gray-400 hover:text-white"><Phone className="w-5 h-5" /></button>
                    <button className="text-gray-400 hover:text-white"><Video className="w-5 h-5" /></button>
                    <button className="text-gray-400 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* System Note */}
                <div className="flex justify-center">
                    <span className="text-[10px] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        Lead asignado a Ventas hoy, 10:30 AM
                    </span>
                </div>

                {/* Inbound Message */}
                <div className="flex justify-start">
                    <div className="max-w-[70%] space-y-1">
                        <div className="bg-[#1F1F2E] p-3 rounded-2xl rounded-tl-none border border-white/5 text-gray-200 text-sm">
                            Hola, vi un anuncio en Instagram sobre paquetes para médicos. Me gustaría saber precios.
                        </div>
                        <span className="text-[10px] text-gray-500 ml-2">10:32 AM</span>
                    </div>
                </div>

                {/* IA Response */}
                <div className="flex justify-end">
                    <div className="max-w-[70%] space-y-1">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <span className="text-[9px] text-indigo-400 flex items-center gap-1"><Bot className="w-2.5 h-2.5" /> IA Respondió</span>
                        </div>
                        <div className="bg-indigo-600/10 p-3 rounded-2xl rounded-tr-none border border-indigo-500/20 text-indigo-100 text-sm shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                            ¡Hola! Claro que sí 👋 Soy el asistente de DIIC ZONE. Tenemos planes especiales para el sector salud. ¿Te gustaría agendar una llamada rápida para explicarte mejor o prefieres ver el brochure por aquí?
                        </div>
                        <span className="text-[10px] text-gray-500 text-right block mr-2">10:32 AM • Leído</span>
                    </div>
                </div>

                {/* Human Intervention Placeholder */}
                <div className="flex justify-center">
                    <span className="text-[10px] text-gray-500 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
                        <User className="w-3 h-3" /> Juan Pérez tomó el control del chat
                    </span>
                </div>

            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0E0E18] border-t border-white/5">
                {/* Suggested Actions (IA) */}
                <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] text-gray-500 py-1">Sugerencias IA:</span>
                    {['Enviar Brochure', 'Agendar Cita', 'Pedir Presupuesto'].map(action => (
                        <button key={action} className="px-3 py-1 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 text-xs rounded-lg border border-indigo-500/20 transition-colors whitespace-nowrap">
                            ✨ {action}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 items-end bg-[#151520] p-2 rounded-2xl border border-white/5 relative">
                    <div className="flex gap-2 pb-2 pl-2">
                        <button className="text-gray-400 hover:text-white transition-colors"><Smile className="w-5 h-5" /></button>
                        <button className="text-gray-400 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /></button>
                    </div>
                    <textarea
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white max-h-32 resize-none py-2 placeholder:text-gray-600"
                        placeholder="Escribe un mensaje..."
                        rows={1}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="pb-1 pr-1">
                        {message.trim() ? (
                            <button className="p-2 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-[#050511] transition-all shadow-lg active:scale-95">
                                <Send className="w-5 h-5 fill-current" />
                            </button>
                        ) : (
                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                                <Mic className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">Enter para enviar • Shift + Enter para nueva línea</p>
                </div>
            </div>
        </div>
    )
}
