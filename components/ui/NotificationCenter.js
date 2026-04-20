'use client';

import { useState } from 'react';
import {
    Bell, Check, X, Info,
    AlertTriangle, DollarSign, FileText
} from 'lucide-react';

export default function NotificationCenter({ notifications = [], onMarkAsRead, onMarkAllAsRead, onViewAll }) {
    const [isOpen, setIsOpen] = useState(false);
    // local notifications state can be removed if using props, but I'll keep it as fallback
    const [localNotifications, setLocalNotifications] = useState([]);
    
    const displayNotifications = notifications.length > 0 ? notifications : localNotifications;
    const unreadCount = displayNotifications.filter(n => (n.status === 'unread' || !n.read)).length;

    const markAsRead = (id) => {
        if (onMarkAsRead) {
            onMarkAsRead(id);
        } else {
            setLocalNotifications(localNotifications.map(n => n.id === id ? { ...n, read: true } : n));
        }
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
                className={`p-2.5 rounded-xl border transition-all relative group h-10 w-10 flex items-center justify-center ${
                    isOpen || unreadCount > 0
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'bg-white/[0.03] border-white/5 text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/10'
                }`}
            >
                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#050511] animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-[#0E0E18] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1A1A24]">
                            <h3 className="font-bold text-white text-sm">Notificaciones</h3>
                            <button 
                                onClick={onMarkAllAsRead}
                                className="text-[10px] text-gray-400 hover:text-white uppercase font-bold"
                            >
                                Marcar leídas
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {displayNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-xs">
                                    No hay notificaciones nuevas.
                                </div>
                            ) : (
                                displayNotifications.map(n => (
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
                            <button 
                                onClick={onViewAll}
                                className="text-xs text-gray-400 hover:text-white font-medium py-1 w-full"
                            >
                                Ver historial completo
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
