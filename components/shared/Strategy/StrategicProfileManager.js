'use client';

import React, { useState } from 'react';
import { Network, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientIdentityWrapper from '../../profile/ClientIdentityWrapper';
import ClientServiceCatalog from '../../profile/ClientServiceCatalog';

export default function StrategicProfileManager({ clientId, theme = 'dark' }) {
    const [subTab, setSubTab] = useState('identity'); // 'identity', 'catalog'

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                    Ecosistema <span className="text-indigo-500">Estratégico</span>
                </h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                    Mapea la identidad, los entregables de valor y la madurez del negocio.
                </p>
            </div>

            {/* Sub-Navigation */}
            <div className="flex justify-start mb-10">
                <div className="inline-flex p-1.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl">
                    <button
                        onClick={() => setSubTab('identity')}
                        type="button"
                        className={`flex items-center gap-2.5 px-8 py-3.5 rounded-[22px] text-xs font-black uppercase tracking-[0.15em] transition-all duration-500 relative group overflow-hidden ${
                            subTab === 'identity'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Network className={`w-4 h-4 relative z-10 ${subTab === 'identity' ? 'animate-pulse' : 'text-gray-600 group-hover:text-gray-300'}`} />
                        <span className="relative z-10">Identidad</span>
                    </button>
                    <button
                        onClick={() => setSubTab('catalog')}
                        type="button"
                        className={`flex items-center gap-2.5 px-8 py-3.5 rounded-[22px] text-xs font-black uppercase tracking-[0.15em] transition-all duration-500 relative group overflow-hidden ${
                            subTab === 'catalog'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <TrendingUp className={`w-4 h-4 relative z-10 ${subTab === 'catalog' ? 'animate-pulse' : 'text-gray-600 group-hover:text-gray-300'}`} />
                        <span className="relative z-10">Catálogo de Servicios</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={subTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {subTab === 'identity' && <ClientIdentityWrapper clientId={clientId} />}
                        {subTab === 'catalog' && <ClientServiceCatalog clientId={clientId} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
