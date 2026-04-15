'use client';

import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialCard({ platform, icon: Icon, color, description, isConnected, stats, onConnect, isLoading }) {

    // Format stats for display logic
    const displayStats = stats ? Object.entries(stats).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: value
    })) : [];

    return (
        <GlassCard className="p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg text-white ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs border transition-colors ${isConnected
                        ? 'bg-green-500/20 text-green-400 border-green-500/20'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}>
                    {isConnected ? '● Conectado' : 'Desconectado'}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-lg text-white">{platform}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>

            {!isConnected ? (
                <button
                    onClick={() => onConnect(platform)}
                    disabled={isLoading}
                    className="w-full py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Conectando...
                        </>
                    ) : (
                        'Conectar'
                    )}
                </button>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 border-t border-white/10 space-y-3"
                    >
                        {displayStats.length > 0 ? displayStats.map((stat, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-400 text-sm">{stat.label}</span>
                                <span className="font-bold text-sm text-white">{stat.value}</span>
                            </div>
                        )) : (
                            <p className="text-xs text-gray-500 italic">No hay métricas disponibles.</p>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${color.replace('text-white', 'bg-current').replace('bg-', '')}`} />
        </GlassCard>
    );
}

function GlassCard({ children, className }) {
    return (
        <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}>
            {children}
        </div>
    );
}
