'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Video, DollarSign, TrendingUp, Filter, CheckCircle2, Clock, Star, ArrowUpRight } from 'lucide-react';
import { agencyService } from '@/services/agencyService';

export default function AdminProductionDashboard() {
    const [team, setTeam] = useState([]);
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const teamData = await agencyService.getTeam();
            const ratesData = await agencyService.getProductionRates();
            setTeam(teamData);
            setRates(ratesData);
            setLoading(false);
        };
        loadData();
    }, []);

    const editors = team.filter(m => m.role.includes('Editor'));
    const cms = team.filter(m => m.role.includes('Community'));

    return (
        <div className="space-y-8 p-6">
            <header>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Control de Producción y Pagos</h1>
                <p className="text-gray-500 font-medium">Gestión de tarifas creativas y rendimiento del equipo.</p>
            </header>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Producción (Mes)" value="$2,450" icon={DollarSign} color="green" />
                <StatCard title="Piezas Creadas" value="124" icon={Video} color="indigo" />
                <StatCard title="Editores Activos" value={editors.length} icon={Users} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rates Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0E0E18]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-indigo-500" /> Tarifas Vigentes
                        </h2>
                        <div className="space-y-4">
                            {rates.map(rate => (
                                <div key={rate.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                                    <div>
                                        <div className="text-sm font-bold text-white">{rate.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Por {rate.unit}</div>
                                    </div>
                                    <div className="text-lg font-black text-indigo-400">
                                        ${rate.price || (rate.price_range ? `${rate.price_range[0]}-${rate.price_range[1]}` : rate.price_min + '+')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Performance */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0E0E18]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Rendimiento de Editores</h2>
                        <div className="space-y-4">
                            {editors.map(editor => (
                                <EditorCard key={editor.id} editor={editor} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const colors = {
        green: 'text-green-500 bg-green-500/10',
        indigo: 'text-indigo-500 bg-indigo-500/10',
        purple: 'text-purple-500 bg-purple-500/10'
    };
    return (
        <div className="p-8 bg-[#0E0E18]/80 backdrop-blur-xl border border-white/5 rounded-[32px] hover:border-white/10 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{title}</div>
            <div className="text-4xl font-black text-white italic tracking-tighter">{value}</div>
        </div>
    );
}

function EditorCard({ editor }) {
    // Mock earnings calculation
    const pieces = editor.id === 'fausto' ? 45 : (editor.id === 'anthony' ? 32 : 28);
    const earnings = pieces * 2.5;

    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[24px] hover:bg-white/[0.04] transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl font-black text-indigo-400">
                    {editor.name[0]}
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">{editor.name}</h3>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-500">Editor Senior</span>
                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="text-green-500 font-bold">{pieces} piezas/mes</span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Ganancias Acum.</div>
                <div className="text-2xl font-black text-white italic tracking-tighter">${earnings.toFixed(2)}</div>
            </div>
        </div>
    );
}
