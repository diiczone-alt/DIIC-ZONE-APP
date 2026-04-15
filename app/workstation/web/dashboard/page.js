'use client';

import {
    Layout, Globe, FileText, CheckCircle,
    Clock, AlertCircle, ArrowRight, MoreHorizontal
} from 'lucide-react';

export default function WebDevDashboard() {
    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md z-10 shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-white">Console — Web Dev</h1>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> Sistema Operativo
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 text-xs font-bold rounded-lg transition-colors border border-cyan-500/20">
                        + Nueva Tarea
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-700 border border-white/10" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <KpiCard title="Proyectos Activos" value="5" icon={Globe} color="text-cyan-400" />
                    <KpiCard title="Tickets Pendientes" value="12" icon={AlertCircle} color="text-amber-400" />
                    <KpiCard title="Entregas Semana" value="2" icon={CheckCircle} color="text-emerald-400" />
                    <KpiCard title="Carga de Trabajo" value="85%" icon={Layout} color="text-purple-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Active Projects List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Proyectos en Curso</h2>

                        <div className="space-y-4">
                            <ProjectItem
                                name="Boutique 'Ella' - E-commerce"
                                stage="Desarrollo (Frontend)"
                                percentage={65}
                                status="active"
                                dueDate="20 Feb"
                            />
                            <ProjectItem
                                name="Consultorio Dental"
                                stage="Diseño (Mockups)"
                                percentage={30}
                                status="review"
                                dueDate="25 Feb"
                            />
                            <ProjectItem
                                name="Landing Evento Tech"
                                stage="QA / Pruebas"
                                percentage={90}
                                status="active"
                                dueDate="Mañana"
                            />
                        </div>
                    </div>

                    {/* Pending Actions / Tickets */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                            Solicitudes Recientes
                            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">3 Urgentes</span>
                        </h3>

                        <div className="space-y-4">
                            <TicketItem
                                title="Cambio logo header"
                                project="Boutique 'Ella'"
                                time="Hace 30min"
                                type="fix"
                            />
                            <TicketItem
                                title="Integrar WhatsApp"
                                project="Consultorio Dental"
                                time="Hace 2h"
                                type="feat"
                            />
                            <TicketItem
                                title="Error en formulario"
                                project="Landing Evento"
                                time="Ayer"
                                type="bug"
                            />
                        </div>

                        <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            Ver todos los tickets
                        </button>
                    </div>

                </div>

            </main>
        </div>
    );
}

function KpiCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
            <div>
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-white">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

function ProjectItem({ name, stage, percentage, status, dueDate }) {
    return (
        <div className="group bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{name}</h3>
                    <p className="text-sm text-gray-400">{stage}</p>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>Progreso</span>
                    <span>{percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${status === 'review' ? 'bg-amber-500' : 'bg-cyan-500'}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-3.5 h-3.5" /> Entrega: {dueDate}
                </div>
                {status === 'review' && (
                    <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded font-bold">En Revisión</span>
                )}
            </div>
        </div>
    );
}

function TicketItem({ title, project, time, type }) {
    const colors = {
        fix: 'bg-blue-500/10 text-blue-400',
        feat: 'bg-purple-500/10 text-purple-400',
        bug: 'bg-red-500/10 text-red-400'
    };

    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className={`mt-1 w-2 h-2 rounded-full ${type === 'bug' ? 'bg-red-500' : type === 'feat' ? 'bg-purple-500' : 'bg-blue-500'}`} />
            <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-200">{title}</h4>
                <p className="text-xs text-gray-500">{project}</p>
            </div>
            <span className="text-[10px] text-gray-600 font-bold">{time}</span>
        </div>
    );
}
