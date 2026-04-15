'use client';

import { useState } from 'react';
import {
    Globe, ArrowRight, CheckCircle, Scale,
    Map, Layers, Users, Star, Award, Zap,
    Building2, Rocket, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MultiplicationWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);

    // Simulating block activation
    const [activeBlocks, setActiveBlocks] = useState([]);

    const runActivation = () => {
        setStep(3); // Go to activation screen
        const blocks = [1, 2, 3, 4, 5, 6];
        blocks.forEach((b, i) => {
            setTimeout(() => {
                setActiveBlocks(prev => [...prev, b]);
                if (i === blocks.length - 1) {
                    setTimeout(() => setStep(4), 2000); // Go to confirm
                }
            }, (i + 1) * 800);
        });
    };

    const nextStep = () => setStep(prev => prev + 1);

    // --- SCREENS ---

    const WelcomeScreen = () => (
        <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                <Globe className="w-12 h-12 text-cyan-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Modo Multiplicación</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Tu negocio ya no depende solo de ti. Convertimos tu marca en un sistema replicable y escalable globalmente.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 mx-auto">
                <Rocket className="w-5 h-5" /> Iniciar Expansión
            </button>
        </div>
    );

    const ExplanationScreen = () => (
        <div className="space-y-8">
            <StepHeader title="¿Qué significa Multiplicar?" subtitle="Pasar de 'Autoempleo' a 'Modelo de Negocio'." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard icon={Users} title="Sin Dependencia" desc="El sistema opera sin tu presencia física." />
                <FeatureCard icon={Map} title="Expansión Global" desc="Tu modelo funciona en cualquier ciudad." />
                <FeatureCard icon={Layers} title="Replicabilidad" desc="Documentación lista para franquiciar." />
            </div>

            <NavButtons next={runActivation} text="Activar Bloques de Expansión" color="cyan" />
        </div>
    );

    const ActivationScreen = () => (
        <div className="space-y-6 text-center">
            <StepHeader title="Construyendo Infraestructura" subtitle="Activando los 6 pilares de la multiplicación." />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <BlockCard id={1} active={activeBlocks.includes(1)} icon={LayoutGrid} title="Sistema de Marca" />
                <BlockCard id={2} active={activeBlocks.includes(2)} icon={Map} title="Expansión Geo" />
                <BlockCard id={3} active={activeBlocks.includes(3)} icon={Scale} title="Modelo Replicable" />
                <BlockCard id={4} active={activeBlocks.includes(4)} icon={Zap} title="Nuevas Líneas" />
                <BlockCard id={5} active={activeBlocks.includes(5)} icon={Star} title="Autoridad Ampliada" />
                <BlockCard id={6} active={activeBlocks.includes(6)} icon={Users} title="Equipo Autónomo" />
            </div>
        </div>
    );

    const ConfirmScreen = () => (
        <div className="space-y-6 text-center">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.4)]">
                <Building2 className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-3xl font-black text-white">¡Modo Multiplicación Activo!</h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-8 text-lg">
                Has desbloqueado el nivel máximo. Tu negocio ahora es un <strong>Sistema de Crecimiento y Expansión Empresarial</strong>.
            </p>

            <div className="flex gap-4 max-w-md mx-auto">
                <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Estado Anterior</div>
                    <div className="text-white font-bold">Negocio Local</div>
                </div>
                <div className="flex items-center text-cyan-500">
                    <ArrowRight className="w-6 h-6" />
                </div>
                <div className="flex-1 bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/30">
                    <div className="text-xs text-cyan-400 uppercase font-bold mb-1">Estado Actual</div>
                    <div className="text-white font-bold">Modelo Escalable</div>
                </div>
            </div>

            <div className="pt-8">
                <button onClick={onComplete} className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all shadow-xl flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5" /> Ir al Panel Global
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0A12] border border-cyan-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative shadow-cyan-900/20"
            >
                <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && <WelcomeScreen />}
                            {step === 2 && <ExplanationScreen />}
                            {step === 3 && <ActivationScreen />}
                            {step === 4 && <ConfirmScreen />}
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

function NavButtons({ next, text, color = 'cyan' }) {
    return (
        <div className="flex justify-end pt-8 border-t border-white/5 mt-8">
            <button
                onClick={next}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg`}
            >
                {text} <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="font-bold text-white text-sm mb-1">{title}</div>
                <div className="text-xs text-gray-400 leading-snug">{desc}</div>
            </div>
        </div>
    );
}

function BlockCard({ id, active, icon: Icon, title }) {
    return (
        <div className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all duration-500 ${active ? 'bg-cyan-500/20 border-cyan-500/50 scale-100 opacity-100' : 'bg-white/5 border-white/5 scale-95 opacity-50'}`}>
            <Icon className={`w-8 h-8 ${active ? 'text-white' : 'text-gray-600'}`} />
            <span className={`font-bold text-sm ${active ? 'text-cyan-400' : 'text-gray-500'}`}>{title}</span>
            {active && <CheckCircle className="w-4 h-4 text-green-400 animate-in fade-in zoom-in" />}
        </div>
    );
}
