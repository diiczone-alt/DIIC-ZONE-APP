import React from 'react';
import { Save, PlayCircle, X, CheckCircle2, AlertTriangle, ArrowLeft, Minus, Plus, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AutomationTopBar({ 
    flowName, 
    status,
    // Zoom Props
    view,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    onViewChange,
    onSave,
    onPublish,
    onBack,
}) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [isPublishing, setIsPublishing] = React.useState(false);
    const [isSaved, setIsSaved] = React.useState(false);

    const handleSaveInternal = async () => {
        setIsSaving(true);
        setIsSaved(false);
        await onSave?.();
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 800);
    };

    const handlePublishInternal = async () => {
        setIsPublishing(true);
        await onPublish?.();
        setTimeout(() => {
            setIsPublishing(false);
        }, 1500);
    };

    return (
        <div className="h-[60px] bg-[#0A0A0F] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
            <div className="flex items-center gap-6">
                <button 
                    onClick={onBack}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-sm font-bold text-white leading-none">{flowName}</h1>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest text-amber-500">
                            {status}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black opacity-80">Sincronizado con CRM</span>
                    </div>
                </div>
            </div>

            {/* Center Section: Navigation Controls */}
            <div className="flex items-center gap-1 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-xl p-1 shadow-2xl">
                <button 
                    onClick={handleZoomOut} 
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-90" 
                    title="Zoom Out (-)"
                >
                    <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-[45px] text-center">
                    <span className="text-[10px] font-black text-indigo-400 tabular-nums">
                        {Math.round((view?.scale || 1) * 100)}%
                    </span>
                </div>
                <button 
                    onClick={handleZoomIn} 
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-90" 
                    title="Zoom In (+)"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3 bg-white/5 mx-1" />
                <button 
                    onClick={handleZoomReset} 
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-90" 
                    title="Reset View (0)"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={handleSaveInternal}
                    disabled={isSaving}
                    className={`h-9 px-4 border rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                        isSaved ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                        isSaving ? 'bg-white/5 border-white/5 text-gray-600' : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
                    }`}
                >
                    {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />}
                    <span>{isSaved ? 'Guardado' : isSaving ? 'Guardando...' : 'Guardar'}</span>
                </button>
                <button 
                    onClick={handlePublishInternal}
                    disabled={isPublishing}
                    className="h-9 px-6 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/50 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPublishing ? (
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <PlayCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{isPublishing ? 'Publicando...' : 'Publicar Flujo'}</span>
                </button>
            </div>
        </div>
    );
}
