'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function HQErrorBoundary({ error, reset }) {
    useEffect(() => {
        console.error('HQ Error Boundary caught an error:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-[#050511]">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-2xl shadow-rose-500/10">
                <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                Centro de Operaciones: Notificación de Sistema
            </h2>
            
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
                {error?.message || 'Ha ocurrido un error inesperado al cargar este módulo.'}
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reintentar Carga
                </button>
                <button
                    onClick={() => window.location.href = '/dashboard/hq'}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-black uppercase tracking-widest transition-all"
                >
                    Ir a HQ Central
                </button>
            </div>
        </div>
    );
}
