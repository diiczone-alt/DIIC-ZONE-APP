'use client';

import { useState } from 'react';
import { 
    X, DollarSign, Send, 
    AlertCircle, CheckCircle2,
    ArrowRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function PayoutModal({ isOpen, onClose, availableBalance, user, onUpdate }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const numericBalance = parseFloat(availableBalance.replace(/,/g, ''));

    const handleSubmit = async () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            toast.error("Ingresa un monto válido");
            return;
        }

        if (val > numericBalance) {
            toast.error("El monto excede tu saldo disponible");
            return;
        }

        setLoading(true);
        setStatus('loading');

        try {
            // Creamos una transacción de tipo 'payout_request' (registrada como income negativo o simplemente por descripción)
            // Para el Protocolo DIIC, registramos una transacción de tipo 'expense' pero con descripción que indica solicitud
            const { error } = await supabase
                .from('financial_transactions')
                .insert([{
                    type: 'payout_request', // Nuevo tipo para solicitudes
                    category: 'Retiros',
                    subcategory: 'Solicitud Manual',
                    amount: val,
                    currency: 'USD',
                    description: `SOLICITUD RETIRO: ${user.full_name}`,
                    date: new Date().toISOString(),
                    status: 'pending' // Estado pendiente de aprobación por el Administrador
                }]);

            if (error) throw error;

            setStatus('success');
            toast.success("Solicitud enviada", { description: "La administración revisará tu retiro en las próximas 24h." });
            
            setTimeout(() => {
                onUpdate();
                onClose();
                setStatus('idle');
                setAmount('');
            }, 2500);

        } catch (err) {
            console.error('Error al solicitar retiro:', err);
            toast.error("Error al procesar la solicitud");
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#0A0A12] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {status === 'success' ? (
                    <div className="p-12 text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-2">¡Solicitud Exitosa!</h3>
                            <p className="text-gray-400 text-sm">Tu solicitud de retiro por <strong className="text-white">${amount}</strong> ha sido enviada al núcleo de administración.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-8 border-b border-white/5">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-purple-500" /> Solicitar Retiro
                            </h3>
                            <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-widest italic leading-relaxed">
                                Protocolo DIIC - Transferencia Directa
                            </p>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Balance Info */}
                            <div className="bg-purple-600/5 border border-purple-500/20 p-4 rounded-2xl">
                                <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-1">Saldo Disponible</p>
                                <h4 className="text-2xl font-black text-white">${availableBalance}</h4>
                            </div>

                            {/* Input Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Monto a Retirar (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                    <input 
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-white font-black text-lg focus:outline-none focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 italic">Monto mínimo: $10.00 • Comisión DIIC: $0.00</p>
                            </div>

                            {/* Warning */}
                            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex gap-3">
                                <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    Al solicitar el retiro, los fondos pasarán a estado **Bloqueado** hasta que la transferencia sea procesada por el equipo de finanzas.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] flex gap-3">
                            <button 
                                onClick={onClose}
                                className="flex-1 py-4 text-xs font-black text-gray-500 hover:text-white transition-colors"
                            >
                                CANCELAR
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || !amount}
                                className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        PROCESAR RETIRO <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
