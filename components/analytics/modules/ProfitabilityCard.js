'use client';

import { DollarSign, TrendingUp, PieChart } from 'lucide-react';

export default function ProfitabilityCard() {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Rentabilidad Real</h3>
                    <p className="text-sm text-gray-400">Finanzas Integradas</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Inversión Mkt</div>
                    <div className="text-2xl font-bold text-white">$300</div>
                    <div className="text-xs text-red-400 mt-1 flex items-center font-bold">
                        Ads + Agencia
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Ventas Generadas</div>
                    <div className="text-2xl font-bold text-green-400">$1,250</div>
                    <div className="text-xs text-green-600 mt-1 font-bold">
                        Ingresos Brutos
                    </div>
                </div>
            </div>

            <div className="mt-auto relative z-10">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 flex justify-between items-center">
                    <div>
                        <div className="text-sm text-green-200 font-bold uppercase tracking-wider mb-1">ROI Total</div>
                        <div className="text-[10px] text-green-400/70">Retorno de Inversión</div>
                    </div>
                    <div className="text-4xl font-black text-green-400 tracking-tight">
                        316%
                    </div>
                </div>
            </div>
        </div>
    );
}
