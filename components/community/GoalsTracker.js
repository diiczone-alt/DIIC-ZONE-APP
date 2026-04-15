'use client';

import { TrendingUp, Users, DollarSign } from 'lucide-react';

const ICONS = {
    'Followers': Users,
    'Leads': TrendingUp,
    'Sales': DollarSign
};

export default function GoalsTracker({ goals = [] }) {
    return (
        <div className="glass-panel p-6 rounded-2xl animate-fade-in delay-100">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" /> Objetivos del Mes
            </h3>

            <div className="space-y-6">
                {goals.map((goal) => {
                    const Icon = ICONS[goal.metric_name] || TrendingUp;
                    const progress = Math.min(100, (goal.current_value / goal.target_value) * 100);

                    return (
                        <div key={goal.id} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{goal.metric_name}</p>
                                        <p className="text-xl font-bold text-white">
                                            {goal.current_value.toLocaleString()}
                                            <span className="text-sm text-gray-500 ml-1">/ {goal.target_value.toLocaleString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold ${progress >= 100 ? 'text-green-400' : 'text-primary'}`}>
                                    {Math.round(progress)}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${progress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}

                {goals.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No hay objetivos definidos para este mes.
                    </div>
                )}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-white/10 text-gray-400 text-sm font-bold hover:bg-white/5 hover:text-white transition-all">
                + Definir Nuevo Objetivo
            </button>
        </div>
    );
}
