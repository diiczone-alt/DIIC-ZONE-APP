'use client';

import { useState } from 'react';
import {
    Crown, ArrowRight, CheckCircle, Bell,
    Settings, Users, Megaphone, CreditCard,
    Play, Activity, Hexagon, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AutonomyWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [activeSystems, setActiveSystems] = useState([]);

    const runActivation = () => {
        setStep(3); // Go to activation screen
        const systems = [
            'sales', 'ops', 'team', 'marketing', 'finance', 'alerts'
        ];

        systems.forEach((sys, i) => {
            setTimeout(() => {
                setActiveSystems(prev => [...prev, sys]);
                if (i === systems.length - 1) {
                    setTimeout(() => setStep(4), 2500); // Go to confirm
                }
            }, (i + 1) * 900);
        });
    };

    const nextStep = () => setStep(prev => prev + 1);

    // --- SCREENS ---

    const WelcomeScreen = () => (
        <div className="text-center space-y-6">
            <div className="w-28 h-28 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.3)]">
                <Crown className="w-14 h-14 text-amber-400" />
            </div>
            <div>
                <h2 className="text-4xl font-black text-white mb-4">Autonomía Total</h2>
                <p className="text-amber-200/80 max-w-lg mx-auto text-lg leading-relaxed">
                    Llegaste al punto donde tu negocio ya no depende de tu tiempo.
                    Construimos un sistema que funciona, vende y crece solo.
                </p>
            </div>
            <button onClick={nextStep} className="px-10 py-5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black rounded-2xl text-xl shadow-xl shadow-amber-900/30 transition-all flex items-center gap-3 mx-auto transform hover:scale-105">
                <Crown className="w-6 h-6" /> Activar Autonomía
            </button>
        </div>
    );

    const DefinitionScreen = () => (
        <div className="space-y-8">
            <StepHeader title="¿Qué es un Negocio Autónomo?" subtitle="El fin de la operación manual del dueño." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BenefitItem text="Te vas de vacaciones, el negocio sigue vendiendo." />
                <BenefitItem text="No respondes mensajes, la IA lo hace." />
                <BenefitItem text="Tu equipo opera con protocolos, no con preguntas." />
                <BenefitItem text="Solo intervienes en decisiones estratégicas (Nivel 6)." />
            </div>

            <NavButtons next={runActivation} text="Instalar Sistema Autónomo" color="amber" />
        </div>
    );

    const InstallationScreen = () => (
        <div className="space-y-8 text-center">
            <StepHeader title="Instalando Core de Autonomía" subtitle="Configurando los 6 pilares de la libertad empresarial." />

            <div className="grid grid-cols-2 gap-4">
                <SystemCard
                    id="sales" active={activeSystems.includes('sales')}
                    icon={Activity} title="Ventas Automáticas"
                    desc="Embudos y Cierre sin intervención humana."
                />
                <SystemCard
                    id="ops" active={activeSystems.includes('ops')}
                    icon={Settings} title="Operación sin Dueño"
                    desc="Protocolos y Flujos de trabajo guiados."
                />
                <SystemCard
                    id="team" active={activeSystems.includes('team')}
                    icon={Users} title="Equipo Autogestionado"
                    desc="Asignación y monitoreo de tareas IA."
                />
                <SystemCard
                    id="marketing" active={activeSystems.includes('marketing')}
                    icon={Megaphone} title="Marketing Continuo"
                    desc="Contenido y Pauta en piloto automático."
                />
                <SystemCard
                    id="finance" active={activeSystems.includes('finance')}
                    icon={CreditCard} title="Finanzas Automáticas"
                    desc="Cobros, pagos y alertas de flujo."
                />
                <SystemCard
                    id="alerts" active={activeSystems.includes('alerts')}
                    icon={Bell} title="Control por Alertas"
                    desc="Solo te avisa si algo requiere tu atención."
                />
            </div>
        </div>
    );

    const ConfirmScreen = () => (
        <div className="space-y-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full flex items-center justify-center border-4 border-amber-900/50 shadow-2xl">
                    <Crown className="w-16 h-16 text-white" />
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-black text-white mb-2">¡ERES LIBRE!</h3>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Tu negocio ahora es una <strong className="text-amber-400">Infraestructura Digital Autónoma</strong>.
                </p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 max-w-lg mx-auto flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Rol Anterior:</span>
                    <span className="text-gray-500 line-through">Operador / Todólogo</span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Nuevo Rol:</span>
                    <span className="text-amber-400">Director de Sistema</span>
                </div>
            </div>

            <div className="pt-4">
                <button onClick={onComplete} className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all shadow-xl flex items-center justify-center gap-2">
                    <Play className="w-5 h-5 fill-black" /> Entrar al Modo Director
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#05050A] border border-amber-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative shadow-amber-900/40"
            >
                {/* Progress Bar */}
                <div className="h-1.5 bg-white/5 w-full">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-700" style={{ width: `${(step / 4) * 100}%` }} />
                </div>

                <div className="p-8 md:p-12 relative">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {step === 1 && <WelcomeScreen />}
                            {step === 2 && <DefinitionScreen />}
                            {step === 3 && <InstallationScreen />}
                            {step === 4 && <ConfirmScreen />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors">✕</button>
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

function NavButtons({ next, text, color = 'amber' }) {
    return (
        <div className="flex justify-end pt-8 border-t border-white/5 mt-8">
            <button
                onClick={next}
                className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20`}
            >
                {text} <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}

function BenefitItem({ text }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
            <span className="text-gray-200 font-medium">{text}</span>
        </div>
    );
}

function SystemCard({ id, active, icon: Icon, title, desc }) {
    return (
        <div className={`p-5 rounded-xl border flex flex-col gap-3 transition-all duration-500 relative overflow-hidden ${active ? `bg-amber-500/10 border-amber-500/50` : 'bg-white/5 border-white/5 opacity-40'}`}>
            <div className="flex justify-between items-start">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {active && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>

            <div>
                <div className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{title}</div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">{desc}</div>
            </div>

            {active && <div className="absolute bottom-0 left-0 h-1 bg-amber-500 w-full animate-pulse" />}
        </div>
    );
}
