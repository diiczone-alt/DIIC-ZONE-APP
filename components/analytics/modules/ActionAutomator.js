'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket, AlertTriangle, Flame, Clock, DollarSign,
    ArrowRight, X, CheckCircle2, Loader2
} from 'lucide-react';
import { automationService } from '@/services/automationService';

const ICONS = {
    'ROCKET': Rocket,
    'ALERT': AlertTriangle,
    'FIRE': Flame,
    'CLOCK': Clock,
    'MONEY': DollarSign
};

export default function ActionAutomator() {
    const [insights, setInsights] = useState([]);
    const [loadingAction, setLoadingAction] = useState(null); // id of action being executed

    useEffect(() => {
        // Load insights on mount
        const loadInsights = async () => {
            const data = await automationService.analyzeSystemState();
            setInsights(data);
        };
        loadInsights();
    }, []);

    const handleAction = async (insightId, action) => {
        if (action.code === 'DISMISS') {
            removeInsight(insightId);
            return;
        }

        setLoadingAction(insightId); // Show loading state on card

        try {
            const result = await automationService.executeAction(action.code, action.context);
            if (result.success) {
                // Show success state briefly then remove/update
                alert(`✅ ${result.message}`); // Temporary feedback
                removeInsight(insightId);
            }
        } catch (error) {
            console.error(error);
            alert('Error al ejecutar acción');
        } finally {
            setLoadingAction(null);
        }
    };

    const removeInsight = (id) => {
        setInsights(prev => prev.filter(i => i.id !== id));
    };

    if (insights.length === 0) return null;

    return (
        <div className="col-span-1 lg:col-span-2 xl:col-span-3 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 animate-pulse"></div>
                    <Rocket className="w-6 h-6 text-indigo-400 relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Centro de Acción Automática</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {insights.map((insight) => {
                        const Icon = ICONS[insight.icon] || Rocket;
                        const isProcessing = loadingAction === insight.id;

                        return (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                className={`
                                    relative p-5 rounded-2xl border backdrop-blur-sm transition-all
                                    ${insight.type === 'OPPORTUNITY' ? 'bg-indigo-900/10 border-indigo-500/30 hover:border-indigo-400' : ''}
                                    ${insight.type === 'WARNING' ? 'bg-red-900/10 border-red-500/30 hover:border-red-400' : ''}
                                    ${insight.type === 'INFO' ? 'bg-amber-900/10 border-amber-500/30 hover:border-amber-400' : ''}
                                `}
                            >
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-3">
                                    <div className={`p-3 rounded-xl shrink-0 ${insight.type === 'OPPORTUNITY' ? 'bg-indigo-500/20 text-indigo-400' :
                                            insight.type === 'WARNING' ? 'bg-red-500/20 text-red-400' :
                                                'bg-amber-500/20 text-amber-400'
                                        }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white leading-tight mb-1">{insight.title}</h4>
                                        <p className="text-xs text-gray-300 leading-relaxed">{insight.description}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 mt-4">
                                    {insight.actions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            disabled={isProcessing}
                                            onClick={() => handleAction(insight.id, action)}
                                            className={`
                                                w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all group
                                                ${action.style === 'danger'
                                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'
                                                    : action.style === 'ghost'
                                                        ? 'bg-transparent text-gray-500 hover:text-white'
                                                        : 'bg-white/5 hover:bg-white/10 text-white hover:pl-5'
                                                }
                                            `}
                                        >
                                            <span className="flex items-center gap-2">
                                                {isProcessing && idx === 0 ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                                {action.label}
                                            </span>
                                            {action.code !== 'DISMISS' && !isProcessing && (
                                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Dismiss X */}
                                <button
                                    onClick={() => handleAction(insight.id, { code: 'DISMISS' })}
                                    className="absolute top-2 right-2 p-2 text-gray-600 hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
