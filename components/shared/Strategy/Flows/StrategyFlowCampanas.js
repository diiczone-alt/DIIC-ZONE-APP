'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search, Layers, Plus, Calendar, Target, Play, ChevronRight, 
    Activity, Trash2, LayoutTemplate, X, Star, UserCheck, 
    Sparkles, Video, Box, Instagram, Bot 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from '@/components/ui/DatePicker';

const generateStrategicNodes = (ingredients) => {
    const nodes = [];
    const edges = [];
    const STAGES = ['atracción', 'conexión', 'autoridad', 'conversión', 'escala', 'crm'];
    
    // Matrix Grid Setup (Horizontal Stages, Vertical Type Lanes)
    const startX = 256; // After Type labels
    const colWidth = 600;
    const startY = 64;  // Initial top padding
    const laneHeight = 600;
    
    const getYBase = (type, title) => {
        const t = (type || "").toLowerCase();
        const titleStr = (title || "").toLowerCase();
        
        // 1. Recursos Principales
        if (t === 'label' || t === 'sticky' || titleStr.includes('objetivo') || titleStr.includes('texto')) return startY;
        
        // 2. Imágenes
        if (t.includes('imagen') || t.includes('post') || titleStr.includes('carrusel') || titleStr.includes('fotografía')) return startY + laneHeight;
        
        // 3. Videos Pro
        if (t === 'video' || titleStr.includes('youtube') || titleStr.includes('cinemático')) return startY + (laneHeight * 2);
        
        // 4. Verticales (Reels / TikTok)
        if (t.includes('reel') || t.includes('tiktok') || titleStr.includes('short')) return startY + (laneHeight * 3);
        
        // 5. Historias
        if (t.includes('historia') || t.includes('story')) return startY + (laneHeight * 4);
        
        // 6. CRM / Sistemas
        if (t.includes('crm') || t.includes('whatsapp') || t.includes('automatización') || t.includes('form')) return startY + (laneHeight * 5);
        
        return startY + laneHeight; // Default to Imágenes
    };
    
    const addNode = (week, stage, type, subtype, title, platforms) => {
        const s = stage.toLowerCase();
        const stageIndex = STAGES.indexOf(s);
        const sIdx = stageIndex !== -1 ? stageIndex : 0;
        
        // Horizontal position based on stage (X)
        const xBase = startX + (sIdx * colWidth);
        
        // Vertical position based on Type/Lane (Y)
        const yBase = getYBase(type, title);
        
        const nodesInSameCell = nodes.filter(n => n.data.stage === s.toUpperCase() && Math.abs(n.y - yBase) < 500).length;
        
        // Arrange elements cleanly within the cell
        const x = xBase + 50 + (Math.floor(nodesInSameCell / 3) * 200);
        const y = yBase + 80 + (nodesInSameCell % 3 * 160);

        const node = {
            id: `${type}_${Date.now()}_${nodes.length}`,
            type,
            x,
            y,
            data: {
                title,
                subtype,
                stage: s.toUpperCase(),
                funnelLevel: s === 'atracción' ? 'TOFU' : (s === 'conexión' ? 'MOFU' : (s === 'autoridad' ? 'MOFU+' : (s === 'conversión' ? 'BOFU' : (s === 'escala' ? 'ADVOCACY' : 'CRM')))),
                platforms,
                week: week + 1 // Restored week for grouping
            }
        };
        nodes.push(node);
        return node;
    };

    // 1. VIDEOS (The Main Backbone)
    const videoCount = parseInt(ingredients.videos) || 0;
    const videoNodes = [];
    for (let i = 0; i < videoCount; i++) {
        const week = i % 4;
        const stage = STAGES[i % 4]; 
        const vNode = addNode(week, stage, 'video', 'v_educativo', `VIDEO ${i+1}: ${stage.toUpperCase()}`, ['instagram', 'tiktok', 'facebook']);
        videoNodes.push(vNode);
        
        if (i > 0) {
            edges.push({ id: `e-v-${i}`, source: videoNodes[i-1].id, target: videoNodes[i].id });
        }
    }

    // 2. REELS
    const reelCount = parseInt(ingredients.reels) || 0;
    for (let i = 0; i < reelCount; i++) {
        const week = i % 4;
        const stage = i % 2 === 0 ? 'atracción' : 'autoridad';
        addNode(week, stage, 'video', 'v_viral', `REEL ${i+1}`, ['instagram', 'facebook']);
    }

    // 3. TIKTOK
    const tiktokCount = parseInt(ingredients.tiktok) || 0;
    for (let i = 0; i < tiktokCount; i++) {
        const week = i % 4;
        const stage = i % 2 === 0 ? 'atracción' : 'conexión';
        addNode(week, stage, 'video', 'v_viral', `TIKTOK ${i+1}`, ['tiktok']);
    }

    // 4. POSTS & STORIES
    const postCount = parseInt(ingredients.posts) || 0;
    for (let i = 0; i < postCount; i++) {
       const week = i % 4;
       const stage = STAGES[i % STAGES.length];
       addNode(week, stage, 'post', 'i_post', `Post ${i+1}`, ['instagram', 'facebook']);
    }

    // 5. CRM
    const crmCount = parseInt(ingredients.crm) || 0;
    for (let i = 0; i < crmCount; i++) {
        const week = i % 4;
        addNode(week, 'crm', 'recurso', 'r_crm_flow', `CRM Flow ${i+1}`, ['web']);
    }

    // 6. FORMS
    const formCount = parseInt(ingredients.forms) || 0;
    for (let i = 0; i < formCount; i++) {
        const week = i % 4;
        addNode(week, 'conversión', 'recurso', 'r_form', `Captación ${i+1}`, ['web']);
    }

    // 7. STORIES
    const storyCount = parseInt(ingredients.stories) || 0;
    for (let i = 0; i < storyCount; i++) {
        const week = i % 4;
        addNode(week, 'conexión', 'post', 'i_historia', `Historia ${i+1}`, ['instagram']);
    }

    return { nodes, edges };
};

