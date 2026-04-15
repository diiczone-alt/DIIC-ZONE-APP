'use client';

import { Search, Filter, MessageCircle, Bot, User } from 'lucide-react';
import { useState } from 'react';

export default function ConversationList({ activeId, onSelect }) {
    const [filter, setFilter] = useState('all'); // all, unread, sales, support

    const conversations = [
        {
            id: 1, name: 'Carlos Díaz', phone: '+51 999 888 777',
            lastMsg: 'Me interesa el paquete básico', time: '5m',
            unread: 2, status: 'bot', urgency: 'high', type: 'sales'
        },
        {
            id: 2, name: 'Ana Lopez', phone: '+51 987 654 321',
            lastMsg: 'Gracias, revisaré la propuesta', time: '1h',
            unread: 0, status: 'human', urgency: 'medium', type: 'sales'
        },
        {
            id: 3, name: 'Pedro Ruiz', phone: '+51 912 345 678',
            lastMsg: 'Tengo un problema con el pago', time: '3h',
            unread: 1, status: 'human', urgency: 'low', type: 'support'
        },
        {
            id: 4, name: 'Maria Torres', phone: '+51 955 444 333',
            lastMsg: '¿Tienen cobertura en Lima?', time: '1d',
            unread: 0, status: 'bot', urgency: 'low', type: 'info'
        },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0E0E18] border-r border-white/5 w-[30%]">

            {/* Header & Search */}
            <div className="p-4 border-b border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-white font-bold">Chats</h2>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o tag..."
                        className="w-full bg-[#151520] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['Todos', 'No leídos', 'Ventas', 'Soporte'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase())}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${filter === f.toLowerCase()
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                                    : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversations.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelect(chat)}
                        className={`p-4 border-b border-white/5 cursor-pointer hover:bg-[#151520] transition-colors relative ${activeId === chat.id ? 'bg-[#151520] border-l-2 border-l-emerald-500' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                    {chat.name[0]}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${chat.unread > 0 ? 'text-white' : 'text-gray-300'}`}>
                                        {chat.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {chat.status === 'bot' ? (
                                            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-indigo-500/20">
                                                <Bot className="w-2.5 h-2.5" /> IA
                                            </span>
                                        ) : (
                                            <span className="text-[9px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/5">
                                                <User className="w-2.5 h-2.5" /> Humano
                                            </span>
                                        )}
                                        {chat.urgency === 'high' && (
                                            <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">🔥 Urgente</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500">{chat.time}</span>
                        </div>
                        <p className={`text-xs mt-2 line-clamp-1 ${chat.unread > 0 ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
                            {chat.lastMsg}
                        </p>

                        {chat.unread > 0 && (
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-[#050511] shadow-lg shadow-emerald-500/20">
                                {chat.unread}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
