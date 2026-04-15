'use client';

import {
    Briefcase, Calendar, DollarSign, Star,
    CheckCircle, Clock, TrendingUp, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModelDashboard() {
    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-white">Hola, Valentina</h1>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Perfil Verificado
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-colors text-sm">
                        Mi Perfil Público
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Briefcase} label="Castings Activos" value="3" change="Nuevo" color="text-orange-400" bg="bg-orange-500/10" />
                    <StatCard icon={Calendar} label="Próx. Eventos" value="2" change="Esta semana" color="text-violet-400" bg="bg-violet-500/10" />
                    <StatCard icon={DollarSign} label="Ganancias (Mes)" value="$1,250" change="+15%" color="text-emerald-400" bg="bg-emerald-500/10" />
                    <StatCard icon={Star} label="Reputación" value="5.0" change="Impecable" color="text-yellow-400" bg="bg-yellow-500/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Active Jobs */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-orange-400" /> Proyectos Asignados
                        </h2>

                        <div className="space-y-4">
                            <JobCard
                                title="Host Principal - Tech Summit"
                                client="Tech Corp"
                                date="25 Feb • 09:00 - 18:00"
                                status="confirmed"
                                fee="$450"
                            />
                            <JobCard
                                title="Sesión Fotos - Campaña Verano"
                                client="Moda 'Luxe'"
                                date="28 Feb • 14:00 - 18:00"
                                status="pending"
                                fee="$300"
                            />
                        </div>

                        <div className="mt-8 bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-400" /> Seguridad & Pagos
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-sm font-bold text-gray-300">Saldo Disponible</div>
                                    <div className="text-2xl font-black text-white">$850.00</div>
                                    <button className="mt-2 text-xs text-orange-400 hover:text-white transition-colors">Retirar Fondos</button>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-sm font-bold text-gray-300">Próximo Pago</div>
                                    <div className="text-2xl font-black text-white">28 Feb</div>
                                    <div className="text-xs text-gray-500">Automático a cuenta ****4589</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Agenda / Tips */}
                    <div className="space-y-6">
                        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Tu Agenda</h3>
                            {/* Simple Calendar List */}
                            <div className="space-y-3">
                                <div className="flex gap-3 items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-black/40 rounded-lg">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">FEB</span>
                                        <span className="text-lg font-black text-white">25</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Tech Summit</h4>
                                        <p className="text-xs text-orange-400">09:00 AM • Confirmado</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-black/40 rounded-lg">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">FEB</span>
                                        <span className="text-lg font-black text-white">28</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Campaña Verano</h4>
                                        <p className="text-xs text-gray-500">14:00 PM • Pendiente</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-900/20 to-pink-900/20 border border-orange-500/20 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Sube de Nivel 🚀</h3>
                            <p className="text-sm text-gray-400 mb-4">Completa el curso "Marca Personal para Talentos" y obtén la insignia PRO.</p>
                            <button className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-600/20">
                                Ir a Academia
                            </button>
                        </div>
                    </div>

                </div>

            </div>
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
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300`}>
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

function JobCard({ title, client, date, status, fee }) {
    return (
        <div className="group bg-[#0E0E18] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {status === 'confirmed' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                        {title}
                    </h3>
                    <span className="text-sm font-black text-white bg-white/5 px-2 py-0.5 rounded">
                        {fee}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{client}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" /> {date}
                </div>
            </div>
        </div>
    );
}
