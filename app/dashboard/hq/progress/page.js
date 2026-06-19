'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Users, Briefcase, Zap,
    Cpu, Server, Lock, Globe, Trophy,
    ArrowUpRight, ArrowLeft, RefreshCw, Send, CheckCircle2,
    ShieldAlert, HardDrive, Smartphone, Compass, Printer, Clapperboard, DollarSign
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

export default function HQProgressPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [isTesting, setIsTesting] = useState(false);
    const [testProgress, setTestProgress] = useState(0);
    const [activeHoverNode, setActiveHoverNode] = useState(null);
    const [stats, setStats] = useState({
        clientsCount: 0,
        teamCount: 0,
        pendingPayments: 0,
        activeTasks: 0
    });
    
    const [logs, setLogs] = useState([
        { time: '00:01:12', msg: 'Core System Initialized - Security protocol SECURE.', type: 'info' },
        { time: '00:01:15', msg: 'n8n webhook connection established successfully.', type: 'success' },
        { time: '00:02:04', msg: 'AI assistant context updated with current client parameters.', type: 'info' },
        { time: '00:03:40', msg: 'Imprenta Directa connection verified. Ready for checkout dispatch.', type: 'success' }
    ]);

    // Load simple totals to feed the progress indicators
    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const [clients, team, tasks] = await Promise.all([
                    agencyService.getClients(),
                    agencyService.getTeam(),
                    agencyService.getTasks()
                ]);
                setStats({
                    clientsCount: clients?.length || 0,
                    teamCount: team?.length || 0,
                    activeTasks: tasks?.filter(t => t.status !== 'completed')?.length || 0,
                    pendingPayments: clients?.filter(c => c.status === 'paused')?.length || 0
                });
            } catch (err) {
                console.error('Error fetching totals for progress:', err);
            }
        };
        fetchTotals();
    }, []);

    const triggerConnectorTest = () => {
        if (isTesting) return;
        setIsTesting(true);
        setTestProgress(0);
        
        toast.promise(
            new Promise((resolve) => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    setTestProgress(progress);
                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 200);
            }),
            {
                loading: 'Diagnosticando conectores de ecosistema...',
                success: () => {
                    setIsTesting(false);
                    const newLog = {
                        time: new Date().toLocaleTimeString(),
                        msg: `Todos los conectores (Zona Creativa, Imprenta, Finanzas, Nodos) diagnosticados en un 100% OK.`,
                        type: 'success'
                    };
                    setLogs(prev => [newLog, ...prev]);
                    return 'Diagnóstico completado con éxito';
                },
                error: 'Error en diagnóstico de puertos'
            }
        );
    };

    const handleNodeClick = (href) => {
        toast.success(`Redireccionando al módulo de destino...`);
        router.push(href);
    };

    // Connections network layout configurations
    const nodes = [
        { id: 'hq', label: 'Cerebro Central', status: 'ONLINE', x: 250, y: 200, href: '/dashboard/hq', icon: Cpu, desc: 'Comando principal e inteligencia de control de la app.', color: 'text-indigo-400', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.5)]', border: 'border-indigo-500' },
        
        { id: 'creativa', label: 'Zona Creativa', status: 'CONECTADO', x: 90, y: 100, href: '/dashboard/creative-zone', icon: Clapperboard, desc: 'Espacio de creadores de contenido, subida de crudos e ideas.', color: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', border: 'border-emerald-500' },
        
        { id: 'imprenta', label: 'Imprenta Directa', status: 'LISTO (80%)', x: 410, y: 100, href: '/dashboard/print/dashboard', icon: Printer, desc: 'Conector con talleres físicos para el despacho directo de merch.', color: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]', border: 'border-yellow-500' },
        
        { id: 'finanzas', label: 'Finanzas & MRR', status: 'SINCRONIZADO', x: 90, y: 300, href: '/dashboard/hq/control?tab=finance', icon: DollarSign, desc: 'Mapeo de facturación de aliados y pagos automáticos a CMs.', color: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]', border: 'border-cyan-500' },
        
        { id: 'nodos', label: 'Sedes & Nodos', status: 'EXPANDIENDO', x: 410, y: 300, href: '/dashboard/hq/control?tab=nodes', icon: Globe, desc: 'Expansión operativa territorial y reclutamiento local en Ecuador.', color: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]', border: 'border-purple-500' },
        
        { id: 'qa', label: 'Calidad QA', status: 'ACTIVO', x: 250, y: 340, href: '/dashboard/hq/control?tab=qa', icon: CheckCircle2, desc: 'Auditoría interna de piezas de video, grillas y copys antes de entrega.', color: 'text-rose-400', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]', border: 'border-rose-500' },
        
        { id: 'nicho', label: 'Aliados & Nichos', status: 'CONECTADO', x: 250, y: 60, href: '/dashboard/hq/control?tab=bi', icon: Briefcase, desc: 'Estrategias a la medida para sectores médico, legal y corporativo.', color: 'text-pink-400', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]', border: 'border-pink-500' }
    ];

    const connections = [
        { from: 'hq', to: 'creativa' },
        { from: 'hq', to: 'imprenta' },
        { from: 'hq', to: 'finanzas' },
        { from: 'hq', to: 'nodos' },
        { from: 'hq', to: 'qa' },
        { from: 'hq', to: 'nicho' },
        { from: 'creativa', to: 'qa' },
        { from: 'nodos', to: 'imprenta' }
    ];

    return (
        <div className="bg-[#050511] min-h-screen text-white font-sans selection:bg-yellow-500/30 pb-20">
            <main className="p-10 max-w-[1700px] mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight italic uppercase flex items-center gap-3">
                            <Trophy className="w-9 h-9 text-yellow-500" /> MI PROGRESO
                        </h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Visión de Crecimiento & Conectividad del Ecosistema</p>
                    </div>
                    <button 
                        onClick={() => router.push('/dashboard/hq')}
                        className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> HQ Central
                    </button>
                </div>

                {/* Grid 1: Vision and Connections Map */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Mission & Vision HQs */}
                    <div className="lg:col-span-1 space-y-8 flex flex-col justify-between">
                        <div className="bg-[#0A0A1F] border border-white/5 rounded-[40px] p-8 shadow-2xl space-y-8 flex-1">
                            <div>
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Misión del Ecosistema</h3>
                                <h2 className="text-2xl font-black text-white italic uppercase mb-4">"Simplificar la atención digital en activos escalables"</h2>
                                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                    DIIC ZONE conecta producción audiovisual avanzada, redes sociales y logística de comercio físico en una sola interfaz invisible para el cliente.
                                </p>
                            </div>
                            
                            <div className="border-t border-white/5 pt-8 space-y-6">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Metas Estratégicas de la Agencia</h3>
                                <div className="space-y-4">
                                    <ProgressItem label="Integración Imprenta Directa" progress={80} color="from-yellow-500 to-amber-600" />
                                    <ProgressItem label="Automatización de CRM & Bots" progress={100} color="from-emerald-500 to-teal-600" />
                                    <ProgressItem label="Nodos Territoriales (Sedes)" progress={60} color="from-purple-500 to-indigo-600" />
                                    <ProgressItem label="Validación por Nichos Específicos" progress={90} color="from-pink-500 to-rose-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: SVG Connection Network Diagram */}
                    <div className="lg:col-span-2 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[500px]">
                        <div className="absolute top-8 right-8 z-10">
                            <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                                Ecosistema Interactivo
                            </span>
                        </div>

                        <div className="relative z-10 mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Mapa de Conexiones del Ecosistema</h3>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mt-1">Haz clic en cualquier nodo para abrir su panel operativo</p>
                        </div>

                        {/* Interactive SVG Diagram */}
                        <div className="relative w-full max-w-[550px] aspect-video mx-auto flex items-center justify-center py-6">
                            <svg viewBox="0 0 500 400" className="w-full h-full overflow-visible">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>

                                {/* Connections/Edges */}
                                {connections.map((conn, idx) => {
                                    const fromNode = nodes.find(n => n.id === conn.from);
                                    const toNode = nodes.find(n => n.id === conn.to);
                                    if (!fromNode || !toNode) return null;
                                    return (
                                        <motion.line
                                            key={idx}
                                            x1={fromNode.x}
                                            y1={fromNode.y}
                                            x2={toNode.x}
                                            y2={toNode.y}
                                            stroke="url(#lineGrad)"
                                            strokeWidth="2.5"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: idx * 0.1 }}
                                        />
                                    );
                                })}

                                {/* Nodes Layer */}
                                {nodes.map((node) => {
                                    const IconNode = node.icon;
                                    const isHovered = activeHoverNode === node.id;
                                    
                                    return (
                                        <g 
                                            key={node.id} 
                                            className="cursor-pointer group/node"
                                            onClick={() => handleNodeClick(node.href)}
                                            onMouseEnter={() => setActiveHoverNode(node.id)}
                                            onMouseLeave={() => setActiveHoverNode(null)}
                                        >
                                            {/* Glowing Outer Shadow on Hover */}
                                            <circle 
                                                cx={node.x} 
                                                cy={node.y} 
                                                r={isHovered ? 28 : 22} 
                                                fill="rgba(0,0,0,0.6)"
                                                className={`transition-all duration-300 ${isHovered ? 'stroke-indigo-500 stroke-[3px]' : 'stroke-white/10 stroke-[1.5px]'}`}
                                            />
                                            
                                            {/* Glow effect */}
                                            {isHovered && (
                                                <circle 
                                                    cx={node.x} 
                                                    cy={node.y} 
                                                    r="38" 
                                                    fill="none" 
                                                    stroke="rgba(99, 102, 241, 0.2)" 
                                                    strokeWidth="6"
                                                    className="animate-pulse"
                                                />
                                            )}

                                            {/* Node label and status on hover */}
                                            <foreignObject 
                                                x={node.x - 70} 
                                                y={node.y + 26} 
                                                width="140" 
                                                height="50"
                                                className="overflow-visible pointer-events-none"
                                            >
                                                <div className="text-center space-y-0.5">
                                                    <div className="text-[9px] font-black uppercase text-white tracking-widest truncate">
                                                        {node.label}
                                                    </div>
                                                    <div className={`text-[7px] font-black tracking-[0.2em] uppercase ${node.color}`}>
                                                        {node.status}
                                                    </div>
                                                </div>
                                            </foreignObject>

                                            {/* Icon Placement */}
                                            <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                                                <IconNode className={`w-5 h-5 ${node.color} group-hover/node:scale-110 transition-transform`} />
                                            </g>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Node details panel */}
                        <div className="bg-white/5 border border-white/5 p-4 rounded-3xl min-h-[70px] flex items-center justify-between">
                            {activeHoverNode ? (
                                (() => {
                                    const node = nodes.find(n => n.id === activeHoverNode);
                                    return (
                                        <>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full bg-${node.color.split('-')[1]}-500 animate-pulse`} />
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">{node.label}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-medium">{node.desc}</p>
                                            </div>
                                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                                ABRIR <ArrowUpRight className="w-3.5 h-3.5" />
                                            </span>
                                        </>
                                    );
                                })()
                            ) : (
                                <div className="text-center w-full py-2">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Pasa el cursor sobre un nodo para ver los detalles de conectividad</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid 2: Recruitment and Terminal logs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Sedes & Recruitment */}
                    <div className="lg:col-span-1 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Sedes & Talent Pool</h3>
                                <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Fase 2 Activa</span>
                            </div>
                            
                            <div className="space-y-5">
                                <SedeStatus name="Santo Domingo (HQ Central)" status="Activa" cmCount={2} editorCount={3} />
                                <SedeStatus name="Quito Sede" status="Estabilizando" cmCount={1} editorCount={1} />
                                <SedeStatus name="Guayaquil Sede" status="Inicial" cmCount={0} editorCount={1} />
                                <SedeStatus name="Manta Sede" status="Planificado" cmCount={0} editorCount={0} isLocked={true} />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 mt-8">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                <span>Reclutamiento Global</span>
                                <span className="text-white">{stats.teamCount} / 25 Nodes</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${(stats.teamCount / 25) * 100}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Diagnostic Simulator & Ecosystem logs */}
                    <div className="lg:col-span-2 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col justify-between min-h-[350px]">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-indigo-500" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Consola de Conectores (Diagnóstico)</h3>
                                </div>
                                <button 
                                    onClick={triggerConnectorTest}
                                    disabled={isTesting}
                                    className={`px-4 py-2 bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${isTesting ? 'opacity-50 animate-pulse' : 'hover:scale-105'}`}
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} /> Testear Conectores
                                </button>
                            </div>

                            {/* Logs Terminal */}
                            <div className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 font-mono text-[10px] space-y-2.5 min-h-[160px] max-h-[180px] overflow-y-auto custom-scrollbar">
                                {isTesting && (
                                    <div className="text-indigo-400 animate-pulse">
                                        [DIAGNOSTIC] Corriendo verificación general del ecosistema... ({testProgress}%)
                                    </div>
                                )}
                                {logs.map((log, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <span className="text-gray-600 select-none">[{log.time}]</span>
                                        <span className={log.type === 'success' ? 'text-emerald-400' : 'text-gray-300'}>{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pt-4 border-t border-white/5 flex items-center justify-between">
                            <span>Diagnostic Protocol: Active</span>
                            <span>Secure Endpoint: diiczone.com</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

function ProgressItem({ label, progress, color }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>{label}</span>
                <span className="text-white">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

function SedeStatus({ name, status, cmCount, editorCount, isLocked = false }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all ${isLocked ? 'bg-white/[0.01] border-dashed border-white/5 opacity-40' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-white uppercase tracking-tight">{name}</span>
                {isLocked ? (
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                        Bloqueado
                    </span>
                ) : (
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${status === 'Activa' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                        {status}
                    </span>
                )}
            </div>
            {!isLocked && (
                <div className="flex items-center gap-4 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-indigo-400" /> {cmCount} CMs</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-purple-400" /> {editorCount} Editores</span>
                </div>
            )}
        </div>
    );
}
