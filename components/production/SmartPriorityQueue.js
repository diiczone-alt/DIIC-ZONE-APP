'use client';

import { useState, useEffect } from 'react';
import { SortDesc, Flame, Clock, DollarSign, Target, AlertCircle, ArrowRight, Zap } from 'lucide-react';

const MOCK_PROJECTS = [
    {
        id: 1,
        name: 'Campaña BlackFriday',
        client: 'TechCorp',
        plan: 'enterprise', // +40
        deadlineHours: 20, // <24h -> +30
        type: 'corp_video', // +25
        strategic: true, // +20
        blocked: false
    },
    {
        id: 2,
        name: 'Reels Lanzamiento',
        client: 'Dr. Smith',
        plan: 'pro', // +30
        deadlineHours: 40, // <48h -> +20
        type: 'reels', // +10
        strategic: true, // +20
        blocked: true // +15
    },
    {
        id: 3,
        name: 'Diseño Post Diario',
        client: 'Bistro Food',
        plan: 'basic', // +20
        deadlineHours: 72, // Normal -> +10
        type: 'design', // +5
        strategic: false,
        blocked: false
    },
    {
        id: 4,
        name: 'Video Testimonio',
        client: 'Constructora X',
        plan: 'enterprise', // +40
        deadlineHours: 120, // Normal -> +10
        type: 'corp_video', // +25
        strategic: false,
        blocked: false
    }
];

const SCORING_RULES = {
    plan: { enterprise: 40, pro: 30, basic: 20, free: 5 },
    deadline: { urgent: 30, warning: 20, normal: 10 }, // <24, <48, >48
    type: { corp_video: 25, reels: 10, design: 5 },
    strategic: 20,
    blocked: 15
};

export default function SmartPriorityQueue() {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        // Algoritmo de Priorización
        const rankedProjects = MOCK_PROJECTS.map(p => {
            let score = 0;
            const breakdown = [];

            // 1. Plan
            const planScore = SCORING_RULES.plan[p.plan] || 0;
            score += planScore;
            breakdown.push({ label: 'Plan', pts: planScore });

            // 2. Urgency
            let urgencyScore = SCORING_RULES.deadline.normal;
            if (p.deadlineHours < 24) urgencyScore = SCORING_RULES.deadline.urgent;
            else if (p.deadlineHours < 48) urgencyScore = SCORING_RULES.deadline.warning;
            score += urgencyScore;
            // breakdown.push({ label: 'Urgencia', pts: urgencyScore });

            // 3. Type
            const typeScore = SCORING_RULES.type[p.type] || 5;
            score += typeScore;
            // breakdown.push({ label: 'Valor', pts: typeScore });

            // 4. Strategic
            if (p.strategic) {
                score += SCORING_RULES.strategic;
                breakdown.push({ label: 'Estrategia', pts: SCORING_RULES.strategic });
            }

            // 5. Blocked
            if (p.blocked) {
                score += SCORING_RULES.blocked;
                breakdown.push({ label: 'Desbloqueo', pts: SCORING_RULES.blocked, alert: true });
            }

            return { ...p, score, breakdown };
        }).sort((a, b) => b.score - a.score); // Ordenar DESC

        setQueue(rankedProjects);
    }, []);

    const getPriorityColor = (score) => {
        if (score >= 90) return 'text-red-500 border-red-500/50 bg-red-500/10'; // Fire
        if (score >= 60) return 'text-orange-400 border-orange-500/50 bg-orange-500/10'; // High
        return 'text-blue-400 border-blue-500/50 bg-blue-500/10'; // Normal
    };

    return (
        <div className="bg-[#0F0F1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                        <SortDesc className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Smart Priority Queue</h3>
                        <p className="text-[10px] text-gray-500">Ordenamiento automático por Valor + Urgencia</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-purple-400 px-2 py-1 bg-purple-500/10 rounded border border-purple-500/20">AI Sorting Active</span>
                </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
                {queue.map((item, i) => (
                    <div key={item.id} className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 transition-all duration-300">
                        {/* Rank Badge */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#13131F] border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 shadow-xl z-20">
                            #{i + 1}
                        </div>

                        <div className="flex justify-between items-start pl-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                    {item.score >= 90 && <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                                    {item.blocked && <AlertCircle className="w-3.5 h-3.5 text-orange-400" />}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    <span className="bg-white/5 px-1.5 py-0.5 rounded text-gray-300">{item.client}</span>
                                    <span>•</span>
                                    <span className={`${item.deadlineHours < 24 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                                        {item.deadlineHours}h para entrega
                                    </span>
                                </div>
                            </div>

                            <div className={`flex flex-col items-end justify-center px-3 py-1 rounded-lg border ${getPriorityColor(item.score)}`}>
                                <span className="text-xl font-black leading-none">{item.score}</span>
                                <span className="text-[8px] font-bold uppercase tracking-wider opacity-80">PTS</span>
                            </div>
                        </div>

                        {/* Breakdown on hover (Score explanation) */}
                        <div className="mt-2 text-[10px] flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            {item.breakdown.map((b, idx) => (
                                <span key={idx} className={`flex items-center gap-1 ${b.alert ? 'text-orange-300' : 'text-gray-400'}`}>
                                    {b.alert ? <Zap className="w-2.5 h-2.5" /> : <CheckCircleIcon className="w-2.5 h-2.5" />}
                                    {b.label}: +{b.pts}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-4 w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/20 flex items-center justify-center gap-2 transition-colors">
                Ver Explicación del Algoritmo <ArrowRight className="w-3 h-3" />
            </button>
        </div>
    );
}

function CheckCircleIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
