'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, MessageSquare, Target, Lightbulb, User, Layout,
    Sparkles, Plus, Trash2, Wand2, Download, Video,
    ChevronDown, ChevronRight, Settings, Printer, Save, CheckCircle2,
    Play, Quote, ArrowRight, GripVertical, Rocket, RefreshCw, PenTool, ChevronLeft,
    Image as ImageIcon, Link, Paperclip, Presentation, PanelLeftClose, PanelLeftOpen, PlusCircle, Timer, PlayCircle, StopCircle, UploadCloud,
    Copy, Type, Monitor, ChevronUp, Layers
} from 'lucide-react';
import { toast } from 'sonner';

// Helper Map for Block Configurations
const BLOCK_CONFIG = {
    hook: { icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', label: 'HOOK' },
    contexto: { icon: Layout, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'CONTEXTO' },
    problema: { icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'PROBLEMA' },
    valor: { icon: Lightbulb, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'VALOR / IDEA' },
    solucion: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'SOLUCIÓN' },
    cta: { icon: ArrowRight, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'CALL TO ACTION' },
    dialogo: { icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', label: 'DIÁLOGO' },
    visual: { icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', label: 'IDEA VISUAL' },
    links: { icon: Link, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', label: 'ENLACES / RECURSOS' },
    assets: { icon: Paperclip, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'ADJUNTOS / ARCHIVOS' },
    slide: { icon: Presentation, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'DIAPOSITIVA' },
    texto: { icon: Type, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'TEXTO ADICIONAL' },
    fondo: { icon: Monitor, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'FONDO / MULTIMEDIA' },
    default: { icon: Layout, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', label: 'BLOQUE' }
};

export default function ScriptEditor({ campaign, node, onBack, onConvertToProduction }) {
    const [mounted, setMounted] = useState(false);

    // Initial Data Factory based on node type
    const getInitialBlocks = () => {
        // If script exists in local storage from previous session, map it to new format if needed, or use directly
        if (node?.data?.script?.blocks?.length > 0) {
            // Check if it's the old format (scene_heading, action). If so, map it roughly.
            const oldBlocks = node.data.script.blocks;
            if (oldBlocks[0] && oldBlocks[0].role) {
                // New format already
                return oldBlocks;
            } else {
                // Migrate old loosely coupled format
                return oldBlocks.map((b, i) => ({
                    id: b.id || Date.now() + i,
                    role: b.type === 'scene_heading' ? 'hook' : b.type === 'action' ? 'contexto' : 'dialogo',
                    title: b.type === 'scene_heading' ? b.content : 'Contenido',
                    content: b.type !== 'scene_heading' ? b.content : '',
                    status: b.content ? 'done' : 'draft', // draft, process, done
                    character: b.type === 'character' ? b.content : '',
                }));
            }
        }

        // Generate brand new templates for empty nodes
        const templates = {
            educativo: [
                { id: '1', role: 'hook', title: 'Hook de Captura', content: '', status: 'draft' },
                { id: '2', role: 'problema', title: 'Planteamiento del Problema', content: '', status: 'draft' },
                { id: '3', role: 'valor', title: 'Explicación Central', content: '', status: 'draft' },
                { id: '4', role: 'solucion', title: 'Tip Práctico', content: '', status: 'draft' },
                { id: '5', role: 'cta', title: 'Llamado a la Acción', content: '', status: 'draft' }
            ],
            caso_exito: [
                { id: '1', role: 'hook', title: 'Resultado Impactante', content: '', status: 'draft' },
                { id: '2', role: 'contexto', title: 'La Situación Anterior', content: '', status: 'draft' },
                { id: '3', role: 'problema', title: 'El Gran Obstáculo', content: '', status: 'draft' },
                { id: '4', role: 'solucion', title: 'Nuestra Intervención', content: '', status: 'draft' },
                { id: '5', role: 'valor', title: 'Transformación (Resultados)', content: '', status: 'draft' },
                { id: '6', role: 'cta', title: 'Invitación Final', content: '', status: 'draft' }
            ],
            post: [
                { id: '1', role: 'hook', title: 'Nombre del Proyecto (Headline)', content: '', status: 'draft' },
                { id: '2', role: 'visual', title: 'Descripción Visual / Idea Creativa', content: '', status: 'draft' },
                { id: '3', role: 'links', title: 'Enlaces de Referencia / Benchmarks', content: '', status: 'draft' },
                { id: '4', role: 'assets', title: 'Adjuntos / Recursos Necesarios', content: '', status: 'draft' },
                { id: '5', role: 'dialogo', title: 'Copy Real del Diseño (Texto)', content: '', status: 'draft' }
            ],
            presentacion: [
                { id: '1', role: 'slide', title: 'Slide 01: Portada e Introducción', content: 'Título del Deck y subtítulo cautivador.', notes: 'Saludar a la audiencia y establecer el marco del proyecto.', status: 'draft' },
                { id: '2', role: 'slide', title: 'Slide 02: El Problema / Oportunidad', content: 'Puntos clave sobre la necesidad del mercado.', notes: 'Mantener el tono serio pero optimista.', status: 'draft' },
                { id: '3', role: 'slide', title: 'Slide 03: La Solución Innovadora', content: 'Propuesta de valor única de DIIC.', notes: 'Momento para destacar nuestra ventaja competitiva.', status: 'draft' },
                { id: '4', role: 'slide', title: 'Slide 04: Demostración / Datos', content: 'Métricas, gráficos o capturas del producto.', notes: 'Hablar de los números concretos.', status: 'draft' },
                { id: '5', role: 'slide', title: 'Slide 05: Cierre y Preguntas', content: 'CTA final y agradecimiento.', notes: 'Dejar el contacto visible.', status: 'draft' }
            ]
        };

        return templates[node?.type] || templates.educativo;
    };

    // --- State ---
    const [blocks, setBlocks] = useState(getInitialBlocks());
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isAutoplaying, setIsAutoplaying] = useState(false);
    const [scriptTitle, setScriptTitle] = useState(node?.data?.title || 'Guión Sin Título');
    const [scriptStatus, setScriptStatus] = useState(node?.data?.script?.status || 'Borrador');
    const [activeBlockId, setActiveBlockId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [aiGeneratingBlock, setAiGeneratingBlock] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const canvasRef = useRef(null);
    const autoplayTimeoutRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Autoplay logic for presentation preview
    useEffect(() => {
        if (showPreview && node?.type === 'presentacion' && isAutoplaying) {
            const currentSlideDuration = blocks[currentSlideIndex]?.duration || 5; // Default to 5 seconds
            autoplayTimeoutRef.current = setTimeout(() => {
                setCurrentSlideIndex((prevIndex) => {
                    if (prevIndex < blocks.length - 1) {
                        return prevIndex + 1;
                    } else {
                        setIsAutoplaying(false); // Stop autoplay at the end
                        return prevIndex;
                    }
                });
            }, currentSlideDuration * 1000);
        }

        return () => {
            if (autoplayTimeoutRef.current) {
                clearTimeout(autoplayTimeoutRef.current);
            }
        };
    }, [showPreview, node?.type, isAutoplaying, currentSlideIndex, blocks]);

    if (!mounted) return null;

    // --- Helpers ---
    const getBlockStatusColor = (status) => {
        if (status === 'done') return 'text-green-500 bg-green-500/10 border-green-500/30';
        if (status === 'process') return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    };

    // --- Actions ---
    const updateBlock = (id, field, value) => {
        setBlocks(blocks.map(b => {
            if (b.id === id) {
                const updated = { ...b, [field]: value };
                // Auto-update status if it has content
                if (field === 'content') {
                    updated.status = value.trim() ? 'process' : 'draft';
                }
                return updated;
            }
            return b;
        }));
    };

    const toggleBlockComplete = (id) => {
        setBlocks(blocks.map(b => {
            if (b.id === id) {
                return { ...b, status: b.status === 'done' ? 'process' : 'done' };
            }
            return b;
        }));
    };

    const addBlock = (role) => {
        const newId = Date.now().toString();
        const newBlock = { id: newId, role, title: BLOCK_CONFIG[role].label, content: '', status: 'draft' };
        if (role === 'slide') {
            newBlock.notes = '';
            newBlock.duration = 5;
        }
        setBlocks([...blocks, newBlock]);
        setTimeout(() => scrollToBlock(newId), 100);
    };

    const duplicateBlock = (id) => {
        const blockToDuplicate = blocks.find(b => b.id === id);
        if (!blockToDuplicate) return;
        
        const newId = Date.now().toString();
        const newBlock = { ...blockToDuplicate, id: newId };
        const index = blocks.findIndex(b => b.id === id);
        
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setBlocks(newBlocks);
        setTimeout(() => scrollToBlock(newId), 100);
    };

    const deleteBlock = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
        if (activeBlockId === id) setActiveBlockId(null);
    };

    const moveBlock = (id, direction) => {
        const index = blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= blocks.length) return;
        
        const newBlocks = [...blocks];
        const [movedBlock] = newBlocks.splice(index, 1);
        newBlocks.splice(newIndex, 0, movedBlock);
        setBlocks(newBlocks);
    };

    const addLayer = (slideId) => {
        const newLayer = { id: Date.now().toString(), content: 'Nuevo Texto', x: 0, y: 0 };
        const updatedBlocks = blocks.map(b => {
            if (b.id === slideId) {
                return { ...b, layers: [...(b.layers || []), newLayer] };
            }
            return b;
        });
        setBlocks(updatedBlocks);
    };

    const scrollToBlock = (id) => {
        setActiveBlockId(id);
        const element = document.getElementById(`block-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // --- AI Integration ---
    const triggerAiAction = (actionType, targetBlockId = null) => {
        const blockToTarget = targetBlockId || activeBlockId;
        if (!blockToTarget && actionType !== 'suggest_structure') {
            toast.error("Selecciona un bloque primero para usar esta función.");
            return;
        }

        setAiGeneratingBlock(blockToTarget || 'global');
        
        // Mock AI Delay
        setTimeout(() => {
            setBlocks(blocks.map(b => {
                if (b.id === blockToTarget) {
                    let newContent = b.content;
                    const promptBase = `[IA] Para el objetivo "${node?.data?.objective || 'Impactar'}":\n`;
                    
                    if (actionType === 'generate') {
                        newContent = `${promptBase}¿Te has preguntado por qué el 90% de los negocios fallan en esto? Aquí te cuento mi método secreto.`;
                    } else if (actionType === 'improve') {
                        newContent = `✨ VERSIÓN MEJORADA ✨\n${b.content}\n\n[IA: Añadimos un tono más asertivo y directo para retener el scroll]`;
                    } else if (actionType === 'rewrite') {
                        newContent = `🔄 REESCRITO:\nTransformamos tu idea original en un formato más dinámico ideal para TikTok/Reels.`;
                    }
                    
                    return { ...b, content: newContent, status: 'process' };
                }
                return b;
            }));
            
            setAiGeneratingBlock(null);
            toast.success("✨ Contenido generado por IA");
        }, 1500);
    };

    // --- Save Functionality ---
    const handleSaveScript = () => {
        if (!campaign || !node) return;
        setIsSaving(true);
        
        try {
            const savedData = localStorage.getItem('diic_strategy_draft');
            if (savedData) {
                const globalStrategy = JSON.parse(savedData);
                const updatedCampaigns = globalStrategy.campaigns.map(c => {
                    if (c.id === campaign.id) {
                        return {
                            ...c,
                            nodes: c.nodes.map(n => {
                                if (n.id === node.id) {
                                    return {
                                        ...n,
                                        data: {
                                            ...n.data,
                                            title: scriptTitle,
                                            script: { blocks, status: scriptStatus, updatedAt: new Date().toISOString() }
                                        }
                                    };
                                }
                                return n;
                            })
                        };
                    }
                    return c;
                });
                
                globalStrategy.campaigns = updatedCampaigns;
                localStorage.setItem('diic_strategy_draft', JSON.stringify(globalStrategy));
                
                setTimeout(() => {
                    setIsSaving(false);
                    toast.success("Guión guardado exitosamente");
                }, 800);
            }
        } catch (e) {
            console.error(e);
            setIsSaving(false);
            toast.error("Error al guardar el guión");
        }
    };

    // --- Derived Metrics ---
    const completedBlocks = blocks.filter(b => b.status === 'done').length;
    const progressPercentage = blocks.length > 0 ? Math.round((completedBlocks / blocks.length) * 100) : 0;

    return (
        <div className="flex flex-col h-full w-full bg-[#050511] text-white">
            
            {/* 1. Header Inteligente */}
            <header className="h-16 shrink-0 bg-[#0E0E18]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-6">
                    {/* Back Button */}
                    <button onClick={onBack} className="group flex items-center gap-2 pr-4 border-r border-white/10 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    {/* Status Chip */}
                    <div className="relative group">
                        <select 
                            value={scriptStatus}
                            onChange={(e) => {
                                setScriptStatus(e.target.value);
                                handleSaveScript();
                            }}
                            className={`pl-3 pr-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer outline-none transition-all ${
                                scriptStatus === 'Aprobado 🔥' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 
                                scriptStatus === 'En Revisión' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 
                                'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                            }`}
                        >
                            <option value="Borrador">Borrador</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Aprobado 🔥">Aprobado 🔥</option>
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>

                    {/* Progress Bar */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Progreso</span>
                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{progressPercentage}%</span>
                    </div>

                    {/* Editable Title */}
                    <div className="hidden lg:flex items-center gap-2 group">
                        <div className="h-4 w-px bg-white/10 mx-2"></div>
                        <input 
                            value={scriptTitle}
                            onChange={(e) => setScriptTitle(e.target.value)}
                            onBlur={handleSaveScript}
                            className="bg-transparent text-sm font-bold text-white outline-none w-64 hover:bg-white/5 focus:bg-white/5 px-2 py-1 rounded transition-colors placeholder:text-gray-600"
                            placeholder="Nombre del Guión..."
                        />
                        <PenTool className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 transition-colors mr-2"
                        title={isSidebarCollapsed ? "Mostrar Navegación" : "Ocultar Navegación"}
                    >
                        {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                    </button>

                    <button 
                        onClick={() => setShowPreview(true)} 
                        className={`hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-300 transition-colors ${
                            node?.type === 'presentacion' ? 'hover:text-amber-400' : 'hover:text-indigo-400'
                        }`}
                    >
                        <Play className={`w-3.5 h-3.5 ${node?.type === 'presentacion' ? 'text-amber-500' : 'text-indigo-400'}`} /> Vista Previa
                    </button>
                    
                    <button 
                        onClick={handleSaveScript}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                            isSaving 
                                ? (node?.type === 'presentacion' ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white') 
                                : `bg-white/10 text-white hover:bg-white/20 hover:shadow-lg ${
                                    node?.type === 'presentacion' ? 'hover:shadow-amber-500/10' : 'hover:shadow-indigo-500/10'
                                  }`
                        }`}
                    >
                        {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {isSaving ? 'Guardando' : 'Guardar'}
                    </button>

                    <button 
                        onClick={onConvertToProduction} 
                        className={`flex items-center gap-2 px-4 py-1.5 shadow-lg text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 ${
                            node?.type === 'presentacion' 
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-orange-500/20' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-purple-500/20'
                        }`}
                    >
                        <Rocket className="w-3.5 h-3.5" /> A Producción
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                
                {/* 2. Left Sidebar - Bloques Visuales */}
                <AnimatePresence>
                    {!isSidebarCollapsed && (
                        <motion.aside 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 256, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="border-r border-white/5 bg-[#0A0A12] flex flex-col shrink-0 overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-4 min-w-[256px]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Estructura del Guión</h3>
                                    {node?.type === 'presentacion' && (
                                        <button className="text-[9px] font-black text-amber-500/50 hover:text-amber-500 transition-colors flex items-center gap-1 uppercase tracking-widest">
                                            <UploadCloud className="w-3 h-3" /> Importar
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {blocks.map(block => {
                                        const config = BLOCK_CONFIG[block.role] || BLOCK_CONFIG.default;
                                        const Icon = config.icon;
                                        const isActive = activeBlockId === block.id;

                                        return (
                                            <div
                                                key={`nav-${block.id}`}
                                                className={`group/nav relative w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                                                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                                                }`}
                                            >
                                                <button
                                                    onClick={() => scrollToBlock(block.id)}
                                                    className="flex-1 flex items-center gap-3 text-left overflow-hidden"
                                                >
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${getBlockStatusColor(block.status).split(' ')[0] === 'text-green-500' ? 'bg-green-500' : getBlockStatusColor(block.status).split(' ')[0] === 'text-amber-500' ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
                                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${config.bg} ${config.border} border`}>
                                                        <Icon className={`w-3 h-3 ${config.color}`} />
                                                    </div>
                                                    <div className="flex-1 truncate">
                                                        <input 
                                                            value={block.title}
                                                            onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                                                            placeholder={config.label}
                                                            className={`bg-transparent text-xs font-bold outline-none w-full ${isActive ? 'text-white' : 'text-gray-400'} focus:text-white transition-colors`}
                                                        />
                                                    </div>
                                                </button>

                                                {/* Nav Actions */}
                                                <div className="flex items-center gap-1 opacity-0 group-hover/nav:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                                                        className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-white transition-colors"
                                                        title="Subir"
                                                    >
                                                        <ChevronUp className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                                                        className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-white transition-colors"
                                                        title="Bajar"
                                                    >
                                                        <ChevronDown className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
                                                        className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-amber-500 transition-colors"
                                                        title="Duplicar"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                                                        className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-red-500 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* 3. Central Canvas - Motor de Bloques */}
                <main 
                    ref={canvasRef} 
                    className={`flex-1 overflow-y-auto p-8 pb-32 scroll-smooth relative custom-scrollbar ${
                        node?.type === 'presentacion' 
                            ? 'bg-[#050511] bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] [background-size:32px_32px]' 
                            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/5 via-[#050511] to-[#050511]'
                    }`}
                >
                    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                        
                        {/* Ghost Block: Strategy Info */}
                        <div className="mb-8 text-center opacity-50 flex flex-col items-center select-none pt-4">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                                Campaña: {campaign?.name}
                            </span>
                            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                {node?.type === 'post' ? 'FICHA TÉCNICA DE DISEÑO' : 'ESTUDIO DE REDACCIÓN'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-2">
                                {node?.type === 'post' ? 'Define la idea visual y el copy para tu equipo gráfico.' : 'Construye con bloques, acelera con IA.'}
                            </p>
                        </div>

                        {/* Specific Header for DESIGN BRIEF (Sheet feel) */}
                        {node?.type === 'post' && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0A0A12] border-x border-t border-white/5 rounded-t-3xl p-8 mb-0 pb-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                                                <PenTool className="w-5 h-5 text-pink-400" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">Briefing Creativo</span>
                                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mt-1">
                                                    {scriptTitle}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 mt-6">
                                            <div>
                                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 block">Objetivo de Diseño</span>
                                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                                    {node?.data?.objective || 'No especificado'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 block">Formato de Salida</span>
                                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                                    Gráfico / Post / Carrusel
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                            <span className="text-[10px] font-mono text-gray-500 italic">REF: {node?.id || 'DX-77'}</span>
                                        </div>
                                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest">DIIC STUDIO v2.0</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Rendering Blocks */}
                        <AnimatePresence>
                            {blocks.map((block) => {
                                const config = BLOCK_CONFIG[block.role] || BLOCK_CONFIG.default;
                                const Icon = config.icon;
                                const isGenerating = aiGeneratingBlock === block.id;
                                const isActive = activeBlockId === block.id;

                                return (
                                    <motion.div 
                                        key={block.id}
                                        id={`block-${block.id}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={() => setActiveBlockId(block.id)}
                                        className={`group relative flex flex-col rounded-2xl border transition-all duration-300 ${
                                            isActive 
                                                ? `bg-[#0E0E18] border-white/20 shadow-[0_0_30px_rgba(99,102,241,0.05)] ring-1 ring-white/10` 
                                                : `bg-[#0A0A12]/80 border-white/5 hover:border-white/10 hover:bg-[#0E0E18]`
                                        }`}
                                    >
                                        {/* Block Decorative Top Border Glow */}
                                        {isActive && (
                                            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${config.color.split('-')[1]}-500/50 to-transparent rounded-t-2xl`}></div>
                                        )}

                                        {/* Block Toolbar */}
                                        <div className="flex items-center justify-between p-3 border-b border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="cursor-grab hover:bg-white/10 p-1 rounded-lg transition-colors text-gray-600 hover:text-white">
                                                    <GripVertical className="w-4 h-4" />
                                                </div>
                                                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border ${config.bg} ${config.border}`}>
                                                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
                                                </div>
                                            </div>
                                            
                                            <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                                                <button onClick={() => deleteBlock(block.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => toggleBlockComplete(block.id)} className={`p-1.5 rounded-lg transition-colors ${block.status === 'done' ? 'text-green-400 bg-green-500/10' : 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'}`}>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Block Content Area */}
                                        <div className="p-5 flex gap-4">
                                            <div className="flex-1">
                                                {/* Specialized Rendering for SLIDE block (Presentation) */}
                                                {node?.type === 'presentacion' ? (
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex gap-4">
                                                            {/* Slide Mockup / Layout Area */}
                                                            <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-6 aspect-[16/9] flex flex-col justify-center relative overflow-hidden group/slide shadow-2xl">
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover/slide:bg-amber-500/10 transition-colors"></div>
                                                                
                                                                {/* Slide Configuration Icon */}
                                                                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover/slide:opacity-100 transition-opacity">
                                                                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                                                        <Timer className="w-3 h-3 text-amber-500" />
                                                                        <input 
                                                                            type="number" 
                                                                            value={block.duration || 5} 
                                                                            onChange={(e) => updateBlock(block.id, 'duration', parseInt(e.target.value))}
                                                                            className="w-8 bg-transparent text-[10px] font-black text-white outline-none"
                                                                        />
                                                                        <span className="text-[8px] font-black text-white/40 uppercase">sec</span>
                                                                    </div>
                                                                    <button className="w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-amber-500 transition-colors border border-white/10" title="Configuración de Slide">
                                                                        <Settings className="w-3 h-3" />
                                                                    </button>
                                                                </div>

                                                                <textarea
                                                                    value={block.content}
                                                                    onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                                    className="w-full bg-transparent text-center text-4xl font-black text-white placeholder:text-white/10 outline-none resize-none overflow-hidden relative z-10 uppercase tracking-tighter italic leading-none"
                                                                    placeholder="TÍTULO IMPACTANTE..."
                                                                    rows={2}
                                                                />
                                                                <div className="mt-4 flex items-center gap-3 opacity-50 group-hover/slide:opacity-100 transition-opacity">
                                                                    <div className="h-0.5 w-12 bg-amber-500"></div>
                                                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Contenido Visual</span>
                                                                </div>
                                                            </div>

                                                            {/* Slide Visual Asset Slot */}
                                                            <div className="w-48 bg-black/20 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 group/asset hover:border-amber-500/30 transition-all">
                                                                <ImageIcon className="w-6 h-6 text-gray-700 group-hover/asset:text-amber-500/50 mb-2 transition-colors" />
                                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-center">Imagen / Icono Referencia</span>
                                                            </div>
                                                        </div>

                                                        {/* Speaker Notes (Mini-Drawer) */}
                                                        <div className="bg-amber-500/5 rounded-xl border border-amber-500/10 p-4">
                                                            <div className="flex items-center gap-2 mb-2 text-amber-400">
                                                                <MessageSquare className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Guión de Voz / Notas</span>
                                                            </div>
                                                            <textarea
                                                                value={block.notes || ''}
                                                                onChange={(e) => updateBlock(block.id, 'notes', e.target.value)}
                                                                placeholder="Escribe lo que dirás en esta diapositiva..."
                                                                rows={2}
                                                                className="w-full bg-transparent text-xs text-amber-500/70 placeholder:text-amber-500/20 outline-none resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : block.role === 'links' ? (
                                                    <div className="space-y-3">
                                                        <textarea
                                                            value={block.content}
                                                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                            placeholder="Pega aquí tus enlaces (uno por línea)..."
                                                            rows={3}
                                                            className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-cyan-400 outline-none resize-none font-mono"
                                                        />
                                                        <div className="flex flex-wrap gap-2">
                                                            {block.content.split('\n').filter(l => l.trim()).map((link, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[10px] text-cyan-400 max-w-[200px] truncate">
                                                                    <Link className="w-3 h-3 shrink-0" /> {link}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : block.role === 'visual' ? (
                                                    <div className="space-y-4">
                                                        <textarea
                                                            value={block.content}
                                                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                            placeholder="Describe la idea visual o pega un enlace a una imagen..."
                                                            rows={3}
                                                            className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-pink-400 outline-none resize-none"
                                                        />
                                                        {block.content.includes('http') ? (
                                                            <div className="w-full h-48 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                                                <div className="text-center">
                                                                    <ImageIcon className="w-6 h-6 text-pink-400/50 mb-2 mx-auto" />
                                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Referencia Externa Detectada</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-32 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                                                                <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors">
                                                                    <Plus className="w-5 h-5" />
                                                                    <span className="text-[10px] uppercase font-black tracking-widest">Añadir Mockup / Referencia</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <textarea
                                                        value={block.content}
                                                        onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                        placeholder={`Escribe el contenido para ${config.label.toLowerCase()}...`}
                                                        rows={Math.max(3, Math.ceil((block.content || '').length / 60))}
                                                        className={`w-full bg-transparent resize-none outline-none font-medium leading-relaxed transition-colors ${
                                                            block.content ? 'text-gray-200' : 'text-gray-600'
                                                        }`}
                                                    />
                                                )}
                                            </div>

                                            {/* In-Block Quick AI Actions */}
                                            {isActive && (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 10 }} 
                                                    animate={{ opacity: 1, x: 0 }} 
                                                    className="w-10 flex flex-col gap-2 shrink-0 border-l border-white/5 pl-2"
                                                >
                                                    <button onClick={() => triggerAiAction('generate', block.id)} disabled={isGenerating} title="Autocompletar" className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors border border-indigo-500/20">
                                                        {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Add Block Strip */}
                        <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-4 scrollbar-hide">
                            {Object.entries(BLOCK_CONFIG).filter(([k]) => k !== 'default').map(([key, config]) => {
                                const Icon = config.icon;
                                return (
                                    <button 
                                        key={`add-${key}`}
                                        onClick={() => addBlock(key)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all whitespace-nowrap group"
                                    >
                                        <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                    </div>
                </main>

                {/* 4. Right Sidebar - Asistente Creativo IA */}
                <aside className="w-80 border-l border-white/5 bg-[#0A0A12] flex flex-col shrink-0 relative overflow-hidden hidden xl:flex">
                    {/* Background Decorative Gradient */}
                    <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full ${
                        node?.type === 'presentacion' ? 'bg-amber-500/10' : 'bg-indigo-500/5'
                    }`}></div>
                    
                    <div className="p-6 border-b border-white/5 relative z-10">
                        <div className={`flex items-center gap-2 mb-1 ${
                            node?.type === 'presentacion' ? 'text-amber-500' : 'text-indigo-400'
                        }`}>
                            <Sparkles className="w-5 h-5" />
                            <h2 className="text-sm font-black uppercase tracking-widest">Asistente Creativo</h2>
                        </div>
                        <p className="text-xs text-gray-500">Impulsado por DIIC AI</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 custom-scrollbar">
                        {/* Context Info */}
                        <div className="bg-[#050511] border border-white/5 rounded-2xl p-4 overflow-hidden relative group">
                            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${
                                node?.type === 'presentacion' ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}></div>
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                                <Target className="w-3 h-3" /> Contexto Estratégico
                            </h4>
                            <p className="text-xs text-gray-300 leading-relaxed italic">
                                "{node?.data?.objective || 'Sin objetivo definido en la estrategia'}"
                            </p>
                        </div>

                        {/* Actions Panel */}
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Acciones Rápidas</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <AiActionButton icon={Lightbulb} label="Sugerir" color="purple" onClick={() => triggerAiAction('generate')} />
                                <AiActionButton icon={PenTool} label="Mejorar" color="blue" onClick={() => triggerAiAction('improve')} />
                                <AiActionButton icon={RefreshCw} label="Reescribir" color="pink" onClick={() => triggerAiAction('rewrite')} />
                                <AiActionButton icon={Layout} label="Estructurar" color="amber" onClick={() => triggerAiAction('suggest_structure')} />
                            </div>
                        </div>

                        {/* Direct Prompt */}
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Pide algo específico</h4>
                            <div className="relative group">
                                <textarea 
                                    className={`w-full bg-[#050511] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none resize-none transition-all placeholder:text-gray-600 ${
                                        node?.type === 'presentacion' ? 'focus:border-amber-500/50' : 'focus:border-indigo-500/50'
                                    }`}
                                    placeholder={node?.type === 'presentacion' ? "Ej. Crea 3 diapositivas sobre..." : "Ej. Haz que el Hook suene más controversial..."}
                                    rows="4"
                                />
                                <button className={`absolute bottom-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all shadow-lg ${
                                    node?.type === 'presentacion' 
                                        ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' 
                                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                                }`}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>

            {/* Floating Action Button (FAB) for Tools - Only for Presentation */}
            <AnimatePresence>
                {node?.type === 'presentacion' && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex gap-3"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addBlock('slide')}
                            className="bg-amber-500 text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(245,158,11,0.3)] flex items-center gap-3 border-2 border-amber-400 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform relative z-10" />
                            <span className="relative z-10">Crear Slide</span>
                        </motion.button>
                        
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#12121F]/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        >
                            <button 
                                onClick={() => {
                                    if (activeBlockId) {
                                        addLayer(activeBlockId);
                                    } else {
                                        addBlock('texto');
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-full text-white/40 hover:text-amber-400 transition-all text-[10px] font-black uppercase tracking-widest group" 
                                title="Añadir Texto"
                            >
                                <Type className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Texto</span>
                            </button>
                            <div className="w-px h-4 bg-white/10"></div>
                            <button 
                                onClick={() => addBlock('visual')}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-full text-white/40 hover:text-amber-400 transition-all text-[10px] font-black uppercase tracking-widest group" 
                                title="Añadir Contenido Visual"
                            >
                                <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Contenido</span>
                            </button>
                            <div className="w-px h-4 bg-white/10"></div>
                            <button 
                                onClick={() => addBlock('fondo')}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-full text-white/40 hover:text-amber-400 transition-all text-[10px] font-black uppercase tracking-widest group" 
                                title="Fondo de Diapositiva"
                            >
                                <Monitor className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Fondo</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Modal de Vista Previa (Teleprompter) */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-50 bg-[#050511]/95 backdrop-blur-3xl flex flex-col items-center pt-24 pb-12 overflow-y-auto"
                    >
                        <button 
                            onClick={() => setShowPreview(false)}
                            className={`absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-2xl z-[60] ${
                                node?.type === 'post' ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a Editar
                        </button>
                        
                        {node?.type === 'post' ? (
                            /* PDF DOCUMENT PREVIEW MODE */
                            <div className="w-full max-w-[850px] bg-white text-black shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[2px] mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                                {/* Header del Documento */}
                                <div className="p-12 pb-8 border-b-4 border-black">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="space-y-1">
                                            <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-4">
                                                Technical Design Brief
                                            </div>
                                            <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] text-black italic">
                                                DIIC STUDIO <span className="text-gray-300">/ DOCUMENT</span>
                                            </h1>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-black">Doc ID: {node?.id || 'DX-77'}</p>
                                            <p className="text-[10px] font-bold text-gray-400">FECHA: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-12">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Campaña</span>
                                            <p className="text-sm font-bold border-l-2 border-black pl-3">{campaign?.name || 'DIIC General'}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Proyecto / Idea</span>
                                            <p className="text-sm font-bold border-l-2 border-black pl-3 text-indigo-600">{scriptTitle}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Responsable</span>
                                            <p className="text-sm font-bold border-l-2 border-black pl-3">DIIC Creative AI</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cuerpo del Documento */}
                                <div className="p-12 space-y-12 min-h-[1000px]">
                                    {blocks.map((block) => {
                                        if (!block.content.trim()) return null;
                                        const config = BLOCK_CONFIG[block.role] || BLOCK_CONFIG.default;
                                        const Icon = config.icon;

                                        return (
                                            <div key={`prev-${block.id}`} className="relative border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-black">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-black">{config.label}</h3>
                                                </div>
                                                <div className="pl-11 pr-8">
                                                    {block.role === 'links' ? (
                                                        <div className="space-y-2">
                                                            {block.content.split('\n').map((l, i) => (
                                                                <p key={i} className="text-xs font-mono text-indigo-600 underline">{l}</p>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm leading-relaxed text-gray-800 font-medium whitespace-pre-wrap">
                                                            {block.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Footer del Documento */}
                                <div className="bg-gray-50 p-8 border-t border-gray-200 flex justify-between items-center mt-20">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-gray-300" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Generated within DIICZONE Application Studio v2.0</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-black">
                                            <Download className="w-3.5 h-3.5" /> Descargar PDF
                                        </button>
                                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-black">
                                            <Printer className="w-3.5 h-3.5" /> Imprimir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : node?.type === 'presentacion' ? (
                            /* PRESENTATION SLIDE PREVIEW MODE - PREMIUM DESIGN */
                            <div className="w-full max-w-6xl h-[650px] flex flex-col relative z-50 px-6">
                                <div className="flex-1 flex gap-6 overflow-hidden">
                                    {/* Main Slide Stage (Left) */}
                                    <div className="flex-[2] relative">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentSlideIndex}
                                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                                                className="absolute inset-0 bg-[#0A0A12] border border-white/5 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col p-16 relative overflow-hidden group"
                                            >
                                                {/* Background Decorative Elements */}
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-transparent opacity-50"></div>
                                                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full group-hover:bg-amber-500/15 transition-colors duration-1000"></div>
                                                
                                                {/* Slide Metadata */}
                                                <div className="flex justify-between items-start mb-16 relative z-10">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-xs">
                                                                {currentSlideIndex + 1}
                                                            </div>
                                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Presentation Mode</span>
                                                        </div>
                                                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">{campaign?.name || 'DIIC Studio Project'}</h4>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Slide ID: {blocks[currentSlideIndex]?.id}</p>
                                                    </div>
                                                </div>

                                                {/* Main Content Area */}
                                                <div className="flex-1 flex flex-col justify-center relative z-10">
                                                    <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-8 max-w-2xl drop-shadow-2xl">
                                                        {blocks[currentSlideIndex]?.content.split('\n')[0] || 'DIIC SLIDE'}
                                                    </h1>
                                                    
                                                    <div className="flex items-center gap-6">
                                                        <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
                                                        <p className="text-lg font-medium text-gray-400 max-w-lg leading-relaxed">
                                                            {blocks[currentSlideIndex]?.content.split('\n').slice(1).join('\n') || 'Propuesta estratégica generada por IA para impacto masivo.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Slide Navigation Buttons (Overlay) */}
                                                <div className="absolute inset-y-0 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                                                        disabled={currentSlideIndex === 0}
                                                        className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all disabled:opacity-0"
                                                    >
                                                        <ChevronLeft className="w-6 h-6" />
                                                    </button>
                                                </div>
                                                <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => setCurrentSlideIndex(Math.min(blocks.length - 1, currentSlideIndex + 1))}
                                                        disabled={currentSlideIndex === blocks.length - 1}
                                                        className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all disabled:opacity-0"
                                                    >
                                                        <ChevronRight className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Sidebar Info Area (Right) - Inspired by User Image */}
                                    <div className="flex-1 flex flex-col gap-6">
                                        {/* Speaker Notes Card */}
                                        <div className="flex-1 bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 flex flex-col relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/20"></div>
                                            <div className="flex items-center gap-3 mb-6 text-amber-500">
                                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                    <MessageSquare className="w-4 h-4" />
                                                </div>
                                                <h3 className="text-[10px] font-black uppercase tracking-widest">Lo que dirás (Script)</h3>
                                            </div>
                                            
                                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                                <p className="text-sm font-medium leading-relaxed text-gray-300 italic">
                                                    "{blocks[currentSlideIndex]?.notes || 'Sin notas para esta diapositiva.'}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress & Quick Stats Card */}
                                        <div className="h-48 bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Progreso Deck</h3>
                                                    <p className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                                        {Math.round(((currentSlideIndex + 1) / blocks.length) * 100)}%
                                                    </p>
                                                </div>
                                                <Rocket className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div className="flex gap-1">
                                                {blocks.map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                                            i <= currentSlideIndex ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/5'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Controls */}
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setIsAutoplaying(!isAutoplaying)}
                                            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                                                isAutoplaying 
                                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' 
                                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {isAutoplaying ? <StopCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                                            {isAutoplaying ? 'Detener Auto' : 'Reproducción Auto'}
                                        </button>
                                        <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all"> 
                                            <Download className="w-3.5 h-3.5 inline mr-2" /> Exportar Deck
                                        </button>
                                        <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all">
                                            <Printer className="w-3.5 h-3.5 inline mr-2" /> Imprimir Notas
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                                        <span>DIIC Creative Suite</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                        <span>{scriptStatus}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* TELEPROMPTER PREVIEW MODE */
                            <div className="w-full max-w-3xl px-8 pb-32">
                                <div className="text-center mb-16">
                                    <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-2">Simulación de Teleprompter</h2>
                                    <h1 className="text-3xl font-bold text-white">{scriptTitle}</h1>
                                </div>
                                
                                <div className="space-y-16">
                                    {blocks.map((block) => {
                                        if (!block.content.trim()) return null;
                                        const config = BLOCK_CONFIG[block.role] || BLOCK_CONFIG.default;
                                        
                                        return (
                                            <div key={`prev-${block.id}`} className="flex flex-col items-center text-center group">
                                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border ${config.bg} ${config.border} ${config.color}`}>
                                                    <config.icon className="w-3.5 h-3.5" /> {config.label}
                                                </span>
                                                <p className="text-3xl md:text-4xl font-medium leading-[1.6] text-gray-200 w-full">
                                                    {block.content}
                                                </p>
                                            </div>
                                        )
                                    })}
                                    {blocks.filter(b => b.content.trim()).length === 0 && (
                                        <p className="text-center text-gray-500 font-bold">El guión está vacío. Escribe algo para ver la simulación.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Utility Component for AI Buttons
function AiActionButton({ icon: Icon, label, color, onClick }) {
    const colors = {
        purple: 'hover:bg-purple-500/10 border-purple-500/20 text-purple-400 hover:text-purple-300 group-hover:shadow-purple-500/10',
        blue: 'hover:bg-blue-500/10 border-blue-500/20 text-blue-400 hover:text-blue-300 group-hover:shadow-blue-500/10',
        pink: 'hover:bg-pink-500/10 border-pink-500/20 text-pink-400 hover:text-pink-300 group-hover:shadow-pink-500/10',
        amber: 'hover:bg-amber-500/10 border-amber-500/20 text-amber-500 hover:text-amber-400 group-hover:shadow-amber-500/10',
        indigo: 'hover:bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:text-indigo-300 group-hover:shadow-indigo-500/10',
    };

    const colorClass = colors[color] || colors.indigo;

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border transition-all group overflow-hidden relative ${colorClass}`}
        >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-transparent to-current/5`}></div>
            <Icon className="w-5 h-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform relative z-10" />
            <span className="text-[10px] font-black uppercase tracking-wider relative z-10">{label}</span>
        </button>
    );
}
