'use client';

import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Zap, Target, BarChart, ChevronRight, Stethoscope, Activity, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartRecommendationStep({ onNext, formData }) {
    const isDoctor = formData.profileType === 'doctor' || formData.profileType === 'health';

    // Lógica ficticia de cálculo de nivel para demo
    const calculateLevel = () => {
        const { businessInfo } = formData;
        let score = 1;

        // Reglas simples basadas en la info del negocio
        if (businessInfo?.usesCRM) score++;
        if (formData.niche === 'Médico' || isDoctor) score += 2;
        
        return Math.min(score, 5); // Max nivel 5
    };

    const level = calculateLevel();

    const genericRecommendations = [
        { title: 'Automatización de Citas', icon: Zap, desc: 'Configura el bot de WhatsApp para gestionar tu agenda.' },
        { title: 'Campaña de Contenidos', icon: Target, desc: 'Activa el generador de ideas para tus redes sociales.' },
        { title: 'Dashboard Metricas', icon: BarChart, desc: 'Visualiza tus KPIs principales en el panel de control.' }
    ];

    const doctorRecommendations = [
        { title: 'Nivel 1: Presencia Digital', icon: Shield, desc: 'Optimizamos tu perfil para generar confianza inmediata.' },
        { title: 'Nivel 2: Estrategia de Pacientes', icon: Users, desc: 'Convertimos contenido informativo en citas reales.' },
        { title: 'Nivel 3: Automatización CRM', icon: Zap, desc: 'Gestión automática de tu agenda y recordatorios.' }
    ];

    const recommendations = isDoctor ? doctorRecommendations : genericRecommendations;

    return (
        <div className="space-y-6 text-center h-full flex flex-col pt-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-24 h-24 bg-gradient-to-br ${isDoctor ? 'from-red-500 to-indigo-600' : 'from-indigo-500 to-purple-600'} rounded-2xl flex flex-col items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20`}
            >
                {isDoctor ? <Activity className="w-8 h-8 text-white mb-1" /> : <Trophy className="w-8 h-8 text-white mb-1" />}
                <span className="text-3xl font-black text-white">Nivel {level}</span>
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">
                    {isDoctor ? (
                        <>Tu Roadmap: <span className="text-red-400 italic">Especialidad Médica</span></>
                    ) : (
                        <>Tu Perfil: <span className="text-indigo-400">Emprendedor Digital</span></>
                    )}
                </h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                    {isDoctor 
                        ? 'Hemos diseñado un sistema de 5 niveles para convertir tus canales digitales en una máquina de atraer pacientes.'
                        : 'Tienes una base sólida. Nuestro sistema ha preparado un plan para llevarte al siguiente nivel de automatización.'
                    }
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left w-full max-w-lg mx-auto relative overflow-hidden group">
                {isDoctor && (
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Stethoscope className="w-24 h-24" />
                    </div>
                )}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    {isDoctor ? 'Plan de Crecimiento Sugerido' : 'Plan de Acción Recomendado'}
                </h3>
                <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                            <div className={`p-2 rounded-lg transition-colors ${
                                isDoctor 
                                ? 'bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white' 
                                : 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'
                            }`}>
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

                {isDoctor && (
                    <a 
                        href="/marketing/medicos" 
                        target="_blank"
                        className="mt-4 block text-center p-3 border border-red-500/30 bg-red-500/10 rounded-xl text-[10px] font-black uppercase text-red-400 hover:bg-red-500 hover:text-white transition-all tracking-[0.2em]"
                    >
                        Ver Estrategia Completa de 5 Niveles
                    </a>
                )}
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


