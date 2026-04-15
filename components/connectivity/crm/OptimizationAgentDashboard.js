'use client';

import { useState } from 'react';
import {
    TrendingUp, LineChart, Zap, AlertTriangle, Layers,
    Facebook, Instagram, Video, DollarSign, CheckCircle,
    Settings, PlayCircle, BarChart, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptimizationAgentDashboard() {
    const [autoMode, setAutoMode] = useState(false);

    return (
        <div className="space-y-6 pb-20 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        Agente de Optimización IA <TrendingUp className="w-8 h-8 text-green-400" />
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Mejora automáticamente el rendimiento de tu contenido y anuncios.
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border transition-all ${autoMode ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                    <Zap className={`w-5 h-5 ${autoMode ? 'fill-green-400' : ''}`} />
                    {autoMode ? 'OPTIMIZACIÓN AUTOMÁTICA ACTIVA' : 'MODO MANUAL'}
                    <button
                        onClick={() => setAutoMode(!autoMode)}
                        className={`ml-2 w-10 h-5 rounded-full p-0.5 transition-colors ${autoMode ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${autoMode ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            {/* TOP: Dynamic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatCard label="Rendimiento General" value="+32%" icon={LineChart} color="text-green-400" bg="bg-green-500/10" />
                <StatCard label="Contenido Optimizado" value="8 Piezas" icon={Layers} color="text-blue-400" />
                <StatCard label="Costo por Lead" value="$1.90" icon={DollarSign} color="text-yellow-400" />
                <StatCard label="Oportunidades" value="4 Detectadas" icon={Zap} color="text-purple-400" />
                <StatCard label="Ajustes Recomendados" value="6" icon={Settings} color="text-pink-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COL: Content & Ads */}
                <div className="lg:col-span-2 space-y-6">

                    {/* BLOQUE 1: Contenido que Mejor Funciona */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-blue-400" /> Ranking de Contenido
                            </h3>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-xs text-blue-400 font-bold border border-blue-500/20">
                                💡 "Prioriza Testimonios"
                            </div>
                        </div>

                        <div className="space-y-4">
                            <RankingRow
                                type="Reel Testimonio"
                                reach="Alto 🔥"
                                conversion="4.5%"
                                status="Excelente"
                                color="text-green-400"
                                progress={90}
                            />
                            <RankingRow
                                type="Educativo Corto"
                                reach="Medio 🟢"
                                conversion="2.8%"
                                status="Bueno"
                                color="text-blue-400"
                                progress={65}
                            />
                            <RankingRow
                                type="Promoción Directa"
                                reach="Bajo 🟡"
                                conversion="0.9%"
                                status="Mejorable"
                                color="text-yellow-400"
                                progress={30}
                            />
                        </div>
                    </section>

                    {/* BLOQUE 2: Análisis de Anuncios */}
                    <section className="bg-gradient-to-br from-[#0A0A12] to-[#151525] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                            <DollarSign className="w-5 h-5 text-green-400" /> Optimización de Rentabilidad (Ads)
                        </h3>

                        <div className="grid md:grid-cols-3 gap-4 relative z-10">
                            <AdAnalysisCard
                                name="Video Abajo"
                                metric="CTR 0.4%"
                                issue="Gancho Débil"
                                action="Cambiar Gancho"
                                icon={Video}
                                color="text-red-400"
                            />
                            <AdAnalysisCard
                                name="Video B"
                                metric="ROAS 4.2"
                                issue="Gran Rendimiento"
                                action="Escalar Presupuesto"
                                icon={TrendingUp}
                                color="text-green-400"
                            />
                            <AdAnalysisCard
                                name="Imagen C"
                                metric="Engagement Bajo"
                                issue="Diseño Saturado"
                                action="Pausar Anuncio"
                                icon={Layers}
                                color="text-yellow-400"
                            />
                        </div>

                        <div className="mt-6 flex gap-3 relative z-10">
                            <button className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" /> Aplicar Cambios Automáticos
                            </button>
                            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl border border-white/5 transition-colors">
                                Revisar
                            </button>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />
                    </section>
                </div>

                {/* RIGHT COL: Suggestions & Errors */}
                <div className="space-y-6">

                    {/* BLOQUE 5: Errores Detectados */}
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" /> Alertas de Estrategia
                        </h3>
                        <ul className="space-y-3">
                            <AlertItem text="Mucho contenido promocional (80%)" />
                            <AlertItem text="Poco contenido educativo recientemente" />
                            <AlertItem text="Baja interacción en historias (>200 vistas)" />
                        </ul>
                    </div>

                    {/* BLOQUE 3: Sugerencias de Optimización */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-400" /> Acciones Sugeridas
                        </h3>
                        <div className="space-y-3">
                            <SuggestionItem text="Reduce duración de Reels a 20s" sub="Retención cae al segundo 22" />
                            <SuggestionItem text="Inicia con pregunta directa" sub="Aumenta hooks en un 15%" />
                            <SuggestionItem text="Más subtítulos grandes" sub="Mejora accesibilidad y retención" />
                            <SuggestionItem text="Agregar CTA claro al final" sub="Faltó en 3 posts recientes" />
                        </div>
                    </section>

                    {/* BLOQUE 4: Ajustes Automáticos (Preview) */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 opacity-75 hover:opacity-100 transition-opacity">
                        <h3 className="font-bold text-gray-400 mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Capacidades Automáticas
                        </h3>
                        <div className="space-y-2">
                            <AutoCapability text="Ajustar horarios de publicación" active={autoMode} />
                            <AutoCapability text="Reasignar presupuesto en Ads" active={autoMode} />
                            <AutoCapability text="Priorizar formatos ganadores" active={autoMode} />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function StatCard({ label, value, icon: Icon, color, bg = 'bg-[#0A0A12]' }) {
    return (
        <div className={`p-4 ${bg} border border-white/5 rounded-2xl hover:border-white/10 transition-colors`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500 font-bold uppercase">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
        </div>
    );
}

function RankingRow({ type, reach, conversion, status, color, progress }) {
    return (
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white text-sm">{type}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded bg-black/20 ${color}`}>{status}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Alcance: {reach}</span>
                <span>Conv: {conversion}</span>
            </div>
            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div className={`h-full ${color.replace('text', 'bg')}`} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

function AdAnalysisCard({ name, metric, issue, action, icon: Icon, color }) {
    return (
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-full">
            <div className="mb-3">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">{name}</span>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-lg font-bold text-white mb-1">{metric}</div>
                <div className={`text-xs ${color}`}>{issue}</div>
            </div>
            <div className="pt-3 border-t border-white/5">
                <div className="text-[10px] text-gray-500 uppercase mb-1">Acción IA</div>
                <div className="font-bold text-white text-sm">{action}</div>
            </div>
        </div>
    );
}

function AlertItem({ text }) {
    return (
        <div className="flex gap-3 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <p className="text-sm text-red-200">{text}</p>
        </div>
    );
}

function SuggestionItem({ text, sub }) {
    return (
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
            <div className="flex gap-2 items-start mb-1">
                <ArrowUpRight className="w-4 h-4 text-amber-400 mt-0.5" />
                <span className="font-bold text-white text-sm">{text}</span>
            </div>
            <p className="text-xs text-gray-400 pl-6">{sub}</p>
        </div>
    );
}

function AutoCapability({ text, active }) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className={`w-4 h-4 ${active ? 'text-green-400' : 'text-gray-600'}`} />
            <span className={active ? 'text-white' : ''}>{text}</span>
        </div>
    );
}
