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
    
    const startX = 256; 
    const colWidth = 600;
    const startY = 64;  
    const laneHeight = 600;
    
    const getYBase = (type, title) => {
        const t = (type || "").toLowerCase();
        const titleStr = (title || "").toLowerCase();
        if (t === 'label' || t === 'sticky' || titleStr.includes('objetivo') || titleStr.includes('texto')) return startY;
        if (t.includes('imagen') || t.includes('post') || titleStr.includes('carrusel')) return startY + laneHeight;
        if (t === 'video' || titleStr.includes('youtube') || titleStr.includes('cinemático')) return startY + (laneHeight * 2);
        if (t.includes('reel') || t.includes('tiktok') || titleStr.includes('short')) return startY + (laneHeight * 3);
        if (t.includes('historia') || t.includes('story')) return startY + (laneHeight * 4);
        if (t.includes('crm') || t.includes('whatsapp') || t.includes('automatización') || t.includes('form') || t.includes('captación')) return startY + (laneHeight * 5);
        return startY + laneHeight;
    };
    
    const addNode = (stage, type, subtype, title, platforms) => {
        const s = stage.toLowerCase();
        const sIdx = STAGES.indexOf(s) !== -1 ? STAGES.indexOf(s) : 0;
        const xBase = startX + (sIdx * colWidth);
        const yBase = getYBase(type, title);
        
        const nodesInCell = nodes.filter(n => n.data.stage === s.toUpperCase() && Math.abs(n.y - yBase) < 400).length;
        const x = xBase + 50 + (Math.floor(nodesInCell / 3) * 220);
        const y = yBase + 80 + (nodesInCell % 3 * 180);

        const node = {
            id: `${type}_${Date.now()}_${nodes.length}`,
            type,
            x,
            y,
            data: {
                title: title.toUpperCase(),
                subtype,
                stage: s.toUpperCase(),
                funnelLevel: s === 'atracción' ? 'TOFU' : (['conexión', 'autoridad'].includes(s) ? 'MOFU' : (s === 'conversión' ? 'BOFU' : 'CRM')),
                platforms: platforms || []
            }
        };
        nodes.push(node);
        return node;
    };

    const nodeBuckets = { atracción: [], conexión: [], conversión: [], crm: [] };

    // 1. VIDEOS (Boutique Labels)
    const videoLabels = ['AD: ATRACCIÓN', 'VIDEO DE VALOR', 'MASTERCLASS: VENTA', 'TESTIMONIO VIF'];
    const videoCount = parseInt(ingredients.videos) || 0;
    for (let i = 0; i < videoCount; i++) {
        const stage = i === 0 ? 'atracción' : (i === 1 ? 'conexión' : 'conversión');
        const label = videoLabels[i % videoLabels.length];
        const n = addNode(stage, 'video', 'v_educativo', label, ['instagram', 'tiktok', 'youtube']);
        nodeBuckets[stage].push(n);
    }

    // 2. SOCIAL ADs (Reels & TikTok)
    const reelCount = parseInt(ingredients.reels) || 0;
    for (let i = 0; i < reelCount; i++) {
        const n = addNode('atracción', 'video', 'v_viral', `REEL: CAPTACIÓN ${i+1}`, ['instagram']);
        nodeBuckets.atracción.push(n);
    }
    const tiktokCount = parseInt(ingredients.tiktok) || 0;
    for (let i = 0; i < tiktokCount; i++) {
        const n = addNode('atracción', 'video', 'v_viral', `TIKTOK: VIRAL ${i+1}`, ['tiktok']);
        nodeBuckets.atracción.push(n);
    }

    // 3. POSTS & STORIES
    const postCount = parseInt(ingredients.posts) || 0;
    for (let i = 0; i < postCount; i++) {
        const stage = i % 2 === 0 ? 'conexión' : 'autoridad';
        const n = addNode(stage, 'post', 'i_post', `POST DE AUTORIDAD ${i+1}`, ['instagram', 'facebook']);
        nodeBuckets.conexión.push(n);
    }
    const storyCount = parseInt(ingredients.stories) || 0;
    for (let i = 0; i < storyCount; i++) {
        const n = addNode('conexión', 'post', 'i_historia', `STORY: CONEXIÓN ${i+1}`, ['instagram']);
    }

    // 4. CONVERSION (Forms)
    const formLabels = ['CONVERSIONES', 'LEAD MAGNET', 'CHECKOUT: VENTA'];
    const formCount = parseInt(ingredients.forms) || 0;
    for (let i = 0; i < formCount; i++) {
        const label = formLabels[i % formLabels.length];
        const n = addNode('conversión', 'recurso', 'r_form', label, ['web']);
        nodeBuckets.conversión.push(n);
    }

    // 5. CRM / AUTOMATION
    const crmLabels = ['AUTOMATIZACIÓN CRM', 'LEAD SCORING', 'RETARGETING', 'EMAIL NURTURING'];
    const crmCount = parseInt(ingredients.crm) || 0;
    for (let i = 0; i < crmCount; i++) {
        const label = crmLabels[i % crmLabels.length];
        const n = addNode('crm', 'recurso', 'r_crm_flow', label, ['web']);
        nodeBuckets.crm.push(n);
    }

    // 6. FUNNEL CONNECTIONS (Dynamic Routing)
    // All Attraction -> First Connection
    if (nodeBuckets.atracción.length > 0 && nodeBuckets.conexión.length > 0) {
        nodeBuckets.atracción.forEach(src => {
            edges.push({ id: `e-att-${src.id}`, source: src.id, target: nodeBuckets.conexión[0].id });
        });
    }
    // Connection -> Conversion
    if (nodeBuckets.conexión.length > 0 && nodeBuckets.conversión.length > 0) {
        nodeBuckets.conexión.forEach(src => {
            edges.push({ id: `e-con-${src.id}`, source: src.id, target: nodeBuckets.conversión[0].id });
        });
    }
    // Conversion -> CRM
    if (nodeBuckets.conversión.length > 0 && nodeBuckets.crm.length > 0) {
        nodeBuckets.conversión.forEach(src => {
            edges.push({ id: `e-cv-${src.id}`, source: src.id, target: nodeBuckets.crm[0].id });
        });
    }

    return { nodes, edges };
};

