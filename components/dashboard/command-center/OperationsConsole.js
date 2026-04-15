'use client';

import { motion } from 'framer-motion';
import { Video, Share2, MessageCircle, BarChart, Bot, Crown } from 'lucide-react';

export default function OperationsConsole() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <ConsoleCard
                title="Producción"
                icon={Video}
                value="3"
                sub="En Curso"
                color="blue"
                progress={60}
            />
            <ConsoleCard
                title="Contenido"
                icon={Share2}
                value="12"
                sub="Publicados"
                color="purple"
                progress={85}
            />
            <ConsoleCard
                title="Leads"
                icon={MessageCircle}
                value="48"
                sub="Esta Semana"
                color="emerald"
                progress={45}
            />
            <ConsoleCard
                title="Alcance"
                icon={BarChart}
                value="+2.4k"
                sub="Impresiones"
                color="cyan"
                progress={92}
            />
            <ConsoleCard
                title="IA Auto"
                icon={Bot}
                value="ON"
                sub="Sistema Activo"
                color="amber"
                progress={100}
            />
            <ConsoleCard
                title="Nivel 4"
                icon={Crown}
                value="3.4k"
                sub="XP / 5k"
                color="yellow"
                progress={68}
            />
        </div>
    );
}

function ConsoleCard({ title, icon: Icon, value, sub, color, progress }) {
    const colors = {
        blue: 'text-blue-400 border-blue-500/30 shadow-blue-500/10 bg-blue-500',
        purple: 'text-purple-400 border-purple-500/30 shadow-purple-500/10 bg-purple-500',
        emerald: 'text-emerald-400 border-emerald-500/30 shadow-emerald-500/10 bg-emerald-500',
        cyan: 'text-cyan-400 border-cyan-500/30 shadow-cyan-500/10 bg-cyan-500',
        amber: 'text-amber-400 border-amber-500/30 shadow-amber-500/10 bg-amber-500',
        yellow: 'text-yellow-400 border-yellow-500/30 shadow-yellow-500/10 bg-yellow-500',
    };

    return (
        <div className={`bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all group overflow-hidden relative`}>

            {/* Top Indicator */}
            <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</span>
                <Icon className={`w-4 h-4 ${colors[color].split(' ')[0]}`} />
            </div>

            {/* Value */}
            <div className="relative z-10">
                <div className="text-2xl font-black text-white leading-none mb-1">{value}</div>
                <div className="text-[10px] text-gray-400 font-medium">{sub}</div>
            </div>

            {/* Progress Bar (Console Style) */}
            <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${colors[color].split(' ')[3]}`} // accessing bg-color
                />
            </div>

            {/* Interactive Hover Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-${color}-500 blur-xl`} />
        </div>
    );
}
