'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Star, Clock, MessageCircle, AlertTriangle, 
    ChevronLeft, Download, Settings, Camera, ShieldCheck 
} from 'lucide-react';

export default function FilmmakerReputationPage() {
    const router = useRouter();
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const stats = [
        { label: 'Calidad de Tomas', value: '4.9/5.0', icon: Camera, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'Puntualidad en Set', value: '98%', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Comunicación', value: '4.8/5.0', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Organización SD', value: 'Impecable', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    const history = [
        { project: 'Video Corporativo - Clínica Smith', date: 'Oct 12', score: '+150 XP', result: 'Tomas Excelentes' },
        { project: 'Reels Rutina - FitLife Gym', date: 'Oct 08', score: '+80 XP', result: 'A tiempo' },
        { project: 'Cobertura Evento - Tech Solutions', date: 'Oct 01', score: '+200 XP', result: 'Audio impecable' },
    ];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050511] text-white">
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-8 right-8 z-[200] px-6 py-3 bg-cyan-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-1 group cursor-pointer" onClick={() => router.push('/workstation/filmmaker')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1 bg-white/5 rounded border border-white/5 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all"
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </motion.div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">Volver a Tablero</span>
                    </div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <Trophy className="w-6 h-6 text-cyan-500" /> Mi Reputación Profesional
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => showToast('Generando reporte de reputación...')}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/5"
                    >
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button 
                        onClick={() => showToast('Abriendo configuración de perfil...')}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/5"
                    >
                        <Settings className="w-4 h-4" /> Configurar
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0F0F1A] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/20 blur-3xl rounded-full -mr-16 -mt-16" />

                        <div className="flex items-center gap-6 mb-8 relative z-10">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                                <span className="text-4xl font-black text-white">88</span>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-1">Trust Score</div>
                                <h2 className="text-2xl font-bold text-white">Nivel 2 - Profesional</h2>
                                <p className="text-gray-500 text-sm mt-1">Excelente constancia en set. Estás a <span className="text-white font-bold">120 puntos</span> de Nivel 3.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                                <span>Progreso Nivel 3</span>
                                <span>880 / 1000 XP</span>
                            </div>
                            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 w-[88%]" />
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

                <div className="bg-[#0A0A12] border border-white/5 rounded-3xl overflow-hidden p-6 pb-20">
                    <h3 className="text-lg font-bold text-white mb-6">Historial de Calificaciones en Rodaje</h3>
                    <div className="space-y-4">
                        {history.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <h4 className="text-white font-bold">{item.project}</h4>
                                    <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-cyan-400 font-black text-sm">{item.score}</div>
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
