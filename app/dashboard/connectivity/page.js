'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    MessageSquare, Users, Zap, Calendar, TrendingUp, Filter,
    Search, MoreHorizontal, Phone, Video, Send, CheckCircle,
    XCircle, AlertCircle, Clock, Bot, BrainCircuit, GripVertical,
    LayoutDashboard, DollarSign, PieChart, BarChart2,
    ArrowRight, Sparkles, AlertTriangle, Target, ShoppingBag, Bell,
    Megaphone, FolderSync, BellRing, MousePointerClick, MessageCircle, Instagram, Facebook, Globe, Mail, Map, Youtube, FileText, Plus, Clapperboard,
    Building, Settings, ArrowLeft, Hand, MousePointer2, Maximize, MousePointer, MousePointer2Icon, HandIcon, UserCheck, Palette, Mic, Printer, Camera,
    Activity, X, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '@/lib/supabase';
import ChannelsView from '@/components/connectivity/ChannelsView';
import PipelineBoard from '@/components/crm/PipelineBoard';
import ChannelCard from '@/components/connectivity/ChannelCard';
import ConnectionWizard from '@/components/connectivity/ConnectionWizard';
import WhatsAppConfig from '@/components/connectivity/whatsapp/WhatsAppConfig';
import InternalFlowWidget from '@/components/connectivity/InternalFlowWidget';
import VideoProductionDashboard from '@/components/crm/video/VideoProductionDashboard';
import UnifiedInbox from '@/components/crm/UnifiedInbox';
import CRMAnalytics from '@/components/crm/CRMAnalytics';
import AIAgentFlow from '@/components/connectivity/AIAgentFlow';
import AutomationBoard from '@/components/shared/Automation/AutomationBoard';
import AddClientModal from '@/components/crm/AddClientModal';
import ProposalBuilder from '@/components/sales/ProposalBuilder';
import AutoModal from '@/components/connectivity/AutoModal';
import { toast } from 'sonner';

const WORKSTATIONS = [
    { id: 'editor', name: 'Editor', icon: Video, color: 'text-indigo-400' },
    { id: 'filmmaker', name: 'Filmmaker', icon: Clapperboard, color: 'text-rose-400' },
    { id: 'design', name: 'Diseño', icon: Palette, color: 'text-fuchsia-400' },
    { id: 'audio', name: 'Audio', icon: Mic, color: 'text-emerald-400' },
    { id: 'community', name: 'Community Manager', icon: MessageSquare, color: 'text-blue-400', specialized: true },
    { id: 'photo', name: 'Fotografía', icon: Camera, color: 'text-orange-400' },
    { id: 'models', name: 'Modelos', icon: UserCheck, color: 'text-purple-400' },
    { id: 'dev', name: 'Desarrollo Web', icon: Globe, color: 'text-cyan-400' },
    { id: 'print', name: 'Imprenta / Merch', icon: Printer, color: 'text-amber-400' },
    { id: 'events', name: 'Eventos / Prod', icon: Clapperboard, color: 'text-red-400' },
];

