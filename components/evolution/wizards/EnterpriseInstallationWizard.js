'use client';

import { useState } from 'react';
import {
    Building2, ArrowRight, CheckCircle, Bot, Braces,
    BarChart3, BrainCircuit, CreditCard, ShoppingBag,
    Layers, Zap, Globe, Smartphone, Mail, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnterpriseInstallationWizard({ onClose, onComplete }) {
    const [step, setStep] = useState('welcome'); // 'welcome', 'modules', 'form-1', 'form-2', 'form-3', 'form-4', 'confirm'
    const [installedModules, setInstalledModules] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        services: '',
        objective: '',
        channels: [],
        aiTone: '',
        payments: []
    });

    // --- MODULES ANIMATION LOGIC ---
    const modules = [
        { id: 'sales_ai', name: 'Agente IA de Ventas', icon: Bot, desc: 'Cierra ventas 24/7' },
        { id: 'crm', name: 'CRM Inteligente', icon: Users, desc: 'Centraliza clientes' },
        { id: 'analytics', name: 'Analíticas de Empresa', icon: BarChart3, desc: 'Control total de ROI' },
        { id: 'automation', name: 'Motor de Procesos', icon: Zap, desc: 'Automatiza flujos' },
        { id: 'finance', name: 'Finanzas Conectadas', icon: CreditCard, desc: 'Ingresos y Costos' },
        { id: 'store', name: 'Tienda Online', icon: ShoppingBag, desc: 'Venta Digital' },
    ];

    const startInstallation = () => {
        setStep('modules');
        // Simulate sequential installation
        modules.forEach((mod, index) => {
            setTimeout(() => {
                setInstalledModules(prev => [...prev, mod.id]);
                if (index === modules.length - 1) {
                    setTimeout(() => setStep('form-1'), 1500);
                }
            }, (index + 1) * 800);
        });
    };

    const nextStep = (next) => setStep(next);

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


    // --- SCREENS ---

    const WelcomeScreen = () => (
        <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Building2 className="w-12 h-12 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Sistema Empresarial Total</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Conecta marketing, ventas, clientes, procesos y finanzas en un solo flujo automático.
                </p>
            </div>
            <button onClick={startInstallation} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 mx-auto">
                <Zap className="w-5 h-5" /> Activar Sistema Empresarial
            </button>
        </div>
    );

    const ModulesScreen = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Instalando Módulos...</h3>
                <p className="text-gray-400">Construyendo tu infraestructura digital paso a paso.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {modules.map((mod) => {
                    const isInstalled = installedModules.includes(mod.id);
                    return (
                        <div key={mod.id} className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-500 ${isInstalled ? 'bg-indigo-500/20 border-indigo-500/50 scale-100 opacity-100' : 'bg-white/5 border-white/5 scale-95 opacity-50'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isInstalled ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                                <mod.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-bold text-sm ${isInstalled ? 'text-white' : 'text-gray-400'}`}>{mod.name}</div>
                                <div className="text-xs text-gray-500">{mod.desc}</div>
                            </div>
                            {isInstalled && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const FormStep1 = () => (
        <div className="space-y-6">
            <StepHeader title="Paso 1: Confirmar Negocio" subtitle="Datos clave para entrenar a todo el sistema." />
            <div className="space-y-4">
                <Input label="Nombre del Negocio" placeholder="Ej: Clínica Dental Elite" value={formData.name} onChange={e => setSingle('name', e.target.value)} />
                <Input label="Servicios Principales" placeholder="Ej: Ortodoncia, Implantes" value={formData.services} onChange={e => setSingle('services', e.target.value)} />
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Objetivo Principal</label>
                    <div className="grid grid-cols-2 gap-2">
                        <OptionButton label="Escalar Ventas" selected={formData.objective === 'sales'} onClick={() => setSingle('objective', 'sales')} />
                        <OptionButton label="Automatizar Todo" selected={formData.objective === 'auto'} onClick={() => setSingle('objective', 'auto')} />
                    </div>
                </div>
            </div>
            <NavButtons back={() => { }} next={() => nextStep('form-2')} disabled={!formData.name} color="indigo" />
        </div>
    );

    const FormStep2 = () => (
        <div className="space-y-6">
            <StepHeader title="Paso 2: Canales de Entrada" subtitle="¿Por dónde llegarán los clientes al sistema?" />
            <div className="space-y-3">
                <ActionCheck label="WhatsApp Business" checked={formData.channels.includes('wa')} onChange={() => toggleSelection('channels', 'wa')} color="indigo" />
                <ActionCheck label="Instagram / Facebook" checked={formData.channels.includes('social')} onChange={() => toggleSelection('channels', 'social')} color="indigo" />
                <ActionCheck label="Sitio Web" checked={formData.channels.includes('web')} onChange={() => toggleSelection('channels', 'web')} color="indigo" />
                <ActionCheck label="Email Corporativo" checked={formData.channels.includes('email')} onChange={() => toggleSelection('channels', 'email')} color="indigo" />
            </div>
            <NavButtons back={() => nextStep('form-1')} next={() => nextStep('form-3')} disabled={formData.channels.length === 0} color="indigo" />
        </div>
    );

    const FormStep3 = () => (
        <div className="space-y-6">
            <StepHeader title="Paso 3: Configurar Agente IA" subtitle="Tu vendedor estrella digital." />
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <StyleCard label="Formal" value="formal" current={formData.aiTone} set={v => setSingle('aiTone', v)} color="indigo" />
                    <StyleCard label="Amigable" value="friendly" current={formData.aiTone} set={v => setSingle('aiTone', v)} color="indigo" />
                    <StyleCard label="Vendedor" value="sales" current={formData.aiTone} set={v => setSingle('aiTone', v)} color="indigo" />
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-gray-400">
                    <p className="mb-2"><strong className="text-white">Capacidades Activas:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Responder mensajes 24/7</li>
                        <li>Calificar prospectos</li>
                        <li>Agendar citas automáticamente</li>
                        <li>Enviar links de pago</li>
                    </ul>
                </div>
            </div>
            <NavButtons back={() => nextStep('form-2')} next={() => nextStep('form-4')} disabled={!formData.aiTone} color="indigo" />
        </div>
    );

    const FormStep4 = () => (
        <div className="space-y-6">
            <StepHeader title="Paso 4: Conectar Finanzas" subtitle="Para cerrar el ciclo de venta." />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={CreditCard} label="Stripe / Tarjetas" selected={formData.payments.includes('stripe')} onClick={() => toggleSelection('payments', 'stripe')} color="indigo" />
                <SelectCard icon={ArrowRight} label="Transferencias" selected={formData.payments.includes('bank')} onClick={() => toggleSelection('payments', 'bank')} color="indigo" />
            </div>
            <NavButtons back={() => nextStep('form-3')} next={() => nextStep('confirm')} disabled={formData.payments.length === 0} color="indigo" />
        </div>
    );

    const ConfirmScreen = () => (
        <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">¡Sistema Empresarial Activado!</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-6">
                Tu negocio ha evolucionado. Ahora tienes una infraestructura digital que atrae, convierte, vende y organiza automáticamente.
            </p>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left space-y-3">
                <SummaryItem text="Agente IA Operativo" color="indigo" />
                <SummaryItem text="CRM Centralizado" color="indigo" />
                <SummaryItem text="Finanzas & Pagos Conectados" color="indigo" />
                <SummaryItem text="Automatización Full-Cycle" color="indigo" />
            </div>

            <div className="pt-6">
                <button onClick={onComplete} className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5" /> Ir al Panel de Control
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0A12] border border-indigo-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative shadow-indigo-900/20"
            >
                {step !== 'welcome' && step !== 'confirm' && (
                    <div className="h-1 bg-white/5 w-full">
                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: getProgress(step) }} />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 'welcome' && <WelcomeScreen />}
                            {step === 'modules' && <ModulesScreen />}
                            {step === 'form-1' && <FormStep1 />}
                            {step === 'form-2' && <FormStep2 />}
                            {step === 'form-3' && <FormStep3 />}
                            {step === 'form-4' && <FormStep4 />}
                            {step === 'confirm' && <ConfirmScreen />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white">✕</button>
            </motion.div>
        </div>
    );
}

function getProgress(step) {
    switch (step) {
        case 'modules': return '15%';
        case 'form-1': return '30%';
        case 'form-2': return '50%';
        case 'form-3': return '70%';
        case 'form-4': return '90%';
        default: return '0%';
    }
}

// --- Icons ---
function Users(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> }
function Rocket(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg> }


// --- Helpers ---
function StepHeader({ title, subtitle }) {
    return (
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
}

function NavButtons({ back, next, disabled, color = 'indigo' }) {
    return (
        <div className="flex justify-between pt-8 border-t border-white/5 mt-8">
            <button onClick={back} className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium">Atrás</button>
            <button
                onClick={next}
                disabled={disabled}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${disabled ? 'bg-white/5 text-gray-600 cursor-not-allowed' : `bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg`}`}
            >
                Continuar <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function Input({ label, placeholder, value, onChange }) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-black/30 text-white rounded-lg p-3 border border-white/10 focus:border-indigo-500 outline-none transition-all"
            />
        </div>
    );
}

function OptionButton({ label, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${selected ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
        >
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
}

function SelectCard({ icon: Icon, label, selected, onClick, color = 'indigo' }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${selected ? `bg-indigo-500/20 border-indigo-500 text-white` : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
        >
            <Icon className={`w-8 h-8 ${selected ? 'text-indigo-400' : 'text-gray-500'}`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
}

function ActionCheck({ label, checked, onChange, color = 'indigo' }) {
    return (
        <div
            onClick={onChange}
            className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all ${checked ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}`}>
                {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={`font-bold text-sm ${checked ? 'text-white' : 'text-gray-300'}`}>{label}</span>
        </div>
    );
}

function StyleCard({ label, value, current, set }) {
    const isSelected = current === value;
    return (
        <div
            onClick={() => set(value)}
            className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${isSelected ? 'bg-indigo-500/20 border-indigo-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`w-3 h-3 rounded-full border border-white/20 ${isSelected ? 'bg-indigo-500' : 'bg-transparent'}`} />
            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{label}</span>
        </div>
    );
}

function SummaryItem({ text, color = 'indigo' }) {
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className={`w-4 h-4 text-indigo-500`} />
            <span>{text}</span>
        </div>
    );
}
