'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    CheckCircle2, Clock, FileVideo, Download, 
    ExternalLink, Search, History, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DELIVERIES = [
    { id: 1, title: 'Reel Lanzamiento Q4', client: 'FitLife Global', date: 'Hace 2 horas', status: 'Aprobado', version: 'V2', type: 'Final' },
    { id: 2, title: 'Testimonial Dr. Perez', client: 'Clinica Nova', date: 'Ayer', status: 'En Revisión', version: 'V1', type: 'Draft' },
    { id: 3, title: 'Promo Black Friday', client: 'Ecom Store', date: 'Hace 3 días', status: 'Rechazado', version: 'V1', type: 'Final' },
];

export default function DeliveriesPage() {
    const router = useRouter();
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="flex-1 flex flex-col px-12 py-10 space-y-10 overflow-y-auto bg-[#050511]">
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-8 right-8 z-[200] px-6 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-2 group cursor-pointer" onClick={() => router.push('/workstation/editor')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">Volver a Bandeja</span>
                    </div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Historial de Entregas</h1>
                    <p className="text-gray-500 font-medium">Control de versiones y estados de tus archivos enviados.</p>
                </div>
                <button 
                    onClick={() => showToast('Generando log de entregas...')}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95 shadow-xl"
                >
                    <History className="w-4 h-4" /> Exportar Log
                </button>
            </header>

            <div className="space-y-4">
                {DELIVERIES.map((delivery, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={delivery.id}
                        className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all shadow-lg"
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                                delivery.status === 'Aprobado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                delivery.status === 'Rechazado' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                                {delivery.status === 'Aprobado' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-white uppercase tracking-tight">{delivery.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-gray-500">{delivery.client}</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-indigo-400 font-mono font-bold">{delivery.version} - {delivery.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Enviado</p>
                                <p className="text-xs text-gray-300 font-bold">{delivery.date}</p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                delivery.status === 'Aprobado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                delivery.status === 'Rechazado' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                                {delivery.status}
                            </div>
                            <button 
                                onClick={() => showToast('Abriendo enlace de revisión...')}
                                className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-all active:scale-90"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Help/Action */}
            <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 rounded-[40px] p-12 text-center mt-12 shadow-2xl">
                <FileVideo className="w-16 h-16 text-indigo-500 opacity-20 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">¿Necesitas re-enviar una versión?</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">Si el cliente solicitó cambios fuera de la plataforma, puedes subir una nueva versión directamente desde aquí para mantener el historial limpio.</p>
                <button 
                    onClick={() => showToast('Abriendo cargador de archivos...')}
                    className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                    Subir Nueva Revisión
                </button>
            </div>
        </div>
    );
}
