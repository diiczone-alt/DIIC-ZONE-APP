'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingDown, Bell, CheckCircle, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Reglas simuladas de negocio
const ALERTS_CONFIG = [
    {
        id: 'alert_content',
        type: 'warning', // Yellow
        category: 'Contenido',
        condition: 'days_inactive > 4',
        title: '5 días sin publicar',
        message: 'Esto afecta tu alcance. El algoritmo penaliza la inactividad.',
        action: 'Crear Post',
        icon: Clock,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20'
    },
    {
        id: 'alert_production',
        type: 'critical', // Red
        category: 'Producción',
        condition: 'pending_review > 3',
        title: 'Proyecto en espera',
        message: 'Tienes 1 video pendiente de aprobación desde hace 4 días.',
        action: 'Revisar',
        icon: AlertTriangle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
    },
    {
        id: 'alert_crm',
        type: 'critical', // Red
        category: 'Ventas',
        condition: 'unanswered_leads > 0',
        title: '3 Leads sin respuesta',
        message: 'Contactos esperando desde hace 24h. Riesgo de pérdida.',
        action: 'Responder',
        icon: MessageSquare,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
    },
    {
        id: 'alert_growth',
        type: 'warning', // Yellow
        category: 'Crecimiento',
        condition: 'level_stagnant',
        title: 'Crecimiento detenido',
        message: 'Llevas 3 semanas en el mismo nivel. Es hora de avanzar.',
        action: 'Ver Plan',
        icon: TrendingDown,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20'
    }
];

export default function SmartAlertsCenter() {
    const [alerts, setAlerts] = useState([]);
    const [status, setStatus] = useState('scanning'); // scanning | clean | risk

    useEffect(() => {
        // Simular escaneo del sistema
        const timer = setTimeout(() => {
            // En una app real, esto vendría de un fetch a /api/alerts/check
            // Para demo: Mostramos algunas alertas activas por defecto
            setAlerts([ALERTS_CONFIG[1], ALERTS_CONFIG[0], ALERTS_CONFIG[2]]);
            setStatus('risk');
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleResolve = (id, action) => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
            loading: `Ejecutando: ${action}...`,
            success: 'Problema atendido. Alerta resuelta.',
            error: 'Error de conexión'
        });

        // Optimistic UI update: Remove alert
        setAlerts(prev => prev.filter(a => a.id !== id));

        // If no alerts left, set status to clean
        if (alerts.length <= 1) setStatus('clean');
    };

    return (
        <div className="rounded-3xl bg-[#0F0F1A]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl shadow-black/50">

            {/* Ambient Background Glow */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${status === 'clean' ? 'emerald' : 'red'}-500 to-transparent opacity-50`} />
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${status === 'clean' ? 'bg-emerald-500/5' : 'bg-red-500/5'} blur-3xl`} />

            {/* Header Status */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`relative p-3 rounded-2xl border transition-all duration-500 ${status === 'scanning'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                            : status === 'clean'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                        }`}>
                        {status === 'scanning' ? <Bell className="w-6 h-6 animate-bounce" /> : status === 'clean' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}

                        {/* Ping Effect for Critical */}
                        {status === 'risk' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />}
                    </div>

                    <div>
                        <h3 className="font-bold text-white text-lg tracking-tight">Centro de Alertas AI</h3>
                        <p className={`text-xs font-medium uppercase tracking-wider ${status === 'scanning' ? 'text-blue-400' : status === 'clean' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                            {status === 'scanning' ? 'Escaneando sistema...' : status === 'clean' ? 'Sistema Optimizado' : `${alerts.length} ALERTA${alerts.length > 1 ? 'S' : ''} ACTIVA${alerts.length > 1 ? 'S' : ''}`}
                        </p>
                    </div>
                </div>

                {/* Status Indicator Bar */}
                {status !== 'scanning' && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${status === 'clean'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                        {status === 'clean' ? '100% HEALTH' : 'Atención Requerida'}
                    </div>
                )}
            </div>

            {/* Alerts List */}
            <div className="p-4 space-y-3 relative z-10 flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
                {status === 'scanning' ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse border border-white/5" />
                    ))
                ) : alerts.length === 0 ? (
                    // Empty State
                    <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <CheckCircle className="w-8 h-8 text-emerald-500 opacity-80" />
                        </div>
                        <p className="text-lg font-bold text-white mb-1">Todo limpio</p>
                        <p className="text-xs opacity-50 max-w-[200px]">Tu negocio opera con máxima eficiencia. Sigue así.</p>
                    </div>
                ) : (
                    // Active Alerts
                    alerts.map((alert) => (
                        <div key={alert.id} className={`p-5 rounded-2xl border bg-gradient-to-br from-[#1A1A24] to-[#0F0F1A] relative group transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${alert.border
                            } ${alert.type === 'critical' ? 'shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' : ''}`}>

                            {/* Alert Type Indicator Line */}
                            <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${alert.bg.replace('bg-', 'bg-').replace('/10', '')}`} />

                            <div className="flex justify-between items-start mb-3 pl-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${alert.bg}`}>
                                        <alert.icon className={`w-3.5 h-3.5 ${alert.color}`} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${alert.color}`}>{alert.category}</span>
                                </div>
                                {alert.type === 'critical' && (
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                )}
                            </div>

                            <div className="pl-3">
                                <h4 className="text-white font-bold text-sm mb-1 group-hover:text-blue-200 transition-colors">{alert.title}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed mb-4">{alert.message}</p>

                                <button
                                    onClick={() => handleResolve(alert.id, alert.action)}
                                    className="w-full py-2.5 bg-white/5 hover:bg-white text-gray-300 hover:text-black border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
                                >
                                    {alert.action} <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
