'use client';

import { use } from 'react';
import {
    ChevronLeft, Star, MapPin, CheckCircle,
    Instagram, Twitter, Video, Camera, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TalentProfile({ params }) {
    const { id } = use(params);
    const router = useRouter();

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-16 border-b border-white/5 flex items-center gap-4 px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex-1">
                    <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Volver a Búsqueda</h1>
                </div>
                <button className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all text-sm">
                    Reservar Talento
                </button>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Photos & Bio */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Hero Image */}
                        <div className="h-[500px] rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                                className="w-full h-full object-cover"
                                alt="Profile Hero"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/50 to-transparent">
                                <h1 className="text-4xl font-black text-white mb-2">Valentina R.<span className="text-orange-500">.</span></h1>
                                <p className="text-xl text-gray-200 font-medium">Presentadora TV • Host de Eventos • Bilingüe</p>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-orange-400" /> Portafolio
                            </h2>
                            <div className="grid grid-cols-3 gap-4 h-64">
                                <div className="rounded-xl overflow-hidden bg-gray-800 border border-white/5">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                                </div>
                                <div className="rounded-xl overflow-hidden bg-gray-800 border border-white/5">
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                                </div>
                                <div className="rounded-xl overflow-hidden bg-gray-800 border border-white/5 relative group cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold text-sm">+12 Fotos</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="bg-[#0E0E18] rounded-3xl p-8 border border-white/5">
                            <h2 className="text-xl font-bold text-white mb-6">Experiencia Reciente</h2>
                            <div className="space-y-6">
                                <ExperienceItem
                                    role="Host Principal"
                                    event="Tech Summit 2025"
                                    date="Ene 2025"
                                    desc="Conducción de evento para 500pax, idioma inglés."
                                />
                                <ExperienceItem
                                    role="Imagen de Marca"
                                    event="Campaña Verano 'Luxe'"
                                    date="Dic 2024"
                                    desc="Sesión fotográfica y video reels para redes sociales."
                                />
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Info & Stats */}
                    <div className="space-y-6">

                        {/* Stats Card */}
                        <div className="bg-[#0E0E18] rounded-3xl p-6 border border-white/5 space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Nivel</span>
                                <span className="font-bold text-white bg-white/10 px-2 py-1 rounded">PRO</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Reputación</span>
                                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                                    <Star className="w-4 h-4 fill-current" /> 5.0
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Ubicación</span>
                                <span className="text-white font-medium flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> CDMX
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Idiomas</span>
                                <span className="text-white font-medium">Español, Inglés</span>
                            </div>

                            <hr className="border-white/5" />

                            <div className="flex gap-4 justify-center">
                                <SocialButton icon={Instagram} />
                                <SocialButton icon={Twitter} />
                                <SocialButton icon={Video} link />
                            </div>
                        </div>

                        {/* Characteristics */}
                        <div className="bg-[#0E0E18] rounded-3xl p-6 border border-white/5">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Características</h3>
                            <div className="flex flex-wrap gap-2">
                                {['1.70m', 'Ojos Cafés', 'Cabello Castaño', 'Tez Clara', 'Talla S'].map((tag, i) => (
                                    <span key={i} className="text-xs bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/20">
                            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Disponible
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Agenda abierta para proyectos la próxima semana. Respuesta promedio: 2 horas.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

function ExperienceItem({ role, event, date, desc }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mb-1" />
                <div className="w-0.5 h-full bg-white/5" />
            </div>
            <div>
                <h4 className="text-white font-bold text-base">{role}</h4>
                <p className="text-orange-400 text-sm font-medium mb-1">{event} • {date}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function SocialButton({ icon: Icon, link }) {
    return (
        <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${link ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}`}>
            <Icon className="w-5 h-5" />
        </button>
    );
}
