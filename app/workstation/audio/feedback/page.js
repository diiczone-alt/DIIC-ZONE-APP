'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, MessageSquare, Clock, CheckCircle, AlertCircle,
    Play, Pause, Send, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const MOCK_TICKETS = [
    {
        id: 1,
        project: 'Podcast "Emprende" Ep. 45',
        client: 'DIIC Media',
        timestamp: '14:25',
        date: 'Hoy',
        subject: 'Volumen de música de fondo muy alto',
        comment: 'La música al inicio del segundo segmento tapa la voz del host. Sugiero bajar el nivel por lo menos 3dB.',
        status: 'pending',
        priority: 'high'
    },
    {
        id: 2,
        project: 'Jingle Comercial Navidad',
        client: 'EcoStore',
        timestamp: '00:18',
        date: 'Ayer',
        subject: 'Efecto de campanas flojo',
        comment: 'Las campanas navideñas se pierden al final. Sube la presencia de agudos o añade más reverberación.',
        status: 'pending',
        priority: 'medium'
    },
    {
        id: 3,
        project: 'Voz en Off - Video Corp',
        client: 'Tech Solutions',
        timestamp: '01:05',
        date: 'Hace 2 días',
        subject: 'Eliminar ruido de respiración',
        comment: 'En este corte se escucha una respiración muy marcada. Por favor, limpia la pista con una puerta de ruido o corte manual.',
        status: 'corrected',
        priority: 'medium'
    }
];

export default function AudioFeedbackPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState(MOCK_TICKETS);
    const [selectedTicketId, setSelectedTicketId] = useState(MOCK_TICKETS[0]?.id || null);
    const [replyText, setReplyText] = useState('');
    const [isPlayingComment, setIsPlayingComment] = useState(false);

    const activeTicket = tickets.find(t => t.id === selectedTicketId);

    const handleResolveToggle = (id) => {
        setTickets(tickets.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === 'corrected' ? 'pending' : 'corrected';
                if (nextStatus === 'corrected') {
                    toast.success('Ticket marcado como CORREGIDO');
                } else {
                    toast.info('Ticket reabierto');
                }
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    const handlePlayTimestamp = (timestamp) => {
        setIsPlayingComment(!isPlayingComment);
        if (!isPlayingComment) {
            toast.success(`Escuchando segmento en timestamp ${timestamp}`);
        } else {
            toast.info('Detenido');
        }
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        toast.success('Respuesta enviada al cliente');
        setReplyText('');
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-violet-400" /> Control de Revisiones
                        </h1>
                        <p className="text-xs text-gray-400">Revisión y comentarios de clientes con marcas de tiempo</p>
                    </div>
                </div>
            </header>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Tickets List */}
                <div className="w-96 border-r border-white/5 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Tickets Activos</h3>
                    {tickets.map(ticket => (
                        <div 
                            key={ticket.id}
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border text-left ${selectedTicketId === ticket.id ? 'bg-violet-600/10 border-violet-500/40' : 'bg-[#0e0e1a] border-white/5 hover:border-white/10'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-gray-500">{ticket.client}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${ticket.priority === 'high' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate">{ticket.subject}</h4>
                            <p className="text-xs text-gray-400 truncate mt-1">{ticket.project}</p>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {ticket.date}
                                </span>
                                <span className={`text-[10px] font-bold flex items-center gap-1 ${ticket.status === 'corrected' ? 'text-emerald-400' : 'text-amber-500'}`}>
                                    {ticket.status === 'corrected' ? 'Corregido' : 'Pendiente'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Pane */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/25">
                    {activeTicket ? (
                        <div className="max-w-2xl mx-auto space-y-6">
                            {/* Top Info */}
                            <div className="bg-[#0e0e1a] border border-white/5 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs text-violet-400 font-bold uppercase tracking-wider">{activeTicket.client}</span>
                                        <h2 className="text-xl font-bold text-white mt-1">{activeTicket.subject}</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">Proyecto: <span className="text-gray-300 font-medium">{activeTicket.project}</span></p>
                                    </div>
                                    <button 
                                        onClick={() => handleResolveToggle(activeTicket.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeTicket.status === 'corrected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500 hover:bg-amber-600 text-black border-transparent'}`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {activeTicket.status === 'corrected' ? 'Marcar Pendiente' : 'Marcar Corregido'}
                                    </button>
                                </div>

                                {/* Audition Stamp */}
                                <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-xl">
                                    <button 
                                        onClick={() => handlePlayTimestamp(activeTicket.timestamp)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlayingComment ? 'bg-red-500 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/15'}`}
                                    >
                                        {isPlayingComment ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                                    </button>
                                    <div>
                                        <p className="text-xs text-gray-400">Escuchar corte de audio</p>
                                        <p className="text-sm text-white font-mono font-bold">Timestamp: <span className="text-violet-400">{activeTicket.timestamp}</span></p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Revisión del Cliente</label>
                                    <p className="text-sm text-gray-300 bg-black/10 border border-white/5 p-4 rounded-xl leading-relaxed">
                                        "{activeTicket.comment}"
                                    </p>
                                </div>
                            </div>

                            {/* Reply Form */}
                            <div className="bg-[#0e0e1a] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-white font-bold text-sm mb-4">Responder al Cliente</h3>
                                <form onSubmit={handleSendReply} className="space-y-4">
                                    <textarea 
                                        rows="3"
                                        placeholder="Escribe tu respuesta o confirma que el cambio se ha completado..."
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        className="w-full bg-[#050511] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            type="submit"
                                            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-violet-600/10"
                                        >
                                            Enviar Respuesta <Send className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            Selecciona una revisión para ver su detalle
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
