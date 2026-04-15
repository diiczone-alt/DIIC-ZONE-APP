'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, User, Music, Layout,
    Target, Clock, CheckCircle2, Play,
    MessageSquare, AlertCircle, Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';

export default function EditingGuideBuilder({ projectId, onSave }) {
    const [step, setStep] = useState(1);
    const [guide, setGuide] = useState({
        format: '9:16', // 9:16, 1:1, 16:9
        duration: '30s',
        objective: 'CONVERSION', // AWARENESS, CONVERSION, AUTHORITY
        style: 'DYNAMIC', // DYNAMIC, CORPORATE, EMOTIONAL
        hook: '',
        cta: '',
        musicRef: '',
        subtitles: true,
        logo: true,
        notes: ''
    });

    const formats = [
        { id: '9:16', label: 'Reel / TikTok', icon: Layout },
        { id: '1:1', label: 'Cuadrado / Feed', icon: Layout },
        { id: '16:9', label: 'YouTube / Web', icon: Layout },
    ];

    const styles = [
        { id: 'DYNAMIC', label: 'Dinámico', desc: 'Rápido, transiciones, cortes.' },
        { id: 'CORPORATE', label: 'Corporativo', desc: 'Limpio, serio, confiable.' },
        { id: 'EMOTIONAL', label: 'Emotivo', desc: 'Lento, música suave, storytelling.' },
    ];

    const handleSubmit = () => {
        if (!guide.hook || !guide.cta) {
            toast.error('Faltan campos obligatorios (Gancho o CTA)');
            return;
        }

        toast.success('Guía de Edición creada y asignada al Editor');
        onSave && onSave(guide);
    };

    return (
        <div className="bg-[#0A0A12] border border-white/10 rounded-3xl overflow-hidden mt-6">
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Guía de Edición</h2>
                        <p className="text-xs text-gray-400">Define la estrategia para el editor. Sin ambigüedades.</p>
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT: Strategy & Format */}
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">1. Formato & Objetivo</label>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {formats.map(fmt => (
                                <button
                                    key={fmt.id}
                                    onClick={() => setGuide({ ...guide, format: fmt.id })}
                                    className={`p-3 rounded-xl border text-center transition-all ${guide.format === fmt.id
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="text-sm font-bold">{fmt.id}</div>
                                    <div className="text-[10px] opacity-70">{fmt.label}</div>
                                </button>
                            ))}
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-300">Duración Aprox.</span>
                                <input
                                    type="text"
                                    value={guide.duration}
                                    onChange={(e) => setGuide({ ...guide, duration: e.target.value })}
                                    className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-right text-sm text-white w-20 outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-300">Objetivo</span>
                                <select
                                    value={guide.objective}
                                    onChange={(e) => setGuide({ ...guide, objective: e.target.value })}
                                    className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-right text-xs text-white outline-none focus:border-blue-500"
                                >
                                    <option value="AWARENESS">Alcance / Viralidad</option>
                                    <option value="CONVERSION">Venta / Conversión</option>
                                    <option value="AUTHORITY">Autoridad / Confianza</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">2. Estilo de Edición</label>
                        <div className="space-y-2">
                            {styles.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setGuide({ ...guide, style: s.id })}
                                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${guide.style === s.id
                                            ? 'bg-blue-500/20 border-blue-500 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div>
                                        <div className="text-sm font-bold">{s.label}</div>
                                        <div className="text-[10px] opacity-70">{s.desc}</div>
                                    </div>
                                    {guide.style === s.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Content & Assets */}
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">3. Estructura del Guion</label>

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-red-400 font-bold text-xs">GANCHO (HOOK)</div>
                                <textarea
                                    className="w-full bg-[#050511] border border-white/10 rounded-xl pt-8 pb-3 px-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 min-h-[60px]"
                                    placeholder="Ej: ¿Sabías que el 80% de tus anuncios fallan por esto?"
                                    value={guide.hook}
                                    onChange={(e) => setGuide({ ...guide, hook: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute left-3 top-3 text-green-400 font-bold text-xs">LLAMADO A LA ACCIÓN (CTA)</div>
                                <textarea
                                    className="w-full bg-[#050511] border border-white/10 rounded-xl pt-8 pb-3 px-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-green-500/50 min-h-[60px]"
                                    placeholder="Ej: Agenda tu cita en el link de la bio."
                                    value={guide.cta}
                                    onChange={(e) => setGuide({ ...guide, cta: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">4. Recursos & Referencias</label>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Link de referencia musical / Spotify"
                                    className="bg-transparent border-b border-white/10 text-sm text-white w-full outline-none focus:border-blue-500 placeholder:text-gray-600"
                                    value={guide.musicRef}
                                    onChange={(e) => setGuide({ ...guide, musicRef: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={guide.subtitles}
                                        onChange={(e) => setGuide({ ...guide, subtitles: e.target.checked })}
                                        className="accent-blue-500"
                                    />
                                    <span className="text-xs text-gray-300">Incluir Subtítulos</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={guide.logo}
                                        onChange={(e) => setGuide({ ...guide, logo: e.target.checked })}
                                        className="accent-blue-500"
                                    />
                                    <span className="text-xs text-gray-300">Logo Animado final</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        <User className="w-4 h-4" />
                        Asignar a Editor
                    </button>
                </div>
            </div>
        </div>
    );
}
