'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Calendar, MessageSquare, Bell, 
    Zap, Clock, MapPin, Search, 
    Send, CheckCheck, MoreHorizontal,
    Star, Target, Activity, Flame
} from 'lucide-react';
import { useState } from 'react';

const CHATS = [
    { id: 1, user: 'David Strategist', msg: '¿Cómo va el montaje del reel?', time: '12:30', online: true, avatar: 'D' },
    { id: 2, user: 'Elena Designer', msg: 'Ya subí los overlays.', time: '10:15', online: false, avatar: 'E' },
    { id: 3, user: 'HQ Admin', msg: 'Reunión en 10 min.', time: '09:00', online: true, avatar: 'H' },
];

const NOTIFICATIONS = [
    { id: 1, title: 'Nueva Revisión', desc: 'El cliente solicitó cambios en el color.', type: 'alert', time: '5m' },
    { id: 2, title: 'Pago Quincenal', desc: 'Tu pago ha sido procesado con éxito.', type: 'success', time: '2h' },
    { id: 3, title: 'Feedback Positivo', desc: '¡Gran trabajo en el último video!', type: 'star', time: '1d' },
];

export default function WorkstationGlobalModal({ isOpen, onClose, view = 'messages' }) {
    console.log('Global Modal Opening:', view);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 overflow-hidden pointer-events-auto">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            {/* Modal Window */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative w-full max-w-6xl h-full max-h-[85vh] bg-[#0E0E18] border-2 border-white/20 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-[10000]"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            {view === 'calendar' && <Calendar className="w-6 h-6 text-indigo-400" />}
                            {view === 'messages' && <MessageSquare className="w-6 h-6 text-indigo-400" />}
                            {view === 'notifications' && <Bell className="w-6 h-6 text-indigo-400" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                                {view === 'calendar' && 'Cronograma de Trabajo'}
                                {view === 'messages' && 'Bandeja de Mensajes'}
                                {view === 'notifications' && 'Centro de Alertas'}
                            </h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1.5">Zona Creativa — Nodo Operativo</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {view === 'messages' && <MessagesContent />}
                    {view === 'calendar' && <CalendarContent />}
                    {view === 'notifications' && <NotificationsContent />}
                </div>
            </motion.div>
        </div>
    );
}

function MessagesContent() {
    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-white/5 p-8 flex flex-col gap-6 bg-black/20">
                <div className="relative group">
                    <Search className="absolute left-4 top-3 w-4 h-4 text-gray-600" />
                    <input type="text" placeholder="BUSCAR..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-indigo-500/30" />
                </div>
                <div className="space-y-2 overflow-y-auto custom-scrollbar">
                    {CHATS.map(chat => (
                        <div key={chat.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 cursor-pointer transition-all group">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center font-black text-indigo-400 border border-indigo-500/20">{chat.avatar}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-black text-white uppercase italic truncate group-hover:text-indigo-400 transition-colors">{chat.user}</h4>
                                    <p className="text-[9px] text-gray-500 truncate">{chat.msg}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Chat */}
            <div className="flex-1 flex flex-col p-10 relative">
                <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar mb-8">
                    <div className="max-w-[70%] p-6 bg-white/5 border border-white/10 rounded-[2rem] rounded-tl-none">
                        <p className="text-sm text-gray-300 font-medium">¿Cómo va el proyecto de Nike? Necesitamos el primer corte hoy.</p>
                        <span className="text-[8px] text-gray-600 font-black uppercase mt-2 block">12:30 PM</span>
                    </div>
                    <div className="max-w-[70%] ml-auto p-6 bg-indigo-600 rounded-[2rem] rounded-tr-none shadow-xl shadow-indigo-600/20">
                        <p className="text-sm text-white font-medium">¡Hola! Ya estoy en la fase final de color. En 2 horas está en Drive.</p>
                        <span className="text-[8px] text-indigo-200 font-black uppercase mt-2 block">12:45 PM</span>
                    </div>
                </div>
                <div className="relative">
                    <input type="text" placeholder="Escribe un mensaje..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
                    <button className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl shadow-lg transition-all"><Send className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
}

function CalendarContent() {
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    return (
        <div className="flex-1 flex flex-col p-10 overflow-hidden bg-black/10">
            <div className="flex-1 border border-white/5 rounded-[2rem] bg-black/40 overflow-hidden flex flex-col">
                <div className="grid grid-cols-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="border-r border-white/5 h-16 flex items-center justify-center"><Clock className="w-4 h-4 text-gray-600" /></div>
                    {days.map(d => (
                        <div key={d} className="flex-1 h-16 border-r border-white/5 last:border-r-0 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest italic">{d}</div>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-6 h-full">
                        <div className="border-r border-white/5 bg-white/[0.01]">
                            {hours.map(h => <div key={h} className="h-24 border-b border-white/[0.02] flex items-center justify-center text-[10px] font-mono text-gray-600">{h}</div>)}
                        </div>
                        {days.map(d => (
                            <div key={d} className="flex-1 border-r border-white/5 last:border-r-0 relative">
                                {hours.map(h => <div key={h} className="h-24 border-b border-white/[0.01]" />)}
                                {d === 'Miércoles' && (
                                    <div className="absolute top-24 left-2 right-2 p-4 bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-500/20 border border-indigo-400 z-10">
                                        <h4 className="text-[10px] font-black text-white uppercase italic">Rodaje Nike</h4>
                                        <p className="text-[8px] text-indigo-100 mt-1">Estudio A</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationsContent() {
    return (
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-4">
            {NOTIFICATIONS.map(n => (
                <div key={n.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                            n.type === 'alert' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                            n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                            {n.type === 'alert' && <AlertCircle className="w-5 h-5" />}
                            {n.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                            {n.type === 'star' && <Star className="w-5 h-5" />}
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{n.title}</h4>
                            <p className="text-xs text-gray-500 font-medium">{n.desc}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{n.time} ago</span>
                </div>
            ))}
        </div>
    );
}

function AlertCircle(props) { return <Bell {...props} /> }
function CheckCircle2(props) { return <CheckCheck {...props} /> }
