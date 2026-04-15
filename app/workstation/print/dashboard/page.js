'use client';

import {
    Printer, Package, Clock, CheckCircle,
    MoreHorizontal, Download, AlertTriangle
} from 'lucide-react';

export default function PrintProviderDashboard() {
    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md z-10 shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-white">Production Hub</h1>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Operativo
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-white">Imprenta Rápida Centro</p>
                        <p className="text-[10px] text-gray-400">ID: PRT-2024-88</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-yellow-600/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30 font-bold text-xs">
                        IR
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Por Producir" value="8" icon={Clock} color="text-yellow-400" />
                    <StatCard title="En Proceso" value="12" icon={Printer} color="text-blue-400" />
                    <StatCard title="Listos / Entregar" value="5" icon={Package} color="text-emerald-400" />
                    <StatCard title="Incidencias" value="0" icon={AlertTriangle} color="text-red-400" />
                </div>

                {/* Orders Board */}
                <div className="space-y-8">

                    {/* New Orders Section */}
                    <Section title="Nuevas Órdenes (Por Aceptar)" count={3}>
                        <OrderCard
                            id="#ORD-001" client="Boutique Ella" product="Tarjetas Presentación x500"
                            status="new" date="Hace 10 min"
                        />
                        <OrderCard
                            id="#ORD-003" client="Dr. Pérez" product="Recetarios x100"
                            status="new" date="Hace 45 min"
                        />
                    </Section>

                    {/* Production Section */}
                    <Section title="En Producción" count={5}>
                        <OrderCard
                            id="#ORD-992" client="Evento Tech" product="Lona 3x2m"
                            status="production" date="Entrega: Hoy 5PM"
                        />
                        <OrderCard
                            id="#ORD-990" client="Burger King" product="Flyers A5 x2000"
                            status="production" date="Entrega: Mañana"
                        />
                    </Section>

                </div>

            </main>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-white">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

function Section({ title, count, children }) {
    return (
        <div>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                {title}
                <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-xs">{count}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
}

function OrderCard({ id, client, product, status, date }) {
    const isNew = status === 'new';

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-gray-500">{id}</span>
                <button className="text-gray-500 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-white font-bold mb-1 group-hover:text-yellow-400 transition-colors">{client}</h3>
            <p className="text-sm text-gray-400 mb-4">{product}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className={`text-[10px] font-bold uppercase ${isNew ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {date}
                </span>

                {isNew ? (
                    <button className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold rounded-lg transition-colors">
                        Aceptar
                    </button>
                ) : (
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                        <Download className="w-3 h-3" /> Archivos
                    </button>
                )}
            </div>
        </div>
    );
}
