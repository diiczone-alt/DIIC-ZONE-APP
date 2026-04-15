'use client';

import { useState } from 'react';
import {
    Facebook, Instagram, MessageCircle, Send, Globe, Mail,
    CheckCircle, RefreshCw, Plus, ArrowRight, Bot, Users,
    Youtube, Video, ArrowLeft, Link as LinkIcon, Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import WhatsAppDashboard from './whatsapp/WhatsAppDashboard';

// Expanded Channel List
const CHANNELS = [
    {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        icon: MessageCircle,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        description: 'Canal principal de ventas y atención 24/7.',
        status: 'connected',
        type: 'messaging',
        metadata: { number: '+51 987 654 321', type: 'API Oficial' },
        features: ['CRM Sync', 'Agente IA', 'Propuestas', 'Broadcasts'],
        config: ['Respuesta IA', 'Asignación Auto', 'Etiquetado'],
        oauthProvider: 'Meta'
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: Instagram,
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        description: 'DMs, comentarios en posts y Reels.',
        status: 'connected',
        type: 'social',
        metadata: { account: '@diic.zone', followers: '12.5k' },
        features: ['Inbox Unificado', 'Respuestas Rápidas', 'Story Mentions'],
        config: ['Responder Comentarios', 'Detectar Leads'],
        oauthProvider: 'Facebook'
    },
    {
        id: 'messenger',
        name: 'Facebook Messenger',
        icon: Facebook,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        description: 'Mensajes de Fanpage y campañas de Ads.',
        status: 'disconnected',
        type: 'social',
        features: ['Inbox Unificado', 'Lead Gen Ads', 'Sponsored Messages'],
        config: ['Sincronizar Fanpage'],
        oauthProvider: 'Facebook'
    },
    {
        id: 'tiktok',
        name: 'TikTok Business',
        icon: Video,
        color: 'text-white',
        bg: 'bg-gray-800',
        border: 'border-white/20',
        description: 'Mensajes directos y atribución de leads.',
        status: 'disconnected',
        type: 'social',
        features: ['Lead Generation', 'Direct Messages', 'Comment Mgmt'],
        config: ['Tracking Pixel', 'Shop Integration'],
        oauthProvider: 'TikTok'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: Youtube,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        description: 'Gestión de comentarios y comunidad.',
        status: 'disconnected',
        type: 'video',
        features: ['Comment Moderation', 'Community Posts'],
        config: ['Alertas de Comentarios'],
        oauthProvider: 'Google'
    },
    {
        id: 'telegram',
        name: 'Telegram',
        icon: Send,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/20',
        description: 'Bots automatizados y canales de difusión.',
        status: 'disconnected',
        type: 'messaging',
        features: ['Custom Bots', 'Channel Management', 'Group Admin'],
        config: ['Bot Token Integration'],
        oauthProvider: 'Telegram'
    },
    {
        id: 'email',
        name: 'Email & Leads',
        icon: Mail,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        description: 'Sincronización con Gmail/Outlook.',
        status: 'pending',
        type: 'marketing',
        features: ['Inbox Sync', 'Cold Emailing', 'Newsletter'],
        config: ['SMTP/IMAP', 'Signature'],
        oauthProvider: 'Google/Outlook'
    },
    {
        id: 'web',
        name: 'Web Chat',
        icon: Globe,
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-500/20',
        description: 'Widget de chat para tu sitio web.',
        status: 'disconnected',
        type: 'web',
        features: ['Live Chat', 'Lead Capture Form', 'Visitor Tracking'],
        config: ['Widget Color', 'Welcome Message'],
        oauthProvider: null // Script embed
    }
];

export default function ChannelsView() {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [connecting, setConnecting] = useState(null);

    const handleConnect = (e, id) => {
        if (e) e.stopPropagation();
        setConnecting(id);
        setTimeout(() => setConnecting(null), 2000);
    };

    // Sub-Screen: Detailed Channel View (Internal Landing)
    if (selectedChannel) {
        return (
            <AnimatePresence>
                {/* Internal Landing View (Sub-screen per channel) */}
                {selectedChannel && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col bg-[#050511] relative"
                    >
                        {/* CONDITIONAL RENDER: WhatsApp OS vs Generic Landing */}
                        {selectedChannel.id === 'whatsapp' ? (
                            <WhatsAppDashboard
                                channel={selectedChannel}
                                onBack={() => setSelectedChannel(null)}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col h-full bg-[#050511] relative overflow-hidden">
                                {/* Background Ambiance */}
                                <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${selectedChannel.bg.replace('/10', '/5')} rounded-full blur-[120px] pointer-events-none`}></div>

                                {/* Header */}
                                <div className="h-16 border-b border-white/5 flex items-center px-8 gap-4 bg-[#050511]/80 backdrop-blur z-20 sticky top-0 shrink-0">
                                    <button
                                        onClick={() => setSelectedChannel(null)}
                                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedChannel.bg}`}>
                                            <selectedChannel.icon className={`w-4 h-4 ${selectedChannel.color}`} />
                                        </div>
                                        <h2 className="text-lg font-bold text-white">{selectedChannel.name}</h2>
                                        {selectedChannel.status === 'connected' && (
                                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold uppercase">Conectado</span>
                                        )}
                                    </div>
                                </div>

                                {/* Content: 2-Column Layout */}
                                <div className="p-8">
                                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                                        {/* LEFT: Info & Connection */}
                                        <div className="lg:col-span-5 space-y-6">
                                            {/* Visual Identity Card */}
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
                                                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 ${selectedChannel.bg} shadow-[0_0_30px_rgba(0,0,0,0.3)]`}>
                                                    <selectedChannel.icon className={`w-12 h-12 ${selectedChannel.color}`} />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">{selectedChannel.name}</h3>
                                                <p className="text-gray-400 text-sm mb-6">{selectedChannel.description}</p>

                                                {selectedChannel.status === 'connected' ? (
                                                    <div className="w-full bg-[#151520] rounded-xl p-4 border border-emerald-500/20 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                            <span className="text-xs font-bold text-emerald-400">Sincronización Activa</span>
                                                        </div>
                                                        <button className="text-xs text-red-400 hover:underline">Desconectar</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleConnect(e, selectedChannel.id)}
                                                        disabled={connecting === selectedChannel.id}
                                                        className={`w-full py-4 rounded-xl text-sm font-bold shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2
                                                            ${selectedChannel.oauthProvider === 'Meta' || selectedChannel.oauthProvider === 'Facebook' ? 'bg-[#1877F2] hover:bg-[#166fe5] text-white' :
                                                                selectedChannel.oauthProvider === 'Google' ? 'bg-white hover:bg-gray-100 text-gray-900' :
                                                                    selectedChannel.id === 'tiktok' ? 'bg-white hover:bg-gray-200 text-black' :
                                                                        'bg-indigo-600 hover:bg-indigo-500 text-white'}
                                                        `}
                                                    >
                                                        {connecting === selectedChannel.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                                                        {connecting === selectedChannel.id ? 'Conectando...' : `Conectar con ${selectedChannel.oauthProvider || 'API'}`}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Features List */}
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Capacidades</h4>
                                                <ul className="space-y-3">
                                                    {selectedChannel.features.map((feat, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                                <CheckCircle className="w-3 h-3 text-indigo-400" />
                                                            </div>
                                                            {feat}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* RIGHT: Configuration & Logic Flow */}
                                        <div className="lg:col-span-7 space-y-6">

                                            {/* Logic Flow Visualization (The "Alive" Part) */}
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                                                <div className="flex justify-between items-center mb-6 relative z-10">
                                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                        <Zap className="w-4 h-4 text-yellow-400" /> Flujo de Datos
                                                    </h3>
                                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">Live Preview</span>
                                                </div>

                                                {/* Flow Diagram */}
                                                <div className="flex items-center justify-between relative py-6 z-10">
                                                    {/* Node 1: Channel */}
                                                    <div className="flex flex-col items-center gap-2 z-10">
                                                        <div className={`w-14 h-14 rounded-2xl ${selectedChannel.bg} flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]`}>
                                                            <selectedChannel.icon className={`w-7 h-7 ${selectedChannel.color}`} />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-400">{selectedChannel.name}</span>
                                                    </div>

                                                    {/* Edge 1 */}
                                                    <div className="flex-1 h-px bg-white/10 mx-4 relative">
                                                        <div className="absolute inset-0 bg-indigo-500/50 w-1/3 animate-[shimmer_1.5s_infinite]"></div>
                                                    </div>

                                                    {/* Node 2: AI Core */}
                                                    <div className="flex flex-col items-center gap-2 z-10">
                                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                                            <Bot className="w-7 h-7 text-indigo-400" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-400">Agente IA</span>
                                                    </div>

                                                    {/* Edge 2 */}
                                                    <div className="flex-1 h-px bg-white/10 mx-4 relative">
                                                        <div className="absolute inset-0 bg-indigo-500/50 w-1/3 animate-[shimmer_1.5s_infinite] delay-100"></div>
                                                    </div>

                                                    {/* Node 3: CRM */}
                                                    <div className="flex flex-col items-center gap-2 z-10">
                                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                                            <Users className="w-7 h-7 text-emerald-400" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-400">Lead CRM</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-[#151520] rounded-xl border border-dashed border-white/10 flex items-center gap-3 relative z-10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                    <p className="text-xs text-gray-400 font-mono">
                                                        <span className="text-indigo-400">LOG:</span> Escuchando eventos en tiempo real de {selectedChannel.name}...
                                                    </p>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
                                            </div>

                                            {/* Configuration Checklist */}
                                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                                                <h3 className="text-lg font-bold text-white mb-4">Configuración Inicial</h3>
                                                <div className="space-y-3">
                                                    {selectedChannel.config?.map((conf, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 bg-[#151520] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center bg-black/20">
                                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 opacity-0 hover:opacity-100 cursor-pointer transition-opacity" />
                                                                </div>
                                                                <span className="text-sm text-gray-300">{conf}</span>
                                                            </div>
                                                            <button className="text-xs text-indigo-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg border border-white/5 transition-colors">Configurar</button>
                                                        </div>
                                                    )) || <p className="text-sm text-gray-500">No hay configuraciones extra requeridas.</p>}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Grid View (Main)
    return (
        <div className="p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-white/5">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Conectar Canales</h2>
                        <p className="text-gray-400 text-sm max-w-2xl">
                            Selecciona una plataforma para integrarla al ecosistema DIIC ZONE.
                        </p>
                    </div>
                </div>

                {/* Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {CHANNELS.map(channel => (
                        <motion.div
                            key={channel.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedChannel(channel)}
                            className={`bg-[#0E0E18]/80 backdrop-blur-xl border ${channel.status === 'connected' ? channel.border : 'border-white/5'} rounded-3xl p-6 relative group transition-all shadow-xl cursor-pointer hover:bg-[#151520]`}
                        >
                            {/* Status Pill */}
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                {channel.status === 'connected' ? (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#050511] border border-white/10 rounded-lg shadow-inner">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">Online</span>
                                    </div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-gray-600 transition-colors"></div>
                                )}
                            </div>

                            {/* Icon & Title */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${channel.bg} border border-white/5 shadow-inner group-hover:scale-105 transition-transform`}>
                                <channel.icon className={`w-7 h-7 ${channel.color}`} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                {channel.name}
                            </h3>
                            <p className="text-xs text-gray-400 mb-6 h-8 line-clamp-2">{channel.description}</p>

                            {/* Action Button */}
                            <button
                                onClick={(e) => handleConnect(e, channel.id)}
                                disabled={connecting === channel.id}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border
                                    ${channel.status === 'connected'
                                        ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                        : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                    }
                                `}
                            >
                                {connecting === channel.id ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Conectando...
                                    </>
                                ) : channel.status === 'connected' ? (
                                    <>
                                        <ArrowRight className="w-3.5 h-3.5" /> Gestionar
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-3.5 h-3.5" /> Conectar
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ))}

                    {/* Add More Placeholder (Future) */}
                    <div className="border border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all text-center group cursor-pointer opacity-50 hover:opacity-100">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">Solicitar Integración</h3>
                            <p className="text-xs text-gray-500">¿Falta algún canal?</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
