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
import { 
    Shield, Users, Zap, Flame, Globe, Building2, 
    Sparkles, ArrowRight, RefreshCw, CheckCircle2, 
    AlertTriangle, Award, Compass, Search, Filter,
    Layers, TrendingUp, Cpu, X
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { presenceService } from '@/services/presenceService';
import { toast } from 'sonner';

// ============================================
// NODE 1: ESTRATEGA DE MARCA (Tier 3 - Lidera hasta 10 Coordinadoras)
// ============================================
const StrategistNode = ({ data, isConnectable }) => {
    const member = data.member || {};
    const liveStatus = useMemo(() => {
        return presenceService.computeStatus(member, data.onlineEmails || new Set());
    }, [member, data.onlineEmails]);

    const coordsCount = data.assignedCoordinatorsCount || 0;
    const maxCoords = 10;
    const satPercent = Math.min((coordsCount / maxCoords) * 100, 100);

    return (
        <div className="relative w-[300px] bg-[#0C0A18]/95 backdrop-blur-2xl border-2 border-amber-500/40 hover:border-amber-400 rounded-[2.2rem] p-6 shadow-[0_0_35px_rgba(245,158,11,0.2)] transition-all duration-300 group">
            {/* Realtime Glow */}
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-amber-500/15 blur-[40px] rounded-full pointer-events-none" />

            {/* Top Tier Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-[8px] font-black uppercase tracking-[0.25em] text-white shadow-lg flex items-center gap-1.5 border border-amber-300/30">
                <CrownIcon className="w-2.5 h-2.5" />
                <span>TIER 3 • ESTRATEGA</span>
            </div>

            {/* Avatar & Header */}
            <div className="flex items-center gap-4 mb-4 pt-2">
                <div className="relative">
                    <div className="w-16 h-16 rounded-[1.3rem] bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-xl">
                        <div className="w-full h-full rounded-[1.2rem] bg-[#080711] flex items-center justify-center text-2xl font-black text-amber-300 italic">
                            {member.name ? member.name.charAt(0).toUpperCase() : 'E'}
                        </div>
                    </div>
                    {/* Pulsating Light */}
                    <div className="absolute -top-1 -right-1 flex items-center justify-center">
                        <span className={`absolute w-5 h-5 rounded-full ${liveStatus.pingClass} opacity-60`} />
                        <span className={`relative w-3.5 h-3.5 rounded-full border-2 border-[#0A0A14] ${liveStatus.dotClass}`} />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-white uppercase italic tracking-tight truncate" title={member.name}>
                        {member.name || 'Estratega'}
                    </h3>
                    <p className="text-[8px] font-bold text-amber-400 uppercase tracking-widest mt-0.5">
                        {member.role || 'Directora de Estrategia'}
                    </p>
                    <span className="text-[8px] text-gray-400 font-mono flex items-center gap-1 mt-1">
                        <Globe className="w-2.5 h-2.5 text-gray-500" /> {member.city || 'Quito'}
                    </span>
                </div>
            </div>

            {/* Capacity Meter (0 a 10 Coordinadoras) */}
            <div className="p-3 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 mb-3">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Coordinadoras a Cargo</span>
                    <span className="text-[9px] font-black text-amber-300 font-mono">{coordsCount} / {maxCoords}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className={`h-full transition-all duration-500 ${coordsCount >= maxCoords ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`} 
                        style={{ width: `${satPercent}%` }} 
                    />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-[7px] font-bold uppercase tracking-wider text-gray-400">
                    <span>{coordsCount === 0 ? 'Disponible' : coordsCount < 8 ? 'Rango Operativo' : 'Capacidad Máxima'}</span>
                    <span className="text-amber-400 font-mono">{Math.round(satPercent)}%</span>
                </div>
            </div>

            {/* Action Details */}
            <button 
                onClick={(e) => { e.stopPropagation(); if (data.onAudit) data.onAudit(member); }}
                className="nodrag w-full py-1.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 text-gray-400 hover:text-amber-300 font-black uppercase text-[8px] tracking-[0.3em] transition-all"
            >
                Ver Expediente
            </button>

            {/* Bottom Handle: Salida (Conecta con Coordinadoras) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                isConnectable={isConnectable} 
                className="w-7 h-7 -bottom-3.5 rounded-full border-[3px] border-[#0A0A14] bg-amber-400 cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_20px_rgba(245,158,11,0.7)] z-50 flex items-center justify-center" 
            >
                <div className="w-2 h-2 rounded-full bg-black animate-ping" />
            </Handle>
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-amber-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                CONECTAR CON COORDINADORA
            </div>
        </div>
    );
};

// ============================================
// NODE 2: COORDINADORA DE CONTENIDO (Tier 2 - Lidera 4 CMs | 7 a 12 marcas supervisadas)
// ============================================
const CoordinatorNode = ({ data, isConnectable }) => {
    const member = data.member || {};
    const liveStatus = useMemo(() => {
        return presenceService.computeStatus(member, data.onlineEmails || new Set());
    }, [member, data.onlineEmails]);

    const cmsCount = data.assignedCMsCount || 0;
    const maxCMs = 4;
    const podBrandsCount = data.podBrandsCount || 0;
    const satPercent = Math.min((cmsCount / maxCMs) * 100, 100);

    return (
        <div className="relative w-[300px] bg-[#0D0B1C]/95 backdrop-blur-2xl border-2 border-purple-500/40 hover:border-purple-400 rounded-[2.2rem] p-6 shadow-[0_0_35px_rgba(168,85,247,0.2)] transition-all duration-300 group">
            {/* Top Handle: Entrada (Recibe mando de la Estratega) */}
            <Handle 
                type="target" 
                position={Position.Top} 
                isConnectable={isConnectable} 
                className="w-6 h-6 -top-3 rounded-full border-[3px] border-[#0A0A14] bg-amber-400 cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_15px_rgba(245,158,11,0.6)] z-50 flex items-center justify-center" 
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-amber-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                VINCULADA A ESTRATEGA
            </div>

            {/* Top Tier Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[8px] font-black uppercase tracking-[0.25em] text-white shadow-lg flex items-center gap-1.5 border border-purple-300/30">
                <Shield className="w-2.5 h-2.5" />
                <span>TIER 2 • COORDINADORA</span>
            </div>

            {/* Avatar & Header */}
            <div className="flex items-center gap-4 mb-4 pt-2">
                <div className="relative">
                    <div className="w-16 h-16 rounded-[1.3rem] bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-600 p-0.5 shadow-xl">
                        <div className="w-full h-full rounded-[1.2rem] bg-[#080711] flex items-center justify-center text-2xl font-black text-purple-300 italic">
                            {member.name ? member.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                    </div>
                    {/* Pulsating Light */}
                    <div className="absolute -top-1 -right-1 flex items-center justify-center">
                        <span className={`absolute w-5 h-5 rounded-full ${liveStatus.pingClass} opacity-60`} />
                        <span className={`relative w-3.5 h-3.5 rounded-full border-2 border-[#0A0A14] ${liveStatus.dotClass}`} />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-white uppercase italic tracking-tight truncate" title={member.name}>
                        {member.name || 'Coordinadora'}
                    </h3>
                    <p className="text-[8px] font-bold text-purple-300 uppercase tracking-widest mt-0.5">
                        Coordinadora de Contenido
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] text-gray-400 font-mono flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5 text-gray-500" /> {member.city || 'Quito'}
                        </span>
                        {member.squad_lead_id && (
                            <span className="text-[7px] font-black text-amber-400 uppercase tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                👑 Estratega OK
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Capacity Grid: CMs a cargo (Max 4) & Marcas en Célula (7 a 12+) */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-purple-500/[0.08] border border-purple-500/20">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">CMs Liderados</span>
                        <span className={`text-[9px] font-black font-mono ${cmsCount >= maxCMs ? 'text-amber-400' : 'text-purple-300'}`}>{cmsCount}/{maxCMs}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${cmsCount >= maxCMs ? 'bg-amber-400' : 'bg-purple-500'}`} style={{ width: `${satPercent}%` }} />
                    </div>
                    <span className="text-[6.5px] font-black uppercase tracking-wider text-purple-300 mt-1 block">
                        {cmsCount === maxCMs ? 'Célula Completa' : `${maxCMs - cmsCount} cupos libres`}
                    </span>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/20">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Marcas Célula</span>
                        <span className="text-[9px] font-black font-mono text-cyan-400">{podBrandsCount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${Math.min((podBrandsCount / 20) * 100, 100)}%` }} />
                    </div>
                    <span className="text-[6.5px] font-black uppercase tracking-wider text-cyan-300 mt-1 block">
                        Supervisión Activa
                    </span>
                </div>
            </div>

            {/* Action Details */}
            <button 
                onClick={(e) => { e.stopPropagation(); if (data.onAudit) data.onAudit(member); }}
                className="nodrag w-full py-1.5 rounded-xl bg-white/[0.03] hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-gray-400 hover:text-purple-300 font-black uppercase text-[8px] tracking-[0.3em] transition-all"
            >
                Ver Célula
            </button>

            {/* Bottom Handle: Salida (Conecta con CMs) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                isConnectable={isConnectable} 
                className="w-7 h-7 -bottom-3.5 rounded-full border-[3px] border-[#0A0A14] bg-purple-400 cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_20px_rgba(168,85,247,0.7)] z-50 flex items-center justify-center" 
            >
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </Handle>
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-purple-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                CONECTAR CON COMMUNITY MANAGER
            </div>
        </div>
    );
};

// ============================================
// NODE 3: COMMUNITY MANAGER (Tier 1 - Gestiona 5 a 7 Marcas Directas)
// ============================================
const CMNode = ({ data, isConnectable }) => {
    const member = data.member || {};
    const liveStatus = useMemo(() => {
        return presenceService.computeStatus(member, data.onlineEmails || new Set());
    }, [member, data.onlineEmails]);

    const brandsCount = data.assignedBrandsCount || 0;
    const niches = Array.isArray(member.niche_affinities) ? member.niche_affinities : [];

    // Capacity Logic: 5 to 7 brands
    const getCapacityInfo = (count) => {
        if (count === 0) return { label: '0/7 (Sin Marcas)', color: 'text-gray-400', barBg: 'bg-gray-600', badge: '⚡ Junior / En Espera', rankBg: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
        if (count <= 4) return { label: `${count}/7 (Baja Carga)`, color: 'text-cyan-400', barBg: 'bg-cyan-500', badge: '⚡ CM Operativo', rankBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
        if (count <= 6) return { label: `${count}/7 (Rango 5-7 Óptimo)`, color: 'text-emerald-400', barBg: 'bg-emerald-500 shadow-[0_0_8px_#10b981]', badge: '🟢 CM Titular Pro', rankBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
        if (count === 7) return { label: `7/7 (Límite Máximo)`, color: 'text-amber-400', barBg: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]', badge: '👑 Candidato a Coordinadora', rankBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        return { label: `${count}/7 (⚠️ Sobrecargado)`, color: 'text-rose-500', barBg: 'bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]', badge: '🔴 Saturado (Ascender)', rankBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    };

    const capInfo = getCapacityInfo(brandsCount);
    const progressPercent = Math.min((brandsCount / 7) * 100, 100);

    return (
        <div className={`relative w-[290px] bg-[#0A0A16]/95 backdrop-blur-2xl border-2 ${brandsCount >= 7 ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.25)]' : 'border-indigo-500/40 hover:border-indigo-400'} rounded-[2.2rem] p-6 shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-300 group`}>
            {/* Top Handle: Entrada (Recibe mando de Coordinadora) */}
            <Handle 
                type="target" 
                position={Position.Top} 
                isConnectable={isConnectable} 
                className="w-6 h-6 -top-3 rounded-full border-[3px] border-[#0A0A14] bg-purple-400 cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_15px_rgba(168,85,247,0.6)] z-50 flex items-center justify-center" 
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-purple-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                VINCULAR A COORDINADORA
            </div>

            {/* Top Status Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center gap-1.5 border border-indigo-300/30">
                <Zap className="w-2.5 h-2.5 text-cyan-300" />
                <span>TIER 1 • CM</span>
            </div>

            {/* Avatar & Identidad */}
            <div className="flex items-center gap-4 mb-3 pt-2">
                <div className="relative">
                    <div className="w-15 h-15 rounded-[1.2rem] bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-500 p-0.5 shadow-xl">
                        <div className="w-full h-full rounded-[1.1rem] bg-[#070714] flex items-center justify-center text-xl font-black text-cyan-300 italic">
                            {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                    {/* Pulsating Light */}
                    <div className="absolute -top-1 -right-1 flex items-center justify-center">
                        <span className={`absolute w-5 h-5 rounded-full ${liveStatus.pingClass} opacity-60`} />
                        <span className={`relative w-3.5 h-3.5 rounded-full border-2 border-[#0A0A14] ${liveStatus.dotClass}`} />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-white uppercase italic tracking-tight truncate" title={member.name}>
                        {member.name || 'CM Talento'}
                    </h3>
                    <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest truncate">
                        Community Manager
                    </p>
                    <span className="text-[8px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                        <Globe className="w-2.5 h-2.5 text-gray-500" /> {member.city || 'Santo Domingo'}
                    </span>
                </div>
            </div>

            {/* Rank / Progression Badge */}
            <div className="mb-3 flex items-center justify-between">
                <span className={`text-[7.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${capInfo.rankBg}`}>
                    {capInfo.badge}
                </span>
                {member.onboarding_quiz_score && (
                    <span className="text-[7.5px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                        Quiz {member.onboarding_quiz_score}%
                    </span>
                )}
            </div>

            {/* 5-7 Brands Capacity Meter */}
            <div className="p-3 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/20 mb-3">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Capacidad Marcas (5-7)</span>
                    <span className={`text-[9px] font-black font-mono ${capInfo.color}`}>{capInfo.label}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className={`h-full transition-all duration-500 ${capInfo.barBg}`} 
                        style={{ width: `${progressPercent}%` }} 
                    />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-[7px] font-bold uppercase tracking-wider">
                    <span className="text-gray-400">Meta: 5 a 7 marcas</span>
                    <span className={brandsCount >= 5 && brandsCount <= 7 ? 'text-emerald-400 font-black' : 'text-gray-500'}>
                        {brandsCount >= 5 && brandsCount <= 7 ? '🎯 Rango Saludable' : brandsCount > 7 ? '⚠️ Sobrecarga' : 'Disponibilidad'}
                    </span>
                </div>
            </div>

            {/* Secondary Specialty / Niches */}
            {member.secondary_profession && (
                <p className="text-[7.5px] text-cyan-300 italic font-medium mb-2 truncate px-1" title={member.secondary_profession}>
                    ✨ {member.secondary_profession}
                </p>
            )}

            {niches.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3 px-1">
                    {niches.slice(0, 3).map((n, i) => (
                        <span key={i} className="text-[6.5px] font-bold uppercase bg-white/[0.04] text-gray-300 border border-white/10 px-2 py-0.5 rounded-md truncate max-w-[80px]">
                            {n}
                        </span>
                    ))}
                    {niches.length > 3 && <span className="text-[6.5px] text-gray-500 font-bold">+{niches.length - 3}</span>}
                </div>
            )}

            {/* Action Details */}
            <button 
                onClick={(e) => { e.stopPropagation(); if (data.onAudit) data.onAudit(member); }}
                className="nodrag w-full py-1.5 rounded-xl bg-white/[0.03] hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-gray-400 hover:text-cyan-300 font-black uppercase text-[8px] tracking-[0.3em] transition-all"
            >
                Ver Portafolio / Info
            </button>

            {/* Bottom Handle: Salida (Conecta con Marcas) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                isConnectable={isConnectable} 
                className="w-7 h-7 -bottom-3.5 rounded-full border-[3px] border-[#0A0A14] bg-cyan-400 cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_20px_rgba(34,211,238,0.7)] z-50 flex items-center justify-center" 
            >
                <div className="w-2 h-2 rounded-full bg-black animate-ping" />
            </Handle>
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-cyan-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ARRASTRAR PARA ASIGNAR MARCA
            </div>
        </div>
    );
};

// ============================================
// NODE 4: MARCA / CLIENTE (Base)
// ============================================
const BrandNode = ({ data, isConnectable }) => {
    const client = data.client || {};
    const hasCM = !!client.cm;
    const isMatched = data.isMatched;

    return (
        <div className={`relative w-[270px] bg-[#090914]/95 backdrop-blur-2xl border-2 ${isMatched ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : hasCM ? 'border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]'} rounded-[2.2rem] p-5 flex flex-col group transition-all duration-300`}>
            {/* Top Handle: Entrada para recibir asignación del CM */}
            <Handle 
                type="target" 
                position={Position.Top} 
                isConnectable={isConnectable} 
                className="w-7 h-7 -top-3.5 rounded-full border-[3px] border-[#0A0A14] bg-cyan-400 cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-50 flex items-center justify-center" 
            >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </Handle>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-cyan-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                CONECTAR CM AQUÍ
            </div>

            {/* Smart Match Badge */}
            {isMatched && (
                <div className="absolute -top-3 right-4 z-30 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[7.5px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 backdrop-blur-md animate-pulse">
                    ✨ Match Nicho
                </div>
            )}

            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-3 pt-1">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg flex-shrink-0">
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
                    <span className="text-[7.5px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                        <Globe className="w-2.5 h-2.5 text-gray-400" /> {client.city || 'Quito'}
                    </span>
                </div>
            </div>

            {/* Assignment Status Box */}
            <div className={`p-3 rounded-2xl border mb-3 flex items-center justify-between ${hasCM ? 'bg-indigo-500/10 border-indigo-500/25' : 'bg-amber-500/10 border-amber-500/25'}`}>
                <div className="min-w-0 flex-1 mr-2">
                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 block">CM Asignado</span>
                    <span className={`text-[9.5px] font-black uppercase truncate block ${hasCM ? 'text-indigo-300' : 'text-amber-400 animate-pulse'}`}>
                        {hasCM ? `👤 ${client.cm}` : '⚠️ Sin Asignar'}
                    </span>
                </div>
                {hasCM && data.onDisconnectBrand && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onDisconnectBrand(client.id, client.name);
                        }}
                        className="nodrag px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg border border-rose-500/20 text-[7px] font-black uppercase transition-all"
                        title="Desvincular CM"
                    >
                        Liberar
                    </button>
                )}
            </div>

            <div className="text-[7.5px] text-center font-bold uppercase tracking-widest">
                {hasCM ? <span className="text-emerald-400">🟢 Marca en Operación</span> : <span className="text-cyan-400 animate-pulse">🔵 Arrastra un CM arriba</span>}
            </div>
        </div>
    );
};

