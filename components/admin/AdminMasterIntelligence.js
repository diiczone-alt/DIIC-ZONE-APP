'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BrainCircuit, Activity, TrendingUp, Compass, 
    ShieldCheck, Zap, BarChart3, Users, Target
} from 'lucide-react';

// Import existing intelligence modules
import AdminBusinessIntelligence from './AdminBusinessIntelligence';
import BusinessIntelligenceDashboard from '../business/BusinessIntelligenceDashboard';
import CommercialIntelligenceDashboard from '../connectivity/crm/CommercialIntelligenceDashboard';

export default function AdminMasterIntelligence() {
    const [subView, setSubView] = useState('strategic'); // 'strategic' | 'operational' | 'commercial'

    const tabs = [
        { 
            id: 'strategic', 
            label: 'Estratégica (BI)', 
            icon: Compass, 
            desc: 'Finanzas & Futuro',
            color: 'indigo'
        },
        { 
            id: 'operational', 
            label: 'Operacional (Ops)', 
            icon: Activity, 
            desc: 'Equipo & Servicios',
            color: 'emerald'
        },
        { 
            id: 'commercial', 
            label: 'Comercial (CRM)', 
            icon: Zap, 
            desc: 'Ventas & ROI',
            color: 'amber'
        }
    ];

    const tabColors = {
        indigo: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
        emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
        amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Master Navigation Bar */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-indigo-500" /> Hub de Inteligencia Maestra
                    </h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mt-2">
                        Consolidado Global de Datos Directivos // DIIC ZONE OS
                    </p>
                </div>

                <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSubView(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                subView === tab.id 
                                ? 'bg-white/10 text-white shadow-lg' 
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            <tab.icon className={`w-4 h-4 ${subView === tab.id ? `text-${tab.color}-400` : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* View Area */}
            <div className="relative min-h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={subView}
                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                    >
                        {subView === 'strategic' && <AdminBusinessIntelligence />}
                        {subView === 'operational' && <BusinessIntelligenceDashboard />}
                        {subView === 'commercial' && <CommercialIntelligenceDashboard />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Integrated Footer Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado de Integridad</p>
                        <p className="text-sm font-bold text-white tracking-tight uppercase">Datos Sincronizados</p>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fuentes de Verdad</p>
                        <p className="text-sm font-bold text-white tracking-tight uppercase">12 Nodos Activos</p>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acceso Directivo</p>
                        <p className="text-sm font-bold text-white tracking-tight uppercase">Admin Master Key</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
