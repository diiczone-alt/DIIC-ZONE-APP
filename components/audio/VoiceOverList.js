'use client';

import { useState } from 'react';
import { Mic, Play, Download, MoreVertical, FileText, CheckCircle } from 'lucide-react';

export default function VoiceOverList() {
    const [scripts] = useState([
        { id: 1, title: 'Intro Spot Navidad ver 3', talent: 'Lucía (Locutora)', duration: '0:30', status: 'Pending Record', script: 'Hola, soy Lucía...' },
        { id: 2, title: 'Tutorial Paso 2', talent: 'Carlos (Locutor)', duration: '1:45', status: 'Ready to Edit', script: 'En este paso aprenderemos...' },
        { id: 3, title: 'Outro Podcast Ep. 45', talent: 'Lucía (Locutora)', duration: '0:15', status: 'Completed', script: 'Gracias por escuchar...' },
    ]);

    return (
        <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mic className="w-5 h-5 text-pink-400" /> Gestión de Locuciones
                    </h3>
                    <p className="text-gray-400 text-sm">Scripts pendientes de grabación y edición.</p>
                </div>
                <button className="px-4 py-2 bg-pink-600/20 text-pink-300 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-pink-600/30 transition-colors">
                    + Nuevo Script
                </button>
            </header>

            <div className="space-y-3">
                {scripts.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors group">
                        <div className={`p-3 rounded-full ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                item.status === 'Ready to Edit' ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-gray-700/30 text-gray-400'
                            }`}>
                            <FileText className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold truncate">{item.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span>{item.talent}</span>
                                <span>•</span>
                                <span>{item.duration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    item.status === 'Ready to Edit' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                        'bg-gray-700/50 text-gray-400 border border-white/10'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.status !== 'Pending Record' && (
                                <button className="p-2 bg-white/10 hover:bg-pink-500 text-white rounded-lg transition-colors">
                                    <Play className="w-4 h-4" />
                                </button>
                            )}
                            <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
