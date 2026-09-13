'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    ReactFlow, 
    Controls, 
    Background, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    Handle, 
    Position, 
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Shield, Zap, Flame, User, Globe, DollarSign, Database } from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { presenceService } from '@/services/presenceService';
import { toast } from 'sonner';

// ============================================
// HELPERS
// ============================================
const getDepartmentStyle = (role) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('estratega')) {
        return {
            gradient: 'from-amber-500 to-orange-600',
            glow: 'bg-amber-500/10',
            glowHover: 'bg-amber-500/30',
            border: 'border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]',
            badgeText: 'text-amber-400',
            handleBg: 'bg-amber-500',
            shadowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        };
    }
    if (r.includes('community manager')) {
        return {
            gradient: 'from-indigo-500 to-blue-600',
            glow: 'bg-indigo-500/10',
            glowHover: 'bg-indigo-500/30',
            border: 'border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]',
            badgeText: 'text-indigo-400',
            handleBg: 'bg-indigo-500',
            shadowColor: 'shadow-[0_0_15px_rgba(99,102,241,0.5)]',
        };
    }
    if (r.includes('diseña')) {
        return {
            gradient: 'from-pink-500 to-rose-600',
            glow: 'bg-pink-500/10',
            glowHover: 'bg-pink-500/30',
            border: 'border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]',
            badgeText: 'text-pink-400',
            handleBg: 'bg-pink-500',
            shadowColor: 'shadow-[0_0_15px_rgba(236,72,153,0.5)]',
        };
    }
    if (r.includes('editor')) {
        return {
            gradient: 'from-purple-500 to-indigo-600',
            glow: 'bg-purple-500/10',
            glowHover: 'bg-purple-500/30',
            border: 'border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
            badgeText: 'text-purple-400',
            handleBg: 'bg-purple-500',
            shadowColor: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
        };
    }
    if (r.includes('film')) {
        return {
            gradient: 'from-orange-500 to-red-600',
            glow: 'bg-orange-500/10',
            glowHover: 'bg-orange-500/30',
            border: 'border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]',
            badgeText: 'text-orange-400',
            handleBg: 'bg-orange-500',
            shadowColor: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]',
        };
    }
    if (r.includes('foto')) {
        return {
            gradient: 'from-amber-400 to-orange-500',
            glow: 'bg-amber-400/10',
            glowHover: 'bg-amber-400/30',
            border: 'border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.25)]',
            badgeText: 'text-amber-400',
            handleBg: 'bg-amber-400',
            shadowColor: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]',
        };
    }
    if (r.includes('audio')) {
        return {
            gradient: 'from-emerald-400 to-teal-500',
            glow: 'bg-emerald-400/10',
            glowHover: 'bg-emerald-400/30',
            border: 'border-emerald-400/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
            badgeText: 'text-emerald-400',
            handleBg: 'bg-emerald-500',
            shadowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        };
    }
    if (r.includes('web') || r.includes('programador')) {
        return {
            gradient: 'from-blue-500 to-cyan-600',
            glow: 'bg-blue-500/10',
            glowHover: 'bg-blue-500/30',
            border: 'border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
            badgeText: 'text-blue-400',
            handleBg: 'bg-blue-500',
            shadowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        };
    }
    if (r.includes('modelo')) {
        return {
            gradient: 'from-fuchsia-500 to-pink-600',
            glow: 'bg-fuchsia-500/10',
            glowHover: 'bg-fuchsia-500/30',
            border: 'border-fuchsia-500/30 hover:shadow-[0_0_30px_rgba(217,70,239,0.25)]',
            badgeText: 'text-fuchsia-400',
            handleBg: 'bg-fuchsia-500',
            shadowColor: 'shadow-[0_0_15px_rgba(217,70,239,0.5)]',
        };
    }
    if (r.includes('imprenta') || r.includes('merch')) {
        return {
            gradient: 'from-slate-500 to-slate-700',
            glow: 'bg-slate-500/10',
            glowHover: 'bg-slate-500/30',
            border: 'border-slate-500/30 hover:shadow-[0_0_30px_rgba(100,116,139,0.25)]',
            badgeText: 'text-slate-400',
            handleBg: 'bg-slate-500',
            shadowColor: 'shadow-[0_0_15px_rgba(100,116,139,0.5)]',
        };
    }
    if (r.includes('evento')) {
        return {
            gradient: 'from-indigo-400 to-purple-500',
            glow: 'bg-indigo-400/10',
            glowHover: 'bg-indigo-400/30',
            border: 'border-indigo-400/30 hover:shadow-[0_0_30px_rgba(129,140,248,0.25)]',
            badgeText: 'text-indigo-400',
            handleBg: 'bg-indigo-400',
            shadowColor: 'shadow-[0_0_15px_rgba(129,140,248,0.5)]',
        };
    }
    return {
        gradient: 'from-slate-400 to-slate-600',
        glow: 'bg-slate-400/10',
        glowHover: 'bg-slate-400/30',
        border: 'border-slate-400/30 hover:shadow-[0_0_30px_rgba(148,163,184,0.25)]',
        badgeText: 'text-slate-400',
        handleBg: 'bg-slate-400',
        shadowColor: 'shadow-[0_0_15px_rgba(148,163,184,0.5)]',
    };
};

