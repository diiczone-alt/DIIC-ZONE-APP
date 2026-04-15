'use client';

import { Megaphone, Target, BarChart2 } from 'lucide-react';

export default function MetaAdsWizard() {
    return (
        <div className="flex flex-col items-center justify-center h-[500px] text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Megaphone className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Meta Ads Manager</h3>
            <p className="text-gray-400 max-w-md mb-6">
                Crea campañas profesionales en segundos. Elige un objetivo, selecciona tu creativo y lanza.
            </p>
            <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                    Crear Nueva Campaña
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/10">
                    Impulsar Contenido
                </button>
            </div>
        </div>
    );
}
