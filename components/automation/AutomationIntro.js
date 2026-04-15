'use client';

import { motion } from 'framer-motion';
import { Bot, Zap, Activity, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AutomationIntro({ onComplete }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 1000); // Show assistant
        const timer2 = setTimeout(() => setStep(2), 2500); // Show checklist
        const timer3 = setTimeout(() => setStep(3), 4500); // Show button

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050510]/95 backdrop-blur-xl">
            <div className="max-w-md w-full p-8 text-center relative">

                {/* Assistant Circle */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 relative"
                >
                    <Bot className="w-12 h-12 text-white" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-white/30 rounded-full"
                    />
                </motion.div>

                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 20 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-2">Conectividad & Automatización</h2>
                    <p className="text-gray-300">
                        "Hola, soy tu centro nervioso digital. Conecto tus redes, organizo tus clientes y automatizo tu crecimiento."
                    </p>
                </motion.div>

                {/* Checklist */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step >= 2 ? 1 : 0 }}
                    className="space-y-3 mb-8 text-left bg-white/5 p-4 rounded-xl border border-white/10"
                >
                    <CheckItem text="Redes Conectadas" delay={0.2} />
                    <CheckItem text="CRM Inteligente Activo" delay={0.4} />
                    <CheckItem text="Flujos de Respuesta Listos" delay={0.6} />
                </motion.div>

                {/* Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: step >= 3 ? 1 : 0, scale: step >= 3 ? 1 : 0.9 }}
                    onClick={onComplete}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                >
                    <Zap className="w-5 h-5" />
                    Iniciar Sistema
                </motion.button>
            </div>
        </div>
    );
}

function CheckItem({ text, delay }) {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay }}
            className="flex items-center gap-3 text-sm text-gray-300"
        >
            <CheckCircle className="w-4 h-4 text-green-500" />
            {text}
        </motion.div>
    );
}
