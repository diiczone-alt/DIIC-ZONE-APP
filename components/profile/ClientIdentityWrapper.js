'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Layout, Target, Network } from 'lucide-react';
import ClientStrategicProfile from './ClientStrategicProfile';
import ClientGrowthLevel from './ClientGrowthLevel';

export default function ClientIdentityWrapper() {
    const [layer, setLayer] = useState(1); // 1: Strategic Profile, 2: Growth Level

    return (
        <div className="space-y-12">
            {/* Layer Stepper Navigation with Progress Line */}
            <div className="relative max-w-xl mx-auto mb-16 px-4">
                {/* Background Line */}
                <div className="absolute top-5 left-10 right-10 h-0.5 bg-white/5 rounded-full" />
                {/* Active Progress Line */}
                <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: layer === 1 ? '0%' : '100%' }}
                    className="absolute top-5 left-10 right-10 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full origin-left"
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                <div className="flex items-center justify-between relative z-10">
                    <LayerStep 
                        number={1} 
                        label="Perfil Estratégico" 
                        icon={Target} 
                        active={layer === 1} 
                        done={layer > 1}
                        onClick={() => setLayer(1)} 
                    />
                    <LayerStep 
                        number={2} 
                        label="Nivel de Crecimiento" 
                        icon={Network} 
                        active={layer === 2} 
                        done={layer > 2}
                        onClick={() => setLayer(2)} 
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={layer}
                    initial={{ opacity: 0, x: layer === 1 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: layer === 1 ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {layer === 1 && (
                        <div className="space-y-8">
                            <ClientStrategicProfile />
                            <div className="flex justify-end pt-8">
                                <button 
                                    onClick={() => setLayer(2)}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                                >
                                    Siguiente: Nivel <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {layer === 2 && (
                        <div className="space-y-8">
                            <ClientGrowthLevel />
                            <div className="flex justify-between pt-8">
                                <button 
                                    onClick={() => setLayer(1)}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 border border-white/10 transition-all active:scale-95"
                                >
                                    <ChevronLeft className="w-5 h-5" /> Volver a Perfil
                                </button>
                                <button 
                                    onClick={() => window.location.href = '?tab=progress'}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                                >
                                    Ver Mi Evolicitón <Layout className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function LayerStep({ number, label, icon: Icon, active, done, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 group transition-all ${active ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                active 
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                : done 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-[#0A0A0F] border-white/10 text-gray-500'
            }`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-left hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Capa {number}</p>
                <p className={`text-xs font-black uppercase tracking-tight ${active ? 'text-white' : 'text-gray-500'}`}>{label}</p>
            </div>
        </button>
    );
}
