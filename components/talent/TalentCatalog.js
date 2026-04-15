'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, MapPin, BadgeCheck, Heart, SlidersHorizontal } from 'lucide-react';
import { TALENT_DATA } from '../../data/talent';
import TalentProfile from './TalentProfile'; // Start importing even if not created yet, will create next

export default function TalentCatalog({ category, onBack }) {
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [filterCategory, setFilterCategory] = useState(category || 'all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTalent = TALENT_DATA.filter(t => {
        const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
                <div>
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white text-sm mb-2 flex items-center gap-2 transition-colors"
                    >
                        ← Volver a categorías
                    </button>
                    <h2 className="text-3xl font-black text-white uppercase">Catálogo de Talentos</h2>
                    <p className="text-gray-400">Encuentra y contrata al perfil ideal para tu proyecto.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o rol..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50"
                        />
                    </div>
                    <button className="p-2.5 bg-[#0E0E18] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tags / Quick Filters */}
            <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
                {[
                    { id: 'all', label: 'Todos' },
                    { id: 'video', label: 'Video & TV' },
                    { id: 'brand', label: 'Modelos' },
                    { id: 'events', label: 'Eventos' },
                    { id: 'voice', label: 'Actores' },
                    { id: 'influencer', label: 'Influencers' }
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilterCategory(f.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${filterCategory === f.id
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTalent.map((talent) => (
                    <motion.div
                        key={talent.id}
                        layoutId={`card-${talent.id}`}
                        onClick={() => setSelectedTalent(talent)}
                        className="group relative bg-[#0E0E18] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-rose-500/30 transition-all"
                    >
                        {/* Image */}
                        <div className="aspect-[3/4] relative overflow-hidden">
                            <img
                                src={talent.image}
                                alt={talent.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Like Button */}
                            <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md text-white/50 hover:bg-rose-500 hover:text-white transition-all">
                                <Heart className="w-4 h-4" />
                            </button>

                            {/* Badge */}
                            {talent.isVerified && (
                                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-blue-500/20 backdrop-blur-md border border-blue-500/30 flex items-center gap-1">
                                    <BadgeCheck className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] font-bold text-blue-300 uppercase">Verificado</span>
                                </div>
                            )}

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-4">
                                <h3 className="text-lg font-bold text-white mb-0.5">{talent.name}</h3>
                                <p className="text-rose-400 text-xs font-bold uppercase tracking-wide mb-2">{talent.role}</p>

                                <div className="flex items-center justify-between text-xs text-gray-300">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-gray-500" />
                                        {talent.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        {talent.rating} ({talent.reviews})
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Footer */}
                        <div className="p-3 bg-white/5 border-t border-white/5 flex gap-2">
                            <button className="flex-1 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-colors">
                                Ver Perfil
                            </button>
                            <button className="flex-1 py-1.5 rounded-lg bg-rose-600/20 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-600/30 transition-all">
                                Contratar ${talent.rate}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedTalent && (
                    <TalentProfile
                        talent={selectedTalent}
                        onClose={() => setSelectedTalent(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
