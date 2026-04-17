'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import StrategyTopBar from './StrategyTopBar';
import StrategyNodeLibrary from './StrategyNodeLibrary';
import StrategyCanvas from './StrategyCanvas';
import StrategyMindMap from './StrategyMindMap';
import StrategyPropertyPanel from './StrategyPropertyPanel';
import StrategyToolbar from './StrategyToolbar';
import StrategyNavigation from './StrategyNavigation';
import StrategicOutliner from './StrategicOutliner';
import StrategyCreationWizard from './StrategyCreationWizard';
import MemoryAssetPicker from './MemoryAssetPicker';
import { agencyService } from '@/services/agencyService';

// New Architecture Flows
import StrategyFlowCampanas from './Flows/StrategyFlowCampanas';
import StrategyFolderPanel from './StrategyFolderPanel';
import { StrategicFunnel } from './StrategicFunnel';
import StrategyPlanner from './StrategyPlanner';
import StrategyContentParrilla from './StrategyContentParrilla';
import UnifiedCalendar from '../../calendar/UnifiedCalendar';
import StrategySelectionGrid from './StrategySelectionGrid';
import { STRATEGIC_COLUMNS, NODE_TYPES, NODE_CATEGORIES, MASTER_CONTENT_TYPES, NODE_CONTENT_SUBTYPES, STRATEGIC_RAILS, getNodeLaneId } from './StrategyConstants';

import {
    Network, TrendingUp, Layers, PenTool,
    Settings2, Sparkles, Binary, Target,
    Maximize2, Calendar, Box, BarChart3, Filter, Table, List, 
    Plus, Minus, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
    CheckCircle2, Search, CalendarDays
} from 'lucide-react';

const initialStrategyData = {
    name: '',
    status: 'borrador', // borrador, activa, completada
    projectName: '',
    campaigns: [],
    activeCampaignId: null,
    
    // Capa 1: Perfil
    profile: {
        brandName: '',
        whatItDoes: '',
        whatItOffers: '',
        targetAudience: '',
        problemSolved: '',
        valueProp: '',
        tone: '',
        mainGoal: ''
    },
    
    // Capa 2: Nivel
    growthLevel: null,
    
    // Capa 3 & 4: Estrategias (Cada estrategia tiene su propia pizarra)
    campaigns: [
        {
            id: 'camp_default',
            name: 'Estrategia Inicial',
            objective: '',
            type: 'Lanzamiento',
            duration: '4 Semanas',
            deadline: '',
            progress: 0,
            status: 'Empezado',
            nodes: [],
            edges: []
        }
    ],
    activeCampaignId: 'camp_default'
};

