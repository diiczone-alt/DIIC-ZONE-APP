'use client';

import { FileVideo, Music, Mic, Film, LayoutTemplate } from 'lucide-react';

export default function EditorIA_ProjectPanel() {
    return (
        <div className="h-full bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col">

            {/* Project Info */}
            <div className="mb-8">
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Proyecto Actual</div>
                <h2 className="text-xl font-black text-white leading-tight mb-1">Campaña Lanzamiento V2</h2>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
                    <LayoutTemplate className="w-3 h-3" /> Video Promocional
                </div>
            </div>

            {/* Material Assets */}
            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Material Detectado</div>

                <AssetGroup
                    icon={Film}
                    title="Toma Principal (A-Roll)"
                    count={5}
                    color="cyan"
                />
                <AssetGroup
                    icon={FileVideo}
                    title="B-Roll / Apoyo"
                    count={12}
                    color="blue"
                />
                <AssetGroup
                    icon={FileVideo}
                    title="Tomas Aéreas (Dron)"
                    count={3}
                    color="orange"
                />
                <AssetGroup
                    icon={Mic}
                    title="Audio / Voz"
                    count="Limpio"
                    type="status"
                    color="green"
                />
                <AssetGroup
                    icon={Music}
                    title="Música Sugerida"
                    count="4 Opciones"
                    type="status"
                    color="pink"
                />
            </div>

            {/* Storage Usage (Optional decoration) */}
            <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Espacio Proyecto</span>
                    <span>1.2 GB</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-gray-600" />
                </div>
            </div>
        </div>
    );
}

function AssetGroup({ icon: Icon, title, count, color, type = 'count' }) {
    const colors = {
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    };

    return (
        <div className={`p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.05] transition-colors`}>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {title}
                </span>
            </div>
            {type === 'count' ? (
                <span className="text-xs font-bold text-gray-500 bg-black/20 px-2 py-1 rounded-md">{count}</span>
            ) : (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${colors[color].split(' ')[0]}`}>
                    {count}
                </span>
            )}
        </div>
    );
}
