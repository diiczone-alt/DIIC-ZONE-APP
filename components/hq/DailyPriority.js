'use client';

import { CheckCircle2, Video, Users, Megaphone } from 'lucide-react';

export default function DailyPriority() {
    const queue = [
        { id: 1, type: 'delivery', title: 'Entrega Final: Reels Odontología', client: 'Clínica Dental', time: '14:00' },
        { id: 2, type: 'campaign', title: 'Lanzamiento: Meta Ads Retargeting', client: 'Inmobiliaria Top', time: '16:00' },
        { id: 3, type: 'meeting', title: 'Onboarding Nuevo Cliente', client: 'Restaurante K', time: '17:30' },
        { id: 4, type: 'approval', title: 'Revisión: Guiones TikTok', client: 'Marca Personal', time: '18:00' }
    ];

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Prioridad del Día</h3>
            </div>

            <div className="space-y-2">
                {queue.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-gray-500 font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-200 group-hover:text-white">{item.title}</h4>
                            <p className="text-xs text-gray-500">{item.client} • {item.time}</p>
                        </div>
                        <div className="text-gray-600 group-hover:text-indigo-400 transition-colors">
                            {item.type === 'delivery' && <Video className="w-4 h-4" />}
                            {item.type === 'campaign' && <Megaphone className="w-4 h-4" />}
                            {item.type === 'meeting' && <Users className="w-4 h-4" />}
                            {item.type === 'approval' && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