export default function StrategyBoard({ role, onClose, isSubcomponent = false }) {
    // --- STATE ---
    const [strategyData, setStrategyData] = useState({
        ...initialStrategyData,
        name: 'Mi Estrategia de Negocio',
        status: 'En Planificación',
        projectName: 'Marca Personal - Usuario',
        campaigns: [
            {
                id: 'camp_default',
                name: 'Estrategia Inicial',
                objective: 'Atraer primeros leads',
                type: 'Lanzamiento',
                duration: '4 Semanas',
                status: 'planificacion',
                nodes: [
                    { id: '1', type: 'educativo', x: 56, y: 300, data: { title: 'Contenido Educativo', objective: 'Atraer audiencia cualificada', status: 'Listo', funnelLevel: 'conciencia' } },
                    { id: '2', type: 'caso_exito', x: 856, y: 300, data: { title: 'Caso de Éxito', objective: 'Validar autoridad real', status: 'En construcción', funnelLevel: 'decision' } }
                ],
                edges: [
                    { id: 'e1-2', source: '1', target: '2' }
                ]
            }
        ],
        activeCampaignId: 'camp_default'
    });

    // --- AUTO-LAYOUT LOGIC: INTELLIGENT STRATEGIC MAPPING ---
    const layoutRef = useRef({}); // Track which campaigns have been auto-laid out

    useEffect(() => {
        if (!strategyData.activeCampaignId) return;
        
        // Prevent infinite loops and redundant layout calculations
        const campaignId = strategyData.activeCampaignId;
        const activeCampaign = strategyData.campaigns.find(c => c.id === campaignId);
        if (!activeCampaign || activeCampaign.nodes.length === 0) return;

        // Only auto-layout if something meaningful changed (IDs, Phases, or Length)
        // We include funnelLevel in the hash to make it reactive to property changes
        const nodeHash = activeCampaign.nodes.length + "_" + 
            activeCampaign.nodes.map(n => `${n.id}:${n.data?.funnelLevel}:${n.data?.subtype}`).join("_");
            
        if (layoutRef.current[campaignId] === nodeHash) return;

        const updatedNodes = activeCampaign.nodes.map((node) => {
            const isHub = node.id.startsWith('hu_') || node.type === 'estrategia';
            
            if (isHub) {
                const targetX = STRATEGIC_RAILS.HUBS_X;
                const hubs = activeCampaign.nodes.filter(n => n.id.startsWith('hu_') || n.type === 'estrategia');
                const hubIdx = hubs.indexOf(node);
                const targetY = 300 + (hubIdx >= 0 ? hubIdx : 0) * 450;
                
                if (Math.abs(node.x - targetX) > 10 || Math.abs(node.y - targetY) > 10) {
                    return { ...node, x: targetX, y: targetY };
                }
                return node;
            }

            // --- INTELLIGENT NEURAL DISTRIBUTION ENGINE ---
            const getStageIdx = (n) => {
                const intent = (n.data?.funnelLevel || n.data?.intent || '').toLowerCase();
                const typeCat = (NODE_TYPES[n.type]?.category || 'conciencia').toLowerCase();
                
                // Deep subtype lookup
                let subCat = '';
                if (n.data?.subtype) {
                    const allSubs = [...(NODE_CONTENT_SUBTYPES.video || []), ...(NODE_CONTENT_SUBTYPES.imagen || []), ...(NODE_CONTENT_SUBTYPES.recurso || [])];
                    subCat = (allSubs.find(s => s.id === n.data.subtype)?.category || '').toLowerCase();
                }

                const title = (n.data?.title || '').toLowerCase();
                const searchStr = `${intent} ${typeCat} ${subCat} ${title}`.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 

                // Smart Mapping Priorities
                if (searchStr.includes('conciencia') || searchStr.includes('atraccion') || searchStr.includes('ads')) return 0;
                if (searchStr.includes('interes') || searchStr.includes('conexion')) return 1;
                if (searchStr.includes('consideracion') || searchStr.includes('autoridad') || searchStr.includes('educacion')) return 2;
                if (searchStr.includes('conversion') || searchStr.includes('venta') || searchStr.includes('cierre') || searchStr.includes('crm') || searchStr.includes('form')) return 3;
                if (searchStr.includes('retencion') || searchStr.includes('fidelizacion') || searchStr.includes('escala')) return 4;
                
                return 0; // Default to Awareness
            };

            const stageIdx = getStageIdx(node);
            const targetX = STRATEGIC_RAILS.COLUMNS[stageIdx] + 25; 
            
            const tacticalNodes = activeCampaign.nodes.filter(n => !(n.id.startsWith('hu_') || n.type === 'estrategia'));
            const nodesInThisStage = tacticalNodes.filter(n => getStageIdx(n) === stageIdx);

            const nodeIdxInStage = nodesInThisStage.findIndex(n => n.id === node.id);
            const targetY = 320 + (nodeIdxInStage >= 0 ? nodeIdxInStage : 0) * STRATEGIC_RAILS.VERTICAL_PADDING;

            const shouldMove = Math.abs(node.x - targetX) > 10 || Math.abs(node.y - targetY) > 10;
            const stageId = STRATEGIC_COLUMNS[stageIdx]?.id || 'conciencia';
            const needsPhaseUpdate = node.data?.funnelLevel !== stageId;

            if (shouldMove || needsPhaseUpdate) {
                return { 
                    ...node, 
                    x: targetX, 
                    y: targetY,
                    data: { ...node.data, funnelLevel: stageId }
                };
            }
            return node;
        });

        const hasChanges = updatedNodes.some((n, i) => 
            n.x !== activeCampaign.nodes[i].x || 
            n.y !== activeCampaign.nodes[i].y ||
            n.data?.funnelLevel !== activeCampaign.nodes[i].data?.funnelLevel
        );
        
        if (hasChanges) {
            layoutRef.current[campaignId] = nodeHash; // Mark as processed BEFORE state update
            setStrategyData(prev => ({
                ...prev,
                campaigns: prev.campaigns.map(c => 
                    c.id === campaignId ? { ...c, nodes: updatedNodes } : c
                )
            }));
        }
    }, [strategyData.activeCampaignId, strategyData.campaigns]);

    // Strategy Navigation State
    const [activeFlow, setActiveFlow] = useState('campañas'); // 'campañas', 'pizarra', 'planner', 'nodos', 'analitica'
    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');

    // Sync Strategy Data with HQ Client Record
    useEffect(() => {
        if (clientId) {
            const client = agencyService.getClientById(clientId);
            if (client) {
                setStrategyData(prev => ({
                    ...prev,
                    projectName: client.name,
                    profile: {
                        ...prev.profile,
                        brandName: client.name,
                        targetAudience: client.target || prev.profile.targetAudience
                    }
                }));
            }
        }
    }, [clientId]);
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [activeTool, setActiveTool] = useState('select');
    const [selectedParrillaCampaignId, setSelectedParrillaCampaignId] = useState(null);

    // Drawing & Interaction States (Restored)
    const [drawings, setDrawings] = useState([]);
    const [penSettings, setPenSettings] = useState({ color: '#6366f1', width: 3, opacity: 1 });
    const [contextMenu, setContextMenu] = useState(null);

    // Canvas interaction State
    const [view, setView] = useState({ x: 0, y: 0, scale: 0.95 });
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const [isMemoryPickerOpen, setIsMemoryPickerOpen] = useState(false);
    const [memoryTargetNodeId, setMemoryTargetNodeId] = useState(null);
    const [isCompactMode, setIsCompactMode] = useState(false);
    const [viewMode, setViewMode] = useState('tactical'); // 'tactical' | 'standard'
    const [theme, setTheme] = useState('dark'); // 'dark' | 'light'

    // AI Analysis & Reports
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportProgress, setReportProgress] = useState(0);
    const [analysisLogs, setAnalysisLogs] = useState([]);
    const [reportData, setReportData] = useState(null);

    // Planner & Optimization States
    const [isStrategySaved, setIsStrategySaved] = useState(true);
    const [isProcessingPlanner, setIsProcessingPlanner] = useState(false);
    const [hasContentPlan, setHasContentPlan] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [isFunnelOpen, setIsFunnelOpen] = useState(false);
    const [isAuditorActive, setIsAuditorActive] = useState(false);
    const [activePropertyTab, setActivePropertyTab] = useState('general');
    
    // Helper state for connection
    const [connectionStart, setConnectionStart] = useState(null);


    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        setReportProgress(0);
        setAnalysisLogs(['Iniciando motor de análisis estratégico...', 'Escaneando arquitectura de nodos...', 'Calculando vectores de conversión...']);
        
        // Simulation sequence
        const steps = [
            { p: 20, log: 'Analizando conexiones entre etapas...' },
            { p: 40, log: 'Detectando cuellos de botella en el flujo...' },
            { p: 60, log: 'Proyectando ROI según datos históricos...' },
            { p: 85, log: 'Generando recomendaciones de optimización...' },
            { p: 100, log: 'Reporte finalizado.' }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
            setReportProgress(step.p);
            setAnalysisLogs(prev => [...prev, step.log].slice(-4));
        }

        setReportData({
            impactScore: 78,
            opportunities: [
                'Aumentar la duración del contenido educativo en un 15%',
                'Añadir un nodo de retargeting después del Caso de Éxito',
                'Optimizar el CTA de la etapa de Conversión'
            ],
            metrics: { leads: '+12%', roi: 'x3.2', engagement: 'High' },
            newY: 120 // Assuming this is the "Y increment for manual node placement"
        });
        setIsGeneratingReport(false);
    };

    // Navigation Handlers
    const handleZoomIn = useCallback(() => {
        setView(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 3) }));
    }, []);

    const handleZoomOut = useCallback(() => {
        setView(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.1) }));
    }, []);

    const handleExport = useCallback(async () => {
        setIsGeneratingReport(true);
        setReportProgress(0);
        setAnalysisLogs(['Iniciando motor de exportación...', 'Renderizando arquitectura de nodos...', 'Generando activos visuales...', 'Optimizando para PDF/Relación de aspecto...']);
        
        for (let i = 0; i <= 100; i += 20) {
            await new Promise(resolve => setTimeout(resolve, 600));
            setReportProgress(i);
        }
        
        setIsGeneratingReport(false);
        setReportData(null); 
        alert('Estrategia exportada exitosamente. El archivo se ha descargado.');
    }, []);

    const handleZoomReset = useCallback(() => {
        setView(prev => ({ ...prev, scale: 0.95, x: 0, y: 0 }));
    }, []);

    const handlePan = useCallback((dx, dy) => {
        setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                handleZoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                handleZoomOut();
            } else if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleZoomReset();
            }
            else if (e.key === 'ArrowUp') { e.preventDefault(); handlePan(0, 50); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); handlePan(0, -50); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); handlePan(50, 0); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); handlePan(-50, 0); }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleZoomIn, handleZoomOut, handleZoomReset, handlePan]);

    // Auto-save/Sync Heartbeat Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setIsStrategySaved(false);
            setTimeout(() => {
                setIsStrategySaved(true);
            }, 2000);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        { id: 'campañas', icon: Layers, label: 'Mis Estrategias' },
        { id: 'tablero', icon: Maximize2, label: 'Pizarra de Flujo' },
        { id: 'parrilla', icon: Table, label: 'Producción (Parrilla/Kanban)' },
        { id: 'planner', icon: List, label: 'Seguimiento Maestro' },
        { id: 'funnel', icon: Filter, label: 'Embudo Estratégico', action: () => setIsFunnelOpen(true) },
        { id: 'nodos', icon: Box, label: 'Librería de Nodos' },
        { id: 'analitica', icon: BarChart3, label: 'IA Insights' },
    ];

    // --- CAMPAIGN CANVAS DISPATCHERS ---
    const activeCampaign = useMemo(() =>
        strategyData.campaigns.find(c => c.id === strategyData.activeCampaignId) || null,
        [strategyData.campaigns, strategyData.activeCampaignId]);

    // --- COMPUTED: Funnel Health (Smart Auditor) ---
    const funnelHealth = useMemo(() => {
        if (!activeCampaign) return null;
        const counts = {
            conciencia: activeCampaign.nodes.filter(n => n.data?.funnelLevel === 'conciencia').length,
            interés: activeCampaign.nodes.filter(n => n.data?.funnelLevel === 'interés').length,
            consideración: activeCampaign.nodes.filter(n => n.data?.funnelLevel === 'consideración').length,
            conversión: activeCampaign.nodes.filter(n => n.data?.funnelLevel === 'conversión').length,
            retención: activeCampaign.nodes.filter(n => n.data?.funnelLevel === 'retención').length
        };
        return {
            counts,
            weaknesses: Object.entries(counts).filter(([_, count]) => count < 2).map(([id]) => id),
            isHealthy: !Object.values(counts).some(c => c === 0)
        };
    }, [activeCampaign]);

    // --- STRATEGY HEALTH VALIDATOR ---
    const strategyHealth = useMemo(() => {
        if (!activeCampaign) return null;
        const nodes = activeCampaign.nodes;
        const edges = activeCampaign.edges;
        
        const phases = {
            atracción: nodes.some(n => n.data?.funnelLevel === 'atracción'),
            conexión: nodes.some(n => n.data?.funnelLevel === 'conexión'),
            autoridad: nodes.some(n => n.data?.funnelLevel === 'autoridad'),
            conversión: nodes.some(n => n.data?.funnelLevel === 'conversión'),
            escala: nodes.some(n => n.data?.funnelLevel === 'escala')
        };
   
        const missingPhases = Object.keys(phases).filter(k => !phases[k]);
        
        const hasCTA = phases.conversión;
        const hasSocialProof = phases.autoridad;
   
        const orphans = nodes.filter(n => {
            const hasIncoming = edges.some(e => e.target === n.id);
            const hasOutgoing = edges.some(e => e.source === n.id);
            const hasStrategicLane = !!getNodeLaneId(n);
            return !hasIncoming && !hasOutgoing && !hasStrategicLane && nodes.length > 1;
        });
   
        let validationStatus = 'optimo'; 
        let errors = [];
        let warnings = [];
   
        if (missingPhases.length >= 3) validationStatus = 'critico';
        else if (missingPhases.length > 0) validationStatus = 'mejora';
   
        if (!hasCTA) {
            validationStatus = 'critico';
            errors.push('Falta nodo de Conversión / CTA explícito.');
        }
        if (!hasSocialProof) {
            if (validationStatus === 'optimo') validationStatus = 'mejora';
            warnings.push('Se recomienda agregar Prueba Social o Testimonios.');
        }
        if (orphans.length > 0) {
            warnings.push(`${orphans.length} nodo(s) sin conexión en el flujo.`);
            if (validationStatus === 'optimo') validationStatus = 'mejora';
        }
        if (missingPhases.length > 0) {
            warnings.push(`Faltan fases clave: ${missingPhases.join(', ')}`);
        }
   
        return { status: validationStatus, errors, warnings, phases, orphans };
    }, [activeCampaign]);

    const updateActiveCampaign = useCallback((updateFn) => {
        setStrategyData(prev => {
            const campaignIndex = prev.campaigns.findIndex(c => c.id === prev.activeCampaignId);
            if (campaignIndex === -1) return prev;

            const updatedCampaigns = [...prev.campaigns];
            const oldCampaign = updatedCampaigns[campaignIndex];
            const updatedCampaign = typeof updateFn === 'function' ? updateFn(oldCampaign) : updateFn;
            
            updatedCampaigns[campaignIndex] = updatedCampaign;
            return {
                ...prev,
                campaigns: updatedCampaigns
            };
        });
        setIsStrategySaved(false);
    }, []);

    const selectedNode = useMemo(() =>
        activeCampaign?.nodes.find(n => n.id === selectedNodeId),
        [activeCampaign, selectedNodeId]);

    const selectedEdge = useMemo(() =>
        activeCampaign?.edges.find(e => e.id === selectedEdgeId),
        [activeCampaign, selectedEdgeId]);

    // --- TOP BAR ACTIONS ---
    const handleSaveStrategy = useCallback(() => {
        setIsStrategySaved(true);
        alert('Estructura completa guardada correctamente.');
    }, []);

    const handleGeneratePlanner = useCallback(async () => {
        if (!activeCampaign || isProcessingPlanner) return;
        
        setIsProcessingPlanner(true);
        toast.info('Analizando estrategia y generando plan de contenido...', { duration: 2000 });

        setTimeout(() => {
            setHasContentPlan(true);
            setIsProcessingPlanner(false);
            toast.success(`¡Plan de Contenido generado con éxito!`, {
                description: `Se han estructurado ${activeCampaign.nodes.length} piezas de contenido para ${activeCampaign.name}.`,
            });
            setIsStrategySaved(true);
        }, 2000);
    }, [activeCampaign, isProcessingPlanner]);

    const handleSendToCreativeStudio = useCallback(() => {
        if (!isStrategySaved || !hasContentPlan || !activeCampaign) return;

        const creativeProjects = activeCampaign.nodes.map(node => {
            const typeConfig = NODE_TYPES[node.type] || NODE_TYPES.educativo;
            return {
                id: `cp_${Date.now()}_${node.id}`,
                title: node.data?.title || typeConfig.label,
                type: node.type,
                objective: node.data?.objective || typeConfig.desc,
                category: typeConfig.category,
                source: 'strategy',
                campaignId: activeCampaign.id,
                campaignName: activeCampaign.name,
                createdAt: new Date().toISOString()
            };
        });

        try {
            const existingProjects = JSON.parse(localStorage.getItem('diic_creative_projects') || '[]');
            localStorage.setItem('diic_creative_projects', JSON.stringify([...existingProjects, ...creativeProjects]));
            updateActiveCampaign(c => ({ ...c, status: 'activa' }));
            alert(`¡Éxito! Se han enviado ${creativeProjects.length} proyectos al Estudio Creativo.`);
        } catch (error) {
            console.error('Error saving:', error);
        }
    }, [activeCampaign, isStrategySaved, hasContentPlan, updateActiveCampaign]);

    const handleCompleteWizard = useCallback((config) => {
        if (!activeCampaign) return;
        
        const { name, startDate, endDate, volume } = config;
        
        // --- EXPERT GENERATION ENGINE (JERARQUÍA PRO) ---
        const newNodes = [];
        
        // Distribution Rules (Enriquecido con Áreas y Categorías)
        const SUBTYPE_MAP = {
            video: { id: 'v_youtube', areaId: 'creativa', categoryId: 'video', levels: ['conciencia', 'autoridad'] },
            reel: { id: 'v_reels', areaId: 'creativa', categoryId: 'video', levels: ['conciencia', 'interés'] },
            tiktok: { id: 'v_tiktok', areaId: 'creativa', categoryId: 'video', levels: ['conciencia', 'interés'] },
            podcast: { id: 'v_podcast', areaId: 'creativa', categoryId: 'video', levels: ['conciencia', 'interés'] },
            masterclass: { id: 'v_masterclass', areaId: 'creativa', categoryId: 'video', levels: ['consideración', 'autoridad'] },
            imagen: { id: 'i_post', areaId: 'creativa', categoryId: 'imagen', levels: ['consideración', 'conversión'] },
            carrusel: { id: 'i_carrucel', areaId: 'creativa', categoryId: 'imagen', levels: ['conexión', 'autoridad'] },
            deck: { id: 'i_deck', areaId: 'creativa', categoryId: 'imagen', levels: ['consideración', 'conversión'] },
            historia: { id: 'i_historias', areaId: 'creativa', categoryId: 'imagen', levels: ['conexión', 'retención'] },
            community: { id: 'r_community', areaId: 'conversiones', categoryId: 'recurso', levels: ['interés', 'retención'] },
            audit: { id: 'r_audit', areaId: 'conversiones', categoryId: 'recurso', levels: ['consideración'] },
            affiliate: { id: 'r_affiliate', areaId: 'conversiones', categoryId: 'recurso', levels: ['retención'] },
            crm: { id: 'l3_crm_email', areaId: 'crm', categoryId: 'crm', levels: ['conversión'] },
            form: { id: 'r_form', areaId: 'conversiones', categoryId: 'recurso', levels: ['conversión'] }
        };

        const stageCounts = {
            conciencia: 0,
            interés: 0,
            consideración: 0,
            conversión: 0,
            retención: 0
        };

        Object.entries(volume).forEach(([type, count]) => {
            if (count <= 0) return;
            
            const mapping = SUBTYPE_MAP[type];
            if (!mapping) return;
            
            const possibleLevels = mapping.levels || ['conciencia'];
            
            for (let i = 0; i < count; i++) {
                const levelId = possibleLevels[i % possibleLevels.length];
                const stageIdx = STRATEGIC_COLUMNS.findIndex(col => col.id === levelId);
                const actualIdx = stageIdx === -1 ? 0 : stageIdx;
                
                const targetX = STRATEGIC_RAILS.COLUMNS[actualIdx] + 25;
                const targetY = 320 + (stageCounts[levelId] * STRATEGIC_RAILS.VERTICAL_PADDING);
                stageCounts[levelId]++;

                const nodeId = `node_${type}_${Date.now()}_${i}`;

                newNodes.push({
                    id: nodeId,
                    type: type === 'reel' ? 'reel_viral' : (type === 'video' ? 'educativo' : type),
                    x: targetX,
                    y: targetY,
                    data: {
                        title: `${type.toUpperCase()} #${i + 1}`,
                        status: 'Idea',
                        funnelLevel: levelId,
                        areaId: mapping.areaId,
                        categoryId: mapping.categoryId,
                        subtype: mapping.id,
                        objective: 'Arquitectura Estratégica',
                        linkedTools: { guion: false, diseño: false, filmacion: false, edicion: false }
                    }
                });
            }
        });

        updateActiveCampaign(c => ({
            ...c,
            name: name || c.name,
            startDate,
            endDate,
            strategyIngredients: volume, // Store the architecture definition
            nodes: newNodes,
            edges: [] 
        }));
        
        setIsConfiguring(false);
        setActiveFlow('tablero');
        toast.success(`Estructura jerárquica de ${newNodes.length} nodos desplegada.`, {
            description: `Se han orquestado los activos bajo las raíces de Zona Creativa, CRM y Conversiones.`
        });
    }, [activeCampaign, updateActiveCampaign]);

    // --- LAYOUT ENGINE: STRATEGIC RE-ORGANIZATION (UNIFIED) ---
    const handleOrganizeBoard = useCallback(() => {
        if (!activeCampaign) return;
        
        // This function now simply resets the layout memory to force a fresh organization pass
        // in the principal useEffect, ensuring absolute consistency.
        layoutRef.current[strategyData.activeCampaignId] = "FORCE_REORG_" + Date.now();
        setStrategyData(prev => ({ ...prev })); // Trigger re-render to run layout useEffect
        
        toast.success('Pizarra Estratégica Organizada', { 
            description: 'Los nodos se han alineado con la arquitectura de embudo y carriles.' 
        });
    }, [activeCampaign, strategyData.activeCampaignId]);

    // Auto-trigger AI if tool selected
    useEffect(() => {
        if (activeTool === 'ai') {
            setIsAILoading(true);
            setTimeout(() => {
                setIsFunnelOpen(true);
                setIsAILoading(false);
                setActiveTool('select');
            }, 1000);
        }

        if (activeTool === 'organize') {
            handleOrganizeBoard(); // Use the unified organizer
            setActiveTool('select');
        }

        if (activeTool === 'view-standard') {
            setViewMode(prev => {
                const next = prev === 'standard' ? 'tactical' : 'standard';
                toast.success(next === 'standard' ? 'Activando Vista de Control Estándar' : 'Regresando a Vista Táctica Compacta');
                return next;
            });
            setActiveTool('select');
        }
    }, [activeTool, handleOrganizeBoard]);


    const handleOpenMemoryPicker = useCallback((nodeId) => {
        setMemoryTargetNodeId(nodeId);
        setIsMemoryPickerOpen(true);
    }, []);

    const handleSelectAsset = useCallback((asset) => {
        if (!memoryTargetNodeId) return;
        updateActiveCampaign(c => ({
            ...c,
            nodes: c.nodes.map(n => n.id === memoryTargetNodeId ? {
                ...n,
                data: { ...n.data, memoryLinks: [...(n.data?.memoryLinks || []), asset] }
            } : n)
        }));
        setIsMemoryPickerOpen(false);
    }, [memoryTargetNodeId, updateActiveCampaign]);

    const handleAddNode = useCallback((selection, x, y) => {
        if (!activeCampaign) return;
        const typeId = typeof selection === 'string' ? selection : selection.type;
        const subtypeId = selection?.subtype;
        const masterType = selection?.masterType || (typeId === 'video' ? 'video' : 'imagen');
        const catId = selection?.category;
        const typeConfig = NODE_TYPES[typeId] || NODE_TYPES.educativo;
        const masterConfig = MASTER_CONTENT_TYPES[masterType] || MASTER_CONTENT_TYPES.imagen;

        let funnelLevel = catId || typeConfig.category;
        if (x) {
            const calculatedIdx = Math.max(0, Math.min(STRATEGIC_COLUMNS.length - 1, Math.floor(x / 600)));
            funnelLevel = STRATEGIC_COLUMNS[calculatedIdx].id;
        }
        if (funnelLevel === 'especial') funnelLevel = 'atracción';
        
        const columnIndex = STRATEGIC_COLUMNS.findIndex(col => col.id === funnelLevel) || 0;
        const stageOffset = STRATEGIC_RAILS.COLUMNS[columnIndex]; 
        
        const finalX = stageOffset + 25;
        const finalY = 350 + (activeCampaign.nodes.filter(n => (n.data?.funnelLevel || '').toLowerCase() === funnelLevel).length * STRATEGIC_RAILS.VERTICAL_PADDING);

        const newNode = {
            id: Math.random().toString(36).substr(2, 9),
            type: typeId,
            x: finalX, y: finalY,
            data: { 
                title: selection?.label || typeConfig.label, 
                subtype: subtypeId,
                masterType: masterType,
                status: 'Idea', 
                funnelLevel: funnelLevel,
                stage: funnelLevel.toUpperCase(),
                linkedTools: { guion: false, diseño: false, filmacion: false, edicion: false }
            }
        };

        updateActiveCampaign(c => ({ ...c, nodes: [...c.nodes, newNode] }));
        setSelectedNodeId(newNode.id);

        // --- AUTOMATION: Strategy-to-Workstation ---
        const roleMapping = {
            'video': 'Editor',
            'reel': 'Editor',
            'imagen': 'Diseño',
            'historia': 'Diseño',
            'fotografía': 'Fotógrafo',
            'reel_viral': 'Editor'
        };

        const targetRole = roleMapping[newNode.type] || 'Diseño';
        
        agencyService.createTask({
            title: newNode.data.title,
            client: strategyData.projectName || 'Cliente Genérico',
            assigned_role: targetRole,
            status: 'Pendiente',
            priority: 'Media',
            nodeId: newNode.id
        });

        toast.success(`${newNode.data.title} añadido y enviado a ${targetRole.toUpperCase()}`);
    }, [activeCampaign, updateActiveCampaign]);

    const handleApplyTemplate = useCallback((templateName) => {
        const templates = {
            // Updated to align with 600px columns: 40 (Pos A), 640 (Pos A of Col 1), etc.
            default: [
                { id: 'd1', type: 'reel_viral', x: 40, y: 150, label: 'Video Viral' },
                { id: 'd2', type: 'estilo_vida', x: 640, y: 150, label: 'Conexión' }
            ]
        };
        const nodesToAdd = templates[templateName] || templates.default;
        nodesToAdd.forEach(n => handleAddNode(n, n.x, n.y));
    }, [handleAddNode]);

    const handleNodeMove = useCallback((id, x, y) => {
        updateActiveCampaign(c => {
            const node = c.nodes.find(n => n.id === id);
            if (!node) return c;
            return {
                ...c,
                nodes: c.nodes.map(n => n.id === id ? { ...n, x, y } : n)
            };
        });
    }, [updateActiveCampaign]);

    const handleUpdateNode = useCallback((id, data) => {
        updateActiveCampaign(c => {
            const oldNode = c.nodes.find(n => n.id === id);
            if (!oldNode) return c;
            let newX = oldNode.x;
            if (data.funnelLevel !== oldNode.data?.funnelLevel) {
                const columnIndex = STRATEGIC_COLUMNS.findIndex(col => col.id === data.funnelLevel);
                newX = 256 + (columnIndex * 600) + 100; 
            }

            const updatedNodes = c.nodes.map(n => n.id === id ? { ...n, x: newX, data } : n);

            // SYNC WITH GLOBAL CALENDAR (localStorage)
            try {
                const existingProjects = JSON.parse(localStorage.getItem('diic_creative_projects') || '[]');
                const projectIndex = existingProjects.findIndex(p => p.id.endsWith(id)); // Match by node relative ID
                if (projectIndex !== -1) {
                    existingProjects[projectIndex] = {
                        ...existingProjects[projectIndex],
                        title: data.title || existingProjects[projectIndex].title,
                        publishDate: data.publishDate ? new Date(data.publishDate).toISOString() : existingProjects[projectIndex].publishDate,
                        type: oldNode.type,
                    };
                    localStorage.setItem('diic_creative_projects', JSON.stringify(existingProjects));
                }
            } catch (e) {
                console.error("Sync error:", e);
            }

            return {
                ...c,
                nodes: updatedNodes
            };
        });
    }, [updateActiveCampaign]);

    const handleDeleteNode = useCallback((id) => {
        updateActiveCampaign(c => ({
            ...c,
            nodes: c.nodes.filter(n => n.id !== id),
            edges: c.edges.filter(e => e.source !== id && e.target !== id)
        }));
        setSelectedNodeId(null);
    }, [updateActiveCampaign]);

    const handleDuplicateNode = useCallback((id) => {
        const nodeToDuplicate = activeCampaign?.nodes.find(n => n.id === id);
        if (!nodeToDuplicate) return;
        const newNode = {
            ...nodeToDuplicate,
            id: Math.random().toString(36).substr(2, 9),
            x: nodeToDuplicate.x + 50,
            y: nodeToDuplicate.y + 50
        };
        updateActiveCampaign(c => ({ ...c, nodes: [...c.nodes, newNode] }));
        setSelectedNodeId(newNode.id);
    }, [activeCampaign, updateActiveCampaign]);

    const handleDeleteEdge = useCallback((id) => {
        updateActiveCampaign(c => ({
            ...c,
            edges: c.edges.filter(e => e.id !== id)
        }));
        setSelectedEdgeId(null);
    }, [updateActiveCampaign]);

    const handleUpdateEdge = useCallback((id, data) => {
        updateActiveCampaign(c => ({
            ...c,
            edges: c.edges.map(e => e.id === id ? { ...e, ...data } : e)
        }));
    }, [updateActiveCampaign]);

    const handleConnectNodes = useCallback((sourceId, targetId) => {
        if (sourceId === targetId) return;
        updateActiveCampaign(c => {
            if (c.edges.some(e => e.source === sourceId && e.target === targetId)) return c;
            const newEdge = { id: `e-${sourceId}-${targetId}`, source: sourceId, target: targetId };
            return { ...c, edges: [...c.edges, newEdge] };
        });
    }, [updateActiveCampaign]);

    const handleClearDrawings = useCallback(() => {
        if (window.confirm('¿Limpiar todos los dibujos del lienzo?')) {
            setDrawings([]);
        }
    }, [setDrawings]);

    return (
        <div className={`${isSubcomponent ? 'relative flex-1' : 'fixed inset-0 z-[100]'} w-full flex flex-col overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050511]' : 'bg-[#F1F5F9]'}`}>
            {/* 1. TOP BAR */}
            <StrategyTopBar
                strategyName={strategyData.name}
                strategyStatus={strategyData.status}
                projectName={strategyData.projectName}
                campaigns={strategyData.campaigns}
                activeCampaignId={strategyData.activeCampaignId}
                strategyHealth={strategyHealth}
                onSelectCampaign={(id) => setStrategyData(prev => ({ ...prev, activeCampaignId: id }))}
                onCreateCampaign={() => {
                    setIsCreatingCampaign(true);
                    setActiveFlow('campañas');
                }}
                onGenerateAISuggestion={() => setIsFunnelOpen(true)}
                onSendToPlanner={() => setActiveFlow('planner')}
                isStrategySaved={isStrategySaved}
                hasContentPlan={hasContentPlan}
                isProcessingPlanner={isProcessingPlanner}
                onSendToCreativeStudio={handleSendToCreativeStudio}
                onOpenFolder={() => setActiveFlow('campañas')}
                view={view}
                onViewChange={setView}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleZoomReset={handleZoomReset}
                handlePan={handlePan}
                activeFlow={activeFlow}
                isCompactMode={isCompactMode}
                onToggleCompactMode={() => setIsCompactMode(!isCompactMode)}
                theme={theme}
                onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                onClose={onClose}
            />

            <div className="flex-1 flex overflow-hidden relative">
                {/* 2. SIDEBAR NAVIGATION */}
                <aside className={`w-16 border-r flex flex-col items-center py-6 gap-4 z-[80] transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0A0A0F] border-white/5' : 'bg-white border-slate-300/50 shadow-xl shadow-slate-300/10'}`}>
                    {menuItems.map((item) => {
                        const isActive = activeFlow === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => item.action ? item.action() : setActiveFlow(item.id)}
                                className={`group relative p-3 rounded-xl transition-all ${isActive
                                        ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                        : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                                    }`}
                                title={item.label}
                            >
                                <item.icon className="w-5 h-5" />
                                <div className="absolute left-full ml-4 px-3 py-2 bg-black border border-white/10 rounded-xl opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[90]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{item.label}</p>
                                </div>
                            </button>
                        );
                    })}
                    <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
                        <button className="p-3 text-gray-700 hover:text-white transition-all">
                            <Settings2 className="w-5 h-5" />
                        </button>
                    </div>
                </aside>

                {/* 3. CORE CONTENT AREA */}
                <div className="flex-1 flex relative overflow-hidden">
                    {activeTool === 'folder' && <StrategyFolderPanel 
                        onClose={() => setActiveTool('select')}
                        onSave={handleSaveStrategy}
                    />}

                    <div className={`flex-1 flex flex-col min-h-0 relative overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050511]' : 'bg-[#F1F5F9]'}`}>
                        {activeFlow === 'campañas' && (
                            <StrategyFlowCampanas 
                                strategyData={strategyData} 
                                onUpdate={(data) => setStrategyData(data)} 
                                onOpenCanvas={(id) => {
                                    setStrategyData(prev => ({ ...prev, activeCampaignId: id }));
                                    setActiveFlow('tablero');
                                }}
                                forceCreate={isCreatingCampaign}
                                onCreationClose={() => setIsCreatingCampaign(false)}
                                onConfigureBoard={() => setIsConfiguring(true)}
                                theme={theme}
                            />
                        )}

                        {activeFlow === 'planner' && (
                            <StrategyPlanner activeCampaign={activeCampaign} />
                        )}

                        {activeFlow === 'parrilla' && (
                            selectedParrillaCampaignId ? (
                                <StrategyContentParrilla 
                                    nodes={strategyData.campaigns.find(c => c.id === selectedParrillaCampaignId)?.nodes || []} 
                                    onUpdateNode={handleUpdateNode}
                                    onBack={() => setSelectedParrillaCampaignId(null)}
                                />
                            ) : (
                                <StrategySelectionGrid 
                                    campaigns={strategyData.campaigns}
                                    onSelect={(id) => setSelectedParrillaCampaignId(id)}
                                />
                            )
                        )}


                        {activeFlow === 'nodos' && (
                            <div className="flex-1 overflow-hidden bg-[#050511] relative">
                                <StrategyNodeLibrary 
                                    onAddNode={handleAddNode} 
                                    onApplyTemplate={handleApplyTemplate}
                                    onClose={() => setActiveFlow('tablero')} 
                                    isStandalone={true}
                                />
                            </div>
                        )}

                        {activeFlow === 'analitica' && (
                            <div className="flex-1 flex flex-col bg-[#050511] relative overflow-hidden">
                                <div className="flex-1 flex items-center justify-center p-20 relative z-10">
                                    <AnimatePresence mode="wait">
                                        {!isGeneratingReport && !reportData ? (
                                            <button onClick={handleGenerateReport} className="px-10 py-5 bg-indigo-600 rounded-3xl text-white font-black uppercase tracking-widest shadow-2xl">
                                                Generar Reporte de Impacto
                                            </button>
                                        ) : isGeneratingReport ? (
                                            <div className="text-white">Generando... {reportProgress}%</div>
                                        ) : (
                                            <div className="text-white">Reporte de Impacto: {reportData.impactScore}</div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {activeFlow === 'tablero' && (
                            !activeCampaign ? (
                                <div className={`flex-1 flex flex-col items-center justify-center transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050511]' : 'bg-slate-100'}`}>
                                    <h2 className={`text-xl font-bold mb-2 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Pizarra No Disponible</h2>
                                </div>
                            ) : (
                                <div className="flex-1 flex overflow-hidden">
                                    <StrategicOutliner 
                                        nodes={activeCampaign.nodes} 
                                        activeNodeId={selectedNodeId}
                                        onNodeSelect={(id) => { setSelectedNodeId(id); setSelectedEdgeId(null); }}
                                        onUpdateNode={handleUpdateNode}
                                        theme={theme}
                                    />
                                    <div className={`flex-1 relative flex flex-col min-h-0 overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050511]' : 'bg-white'}`}>
                                        {activeTool === 'create' && (
                                            <StrategyNodeLibrary  
                                                onAddNode={(selection) => { handleAddNode(selection); setActiveTool('select'); }} 
                                                onApplyTemplate={(templateName) => { handleApplyTemplate(templateName); setActiveTool('select'); }}
                                                onClose={() => setActiveTool('select')}
                                            />
                                        )}
                                        <StrategyToolbar 
                                            activeTool={activeTool} 
                                            onToolChange={setActiveTool} 
                                            theme={theme}
                                        />
                                        <StrategyNavigation 
                                            handleZoomIn={handleZoomIn}
                                            handleZoomOut={handleZoomOut}
                                            handleZoomReset={handleZoomReset}
                                            view={view}
                                            isCompactMode={isCompactMode}
                                            onToggleCompactMode={() => setIsCompactMode(!isCompactMode)}

                                            theme={theme}
                                        />
                                        <StrategyCanvas
                                            nodes={activeCampaign.nodes}
                                            edges={activeCampaign.edges}
                                            activeCampaign={activeCampaign}
                                            strategyHealth={strategyHealth}
                                            activeTool={activeTool}
                                            viewMode={viewMode}
                                            view={view}
                                            onViewChange={setView}
                                            onNodeMove={handleNodeMove}
                                            onUpdateNode={handleUpdateNode}
                                            onUpdateEdge={handleUpdateEdge}
                                            onNodeSelect={(id, tab = 'general') => { 
                                                setSelectedNodeId(id); 
                                                setSelectedEdgeId(null); 
                                                setActivePropertyTab(tab); 
                                            }}
                                            onEdgeSelect={(id) => { 
                                                setSelectedEdgeId(id); 
                                                setSelectedNodeId(null); 
                                                setActivePropertyTab('general'); 
                                            }}
                                            onConnectionStart={setConnectionStart}
                                            onConnect={handleConnectNodes}
                                            onAddNode={handleAddNode}
                                            onDeleteNode={handleDeleteNode}
                                            onDeleteEdge={handleDeleteEdge}
                                            selectedNodeId={selectedNodeId}
                                            selectedEdgeId={selectedEdgeId}
                                            isCompactMode={isCompactMode}
                                            drawings={drawings}
                                            onDrawingsUpdate={setDrawings}
                                            onClearDrawings={handleClearDrawings}
                                            penSettings={penSettings}
                                            onPenSettingsUpdate={setPenSettings}
                                            contextMenu={contextMenu}
                                            onContextMenuUpdate={setContextMenu}
                                            isAuditorActive={isAuditorActive}
                                            funnelHealth={funnelHealth}
                                            onToolChange={setActiveTool}
                                            theme={theme}
                                        />
                                    </div>
                                    {(selectedNodeId || selectedEdgeId) && (
                                        <StrategyPropertyPanel
                                            selectedNode={selectedNode}
                                            selectedEdge={selectedEdge}
                                            activeTab={activePropertyTab}
                                            onTabChange={setActivePropertyTab}
                                            onClose={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
                                            onUpdateNode={handleUpdateNode}
                                            onDeleteNode={handleDeleteNode}
                                            onDeleteEdge={handleDeleteEdge}
                                            onDuplicateNode={handleDuplicateNode}
                                            onSendToPlanner={handleGeneratePlanner}
                                            onOpenMemoryPicker={handleOpenMemoryPicker}
                                            theme={theme}
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isFunnelOpen && (
                    <StrategicFunnel 
                        campaigns={strategyData.campaigns}
                        activeCampaignId={strategyData.activeCampaignId}
                        onSelectCampaign={(id) => setStrategyData(prev => ({ ...prev, activeCampaignId: id }))}
                        onClose={() => setIsFunnelOpen(false)} 
                    />
                )}
            </AnimatePresence>

            <footer className={`h-10 border-t flex items-center justify-between px-8 z-50 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0A0A0F] border-white/5' : 'bg-white border-slate-300/50'}`}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        <Binary className="w-3 h-3 text-indigo-500" />
                        <span>Estrategias activas: {strategyData.campaigns.length}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsAuditorActive(!isAuditorActive)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${isAuditorActive ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                    >
                        <Search className={`w-3 h-3 ${isAuditorActive ? 'animate-pulse' : ''}`} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Auditor Inteligente</span>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sistema Diiczone Operativo</span>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {isConfiguring && (
                    <StrategyCreationWizard 
                        onComplete={handleCompleteWizard}
                        onClose={() => setIsConfiguring(false)}
                    />
                )}
                {isMemoryPickerOpen && (
                    <MemoryAssetPicker 
                        onSelect={handleSelectAsset}
                        onClose={() => setIsMemoryPickerOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
