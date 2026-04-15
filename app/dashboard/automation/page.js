'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import AutomationIntro from '@/components/automation/AutomationIntro';
import ControlCenter from '@/components/automation/ControlCenter';
import ConnectivityPanel from '@/components/meta/ConnectivityPanel';
import CRMMainView from '@/components/automation/CRMMainView';
import ChatbotConfig from '@/components/automation/ChatbotConfig';
import AutomationsHub from '@/components/automation/AutomationsHub';
import MetaAdsWizard from '@/components/automation/MetaAdsWizard';
import CommercialHub from '@/components/automation/CommercialHub';

// Icons
import { Zap, Users, Bot, Workflow, Megaphone, DollarSign, Settings } from 'lucide-react';

export default function AutomationPage() {
    const [showIntro, setShowIntro] = useState(true);
    const [activeTab, setActiveTab] = useState('connectivity');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Optional: Check local storage to see if intro was already shown
        const hasSeenIntro = localStorage.getItem('diic_automation_intro_seen');
        if (hasSeenIntro) {
            setShowIntro(false);
        }
    }, []);

    const handleIntroComplete = () => {
        setShowIntro(false);
        localStorage.setItem('diic_automation_intro_seen', 'true');
    };

    if (!isClient) return null; // Prevent hydration mismatch

    return (
        <div className="space-y-6 relative min-h-screen">
            {/* Premium Intro */}
            <AnimatePresence>
                {showIntro && <AutomationIntro onComplete={handleIntroComplete} />}
            </AnimatePresence>

            {/* Header & Control Center */}
            <div className="flexflex-col space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Centro Nervioso Digital
                        </h1>
                        <p className="text-gray-400">Conectividad, Automatización y Crecimiento.</p>
                    </div>
                </div>

                {/* Metrics Header */}
                <ControlCenter />
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                <TabButton id="connectivity" label="Conexiones" icon={Zap} active={activeTab} onClick={setActiveTab} />
                <TabButton id="crm" label="CRM & Ventas" icon={Users} active={activeTab} onClick={setActiveTab} />
                <TabButton id="chatbot" label="Chatbot IA" icon={Bot} active={activeTab} onClick={setActiveTab} />
                <TabButton id="automations" label="Automatización" icon={Workflow} active={activeTab} onClick={setActiveTab} />
                <TabButton id="ads" label="Meta Ads" icon={Megaphone} active={activeTab} onClick={setActiveTab} />
                <TabButton id="commercial" label="Comercial / ROI" icon={DollarSign} active={activeTab} onClick={setActiveTab} />
            </div>

            {/* Main Content Area */}
            <div className="bg-[#0A0A12]/50 rounded-3xl border border-white/5 p-1 min-h-[600px] backdrop-blur-sm relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="h-full p-4"
                    >
                        {activeTab === 'connectivity' && <ConnectivityPanel />}
                        {activeTab === 'crm' && <CRMMainView />}
                        {activeTab === 'chatbot' && <ChatbotConfig />}
                        {activeTab === 'automations' && <AutomationsHub />}
                        {activeTab === 'ads' && <MetaAdsWizard />}
                        {activeTab === 'commercial' && <CommercialHub />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function TabButton({ id, label, icon: Icon, active, onClick }) {
    const isActive = active === id;
    return (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 border ${isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
        >
            <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
            {label}
        </button>
    );
}
