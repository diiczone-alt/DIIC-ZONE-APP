'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X, MessageCircle, Bot, Phone, Send, Calendar,
    CheckCircle2, Clock, Zap, Users, Sparkles, ShieldCheck,
    Smartphone, Search, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function WhatsAppMedicalModal({
    isOpen,
    onClose,
    clientName = 'Dr. Oscar Cujilema',
    phoneNumber = '+593 98 765 4321'
}) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'flow' | 'broadcast' | 'settings'
    const [broadcastMessage, setBroadcastMessage] = useState('Estimado/a paciente, le recordamos su chequeo de control traumatológico en la clínica del Dr. Oscar Cujilema.');

    if (!isOpen) return null;

    const stats = {
        monthlyConversations: 342,
        appointmentsBooked: 94,
        avgResponseTime: '< 30 seg',
        automationEfficiency: '88.4%'
    };

    const triggers = [
        { trigger: 'Hola, quiero una cita', botAction: 'Solicita nombre, síntoma principal (hombro/rodilla) y ofrece horarios disponibles.', converted: '86% Citas' },
        { trigger: '¿Cuál es el costo de la consulta?', botAction: 'Informa el valor de la valoración especializada y opción de ecografía articular.', converted: '74% Citas' },
        { trigger: 'Ubicación / Dirección de la clínica', botAction: 'Envía enlace directo a Google Maps y horarios de atención en Riobamba.', converted: '92% Citas' }
    ];

    const handleSendBroadcast = () => {
        toast.success('Campaña de recordatorio enviada a 48 pacientes');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className="bg-[#090A16] border border-white/10 rounded-[2.5rem] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
                {/* Background Glow */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#25D366] blur-[120px] rounded-full opacity-15 pointer-events-none" />

                {/* HEADER */}
                <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 bg-[#090A16]/90">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#25D366] to-[#128C7E] p-[1px] shadow-lg shadow-black/50">
                            <div className="w-full h-full bg-[#08081a] rounded-2xl flex items-center justify-center">
                                <MessageCircle className="w-7 h-7 text-[#25D366]" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black italic tracking-tight text-white uppercase">WhatsApp Medical API</h2>
                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Conectado & Operativo
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mt-0.5">
                                <span className="text-emerald-400 font-mono">{phoneNumber}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-300">{clientName}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 rounded-2xl border border-white/10 text-gray-400 transition-all active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="px-6 md:px-8 border-b border-white/10 bg-[#060712] flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'overview', label: '📊 Rendimiento de Citas', icon: Calendar },
                        { id: 'flow', label: '🤖 Flujo de Agenda Automática', icon: Bot },
                        { id: 'broadcast', label: '📢 Recordatorios & Difusión', icon: Send },
                        { id: 'settings', label: '⚙️ Configuración del Número', icon: Smartphone }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-4 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 border-b-2 whitespace-nowrap ${
                                    isActive
                                        ? 'border-emerald-500 text-white bg-emerald-500/10'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* CONTENT */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Conversaciones
                                    </p>
                                    <p className="text-3xl font-black text-white italic">{stats.monthlyConversations}</p>
                                    <span className="text-[10px] text-emerald-400 font-bold">+38% este mes</span>
                                </div>

                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Citas Confirmadas
                                    </p>
                                    <p className="text-3xl font-black text-cyan-400 italic">{stats.appointmentsBooked}</p>
                                    <span className="text-[10px] text-gray-400 font-bold">27.4% tasa de conversión</span>
                                </div>

                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Tiempo de Respuesta
                                    </p>
                                    <p className="text-3xl font-black text-amber-400 italic">{stats.avgResponseTime}</p>
                                    <span className="text-[10px] text-emerald-400 font-bold">Respuesta instantánea 24/7</span>
                                </div>

                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-indigo-400" /> Automatización IA
                                    </p>
                                    <p className="text-3xl font-black text-indigo-400 italic">{stats.automationEfficiency}</p>
                                    <span className="text-[10px] text-indigo-400 font-bold">Sin intervención humana</span>
                                </div>
                            </div>

                            {/* Medical Bot Banner */}
                            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                            Asistente Médico IA 24/7 Activo
                                        </h4>
                                        <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                                            El bot clasifica a los pacientes según su dolencia (Hombro, Rodilla, Lesión Deportiva) y les asigna el horario adecuado en la agenda de la clínica.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: FLOW */}
                    {activeTab === 'flow' && (
                        <div className="space-y-6">
                            <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-4">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-emerald-400" /> Disparadores y Respuestas Inteligentes
                                </h3>

                                <div className="space-y-3">
                                    {triggers.map((t, i) => (
                                        <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-black text-emerald-300 font-mono">&quot;{t.trigger}&quot;</span>
                                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black rounded-xl">
                                                    {t.converted}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                <strong className="text-gray-400">Respuesta del Asistente:</strong> {t.botAction}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: BROADCAST */}
                    {activeTab === 'broadcast' && (
                        <div className="space-y-6">
                            <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-4">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Send className="w-4 h-4 text-emerald-400" /> Recordatorios Masivos a Pacientes Agendados
                                </h3>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400">Mensaje de Notificación:</label>
                                    <textarea
                                        value={broadcastMessage}
                                        onChange={(e) => setBroadcastMessage(e.target.value)}
                                        rows={4}
                                        className="w-full bg-[#050510] border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                                    />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xs text-gray-500 font-mono">48 pacientes en lista de mañana</span>
                                        <button
                                            onClick={handleSendBroadcast}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                                        >
                                            <Send className="w-4 h-4" /> Enviar Recordatorios
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: SETTINGS */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-6">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-emerald-400" /> Configuración de Conexión de WhatsApp API
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Número Oficial</p>
                                        <p className="text-sm font-black text-white">{phoneNumber}</p>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Estado del Webhook</p>
                                        <p className="text-sm font-black text-emerald-400">Activo (Latencia: 24ms)</p>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Proveedor de API</p>
                                        <p className="text-xs font-bold text-gray-300">Meta Cloud API (Oficial Médica)</p>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Cifrado de Conversaciones</p>
                                        <p className="text-xs font-bold text-indigo-300">End-to-End Encryption (Cumplimiento HIPAA)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
