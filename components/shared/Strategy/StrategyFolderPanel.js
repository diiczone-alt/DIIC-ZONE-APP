'use client';
import React from 'react';
import { Save, Folders, X, LayoutTemplate, Copy, ChevronRight } from 'lucide-react';

export default function StrategyFolderPanel({ onClose, onSave, onSaveTemplate, onDuplicate, onOpenSaved }) {
    return (
        <div className="absolute left-[100px] top-[10%] bottom-[10%] w-80 bg-[#0A0A0F]/90 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col z-[80] overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Gestor Estratégico</p>
                    <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                <div className="space-y-2">
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest pl-2 mb-3">Acciones Actuales</p>
                    <button onClick={onSave} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(99,102,241,0.2)] transition-all text-left group">
                        <div className="p-2 rounded-xl bg-indigo-500/20 group-hover:bg-white/20 transition-colors">
                            <Save className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-white uppercase">Guardar Cambios</p>
                            <p className="text-[9px] text-gray-400 mt-0.5 group-hover:text-white/80">Sobrescribe la versión actual</p>
                        </div>
                    </button>

                    <button onClick={onSaveTemplate} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left group">
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/20 transition-colors">
                            <LayoutTemplate className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-white uppercase">Como Plantilla</p>
                            <p className="text-[9px] text-gray-500 mt-0.5 group-hover:text-white/80">Guarda para reusar después</p>
                        </div>
                    </button>
                    
                     <button 
                        onClick={onDuplicate} 
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all text-left group active:scale-[0.98]"
                    >
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">Duplicar Pizarra</p>
                            <p className="text-[9px] text-gray-700 mt-0.5 group-hover:text-gray-400 font-bold uppercase tracking-tighter">Clonación estratégica</p>
                        </div>
                    </button>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 space-y-2">
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest pl-2 mb-3">Gestión de Nivel 3</p>
                    <button 
                        onClick={onOpenSaved} 
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:-translate-y-1 transition-all text-left group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/20 transition-colors shadow-inner">
                                <Folders className="w-4 h-4 text-purple-400 group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-white uppercase tracking-tight">Mis Campañas</p>
                                <p className="text-[9px] text-purple-300/50 mt-0.5 group-hover:text-white/80 font-bold uppercase tracking-tighter">Explorar Repositorio</p>
                            </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>
        </div>
    );
}
