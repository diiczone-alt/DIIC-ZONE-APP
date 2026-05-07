import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Search, Plus, MoreHorizontal, Calendar as CalendarIcon, Edit2, Link as LinkIcon, Video, CheckCircle2, Clock, Smartphone, Camera, Star, Users, ChevronDown, CheckSquare, ExternalLink, X, FileText, Mic, MicOff, MonitorUp, PhoneOff, Paperclip, MessageCircle, MessageSquare } from 'lucide-react';

export default function EventsCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isScheduling, setIsScheduling] = useState(false);
    
    // New States for Header Controls
    const [viewMode, setViewMode] = useState('Month');
    const [showViewMenu, setShowViewMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
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
        { id: 1, title: "Nota Estratégica #1", content: "Este es el contenido de la nota guardada previamente con detalles importantes sobre la campaña.", type: 'text' },
        { id: 2, title: "Nota Estratégica #2", content: "Este es el contenido de la nota guardada previamente con detalles importantes sobre la campaña.", type: 'text' },
        { id: 3, title: "Nota Estratégica #3", content: "Este es el contenido de la nota guardada previamente con detalles importantes sobre la campaña.", type: 'text' }
    ]);
    
    // Task & Reminder States
    const [tasksList, setTasksList] = useState([
        { id: 1, text: "Revisar los copies de la campaña antes del lanzamiento.", completed: false },
        { id: 2, text: "Preparar presentación para el cliente Elite.", completed: true }
    ]);
    const [remindersList, setRemindersList] = useState([
        { id: 1, text: "Tomar pastillas", time: "Lunes 14:00", active: true },
        { id: 2, text: "Reunión con cirujano", time: "Jueves 16:30", active: true }
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
        
        // Simulated Response from Leslie
        if (chattingWith.name === 'Leslie') {
            setTimeout(() => {
                const response = {
                    id: Date.now() + 1,
                    sender: 'Leslie',
                    text: "¡Hola! Recibido. Ya estoy trabajando en eso. ¿Necesitas algo más para el post de hoy?",
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
            toast.info("Asistente escuchando... Cuéntame tus pendientes.", { id: 'ai-voice' });
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
            const finalPuntuation = transcriptRef.current.trim();
            if (finalPuntuation) {
                processAITranscript(finalPuntuation);
            } else {
                toast.dismiss('ai-voice');
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsAITasking(false);
            toast.error("Error en el reconocimiento de voz: " + event.error);
        };

        recognition.start();
    };

    const processAITranscript = (text) => {
        setIsProcessingAI(true);
        toast.loading("DIIC IA está analizando tu solicitud...", { id: 'ai-voice' });

        // Advanced Simulated AI Logic
        setTimeout(() => {
            const lowercaseText = text.toLowerCase();
            const words = lowercaseText.split(' ');
            
            // Extract multiple potential entities
            const newTasks = [];
            const newReminders = [];
            const newCalendarEvents = [];

            // Keywords for categorization
            const dayKeywords = {
                'lunes': 0, 'martes': 1, 'miércoles': 2, 'miercoles': 2, 
                'jueves': 3, 'viernes': 4, 'sábado': 5, 'sabado': 5, 'domingo': 6
            };
            const timeKeywords = ['am', 'pm', 'hora', 'horas', 'punto', 'tarde', 'mañana', 'noche'];
            const taskKeywords = ['hacer', 'comprar', 'revisar', 'enviar', 'preparar', 'llamar'];

            // Simple "Smart" parsing
            const sections = lowercaseText.split(/ y | además | también |, /);
            
            sections.forEach(section => {
                let detectedDay = null;
                let detectedHour = 10;
                let isReminder = false;

                Object.entries(dayKeywords).forEach(([day, index]) => {
                    if (section.includes(day)) {
                        detectedDay = index;
                        isReminder = true;
                    }
                });

                if (timeKeywords.some(tk => section.includes(tk))) isReminder = true;

                // Time extraction
                const timeMatch = section.match(/(\d{1,2})(:(\d{2}))?\s*(pm|am)?/i);
                if (timeMatch) {
                    let h = parseInt(timeMatch[1]);
                    const m = timeMatch[3] ? parseInt(timeMatch[3]) / 60 : 0;
                    const ampm = timeMatch[4]?.toLowerCase();
                    if (ampm === 'pm' && h < 12) h += 12;
                    detectedHour = h + m;
                }

                if (isReminder) {
                    const reminderId = Date.now() + Math.random();
                    const cleanText = section.replace(/lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo|a las|alas/g, '').trim();
                    const hasDate = detectedDay !== null;

                    newReminders.push({
                        id: reminderId,
                        text: cleanText.charAt(0).toUpperCase() + cleanText.slice(1),
                        time: hasDate ? `${Object.keys(dayKeywords).find(k => dayKeywords[k] === detectedDay).toUpperCase()} ${detectedHour}:00` : "FECHA PENDIENTE",
                        active: true,
                        status: hasDate ? 'ready' : 'pending',
                        note: hasDate ? null : "¿Para qué fecha quieres agendar esto? Di 'El lunes' o similar."
                    });

                    if (hasDate) {
                        newCalendarEvents.push({
                            id: reminderId,
                            title: `IA: ${cleanText}`,
                            timeStr: `${detectedHour}:00`,
                            dayIndex: detectedDay,
                            startHour: detectedHour,
                            duration: 1,
                            type: 'recordatorios',
                            description: `Procesado por DIIC IA: "${text}"`
                        });
                    } else {
                        // Prompt user for date if missing
                        setTimeout(() => {
                            toast("IA: Detecté un recordatorio pero no la fecha. ¿Cuándo lo agendamos?", {
                                icon: "📅",
                                duration: 5000,
                                action: {
                                    label: "Dictar Fecha",
                                    onClick: () => handleAITaskVoice()
                                }
                            });
                        }, 1000);
                    }
                } else if (section.trim().length > 3) {
                    newTasks.push({
                        id: Date.now() + Math.random(),
                        text: section.trim().charAt(0).toUpperCase() + section.trim().slice(1),
                        completed: false
                    });
                }
            });

            if (newTasks.length > 0) setTasksList(prev => [...newTasks, ...prev]);
            if (newReminders.length > 0) setRemindersList(prev => [...newReminders, ...prev]);
            if (newCalendarEvents.length > 0) setEvents(prev => [...prev, ...newCalendarEvents]);

            setIsProcessingAI(false);
            setCurrentTranscript("");
            toast.success("IA: He organizado tus solicitudes en el sistema.", { id: 'ai-voice' });
        }, 2000);
    };

    const handleSaveNote = () => {
        if (!noteText && !recordedAudioUrl && !noteImage) return;
        
        const newNote = {
            id: Date.now(),
            title: `Nota ${new Date().toLocaleTimeString()}`,
            content: noteText,
            audio: recordedAudioUrl,
            image: noteImage,
            date: new Date().toLocaleDateString()
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
            reader.onloadend = () => {
                setNoteImage(reader.result);
            };
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
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setRecordedAudioUrl(url);
                setIsRecordingNote(false);
                toast.success("Grabación finalizada y adjuntada", { id: 'voice-note' });
                
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecordingNote(true);
            toast.success("Grabando nota de voz...", { id: 'voice-note' });
        } catch (err) {
            console.error("Error accessing microphone:", err);
            toast.error("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
        }
    };

    const stopVoiceNote = () => {
        if (mediaRecorderRef.current && isRecordingNote) {
            mediaRecorderRef.current.stop();
        }
    };

    const [isSyncing, setIsSyncing] = useState(false);
    const [hoveredEventId, setHoveredEventId] = useState(null);
    
    // Meet States
    const [isMeetOpen, setIsMeetOpen] = useState(false);
    const [meetState, setMeetState] = useState('lobby'); // lobby, in-call, post-call
    
    // Interactive Meet Data
    const [meetTasks, setMeetTasks] = useState([
        { id: 1, text: "Planificación agendada para el viernes", completed: true },
        { id: 2, text: "Preparar la Guía de Estilos de la marca", completed: false },
        { id: 3, text: "Compartir feedback de diseño con equipo Creativo", completed: false },
        { id: 4, text: "Revisar copys de campaña publicitaria", completed: false }
    ]);
    const [newTaskText, setNewTaskText] = useState("");
    
    const [meetChat, setMeetChat] = useState("Hola equipo, gracias a todos por unirse a esta videoconferencia. Tenemos que rediseñar el sitio web con el objetivo de lograr una mejor Experiencia de Usuario. Haremos una investigación básica y luego prepararemos la guía de estilos.");
    const [newChatText, setNewChatText] = useState("");
    const [isTypingChat, setIsTypingChat] = useState(false);
    
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
        },
        citas: {
            border: 'border-rose-500/50',
            bg: 'bg-rose-500/10',
            text: 'text-rose-400',
            glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]',
            icon: FileText,
            label: 'Citas'
        },
        consultas: {
            border: 'border-blue-500/50',
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
            icon: MonitorUp,
            label: 'Consultas'
        },
        recordatorios: {
            border: 'border-orange-500/50',
            bg: 'bg-orange-500/10',
            text: 'text-orange-400',
            glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
            icon: Clock,
            label: 'Recordatorios'
        }
    };

    const [events, setEvents] = useState([
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
    ]);

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
        toast.success("Evento reprogramado", { id: 'drag-drop' });
    };

    return (
        <div className="h-full flex flex-col bg-transparent text-white p-6 font-sans relative z-10">
            
            {/* Controls Header (Inner) */}
            <div className="flex items-center justify-between mb-8 relative z-[100]">
                <div className="flex items-center gap-10">
                    <h1 className="text-2xl font-black tracking-tight text-white ml-2 drop-shadow-lg shrink-0">Agenda Global</h1>
                    
                    {/* Filters - Well Divided & Colored */}
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${
                                activeFilter === 'all' 
                                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' 
                                    : 'bg-black/40 text-gray-500 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Todos
                        </button>

                        <div className="w-[1px] h-6 bg-white/10 mx-1" />
                        
                        {[
                            { id: 'historias', style: EVENT_STYLES.historias },
                            { id: 'posts', style: EVENT_STYLES.posts },
                            { id: 'videos', style: EVENT_STYLES.videos },
                            { id: 'fechas', style: EVENT_STYLES.fechas },
                            { id: 'meeting', style: EVENT_STYLES.meeting },
                            { id: 'citas', style: EVENT_STYLES.citas },
                            { id: 'consultas', style: EVENT_STYLES.consultas },
                            { id: 'recordatorios', style: EVENT_STYLES.recordatorios },
                        ].map(f => {
                            const isActive = activeFilter === f.id;
                            const Icon = f.style.icon;
                            return (
                                <button 
                                    key={f.id}
                                    title={f.style.label}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border group relative ${
                                        isActive 
                                            ? `${f.style.bg} ${f.style.text} ${f.style.border} shadow-lg scale-110`
                                            : `bg-black/30 text-gray-500 ${f.style.border.replace('50', '10')} hover:bg-white/10 hover:text-white`
                                    }`}
                                >
                                    {/* Subtle Glow in background */}
                                    {!isActive && (
                                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity ${f.style.bg}`} />
                                    )}
                                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-xl relative">
                        <AnimatePresence>
                            {showSearch && (
                                <motion.div 
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    className="overflow-hidden flex items-center"
                                >
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-none text-sm font-semibold text-white focus:outline-none pl-3"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <button 
                            onClick={() => setShowSearch(!showSearch)}
                            className={`p-2 rounded-xl transition-colors ${showSearch ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                        >
                            <Search className="w-5 h-5" />
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
                    
                    {/* Add Meeting (+) Button in Sidebar */}
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-1 rounded-2xl shadow-[0_10px_25px_rgba(139,92,246,0.3)]">
                        <button 
                            onClick={() => setIsScheduling(true)}
                            className="w-full py-4 flex items-center justify-center bg-[#0D0D12] rounded-xl hover:bg-transparent transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <span className="ml-3 font-black text-xs uppercase tracking-widest text-violet-400 group-hover:text-white transition-colors">Agendar</span>
                        </button>
                    </div>

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
                            <div className="absolute inset-0 flex flex-col pointer-events-none">
                                {hours.map(hour => (
                                    <div key={hour} className="h-[90px] border-t border-white/[0.03] w-full" />
                                ))}
                            </div>

                            {/* Drop Zones for Columns */}
                            <div className="absolute inset-0 grid grid-cols-7 gap-2 z-0">
                                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
                                    <div 
                                        key={`drop-${dayIndex}`}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-white/5'); }}
                                        onDragLeave={(e) => e.currentTarget.classList.remove('bg-white/5')}
                                        onDrop={(e) => { e.currentTarget.classList.remove('bg-white/5'); handleEventDrop(e, dayIndex); }}
                                        className="w-full h-full rounded-2xl transition-colors border border-transparent border-dashed"
                                    />
                                ))}
                            </div>

                            {/* Events Container */}
                            <div className="absolute inset-0 grid grid-cols-7 gap-2 pointer-events-none">
                                {filteredEvents.map(event => {
                                    const topOffset = (event.startHour - 8) * 90;
                                    const heightPixels = event.duration * 90;
                                    const isSelected = selectedEventId === event.id;
                                    const style = EVENT_STYLES[event.type] || EVENT_STYLES.meeting;
                                    const Icon = style.icon;

                                    return (
                                        <div key={event.id} style={{ gridColumnStart: event.dayIndex + 1 }} className="relative pointer-events-none">
                                            <div 
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('eventId', event.id);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                onClick={() => setSelectedEventId(event.id)}
                                                className={`absolute left-0 right-0 rounded-2xl p-3 cursor-pointer pointer-events-auto transition-all duration-300 border backdrop-blur-md ${style.bg} ${style.border} ${isSelected ? `scale-[1.03] z-30 ${style.glow}` : 'hover:scale-[1.03] hover:brightness-125 z-10 hover:shadow-lg'}`}
                                                style={{ top: `${topOffset}px`, height: `${heightPixels - 6}px` }}
                                            >
                                                <div className="flex items-start justify-between gap-1 pointer-events-none">
                                                    <h3 className={`text-xs font-bold leading-snug tracking-wide ${style.text} line-clamp-2`}>{event.title}</h3>
                                                    <Icon className={`w-3.5 h-3.5 shrink-0 opacity-70 ${style.text} ${event.duration <= 0.5 ? 'hidden' : ''}`} />
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 pointer-events-none">
                                                    <p className="text-[10px] font-semibold text-white/60">{event.timeStr}</p>
                                                    {event.platform && (
                                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 ${style.text}`}>{event.platform}</span>
                                                    )}
                                                </div>
                                                
                                                {event.team && event.duration > 0.5 && (
                                                    <div className="absolute bottom-2 left-2 flex -space-x-1.5 pointer-events-none">
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
                                                        className="absolute z-50 w-[320px] bg-[#1A1A24]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] pointer-events-auto"
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
                                    
                                    // Get actual events for this day based on dayIndex and week
                                    // For simplicity in month view, we map event's dayIndex to matching days of the week
                                    const currentDayOfWeek = i % 7;
                                    const dayEvents = dayNum ? filteredEvents.filter(e => e.dayIndex === currentDayOfWeek) : [];
                                    
                                    return (
                                        <div key={i} className={`p-2 rounded-2xl border transition-colors flex flex-col relative ${dayNum ? 'bg-black/20 border-white/5 hover:border-white/20' : 'opacity-20 border-transparent'} ${isToday ? 'ring-2 ring-violet-500/50 bg-violet-500/10' : ''}`}>
                                            {dayNum && <span className={`text-sm font-bold ${isToday ? 'text-violet-400' : 'text-gray-400'}`}>{dayNum}</span>}
                                            {dayNum && dayEvents.length > 0 && (
                                                <div className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto no-scrollbar">
                                                    {dayEvents.map(ev => {
                                                        const style = EVENT_STYLES[ev.type] || EVENT_STYLES.meeting;
                                                        const isHovered = hoveredEventId === `${dayNum}-${ev.id}`;
                                                        return (
                                                            <div 
                                                                key={ev.id}
                                                                onMouseEnter={() => setHoveredEventId(`${dayNum}-${ev.id}`)}
                                                                onMouseLeave={() => setHoveredEventId(null)}
                                                                className={`w-full p-1 rounded-md cursor-pointer truncate text-[9px] font-bold ${style.bg} ${style.text} ${style.border} border`}
                                                            >
                                                                {ev.title}
                                                                
                                                                {/* Hover Popover */}
                                                                <AnimatePresence>
                                                                    {isHovered && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                                            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1A1A24] border border-white/10 p-3 rounded-xl shadow-2xl"
                                                                        >
                                                                            <h4 className="text-white text-xs whitespace-normal leading-tight font-black mb-1">{ev.title}</h4>
                                                                            <p className="text-gray-400 text-[10px] whitespace-normal">{ev.timeStr}</p>
                                                                            {ev.team && (
                                                                                <div className="flex -space-x-1 mt-2">
                                                                                    {ev.team.map(t => <img key={t} src={`https://i.pravatar.cc/150?u=${t}`} className="w-4 h-4 rounded-full border border-black" alt="t"/>)}
                                                                                </div>
                                                                            )}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        )
                                                    })}
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

                {/* Floating Side Panel (Google Keep Style) */}
                <AnimatePresence>
                    {(isNotesOpen || isTasksOpen || isTeamOpen || isMeetPanelOpen) && (
                        <motion.div 
                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                            animate={{ opacity: 1, width: 320, marginLeft: 24 }}
                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                            className="shrink-0 bg-[#1A1A24] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col h-full"
                        >
                            <div className="w-[320px] h-full flex flex-col">
                                {isNotesOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-400" /> Notas
                                            </h3>
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <button className="p-1.5 hover:text-white rounded-md hover:bg-white/10"><Search className="w-4 h-4" /></button>
                                                <button className="p-1.5 hover:text-white rounded-md hover:bg-white/10"><ExternalLink className="w-4 h-4" /></button>
                                                <button onClick={() => setIsNotesOpen(false)} className="p-1.5 hover:text-white rounded-md hover:bg-white/10"><X className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                                            <div className="bg-black/30 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                                                <input 
                                                    type="file" 
                                                    ref={imageInputRef} 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={handleImageUpload} 
                                                />
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Plus className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm font-medium">Toma una nota...</span>
                                                </div>
                                                <textarea 
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    className="w-full bg-transparent text-white text-sm focus:outline-none resize-none h-20" 
                                                    placeholder="Escribe aquí..."
                                                ></textarea>
                                                
                                                {noteImage && (
                                                    <div className="relative rounded-lg overflow-hidden border border-white/10 mb-2 group">
                                                        <img src={noteImage} alt="Uploaded" className="w-full h-auto max-h-40 object-cover" />
                                                        <button 
                                                            onClick={() => setNoteImage(null)}
                                                            className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}

                                                {recordedAudioUrl && (
                                                    <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                                            <Mic className="w-4 h-4 text-indigo-400" />
                                                        </div>
                                                        <audio src={recordedAudioUrl} controls className="h-6 flex-1 filter invert hue-rotate-180 opacity-70" />
                                                        <button 
                                                            onClick={() => setRecordedAudioUrl(null)}
                                                            className="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                                                    <div className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => imageInputRef.current?.click()}
                                                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Adjuntar Imagen"
                                                        >
                                                            <Paperclip className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={isRecordingNote ? stopVoiceNote : startVoiceNote}
                                                            className={`p-1.5 rounded-lg transition-all ${isRecordingNote ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                                                            title="Grabar Nota de Audio"
                                                        >
                                                            <Mic className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button 
                                                        onClick={handleSaveNote}
                                                        className="text-xs bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-lg font-bold hover:bg-blue-500/30 transition-colors"
                                                    >
                                                        Guardar
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {notesList.map(note => (
                                                <div key={note.id} className="bg-black/20 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer group flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-bold text-white mb-1">{note.title}</h4>
                                                        <span className="text-[10px] text-gray-600">{note.date}</span>
                                                    </div>
                                                    
                                                    {note.image && (
                                                        <img src={note.image} alt="Note content" className="w-full h-auto rounded-lg border border-white/10" />
                                                    )}

                                                    {note.audio && (
                                                        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                                                            <Mic className="w-3 h-3 text-indigo-400" />
                                                            <audio src={note.audio} controls className="h-4 flex-1 filter invert hue-rotate-180 opacity-50" />
                                                        </div>
                                                    )}

                                                    {note.content && (
                                                        <p className="text-xs text-gray-400 line-clamp-3">{note.content}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {isTasksOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <CheckSquare className="w-4 h-4 text-amber-400" /> Tareas e IA
                                            </h3>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setIsTasksOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10"><X className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                                            {/* AI Assistant Button */}
                                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col items-center gap-3 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Asistente DIIC IA</span>
                                                </div>
                                                
                                                <button 
                                                    onClick={handleAITaskVoice}
                                                    disabled={isProcessingAI}
                                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isAITasking ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110' : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'} ${isProcessingAI ? 'opacity-50' : ''}`}
                                                >
                                                    {isProcessingAI ? (
                                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Mic className={`w-8 h-8 text-white ${isAITasking ? 'animate-bounce' : ''}`} />
                                                    )}
                                                </button>
                                                
                                                <div className="text-center">
                                                    <p className="text-[11px] text-white font-bold">
                                                        {isAITasking ? "Escuchando..." : isProcessingAI ? "IA Procesando..." : "Cuéntame tus tareas"}
                                                    </p>
                                                    {currentTranscript && (
                                                        <p className="text-[10px] text-indigo-200 mt-2 italic line-clamp-2 px-2 animate-in fade-in">
                                                            "{currentTranscript}"
                                                        </p>
                                                    )}
                                                    {!currentTranscript && (
                                                        <p className="text-[9px] text-gray-500 mt-1 px-4">
                                                            "El lunes a las 2 pm recuérdame..."
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tareas List */}
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Tareas Pendientes</h4>
                                                {tasksList.map(task => (
                                                    <div key={task.id} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors group">
                                                        <button 
                                                            onClick={() => setTasksList(prev => prev.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))}
                                                            className={`w-4 h-4 rounded border mt-0.5 shrink-0 transition-colors flex items-center justify-center ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 hover:border-emerald-400'}`}
                                                        >
                                                            {task.completed && <CheckSquare className="w-3 h-3 text-white" />}
                                                        </button>
                                                        <span className={`text-xs font-medium transition-all ${task.completed ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                                                            {task.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Recordatorios List */}
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Recordatorios</h4>
                                                {remindersList.map(reminder => (
                                                    <div key={reminder.id} className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 hover:border-amber-500/20 transition-all group flex flex-col gap-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3 text-amber-400" />
                                                                <span className="text-[10px] font-black text-amber-500/70 uppercase">{reminder.time}</span>
                                                            </div>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${reminder.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-white leading-tight">
                                                            {reminder.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                        {isTeamOpen && (
                                            <div className="flex flex-col h-full overflow-hidden">
                                                {!chattingWith && !isAddingTeam ? (
                                                    <>
                                                        <div className="p-5 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-transparent">
                                                            <div className="flex flex-col">
                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                    <Users className="w-4 h-4 text-indigo-400" /> Zona Creativa
                                                                </h3>
                                                                <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Centro de Comunicación Estratégica</span>
                                                            </div>
                                                            <button onClick={() => setIsTeamOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                                            <div className="relative">
                                                                <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                                                                    <img src="https://i.pravatar.cc/150?u=Leslie" className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Leslie" />
                                                                </div>
                                                                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0D0D12] shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <h4 className="text-lg font-black text-white uppercase italic tracking-tight">Leslie</h4>
                                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Community Manager • Head of Production</p>
                                                            </div>

                                                            <div className="w-full space-y-3 pt-4">
                                                                <button 
                                                                    onClick={() => {
                                                                        setChattingWith({ name: 'Leslie', role: 'Community Manager' });
                                                                        setChatMessages([{ id: 1, sender: 'Leslie', text: "¡Hola! Bienvenido a la Zona Creativa. Soy Leslie, tu punto de contacto central. ¿En qué puedo ayudarte hoy?", time: '10:00 AM' }]);
                                                                    }}
                                                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/50 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] group transform hover:-translate-y-1"
                                                                >
                                                                    <MessageCircle className="w-5 h-5 text-white group-hover:animate-bounce" />
                                                                    <span className="text-xs font-black text-white uppercase tracking-widest">Chat Zona Creativa</span>
                                                                </button>

                                                                <button 
                                                                    onClick={() => setIsAddingTeam(true)}
                                                                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all group"
                                                                >
                                                                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                                                    <span className="text-xs font-black text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">Añadir Equipo Propio</span>
                                                                </button>
                                                                
                                                                <p className="text-[9px] text-gray-600 font-medium px-6">
                                                                    Coordina con tu CM o vincula a tu propio equipo de producción para maximizar resultados.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : isAddingTeam ? (
                                                    <>
                                                        {/* Add Team View */}
                                                        <div className="p-5 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
                                                            <div className="flex items-center gap-3">
                                                                <button onClick={() => setIsAddingTeam(false)} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                                    <ChevronLeft className="w-4 h-4" />
                                                                </button>
                                                                <div className="flex flex-col">
                                                                    <h3 className="text-sm font-bold text-white uppercase italic">Vincular Equipo</h3>
                                                                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Conexión de Talento</span>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => setIsTeamOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-8">
                                                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                                <Users className="w-10 h-10 text-emerald-500" />
                                                            </div>
                                                            
                                                            <div className="space-y-3">
                                                                <h4 className="text-xl font-black text-white uppercase tracking-tight">Activar Nodo de Talento</h4>
                                                                <p className="text-xs text-gray-500 leading-relaxed px-4">
                                                                    Ingresa el código único para conectar a tu Filmmaker, Editor y Diseñador a la plataforma DIIC ZONE.
                                                                </p>
                                                            </div>

                                                            <div className="w-full space-y-4 pt-4">
                                                                <div className="relative group">
                                                                    <div className="absolute inset-0 bg-emerald-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                                                    <input 
                                                                        type="text"
                                                                        value={teamCode}
                                                                        onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                                                                        placeholder="INGRESA TU CÓDIGO"
                                                                        className="relative w-full bg-black/40 border-2 border-white/5 focus:border-emerald-500/50 rounded-2xl px-6 py-5 text-center text-xl font-black tracking-[0.5em] text-emerald-400 placeholder:text-gray-800 transition-all focus:outline-none"
                                                                    />
                                                                </div>

                                                                <button 
                                                                    onClick={() => {
                                                                        if (teamCode.length > 4) {
                                                                            toast.success("Sincronizando equipo de producción...", { icon: '⚡' });
                                                                            setTimeout(() => {
                                                                                toast.success("¡Equipo vinculado correctamente!");
                                                                                setIsAddingTeam(false);
                                                                            }, 2000);
                                                                        } else {
                                                                            toast.error("Código inválido o incompleto");
                                                                        }
                                                                    }}
                                                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/50 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] group"
                                                                >
                                                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                                                    <span className="text-xs font-black text-white uppercase tracking-widest">Sincronizar Talento</span>
                                                                </button>

                                                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">DIIC SECURITY PROTOCOL 2.4</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Chat Interface (Simplified) */}
                                                        <div className="p-5 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-transparent">
                                                            <div className="flex items-center gap-3">
                                                                <button onClick={() => setChattingWith(null)} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                                    <ChevronLeft className="w-4 h-4" />
                                                                </button>
                                                                <div className="flex items-center gap-2">
                                                                    <img src={`https://i.pravatar.cc/150?u=Leslie`} className="w-8 h-8 rounded-xl border border-white/10" alt="Leslie" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs font-black text-white leading-none uppercase italic">Leslie</span>
                                                                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Chat Activo</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => setIsTeamOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                                                            {chatMessages.map(msg => (
                                                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                                                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                                                                        msg.sender === 'Me' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                                                                    }`}>
                                                                        {msg.text}
                                                                    </div>
                                                                    <span className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-widest">{msg.time}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="p-4 border-t border-white/5 bg-black/20">
                                                            <div className="relative flex items-center gap-2">
                                                                    <input 
                                                                        type="text"
                                                                        value={currentChatMessage}
                                                                        onChange={(e) => setCurrentChatMessage(e.target.value)}
                                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                                        placeholder="Escribe un mensaje para Leslie..."
                                                                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                                                    />
                                                                    <button onClick={handleSendMessage} className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                                                                        <ChevronRight className="w-4 h-4" />
                                                                    </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="p-3 border-t border-white/5 bg-black/40 mt-auto">
                                                    <p className="text-[8px] text-center text-gray-700 font-black uppercase tracking-[0.3em]">DIIC ZONE • ZONA CREATIVA V3.0</p>
                                                </div>
                                            </div>
                                        )}

                                {isMeetPanelOpen && (
                                    <>
                                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Video className="w-4 h-4 text-indigo-400" /> DIIC Meet
                                            </h3>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setIsMeetPanelOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10"><X className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                                            <div className="text-xs text-gray-400 text-center mb-6 mt-2">
                                                Conecta con tu equipo y organiza tus proyectos en tiempo real.
                                            </div>

                                            <button 
                                                className="w-full bg-[#232332] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 rounded-xl p-4 flex flex-col items-center gap-3 transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-bold text-white text-center">Programar una reunión para más tarde</span>
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    setIsMeetPanelOpen(false);
                                                    setMeetState('in-call');
                                                    setIsMeetOpen(true);
                                                }}
                                                className="w-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 rounded-xl p-4 flex flex-col items-center gap-3 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] group transform hover:-translate-y-1"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-bold text-white text-center">Iniciar una reunión instantánea</span>
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    setIsSyncing(true);
                                                    setTimeout(() => {
                                                        setIsSyncing(false);
                                                        toast.success("Redirigiendo a Google Calendar...");
                                                    }, 1500);
                                                }}
                                                className="w-full bg-[#232332] hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-xl p-4 flex flex-col items-center gap-3 transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <span className="text-sm font-bold text-white text-center">Programar en Google Calendar</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar Apps (Right) - Centered & Aligned */}
                <div className="w-16 shrink-0 bg-black/40 backdrop-blur-2xl rounded-[32px] flex flex-col items-center justify-center py-8 gap-6 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] overflow-hidden ml-6 self-start mt-10">
                    <button 
                        onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => {
                                setIsSyncing(false);
                                toast.success("Google Calendar Sincronizado Correctamente", { id: 'gcal-sync' });
                            }, 2000);
                            toast.loading("Sincronizando con Google Calendar...", { id: 'gcal-sync' });
                        }} 
                        className="p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors group relative" 
                        title="Google Calendar Sync"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className={`w-6 h-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all ${isSyncing ? 'animate-spin' : ''}`} alt="Google Calendar" />
                    </button>
                    <div className="w-8 h-px bg-white/10" />
                    
                    <button onClick={() => { setIsNotesOpen(!isNotesOpen); setIsTasksOpen(false); setIsTeamOpen(false); setIsMeetPanelOpen(false); }} className={`p-2.5 rounded-full transition-colors group ${isNotesOpen ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-blue-500/20 text-blue-400 hover:text-blue-300'}`} title="Notas">
                        <FileText className="w-6 h-6 group-hover:scale-110 transition-all" />
                    </button>
                    <button onClick={() => { setIsTasksOpen(!isTasksOpen); setIsNotesOpen(false); setIsTeamOpen(false); setIsMeetPanelOpen(false); }} className={`p-2.5 rounded-full transition-colors group ${isTasksOpen ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-amber-500/20 text-amber-400 hover:text-amber-300'}`} title="Tareas">
                        <CheckSquare className="w-6 h-6 group-hover:scale-110 transition-all" />
                    </button>
                    <button onClick={() => { setIsTeamOpen(!isTeamOpen); setIsNotesOpen(false); setIsTasksOpen(false); setIsMeetPanelOpen(false); }} className={`p-2.5 rounded-full transition-colors group ${isTeamOpen ? 'bg-pink-500/20 text-pink-300' : 'hover:bg-pink-500/20 text-pink-400 hover:text-pink-300'}`} title="Equipo Designado">
                        <Users className="w-6 h-6 group-hover:scale-110 transition-all" />
                    </button>
                    <button onClick={() => { setIsMeetPanelOpen(!isMeetPanelOpen); setIsNotesOpen(false); setIsTasksOpen(false); setIsTeamOpen(false); }} className={`p-2.5 rounded-full transition-colors group ${isMeetPanelOpen ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300'}`} title="Reuniones">
                        <Video className="w-6 h-6 group-hover:scale-110 transition-all" />
                    </button>
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

                            <div className="p-6 bg-black/20 border-t border-white/5 flex flex-col gap-3">
                                <button onClick={() => {
                                    toast.success("Enviando partes importantes por WhatsApp...");
                                }} className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                    Enviar partes importantes de la reunión por WhatsApp
                                </button>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsScheduling(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-gray-400 hover:bg-white/5 transition-colors">
                                        Cancelar
                                    </button>
                                    <button onClick={() => setIsScheduling(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
                                        Guardar Evento
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>



            {/* Meet Modal */}
            <AnimatePresence>
                {isMeetOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#1A1A24] border border-white/10 rounded-[32px] w-full max-w-4xl h-[80vh] min-h-[600px] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative">
                            
                            {/* Header (hidden in-call) */}
                            {meetState !== 'in-call' && (
                                <div className="p-6 flex items-center justify-between">
                                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                                            <Video className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        DIIC Meet
                                    </h2>
                                    <button onClick={() => { setIsMeetOpen(false); setMeetState('lobby'); }} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            )}

                            {/* State: Lobby */}
                            {meetState === 'lobby' && (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                                    <Video className="w-20 h-20 text-indigo-400 mb-8 opacity-80" />
                                    <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Videollamadas y reuniones<br/>para el equipo</h2>
                                    <p className="text-gray-400 mb-12 max-w-md mx-auto text-lg leading-relaxed">Conecta, colabora y crea desde cualquier lugar de forma segura con DIIC Meet.</p>
                                    
                                    <div className="flex items-center justify-center gap-4 w-full max-w-lg mx-auto">
                                        <button onClick={() => setMeetState('in-call')} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] transform hover:scale-105">
                                            <Video className="w-5 h-5" /> Nueva reunión
                                        </button>
                                        <div className="flex-1 relative">
                                            <input type="text" placeholder="Ingresa un código o enlace" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* State: In Call */}
                            {meetState === 'in-call' && (
                                <div className="flex-1 bg-black/60 relative overflow-hidden flex p-4 gap-4 animate-in fade-in duration-300 rounded-[32px]">
                                    {/* Left Column */}
                                    <div className="w-1/3 flex flex-col gap-4">
                                        {/* Top 2 feeds */}
                                        <div className="grid grid-cols-2 gap-4 h-40 shrink-0">
                                            <div className="bg-[#1A1A24] rounded-[24px] overflow-hidden relative border border-white/10 shadow-lg">
                                                <img src="https://i.pravatar.cc/300?u=q" className="w-full h-full object-cover opacity-80" alt="participant" />
                                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-white drop-shadow-md">Jacqueline Ho</span>
                                                    <MicOff className="w-3 h-3 text-red-400 drop-shadow-md" />
                                                </div>
                                            </div>
                                            <div className="bg-[#1A1A24] rounded-[24px] overflow-hidden relative border border-white/10 shadow-lg">
                                                <img src="https://i.pravatar.cc/300?u=a" className="w-full h-full object-cover opacity-80" alt="participant" />
                                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-white drop-shadow-md">Jan Cook</span>
                                                    <Mic className="w-3 h-3 text-white drop-shadow-md" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Middle 2 widgets */}
                                        <div className="grid grid-cols-2 gap-4 h-40 shrink-0">
                                            <div className="bg-[#1A1A24] rounded-[24px] overflow-hidden relative border border-white/10 shadow-lg">
                                                <img src="https://i.pravatar.cc/300?u=b" className="w-full h-full object-cover opacity-80" alt="participant" />
                                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-white drop-shadow-md">Alberto Brooks</span>
                                                    <MicOff className="w-3 h-3 text-red-400 drop-shadow-md" />
                                                </div>
                                            </div>
                                            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] border border-white/10 shadow-lg flex flex-col items-center justify-center p-4">
                                                <div className="flex -space-x-3 mb-3">
                                                    <img src="https://i.pravatar.cc/150?u=1" className="w-10 h-10 rounded-full border-2 border-[#1A1A24] shadow-md" alt="team" />
                                                    <img src="https://i.pravatar.cc/150?u=2" className="w-10 h-10 rounded-full border-2 border-[#1A1A24] shadow-md" alt="team" />
                                                    <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#1A1A24] flex items-center justify-center text-xs font-bold text-white shadow-md">+24</div>
                                                </div>
                                                <span className="text-xs font-bold text-white">Equipo conectado</span>
                                            </div>
                                        </div>

                                        {/* Daily Task Widget */}
                                        <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl rounded-[24px] border border-white/10 p-5 shadow-lg flex flex-col overflow-hidden">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tareas de Hoy</h3>
                                                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                                    {meetTasks.filter(t => t.completed).length}/{meetTasks.length}
                                                </span>
                                            </div>
                                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mb-3">
                                                {meetTasks.map(task => (
                                                    <div key={task.id} className={`flex items-start gap-3 transition-opacity ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
                                                        <button 
                                                            onClick={() => setMeetTasks(tasks => tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                                                            className={`w-4 h-4 shrink-0 rounded flex items-center justify-center mt-0.5 transition-colors ${task.completed ? 'bg-emerald-500/20 border border-emerald-500' : 'border border-gray-500 hover:border-emerald-400'}`}
                                                        >
                                                            {task.completed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                                        </button>
                                                        <span className={`text-[11px] font-medium leading-tight ${task.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>
                                                            {task.text}
                                                        </span>
                                                        <button 
                                                            onClick={() => setMeetTasks(tasks => tasks.filter(t => t.id !== task.id))}
                                                            className="ml-auto opacity-0 hover:opacity-100 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-auto relative">
                                                <input 
                                                    type="text" 
                                                    value={newTaskText}
                                                    onChange={(e) => setNewTaskText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && newTaskText.trim()) {
                                                            setMeetTasks([...meetTasks, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
                                                            setNewTaskText("");
                                                        }
                                                    }}
                                                    placeholder="Agregar nueva tarea..." 
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-500"
                                                />
                                                <button 
                                                    onClick={() => {
                                                        if (newTaskText.trim()) {
                                                            setMeetTasks([...meetTasks, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
                                                            setNewTaskText("");
                                                        }
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column (Main View) */}
                                    <div className="w-2/3 flex flex-col gap-4">
                                        {/* Main Video */}
                                        <div className="flex-1 bg-[#1A1A24] rounded-[24px] overflow-hidden relative border border-white/10 shadow-2xl group">
                                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="main view" />
                                            
                                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/10">DIIC Meet Interno</div>
                                            
                                            <div className="absolute bottom-6 left-6 text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Tú (Organizador)</div>
                                            
                                            {/* Hovering Controls */}
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-2xl p-2.5 rounded-2xl border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button title="Micrófono" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Mic className="w-4 h-4 text-white" /></button>
                                                <button title="Cámara" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Video className="w-4 h-4 text-white" /></button>
                                                <button title="Compartir Pantalla" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><MonitorUp className="w-4 h-4 text-white" /></button>
                                                <button title="Activar Subtítulos" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><FileText className="w-4 h-4 text-white" /></button>
                                                <button title="Finalizar Llamada" onClick={() => setMeetState('post-call')} className="w-14 h-10 rounded-xl bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors shadow-lg shadow-red-500/20"><PhoneOff className="w-4 h-4 text-white" /></button>
                                            </div>
                                            
                                            {/* Side tools */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-black/60 backdrop-blur-2xl p-2 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                <button title="Compartir Link de Invitación" onClick={() => toast.success("¡Enlace de reunión copiado al portapapeles!")} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"><LinkIcon className="w-4 h-4 text-white" /></button>
                                                <button title="Enviar Reacción" className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"><Star className="w-4 h-4 text-white" /></button>
                                                <button title="Participantes" className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"><Users className="w-4 h-4 text-white" /></button>
                                                <button title="Más Opciones" className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"><MoreHorizontal className="w-4 h-4 text-white" /></button>
                                            </div>
                                        </div>

                                        {/* Transcription/Chat Widget */}
                                        <div className="h-32 shrink-0 bg-white/[0.03] backdrop-blur-2xl rounded-[24px] border border-white/10 p-5 shadow-lg flex flex-col relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
                                            
                                            {!isTypingChat ? (
                                                <div className="flex items-center gap-5 h-full cursor-pointer" onClick={() => setIsTypingChat(true)}>
                                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                        {/* Audio Waveform Simulation */}
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                                            <div className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                                            <div className="w-1 h-8 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                            <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                                            <div className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 relative z-10">
                                                        <p className="text-xs text-gray-300 font-medium leading-relaxed group-hover:text-white transition-colors">
                                                            "{meetChat}"
                                                        </p>
                                                        <div className="absolute -bottom-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Edit2 className="w-3 h-3" /> Clic para editar</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col h-full gap-2 relative z-10">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Anotar transcripción/comentario</span>
                                                        <button onClick={() => setIsTypingChat(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                                                    </div>
                                                    <textarea 
                                                        value={newChatText || meetChat}
                                                        onChange={(e) => setNewChatText(e.target.value)}
                                                        autoFocus
                                                        className="flex-1 bg-black/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none custom-scrollbar"
                                                    />
                                                    <div className="flex justify-end">
                                                        <button 
                                                            onClick={() => {
                                                                if (newChatText.trim()) setMeetChat(newChatText.trim());
                                                                setIsTypingChat(false);
                                                            }}
                                                            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            Guardar Nota
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* State: Post Call */}
                            {meetState === 'post-call' && (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in slide-in-from-bottom-8 fade-in duration-500">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-6">Reunión finalizada</h2>
                                    <p className="text-gray-400 mb-12 max-w-md mx-auto text-lg">La videollamada ha concluido. Para asegurar la retención, envía un resumen de lo acordado a los participantes.</p>
                                    
                                    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                                        <button onClick={() => {
                                            toast.success("¡Resumen enviado por WhatsApp al equipo exitosamente!");
                                            setMeetState('lobby');
                                            setIsMeetOpen(false);
                                        }} className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3 transform hover:scale-105">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                            Enviar partes importantes por WhatsApp
                                        </button>
                                        <button onClick={() => {
                                            setMeetState('lobby');
                                            setIsMeetOpen(false);
                                        }} className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                            Volver al inicio
                                        </button>
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
