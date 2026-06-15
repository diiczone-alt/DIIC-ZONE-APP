'use client';

import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
    X, Search, MessageSquare, Calendar, 
    Bell, Star, Zap, Shield, Phone,
    Mail, Globe, CheckCircle2, AlertCircle,
    ChevronRight, Plus, Filter, MoreHorizontal,
    DollarSign, Activity, Target, Flame, AlertTriangle, Send, Loader2, Clock
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function ControlCenterOverlay({ isOpen, onClose, initialTab = 'messages' }) {
    const { user } = useAuth();
    const dragControls = useDragControls();
    
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedMember, setSelectedMember] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [dbConnected, setDbConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Chat states
    const [myTeamMemberId, setMyTeamMemberId] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const [messageText, setMessageText] = useState('');
    const chatEndRef = useRef(null);

    // Fetch team & tasks from Supabase
    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen) return;
            try {
                setLoading(true);
                
                // 1. Fetch team members
                const { data: teamData, error: teamErr } = await supabase
                    .from('team')
                    .select('*')
                    .order('name', { ascending: true });
                
                if (teamErr) {
                    console.error("Error fetching team:", teamErr);
                    setDbConnected(false);
                    setLoading(false);
                    return;
                }

                // 2. Fetch tasks
                const { data: tasksData, error: tasksErr } = await supabase
                    .from('tasks')
                    .select('*')
                    .order('deadline', { ascending: true });

                if (tasksErr) {
                    console.warn("Error fetching tasks, using empty array:", tasksErr);
                } else {
                    setTasks(tasksData || []);
                }

                setTeamMembers(teamData || []);
                setDbConnected(true);

                // Find current user's team ID if matching email
                if (user?.email) {
                    const match = teamData?.find(t => t.email?.toLowerCase() === user.email.toLowerCase());
                    if (match) {
                        setMyTeamMemberId(match.id);
                    } else {
                        setMyTeamMemberId(user.id);
                    }
                }
            } catch (err) {
                console.error("Supabase connection exception:", err);
                setDbConnected(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, user]);

    // Handle Tab Change
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    // Fetch messages when a member is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedMember || !myTeamMemberId) {
                setMessages([]);
                setChatId(null);
                return;
            }

            try {
                // Find direct chat in chats table
                const { data: chats, error: chatsErr } = await supabase
                    .from('chats')
                    .select('*')
                    .eq('type', 'direct');

                if (chatsErr) throw chatsErr;

                // Find chat where participants match myTeamMemberId and selectedMember.id
                const activeChat = chats?.find(chat => {
                    const participants = chat.metadata?.participants || [];
                    return participants.includes(myTeamMemberId) && participants.includes(selectedMember.id);
                });

                if (activeChat) {
                    setChatId(activeChat.id);
                    
                    // Fetch messages for this chat
                    const { data: msgs, error: msgsErr } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('chat_id', activeChat.id)
                        .order('created_at', { ascending: true });

                    if (msgsErr) throw msgsErr;
                    setMessages(msgs || []);
                } else {
                    setChatId(null);
                    setMessages([]);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
                toast.error("Error al cargar los mensajes del servidor.");
            }
        };

        fetchMessages();
    }, [selectedMember, myTeamMemberId]);

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send Message handler
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedMember || !myTeamMemberId) return;

        try {
            setSending(true);
            let activeChatId = chatId;

            // 1. Create chat if it doesn't exist
            if (!activeChatId) {
                const newChat = {
                    type: 'direct',
                    status: 'active',
                    metadata: {
                        participants: [myTeamMemberId, selectedMember.id]
                    },
                    name: `direct_${myTeamMemberId}_${selectedMember.id}`
                };

                const { data: createdChat, error: createChatErr } = await supabase
                    .from('chats')
                    .insert(newChat)
                    .select()
                    .single();

                if (createChatErr) throw createChatErr;
                activeChatId = createdChat.id;
                setChatId(createdChat.id);
            }

            // 2. Insert message
            const newMsg = {
                chat_id: activeChatId,
                sender_id: myTeamMemberId,
                content: messageText.trim()
            };

            const { data: insertedMsg, error: sendErr } = await supabase
                .from('messages')
                .insert(newMsg)
                .select()
                .single();

            if (sendErr) throw sendErr;

            setMessages(prev => [...prev, insertedMsg]);
            setMessageText('');
        } catch (err) {
            console.error("Error sending message:", err);
            toast.error("No se pudo enviar el mensaje.");
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto" onClick={onClose} />

            {/* Draggable Desktop Glass Window */}
            <motion.div 
                drag
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0.05}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative w-[95vw] md:w-[980px] h-[80vh] md:h-[620px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col z-[1010] pointer-events-auto overflow-hidden select-none"
            >
                {/* Header (Drag handle) */}
                <div 
                    onPointerDown={(e) => {
                        // Prevent dragging when clicking buttons, inputs or tabs
                        if (e.target.closest('button') || e.target.closest('nav') || e.target.closest('input')) {
                            return;
                        }
                        dragControls.start(e);
                    }}
                    className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.02] cursor-grab active:cursor-grabbing shrink-0 select-none"
                >
                    <div className="flex items-center gap-3">
                        <h2 className="text-xs font-black text-white uppercase tracking-wider italic">Control de Escuadra</h2>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${dbConnected ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                            {dbConnected ? 'ONLINE' : 'OFFLINE'}
                        </span>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/5">
                        <TabButton 
                            active={activeTab === 'messages'} 
                            onClick={(e) => { e.stopPropagation(); setActiveTab('messages'); }}
                            icon={<MessageSquare className="w-3.5 h-3.5" />}
                            label="Comunicaciones"
                        />
                        <TabButton 
                            active={activeTab === 'calendar'} 
                            onClick={(e) => { e.stopPropagation(); setActiveTab('calendar'); }}
                            icon={<Calendar className="w-3.5 h-3.5" />}
                            label="Cronograma"
                        />
                        <TabButton 
                            active={activeTab === 'alerts'} 
                            onClick={(e) => { e.stopPropagation(); setActiveTab('alerts'); }}
                            icon={<Bell className="w-3.5 h-3.5" />}
                            label="Inteligencia"
                        />
                    </nav>

                    <button 
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 rounded-xl text-gray-500 transition-all active:scale-95 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex relative">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        </div>
                    ) : !dbConnected ? (
                        /* Connection Offline Alert (NO fictitious data allowed) */
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/20">
                            <AlertTriangle className="w-16 h-16 text-amber-500 mb-6 animate-pulse" />
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Sin Conexión con la Escuadra</h3>
                            <p className="text-xs text-gray-400 max-w-md mt-4 leading-relaxed font-mono">
                                No se pudo conectar a la base de datos central de DIIC ZONE.
                                Por favor verifica las credenciales de Supabase o tu conexión de red para acceder a los miembros de tu escuadra real.
                            </p>
                            <button 
                                onClick={onClose} 
                                className="mt-8 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[9px] font-bold text-white uppercase tracking-widest transition-all cursor-pointer"
                            >
                                Cerrar Panel
                            </button>
                        </div>
                    ) : (
                        /* Connected View (Real Database Data) */
                        <>
                            {activeTab === 'messages' && (
                                <MessagesContent 
                                    members={teamMembers} 
                                    selectedMember={selectedMember} 
                                    onSelectMember={setSelectedMember} 
                                    messages={messages}
                                    sending={sending}
                                    messageText={messageText}
                                    setMessageText={setMessageText}
                                    handleSendMessage={handleSendMessage}
                                    chatEndRef={chatEndRef}
                                    myId={myTeamMemberId}
                                />
                            )}
                            {activeTab === 'calendar' && (
                                <CalendarContent tasks={tasks} />
                            )}
                            {activeTab === 'alerts' && (
                                <NotificationsContent />
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

/* --- TABS HELPER COMPONENTS --- */

function TabButton({ active, onClick, icon, label }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                active 
                ? 'bg-white text-black shadow-lg shadow-white/5 font-bold' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">{label}</span>
        </button>
    );
}

/* --- COMMUNICATIONS CONTENT (REAL DATA) --- */
function MessagesContent({ 
    members, selectedMember, onSelectMember, messages, 
    sending, messageText, setMessageText, handleSendMessage, chatEndRef, myId 
}) {
    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Contact List */}
            <div className="w-72 border-r border-white/5 p-6 flex flex-col gap-4 bg-black/10 overflow-y-auto custom-scrollbar shrink-0">
                <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.25em] mb-2">Escuadra Creativa</h3>
                <div className="space-y-2">
                    {members.map(m => {
                        const initials = m.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'DZ';
                        const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-amber-500', 'bg-blue-500', 'bg-violet-500', 'bg-emerald-500'];
                        const colorIdx = m.id ? m.id.charCodeAt(m.id.length - 1) % colors.length : 0;
                        const avatarColor = colors[colorIdx] || 'bg-indigo-500';

                        return (
                            <button 
                                key={m.id} 
                                onClick={() => onSelectMember(m)}
                                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-3 group ${
                                    selectedMember?.id === m.id 
                                    ? 'bg-white text-black border-white shadow-xl' 
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:rotate-6 transition-transform shrink-0`}>
                                    {initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-black uppercase italic tracking-tighter leading-tight truncate">{m.name}</h4>
                                    <p className={`text-[8px] font-black uppercase tracking-widest mt-1 truncate ${selectedMember?.id === m.id ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {m.role || 'CREATIVE'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Workspace */}
            <div className="flex-1 flex flex-col p-6 bg-black/5 overflow-hidden">
                {!selectedMember ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <MessageSquare className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Conecta con tu Escuadra</h3>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">Selecciona un miembro del directorio para iniciar la comunicación</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Member Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 shrink-0">
                            <div>
                                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">{selectedMember.name}</h3>
                                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-1">{selectedMember.role || 'CREATIVE'}</p>
                            </div>
                            <span className="text-[9px] font-mono text-gray-500">ID: {selectedMember.id}</span>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 mb-6">
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-center">
                                    <p className="text-xs text-gray-500 italic">No hay mensajes anteriores. ¡Escribe el primer mensaje para conectar!</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = msg.sender_id === myId;
                                    return (
                                        <div key={msg.id} className={`flex gap-3 max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                            <div className={`p-4 rounded-[1.5rem] ${
                                                isMe 
                                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10' 
                                                : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
                                            }`}>
                                                <p className="text-xs leading-relaxed">{msg.content}</p>
                                                <span className="text-[7px] text-gray-500 uppercase mt-2 block font-mono">
                                                    {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSendMessage} className="relative group shrink-0">
                            <input 
                                type="text" 
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={sending || !messageText.trim()}
                                className="absolute right-2 top-2 bottom-2 px-5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl shadow-lg transition-all flex items-center justify-center cursor-pointer"
                            >
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

/* --- CALENDAR CONTENT (REAL DATA) --- */
function CalendarContent({ tasks }) {
    return (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Cronograma Real</h3>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Actividades y Rodajes desde la Base de Datos</p>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                    <Calendar className="w-12 h-12 text-gray-700 mb-4" />
                    <p className="text-xs text-gray-500 italic">No hay tareas o eventos programados en el sistema.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-[#0E0E18]/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                        {task.assigned_role || 'TAREA'}
                                    </span>
                                    <span className="text-[9px] font-mono text-gray-500">{task.deadline}</span>
                                </div>
                                <h4 className="text-sm font-black text-white uppercase italic tracking-tighter mb-1">{task.title}</h4>
                                <p className="text-[10px] text-emerald-400 font-bold mb-3">{task.client}</p>
                                {task.notes && (
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-2">{task.notes}</p>
                                )}
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                <span>Duración: {task.duration || '--'}</span>
                                <span className={
                                    task.status === 'confirmed' ? 'text-emerald-400' :
                                    task.status === 'pre-pro' ? 'text-blue-400' :
                                    'text-amber-400'
                                }>{task.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* --- INTEL FEED (NOTIFICATIONS) --- */
function NotificationsContent() {
    return (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center text-center">
            <Bell className="w-12 h-12 text-gray-700 mb-4 animate-pulse" />
            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Nodo de Inteligencia</h3>
            <p className="text-xs text-gray-500 italic max-w-sm mt-2 leading-relaxed">
                El canal de notificaciones y alertas en tiempo real está activo. Actualmente no hay alertas de rendimiento críticas reportadas por el motor de IA.
            </p>
        </div>
    );
}
