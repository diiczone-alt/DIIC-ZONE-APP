'use client';

import { useState, useEffect } from 'react';
import {
    Wallet, CreditCard, Settings,
    Download, PieChart, AlertCircle,
    Loader2
} from 'lucide-react';
import { WalletCard, TransactionList } from '@/components/finance/FinanceComponents';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function FinancePage() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        available: '0.00',
        retained: '0.00',
        pending: '0.00'
    });

    useEffect(() => {
        const fetchFinanceData = async () => {
            if (!user?.full_name) return;
            setLoading(true);

            try {
                // Buscamos transacciones que mencionen el nombre del usuario en la descripción
                // En el libro mayor de la agencia, los pagos son 'expense' tipo 'Pago a Profesionales'
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
                    status: tx.type === 'expense' ? 'available' : 'pending' // Simplificación: si la agencia lo pagó/registró como gasto, está liberado para el usuario
                }));

                setTransactions(formatted);

                // Cálculo de métricas (Simplificado para esta fase)
                const totalAvailable = (data || [])
                    .filter(tx => tx.type === 'expense')
                    .reduce((acc, curr) => acc + Number(curr.amount), 0);

                setMetrics({
                    available: totalAvailable.toLocaleString(),
                    retained: '0.00',
                    pending: '0.00'
                });

            } catch (err) {
                console.error('Error fetching finance data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, [user]);

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-emerald-500" /> Wallet Creativa
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Gestiona tus ingresos y retiros de forma segura, {user.full_name.split(' ')[0]}.</p>
                </div>

                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                    <button className="px-4 py-2 bg-[#0E0E18] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <Settings className="w-4 h-4" /> Configurar Pagos
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                <WalletCard
                    available={metrics.available}
                    retained={metrics.retained}
                    pending={metrics.pending}
                    nextPayout="Próximo Ciclo"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Transactions */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-4 text-gray-500 font-bold uppercase text-xs tracking-widest">
                                <Loader2 className="w-6 h-6 animate-spin" /> Sincronizando transacciones...
                            </div>
                        ) : (
                            <TransactionList transactions={transactions} />
                        )}
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
                                        <div className="w-6 h-6 rounded-full bg-red-500/20" /> 
                                        <span className="text-red-600 font-bold text-[10px]">DIIC</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Cuenta Principal</p>
                                        <p className="text-xs text-gray-500">Sincronizado con Perfil</p>
                                    </div>
                                </div>
                                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">Activo</span>
                            </div>
                            <button className="w-full py-2 text-xs font-bold text-gray-400 hover:text-white border border-dashed border-white/10 rounded-lg hover:bg-white/5 transition-colors">
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
    );
}

