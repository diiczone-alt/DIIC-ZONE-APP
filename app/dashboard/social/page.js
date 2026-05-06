'use client';

import { Construction, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#0E0E18]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md"
            >
                <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                    <Share2 className="w-10 h-10 text-purple-400" />
                </div>
                <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">
                    Social Hub
                </h1>
                <p className="text-gray-400 mb-8 font-medium">
                    Módulo de gestión de redes sociales y programación de contenido. Se habilitará cuando haya datos suficientes en el ecosistema.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest">
                    <Construction className="w-4 h-4" /> En Construcción
                </div>
            </motion.div>
        </div>
    );
}
