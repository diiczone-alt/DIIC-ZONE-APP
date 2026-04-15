'use client';

import {
    MessageCircle, Users, FileText, Send, Settings, Search,
    Activity, Zap, AlertCircle, BarChart2, Smartphone
} from 'lucide-react';

export default function WhatsAppOverview({ onAction }) {
    const logs = [
        { id: 1, event: 'Mensaje Recibido', details: 'Hola, quiero info de precios', time: 'Hace 2s', type: 'inbound' },
        { id: 2, event: 'IA Clasificación', details: 'Intención: Compra | Urgencia: Alta', time: 'Hace 3s', type: 'system' },
        { id: 3, event: 'Auto-Respuesta', details: 'Enviado template: Bienvenida_Ventas', time: 'Hace 4s', type: 'outbound' },
        { id: 4, event: 'Lead Actualizado', details: 'Juan Pérez -> Etapa: Calificando', time: 'Hace 1m', type: 'system' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* KPI Cards Row */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageCircle className="w-12 h-12 text-[#25D366]" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Mensajes Hoy</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-display font-bold text-white">1,245</span>
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1 rounded">+12%</span>
                    </div>
                </div>
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Leads Nuevos</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-display font-bold text-white">42</span>
                        <span className="text-[10px] text-blue-500 bg-blue-500/10 px-1 rounded">+5%</span>
                    </div>
                </div>
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-12 h-12 text-yellow-400" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Automatizados</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-display font-bold text-white">85%</span>
                        <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1 rounded">Alta Eficiencia</span>
                    </div>
                </div>
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                    </div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Requieren Atención</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-display font-bold text-white">3</span>
                        <span className="text-[10px] text-red-500 bg-red-500/10 px-1 rounded">Acción Inmediata</span>
                    </div>
                </div>
            </div>

            {/* Central Dashboard Grid */}
            <div className="grid grid-cols-3 gap-6">

                {/* Left: Quick Actions & Status Control */}
                <div className="col-span-1 space-y-6">
                    {/* Quick Broadcast */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Send className="w-4 h-4 text-indigo-400" /> Acciones Rápidas
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-[#151520] hover:bg-[#1A1A28] border border-white/5 rounded-xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xs font-bold text-white">Enviar Propuesta</span>
                                        <span className="block text-[10px] text-gray-500">A lead específico</span>
                                    </div>
                                </div>
                                <Settings className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-[#151520] hover:bg-[#1A1A28] border border-white/5 rounded-xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xs font-bold text-white">Publicar Estado</span>
                                        <span className="block text-[10px] text-gray-500">Visible por 24h</span>
                                    </div>
                                </div>
                                <Settings className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Active Agents */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-400" /> Equipo de Atención
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-[#151520] rounded-xl border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-white">Agente IA (Bot)</span>
                                        <span className="block text-[9px] text-emerald-400">Activo • 12 Chats</span>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-[#151520] rounded-xl border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">JP</div>
                                    <div>
                                        <span className="block text-xs font-bold text-white">Juan Pérez</span>
                                        <span className="block text-[9px] text-gray-400">Humano • 3 Chats</span>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center & Right: Live Log / Terminal */}
                <div className="col-span-2 bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#25D366]" /> Live Events Log
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] text-gray-500 px-2 py-1 bg-white/5 rounded border border-white/5">Realtime</span>
                            <span className="text-[10px] text-gray-500 px-2 py-1 bg-white/5 rounded border border-white/5">Filtrar</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#050511] rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar font-mono text-xs space-y-3">
                        {logs.map(log => (
                            <div key={log.id} className="flex gap-3 items-start group">
                                <span className="text-gray-600 min-w-[60px]">{log.time}</span>
                                <div className="flex-1">
                                    <span className={`font-bold mr-2 ${log.type === 'inbound' ? 'text-blue-400' :
                                        log.type === 'outbound' ? 'text-[#25D366]' :
                                            'text-purple-400'
                                        }`}>
                                        [{log.event}]
                                    </span>
                                    <span className="text-gray-400 group-hover:text-white transition-colors">{log.details}</span>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-gray-500">
                                    <Search className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <div className="flex gap-3 items-center animate-pulse opacity-50">
                            <span className="text-gray-700 min-w-[60px]">Ahora</span>
                            <span className="text-gray-600">Escuchando eventos...</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
