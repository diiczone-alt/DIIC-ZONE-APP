'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, FileText, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function LegalStep({ onNext }) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPolicy, setAcceptedPolicy] = useState(false);

    const handleContinue = () => {
        if (!acceptedTerms || !acceptedPolicy) {
            toast.error('Debes aceptar los términos y políticas para continuar');
            return;
        }
        onNext();
    };

    return (
        <div className="space-y-8 text-center h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4"
            >
                <ShieldAlert className="w-10 h-10 text-indigo-400" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Transparencia y Confianza</h2>
                <p className="text-gray-400">Antes de crear tu entorno, por favor revisa nuestros compromisos.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4 w-full max-h-[300px] overflow-y-auto custom-scrollbar">
                <LegalItem
                    icon={Lock}
                    title="Privacidad de Datos"
                    desc="Tu información estratégica y financiera está encriptada y solo tú tienes acceso a ella."
                />
                <LegalItem
                    icon={FileText}
                    title="Gestión de Archivos"
                    desc="Al conectar Drive, nos otorgas permiso para crear y organizar carpetas. No eliminamos archivos existentes."
                />
                <LegalItem
                    icon={ShieldAlert}
                    title="Responsabilidad"
                    desc="DIIC ZONE provee herramientas de gestión. La responsabilidad legal del contenido es del usuario."
                />
                <div className="text-xs text-gray-500 mt-4 leading-relaxed">
                    Al utilizar esta plataforma, aceptas que el uso de herramientas de automatización e IA es para optimizar tus procesos creativos y de negocio bajo tu propia supervisión.
                </div>
            </div>

            <div className="space-y-3 w-full">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${acceptedTerms ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600 group-hover:border-white'}`}>
                        {acceptedTerms && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                    <span className="text-sm text-gray-300">Acepto los <span className="text-white font-bold underline decoration-indigo-500 underline-offset-2">Términos de Servicio</span></span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${acceptedPolicy ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600 group-hover:border-white'}`}>
                        {acceptedPolicy && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)} />
                    <span className="text-sm text-gray-300">Acepto la <span className="text-white font-bold underline decoration-indigo-500 underline-offset-2">Política de Privacidad y Datos</span></span>
                </label>
            </div>

            <button
                onClick={handleContinue}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${acceptedTerms && acceptedPolicy ? 'bg-white text-black hover:scale-[1.02] shadow-xl shadow-white/10' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
            >
                Confirmar y Continuar
            </button>
        </div>
    );
}

function LegalItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <Icon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
