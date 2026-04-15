'use client';

import { Activity, Zap, Users, BarChart3, Radio } from 'lucide-react';

export default function StatusHologram() {
    return (
        <div className="relative w-full rounded-[2rem] overflow-hidden bg-[#0A0F1F] border border-white/10 shadow-2xl group">

            {/* Holographic Background Effect */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Titles */}
                <div className="text-center md:text-left space-y-2 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <Radio className="w-3 h-3" /> Sistema en Línea
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                        Centro de Control <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">De Tu Marca</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-sm md:text-lg">
                        Tu sistema creativo y comercial está en funcionamiento.
                    </p>
                </div>

                {/* Circular Indicators */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    <StatusCircle label="Salud Digital" percent={92} color="text-emerald-400" icon={Activity} />
                    <StatusCircle label="Producción" percent={65} color="text-blue-400" icon={Zap} />
                    <StatusCircle label="Flujo Comercial" percent={48} color="text-purple-400" icon={Users} />
                    <StatusCircle label="Automatización" percent={80} color="text-amber-400" icon={BarChart3} />
                </div>
            </div>
        </div>
    );
}

function StatusCircle({ label, percent, color, icon: Icon }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2 group/circle">
            <div className="relative w-20 h-20 flex items-center justify-center">
                {/* SVG Circle */}
                <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="40" cy="40" r={radius} stroke="#1f2937" strokeWidth="6" fill="transparent" />
                    <circle
                        cx="40" cy="40" r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${color} drop-shadow-[0_0_8px_currentColor] transition-all duration-1000 ease-out`}
                    />
                </svg>

                {/* Icon/Text in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Icon className={`w-5 h-5 ${color} mb-0.5 group-hover/circle:scale-110 transition-transform`} />
                    <span className="text-[10px] font-bold">{percent}%</span>
                </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider text-center">{label}</span>
        </div>
    );
}
