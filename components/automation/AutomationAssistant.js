'use client';

import { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';

export default function AutomationAssistant({ userName = "Mike" }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-8 animate-fade-in mb-10">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 p-20 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0 animate-pulse-slow">
                    <Bot className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        Hola, {userName} <span className="text-2xl">👋</span>
                    </h3>
                    <p className="text-lg text-indigo-100/90 leading-relaxed max-w-2xl">
                        Soy tu asistente de <span className="font-bold text-indigo-300">Inteligencia Artificial</span>.
                        Aquí podemos automatizar procesos para que tu negocio crezca sin depender de ti.
                        <br className="hidden md:block" />
                        ¿Qué deseas implementar hoy?
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6">
                        <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-all flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            Quiero más ventas
                        </button>
                        <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-all">
                            Automatizar Citas
                        </button>
                        <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-all">
                            Mejorar Atención Cliente
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-0 right-0 p-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
