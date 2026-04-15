'use client';

import { motion } from 'framer-motion';
import { X, Play, Share2, Download, Heart, Users, Calendar, HardDrive } from 'lucide-react';

export default function ThreeDViewer({ file, onClose }) {
    if (!file) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center perspective-1000">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* 3D Deployable Window */}
            <motion.div
                initial={{ rotateX: 45, y: 100, opacity: 0, scale: 0.8 }}
                animate={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
                exit={{ rotateX: -45, y: 100, opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="relative w-[90%] md:w-[800px] h-[80%] md:h-[600px] bg-[#0A0A12] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(139,92,246,0.3)] origin-bottom"
            >
                {/* Visual Side (Left) */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-black overflow-hidden group">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <motion.img
                        src={file.image}
                        alt={file.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />

                    {/* Floating Play Button Orb */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] cursor-pointer hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                    </div>
                </div>

                {/* Info Side (Right) - Holographic Panel */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col bg-[#0A0A12]">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6">
                                {file.department}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-display">
                                {file.name}
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                {file.description || "Este proyecto contiene activos de alta calidad listos para producción. Revisado y aprobado por el equipo de dirección creativa."}
                            </p>
                        </motion.div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide mb-1">
                                    <Calendar className="w-3 h-3" /> Fecha
                                </div>
                                <div className="text-white font-medium">{file.date}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide mb-1">
                                    <HardDrive className="w-3 h-3" /> Tamaño
                                </div>
                                <div className="text-white font-medium">{file.size}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide mb-1">
                                    <Users className="w-3 h-3" /> Equipo
                                </div>
                                <div className="text-white font-medium">3 Miembros</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download
                        </button>
                        <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors hover:text-pink-500">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
