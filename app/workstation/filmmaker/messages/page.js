'use client';

import { useState, useRef, useEffect } from 'react';
import { 
    Send, Paperclip, Smile, Hash, Users, MessageSquare, 
    ChevronLeft, Plus, CheckCircle, Image as ImageIcon, FileText, X,
    Loader2, FolderOpen, Globe, Link, Download, Music, File
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { messagingService } from '@/services/messagingService';

const EMOJIS = ['👍', '🔥', '❤️', '😂', '🎉', '🚀', '🎬', '📸', '🙌', '👀'];

const getRoleColors = (role) => {
    const r = (role || '').toLowerCase();
    if (r.includes('estrateg')) {
        return {
            text: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            glow: 'shadow-amber-500/20',
            badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
            avatar: 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
        };
    }
    if (r.includes('community') || r.includes('cm')) {
        return {
            text: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            glow: 'shadow-indigo-500/20',
            badge: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
            avatar: 'bg-indigo-950/50 text-indigo-400 border border-indigo-500/30'
        };
    }
    if (r.includes('diseña') || r.includes('designer')) {
        return {
            text: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            glow: 'shadow-pink-500/20',
            badge: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
            avatar: 'bg-pink-950/50 text-pink-400 border border-pink-500/30'
        };
    }
    if (r.includes('editor')) {
        return {
            text: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            glow: 'shadow-purple-500/20',
            badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
            avatar: 'bg-purple-950/50 text-purple-400 border border-purple-500/30'
        };
    }
    if (r.includes('film')) {
        return {
            text: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            glow: 'shadow-orange-500/20',
            badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
            avatar: 'bg-orange-950/50 text-orange-400 border border-orange-500/30'
        };
    }
    if (r.includes('foto')) {
        return {
            text: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            glow: 'shadow-yellow-500/20',
            badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
            avatar: 'bg-yellow-950/50 text-yellow-400 border border-yellow-500/30'
        };
    }
    if (r.includes('audio')) {
        return {
            text: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            glow: 'shadow-emerald-500/20',
            badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
            avatar: 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
        };
    }
    if (r.includes('web') || r.includes('programador')) {
        return {
            text: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            glow: 'shadow-blue-500/20',
            badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
            avatar: 'bg-blue-950/50 text-blue-400 border border-blue-500/30'
        };
    }
    if (r.includes('modelo')) {
        return {
            text: 'text-fuchsia-400',
            bg: 'bg-fuchsia-500/10',
            border: 'border-fuchsia-500/20',
            glow: 'shadow-fuchsia-500/20',
            badge: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20',
            avatar: 'bg-fuchsia-950/50 text-fuchsia-400 border border-fuchsia-500/30'
        };
    }

    return {
        text: 'text-gray-400',
        bg: 'bg-white/5',
        border: 'border-white/10',
        glow: 'shadow-white/5',
        badge: 'bg-white/5 text-gray-400 border border-white/10',
        avatar: 'bg-white/5 text-gray-400 border border-white/10'
    };
};

export default function FilmmakerMessagesPage() {
    const router = useRouter();
    const { user } = useAuth();
    
    // Squad & Connection State
    const [loading, setLoading] = useState(true);
    const [currentUserCard, setCurrentUserCard] = useState(null);
    const [squadCMName, setSquadCMName] = useState('');
    const [squadMembers, setSquadMembers] = useState([]);
    const [squadClients, setSquadClients] = useState([]);
    const [profileMap, setProfileMap] = useState({});
    
    // Navigation/Selection State
    const [activeTab, setActiveTab] = useState('channel'); // channel, dm
    const [selectedTarget, setSelectedTarget] = useState('General');
    const [currentChatId, setCurrentChatId] = useState(null);
    
    // Chat Message State
    const [messagesList, setMessagesList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMediaDrawer, setShowMediaDrawer] = useState(false);
    const [activeDrawerTab, setActiveDrawerTab] = useState('media');
    
    // Unread counts & target mapping state
    const [unreadCounts, setUnreadCounts] = useState({});
    const [chatToTargetMap, setChatToTargetMap] = useState({});
    
    const fileInputRef = useRef(null);

    // 1. Fetch user card, profiles map, CM + Estratega + Peers, and map chat_ids
    useEffect(() => {
        const loadSquadData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                
                // Fetch all profiles to build a UUID -> Name map
                const { data: allProfiles } = await supabase
                    .from('profiles')
                    .select('id, full_name');
                const pMap = {};
                if (allProfiles) {
                    allProfiles.forEach(p => {
                        pMap[p.id] = p.full_name;
                    });
                }
                setProfileMap(pMap);
                
                // Fetch the logged-in user's team card
                const { data: userCard } = await supabase
                    .from('team')
                    .select('*')
                    .eq('email', user.email)
                    .maybeSingle();

                if (!userCard) {
                    console.warn("No team card found for email:", user.email);
                    setLoading(false);
                    return;
                }
                setCurrentUserCard(userCard);

                // Find their CM/Squad Lead
                let cmId = null;
                let cmName = '';
                let leadCM = null;

                if (userCard.role?.toLowerCase()?.includes('community') || userCard.role?.toLowerCase() === 'cm') {
                    cmId = userCard.id;
                    cmName = userCard.name;
                    leadCM = userCard;
                } else {
                    cmId = userCard.squad_lead_id;
                    if (cmId) {
                        const { data: cmCard } = await supabase
                            .from('team')
                            .select('*')
                            .eq('id', cmId)
                            .maybeSingle();
                        leadCM = cmCard;
                        cmName = cmCard?.name || '';
                    }
                }
                setSquadCMName(cmName);

                // Fetch CM's own squad lead (Estratega)
                let estratega = null;
                if (leadCM?.squad_lead_id) {
                    const { data: estCard } = await supabase
                        .from('team')
                        .select('*')
                        .eq('id', leadCM.squad_lead_id)
                        .maybeSingle();
                    estratega = estCard;
                }

                // Fetch peers sharing the same CM/Squad Lead
                let members = [];
                if (cmId) {
                    const { data: peers } = await supabase
                        .from('team')
                        .select('*')
                        .eq('squad_lead_id', cmId);
                    
                    if (peers) {
                        members = [...peers];
                    }
                    if (leadCM && !members.some(m => m.id === leadCM.id)) {
                        members.push(leadCM);
                    }
                }
                if (estratega && !members.some(m => m.id === estratega.id)) {
                    members.push(estratega);
                }

                // Filter out current user from members to display in DMs
                const otherMembers = members.filter(m => m.id !== userCard.id);
                
                // Add HQ Admin at the top of active members list
                otherMembers.unshift({
                    id: 'a95d5a4c-093d-4806-85c5-45bf6ed3f76f',
                    name: 'HQ',
                    role: 'Administración'
                });
                
                setSquadMembers(otherMembers);

                // Fetch clients assigned to this CM
                let clients = [];
                if (cmName) {
                    const { data: cmClients } = await supabase
                        .from('clients')
                        .select('*')
                        .eq('cm', cmName);
                    if (cmClients) {
                        clients = cmClients;
                    }
                }
                setSquadClients(clients);

                // Fetch chats to build target mapping
                const { data: allChats } = await supabase
                    .from('chats')
                    .select('id, name, type');
                
                const cMap = {};
                if (allChats) {
                    allChats.forEach(c => {
                        if (c.type === 'direct') {
                            const parts = c.name.replace('direct_', '').split('_');
                            const otherId = parts.find(p => p !== userCard.id);
                            if (otherId) {
                                if (otherId === 'a95d5a4c-093d-4806-85c5-45bf6ed3f76f') {
                                    cMap[c.id] = { tab: 'dm', target: 'HQ' };
                                } else {
                                    const m = otherMembers.find(member => member.id === otherId);
                                    if (m) {
                                        cMap[c.id] = { tab: 'dm', target: m.name };
                                    }
                                }
                            }
                        } else if (c.type === 'squad') {
                            const parts = c.name.replace('squad_', '').split('_');
                            const leadId = parts[0];
                            const groupType = parts[1];
                            if (groupType === 'general') {
                                cMap[c.id] = { tab: 'channel', target: 'General' };
                            } else {
                                const client = clients.find(cl => cl.id === leadId);
                                if (client) {
                                    cMap[c.id] = { tab: 'channel', target: client.name };
                                }
                            }
                        }
                    });
                }
                setChatToTargetMap(cMap);

                // Initialize mock unread count from HQ to demonstrate the feature visually
                setUnreadCounts({
                    'dm_HQ': 1
                });

                setLoading(false);
            } catch (err) {
                console.error("Error loading squad data:", err);
                toast.error("Error al sincronizar con tu escuadra.");
                setLoading(false);
            }
        };

        loadSquadData();
    }, [user]);

    // Clear unread count for selected target
    useEffect(() => {
        if (!selectedTarget) return;
        const targetKey = `${activeTab}_${selectedTarget}`;
        setUnreadCounts(prev => {
            if (prev[targetKey] > 0) {
                return {
                    ...prev,
                    [targetKey]: 0
                };
            }
            return prev;
        });
    }, [selectedTarget, activeTab]);

    // Parse query params on load (e.g. ?client=Vito's%20Pizza)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const clientParam = params.get('client');
            const dmParam = params.get('dm');
            if (clientParam) {
                setActiveTab('channel');
                setSelectedTarget(clientParam);
            } else if (dmParam) {
                setActiveTab('dm');
                setSelectedTarget(dmParam);
            }
        }
    }, []);

    // 2. Fetch or create a Chat Thread in DB when selection changes
    useEffect(() => {
        if (!currentUserCard) return;

        const getChatThread = async () => {
            try {
                let chatId = null;

                if (activeTab === 'channel') {
                    if (selectedTarget === 'General') {
                        const cmId = currentUserCard.role?.toLowerCase()?.includes('community') 
                            ? currentUserCard.id 
                            : currentUserCard.squad_lead_id;

                        if (cmId) {
                            const chat = await messagingService.getOrCreateSquadChat(cmId, 'general');
                            chatId = chat.id;
                        }
                    } else {
                        const clientObj = squadClients.find(c => {
                            const clean = (str) => (str || '').toLowerCase().replace(/['’`\s]/g, '');
                            return clean(c.name) === clean(selectedTarget);
                        });
                        if (clientObj) {
                            if (selectedTarget !== clientObj.name) {
                                setSelectedTarget(clientObj.name);
                            }
                            const chat = await messagingService.getOrCreateSquadChat(clientObj.id, 'production');
                            chatId = chat.id;
                        }
                    }
                } else {
                    const memberObj = squadMembers.find(m => {
                        const clean = (str) => (str || '').toLowerCase().replace(/['’`\s]/g, '');
                        return clean(m.name) === clean(selectedTarget);
                    });
                    if (memberObj) {
                        if (selectedTarget !== memberObj.name) {
                            setSelectedTarget(memberObj.name);
                        }
                        const chat = await messagingService.getOrCreateDirectChat(currentUserCard.id, memberObj.id);
                        chatId = chat.id;
                    }
                }

                setCurrentChatId(chatId);
            } catch (err) {
                console.error("Error setting up chat thread:", err);
                setCurrentChatId(null);
                setMessagesList([]);
            }
        };

        getChatThread();
    }, [activeTab, selectedTarget, currentUserCard, squadMembers, squadClients]);

    // 3. Fetch messages for the active chat
    useEffect(() => {
        if (!currentChatId || !currentUserCard) {
            setMessagesList([]);
            return;
        }

        const fetchMsgs = async () => {
            try {
                const msgs = await messagingService.getMessages(currentChatId);
                const mapped = msgs.map(m => {
                    const isSelf = m.sender_id === user.id;
                    const senderName = m.sender_id === 'a95d5a4c-093d-4806-85c5-45bf6ed3f76f'
                        ? 'HQ'
                        : (isSelf ? 'Tú' : (profileMap[m.sender_id] || 'Colega'));

                    return {
                        id: m.id,
                        user: senderName,
                        text: m.content,
                        time: new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                        self: isSelf,
                        isFile: m.metadata?.isFile || false,
                        isImage: m.metadata?.isImage || false,
                        fileName: m.metadata?.fileName || ''
                    };
                });
                setMessagesList(mapped);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMsgs();
    }, [currentChatId, currentUserCard, profileMap]);

    // 4. Global real-time subscription for workstation messages (updates active and increments unread)
    useEffect(() => {
        if (!user || !currentUserCard) return;

        const globalChannel = supabase
            .channel('global-workstation-messages')
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
                        const senderName = newDbMsg.sender_id === 'a95d5a4c-093d-4806-85c5-45bf6ed3f76f'
                            ? 'HQ'
                            : (isSelf ? 'Tú' : (profileMap[newDbMsg.sender_id] || 'Colega'));

                        return [...prev, {
                            id: newDbMsg.id,
                            user: senderName,
                            text: newDbMsg.content,
                            time: new Date(newDbMsg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            self: isSelf,
                            isFile: newDbMsg.metadata?.isFile || false,
                            isImage: newDbMsg.metadata?.isImage || false,
                            fileName: newDbMsg.metadata?.fileName || ''
                        }];
                    });
                } else {
                    // Different chat match (only increment if from someone else)
                    if (newDbMsg.sender_id !== user.id) {
                        const target = chatToTargetMap[newDbMsg.chat_id];
                        if (target) {
                            const targetKey = `${target.tab}_${target.target}`;
                            setUnreadCounts(prev => ({
                                ...prev,
                                [targetKey]: (prev[targetKey] || 0) + 1
                            }));
                        }
                    }
                }
            })
            .subscribe();

        return () => {
            if (globalChannel) {
                supabase.removeChannel(globalChannel);
            }
        };
    }, [currentChatId, currentUserCard, profileMap, chatToTargetMap]);

    // Send handler using auth user UUID
    const handleSend = async () => {
        if (!inputText.trim() || !currentChatId || !currentUserCard) return;

        const textToSend = inputText;
        setInputText('');
        setShowEmojiPicker(false);

        try {
            await messagingService.sendMessage(currentChatId, user.id, textToSend);
        } catch (err) {
            console.error("Error sending message:", err);
            toast.error("Error al enviar el mensaje.");
        }
    };

    const handleChannelClick = (channelName) => {
        setActiveTab('channel');
        setSelectedTarget(channelName);
        setShowEmojiPicker(false);
    };

    const handleDMClick = (memberName) => {
        setActiveTab('dm');
        setSelectedTarget(memberName);
        setShowEmojiPicker(false);
    };

    const handleEmojiClick = (emoji) => {
        setInputText(prev => prev + emoji);
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentChatId || !currentUserCard) return;

        toast.loading(`Subiendo "${file.name}"...`);

        // Simulate file upload and then add persistent message with metadata
        setTimeout(async () => {
            const isImage = file.type.startsWith('image/');
            try {
                await messagingService.sendMessage(
                    currentChatId, 
                    user.id, 
                    `📎 Archivo adjunto: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
                    {
                        isFile: true,
                        isImage: isImage,
                        fileName: file.name
                    }
                );
                toast.dismiss();
                toast.success("Archivo compartido con éxito.");
            } catch (err) {
                toast.dismiss();
                console.error("Error uploading file message:", err);
                toast.error("Error al compartir el archivo.");
            }
        }, 1500);
    };

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-[#050511] text-white">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-4" />
                <p className="text-sm text-gray-400 animate-pulse uppercase tracking-widest font-black">Sincronizando Escuadra...</p>
            </div>
        );
    }

    if (!currentUserCard) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-[#050511] text-white p-6">
                <Hash className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
                <h2 className="text-xl font-bold uppercase tracking-widest mb-2">Escuadra No Encontrada</h2>
                <p className="text-sm text-gray-400 mb-6 max-w-md text-center">
                    Tu correo no está vinculado a ninguna ficha de talento del equipo. Solicita al administrador vincular tu correo en el Panel HQ.
                </p>
                <button 
                    onClick={() => router.push('/workstation/profile')}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                    Ir a mi Perfil
                </button>
            </div>
        );
    }

    const getSharedData = () => {
        const media = [];
        const docs = [];
        const links = [];

        const urlRegex = /(https?:\/\/[^\s]+)/gi;

        messagesList.forEach(msg => {
            if (msg.isFile) {
                if (msg.isImage) {
                    media.push({
                        id: msg.id,
                        fileName: msg.fileName,
                        time: msg.time,
                        user: msg.user,
                    });
                } else {
                    docs.push({
                        id: msg.id,
                        fileName: msg.fileName,
                        time: msg.time,
                        user: msg.user,
                    });
                }
            }
            
            if (msg.text) {
                const matches = msg.text.match(urlRegex);
                if (matches) {
                    matches.forEach((url, index) => {
                        links.push({
                            id: `${msg.id}-${index}`,
                            url: url,
                            time: msg.time,
                            user: msg.user,
                        });
                    });
                }
            }
        });

        return { media, docs, links };
    };

    const sharedData = getSharedData();

    return (
        <div className="flex-1 p-8 bg-[#050511] text-white flex flex-col h-full overflow-hidden">
            {/* Hidden Input for Files */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
            />

            {/* Header */}
            <header className="mb-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <MessageSquare className="w-8 h-8 text-cyan-500" /> Mensajes de Rodaje
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Canales de comunicación directa y tiempo real con tu CM, Estratega y compañeros de escuadra.</p>
                </div>
            </header>

            <div className="flex-1 flex rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A12] mb-20 min-h-[400px]">
                
                {/* Side Bar */}
                <div className="w-64 bg-black/20 border-r border-white/5 flex flex-col shrink-0">
                    
                    {/* Channels Section */}
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-gray-400 font-black text-xs uppercase tracking-wider">Canales de Rodaje</h2>
                    </div>
                    <div className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
                        {/* General Channel */}
                        {(() => {
                            const unread = unreadCounts['channel_General'] || 0;
                            return (
                                <button 
                                    onClick={() => handleChannelClick('General')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                        activeTab === 'channel' && selectedTarget === 'General'
                                        ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 shadow-md' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Users className={`w-4 h-4 ${activeTab === 'channel' && selectedTarget === 'General' ? 'text-cyan-400' : 'opacity-50'}`} />
                                    <span className="flex-1">Escuadra General - {squadCMName || 'Cargando...'}</span>
                                    {unread > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20 animate-pulse shrink-0">
                                            {unread}
                                        </span>
                                    )}
                                </button>
                            );
                        })()}

                        {/* Client Channels */}
                        {squadClients.map(client => {
                            const isSelected = activeTab === 'channel' && selectedTarget === client.name;
                            const targetKey = `channel_${client.name}`;
                            const unread = unreadCounts[targetKey] || 0;
                            return (
                                <button 
                                    key={client.id} 
                                    onClick={() => handleChannelClick(client.name)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                        isSelected 
                                        ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 shadow-md' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Hash className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'opacity-50'}`} />
                                    <span className="flex-1">{client.name}</span>
                                    {unread > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20 animate-pulse shrink-0">
                                            {unread}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Members / DMs Section */}
                    <div className="p-4 border-t border-white/5">
                        <h2 className="text-gray-400 font-black text-xs uppercase tracking-wider mb-2">Miembros Activos</h2>
                        <div className="space-y-1 overflow-y-auto max-h-[220px] custom-scrollbar">
                            {squadMembers.map(member => {
                                const isSelected = activeTab === 'dm' && selectedTarget === member.name;
                                const roleColors = getRoleColors(member.role);
                                const targetKey = `dm_${member.name}`;
                                const unread = unreadCounts[targetKey] || 0;
                                return (
                                    <button
                                        key={member.id}
                                        onClick={() => handleDMClick(member.name)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                            isSelected 
                                            ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 shadow-md' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                                        }`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${roleColors.avatar}`}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#0A0A12]" />
                                        </div>
                                        <span className="truncate text-left flex-1">
                                            {member.name}
                                            <span className={`text-[8px] font-semibold px-1 rounded ml-1.5 ${roleColors.badge}`}>
                                                {member.role}
                                            </span>
                                        </span>
                                        {unread > 0 && (
                                            <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-rose-500/20 animate-pulse shrink-0">
                                                {unread}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                            {squadMembers.length === 0 && (
                                <p className="text-[10px] text-gray-600 italic text-center py-2">Ningún otro miembro vinculado</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Message Window */}
                <div className="flex-1 flex flex-col bg-[#050510]/50 relative">
                    
                    {/* Current Channel / Member Info */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            {activeTab === 'channel' ? (
                                selectedTarget === 'General' ? (
                                    <Users className="w-5 h-5 text-cyan-400" />
                                ) : (
                                    <Hash className="w-5 h-5 text-cyan-400" />
                                )
                            ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getRoleColors(squadMembers.find(m => m.name === selectedTarget)?.role).avatar}`}>
                                    {selectedTarget.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="text-white font-bold text-sm">
                                    {selectedTarget === 'General' ? `Escuadra General - ${squadCMName}` : selectedTarget}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {activeTab === 'channel' 
                                        ? selectedTarget === 'General' 
                                            ? `Canal general de la escuadra (Encargada: ${squadCMName})` 
                                            : `Canal de producción de ${selectedTarget}` 
                                        : `Mensajes directos con ${selectedTarget}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white border-2 border-[#0A0A12]" title={`Tú (${currentUserCard.name})`}>
                                    {currentUserCard.name.charAt(0)}
                                </div>
                                {squadMembers.slice(0, 3).map((m, idx) => (
                                    <div 
                                        key={m.id}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0A0A12] ${
                                            idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-pink-500' : 'bg-emerald-500'
                                        }`}
                                        title={`${m.name} (${m.role})`}
                                    >
                                        {m.name.charAt(0)}
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={() => setShowMediaDrawer(!showMediaDrawer)}
                                className={`p-2 rounded-xl border transition-all ${
                                    showMediaDrawer 
                                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' 
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                                }`}
                                title="Archivos y enlaces compartidos"
                            >
                                <FolderOpen className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {messagesList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                <MessageSquare className="w-12 h-12 text-cyan-500/50 mb-3 animate-pulse" />
                                <p className="text-xs uppercase tracking-widest font-black text-cyan-400">Canal de Comunicación Activo</p>
                                <p className="text-xs text-gray-500 mt-1">Escribe tu primer mensaje para iniciar la conversación con tu escuadra.</p>
                            </div>
                        ) : (
                            messagesList.map(msg => (
                                <div key={msg.id} className={`flex gap-4 ${msg.self ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                                        msg.self 
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' 
                                        : 'bg-gray-800 text-gray-200 border border-white/5'
                                    }`}>
                                        {msg.user.charAt(0)}
                                    </div>
                                    <div className={`max-w-[70%] space-y-1 ${msg.self ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-white">{msg.user}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">{msg.time}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                            msg.self 
                                            ? 'bg-cyan-600/10 text-cyan-100 rounded-tr-none border border-cyan-500/20 shadow-lg shadow-cyan-600/5' 
                                            : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                                        }`}>
                                            {msg.text}
                                            
                                            {msg.isFile && (
                                                <div className="mt-3 flex items-center gap-3 bg-black/40 border border-white/10 p-2.5 rounded-xl">
                                                    {msg.isImage ? (
                                                        <div className="w-10 h-10 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                                                            <ImageIcon className="w-5 h-5" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-gray-300 truncate">{msg.fileName || 'Material subido'}</p>
                                                        <span className="text-[9px] text-gray-500 uppercase font-black">Confirmado por sistema</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Emoji Selector Panel */}
                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-24 right-4 bg-[#0E0E18] border border-white/15 p-3 rounded-2xl shadow-2xl z-50 flex flex-wrap gap-2 max-w-[180px]"
                            >
                                <div className="flex justify-between items-center w-full border-b border-white/5 pb-1.5 mb-1.5 shrink-0">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400">Emojis rápidos</span>
                                    <button onClick={() => setShowEmojiPicker(false)} className="text-gray-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                                </div>
                                {EMOJIS.map(emoji => (
                                    <button 
                                        key={emoji} 
                                        onClick={() => handleEmojiClick(emoji)}
                                        className="text-base hover:scale-125 transition-transform p-1"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Message Input Box */}
                    <div className="p-4 border-t border-white/5 bg-[#050510]/80 shrink-0">
                        <div className="flex gap-2 bg-black/30 border border-white/10 rounded-xl p-2 items-end">
                            <button 
                                onClick={triggerFileSelect}
                                className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                                title="Adjuntar material (.mp4, .jpg)"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder={activeTab === 'channel' ? (selectedTarget === 'General' ? `Escribe en Escuadra General - ${squadCMName}...` : `Escribe en #${selectedTarget}...`) : `Mensaje directo a ${selectedTarget}...`}
                                className="flex-1 bg-transparent border-0 focus:ring-0 text-white text-sm resize-none py-2 max-h-32 min-h-[40px] focus:outline-none"
                                rows="1"
                            />
                            <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2 rounded-lg transition-all ${showEmojiPicker ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                                title="Insertar emoji"
                            >
                                <Smile className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleSend}
                                className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-600/20"
                                title="Enviar mensaje"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shared Media Drawer */}
                <AnimatePresence>
                    {showMediaDrawer && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="border-l border-white/10 bg-[#070710] flex flex-col shrink-0 overflow-hidden h-full"
                        >
                            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                    <FolderOpen className="w-4 h-4 text-cyan-400" /> Compartido
                                </h3>
                                <button 
                                    onClick={() => setShowMediaDrawer(false)}
                                    className="p-1 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/5 text-xs font-bold shrink-0">
                                {[
                                    { id: 'media', label: 'Media' },
                                    { id: 'docs', label: 'Archivos' },
                                    { id: 'links', label: 'Enlaces' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveDrawerTab(tab.id)}
                                        className={`flex-1 py-3 text-center border-b-2 transition-all ${
                                            activeDrawerTab === tab.id
                                            ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content List */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                {activeDrawerTab === 'media' && (
                                    sharedData.media.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                                            <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Sin imágenes</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {sharedData.media.map(item => (
                                                <div 
                                                    key={item.id}
                                                    className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center p-2 text-center"
                                                >
                                                    <ImageIcon className="w-6 h-6 text-cyan-400/60 group-hover:scale-110 transition-transform mb-1" />
                                                    <span className="text-[9px] text-gray-400 truncate w-full px-1">{item.fileName}</span>
                                                    <span className="text-[8px] text-gray-600 absolute bottom-1">{item.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}

                                {activeDrawerTab === 'docs' && (
                                    sharedData.docs.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                                            <File className="w-8 h-8 text-gray-500 mb-2" />
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Sin archivos</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {sharedData.docs.map(item => {
                                                const isAudio = item.fileName?.toLowerCase().endsWith('.mp3') || item.fileName?.toLowerCase().endsWith('.wav');
                                                return (
                                                    <div 
                                                        key={item.id}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                                                    >
                                                        <div className={`p-2 rounded-lg ${isAudio ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                            {isAudio ? <Music className="w-4 h-4" /> : <File className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-gray-300 truncate">{item.fileName}</p>
                                                            <p className="text-[9px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                                <span>{item.user}</span>
                                                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                                <span>{item.time}</span>
                                                            </p>
                                                        </div>
                                                        <button 
                                                            className="p-1.5 rounded-lg bg-black/40 border border-white/10 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                                                            title="Descargar archivo"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                )}

                                {activeDrawerTab === 'links' && (
                                    sharedData.links.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                                            <Link className="w-8 h-8 text-gray-500 mb-2" />
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Sin enlaces</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {sharedData.links.map(item => (
                                                <a 
                                                    key={item.id}
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/[0.02] transition-all group"
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <Globe className="w-4 h-4 text-cyan-400/80 shrink-0 mt-0.5" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-cyan-400 truncate group-hover:underline">{item.url}</p>
                                                            <p className="text-[9px] text-gray-500 flex items-center gap-1.5 mt-1">
                                                                <span>{item.user}</span>
                                                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                                <span>{item.time}</span>
                                                            </p>
                                                        </div>
                                                    </div>
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
