'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, Gift, User, Settings, Network, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLevelSystem from './ClientLevelSystem';
import ClientRewards from './ClientRewards';
import ClientAccountSettings from './ClientAccountSettings';
import ClientIdentityWrapper from './ClientIdentityWrapper';
import ClientServiceCatalog from './ClientServiceCatalog';
import { useAuth } from '@/context/AuthContext';
// ...

export default function ClientProfileHub() {
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [subTab, setSubTab] = useState('identity'); // 'identity', 'catalog', 'progress', 'rewards', 'settings'

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['identity', 'catalog', 'progress', 'rewards', 'settings'].includes(tabParam)) {
            setSubTab(tabParam);
        }
    }, [searchParams]);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
            {/* Sub-Navigation */}
            <div className="flex justify-center mb-12 pt-8">
                <div className="inline-flex p-1.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[28px] overflow-x-auto max-w-full shadow-2xl premium-shadow">
                    <TabButton
                        id="identity"
                        label="Identidad"
                        icon={Network}
                        active={subTab === 'identity'}
                        onClick={() => setSubTab('identity')}
                    />
                    <TabButton
                        id="catalog"
                        label="Catálogo"
                        icon={TrendingUp}
                        active={subTab === 'catalog'}
                        onClick={() => setSubTab('catalog')}
                    />
                    <TabButton
                        id="progress"
                        label="Mi Progreso"
                        icon={Zap}
                        active={subTab === 'progress'}
                        onClick={() => setSubTab('progress')}
                    />
                    <TabButton
                        id="rewards"
                        label="Recompensas"
                        icon={Gift}
                        active={subTab === 'rewards'}
                        onClick={() => setSubTab('rewards')}
                    />
                    <TabButton
                        id="settings"
                        label="Cuenta"
                        icon={User}
                        active={subTab === 'settings'}
                        onClick={() => setSubTab('settings')}
                    />
                </div>
            </div>

            {/* Content Area with refined spacing */}
            <div className="container mx-auto max-w-7xl px-6 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={subTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {subTab === 'identity' && <ClientIdentityWrapper />}
                        {subTab === 'catalog' && <ClientServiceCatalog clientId={user?.client_id} />}
                        {subTab === 'progress' && <ClientLevelSystem />}
                        {subTab === 'rewards' && <ClientRewards />}
                        {subTab === 'settings' && <ClientAccountSettings />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function TabButton({ id, label, icon: Icon, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-[22px] text-xs font-black uppercase tracking-[0.15em] transition-all duration-500 relative group overflow-hidden ${active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : 'text-gray-600 group-hover:text-gray-300'}`} />
            <span className="relative z-10">{label}</span>
            {active && (
                <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </button>
    );
}
