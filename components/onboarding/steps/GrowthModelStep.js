'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, ShieldCheck, Zap, Rocket } from 'lucide-react';

const levels = [
    { lvl: 1, name: 'Presencia', icon: Target, desc: 'Digitalización inicial' },
    { lvl: 2, name: 'Confianza', icon: ShieldCheck, desc: 'Reputación y Social Proof' },
    { lvl: 3, name: 'Autoridad', icon: TrendingUp, desc: 'Liderazgo en Nicho' },
    { lvl: 4, name: 'Automatización', icon: Zap, desc: 'Sistemas que trabajan solos' },
    { lvl: 5, name: 'Escalamiento', icon: Rocket, desc: 'Crecimiento Exponencial' },
];

export default function GrowthModelStep({ onNext }) {
    return (
        <div className="space-y-8 text-center h-full flex flex-col items-center">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Tu Roadmap de Crecimiento</h2>
                <p className="text-gray-400">DIIC ZONE te acompañará en estas 5 etapas.</p>
            </div>

            <div className="flex-1 w-full max-w-lg flex flex-col justify-center space-y-4">
                {levels.map((lvl, i) => (
                    <motion.div
                        key={lvl.lvl}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border ${i === 0 ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105' : 'bg-white/5 border-white/5 opacity-50'}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                            <lvl.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className={`font-bold ${i === 0 ? 'text-white' : 'text-gray-400'}`}>Nivel {lvl.lvl}: {lvl.name}</h3>
                            <p className="text-xs text-gray-500">{lvl.desc}</p>
                        </div>
                        {i === 0 && (
                            <div className="px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black uppercase text-white tracking-widest">
                                TÚ
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onNext}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
            >
                Entendido, ¡Vamos!
            </button>
        </div>
    );
}
