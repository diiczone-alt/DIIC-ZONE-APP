'use client';

import { Video, Image as ImageIcon, LayoutGrid, ArrowUpRight, Trophy } from 'lucide-react';

export default function ContentPerformance() {
    // Mock data based on user request
    const bestContent = [
        { type: 'video', category: 'Mejor Video', title: 'Testimonio Cliente #2', result: '14k Vistas', icon: Video, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { type: 'design', category: 'Mejor Diseño', title: 'Carrusel Tratamiento', result: '420 Guardados', icon: LayoutGrid, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { type: 'post', category: 'Más Compartido', title: 'Tips de Salud #4', result: '85 Shares', icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' }
    ];

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                    <Trophy className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Rendimiento de Contenido</h3>
                    <p className="text-sm text-gray-400">¿Qué está funcionando mejor?</p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {bestContent.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{item.category}</div>
                                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-white">{item.result}</div>
                                <div className="text-[10px] text-green-400 flex items-center justify-end gap-1">
                                    Top 1% <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <button className="text-xs text-gray-400 hover:text-white transition-colors">Ver análisis detallado →</button>
            </div>
        </div>
    );
}
