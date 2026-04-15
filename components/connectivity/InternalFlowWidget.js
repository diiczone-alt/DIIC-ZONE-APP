'use client';

import { motion } from 'framer-motion';
import { Bot, MessageSquare, LayoutDashboard } from 'lucide-react';

export default function InternalFlowWidget() {
    return (
        <div className="w-full relative h-[160px] bg-[#0E0E18] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center mb-8 shadow-2xl">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] via-transparent to-transparent"></div>

            <div className="flex items-center w-full max-w-4xl justify-between px-16 relative z-10">

                {/* NODE 1: Sources */}
                <div className="flex flex-col items-center gap-3 relative group">
                    <div className="w-16 h-16 rounded-2xl bg-[#151520] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-blue-500/50 transition-colors z-20 relative">
                        <MessageSquare className="w-6 h-6 text-blue-400" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-[#151520] px-2 py-1 rounded border border-white/5">Entrada</span>
                </div>

                {/* CONNECTION LINE 1 */}
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 relative mx-4 overflow-hidden rounded-full">
                    <motion.div
                        className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-[2px]"
                        animate={{ x: ['-100%', '400%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* NODE 2: AI Processor */}
                <div className="flex flex-col items-center gap-3 relative group">
                    <div className="w-20 h-20 rounded-2xl bg-[#151520] border border-indigo-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)] z-20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                        <Bot className="w-8 h-8 text-indigo-400 relative z-10" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">Clasificación IA</span>
                </div>

                {/* CONNECTION LINE 2 */}
                <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 relative mx-4 overflow-hidden rounded-full">
                    <motion.div
                        className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-[2px]"
                        animate={{ x: ['-100%', '400%'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "linear" }}
                    />
                </div>

                {/* NODE 3: CRM */}
                <div className="flex flex-col items-center gap-3 relative group">
                    <div className="w-16 h-16 rounded-2xl bg-[#151520] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-emerald-500/50 transition-colors z-20 relative">
                        <LayoutDashboard className="w-6 h-6 text-emerald-400" />
                        <motion.div
                            className="absolute -top-8 text-[12px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shadow-lg whitespace-nowrap"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: -10, opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                        >
                            +1 Lead Calificado
                        </motion.div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-[#151520] px-2 py-1 rounded border border-white/5">Pipeline</span>
                </div>

            </div>
        </div>
    );
}
