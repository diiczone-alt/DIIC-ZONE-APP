'use client';

import { Megaphone, ArrowUpRight, DollarSign } from 'lucide-react';

export default function CampaignResults() {
    // Mock data
    const campaigns = [
        { name: 'Ventas Urología', objective: 'Conversiones', spend: 80, result: '9 Citas', roas: '4.2x' },
        { name: 'Autoridad Dr.', objective: 'Alcance', spend: 40, result: '14k Personas', roas: '-' },
        { name: 'Promo Navidad', objective: 'Mensajes', spend: 120, result: '45 Chats', roas: '3.5x' },
    ];

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                    <Megaphone className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Resultados de Campañas</h3>
                    <p className="text-sm text-gray-400">Meta Ads Instant View</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/10">
                            <th className="pb-3 pl-2 font-bold">Campaña</th>
                            <th className="pb-3 font-bold text-right">Inversión</th>
                            <th className="pb-3 font-bold text-right">Resultado</th>
                            <th className="pb-3 pr-2 font-bold text-right text-green-500">ROAS</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {campaigns.map((camp, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                                <td className="py-4 pl-2 font-medium text-white group-hover:text-blue-400 transition-colors">
                                    {camp.name}
                                    <div className="text-[10px] text-gray-500 font-normal">{camp.objective}</div>
                                </td>
                                <td className="py-4 text-right text-gray-300 font-mono">${camp.spend}</td>
                                <td className="py-4 text-right text-white font-bold">{camp.result}</td>
                                <td className="py-4 pr-2 text-right font-mono text-green-400">{camp.roas}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
