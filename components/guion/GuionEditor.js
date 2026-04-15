'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PenTool,
    Smartphone,
    Building,
    PlaySquare,
    MessageSquare,
    TrendingUp,
    BookOpen,
    Settings,
    ArrowRight,
    Wand2,
    CheckCircle2,
    Video,
    Type,
    Clock,
    Share2,
    Download,
    Layers
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const VIDEO_TYPES = [
    { id: 'promo_redes', icon: Smartphone, title: 'Promocional / Redes', desc: 'Engancha rápido y llama a la acción.' },
    { id: 'corporativo', icon: Building, title: 'Corporativo / Institucional', desc: 'Autoridad, procesos y confianza.' },
    { id: 'reel', icon: PlaySquare, title: 'Reel / Contenido corto', desc: 'Viralidad, tendencias y formato vertical.' },
    { id: 'testimonial', icon: MessageSquare, title: 'Testimonial', desc: 'Casos de éxito y prueba social.' },
    { id: 'ventas', icon: TrendingUp, title: 'Video de Ventas', desc: 'Estructura persuasiva para conversión.' },
    { id: 'educativo', icon: BookOpen, title: 'Educativo / Informativo', desc: 'Aportar valor y explicar conceptos.' },
    { id: 'personalizado', icon: Settings, title: 'Personalizado (Avanzado)', desc: 'Define todo desde cero.' }
];

const QUESTIONNAIRES = {
    'promo_redes': [
        { id: 'audience', label: '¿Para quién es el video?', options: ['Público general', 'Clientes', 'Empresas'] },
        { id: 'duration', label: 'Duración:', options: ['15s', '30s', '60s'] },
        { id: 'platform', label: 'Plataforma:', options: ['Instagram', 'TikTok', 'Facebook'] },
        { id: 'objective', label: 'Objetivo principal:', options: ['Vender', 'Atraer', 'Informar'] },
        { id: 'cta', label: '¿Tiene oferta o llamado a la acción?', options: ['Sí', 'No'] }
    ],
    'corporativo': [
        { id: 'audience', label: '¿Quién verá este video institucional?', options: ['Nuevos Clientes', 'Inversores', 'Talento Interno'] },
        { id: 'duration', label: 'Duración estimada:', options: ['60s', '2-3 min', 'Más de 3 min'] },
        { id: 'focus', label: 'Enfoque principal:', options: ['Historia', 'Instalaciones', 'Equipo'] }
    ],
    // Default fallback
    'default': [
        { id: 'audience', label: '¿Para quién es el video?', options: ['Público general', 'Nicho específico'] },
        { id: 'duration', label: 'Duración:', options: ['Corta', 'Media', 'Larga'] },
        { id: 'objective', label: 'Objetivo:', options: ['Conversión', 'Brand Awareness'] }
    ]
};

