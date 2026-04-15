'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, Zap,
    Users, BarChart3, Settings2,
    Activity, Clock, Briefcase,
    Plus, Minus, Info,
    ArrowUpRight, ArrowDownRight,
    RefreshCw, ShieldCheck, Target,
    Calculator, ChevronRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminDynamicPricing() {
    // 1. STATE FOR RULES
    const [rules, setRules] = useState({
        load: { low: 1.0, medium: 1.10, high: 1.25 },
        urgency: { normal: 1.0, fast: 1.20, urgent: 1.40 },
        complexity: { simple: 1.0, medium: 1.20, advanced: 1.35, master: 1.60 },
        niche: { entrepreneur: 1.0, company: 1.15, corporate: 1.25, personal: 1.0 },
        loyalty: { lvl1: 0, lvl2: 5, lvl3: 10, lvl4: 15, lvl5: 20 } // % discount
    });

    // 2. STATE FOR SIMULATOR
    const [sim, setSim] = useState({
        basePrice: 500,
        loadStatus: 'medium',
        urgencyType: 'normal',
        complexityLevel: 'medium',
        nicheType: 'company',
        clientLevel: 'lvl3'
    });

    const [finalPrice, setFinalPrice] = useState(0);

    // 3. PRICING LOGIC
    const calculatePrice = () => {
        let price = sim.basePrice;
        price *= rules.load[sim.loadStatus];
        price *= rules.urgency[sim.urgencyType];
        price *= rules.complexity[sim.complexityLevel];
        price *= rules.niche[sim.nicheType];

        const discount = (price * rules.loyalty[sim.clientLevel]) / 100;
        return price - discount;
    };

    useEffect(() => {
        setFinalPrice(calculatePrice());
    }, [sim, rules]);

    const handleSaveRules = () => {
        toast.success("Reglas de Pricing Inteligente actualizadas correctamente");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* PRICING HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <DollarSign className="w-32 h-32 text-emerald-500" />
                </div>
                <div className="relative z-10 text-left">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-emerald-500" /> Motor de Precios Dinámico
                    </h2>
                    <p className="text-gray-400 text-sm font-medium italic">"Ingresos Optimizados por Demanda & Valor"</p>
                </div>
                <button
                    onClick={handleSaveRules}
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all relative z-10"
                >
                    <Settings2 className="w-4 h-4" /> Guardar Configuración
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CONFIGURATION PANEL */}
                <div className="lg:col-span-2 space-y-8">
                    {/* RULE GROUPS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LOAD RULES */}
                        <RuleSection title="Carga del Equipo" icon={Activity} color="blue">
                            <MultiplierInput label="Baja (0-60%)" value={rules.load.low} onChange={(v) => setRules({ ...rules, load: { ...rules.load, low: v } })} />
                            <MultiplierInput label="Media (61-80%)" value={rules.load.medium} onChange={(v) => setRules({ ...rules, load: { ...rules.load, medium: v } })} />
                            <MultiplierInput label="Alta (81%+)" value={rules.load.high} onChange={(v) => setRules({ ...rules, load: { ...rules.load, high: v } })} isCritical />
                        </RuleSection>

                        {/* URGENCY RULES */}
                        <RuleSection title="Nivel de Urgencia" icon={Clock} color="yellow">
                            <MultiplierInput label="Normal (5-7 días)" value={rules.urgency.normal} onChange={(v) => setRules({ ...rules, urgency: { ...rules.urgency, normal: v } })} />
                            <MultiplierInput label="Rápida (2-3 días)" value={rules.urgency.fast} onChange={(v) => setRules({ ...rules, urgency: { ...rules.urgency, fast: v } })} />
                            <MultiplierInput label="Urgente (24h)" value={rules.urgency.urgent} onChange={(v) => setRules({ ...rules, urgency: { ...rules.urgency, urgent: v } })} />
                        </RuleSection>

                        {/* FIDELITY DISCOUNTS */}
                        <RuleSection title="Descuentos de Fidelidad" icon={Users} color="purple">
                            <MultiplierInput label="Nivel 2 (Explorer)" value={rules.loyalty.lvl2} isPercent onChange={(v) => setRules({ ...rules, loyalty: { ...rules.loyalty, lvl2: v } })} />
                            <MultiplierInput label="Nivel 4 (Legend)" value={rules.loyalty.lvl4} isPercent onChange={(v) => setRules({ ...rules, loyalty: { ...rules.loyalty, lvl4: v } })} />
                            <MultiplierInput label="Nivel 5 (God)" value={rules.loyalty.lvl5} isPercent onChange={(v) => setRules({ ...rules, loyalty: { ...rules.loyalty, lvl5: v } })} />
                        </RuleSection>

                        {/* NICHE ADJUSTMENT */}
                        <RuleSection title="Ajuste por Nicho" icon={Briefcase} color="indigo">
                            <MultiplierInput label="Empresa Media" value={rules.niche.company} onChange={(v) => setRules({ ...rules, niche: { ...rules.niche, company: v } })} />
                            <MultiplierInput label="Corporativo" value={rules.niche.corporate} onChange={(v) => setRules({ ...rules, niche: { ...rules.niche, corporate: v } })} />
                            <MultiplierInput label="Personal/Startup" value={rules.niche.personal} onChange={(v) => setRules({ ...rules, niche: { ...rules.niche, personal: v } })} />
                        </RuleSection>
                    </div>

                    {/* COMPLEXITY RULES - WIDE */}
                    <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 text-left">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Target className="w-4 h-4 text-emerald-400" /> Multiplicadores de Complejidad
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <MultiplierInput label="Simple" value={rules.complexity.simple} onChange={(v) => setRules({ ...rules, complexity: { ...rules.complexity, simple: v } })} />
                            <MultiplierInput label="Intermedio" value={rules.complexity.medium} onChange={(v) => setRules({ ...rules, complexity: { ...rules.complexity, medium: v } })} />
                            <MultiplierInput label="Avanzado" value={rules.complexity.advanced} onChange={(v) => setRules({ ...rules, complexity: { ...rules.complexity, advanced: v } })} />
                            <MultiplierInput label="Maestro" value={rules.complexity.master} onChange={(v) => setRules({ ...rules, complexity: { ...rules.complexity, master: v } })} />
                        </div>
                    </div>
                </div>

                {/* REAL-TIME SIMULATOR */}
                <div className="space-y-6">
                    <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 text-left sticky top-8 overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Calculator className="w-40 h-40 text-white" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-emerald-400" /> Simulador de Cotización
                        </h3>

                        <div className="space-y-6 relative z-10">
                            {/* BASE PRICE */}
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Precio Base ($)</label>
                                <input
                                    type="number"
                                    value={sim.basePrice}
                                    onChange={(e) => setSim({ ...sim, basePrice: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-black text-sm focus:border-emerald-500/50 outline-none transition-all"
                                />
                            </div>

                            {/* SELECTORS */}
                            <SimSelect
                                label="Carga Operativa"
                                value={sim.loadStatus}
                                options={['low', 'medium', 'high']}
                                onChange={(v) => setSim({ ...sim, loadStatus: v })}
                            />
                            <SimSelect
                                label="Urgencia"
                                value={sim.urgencyType}
                                options={['normal', 'fast', 'urgent']}
                                onChange={(v) => setSim({ ...sim, urgencyType: v })}
                            />
                            <SimSelect
                                label="Complejidad"
                                value={sim.complexityLevel}
                                options={['simple', 'medium', 'advanced', 'master']}
                                onChange={(v) => setSim({ ...sim, complexityLevel: v })}
                            />
                            <SimSelect
                                label="Nivel Cliente"
                                value={sim.clientLevel}
                                options={['lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5']}
                                onChange={(v) => setSim({ ...sim, clientLevel: v })}
                            />

                            {/* RESULT */}
                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valor Proyectado</span>
                                    <div className="text-right">
                                        <motion.p
                                            key={finalPrice}
                                            initial={{ scale: 1.1, textShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
                                            animate={{ scale: 1, textShadow: "0 0 0px rgba(16, 185, 129, 0)" }}
                                            className="text-4xl font-black text-emerald-400 leading-none"
                                        >
                                            ${Math.round(finalPrice)}
                                        </motion.p>
                                        <p className="text-[9px] font-bold text-gray-500 mt-1 italic">Incluye ajustes dinámicos</p>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Sparkles className="w-3 h-3 text-emerald-500" /> Generar Oferta PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PRICING INSIGHTS */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] p-8 text-left">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Tip de Rentabilidad
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-bold">
                            "Aumentar el multiplicador de <span className="text-white">Urgencia</span> un 5% adicional compensaría el descuento de fidelidad de clientes Nivel 5 sin afectar la tasa de conversión en proyectos corporativos."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function RuleSection({ title, icon: Icon, color, children }) {
    const colorMap = {
        blue: "text-blue-400",
        yellow: "text-yellow-400",
        purple: "text-purple-400",
        indigo: "text-indigo-400"
    };

    return (
        <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 text-left">
            <h3 className={`text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2 ${colorMap[color]}`}>
                <Icon className="w-4 h-4" /> {title}
            </h3>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}

function MultiplierInput({ label, value, onChange, isCritical, isPercent }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                <span className={`text-[10px] font-black ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isPercent ? `${value}%` : `x${value.toFixed(2)}`}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => onChange(value - (isPercent ? 1 : 0.05))} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-400">
                    <Minus className="w-3 h-3" />
                </button>
                <div className="flex-grow h-1 bg-white/5 rounded-full relative overflow-hidden">
                    <div
                        className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(value / (isPercent ? 50 : 2.5)) * 100}%` }}
                    />
                </div>
                <button onClick={() => onChange(value + (isPercent ? 1 : 0.05))} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-400">
                    <Plus className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

function SimSelect({ label, value, options, onChange }) {
    return (
        <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${value === opt ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
