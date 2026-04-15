'use client';

import { useRouter } from 'next/navigation';
import { 
    FileText, Lightbulb, Zap, HelpCircle, 
    BookOpen, Play, ChevronRight, Star
} from 'lucide-react';
import { EDITOR_GUIDES } from '@/data/workstationData';

export default function GuidesPage() {
    const router = useRouter();

    return (
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#050511]">
            <header className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Guías & Recursos</h1>
                    <p className="text-gray-500 text-sm">Mejora tus habilidades y conoce los estándares de la agencia.</p>
                </div>
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">Populares</button>
                    <button className="px-4 py-2 text-gray-500 text-xs font-bold hover:text-white transition-all">Mis Guardados</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EDITOR_GUIDES.map((guide) => (
                    <div 
                        key={guide.id} 
                        onClick={() => router.push(`/workstation/editor/guides/${guide.id}`)}
                        className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 hover:bg-white/[0.01] transition-all group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BookOpen className="w-24 h-24" />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
                                {guide.type}
                            </span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">• {guide.time} de lectura</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{guide.title}</h3>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-bold text-white">{guide.rating}</span>
                                <span className="text-xs text-gray-600 font-medium">(+120)</span>
                            </div>
                            <button className="flex items-center gap-2 text-xs font-black text-indigo-400 group-hover:gap-3 transition-all uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-white/5 group-hover:bg-indigo-500 group-hover:text-white">
                                Leer Guía <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Featured Course/Academy Link */}
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-white/10 rounded-[40px] p-12 flex items-center justify-between relative overflow-hidden group">
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
                            <Zap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Masterclass Destacada</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">Mastering Dynamic Captions 2026</h2>
                    <p className="text-indigo-200/60 mb-8 leading-relaxed">Aprende técnica avanzada de retención mediante subtítulos reactivos de alto impacto.</p>
                    <button 
                        onClick={() => router.push('/workstation/academy/captions-2026')}
                        className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-white/10"
                    >
                        Empezar Curso
                    </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500 opacity-10 blur-3xl rounded-full translate-x-1/2" />
                <Play className="w-64 h-64 text-white opacity-5 absolute -right-16 -bottom-16 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>
        </div>
    );
}
