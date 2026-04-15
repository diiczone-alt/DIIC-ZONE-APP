'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Building2, Clapperboard, Check, Shield, Zap, Star, ArrowRight } from 'lucide-react';

export default function StrategicProfileStep({ onNext, updateData }) {
    const [data, setData] = useState({
        name: '',
        brandName: '',
        profileType: '', // persona, pro, business, creator
        userMode: '', // basic, operator, full
        goal: '',
        mainService: ''
    });

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const isComplete = data.name && data.profileType && data.userMode && data.goal && data.mainService;

    const profileTypes = [
        { id: 'persona', label: 'Marca Personal', icon: User },
        { id: 'pro', label: 'Profesional', icon: Briefcase },
        { id: 'business', label: 'Negocio/Empresa', icon: Building2 },
        { id: 'creator', label: 'Creador/Influencer', icon: Clapperboard }
    ];

    const userModes = [
        {
            id: 'basic',
            title: 'Explorador',
            desc: 'Solo quiero conocer la plataforma.',
            icon: Shield,
            features: ['Zona Creativa Básica', 'Sin CRM', 'Sin Automatizaciones'],
            color: 'border-gray-600 bg-gray-800/50'
        },
        {
            id: 'operator',
            title: 'Modo Operador',
            desc: 'Quiero herramientas profesionales a mi medida.',
            icon: Zap,
            features: ['Pago por Herramienta', 'CRM Opcional', 'Control Total'],
            color: 'border-blue-500 bg-blue-500/10'
        },
        {
            id: 'full',
            title: 'Plan Completo',
            desc: 'Quiero que el equipo DIIC ZONE trabaje para mí.',
            icon: Star,
            features: ['Ecosistema Completo', 'Consultoría', 'Máxima Prioridad'],
            color: 'border-purple-500 bg-purple-500/10'
        }
    ];

    const goals = [
        'Conseguir más clientes',
        'Posicionar mi marca',
        'Automatizar ventas',
        'Crear contenido viral',
        'Organizar mi negocio'
    ];

    return (
        <div className="max-w-4xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-20">
            <div className="space-y-2 mb-8 text-center md:text-left">
                <h2 className="text-3xl font-black text-white">Perfil Estratégico</h2>
                <p className="text-gray-400">Configura tu experiencia en DIIC ZONE.</p>
            </div>

            <div className="space-y-12">
                {/* BLOQUE 1: IDENTIDAD */}
                <section className="space-y-6">
                    <h3 className="text-lg font-bold text-indigo-400 border-b border-indigo-500/20 pb-2">1. Identidad</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Tu Nombre</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full bg-[#0A0A12] border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Nombre de Marca (Opcional)</label>
                            <input
                                type="text"
                                value={data.brandName}
                                onChange={(e) => handleChange('brandName', e.target.value)}
                                className="w-full bg-[#0A0A12] border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="Ej: JP Consulting"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Tipo de Perfil</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {profileTypes.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => handleChange('profileType', type.id)}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${data.profileType === type.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                                >
                                    <type.icon className="w-6 h-6" />
                                    <span className="text-sm font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BLOQUE 2: MODO DE USO */}
                <section className="space-y-6">
                    <h3 className="text-lg font-bold text-indigo-400 border-b border-indigo-500/20 pb-2">2. Modo de Uso</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {userModes.map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => handleChange('userMode', mode.id)}
                                className={`relative p-6 rounded-2xl border text-left transition-all hover:scale-[1.02] ${data.userMode === mode.id ? `${mode.color} ring-2 ring-offset-2 ring-offset-black ring-${mode.color.split('-')[1]}-500` : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'}`}
                            >
                                <div className={`p-3 rounded-lg w-fit mb-4 ${data.userMode === mode.id ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                                    <mode.icon className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-white text-lg mb-1">{mode.title}</h4>
                                <p className="text-xs text-gray-400 mb-4 h-8">{mode.desc}</p>
                                <ul className="space-y-2">
                                    {mode.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                            {data.userMode === mode.id ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-1 h-1 bg-gray-500 rounded-full" />}
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </button>
                        ))}
                    </div>
                </section>

                {/* BLOQUE 3: OBJETIVO */}
                <section className="space-y-6">
                    <h3 className="text-lg font-bold text-indigo-400 border-b border-indigo-500/20 pb-2">3. Objetivo Principal</h3>
                    <div className="grid md:grid-cols-3 gap-3">
                        {goals.map(g => (
                            <button
                                key={g}
                                onClick={() => handleChange('goal', g)}
                                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${data.goal === g ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </section>

                {/* BLOQUE 4: SERVICIO ESTRELLA */}
                <section className="space-y-6">
                    <h3 className="text-lg font-bold text-indigo-400 border-b border-indigo-500/20 pb-2">4. Producto/Servicio Estrella</h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <label className="text-sm text-gray-400 block mb-2">¿Qué es lo que más vendes o quieres vender?</label>
                        <input
                            type="text"
                            value={data.mainService}
                            onChange={(e) => handleChange('mainService', e.target.value)}
                            className="w-full bg-transparent border-none text-white text-lg placeholder-gray-600 focus:ring-0 focus:outline-none"
                            placeholder="Ej: Consultas 1 a 1, Curso de Marketing, Diseño Web..."
                        />
                    </div>
                </section>

                {/* BLOQUE 5: GUARDADO */}
                <div className="pt-8">
                    <button
                        onClick={() => { updateData({ strategicProfile: data }); onNext(); }}
                        disabled={!isComplete}
                        className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:scale-[1.01] transition-all shadow-xl shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        Guardar Perfil Estratégico
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        El sistema clasificará tu nivel y activará los módulos correspondientes automáticamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