const nodeTypes = { 
    strategistNode: StrategistNode,
    coordinatorNode: CoordinatorNode,
    cmNode: CMNode,
    brandNode: BrandNode 
};

// ============================================
// CROWN ICON COMPONENT
// ============================================
function CrownIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
    );
}

// ============================================
// MAIN COMPONENT: BRANDS MATRIX BOARD
// ============================================
export default function BrandsMatrixBoard({ team = [], allClients = [], onAudit, refreshTeam }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [activeSede, setActiveSede] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');
    const [onlineEmails, setOnlineEmails] = useState(new Set());

    // Subscribe to presence
    useEffect(() => {
        const unsubscribe = presenceService.subscribe((emailsSet) => {
            setOnlineEmails(emailsSet);
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // Filtered data by Sede and Search
    const filteredTeam = useMemo(() => {
        return team.filter(m => {
            const matchesSede = activeSede === 'Todas' || (m.city || '').toLowerCase().trim() === activeSede.toLowerCase().trim();
            const matchesSearch = !searchQuery || (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (m.role || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSede && matchesSearch;
        });
    }, [team, activeSede, searchQuery]);

    const filteredClients = useMemo(() => {
        return allClients.filter(c => {
            const matchesSede = activeSede === 'Todas' || (c.city || '').toLowerCase().trim() === activeSede.toLowerCase().trim();
            const matchesSearch = !searchQuery || (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.industry || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.cm || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSede && matchesSearch;
        });
    }, [allClients, activeSede, searchQuery]);

    // Disconnect Brand callback
    const handleDisconnectBrand = useCallback(async (clientId, clientName) => {
        try {
            await agencyService.updateClient(clientId, { cm: null });
            toast.success(`Marca "${clientName}" desvinculada.`);
            if (refreshTeam) refreshTeam();
        } catch (e) {
            console.error(e);
            toast.error("Error al desvincular marca");
        }
    }, [refreshTeam]);

    // Build Hierarchy Nodes & Edges
    useEffect(() => {
        if (!team || team.length === 0) {
            setNodes([]);
            setEdges([]);
            return;
        }

        const generatedNodes = [];
        const generatedEdges = [];
        const savedLayout = JSON.parse(localStorage.getItem('diiczone_brands_matrix_layout') || '{}');

        // Identify roles
        const isEstratega = (r) => {
            const role = (r || '').toLowerCase();
            return role.includes('estratega') || role.includes('director') || role.includes('lider de estrategia');
        };

        const isCoordinadora = (r) => {
            const role = (r || '').toLowerCase();
            return role.includes('coordinador') || role.includes('lead') || role.includes('team lead');
        };

        const isCM = (r) => {
            const role = (r || '').toLowerCase();
            return role.includes('community manager') || role.includes('cm') || role.includes('social media');
        };

        const strategists = filteredTeam.filter(m => isEstratega(m.role));
        let coordinators = filteredTeam.filter(m => isCoordinadora(m.role));
        let cms = filteredTeam.filter(m => isCM(m.role) && !isCoordinadora(m.role));

        // If no explicit coordinator exists yet, treat CMs with >= 7 brands or squad leads as potential Coordinators
        if (coordinators.length === 0 && cms.length > 2) {
            const potentialLead = cms.find(cm => allClients.filter(c => (c.cm || '').toLowerCase() === (cm.name || '').toLowerCase()).length >= 7 || cm.name.toLowerCase().includes('leslie') || cm.name.toLowerCase().includes('andrea'));
            if (potentialLead) {
                coordinators = [potentialLead];
                cms = cms.filter(m => m.id !== potentialLead.id);
            }
        }

        // Layout Constants
        const STRATEGIST_Y = 50;
        const COORDINATOR_Y = 460;
        const CM_Y = 900;
        const BRAND_Y = 1420;

        const STRATEGIST_SPACING = 450;
        const COORDINATOR_SPACING = 380;
        const CM_SPACING = 340;
        const BRAND_SPACING_X = 300;
        const BRAND_SPACING_Y = 250;
        const BRANDS_PER_ROW = Math.max(4, Math.ceil(Math.sqrt(filteredClients.length * 1.8)));

        // 1. Generate Strategist Nodes
        const startXStrategists = -((strategists.length - 1) * STRATEGIST_SPACING) / 2;
        strategists.forEach((strat, idx) => {
            const assignedCoords = coordinators.filter(c => c.squad_lead_id === strat.id);
            generatedNodes.push({
                id: strat.id,
                type: 'strategistNode',
                position: savedLayout[strat.id] || { x: startXStrategists + (idx * STRATEGIST_SPACING), y: STRATEGIST_Y },
                data: {
                    member: strat,
                    assignedCoordinatorsCount: assignedCoords.length,
                    onlineEmails,
                    onAudit
                }
            });
        });

        // 2. Generate Coordinator Nodes
        const startXCoords = -((coordinators.length - 1) * COORDINATOR_SPACING) / 2;
        coordinators.forEach((coord, idx) => {
            const assignedCMs = cms.filter(cm => cm.squad_lead_id === coord.id);
            const podCMNames = new Set([coord.name, ...assignedCMs.map(c => c.name)].map(n => (n || '').toLowerCase()));
            const podBrands = allClients.filter(c => podCMNames.has((c.cm || '').toLowerCase()));

            generatedNodes.push({
                id: coord.id,
                type: 'coordinatorNode',
                position: savedLayout[coord.id] || { x: startXCoords + (idx * COORDINATOR_SPACING), y: COORDINATOR_Y },
                data: {
                    member: coord,
                    assignedCMsCount: assignedCMs.length,
                    podBrandsCount: podBrands.length,
                    onlineEmails,
                    onAudit
                }
            });

            // Edge from Strategist to Coordinator
            if (coord.squad_lead_id) {
                generatedEdges.push({
                    id: `e-strat-${coord.squad_lead_id}-${coord.id}`,
                    source: coord.squad_lead_id,
                    target: coord.id,
                    animated: true,
                    style: { stroke: '#f59e0b', strokeWidth: 3.5, filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.6))' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
                });
            }
        });

        // 3. Generate CM Nodes
        const startXCMs = -((cms.length - 1) * CM_SPACING) / 2;
        cms.forEach((cm, idx) => {
            const assignedBrands = allClients.filter(c => (c.cm || '').trim().toLowerCase() === (cm.name || '').trim().toLowerCase());
            generatedNodes.push({
                id: cm.id,
                type: 'cmNode',
                position: savedLayout[cm.id] || { x: startXCMs + (idx * CM_SPACING), y: CM_Y },
                data: {
                    member: cm,
                    assignedBrandsCount: assignedBrands.length,
                    onlineEmails,
                    onAudit
                }
            });

            // Edge from Coordinator to CM
            if (cm.squad_lead_id) {
                generatedEdges.push({
                    id: `e-coord-${cm.squad_lead_id}-${cm.id}`,
                    source: cm.squad_lead_id,
                    target: cm.id,
                    animated: true,
                    style: { stroke: '#a855f7', strokeWidth: 3, filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.6))' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
                });
            }
        });

        // 4. Generate Brand Nodes
        const totalCols = Math.min(filteredClients.length, BRANDS_PER_ROW) || 1;
        const startXBrands = -((totalCols - 1) * BRAND_SPACING_X) / 2;

        filteredClients.forEach((client, idx) => {
            const row = Math.floor(idx / BRANDS_PER_ROW);
            const col = idx % BRANDS_PER_ROW;
            const nodeId = `brand-${client.id}`;

            const assignedCM = [...cms, ...coordinators].find(m => (m.name || '').trim().toLowerCase() === (client.cm || '').trim().toLowerCase());
            const isMatched = !!(assignedCM && Array.isArray(assignedCM.niche_affinities) && assignedCM.niche_affinities.some(n => {
                const key = n.toLowerCase().split('&')[0].trim();
                const target = `${client.name} ${client.industry || ''} ${client.type || ''}`.toLowerCase();
                return target.includes(key);
            }));

            generatedNodes.push({
                id: nodeId,
                type: 'brandNode',
                position: savedLayout[nodeId] || { 
                    x: startXBrands + (col * BRAND_SPACING_X), 
                    y: BRAND_Y + (row * BRAND_SPACING_Y) 
                },
                data: {
                    client,
                    isMatched,
                    onDisconnectBrand: handleDisconnectBrand
                }
            });

            // Edge from CM to Brand
            if (assignedCM) {
                generatedEdges.push({
                    id: `e-brand-${assignedCM.id}-${client.id}`,
                    source: assignedCM.id,
                    target: nodeId,
                    animated: true,
                    style: { stroke: '#22d3ee', strokeWidth: 3, filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.7))' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
                });
            }
        });

        setNodes(generatedNodes);
        setEdges(generatedEdges);
    }, [filteredTeam, filteredClients, allClients, onlineEmails, handleDisconnectBrand, onAudit]);

    // Handle Connections Drag-and-Drop
    const onConnect = useCallback(async (params) => {
        const { source, target } = params;
        if (!source || !target) return;

        // CASE A: Connect CM ➔ Brand
        if (target.startsWith('brand-')) {
            const clientId = target.replace('brand-', '');
            const sourceMember = team.find(m => m.id === source);
            const client = allClients.find(c => c.id === clientId);

            if (!sourceMember || !client) {
                toast.error("Error al identificar talento o marca");
                return;
            }

            const currentCount = allClients.filter(c => (c.cm || '').toLowerCase() === sourceMember.name.toLowerCase()).length;
            if (currentCount >= 7) {
                toast.warning(`⚠️ ${sourceMember.name} ya tiene ${currentCount} marcas (Límite Máximo). Revisa si es momento de ascenderlo a Coordinadora.`);
            }

            try {
                await agencyService.updateClient(clientId, { cm: sourceMember.name });
                toast.success(`Marca "${client.name}" asignada a ${sourceMember.name}`);
                if (refreshTeam) refreshTeam();
            } catch (err) {
                console.error(err);
                toast.error("Error al asignar marca en la base de datos");
            }
            return;
        }

        // CASE B: Connect Estratega ➔ Coordinadora OR Coordinadora ➔ CM
        const sourceMember = team.find(m => m.id === source);
        const targetMember = team.find(m => m.id === target);

        if (sourceMember && targetMember) {
            try {
                await agencyService.updateTeamMember(targetMember.id, { squad_lead_id: sourceMember.id });
                toast.success(`${targetMember.name} vinculado bajo el liderazgo de ${sourceMember.name}`);
                if (refreshTeam) refreshTeam();
            } catch (err) {
                console.error(err);
                toast.error("Error al actualizar jerarquía en el servidor");
            }
        }
    }, [team, allClients, refreshTeam]);

    // Handle Edge Double Click to Disconnect
    const onEdgeDoubleClick = useCallback(async (event, edge) => {
        event.stopPropagation();
        if (edge.target.startsWith('brand-')) {
            const clientId = edge.target.replace('brand-', '');
            const client = allClients.find(c => c.id === clientId);
            try {
                await agencyService.updateClient(clientId, { cm: null });
                toast.success(`Marca "${client?.name || 'Cliente'}" desvinculada`);
                if (refreshTeam) refreshTeam();
            } catch (e) {
                toast.error("Error al desvincular");
            }
        } else {
            const targetMember = team.find(m => m.id === edge.target);
            if (targetMember) {
                try {
                    await agencyService.updateTeamMember(targetMember.id, { squad_lead_id: null });
                    toast.success(`Jerarquía de ${targetMember.name} liberada`);
                    if (refreshTeam) refreshTeam();
                } catch (e) {
                    toast.error("Error al liberar");
                }
            }
        }
    }, [allClients, team, refreshTeam]);

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => {
            const next = applyNodeChanges(changes, nds);
            const layout = {};
            next.forEach(n => {
                if (n.position) layout[n.id] = n.position;
            });
            localStorage.setItem('diiczone_brands_matrix_layout', JSON.stringify(layout));
            return next;
        });
    }, []);

    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    // Reset Layout
    const handleResetLayout = () => {
        localStorage.removeItem('diiczone_brands_matrix_layout');
        if (refreshTeam) refreshTeam();
        toast.info("Posiciones re-alineadas a la cuadrícula por niveles");
    };

    // Global Stats Computation
    const stats = useMemo(() => {
        const totalBrands = allClients.length;
        const assignedBrands = allClients.filter(c => !!c.cm).length;
        const unassignedBrands = totalBrands - assignedBrands;
        
        const cms = team.filter(m => (m.role || '').toLowerCase().includes('cm') || (m.role || '').toLowerCase().includes('community'));
        const optimalCMs = cms.filter(cm => {
            const count = allClients.filter(c => (c.cm || '').toLowerCase() === cm.name.toLowerCase()).length;
            return count >= 5 && count <= 7;
        }).length;

        const coords = team.filter(m => (m.role || '').toLowerCase().includes('coord') || (m.role || '').toLowerCase().includes('lead'));
        const strategists = team.filter(m => (m.role || '').toLowerCase().includes('estratega'));

        return {
            totalBrands,
            assignedBrands,
            unassignedBrands,
            optimalCMs,
            totalCMs: cms.length,
            totalCoords: coords.length,
            totalStrategists: strategists.length
        };
    }, [team, allClients]);

    return (
        <div className="space-y-6">
            {/* Top Control Bar & KPIs */}
            <div className="p-6 rounded-[2.5rem] bg-[#0A0A18]/90 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-2.5 h-2.5" /> RED INTEGRAL DE MARCAS & TALENTO
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Jerarquía Operativa 2026
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                        Matriz de Marcas & Ecosistema CM
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                        Conecta Estrategas (hasta 10 coords) ➔ Coordinadoras (4 CMs) ➔ Community Managers (5-7 marcas) ➔ Clientes.
                    </p>
                </div>

                {/* Sede Selector & Search */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 xl:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar Marca o CM..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-medium focus:outline-none focus:border-cyan-400 transition-all"
                        />
                    </div>

                    {/* Sede Buttons */}
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        {['Todas', 'Santo Domingo', 'Quito', 'Manta'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setActiveSede(s)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                                    activeSede === s ? 'bg-cyan-500 text-black shadow-lg font-black' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Reset Layout */}
                    <button
                        onClick={handleResetLayout}
                        className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 active:scale-95"
                        title="Reorganizar cuadrícula"
                    >
                        <RefreshCw className="w-3 h-3" /> Auto-Alinear
                    </button>
                </div>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total Marcas</span>
                    <span className="text-2xl font-black text-white font-mono">{stats.totalBrands}</span>
                    <span className="text-[7.5px] text-gray-400 block mt-1">En Portafolio Global</span>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/[0.05] border border-cyan-500/20 backdrop-blur-md">
                    <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Asignadas Activas</span>
                    <span className="text-2xl font-black text-cyan-300 font-mono">{stats.assignedBrands}</span>
                    <span className="text-[7.5px] text-cyan-400/80 block mt-1">En Producción Diaria</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 backdrop-blur-md">
                    <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block mb-1">Marcas Huérfanas</span>
                    <span className="text-2xl font-black text-amber-300 font-mono">{stats.unassignedBrands}</span>
                    <span className="text-[7.5px] text-amber-400/80 block mt-1">Sin CM Asignado</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 backdrop-blur-md">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block mb-1">CMs en Rango Óptimo</span>
                    <span className="text-2xl font-black text-emerald-300 font-mono">{stats.optimalCMs} <span className="text-xs text-gray-500">/ {stats.totalCMs}</span></span>
                    <span className="text-[7.5px] text-emerald-400/80 block mt-1">Carga 5 a 7 Marcas</span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/[0.05] border border-purple-500/20 backdrop-blur-md col-span-2 md:col-span-1">
                    <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest block mb-1">Coordinadoras / Células</span>
                    <span className="text-2xl font-black text-purple-300 font-mono">{stats.totalCoords} <span className="text-xs text-amber-400">({stats.totalStrategists} Estr.)</span></span>
                    <span className="text-[7.5px] text-purple-400/80 block mt-1">Supervisión Editorial</span>
                </div>
            </div>

            {/* Interactive React Flow Canvas */}
            <div className="relative w-full h-[850px] bg-[#04040A] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                {/* Visual Level Legends */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">NIVELES JERÁRQUICOS</div>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-amber-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" /> TIER 3: Estrategas (0/10 Coordinadoras)
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-purple-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" /> TIER 2: Coordinadoras (0/4 CMs | 7-12 Marcas)
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-cyan-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> TIER 1: Community Managers (5 a 7 Marcas)
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-emerald-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" /> BASE: Marcas & Clientes Activos
                    </div>
                </div>

                {/* Canvas Help Hint */}
                <div className="absolute top-6 right-6 z-20 bg-black/60 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md text-[8px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Arrastra el conector para enlazar • Doble clic para desvincular
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onEdgeDoubleClick={onEdgeDoubleClick}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.15}
                    maxZoom={1.5}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.65 }}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background color="#1A1A2E" gap={28} size={1.5} />
                    <Controls className="!bg-[#0A0A14] !border-white/10 !rounded-2xl !p-1 !text-white overflow-hidden shadow-2xl" />
                </ReactFlow>
            </div>
        </div>
    );
}
