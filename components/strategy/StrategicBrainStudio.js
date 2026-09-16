'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bot, Send, Sparkles, Folder, RefreshCw, Copy, Check, 
    Lightbulb, ShieldCheck, Target, Zap, MessageSquare, 
    HelpCircle, ChevronRight, Maximize2, Minimize2, Plus,
    Globe, Instagram, Facebook, Link as LinkIcon, FileText,
    Brain, Network, TrendingUp, CheckCircle2, X, Activity,
    Layers, Search, Compass, BookOpen, User, Flame, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function StrategicBrainStudio({
    profile = {},
    savedResearches = [],
    researchFolders = [],
    clientData = null,
    onUpdateProfile = () => {},
    theme = 'dark'
}) {
    const safeProfile = profile || {};
    const safeResearches = Array.isArray(savedResearches) ? savedResearches : [];

    // 1. SOURCES STATE
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSourceIds, setSelectedSourceIds] = useState(['profile_core']);

    // 2. CHAT STATE
    const clientName = (
        safeProfile.brandName || 
        safeProfile.leadership || 
        clientData?.name || 
        'Marca DIIC'
    ).replace(/[-_\s]+workspace\s*$/i, '').trim();

    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'ai',
            text: `¡Bienvenido al **Cerebro Estratégico 360°** de **${clientName}**!\n\nEstoy conectado a las **fuentes de mercado, redes auditadas e investigaciones estratégicas** guardadas. \n\nPuedes preguntarme sobre objeciones de clientes, ganchos para Reels, ventajas competitivas o explorar el **Mapa Mental** a la derecha.`,
            createdAt: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const chatEndRef = useRef(null);

    // 3. STUDIO TOOL STATE: 'mindmap' | 'roadmap' | 'dossier'
    const [activeStudioTool, setActiveStudioTool] = useState('mindmap');
    const [selectedMindNode, setSelectedMindNode] = useState(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isChatting]);

    // Build Sources List dynamically with 100% defensive checks
    const allSources = useMemo(() => {
        const list = [
            {
                id: 'profile_core',
                title: `Ficha Nuclear: ${clientName}`,
                type: 'profile',
                icon: ShieldCheck,
                badge: 'Identidad 360°',
                desc: typeof safeProfile.whatItDoes === 'string' && safeProfile.whatItDoes ? safeProfile.whatItDoes : 'Actividad principal y propuesta de valor de la marca',
                tags: ['Estrategia', 'Identidad', 'Propuesta de Valor']
            }
        ];

        if (safeProfile.instagramUrl) {
            list.push({
                id: 'social_ig',
                title: 'Instagram Auditado',
                type: 'social',
                icon: Instagram,
                badge: 'Red Social',
                desc: String(safeProfile.instagramUrl),
                tags: ['Reels', 'Casos Clínicos', 'Testimonios']
            });
        }

        if (safeProfile.facebookUrl) {
            list.push({
                id: 'social_fb',
                title: 'Facebook Page',
                type: 'social',
                icon: Facebook,
                badge: 'Red Social',
                desc: String(safeProfile.facebookUrl),
                tags: ['Comunidad', 'Pacientes Locales']
            });
        }

        if (safeProfile.websiteUrl || safeProfile.website) {
            list.push({
                id: 'social_web',
                title: 'Sitio Web Oficial',
                type: 'web',
                icon: Globe,
                badge: 'Activo Web',
                desc: String(safeProfile.websiteUrl || safeProfile.website),
                tags: ['Servicios', 'Ubicación', 'Citas']
            });
        }

        // Add saved researches safely
        safeResearches.forEach((res, idx) => {
            if (!res) return;
            const queryText = (typeof res.query === 'string' && res.query) 
                ? res.query 
                : (typeof res.title === 'string' && res.title ? res.title : `Investigación #${idx + 1}`);
                
            let descText = 'Análisis estratégico guardado.';
            if (typeof res.summary === 'string' && res.summary) {
                descText = res.summary;
            } else if (typeof res.content === 'string' && res.content) {
                descText = res.content.substring(0, 90) + '...';
            } else if (res.overview && typeof res.overview === 'string') {
                descText = res.overview;
            }

            list.push({
                id: `res_${res.id || idx}`,
                title: queryText,
                type: 'research',
                icon: BookOpen,
                badge: res.folderName || 'Mercado',
                desc: descText,
                tags: ['Nicho', 'Competencia', 'Palabras Clave']
            });
        });

        return list;
    }, [safeProfile, safeResearches, clientName]);

    // Filtered sources
    const filteredSources = useMemo(() => {
        if (!Array.isArray(allSources)) return [];
        if (!searchQuery || !searchQuery.trim()) return allSources;
        const q = searchQuery.toLowerCase();
        return allSources.filter(s => 
            (s.title && String(s.title).toLowerCase().includes(q)) || 
            (s.desc && String(s.desc).toLowerCase().includes(q)) ||
            (Array.isArray(s.tags) && s.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q)))
        );
    }, [allSources, searchQuery]);

    const toggleSourceSelection = (id) => {
        setSelectedSourceIds(prev => 
            prev.includes(id) 
                ? (prev.length > 1 ? prev.filter(x => x !== id) : prev)
                : [...prev, id]
        );
    };

    // Quick Prompts
    const promptChips = [
        { label: '🎯 Objeciones de Clientes', query: `¿Cuáles son los 3 mayores miedos u objeciones que tienen los clientes antes de comprar o contratar en ${clientName} y cómo responderles estratégicamente?` },
        { label: '🔥 5 Ganchos para Reels', query: `Genera 5 ganchos de alta retención (0-3 segundos) para Reels adaptados a la propuesta de valor de ${clientName}.` },
        { label: '💎 Propuesta Única de Valor', query: `Resume en 3 líneas contundentes por qué elegir a ${clientName} es superior a las alternativas de la competencia.` },
        { label: '💬 Guion de Cierre WhatsApp', query: `Escribe una secuencia de 3 mensajes persuasivos para WhatsApp de ${clientName} cuando un prospecto solicita precios o información.` }
    ];

    // Handle Send Message
    const handleSendMessage = async (customQuery) => {
        const text = customQuery || input;
        if (!text || !text.trim() || isChatting) return;

        const userMsg = {
            id: `msg_${Date.now()}`,
            sender: 'user',
            text: text.trim(),
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsChatting(true);

        const activeSourcesData = allSources.filter(s => selectedSourceIds.includes(s.id));

        try {
            const res = await fetch('/api/ai/strategy/brain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'chat',
                    message: text.trim(),
                    history: messages.slice(-6),
                    clientName,
                    profile: safeProfile,
                    researches: safeResearches,
                    activeSources: activeSourcesData
                })
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Error al procesar consulta');
            }

            const aiMsg = {
                id: `msg_ai_${Date.now()}`,
                sender: 'ai',
                text: typeof data.reply === 'string' ? data.reply : JSON.stringify(data.reply),
                sourcesUsed: activeSourcesData.length,
                createdAt: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('[StrategicBrainStudio] Chat Error:', err);
            toast.error('Error al consultar el Cerebro IA: ' + err.message);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg_err_${Date.now()}`,
                    sender: 'ai',
                    text: `⚠️ No se pudo procesar la consulta en este momento (${err.message}). Por favor intenta de nuevo.`,
                    createdAt: new Date().toISOString()
                }
            ]);
        } finally {
            setIsChatting(false);
        }
    };

    const handleCopy = (id, text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Copiado al portapapeles');
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Mind Map Nodes Definition
    const mindMapData = useMemo(() => {
        return {
            center: {
                id: 'center',
                title: clientName,
                subtitle: 'Traumatología & Artroscopia',
                badge: 'CORE'
            },
            branches: [
                {
                    id: 'b_especialidad',
                    title: 'Especialidad & Estudios',
                    color: 'indigo',
                    icon: ShieldCheck,
                    items: [
                        'Cirugía Artroscópica Mínimamente Invasiva',
                        'Reemplazos Articulares & Prótesis',
                        'Terapias Regenerativas & Viscosuplementación',
                        'Traumatología Deportiva de Alta Complejidad'
                    ]
                },
                {
                    id: 'b_patologias',
                    title: 'Patologías & Dolores',
                    color: 'fuchsia',
                    icon: Target,
                    items: [
                        'Lesión de Meniscos & Ligamento Cruzado (LCA)',
                        'Manguito Rotador & Inestabilidad de Hombro',
                        'Artrosis, Desgaste de Cartílago & Dolor Limitante',
                        'Rigidez Articular en Deportistas & Adultos'
                    ]
                },
                {
                    id: 'b_valor',
                    title: 'Propuesta de Valor',
                    color: 'emerald',
                    icon: Zap,
                    items: [
                        'Sin incisiones agresivas ni cirugías abiertas',
                        'Recuperación acelerada y retorno a la vida activa',
                        'Diagnóstico certero con precisión artroscópica',
                        'Acompañamiento clínico empático y personalizado'
                    ]
                },
                {
                    id: 'b_captacion',
                    title: 'Ecosistema de Captación',
                    color: 'amber',
                    icon: TrendingUp,
                    items: [
                        'Reels Educativos & Casos de Éxito Reales',
                        'Meta Ads hiperlocales (Santo Domingo & Ecuador)',
                        'Cierre y triaje cualificado por WhatsApp',
                        'Embudo de Pacientes Nuevos & Valoraciones'
                    ]
                }
            ]
        };
    }, [clientName]);

    return (
        <div className="w-full space-y-4">
            {/* NOTEBOOKLM 3-COLUMN STUDIO CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#080914]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 md:p-6 shadow-2xl relative overflow-hidden min-h-[600px]">
                {/* Ambient glow */}
                <div className="absolute top-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                {/* 1. LEFT COLUMN: FUENTES & CONOCIMIENTO */}
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">Fuentes del Cerebro</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            {selectedSourceIds.length}/{allSources.length} Activas
                        </span>
                    </div>

                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            placeholder="Filtrar fuentes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/40"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[440px]">
                        {filteredSources.map((source) => {
                            const isSelected = selectedSourceIds.includes(source.id);
                            const Icon = source.icon;
                            return (
                                <div 
                                    key={source.id}
                                    onClick={() => toggleSourceSelection(source.id)}
                                    className={`p-2.5 rounded-xl border transition-all cursor-pointer group text-left ${
                                        isSelected 
                                            ? 'bg-indigo-600/15 border-indigo-500/40 shadow-sm' 
                                            : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                                isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-500'
                                            }`}>
                                                <Icon size={12} />
                                            </div>
                                            <span className="text-xs font-bold text-white tracking-tight truncate max-w-[130px]">
                                                {source.title}
                                            </span>
                                        </div>
                                        <input 
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}} 
                                            className="rounded border-white/20 bg-black/40 text-indigo-600 focus:ring-0 cursor-pointer mt-1"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium line-clamp-2 pl-8">
                                        {source.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={() => toast.info("Para vincular más fuentes, utiliza el escáner de 'Estudio de Mercado' o agrega investigaciones.")}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Plus size={13} />
                        <span>Vincular Nueva Fuente</span>
                    </button>
                </div>

                {/* 2. CENTER COLUMN: CEREBRO IA CHAT */}
                <div className="lg:col-span-4 xl:col-span-5 flex flex-col bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
                                <Bot size={14} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-white uppercase tracking-wider">DIIC Brain IA</h3>
                                <p className="text-[9px] text-gray-400 font-medium">Razonamiento con {selectedSourceIds.length} fuentes activas</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setMessages([messages[0]])}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all text-[10px] flex items-center gap-1 font-bold"
                            title="Limpiar chat"
                        >
                            <RefreshCw size={12} />
                            <span>Reiniciar</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[360px] min-h-[300px]">
                        {messages.map((msg) => {
                            const isUser = msg.sender === 'user';
                            const msgText = String(msg.text || '');
                            return (
                                <div 
                                    key={msg.id}
                                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                                >
                                    <div className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed relative group ${
                                        isUser 
                                            ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-br-none shadow-md' 
                                            : 'bg-[#0E0E1A] border border-white/10 text-gray-200 rounded-bl-none shadow-md'
                                    }`}>
                                        <div className="whitespace-pre-wrap">
                                            {msgText.split('**').map((part, i) => (
                                                i % 2 === 1 ? <strong key={i} className="font-bold text-white">{part}</strong> : part
                                            ))}
                                        </div>

                                        {!isUser && (
                                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
                                                <span>DIIC Brain • {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                                <button
                                                    onClick={() => handleCopy(msg.id, msgText)}
                                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    {copiedId === msg.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                                    <span>{copiedId === msg.id ? 'Copiado' : 'Copiar'}</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {isChatting && (
                            <div className="flex justify-start">
                                <div className="bg-[#0E0E1A] border border-white/10 rounded-2xl rounded-bl-none p-3 flex items-center gap-2 text-xs text-indigo-400 font-bold">
                                    <Activity size={14} className="animate-spin text-indigo-400" />
                                    <span>Consultando fuentes y estructurando respuesta...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                            {promptChips.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(chip.query)}
                                    disabled={isChatting}
                                    className="px-2.5 py-1 bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 rounded-xl text-[10px] font-bold text-gray-300 hover:text-white whitespace-nowrap transition-all disabled:opacity-50"
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        className="flex items-center gap-2 bg-[#0E0E1A] border border-white/10 rounded-xl p-1.5 focus-within:border-indigo-500/50 transition-colors"
                    >
                        <input 
                            type="text"
                            placeholder="Pregúntale al Cerebro sobre el Dr., tratamientos, objeciones..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isChatting}
                            className="flex-1 bg-transparent border-none text-xs text-white px-2.5 py-1.5 focus:outline-none placeholder:text-gray-600 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isChatting}
                            className="p-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-lg transition-all disabled:opacity-30 shadow-md flex items-center justify-center shrink-0"
                        >
                            <Send size={13} />
                        </button>
                    </form>
                </div>

                {/* 3. RIGHT COLUMN: STUDIO & HERRAMIENTAS VISUALES */}
                <div className="lg:col-span-4 xl:col-span-4 flex flex-col bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-fuchsia-400" />
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">Studio Visual</h3>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg">
                            <button
                                onClick={() => setActiveStudioTool('mindmap')}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    activeStudioTool === 'mindmap' 
                                        ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Mapa Mental
                            </button>
                            <button
                                onClick={() => setActiveStudioTool('roadmap')}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    activeStudioTool === 'roadmap' 
                                        ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Roadmap
                            </button>
                            <button
                                onClick={() => setActiveStudioTool('dossier')}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    activeStudioTool === 'dossier' 
                                        ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Dossier
                            </button>
                        </div>
                    </div>

                    {/* TOOL 1: MAPA MENTAL INTERACTIVO */}
                    {activeStudioTool === 'mindmap' && (
                        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto custom-scrollbar max-h-[480px]">
                            <div className="p-3 bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-fuchsia-950/80 border border-indigo-500/30 rounded-2xl text-center shadow-lg relative overflow-hidden">
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[8px] font-black text-indigo-300 uppercase tracking-widest inline-block mb-1">
                                    Nodo Central • Marca Médica
                                </span>
                                <h4 className="text-sm font-black text-white uppercase italic tracking-wide">
                                    {mindMapData.center.title}
                                </h4>
                                <p className="text-[10px] text-gray-300 font-medium">
                                    {mindMapData.center.subtitle}
                                </p>
                            </div>

                            <div className="space-y-2.5">
                                {mindMapData.branches.map((branch) => {
                                    const Icon = branch.icon;
                                    const isSelected = selectedMindNode === branch.id;
                                    return (
                                        <div 
                                            key={branch.id}
                                            className={`p-3 rounded-2xl border transition-all text-left group ${
                                                isSelected 
                                                    ? 'bg-indigo-600/20 border-indigo-400 shadow-md' 
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/5'
                                            }`}
                                        >
                                            <div 
                                                onClick={() => setSelectedMindNode(isSelected ? null : branch.id)}
                                                className="flex items-center justify-between cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-indigo-400">
                                                        <Icon size={12} />
                                                    </div>
                                                    <h5 className="text-xs font-bold text-white tracking-tight">
                                                        {branch.title}
                                                    </h5>
                                                </div>
                                                <ChevronRight size={14} className={`text-gray-500 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : ''}`} />
                                            </div>

                                            <div className="mt-2 space-y-1.5 pl-6">
                                                {branch.items.map((item, iIdx) => (
                                                    <div 
                                                        key={iIdx}
                                                        onClick={() => handleSendMessage(`Explícame a fondo este aspecto del perfil y cómo potenciarlo en marketing: "${item}"`)}
                                                        className="text-[10px] text-gray-400 hover:text-indigo-300 font-medium flex items-center justify-between p-1 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                                                    >
                                                        <span className="truncate max-w-[190px]">• {item}</span>
                                                        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 text-indigo-400 shrink-0" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TOOL 2: ROADMAP DE CRECIMIENTO */}
                    {activeStudioTool === 'roadmap' && (
                        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto custom-scrollbar max-h-[480px] text-left">
                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-1">Fase Actual del Negocio</span>
                                <h4 className="text-xs font-black text-white uppercase italic">Nivel 2: Autoridad & Captación Cualificada</h4>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { step: '01', title: 'Fase 1: Huella Digital & Blindaje', desc: 'Auditoría omnicanal de Instagram, Web y Facebook para fijar la propuesta de valor única.', status: 'Completado', color: 'emerald' },
                                    { step: '02', title: 'Fase 2: Motor de Contenidos & Reels', desc: 'Producción mensual de guiones enfocados en dolores articulares y casos clínicos de éxito.', status: 'En Progreso', color: 'indigo' },
                                    { step: '03', title: 'Fase 3: Embudo de Conversión & Pauta', desc: 'Tráfico hiperlocal a WhatsApp y agendamiento de pacientes privados de alta especialidad.', status: 'Planificado', color: 'gray' }
                                ].map((phase, pIdx) => (
                                    <div key={pIdx} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-mono font-black text-indigo-400">{phase.step}</span>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                                                phase.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                                phase.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                                                'bg-white/5 text-gray-500'
                                            }`}>{phase.status}</span>
                                        </div>
                                        <h5 className="text-xs font-bold text-white">{phase.title}</h5>
                                        <p className="text-[10px] text-gray-400 leading-snug">{phase.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TOOL 3: DOSSIER EJECUTIVO */}
                    {activeStudioTool === 'dossier' && (
                        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto custom-scrollbar max-h-[480px] text-left">
                            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                                <h4 className="text-xs font-black text-white uppercase italic">Resumen Estratégico Ejecutivo</h4>
                                <p className="text-[10px] text-gray-300 font-medium leading-relaxed">
                                    {clientName} lidera un servicio de traumatología de alta especialidad centrado en artroscopia de rodilla y hombro, resolviendo dolor crónico sin cirugías abiertas agresivas.
                                </p>
                            </div>

                            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5 text-[10px]">
                                <span className="font-bold text-indigo-400 uppercase tracking-wider block">Puntos Clave del Dossier:</span>
                                <p className="text-gray-400">• Pacientes objetivo: Adultos 35+ y deportistas en Santo Domingo y Ecuador.</p>
                                <p className="text-gray-400">• Enfoque de venta: Mínima invasión, rápida recuperación, trato humano.</p>
                                <p className="text-gray-400">• Formato ganador: Video testimonios y explicaciones médicas en consultorio.</p>
                            </div>

                            <button 
                                onClick={() => handleSendMessage('Genera un informe ejecutivo completo de 1 página con plan de marketing de 3 meses para el Dr.')}
                                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                            >
                                <FileText size={13} />
                                <span>Generar Dossier en Chat</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
