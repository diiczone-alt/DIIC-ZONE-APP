'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, Star, Award, MessageSquare, CheckCircle, Shield,
    TrendingUp, Heart, Sparkles, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import WorkstationProfileDropdown from '@/components/workstation/WorkstationProfileDropdown';

const MOCK_REVIEWS = [
    { id: 1, author: 'Carlos R. (DIIC Media)', comment: 'La calidad del mix del podcast es excelente. Entregó 2 horas antes de lo planeado y con todas las respiraciones eliminadas.', rating: 5, date: 'Hace 3 días' },
    { id: 2, author: 'Ana M. (EcoStore)', comment: 'Muy buena comunicación y excelente disposición para cambiar los niveles de volumen. Recomendado.', rating: 4.8, date: 'Hace 1 semana' },
];

export default function AudioReputationPage() {
    const router = useRouter();
    const [likes, setLikes] = useState(24);
    const [hasLiked, setHasLiked] = useState(false);

    const handleLike = () => {
        if (!hasLiked) {
            setLikes(likes + 1);
            setHasLiked(true);
            toast.success('¡Gracias por el reconocimiento!');
        } else {
            setLikes(likes - 1);
            setHasLiked(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500 fill-current" /> Mi Reputación
                        </h1>
                        <p className="text-xs text-gray-400">Puntaje, medallas de especialidad y valoraciones de clientes</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <WorkstationProfileDropdown role="Audio" />
                </div>
            </header>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Score Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Rating Card */}
                        <div className="bg-[#0e0e1a] border border-white/5 rounded-2xl p-6 text-center space-y-2">
                            <Star className="w-8 h-8 text-amber-500 fill-amber-500 mx-auto animate-pulse" />
                            <div className="text-3xl font-black text-white">4.9 / 5.0</div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Valoración General</p>
                            <p className="text-[10px] text-gray-400">Basada en 18 proyectos calificados</p>
                        </div>

                        {/* Completed Projects */}
                        <div className="bg-[#0e0e1a] border border-white/5 rounded-2xl p-6 text-center space-y-2">
                            <Award className="w-8 h-8 text-violet-400 mx-auto" />
                            <div className="text-3xl font-black text-white">24</div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mixes Completados</p>
                            <p className="text-[10px] text-gray-400">100% de tasa de entrega exitosa</p>
                        </div>

                        {/* Endorsements / Likes */}
                        <div 
                            onClick={handleLike}
                            className={`border rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-all ${hasLiked ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0e0e1a] border-white/5 hover:border-red-500/20'}`}
                        >
                            <Heart className={`w-8 h-8 mx-auto transition-colors ${hasLiked ? 'text-red-500 fill-current' : 'text-gray-500 group-hover:text-red-500'}`} />
                            <div className="text-3xl font-black text-white">{likes}</div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Recomendaciones</p>
                            <p className="text-[10px] text-gray-400">{hasLiked ? '¡Has recomendado este perfil!' : 'Haz clic para apoyar al perfil'}</p>
                        </div>
                    </div>

                    {/* Specialty Badges */}
                    <div className="bg-[#0e0e1a] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-violet-400" /> Medallas de Desempeño
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: 'Oído de Oro', desc: 'Precisión técnica', color: 'from-amber-400 to-amber-600', icon: Sparkles },
                                { title: 'Bala Mixer', desc: 'Entregas ultra rápidas', color: 'from-violet-400 to-violet-600', icon: TrendingUp },
                                { title: 'Cero Ruido', desc: 'Limpieza de pistas impecable', color: 'from-emerald-400 to-emerald-600', icon: CheckCircle },
                                { title: 'Académico', desc: 'Cursos completados', color: 'from-blue-400 to-blue-600', icon: BookOpen }
                            ].map((badge, i) => (
                                <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2 group hover:border-white/10 transition-colors">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-black shadow-lg shadow-white/5`}>
                                        <badge.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-bold text-white text-xs mt-1">{badge.title}</h4>
                                    <p className="text-[10px] text-gray-500">{badge.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Comentarios Recientes
                        </h3>
                        <div className="space-y-4">
                            {MOCK_REVIEWS.map(rev => (
                                <div key={rev.id} className="bg-[#0e0e1a] border border-white/5 rounded-xl p-6 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                                        <span className="text-[10px] text-gray-500">{rev.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">"{rev.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
