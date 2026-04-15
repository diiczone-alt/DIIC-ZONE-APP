'use client';

import { CheckCircle2, Circle, Settings, Link, AlertTriangle, FileText } from 'lucide-react';

export default function ChannelCard({ name, icon: Icon, status, color, bg, features, onConnect, type }) {
    const isConnected = status === 'connected';
    const isError = status === 'error';

    return (
        <div className="bg-[#151520] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all hover:-translate-y-1 group relative overflow-visible">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${bg} rounded-full blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity`}></div>

            {/* Premium Tooltip (Absolute on top Right) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                <div className="bg-black/90 border border-white/10 text-[10px] text-gray-300 px-2 py-1 rounded-lg shadow-xl backdrop-blur-md whitespace-nowrap">
                    Premium Feature
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center border border-white/5 shadow-inner`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    {/* Status Badge */}
                    {isConnected && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-400">Conectado</span>
                        </div>
                    )}
                    {isError && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-[10px] font-bold text-red-400">Error</span>
                        </div>
                    )}
                    {!isConnected && !isError && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                            <span className="text-[10px] font-bold text-gray-400">Sin Conexión</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{name}</h3>
                </div>

                <ul className="space-y-1 mb-5 min-h-[60px]">
                    {features && features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle2 className={`w-3 h-3 ${isConnected ? 'text-emerald-500/50' : 'text-gray-600'}`} />
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="flex gap-2">
                    <button
                        onClick={onConnect}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2
                        ${isConnected
                                ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                                : `bg-white text-black hover:bg-gray-200 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]`
                            } ${isError ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : ''}`}
                    >
                        {isConnected ? (
                            <>
                                <Settings className="w-3.5 h-3.5" /> Configurar
                            </>
                        ) : isError ? (
                            <>
                                <Settings className="w-3.5 h-3.5" /> Reconectar
                            </>
                        ) : (
                            <>
                                <Link className="w-3.5 h-3.5" /> Conectar
                            </>
                        )}
                    </button>

                    {/* Secondary Log Button */}
                    {isConnected && (
                        <button className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-gray-400 transition-colors" title="Ver Log de Conexión">
                            <FileText className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
