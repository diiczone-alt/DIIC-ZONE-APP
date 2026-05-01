import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Gift, Crown, Calendar, Target, Users, Sparkles,
    Lock, CheckCircle, ArrowRight, Star, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

export default function ClientRewards() {
    const router = useRouter();
    const { user } = useAuth();
    const clientId = user?.client_id || 1;
    const [isLoading, setIsLoading] = useState(true);
    const [rewardsData, setRewardsData] = useState(null);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                setIsLoading(true);
                const client = await agencyService.getClientById(clientId);
                let context = { name: "Cliente Generico" };
                
                if (client?.metadata?.strategic) {
                    context = { ...client.metadata.strategic, maturity_level: client.metadata.maturity_level };
                }

                const aiRewards = await aiService.generateDynamicRewards(context);
                setRewardsData(aiRewards);
            } catch (error) {
                console.error("Failed to fetch rewards", error);
                toast.error("No se pudieron cargar las recompensas dinámicas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRewards();
    }, [clientId]);

    if (isLoading) {
        return (
            <div className="space-y-8 pb-20 animate-fade-in-up">
                <div className="flex items-center gap-3 text-purple-400 mb-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Sincronizando Misiones de Marca...</span>
                </div>
                <div className="bg-[#0A0A12]/50 border border-white/5 rounded-3xl p-8 h-48 animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0A0A12]/50 border border-white/5 h-32 rounded-2xl animate-pulse" />
                        <div className="bg-[#0A0A12]/50 border border-white/5 h-64 rounded-2xl animate-pulse" />
                    </div>
                    <div className="space-y-6">
                        <div className="bg-[#0A0A12]/50 border border-white/5 h-48 rounded-2xl animate-pulse" />
                        <div className="bg-[#0A0A12]/50 border border-white/5 h-48 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    const activeMission = rewardsData?.activeMission || {
        title: "Misión Activa",
        quantity: "1 contenido",
        reward: "Diseño Adicional Gratis"
    };

    const resultRewards = rewardsData?.resultRewards || [
        { goal: "50 Leads", reward: "Diseño Gratis", progress: 45 },
        { goal: "100 Leads", reward: "Video Extra", progress: 22 },
        { goal: "ROI > 300%", reward: "Optimización Ads", progress: 0 }
    ];

    const levelBenefits = rewardsData?.levelBenefits || [
        { level: "1", name: "Presencia Digital", benefit: "Identidad visual y setup de ecosistema", requirement: "Completar Onboarding Inicial", status: "unlocked" },
        { level: "2", name: "Estrategia", benefit: "Diseño adicional gratis", requirement: "1 Mes de pauta y contenido activo", status: "unlocked" },
        { level: "3", name: "Marca", benefit: "Video extra corto mensual (Reel Expert)", requirement: "Consolidación de Autoridad (3 Meses)", status: "locked" },
        { level: "4", name: "Automatización", benefit: "Optimización de campaña IA", requirement: "Sistema de Leads Automatizado", status: "locked" },
        { level: "5", name: "Escala", benefit: "Asesoría estratégica 1 a 1", requirement: "Dominio de Nicho y ROI Exponencial", status: "locked" }
    ];

    const constancyRewards = rewardsData?.constancyRewards || [
        { time: "3 Meses", reward: "Post Adicional", status: "achieved" },
        { time: "6 Meses", reward: "Sesión Creativa Extra", status: "upcoming", daysLeft: "45" },
        { time: "1 Año", reward: "Campaña Estratégica", status: "locked" }
    ];

    const referralRewards = rewardsData?.referralRewards || [
        "Descuento en próxima factura",
        "Pack de Contenido Extra"
    ];

    return (
        <div className="space-y-8 pb-20 animate-fade-in-up">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A0A12] to-[#1a1a2e] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Gift className="w-3 h-3" /> Programa de Fidelización
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2">
                            Sistema de Recompensas
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            Mientras más creces con DIIC ZONE, más beneficios desbloqueas. No es un gasto, es una inversión con retorno garantizado.
                        </p>
                    </div>

                    <div className="text-right hidden md:block">
                        <div className="text-sm text-gray-400 font-bold uppercase mb-1">Nivel Actual</div>
                        <div className="text-3xl font-black text-white flex items-center justify-end gap-2">
                            <Crown className="w-6 h-6 text-amber-500 fill-amber-500" /> Nivel 2
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COL: Rewards Tiers */}
                <div className="lg:col-span-2 space-y-6">

                    {/* BLOQUE: Misión Actual */}
                    <div className="bg-gradient-to-r from-purple-900/10 to-[#0A0A12] border border-purple-500/20 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-purple-500/5 pulse-slow pointer-events-none" />
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 relative z-10">
                            <Target className="w-6 h-6" />
                        </div>
                        <div className="relative z-10 flex-1">
                            <h3 className="font-bold text-white text-lg">{activeMission.title}</h3>
                            <p className="text-gray-300">
                                Estás a <strong className="text-white">{activeMission.quantity}</strong> de desbloquear un <span className="text-purple-400 font-bold">{activeMission.reward}</span>.
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                                toast.success("¡Zona Creativa Abierta!", { description: "Preparando tu entorno de publicación..." });
                                router.push('/dashboard/studio');
                            }}
                            className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all z-10 active:scale-95"
                        >
                            Publicar Ahora
                        </button>
                    </div>

                    {/* BLOQUE: Recompensas por Nivel */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-500" /> Beneficios por Nivel
                        </h3>
                        <div className="space-y-4">
                            {levelBenefits.map((benefit, i) => (
                                <RewardTier 
                                    key={i} 
                                    level={benefit.level} 
                                    name={benefit.name} 
                                    benefit={benefit.benefit} 
                                    requirement={benefit.requirement}
                                    status={benefit.status} 
                                />
                            ))}
                        </div>
                    </section>

                    {/* BLOQUE: Recompensas por Resultados */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-400" /> Recompensas por Resultados
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {resultRewards.map((reward, i) => (
                                <ResultCard key={i} goal={reward.goal} reward={reward.reward} progress={reward.progress} />
                            ))}
                        </div>
                    </section>

                </div>

                {/* RIGHT COL: Constancy & Referrals */}
                <div className="space-y-6">

                    {/* BLOQUE: Constancia */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" /> Premios a la Constancia
                        </h3>
                        <div className="space-y-4">
                            {constancyRewards.map((reward, i) => (
                                <TimeReward key={i} time={reward.time} reward={reward.reward} status={reward.status} daysLeft={reward.daysLeft} />
                            ))}
                        </div>
                    </section>

                    {/* BLOQUE: Referidos */}
                    <section className="bg-gradient-to-br from-[#0A0A12] to-[#1a1a2e] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Users className="w-5 h-5 text-pink-400" /> Programa de Referidos
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Comparte tu enlace único. Si alguien contrata, ambos ganan beneficios exclusivos.
                        </p>

                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between mb-4">
                            <code className="text-xs text-pink-400 font-mono select-all">diic.zone/ref/client-{clientId}</code>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(`https://diic.zone/ref/client-${clientId}`);
                                    toast.success("¡Enlace copiado al portapapeles!", { description: "Ya puedes compartirlo con tus amigos." });
                                }}
                                className="text-xs font-bold text-white hover:text-pink-400 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg active:scale-95"
                            >
                                Copiar
                            </button>
                        </div>

                        <div className="space-y-2">
                            {referralRewards.map((reward, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                    <span>Gana: <strong>{reward}</strong></span>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function RewardTier({ level, name, benefit, requirement, status }) {
    const isUnlocked = status === 'unlocked';
    return (
        <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${isUnlocked ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'bg-[#050511] border-white/5 opacity-50 grayscale'}`}>
            {/* Connection Line */}
            {level !== '5' && <div className="absolute left-[34px] top-[60px] w-0.5 h-12 bg-white/5 -z-10" />}

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-110 ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-gray-600 border border-white/10'}`}>
                {level}
            </div>
            
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                        <span className={`font-black uppercase tracking-widest text-xs ${isUnlocked ? 'text-amber-500' : 'text-gray-600'}`}>Nivel {level}</span>
                        <span className={`font-bold text-base ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{name}</span>
                    </div>
                    {isUnlocked ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 rounded-full">
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Activo</span>
                            <CheckCircle className="w-3 h-3 text-amber-500" />
                        </div>
                    ) : (
                        <Lock className="w-4 h-4 text-gray-700 group-hover:text-gray-500 transition-colors" />
                    )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className={`p-1 rounded-md ${isUnlocked ? 'bg-purple-500/10 text-purple-400' : 'bg-white/5 text-gray-600'}`}>
                            <Gift className="w-3 h-3" />
                        </div>
                        <span className="font-medium">{benefit}</span>
                    </div>
                    
                    {requirement && (
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                            <Target className="w-3 h-3" />
                            <span>Meta: <span className={isUnlocked ? 'text-gray-300' : ''}>{requirement}</span></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ResultCard({ goal, reward, progress }) {
    return (
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Meta</div>
            <div className="text-lg font-black text-white mb-2">{goal}</div>
            <div className="text-xs text-green-400 font-bold mb-3 flex items-center gap-1">
                <Gift className="w-3 h-3" /> {reward}
            </div>

            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

function TimeReward({ time, reward, status, daysLeft }) {
    const isAchieved = status === 'achieved';
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${isAchieved ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className={`p-2 rounded-lg ${isAchieved ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-500'}`}>
                <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <span className="text-sm font-bold text-white">{time}</span>
                    {daysLeft && <span className="text-xs text-blue-400">{daysLeft} días</span>}
                </div>
                <div className="text-xs text-gray-400">{reward}</div>
            </div>
            {isAchieved ? <CheckCircle className="w-4 h-4 text-blue-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-600" />}
        </div>
    );
}
