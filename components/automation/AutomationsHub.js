'use client';

import { Workflow, Zap, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AutomationsHub() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FlowCard
                title="Lead Nuevo → CRM"
                description="Crea automáticamente el lead cuando llega un mensaje."
                icon={Zap}
                active={true}
            />
            <FlowCard
                title="Respuesta 24h"
                description="Envía recordatorio si el lead no contesta en 1 día."
                icon={MessageSquare}
                active={false}
            />
            <FlowCard
                title="Cita → Calendario"
                description="Bloquea el horario y notifica al equipo."
                icon={Calendar}
                active={true}
            />

            {/* Add New Flow */}
            <Link href="/dashboard/automation/flow" className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer min-h-[160px] group">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                    <Workflow className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">Crear Nuevo Flujo</h4>
            </Link>
        </div>
    );
}

function FlowCard({ title, description, icon: Icon, active }) {
    return (
        <div className={`p-6 rounded-xl border transition-colors ${active ? 'bg-purple-900/10 border-purple-500/30' : 'bg-white/5 border-white/5'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${active ? 'bg-green-500' : 'bg-gray-600'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${active ? 'translate-x-5' : ''}`} />
                </div>
            </div>
            <h4 className="font-bold text-white mb-2">{title}</h4>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
    );
}
