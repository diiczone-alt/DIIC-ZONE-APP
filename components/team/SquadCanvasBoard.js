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
// ============================================
// CUSTOM NODE COMPONENT (Tarjeta Visual de Talento)
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
    const isCM = (data.role || '').toLowerCase().includes('community manager') || (data.role || '').toLowerCase().includes('cm');

    // 5 to 7 Brands Capacity Logic
    const assignedBrandsCount = data.assignedBrandsCount !== undefined 
        ? data.assignedBrandsCount 
        : (data.allClients || []).filter(c => (c.cm || '').trim().toLowerCase() === (data.label || '').trim().toLowerCase()).length;

    const getCapacityInfo = (count) => {
        if (count <= 4) return { label: `${count}/7 (Baja Carga)`, color: 'text-cyan-400', barBg: 'bg-cyan-500', isOptimal: false, isOver: false, progress: (count / 7) * 100 };
        if (count <= 6) return { label: `${count}/7 (Rango 5-7 Óptimo)`, color: 'text-emerald-400', barBg: 'bg-emerald-500 shadow-[0_0_8px_#10b981]', isOptimal: true, isOver: false, progress: (count / 7) * 100 };
        if (count === 7) return { label: `7/7 (Límite Máximo)`, color: 'text-amber-400', barBg: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]', isOptimal: true, isOver: false, progress: 100 };
        return { label: `${count}/7 (⚠️ Sobrecargado)`, color: 'text-rose-500', barBg: 'bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]', isOptimal: false, isOver: true, progress: 100 };
    };

    const capInfo = getCapacityInfo(assignedBrandsCount);

    return (
        <div className={`relative w-[280px] bg-[#0A0A14]/90 backdrop-blur-xl border ${isPending ? 'border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.2)]' : liveStatus.status === 'online' ? 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]' : style.border} rounded-[2rem] p-6 flex flex-col shadow-2xl group transition-all duration-300`}>
            
            {/* Contenedor Interno para recortar las luces sin recortar los conectores (Handles) */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                 <div className={`absolute -top-10 -right-10 w-32 h-32 ${isPending ? 'bg-rose-500/20' : liveStatus.status === 'online' ? 'bg-emerald-500/20' : style.glow} blur-[50px] rounded-full group-hover:opacity-100 transition-all duration-1000`} />
            </div>

            {/* Top Handle: Entrada (Recibe instrucciones del lider) - Solo en modo Squad */}
            {data.canvasMode !== 'brands' && (
                <>
                    <Handle 
                        type="target" 
                        position={Position.Top} 
                        isConnectable={isConnectable} 
                        className={`w-6 h-6 -top-3 rounded-full border-[4px] border-[#0A0A14] ${style.handleBg} cursor-crosshair transition-transform hover:scale-125 ${style.shadowColor} z-50`} 
                    />
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase ${style.badgeText} tracking-widest opacity-0 group-hover:opacity-100 transition-opacity`}>RECEPTOR</div>
                </>
            )}

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
            <div className="flex flex-col items-center mb-3 pt-3 relative z-10">
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

            {/* 5-7 Brands Load Capacity Meter (for CMs) */}
            {isCM && (
                <div className="mb-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 relative z-10">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Capacidad Marcas (5-7)</span>
                        <span className={`text-[8px] font-black ${capInfo.color}`}>{capInfo.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${capInfo.barBg}`} style={{ width: `${Math.min(capInfo.progress, 100)}%` }} />
                    </div>
                </div>
            )}

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
            <div className="grid grid-cols-2 gap-2 mb-3 relative z-10">
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
                className="nodrag w-full py-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 font-black uppercase text-[8px] tracking-[0.4em] transition-all relative z-10 backdrop-blur-md"
            >
                Ver Detalles
            </button>
            
            {/* Bottom Handle: Salida (Lidera a otros o Conecta con Marcas) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                isConnectable={isConnectable} 
                className={`w-8 h-8 -bottom-4 rounded-full border-[4px] border-[#0A0A14] ${data.canvasMode === 'brands' ? 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]'} cursor-crosshair transition-transform hover:scale-110 z-50 flex items-center justify-center`} 
            >
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </Handle>
            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase ${data.canvasMode === 'brands' ? 'text-cyan-400' : 'text-emerald-500'} tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                {data.canvasMode === 'brands' ? 'ARRASTRAR PARA ASIGNAR MARCA' : 'ARRASTRAR PARA LIDERAR'}
            </div>
        </div>
    );
};

// ============================================
// CUSTOM BRAND NODE (Tarjeta Visual de Marca)
// ============================================
const BrandNode = ({ data, isConnectable }) => {
    const client = data.client || {};
    const hasCM = !!client.cm;
    const isMatched = data.isMatched;

    return (
        <div className={`relative w-[260px] bg-[#0A0A14]/95 backdrop-blur-xl border ${isMatched ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]' : hasCM ? 'border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'} rounded-[2rem] p-5 flex flex-col group transition-all duration-300`}>
            
            {/* Top Handle: Entrada para recibir asignación del CM */}
            <Handle 
                type="target" 
                position={Position.Top} 
                isConnectable={isConnectable} 
                className="w-7 h-7 -top-3.5 rounded-full border-[4px] border-[#0A0A14] bg-cyan-400 cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-50 flex items-center justify-center" 
            >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </Handle>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-cyan-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">CONECTAR CM AQUÍ</div>

            {/* Match Badge if any */}
            {isMatched && (
                <div className="absolute -top-3 right-4 z-30 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[8px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 backdrop-blur-md animate-pulse">
                    ✨ Match Nicho
                </div>
            )}

            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-3 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg flex-shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-[#050510] flex items-center justify-center text-xl font-black text-white italic">
                        {client.name ? client.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-white uppercase italic tracking-tight truncate" title={client.name}>
                        {client.name || 'Marca'}
                    </h4>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider truncate">
                        {client.industry || client.type || 'Comercial'}
                    </p>
                    <span className="text-[7px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                        <Globe className="w-2.5 h-2.5 text-gray-400" /> {client.city || 'Quito'}
                    </span>
                </div>
            </div>

            {/* Assignment Status Box */}
            <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${hasCM ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <div className="min-w-0 flex-1 mr-2">
                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 block">CM Asignado</span>
                    <span className={`text-[9px] font-black uppercase truncate block ${hasCM ? 'text-indigo-300' : 'text-amber-400 animate-pulse'}`}>
                        {hasCM ? `👤 ${client.cm}` : '⚠️ Sin Asignar'}
                    </span>
                </div>
                {hasCM && data.onDisconnectBrand && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onDisconnectBrand(client.id, client.name);
                        }}
                        className="nodrag px-2 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg border border-rose-500/20 text-[7px] font-black uppercase transition-all"
                        title="Desvincular CM"
                    >
                        Liberar
                    </button>
                )}
            </div>

            <div className="text-[8px] text-center text-gray-500 font-bold uppercase tracking-widest">
                {hasCM ? '🟢 Marca Vinculada' : '🔵 Arrastra un CM arriba'}
            </div>
        </div>
    );
};

