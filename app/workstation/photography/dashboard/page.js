'use client';

import Link from 'next/link';
import {
    Camera, Image as ImageIcon, Map, Calendar,
    Plus, Clock, CheckCircle, AlertCircle, ArrowRight,
    MapPin
} from 'lucide-react';

export default function PhotographerDashboard() {
    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md z-10">
                <div>
                    <h1 className="text-lg font-bold text-white">Hola, Alex</h1>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" /> Panel de Fotógrafo
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700 border border-white/10" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Camera} label="Sesiones Hoy" value="2" change="+1" color="text-pink-400" bg="bg-pink-500/10" />
                    <StatCard icon={CheckCircle} label="Entregas Listas" value="15" change="+5" color="text-emerald-400" bg="bg-emerald-500/10" />
                    <StatCard icon={Clock} label="En Edición" value="450" change="Fotos" color="text-indigo-400" bg="bg-indigo-500/10" />
                    <StatCard icon={AlertCircle} label="Pendiente Selección" value="3" change="Clientes" color="text-amber-400" bg="bg-amber-500/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Próximas Sesiones Asignadas</h2>
                            <Link href="/workstation/photography/sessions" className="text-xs text-pink-400 hover:text-white transition-colors">
                                Ver Agenda Completa
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <SessionCard
                                client="Marca de Ropa 'Urban'"
                                type="Fotografía de Producto"
                                date="Hoy, 14:00"
                                status="confirmed"
                                location="Estudio A"
                            />
                            <SessionCard
                                client="Dr. Roberto Perez"
                                type="Retrato Corporativo"
                                date="Mañana, 10:00"
                                status="pending"
                                location="Consultorio (Exterior)"
                            />
                            <SessionCard
                                client="Boda Civil: Ana & Juan"
                                type="Cobertura Evento"
                                date="Sábado, 16:00"
                                status="confirmed"
                                location="Registro Civil Central"
                            />
                        </div>
                    </div>

                    {/* Quick Activity / Notifications */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-gray-400" /> Entregas Recientes
                        </h3>

                        <div className="space-y-4">
                            <DeliveryItem
                                title="Campaña Verano 2026"
                                count="120 Fotos"
                                status="delivered"
                                time="Hace 2h"
                            />
                            <DeliveryItem
                                title="Menú Restaurante Italiano"
                                count="45 Fotos"
                                status="uploading"
                                time="Subiendo..."
                            />
                            <DeliveryItem
                                title="Evento Lanzamiento Tech"
                                count="350 Fotos"
                                status="selection"
                                time="Esperando Cliente"
                            />
                        </div>

                        <Link href="/workstation/photography/gallery">
                            <button className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                                Ir a Gestión de Archivos
                            </button>
                        </Link>
                    </div>

                </div>

            </main>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, change, color, bg }) {
    return (
        <div className={`p-6 rounded-2xl border border-white/5 ${bg} flex flex-col justify-between group hover:border-white/10 transition-colors`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 ${change.includes('+') ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {change}
                </span>
            </div>
            <div>
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
            </div>
        </div>
    );
}

function SessionCard({ client, type, date, status, location }) {
    return (
        <div className="group bg-[#0E0E18] border border-white/5 hover:border-pink-500/30 rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${status === 'confirmed' ? 'bg-pink-500/10 text-pink-500' : 'bg-gray-800 text-gray-500'}`}>
                {date.split(',')[0].substring(0, 3)}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors">
                        {client}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {status}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{type}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" /> {location} • <Clock className="w-3 h-3" /> {date.split(',')[1]}
                </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
        </div>
    );
}

function DeliveryItem({ title, count, status, time }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-800 border border-white/10" />
                <div>
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-white">{title}</h4>
                    <p className="text-[10px] text-gray-500">{count}</p>
                </div>
            </div>
            <div className="text-right">
                <span className={`block text-[10px] font-bold uppercase ${status === 'delivered' ? 'text-emerald-400' : status === 'uploading' ? 'text-blue-400 animate-pulse' : 'text-amber-400'}`}>
                    {status}
                </span>
                <span className="text-[10px] text-gray-600">{time}</span>
            </div>
        </div>
    );
}
