'use client';

import { useState } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Hash, Users } from 'lucide-react';

export default function CreativeChatPage() {
    const [messages] = useState([
        { id: 1, user: 'Fausto (Editor)', text: 'He subido la versión 3 del corte. ¿Pueden revisarla?', time: '10:30 AM', self: true },
        { id: 2, user: 'María (CM)', text: '¡Genial! Lo miro ahora mismo. Necesito exportar 3 clips verticales de esa versión.', time: '10:32 AM', self: false },
        { id: 3, user: 'Luis (Filmmaker)', text: 'Ojo con el color en el segundo 45, estaba un poco oscuro el raw.', time: '10:35 AM', self: false },
    ]);

    return (
        <div className="h-[calc(100vh-8rem)] flex rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A12]">
            {/* Sidebar List */}
            <div className="w-64 bg-black/20 border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-white font-bold text-sm uppercase tracking-wider">Canales</h2>
                </div>
                <div className="flex-1 p-2 space-y-1">
                    {['General', 'Proyecto Alpha', 'Entregas', 'Feedback Cliente'].map(channel => (
                        <button key={channel} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${channel === 'Proyecto Alpha' ? 'bg-indigo-500/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                            <Hash className="w-4 h-4 opacity-50" />
                            {channel}
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-white/5">
                    <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Directos</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> María (CM)
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" /> Luis (Filmmaker)
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#050510]/50">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Hash className="w-5 h-5 text-gray-400" />
                        <div>
                            <h3 className="text-white font-bold">Proyecto Alpha</h3>
                            <p className="text-xs text-gray-500">Coordinación general del proyecto</p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#0A0A12]">F</div>
                        <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#0A0A12]">M</div>
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#0A0A12]">L</div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-4 ${msg.self ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${msg.self ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                                {msg.user.charAt(0)}
                            </div>
                            <div className={`max-w-[70%] space-y-1 ${msg.self ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-bold text-white">{msg.user}</span>
                                    <span className="text-xs text-gray-500">{msg.time}</span>
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.self ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none border border-indigo-500/20' : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/10'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex gap-2 bg-black/20 border border-white/10 rounded-xl p-2 items-end">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <textarea
                            placeholder="Escribe un mensaje..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 text-white text-sm resize-none py-2 max-h-32 min-h-[40px]"
                            rows="1"
                        />
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
