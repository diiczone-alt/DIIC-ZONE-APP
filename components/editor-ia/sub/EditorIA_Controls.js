'use client';

import { Settings2, Zap, MonitorPlay, Smile, Download, Share2 } from 'lucide-react';

export default function EditorIA_Controls() {
    return (
        <div className="h-full bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col gap-6">

            {/* Style Selector */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Settings2 className="w-3 h-3" /> Estilo de Edición
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <StyleButton label="Corporativo" active />
                    <StyleButton label="Dinámico" />
                    <StyleButton label="Educativo" />
                    <StyleButton label="Cinemático" />
                </div>
            </div>

            {/* Smart Actions */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" /> Acciones Rápidas
                </h3>
                <div className="space-y-2">
                    <ActionButton
                        icon={Zap}
                        title="Optimizar Ritmo"
                        desc="Elimina silencios y acelera"
                        color="yellow"
                    />
                    <ActionButton
                        icon={MonitorPlay}
                        title="Crear Reel Vertical"
                        desc="Auto-crop 9:16 para redes"
                        color="purple"
                    />
                    <ActionButton
                        icon={Smile}
                        title="Generar Bloopers"
                        desc="Compilado de descartes"
                        color="pink"
                    />
                </div>
            </div>

            {/* Export Section */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Exportar & Publicar</h3>
                <div className="grid grid-cols-1 gap-3">
                    <button className="w-full py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm shadow-lg shadow-white/5">
                        <Download className="w-4 h-4" /> Exportar Master
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                        <SocialButton platform="Instagram" />
                        <SocialButton platform="TikTok" />
                        <SocialButton platform="YouTube" />
                    </div>
                </div>
            </div>

        </div>
    );
}

function StyleButton({ label, active }) {
    return (
        <button className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all
            ${active
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
            {label}
        </button>
    );
}

function ActionButton({ icon: Icon, title, desc, color }) {
    const colors = {
        yellow: 'group-hover:text-yellow-400 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/30',
        purple: 'group-hover:text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/30',
        pink: 'group-hover:text-pink-400 group-hover:bg-pink-500/10 group-hover:border-pink-500/30',
    };

    return (
        <button className={`w-full p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3 group transition-all hover:bg-white/[0.05] ${colors[color]}`}>
            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 transition-colors ${colors[color].split(' ')[0]}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="text-left">
                <div className="text-sm font-bold text-gray-200 group-hover:text-white">{title}</div>
                <div className="text-[10px] text-gray-500">{desc}</div>
            </div>
        </button>
    );
}

function SocialButton({ platform }) {
    return (
        <button className="py-2 rounded-lg bg-[#1A1A24] border border-white/5 text-[10px] font-bold text-gray-400 uppercase hover:text-white hover:border-white/20 transition-all">
            {platform}
        </button>
    );
}
