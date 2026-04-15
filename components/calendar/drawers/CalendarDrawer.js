'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CalendarDrawer Wrapper
 * Provides the slide-in animation and close button logic.
 * @param {boolean} isOpen 
 * @param {function} onClose 
 * @param {string} title 
 * @param {string} color - Tailwind color class for header accents (e.g. 'text-blue-400')
 * @param {React.ReactNode} children 
 */
export default function CalendarDrawer({ isOpen, onClose, title, icon: Icon, color = 'text-white', children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-[420px] z-50 bg-[#09090E]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
                                    {Icon && <Icon className="w-5 h-5" />}
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
