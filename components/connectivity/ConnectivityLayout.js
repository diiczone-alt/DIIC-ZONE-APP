'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Inbox, Users, Zap, Plus, Settings, BrainCircuit } from 'lucide-react';

export default function ConnectivityLayout() {
    const [activeTab, setActiveTab] = useState('channels');

    const tabs = [
        { id: 'channels', label: 'Canales', icon: Network },
        { id: 'inbox', label: 'Bandeja', icon: Inbox },
        { id: 'crm', label: 'Inteligencia (CRM)', icon: BrainCircuit },
        { id: 'automation', label: 'Automatizaciones', icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-[#050511] text-white p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Conectividad & Automatización
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Centro de comando para tus redes, mensajes y clientes.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Sistema Online</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-col gap-6">
                {/* Tabs Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap
                                    ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl backdrop-blur-md"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-blue-400' : ''}`} />
                                <span className="font-medium relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Viewport */}
                <div className="flex-1 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'channels' && <ChannelsView />}
                            {activeTab === 'inbox' && <InboxView />}
                            {activeTab === 'crm' && <CrmView />}
                            {activeTab === 'automation' && <AutomationView />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// --- Placeholder Components for Phase 1 ---

import ChannelCard from './ChannelCard';
import { Instagram, Facebook, Youtube, Linkedin, MessageCircle, Send, MessageSquare } from 'lucide-react';

// Custom TikTok Icon (since it might not be in older lucide versions or just for style)
const TikTok = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

function ChannelsView() {
    return (
        <div className="space-y-8">
            {/* Social Networks Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <Network className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Redes Sociales</h3>
                        <p className="text-sm text-gray-400">Gestiona la publicación y métricas de tus perfiles.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <ChannelCard
                        name="Instagram"
                        icon={Instagram}
                        status="connected"
                        accountName="diic_zone_official"
                    />
                    <ChannelCard
                        name="Facebook Page"
                        icon={Facebook}
                        status="connected"
                        accountName="DIIC Zone Agency"
                    />
                    <ChannelCard
                        name="TikTok"
                        icon={TikTok}
                        status="disconnected"
                    />
                    <ChannelCard
                        name="YouTube"
                        icon={Youtube}
                        status="disconnected"
                    />
                    <ChannelCard
                        name="LinkedIn"
                        icon={Linkedin}
                        status="disconnected"
                    />
                </div>
            </section>

            {/* Messaging Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                        <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Canales de Mensajería</h3>
                        <p className="text-sm text-gray-400">Conecta tus bandejas para el Inbox Unificado y CRM.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <ChannelCard
                        name="WhatsApp Business"
                        icon={MessageCircle}
                        status="connected"
                        accountName="+57 300 123 4567"
                    />
                    <ChannelCard
                        name="Messenger"
                        icon={MessageSquare}
                        status="connected"
                        accountName="DIIC Zone"
                    />
                    <ChannelCard
                        name="Instagram DM"
                        icon={Send}
                        status="connected"
                        accountName="diic_zone_official"
                    />
                    <ChannelCard
                        name="Telegram"
                        icon={Send}
                        status="disconnected"
                    />
                </div>
            </section>
        </div>
    );
}

import UnifiedInbox from './UnifiedInbox';

function InboxView() {
    return (
        <div className="h-full">
            <UnifiedInbox />
        </div>
    );
}

import CrmContainer from './crm/CrmContainer';

function CrmView() {
    return (
        <div className="h-[75vh]">
            <CrmContainer />
        </div>
    );
}

import AutomationEngine from './automation/AutomationEngine';

function AutomationView() {
    return (
        <div className="h-full">
            <AutomationEngine />
        </div>
    );
}

function MockCard({ name, status, color }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">{name}</span>
            </div>
            <button className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                {status === 'connected' ? 'Configurar' : 'Conectar'}
            </button>
        </div>
    );
}
