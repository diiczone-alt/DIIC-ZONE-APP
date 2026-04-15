'use client';

import { useState } from 'react';
import {
    Star, Target, Zap,
    ArrowUpRight, CheckCircle2,
    Circle, Rocket, Award,
    Trophy, Flag, ShieldCheck,
    Briefcase, Activity, Sparkles,
    ChevronRight, Info, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientLevelSystem({ initialLevel = 2 }) {
    const [level, setLevel] = useState(initialLevel);

    const levels = [
        {
            id: 1,
            name: "Inicio Digital",
            color: "emerald",
            status: "El cliente apenas comienza.",
            has: ["Marca básica", "Redes creadas", "Sin estrategia clara"],
            meta: ["Identidad definida", "Contenido constante", "Mensaje claro"]
        },
        {
            id: 2,
            name: "Presencia",
            color: "yellow",
            status: "Ya se ve, pero aún no vende bien.",
            has: ["Redes activas", "Contenido regular"],
            meta: ["Imagen profesional constante", "Reconocimiento visual", "Mayor interacción"]
        },
        {
            id: 3,
            name: "Confianza",
            color: "orange",
            status: "La gente empieza a confiar.",
            has: ["Contenido de valor", "Testimonios", "Imagen profesional"],
            meta: ["Autoridad en su nicho", "Pruebas sociales visibles", "Imagen experta"]
        },
        {
            id: 4,
            name: "Autoridad",
            color: "blue",
            status: "Es referencia en su sector.",
            has: ["Marca sólida", "Comunidad", "Reputación"],
            meta: ["Sistema de captación de clientes", "Ventas constantes", "Procesos digitales"]
        },
        {
            id: 5,
            name: "Escala",
            color: "purple",
            status: "Negocio estructurado.",
            has: ["Automatización", "Sistema de ventas", "Marketing constante"],
            meta: ["Crecimiento continuo", "Inversión inteligente", "Marca líder"]
        }
    ];

    const currentLevel = levels[level - 1];
    const nextLevel = level < 5 ? levels[level] : null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* LEVEL HEADER WIDGET */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0A0A12] border border-white/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Trophy className={`w-40 h-40 text-${currentLevel.color}-500`} />
                </div>

                <div className="flex flex-col justify-center gap-4 relative z-10 text-left">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl bg-${currentLevel.color}-500/10 text-${currentLevel.color}-400`}>
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Nivel {level}: {currentLevel.name}</h2>
                    </div>
                    <p className="text-gray-400 font-medium italic">"{currentLevel.status}"</p>
                    <div className="flex gap-2 mt-2">
                        {levels.map(l => (
                            <div
                                key={l.id}
                                className={`h-1.5 flex-grow rounded-full ${l.id <= level ? `bg-${currentLevel.color}-500` : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative z-10 flex flex-col justify-center items-center text-center">
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48" cy="48" r="40"
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <circle
                                cx="48" cy="48" r="40"
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 * (1 - 0.65)} // Mock progress: 65%
                                className={`text-${currentLevel.color}-500 transition-all duration-1000`}
                            />
                        </svg>
                        <span className="absolute text-xl font-black text-white">65%</span>
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Progreso al Nivel {level + 1}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* EVOLUTION CHECKLIST */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 text-left">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2 mb-8">
                        <Flag className="w-5 h-5 text-indigo-400" /> Checklist de Evolución
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* CURRENT ASSETS */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Logros Actuales
                            </h4>
                            <div className="space-y-4">
                                {currentLevel.has.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-xs text-gray-300 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NEXT STEPS */}
                        {nextLevel && (
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-indigo-400" /> Meta para Nivel {nextLevel.id}
                                </h4>
                                <div className="space-y-4">
                                    {nextLevel.meta.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl opacity-60 hover:opacity-100 transition-opacity">
                                            <Circle className="w-4 h-4 text-gray-600" />
                                            <span className="text-xs text-gray-400 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* IA GROWTH ADVISOR & BENEFITS */}
                <div className="space-y-8">
                    <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-8 text-left">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" /> Growth Advisor IA
                        </h4>
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 mb-6">
                            <p className="text-xs text-gray-300 font-medium italic leading-relaxed">
                                "Mike, te faltan testimonios y automatización para subir al <span className="text-indigo-400 font-black">NIVEL 4</span>. Tu marca ya está lista para escalar, hablemos de integrar tu CRM."
                            </p>
                        </div>
                        <button className="w-full py-4 bg-indigo-500 text-white text-[10px] font-black uppercase rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                            Agendar Consultoría de Escala
                        </button>
                    </div>

                    <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 text-left">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Beneficios Desbloqueados</h4>
                        <div className="space-y-4">
                            <BenefitRow label="Descuento Fidelidad" value="5% Activo" isDone />
                            <BenefitRow label="Soporte Prioritario" value="Próximo Nivel" />
                            <BenefitRow label="Acceso Previs 3D" value="Nivel 4" />
                            <BenefitRow label="Revenue Share" value="Nivel 5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* FULL LADDER ROADMAP */}
            <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 overflow-x-auto text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-10 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" /> Tu Camino en DIIC ZONE
                </h3>
                <div className="flex gap-4 min-w-[800px]">
                    {levels.map(l => (
                        <div key={l.id} className={`flex-1 p-6 rounded-3xl border transition-all ${l.id === level ? `bg-white/5 border-${l.color}-500/50` : 'bg-white/5 border-white/5 opacity-40'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-black text-${l.color}-500`}>L{l.id}</span>
                                {l.id < level && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                            <h5 className="text-[11px] font-black text-white uppercase mb-2">{l.name}</h5>
                            <div className={`w-full h-1 rounded-full mb-3 ${l.id <= level ? `bg-${l.color}-500` : 'bg-white/10'}`} />
                            <p className="text-[9px] text-gray-500 font-medium leading-tight">{l.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function BenefitRow({ label, value, isDone }) {
    return (
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[11px] font-bold text-gray-400">{label}</span>
            <span className={`text-[9px] font-black uppercase ${isDone ? 'text-emerald-400' : 'text-gray-600'}`}>
                {value}
            </span>
        </div>
    );
}
