'use client';

import { motion } from 'framer-motion';
import { Cloud, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function StorageSelectorStep({ onNext, updateData }) {
    const [selected, setSelected] = useState('google'); // Default Google Drive

    const clouds = [
        {
            id: 'google',
            name: 'Google Drive',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
            ),
            description: 'Sincronización nativa y carpetas automáticas.',
            active: true
        },
        {
            id: 'dropbox',
            name: 'Dropbox',
            icon: <div className="w-8 h-8 text-blue-500"><Cloud /></div>,
            description: 'Próximamente disponible.',
            active: false
        },
        {
            id: 'onedrive',
            name: 'OneDrive',
            icon: <div className="w-8 h-8 text-blue-400"><Cloud /></div>,
            description: 'Próximamente disponible.',
            active: false
        }
    ];

    const handleContinue = () => {
        if (selected) {
            updateData({ preferred_storage: selected });
            onNext();
        }
    };

    return (
        <div className="space-y-12 text-center h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="space-y-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center"
                >
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                        <Cloud className="text-indigo-400 w-8 h-8" />
                    </div>
                </motion.div>
                
                <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl md:text-5xl font-black text-white tracking-tight"
                >
                    Conéctate con tu <span className="text-indigo-400">Nube</span>
                </motion.h2>
                <p className="text-gray-400 text-lg">
                    Selecciona tu almacenamiento principal para organizar tus recursos creativos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4">
                {clouds.map((cloud) => (
                    <motion.button
                        key={cloud.id}
                        whileHover={cloud.active ? { scale: 1.02, translateY: -5 } : {}}
                        whileTap={cloud.active ? { scale: 0.98 } : {}}
                        onClick={() => cloud.active && setSelected(cloud.id)}
                        className={`relative p-6 rounded-[2rem] border transition-all text-left flex flex-col items-center gap-4 ${
                            selected === cloud.id 
                                ? 'bg-white/10 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]' 
                                : 'bg-black/20 border-white/5 hover:border-white/10'
                        } ${!cloud.active && 'opacity-40 cursor-not-allowed'}`}
                    >
                        {selected === cloud.id && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}
                        
                        <div className={`p-4 rounded-2xl ${selected === cloud.id ? 'bg-indigo-500/10' : 'bg-white/5'}`}>
                            {cloud.icon}
                        </div>
                        
                        <div className="text-center">
                            <h3 className="font-black text-white text-sm mb-1">{cloud.name}</h3>
                            <p className="text-[10px] text-gray-500 leading-tight uppercase tracking-tight">{cloud.description}</p>
                        </div>
                    </motion.button>
                ))}
            </div>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onClick={handleContinue}
                className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
                Vincular Almacenamiento
                <ArrowRight className="inline-block ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
        </div>
    );
}
