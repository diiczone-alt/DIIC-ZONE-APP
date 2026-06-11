'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Plus, Edit2, Trash2,
    Check, Zap, Globe, Video,
    Palette, Layers, X, User,
    Building2, MapPin, Briefcase, FileText,
    Shield, Crown, Star,
    ClipboardList, Scissors, MessageCircle, BarChart2,
    Film, ImageIcon, Megaphone, Target, DollarSign, Settings, PieChart,
    Stethoscope, Utensils, Home, GraduationCap, HeartPulse
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import useRealtimeSync from '@/hooks/useRealtimeSync';

const NICHE_DETAILS = {
    general: {
        plans: {
            presence: {
                name: 'NIVEL PRESENCIA',
                narrative: 'Ideal para empezar. Deja de ser invisible. Construimos tu autoridad digital con contenido profesional desde el primer día.',
                features: [
                    'Estrategia de contenido',
                    'Calendario editorial',
                    'Community mgmt',
                    'Reporte mensual de métricas'
                ],
                enfoque: 'Contenido orgánico base',
                filmmaker: 'Filmmaker remoto'
            },
            growth: {
                name: 'NIVEL CRECIMIENTO',
                narrative: 'Ideal para posicionamiento. Creamos el sistema que atrae clientes calificados a tu WhatsApp 24/7.',
                features: [
                    'Estrategia de captación',
                    'Calendario editorial',
                    'Community mgmt',
                    'Monitoreo semanal',
                    'Publicidad pagada básica'
                ],
                enfoque: 'Estrategia de captación',
                filmmaker: 'Filmmaker presencial (1/mes)'
            },
            authority: {
                name: 'NIVEL AUTORIDAD',
                narrative: 'Conviértete en el referente #1. Producción y narrativa de marca para cobrar lo que realmente vales.',
                features: [
                    'Narrativa de marca',
                    'Calendario editorial',
                    'Community mgmt',
                    'Producción de contenido',
                    'Embudo de ventas',
                    'Gestión de Ads profesional'
                ],
                enfoque: 'Narrativa de marca',
                filmmaker: 'Filmmaker presencial (2/mes)'
            },
            elite: {
                name: 'NIVEL CONTROL',
                narrative: 'Dominio total del mercado y viralidad agresiva con producción completa.',
                features: [
                    'Estrategia B2B / High-ticket',
                    'Calendario editorial',
                    'Community mgmt',
                    'Producción de contenido',
                    'Sistemas automatizados',
                    'Full Ads + Retargeting'
                ],
                enfoque: 'Estrategia B2B',
                filmmaker: 'Filmmaker ilimitado o dedicado'
            }
        }
    },
    medical: {
        plans: {
            presence: {
                name: 'PRESENCIA MÉDICA',
                price: '250',
                originalPrice: '300',
                narrative: 'Promo Activa: Impulsa tu imagen profesional. Ecosistema digital clínico con gestión de redes y fotografía en consultorio.',
                features: [
                    'Gestión de Redes (Creación y optimización de perfiles)',
                    'Diseño de posts y stories base (Grid Estético)',
                    'Estrategia mensual + copywriting especializado',
                    'Fotografía Profesional (Médico, equipo e instalaciones)',
                    'Contrato mínimo de 3 meses (Campaña)'
                ],
                enfoque: 'Confianza y Bio base',
                filmmaker: 'Filmmaker en consultorio (1 Sesión / Mes)'
            },
            growth: {
                name: 'CRECIMIENTO MÉDICO',
                price: '500',
                narrative: 'Atrae pacientes de forma constante con pauta publicitaria segmentada y videos explicativos del especialista.',
                features: [
                    'Todo lo de Presencia Médica',
                    'Producción Audiovisual (Videos informativos y tips médicos)',
                    'Grabación de procedimientos y resultados',
                    'Campañas Meta Ads (Captación de pacientes)',
                    'Automatización y Configuración básica'
                ],
                enfoque: 'Funnels de Citas Médicas',
                filmmaker: 'Filmmaker en consultorio (1.5h / Mes)'
            },
            authority: {
                name: 'AUTORIDAD ESPECIALISTA',
                price: '700',
                narrative: 'Conviértete en el referente de tu especialidad. Grabaciones detalladas y testimonios para captar casos de alta complejidad.',
                features: [
                    'Todo lo de Crecimiento Médico',
                    'Videos testimoniales de pacientes',
                    'Grabaciones y fotos en quirófanos y cirugías',
                    'Ebook de Salud (Lead Magnet)',
                    'Campañas Google Ads de Alta Intención'
                ],
                enfoque: 'Posicionamiento del Especialista',
                filmmaker: 'Filmmaker en consultorio y quirófano (2/mes)'
            },
            elite: {
                name: 'MONOPOLIO CLÍNICO',
                price: '999',
                narrative: 'Dominio total para clínicas. Automatización integral de citas, triaje inteligente en WhatsApp y escala nacional.',
                features: [
                    'Todo lo de Autoridad Especialista',
                    'Funnels avanzados de agendamiento y recordatorios',
                    'Producción de minidocumentales clínicos',
                    'Triaje IA en WhatsApp para filtrar pacientes',
                    'Dashboard analítico de costo por paciente (CPA)'
                ],
                enfoque: 'Escala e Integración Clínica',
                filmmaker: 'Filmmaker dedicado (Sesiones ilimitadas)'
            }
        }
    },
    hospital: {
        plans: {
            presence: {
                name: 'SISTEMA PRESENCIA',
                price: '300',
                narrative: 'Cimiento de confianza institucional. Identidad digital del hospital, directorio de especialidades y atención al paciente base.',
                features: [
                    'Estructuración del Directorio Médico digital',
                    'Gestión reputacional e institucional de la clínica/hospital',
                    'Diseño estético y uniforme para todas las áreas',
                    'Fotografía profesional de instalaciones y quirófanos',
                    'Campañas de branding local y emergencias'
                ],
                enfoque: 'Reputación & Directorio Médico',
                filmmaker: 'Filmmaker en hospital (1 Sesión/Mes)'
            },
            growth: {
                name: 'SISTEMA DE CAPTACIÓN',
                price: '500',
                narrative: 'Sistema activo de captación de pacientes. Funnels dedicados a las especialidades más rentables del hospital.',
                features: [
                    'Todo lo de Sistema Presencia',
                    'Funnels de captación para Especialidades Clave',
                    'Producción de videos explicativos con el staff de médicos',
                    'Campañas Meta & Google Ads para agendas médicas',
                    'Sistema de pre-calificación de pacientes en WhatsApp'
                ],
                enfoque: 'Captación de Especialidades',
                filmmaker: 'Filmmaker en hospital (1.5h/Mes)'
            },
            authority: {
                name: 'SISTEMA DE AUTORIDAD',
                price: '700',
                narrative: 'Posiciona al hospital como el centro médico referente. Cobertura de cirugías complejas y testimonios reales de alto impacto.',
                features: [
                    'Todo lo de Sistema de Captación',
                    'Cobertura audiovisual premium de cirugías y tecnología médica',
                    'Videos de testimonios y casos de éxito de pacientes',
                    'Google Ads avanzado (Búsqueda activa de cirugías de alta gama)',
                    'Estrategia de relaciones públicas digitales e hitos clínicos'
                ],
                enfoque: 'Tecnología y Casos Complejos',
                filmmaker: 'Filmmaker en quirófanos y hospital (2/mes)'
            },
            elite: {
                name: 'SISTEMA MONOPOLIO',
                price: '999',
                narrative: 'El sistema definitivo de marketing hospitalario. Triaje automatizado con Inteligencia Artificial, telemedicina y automatización total.',
                features: [
                    'Todo lo de Sistema de Autoridad',
                    'Triaje y agendamiento IA en WhatsApp integrado al software médico',
                    'Funnels de fidelización de pacientes post-consulta',
                    'Producción de minidocumentales institucionales y branding masivo',
                    'Dashboard unificado de derivación de pacientes y coste de adquisición (CAC)'
                ],
                enfoque: 'Automatización & Escala Hospitalaria',
                filmmaker: 'Filmmaker dedicado (Sesiones ilimitadas)'
            }
        }
    },
    educativo: {
        plans: {
            presence: {
                name: 'PRESENCIA EDUCATIVA',
                price: '300',
                narrative: 'Establece tu autoridad docente. Grid estético y contenido educativo estructurado para vender tus conocimientos.',
                features: [
                    'Gestión y optimización de perfiles académicos',
                    'Diseño de carruseles educativos explicativos',
                    'Estrategia de marca personal para instructores',
                    'Fotografía profesional en aula o estudio',
                    '1 Video Corto Educativo (Reel/TikTok)'
                ],
                enfoque: 'Posicionamiento como Tutor/Experto',
                filmmaker: 'Filmmaker en aula/estudio (1 Sesión/Mes)'
            },
            growth: {
                name: 'CRECIMIENTO ACADÉMICO',
                price: '500',
                narrative: 'Lanza tus cursos y capacitaciones. Campañas de conversión para captar alumnos reales.',
                features: [
                    'Todo lo de Presencia Educativa',
                    'Producción de videos explicativos y micro-lecciones',
                    'Campañas de Meta Ads orientadas a inscripciones',
                    'Configuración de enlaces a Hotmart/Teachable o web',
                    'Automatización de respuestas con temarios en WhatsApp'
                ],
                enfoque: 'Conversión de Estudiantes',
                filmmaker: 'Filmmaker en local (1.5h/Mes)'
            },
            authority: {
                name: 'AUTORIDAD DOCENTE',
                price: '700',
                narrative: 'Estrategia completa de lanzamientos para seminarios y programas de certificación.',
                features: [
                    'Todo lo de Crecimiento Académico',
                    'Embudo de webinars en vivo y masterclasses',
                    'Videos testimoniales de alumnos graduados',
                    'Campañas de remarketing y captación high-ticket',
                    'Producción de intro de cursos con estética cinematográfica'
                ],
                enfoque: 'Lanzamientos y Webinars',
                filmmaker: 'Filmmaker en estudio/aula (2 Sesiones/Mes)'
            },
            elite: {
                name: 'IMPERIO EDUCATIVO',
                price: '999',
                narrative: 'Dominio y escala para institutos o academias consolidadas. Plataforma propia y automatizaciones avanzadas.',
                features: [
                    'Todo lo de Autoridad Docente',
                    'Funnels automatizados de evergreen (ventas 24/7)',
                    'Producción de minidocumentales del instituto',
                    'Integración CRM para seguimiento de leads estudiantiles',
                    'Soporte y diseño de material de apoyo en PDF para alumnos'
                ],
                enfoque: 'Escala e Integración Académica',
                filmmaker: 'Filmmaker dedicado (Sesiones ilimitadas)'
            }
        }
    },
    hospitality: {
        plans: {
            presence: {
                name: 'PRESENCIA FOODIE',
                narrative: 'Muestra tu menú y el alma de tu cocina. Garantizamos antojo visual desde la primera publicación.',
                features: [
                    'Fotografía y diseño del menú',
                    'Configuración de Google Maps / TripAdvisor',
                    'Historias diarias de ambiente e insumos',
                    'Respuestas rápidas de horarios y carta'
                ],
                enfoque: 'Estética Visual y Menú',
                filmmaker: 'Filmmaker en local (1/mes)'
            },
            growth: {
                name: 'CRECIMIENTO DE MESAS',
                narrative: 'Llena tu restaurante durante los días lentos y potencia las reservas del fin de semana.',
                features: [
                    'Pauta segmentada a 5km a la redonda',
                    'Campañas específicas de fin de semana',
                    'Reels de preparación (Food Porn) e ingredientes',
                    'Automatización de link de reservas'
                ],
                enfoque: 'Tráfico al Local y Delivery',
                filmmaker: 'Filmmaker en local (1.5h/mes)'
            },
            authority: {
                name: 'AUTORIDAD GASTRONÓMICA',
                narrative: 'Posiciona a tu Chef o marca como una parada obligatoria en la ciudad. Experiencia y reputación Premium.',
                features: [
                    'Videos de experiencia del cliente e historia',
                    'Estrategia con micro-influencers locales',
                    'Campañas de conversión para eventos privados',
                    'Gestión reputacional de Google/TripAdvisor'
                ],
                enfoque: 'Branding de Experiencia',
                filmmaker: 'Filmmaker en local (2/mes)'
            },
            elite: {
                name: 'IMPERIO CULINARIO',
                narrative: 'Para franquicias o múltiples sucursales. Estrategia omnicanal de captación de comensales y franquiciados.',
                features: [
                    'Campañas multilocación con presupuestos divididos',
                    'Fórmula de viralidad para lanzamientos de platos',
                    'Funnels para captación de franquicias',
                    'Automatizaciones CRM para fidelización y cumpleaños'
                ],
                enfoque: 'Fidelización y Multilocación',
                filmmaker: 'Filmmaker dedicado (Sesiones Pro)'
            }
        }
    },
    realestate: {
        plans: {
            presence: {
                name: 'PRESENCIA INMOBILIARIA',
                narrative: 'Destaca tus propiedades en cartera con una estética moderna. Confianza y profesionalismo visual.',
                features: [
                    'Grid profesional de propiedades destacadas',
                    'Plantillas premium para fichas técnicas',
                    'Optimización de perfil de Realtor experto',
                    'Respuestas pregrabadas de listings'
                ],
                enfoque: 'Catálogo de Propiedades',
                filmmaker: 'Filmmaker de propiedades (1/mes)'
            },
            growth: {
                name: 'CAPTACIÓN DE PROPIETARIOS',
                narrative: 'Atrae leads de personas que buscan vender o comprar propiedades en tu zona de enfoque.',
                features: [
                    'Anuncios segmentados por zonas de interés',
                    'Embudos de captación de propietarios exclusivos',
                    'Videos tipo "House Tour" dinámicos',
                    'Filtro automático de presupuesto del cliente'
                ],
                enfoque: 'Generación de Leads Inmobiliarios',
                filmmaker: 'Filmmaker de propiedades (1.5h/mes)'
            },
            authority: {
                name: 'AUTORIDAD INMOBILIARIA',
                narrative: 'Conviértete en el referente de Bienes Raíces de tu ciudad. Cinematic tours de propiedades de alta gama.',
                features: [
                    'Cinematic House Tours detallados',
                    'Estrategia de marca personal del Broker/Realtor',
                    'Campañas para inversionistas nacionales/extranjeros',
                    'Digital Portfolio Premium'
                ],
                enfoque: 'Posicionamiento High-ticket',
                filmmaker: 'Filmmaker de propiedades (2/mes)'
            },
            elite: {
                name: 'DESARROLLO & ESCALA',
                narrative: 'Estrategia integral para constructoras, desarrolladoras o agencias inmobiliarias consolidadas.',
                features: [
                    'Embudos para proyectos de planos (Pre-venta)',
                    'Producción de renders animados y documentales del proyecto',
                    'Publicidad internacional para inversionistas',
                    'Automatización de agendamiento de visitas guiadas'
                ],
                enfoque: 'Pre-ventas y Proyectos Grandes',
                filmmaker: 'Filmmaker dedicado (Sesiones Pro)'
            }
        }
    }
};

