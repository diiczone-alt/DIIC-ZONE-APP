'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    LayoutDashboard, MessageSquare, Calendar as CalendarIcon, FileText,
    Users, ChevronRight, Bell, Search, Mic, Send, TrendingUp, AlertCircle, Bot, Share2
} from 'lucide-react';

export default function CommunityDashboard() {
    const STATS = [
        { label: 'Estado General', value: 'Óptimo', color: 'text-emerald-400', sub: 'Todo en orden' },
        { label: 'Nivel', value: 'Lvl. 3', color: 'text-indigo-400', sub: 'Crecimiento' },
        { label: 'Engagement', value: '+15%', color: 'text-fuchsia-400', sub: 'vs mes anterior' },
    ];

    const QUICK_ACTIONS = [
        { id: 'strategy', icon: Share2, label: 'Estrategia', color: 'bg-emerald-500/10 text-emerald-400' },
        { id: 'calendar', icon: CalendarIcon, label: 'Calendario', color: 'bg-purple-500/10 text-purple-400' },
        { id: 'content', icon: LayoutDashboard, label: 'Contenidos', color: 'bg-orange-500/10 text-orange-400' },
        { id: 'reports', icon: FileText, label: 'Ver Reportes', color: 'bg-blue-500/10 text-blue-400' },
        { id: 'team', icon: Users, label: 'Equipo', color: 'bg-pink-500/10 text-pink-400' },
    ];


    return (
        <div className="space-y-8">
            {/* Header & Status */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Panel Estratégico</h1>
                    <p className="text-gray-400 text-sm">Resumen de actividad y estado de cuenta al 24 Oct.</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-3 bg-[#0E0E18] border border-white/5 rounded-full text-gray-400 hover:text-white relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0E0E18]"></span>
                    </button>
                </div>
            </header>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATS.map((stat, i) => (
                    <div key={i} className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-600">{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Central Hub: Assistant & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Assistant Preview (2/3 width) - Now just a preview/link */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-1">
                        <div className="bg-[#151520] rounded-[20px] p-6 h-[300px] flex flex-col justify-center items-center text-center relative overflow-hidden group hover:bg-[#151520]/80 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Bot className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tu Agente IA está listo</h3>
                            <p className="text-gray-400 text-sm max-w-sm mb-6">Genera ideas de contenido, redacta copys y analiza tendencias en tiempo real.</p>
                            <Link href="/dashboard/community/agent">
                                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-600/20">
                                    Abrir Chat Interactivo
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Alerts / Updates */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Actualizaciones Recientes</h3>
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-4 bg-[#0E0E18] border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">Contenido Pendiente de Aprobación</div>
                                        <div className="text-xs text-gray-500">Hace 2 horas • Campaña Black Friday</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Quick Actions & Team (1/3 width) */}
                <div className="space-y-6">

                    {/* Quick Nav */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                        <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest text-gray-500">Accesos Rápidos</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {QUICK_ACTIONS.map(action => (
                                <Link
                                    key={action.id}
                                    href={`/dashboard/community/${action.id === 'content' ? 'contenidos' : action.id}`}
                                    className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center hover:scale-105 transition-transform ${action.color}`}
                                >
                                    <action.icon className="w-6 h-6" />
                                    <span className="text-xs font-bold">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Team On Duty */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-sm uppercase tracking-widest text-gray-500">Equipo Activo</h3>
                            <span className="text-xs text-green-400 font-bold flex items-center gap-1">● Online</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-10 h-10 rounded-full bg-gray-800" alt="Avatar" />
                                <div>
                                    <div className="text-sm font-bold text-white">Roberto G.</div>
                                    <div className="text-xs text-gray-500">Estratega Principal</div>
                                </div>
                                <button className="ml-auto p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400"><MessageSquare className="w-4 h-4" /></button>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" className="w-10 h-10 rounded-full bg-gray-800" alt="Avatar" />
                                <div>
                                    <div className="text-sm font-bold text-white">Ana M.</div>
                                    <div className="text-xs text-gray-500">Diseñadora Senior</div>
                                </div>
                                <button className="ml-auto p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400"><MessageSquare className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <Link href="/dashboard/community/team">
                            <button className="w-full mt-6 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors">
                                Ver Todo el Equipo
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
