'use client';

import { motion } from 'framer-motion';
import {
    Bot, Zap, MessageSquare, PenTool, Sparkles,
    Play, Pause, Settings, RefreshCw
} from 'lucide-react';

export default function AIAutomationDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">IA & Automatización</h1>
                    <p className="text-gray-400">Tus agentes inteligentes trabajando 24/7.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/5">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-wide hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                        + Nuevo Agente
                    </button>
                </div>
            </div>

            {/* Active Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AgentCard
                    name="Bot de Ventas"
                    role="Cualificación de Leads"
                    status="Active"
                    platform="WhatsApp"
                    stats="142 conv. hoy"
                    icon={MessageSquare}
                    color="green"
                />
                <AgentCard
                    name="Generador de Copy"
                    role="Redacción Creativa"
                    status="Idle"
                    platform="Interno"
                    stats="Listo para usar"
                    icon={PenTool}
                    color="pink"
                />
                <AgentCard
                    name="Asistente de Agenda"
                    role="Gestión de Citas"
                    status="Active"
                    platform="Calendar"
                    stats="8 citas agendadas"
                    icon={Bot}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Workflow Logs */}
                <div className="lg:col-span-2 bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" /> Actividad Reciente
                        </h3>
                        <span className="text-xs font-bold text-gray-500 uppercase">En tiempo real</span>
                    </div>
                    <div className="space-y-2">
                        <LogItem time="10:42 AM" agent="Bot Ventas" action="Nuevo Lead Calificado" detail="Interesado en Plan Pro" />
                        <LogItem time="10:30 AM" agent="Agenda Bot" action="Reunión Confirmada" detail="Cliente: Ana García" />
                        <LogItem time="10:15 AM" agent="Copy Generator" action="Post Generado" detail="Tema: Tendencias 2024" />
                        <LogItem time="09:55 AM" agent="Bot Ventas" action="Respuesta Automática" detail="Consulta de precios" />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-6">Acciones Rápidas</h3>
                    <div className="space-y-3">
                        <QuickAction
                            title="Redactar Email en Frío"
                            icon={Sparkles}
                            desc="Genera secuencias de ventas"
                        />
                        <QuickAction
                            title="Resumir Reunión"
                            icon={MessageSquare}
                            desc="Transcribe y resume audio"
                        />
                        <QuickAction
                            title="Analizar Competencia"
                            icon={RefreshCw}
                            desc="Scan y reporte automático"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AgentCard({ name, role, status, platform, stats, icon: Icon, color }) {
    const isActive = status === 'Active';
    const colors = {
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-3xl bg-[#0E0E18] border border-white/5 relative overflow-hidden group`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {isActive ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> : <Pause className="w-3 h-3" />}
                    {status}
                </div>
            </div>

            <h3 className="text-xl font-black text-white mb-1">{name}</h3>
            <p className="text-sm text-gray-400 mb-4">{role}</p>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    <span className="block uppercase tracking-wider mb-0.5">Plataforma</span>
                    <span className="text-gray-300 font-bold">{platform}</span>
                </div>
                <div className="text-right text-xs text-gray-500">
                    <span className="block uppercase tracking-wider mb-0.5">Estado</span>
                    <span className="text-white font-bold">{stats}</span>
                </div>
            </div>
        </motion.div>
    );
}

function LogItem({ time, agent, action, detail }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <span className="text-xs font-mono text-gray-500">{time}</span>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="flex-1">
                <p className="text-sm font-bold text-white">
                    <span className="text-indigo-400 mr-2">[{agent}]</span>
                    {action}
                </p>
                <p className="text-xs text-gray-500">{detail}</p>
            </div>
        </div>
    );
}

function QuickAction({ title, icon: Icon, desc }) {
    return (
        <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all flex items-center gap-4 group text-left">
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{title}</h4>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </button>
    );
}
