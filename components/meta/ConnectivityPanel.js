'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, CreditCard, CheckCircle2, AlertCircle, RefreshCw, Link2, ExternalLink } from 'lucide-react';
import { metaConnector } from '@/services/metaConnector';
import IntegrationModal from '@/components/connectivity/IntegrationModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ConnectivityPanel() {
    const [status, setStatus] = useState({
        facebook: false,
        instagram: false,
        whatsapp: false,
        ad_account: false,
        details: null
    });
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('facebook');

    // Fetch initial status and check for oauth callback
    useEffect(() => {
        const handleCallback = async () => {
            const waitingProvider = localStorage.getItem('diic_waiting_provider');
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
                toast.loading(`Sincronizando conexión real con ${waitingProvider === 'facebook' ? 'Meta' : waitingProvider}...`, { id: 'connect-meta' });
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    let externalId = `real_${waitingProvider}_id`;
                    let metadata = {};

                    if (waitingProvider === 'facebook') {
                        try {
                            const fbResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
                            const fbData = await fbResponse.json();
                            if (fbData && fbData.id) {
                                externalId = fbData.id;
                                metadata = { name: fbData.name, email: fbData.email };
                            }
                        } catch (e) {
                            console.warn('[ConnectivityPanel] Failed to fetch Facebook profile:', e);
                        }
                    }

                    // Save to brand_connections
                    await supabase
                        .from('brand_connections')
                        .upsert({
                            user_id: user.id,
                            client_id: null,
                            provider: waitingProvider,
                            provider_id: externalId,
                            access_token: token,
                            expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                            status: 'ACTIVE',
                            updated_at: new Date().toISOString(),
                            metadata: metadata
                        }, { onConflict: 'user_id,provider' });

                    // Save to social_connections
                    await supabase
                        .from('social_connections')
                        .upsert({
                            user_id: user.id,
                            client_id: null,
                            platform: waitingProvider,
                            external_id: externalId,
                            access_token: token,
                            expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                            updated_at: new Date().toISOString(),
                            metadata: metadata
                        }, { onConflict: 'user_id,platform' });

                    const displayName = metadata.name || (waitingProvider === 'facebook' ? 'Meta' : waitingProvider);
                    toast.success(`Conexión real con ${displayName} establecida.`, { id: 'connect-meta' });
                }
                localStorage.removeItem('diic_waiting_provider');
                localStorage.removeItem('diic_waiting_client_id');
                window.history.replaceState(null, null, window.location.pathname);
            }
            await loadStatus();
        };

        handleCallback();
    }, []);

    const loadStatus = async () => {
        const data = await metaConnector.getConnectionStatus();
        setStatus(data);
        setLoading(false);
    };

    const handleConnect = async (platform) => {
        setSelectedPlatform(platform);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <IntegrationModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    loadStatus();
                }}
                platform={selectedPlatform === 'ads' ? 'facebook' : (selectedPlatform === 'meta' ? 'facebook' : selectedPlatform)}
                clientName={status.details?.metadata?.name || 'tu marca'}
                onSuccess={loadStatus}
            />
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold font-display text-white mb-2">Conectividad & Automatización</h2>
                <p className="text-gray-400">Vincula tus activos de Meta para activar el Motor de Crecimiento Automático.</p>
            </div>

            {/* Connection Grid */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* 1. FACEBOOK PAGE */}
                <ConnectionCard
                    icon={Facebook}
                    label="Página de Facebook"
                    platform="facebook"
                    description="Necesaria para publicar anuncios y crear identidad de marca."
                    isConnected={status.facebook}
                    onConnect={() => handleConnect('facebook')}
                    isConnecting={connecting === 'facebook'}
                    color="text-blue-500"
                    bgColor="bg-blue-500/10"
                    borderColor="border-blue-500/20"
                />

                {/* 2. INSTAGRAM BUSINESS */}
                <ConnectionCard
                    icon={Instagram}
                    label="Instagram Business"
                    platform="instagram"
                    description="Tu escaparate visual principal. Requiere cuenta profesional."
                    isConnected={status.instagram}
                    onConnect={() => handleConnect('instagram')}
                    isConnecting={connecting === 'instagram'}
                    color="text-pink-500"
                    bgColor="bg-pink-500/10"
                    borderColor="border-pink-500/20"
                />

                {/* 3. WHATSAPP BUSINESS */}
                <ConnectionCard
                    icon={MessageCircle}
                    label="WhatsApp Business API"
                    platform="whatsapp"
                    description="Para campañas de 'Click-to-WhatsApp' y automatización de mensajes."
                    isConnected={status.whatsapp}
                    onConnect={() => handleConnect('whatsapp')}
                    isConnecting={connecting === 'whatsapp'}
                    color="text-green-500"
                    bgColor="bg-green-500/10"
                    borderColor="border-green-500/20"
                />

                {/* 4. AD ACCOUNT */}
                <ConnectionCard
                    icon={CreditCard}
                    label="Cuenta Publicitaria"
                    platform="ads"
                    description="La fuente de financiación y gestión de tus campañas."
                    isConnected={status.ad_account}
                    onConnect={() => handleConnect('ads')}
                    isConnecting={connecting === 'ads'}
                    color="text-purple-500"
                    bgColor="bg-purple-500/10"
                    borderColor="border-purple-500/20"
                />

            </div>

            {/* Diagnostic / Summary Panel */}
            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Estado de la Red Neural
                </h3>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 w-full bg-black/40 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${((status.facebook ? 1 : 0) +
                                        (status.instagram ? 1 : 0) +
                                        (status.whatsapp ? 1 : 0) +
                                        (status.ad_account ? 1 : 0)) * 25
                                    }%`
                            }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                    <div className="text-sm font-bold text-white whitespace-nowrap">
                        {((status.facebook ? 1 : 0) + (status.instagram ? 1 : 0) + (status.whatsapp ? 1 : 0) + (status.ad_account ? 1 : 0))} / 4 Conectados
                    </div>
                </div>

                {!status.ad_account && (
                    <div className="mt-4 flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/10 text-yellow-200 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>No has conectado una cuenta publicitaria. No podrás lanzar campañas hasta que completes este paso.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ConnectionCard({
    icon: Icon,
    label,
    platform,
    description,
    isConnected,
    onConnect,
    isConnecting,
    color,
    bgColor,
    borderColor
}) {
    return (
        <div className={`p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${isConnected ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>

            {/* Connected Glow */}
            {isConnected && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] pointer-events-none" />
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${color} border ${borderColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {isConnected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-bold border border-white/10">
                        Desconectado
                    </span>
                )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
            <p className="text-gray-400 text-sm mb-6 h-10">{description}</p>

            {isConnected ? (
                <div className="flex gap-2">
                    <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-white text-sm font-bold border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        Configurar
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Desconectar">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <a href="#" className="p-2.5 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:text-white transition-colors" title="Ver en Meta">
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            ) : (
                <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${isConnecting ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'} ${isConnected ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                >
                    {isConnecting ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Conectando...
                        </>
                    ) : (
                        <>
                            <Link2 className="w-4 h-4" /> Conectar {label}
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
