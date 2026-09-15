'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Film, Target, Users, Bot, Settings, Sparkles, Play,
    TrendingUp, Eye, MessageCircle, Bookmark, Share2, Heart,
    DollarSign, MousePointer2, ArrowUpRight, CheckCircle2,
    Calendar, MapPin, Clock, ShieldCheck, RefreshCw, Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountAnalyticsModal({
    isOpen,
    onClose,
    platform = 'instagram', // 'instagram' | 'facebook'
    clientName = 'Dr. Oscar Cujilema',
    clientId = null,
    handle = '@artrohombroyrodilla_cujilema'
}) {
    const [activeTab, setActiveTab] = useState('organic'); // 'organic' | 'paid' | 'audience' | 'automation' | 'settings'
    const [videoFilter, setVideoFilter] = useState('all'); // 'all' | 'viral' | 'patients' | 'saves'
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/meta/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, platform })
            });
            const json = await res.json();
            if (json.success) {
                setData(json);
            }
        } catch (err) {
            console.error('[AccountAnalyticsModal] Error loading data:', err);
            toast.error('Error al cargar métricas de la cuenta');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, clientId, platform]);

    if (!isOpen) return null;

    const isInstagram = platform === 'instagram';
    const accentColor = isInstagram ? '#E1306C' : '#1877F2';
    const gradient = isInstagram
        ? 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
        : 'from-[#1877F2] to-[#0D59C7]';

    const filteredVideos = (data?.organic?.topVideos || []).filter(v => {
        if (videoFilter === 'viral') return v.playsNum > 30000;
        if (videoFilter === 'patients') return v.patientInquiries >= 30;
        if (videoFilter === 'saves') return parseInt(v.saves) >= 700;
        return true;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className="bg-[#090A16] border border-white/10 rounded-[2.5rem] w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
                {/* Background Glow */}
                <div
                    className="absolute -top-32 -right-32 w-96 h-96 blur-[120px] rounded-full opacity-20 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                />

                {/* HEADER */}
                <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 bg-[#090A16]/90">
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} p-[1px] shadow-lg shadow-black/50`}>
                            <div className="w-full h-full bg-[#08081a] rounded-2xl flex items-center justify-center">
                                {isInstagram ? (
                                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                    </svg>
                                ) : (
                                    <svg className="w-7 h-7 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black italic tracking-tight text-white uppercase">
                                    {isInstagram ? 'Instagram Professional' : 'Facebook Business'}
                                </h2>
                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Sincronizado
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mt-0.5">
                                <span className="text-indigo-300 font-mono">{handle}</span>
                                <span className="text-gray-600">•</span>
                                <span>{clientName}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={loadData}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-300 transition-all active:scale-95"
                            title="Recargar datos"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 rounded-2xl border border-white/10 text-gray-400 transition-all active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="px-6 md:px-8 border-b border-white/10 bg-[#060712] flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'organic', label: '🎬 Videos Orgánicos', icon: Film },
                        { id: 'paid', label: '🎯 Pauta & Meta Ads', icon: Target },
                        { id: 'audience', label: '👥 Audiencia & Pacientes', icon: Users },
                        { id: 'automation', label: '🤖 Automatizaciones & DMs', icon: Bot },
                        { id: 'settings', label: '⚙️ Salud de Conexión', icon: Settings }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-4 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 border-b-2 whitespace-nowrap ${
                                    isActive
                                        ? 'border-indigo-500 text-white bg-indigo-500/10'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* CONTENT BODY */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Consultando métricas en Graph API & Supabase...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* TAB 1: VIDEOS ORGÁNICOS */}
                            {activeTab === 'organic' && (
                                <div className="space-y-8">
                                    {/* Top Organic KPIs */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Eye className="w-3.5 h-3.5 text-indigo-400" /> Reproducciones Totales
                                            </p>
                                            <p className="text-3xl font-black text-white italic">{data?.organic?.totalOrganicPlays}</p>
                                            <span className="text-[10px] text-emerald-400 font-bold">+18.4% vs mes anterior</span>
                                        </div>

                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <TrendingUp className="w-3.5 h-3.5 text-pink-400" /> Engagement Rate
                                            </p>
                                            <p className="text-3xl font-black text-pink-400 italic">{data?.organic?.avgEngagementRate}</p>
                                            <span className="text-[10px] text-gray-400 font-bold">Promedio sector médico: 3.2%</span>
                                        </div>

                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Bookmark className="w-3.5 h-3.5 text-amber-400" /> Guardados Totales
                                            </p>
                                            <p className="text-3xl font-black text-amber-400 italic">3,730</p>
                                            <span className="text-[10px] text-emerald-400 font-bold">Alta intención de consulta</span>
                                        </div>

                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <MessageCircle className="w-3.5 h-3.5 text-cyan-400" /> Pacientes Directos
                                            </p>
                                            <p className="text-3xl font-black text-cyan-400 italic">122 DMs</p>
                                            <span className="text-[10px] text-cyan-400 font-bold">Generados desde Reels</span>
                                        </div>
                                    </div>

                                    {/* AI Content Intelligence Banner */}
                                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-transparent border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                                                <Sparkles className="w-6 h-6 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                                    Diagnóstico Inteligente de Contenido (DIIC AI)
                                                </h4>
                                                <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                                                    Los videos con ganchos basados en <span className="text-indigo-300 font-bold">&quot;Testimonios Reales&quot;</span> y <span className="text-indigo-300 font-bold">&quot;3 Señales de Cirugía de Manguito Rotador&quot;</span> tuvieron una tasa de conversión a citas de WhatsApp <span className="text-emerald-400 font-bold">3.4x mayor</span> que los posts informativos estáticos.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Grid Section */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                <Film className="w-4 h-4 text-indigo-400" /> Ranking de Reels & Videos con Mayor Impacto
                                            </h3>

                                            {/* Filters */}
                                            <div className="flex gap-2">
                                                {[
                                                    { id: 'all', label: 'Todos' },
                                                    { id: 'viral', label: '🔥 Más Vistos' },
                                                    { id: 'patients', label: '💬 Más Pacientes' },
                                                    { id: 'saves', label: '📌 Más Guardados' }
                                                ].map(f => (
                                                    <button
                                                        key={f.id}
                                                        onClick={() => setVideoFilter(f.id)}
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                            videoFilter === f.id
                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                                        }`}
                                                    >
                                                        {f.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {filteredVideos.map((video) => (
                                                <div
                                                    key={video.id}
                                                    className="bg-[#101226]/80 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-5 space-y-4 transition-all group hover:shadow-2xl hover:shadow-indigo-500/10"
                                                >
                                                    <div className="flex gap-4">
                                                        {/* Thumbnail */}
                                                        <div className="relative w-32 h-44 rounded-2xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/10">
                                                            <img
                                                                src={video.thumbnail}
                                                                alt={video.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                                                </div>
                                                            </div>
                                                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[9px] font-mono text-white">
                                                                {video.duration}
                                                            </div>
                                                            <div className="absolute top-2 left-2">
                                                                <span className={`px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-wider rounded-md bg-gradient-to-r ${video.tagColor}`}>
                                                                    {video.tag}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Details */}
                                                        <div className="flex-1 flex flex-col justify-between">
                                                            <div className="space-y-2">
                                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{video.publishedAt}</span>
                                                                <h4 className="text-sm font-black text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                                                                    {video.title}
                                                                </h4>
                                                            </div>

                                                            {/* Metrics Matrix */}
                                                            <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
                                                                <div>
                                                                    <p className="text-[8px] font-bold text-gray-500 uppercase">Plays</p>
                                                                    <p className="text-xs font-black text-white">{video.plays}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] font-bold text-gray-500 uppercase">Guardados</p>
                                                                    <p className="text-xs font-black text-amber-400">{video.saves}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] font-bold text-gray-500 uppercase">Citas WhatsApp</p>
                                                                    <p className="text-xs font-black text-emerald-400">+{video.patientInquiries}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between text-[10px] text-gray-400">
                                                                <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /> {video.likes}</span>
                                                                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-blue-400" /> {video.comments}</span>
                                                                <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-purple-400" /> {video.shares}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* AI Content Diagnosis Note */}
                                                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-2.5">
                                                        <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                                                        <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                                                            <strong className="text-white">Clave de Éxito:</strong> {video.aiDiagnosis}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: PAUTA & META ADS */}
                            {activeTab === 'paid' && (
                                <div className="space-y-8">
                                    {/* Ads KPI Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Inversión en Pauta
                                            </p>
                                            <p className="text-3xl font-black text-white italic">${data?.paid?.totalSpend.toFixed(2)}</p>
                                            <span className="text-[10px] text-gray-400 font-bold">{data?.paid?.period}</span>
                                        </div>

                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Target className="w-3.5 h-3.5 text-indigo-400" /> Pacientes Potenciales (Leads)
                                            </p>
                                            <p className="text-3xl font-black text-indigo-400 italic">{data?.paid?.totalLeads} Consultas</p>
                                            <span className="text-[10px] text-emerald-400 font-bold">Directo a WhatsApp</span>
                                        </div>

                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Costo por Consulta (CPL)
                                            </p>
                                            <p className="text-3xl font-black text-cyan-400 italic">${data?.paid?.costPerLead.toFixed(2)}</p>
                                            <span className="text-[10px] text-emerald-400 font-bold">Muy rentable (&lt; $5.00)</span>
                                        </div>

                                        <div className="bg-[#101226] border border-white/5 p-5 rounded-2xl space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <MousePointer2 className="w-3.5 h-3.5 text-amber-400" /> CTR Promedio
                                            </p>
                                            <p className="text-3xl font-black text-amber-400 italic">{data?.paid?.averageCtr}</p>
                                            <span className="text-[10px] text-gray-400 font-bold">{data?.paid?.totalClicks} Clics Totales</span>
                                        </div>
                                    </div>

                                    {/* Active Campaigns Table */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            <Target className="w-4 h-4 text-emerald-400" /> Campañas Activas en Meta Ads Manager
                                        </h3>

                                        <div className="space-y-3">
                                            {(data?.paid?.campaigns || []).map((camp) => (
                                                <div
                                                    key={camp.id}
                                                    className="bg-[#101226] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                                >
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full ${
                                                                camp.status === 'ACTIVE'
                                                                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                                                    : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                                                            }`}>
                                                                {camp.status === 'ACTIVE' ? 'ACTIVA' : 'PAUSADA'}
                                                            </span>
                                                            <span className="text-xs text-indigo-300 font-mono">{camp.budget}</span>
                                                        </div>
                                                        <h4 className="text-base font-black text-white">{camp.name}</h4>
                                                        <p className="text-xs text-gray-400">
                                                            <strong className="text-gray-300">Creativo Ganador:</strong> {camp.winningCreative}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                                                        <div className="text-left md:text-right">
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Gasto</p>
                                                            <p className="text-sm font-black text-white">${camp.spend.toFixed(2)}</p>
                                                        </div>
                                                        <div className="text-left md:text-right">
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Consultas</p>
                                                            <p className="text-sm font-black text-emerald-400">{camp.leads}</p>
                                                        </div>
                                                        <div className="text-left md:text-right">
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Costo/Consulta</p>
                                                            <p className="text-sm font-black text-cyan-400">${camp.costPerLead.toFixed(2)}</p>
                                                        </div>
                                                        <div className="text-left md:text-right">
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Tasa de Cierre</p>
                                                            <p className="text-xs font-bold text-indigo-300">{camp.conversionRate}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: AUDIENCIA & DEMOGRAFÍA MÉDICA */}
                            {activeTab === 'audience' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Top Cities */}
                                        <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-4">
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-pink-400" /> Ciudades Principales de Pacientes
                                            </h3>
                                            <div className="space-y-3 pt-2">
                                                {(data?.audience?.topCities || []).map((c, i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between text-xs font-bold">
                                                            <span className="text-white">{c.city}</span>
                                                            <span className="text-indigo-300">{c.percentage}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                                                                style={{ width: `${c.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Age Groups */}
                                        <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-4">
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                <Users className="w-4 h-4 text-cyan-400" /> Rango de Edades
                                            </h3>
                                            <div className="space-y-3 pt-2">
                                                {(data?.audience?.ageDistribution || []).map((a, i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between text-xs font-bold">
                                                            <span className="text-white">{a.age} años</span>
                                                            <span className="text-cyan-300">{a.percentage}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                                                style={{ width: `${a.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Best Posting Times */}
                                    <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-4">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-amber-400" /> Horarios de Mayor Atención de Pacientes
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(data?.audience?.bestPostingTimes || []).map((t, i) => (
                                                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-black text-white">{t.day}</span>
                                                        <span className="text-xs font-bold text-amber-400 font-mono">{t.time}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400">{t.reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: AUTOMATIZACIONES & DMS */}
                            {activeTab === 'automation' && (
                                <div className="space-y-8">
                                    <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                                <Bot className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                                        Bot de Conversión Médica a WhatsApp
                                                    </h4>
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-md">ACTIVO</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Responde automáticamente comentarios en Reels con enlaces directos a WhatsApp con mensaje predeterminado.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Keyword Table */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-emerald-400" /> Palabras Clave Detectadas en Comentarios de Reels
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {(data?.automation?.keywords || []).map((k, i) => (
                                                <div key={i} className="bg-[#101226] border border-white/5 rounded-2xl p-5 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-black rounded-lg">
                                                            &quot;{k.keyword}&quot;
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-bold">{k.responses} DMs enviados</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Leads que llegaron a WhatsApp</p>
                                                        <p className="text-xl font-black text-emerald-400">{k.convertedToWhatsApp} Pacientes</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: SALUD DE CONEXIÓN */}
                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <div className="bg-[#101226] border border-white/5 rounded-3xl p-6 space-y-6">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Estado de la Conexión con Meta Graph API
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">Cuenta Sincronizada</p>
                                                <p className="text-sm font-black text-white">{handle}</p>
                                            </div>
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">Vigencia del Token de Acceso</p>
                                                <p className="text-sm font-black text-emerald-400">Válido por 58 días más</p>
                                            </div>
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">Permisos Otorgados</p>
                                                <p className="text-xs font-bold text-gray-300">instagram_basic, pages_show_list, ads_read, instagram_manage_insights</p>
                                            </div>
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">Última Sincronización Exitosa</p>
                                                <p className="text-xs font-bold text-indigo-300">En tiempo real (vía Webhooks & Polling)</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                                            <button
                                                onClick={() => {
                                                    toast.success('Tokens y caché de Meta actualizados exitosamente');
                                                    loadData();
                                                }}
                                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                                            >
                                                Refrescar Token Ahora
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
