'use client';

import { motion } from 'framer-motion';
import { Mic, Music, FileAudio, Headphones, Bot } from 'lucide-react';

export default function AudioWelcome({ onSelect }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#050511] via-[#0E0E18] to-black z-0" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full relative z-10"
            >
                {/* Robot Assistant Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
                        <Bot className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            HOLA, SOY <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">AUDITION PRO</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl">
                            Soy tu Productor de Audio en DIIC ZONE. Aquí puedes grabar, editar y producir contenido sonoro de nivel estudio.
                            <br /><span className="text-white font-bold">¿Qué deseas hacer hoy?</span>
                        </p>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <OptionCard
                        icon={Mic}
                        title="Grabar Audio Ahora"
                        desc="Usa nuestra grabadora integrada para podcasts o notas de voz."
                        color="text-orange-400"
                        bg="bg-orange-500/10"
                        border="border-orange-500/20"
                        onClick={() => onSelect('record')}
                    />
                    <OptionCard
                        icon={Headphones}
                        title="Solicitar Grabación Pro"
                        desc="Agenda una sesión en estudio o pide una locución profesional."
                        color="text-red-400"
                        bg="bg-red-500/10"
                        border="border-red-500/20"
                        onClick={() => onSelect('request')}
                    />
                    <OptionCard
                        icon={Music}
                        title="Editar Audio Existente"
                        desc="Sube tus archivos para limpieza, mezcla o masterización."
                        color="text-purple-400"
                        bg="bg-purple-500/10"
                        border="border-purple-500/20"
                        onClick={() => onSelect('edit')}
                    />
                    <OptionCard
                        icon={FileAudio}
                        title="Mi Biblioteca"
                        desc="Gestiona y descarga todos tus proyectos de audio."
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                        border="border-blue-500/20"
                        onClick={() => onSelect('library')}
                    />
                </div>
            </motion.div>
        </div>
    );
}

function OptionCard({ icon: Icon, title, desc, color, bg, border, onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`flex items-start gap-4 p-6 rounded-2xl bg-[#12121f] border ${border} text-left transition-all group`}
        >
            <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </motion.button>
    );
}
