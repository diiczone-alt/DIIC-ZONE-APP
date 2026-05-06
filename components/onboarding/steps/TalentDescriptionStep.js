'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const ROLE_CONFIG = {
    editor: {
        title: 'Maestría en Edición',
        placeholder: 'Ej: Soy editor especializado en storytelling para marcas de lujo, manejo After Effects y DaVinci Resolve para lograr un look cinematográfico...',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20'
    },
    filmmaker: {
        title: 'Visión de Realizador',
        placeholder: 'Ej: Filmmaker con equipo propio (Sony A7SIII), experto en iluminación y dirección de arte para videoclips y comerciales de alto impacto...',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
    },
    designer: {
        title: 'Genio Creativo',
        placeholder: 'Ej: Diseñador senior especializado en branding y UI/UX. Dominio experto de Adobe Suite y Figma. Enfocado en identidades visuales disruptivas...',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20'
    },
    community: {
        title: 'Estratega Social',
        placeholder: 'Ej: Community Manager con 4 años de experiencia escalando marcas. Experto en copywriting persuasivo, pauta digital y gestión de crisis...',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
    },
    audio: {
        title: 'Ingeniería Sonora',
        placeholder: 'Ej: Locutor y productor de audio. Experto en diseño sonoro, mezcla y mastering para podcasts y publicidad radial...',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20'
    },
    photo: {
        title: 'Estética Visual',
        placeholder: 'Ej: Fotógrafo de moda y producto. Experto en retoque digital, iluminación de estudio y dirección de modelos para catálogos...',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20'
    },
    model: {
        title: 'Talento de Imagen',
        placeholder: 'Ej: Modelo profesional con experiencia en pasarela, comerciales y fotografía de marca. Manejo de diferentes registros y poses...',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20'
    },
    web: {
        title: 'Arquitectura Digital',
        placeholder: 'Ej: Desarrollador Fullstack experto en React, Next.js y ecosistemas escalables. Enfocado en performance y experiencias de usuario...',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20'
    },
    print: {
        title: 'Artes Gráficas',
        placeholder: 'Ej: Especialista en producción impresa, manejo de sustratos, acabados especiales y preprensa para gran formato...',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20'
    },
    event: {
        title: 'Producción de Eventos',
        placeholder: 'Ej: Productor ejecutivo con experiencia en festivales y eventos corporativos. Gestión de logística, técnica y proveedores...',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
    }
};

export default function TalentDescriptionStep({ onNext, updateData, data }) {
    const role = data?.role || 'editor';
    const config = ROLE_CONFIG[role] || ROLE_CONFIG.editor;
    const [description, setDescription] = useState('');

    const handleContinue = () => {
        if (description.length < 10) return;
        updateData({ description });
        onNext();
    };

    return (
        <div className="space-y-8 text-center max-w-2xl mx-auto w-full">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-4 border ${config.border}`}
            >
                <Sparkles className={`w-10 h-10 ${config.color}`} />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    {config.title}
                </h2>
                <p className="text-gray-400 text-lg">¿En qué te destacas? Esto nos ayudará a situarte en el flujo y nodo ideal para ti.</p>
            </div>

            <div className="relative group">
                <textarea
                    autoFocus
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={config.placeholder}
                    className={`w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg focus:outline-none focus:${config.border.split('-')[1]} transition-all resize-none custom-scrollbar shadow-2xl`}
                />
                <div className="absolute bottom-4 right-6 text-xs text-gray-500 font-mono">
                    {description.length} caracteres (mín. 10)
                </div>
            </div>

            <button
                onClick={handleContinue}
                disabled={description.length < 10}
                className={`w-full py-5 rounded-[28px] font-black text-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest ${
                    description.length >= 10 
                    ? 'bg-white text-black hover:scale-[1.02] shadow-xl shadow-white/10' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                }`}
            >
                Vincular Nodo
                <ArrowRight className="w-6 h-6" />
            </button>
        </div>
    );
}
