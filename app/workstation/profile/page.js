'use client';

import {
    User, Mail, Phone, MapPin,
    Briefcase, Award, GraduationCap,
    TrendingUp, DollarSign, Calendar
} from 'lucide-react';
import { LevelBadge, ReputationStats, LevelProgress } from '@/components/gamification/LevelComponents';

export default function ProfilePage() {
    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <div className="flex-1 overflow-y-auto p-8">

                {/* Header Profile */}
                <div className="bg-[#0E0E18] rounded-3xl p-8 border border-white/5 mb-8 flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl bg-gray-800 border-4 border-[#050511] overflow-hidden shadow-2xl">
                            <img src="https://i.pravatar.cc/300?u=diic" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-3 -right-3">
                            <LevelBadge level={3} />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-white mb-2">Carlos Filmmaker</h1>
                        <p className="text-purple-400 font-bold mb-4">Filmmaker Pro • Editor Nivel 2</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Ciudad de México</span>
                            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> carlos@diic.zone</span>
                            <span className="flex items-center gap-2 text-emerald-400 font-bold"><TrendingUp className="w-4 h-4" /> Top 15% Desempeño</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ReputationStats score={980} onTime={95} rating={4.9} />
                        </div>
                    </div>

                    <div className="w-full md:w-80 bg-white/5 rounded-2xl p-6 border border-white/5">
                        <h3 className="text-white font-bold mb-4">Progreso a Nivel Senior</h3>
                        <LevelProgress currentPoints={3450} nextLevelPoints={5000} nextLevelLabel="Nivel 4 • Senior" />
                        <div className="mt-4 text-xs text-gray-400 space-y-2">
                            <p>✅ 15 Proyectos Entregados</p>
                            <p>✅ 4.8+ Rating Promedio</p>
                            <p>⬜ Completar Curso: "Liderazgo Creativo"</p>
                        </div>
                    </div>
                </div>

                {/* Stats & History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Financials & Skills */}
                    <div className="space-y-6">
                        <div className="bg-[#0E0E18] rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-400" /> Finanzas
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Ingresos Totales</span>
                                    <span className="text-white font-bold">$12,450.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Este Mes</span>
                                    <span className="text-emerald-400 font-bold text-lg">$1,200.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Tarifa Actual (Nivel 3)</span>
                                    <span className="text-purple-400 font-bold">$450 / día</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0E0E18] rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-blue-400" /> Certificaciones
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center"><Award className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Canon Pro Master</p>
                                        <p className="text-xs text-gray-500">2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center"><Award className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Color Grading 101</p>
                                        <p className="text-xs text-gray-500">2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Project History */}
                    <div className="lg:col-span-2 bg-[#0E0E18] rounded-2xl p-8 border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-gray-400" /> Historial de Proyectos
                            </h2>
                            <select className="bg-black/30 border border-white/10 rounded-lg text-xs text-gray-400 px-3 py-1.5 focus:outline-none">
                                <option>Últimos 6 meses</option>
                                <option>Todo el historial</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 1 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                            {i === 1 ? 'Active' : 'Done'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">Campaña Corporativa Tech {i}</h3>
                                            <p className="text-xs text-gray-400">Cliente: Empresa Global • Rol: Filmmaker B</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-emerald-400 font-bold text-sm">+$350.00</p>
                                        <div className="flex items-center gap-1 justify-end text-xs text-amber-500">
                                            <Star className="w-3 h-3 fill-current" /> 5.0
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
