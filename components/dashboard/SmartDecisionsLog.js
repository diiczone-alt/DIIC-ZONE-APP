'use client';

import { useState, useEffect } from 'react';
import { Settings, Zap, Clock, TrendingUp, ShieldCheck, ChevronRight, Activity } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_HISTORY = [
    {
        id: 1,
        type: 'content',
        title: 'Horario Optimizado',
        desc: 'Tus seguidores están más activos a las 19:00. Próximos posts reagendados.',
        time: 'Hace 2h',
        icon: Clock,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    {
        id: 'alert_ads',
        type: 'campaign',
        title: 'Presupuesto Ajustado',
        desc: 'Se redujo 20% el gasto en "Anuncio B" (Bajo CTR). Reasignado a "Anuncio A".',
        time: 'Hace 5h',
        icon: TrendingUp,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 'auto_reply',
        type: 'automation',
        title: 'Respuesta Automática',
        desc: 'Detectamos preguntas repetidas sobre "Precios". Bot activado para este tema.',
        time: 'Ayer',
        icon: Zap,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10'
    }
];

export default function SmartDecisionsLog() {
    const [mode, setMode] = useState('assisted'); // manual | assisted | automatic
    const [history, setHistory] = useState(MOCK_HISTORY);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        // Simular una nueva decisión en tiempo real
        const timer = setTimeout(() => {
            setIsSimulating(true);
            setTimeout(() => {
                const newDecision = {
                    id: Date.now(),
                    type: 'optimization',
                    title: 'Contenido Priorizado',
                    desc: 'El formato "Reels Educativos" tiene +40% engagement. Priorizando en calendario.',
                    time: 'Ahora mismo',
                    icon: Activity,
                    color: 'text-pink-400',
                    bg: 'bg-pink-500/10',
                    isNew: true
                };
                setHistory(prev => [newDecision, ...prev]);
                setIsSimulating(false);
                toast('🧠 Nueva decisión inteligente aplicada');
            }, 2000);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleModeChange = (newMode) => {
        setMode(newMode);
        toast.success(`Modo cambiado a: ${newMode.toUpperCase()}`);
    };

    return (
        <div className="rounded-3xl bg-[#0F0F1A] border border-white/5 relative overflow-hidden flex flex-col">

            {/* Header & Controls */}
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Decisiones Inteligentes</h3>
                        <p className="text-xs font-medium text-gray-500">
                            Optimizaciones automáticas del sistema
                        </p>
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                    {['manual', 'assisted', 'automatic'].map((m) => (
                        <button
                            key={m}
                            onClick={() => handleModeChange(m)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${mode === m
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {m === 'manual' ? 'Manual' : m === 'assisted' ? 'Asistido' : 'Auto 100%'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Simulating Indicator */}
            {isSimulating && (
                <div className="px-5 py-2 bg-indigo-500/5 border-b border-indigo-500/10 flex items-center gap-2 text-xs text-indigo-300 animate-pulse">
                    <Activity className="w-3 h-3 animate-spin" />
                    Analizando patrones de rendimiento...
                </div>
            )}

            {/* Activity Log */}
            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className={`group flex gap-4 p-3 rounded-xl transition-all hover:bg-white/5 ${item.isNew ? 'animate-fade-in-up bg-indigo-500/5 border border-indigo-500/20' : 'border border-transparent'}`}
                    >
                        {/* Timeline Connector */}
                        <div className="relative flex flex-col items-center">
                            <div className={`p-2 rounded-full ${item.bg} ${item.color} z-10 shrink-0`}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="w-px h-full bg-white/5 absolute top-8 -bottom-6 group-last:hidden"></div>
                        </div>

                        <div className="flex-1 pb-2">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-gray-200">{item.title}</h4>
                                <span className="text-[10px] text-gray-500 font-mono">{item.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                {item.desc}
                            </p>
                            {mode !== 'automatic' && item.isNew && (
                                <button className="mt-2 text-[10px] text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300 transition-colors">
                                    VER DETALLES <ChevronRight className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-black/20 border-t border-white/5 text-center">
                <p className="text-[10px] text-gray-500">
                    El sistema aprende de tus resultados diarios.
                </p>
            </div>
        </div>
    );
}
