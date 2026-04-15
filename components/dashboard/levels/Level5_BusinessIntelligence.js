'use client';

import { TrendingUp, PieChart, Wallet, Target } from 'lucide-react';

export default function Level5_BusinessIntelligence() {
    return (
        <div className="space-y-6 mt-8">
            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 rounded-full bg-red-500 block shadow-[0_0_15px_rgba(239,68,68,0.5)]"></span>
                    Inteligencia Empresarial
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* ROI Card */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-[#0A0A12] border border-red-500/20 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Retorno de Inversión (ROI)</p>
                                <h4 className="text-4xl font-black text-white mt-1">320%</h4>
                            </div>
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-red-500" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                            Por cada $1 invertido, generas <span className="text-white font-bold">$3.20</span>
                        </div>
                    </div>
                </div>

                {/* Sales Projection */}
                <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 flex flex-col justify-center relative group">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <Wallet className="w-6 h-6 text-emerald-400 mb-2" />
                        <h4 className="text-2xl font-bold text-white">$12.5k</h4>
                        <p className="text-xs text-gray-500">Proyección Mes</p>
                    </div>
                </div>

                {/* CAC */}
                <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 flex flex-col justify-center relative group">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <Target className="w-6 h-6 text-blue-400 mb-2" />
                        <h4 className="text-2xl font-bold text-white">$15</h4>
                        <p className="text-xs text-gray-500">Costo por Cliente</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
