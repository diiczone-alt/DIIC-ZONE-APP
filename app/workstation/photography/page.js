'use client';

import { useRouter } from 'next/navigation';
import {
    Camera, Users, Heart, Star,
    Briefcase, ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PhotoClientHub() {
    const router = useRouter();

    const sessionTypes = [
        {
            id: 'studio',
            title: 'Fotografía de Estudio',
            desc: 'Retratos, books y sesiones creativas en set profesional.',
            icon: Camera,
            color: 'bg-pink-500',
            textColor: 'text-pink-400'
        },
        {
            id: 'event',
            title: 'Eventos Sociales',
            desc: 'Cobertura de fiestas, lanzamientos y reuniones.',
            icon: Star,
            color: 'bg-purple-500',
            textColor: 'text-purple-400'
        },
        {
            id: 'wedding',
            title: 'Bodas & Love Stories',
            desc: 'Capturamos los momentos más importantes de tu vida.',
            icon: Heart,
            color: 'bg-rose-500',
            textColor: 'text-rose-400'
        },
        {
            id: 'corporate',
            title: 'Corporativo',
            desc: 'Retratos ejecutivos y fotografía de equipo.',
            icon: Briefcase,
            color: 'bg-blue-500',
            textColor: 'text-blue-400'
        },
        {
            id: 'product',
            title: 'Producto / E-commerce',
            desc: 'Fotografía de alta calidad para tu catálogo o tienda.',
            icon: ShoppingBag,
            color: 'bg-green-500',
            textColor: 'text-green-400'
        },
        {
            id: 'brand',
            title: 'Marca Personal',
            desc: 'Eleva tu imagen profesional con fotos estratégicas.',
            icon: Users,
            color: 'bg-orange-500',
            textColor: 'text-orange-400'
        }
    ];

    const handleSelect = (typeId) => {
        // Redirection to the Map/Booking flow with type parameter
        router.push(`/workstation/photography/studios?type=${typeId}`);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Fotografía Profesional</h1>
                    <p className="text-sm text-gray-400">Selecciona el tipo de sesión que deseas agendar.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=client" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-white mb-4">¿Qué vamos a capturar hoy?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Elige una categoría para encontrar los mejores fotógrafos y estudios disponibles cerca de ti.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessionTypes.map((type) => (
                            <motion.button
                                key={type.id}
                                whileHover={{ y: -5 }}
                                onClick={() => handleSelect(type.id)}
                                className="group relative p-8 rounded-3xl bg-[#0E0E18] border border-white/5 hover:border-white/10 text-left overflow-hidden transition-all shadow-lg hover:shadow-2xl"
                            >
                                <div className={`absolute top-0 right-0 p-32 rounded-full ${type.color} blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`} />

                                <div className={`w-14 h-14 rounded-2xl ${type.color}/10 flex items-center justify-center mb-6 border border-white/5 group-hover:border-white/20 transition-colors`}>
                                    <type.icon className={`w-7 h-7 ${type.textColor}`} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed">{type.desc}</p>

                                <div className="mt-6 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                    Agendar Ahora <span aria-hidden="true">&rarr;</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
