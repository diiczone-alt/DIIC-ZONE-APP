'use client';

import {
    User, Mail, MapPin, Tag, BrainCircuit,
    Calendar, DollarSign, FileText, ExternalLink
} from 'lucide-react';

export default function LeadPanel({ chat }) {
    if (!chat) return (
        <div className="w-[25%] bg-[#0E0E18] border-l border-white/5 hidden lg:flex items-center justify-center text-gray-500 text-xs text-center p-8">
            Selecciona un chat para ver la inteligencia del lead
        </div>
    );

    return (
        <div className="w-[25%] bg-[#0E0E18] border-l border-white/5 hidden lg:flex flex-col h-full overflow-y-auto custom-scrollbar">

            {/* Profile Section */}
            <div className="p-6 border-b border-white/5 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-2xl border border-indigo-500/30 mb-4 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                    {chat.name[0]}
                </div>
                <h3 className="text-white font-bold text-lg">{chat.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{chat.phone}</p>

                <div className="flex gap-2 w-full">
                    <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors">
                        Ver CRM
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors border border-white/5">
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* AI Analysis Card */}
            <div className="p-6 border-b border-white/5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> Lead Intelligence
                </h4>

                <div className="space-y-4">
                    <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] text-gray-500 block mb-1">Intención Detectada</span>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-white text-sm font-bold">Compra de Servicio</span>
                        </div>
                    </div>

                    <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] text-gray-500 block mb-1">Nicho / Sector</span>
                        <span className="text-white text-sm font-bold">Salud / Medicina</span>
                    </div>

                    <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] text-gray-500 block mb-1">Score de Urgencia</span>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 w-[85%] h-full rounded-full"></div>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[9px] text-gray-400">Bajo</span>
                            <span className="text-[9px] text-red-400 font-bold">85/100 (Alta)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 border-b border-white/5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Acciones Rápidas</h4>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group text-left">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-white">Generar Propuesta</span>
                            <span className="block text-[9px] text-gray-500 group-hover:text-gray-400">PDF Automatizado</span>
                        </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group text-left">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-white">Agendar Cita</span>
                            <span className="block text-[9px] text-gray-500 group-hover:text-gray-400">Google Calendar Sync</span>
                        </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group text-left">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-white">Crear Oportunidad</span>
                            <span className="block text-[9px] text-gray-500 group-hover:text-gray-400">Pipeline de Ventas</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Tags */}
            <div className="p-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" /> Etiquetas
                </h4>
                <div className="flex flex-wrap gap-2">
                    {['Lead Caliente', 'Médicos', 'Interesado'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/5 text-gray-300 text-[10px] rounded-lg border border-white/5">
                            {tag}
                        </span>
                    ))}
                    <button className="px-2 py-1 border border-dashed border-white/20 text-gray-500 hover:text-white text-[10px] rounded-lg hover:border-white/40 transition-colors">
                        + Agregar
                    </button>
                </div>
            </div>

        </div>
    )
}
