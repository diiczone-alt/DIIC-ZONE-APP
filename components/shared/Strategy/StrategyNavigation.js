import React from 'react';
import { 
    Plus, Minus, RotateCcw, LayoutTemplate, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StrategyNavigation({ 
    handleZoomIn, 
    handleZoomOut, 
    handleZoomReset, 
    view,
    isCompactMode,
    onToggleCompactMode,
    onApplyTreeLayout = () => {},
    theme = 'dark'
}) {
    return (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Main Navigation Pod */}
            <div className={`backdrop-blur-3xl border p-2 rounded-[24px] flex flex-col items-center gap-1 transition-all duration-700 ${theme === 'dark' ? 'bg-[#0A0A0F]/80 border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] border-r-white/20' : 'bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                
                {/* 1. Zoom Controls */}
                <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={handleZoomIn}
                        className={`group relative p-3 rounded-2xl transition-all ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                        title="Zoom In (+)"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
                        
                        <div className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-2 border rounded-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[110] shadow-2xl ${theme === 'dark' ? 'bg-[#050511]/95 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ZOOM IN (+)</p>
                        </div>
                    </button>

                    <div className="h-8 flex items-center justify-center">
                        <span className="text-[10px] font-black text-indigo-400 rotate-90 uppercase tracking-tighter w-10 text-center">
                            {Math.round((view?.scale || 1) * 100)}%
                        </span>
                    </div>

                    <button 
                        onClick={handleZoomOut}
                        className={`group relative p-3 rounded-2xl transition-all ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                        title="Zoom Out (-)"
                    >
                        <Minus className="w-4 h-4 transition-transform group-hover:scale-110" />
                        
                        <div className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-2 border rounded-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[110] shadow-2xl ${theme === 'dark' ? 'bg-[#050511]/95 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ZOOM OUT (-)</p>
                        </div>
                    </button>
                </div>

                <div className="w-6 h-[1px] bg-white/5 mx-auto my-1" />

                {/* 3. Reset View */}
                <button 
                    onClick={handleZoomReset}
                    className={`group relative p-3 rounded-2xl transition-all ${theme === 'dark' ? 'text-gray-500/40 hover:text-white hover:bg-white/5' : 'text-slate-300 hover:text-slate-900 hover:bg-slate-50'}`}
                    title="Restablecer Vista"
                >
                    <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:rotate-[-45deg]" />
                    
                    <div className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-2 border rounded-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[110] shadow-2xl ${theme === 'dark' ? 'bg-[#050511]/95 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>CENTRAR VISTA</p>
                    </div>
                </button>
            </div>

            {/* Indicator Pod: Optional but looks premium */}
            <div className={`backdrop-blur-xl border p-2 rounded-2xl flex flex-col items-center gap-1 shadow-xl transition-all duration-700 ${theme === 'dark' ? 'bg-[#0A0A0F]/60 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${view?.scale > 1.2 ? 'bg-amber-400' : view?.scale < 0.6 ? 'bg-cyan-400' : 'bg-emerald-400'} shadow-[0_0_10px_currentColor] animate-pulse`} />
                <span className={`text-[7px] font-black uppercase tracking-widest vertical-text transition-colors duration-500 ${theme === 'dark' ? 'text-gray-600' : 'text-slate-300'}`}>NAV</span>
            </div>
        </div>
    );
}
