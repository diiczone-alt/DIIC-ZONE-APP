'use client';

import { motion } from 'framer-motion';
import {
    LayoutGrid, Users, Building2, Command,
    ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ModeSelectionScreen() {
    const router = useRouter();

    const handleSelectMode = (mode) => {
        if (mode === 'HQ') {
            router.push('/dashboard/hq');
        } else {
            router.push('/dashboard?role=CLIENT');
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />

            <div className="max-w-5xl w-full relative z-10">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                    >
                        ¿Cómo vas a usar DIIC ZONE hoy?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg"
                    >
                        Selecciona tu entorno de trabajo para iniciar el sistema operativo.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* HQ Option */}
                    <ModeCard
                        title="Centro de Operaciones"
                        subtitle="Equipo DIIC ZONE (HQ)"
                        description="Gestiona clientes, campañas, producción y rentabilidad de la agencia."
                        icon={Command}
                        color="indigo"
                        features={['Vista de Dios', 'Gestión de Proyectos', 'Métricas de Agencia']}
                        onClick={() => handleSelectMode('HQ')}
                    />

                    {/* Client Option */}
                    <ModeCard
                        title="Modo Cliente"
                        subtitle="Experiencia de Usuario"
                        description="Visualiza el crecimiento de marca, entregables y progreso de proyectos."
                        icon={Users}
                        color="purple"
                        features={['Dashboard de Marca', 'Aprobación de Contenido', 'Resultados en Vivo']}
                        onClick={() => handleSelectMode('CLIENT')}
                    />
                </div>
            </div>
        </div>
    );
}

function ModeCard({ title, subtitle, description, icon: Icon, color, features, onClick }) {
    const colors = {
        indigo: 'hover:border-indigo-500/50 hover:shadow-indigo-500/20 group-hover:text-indigo-400',
        purple: 'hover:border-purple-500/50 hover:shadow-purple-500/20 group-hover:text-purple-400',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`text-left p-8 rounded-[2rem] bg-[#0E0E18] border border-white/10 relative overflow-hidden group transition-all duration-300 ${colors[color]}`}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>

                <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{subtitle}</span>
                </div>

                <h2 className="text-3xl font-black text-white mb-4 group-hover:text-white transition-colors">
                    {title}
                </h2>
                <p className="text-gray-400 mb-8 min-h-[48px]">
                    {description}
                </p>

                <div className="space-y-3 mb-8">
                    {features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                            <ShieldCheck className="w-4 h-4 opacity-50" />
                            <span>{feat}</span>
                        </div>
                    ))}
                </div>

                <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${color === 'indigo' ? 'text-indigo-400' : 'text-purple-400'}`}>
                    Ingresar al Sistema <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.button>
    );
}
