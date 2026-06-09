'use client';

import { useState } from 'react';
import {
    MessageCircle, CheckCircle, AlertCircle, Send,
    User, Clock, CheckSquare, Layers, CornerDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function DesignerFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([
        { 
            id: 1, 
            task: 'Banner Promocional - Cyber Monday', 
            client: 'Ecom Store', 
            sender: 'Community Manager', 
            date: 'Hace 2 horas', 
            text: 'El logo se pierde un poco con el fondo oscuro. ¿Podemos probar a darle un resplandor en blanco o usar la versión secundaria del kit de marca?',
            resolved: false,
            comments: [
                { sender: 'Daniel (Tú)', date: 'Hace 1 hora', text: 'Entendido. Haré el ajuste usando la variante de logo blanca en el editable y subiré la versión v2.' }
            ]
        },
        { 
            id: 2, 
            task: 'Retoque Fotográfico de Productos', 
            client: 'EcoStore', 
            sender: 'Coordinador de Calidad', 
            date: 'Ayer', 
            text: 'La iluminación de los bordes del producto parece un poco sobreexpuesta. Por favor disminuye los brillos en las fotos de los envases de vidrio.',
            resolved: false,
            comments: []
        },
        { 
            id: 3, 
            task: 'Diseño Carrusel - Blanqueamiento', 
            client: 'Clínica Dental', 
            sender: 'Community Manager', 
            date: '10 de Jun', 
            text: 'Excelente combinación de colores. La tipografía principal funciona muy bien.',
            resolved: true,
            comments: []
        }
    ]);

    const [replyText, setReplyText] = useState({});

    const handleResolve = (id) => {
        setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, resolved: !f.resolved } : f));
        toast.success('Estado de la corrección modificado.');
    };

    const handleSendReply = (id) => {
        if (!replyText[id]) return;
        setFeedbacks(feedbacks.map(f => {
            if (f.id === id) {
                return {
                    ...f,
                    comments: [
                        ...f.comments,
                        { sender: 'Daniel (Tú)', date: 'Ahora mismo', text: replyText[id] }
                    ]
                };
            }
            return f;
        }));
        setReplyText({ ...replyText, [id]: '' });
        toast.success('Respuesta enviada.');
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050511] p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                    <MessageCircle className="w-6 h-6 text-pink-500" /> Historial de Feedback
                </h1>
                <p className="text-sm text-gray-400 mt-1">Revisa y responde las correcciones enviadas por los estrategas o clientes.</p>
            </div>

            {/* List */}
            <div className="space-y-6 max-w-4xl pb-20">
                {feedbacks.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-[#0E0E18] border rounded-2xl p-6 transition-all space-y-6 ${
                            item.resolved ? 'border-white/5 opacity-60' : 'border-pink-500/20 shadow-lg shadow-pink-900/5'
                        }`}
                    >
                        {/* Upper info */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-tight">{item.task}</h3>
                                <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider mt-0.5">{item.client}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                    item.resolved 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                                }`}>
                                    {item.resolved ? 'Resuelto' : 'Pendiente Ajuste'}
                                </span>
                                <button
                                    onClick={() => handleResolve(item.id)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                        item.resolved
                                        ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                    }`}
                                >
                                    {item.resolved ? 'Abrir Corrección' : 'Marcar Resuelto'}
                                </button>
                            </div>
                        </div>

                        {/* Main comment */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-black shrink-0">
                                {item.sender.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-300">{item.sender}</span>
                                    <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {item.date}</span>
                                </div>
                                <p className="text-gray-300 text-xs leading-relaxed">{item.text}</p>
                            </div>
                        </div>

                        {/* Thread responses */}
                        {item.comments.length > 0 && (
                            <div className="pl-6 space-y-4 border-l border-white/5 ml-4">
                                {item.comments.map((comment, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center text-xs font-black shrink-0">
                                            D
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-gray-400">{comment.sender}</span>
                                                <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {comment.date}</span>
                                            </div>
                                            <p className="text-gray-300 text-xs leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Reply inputs */}
                        {!item.resolved && (
                            <div className="flex gap-3 pt-2">
                                <input
                                    type="text"
                                    placeholder="Escribe tu aclaración o respuesta..."
                                    value={replyText[item.id] || ''}
                                    onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })}
                                    className="flex-1 bg-[#13131F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 outline-none"
                                />
                                <button
                                    onClick={() => handleSendReply(item.id)}
                                    className="p-2.5 bg-pink-600 hover:bg-pink-500 rounded-xl text-white transition-all shadow-md shadow-pink-900/40"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
