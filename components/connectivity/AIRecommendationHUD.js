'use client';

import {
    BrainCircuit, Sparkles, Layout,
    MessageSquare, Clock, AlertCircle,
    CheckCircle2, ArrowRight, Lightbulb,
    Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AIRecommendationHUD({ data = {} }) {
    const router = useRouter();
    // Mock de datos si no se pasan por props para demo
    const strategy = data.focus ? data : {
        focus: 'Retención Temprana',
        insight: 'En tu nicho, los videos educativos con ganchos de pregunta directa retienen un 40% más de audiencia.',
        suggestedCTA: '📩 Agenda una Consulta / Guarda para después',
        structure: 'Problema -> Solución -> Proof -> CTA',
        suggestions: [
            'El gancho visual de los primeros 2s es potente. Mantener este estilo.',
            'Añade un CTA de "Guarda este post" al final para aumentar el alcance algorítmico.'
        ],
        bestTime: "7:00 PM - 9:00 PM",
        confidence: 94
    };

    return (
        <div className="bg-[#0A0A12] border border-indigo-500/20 rounded-[40px] p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className={`absolute top-0 right-0 p-8 opacity-5`}>
                <BrainCircuit className="w-48 h-48 text-indigo-400" />
            </div>

            <div className="relative z-10 space-y-8">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Inteligencia Estratégica Activa</span>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Motor de Recomendaciones</h3>
                    </div>
                </div>

                {/* MAIN STRATEGY CARD */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-[32px] p-8 text-left">
                    <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-5 h-5 text-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Enfoque de Éxito: <span className="text-indigo-400">{strategy.focus}</span></span>
                    </div>
                    <p className="text-lg font-bold text-gray-200 leading-relaxed">
                        "{strategy.insight}"
                    </p>
                </div>

                {/* TACTICAL GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TacticalCard
                        icon={Layout}
                        label="Estructura Sugerida"
                        value={strategy.structure}
                        color="blue"
                    />
                    <TacticalCard
                        icon={MessageSquare}
                        label="Llamada a la Acción (CTA)"
                        value={strategy.suggestedCTA}
                        color="emerald"
                    />
                </div>

                {/* SUGGESTIONS PANEL */}
                <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 text-left">
                            <Sparkles className="w-4 h-4 text-indigo-400" /> Sugerencias de Optimización
                        </h4>
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Publicar: {strategy.bestTime}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {strategy.suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-300 font-medium leading-relaxed">{s}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button 
                        onClick={() => {
                            toast.success("Enviando solicitud de ajustes al Strategist...");
                            router.push('?tab=identity');
                        }}
                        className="flex-1 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all"
                    >
                        Solicitar Ajustes Tácticos
                    </button>
                    <button 
                        onClick={() => {
                            toast.success("Estrategia aplicada al calendario de producción.");
                            router.push('?tab=catalog');
                        }}
                        className="flex-1 py-5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                    >
                        Aplicar Estrategia Sugerida <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function TacticalCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    };

    return (
        <div className={`p-6 rounded-[32px] border ${colors[color]} text-left group hover:bg-white/5 transition-all`}>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-4 flex items-center gap-2">
                <Icon className="w-3 h-3" /> {label}
            </span>
            <div className="text-sm font-black text-white leading-relaxed">{value}</div>
        </div>
    );
}
