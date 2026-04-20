'use client';

import { motion } from 'framer-motion';
import { Play, Image as ImageIcon, Video, Music, AudioWaveform, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const MOCK_PREVIEW_FILES = [
    { id: 1, name: 'Nine Track Mind', type: 'video', department: 'Filmmaker', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80' },
    { id: 2, name: 'Coloring Book', type: 'design', department: 'Branding', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80' },
    { id: 3, name: 'LP1 Studio', type: 'audio', department: 'Audio Studio', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80' },
    { id: 5, name: 'Social Reels Batch', type: 'video', department: 'Social', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' },
    { id: 6, name: 'Event Recap 2024', type: 'video', department: 'Production', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' },
];

export default function GalleryPreview({ assets = MOCK_PREVIEW_FILES }) {
    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Recursos & Galería</h2>
                    <div className="bg-blue-500/10 px-3 py-1 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20">
                        Sincronizados
                    </div>
                </div>
                <Link href="/dashboard/gallery" className="group flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all">
                    Explorar Todo <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x h-[320px]">
                {assets.map((asset, i) => (
                    <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="snap-start min-w-[240px] group relative h-full"
                    >
                        {/* MAIN CARD */}
                        <div className="relative h-full rounded-[2rem] overflow-hidden border border-white/5 bg-[#12121A] transition-all duration-500 group-hover:border-blue-500/30 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            {/* Image Background */}
                            <img 
                                src={asset.image} 
                                alt={asset.name} 
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-black/20 to-transparent group-hover:via-black/10 transition-all duration-500" />

                            {/* Content Top */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-wider rounded-lg flex items-center gap-2">
                                    <Sparkles className="w-2 h-2 text-blue-400" />
                                    {asset.department}
                                </span>
                                
                                <div className="p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/50 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                                    {asset.type === 'video' ? <Video className="w-4 h-4" /> : asset.type === 'audio' ? <AudioWaveform className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                                </div>
                            </div>

                            {/* Center Action (Play/View) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-white">
                                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 transition-transform active:scale-95">
                                    <Play className="w-6 h-6 fill-current ml-1" />
                                </div>
                            </div>

                            {/* Info Bottom */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-lg font-black text-white italic tracking-tighter leading-tight group-hover:translate-y-[-4px] transition-transform">
                                    {asset.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-2 group-hover:translate-y-0">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Activo Listo</span>
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-[10px] text-white/40 uppercase tracking-tighter">HD 4K</span>
                                </div>
                            </div>
                        </div>

                        {/* Decoration Glow */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/5 blur-[40px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                ))}

                {/* VIEW ALL CARD */}
                <Link href="/dashboard/gallery" className="snap-start min-w-[240px] h-full rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group hover:border-blue-500/30 hover:bg-white/[0.02] transition-all bg-black/20">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                        <ChevronRight className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Ver Galería Completa</span>
                </Link>
            </div>
        </section>
    );
}
