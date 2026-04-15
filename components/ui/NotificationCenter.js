'use client';

import { useState } from 'react';
import {
    Bell, Check, X, Info,
    AlertTriangle, DollarSign, FileText
} from 'lucide-react';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'alert', title: 'Capacidad al 95%', message: 'El equipo de video está saturado.', time: 'Hace 5 min', read: false },
        { id: 2, type: 'finance', title: 'Pago Recibido', message: 'Cliente "Nike" ha pagado $450.', time: 'Hace 1h', read: false },
        { id: 3, type: 'project', title: 'Feedback v1', message: 'Cambios solicitados en "Boda Luis".', time: 'Hace 3h', read: true },
        { id: 4, type: 'system', title: 'Mantenimiento', message: 'Actualización programada 2:00 AM.', time: 'Ayer', read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'finance': return <DollarSign className="w-4 h-4 text-emerald-500" />;
            case 'project': return <FileText className="w-4 h-4 text-blue-500" />;
            default: return <Info className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative z-50">
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#050511]" />
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-[#0E0E18] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1A1A24]">
                            <h3 className="font-bold text-white text-sm">Notificaciones</h3>
                            <button className="text-[10px] text-gray-400 hover:text-white uppercase font-bold">
                                Marcar leídas
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-xs">
                                    No hay notificaciones nuevas.
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 ${n.read ? 'opacity-50' : ''}`}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center border border-white/5 bg-[#050511] shrink-0`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`text-sm font-bold ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.title}</p>
                                                <span className="text-[10px] text-gray-500">{n.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-snug">{n.message}</p>
                                        </div>
                                        {!n.read && (
                                            <div className="self-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 bg-[#1A1A24] border-t border-white/5 text-center">
                            <button className="text-xs text-gray-400 hover:text-white font-medium py-1 w-full">
                                Ver historial completo
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
