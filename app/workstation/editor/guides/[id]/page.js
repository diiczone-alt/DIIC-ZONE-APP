'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ChevronLeft, BookOpen, Clock, Star, 
    Share2, Bookmark, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { EDITOR_GUIDES } from '@/data/workstationData';

export default function GuideReaderPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [read, setRead] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const guide = EDITOR_GUIDES.find(g => g.id === id) || EDITOR_GUIDES[0];

    return (
        <div className="flex-1 flex flex-col font-sans bg-[#050511] text-white overflow-y-auto selection:bg-indigo-500/30 min-h-screen">
            {/* Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-500 origin-left z-50 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ scaleX }}
            />

            {/* Sticky Header */}
            <header className="sticky top-0 h-20 border-b border-white/5 bg-[#050511]/80 backdrop-blur-xl flex items-center justify-between px-8 z-40">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="p-2.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-white/5" />
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-widest text-white/50">{guide.type}</h1>
                        <p className="text-sm font-bold text-white truncate max-w-[300px]">{guide.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-3 text-gray-500 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                    <button className="p-3 text-gray-500 hover:text-white transition-colors"><Bookmark className="w-5 h-5" /></button>
                    {!read ? (
                        <button 
                            onClick={() => setRead(true)}
                            className="ml-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Marcar como Leído
                        </button>
                    ) : (
                        <div className="ml-4 flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest rounded-xl">
                            <CheckCircle className="w-4 h-4" /> Completada
                        </div>
                    )}
                </div>
            </header>

            {/* Hero / Cover */}
            <div className="max-w-4xl mx-auto w-full pt-16 px-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-black text-white">{guide.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase">{guide.time} lectura</span>
                    </div>
                </div>

                <h2 className="text-6xl font-black text-white mb-8 tracking-tighter leading-none italic uppercase">
                    {guide.title}
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed font-medium mb-16 max-w-2xl">
                    {guide.description}
                </p>

                <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-16" />
            </div>

            {/* Content Body */}
            <article className="max-w-4xl mx-auto w-full px-8 pb-32">
                <div className="grid grid-cols-12 gap-12">
                    {/* Main Text */}
                    <div className="col-span-12 lg:col-span-8 space-y-12">
                        {guide.content.map((section, i) => (
                            <section key={i} className="space-y-6">
                                <h3 className="text-2xl font-black text-white flex items-center gap-4 group">
                                    <span className="text-indigo-500 font-mono text-sm opacity-50">0{i+1}</span>
                                    <span className="uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{section.title}</span>
                                </h3>
                                <p className="text-lg text-gray-400 leading-relaxed">
                                    {section.body}
                                </p>
                            </section>
                        ))}

                        {/* Footer Action */}
                        {!read && (
                            <div className="pt-20">
                                <button 
                                    onClick={() => setRead(true)}
                                    className="w-full py-8 bg-[#0E0E18] border border-white/10 rounded-[32px] hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all group flex flex-col items-center justify-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-black text-white uppercase tracking-widest">He terminado de leer</p>
                                        <p className="text-sm text-gray-500 font-medium">Obtén +50 XP y marca tu progreso</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Stats */}
                    <aside className="hidden lg:block lg:col-span-4 sticky top-32 h-fit space-y-8">
                        <div className="bg-[#0E0E18] border border-white/10 rounded-3xl p-6">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Sobre este recurso</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Dificultad</span>
                                    <span className="text-xs font-bold text-white">Intermedio</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Actualizado</span>
                                    <span className="text-xs font-bold text-white">Oct 2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-3xl p-6">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <BookOpen className="w-3 h-3" /> Guía Próxima
                            </h4>
                            <p className="text-sm font-bold text-white mb-2">Optimización de Renders 4K</p>
                            <button className="text-xs font-black text-indigo-400 hover:text-white transition-colors flex items-center gap-2">
                                IR AHORA <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </aside>
                </div>
            </article>
        </div>
    );
}
