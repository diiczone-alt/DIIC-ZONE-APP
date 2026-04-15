'use client';

import { BrainCircuit, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function PredictiveInsights() {
    return (
        <div className="bg-gradient-to-br from-[#0E0E18] to-purple-900/10 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">DIIC Intelligence AI</h3>
            </div>

            <div className="space-y-4">
                <InsightItem
                    icon={Sparkles}
                    color="text-purple-400"
                    title="Tendencia Viral Detectada"
                    desc="Tus Reels con música 'Lo-Fi' tienen un 45% más de retención esta semana."
                />
                <InsightItem
                    icon={TrendingUp}
                    color="text-cyan-400"
                    title="Proyección de Crecimiento"
                    desc="Al ritmo actual, alcanzarás los 50K seguidores el 14 de Noviembre."
                />
                <InsightItem
                    icon={AlertTriangle}
                    color="text-yellow-400"
                    title="Alerta de Formato"
                    desc="Los carruseles estáticos han bajado un 12% en alcance. Prueba animarlos."
                />
            </div>
        </div>
    );
}

function InsightItem({ icon: Icon, color, title, desc }) {
    return (
        <div className="flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
            <div className={`mt-0.5 ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h4 className={`text-xs font-bold ${color} mb-1`}>{title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
