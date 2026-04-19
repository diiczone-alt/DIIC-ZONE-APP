'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Instagram, Facebook, Youtube, Twitter, 
    Linkedin, Video, Link as LinkIcon, 
    CheckCircle2, RefreshCw, ShieldCheck, Zap 
} from 'lucide-react';
import IntegrationModal from '@/components/connectivity/IntegrationModal';
import { socialService } from '@/services/socialService';
import { metaService } from '@/lib/metaService';
import { useAuth } from '@/context/AuthContext';

export default function ConnectivityPage() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('meta');
    
    // Mock state for connected status (will be populated from real DB in prod)
    const [connections, setConnections] = useState({
        instagram: 'PENDING',
        facebook: 'PENDING',
        tiktok: 'PENDING',
        youtube: 'PENDING',
        twitter: 'PENDING',
        linkedin: 'PENDING',
        whatsapp: 'PENDING'
    });

    useEffect(() => {
        const syncConnections = async () => {
            try {
                const linkedProviders = await socialService.getLinkedAccounts();
                const newConnections = { ...connections };
                
                if (linkedProviders.includes('facebook')) {
                    newConnections.facebook = 'CONNECTED';
                    newConnections.instagram = 'CONNECTED';
                }
                if (linkedProviders.includes('google')) newConnections.youtube = 'CONNECTED';
                if (linkedProviders.includes('tiktok')) newConnections.tiktok = 'CONNECTED';
                if (linkedProviders.includes('twitter')) newConnections.twitter = 'CONNECTED';
                if (linkedProviders.includes('linkedin')) newConnections.linkedin = 'CONNECTED';
                
                setConnections(newConnections);
            } catch (err) {
                console.error("[Connectivity] Sync failed:", err);
            }
        };
        syncConnections();
    }, [user]);

    const platforms = [
        { id: 'instagram', name: 'Instagram Professional', icon: Instagram, status: connections.instagram, handle: '@dra.jessica_reyes', color: '#E1306C', provider: 'facebook' },
        { id: 'facebook', name: 'Facebook Business', icon: Facebook, status: connections.facebook, handle: 'Nova Estética Clínica', color: '#1877F2', provider: 'facebook' },
        { id: 'tiktok', name: 'TikTok Professional', icon: Video, status: connections.tiktok, handle: 'Dra. Jessica Reyes', color: '#00F2EA', provider: 'tiktok' },
        { id: 'youtube', name: 'YouTube Channel', icon: Youtube, status: connections.youtube, handle: 'DIIC HEALTH Academy', color: '#FF0000', provider: 'google' },
        { id: 'twitter', name: 'X / Twitter', icon: Twitter, status: connections.twitter, handle: 'jessicareyes_md', color: '#ffffff', provider: 'twitter' },
        { id: 'linkedin', name: 'LinkedIn Professional', icon: Linkedin, status: connections.linkedin, handle: 'Dra. Jessica Reyes Reyes', color: '#0077B5', provider: 'linkedin' },
        { id: 'whatsapp', name: 'WhatsApp API', icon: Zap, status: connections.whatsapp, handle: connections.whatsapp === 'CONNECTED' ? '+593 XXXXXXX' : 'Vinculación en curso...', color: '#25D366', provider: 'whatsapp' },
    ];

    const handleConfigure = (p) => {
        setSelectedPlatform(p.provider);
        setIsModalOpen(true);
    };

    const handleIntegrationSuccess = async () => {
        // Al usar socialService real, esta función será llamada tras el redirect exitoso.
        // Para el modal, simplemente refrescamos para mostrar el éxito visual.
        const linkedProviders = await socialService.getLinkedAccounts();
        if (linkedProviders.includes(selectedPlatform)) {
             setConnections(prev => ({ ...prev, [selectedPlatform]: 'CONNECTED' }));
        }
    };

    return (
        <main className="min-h-screen bg-[#050510] text-white p-8 md:p-20 space-y-12">
            
            <IntegrationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                platform={selectedPlatform}
                onSuccess={handleIntegrationSuccess}
            />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Conectividad & Auto.</h1>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sincronización Activa</span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Última actualización: Hace 5 minutos</p>
                    </div>
                </div>

                <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3">
                    <RefreshCw className="w-4 h-4" /> Forzar Sincronización
                </button>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {platforms.map((p, i) => (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group"
                    >
                        {/* Status Glow */}
                        <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full opacity-20 pointer-events-none`} style={{ backgroundColor: p.color }} />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: p.color }}>
                                <p.icon className="w-8 h-8" />
                            </div>
                            <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${p.status === 'CONNECTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                {p.status === 'CONNECTED' ? 'Conectado' : 'Pendiente'}
                            </div>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{p.name}</h3>
                            <p className="text-sm font-bold text-gray-400 tracking-widest">{p.handle}</p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Cifrado DIIC</span>
                            </div>
                            <button 
                                onClick={() => handleConfigure(p)}
                                className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Configurar
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Integration Strategy Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-indigo-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
                   <div className="shrink-0 w-24 h-24 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <LinkIcon className="w-10 h-10" />
                   </div>
                   <div className="space-y-4 text-center md:text-left">
                      <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Estrategia de Conectividad Total</h4>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed">
                         Su ecosistema está configurado para centralizar todas las interacciones de sus pacientes en un solo centro de mando. La IA de DIIC ya está monitoreando las conversaciones para generar sus próximos leads.
                      </p>
                      <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-lg shadow-indigo-600/20">
                         Optimizar Flujo
                      </button>
                   </div>
                </div>
            </div>
        </main>
    );
}
