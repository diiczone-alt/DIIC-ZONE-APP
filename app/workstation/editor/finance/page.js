'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, CreditCard, Settings,
    Download, PieChart, AlertCircle, ChevronLeft
} from 'lucide-react';
import { WalletCard, TransactionList } from '@/components/finance/FinanceComponents';

export default function FinancePage() {
    const router = useRouter();
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // Mock Data
    const transactions = [
        { id: 'TX-9901', project: 'Edición Video - Campaña Nike', date: '24 Feb 2026', amount: '$450.00', status: 'pending' },
        { id: 'TX-9822', project: 'Retiro a Cuenta ****4501', date: '20 Feb 2026', amount: '-$1,200.00', status: 'paid' },
        { id: 'TX-9801', project: 'Sesión Fotos - Boda Luis & Ana', date: '18 Feb 2026', amount: '$800.00', status: 'retained' },
        { id: 'TX-9755', project: 'Reel Instagram - Promo', date: '15 Feb 2026', amount: '$150.00', status: 'available' },
        { id: 'TX-9750', project: 'Bono Nivel 3 - Pro', date: '15 Feb 2026', amount: '$50.00', status: 'available' },
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
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

            {/* Header */}
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-1 group cursor-pointer" onClick={() => router.push('/workstation/editor')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1 bg-white/5 rounded border border-white/5 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all"
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </motion.div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">Volver a Bandeja</span>
                    </div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <Wallet className="w-6 h-6 text-emerald-500" /> Wallet Creativa
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => showToast('Iniciando descarga de reporte...')}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/5"
                    >
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                    <button 
                        onClick={() => showToast('Abriendo configuración de pagos...')}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-500/5"
                    >
                        <Settings className="w-4 h-4" /> Configurar
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12">

                <WalletCard
                    available="1,450.00"
                    retained="800.00"
                    pending="450.00"
                    nextPayout="15 Mar 2026"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Transactions */}
                    <div className="lg:col-span-2 space-y-6">
                        <TransactionList transactions={transactions} />
                    </div>

                    {/* Right: Info & Methods */}
                    <div className="space-y-6">

                        {/* Payment Method */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-purple-400" /> Método de Retiro
                            </h3>
                            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-red-500/20" /> {/* Santander Mock Logo */}
                                        <span className="text-red-600 font-bold text-[10px]">SAN</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Santander ****4501</p>
                                        <p className="text-xs text-gray-500">Cuenta de Ahorros</p>
                                    </div>
                                </div>
                                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">Activo</span>
                            </div>
                            <button 
                                onClick={() => showToast('Abriendo formulario de nueva cuenta...')}
                                className="w-full py-2 text-xs font-bold text-gray-400 hover:text-white border border-dashed border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                + Agregar Cuenta
                            </button>
                        </div>

                        {/* Breakdown Chart Placeholder */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-blue-400" /> Desglose de Ingresos
                            </h3>
                            <div className="h-40 flex items-center justify-center text-gray-500 text-xs">
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-white/5 mx-auto mb-2 border-t-purple-500 border-r-emerald-500" />
                                    <p>80% Servicios</p>
                                    <p>20% Bonos</p>
                                </div>
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1">Tip de Nivel 3</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Los creativos <strong>Nivel 4</strong> desbloquean retiros express (24h). ¡Te faltan 500 XP!
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
