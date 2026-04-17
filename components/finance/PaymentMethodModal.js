'use client';

import { useState, useEffect } from 'react';
import { 
    X, CreditCard, Building2, Send, 
    Save, CheckCircle2, AlertCircle,
    Copy, Info, Landmark, Bitcoin,
    Search, ChevronDown, Check, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function PaymentMethodModal({ isOpen, onClose, user, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [searchBank, setSearchBank] = useState('');
    const [isBankOpen, setIsBankOpen] = useState(false);
    const [method, setMethod] = useState({
        type: 'bank',
        bank_name: '',
        account_number: '',
        account_holder: '',
        id_number: '',
        email: '',
        wallet_address: '',
    });

    useEffect(() => {
        if (user?.payment_method_config) {
            setMethod(prev => ({ ...prev, ...user.payment_method_config }));
        }
    }, [user]);

    const types = [
        { id: 'bank', label: 'Banco', icon: Landmark, color: 'text-blue-500' },
        { id: 'paypal', label: 'PayPal', icon: Send, color: 'text-indigo-400' },
        { id: 'binance', label: 'Binance', icon: Bitcoin, color: 'text-orange-500' },
    ];

    const handleSave = async () => {
        if (!user?.id) {
            toast.error("Sesión de usuario no válida");
            return;
        }

        // Simple validation
        if (method.type === 'bank' && (!method.bank_name || !method.account_number)) {
            toast.error("Completa los datos bancarios");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    payment_method_config: method 
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success("Método de pago actualizado");
            if (onUpdate) await onUpdate();
            if (onClose) onClose();
        } catch (err) {
            console.error('Error saving payment method:', err);
            toast.error("Error al guardar la configuración: " + (err.message || "Error Desconocido"));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const ecuadorBanks = [
        "Banco Pichincha", "Banco Guayaquil", "Banco del Pacífico", 
        "Produbanco", "Banco Bolivariano", "Banco Internacional",
        "Banco del Austro", "Banco Solidario", "Banco General Rumiñahui",
        "Diners Club del Ecuador", "Banco de Machala", "Banco Loja",
        "Cooperativa JEP", "Cooperativa 29 de Octubre"
    ].sort();

    const filteredBanks = ecuadorBanks.filter(b => 
        b.toLowerCase().includes(searchBank.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#0A0A12] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 border-b border-white/5 bg-gradient-to-r from-purple-500/5 to-transparent">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-purple-500" /> Configurar Pagos
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-widest italic leading-relaxed">
                        Sincronización segura con el Nodo DIIC Central
                    </p>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Method Selector */}
                    <div className="grid grid-cols-3 gap-4">
                        {types.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setMethod({ ...method, type: t.id })}
                                className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${method.type === t.id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                            >
                                <t.icon className={`w-6 h-6 ${method.type === t.id ? t.color : 'text-gray-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${method.type === t.id ? 'text-white' : 'text-gray-600'}`}>{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Fields */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={method.type}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {method.type === 'bank' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                    {/* Ecuadorian Bank Selector */}
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Nombre del Banco (Ecuador)</label>
                                        <div 
                                            onClick={() => setIsBankOpen(!isBankOpen)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-sm flex justify-between items-center cursor-pointer hover:border-purple-500/50 transition-all"
                                        >
                                            <span className={method.bank_name ? 'text-white' : 'text-gray-700'}>
                                                {method.bank_name || 'Selecciona tu banco...'}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isBankOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        <AnimatePresence>
                                            {isBankOpen && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-[110] left-0 right-0 top-[calc(100%+8px)] bg-[#0F0F1A] border border-white/10 rounded-2xl shadow-2xl p-2"
                                                >
                                                    <div className="relative mb-2">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                                                        <input 
                                                            autoFocus
                                                            type="text" 
                                                            placeholder="Buscar banco..."
                                                            value={searchBank}
                                                            onChange={(e) => setSearchBank(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white focus:outline-none focus:border-purple-500/50"
                                                        />
                                                    </div>
                                                    <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                                        {filteredBanks.map((bank) => (
                                                            <div 
                                                                key={bank}
                                                                onClick={() => {
                                                                    setMethod({ ...method, bank_name: bank });
                                                                    setIsBankOpen(false);
                                                                }}
                                                                className="px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer text-[10px] font-bold text-gray-400 hover:text-white flex justify-between items-center transition-colors"
                                                            >
                                                                {bank}
                                                                {method.bank_name === bank && <Check className="w-3 h-3 text-emerald-500" />}
                                                            </div>
                                                        ))}
                                                        {filteredBanks.length === 0 && (
                                                            <div className="py-4 text-center text-[10px] text-gray-600 font-bold uppercase italic">No se encontraron resultados</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <InputField 
                                        label="Número de Cuenta" 
                                        value={method.account_number} 
                                        onChange={(v) => setMethod({ ...method, account_number: v })} 
                                        placeholder="000-000000-00..." 
                                    />
                                    <InputField 
                                        label="Titular de la Cuenta" 
                                        value={method.account_holder} 
                                        onChange={(v) => setMethod({ ...method, account_holder: v })} 
                                        placeholder={user.full_name} 
                                    />
                                    <InputField 
                                        label="Documento de Identidad" 
                                        value={method.id_number} 
                                        onChange={(v) => setMethod({ ...method, id_number: v })} 
                                        placeholder="DNI / RUC..." 
                                    />
                                </div>
                            )}

                            {method.type === 'paypal' && (
                                <div className="text-left">
                                    <InputField 
                                        label="Correo de PayPal" 
                                        value={method.email} 
                                        onChange={(v) => setMethod({ ...method, email: v })} 
                                        placeholder="usuario@email.com" 
                                    />
                                    <p className="text-[10px] text-gray-500 mt-4 italic font-medium">
                                        * Las transacciones vía PayPal pueden estar sujetas a comisiones por parte de la plataforma externa.
                                    </p>
                                </div>
                            )}

                            {method.type === 'binance' && (
                                <div className="text-left">
                                    <InputField 
                                        label="Wallet Address (USDT - TRC20)" 
                                        value={method.wallet_address} 
                                        onChange={(v) => setMethod({ ...method, wallet_address: v })} 
                                        placeholder="T..." 
                                    />
                                    <div className="mt-6 flex gap-3 p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                                        <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-orange-400/80 leading-relaxed font-bold uppercase tracking-tight">
                                            Asegúrate de que la dirección sea correcta. Las transferencias en blockchain son irreversibles.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="p-8 bg-white/[0.02] flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 text-xs font-black text-gray-500 hover:text-white transition-colors"
                    >
                        DESCARTAR
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-[2] py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> GUARDAR CONFIGURACIÓN</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">{label}</label>
            <input 
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-sm focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-700"
            />
        </div>
    );
}
