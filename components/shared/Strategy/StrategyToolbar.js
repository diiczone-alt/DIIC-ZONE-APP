import React from 'react';
import { 
    MousePointer2, Plus, Link2, Trash2, FolderOpen, 
    Sparkles, StickyNote, PenTool, Type, Hand, Layout, CreditCard, BrainCircuit, Bot
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrategyToolbar({ 
    activeTool, 
    onToolChange,
    theme = 'dark'
}) {
    const tools = [
        // --- SELECTION & NAVIGATION ---
        { id: 'select', icon: MousePointer2, label: 'Select', desc: 'Move and edit nodes', category: 'base' },
        { id: 'hand', icon: Hand, label: 'Pan', desc: 'Move across canvas', category: 'base' },
        { id: 'connect', icon: Link2, label: 'Conectar', desc: 'Link strategic points', category: 'base' },
        
        // --- CREATION & CONNECTION ---
        { id: 'create', icon: Plus, label: 'Add Node', desc: 'Drop new node', category: 'add' },
        
        // --- INTELLIGENCE ---
        { id: 'ai', icon: BrainCircuit, label: 'Copiloto IA', desc: 'Sugerencias Inteligentes', category: 'ai' },
        { id: 'organize', icon: Sparkles, label: 'BARITA MÁGICA', desc: 'Ajustar y Organizar', category: 'ai' },
        { id: 'view-standard', icon: CreditCard, label: 'Vista Estándar', desc: 'Detailed Card View', category: 'view' },
        
        // --- ANNOTATION & DRAWING ---
        { id: 'note', icon: StickyNote, label: 'Sticky', desc: 'Quick annotation', category: 'draw' },
        { id: 'draw', icon: PenTool, label: 'Draw', desc: 'Freehand sketch', category: 'draw' },
        { id: 'text', icon: Type, label: 'Text', desc: 'Add labels', category: 'draw' },
        
        // --- SYSTEM ---
        { id: 'delete', icon: Trash2, label: 'Delete', desc: 'Remove elements', category: 'sys' },
        { id: 'folder', icon: FolderOpen, label: 'Vault', desc: 'Save and Manage', category: 'sys' }
    ];

    const getCategoryColor = (cat, active) => {
        if (!active) return theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600';
        switch(cat) {
            case 'ai': return (theme === 'dark' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30');
            case 'add': return (theme === 'dark' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30');
            case 'draw': return (theme === 'dark' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-amber-600 text-white shadow-xl shadow-amber-600/30');
            case 'sys': return (theme === 'dark' ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-rose-600 text-white shadow-xl shadow-rose-600/30');
            case 'view': return (theme === 'dark' ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]' : 'bg-sky-600 text-white shadow-xl shadow-sky-600/30');
            default: return (theme === 'dark' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30');
        }
    };

    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`backdrop-blur-3xl border p-2 rounded-[28px] flex items-center gap-1 transition-all duration-700 ${theme === 'dark' ? 'bg-[#0A0A0F]/80 border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] border-b-white/20' : 'bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                {/* 🛠️ Tools Group */}
                {tools.map((tool, index) => {
                    const isActive = activeTool === tool.id;
                    const isLastInGroup = index === 2 || index === 3 || index === 6 || index === 9;
                    
                    return (
                        <React.Fragment key={tool.id}>
                            <button
                                onClick={() => onToolChange(tool.id)}
                                className={`group relative p-3 rounded-[20px] transition-all duration-300 ${getCategoryColor(tool.category, isActive)}`}
                            >
                                <tool.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
                                
                                {/* Professional Tooltip */}
                                <div className={`absolute bottom-full mb-5 left-1/2 -translate-x-1/2 px-3 py-2.5 backdrop-blur-xl border rounded-2xl opacity-0 translate-y-[10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none whitespace-nowrap z-[110] shadow-2xl ${theme === 'dark' ? 'bg-[#050511]/95 border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
                                    <div className="flex flex-col items-center">
                                       <div className={`px-2 py-0.5 rounded-full mb-1.5 border ${isActive ? (theme === 'dark' ? 'bg-indigo-500/20 border-indigo-500/10' : 'bg-indigo-50 border-indigo-200') : (theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200')}`}>
                                          <p className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${isActive ? (theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600') : (theme === 'dark' ? 'text-gray-400' : 'text-slate-400')}`}>{tool.label}</p>
                                       </div>
                                       <p className={`text-[9px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>{tool.desc}</p>
                                    </div>
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${theme === 'dark' ? 'border-t-[#050511]/95' : 'border-t-white'}`} />
                                </div>

                                {isActive && (
                                    <motion.div 
                                        layoutId="toolbar-dot"
                                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-white shadow-[0_0_10px_white]' : 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]'}`} 
                                    />
                                )}
                            </button>
                            {isLastInGroup && <div className={`w-[1px] h-6 mx-1 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`} />}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
