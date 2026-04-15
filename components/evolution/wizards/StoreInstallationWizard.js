'use client';

import { useState } from 'react';
import {
    ShoppingBag, ArrowRight, CheckCircle, CreditCard,
    Truck, Zap, Package, Tag, Globe, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoreInstallationWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        niche: '', // 'medical', 'gym', 'products', 'restaurant', 'courses'
        products: [], // demo items
        payments: [], // 'transfer', 'card', 'cash', 'link'
        delivery: '', // 'digital', 'physical'
        automations: [] // 'crm', 'confirm', 'notify', 'followup'
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const toggleSelection = (field, value) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(value)) return { ...prev, [field]: list.filter(item => item !== value) };
            return { ...prev, [field]: [...list, value] };
        });
    };

    const setSingle = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- STEPS ---

    const WelcomeStep = () => (
        <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <ShoppingBag className="w-12 h-12 text-violet-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Tienda Online Inteligente</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Vende productos o servicios en piloto automático y recibe pagos 24/7.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 mx-auto">
                <Tag className="w-5 h-5" /> Comenzar Configuración
            </button>
        </div>
    );

    const NicheStep = () => (
        <div className="space-y-6">
            <StepHeader title="¿Qué vas a vender?" subtitle="Adaptamos tu catálogo a tu negocio." />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Package} label="Productos Físicos" selected={formData.niche === 'products'} onClick={() => setSingle('niche', 'products')} color="violet" />
                <SelectCard icon={Zap} label="Servicios / Consultas" selected={formData.niche === 'medical'} onClick={() => setSingle('niche', 'medical')} color="violet" />
                <SelectCard icon={Globe} label="Cursos Digitales" selected={formData.niche === 'courses'} onClick={() => setSingle('niche', 'courses')} color="violet" />
                <SelectCard icon={Gift} label="Membresías / Planes" selected={formData.niche === 'gym'} onClick={() => setSingle('niche', 'gym')} color="violet" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.niche} color="violet" />
        </div>
    );

    const ProductsStep = () => (
        <div className="space-y-6">
            <StepHeader title="Tus Productos" subtitle="Agrega ejemplos para iniciar tu tienda." />

            {/* Product Dummy Form */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4">
                <div className="flex gap-4">
                    <div className="w-20 h-20 bg-white/5 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-gray-500">
                        <div className="text-xs text-center">Subir<br />Foto</div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <input type="text" placeholder="Nombre del Producto..." className="w-full bg-black/30 text-white rounded-lg p-2 border border-white/10 text-sm" />
                        <div className="flex gap-2">
                            <input type="text" placeholder="Precio $$$" className="w-1/2 bg-black/30 text-white rounded-lg p-2 border border-white/10 text-sm" />
                            <input type="text" placeholder="Stock" className="w-1/2 bg-black/30 text-white rounded-lg p-2 border border-white/10 text-sm" />
                        </div>
                    </div>
                </div>
                <div className="text-center pt-2">
                    <span className="text-xs text-violet-400 font-bold cursor-pointer hover:text-white">+ Agregar otro ítem</span>
                </div>
            </div>

            <NavButtons back={prevStep} next={nextStep} disabled={false} color="violet" />
        </div>
    );

    const PaymentStep = () => (
        <div className="space-y-6">
            <StepHeader title="Métodos de Pago" subtitle="¿Cómo te pagarán tus clientes?" />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={CreditCard} label="Tarjeta (Stripe)" selected={formData.payments.includes('card')} onClick={() => toggleSelection('payments', 'card')} color="violet" />
                <SelectCard icon={ArrowRight} label="Transferencia" selected={formData.payments.includes('transfer')} onClick={() => toggleSelection('payments', 'transfer')} color="violet" />
                <SelectCard icon={Globe} label="Link de Pago" selected={formData.payments.includes('link')} onClick={() => toggleSelection('payments', 'link')} color="violet" />
                <SelectCard icon={CheckCircle} label="Contra Entrega" selected={formData.payments.includes('cash')} onClick={() => toggleSelection('payments', 'cash')} color="violet" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.payments.length === 0} color="violet" />
        </div>
    );

    const DeliveryStep = () => (
        <div className="space-y-6">
            <StepHeader title="Método de Entrega" subtitle="¿Cómo recibe el cliente su compra?" />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Truck} label="Envío Físico" selected={formData.delivery === 'physical'} onClick={() => setSingle('delivery', 'physical')} color="violet" />
                <SelectCard icon={Zap} label="Acceso Digital" selected={formData.delivery === 'digital'} onClick={() => setSingle('delivery', 'digital')} color="violet" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.delivery} color="violet" />
        </div>
    );

    const AutomationsStep = () => (
        <div className="space-y-6">
            <StepHeader title="Automatizaciones de Venta" subtitle="Que el sistema trabaje por ti." />
            <div className="space-y-3">
                <ActionCheck label="Guardar Compra en CRM" desc="Crea historial de cliente." checked={formData.automations.includes('crm')} onChange={() => toggleSelection('automations', 'crm')} color="violet" />
                <ActionCheck label="Email de Confirmación" desc="Recibo automático al pagar." checked={formData.automations.includes('confirm')} onChange={() => toggleSelection('automations', 'confirm')} color="violet" />
                <ActionCheck label="Avisar a mi WhatsApp" desc="Notificarme nueva venta." checked={formData.automations.includes('notify')} onChange={() => toggleSelection('automations', 'notify')} color="violet" />
                <ActionCheck label="Secuencia Post-Venta" desc="Pedir reseña a los 3 días." checked={formData.automations.includes('followup')} onChange={() => toggleSelection('automations', 'followup')} color="violet" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.automations.length === 0} color="violet" />
        </div>
    );

    const SummaryStep = () => (
        <div className="space-y-6">
            <StepHeader title="Tienda Creada" subtitle="Tu sistema de ventas está listo:" />

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-violet-400" />
                    <span className="font-bold text-white">Tipo: <span className="text-violet-400 capitalize">{formData.niche}</span></span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2">
                    <SummaryItem text={`Pagos: ${formData.payments.join(', ')}`} color="violet" />
                    <SummaryItem text={`Entrega: ${formData.delivery}`} color="violet" />
                    <SummaryItem text={`Automatizaciones: ${formData.automations.length} reglas`} color="violet" />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">
                    Atrás
                </button>
                <button onClick={onComplete} className="flex-1 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-black rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" /> Crear Tienda Online
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0A12] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
                <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }} />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && <WelcomeStep />}
                            {step === 2 && <NicheStep />}
                            {step === 3 && <ProductsStep />}
                            {step === 4 && <PaymentStep />}
                            {step === 5 && <DeliveryStep />}
                            {step === 6 && <AutomationsStep />}
                            {step === 7 && <SummaryStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white">✕</button>
            </motion.div>
        </div>
    );
}

