'use client';

import { 
    BarChart3, TrendingUp, Users, Eye, 
    MessageSquare, Share2, Heart, Bookmark,
    ArrowUpRight, ArrowDownRight, 
    Calendar, Filter, Download,
    Search, Play, Image as ImageIcon
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StrategyResultsPage() {
    const stats = [
        { label: 'Alcance Total', value: '1.2M', growth: '+12.5%', icon: Eye, color: 'blue' },
        { label: 'Interacciones', value: '85.4K', growth: '+18.2%', icon: Heart, color: 'rose' },
        { label: 'Seguidores Nuevos', interval: '30 días', value: '4,230', growth: '+5.4%', icon: Users, color: 'indigo' },
        { label: 'Engagement Rate', value: '4.8%', growth: '-0.2%', icon: TrendingUp, color: 'emerald' },
    ];

    const bestContent = [
        { 
            title: '3 Tips para tu salud dental', 
            type: 'Reel', 
            views: '125K', 
            likes: '8.2K', 
            shares: '1.5K', 
            saves: '2.1K',
            score: 'HIGH',
            color: 'emerald'
        },
        { 
            title: 'Caso de Éxito: Implante Carga Inmediata', 
            type: 'Video', 
            views: '45K', 
            likes: '3.1K', 
            shares: '420', 
            saves: '850',
            score: 'MEDIUM',
            color: 'amber'
        },
        { 
            title: '¿Miedo al dentista? Mira esto', 
            type: 'Reel', 
            views: '210K', 
            likes: '15.4K', 
            shares: '3.2K', 
            saves: '4.5K',
            score: 'HIGH',
            color: 'emerald'
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Métricas Inteligentes</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] tracking-[0.2em]">Análisis de Rendimiento & Predicciones</p>
                </div>
                
                <div className="flex gap-4">
                    <button className="h-12 px-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all">
                        <Calendar className="w-4 h-4" /> Últimos 30 Días
                    </button>
                    <button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[#0A0A12] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-all">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                            stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                            stat.color === 'rose' ? 'bg-rose-500/10 text-rose-400' :
                            stat.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400' :
                            'bg-emerald-500/10 text-emerald-400'
                        }`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-black text-white tracking-tighter">{stat.value}</span>
                            <span className={`text-[10px] font-bold mb-1.5 ${stat.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.growth}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Best Content Table */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Contenido de Mayor Impacto</h2>
                        <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                            Ver todos
                        </button>
                    </div>

                    <div className="space-y-4">
                        {bestContent.map((item, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-wrap items-center justify-between group hover:border-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                                        {item.type === 'Reel' ? <Play className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{item.title}</h4>
                                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{item.type} — {item.views} vistas</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">{item.likes}</div>
                                        <div className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Likes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">{item.shares}</div>
                                        <div className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Shares</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">{item.saves}</div>
                                        <div className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Saves</div>
                                    </div>
                                </div>

                                <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                    item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    item.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                }`}>
                                    Score: {item.score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <TrendingUp className="w-10 h-10 text-indigo-500 mb-6" />
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic mb-6">Recomendaciones IA</h2>
                        
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-2xl p-5 border-l-4 border-indigo-500">
                                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Horario Óptimo</h5>
                                <p className="text-xs text-gray-400 font-medium">Tus Reels rinden un 40% mejor los Martes y Jueves a las 7:00 PM.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-5 border-l-4 border-emerald-500">
                                <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Formato Ganador</h5>
                                <p className="text-xs text-gray-400 font-medium">Los videos educativos con storytelling tienen el mayor índice de "Saves".</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-5 border-l-4 border-rose-500">
                                <h5 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Alerta Engagement</h5>
                                <p className="text-xs text-gray-400 font-medium">La interacción en historias ha bajado un 5%. Prueba encuestas diarias.</p>
                            </div>
                        </div>

                        <button className="w-full mt-10 h-14 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase text-[10px] tracking-widest">
                            Inyectar a la Estrategia
                        </button>
                    </div>
                    
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