const generateSimulatedScript = (type, answers) => {
    if (type === 'promo_redes') {
        return [
            { id: `b1_${Date.now()}`, type: 'ESCENA 1 - GANCHO', time: '0-3s', text: '¿Sabías que la mayoría de personas pierden dinero por no saber esto?', visual: 'Primer plano dinámico, texto grande en pantalla llamativo.' },
            { id: `b2_${Date.now()}`, type: 'ESCENA 2 - PROBLEMA', time: '3-10s', text: `Muchos buscan resultados para ${answers.audience || 'su negocio'}, pero siguen cometiendo exactamente los mismos errores.`, visual: 'Situación cotidiana que ilustra el error común, persona luciendo frustrada.' },
            { id: `b3_${Date.now()}`, type: 'ESCENA 3 - SOLUCIÓN', time: '10-22s', text: 'AQUÍ ESTÁ LA MAGIA. En [Tu Marca/Empresa], hacemos esto completamente diferente gracias a nuestra metodología exclusiva.', visual: 'Producto o servicio en acción, cortes rápidos y modernos.' },
            { id: `b4_${Date.now()}`, type: 'ESCENA 4 - CTA', time: '22-30s', text: answers.cta === 'Sí' ? 'No esperes más. Haz clic en el enlace, escríbenos ahora y recibe una oferta especial.' : 'Guarda este video para más tarde y síguenos para más consejos como este.', visual: 'Pantalla final con tu Logo brillante y contacto claro.' }
        ];
    } else if (type === 'corporativo') {
        return [
            { id: `c1_${Date.now()}`, type: 'INTRODUCCIÓN INSTITUCIONAL', time: '0-15s', text: 'Durante más de una década, hemos liderado la transformación en nuestro sector.', visual: 'Tomas aéreas corporativas (dron) y empleados sonriendo en oficinas modernas.' },
            { id: `c2_${Date.now()}`, type: 'QUÉ HACEMOS', time: '15-40s', text: 'Nos especializamos en brindar soluciones integrales, de principio a fin, para garantizar calidad absoluta.', visual: 'Secuencias fluidas de los procesos de trabajo y reuniones de equipo.' },
            { id: `c3_${Date.now()}`, type: 'CÓMO LO HACEMOS / DIFERENCIAL', time: '40-55s', text: 'Nuestra diferencia principal radica en la capacidad técnica y el nivel humano de nuestro equipo.', visual: 'Close up a la tecnología o software utilizado. Transiciones limpias.' },
            { id: `c4_${Date.now()}`, type: 'CIERRE EMOCIONAL', time: '55-60s', text: 'Crecemos moldeando el futuro de tu negocio. ¿Empezamos un proyecto juntos?', visual: 'Logo fundiéndose en negro, con página web y credibilidad.' }
        ];
    }
    return [
        { id: `x1_${Date.now()}`, type: 'INTRODUCCIÓN', time: '0-5s', text: 'Hola, bienvenidos a este nuevo formato donde exploraremos tendencias.', visual: 'Plano frontal de la persona hablando (Talking head).' },
        { id: `x2_${Date.now()}`, type: 'DESARROLLO', time: '5-20s', text: 'Existen tres elementos cruciales que cambiarán tu perspectiva hoy...', visual: 'B-Roll de apoyo ilustrativo y texto cinemático superpuesto.' },
        { id: `x3_${Date.now()}`, type: 'DESPEDIDA', time: '20-30s', text: 'Comenta aquí abajo qué te pareció y compártelo.', visual: 'Outro con gráfica de suscripción animada.' }
    ];
};

