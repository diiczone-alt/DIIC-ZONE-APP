'use client';

import {
    Calendar, Video, MapPin, Clock,
    MoreHorizontal, CheckCircle, AlertCircle, UploadCloud
} from 'lucide-react';

export default function EventDashboard() {
    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md z-10 shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-white">Production Hub — Events</h1>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Crew Activo
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 text-xs font-bold rounded-lg transition-colors border border-purple-500/20">
                        + Agendar Sencillo
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-700 border border-white/10" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* Agenda Banner */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Próxima Cobertura</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> Sábado 24 Feb</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /> 18:00 - 02:00</span>
                        </div>
                        <h3 className="text-xl font-black text-white mt-2">Boda Fernanda & Diego</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> Hacienda Santa Cruz</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 mb-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold text-white">Equipo Asignado</span>
                        </div>
                        <p className="text-xs text-gray-400">3 Cámaras + Drone</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Active List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Coberturas Activas</h2>

                        <div className="space-y-4">
                            <EventCard
                                name="Torneo Padel Interclubes"
                                date="Mañana, 08:00 AM"
                                type="Deportivo"
                                status="pending"
                            />
                            <EventCard
                                name="Lanzamiento Producto Tech"
                                date="Finalizado (Ayer)"
                                type="Corporativo"
                                status="uploading"
                            />
                        </div>
                    </div>

                    {/* Upload Status */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Estado de Subidas</h3>

                        <div className="space-y-6">
                            <UploadItem name="Lanzamiento Tech" progress={45} speed="12 MB/s" />
                            <UploadItem name="Sesión Retratos" progress={100} speed="Completado" />
                        </div>

                        <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors">
                            <UploadCloud className="w-4 h-4" /> Iniciar Nueva Subida
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}

function EventCard({ name, date, type, status }) {
    return (
        <div className="group bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 text-gray-400 border border-white/5">{type}</span>
                    {status === 'uploading' && <span className="text-[10px] text-yellow-500 flex items-center gap-1"><UploadCloud className="w-3 h-3" /> Subiendo Material</span>}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{name}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1"><Clock className="w-3.5 h-3.5" /> {date}</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
    );
}

function UploadItem({ name, progress, speed }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>{name}</span>
                <span className={progress === 100 ? 'text-emerald-400' : 'text-blue-400'}>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-1">
                <div
                    className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-[10px] text-gray-500 text-right">{speed}</p>
        </div>
    );
}
