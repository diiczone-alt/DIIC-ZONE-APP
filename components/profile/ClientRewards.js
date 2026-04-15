'use client';

import {
    Gift, Crown, Calendar, Target, Users, Sparkles,
    Lock, CheckCircle, ArrowRight, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientRewards() {
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
                        <div className="relative z-10">
                            <h3 className="font-bold text-white text-lg">Misión Activa</h3>
                            <p className="text-gray-300">
                                Estás a <strong className="text-white">1 contenido</strong> de desbloquear un <span className="text-purple-400 font-bold">Diseño Adicional Gratis</span>.
                            </p>
                        </div>
                        <button className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all z-10">
                            Publicar Ahora
                        </button>
                    </div>

                    {/* BLOQUE: Recompensas por Nivel */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-500" /> Beneficios por Nivel
                        </h3>
                        <div className="space-y-4">
                            <RewardTier level="2" name="Presencia" benefit="Diseño adicional gratis" status="unlocked" />
                            <RewardTier level="3" name="Confianza" benefit="Video extra corto mensual" status="locked" />
                            <RewardTier level="4" name="Sistema" benefit="Optimización de campaña IA" status="locked" />
                            <RewardTier level="5" name="Escala" benefit="Asesoría estratégica 1 a 1" status="locked" />
                        </div>
                    </section>

                    {/* BLOQUE: Recompensas por Resultados */}
                    <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-400" /> Recompensas por Resultados
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <ResultCard goal="50 Leads" reward="Diseño Gratis" progress={45} />
                            <ResultCard goal="100 Leads" reward="Video Extra" progress={22} />
                            <ResultCard goal="ROI > 300%" reward="Optimización Ads" progress={0} />
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
                            <TimeReward time="3 Meses" reward="Post Adicional" status="achieved" />
                            <TimeReward time="6 Meses" reward="Sesión Creativa Extra" status="upcoming" daysLeft="45" />
                            <TimeReward time="1 Año" reward="Campaña Estratégica" status="locked" />
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
                            <code className="text-xs text-pink-400 font-mono">diic.zone/ref/tu-marca</code>
                            <button className="text-xs font-bold text-white hover:text-pink-400 transition-colors">Copiar</button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                <span>Gana: <strong>Descuento en próxima factura</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                <span>Gana: <strong>Pack de Contenido Extra</strong></span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function RewardTier({ level, name, benefit, status }) {
    const isUnlocked = status === 'unlocked';
    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isUnlocked ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/5 opacity-60'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${isUnlocked ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-500'}`}>
                {level}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>Nivel {level}: {name}</span>
                    {isUnlocked ? <Lock className="w-4 h-4 text-amber-500 invisible" /> : <Lock className="w-4 h-4 text-gray-600" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Gift className="w-3 h-3 text-purple-400" />
                    {benefit}
                </div>
            </div>
            {isUnlocked && <CheckCircle className="w-5 h-5 text-amber-500" />}
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
