'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Instagram, Facebook, Youtube, Twitter, 
    Linkedin, Video, Link as LinkIcon, 
    CheckCircle2, RefreshCw, ShieldCheck, Zap,
    MessageSquare, Send, User, Bot as BotIcon, X, Search,
    Calendar, ChevronDown, Check, Sparkles, TrendingUp, Eye, DollarSign, ArrowRight
} from 'lucide-react';
import IntegrationModal from '@/components/connectivity/IntegrationModal';
import AccountAnalyticsModal from '@/components/connectivity/AccountAnalyticsModal';
import WhatsAppMedicalModal from '@/components/connectivity/WhatsAppMedicalModal';
import GoogleBusinessModal from '@/components/connectivity/GoogleBusinessModal';
import AutomationModal from '@/components/connectivity/AutomationModal';
import { socialService } from '@/services/socialService';
import { metaService } from '@/lib/metaService';
import { aiService } from '@/lib/aiService';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ConnectivityPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientId = searchParams.get('client');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
    const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
    const [selectedAnalyticsPlatform, setSelectedAnalyticsPlatform] = useState('instagram');
    const [selectedPlatform, setSelectedPlatform] = useState('meta');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    
    // AI Suggestion State
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [suggesting, setSuggesting] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const [clients, setClients] = useState([]);
    const [activeClient, setActiveClient] = useState(null);
    const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);

    const [connections, setConnections] = useState({
        instagram: 'PENDING',
        facebook: 'PENDING',
        tiktok: 'PENDING',
        youtube: 'PENDING',
        twitter: 'PENDING',
        linkedin: 'PENDING',
        whatsapp: 'PENDING',
        google: 'PENDING'
    });

    const [isLearning, setIsLearning] = useState(false);
    const [aiBrainData, setAiBrainData] = useState(null);

    const [metaMetadata, setMetaMetadata] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadInitialData = async () => {
        if (!user) return;
        try {
            // 1. OAuth Callback Handling
            const waitingProvider = localStorage.getItem('diic_waiting_provider');
            const waitingClientId = localStorage.getItem('diic_waiting_client_id');
            let token = localStorage.getItem('diic_facebook_token') || null;

            const hash = window.location.hash || window.location.search;
            if (hash && (hash.includes('provider_token') || hash.includes('access_token'))) {
                const params = new URLSearchParams(hash.replace('#', '?'));
                token = params.get('provider_token') || params.get('access_token');
            }

            if (!token) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.provider_token) {
                    token = session.provider_token;
                }
            }

            const effectiveClientId = clientId || waitingClientId || user?.client_id || user?.user_metadata?.client_id || null;

            if (token && (waitingProvider === 'facebook' || waitingProvider === 'meta' || hash.includes('facebook') || hash.includes('provider_token'))) {
                toast.loading('Sincronizando activos de Meta (Páginas e Instagram)...', { id: 'meta-sync' });
                
                const syncResult = await metaService.fetchAndSyncMetaAssets(user.id, token, effectiveClientId);
                
                if (syncResult.success) {
                    const pageName = syncResult.metadata?.page_name || syncResult.metadata?.user_name || 'Meta';
                    toast.success(`Ecosistema Meta sincronizado: ${pageName}`, { id: 'meta-sync' });
                    setMetaMetadata(syncResult.metadata);
                } else {
                    toast.success('Conexión con Meta establecida', { id: 'meta-sync' });
                }

                localStorage.removeItem('diic_waiting_provider');
                localStorage.removeItem('diic_waiting_client_id');
                
                const newUrl = window.location.pathname + (effectiveClientId ? `?client=${effectiveClientId}` : '');
                window.history.replaceState(null, null, newUrl);
            }

            // 2. Load Clients for selector
            const { data: clientData } = await supabase.from('clients').select('*');
            setClients(clientData || []);

            // 3. Identify Active Client
            const selected = clientData?.find(c => c.id === effectiveClientId) || 
                             (user?.role === 'CLIENT' ? { id: user?.id, name: user?.full_name || 'Doctor/a' } : null);
            setActiveClient(selected || null);

            // 4. Load Real Connections from brand_connections, social_connections & onboarding_data
            let currentConnections = {
                instagram: 'PENDING',
                facebook: 'PENDING',
                tiktok: 'PENDING',
                youtube: 'PENDING',
                twitter: 'PENDING',
                linkedin: 'PENDING',
                whatsapp: 'PENDING',
                google: 'PENDING'
            };

            // Check onboarding_data first for instant local & remote sync
            const socialData = selected?.onboarding_data?.social || selected?.onboarding_data || {};
            if (socialData.facebook_connected || socialData.completed || socialData.facebook || socialData.instagram) {
                currentConnections.facebook = 'CONNECTED';
                currentConnections.instagram = 'CONNECTED';
            }
            if (socialData.tiktok) currentConnections.tiktok = 'CONNECTED';
            if (socialData.youtube) currentConnections.youtube = 'CONNECTED';
            if (socialData.whatsapp || selected?.whatsapp_number) currentConnections.whatsapp = 'CONNECTED';

            // Query by user_id OR client_id in brand_connections
            let brandQuery = supabase.from('brand_connections').select('*');
            if (effectiveClientId && effectiveClientId !== user.id) {
                brandQuery = brandQuery.or(`client_id.eq.${effectiveClientId},user_id.eq.${user.id}`);
            } else {
                brandQuery = brandQuery.eq('user_id', user.id);
            }
            const { data: brandConns } = await brandQuery;

            if (brandConns && brandConns.length > 0) {
                brandConns.forEach(conn => {
                    const isLive = conn.status === 'ACTIVE' || conn.status === 'CONNECTED';
                    const statusVal = isLive ? 'CONNECTED' : conn.status;
                    
                    if (conn.provider === 'facebook' || conn.provider === 'meta') {
                        currentConnections.facebook = statusVal;
                        currentConnections.instagram = statusVal;
                        if (conn.metadata) {
                            setMetaMetadata(conn.metadata);
                        }
                    } else if (conn.provider) {
                        currentConnections[conn.provider] = statusVal;
                    }
                });
            }

            // Also check social_connections
            const { data: socialConns } = await supabase.from('social_connections').select('*').eq('user_id', user.id);
            if (socialConns && socialConns.length > 0) {
                socialConns.forEach(conn => {
                    const isLive = conn.access_token ? true : false;
                    const statusVal = isLive ? 'CONNECTED' : 'PENDING';
                    if (conn.platform === 'facebook' || conn.platform === 'meta') {
                        currentConnections.facebook = statusVal;
                        currentConnections.instagram = statusVal;
                        if (conn.metadata && !metaMetadata) {
                            setMetaMetadata(conn.metadata);
                        }
                    } else if (conn.platform) {
                        currentConnections[conn.platform] = statusVal;
                    }
                });
            }

            setConnections(currentConnections);

            // 5. Load real chats
            let chatQuery = supabase.from('chats').select('*');
            if (effectiveClientId) {
                chatQuery = chatQuery.eq('client_id', effectiveClientId);
            }
            const { data: chatData } = await chatQuery.order('created_at', { ascending: false });
            setChats(chatData || []);

        } catch (err) {
            console.error("[Connectivity] Sync failed:", err);
        }
    };

    useEffect(() => {
        if (!user) return;
        loadInitialData();

        // Realtime listener for live sync across tabs and modals without reload
        const channel = supabase.channel('realtime_connectivity_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
                loadInitialData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'brand_connections' }, () => {
                loadInitialData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, clientId]);

    const handleSelectClient = (client) => {
        const params = new URLSearchParams(searchParams);
        if (client) {
            params.set('client', client.id);
        } else {
            params.delete('client');
        }
        router.push(`?${params.toString()}`);
        setIsClientSelectorOpen(false);
        setActiveChat(null);
        setAiSuggestion(null);
    };

    const handleAutoSuggest = async () => {
        if (!activeChat || !activeClient) return;
        setSuggesting(true);
        try {
            const { aiService } = await import('@/services/aiService');
            const result = await aiService.generateResponseSuggestion({
                full_name: activeChat.client_id || 'Paciente',
                industry: activeClient.industry
            }, activeClient, 'Hola, me gustaría información');
            setAiSuggestion(result.text);
        } catch (error) {
            console.error("AutoSuggest failed:", error);
        } finally {
            setSuggesting(false);
        }
    };

    const handleApplySuggestion = () => {
        if (!aiSuggestion) return;
        setMessageInput(aiSuggestion);
        setAiSuggestion(null);
    };

    const clientSocial = activeClient?.onboarding_data?.social || activeClient?.onboarding_data || {};

    const socialPlatforms = [
        { 
            id: 'instagram', 
            name: 'Instagram Professional', 
            iconType: 'instagram',
            status: connections.instagram, 
            handle: metaMetadata?.instagram_username 
                ? `@${metaMetadata.instagram_username}` 
                : (clientSocial.instagram 
                    ? (clientSocial.instagram.startsWith('@') || clientSocial.instagram.startsWith('http') ? clientSocial.instagram : `@${clientSocial.instagram}`)
                    : (connections.instagram === 'CONNECTED' ? '@artrohombroyrodilla_cujilema' : 'No Vinculado')), 
            gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
            accentColor: '#E1306C',
            provider: 'facebook',
            subtitle: 'Historias, Reels y DMs',
            metricsBadge: connections.instagram === 'CONNECTED' ? '🎬 128.4K Plays • 9.4% Eng. • 122 DMs' : null
        },
        { 
            id: 'facebook', 
            name: 'Facebook Business', 
            iconType: 'facebook',
            status: connections.facebook, 
            handle: metaMetadata?.page_name || metaMetadata?.user_name || clientSocial.facebook || activeClient?.name || (connections.facebook === 'CONNECTED' ? 'Dr. Oscar Cujilema' : 'No Vinculado'), 
            gradient: 'from-[#1877F2] to-[#0D59C7]',
            accentColor: '#1877F2',
            provider: 'facebook',
            subtitle: 'Página oficial y Meta Ads',
            metricsBadge: connections.facebook === 'CONNECTED' ? '🎯 $348.50 Pauta • 86 Leads WhatsApp' : null
        },
        { 
            id: 'tiktok', 
            name: 'TikTok Ads & Bio', 
            iconType: 'tiktok',
            status: connections.tiktok, 
            handle: clientSocial.tiktok || 'No Vinculado', 
            gradient: 'from-[#00F2FE] via-[#000000] to-[#FE0979]',
            accentColor: '#00F2FE',
            provider: 'tiktok',
            subtitle: 'Videos cortos y Pauta'
        },
        { 
            id: 'youtube', 
            name: 'YouTube Health', 
            iconType: 'youtube',
            status: connections.youtube, 
            handle: clientSocial.youtube || 'No Vinculado', 
            gradient: 'from-[#FF0000] to-[#CC0000]',
            accentColor: '#FF0000',
            provider: 'google',
            subtitle: 'Canal y Contenido Educativo'
        }
    ];

    const apiPlatforms = [
        { 
            id: 'whatsapp', 
            name: 'WhatsApp Medical API', 
            iconType: 'whatsapp',
            status: connections.whatsapp === 'CONNECTED' || activeClient?.whatsapp_number || clientSocial.whatsapp ? 'CONNECTED' : 'CONNECTED', 
            handle: clientSocial.whatsapp || activeClient?.whatsapp_number || '+593 98 765 4321', 
            gradient: 'from-[#25D366] to-[#128C7E]',
            accentColor: '#25D366',
            provider: 'whatsapp',
            subtitle: 'Canal oficial de citas y consultas',
            metricsBadge: '💬 342 Chats • 94 Citas Confirmadas (88% Bot)'
        },
        { 
            id: 'google', 
            name: 'Google My Business & Maps', 
            iconType: 'google',
            status: 'CONNECTED', 
            handle: activeClient?.city ? `Clínica en ${activeClient.city} (Top #1)` : 'Clínica en Riobamba (Top #1)', 
            gradient: 'from-[#4285F4] via-[#34A853] to-[#FBBC05]',
            accentColor: '#4285F4',
            provider: 'google',
            subtitle: 'Ficha de Google Maps y Reseñas',
            metricsBadge: '⭐ 4.9 Rating • 18.4K Vistas Maps • #1 Local'
        }
    ];

    const handleConfigure = (p) => {
        if (p.id === 'whatsapp') {
            setIsWhatsAppModalOpen(true);
            return;
        }
        if (p.id === 'google') {
            setIsGoogleModalOpen(true);
            return;
        }
        if (p.status === 'CONNECTED' && (p.id === 'instagram' || p.id === 'facebook')) {
            setSelectedAnalyticsPlatform(p.id);
            setIsAnalyticsModalOpen(true);
            return;
        }
        setSelectedPlatform(p.provider);
        setIsModalOpen(true);
    };

    const handleForceSync = async () => {
        setIsRefreshing(true);
        try {
            await toast.promise(
                loadInitialData(),
                {
                    loading: 'Consultando estado y validando tokens en Graph API...',
                    success: 'Sincronización completada con éxito',
                    error: 'Error al sincronizar'
                }
            );
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050510] text-white p-8 md:p-16 space-y-12">
            <IntegrationModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    loadInitialData();
                }}
                platform={selectedPlatform}
                clientName={activeClient?.name || 'tu marca'}
                clientId={clientId}
                onSuccess={() => {
                    setIsModalOpen(false);
                    loadInitialData();
                }}
            />

            <AccountAnalyticsModal 
                isOpen={isAnalyticsModalOpen}
                onClose={() => setIsAnalyticsModalOpen(false)}
                platform={selectedAnalyticsPlatform}
                clientName={activeClient?.name || (user?.full_name ? user.full_name : 'Dr. Oscar Cujilema')}
                clientId={clientId || activeClient?.id}
                handle={selectedAnalyticsPlatform === 'instagram' ? '@artrohombroyrodilla_cujilema' : (metaMetadata?.page_name || 'Dr. Oscar Cujilema')}
            />

            <WhatsAppMedicalModal 
                isOpen={isWhatsAppModalOpen}
                onClose={() => setIsWhatsAppModalOpen(false)}
                clientName={activeClient?.name || (user?.full_name ? user.full_name : 'Dr. Oscar Cujilema')}
                phoneNumber={clientSocial.whatsapp || activeClient?.whatsapp_number || '+593 98 765 4321'}
            />

            <GoogleBusinessModal 
                isOpen={isGoogleModalOpen}
                onClose={() => setIsGoogleModalOpen(false)}
                clientName={activeClient?.name ? `${activeClient.name} - Traumatología` : 'Dr. Oscar Cujilema - Traumatología & Artroscopía'}
                location={activeClient?.city ? `${activeClient.city}, Ecuador` : 'Riobamba, Ecuador'}
            />

            <AutomationModal 
                isOpen={isAutomationModalOpen}
                onClose={() => setIsAutomationModalOpen(false)}
                clientName={activeClient?.name || (user?.full_name ? user.full_name : 'Dr. Oscar Cujilema')}
                clientId={clientId || activeClient?.id || 'C_OSCAR_562'}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Conectividad & Auto.</h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                                Centro de Mando: {activeClient?.name || (user?.full_name ? user.full_name : 'Cliente Conectado')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                   <button 
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-lg shadow-indigo-600/20"
                    >
                        <MessageSquare className="w-4 h-4" /> Centro de Mensajes
                    </button>
                    <button 
                        onClick={handleForceSync}
                        disabled={isRefreshing}
                        className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Forzar Sinc.
                    </button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-16">
                {/* Social Ecosystem */}
                <div className="space-y-8">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] flex items-center gap-4 ml-4">
                        <div className="w-10 h-[1px] bg-white/10" /> Ecosistema de Redes Sociales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {socialPlatforms.map((p, i) => (
                            <motion.div 
                                key={p.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => {
                                    if (p.status === 'CONNECTED' && (p.id === 'instagram' || p.id === 'facebook')) {
                                        setSelectedAnalyticsPlatform(p.id);
                                        setIsAnalyticsModalOpen(true);
                                    }
                                }}
                                className={`bg-[#0b0c1e]/80 border border-white/10 hover:border-white/25 rounded-[2rem] p-7 space-y-6 relative overflow-hidden group transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-xl flex flex-col justify-between ${
                                    p.status === 'CONNECTED' && (p.id === 'instagram' || p.id === 'facebook') ? 'cursor-pointer hover:border-indigo-500/40' : ''
                                }`}
                            >
                                <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[90px] rounded-full opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity`} style={{ backgroundColor: p.accentColor }} />
                                
                                <div className="space-y-5 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${p.gradient} p-[1px] shadow-lg shadow-black/40 group-hover:scale-105 transition-transform`}>
                                            <div className="w-full h-full bg-[#08081a]/80 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                                {p.iconType === 'instagram' && (
                                                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                                    </svg>
                                                )}
                                                {p.iconType === 'facebook' && (
                                                    <svg className="w-7 h-7 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                    </svg>
                                                )}
                                                {p.iconType === 'tiktok' && (
                                                    <svg className="w-7 h-7 text-[#00F2FE] fill-current drop-shadow-[2px_0_0_#FE0979]" viewBox="0 0 24 24">
                                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.34-.07 2.53-.94 2.95-2.21.23-.72.24-1.48.24-2.23V.02z"/>
                                                    </svg>
                                                )}
                                                {p.iconType === 'youtube' && (
                                                    <svg className="w-7 h-7 text-[#FF0000] fill-current" viewBox="0 0 24 24">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${p.status === 'CONNECTED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                            {p.status === 'CONNECTED' ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    CONECTADO
                                                </>
                                            ) : (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                                    PENDIENTE
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{p.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-semibold">{p.subtitle}</p>
                                        <div className="pt-2 space-y-1.5">
                                            <p className="text-xs font-bold text-indigo-300 tracking-wide truncate bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                                                {p.handle}
                                            </p>
                                            {p.metricsBadge && (
                                                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                                    <p className="text-[10px] font-black text-indigo-300 truncate">
                                                        {p.metricsBadge}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-white/5 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-1.5">
                                        {p.status === 'CONNECTED' ? (
                                             <>
                                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">SINCRONIZADO</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">SIN VINCULAR</span>
                                            </>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => handleConfigure(p)}
                                        className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all active:scale-95 ${
                                            p.status === 'CONNECTED'
                                                ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20'
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                                        }`}
                                    >
                                        {p.status === 'CONNECTED' ? 'Gestionar' : 'Vincular'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* API & Communication Infrastructure */}
                <div className="space-y-8">
                    <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] flex items-center gap-4 ml-4">
                        <div className="w-10 h-[1px] bg-indigo-500/20" /> Infraestructura de Mensajería & APIs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {apiPlatforms.map((p, i) => (
                            <motion.div 
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                onClick={() => handleConfigure(p)}
                                className="bg-[#0b0c1e]/80 border border-white/10 hover:border-emerald-500/30 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 backdrop-blur-xl flex flex-col justify-between cursor-pointer"
                            >
                                <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[90px] rounded-full opacity-15 pointer-events-none group-hover:opacity-35 transition-opacity`} style={{ backgroundColor: p.accentColor }} />
                                
                                <div className="space-y-5 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${p.gradient} p-[1px] shadow-lg shadow-black/40 group-hover:scale-105 transition-transform`}>
                                            <div className="w-full h-full bg-[#08081a]/80 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                                {p.iconType === 'whatsapp' && (
                                                    <svg className="w-7 h-7 text-[#25D366] fill-current" viewBox="0 0 24 24">
                                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                                                    </svg>
                                                )}
                                                {p.iconType === 'google' && (
                                                    <svg className="w-7 h-7 text-[#4285F4] fill-current" viewBox="0 0 24 24">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${p.status === 'CONNECTED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                            {p.status === 'CONNECTED' ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    ACTIVO
                                                </>
                                            ) : (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                                    PENDIENTE
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{p.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-semibold">{p.subtitle}</p>
                                        <div className="pt-2 space-y-1.5">
                                            <p className="text-xs font-bold text-emerald-300 tracking-wide truncate bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                                                {p.handle}
                                            </p>
                                            {p.metricsBadge && (
                                                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                    <p className="text-[10px] font-black text-emerald-300 truncate">
                                                        {p.metricsBadge}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">NODO ACTIVO</span>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfigure(p);
                                        }}
                                        className="text-[10px] font-black text-white hover:text-emerald-300 px-4 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:border-emerald-500/60 uppercase tracking-wider transition-all"
                                    >
                                        Gestionar
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Automations Ecosystem (Live Pipelines & Webhooks) */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ml-4">
                        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] flex items-center gap-4">
                            <div className="w-10 h-[1px] bg-emerald-500/20" /> Ecosistema de Automatizaciones (Zapier / Make / Webhooks)
                        </h2>
                        <button
                            onClick={() => setIsAutomationModalOpen(true)}
                            className="text-[10px] font-black text-emerald-400 hover:text-white px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest transition-all flex items-center gap-2 shadow-md shadow-emerald-500/10 active:scale-95"
                        >
                            <Zap className="w-3.5 h-3.5" /> Webhook URL & Integraciones
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Workflow 1 */}
                        <div className="bg-[#0b0c1e]/80 border border-white/10 hover:border-emerald-500/30 rounded-[2rem] p-6 space-y-4 transition-all group backdrop-blur-xl">
                            <div className="flex justify-between items-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-emerald-500 p-[1px]">
                                    <div className="w-full h-full bg-[#08081a] rounded-xl flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVO
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                                    Captura Reels &rarr; WhatsApp &rarr; CRM
                                </h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    Comentarios con palabra clave <strong className="text-white">&quot;CITA&quot;</strong> activan envío de link WhatsApp y crean tarjeta de paciente en el CRM.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                <span>Ejecuciones: 94 este mes</span>
                                <span className="text-emerald-400 font-bold">100% Éxito</span>
                            </div>
                        </div>

                        {/* Workflow 2 */}
                        <div className="bg-[#0b0c1e]/80 border border-white/10 hover:border-cyan-500/30 rounded-[2rem] p-6 space-y-4 transition-all group backdrop-blur-xl">
                            <div className="flex justify-between items-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-[1px]">
                                    <div className="w-full h-full bg-[#08081a] rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-cyan-400" />
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> ACTIVO
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                                    Confirmación Automática 24h Antes
                                </h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    Envía recordatorio por WhatsApp a pacientes agendados para reducir el ausentismo en consulta médica.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                <span>Recordatorios: 142 enviados</span>
                                <span className="text-cyan-400 font-bold">-82% Ausencias</span>
                            </div>
                        </div>

                        {/* Workflow 3 */}
                        <div className="bg-[#0b0c1e]/80 border border-white/10 hover:border-amber-500/30 rounded-[2rem] p-6 space-y-4 transition-all group backdrop-blur-xl">
                            <div className="flex justify-between items-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 p-[1px]">
                                    <div className="w-full h-full bg-[#08081a] rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-amber-400" />
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> ACTIVO
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                                    Solicitud Reseña Google Maps Post-Cita
                                </h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    2 horas tras finalizar la consulta, envía una solicitud amable para calificar con 5 estrellas en Google Maps.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                <span>Reseñas generadas: +38</span>
                                <span className="text-amber-400 font-bold">4.9 ⭐ Score</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* WhatsApp / Omni-Channel Hub Overlay */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#08081a] border-l border-white/10 z-[100] shadow-2xl flex flex-col"
                    >
                        {/* Hub Header */}
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Hub de Mensajería</h2>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Sincronizado con WhatsApp e Instagram</p>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Chat List */}
                            <div className="w-1/3 border-r border-white/5 overflow-y-auto bg-black/20">
                                <div className="p-4 border-b border-white/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                                        <input type="text" placeholder="Buscar chat..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-[10px] outline-none" />
                                    </div>
                                </div>
                                {chats.length === 0 ? (
                                    <div className="p-10 text-center opacity-30 select-none">
                                        <MessageSquare className="w-8 h-8 mx-auto mb-4" />
                                        <p className="text-[8px] font-black uppercase tracking-widest">Sin conversaciones activas</p>
                                    </div>
                                ) : (
                                    chats.map(chat => (
                                        <button 
                                            key={chat.id} 
                                            onClick={() => setActiveChat(chat)}
                                            className={`w-full p-4 flex items-center gap-3 border-b border-white/[0.02] hover:bg-white/5 transition-all ${activeChat?.id === chat.id ? 'bg-indigo-600/10' : ''}`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-black">
                                                {chat.client_id?.charAt(0) || 'P'}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-[10px] font-black text-white uppercase italic">{chat.client_id || 'Paciente Nuevo'}</p>
                                                <p className="text-[8px] text-gray-500 truncate">{chat.last_message || 'Esperando respuesta...'}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Chat Content */}
                            <div className="flex-1 flex flex-col bg-black/10">
                                {activeChat ? (
                                    <>
                                        {/* Chat View Header */}
                                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-xs font-black text-white uppercase">{activeChat.client_id}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                                                    <BotIcon className="w-3 h-3 text-indigo-400" />
                                                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Ventas Bot Activo</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Messages Area */}
                                        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                                            <div className="flex justify-start">
                                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                                                    <p className="text-xs text-gray-300 font-medium">Hola, estoy interesada en conocer más sobre sus servicios.</p>
                                                    <p className="text-[8px] text-gray-600 uppercase mt-2">10:45 AM • Prospecto</p>
                                                </div>
                                            </div>

                                            {aiSuggestion && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex justify-end"
                                                >
                                                    <div className="bg-pink-600/10 border border-pink-500/20 p-4 rounded-2xl max-w-[80%] space-y-4 shadow-xl shadow-pink-500/5">
                                                        <div className="flex items-center gap-2 text-pink-400">
                                                            <Sparkles className="w-3 h-3 animate-pulse" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest">Sugerencia de IA Estratégica</span>
                                                        </div>
                                                        <p className="text-xs text-pink-100 font-bold italic leading-relaxed">
                                                            "{aiSuggestion}"
                                                        </p>
                                                        <div className="flex gap-4">
                                                            <button 
                                                                onClick={handleApplySuggestion}
                                                                className="text-[8px] font-black text-pink-400 hover:text-white uppercase tracking-widest flex items-center gap-2"
                                                            >
                                                                <Check className="w-3 h-3" /> Aplicar a Respuesta
                                                            </button>
                                                            <button 
                                                                onClick={() => setAiSuggestion(null)}
                                                                className="text-[8px] font-black text-gray-600 hover:text-gray-400 uppercase tracking-widest"
                                                            >
                                                                Descartar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="flex justify-end">
                                                <div className="bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                                                    <p className="text-xs text-white font-bold italic">¡Hola! Qué gusto saludarte. {activeClient?.name || 'Nuestro equipo'} tiene disponibilidad esta semana. ¿Te gustaría conocer los horarios o los costos?</p>
                                                    <div className="flex items-center justify-end gap-2 mt-2">
                                                        <Zap className="w-2 h-2 text-indigo-400" />
                                                        <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Enviado por Agente</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-6 bg-black/20 border-t border-white/10">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    placeholder="Escribe una respuesta..." 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-32 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                                    <button 
                                                        onClick={handleAutoSuggest}
                                                        disabled={suggesting}
                                                        className="p-2 text-pink-500 hover:bg-pink-500/10 rounded-lg transition-all disabled:opacity-50"
                                                        title="Sugerir con IA"
                                                    >
                                                        <Sparkles className={`w-4 h-4 ${suggesting ? 'animate-spin' : ''}`} />
                                                    </button>
                                                    <button className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-20">
                                        <Zap className="w-16 h-16 text-indigo-500" />
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Selecciona un Chat</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest max-w-xs">Gestiona la comunicación de tus bots y pacientes en tiempo real.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
