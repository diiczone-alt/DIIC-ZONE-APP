'use client';

import {
    Calendar, CheckCircle2, Clock, Bot,
    MoreVertical, Phone, MessageCircle
} from 'lucide-react';

const tasks = [
    { id: 1, title: 'Llamar a Dr. Roberto', type: 'call', priority: 'High', due: 'Hoy', lead: 'Clínica Dental RM', auto: false },
    { id: 2, title: 'Enviar Propuesta corregida', type: 'email', priority: 'Medium', due: 'Mañana', lead: 'Inmobiliaria City', auto: false },
    { id: 3, title: 'Seguimiento de "Interesado"', type: 'whatsapp', priority: 'Low', due: 'Hoy', lead: 'Restaurante K', auto: true },
];

export default function FollowUpCenter() {
    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Centro de Seguimiento</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Manual Tasks */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Tareas Pendientes
                    </h3>
                    {tasks.map(task => (
                        <div key={task.id} className="bg-[#0E0E18] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-[#151520] transition-colors group">
                            <div className={`w-1 h-12 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                    {task.title}
                                    {task.auto && <Bot className="w-3 h-3 text-indigo-400" />}
                                </h4>
                                <p className="text-xs text-gray-500">{task.lead} • <span className="text-gray-400">{task.due}</span></p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20"><CheckCircle2 className="w-4 h-4" /></button>
                                <button className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Automation Rules */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-400" /> Reglas de Automatización (IA)
                    </h3>
                    <div className="bg-[#0E0E18] border border-white/5 rounded-xl p-4 opacity-50 pointer-events-none">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-white">Auto-FollowUp: 24h Sin Respuesta</span>
                            <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                        </div>
                        <p className="text-xs text-gray-500">Si un lead en estado "Interesado" no responde en 24h, enviar plantilla "Seguimiento Suave".</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
