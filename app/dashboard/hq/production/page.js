'use client';

import { useState, useEffect } from 'react';
import HQSidebar from '@/components/layout/HQSidebar';
import { 
    Clapperboard, Play, CheckCircle2, 
    Clock, AlertCircle, Search, 
    Filter, Plus, User, Layers
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';

export default function ProductionPage() {
    const [productionData, setProductionData] = useState([]);

    useEffect(() => {
        const loadProduction = async () => {
            try {
                const allTasks = await agencyService.getTasks();
                const productionTasks = allTasks.filter(t => 
                    ['EDITOR', 'DISEÑO', 'FILMMAKER'].includes(t.assigned_role?.toUpperCase()) || 
                    t.assigned_role === 'Editor de Video' ||
                    t.assigned_role === 'Diseñador'
                );
                setProductionData(productionTasks);
            } catch (e) { 
                console.error(e); 
            }
        };
        loadProduction();
    }, []);

    return (
        <div className="min-h-screen bg-[#050511] text-white font-sans selection:bg-indigo-500/30">
            <HQSidebar />

            <div className="pl-64 transition-all duration-300">
                <main className="p-8 max-w-[1600px] mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Producción Operativa</h1>
                            <p className="text-gray-400 mt-1">Monitoreo de contenido en proceso y entregables</p>
                        </div>
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Nueva Tarea
                        </button>
                    </div>

                    {/* Kanban / Grid View */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <ProductionColumn title="Pendiente" count={1} status="Pendiente" icon={Clock} color="text-gray-500" productionData={productionData} />
                        <ProductionColumn title="En Proceso" count={2} status="En proceso" icon={Play} color="text-indigo-400" productionData={productionData} />
                        <ProductionColumn title="Revisión" count={1} status="Revisión" icon={AlertCircle} color="text-amber-400" productionData={productionData} />
                        <ProductionColumn title="Aprobado" count={1} status="Aprobado" icon={CheckCircle2} color="text-emerald-400" productionData={productionData} />
                    </div>

                    {/* All Content List */}
                    <div className="mt-12 bg-[#0A0A15] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Todo el Contenido</h3>
                            <button className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Relanzar Workflow</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Contenido / Cliente</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Responsable</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Estado</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Prioridad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {productionData.map(item => (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-white">{item.title || item.content}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{item.client}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                                        {item.responsible[0]}
                                                    </div>
                                                    <span className="text-xs text-gray-300">{item.responsible}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusTag status={item.status} />
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{item.priority}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

function ProductionColumn({ title, count, status, icon: Icon, color, productionData = [] }) {
    const items = productionData.filter(i => i.status.toLowerCase() === status.toLowerCase() || (status === 'En proceso' && i.status?.toLowerCase() === 'en edición'));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">{title}</span>
                </div>
                <span className="text-[10px] font-black text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{items.length}</span>
            </div>
            
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-[#0A0A15] border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all cursor-pointer group">
                        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-1">{item.client}</p>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">{item.title || item.content}</h4>
                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[8px] font-black text-gray-400">
                                    {item.responsible[0]}
                                </div>
                                <span className="text-[10px] text-gray-500">{item.responsible}</span>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.priority === 'Alta' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-gray-600'}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusTag({ status }) {
    const styles = {
        'Pendiente': 'text-gray-500',
        'En proceso': 'text-indigo-400',
        'En edición': 'text-indigo-400',
        'Revisión': 'text-amber-400',
        'Aprobado': 'text-emerald-400'
    };
    return (
        <span className={`text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
            {status}
        </span>
    );
}
