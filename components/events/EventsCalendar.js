import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Search, Plus, MoreHorizontal, Calendar as CalendarIcon, Edit2, Link as LinkIcon, Video, CheckCircle2, Clock, Smartphone, Camera, Star, Users, ChevronDown, CheckSquare, ExternalLink, X } from 'lucide-react';

export default function EventsCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isScheduling, setIsScheduling] = useState(false);
    
    // New States for Header Controls
    const [viewMode, setViewMode] = useState('Week');
    const [showViewMenu, setShowViewMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const formatMonthStr = (date) => date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase());
    const [currentMonthStr, setCurrentMonthStr] = useState(formatMonthStr(new Date()));
    const [activeFilter, setActiveFilter] = useState('all');

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
        setCurrentMonthStr(formatMonthStr(newDate));
    };
    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
        setCurrentMonthStr(formatMonthStr(newDate));
    };
    const handleGoToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setCurrentMonthStr(formatMonthStr(today));
    };

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
                name: d.toLocaleDateString('es-ES', { weekday: 'short' }).replace(/^\w/, c => c.toUpperCase()),
                num: d.getDate(),
                active: d.toDateString() === today.toDateString()
            });
        }
        return daysArray;
    };

    const days = getWeekDays(currentDate);

    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    // Glassmorphism & Neon Event Styles
    const EVENT_STYLES = {
        historias: {
            border: 'border-cyan-500/50',
            bg: 'bg-cyan-500/10',
            text: 'text-cyan-400',
            glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
            icon: Smartphone,
            label: 'Historias'
        },
        posts: {
            border: 'border-pink-500/50',
            bg: 'bg-pink-500/10',
            text: 'text-pink-400',
            glow: 'shadow-[0_0_15px_rgba(236,72,153,0.2)]',
            icon: Camera,
            label: 'Imágenes / Post'
        },
        videos: {
            border: 'border-emerald-500/50',
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
            icon: Video,
            label: 'Videos'
        },
        fechas: {
            border: 'border-amber-500/50',
            bg: 'bg-gradient-to-b from-amber-500/20 to-orange-500/5',
            text: 'text-amber-400',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
            icon: Star,
            label: 'Fechas Importantes'
        },
        meeting: {
            border: 'border-indigo-500/50',
            bg: 'bg-indigo-500/10',
            text: 'text-indigo-400',
            glow: 'shadow-[0_0_15px_rgba(99,102,241,0.2)]',
            icon: Users,
            label: 'Reunión'
        }
    };

    const events = [
        { 
            id: 1, 
            title: 'Onboarding Cliente Nuevo', 
            timeStr: '08:00 - 08:50',
            dayIndex: 0, // Mon
            startHour: 8,
            duration: 0.83,
            type: 'meeting',
            team: [1, 2]
        },
        { 
            id: 2, 
            title: 'Historia: Q&A Urólogo', 
            timeStr: '09:00 - 09:30',
            dayIndex: 1, // Tue
            startHour: 9,
            duration: 0.5,
            type: 'historias',
            platform: 'Instagram'
        },
        { 
            id: 3, 
            title: 'Día Internacional del Médico', 
            timeStr: 'Todo el día',
            dayIndex: 2, // Wed
            startHour: 8,
            duration: 9,
            type: 'fechas',
            description: 'Oportunidad: Enviar post de felicitación a la cartera médica.'
        },
        { 
            id: 4, 
            title: 'Revisión de Identidad de Marca', 
            timeStr: '10:30 - 12:15',
            dayIndex: 1, // Tue
            startHour: 10.5,
            duration: 1.75,
            type: 'meeting',
            team: [4]
        },
        { 
            id: 5, 
            title: 'Video Corporativo: NovaUrology', 
            timeStr: '10:00 - 13:00',
            dayIndex: 3, // Thu
            startHour: 10,
            duration: 3,
            type: 'videos',
            team: [2, 3, 5],
            location: 'Clínica Nova, Sto. Domingo'
        },
        { 
            id: 6, 
            title: 'Post: Mitos Urológicos', 
            timeStr: '13:00 - 13:30',
            dayIndex: 0, // Mon
            startHour: 13,
            duration: 0.5,
            type: 'posts',
            platform: 'LinkedIn'
        },
        { 
            id: 7, 
            title: 'Grabación B-Roll (Oficina)', 
            timeStr: '14:00 - 16:00',
            dayIndex: 1, // Tue
            startHour: 14,
            duration: 2,
            type: 'videos',
            team: [1, 3]
        },
        { 
            id: 8, 
            title: 'Post Carrusel Educativo', 
            timeStr: '15:00 - 15:30',
            dayIndex: 4, // Fri
            startHour: 15,
            duration: 0.5,
            type: 'posts'
        }
    ];

    const upcomingEvents = [
        { title: 'Día del Médico (Ecuador)', time: 'Mié 13', type: 'fechas' },
        { title: 'Historia: Tips Salud', time: '10:00 AM', type: 'historias' },
        { title: 'Post: Clínica Nova', time: 'Jue 14, 10:00', type: 'posts' },
        { title: 'Video Testimonios', time: '14:00 PM', type: 'videos' },
    ];

    const filteredEvents = activeFilter === 'all' ? events : events.filter(e => e.type === activeFilter);
    const filteredUpcoming = activeFilter === 'all' ? upcomingEvents : upcomingEvents.filter(e => e.type === activeFilter);

    const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

    const handleSendSummary = (e) => {
        e.stopPropagation();
        // Here you would normally call an API to send the summary
        alert("¡Resumen enviado al equipo con éxito!");
    };

    return (
        <div className="h-full flex flex-col bg-transparent text-white p-6 font-sans relative z-10">
            
            {/* Controls Header (Inner) */}
            <div className="flex items-center justify-between mb-6 relative z-[100]">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-black tracking-tight text-white ml-2 drop-shadow-lg shrink-0">Agenda Global</h1>
                    
                    {/* Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'historias', label: 'Historias', style: EVENT_STYLES.historias },
                            { id: 'posts', label: 'Imágenes / Post', style: EVENT_STYLES.posts },
                            { id: 'videos', label: 'Videos', style: EVENT_STYLES.videos },
                            { id: 'fechas', label: 'Fechas Importantes', style: EVENT_STYLES.fechas },
                            { id: 'meeting', label: 'Reuniones', style: EVENT_STYLES.meeting },
                        ].map(f => {
                            const isActive = activeFilter === f.id;
                            return (
                                <button 
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold transition-all border whitespace-nowrap ${
                                        isActive 
                                            ? f.id === 'all' ? 'bg-white text-black border-white' : `${f.style.bg} ${f.style.text} ${f.style.border} shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                                            : 'bg-black/20 text-gray-400 border-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <button 
                        onClick={() => setIsScheduling(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all transform hover:scale-105 active:scale-95 mr-2 border border-violet-400/30"
                    >
                        <Plus className="w-4 h-4" />
                        Agendar Reunión
                    </button>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-xl relative">
                        {/* Search Input (Expands) */}
                        <AnimatePresence>
                            {showSearch && (
                                <motion.div 
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 160, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    className="overflow-hidden flex items-center"
                                >
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Buscar evento..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-none text-sm font-semibold text-white focus:outline-none pl-3"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <button 
                            onClick={() => setShowSearch(!showSearch)}
                            className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                        >
                            <Search className="w-4 h-4" />
                        </button>
                        
                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <div className="relative">
                            <button 
                                onClick={() => setShowViewMenu(!showViewMenu)}
                                className="px-4 py-1.5 bg-white text-black hover:bg-gray-200 transition-colors font-bold text-sm rounded-full shadow-lg flex items-center gap-2"
                            >
                                {viewMode} <ChevronDown className="w-3 h-3" />
                            </button>
                            
                            <AnimatePresence>
                                {showViewMenu && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-2 bg-[#232332] border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 w-32 z-50 overflow-hidden"
                                    >
                                        {['Day', 'Week', 'Month'].map(v => (
                                            <button 
                                                key={v}
                                                onClick={() => { setViewMode(v); setShowViewMenu(false); toast.success(`Vista cambiada a: ${v}`); }}
                                                className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${viewMode === v ? 'text-violet-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <button 
                            onClick={handleGoToToday}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                        >
                            <CalendarIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                
                {/* Left Panel */}
                <div className="w-[280px] shrink-0 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-12">
                    
                    {/* Mini Calendar */}
                    <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-[24px] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-bold text-sm">{currentMonthStr}</span>
                            <div className="flex gap-1">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-md"><ChevronLeft className="w-4 h-4" /></button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-md"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        {/* Simple static grid for aesthetics */}
                        <div className="grid grid-cols-7 text-center gap-y-3">
                            {['L','M','X','J','V','S','D'].map(d => <div key={d} className="text-[10px] text-gray-500 font-bold">{d}</div>)}
                            {[...Array(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate())].map((_, i) => (
                                <div key={i} className={`text-xs font-bold w-6 h-6 flex items-center justify-center mx-auto rounded-full ${i+1 === currentDate.getDate() ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-gray-300'}`}>
                                    {i+1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events / Contenidos Listos */}
                    <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-[24px] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-sm leading-tight">Fechas Clave &<br/>Contenidos a Publicar</span>
                            <span className="text-[10px] text-gray-500 font-bold cursor-pointer hover:text-white">Ver todo</span>
                        </div>
                        <div className="space-y-4 mt-6">
                            {filteredUpcoming.map((ev, i) => {
                                const style = EVENT_STYLES[ev.type] || EVENT_STYLES.meeting;
                                const Icon = style.icon;
                                return (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-colors -mx-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} ${style.border} border`}>
                                                <Icon className={`w-4 h-4 ${style.text}`} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1">{ev.title}</span>
                                                <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${style.text}`}>{style.label}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-bold bg-[#1A1A24] px-2 py-1 rounded-md shrink-0">{ev.time}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Time Breakdown */}
                    <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-[24px] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-sm">Time breakdown</span>
                            <span className="text-[10px] text-gray-500 font-bold cursor-pointer hover:text-white">View all</span>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(EVENT_STYLES).map(([key, style], i) => (
                                <div key={key} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <style.icon className={`w-3.5 h-3.5 ${style.text}`} />
                                        <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">{style.label}</span>
                                    </div>
                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${style.bg.split(' ')[0]} ${style.glow}`} 
                                            style={{ width: `${Math.random() * 60 + 20}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Main Calendar View */}
                <div className="flex-1 bg-black/40 backdrop-blur-2xl rounded-[32px] flex flex-col overflow-hidden relative border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
                    
                    {/* --- WEEK VIEW --- */}
                    {viewMode === 'Week' && (
                        <>
                            {/* Header View */}
                            <div className="flex items-center p-6 pb-2">
                                <div className="w-16">
                                    <span className="text-xs font-bold text-gray-500">GMT -5</span>
                                </div>
                                <div className="flex-1 grid grid-cols-7 gap-2">
                                    {days.map((day, i) => (
                                        <div 
                                            key={i} 
                                            className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${day.active ? 'bg-white text-black shadow-lg scale-105 z-10' : 'bg-black/20 text-gray-400 hover:bg-black/40'}`}
                                        >
                                            <span className="text-[11px] font-bold">{day.name} {day.num}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                    {/* Grid Area */}
                    <div className="flex-1 flex overflow-y-auto relative p-6 pt-4 custom-scrollbar">
                        
                        {/* Time Column */}
                        <div className="w-16 flex flex-col">
                            {hours.map(hour => (
                                <div key={hour} className="h-[90px] text-[10px] font-bold text-gray-500 -mt-2">
                                    {hour} AM
                                </div>
                            ))}
                        </div>

                        {/* Event Grid */}
                        <div className="flex-1 relative">
                            {/* Horizontal Lines */}
                            <div className="absolute inset-0 flex flex-col">
                                {hours.map(hour => (
                                    <div key={hour} className="h-[90px] border-t border-white/[0.03] w-full" />
                                ))}
                            </div>

                            {/* Events Container */}
                            <div className="absolute inset-0 grid grid-cols-7 gap-2">
                                {filteredEvents.map(event => {
                                    const topOffset = (event.startHour - 8) * 90;
                                    const heightPixels = event.duration * 90;
                                    const isSelected = selectedEventId === event.id;
                                    const style = EVENT_STYLES[event.type] || EVENT_STYLES.meeting;
                                    const Icon = style.icon;

                                    return (
                                        <div key={event.id} style={{ gridColumnStart: event.dayIndex + 1 }} className="relative pointer-events-none">
                                            <div 
                                                onClick={() => setSelectedEventId(event.id)}
                                                className={`absolute left-0 right-0 rounded-2xl p-3 cursor-pointer pointer-events-auto transition-all duration-300 border backdrop-blur-md ${style.bg} ${style.border} ${isSelected ? `scale-[1.03] z-30 ${style.glow}` : 'hover:scale-[1.03] hover:brightness-125 z-10 hover:shadow-lg'}`}
                                                style={{ top: `${topOffset}px`, height: `${heightPixels - 6}px` }}
                                            >
                                                <div className="flex items-start justify-between gap-1">
                                                    <h3 className={`text-xs font-bold leading-snug tracking-wide ${style.text} line-clamp-2`}>{event.title}</h3>
                                                    <Icon className={`w-3.5 h-3.5 shrink-0 opacity-70 ${style.text} ${event.duration <= 0.5 ? 'hidden' : ''}`} />
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[10px] font-semibold text-white/60">{event.timeStr}</p>
                                                    {event.platform && (
                                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 ${style.text}`}>{event.platform}</span>
                                                    )}
                                                </div>
                                                
                                                {event.team && event.duration > 0.5 && (
                                                    <div className="absolute bottom-2 left-2 flex -space-x-1.5">
                                                        {event.team.map(t => (
                                                            <img key={t} src={`https://i.pravatar.cc/150?u=${t}`} className="w-5 h-5 rounded-full border border-[#232332]" alt="team" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Floating Modal (Futuristic Dark Theme) */}
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
                                                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
                                                        className="absolute z-50 w-[320px] bg-[#1A1A24]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                                                        style={{ top: `${topOffset + 10}px`, left: '105%' }}
                                                    >
                                                        {/* Header */}
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`p-2 rounded-xl ${style.bg} ${style.border} border`}>
                                                                    <Icon className={`w-5 h-5 ${style.text}`} />
                                                                </div>
                                                                <div>
                                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${style.text}`}>{style.label}</span>
                                                                    <h3 className="font-black text-lg leading-tight text-white mt-0.5">{event.title}</h3>
                                                                </div>
                                                            </div>
                                                            <button onClick={(e) => { e.stopPropagation(); setSelectedEventId(null); }} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-5">
                                                            {/* Date & Time */}
                                                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                                                                <div className="flex-1 flex flex-col">
                                                                    <span className="text-[10px] text-gray-500 font-bold mb-1">FECHA</span>
                                                                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                                                        <CalendarIcon className="w-4 h-4 text-gray-400" /> Miércoles 13
                                                                    </div>
                                                                </div>
                                                                <div className="w-px h-8 bg-white/10" />
                                                                <div className="flex-1 flex flex-col">
                                                                    <span className="text-[10px] text-gray-500 font-bold mb-1">HORA</span>
                                                                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                                                        <Clock className="w-4 h-4 text-gray-400" /> {event.timeStr}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Contextual Info */}
                                                            {event.description && (
                                                                <p className="text-sm text-gray-400 leading-relaxed">
                                                                    {event.description}
                                                                </p>
                                                            )}
                                                            {event.location && (
                                                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                                                                    <Camera className="w-4 h-4" />
                                                                    <span className="truncate">{event.location}</span>
                                                                </div>
                                                            )}
                                                            {event.type === 'meeting' && (
                                                                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-500/20">
                                                                    <Video className="w-4 h-4" />
                                                                    <span className="truncate">meet.google.com/xyz-abc</span>
                                                                </div>
                                                            )}

                                                            {/* Team */}
                                                            {event.team && (
                                                                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                                                    <span className="text-[10px] text-gray-500 font-bold">ASIGNADOS</span>
                                                                    <div className="flex -space-x-2">
                                                                        {event.team.map(t => (
                                                                            <img key={t} src={`https://i.pravatar.cc/150?u=${t}`} className="w-7 h-7 rounded-full border-2 border-[#1A1A24]" alt="team" />
                                                                        ))}
                                                                        <button className="w-7 h-7 rounded-full bg-[#232332] border-2 border-[#1A1A24] hover:border-white/20 flex items-center justify-center text-[10px] font-bold text-gray-400 transition-colors">
                                                                            <Plus className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Contextual Actions */}
                                                            <div className="flex gap-2 pt-2">
                                                                {event.type === 'content' ? (
                                                                    <>
                                                                        <button className={`flex-1 py-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2`}>
                                                                            <CheckSquare className="w-4 h-4" /> Aprobar
                                                                        </button>
                                                                        <button className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold rounded-xl transition-all">
                                                                            <ExternalLink className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button 
                                                                        onClick={handleSendSummary}
                                                                        className={`w-full py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2`}
                                                                    >
                                                                        Ver Detalles Completos
                                                                    </button>
                                                                )}
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
                    </>
                    )}

                    {/* --- MONTH VIEW --- */}
                    {viewMode === 'Month' && (
                        <div className="flex-1 flex flex-col p-6 h-full">
                            <div className="grid grid-cols-7 mb-4">
                                {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
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
                                    const hasEvents = dayNum === currentDate.getDate() || dayNum === currentDate.getDate() + 2 || dayNum === currentDate.getDate() + 5;
                                    
                                    return (
                                        <div key={i} className={`p-2 rounded-2xl border transition-colors cursor-pointer flex flex-col ${dayNum ? 'bg-black/20 border-white/5 hover:border-white/20' : 'opacity-20 border-transparent'} ${isToday ? 'ring-2 ring-violet-500/50 bg-violet-500/10' : ''}`}>
                                            {dayNum && <span className={`text-sm font-bold ${isToday ? 'text-violet-400' : 'text-gray-400'}`}>{dayNum}</span>}
                                            {hasEvents && (
                                                <div className="flex-1 flex flex-col justify-end gap-1 mt-2">
                                                    <div className="w-full h-1.5 rounded-full bg-pink-500/50" />
                                                    <div className="w-3/4 h-1.5 rounded-full bg-emerald-500/50" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* --- DAY VIEW --- */}
                    {viewMode === 'Day' && (
                        <div className="flex-1 flex flex-col h-full relative">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="text-2xl font-black text-white capitalize">{currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 relative">
                                <div className="absolute top-1/3 left-0 right-0 h-px bg-red-500/50 z-20 pointer-events-none">
                                    <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                </div>
                                <div className="flex flex-col gap-6 relative">
                                    {hours.slice(0, 5).map((hour, i) => (
                                        <div key={hour} className="flex items-start gap-4 h-24">
                                            <div className="w-16 shrink-0 text-right text-xs font-bold text-gray-500 pt-2">{hour} AM</div>
                                            <div className="flex-1 border-t border-white/5 relative">
                                                {i === 1 && (
                                                    <div className="absolute top-2 left-0 right-8 bg-indigo-500/10 border border-indigo-500/50 rounded-xl p-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                                        <h3 className="text-sm font-bold text-indigo-400">Revisión de Estrategia</h3>
                                                        <p className="text-xs text-white/60">09:00 - 10:00</p>
                                                    </div>
                                                )}
                                                {i === 3 && (
                                                    <div className="absolute top-0 left-0 right-1/4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                        <h3 className="text-sm font-bold text-emerald-400">Shooting Corporativo</h3>
                                                        <p className="text-xs text-white/60">11:00 - 13:00</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scheduling Modal */}
            <AnimatePresence>
                {isScheduling && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#1A1A24] border border-white/10 rounded-[32px] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/50">
                                        <Plus className="w-4 h-4 text-violet-400" />
                                    </div>
                                    Nuevo Evento
                                </h2>
                                <button onClick={() => setIsScheduling(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Título del Evento</label>
                                    <input type="text" placeholder="Ej: Lanzamiento de Campaña..." className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-violet-500 transition-colors placeholder:text-gray-600" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Fecha</label>
                                        <input type="date" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-violet-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Hora</label>
                                        <input type="time" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-violet-500 transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tipo de Evento</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(EVENT_STYLES).map(([key, style]) => {
                                            const Icon = style.icon;
                                            return (
                                                <button key={key} className={`flex items-center gap-2 p-3 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-left`}>
                                                    <div className={`p-1.5 rounded-lg ${style.bg}`}>
                                                        <Icon className={`w-4 h-4 ${style.text}`} />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-300">{style.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-black/20 border-t border-white/5 flex gap-3">
                                <button onClick={() => setIsScheduling(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-gray-400 hover:bg-white/5 transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={() => setIsScheduling(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
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
