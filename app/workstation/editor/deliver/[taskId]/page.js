'use client';

import { use, useState } from 'react';
// ... (rest of imports)

export default function DeliverPage({ params }) {
    const { taskId } = use(params);
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Type, 2: Config, 3: QC & Upload
    const [checklist, setChecklist] = useState({
        hook: false, rhythm: false, branding: false, audio: false, subtitles: false
    });

    const isChecklistComplete = Object.values(checklist).every(Boolean);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">

            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-white mb-2">Nueva Entrega</h1>
                    <p className="text-gray-400">Revisión y subida de material final.</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <Step number={1} label="Tipo" active={step >= 1} current={step === 1} />
                    <div className={`w-12 h-px ${step >= 2 ? 'bg-purple-500' : 'bg-white/10'}`} />
                    <Step number={2} label="Config" active={step >= 2} current={step === 2} />
                    <div className={`w-12 h-px ${step >= 3 ? 'bg-purple-500' : 'bg-white/10'}`} />
                    <Step number={3} label="QC & Upload" active={step >= 3} current={step === 3} />
                </div>

                {/* Content */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-8 relative overflow-hidden">

                    {/* Step 1: Type */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-2 gap-4">
                            <OptionCard
                                icon={FileVideo}
                                title="Preview (Baja)"
                                desc="Para revisión rápida de estructura y contenido."
                                onClick={() => setStep(2)}
                            />
                            <OptionCard
                                icon={UploadCloud}
                                title="Render Final (Alta)"
                                desc="Versión master para cliente o publicación."
                                onClick={() => setStep(2)}
                                recommended
                            />
                            <OptionCard
                                icon={Music}
                                title="Solo Audio"
                                desc="Voiceover o mezcla separada."
                                onClick={() => setStep(2)}
                            />
                        </motion.div>
                    )}

                    {/* Step 2: Config */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-400">Formato</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <SelectBadge label="9:16 (Story/Reel)" active />
                                    <SelectBadge label="1:1 (Post)" />
                                    <SelectBadge label="16:9 (Youtube)" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-400">Extras</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="accent-purple-500" defaultChecked />
                                        <span className="text-sm text-gray-300">Subs Quemados</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="accent-purple-500" />
                                        <span className="text-sm text-gray-300">Marca de Agua</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    Siguiente <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: QC & Upload */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">

                            {/* QC Checklist */}
                            <div className="bg-purple-500/5 border border-purple-500/10 p-6 rounded-xl">
                                <h3 className="text-sm font-bold text-purple-300 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Quality Check Obligatorio
                                </h3>
                                <div className="space-y-3">
                                    <Checkbox label="Gancho fuerte en 0-3s" checked={checklist.hook} onChange={() => setChecklist(p => ({ ...p, hook: !p.hook }))} />
                                    <Checkbox label="Ritmo dinámico (sin espacios muertos)" checked={checklist.rhythm} onChange={() => setChecklist(p => ({ ...p, rhythm: !p.rhythm }))} />
                                    <Checkbox label="Branding correcto (Logos/Colores)" checked={checklist.branding} onChange={() => setChecklist(p => ({ ...p, branding: !p.branding }))} />
                                    <Checkbox label="Audio limpio y nivelado (-6db)" checked={checklist.audio} onChange={() => setChecklist(p => ({ ...p, audio: !p.audio }))} />
                                    <Checkbox label="Subtítulos en zona segura" checked={checklist.subtitles} onChange={() => setChecklist(p => ({ ...p, subtitles: !p.subtitles }))} />
                                </div>
                            </div>

                            {/* Dropzone */}
                            <div className={`
                                border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all
                                ${isChecklistComplete ? 'border-gray-600 hover:border-white hover:bg-white/5 cursor-pointer' : 'border-gray-800 opacity-50 cursor-not-allowed'}
                            `}>
                                <UploadCloud className="w-10 h-10 text-gray-500 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-1">Arrastra tu archivo aquí</h3>
                                {isChecklistComplete ? (
                                    <p className="text-gray-500 text-sm">o haz click para seleccionar</p>
                                ) : (
                                    <p className="text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3" /> Completa el QC primero
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-white">Atrás</button>
                                {isChecklistComplete && (
                                    <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                                        Subir y Notificar
                                    </button>
                                )}
                            </div>

                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
}

function Step({ number, label, active, current }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${active ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'
                } ${current ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}`}>
                {number}
            </div>
            <span className={`text-xs font-bold uppercase ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
        </div>
    );
}

function OptionCard({ icon: Icon, title, desc, onClick, recommended }) {
    return (
        <button onClick={onClick} className="text-left p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group relative overflow-hidden">
            {recommended && <div className="absolute top-0 right-0 px-2 py-1 bg-purple-600 text-[10px] font-bold text-white rounded-bl-lg">RECOMENDADO</div>}
            <Icon className="w-8 h-8 text-gray-400 group-hover:text-purple-400 mb-4 transition-colors" />
            <h3 className="font-bold text-white mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </button>
    );
}

function SelectBadge({ label, active }) {
    return (
        <div className={`px-4 py-3 rounded-lg border text-sm font-bold text-center cursor-pointer transition-all ${active ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}>
            {label}
        </div>
    );
}

function Checkbox({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-purple-500/5 rounded-lg transition-colors">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-purple-500 border-purple-500' : 'border-gray-600 group-hover:border-purple-400'
                }`}>
                {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={`text-sm transition-colors ${checked ? 'text-purple-200' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
        </label>
    );
}
