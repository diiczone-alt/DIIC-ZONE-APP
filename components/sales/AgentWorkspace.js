'use client';

import { useState } from 'react';
import {
    MessageCircle, Phone, Video, Calendar,
    CheckCircle2, XCircle, Send, Mic, Paperclip,
    Bot, MoreVertical, Clock, DollarSign
} from 'lucide-react';

const mockLeads = [
    { id: 1, name: 'Dr. Roberto Martínez', niche: 'Salud', status: 'Caliente', timer: '05:30', lastMsg: 'Sigo interesado, ¿me puedes dar precio?' },
    { id: 2, name: 'Ana García', niche: 'Real Estate', status: 'Tibio', timer: '12:00', lastMsg: 'Voy a revisarlo con mi socio.' },
    { id: 3, name: 'Carlos López', niche: 'Gastro', status: 'Nuevo', timer: '00:45', lastMsg: 'Hola, vi su anuncio.' }
];

export default function AgentWorkspace() {
    const [activeLead, setActiveLead] = useState(mockLeads[0]);

    return (
        <div className="flex h-full bg-[#050511]">

            {/* Left: Queue (My Leads) */}
            <div className="w-80 border-r border-white/5 bg-[#0E0E18] flex flex-col">
                <div className="p-4 border-b border-white/5">
                    <h3 className="text-white font-bold mb-1">Mi Cola de Trabajo</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>3 Leads activos</span>
                        <span className="text-emerald-400">Go! 🚀</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {mockLeads.map(lead => (
                        <div
                            key={lead.id}
                            onClick={() => setActiveLead(lead)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${activeLead.id === lead.id
                                    ? 'bg-blue-600/10 border-blue-500/30 shadow-lg'
                                    : 'bg-[#151520] border-white/5 hover:border-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold text-sm ${activeLead.id === lead.id ? 'text-blue-300' : 'text-white'}`}>{lead.name}</h4>
                                <span className="text-[10px] font-mono text-gray-500 bg-black/20 px-1.5 py-0.5 rounded">{lead.timer}</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{lead.lastMsg}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 border border-white/5">{lead.niche}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center: Focus Mode (Chat + Action) */}
            <div className="flex-1 flex flex-col bg-[#050511]">

                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E18]/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {activeLead.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-white font-bold leading-tight">{activeLead.name}</h2>
                            <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> En línea ahora</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ActionButton icon={Phone} label="Llamar" />
                        <ActionButton icon={Video} label="Video" />
                        <div className="h-6 w-px bg-white/10 mx-1"></div>
                        <ActionButton icon={CheckCircle2} label="Cerrar Venta" color="bg-emerald-600 text-white hover:bg-emerald-500" />
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div className="flex justify-center"><span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full">IA inició la conversación - 10:30 AM</span></div>

                    <ChatMessage side="left" text="Hola Dr. Roberto, vi que descargó nuestra guía de Marketing Dental." />
                    <ChatMessage side="right" text="Sí, gracias. La verdad necesito más pacientes." isUser={true} />
                    <ChatMessage side="left" text="Entiendo perfectamente. ¿Qué capacidad ociosa tiene actualmente en sus sillones?" />
                    <ChatMessage side="right" text="Como un 40% libre." isUser={true} />

                    {/* AI Suggestion */}
                    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-3 mx-8 animate-pulse">
                        <div className="flex items-center gap-2 mb-1">
                            <Bot className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-300">Sugerencia IA</span>
                        </div>
                        <p className="text-sm text-gray-200">"Con ese 40% podríamos generar unos $5,000 extra al mes con campañas de blanqueamiento. ¿Le hace sentido?"</p>
                        <button className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors font-bold">
                            Usar esta respuesta
                        </button>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-[#0E0E18]">
                    <div className="flex gap-2">
                        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"><Paperclip className="w-5 h-5" /></button>
                        <input type="text" placeholder="Escribe un mensaje..." className="flex-1 bg-[#151520] border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-blue-500" />
                        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"><Mic className="w-5 h-5" /></button>
                        <button className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20"><Send className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>

            {/* Right: Quick Tools */}
            <div className="w-72 bg-[#0E0E18] border-l border-white/5 p-4 flex flex-col gap-6">

                {/* Script / Playbook */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Guión Recomendado</h3>
                    <div className="bg-[#151520] border border-white/5 rounded-xl p-3 text-sm text-gray-300">
                        <p className="mb-2 font-bold text-white">Fase: Indagación</p>
                        <ul className="list-disc pl-4 space-y-1 text-xs">
                            <li>Preguntar por ticket promedio.</li>
                            <li>Identificar dolor principal (falta de tiempo o dinero).</li>
                            <li>Mencionar caso de éxito similar.</li>
                        </ul>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Acciones Rápidas</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <ToolButton icon={Calendar} label="Agendar Cita" />
                        <ToolButton icon={DollarSign} label="Crear Cotización" />
                        <ToolButton icon={Bot} label="Devolver a IA" />
                        <ToolButton icon={XCircle} label="Descartar" color="text-red-400 border-red-500/20 hover:bg-red-500/10" />
                    </div>
                </div>

                {/* Lead Info */}
                <div className="mt-auto bg-[#151520] rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-500 uppercase mb-2">Valor Potencial</p>
                    <p className="text-2xl font-bold text-white">$1,500 <span className="text-sm font-normal text-gray-500">/ mes</span></p>
                </div>

            </div>

        </div>
    )
}

function ActionButton({ icon: Icon, label, color = 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white' }) {
    return (
        <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${color}`}>
            <Icon className="w-4 h-4" /> {label}
        </button>
    )
}

function ToolButton({ icon: Icon, label, color = 'text-gray-300 border-white/10 hover:bg-white/5 hover:text-white' }) {
    return (
        <button className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all text-xs font-medium text-center ${color}`}>
            <Icon className="w-5 h-5" /> {label}
        </button>
    )
}

function ChatMessage({ text, side, isUser }) {
    return (
        <div className={`flex ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${side === 'right'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[#151520] border border-white/5 text-gray-200 rounded-tl-none'
                }`}>
                <p>{text}</p>
            </div>
        </div>
    )
}
