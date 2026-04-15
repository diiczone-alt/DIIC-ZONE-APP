'use client';

import { CheckCircle2, ArrowRight, Lock, Cpu } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function AutomationCard({ service }) {
    const isLocked = service.status === 'locked';

    return (
        <GlassCard className={`p-0 rounded-3xl overflow-hidden flex flex-col h-full border ${isLocked ? 'border-white/5 opacity-70' : 'border-indigo-500/30'} transition-all hover:border-indigo-400/50 group bg-[#0A0A12]`}>
            {/* Header */}
            <div className={`p-6 ${isLocked ? 'bg-white/5' : 'bg-gradient-to-br from-indigo-900/20 to-purple-900/10'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                        <Cpu className={`w-6 h-6 ${isLocked ? 'text-gray-500' : 'text-indigo-400'}`} />
                    </div>
                    {isLocked ? (
                        <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <Lock className="w-3 h-3" />
                            Nivel {service.level}
                        </div>
                    ) : (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                            Disponible
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-indigo-300 transition-colors">
                    {service.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    {service.description}
                </p>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6 space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Beneficios</h4>
                    <ul className="space-y-2">
                        {service.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto">
                    <div className="mb-4">
                        <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Tecnologías</h4>
                        <div className="flex flex-wrap gap-2">
                            {service.tools.map((tool, i) => (
                                <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-400 font-mono">
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-white font-bold text-lg">
                            {typeof service.price === 'number' ? `$${service.price}` : service.price}
                        </div>
                        <button
                            disabled={isLocked}
                            className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isLocked
                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-indigo-950 hover:bg-indigo-50 hover:scale-105 shadow-lg shadow-indigo-500/20'
                                }`}
                        >
                            {isLocked ? 'Bloqueado' : 'Implementar'}
                            {!isLocked && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
