'use client';

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function ModulePlaceholder({ title, description, icon: Icon }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in space-y-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative"
            >
                {Icon ? <Icon className="w-12 h-12 text-gray-500" /> : <Construction className="w-12 h-12 text-gray-500" />}
                <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full border border-[#0A0A12]">
                    PRONTO
                </div>
            </motion.div>

            <div className="max-w-md space-y-2">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <p className="text-gray-400">{description}</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm max-w-sm">
                Estamos trabajando en este módulo. <br />
                Estará disponible en la próxima actualización.
            </div>

            <Link href="/dashboard/studio">
                <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors">
                    Volver al Mapa
                </button>
            </Link>
        </div>
    );
}
