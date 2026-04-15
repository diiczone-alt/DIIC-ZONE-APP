'use client';

import {
    Zap, ShieldCheck, Trophy, Star, Crown,
    TrendingUp, Award, Target
} from 'lucide-react';

export function LevelBadge({ level }) {
    // Level 1: New (Gray/Blue)
    // Level 2: Verified (Blue/Cyan)
    // Level 3: Pro (Purple)
    // Level 4: Senior (Amber/Gold)
    // Level 5: Elite (Red/Black/Diamond)

    const configs = {
        1: { label: 'Nivel 1 • Nuevo', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: Zap },
        2: { label: 'Nivel 2 • Verificado', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: ShieldCheck },
        3: { label: 'Nivel 3 • Pro', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Trophy },
        4: { label: 'Nivel 4 • Senior', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Star },
        5: { label: 'Nivel 5 • Elite', color: 'bg-gradient-to-r from-red-600/20 to-black text-white border-red-500/50', icon: Crown },
    };

    const config = configs[level] || configs[1];
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </div>
    );
}

export function ReputationStats({ score, onTime, rating }) {
    return (
        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#0E0E18] p-2 rounded-lg border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Reputación</p>
                <div className="flex items-center justify-center gap-1 text-white font-black text-lg">
                    <Target className="w-3 h-3 text-purple-500" /> {score}
                </div>
            </div>
            <div className="bg-[#0E0E18] p-2 rounded-lg border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Puntualidad</p>
                <div className="flex items-center justify-center gap-1 text-white font-black text-lg">
                    <ClockIcon className="w-3 h-3 text-emerald-500" /> {onTime}%
                </div>
            </div>
            <div className="bg-[#0E0E18] p-2 rounded-lg border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Rating</p>
                <div className="flex items-center justify-center gap-1 text-white font-black text-lg">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {rating}
                </div>
            </div>
        </div>
    );
}

function ClockIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

export function LevelProgress({ currentPoints, nextLevelPoints, nextLevelLabel }) {
    const progress = Math.min((currentPoints / nextLevelPoints) * 100, 100);

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-gray-400">XP Actual</span>
                <span className="text-white font-bold">{currentPoints} / {nextLevelPoints} XP</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-[10px] text-gray-500 text-right">
                Siguiente Nivel: <span className="text-purple-400 font-bold">{nextLevelLabel}</span>
            </p>
        </div>
    );
}
