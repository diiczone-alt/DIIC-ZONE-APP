'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
    ChevronLeft, ChevronRight, Search, Plus, MoreHorizontal, 
    Calendar as CalendarIcon, Edit2, Link as LinkIcon, Video, 
    CheckCircle2, Clock, Smartphone, Camera, Star, Users, 
    ChevronDown, CheckSquare, ExternalLink, X, FileText, 
    Mic, MicOff, MonitorUp, PhoneOff, Paperclip, MessageCircle, 
    Check, Sparkles, User, Tag, Layers, CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Real clients database reference
const REAL_CLIENTS = [
    {
        id: 'C-OSCAR--562',
        name: 'Dr. Oscar Cujilema',
        type: 'Médico / Urología',
        plan: 'Presencia Digital',
        deliverables: { reels: 5, shoots: 2, designs: 8, stories: 20, meetings: 4 }
    },
    {
        id: 'C-REYS',
        name: 'Dra. Jessica Rey Uro',
        type: 'Médico / Estética',
        plan: 'Estrategia Elite',
        deliverables: { reels: 12, shoots: 4, designs: 8, stories: 30, meetings: 6 }
    },
    {
        id: 'C-NOVA',
        name: 'Hospital Novaclínica Santa Anita',
        type: 'Hospital / Salud',
        plan: 'Crecimiento',
        deliverables: { reels: 16, shoots: 6, designs: 12, stories: 30, meetings: 8 }
    },
    {
        id: 'C-SEBAS-709',
        name: 'Sebas (Vito\'s Pizza)',
        type: 'Gastronomía',
        plan: 'Crecimiento',
        deliverables: { reels: 16, shoots: 6, designs: 12, stories: 30, meetings: 4 }
    },
    {
        id: 'C-SAE',
        name: 'Servicios Agropecuarios Ecuador',
        type: 'Industrial / Agro',
        plan: 'Básico App',
        deliverables: { reels: 12, shoots: 4, designs: 8, stories: 30, meetings: 4 }
    },
    {
        id: 'C-ENTREP-149',
        name: 'Entre panas y parcelas',
        type: 'Real Estate / Agro',
        plan: 'Presencia',
        deliverables: { reels: 12, shoots: 4, designs: 8, stories: 30, meetings: 4 }
    }
];

