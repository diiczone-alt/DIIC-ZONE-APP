'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Scale, AlertCircle } from 'lucide-react';
import AdminClientPrioritization from '../admin/AdminClientPrioritization';
import AdminTalentReputation from '../admin/AdminTalentReputation';

export default function OperationsView() {
    const [activeTab, setActiveTab] = useState('PRIORITY'); // PRIORITY | TALENT

    const tabs = [
        { id: 'PRIORITY', label: 'Cola de Producción', icon: Scale, color: 'text-red-400' },
        { id: 'TALENT', label: 'Reputación de Creativos', icon: Users, color: 'text-purple-400' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header & Nav */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Live Operations Center</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Centro de Control <span className="text-gray-600">Admin</span>
                    </h1>
                    <p className="text-gray-400 mt-2 max-w-lg">
                        Gestión centralizada de prioridades y talento. El cerebro operativo de la agencia.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-[#0E0E18] p-1 rounded-xl border border-white/10">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all
                                    ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="ops-tab"
                                        className="absolute inset-0 bg-white/10 rounded-lg"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-gray-600'} relative z-10`} />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'PRIORITY' ? (
                        <AdminClientPrioritization />
                    ) : (
                        <AdminTalentReputation />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
