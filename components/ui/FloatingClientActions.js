'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function FloatingClientActions({ onOpenChat, isChatOpen }) {
    return (
        <div className="fixed top-6 right-8 z-[100] flex items-center gap-4">
            {/* Notification Center - Floating Style */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <NotificationCenter />
            </motion.div>

            {/* Messaging Toggle - Floating Style */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenChat}
                className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all relative group backdrop-blur-xl border ${
                    isChatOpen 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                    : 'bg-[#0A0A0F]/60 border-white/10 text-gray-400 hover:text-white hover:border-white/20 shadow-2xl'
                }`}
            >
                <MessageSquare size={20} className={isChatOpen ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                
                {/* Active Indicator */}
                {!isChatOpen && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full">
                        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping" />
                    </div>
                )}
            </motion.button>
        </div>
    );
}
