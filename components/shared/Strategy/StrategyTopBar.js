'use client';

import React, { useState } from 'react';
import { 
    Save, Copy, Undo2, Redo2, Sparkles, Download, 
    Send, LayoutTemplate, MoreHorizontal, ChevronDown, Plus, RefreshCw, Folder, Filter, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Calendar,
    Minus, RotateCcw, ChevronUp, ChevronLeft, ChevronRight, LogOut, Sun, Moon, Box, Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StrategyTopBar({ 
    strategyName, 
    strategyStatus, 
    projectName,
    onSave,
    onSaveTemplate,
    onDuplicate,
    onUndo,
    onRedo,
    onGenerateAISuggestion,
    onExport,
    onSendToPlanner,
    isStrategySaved,
    hasContentPlan,
    isProcessingPlanner,
    onSendToCreativeStudio,
    activeFlow,
    view,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handlePan,
    strategyHealth,
    campaigns = [],
    activeCampaignId,
    onSelectCampaign,
    onCreateCampaign,
    onOpenFolder,
    onViewChange,
    isCompactMode,
    onToggleCompactMode,
    theme,
    onToggleTheme,
    onClose,
    onApplyTemplate,
    onAddProduct,
    onExportPDF
}) {
    const activeCampaign = campaigns.find(c => c.id === activeCampaignId);
    const [isCampaignMenuOpen, setIsCampaignMenuOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

    return (
        <>
            <header className={`h-24 border-b px-10 flex items-center justify-between z-[100] relative overflow-hidden pt-4 pb-2 transition-all duration-700 ${theme === 'dark' ? 'bg-[#0A0A0F]/60 backdrop-blur-3xl border-white/5' : 'bg-white/80 backdrop-blur-3xl border-slate-200'}`}>
                {/* Ambient Top Glow - Refined for better depth */}
                <div className={`absolute top-0 left-1/4 w-1/3 h-[1px] opacity-50 blur-[2px] pointer-events-none ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-400/30'}`} />
                <div className={`absolute top-0 left-0 w-full h-full pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-b from-indigo-500/[0.03] to-transparent' : 'bg-gradient-to-b from-slate-100/50 to-transparent'}`} />

                {/* Left Section: Info */}
                <div className="flex items-center gap-8 relative z-10">
                    {onClose ? (
                        <button 
                            onClick={onClose}
                            className="p-3 bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-2xl transition-all shadow-lg active:scale-95 group/back"
                            title="Volver al Workstation"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/';
                            }}
                            className="p-3 bg-rose-500/10 border border-white/5 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-lg active:scale-95 group/logout"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-5 h-5 group-hover/logout:rotate-12 transition-transform" />
                        </button>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-4">
                            <h1 className={`text-3xl font-[1000] italic uppercase tracking-[-0.05em] leading-none flex items-center gap-1 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                MASTER <span className="text-indigo-500">ADMIN</span>
                            </h1>
                            <div className="flex flex-col">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.15)] leading-none">
                                    ONLINE HUB
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-50 font-sans pl-1">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] leading-none">{strategyName || 'Gestión Maestro'}</p>
                            <div className="w-1.5 h-[1px] bg-indigo-500/30" />
                            <AnimatePresence mode="wait">
                                {isStrategySaved ? (
                                    <motion.span 
                                        key="saved" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }}
                                        className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.1em] flex items-center gap-1.5"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
                                        Sincronizado
                                    </motion.span>
                                ) : (
                                    <motion.span 
                                        key="saving" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }}
                                        className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em] flex items-center gap-1.5"
                                    >
                                        <RefreshCw className="w-3 h-3 animate-spin" /> LIVE_CLOUD
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Center Section: Dynamic Content */}
                <div className="flex-1 flex justify-center items-center px-4 relative z-10 pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key="title"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex flex-col items-center pointer-events-auto"
                        >
                            <h2 className={`text-xl font-black italic uppercase tracking-[0.2em] relative transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {activeFlow === 'campañas' && 'Mis Estrategias de Negocio'}
                                {activeFlow === 'analitica' && 'Inteligencia Estratégica'}
                                {activeFlow === 'nodos' && 'Librería de Componentes'}
                                {activeFlow === 'planner' && 'Planificador de Objetivos'}
                                {activeFlow === 'tablero' && 'Pizarra Operativa'}
                                <div className={`absolute -bottom-2 left-0 w-full h-px opacity-30 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent' : 'bg-gradient-to-r from-transparent via-indigo-600 to-transparent'}`} />
                            </h2>
                            <span className={`text-[8px] font-black uppercase tracking-[0.5em] mt-2 transition-colors duration-500 ${theme === 'dark' ? 'text-indigo-400/60' : 'text-slate-400/80'}`}>Diiczone Architecture Engine</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Left Section: Status & Manual Sync */}
                <div className="flex items-center gap-4 relative z-10">
                    <button 
                        onClick={onSave}
                        className={`px-4 py-3 rounded-2xl flex items-center gap-2 border transition-all active:scale-95 group/save ${
                            !isStrategySaved 
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-white pulse-glow' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}
                        title={isStrategySaved ? "Sincronización Completa" : "Hay cambios sin guardar"}
                    >
                        <Cloud className={`w-5 h-5 ${!isStrategySaved ? 'animate-bounce' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                            {isStrategySaved ? 'Bunker Sincronizado' : 'Guardar Bunker'}
                        </span>
                    </button>
                </div>

                {/* Right Section: Navigation & Actions */}
                <div className="flex items-center gap-4 relative z-10">
                    {/* Plantillas Button */}
                    <button 
                        onClick={() => onApplyTemplate('authority')}
                        className={`px-4 py-3 rounded-2xl flex items-center gap-2 border transition-all active:scale-95 group/template ${
                            theme === 'dark' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' 
                            : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title="Aplicar Plantilla Plan Autoridad"
                    >
                        <LayoutTemplate className="w-5 h-5 group-hover/template:rotate-12 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Plan Autoridad</span>
                    </button>

                    {/* Proactive Theme Toggle */}
                    <button 
                        onClick={onToggleTheme}
                        className={`p-3 rounded-2xl transition-all shadow-lg active:scale-95 group/theme flex items-center justify-center border ${
                            theme === 'dark' 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white' 
                            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 hover:bg-indigo-500 hover:text-white'
                        }`}
                        title={theme === 'dark' ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5 transition-transform group-hover/theme:rotate-90" /> : <Moon className="w-5 h-5 transition-transform group-hover/theme:-rotate-12" />}
                    </button>

                    {/* Master Save Button */}
                    <button 
                        onClick={onSave}
                        className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl relative overflow-hidden group/save ${
                            theme === 'dark'
                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/save:translate-x-[100%] transition-transform duration-1000" />
                        <Save className={`w-4 h-4 ${!isStrategySaved ? 'animate-bounce' : ''}`} />
                        <span>Desplegar Cambios</span>
                    </button>
                </div>
            </header>

            {/* Premium Validation Modal Overlay (Moved outside header to avoid overflow clipping) */}
            <AnimatePresence>
                {isValidationModalOpen && strategyHealth && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-hidden pointer-events-none">
                        {/* Backdrop with Blur */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#020205]/80 backdrop-blur-3xl pointer-events-auto" 
                            onClick={() => setIsValidationModalOpen(false)}
                        />
                        
                        {/* Modal Container */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`w-full max-w-[550px] border rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col pointer-events-auto transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0F] border-white/10' : 'bg-white border-slate-200'}`}
                        >
                            {/* Accent Glow */}
                            <div className={`absolute top-0 left-0 w-full h-1/2 opacity-20 pointer-events-none blur-[120px] ${
                                strategyHealth.status === 'optimo' ? 'bg-emerald-500' :
                                strategyHealth.status === 'mejora' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />

                            {/* Header With Close Button */}
                            <div className="p-10 pb-4 flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl relative ${
                                        strategyHealth.status === 'optimo' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                        strategyHealth.status === 'mejora' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                        'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-indigo-500/20'
                                    }`}>
                                        <div className="absolute inset-0 bg-current opacity-10 animate-pulse rounded-3xl" />
                                        {strategyHealth.status === 'optimo' ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black italic uppercase tracking-wider leading-tight transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Análisis del <br/>Embudo <span className={
                                            strategyHealth.status === 'optimo' ? 'text-emerald-500' :
                                            strategyHealth.status === 'mejora' ? 'text-amber-500' : 'text-rose-500'
                                        }>Estratégico</span></h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                strategyHealth.status === 'optimo' ? 'bg-emerald-500' :
                                                strategyHealth.status === 'mejora' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`} />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Engine_V.4.2_Diagnóstico</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsValidationModalOpen(false)} 
                                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center border border-white/10 group active:scale-95"
                                >
                                    <XCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-10 pt-4 space-y-8 relative z-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {/* Status Alert */}
                                <div className={`p-6 rounded-3xl border flex flex-col gap-2 ${
                                    strategyHealth.status === 'optimo' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                    strategyHealth.status === 'mejora' ? 'bg-amber-500/10 border-amber-500/20' :
                                    'bg-rose-500/10 border-rose-500/20'
                                }`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Conclusión de I.A.</span>
                                    <p className={`text-sm font-bold leading-relaxed transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                        {strategyHealth.status === 'optimo' 
                                            ? 'Tu estrategia está blindada y lista para producción. Todos los hitos críticos han sido validados.' 
                                            : strategyHealth.status === 'mejora'
                                            ? 'Hemos detectado oportunidades de optimización para aumentar el ROI proyectado.'
                                            : 'Alerta Crítica: El flujo presenta deficiencias que pondrán en riesgo la tasa de conversión.'
                                        }
                                    </p>
                                </div>

                                {/* Phases Tracking */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pl-1">Cobertura de Etapas</h4>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {strategyHealth?.phases && Object.entries(strategyHealth.phases).map(([phase, exists]) => (
                                            <div key={phase} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                exists 
                                                ? 'bg-emerald-500/[0.03] border-emerald-500/10' 
                                                : 'bg-rose-500/[0.03] border-rose-500/10 opacity-60'
                                            }`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                                                        exists ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 border-rose-500/20 text-rose-400'
                                                    }`}>
                                                        {exists ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    </div>
                                                    <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>{phase}</span>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-tighter ${exists ? 'text-emerald-500' : 'text-rose-500/50'}`}>
                                                    {exists ? 'VALIDADO' : 'MISSING'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Diagnostics */}
                                {(strategyHealth.errors.length > 0 || strategyHealth.warnings.length > 0) && (
                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pl-1">Alertas Detalladas</h4>
                                        <div className="space-y-3">
                                            {strategyHealth.errors.map((err, i) => (
                                                <div key={i} className="flex gap-4 p-5 bg-[#1a0a0f] rounded-2xl border border-rose-500/20 shadow-inner">
                                                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                                                    <p className="text-[11px] text-rose-200/80 font-bold leading-relaxed">{err}</p>
                                                </div>
                                            ))}
                                            {strategyHealth.warnings.map((warn, i) => (
                                                <div key={i} className="flex gap-4 p-5 bg-[#1a140a] rounded-2xl border border-amber-500/20 shadow-inner">
                                                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                                    <p className="text-[11px] text-amber-200/80 font-bold leading-relaxed">{warn}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Action */}
                            <div className="p-10 pt-4 relative z-10 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F] to-transparent">
                                <button 
                                    onClick={() => setIsValidationModalOpen(false)}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Entendido, Seguir Editando
                                </button>
                                <p className="text-center text-[9px] font-bold text-gray-600 mt-6 uppercase tracking-widest">
                                    DIICZONE ARCHITECTURE ENGINE
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
