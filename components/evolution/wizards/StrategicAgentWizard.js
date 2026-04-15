'use client';

import { useState } from 'react';
import {
    BrainCircuit, ArrowRight, CheckCircle, BarChart3,
    LineChart, TrendingUp, AlertTriangle, Lightbulb,
    Target, Zap, Search, PieChart, Milestone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StrategicAgentWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);

    // Auto-advance for "Analysis" simulation steps
    const autoAdvance = (ms = 2500) => {
        setTimeout(() => setStep(prev => prev + 1), ms);
    };

    const nextStep = () => setStep(prev => prev + 1);

    // --- SCREENS ---

    const WelcomeScreen = () => (
        <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto border border-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,239,0.3)]">
                <BrainCircuit className="w-12 h-12 text-fuchsia-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Dirección Estratégica IA</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Hola, ahora no solo tienes marketing... tienes un Director Estratégico que analiza tu negocio y te guía para crecer.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-fuchsia-600/30 transition-all flex items-center gap-2 mx-auto">
                <Lightbulb className="w-5 h-5" /> Activar Director IA
            </button>
        </div>
    );

    const AnalysisScreen = () => {
        // Trigger auto-advance after mount
        useState(() => autoAdvance(4000), []);

        return (
            <div className="space-y-8 text-center">
                <StepHeader title="Analizando tu Negocio..." subtitle="Conectando puntos de data clave." />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnalysisCard icon={Search} label="Contenido" text="Revisando qué posts venden más..." delay={0} />
                    <AnalysisCard icon={PieChart} label="Canales" text="Detectando mejor fuente de leads..." delay={0.5} />
                    <AnalysisCard icon={LineChart} label="Rentabilidad" text="Calculando margen por servicio..." delay={1} />
                    <AnalysisCard icon={AlertTriangle} label="Fugas" text="Encontrando dónde se pierden clientes..." delay={1.5} />
                </div>
            </div>
        );
    };

    const RecommendationsScreen = () => (
        <div className="space-y-6">
            <StepHeader title="Recomendaciones Inteligentes" subtitle="La IA detectó oportunidades inmediatas." />

            <div className="space-y-4">
                <RecommendationCard
                    type="opportunity"
                    title="Impulsar el Servicio 'Pack Premium'"
                    desc="Es tu servicio más rentable (+40% margen). Aumenta su visibilidad esta semana."
                />
                <RecommendationCard
                    type="action"
                    title="Activar Remarketing en Instagram"
                    desc="Tus seguidores crecen, pero la conversión de venta está baja (2%)."
                />
            </div>

            <NavButtons next={nextStep} text="Ver Predicciones" color="fuchsia" />
        </div>
    );

    const PredictionsScreen = () => (
        <div className="space-y-6">
            <StepHeader title="Predicciones de Crecimiento" subtitle="Basado en tu ritmo actual." />

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl" />

                <div className="flex items-end justify-between h-40 mb-4 px-2">
                    <div className="w-8 bg-gray-700 h-[30%] rounded-t-lg opacity-50"></div>
                    <div className="w-8 bg-gray-700 h-[45%] rounded-t-lg opacity-70"></div>
                    <div className="w-8 bg-fuchsia-600 h-[60%] rounded-t-lg shadow-[0_0_15px_rgba(217,70,239,0.5)]"></div>
                    <div className="w-8 bg-gray-700 border border-dashed border-gray-500 h-[80%] rounded-t-lg opacity-40"></div>
                    <div className="w-8 bg-gray-700 border border-dashed border-gray-500 h-[95%] rounded-t-lg opacity-40"></div>
                </div>

                <p className="text-center text-lg font-bold text-white">
                    "Si mantienes el ritmo, <span className="text-fuchsia-400">duplicarás clientes en 3 meses</span>."
                </p>
            </div>

            <NavButtons next={nextStep} text="Ver Alertas" color="fuchsia" />
        </div>
    );

    const AlertsScreen = () => (
        <div className="space-y-6">
            <StepHeader title="Alertas Estratégicas" subtitle="Riesgos que debes atender hoy." />

            <div className="space-y-3">
                <AlertItem level="high" text="Tasa de cierre bajó un 5% esta semana." />
                <AlertItem level="medium" text="3 clientes recurrentes no han renovado." />
                <AlertItem level="low" text="El costo por lead subió en Facebook Ads." />
            </div>

            <NavButtons next={nextStep} text="Ver Plan de Crecimiento" color="fuchsia" />
        </div>
    );

    const RoadmapScreen = () => (
        <div className="space-y-6">
            <StepHeader title="Tu Plan de Crecimiento" subtitle="Roadmap generado por IA." />

            <div className="space-y-0 relative border-l-2 border-fuchsia-500/30 ml-4 pl-8 py-2">
                <RoadmapItem month="Mes 1" focus="Autoridad" task="Posicionar marca y contenido." active />
                <RoadmapItem month="Mes 2" focus="Automatización" task="Delegar procesos operativos." />
                <RoadmapItem month="Mes 3" focus="Escalamiento" task="Aumentar inversión publicitaria." />
                <RoadmapItem month="Mes 4" focus="Sistema Total" task="Consolidar infraestructura." />
            </div>

            <NavButtons next={nextStep} text="Activar Agente" color="fuchsia" />
        </div>
    );

    const ConfirmScreen = () => (
        <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-fuchsia-500/20">
                <Lightbulb className="w-10 h-10 text-fuchsia-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">¡Dirección Estratégica Activada!</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-6">
                Tu negocio ahora tiene un "cerebro digital" que monitorea, analiza y propone mejoras 24/7.
            </p>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left space-y-3">
                <SummaryItem text="Análisis de Negocio: ACTIVO" color="fuchsia" />
                <SummaryItem text="Detección de Oportunidades: ACTIVO" color="fuchsia" />
                <SummaryItem text="Predicciones de ROI: ACTIVO" color="fuchsia" />
                <SummaryItem text="Roadmap Dinámico: GENERADO" color="fuchsia" />
            </div>

            <div className="pt-6">
                <button onClick={onComplete} className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black rounded-xl transition-all shadow-lg shadow-fuchsia-600/30 flex items-center justify-center gap-2">
                    <BrainCircuit className="w-5 h-5" /> Ir al Panel Estratégico
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0A12] border border-fuchsia-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative shadow-fuchsia-900/20"
            >
                <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-fuchsia-500 transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }} />
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
                            {step === 2 && <AnalysisScreen />}
                            {step === 3 && <RecommendationsScreen />}
                            {step === 4 && <PredictionsScreen />}
                            {step === 5 && <AlertsScreen />}
                            {step === 6 && <RoadmapScreen />}
                            {step === 7 && <ConfirmScreen />}
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

