'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
    MessageSquare, Users, Send, Paperclip, Smile, Shield,
    Search, Loader2, Sparkles, Image as ImageIcon, FileText, X,
    Globe, Link as LinkIcon, Download, Building2,
    Briefcase, Stethoscope, Sprout, Coffee, GraduationCap, Building,
    ChevronRight, ChevronDown, Check, ExternalLink, Phone, Mail,
    Info, Eye, ArrowUpRight, CheckCircle2, Star, Layers, Activity,
    Calendar, Clock, Filter, Plus, FileSpreadsheet, AlertCircle,
    UserCheck, CheckSquare, XCircle, Share2, MoreHorizontal
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
            avatar: 'bg-pink-950/60 text-pink-300 border border-pink-500/30'
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
            avatar: 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
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
            avatar: 'bg-orange-950/60 text-orange-300 border border-orange-500/30'
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
            avatar: 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
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
            avatar: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
        };
    }

    return {
        department: 'Especialista General',
        depKey: 'other',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        avatar: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
    };
};

// Helper for Client Industry / Niches
const getClientNiche = (client) => {
    const raw = `${client?.industry || ''} ${client?.specialty || ''} ${client?.name || ''}`.toLowerCase();
    
    if (raw.includes('medico') || raw.includes('salud') || raw.includes('doctor') || raw.includes('hospital') || raw.includes('clinica') || raw.includes('uro') || raw.includes('cirug')) {
        return {
            key: 'salud',
            name: 'Salud & Sector Médico',
            icon: Stethoscope,
            color: 'text-cyan-400',
            badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        };
    }
    if (raw.includes('agro') || raw.includes('campo') || raw.includes('ganad') || raw.includes('agric') || raw.includes('parcela')) {
        return {
            key: 'agro',
            name: 'Agropecuario & Campo',
            icon: Sprout,
            color: 'text-emerald-400',
            badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        };
    }
    if (raw.includes('gastro') || raw.includes('restaurant') || raw.includes('comida') || raw.includes('bar') || raw.includes('pizza') || raw.includes('cafe')) {
        return {
            key: 'gastro',
            name: 'Gastronomía & Restaurantes',
            icon: Coffee,
            color: 'text-amber-400',
            badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        };
    }
    if (raw.includes('educa') || raw.includes('curso') || raw.includes('academia') || raw.includes('capacit')) {
        return {
            key: 'educacion',
            name: 'Educación & Cursos',
            icon: GraduationCap,
            color: 'text-purple-400',
            badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
        };
    }
    if (raw.includes('inmobil') || raw.includes('realestate') || raw.includes('bienes') || raw.includes('propied')) {
        return {
            key: 'inmobiliaria',
            name: 'Inmobiliaria & Bienes Raíces',
            icon: Building,
            color: 'text-blue-400',
            badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        };
    }

    return {
        key: 'corporativo',
        name: 'Corporativo & Marcas',
        icon: Building2,
        color: 'text-indigo-400',
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
    
    // Navigation & filters
    const [mainSidebarTab, setMainSidebarTab] = useState('worklist'); // 'worklist' | 'team' | 'clients'
    const [searchQuery, setSearchQuery] = useState('');
    const [headerSubTab, setHeaderSubTab] = useState('summary'); // 'summary' | 'analytics' | 'details' | 'files' | 'history'
    
    // Selection state:
    // target = { id, name, type: 'channel' | 'dm' | 'client', role, clientData, memberData, squadData }
    const [selectedTarget, setSelectedTarget] = useState({ id: '', name: 'Cargando...', type: 'channel' });
    const [currentChatId, setCurrentChatId] = useState(null);
    
    // Messaging state
    const [messagesList, setMessagesList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [dealStage, setDealStage] = useState('negotiation'); // 'negotiation' | 'close' | 'active'
    
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages update
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesList]);

    // 1. Load team members, clients, profiles map
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
                
                // Auto-select the first client or squad
                if (safeClients.length > 0) {
                    const firstClient = safeClients[0];
                    setSelectedTarget({
                        id: firstClient.id,
                        name: firstClient.name,
                        type: 'client',
                        clientData: firstClient
                    });
                } else if (squadGroups.length > 0) {
                    const firstSquad = squadGroups[0];
                    setSelectedTarget({
                        id: firstSquad.lead.id,
                        name: `Escuadra ${firstSquad.lead.name}`,
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
                toast.error("Error al sincronizar datos de mensajería.");
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
                    const cmId = selectedTarget.id;
                    const chat = await messagingService.getOrCreateSquadChat(cmId, 'general');
                    chatId = chat.id;
                } else if (selectedTarget.type === 'client') {
                    const clientId = selectedTarget.id;
                    const chat = await messagingService.getOrCreateClientChat(clientId);
                    chatId = chat.id;
                } else {
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
                        ? 'Tú (HQ Admin)' 
                        : (profileMap[m.sender_id] || selectedTarget.name || 'Destinatario');

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
    }, [currentChatId, user, profileMap, selectedTarget.name]);

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
                
                if (currentChatId && newDbMsg.chat_id === currentChatId) {
                    setMessagesList(prev => {
                        if (prev.some(m => m.id === newDbMsg.id)) return prev;

                        const isSelf = newDbMsg.sender_id === user.id;
                        const senderName = isSelf ? 'Tú (HQ Admin)' : (profileMap[newDbMsg.sender_id] || selectedTarget.name || 'Destinatario');

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
    }, [currentChatId, user, profileMap, selectedTarget.name]);

    // Unified list of Worklist Items for the left sub-sidebar (combining clients & key talent)
    const worklistItems = useMemo(() => {
        const clientItems = clientList.map((c, i) => ({
            id: c.id,
            name: c.name,
            subtitle: `${c.industry || 'Cliente'} • ${c.city || 'Sede'}`,
            type: 'client',
            priority: i % 3 === 0 ? 'High' : (i % 3 === 1 ? 'Mid' : 'Low'),
            statusText: i % 2 === 0 ? 'Awaiting our proposal' : 'Content in production',
            data: c
        }));

        const teamItems = teamList.slice(0, 8).map((m, i) => ({
            id: m.id,
            name: m.name,
            subtitle: `${m.role || 'Talento'} • ${m.city || 'Sede'}`,
            type: 'dm',
            priority: i % 2 === 0 ? 'High' : 'Mid',
            statusText: 'Active sprint task',
            data: m
        }));

        return [...clientItems, ...teamItems];
    }, [clientList, teamList]);

    // Filtered Worklist
    const filteredWorklist = useMemo(() => {
        if (!searchQuery.trim()) return worklistItems;
        const q = searchQuery.toLowerCase();
        return worklistItems.filter(item => 
            item.name?.toLowerCase().includes(q) || 
            item.subtitle?.toLowerCase().includes(q)
        );
    }, [worklistItems, searchQuery]);

    // Shared data extraction (Media, Docs, Links)
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

    // Mock timeline events for the active contact/deal
    const timelineActivities = useMemo(() => {
        const name = selectedTarget.name || 'Cliente';
        return [
            {
                id: 'act-1',
                type: 'call',
                title: `Information Provided to ${name}`,
                desc: 'Checked client requirements, brand guidelines and production scope. Created follow-up pipeline.',
                date: '12 May',
                assignee: selectedTarget.clientData?.cm || 'Marty C.',
                stage: 'Discovery'
            },
            {
                id: 'act-2',
                type: 'message',
                title: 'Gathering additional information & scripts',
                desc: 'Client confirmed active interest and is awaiting our Proposal and Shooting Schedule.',
                date: '15 May',
                assignee: selectedTarget.clientData?.filmmaker || 'Anthony V.',
                stage: 'Negotiation'
            }
        ];
    }, [selectedTarget]);

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
            setInputText(text);
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
                isImage ? `📷 Imagen compartida: ${file.name}` : `📎 Archivo adjunto: ${file.name}`,
                {
                    isFile: true,
                    isImage: isImage,
                    fileName: file.name,
                    fileUrl: fileUrl,
                    fileSize: file.size
                }
            );

            toast.dismiss(toastId);
            toast.success("Archivo subido con éxito.");
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
            <div className="h-full bg-[#0A0B10] flex flex-col items-center justify-center text-white gap-6">
                <div className="w-14 h-14 border-4 border-[#D4FF00]/20 border-t-[#D4FF00] rounded-full animate-spin" />
                <div className="space-y-1 text-center">
                    <p className="font-black uppercase tracking-[0.3em] text-xs text-[#D4FF00] animate-pulse">Sincronizando Workspace HQ</p>
                    <p className="text-[10px] text-gray-500 font-mono">Conectando canales de creativos y cartera de marcas</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-[#07080C] text-white flex flex-col p-3 md:p-4 overflow-hidden select-none font-sans">
            
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload} 
            />

            {/* Top Workspace Bar */}
            <header className="mb-3 flex items-center justify-between gap-4 px-1 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D4FF00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,255,0,0.3)]">
                        <Sparkles className="w-4 h-4 fill-black" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                            <span>DIIC ZONE</span>
                            <span className="text-xs uppercase px-2 py-0.5 rounded-md bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/20 font-mono">
                                CRM & MESSAGING
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>HQ REALTIME LIVE</span>
                    </div>

                    <button
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${
                            showRightPanel 
                                ? 'bg-[#D4FF00]/20 border-[#D4FF00]/30 text-[#D4FF00]' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                        title="Alternar Panel de Inteligencia"
                    >
                        <Info className="w-4 h-4" />
                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-wider">Context Hub</span>
                    </button>
                </div>
            </header>

            {/* Main 3-Column Work Area */}
            <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
                
                {/* ============================================================== */}
                {/* COLUMN 1: LEFT SUB-SIDEBAR (WORKLIST & STAT PILLS) */}
                {/* ============================================================== */}
                <div className="w-80 md:w-88 bg-[#111217] rounded-[28px] border border-white/5 flex flex-col shrink-0 overflow-hidden shadow-2xl">
                    
                    {/* Top 4 KPI Stat Pill Cards */}
                    <div className="p-3.5 border-b border-white/5 bg-black/20">
                        <div className="grid grid-cols-2 gap-2">
                            {/* Worklist Card */}
                            <div className="p-3 rounded-2xl bg-[#1A1B22] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-yellow-400/80 bg-yellow-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Worklist</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1">{worklistItems.length}</span>
                            </div>

                            {/* New Leads / Clients Card */}
                            <div className="p-3 rounded-2xl bg-[#1A1B22] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400/80 bg-red-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Clientes</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1">{clientList.length}</span>
                            </div>

                            {/* Updates Card */}
                            <div className="p-3 rounded-2xl bg-[#1A1B22] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-sky-400/80 bg-sky-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Updates</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1">22</span>
                            </div>

                            {/* Assigned / Squad Card */}
                            <div className="p-3 rounded-2xl bg-[#1A1B22] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-purple-400/80 bg-purple-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nodos</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1">{teamList.length}</span>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="mt-3 relative">
                            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar contacto, cliente o tarea..."
                                className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#181920] border border-white/5 focus:border-[#D4FF00]/40 text-xs text-white placeholder:text-gray-600 outline-none transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Section Label: Worklist */}
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm border border-gray-500" />
                            <span>Worklist Stream</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    </div>

                    {/* Contact Worklist Cards */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                        {filteredWorklist.map(item => {
                            const isSelected = selectedTarget.id === item.id;

                            if (isSelected) {
                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ scale: 0.98 }}
                                        animate={{ scale: 1 }}
                                        className="p-3.5 rounded-2xl bg-[#D4FF00] text-black shadow-lg shadow-[#D4FF00]/10 flex flex-col gap-2.5 cursor-pointer"
                                        onClick={() => {
                                            setSelectedTarget({
                                                id: item.id,
                                                name: item.name,
                                                type: item.type,
                                                clientData: item.type === 'client' ? item.data : null,
                                                memberData: item.type === 'dm' ? item.data : null
                                            });
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-black text-[#D4FF00] font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-black text-black truncate leading-tight">{item.name}</h4>
                                                    <p className="text-[10px] font-semibold text-black/70 truncate mt-0.5">{item.subtitle}</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-black shrink-0" />
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-black/10">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-black/80">
                                                <FileText className="w-3 h-3 text-black/70" />
                                                <span className="truncate">{item.statusText}</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-tight shadow-sm">
                                                {item.priority}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            }

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedTarget({
                                            id: item.id,
                                            name: item.name,
                                            type: item.type,
                                            clientData: item.type === 'client' ? item.data : null,
                                            memberData: item.type === 'dm' ? item.data : null
                                        });
                                    }}
                                    className="p-3.5 rounded-2xl bg-[#16171E] border border-white/5 hover:border-white/10 hover:bg-[#1A1B24] transition-all flex flex-col gap-2 cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white font-black flex items-center justify-center shrink-0 text-xs group-hover:scale-105 transition-transform">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-gray-200 group-hover:text-white truncate leading-tight">{item.name}</h4>
                                                <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-300 shrink-0" />
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                            {item.type === 'client' ? <Phone className="w-3 h-3 text-gray-500" /> : <FileText className="w-3 h-3 text-gray-500" />}
                                            <span className="truncate">{item.statusText}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${
                                            item.priority === 'High' 
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                                : (item.priority === 'Mid' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30')
                                        }`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ============================================================== */}
                {/* COLUMN 2: CENTER HUB (HEADER PROFILE CARD + TIMELINE & CHAT) */}
                {/* ============================================================== */}
                <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
                    
                    {/* --- TOP FLOATING PROFILE & DEAL HUB CARD --- */}
                    <div className="bg-[#EBECEF] text-slate-900 rounded-[28px] p-4 md:p-5 shadow-xl shrink-0">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            {/* Profile Details & Avatar */}
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-[#D4FF00] font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                                    {selectedTarget.name.charAt(0)}
                                </div>

                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
                                            {selectedTarget.name}
                                        </h2>
                                    </div>

                                    <p className="text-xs font-semibold text-slate-600 truncate">
                                        {selectedTarget.type === 'client' 
                                            ? `${selectedTarget.clientData?.industry || 'Empresa'} • Plan: ${selectedTarget.clientData?.plan || 'Presencia'}`
                                            : `${selectedTarget.role || 'Especialista'} • DIIC ZONE Node`}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                                        <span>📍 {selectedTarget.clientData?.city || selectedTarget.memberData?.city || 'Santo Domingo'}</span>
                                        <span>📞 {selectedTarget.clientData?.whatsapp_number || selectedTarget.memberData?.whatsapp || '+1 (809) 555-0100'}</span>
                                        <span className="hidden sm:inline">✉️ {selectedTarget.clientData?.email || `${selectedTarget.name.toLowerCase().replace(/\s+/g, '')}@diiczone.com`}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Manager & Status Badges */}
                            <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0">
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                    <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[9px] font-black flex items-center justify-center">
                                        {(selectedTarget.clientData?.cm || 'M').charAt(0)}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-800">
                                        <span className="text-slate-400 font-normal">Manager </span>
                                        {selectedTarget.clientData?.cm || 'Leslie M.'}
                                    </div>
                                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1" />
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-black uppercase shadow-sm">
                                        High
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-[#D4FF00] text-slate-900 text-[10px] font-black uppercase shadow-sm">
                                        Warm
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Sub-Header Navigation & Action Circles */}
                        <div className="mt-4 pt-3 border-t border-slate-300/60 flex flex-wrap items-center justify-between gap-3">
                            
                            {/* Action Icon Circles */}
                            <div className="flex items-center gap-2">
                                <a
                                    href={`https://wa.me/${(selectedTarget.clientData?.whatsapp_number || selectedTarget.memberData?.whatsapp || '18090000000').replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                                    title="WhatsApp / Llamada"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                </a>
                                <button className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Mensaje">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Email">
                                    <Mail className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Calendario">
                                    <Calendar className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Agregar Nota">
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Deal Identifier & Tab Links */}
                            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-sm shrink-0">
                                    <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Plan #DZ-{selectedTarget.id?.slice(0, 6) || '2026'}</span>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                                    {['summary', 'analytics', 'details', 'files', 'history'].map((tabKey) => {
                                        const labels = {
                                            summary: 'Summary',
                                            analytics: 'Analytics',
                                            details: 'Details',
                                            files: 'Files',
                                            history: 'History'
                                        };
                                        const isActive = headerSubTab === tabKey;
                                        return (
                                            <button
                                                key={tabKey}
                                                onClick={() => setHeaderSubTab(tabKey)}
                                                className={`transition-colors capitalize ${
                                                    isActive ? 'text-slate-950 font-black border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
                                                }`}
                                            >
                                                {labels[tabKey]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CENTER WORKSPACE (TIMELINE & LIVE CHAT) --- */}
                    <div className="flex-1 flex flex-col bg-[#F3F4F7] text-slate-900 rounded-[28px] overflow-hidden shadow-xl min-h-0 border border-slate-200/60">
                        
                        {/* Upper Section: Activity / Milestones Timeline */}
                        <div className="p-3.5 border-b border-slate-200/80 bg-white/70">
                            {/* Filter Bar */}
                            <div className="flex items-center justify-end gap-2 mb-2">
                                <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                                    <Filter className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                                    <Calendar className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                                    <Search className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Milestone Cards Stream */}
                            <div className="space-y-2">
                                {timelineActivities.map(act => (
                                    <div 
                                        key={act.id}
                                        className="p-3 rounded-2xl bg-white border border-slate-200/70 shadow-sm flex items-start justify-between gap-3 hover:border-slate-300 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                                                {act.type === 'call' ? <Phone className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{act.date}</span>
                                                    <h4 className="text-xs font-black text-slate-900">{act.title}</h4>
                                                </div>
                                                <p className="text-[11px] text-slate-600 leading-snug">{act.desc}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                                                <div className="w-4 h-4 rounded-full bg-slate-800 text-white text-[8px] font-black flex items-center justify-center">
                                                    {act.assignee.charAt(0)}
                                                </div>
                                                <span className="hidden sm:inline">{act.assignee}</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-[9px] font-black uppercase">
                                                {act.stage}
                                            </span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lower Section: Live Conversation Stream */}
                        <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFC]">
                            
                            {/* Quick Channel Tab Bar */}
                            <div className="px-4 py-2 border-b border-slate-200/60 bg-white flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <Phone className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
                                    <Mail className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-900 font-bold cursor-pointer" />
                                    <CheckSquare className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
                                    <Calendar className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
                                    <FileText className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>

                            {/* Message Bubble List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {messagesList.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-60">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-600">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Canal Activo de Coordinación</p>
                                        <p className="text-[11px] text-slate-500 max-w-xs">
                                            Envía directivas, guiones o notas de entrega para sincronizar en tiempo real.
                                        </p>
                                    </div>
                                ) : (
                                    messagesList.map(msg => (
                                        <div key={msg.id} className={`flex gap-2.5 ${msg.self ? 'justify-end' : 'justify-start'}`}>
                                            {!msg.self && (
                                                <div className="w-7 h-7 rounded-xl bg-slate-800 text-[#D4FF00] font-black text-xs flex items-center justify-center shrink-0 mt-1">
                                                    {selectedTarget.name.charAt(0)}
                                                </div>
                                            )}

                                            <div className={`max-w-[70%] space-y-1 flex flex-col ${msg.self ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                                                    <span className="font-bold text-slate-600">{msg.user}</span>
                                                    <span>{msg.time}</span>
                                                </div>

                                                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                                    msg.self
                                                        ? 'bg-black text-white rounded-br-sm'
                                                        : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-sm'
                                                }`}>
                                                    {/* Image Attachment */}
                                                    {msg.isImage && msg.fileUrl && (
                                                        <div className="mb-2 rounded-xl overflow-hidden border border-white/10 bg-black/10">
                                                            <img 
                                                                src={msg.fileUrl} 
                                                                alt={msg.fileName || 'Imagen'} 
                                                                className="max-h-52 w-auto object-cover hover:scale-105 transition-transform cursor-pointer"
                                                                onClick={() => window.open(msg.fileUrl, '_blank')}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* File Attachment */}
                                                    {msg.isFile && !msg.isImage && (
                                                        <div className="mb-2 p-2 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2 truncate">
                                                                <FileText className="w-4 h-4 text-[#D4FF00] shrink-0" />
                                                                <span className="truncate text-xs font-bold">{msg.fileName}</span>
                                                            </div>
                                                            {msg.fileUrl && (
                                                                <a 
                                                                    href={msg.fileUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="p-1 rounded bg-white/20 hover:bg-white/30 text-white"
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

                            {/* Floating Input Bar */}
                            <div className="p-3 bg-white border-t border-slate-200/70 relative">
                                {/* Emoji Picker */}
                                <AnimatePresence>
                                    {showEmojiPicker && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-16 left-4 bg-slate-900 border border-white/10 rounded-2xl p-2.5 shadow-2xl z-50 flex flex-wrap gap-1.5 max-w-xs"
                                        >
                                            {EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => {
                                                        setInputText(prev => prev + emoji);
                                                        setShowEmojiPicker(false);
                                                    }}
                                                    className="text-base hover:scale-125 transition-transform p-1 text-white"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[#F3F4F7] rounded-full p-1.5 pl-4 border border-slate-200">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Enter message..."
                                        className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                                    />

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                                        >
                                            <Smile className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                                        >
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!inputText.trim() || isSending}
                                            className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 font-black flex items-center justify-center hover:scale-105 disabled:opacity-40 transition-transform shadow-sm cursor-pointer"
                                        >
                                            {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>

                    </div>

                </div>

                {/* ============================================================== */}
                {/* COLUMN 3: RIGHT PANEL (DEAL / TASK CARDS & INTELLIGENCE) */}
                {/* ============================================================== */}
                <AnimatePresence>
                    {showRightPanel && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 310, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="flex flex-col gap-3 shrink-0 overflow-y-auto custom-scrollbar"
                        >
                            
                            {/* --- CARD 1: LAVENDER LILAC DEAL CARD --- */}
                            <div className="p-4 rounded-[28px] bg-[#C4B5FD] text-slate-950 shadow-xl flex flex-col justify-between relative overflow-hidden">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-base font-black tracking-tight leading-tight">
                                        {selectedTarget.type === 'client' ? `Plan ${selectedTarget.clientData?.plan || 'Presencia Pro'}` : 'Asignación de Escuadra'}
                                    </h3>
                                    <ArrowUpRight className="w-4 h-4 text-slate-800 shrink-0" />
                                </div>

                                {/* Deal Stage Switcher Pills */}
                                <div className="mt-3 p-1 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-between text-[10px] font-bold">
                                    <button
                                        onClick={() => setDealStage('negotiation')}
                                        className={`flex-1 py-1 px-2 rounded-full transition-all flex items-center justify-center gap-1 ${
                                            dealStage === 'negotiation' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-700'
                                        }`}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full border border-slate-900" />
                                        <span>Negociación</span>
                                    </button>
                                    <button
                                        onClick={() => setDealStage('close')}
                                        className={`flex-1 py-1 px-2 rounded-full transition-all flex items-center justify-center gap-1 ${
                                            dealStage === 'close' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-700'
                                        }`}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full border border-slate-900" />
                                        <span>Cierre</span>
                                    </button>
                                </div>

                                {/* Value / Potential Profit */}
                                <div className="mt-4">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                                        {selectedTarget.type === 'client' ? 'Fee Mensual Recurrente' : 'Remuneración Mensual'}
                                    </span>
                                    <span className="text-2xl font-black tracking-tight text-slate-950">
                                        ${selectedTarget.clientData?.price || selectedTarget.memberData?.salary || '1,200'}/m
                                    </span>
                                </div>

                                {/* Checklist items */}
                                <div className="mt-3 space-y-1.5 text-xs font-medium text-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                                        <span>Briefing & Identidad de Marca</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                                        <span>Calendario de 8 Reels aprobado</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <X className="w-3.5 h-3.5 text-slate-500 stroke-[3]" />
                                        <span>Presupuesto pauta Meta pendiente</span>
                                    </div>
                                </div>
                            </div>

                            {/* --- CARD 2: NEON LIME ACTIVE TASK CARD --- */}
                            <div className="p-4 rounded-[28px] bg-[#E2F952] text-slate-950 shadow-xl flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">Tarea Prioritaria</span>
                                    <h4 className="text-sm font-black text-slate-950 mt-0.5">Enviar Propuesta & Guiones</h4>
                                </div>

                                {/* Proposal Attachment Pill */}
                                <div className="mt-3 p-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/5 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-2 truncate">
                                        <FileText className="w-4 h-4 text-slate-800 shrink-0" />
                                        <span className="text-xs font-bold text-slate-900 truncate">Propuesta_Audiovisual_v2.pdf</span>
                                    </div>
                                    <Download className="w-3.5 h-3.5 text-slate-700 hover:text-black cursor-pointer shrink-0" />
                                </div>

                                {/* Customer Choices / Strategic Notes */}
                                <div className="mt-3 space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-700">Puntos Clave de Decisión:</span>
                                    <div className="grid grid-cols-2 gap-1 p-1 bg-black/10 rounded-xl text-center text-[10px] font-black">
                                        <span className="py-1 bg-white rounded-lg shadow-xs">DIIC ZONE</span>
                                        <span className="py-1 text-slate-700">Competencia</span>
                                    </div>
                                    <div className="space-y-1 text-[11px] font-medium text-slate-800 pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <Check className="w-3 h-3 text-emerald-800 stroke-[3]" />
                                            <span>Calidad cinematográfica & rapidez</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <X className="w-3 h-3 text-slate-500 stroke-[3]" />
                                            <span>Tiempo de respuesta flexible</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Pill Action Buttons */}
                                <div className="mt-4 flex items-center gap-2">
                                    <button 
                                        onClick={() => toast.success("Recordatorio de propuesta enviado.")}
                                        className="flex-1 py-2 rounded-xl bg-black text-white hover:bg-slate-900 flex items-center justify-center transition-all shadow-md cursor-pointer"
                                        title="Enviar recordatorio"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => toast.success("Tarea marcada como completada.")}
                                        className="flex-1 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 flex items-center justify-center transition-all shadow-md cursor-pointer"
                                        title="Completar tarea"
                                    >
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
