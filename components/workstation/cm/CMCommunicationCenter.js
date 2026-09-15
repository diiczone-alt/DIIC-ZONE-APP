'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
    MessageSquare, Bot, Users, Phone, Video, Mail, MapPin, 
    Calendar, FileText, Send, Paperclip, Smile, Sparkles, Plus,
    Search, Clock, ChevronRight, CheckCircle2, Download, Eye,
    Share2, MoreVertical, Edit3, ShieldCheck, Heart, Flame,
    ThumbsUp, Star, User, Briefcase, ExternalLink, X, Filter,
    Check, CornerDownRight, Mic, Play, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { messagingService } from '@/services/messagingService';
import { aiService } from '@/services/aiService';
import { supabase } from '@/lib/supabase';

export default function CMCommunicationCenter({
    client,
    clients = [],
    user,
    squad = [],
    tasks = [],
    onSelectClient,
    initialChatWith
}) {
    // ─── Filter & Search State for Conversations ───
    const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'unread', 'clients', 'team', 'ia'
    const [searchQuery, setSearchQuery] = useState('');

    // ─── Active Conversation Selection ───
    const [activeChat, setActiveChat] = useState(() => {
        if (initialChatWith && squad) {
            const foundMember = squad.find(m => m.id === initialChatWith);
            if (foundMember) {
                return {
                    id: foundMember.id,
                    type: 'team',
                    name: foundMember.name,
                    role: foundMember.role || 'Equipo Creativo',
                    avatar: foundMember.avatar || (foundMember.name || 'U').charAt(0),
                    status: 'online',
                    phone: foundMember.phone || '+593 99 999 9999',
                    email: foundMember.email || 'equipo@diiczone.com'
                };
            }
        }
        if (client) {
            return {
                id: client.id || 'client-active',
                type: 'client',
                name: client.name || 'Empresa / Marca',
                role: client.contact_name ? `${client.contact_name} (Representante)` : 'Representante de Marca',
                avatar: client.logo || (client.name || 'C').charAt(0),
                status: 'online',
                phone: client.phone || client.contact_phone || '+593 98 765 4321',
                email: client.email || client.contact_email || 'contacto@marca.com',
                location: client.city ? `${client.city}, ${client.country || 'Ecuador'}` : (client.address || 'Quito, Ecuador'),
                tier: client.plan || client.tier || 'Estrategia Growth Pro',
                niche: client.niche || client.industry || 'Comercial'
            };
        }
        return {
            id: 'ia',
            type: 'ia',
            name: 'DIIC Estratega IA',
            role: 'Copiloto de Estrategia & Contenido',
            avatar: 'AI',
            status: 'online',
            email: 'copilot@diiczone.ai',
            phone: 'IA Cloud Node v2.5',
            location: 'DIIC Global Neural Net',
            tier: 'Asistente Multi-Agente',
            niche: 'Inteligencia de Negocios'
        };
    });

    // Sincronizar activeChat cuando cambia el cliente desde el layout
    useEffect(() => {
        if (client && activeChat.type === 'client' && activeChat.id !== client.id) {
            setActiveChat({
                id: client.id,
                type: 'client',
                name: client.name,
                role: client.contact_name ? `${client.contact_name} (Representante)` : 'Representante de Marca',
                avatar: client.logo || (client.name || 'C').charAt(0),
                status: 'online',
                phone: client.phone || client.contact_phone || '+593 98 765 4321',
                email: client.email || client.contact_email || 'contacto@marca.com',
                location: client.city ? `${client.city}, ${client.country || 'Ecuador'}` : (client.address || 'Quito, Ecuador'),
                tier: client.plan || client.tier || 'Estrategia Growth Pro',
                niche: client.niche || client.industry || 'Comercial'
            });
        }
    }, [client]);

    // ─── Activity Log State & Storage ───
    const [activityTab, setActivityTab] = useState('history'); // 'history', 'notes', 'calls', 'files'
    const [activitySearch, setActivitySearch] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteTag, setNewNoteTag] = useState('Estrategia');

    const [activities, setActivities] = useState(() => {
        const key = `cm_activity_log_${client?.id || 'general'}`;
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(key);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { }
            }
        }
        return [
            {
                id: 'act-1',
                type: 'call',
                title: 'Videollamada de Alineación Estratégica (0:48 min)',
                description: 'Se revisaron los entregables de la semana 2 y los nuevos guiones de reels con el cliente.',
                date: 'Hoy',
                time: '15:45',
                tag: 'Reunión Planificada',
                badgeColor: 'cyan',
                hasTranscript: true,
                hasNotes: true,
                hasRecord: true
            },
            {
                id: 'act-2',
                type: 'note',
                title: 'Presentación y Propuesta de Campaña Q3',
                description: 'Presentación general del alcance del proyecto, calendario de pauta y métricas esperadas.',
                date: 'Ayer',
                time: '09:31',
                tag: 'Nota Estratégica',
                badgeColor: 'indigo',
                hasNotes: true
            },
            {
                id: 'act-3',
                type: 'file',
                title: 'Propuesta & Plan de Contenidos Enviado',
                description: 'Documento consolidado de la estrategia mensual enviado para aprobación final del cliente.',
                date: 'Hace 3 días',
                time: '11:20',
                tag: 'Entregable',
                badgeColor: 'emerald',
                fileName: 'Estrategia_Marca_Mensual.pdf',
                fileSize: '2.4 MB'
            },
            {
                id: 'act-4',
                type: 'call',
                title: 'Llamada de Feedback de Guiones con Filmmaker',
                description: 'Ajustes en el tono del hook y locaciones para la sesión de grabación del viernes.',
                date: 'Hace 5 días',
                time: '17:15',
                tag: 'Coordinación Creativa',
                badgeColor: 'orange',
                hasTranscript: true,
                hasNotes: true
            }
        ];
    });

    useEffect(() => {
        const key = `cm_activity_log_${client?.id || 'general'}`;
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(activities));
        }
    }, [activities, client]);

    // ─── Chat & Messaging State ───
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showContextOptions, setShowContextOptions] = useState(false);
    const [reactions, setReactions] = useState({});
    const chatScrollRef = useRef(null);

    // AI & Local Messages
    const [localMessages, setLocalMessages] = useState([
        {
            id: 'ia-1',
            chatId: 'ia',
            text: `¡Hola ${user?.full_name?.split(' ')[0] || 'Estratega'}! Soy tu Asistente IA de DIIC ZONE. Estoy analizando las cuentas y el rendimiento de tus marcas asignadas. ¿En qué te puedo ayudar hoy?`,
            sender: 'ai',
            time: '10:00 AM',
            reactions: ['🔥', '⭐']
        }
    ]);

    // Realtime Supabase Messages for Clients & Team
    const [realMessages, setRealMessages] = useState([]);
    const [activeThread, setActiveThread] = useState(null);

    // Scroll to bottom of chat on new message
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [localMessages, realMessages, isTyping, activeChat]);

    // Sync Realtime Thread with Supabase
    useEffect(() => {
        let channel = null;

        if (activeChat.type === 'client' && client?.id) {
            const syncClientChat = async () => {
                try {
                    const thread = await messagingService.getOrCreateClientChat(client.id);
                    setActiveThread(thread);
                    const historical = await messagingService.getMessages(thread.id);
                    setRealMessages(historical || []);

                    channel = messagingService.subscribeToMessages(thread.id, (newMsg) => {
                        setRealMessages(prev => {
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                    });
                } catch (err) {
                    console.error("Error connecting client chat:", err);
                }
            };
            syncClientChat();
        } else if (activeChat.type === 'team' && user?.id && activeChat.id) {
            const syncTeamChat = async () => {
                try {
                    const thread = await messagingService.getOrCreateDirectChat(user.id, activeChat.id);
                    setActiveThread(thread);
                    const historical = await messagingService.getMessages(thread.id);
                    setRealMessages(historical || []);

                    channel = messagingService.subscribeToMessages(thread.id, (newMsg) => {
                        setRealMessages(prev => {
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                    });
                } catch (err) {
                    console.error("Error connecting team chat:", err);
                }
            };
            syncTeamChat();
        }

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [activeChat, client, user]);

    // ─── Build Conversations List ───
    const conversationsList = useMemo(() => {
        const list = [];

        // 1. DIIC IA Copilot
        list.push({
            id: 'ia',
            type: 'ia',
            name: 'DIIC Estratega IA',
            role: 'Copiloto de IA & Estrategia',
            avatar: '🤖',
            isAi: true,
            status: 'online',
            lastAction: 'Análisis de estrategia listo',
            lastActionIcon: Sparkles,
            unread: 0,
            category: 'ia',
            phone: 'IA Cloud Node v2.5',
            email: 'copilot@diiczone.ai',
            location: 'DIIC Global Neural Net',
            tier: 'Asistente Multi-Agente',
            niche: 'Inteligencia de Negocios'
        });

        // 2. Active Client (and other clients)
        if (clients && clients.length > 0) {
            clients.forEach(c => {
                list.push({
                    id: c.id,
                    type: 'client',
                    name: c.name,
                    role: c.contact_name ? `${c.contact_name} (Lead)` : 'Marca / Cliente',
                    avatar: c.logo || (c.name || 'C').charAt(0),
                    status: 'online',
                    lastAction: 'Propuesta y entregables en revisión',
                    lastActionIcon: FileText,
                    unread: c.id === client?.id ? 0 : 1,
                    category: 'clients',
                    phone: c.phone || c.contact_phone || '+593 98 765 4321',
                    email: c.email || c.contact_email || 'contacto@marca.com',
                    location: c.city ? `${c.city}, ${c.country || 'Ecuador'}` : (c.address || 'Quito, Ecuador'),
                    tier: c.plan || c.tier || 'Estrategia Growth Pro',
                    niche: c.niche || c.industry || 'Comercial',
                    rawClient: c
                });
            });
        } else if (client) {
            list.push({
                id: client.id,
                type: 'client',
                name: client.name,
                role: client.contact_name ? `${client.contact_name} (Lead)` : 'Marca / Cliente',
                avatar: client.logo || (client.name || 'C').charAt(0),
                status: 'online',
                lastAction: 'Propuesta y entregables en revisión',
                lastActionIcon: FileText,
                unread: 0,
                category: 'clients',
                phone: client.phone || client.contact_phone || '+593 98 765 4321',
                email: client.email || client.contact_email || 'contacto@marca.com',
                location: client.city ? `${client.city}, ${client.country || 'Ecuador'}` : (client.address || 'Quito, Ecuador'),
                tier: client.plan || client.tier || 'Estrategia Growth Pro',
                niche: client.niche || client.industry || 'Comercial',
                rawClient: client
            });
        }

        // 3. Team Squad Members
        const defaultSquad = (squad && squad.length > 0) ? squad : [
            { id: 'member-1', name: 'Anthony (Sto Dgo)', role: 'Diseñador Gráfico & UI', phone: '+593 99 123 4567', email: 'anthony@diiczone.com' },
            { id: 'member-2', name: 'Fausto', role: 'Editor de Video & Reels', phone: '+593 98 234 5678', email: 'fausto@diiczone.com' },
            { id: 'member-3', name: 'Carlos Filmmaker', role: 'Filmmaker & Producción', phone: '+593 97 345 6789', email: 'carlos@diiczone.com' }
        ];

        defaultSquad.forEach(m => {
            list.push({
                id: m.id,
                type: 'team',
                name: m.name,
                role: m.role || 'Creativo Asignado',
                avatar: (m.name || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(),
                status: 'online',
                lastAction: m.role?.toLowerCase().includes('video') ? 'Edición de reel terminada' : 'Diseño de carrusel entregado',
                lastActionIcon: m.role?.toLowerCase().includes('video') ? Video : Edit3,
                unread: 0,
                category: 'team',
                phone: m.phone || '+593 99 999 9999',
                email: m.email || 'equipo@diiczone.com',
                location: 'DIIC HQ Creativo',
                tier: 'Equipo Interno',
                niche: 'Producción Audiovisual'
            });
        });

        return list;
    }, [client, clients, squad]);

    // Filter conversations
    const filteredConversations = useMemo(() => {
        return conversationsList.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.role.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;

            if (filterCategory === 'all') return true;
            if (filterCategory === 'unread') return item.unread > 0;
            if (filterCategory === 'ia') return item.category === 'ia';
            if (filterCategory === 'clients') return item.category === 'clients';
            if (filterCategory === 'team') return item.category === 'team';

            return true;
        });
    }, [conversationsList, searchQuery, filterCategory]);

    // ─── Actions & Handlers ───
    const handleSelectChat = (item) => {
        setActiveChat(item);
        if (item.rawClient && onSelectClient) {
            onSelectClient(item.rawClient);
        }
    };

    const handleSendMessage = async (textToSend = null) => {
        const text = (textToSend || inputValue).trim();
        if (!text || isTyping) return;

        setInputValue('');
        setShowContextOptions(false);

        // 1. AI Copilot Chat
        if (activeChat.type === 'ia') {
            const userMsg = {
                id: 'msg-' + Date.now(),
                chatId: 'ia',
                text: text,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setLocalMessages(prev => [...prev, userMsg]);
            setIsTyping(true);

            try {
                const history = localMessages.filter(m => m.chatId === 'ia');
                const combined = [...history, userMsg];
                const result = await aiService.chatWithAgent(combined, client);

                if (result?.text) {
                    setLocalMessages(prev => [...prev, {
                        id: 'ai-' + Date.now(),
                        chatId: 'ia',
                        text: result.text,
                        sender: 'ai',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                }
            } catch (error) {
                console.error("AI Error:", error);
                setLocalMessages(prev => [...prev, {
                    id: 'ai-err-' + Date.now(),
                    chatId: 'ia',
                    text: `He analizado tu solicitud sobre **${client?.name || 'la cuenta'}**. Sugiero enfocar los hooks en dolor/deseo y validar el formato de entrega con el editor antes de las 18:00.`,
                    sender: 'ai',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } finally {
                setIsTyping(false);
            }
            return;
        }

        // 2. Realtime Messaging (Client / Team)
        if (activeThread && user?.id) {
            const tempId = 'temp-' + Date.now();
            const optimistic = {
                id: tempId,
                content: text,
                sender_id: user.id,
                created_at: new Date().toISOString(),
                chat_id: activeThread.id
            };

            setRealMessages(prev => [...prev, optimistic]);

            try {
                await messagingService.sendMessage(activeThread.id, user.id, text);
            } catch (err) {
                console.error("Failed to send message:", err);
                toast.error("Error al enviar mensaje.");
                setRealMessages(prev => prev.filter(m => m.id !== tempId));
            }
        } else {
            // Local fallback simulation
            const fallbackMsg = {
                id: 'local-' + Date.now(),
                chatId: activeChat.id,
                text: text,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setLocalMessages(prev => [...prev, fallbackMsg]);
            toast.success("Mensaje Enviado", { description: `Enviado a ${activeChat.name}` });
        }
    };

    const handleAddReaction = (messageId, emoji) => {
        setReactions(prev => {
            const current = prev[messageId] || [];
            if (current.includes(emoji)) {
                return { ...prev, [messageId]: current.filter(e => e !== emoji) };
            }
            return { ...prev, [messageId]: [...current, emoji] };
        });
    };

    const handleCreateActivityNote = () => {
        if (!newNoteText.trim()) return;

        const newAct = {
            id: 'note-' + Date.now(),
            type: 'note',
            title: `Nota: ${newNoteText.slice(0, 30)}...`,
            description: newNoteText,
            date: 'Hoy',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            tag: newNoteTag,
            badgeColor: newNoteTag === 'Urgente' ? 'red' : newNoteTag === 'Entregable' ? 'emerald' : 'cyan',
            hasNotes: true
        };

        setActivities(prev => [newAct, ...prev]);
        setNewNoteText('');
        setIsAddingNote(false);
        toast.success("Nota Estratégica Guardada", { description: "Se ha registrado en el Activity Log del cliente." });
    };

    // Filter Activities
    const filteredActivities = useMemo(() => {
        return activities.filter(act => {
            const matchesSearch = act.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
                act.description.toLowerCase().includes(activitySearch.toLowerCase());
            
            if (!matchesSearch) return false;

            if (activityTab === 'history') return true;
            if (activityTab === 'notes') return act.type === 'note';
            if (activityTab === 'calls') return act.type === 'call';
            if (activityTab === 'files') return act.type === 'file' || act.fileName;

            return true;
        });
    }, [activities, activitySearch, activityTab]);

    return (
        <div className="h-[calc(100vh-140px)] min-h-[680px] flex gap-5 font-sans">
            
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 1. LEFT PANEL: CONVERSATIONS LIST (Clean CRM sidebar)         */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="w-80 shrink-0 bg-[#0E0E18] border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl">
                {/* Header & Search */}
                <div className="p-5 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <h2 className="text-white font-black text-sm uppercase tracking-wider">Conversaciones</h2>
                        </div>
                        <button
                            onClick={() => {
                                setActiveChat({
                                    id: 'ia',
                                    type: 'ia',
                                    name: 'DIIC Estratega IA',
                                    role: 'Copiloto de IA & Estrategia',
                                    avatar: '🤖',
                                    isAi: true,
                                    status: 'online',
                                    email: 'copilot@diiczone.ai',
                                    phone: 'IA Cloud Node v2.5',
                                    location: 'DIIC Global Neural Net',
                                    tier: 'Asistente Multi-Agente',
                                    niche: 'Inteligencia de Negocios'
                                });
                                toast.info("Canal IA activado", { description: "Listo para consultas estratégicas inmediatas." });
                            }}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 flex items-center justify-center transition-all"
                            title="Nueva consulta IA"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar canal o contacto..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'ia', label: 'IA' },
                            { id: 'clients', label: 'Clientes' },
                            { id: 'team', label: 'Equipo' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterCategory(tab.id)}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    filterCategory === tab.id
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conversation Cards List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-xs italic">
                            No se encontraron conversaciones.
                        </div>
                    ) : (
                        filteredConversations.map(conv => {
                            const isSelected = activeChat.id === conv.id;
                            const IconComp = conv.lastActionIcon || MessageSquare;

                            return (
                                <motion.div
                                    key={conv.id}
                                    onClick={() => handleSelectChat(conv)}
                                    whileHover={{ x: 3 }}
                                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border relative overflow-hidden ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-cyan-950/40 to-indigo-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                                            : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {/* Active Glow indicator */}
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                    )}

                                    <div className="flex items-start gap-3">
                                        {/* Avatar with Status badge */}
                                        <div className="relative shrink-0">
                                            {conv.isAi ? (
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                                                    <Bot className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                                    {conv.avatar}
                                                </div>
                                            )}
                                            <div className={`w-2.5 h-2.5 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-[#0E0E18] ${
                                                conv.status === 'online' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-gray-500'
                                            }`} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                                    {conv.name}
                                                </h4>
                                                {conv.unread > 0 && (
                                                    <span className="w-4 h-4 rounded-full bg-cyan-500 text-black font-black text-[9px] flex items-center justify-center shrink-0">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-[10px] text-gray-400 truncate mb-1.5 font-medium">
                                                {conv.role}
                                            </p>

                                            {/* Last Action Pill */}
                                            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5 truncate">
                                                <IconComp className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                                                <span className="truncate">{conv.lastAction}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 2. MAIN CENTER & RIGHT AREA                                  */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                
                {/* ───────────────────────────────────────────────────────────── */}
                {/* A. TOP CONTACT & CLIENT PROFILE CARD                         */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Avatar, Name and Roles */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {activeChat.type === 'ia' ? (
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                                        <Bot className="w-8 h-8" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-cyan-600/30">
                                        {activeChat.avatar || activeChat.name?.charAt(0)}
                                    </div>
                                )}
                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0E0E18] shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-black text-white tracking-tight">{activeChat.name}</h3>
                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        {activeChat.tier || 'Activo'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                                    <span>{activeChat.role}</span>
                                    {activeChat.niche && (
                                        <>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-indigo-400 font-bold">{activeChat.niche}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Action Call & Meet Buttons */}
                        <div className="flex items-center gap-2">
                            {activeChat.phone && activeChat.phone.startsWith('+') && (
                                <a
                                    href={`https://wa.me/${activeChat.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                </a>
                            )}
                            <button
                                onClick={() => {
                                    const meetUrl = `https://meet.google.com/new`;
                                    window.open(meetUrl, '_blank');
                                    toast.success("Sala de Meet Iniciada", { description: "Enlace generado para sesión estratégica." });
                                }}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm"
                            >
                                <Video className="w-3.5 h-3.5" />
                                <span>Videollamada</span>
                            </button>
                        </div>
                    </div>

                    {/* Metadata Grid (Phone, Email, Address, Tier) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2.5 text-xs text-gray-300">
                            <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <div className="truncate">
                                <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Teléfono / Canal</p>
                                <p className="font-semibold truncate text-white">{activeChat.phone || 'No especificado'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-gray-300">
                            <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <div className="truncate">
                                <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Correo Electrónico</p>
                                <p className="font-semibold truncate text-white">{activeChat.email || 'No especificado'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-gray-300">
                            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <div className="truncate">
                                <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Ubicación / Ciudad</p>
                                <p className="font-semibold truncate text-white">{activeChat.location || 'Ecuador'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-gray-300">
                            <Briefcase className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <div className="truncate">
                                <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Estrategia & Plan</p>
                                <p className="font-semibold truncate text-white">{activeChat.tier || 'Asignado'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Profile Actions */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <button
                            onClick={() => {
                                handleSendMessage("📄 Adjunto el último reporte y propuesta de contenidos para revisión.");
                                toast.success("Documento adjuntado al chat");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-[11px] font-bold transition-all"
                        >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Enviar Documento</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsAddingNote(true);
                                setActivityTab('notes');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-[11px] font-bold transition-all"
                        >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Nueva Nota</span>
                        </button>

                        <button
                            onClick={() => {
                                handleSendMessage("⚡ Solicitud: Generar nuevo brief de contenidos para este cliente.");
                                toast.info("Brief solicitado a la IA");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-[11px] font-bold transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Crear Brief / Tarea</span>
                        </button>
                    </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* B. SPLIT WORKSPACE: ACTIVITY LOG (Left) + LIVE CHAT (Right)  */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-0">
                    
                    {/* ────── B.1 ACTIVITY LOG PANEL (5 Cols) ────── */}
                    <div className="lg:col-span-5 bg-[#0E0E18] border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl">
                        {/* Header & Tabs */}
                        <div className="p-4 border-b border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Activity Log</h4>
                                </div>
                                <button
                                    onClick={() => setIsAddingNote(!isAddingNote)}
                                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    <span>Registrar</span>
                                </button>
                            </div>

                            {/* Subtabs */}
                            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                                {[
                                    { id: 'history', label: 'Historial' },
                                    { id: 'notes', label: 'Notas' },
                                    { id: 'calls', label: 'Llamadas' },
                                    { id: 'files', label: 'Archivos' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActivityTab(tab.id)}
                                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                                            activityTab === tab.id
                                                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* New Note Creator Form (Toggled) */}
                        <AnimatePresence>
                            {isAddingNote && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-3 bg-white/[0.02] border-b border-white/5 space-y-2 overflow-hidden"
                                >
                                    <textarea
                                        value={newNoteText}
                                        onChange={(e) => setNewNoteText(e.target.value)}
                                        placeholder="Escribe una nota estratégica o acuerdo con el cliente..."
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none h-16"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {['Estrategia', 'Reunión', 'Entregable', 'Urgente'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setNewNoteTag(tag)}
                                                    className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                                                        newNoteTag === tag
                                                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                                            : 'bg-white/5 text-gray-500 border-white/5'
                                                    }`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => setIsAddingNote(false)}
                                                className="px-2 py-1 rounded text-[10px] text-gray-400 hover:text-white"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleCreateActivityNote}
                                                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold shadow-md shadow-cyan-600/20"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Activities Timeline Feed */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                            {filteredActivities.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-xs italic">
                                    No hay registros de actividad en esta categoría.
                                </div>
                            ) : (
                                filteredActivities.map(act => (
                                    <div
                                        key={act.id}
                                        className="p-3.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl transition-all space-y-2 group"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                                                    act.type === 'call' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                                                    act.type === 'file' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                                }`}>
                                                    {act.type === 'call' ? <Video className="w-3 h-3" /> :
                                                     act.type === 'file' ? <FileText className="w-3 h-3" /> :
                                                     <Edit3 className="w-3 h-3" />}
                                                </div>
                                                <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                    {act.title}
                                                </h5>
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
                                                {act.time}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-gray-400 leading-relaxed pl-8">
                                            {act.description}
                                        </p>

                                        {/* File Card if present */}
                                        {act.fileName && (
                                            <div className="ml-8 p-2 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span className="text-[10px] font-bold text-gray-300 truncate">{act.fileName}</span>
                                                    <span className="text-[9px] text-gray-500 shrink-0">({act.fileSize})</span>
                                                </div>
                                                <button
                                                    onClick={() => toast.success(`Descargando ${act.fileName}`)}
                                                    className="p-1 text-gray-400 hover:text-emerald-400 transition-colors"
                                                >
                                                    <Download className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Actions and Tags */}
                                        <div className="flex items-center justify-between pl-8 pt-1 text-[9px]">
                                            <span className="text-gray-500 font-semibold">{act.tag || act.date}</span>
                                            
                                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {act.hasTranscript && (
                                                    <button
                                                        onClick={() => toast.info("Transcripción de la reunión", { description: "Revisión de acuerdos clave con el cliente." })}
                                                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-400 border border-white/5 text-[9px] font-bold"
                                                    >
                                                        Transcripción
                                                    </button>
                                                )}
                                                {act.hasNotes && (
                                                    <button
                                                        onClick={() => toast.info("Notas estratégicas", { description: act.description })}
                                                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 text-[9px] font-bold"
                                                    >
                                                        Notas
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* ────── B.2 LIVE CHAT PANEL (7 Cols) ────── */}
                    <div className="lg:col-span-7 bg-[#0E0E18] border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl">
                        
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                                    {activeChat.isAi ? <Bot className="w-4 h-4" /> : activeChat.name?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-white">{activeChat.name}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Canal Activo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mode indicator */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    {activeChat.type === 'ia' ? 'IA Copilot' : activeChat.type === 'client' ? 'Marca / Cliente' : 'Equipo Interno'}
                                </span>
                            </div>
                        </div>

                        {/* Messages Stream */}
                        <div
                            ref={chatScrollRef}
                            className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4"
                        >
                            {/* Render AI Quick Prompts if in IA mode */}
                            {activeChat.type === 'ia' && localMessages.filter(m => m.chatId === 'ia').length <= 1 && (
                                <div className="space-y-2 mb-4">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Sugerencias Rápidas:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {[
                                            "Generar 5 ideas de hooks para reels",
                                            "Redactar reporte de desempeño semanal",
                                            "Analizar tono de comunicación de la marca",
                                            "Estructurar guion para video de ventas"
                                        ].map((prompt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSendMessage(prompt)}
                                                className="p-2.5 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/15 border border-cyan-500/20 text-left text-[11px] text-cyan-300 font-medium transition-all flex items-center justify-between group"
                                            >
                                                <span className="truncate">{prompt}</span>
                                                <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message Feed Items */}
                            {((activeChat.type === 'client' || activeChat.type === 'team') ? realMessages : localMessages.filter(m => m.chatId === activeChat.id)).map(msg => {
                                const isMe = msg.sender === 'me' || msg.sender_id === user?.id;
                                const isAi = msg.sender === 'ai';
                                const msgText = msg.content || msg.text || '';
                                const msgTime = msg.time || (msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM');
                                const msgReactions = reactions[msg.id] || msg.reactions || [];

                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                                        <div className={`relative max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                                            isMe
                                                ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-tr-none shadow-cyan-950/40'
                                                : isAi
                                                    ? 'bg-gradient-to-br from-indigo-950/60 to-[#121226] border border-indigo-500/30 text-gray-200 rounded-tl-none backdrop-blur-md'
                                                    : 'bg-white/[0.04] border border-white/10 text-gray-200 rounded-tl-none'
                                        }`}>
                                            {/* AI Header Badge if AI */}
                                            {isAi && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1.5 pb-1 border-b border-indigo-500/20">
                                                    <Sparkles className="w-3 h-3" />
                                                    <span>DIIC Estratega AI</span>
                                                </div>
                                            )}

                                            <p className="whitespace-pre-line">{msgText}</p>

                                            <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/10 text-[9px] opacity-70">
                                                <span>{msgTime}</span>
                                                {isMe && <Check className="w-3 h-3 text-cyan-200" />}
                                            </div>

                                            {/* Floating Reaction Badges */}
                                            {msgReactions.length > 0 && (
                                                <div className="absolute -bottom-2 right-2 flex items-center gap-1 bg-[#161625] border border-white/10 px-1.5 py-0.5 rounded-full shadow-md">
                                                    {msgReactions.map((emoji, idx) => (
                                                        <span key={idx} className="text-[10px]">{emoji}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Reaction Trigger on Hover */}
                                        <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity px-1">
                                            {['🔥', '❤️', '👍', '⭐'].map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleAddReaction(msg.id, emoji)}
                                                    className="text-[10px] hover:scale-125 transition-transform"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing Indicator */}
                            {isTyping && activeChat.type === 'ia' && (
                                <div className="flex items-center gap-2 p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl w-fit">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic animate-pulse">
                                        Generando respuesta estratégica...
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Input & Context Tools Bar */}
                        <div className="p-4 border-t border-white/5 bg-white/[0.01] relative">
                            {/* Context Action Menu */}
                            <AnimatePresence>
                                {showContextOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-4 mb-3 z-30 bg-[#161625] border border-white/10 rounded-2xl p-3 shadow-2xl min-w-[220px] space-y-1 backdrop-blur-xl"
                                    >
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-2 mb-1.5">Acciones Rápidas:</p>
                                        {[
                                            { label: 'Revisión de Guion', icon: FileText, text: '📋 Envío guion para aprobación y rodaje.' },
                                            { label: 'Solicitar Reunión', icon: Video, text: '🎥 ¿Podemos agendar una videollamada de 15 minutos?' },
                                            { label: 'Métricas Semanales', icon: Sparkles, text: '📊 Aquí tienes el resumen de rendimiento de la semana.' },
                                            { label: 'Aviso Urgente', icon: ShieldCheck, text: '⚠️ Atención: Se requiere aprobación urgente para pauta.' }
                                        ].map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setInputValue(opt.text);
                                                    setShowContextOptions(false);
                                                }}
                                                className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 text-left text-xs text-gray-300 hover:text-white transition-all"
                                            >
                                                <opt.icon className="w-3.5 h-3.5 text-cyan-400" />
                                                <span>{opt.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Text Input Row */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowContextOptions(!showContextOptions)}
                                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                                        showContextOptions
                                            ? 'bg-cyan-600 border-cyan-500 text-white shadow-md shadow-cyan-600/30'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                    title="Plantillas y contexto"
                                >
                                    <Plus className={`w-4 h-4 transition-transform ${showContextOptions ? 'rotate-45' : ''}`} />
                                </button>

                                <div className="flex-1 relative flex items-center">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={`Escribe a ${activeChat.name}...`}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        className="absolute right-1.5 w-8 h-8 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-all shadow-md shadow-cyan-600/20"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
