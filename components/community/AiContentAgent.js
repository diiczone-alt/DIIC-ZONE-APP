'use client';

import { useState } from 'react';
import {
    Bot, Sparkles, TrendingUp, Calendar, Video,
    FileText, PenTool, CheckCircle, Brain,
    BarChart2, Zap, LayoutTemplate, MessageSquare,
    Play, ChevronRight, RefreshCw, Wand2
} from 'lucide-react';

export default function AiContentAgent() {
    const [autoMode, setAutoMode] = useState(false);

    const SUGGESTIONS = [
        {
            type: 'Educativo',
            icon: GraduationIcon,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            idea: '¿Cuándo debes visitar al urólogo?',
            format: 'Reel (60s)',
            impact: 'Alto Alcance'
        },
        {
            type: 'Autoridad',
            icon: ShieldIcon,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            idea: 'Mito o Verdad: ¿La cirugía láser duele?',
            format: 'Video Vertical',
            impact: 'Confianza'
        },
        {
            type: 'Testimonial',
            icon: MessageSquare,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            idea: 'Paciente cuenta su recuperación rápida',
            format: 'Carrusel',
            impact: 'Alta Conversión'
        },
    ];

    const WK_CALENDAR = [
        { day: 'Lun', content: 'Video Educativo', status: 'ready' },
        { day: 'Mie', content: 'Testimonial', status: 'pending' },
        { day: 'Vie', content: 'Reel de Autoridad', status: 'pending' },
    ];

    return (
        <div className="space-y-8 pb-20 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        Agente IA de Contenido <Sparkles className="w-8 h-8 text-amber-400" />
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Te recomiendo qué publicar para crecer, posicionarte y vender.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-[#0A0A12] border border-white/5 rounded-xl p-2">
                    <span className="text-xs font-bold text-gray-400 pl-2">MODO AUTOMÁTICO</span>
                    <button
                        onClick={() => setAutoMode(!autoMode)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${autoMode ? 'bg-green-500' : 'bg-gray-700'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${autoMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* BLOCK 1: Business Context */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <Brain className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-white">Contexto del Negocio</h3>
                        </div>
                        <div className="space-y-4">
                            <ContextRow label="Nicho" value="Médico Urología" />
                            <ContextRow label="Objetivo" value="Generar Consultas" />
                            <ContextRow label="Nivel de Marca" value="Lvl 3 - Confianza" />
                            <div className="pt-4 border-t border-white/5">
                                <span className="text-xs text-gray-500 block mb-2">Servicios Clave</span>
                                <div className="flex flex-wrap gap-2">
                                    <Badge text="Consulta" />
                                    <Badge text="Cirugía Láser" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BLOCK 2: Analysis */}
                    <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                <BarChart2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-white">Análisis de Rendimiento</h3>
                        </div>
                        <div className="space-y-3">
                            <AnalysisItem label="Videos Informativos" result="Buen Alcance" color="text-green-400" />
                            <AnalysisItem label="Testimoniales" result="Alta Conversión" color="text-green-400" />
                            <AnalysisItem label="Promocionales Directos" result="Bajo Rendimiento" color="text-red-400" />
                        </div>
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3 items-start">
                            <Bot className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-200 leading-relaxed">
                                <strong>Insight IA:</strong> Tu audiencia responde mejor cuando mezclas contenido educativo con testimonios reales. Reduce la venta directa.
                            </p>
                        </div>
                    </div>
                </div>

                {/* BLOCK 3: Content Suggestions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                    <Wand2 className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-white">Sugerencias para esta Semana</h3>
                            </div>
                            <button className="text-xs flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                <RefreshCw className="w-3 h-3" /> Generar Nuevas
                            </button>
                        </div>

                        <div className="grid gap-4 relative z-10">
                            {SUGGESTIONS.map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className={`text-xs font-bold uppercase tracking-wider ${item.color}`}>{item.type}</div>
                                                <h4 className="font-bold text-white text-lg">{item.idea}</h4>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-black/30 rounded text-[10px] text-gray-400 border border-white/5 uppercase font-bold">
                                            {item.impact}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Video className="w-4 h-4" /> Formato: {item.format}
                                        </div>
                                        <div className="flex gap-2">
                                            <ActionButton icon={PenTool} label="Crear Guión" />
                                            <ActionButton icon={LayoutTemplate} label="Diseñar" />
                                            <ActionButton icon={Zap} label="Producción" primary />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BLOCK 4: Smart Calendar */}
                    <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-white">Calendario Inteligente (Propuesta)</h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {WK_CALENDAR.map((day, i) => (
                                <div key={i} className="flex-1 min-w-[120px] bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col items-center text-center">
                                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">{day.day}</div>
                                    <div className="font-bold text-white text-sm mb-2">{day.content}</div>
                                    <div className={`mt-auto w-2 h-2 rounded-full ${day.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                </div>
                            ))}
                            <div className="flex-1 min-w-[120px] border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-gray-600 hover:text-gray-400 hover:border-white/20 transition-colors cursor-pointer">
                                <span className="text-2xl mb-1">+</span>
                                <span className="text-xs font-bold uppercase">Añadir</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContextRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    );
}

function Badge({ text }) {
    return (
        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
            {text}
        </span>
    );
}

function AnalysisItem({ label, result, color }) {
    return (
        <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded-lg transition-colors">
            <span className="text-gray-400">{label}</span>
            <span className={`font-bold ${color}`}>{result}</span>
        </div>
    );
}

function ActionButton({ icon: Icon, label, primary }) {
    return (
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${primary
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
            }`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function GraduationIcon({ className }) {
    return <Bot className={className} />; // Placeholder as lucide might not have GraduationCap named correctly in my imports
}
function ShieldIcon({ className }) {
    return <CheckCircle className={className} />;
}
