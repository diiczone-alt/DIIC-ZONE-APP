'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    MessageSquare, Hash, Users, Send, Paperclip, Smile, Shield,
    User, Search, Loader2, Sparkles, AlertCircle, Image as ImageIcon, FileText, X,
    FolderOpen, Globe, Link, Download, Music, File
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { messagingService } from '@/services/messagingService';
import { toast } from 'sonner';

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

export default function HQMessagesPage() {
    const { user } = useAuth();
    
    // Core state
    const [loading, setLoading] = useState(true);
    const [teamList, setTeamList] = useState([]);
    const [squads, setSquads] = useState([]);
    const [profileMap, setProfileMap] = useState({});
    
    // Selection state
    const [activeTab, setActiveTab] = useState('channel'); // channel (squad general), dm (individual)
    const [selectedTarget, setSelectedTarget] = useState({ id: '', name: 'Selecciona una escuadra', type: 'channel' });
    const [currentChatId, setCurrentChatId] = useState(null);
    
    // Messaging state
    const [messagesList, setMessagesList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMediaDrawer, setShowMediaDrawer] = useState(false);
    const [activeDrawerTab, setActiveDrawerTab] = useState('media');
    
    // Unread count tracking
    const [unreadCounts, setUnreadCounts] = useState({});
    const [chatToTargetMap, setChatToTargetMap] = useState({});
    
    const fileInputRef = useRef(null);

    // 1. Load team members, profiles map, build target map, and group them into squads
    useEffect(() => {
        const loadHQMessagesData = async () => {
            try {
                setLoading(true);
                
                // Fetch profiles map
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
                
                // Fetch chats to build the mapping
                const { data: allChats } = await supabase
                    .from('chats')
                    .select('id, name, type');
                
                const cMap = {};
                if (allChats) {
                    allChats.forEach(c => {
                        if (c.type === 'direct') {
                            const parts = c.name.replace('direct_', '').split('_');
                            const otherId = parts.find(p => p !== user?.id && p !== 'a95d5a4c-093d-4806-85c5-45bf6ed3f76f');
                            if (otherId) {
                                cMap[c.id] = { type: 'dm', id: otherId };
                            }
                        } else if (c.type === 'squad') {
                            const parts = c.name.replace('squad_', '').split('_');
                            const cmId = parts[0];
                            cMap[c.id] = { type: 'channel', id: cmId };
                        }
                    });
                }
                setChatToTargetMap(cMap);

                // Fetch team members
                const { data: teamData } = await supabase
                    .from('team')
                    .select('*')
                    .order('name');
                
                if (teamData) {
                    setTeamList(teamData);
                    
                    // Identify CMs (squad leads)
                    const cms = teamData.filter(m => 
                        m.role?.toLowerCase()?.includes('community') || 
                        m.role?.toLowerCase() === 'cm'
                    );
                    
                    // Group squad members under their CM
                    const squadGroups = cms.map(cm => {
                        const members = teamData.filter(m => m.squad_lead_id === cm.id);
                        return {
                            lead: cm,
                            members: members
                        };
                    });
                    
                    setSquads(squadGroups);
                    
                    // Auto-select the first squad general channel
                    if (squadGroups.length > 0) {
                        const firstSquad = squadGroups[0];
                        setSelectedTarget({
                            id: firstSquad.lead.id,
                            name: `Escuadra General - ${firstSquad.lead.name}`,
                            type: 'channel'
                        });
                    }

                    // Initialize mock unread count for Dicson to demonstrate the feature visually
                    const dicson = teamData.find(m => m.name?.toLowerCase()?.includes('dicson'));
                    if (dicson) {
                        setUnreadCounts(prev => ({
                            ...prev,
                            [`dm_${dicson.id}`]: 1
                        }));
                    }
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error loading HQ messaging data:", err);
                toast.error("Error al cargar la información del equipo.");
                setLoading(false);
            }
        };

        loadHQMessagesData();
    }, [user]);

    // Clear unread counts for selected target
    useEffect(() => {
        if (!selectedTarget) return;
        const targetKey = `${selectedTarget.type}_${selectedTarget.id}`;
        setUnreadCounts(prev => {
            if (prev[targetKey] > 0) {
                return {
                    ...prev,
                    [targetKey]: 0
                };
            }
            return prev;
        });
    }, [selectedTarget]);

    // 2. Fetch or create a Chat Thread when active target changes
    useEffect(() => {
        if (!user) return;

        const getChatThread = async () => {
            try {
                let chatId = null;

                if (selectedTarget.type === 'channel') {
                    const cmId = selectedTarget.id;
                    if (cmId) {
                        const chat = await messagingService.getOrCreateSquadChat(cmId, 'general');
                        chatId = chat.id;
                    }
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
                const msgs = await messagingService.getMessages(currentChatId);
                const mapped = msgs.map(m => {
                    const isSelf = m.sender_id === user.id;
                    const senderName = m.sender_id === 'a95d5a4c-093d-4806-85c5-45bf6ed3f76f'
                        ? 'Tú (HQ)'
                        : (isSelf ? 'Tú (HQ)' : (profileMap[m.sender_id] || 'Colega'));

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
    }, [currentChatId, user, profileMap]);

    // 4. Global real-time subscription for messages (updates active and increments unread)
    useEffect(() => {
        if (!user) return;

        const globalChannel = supabase
            .channel('global-hq-messages')
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
                            ? 'Tú (HQ)'
                            : (isSelf ? 'Tú (HQ)' : (profileMap[newDbMsg.sender_id] || 'Colega'));

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
                            const targetKey = `${target.type}_${target.id}`;
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
    }, [currentChatId, user, profileMap, chatToTargetMap]);

    // Send handler
    const handleSend = async () => {
        if (!inputText.trim() || !currentChatId || !user) return;

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

    const handleEmojiClick = (emoji) => {
        setInputText(prev => prev + emoji);
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentChatId || !user) return;

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
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#050511] text-white">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-sm text-gray-400 animate-pulse uppercase tracking-widest font-black">Cargando centro de mensajería...</p>
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
        <div className="flex-1 p-10 bg-[#050511] text-white flex flex-col h-screen overflow-hidden">
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
                        <MessageSquare className="w-8 h-8 text-indigo-500" /> Centro de Mensajería HQ
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Supervisión, notificaciones y comunicación directa por escuadras o canales individuales.</p>
                </div>
            </header>

            <div className="flex-1 flex rounded-[2rem] overflow-hidden border border-white/10 bg-[#080818] mb-8 min-h-[400px]">
                
                {/* Side Bar inside page */}
                <div className="w-80 bg-black/30 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    
                    {/* Squads Section */}
                    <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                        <h2 className="text-gray-400 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                            <Shield className="w-4 h-4 text-indigo-400" /> Escuadras Activas
                        </h2>
                    </div>
                    <div className="p-3 space-y-4">
                        {squads.map(squad => {
                            const squadChannelKey = `channel_${squad.lead.id}`;
                            const squadChannelUnread = unreadCounts[squadChannelKey] || 0;
                            return (
                                <div key={squad.lead.id} className="space-y-1.5">
                                    {/* Squad Section Header */}
                                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-r from-indigo-500/10 to-transparent border-l-2 border-indigo-500 rounded-r-md mt-4 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                                            Escuadra {squad.lead.name}
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/10">
                                            CM: {squad.lead.name}
                                        </span>
                                    </div>
                                    
                                    {/* Group Chat for the Squad */}
                                    <button 
                                        onClick={() => setSelectedTarget({ id: squad.lead.id, name: `Escuadra General - ${squad.lead.name}`, type: 'channel' })}
                                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                            selectedTarget.type === 'channel' && selectedTarget.id === squad.lead.id
                                            ? 'bg-indigo-600/35 text-indigo-200 border border-indigo-500/30 shadow-md shadow-indigo-600/10' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                                        }`}
                                    >
                                        <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                                        <span className="flex-1">👥 Escuadra General - {squad.lead.name}</span>
                                        {squadChannelUnread > 0 && (
                                            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20 animate-pulse shrink-0">
                                                {squadChannelUnread}
                                            </span>
                                        )}
                                    </button>
                                    
                                    {/* Nested Squad Members */}
                                    <div className="pl-3.5 space-y-1 mt-1.5 border-l border-white/5 ml-4">
                                        {squad.members.map(member => {
                                            const isSelected = selectedTarget.type === 'dm' && selectedTarget.id === member.id;
                                            const roleColors = getRoleColors(member.role);
                                            const targetKey = `dm_${member.id}`;
                                            const unread = unreadCounts[targetKey] || 0;
                                            return (
                                                <button 
                                                    key={member.id}
                                                    onClick={() => setSelectedTarget({ id: member.id, name: member.name, type: 'dm', role: member.role })}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] font-medium text-left transition-all ${
                                                        isSelected
                                                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' 
                                                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300 border border-transparent'
                                                    }`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleColors.text.replace('text-', 'bg-')}`} />
                                                    <span className="truncate flex-1">
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
                                        {squad.members.length === 0 && (
                                            <p className="text-[9px] text-gray-700 italic pl-3">Sin creativos asignados</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
 
                    {/* Direct Messages Section */}
                    <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                        <h2 className="text-gray-400 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4 text-emerald-400" /> Directorio de Talentos
                        </h2>
                    </div>
                    <div className="p-2 space-y-1">
                        {teamList.map(member => {
                            const isSelected = selectedTarget.type === 'dm' && selectedTarget.id === member.id;
                            const roleColors = getRoleColors(member.role);
                            const targetKey = `dm_${member.id}`;
                            const unread = unreadCounts[targetKey] || 0;
                            return (
                                <button
                                    key={member.id}
                                    onClick={() => setSelectedTarget({ id: member.id, name: member.name, type: 'dm', role: member.role })}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                        isSelected 
                                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                                    }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${roleColors.avatar}`}>
                                            {member.name.charAt(0)}
                                        </div>
                                    </div>
                                    <span className="truncate flex-1">
                                        {member.name}
                                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ml-2 ${roleColors.badge}`}>
                                            {member.role}
                                        </span>
                                    </span>
                                    {unread > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20 animate-pulse shrink-0">
                                            {unread}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
 
                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-black/10 relative">
                    
                    {/* Header */}
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0">
                        <div className="flex items-center gap-3">
                            {selectedTarget.type === 'channel' ? (
                                <Users className="w-5 h-5 text-indigo-400" />
                            ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getRoleColors(selectedTarget.role).avatar}`}>
                                    {selectedTarget.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="text-white font-bold text-sm">
                                    {selectedTarget.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {selectedTarget.type === 'channel' 
                                        ? `Canal general de la escuadra (Encargada: ${selectedTarget.name.replace('Escuadra General - ', '')})` 
                                        : `Mensajería directa de HQ con el talento - Rol: ${selectedTarget.role || 'No definido'}`}
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowMediaDrawer(!showMediaDrawer)}
                            className={`p-2 rounded-xl border transition-all ${
                                showMediaDrawer 
                                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10'
                            }`}
                            title="Archivos y enlaces compartidos"
                        >
                            <FolderOpen className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {messagesList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-45">
                                <MessageSquare className="w-12 h-12 text-indigo-500/50 mb-3 animate-pulse" />
                                <p className="text-xs uppercase tracking-widest font-black text-indigo-400">Canal de Comunicación HQ</p>
                                <p className="text-xs text-gray-500 mt-1">Escribe tu primer mensaje o directiva para notificar al talento en tiempo real.</p>
                            </div>
                        ) : (
                            messagesList.map(msg => (
                                <div key={msg.id} className={`flex gap-4 ${msg.self ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                                        msg.self 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
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
                                            ? 'bg-indigo-600/10 text-indigo-100 rounded-tr-none border border-indigo-500/20 shadow-lg shadow-indigo-600/5' 
                                            : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                                        }`}>
                                            {msg.text}
                                            
                                            {msg.isFile && (
                                                <div className="mt-3 flex items-center gap-3 bg-black/40 border border-white/10 p-2.5 rounded-xl">
                                                    {msg.isImage ? (
                                                        <div className="w-10 h-10 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
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

                    {/* Emoji Picker Panel */}
                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-24 right-4 bg-[#0E0E18] border border-white/15 p-3 rounded-2xl shadow-2xl z-50 flex flex-wrap gap-2 max-w-[180px]"
                            >
                                <div className="flex justify-between items-center w-full border-b border-white/5 pb-1.5 mb-1.5 shrink-0">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400">Emojis rápidos</span>
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

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/5 bg-[#050510]/80 shrink-0">
                        <div className="flex gap-2 bg-black/30 border border-white/10 rounded-xl p-2 items-end">
                            <button 
                                onClick={triggerFileSelect}
                                className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                title="Adjuntar archivo o guía"
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
                                placeholder={`Enviar mensaje a ${selectedTarget.name}...`}
                                className="flex-1 bg-transparent border-0 focus:ring-0 text-white text-sm resize-none py-2 max-h-32 min-h-[40px] focus:outline-none"
                                rows="1"
                            />
                            <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2 rounded-lg transition-all ${showEmojiPicker ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10'}`}
                                title="Insertar emoji"
                            >
                                <Smile className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleSend}
                                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
                                title="Enviar directiva"
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
                            className="border-l border-white/10 bg-[#070715] flex flex-col shrink-0 overflow-hidden h-full"
                        >
                            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                    <FolderOpen className="w-4 h-4 text-indigo-400" /> Compartido
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
                                            ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
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
                                                    className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center p-2 text-center"
                                                >
                                                    <ImageIcon className="w-6 h-6 text-indigo-400/60 group-hover:scale-110 transition-transform mb-1" />
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
                                                    className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/[0.02] transition-all group"
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <Globe className="w-4 h-4 text-indigo-400/80 shrink-0 mt-0.5" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-indigo-400 truncate group-hover:underline">{item.url}</p>
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
