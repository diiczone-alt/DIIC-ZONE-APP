'use client';

import React, { useState, useEffect } from 'react';
import { 
    Search, Folder, Target, TrendingUp, Sparkles, Brain, Bot, 
    Activity, Layers, Bookmark, FileText, CheckCircle2, X,
    Network, ShieldCheck, Zap, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientStrategicProfile from '../../profile/ClientStrategicProfile';
import ClientGrowthLevel from '../../profile/ClientGrowthLevel';
import ClientServiceCatalog from '../../profile/ClientServiceCatalog';
import StrategicBrainChat from '@/components/strategy/StrategicBrainChat';
import SavedResearchesModal from '@/components/strategy/SavedResearchesModal';
import { agencyService } from '@/services/agencyService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function StrategicProfileManager({ clientId, theme = 'dark' }) {
    const { user } = useAuth();
    // Unified navigation: 'search' | 'saved' | 'profile' | 'level' | 'catalog'
    const [activeTab, setActiveTab] = useState('search');
    const [isBrainChatOpen, setIsBrainChatOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    
    // Client profile & researches metadata for top bar
    const [clientData, setClientData] = useState(null);
    const [savedResearches, setSavedResearches] = useState([]);
    const [researchFolders, setResearchFolders] = useState([
        { id: 'f_nicho', name: 'Nicho & Pacientes', color: 'indigo' },
        { id: 'f_competencia', name: 'Competencia', color: 'fuchsia' },
        { id: 'f_objeciones', name: 'Objeciones & Fricción', color: 'amber' }
    ]);
    const [currentResearchDraft, setCurrentResearchDraft] = useState(null);

    const clientName = (
        clientData?.onboarding_data?.strategic?.brandName ||
        clientData?.name ||
        user?.user_metadata?.brand ||
        'Marca DIIC'
    ).replace(/[-_\s]+workspace\s*$/i, '').trim();

    // Fetch client metadata & saved researches count
    useEffect(() => {
        const fetchClientInfo = async () => {
            if (!clientId) return;
            try {
                const client = await agencyService.getClientById(clientId);
                if (client) {
                    setClientData(client);
                    const rawRes = client.onboarding_data?.saved_researches || [];
                    const rawFolders = client.onboarding_data?.research_folders || [];
                    if (Array.isArray(rawRes) && rawRes.length > 0) {
                        setSavedResearches(rawRes);
                    } else if (typeof window !== 'undefined') {
                        try {
                            const localRes = localStorage.getItem('diic_saved_researches_' + clientId);
                            if (localRes) setSavedResearches(JSON.parse(localRes));
                        } catch(e) {}
                    }
                    if (Array.isArray(rawFolders) && rawFolders.length > 0) {
                        setResearchFolders(rawFolders);
                    }
                }
            } catch (err) {
                console.error("Error fetching client info in StrategicProfileManager:", err);
            }
        };
        fetchClientInfo();
    }, [clientId]);

    const handleSaveNewResearch = async (newResearch) => {
        const updated = [newResearch, ...savedResearches];
        setSavedResearches(updated);
        if (typeof window !== 'undefined' && clientId) {
            try {
                localStorage.setItem('diic_saved_researches_' + clientId, JSON.stringify(updated));
            } catch(e) {}
        }
        if (clientId) {
            try {
                const existing = await agencyService.getClientById(clientId);
                const prevOnboarding = existing?.onboarding_data || {};
                await agencyService.updateClient(clientId, {
                    onboarding_data: {
                        ...prevOnboarding,
                        saved_researches: updated,
                        research_folders: researchFolders
                    }
                });
            } catch (e) {
                console.error("Error saving research to client:", e);
            }
        }
    };

    const navItems = [
        {
            id: 'search',
            label: 'Estudio de Mercado',
            icon: Search,
            badge: null,
            desc: 'Auditoría Omnicanal & Inteligencia de Nicho'
        },
        {
            id: 'saved',
            label: 'Repositorio & Dossier',
            icon: Folder,
            badge: savedResearches.length > 0 ? savedResearches.length : null,
            desc: 'Investigaciones Guardadas & PDF'
        },
        {
            id: 'profile',
            label: 'Perfil Estratégico 360°',
            icon: Target,
            badge: null,
            desc: 'Identidad, Valor & Competencia'
        },
        {
            id: 'level',
            label: 'Madurez & Nivel',
            icon: TrendingUp,
            badge: null,
            desc: 'Crecimiento de Negocio'
        },
        {
            id: 'catalog',
            label: 'Catálogo de Servicios',
            icon: Zap,
            badge: null,
            desc: 'Oferta High-Ticket'
        }
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pl-16 md:pl-20 pr-4 md:pr-8 py-6">
            {/* SEPARATED MINIMALIST EXECUTIVE HEADER */}
            <div className="mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
                {/* 1. BRAND & IA STATUS PILL */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0A0A14]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg w-full lg:w-auto justify-between lg:justify-start">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xs font-bold text-white tracking-wide">
                                    {clientName}
                                </h2>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    IA Activa
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">
                                Inteligencia & Perfil Estratégico 360°
                            </p>
                        </div>
                    </div>

                    {/* Mobile Brain Quick Launch */}
                    <button
                        onClick={() => setIsBrainChatOpen(true)}
                        className="lg:hidden p-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-xl text-white shadow-md"
                    >
                        <Brain className="w-4 h-4" />
                    </button>
                </div>

                {/* 2. MINIMALIST SEGMENTED NAVIGATION TABS */}
                <nav className="flex items-center gap-1 p-1 bg-[#0A0A14]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg max-w-full overflow-x-auto custom-scrollbar">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                type="button"
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap ${
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-fuchsia-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.35)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                <span>{item.label}</span>
                                {item.badge !== null && (
                                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                                        isActive 
                                            ? 'bg-white/25 text-white' 
                                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* 3. MINIMALIST EXECUTIVE ACTIONS */}
                <div className="hidden lg:flex items-center gap-2.5">
                    <button
                        onClick={() => setIsBrainChatOpen(true)}
                        className="px-3.5 py-2 bg-[#0A0A14]/70 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 text-indigo-300 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-2 shadow-lg transition-all active:scale-95 group"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        <span>DIIC Brain IA</span>
                    </button>

                    <button
                        onClick={() => setIsSaveModalOpen(true)}
                        className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Guardar</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT VIEWER */}
            <div className="flex-1 min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {activeTab === 'search' && (
                            <ClientStrategicProfile 
                                activeTab="search" 
                                clientId={clientId}
                                onOpenSaveModal={(draft) => {
                                    setCurrentResearchDraft(draft);
                                    setIsSaveModalOpen(true);
                                }}
                                onOpenBrainChat={() => setIsBrainChatOpen(true)}
                                onResearchesChange={(updated) => setSavedResearches(updated)}
                            />
                        )}

                        {activeTab === 'saved' && (
                            <ClientStrategicProfile 
                                activeTab="saved" 
                                clientId={clientId}
                                onOpenSaveModal={(draft) => {
                                    setCurrentResearchDraft(draft);
                                    setIsSaveModalOpen(true);
                                }}
                                onOpenBrainChat={() => setIsBrainChatOpen(true)}
                                onResearchesChange={(updated) => setSavedResearches(updated)}
                            />
                        )}

                        {activeTab === 'profile' && (
                            <ClientStrategicProfile 
                                activeTab="profile" 
                                clientId={clientId}
                                onOpenSaveModal={(draft) => {
                                    setCurrentResearchDraft(draft);
                                    setIsSaveModalOpen(true);
                                }}
                                onOpenBrainChat={() => setIsBrainChatOpen(true)}
                                onResearchesChange={(updated) => setSavedResearches(updated)}
                            />
                        )}

                        {activeTab === 'level' && (
                            <div className="space-y-6">
                                <ClientGrowthLevel clientId={clientId} />
                            </div>
                        )}

                        {activeTab === 'catalog' && (
                            <div className="space-y-6">
                                <ClientServiceCatalog clientId={clientId} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* DIIC BRAIN AI CHAT MODAL / DRAWER */}
            <AnimatePresence>
                {isBrainChatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                        onClick={() => setIsBrainChatOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-4xl h-[85vh] bg-[#0A0A12] border border-indigo-500/30 rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 bg-[#0E0E1A] border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                                        <Brain className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-white uppercase italic tracking-tight">
                                            DIIC Brain • <span className="text-indigo-400">Asistente Estratégico IA</span>
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            Memoria contextual: {savedResearches.length} investigaciones + Perfil 360°
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsBrainChatOpen(false)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Brain Chat Component */}
                            <div className="flex-1 min-h-0">
                                <StrategicBrainChat
                                    clientName={clientName}
                                    profile={clientData?.onboarding_data?.strategic || {}}
                                    researches={savedResearches}
                                    folders={researchFolders}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SAVED RESEARCHES MODAL */}
            <SavedResearchesModal
                isOpen={isSaveModalOpen}
                onClose={() => {
                    setIsSaveModalOpen(false);
                    setCurrentResearchDraft(null);
                }}
                folders={researchFolders}
                initialData={currentResearchDraft || {
                    title: 'Auditoría Estratégica - ' + clientName,
                    query: 'Investigación General Omnicanal',
                    content: 'Análisis estratégico consolidado para ' + clientName + '.',
                    category: 'Auditoría de Nicho'
                }}
                onSave={handleSaveNewResearch}
            />
        </div>
    );
}