export default function HQServicesPage() {
    const [services, setServices] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [wizardStep, setWizardStep] = useState(1); // 1: Cards, 2: Profile, 3: Agreement
    const [clientProfile, setClientProfile] = useState({
        name: '',
        company: '',
        location: '',
        businessType: ''
    });
    const [activeCategory, setActiveCategory] = useState('plan'); // 'plan' or 'pack'
    const [selectedNiche, setSelectedNiche] = useState('general');

    const loadData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [servRes, autoRes, ratesRes] = await Promise.all([
                supabase.from('services').select('*').order('price', { ascending: true }),
                supabase.from('automations').select('*'),
                supabase.from('production_rates').select('*').order('name', { ascending: true })
            ]);
            setServices(servRes.data || []);
            setAutomations(autoRes.data || []);
            setRates(ratesRes.data || []);
        } catch (err) {
            console.error("Error loading services:", err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useRealtimeSync(['services', 'automations', 'production_rates'], () => loadData(true));

    const toggleExtra = (extraId) => {
        setSelectedExtras(prev => 
            prev.includes(extraId) 
                ? prev.filter(id => id !== extraId) 
                : [...prev, extraId]
        );
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        const nicheNames = {
            general: 'General / Comercial',
            medical: 'Salud / Médico',
            hospital: 'Sistema de Marketing / Hospitales',
            educativo: 'Capacitaciones / Cursos',
            hospitality: 'Gastronomía / Restaurantes',
            realestate: 'Bienes Raíces / Inmobiliaria'
        };
        setClientProfile(prev => ({
            ...prev,
            businessType: nicheNames[selectedNiche] || 'General'
        }));
        setWizardStep(2);
    };

    const closeWizard = () => {
        setSelectedPlan(null);
        setWizardStep(1);
        setClientProfile({ name: '', company: '', location: '', businessType: '' });
    };

    return (
        <div className="p-8 space-y-12 relative min-h-screen bg-[#050511]">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">DIIC <span className="text-indigo-500">MONETIZACIÓN</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">God Mode Dashboard v5.0 — Estrategia de Precios 2026</p>
                </div>
            </div>

            {/* Niche Selector - Premium Custom Branding */}
            <div className="flex justify-center -mb-4">
                <div className="bg-[#0E0E18]/60 backdrop-blur-xl p-2 rounded-[2rem] flex flex-wrap gap-2 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                    {[
                        { id: 'general', label: 'Estrategia General', icon: Briefcase },
                        { id: 'medical', label: 'Marketing Médico', icon: Stethoscope },
                        { id: 'hospital', label: 'Sistema de Hospitales', icon: HeartPulse },
                        { id: 'educativo', label: 'Capacitaciones / Cursos', icon: GraduationCap },
                        { id: 'hospitality', label: 'Marketing para Restaurantes', icon: Utensils },
                        { id: 'realestate', label: 'Marketing Inmobiliario', icon: Home }
                    ].map((niche) => {
                        const Icon = niche.icon;
                        const isActive = selectedNiche === niche.id;
                        return (
                            <button
                                key={niche.id}
                                onClick={() => setSelectedNiche(niche.id)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border ${
                                    isActive
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105'
                                        : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {niche.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Category Switcher */}
            <div className="flex justify-center">
                <div className="bg-white/5 p-1.5 rounded-3xl flex gap-1 border border-white/5">
                    <button 
                        onClick={() => setActiveCategory('plan')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'plan' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        Niveles Mensuales
                    </button>
                    <button 
                        onClick={() => setActiveCategory('pack')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'pack' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}
                    >
                         Paquetes Especiales
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-20 text-indigo-500 font-black animate-pulse uppercase tracking-[0.5em]">
                    Sincronizando Catálogo...
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 relative z-10">
                    {services
                        .filter(s => s.category === activeCategory)
                        .map((service, index) => {
                            const nichePlan = NICHE_DETAILS[selectedNiche]?.plans[service.id];
                            const customizedService = nichePlan ? {
                                ...service,
                                name: nichePlan.name,
                                narrative: nichePlan.narrative,
                                price: nichePlan.price || service.price,
                                originalPrice: nichePlan.originalPrice || null,
                                features: nichePlan.features || service.features,
                                enfoque: nichePlan.enfoque || service.enfoque,
                                filmmaker: nichePlan.filmmaker || service.filmmaker
                            } : service;

                            return activeCategory === 'plan' ? (
                                <PricingCard
                                    key={service.id}
                                    service={customizedService}
                                    index={index}
                                    onSelect={() => handleSelectPlan(customizedService)}
                                />
                            ) : (
                                <PackCard 
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    onSelect={() => handleSelectPlan(service)}
                                />
                            );
                        })
                    }
                </div>
            )}
            
            {/* New Sections */}
            <ServiceDetails />
            {selectedNiche === 'medical' && <MedicalRoadmap />}
            <PaidAdvertising />

            {/* Individual Services Catalog - Point 3 of User Request */}
            <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] whitespace-nowrap">Catálogo Individual (Venta por Unidad)</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* PRODUCTION CATEGORY */}
                    <CategoryCard 
                        title="🎬 Producción" 
                        items={rates.filter(r => r.id.includes('vid') || r.id.includes('reel') || r.id.includes('podcast'))} 
                        color="indigo"
                    />
                    {/* DESIGN CATEGORY */}
                    <CategoryCard 
                        title="🎨 Diseño" 
                        items={rates.filter(r => r.id.includes('post') || r.id.includes('carousel') || r.id.includes('portada'))} 
                        color="emerald"
                    />
                    {/* STRATEGY & SCALE */}
                    <CategoryCard 
                        title="🧠 Estrategia & Fotografía" 
                        items={rates.filter(r => r.id.includes('strategy') || r.id.includes('photo') || r.id.includes('auto'))} 
                        color="orange"
                    />
                </div>
            </div>

            {/* Advanced Levels - Automations & Scale */}
            <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] whitespace-nowrap">Niveles Avanzados (Opcional)</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {automations.map((extra) => (
                        <motion.div
                            key={extra.id}
                            whileHover={{ y: -5 }}
                            onClick={() => toggleExtra(extra.id)}
                            className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex items-center justify-between ${
                                selectedExtras.includes(extra.id) 
                                    ? 'bg-orange-500/10 border-orange-500 shadow-[0_20px_40px_rgba(249,115,22,0.1)]' 
                                    : 'bg-[#0E0E18] border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl transition-all ${
                                    selectedExtras.includes(extra.id) ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-gray-500 group-hover:text-white'
                                }`}>
                                    {extra.id === 'systems' ? <Layers className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider mb-1">{extra.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{extra.price}</p>
                                </div>
                            </div>
                            
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedExtras.includes(extra.id) ? 'bg-orange-500 border-orange-500 text-black' : 'border-white/10 text-transparent'
                            }`}>
                                <Check className="w-4 h-4 font-black" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Rules of Business & Key Phrase - Point 5 & Clave of User Request */}
            <div className="pt-20 pb-10 space-y-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Reglas de Negocio ZONA CREATIVA</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                'Nunca vender por debajo de estos precios',
                                'Los extras siempre se facturan por separado',
                                'No aumentar entregables sin reajustar el precio'
                            ].map((rule, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.6em] mb-4">Filosofía de Rentabilidad</p>
                        <h2 className="text-3xl font-black text-white italic leading-tight tracking-tighter uppercase">
                            “Cada servicio tiene <span className="text-indigo-500">margen</span>, <br />
                            cada nivel tiene <span className="text-indigo-500">utilidad</span>.”
                        </h2>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-gray-700 uppercase tracking-[0.5em]">
                    <span>DIIC ZONE OS © 2026</span>
                    <span>Nivel Empresa Seria v1.0.4</span>
                    <span>Sincronizado Localmente</span>
                </div>
            </div>

            {/* Wizard Modal */}
            <AnimatePresence>
                {wizardStep > 1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeWizard}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0E0E18] border border-white/10 rounded-[3rem] shadow-[0_100px_200px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                                        <Zap className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                                        {wizardStep === 2 ? 'Perfil Estratégico' : 'Acuerdo de Producción'}
                                    </h2>
                                </div>
                                <button onClick={closeWizard} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {wizardStep === 2 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Titular del Acuerdo</label>
                                                <div className="relative">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre y Apellido"
                                                        value={clientProfile.name}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Compañía / Marca</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ej. Nova Clínica"
                                                        value={clientProfile.company}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, company: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Territorio de Aplicación</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ciudad, País"
                                                        value={clientProfile.location}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, location: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Vertical de Negocio</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ej. Medicina / Real Estate"
                                                        value={clientProfile.businessType}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, businessType: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {wizardStep === 3 && (
                                    <div className="space-y-8">
                                        <div className="bg-indigo-600 rounded-3xl p-10 space-y-8 shadow-2xl shadow-indigo-500/20">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Entidad DIIC Strategist</p>
                                                    <h3 className="text-2xl font-black text-white italic">{selectedPlan.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Compromiso Mensual</p>
                                                    <p className="text-4xl font-black text-white">${selectedPlan.price}</p>
                                                </div>
                                            </div>

                                            <div className="h-px bg-white/10 w-full" />

                                            <div className="grid grid-cols-2 gap-8 text-white">
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Titular Confirmado</p>
                                                    <p className="text-lg font-black">{clientProfile.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Corporativo</p>
                                                    <p className="text-lg font-black">{clientProfile.company}</p>
                                                </div>
                                            </div>

                                            {selectedExtras.length > 0 && (
                                                <div className="pt-6 border-t border-white/10 space-y-4">
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Adicionales Seleccionados</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {selectedExtras.map(id => {
                                                            const extra = automations.find(a => a.id === id);
                                                            return (
                                                                <div key={id} className="px-5 py-2 bg-black/40 border border-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                                                                    + {extra.name} (A Cotizar)
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 px-2">
                                                <FileText className="w-5 h-5 text-indigo-400" />
                                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Cláusulas de Producción</h4>
                                            </div>
                                            <div className="bg-black/40 border border-white/5 rounded-[2rem] p-10 text-xs text-gray-500 leading-loose font-medium italic">
                                                <p className="mb-6 text-white not-italic font-black text-sm uppercase tracking-widest">Base del Acuerdo:</p>
                                                "Este acuerdo establece la activación inmediata del {selectedPlan?.category === 'pack' ? 'paquete' : 'nivel'} seleccionado ({selectedPlan?.name}), detallando la producción conforme a los niveles estratégicos de ZONA CREATIVA."
                                                <div className="mt-8 h-px bg-white/5 mb-8" />
                                                <p>
                                                    DIIC ZONE garantiza la entrega de las piezas descritas manteniendo los estándares de calidad cinemática.
                                                    El cliente asegura el acceso a locaciones y personal clave para las sesiones de rodaje programadas.
                                                </p>
                                                <div className="mt-12 flex justify-between">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-40 h-px bg-gray-800" />
                                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 pl-2">DIIC ZONE</span>
                                                    </div>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-40 h-px bg-gray-800" />
                                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 pl-2">EL CLIENTE</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-10 border-t border-white/5 bg-white/[0.02] flex gap-4">
                                {wizardStep === 2 ? (
                                    <button
                                        onClick={() => setWizardStep(3)}
                                        disabled={!clientProfile.name || !clientProfile.company}
                                        className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-[0.3em]"
                                    >
                                        Generar Acuerdo
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setWizardStep(2)}
                                            className="px-10 py-6 bg-white/5 hover:bg-white/10 text-gray-500 font-black rounded-2xl transition-all uppercase text-xs tracking-widest"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            onClick={() => {
                                                alert('Acuerdo DIIC Emitido con Éxito. Iniciando Despliegue Estratégico.');
                                                closeWizard();
                                            }}
                                            className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                                        >
                                            <Check className="w-6 h-6" /> Confirmar Cierre
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PricingCard({ service, index, onSelect }) {
    const isPopular = service.level === 'NIVEL CLAVE';
    const icons = [Shield, Zap, Crown, Star];
    const Icon = icons[index] || Zap;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-10 rounded-[3rem] border flex flex-col h-full relative overflow-hidden group transition-all duration-500 ${isPopular ? 'bg-indigo-600 border-indigo-400 shadow-[0_40px_80px_rgba(99,102,241,0.2)]' : 'bg-[#0E0E18] border-white/5 hover:border-white/10'
                }`}
        >
            {isPopular && (
                <div className="absolute top-8 right-8 bg-white/20 text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                    NIVEL CLAVE 🌟
                </div>
            )}

            {/* Header: Icon & Name */}
            <div className="flex items-start gap-5 mb-10">
                <div className={`p-4 rounded-3xl ${isPopular ? 'bg-white/20' : 'bg-white/5 text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity'}`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white italic leading-tight mb-1">{service.name}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isPopular ? 'text-white/50' : 'text-gray-600'}`}>{service.level}</p>
                </div>
            </div>

            {/* Price Main */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2 flex-wrap">
                    {service.originalPrice && (
                        <span className="text-xl font-bold text-gray-500 line-through mr-2">${service.originalPrice}</span>
                    )}
                    <span className="text-6xl font-black text-white tracking-tighter">${service.price}</span>
                    <span className={`text-[10px] font-bold ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>/MES</span>
                </div>
                <p className={`text-[10px] font-medium mt-2 italic ${isPopular ? 'text-white/70' : 'text-gray-500'}`}>{service.narrative}</p>
            </div>

            {/* Deliverables Grid */}
            <div className="grid grid-cols-2 gap-2 mb-8">
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border ${isPopular ? 'bg-black/20 border-black/10' : 'bg-white/5 border-white/5'}`}>
                    <span className="text-3xl font-black text-white mb-1">{service.deliverables?.videos || 0}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPopular ? 'text-white/60' : 'text-gray-500'}`}>Videos</span>
                </div>
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border ${isPopular ? 'bg-black/20 border-black/10' : 'bg-white/5 border-white/5'}`}>
                    <span className="text-3xl font-black text-white mb-1">{service.deliverables?.posts || 0}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPopular ? 'text-white/60' : 'text-gray-500'}`}>Posts</span>
                </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8 flex-1">
                {service.features?.map((feature, i) => (
                    <div key={i} className={`flex items-center gap-3 text-xs font-medium ${isPopular ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'} transition-colors`}>
                        <Check className={`w-4 h-4 ${isPopular ? 'text-white' : 'text-gray-600'}`} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            {/* Pauta / Enfoque */}
            <div className={`p-4 rounded-2xl border text-center mb-10 ${isPopular ? 'bg-black/30 border-black/20' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className={`text-xs font-black ${isPopular ? 'text-emerald-300' : 'text-emerald-400'}`}>{service.enfoque}</p>
                </div>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${isPopular ? 'text-white/50' : 'text-gray-600'}`}>{service.filmmaker}</p>
            </div>

            {/* Action CTA */}
            <button
                onClick={onSelect}
                className={`w-full py-6 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] transition-all ${isPopular ? 'bg-white text-black hover:bg-gray-100 shadow-2xl' : 'bg-black border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500 shadow-xl'
                    }`}
            >
                Seleccionar nivel
            </button>
        </motion.div>
    );
}

function PackCard({ service, index, onSelect }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-10 rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 flex flex-col h-full relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500"
        >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 blur-[50px] group-hover:bg-indigo-500/20 transition-all" />
            
            {/* Type Badge */}
            <div className="mb-8 items-center flex gap-3">
                <div className="p-3 bg-white/5 rounded-2xl text-indigo-400">
                    {service.id.includes('design') ? <Palette className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </div>
                <div>
                    <h3 className="text-lg font-black text-white italic tracking-tight">{service.name}</h3>
                    <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{service.enfoque}</p>
                </div>
            </div>

            {/* Price section */}
            <div className="mb-10">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Inversión Pack</p>
                <div className="flex items-center gap-3">
                    <span className="text-5xl font-black text-white tracking-tighter">${service.price}</span>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <span className="text-[8px] font-black text-emerald-400 tracking-[0.2em] uppercase">Pack Ahorro</span>
                    </div>
                </div>
            </div>

            {/* Deliverables List (Pill style) */}
            <div className="space-y-3 mb-12 flex-1">
                {service.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                        <Check className="w-4 h-4 text-indigo-500" />
                        <span className="uppercase tracking-widest">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onSelect}
                className="w-full py-5 rounded-2xl bg-white/5 hover:bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest transition-all border border-white/5 hover:border-indigo-500 shadow-xl"
            >
                Adquirir este Pack
            </button>
        </motion.div>
    );
}

function DeliverableItem({ label, value, isPopular }) {
    const isString = typeof value === 'string' && value.length > 2;

    return (
        <div className="text-center">
            <p className={`${isString ? 'text-xl' : 'text-3xl'} font-black text-white mb-1 uppercase tracking-tighter`}>{value}</p>
            <p className={`text-[8px] font-black uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>{label}</p>
        </div>
    );
}

function CategoryCard({ title, items, color }) {
    const colorClasses = {
        indigo: 'text-indigo-400 bg-indigo-500/10',
        emerald: 'text-emerald-400 bg-emerald-500/10',
        orange: 'text-orange-400 bg-orange-500/10'
    };

    return (
        <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[2rem] space-y-6">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-xl inline-block ${colorClasses[color] || colorClasses.indigo}`}>
                {title}
            </h3>
            <div className="space-y-4">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                        <span className="text-gray-400 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">{item.name}</span>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-600 font-black line-through opacity-0 group-hover:opacity-100 transition-opacity">
                                ${(item.price_sale * 1.2).toFixed(0)}
                             </span>
                             <span className="text-white font-black text-sm tracking-tighter">${item.price_sale}</span>
                        </div>
                    </div>
                )) : (
                    <p className="text-[10px] text-gray-700 italic">Cargando catálogo...</p>
                )}
            </div>
        </div>
    );
}

function ServiceDetails() {
    const details = [
        { icon: ClipboardList, title: "Estrategia & Calendario", desc: "Plan mensual de contenido con temas, fechas y objetivos claros por plataforma." },
        { icon: Film, title: "Producción filmmaker", desc: "Sesión profesional de filmación para crear contenido de calidad cinematográfica." },
        { icon: Scissors, title: "Edición de video", desc: "Reels y videos editados con subtítulos, música, efectos y branding de tu marca." },
        { icon: ImageIcon, title: "Diseño gráfico", desc: "Posts, carruseles, stories e infografías con identidad visual consistente." },
        { icon: MessageCircle, title: "Community management", desc: "Respuesta a comentarios y mensajes. Construcción activa de tu comunidad." },
        { icon: Megaphone, title: "Gestión de pauta", desc: "Creamos y optimizamos tus anuncios. El presupuesto lo pones tú a la plataforma." },
        { icon: BarChart2, title: "Reporte mensual", desc: "Informe con alcance, clics, leads y recomendaciones para el siguiente mes." },
        { icon: Target, title: "Estrategia de conversión", desc: "Cada pieza de contenido diseñada para atraer clientes reales a tu negocio." }
    ];

    return (
        <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] whitespace-nowrap">Detalle de Servicios</h2>
                <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <div className="mb-6">
                <h3 className="text-3xl font-black text-white tracking-tighter">Todo lo que incluye tu nivel mensual</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.map((item, i) => (
                    <div key={i} className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex gap-6 items-start hover:bg-white/[0.02] transition-colors">
                        <div className="p-4 bg-white/5 rounded-xl text-indigo-400">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white mb-2">{item.title}</h4>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PaidAdvertising() {
    return (
        <div className="space-y-12 relative z-10 pt-10">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] whitespace-nowrap">Publicidad Pagada</h2>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="mb-8">
                <h3 className="text-3xl font-black text-white tracking-tighter">¿Cómo funciona la pauta publicitaria?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0E0E18] border border-indigo-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">01</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-yellow-500 mb-6 mt-4">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Tú pones el presupuesto</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">El cliente transfiere directamente a Facebook, Instagram, TikTok o YouTube. Ese dinero nunca pasa por nosotros — es 100% tuyo y de la plataforma.</p>
                </div>
                
                <div className="bg-[#0E0E18] border border-purple-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-black text-purple-400">02</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-purple-400 mb-6 mt-4">
                        <Settings className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Nosotros lo gestionamos</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Creamos los anuncios, diseñamos las creatividades, segmentamos la audiencia correcta y optimizamos semana a semana para maximizar resultados.</p>
                </div>

                <div className="bg-[#0E0E18] border border-emerald-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400">03</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-emerald-400 mb-6 mt-4">
                        <PieChart className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Recibes el reporte</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Cada mes te enviamos un informe detallado: cuántas personas vieron tus anuncios, cuántos clicaron, cuántos contactaron y cuánto invertiste vs. retorno.</p>
                </div>
            </div>

            <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                    La gestión de pauta está <strong className="font-black uppercase tracking-widest text-emerald-400">INCLUIDA</strong> en tu nivel. Solo necesitas poner tu presupuesto de anuncios. Si superas el límite del nivel, aplicamos un pequeño porcentaje adicional.
                </p>
            </div>

            <div className="pt-12">
                <div className="mb-10">
                    <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-2">Inversión en Pauta</h2>
                    <h3 className="text-3xl font-black text-white tracking-tighter">Presupuesto recomendado y distribución por nivel</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Presencia */}
                    <div className="bg-[#0E0E18] border-t-4 border-blue-500 p-6 rounded-b-2xl border-x border-b border-white/5">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-6">NIVEL PRESENCIA</h4>
                        <div className="text-center mb-6">
                            <span className="text-3xl font-black text-white tracking-tighter">$200-$300</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $200</p>
                        </div>
                        <div className="text-center mb-8">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+15% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$30-$45/mes</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>60%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[60%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>10%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[10%]"></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Crecimiento */}
                    <div className="bg-[#0E0E18] border-t-4 border-purple-500 p-6 rounded-b-2xl border-x border-b border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500/20 to-transparent opacity-50 pointer-events-none rounded-b-2xl"></div>
                        <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] text-center mb-6 relative z-10">NIVEL CRECIMIENTO</h4>
                        <div className="text-center mb-6 relative z-10">
                            <span className="text-3xl font-black text-white tracking-tighter">$300-$600</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4 relative z-10">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $500</p>
                        </div>
                        <div className="text-center mb-8 relative z-10">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+15% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$45-$90/mes</p>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>50%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[50%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>20%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[20%]"></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Autoridad */}
                    <div className="bg-[#0E0E18] border-t-4 border-cyan-500 p-6 rounded-b-2xl border-x border-b border-white/5">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-6">NIVEL AUTORIDAD</h4>
                        <div className="text-center mb-6">
                            <span className="text-3xl font-black text-white tracking-tighter">$500-$1,000</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $1,000</p>
                        </div>
                        <div className="text-center mb-8">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+12% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$60-$120/mes</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>40%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full w-[40%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[30%]"></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Control (Elite) */}
                    <div className="bg-[#0E0E18] border-t-4 border-yellow-500 p-6 rounded-b-2xl border-x border-b border-white/5">
                        <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] text-center mb-6">NIVEL CONTROL</h4>
                        <div className="text-center mb-6">
                            <span className="text-2xl lg:text-3xl font-black text-white tracking-tighter whitespace-nowrap">$1,000-$2,500</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $2,000</p>
                        </div>
                        <div className="text-center mb-8">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+10% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$100-$250/mes</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>35%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full w-[35%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>35%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full w-[35%]"></div></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function MedicalRoadmap() {
    const steps = [
        {
            month: "Mes 1",
            title: "Cimiento & Confianza",
            objective: "Objetivo: Diseñar y estructurar la identidad digital del médico, eliminando la desconfianza del paciente.",
            details: [
                "Sesión fotográfica premium en consultorio (médico, equipo e instalaciones).",
                "Optimización completa de perfiles (bio clínica y diseño de Grid Estético).",
                "Estrategia de contenidos y copywriting enfocado en empatía y profesionalismo.",
                "Creación del manual de identidad de marca para redes sociales."
            ],
            metric: "Calidad de Imagen & Optimización de Bio",
            icon: Shield,
            color: "from-blue-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400"
        },
        {
            month: "Mes 2",
            title: "Crecimiento & Tráfico",
            objective: "Objetivo: Generar un flujo constante de consultas activando anuncios y produciendo video de valor.",
            details: [
                "Edición de videos profesionales en formato vertical (información y tips médicos).",
                "Puesta en marcha de campañas Meta Ads segmentadas a pacientes ideales de la zona.",
                "Grabación y edición de procedimientos clínicos y testimonios en consultorio.",
                "Configuración de respuestas rápidas y canalización directa a WhatsApp."
            ],
            metric: "Costo por Consulta en WhatsApp (CPL)",
            icon: Target,
            color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
        },
        {
            month: "Mes 3",
            title: "Autoridad & Posicionamiento",
            objective: "Objetivo: Consolidar al médico como el referente #1 de su especialidad en la región.",
            details: [
                "Producción de testimonios detallados de pacientes recuperados (casos complejos).",
                "Campañas de Google Ads de alta intención (búsqueda activa de cirugías/procedimientos).",
                "Automatización del embudo de agendamiento y recordatorios automáticos de citas.",
                "Lanzamiento de minidocumental sobre la trayectoria y profesionalismo del médico."
            ],
            metric: "Tasa de Agendamiento Final & ROAS",
            icon: Crown,
            color: "from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-400"
        }
    ];

    return (
        <div className="space-y-12 relative z-10 pt-10">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">Ruta Crítica de Crecimiento</h2>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="mb-10 text-center md:text-left">
                <h3 className="text-3xl font-black text-white tracking-tighter mb-4">¿Cómo construimos tu marca sólida en 3 meses?</h3>
                <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
                    Un plan estructurado diseñado específicamente para el sector salud. Cada mes tiene metas claras para transformar tu reputación digital en consultas y cirugías reales.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-[2.5rem] bg-[#0E0E18] border border-white/5 flex flex-col justify-between h-full relative overflow-hidden group hover:border-white/10 transition-all duration-300"
                        >
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] bg-indigo-500/10 px-4 py-2 rounded-xl">
                                        {step.month}
                                    </span>
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} border`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-wider mb-2">{step.title}</h4>
                                    <p className="text-xs font-bold text-gray-400 italic mb-4 leading-relaxed">{step.objective}</p>
                                    <div className="h-px bg-white/5 w-full my-4" />
                                    <ul className="space-y-3">
                                        {step.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed font-medium">
                                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-1">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Métrica de Éxito Clave</span>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">{step.metric}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

