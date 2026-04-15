'use client';

import { TrendingUp, Activity, Zap, Crown } from 'lucide-react';

export default function BrandPulse() {
    return (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Estado General</h3>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Nivel 3: Conexión & Confianza
                        <Crown className="w-5 h-5 text-yellow-400" />
                    </h2>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-400 font-bold text-sm">+18% Crecimiento</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Visual Circle Area */}
                <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Outer Ring */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-500" strokeDasharray="377" strokeDashoffset="100" strokeLinecap="round" />
                        </svg>
                        {/* Inner Pulse */}
                        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-white">72%</span>
                            <span className="text-[10px] text-gray-400 uppercase">Salud Marca</span>
                        </div>
                    </div>
                </div>

                {/* Vertical Stats */}
                <div className="col-span-2 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> Alcance Total</span>
                            <span className="text-white font-bold">125.4k</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Engagement</span>
                            <span className="text-white font-bold">8.2%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-xs text-gray-500 leading-relaxed italic border-l-2 border-primary/50 pl-3">
                            "Tu marca está entrando en fase de autoridad. La consistencia en video está generando un pico de confianza."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
