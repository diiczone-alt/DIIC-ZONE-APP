'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Compass, Star, Zap, Rocket, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

const LEVELS = [
    {
        id: 'presencia',
        title: 'Presencia Digital',
        icon: Leaf,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        desc: 'Para quienes inician. Objetivo: Dar a conocer tu oferta rápidamente y generar confianza básica.',
        content: 'Frecuencia alta, Reels virales, Carruseles educativos simples.',
        complexity: 'Baja'
    },
    {
        id: 'estrategia',
        title: 'Estrategia',
        icon: Compass,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        desc: 'Construyendo sistemas. Objetivo: Captación de leads (Lead Magnets) y funnels iniciales.',
        content: 'Frecuencia media, Masterclasses, Casos de estudio, PDFs.',
        complexity: 'Media'
    },
    {
        id: 'marca',
        title: 'Marca',
        icon: Star,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        desc: 'Consolidando autoridad. Objetivo: Vender High Ticket y posicionar como el #1 del nicho.',
        content: 'Frecuencia estratégica, Eventos VSL, Documentales, PR digital.',
        complexity: 'Alta'
    },
    {
        id: 'automatizacion',
        title: 'Automatización',
        icon: Zap,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        desc: 'Delegando al sistema. Objetivo: Reducir costo de adquisición con IA y flujos automáticos.',
        content: 'Anuncios perennes, Bots integrados, Secuencias automatizadas.',
        complexity: 'Avanzada'
    },
    {
        id: 'escala',
        title: 'Escala',
        icon: Rocket,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        desc: 'Crecimiento exponencial. Objetivo: Dominar múltiples canales y maximizar LTV (Valor de Vida).',
        content: 'Contenido Omnicanal, Creación de productos escalables.',
        complexity: 'Maestro'
    }
];

export default function ClientGrowthLevel({ initialLevel = 'presencia' }) {
    const { user } = useAuth();
    const clientId = user?.client_id || 1;
    const [currentLevel, setCurrentLevel] = useState(initialLevel);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadLevel = async () => {
            const client = await agencyService.getClientById(clientId);
            if (client?.metadata?.maturity_level) {
                setCurrentLevel(client.metadata.maturity_level);
            }
        };
        loadLevel();
    }, []);

    const handleSelect = async (id) => {
        setCurrentLevel(id);
    };

    const handleSaveLevel = async () => {
        setIsSaving(true);
        try {
            await agencyService.updateClient(clientId, {
                metadata: {
                    maturity_level: currentLevel
                }
            });
            toast.success("Nivel de crecimiento actualizado");
        } catch (error) {
            toast.error("Error al guardar nivel");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 pb-16">
            <div className="space-y-4 text-center pb-8 border-b border-white/5 mb-12">
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
                    Capa 2: Madurez del Negocio
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                    Nivel de <span className="text-blue-500">Crecimiento</span>
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
                    Selecciona la etapa actual de tu modelo de negocio para que la IA adapte el tipo y la complejidad del contenido sugerido en tus estrategias.
                </p>
            </div>

            <div className="grid gap-6">
                {LEVELS.map((level, idx) => {
                    const isSelected = currentLevel === level.id;
                    return (
                        <motion.div 
                            key={level.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleSelect(level.id)}
                            className={`group cursor-pointer flex flex-col md:flex-row items-center justify-between p-8 rounded-[32px] border transition-all duration-300 ${
                                isSelected 
                                ? `${level.bg} ${level.border} shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-[1.02]` 
                                : 'bg-[#0A0A0F] border-white/5 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-start gap-6 w-full">
                                <div className={`p-4 rounded-2xl ${isSelected ? level.color : 'text-gray-500 bg-white/5 group-hover:text-white transition-colors'}`}>
                                    <level.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-4">
                                        <h3 className={`text-2xl font-black uppercase italic tracking-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                            {idx + 1}. {level.title}
                                        </h3>
                                        {isSelected && <CheckCircle2 className={`w-5 h-5 ${level.color}`} />}
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium max-w-2xl">
                                        {level.desc}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Contenido Sugerido</div>
                                            <div className="text-xs font-bold text-gray-300 pr-4">{level.content}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Complejidad</div>
                                            <div className={`text-xs font-black uppercase ${level.color}`}>{level.complexity}</div>
                                        </div>
                                    </div>
                                    
                                    {isSelected && (
                                         <div className="mt-6 pt-6 border-t border-white/10 hidden md:block">
                                             <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveLevel();
                                                }}
                                                disabled={isSaving}
                                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white/5 border border-white/5 ${level.color} hover:bg-white/10 transition-colors disabled:opacity-50`}
                                            >
                                                 {isSaving ? 'Guardando...' : 'Elegir Nivel'}
                                             </button>
                                         </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