export default function GuionEditor() {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [linkedBlocks, setLinkedBlocks] = useState({});
    const [isProduccionSent, setIsProduccionSent] = useState(false);

    const handleSelectType = (id) => {
        setSelectedType(id);
        setAnswers({}); // reset
        setStep(2);
    };

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI Load
        setTimeout(() => {
            const newBlocks = generateSimulatedScript(selectedType, answers);
            setBlocks(newBlocks);
            setIsGenerating(false);
            setStep(3);
        }, 2000);
    };

    const updateBlock = (id, field, value) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const currentQuestions = selectedType
        ? (QUESTIONNAIRES[selectedType] || QUESTIONNAIRES['default'])
        : [];

    const allQuestionsAnswered = currentQuestions.every(q => answers[q.id]);

    return (
        <div className="w-full h-full flex flex-col p-8 bg-zinc-950/40 custom-scrollbar overflow-y-auto">

            {/* Header */}
            <div className="mb-10 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-4 text-sm font-medium">
                    <PenTool size={16} />
                    <span>Módulo Guion IA</span>
                </div>

                {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
                            ¿Qué tipo de video vas a crear hoy?
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            No te preocupes por la estructura, nosotros nos encargamos.
                        </p>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
                            Dame un poco de contexto
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Solo un par de clics para darle dirección a la IA. Cero estrés.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Stepper Content */}
            <div className="flex-1 w-full max-w-5xl mx-auto">
                <AnimatePresence mode="wait">

                    {/* STEP 1: SELECT TYPE */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {VIDEO_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => handleSelectType(type.id)}
                                        className="group flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                            <Icon size={32} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{type.title}</h3>
                                        <p className="text-sm text-zinc-400">{type.desc}</p>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* STEP 2: CONTEXT QUESTIONS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="max-w-2xl mx-auto w-full space-y-8"
                        >
                            <div className="space-y-6">
                                {currentQuestions.map((q, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={q.id}
                                        className="bg-white/5 border border-white/5 p-6 rounded-2xl"
                                    >
                                        <h3 className="text-zinc-200 text-lg font-medium mb-4">{q.label}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {q.options.map(opt => {
                                                const isSelected = answers[q.id] === opt;
                                                return (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleAnswer(q.id, opt)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${isSelected
                                                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                            : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-zinc-200 hover:border-white/10'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    Volver
                                </button>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!allQuestionsAnswered || isGenerating}
                                    className={`relative flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${!allQuestionsAnswered || isGenerating
                                        ? 'bg-white/10 text-zinc-500 cursor-not-allowed border border-white/5'
                                        : 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-400 hover:scale-[1.02] border border-indigo-400/50'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Generando Magia...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 size={18} />
                                            <span>Generar Guion Automático</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3 & 4: SCRIPT EDITOR & CONNECTIVITY */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col mb-10 shadow-2xl"
                        >
                            {/* Toolbar Export/Sync */}
                            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={20} className="text-emerald-500" />
                                    <span className="text-white font-medium">Guion Estructurado</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsProduccionSent(true)}
                                        className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-lg 
                                            ${isProduccionSent ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-transparent'}`}
                                    >
                                        {isProduccionSent ? <CheckCircle2 size={16} /> : <Layers size={16} />}
                                        {isProduccionSent ? 'Enviado a Producción' : 'Enviar a Producción'}
                                    </button>
                                    <button className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Blocks Editor */}
                            <div className="p-6 space-y-6 bg-black/20">
                                {blocks.map((block, idx) => (
                                    <div key={block.id} className="group flex gap-4 bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-colors">

                                        {/* Number Badge */}
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>

                                        {/* Editable Fields */}
                                        <div className="flex-1 space-y-4">

                                            {/* Header row */}
                                            <div className="flex items-center gap-4">
                                                <input
                                                    value={block.type}
                                                    onChange={(e) => updateBlock(block.id, 'type', e.target.value)}
                                                    className="bg-transparent text-lg font-bold text-white outline-none focus:border-b focus:border-indigo-500/50 flex-1 px-1 py-0.5"
                                                    placeholder="Nombre de la escena"
                                                />
                                                <div className="flex items-center gap-1.5 text-zinc-500">
                                                    <Clock size={14} />
                                                    <input
                                                        value={block.time}
                                                        onChange={(e) => updateBlock(block.id, 'time', e.target.value)}
                                                        className="w-16 bg-transparent text-sm outline-none text-right px-1"
                                                    />
                                                </div>
                                            </div>

                                            {/* Text/Voiceover */}
                                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Type size={14} className="text-emerald-400" />
                                                    <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">Texto / Locución</span>
                                                </div>
                                                <textarea
                                                    value={block.text}
                                                    onChange={(e) => updateBlock(block.id, 'text', e.target.value)}
                                                    className="w-full bg-transparent text-zinc-300 resize-none outline-none leading-relaxed min-h-[60px]"
                                                />
                                            </div>

                                            {/* Visuals */}
                                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Video size={14} className="text-cyan-400" />
                                                    <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">Visual Sugerido</span>
                                                </div>
                                                <textarea
                                                    value={block.visual}
                                                    onChange={(e) => updateBlock(block.id, 'visual', e.target.value)}
                                                    className="w-full bg-transparent text-zinc-400 resize-none outline-none leading-relaxed text-sm min-h-[40px]"
                                                />
                                            </div>

                                            {/* Link to Bosquejo / Actions */}
                                            <div className="pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setLinkedBlocks(prev => ({ ...prev, [block.id]: { ...(prev[block.id] || {}), bosquejo: true } }))}
                                                    className={`text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors
                                                        ${linkedBlocks[block.id]?.bosquejo ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-indigo-400 hover:text-indigo-300 bg-indigo-500/10'}`}
                                                >
                                                    {linkedBlocks[block.id]?.bosquejo ? <CheckCircle2 size={12} /> : <PenTool size={12} />}
                                                    {linkedBlocks[block.id]?.bosquejo ? 'Vinculado a Escena' : 'Abrir escena en Bosquejo'}
                                                </button>
                                                <button
                                                    onClick={() => setLinkedBlocks(prev => ({ ...prev, [block.id]: { ...(prev[block.id] || {}), cm: true } }))}
                                                    className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors flex items-center gap-1.5
                                                        ${linkedBlocks[block.id]?.cm ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-zinc-500 hover:text-white bg-white/5'}`}
                                                >
                                                    {linkedBlocks[block.id]?.cm && <CheckCircle2 size={12} />}
                                                    {linkedBlocks[block.id]?.cm ? 'Copy Aprobado' : 'Marcar como Copy CM'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Actions Footer */}
                                <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-6">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-zinc-400 hover:text-white text-sm"
                                    >
                                        Descartar y crear otro
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                            <Wand2 size={16} /> Optimizar Conversión
                                        </button>
                                        <button className="px-4 py-2 border border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                            Adaptar a TikTok
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
