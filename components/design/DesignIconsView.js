'use client';

import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

export default function DesignIconsView({ items, onSelect }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => onSelect(item)}
                    className="group relative aspect-square rounded-xl bg-white/5 border border-white/5 cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
                >
                    {/* Image Preview */}
                    {item.file_url ? (
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            style={{ backgroundImage: `url(${item.file_url})` }} />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                            <ImageIcon className="w-8 h-8 text-gray-600" />
                        </div>
                    )}

                    {/* Hover Info */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                        <p className="text-xs font-bold text-white line-clamp-2">{item.title}</p>
                    </div>

                    {/* Status Dot */}
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${item.status === 'approved' ? 'bg-green-500' :
                            item.status === 'changes_requested' ? 'bg-red-500' : 'bg-gray-500'
                        } ring-2 ring-black/50`} />
                </motion.div>
            ))}
        </div>
    );
}
