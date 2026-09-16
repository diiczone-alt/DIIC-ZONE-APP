'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Brain, ShieldCheck, Target, Zap, MessageSquare, 
    Copy, Check, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function StrategicMindMapModal({
    isOpen,
    onClose,
    profile = {},
    clientData = null,
    onOpenBrainWithPrompt = null
}) {
    const [activeTab, setActiveTab] = useState('mindmap'); // 'mindmap' | 'roadmap'
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [copiedItem, setCopiedItem] = useState(null);

    const clientName = (
        profile.brandName || 
        profile.leadership || 
        clientData?.name || 
        'Dr. Oscar Cujilema'
    ).replace(/[-_\s]+workspace\s*$/i, '').trim();

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(text);
        toast.success('Copiado al portapapeles');
        setTimeout(() => setCopiedItem(null), 2000);
    };

    const mindMapData = useMemo(() => {
        const whatItDoes = profile.whatItDoes || 'Especialista en Traumatología y Cirugía Artroscópica Mínimamente Invasiva';
        const problemSolved = profile.problemSolved || 'Dolor articular severo, lesiones deportivas, desgaste de meniscos y manguito rotador.';
        const valueProp = profile.valueProp || 'Cirugías de alta precisión sin dolor prolongado ni internaciones innecesarias.';
        const targetAudience = profile.targetAudience || 'Adultos 30+ y deportistas activos que buscan volver a su vida sin limitaciones.';

        return {
            center: {
                title: clientName,
                subtitle: whatItDoes.slice(0, 75) + (whatItDoes.length > 75 ? '...' : ''),
                tag: 'NODO CENTRAL • AUTORIDAD'
            },
            branches: [
                {
                    id: 'especialidad',
                    title: 'Especialidad & Estudios',
                    color: 'indigo',
                    icon: ShieldCheck,
                    badge: 'Formación',
                    items: [
                        whatItDoes,
                        'Cirugía Artroscópica Mínimamente Invasiva',
                        'Reemplazos Articulares & Prótesis Avanzadas',
                        'Terapias Biológicas & Viscosuplementación'
                    ]
                },
                {
                    id: 'patologias',
                    title: 'Dolores & Patologías',
                    color: 'fuchsia',
                    icon: Target,
                    badge: 'Problema',
                    items: [
                        problemSolved,
                        'Lesiones de Meniscos y Ligamento Cruzado (LCA)',
                        'Manguito Rotador & Inestabilidad de Hombro',
                        'Artrosis & Desgaste Articular Limitante'
                    ]
                },
                {
                    id: 'propuesta',
                    title: 'Propuesta de Valor Única',
                    color: 'emerald',
                    icon: Zap,
                    badge: 'Diferencial',
                    items: [
                        valueProp,
                        'Mínima invasión con pronta reincorporación',
                        'Trato humano, personalizado y seguimiento continuo',
                        'Diagnóstico certero con tecnología de punta'
                    ]
                },
                {
                    id: 'audiencia',
                    title: 'Audiencia & Captación',
                    color: 'amber',
                    icon: MessageSquare,
                    badge: 'Mercado',
                    items: [
                        targetAudience,
                        'Pacientes privados que valoran la rapidez y calidad',
                        'Ganchos para Reels: Casos clínicos reales y mitos de salud',
                        'Conversión: WhatsApp directo a agendamiento con triage'
                    ]
                }
            ]
        };
    }, [profile, clientName]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-5xl max-h-[90vh] bg-[#0A0A14] border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.2)] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
                                <Brain className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-white uppercase italic tracking-wider">
                                        Mapa Mental & Arquitectura Estratégica
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-bold text-indigo-400 uppercase">
                                        {clientName}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    Estructura de conocimiento médico, ángulos de contenido y fases de crecimiento
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Segmented View Selector */}
                            <div className="flex bg-black/60 border border-white/10 rounded-xl p-1">
                                <button
                                    onClick={() => setActiveTab('mindmap')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                        activeTab === 'mindmap'
                                            ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Mapa Mental
                                </button>
                                <button
                                    onClick={() => setActiveTab('roadmap')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                        activeTab === 'roadmap'
                                            ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Roadmap 3 Fases
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                        {activeTab === 'mindmap' && (
                            <div className="space-y-6">
                                {/* Center Core Node */}
                                <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-fuchsia-950/80 border border-indigo-500/30 rounded-2xl text-center shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[9px] font-black text-indigo-300 uppercase tracking-widest inline-block mb-2">
                                        {mindMapData.center.tag}
                                    </span>
                                    <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-wide">
                                        {mindMapData.center.title}
                                    </h2>
                                    <p className="text-xs text-gray-300 font-medium max-w-xl mx-auto mt-1">
                                        {mindMapData.center.subtitle}
                                    </p>
                                </div>

                                {/* 4 Connected Branches Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mindMapData.branches.map((branch) => {
                                        const Icon = branch.icon;
                                        const isSelected = selectedBranch === branch.id;
                                        return (
                                            <div
                                                key={branch.id}
                                                className={`p-4 rounded-2xl border transition-all ${
                                                    isSelected
                                                        ? 'bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-600/10'
                                                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <div 
                                                    onClick={() => setSelectedBranch(isSelected ? null : branch.id)}
                                                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-white/5"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-black text-white uppercase tracking-wider">
                                                                {branch.title}
                                                            </h4>
                                                            <span className="text-[9px] font-bold text-gray-500 uppercase">
                                                                {branch.badge}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : ''}`} />
                                                </div>

                                                <div className="mt-3 space-y-2">
                                                    {branch.items.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="p-2.5 bg-black/40 hover:bg-white/5 rounded-xl border border-white/5 flex items-start justify-between gap-3 text-xs text-gray-300 font-medium group transition-colors"
                                                        >
                                                            <span className="leading-relaxed flex-1">
                                                                • {item}
                                                            </span>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                <button
                                                                    onClick={() => handleCopy(item)}
                                                                    title="Copiar texto"
                                                                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                                                >
                                                                    {copiedItem === item ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                                </button>
                                                                {onOpenBrainWithPrompt && (
                                                                    <button
                                                                        onClick={() => {
                                                                            onOpenBrainWithPrompt(`Explícame a fondo este aspecto del perfil del Dr. y cómo potenciarlo: "${item}"`);
                                                                            onClose();
                                                                        }}
                                                                        title="Preguntar a DIIC Brain IA"
                                                                        className="p-1 hover:bg-indigo-500/20 rounded text-indigo-400"
                                                                    >
                                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'roadmap' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-0.5">
                                            Fase Actual del Negocio
                                        </span>
                                        <h4 className="text-sm font-black text-white uppercase italic">
                                            Nivel 2: Autoridad de Especialidad & Captación Calificada
                                        </h4>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">
                                        En Ejecución Activa
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { 
                                            step: '01', 
                                            title: 'Fase 1: Huella Digital & Blindaje de Marca', 
                                            desc: 'Auditoría omnicanal de Instagram, Web y Facebook para fijar la propuesta de valor única y eliminar fricción en la información del paciente.', 
                                            status: 'Completado', 
                                            color: 'emerald' 
                                        },
                                        { 
                                            step: '02', 
                                            title: 'Fase 2: Motor de Contenidos & Reels Educativos', 
                                            desc: 'Producción mensual de guiones enfocados en dolores articulares, artroscopia y testimonios reales con tono empático y científico.', 
                                            status: 'En Progreso', 
                                            color: 'indigo' 
                                        },
                                        { 
                                            step: '03', 
                                            title: 'Fase 3: Embudo de Conversión & Pauta Hiperlocal', 
                                            desc: 'Campañas dirigidas a pacientes privados con intención de agendamiento directo a WhatsApp mediante atención protocolizada.', 
                                            status: 'Planificado', 
                                            color: 'gray' 
                                        }
                                    ].map((phase, pIdx) => (
                                        <div key={pIdx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono font-black text-indigo-400">{phase.step}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                    phase.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                                    phase.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                                                    'bg-white/5 text-gray-500 border border-white/10'
                                                }`}>
                                                    {phase.status}
                                                </span>
                                            </div>
                                            <h5 className="text-sm font-bold text-white">{phase.title}</h5>
                                            <p className="text-xs text-gray-400 leading-relaxed">{phase.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-gray-500">
                        <span>💡 Haz clic en cualquier nodo para copiar el texto o usarlo en la estrategia.</span>
                        <button
                            onClick={onClose}
                            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
