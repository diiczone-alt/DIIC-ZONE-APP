'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export default function GrowthFinalCTA() {
    return (
        <section className="relative py-32 text-center pb-20">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 w-fit mx-auto leading-none">
                        <Sparkles className="w-3 h-3" />
                        Tu Éxito Comienza Aquí
                    </span>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic tracking-tight leading-[1.1] uppercase">
                        ¿LISTO PARA <span className="inline-block px-1 text-blue-500">CRECER?</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-2xl font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed pt-4">
                        Agenda una asesoría y definimos el mejor plan para tu negocio.
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10 px-6">
                    <button 
                        onClick={() => window.open('https://wa.me/5491100000000', '_blank')}
                        className="group relative w-full md:w-auto px-10 py-6 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-3xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-pulse hover:animate-none"
                    >
                        <MessageCircle className="w-6 h-6" />
                        Hablar por WhatsApp
                        <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <button 
                        onClick={() => window.open('https://calendly.com/diiczone', '_blank')}
                        className="group w-full md:w-auto px-10 py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-3xl flex items-center justify-center gap-4 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                    >
                        <Calendar className="w-6 h-6 text-blue-400" />
                        Agendar reunión
                    </button>
                </div>

                {/* Additional Section: Testimonials & Logos (Hidden placeholders) */}
                <div className="pt-24 space-y-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Empresas que ya escalan con nosotros</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 opacity-30">
                        {/* Here we can add client logos */}
                        <div className="text-xl font-black italic tracking-tighter">DIIC <span className="text-blue-500">ZONE</span></div>
                        <div className="text-xl font-black italic tracking-tighter">CREATIVE <span className="text-purple-500">HUB</span></div>
                        <div className="text-xl font-black italic tracking-tighter">STRATEGY <span className="text-emerald-500">LAB</span></div>
                        <div className="text-xl font-black italic tracking-tighter">GLOBAL <span className="text-amber-500">HQ</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