// ============================================
// CUSTOM NODE COMPONENT (Tarjeta Visual)
// ============================================
const MemberNode = ({ data, isConnectable }) => {
    const style = getDepartmentStyle(data.role);

    // Live presence status computation (🟢 Verde, 🟡 Amarillo, 🔴 Rojo)
    const liveStatus = useMemo(() => {
        return presenceService.computeStatus(data.member, data.onlineEmails || new Set());
    }, [data.member, data.onlineEmails]);

    const isPending = liveStatus.status === 'unapproved';
    const niches = Array.isArray(data.member?.niche_affinities) ? data.member.niche_affinities : [];
    const quizScore = data.member?.onboarding_quiz_score;

    return (
        <div className={`relative w-[280px] bg-[#0A0A14]/90 backdrop-blur-xl border ${isPending ? 'border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.2)]' : liveStatus.status === 'online' ? 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]' : style.border} rounded-[2rem] p-6 flex flex-col shadow-2xl group transition-all duration-300`}>
            
            {/* Contenedor Interno para recortar las luces sin recortar los conectores (Handles) */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                 <div className={`absolute -top-10 -right-10 w-32 h-32 ${isPending ? 'bg-rose-500/20' : liveStatus.status === 'online' ? 'bg-emerald-500/20' : style.glow} blur-[50px] rounded-full group-hover:opacity-100 transition-all duration-1000`} />
            </div>

            {/* Top Handle: Entrada (Recibe instrucciones del lider) */}
            <Handle 
                type="target" 
                position={Position.Top} 
                isConnectable={isConnectable} 
                className={`w-6 h-6 -top-3 rounded-full border-[4px] border-[#0A0A14] ${style.handleBg} cursor-crosshair transition-transform hover:scale-125 ${style.shadowColor} z-50`} 
            />
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase ${style.badgeText} tracking-widest opacity-0 group-hover:opacity-100 transition-opacity`}>RECEPTOR</div>

            {/* Status Pill on Top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-black/60 border border-white/10 text-[8px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <div className="relative flex items-center justify-center w-2 h-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full ${liveStatus.pingClass} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${liveStatus.dotClass}`} />
                </div>
                <span className={liveStatus.color === 'green' ? 'text-emerald-400 font-bold' : liveStatus.color === 'yellow' ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                    {liveStatus.badgeText}
                </span>
            </div>

            {/* Avatar & Identidad */}
            <div className="flex flex-col items-center mb-4 pt-3 relative z-10">
                <div className="relative">
                    <div className={`w-16 h-16 rounded-[1.2rem] bg-gradient-to-tr ${isPending ? 'from-rose-500 to-amber-600' : liveStatus.status === 'online' ? 'from-emerald-400 to-teal-600' : style.gradient} p-0.5 shadow-2xl transition-transform duration-500`}>
                        <div className="w-full h-full rounded-[1.1rem] bg-[#050510] flex items-center justify-center text-2xl font-black text-white italic tracking-tighter">
                            {data.label ? data.label[0] : '?'}
                        </div>
                    </div>
                    {/* Pulsating Realtime Status Light */}
                    <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                        <span className={`absolute w-5 h-5 rounded-full ${liveStatus.pingClass} opacity-60`} />
                        <span 
                            title={liveStatus.label}
                            className={`relative w-4 h-4 rounded-full border-2 border-[#0A0A14] ${liveStatus.dotClass}`} 
                        />
                    </div>
                </div>
                <div className="text-center mt-3 w-full px-2">
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none truncate max-w-full" title={data.label || 'Talento'}>
                        {data.label || 'Talento'}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap mt-2">
                        <p className={`text-[7px] font-black ${style.badgeText} uppercase tracking-[0.2em] bg-white/5 py-1 px-2.5 rounded-full border border-white/5 inline-block`}>{data.role}</p>
                        {quizScore !== null && quizScore !== undefined && (
                            <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${Number(quizScore) >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                                Quiz {quizScore}%
                            </span>
                        )}
                    </div>
                    {data.member?.secondary_profession && (
                        <p className="text-[8px] text-indigo-300/80 italic font-medium mt-1 truncate max-w-full px-1" title={data.member.secondary_profession}>
                            ✨ {data.member.secondary_profession}
                        </p>
                    )}
                    {data.member?.email && (
                        <p className="text-[9px] text-gray-500 group-hover:text-gray-400 transition-colors mt-1 select-all font-mono truncate max-w-full px-1" title={data.member.email}>
                            {data.member.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Niches Tags (if any) */}
            {niches.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1 mb-3 relative z-10 px-1">
                    {niches.slice(0, 3).map((n, i) => (
                        <span key={i} className="text-[7px] font-bold uppercase tracking-wider bg-white/[0.04] text-gray-300 border border-white/10 px-2 py-0.5 rounded-md truncate max-w-[80px]">
                            {n}
                        </span>
                    ))}
                    {niches.length > 3 && (
                        <span className="text-[7px] font-bold text-gray-500">+{niches.length - 3}</span>
                    )}
                </div>
            )}

            {/* Micro Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
                    <Globe className="w-3 h-3 text-gray-500 mb-1" />
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{data.city || 'Remoto'}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
                    <DollarSign className="w-3 h-3 text-gray-500 mb-1" />
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter text-center">${data.salary || 0}</span>
                </div>
            </div>

            {/* Action Button */}
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    if(data.onAudit) data.onAudit(data.member); 
                }} 
                className="nodrag w-full py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 font-black uppercase text-[8px] tracking-[0.4em] transition-all relative z-10 backdrop-blur-md"
            >
                Ver Detalles
            </button>
            
            {/* Bottom Handle: Salida (Lidera a otros) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                isConnectable={isConnectable} 
                className="w-8 h-8 -bottom-4 rounded-full border-[4px] border-[#0A0A14] bg-emerald-500 cursor-crosshair transition-transform hover:scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-50 flex items-center justify-center" 
            >
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </Handle>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-emerald-500 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">ARRASTRAR PARA LIDERAR</div>
        </div>
    );
};

const nodeTypes = { customMember: MemberNode };

// ============================================
// MAIN VISUAL BOARD
// ============================================
export default function SquadCanvasBoard({ team, allClients = [], onAudit, refreshTeam }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [activeSede, setActiveSede] = useState('Todas');
    const [onlineEmails, setOnlineEmails] = useState(new Set());

    // Subscribe to Realtime Presence updates
    useEffect(() => {
        const unsubscribe = presenceService.subscribe((emailsSet) => {
            setOnlineEmails(emailsSet);
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // Initialize Layout with Persistent Memory
    useEffect(() => {
        if (!team || team.length === 0) {
            setNodes([]);
            setEdges([]);
            return;
        }

        console.log(`📡 [SquadCanvas] Building structure for ${team.length} members. Sede: ${activeSede}. Online users: ${onlineEmails.size}`);

        const generatedNodes = [];
        const generatedEdges = [];
        const savedLayout = JSON.parse(localStorage.getItem('diiczone_squad_layout') || '{}');

        // Filter by Sede
        let filteredTeam = [...team];

        if (activeSede !== 'Todas') {
            const sedeClients = (allClients || []).filter(c => (c.city || '').toLowerCase().trim() === activeSede.toLowerCase().trim());
            const activePersonnelNames = new Set(
                sedeClients.flatMap(c => [c.cm, c.editor, c.filmmaker])
                    .filter(Boolean)
                    .map(name => name.trim())
            );
            
            const coreMembers = team.filter(m => {
                const memberCity = (m.city || '').toLowerCase().trim();
                const targetSede = activeSede.toLowerCase().trim();
                const isResident = memberCity === targetSede;
                return activePersonnelNames.has((m.name || '').trim()) || isResident;
            });
            
            const squadSet = new Set(coreMembers.map(m => m.id));
            let addedNew = true;
            while(addedNew) {
                addedNew = false;
                team.forEach(m => {
                    if (squadSet.has(m.id) && m.squad_lead_id && !squadSet.has(m.squad_lead_id)) {
                        squadSet.add(m.squad_lead_id);
                        addedNew = true;
                    }
                });
            }
            filteredTeam = team.filter(m => squadSet.has(m.id));
        }

        const isEstrategaRole = (r) => {
            const role = (r || '').toLowerCase();
            return role.includes('estratega') || role.includes('director') || role.includes('lider');
        };

        const isCMRole = (r) => {
            const role = (r || '').toLowerCase();
            return role.includes('community manager') || role.includes('cm') || role.includes('social media');
        };

        const strategists = filteredTeam.filter(m => isEstrategaRole(m.role));
        const cms = filteredTeam.filter(m => isCMRole(m.role));
        const creatives = filteredTeam.filter(m => !isEstrategaRole(m.role) && !isCMRole(m.role));

        // Simple layouting math
        const LEVEL_Y = { ESTRATEGAS: 50, CMS: 450, CREATIVES: 850 };
        const X_SPACING = { ESTRATEGAS: 400, CMS: 350, CREATIVES: 320 };

        const startX = (arr, spacing) => -((arr.length - 1) * spacing) / 2;

        const addMembersToNodes = (members, levelY, spacing) => {
            let start = startX(members, spacing);
            members.forEach((m, idx) => {
                generatedNodes.push({
                    id: m.id,
                    type: 'customMember',
                    position: savedLayout[m.id] || { x: start + (idx * spacing), y: levelY },
                    data: { 
                        label: m.name || 'Sin Nombre', 
                        role: m.role || 'Talento', 
                        city: m.city, 
                        salary: m.salary, 
                        member: m, 
                        onlineEmails,
                        onAudit 
                    }
                });

                if (m.squad_lead_id) {
                    generatedEdges.push({
                        id: `e-${m.squad_lead_id}-${m.id}`,
                        source: m.squad_lead_id,
                        target: m.id,
                        animated: true,
                        style: { stroke: '#818cf8', strokeWidth: 3 },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
                    });
                }
            });
        };

        addMembersToNodes(strategists, LEVEL_Y.ESTRATEGAS, X_SPACING.ESTRATEGAS);
        addMembersToNodes(cms, LEVEL_Y.CMS, X_SPACING.CMS);
        addMembersToNodes(creatives, LEVEL_Y.CREATIVES, X_SPACING.CREATIVES);

        setNodes(generatedNodes);
        setEdges(generatedEdges);
    }, [team, allClients, onAudit, activeSede, onlineEmails]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onNodeDragStop = useCallback((event, node) => {
        // Save coordinates persistently when the user stops dragging
        const currentSaved = JSON.parse(localStorage.getItem('diiczone_squad_layout') || '{}');
        currentSaved[node.id] = node.position;
        localStorage.setItem('diiczone_squad_layout', JSON.stringify(currentSaved));
    }, []);

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(async (params) => {
        // params: { source, target, sourceHandle, targetHandle }
        console.log("🔗 New Edge Connecting:", params);
        
        // Optimistic UI updates
        const newEdge = { 
            ...params, 
            id: `e-${params.source}-${params.target}`, 
            animated: true, 
            style: { stroke: '#10b981', strokeWidth: 4, filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.8))' }, 
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
        };
        
        setEdges((eds) => addEdge(newEdge, eds));
        
        // Remove prior edges that target the same node (a person can only have 1 direct squad_lead_id)
        setEdges((eds) => eds.filter(e => e.target !== params.target || e.source === params.source));

        try {
            // Update Database: target member now reports to source member
            await agencyService.updateTeamMember(params.target, { squad_lead_id: params.source });
            toast.success("Vínculo de Mando Actualizado ✨", {
                description: "La estructura jerárquica ha sido sincronizada en la base central."
            });
            if (refreshTeam) refreshTeam();
        } catch (error) {
            console.error("Link update failed:", error);
            toast.error("Error al establecer el mando");
        }
    }, [refreshTeam]);

    const onEdgeDoubleClick = useCallback(async (event, edge) => {
        // Disconnect behavior
        try {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            await agencyService.updateTeamMember(edge.target, { squad_lead_id: null });
            toast.success("Vínculo Desconectado", {
                description: "La unidad vuelve a ser independiente."
            });
            if (refreshTeam) refreshTeam();
        } catch (e) {
            toast.error("Error al desconectar");
        }
    }, [refreshTeam]);

    return (
        <div className="w-full h-[800px] bg-[#05050A] rounded-[3rem] border border-white/5 overflow-hidden group/board relative shadow-2xl">
            {/* HUD OVERLAY */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-indigo-500 animate-pulse" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.5em] italic">Squad Canvas</h3>
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-2 ml-8 mb-6">Sistema Conexión Dinámica</p>
                
                {/* Sede Selectors */}
                <div className="flex flex-col gap-3 ml-8 pointer-events-auto">
                    {['Todas', 'Santo Domingo', 'Quito', 'Manta'].map(sede => (
                        <button 
                            key={sede}
                            onClick={() => setActiveSede(sede)}
                            className={`px-5 py-3 text-left rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all backdrop-blur-md ${activeSede === sede ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-[#0A0A14]/80 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}
                        >
                            <span className={`inline-block w-2 h-2 rounded-full mr-3 ${activeSede === sede ? 'bg-indigo-400 animate-pulse' : 'bg-gray-700'}`}></span>
                            {sede === 'Todas' ? 'Directorio Global' : `Sede ${sede}`}
                        </button>
                    ))}
                </div>
            </div>
            <div className="absolute top-8 right-8 z-10 pointer-events-none text-right">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 border border-indigo-500/20 rounded-full">
                    Arrastra el conector de 🟢 Salida hacia 🔴 Entrada
                </p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">
                    Doble clic en la línea para Desvincular
                </p>
            </div>

            <div className="relative w-full h-full bg-[#0A0A14]/40 rounded-[3rem] border border-white/5 overflow-hidden group shadow-2xl">
                <ReactFlow
                key={`flow-${activeSede}`}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onNodeDragStop={onNodeDragStop}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeDoubleClick={onEdgeDoubleClick}
                nodeTypes={nodeTypes}
                onInit={(instance) => {
                    setTimeout(() => instance.fitView({ padding: 0.2 }), 100);
                }}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.2}
                maxZoom={2}
                className="custom-flow-theme"
            >
                <Background color="#ffffff" gap={32} size={1} opacity={0.03} />
                <Controls 
                    className="bg-[#0A0A14] border border-white/10 rounded-2xl p-2 shadow-2xl fill-white" 
                    showInteractive={false} // clean look
                />
            </ReactFlow>

            {/* Custom CSS overrides for React Flow inner elements to match DIIC Zone aesthetic */}
            <style dangerouslySetInnerHTML={{__html: `
                .react-flow__controls-button {
                    background-color: transparent !important;
                    border: none !important;
                    fill: #9ca3af !important;
                }
                .react-flow__controls-button:hover {
                    fill: #ffffff !important;
                }
                .react-flow__pane {
                    cursor: grab;
                }
                .react-flow__pane:active {
                    cursor: grabbing;
                }
            `}} />
            </div>
        </div>
    );
}
