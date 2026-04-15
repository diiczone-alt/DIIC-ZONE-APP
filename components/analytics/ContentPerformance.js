'use client';

import { Play, Image as ImageIcon, FileText } from 'lucide-react';

export default function ContentPerformance() {
    const contents = [
        { id: 1, title: 'Reel: 5 Trucos de Marketing', type: 'VIDEO', views: '45.2K', engagement: '8.5%', icon: Play, color: 'text-cyan-400' },
        { id: 2, title: 'Carrousel: Psicología del Color', type: 'IMAGE', views: '32.1K', engagement: '6.2%', icon: ImageIcon, color: 'text-purple-400' },
        { id: 3, title: 'Story: Detrás de Cámaras', type: 'VIDEO', views: '18.5K', engagement: '12.1%', icon: Play, color: 'text-cyan-400' },
        { id: 4, title: 'Post: Frase Motivacional', type: 'IMAGE', views: '12.8K', engagement: '4.8%', icon: FileText, color: 'text-yellow-400' },
    ];

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Contenido Top Performance</h3>

            <div className="space-y-4">
                {contents.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-black text-gray-600 w-4">{index + 1}</span>
                            <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                                <div className="flex gap-2 text-[10px] text-gray-500 font-mono">
                                    <span>{item.type}</span>
                                    <span>•</span>
                                    <span>{item.views} Views</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-bold text-white">{item.engagement}</div>
                            <div className="text-[10px] text-gray-500">Engagement</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
