'use client';

import { useState } from 'react';
import { Bot, Megaphone, ArrowRight, Zap, Target, BarChart3, Settings } from 'lucide-react';
import AiAgentDashboard from './AiAgentDashboard';
import MarketingAgentDashboard from './MarketingAgentDashboard';
import OptimizationAgentDashboard from './OptimizationAgentDashboard';

export default function AgentsHub() {
    const [selectedAgent, setSelectedAgent] = useState(null); // 'sales' | 'marketing'

    if (selectedAgent === 'sales') {
        return (
            <div className="relative">
                <button
                    onClick={() => setSelectedAgent(null)}
                    className="absolute top-0 right-0 z-10 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 hover:text-white flex items-center gap-2 border border-white/5 transition-colors"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Volver al Hub
                </button>
                <AiAgentDashboard />
            </div>
        );
    }

    if (selectedAgent === 'marketing') {
        return (
            <div className="relative">
                <button
                    onClick={() => setSelectedAgent(null)}
                    className="absolute top-0 right-0 z-10 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 hover:text-white flex items-center gap-2 border border-white/5 transition-colors"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Volver al Hub
                </button>
                <MarketingAgentDashboard />
            </div>
        );
    }

    if (selectedAgent === 'optimization') {
        return (
            <div className="relative">
                <button
                    onClick={() => setSelectedAgent(null)}
                    className="absolute top-0 right-0 z-10 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 hover:text-white flex items-center gap-2 border border-white/5 transition-colors"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Volver al Hub
                </button>
                <OptimizationAgentDashboard />
            </div>
        );
    }

    // Agent Selection Hub
    return (
        <div className="pb-20 animate-fade-in-up">
            <div className="text-center mb-12 mt-8">
                <h1 className="text-4xl font-black text-white mb-4">
                    Tus Agentes Inteligentes 🤖
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Selecciona qué miembro de tu equipo autónomo deseas gestionar hoy.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">

                {/* Sales Agent Card */}
                <div
                    onClick={() => setSelectedAgent('sales')}
                    className="bg-[#0A0A12] border border-white/5 p-8 rounded-3xl hover:border-cyan-500/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors" />

                    <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                        <Bot className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Agente de Ventas</h3>
                    <p className="text-gray-400 mb-6 min-h-[50px] text-sm">
                        Responde leads, califica prospectos, agenda citas y cierra ventas automáticamente 24/7.
                    </p>

                    <div className="space-y-3 mb-8">
                        <FeatureRow icon={Zap} text="Respuesta Inmediata" color="text-yellow-400" />
                        <FeatureRow icon={BarChart3} text="Embudo en Tiempo Real" color="text-blue-400" />
                        <FeatureRow icon={Target} text="Calificación de Leads" color="text-green-400" />
                    </div>

                    <div className="flex items-center gap-2 text-cyan-400 font-bold group-hover:translate-x-2 transition-transform">
                        Gestionar Agente <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Marketing Agent Card */}
                <div
                    onClick={() => setSelectedAgent('marketing')}
                    className="bg-[#0A0A12] border border-white/5 p-8 rounded-3xl hover:border-pink-500/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors" />

                    <div className="p-3 bg-pink-500/10 rounded-2xl w-fit text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                        <Megaphone className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Agente de Marketing</h3>
                    <p className="text-gray-400 mb-6 min-h-[50px] text-sm">
                        Tu estratega de contenido. Analiza tendencias y te dice qué publicar para vender más.
                    </p>

                    <div className="space-y-3 mb-8">
                        <FeatureRow icon={Target} text="Estrategia Personalizada" color="text-purple-400" />
                        <FeatureRow icon={Video} text="Generador de Ideas" color="text-red-400" />
                        <FeatureRow icon={BarChart3} text="Análisis de Tendencias" color="text-amber-400" />
                    </div>

                    <div className="flex items-center gap-2 text-pink-400 font-bold group-hover:translate-x-2 transition-transform">
                        Gestionar Agente <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Optimization Agent Card */}
                <div
                    onClick={() => setSelectedAgent('optimization')}
                    className="bg-[#0A0A12] border border-white/5 p-8 rounded-3xl hover:border-green-500/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors" />

                    <div className="p-3 bg-green-500/10 rounded-2xl w-fit text-green-400 mb-6 group-hover:scale-110 transition-transform">
                        <Settings className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Agente de Optimización</h3>
                    <p className="text-gray-400 mb-6 min-h-[50px] text-sm">
                        Mejora automáticamente el rendimiento. Ajusta horarios, presupuestos y formatos.
                    </p>

                    <div className="space-y-3 mb-8">
                        <FeatureRow icon={Zap} text="Ajustes Automáticos" color="text-green-400" />
                        <FeatureRow icon={BarChart3} text="Ranking de Contenido" color="text-blue-400" />
                        <FeatureRow icon={Target} text="Corrección de Errores" color="text-red-400" />
                    </div>

                    <div className="flex items-center gap-2 text-green-400 font-bold group-hover:translate-x-2 transition-transform">
                        Gestionar Agente <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function FeatureRow({ icon: Icon, text, color }) {
    return (
        <div className="flex items-center gap-3">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-gray-300 text-sm">{text}</span>
        </div>
    );
}

function Video({ className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
}
