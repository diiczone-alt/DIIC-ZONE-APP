'use client';

import { 
    Video, Clapperboard, Palette, Mic, Smartphone, 
    Camera, User, Globe, Printer, Calendar 
} from 'lucide-react';

export default function TalentRoleStep({ onNext, updateData }) {
    const roles = [
        { id: 'editor', label: 'Editor de Video', icon: Video, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500' },
        { id: 'filmmaker', label: 'Filmmaker', icon: Clapperboard, color: 'text-red-400', bg: 'bg-red-500/10', border: 'hover:border-red-500' },
        { id: 'designer', label: 'Diseñador Gráfico', icon: Palette, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500' },
        { id: 'audio', label: 'Audio / Locución', icon: Mic, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'hover:border-yellow-500' },
        { id: 'community', label: 'Community Manager', icon: Smartphone, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500' },
        { id: 'photo', label: 'Fotografía', icon: Camera, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'hover:border-orange-500' },
        { id: 'model', label: 'Modelo / Talento', icon: User, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'hover:border-pink-500' },
        { id: 'web', label: 'Desarrollo Web', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500' },
        { id: 'print', label: 'Imprenta / Merch', icon: Printer, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500' },
        { id: 'event', label: 'Eventos / Prod', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500' },
    ];

    const handleSelect = (role) => {
        updateData({ role }); // Guardamos el rol/workstation
        onNext();
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="text-center mb-10 space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">Identidad Creativa</h2>
                <p className="text-gray-400 text-lg">Selecciona tu nodo de especialidad para configurar tu estación de trabajo.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto w-full flex-1 overflow-y-auto custom-scrollbar pb-10">
                {roles.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => handleSelect(r.id)}
                        className={`group p-6 rounded-2xl border border-white/10 bg-white/5 transition-all hover:scale-[1.02] hover:bg-[#0F0F16] ${r.border} flex flex-col items-center justify-center gap-4 text-center`}
                    >
                        <div className={`p-4 rounded-full ${r.bg} ${r.color} transition-transform group-hover:scale-110 shadow-lg`}>
                            <r.icon className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-white text-sm uppercase tracking-tight">{r.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
