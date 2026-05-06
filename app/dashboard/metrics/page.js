'use client';

import { Construction, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MetricsPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#0E0E18]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md"
            >
                <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                    <Activity className="w-10 h-10 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">
                    Metrics & KPIs
                </h1>
                <p className="text-gray-400 mb-8 font-medium">
                    Panel avanzado de métricas y KPIs. Se activará automáticamente cuando la ingesta de datos operativos sea suficiente.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest">
                    <Construction className="w-4 h-4" /> En Construcción
                </div>
            </motion.div>
        </div>
    );
}
