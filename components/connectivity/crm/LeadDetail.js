'use client';

import {
    User, Phone, MessageCircle, Calendar, CheckCircle,
    ArrowLeft, MapPin, DollarSign, CreditCard, Layers,
    Zap, Instagram, PlayCircle, FileText, Clock, ExternalLink, Plus
} from 'lucide-react';

export default function LeadDetail({ onBack, onGenerateQuote }) {
    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white border-2 border-white/10 shadow-lg">
                        AT
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            Ana Torres
                            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/20 uppercase tracking-wide">
                                En Conversación
                            </span>
                        </h2>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> Bogotá, CO
                            </span>
                            <span className="flex items-center gap-1 text-green-400 text-sm font-bold bg-green-500/10 px-2 rounded">
                                <Zap className="w-3 h-3" /> 🔥 78% Prob. Cierre
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300">
                        <Calendar className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                        <MessageCircle className="w-5 h-5" />
                        Abrir Chat
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all">
                        <CheckCircle className="w-5 h-5" />
                        Marcar Venta
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN - Context & Data */}
                <div className="space-y-6">
                    {/* BLOCK 1: Origin */}
                    <div className="bg-[#0A0A12] rounded-2xl border border-white/5 p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-pink-500" /> Origen del Lead
                        </h3>
                        <div className="space-y-4">
                            <MetricRow label="Fuente" value="Instagram Ads" icon={Instagram} color="text-pink-400" />
                            <div className="flex items-start justify-between p-3 rounded-lg bg-white/5">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Contenido que vio</div>
                                    <div className="text-white text-sm font-medium flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4 text-purple-400" /> Reel "Cirugía Láser"
                                    </div>
                                </div>
                            </div>
                            <MetricRow label="Campaña" value="Conversiones Enero" />
                            <MetricRow label="Primer contacto" value="10 Enero, 14:30" />
                            <MetricRow label="Costo por Lead" value="$2.30" highlight />
                        </div>
                    </div>

                    {/* BLOCK 3: AI Intelligence */}
                    <div className="bg-[#0F0F1A] rounded-2xl border border-blue-500/20 p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                            <Zap className="w-4 h-4 text-yellow-400" /> Inteligencia (AI)
                        </h3>
                        <div className="space-y-3 relative z-10">
                            <AiSignal label="Preguntó precio" detected />
                            <AiSignal label="Pidió disponibilidad" detected />
                            <AiSignal label="Envió datos" detected />
                            <AiSignal label="Interés claro" detected />
                        </div>
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg relative z-10">
                            <div className="flex gap-2">
                                <div className="mt-0.5">💡</div>
                                <p className="text-xs text-blue-200 leading-relaxed">
                                    Este lead está en <strong>fase de decisión</strong>. El sistema recomienda enviar la propuesta formalmente hoy mismo para aumentar probabilidad de cierre.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BLOCK 6: Business Impact */}
                    <div className="bg-[#0A0A12] rounded-2xl border border-white/5 p-5">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Impacto Proyectado</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                <div className="text-xs text-green-400 font-bold uppercase">Ingresos</div>
                                <div className="text-xl font-bold text-white mt-1">+$800</div>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                <div className="text-xs text-purple-400 font-bold uppercase">ROI Campaña</div>
                                <div className="text-xl font-bold text-white mt-1">+12%</div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 text-center">
                            Fuente de atribución: <strong>Instagram</strong>
                        </div>
                    </div>
                </div>

                {/* MIDDLE COLUMN - Conversation */}
                <div className="lg:col-span-1 h-full flex flex-col">
                    {/* BLOCK 2: Conversation History */}
                    <div className="bg-[#0A0A12] rounded-2xl border border-white/5 flex-1 flex flex-col h-[600px]">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-blue-400" /> Historial Unificado
                            </h3>
                            <button className="text-xs text-blue-400 hover:text-white">Ver todo</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="text-center text-xs text-gray-600 my-4">10 Enero</div>
                            <ChatBubble side="left" text="Hola, vi el video de cirugía láser. ¿Qué precio tiene?" source="Instagram" time="14:30" />
                            <ChatBubble side="right" text="¡Hola Ana! Claro que sí. El procedimiento empieza en $800..." source="Agent" time="14:35" />
                            <div className="text-center text-xs text-gray-600 my-4">12 Enero</div>
                            <ChatBubble side="left" text="Me interesa. ¿Tienen disponibilidad para el viernes?" source="WhatsApp" time="09:15" />
                            <ChatBubble side="right" text="Déjame revisar la agenda..." source="Agent" time="09:20" />
                            <div className="flex justify-center my-4">
                                <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400 border border-white/5">
                                    Ana descargó "Guía Pre-Quirúrgica.pdf"
                                </span>
                            </div>
                            <ChatBubble side="left" text="Genial, envíame los datos para transferir." source="WhatsApp" time="10:05" />
                        </div>
                        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Tiempo media respuesta: 5m</span>
                                <span>5 interacciones</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                className="w-full bg-[#050510] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Services & Actions */}
                <div className="space-y-6">
                    {/* BLOCK 4: Service Associated */}
                    <div className="bg-[#0A0A12] rounded-2xl border border-white/5 p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-500" /> Proyectos Activos
                        </h3>

                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-colors">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-white text-sm">Video Promocional</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20">Propuesta</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 hover:text-white transition-colors cursor-pointer">
                                    <ExternalLink className="w-3 h-3" /> Ver propuesta #PROP-2901
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors">
                                        Editar
                                    </button>
                                    <button className="py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-xs font-bold text-blue-400 transition-colors">
                                        Enviar
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 opacity-60">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-300 text-sm">Sesión Fotos</span>
                                    <span className="text-xs text-gray-500">Pendiente</span>
                                </div>
                            </div>

                            <button
                                onClick={onGenerateQuote}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Generar Oferta
                            </button>
                        </div>
                    </div>

                    {/* BLOCK 7: Automatic Actions */}
                    <div className="bg-[#0A0A12] rounded-2xl border border-white/5 p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" /> Flujo Automático
                        </h3>
                        <div className="space-y-4 pl-2">
                            <TimelineItem text="Se crea proyecto en Zona Creativa" active />
                            <TimelineItem text="Agendar reunión producción" />
                            <TimelineItem text="Agregar a clientes VIP" />
                            <TimelineItem text="Actualizar ROI en métricas" />
                        </div>
                    </div>

                    {/* BLOCK 5: If converted (Preview) */}
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 opacity-50 hover:opacity-100 transition-opacity">
                        <div className="text-xs text-green-500 font-bold uppercase mb-2">Simulación de Cierre</div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Total a cobrar:</span>
                            <span className="text-white font-bold">$800.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Método:</span>
                            <span className="text-white">Transferencia</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function MetricRow({ label, value, highlight, icon: Icon, color }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{label}</span>
            <div className="flex items-center gap-2">
                {Icon && <Icon className={`w-4 h-4 ${color}`} />}
                <span className={`text-sm font-medium ${highlight ? 'text-green-400 font-bold' : 'text-white'}`}>{value}</span>
            </div>
        </div>
    );
}

