'use client';

import {
    DollarSign, Lock, Clock, CheckCircle,
    ArrowUpRight, AlertCircle, Calendar
} from 'lucide-react';

export function WalletCard({ available, retained, pending, nextPayout }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Available Balance */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl -mr-10 -mt-10" />
                <div className="relative z-10">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Saldo Disponible
                    </p>
                    <h2 className="text-4xl font-black text-white mb-2">${available}</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        Próximo Pago: <span className="text-white font-bold">{nextPayout}</span>
                    </p>
                </div>
                <button className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-emerald-600/20">
                    Solicitar Retiro
                </button>
            </div>

            {/* Retained Balance */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -mr-10 -mt-10" />
                <div className="relative z-10">
                    <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Saldo Retenido
                    </p>
                    <h2 className="text-4xl font-black text-white mb-2">${retained}</h2>
                    <p className="text-xs text-gray-500">
                        Se libera al completar entregables o aprobación del cliente.
                    </p>
                </div>
            </div>

            {/* Pending Balance */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10" />
                <div className="relative z-10">
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> Por Facturar / Pendiente
                    </p>
                    <h2 className="text-4xl font-black text-white mb-2">${pending}</h2>
                    <p className="text-xs text-gray-500">
                        Proyectos en curso o pendientes de cierre administrativo.
                    </p>
                </div>
            </div>

        </div>
    );
}

export function TransactionList({ transactions }) {
    // Status Logic: 
    // 'available' -> Green (Liberado)
    // 'retained' -> Purple (Retenido)
    // 'pending' -> Blue (Pendiente)
    // 'paid' -> Gray/White (Pagado)

    const getStatusStyle = (status) => {
        if (status === 'available') return { label: 'Liberado', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle };
        if (status === 'retained') return { label: 'Retenido', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Lock };
        if (status === 'pending') return { label: 'Pendiente', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Clock };
        if (status === 'paid') return { label: 'Pagado', color: 'text-gray-400', bg: 'bg-white/5', icon: ArrowUpRight };
        return { label: 'Desconocido', color: 'text-gray-500', bg: 'bg-gray-800' };
    };

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">Actividad Reciente</h3>
                <button className="text-xs text-gray-400 hover:text-white transition-colors">Ver todo</button>
            </div>

            <div className="divide-y divide-white/5">
                {transactions.map((tx) => {
                    const style = getStatusStyle(tx.status);
                    const Icon = style.icon;

                    return (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bg} ${style.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{tx.project}</p>
                                    <p className="text-xs text-gray-500">{tx.date} • {tx.id}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-white' : 'text-red-400'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </p>
                                <span className={`text-[10px] font-bold uppercase ${style.color}`}>
                                    {style.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
