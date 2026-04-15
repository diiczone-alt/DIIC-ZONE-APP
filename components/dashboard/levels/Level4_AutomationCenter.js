'use client';

import { Zap, Bot, Clock, MessageCircle } from 'lucide-react';

export default function Level4_AutomationCenter() {
    return (
        <div className="space-y-6 mt-8">
            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 rounded-full bg-purple-500 block shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>
                    Centro de Automatización
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bot Status */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-[#0A0A12] border border-purple-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Asistente IA</h4>
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                            <span className="text-gray-400">WhatsApp</span>
                            <span className="text-white font-medium">Activo</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                            <span className="text-gray-400">Agendamiento</span>
                            <span className="text-white font-medium">Automático</span>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 flex flex-col justify-center items-center text-center group hover:border-purple-500/30 transition-colors">
                        <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <h4 className="text-3xl font-black text-white">12.5h</h4>
                        <p className="text-xs text-gray-500">Tiempo Ahorrado (Semana)</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 flex flex-col justify-center items-center text-center group hover:border-purple-500/30 transition-colors">
                        <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <h4 className="text-3xl font-black text-white">156</h4>
                        <p className="text-xs text-gray-500">Respuestas Automáticas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
