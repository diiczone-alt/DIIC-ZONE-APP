'use client';

import { useState, useEffect } from 'react';
import {
    AlertTriangle, TrendingDown, Clock,
    Zap, Ban, ArrowUpRight,
    CheckCircle2, Info, Sparkles,
    BarChart3, LayoutGrid, Globe,
    Activity, ShieldAlert, Rocket,
    Target, Orbit, Lightbulb, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIRecommendationHUD from './AIRecommendationHUD';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { aiService } from '@/services/aiService';
import { socialService } from '@/services/socialService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ICON_MAP = {
    AlertTriangle, TrendingDown, Clock, Zap,
    Info, Sparkles, BarChart3, LayoutGrid, Globe,
    Activity, ShieldAlert, Rocket, Target, Orbit, Lightbulb, CheckCircle2
};

export default function GrowthAlertSystem() {
    const router = useRouter();
    const { user } = useAuth();
    const clientId = user?.client_id || 1;
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                setIsLoading(true);
                // 1. Get client strategic context
                const client = await agencyService.getClientById(clientId);
                let context = { name: "Cliente Generico" };
                
                if (client?.metadata?.strategic) {
                    context = { ...client.metadata.strategic, maturity_level: client.metadata.maturity_level };
                }

                // 1.5 Get linked business accounts to provide real data validation
                let linkedAccounts = [];
                try {
                    const { data: brandConns } = await supabase
                        .from('brand_connections')
                        .select('provider, status')
                        .eq('client_id', clientId)
                        .eq('status', 'connected');
                        
                    if (brandConns) {
                        linkedAccounts = brandConns.map(c => c.provider);
                    }
                } catch (e) {
                    console.log("[GrowthAlert] Could not fetch brand_connections:", e);
                }

                // 2. Ask AI to generate alerts (passing linked accounts status)
                const aiAlerts = await aiService.generateDynamicAlerts(context, linkedAccounts);
                setAlerts(aiAlerts);
            } catch (error) {
                console.error("Failed to fetch growth alerts", error);
                toast.error("No se pudieron cargar las alertas dinámicas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlerts();
    }, [clientId]);

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const handleAction = (alert) => {
        if (alert.targetRoute) {
            router.push(alert.targetRoute);
            return;
        }

        if (alert.targetTab) {
            router.push(`?tab=${alert.targetTab}`);
            toast.success(`Navegando a ${alert.targetTab.toUpperCase()}`);
            return;
        }
        
        // Conectar la acción al equipo (Estratega / Community Manager)
        toast.success(`Solicitud de "${alert.action}" enviada a tu Escuadrón. Tu Estratega te contactará pronto.`);
        router.push('/dashboard/connectivity');
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Search className="w-4 h-4 text-indigo-500 animate-pulse" /> Escaneo de Telemetría Estratégica...
                    </h3>
                </div>
                {[1, 2, 3].map((skeleton) => (
                    <div key={skeleton} className="relative overflow-hidden bg-[#0A0A12]/50 border border-white/5 rounded-[32px] p-8 animate-pulse">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-white/5" />
                            <div className="flex-1 space-y-4">
                                <div className="h-6 bg-white/10 rounded-md w-1/3" />
                                <div className="h-4 bg-white/5 rounded-md w-3/4" />
                                <div className="h-4 bg-white/5 rounded-md w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> Alertas de Crecimiento ({alerts.length})
                </h3>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Supervisión en tiempo real</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {alerts.map((alert, i) => {
                        const Icon = ICON_MAP[alert.iconName] || AlertTriangle;
                        const hasSocialsAlert = alerts.some(a => a.id === 'alert_no_socials');
                        const isBlocked = hasSocialsAlert && alert.id !== 'alert_no_socials';

                        // Colores
                        const colors = {
                            red: "bg-red-500/5 border-red-500/20 text-red-400",
                            yellow: "bg-yellow-500/5 border-yellow-500/20 text-yellow-400",
                            blue: "bg-blue-500/5 border-blue-500/20 text-blue-400",
                            emerald: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400",
                            indigo: "bg-indigo-500/5 border-indigo-500/20 text-indigo-400"
                        };

                        const selectedColor = colors[alert.color] || colors.indigo;
                        
                        // Action Button Styling
                        let btnStyle = `px-8 py-4 bg-${alert.color}-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-${alert.color}-500/20`;
                        
                        // Si es la alerta de conectar redes, hacerla súper llamativa
                        if (alert.id === 'alert_no_socials') {
                            btnStyle = `px-8 py-5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)] border border-red-400 animate-pulse`;
                        }

                        return (
                            <div key={alert.id} className="space-y-4">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`relative overflow-hidden border rounded-[2.5rem] p-8 md:p-10 transition-all ${
                                        isBlocked ? 'opacity-40 blur-[4px] grayscale-[50%] pointer-events-none select-none relative z-0' : 'hover:border-white/20 z-10'
                                    }`}
                                >
                                    <div className={`absolute -top-20 -right-20 w-60 h-60 blur-[100px] rounded-full opacity-10 pointer-events-none ${selectedColor.split(' ')[0]}`} />
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                        <div className={`w-20 h-20 shrink-0 rounded-[2rem] border flex items-center justify-center shadow-2xl ${selectedColor}`}>
                                            <Icon className="w-10 h-10" />
                                        </div>

                                        <div className="flex-1 space-y-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{alert.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${selectedColor}`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-3xl">
                                                {alert.msg}
                                            </p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                    Activaría: <span className="text-white">{alert.service}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 items-end justify-center shrink-0 w-full md:w-auto mt-6 md:mt-0">
                                            <button 
                                                onClick={() => handleAction(alert)}
                                                className={btnStyle}
                                            >
                                                <span className="flex items-center gap-3">
                                                    {alert.action} <ArrowUpRight className="w-4 h-4" />
                                                </span>
                                            </button>
                                        </div>
                                </div>
                            </motion.div>

                            {alert.type === 'recommendation_insight' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4"
                                >
                                    <AIRecommendationHUD data={alert.recommendation_data} />
                                </motion.div>
                            )}

                            {(alert.type === 'smart_risk' || alert.type === 'smart_opportunity') && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`mt-4 p-6 rounded-[32px] border ${alert.type === 'smart_risk' ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${alert.type === 'smart_risk' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            <Lightbulb className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${alert.type === 'smart_risk' ? 'text-red-400' : 'text-emerald-400'}`}>
                                                Orientación Profesional
                                            </span>
                                            <p className="text-sm font-bold text-gray-200 leading-relaxed italic">
                                                "{alert.strategy}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* AI GROWTH ADVISOR SUMMARY */}
            <div className="mt-8 bg-indigo-600/5 border border-indigo-500/30 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 text-left relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Sparkles className="w-40 h-40 text-indigo-400" />
                </div>
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Target className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Resumen de Supervisión IA
                    </h4>
                    <p className="text-sm text-gray-300 font-bold italic leading-relaxed">
                        "Detecto que tu velocidad de crecimiento ha bajado un <span className="text-red-400 font-black">15%</span> este mes. Si no corregimos la <span className="text-white">CONSTANCIA</span> y completamos tu <span className="text-white">WEB PROFESIONAL</span>, el salto al Nivel 4 se retrasará 3 meses."
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => router.push('?tab=progress')}
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                    >
                        Ver Roadmap
                    </button>
                    <button 
                        onClick={() => {
                            toast.success("Alerta enviada a tu equipo creativo. Se comunicarán para corregirlo.");
                            router.push('/dashboard/connectivity');
                        }}
                        className="px-8 py-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 border border-white/10"
                    >
                        Corregir Ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
