'use client';

import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Zap, Target, BarChart } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartRecommendationStep({ onNext, formData }) {
    // Lógica ficticia de cálculo de nivel para demo
    const calculateLevel = () => {
        const { capacity, channels } = formData;
        let score = 1;

        // Reglas simples
        if (channels?.existingChannels?.whatsapp === 'yes') score++;
        if (channels?.existingChannels?.crm === 'yes') score++;
        if (capacity?.daily_appointments > 10 || capacity?.monthly_revenue?.includes('5k')) score++;

        return Math.min(score, 5); // Max nivel 5
    };

    const level = calculateLevel();

    const recommendations = [
        { title: 'Automatización de Citas', icon: Zap, desc: 'Configura el bot de WhatsApp para gestionar tu agenda.' },
        { title: 'Campaña de Contenidos', icon: Target, desc: 'Activa el generador de ideas para tus redes sociales.' },
        { title: 'Dashboard Metricas', icon: BarChart, desc: 'Visualiza tus KPIs principales en el panel de control.' }
    ];

    return (
        <div className="space-y-6 text-center h-full flex flex-col pt-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20"
            >
                <Trophy className="w-8 h-8 text-white mb-1" />
                <span className="text-3xl font-black text-white">Nivel {level}</span>
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Tu Perfil: <span className="text-indigo-400">Emprendedor Digital</span></h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                    Tienes una base sólida. Nuestro sistema ha preparado un plan para llevarte al siguiente nivel de automatización.
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left w-full max-w-lg mx-auto">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Plan de Acción Recomendado</h3>
                <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <rec.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                                <p className="text-xs text-gray-500">{rec.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </motion.div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => { toast.success('¡Entorno Creado Exitosamente!'); setTimeout(onNext, 1000); }}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-white/10 flex items-center justify-center gap-2"
            >
                Entrar a mi Dashboard
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}

import { ChevronRight } from 'lucide-react';
