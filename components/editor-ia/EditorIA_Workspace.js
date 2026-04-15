'use client';

import { useState } from 'react';
import { ArrowLeft, MonitorPlay, Wand2, UserCheck } from 'lucide-react';
import EditorIA_Entry from './EditorIA_Entry'; // Entry with 3 modes
import EditorIA_Config from './EditorIA_Config'; // Setup
import EditorIA_UploadZone from './EditorIA_UploadZone'; // Smart Scanner
import EditorIA_Analyzer from './sub/EditorIA_Analyzer'; // 12-Step Visualizer
import EditorIA_BlockEditor from './EditorIA_BlockEditor'; // The Block Editor
import EditorIA_OutputEngine from './EditorIA_OutputEngine'; // Export & Freemium Logic
import EditorIA_Generative from './EditorIA_Generative'; // Text to Video
import EditorIA_Delegate from './EditorIA_Delegate'; // Human Pro

export default function EditorIA_Workspace({ onBack }) {
    // MODES: 'TEMPLATE', 'GENERATIVE', 'DELEGATE'
    const [mode, setMode] = useState(null);
    const [step, setStep] = useState(0); // 0: Entry
    const [config, setConfig] = useState(null);

    // Flow Handlers
    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
        if (selectedMode === 'AI_TEMPLATES') setStep(1); // To Config
        if (selectedMode === 'TEXT_TO_VIDEO') setStep(10); // Generative Flow Start
        if (selectedMode === 'DELEGATE') setStep(20); // Delegate Flow Start
    };

    const handleConfigComplete = (conf) => {
        setConfig(conf);
        setStep(2); // Go to Upload
    };

    const handleUploadComplete = () => {
        setStep(3); // Go to Analyze
        // Simulate analysis time then move to editor
        setTimeout(() => {
            setStep(4);
        }, 8000);
    };

    // Handler for ending generic flows
    const handleFlowFinish = () => {
        // For now just back to entry or show a success message
        alert("¡Proceso Completado! Enviando a cola de producción.");
        setStep(0);
        setMode(null);
    };

    // RENDER STEPS
    return (
        <div className="min-h-screen pb-20">
            {/* Nav (Only show after Entry) */}
            {step > 0 && (
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <button
                        onClick={() => {
                            if (step === 1 || step === 10 || step === 20) {
                                setStep(0);
                                setMode(null);
                            } else {
                                setStep(prev => prev - 1);
                            }
                        }}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" /> Atrás
                    </button>

                    {/* DYNAMIC NAV BASED ON MODE */}
                    {mode === 'AI_TEMPLATES' && (
                        <div className="flex items-center gap-8">
                            <StepIndicator number={1} label="Estrategia" active={step >= 1} current={step === 1} />
                            <StepIndicator number={2} label="Scanner" active={step >= 2} current={step === 2} />
                            <StepIndicator number={3} label="Análisis" active={step >= 3} current={step === 3} />
                            <StepIndicator number={4} label="Edición" active={step >= 4} current={step === 4} />
                        </div>
                    )}

                    {mode === 'TEXT_TO_VIDEO' && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
                            <Wand2 className="w-3 h-3" /> Generación Mágica
                        </div>
                    )}

                    {mode === 'DELEGATE' && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest">
                            <UserCheck className="w-3 h-3" /> Equipo Humano
                        </div>
                    )}

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        {step === 4 ? (
                            <>
                                <MonitorPlay className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs font-bold text-white uppercase">Live Editor</span>
                            </>
                        ) : (
                            <>
                                <span className={`w-2 h-2 rounded-full animate-pulse ${step === 3 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                <span className="text-xs text-gray-400 font-mono">
                                    {step === 3 ? 'IA PROCESANDO...' : 'SISTEMA ONLINE'}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="h-[calc(100vh-180px)] animate-in fade-in duration-500">

                {/* STEP 0: ENTRY */}
                {step === 0 && <EditorIA_Entry onSelectMode={handleModeSelect} />}

                {/* --- MODE: AI TEMPLATES --- */}
                {mode === 'AI_TEMPLATES' && (
                    <>
                        {step === 1 && <EditorIA_Config onContinue={handleConfigComplete} />}
                        {step === 2 && (
                            <div className="max-w-6xl mx-auto h-[600px]">
                                <EditorIA_UploadZone onContinue={handleUploadComplete} />
                            </div>
                        )}
                        {step === 3 && (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-full max-w-4xl">
                                    <EditorIA_Analyzer />
                                </div>
                            </div>
                        )}
                        {step === 4 && <EditorIA_BlockEditor config={config} onFinish={() => setStep(5)} />}
                        {step === 5 && <EditorIA_OutputEngine userPlan="FREE" />}
                    </>
                )}

                {/* --- MODE: TEXT TO VIDEO --- */}
                {step === 10 && <EditorIA_Generative onBack={() => setStep(0)} onFinish={handleFlowFinish} />}

                {/* --- MODE: DELEGATE PRO --- */}
                {step === 20 && <EditorIA_Delegate onBack={() => setStep(0)} onFinish={handleFlowFinish} />}

            </div>
        </div>
    );
}

function StepIndicator({ number, label, active, current }) {
    return (
        <div className={`flex items-center gap-2 ${active ? 'text-white' : 'text-gray-600'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
                ${current ? 'bg-cyan-500 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]' :
                    active ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-transparent border-white/10'}`}
            >
                {number}
            </div>
            <span className={`hidden md:block text-[10px] font-bold uppercase tracking-wide ${current ? 'text-cyan-400' : ''}`}>{label}</span>
        </div>
    );
}
