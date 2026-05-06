'use client';

import { motion } from 'framer-motion';
import { 
    MessageCircle, Send, Search, 
    MoreHorizontal, CheckCheck, X,
    ChevronRight, Circle
} from 'lucide-react';

const CHATS = [
    {
        id: 1,
        user: 'David Strategist',
        role: 'Squad Lead',
        lastMessage: '¿Cómo va el montaje del reel de Nike?',
        time: '14:20',
        unread: 2,
        online: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
    },
    {
        id: 2,
        user: 'Elena Designer',
        role: 'Diseño Pro',
        lastMessage: 'Ya subí los overlays a Drive.',
        time: 'Ayer',
        unread: 0,
        online: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena'
    },
    {
        id: 3,
        user: 'Community Master',
        role: 'HQ Support',
        lastMessage: 'Reunión semanal en 15 minutos.',
        time: '09:00',
        unread: 1,
        online: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hq'
    }
];

export default function MessagesPanel({ onClose }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-0 right-0 h-screen w-[450px] bg-[#0E0E18] border-l border-white/10 shadow-[-50px_0_100px_rgba(0,0,0,0.5)] z-[200] flex flex-col"
        >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Mensajes Internos</h2>
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">Canal de comunicación directa</p>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Search */}
            <div className="p-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Buscar conversación..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2">
                {CHATS.map((chat) => (
                    <div key={chat.id} className="p-4 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                            <div className="relative shrink-0">
                                <img src={chat.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover bg-indigo-500/10" />
                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0E0E18] ${chat.online ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter truncate">{chat.user}</h4>
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[11px] text-gray-500 truncate font-medium max-w-[200px]">
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unread > 0 && (
                                        <span className="bg-indigo-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-4 h-4 text-indigo-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Presence Bar */}
            <div className="px-8 py-6 border-t border-white/5 bg-white/[0.01]">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Equipo en Línea</p>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="shrink-0 relative">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-white/5 p-0.5">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} 
                                    className="w-full h-full rounded-[10px] object-cover"
                                    alt="User"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0E0E18]" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State / Quick Actions */}
            <div className="p-8 border-t border-white/5 bg-black/20">
                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all">
                    <MessageCircle className="w-4 h-4" /> Iniciar Nueva Conversación
                </button>
            </div>
        </motion.div>
    );
}
