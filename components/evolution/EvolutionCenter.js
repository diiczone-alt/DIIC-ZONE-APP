'use client';

import { useState } from 'react';
import {
    Rocket, Users, Zap, BrainCircuit, Building2,
    ArrowRight, CheckCircle, Lock, Calendar, MessageSquare,
    BarChart3, Globe, ShieldCheck, Milestone, MousePointer2,
    Code, Smartphone, Coins, Layers, Layout, Crown
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- DATA: SYSTEMS CONFIGURATION ---
const SYSTEMS_BY_LEVEL = {
    1: {
        title: "Presencia Digital",
        subtitle: "Tu negocio empieza a verse profesional.",
        objectives: ["Que la gente te vea", "Que confíen en ti"],
        systems: [
            {
                id: 's1-1',
                name: "Gestión de Redes Sociales",
                desc: "Centraliza y profesionaliza tus perfiles sociales.",
                benefits: ["Perfil optimizado", "Bio estratégica", "Highlights"],
                tech: ["Instagram", "Facebook", "Design"],
                price: "Incluido",
                status: "installed",
                cta: "Gestionar Redes"
            },
            {
                id: 's1-2',
                name: "Identidad Visual",
                desc: "Kit de marca para transmitir confianza inmediata.",
                benefits: ["Logotipo", "Paleta de Colores", "Tipografía"],
                tech: ["Brand Kit", "PDF"],
                price: "$150",
                status: "installed",
                cta: "Ver Manual de Marca"
            }
        ]
    },
    2: {
        title: "Captación Clientes",
        subtitle: "Ahora tu negocio ya capta clientes intencionalmente.",
        objectives: ["Que lleguen leads", "Que no se pierdan consultas"],
        systems: [
            {
                id: 's2-1',
                name: "Landing Page Inteligente",
                desc: "Sistema que convierte visitas en clientes.",
                benefits: ["Captura datos automáticamente", "Conecta con CRM", "Optimizada para conversión"],
                tech: ["Web", "Formularios", "Tracking"],
                price: "$300 / única",
                status: "available",
                cta: "Instalar Landing"
            },
            {
                id: 's2-2',
                name: "WhatsApp Profesional",
                desc: "Organiza consultas de forma automática.",
                benefits: ["Mensaje de bienvenida", "Respuestas rápidas", "Enlace directo"],
                tech: ["WhatsApp API"],
                price: "$50 / mes",
                status: "available",
                cta: "Configurar WhatsApp"
            }
        ]
    },
    3: {
        title: "Automatización",
        subtitle: "El negocio empieza a funcionar sin depender de ti.",
        objectives: ["Responder 24/7", "Reducir tiempo operativo"],
        systems: [
            {
                id: 's3-1',
                name: "Chatbot Inteligente",
                desc: "Atiende clientes 24/7 como si fueras tú.",
                benefits: ["Conversación natural", "Califica clientes", "Deriva al CRM"],
                tech: ["IA", "WhatsApp", "Web"],
                price: "$120 / mes",
                status: "locked",
                cta: "Activar Bot IA"
            },
            {
                id: 's3-2',
                name: "Asistente de Agendamiento",
                desc: "Sistema que gestiona citas automáticamente.",
                benefits: ["Confirma citas", "Envía recordatorios", "Reduce cancelaciones"],
                tech: ["Calendario", "WhatsApp", "IA"],
                price: "$80 / mes",
                status: "locked",
                cta: "Instalar Agenda"
            }
        ]
    },
    4: {
        title: "Sistema de Ventas",
        subtitle: "Ahora ya no solo recibes clientes... los conviertes.",
        objectives: ["Orden total de clientes", "Saber quién compra", "Saber cuánto vendes"],
        systems: [
            {
                id: 's4-1',
                name: "CRM Automatizado",
                desc: "Organiza tus clientes y tus ventas.",
                benefits: ["Registro automático de leads", "Embudos de ventas", "Seguimiento por etapas"],
                tech: ["CRM Interno", "Automatizaciones"],
                price: "$200 / mes",
                status: "locked",
                cta: "Activar CRM"
            },
            {
                id: 's4-2',
                name: "Sistema de Cotización",
                desc: "Envía cotizaciones sin que tú las escribas.",
                benefits: ["Genera propuestas", "Envía por WhatsApp/Email", "Conecta con Finanzas"],
                tech: ["Finanzas", "PDF Gen"],
                price: "$100 / mes",
                status: "locked",
                cta: "Activar Cotización IA"
            }
        ]
    },
    5: {
        title: "Empresa Automatizada",
        subtitle: "Tu negocio funciona como empresa.",
        objectives: ["Escalabilidad real", "Operación sin caos", "Negocio profesional"],
        systems: [
            {
                id: 's5-1',
                name: "Tienda Online Inteligente",
                desc: "Vende productos y servicios en piloto automático.",
                benefits: ["Catálogo digital", "Pagos procesados", "Entregas coordinadas"],
                tech: ["E-commerce", "Pasarela de Pago"],
                price: "$250 / mes",
                status: "locked",
                cta: "Crear Tienda Online"
            },
            {
                id: 's5-2',
                name: "Ecosistema Total",
                desc: "Integra todo tu negocio en un solo flujo.",
                benefits: ["Marketing & Ventas", "Operaciones & Entrega", "Facturación & Finanzas"],
                tech: ["Full Stack", "API Integration"],
                price: "Consultar",
                status: "locked",
                cta: "Implementación Empresarial"
            }
        ]
    },
    6: {
        title: "Dirección Estratégica",
        subtitle: "El cerebro digital que guía tu crecimiento.",
        objectives: ["Decisiones con datos", "Predicción de tendencias", "Optimización ROI"],
        systems: [
            {
                id: 's6-1',
                name: "Director de Estrategia IA",
                desc: "Analiza tu negocio 24/7 y te dice qué hacer para crecer.",
                benefits: ["Detecta fugas de dinero", "Recomienda acciones", "Predice ventas futuras"],
                tech: ["Big Data", "Predictive AI"],
                price: "$500 / mes",
                status: "locked",
                cta: "Activar Director IA"
            }
        ]
    },
    8: {
        title: "Multiplicación Estratégica",
        subtitle: "Convierte tu marca en un sistema replicable y escalable.",
        objectives: ["Estandarización", "Crecimiento Exponencial", "Modelo de Red"],
        systems: [
            {
                id: 's8-1',
                name: "Core de Multiplicación",
                desc: "Infraestructura para replicar tu modelo de negocio en nuevos mercados.",
                benefits: ["Procesos blindados", "Marca distribuida", "Escalamiento masivo"],
                tech: ["Replication Engine", "Scale AI"],
                price: "Consultar",
                status: "locked",
                cta: "Activar Multiplicación"
            }
        ]
    },
    9: {
        title: "Autonomía Total",
        subtitle: "Tu negocio funciona, vende y crece aunque tú no estés.",
        objectives: ["Libertad de tiempo", "Operación delegada", "Ingresos pasivos"],
        systems: [
            {
                id: 's9-1',
                name: "Sistema de Autonomía",
                desc: "La infraestructura final. Protocolos, equipo y control automático.",
                benefits: ["Ventas automáticas", "Operación sin dueño", "Control por alertas"],
                tech: ["Sovereign AI", "Full Autonomy"],
                price: "Consultar",
                status: "locked",
                cta: "Activar Autonomía"
            }
        ]
    }
};

import ChatbotWizard from './wizards/ChatbotWizard';
import CRMInstallationWizard from './wizards/CRMInstallationWizard';
import AgendaInstallationWizard from './wizards/AgendaInstallationWizard';
import LandingInstallationWizard from './wizards/LandingInstallationWizard';
import QuoteInstallationWizard from './wizards/QuoteInstallationWizard';
import StoreInstallationWizard from './wizards/StoreInstallationWizard';
import EnterpriseInstallationWizard from './wizards/EnterpriseInstallationWizard';
import StrategicAgentWizard from './wizards/StrategicAgentWizard';
import MultiplicationWizard from './wizards/MultiplicationWizard';
import AutonomyWizard from './wizards/AutonomyWizard';

export default function EvolutionCenter() {
    const [activeLevel, setActiveLevel] = useState(2); // Start at Level 2 as per request context
    const [activeWizard, setActiveWizard] = useState(null); // 'chatbot', 'crm', 'agenda', 'landing', 'quote', 'store', 'enterprise', 'strategic', 'multiplication', 'autonomy'

    const currentData = SYSTEMS_BY_LEVEL[activeLevel];

    const handleInstallClick = (systemId) => {
        if (systemId === 's3-1') setActiveWizard('chatbot');
        if (systemId === 's4-1') setActiveWizard('crm');
        if (systemId === 's3-2') setActiveWizard('agenda');
        if (systemId === 's2-1') setActiveWizard('landing');
        if (systemId === 's4-2') setActiveWizard('quote');
        if (systemId === 's5-1') setActiveWizard('store');
        if (systemId === 's5-2') setActiveWizard('enterprise');
        if (systemId === 's6-1') setActiveWizard('strategic');
        if (systemId === 's8-1') setActiveWizard('multiplication');
        if (systemId === 's9-1') setActiveWizard('autonomy');
    };

    const closeWizard = () => setActiveWizard(null);

    return (
        <div className="space-y-8 pb-20 animate-fade-in-up">
            {activeWizard === 'chatbot' && <ChatbotWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'crm' && <CRMInstallationWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'agenda' && <AgendaInstallationWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'landing' && <LandingInstallationWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'quote' && <QuoteInstallationWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'store' && <StoreInstallationWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'enterprise' && <EnterpriseInstallationWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'strategic' && <StrategicAgentWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'multiplication' && <MultiplicationWizard onClose={closeWizard} onComplete={closeWizard} />}
            {activeWizard === 'autonomy' && <AutonomyWizard onClose={closeWizard} onComplete={closeWizard} />}

            {/* 1. HEADER (Asistente) */}
            <div className="bg-gradient-to-r from-[#0A0A12] to-[#151525] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <Rocket className="w-3 h-3" /> Asistente de Evolución
                        </div>
                        <h1 className="text-3xl font-black text-white leading-tight">
                            Hola, <span className="text-emerald-400">Cliente Demo</span> 👋
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            Aquí instalamos los sistemas que hacen que tu negocio venda, organice y crezca automáticamente. Sin depender de ti.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                            <QuickAction icon={BarChart3} label="Quiero más ventas" />
                            <QuickAction icon={Calendar} label="Automatizar citas" />
                            <QuickAction icon={MessageSquare} label="Mejorar atención (Chatbot)" />
                        </div>
                    </div>

                    {/* Visual Mascot/Icon */}
                    <div className="hidden md:flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-3 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <BrainCircuit className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Arquitecto Business</div>
                    </div>
                </div>
            </div>

            {/* 2. NIVEL BAR (Escalabilidad Inteligente) */}
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Escalabilidad Inteligente</h2>
                    <p className="text-gray-400 text-sm">Selecciona un nivel para ver las herramientas que impulsan tu crecimiento.</p>
                </div>

                <div className="grid grid-cols-8 gap-2 md:gap-4 px-2 overflow-x-auto">
                    <LevelBtn level={1} icon={Globe} label="Presencia" active={activeLevel === 1} onClick={() => setActiveLevel(1)} status="active" />
                    <LevelBtn level={2} icon={MousePointer2} label="Captación" active={activeLevel === 2} onClick={() => setActiveLevel(2)} status="pending" />
                    <LevelBtn level={3} icon={Zap} label="Auto" active={activeLevel === 3} onClick={() => setActiveLevel(3)} status="locked" />
                    <LevelBtn level={4} icon={BarChart3} label="Ventas" active={activeLevel === 4} onClick={() => setActiveLevel(4)} status="locked" />
                    <LevelBtn level={5} icon={Building2} label="Empresa" active={activeLevel === 5} onClick={() => setActiveLevel(5)} status="locked" />
                    <LevelBtn level={6} icon={BrainCircuit} label="Estrategia" active={activeLevel === 6} onClick={() => setActiveLevel(6)} status="locked" />
                    <LevelBtn level={8} icon={Rocket} label="Expansión" active={activeLevel === 8} onClick={() => setActiveLevel(8)} status="locked" />
                    <LevelBtn level={9} icon={Crown} label="Autonomía" active={activeLevel === 9} onClick={() => setActiveLevel(9)} status="locked" />
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <motion.div
                key={activeLevel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Left: Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6 h-full relative overflow-hidden">
                        <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-2 text-emerald-500">Nivel {activeLevel}</div>
                        <h2 className="text-3xl font-black text-white mb-4">{currentData.title}</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">{currentData.subtitle}</p>

                        <div className="space-y-4">
                            <h4 className="font-bold text-white flex items-center gap-2 text-sm uppercase">
                                <Milestone className="w-4 h-4 text-emerald-500" /> Objetivos Claros
                            </h4>
                            {currentData.objectives.map((obj, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-400">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500/50" />
                                    <span>{obj}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Detailed Systems Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentData.systems.map((sys) => (
                        <SystemCardDetailed
                            key={sys.id}
                            data={sys}
                            onInstall={() => handleInstallClick(sys.id)}
                        />
                    ))}
                </div>
            </motion.div>

        </div>
    );
}

// --- Sub-components ---

function QuickAction({ icon: Icon, label }) {
    return (
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-xs text-gray-300 hover:text-white font-medium">
            <Icon className="w-3 h-3" /> {label}
        </button>
    );
}

function LevelBtn({ level, icon: Icon, label, active, onClick, status }) {
    const isActive = active;
    const isLocked = status === 'locked';

    let colorClass = "text-gray-500 border-white/5 bg-white/5";
    if (isActive) colorClass = "text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
    else if (!isLocked) colorClass = "text-gray-300 hover:text-white hover:bg-white/10 border-white/10";

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${colorClass}`}
        >
            <div className="text-xs font-black mb-1 opacity-50">NIVEL {level}</div>
            <Icon className={`w-6 h-6 mb-2 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
            <div className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-center">{label}</div>

            {status === 'active' && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            )}
            {isLocked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                    <Lock className="w-5 h-5 text-gray-500" />
                </div>
            )}
        </button>
    );
}

function SystemCardDetailed({ data, onInstall }) {
    const isInstalled = data.status === 'installed';
    const isLocked = data.status === 'locked';
    const isAvailable = data.status === 'available';

    return (
        <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all group ${isInstalled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#0A0A12] border-white/10 hover:border-white/20'}`}>
            <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className={`w-5 h-5 ${isInstalled ? 'text-emerald-400' : 'text-blue-400'}`} />
                        {isAvailable && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold uppercase">Disponible</span>}
                        {isInstalled && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">Instalado</span>}
                        {isLocked && <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">Bloqueado</span>}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {data.name}
                </h3>
                <p className="text-sm text-gray-400 leading-snug mb-6">
                    {data.desc}
                </p>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                    {data.benefits.map((ben, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-500/50 mt-0.5 flex-shrink-0" />
                            <span>{ben}</span>
                        </div>
                    ))}
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {data.tech.map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded text-gray-400 border border-white/5">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500 uppercase font-bold">Inversión</span>
                    <span className="text-sm font-bold text-white">{data.price}</span>
                </div>

                <button
                    disabled={isLocked || isInstalled}
                    onClick={onInstall}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                        ${isInstalled
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                            : isLocked
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10'
                        }`}
                >
                    {isInstalled ? (
                        <>Iniciado <CheckCircle className="w-4 h-4" /></>
                    ) : isLocked ? (
                        <>Bloqueado <Lock className="w-4 h-4" /></>
                    ) : (
                        <>
                            {data.cta} <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
