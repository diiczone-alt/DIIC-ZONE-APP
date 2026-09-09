'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/ui/BrandLogo';

// Landing Modular Components
import LandingNavbar from '@/components/landing/LandingNavbar';
import WhoWeAreSection from '@/components/landing/WhoWeAreSection';
import BrandsShowcase from '@/components/landing/BrandsShowcase';
import NicheExplorer from '@/components/landing/NicheExplorer';
import ServicesSection from '@/components/landing/ServicesSection';
import AcademySection from '@/components/landing/AcademySection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CreativeZoneBanner from '@/components/landing/CreativeZoneBanner';

import { 
    ArrowRight, Sparkles, Clapperboard, Video, 
    MapPin, Clock, CheckCircle2, Play, Star, ChevronDown,
    Shield, Layers, Compass
} from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();
    const { user, loading, getHomeRoute } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            console.log('[LandingPage] Authenticated user detected, checking destination...');
            
            // Check if onboarding is in progress
            const progress = localStorage.getItem('diic_onboarding_progress');
            if (progress) {
                console.log('[LandingPage] Resuming onboarding...');
                router.push('/onboarding');
            } else {
                const home = getHomeRoute(user.role);
                console.log(`[LandingPage] Moving to home: ${home}`);
                router.push(home);
            }
        }
    }, [user, loading, router, getHomeRoute]);

    const [activeTab, setActiveTab] = useState('hq');
    const [autoPlay, setAutoPlay] = useState(true);
    const [renderProgress, setRenderProgress] = useState(45);

    // Auto-play cycle for preview tabs
    useEffect(() => {
        if (!autoPlay) return;
        const tabs = ['hq', 'filmmaker', 'editor', 'messages'];
        const interval = setInterval(() => {
            setActiveTab((current) => {
                const nextIndex = (tabs.indexOf(current) + 1) % tabs.length;
                return tabs[nextIndex];
            });
        }, 6000);
        return () => clearInterval(interval);
    }, [autoPlay]);

    // Simulated render progress for the Editor tab
    useEffect(() => {
        if (activeTab !== 'editor') return;
        const interval = setInterval(() => {
            setRenderProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        }, 150);
        return () => clearInterval(interval);
    }, [activeTab]);

    const renderHQPreview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">MRR Revenue</span>
                    <span className="text-2xl font-black text-white italic mt-2">$14,350</span>
                    <span className="text-[8px] text-indigo-400 mt-1">● +12.4% este mes</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Validación</span>
                    <span className="text-2xl font-black text-white italic mt-2">90%</span>
                    <span className="text-[8px] text-emerald-400 mt-1">● 9 / 10 Clientes</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Nodos Activos</span>
                    <span className="text-2xl font-black text-white italic mt-2">18</span>
                    <span className="text-[8px] text-cyan-400 mt-1">● 100% operativos</span>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Sincronización de Cuentas</div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] text-indigo-400 font-bold">S</div>
                            <span className="text-gray-300 font-bold">Spiga de Oro</span>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-mono">Plan Aceleración</span>
                        <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full w-[85%]" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-400 font-bold">O</div>
                            <span className="text-gray-300 font-bold">Dra. Andrea Ortega</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">Plan Presencia</span>
                        <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[60%]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFilmmakerPreview = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div>
                    <span className="text-[8px] text-red-400 uppercase font-black tracking-widest block mb-1">Rodaje Activo</span>
                    <h4 className="text-white font-bold text-sm">Spiga de Oro - Lanzamiento</h4>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Quito, Estudio A</p>
                </div>
                <div className="text-right">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-wider">Confirmado</span>
                    <span className="text-[10px] text-gray-400 block mt-2 font-mono flex items-center gap-1 justify-end"><Clock className="w-3.5 h-3.5 text-gray-500" /> Hoy 15:30</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Cámaras & Lentes</span>
                    <div className="text-xs space-y-1.5 text-gray-300 font-medium">
                        <div className="flex items-center justify-between"><span>Sony FX3</span> <span className="text-[9px] text-emerald-400 font-mono">Activa</span></div>
                        <div className="flex items-center justify-between"><span>24-70mm f/2.8 GM II</span> <span className="text-[9px] text-emerald-400 font-mono">En uso</span></div>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Planificación</span>
                    <div className="text-xs space-y-1.5 text-gray-300 font-medium">
                        <div className="flex items-center justify-between"><span>B-Roll de Repostería</span> <span className="text-[9px] text-gray-500">12 tomas</span></div>
                        <div className="flex items-center justify-between"><span>Entrevista Fundador</span> <span className="text-[9px] text-gray-500">2 tomas</span></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEditorPreview = () => (
        <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[8px] text-purple-400 uppercase font-black tracking-widest block mb-1">Procesando Video</span>
                        <h4 className="text-white font-bold text-sm">Reel de Lanzamiento - Spiga de Oro</h4>
                    </div>
                    <span className="text-lg font-black text-purple-400 font-mono">{renderProgress}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-purple-500 h-full transition-all duration-150" style={{ width: `${renderProgress}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-gray-500">
                    <span>Exportando a MP4 (4K H.264)</span>
                    <span>Tasa de bits: 45 Mbps</span>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Pistas de la Línea de Tiempo</span>
                <div className="space-y-1.5 text-[10px] font-mono">
                    <div className="flex items-center justify-between bg-purple-950/20 border border-purple-500/10 p-1.5 rounded-lg text-purple-300">
                        <span>[V1] A-Roll (Sony S-Log3)</span> <span>Recorte 4K</span>
                    </div>
                    <div className="flex items-center justify-between bg-blue-950/20 border border-blue-500/10 p-1.5 rounded-lg text-blue-300">
                        <span>[A1] SoundFX & Locución</span> <span>Volumen: -6dB</span>
                    </div>
                    <div className="flex items-center justify-between bg-amber-950/20 border border-amber-500/10 p-1.5 rounded-lg text-amber-300">
                        <span>[FX] Cinematic LUT v2.0</span> <span>Opacidad: 100%</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMessagesPreview = () => (
        <div className="space-y-4">
            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Canal: Spiga de Oro (Socio)</div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 h-[180px] overflow-y-auto flex flex-col justify-end text-xs">
                <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-[10px] shrink-0">S</div>
                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 max-w-[80%] text-gray-300 leading-relaxed">
                        ¿Alex, cómo quedó el reel del postre de chocolate?
                    </div>
                </div>
                <div className="flex items-start gap-2.5 self-end flex-row-reverse">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-[10px] shrink-0">A</div>
                    <div className="bg-emerald-600/10 p-3 rounded-2xl rounded-tr-none border border-emerald-500/20 max-w-[80%] text-gray-300 leading-relaxed text-right">
                        ¡Hola! Quedó increíble. Ya está listo y aprobado. El editor le puso un LUT cinematográfico espectacular. Te lo subo a la carpeta.
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between bg-emerald-500/[0.03] border border-emerald-500/10 p-3 rounded-xl text-[10px] text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Archivo sincronizado con Google Drive</span>
                <span className="font-mono text-[9px]">Listo para publicar</span>
            </div>
        </div>
    );

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#050510] text-white selection:bg-indigo-500/30 font-sans">
            {/* Global Navbar */}
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-b from-[#08081a] via-[#050510] to-[#050510]">
                {/* Ambient Glows */}
                <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
                <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse delay-1000" />

                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-xs font-bold text-indigo-300 mb-6 backdrop-blur-md shadow-inner">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Estudio Creativo Audiovisual & Marketing Inteligente
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black leading-tight tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
                            Tu Estudio Audiovisual <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                                de Clase Mundial
                            </span>
                        </h1>

                        <p className="text-gray-300 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
                            Creamos producciones cinematográficas 4K, estrategias de contenido adaptadas a tu nicho y automatizaciones con IA para escalar tu marca con elegancia, autoridad y resultados medibles.
                        </p>

                        {/* Hero CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link 
                                    href="/onboarding?type=client"
                                    className="flex items-center gap-3 px-9 py-4 rounded-2xl bg-white text-black font-black text-base shadow-2xl shadow-white/20 hover:bg-gray-100 transition-all"
                                >
                                    Impulsar Mi Marca
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <a 
                                    href="#quienes-somos"
                                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-base border border-white/10 transition-all"
                                >
                                    <Compass className="w-5 h-5 text-indigo-400" />
                                    Conócenos & Manifiesto
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard / Studio Interactive Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.9 }}
                    className="container mx-auto px-6 max-w-6xl mt-16"
                >
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                        {/* Tabs Column */}
                        <div className="flex flex-row lg:flex-col justify-center lg:justify-start gap-3 flex-wrap lg:w-64 shrink-0">
                            {[
                                { id: 'hq', label: 'Dirección Central (HQ)', desc: 'Estrategia y Métricas', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10' },
                                { id: 'filmmaker', label: 'Filmmakers', desc: 'Control de Rodaje 4K', color: 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10' },
                                { id: 'editor', label: 'Suite de Edición', desc: 'Render & Color Grading', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10' },
                                { id: 'messages', label: 'Hub de Mensajería', desc: 'Aprobaciones en Vivo', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setAutoPlay(false);
                                    }}
                                    className={`flex-1 lg:flex-none text-left p-4 rounded-2xl border transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'bg-white/10 border-white/30 text-white shadow-xl scale-105'
                                            : `${tab.color} opacity-60 hover:opacity-100`
                                    }`}
                                >
                                    <div className="font-black text-xs uppercase tracking-wider leading-none mb-1">{tab.label}</div>
                                    <div className="text-[10px] text-gray-500 font-medium">{tab.desc}</div>
                                </button>
                            ))}
                        </div>

                        {/* Showcase Window */}
                        <div className="flex-1 min-h-[400px] bg-[#080816]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                            {/* Ambient Glows */}
                            {activeTab === 'hq' && <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />}
                            {activeTab === 'filmmaker' && <div className="absolute inset-0 bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />}
                            {activeTab === 'editor' && <div className="absolute inset-0 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />}
                            {activeTab === 'messages' && <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />}

                            {/* Controls Bar */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 relative z-10">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                                </div>
                                <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        activeTab === 'hq' ? 'bg-indigo-500' :
                                        activeTab === 'filmmaker' ? 'bg-red-500' :
                                        activeTab === 'editor' ? 'bg-purple-500' : 'bg-emerald-500'
                                    } animate-pulse`} />
                                    {activeTab === 'hq' && 'DIIC_HQ_ENGINE.SYS'}
                                    {activeTab === 'filmmaker' && 'RODAJE_CINEMA_4K.EXE'}
                                    {activeTab === 'editor' && 'COLOR_GRADING_PIPELINE.EXE'}
                                    {activeTab === 'messages' && 'BRAND_SYNC_HUB.EXE'}
                                </div>
                            </div>

                            {/* Content Render */}
                            <div className="flex-1 flex flex-col justify-center relative z-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full"
                                    >
                                        {activeTab === 'hq' && renderHQPreview()}
                                        {activeTab === 'filmmaker' && renderFilmmakerPreview()}
                                        {activeTab === 'editor' && renderEditorPreview()}
                                        {activeTab === 'messages' && renderMessagesPreview()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Quiénes Somos & Manifiesto */}
            <WhoWeAreSection />

            {/* Marcas & Portafolio */}
            <BrandsShowcase />

            {/* Nichos Adaptativos */}
            <NicheExplorer />

            {/* Catálogo de Servicios */}
            <ServicesSection />

            {/* DIIC Academy */}
            <AcademySection />

            {/* Planes y Valores */}
            <PricingSection />

            {/* Testimonios */}
            <TestimonialsSection />

            {/* Zona Creativa & Registro Side-by-Side */}
            <CreativeZoneBanner />

            {/* Footer */}
            <footer className="py-16 border-t border-white/10 bg-[#020206] text-gray-400 text-xs">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
                        {/* Brand info (2 cols) */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                    <BrandLogo className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-display font-black text-lg text-white">DIIC ZONE</span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                                Estudio integral de producción audiovisual, marketing digital con inteligencia artificial y ecosistema creativo para marcas de alto impacto.
                            </p>
                            <div className="text-[11px] text-gray-500 font-mono">
                                Producciones 4K · Nodos Creativos Certificados · Estrategia Omnicanal
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-3">
                            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Estudio</h5>
                            <ul className="space-y-2">
                                <li><a href="#quienes-somos" className="hover:text-white transition-colors">Quiénes Somos</a></li>
                                <li><a href="#marcas" className="hover:text-white transition-colors">Marcas Asociadas</a></li>
                                <li><a href="#nichos" className="hover:text-white transition-colors">Nichos Adaptativos</a></li>
                                <li><a href="#servicios" className="hover:text-white transition-colors">Servicios Audiovisuales</a></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Ecosistema</h5>
                            <ul className="space-y-2">
                                <li><a href="#academy" className="hover:text-white transition-colors">DIIC Academy</a></li>
                                <li><a href="#planes" className="hover:text-white transition-colors">Planes de Inversión</a></li>
                                <li><a href="#zona-creativa" className="hover:text-white transition-colors">Zona Creativa (Talento)</a></li>
                                <li><a href="#testimonios" className="hover:text-white transition-colors">Testimonios</a></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Acceso & App</h5>
                            <ul className="space-y-2">
                                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
                                <li><Link href="/onboarding?type=client" className="hover:text-white transition-colors">Registrar Empresa</Link></li>
                                <li><Link href="/onboarding?type=creative" className="hover:text-white transition-colors">Postular como Creador</Link></li>
                                <li><Link href="/hub" className="hover:text-white transition-colors">Entrar al Hub / Dashboard</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-[11px]">
                        <div>
                            © {new Date().getFullYear()} DIIC ZONE. Todos los derechos reservados.
                        </div>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
                            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
                            <a href="#" className="hover:text-white transition-colors">Soporte Directo</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
