'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, MessageCircle, DollarSign, Sparkles } from 'lucide-react';

const steps = [
    { id: 1, label: 'Lead Entrante', icon: Users, color: 'blue', count: 120 },
    { id: 2, label: 'Calif. IA', icon: Sparkles, color: 'purple', count: 85 },
    { id: 3, label: 'Contacto', icon: MessageCircle, color: 'yellow', count: 45 },
    { id: 4, label: 'Cierre', icon: DollarSign, color: 'green', count: 12 },
];

export default function LeadFlowVisualizer() {
    return (
        <div className="flex items-center justify-between w-full h-full p-4 overflow-x-auto relative">
            {/* Connecting Line Background */}
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-white/5 -translate-y-1/2 z-0" />

            {steps.map((step, index) => {
                const Icon = step.icon;
                const colors = {
                    blue: 'bg-blue-500 text-blue-100 shadow-blue-500/20',
                    purple: 'bg-purple-500 text-purple-100 shadow-purple-500/20',
                    yellow: 'bg-yellow-500 text-yellow-100 shadow-yellow-500/20',
                    green: 'bg-green-500 text-green-100 shadow-green-500/20',
                };

                return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 group">
                        {/* Node */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.2, type: 'spring' }}
                            className={`w-16 h-16 rounded-2xl ${colors[step.color]} flex items-center justify-center shadow-lg border-4 border-[#0B0B15] group-hover:scale-110 transition-transform cursor-pointer`}
                        >
                            <Icon className="w-8 h-8" />
                        </motion.div>

                        {/* Label & Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 + 0.2 }}
                            className="text-center"
                        >
                            <h4 className="text-white font-bold text-sm mb-1">{step.label}</h4>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-gray-300 font-mono">
                                {step.count}
                            </div>
                        </motion.div>

                        {/* Arrow (except last) */}
                        {index < steps.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 + 0.4 }}
                                className="absolute -right-[50%] top-1/2 -translate-y-1/2 text-gray-600"
                            >
                                <ArrowRight className="w-5 h-5 opacity-50" />
                            </motion.div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