export default function StrategyFlowCampanas({ strategyData, onUpdate, onOpenCanvas, forceCreate, onCreationClose }) {
    // We expect strategyData to hold an array of campaigns
    const campaigns = strategyData.campaigns || [];

    const [isCreating, setIsCreating] = useState(false);
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Ver Todas');

    // Filtering Logic
    const filteredCampaigns = (strategyData.campaigns || []).filter(strategy => {
        const matchesSearch = 
            (strategy.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (strategy.objective || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = 
            statusFilter === 'Ver Todas' || 
            (strategy.status || '').toLowerCase() === statusFilter.toLowerCase() ||
            (statusFilter === 'Activa' && strategy.status === 'Empezado'); // Mapping for UX
            
        return matchesSearch && matchesStatus;
    });

    const [newCampaign, setNewCampaign] = useState({
        name: '',
        objective: '',
        type: 'Lanzamiento',
        duration: '4 Semanas',
        startDate: '',
        deadline: '',
        progress: 0,
        status: 'Empezado',
        ingredients: {
            videos: 4,
            posts: 6,
            stories: 12,
            reels: 4,
            tiktok: 4,
            crm: 2,
            forms: 1
        }
    });

    useEffect(() => {
        if (forceCreate) {
            setIsCreating(true);
        }
    }, [forceCreate]);

    const handleCreate = () => {
        const finalName = newCampaign.name.trim() || `Estrategia ${campaigns.length + 1}`;
        const finalObj = newCampaign.objective.trim() || 'Sin objetivo definido';

        const { nodes, edges } = generateStrategicNodes(newCampaign.ingredients);

        const campaign = {
            id: `camp_${Date.now()}`,
            name: finalName,
            objective: finalObj,
            type: newCampaign.type || 'Lanzamiento',
            duration: newCampaign.duration || '4 Semanas',
            startDate: newCampaign.startDate || 'Inmediato',
            deadline: newCampaign.deadline || 'A determinar',
            progress: newCampaign.progress || 0,
            status: newCampaign.status || 'Empezado',
            ingredients: { ...newCampaign.ingredients },
            nodes, 
            edges,
            createdAt: new Date().toISOString()
        };

        if (onUpdate) {
            onUpdate({
                ...strategyData,
                campaigns: [campaign, ...campaigns],
                activeCampaignId: campaign.id // Set the new campaign as active
            });
        }
        
        setIsCreating(false);
        if (onCreationClose) onCreationClose();
        setNewCampaign({ 
            name: '', 
            objective: '', 
            type: 'Lanzamiento', 
            duration: '4 Semanas',
            startDate: '',
            deadline: '',
            ingredients: { videos: 4, posts: 6, stories: 12, reels: 4, tiktok: 4, crm: 2, forms: 1 }
        });
        
        if (onOpenCanvas) {
            onOpenCanvas(campaign.id);
        }
    };

    const handleUseTemplate = (template) => {
        let predefinedNodes = [];
        let predefinedEdges = [];

        if (template.id === 'lanzamiento') {
            predefinedNodes = [
                { id: 't1', type: 'marca', x: 200, y: 300, data: { title: 'Fase de Teaser', objective: 'Generar expectativa', status: 'Listo' } },
                { id: 't2', type: 'educativo', x: 500, y: 300, data: { title: 'Pre-Lanzamiento', objective: 'Aportar valor y educar', status: 'Por hacer' } },
                { id: 't3', type: 'ventas', x: 800, y: 300, data: { title: 'Día de Lanzamiento', objective: 'Abrir carrito', status: 'Por hacer' } }
            ];
            predefinedEdges = [
                { id: 'e-t1-t2', source: 't1', target: 't2' },
                { id: 'e-t2-t3', source: 't2', target: 't3' }
            ];
        } else if (template.id === 'leads') {
            predefinedNodes = [
                { id: 't1', type: 'lead_magnet', x: 200, y: 300, data: { title: 'Anuncio Lead Magnet', objective: 'Tráfico frío', status: 'Por hacer' } },
                { id: 't2', type: 'captacion', x: 500, y: 300, data: { title: 'Landing Page', objective: 'Conversión a Lead', status: 'Por hacer' } },
                { id: 't3', type: 'educativo', x: 800, y: 300, data: { title: 'Secuencia de Correos', objective: 'Nutrición del Lead', status: 'Por hacer' } }
            ];
            predefinedEdges = [
                { id: 'e-t1-t2', source: 't1', target: 't2' },
                { id: 'e-t2-t3', source: 't2', target: 't3' }
            ];
        } else if (template.id === 'high_ticket') {
            predefinedNodes = [
                { id: 't1', type: 'educativo', x: 200, y: 300, data: { title: 'Vídeo de Valor', objective: 'Filtro de autoridad', status: 'Por hacer' } },
                { id: 't2', type: 'captacion', x: 500, y: 300, data: { title: 'Formulario Calificación', objective: 'Filtrar leads cualificados', status: 'Por hacer' } },
                { id: 't3', type: 'servicio', x: 800, y: 300, data: { title: 'Sesión Estratégica', objective: 'Cierre High-Ticket', status: 'Por hacer' } }
            ];
            predefinedEdges = [
                { id: 'e-t1-t2', source: 't1', target: 't2' },
                { id: 'e-t2-t3', source: 't2', target: 't3' }
            ];
        } else if (template.id === 'retargeting') {
            predefinedNodes = [
                { id: 't1', type: 'caso_exito', x: 200, y: 300, data: { title: 'Prueba Social (Ad)', objective: 'Romper objeciones', status: 'Por hacer' } },
                { id: 't2', type: 'comunidad', x: 500, y: 300, data: { title: 'Retargeting Dinámico', objective: 'Omnipresencia', status: 'Por hacer' } },
                { id: 't3', type: 'ventas', x: 800, y: 300, data: { title: 'Oferta Irresistible', objective: 'Conversión final', status: 'Por hacer' } }
            ];
            predefinedEdges = [
                { id: 'e-t1-t2', source: 't1', target: 't2' },
                { id: 'e-t2-t3', source: 't2', target: 't3' }
            ];
        } else if (template.id === 'linkedin') {
            predefinedNodes = [
                { id: 't1', type: 'marca', x: 200, y: 300, data: { title: 'Optimización Perfil', objective: 'Convertir visitas', status: 'Por hacer' } },
                { id: 't2', type: 'educativo', x: 500, y: 300, data: { title: 'Contenido Autoridad', objective: 'Generar inbound', status: 'Por hacer' } },
                { id: 't3', type: 'comunidad', x: 800, y: 300, data: { title: 'Mensajería Outreach', objective: 'Generar citas', status: 'Por hacer' } }
            ];
            predefinedEdges = [
                { id: 'e-t1-t2', source: 't1', target: 't2' },
                { id: 'e-t2-t3', source: 't2', target: 't3' }
            ];
        } else if (template.id === 'fidelizacion') {
            predefinedNodes = [
                { id: 't1', type: 'servicio', x: 200, y: 300, data: { title: 'Onboarding VIP', objective: 'Experiencia WOW', status: 'Por hacer' } },
                { id: 't2', type: 'testimonio', x: 500, y: 300, data: { title: 'Solicitar Referidos', objective: 'Crecimiento orgánico', status: 'Por hacer' } },
                { id: 't3', type: 'marca', x: 800, y: 300, data: { title: 'Upsell / Renovación', objective: 'Maximizar LTV', status: 'Por hacer' } }
            ];
            predefinedEdges = [
                { id: 'e-t1-t2', source: 't1', target: 't2' },
                { id: 'e-t2-t3', source: 't2', target: 't3' }
            ];
        } else {
             predefinedNodes = [
                { id: 't1', type: 'captacion', x: 300, y: 300, data: { title: 'Registro Webinar', objective: 'Captar interesados', status: 'Por hacer' } },
                { id: 't2', type: 'ventas', x: 700, y: 300, data: { title: 'Evento en Vivo', objective: 'Venta', status: 'Por hacer' } }
            ];
            predefinedEdges = [
                { id: 'e-t1-t2', source: 't1', target: 't2' }
            ];
        }

        const campaign = {
            id: `camp_${Date.now()}`,
            name: template.name,
            objective: template.objective,
            type: template.type,
            duration: template.duration,
            deadline: 'Por definir',
            progress: 0,
            status: 'Empezado',
            ingredients: { videos: 4, posts: 6, stories: 12, reels: 4, tiktok: 4, crm: 2 },
            nodes: predefinedNodes, 
            edges: predefinedEdges,
            createdAt: new Date().toISOString()
        };

        if (onUpdate) {
            onUpdate({
                ...strategyData,
                campaigns: [campaign, ...campaigns],
                activeCampaignId: campaign.id
            });
        }
        
        setIsTemplatesOpen(false);
        if (onOpenCanvas) {
            onOpenCanvas(campaign.id);
        }
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar esta campaña y toda su pizarra estratégica?')) {
            if (onUpdate) {
                onUpdate({
                    ...strategyData,
                    campaigns: campaigns.filter(c => c.id !== id),
                    activeCampaignId: strategyData.activeCampaignId === id ? null : strategyData.activeCampaignId
                });
            }
        }
    };

    const getStatusStyles = (status) => {
        switch(status?.toLowerCase()) {
            case 'finalizado': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
            case 'en proceso': return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
            case 'empezado': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
            case 'planificacion': return 'text-violet-400 border-violet-500/30 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]';
            default: return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar relative">
            {/* Ambient Base Layer */}
            <div className="absolute inset-0 bg-[#050511]" />
            
            {/* Geometric Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4F46E5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
            
            {/* Dynamic Neon Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                
                {/* Header Section: Reimagined */}
                <div className="flex items-center justify-between border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <span className="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] shadow-2xl backdrop-blur-xl relative group">
                                <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10">Laboratorio de Arquitectura</span>
                            </span>
                        </motion.div>
                        
                        <div className="relative">
                            <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none select-none pr-10">
                                Estrategia<span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 pr-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">s</span>
                            </h2>
                            <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </div>
                        
                        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] max-w-xl leading-relaxed opacity-60">
                             Gestión de Flujos Maestros y <span className="text-white/40">Optimización de Conversión</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsTemplatesOpen(true)}
                            className="group relative flex items-center gap-3 px-8 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl overflow-hidden bg-white/[0.02] border border-white/5 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <LayoutTemplate className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span>Plantillas</span>
                        </button>
                        
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="group relative flex items-center gap-5 px-12 py-5 rounded-[28px] bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_15px_60px_rgba(255,255,255,0.15)] hover:shadow-white/30 hover:scale-[1.05] active:scale-95 transition-all duration-500 outline-none overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> 
                            <span>Crear Nueva</span>
                        </button>
                    </div>
                </div>

                {/* Create Modal: Laboratory Edition */}
                {isCreating && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#050511]/90 backdrop-blur-3xl border border-white/5 rounded-[60px] p-16 space-y-12 shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative"
                    >
                        {/* Glow Decorations */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 via-cyan-500 to-indigo-600" />
                        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                        
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <Plus className="w-7 h-7 text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Nueva Arquitectura</h3>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Iniciando Protocolo de Diseño Estratégico</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6 group-focus-within:text-emerald-400 transition-colors">Nombre de Campaña</label>
                                <input 
                                    type="text"
                                    placeholder="Ej. Proyecto Alpha v1"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-8 py-5 text-white font-bold placeholder:text-gray-800 focus:bg-white/[0.04] focus:border-emerald-500/30 outline-none transition-all shadow-inner"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6 group-focus-within:text-emerald-400 transition-colors">Objetivo Crítico</label>
                                <input 
                                    type="text"
                                    placeholder="Ej. Maximizar Retención Q3"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-8 py-5 text-white font-bold placeholder:text-gray-800 focus:bg-white/[0.04] focus:border-emerald-500/30 outline-none transition-all shadow-inner"
                                    value={newCampaign.objective}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6 group-focus-within:text-emerald-400 transition-colors">Fecha de Inicio</label>
                                <DatePicker 
                                    value={newCampaign.startDate}
                                    placeholder="Ej. 01 Oct 2026"
                                    onChange={(val) => setNewCampaign({ ...newCampaign, startDate: val })}
                                />
                            </div>
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6 group-focus-within:text-emerald-400 transition-colors">Fecha Límite</label>
                                <DatePicker 
                                    value={newCampaign.deadline}
                                    placeholder="Ej. 30 Dic 2026"
                                    onChange={(val) => setNewCampaign({ ...newCampaign, deadline: val })}
                                />
                            </div>
                        </div>

                        {/* Strategic Ingredients Section */}
                        <div className="space-y-8 bg-white/[0.01] border border-white/5 rounded-[40px] p-10">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Ingredientes de la Estrategia</h4>
                             </div>
                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                                {[
                                    { label: 'Videos', key: 'videos', icon: Video, color: 'text-rose-400' },
                                    { label: 'Posts', key: 'posts', icon: Box, color: 'text-indigo-400' },
                                    { label: 'Stories', key: 'stories', icon: Instagram, color: 'text-orange-400' },
                                    { label: 'Reels', key: 'reels', icon: Play, color: 'text-emerald-400' },
                                    { label: 'Tik Tok', key: 'tiktok', icon: Activity, color: 'text-cyan-400' },
                                    { label: 'Flujos CRM', key: 'crm', icon: Bot, color: 'text-emerald-400' },
                                    { label: 'Formularios', key: 'forms', icon: Target, color: 'text-cyan-400' }
                                ].map((ing) => (
                                    <div key={ing.key} className="space-y-3 group">
                                        <div className="flex items-center gap-3 ml-4">
                                            <ing.icon className={`w-4 h-4 ${ing.color}`} />
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{ing.label}</label>
                                        </div>
                                        <input 
                                            type="number"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-black focus:border-indigo-500/50 outline-none transition-all"
                                            value={newCampaign.ingredients[ing.key]}
                                            onChange={(e) => setNewCampaign({
                                                ...newCampaign,
                                                ingredients: { ...newCampaign.ingredients, [ing.key]: parseInt(e.target.value) || 0 }
                                            })}
                                        />
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4 group">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6 group-focus-within:text-indigo-400 transition-colors">Ciclo Operativo</label>
                                <div className="relative">
                                    <select 
                                        value={newCampaign.duration}
                                        onChange={(e) => setNewCampaign({...newCampaign, duration: e.target.value})}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-8 py-5 text-white font-bold focus:bg-white/[0.04] focus:border-indigo-500/30 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option className="bg-[#050511]" value="1 Semana">Flash (1 Semana)</option>
                                        <option className="bg-[#050511]" value="4 Semanas">Estándar (4 Semanas)</option>
                                        <option className="bg-[#050511]" value="12 Semanas">Trimestral (12 Semanas)</option>
                                        <option className="bg-[#050511]" value="Continuo">Continuo (Evergreen)</option>
                                    </select>
                                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 justify-end pt-6">
                            <button 
                                onClick={() => {
                                    setIsCreating(false);
                                    if (onCreationClose) onCreationClose();
                                }}
                                className="px-10 py-5 rounded-2xl text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleCreate}
                                className="px-12 py-5 rounded-[24px] bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:scale-[1.05] hover:shadow-[0_15px_40px_rgba(16,185,129,0.3)] transition-all active:scale-95 shadow-xl"
                            >
                                Crear Arquitectura
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Templates Modal: Library Edition */}
                {isTemplatesOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#050511]/90 backdrop-blur-3xl border border-white/5 rounded-[60px] p-16 space-y-12 shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-cyan-500 via-indigo-500 to-violet-600" />
                        
                        <div className="flex justify-between items-center border-b border-white/5 pb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                    <LayoutTemplate className="w-7 h-7 text-cyan-400" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Bóveda de Maestría</h3>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Protocolos Pre-Configurados de Alto Rendimiento</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsTemplatesOpen(false)}
                                className="p-4 bg-white/[0.03] hover:bg-rose-500/20 text-white/50 hover:text-rose-400 rounded-2xl transition-all active:scale-90"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { id: 'lanzamiento', name: 'Lanzamiento Flash', objective: 'Alta conversión masiva', duration: '4 Semanas', type: 'Lanzamiento', icon: Target, color: 'text-violet-400', glow: 'shadow-violet-500/20', bg: 'bg-violet-500/10' },
                                { id: 'leads', name: 'Imán de Prospectos', objective: 'Captación multicanal', duration: 'Continuo', type: 'Captación', icon: Activity, color: 'text-emerald-400', glow: 'shadow-emerald-500/20', bg: 'bg-emerald-500/10' },
                                { id: 'high_ticket', name: 'High-Ticket Inbound', objective: 'Cierre de alto valor', duration: '8 Semanas', type: 'Ventas', icon: Star, color: 'text-amber-400', glow: 'shadow-amber-500/20', bg: 'bg-amber-500/10' },
                                { id: 'retargeting', name: 'Retargeting Maestro', objective: 'Recuperación omnicanal', duration: 'Continuo', type: 'Publicidad', icon: Layers, color: 'text-indigo-400', glow: 'shadow-indigo-500/20', bg: 'bg-indigo-500/10' },
                                { id: 'linkedin', name: 'Autoridad LinkedIn', objective: 'Posicionamiento B2B', duration: '12 Semanas', type: 'Marca', icon: UserCheck, color: 'text-blue-400', glow: 'shadow-blue-500/20', bg: 'bg-blue-500/10' },
                                { id: 'fidelizacion', name: 'Fidelización VIP', objective: 'Maximizar LTV', duration: 'Continuo', type: 'Servicio', icon: Sparkles, color: 'text-rose-400', glow: 'shadow-rose-500/20', bg: 'bg-rose-500/10' },
                                { id: 'webinar', name: 'Webinar Master', objective: 'Venta High-Ticket', duration: '2 Semanas', type: 'Ventas', icon: Play, color: 'text-cyan-400', glow: 'shadow-cyan-500/20', bg: 'bg-cyan-500/10' }
                            ].map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => handleUseTemplate(tpl)}
                                    className="group relative flex flex-col items-start p-10 rounded-[40px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/20 transition-all duration-500 text-left overflow-hidden active:scale-[0.98]"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] rounded-full blur-[50px] group-hover:bg-white/[0.05] transition-colors pointer-events-none" />
                                    
                                    <div className={`p-5 rounded-2xl ${tpl.bg} ${tpl.color} mb-8 border border-white/5 shadow-2xl`}>
                                        <tpl.icon className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-3 group-hover:text-white transition-colors italic">{tpl.name}</h4>
                                    <p className="text-[11px] font-medium text-gray-500 mb-8 uppercase tracking-widest leading-relaxed">{tpl.objective}</p>
                                    
                                    <div className="flex items-center gap-4 w-full border-t border-white/5 pt-6 mt-auto">
                                        <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.3em] uppercase text-gray-600 group-hover:text-gray-400 transition-colors">
                                            <Calendar className="w-4 h-4" />
                                            {tpl.duration}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Strategic Search & Filter Bar: Glass Edition */}
                <div className="flex flex-col xl:flex-row items-center gap-6 mb-16">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Buscar estrategia o proyecto maestro..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] pl-16 pr-8 py-6 text-[13px] text-white font-bold placeholder:text-gray-700 focus:bg-white/[0.04] focus:border-cyan-500/30 focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all shadow-2xl backdrop-blur-3xl"
                        />
                    </div>

                    <div className="flex bg-[#0A0A0F]/60 p-2 rounded-[30px] border border-white/5 backdrop-blur-3xl shadow-2xl w-full xl:w-auto overflow-x-auto no-scrollbar">
                        {['Ver Todas', 'Activa', 'En Proceso', 'Draft'].map((tab) => {
                            const isActive = statusFilter === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setStatusFilter(tab)}
                                    className={`px-10 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 whitespace-nowrap relative group
                                        ${isActive 
                                            ? "text-black scale-105" 
                                            : "text-gray-600 hover:text-white"}`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-[24px] shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                                        />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Strategies List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCampaigns.length === 0 && !isCreating ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-32 border border-white/5 rounded-[60px] bg-white/[0.01] backdrop-blur-3xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                            <Layers className="w-20 h-20 text-indigo-500/20 mx-auto mb-6" />
                            
                            {campaigns.length === 0 ? (
                                <>
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Tu Laboratorio está vacío</h3>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] max-w-md mx-auto mb-10">
                                        Comienza diseñando tu primera estrategia maestra para activar el flujo operativo.
                                    </p>
                                    <button 
                                        onClick={() => setIsCreating(true)}
                                        className="px-10 py-4 rounded-2xl bg-[#4ADE80] text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#4ADE80]/20"
                                    >
                                        Iniciar Primera Estrategia
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">No hay coincidencias</h3>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] max-w-md mx-auto mb-10">
                                        No encontramos estrategias que coincidan con "{searchQuery || statusFilter}".
                                    </p>
                                    <button 
                                        onClick={() => { setSearchQuery(''); setStatusFilter('Ver Todas'); }}
                                        className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        filteredCampaigns.map((strategy, idx) => (
                        <motion.div 
                            key={strategy.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-[#0A0A0F]/60 backdrop-blur-3xl hover:bg-white/[0.05] border border-white/10 hover:border-indigo-500/40 rounded-[40px] p-8 transition-all duration-700 overflow-hidden shadow-2xl hover:shadow-indigo-500/20 flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col h-full space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(strategy.status)}`}>
                                            {strategy.status || 'Empezado'}
                                        </span>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">{strategy.name}</h3>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDelete(strategy.id, e)}
                                        className="p-2.5 bg-white/5 hover:bg-rose-500/20 text-gray-700 hover:text-rose-400 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Vigencia Estratégica</p>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                        <Calendar className="w-3.5 h-3.5 text-indigo-400/50" />
                                        <span>{strategy.startDate || 'Pendiente'}</span>
                                        <ChevronRight className="w-3 h-3 text-gray-700" />
                                        <span>{strategy.deadline || 'Pendiente'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Objetivo Crítico</p>
                                    <p className="text-[11px] font-bold text-gray-400 line-clamp-2 uppercase tracking-tight">{strategy.objective || 'Optimización Global'}</p>
                                </div>

                                {/* Strategic Ingredients: Mini View */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5">
                                    {[
                                        { label: 'VR', key: 'videos', icon: Video, color: 'text-rose-400' },
                                        { label: 'PT', key: 'posts', icon: Box, color: 'text-indigo-400' },
                                        { label: 'ST', key: 'stories', icon: Instagram, color: 'text-orange-400' },
                                        { label: 'RL', key: 'reels', icon: Play, color: 'text-emerald-400' },
                                        { label: 'TT', key: 'tiktok', icon: Activity, color: 'text-cyan-400' },
                                        { label: 'CR', key: 'crm', icon: Bot, color: 'text-emerald-400' },
                                        { label: 'FM', key: 'forms', icon: Target, color: 'text-cyan-400' }
                                    ].map((ing) => (
                                        <div key={ing.key} className="flex items-center gap-2">
                                            <div className={`p-1 rounded-lg bg-white/5 ${ing.color}`}>
                                                <ing.icon className="w-2.5 h-2.5" />
                                            </div>
                                            <span className="text-[10px] font-black text-white italic">{strategy.ingredients?.[ing.key] || 0}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <span>Eficiencia</span>
                                        <span className="text-indigo-400 font-bold italic">{strategy.progress || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${strategy.progress || 0}%` }}
                                            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <button 
                                        onClick={() => onOpenCanvas(strategy.id)}
                                        className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group/btn"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>Entrar</span>
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
                </div>
            </div>
        </div>
    );
}
