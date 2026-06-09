import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
    X, Trash2, Copy, Send, Layout, Target, 
    Share2, Clock, BarChart, ExternalLink, Info,
    ChevronDown, ChevronLeft, Plus, Star, ArrowRight, Settings,
    Calendar, Users, Type, Video, Link, MessageSquare,
    CheckCircle2, AlertCircle, TrendingUp, Sparkles, Pencil, Search, Box,
    Zap, Globe, Database, Cpu, Flame, Snowflake, Thermometer, Palette,
    Layers, Mic, Film, Camera, FileText, UploadCloud, RefreshCw,
    Instagram, Facebook, Youtube, Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NODE_TYPES, NODE_CATEGORIES, STRATEGIC_COLUMNS, CONTENT_STATUS, STRATEGIC_FORMATS } from './StrategyConstants';


const CREATIVE_ZONES = [
    { id: 'community', label: 'COMMUNITY MANAGER', color: '#818cf8', icon: Users },
    { id: 'diseno', label: 'DISEÑO GRÁFICO', color: '#2dd4bf', icon: Palette },
    { id: 'audio', label: 'AUDITION PRO', color: '#6366f1', icon: Mic },
    { id: 'video', label: 'EDICIÓN DE VIDEO', color: '#818cf8', icon: Video },
    { id: 'foto', label: 'FOTOGRAFÍA & ESTUDIO', color: '#fb7185', icon: Camera },
    { id: 'filmmaker', label: 'FILMMAKER PRO', color: '#a855f7', icon: Film },
    { id: 'talento', label: 'MODELOS & TALENTO', color: '#fbbf24', icon: Star },
    { id: 'web', label: 'DESARROLLO WEB', color: '#22d3ee', icon: Globe },
    { id: 'imprenta', label: 'IMPRENTA & MERCH', color: '#f59e0b', icon: Box },
    { id: 'eventos', label: 'COBERTURA EVENTOS', color: '#10b981', icon: Calendar }
];

