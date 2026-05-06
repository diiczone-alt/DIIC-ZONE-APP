'use client';

import { motion } from 'framer-motion';
import { 
    Bell, CheckCircle2, AlertCircle, 
    MessageSquare, Zap, Clock, X 
} from 'lucide-react';

const NOTIFICATIONS = [
    {
        id: 1,
        title: 'Nueva Revisión',
        message: 'El CM ha solicitado cambios en el reel de "Empresa Tech".',
        type: 'alert',
        time: 'Hace 5m',
        icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
        color: 'bg-rose-500/10 border-rose-500/20'
    },
    {
        id: 2,
        title: 'Pago Procesado',
        message: 'Tu pago de la quincena de Mayo ha sido aprobado.',
        type: 'success',
        time: 'Hace 1h',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        color: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
        id: 3,
        title: 'Mención en Chat',
        message: 'David: "¿Puedes revisar los crudos del cliente X?"',
        type: 'message',
        time: 'Hace 3h',
        icon: <MessageSquare className="w-4 h-4 text-indigo-400" />,
        color: 'bg-indigo-500/10 border-indigo-500/20'
    }
];

export default function NotificationsPanel({ onClose }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-0 w-[400px] bg-[#0E0E18]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
        >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Notificaciones</h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`p-4 rounded-2xl border ${n.color} group hover:bg-white/5 transition-all cursor-pointer`}>
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">{n.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-xs font-black text-white uppercase italic">{n.title}</h4>
                                    <span className="text-[10px] text-gray-500 font-bold">{n.time}</span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                                    {n.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-white transition-colors">
                    Marcar todo como leído
                </button>
            </div>
        </motion.div>
    );
}
