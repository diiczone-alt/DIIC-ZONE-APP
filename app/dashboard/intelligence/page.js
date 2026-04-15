'use client';

import { useState } from 'react';
import BusinessIntelligenceDashboard from '../../../components/business/BusinessIntelligenceDashboard';
import OperationsCommandCenter from '../../../components/business/OperationsCommandCenter';
import PlatformGovernanceConsole from '../../../components/admin/PlatformGovernanceConsole';
import { Activity, Server, Gavel } from 'lucide-react'; // Icons for tabs

export default function BusinessIntelligencePage() {
    const [activeTab, setActiveTab] = useState('financial');

    return (
        <div className="p-6 md:p-8 space-y-8 animate-fade-in relative z-10 w-full max-w-7xl mx-auto min-h-screen">

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab('financial')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'financial' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <Activity className="w-4 h-4" />
                    Inteligencia Financiera
                </button>
                <button
                    onClick={() => setActiveTab('operations')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'operations' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <Server className="w-4 h-4" />
                    Operaciones y Sistemas
                </button>
                <button
                    onClick={() => setActiveTab('governance')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'governance' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    <Gavel className="w-4 h-4" />
                    Gobernanza (Reglas)
                </button>
            </div>

            {/* Content Area */}
            <div className="mt-6">
                {activeTab === 'financial' && (
                    <div className="animate-fade-in">
                        <BusinessIntelligenceDashboard />
                    </div>
                )}

                {activeTab === 'operations' && (
                    <div className="animate-fade-in">
                        <OperationsCommandCenter />
                    </div>
                )}

                {activeTab === 'governance' && (
                    <div className="animate-fade-in">
                        <PlatformGovernanceConsole />
                    </div>
                )}
            </div>
        </div>
    );
}
