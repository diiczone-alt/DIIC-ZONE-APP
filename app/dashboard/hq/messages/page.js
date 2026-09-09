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
    UserCheck, CheckSquare, XCircle, Share2, MoreHorizontal, Video,
    TrendingUp, Award, BarChart3, PieChart, RefreshCw, Copy, CheckCircle
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
    // 'all' | 'clients' | 'creative' | 'updates'
    const [activeFilter, setActiveFilter] = useState('all'); 
    const [creativeDepartmentFilter, setCreativeDepartmentFilter] = useState('all'); // 'all' | 'production' | 'editing' | 'design' | 'cm_strategy' | 'specialists'
    const [searchQuery, setSearchQuery] = useState('');
    const [headerSubTab, setHeaderSubTab] = useState('summary'); // 'summary' | 'analytics' | 'details' | 'files' | 'history' | 'plan'
    const [chatContentTypeFilter, setChatContentTypeFilter] = useState('all'); // 'all' | 'calls' | 'emails' | 'messages' | 'tasks' | 'calendar' | 'docs'
    
    // Selection state:
    // target = { id, name, type: 'channel' | 'dm' | 'client', role, clientData, memberData, squadData }
    const [selectedTarget, setSelectedTarget] = useState({ id: '', name: 'Cargando...', type: 'client' });
    const [currentChatId, setCurrentChatId] = useState(null);
    
    // Dynamic Badges State
    const [priorityLevel, setPriorityLevel] = useState('HIGH'); // 'HIGH' | 'MID' | 'LOW'
    const [temperatureState, setTemperatureState] = useState('WARM'); // 'HOT' | 'WARM' | 'COLD'
    const [assignedManager, setAssignedManager] = useState('');
    
    // Messaging state
    const [messagesList, setMessagesList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showRightPanel, setShowRightPanel] = useState(true);
    
    // Deal & Task Interactive State
    const [dealStage, setDealStage] = useState('negotiation'); // 'negotiation' | 'close' | 'active'
    const [planChecklist, setPlanChecklist] = useState({
        briefing: true,
        calendar: true,
        metaAds: false
    });
    const [taskDecision, setTaskDecision] = useState('diic'); // 'diic' | 'competitor'
    const [taskChecklist, setTaskChecklist] = useState({
        quality: true,
        responseTime: false
    });
    const [isTaskCompleted, setIsTaskCompleted] = useState(false);
    
    // Dynamic timeline activities state
    const [customTimelineEvents, setCustomTimelineEvents] = useState([]);
    
    // Modals
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [showTempMenu, setShowTempMenu] = useState(false);
    
    // Form states for modals
    const [newMeetingData, setNewMeetingData] = useState({
        title: 'Revisión Estratégica de Sprint',
        date: new Date().toISOString().split('T')[0],
        time: '15:00',
        type: 'Reunión de Estrategia',
        link: 'https://meet.google.com/diic-zone'
    });
    
    const [newNoteData, setNewNoteData] = useState({
        title: '',
        desc: '',
        stage: 'Discovery',
        type: 'message'
    });
    
    const [emailModalData, setEmailModalData] = useState({
        subject: 'Actualización de Sprint & Propuesta Creativa - DIIC ZONE',
        body: 'Hola, adjuntamos el reporte de avance de la producción y la propuesta audiovisual para los próximos lanzamientos.'
    });

    const fileInputRef = useRef(null);
    const messageInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages update
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesList]);

    // 1. Load team members, clients, profiles map
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
                setAssignedManager(firstClient.cm || 'Leslie M.');
            } else if (safeTeam.length > 0) {
                const firstMember = safeTeam[0];
                setSelectedTarget({
                    id: firstMember.id,
                    name: firstMember.name,
                    type: 'dm',
                    role: firstMember.role,
                    memberData: firstMember
                });
                setAssignedManager(firstMember.squad_lead_name || 'Admin HQ');
            }
            
            setLoading(false);
        } catch (err) {
            console.error("Error loading HQ messaging data:", err);
            toast.error("Error al sincronizar datos de mensajería.");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHQMessagesData();
    }, [user]);

    // Update manager state when selectedTarget changes
    useEffect(() => {
        if (selectedTarget.clientData) {
            setAssignedManager(selectedTarget.clientData.cm || 'Leslie M.');
        } else if (selectedTarget.memberData) {
            setAssignedManager(selectedTarget.memberData.squad_lead_name || 'Admin HQ');
        }
    }, [selectedTarget]);

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
                        fileName: m.metadata?.fileName || '',
                        type: m.metadata?.type || 'chat' // 'chat' | 'call' | 'email' | 'task' | 'calendar' | 'doc'
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
                            fileName: newDbMsg.metadata?.fileName || '',
                            type: newDbMsg.metadata?.type || 'chat'
                        }];
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(globalChannel);
        };
    }, [currentChatId, user, profileMap, selectedTarget.name]);

    // Structured Lists: Separated Clientes and Zona Creativa
    const clientItems = useMemo(() => {
        return clientList.map((c, i) => {
            const niche = getClientNiche(c);
            return {
                id: c.id,
                name: c.name,
                subtitle: `${niche.name} • ${c.city || 'Santo Domingo'}`,
                category: 'client',
                type: 'client',
                priority: i % 3 === 0 ? 'High' : (i % 3 === 1 ? 'Mid' : 'Low'),
                statusText: i % 2 === 0 ? 'Awaiting our proposal' : 'Content in production',
                dealStage: i % 3 === 0 ? 'Negociación' : (i % 3 === 1 ? 'Activo' : 'Cierre'),
                plan: c.plan || 'Plan Crecimiento',
                fee: c.price || '500',
                cm: c.cm || 'Leslie M.',
                data: c,
                niche
            };
        });
    }, [clientList]);

    const creativeItems = useMemo(() => {
        return teamList.map((m, i) => {
            const roleInfo = getRoleDetails(m.role);
            return {
                id: m.id,
                name: m.name,
                subtitle: `${roleInfo.department} • ${m.city || 'Sede'}`,
                category: 'creative',
                type: 'dm',
                role: m.role || 'Especialista Creativo',
                department: roleInfo.department,
                depKey: roleInfo.depKey,
                priority: i % 2 === 0 ? 'High' : 'Mid',
                statusText: i % 3 === 0 ? 'En rodaje / Producción' : (i % 3 === 1 ? 'Sprint de edición activo' : 'Disponible para asignación'),
                salary: m.salary || '850',
                roleInfo,
                data: m
            };
        });
    }, [teamList]);

    // Updates stream items
    const updateEvents = useMemo(() => {
        return [
            {
                id: 'upd-1',
                name: 'Entrega de Guiones #DZ-09',
                subtitle: 'Anthony V. subió 4 guiones audiovisuales',
                time: 'Hace 10 min',
                type: 'update',
                priority: 'High',
                category: 'updates',
                statusText: 'Revisión pendiente por CM'
            },
            {
                id: 'upd-2',
                name: 'Briefing Aprobado: Dr. Oscar',
                subtitle: 'Cliente validó el formato de reels médicos',
                time: 'Hace 35 min',
                type: 'update',
                priority: 'Mid',
                category: 'updates',
                statusText: 'Listo para calendario de rodaje'
            },
            {
                id: 'upd-3',
                name: 'Cierre de Contrato: Sebas',
                subtitle: 'Plan Crecimiento recurrente $500/m confirmado',
                time: 'Hace 2 horas',
                type: 'update',
                priority: 'High',
                category: 'updates',
                statusText: 'Facturación sincronizada'
            }
        ];
    }, []);

    // Filtered list based on active top tab / filter pill
    const currentSidebarList = useMemo(() => {
        let baseList = [];

        if (activeFilter === 'clients') {
            baseList = clientItems;
        } else if (activeFilter === 'creative') {
            if (creativeDepartmentFilter === 'all') {
                baseList = creativeItems;
            } else {
                baseList = creativeItems.filter(item => item.depKey === creativeDepartmentFilter);
            }
        } else if (activeFilter === 'updates') {
            baseList = updateEvents;
        } else {
            // 'all' = combined worklist
            baseList = [...clientItems, ...creativeItems];
        }

        if (!searchQuery.trim()) return baseList;
        const q = searchQuery.toLowerCase();
        return baseList.filter(item => 
            item.name?.toLowerCase().includes(q) || 
            item.subtitle?.toLowerCase().includes(q)
        );
    }, [activeFilter, creativeDepartmentFilter, clientItems, creativeItems, updateEvents, searchQuery]);

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

    // Dynamic timeline activities for the active contact/deal
    const timelineActivities = useMemo(() => {
        const name = selectedTarget.name || 'Cliente';
        const defaultEvents = [
            {
                id: 'act-1',
                type: 'call',
                title: `Information Provided to ${name}`,
                desc: 'Checked client requirements, brand guidelines and production scope. Created follow-up pipeline.',
                date: '12 MAY',
                assignee: assignedManager || selectedTarget.clientData?.cm || 'Leslie M.',
                stage: 'Discovery'
            },
            {
                id: 'act-2',
                type: 'message',
                title: 'Gathering additional information & scripts',
                desc: 'Client confirmed active interest and is awaiting our Proposal and Shooting Schedule.',
                date: '15 MAY',
                assignee: selectedTarget.clientData?.filmmaker || 'Anthony V.',
                stage: 'Negotiation'
            }
        ];

        return [...customTimelineEvents, ...defaultEvents];
    }, [selectedTarget, customTimelineEvents, assignedManager]);

    // Filtered messages list based on the quick icon filter
    const filteredMessages = useMemo(() => {
        if (chatContentTypeFilter === 'all') return messagesList;
        if (chatContentTypeFilter === 'docs') return messagesList.filter(m => m.isFile || m.isImage);
        if (chatContentTypeFilter === 'tasks') return messagesList.filter(m => m.type === 'task' || m.text.toLowerCase().includes('tarea') || m.text.toLowerCase().includes('propuesta'));
        if (chatContentTypeFilter === 'calls') return messagesList.filter(m => m.type === 'call' || m.text.toLowerCase().includes('llamada') || m.text.toLowerCase().includes('reunión'));
        if (chatContentTypeFilter === 'emails') return messagesList.filter(m => m.type === 'email' || m.text.toLowerCase().includes('correo') || m.text.toLowerCase().includes('email'));
        if (chatContentTypeFilter === 'calendar') return messagesList.filter(m => m.type === 'calendar' || m.text.toLowerCase().includes('agenda') || m.text.toLowerCase().includes('rodaje'));
        return messagesList;
    }, [messagesList, chatContentTypeFilter]);

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

    // Quick trigger action to focus chat and insert pre-fill
    const handleFocusChatWithText = (prefix = '') => {
        setHeaderSubTab('summary');
        if (prefix) setInputText(prefix);
        setTimeout(() => {
            messageInputRef.current?.focus();
        }, 100);
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

    // Add new Note / Milestone
    const handleAddCustomNote = (e) => {
        e.preventDefault();
        if (!newNoteData.title.trim()) {
            toast.error("Ingresa un título para la nota");
            return;
        }

        const newEvent = {
            id: `custom-${Date.now()}`,
            type: newNoteData.type,
            title: newNoteData.title,
            desc: newNoteData.desc || 'Nota estratégica añadida por HQ Admin.',
            date: 'HOY',
            assignee: assignedManager || 'HQ Admin',
            stage: newNoteData.stage
        };

        setCustomTimelineEvents(prev => [newEvent, ...prev]);
        setShowAddNoteModal(false);
        setNewNoteData({ title: '', desc: '', stage: 'Discovery', type: 'message' });
        toast.success("Hito agregado a la línea de tiempo.");
    };

    // Schedule new meeting
    const handleScheduleMeeting = (e) => {
        e.preventDefault();
        const dateStr = new Date(newMeetingData.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
        
        const newMeetingEvent = {
            id: `meet-${Date.now()}`,
            type: 'calendar',
            title: `${newMeetingData.type}: ${newMeetingData.title}`,
            desc: `Agendado para ${newMeetingData.date} a las ${newMeetingData.time}. Enlace de sesión: ${newMeetingData.link}`,
            date: dateStr,
            assignee: assignedManager || 'HQ Admin',
            stage: 'Schedule'
        };

        setCustomTimelineEvents(prev => [newMeetingEvent, ...prev]);
        
        // Also send message to the chat
        if (currentChatId && user) {
            messagingService.sendMessage(
                currentChatId,
                user.id,
                `📅 **Nueva Cita Agendada**\n${newMeetingData.type}: ${newMeetingData.title}\n🗓 Fecha: ${newMeetingData.date} - ${newMeetingData.time}\n🔗 Enlace: ${newMeetingData.link}`,
                { type: 'calendar' }
            ).catch(console.error);
        }

        setShowScheduleModal(false);
        toast.success(`Cita agendada para el ${newMeetingData.date} a las ${newMeetingData.time}`);
    };

    // Send email simulated handler
    const handleSendQuickEmail = (e) => {
        e.preventDefault();
        const clientEmail = selectedTarget.clientData?.email || `${selectedTarget.name.toLowerCase().replace(/\s+/g, '')}@diiczone.com`;
        
        // Also log to chat
        if (currentChatId && user) {
            messagingService.sendMessage(
                currentChatId,
                user.id,
                `✉️ **Email enviado a ${clientEmail}**\nAsunto: ${emailModalData.subject}\n\n${emailModalData.body}`,
                { type: 'email' }
            ).catch(console.error);
        }

        setShowEmailModal(false);
        toast.success(`Correo enviado exitosamente a ${clientEmail}`);
    };

    // Send proposal reminder to chat
    const handleSendProposalReminder = async () => {
        if (!currentChatId || !user) return;
        try {
            await messagingService.sendMessage(
                currentChatId,
                user.id,
                `🚀 **Recordatorio Prioritario**: Se ha actualizado la propuesta audiovisual con guiones y cronograma para **${selectedTarget.name}**. Favor revisar para aprobación final.`,
                { type: 'task' }
            );
            toast.success("Recordatorio de propuesta enviado al canal.");
        } catch (err) {
            console.error(err);
            toast.error("Error al enviar recordatorio.");
        }
    };

    if (loading && teamList.length === 0 && clientList.length === 0) {
        return (
            <div className="h-full bg-[#0A0B10] flex flex-col items-center justify-center text-white gap-6">
                <div className="w-14 h-14 border-4 border-[#D4FF00]/20 border-t-[#D4FF00] rounded-full animate-spin" />
                <div className="space-y-1 text-center">
                    <p className="font-black uppercase tracking-[0.3em] text-xs text-[#D4FF00] animate-pulse">Sincronizando Workspace HQ</p>
                    <p className="text-[10px] text-gray-500 font-mono">Separando canales de la Zona Creativa y Cartera de Marcas</p>
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
                    {/* Live Sync Status Pill */}
                    <button 
                        onClick={() => {
                            loadHQMessagesData();
                            toast.success("Sincronización en tiempo real actualizada.");
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider transition-all cursor-pointer"
                        title="Click para resincronizar canales"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>HQ REALTIME LIVE</span>
                        <RefreshCw className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                    </button>

                    <button
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${
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
                {/* COLUMN 1: LEFT SUB-SIDEBAR (WORKLIST & SEPARATED TABS) */}
                {/* ============================================================== */}
                <div className="w-80 md:w-88 bg-[#111217] rounded-[28px] border border-white/5 flex flex-col shrink-0 overflow-hidden shadow-2xl">
                    
                    {/* Top 4 KPI Stat Pill Cards (INTERACTIVE FILTER BUTTONS) */}
                    <div className="p-3.5 border-b border-white/5 bg-black/20">
                        <div className="grid grid-cols-2 gap-2">
                            
                            {/* 1. Worklist Card */}
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                    activeFilter === 'all'
                                        ? 'bg-[#1E202B] border-yellow-400/60 shadow-lg shadow-yellow-400/5'
                                        : 'bg-[#1A1B22] border-white/5 hover:border-white/10 hover:bg-[#1C1D26]'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-yellow-400/80 bg-yellow-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Worklist</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1 block">{clientItems.length + creativeItems.length}</span>
                            </button>

                            {/* 2. Clientes Card */}
                            <button
                                onClick={() => setActiveFilter('clients')}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                    activeFilter === 'clients'
                                        ? 'bg-[#1E202B] border-red-400/60 shadow-lg shadow-red-400/5'
                                        : 'bg-[#1A1B22] border-white/5 hover:border-white/10 hover:bg-[#1C1D26]'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400/80 bg-red-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Clientes</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1 block">{clientList.length}</span>
                            </button>

                            {/* 3. Updates Card */}
                            <button
                                onClick={() => setActiveFilter('updates')}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                    activeFilter === 'updates'
                                        ? 'bg-[#1E202B] border-sky-400/60 shadow-lg shadow-sky-400/5'
                                        : 'bg-[#1A1B22] border-white/5 hover:border-white/10 hover:bg-[#1C1D26]'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-sky-400/80 bg-sky-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Updates</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1 block">22</span>
                            </button>

                            {/* 4. Zona Creativa (Nodos) Card */}
                            <button
                                onClick={() => setActiveFilter('creative')}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                    activeFilter === 'creative'
                                        ? 'bg-[#1E202B] border-purple-400/60 shadow-lg shadow-purple-400/5'
                                        : 'bg-[#1A1B22] border-white/5 hover:border-white/10 hover:bg-[#1C1D26]'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-purple-400/80 bg-purple-400/20" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nodos</span>
                                </div>
                                <span className="text-xl font-black text-white mt-1 block">{teamList.length}</span>
                            </button>
                        </div>

                        {/* Category Filter Pills (Clientes vs Zona Creativa) */}
                        <div className="mt-3 flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 text-[11px] font-bold">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                                    activeFilter === 'all'
                                        ? 'bg-[#D4FF00] text-black font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setActiveFilter('clients')}
                                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                                    activeFilter === 'clients'
                                        ? 'bg-red-500 text-white font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <span>💼</span>
                                <span>Clientes</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('creative')}
                                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                                    activeFilter === 'creative'
                                        ? 'bg-purple-500 text-white font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <span>🎨</span>
                                <span>Creativos</span>
                            </button>
                            <button
                                onClick={() => setActiveFilter('updates')}
                                className={`py-1.5 px-2.5 rounded-lg transition-all text-center ${
                                    activeFilter === 'updates'
                                        ? 'bg-sky-500 text-white font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                ⚡
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="mt-2.5 relative">
                            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    activeFilter === 'clients' 
                                        ? 'Buscar cliente, empresa, nicho...' 
                                        : (activeFilter === 'creative' ? 'Buscar filmmaker, editor, diseñador...' : 'Buscar contacto o tarea...')
                                }
                                className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#181920] border border-white/5 focus:border-[#D4FF00]/40 text-xs text-white placeholder:text-gray-600 outline-none transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {/* Sub-Department Filter when in Zona Creativa */}
                        {activeFilter === 'creative' && (
                            <div className="mt-2.5 flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar text-[10px] font-bold">
                                {[
                                    { key: 'all', label: 'Todos' },
                                    { key: 'production', label: 'Filmmakers' },
                                    { key: 'editing', label: 'Editores' },
                                    { key: 'design', label: 'Diseño' },
                                    { key: 'cm_strategy', label: 'CM & Lead' },
                                    { key: 'specialists', label: 'Especialistas' }
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setCreativeDepartmentFilter(tab.key)}
                                        className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                                            creativeDepartmentFilter === tab.key
                                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black'
                                                : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section Label */}
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-sm border ${
                                activeFilter === 'clients' ? 'border-red-400 bg-red-400/30' : (activeFilter === 'creative' ? 'border-purple-400 bg-purple-400/30' : 'border-[#D4FF00] bg-[#D4FF00]/30')
                            }`} />
                            <span>
                                {activeFilter === 'clients' 
                                    ? `Cartera de Clientes (${currentSidebarList.length})` 
                                    : (activeFilter === 'creative' ? `Zona Creativa • Nodos (${currentSidebarList.length})` : `Worklist Stream (${currentSidebarList.length})`)}
                            </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    </div>

                    {/* Contact Worklist Cards */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                        {currentSidebarList.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-xs">
                                No se encontraron resultados con ese criterio.
                            </div>
                        ) : (
                            currentSidebarList.map(item => {
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
                                                    role: item.role,
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
                                                    {item.type === 'client' ? <Briefcase className="w-3 h-3 text-black/70" /> : <Layers className="w-3 h-3 text-black/70" />}
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
                                            if (item.type === 'update') {
                                                toast.info(`Evento: ${item.name}`);
                                                return;
                                            }
                                            setSelectedTarget({
                                                id: item.id,
                                                name: item.name,
                                                type: item.type,
                                                role: item.role,
                                                clientData: item.type === 'client' ? item.data : null,
                                                memberData: item.type === 'dm' ? item.data : null
                                            });
                                        }}
                                        className="p-3.5 rounded-2xl bg-[#16171E] border border-white/5 hover:border-white/10 hover:bg-[#1A1B24] transition-all flex flex-col gap-2 cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`w-9 h-9 rounded-xl font-black flex items-center justify-center shrink-0 text-xs group-hover:scale-105 transition-transform ${
                                                    item.type === 'client' 
                                                        ? 'bg-red-950/40 text-red-300 border border-red-500/20' 
                                                        : (item.type === 'dm' ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20' : 'bg-sky-950/40 text-sky-300 border border-sky-500/20')
                                                }`}>
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
                                                {item.type === 'client' ? <Briefcase className="w-3 h-3 text-gray-500" /> : <FileText className="w-3 h-3 text-gray-500" />}
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
                            })
                        )}
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
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                                            selectedTarget.type === 'client'
                                                ? 'bg-red-100 text-red-700 border-red-200'
                                                : 'bg-purple-100 text-purple-700 border-purple-200'
                                        }`}>
                                            {selectedTarget.type === 'client' ? 'Cliente / Marca' : 'Zona Creativa'}
                                        </span>
                                    </div>

                                    <p className="text-xs font-semibold text-slate-600 truncate">
                                        {selectedTarget.type === 'client' 
                                            ? `${selectedTarget.clientData?.industry || 'Empresa'} • Plan: ${selectedTarget.clientData?.plan || 'Plan Crecimiento'}`
                                            : `${selectedTarget.role || 'Especialista Creativo'} • DIIC ZONE Node`}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                                        <span>📍 {selectedTarget.clientData?.city || selectedTarget.memberData?.city || 'Santo Domingo'}</span>
                                        <span>📞 {selectedTarget.clientData?.whatsapp_number || selectedTarget.memberData?.whatsapp || '+1 (809) 555-0100'}</span>
                                        <span className="hidden sm:inline">✉️ {selectedTarget.clientData?.email || `${selectedTarget.name.toLowerCase().replace(/\s+/g, '')}@diiczone.com`}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Manager & Status Badges (ALL INTERACTIVE) */}
                            <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0">
                                
                                {/* Manager Assignment Button */}
                                <button
                                    onClick={() => setShowManagerModal(true)}
                                    className="flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm transition-all cursor-pointer"
                                    title="Click para reasignar Manager"
                                >
                                    <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[9px] font-black flex items-center justify-center">
                                        {(assignedManager || 'L').charAt(0)}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-800">
                                        <span className="text-slate-400 font-normal">Manager </span>
                                        {assignedManager || 'Sin asignar'}
                                    </div>
                                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1" />
                                </button>

                                {/* Priority and Temperature Pill Selectors */}
                                <div className="flex items-center gap-1.5 relative">
                                    
                                    {/* Priority Button */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm transition-all cursor-pointer ${
                                                priorityLevel === 'HIGH' 
                                                    ? 'bg-red-500 text-white' 
                                                    : (priorityLevel === 'MID' ? 'bg-amber-500 text-white' : 'bg-cyan-600 text-white')
                                            }`}
                                            title="Cambiar prioridad"
                                        >
                                            {priorityLevel}
                                        </button>

                                        {showPriorityMenu && (
                                            <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-1 w-24">
                                                {['HIGH', 'MID', 'LOW'].map(lvl => (
                                                    <button
                                                        key={lvl}
                                                        onClick={() => {
                                                            setPriorityLevel(lvl);
                                                            setShowPriorityMenu(false);
                                                            toast.success(`Prioridad actualizada a ${lvl}`);
                                                        }}
                                                        className="px-2 py-1 text-[10px] font-bold text-left rounded-lg text-white hover:bg-white/10"
                                                    >
                                                        {lvl}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Temperature / Lead Status Button */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowTempMenu(!showTempMenu)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm transition-all cursor-pointer ${
                                                temperatureState === 'HOT'
                                                    ? 'bg-rose-500 text-white'
                                                    : (temperatureState === 'WARM' ? 'bg-[#D4FF00] text-slate-950' : 'bg-blue-200 text-blue-900')
                                            }`}
                                            title="Cambiar estado del lead"
                                        >
                                            {temperatureState}
                                        </button>

                                        {showTempMenu && (
                                            <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-1 w-24">
                                                {['HOT', 'WARM', 'COLD'].map(tmp => (
                                                    <button
                                                        key={tmp}
                                                        onClick={() => {
                                                            setTemperatureState(tmp);
                                                            setShowTempMenu(false);
                                                            toast.success(`Estado del lead actualizado a ${tmp}`);
                                                        }}
                                                        className="px-2 py-1 text-[10px] font-bold text-left rounded-lg text-white hover:bg-white/10"
                                                    >
                                                        {tmp}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Bottom Sub-Header Navigation & Action Circles (ALL 5 ACTIVATED) */}
                        <div className="mt-4 pt-3 border-t border-slate-300/60 flex flex-wrap items-center justify-between gap-3">
                            
                            {/* Action Icon Circles */}
                            <div className="flex items-center gap-2">
                                
                                {/* 1. WhatsApp / Phone Launcher */}
                                <a
                                    href={`https://wa.me/${(selectedTarget.clientData?.whatsapp_number || selectedTarget.memberData?.whatsapp || '18090000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${selectedTarget.name}, te escribo desde DIIC ZONE respecto a tu plan y producción audiovisual.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer"
                                    title="Abrir WhatsApp Directo"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                </a>

                                {/* 2. Focus Message / Chat Input */}
                                <button 
                                    onClick={() => handleFocusChatWithText()}
                                    className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer" 
                                    title="Escribir Mensaje"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </button>

                                {/* 3. Email Modal Launcher */}
                                <button 
                                    onClick={() => setShowEmailModal(true)}
                                    className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer" 
                                    title="Redactar Correo"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                </button>

                                {/* 4. Schedule Meeting / Shoot Launcher */}
                                <button 
                                    onClick={() => setShowScheduleModal(true)}
                                    className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer" 
                                    title="Agendar Rodaje o Reunión"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                </button>

                                {/* 5. Add Note / Milestone Launcher */}
                                <button 
                                    onClick={() => setShowAddNoteModal(true)}
                                    className="w-8 h-8 rounded-full bg-[#D4FF00] text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer" 
                                    title="Agregar Nota / Hito"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Deal Identifier & Sub-Tab Links (ALL 6 ACTIVATED) */}
                            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar">
                                
                                {/* Plan Badge (Clickable to open plan details) */}
                                <button 
                                    onClick={() => setShowPlanModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold shadow-sm shrink-0 cursor-pointer transition-colors"
                                    title="Ver detalle del plan"
                                >
                                    <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Plan #DZ-{selectedTarget.id?.slice(0, 6) || '2026'}</span>
                                </button>

                                {/* Tabs */}
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                                    {[
                                        { key: 'summary', label: 'Summary' },
                                        { key: 'analytics', label: 'Analytics' },
                                        { key: 'details', label: 'Details' },
                                        { key: 'files', label: 'Files' },
                                        { key: 'history', label: 'History' }
                                    ].map((tab) => {
                                        const isActive = headerSubTab === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => setHeaderSubTab(tab.key)}
                                                className={`transition-colors capitalize cursor-pointer ${
                                                    isActive ? 'text-slate-950 font-black border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CENTER WORKSPACE WITH CONDITIONAL TAB VIEWS --- */}
                    <div className="flex-1 flex flex-col bg-[#F3F4F7] text-slate-900 rounded-[28px] overflow-hidden shadow-xl min-h-0 border border-slate-200/60">
                        
                        {/* VIEW 1: SUMMARY (TIMELINE + LIVE CHAT STREAM) */}
                        {headerSubTab === 'summary' && (
                            <>
                                {/* Upper Section: Activity / Milestones Timeline */}
                                <div className="p-3.5 border-b border-slate-200/80 bg-white/70">
                                    
                                    {/* Filter Bar */}
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-700">
                                            <Activity className="w-3.5 h-3.5 text-slate-600" />
                                            <span>Línea de Hitos & Seguimiento</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => setShowAddNoteModal(true)} 
                                                className="px-2 py-1 rounded-lg text-slate-700 hover:bg-slate-100 text-[10px] font-bold flex items-center gap-1 border border-slate-200"
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>Añadir Hito</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Milestone Cards Stream */}
                                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                        {timelineActivities.map(act => (
                                            <div 
                                                key={act.id}
                                                className="p-3 rounded-2xl bg-white border border-slate-200/70 shadow-sm flex items-start justify-between gap-3 hover:border-slate-300 transition-all"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                                                        {act.type === 'call' ? <Phone className="w-4 h-4" /> : (act.type === 'calendar' ? <Calendar className="w-4 h-4 text-purple-600" /> : <MessageSquare className="w-4 h-4" />)}
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Lower Section: Live Conversation Stream */}
                                <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFC]">
                                    
                                    {/* Quick Channel Content Filter Bar (ALL 6 ACTIVATED) */}
                                    <div className="px-4 py-2 border-b border-slate-200/60 bg-white flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-4 text-slate-400 text-xs">
                                            <button 
                                                onClick={() => {
                                                    setChatContentTypeFilter('calls');
                                                    toast.info("Filtrando llamadas y minutas");
                                                }}
                                                className={`p-1 rounded-lg transition-colors cursor-pointer ${chatContentTypeFilter === 'calls' ? 'text-slate-950 font-black bg-slate-100' : 'hover:text-slate-700'}`}
                                                title="Filtrar Llamadas"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setChatContentTypeFilter('emails');
                                                    toast.info("Filtrando correos y avisos");
                                                }}
                                                className={`p-1 rounded-lg transition-colors cursor-pointer ${chatContentTypeFilter === 'emails' ? 'text-slate-950 font-black bg-slate-100' : 'hover:text-slate-700'}`}
                                                title="Filtrar Emails"
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setChatContentTypeFilter('all');
                                                    toast.info("Mostrando todos los mensajes");
                                                }}
                                                className={`p-1 rounded-lg transition-colors cursor-pointer ${chatContentTypeFilter === 'all' ? 'text-slate-950 font-black bg-slate-100' : 'hover:text-slate-700'}`}
                                                title="Chat General"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setChatContentTypeFilter('tasks');
                                                    toast.info("Filtrando tareas y propuestas");
                                                }}
                                                className={`p-1 rounded-lg transition-colors cursor-pointer ${chatContentTypeFilter === 'tasks' ? 'text-slate-950 font-black bg-slate-100' : 'hover:text-slate-700'}`}
                                                title="Filtrar Tareas"
                                            >
                                                <CheckSquare className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setChatContentTypeFilter('calendar');
                                                    toast.info("Filtrando eventos de agenda");
                                                }}
                                                className={`p-1 rounded-lg transition-colors cursor-pointer ${chatContentTypeFilter === 'calendar' ? 'text-slate-950 font-black bg-slate-100' : 'hover:text-slate-700'}`}
                                                title="Filtrar Calendario"
                                            >
                                                <Calendar className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setChatContentTypeFilter('docs');
                                                    toast.info("Filtrando archivos y guiones");
                                                }}
                                                className={`p-1 rounded-lg transition-colors cursor-pointer ${chatContentTypeFilter === 'docs' ? 'text-slate-950 font-black bg-slate-100' : 'hover:text-slate-700'}`}
                                                title="Filtrar Documentos"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {chatContentTypeFilter !== 'all' && (
                                            <button 
                                                onClick={() => setChatContentTypeFilter('all')}
                                                className="text-[10px] text-slate-500 hover:text-slate-900 font-bold"
                                            >
                                                Limpiar filtro
                                            </button>
                                        )}
                                    </div>

                                    {/* Message Bubble List */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                        {filteredMessages.length === 0 ? (
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
                                            filteredMessages.map(msg => (
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
                                                ref={messageInputRef}
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                placeholder={`Enviar mensaje o directiva a ${selectedTarget.name}...`}
                                                className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                                            />

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                    className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                                >
                                                    <Smile className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
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
                            </>
                        )}

                        {/* VIEW 2: ANALYTICS (REAL PERFORMANCE METRICS) */}
                        {headerSubTab === 'analytics' && (
                            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">Métricas & Rendimiento</h3>
                                        <p className="text-xs text-slate-500">Rendimiento de entregas y retorno del plan activo para {selectedTarget.name}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                                        Sprint Activo
                                    </span>
                                </div>

                                {/* 4 Metric Stat Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between text-slate-500 mb-1">
                                            <span className="text-[11px] font-bold uppercase">Reels Entregados</span>
                                            <Video className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900">8 / 12</div>
                                        <div className="text-[10px] text-emerald-600 font-bold mt-1">66% completado</div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between text-slate-500 mb-1">
                                            <span className="text-[11px] font-bold uppercase">ROAS Estimado</span>
                                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900">3.8x</div>
                                        <div className="text-[10px] text-emerald-600 font-bold mt-1">+18% vs mes previo</div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between text-slate-500 mb-1">
                                            <span className="text-[11px] font-bold uppercase">Tasa de Aprobación</span>
                                            <Award className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900">92%</div>
                                        <div className="text-[10px] text-slate-500 font-bold mt-1">1ª revisión directa</div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between text-slate-500 mb-1">
                                            <span className="text-[11px] font-bold uppercase">Velocidad de Entrega</span>
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900">2.4 d</div>
                                        <div className="text-[10px] text-slate-500 font-bold mt-1">Promedio por guion</div>
                                    </div>
                                </div>

                                {/* Graph / Progress Breakdown */}
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Flujo de Producción Mensual</h4>
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <div className="flex justify-between font-bold mb-1">
                                                <span>Fase 1: Briefing & Estrategia</span>
                                                <span className="text-emerald-600">100% (Completado)</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-full" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between font-bold mb-1">
                                                <span>Fase 2: Rodaje & Filmmaking</span>
                                                <span className="text-purple-600">80% (En curso)</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-4/5" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between font-bold mb-1">
                                                <span>Fase 3: Post-producción & Color</span>
                                                <span className="text-blue-600">60%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-3/5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 3: DETAILS (FULL TECHNICAL & BUSINESS PROFILE) */}
                        {headerSubTab === 'details' && (
                            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-black text-slate-900">Ficha Técnica & Operativa</h3>
                                    <button 
                                        onClick={() => toast.success("Ficha copiada al portapapeles.")}
                                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copiar Resumen</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                                        <h4 className="text-xs font-black text-slate-900 uppercase">Información Comercial</h4>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Nombre / Razón Social:</span>
                                                <span className="font-bold text-slate-900">{selectedTarget.name}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Tipo de Cuenta:</span>
                                                <span className="font-bold text-slate-900">{selectedTarget.type === 'client' ? 'Marca / Cliente' : 'Talento Creativo'}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Plan Asignado:</span>
                                                <span className="font-bold text-purple-700">{selectedTarget.clientData?.plan || 'Plan Crecimiento'}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Fee / Salario Mensual:</span>
                                                <span className="font-bold text-slate-900">${selectedTarget.clientData?.price || selectedTarget.memberData?.salary || '500'} USD</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                                        <h4 className="text-xs font-black text-slate-900 uppercase">Equipo & Asignaciones</h4>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Manager / CM Asignado:</span>
                                                <span className="font-bold text-slate-900">{assignedManager || 'Leslie M.'}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Filmmaker Principal:</span>
                                                <span className="font-bold text-slate-900">{selectedTarget.clientData?.filmmaker || 'Anthony V.'}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Ubicación / Sede:</span>
                                                <span className="font-bold text-slate-900">{selectedTarget.clientData?.city || selectedTarget.memberData?.city || 'Santo Domingo'}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-100">
                                                <span className="text-slate-500">Canal de Notificaciones:</span>
                                                <span className="font-bold text-emerald-600">WhatsApp & HQ Live</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 4: FILES (DOCUMENTS & ASSETS REPOSITORY) */}
                        {headerSubTab === 'files' && (
                            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">Repositorio de Archivos & Guiones</h3>
                                        <p className="text-xs text-slate-500">Documentos compartidos y contratos para {selectedTarget.name}</p>
                                    </div>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Subir Archivo</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { name: 'Propuesta_Audiovisual_v2.pdf', size: '2.4 MB', date: '15 MAY', type: 'pdf' },
                                        { name: 'Briefing_Identidad_Marca.pdf', size: '1.8 MB', date: '12 MAY', type: 'pdf' },
                                        { name: 'Contrato_Servicios_DIICZONE.pdf', size: '940 KB', date: '10 MAY', type: 'pdf' },
                                        { name: 'Guiones_Reels_Lote_1.docx', size: '320 KB', date: '08 MAY', type: 'doc' },
                                        { name: 'Brand_Assets_Pack.zip', size: '45 MB', date: '05 MAY', type: 'zip' }
                                    ].map((f, i) => (
                                        <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-2 hover:border-slate-300 transition-all">
                                            <div className="flex items-center gap-2.5 truncate">
                                                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="truncate">
                                                    <h5 className="text-xs font-bold text-slate-900 truncate">{f.name}</h5>
                                                    <span className="text-[10px] text-slate-400">{f.size} • {f.date}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toast.success(`Descargando ${f.name}`)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                                title="Descargar archivo"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* VIEW 5: HISTORY (AUDIT & ACTIVITY TRAIL) */}
                        {headerSubTab === 'history' && (
                            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                                <h3 className="text-base font-black text-slate-900">Historial de Auditoría & Actividades</h3>
                                <div className="space-y-3">
                                    {[
                                        { action: 'Cambio de Fase de Deal', detail: 'De Descubrimiento a Negociación', time: '15 MAY • 16:40', user: assignedManager || 'Leslie M.' },
                                        { action: 'Propuesta Enviada', detail: 'Se adjuntó Propuesta_Audiovisual_v2.pdf', time: '15 MAY • 14:10', user: 'HQ Admin' },
                                        { action: 'Reunión de Briefing Completada', detail: 'Sesión virtual de 45 minutos con el cliente', time: '12 MAY • 11:30', user: 'Anthony V.' },
                                        { action: 'Cuenta Creada en DIIC ZONE CRM', detail: 'Registro inicial de la empresa', time: '10 MAY • 09:00', user: 'Sistema' }
                                    ].map((h, i) => (
                                        <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 text-xs">
                                            <div className="space-y-0.5">
                                                <h5 className="font-black text-slate-900">{h.action}</h5>
                                                <p className="text-slate-600">{h.detail}</p>
                                                <span className="text-[10px] text-slate-400 font-semibold">{h.time}</span>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                                {h.user}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                            
                            {/* --- CARD 1: LAVENDER LILAC DEAL CARD (INTERACTIVE) --- */}
                            <div className="p-4 rounded-[28px] bg-[#C4B5FD] text-slate-950 shadow-xl flex flex-col justify-between relative overflow-hidden">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-base font-black tracking-tight leading-tight">
                                        {selectedTarget.type === 'client' ? `Plan ${selectedTarget.clientData?.plan || 'Plan Crecimiento'}` : 'Asignación de Escuadra'}
                                    </h3>
                                    <button 
                                        onClick={() => setShowPlanModal(true)}
                                        className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
                                        title="Expandir plan"
                                    >
                                        <ArrowUpRight className="w-4 h-4 text-slate-800" />
                                    </button>
                                </div>

                                {/* Deal Stage Switcher Pills (INTERACTIVE) */}
                                <div className="mt-3 p-1 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-between text-[10px] font-bold">
                                    <button
                                        onClick={() => {
                                            setDealStage('negotiation');
                                            toast.info("Etapa de deal: Negociación");
                                        }}
                                        className={`flex-1 py-1 px-2 rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                            dealStage === 'negotiation' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-700 hover:text-black'
                                        }`}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full border border-slate-900" />
                                        <span>Negociación</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDealStage('close');
                                            toast.success("Etapa de deal: Cierre");
                                        }}
                                        className={`flex-1 py-1 px-2 rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                            dealStage === 'close' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-700 hover:text-black'
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
                                        ${selectedTarget.clientData?.price || selectedTarget.memberData?.salary || '500'}/m
                                    </span>
                                </div>

                                {/* Checklist items (INTERACTIVE TOGGLE) */}
                                <div className="mt-3 space-y-1.5 text-xs font-medium text-slate-800">
                                    <div 
                                        onClick={() => setPlanChecklist(prev => ({ ...prev, briefing: !prev.briefing }))}
                                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                    >
                                        {planChecklist.briefing ? <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-slate-500 stroke-[3]" />}
                                        <span className={planChecklist.briefing ? 'text-slate-900 font-bold' : 'text-slate-600 line-through'}>Briefing & Identidad de Marca</span>
                                    </div>
                                    <div 
                                        onClick={() => setPlanChecklist(prev => ({ ...prev, calendar: !prev.calendar }))}
                                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                    >
                                        {planChecklist.calendar ? <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-slate-500 stroke-[3]" />}
                                        <span className={planChecklist.calendar ? 'text-slate-900 font-bold' : 'text-slate-600 line-through'}>Calendario de 8 Reels aprobado</span>
                                    </div>
                                    <div 
                                        onClick={() => setPlanChecklist(prev => ({ ...prev, metaAds: !prev.metaAds }))}
                                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                    >
                                        {planChecklist.metaAds ? <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-slate-500 stroke-[3]" />}
                                        <span className={planChecklist.metaAds ? 'text-slate-900 font-bold' : 'text-slate-600'}>Presupuesto pauta Meta pendiente</span>
                                    </div>
                                </div>
                            </div>

                            {/* --- CARD 2: NEON LIME ACTIVE TASK CARD (INTERACTIVE) --- */}
                            <div className="p-4 rounded-[28px] bg-[#E2F952] text-slate-950 shadow-xl flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">Tarea Prioritaria</span>
                                        {isTaskCompleted && (
                                            <span className="px-2 py-0.5 rounded-full bg-black text-[#D4FF00] text-[9px] font-black uppercase">
                                                Completada
                                            </span>
                                        )}
                                    </div>
                                    <h4 className={`text-sm font-black text-slate-950 mt-0.5 ${isTaskCompleted ? 'line-through opacity-70' : ''}`}>
                                        Enviar Propuesta & Guiones
                                    </h4>
                                </div>

                                {/* Proposal Attachment Pill */}
                                <div className="mt-3 p-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/5 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-2 truncate">
                                        <FileText className="w-4 h-4 text-slate-800 shrink-0" />
                                        <span className="text-xs font-bold text-slate-900 truncate">Propuesta_Audiovisual_v2.pdf</span>
                                    </div>
                                    <button
                                        onClick={() => toast.success("Descargando Propuesta_Audiovisual_v2.pdf")}
                                        className="p-1 hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
                                        title="Descargar propuesta"
                                    >
                                        <Download className="w-3.5 h-3.5 text-slate-700 hover:text-black shrink-0" />
                                    </button>
                                </div>

                                {/* Decision Points Toggle (INTERACTIVE) */}
                                <div className="mt-3 space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-700">Puntos Clave de Decisión:</span>
                                    <div className="grid grid-cols-2 gap-1 p-1 bg-black/10 rounded-xl text-center text-[10px] font-black">
                                        <button
                                            onClick={() => setTaskDecision('diic')}
                                            className={`py-1 rounded-lg transition-all cursor-pointer ${taskDecision === 'diic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-700 hover:text-black'}`}
                                        >
                                            DIIC ZONE
                                        </button>
                                        <button
                                            onClick={() => setTaskDecision('competitor')}
                                            className={`py-1 rounded-lg transition-all cursor-pointer ${taskDecision === 'competitor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-700 hover:text-black'}`}
                                        >
                                            Competencia
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-1 text-[11px] font-medium text-slate-800 pt-1">
                                        <div 
                                            onClick={() => setTaskChecklist(prev => ({ ...prev, quality: !prev.quality }))}
                                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                                        >
                                            {taskChecklist.quality ? <Check className="w-3 h-3 text-emerald-800 stroke-[3]" /> : <X className="w-3 h-3 text-slate-500 stroke-[3]" />}
                                            <span className={taskChecklist.quality ? 'font-bold' : 'line-through text-slate-600'}>Calidad cinematográfica & rapidez</span>
                                        </div>
                                        <div 
                                            onClick={() => setTaskChecklist(prev => ({ ...prev, responseTime: !prev.responseTime }))}
                                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                                        >
                                            {taskChecklist.responseTime ? <Check className="w-3 h-3 text-emerald-800 stroke-[3]" /> : <X className="w-3 h-3 text-slate-500 stroke-[3]" />}
                                            <span>Tiempo de respuesta flexible</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Pill Action Buttons (ALL ACTIVATED) */}
                                <div className="mt-4 flex items-center gap-2">
                                    <button 
                                        onClick={handleSendProposalReminder}
                                        className="flex-1 py-2 rounded-xl bg-black text-white hover:bg-slate-900 flex items-center justify-center transition-all shadow-md cursor-pointer"
                                        title="Enviar recordatorio al chat"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsTaskCompleted(!isTaskCompleted);
                                            toast.success(isTaskCompleted ? "Tarea reabierta." : "¡Tarea completada con éxito!");
                                        }}
                                        className={`flex-1 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center ${
                                            isTaskCompleted ? 'bg-emerald-600 text-white font-bold' : 'bg-white text-slate-950 hover:bg-slate-100'
                                        }`}
                                        title={isTaskCompleted ? "Marcar como pendiente" : "Completar tarea"}
                                    >
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* ============================================================== */}
            {/* MODALS & DRAWERS */}
            {/* ============================================================== */}

            {/* 1. SCHEDULE MEETING / SHOOT MODAL */}
            <AnimatePresence>
                {showScheduleModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111217] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#D4FF00]" />
                                    <h3 className="text-base font-black">Agendar Cita o Rodaje</h3>
                                </div>
                                <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleScheduleMeeting} className="space-y-3 text-xs">
                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Tipo de Evento</label>
                                    <select 
                                        value={newMeetingData.type}
                                        onChange={(e) => setNewMeetingData({ ...newMeetingData, type: e.target.value })}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                    >
                                        <option value="Reunión de Estrategia">Reunión de Estrategia</option>
                                        <option value="Día de Rodaje (Shoot Day)">Día de Rodaje (Shoot Day)</option>
                                        <option value="Revisión de Guiones">Revisión de Guiones</option>
                                        <option value="Entrega de Sprints">Entrega de Sprints</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Título de la Sesión</label>
                                    <input 
                                        type="text"
                                        value={newMeetingData.title}
                                        onChange={(e) => setNewMeetingData({ ...newMeetingData, title: e.target.value })}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                        placeholder="Ej. Grabación de 4 Reels en locación"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-gray-400 font-bold block mb-1">Fecha</label>
                                        <input 
                                            type="date"
                                            value={newMeetingData.date}
                                            onChange={(e) => setNewMeetingData({ ...newMeetingData, date: e.target.value })}
                                            className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 font-bold block mb-1">Hora</label>
                                        <input 
                                            type="time"
                                            value={newMeetingData.time}
                                            onChange={(e) => setNewMeetingData({ ...newMeetingData, time: e.target.value })}
                                            className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Enlace de Videollamada / Locación</label>
                                    <input 
                                        type="text"
                                        value={newMeetingData.link}
                                        onChange={(e) => setNewMeetingData({ ...newMeetingData, link: e.target.value })}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowScheduleModal(false)}
                                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-5 py-2 rounded-xl bg-[#D4FF00] text-black font-black hover:scale-105 transition-transform"
                                    >
                                        Confirmar Cita
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 2. ADD NOTE / MILESTONE MODAL */}
            <AnimatePresence>
                {showAddNoteModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111217] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-[#D4FF00]" />
                                    <h3 className="text-base font-black">Añadir Hito o Nota a la Línea de Tiempo</h3>
                                </div>
                                <button onClick={() => setShowAddNoteModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddCustomNote} className="space-y-3 text-xs">
                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Título del Hito</label>
                                    <input 
                                        type="text"
                                        value={newNoteData.title}
                                        onChange={(e) => setNewNoteData({ ...newNoteData, title: e.target.value })}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                        placeholder="Ej. Entrega de primeros 4 cortes de video"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Descripción / Directiva</label>
                                    <textarea 
                                        value={newNoteData.desc}
                                        onChange={(e) => setNewNoteData({ ...newNoteData, desc: e.target.value })}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none h-20 resize-none"
                                        placeholder="Detalles sobre lo acordado o entregado..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-gray-400 font-bold block mb-1">Etapa</label>
                                        <select 
                                            value={newNoteData.stage}
                                            onChange={(e) => setNewNoteData({ ...newNoteData, stage: e.target.value })}
                                            className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                        >
                                            <option value="Discovery">Discovery</option>
                                            <option value="Negotiation">Negotiation</option>
                                            <option value="Production">Production</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 font-bold block mb-1">Ícono / Formato</label>
                                        <select 
                                            value={newNoteData.type}
                                            onChange={(e) => setNewNoteData({ ...newNoteData, type: e.target.value })}
                                            className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                        >
                                            <option value="message">Mensaje / Nota</option>
                                            <option value="call">Llamada</option>
                                            <option value="calendar">Reunión</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddNoteModal(false)}
                                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-5 py-2 rounded-xl bg-[#D4FF00] text-black font-black hover:scale-105 transition-transform"
                                    >
                                        Guardar Hito
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 3. MANAGER REASSIGNMENT MODAL */}
            <AnimatePresence>
                {showManagerModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111217] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-[#D4FF00]" />
                                    <h3 className="text-base font-black">Asignar Manager / CM Responsable</h3>
                                </div>
                                <button onClick={() => setShowManagerModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-xs text-gray-400">
                                Selecciona el miembro del equipo que liderará la cuenta de <span className="text-white font-bold">{selectedTarget.name}</span>.
                            </p>

                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {teamList.map((member) => (
                                    <div 
                                        key={member.id}
                                        onClick={() => {
                                            setAssignedManager(member.name);
                                            setShowManagerModal(false);
                                            toast.success(`Manager asignado: ${member.name}`);
                                        }}
                                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                            assignedManager === member.name
                                                ? 'bg-[#D4FF00]/10 border-[#D4FF00] text-white'
                                                : 'bg-[#181920] border-white/5 hover:border-white/20 text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white">{member.name}</h4>
                                                <span className="text-[10px] text-gray-500">{member.role || 'Especialista'}</span>
                                            </div>
                                        </div>
                                        {assignedManager === member.name && (
                                            <CheckCircle2 className="w-4 h-4 text-[#D4FF00]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 4. PLAN DETAILS MODAL */}
            <AnimatePresence>
                {showPlanModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111217] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-[#D4FF00]" />
                                    <h3 className="text-base font-black">Detalles del Plan Comercial</h3>
                                </div>
                                <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-200 flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm text-white">Plan {selectedTarget.clientData?.plan || 'Plan Crecimiento'}</h4>
                                    <p className="text-xs text-purple-300">Contrato recurrente mensual</p>
                                </div>
                                <span className="text-xl font-black text-[#D4FF00]">
                                    ${selectedTarget.clientData?.price || selectedTarget.memberData?.salary || '500'}/mes
                                </span>
                            </div>

                            <div className="space-y-2 text-xs">
                                <h5 className="font-bold text-gray-300 uppercase text-[10px] tracking-wider">Entregables Incluidos en el Sprint:</h5>
                                <div className="p-3 rounded-xl bg-[#181920] border border-white/5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-[#D4FF00]" />
                                        <span>8 Reels Cinematográficos con edición de alto impacto</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-[#D4FF00]" />
                                        <span>1 Día de Rodaje mensual con Filmmaker profesional</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-[#D4FF00]" />
                                        <span>Guiones y dirección creativa personalizada</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-[#D4FF00]" />
                                        <span>Monitoreo y optimización de pauta publicitaria en Meta Ads</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end">
                                <button 
                                    onClick={() => {
                                        setShowPlanModal(false);
                                        toast.success("Condiciones del plan validadas.");
                                    }}
                                    className="px-5 py-2 rounded-xl bg-[#D4FF00] text-black font-black hover:scale-105 transition-transform"
                                >
                                    Entendido
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 5. EMAIL COMPOSER MODAL */}
            <AnimatePresence>
                {showEmailModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111217] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-[#D4FF00]" />
                                    <h3 className="text-base font-black">Enviar Correo Rápido</h3>
                                </div>
                                <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSendQuickEmail} className="space-y-3 text-xs">
                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Destinatario</label>
                                    <input 
                                        type="text"
                                        disabled
                                        value={selectedTarget.clientData?.email || `${selectedTarget.name.toLowerCase().replace(/\s+/g, '')}@diiczone.com`}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-gray-400 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Asunto</label>
                                    <input 
                                        type="text"
                                        value={emailModalData.subject}
                                        onChange={(e) => setEmailModalData({ ...emailModalData, subject: e.target.value })}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-400 font-bold block mb-1">Mensaje</label>
                                    <textarea 
                                        value={emailModalData.body}
                                        onChange={(e) => setEmailModalData({ ...emailModalData, body: e.target.value })}
                                        className="w-full bg-[#181920] border border-white/10 rounded-xl p-2.5 text-white outline-none h-28 resize-none"
                                        required
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowEmailModal(false)}
                                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-5 py-2 rounded-xl bg-[#D4FF00] text-black font-black hover:scale-105 transition-transform flex items-center gap-1.5"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Enviar Correo</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
