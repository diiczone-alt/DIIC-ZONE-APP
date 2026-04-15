'use client';

import { useState } from 'react';
import {
    Bot, Zap, MessageSquare, CheckCircle, Settings,
    BrainCircuit, Target, ShoppingBag, BarChart3,
    Power, Mic, UserCog, RefreshCw, ChevronRight,
    MessageCircle, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import SalesAgentLiveView from './SalesAgentLiveView';
import AiAgentPerformance from './AiAgentPerformance';

export default function AiAgentDashboard() {
    const [status, setStatus] = useState('active'); // active, paused
    const [persona, setPersona] = useState({ tone: 'Cercano', type: 'Consultorio Médico', goal: 'Agendar Citas' });

    const [activeTab, setActiveTab] = useState('performance'); // performance, live, config

    return (
        <div className="space-y-6 pb-20 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        Agente de Ventas Inteligente <Bot className="w-8 h-8 text-cyan-400" />
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Tu sistema de ventas autónomo que trabaja 24/7.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStatus(status === 'active' ? 'paused' : 'active')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition-all ${status === 'active'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                            : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                            }`}
                    >
                        <Power className="w-4 h-4" />
                        {status === 'active' ? 'AGENTE ACTIVO' : 'AGENTE PAUSADO'}
                    </button>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-sm">
                        <button
                            onClick={() => setActiveTab('performance')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'performance' ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <BarChart3 className="w-4 h-4" /> Rendimiento
                        </button>
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'live' ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Zap className="w-4 h-4" /> Monitor en Vivo
                        </button>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'config' ? 'bg-white text-black font-bold shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Settings className="w-4 h-4" /> Configuración
                        </button>
                    </div>
                </div>
            </div>

            {/* ERROR BOUNDARY / RENDER */}
            {activeTab === 'performance' && (
                <AiAgentPerformance />
            )}

            {activeTab === 'live' && (
                <section className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-[600px]">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <BrainCircuit className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-white">Monitor de Ventas en Vivo</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-green-400 font-bold">PROCESANDO</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <SalesAgentLiveView />
                    </div>
                </section>
            )}

            {activeTab === 'config' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        {/* Persona Config */}
                        <section className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                    <UserCog className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-white">Personalidad del Agente</h3>
                            </div>

                            <div className="space-y-4">
                                <ConfigRow label="Tipo de Negocio" value={persona.type} />
                                <ConfigRow label="Tono de Voz" value={persona.tone} />
                                <ConfigRow label="Objetivo Principal" value={persona.goal} />

                                <hr className="border-white/5 my-4" />

                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-2">Ejemplo de Respuesta</div>
                                    <p className="text-sm text-gray-300 italic">
                                        "¡Hola! Claro que sí, entiendo que buscas mejorar tu salud. Para la consulta urológica tenemos cupos este viernes. ¿Te gustaría reservar?"
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* What it Sells */}
                        <section className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-white">¿Qué vende tu agente?</h3>
                            </div>
                            <div className="space-y-3">
                                <OfferItem name="Consulta Médica" price="$50" />
                                <OfferItem name="Cirugía Láser" price="$1,200" />
                                <OfferItem name="Tratamiento" price="$80" />
                            </div>
                            <button className="w-full mt-4 py-2 text-sm text-blue-400 font-bold hover:text-white transition-colors flex items-center justify-center gap-1">
                                <Settings className="w-3 h-3" /> Configurar Ofertas
                            </button>
                        </section>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {/* Auto-Evolution / Learning */}
                        <div className="bg-[#05050A] border border-white/5 rounded-2xl p-6">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin-slow" /> Aprendizaje Continuo
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InsightCard text="Los pacientes preguntan más por precio que por horarios." type="Info" />
                                <InsightCard text="El tono 'Cercano' convierte 20% más que 'Formal'." type="Success" />
                                <InsightCard text="Viernes por la tarde es el mejor momento para cerrar citas." type="Tip" />
                            </div>
                        </div>

                        {/* Manual Control */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-500/20 rounded-full text-red-400 animate-pulse">
                                    <Mic className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Control Humano</h4>
                                    <p className="text-xs text-red-200">El agente está manejando 3 conversaciones ahora mismo. Todo bajo control.</p>
                                </div>
                            </div>
                            <button className="px-6 py-2 bg-red-600 hover:text-white text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20">
                                Intervenir Manualmente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, highlight }) {
    return (
        <div className="p-4 bg-[#0A0A12] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <Icon className={`w-5 h-5 ${color}`} />
                {highlight && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </div>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-xs text-gray-400 font-medium">{label}</div>
        </div>
    );
}

function ConfigRow({ label, value }) {
    return (
        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 cursor-pointer hover:text-blue-400">
                {value} <Settings className="w-3 h-3" />
            </span>
        </div>
    );
}

function OfferItem({ name, price }) {
    return (
        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-sm font-medium text-white">{name}</span>
            <span className="text-sm font-bold text-green-400">{price}</span>
        </div>
    );
}

function FlowStep({ trigger, action, outcome, color }) {
    const colorMap = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
        green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    };
    const c = colorMap[color];

    return (
        <div className={`p-4 rounded-xl border ${c.border} ${c.bg} relative`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                    <div className="text-xs text-gray-400 uppercase font-bold mb-1">Si el cliente...</div>
                    <div className="text-white font-medium flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> "{trigger}"
                    </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${c.text} hidden md:block`} />
                <div className="flex-1">
                    <div className="text-xs text-gray-400 uppercase font-bold mb-1">El Agente...</div>
                    <div className="text-white font-medium">{action}</div>
                </div>
                <div className="flex-1 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded bg-black/20 ${c.text}`}>
                        {outcome}
                    </span>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ text, type }) {
    const colors = {
        Info: 'text-blue-400 border-blue-500/20',
        Success: 'text-green-400 border-green-500/20',
        Tip: 'text-yellow-400 border-yellow-500/20'
    };
    return (
        <div className={`p-4 rounded-xl bg-white/5 border ${colors[type].split(' ')[1]} flex items-start gap-3`}>
            <div className={`mt-1 font-bold ${colors[type].split(' ')[0]}`}>•</div>
            <p className="text-sm text-gray-300">{text}</p>
        </div>
    );
}
