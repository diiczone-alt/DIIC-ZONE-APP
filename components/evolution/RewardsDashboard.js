'use client';

import { motion } from 'framer-motion';
import {
    Award, Star, Crown, Gift, Zap,
    Lock, CheckCircle, TrendingUp
} from 'lucide-react';

export default function RewardsDashboard() {
    return (
        <div className="space-y-8">
            {/* Hero Section - Level Status */}
            <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-r from-indigo-900 to-purple-900 border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
                <div className="absolute top-0 right-0 p-12 opacity-30">
                    <Crown className="w-64 h-64 text-white rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full border-4 border-yellow-400 bg-black flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.3)]">
                        <span className="text-5xl font-black text-white">4</span>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-1">Tu Nivel Actual</h2>
                        <h1 className="text-4xl font-black text-white mb-2">Creador Experto</h1>
                        <p className="text-indigo-200 mb-6 max-w-lg">
                            Has superado el 85% de los creadores este mes. ¡Sigue así para alcanzar el estatus Maestro!
                        </p>

                        {/* XP Bar */}
                        <div className="w-full max-w-xl bg-black/40 h-4 rounded-full overflow-hidden border border-white/5 relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                            />
                        </div>
                        <div className="flex justify-between w-full max-w-xl mt-2 text-xs font-bold text-indigo-300">
                            <span>3,450 XP Actuales</span>
                            <span>5,000 XP para Nivel 5</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges & Achievements */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" /> Insignias Desbloqueadas
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Badge icon={Zap} name="Velocista" level="Gold" />
                    <Badge icon={Star} name="Rising Star" level="Platinum" />
                    <Badge icon={CheckCircle} name="Productivo" level="Silver" />
                    <Badge icon={Gift} name="Referido" level="Bronze" />
                    <Badge icon={Lock} name="???" level="Locked" locked />
                    <Badge icon={Lock} name="???" level="Locked" locked />
                </div>
            </div>

            {/* Available Rewards */}
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" /> Recompensas Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RewardCard
                    title="Asesoría 1:1"
                    cost="2,500 XP"
                    desc="30 min con un experto en Growth"
                    image="bg-gradient-to-br from-blue-500 to-cyan-500"
                />
                <RewardCard
                    title="Pack de Assets"
                    cost="1,000 XP"
                    desc="50 Transiciones Premium"
                    image="bg-gradient-to-br from-purple-500 to-pink-500"
                />
                <RewardCard
                    title="Descuento Pro"
                    cost="5,000 XP"
                    desc="50% OFF en tu próximo mes"
                    image="bg-gradient-to-br from-yellow-500 to-orange-500"
                />
            </div>
        </div>
    );
}

function Badge({ icon: Icon, name, level, locked }) {
    const colors = {
        Gold: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        Platinum: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
        Silver: 'text-gray-300 bg-gray-400/10 border-gray-400/20',
        Bronze: 'text-orange-300 bg-orange-400/10 border-orange-400/20',
        Locked: 'text-gray-600 bg-white/5 border-white/5',
    };

    return (
        <div className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 gap-3 transition-transform hover:scale-105 ${colors[level]}`}>
            <Icon className={`w-8 h-8 ${locked ? 'opacity-30' : ''}`} />
            <div className="text-center">
                <p className={`text-xs font-bold ${locked ? 'text-gray-600' : 'text-white'}`}>{name}</p>
                {!locked && <p className="text-[10px] opacity-70 uppercase tracking-wider">{level}</p>}
            </div>
        </div>
    );
}

function RewardCard({ title, cost, desc, image }) {
    return (
        <div className="group rounded-3xl bg-[#0E0E18] border border-white/5 overflow-hidden hover:border-white/10 transition-colors">
            <div className={`h-32 ${image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                        {cost}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm mb-6">{desc}</p>
                <button className="w-full py-3 rounded-xl bg-white text-black font-black uppercase tracking-wide hover:bg-gray-200 transition-colors">
                    Canjear
                </button>
            </div>
        </div>
    );
}
