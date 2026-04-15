'use client';

import { Award, Video, Megaphone, DollarSign, Bot, Star } from 'lucide-react';

const achievements = [
    { id: 1, title: 'Primer Video', icon: Video, color: 'text-blue-400', bg: 'bg-blue-500/10', unlocked: true },
    { id: 2, title: 'Campaña Activa', icon: Megaphone, color: 'text-pink-400', bg: 'bg-pink-500/10', unlocked: false },
    { id: 3, title: 'Primera Venta', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', unlocked: false },
    { id: 4, title: 'Automatización', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/10', unlocked: false },
];

export default function AchievementsWidget({ userLevel }) {
    // Simular desbloqueo basado en nivel para demo
    const dynamicAchievements = achievements.map((a, i) => ({
        ...a,
        unlocked: i < (userLevel - 1) * 1.5 // Logica tonta de demo: desbloquear mas a mayor nivel
    }));

    return (
        <div className="rounded-3xl bg-[#0F0F1A] border border-white/5 p-6 flex flex-col relative overflow-hidden h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" /> Logros
                </h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">
                    {dynamicAchievements.filter(a => a.unlocked).length} / 4
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
                {dynamicAchievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${achievement.unlocked
                                ? 'bg-white/5 border-white/10 opacity-100'
                                : 'bg-white/0 border-white/5 opacity-30 grayscale'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${achievement.unlocked ? achievement.bg : 'bg-gray-800'} ${achievement.unlocked ? achievement.color : 'text-gray-600'}`}>
                            <achievement.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-gray-300 leading-tight">
                            {achievement.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
