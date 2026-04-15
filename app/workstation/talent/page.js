'use client';

import { useRouter } from 'next/navigation';
import {
    Mic2, Camera, Video, UserCheck,
    ShoppingBag, Star, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TalentDashboard() {
    const router = useRouter();

    const categories = [
        {
            id: 'host',
            title: 'Presentadora',
            desc: 'Talento para conducción de video, eventos o TV.',
            icon: Mic2,
            color: 'bg-rose-500',
            textColor: 'text-rose-400'
        },
        {
            id: 'photo_model',
            title: 'Modelo Fotográfica',
            desc: 'Editorial, catálogo, e-commerce o retrato.',
            icon: Camera,
            color: 'bg-violet-500',
            textColor: 'text-violet-400'
        },
        {
            id: 'video_model',
            title: 'Modelo para Video',
            desc: 'Actuación para comerciales, música o cine.',
            icon: Video,
            color: 'bg-blue-500',
            textColor: 'text-blue-400'
        },
        {
            id: 'brand_face',
            title: 'Imagen de Marca',
            desc: 'Embajadoras para campañas de largo plazo.',
            icon: Sparkles,
            color: 'bg-amber-500',
            textColor: 'text-amber-400'
        },
        {
            id: 'event',
            title: 'Eventos / Activación',
            desc: 'Protocolo, anfitrionas y staff premium.',
            icon: Star,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-400'
        },
        {
            id: 'fashion',
            title: 'Moda / Pasarela',
            desc: 'Desfiles y presentaciones de colección.',
            icon: ShoppingBag,
            color: 'bg-pink-500',
            textColor: 'text-pink-400'
        }
    ];

    const handleSelect = (category) => {
        router.push(`/workstation/talent/search?category=${category}`);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Talento & Casting</h1>
                    <p className="text-sm text-gray-400">Selecciona el perfil ideal para tu próximo proyecto.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=client" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-white mb-4">¿Qué talento estás buscando hoy?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Explora nuestro catálogo verificado de profesionales. Desde presentadoras carismáticas hasta modelos de alta costura.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, index) => (
                            <motion.button
                                key={cat.id}
                                whileHover={{ y: -5 }}
                                onClick={() => handleSelect(cat.id)}
                                className="group relative p-8 rounded-3xl bg-[#0E0E18] border border-white/5 hover:border-white/10 text-left overflow-hidden transition-all shadow-lg hover:shadow-2xl"
                            >
                                <div className={`absolute top-0 right-0 p-32 rounded-full ${cat.color} blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`} />

                                <div className={`w-14 h-14 rounded-2xl ${cat.color}/10 flex items-center justify-center mb-6 border border-white/5 group-hover:border-white/20 transition-colors`}>
                                    <cat.icon className={`w-7 h-7 ${cat.textColor}`} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed">{cat.desc}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
