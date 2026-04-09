'use client';

import { useState } from 'react';
import {
    Clapperboard, Users, DollarSign, TrendingUp,
    Plus, Search, Filter, ChevronRight,
    Calendar, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { VIDEO_TYPES, MOCK_VIDEO_PROJECTS } from '@/data/videoProduction';

export default function VideoProductionDashboard() {
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-8 w-full h-full p-8 overflow-y-auto custom-scrollbar relative">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Proyectos Activos" value="12" sub="8 en producción" icon={Clapperboard} color="text-indigo-400" />
                <StatCard title="Utilidad proyectada" value="$2,450" sub="Este mes" icon={TrendingUp} color="text-emerald-400" />
                <StatCard title="Tiempo promedio" value="4.2 días" sub="Entrega final" icon={Clock} color="text-blue-400" />
                <StatCard title="Creativos activos" value="6" sub="Filmmakers + Editores" icon={Users} color="text-purple-400" />
            </div>

            {/* Main Section */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Clapperboard className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Producción Audiovisual</h3>
                            <p className="text-xs text-gray-500">Control de proyectos, costos y utilidad</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar proyecto..."
                                className="bg-[#151520] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors w-64"
                            />
                        </div>
                        <button className="p-2 bg-[#151520] border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all">
                            <Plus className="w-4 h-4" /> Nuevo Video
                        </button>
                    </div>
                </div>

                {showModal && (
                    <AddProjectModal onClose={() => setShowModal(false)} />
                )}

                {/* Projects Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#151520]/50 text-xs text-gray-500 uppercase tracking-widest font-bold">
                                <th className="p-4 pl-6">ID / Proyecto</th>
                                <th className="p-4">Tipo de Video</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Staff Asignado</th>
                                <th className="p-4">Rentabilidad</th>
                                <th className="p-4 text-right pr-6">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_VIDEO_PROJECTS.map((project) => {
                                const typeInfo = VIDEO_TYPES.find(v => v.id === project.type);
                                return (
                                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                        <td className="p-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm">{project.client}</span>
                                                <span className="text-gray-500 text-[10px] font-mono">{project.id}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-indigo-400 text-xs font-bold">{typeInfo?.name}</span>
                                                <span className="text-gray-500 text-[10px]">{typeInfo?.use}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={project.status} />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center -space-x-2">
                                                <StaffAvatar name={project.filmmaker} role="Filmmaker" />
                                                <StaffAvatar name={project.editor} role="Editor" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold text-sm">${project.priceClient}</span>
                                                    <span className="text-emerald-400 text-[10px] font-bold">+{project.utility}%</span>
                                                </div>
                                                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                                                    <div className="h-full bg-indigo-500" style={{ width: '60%' }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, icon: Icon, color }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-600 text-xs font-medium">{sub}</p>
        </div>
    )
}

function StatusBadge({ status }) {
    const styles = {
        'Nuevo': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Producción': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'Edición': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'Aprobación': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Entregado': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };

    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
            {status}
        </span>
    );
}

function AddProjectModal({ onClose }) {
    const [selectedType, setSelectedType] = useState(VIDEO_TYPES[0].id);
    const typeInfo = VIDEO_TYPES.find(v => v.id === selectedType);

    const internalCost = typeInfo.costFilmmaker + typeInfo.costEditor + typeInfo.costDesign;
    const utility = typeInfo.basePriceClient - internalCost;
    const utilityPerc = ((utility / typeInfo.basePriceClient) * 100).toFixed(1);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-[#0E0E18] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151520]">
                    <h3 className="text-white font-bold text-lg">Nuevo Proyecto de Video</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">&times;</button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Cliente</label>
                        <input type="text" placeholder="Nombre de la marca..." className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" />
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Tipo de Contenido</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none"
                        >
                            {VIDEO_TYPES.map(type => (
                                <option key={type.id} value={type.id}>{type.name} - ${type.basePriceClient}</option>
                            ))}
                        </select>
                    </div>

                    {/* Auto-calcs Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Costo Interno</p>
                            <p className="text-xl font-bold text-white">${internalCost}</p>
                        </div>
                        <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                            <p className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Utilidad ({utilityPerc}%)</p>
                            <p className="text-xl font-bold text-emerald-400">${utility}</p>
                        </div>
                    </div>

                    <div className="bg-[#151520] p-4 rounded-2xl space-y-2 border border-white/5">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Desglose de Costos Sueridos</p>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Filmmaker:</span>
                            <span className="text-white font-mono">${typeInfo.costFilmmaker}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Editor:</span>
                            <span className="text-white font-mono">${typeInfo.costEditor}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Diseño:</span>
                            <span className="text-white font-mono">${typeInfo.costDesign}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#151520] border-t border-white/5 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 border border-white/10 text-gray-400 font-bold rounded-xl text-sm hover:text-white transition-all">Cancelar</button>
                    <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all">Crear & Notificar</button>
                </div>
            </div>
        </div>
    );
}

function StaffAvatar({ name, role }) {
    return (
        <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-[#0E0E18] flex items-center justify-center text-white text-[10px] font-bold group/avatar relative" title={`${role}: ${name}`}>
            {name.charAt(0)}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {role}: {name}
            </div>
        </div>
    );
}
