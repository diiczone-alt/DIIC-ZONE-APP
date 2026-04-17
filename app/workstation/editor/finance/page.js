'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, CreditCard, Settings,
    Download, PieChart, AlertCircle, ChevronLeft,
    Loader2
} from 'lucide-react';
import { WalletCard, TransactionList } from '@/components/finance/FinanceComponents';
import PayoutModal from '@/components/finance/PayoutModal';
import PaymentMethodModal from '@/components/finance/PaymentMethodModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function EditorFinancePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [metrics, setMetrics] = useState({
        available: '0.00',
        retained: '0.00',
        pending: '0.00'
    });

    const fetchFinanceData = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);

        try {
            // Fetch Profile for Payment Config
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            setProfileData(profile);

            // Fetch Transactions (Filtered by Editor Name as reference)
            const { data, error } = await supabase
                .from('financial_transactions')
                .select('*')
                .ilike('description', `%${user.full_name}%`)
                .order('date', { ascending: false });

            if (error) throw error;

            const formatted = (data || []).map(tx => ({
                id: tx.id.slice(0, 8).toUpperCase(),
                project: tx.description,
                date: new Date(tx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                amount: `$${Number(tx.amount).toLocaleString()}`,
                status: tx.type === 'expense' ? 'available' : 
                        tx.type === 'payout_request' ? 'pending' : 'pending'
            }));

            setTransactions(formatted);

            const totalAvailable = (data || [])
                .filter(tx => tx.type === 'expense')
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            const totalRequested = (data || [])
                .filter(tx => tx.type === 'payout_request' && tx.status === 'pending')
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            setMetrics({
                available: (totalAvailable - totalRequested).toLocaleString(),
                retained: '0.00',
                pending: totalRequested.toLocaleString()
            });

        } catch (err) {
            console.error('Error fetching editor finance data:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchFinanceData();
    }, [fetchFinanceData]);

    const handleExport = () => {
        if (transactions.length === 0) {
            toast.error("No hay transacciones para exportar");
            return;
        }
        
        const headers = ["ID", "Proyecto/Descripción", "Fecha", "Monto", "Estado"];
        const csvContent = [
            headers.join(","),
            ...transactions.map(t => `${t.id},"${t.project}",${t.date},"${t.amount}",${t.status}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Reporte_Editor_${user?.full_name?.replace(' ', '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Reporte exportado correctamente");
    };

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511] text-white h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
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
                        onClick={handleExport}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/5"
                    >
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                    <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-500/5"
                    >
                        <Settings className="w-4 h-4" /> Configurar Pagos
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">

                <WalletCard
                    available={metrics.available}
                    retained={metrics.retained}
                    pending={metrics.pending}
                    onAction={() => setShowPayoutModal(true)}
                    nextPayout="Protocolo DIIC Activo"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                    {/* Left: Transactions */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-20 flex flex-col items-center gap-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                                <Loader2 className="w-6 h-6 animate-spin" /> Sincronizando Ledger...
                            </div>
                        ) : (
                            <TransactionList transactions={transactions} />
                        )}
                    </div>

                    {/* Right: Info & Methods */}
                    <div className="space-y-6">

                        {/* Payment Method */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <CreditCard className="w-4 h-4 text-purple-400" /> Método de Retiro
                            </h3>
                            
                            {profileData?.payment_method_config?.type ? (
                                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between mb-4 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
                                            <div className="w-6 h-6 rounded-full bg-red-500/20" /> 
                                            <span className="text-red-600 font-bold text-[10px]">DIIC</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase">
                                                {profileData.payment_method_config.type === 'bank' ? profileData.payment_method_config.bank_name : 
                                                 profileData.payment_method_config.type === 'paypal' ? 'PayPal' : 'Binance (USDT)'}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Activo / Verificado</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            ) : (
                                <div className="bg-orange-500/5 rounded-xl p-6 text-center mb-4 border border-orange-500/10">
                                    <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2 opacity-30" />
                                    <p className="text-[10px] text-gray-500 font-black uppercase leading-relaxed">No has configurado un método para recibir tus pagos.</p>
                                </div>
                            )}

                            <button 
                                onClick={() => setShowPaymentModal(true)}
                                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white border border-dashed border-white/10 rounded-2xl hover:bg-white/5 transition-all"
                            >
                                {profileData?.payment_method_config?.type ? 'Modificar Método' : '+ Configurar Método'}
                            </button>
                        </div>

                        {/* Breakdown Chart Placeholder */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <PieChart className="w-4 h-4 text-blue-400" /> Desglose DIIC
                            </h3>
                            <div className="h-40 flex items-center justify-center text-gray-500 text-xs">
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-white/5 mx-auto mb-2 border-t-purple-500 border-r-emerald-500 border-b-blue-500" />
                                    <p className="font-black uppercase tracking-widest text-[9px]">Análisis de Rendimiento Real</p>
                                </div>
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-[2rem] p-8">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-purple-400 shrink-0" />
                                <div>
                                    <h4 className="font-black text-white text-sm mb-2 uppercase tracking-tight">Cálculo de Saldo</h4>
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold">
                                        Tu saldo disponible se calcula sumando todos los proyectos validados por auditoría y restando las solicitudes de retiro pendientes o pagadas.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Modal de Solicitud de Retiro */}
            <PayoutModal 
                isOpen={showPayoutModal}
                onClose={() => setShowPayoutModal(false)}
                availableBalance={metrics.available}
                user={profileData || user}
                onUpdate={fetchFinanceData}
            />

            {/* Modal de Configuración de Pagos */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                user={profileData || user}
                onUpdate={fetchFinanceData}
            />
        </div>
    );
}