// Quick Access Items (1:1 Mapping)
const QUICK_ACCESS = [
    { id: 'channels', label: 'Conectar Canales', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'crm', label: 'CRM & Pipeline', icon: LayoutDashboard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'agent', label: 'Agente IA de Ventas', icon: Bot, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { id: 'automations', label: 'Automatizaciones', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'ads', label: 'Meta Ads', icon: Megaphone, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { id: 'notifications', label: 'Notificaciones', icon: BellRing, color: 'text-red-400', bg: 'bg-red-400/10' },
    { id: 'drive', label: 'Drive & Sync', icon: FolderSync, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { id: 'calendar', label: 'Calendario & Reuniones', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 'roi', label: 'Centro ROI', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'profile', label: 'Perfil de Empresa', icon: Building, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'settings', label: 'Configuraciones', icon: Settings, color: 'text-gray-400', bg: 'bg-gray-400/10' },
];

export default function ConnectivityDashboard() {
    const router = useRouter();
    const { user, loading: authLoading, getHomeRoute } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // Default to overview
    const [subModule, setSubModule] = useState(null); // 'channels', 'crm', etc.
    const [crmTab, setCrmTab] = useState('inbox'); // Local state for CRM inner tabs
    const [isAutomationEditing, setIsAutomationEditing] = useState(false);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [automationTrigger, setAutomationTrigger] = useState(null);
    const [automationAction, setAutomationAction] = useState(null);
    const [zoomScale, setZoomScale] = useState(1);
    const [connectingNode, setConnectingNode] = useState(null);
    const [agentNodes, setAgentNodes] = useState([
        { id: 'start', type: 'trigger', label: 'Webhook (Inbox)', iconName: 'Globe', x: -300, y: 50, color: 'text-emerald-500' },
        { id: 'process', type: 'action', label: 'AI Analysis', iconName: 'Cpu', x: 0, y: 50, color: 'text-indigo-500' },
        { id: 'end', type: 'output', label: 'WhatsApp Send', iconName: 'Share2', x: 300, y: 50, color: 'text-emerald-600' }
    ]);
    const [agentEdges, setAgentEdges] = useState([
        { id: 'e1', source: 'start', target: 'process', color: '#6366f1' },
        { id: 'e2', source: 'process', target: 'end', color: '#10b981' }
    ]);

    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [crmStages, setCrmStages] = useState([]);
    const [aiLogs, setAiLogs] = useState([]);
    const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.1, 0.5));

    const handleNodeClick = (node) => {
        if (activeTool === 'connect') {
            if (!connectingNode) {
                setConnectingNode(node);
            } else if (connectingNode.id !== node.id) {
                // Create link
                const newEdge = { 
                    id: `e-${Date.now()}`, 
                    source: connectingNode.id, 
                    target: node.id, 
                    color: '#6366f1' 
                };
                setAgentEdges(prev => [...prev, newEdge]);
                setConnectingNode(null);
            }
        }
    };
    const [leads, setLeads] = useState([]);
    const [services, setServices] = useState([
        { id: 1, name: 'Paquete Básico', price: '$500', includes: '4 Reels + 10 Stories' },
        { id: 2, name: 'Paquete Pro', price: '$900', includes: '8 Reels + 20 Stories + Community' },
        { id: 3, name: 'Plan Empresarial', price: '$1,500', includes: '12 Reels + Ads Management + Funnel' },
    ]);
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Bienvenida', text: 'Hola 👋 Soy el asistente de DIIC ZONE. ¿Buscas marketing o producción?' },
        { id: 2, name: 'Calificación', text: 'Perfecto. ¿Tu negocio es: Salud, Servicios o E-commerce?' },
        { id: 3, name: 'Propuesta Enviada', text: 'Hola {nombre} 👋 Te comparto la propuesta recomendada...' },
    ]);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showAutoModal, setShowAutoModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showClientModal, setShowClientModal] = useState(false); // New state for Cliente Connect
    const [activeTool, setActiveTool] = useState('selector'); // 'selector', 'hand', 'zoom'
    const [showTemplates, setShowTemplates] = useState(false);
    const [showWorkstations, setShowWorkstations] = useState(false);
    const [showActivity, setShowActivity] = useState(true); // Activity Feed Toggle
    const [showStats, setShowStats] = useState(true); // HUD Stats Toggle
    const [libraryAutomations, setLibraryAutomations] = useState([
        { id: 1, title: 'Lead Entrante -> CRM', desc: 'Guarda leads de FB/IG en el Pipeline.', icon: Filter, active: true, color: 'text-indigo-400' },
        { id: 2, title: 'Cita Agendada -> Calendar', desc: 'Bloquea horario y envía confirmación.', icon: Calendar, active: true, color: 'text-emerald-400' },
        { id: 3, title: 'Reunión Finalizada -> Resumen', desc: 'Genera minuta con IA y envía por WA.', icon: Bot, active: false, color: 'text-purple-400' },
        { id: 4, title: 'Pago Pendiente -> Aviso', desc: 'Recordatorio automático de facturas.', icon: DollarSign, active: true, color: 'text-amber-400' },
    ]);
    const [wizardChannel, setWizardChannel] = useState(null);
    const [configChannel, setConfigChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    const CRM_STAGES = [
        { id: 'new', title: 'Nuevo Lead', color: 'bg-blue-500', count: 0 },
        { id: 'qualifying', title: 'Calificando', color: 'bg-indigo-500', count: 0 },
        { id: 'meeting_pending', title: 'Reunión Pendiente', color: 'bg-purple-500', count: 0 },
        { id: 'meeting_done', title: 'Reunión Realizada', color: 'bg-pink-500', count: 0 },
        { id: 'proposal_sent', title: 'Propuesta Enviada', color: 'bg-yellow-500', count: 0 },
        { id: 'negotiation', title: 'Negociación', color: 'bg-orange-500', count: 0 },
        { id: 'won', title: 'Ganado', color: 'bg-emerald-500', count: 0 },
        { id: 'lost', title: 'Perdido', color: 'bg-gray-500', count: 0 },
        { id: 'dormant', title: 'Dormido', color: 'bg-slate-500', count: 0 },
    ];

    useEffect(() => {
        if (!authLoading && (!user || (user.role !== 'ADMIN' && user.role !== 'COMMUNITY'))) {
            router.push(getHomeRoute(user?.role));
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [chatsRes, stagesRes, logsRes] = await Promise.all([
                    supabase.from('chats').select('*'),
                    supabase.from('crm_stages').select('*'),
                    supabase.from('ai_logs').select('*')
                ]);

                if (chatsRes.data) setChats(chatsRes.data);
                if (chatsRes.error) console.warn('[Connectivity] Chats fetch error:', chatsRes.error.message);

                if (stagesRes.data) setCrmStages(stagesRes.data);
                if (stagesRes.error) console.warn('[Connectivity] CRM Stages fetch error:', stagesRes.error.message);

                if (logsRes.data) setAiLogs(logsRes.data);
                if (logsRes.error) console.warn('[Connectivity] AI Logs fetch error:', logsRes.error.message);

                // Mock Leads Data (Phase 1)
                setLeads([
                    { id: 1, name: 'Dr. Roberto M.', niche: 'Médico', stage: 'new', score: 45, budget: '$1,500', objective: 'Ventas', last: '2h' },
                    { id: 2, name: 'FitLife Gym', niche: 'Gimnasio', stage: 'qualifying', score: 65, budget: '$2,000', objective: 'Redes', last: '1d' },
                    { id: 3, name: 'Laura Estética', niche: 'Salud', stage: 'meeting_pending', score: 92, budget: '$3,500', objective: 'Ventas', last: '30m' },
                    { id: 4, name: 'InmoGroup', niche: 'Inmobiliaria', stage: 'negotiation', score: 88, budget: '$5,000', objective: 'Lead Gen', last: '5h' },
                    { id: 5, name: 'TechStore', niche: 'E-commerce', stage: 'won', score: 95, budget: '$2,800', objective: 'ROAS', last: '1w' },
                ]);
            } catch (err) {
                console.error('[Connectivity] Unexpected exception in fetchData:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, authLoading]);

    const handleCreateAutomationFlow = (triggerId, actionId) => {
        const triggerData = {
            msg: { label: 'Nuevo Mensaje', iconName: 'MessageSquare', color: 'text-indigo-500' },
            comment: { label: 'Comentario Post', iconName: 'Instagram', color: 'text-purple-500' },
            lead: { label: 'Lead Form', iconName: 'FileText', color: 'text-blue-500' },
            calendar: { label: 'Agendamiento', iconName: 'Calendar', color: 'text-amber-500' }
        }[triggerId];

        const actionData = {
            ai: { label: 'Responder con IA', iconName: 'Bot', color: 'text-indigo-400' },
            crm: { label: 'Asignar a Pipeline CRM', iconName: 'Users', color: 'text-emerald-400' }
        }[actionId];

        const triggerNodeId = `node_${Date.now()}_t`;
        const actionNodeId = `node_${Date.now()}_a`;
        
        const newTriggerNode = {
            id: triggerNodeId,
            type: 'trigger',
            label: triggerData.label,
            iconName: triggerData.iconName,
            color: triggerData.color,
            x: -200,
            y: 150
        };

        const newActionNode = {
            id: actionNodeId,
            type: 'action',
            label: actionData.label,
            iconName: actionData.iconName,
            color: actionData.color,
            x: 200,
            y: 150
        };

        const newEdge = {
            id: `edge_${Date.now()}`,
            source: triggerNodeId,
            target: actionNodeId,
            color: '#6366f1'
        };

        setAgentNodes(prev => [...prev, newTriggerNode, newActionNode]);
        setAgentEdges(prev => [...prev, newEdge]);
        
        setShowAutoModal(false);
        
        toast.success(`¡Flujo "${triggerData.label} ➜ ${actionData.label}" Creado!`, {
            description: "Los nodos se han inyectado en la pizarra del Command Center v4.0."
        });
    };

    return (
        <div className="flex-1 flex flex-col rounded-3xl border border-white/10 bg-[#050511] shadow-2xl ring-1 ring-white/5 relative overflow-hidden h-full">
            {/* Main Content */}
            <main className="h-full relative flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#050511]">

                {/* --- OVERVIEW DASHBOARD (Command Center / Immersive Flow) --- */}
                {activeTab === 'overview' && (
                    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                        {/* Premium Minimalist Header */}
                        <header className="h-24 shrink-0 sticky top-0 z-50 overflow-hidden flex items-center justify-between px-12 border-b border-white/5 bg-[#050511]/40 backdrop-blur-2xl transition-all">
                            {/* Premium Background Refined */}
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent z-0"></div>
                            
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                    <Zap className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-display font-bold text-white tracking-tight">DIIC Command</h1>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Studio Orchestrator</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-6">
                                {/* Integrated Search */}
                                <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 group focus-within:border-indigo-500/50 transition-all">
                                    <Search className="w-4 h-4 text-gray-500 group-focus-within:text-indigo-400" />
                                    <input type="text" placeholder="Buscar automatización..." className="bg-transparent border-none text-xs text-white placeholder-gray-600 focus:outline-none ml-2" />
                                </div>

                                <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => { setShowTemplates(!showTemplates); setShowWorkstations(false); }}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${showTemplates ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            Plantillas
                                        </button>
                                        <button 
                                            onClick={() => { setShowWorkstations(!showWorkstations); setShowTemplates(false); }}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${showWorkstations ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            Workstations
                                        </button>
                                        <div className="w-px h-6 bg-white/10"></div>
                                        <button 
                                            onClick={() => setShowClientModal(true)}
                                            className="px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-emerald-500/20"
                                        >
                                            Conectar Cliente
                                        </button>
                                        <button 
                                            onClick={() => setShowProposalModal(true)}
                                            className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-indigo-500/20"
                                        >
                                            Generar Propuesta
                                        </button>
                                    </div>
                                    <button onClick={() => setShowAutoModal(true)} className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/10 group">
                                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    </button>
                                    <button 
                                        onClick={() => setShowActivity(!showActivity)} 
                                        className={`p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 group relative backdrop-blur-md ${showActivity ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-gray-400 border-white/10'}`}
                                        title={showActivity ? "Ocultar Actividad" : "Mostrar Actividad"}
                                    >
                                        <Activity className={`w-5 h-5 ${showActivity ? 'animate-pulse' : ''}`} />
                                    </button>
                                    <button onClick={() => setShowNotifications(!showNotifications)} className={`p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 group relative backdrop-blur-md ${showNotifications ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                                        <BellRing className="w-5 h-5" />
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#050511] animate-pulse"></span>
                                    </button>
                                </div>
                        </header>

                        <div className={`flex-1 relative overflow-hidden bg-[#050511] ${activeTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : activeTool === 'zoom' ? 'cursor-zoom-in' : 'cursor-default'}`}>
                                    {/* 1. FULL-SCREEN BACKGROUND FLOW (The Whiteboard) */}
                                    <div className="absolute inset-0 z-0">
                                        <AIAgentFlow 
                                            activeTool={activeTool} 
                                            zoomScale={zoomScale}
                                            nodes={agentNodes}
                                            setNodes={setAgentNodes}
                                            edges={agentEdges}
                                            setEdges={setAgentEdges}
                                            onNodeClick={handleNodeClick}
                                            connectingNode={connectingNode}
                                        />
                                    </div>

                                    {/* TEMPLATES LIBRARY PANEL */}
                                    <AnimatePresence>
                                        {showTemplates && (
                                            <motion.div
                                                initial={{ x: 400, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 400, opacity: 0 }}
                                                className="absolute top-8 right-8 bottom-32 z-30 w-80 bg-[#0E0E18]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                                            >
                                                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Templates <span className="text-indigo-500">v4</span></h4>
                                                    <button onClick={() => setShowTemplates(false)} className="text-gray-500 hover:text-white transition-colors"><XCircle className="w-4 h-4" /></button>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                                    {[
                                                        { name: 'Lead Nurturer IA', icon: Users, desc: 'Webhook -> GPT-4o -> WhatsApp', color: 'text-emerald-400' },
                                                        { name: 'Deep SEO Agent', icon: Search, desc: 'Google -> AI Analysis -> Blog Edit', color: 'text-indigo-400' },
                                                        { name: 'Auto-Support Hub', icon: Bot, desc: 'Tickets -> Vector Store -> Mail', color: 'text-purple-400' },
                                                        { name: 'Viral Reel Engine', icon: Sparkles, desc: 'Trend -> Script IA -> Task Manager', color: 'text-amber-400' },
                                                        { name: 'ROI Multiplier', icon: Zap, desc: 'Ads Tracker -> Budget IA -> Slack', color: 'text-red-400' }
                                                    ].map((t, i) => (
                                                        <div 
                                                            key={i} 
                                                            draggable
                                                            onDragStart={(e) => {
                                                                e.dataTransfer.setData('application/reactflow', JSON.stringify({
                                                                    type: t.name.includes('Webhook') ? 'trigger' : 'action',
                                                                    label: t.name,
                                                                    color: t.color,
                                                                    iconName: t.icon.displayName || t.icon.name || 'Sparkles'
                                                                }));
                                                                e.dataTransfer.effectAllowed = 'move';
                                                            }}
                                                            className="p-4 bg-white/5 border border-white/5 rounded-3xl hover:border-indigo-500/40 hover:bg-white/10 transition-all group cursor-grab active:cursor-grabbing"
                                                        >
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className={`p-2 rounded-xl bg-white/5 ${t.color}`}><t.icon className="w-4 h-4" /></div>
                                                                <span className="text-xs font-black text-gray-200 group-hover:text-white">{t.name}</span>
                                                            </div>
                                                            <p className="text-[9px] text-gray-500 leading-relaxed">{t.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-4 bg-indigo-600/10 border-t border-white/5">
                                                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                                                        <Plus className="w-4 h-4" /> Custom Workflow
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* WORKSTATIONS (CREATIVOS) LIBRARY PANEL */}
                                    <AnimatePresence>
                                        {showWorkstations && (
                                            <motion.div
                                                initial={{ x: 400, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 400, opacity: 0 }}
                                                className="absolute top-8 right-8 bottom-32 z-30 w-[380px] bg-[#0E0E18]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                                            >
                                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-indigo-500/5">
                                                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Workstations <span className="text-gray-500">(Creativos)</span></h4>
                                                    <button onClick={() => setShowWorkstations(false)} className="text-gray-500 hover:text-white transition-colors"><XCircle className="w-4 h-4" /></button>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mb-2">Arrastra los roles a la pizarra</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {WORKSTATIONS.map((w, i) => (
                                                            <div 
                                                                key={i} 
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData('application/reactflow', JSON.stringify({
                                                                        type: 'action', // specialized operator nodes
                                                                        label: w.name,
                                                                        color: w.color,
                                                                        iconName: w.icon.displayName || w.icon.name || 'User'
                                                                    }));
                                                                    e.dataTransfer.effectAllowed = 'move';
                                                                }}
                                                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center flex flex-col items-center gap-2 group cursor-grab active:cursor-grabbing"
                                                            >
                                                                <w.icon className={`w-5 h-5 ${w.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">{w.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                {/* 2. HUD STATS OVERLAY (Top Left) */}
                                <div className="absolute top-8 left-8 z-30 flex flex-col gap-4 pointer-events-none">
                                    <AnimatePresence mode="wait">
                                        {!showStats ? (
                                            <motion.button
                                                key="stats-launcher"
                                                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.5, x: -20 }}
                                                onClick={() => setShowStats(true)}
                                                className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 border border-indigo-500/50 pointer-events-auto hover:bg-indigo-500 transition-all group"
                                                title="Mostrar Estadísticas Globales"
                                            >
                                                <PieChart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#050511] rounded-full"></div>
                                            </motion.button>
                                        ) : (
                                            <motion.div
                                                key="stats-panel"
                                                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                                className="w-full max-w-sm space-y-4"
                                            >
                                                <div 
                                                    className="bg-[#0E0E18]/60 border border-white/10 rounded-[32px] p-7 backdrop-blur-xl shadow-2xl pointer-events-auto relative group/hud"
                                                >
                                                    <button 
                                                        onClick={() => setShowStats(false)}
                                                        className="absolute -top-2 -right-2 w-7 h-7 bg-black border border-white/10 rounded-full text-gray-500 hover:text-white flex items-center justify-center opacity-0 group-hover/hud:opacity-100 transition-all shadow-xl active:scale-90"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>

                                                    <div className="flex justify-between items-center mb-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                                                <BarChart2 className="w-4 h-4 text-indigo-400" />
                                                            </div>
                                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Global Status</h3>
                                                        </div>
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div className="space-y-1.5">
                                                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Ventas</span>
                                                            <div className="text-3xl font-black text-white italic tracking-tighter">$12,450</div>
                                                            <div className="text-[10px] text-emerald-400 font-black flex items-center gap-1">
                                                                <TrendingUp className="w-3 h-3" /> +15.4%
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5 border-l border-white/5 pl-8">
                                                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Leads</span>
                                                            <div className="text-3xl font-black text-white italic tracking-tighter">342</div>
                                                            <div className="text-[10px] text-indigo-400 font-black">+8.2%</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="bg-indigo-600/5 border border-indigo-500/10 rounded-[24px] p-5 backdrop-blur-md pointer-events-auto flex items-center gap-4 group cursor-pointer hover:bg-indigo-600/10 transition-all border-dashed"
                                                >
                                                    <div className="shrink-0 w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xl group-hover:scale-110 transition-transform">
                                                        <Sparkles className="w-5 h-5 animate-pulse" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[9px] text-indigo-400/70 font-black uppercase tracking-[0.3em] mb-1">IA Recomendación</div>
                                                        <div className="text-[11px] text-gray-300 font-medium leading-relaxed italic line-clamp-1 group-hover:text-white transition-colors">"Activa el Agente IA para cerrar leads estancados."</div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 3. FLOATING TOOL DOCK (Bottom Center) - Modern Studio Toolbar */}
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-fit">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 bg-[#0E0E18]/80 border border-white/10 rounded-2xl p-2 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                                    >
                                        {/* Quick Tools Icons - Full Suite (Now cleaner without nav tools) */}
                                        <div className="flex items-center gap-1.5 px-2">
                                            {QUICK_ACCESS.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => { setActiveTab('module'); setSubModule(item.id); }}
                                                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 relative group border border-transparent hover:border-white/10`}
                                                    title={item.label}
                                                >
                                                    <div className={`p-2 rounded-lg ${item.bg} group-hover:scale-110 transition-transform`}>
                                                        <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                                                    </div>
                                                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 backdrop-blur-md">
                                                        {item.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* 4. MASTER STUDIO HUD - COMPACT VERSION (RIGHT SIDE) */}
                                <div className="absolute top-1/2 right-8 -translate-y-1/2 z-40 flex flex-col items-center gap-5">
                                    {/* Master Orchestration Tool (CONNECT) */}
                                    <div className="relative group">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTool(activeTool === 'connect' ? 'selector' : 'connect')}
                                            className={`w-16 h-16 rounded-[24px] flex flex-col items-center justify-center gap-1 shadow-2xl transition-all duration-500 border-2 overflow-hidden relative ${
                                                activeTool === 'connect' 
                                                ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
                                                : 'bg-[#0A0A0F]/90 border-white/5 text-gray-500 hover:border-white/20 hover:text-white backdrop-blur-3xl'
                                            }`}
                                        >
                                            <div className={`absolute inset-0 bg-emerald-400/20 transition-opacity duration-500 ${activeTool === 'connect' ? 'opacity-100' : 'opacity-0'}`} />
                                            <Plus className={`w-6 h-6 relative z-10 transition-transform duration-700 ${activeTool === 'connect' ? 'rotate-45' : ''}`} />
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none relative z-10">Logic</span>
                                        </motion.button>
                                        
                                        {/* Activity Glow */}
                                        {activeTool === 'connect' && (
                                            <div className="absolute inset-0 bg-emerald-500/10 blur-[20px] rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    {/* Navigation & Zoom Suite (Vertical Stack) */}
                                    <div className="bg-[#0A0A0F]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-2 flex flex-col items-center gap-3 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group/nav">
                                        {/* Cursor & Move Tools */}
                                        <div className="flex flex-col gap-1 p-1 bg-white/5 rounded-[24px]">
                                            <button 
                                                onClick={() => setActiveTool('selector')}
                                                className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all duration-500 ${activeTool === 'selector' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                                title="Selector"
                                            >
                                                <MousePointer2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setActiveTool('hand')}
                                                className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all duration-500 ${activeTool === 'hand' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                                title="Mano"
                                            >
                                                <Hand className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="w-8 h-px bg-white/10" />
                                        
                                        {/* Zoom Hub */}
                                        <div className="flex flex-col items-center gap-1">
                                            <button 
                                                onClick={handleZoomIn}
                                                className="w-11 h-11 rounded-[18px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all bg-white/5"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            
                                            <div className="flex flex-col items-center py-1 scale-90">
                                                <div className="text-[10px] font-black text-indigo-400 tracking-tighter">
                                                    {Math.round(zoomScale * 100)}%
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleZoomOut}
                                                className="w-11 h-11 rounded-[18px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all bg-white/5"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. ACTIVITY FEED (Bottom Right) */}
                                <AnimatePresence>
                                    {showActivity && (
                                        <div className="absolute bottom-10 right-10 z-10 w-72 pointer-events-none">
                                            <motion.div 
                                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                                className="bg-black/40 border border-white/5 rounded-3xl p-5 backdrop-blur-md pointer-events-auto shadow-2xl relative group/activity"
                                            >
                                                <button 
                                                    onClick={() => setShowActivity(false)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black border border-white/10 text-gray-500 hover:text-white flex items-center justify-center opacity-0 group-hover/activity:opacity-100 transition-all active:scale-90"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>

                                                <div className="flex items-center justify-between mb-4 px-1">
                                                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Activity className="w-3 h-3 text-indigo-500" />
                                                        Live Activity
                                                    </h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {[
                                                        { user: 'FitLife Gym', action: 'WhatsApp Msg received', time: '2m' },
                                                        { user: 'Dr. Roberto', action: 'Proposal viewed', time: '12m' },
                                                        { user: 'System', action: 'Lead scored → Hot (92%)', time: '20m' },
                                                    ].map((log, i) => (
                                                        <div key={i} className="flex items-start gap-4 p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                                            <div className="flex-1 text-[10px] text-gray-400">
                                                                <strong className="text-white block mb-0.5">{log.user}</strong> {log.action}
                                                            </div>
                                                            <span className="text-[9px] text-gray-600 font-bold">{log.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                {/* --- SUB-MODULE VIEWS --- */}
                {activeTab === 'module' && (
                    <div className="flex-1 flex flex-col">
                        {/* Sub-module Header Navigation */}
                        <div className="h-12 border-b border-white/5 flex items-center px-8 gap-4 bg-[#0E0E18]">
                            <button onClick={() => setActiveTab('overview')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                <ArrowRight className="w-3 h-3 rotate-180" /> Volver
                            </button>
                            <div className="h-4 w-px bg-white/10"></div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {QUICK_ACCESS.find(q => q.id === subModule)?.label}
                            </span>
                        </div>

                        {/* Module Content Container */}
                        <div className="flex-1 relative flex flex-col overflow-hidden">

                            {/* CRM & INBOX */}
                            {subModule === 'crm' && (
                                <div className="flex-1 flex flex-col h-full overflow-hidden">
                                    {/* CRM Header with KPIs */}
                                    <div className="h-auto border-b border-white/5 bg-[#121212] flex flex-col gap-4 p-4">
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                            <button onClick={() => setCrmTab('inbox')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${crmTab === 'inbox' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                                                <MessageSquare className="w-3.5 h-3.5 inline mr-2" /> Inbox Unificado
                                            </button>
                                            <button onClick={() => setCrmTab('pipeline')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${crmTab === 'pipeline' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                                                <LayoutDashboard className="w-3.5 h-3.5 inline mr-2" /> Pipeline Ventas
                                            </button>
                                            <button onClick={() => setCrmTab('production')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${crmTab === 'production' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                                                <Clapperboard className={`w-3.5 h-3.5 inline mr-2 ${crmTab === 'production' ? 'text-white' : 'text-gray-400'}`} /> Producción Video
                                            </button>
                                            <button onClick={() => setCrmTab('kpi')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${crmTab === 'kpi' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                                                <BarChart2 className="w-3.5 h-3.5 inline mr-2" /> KPIs & Métricas
                                            </button>
                                        </div>
                                        {/* Quick Stats Row */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {[
                                                { label: 'Leads del mes', value: '142', color: 'text-white' },
                                                { label: 'Citas agendadas', value: '28', color: 'text-indigo-400' },
                                                { label: 'Ventas cerradas', value: '12', color: 'text-emerald-400' },
                                                { label: 'Facturación', value: '$8,450', color: 'text-white' },
                                                { label: 'ROI estimado', value: '320%', color: 'text-green-400' },
                                                { label: 'Conversión', value: '8.4%', color: 'text-blue-400' },
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/5 rounded-lg p-2 px-3 border border-white/5">
                                                    <p className="text-[9px] uppercase tracking-widest text-gray-500">{stat.label}</p>
                                                    <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CRM Content */}
                                    <div className="flex-1 relative flex">

                                        {/* INBOX VIEW */}
                                        {crmTab === 'inbox' && (
                                            <div className="flex-1 flex h-full min-h-[600px] w-full relative">
                                                <UnifiedInbox />
                                            </div>
                                        )}

                                        {/* PIPELINE VIEW */}
                                        {crmTab === 'pipeline' && (
                                            <div className="flex-1 relative flex h-full w-full overflow-hidden min-h-[600px]">
                                                <PipelineBoard />
                                            </div>
                                        )}

                                        {/* PRODUCTION VIDEO VIEW */}
                                        {crmTab === 'production' && (
                                            <div className="flex-1 relative flex h-full w-full overflow-hidden min-h-[600px]">
                                                <VideoProductionDashboard />
                                            </div>
                                        )}

                                        {/* KPI View Analytics Dashboard inside CRM */}
                                        {crmTab === 'kpi' && (
                                            <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden">
                                                <CRMAnalytics />
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                )}

                            {/* CHANNELS VIEW */}
                            {subModule === 'channels' && <ChannelsView />}

                            {/* AGENT VIEW */}
                            {
                                subModule === 'agent' && (
                                    <div className="flex-1 p-8 overflow-y-auto">
                                        <div className="max-w-4xl mx-auto space-y-8">
                                            {/* Agent Toggle & Status */}
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
                                                <div>
                                                    <h2 className="text-xl font-bold text-white">Agente IA de Ventas</h2>
                                                    <p className="text-sm text-gray-400">El agente responderá y calificará leads automáticamente.</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-emerald-400 font-bold flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Activo</span>
                                                    <div className="w-12 h-6 bg-emerald-500/20 rounded-full border border-emerald-500/30 relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-emerald-500 rounded-full shadow-lg"></div></div>
                                                </div>
                                            </div>

                                            {/* Niche Selection */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                                    <h3 className="text-lg font-bold text-white mb-4">Configuración de Nicho</h3>
                                                    <div className="space-y-3">
                                                        {['Inmobiliaria', 'Gimnasio', 'Restaurante', 'Clínica', 'E-commerce'].map(niche => (
                                                            <label key={niche} className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5 cursor-pointer hover:bg-white/5">
                                                                <input type="radio" name="niche" className="accent-indigo-500" />
                                                                <span className="text-gray-300 text-sm">{niche}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                                    <h3 className="text-lg font-bold text-white mb-4">Acciones Permitidas</h3>
                                                    <div className="space-y-3">
                                                        {['Responder chats iniciales', 'Calificar Leads (Hot/Cold)', 'Agendar Citas en Calendario', 'Dar seguimiento post-venta'].map(action => (
                                                            <label key={action} className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5 cursor-pointer hover:bg-white/5">
                                                                <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 rounded" />
                                                                <span className="text-gray-300 text-sm">{action}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Business Memory Section */}
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 md:col-span-2">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-bold text-white">Memoria de Negocio (Servicios & Precios)</h3>
                                                    <button className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">Editar Catálogo</button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {services.map(svc => (
                                                        <div key={svc.id} className="p-4 bg-[#151520] rounded-xl border border-white/5">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-bold text-white text-sm">{svc.name}</h4>
                                                                <span className="text-emerald-400 font-mono text-xs font-bold">{svc.price}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">{svc.includes}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quick Texts Section */}
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 md:col-span-2">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-bold text-white">Textos Rápidos (Plantillas)</h3>
                                                    <button className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">Configurar Bot</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {templates.map(tmpl => (
                                                        <div key={tmpl.id} className="p-3 bg-[#151520] rounded-xl border border-white/5 flex flex-col gap-1">
                                                            <div className="flex justify-between">
                                                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{tmpl.name}</span>
                                                                <button className="text-[10px] text-gray-500 hover:text-white">Editar</button>
                                                            </div>
                                                            <p className="text-sm text-gray-300 italic">"{tmpl.text}"</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                            {/* AUTOMATIONS (n8n/Make) */}
                            {
                                subModule === 'automations' && (
                                    isAutomationEditing ? (
                                        <div className="flex-1 h-full w-full relative">
                                            <AutomationBoard onBack={() => setIsAutomationEditing(false)} />
                                        </div>
                                    ) : (
                                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar tracking-tight">
                                            <div className="max-w-6xl mx-auto pb-20">
                                                <div className="flex justify-between items-center mb-10">
                                                    <div>
                                                        <h2 className="text-3xl font-black text-white tracking-tight">Biblioteca de <span className="text-indigo-500">Automatizaciones</span></h2>
                                                        <p className="text-gray-500 text-sm mt-1">Despliega flujos pre-configurados de alta conversión en segundos.</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setIsAutomationEditing(true)}
                                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        <Plus className="w-5 h-5" /> Crear Flujo Personalizado
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    {libraryAutomations.map((auto) => (
                                                        <div key={auto.id} className="bg-[#0E0E18] border border-white/5 rounded-[32px] p-8 relative group hover:border-indigo-500/30 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                                            <div className="absolute top-8 right-8">
                                                                <button 
                                                                    onClick={() => setLibraryAutomations(prev => prev.map(a => a.id === auto.id ? { ...a, active: !a.active } : a))}
                                                                    className={`w-12 h-7 rounded-full relative transition-all duration-300 ${auto.active ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/5 border border-white/10'}`}
                                                                >
                                                                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-300 ${auto.active ? 'right-1' : 'left-1'}`}></div>
                                                                </button>
                                                            </div>
                                                            <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform ${auto.color}`}>
                                                                <auto.icon className="w-7 h-7" />
                                                            </div>
                                                            <h3 className="text-xl font-black text-white mb-3 tracking-tight">{auto.title}</h3>
                                                            <p className="text-sm text-gray-500 leading-relaxed mb-8">{auto.desc}</p>
                                                            <button 
                                                                onClick={() => { setSelectedFlow(auto); setIsAutomationEditing(true); }}
                                                                className="w-full py-3.5 bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center justify-center gap-2 group-hover:border-indigo-500/50"
                                                            >
                                                                <Zap className="w-4 h-4" /> Ver Flujo Logic <span className="opacity-50 font-medium">(n8n Mode)</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            }

                            {/* META ADS */}
                            {
                                subModule === 'ads' && (
                                    <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center">
                                        <div className="max-w-lg w-full bg-[#0E0E18] border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
                                            <Megaphone className="w-16 h-16 text-pink-500 mx-auto mb-6 opacity-80" />
                                            <h2 className="text-2xl font-bold text-white mb-2">Lanzador de Pauta Fácil</h2>
                                            <p className="text-gray-400 text-sm mb-8">Crea campañas profesionales en 3 pasos simples asistido por IA.</p>

                                            <div className="space-y-4 text-left mb-8">
                                                <div className="flex items-center gap-4 p-4 bg-[#151520] rounded-xl border border-white/5 opacity-50">
                                                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-sm border border-pink-500/20">1</div>
                                                    <div><h4 className="text-white font-bold text-sm">Objetivo</h4><p className="text-xs text-gray-500">¿Qué quieres lograr?</p></div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 bg-[#151520] rounded-xl border border-white/5 opacity-50">
                                                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-sm border border-pink-500/20">2</div>
                                                    <div><h4 className="text-white font-bold text-sm">Creativo</h4><p className="text-xs text-gray-500">Selecciona contenido aprobado.</p></div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 bg-[#151520] rounded-xl border border-white/5 opacity-50">
                                                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-sm border border-pink-500/20">3</div>
                                                    <div><h4 className="text-white font-bold text-sm">Lanzamiento</h4><p className="text-xs text-gray-500">Presupuesto y segmentación IA.</p></div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    // Simulation of launch
                                                    const btn = document.activeElement;
                                                    btn.innerText = "Lanzando Campaña...";
                                                    setTimeout(() => { btn.innerText = "Campaña Activa ✓"; btn.classList.add('bg-emerald-600'); }, 1500);
                                                }}
                                                className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-pink-500/20 transition-all transform hover:scale-[1.02] active:scale-95"
                                            >
                                                Iniciar Campaña Estratégica
                                            </button>
                                        </div>
                                    </div>
                                )
                            }

                            {/* NOTIFICATIONS */}
                            {
                                subModule === 'notifications' && (
                                    <div className="flex-1 p-8 overflow-y-auto">
                                        <div className="max-w-4xl mx-auto bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                            <h2 className="text-xl font-bold text-white mb-6">Configurar Notificaciones</h2>
                                            <div className="space-y-4">
                                                {[
                                                    { event: 'Nuevo Lead Calificado', channels: ['WhatsApp', 'Push'] },
                                                    { event: 'Aprobación Requerida (Diseño/Video)', channels: ['Email', 'Push'] },
                                                    { event: 'Reporte Semanal Listo', channels: ['WhatsApp', 'Email'] },
                                                    { event: 'Pago Pendiente / Factura', channels: ['WhatsApp'] },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-[#151520] rounded-xl border border-white/5">
                                                        <div>
                                                            <h4 className="text-white font-bold text-sm">{item.event}</h4>
                                                            <p className="text-xs text-gray-500">Se enviará a: {item.channels.join(', ')}</p>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <button onClick={() => alert('Configuración de Notificación abierta.')} className="px-4 py-2 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all">Configurar</button>
                                                            <button className="w-12 h-7 bg-emerald-500/20 border border-emerald-500/30 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                                <div className="absolute right-1 top-1 w-5 h-5 bg-emerald-500 rounded-full shadow-lg"></div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* ROI CENTER */}
                            {
                                subModule === 'roi' && (
                                    <div className="flex-1 p-8 overflow-y-auto">
                                        <div className="max-w-6xl mx-auto space-y-8">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">Centro de Rentabilidad (ROI)</h2>
                                                    <p className="text-gray-400">Analítica financiera de tus campañas y ventas.</p>
                                                </div>
                                                <div className="flex bg-[#0E0E18] p-1 rounded-xl border border-white/5">
                                                    <button className="px-4 py-2 bg-[#151520] text-white text-xs font-bold rounded-lg shadow-sm">Este Mes</button>
                                                    <button className="px-4 py-2 text-gray-500 hover:text-white text-xs font-bold rounded-lg transition-colors">Últimos 3 meses</button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {[
                                                    { label: 'Ventas Generadas', value: '$12,450', change: '+15%', color: 'text-emerald-400', icon: DollarSign },
                                                    { label: 'Leads Entrantes', value: '342', change: '+8%', color: 'text-blue-400', icon: Users },
                                                    { label: 'Costo por Lead (CPL)', value: '$4.20', change: '-5%', color: 'text-yellow-400', icon: Target },
                                                    { label: 'Tasa de Conversión', value: '3.8%', change: '+1.2%', color: 'text-purple-400', icon: TrendingUp },
                                                    { label: 'Facturación Mensual', value: '$8,200', change: '+10%', color: 'text-white', icon: BarChart2 },
                                                    { label: 'Retorno Inversión (ROAS)', value: '4.5x', change: '+0.5', color: 'text-indigo-400', icon: Zap },
                                                ].map((kpi, i) => (
                                                    <div key={i} className="p-6 bg-[#0E0E18] border border-white/5 rounded-2xl relative group hover:border-white/10 transition-colors">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className={`p-3 rounded-xl bg-white/5 ${kpi.color}`}>
                                                                <kpi.icon className="w-6 h-6" />
                                                            </div>
                                                            <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${kpi.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.change}</span>
                                                        </div>
                                                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{kpi.label}</h3>
                                                        <p className={`text-3xl font-display font-bold ${kpi.color}`}>{kpi.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Chart Placeholder */}
                                            <div className="p-8 bg-[#0E0E18] border border-white/5 rounded-3xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
                                                <div className="text-center z-10">
                                                    <BarChart2 className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
                                                    <h3 className="text-white font-bold text-lg">Proyección de Crecimiento</h3>
                                                    <p className="text-gray-500 text-sm">Visualización gráfica disponible en breve.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* OTHER MODULES PLACEHOLDER (Drive, Calendar) */}
                            {
                                ['drive', 'calendar'].includes(subModule) && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                                        {subModule === 'drive' && <div className="text-center"><FolderSync className="w-20 h-20 text-orange-400 opacity-20 mx-auto mb-4" /><h2 className="text-2xl font-bold text-white">Drive & Sync</h2><p>Conecta Google Drive y sincroniza la estructura de carpetas.</p></div>}
                                        {subModule === 'calendar' && <div className="text-center"><Calendar className="w-20 h-20 text-purple-400 opacity-20 mx-auto mb-4" /><h2 className="text-2xl font-bold text-white">Calendario & Reuniones</h2><p>Gestiona grabaciones, entregas y resúmenes automáticos.</p></div>}
                                    </div>
                                )
                            }

                            {/* BUSINESS PROFILE */}
                            {
                                subModule === 'profile' && (
                                    <div className="flex-1 p-8 overflow-y-auto">
                                        <div className="max-w-4xl mx-auto space-y-8">
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                                                <div className="flex items-center gap-6 mb-8">
                                                    <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform duration-500">
                                                        <Building className="w-10 h-10 text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-white mb-1">Perfil de Empresa</h2>
                                                        <p className="text-gray-400 text-sm">Configura la identidad y servicios de tu negocio.</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Nombre Comercial</label>
                                                            <input type="text" defaultValue="DIIC ZONE Studio" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-amber-500 focus:outline-none transition-all" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Nicho / Industria</label>
                                                            <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-amber-500 focus:outline-none transition-all appearance-none cursor-pointer">
                                                                <option>Agencia de Marketing</option>
                                                                <option>Producción Audiovisual</option>
                                                                <option>Consultoría E-commerce</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 px-1">Ubicación HQ</label>
                                                            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-amber-500/30 transition-all">
                                                                <Map className="w-5 h-5 text-amber-500" />
                                                                <span className="text-xs text-gray-300">Medellín, Colombia</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6">
                                                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4">Información de Facturación</h4>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between text-xs py-2 border-b border-white/5">
                                                                <span className="text-gray-500">Plan Actual</span>
                                                                <span className="text-white font-bold">Enterprise Gold</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs py-2 border-b border-white/5">
                                                                <span className="text-gray-500">Próximo Pago</span>
                                                                <span className="text-white font-bold">Abril 15, 2026</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs py-2">
                                                                <span className="text-gray-500">Tarjeta Vinculada</span>
                                                                <span className="text-white font-bold">**** 8842</span>
                                                            </div>
                                                        </div>
                                                        <button className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-amber-500/20 transition-all">Gestionar Suscripción</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* SETTINGS MODULE */}
                            {
                                subModule === 'settings' && (
                                    <div className="flex-1 p-8 overflow-y-auto">
                                        <div className="max-w-4xl mx-auto">
                                            <div className="flex justify-between items-center mb-8">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">Configuraciones</h2>
                                                    <p className="text-gray-400">Personaliza el comportamiento del Command Center.</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="md:col-span-1 space-y-2">
                                                    {['General', 'Seguridad', 'API Keys', 'Miembros de Equipo', 'Privacidad'].map((tab, i) => (
                                                        <button key={tab} className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all border ${i === 0 ? 'bg-white/10 text-white border-white/10' : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'}`}>
                                                            {tab}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="md:col-span-2 space-y-6">
                                                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                                                        <h3 className="text-sm font-bold text-white mb-6">Preferencias Generales</h3>
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-200 mb-1">Modo Ultra-High Fidelity</p>
                                                                    <p className="text-[10px] text-gray-500">Activa animaciones 3D avanzadas y glow extrasensorial.</p>
                                                                </div>
                                                                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg"></div></div>
                                                            </div>
                                                            <div className="h-px bg-white/5 w-full"></div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-200 mb-1">Notificaciones por Voz IA</p>
                                                                    <p className="text-[10px] text-gray-500">El sistema te hablará ante eventos críticos.</p>
                                                                </div>
                                                                <div className="w-12 h-6 bg-white/5 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-gray-600 rounded-full shadow-lg"></div></div>
                                                            </div>
                                                            <div className="h-px bg-white/5 w-full"></div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs font-bold text-gray-200 mb-1">Auto-Guardado Inteligente</p>
                                                                    <p className="text-[10px] text-gray-500">Sincroniza cada cambio instantáneamente en la nube.</p>
                                                                </div>
                                                                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg"></div></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end gap-3">
                                                        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">Descartar</button>
                                                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 transition-all">Guardar Cambios</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Fallback for construction */}
                            {
                                !['crm', 'channels', 'agent', 'automations', 'ads', 'notifications', 'drive', 'calendar', 'roi', 'profile', 'settings'].includes(subModule) && (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">
                                        <p>Módulo {QUICK_ACCESS.find(q => q.id === subModule)?.label || subModule} en construcción</p>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                )}
            </main>

            {/* PROPOSAL MODAL */}
            <AnimatePresence>
                {showProposalModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-[#0E0E18] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151520]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /> Generador de Propuestas</h3>
                                <button onClick={() => setShowProposalModal(false)}><XCircle className="w-5 h-5 text-gray-500 hover:text-white" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Cliente</label>
                                    <select className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500">
                                        <option>Seleccionar Lead...</option>
                                        {leads.map(l => <option key={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tipo</label>
                                        <select className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500">
                                            <option>Express (WhatsApp)</option>
                                            <option>Formal (PDF)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Paquete</label>
                                        <select className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500">
                                            {services.map(s => <option key={s.id}>{s.name} - {s.price}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Vista Previa (Mensaje)</label>
                                    <textarea className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white text-sm h-32 focus:outline-none focus:border-indigo-500" defaultValue="Hola! Te adjunto la propuesta para el Plan Básico...\nPrecio: $500\nIncluye: 4 Reels..."></textarea>
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#151520]">
                                <button onClick={() => setShowProposalModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancelar</button>
                                <button onClick={() => setShowProposalModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all">Enviar Propuesta</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* AUTOMATION WIZARD MODAL */}
            < AnimatePresence >
                {showAutoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-[#0E0E18] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                        >
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151520] relative z-10">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400" /> Nueva Automatización</h3>
                                <button onClick={() => setShowAutoModal(false)}><XCircle className="w-5 h-5 text-gray-500 hover:text-white" /></button>
                            </div>
                            <div className="p-8 space-y-6 relative z-10">
                                {/* Step 1: Trigger */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 px-1">1. Disparador (Trigger)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'msg', label: 'Nuevo Mensaje', icon: MessageCircle },
                                            { id: 'comment', label: 'Comentario Post', icon: Instagram },
                                            { id: 'lead', label: 'Lead Form', icon: FileText },
                                            { id: 'calendar', label: 'Agendamiento', icon: Calendar }
                                        ].map(target => (
                                            <button 
                                                key={target.id} 
                                                onClick={() => setAutomationTrigger(target.id)}
                                                className={`p-4 rounded-2xl text-left transition-all text-xs font-bold flex flex-col gap-2 group relative border ${automationTrigger === target.id ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-[#151520] border-white/5 text-gray-400 hover:border-indigo-500/40 hover:bg-indigo-500/5'}`}
                                            >
                                                <target.icon className={`w-4 h-4 ${automationTrigger === target.id ? 'text-white' : 'text-indigo-400 opacity-60 group-hover:opacity-100'}`} />
                                                {target.label}
                                                {automationTrigger === target.id && (
                                                    <motion.div layoutId="trigger-glow" className="absolute inset-0 rounded-2xl border-2 border-indigo-400/50 pointer-events-none" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Step 2: Action */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 px-1">2. Acción</label>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'ai', label: 'Responder con IA', icon: Bot, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                                            { id: 'crm', label: 'Asignar a Pipeline CRM', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
                                        ].map(action => (
                                            <button 
                                                key={action.id}
                                                onClick={() => setAutomationAction(action.id)}
                                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${automationAction === action.id ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-[#151520] border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-xl ${automationAction === action.id ? 'bg-white/20' : action.bg} transition-colors group-hover:scale-110`}>
                                                        <action.icon className={`w-5 h-5 ${automationAction === action.id ? 'text-white' : action.color}`} />
                                                    </div>
                                                    <span className={`text-sm font-bold ${automationAction === action.id ? 'text-white' : 'text-gray-200'}`}>{action.label}</span>
                                                </div>
                                                {automationAction === action.id && <CheckCircle className="w-5 h-5 text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                                    <button 
                                        onClick={() => { setShowAutoModal(false); setAutomationTrigger(null); setAutomationAction(null); }} 
                                        className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (!automationTrigger || !automationAction) {
                                                toast.error('Selecciona un disparador y una acción para continuar.');
                                                return;
                                            }
                                            handleCreateAutomationFlow();
                                        }} 
                                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${automationTrigger && automationAction ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30 grow' : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'}`}
                                    >
                                        Crear Flujo
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* CONNECTION WIZARD */}
            <AnimatePresence>
                {wizardChannel && (
                    <ConnectionWizard
                        channel={wizardChannel}
                        onClose={() => setWizardChannel(null)}
                    />
                )}
            </AnimatePresence>

            {/* WHATSAPP CONFIG */}
            <AnimatePresence>
                {configChannel === 'whatsapp' && (
                    <WhatsAppConfig
                        onClose={() => setConfigChannel(null)}
                    />
                )}
            </AnimatePresence>

            {/* CLIENT CONNECT MODAL (Premium Window) */}
            <AnimatePresence>
                {showClientModal && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="absolute bottom-28 left-10 w-[380px] z-50 pointer-events-auto"
                    >
                        <div className="bg-[#0A0A12]/90 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl p-1">
                            <div className="bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 rounded-[30px] p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg leading-tight">Cliente Connect</h3>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Ready to Link</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowClientModal(false)}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all cursor-pointer">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter">Último Mensaje</span>
                                            <span className="text-[9px] text-gray-600 font-bold">2m ago</span>
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-2 italic">"Hola! ¿Cómo va el progreso de mi campaña de video?"</p>
                                    </div>

                                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">Notificaciones</span>
                                            <div className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-full shadow-lg shadow-emerald-500/20">ACTIVO</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                <span>Aprobación de reels pendiente.</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                <span>Cita agendada para mañana 10:00 AM.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
                                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Ver Chats
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-indigo-500/20">
                                        <Zap className="w-3.5 h-3.5" /> Vincular IA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* NOTIFICATIONS PANEL (Simple Dropdown Mock) */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-28 right-12 w-80 bg-[#0E0E18]/80 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-5 border-b border-white/5 bg-white/5">
                            <h4 className="font-bold text-white text-sm">Notificaciones Globales</h4>
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {[
                                { text: 'Nuevo lead calificado: Clínica Dental', time: 'Hace 5 min', type: 'lead' },
                                { text: 'Error de conexión: Facebook API', time: 'Hace 20 min', type: 'error' },
                                { text: 'Automatización "Citas" activa', time: 'Hace 1h', type: 'success' },
                            ].map((notif, i) => (
                                <div key={i} className="p-4 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/5 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-[11px] font-bold ${notif.type === 'error' ? 'text-red-400' : 'text-gray-200'} group-hover:text-white transition-colors`}>{notif.text}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-bold">{notif.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODAL SYSTEM --- */}
            
            {/* 1. Add Client Modal */}
            <AddClientModal 
                isOpen={showClientModal} 
                onClose={() => setShowClientModal(false)} 
            />

            {/* 2. Proposal Builder Modal */}
            <AnimatePresence>
                {showProposalModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProposalModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative bg-[#050511] border border-white/10 rounded-[40px] w-full max-w-6xl h-[85vh] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
                        >
                            <button 
                                onClick={() => setShowProposalModal(false)}
                                className="absolute top-6 right-8 text-gray-500 hover:text-white transition-colors z-[110]"
                            >
                                <XCircle className="w-8 h-8" />
                            </button>
                            <div className="flex-1 overflow-hidden">
                                <ProposalBuilder />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 3. Automation Builder Modal */}
            <AutoModal 
                isOpen={showAutoModal} 
                onClose={() => setShowAutoModal(false)} 
                onCreate={handleCreateAutomationFlow}
            />
        </div>
    );
}
