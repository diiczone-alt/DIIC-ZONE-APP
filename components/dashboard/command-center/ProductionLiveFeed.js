'use client';

import { Play, Check, Clock, ArrowRight } from 'lucide-react';

export default function ProductionLiveFeed() {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Producción en Vivo</h3>
                <button className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                    Ver Todo <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            <div className="space-y-3">
                <ProductionRow
                    title="Video Lanzamiento V2"
                    status="editing"
                    tag="Video"
                    date="2h"
                />
                <ProductionRow
                    title="Carrusel IA - Beneficios"
                    status="approved"
                    tag="Diseño"
                    date="5h"
                />
                <ProductionRow
                    title="Email Marketing - Promo"
                    status="scheduled"
                    tag="Copy"
                    date="Ayer"
                />
            </div>
        </div>
    );
}

function ProductionRow({ title, status, tag, date }) {
    const statusConfig = {
        editing: { label: 'En Edición', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
        approved: { label: 'Aprobado', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Check },
        scheduled: { label: 'Programado', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Play },
    };

    const { label, color, bg, border, icon: Icon } = statusConfig[status];

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">

            {/* Title & Tag */}
            <div className="md:col-span-5 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center border ${border}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</h4>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{tag}</span>
                </div>
            </div>

            {/* Status */}
            <div className="md:col-span-4 flex items-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg} border ${border}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{label}</span>
                </div>
            </div>

            {/* Action */}
            <div className="md:col-span-3 flex justify-end items-center gap-4">
                <span className="text-xs text-gray-600 font-mono hidden md:inline-block">Hace {date}</span>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white uppercase tracking-wider hover:bg-white text-center hover:text-black transition-all">
                    Ver
                </button>
            </div>
        </div>
    );
}
