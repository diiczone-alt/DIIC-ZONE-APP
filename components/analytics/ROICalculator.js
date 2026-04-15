'use client';

import { Search, Calculator, ArrowRight } from 'lucide-react';

const campaignData = [
    { id: 1, name: 'Campaña Urología Quito', platform: 'Meta Ads', spend: 120, leads: 45, sales: 800, roi: 566 },
    { id: 2, name: 'Promo Dental Blanqueamiento', platform: 'Instagram', spend: 200, leads: 60, sales: 1500, roi: 650 },
    { id: 3, name: 'Real Estate Luxury', platform: 'Google Ads', spend: 500, leads: 20, sales: 0, roi: -100 },
];

export default function ROICalculator() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-white">Calculadora & Rentabilidad</h3>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input className="bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none" placeholder="Buscar campaña..." />
                    </div>
                </div>
            </div>

            {/* Campaign ROI Table */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#151520] text-xs text-gray-500 uppercase tracking-wider">
                            <th className="p-4 font-bold">Campaña / Origen</th>
                            <th className="p-4 font-bold text-right">Inversión</th>
                            <th className="p-4 font-bold text-center">Leads</th>
                            <th className="p-4 font-bold text-right">Ventas ($)</th>
                            <th className="p-4 font-bold text-center">CPL</th>
                            <th className="p-4 font-bold text-right">ROI Real</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {campaignData.map(c => {
                            const cpl = (c.spend / (c.leads || 1)).toFixed(2);
                            const isPositive = c.roi > 0;

                            return (
                                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <p className="text-white font-bold text-sm">{c.name}</p>
                                        <p className="text-gray-500 text-xs">{c.platform}</p>
                                    </td>
                                    <td className="p-4 text-right text-gray-300">${c.spend}</td>
                                    <td className="p-4 text-center text-white">{c.leads}</td>
                                    <td className="p-4 text-right text-white font-bold">${c.sales}</td>
                                    <td className="p-4 text-center text-gray-400 text-xs">${cpl}</td>
                                    <td className="p-4 text-right">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {c.roi}%
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Smart Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl">
                    <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">✅ Para Escalar</h4>
                    <p className="text-sm text-gray-300 mb-4">La campaña <span className="text-white font-bold">Promo Dental</span> tiene un ROI excelente y bajo costo por lead. Recomendamos aumentar presupuesto un 20%.</p>
                    <button className="text-emerald-400 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        Aplicar Mejora <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
                    <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">⚠️ Atención Requerida</h4>
                    <p className="text-sm text-gray-300 mb-4">La campaña <span className="text-white font-bold">Real Estate Luxury</span> ha gastado $500 sin ventas. Revisa la segmentación o el creativo.</p>
                    <button className="text-red-400 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        Ver Detalles <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
