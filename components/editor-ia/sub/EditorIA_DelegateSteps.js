'use client';

import {
    Clapperboard, Target, Zap, Clock, Maximize, UploadCloud,
    Layers, PenTool, CheckCircle2, MessageSquare, Music, Image as ImageIcon, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- SHARED UTILS ---
const OptionCard = ({ label, icon: Icon, selected, onClick, desc }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={`p-4 rounded-2xl border text-left flex flex-col h-full w-full transition-all
            ${selected
                ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                : 'bg-[#1A1A24] border-white/5 hover:border-white/20'}`}
    >
        {Icon && <Icon className={`w-8 h-8 mb-4 ${selected ? 'text-orange-400' : 'text-gray-500'}`} />}
        <h3 className={`font-bold uppercase tracking-wide text-sm mb-1 ${selected ? 'text-white' : 'text-gray-300'}`}>{label}</h3>
        {desc && <p className="text-xs text-gray-500">{desc}</p>}
    </motion.button>
);

// --- STEPS ---

export const StepType = ({ value, onChange }) => {
    const options = [
        { id: 'REEL', label: 'Reel / TikTok', icon: Clapperboard, desc: '9:16 Vertical, dinámico.' },
        { id: 'TESTIMONIAL', label: 'Testimonial', icon: MessageSquare, desc: 'Caso de éxito, entrevista.' },
        { id: 'PROMO', label: 'Promocional', icon: Zap, desc: 'Venta directa de producto.' },
        { id: 'CORPORATE', label: 'Corporativo', icon: Layers, desc: 'Branding, institucional.' },
        { id: 'EVENT', label: 'Evento / Recap', icon: Clock, desc: 'Resumen high-energy.' },
        { id: 'PODCAST', label: 'Podcast / Clip', icon: MessageSquare, desc: 'Fragmento de entrevista.' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {options.map(opt => (
                <OptionCard
                    key={opt.id}
                    {...opt}
                    selected={value === opt.id}
                    onClick={() => onChange(opt.id)}
                />
            ))}
        </div>
    );
};

export const StepObjective = ({ value, onChange }) => {
    const options = [
        { id: 'REACH', label: 'Alcance / Viralidad', icon: Zap },
        { id: 'MESSAGE', label: 'Msjs WhatsApp', icon: MessageSquare },
        { id: 'SALES', label: 'Ventas Directas', icon: Target },
        { id: 'AUTHORITY', label: 'Autoridad / Marca', icon: CheckCircle2 },
    ];
    return (
        <div className="grid grid-cols-2 gap-4">
            {options.map(opt => (
                <OptionCard
                    key={opt.id}
                    {...opt}
                    selected={value === opt.id}
                    onClick={() => onChange(opt.id)}
                />
            ))}
        </div>
    );
};

export const StepStyle = ({ value, onChange }) => {
    const options = [
        { id: 'PREMIUM', label: 'Premium Corp', icon: Layers },
        { id: 'TRENDY', label: 'Tendencia / Dinámico', icon: Zap },
        { id: 'EMOTIONAL', label: 'Emocional', icon: MessageSquare },
        { id: 'MINIMAL', label: 'Minimal / Clean', icon: CheckCircle2 },
    ];
    return (
        <div className="grid grid-cols-2 gap-4">
            {options.map(opt => (
                <OptionCard
                    key={opt.id}
                    {...opt}
                    selected={value === opt.id}
                    onClick={() => onChange(opt.id)}
                />
            ))}
        </div>
    );
};

export const StepFormat = ({ value, onChange }) => {
    const durations = ['15s', '30s', '45s', '60s', '2-5 min'];
    const ratios = ['9:16 (Vertical)', '16:9 (Horizontal)', '1:1 (Cuadrado)', '4:5 (Portrait)'];

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-3">Duración Estimada</label>
                <div className="flex flex-wrap gap-3">
                    {durations.map(d => (
                        <button
                            key={d}
                            onClick={() => onChange({ ...value, duration: d })}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all
                                ${value.duration === d ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-3">Relación de Aspecto</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {ratios.map(r => (
                        <button
                            key={r}
                            onClick={() => onChange({ ...value, ratio: r })}
                            className={`p-3 rounded-lg text-xs font-bold border transition-all text-center
                                ${value.ratio === r ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        >
                            <Maximize className="w-4 h-4 mx-auto mb-2" />
                            {r}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const StepUploads = () => {
    const folders = [
        { name: '01_RAW Principal', icon: Clapperboard, count: 0 },
        { name: '01_RAW Apoyo (B-Roll)', icon: Layers, count: 0 },
        { name: '02_AUDIO', icon: Music, count: 0 },
        { name: '03_BRAND', icon: ImageIcon, count: 0 },
    ];

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">La app organiza tus archivos automáticamente en estas carpetas.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {folders.map(f => (
                    <div key={f.name} className="p-4 rounded-xl border border-dashed border-white/20 hover:bg-white/5 transition-colors cursor-pointer group flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                            <f.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{f.name}</h4>
                            <span className="text-xs text-gray-500">Arrastra archivos aquí</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StepGuide = ({ value, onChange, onAssistant }) => {
    return (
        <div className="space-y-6">
            {/* Assistant CTA */}
            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-cyan-500 text-black shadow-lg shadow-cyan-500/30">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">¿No sabes por dónde empezar?</h3>
                        <p className="text-sm text-gray-400">Nuestro Asistente IA puede redactar la guía perfecta por ti en 1 minuto.</p>
                    </div>
                </div>
                <button
                    onClick={onAssistant}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-xl"
                >
                    ✨ Generar con Asistente
                </button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mensaje Clave</label>
                    <input
                        className="w-full bg-[#1A1A24] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none"
                        placeholder="Ej: Que entiendan que somos los más rápidos."
                        value={value.message || ''}
                        onChange={e => onChange({ ...value, message: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Instrucciones / Guion</label>
                    <textarea
                        className="w-full h-32 bg-[#1A1A24] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none resize-none"
                        placeholder="Detalles sobre textos, escenas, música, etc."
                        value={value.style_notes || ''}
                        onChange={e => onChange({ ...value, style_notes: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};
