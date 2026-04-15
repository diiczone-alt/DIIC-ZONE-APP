'use client';

import { User, Tag, Calendar, Mail, Phone, MapPin, ChevronRight, Briefcase } from 'lucide-react';

export default function InboxContext({ conversation }) {
    if (!conversation) return <div className="w-80 border-l border-white/5 bg-black/20 hidden xl:block" />;

    return (
        <div className="w-80 border-l border-white/5 bg-black/20 flex flex-col h-full hidden xl:flex">
            {/* Profile Header */}
            <div className="p-6 flex flex-col items-center border-b border-white/5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg">
                    {conversation.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-white">{conversation.name}</h3>
                <p className="text-sm text-gray-500">Lead Potencial • WA Business</p>

                <div className="flex gap-2 mt-4 w-full">
                    <ActionButton label="Tarea" />
                    <ActionButton label="Cita" primary />
                    <ActionButton label="Deal" />
                </div>
            </div>

            {/* CRM Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Embudo Status */}
                <Section title="Estado del Embudo">
                    <div className="w-full bg-white/5 rounded-lg p-1 flex items-center gap-1">
                        <Step active />
                        <Step active />
                        <Step current />
                        <Step />
                        <Step />
                    </div>
                    <p className="text-xs text-center mt-2 text-blue-300 font-medium">Etapa: Interesado</p>
                </Section>

                {/* Contact Info */}
                <Section title="Información de Contacto">
                    <InfoRow icon={Phone} value="+57 300 123 4567" />
                    <InfoRow icon={Mail} value="carlos.rod@gmail.com" />
                    <InfoRow icon={MapPin} value="Medellín, CO" />
                    <InfoRow icon={Briefcase} value="Restaurante La Finca" />
                </Section>

                {/* Tags */}
                <Section title="Etiquetas">
                    <div className="flex flex-wrap gap-2">
                        <TagBadge label="Lead Nuevo" color="blue" />
                        <TagBadge label="VIP" color="gold" />
                        <TagBadge label="Urgente" color="red" />
                        <button className="text-xs text-gray-500 hover:text-white underline decoration-dashed">+ Añadir etiqueta</button>
                    </div>
                </Section>

                {/* Next Steps */}
                <Section title="Siguientes Pasos">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-yellow-500 mb-1 text-xs font-bold uppercase">
                            <Calendar className="w-3 h-3" />
                            Recordatorio
                        </div>
                        <p className="text-sm text-gray-300">Hacer seguimiento de propuesta mañana a las 2 PM.</p>
                    </div>
                </Section>

            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h4>
            {children}
        </div>
    )
}

function ActionButton({ label, primary }) {
    return (
        <button className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${primary ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
            {label}
        </button>
    )
}

function InfoRow({ icon: Icon, value }) {
    return (
        <div className="flex items-center gap-3 py-1">
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-300 truncate">{value}</span>
        </div>
    )
}

function Step({ active, current }) {
    return (
        <div className={`h-1.5 flex-1 rounded-full ${active ? 'bg-blue-500' : current ? 'bg-blue-500 animate-pulse' : 'bg-white/10'}`} />
    )
}

function TagBadge({ label, color }) {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        red: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`text-[10px] px-2 py-1 rounded border ${colors[color] || 'bg-white/5 text-gray-300 border-white/10'}`}>
            <Tag className="w-2.5 h-2.5 inline mr-1" />
            {label}
        </span>
    )
}
