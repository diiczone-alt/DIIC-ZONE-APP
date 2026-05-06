'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Network, Map, Share2, Zap, Filter, Search, MoreHorizontal, Settings } from 'lucide-react';
import EventsCalendar from './EventsCalendar';
import StrategyBoard from '../shared/Strategy/StrategyBoard';

import LogisticsCrew from './LogisticsCrew';

export default function EventsDashboard() {
    const [activeTab, setActiveTab] = useState('calendar');

    const tabs = [
        { id: 'calendar', label: 'Agenda & Shoots', icon: Calendar },
        { id: 'strategy', label: 'Pizarra de Estrategia', icon: Network },
        { id: 'logistics', label: 'Logística & Crew', icon: Map },
    ];

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] overflow-hidden bg-[#0E0E18]">
            {/* Main Content Area - Full Screen */}
            <div className="flex-1 flex flex-col relative overflow-hidden w-full h-full">
                <main className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-full"
                        >
                            {activeTab === 'calendar' && <EventsCalendar />}
                            {activeTab === 'strategy' && <StrategyBoard />}
                            {activeTab === 'logistics' && <LogisticsCrew />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