const nodeTypes = { 
    customMember: MemberNode,
    customBrand: BrandNode 
};

// ============================================
// MAIN VISUAL BOARD
// ============================================
export default function SquadCanvasBoard({ team, allClients = [], onAudit, refreshTeam }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [activeSede, setActiveSede] = useState('Todas');
    const [canvasMode, setCanvasMode] = useState('squad'); // 'squad' | 'brands'
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

    // Helper: Disconnect Brand callback
    const handleDisconnectBrand = useCallback(async (clientId, clientName) => {
        try {
            await agencyService.updateClient(clientId, { cm: null });
            toast.success(`Marca "${clientName}" desvinculada`);
            if (refreshTeam) refreshTeam();
        } catch (e) {
            toast.error("Error al desvincular marca");
        }
    }, [refreshTeam]);

    // Initialize Layout with Persistent Memory
    useEffect(() => {
        if (!team || team.length === 0) {
            setNodes([]);
            setEdges([]);
            return;
        }

        console.log(`📡 [SquadCanvas] Building structure. Mode: ${canvasMode}, Sede: ${activeSede}`);

        const generatedNodes = [];
        const generatedEdges = [];
        const savedLayout = JSON.parse(localStorage.getItem(`diiczone_${canvasMode}_layout`) || '{}');

        // Filter by Sede
        let filteredTeam = [...team];
        let filteredClients = [...allClients];

        if (activeSede !== 'Todas') {
            const targetSede = activeSede.toLowerCase().trim();
            filteredClients = allClients.filter(c => (c.city || '').toLowerCase().trim() === targetSede);
            
            const activePersonnelNames = new Set(
                filteredClients.flatMap(c => [c.cm, c.editor, c.filmmaker])
                    .filter(Boolean)
                    .map(name => name.trim())
            );
            
            const coreMembers = team.filter(m => {
                const memberCity = (m.city || '').toLowerCase().trim();
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

        const cms = filteredTeam.filter(m => isCMRole(m.role));

        // ============================================
        // MODE 1: BRANDS MATRIX CANVAS (CMs arriba, Marcas abajo)
        // ============================================
        if (canvasMode === 'brands') {
            const CM_Y = 60;
            const CM_SPACING = 360;
            const BRAND_START_Y = 520;
            const BRAND_SPACING_X = 300;
            const BRAND_SPACING_Y = 240;
            const BRANDS_PER_ROW = Math.max(4, Math.ceil(Math.sqrt(filteredClients.length * 1.5)));

            // 1. Add CM Nodes
            const startXCM = -((cms.length - 1) * CM_SPACING) / 2;
            cms.forEach((cm, idx) => {
                const assignedCount = allClients.filter(c => (c.cm || '').trim().toLowerCase() === (cm.name || '').trim().toLowerCase()).length;
                
                generatedNodes.push({
                    id: cm.id,
                    type: 'customMember',
                    position: savedLayout[cm.id] || { x: startXCM + (idx * CM_SPACING), y: CM_Y },
                    data: { 
                        label: cm.name || 'Sin Nombre', 
                        role: cm.role || 'Community Manager', 
                        city: cm.city, 
                        salary: cm.salary, 
                        member: cm, 
                        onlineEmails,
                        canvasMode: 'brands',
                        assignedBrandsCount: assignedCount,
                        allClients,
                        onAudit 
                    }
                });
            });

            // 2. Add Brand Nodes
            const totalCols = Math.min(filteredClients.length, BRANDS_PER_ROW) || 1;
            const startXBrand = -((totalCols - 1) * BRAND_SPACING_X) / 2;

            filteredClients.forEach((client, idx) => {
                const row = Math.floor(idx / BRANDS_PER_ROW);
                const col = idx % BRANDS_PER_ROW;
                const nodeId = `brand-${client.id}`;

                // Check if brand matches any CM's niches
                const assignedCM = cms.find(m => (m.name || '').trim().toLowerCase() === (client.cm || '').trim().toLowerCase());
                const isMatched = !!(assignedCM && Array.isArray(assignedCM.niche_affinities) && assignedCM.niche_affinities.some(n => {
                    const key = n.toLowerCase().split('&')[0].trim();
                    const target = `${client.name} ${client.industry || ''} ${client.type || ''}`.toLowerCase();
                    return target.includes(key);
                }));

                generatedNodes.push({
                    id: nodeId,
                    type: 'customBrand',
                    position: savedLayout[nodeId] || { 
                        x: startXBrand + (col * BRAND_SPACING_X), 
                        y: BRAND_START_Y + (row * BRAND_SPACING_Y) 
                    },
                    data: {
                        client,
                        isMatched,
                        onDisconnectBrand: handleDisconnectBrand
                    }
                });

                // Add connection edge if brand has assigned CM
                if (assignedCM) {
                    generatedEdges.push({
                        id: `e-brand-${assignedCM.id}-${client.id}`,
                        source: assignedCM.id,
                        target: nodeId,
                        animated: true,
                        style: { stroke: '#10b981', strokeWidth: 3.5, filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.7))' },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
                    });
                }
            });

            setNodes(generatedNodes);
            setEdges(generatedEdges);
            return;
        }

        // ============================================
        // MODE 2: SQUAD & HIERARCHY CANVAS (Organigrama)
        // ============================================
        const strategists = filteredTeam.filter(m => isEstrategaRole(m.role));
        const creatives = filteredTeam.filter(m => !isEstrategaRole(m.role) && !isCMRole(m.role));

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
                        canvasMode: 'squad',
                        allClients,
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
    }, [team, allClients, onAudit, activeSede, canvasMode, onlineEmails, handleDisconnectBrand]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onNodeDragStop = useCallback((event, node) => {
        // Save coordinates persistently per canvas mode
        const currentSaved = JSON.parse(localStorage.getItem(`diiczone_${canvasMode}_layout`) || '{}');
        currentSaved[node.id] = node.position;
        localStorage.setItem(`diiczone_${canvasMode}_layout`, JSON.stringify(currentSaved));
    }, [canvasMode]);

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(async (params) => {
        // params: { source, target, sourceHandle, targetHandle }
        console.log("🔗 New Edge Connecting:", params, "Mode:", canvasMode);

        // ============================================
        // BRAND ASSIGNMENT CONNECTION (CM -> Brand)
        // ============================================
        if (canvasMode === 'brands' || params.target.startsWith('brand-')) {
            const clientId = params.target.replace('brand-', '');
            const cm = team.find(m => m.id === params.source);
            const client = allClients.find(c => String(c.id) === String(clientId));

            if (!cm) {
                toast.error("Selecciona un Community Manager válido");
                return;
            }

            // Check 5 to 7 brands capacity rule
            const currentCMBrands = allClients.filter(c => (c.cm || '').trim().toLowerCase() === (cm.name || '').trim().toLowerCase());
            if (currentCMBrands.length >= 7) {
                toast.warning(`⚠️ Límite de Capacidad: ${cm.name} ya gestiona ${currentCMBrands.length} marcas (rango recomendado: 5 a 7 marcas).`, {
                    description: "Se ha asignado la marca adicional bajo sobrecarga."
                });
            }

            // Optimistic UI updates
            const newEdge = { 
                ...params, 
                id: `e-brand-${cm.id}-${clientId}`, 
                animated: true, 
                style: { stroke: '#10b981', strokeWidth: 4, filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.8))' }, 
                markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
            };
            
            setEdges((eds) => addEdge(newEdge, eds.filter(e => e.target !== params.target)));

            try {
                await agencyService.assignClientToCM(clientId, cm.name);
                toast.success(`Marca "${client?.name || 'Cliente'}" asignada a ${cm.name} ✨`, {
                    description: `Carga actual: ${currentCMBrands.length + 1}/7 marcas`
                });
                if (refreshTeam) refreshTeam();
            } catch (error) {
                console.error("Brand assignment error:", error);
                toast.error("Error al asignar marca");
            }
            return;
        }

        // ============================================
        // SQUAD HIERARCHY CONNECTION (Leader -> Member)
        // ============================================
        const newEdge = { 
            ...params, 
            id: `e-${params.source}-${params.target}`, 
            animated: true, 
            style: { stroke: '#10b981', strokeWidth: 4, filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.8))' }, 
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
        };
        
        setEdges((eds) => addEdge(newEdge, eds.filter(e => e.target !== params.target || e.source === params.source)));

        try {
            await agencyService.updateTeamMember(params.target, { squad_lead_id: params.source });
            toast.success("Vínculo de Mando Actualizado ✨", {
                description: "La estructura jerárquica ha sido sincronizada en la base central."
            });
            if (refreshTeam) refreshTeam();
        } catch (error) {
            console.error("Link update failed:", error);
            toast.error("Error al establecer el mando");
        }
    }, [canvasMode, team, allClients, refreshTeam]);

    const onEdgeDoubleClick = useCallback(async (event, edge) => {
        try {
            if (edge.id.startsWith('e-brand-') || edge.target.startsWith('brand-')) {
                const clientId = edge.target.replace('brand-', '');
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
                await agencyService.updateClient(clientId, { cm: null });
                toast.success("Marca Desvinculada", {
                    description: "La marca vuelve a estar disponible para asignación."
                });
            } else {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
                await agencyService.updateTeamMember(edge.target, { squad_lead_id: null });
                toast.success("Vínculo Desconectado", {
                    description: "La unidad vuelve a ser independiente."
                });
            }
            if (refreshTeam) refreshTeam();
        } catch (e) {
            toast.error("Error al desconectar");
        }
    }, [refreshTeam]);

    return (
        <div className="w-full h-[820px] bg-[#05050A] rounded-[3rem] border border-white/5 overflow-hidden group/board relative shadow-2xl">
            {/* HUD OVERLAY */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none space-y-4">
                <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-indigo-500 animate-pulse" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.5em] italic">Squad & Brands Canvas</h3>
                </div>

                {/* Canvas Mode Switcher */}
                <div className="flex items-center gap-2 bg-[#0A0A14]/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl">
                    <button
                        onClick={() => setCanvasMode('squad')}
                        className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            canvasMode === 'squad' 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Shield className="w-3.5 h-3.5" /> Escuadras & Jerarquía
                    </button>
                    <button
                        onClick={() => setCanvasMode('brands')}
                        className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            canvasMode === 'brands' 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Globe className="w-3.5 h-3.5" /> Red de Marcas & CMs (5-7)
                    </button>
                </div>
                
                {/* Sede Selectors */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                    {['Todas', 'Santo Domingo', 'Quito', 'Manta'].map(sede => (
                        <button 
                            key={sede}
                            onClick={() => setActiveSede(sede)}
                            className={`px-4 py-2 text-left rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all backdrop-blur-md ${activeSede === sede ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-[#0A0A14]/80 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}
                        >
                            <span className={`inline-block w-2 h-2 rounded-full mr-2.5 ${activeSede === sede ? 'bg-indigo-400 animate-pulse' : 'bg-gray-700'}`}></span>
                            {sede === 'Todas' ? 'Directorio Global' : `Sede ${sede}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Instruction Banner */}
            <div className="absolute top-8 right-8 z-10 pointer-events-none text-right">
                <p className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 border rounded-full backdrop-blur-md shadow-lg ${canvasMode === 'brands' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                    {canvasMode === 'brands' 
                        ? 'Arrastra desde el conector inferior del 🟢 CM hacia la 🔵 Marca (5-7 marcas máx)' 
                        : 'Arrastra el conector de 🟢 Salida hacia 🔴 Entrada'
                    }
                </p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">
                    Doble clic en la línea para Desvincular
                </p>
            </div>

            <div className="relative w-full h-full bg-[#0A0A14]/40 rounded-[3rem] border border-white/5 overflow-hidden group shadow-2xl">
                <ReactFlow
                    key={`flow-${canvasMode}-${activeSede}`}
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
                        showInteractive={false}
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
