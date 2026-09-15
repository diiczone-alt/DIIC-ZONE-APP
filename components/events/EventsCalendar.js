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
    Check, Sparkles, User, Tag, Layers, CheckCircle, Trash2, Copy
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Base real clients database reference
const BASE_REAL_CLIENTS = [
    {
        id: 'C-OSCAR--562',
        name: 'Dr. Oscar Cujilema',
        type: 'Médico / Urología',
        plan: 'Presencia Digital',
        deliverables: { reels: 5, shoots: 2, designs: 8, stories: 20, meetings: 4 }
    },
    {
        id: 'C-SEBAS-709',
        name: 'Sebas (Vito\'s Pizza)',
        type: 'Gastronomía',
        plan: 'Crecimiento',
        deliverables: { reels: 16, shoots: 6, designs: 12, stories: 30, meetings: 4 }
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

const TIME_OPTIONS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
    '17:00', '17:30', '18:00', '18:30', '19:00', '20:00'
];

export default function EventsCalendar({ 
    clientId = null, 
    client = null, 
    clients = [], 
    squad = [], 
    user = null, 
    role = "cm" 
} = {}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientParam = clientId || client?.id || searchParams?.get('client');

    const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 14)); // Sept 14, 2026 as active week
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 8, 14));
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isScheduling, setIsScheduling] = useState(false);
    
    // View mode: 'Week', 'Month', 'Day'
    const [viewMode, setViewMode] = useState('Week');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isMyCalendarsOpen, setIsMyCalendarsOpen] = useState(true);

    // Merge real clients
    const clientsList = useMemo(() => {
        if (clients && clients.length > 0) {
            const map = new Map();
            clients.forEach(c => map.set(c.id || c.name, {
                id: c.id || c.name,
                name: c.name,
                type: c.niche || c.type || 'Cliente Activo',
                plan: c.plan || 'Plan Estratégico',
                deliverables: c.deliverables || { reels: 12, shoots: 4, designs: 8, stories: 30, meetings: 4 }
            }));
            BASE_REAL_CLIENTS.forEach(c => {
                if (!map.has(c.id) && !map.has(c.name)) map.set(c.id, c);
            });
            return Array.from(map.values());
        }
        return BASE_REAL_CLIENTS;
    }, [clients]);

    // Active Client
    const [activeClientId, setActiveClientId] = useState(() => {
        return clientParam || (client?.id) || 'C-SEBAS-709';
    });

    useEffect(() => {
        if (client?.id && client.id !== activeClientId) {
            setActiveClientId(client.id);
        }
    }, [client]);

    // Real Squad / Creative Team
    const realSquad = useMemo(() => {
        if (squad && squad.length > 0) {
            return squad.map(m => ({
                id: m.id,
                name: m.name,
                role: m.role || 'Equipo Creativo',
                avatar: (m.name || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(),
                phone: m.phone,
                email: m.email
            }));
        }
        return [
            { id: 'sq-1', name: 'Anthony', role: 'Diseñador Gráfico & UI', avatar: 'A' },
            { id: 'sq-2', name: 'Fausto', role: 'Editor de Video & Reels', avatar: 'F' },
            { id: 'sq-3', name: 'Carlos Filmmaker', role: 'Filmmaker & Producción', avatar: 'C' },
            { id: 'sq-4', name: user?.full_name || 'Leslie (CM)', role: 'Lead Estratega & CM', avatar: (user?.full_name || 'L').charAt(0) }
        ];
    }, [squad, user]);

    // Side Panels
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isTasksOpen, setIsTasksOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const [isMeetPanelOpen, setIsMeetPanelOpen] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [notesList, setNotesList] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cm_calendar_notes');
            if (saved) try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 1, title: "Nota Estratégica #1", content: "Planificación de contenido médico y copys de campaña.", date: 'Hoy' },
            { id: 2, title: "Nota Estratégica #2", content: "Revisión de guiones de video y tomas B-Roll en consultorio.", date: 'Ayer' }
        ];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cm_calendar_notes', JSON.stringify(notesList));
        }
    }, [notesList]);

    // Meet States
    const [isMeetOpen, setIsMeetOpen] = useState(false);
    const [meetState, setMeetState] = useState('lobby');
    const [meetTasks, setMeetTasks] = useState([
        { id: 1, text: "Planificación agendada para la semana", completed: true },
        { id: 2, text: "Preparar Guía de Estilos y Hooks de la marca", completed: false },
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
        return clientsList.find(c => c.id === activeClientId) || clientsList[0] || { name: 'Cliente Activo', id: activeClientId };
    }, [activeClientId, clientsList]);

    // Events State with LocalStorage Persistence & Real DB tasks
    const [events, setEvents] = useState(() => {
        const storageKey = `cm_calendar_events_${activeClientId}`;
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { }
            }
        }
        return [
            { 
                id: 101, 
                title: 'Onboarding & Estrategia', 
                timeStr: '08:00 - 08:50',
                startTime: '08:00',
                endTime: '08:50',
                dayIndex: 0, // Mon 14
                dateDay: 14,
                startHour: 8,
                duration: 0.83,
                type: 'meeting',
                clientId: activeClientId,
                clientName: activeClient.name,
                team: ['sq-1', 'sq-4'],
                meetLink: 'meet.google.com/xkz-pwer-mmn',
                tags: ['Estrategia', 'Kickoff'],
                notes: 'Revisión inicial del plan de crecimiento y accesos a redes.',
                completed: true
            },
            { 
                id: 102, 
                title: 'Real #1: Procedimiento & Valoración', 
                timeStr: '08:30 - 10:30',
                startTime: '08:30',
                endTime: '10:30',
                dayIndex: 1, // Tue 15
                dateDay: 15,
                startHour: 8.5,
                duration: 2,
                type: 'videos',
                clientId: activeClientId,
                clientName: activeClient.name,
                team: ['sq-2', 'sq-3'],
                meetLink: 'meet.google.com/reel-prod-diic',
                tags: ['Reel', 'Video 4K'],
                notes: 'Grabación de hook en vertical 9:16 y tomas de apoyo B-Roll.',
                completed: false
            },
            { 
                id: 103, 
                title: 'Historia Interactiva: Preguntas y Respuestas', 
                timeStr: '08:00 - 10:00',
                startTime: '08:00',
                endTime: '10:00',
                dayIndex: 2, // Wed 16
                dateDay: 16,
                startHour: 8,
                duration: 2,
                type: 'historias',
                clientId: activeClientId,
                clientName: activeClient.name,
                team: ['sq-1', 'sq-2', 'sq-3', 'sq-4'],
                meetLink: 'www.google.com/meet/220xdp',
                tags: ['Q&A', 'Engagement'],
                notes: 'Sticker de preguntas en Instagram Stories para captar dudas frecuentes de clientes.',
                completed: false
            },
            { 
                id: 104, 
                title: 'Revisión de Identidad & Diseños Carrusel', 
                timeStr: '10:30 - 12:15',
                startTime: '10:30',
                endTime: '12:15',
                dayIndex: 2, // Wed 16
                dateDay: 16,
                startHour: 10.5,
                duration: 1.75,
                type: 'posts',
                clientId: activeClientId,
                clientName: activeClient.name,
                team: ['sq-1', 'sq-4'],
                meetLink: 'meet.google.com/des-rev-art',
                tags: ['Diseño', 'Carrusel'],
                notes: 'Validación de paleta de colores y tipografía con el diseñador.',
                completed: false
            },
            { 
                id: 105, 
                title: 'Rodaje Presencial B-Roll', 
                timeStr: '08:00 - 10:30',
                startTime: '08:00',
                endTime: '10:30',
                dayIndex: 3, // Thu 17
                dateDay: 17,
                startHour: 8,
                duration: 2.5,
                type: 'videos',
                clientId: activeClientId,
                clientName: activeClient.name,
                team: ['sq-2', 'sq-3'],
                meetLink: '',
                tags: ['Filmmaker', 'Shooting'],
                notes: 'Equipo de luces y cámara listos en locación.',
                completed: false
            },
            { 
                id: 106, 
                title: 'Post Educativo: Mitos y Verdades', 
                timeStr: '10:00 - 11:30',
                startTime: '10:00',
                endTime: '11:30',
                dayIndex: 4, // Fri 18
                dateDay: 18,
                startHour: 10,
                duration: 1.5,
                type: 'posts',
                clientId: activeClientId,
                clientName: activeClient.name,
                team: ['sq-1'],
                meetLink: '',
                tags: ['Feed Post', 'Educación'],
                notes: 'Post educativo carrusel 5 slides.',
                completed: false
            }
        ];
    });

    // Save events to local storage whenever they change
    useEffect(() => {
        const storageKey = `cm_calendar_events_${activeClientId}`;
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(events));
        }
    }, [events, activeClientId]);

    // Handle URL searchParam synchronization
    useEffect(() => {
        if (clientParam && clientParam !== activeClientId) {
            setActiveClientId(clientParam);
        }
    }, [clientParam]);

    const formatMonthStr = (date) => date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^w/, (c) => c.toUpperCase());
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
        const today = new Date(2026, 8, 14);
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
        return events.filter(e => {
            const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
            if (!matchesSearch) return false;
            if (activeFilter === 'all') return true;
            return e.type === activeFilter;
        });
    }, [events, activeFilter, searchQuery]);

    // Upcoming Events for Today / Selected Date
    const upcomingEventsForDay = useMemo(() => {
        const dayNum = selectedDate.getDate();
        const matches = events.filter(e => e.dateDay === dayNum);
        if (matches.length > 0) return matches;
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
        }, 1000);
    };

    // ─── Direct Event Editing Handlers ───
    const parseHourFromString = (str) => {
        if (!str) return 8;
        const [h, m] = str.split(':').map(Number);
        return (h || 8) + (m ? m / 60 : 0);
    };

    const handleUpdateEventField = (eventId, field, value) => {
        setEvents(prev => prev.map(ev => {
            if (ev.id !== eventId) return ev;
            
            const updated = { ...ev, [field]: value };
            
            // Recalculate duration & startHour if time changed
            if (field === 'startTime' || field === 'endTime') {
                const sTime = field === 'startTime' ? value : (ev.startTime || ev.timeStr?.split('-')[0]?.trim() || '08:00');
                const eTime = field === 'endTime' ? value : (ev.endTime || ev.timeStr?.split('-')[1]?.trim() || '10:00');
                const startH = parseHourFromString(sTime);
                const endH = parseHourFromString(eTime);
                const dur = Math.max(endH - startH, 0.5);
                
                updated.startTime = sTime;
                updated.endTime = eTime;
                updated.startHour = startH;
                updated.duration = dur;
                updated.timeStr = `${sTime} - ${eTime}`;
            }

            if (field === 'dayIndex') {
                const dayIdx = parseInt(value);
                updated.dayIndex = dayIdx;
                updated.dateDay = weekDays[dayIdx % 7]?.num || (14 + dayIdx);
            }

            return updated;
        }));
    };

    const handleToggleTeamMember = (eventId, memberId) => {
        setEvents(prev => prev.map(ev => {
            if (ev.id !== eventId) return ev;
            const currentTeam = Array.isArray(ev.team) ? ev.team : [];
            const newTeam = currentTeam.includes(memberId)
                ? currentTeam.filter(id => id !== memberId)
                : [...currentTeam, memberId];
            return { ...ev, team: newTeam };
        }));
        toast.info("Equipo actualizado en el evento");
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(prev => prev.filter(ev => ev.id !== eventId));
        setSelectedEventId(null);
        toast.success("Evento eliminado del calendario");
    };

    // Quick New Event Form States
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventStart, setNewEventStart] = useState('10:00');
    const [newEventEnd, setNewEventEnd] = useState('11:30');
    const [newEventDayIdx, setNewEventDayIdx] = useState(1);
    const [newEventType, setNewEventType] = useState('videos');
    const [newEventLink, setNewEventLink] = useState('meet.google.com/diic-live');
    const [newEventTeam, setNewEventTeam] = useState(['sq-1']);

    const handleSaveNewEvent = () => {
        if (!newEventTitle.trim()) {
            toast.error("Ingresa un título para el evento");
            return;
        }
        const startH = parseHourFromString(newEventStart);
        const endH = parseHourFromString(newEventEnd);
        const dur = Math.max(endH - startH, 0.5);

        const createdEv = {
            id: Date.now(),
            title: newEventTitle,
            timeStr: `${newEventStart} - ${newEventEnd}`,
            startTime: newEventStart,
            endTime: newEventEnd,
            dayIndex: newEventDayIdx,
            dateDay: weekDays[newEventDayIdx % 7]?.num || 15,
            startHour: startH,
            duration: dur,
            type: newEventType,
            clientId: activeClientId,
            clientName: activeClient.name,
            team: newEventTeam,
            meetLink: newEventLink,
            tags: ['Nuevo'],
            notes: '',
            completed: false
        };
        setEvents(prev => [createdEv, ...prev]);
        setIsScheduling(false);
        setNewEventTitle('');
        toast.success("Evento agendado exitosamente");
    };

    // Selected Event
    const selectedEvent = useMemo(() => {
        return events.find(e => e.id === selectedEventId) || null;
    }, [events, selectedEventId]);

    const [isSelectingTeam, setIsSelectingTeam] = useState(false);

    return (
        <div className="h-full flex flex-col bg-[#0d0e12] text-white p-6 font-sans select-none overflow-hidden relative">
            
            {/* Top Bar */}
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
                
                {/* --- LEFT SIDEBAR --- */}
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

                    {/* Upcoming Events Today Widget */}
                    <div className="bg-[#161720] border border-white/[0.06] p-5 rounded-[26px] shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-white">Upcoming events today</span>
                            <button onClick={() => setViewMode('Day')} className="text-[11px] font-semibold text-gray-400 hover:text-white transition-colors">View all</button>
                        </div>

                        <div className="space-y-3 mt-1">
                            {upcomingEventsForDay.map((ev) => {
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

                    {/* Time Breakdown Widget */}
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

                    {/* My Calendars Accordion */}
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

                    {/* === WEEK VIEW === */}
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
                                                    onClick={() => {
                                                        setNewEventDayIdx(dayIndex);
                                                        setIsScheduling(true);
                                                    }}
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

                                            const assignedSquad = (event.team || []).map(id => realSquad.find(m => m.id === id)).filter(Boolean);

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
                                                        {assignedSquad.length > 0 && event.duration >= 0.8 && (
                                                            <div className="flex -space-x-1.5 mt-2 pointer-events-none">
                                                                {assignedSquad.map((m) => (
                                                                    <div 
                                                                        key={m.id} 
                                                                        className="w-5 h-5 rounded-full bg-black/40 border border-white/40 text-[9px] font-bold text-white flex items-center justify-center shadow-sm"
                                                                        title={`${m.name} (${m.role})`}
                                                                    >
                                                                        {m.avatar}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* ═════════════════════════════════════════════════════════════════ */}
                                                    {/* FLOATING EDITABLE EVENT CARD (Pop-up with all editable fields)   */}
                                                    {/* ═════════════════════════════════════════════════════════════════ */}
                                                    <AnimatePresence>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                className="absolute z-50 w-[320px] bg-white text-gray-900 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-gray-100 pointer-events-auto"
                                                                style={{ 
                                                                    top: `${Math.min(topOffset, 220)}px`, 
                                                                    left: event.dayIndex > 3 ? 'auto' : '102%',
                                                                    right: event.dayIndex > 3 ? '102%' : 'auto'
                                                                }}
                                                            >
                                                                {/* 1. Header: Editable Title & Close */}
                                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                                    <input 
                                                                        type="text"
                                                                        value={event.title}
                                                                        onChange={(e) => handleUpdateEventField(event.id, 'title', e.target.value)}
                                                                        className="font-bold text-sm text-gray-900 leading-tight w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 focus:outline-none transition-all"
                                                                        placeholder="Título del evento..."
                                                                    />
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); setSelectedEventId(null); }}
                                                                        className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                                                                        title="Cerrar"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                <div className="space-y-2.5">
                                                                    {/* 2. Date / Day Selector */}
                                                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                                                        <CalendarIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                                                                        <select
                                                                            value={event.dayIndex % 7}
                                                                            onChange={(e) => handleUpdateEventField(event.id, 'dayIndex', e.target.value)}
                                                                            className="bg-gray-100 border border-gray-200 text-gray-800 text-xs rounded-xl px-2.5 py-1.5 font-semibold focus:outline-none w-full cursor-pointer"
                                                                        >
                                                                            {weekDays.map((wd, idx) => (
                                                                                <option key={idx} value={idx}>
                                                                                    {wd.name}, {wd.num} de {currentMonthStr}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>

                                                                    {/* 3. Time Pickers (Start - End) */}
                                                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                                                        <div className="flex items-center bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-xl flex-1">
                                                                            <select 
                                                                                value={event.startTime || event.timeStr?.split('-')[0]?.trim() || '08:00'}
                                                                                onChange={(e) => handleUpdateEventField(event.id, 'startTime', e.target.value)}
                                                                                className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none w-full cursor-pointer"
                                                                            >
                                                                                {TIME_OPTIONS.map(t => (
                                                                                    <option key={`st-${t}`} value={t}>{t}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <span className="text-gray-400 font-bold">-</span>
                                                                        <div className="flex items-center bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-xl flex-1">
                                                                            <select 
                                                                                value={event.endTime || event.timeStr?.split('-')[1]?.trim() || '10:00'}
                                                                                onChange={(e) => handleUpdateEventField(event.id, 'endTime', e.target.value)}
                                                                                className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none w-full cursor-pointer"
                                                                            >
                                                                                {TIME_OPTIONS.map(t => (
                                                                                    <option key={`et-${t}`} value={t}>{t}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    {/* 4. Meeting Link / URL Input */}
                                                                    <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                                                                        <Video className="w-4 h-4 text-indigo-500 shrink-0 ml-1" />
                                                                        <input 
                                                                            type="text"
                                                                            value={event.meetLink || ''}
                                                                            onChange={(e) => handleUpdateEventField(event.id, 'meetLink', e.target.value)}
                                                                            placeholder="www.google.com/meet/..."
                                                                            className="w-full bg-transparent text-[11px] text-gray-800 font-mono focus:outline-none px-1"
                                                                        />
                                                                        {event.meetLink && (
                                                                            <div className="flex items-center gap-0.5">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const link = event.meetLink.startsWith('http') ? event.meetLink : `https://${event.meetLink}`;
                                                                                        window.open(link, '_blank');
                                                                                    }}
                                                                                    className="p-1 hover:bg-gray-200 rounded-lg text-indigo-600 transition-colors"
                                                                                    title="Abrir enlace de reunión"
                                                                                >
                                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(event.meetLink);
                                                                                        toast.success("Enlace copiado al portapapeles");
                                                                                    }}
                                                                                    className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                                                                                    title="Copiar enlace"
                                                                                >
                                                                                    <Copy className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* 5. Category & Client Dropdowns */}
                                                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                                                        <div>
                                                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Tipo</label>
                                                                            <select 
                                                                                value={event.type}
                                                                                onChange={(e) => handleUpdateEventField(event.id, 'type', e.target.value)}
                                                                                className="w-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold rounded-xl px-2 py-1 focus:outline-none cursor-pointer capitalize"
                                                                            >
                                                                                {Object.keys(EVENT_STYLES).map(k => (
                                                                                    <option key={k} value={k}>{EVENT_STYLES[k].label}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>

                                                                        <div>
                                                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Cliente</label>
                                                                            <select 
                                                                                value={event.clientId || activeClientId}
                                                                                onChange={(e) => {
                                                                                    const foundC = clientsList.find(c => c.id === e.target.value);
                                                                                    handleUpdateEventField(event.id, 'clientId', e.target.value);
                                                                                    if (foundC) handleUpdateEventField(event.id, 'clientName', foundC.name);
                                                                                }}
                                                                                className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-xl px-2 py-1 focus:outline-none cursor-pointer truncate"
                                                                            >
                                                                                {clientsList.map(c => (
                                                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    {/* 6. Real Assigned Squad Section */}
                                                                    <div className="pt-2 border-t border-gray-100">
                                                                        <div className="flex items-center justify-between mb-1.5">
                                                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipo Asignado</span>
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => setIsSelectingTeam(!isSelectingTeam)}
                                                                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                                                                            >
                                                                                {isSelectingTeam ? 'Listo' : '+ Asignar'}
                                                                            </button>
                                                                        </div>

                                                                        {/* Team Avatars Bar */}
                                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                                            {assignedSquad.map(m => (
                                                                                <div 
                                                                                    key={m.id}
                                                                                    onClick={() => handleToggleTeamMember(event.id, m.id)}
                                                                                    className="flex items-center gap-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-700 cursor-pointer transition-colors group"
                                                                                    title="Haz clic para desasignar"
                                                                                >
                                                                                    <span>{m.name}</span>
                                                                                    <X className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100" />
                                                                                </div>
                                                                            ))}
                                                                            {assignedSquad.length === 0 && (
                                                                                <span className="text-[10px] text-gray-400 italic">Sin miembros asignados</span>
                                                                            )}
                                                                        </div>

                                                                        {/* Dropdown to assign more squad members */}
                                                                        {isSelectingTeam && (
                                                                            <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                                                                                {realSquad.map(m => {
                                                                                    const isAssigned = (event.team || []).includes(m.id);
                                                                                    return (
                                                                                        <div 
                                                                                            key={m.id}
                                                                                            onClick={() => handleToggleTeamMember(event.id, m.id)}
                                                                                            className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                                                                                isAssigned ? 'bg-indigo-100 text-indigo-900 font-bold' : 'hover:bg-gray-100 text-gray-700'
                                                                                            }`}
                                                                                        >
                                                                                            <span>{m.name} <span className="text-[9px] text-gray-500 font-normal">({m.role})</span></span>
                                                                                            {isAssigned && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* 7. Editable Notes field */}
                                                                    <div className="pt-2 border-t border-gray-100">
                                                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Notas / Acuerdos</label>
                                                                        <textarea 
                                                                            value={event.notes || ''}
                                                                            onChange={(e) => handleUpdateEventField(event.id, 'notes', e.target.value)}
                                                                            placeholder="Añadir notas estratégicas sobre este entregable..."
                                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none h-14"
                                                                        />
                                                                    </div>

                                                                    {/* 8. Action Buttons (Save Note / Delete) */}
                                                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                                                        <button 
                                                                            onClick={() => {
                                                                                toast.success("¡Cambios guardados con éxito!");
                                                                                setSelectedEventId(null);
                                                                            }}
                                                                            className="flex-1 bg-black hover:bg-gray-800 text-white text-xs font-bold py-2 rounded-full transition-all shadow-md"
                                                                        >
                                                                            Guardar Cambios
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeleteEvent(event.id)}
                                                                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                                                            title="Eliminar evento"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
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
                                            <button 
                                                onClick={() => {
                                                    setSelectedEventId(ev.id);
                                                    setViewMode('Week');
                                                }} 
                                                className="bg-black/20 hover:bg-black/40 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                                            >
                                                Editar / Ver detalles
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </main>

                {/* --- RIGHT APPS DOCK & SLIDEOUT PANELS --- */}
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
                                                <FileText className="w-4 h-4 text-blue-400" /> Notas Estratégicas
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
                                                    placeholder="Escribe una nota rápida para este cliente..."
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

                                {/* Tasks & DIIC IA */}
                                {isTasksOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <CheckSquare className="w-4 h-4 text-amber-400" /> Tareas de {activeClient.name}
                                            </h3>
                                            <button onClick={() => setIsTasksOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                                            <div className="space-y-2">
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
                                                <Users className="w-4 h-4 text-indigo-400" /> Equipo Creativo Real
                                            </h3>
                                            <button onClick={() => setIsTeamOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                            {realSquad.map(m => (
                                                <div key={m.id} className="p-3 bg-[#101117] border border-white/5 rounded-2xl flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                                        {m.avatar}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                                                        <p className="text-[10px] text-cyan-400 truncate uppercase tracking-wider">{m.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* DIIC Meet Panel */}
                                {isMeetPanelOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Video className="w-4 h-4 text-indigo-400" /> Videollamadas
                                            </h3>
                                            <button onClick={() => setIsMeetPanelOpen(false)} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3 text-center">
                                            <p className="text-xs text-gray-400">Inicia una sala de videollamada para coordinación con {activeClient.name}.</p>
                                            <button 
                                                onClick={() => {
                                                    window.open('https://meet.google.com/new', '_blank');
                                                    toast.success("Sala de Meet abierta");
                                                }}
                                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                                            >
                                                <Video className="w-4 h-4" /> Iniciar Google Meet
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
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Día de la semana</label>
                                        <select 
                                            value={newEventDayIdx}
                                            onChange={(e) => setNewEventDayIdx(parseInt(e.target.value))}
                                            className="w-full bg-[#101117] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none"
                                        >
                                            {weekDays.map((wd, idx) => (
                                                <option key={idx} value={idx}>{wd.name}, {wd.num} de {currentMonthStr}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Horario (Inicio - Fin)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <select 
                                                value={newEventStart}
                                                onChange={(e) => setNewEventStart(e.target.value)}
                                                className="bg-[#101117] border border-white/10 rounded-xl px-2 py-2 text-white text-xs font-semibold"
                                            >
                                                {TIME_OPTIONS.map(t => <option key={`nst-${t}`} value={t}>{t}</option>)}
                                            </select>
                                            <select 
                                                value={newEventEnd}
                                                onChange={(e) => setNewEventEnd(e.target.value)}
                                                className="bg-[#101117] border border-white/10 rounded-xl px-2 py-2 text-white text-xs font-semibold"
                                            >
                                                {TIME_OPTIONS.map(t => <option key={`net-${t}`} value={t}>{t}</option>)}
                                            </select>
                                        </div>
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

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Enlace de Videollamada</label>
                                    <input 
                                        type="text" 
                                        placeholder="meet.google.com/..." 
                                        value={newEventLink}
                                        onChange={(e) => setNewEventLink(e.target.value)}
                                        className="w-full bg-[#101117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/30" 
                                    />
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
                                    Guardar Evento
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
