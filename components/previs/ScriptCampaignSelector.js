'use client';

import { useState, useEffect } from 'react';
import { Layers, ChevronRight, FileText, CheckCircle2, Play, Layout, Plus, Wand2, Video, Image as ImageIcon, X, Presentation, Sparkles, FolderOpen, Target, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ScriptCampaignSelector({ onSelectContent }) {
    const [strategyData, setStrategyData] = useState(null);
    const [activeCampaignId, setActiveCampaignId] = useState(null);
    
    // New Content Modal State
    const [showNewContentModal, setShowNewContentModal] = useState(false);
    const [newContentType, setNewContentType] = useState('video'); // video | post | presentacion
    const [newContentTitle, setNewContentTitle] = useState('');

    // New Campaign Modal State
    const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
    const [newCampaignTitle, setNewCampaignTitle] = useState('');

    useEffect(() => {
        // Load global strategy data
        const loadStrategy = () => {
            const saved = localStorage.getItem('diic_strategy_draft');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setStrategyData(parsed);
                    if (parsed.campaigns && parsed.campaigns.length > 0) {
                        setActiveCampaignId(parsed.campaigns[0].id);
                    }
                } catch (e) {
                    console.error("Error parsing strategy data", e);
                }
            } else {
                // Mock data for testing
                const mockData = {
                    name: 'Mi Estrategia',
                    campaigns: []
                };
                setStrategyData(mockData);
            }
        };

        loadStrategy();
    }, []);

    const handleCreateCampaign = () => {
        if (!newCampaignTitle.trim()) return;
        
        const newCampId = `camp_${Date.now()}`;
        const newCampaign = {
            id: newCampId,
            name: newCampaignTitle,
            objective: 'Campaña creada desde Estudio',
            nodes: []
        };

        const updatedData = { ...strategyData };
        if (!updatedData.campaigns) updatedData.campaigns = [];
        updatedData.campaigns.push(newCampaign);
        
        setStrategyData(updatedData);
        setActiveCampaignId(newCampId);
        localStorage.setItem('diic_strategy_draft', JSON.stringify(updatedData));
        
        setNewCampaignTitle('');
        setShowNewCampaignModal(false);
        toast.success('Campaña creada');
    };

    const handleDeleteCampaign = (e, campId) => {
        e.stopPropagation();
        if (!window.confirm('¿Estás seguro de eliminar esta campaña y todos sus guiones?')) return;

        const updatedData = { ...strategyData };
        updatedData.campaigns = updatedData.campaigns.filter(c => c.id !== campId);
        
        setStrategyData(updatedData);
        localStorage.setItem('diic_strategy_draft', JSON.stringify(updatedData));
        
        if (activeCampaignId === campId) {
            setActiveCampaignId(updatedData.campaigns[0]?.id || null);
        }
        toast.error('Campaña eliminada');
    };

    const handleDeleteNode = (e, nodeId) => {
        e.stopPropagation();
        if (!window.confirm('¿Borrar este guión?')) return;

        const updatedData = { ...strategyData };
        const campIndex = updatedData.campaigns.findIndex(c => c.id === activeCampaignId);
        if (campIndex !== -1) {
            updatedData.campaigns[campIndex].nodes = updatedData.campaigns[campIndex].nodes.filter(n => n.id !== nodeId);
            setStrategyData(updatedData);
            localStorage.setItem('diic_strategy_draft', JSON.stringify(updatedData));
            toast.error('Contenido eliminado');
        }
    };

    const handleCreateContent = () => {
        if (!newContentTitle.trim() || !activeCampaignId) return;

        const newNodeId = `n_${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: newContentType,
            data: { 
                title: newContentTitle, 
                objective: `Contenido Express tipo ${newContentType}`, 
                status: 'Borrador' 
            }
        };

        // Update Local State
        const updatedData = { ...strategyData };
        const campIndex = updatedData.campaigns.findIndex(c => c.id === activeCampaignId);
        if (campIndex !== -1) {
            // Append the new node
            if (!updatedData.campaigns[campIndex].nodes) updatedData.campaigns[campIndex].nodes = [];
            updatedData.campaigns[campIndex].nodes.push(newNode);
            setStrategyData(updatedData);

            // Save to LocalStorage
            localStorage.setItem('diic_strategy_draft', JSON.stringify(updatedData));
            
            // Immediately open the newly created content in the ScriptEditor
            onSelectContent({ campaign: updatedData.campaigns[campIndex], node: newNode });
        }

        // Reset and Close Modal
        setNewContentTitle('');
        setNewContentType('video');
        setShowNewContentModal(false);
    };

    if (!strategyData || !strategyData.campaigns || strategyData.campaigns.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#050511] text-center p-8 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 max-w-lg bg-[#0E0E18]/80 backdrop-blur-xl border border-white/5 p-12 rounded-3xl shadow-2xl">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-indigo-500/20">
                        <FolderOpen className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Workspace Vacío</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        No tienes ninguna campaña activa. Puedes crear una campaña rápida aquí mismo para empezar a redactar contenidos, o ir a la Pizarra de Estrategia para un plan avanzado.
                    </p>
                    <button 
                        onClick={() => setShowNewCampaignModal(true)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Crear Nueva Campaña
                    </button>
                </div>

                {/* New Campaign Modal (for Empty State) */}
                <AnimatePresence>
                    {showNewCampaignModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#020205]/90 backdrop-blur-xl" onClick={() => setShowNewCampaignModal(false)} />
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-[#0A0A12] border border-white/10 rounded-[2rem] p-8 relative z-10">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Nueva Campaña Rápida</h2>
                                <input 
                                    type="text"
                                    value={newCampaignTitle}
                                    onChange={(e) => setNewCampaignTitle(e.target.value)}
                                    placeholder="Ej. Lanzamiento Black Friday..."
                                    className="w-full bg-[#050511] border border-white/10 focus:border-indigo-500/50 rounded-xl px-5 py-4 text-sm text-white outline-none mb-6"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCampaign()}
                                />
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setShowNewCampaignModal(false)} className="px-6 py-3 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest">Cancelar</button>
                                    <button onClick={handleCreateCampaign} disabled={!newCampaignTitle.trim()} className="px-6 py-3 bg-white text-black hover:bg-gray-200 disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-widest">Crear Campaña</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    const activeCampaign = strategyData.campaigns.find(c => c.id === activeCampaignId);



    return (
        <div className="h-full w-full bg-[#050511] flex overflow-hidden">
            {/* 1. Premier Left Sidebar - Folders */}
            <div className="w-[320px] bg-[#0A0A12] border-r border-white/5 flex flex-col shrink-0 relative z-20 shadow-2xl">
                <div className="p-8 pb-4 flex items-start justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                            <Sparkles className="w-3.5 h-3.5" /> Studio Hub
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                            Campañas
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">Contenedores estratégicos</p>
                    </div>
                    <button 
                        onClick={() => setShowNewCampaignModal(true)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                        title="Nueva Campaña"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-8 custom-scrollbar">
                    {strategyData.campaigns.map(camp => {
                        const isActive = activeCampaignId === camp.id;
                        return (
                            <div
                                key={camp.id}
                                onClick={() => setActiveCampaignId(camp.id)}
                                className={`cursor-pointer w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                                    isActive
                                        ? 'bg-[#0E0E18] border-indigo-500/30 shadow-[0_5px_30px_rgba(99,102,241,0.05)]'
                                        : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05]'
                                }`}
                            >
                                {/* Active Glow Accent */}
                                {isActive && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                                )}
                                
                                <h3 className={`font-black text-sm mb-1.5 tracking-tight ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                                    {camp.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Target className={`w-3 h-3 ${isActive ? 'text-indigo-400' : 'text-gray-600'}`} />
                                        <p className={`text-[10px] font-bold uppercase tracking-widest line-clamp-1 ${isActive ? 'text-indigo-400/80' : 'text-gray-600'}`}>
                                            {camp.objective || 'Sin objetivo principal'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDeleteCampaign(e, camp.id)}
                                        className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Right Canvas Area - Glassmorphism UI */}
            <div className="flex-1 relative overflow-y-auto custom-scrollbar container-fluid">
                {/* Immersive Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050511] to-[#050511] pointer-events-none" />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 max-w-5xl mx-auto px-12 py-16">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeCampaignId}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Premium Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                                            <FolderOpen className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Matriz de Contenidos Activa</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tighter uppercase mb-2">
                                        {activeCampaign?.name}
                                    </h1>
                                </div>
                                
                                <button 
                                    onClick={() => setShowNewContentModal(true)}
                                    className="group flex flex-col md:flex-row items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 rounded-2xl text-white transition-all duration-300 shadow-xl hover:shadow-indigo-500/25"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black uppercase tracking-widest">Añadir Contenido</div>
                                        <div className="text-[10px] text-gray-400 group-hover:text-indigo-200">Video, Post o Diapos</div>
                                    </div>
                                </button>
                            </div>

                            {/* Node Grid Dashboard */}
                            {!activeCampaign?.nodes || activeCampaign.nodes.length === 0 ? (
                                <div className="p-12 border border-dashed border-white/10 bg-white/[0.01] rounded-[2rem] text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                                        <FileText className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Workspace Vacío</h3>
                                    <p className="text-gray-400 text-sm max-w-sm mb-8">Esta campaña aún no tiene nodos creativos. Crea el primero para empezar a desarrollar contenido.</p>
                                    <button 
                                        onClick={() => setShowNewContentModal(true)}
                                        className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                                    >
                                        Crear Primer Contenido
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeCampaign.nodes.map((node, i) => {
                                        const hasScript = node.data.script && node.data.script.blocks?.length > 0;
                                        
                                        // Icon mappings based on node type
                                        const IdeaIcon = node.type === 'video' ? Video : node.type === 'post' ? ImageIcon : node.type === 'presentacion' ? Presentation : FileText;
                                        
                                        return (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                key={node.id} 
                                                className="group bg-[#0A0A12]/80 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 p-7 rounded-[2.5rem] flex flex-col justify-between transition-all hover:bg-[#0E0E18] hover:shadow-[0_25px_50px_rgba(99,102,241,0.08)] h-[320px] relative overflow-hidden"
                                            >
                                                {/* Background Strategy Ghost Tag */}
                                                <div className="absolute -top-4 -right-4 text-[40px] font-black text-white/[0.02] uppercase italic selection:bg-transparent pointer-events-none group-hover:text-white/[0.04] transition-colors">
                                                    {activeCampaign?.name.split(' ')[0]}
                                                </div>

                                                {/* Card Header & Metadata */}
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-6">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 flex items-center gap-1.5">
                                                                <Layers className="w-3 h-3 text-indigo-400" />
                                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest truncate max-w-[100px]">
                                                                    {activeCampaign?.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
                                                                hasScript 
                                                                    ? node.data.script?.status === 'Aprobado 🔥' 
                                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                                    : 'bg-white/5 text-gray-400 border-white/10'
                                                            }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${hasScript ? 'bg-current animate-pulse' : 'bg-gray-600'}`} />
                                                                {hasScript ? (node.data.script?.status || 'En Proceso') : 'Vacio'}
                                                            </div>
                                                            <button 
                                                                onClick={(e) => handleDeleteNode(e, node.id)}
                                                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Row 2: Type icon & Title */}
                                                    <div className="flex gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all shrink-0">
                                                            <IdeaIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                                        </div>
                                                        <div>
                                                           <h3 className="text-white font-black text-xl leading-tight mb-2 line-clamp-2 italic tracking-tighter uppercase">{node.data.title || 'Contenido Sin Título'}</h3>
                                                           <p className="text-[11px] font-medium text-gray-500 line-clamp-1 flex items-center gap-1.5">
                                                              <FileText className="w-3 h-3" /> {node.data.objective}
                                                           </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Section: Progress & Actions */}
                                                <div className="space-y-6">
                                                   <div className="space-y-2">
                                                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                         <span>Nivel de Desarrollo</span>
                                                         <span className="text-white">{hasScript ? '75%' : '0%'}</span>
                                                      </div>
                                                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                         <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: hasScript ? '75%' : '5%' }}
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                         />
                                                      </div>
                                                   </div>

                                                   <button
                                                      onClick={() => onSelectContent({ campaign: activeCampaign, node })}
                                                      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all group/btn ${
                                                         hasScript 
                                                               ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' 
                                                               : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500'
                                                      }`}
                                                   >
                                                      {hasScript ? (
                                                         <>Continuar <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                                                      ) : (
                                                         <>Desarrollar <Wand2 className="w-4 h-4 animate-pulse" /></>
                                                      )}
                                                   </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Premium Glass Modal for New Content */}
            <AnimatePresence>
                {showNewContentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-[#020205]/90 backdrop-blur-xl" 
                            onClick={() => setShowNewContentModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-xl bg-[#0A0A12]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative z-10 overflow-hidden"
                        >
                            {/* Glow accent behind modal */}
                            <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

                            <button 
                                onClick={() => setShowNewContentModal(false)}
                                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Nuevo Elemento</h2>
                                <p className="text-sm text-gray-400">Selecciona el formato que deseas desarrollar en esta matriz.</p>
                            </div>

                            {/* Format Selector */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <button
                                    onClick={() => setNewContentType('video')}
                                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all ${
                                        newContentType === 'video' 
                                            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Video className="w-8 h-8" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Video</span>
                                </button>
                                
                                <button
                                    onClick={() => setNewContentType('post')}
                                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all ${
                                        newContentType === 'post' 
                                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Gráfico</span>
                                </button>

                                <button
                                    onClick={() => setNewContentType('presentacion')}
                                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all ${
                                        newContentType === 'presentacion' 
                                            ? 'bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Presentation className="w-8 h-8" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Diapos</span>
                                </button>
                            </div>

                            {/* Title Input */}
                            <div className="mb-8">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Nombre del Proyecto / Idea Central</label>
                                <input 
                                    type="text"
                                    value={newContentTitle}
                                    onChange={(e) => setNewContentTitle(e.target.value)}
                                    placeholder={newContentType === 'video' ? 'Ej. Reel: 3 Tips infalibles para...' : newContentType === 'post' ? 'Ej. Carrusel: Desmintiendo mitos...' : 'Ej. Pitch Deck Inversores Q3'}
                                    className="w-full bg-[#050511] border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 font-medium"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && newContentTitle.trim() && handleCreateContent()}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3">
                                <button 
                                    onClick={() => setShowNewContentModal(false)}
                                    className="px-6 py-3 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleCreateContent}
                                    disabled={!newContentTitle.trim()}
                                    className="px-8 py-3 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    Crear Nodo
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* New Campaign Modal (for regular use) */}
            <AnimatePresence>
                {showNewCampaignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#020205]/90 backdrop-blur-xl" onClick={() => setShowNewCampaignModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-[#0A0A12] border border-white/10 rounded-[2rem] p-8 relative z-10 shadow-2xl">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Nueva Campaña Rápida</h2>
                            <input 
                                type="text"
                                value={newCampaignTitle}
                                onChange={(e) => setNewCampaignTitle(e.target.value)}
                                placeholder="Ej. Lanzamiento Black Friday..."
                                className="w-full bg-[#050511] border border-white/10 focus:border-indigo-500/50 rounded-xl px-5 py-4 text-sm text-white outline-none mb-6"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateCampaign()}
                            />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowNewCampaignModal(false)} className="px-6 py-3 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest">Cancelar</button>
                                <button onClick={handleCreateCampaign} disabled={!newCampaignTitle.trim()} className="px-6 py-3 bg-white text-black hover:bg-gray-200 disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]">Crear Campaña</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