function AiSignal({ label, detected }) {
    return (
        <div className="flex items-center justify-between p-2 rounded bg-white/5">
            <span className="text-sm text-gray-300">{label}</span>
            {detected ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
                <div className="w-4 h-4 rounded-full border border-white/10"></div>
            )}
        </div>
    );
}

function ChatBubble({ text, source, time, side }) {
    return (
        <div className={`flex flex-col ${side === 'right' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${side === 'right'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white/10 text-gray-200 rounded-bl-sm'
                }`}>
                {text}
            </div>
            <div className="flex items-center gap-1 mt-1 px-1">
                {source === 'Instagram' && <Instagram className="w-3 h-3 text-pink-400" />}
                {source === 'WhatsApp' && <MessageCircle className="w-3 h-3 text-green-400" />}
                <span className="text-[10px] text-gray-500">{time}</span>
            </div>
        </div>
    );
}

function TimelineItem({ text, active }) {
    return (
        <div className="flex gap-3 relative">
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 ${active ? 'bg-green-500 border-green-500' : 'border-gray-600 bg-transparent'}`}></div>
                <div className="w-0.5 h-full bg-white/5 min-h-[20px]"></div>
            </div>
            <span className={`text-sm ${active ? 'text-white' : 'text-gray-500'} pb-4`}>{text}</span>
        </div>
    )
}
