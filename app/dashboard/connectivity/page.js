'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Instagram, Facebook, Youtube, Twitter, 
    Linkedin, Video, Link as LinkIcon, 
    CheckCircle2, RefreshCw, ShieldCheck, Zap,
    MessageSquare, Send, User, Bot as BotIcon, X, Search
} from 'lucide-react';
import IntegrationModal from '@/components/connectivity/IntegrationModal';
import { socialService } from '@/services/socialService';
import { metaService } from '@/lib/metaService';
import { aiService } from '@/lib/aiService';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ConnectivityPage() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('meta');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [connections, setConnections] = useState({
        instagram: 'PENDING',
        facebook: 'PENDING',
        tiktok: 'PENDING',
        youtube: 'PENDING',
        twitter: 'PENDING',
        linkedin: 'PENDING',
        whatsapp: 'CONNECTED' // Simulado conectado para demo de WhatsApp Hub
    });

    const [isLearning, setIsLearning] = useState(false);
    const [aiBrainData, setAiBrainData] = useState(null);

    useEffect(() => {
        if (!user) return;
        const syncConnections = async () => {
            try {
                const linkedProviders = await socialService.getLinkedAccounts();
                const newConnections = { ...connections };
                if (linkedProviders.includes('facebook')) {
                    newConnections.facebook = 'CONNECTED';
                    newConnections.instagram = 'CONNECTED';
                }
                setConnections(newConnections);

                // Load real chats from DB
                const { data: chatData } = await supabase
                    .from('chats')
                    .select('*')
                    .order('created_at', { ascending: false });
                setChats(chatData || []);
            } catch (err) {
                console.error("[Connectivity] Sync failed:", err);
            }
        };
        syncConnections();
    }, [user]);

    const platforms = [
        { id: 'whatsapp', name: 'WhatsApp Medical API', icon: Zap, status: connections.whatsapp, handle: '+593 96 388 3224', color: '#25D366', provider: 'whatsapp' },
        { id: 'instagram', name: 'Instagram Professional', icon: Instagram, status: connections.instagram, handle: '@dra.jessica_reyes', color: '#E1306C', provider: 'facebook' },
        { id: 'facebook', name: 'Facebook Business', icon: Facebook, status: connections.facebook, handle: 'Nova Estética Clínica', color: '#1877F2', provider: 'facebook' },
    ];

    const handleConfigure = (p) => {
        setSelectedPlatform(p.provider);
        setIsModalOpen(true);
    };

    return (
        <main className="min-h-screen bg-[#050510] text-white p-8 md:p-16 space-y-12">
            <IntegrationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                platform={selectedPlatform}
                onSuccess={() => {}}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Conectividad & Auto.</h1>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sincronización Médica Activa</span>
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
                    <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3">
                        <RefreshCw className="w-4 h-4" /> Forzar Sinc.
                    </button>
                </div>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {platforms.map((p, i) => (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group"
                    >
                        <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full opacity-20 pointer-events-none`} style={{ backgroundColor: p.color }} />
                        
                        <div className="flex justify-between items-start relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: p.color }}>
                                <p.icon className="w-8 h-8" />
                            </div>
                            <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${p.status === 'CONNECTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                {p.status}
                            </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{p.name}</h3>
                            <p className="text-sm font-bold text-gray-400 tracking-widest">{p.handle}</p>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">DIIC SECURE</span>
                            </div>
                            <button 
                                onClick={() => p.status === 'CONNECTED' ? setIsChatOpen(true) : handleConfigure(p)}
                                className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                {p.status === 'CONNECTED' ? 'Ver Mensajes' : 'Vincular'}
                            </button>
                        </div>
                    </motion.div>
                ))}
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
                                                    <p className="text-xs text-gray-300 font-medium">Hola, estoy interesada en una consulta para rejuvenecimiento facial.</p>
                                                    <p className="text-[8px] text-gray-600 uppercase mt-2">10:45 AM • Paciente</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <div className="bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                                                    <p className="text-xs text-white font-bold italic">¡Hola! Qué gusto saludarte. La Dra. Jessica Reyes tiene agenda disponible para este tipo de tratamientos. ¿Te gustaría conocer los horarios o los costos?</p>
                                                    <div className="flex items-center justify-end gap-2 mt-2">
                                                        <Zap className="w-2 h-2 text-indigo-400" />
                                                        <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Borrador de Bot</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-6 bg-black/20 border-t border-white/10">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    placeholder="Escribe una respuesta (o presiona Shift+Enter para que el Bot lo haga)..." 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-16 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
                                                />
                                                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                                    <Send className="w-4 h-4" />
                                                </button>
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
