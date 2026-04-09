'use client';

import { useState } from 'react';
import {
    Headset, Bot, BookOpen, BarChart2,
    ChevronRight, ArrowLeft, Search, Bell, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import AgentWorkspace from './AgentWorkspace';
import AIConfigView from './AIConfigView';
import SalesPlaybook from './SalesPlaybook';
import ProposalBuilder from './ProposalBuilder';

export default function SalesLayout({ onBack }) {
    const [activeView, setActiveView] = useState('workspace');

    const navItems = [
        { id: 'workspace', label: 'Agent Workspace', icon: Headset },
        { id: 'proposals', label: 'Propuestas', icon: FileText },
        { id: 'ai-config', label: 'Configuración IA', icon: Bot },
        { id: 'playbook', label: 'Playbooks & Scripts', icon: BookOpen },
        { id: 'stats', label: 'Ranking & Stats', icon: BarChart2 },
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
                        <h2 className="text-lg font-bold text-white tracking-wide">Ventas IA</h2>
                        <p className="text-xs text-gray-500">Human + AI Hybrid</p>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeView === item.id
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {activeView === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </button>
                    ))}
                </div>

                {/* Agent Status Widget */}
                <div className="p-4 mt-auto border-t border-white/5">
                    <div className="bg-[#151520] rounded-xl p-4 border border-white/5 flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                                AG
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#151520]"></div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Agente Activo</p>
                            <p className="text-xs text-emerald-400">En línea</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050511]">
                {/* Dynamic View Content */}
                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
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
        case 'workspace': return <AgentWorkspace />;
        case 'proposals': return <ProposalBuilder />;
        case 'ai-config': return <AIConfigView />;
        case 'playbook': return <SalesPlaybook />;
        case 'stats': return <div className="p-10 text-white">Próximamente: Leaderboard</div>;
        default: return <AgentWorkspace />;
    }
}
