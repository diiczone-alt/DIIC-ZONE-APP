'use client';

import { useState } from 'react';
import {
    Activity, Users, Zap,
    AlertTriangle, ShieldCheck,
    TrendingUp, BarChart3,
    CheckCircle2, XCircle, Clock,
    Package, LayoutGrid, Cpu,
    PlusCircle, MinusCircle, AlertCircle,
    ArrowUpRight, ShoppingCart, MessageSquare, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { calculateWorkload, getSystemDirectives } from '../connectivity/CapacityEngine';

export default function AdminCapacitySystem({ globalMetrics = {}, teamData = [] }) {
    const [activeTab, setActiveTab] = useState('global');

    // Agregamos la carga real de teamData por rol
    const rolesMap = teamData.reduce((acc, m) => {
        if (!acc[m.role]) {
            acc[m.role] = { role: m.role, current: 0 };
        }
        acc[m.role].current += (m.assigned || 0); // Horas asignadas
        return acc;
    }, {});

    const rawData = Object.values(rolesMap);

    // Si no hay datos (loading), usamos un array vacío
    const capacityStats = rawData.length > 0 
        ? rawData.map(d => calculateWorkload(d.role, d.current))
        : [];
    
    const activeAlerts = getSystemDirectives(capacityStats);

    const getIcon = (roleName) => {
        switch (roleName) {
            case 'Editor de Video': return Cpu;
            case 'Diseñador Gráfico': return LayoutGrid;
            case 'Fotógrafo': return Activity;
            case 'Filmmaker': return TrendingUp;
            case 'Community Manager': return Users;
            default: return Package;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* CAP HEAD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-blue-500/5 border border-blue-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Package className="w-32 h-32 text-blue-500" />
                </div>
                <div className="relative z-10 text-left">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-blue-500" /> Capacidad Operativa (TCS)
                    </h2>
                    <p className="text-gray-400 text-sm font-medium italic">"Monitor de Carga & Límite de Producción DIIC ZONE"</p>
                </div>
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl relative z-10">
                    <TabBtn active={activeTab === 'global'} onClick={() => setActiveTab('global')} label="Vista Global" />
                    <TabBtn active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} label="Alertas Críticas" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ROLE CAPACITY GRID */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {capacityStats.map((stat, i) => (
                            <CapacityCard
                                key={i}
                                role={stat.role}
                                current={stat.current}
                                ideal={stat.limit}
                                unit={stat.unit}
                                icon={getIcon(stat.role)}
                                stats={stat}
                            />
                        ))}
                    </div>
                </div>

                {/* AUTOMATED DECISIONS & ALERTS */}
                <div className="space-y-6">
                    <div className="bg-[#0A0A12] border border-red-500/20 rounded-[40px] p-8 relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <AlertTriangle className="w-24 h-24 text-red-500" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-red-500" /> Decisiones Directivas
                        </h3>

                        <div className="space-y-6">
                            {activeAlerts.length > 0 ? activeAlerts.map((alert, i) => (
                                <DecisionAlert key={i} text={alert.text} type={alert.type} />
                            )) : (
                                <div className="p-5 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs font-bold">
                                    Todos los sistemas operativos dentro de parámetros normales.
                                </div>
                            )}
                        </div>

                        <button className="w-full mt-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                            Gestionar Backup Nodos
                        </button>
                    </div>

                    <div className="bg-emerald-600/5 border border-emerald-500/20 rounded-[40px] p-8 text-left">
                        <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Capacidad de Venta Activa</h3>
                        <div className="space-y-4">
                            <SaleIndicator label="Planes Reels" available={4} />
                            <SaleIndicator label="Branding Express" available={12} />
                            <SaleIndicator label="Web Tech" available={2} />
                            <SaleIndicator label="Full Strategy" available={0} isOut />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {label}
        </button>
    );
}

function CapacityCard({ role, current, ideal, unit, icon: Icon, stats }) {
    // UI Theme Mapping based on status color from engine
    const uiColors = {
        emerald: "text-emerald-400 border-emerald-500/20 shadow-emerald-500/5 bg-emerald-500/10",
        yellow: "text-yellow-400 border-yellow-500/20 shadow-yellow-500/5 bg-yellow-500/10",
        red: "text-red-400 border-red-500/20 shadow-red-500/5 bg-red-500/10",
        rose: "text-rose-400 border-rose-500/20 shadow-rose-500/5 bg-rose-500/10",
        blue: "text-blue-400 border-blue-500/20 shadow-blue-500/5 bg-blue-500/10",
        indigo: "text-indigo-400 border-indigo-500/20 shadow-indigo-500/5 bg-indigo-500/10",
    };

    const cardTheme = uiColors[stats.color] || uiColors['blue'];
    const badgeTheme = uiColors[stats.color];

    return (
        <div className={`bg-[#0A0A12] border rounded-[32px] p-8 transition-all hover:border-white/10 group ${stats.color === 'rose' ? 'border-rose-500/30' : 'border-white/5'}`}>
            <div className="flex justify-between items-start mb-6 text-left">
                <div className={`p-4 rounded-2xl bg-white/5 ${stats.color === 'rose' ? 'text-rose-400' : 'text-gray-400'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${badgeTheme}`}>
                    {stats.label}
                </div>
            </div>

            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 text-left">{role}</h4>
            <div className="flex items-end gap-2 mb-6 text-left">
                <span className="text-3xl font-black text-white leading-none">{current}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">/ {ideal} {unit}</span>
            </div>

            <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.percent}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className={`h-full rounded-full ${stats.color === 'rose' ? 'bg-rose-500' : stats.color === 'red' ? 'bg-red-500' : stats.color === 'yellow' ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    />
                </div>
                <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    <span>Ocupación</span>
                    <span className={stats.percent >= 90 ? 'text-red-400' : 'text-gray-400'}>{stats.percent}%</span>
                </div>
            </div>
        </div>
    );
}

function DecisionAlert({ text, type }) {
    const configs = {
        block: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/5", border: "border-red-500/10" },
        critical: { icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/10" },
        suggest: { icon: BrainCircuit, color: "text-indigo-400", bg: "bg-indigo-500/5", border: "border-indigo-500/10" }
    };

    const config = configs[type] || configs.suggest;

    return (
        <div className={`p-5 rounded-3xl border ${config.bg} ${config.border} flex gap-4 text-left`}>
            <config.icon className={`w-5 h-5 ${config.color} shrink-0`} />
            <p className="text-[10px] font-bold text-gray-300 leading-relaxed italic">"{text}"</p>
        </div>
    );
}

function SaleIndicator({ label, available, isOut }) {
    return (
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[11px] font-bold text-gray-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase ${isOut ? 'text-red-500' : 'text-emerald-400'}`}>
                    {isOut ? 'Agotado' : `${available} Disponibles`}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            </div>
        </div>
    );
}