function NavButtons({ next, text, color = 'fuchsia' }) {
    return (
        <div className="flex justify-end pt-8 border-t border-white/5 mt-8">
            <button
                onClick={next}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg`}
            >
                {text} <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function AnalysisCard({ icon: Icon, label, text, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3"
        >
            <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
                <div className="font-bold text-white text-sm">{label}</div>
                <div className="text-xs text-gray-400">{text}</div>
            </div>
        </motion.div>
    );
}

function RecommendationCard({ type, title, desc }) {
    const isOpp = type === 'opportunity';
    return (
        <div className={`p-4 rounded-xl border flex items-start gap-4 ${isOpp ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${isOpp ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                {isOpp ? <TrendingUp className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            </div>
            <div>
                <div className={`font-bold text-sm mb-1 ${isOpp ? 'text-emerald-400' : 'text-blue-400'}`}>{title}</div>
                <div className="text-xs text-gray-300">{desc}</div>
            </div>
        </div>
    );
}

function AlertItem({ level, text }) {
    const color = level === 'high' ? 'text-red-500' : level === 'medium' ? 'text-orange-500' : 'text-yellow-500';
    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
            <AlertTriangle className={`w-5 h-5 ${color}`} />
            <span className="text-gray-300 text-sm">{text}</span>
        </div>
    );
}

function RoadmapItem({ month, focus, task, active }) {
    return (
        <div className="relative mb-6 last:mb-0">
            <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-4 border-[#0A0A12] ${active ? 'bg-fuchsia-500' : 'bg-gray-700'}`} />
            <div className="font-bold text-fuchsia-400 text-xs uppercase tracking-widest mb-1">{month}</div>
            <div className="font-bold text-white text-lg">{focus}</div>
            <div className="text-gray-400 text-sm">{task}</div>
        </div>
    );
}

function SummaryItem({ text, color = 'fuchsia' }) {
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className={`w-4 h-4 text-fuchsia-500`} />
            <span>{text}</span>
        </div>
    );
}
