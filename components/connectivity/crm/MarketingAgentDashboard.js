'use client';

import { useState } from 'react';
import {
    Megaphone, TrendingUp, Target, Calendar, BrainCircuit,
    Video, Image, FileText, CheckCircle, ArrowRight,
    Sparkles, RefreshCw, BarChart3, Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketingAgentDashboard() {
    const [objective, setObjective] = useState('ventas'); // ventas, autoridad, comunidad

    return (
        <div className="space-y-6 pb-20 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        Agente de Marketing IA <Megaphone className="w-8 h-8 text-pink-500" />
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Tu estratega de contenido que decide qué publicar para crecer y vender.
                    </p>
                </div>
                <div className="bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-xl text-pink-400 font-bold flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5" />
                    ESTRATEGIA ACTIVA
                </div>
            </div>

            {/* TOP: Dynamic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Contenido Sugerido" value="6 Piezas" icon={FileText} color="text-blue-400" />
                <StatCard label="Tendencias Detectadas" value="3 Nuevas" icon={Sparkles} color="text-amber-400" />
                <StatCard label="Oportunidades" value="4 Detectadas" icon={TrendingUp} color="text-green-400" />
                <StatCard label="Objetivo Actual" value={objective.toUpperCase()} icon={Target} color="text-pink-400" highlight />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COL: Recommendations & Strategy */}
                <div className="lg:col-span-2 space-y-6">

                    {/* BLOQUE 5: Objetivo */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Define tu Objetivo Actual
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <ObjectiveBtn label="Ventas" active={objective === 'ventas'} onClick={() => setObjective('ventas')} emoji="💰" />
                            <ObjectiveBtn label="Autoridad" active={objective === 'autoridad'} onClick={() => setObjective('autoridad')} emoji="🎓" />
                            <ObjectiveBtn label="Comunidad" active={objective === 'comunidad'} onClick={() => setObjective('comunidad')} emoji="🤝" />
                            <ObjectiveBtn label="Alcance" active={objective === 'alcance'} onClick={() => setObjective('alcance')} emoji="🚀" />
                            <ObjectiveBtn label="Lanzamiento" active={objective === 'lanzamiento'} onClick={() => setObjective('lanzamiento')} emoji="🔥" />
                        </div>
                    </section>

                    {/* BLOQUE 1: Recomendaciones */}
                    <section className="bg-gradient-to-br from-[#0A0A12] to-[#1a1a2e] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-400" /> Contenido Recomendado para Hoy
                                </h3>
                                <p className="text-sm text-gray-400">Basado en tus métricas y el objetivo "{objective}".</p>
                            </div>
                            <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                                <RefreshCw className="w-3 h-3" /> Actualizar
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 relative z-10">
                            <RecommendationCard
                                type="Reel"
                                title="¿Por qué ignorar este síntoma es peligroso?"
                                goal="Generar Urgencia"
                                icon={Video}
                                color="text-pink-400"
                            />
                            <RecommendationCard
                                type="Carrusel"
                                title="3 Errores comunes al elegir tu tratamiento"
                                goal="Educación / Autoridad"
                                icon={Layers}
                                color="text-blue-400"
                            />
                        </div>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />
                    </section>

                    {/* BLOQUE 4: Plan Semanal */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-400" /> Plan Semanal Automático
                            </h3>
                            <button className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                                Enviar a Producción
                            </button>
                        </div>
                        <div className="space-y-3">
                            <PlanRow day="Lunes" type="Reel Educativo" status="Listo para guion" icon={Video} />
                            <PlanRow day="Miércoles" type="Testimonio Cliente" status="Pendiente material" icon={Image} />
                            <PlanRow day="Viernes" type="Video Autoridad" status="En edición" icon={Video} />
                            <PlanRow day="Domingo" type="Historia Interactiva" status="Programado" icon={Layers} />
                        </div>
                    </section>

                </div>

                {/* RIGHT COL: Insights & Opportunities */}
                <div className="space-y-6">

                    {/* BLOQUE 6: Decisiones IA */}
                    <div className="bg-gradient-to-b from-blue-900/10 to-[#0A0A12] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-blue-400" /> Lógica de la IA
                        </h3>
                        <ul className="space-y-4">
                            <InsightItem text="Detecté que los videos educativos convierten un 40% más esta semana." />
                            <InsightItem text="Tu audiencia pregunta mucho sobre 'Costos', sugerí un post aclaratorio." />
                            <InsightItem text="La competencia está viralizando contenido sobre 'Mitos', añadí una idea similar." />
                        </ul>
                    </div>

                    {/* BLOQUE 2: Rendimiento */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-green-400" /> Lo que funciona
                        </h3>
                        <div className="space-y-4">
                            <PerformanceBar label="Testimonios" value={95} color="bg-green-500" />
                            <PerformanceBar label="Educativo" value={80} color="bg-blue-500" />
                            <PerformanceBar label="Promocional" value={45} color="bg-yellow-500" />
                        </div>
                        <p className="mt-4 text-xs text-gray-400 text-center italic">
                            "La IA recomienda priorizar contenido educativo con testimonios."
                        </p>
                    </section>

                    {/* BLOQUE 3: Oportunidades */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-amber-400" /> Oportunidades
                        </h3>
                        <div className="space-y-3">
                            <OpportunityItem text="Tus seguidores preguntan sobre costos" />
                            <OpportunityItem text="Falta contenido de autoridad (Hace 2 semanas)" />
                            <OpportunityItem text="No se ha mostrado el proceso del servicio" />
                        </div>
                        <button className="w-full mt-4 py-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-bold rounded-lg border border-amber-500/20 transition-colors">
                            Generar Plan de Contenidos
                        </button>
                    </section>

                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function StatCard({ label, value, icon: Icon, color, highlight }) {
    return (
        <div className={`p-4 ${highlight ? 'bg-gradient-to-br from-pink-900/20 to-[#0A0A12]' : 'bg-[#0A0A12]'} border border-white/5 rounded-2xl hover:border-white/10 transition-colors`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500 font-bold uppercase">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
        </div>
    );
}

function ObjectiveBtn({ label, active, onClick, emoji }) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${active
                    ? 'bg-pink-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/20 scale-105'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
        >
            <span className="text-lg">{emoji}</span>
            {label}
        </button>
    );
}

function RecommendationCard({ type, title, goal, icon: Icon, color }) {
    return (
        <div className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-3">
                <div className={`text-xs font-bold px-2 py-1 rounded bg-black/20 ${color} uppercase tracking-wide`}>
                    {type}
                </div>
                <Icon className={`w-5 h-5 ${color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </div>
            <h4 className="font-bold text-white mb-2 leading-tight group-hover:text-pink-400 transition-colors">
                {title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <Target className="w-3 h-3" /> Obj: {goal}
            </div>
            <button className="mt-4 w-full py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-pink-600/20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                Crear Ahora
            </button>
        </div>
    );
}

function PlanRow({ day, type, status, icon: Icon }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 text-sm font-bold text-gray-500">{day}</div>
            <div className="p-2 bg-black/20 rounded-lg text-gray-400">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
                <div className="text-sm font-bold text-white">{type}</div>
                <div className="text-xs text-gray-500">{status}</div>
            </div>
            <CheckCircle className="w-4 h-4 text-green-500/50" />
        </div>
    );
}

function InsightItem({ text }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-sm text-gray-300 leading-snug">{text}</p>
        </div>
    );
}

function PerformanceBar({ label, value, color }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-bold">{value}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function OpportunityItem({ text }) {
    return (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="p-1 bg-amber-500/20 rounded text-amber-400">
                <TrendingUp className="w-3 h-3" />
            </div>
            <span className="text-xs text-gray-300">{text}</span>
        </div>
    );
}
