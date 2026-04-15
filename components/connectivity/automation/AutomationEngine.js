'use client';

import { useState } from 'react';
import {
    Zap, Users, BrainCircuit, Layers, ArrowRight, checkCircle,
    MessageSquare, Calendar, FileText, ShoppingBag, Bell,
    Video, Image, CheckCircle, Clock, Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AutomationEngine() {
    const [activeLayer, setActiveLayer] = useState('all'); // 'all', 'client', 'commercial', 'production'

    return (
        <div className="space-y-8 pb-20 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        Motor de Automatización <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Sistema centralizado que gestiona las 3 capas de tu negocio: Cliente, Ventas y Producción.
                    </p>
                </div>
                <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-2 text-yellow-400 font-bold">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </div>
                    SISTEMA ACTIVO
                </div>
            </div>

            {/* Visual Layers Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LayerCard
                    title="Capa Cliente"
                    icon={Users}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    border="border-blue-500/20"
                    desc="Experiencia de usuario y notificaciones."
                    active={activeLayer === 'all' || activeLayer === 'client'}
                />
                <LayerCard
                    title="Capa Comercial"
                    icon={BrainCircuit}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                    border="border-purple-500/20"
                    desc="IA de Ventas, CRM y seguimiento."
                    active={activeLayer === 'all' || activeLayer === 'commercial'}
                />
                <LayerCard
                    title="Capa Producción"
                    icon={Layers}
                    color="text-pink-400"
                    bg="bg-pink-500/10"
                    border="border-pink-500/20"
                    desc="Tareas internas y flujo de trabajo."
                    active={activeLayer === 'all' || activeLayer === 'production'}
                />
            </div>

            {/* CAPA 1: CLIENTE */}
            {(activeLayer === 'all' || activeLayer === 'client') && (
                <section className="bg-[#0A0A12] border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-400" /> Automatizaciones para el Cliente
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <AutomationRow
                                trigger="Sube Archivo"
                                action="Guardar en Carpeta Drive"
                                icon={FileText}
                                color="text-blue-400"
                            />
                            <AutomationRow
                                trigger="Aprueba Contenido"
                                action="Programar Publicación"
                                icon={CheckCircle}
                                color="text-green-400"
                            />
                            <AutomationRow
                                trigger="Agenda Reunión"
                                action="Evento Calendar + Aviso"
                                icon={Calendar}
                                color="text-amber-400"
                            />
                        </div>

                        {/* Notifications Preview */}
                        <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <Bell className="w-4 h-4" /> Notificaciones Automáticas
                            </h4>
                            <div className="space-y-3">
                                <NotificationPreview
                                    text="Tu video del lunes pasó a revisión 🎬"
                                    time="Hace 2 min"
                                    app="WhatsApp"
                                />
                                <NotificationPreview
                                    text="Reunión confirmada: Mañana 10:00 AM 📅"
                                    time="Ayer"
                                    app="App"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CAPA 2: COMERCIAL */}
            {(activeLayer === 'all' || activeLayer === 'commercial') && (
                <section className="bg-[#0A0A12] border border-purple-500/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-purple-400" /> Motor Comercial (CRM + IA)
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <AutomationRow
                                trigger="Lead escribe (WhatsApp/IG)"
                                action="IA Responde Inmediatamente"
                                icon={MessageSquare}
                                color="text-green-400"
                            />
                            <AutomationRow
                                trigger="Detecta Interés"
                                action="Clasificar Lead en CRM"
                                icon={BrainCircuit}
                                color="text-purple-400"
                            />
                            <AutomationRow
                                trigger="No compra en 48h"
                                action="Secuencia de Seguimiento"
                                icon={Clock}
                                color="text-yellow-400"
                            />
                        </div>

                        {/* Flow Visualizer */}
                        <div className="bg-purple-900/10 rounded-2xl p-6 border border-purple-500/10 flex flex-col justify-center items-center relative">
                            <h4 className="absolute top-4 left-4 text-xs font-bold text-purple-400 uppercase">Flujo Activo</h4>

                            <div className="space-y-2 w-full max-w-[200px]">
                                <FlowStep text="Mensaje Entrante" active />
                                <div className="h-4 w-0.5 bg-purple-500/30 mx-auto" />
                                <FlowStep text="IA Analiza Intención" active />
                                <div className="h-4 w-0.5 bg-purple-500/30 mx-auto" />
                                <FlowStep text="Agenda Cita" highlight />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CAPA 3: PRODUCCIÓN */}
            {(activeLayer === 'all' || activeLayer === 'production') && (
                <section className="bg-[#0A0A12] border border-pink-500/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-pink-400" /> Automatización de Producción
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                <span className="flex-1">Evento Disparador</span>
                                <ArrowRight className="w-4 h-4" />
                                <span className="flex-1 text-right">Acción Interna</span>
                            </div>

                            <AutomationTaskRow
                                trigger="Nuevo Proyecto Video"
                                action="Crear Tarea Editor"
                                icon={Video}
                            />
                            <AutomationTaskRow
                                trigger="Fecha de Rodaje"
                                action="Aviso al Filmmaker"
                                icon={Calendar}
                            />
                            <AutomationTaskRow
                                trigger="Publicación Programada"
                                action="Aviso Community Mgr."
                                icon={Smartphone}
                            />
                        </div>

                        <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Estado del Sistema</h4>
                            <div className="space-y-4">
                                <SystemConnection name="WhatsApp API" status="connected" />
                                <SystemConnection name="Google Calendar" status="connected" />
                                <SystemConnection name="Meta Business" status="connected" />
                                <SystemConnection name="CRM Interno" status="connected" />
                            </div>
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}

// --- Sub-components ---

function LayerCard({ title, icon: Icon, color, bg, border, desc, active }) {
    return (
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${active ? `${bg} ${border} opacity-100 scale-100` : 'bg-[#0A0A12] border-white/5 opacity-50 scale-95'}`}>
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    );
}

function AutomationRow({ trigger, action, icon: Icon, color }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-black/30 ${color}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-gray-300 font-medium">{trigger}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
            <span className="text-white font-bold">{action}</span>
        </div>
    );
}

function NotificationPreview({ text, time, app }) {
    return (
        <div className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${app === 'WhatsApp' ? 'bg-green-500' : 'bg-blue-500'}`}>
                {app === 'WhatsApp' ? <MessageSquare className="w-4 h-4 text-white" /> : <Bell className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1">
                <p className="text-xs text-gray-200 font-medium leading-snug">{text}</p>
                <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-500">{app}</span>
                    <span className="text-[10px] text-gray-500">{time}</span>
                </div>
            </div>
        </div>
    );
}

function FlowStep({ text, active, highlight }) {
    return (
        <div className={`py-2 px-3 rounded-lg text-center text-xs font-bold border ${highlight ? 'bg-purple-500 text-white border-purple-500' : 'bg-black/20 text-gray-400 border-white/5'}`}>
            {text}
        </div>
    );
}

function AutomationTaskRow({ trigger, action, icon: Icon }) {
    return (
        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 flex-1">
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-300">{trigger}</span>
            </div>
            <ArrowRight className="w-3 h-3 text-pink-500" />
            <div className="flex-1 text-right">
                <span className="text-sm font-bold text-pink-400">{action}</span>
            </div>
        </div>
    );
}

function SystemConnection({ name, status }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">{name}</span>
            <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500 uppercase">{status === 'connected' ? 'On' : 'Off'}</span>
            </div>
        </div>
    );
}
