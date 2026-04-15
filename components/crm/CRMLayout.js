'use client';

import { useState } from 'react';
import {
    LayoutDashboard, Users, UserCheck, DollarSign,
    Calendar, PieChart, Search, Plus, Filter, Settings,
    ChevronRight, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports (Will be replaced by actual imports as we build them)
import PipelineBoard from './PipelineBoard';
import LeadList from './LeadList';
import ClientList from './ClientList';
import SalesRegistry from './SalesRegistry';
import FollowUpCenter from './FollowUpCenter';
import CRMAnalytics from './CRMAnalytics';

export default function CRMLayout({ onBack }) {
    const [activeView, setActiveView] = useState('pipeline');

    const navItems = [
        { id: 'pipeline', label: 'Pipeline', icon: LayoutDashboard },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'clients', label: 'Clientes', icon: UserCheck },
        { id: 'sales', label: 'Ventas', icon: DollarSign },
        { id: 'followup', label: 'Seguimiento', icon: Calendar },
        { id: 'reports', label: 'Reportes', icon: PieChart },
    ];

    return (
        <div className="flex bg-[#050511] h-full overflow-hidden">

            {/* Sidebar Navigation */}
            <div className="w-64 bg-[#0E0E18] border-r border-white/5 flex flex-col shrink-0">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-wide">CRM 360°</h2>
                        <p className="text-xs text-gray-500">Commercial OS</p>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeView === item.id
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {activeView === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </button>
                    ))}
                </div>

                {/* KPI Mini Widget */}
                <div className="p-4 mt-auto border-t border-white/5">
                    <div className="bg-[#151520] rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-gray-500 mb-1">Meta del Mes</p>
                        <div className="flex justify-between items-end">
                            <span className="text-lg font-bold text-white">$12,500</span>
                            <span className="text-xs text-emerald-400 font-bold">+15%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[65%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050511]">

                {/* Topbar (Contextual) */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0E0E18]/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar en CRM..."
                                className="bg-[#151520] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 w-64 transition-all focus:w-80"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">Nuevo Lead</span>
                        </button>
                    </div>
                </div>

                {/* Dynamic View Content */}
                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-full"
                        >
                            {renderView(activeView)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function renderView(view) {
    switch (view) {
        case 'pipeline': return <PipelineBoard />;
        case 'leads': return <LeadList />;
        case 'clients': return <ClientList />;
        case 'sales': return <SalesRegistry />;
        case 'followup': return <FollowUpCenter />;
        case 'reports': return <CRMAnalytics />;
        default: return <PipelineBoard />;
    }
}
