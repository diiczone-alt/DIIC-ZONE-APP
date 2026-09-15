'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
    ChevronLeft, ChevronRight, Search, Plus, MoreHorizontal, 
    Calendar as CalendarIcon, Edit2, Link as LinkIcon, Video, 
    CheckCircle2, Clock, Smartphone, Camera, Star, Users, 
    ChevronDown, CheckSquare, ExternalLink, X, FileText, 
    Mic, MicOff, MonitorUp, PhoneOff, Paperclip, MessageCircle, 
    Check, Sparkles, User, Tag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function EventsCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isScheduling, setIsScheduling] = useState(false);
    
    // View mode: 'Week' by default like the Calmendar UI reference, with 'Month' and 'Day' options
    const [viewMode, setViewMode] = useState('Week');
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Side Panel States
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isTasksOpen, setIsTasksOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const [isMeetPanelOpen, setIsMeetPanelOpen] = useState(false);
    const [chattingWith, setChattingWith] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentChatMessage, setCurrentChatMessage] = useState("");
    const [isRecordingNote, setIsRecordingNote] = useState(false);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [noteImage, setNoteImage] = useState(null);
    const [notesList, setNotesList] = useState([
        { id: 1, title: "Nota Estratégica #1", content: "Detalles clave sobre la campaña de lanzamientos Q4.", type: 'text', date: 'Hoy' },
        { id: 2, title: "Nota Estratégica #2", content: "Revisión de guiones de video corporativo y B-roll.", type: 'text', date: 'Ayer' }
    ]);
    
    // Task & Reminder States
    const [tasksList, setTasksList] = useState([
        { id: 1, text: "Revisar copies de campaña antes de publicar.", completed: true, time: "08:30 - 10:30" },
        { id: 2, text: "Design review con director de arte.", completed: false, time: "11:40 - 12:10" },
        { id: 3, text: "Almuerzo & reunión con equipo.", completed: false, time: "12:00 - 13:00" },
        { id: 4, text: "Workshop de producción y shooting.", completed: false, time: "13:00 - 15:00" }
    ]);
    const [remindersList, setRemindersList] = useState([
        { id: 1, text: "Revisión de métricas mensuales", time: "Lunes 14:00", active: true },
        { id: 2, text: "Reunión estratégica con cirujano", time: "Jueves 16:30", active: true }
    ]);
    const [isAITasking, setIsAITasking] = useState(false);
    const [isAddingTeam, setIsAddingTeam] = useState(false);
    const [teamCode, setTeamCode] = useState("");
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState("");
    
    const recognitionRef = useRef(null);
    const transcriptRef = useRef("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const imageInputRef = useRef(null);

    // Meet States
    const [isMeetOpen, setIsMeetOpen] = useState(false);
    const [meetState, setMeetState] = useState('lobby'); // lobby, in-call, post-call
    const [meetTasks, setMeetTasks] = useState([
        { id: 1, text: "Planificación agendada para el viernes", completed: true },
        { id: 2, text: "Preparar la Guía de Estilos de la marca", completed: false },
        { id: 3, text: "Compartir feedback de diseño con equipo Creativo", completed: false }
    ]);
    const [newTaskText, setNewTaskText] = useState("");
    const [meetChat, setMeetChat] = useState("Hola equipo, gracias a todos por unirse a esta videoconferencia. Tenemos que coordinar los entregables de la semana.");
    const [newChatText, setNewChatText] = useState("");
    const [isTypingChat, setIsTypingChat] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hoveredEventId, setHoveredEventId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    // Calmendar Event Color Definitions (Rich, clean solid & soft contrast pills)
    const EVENT_STYLES = {
        meeting: {
            bg: 'bg-[#38bdf8]',
            hoverBg: 'hover:bg-[#0ea5e9]',
            text: 'text-white',
            darkText: 'text-[#0369a1]',
            pillBg: 'bg-[#0284c7]/20 text-[#38bdf8] border-[#38bdf8]/30',
            dot: 'bg-[#38bdf8]',
            barColor: 'bg-[#38bdf8]',
            icon: Users,
            label: 'Meeting / Reunión'
        },
        videos: {
            bg: 'bg-[#10b981]',
            hoverBg: 'hover:bg-[#059669]',
            text: 'text-white',
            darkText: 'text-[#047857]',
            pillBg: 'bg-[#059669]/20 text-[#34d399] border-[#34d399]/30',
            dot: 'bg-[#10b981]',
            barColor: 'bg-[#10b981]',
            icon: Video,
            label: 'Videos'
        },
        historias: {
            bg: 'bg-[#f97316]',
            hoverBg: 'hover:bg-[#ea580c]',
            text: 'text-white',
            darkText: 'text-[#c2410c]',
            pillBg: 'bg-[#ea580c]/20 text-[#fb923c] border-[#fb923c]/30',
            dot: 'bg-[#f97316]',
            barColor: 'bg-[#f97316]',
            icon: Smartphone,
            label: 'Historias'
        },
        posts: {
            bg: 'bg-[#8b5cf6]',
            hoverBg: 'hover:bg-[#7c3aed]',
            text: 'text-white',
            darkText: 'text-[#6d28d9]',
            pillBg: 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#a78bfa]/30',
            dot: 'bg-[#8b5cf6]',
            barColor: 'bg-[#8b5cf6]',
            icon: Camera,
            label: 'Imágenes / Post'
        },
        fechas: {
            bg: 'bg-[#f43f5e]',
            hoverBg: 'hover:bg-[#e11d48]',
            text: 'text-white',
            darkText: 'text-[#be123c]',
            pillBg: 'bg-[#e11d48]/20 text-[#fb7185] border-[#fb7185]/30',
            dot: 'bg-[#f43f5e]',
            barColor: 'bg-[#f43f5e]',
            icon: Star,
            label: 'Fechas Importantes'
        },
        citas: {
            bg: 'bg-[#06b6d4]',
            hoverBg: 'hover:bg-[#0891b2]',
            text: 'text-white',
            darkText: 'text-[#0e7490]',
            pillBg: 'bg-[#0891b2]/20 text-[#22d3ee] border-[#22d3ee]/30',
            dot: 'bg-[#06b6d4]',
            barColor: 'bg-[#06b6d4]',
            icon: FileText,
            label: 'Citas'
        },
        consultas: {
            bg: 'bg-[#6366f1]',
            hoverBg: 'hover:bg-[#4f46e5]',
            text: 'text-white',
            darkText: 'text-[#4338ca]',
            pillBg: 'bg-[#4f46e5]/20 text-[#818cf8] border-[#818cf8]/30',
            dot: 'bg-[#6366f1]',
            barColor: 'bg-[#6366f1]',
            icon: MonitorUp,
            label: 'Consultas'
        },
        recordatorios: {
            bg: 'bg-[#eab308]',
            hoverBg: 'hover:bg-[#ca8a04]',
            text: 'text-black',
            darkText: 'text-[#a16207]',
            pillBg: 'bg-[#ca8a04]/20 text-[#fde047] border-[#fde047]/30',
            dot: 'bg-[#eab308]',
            barColor: 'bg-[#eab308]',
            icon: Clock,
            label: 'Recordatorios'
        }
    };

    const [events, setEvents] = useState([
        { 
            id: 1, 
            title: 'Client meeting', 
            timeStr: '08:00 - 08:50',
            dayIndex: 0, // Mon
            startHour: 8,
            duration: 0.83,
            type: 'meeting',
            team: [1, 2],
            meetLink: 'meet.google.com/xkz-pwer-mmn',
            tags: ['Meeting', 'Client', 'Design']
        },
        { 
            id: 2, 
            title: 'Preparing project presentation', 
            timeStr: '08:30 - 10:30',
            dayIndex: 1, // Tue
            startHour: 8.5,
            duration: 2,
            type: 'videos',
            team: [3, 4],
            tags: ['Project', 'Presentation']
        },
        { 
            id: 3, 
            title: 'Client meeting', 
            timeStr: '08:00 - 08:50',
            dayIndex: 2, // Wed
            startHour: 8,
            duration: 0.83,
            type: 'meeting',
            team: [1, 5],
            meetLink: 'meet.google.com/qwe-asdf-zxc'
        },
        { 
            id: 4, 
            title: 'Team retrospective', 
            timeStr: '08:00 - 10:00',
            dayIndex: 3, // Thu
            startHour: 8,
            duration: 2,
            type: 'meeting',
            team: [2, 3, 6],
            meetLink: 'meet.google.com/rtm-ret-2026'
        },
        { 
            id: 5, 
            title: 'Client meeting', 
            timeStr: '08:00 - 08:50',
            dayIndex: 4, // Fri
            startHour: 8,
            duration: 0.83,
            type: 'videos',
            team: [4, 5]
        },
        { 
            id: 6, 
            title: 'Client meeting', 
            timeStr: '08:00 - 08:50',
            dayIndex: 6, // Sun
            startHour: 8,
            duration: 0.83,
            type: 'meeting',
            team: [1, 2]
        },
        { 
            id: 7, 
            title: 'Meetup preparation', 
            timeStr: '09:00 - 11:00',
            dayIndex: 2, // Wed
            startHour: 9,
            duration: 2,
            type: 'historias',
            team: [3, 4]
        },
        { 
            id: 8, 
            title: 'Design system work', 
            timeStr: '09:00 - 11:00',
            dayIndex: 6, // Sun
            startHour: 9,
            duration: 2,
            type: 'videos'
        },
        { 
            id: 9, 
            title: 'User flow testing', 
            timeStr: '10:00 - 11:00',
            dayIndex: 1, // Tue
            startHour: 10,
            duration: 1.5,
            type: 'videos',
            team: [2, 5]
        },
        { 
            id: 10, 
            title: 'Design review with art director', 
            timeStr: '10:30 - 12:15',
            dayIndex: 2, // Wed
            startHour: 10.5,
            duration: 1.75,
            type: 'posts',
            team: [1, 6],
            meetLink: 'meet.google.com/des-rev-art'
        },
        { 
            id: 11, 
            title: 'Sync with developers', 
            timeStr: '13:00 - 14:00',
            dayIndex: 1, // Tue
            startHour: 13,
            duration: 1,
            type: 'meeting',
            team: [1, 3]
        },
        { 
            id: 12, 
            title: 'Leading a workshop', 
            timeStr: '13:00 - 15:00',
            dayIndex: 2, // Wed
            startHour: 13,
            duration: 2,
            type: 'historias',
            team: [2, 3, 4, 5]
        },
        { 
            id: 13, 
            title: 'Creating animations', 
            timeStr: '14:00 - 15:00',
            dayIndex: 3, // Thu
            startHour: 14,
            duration: 1,
            type: 'videos',
            team: [5, 6]
        }
    ]);

    const upcomingEvents = [
        { title: 'Project presentation', time: '08:30 - 10:30', type: 'videos', completed: true },
        { title: 'Design review', time: '11:40 - 12:10', type: 'posts', completed: false },
        { title: 'Lunch break', time: '12:00 - 13:00', type: 'meeting', completed: false },
        { title: 'Leading a workshop', time: '13:00 - 15:00', type: 'historias', completed: false },
    ];

    const timeBreakdown = [
        { label: 'Meeting', color: 'bg-[#38bdf8]', width: '65%' },
        { label: 'Projects', color: 'bg-[#10b981]', width: '80%' },
        { label: 'Events', color: 'bg-[#f97316]', width: '45%' },
        { label: 'Reviews', color: 'bg-[#8b5cf6]', width: '60%' },
    ];

    // Helper: Formatter
    const formatMonthStr = (date) => date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase());
    const currentMonthStr = formatMonthStr(currentDate);

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'Week') newDate.setDate(currentDate.getDate() - 7);
        else newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'Week') newDate.setDate(currentDate.getDate() + 7);
        else newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const handleGoToToday = () => {
        setCurrentDate(new Date());
    };

    // Calculate Week Days (Monday to Sunday)
    const getWeekDays = (date) => {
        const curr = new Date(date);
        let day = curr.getDay();
        if (day === 0) day = 7;
        const first = curr.getDate() - day + 1;
        const daysArray = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(curr);
            d.setDate(first + i);
            daysArray.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                num: d.getDate(),
                dateObj: d,
                active: d.toDateString() === today.toDateString()
            });
        }
        return daysArray;
    };

    const weekDays = getWeekDays(currentDate);
    const hours = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 AM', '13:00 AM', '14:00 AM', '15:00 AM'];

    const filteredEvents = activeFilter === 'all' 
        ? events 
        : events.filter(e => e.type === activeFilter);

    const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

    const handleEventDrop = (e, targetDayIndex) => {
        e.preventDefault();
        const eventId = parseInt(e.dataTransfer.getData('eventId'));
        if (!eventId) return;

        setEvents(events.map(ev => {
            if (ev.id === eventId) {
                return { ...ev, dayIndex: targetDayIndex };
            }
            return ev;
        }));
        toast.success("Evento reprogramado con éxito");
    };

    // Voice and AI Handlers
    const handleSendMessage = () => {
        if (!currentChatMessage.trim() || !chattingWith) return;
        
        const newMessage = {
            id: Date.now(),
            sender: 'Me',
            text: currentChatMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        setCurrentChatMessage("");
        
        if (chattingWith.name === 'Leslie') {
            setTimeout(() => {
                const response = {
                    id: Date.now() + 1,
                    sender: 'Leslie',
                    text: "¡Hola! Recibido. Ya estoy coordinando con el equipo de diseño y producción.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setChatMessages(prev => [...prev, response]);
            }, 1000);
        }
    };

    const handleAITaskVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Tu navegador no soporta Reconocimiento de Voz. Intenta con Chrome o Edge.");
            return;
        }

        if (isAITasking) {
            recognitionRef.current?.stop();
            setIsAITasking(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsAITasking(true);
            setCurrentTranscript("");
            transcriptRef.current = "";
            toast.info("DIIC IA escuchando... Habla tus pendientes.", { id: 'ai-voice' });
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                transcriptRef.current += finalTranscript;
            }
            setCurrentTranscript(transcriptRef.current + interimTranscript);
        };

        recognition.onend = () => {
            setIsAITasking(false);
            const finalPunctuation = transcriptRef.current.trim();
            if (finalPunctuation) {
                setIsProcessingAI(true);
                setTimeout(() => {
                    setTasksList(prev => [{ id: Date.now(), text: finalPunctuation, completed: false, time: 'Hoy' }, ...prev]);
                    setIsProcessingAI(false);
                    setCurrentTranscript("");
                    toast.success("DIIC IA: Tarea registrada en tu lista.", { id: 'ai-voice' });
                }, 1500);
            }
        };

        recognition.onerror = () => {
            setIsAITasking(false);
        };

        recognition.start();
    };

    const handleSaveNote = () => {
        if (!noteText && !recordedAudioUrl && !noteImage) return;
        const newNote = {
            id: Date.now(),
            title: `Nota ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            content: noteText,
            audio: recordedAudioUrl,
            image: noteImage,
            date: 'Hoy'
        };
        setNotesList([newNote, ...notesList]);
        setNoteText("");
        setRecordedAudioUrl(null);
        setNoteImage(null);
        toast.success("Nota guardada correctamente");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setNoteImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const startVoiceNote = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setRecordedAudioUrl(url);
                setIsRecordingNote(false);
                toast.success("Nota de voz grabada");
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecordingNote(true);
            toast.info("Grabando audio...");
        } catch {
            toast.error("No se pudo acceder al micrófono.");
        }
    };

    const stopVoiceNote = () => {
        if (mediaRecorderRef.current && isRecordingNote) {
            mediaRecorderRef.current.stop();
        }
    };

    const handleGoogleCalendarSync = async () => {
        setIsSyncing(true);
        const syncToastId = toast.loading("Sincronizando con Google Calendar...", { id: 'gcal-sync' });
        setTimeout(() => {
            setIsSyncing(false);
            toast.success("¡Ecosistema Calendar sincronizado exitosamente!", { id: 'gcal-sync' });
        }, 1200);
    };

    return (
        <div className="h-full flex flex-col bg-[#0d0e12] text-white p-6 font-sans select-none overflow-hidden relative">
            
            {/* Top Bar matching Calmendar / Modern Tablet UI */}
            <header className="flex items-center justify-between pb-6 relative z-30">
                {/* Brand & Left Header */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <CalendarIcon className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Agenda Global</h1>
                    </div>

                    {/* Filter Pills */}
                    <div className="hidden lg:flex items-center gap-1.5 bg-[#161720] border border-white/[0.06] p-1 rounded-2xl">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                activeFilter === 'all' 
                                    ? 'bg-white/15 text-white shadow-sm' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Todos
                        </button>
                        {Object.entries(EVENT_STYLES).slice(0, 5).map(([key, style]) => (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(activeFilter === key ? 'all' : key)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    activeFilter === key 
                                        ? `${style.pillBg} border font-bold shadow-sm` 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                {style.label.split('/')[0].trim()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Navigation & View Switcher */}
                <div className="flex items-center gap-3">
                    {/* Search Field */}
                    <div className="flex items-center bg-[#161720] border border-white/[0.07] rounded-full px-3 py-1.5 focus-within:border-white/20 transition-all">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input 
                            type="text" 
                            placeholder="Buscar evento..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-xs text-white focus:outline-none w-28 lg:w-40 placeholder:text-gray-500"
                        />
                    </div>

                    {/* Segmented View Switcher (Month | Week | Day) */}
                    <div className="bg-[#161720] border border-white/[0.07] p-1 rounded-full flex items-center shadow-inner">
                        {['Month', 'Week', 'Day'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    viewMode === mode 
                                        ? 'bg-white text-black shadow-md' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Add Event Action Button */}
                    <button
                        onClick={() => setIsScheduling(true)}
                        className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-white/10 transition-all transform active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Agendar</span>
                    </button>
                </div>
            </header>

            {/* Main Content Layout (Sidebar + Calendar + Quick Tools) */}
            <div className="flex-1 flex gap-5 overflow-hidden">
                
                {/* --- LEFT SIDEBAR (Calmendar Style) --- */}
                <aside className="w-[290px] shrink-0 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1 pb-8">
                    
                    {/* Mini Calendar Widget */}
                    <div className="bg-[#161720] border border-white/[0.06] p-5 rounded-[26px] shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-sm text-white capitalize">{currentMonthStr}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Weekday labels */}
                        <div className="grid grid-cols-7 text-center mb-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <span key={i} className="text-[11px] font-semibold text-gray-500">{d}</span>
                            ))}
                        </div>

                        {/* Month Dates Matrix */}
                        <div className="grid grid-cols-7 gap-y-2 text-center">
                            {/* Previous month offset dummies */}
                            {[28, 29, 30, 31].map(d => (
                                <div key={`prev-${d}`} className="text-xs font-medium text-gray-600 flex items-center justify-center h-7 w-7 mx-auto">{d}</div>
                            ))}
                            {/* Current month days */}
                            {[...Array(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate())].map((_, i) => {
                                const dayNum = i + 1;
                                const isToday = dayNum === currentDate.getDate();
                                return (
                                    <button
                                        key={dayNum}
                                        onClick={() => {
                                            const d = new Date(currentDate);
                                            d.setDate(dayNum);
                                            setCurrentDate(d);
                                        }}
                                        className={`text-xs font-semibold h-7 w-7 rounded-full flex items-center justify-center mx-auto transition-all ${
                                            isToday 
                                                ? 'bg-white text-black font-bold shadow-md shadow-white/20' 
                                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {dayNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming Events Today Widget */}
                    <div className="bg-[#161720] border border-white/[0.06] p-5 rounded-[26px] shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-white">Upcoming events today</span>
                            <button onClick={() => setViewMode('Day')} className="text-[11px] font-semibold text-gray-400 hover:text-white transition-colors">View all</button>
                        </div>

                        <div className="space-y-3 mt-1">
                            {upcomingEvents.map((ev, i) => {
                                const style = EVENT_STYLES[ev.type] || EVENT_STYLES.meeting;
                                return (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                            <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center shrink-0 ${ev.completed ? 'bg-emerald-500/20 text-emerald-400' : 'border border-gray-600'}`}>
                                                {ev.completed && <Check className="w-2.5 h-2.5" />}
                                            </div>
                                            <span className={`text-xs font-medium truncate ${ev.completed ? 'text-gray-400' : 'text-gray-200 group-hover:text-white'}`}>
                                                {ev.title}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-500 shrink-0 ml-2">{ev.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Breakdown Widget */}
                    <div className="bg-[#161720] border border-white/[0.06] p-5 rounded-[26px] shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-white">Time breakdown</span>
                            <span className="text-[11px] font-semibold text-gray-400 hover:text-white cursor-pointer">View all</span>
                        </div>

                        <div className="space-y-3 mt-1">
                            {timeBreakdown.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-400">{item.label}</span>
                                    <div className="w-28 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* My Calendars Accordion */}
                    <div className="bg-[#161720] border border-white/[0.06] p-4 rounded-[22px] flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors">
                        <span className="font-bold text-xs text-gray-300">My calendars</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>

                </aside>

                {/* --- MAIN CALENDAR CARD (Week / Month / Day) --- */}
                <main className="flex-1 bg-[#161720] border border-white/[0.06] rounded-[30px] flex flex-col overflow-hidden shadow-2xl relative">
                    
                    {/* Header inside Main Calendar */}
                    <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/[0.04]">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white tracking-tight capitalize">{currentMonthStr}</h2>
                            <div className="flex items-center gap-1 ml-2">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={handleGoToToday} className="text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                Hoy
                            </button>
                        </div>
                    </div>

                    {/* === WEEK VIEW (Calmendar Tablet Style) === */}
                    {viewMode === 'Week' && (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* 7-Day Pill Strip Header */}
                            <div className="flex items-center px-6 pt-4 pb-3 border-b border-white/[0.03]">
                                <div className="w-16 shrink-0">
                                    <span className="text-[11px] font-bold text-gray-500">GMT -5</span>
                                </div>
                                <div className="flex-1 grid grid-cols-7 gap-2">
                                    {weekDays.map((d, i) => {
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    const newD = new Date(d.dateObj);
                                                    setCurrentDate(newD);
                                                }}
                                                className={`py-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                                                    d.active 
                                                        ? 'bg-white text-black shadow-lg scale-100 font-bold' 
                                                        : 'bg-[#101117] text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <span className="text-xs font-bold">{d.name} {d.num}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hours & Events Grid with Smooth Scroll */}
                            <div className="flex-1 flex overflow-y-auto custom-scrollbar p-6 pt-2 relative">
                                
                                {/* Time Labels Column */}
                                <div className="w-16 shrink-0 flex flex-col">
                                    {hours.map(hour => (
                                        <div key={hour} className="h-[95px] text-[11px] font-semibold text-gray-500 -mt-2">
                                            {hour}
                                        </div>
                                    ))}
                                </div>

                                {/* Main Grid Canvas */}
                                <div className="flex-1 relative">
                                    
                                    {/* Horizontal Grid Dividing Lines */}
                                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                                        {hours.map(hour => (
                                            <div key={hour} className="h-[95px] border-t border-white/[0.03] w-full" />
                                        ))}
                                    </div>

                                    {/* 7 Columns Drop & Click Targets */}
                                    <div className="absolute inset-0 grid grid-cols-7 gap-2 z-0">
                                        {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
                                            <div 
                                                key={`slot-${dayIndex}`}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => handleEventDrop(e, dayIndex)}
                                                className="w-full h-full relative group/col"
                                            >
                                                {/* Add button placeholder on hover */}
                                                <button 
                                                    onClick={() => setIsScheduling(true)}
                                                    className="absolute top-28 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center opacity-0 group-hover/col:opacity-100 transition-opacity border border-white/10"
                                                    title="Agendar en este día"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Event Cards Render */}
                                    <div className="absolute inset-0 grid grid-cols-7 gap-2 pointer-events-none">
                                        {filteredEvents.map(event => {
                                            const topOffset = (event.startHour - 8) * 95;
                                            const heightPixels = Math.max(event.duration * 95 - 6, 45);
                                            const isSelected = selectedEventId === event.id;
                                            const style = EVENT_STYLES[event.type] || EVENT_STYLES.meeting;

                                            return (
                                                <div 
                                                    key={event.id} 
                                                    style={{ gridColumnStart: event.dayIndex + 1 }} 
                                                    className="relative pointer-events-none"
                                                >
                                                    {/* Event Block */}
                                                    <div
                                                        draggable
                                                        onDragStart={(e) => {
                                                            e.dataTransfer.setData('eventId', event.id);
                                                            e.dataTransfer.effectAllowed = 'move';
                                                        }}
                                                        onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                                                        className={`absolute left-0 right-0 rounded-2xl p-3.5 cursor-pointer pointer-events-auto transition-all duration-200 shadow-md flex flex-col justify-between overflow-hidden ${style.bg} ${style.hoverBg} ${
                                                            isSelected ? 'ring-2 ring-white scale-[1.02] z-30 shadow-2xl' : 'hover:scale-[1.01] z-10'
                                                        }`}
                                                        style={{ top: `${topOffset}px`, height: `${heightPixels}px` }}
                                                    >
                                                        <div className="pointer-events-none">
                                                            <h4 className="text-xs font-bold text-white leading-tight line-clamp-2 drop-shadow-sm">
                                                                {event.title}
                                                            </h4>
                                                            <p className="text-[10px] font-semibold text-white/80 mt-1">
                                                                {event.timeStr}
                                                            </p>
                                                        </div>

                                                        {/* Team Avatars or Platform Badges */}
                                                        {event.team && event.team.length > 0 && event.duration >= 1 && (
                                                            <div className="flex -space-x-1.5 mt-2 pointer-events-none">
                                                                {event.team.map((t) => (
                                                                    <img 
                                                                        key={t} 
                                                                        src={`https://i.pravatar.cc/100?u=${t + 10}`} 
                                                                        alt="avatar" 
                                                                        className="w-5 h-5 rounded-full border border-black/30 object-cover"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Floating Calmendar Event Details Card (Exact replica of mockup) */}
                                                    <AnimatePresence>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                className="absolute z-50 w-[300px] bg-white text-gray-900 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-gray-100 pointer-events-auto"
                                                                style={{ 
                                                                    top: `${Math.min(topOffset, 220)}px`, 
                                                                    left: event.dayIndex > 3 ? 'auto' : '102%',
                                                                    right: event.dayIndex > 3 ? '102%' : 'auto'
                                                                }}
                                                            >
                                                                {/* Title & Edit Icon */}
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <h3 className="font-bold text-base text-gray-900 leading-tight">
                                                                        {event.title}
                                                                    </h3>
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); setSelectedEventId(null); }}
                                                                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    {/* Date Row */}
                                                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700">
                                                                        <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                                                        <span>{weekDays[event.dayIndex]?.name || 'Wednesday'}, {weekDays[event.dayIndex]?.num || '13'} {currentMonthStr}</span>
                                                                    </div>

                                                                    {/* Time Pickers Row */}
                                                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5 rounded-xl flex-1 cursor-pointer hover:bg-gray-200 transition-colors">
                                                                            <span>{event.timeStr.split('-')[0]?.trim() || '11:00'}</span>
                                                                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                                                        </div>
                                                                        <span className="text-gray-400 font-bold">-</span>
                                                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5 rounded-xl flex-1 cursor-pointer hover:bg-gray-200 transition-colors">
                                                                            <span>{event.timeStr.split('-')[1]?.trim() || '12:00'}</span>
                                                                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                                                        </div>
                                                                    </div>

                                                                    {/* Meeting Link Row */}
                                                                    <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                                                                        <Video className="w-4 h-4 text-gray-400 shrink-0" />
                                                                        <span className="truncate flex-1 font-mono text-[11px] text-gray-700">
                                                                            {event.meetLink || 'www.google.com/meet/230xdp'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Tag Pills */}
                                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">Meeting</span>
                                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Team</span>
                                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">Planning</span>
                                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Discussion</span>
                                                                    </div>

                                                                    {/* Assigned Avatars Row */}
                                                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                                                        <div className="flex -space-x-2">
                                                                            {[1, 2, 3, 4].map(av => (
                                                                                <img 
                                                                                    key={av} 
                                                                                    src={`https://i.pravatar.cc/100?u=${av + 30}`} 
                                                                                    alt="avatar" 
                                                                                    className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
                                                                                />
                                                                            ))}
                                                                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                                                +5
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Add note button */}
                                                                    <button 
                                                                        onClick={() => {
                                                                            toast.success("Nota adjuntada al evento");
                                                                            setSelectedEventId(null);
                                                                        }}
                                                                        className="w-full bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-full mt-2 transition-all"
                                                                    >
                                                                        Add note
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === MONTH VIEW === */}
                    {viewMode === 'Month' && (
                        <div className="flex-1 flex flex-col p-6 h-full overflow-hidden">
                            <div className="grid grid-cols-7 mb-3">
                                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                                    <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase">{d}</div>
                                ))}
                            </div>
                            <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-2">
                                {[...Array(35)].map((_, i) => {
                                    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
                                    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
                                    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                                    
                                    const dayNum = i - startOffset >= 0 && i - startOffset < daysInMonth ? i - startOffset + 1 : null;
                                    const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                                    const currentDayOfWeek = i % 7;
                                    const dayEvents = dayNum ? filteredEvents.filter(e => e.dayIndex === currentDayOfWeek) : [];
                                    
                                    return (
                                        <div 
                                            key={i} 
                                            className={`p-2.5 rounded-2xl border transition-all flex flex-col relative overflow-hidden ${
                                                dayNum 
                                                    ? 'bg-[#101117] border-white/[0.04] hover:border-white/10' 
                                                    : 'opacity-20 border-transparent bg-transparent'
                                            } ${isToday ? 'ring-2 ring-white/40 bg-white/[0.04]' : ''}`}
                                        >
                                            {dayNum && (
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-gray-400'}`}>
                                                        {dayNum}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {dayNum && dayEvents.length > 0 && (
                                                <div className="flex-1 flex flex-col gap-1 mt-1.5 overflow-y-auto no-scrollbar">
                                                    {dayEvents.slice(0, 3).map(ev => {
                                                        const style = EVENT_STYLES[ev.type] || EVENT_STYLES.meeting;
                                                        return (
                                                            <div 
                                                                key={ev.id}
                                                                onClick={() => { setSelectedEventId(ev.id); setViewMode('Week'); }}
                                                                className={`w-full px-2 py-1 rounded-lg cursor-pointer truncate text-[10px] font-bold ${style.bg} text-white shadow-sm hover:brightness-110 transition-all`}
                                                            >
                                                                {ev.title}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* === DAY VIEW === */}
                    {viewMode === 'Day' && (
                        <div className="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar p-6">
                            <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-6">
                                <h3 className="text-xl font-bold text-white capitalize">
                                    {currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {filteredEvents.map(ev => {
                                    const style = EVENT_STYLES[ev.type] || EVENT_STYLES.meeting;
                                    return (
                                        <div key={ev.id} className={`p-4 rounded-2xl ${style.bg} text-white shadow-lg flex items-center justify-between`}>
                                            <div>
                                                <h4 className="text-sm font-bold">{ev.title}</h4>
                                                <p className="text-xs text-white/80 mt-1">{ev.timeStr}</p>
                                            </div>
                                            <button onClick={() => setSelectedEventId(ev.id)} className="bg-black/20 hover:bg-black/40 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                                                Ver detalles
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </main>

                {/* --- RIGHT APPS DOCK & SLIDEOUT PANELS --- */}
                
                {/* Expandable Slide-out Panel */}
                <AnimatePresence>
                    {(isNotesOpen || isTasksOpen || isTeamOpen || isMeetPanelOpen) && (
                        <motion.div
                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                            animate={{ opacity: 1, width: 330, marginLeft: 0 }}
                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                            className="shrink-0 bg-[#161720] border border-white/[0.06] rounded-[30px] overflow-hidden shadow-2xl flex flex-col h-full"
                        >
                            <div className="w-[330px] h-full flex flex-col">
                                
                                {/* Notes Panel */}
                                {isNotesOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-400" /> Notas
                                            </h3>
                                            <button onClick={() => setIsNotesOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                                            <div className="bg-[#101117] border border-white/[0.06] rounded-2xl p-3.5 flex flex-col gap-2">
                                                <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                <textarea 
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    className="w-full bg-transparent text-white text-xs focus:outline-none resize-none h-16 placeholder:text-gray-500" 
                                                    placeholder="Escribe una nota rápida..."
                                                />
                                                {noteImage && (
                                                    <div className="relative rounded-xl overflow-hidden border border-white/10 mb-2">
                                                        <img src={noteImage} alt="Uploaded" className="w-full h-auto max-h-36 object-cover" />
                                                        <button onClick={() => setNoteImage(null)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                {recordedAudioUrl && (
                                                    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-2">
                                                        <Mic className="w-4 h-4 text-indigo-400" />
                                                        <audio src={recordedAudioUrl} controls className="h-6 flex-1 filter invert hue-rotate-180 opacity-70" />
                                                        <button onClick={() => setRecordedAudioUrl(null)} className="p-1 text-gray-400 hover:text-red-400">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => imageInputRef.current?.click()} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                            <Paperclip className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={isRecordingNote ? stopVoiceNote : startVoiceNote} className={`p-1.5 rounded-lg ${isRecordingNote ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                                                            <Mic className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button onClick={handleSaveNote} className="text-xs bg-white text-black font-bold px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                                                        Guardar
                                                    </button>
                                                </div>
                                            </div>

                                            {notesList.map(note => (
                                                <div key={note.id} className="bg-[#101117] border border-white/[0.04] rounded-2xl p-3.5 flex flex-col gap-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-bold text-white">{note.title}</h4>
                                                        <span className="text-[10px] text-gray-500">{note.date}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{note.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Tasks & Voice AI Assistant */}
                                {isTasksOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <CheckSquare className="w-4 h-4 text-amber-400" /> Tareas & DIIC IA
                                            </h3>
                                            <button onClick={() => setIsTasksOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-5">
                                            {/* AI Voice Assistant */}
                                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col items-center gap-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Asistente de Voz DIIC</span>
                                                <button 
                                                    onClick={handleAITaskVoice}
                                                    disabled={isProcessingAI}
                                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                                        isAITasking ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md'
                                                    }`}
                                                >
                                                    {isProcessingAI ? (
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <Mic className="w-6 h-6 text-white" />
                                                    )}
                                                </button>
                                                <p className="text-xs font-semibold text-white">
                                                    {isAITasking ? "Escuchando tus pendientes..." : isProcessingAI ? "Procesando con IA..." : "Toca para dictar tareas"}
                                                </p>
                                                {currentTranscript && (
                                                    <p className="text-[11px] text-indigo-200 italic text-center">"{currentTranscript}"</p>
                                                )}
                                            </div>

                                            {/* Tasks List */}
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Pendientes</h4>
                                                {tasksList.map(task => (
                                                    <div key={task.id} className="flex items-start gap-2.5 bg-[#101117] border border-white/[0.04] rounded-xl p-3">
                                                        <button 
                                                            onClick={() => setTasksList(prev => prev.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))}
                                                            className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 text-white' : 'border border-gray-600'}`}
                                                        >
                                                            {task.completed && <Check className="w-3 h-3" />}
                                                        </button>
                                                        <span className={`text-xs ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                            {task.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Team & Creative Zone */}
                                {isTeamOpen && (
                                    <div className="flex flex-col h-full overflow-hidden">
                                        {!chattingWith && !isAddingTeam ? (
                                            <>
                                                <div className="p-5 flex items-center justify-between border-b border-white/5">
                                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-indigo-400" /> Zona Creativa
                                                    </h3>
                                                    <button onClick={() => setIsTeamOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-5">
                                                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 overflow-hidden flex items-center justify-center">
                                                        <img src="https://i.pravatar.cc/150?u=Leslie" className="w-full h-full object-cover" alt="Leslie" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold text-white">Leslie</h4>
                                                        <p className="text-xs text-gray-400">Head of Production & CM</p>
                                                    </div>
                                                    <div className="w-full space-y-2.5 pt-2">
                                                        <button 
                                                            onClick={() => {
                                                                setChattingWith({ name: 'Leslie', role: 'CM' });
                                                                setChatMessages([{ id: 1, sender: 'Leslie', text: "¡Hola! Estoy lista para coordinar los entregables de hoy.", time: '10:00 AM' }]);
                                                            }}
                                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
                                                        >
                                                            Chat con Leslie
                                                        </button>
                                                        <button 
                                                            onClick={() => setIsAddingTeam(true)}
                                                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-2xl text-xs font-bold transition-all border border-white/5"
                                                        >
                                                            Vincular Equipo
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : isAddingTeam ? (
                                            <>
                                                <div className="p-5 flex items-center justify-between border-b border-white/5">
                                                    <button onClick={() => setIsAddingTeam(false)} className="p-1 text-gray-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                                                    <h3 className="text-sm font-bold text-white">Vincular Nodo</h3>
                                                    <button onClick={() => setIsTeamOpen(false)} className="p-1 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                                    <input 
                                                        type="text" 
                                                        value={teamCode} 
                                                        onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                                                        placeholder="CÓDIGO DE EQUIPO"
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-center text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            if (teamCode.length > 3) {
                                                                toast.success("¡Equipo vinculado correctamente!");
                                                                setIsAddingTeam(false);
                                                            } else {
                                                                toast.error("Código inválido");
                                                            }
                                                        }}
                                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition-all"
                                                    >
                                                        Confirmar Vinculación
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-4 flex items-center justify-between border-b border-white/5">
                                                    <button onClick={() => setChattingWith(null)} className="p-1 text-gray-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                                                    <span className="text-xs font-bold text-white">Chat con Leslie</span>
                                                    <button onClick={() => setIsTeamOpen(false)} className="p-1 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                                                </div>
                                                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                                                    {chatMessages.map(msg => (
                                                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                                                            <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${msg.sender === 'Me' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-200'}`}>
                                                                {msg.text}
                                                            </div>
                                                            <span className="text-[9px] text-gray-500 mt-0.5">{msg.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-3 border-t border-white/5 flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={currentChatMessage}
                                                        onChange={(e) => setCurrentChatMessage(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        placeholder="Mensaje..."
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                                    />
                                                    <button onClick={handleSendMessage} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* DIIC Meet Panel */}
                                {isMeetPanelOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Video className="w-4 h-4 text-indigo-400" /> DIIC Meet
                                            </h3>
                                            <button onClick={() => setIsMeetPanelOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3 text-center">
                                            <p className="text-xs text-gray-400">Inicia o programa videollamadas con tu equipo.</p>
                                            <button 
                                                onClick={() => {
                                                    setIsMeetPanelOpen(false);
                                                    setMeetState('in-call');
                                                    setIsMeetOpen(true);
                                                }}
                                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                                            >
                                                <Video className="w-4 h-4" /> Iniciar Reunión Instantánea
                                            </button>
                                            <button 
                                                onClick={handleGoogleCalendarSync}
                                                className="w-full py-3 bg-[#101117] hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <CalendarIcon className="w-4 h-4 text-blue-400" /> Sincronizar Google Calendar
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Vertical App Tools Bar (Right side) */}
                <div className="w-14 shrink-0 bg-[#161720] border border-white/[0.06] rounded-[24px] flex flex-col items-center py-5 gap-4 shadow-xl self-start">
                    <button 
                        onClick={handleGoogleCalendarSync} 
                        className="p-2.5 rounded-2xl hover:bg-white/10 text-gray-400 hover:text-white transition-all group"
                        title="Google Calendar Sync"
                    >
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" 
                            className={`w-5 h-5 transition-transform group-hover:scale-110 ${isSyncing ? 'animate-spin' : ''}`} 
                            alt="Google Calendar" 
                        />
                    </button>
                    <div className="w-6 h-px bg-white/10" />
                    
                    <button 
                        onClick={() => { setIsNotesOpen(!isNotesOpen); setIsTasksOpen(false); setIsTeamOpen(false); setIsMeetPanelOpen(false); }} 
                        className={`p-2.5 rounded-2xl transition-all ${isNotesOpen ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} 
                        title="Notas"
                    >
                        <FileText className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={() => { setIsTasksOpen(!isTasksOpen); setIsNotesOpen(false); setIsTeamOpen(false); setIsMeetPanelOpen(false); }} 
                        className={`p-2.5 rounded-2xl transition-all ${isTasksOpen ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} 
                        title="Tareas & IA"
                    >
                        <CheckSquare className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={() => { setIsTeamOpen(!isTeamOpen); setIsNotesOpen(false); setIsTasksOpen(false); setIsMeetPanelOpen(false); }} 
                        className={`p-2.5 rounded-2xl transition-all ${isTeamOpen ? 'bg-pink-500/20 text-pink-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} 
                        title="Zona Creativa"
                    >
                        <Users className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={() => { setIsMeetPanelOpen(!isMeetPanelOpen); setIsNotesOpen(false); setIsTasksOpen(false); setIsTeamOpen(false); }} 
                        className={`p-2.5 rounded-2xl transition-all ${isMeetPanelOpen ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} 
                        title="Videollamadas"
                    >
                        <Video className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* --- SCHEDULING MODAL --- */}
            <AnimatePresence>
                {isScheduling && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#181924] border border-white/10 rounded-[30px] w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-indigo-400" /> Nuevo Evento
                                </h2>
                                <button onClick={() => setIsScheduling(false)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Título del Evento</label>
                                    <input type="text" placeholder="Ej: Client meeting / Shooting" className="w-full bg-[#101117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/30" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Fecha</label>
                                        <input type="date" className="w-full bg-[#101117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Hora</label>
                                        <input type="time" className="w-full bg-[#101117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Tipo de Evento</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(EVENT_STYLES).slice(0, 4).map(([key, style]) => (
                                            <button key={key} className={`flex items-center gap-2 p-2.5 rounded-xl border border-white/5 hover:border-white/20 text-left bg-[#101117] transition-all`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                                                <span className="text-xs font-semibold text-gray-300">{style.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-black/20 border-t border-white/5 flex gap-3 justify-end">
                                <button onClick={() => setIsScheduling(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={() => { toast.success("Evento agendado exitosamente"); setIsScheduling(false); }} className="px-5 py-2 text-xs font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-all shadow-md">
                                    Guardar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- DIIC MEET MODAL --- */}
            <AnimatePresence>
                {isMeetOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#181924] border border-white/10 rounded-[32px] w-full max-w-4xl h-[80vh] min-h-[580px] flex flex-col shadow-2xl overflow-hidden relative">
                            
                            {meetState === 'in-call' && (
                                <div className="flex-1 bg-black/60 relative overflow-hidden flex p-4 gap-4 rounded-[32px]">
                                    {/* Left Column Feeds */}
                                    <div className="w-1/3 flex flex-col gap-4">
                                        <div className="grid grid-cols-2 gap-3 h-36 shrink-0">
                                            <div className="bg-[#12131b] rounded-2xl overflow-hidden relative border border-white/10">
                                                <img src="https://i.pravatar.cc/300?u=q" className="w-full h-full object-cover opacity-80" alt="participant" />
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">Jacqueline</span>
                                            </div>
                                            <div className="bg-[#12131b] rounded-2xl overflow-hidden relative border border-white/10">
                                                <img src="https://i.pravatar.cc/300?u=a" className="w-full h-full object-cover opacity-80" alt="participant" />
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">Jan Cook</span>
                                            </div>
                                        </div>

                                        {/* Task Tracker Widget */}
                                        <div className="flex-1 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col overflow-hidden">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Tareas de la Sesión</span>
                                                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{meetTasks.filter(t => t.completed).length}/{meetTasks.length}</span>
                                            </div>
                                            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                                {meetTasks.map(task => (
                                                    <div key={task.id} className="flex items-start gap-2">
                                                        <button onClick={() => setMeetTasks(tasks => tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))} className={`w-3.5 h-3.5 rounded mt-0.5 shrink-0 flex items-center justify-center ${task.completed ? 'bg-emerald-500 text-white' : 'border border-gray-600'}`}>
                                                            {task.completed && <Check className="w-2.5 h-2.5" />}
                                                        </button>
                                                        <span className={`text-[11px] ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{task.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Video View */}
                                    <div className="w-2/3 flex flex-col gap-4">
                                        <div className="flex-1 bg-[#12131b] rounded-3xl overflow-hidden relative border border-white/10 group">
                                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="main video" />
                                            
                                            {/* In-Call Controls */}
                                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
                                                <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"><Mic className="w-4 h-4 text-white" /></button>
                                                <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"><Video className="w-4 h-4 text-white" /></button>
                                                <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"><MonitorUp className="w-4 h-4 text-white" /></button>
                                                <button onClick={() => { setIsMeetOpen(false); toast.success("Llamada finalizada"); }} className="w-12 h-9 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center"><PhoneOff className="w-4 h-4 text-white" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