export default function StrategyFlowCampanas({ strategyData, onUpdate, onOpenCanvas, forceCreate, onCreationClose, theme }) {
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
            videos: 1,
            posts: 2,
            stories: 0,
            reels: 1,
            tiktok: 0,
            crm: 1,
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
            ingredients: { videos: 1, posts: 2, stories: 0, reels: 1, tiktok: 0, crm: 1, forms: 1 }
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

        // Dynamic Ingredients Sync: Calculate counts from predefined nodes
        const finalIngredients = { videos: 0, posts: 0, stories: 0, reels: 0, tiktok: 0, crm: 0, forms: 0 };
        predefinedNodes.forEach(n => {
            const t = n.type.toLowerCase();
            if (t === 'video') finalIngredients.videos++;
            else if (t === 'post' || t === 'carrusel') finalIngredients.posts++;
            else if (t === 'historia' || t === 'story') finalIngredients.stories++;
            else if (t === 'reel') finalIngredients.reels++;
            else if (t === 'tiktok') finalIngredients.tiktok++;
            else if (['crm', 'recurso'].includes(t)) finalIngredients.crm++;
            else if (t === 'captacion' || t === 'form') finalIngredients.forms++;
        });

        const campaign = {
            id: `camp_${Date.now()}`,
            name: template.name,
            objective: template.objective,
            type: template.type,
            duration: template.duration,
            deadline: 'Por definir',
            progress: 0,
            status: 'Empezado',
            ingredients: finalIngredients,
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
        <div className={`flex-1 overflow-y-auto p-12 custom-scrollbar relative selection:bg-cyan-500/30 transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050511]' : 'bg-[#F1F5F9]'}`}>
            {/* --- HYPER-CYBER ATMOSPHERIC SYSTEM --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Neon Mesh 1: Cyber Cyan */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.4, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.15, 0.25, 0.15],
                        x: [0, 50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-5%] w-[70%] h-[70%] bg-cyan-600/30 blur-[180px] rounded-full"
                />
                {/* Neon Mesh 2: Hyper Magenta */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.5, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.1, 0.2, 0.1],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#FF00E5]/20 blur-[180px] rounded-full"
                />

                {/* Cyber-Grid: 3D Perspective Overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.05]" 
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px',
                        transform: 'perspective(1000px) rotateX(60deg)',
                        transformOrigin: 'top',
                        maskImage: 'linear-gradient(to bottom, black, transparent)'
                    }} 
                />

                {/* Holographic Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,242,255,0.01)_50%,transparent_100%)] bg-[length:100%_4px] opacity-20" />
                
                {/* Subtle Digital Refraction */}
                <div className={`absolute inset-0 opacity-[0.02] ${theme === 'dark' ? 'opacity-[0.02]' : 'opacity-[0.05]'}`} 
                     style={{ backgroundImage: theme === 'dark' ? 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)' : 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>
            
            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                
                {/* --- HEADER SECTION: MINIMALIST EDITORIAL --- */}
                <div className={`flex flex-col md:flex-row items-end justify-between gap-10 border-b pb-16 transition-colors duration-500 ${theme === 'dark' ? 'border-white/[0.03]' : 'border-slate-200'}`}>
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 relative"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                            <span className={`text-[10px] font-black uppercase tracking-[0.5em] opacity-60 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Protocolo Operativo
                            </span>
                            {/* Scanning line effect */}
                            <motion.div 
                                animate={{ x: [-20, 150, -20] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute h-[1px] w-8 bg-cyan-400/40 blur-[2px] pointer-events-none"
                            />
                        </motion.div>
                        
                        <div className="relative group">
                            <h2 className="text-[120px] font-black leading-[0.8] tracking-[-0.05em] text-white flex flex-col">
                                <span className={`font-extralight select-none ${theme === 'dark' ? 'text-white/20' : 'text-slate-300'}`}>VISTA DE</span>
                                <motion.span 
                                    animate={{ 
                                        backgroundImage: theme === 'dark' ? [
                                            'linear-gradient(to right, #fff, #22d3ee, #ff00e5)',
                                            'linear-gradient(to right, #ff00e5, #fff, #22d3ee)',
                                            'linear-gradient(to right, #22d3ee, #ff00e5, #fff)'
                                        ] : [
                                            'linear-gradient(to right, #0f172a, #6366f1, #ec4899)',
                                            'linear-gradient(to right, #ec4899, #0f172a, #6366f1)',
                                            'linear-gradient(to right, #6366f1, #ec4899, #0f172a)'
                                        ]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="bg-clip-text text-transparent italic bg-[length:200%_auto]"
                                >
                                    ESTRATEGIA<span className="text-cyan-600 not-italic">S</span>
                                </motion.span>
                            </h2>
                            {/* Accent Line: Neon Pulse */}
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: 140 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="h-[2px] bg-gradient-to-r from-cyan-500 via-[#ff00e5] to-transparent mt-8 shadow-[0_0_10px_rgba(255,0,229,0.5)]" 
                            />
                        </div>
                        
                        <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.4em] max-w-xl leading-relaxed">
                             Hyper-Cyber Ops & <span className="text-cyan-400/60 font-black">Algoritmos de Crecimiento Exponencial</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button 
                            whileHover={{ y: -5, backgroundColor: theme === 'dark' ? 'rgba(255,0,229,0.05)' : 'rgba(99,102,241,0.05)', borderColor: theme === 'dark' ? 'rgba(255,0,229,0.3)' : 'rgba(99,102,241,0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsTemplatesOpen(true)}
                            className={`group relative flex items-center gap-4 px-10 py-6 rounded-[32px] font-bold text-[10px] uppercase tracking-[0.3em] transition-all overflow-hidden ${
                                theme === 'dark' ? 'bg-white/[0.02] border-white/10 text-white/40 hover:text-white hover:shadow-[0_0_30px_rgba(255,0,229,0.15)]' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:shadow-xl shadow-slate-200/20'
                            }`}
                        >
                            <LayoutTemplate className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-all text-indigo-400" />
                            <span>Bóveda</span>
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02, y: -5, boxShadow: theme === 'dark' ? '0 0 40px rgba(0,242,255,0.3)' : '0 10px 30px rgba(79,70,229,0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsCreating(true)}
                            className={`group relative flex items-center gap-6 px-16 py-6 rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden ${
                                theme === 'dark' ? 'bg-white text-black' : 'bg-indigo-600 text-white'
                            }`}
                        >
                            {/* Animated Inner Glow */}
                            <motion.div 
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent' : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'}`}
                            />
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500 relative z-10" /> 
                            <span className="relative z-10">Activar Protocolo</span>
                        </motion.button>
                    </div>
                </div>

                {/* --- CREATE MODAL: STUDIO EDITION --- */}
                {isCreating && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`backdrop-blur-[80px] border rounded-[40px] p-20 space-y-16 relative overflow-hidden transition-all duration-700 ${
                            theme === 'dark' ? 'bg-[#050511]/90 border-white/10 shadow-[0_0_100px_rgba(34,211,238,0.1)]' : 'bg-white/95 border-slate-200 shadow-[0_40px_100px_rgba(0,0,0,0.1)]'
                        }`}
                    >
                        {/* Immersive Scan Mask */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(188, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(188, 255, 0, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        
                        {/* Top Accent: Acid Lime Glow */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BCFF00] to-transparent shadow-[0_0_20px_rgba(188,255,0,0.5)]" />
                        
                        <div className="flex flex-col md:flex-row items-start justify-between gap-10 relative z-10">
                            <div className="space-y-4">
                                <h3 className={`text-7xl font-black uppercase italic tracking-tighter leading-none group transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    NUEVO <span className="text-cyan-500">PROTOCOLO</span>
                                </h3>
                                <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${theme === 'dark' ? 'text-cyan-400/40' : 'text-indigo-400/60'}`}>System Architecture v4.0 // Neural Engine</p>
                            </div>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border group cursor-pointer transition-all transform hover:rotate-90 shadow-lg ${
                                theme === 'dark' ? 'bg-white/[0.03] border-white/10 hover:bg-rose-500' : 'bg-slate-50 border-slate-200 hover:bg-rose-500 hover:text-white'
                            }`} onClick={() => { setIsCreating(false); if (onCreationClose) onCreationClose(); }}>
                                <X className={`w-8 h-8 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] ml-4 transition-colors">Identificador de Campaña</label>
                                <input 
                                    type="text"
                                    placeholder="Ej. LANZAMIENTO ALPHA"
                                    className="w-full bg-white/[0.01] border-b border-white/10 focus:border-white py-6 text-2xl text-white font-black placeholder:text-gray-900 outline-none transition-all italic"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-4 transition-colors">Objetivo Estratégico</label>
                                <input 
                                    type="text"
                                    placeholder="Ej. MAXIMIZAR LTV"
                                    className={`w-full bg-transparent border-b py-6 text-2xl font-black placeholder:text-slate-200 outline-none transition-all italic ${
                                        theme === 'dark' ? 'border-white/10 focus:border-white text-white' : 'border-slate-200 focus:border-indigo-500 text-slate-900'
                                    }`}
                                    value={newCampaign.objective}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] ml-4">Inicio Operativo</label>
                                <DatePicker 
                                    value={newCampaign.startDate}
                                    placeholder="SELECCIONAR FECHA"
                                    className="!bg-transparent !border-b !border-white/10 !text-white !font-black !px-0"
                                    onChange={(val) => setNewCampaign({ ...newCampaign, startDate: val })}
                                />
                            </div>
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] ml-4">Deadline Crítico</label>
                                <DatePicker 
                                    value={newCampaign.deadline}
                                    placeholder="SELECCIONAR FECHA"
                                    className="!bg-transparent !border-b !border-white/10 !text-white !font-black !px-0"
                                    onChange={(val) => setNewCampaign({ ...newCampaign, deadline: val })}
                                />
                            </div>
                        </div>

                        {/* Ingredients: High Density Layout */}
                        <div className="space-y-10 border-t border-white/[0.03] pt-16">
                             <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.6em] text-center mb-10">Componentes de Arquitectura</h4>
                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10">
                                {[
                                    { label: 'Videos', key: 'videos', icon: Video, color: 'text-rose-500' },
                                    { label: 'Posts', key: 'posts', icon: Box, color: 'text-indigo-400' },
                                    { label: 'Stories', key: 'stories', icon: Instagram, color: 'text-orange-500' },
                                    { label: 'Reels', key: 'reels', icon: Play, color: 'text-emerald-500' },
                                    { label: 'Tik Tok', key: 'tiktok', icon: Activity, color: 'text-cyan-400' },
                                    { label: 'Flujos CRM', key: 'crm', icon: Bot, color: 'text-emerald-500' },
                                    { label: 'Forms', key: 'forms', icon: Target, color: 'text-cyan-400' }
                                ].map((ing) => (
                                    <div key={ing.key} className="flex flex-col gap-6 items-center">
                                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
                                            theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'
                                        } ${ing.color}`}>
                                            <ing.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col items-center gap-2 w-full">
                                            <span className={`text-[8px] font-black uppercase tracking-widest group-hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>{ing.label}</span>
                                            <input 
                                                type="number"
                                                className={`w-16 bg-transparent border-b text-center py-2 font-black outline-none transition-all ${
                                                    theme === 'dark' ? 'border-white/10 focus:border-cyan-400 text-white' : 'border-slate-200 focus:border-indigo-500 text-slate-900'
                                                }`}
                                                value={newCampaign.ingredients[ing.key]}
                                                onChange={(e) => setNewCampaign({
                                                    ...newCampaign,
                                                    ingredients: { ...newCampaign.ingredients, [ing.key]: parseInt(e.target.value) || 0 }
                                                })}
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="flex items-center gap-10 justify-end pt-10">
                            <button 
                                onClick={handleCreate}
                                className={`px-24 py-8 rounded-full font-black text-[13px] uppercase tracking-[0.5em] hover:scale-[1.05] transition-all active:scale-95 ${
                                    theme === 'dark' ? 'bg-[#BCFF00] text-black shadow-[0_20px_60px_rgba(188,255,0,0.3)] hover:shadow-[#BCFF00]/50' : 'bg-indigo-600 text-white shadow-[0_20px_60px_rgba(79,70,229,0.2)] hover:bg-indigo-700'
                                }`}
                            >
                                INICIALIZAR SISTEMA
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* --- TEMPLATES MODAL: VAULT EDITION --- */}
                {isTemplatesOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`backdrop-blur-[100px] border rounded-[50px] p-24 space-y-16 relative overflow-hidden h-[90vh] flex flex-col transition-all duration-700 ${
                            theme === 'dark' ? 'bg-[#050511]/95 border-white/10 shadow-[0_0_150px_rgba(255,0,229,0.1)]' : 'bg-white/98 border-slate-200 shadow-[0_40px_150px_rgba(0,0,0,0.15)]'
                        }`}
                    >
                        {/* Digital Matrix Frame */}
                        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#ff00e5 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                        
                        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-[#ff00e5] via-violet-600 to-cyan-400 shadow-[0_0_20px_rgba(255,0,229,0.4)]" />
                        
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <h3 className={`text-6xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Bóveda de Maestría</h3>
                                <p className={`text-[11px] font-black uppercase tracking-[0.5em] ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>Protocolos Pre-Configurados de Alto Rendimiento</p>
                            </div>
                            <button 
                                onClick={() => setIsTemplatesOpen(false)}
                                className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/10 group hover:bg-rose-500 transition-all"
                            >
                                <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-10">
                                {[
                                    { id: 'lanzamiento', name: 'Lanzamiento Flash', objective: 'Conversión masiva', duration: '4 SEMANAS', type: 'Lanzamiento', icon: Target, color: 'text-violet-500' },
                                    { id: 'leads', name: 'Imán de Prospectos', objective: 'Captación multicanal', duration: 'CONTINUO', type: 'Captación', icon: Activity, color: 'text-emerald-500' },
                                    { id: 'high_ticket', name: 'High-Ticket Inbound', objective: 'Cierre de valor', duration: '8 SEMANAS', type: 'Ventas', icon: Star, color: 'text-amber-500' },
                                    { id: 'retargeting', name: 'Retargeting Maestro', objective: 'Recuperación omni', duration: 'CONTINUO', type: 'Publicidad', icon: Layers, color: 'text-indigo-500' },
                                    { id: 'linkedin', name: 'Autoridad B2B', objective: 'Posicionamiento', duration: '12 SEMANAS', type: 'Marca', icon: UserCheck, color: 'text-blue-500' }
                                ].map((tpl) => (
                                    <motion.button
                                        key={tpl.id}
                                        whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                        onClick={() => handleUseTemplate(tpl)}
                                        className="group relative flex flex-col items-start p-10 rounded-[48px] border border-white/[0.03] hover:border-white/10 transition-all duration-500 text-left"
                                    >
                                        <div className={`p-5 rounded-2xl bg-white/[0.02] border border-white/5 ${tpl.color} mb-10`}>
                                            <tpl.icon className="w-8 h-8" />
                                        </div>
                                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{tpl.name}</h4>
                                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-10">{tpl.objective}</p>
                                        
                                        <div className="flex items-center gap-4 w-full border-t border-white/[0.03] pt-8 mt-auto">
                                            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-600 group-hover:text-white transition-colors">{tpl.duration}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- FILTER & SEARCH: FLOATING GLASS SYSTEM --- */}
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Holographic Search Wrapper */}
                    <div className={`relative flex-1 group w-full p-[1px] rounded-[40px] transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent hover:via-cyan-400' : 'bg-slate-200 hover:bg-indigo-300 shadow-sm'}`}>
                        <div className={`relative rounded-[40px] backdrop-blur-[40px] overflow-hidden ${theme === 'dark' ? 'bg-[#050511]/80' : 'bg-white'}`}>
                            <Search className={`absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${theme === 'dark' ? 'text-gray-700 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
                            <input 
                                type="text" 
                                placeholder="ACCEDER AL REPOSITORIO MAESTRO..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full bg-transparent pl-20 pr-10 py-7 text-[12px] font-black placeholder:text-gray-800 outline-none transition-all uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                            />
                            {/* Scanning beam on focus */}
                            <motion.div 
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent skew-x-12"
                            />
                        </div>
                    </div>

                    {/* Holographic Filters wrapper */}
                    <div className={`p-[1px] rounded-[45px] transition-all duration-700 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#ff00e5]/20 to-transparent hover:via-[#ff00e5]/40' : 'bg-slate-200'}`}>
                        <div className={`flex p-1.5 rounded-[45px] backdrop-blur-[50px] w-full lg:w-auto h-[84px] items-center relative overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0A0A0F]/60' : 'bg-white/80'}`}>
                            {/* Inner Data Texture */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                            
                            {['Ver Todas', 'Activa', 'En Proceso', 'Draft'].map((tab) => {
                                const isActive = statusFilter === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setStatusFilter(tab)}
                                        className={`px-12 h-full rounded-[38px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap relative group flex items-center justify-center
                                            ${isActive ? "text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "text-gray-600 hover:text-white/60"}`}
                                    >
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-cyan-400/[0.05] border border-cyan-400/20 rounded-[38px] shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
                                            />
                                        )}
                                        <span className="relative z-10">{tab}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* --- STRATEGIES ARCHIVE: MINIMALIST GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 pt-10">
                    {filteredCampaigns.length === 0 && !isCreating ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-full py-40 text-center border border-white/5 rounded-[60px] bg-[#0A0A0F]/60 backdrop-blur-[120px] relative overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.05)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.05] to-transparent pointer-events-none" />
                            <Layers className="w-24 h-24 text-cyan-400/[0.1] mx-auto mb-10 animate-pulse" />
                            
                            {campaigns.length === 0 ? (
                                <>
                                    <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-6">REPOSITORIO <span className="text-[#BCFF00]">VACÍO</span></h3>
                                    <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.5em] max-w-lg mx-auto mb-16 opacity-60">
                                        No se han detectado flujos operativos. Inicializa un nuevo protocolo para comenzar el despliegue.
                                    </p>
                                    <button 
                                        onClick={() => setIsCreating(true)}
                                        className="px-20 py-7 rounded-full bg-[#BCFF00] text-black font-black text-[11px] uppercase tracking-[0.4em] hover:scale-110 transition-all shadow-[0_20px_50px_rgba(188,255,0,0.2)] active:scale-95"
                                    >
                                        INICIAR PROTOCOLO ALPHA
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-6">DATA <span className="text-rose-500">MISSING</span></h3>
                                    <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.5em] max-w-lg mx-auto mb-16 opacity-60">
                                        Los parámetros de búsqueda no coinciden con ninguna firma estratégica activa.
                                    </p>
                                    <button 
                                        onClick={() => { setSearchQuery(''); setStatusFilter('Ver Todas'); }}
                                        className="px-20 py-7 rounded-full bg-white/[0.03] border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/5 hover:text-white transition-all active:scale-95"
                                    >
                                        RE-ESCANEAR BASE DE DATOS
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
                            whileHover={{ 
                                y: -10, 
                                skewX: -1, 
                                skewY: 1,
                                transition: { duration: 0.4 } 
                            }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onOpenCanvas(strategy.id)}
                            className={`group relative backdrop-blur-[60px] border rounded-[32px] p-10 transition-all duration-700 overflow-hidden flex flex-col h-[680px] cursor-pointer shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
                                theme === 'dark' ? 'bg-[#0A0A0F]/60 hover:bg-[#0A0A0F]/40 border-white/5 hover:border-cyan-400/30' : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300 shadow-xl shadow-slate-200/10'
                            }`}
                        >
                            {/* --- INTERNAL HOLOGRAPHIC LAYERS --- */}
                            {/* Prism Refraction Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.03] via-transparent to-[#ff00e5]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            
                            {/* Perimeter Neon Glow */}
                            <div className="absolute inset-0 rounded-[32px] border-[0.5px] border-white/0 group-hover:border-cyan-400/20 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-700" />

                            {/* Data Matrix Texture */}
                            <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none overflow-hidden text-[8px] font-mono leading-none break-all p-4">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className="mb-1">
                                        {Math.random().toString(36).substring(2, 15)} {Math.random().toString(36).substring(2, 15)}
                                    </div>
                                ))}
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Status Header: Cyber Edition */}
                                <div className="flex items-start justify-between mb-12">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${strategy.status === 'Empezado' ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-emerald-400 shadow-[0_0_10px_#10b981]'}`} />
                                        <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${getStatusStyles(strategy.status)} border-none bg-transparent shadow-none p-0`}>
                                            {strategy.status || 'Active Protocol'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDelete(strategy.id, e)}
                                        className="p-4 bg-white/[0.03] hover:bg-rose-500/20 text-gray-800 hover:text-rose-500 rounded-2xl transition-all border border-white/5"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Strategy Identity */}
                                <div className="mb-12 min-h-[160px]">
                                    <h3 className="text-[38px] font-black text-white uppercase italic tracking-tighter leading-[0.85] group-hover:text-cyan-300 transition-colors duration-700 group-hover:translate-x-2">
                                        {strategy.name}
                                    </h3>
                                    <div className="h-[1px] w-12 bg-white/10 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:via-[#ff00e5] group-hover:to-transparent transition-all duration-1000 mt-8" />
                                </div>

                                {/* Operational Timeline */}
                                <div className="space-y-12 mb-auto">
                                    <div className="space-y-4">
                                        <p className="text-[9px] font-black text-cyan-400/40 uppercase tracking-[0.5em]">Línea de Tiempo Operativa</p>
                                        <div className="flex items-center gap-4 text-[13px] font-black text-gray-500 font-mono">
                                            <span className="text-white/60">{strategy.startDate || '01.10.26' }</span>
                                            <ChevronRight className="w-3 h-3 text-cyan-400/30" />
                                            <span className="text-magenta-400/40">{strategy.deadline || '30.12.26' }</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[9px] font-black text-[#ff00e5]/40 uppercase tracking-[0.5em]">Directiva Principal</p>
                                        <p className="text-[14px] font-medium text-gray-500 line-clamp-3 leading-relaxed tracking-tight group-hover:text-white/70 transition-colors italic">
                                            "{strategy.objective || 'Protocolo de escalado masivo mediante optimización de activos digitales.'}"
                                        </p>
                                    </div>
                                </div>

                                {/* Architecture Blueprint: High Contrast */}
                                <div className="grid grid-cols-4 gap-4 py-8 border-y border-white/5 mt-10 bg-white/[0.01]">
                                    {[
                                        { label: 'VID', key: 'videos', icon: Video, color: 'text-cyan-400' },
                                        { label: 'PST', key: 'posts', icon: Box, color: 'text-magenta-400' },
                                        { label: 'REL', key: 'reels', icon: Play, color: 'text-[#ff00e5]' },
                                        { label: 'TKT', key: 'tiktok', icon: Activity, color: 'text-emerald-400' }
                                    ].map((ing) => (
                                        <div key={ing.key} className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-2 group/icon">
                                                <ing.icon className={`w-3.5 h-3.5 ${ing.color} group-hover/icon:scale-125 transition-transform`} />
                                                <span className="text-[11px] font-black text-white">{strategy.ingredients?.[ing.key] || 0}</span>
                                            </div>
                                            <span className="text-[7px] font-black text-gray-800 uppercase tracking-widest">{ing.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Energy Rail Progress */}
                                <div className="pt-10 flex items-center justify-between">
                                    <div className="flex flex-col gap-4 flex-1 mr-12">
                                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">
                                            <span className="group-hover:text-cyan-400 transition-colors">Integridad de Red</span>
                                            <span className="text-cyan-400 italic font-mono">{strategy.progress || 0}%</span>
                                        </div>
                                        <div className="h-[4px] w-full bg-white/[0.03] rounded-full overflow-hidden relative">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${strategy.progress || 0}%` }}
                                                className="h-full bg-gradient-to-r from-cyan-500 via-[#ff00e5] to-[#ff00e5] shadow-[0_0_15px_rgba(255,0,229,0.5)]"
                                            />
                                            {/* Pulse Effect */}
                                            <motion.div 
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                            />
                                        </div>
                                    </div>

                                    <motion.div 
                                        whileHover={{ scale: 1.1, backgroundColor: '#fff', color: '#000' }}
                                        className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all shadow-xl"
                                    >
                                        <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
                                    </motion.div>
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
