'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FileText, Lightbulb, Zap, HelpCircle, 
    BookOpen, Play, ChevronRight, Star, Search
} from 'lucide-react';
import { FILMMAKER_GUIDES } from '@/data/workstationData';

export default function FilmmakerGuidesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, Técnico, Producción, Fotografía

    const filteredGuides = FILMMAKER_GUIDES.filter(guide => {
        const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             guide.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || guide.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const categories = ['all', 'Técnico', 'Producción', 'Fotografía'];

    return (
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#050511] text-white custom-scrollbar">
            <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                        <FileText className="w-8 h-8 text-cyan-500" /> Guías & Manuales Técnicos
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Estándares de filmación, configuraciones de cámara e iluminación para el equipo de producción.</p>
                </div>
                <div className="flex bg-[#0E0E18] rounded-2xl p-1 border border-white/10 self-start md:self-auto">
                    <button className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20">Oficiales</button>
                    <button className="px-4 py-2 text-gray-500 text-xs font-bold hover:text-white transition-all">Plantillas PDF</button>
                </div>
            </header>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Buscar guía técnica..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0E0E18] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-600/20' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white'}`}
                        >
                            {cat === 'all' ? 'Ver Todas' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGuides.length > 0 ? (
                    filteredGuides.map((guide) => (
                        <div 
                            key={guide.id} 
                            onClick={() => router.push(`/workstation/filmmaker/guides/${guide.id}`)}
                            className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 hover:border-cyan-500/30 hover:bg-white/[0.01] transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <BookOpen className="w-24 h-24 text-cyan-500" />
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-cyan-500/20">
                                        {guide.type}
                                    </span>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">• {guide.time} de lectura</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{guide.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-2 mb-6">{guide.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold text-white">{guide.rating}</span>
                                    <span className="text-xs text-gray-600 font-medium">(+98)</span>
                                </div>
                                <button className="flex items-center gap-2 text-xs font-black text-cyan-400 group-hover:gap-3 transition-all uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-white/5 group-hover:bg-cyan-500 group-hover:text-white">
                                    Abrir Guía <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-20 text-gray-500 bg-[#0E0E18] rounded-3xl border border-white/5">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20 text-cyan-500" />
                        <p className="font-bold">No se encontraron guías que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>

            {/* Featured Course/Academy Link */}
            <div className="bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group gap-6">
                <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-2xl">
                            <Zap className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em]">Masterclass Destacada</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 leading-tight uppercase italic tracking-tighter">Filmmaker & Producción AV</h2>
                    <p className="text-cyan-200/60 mb-8 leading-relaxed text-sm">Aprende técnicas profesionales de iluminación de tres puntos, balance de audio y flujo de trabajo en sets de grabación.</p>
                    <button 
                        onClick={() => router.push('/workstation/filmmaker/academy')}
                        className="px-8 py-3.5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-white/10"
                    >
                        Comenzar Curso
                    </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cyan-500 opacity-5 blur-3xl rounded-full translate-x-1/2" />
                <Play className="w-56 h-56 text-white opacity-5 absolute -right-16 -bottom-16 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>
        </div>
    );
}
