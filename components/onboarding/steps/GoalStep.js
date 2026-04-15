'use client';

import { TrendingUp, Users, Award, Zap, DollarSign } from 'lucide-react';

export default function GoalStep({ onNext, updateData }) {
    const goals = [
        { id: 'clients', label: 'Conseguir más clientes', icon: Users, desc: 'Aumentar mi cartera y citas.' },
        { id: 'sales', label: 'Vender más', icon: DollarSign, desc: 'Incrementar facturación y cierre.' },
        { id: 'authority', label: 'Posicionarme como experto', icon: Award, desc: 'Crear marca personal sólida.' },
        { id: 'automate', label: 'Automatizar mi negocio', icon: Zap, desc: 'Ahorrar tiempo con sistemas.' },
        { id: 'scale', label: 'Escalar mi marca', icon: TrendingUp, desc: 'Crecer a nuevos mercados.' }
    ];

    const handleSelect = (goal) => {
        updateData({ goal });
        onNext();
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
            <div className="text-center mb-10 space-y-2">
                <h2 className="text-3xl font-black text-white">¿Qué quieres lograr?</h2>
                <p className="text-gray-400 text-lg">Selecciona tu objetivo principal para enfocar a tu equipo creativo.</p>
            </div>

            <div className="grid gap-4 flex-1 overflow-y-auto custom-scrollbar pb-10 content-start">
                {goals.map((g) => (
                    <button
                        key={g.id}
                        onClick={() => handleSelect(g.id)}
                        className="group flex items-center gap-6 p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all text-left"
                    >
                        <div className="p-4 rounded-xl bg-[#0A0A12] text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <g.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{g.label}</h3>
                            <p className="text-gray-500 group-hover:text-gray-300">{g.desc}</p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-indigo-400 font-bold text-2xl">
                            ›
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
