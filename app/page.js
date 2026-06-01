'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
    ArrowRight, BarChart3, Bot, Clapperboard, Layers, Zap, 
    Shield, MessageSquare, Package, Activity, Users, DollarSign, 
    Calendar, MapPin, CheckCircle2, AlertCircle, Cpu, Clock, Send, 
    MessageCircle, Play, Star 
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
                {/* Message 1 */}
                <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-[10px] shrink-0">S</div>
                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 max-w-[80%] text-gray-300 leading-relaxed">
                        ¿Alex, cómo quedó el reel del postre de chocolate?
                    </div>
                </div>
                {/* Message 2 */}
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

    if (loading) return null; // Prevent flicker

    return (
        <div className="min-h-screen bg-[#050510] text-white selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 backdrop-blur-md border-b border-white/5 bg-[#050510]/80">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white">
                            DZ
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight">DIIC ZONE</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                            Iniciar Sesión
                        </Link>
                        <Link href="/hub">
                            <button className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform">
                                Entrar al Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse pointer-events-none delay-1000"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-emerald-400 mb-6 backdrop-blur-sm">
                            ✨ La evolución del Marketing Digital
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            Tu Estudio Creativo <br /> en el Futuro
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Centraliza tu estrategia, producción y métricas en una plataforma inteligente.
                            DIIC ZONE combina IA, automatización y talento humano para escalar tu marca.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x" />
                                <Link 
                                    href="/onboarding?type=client"
                                    className="relative flex items-center gap-3 px-10 py-5 rounded-full bg-black text-white font-black text-lg border border-white/10 group-hover:border-white/20 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Quiero Crecer Mi Marca 
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                            
                            <Link 
                                href="/onboarding?type=creative"
                                className="px-10 py-5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-lg backdrop-blur-md transition-all hover:border-white/20"
                            >
                                Únete como Talento 🎥
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Preview / Interactive Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="container mx-auto px-6 mt-20"
                >
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-5xl mx-auto">
                        {/* Tabs Column */}
                        <div className="flex flex-row lg:flex-col justify-center lg:justify-start gap-4 flex-wrap lg:w-64 shrink-0">
                            {[
                                { id: 'hq', label: 'Dirección Central (HQ)', desc: 'Control Central', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10' },
                                { id: 'filmmaker', label: 'Filmmakers', desc: 'Control de Rodaje', color: 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10' },
                                { id: 'editor', label: 'Editores', desc: 'Cola de Render', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10' },
                                { id: 'messages', label: 'Mensajería', desc: 'Chat & Aprobaciones', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setAutoPlay(false);
                                    }}
                                    className={`flex-1 lg:flex-none text-left p-5 rounded-3xl border transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'bg-white/10 border-white/20 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] scale-105'
                                            : `${tab.color} opacity-60 hover:opacity-100`
                                    }`}
                                >
                                    <div className="font-black text-xs uppercase tracking-widest leading-none mb-1">{tab.label}</div>
                                    <div className="text-[10px] text-gray-500 font-medium">{tab.desc}</div>
                                </button>
                            ))}
                        </div>

                        {/* Showcase Window (Laptop Mockup) */}
                        <div className="flex-1 min-h-[420px] bg-[#080814]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                            {/* Ambient Glows depending on active tab */}
                            {activeTab === 'hq' && <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full" />}
                            {activeTab === 'filmmaker' && <div className="absolute inset-0 bg-red-500/5 blur-[120px] rounded-full" />}
                            {activeTab === 'editor' && <div className="absolute inset-0 bg-purple-500/5 blur-[120px] rounded-full" />}
                            {activeTab === 'messages' && <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full" />}

                            {/* Windows Controls Bar */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-5 relative z-10">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                                </div>
                                <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        activeTab === 'hq' ? 'bg-indigo-500' :
                                        activeTab === 'filmmaker' ? 'bg-red-500' :
                                        activeTab === 'editor' ? 'bg-purple-500' : 'bg-emerald-500'
                                    } animate-pulse`} />
                                    {activeTab === 'hq' && 'HQ_CENTRAL.EXE'}
                                    {activeTab === 'filmmaker' && 'FILMMAKER_SCHEDULER.EXE'}
                                    {activeTab === 'editor' && 'RENDER_PIPELINE.EXE'}
                                    {activeTab === 'messages' && 'COMMUNICATION_HUB.EXE'}
                                </div>
                            </div>

                            {/* Content Render with Framer Motion AnimatePresence */}
                            <div className="flex-1 flex flex-col justify-center relative z-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full"
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

            {/* Features Section */}
            <section className="py-24 bg-[#050510]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para crecer</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Deja de usar 10 herramientas diferentes. DIIC ZONE lo tiene todo integrado.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Métricas Inteligentes</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Dashboards en tiempo real que traducen datos complejos en "Niveles de Salud" claros para tu marca.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community Manager IA</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Un asistente 24/7 que responde, analiza sentimientos y sugiere contenido basado en tendencias.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/50 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                                <Clapperboard className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Producción de Video</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Sube raw, recibe piezas finales. Un flujo de trabajo optimizado para Reels y contenido de alto impacto.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Creative Zone Call to Action */}
            <section id="creative-zone" className="py-24 bg-gradient-to-b from-[#050510] to-[#0A0A1F] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-12 md:p-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Ecosistema Profesional</span>
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                                ÚNETE A LA ZONA CREATIVA
                            </h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
                                ¿Eres editor, filmmaker, diseñador o community manager? 
                                Conviértete en un Nodo Certificado y trabaja con las mejores marcas del país.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
                                {[
                                    { name: 'Editors', color: 'text-blue-400' },
                                    { name: 'Filmmakers', color: 'text-red-400' },
                                    { name: 'Designers', color: 'text-purple-400' },
                                    { name: 'CMs', color: 'text-emerald-400' },
                                    { name: 'Photographers', color: 'text-orange-400' },
                                    { name: 'Models', color: 'text-pink-400' }
                                ].map((role, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-3 group/role">
                                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${role.color} font-bold text-sm group-hover/role:scale-110 transition-transform`}>
                                            {role.name[0]}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{role.name}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/onboarding?type=creative">
                                <button className="px-10 py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 flex items-center gap-3 mx-auto">
                                    Aplicar para ser Nodo <Zap className="w-4 h-4 fill-white" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#020205]">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-gray-400 text-sm">
                        © 2026 DIIC ZONE. Todos los derechos reservados.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Soporte</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