// --- Helpers ---

function StepHeader({ title, subtitle }) {
    return (
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
}

function NavButtons({ back, next, disabled, color = 'emerald' }) {
    const bg = color === 'violet' ? 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/20' : 'bg-purple-600';
    return (
        <div className="flex justify-between pt-8 border-t border-white/5 mt-8">
            <button onClick={back} className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium">Atrás</button>
            <button
                onClick={next}
                disabled={disabled}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${disabled ? 'bg-white/5 text-gray-600 cursor-not-allowed' : `${bg} text-white shadow-lg`}`}
            >
                Siguiente <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function SelectCard({ icon: Icon, label, selected, onClick, color = 'violet' }) {
    const activeClass = color === 'violet' ? 'bg-violet-500/20 border-violet-500' : 'bg-blue-500/20 border-blue-500';
    const activeText = color === 'violet' ? 'text-violet-400' : 'text-blue-400';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${selected ? `${activeClass} text-white` : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
        >
            <Icon className={`w-8 h-8 ${selected ? activeText : 'text-gray-500'}`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
}

function ActionCheck({ label, desc, checked, onChange, color = 'violet' }) {
    const activeClass = color === 'violet' ? 'bg-violet-500/10 border-violet-500/50' : 'bg-white/5 border-white/5';
    const checkClass = color === 'violet' ? 'bg-violet-500 border-violet-500' : 'bg-blue-500 border-blue-500';

    return (
        <div
            onClick={onChange}
            className={`cursor-pointer p-4 rounded-xl border flex items-start gap-4 transition-all ${checked ? activeClass : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? checkClass : 'border-gray-600'}`}>
                {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
                <div className={`font-bold text-sm ${checked ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
        </div>
    );
}

function SummaryItem({ text, color = 'emerald' }) {
    const col = color === 'violet' ? 'text-violet-500' : 'text-green-500';
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className={`w-4 h-4 ${col}`} />
            <span>{text}</span>
        </div>
    );
}
