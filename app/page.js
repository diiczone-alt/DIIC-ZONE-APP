'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, Clapperboard, Layers, Zap } from 'lucide-react';

export default function LandingPage() {
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

                {/* Dashboard Preview / Faux 3D */}
                <motion.div
                    initial={{ opacity: 0, y: 50, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="container mx-auto px-6 mt-20"
                >
                    <div className="relative rounded-2xl p-2 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm">
                        <img
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
                            alt="Dashboard Preview"
                            className="rounded-xl w-full object-cover opacity-50 border border-white/5 shadow-2xl"
                        />
                        {/* Overlay UI Mockups */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center">
                            <p className="text-gray-500">Vista Previa de Plataforma</p>
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
