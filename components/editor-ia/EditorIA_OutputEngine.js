'use client';

import { useState } from 'react';
import { Download, MonitorPlay, Sparkles, Lock, Share2, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditorIA_OutputEngine({ userPlan = 'FREE' }) { // 'FREE' or 'PRO'
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeVersion, setActiveVersion] = useState('MAIN'); // 'MAIN', 'REEL', 'BLOOPER'

    const handleExport = () => {
        setIsExporting(true);
        // Simulate render
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setIsExporting(false);
            }
        }, 200);
    };

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-8">

            {/* LEFT: PREVIEW & VERSIONS */}
            <div className="flex-1 flex flex-col gap-6">

                {/* Main Player Preview */}
                <div className="aspect-video bg-black rounded-3xl overflow-hidden relative border border-white/10 group shadow-2xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white/20 fill-white/10 group-hover:scale-110 transition-transform cursor-pointer" />
                    </div>

                    {/* WATERMARK SIMULATION (Freemium Logic) */}
                    {userPlan === 'FREE' && (
                        <div className="absolute top-4 right-4 opacity-80 pointer-events-none">
                            <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-2">
                                <img src="/logo-diic.svg" alt="DIIC" className="w-4 h-4" /> {/* Fallback if no svg */}
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Creado con DIIC IA</span>
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div className="text-white">
                            <h3 className="text-xl font-bold">Campaña Lanzamiento V1</h3>
                            <p className="text-sm text-gray-400">00:45 • 1080p</p>
                        </div>
                    </div>
                </div>

                {/* Versions Selector */}
                <div className="grid grid-cols-3 gap-4">
                    <VersionCard
                        id="MAIN"
                        label="Video Principal"
                        duration="00:45"
                        active={activeVersion === 'MAIN'}
                        onClick={() => setActiveVersion('MAIN')}
                    />
                    <VersionCard
                        id="REEL"
                        label="Versión Reel (9:16)"
                        duration="00:15"
                        icon={MonitorPlay}
                        active={activeVersion === 'REEL'}
                        onClick={() => setActiveVersion('REEL')}
                        badge="Auto-Generated"
                    />
                    <VersionCard
                        id="BLOOPER"
                        label="Bloopers / Extras"
                        duration="00:20"
                        icon={Sparkles}
                        active={activeVersion === 'BLOOPER'}
                        onClick={() => setActiveVersion('BLOOPER')}
                        locked={userPlan === 'FREE'}
                    />
                </div>
            </div>

            {/* RIGHT: EXPORT CONTROLS */}
            <div className="w-full lg:w-96 bg-[#0E0E18] border border-white/5 rounded-3xl p-8 flex flex-col">

                <h2 className="text-2xl font-black text-white mb-6">Exportar Proyecto</h2>

                <div className="space-y-6 flex-1">

                    {/* Format Info */}
                    <div className="space-y-3">
                        <InfoRow label="Resolución" value="1080p Full HD" />
                        <InfoRow label="FPS" value="30 fps" />
                        <InfoRow label="Formato" value="MP4 (H.264)" />
                        <InfoRow
                            label="Marca de Agua"
                            value={userPlan === 'FREE' ? 'ACTIVA (Plan Gratis)' : 'ELIMINADA (Plan Pro)'}
                            valueColor={userPlan === 'FREE' ? 'text-yellow-400' : 'text-emerald-400'}
                        />
                    </div>

                    {/* Pro Upsell (if free) */}
                    {userPlan === 'FREE' && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Quitar Marca de Agua</h4>
                                    <p className="text-xs text-slate-300 mb-3">Actualiza a PRO para exports limpios y bloopers.</p>
                                    <button className="text-xs font-bold bg-white text-purple-900 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
                                        Ver Planes Pro
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Main Action */}
                <div className="mt-8 space-y-3">
                    {isExporting ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Renderizando...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleExport}
                            className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide shadow-xl shadow-white/5"
                        >
                            <Download className="w-5 h-5" /> Exportar Video
                        </button>
                    )}

                    <button className="w-full py-3 bg-[#1A1A24] border border-white/5 text-gray-400 font-bold rounded-xl hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm">
                        <Share2 className="w-4 h-4" /> Compartir Link
                    </button>
                </div>

            </div>
        </div>
    );
}

function VersionCard({ id, label, duration, icon: Icon, active, onClick, locked, badge }) {
    return (
        <div
            onClick={!locked ? onClick : undefined}
            className={`p-4 rounded-xl border relative overflow-hidden transition-all group
                ${active
                    ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/50'
                    : locked
                        ? 'bg-[#0A0A12] border-white/5 opacity-60 cursor-not-allowed'
                        : 'bg-[#1A1A24] border-white/5 hover:border-white/20 cursor-pointer'}`}
        >
            {label === 'Video Principal' && !Icon && <Play className="w-5 h-5 text-gray-400 mb-3" />}
            {Icon && <Icon className={`w-5 h-5 mb-3 ${active ? 'text-cyan-400' : 'text-gray-400'}`} />}

            <div className={`font-bold text-sm mb-1 ${active ? 'text-white' : 'text-gray-300'}`}>{label}</div>
            <div className="text-[10px] text-gray-500 font-mono">{duration}</div>

            {locked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-500" />
                </div>
            )}

            {badge && !locked && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-[8px] font-bold uppercase rounded border border-purple-500/30">
                    {badge}
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value, valueColor = 'text-white' }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-sm text-gray-500 font-medium">{label}</span>
            <span className={`text-sm font-bold ${valueColor}`}>{value}</span>
        </div>
    );
}
