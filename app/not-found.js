'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px]" />

            <div className="max-w-md w-full relative z-10 text-center">
                <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-8 border border-indgo-500/20 shadow-2xl shadow-indigo-500/10">
                    <FileQuestion className="w-10 h-10 text-indigo-500" />
                </div>

                <h1 className="text-4xl font-black text-white mb-4">Página No Encontrada</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Parece que te has perdido en el espacio digital. La ruta que buscas no existe o ha sido movida:
                    <br/><br/>
                    <strong className="text-red-400 p-2 bg-red-500/10 rounded border border-red-500/20 break-all">
                        Ruta Fallida: {pathname || 'Ruta Desconocida'}
                    </strong>
                </p>

                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        Ir al Inicio (Login)
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="block w-full py-4 bg-white/5 text-gray-400 hover:text-white font-bold rounded-xl border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Regresar
                    </button>
                </div>

                <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest">
                    Error 404 • DIIC ZONE OS
                </p>
            </div>
        </div>
    );
}
