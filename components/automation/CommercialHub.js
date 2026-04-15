'use client';

import { DollarSign, TrendingUp, CreditCard, PieChart } from 'lucide-react';

export default function CommercialHub() {
    return (
        <div className="flex flex-col items-center justify-center h-[500px] text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Conectividad Comercial</h3>
            <p className="text-gray-400 max-w-md mb-6">
                Aquí podrás registrar tus ventas, calcular tu ROI real y atribuir ingresos a tus campañas de Meta Ads.
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg opacity-50">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <TrendingUp className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-500">ROI Calculator</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <CreditCard className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-500">Sales Tracker</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <PieChart className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-500">Attribution</div>
                </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors">
                Configurar Pasarela
            </button>
        </div>
    );
}