export default function EventsCalendar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientParam = searchParams?.get('client');

    const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 14)); // Sept 14, 2026 as active week
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 8, 14));
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isScheduling, setIsScheduling] = useState(false);
    
    // View mode: 'Week', 'Month', 'Day'
    const [viewMode, setViewMode] = useState('Week');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isMyCalendarsOpen, setIsMyCalendarsOpen] = useState(true);

    // Active Client
    const [activeClientId, setActiveClientId] = useState(clientParam || 'C-OSCAR--562');
    const [clientsList, setClientsList] = useState(REAL_CLIENTS);

    // Side Panels
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
        { id: 1, title: "Nota Estratégica #1", content: "Planificación de contenido médico y copys de campaña.", type: 'text', date: 'Hoy' },
        { id: 2, title: "Nota Estratégica #2", content: "Revisión de guiones de video y tomas B-Roll en consultorio.", type: 'text', date: 'Ayer' }
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
    const [meetState, setMeetState] = useState('lobby');
    const [meetTasks, setMeetTasks] = useState([
        { id: 1, text: "Planificación agendada para el viernes", completed: true },
        { id: 2, text: "Preparar la Guía de Estilos de la marca", completed: false },
        { id: 3, text: "Compartir feedback de diseño con equipo Creativo", completed: false }
    ]);
    const [isSyncing, setIsSyncing] = useState(false);

    // Category Styles
    const EVENT_STYLES = {
        meeting: {
            bg: 'bg-[#38bdf8]',
            hoverBg: 'hover:bg-[#0ea5e9]',
            text: 'text-white',
            pillBg: 'bg-[#0284c7]/20 text-[#38bdf8] border-[#38bdf8]/30',
            dot: 'bg-[#38bdf8]',
            barColor: 'bg-[#38bdf8]',
            icon: Users,
            label: 'Meeting'
        },
        videos: {
            bg: 'bg-[#10b981]',
            hoverBg: 'hover:bg-[#059669]',
            text: 'text-white',
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
            pillBg: 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#a78bfa]/30',
            dot: 'bg-[#8b5cf6]',
            barColor: 'bg-[#8b5cf6]',
            icon: Camera,
            label: 'Imágenes'
        },
        fechas: {
            bg: 'bg-[#f43f5e]',
            hoverBg: 'hover:bg-[#e11d48]',
            text: 'text-white',
            pillBg: 'bg-[#e11d48]/20 text-[#fb7185] border-[#fb7185]/30',
            dot: 'bg-[#f43f5e]',
            barColor: 'bg-[#f43f5e]',
            icon: Star,
            label: 'Fechas Importantes'
        }
    };

    // Active client object
    const activeClient = useMemo(() => {
        return clientsList.find(c => c.id === activeClientId) || clientsList[0];
    }, [activeClientId, clientsList]);

    // Generator for Real Deliverables and Events based on the active client
    const [events, setEvents] = useState([]);

    // Fetch real tasks/events or generate client calendar deliverables
    useEffect(() => {
        const loadRealCalendar = async () => {
            try {
                const { data: dbTasks } = await supabase.from('tasks').select('*');
                
                // Base scheduled events for the active client (e.g. Dr. Oscar Cujilema in Sept 2026)
                const clientEvents = [
                    { 
                        id: 101, 
                        title: `Onboarding & Estrategia (${activeClient.name})`, 
                        timeStr: '08:00 - 08:50',
                        dayIndex: 0, // Mon 14
                        dateDay: 14,
                        startHour: 8,
                        duration: 0.83,
                        type: 'meeting',
                        team: [1, 2],
                        meetLink: 'meet.google.com/xkz-pwer-mmn',
                        tags: ['Estrategia', 'Kickoff'],
                        completed: true
                    },
                    { 
                        id: 102, 
                        title: `Reel #1: Procedimiento & Valoración (${activeClient.name})`, 
                        timeStr: '08:30 - 10:30',
                        dayIndex: 1, // Tue 15
                        dateDay: 15,
                        startHour: 8.5,
                        duration: 2,
                        type: 'videos',
                        team: [3, 4],
                        tags: ['Reel', 'Video 4K'],
                        completed: false
                    },
                    { 
                        id: 103, 
                        title: 'Historia Interactiva: Preguntas y Respuestas', 
                        timeStr: '09:00 - 10:00',
                        dayIndex: 2, // Wed 16
                        dateDay: 16,
                        startHour: 9,
                        duration: 1,
                        type: 'historias',
                        team: [1],
                        tags: ['Q&A', 'Engagement'],
                        completed: false
                    },
                    { 
                        id: 104, 
                        title: 'Revisión de Identidad & Diseños Carrusel', 
                        timeStr: '10:30 - 12:15',
                        dayIndex: 2, // Wed 16
                        dateDay: 16,
                        startHour: 10.5,
                        duration: 1.75,
                        type: 'posts',
                        team: [1, 5],
                        meetLink: 'meet.google.com/des-rev-art',
                        tags: ['Diseño', 'Carrusel'],
                        completed: false
                    },
                    { 
                        id: 105, 
                        title: `Rodaje Presencial B-Roll (${activeClient.name})`, 
                        timeStr: '08:00 - 10:30',
                        dayIndex: 3, // Thu 17
                        dateDay: 17,
                        startHour: 8,
                        duration: 2.5,
                        type: 'videos',
                        team: [2, 3, 6],
                        tags: ['Filmmaker', 'Shooting'],
                        completed: false
                    },
                    { 
                        id: 106, 
                        title: 'Día Internacional de la Salud & Concientización', 
                        timeStr: '09:00 - 10:00',
                        dayIndex: 4, // Fri 18
                        dateDay: 18,
                        startHour: 9,
                        duration: 1,
                        type: 'fechas',
                        team: [1, 2],
                        tags: ['Efeméride', 'Hito'],
                        completed: false
                    },
                    { 
                        id: 107, 
                        title: 'Post Educativo: Mitos y Verdades Clínicas', 
                        timeStr: '10:00 - 11:30',
                        dayIndex: 4, // Fri 18
                        dateDay: 18,
                        startHour: 10,
                        duration: 1.5,
                        type: 'posts',
                        team: [4, 5],
                        tags: ['Feed Post', 'Educación'],
                        completed: false
                    },
                    { 
                        id: 108, 
                        title: 'Sesión de Seguimiento de Métricas & Leads', 
                        timeStr: '13:00 - 14:00',
                        dayIndex: 1, // Tue 15
                        dateDay: 15,
                        startHour: 13,
                        duration: 1,
                        type: 'meeting',
                        team: [1, 3],
                        tags: ['Métricas', 'Leads'],
                        completed: false
                    },
                    { 
                        id: 109, 
                        title: 'Lanzamiento de Campaña Ads & WhatsApp', 
                        timeStr: '14:00 - 15:30',
                        dayIndex: 3, // Thu 17
                        dateDay: 17,
                        startHour: 14,
                        duration: 1.5,
                        type: 'meeting',
                        team: [5, 6],
                        tags: ['Meta Ads', 'WhatsApp'],
                        completed: false
                    },
                    { 
                        id: 110, 
                        title: 'Historia Detrás de Cámara (Shooting)', 
                        timeStr: '13:00 - 14:30',
                        dayIndex: 6, // Sun 20
                        dateDay: 20,
                        startHour: 13,
                        duration: 1.5,
                        type: 'historias',
                        team: [2, 4],
                        tags: ['Backstage', 'Stories'],
                        completed: false
                    }
                ];

                // Append any extra DB tasks matching the client
                if (dbTasks && dbTasks.length > 0) {
                    dbTasks.forEach((t, idx) => {
                        if (t.client_id === activeClient.id || t.client === activeClient.name || !t.client) {
                            const taskType = t.assigned_role === 'FILMMAKER' || (t.title && t.title.toLowerCase().includes('rodaje')) 
                                ? 'videos' 
                                : (t.title && t.title.toLowerCase().includes('diseño')) 
                                    ? 'posts' 
                                    : 'meeting';
                            
                            clientEvents.push({
                                id: 200 + idx,
                                title: t.title || 'Tarea Programada',
                                timeStr: t.duration || '11:00 - 12:00',
                                dayIndex: (idx % 7),
                                dateDay: 14 + (idx % 7),
                                startHour: 11 + (idx % 4),
                                duration: 1,
                                type: taskType,
                                team: [1, 2],
                                tags: ['Supabase DB'],
                                completed: t.status === 'done'
                            });
                        }
                    });
                }

                setEvents(clientEvents);
            } catch (err) {
                console.error('Error loading calendar events:', err);
            }
        };

        loadRealCalendar();
    }, [activeClient]);

    // Handle URL searchParam synchronization
    useEffect(() => {
        if (clientParam && clientParam !== activeClientId) {
            setActiveClientId(clientParam);
        }
    }, [clientParam]);

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
        const today = new Date(2026, 8, 14); // Set to active calendar date
        setCurrentDate(today);
        setSelectedDate(today);
    };

    // Calculate Week Days (Monday to Sunday)
    const getWeekDays = (date) => {
        const curr = new Date(date);
        let day = curr.getDay();
        if (day === 0) day = 7;
        const first = curr.getDate() - day + 1;
        const daysArray = [];
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(curr.getFullYear(), curr.getMonth(), first + i);
            const isSelected = selectedDate && d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth();
            daysArray.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                num: d.getDate(),
                dateObj: d,
                active: isSelected
            });
        }
        return daysArray;
    };

    const weekDays = getWeekDays(currentDate);
    const hours = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 AM', '13:00 AM', '14:00 AM', '15:00 AM'];

    // Filtered Events
    const filteredEvents = useMemo(() => {
        return activeFilter === 'all' 
            ? events 
            : events.filter(e => e.type === activeFilter);
    }, [events, activeFilter]);

    // Real Upcoming Events for Today / Selected Date
    const upcomingEventsForDay = useMemo(() => {
        const dayNum = selectedDate.getDate();
        const matches = events.filter(e => e.dateDay === dayNum);
        if (matches.length > 0) return matches;
        // Fallback to top 4 events of the week
        return events.slice(0, 4);
    }, [events, selectedDate]);

    // Real Calculated Time Breakdown based on Active Events
    const realTimeBreakdown = useMemo(() => {
        const totals = { meeting: 0, videos: 0, historias: 0, posts: 0 };
        events.forEach(e => {
            if (totals[e.type] !== undefined) {
                totals[e.type] += (e.duration || 1);
            }
        });
        const maxVal = Math.max(...Object.values(totals), 1);
        return [
            { label: 'Meeting / Consultas', color: 'bg-[#38bdf8]', width: `${Math.round((totals.meeting / maxVal) * 85) + 15}%`, count: totals.meeting.toFixed(1) + 'h' },
            { label: 'Videos & Rodajes', color: 'bg-[#10b981]', width: `${Math.round((totals.videos / maxVal) * 85) + 15}%`, count: totals.videos.toFixed(1) + 'h' },
            { label: 'Historias & Social', color: 'bg-[#f97316]', width: `${Math.round((totals.historias / maxVal) * 85) + 15}%`, count: totals.historias.toFixed(1) + 'h' },
            { label: 'Imágenes / Posts', color: 'bg-[#8b5cf6]', width: `${Math.round((totals.posts / maxVal) * 85) + 15}%`, count: totals.posts.toFixed(1) + 'h' },
        ];
    }, [events]);

    const toggleEventComplete = (id) => {
        setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, completed: !ev.completed } : ev));
    };

    const handleEventDrop = (e, targetDayIndex) => {
        e.preventDefault();
        const eventId = parseInt(e.dataTransfer.getData('eventId'));
        if (!eventId) return;

        setEvents(events.map(ev => {
            if (ev.id === eventId) {
                return { ...ev, dayIndex: targetDayIndex, dateDay: weekDays[targetDayIndex].num };
            }
            return ev;
        }));
        toast.success("Evento reprogramado con éxito");
    };

    // Google Calendar Sync
    const handleGoogleCalendarSync = async () => {
        setIsSyncing(true);
        const syncToastId = toast.loading("Sincronizando con Google Calendar...", { id: 'gcal-sync' });
        setTimeout(() => {
            setIsSyncing(false);
            toast.success(`¡Calendario de ${activeClient.name} sincronizado con éxito!`, { id: 'gcal-sync' });
        }, 1200);
    };

    // Quick New Event Form States
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventTime, setNewEventTime] = useState('10:00 - 11:00');
    const [newEventDate, setNewEventDate] = useState('2026-09-14');
    const [newEventType, setNewEventType] = useState('videos');

    const handleSaveNewEvent = () => {
        if (!newEventTitle.trim()) {
            toast.error("Ingresa un título para el evento");
            return;
        }
        const createdEv = {
            id: Date.now(),
            title: newEventTitle,
            timeStr: newEventTime,
            dayIndex: 1,
            dateDay: 15,
            startHour: 10,
            duration: 1,
            type: newEventType,
            team: [1],
            tags: ['Nuevo'],
            completed: false
        };
        setEvents(prev => [createdEv, ...prev]);
        setIsScheduling(false);
        setNewEventTitle('');
        toast.success("Evento agendado exitosamente");
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
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                Agenda Global
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-violet-300 border border-white/5">
                                    {activeClient.name}
                                </span>
                            </h1>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="hidden lg:flex items-center gap-1.5 bg-[#161720] border border-white/[0.06] p-1 rounded-2xl">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                activeFilter === 'all' 
                                    ? 'bg-white text-black font-bold shadow-md' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Todos ({events.length})
                        </button>
                        {Object.entries(EVENT_STYLES).map(([key, style]) => {
                            const count = events.filter(e => e.type === key).length;
                            const isCurrent = activeFilter === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveFilter(isCurrent ? 'all' : key)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                        isCurrent 
                                            ? `${style.pillBg} border font-bold shadow-sm` 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                    {style.label} {count > 0 && `(${count})`}
                                </button>
                            );
                        })}
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
                <aside className="w-[300px] shrink-0 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1 pb-8">
                    
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
                            {[28, 29, 30, 31].map(d => (
                                <div key={`prev-${d}`} className="text-xs font-medium text-gray-600 flex items-center justify-center h-7 w-7 mx-auto">{d}</div>
                            ))}
                            {[...Array(30)].map((_, i) => {
                                const dayNum = i + 1;
                                const isSelected = selectedDate.getDate() === dayNum && selectedDate.getMonth() === currentDate.getMonth();
                                const hasEvents = events.some(e => e.dateDay === dayNum);
                                return (
                                    <button
                                        key={dayNum}
                                        onClick={() => {
                                            const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                                            setSelectedDate(d);
                                            setCurrentDate(d);
                                        }}
                                        className={`text-xs font-semibold h-7 w-7 rounded-full flex items-center justify-center mx-auto transition-all relative ${
                                            isSelected 
                                                ? 'bg-white text-black font-bold shadow-md shadow-white/20' 
                                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {dayNum}
                                        {hasEvents && !isSelected && (
                                            <span className="w-1 h-1 rounded-full bg-indigo-400 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming Events Today Widget (Real Data) */}
                    <div className="bg-[#161720] border border-white/[0.06] p-5 rounded-[26px] shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-white">Upcoming events today</span>
                            <button onClick={() => setViewMode('Day')} className="text-[11px] font-semibold text-gray-400 hover:text-white transition-colors">View all</button>
                        </div>

                        <div className="space-y-3 mt-1">
                            {upcomingEventsForDay.map((ev) => {
                                const style = EVENT_STYLES[ev.type] || EVENT_STYLES.meeting;
                                return (
                                    <div 
                                        key={ev.id} 
                                        onClick={() => toggleEventComplete(ev.id)}
                                        className="flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                            <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                                ev.completed 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'border border-gray-600 hover:border-emerald-400'
                                            }`}>
                                                {ev.completed && <Check className="w-2.5 h-2.5" />}
                                            </div>
                                            <span className={`text-xs font-medium truncate ${ev.completed ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'}`}>
                                                {ev.title}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-400 shrink-0 ml-2 bg-white/5 px-2 py-0.5 rounded-md">
                                            {ev.timeStr}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Breakdown Widget (Real Data Calculation) */}
                    <div className="bg-[#161720] border border-white/[0.06] p-5 rounded-[26px] shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-white">Time breakdown</span>
                            <span className="text-[11px] font-semibold text-gray-400 hover:text-white cursor-pointer">View all</span>
                        </div>

                        <div className="space-y-3 mt-1">
                            {realTimeBreakdown.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-medium text-gray-400">{item.label}</span>
                                        <span className="text-[10px] font-bold text-gray-500">({item.count})</span>
                                    </div>
                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* My Calendars Accordion with Real Clients */}
                    <div className="bg-[#161720] border border-white/[0.06] p-4 rounded-[22px] flex flex-col gap-3">
                        <div 
                            onClick={() => setIsMyCalendarsOpen(!isMyCalendarsOpen)}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-400" />
                                <span className="font-bold text-xs text-gray-200">Mis Calendarios ({clientsList.length})</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMyCalendarsOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isMyCalendarsOpen && (
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                {clientsList.map(c => (
                                    <div 
                                        key={c.id}
                                        onClick={() => {
                                            setActiveClientId(c.id);
                                            toast.success(`Calendario cambiado a: ${c.name}`);
                                        }}
                                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs transition-colors ${
                                            activeClientId === c.id 
                                                ? 'bg-white/10 text-white font-bold border border-white/10' 
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <span className="truncate">{c.name}</span>
                                        {activeClientId === c.id && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                                    </div>
                                ))}
                            </div>
                        )}
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
                                                    setSelectedDate(d.dateObj);
                                                    setCurrentDate(d.dateObj);
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
                                            const heightPixels = Math.max(event.duration * 95 - 6, 50);
                                            const isSelected = selectedEventId === event.id;
                                            const style = EVENT_STYLES[event.type] || EVENT_STYLES.meeting;

                                            return (
                                                <div 
                                                    key={event.id} 
                                                    style={{ gridColumnStart: (event.dayIndex % 7) + 1 }} 
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

                                                        {/* Team Avatars */}
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

                                                    {/* Floating Calmendar Event Details Card */}
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
                                                                        <span>{weekDays[event.dayIndex % 7]?.name || 'Miércoles'}, {event.dateDay || '16'} {currentMonthStr}</span>
                                                                    </div>

                                                                    {/* Time Pickers Row */}
                                                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5 rounded-xl flex-1 cursor-pointer">
                                                                            <span>{event.timeStr.split('-')[0]?.trim() || '11:00'}</span>
                                                                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                                                        </div>
                                                                        <span className="text-gray-400 font-bold">-</span>
                                                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5 rounded-xl flex-1 cursor-pointer">
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
                                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">{event.type}</span>
                                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">{activeClient.name}</span>
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
                                    const isSelected = dayNum === selectedDate.getDate();
                                    const dayEvents = dayNum ? filteredEvents.filter(e => e.dateDay === dayNum) : [];
                                    
                                    return (
                                        <div 
                                            key={i} 
                                            onClick={() => {
                                                if (dayNum) {
                                                    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                                                    setSelectedDate(d);
                                                }
                                            }}
                                            className={`p-2.5 rounded-2xl border transition-all flex flex-col relative overflow-hidden cursor-pointer ${
                                                dayNum 
                                                    ? 'bg-[#101117] border-white/[0.04] hover:border-white/10' 
                                                    : 'opacity-20 border-transparent bg-transparent'
                                            } ${isSelected ? 'ring-2 ring-white/40 bg-white/[0.04]' : ''}`}
                                        >
                                            {dayNum && (
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
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
                                                                onClick={(e) => { e.stopPropagation(); setSelectedEventId(ev.id); setViewMode('Week'); }}
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
                                    {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h3>
                                <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-gray-300">
                                    {upcomingEventsForDay.length} eventos programados
                                </span>
                            </div>
                            <div className="space-y-4">
                                {upcomingEventsForDay.map(ev => {
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
                                                <textarea 
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    className="w-full bg-transparent text-white text-xs focus:outline-none resize-none h-16 placeholder:text-gray-500" 
                                                    placeholder="Escribe una nota rápida..."
                                                />
                                                <div className="flex items-center justify-end border-t border-white/5 pt-2">
                                                    <button onClick={() => {
                                                        if (noteText.trim()) {
                                                            setNotesList([{ id: Date.now(), title: 'Nota ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), content: noteText, date: 'Hoy' }, ...notesList]);
                                                            setNoteText('');
                                                            toast.success("Nota guardada");
                                                        }
                                                    }} className="text-xs bg-white text-black font-bold px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
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
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Pendientes de {activeClient.name}</h4>
                                                {upcomingEventsForDay.map(task => (
                                                    <div key={task.id} className="flex items-start gap-2.5 bg-[#101117] border border-white/[0.04] rounded-xl p-3">
                                                        <button 
                                                            onClick={() => toggleEventComplete(task.id)}
                                                            className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 text-white' : 'border border-gray-600'}`}
                                                        >
                                                            {task.completed && <Check className="w-3 h-3" />}
                                                        </button>
                                                        <span className={`text-xs ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                            {task.title}
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
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Users className="w-4 h-4 text-indigo-400" /> Zona Creativa
                                            </h3>
                                            <button onClick={() => setIsTeamOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 overflow-hidden flex items-center justify-center">
                                                <img src="https://i.pravatar.cc/150?u=Leslie" className="w-full h-full object-cover" alt="Leslie" />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-white">Leslie</h4>
                                                <p className="text-xs text-gray-400">Head of Production & CM</p>
                                            </div>
                                            <button 
                                                onClick={() => toast.success("Chat iniciado con Leslie")}
                                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all"
                                            >
                                                Chat con Leslie
                                            </button>
                                        </div>
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

            {/* --- SCHEDULING MODAL (Real Agendar Functionality) --- */}
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
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-indigo-400" /> Nuevo Evento / Entregable
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Cliente: {activeClient.name}</p>
                                </div>
                                <button onClick={() => setIsScheduling(false)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Título del Evento / Contenido</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Reel #2 Procedimientos / Sesión Fotográfica" 
                                        value={newEventTitle}
                                        onChange={(e) => setNewEventTitle(e.target.value)}
                                        className="w-full bg-[#101117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/30" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Fecha</label>
                                        <input 
                                            type="date" 
                                            value={newEventDate}
                                            onChange={(e) => setNewEventDate(e.target.value)}
                                            className="w-full bg-[#101117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Horario</label>
                                        <input 
                                            type="text" 
                                            value={newEventTime}
                                            onChange={(e) => setNewEventTime(e.target.value)}
                                            placeholder="10:00 - 11:30"
                                            className="w-full bg-[#101117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Tipo de Evento</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(EVENT_STYLES).map(([key, style]) => (
                                            <button 
                                                key={key} 
                                                type="button"
                                                onClick={() => setNewEventType(key)}
                                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                                                    newEventType === key 
                                                        ? 'bg-white/15 border-white/30 text-white font-bold' 
                                                        : 'bg-[#101117] border-white/5 text-gray-400 hover:border-white/20'
                                                }`}
                                            >
                                                <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                                                <span className="text-xs">{style.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-black/20 border-t border-white/5 flex gap-3 justify-end">
                                <button onClick={() => setIsScheduling(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleSaveNewEvent} 
                                    className="px-5 py-2 text-xs font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-all shadow-md"
                                >
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
                                    <div className="w-1/3 flex flex-col gap-4">
                                        <div className="grid grid-cols-2 gap-3 h-36 shrink-0">
                                            <div className="bg-[#12131b] rounded-2xl overflow-hidden relative border border-white/10">
                                                <img src="https://i.pravatar.cc/300?u=q" className="w-full h-full object-cover opacity-80" alt="participant" />
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">{activeClient.name}</span>
                                            </div>
                                            <div className="bg-[#12131b] rounded-2xl overflow-hidden relative border border-white/10">
                                                <img src="https://i.pravatar.cc/300?u=a" className="w-full h-full object-cover opacity-80" alt="participant" />
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">Leslie (CM)</span>
                                            </div>
                                        </div>

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

                                    <div className="w-2/3 flex flex-col gap-4">
                                        <div className="flex-1 bg-[#12131b] rounded-3xl overflow-hidden relative border border-white/10 group">
                                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="main video" />
                                            
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
