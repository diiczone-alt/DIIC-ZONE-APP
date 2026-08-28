'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
    MessageSquare, Hash, Users, Send, Paperclip, Smile, Shield,
    User, Search, Loader2, Sparkles, AlertCircle, Image as ImageIcon, FileText, X,
    FolderOpen, Globe, Link as LinkIcon, Download, Music, File, Building2,
    Briefcase, Stethoscope, Sprout, Coffee, GraduationCap, Building,
    ChevronRight, ChevronDown, Check, ExternalLink, Phone, Mail,
    Info, Eye, ArrowUpRight, CheckCircle2, Star, Layers, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { messagingService } from '@/services/messagingService';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

const EMOJIS = ['👍', '🔥', '❤️', '😂', '🎉', '🚀', '🎬', '📸', '🙌', '👀', '✨', '💡', '✅', '💼', '📌'];

// Helper to determine role colors & department
const getRoleDetails = (role) => {
    const r = (role || '').toLowerCase();
    
    if (r.includes('diseña') || r.includes('designer') || r.includes('branding')) {
        return {
            department: 'Diseño Gráfico & Branding',
            depKey: 'design',
            text: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            badge: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
            avatar: 'bg-pink-950/50 text-pink-400 border border-pink-500/30'
        };
    }
    if (r.includes('editor') || r.includes('edici')) {
        return {
            department: 'Edición & Post-Producción',
            depKey: 'editing',
            text: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
            avatar: 'bg-purple-950/50 text-purple-400 border border-purple-500/30'
        };
    }
    if (r.includes('film') || r.includes('foto') || r.includes('cámara') || r.includes('camera')) {
        return {
            department: 'Filmmakers & Fotografía',
            depKey: 'production',
            text: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
            avatar: 'bg-orange-950/50 text-orange-400 border border-orange-500/30'
        };
    }
    if (r.includes('community') || r.includes('cm') || r.includes('estrateg')) {
        return {
            department: 'Community Management & Estrategia',
            depKey: 'cm_strategy',
            text: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            badge: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
            avatar: 'bg-indigo-950/50 text-indigo-400 border border-indigo-500/30'
        };
    }
    if (r.includes('audio') || r.includes('web') || r.includes('programad') || r.includes('model')) {
        return {
            department: 'Audio, Web & Especialistas',
            depKey: 'specialists',
            text: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
            avatar: 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
        };
    }

    return {
        department: 'Especialista General',
        depKey: 'other',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        avatar: 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30'
    };
};

// Helper for Client Industry / Niches
const getClientNiche = (client) => {
    const raw = `${client.industry || ''} ${client.specialty || ''} ${client.name || ''}`.toLowerCase();
    
    if (raw.includes('medico') || raw.includes('salud') || raw.includes('doctor') || raw.includes('hospital') || raw.includes('clinica') || raw.includes('uro') || raw.includes('cirug')) {
        return {
            key: 'salud',
            name: 'Salud & Sector Médico',
            icon: Stethoscope,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        };
    }
    if (raw.includes('agro') || raw.includes('campo') || raw.includes('ganad') || raw.includes('agric') || raw.includes('parcela')) {
        return {
            key: 'agro',
            name: 'Agropecuario & Campo',
            icon: Sprout,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        };
    }
    if (raw.includes('gastro') || raw.includes('restaurant') || raw.includes('comida') || raw.includes('bar') || raw.includes('pizza') || raw.includes('cafe')) {
        return {
            key: 'gastro',
            name: 'Gastronomía & Restaurantes',
            icon: Coffee,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        };
    }
    if (raw.includes('educa') || raw.includes('curso') || raw.includes('academia') || raw.includes('capacit')) {
        return {
            key: 'educacion',
            name: 'Educación & Cursos',
            icon: GraduationCap,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
        };
    }
    if (raw.includes('inmobil') || raw.includes('realestate') || raw.includes('bienes') || raw.includes('propied')) {
        return {
            key: 'inmobiliaria',
            name: 'Inmobiliaria & Bienes Raíces',
            icon: Building,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        };
    }

    return {
        key: 'corporativo',
        name: 'Corporativo & Marcas Personales',
        icon: Building2,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        badge: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
    };
};

