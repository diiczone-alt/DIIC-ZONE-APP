'use client';

import {
    X, Save, Calendar, User, AlignLeft, CheckSquare, Paperclip,
    Trash2, ExternalLink, Clock, AlertCircle, DollarSign, Target, MapPin,
    LayoutList, Flag, Users, FileText, History, Box, ChevronRight, Sparkles,
    Briefcase, Zap, Rocket, Layers, ShieldCheck, ChevronDown, Plus, Edit3
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
    { id: 'summary', label: 'Proyecto', icon: Briefcase, color: 'text-cyan-400' },
    { id: 'brief', label: 'Briefing', icon: FileText, color: 'text-purple-400' },
    { id: 'tasks', label: 'Roadmap', icon: CheckSquare, color: 'text-amber-400' },
    { id: 'assign', label: 'Equipo', icon: Users, color: 'text-emerald-400' },
    { id: 'history', label: 'Log', icon: History, color: 'text-blue-400' },
];

export default function StrategyNodeEditor({ node, onClose, onUpdate, onDelete }) {
    const [data, setData] = useState(node.data);
    const [activeTab, setActiveTab] = useState('summary');
    const [newChecklistItem, setNewChecklistItem] = useState('');

    useEffect(() => {
        setData(node.data);
    }, [node]);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        setData(newData);
        onUpdate(node.id, newData);
    };

    const TabContent = () => {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {renderTabActive()}
                </motion.div>
            </AnimatePresence>
        );
    };

    const renderTabActive = () => {
        switch (activeTab) {
            case 'summary':
                return (
                    <div className="space-y-8">
                        {/* Title Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <div className="relative space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Nombre Estratégico</label>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-cyan-500/50 backdrop-blur-md transition-all">
                                    <Edit3 className="w-4 h-4 text-cyan-400" />
                                    <input 
                                        type="text" 
                                        value={data.title} 
                                        onChange={(e) => handleChange('title', e.target.value)} 
                                        className="w-full bg-transparent text-lg text-white font-black placeholder:text-gray-700 focus:outline-none"
                                        placeholder="Nombre del paso estratégico..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Estado Actual</label>
                                <div className="relative">
                                    <select 
                                        value={data.status} 
                                        onChange={(e) => handleChange('status', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white font-bold focus:outline-none focus:border-purple-500 appearance-none cursor-pointer hover:bg-white/10 transition-all"
                                    >
                                        <option value="Pendiente">⚪ Pendiente</option>
                                        <option value="En Progreso">🔵 En Progreso</option>
                                        <option value="En Aprobación">🟡 En Aprobación</option>
                                        <option value="Finalizado">🟢 Finalizado</option>
                                        <option value="Bloqueado">🔴 Bloqueado</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Nivel de Impacto</label>
                                <div className="relative">
                                    <select 
                                        value={data.priority || 'Media'} 
                                        onChange={(e) => handleChange('priority', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white font-bold focus:outline-none focus:border-amber-500 appearance-none cursor-pointer hover:bg-white/10 transition-all"
                                    >
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                        <option value="URGENTE">🔥 CRÍTICO</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Zap className="w-24 h-24 text-cyan-400" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5" /> Resumen Operativo
                                    </h4>
                                    {renderQuickFields()}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'brief':
                return (
                    <div className="space-y-8">
                        {/* Objetivo Maestro */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] flex items-center gap-2"> 
                                    <Target className="w-3.5 h-3.5" /> El Objetivo Maestro
                                </label>
                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">IA Optimized</span>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                <textarea 
                                    value={data.objective || ''} 
                                    onChange={(e) => handleChange('objective', e.target.value)} 
                                    rows={3} 
                                    placeholder="¿Cuál es el norte de este paso estratégico?" 
                                    className="relative w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 backdrop-blur-sm transition-all resize-none font-medium italic" 
                                />
                            </div>
                        </div>

                        {/* Descripción Detallada */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2"> 
                                <AlignLeft className="w-3.5 h-3.5" /> Protocolo de Ejecución
                            </label>
                            <textarea 
                                value={data.description || ''} 
                                onChange={(e) => handleChange('description', e.target.value)} 
                                rows={8} 
                                className="w-full bg-[#050511]/50 border border-white/10 rounded-2xl p-4 text-sm text-gray-400 focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-2xl leading-relaxed" 
                                placeholder="Describe con precisión los pasos a seguir..." 
                            />
                        </div>

                        {/* Asset Connections */}
                        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                            <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                        <Paperclip className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-white uppercase tracking-tighter italic">Vincular Activo</p>
                                        <p className="text-[10px] text-gray-500">Cloud, Scripts, Media</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                );

            case 'tasks':
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Roadmap de Tareas</h4>
                                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">Hitos del Proyecto</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-white">{Math.round(((data.checklist?.filter(Boolean).length || 0) / (data.checklist?.length || 1)) * 100)}%</span>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em]">Progreso Total</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {(data.checklist || []).map((item, i) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i} 
                                    className="flex items-center gap-3 p-4 bg-[#050511]/40 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group"
                                >
                                    <button className="w-6 h-6 rounded-lg border-2 border-white/10 flex items-center justify-center hover:border-amber-500 transition-all group-hover:scale-110">
                                        <div className="w-2 h-2 rounded-sm bg-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    </button>
                                    <span className="text-sm text-gray-300 flex-1 font-medium">{item}</span>
                                    <button className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                            
                            <div className="pt-4">
                                <PlusInput onAdd={(txt) => {
                                    const list = data.checklist || [];
                                    handleChange('checklist', [...list, txt]);
                                }} />
                            </div>
                        </div>
                    </div>
                );

            case 'assign':
                return (
                    <div className="space-y-8">
                        <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck className="w-16 h-16 text-indigo-400" />
                            </div>
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-2xl">
                                    <Users className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Delegación de Mando</h4>
                                    <p className="text-[11px] text-indigo-300/70 mt-1 leading-relaxed">Asigna un responsable único para asegurar la integridad de este proceso.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {['Community Manager', 'Filmmaker', 'Diseñador', 'Media Buyer'].map(itemRole => (
                                <button 
                                    key={itemRole} 
                                    onClick={() => handleChange('owner', itemRole)} 
                                    className={`p-4 rounded-2xl border-2 text-left transition-all relative group overflow-hidden ${data.owner === itemRole ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/5 text-gray-500 hover:border-indigo-500/30'}`}
                                >
                                    {data.owner === itemRole && (
                                        <motion.div layoutId="active-bg" className="absolute inset-0 bg-white" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                                    )}
                                    <div className="relative z-10 flex flex-col gap-1">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${data.owner === itemRole ? 'text-indigo-600' : 'text-gray-600'}`}>Rol DIIC</span>
                                        <span className="text-xs font-black italic uppercase tracking-tighter truncate">{itemRole}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {data.owner && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4 pt-6 mt-4 border-t border-white/10"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 group transition-all focus-within:border-emerald-500/50">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                        <div className="flex-1">
                                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Deadline Fatal</p>
                                            <input type="date" className="bg-transparent text-xs text-white w-full focus:outline-none font-bold" />
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40">
                                        Activar en Workstation
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <Rocket className="w-12 h-12 text-gray-800 animate-pulse" />
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Módulo en Desarrollo</h3>
                            <p className="text-[10px] text-gray-700">Explorando nuevas fronteras tecnológicas.</p>
                        </div>
                    </div>
                );
        }
    };

    const PlusInput = ({ onAdd }) => {
        const [val, setVal] = useState('');
        return (
            <div className="flex items-center gap-3 w-full bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-amber-500/50 transition-all">
                <input
                    type="text"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && val.trim()) {
                            onAdd(val);
                            setVal('');
                        }
                    }}
                    placeholder="Inyectar nuevo hito estratégico..."
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-700 font-medium"
                />
                <button 
                    onClick={() => { if (val.trim()) { onAdd(val); setVal(''); } }} 
                    className="p-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500 hover:text-black transition-all"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        );
    }

    const renderQuickFields = () => {
        if (node.type === 'ads') return (
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Presupuesto Sugerido</p>
                    <p className="text-xl font-black text-white italic">${data.budget || '0.00'}</p>
                </div>
            </div>
        );
        if (node.type === 'evento') return (
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Hito del Calendario</p>
                    <p className="text-xl font-black text-white italic">{data.date || 'Sin fecha'}</p>
                </div>
            </div>
        );
        return (
            <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                Carga la información técnica y creativa en la pestaña de <span className="text-purple-400 font-black">Briefing</span> para este componente.
            </p>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#050511]/90 backdrop-blur-3xl border-l border-white/10 text-white shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
            <style jsx="true">{`
                .custom-scrollbar-h::-webkit-scrollbar {
                    height: 2px;
                }
                .custom-scrollbar-h::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar-h::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    transition: all 0.3s;
                }
                .custom-scrollbar-h::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none"></div>

            {/* HEADER - NEW FUTURISTIC STYLE */}
            <div className="relative p-8 pb-6 border-b border-white/5 bg-white/5">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(8,145,178,0.3)] rotate-3">
                             <Rocket className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-black text-white bg-black/40 border border-white/10 px-2 py-0.5 rounded uppercase tracking-[0.2em]">{node.type}</span>
                                <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></div>
                                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.2em]">Live Node</span>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none" title={data.title}>
                                {data.title.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{data.title.split(' ').slice(1).join(' ')}</span>
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all hover:rotate-90">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* TABS SELECTOR - GLASS STYLE WITH MASK */}
                <div className="relative mt-2">
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0E0E18] to-transparent z-20 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#0E0E18] to-transparent z-20 pointer-events-none" />
                    
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-h py-3 px-4 relative z-10 scroll-smooth">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 border-2 ${activeTab === tab.id ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' : 'bg-black/20 text-gray-500 border-white/5 hover:border-white/20'}`}
                            >
                                <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-indigo-600' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-10">
                <TabContent />
            </div>

            {/* ACTIONS FOOTER - FLOATING GLASS */}
            <div className="p-8 pt-4 border-t border-white/5 bg-white/5 relative z-20">
                <div className="flex gap-4">
                    <button 
                        onClick={() => { if(confirm("¿Eliminar este paso estratégico?")) onDelete(node.id); }} 
                        className="p-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-3xl transition-all hover:scale-105 group" 
                        title="Eliminar Componente"
                    > 
                        <Trash2 className="w-6 h-6 group-hover:animate-bounce" /> 
                    </button>
                    <button 
                        onClick={onClose} 
                        className="flex-1 relative group overflow-hidden rounded-3xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500 group-hover:scale-110"></div>
                        <div className="relative flex items-center justify-center gap-3 py-5 px-8 text-sm font-black text-white uppercase tracking-[0.3em] italic">
                            <Save className="w-5 h-5" /> Inyectar Ajustes
                        </div>
                    </button>
                </div>
            </div>

        </div>
    );
}


