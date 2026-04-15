'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const STATUS_COLORS = {
    'pending_review': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'approved': 'text-green-400 bg-green-400/10 border-green-400/20',
    'changes_requested': 'text-red-400 bg-red-400/10 border-red-400/20',
    'draft': 'text-gray-400 bg-gray-400/10 border-gray-400/20'
};

const STATUS_LABELS = {
    'pending_review': 'Esperando Revisión',
    'approved': 'Aprobado',
    'changes_requested': 'Cambios Solicitados',
    'draft': 'Borrador'
};

export default function DesignGallery({ items = [], onSelect }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Upload New Card */}


            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelect(item)}
                    className="group relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/5 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-all"
                >
                    {/* Image Preview */}
                    {item.file_url ? (
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${item.file_url})` }} />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                            <ImageIcon className="w-12 h-12 text-gray-600" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider backdrop-blur-md ${STATUS_COLORS[item.status] || STATUS_COLORS['draft']}`}>
                            {STATUS_LABELS[item.status] || item.status}
                        </span>
                    </div>

                    {/* Content Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {new Date(item.updated_at || Date.now()).toLocaleDateString()}
                        </p>
                        <h3 className="text-white font-bold text-lg leading-tight truncate">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-primary">
                            Ver detalles <CheckCircle className="w-3 h-3" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
