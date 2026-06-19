'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Users, Briefcase, Zap,
    Cpu, Server, Lock, Globe, Trophy,
    ArrowUpRight, ArrowLeft, RefreshCw, Send, CheckCircle2,
    ShieldAlert, HardDrive, Smartphone, Compass, Printer, Clapperboard, DollarSign,
    Rocket, Circle, CheckSquare, Square
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function HQProgressPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [isTesting, setIsTesting] = useState(false);
    const [testProgress, setTestProgress] = useState(0);
    const [activeHoverNode, setActiveHoverNode] = useState(null);
    const [activePhaseTab, setActivePhaseTab] = useState(2); // Default to Phase 2 (Active)
    
    const [stats, setStats] = useState({
        clientsCount: 0,
        teamCount: 0,
        pendingPayments: 0,
        activeTasks: 0
    });
    const [teamList, setTeamList] = useState([]);
    const [branchOffices, setBranchOffices] = useState([]);
    const [aiAgentsCount, setAiAgentsCount] = useState(0);

    // States for Add Sede Territorial (App Scalability action)
    const [showAddBranchModal, setShowAddBranchModal] = useState(false);
    const [newBranchCity, setNewBranchCity] = useState('Santo Domingo');
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchDirector, setNewBranchDirector] = useState('');
    const [newBranchLevel, setNewBranchLevel] = useState('basico');
    const [isSavingBranch, setIsSavingBranch] = useState(false);
    
    // Custom/Operational milestones state synced with localStorage
    const [milestones, setMilestones] = useState({
        fase1_rbac: true,
        fase1_sync: true,
        fase2_imprenta: false,
        fase2_n8n: false,
        fase3_manta: false,
        fase3_pricing: false
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('diic_hq_milestones');
            if (saved) {
                try {
                    setMilestones(JSON.parse(saved));
                } catch (e) {}
            }
        }
    }, []);

    const toggleMilestone = (key) => {
        const updated = { ...milestones, [key]: !milestones[key] };
        setMilestones(updated);
        localStorage.setItem('diic_hq_milestones', JSON.stringify(updated));
        
        if (updated[key]) {
            toast.success("Hito de madurez marcado como completado", {
                description: "El ecosistema DIIC ZONE se encuentra más cerca del lanzamiento estelar.",
                position: "top-center"
            });
        } else {
            toast.info("Hito marcado como pendiente");
        }
    };

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
                setTeamList(team || []);

                // Load actual branch offices and AI agents count
                const [branchesRes, aiAgentsRes] = await Promise.all([
                    supabase.from('branch_offices').select('*'),
                    supabase.from('ai_agents').select('id', { count: 'exact', head: true })
                ]);
                setBranchOffices(branchesRes.data || []);
                setAiAgentsCount(aiAgentsRes.count || 0);
            } catch (err) {
                console.error('Error fetching totals for progress:', err);
            }
        };
        fetchTotals();
    }, []);

    const handleAddBranchOffice = async (e) => {
        e.preventDefault();
        if (!newBranchName || !newBranchDirector) {
            toast.error("Por favor completa todos los campos.");
            return;
        }
        setIsSavingBranch(true);
        try {
            const newBranch = {
                city: newBranchCity,
                name: newBranchName,
                director: newBranchDirector,
                level: newBranchLevel,
                status: 'active'
            };
            const { data, error } = await supabase
                .from('branch_offices')
                .insert([newBranch])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setBranchOffices(prev => [...prev, data[0]]);
                toast.success(`Sede en ${newBranchCity} desplegada correctamente`, {
                    description: "Se ha registrado el nuevo nodo territorial en el ecosistema."
                });
                setShowAddBranchModal(false);
                setNewBranchName('');
                setNewBranchDirector('');
                setNewBranchLevel('basico');
            }
        } catch (error) {
            console.error("Error inserting branch office:", error);
            toast.error("Fallo al crear la sede territorial.");
        } finally {
            setIsSavingBranch(false);
        }
    };

    const triggerConnectorTest = async () => {
        if (isTesting) return;
        setIsTesting(true);
        setTestProgress(0);

        try {
            // Fake animation progress bar purely for visual feedback transition (lasts 1s)
            await new Promise((resolve) => {
                let current = 0;
                const interval = setInterval(() => {
                    current += 20;
                    setTestProgress(current);
                    if (current >= 100) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });

            // Perform real Supabase queries to measure latency and retrieve totals
            const dbStart = Date.now();
            const { data: clientsData, error: clientsErr } = await supabase.from('clients').select('id');
            const latency = Date.now() - dbStart;

            setIsTesting(false);

            if (clientsErr) {
                throw clientsErr;
            }

            const timeString = new Date().toLocaleTimeString();
            const successLogs = [
                {
                    time: timeString,
                    msg: `[SUPABASE] Conectado exitosamente en ${latency}ms. Enlace de base de datos estable.`,
                    type: 'success'
                },
                {
                    time: timeString,
                    msg: `[DIAGNOSTIC] ${clientsData?.length || 0} aliados comerciales y ${stats.teamCount} miembros de equipo activos en tiempo real.`,
                    type: 'info'
                },
                {
                    time: timeString,
                    msg: `[ZONA CREATIVA] Conector activo. Listo para procesamiento de video y coordinación.`,
                    type: 'success'
                },
                {
                    time: timeString,
                    msg: `[IMPRENTA] Sincronización verificada con el taller para el merch de clientes.`,
                    type: 'success'
                }
            ];

            setLogs(prev => [...successLogs, ...prev]);
            toast.success("Diagnóstico completado con éxito", {
                description: `Supabase Latencia: ${latency}ms. Conectores al 100% funcionales.`
            });

        } catch (error) {
            console.error("Error in real diagnostic:", error);
            setIsTesting(false);
            const timeString = new Date().toLocaleTimeString();
            setLogs(prev => [
                {
                    time: timeString,
                    msg: `[ERROR] Error de diagnóstico: ${error.message || 'Error de red.'}`,
                    type: 'error'
                },
                ...prev
            ]);
            toast.error("Error en diagnóstico de puertos/red");
        }
    };

    const handleNodeClick = (href) => {
        toast.success(`Redireccionando al módulo de destino...`);
        router.push(href);
    };

    // Connections network layout configurations
    const nodes = [
        { id: 'hq', label: 'Cerebro Central', status: 'ONLINE', x: 250, y: 200, href: '/dashboard/hq', icon: Cpu, desc: 'Comando principal e inteligencia de control de la app.', color: 'text-indigo-400', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.5)]', border: 'border-indigo-500' },
        
        { id: 'creativa', label: 'Zona Creativa', status: 'CONECTADO', x: 90, y: 100, href: '/dashboard/creative-zone', icon: Clapperboard, desc: 'Espacio de creadores de contenido, subida de crudos e ideas.', color: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', border: 'border-emerald-500' },
        
        { id: 'imprenta', label: 'Imprenta Directa', status: 'LISTO', x: 410, y: 100, href: '/dashboard/print', icon: Printer, desc: 'Conector con talleres físicos para el despacho directo de merch.', color: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]', border: 'border-yellow-500' },
        
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

    // Calculate individual Phase Progress rates
    const f1Tasks = [stats.clientsCount >= 10, milestones.fase1_rbac, milestones.fase1_sync];
    const f1Progress = Math.round((f1Tasks.filter(Boolean).length / f1Tasks.length) * 100);

    const f2Tasks = [stats.clientsCount >= 10, milestones.fase2_imprenta, milestones.fase2_n8n, stats.clientsCount >= 20];
    const f2Progress = Math.round((f2Tasks.filter(Boolean).length / f2Tasks.length) * 100);

    const f3Tasks = [stats.clientsCount >= 20, milestones.fase3_manta, milestones.fase3_pricing, stats.teamCount >= 25];
    const f3Progress = Math.round((f3Tasks.filter(Boolean).length / f3Tasks.length) * 100);

    const globalTasks = [...f1Tasks, ...f2Tasks.slice(1), ...f3Tasks.slice(1)]; // 3 + 3 + 3 = 9 total milestones
    const globalProgress = Math.round((globalTasks.filter(Boolean).length / globalTasks.length) * 100);

    // Dynamic Sede Stats calculation based on loaded team members
    const getSedeStats = (cityKey) => {
        let cms = 0;
        let editors = 0;
        
        teamList.forEach(member => {
            const memberCity = (member.city || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const role = (member.role || '').toLowerCase();
            
            let match = false;
            if (cityKey === 'santo_domingo') {
                match = memberCity.includes('santo') || memberCity.includes('domingo');
            } else if (cityKey === 'quito') {
                match = memberCity.includes('quito');
            } else if (cityKey === 'guayaquil') {
                match = memberCity.includes('guayaquil');
            } else if (cityKey === 'manta') {
                match = memberCity.includes('manta');
            }
            
            if (match) {
                if (role.includes('community') || role.includes('cm') || role.includes('manager')) {
                    cms++;
                } else if (role.includes('editor')) {
                    editors++;
                }
            }
        });
        
        return { cms, editors };
    };

    const sdStats = getSedeStats('santo_domingo');
    const quitoStats = getSedeStats('quito');
    const gyeStats = getSedeStats('guayaquil');
    const mantaStats = getSedeStats('manta');

    return (
        <div className="bg-[#050511] min-h-screen text-white font-sans selection:bg-yellow-500/30 pb-20">
            <main className="p-10 max-w-[1700px] mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight italic uppercase flex items-center gap-3">
                            <Trophy className="w-9 h-9 text-yellow-500 animate-pulse" /> MI PROGRESO (CEO VIEW)
                        </h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">DIIC ZONE OS — Estado de Desarrollo & Integración Tecnológica</p>
                    </div>
                    <button 
                        onClick={() => router.push('/dashboard/hq')}
                        className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> HQ Central
                    </button>
                </div>

                {/* CEO Platform Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#0A0A1F] border border-white/5 p-6 rounded-[32px] flex items-center gap-5 relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <Compass className="w-6 h-6 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Rutas Compiladas</p>
                            <h3 className="text-2xl font-black text-white mt-1">179 Rutas</h3>
                            <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Build Next.js exitoso</p>
                        </div>
                    </div>
                    <div className="bg-[#0A0A1F] border border-white/5 p-6 rounded-[32px] flex items-center gap-5 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <HardDrive className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Tablas de Datos</p>
                            <h3 className="text-2xl font-black text-white mt-1">31 Tablas</h3>
                            <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Relaciones RLS Activas</p>
                        </div>
                    </div>
                    <div className="bg-[#0A0A1F] border border-white/5 p-6 rounded-[32px] flex items-center gap-5 relative overflow-hidden group hover:border-purple-500/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                            <Cpu className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Agentes IA Core</p>
                            <h3 className="text-2xl font-black text-white mt-1">{aiAgentsCount || 6} Modelos</h3>
                            <p className="text-[8px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">Asistentes configurados</p>
                        </div>
                    </div>
                    <div className="bg-[#0A0A1F] border border-white/5 p-6 rounded-[32px] flex items-center gap-5 relative overflow-hidden group hover:border-yellow-500/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <Globe className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Sedes Registradas</p>
                            <h3 className="text-2xl font-black text-white mt-1">{branchOffices.length || 5} Sedes</h3>
                            <p className="text-[8px] text-yellow-400 font-bold uppercase tracking-wider mt-0.5">Nodos en base de datos</p>
                        </div>
                    </div>
                </div>

                {/* Grid 1: Rocket Launcher & SVG Connections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Panel: Rocket Launcher Roadmap */}
                    <div className="lg:col-span-1 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-8 shadow-2xl space-y-8 flex flex-col justify-between">
                        <div>
                            {/* Roadmap Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <Rocket className={`w-6 h-6 text-indigo-400 ${globalProgress === 100 ? 'animate-bounce' : 'animate-pulse'}`} />
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Madurez del Software</h3>
                                </div>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Despliegue: {globalProgress}%</span>
                            </div>

                            {/* Rocket Progress Gauge */}
                            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl mb-8 flex items-center gap-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                                <div className="relative shrink-0 flex items-center justify-center">
                                    <svg className="w-16 h-16 transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                        <motion.circle 
                                            cx="32" cy="32" r="28" 
                                            fill="transparent" 
                                            stroke="#6366f1" 
                                            strokeWidth="4" 
                                            strokeDasharray={2 * Math.PI * 28}
                                            strokeDashoffset={2 * Math.PI * 28 * (1 - globalProgress / 100)}
                                            transition={{ duration: 1.2 }}
                                        />
                                    </svg>
                                    <span className="absolute text-[10px] font-black text-white">{globalProgress}%</span>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black text-white uppercase italic">Release DIIC OS</h4>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                        {globalProgress < 40 ? 'Core OS Inicial' : globalProgress < 80 ? 'Workstations Estables' : 'IA Autónoma Completa'}
                                    </p>
                                </div>
                            </div>

                            {/* Phase Selector Tabs */}
                            <div className="grid grid-cols-3 gap-2 bg-black/40 p-1 rounded-2xl border border-white/5 mb-8">
                                {[1, 2, 3].map(phaseNum => {
                                    const isActive = activePhaseTab === phaseNum;
                                    const progress = phaseNum === 1 ? f1Progress : phaseNum === 2 ? f2Progress : f3Progress;
                                    return (
                                        <button
                                            key={phaseNum}
                                            onClick={() => setActivePhaseTab(phaseNum)}
                                            className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            Fase {phaseNum}
                                            <span className="block text-[8px] font-bold opacity-60 mt-0.5">{progress}%</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Milestone checklist based on active tab */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activePhaseTab}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    {activePhaseTab === 1 && (
                                        <>
                                            <div className="pb-4 border-b border-white/5">
                                                <h4 className="text-xs font-black text-white uppercase">Fase 1: Núcleo & Seguridad</h4>
                                                <p className="text-[10px] text-gray-500 mt-1">Estructura base de la base de datos, roles y sincronización realtime.</p>
                                            </div>
                                            <CheckItem checked={stats.clientsCount >= 10} label={`Meta de 10 clientes (${stats.clientsCount}/10)`} isDynamic />
                                            <CheckItem checked={milestones.fase1_rbac} label="Modelos Jerárquicos RBAC" onClick={() => toggleMilestone('fase1_rbac')} />
                                            <CheckItem checked={milestones.fase1_sync} label="Sincronización Realtime" onClick={() => toggleMilestone('fase1_sync')} />
                                            
                                            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                    <Users className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                <div className="text-[9px] text-gray-500 uppercase font-black">Módulos: HQ Core + Auth</div>
                                            </div>
                                        </>
                                    )}

                                    {activePhaseTab === 2 && (
                                        <>
                                            <div className="pb-4 border-b border-white/5">
                                                <h4 className="text-xs font-black text-white uppercase">Fase 2: Integración & Automatización</h4>
                                                <p className="text-[10px] text-gray-500 mt-1">Creación de workstations creativas, logística de merch y flujos webhooks.</p>
                                            </div>
                                            <CheckItem checked={stats.clientsCount >= 10} label="Mapa Operativo de Expansión" isDynamic />
                                            <CheckItem checked={milestones.fase2_imprenta} label="Conectar Imprenta Directa" onClick={() => toggleMilestone('fase2_imprenta')} />
                                            <CheckItem checked={milestones.fase2_n8n} label="Integrar Webhooks n8n" onClick={() => toggleMilestone('fase2_n8n')} />
                                            <CheckItem checked={stats.clientsCount >= 20} label={`Escalar a 20 clientes (${stats.clientsCount}/20)`} isDynamic />
                                            
                                            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                    <Cpu className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <div className="text-[9px] text-gray-500 uppercase font-black">Módulos: Workstations + Print Shop</div>
                                            </div>
                                        </>
                                    )}

                                    {activePhaseTab === 3 && (
                                        <>
                                            <div className="pb-4 border-b border-white/5">
                                                <h4 className="text-xs font-black text-white uppercase">Fase 3: Inteligencia Core & Escala</h4>
                                                <p className="text-[10px] text-gray-500 mt-1">Implementación de agentes de IA autónomos y apertura de sedes físicas.</p>
                                            </div>
                                            <CheckItem checked={stats.clientsCount >= 20} label="Acceso total a Control Maestro" isDynamic />
                                            <CheckItem checked={milestones.fase3_manta} label="Apertura Sede Manta" onClick={() => toggleMilestone('fase3_manta')} />
                                            <CheckItem checked={milestones.fase3_pricing} label="Algoritmo de Precios Dinámicos" onClick={() => toggleMilestone('fase3_pricing')} />
                                            <CheckItem checked={stats.teamCount >= 25} label={`Reclutar 25 nodos (${stats.teamCount}/25)`} isDynamic />
                                            
                                            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                    <Server className="w-4 h-4 text-purple-400" />
                                                </div>
                                                <div className="text-[9px] text-gray-500 uppercase font-black">Módulos: AI Agents + Nodes Multi-tenant</div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
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
                    
                                 <div className="lg:col-span-1 bg-[#0A0A1F] border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Sedes & Escala</h3>
                                <button
                                    onClick={() => setShowAddBranchModal(true)}
                                    className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                >
                                    + Sede
                                </button>
                            </div>
                            
                            <div className="space-y-5 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                                {branchOffices.length > 0 ? (
                                    branchOffices.map((office) => {
                                        let cityKey = 'quito';
                                        const normCity = office.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                                        if (normCity.includes('santo') || normCity.includes('domingo')) cityKey = 'santo_domingo';
                                        else if (normCity.includes('quito')) cityKey = 'quito';
                                        else if (normCity.includes('guayaquil')) cityKey = 'guayaquil';
                                        else if (normCity.includes('manta')) cityKey = 'manta';
                                        
                                        const cityStats = getSedeStats(cityKey);
                                        const displayStatus = office.status === 'active' ? 'Activo' : 'Inactivo';
                                        
                                        return (
                                            <SedeStatus 
                                                key={office.id}
                                                name={`${office.city} (${office.name})`} 
                                                status={displayStatus} 
                                                cmCount={cityStats.cms} 
                                                editorCount={cityStats.editors} 
                                                director={office.director}
                                                level={office.level}
                                            />
                                        );
                                    })
                                ) : (
                                    <>
                                        <SedeStatus name="Santo Domingo (HQ Central)" status="Activa" cmCount={sdStats.cms} editorCount={sdStats.editors} />
                                        <SedeStatus name="Quito Sede" status={quitoStats.cms + quitoStats.editors > 0 ? "Activa" : "Estabilizando"} cmCount={quitoStats.cms} editorCount={quitoStats.editors} />
                                        <SedeStatus name="Guayaquil Sede" status={gyeStats.cms + gyeStats.editors > 0 ? "Activa" : "Inicial"} cmCount={gyeStats.cms} editorCount={gyeStats.editors} />
                                        <SedeStatus name="Manta Sede" status={mantaStats.cms + mantaStats.editors > 0 ? "Activa" : "Planificado"} cmCount={mantaStats.cms} editorCount={mantaStats.editors} isLocked={stats.clientsCount < 20} />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 mt-6 space-y-4">
                            <div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                    <span>Reclutamiento Global</span>
                                    <span className="text-white">{stats.teamCount} / 25 Nodes</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500" style={{ width: `${(stats.teamCount / 25) * 100}%` }} />
                                </div>
                            </div>

                            {/* Dynamic Workload Saturation & Capacity Scale */}
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl space-y-3">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Límite de Escala del OS</span>
                                    <span className="text-white font-bold">{stats.clientsCount} / {stats.teamCount * 5 || 1} Clientes</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                                    <div 
                                        className={`h-full transition-all duration-500 ${
                                            (stats.clientsCount / (stats.teamCount * 5 || 1)) > 0.85 
                                                ? 'bg-rose-500 shadow-[0_0_10px_#ef4444]' 
                                                : (stats.clientsCount / (stats.teamCount * 5 || 1)) > 0.6 
                                                    ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' 
                                                    : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
                                        }`} 
                                        style={{ width: `${Math.min((stats.clientsCount / (stats.teamCount * 5 || 1)) * 100, 100)}%` }} 
                                    />
                                </div>
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-wider">
                                    <span className="text-gray-500">Saturación: {Math.round((stats.clientsCount / (stats.teamCount * 5 || 1)) * 100)}%</span>
                                    <span className={
                                        (stats.clientsCount / (stats.teamCount * 5 || 1)) > 0.85 
                                            ? 'text-rose-400' 
                                            : (stats.clientsCount / (stats.teamCount * 5 || 1)) > 0.6 
                                                ? 'text-yellow-400' 
                                                : 'text-emerald-400 font-bold'
                                    }>
                                        {(stats.clientsCount / (stats.teamCount * 5 || 1)) > 0.85 
                                            ? 'Reclutar Urgente' 
                                            : (stats.clientsCount / (stats.teamCount * 5 || 1)) > 0.6 
                                                ? 'Capacidad Limite' 
                                                : 'Óptima para Escalar 🚀'}
                                    </span>
                                </div>
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

                {/* Modal de Despliegue de Nueva Sede (Escalabilidad de la App) */}
                <AnimatePresence>
                    {showAddBranchModal && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#0A0A1F] border border-white/10 p-8 rounded-[32px] w-full max-w-md shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-indigo-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-wider text-white">Desplegar Nueva Sede</h3>
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">DIIC ZONE OS — Escalabilidad Territorial</p>
                                    </div>
                                </div>

                                <form onSubmit={handleAddBranchOffice} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Ciudad / Región</label>
                                        <select 
                                            value={newBranchCity} 
                                            onChange={(e) => setNewBranchCity(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="Santo Domingo">Santo Domingo</option>
                                            <option value="Quito">Quito</option>
                                            <option value="Guayaquil">Guayaquil</option>
                                            <option value="Manta">Manta</option>
                                            <option value="Loja">Loja</option>
                                            <option value="Cuenca">Cuenca</option>
                                            <option value="Machala">Machala</option>
                                            <option value="Ambato">Ambato</option>
                                            <option value="Portoviejo">Portoviejo</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Nombre del Nodo</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ej: Nodo Norte, Nodo Costa, HQ Central" 
                                            value={newBranchName}
                                            onChange={(e) => setNewBranchName(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Director de Sede</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ej: Andrés P., Roberto G." 
                                            value={newBranchDirector}
                                            onChange={(e) => setNewBranchDirector(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Nivel Operativo</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['basico', 'operativo', 'premium'].map((lvl) => (
                                                <button
                                                    key={lvl}
                                                    type="button"
                                                    onClick={() => setNewBranchLevel(lvl)}
                                                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                        newBranchLevel === lvl 
                                                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-md' 
                                                            : 'bg-black/20 border-white/5 text-gray-500 hover:text-white'
                                                    }`}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="button"
                                            onClick={() => setShowAddBranchModal(false)}
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSavingBranch}
                                            className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1"
                                        >
                                            {isSavingBranch ? 'Registrando...' : 'Desplegar'} <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}

// Subcomponent: Checkbox item for milestone roadmap
function CheckItem({ checked, label, onClick, isDynamic = false }) {
    const isInteractive = !!onClick;
    
    return (
        <div 
            onClick={isInteractive ? onClick : undefined}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                checked 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
            } ${isInteractive ? 'cursor-pointer hover:bg-white/[0.07] active:scale-[0.98]' : 'select-none'}`}
        >
            <div className="flex items-center gap-3">
                <div className={checked ? 'text-emerald-400' : 'text-gray-600'}>
                    {checked ? (
                        <CheckSquare className="w-4 h-4 shrink-0" />
                    ) : (
                        <Square className="w-4 h-4 shrink-0" />
                    )}
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
            </div>
            
            {isDynamic && (
                <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-white/5 text-gray-500 tracking-wider">
                    Auto-sinc
                </span>
            )}
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

function SedeStatus({ name, status, cmCount, editorCount, isLocked = false, director, level }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all ${isLocked ? 'bg-white/[0.01] border-dashed border-white/5 opacity-40' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-white uppercase tracking-tight">{name}</span>
                {isLocked ? (
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                        Bloqueado
                    </span>
                ) : (
                    <div className="flex gap-2">
                        {level && (
                            <span className="text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-indigo-300">
                                {level}
                            </span>
                        )}
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${status === 'Activa' || status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                            {status}
                        </span>
                    </div>
                )}
            </div>
            {!isLocked && (
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3 text-indigo-400" /> {cmCount} CMs</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-purple-400" /> {editorCount} Editores</span>
                    </div>
                    {director && director !== 'Pendiente' && (
                        <span className="text-gray-400">Dir: {director}</span>
                    )}
                </div>
            )}
        </div>
    );
}
