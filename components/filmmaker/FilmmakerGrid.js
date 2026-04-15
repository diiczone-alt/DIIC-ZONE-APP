'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function FilmmakerGrid({ items, onSelect }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelect(item)}
                    className="group relative aspect-video rounded-xl bg-white/5 border border-white/5 cursor-pointer overflow-hidden hover:ring-2 hover:ring-red-500/50 transition-all"
                >
                    {/* Thumbnail */}
                    {item.thumbnail ? (
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            style={{ backgroundImage: `url(${item.thumbnail})` }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-4 flex flex-col justify-end">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1 block">{item.type}</span>
                            <h3 className="text-white font-bold leading-tight line-clamp-2">{item.title}</h3>

                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-300">{item.status === 'pending_recording' ? 'Por Grabar' : 'En Proceso'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