export default function StrategyPropertyPanel({ 
    selectedNode, 
    selectedEdge, 
    activeTab = 'estratégica',
    onTabChange,
    onClose, 
    onCollapse,
    onUpdateNode, 
    onDeleteNode, 
    onDeleteEdge,
    onDuplicateNode,
    onSendToPlanner,
    onOpenMemoryPicker,
    theme = 'dark',
    dragControls,
    panelSize,
    setPanelSize,
    squadMembers = []
}) {
    const [isGeneratingAI, setIsGeneratingAI] = useState(null); // 'script', 'objective', etc.
    const [showZonePicker, setShowZonePicker] = useState(false);
    const [showTalentPicker, setShowTalentPicker] = useState(false);
    const [isConnectingCloud, setIsConnectingCloud] = useState(false);
    const router = useRouter();

    const handleGenerateAI = (field) => {
        if (!selectedNode) return;
        setIsGeneratingAI(field);
        toast.info('Generando estructura con Inteligencia Artificial...');
        setTimeout(() => {
            setIsGeneratingAI(null);
            if (field === 'script') {
                onUpdateNode(selectedNode.id, {
                    ...selectedNode.data,
                    productionInfo: {
                        ...(selectedNode.data?.productionInfo || {}),
                        script: `[ESTRUCTURA DE GUION GENERADA POR IA]
1. GANCHO (0-3s): ¿Sabías que el 90% de los emprendedores fallan en...?
2. PROBLEMA (3-15s): Explicación del dolor principal del cliente...
3. SOLUCIÓN (15-30s): Cómo nuestro producto/servicio resuelve esto...
4. LLAMADO A LA ACCIÓN (30-45s): Comenta la palabra CLAVE para recibir más información.`
                    }
                });
                toast.success('Guion/escaleta generado con éxito.');
            }
        }, 1500);
    };

    const handleCloudConnect = () => {
        if (!selectedNode) return;
        setIsConnectingCloud(true);
        toast.info('Conectando con Diiczone Cloud...');
        setTimeout(() => {
            setIsConnectingCloud(false);
            const newLinks = [
                ...(selectedNode?.data?.memoryLinks || []),
                { name: 'Paleta_Identidad_Marca.pdf', size: '2.4 MB', type: 'document', path: 'Drive/Assets' },
                { name: 'Video_Referencia_Inspiracion.mp4', size: '14.2 MB', type: 'video', path: 'Drive/Video' }
            ];
            onUpdateNode(selectedNode.id, {
                ...selectedNode.data,
                memoryLinks: newLinks
            });
            toast.success('Conexión exitosa. Assets vinculados.');
        }, 2000);
    };
    
    if (!selectedNode && !selectedEdge) return null;

    const isNode = !!selectedNode;
    const typeConfig = isNode ? (NODE_TYPES[selectedNode.type] || NODE_TYPES.educativo) : null;
    const accentColor = selectedNode?.data?.labelColor || '#6366f1';

    const LABEL_COLORS = [
        { id: 'indigo', color: '#818cf8' },
        { id: 'amber', color: '#fbbf24' },
        { id: 'rose', color: '#ff2d55' },
        { id: 'emerald', color: '#10b981' },
        { id: 'cyan', color: '#22d3ee' }
    ];

    const EMOTIONS = ["Motivación", "Miedo", "Curiosidad", "Urgencia", "Otro"];
    const TEMPS = [
        { id: 'Frío', label: 'Frío', color: '#60a5fa', icon: Snowflake },
        { id: 'Tibio', label: 'Tibio', color: '#fbbf24', icon: Zap },
        { id: 'Caliente', label: 'Caliente', color: '#f43f5e', icon: Flame }
    ];

    const CustomSelect = ({ value, onChange, options = [], label, icon: Icon, color, align = 'full' }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedOption = (options || []).find(o => o.id === value) || (options || [])[0] || { id: '', label: '', color: '#6366f1' };

        return (
            <div className="space-y-2 relative">
                {label && <label className={`text-[8px] font-black uppercase tracking-[0.2em] pl-1 font-inter transition-colors duration-500 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>{label}</label>}
                <div className="relative group/sel">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full border rounded-xl px-3 py-2.5 text-[9px] font-black flex items-center justify-between transition-all duration-300 ${
                            theme === 'dark' 
                            ? 'bg-white/[0.04] border-white/5 text-white hover:bg-white/[0.07] hover:border-white/20' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-white hover:border-indigo-300 shadow-sm'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="p-1 rounded-lg shrink-0" style={{ backgroundColor: `${selectedOption.color || '#6366f1'}15` }}>
                                {selectedOption.icon ? <selectedOption.icon className="w-3.5 h-3.5" style={{ color: selectedOption.color || '#6366f1' }} /> : <Icon className="w-3.5 h-3.5" style={{ color: selectedOption.color || '#6366f1' }} />}
                            </div>
                            <span className="uppercase tracking-wider truncate">{selectedOption.label}</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-500 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-300'} ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className={`absolute mt-2 border rounded-[2rem] p-3 z-[120] shadow-2xl overflow-y-auto max-h-[220px] custom-scrollbar ring-1 transition-all duration-500 ${
                                        align === 'right' ? 'right-0 w-[260px]' : align === 'left' ? 'left-0 w-[260px]' : 'left-0 right-0'
                                    } ${
                                        theme === 'dark' 
                                        ? 'bg-[#0A0A14]/95 backdrop-blur-3xl border-white/10 ring-white/5' 
                                        : 'bg-white border-slate-200 ring-slate-100 shadow-xl shadow-slate-200/50'
                                    }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                                    <div className="relative space-y-1">
                                        {options.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => {
                                                    onChange(opt.id);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left ${
                                                    value === opt.id 
                                                    ? (theme === 'dark' ? 'bg-white/[0.08] border border-white/10 shadow-lg' : 'bg-indigo-50 border border-indigo-100 shadow-sm') 
                                                    : (theme === 'dark' ? 'hover:bg-white/[0.04] border border-transparent opacity-60 hover:opacity-100' : 'hover:bg-slate-50 border border-transparent opacity-70 hover:opacity-100')
                                                }`}
                                            >
                                                <div className="p-1.5 rounded-lg transition-transform group-hover:scale-110 shrink-0" style={{ backgroundColor: `${opt.color || '#6366f1'}15` }}>
                                                    {opt.icon ? <opt.icon className="w-3.5 h-3.5" style={{ color: opt.color || '#6366f1' }} /> : <Icon className="w-3.5 h-3.5" style={{ color: opt.color || '#6366f1' }} />}
                                                </div>
                                                <div className="flex flex-col items-start min-w-0 flex-1">
                                                    <span className={`text-[9.5px] font-black uppercase tracking-wider truncate w-full ${value === opt.id ? (theme === 'dark' ? 'text-white' : 'text-slate-900') : (theme === 'dark' ? 'text-gray-300' : 'text-slate-500')}`}>{opt.label}</span>
                                                    {opt.desc && <span className={`text-[8px] font-bold uppercase tracking-tight text-left leading-normal mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{opt.desc}</span>}
                                                </div>
                                                {value === opt.id && (
                                                    <motion.div layoutId="selActive" className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: opt.color || '#6366f1', boxShadow: `0 0 10px ${opt.color || '#6366f1'}` }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    const sortedSquad = (Array.isArray(squadMembers) ? squadMembers : []).filter(Boolean).sort((a, b) => {
        const isADesigner = ((a?.role || '') + '').toLowerCase().includes('diseñador') || ((a?.role || '') + '').toLowerCase().includes('design');
        const isBDesigner = ((b?.role || '') + '').toLowerCase().includes('diseñador') || ((b?.role || '') + '').toLowerCase().includes('design');
        if (isADesigner && !isBDesigner) return -1;
        if (!isADesigner && isBDesigner) return 1;
        return ((a?.name || '') + '').localeCompare((b?.name || '') + '');
    });

    return (
        <aside 
            style={{ width: panelSize?.width || 320, height: panelSize?.height || 750 }}
            className={`border flex flex-col max-h-[85vh] max-w-[95vw] min-w-[300px] min-h-[400px] z-[100] overflow-hidden rounded-[2.5rem] ring-1 group/panel relative ${
                theme === 'dark' 
                ? 'bg-[#050511]/50 backdrop-blur-xl border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] ring-white/5' 
                : 'bg-white/50 backdrop-blur-xl border-slate-200 shadow-2xl shadow-slate-200/50 ring-slate-100'
            }`}
        >
            {/* 🛡️ Header Premium */}
            <div 
                onPointerDown={(e) => {
                    const isInteractive = e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select') || e.target.closest('.relative.group\\/zone');
                    if (!isInteractive && dragControls) {
                        dragControls.start(e);
                    }
                }}
                className={`p-6 pt-8 border-b relative overflow-hidden transition-colors duration-500 cursor-grab active:cursor-grabbing select-none ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col gap-4 mb-6 relative z-10">
                    {/* Row 1: Header Title & Window Controls */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-xl border shadow-inner group transition-all" style={{ borderColor: `${accentColor}20`, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                <Settings className="w-3.5 h-3.5 text-gray-500 group-hover:rotate-90 transition-transform duration-700" style={{ color: accentColor }} />
                            </div>
                            <h2 className={`text-[9.5px] font-[900] uppercase tracking-[0.3em] italic leading-none transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{isNode ? 'NODE SETTINGS' : 'CONNECTOR SETTINGS'}</h2>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {onCollapse && (
                                <button 
                                    onClick={onCollapse} 
                                    className={`p-2 rounded-full transition-all group ${theme === 'dark' ? 'hover:bg-white/5 text-gray-600 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}
                                    title="Colapsar Panel"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                </button>
                            )}
                            <button onClick={onClose} className={`p-2 rounded-full transition-all group ${theme === 'dark' ? 'hover:bg-white/5 text-gray-600 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}>
                                <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Node Status & Node Actions */}
                    <div className="flex items-center justify-between w-full gap-2">
                        {isNode && (
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-500 w-fit shrink-0 ${theme === 'dark' ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedNode?.data?.status === 'aprobado' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
                                <span className={`text-[7px] font-black uppercase tracking-widest leading-none transition-colors duration-500 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{selectedNode?.data?.status || 'Borrador'}</span>
                            </div>
                        )}

                        {/* Minimalist Top Actions */}
                        <div className={`flex items-center gap-1 p-1 rounded-xl border transition-all duration-500 ml-auto shrink-0 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            {isNode ? (
                                <>
                                    <button 
                                        onClick={() => onDuplicateNode(selectedNode?.id)}
                                        className="p-2 rounded-lg hover:bg-white/5 text-gray-600 hover:text-white transition-all group/act"
                                        title="Clonar Nodo"
                                    >
                                        <Copy className="w-3 h-3 group-hover/act:scale-110" />
                                    </button>
                                    <button 
                                        onClick={() => onSendToPlanner(selectedNode?.id)}
                                        className="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-500/60 hover:text-indigo-400 transition-all group/act"
                                        title="Sync Planner"
                                    >
                                        <Send className="w-3 h-3 group-hover/act:translate-x-0.5 group-hover/act:-translate-y-0.5" />
                                    </button>
                                    <div className="w-px h-3.5 bg-white/5 mx-0.5" />
                                    <button 
                                        onClick={() => onDeleteNode(selectedNode?.id)}
                                        className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-all group/act"
                                        title="Borrar Nodo"
                                    >
                                        <Trash2 className="w-3 h-3 group-hover/act:scale-110" />
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => onDeleteEdge(selectedEdge?.id)}
                                    className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-all group/act"
                                    title="Borrar Conector"
                                >
                                    <Trash2 className="w-3 h-3 group-hover/act:scale-110" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🧭 Tabs Modernas - 6 Categorías */}
                {isNode && (
                    <div className={`flex gap-1 p-1 border rounded-2xl relative z-10 overflow-x-auto no-scrollbar transition-all duration-500 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
                        {[
                            { id: 'estratégica', label: 'Estratégica', icon: Target, color: 'text-indigo-400' },
                            { id: 'producción', label: 'Producción', icon: Video, color: 'text-purple-400' },
                            // DYNAMIC ROLE TABS
                            ...(selectedNode?.data?.responsibleZones || []).map(zoneId => {
                                const zone = CREATIVE_ZONES.find(z => z.id === zoneId);
                                if (!zone) return null;
                                return {
                                    id: `role_${zoneId}`,
                                    label: zone.label.split(' ')[0], // Short label
                                    icon: zone.icon,
                                    color: zone.color
                                };
                            }).filter(Boolean),
                            { id: 'output', label: 'Output', icon: Layout, color: 'text-amber-400' },
                            { id: 'estilo', label: 'Estilo', icon: Palette, color: 'text-sky-400' },
                            { id: 'distribución', label: 'Distribución', icon: Globe, color: 'text-emerald-400' },
                            { id: 'automatización', label: 'Automatización', icon: Zap, color: 'text-rose-400' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange && onTabChange(tab.id)}
                                className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all relative z-10 min-w-[70px] ${
                                    activeTab === tab.id ? (theme === 'dark' ? 'text-white' : 'text-indigo-600') : (theme === 'dark' ? 'text-gray-600 hover:text-gray-400' : 'text-slate-400 hover:text-slate-600')
                                }`}
                            >
                                <div className="transition-all duration-300">
                                    <tab.icon 
                                        className={`w-3.5 h-3.5 ${activeTab === tab.id ? (tab.id.startsWith('role_') ? '' : tab.color) : ''}`} 
                                        style={activeTab === tab.id && tab.id.startsWith('role_') ? { color: tab.color } : {}}
                                    />
                                </div>
                                <span className="text-[7px] font-black uppercase tracking-[0.1em]">{tab.label}</span>
                                 {activeTab === tab.id && (
                                    <motion.div 
                                        layoutId="activeTabProp"
                                        className={`absolute inset-0 border rounded-xl -z-10 shadow-lg ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200'}`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 🧊 Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative px-6 pt-6 pb-36">
                {!isNode ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                                <Link className="w-4 h-4" />
                            </div>
                            <h4 className="text-[10px] font-black text-white/90 uppercase tracking-[0.3em]">CONEXIÓN ESTRATÉGICA</h4>
                        </div>
                        <div className="p-5 rounded-[2rem] bg-[#0A0A14]/95 backdrop-blur-3xl border border-white/5 space-y-5">
                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                                Este conector representa el flujo estratégico entre dos nodos en la pizarra operativa.
                            </p>
                            <div className="space-y-2">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block pl-1">ID DEL CONECTOR</span>
                                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[9.5px] font-mono text-gray-400 uppercase select-all">
                                    {selectedEdge?.id}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block pl-1">ID DE ORIGEN (SOURCE)</span>
                                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[9.5px] font-mono text-gray-400 uppercase">
                                    {selectedEdge?.source}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block pl-1">ID DE DESTINO (TARGET)</span>
                                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[9.5px] font-mono text-gray-400 uppercase">
                                    {selectedEdge?.target}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                    {activeTab === 'estratégica' && (
                        <motion.div 
                            key="estratégica"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-8 pb-10"
                        >
                             {/* 1. OBJETIVO & DOLOR */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black italic" style={{ color: accentColor }}>01.</span>
                                    <h4 className={`text-[9px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>CIMIENTO ESTRATÉGICO</h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className={`text-[8px] font-black uppercase tracking-[0.2em] pl-1 transition-colors duration-500 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>TÍTULO DEL NODO</label>
                                        <input 
                                            type="text"
                                            value={selectedNode?.data?.title || ''}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, title: e.target.value })}
                                            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold transition-all placeholder:text-gray-800 ${
                                                theme === 'dark' 
                                                ? 'bg-white/[0.02] border-white/5 text-white focus:border-indigo-500/30' 
                                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-300 placeholder:text-slate-300'
                                            }`}
                                            placeholder="Nombre táctico..."
                                        />
                                    </div>

                                    <CustomSelect 
                                        label="FORMATO ESTRATÉGICO"
                                        value={selectedNode?.data?.laneId || ''}
                                        options={STRATEGIC_FORMATS}
                                        onChange={(val) => {
                                            const format = STRATEGIC_FORMATS.find(f => f.id === val);
                                            onUpdateNode(selectedNode.id, { 
                                                ...selectedNode.data, 
                                                laneId: val,
                                                masterType: format?.category || 'video'
                                            });
                                        }}
                                        icon={Layers}
                                        align="full"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <CustomSelect 
                                            label="FASE ESTRATÉGICA"
                                            value={selectedNode?.data?.funnelLevel || ''}
                                            options={Object.entries(NODE_CATEGORIES).map(([id, cat]) => ({
                                                id,
                                                label: cat.label,
                                                color: cat.color,
                                                icon: cat.icon,
                                                desc: cat.desc
                                            }))}
                                            onChange={(val) => onUpdateNode(selectedNode.id, { ...selectedNode.data, funnelLevel: val })}
                                            icon={Target}
                                            align="left"
                                        />
                                        <CustomSelect 
                                            label="TEMPERATURA AUD."
                                            value={selectedNode?.data?.customerTemp || 'Tibio'}
                                            options={TEMPS}
                                            onChange={(val) => onUpdateNode(selectedNode.id, { ...selectedNode.data, customerTemp: val })}
                                            icon={Thermometer}
                                            align="right"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    
                    {activeTab === 'producción' && (
                        <motion.div 
                            key="producción"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8 pb-10"
                        >
                             <div className="space-y-6">
                                 <div className="flex items-center gap-3">
                                     <span className="text-[10px] font-black text-purple-500 italic">02.</span>
                                     <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">PRODUCCIÓN Y ASIGNACIÓN</h4>
                                 </div>

                                 <div className="space-y-5">
                                     <div className="grid grid-cols-2 gap-4">
                                         {/* TALENTO ZONA CREATIVA */}
                                         <div className="space-y-2">
                                             <label className={`text-[8px] font-black uppercase tracking-[0.2em] pl-1 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>TALENTO ZONA CREATIVA</label>
                                             <div className="relative group/talent">
                                                 <button 
                                                     onClick={() => setShowTalentPicker(!showTalentPicker)}
                                                     className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 transition-all active:scale-95 min-h-[50px] ${
                                                         theme === 'dark' 
                                                         ? 'bg-white/[0.02] border-white/5 text-white hover:bg-white/5' 
                                                         : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                                                     }`}
                                                 >
                                                     <div className="flex items-center gap-2">
                                                         {selectedNode?.data?.assignedMemberName ? (
                                                             <>
                                                                 <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                                                     {selectedNode?.data?.assignedMemberName.charAt(0)}
                                                                 </div>
                                                                 <div className="text-left">
                                                                     <span className="text-xs font-bold block leading-none">{selectedNode?.data?.assignedMemberName}</span>
                                                                     <span className="text-[7.5px] font-bold text-gray-500 uppercase tracking-wider block mt-0.5">{selectedNode?.data?.assignedMemberRole || 'Equipo'}</span>
                                                                 </div>
                                                             </>
                                                         ) : (
                                                             <span className="text-[9px] font-black tracking-widest text-gray-500">SIN ASIGNAR</span>
                                                         )}
                                                     </div>
                                                     <Users className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                                 </button>

                                                 <AnimatePresence>
                                                     {showTalentPicker && (
                                                         <>
                                                             <div className="fixed inset-0 z-[120]" onClick={() => setShowTalentPicker(false)} />
                                                             <motion.div 
                                                                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                 className="absolute left-0 right-0 top-full mt-2 bg-[#0A0A1F]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-[130] p-2 max-h-[250px] overflow-y-auto custom-scrollbar w-[360px]"
                                                             >
                                                                 <div className="space-y-1">
                                                                     {sortedSquad.length === 0 ? (
                                                                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest p-3 text-center">No hay miembros disponibles</p>
                                                                     ) : (
                                                                         sortedSquad.map(m => {
                                                                             const isSelected = selectedNode.data?.assignedMemberId === m.id;
                                                                             const isDesigner = (m.role || '').toLowerCase().includes('diseñador') || (m.role || '').toLowerCase().includes('design');
                                                                             
                                                                             return (
                                                                                 <button 
                                                                                     key={m.id}
                                                                                     onClick={() => {
                                                                                         onUpdateNode(selectedNode.id, { 
                                                                                             ...selectedNode.data, 
                                                                                             assignedMemberId: m.id,
                                                                                             assignedMemberName: m.name,
                                                                                             assignedMemberRole: m.role
                                                                                         });
                                                                                         setShowTalentPicker(false);
                                                                                     }}
                                                                                     className={`flex items-center justify-between w-full p-2.5 rounded-xl transition-all hover:bg-white/5 group text-left ${isSelected ? 'bg-indigo-600/10 border border-indigo-500/20' : 'border border-transparent'}`}
                                                                                 >
                                                                                     <div className="flex items-center gap-2.5">
                                                                                         <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isDesigner ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                                                                                             {m.name?.charAt(0) || 'U'}
                                                                                         </div>
                                                                                         <div>
                                                                                             <span className={`text-[10px] font-black block leading-none ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{m.name}</span>
                                                                                             <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest block mt-0.5">{m.role}</span>
                                                                                         </div>
                                                                                     </div>
                                                                                     {isDesigner && (
                                                                                         <span className="text-[6.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">DISEÑADOR</span>
                                                                                     )}
                                                                                 </button>
                                                                             );
                                                                         })
                                                                     )}
                                                                 </div>
                                                             </motion.div>
                                                         </>
                                                     )}
                                                 </AnimatePresence>
                                             </div>
                                         </div>

                                         {/* GUÍA / GUIONES */}
                                         <div className="space-y-2">
                                             <label className={`text-[8px] font-black uppercase tracking-[0.2em] pl-1 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>GUÍA / GUIONES</label>
                                             <button 
                                                 onClick={() => {
                                                     toast.success('Abriendo Estudio Creativo 3D...');
                                                     router.push(`/dashboard/creative-3d?nodeId=${selectedNode.id}`);
                                                 }}
                                                 className={`w-full flex flex-col justify-center gap-1 border rounded-xl px-4 py-3 transition-all group overflow-hidden relative min-h-[50px] ${
                                                     theme === 'dark' 
                                                     ? 'bg-indigo-600/10 border-indigo-500/20 text-white hover:bg-indigo-600/20' 
                                                     : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                                                 }`}
                                             >
                                                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/5 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                 <div className="flex items-center justify-between w-full">
                                                     <div className="flex items-center gap-2">
                                                         <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                                         <span className="text-[10px] font-black tracking-widest">VER GUIÓN</span>
                                                     </div>
                                                     <div className="flex items-center gap-1 bg-indigo-500/20 px-1.5 py-0.5 rounded-full border border-indigo-500/10">
                                                         <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                                                         <span className="text-[6px] font-black text-indigo-300">LINK</span>
                                                     </div>
                                                 </div>
                                                 <div className="text-[7px] font-bold text-gray-500 uppercase tracking-tighter text-left">ESTUDIO CREATIVO 3D</div>
                                             </button>
                                         </div>
                                     </div>

                                     {/* MENSAJE CLAVE (HOOK) */}
                                     <div className="space-y-2">
                                         <label className={`text-[8px] font-black uppercase tracking-[0.2em] pl-1 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>MENSAJE CLAVE (HOOK)</label>
                                         <textarea 
                                             value={selectedNode?.data?.strategicInfo?.keyMessage || ''}
                                             onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                 ...selectedNode.data, 
                                                 strategicInfo: { ...(selectedNode.data?.strategicInfo || {}), keyMessage: e.target.value } 
                                             })}
                                             placeholder="Idea principal o gancho..."
                                             className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white h-20 resize-none focus:border-indigo-500/20 border-dashed"
                                         />
                                     </div>

                                     {/* ESTADO DEL CONTENIDO */}
                                     <div className="space-y-2">
                                         <label className="text-[8px] font-black text-gray-800 uppercase tracking-widest pl-1">ESTADO DEL CONTENIDO</label>
                                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                                            {Object.entries(CONTENT_STATUS).map(([id, s]) => (
                                                <button 
                                                    key={id} 
                                                    onClick={() => {
                                                        onUpdateNode(selectedNode.id, { ...selectedNode.data, status: id });
                                                        if (id === 'aprobado') {
                                                            // Logic for auto-sync to grid could be triggered here or in parent
                                                        }
                                                    }}
                                                    className={`px-4 py-2.5 rounded-xl border transition-all uppercase tracking-tighter text-[8px] font-black shrink-0 active:scale-95 ${selectedNode.data?.status === id ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-white/[0.02] border-white/5 text-gray-600 hover:text-gray-400 hover:bg-white/5'}`}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>


                                    {selectedNode.data?.masterType === 'video' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] pl-1">DURACIÓN ESTIMADA</label>
                                                <div className="relative group/sel">
                                                    <input 
                                                        type="text"
                                                        value={selectedNode?.data?.productionInfo?.duration || ''}
                                                        onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                            ...selectedNode.data, 
                                                            productionInfo: { ...(selectedNode.data?.productionInfo || {}), duration: e.target.value } 
                                                        })}
                                                        placeholder="Ej: 30s, 3min..."
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-gray-800"
                                                    />
                                                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
                                                </div>
                                            </div>
                                            <CustomSelect 
                                                label="FORMATO VIDEO"
                                                value={selectedNode?.data?.productionInfo?.format || 'Vertical'}
                                                options={[
                                                    { id: 'Vertical', label: '9:16 (Vertical)', icon: Video },
                                                    { id: 'Horizontal', label: '16:9 (Horizontal)', icon: Video },
                                                    { id: 'Cuadrado', label: '1:1 (Cuadrado)', icon: Layout }
                                                ]}
                                                onChange={(val) => onUpdateNode(selectedNode.id, { 
                                                    ...selectedNode.data, 
                                                    productionInfo: { ...(selectedNode.data?.productionInfo || {}), format: val } 
                                                })}
                                                icon={Video}
                                                align="right"
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] pl-1">DIMENSIONES (PX)</label>
                                                <input 
                                                    type="text"
                                                    value={selectedNode?.data?.productionInfo?.dimensions || '1080x1350'}
                                                    onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                        ...selectedNode.data, 
                                                        productionInfo: { ...(selectedNode.data?.productionInfo || {}), dimensions: e.target.value } 
                                                    })}
                                                    placeholder="Ej: 1080x1080"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] pl-1">PALETA / ESTILO</label>
                                                <input 
                                                    type="text"
                                                    value={selectedNode?.data?.productionInfo?.style || ''}
                                                    onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                        ...selectedNode.data, 
                                                        productionInfo: { ...(selectedNode.data?.productionInfo || {}), style: e.target.value } 
                                                    })}
                                                    placeholder="Ej: Dark, Minimal..."
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-gray-800"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] pl-1">REFERENCIAS VISUALES (LINK)</label>
                                        <input 
                                            type="text"
                                            value={selectedNode?.data?.productionInfo?.visualRef || ''}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                ...selectedNode.data, 
                                                productionInfo: { ...(selectedNode.data?.productionInfo || {}), visualRef: e.target.value } 
                                            })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-indigo-400 placeholder:text-gray-800"
                                            placeholder="Behance, Pinterest, Link..."
                                        />
                                              <div className={`p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden ${isGeneratingAI === 'script' ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-indigo-500/[0.03] border-indigo-500/10'}`}>
                                        {isGeneratingAI === 'script' && (
                                            <motion.div 
                                                initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent z-0"
                                            />
                                        )}
                                        <div className="flex items-center justify-between relative z-10">
                                             <label className="text-[8px] font-black text-indigo-400/80 uppercase tracking-widest">
                                                {selectedNode.data?.masterType === 'video' ? 'GUION / ESCALETA' : 'CONCEPTO / DESCRIPCIÓN VISUAL'}
                                             </label>
                                             <button 
                                                onClick={() => handleGenerateAI('script')}
                                                className={`p-1.5 rounded-lg transition-all ${isGeneratingAI === 'script' ? 'bg-indigo-500 text-white animate-pulse' : 'text-indigo-500 hover:bg-indigo-500/10'}`}
                                             >
                                                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI === 'script' ? 'animate-spin' : ''}`} />
                                             </button>
                                        </div>
                                        <textarea 
                                            value={isGeneratingAI === 'script' ? 'Generando estructura estratégica con Inteligencia Artificial...' : (selectedNode?.data?.productionInfo?.script || '')}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                ...selectedNode.data, 
                                                productionInfo: { ...(selectedNode.data?.productionInfo || {}), script: e.target.value } 
                                            })}
                                            placeholder={selectedNode.data?.masterType === 'video' ? "Pega aquí el guion o usa IA..." : "Describe la composición visual o prompt..."}
                                            className={`w-full bg-transparent border-none p-0 text-[10px] font-bold h-32 resize-none focus:outline-none placeholder:text-gray-800 leading-relaxed transition-colors relative z-10 ${isGeneratingAI === 'script' ? 'text-indigo-300' : 'text-gray-300'}`}
                                        />
                                    </div>
                                    
                                    {/* 🔄 FLUJOS ESPECÍFICOS POR ROL (INYECTADOS EN PRODUCCIÓN) */}
                                    {(selectedNode.data?.responsibleZones || []).includes('filmmaker') && (
                                        <div className="space-y-6 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Film className="w-3.5 h-3.5 text-purple-400" />
                                                <h4 className="text-[9px] font-black text-purple-400 uppercase tracking-widest">FLUJO: FILMMAKER PRO</h4>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-purple-500/[0.02] border border-purple-500/10 space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest ml-1">CÁMARA</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {['Sony', 'Canon', 'iPhone', 'Android'].map(cam => {
                                                                const isSelected = selectedNode.data?.filmmakerInfo?.equipment?.camera === cam;
                                                                return (
                                                                    <button key={cam} onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), equipment: { ...(selectedNode.data?.filmmakerInfo?.equipment || {}), camera: isSelected ? null : cam } } })} className={`px-2 py-1 rounded-md text-[7px] font-black transition-all border ${isSelected ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-white/[0.02] border-white/5 text-gray-600'}`}>{cam}</button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest ml-1">LUCES</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {['Softbox', 'RGB', 'Reflector'].map(light => {
                                                                const isSelected = (selectedNode.data?.filmmakerInfo?.equipment?.lights || []).includes(light);
                                                                return (
                                                                    <button key={light} onClick={() => { const current = selectedNode.data?.filmmakerInfo?.equipment?.lights || []; const next = isSelected ? current.filter(l => l !== light) : [...current, light]; onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), equipment: { ...(selectedNode.data?.filmmakerInfo?.equipment || {}), lights: next } } }); }} className={`px-2 py-1 rounded-md text-[7px] font-black transition-all border ${isSelected ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/[0.02] border-white/5 text-gray-600'}`}>{light}</button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-purple-400 uppercase tracking-widest pl-1">GUÍA DE GRABACIÓN</label>
                                                    <textarea value={selectedNode.data?.filmmakerInfo?.guide || ''} onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), guide: e.target.value } })} placeholder="Detalles técnicos..." className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-[10px] font-bold text-gray-300 h-24 resize-none focus:border-purple-500/20 leading-relaxed" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(selectedNode.data?.responsibleZones || []).includes('diseno') && (
                                        <div className="space-y-6 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Palette className="w-3.5 h-3.5 text-teal-400" />
                                                <h4 className="text-[9px] font-black text-teal-400 uppercase tracking-widest">FLUJO: DISEÑO GRÁFICO</h4>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-teal-500/[0.02] border border-teal-500/10 space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest pl-1">CONCEPTO DE PORTADA</label>
                                                    <input type="text" value={selectedNode.data?.designInfo?.cover || ''} onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, designInfo: { ...(selectedNode.data?.designInfo || {}), cover: e.target.value } })} placeholder="Título..." className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-gray-800" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-teal-400 uppercase tracking-widest pl-1">GUÍA DE DISEÑO</label>
                                                    <textarea value={selectedNode.data?.designInfo?.guide || ''} onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, designInfo: { ...(selectedNode.data?.designInfo || {}), guide: e.target.value } })} placeholder="Instrucciones visuales..." className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-[10px] font-bold text-gray-300 h-24 resize-none focus:border-teal-500/20 leading-relaxed" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                </div>
                             </div>
                        </motion.div>
                    )}

                    {activeTab === 'role_filmmaker' && (
                        <motion.div 
                            key="role_filmmaker"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                        <Film className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">WORKFLOW: FILMMAKER PRO</h4>
                                </div>

                                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-8">
                                    {/* 🎬 ESTADOS DE FILMAKER */}
                                    <div className="space-y-3">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-purple-500" />
                                            ESTADO DE PRODUCCIÓN
                                        </label>
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                            {[
                                                { id: 'grabacion', label: 'GRABACIÓN', color: 'bg-rose-500' },
                                                { id: 'grabado', label: 'GRABADO', color: 'bg-amber-500' },
                                                { id: 'entregado', label: 'ENTREGADO', color: 'bg-emerald-500' },
                                                { id: 'almacenado', label: 'ALMACENADO', color: 'bg-blue-500' }
                                            ].map(s => {
                                                const isSelected = selectedNode.data?.filmmakerInfo?.status === s.id;
                                                return (
                                                    <button 
                                                        key={s.id}
                                                        onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), status: s.id } })}
                                                        className={`px-4 py-2.5 rounded-xl border transition-all text-[8px] font-black uppercase tracking-tighter shrink-0 flex items-center gap-2 ${isSelected ? `${s.color} border-transparent text-white shadow-lg` : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'}`}
                                                    >
                                                        {isSelected && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
                                                        {s.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 📸 EQUIPO DE GRABACIÓN */}
                                    <div className="space-y-6">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                            EQUIPO DE GRABACIÓN
                                        </label>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* CÁMARA */}
                                            <div className="space-y-2">
                                                <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest ml-1">CÁMARA</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {['Sony', 'Canon', 'iPhone', 'Android'].map(cam => {
                                                        const isSelected = selectedNode.data?.filmmakerInfo?.equipment?.camera === cam;
                                                        return (
                                                            <button 
                                                                key={cam}
                                                                onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), equipment: { ...(selectedNode.data?.filmmakerInfo?.equipment || {}), camera: isSelected ? null : cam } } })}
                                                                className={`px-2 py-1 rounded-md text-[7px] font-black transition-all border ${isSelected ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-white/[0.02] border-white/5 text-gray-600'}`}
                                                            >
                                                                {cam}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* ILUMINACIÓN */}
                                            <div className="space-y-2">
                                                <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest ml-1">LUCES</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {['Softbox', 'RGB', 'Reflector'].map(light => {
                                                        const isSelected = (selectedNode.data?.filmmakerInfo?.equipment?.lights || []).includes(light);
                                                        return (
                                                            <button 
                                                                key={light}
                                                                onClick={() => {
                                                                    const current = selectedNode.data?.filmmakerInfo?.equipment?.lights || [];
                                                                    const next = isSelected ? current.filter(l => l !== light) : [...current, light];
                                                                    onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), equipment: { ...(selectedNode.data?.filmmakerInfo?.equipment || {}), lights: next } } });
                                                                }}
                                                                className={`px-2 py-1 rounded-md text-[7px] font-black transition-all border ${isSelected ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/[0.02] border-white/5 text-gray-600'}`}
                                                            >
                                                                {light}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* AUDIO */}
                                            <div className="space-y-2">
                                                <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest ml-1">AUDIO</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {['DJI Mic', 'Rhode', 'Lavalier'].map(audio => {
                                                        const isSelected = (selectedNode.data?.filmmakerInfo?.equipment?.audio || []).includes(audio);
                                                        return (
                                                            <button 
                                                                key={audio}
                                                                onClick={() => {
                                                                    const current = selectedNode.data?.filmmakerInfo?.equipment?.audio || [];
                                                                    const next = isSelected ? current.filter(a => a !== audio) : [...current, audio];
                                                                    onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), equipment: { ...(selectedNode.data?.filmmakerInfo?.equipment || {}), audio: next } } });
                                                                }}
                                                                className={`px-2 py-1 rounded-md text-[7px] font-black transition-all border ${isSelected ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/[0.02] border-white/5 text-gray-600'}`}
                                                            >
                                                                {audio}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* ACCESORIOS */}
                                            <div className="space-y-2">
                                                <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest ml-1">EXTRAS</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {['Trípode', 'Gimbal', 'Cables'].map(extra => {
                                                        const isSelected = (selectedNode.data?.filmmakerInfo?.equipment?.extras || []).includes(extra);
                                                        return (
                                                            <button 
                                                                key={extra}
                                                                onClick={() => {
                                                                    const current = selectedNode.data?.filmmakerInfo?.equipment?.extras || [];
                                                                    const next = isSelected ? current.filter(e => e !== extra) : [...current, extra];
                                                                    onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), equipment: { ...(selectedNode.data?.filmmakerInfo?.equipment || {}), extras: next } } });
                                                                }}
                                                                className={`px-2 py-1 rounded-md text-[7px] font-black transition-all border ${isSelected ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'bg-white/[0.02] border-white/5 text-gray-600'}`}
                                                            >
                                                                {extra}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 📋 GUÍA DE PRODUCCIÓN */}
                                    <div className="space-y-3">
                                        <label className="text-[8px] font-black text-purple-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <FileText className="w-3 h-3" />
                                            GUÍA DE PRODUCCIÓN / GRABACIÓN
                                        </label>
                                        <textarea 
                                            value={selectedNode.data?.filmmakerInfo?.guide || ''}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, filmmakerInfo: { ...(selectedNode.data?.filmmakerInfo || {}), guide: e.target.value } })}
                                            placeholder="Detalles técnicos de la toma, ángulos, movimientos..."
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-5 text-[10px] font-bold text-gray-300 h-44 resize-none focus:border-purple-500/20 leading-relaxed shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'role_diseno' && (
                        <motion.div 
                            key="role_diseno"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                                        <Palette className="w-4 h-4 text-teal-400" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">WORKFLOW: DISEÑO GRÁFICO</h4>
                                </div>

                                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-8">
                                    {/* 🎨 ESTADOS DE DISEÑO */}
                                    <div className="space-y-3">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-teal-500" />
                                            ESTADO DEL DISEÑO
                                        </label>
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                            {[
                                                { id: 'disenando', label: 'DISEÑANDO', color: 'bg-indigo-500' },
                                                { id: 'revision', label: 'REVISIÓN', color: 'bg-amber-500' },
                                                { id: 'aprobado', label: 'APROBADO', color: 'bg-emerald-500' },
                                                { id: 'entregado', label: 'ENTREGADO', color: 'bg-blue-500' }
                                            ].map(s => {
                                                const isSelected = selectedNode.data?.designInfo?.status === s.id;
                                                return (
                                                    <button 
                                                        key={s.id}
                                                        onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, designInfo: { ...(selectedNode.data?.designInfo || {}), status: s.id } })}
                                                        className={`px-4 py-2.5 rounded-xl border transition-all text-[8px] font-black uppercase tracking-tighter shrink-0 flex items-center gap-2 ${isSelected ? `${s.color} border-transparent text-white shadow-lg` : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'}`}
                                                    >
                                                        {isSelected && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
                                                        {s.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest pl-1">PORTADA / MINIATURA (CONCEPTO)</label>
                                        <input 
                                            type="text"
                                            value={selectedNode.data?.designInfo?.cover || ''}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, designInfo: { ...(selectedNode.data?.designInfo || {}), cover: e.target.value } })}
                                            placeholder="Título de la portada, elementos clave..."
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-gray-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-teal-400 uppercase tracking-widest pl-1">GUÍA DE DISEÑO / ESTILO</label>
                                        <textarea 
                                            value={selectedNode.data?.designInfo?.guide || ''}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { ...selectedNode.data, designInfo: { ...(selectedNode.data?.designInfo || {}), guide: e.target.value } })}
                                            placeholder="Instrucciones para la portada, fuentes, colores específicos..."
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-5 text-[10px] font-bold text-gray-300 h-44 resize-none focus:border-teal-500/20 leading-relaxed shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'output' && (
                        <motion.div 
                            key="output"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-amber-500 italic">03.</span>
                                    <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">PIEZA FINAL (DELIVERY)</h4>
                                </div>

                                <div className="space-y-5">
                                    {/* 📦 VISUAL DELIVERABLE VIEWER (IMAGE / VIDEO / LINK) */}
                                    <div className="space-y-3">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] pl-1">VISTA PREVIA DEL ENTREGABLE</label>
                                        
                                        {selectedNode?.data?.outputInfo?.fileUrl ? (
                                            <div className="space-y-4">
                                                {/* Asset container */}
                                                <div className="relative group/preview rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner flex items-center justify-center p-2 min-h-[150px]">
                                                    {(() => {
                                                        const url = selectedNode?.data?.outputInfo?.fileUrl || '';
                                                        const isImage = typeof url === 'string' && (url.startsWith('data:image') || /\.(png|jpg|jpeg|gif|webp|svg)/i.test(url));
                                                        const isVideo = typeof url === 'string' && (url.startsWith('data:video') || /\.(mp4|webm|mov|ogg)/i.test(url));

                                                        if (isImage) {
                                                            return (
                                                                <img 
                                                                    src={url} 
                                                                    alt="Entregable" 
                                                                    className="w-full max-h-[220px] object-contain rounded-xl"
                                                                />
                                                            );
                                                        } else if (isVideo) {
                                                            return (
                                                                <video 
                                                                    src={url} 
                                                                    controls 
                                                                    className="w-full max-h-[220px] rounded-xl"
                                                                />
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                                                    <FileText className="w-10 h-10 text-amber-500 mb-3" />
                                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest block truncate max-w-[200px]">
                                                                        {url.includes('drive.google.com') ? 'Google Drive Link' : 'Enlace del Entregable'}
                                                                    </span>
                                                                    <a 
                                                                        href={url} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer" 
                                                                        className="mt-3 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-black uppercase tracking-widest text-[8px] rounded-lg border border-amber-500/10 transition-all inline-flex items-center gap-1.5"
                                                                    >
                                                                        Abrir Enlace <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                    
                                                    {/* Quick actions overlay */}
                                                    <div className="absolute top-3 right-3 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => {
                                                                onUpdateNode(selectedNode?.id, {
                                                                    ...selectedNode?.data,
                                                                    outputInfo: {
                                                                        ...(selectedNode?.data?.outputInfo || {}),
                                                                        fileUrl: null
                                                                    }
                                                                });
                                                                toast.info("Enlace de entregable removido.");
                                                            }}
                                                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-all shadow-lg"
                                                            title="Eliminar Entregable"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Adjustments & Feedback card */}
                                                <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em] pl-1">AJUSTES & RETROALIMENTACIÓN</label>
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedNode.data?.status === 'aprobado' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                                            <span className="text-[6px] font-black text-gray-500 uppercase tracking-widest">{selectedNode.data?.status || 'Pendiente'}</span>
                                                        </div>
                                                    </div>
                                                    <textarea 
                                                        value={selectedNode?.data?.outputInfo?.feedback || ''}
                                                        onChange={(e) => onUpdateNode(selectedNode.id, {
                                                            ...selectedNode.data,
                                                            outputInfo: { ...(selectedNode.data?.outputInfo || {}), feedback: e.target.value }
                                                        })}
                                                        placeholder="Describe detalladamente los cambios o correcciones requeridas para el creativo..."
                                                        className="w-full bg-[#050511]/60 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white h-24 resize-none focus:border-amber-500/20 leading-relaxed placeholder:text-gray-800"
                                                    />
                                                    <div className="grid grid-cols-2 gap-3 pt-1">
                                                        <button 
                                                            onClick={() => {
                                                                onUpdateNode(selectedNode.id, {
                                                                    ...selectedNode.data,
                                                                    status: 'produccion'
                                                                });
                                                                toast.success("Solicitud de cambios enviada al equipo creativo.");
                                                            }}
                                                            className="py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase tracking-widest text-[8px] hover:bg-red-500/20 active:scale-95 transition-all text-center"
                                                        >
                                                            Solicitar Ajustes
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                onUpdateNode(selectedNode.id, {
                                                                    ...selectedNode.data,
                                                                    status: 'aprobado'
                                                                });
                                                                toast.success("¡Entregable aprobado con éxito!");
                                                            }}
                                                            className="py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black uppercase tracking-widest text-[8px] hover:bg-emerald-500/30 active:scale-95 transition-all text-center"
                                                        >
                                                            Aprobar Pieza
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-6 text-center hover:bg-white/[0.02] hover:border-amber-500/30 transition-all cursor-pointer relative group">
                                                <UploadCloud className="w-8 h-8 text-gray-700 group-hover:text-amber-500 mx-auto mb-2 transition-colors" />
                                                <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">SUBIR PIEZA FINAL</h5>
                                                <p className="text-[8.5px] text-gray-600 font-bold uppercase tracking-wider mt-1">Arrastra o haz clic para subir imagen o video de prueba</p>
                                                <input 
                                                    type="file" 
                                                    accept="image/*,video/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                onUpdateNode(selectedNode?.id, {
                                                                    ...selectedNode?.data,
                                                                    outputInfo: {
                                                                        ...(selectedNode?.data?.outputInfo || {}),
                                                                        fileUrl: event.target.result
                                                                    }
                                                                });
                                                                toast.success("Archivo de vista previa subido.");
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <div className="mt-4 pt-4 border-t border-white/5">
                                                    <span className="text-[7.5px] font-black text-gray-600 uppercase tracking-widest block mb-2">O VINCULAR ENLACE DIRECTO (DRIVE / WEB)</span>
                                                    <input 
                                                        type="text"
                                                        placeholder="Pega la URL y presiona Enter..."
                                                        className="w-full bg-[#050511] border border-white/5 rounded-xl px-4 py-2.5 text-[9px] font-bold text-white outline-none focus:border-amber-500/30 placeholder:text-gray-800"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                onUpdateNode(selectedNode?.id, {
                                                                    ...selectedNode?.data,
                                                                    outputInfo: {
                                                                        ...(selectedNode?.data?.outputInfo || {}),
                                                                        fileUrl: e.target.value
                                                                    }
                                                                });
                                                                toast.success("Enlace de entregable vinculado.");
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full h-px bg-white/5 my-4" />

                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] pl-1">COPYWRITING DE POST</label>
                                        <textarea 
                                            value={selectedNode?.data?.outputInfo?.copy || ''}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                ...selectedNode.data, 
                                                outputInfo: { ...(selectedNode.data?.outputInfo || {}), copy: e.target.value } 
                                            })}
                                            placeholder="El pie de foto / descripción final..."
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white h-32 resize-none focus:border-amber-500/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] pl-1">CALL TO ACTION (CTA)</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={selectedNode?.data?.outputInfo?.cta || ''}
                                                onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                    ...selectedNode.data, 
                                                    outputInfo: { ...(selectedNode.data?.outputInfo || {}), cta: e.target.value } 
                                                })}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-12 py-3 text-[10px] font-black text-amber-400 placeholder:text-gray-800 uppercase tracking-widest"
                                                placeholder="Ej: HAZ CLIC EN EL LINK"
                                            />
                                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 opacity-40" />
                                        </div>
                                    </div>

                                    <CustomSelect 
                                        label="FORMATO DE ENTREGA"
                                        value={selectedNode?.data?.outputInfo?.finalFormat || (selectedNode.data?.masterType === 'video' ? 'MP4 4K' : 'PNG')}
                                        options={selectedNode.data?.masterType === 'video' ? [
                                            { id: 'MP4 4K', label: 'Video MP4 (4K)', icon: Video },
                                            { id: 'MP4 1080', label: 'Video MP4 (1080p)', icon: Video },
                                            { id: 'MOV Prores', label: 'MOV Apple ProRes', icon: Video },
                                            { id: 'PDF', label: 'Documento PDF', icon: Link }
                                        ] : [
                                            { id: 'PNG', label: 'Imagen PNG (High Res)', icon: Layout },
                                            { id: 'JPG', label: 'Imagen JPG (Optimized)', icon: Layout },
                                            { id: 'WEBP', label: 'WebP (Next-Gen)', icon: Globe },
                                            { id: 'PDF', label: 'Documento PDF', icon: Link }
                                        ]}
                                        onChange={(val) => onUpdateNode(selectedNode.id, { 
                                            ...selectedNode.data, 
                                            outputInfo: { ...(selectedNode.data?.outputInfo || {}), finalFormat: val } 
                                        })}
                                        icon={Layout}
                                        align="full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'memory' && (
                        <motion.div 
                            key="memory"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-cyan-500 italic">01.</span>
                                    <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">MEMORY VAULT</h4>
                                </div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                                    Vincula archivos, referencias y assets de producción directamente a este nodo.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Search Assets */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Search className="w-3.5 h-3.5 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="BUSCAR EN DIICZONE CLOUD / DRIVE..." 
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-[10px] font-black text-white focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-gray-800 tracking-widest uppercase"
                                    />
                                </div>

                                {/* Linked Files List */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <h5 className="text-[8px] font-black text-gray-800 uppercase tracking-[0.2em]">ARCHIVOS VINCULADOS</h5>
                                        <span className="text-[8px] font-black text-cyan-500 uppercase">{(selectedNode.data?.memoryLinks || []).length} ITEMS</span>
                                    </div>

                                    {(selectedNode.data?.memoryLinks || []).length > 0 ? (
                                        <div className="space-y-2">
                                            {(selectedNode.data?.memoryLinks || []).map((link, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all group/link">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-cyan-400">
                                                            {link.type === 'drive' ? <Database className="w-3.5 h-3.5" /> : link.type === 'video' ? <Video className="w-3.5 h-3.5" /> : link.type === 'image' ? <Layout className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className="max-w-[160px]">
                                                            <h6 className="text-[10px] font-black text-white truncate uppercase tracking-tight">{link.label || link.name}</h6>
                                                            <p className="text-[7px] text-gray-600 font-bold uppercase mt-0.5">{link.path || link.size || 'Vínculo Externo'}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            const newLinks = [...(selectedNode.data?.memoryLinks || [])];
                                                            newLinks.splice(i, 1);
                                                            onUpdateNode(selectedNode.id, { ...selectedNode.data, memoryLinks: newLinks });
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-rose-500/10 text-gray-700 hover:text-rose-500 transition-all opacity-0 group-hover/link:opacity-100"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-10 rounded-[2rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.01]">
                                            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/5">
                                                {isConnectingCloud ? <RefreshCw className="w-5 h-5 text-cyan-500 animate-spin" /> : <Box className="w-5 h-5 text-gray-800" />}
                                            </div>
                                            <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest leading-relaxed">
                                                {isConnectingCloud ? 'Sincronizando con Diiczone Cloud...' : 'No hay activos vinculados aún.'}
                                            </p>
                                            <button 
                                                onClick={handleCloudConnect}
                                                disabled={isConnectingCloud}
                                                className={`px-5 py-2.5 rounded-xl border text-[8px] font-black transition-all uppercase tracking-widest ${isConnectingCloud ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                            >
                                                {isConnectingCloud ? 'ESTABLECIENDO CONEXIÓN...' : 'EXPLORAR NUBE'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Storage Status */}
                            <div className="p-5 rounded-[1.5rem] bg-indigo-500/5 border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Estado de Almacenamiento</span>
                                    </div>
                                    <span className="text-[9px] font-black text-gray-600 uppercase">45% USADO</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-px border border-white/5">
                                    <div className="h-full w-[45%] bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'distribución' && (
                        <motion.div 
                            key="distribución"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-emerald-500 italic">05.</span>
                                    <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">OMNICANALIDAD</h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-1">
                                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">COMPARTIR EN redes sociales</label>
                                        <span className="text-[9px] font-bold text-gray-400 pl-1 uppercase">Selecciona las plataformas de difusión y programa su fecha</span>
                                    </div>
                                    
                                    <div className="space-y-3.5">
                                        {[
                                            { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E1306C' },
                                            { id: 'tiktok', label: 'TikTok', icon: Music, color: '#00F2FE' },
                                            { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000' },
                                            { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' }
                                        ].map(plat => {
                                            const isActive = (selectedNode.data?.distribution || []).includes(plat.id);
                                            const scheduleDate = selectedNode.data?.distributionDates?.[plat.id] || '';
                                            return (
                                                <div 
                                                    key={plat.id}
                                                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                                                        isActive 
                                                        ? 'bg-emerald-500/[0.04] border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.05)]' 
                                                        : 'bg-white/[0.02] border-white/5 opacity-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                className="p-2 rounded-lg" 
                                                                style={{ backgroundColor: isActive ? `${plat.color}15` : 'rgba(255,255,255,0.03)' }}
                                                            >
                                                                <plat.icon className="w-4 h-4" style={{ color: isActive ? plat.color : '#64748b' }} />
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-500'}`}>{plat.label}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                const current = selectedNode.data?.distribution || [];
                                                                const next = isActive ? current.filter(id => id !== plat.id) : [...current, plat.id];
                                                                onUpdateNode(selectedNode.id, { 
                                                                    ...selectedNode.data, 
                                                                    distribution: next 
                                                                });
                                                            }}
                                                            className={`w-9 h-5 rounded-full relative transition-all ${isActive ? 'bg-emerald-500' : 'bg-white/10'}`}
                                                        >
                                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isActive ? 'right-1' : 'left-1'}`} />
                                                        </button>
                                                    </div>

                                                    <AnimatePresence>
                                                        {isActive && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, height: 0 }} 
                                                                animate={{ opacity: 1, height: 'auto' }} 
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="overflow-hidden space-y-1.5 pt-1"
                                                            >
                                                                <label className="text-[7.5px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1 pl-1">
                                                                    <Clock className="w-3 h-3 text-emerald-400" />
                                                                    Fecha y Hora de Publicación
                                                                </label>
                                                                <input 
                                                                    type="datetime-local"
                                                                    value={scheduleDate}
                                                                    onChange={(e) => {
                                                                        const currentDates = selectedNode.data?.distributionDates || {};
                                                                        onUpdateNode(selectedNode.id, {
                                                                            ...selectedNode.data,
                                                                            distributionDates: {
                                                                                ...currentDates,
                                                                                [plat.id]: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono cursor-pointer"
                                                                />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-8 p-5 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/10 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">IA SMART SCHEDULING</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-bold leading-relaxed italic">
                                            "Para maximizar el impacto en {selectedNode.data?.funnelLevel || 'esta fase'}, el algoritmo sugiere publicar el Martes a las 18:00h CST."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'automatización' && (
                        <motion.div 
                            key="automatización"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-rose-500 italic">06.</span>
                                    <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">INTENCIÓN DE CRECIMIENTO</h4>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-gray-800 uppercase tracking-widest pl-1">FLUJO POST-CONTENIDO</label>
                                        <textarea 
                                            value={selectedNode?.data?.automation?.intent || ''}
                                            onChange={(e) => onUpdateNode(selectedNode.id, { 
                                                ...selectedNode.data, 
                                                automation: { ...(selectedNode.data?.automation || {}), intent: e.target.value } 
                                            })}
                                            placeholder="Ej: Si comentan 'QUIERO', enviar link de registro..."
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-4 text-xs font-bold text-white h-24 resize-none focus:border-rose-500/30 shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { id: 'crmSync', label: 'Sincronizar con CRM', icon: Database, desc: 'Añadir lead a la base de datos' },
                                            { id: 'chatbotActive', label: 'Activar Chatbot de Venta', icon: Cpu, desc: 'Detección de palabras clave' }
                                        ].map(opt => (
                                            <div key={opt.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0F] border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${selectedNode.data?.automation?.[opt.id] ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-gray-600'}`}>
                                                        <opt.icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-white/90 uppercase tracking-tight">{opt.label}</p>
                                                        <p className="text-[8px] text-gray-600 font-bold uppercase mt-0.5">{opt.desc}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const current = selectedNode.data?.automation || {};
                                                        onUpdateNode(selectedNode.id, { 
                                                            ...selectedNode.data, 
                                                            automation: { ...current, [opt.id]: !current[opt.id] } 
                                                        });
                                                    }}
                                                    className={`w-10 h-5 rounded-full relative transition-all ${selectedNode.data?.automation?.[opt.id] ? 'bg-rose-500' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${selectedNode.data?.automation?.[opt.id] ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'estilo' && (
                        <motion.div 
                            key="estilo"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-sky-500 italic">01.</span>
                                    <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">PALETA PREMIUM NEÓN</h4>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { id: 'cyan', color: '#22d3ee', label: 'Cyber' },
                                        { id: 'emerald', color: '#10b981', label: 'Growth' },
                                        { id: 'amber', color: '#f59e0b', label: 'Focus' },
                                        { id: 'rose', color: '#f43f5e', label: 'Critical' },
                                        { id: 'purple', color: '#a855f7', label: 'Insight' },
                                        { id: 'indigo', color: '#6366f1', label: 'System' },
                                        { id: 'lime', color: '#a3ff00', label: 'Active' },
                                        { id: 'white', color: '#ffffff', label: 'Light' }
                                    ].map(c => {
                                        const nodeColor = selectedNode?.data?.color || selectedNode?.data?.labelColor || '#6366f1';
                                        const isSelected = nodeColor === c.color;
                                        return (
                                            <button 
                                                key={c.id}
                                                onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, color: c.color, labelColor: c.color })}
                                                className={`group relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                                                    isSelected ? 'bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                <div 
                                                    className="w-10 h-10 rounded-full shadow-lg transition-transform group-hover:scale-110"
                                                    style={{ 
                                                        backgroundColor: c.color,
                                                        boxShadow: `0 0 15px ${c.color}40, inset 0 0 10px rgba(0,0,0,0.2)`
                                                    }}
                                                />
                                                <span className="text-[7px] font-black uppercase tracking-tighter text-gray-600 group-hover:text-white transition-colors">{c.label}</span>
                                                {isSelected && (
                                                    <motion.div layoutId="colorActive" className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#050511] flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-sky-500 italic">02.</span>
                                        <h4 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">CONFIGURACIÓN DE NODO</h4>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                                            <div>
                                                <p className="text-[10px] font-black text-white/90 uppercase tracking-tight">RESPLANDOR ACTIVO (GLOW)</p>
                                                <p className="text-[8px] text-gray-600 font-bold uppercase mt-0.5">Efecto especial de iluminación</p>
                                            </div>
                                            <button 
                                                onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, hasGlow: !selectedNode.data?.hasGlow })}
                                                className={`w-10 h-5 rounded-full relative transition-all ${selectedNode.data?.hasGlow ? 'bg-sky-500' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${selectedNode.data?.hasGlow ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                                            <div>
                                                <p className="text-[10px] font-black text-white/90 uppercase tracking-tight">VISIBILIDAD EN GRID</p>
                                                <p className="text-[8px] text-gray-600 font-bold uppercase mt-0.5">Sincronización con tablero principal</p>
                                            </div>
                                            <button 
                                                onClick={() => onUpdateNode(selectedNode.id, { ...selectedNode.data, isHidden: !selectedNode.data?.isHidden })}
                                                className={`w-10 h-5 rounded-full relative transition-all ${!selectedNode.data?.isHidden ? 'bg-indigo-500' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${!selectedNode.data?.isHidden ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                )}
            </div>

            {/* Custom Resizing Handle */}
            <div 
                className="absolute bottom-3 right-3 w-5 h-5 cursor-se-resize flex items-end justify-end select-none pointer-events-auto z-[200] group-hover:opacity-100 opacity-60 transition-opacity"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startWidth = panelSize?.width || 320;
                    const startHeight = panelSize?.height || 750;

                    const onMouseMove = (moveEvent) => {
                        const newWidth = Math.max(300, Math.min(800, startWidth + (moveEvent.clientX - startX)));
                        const newHeight = Math.max(400, Math.min(1000, startHeight + (moveEvent.clientY - startY)));
                        setPanelSize({ width: newWidth, height: newHeight });
                    };

                    const onMouseUp = () => {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                }}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-500 hover:text-indigo-400 transition-colors pointer-events-none mr-0.5 mb-0.5">
                    <path d="M12,0 L0,12 M12,4 L4,12 M12,8 L8,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

        </aside>
    );
}

