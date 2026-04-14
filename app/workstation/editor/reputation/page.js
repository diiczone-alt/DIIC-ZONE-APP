'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Star, Clock, MessageCircle, AlertTriangle, 
    ChevronLeft, Download, Settings 
} from 'lucide-react';

export default function ReputationPage() {
    const router = useRouter();
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const stats = [
        { label: 'Calidad Promedio', value: '4.8/5.0', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Puntualidad', value: '96%', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Comunicación', value: '4.9/5.0', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Correcciones (Avg)', value: '1.2', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    const history = [
        { project: 'Campaña Dental - Reels', date: 'Oct 12', score: '+150 XP', result: 'Impecable' },
        { project: 'Podcast Ep. 42', date: 'Oct 08', score: '+80 XP', result: 'A tiempo' },
        { project: 'Animación Logo', date: 'Oct 01', score: '+200 XP', result: 'Calidad Premium' },
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-8 right-8 z-[200] px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-1 group cursor-pointer" onClick={() => router.push('/workstation/editor')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1 bg-white/5 rounded border border-white/5 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all"
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </motion.div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">Volver a Bandeja</span>
                    </div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <Trophy className="w-6 h-6 text-indigo-500" /> Mi Reputación Profesional
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => showToast('Generando reporte de reputación...')}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/5"
                    >
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button 
                        onClick={() => showToast('Abriendo configuración de perfil...')}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-500/5"
                    >
                        <Settings className="w-4 h-4" /> Configurar
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0F0F1A] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -mr-16 -mt-16" />

                        <div className="flex items-center gap-6 mb-8 relative z-10">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <span className="text-4xl font-black text-white">84</span>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Trust Score</div>
                                <h2 className="text-2xl font-bold text-white">Nivel 2 - Operativo</h2>
                                <p className="text-gray-500 text-sm mt-1">Sólido desempeño. Estás a <span className="text-white font-bold">12 puntos</span> del Nivel 3.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                                <span>Progreso Nivel 3</span>
                                <span>750 / 1000 XP</span>
                            </div>
                            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[75%]" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:border-white/10 transition-colors">
                                <div className={`p-3 rounded-xl mb-3 ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0A0A12] border border-white/5 rounded-3xl overflow-hidden p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Historial de Rendimiento</h3>
                    <div className="space-y-4">
                        {history.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <h4 className="text-white font-bold">{item.project}</h4>
                                    <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-indigo-400 font-black text-sm">{item.score}</div>
                                    <div className="text-xs text-emerald-400 font-bold uppercase">{item.result}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
