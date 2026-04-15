'use client';

import { useState, useEffect } from 'react';
import {
    MessageCircle, Activity, Users, FileText,
    Send, Settings, Search, Filter, MoreVertical,
    CheckCircle, AlertCircle, Clock, Smartphone,
    BarChart2, Zap, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppOverview from './WhatsAppOverview';
import ChatsView from './ChatsView';
import StatusView from './StatusView';
import BroadcastView from './BroadcastView';
import DataView from './DataView';

export default function WhatsAppDashboard({ channel, onBack }) {
    const [activeTab, setActiveTab] = useState('chats'); // overview, chats, broadcast, status

    return (
        <div className="flex-1 flex flex-col h-full bg-[#050511] relative overflow-hidden">

            {/* Contextual Header for Module */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E18] shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <Layout className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center border border-[#25D366]/30">
                            <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white leading-tight">WhatsApp Business OS</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-emerald-500 font-mono">ONLINE • +51 987 654 321</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-lg border border-white/5 transition-colors">
                        Configuración
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-1"></div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500">API Stable</span>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* Sidebar Navigation (Mini) */}
                <div className="w-16 border-r border-white/5 bg-[#0E0E18] flex flex-col items-center py-4 gap-4 shrink-0 z-50">
                    {[
                        { id: 'overview', icon: Layout, label: 'Panel' },
                        { id: 'chats', icon: MessageCircle, label: 'Chats' },
                        { id: 'broadcast', icon: Send, label: 'Difusión' },
                        { id: 'status', icon: Smartphone, label: 'Estados' },
                        { id: 'analytics', icon: BarChart2, label: 'Data' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-3 rounded-xl transition-all relative group ${activeTab === tab.id ? 'bg-[#25D366]/20 text-[#25D366]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="absolute left-14 bg-black px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-[60]">
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <WhatsAppOverview onAction={setActiveTab} />
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'chats' && (
                            <motion.div
                                key="chats"
                                className="flex-1 h-full flex flex-col overflow-hidden"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <ChatsView />
                            </motion.div>
                        )}

                        {activeTab === 'broadcast' && (
                            <motion.div
                                key="broadcast"
                                className="flex-1 h-full flex flex-col overflow-hidden"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <BroadcastView />
                            </motion.div>
                        )}

                        {activeTab === 'status' && (
                            <motion.div
                                key="status"
                                className="flex-1 h-full flex flex-col overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <StatusView />
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && (
                            <motion.div
                                key="analytics"
                                className="flex-1 h-full flex flex-col overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <DataView />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
