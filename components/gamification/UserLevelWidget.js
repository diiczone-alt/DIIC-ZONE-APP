'use client';

import { Trophy, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserLevelWidget({ user }) {
    // Mock Data based on User Role
    const levelData = {
        level: 2,
        title: 'Operativo',
        xp: 750,
        nextLevelXp: 1000,
        trustScore: 84, // 0-100
        income: 1340
    };

    const progressPercent = (levelData.xp / levelData.nextLevelXp) * 100;

    return (
        <div className="bg-[#0F0F1A] rounded-xl p-4 border border-white/5 space-y-3">
            {/* Level & Title */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                        <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white text-indigo-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0F0F1A]">
                        {levelData.level}
                    </div>
                </div>
                <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-wider">Nivel {levelData.level}</h4>
                    <p className="text-indigo-400 text-[10px] font-bold uppercase">{levelData.title}</p>
                </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase">
                    <span>XP</span>
                    <span>{levelData.xp} / {levelData.nextLevelXp}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                </div>
            </div>

            {/* Trust Score & Stats */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex justify-center mb-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /></div>
                    <div className="text-emerald-400 font-black text-sm">{levelData.trustScore}</div>
                    <div className="text-[8px] text-gray-500 uppercase font-bold">Trust Score</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex justify-center mb-1"><TrendingUp className="w-3 h-3 text-amber-400" /></div>
                    <div className="text-white font-black text-sm">${levelData.income}</div>
                    <div className="text-[8px] text-gray-500 uppercase font-bold">Ganancias</div>
                </div>
            </div>

            <div className="text-[9px] text-center text-gray-600 font-medium pt-1">
                Faltan {levelData.nextLevelXp - levelData.xp} XP para Nivel 3
            </div>
        </div>
    );
}
