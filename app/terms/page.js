'use client';

import Link from 'next/link';
import { FileCheck, ArrowLeft, Scale, ShieldCheck, Users, AlertCircle } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#050510] text-white p-6 md:p-16 flex items-center justify-center">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl w-full bg-[#0A0A1F] border border-white/5 rounded-[3rem] p-8 md:p-16 space-y-12 relative z-10 shadow-2xl">
                <div className="space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                    </Link>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                            <Scale className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                                Términos de Servicio
                            </h1>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">
                                DIIC ZONE • Última actualización: Junio 2026
                            </p>
                        </div>
                    </div>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-8 text-sm text-gray-300 leading-relaxed font-medium">
                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <FileCheck className="w-4 h-4 text-indigo-400" /> 1. Aceptación de los Términos
                        </h3>
                        <p>
                            Al acceder y utilizar la plataforma <strong>DIIC ZONE</strong>, usted acepta cumplir con estos Términos y Condiciones de Servicio.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <Users className="w-4 h-4 text-indigo-400" /> 2. Cuentas y Servicios de Terceros
                        </h3>
                        <p>
                            Nuestra plataforma permite la integración con redes sociales y servicios de terceros como TikTok, Meta y Google. Al conectar sus cuentas, nos otorga los permisos necesarios para sincronizar y analizar sus métricas de rendimiento.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <ShieldCheck className="w-4 h-4 text-indigo-400" /> 3. Uso Aceptable
                        </h3>
                        <p>
                            El usuario se compromete a no utilizar los servicios para fines no autorizados o que infrinjan los términos de servicio de las plataformas integradas.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <AlertCircle className="w-4 h-4 text-indigo-400" /> 4. Contacto
                        </h3>
                        <p>
                            Para consultas sobre estos Términos, comuníquese en <span className="text-indigo-400 font-bold">soporte@diiczone.com</span>.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