export default function HQMessagesPage() {
    const { user } = useAuth();
    
    // Core state
    const [loading, setLoading] = useState(true);
    const [teamList, setTeamList] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [squads, setSquads] = useState([]);
    const [profileMap, setProfileMap] = useState({});
    
    // Main sidebar tab switcher: 'team' (Equipo Creativo) vs 'clients' (Clientes / Marcas)
    const [mainSidebarTab, setMainSidebarTab] = useState('team');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Selection state:
    // target = { id, name, type: 'channel' | 'dm' | 'client', role, clientData, memberData, squadData }
    const [selectedTarget, setSelectedTarget] = useState({ id: '', name: 'Selecciona una conversación', type: 'channel' });
    const [currentChatId, setCurrentChatId] = useState(null);
    
    // Messaging state
    const [messagesList, setMessagesList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [activeRightPanelTab, setActiveRightPanelTab] = useState('info'); // 'info' | 'media' | 'docs' | 'links'
    
    // Unread count tracking
    const [unreadCounts, setUnreadCounts] = useState({});
    
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages update
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesList]);

    // 1. Load team members, clients, profiles map, and group them into squads/departments
    useEffect(() => {
        const loadHQMessagesData = async () => {
            try {
                setLoading(true);
                
                // Fetch all profiles map
                const { data: allProfiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, role');
                const pMap = {};
                if (allProfiles) {
                    allProfiles.forEach(p => {
                        pMap[p.id] = p.full_name;
                    });
                }
                setProfileMap(pMap);
                
                // Fetch team members and clients in parallel
                const [teamRes, clientsRes] = await Promise.all([
                    agencyService.getTeam().catch(() => []),
                    agencyService.getClients().catch(() => [])
                ]);
                
                const safeTeam = Array.isArray(teamRes) ? teamRes : [];
                const safeClients = Array.isArray(clientsRes) ? clientsRes : [];
                
                setTeamList(safeTeam);
                setClientList(safeClients);
                
                // Group CMs as Squad Leads
                const cms = safeTeam.filter(m => 
                    m.role?.toLowerCase()?.includes('community') || 
                    m.role?.toLowerCase() === 'cm' ||
                    m.role?.toLowerCase()?.includes('estrateg')
                );
                
                const squadGroups = cms.map(cm => {
                    const members = safeTeam.filter(m => m.squad_lead_id === cm.id || m.cm_assigned === cm.name);
                    const assignedClients = safeClients.filter(c => (c.cm || '').toLowerCase().includes(cm.name?.toLowerCase()));
                    return {
                        lead: cm,
                        members: members,
                        clients: assignedClients
                    };
                });
                
                setSquads(squadGroups);
                
                // Auto-select the first squad or team member
                if (squadGroups.length > 0) {
                    const firstSquad = squadGroups[0];
                    setSelectedTarget({
                        id: firstSquad.lead.id,
                        name: `Escuadra General - ${firstSquad.lead.name}`,
                        type: 'channel',
                        squadData: firstSquad
                    });
                } else if (safeTeam.length > 0) {
                    const firstMember = safeTeam[0];
                    setSelectedTarget({
                        id: firstMember.id,
                        name: firstMember.name,
                        type: 'dm',
                        role: firstMember.role,
                        memberData: firstMember
                    });
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error loading HQ messaging data:", err);
                toast.error("Error al cargar la información del equipo y clientes.");
                setLoading(false);
            }
        };

        loadHQMessagesData();
    }, [user]);

    // 2. Fetch or create a Chat Thread when active target changes
    useEffect(() => {
        if (!user || !selectedTarget.id) return;

        const getChatThread = async () => {
            try {
                let chatId = null;

                if (selectedTarget.type === 'channel') {
                    // Squad channel
                    const cmId = selectedTarget.id;
                    const chat = await messagingService.getOrCreateSquadChat(cmId, 'general');
                    chatId = chat.id;
                } else if (selectedTarget.type === 'client') {
                    // Direct Brand/Client chat
                    const clientId = selectedTarget.id;
                    const chat = await messagingService.getOrCreateClientChat(clientId);
                    chatId = chat.id;
                } else {
                    // Direct Talent / Creative DM
                    const chat = await messagingService.getOrCreateDirectChat(user.id, selectedTarget.id);
                    chatId = chat.id;
                }

                setCurrentChatId(chatId);
            } catch (err) {
                console.error("Error setting up chat thread:", err);
                setCurrentChatId(null);
                setMessagesList([]);
            }
        };

        getChatThread();
    }, [selectedTarget, user]);

    // 3. Fetch messages for the active chat
    useEffect(() => {
        if (!currentChatId || !user) {
            setMessagesList([]);
            return;
        }

        const fetchMsgs = async () => {
            try {
                const msgs = await messagingService.getMessages(currentChatId, 60);
                const mapped = msgs.map(m => {
                    const isSelf = m.sender_id === user.id;
                    const senderName = isSelf 
                        ? 'Tú (HQ)' 
                        : (profileMap[m.sender_id] || 'Colega');

                    return {
                        id: m.id,
                        user: senderName,
                        senderId: m.sender_id,
                        text: m.content,
                        time: new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                        self: isSelf,
                        isFile: m.metadata?.isFile || false,
                        isImage: m.metadata?.isImage || false,
                        fileUrl: m.metadata?.fileUrl || '',
                        fileName: m.metadata?.fileName || ''
                    };
                });
                setMessagesList(mapped);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMsgs();
    }, [currentChatId, user, profileMap]);

    // 4. Global real-time subscription for messages
    useEffect(() => {
        if (!user) return;

        const globalChannel = supabase
            .channel('global-hq-messages-live')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            }, (payload) => {
                const newDbMsg = payload.new;
                
                // Active chat match
                if (currentChatId && newDbMsg.chat_id === currentChatId) {
                    setMessagesList(prev => {
                        if (prev.some(m => m.id === newDbMsg.id)) return prev;

                        const isSelf = newDbMsg.sender_id === user.id;
                        const senderName = isSelf ? 'Tú (HQ)' : (profileMap[newDbMsg.sender_id] || 'Colega');

                        return [...prev, {
                            id: newDbMsg.id,
                            user: senderName,
                            senderId: newDbMsg.sender_id,
                            text: newDbMsg.content,
                            time: new Date(newDbMsg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            self: isSelf,
                            isFile: newDbMsg.metadata?.isFile || false,
                            isImage: newDbMsg.metadata?.isImage || false,
                            fileUrl: newDbMsg.metadata?.fileUrl || '',
                            fileName: newDbMsg.metadata?.fileName || ''
                        }];
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(globalChannel);
        };
    }, [currentChatId, user, profileMap]);

    // Group Creative Team by Department
    const creativeDepartments = useMemo(() => {
        const groups = {
            'design': { name: 'Diseño Gráfico & Branding', icon: '🎨', color: 'text-pink-400', members: [] },
            'editing': { name: 'Edición & Post-Producción', icon: '🎬', color: 'text-purple-400', members: [] },
            'production': { name: 'Filmmakers & Fotografía', icon: '🎥', color: 'text-orange-400', members: [] },
            'cm_strategy': { name: 'Community Managers & Estrategas', icon: '📱', color: 'text-indigo-400', members: [] },
            'specialists': { name: 'Audio, Web & Especialistas', icon: '🎧', color: 'text-emerald-400', members: [] },
            'other': { name: 'Otros Nodos de Talento', icon: '⚡', color: 'text-cyan-400', members: [] }
        };

        teamList.forEach(member => {
            const details = getRoleDetails(member.role);
            if (groups[details.depKey]) {
                groups[details.depKey].members.push(member);
            } else {
                groups['other'].members.push(member);
            }
        });

        return Object.values(groups).filter(g => g.members.length > 0);
    }, [teamList]);

    // Group Clients by Industry Niches
    const clientNiches = useMemo(() => {
        const groups = {};

        clientList.forEach(client => {
            const niche = getClientNiche(client);
            if (!groups[niche.key]) {
                groups[niche.key] = {
                    ...niche,
                    clients: []
                };
            }
            groups[niche.key].clients.push(client);
        });

        return Object.values(groups);
    }, [clientList]);

    // Filtered lists by search
    const filteredTeamMembers = useMemo(() => {
        if (!searchQuery.trim()) return teamList;
        const q = searchQuery.toLowerCase();
        return teamList.filter(m => 
            m.name?.toLowerCase().includes(q) || 
            m.role?.toLowerCase().includes(q) ||
            m.city?.toLowerCase().includes(q)
        );
    }, [teamList, searchQuery]);

    const filteredClients = useMemo(() => {
        if (!searchQuery.trim()) return clientList;
        const q = searchQuery.toLowerCase();
        return clientList.filter(c => 
            c.name?.toLowerCase().includes(q) || 
            c.industry?.toLowerCase().includes(q) ||
            c.plan?.toLowerCase().includes(q) ||
            c.city?.toLowerCase().includes(q)
        );
    }, [clientList, searchQuery]);

    // Extract shared media, docs, and links from active conversation
    const sharedData = useMemo(() => {
        const media = [];
        const docs = [];
        const links = [];

        messagesList.forEach(m => {
            if (m.isImage) {
                media.push(m);
            } else if (m.isFile) {
                docs.push(m);
            }
            
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const foundUrls = m.text ? m.text.match(urlRegex) : null;
            if (foundUrls) {
                foundUrls.forEach(url => {
                    links.push({
                        id: `${m.id}-${url}`,
                        url: url,
                        user: m.user,
                        time: m.time
                    });
                });
            }
        });

        return { media, docs, links };
    }, [messagesList]);

    // Handle Send Message
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const text = inputText.trim();
        if (!text || !currentChatId || !user || isSending) return;

        setIsSending(true);
        setInputText('');

        try {
            await messagingService.sendMessage(currentChatId, user.id, text, {});
        } catch (err) {
            console.error("Error sending message:", err);
            toast.error("Error al enviar mensaje.");
            setInputText(text); // Restore text on error
        } finally {
            setIsSending(false);
        }
    };

    // Handle File Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !currentChatId || !user) return;

        const isImage = file.type.startsWith('image/');
        const toastId = toast.loading(`Subiendo ${isImage ? 'imagen' : 'archivo'}...`);

        try {
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const { data, error } = await supabase.storage
                .from('chat-attachments')
                .upload(fileName, file);

            let fileUrl = '';
            if (!error && data) {
                const { data: publicUrlData } = supabase.storage
                    .from('chat-attachments')
                    .getPublicUrl(fileName);
                fileUrl = publicUrlData?.publicUrl || '';
            }

            await messagingService.sendMessage(
                currentChatId,
                user.id,
                isImage ? `📷 Imagen enviada: ${file.name}` : `📎 Archivo adjunto: ${file.name}`,
                {
                    isFile: true,
                    isImage: isImage,
                    fileName: file.name,
                    fileUrl: fileUrl,
                    fileSize: file.size
                }
            );

            toast.dismiss(toastId);
            toast.success("Archivo compartido con éxito.");
        } catch (err) {
            console.error("Error uploading file:", err);
            toast.dismiss(toastId);
            toast.error("No se pudo subir el archivo.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (loading && teamList.length === 0 && clientList.length === 0) {
        return (
            <div className="min-h-screen bg-[#050511] flex flex-col items-center justify-center text-white gap-6">
                <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div className="space-y-1 text-center">
                    <p className="font-black uppercase tracking-[0.3em] text-xs text-indigo-400 animate-pulse">Cargando Centro de Mensajería HQ</p>
                    <p className="text-[10px] text-gray-500 font-mono">Conectando canales de creativos y nichos de clientes</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col p-4 md:p-8">
            
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload} 
            />

            {/* Top Page Header */}
            <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5 shrink-0">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight">
                            CENTRO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">MENSAJERÍA HQ</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 text-xs mt-1 font-medium">
                        Supervisión, directivas operativas y comunicación directa con el equipo creativo y cartera de clientes.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>HQ REALTIME LIVE</span>
                    </div>

                    <button
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
                            showRightPanel 
                                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                        title="Alternar Panel de Inteligencia"
                    >
                        <Info className="w-4 h-4" />
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-wider">Ficha Contexto</span>
                    </button>
                </div>
            </header>

            {/* Main 3-Column Work Area */}
            <div className="flex-1 flex rounded-[32px] overflow-hidden border border-white/10 bg-[#070718] shadow-2xl min-h-[600px]">
                
                {/* --- COLUMN 1: LEFT NAVIGATION SIDEBAR (TEAM & CLIENTS) --- */}
                <div className="w-80 md:w-96 bg-black/40 border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
                    
                    {/* Primary Tab Switcher: Equipo Creativo vs Clientes */}
                    <div className="p-3 bg-white/[0.02] border-b border-white/5">
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setMainSidebarTab('team')}
                                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider transition-all ${
                                    mainSidebarTab === 'team'
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span>Equipo ({teamList.length})</span>
                            </button>

                            <button
                                onClick={() => setMainSidebarTab('clients')}
                                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider transition-all ${
                                    mainSidebarTab === 'clients'
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>Clientes ({clientList.length})</span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="mt-3 relative">
                            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={mainSidebarTab === 'team' ? 'Buscar talento o departamento...' : 'Buscar cliente o nicho...'}
                                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-indigo-500/40 text-xs text-white placeholder:text-gray-600 outline-none transition-all font-medium"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Channels & Directory List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
                        
                        {/* === VIEW A: EQUIPO CREATIVO (ESCUADRAS & DEPARTAMENTOS) === */}
                        {mainSidebarTab === 'team' && (
                            <>
                                {/* 1. Escuadras Operativas */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5" />
                                            <span>Escuadras Operativas</span>
                                        </div>
                                        <span className="text-[9px] text-gray-500 font-mono">{squads.length} Grupos</span>
                                    </div>

                                    <div className="space-y-1.5">
                                        {squads.map(squad => {
                                            const isSelected = selectedTarget.type === 'channel' && selectedTarget.id === squad.lead.id;
                                            return (
                                                <div key={squad.lead.id} className="rounded-2xl border border-white/5 bg-white/[0.01] p-2 space-y-1.5">
                                                    {/* Squad General Channel */}
                                                    <button
                                                        onClick={() => setSelectedTarget({
                                                            id: squad.lead.id,
                                                            name: `Escuadra General - ${squad.lead.name}`,
                                                            type: 'channel',
                                                            squadData: squad
                                                        })}
                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                                                            isSelected
                                                                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 shadow-md'
                                                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 truncate">
                                                            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                                                            <span className="truncate font-black">Escuadra {squad.lead.name}</span>
                                                        </div>
                                                        <span className="text-[9px] font-mono text-gray-500 uppercase px-1.5 py-0.5 rounded bg-black/40 border border-white/5 shrink-0">
                                                            {squad.members.length} Nodos
                                                        </span>
                                                    </button>

                                                    {/* Nested Squad Members */}
                                                    {squad.members.length > 0 && (
                                                        <div className="pl-3.5 space-y-1 border-l border-white/5 ml-3">
                                                            {squad.members.map(member => {
                                                                const isMemSelected = selectedTarget.type === 'dm' && selectedTarget.id === member.id;
                                                                const roleStyle = getRoleDetails(member.role);
                                                                return (
                                                                    <button
                                                                        key={member.id}
                                                                        onClick={() => setSelectedTarget({
                                                                            id: member.id,
                                                                            name: member.name,
                                                                            type: 'dm',
                                                                            role: member.role,
                                                                            memberData: member
                                                                        })}
                                                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left ${
                                                                            isMemSelected
                                                                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                                                                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2 truncate">
                                                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleStyle.text.replace('text-', 'bg-')}`} />
                                                                            <span className="truncate font-bold">{member.name}</span>
                                                                        </div>
                                                                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded shrink-0 ${roleStyle.badge}`}>
                                                                            {member.role?.split(' ')[0]}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. Departamentos Creativos Especializados */}
                                <div className="space-y-3 pt-2">
                                    <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                                        <span>Por Departamento Creativo</span>
                                    </div>

                                    <div className="space-y-3">
                                        {creativeDepartments.map((dept, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex items-center justify-between px-2.5 py-1 bg-white/[0.02] border-l-2 border-indigo-500/40 rounded-r-lg">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                                                        <span>{dept.icon}</span>
                                                        <span>{dept.name}</span>
                                                    </span>
                                                    <span className="text-[9px] font-mono text-gray-500">
                                                        {dept.members.length}
                                                    </span>
                                                </div>

                                                <div className="space-y-0.5">
                                                    {dept.members.map(member => {
                                                        const isSelected = selectedTarget.type === 'dm' && selectedTarget.id === member.id;
                                                        const roleDetails = getRoleDetails(member.role);
                                                        return (
                                                            <button
                                                                key={member.id}
                                                                onClick={() => setSelectedTarget({
                                                                    id: member.id,
                                                                    name: member.name,
                                                                    type: 'dm',
                                                                    role: member.role,
                                                                    memberData: member
                                                                })}
                                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                                                                    isSelected
                                                                        ? 'bg-indigo-600/25 text-white border border-indigo-500/30'
                                                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2.5 truncate">
                                                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black uppercase shrink-0 ${roleDetails.avatar}`}>
                                                                        {member.name.charAt(0)}
                                                                    </div>
                                                                    <div className="truncate">
                                                                        <p className="truncate text-white font-bold leading-tight">{member.name}</p>
                                                                        <p className="text-[9px] text-gray-500 font-medium truncate">{member.city || 'Santo Domingo'}</p>
                                                                    </div>
                                                                </div>

                                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0 ${roleDetails.badge}`}>
                                                                    {member.role}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* === VIEW B: CLIENTES & MARCAS (DIVIDIDO POR NICHOS) === */}
                        {mainSidebarTab === 'clients' && (
                            <div className="space-y-4">
                                <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5" />
                                        <span>Cartera por Nicho</span>
                                    </div>
                                    <span className="text-[9px] text-gray-500 font-mono">{clientList.length} Marcas</span>
                                </div>

                                <div className="space-y-4">
                                    {clientNiches.map((niche) => {
                                        const NicheIcon = niche.icon;
                                        return (
                                            <div key={niche.key} className="space-y-1.5">
                                                <div className="flex items-center justify-between px-2.5 py-1.5 bg-white/[0.02] border-l-2 border-emerald-500/40 rounded-r-lg">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                                                        <NicheIcon className={`w-3.5 h-3.5 ${niche.color}`} />
                                                        <span>{niche.name}</span>
                                                    </span>
                                                    <span className="text-[9px] font-mono text-gray-500">
                                                        {niche.clients.length}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    {niche.clients.map(client => {
                                                        const isSelected = selectedTarget.type === 'client' && selectedTarget.id === client.id;
                                                        return (
                                                            <button
                                                                key={client.id}
                                                                onClick={() => setSelectedTarget({
                                                                    id: client.id,
                                                                    name: client.name,
                                                                    type: 'client',
                                                                    clientData: client
                                                                })}
                                                                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                                                                    isSelected
                                                                        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border border-indigo-500/40 shadow-lg'
                                                                        : 'bg-white/[0.01] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2.5 truncate">
                                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-black text-xs text-white shrink-0">
                                                                        {client.name.charAt(0)}
                                                                    </div>
                                                                    <div className="truncate">
                                                                        <p className="truncate text-white font-bold leading-tight">{client.name}</p>
                                                                        <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                                                                            {client.city || 'Santo Domingo'} • CM: {client.cm || 'Leslie'}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right shrink-0">
                                                                    <span className="text-[9px] font-black text-emerald-400 block font-mono">
                                                                        ${client.price || '0'}/m
                                                                    </span>
                                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                                                                        {client.plan || 'Presencia'}
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* --- COLUMN 2: CENTER CHAT WINDOW --- */}
                <div className="flex-1 flex flex-col bg-[#050514]/60 relative overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                        <div className="flex items-center gap-3.5">
                            {selectedTarget.type === 'channel' ? (
                                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                    <Users className="w-5 h-5" />
                                </div>
                            ) : selectedTarget.type === 'client' ? (
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
                                    {selectedTarget.name.charAt(0)}
                                </div>
                            ) : (
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${getRoleDetails(selectedTarget.role).avatar}`}>
                                    {selectedTarget.name.charAt(0)}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-black text-sm md:text-base tracking-tight">
                                        {selectedTarget.name}
                                    </h3>
                                    {selectedTarget.type === 'client' && (
                                        <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md">
                                            Cliente Verificado
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                                    {selectedTarget.type === 'channel' ? (
                                        <span>Canal General de Escuadra • Directivas Operativas</span>
                                    ) : selectedTarget.type === 'client' ? (
                                        <span>{selectedTarget.clientData?.plan || 'Plan Activo'} • {selectedTarget.clientData?.city || 'Ecuador'}</span>
                                    ) : (
                                        <span>{selectedTarget.role || 'Especialista'} • {selectedTarget.memberData?.city || 'Sede Operativa'}</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Quick WhatsApp Contact if available */}
                            {(selectedTarget.memberData?.whatsapp || selectedTarget.clientData?.whatsapp_number) && (
                                <a
                                    href={`https://wa.me/${(selectedTarget.memberData?.whatsapp || selectedTarget.clientData?.whatsapp_number || '').replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 text-xs font-bold"
                                    title="Abrir WhatsApp"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span className="hidden lg:inline text-[10px] font-black uppercase">WhatsApp</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                        {messagesList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50 space-y-3">
                                <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                    <MessageSquare className="w-8 h-8 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest font-black text-indigo-300">Canal de Comunicación HQ</p>
                                    <p className="text-xs text-gray-500 mt-1 max-w-sm">
                                        Escribe el primer mensaje o directiva para coordinar en tiempo real con este destinatario.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            messagesList.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.self ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg ${
                                        msg.self 
                                            ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white' 
                                            : 'bg-white/10 text-gray-200 border border-white/10'
                                    }`}>
                                        {msg.user.charAt(0)}
                                    </div>

                                    <div className={`max-w-[75%] space-y-1 ${msg.self ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-[11px] font-bold text-gray-300">{msg.user}</span>
                                            <span className="text-[9px] text-gray-500 font-mono">{msg.time}</span>
                                        </div>

                                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                            msg.self
                                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10'
                                                : 'bg-white/[0.04] border border-white/10 text-gray-200 rounded-tl-none'
                                        }`}>
                                            {/* Image Preview */}
                                            {msg.isImage && msg.fileUrl && (
                                                <div className="mb-2 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                                    <img 
                                                        src={msg.fileUrl} 
                                                        alt={msg.fileName || 'Imagen'} 
                                                        className="max-h-60 w-auto object-cover hover:scale-105 transition-transform cursor-pointer"
                                                        onClick={() => window.open(msg.fileUrl, '_blank')}
                                                    />
                                                </div>
                                            )}

                                            {/* File Attachment Card */}
                                            {msg.isFile && !msg.isImage && (
                                                <div className="mb-2 p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                                                        <span className="truncate text-xs font-bold text-gray-200">{msg.fileName}</span>
                                                    </div>
                                                    {msg.fileUrl && (
                                                        <a 
                                                            href={msg.fileUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                                            title="Descargar"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-4 border-t border-white/5 bg-black/30 relative">
                        {/* Quick Emoji Picker Popover */}
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-20 left-6 bg-[#0E0E20] border border-white/10 rounded-2xl p-3 shadow-2xl z-50 flex flex-wrap gap-2 max-w-xs"
                                >
                                    {EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                                setInputText(prev => prev + emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className="text-lg hover:scale-125 transition-transform p-1"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-indigo-400 transition-colors"
                                title="Adjuntar archivo o imagen"
                            >
                                <Paperclip className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-3 rounded-2xl border transition-colors ${
                                    showEmojiPicker ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white'
                                }`}
                                title="Insertar emoji"
                            >
                                <Smile className="w-4 h-4" />
                            </button>

                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={`Enviar mensaje a ${selectedTarget.name}...`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            />

                            <button
                                type="submit"
                                disabled={!inputText.trim() || isSending}
                                className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-600/30 disabled:opacity-40 transition-all cursor-pointer"
                            >
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- COLUMN 3: RIGHT CONTEXT & INTELLIGENCE PANEL (AREA MARCADA EN ROJO) --- */}
                <AnimatePresence>
                    {showRightPanel && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 340, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="border-l border-white/10 bg-[#060614] flex flex-col shrink-0 overflow-hidden"
                        >
                            {/* Panel Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    <span>Inteligencia & Contexto</span>
                                </div>
                                <button
                                    onClick={() => setShowRightPanel(false)}
                                    className="p-1 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Subtabs for Right Panel */}
                            <div className="flex border-b border-white/5 text-[11px] font-bold shrink-0 bg-black/20">
                                {[
                                    { id: 'info', label: 'Ficha' },
                                    { id: 'media', label: `Media (${sharedData.media.length})` },
                                    { id: 'docs', label: `Archivos (${sharedData.docs.length})` },
                                    { id: 'links', label: `Links (${sharedData.links.length})` }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveRightPanelTab(tab.id)}
                                        className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                                            activeRightPanelTab === tab.id
                                                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                                                : 'border-transparent text-gray-500 hover:text-gray-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Panel Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                                
                                {/* TAB 1: FICHA DE CONTEXTO */}
                                {activeRightPanelTab === 'info' && (
                                    <>
                                        {/* CASE A: TALENTO / CREATIVO */}
                                        {selectedTarget.type === 'dm' && selectedTarget.memberData && (
                                            <div className="space-y-4">
                                                {/* Profile Card */}
                                                <div className="p-5 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 text-center space-y-3">
                                                    <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xl">
                                                        {selectedTarget.memberData.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black text-white">{selectedTarget.memberData.name}</h4>
                                                        <p className="text-xs text-indigo-400 font-bold mt-0.5">{selectedTarget.memberData.role}</p>
                                                        <span className="inline-block mt-2 text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                            ● Nodo Operativo Activo
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Operational Details */}
                                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Datos Operativos</h5>
                                                    <div className="space-y-2 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Departamento:</span>
                                                            <span className="font-bold text-gray-200">{getRoleDetails(selectedTarget.memberData.role).department}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Sede / Ciudad:</span>
                                                            <span className="font-bold text-gray-200">{selectedTarget.memberData.city || 'Santo Domingo'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Esquema Pago:</span>
                                                            <span className="font-mono text-emerald-400 font-bold">
                                                                {Number(selectedTarget.memberData.salary) > 0 ? `$${selectedTarget.memberData.salary}/mes` : 'Por Entregable'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Action Links */}
                                                <div className="space-y-2">
                                                    <a
                                                        href={`/dashboard/hq/team`}
                                                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-center text-white flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <span>Gestionar en Escuadra</span>
                                                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                                                    </a>
                                                    <a
                                                        href={`/dashboard/hq/control`}
                                                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-bold text-center text-indigo-300 flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <span>Asignar Nueva Tarea</span>
                                                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* CASE B: CLIENTE / MARCA */}
                                        {selectedTarget.type === 'client' && selectedTarget.clientData && (
                                            <div className="space-y-4">
                                                {/* Brand Card */}
                                                <div className="p-5 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 text-center space-y-3">
                                                    <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-xl">
                                                        {selectedTarget.clientData.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black text-white">{selectedTarget.clientData.name}</h4>
                                                        <p className="text-xs text-emerald-400 font-bold mt-0.5">{getClientNiche(selectedTarget.clientData).name}</p>
                                                        <span className="inline-block mt-2 text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                                                            Plan: {selectedTarget.clientData.plan || 'Presencia'} (${selectedTarget.clientData.price || '0'}/m)
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Operational & Squad Assignment */}
                                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Equipo Asignado</h5>
                                                    <div className="space-y-2 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">CM Asignada:</span>
                                                            <span className="font-bold text-indigo-400">{selectedTarget.clientData.cm || 'Leslie'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Filmmaker:</span>
                                                            <span className="font-bold text-orange-400">{selectedTarget.clientData.filmmaker || 'Anthony'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Editor:</span>
                                                            <span className="font-bold text-purple-400">{selectedTarget.clientData.editor || 'Fausto'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Ciudad:</span>
                                                            <span className="font-bold text-gray-200">{selectedTarget.clientData.city || 'Santo Domingo'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Action Links */}
                                                <div className="space-y-2">
                                                    <a
                                                        href={`/dashboard/hq/clients`}
                                                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-center text-white flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <span>Ver Perfil Estratégico</span>
                                                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* CASE C: CANAL GENERAL DE ESCUADRA */}
                                        {selectedTarget.type === 'channel' && selectedTarget.squadData && (
                                            <div className="space-y-4">
                                                <div className="p-5 rounded-3xl bg-gradient-to-b from-indigo-950/20 to-transparent border border-indigo-500/20 text-center space-y-2">
                                                    <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                                                        <Users className="w-7 h-7" />
                                                    </div>
                                                    <h4 className="text-sm font-black text-white">Escuadra {selectedTarget.squadData.lead.name}</h4>
                                                    <p className="text-[10px] text-gray-400">Canal de emisión directa para todos los nodos de la escuadra.</p>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resumen de Escuadra</h5>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Líder CM:</span>
                                                        <span className="font-bold text-indigo-400">{selectedTarget.squadData.lead.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Creativos asignados:</span>
                                                        <span className="font-bold text-white">{selectedTarget.squadData.members.length} miembros</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Clientes bajo gestión:</span>
                                                        <span className="font-bold text-emerald-400">{selectedTarget.squadData.clients.length} marcas</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* TAB 2: MEDIA COMPARTIDA */}
                                {activeRightPanelTab === 'media' && (
                                    sharedData.media.length === 0 ? (
                                        <div className="py-12 text-center text-gray-500 space-y-2">
                                            <ImageIcon className="w-8 h-8 mx-auto opacity-30" />
                                            <p className="text-xs font-bold uppercase tracking-wider">Sin imágenes compartidas</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {sharedData.media.map(item => (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => window.open(item.fileUrl, '_blank')}
                                                    className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer hover:border-indigo-500/50 transition-all group relative"
                                                >
                                                    <img src={item.fileUrl} alt={item.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}

                                {/* TAB 3: ARCHIVOS Y DOCUMENTOS */}
                                {activeRightPanelTab === 'docs' && (
                                    sharedData.docs.length === 0 ? (
                                        <div className="py-12 text-center text-gray-500 space-y-2">
                                            <File className="w-8 h-8 mx-auto opacity-30" />
                                            <p className="text-xs font-bold uppercase tracking-wider">Sin archivos adjuntos</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {sharedData.docs.map(item => (
                                                <a 
                                                    key={item.id} 
                                                    href={item.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-xs group"
                                                >
                                                    <div className="flex items-center gap-2 truncate">
                                                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                                                        <span className="truncate text-gray-200 font-medium">{item.fileName}</span>
                                                    </div>
                                                    <Download className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                                                </a>
                                            ))}
                                        </div>
                                    )
                                )}

                                {/* TAB 4: ENLACES COMPARTIDOS */}
                                {activeRightPanelTab === 'links' && (
                                    sharedData.links.length === 0 ? (
                                        <div className="py-12 text-center text-gray-500 space-y-2">
                                            <LinkIcon className="w-8 h-8 mx-auto opacity-30" />
                                            <p className="text-xs font-bold uppercase tracking-wider">Sin enlaces compartidos</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {sharedData.links.map(item => (
                                                <a 
                                                    key={item.id} 
                                                    href={item.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group"
                                                >
                                                    <p className="text-xs font-bold text-indigo-400 truncate group-hover:underline">{item.url}</p>
                                                    <p className="text-[9px] text-gray-500 mt-1 font-mono">{item.user} • {item.time}</p>
                                                </a>
                                            ))}
                                        </div>
                                    )
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
