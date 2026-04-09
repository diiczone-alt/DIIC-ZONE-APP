'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Layers, Target, Calendar, 
    ArrowRight, Sparkles, Box,
    ChevronRight, Search
} from 'lucide-react';

export default function StrategySelectionGrid({ campaigns, onSelect, onClose }) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredCampaigns = campaigns.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#050511] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-5xl z-10">
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Tactical Control Center</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-black text-white italic uppercase tracking-tighter sm:text-5xl"
                    >
                        Parrilla de <span className="text-indigo-500">Contenido</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] max-w-xl mx-auto leading-relaxed"
                    >
                        Selecciona una estrategia activa para gestionar el plan táctico, fechas de publicación y flujos de producción.
                    </motion.p>
                </header>

                {/* Search & Filter */}
                <div className="max-w-md mx-auto mb-12 relative group">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative bg-black/40 border border-white/5 rounded-2xl flex items-center px-6 py-4 backdrop-blur-md">
                        <Search className="w-4 h-4 text-gray-500 mr-4" />
                        <input 
                            type="text" 
                            placeholder="BUSCAR ESTRATEGIA..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-black tracking-widest text-white outline-none flex-1 placeholder:text-gray-700 uppercase"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign, i) => (
                        <motion.button
                            key={campaign.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            onClick={() => onSelect(campaign.id)}
                            className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 text-left hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all shadow-xl perspective-1000"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 group-hover:text-indigo-500 transition-all -rotate-12 group-hover:rotate-0 translate-x-4 translate-y-[-4px] group-hover:translate-x-0 group-hover:translate-y-0">
                                <Layers className="w-12 h-12" />
                            </div>

                            <div className="relative z-10">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-4 inline-block ${
                                    campaign.status === 'activa' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                    {campaign.status || 'En Planificación'}
                                </span>
                                
                                <h3 className="text-xl font-bold text-white mb-2 leading-tight uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                                    {campaign.name}
                                </h3>
                                
                                <div className="flex gap-4 mt-6 pt-6 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Activos</span>
                                        <span className="text-xs font-bold text-indigo-400 mt-1">{campaign.nodes?.length || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Tipo</span>
                                        <span className="text-xs font-bold text-gray-400 mt-1">{campaign.type || 'Funnel'}</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        vence en 12d
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white scale-0 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/50">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}

                    {/* Quick Create CTA */}
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative p-8 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all overflow-hidden"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <Box className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Nueva Estrategia</h4>
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Inicia desde cero</p>
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
