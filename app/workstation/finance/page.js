'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Wallet, CreditCard, Settings,
    Download, PieChart, AlertCircle,
    Loader2, Landmark, Send, Bitcoin, Trash2
} from 'lucide-react';
import { WalletCard, TransactionList } from '@/components/finance/FinanceComponents';
import DynamicSidebar from '@/components/shared/DynamicSidebar';
import PayoutModal from '@/components/finance/PayoutModal';
import PaymentMethodModal from '@/components/finance/PaymentMethodModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function FinancePage() {
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

            // Fetch Transactions
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

            // Restamos las solicitudes de retiro pendientes del saldo disponible visualmente
            const totalRequested = (data || [])
                .filter(tx => tx.type === 'payout_request' && tx.status === 'pending')
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            setMetrics({
                available: (totalAvailable - totalRequested).toLocaleString(),
                retained: '0.00',
                pending: totalRequested.toLocaleString()
            });

        } catch (err) {
            console.error('Error fetching finance data:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchFinanceData();
    }, [fetchFinanceData]);

    const handleDeletePaymentMethod = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este método de pago?")) return;
        
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ payment_method_config: {} })
                .eq('id', user.id);

            if (error) throw error;
            
            toast.success("Método de pago eliminado");
            fetchFinanceData();
        } catch (err) {
            console.error('Error deleting payment method:', err);
            toast.error("Error al eliminar el método");
        }
    };

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
        link.setAttribute("download", `Reporte_Financiero_${user?.full_name?.replace(' ', '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Reporte exportado correctamente");
    };

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="flex bg-[#050511] min-h-screen">
            {/* Sidebar Lateral Izquierda */}
            <DynamicSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-3">
                            <Wallet className="w-6 h-6 text-emerald-500" /> Wallet Creativa
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Gestiona tus ingresos y retiros de forma segura, {user.full_name.split(' ')[0]}.</p>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleExport}
                            className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Exportar Reporte
                        </button>
                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <Settings className="w-4 h-4" /> Configurar Pagos
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    <WalletCard
                        available={metrics.available}
                        retained={metrics.retained}
                        pending={metrics.pending}
                        onAction={() => setShowPayoutModal(true)}
                        nextPayout="Protocolo DIIC Activo"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

                        {/* Left: Transactions */}
                        <div className="lg:col-span-2 space-y-6">
                            {loading ? (
                                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-4 text-gray-500 font-bold uppercase text-xs tracking-widest">
                                    <Loader2 className="w-6 h-6 animate-spin" /> Sincronizando...
                                </div>
                            ) : (
                                <TransactionList transactions={transactions} />
                            )}
                        </div>

                        {/* Right: Info & Methods */}
                        <div className="space-y-6">

                            {/* Payment Method */}
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                                    <CreditCard className="w-4 h-4 text-purple-400" /> Método de Retiro
                                </h3>
                                
                                {profileData?.payment_method_config && Object.keys(profileData.payment_method_config).length > 0 ? (
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between mb-4 hover:border-purple-500/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                                {profileData.payment_method_config.type === 'bank' && <Landmark className="w-5 h-5 text-blue-400" />}
                                                {profileData.payment_method_config.type === 'paypal' && <Send className="w-5 h-5 text-indigo-400" />}
                                                {profileData.payment_method_config.type === 'binance' && <Bitcoin className="w-5 h-5 text-orange-400" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white capitalize">
                                                    {profileData.payment_method_config.type === 'bank' ? profileData.payment_method_config.bank_name : 
                                                     profileData.payment_method_config.type === 'paypal' ? 'PayPal Checkout' : 'Binance Wallet'}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-medium font-mono">
                                                    {profileData.payment_method_config.type === 'bank' ? `****${profileData.payment_method_config.account_number?.slice(-4)}` : 
                                                     profileData.payment_method_config.type === 'paypal' ? profileData.payment_method_config.email : 
                                                     `${profileData.payment_method_config.wallet_address?.slice(0, 6)}...${profileData.payment_method_config.wallet_address?.slice(-4)}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">Activo</span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePaymentMethod();
                                                }}
                                                className="p-1.5 text-gray-700 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                                                title="Eliminar método"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex items-center gap-3 mb-4">
                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                        <p className="text-[10px] text-red-200/60 font-medium leading-tight">No has configurado un método de retiro. Los pagos están retenidos.</p>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setShowPaymentModal(true)}
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white border border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-all"
                                >
                                    + Modificar Método
                                </button>
                            </div>

                            {/* Logic Explanation */}
                            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-1">Cálculo en Tiempo Real</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            Tu saldo se actualiza automáticamente cuando la administración registra un pago bajo tu nombre de usuario: <strong>{user.full_name}</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </main>
            </div>

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
