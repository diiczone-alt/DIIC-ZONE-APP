'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Instagram, Facebook, Youtube, Video, Twitter, 
    Linkedin, Share2, CheckCircle2, RefreshCw, 
    ShieldCheck, Zap, AlertCircle, Link2, ExternalLink,
    Lock, Sparkles, MessageCircle, Activity, Globe, Trash2
} from 'lucide-react';
import IntegrationModal from '@/components/connectivity/IntegrationModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function CMConnectivityModule({ client, user }) {
    const [connections, setConnections] = useState({
        facebook: { status: 'PENDING', metadata: null, last_sync: null },
        instagram: { status: 'PENDING', metadata: null, last_sync: null },
        tiktok: { status: 'PENDING', metadata: null, last_sync: null },
        youtube: { status: 'PENDING', metadata: null, last_sync: null },
        whatsapp: { status: 'PENDING', metadata: null, last_sync: null },
        google: { status: 'PENDING', metadata: null, last_sync: null },
        linkedin: { status: 'PENDING', metadata: null, last_sync: null },
        twitter: { status: 'PENDING', metadata: null, last_sync: null }
    });

    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('facebook');

    const clientId = client?.id;

    // Load connection data for the client
    const loadConnections = useCallback(async () => {
        if (!clientId) return;
        setLoading(true);
        try {
            const { data: brandConns, error } = await supabase
                .from('brand_connections')
                .select('*')
                .eq('client_id', clientId);

            if (error) {
                console.warn('[CMConnectivity] Error fetching brand_connections:', error);
            }

            const { data: socialConns } = await supabase
                .from('social_connections')
                .select('*')
                .eq('client_id', clientId);

            const nextState = {
                facebook: { status: 'PENDING', metadata: null, last_sync: null },
                instagram: { status: 'PENDING', metadata: null, last_sync: null },
                tiktok: { status: 'PENDING', metadata: null, last_sync: null },
                youtube: { status: 'PENDING', metadata: null, last_sync: null },
                whatsapp: { status: 'PENDING', metadata: null, last_sync: null },
                google: { status: 'PENDING', metadata: null, last_sync: null },
                linkedin: { status: 'PENDING', metadata: null, last_sync: null },
                twitter: { status: 'PENDING', metadata: null, last_sync: null }
            };

            // Process brand connections
            brandConns?.forEach(conn => {
                const prov = conn.provider?.toLowerCase();
                if (prov === 'facebook' || prov === 'meta') {
                    nextState.facebook = {
                        status: conn.status || 'ACTIVE',
                        metadata: conn.metadata || {},
                        last_sync: conn.updated_at
                    };
                    nextState.instagram = {
                        status: conn.status || 'ACTIVE',
                        metadata: conn.metadata || {},
                        last_sync: conn.updated_at
                    };
                } else if (nextState[prov]) {
                    nextState[prov] = {
                        status: conn.status || 'ACTIVE',
                        metadata: conn.metadata || {},
                        last_sync: conn.updated_at
                    };
                }
            });

            // Fallback / merge with social_connections table
            socialConns?.forEach(conn => {
                const plat = (conn.platform || '').toLowerCase();
                if (plat === 'facebook' || plat === 'meta') {
                    if (nextState.facebook.status !== 'ACTIVE') {
                        nextState.facebook = {
                            status: conn.status || 'ACTIVE',
                            metadata: conn.metadata || {},
                            last_sync: conn.updated_at
                        };
                    }
                    if (nextState.instagram.status !== 'ACTIVE') {
                        nextState.instagram = {
                            status: conn.status || 'ACTIVE',
                            metadata: conn.metadata || {},
                            last_sync: conn.updated_at
                        };
                    }
                } else if (nextState[plat] && nextState[plat].status !== 'ACTIVE') {
                    nextState[plat] = {
                        status: conn.status || 'ACTIVE',
                        metadata: conn.metadata || {},
                        last_sync: conn.updated_at
                    };
                }
            });

            setConnections(nextState);
        } catch (err) {
            console.error('[CMConnectivity] Error loading connections:', err);
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    // Handle incoming OAuth redirection
    useEffect(() => {
        const handleOAuthCallback = async () => {
            const waitingProvider = localStorage.getItem('diic_waiting_provider');
            const waitingClientId = localStorage.getItem('diic_waiting_client_id');
            let token = null;

            const hash = window.location.hash || window.location.search;
            if (hash && hash.includes('provider_token')) {
                const params = new URLSearchParams(hash.replace('#', '?'));
                token = params.get('provider_token');
            }

            if (!token) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session && session.provider_token) {
                    const sessionProvider = session.user?.app_metadata?.provider;
                    if (sessionProvider === waitingProvider) {
                        token = session.provider_token;
                    }
                }
            }

            if (waitingProvider && token) {
                const targetClientId = waitingClientId || clientId;
                toast.loading(`Sincronizando conexión real con ${waitingProvider === 'facebook' ? 'Meta' : waitingProvider}...`, { id: 'oauth-sync' });

                const { data: authData } = await supabase.auth.getUser();
                const userId = authData?.user?.id || user?.id;

                let externalId = `real_${waitingProvider}_id`;
                let metadata = {};

                if (waitingProvider === 'facebook' || waitingProvider === 'meta') {
                    try {
                        const fbResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
                        const fbData = await fbResponse.json();
                        if (fbData && fbData.id) {
                            externalId = fbData.id;
                            metadata = { name: fbData.name, email: fbData.email };
                        }
                    } catch (e) {
                        console.warn('[CMConnectivity] Failed to fetch Facebook profile:', e);
                    }
                }

                if (userId && targetClientId) {
                    await supabase
                        .from('brand_connections')
                        .upsert({
                            user_id: userId,
                            client_id: targetClientId,
                            provider: waitingProvider === 'meta' ? 'facebook' : waitingProvider,
                            provider_id: externalId,
                            access_token: token,
                            expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                            status: 'ACTIVE',
                            updated_at: new Date().toISOString(),
                            metadata: metadata
                        }, { onConflict: 'user_id,provider' });

                    await supabase
                        .from('social_connections')
                        .upsert({
                            user_id: userId,
                            client_id: targetClientId,
                            platform: waitingProvider === 'meta' ? 'facebook' : waitingProvider,
                            external_id: externalId,
                            access_token: token,
                            expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                            updated_at: new Date().toISOString(),
                            metadata: metadata
                        }, { onConflict: 'user_id,platform' });

                    const displayName = metadata.name || (waitingProvider === 'facebook' ? 'Meta (Facebook & IG)' : waitingProvider);
                    toast.success(`¡Conexión exitosa con ${displayName} para ${client?.name || 'el cliente'}!`, { id: 'oauth-sync' });
                }

                localStorage.removeItem('diic_waiting_provider');
                localStorage.removeItem('diic_waiting_client_id');
                window.history.replaceState(null, null, window.location.pathname);
                loadConnections();
            }
        };

        handleOAuthCallback();
    }, [clientId, client?.name, user?.id, loadConnections]);

    useEffect(() => {
        loadConnections();
    }, [loadConnections]);

    const handleOpenConnect = (platformId) => {
        setSelectedPlatform(platformId === 'instagram' ? 'facebook' : platformId);
        setIsModalOpen(true);
    };

    const handleDisconnect = async (platformId) => {
        if (!confirm(`¿Estás seguro de desconectar ${platformId.toUpperCase()} para ${client?.name}?`)) return;

        try {
            toast.loading(`Desconectando ${platformId}...`, { id: 'disconnect' });
            const providerKey = platformId === 'instagram' ? 'facebook' : platformId;

            if (clientId) {
                await supabase
                    .from('brand_connections')
                    .delete()
                    .eq('client_id', clientId)
                    .eq('provider', providerKey);

                await supabase
                    .from('social_connections')
                    .delete()
                    .eq('client_id', clientId)
                    .eq('platform', providerKey);
            }

            toast.success(`${platformId.toUpperCase()} desconectado correctamente`, { id: 'disconnect' });
            loadConnections();
        } catch (err) {
            console.error('Error disconnecting:', err);
            toast.error('Error al desconectar la red social', { id: 'disconnect' });
        }
    };

    const handleSyncAll = async () => {
        setIsSyncing(true);
        toast.loading('Sincronizando estado de tokens y APIs...', { id: 'sync-all' });
        await new Promise(r => setTimeout(r, 1200));
        await loadConnections();
        setIsSyncing(false);
        toast.success('Ecosistema de redes sincronizado.', { id: 'sync-all' });
    };

    const platformsList = [
        {
            id: 'facebook',
            name: 'Meta / Facebook Business',
            subtitle: 'Páginas oficiales, mensajería y pauta',
            icon: Facebook,
            color: '#1877F2',
            borderColor: 'border-blue-500/30',
            status: connections.facebook.status,
            handle: connections.facebook.metadata?.name || client?.onboarding_data?.facebook || client?.name || 'No vinculado',
            lastSync: connections.facebook.last_sync,
            scopes: ['Graph API v19.0', 'Page Management', 'Ads Read/Write', 'Lead Retrieval'],
            isMeta: true
        },
        {
            id: 'instagram',
            name: 'Instagram Professional',
            subtitle: 'Reels, Stories, Feed & Insights',
            icon: Instagram,
            color: '#E1306C',
            borderColor: 'border-pink-500/30',
            status: connections.instagram.status,
            handle: client?.onboarding_data?.instagram ? `@${client.onboarding_data.instagram.replace('@', '')}` : (connections.instagram.metadata?.name ? `@${connections.instagram.metadata.name.toLowerCase().replace(/\s+/g, '')}` : '@no_vinculado'),
            lastSync: connections.instagram.last_sync,
            scopes: ['Instagram Graph API', 'Insights & Reach', 'Direct Messaging', 'Content Publishing'],
            isMeta: true
        },
        {
            id: 'tiktok',
            name: 'TikTok Business & Ads',
            subtitle: 'Videos virales, métricas y pauta TikTok',
            icon: Video,
            color: '#00F2EA',
            borderColor: 'border-cyan-500/30',
            status: connections.tiktok.status,
            handle: client?.onboarding_data?.tiktok || '@tiktok_cuenta',
            lastSync: connections.tiktok.last_sync,
            scopes: ['TikTok Marketing API', 'Video Analytics', 'Audience Growth'],
            isMeta: false
        },
        {
            id: 'youtube',
            name: 'YouTube Studio & Channel',
            subtitle: 'Canal oficial, suscriptores y visualizaciones',
            icon: Youtube,
            color: '#FF0000',
            borderColor: 'border-red-500/30',
            status: connections.youtube.status,
            handle: client?.name ? `Canal ${client.name}` : 'No vinculado',
            lastSync: connections.youtube.last_sync,
            scopes: ['YouTube Data v3', 'Analytics API', 'Video Distribution'],
            isMeta: false
        },
        {
            id: 'whatsapp',
            name: 'WhatsApp Business Cloud API',
            subtitle: 'Automatización de chats, leads y avisos',
            icon: MessageCircle,
            color: '#25D366',
            borderColor: 'border-emerald-500/30',
            status: connections.whatsapp.status,
            handle: client?.phone || '+593 Oficial',
            lastSync: connections.whatsapp.last_sync,
            scopes: ['Cloud API Webhooks', 'Automated Templates', 'CRM Sync'],
            isMeta: true
        },
        {
            id: 'google',
            name: 'Google Business Profile & Maps',
            subtitle: 'Reseñas, visibilidad local y SEO',
            icon: Globe,
            color: '#4285F4',
            borderColor: 'border-blue-400/30',
            status: connections.google.status,
            handle: client?.name ? `${client.name} en Google Maps` : 'Ficha de negocio',
            lastSync: connections.google.last_sync,
            scopes: ['Business Profile API', 'Local Reviews', 'Call Conversions'],
            isMeta: false
        },
        {
            id: 'linkedin',
            name: 'LinkedIn Company Page',
            subtitle: 'Branding B2B y posicionamiento corporativo',
            icon: Linkedin,
            color: '#0077B5',
            borderColor: 'border-sky-500/30',
            status: connections.linkedin.status,
            handle: client?.name ? `${client.name} Oficial` : 'Empresa',
            lastSync: connections.linkedin.last_sync,
            scopes: ['Share on LinkedIn', 'Organization Analytics', 'Lead Gen Forms'],
            isMeta: false
        },
        {
            id: 'twitter',
            name: 'X (Twitter) Corporativo',
            subtitle: 'Noticias, atención rápida y tendencias',
            icon: Twitter,
            color: '#A0AEC0',
            borderColor: 'border-gray-500/30',
            status: connections.twitter.status,
            handle: client?.name ? `@${client.name.toLowerCase().replace(/\s+/g, '')}` : '@empresa',
            lastSync: connections.twitter.last_sync,
            scopes: ['X API v2', 'Tweet Publishing', 'Engagement Tracking'],
            isMeta: false
        }
    ];

    const activeCount = Object.values(connections).filter(c => c.status === 'ACTIVE').length;

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#0E0E18] to-[#121226] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-1 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10">
                            <Share2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                Conectividad & Ecosistema de Redes
                            </h2>
                            <p className="text-xs md:text-sm text-gray-400 font-medium">
                                Gestiona las conexiones de Meta y redes sociales oficiales de <span className="text-cyan-400 font-bold">{client?.name || 'este cliente'}</span>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <span className="text-xs font-bold text-white tracking-wide">
                            {activeCount} de {platformsList.length} Conectadas
                        </span>
                    </div>

                    <button
                        onClick={handleSyncAll}
                        disabled={isSyncing}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR TODO'}</span>
                    </button>
                </div>
            </div>

            {/* Meta Focus Notification Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0A1028] to-purple-950/30 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                        <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            Integración Oficial Meta Graph API (Facebook, Instagram & Ads)
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black border border-blue-500/30">
                                v19.0 / v20.0
                            </span>
                        </h4>
                        <p className="text-xs text-gray-400">
                            Permite la recolección automática de leads, métricas de reels/historias, gestión del Business Manager y publicación directa de contenidos aprobados.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenConnect('facebook')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 shrink-0 flex items-center gap-2"
                >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Configurar Meta</span>
                </button>
            </div>

            {/* Grid of Platforms */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                {platformsList.map((p) => {
                    const isConnected = p.status === 'ACTIVE';
                    const IconComponent = p.icon;

                    return (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-3xl p-6 border transition-all flex flex-col justify-between bg-[#0E0E18] relative group ${
                                isConnected 
                                    ? `${p.borderColor} shadow-lg shadow-black/40` 
                                    : 'border-white/5 hover:border-white/15'
                            }`}
                        >
                            {/* Top row */}
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3.5">
                                        <div 
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105"
                                            style={{ 
                                                backgroundColor: `${p.color}15`, 
                                                borderColor: `${p.color}40`,
                                                color: p.color
                                            }}
                                        >
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white leading-snug">{p.name}</h3>
                                            <p className="text-[11px] text-gray-400 leading-tight">{p.subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center">
                                        {isConnected ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Conectado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                                Pendiente
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Handle & Identity Info */}
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5 mb-4 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-bold uppercase text-[10px]">Cuenta / Handle:</span>
                                        <span className="text-white font-mono font-semibold truncate max-w-[170px]">
                                            {p.handle}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-bold uppercase text-[10px]">Última Sincronización:</span>
                                        <span className="text-gray-400 text-[11px]">
                                            {p.lastSync ? new Date(p.lastSync).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Nunca'}
                                        </span>
                                    </div>
                                </div>

                                {/* Active Scopes / Features */}
                                <div className="space-y-1.5 mb-6">
                                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Capacidades activas</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {p.scopes.map((scope, idx) => (
                                            <span 
                                                key={idx} 
                                                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300 font-medium"
                                            >
                                                {scope}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                {isConnected ? (
                                    <>
                                        <button
                                            onClick={() => handleOpenConnect(p.id)}
                                            className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw className="w-3 h-3 text-cyan-400" />
                                            <span>Reconectar / Renovar</span>
                                        </button>
                                        <button
                                            onClick={() => handleDisconnect(p.id)}
                                            title="Desconectar cuenta"
                                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center justify-center"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleOpenConnect(p.id)}
                                        className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-600/10 flex items-center justify-center gap-2 group-hover:shadow-cyan-600/20"
                                    >
                                        <Link2 className="w-3.5 h-3.5" />
                                        <span>Conectar {p.name.split(' ')[0]}</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Integration Modal */}
            <IntegrationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                platform={selectedPlatform}
                clientName={client?.name || 'Cliente'}
                clientId={clientId}
                onSuccess={() => {
                    setIsModalOpen(false);
                    loadConnections();
                }}
            />
        </div>
    );
}
