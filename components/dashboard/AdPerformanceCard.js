'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, DollarSign, MousePointer2, UserPlus, Zap } from 'lucide-react';

export default function AdPerformanceCard({ campaigns = [] }) {
    
    // Si no hay campañas, mostramos estado de "Potencial"
    if (!campaigns || campaigns.length === 0) {
        return (
            <div className="bg-[#11111d] border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <Target className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Sin Campañas Activas</h3>
                    <p className="text-sm text-gray-400 font-bold max-w-[200px] leading-relaxed">
                        Tu marca tiene un potencial de crecimiento del 45% si activas tu primera campaña de captación.
                    </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-lg shadow-indigo-600/20">
                    Lanzar Campaña
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#0A0A1F] to-[#050510] border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group h-full shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Rendimiento Ads</h2>
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">Live • Optimizando con IA</p>
                    </div>
                </div>
                <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Activo</span>
                </div>
            </div>

            {/* Campaign List */}
            <div className="space-y-6">
                {campaigns.map((camp, index) => (
                    <motion.div 
                        key={camp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group/camp"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-tight">{camp.name}</h4>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{camp.objective}</p>
                            </div>
                            <span className="text-[10px] font-black text-white">${camp.budget_daily}/día</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 rounded-xl bg-black/40">
                                <p className="text-[7px] font-black text-gray-500 uppercase mb-1">Inversión</p>
                                <p className="text-[10px] font-black text-indigo-400">${Number(camp.spend || 0).toFixed(0)}</p>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-black/40">
                                <p className="text-[7px] font-black text-gray-500 uppercase mb-1">Clicks</p>
                                <p className="text-[10px] font-black text-white">{camp.clicks || 0}</p>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                <p className="text-[7px] font-black text-indigo-400 uppercase mb-1">Leads</p>
                                <p className="text-[10px] font-black text-white">{camp.conversions || 0}</p>
                            </div>
                        </div>

                        {/* Progress Bar (Optimizando...) */}
                        <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between text-[7px] font-black uppercase tracking-widest text-gray-500">
                                <span>Eficiencia de Campaña</span>
                                <span className="text-emerald-400">Excelente</span>
                            </div>
                            <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Stats Footer */}
            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-center">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">ROAS</p>
                    <p className="text-sm font-black text-white italic">4.2x</p>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">CPA GLOBAL</p>
                    <p className="text-sm font-black text-emerald-400 italic">$1.70</p>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">ALCANCE</p>
                    <p className="text-sm font-black text-white italic">24.5K</p>
                </div>
            </div>
        </div>
    );
}
