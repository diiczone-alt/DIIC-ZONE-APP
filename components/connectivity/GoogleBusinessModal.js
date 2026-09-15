'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X, MapPin, Star, Phone, Navigation, Eye, MessageSquare,
    Sparkles, CheckCircle2, RefreshCw, ShieldCheck, ExternalLink,
    Send, ThumbsUp, TrendingUp, Search
} from 'lucide-react';
import { toast } from 'sonner';

export default function GoogleBusinessModal({
    isOpen,
    onClose,
    clientName = 'Dr. Oscar Cujilema - Traumatología & Artroscopía',
    location = 'Riobamba, Ecuador'
}) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews' | 'seo' | 'settings'
    const [reviewFilter, setReviewFilter] = useState('all');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [generatingReply, setGeneratingReply] = useState(false);

    if (!isOpen) return null;

    const stats = {
        rating: 4.9,
        totalReviews: 128,
        searchViews: '18.4K',
        mapsViews: '12.6K',
        directionRequests: 342,
        phoneCalls: 189,
        websiteClicks: 512
    };

    const reviews = [
        {
            id: 'rev_1',
            author: 'Carlos Andrade',
            date: 'Hace 2 días',
            rating: 5,
            comment: 'Excelente atención del Dr. Cujilema. Me realizó una artroscopía de hombro y el dolor desapareció por completo en pocas semanas. Muy recomendado en Riobamba.',
            status: 'unreplied',
            sentiment: 'Positivo (Cirugía exitosa)'
        },
        {
            id: 'rev_2',
            author: 'Mariana Valencia',
            date: 'Hace 1 semana',
            rating: 5,
            comment: 'Tenía un problema de menisco en la rodilla izquierda. La explicación médica fue clarísima y el tratamiento con plasma me evitó una cirugía invasiva. ¡Gracias doctor!',
            status: 'replied',
            reply: 'Estimada Mariana, muchas gracias por su confianza. Me alegra mucho que su recuperación de rodilla haya sido tan favorable. ¡Estamos a las órdenes!',
            sentiment: 'Positivo (Tratamiento conservador)'
        },
        {
            id: 'rev_3',
            author: 'Fernando Guamán',
            date: 'Hace 2 semanas',
            rating: 5,
            comment: 'Instalaciones impecables y puntualidad en la cita médica. Se nota la especialización y experiencia en traumatología deportiva.',
            status: 'unreplied',
            sentiment: 'Positivo (Atención clínica)'
        }
    ];

    const handleGenerateAIReply = (review) => {
        setReplyingTo(review.id);
        setGeneratingReply(true);
        setTimeout(() => {
            setReplyText(`Estimado/a ${review.author}, agradezco sinceramente sus amables palabras y su confianza en nuestro servicio médico. Nuestro compromiso siempre es su pronta recuperación y bienestar. ¡Un cordial saludo! - Dr. Oscar Cujilema`);
            setGeneratingReply(false);
        }, 600);
    };

    const handleSendReply = (reviewId) => {
        toast.success('Respuesta oficial publicada en Google Maps');
        setReplyingTo(null);
        setReplyText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className="bg-[#090A16] border border-white/10 rounded-[2.5rem] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
                {/* Background Glow */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#4285F4] blur-[120px] rounded-full opacity-15 pointer-events-none" />

                {/* HEADER */}
                <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 bg-[#090A16]/90">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4285F4] via-[#34A853] to-[#FBBC05] p-[1px] shadow-lg shadow-black/50">
                            <div className="w-full h-full bg-[#08081a] rounded-2xl flex items-center justify-center">
                                <svg className="w-7 h-7 text-[#4285F4] fill-current" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black italic tracking-tight text-white uppercase">Google My Business & Maps</h2>
                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verificado
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mt-0.5">
                                <span className="text-blue-400 font-semibold">{clientName}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-300 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-pink-400" /> {location}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 rounded-2xl border border-white/10 text-gray-400 transition-all active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="px-6 md:px-8 border-b border-white/10 bg-[#060712] flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'overview', label: '📍 Rendimiento Local & Maps', icon: MapPin },
                        { id: 'reviews', label: '⭐ Reseñas & Auto-Respuesta IA', icon: Star },
                        { id: 'seo', label: '🔍 Palabras Clave & Búsqueda', icon: Search }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-4 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 border-b-2 whitespace-nowrap ${
                                    isActive
                                        ? 'border-blue-500 text-white bg-blue-500/10'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* CONTENT */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> Calificación
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-black text-amber-400 italic">{stats.rating}</p>
                                        <span className="text-xs font-bold text-gray-400">({stats.totalReviews} reseñas)</span>
                                    </div>
                                    <span className="text-[10px] text-emerald-400 font-bold">100% 5 estrellas este mes</span>
                                </div>

                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5 text-blue-400" /> Vistas en Google Maps
                                    </p>
                                    <p className="text-3xl font-black text-white italic">{stats.mapsViews}</p>
                                    <span className="text-[10px] text-emerald-400 font-bold">+24.2% vs mes anterior</span>
                                </div>

                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Navigation className="w-3.5 h-3.5 text-pink-400" /> Solicitudes de Ruta
                                    </p>
                                    <p className="text-3xl font-black text-pink-400 italic">{stats.directionRequests}</p>
                                    <span className="text-[10px] text-gray-400 font-bold">Pacientes en camino</span>
                                </div>

                                <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-emerald-400" /> Llamadas Directas
                                    </p>
                                    <p className="text-3xl font-black text-emerald-400 italic">{stats.phoneCalls}</p>
                                    <span className="text-[10px] text-emerald-400 font-bold">Clics a botón de llamada</span>
                                </div>
                            </div>

                            {/* Local SEO Status Box */}
                            <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                            Posicionamiento Local Destacado (Top 3 en Riobamba)
                                        </h4>
                                        <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                                            La ficha del <strong className="text-white">Dr. Oscar Cujilema</strong> aparece en las 3 primeras posiciones cuando los pacientes buscan <span className="text-blue-300 font-bold">&quot;traumatologo en riobamba&quot;</span> y <span className="text-blue-300 font-bold">&quot;especialista en rodilla&quot;</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: REVIEWS */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-400 fill-current" /> Reseñas Recientes de Pacientes
                                </h3>
                                <span className="text-xs text-gray-400 font-bold">128 Reseñas Verificadas</span>
                            </div>

                            <div className="space-y-4">
                                {reviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-4"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-white">{rev.author}</span>
                                                    <span className="text-[10px] text-gray-500 font-mono">{rev.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    {[...Array(rev.rating)].map((_, i) => (
                                                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full">
                                                {rev.sentiment}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-300 leading-relaxed italic bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                            &quot;{rev.comment}&quot;
                                        </p>

                                        {rev.status === 'replied' ? (
                                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-1">
                                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Respuesta Oficial de la Clínica:
                                                </p>
                                                <p className="text-xs text-gray-200">{rev.reply}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 pt-2">
                                                {replyingTo === rev.id ? (
                                                    <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                <Sparkles className="w-3.5 h-3.5" /> Respuesta Generada por IA Médica
                                                            </span>
                                                        </div>
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            rows={3}
                                                            className="w-full bg-[#050510] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setReplyingTo(null)}
                                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendReply(rev.id)}
                                                                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase text-white flex items-center gap-2"
                                                            >
                                                                <Send className="w-3.5 h-3.5" /> Publicar en Google Maps
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleGenerateAIReply(rev)}
                                                            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                                                        >
                                                            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Auto-Responder con IA
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SEO */}
                    {activeTab === 'seo' && (
                        <div className="space-y-6">
                            <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-4">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Search className="w-4 h-4 text-blue-400" /> Búsquedas donde aparece tu Ficha de Google
                                </h3>

                                <div className="space-y-3">
                                    {[
                                        { keyword: 'traumatologo en riobamba', rank: '#1', searches: '4.8K / mes' },
                                        { keyword: 'artroscopia de hombro ecuador', rank: '#2', searches: '2.1K / mes' },
                                        { keyword: 'infiltracion acido hialuronico rodilla', rank: '#1', searches: '1.9K / mes' },
                                        { keyword: 'dr oscar cujilema', rank: '#1', searches: '1.4K / mes' }
                                    ].map((k, i) => (
                                        <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-black text-white font-mono">&quot;{k.keyword}&quot;</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{k.searches}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-xl">
                                                {k.rank} Posición
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
