'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import GrowthHero from './GrowthHero';
import GrowthProblem from './GrowthProblem';
import GrowthSolution from './GrowthSolution';
import GrowthProcess from './GrowthProcess';
import GrowthLevels from './GrowthLevels';
import GrowthPricing from './GrowthPricing';
import GrowthUpsell from './GrowthUpsell';
import GrowthFinalCTA from './GrowthFinalCTA';
import StrategicGuidance from './StrategicGuidance';
import { getNicheConfig } from './nicheConfig';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Target, Zap, Activity } from 'lucide-react';

export default function GrowthLanding() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');
    const pricingRef = useRef(null);

    const [activeClient, setActiveClient] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (clientId) {
            setLoading(true);
            supabase.from('clients')
                .select('*')
                .eq('id', clientId)
                .single()
                .then(({ data }) => {
                    setActiveClient(data);
                    setLoading(false);
                });
        }
    }, [clientId]);

    const scrollToPlans = () => {
        pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Personalización por Nicho
    const config = getNicheConfig(activeClient?.type || user?.user_metadata?.niche || '');
    
    // Función para manejar el género "Médico" vs "Médica"
    const getAdaptedTitle = (base) => {
        const name = activeClient?.name || user?.user_metadata?.first_name || '';
        const isFemale = name.toLowerCase().endsWith('a') || name.includes('Dra.');
        return isFemale ? base.replace('Médico', 'Médica') : base;
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white selection:bg-cyan-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10">
                {activeClient ? (
                    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Ecosistema Privado
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {activeClient.status}
                                    </span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                                    Plan de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">Crecimiento</span>
                                </h1>
                                <p className="text-2xl font-light text-gray-400">
                                    Consola estratégica diseñada específicamente para la <span className="text-white font-bold">{activeClient.name}</span>.
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-8 backdrop-blur-xl">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nivel Actual</p>
                                    <p className="text-4xl font-black text-white italic">NIVEL {activeClient.growth_level || 1}</p>
                                </div>
                                <div className="w-px h-12 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Especialidad</p>
                                    <p className="text-2xl font-black text-indigo-400 uppercase tracking-tighter">{activeClient.specialty || 'General'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                            <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] space-y-4">
                                <Target className="w-8 h-8 text-indigo-400" />
                                <h3 className="text-xl font-bold uppercase italic tracking-tight">Objetivos 2026</h3>
                                <p className="text-sm text-gray-400">Escalar autoridad en {activeClient.city} mediante contenido de alto impacto en {activeClient.specialty}.</p>
                            </div>
                            <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-[2rem] space-y-4">
                                <Zap className="w-8 h-8 text-purple-400" />
                                <h3 className="text-xl font-bold uppercase italic tracking-tight">Plan Activo</h3>
                                <p className="text-sm text-gray-400">Suscripción nivel {activeClient.plan} verificada. Soporte prioritario activo.</p>
                            </div>
                            <div className="p-8 bg-emerald-400/5 border border-emerald-400/10 rounded-[2rem] space-y-4">
                                <Activity className="w-8 h-8 text-emerald-400" />
                                <h3 className="text-xl font-bold uppercase italic tracking-tight">Status Operativo</h3>
                                <p className="text-sm text-gray-400">Sincronización con CRM Inteligente y Hub de Conectividad completa.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <GrowthHero 
                        config={config} 
                        onScrollToPlans={scrollToPlans} 
                        adaptedLabel={getAdaptedTitle(config.label)}
                    />
                )}
                
                <div className="max-w-7xl mx-auto px-6 space-y-32 py-20 pb-40">
                    {!activeClient && (
                        <>
                            <StrategicGuidance 
                                config={config} 
                                userName={user?.user_metadata?.first_name}
                                adaptedLabel={getAdaptedTitle(config.label)}
                            />
                            <GrowthProblem config={config} />
                        </>
                    )}
                    
                    <GrowthSolution config={config} activeClient={activeClient} />
                    <GrowthProcess config={config} activeClient={activeClient} />
                    
                    {!activeClient && (
                         <GrowthLevels 
                            config={config} 
                            nicheType={config.id}
                        />
                    )}
                    
                    {activeClient ? (
                        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center space-y-8">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Suscripción de Marca</h2>
                            <div className="flex justify-center gap-12 items-center">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">MODALIDAD</p>
                                    <p className="text-5xl font-black text-white italic tracking-tighter">PLAN {activeClient.plan}</p>
                                </div>
                                <div className="w-px h-20 bg-white/10" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">STATUS DE PAGO</p>
                                    <p className="text-5xl font-black text-emerald-400 italic tracking-tighter">AL DÍA</p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-medium pt-8">Este perfil está configurado para no mostrar tablas de precios públicas por motivos de confidencialidad estratégica.</p>
                        </div>
                    ) : (
                        <div ref={pricingRef} className="scroll-mt-20">
                            <GrowthPricing config={config} />
                        </div>
                    )}
                    
                    <GrowthUpsell config={config} />
                    
                    {/* Aclaración Section */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="py-12 border-y border-white/5 text-center"
                    >
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            La pauta publicitaria no está incluida. Se define según objetivos del cliente.
                        </p>
                    </motion.div>

                    <GrowthFinalCTA />
                </div>
            </div>
        </div>
    );
}
