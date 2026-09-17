'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Compass, Star, Zap, Rocket, CheckCircle2, Target, Video, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { NICHE_DETAILS, mapIndustryToNicheKey } from '@/lib/nicheDetails';
import { toast } from 'sonner';

export default function ClientGrowthLevel({ initialLevel = 'presencia', clientId: propClientId }) {
    const { user } = useAuth();
    const clientId = propClientId || user?.client_id || 1;
    const [currentLevel, setCurrentLevel] = useState(initialLevel);
    const [clientData, setClientData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadLevel = async () => {
            if (!clientId) return;
            const client = await agencyService.getClientById(clientId);
            if (client) {
                setClientData(client);
                if (client.metadata?.maturity_level) {
                    setCurrentLevel(client.metadata.maturity_level);
                } else if (client.plan) {
                    const p = client.plan.toLowerCase();
                    if (p.includes('presencia')) setCurrentLevel('presence');
                    else if (p.includes('estrategia') || p.includes('crecimiento')) setCurrentLevel('growth');
                    else if (p.includes('marca') || p.includes('autoridad')) setCurrentLevel('authority');
                    else if (p.includes('automatizacion') || p.includes('control') || p.includes('elite')) setCurrentLevel('elite');
                    else if (p.includes('escala')) setCurrentLevel('scale');
                }
            }
        };
        loadLevel();
    }, [clientId]);

    const nicheKey = mapIndustryToNicheKey(clientData?.industry || clientData?.specialty || clientData?.niche);
    const nicheData = NICHE_DETAILS[nicheKey] || NICHE_DETAILS.general;
    const nichePlans = nicheData?.plans || NICHE_DETAILS.general.plans;

    const nicheLabels = {
        'medical': 'Marketing Médico & Salud',
        'doctor': 'Marketing Médico & Especialidades',
        'health': 'Marketing Hospitalario & Clínicas',
        'agro': 'Sector Agropecuario & Ganadería',
        'horeca': 'Gastronomía & Restaurantes',
        'legal': 'Sector Jurídico & Despachos',
        'realestate': 'Bienes Raíces & Inmobiliarias',
        'education': 'Educación & Academias',
        'tech': 'Empresas Tech & SaaS',
        'general': 'Marcas & Empresas Generales'
    };

    const currentNicheLabel = nicheLabels[nicheKey] || nicheLabels['general'];

    const LEVEL_ICONS = {
        presence: { icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        growth: { icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        authority: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        elite: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        scale: { icon: Rocket, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' }
    };

    const levelsList = Object.entries(nichePlans).map(([key, plan]) => {
        const style = LEVEL_ICONS[key] || LEVEL_ICONS.presence;
        return {
            id: key,
            title: plan.name,
            price: plan.price === '0' || !plan.price ? 'Personalizado' : (isNaN(Number(plan.price)) ? plan.price : Number(plan.price)),
            icon: style.icon,
            color: style.color,
            bg: style.bg,
            border: style.border,
            desc: plan.narrative || plan.enfoque || '',
            enfoque: plan.enfoque || '',
            complexity: plan.complexity || 'Estándar',
            filmmaker: plan.filmmaker || '',
            deliverables: plan.deliverables || null,
            focusAreas: plan.features || []
        };
    });

    const handleSelect = async (id) => {
        setCurrentLevel(id);
    };

    const handleSaveLevel = async () => {
        setIsSaving(true);
        try {
            const selectedLevelObj = levelsList.find(l => l.id === currentLevel) || levelsList[0];
            const planPriceNum = typeof selectedLevelObj.price === 'number' ? selectedLevelObj.price : 0;
            
            await agencyService.updateClient(clientId, {
                metadata: {
                    ...(clientData?.metadata || {}),
                    maturity_level: currentLevel
                },
                plan: selectedLevelObj.title,
                plan_price: planPriceNum,
                onboarding_data: {
                    ...(clientData?.onboarding_data || {}),
                    growth_level_completed: true,
                    growth_level: {
                        id: currentLevel,
                        plan: selectedLevelObj.title,
                        price: selectedLevelObj.price
                    }
                }
            });
            toast.success(`Nivel de crecimiento "${selectedLevelObj.title}" actualizado con éxito`);
        } catch (error) {
            console.error("Error al guardar nivel:", error);
            toast.error("Error al guardar nivel: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 pb-16">
            <div className="space-y-4 text-center pb-8 border-b border-white/5 mb-12">
                <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        Capa 2: Madurez & Nivel de Crecimiento
                    </span>
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black text-purple-300 uppercase tracking-widest">
                        {currentNicheLabel}
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                    Nivel de <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Crecimiento</span>
                </h2>
                <p className="text-gray-400 text-xs font-medium max-w-2xl mx-auto leading-relaxed">
                    Selecciona el nivel estratégico para tu marca. Los planes, precios y entregables están calibrados específicamente para el sector <strong className="text-white">{currentNicheLabel}</strong>.
                </p>
            </div>

            <div className="grid gap-6">
                {levelsList.map((level, idx) => {
                    const isSelected = currentLevel === level.id;
                    return (
                        <motion.div 
                            key={level.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleSelect(level.id)}
                            className={`group cursor-pointer flex flex-col md:flex-row items-center justify-between p-8 rounded-[32px] border transition-all duration-300 ${
                                isSelected 
                                ? `${level.bg} ${level.border} shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-[1.02]` 
                                : 'bg-[#0A0A0F] border-white/5 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-start gap-6 w-full">
                                <div className={`p-4 rounded-2xl shrink-0 ${isSelected ? level.color : 'text-gray-500 bg-white/5 group-hover:text-white transition-colors'}`}>
                                    <level.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-xl md:text-2xl font-black uppercase italic tracking-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                {level.title}
                                            </h3>
                                            {isSelected && (
                                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                                    <CheckCircle2 className="w-3 h-3" /> Activo
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-base font-black text-indigo-400">
                                                {typeof level.price === 'number' ? `$${level.price}/mes` : level.price}
                                            </span>
                                            {level.complexity && (
                                                <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 uppercase tracking-wider text-gray-300">
                                                    {level.complexity}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {level.enfoque && (
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                            Enfoque: {level.enfoque}
                                        </p>
                                    )}

                                    <p className="text-gray-400 text-sm font-medium max-w-2xl leading-relaxed">
                                        {level.desc}
                                    </p>
                                    
                                    {(level.deliverables || level.filmmaker) && (
                                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-gray-300">
                                            {level.deliverables && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
                                                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                                                    {level.deliverables.videos} Videos + {level.deliverables.posts} Posts/mes
                                                </span>
                                            )}
                                            {level.filmmaker && (
                                                <span className="text-gray-400">
                                                    🎬 {level.filmmaker}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {isSelected && (
                                        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                                            {level.focusAreas && level.focusAreas.length > 0 && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <Target className="w-4 h-4 text-gray-400" />
                                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocolo y Entregables del Plan</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {level.focusAreas.map((focus, i) => (
                                                            <div key={i} className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                                <CheckCircle2 className={`w-4 h-4 ${level.color} shrink-0`} />
                                                                <span className="text-xs font-bold text-gray-300">{focus}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-6 border-t border-white/10">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSaveLevel();
                                                    }}
                                                    disabled={isSaving}
                                                    className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>{isSaving ? 'Guardando...' : `Confirmar y Activar ${level.title}`}</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
