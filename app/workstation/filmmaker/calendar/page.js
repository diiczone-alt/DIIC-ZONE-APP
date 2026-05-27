'use client';

import { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Clock,
    User, Camera, MoreVertical, CheckCircle,
    XCircle, RefreshCw, ChevronLeft, ChevronRight, Loader2, X, FileText, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Helpers
const getRelativeDayName = (dateStr) => {
    if (!dateStr) return '--';
    try {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const [year, month, day] = dateStr.split('-');
        const targetDate = new Date(year, month - 1, day);
        targetDate.setHours(0,0,0,0);
        
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Mañana';
        if (diffDays === -1) return 'Ayer';
        
        return targetDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
    } catch (e) {
        return dateStr;
    }
};

const parseNotes = (notes) => {
    if (!notes) return { location: 'No especificada', contact: 'No especificado' };
    const parts = notes.split(' | Contacto: ');
    if (parts.length === 2) {
        const loc = parts[0].replace('Ubicación: ', '');
        const con = parts[1];
        return { location: loc, contact: con };
    }
    return { location: notes, contact: 'No especificado' };
};

const parseAssets = (assets) => {
    const defaultVal = {
        equipment: [],
        script_url: '',
        materials_url: '',
        description: '',
        script_blocks: []
    };
    if (!assets) return defaultVal;
    if (Array.isArray(assets)) {
        return { ...defaultVal, equipment: assets };
    }
    if (typeof assets === 'object') {
        return {
            equipment: Array.isArray(assets.equipment) ? assets.equipment : [],
            script_url: assets.script_url || '',
            materials_url: assets.materials_url || '',
            description: assets.description || '',
            script_blocks: Array.isArray(assets.script_blocks) ? assets.script_blocks : []
        };
    }
    return defaultVal;
};

const getSocialLinkStyle = (url) => {
    if (!url) return { label: 'Visitar Sitio Web', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    )};
    const urlLower = url.toLowerCase();
    if (urlLower.includes('instagram.com')) {
        return {
            label: 'Instagram Oficial',
            color: 'text-pink-400 bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            )
        };
    }
    if (urlLower.includes('facebook.com')) {
        return {
            label: 'Facebook Oficial',
            color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            )
        };
    }
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
        return {
            label: 'Canal de YouTube',
            color: 'text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            )
        };
    }
    return {
        label: 'Sitio Web Oficial',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        )
    };
};

const COLUMNS = [
    { id: 'pre-pro', label: 'Pre-Pro', color: 'border-cyan-500', bg: 'bg-cyan-500/5' },
    { id: 'shooting', label: 'En Rodaje', color: 'border-rose-500', bg: 'bg-rose-500/5' },
    { id: 'post-pro', label: 'Edición', color: 'border-fuchsia-500', bg: 'bg-fuchsia-500/5' },
    { id: 'review', label: 'Revisión', color: 'border-yellow-500', bg: 'bg-yellow-500/5' },
    { id: 'done', label: 'Finalizado', color: 'border-lime-500', bg: 'bg-lime-500/5' }
];

const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

export default function FilmmakerCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animatingConfirmId, setAnimatingConfirmId] = useState(null);
    
    // Calendar Navigation State (defaults to Feb 2026 to match screenshot context, but dynamic)
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); 
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [dailyNotes, setDailyNotes] = useState({});
    const [dailyTasks, setDailyTasks] = useState({});
    
    // Reagenda Modal State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showReagendaModal, setShowReagendaModal] = useState(false);
    const [reagendaDate, setReagendaDate] = useState('');
    const [reagendaStartTime, setReagendaStartTime] = useState('');
    const [reagendaEndTime, setReagendaEndTime] = useState('');
    const [reagendaDescription, setReagendaDescription] = useState('');
    const [reagendaScriptUrl, setReagendaScriptUrl] = useState('');
    const [reagendaMaterialsUrl, setReagendaMaterialsUrl] = useState('');

    // Script Modal State
    const [selectedScriptEvent, setSelectedScriptEvent] = useState(null);
    const [showScriptModal, setShowScriptModal] = useState(false);

    // Client Profile Modal State
    const [selectedClient, setSelectedClient] = useState(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [loadingClient, setLoadingClient] = useState(false);

    // Load notes and tasks from localStorage on mount
    useEffect(() => {
        const storedNotes = localStorage.getItem('filmmaker_daily_notes');
        if (storedNotes) {
            try {
                setDailyNotes(JSON.parse(storedNotes));
            } catch (e) {
                console.error('Error parsing daily notes:', e);
            }
        }
        const storedTasks = localStorage.getItem('filmmaker_daily_tasks');
        if (storedTasks) {
            try {
                setDailyTasks(JSON.parse(storedTasks));
            } catch (e) {
                console.error('Error parsing daily tasks:', e);
            }
        }
    }, []);

    const saveDailyNote = (dateStr, text) => {
        const updated = {
            ...dailyNotes,
            [dateStr]: text
        };
        setDailyNotes(updated);
        localStorage.setItem('filmmaker_daily_notes', JSON.stringify(updated));
    };

    const toggleDailyTask = (dateStr, taskIdx) => {
        const dayTasks = dailyTasks[dateStr] || [];
        const updatedDayTasks = dayTasks.map((t, idx) => 
            idx === taskIdx ? { ...t, completed: !t.completed } : t
        );
        const updated = {
            ...dailyTasks,
            [dateStr]: updatedDayTasks
        };
        setDailyTasks(updated);
        localStorage.setItem('filmmaker_daily_tasks', JSON.stringify(updated));
    };

    const addDailyTask = (dateStr, text) => {
        if (!text.trim()) return;
        const dayTasks = dailyTasks[dateStr] || [];
        const updatedDayTasks = [...dayTasks, { text: text.trim(), completed: false }];
        const updated = {
            ...dailyTasks,
            [dateStr]: updatedDayTasks
        };
        setDailyTasks(updated);
        localStorage.setItem('filmmaker_daily_tasks', JSON.stringify(updated));
    };

    const removeDailyTask = (dateStr, taskIdx) => {
        const dayTasks = dailyTasks[dateStr] || [];
        const updatedDayTasks = dayTasks.filter((_, idx) => idx !== taskIdx);
        const updated = {
            ...dailyTasks,
            [dateStr]: updatedDayTasks
        };
        setDailyTasks(updated);
        localStorage.setItem('filmmaker_daily_tasks', JSON.stringify(updated));
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .or('assigned_role.eq.FILMMAKER,title.ilike.%Rodaje%');
                
            if (error) throw error;
            
            let loadedEvents = data || [];

            // Clean up old mocks if script_blocks is missing
            const needsRefresh = loadedEvents.some(e => e.client === 'Hospital Novaclinica Santa Anita' && !parseAssets(e.assets).script_blocks?.length);
            if (needsRefresh) {
                console.log('[Calendar] Refreshing mock events to include script blocks...');
                const idsToDelete = loadedEvents
                    .filter(e => e.client === 'Hospital Novaclinica Santa Anita' || e.client === 'Vito\'s Pizza' || e.client === 'Servicios Agropecurios Ecuador')
                    .map(m => m.id);
                if (idsToDelete.length > 0) {
                    await supabase.from('tasks').delete().in('id', idsToDelete);
                    // Reload
                    const { data: refreshedData } = await supabase
                        .from('tasks')
                        .select('*')
                        .or('assigned_role.eq.FILMMAKER,title.ilike.%Rodaje%');
                    loadedEvents = refreshedData || [];
                }
            }
            
            // Auto-seed mock events in database using REAL clients from HQ with detailed script_blocks
            if (loadedEvents.length === 0) {
                console.log('[Calendar] Seeding filmmaker mock events with real clients and script blocks...');
                const seedTasks = [
                    {
                        title: 'Rodaje: Video Institucional Novaclínica',
                        client: 'Hospital Novaclinica Santa Anita',
                        deadline: '2026-02-15', 
                        duration: '14:00 - 18:00',
                        assigned_role: 'FILMMAKER',
                        status: 'confirmed',
                        notes: 'Ubicación: Hospital Novaclínica - Sector Santa Anita | Contacto: Dra. Jessica Rey Uro',
                        assets: {
                            equipment: ['Sony FX3', 'Lente 24-70mm', 'Trípode Sachtler', 'Kit Luces Aputure'],
                            script_url: 'https://docs.google.com/document/d/1XyZ2Y7g...',
                            materials_url: 'https://drive.google.com/drive/folders/1Y8Z...',
                            description: 'Video de presentación para redes sociales sobre la infraestructura de la clínica.',
                            script_blocks: [
                                { scene: 'ESCENA 1 - GANCHO', time: '0-5s', text: 'En Novaclínica, tu salud es lo primero. Conoce nuestras nuevas instalaciones equipadas con tecnología de última generación.', visual: 'Tomas del cartel del hospital, planos amplios y limpios de la recepción con luz suave.' },
                                { scene: 'ESCENA 2 - PROCESO', time: '5-15s', text: 'Nuestros quirófanos y salas de recuperación cuentan con estándares internacionales para asegurar tu bienestar y tranquilidad.', visual: 'Plano detallado de los equipos modernos del quirófano. Un doctor explicando.' },
                                { scene: 'ESCENA 3 - CTA', time: '15-20s', text: 'Agenda tu consulta de valoración hoy mismo con la Dra. Jessica Rey Uro y da el primer paso hacia una vida más saludable.', visual: 'Dra. Jessica sonriendo a cámara, logo del hospital en pantalla con contacto.' }
                            ]
                        },
                        priority: 'high'
                    },
                    {
                        title: 'Rodaje: Reels Promocionales Vito\'s',
                        client: 'Vito\'s Pizza',
                        deadline: '2026-02-16', 
                        duration: '09:00 - 13:00',
                        assigned_role: 'FILMMAKER',
                        status: 'pending',
                        notes: 'Ubicación: Vito\'s Pizza Local Centro | Contacto: Administración Vito\'s',
                        assets: {
                            equipment: ['Sony FX3', 'Lente 16-35mm', 'Gimbal DJI Ronin RS3', 'Micrófono Inalámbrico'],
                            script_url: 'https://docs.google.com/document/d/1Z...',
                            materials_url: 'https://drive.google.com/drive/folders/2A...',
                            description: 'Producción de 3 reels cortos sobre la preparación de pizzas al horno de leña.',
                            script_blocks: [
                                { scene: 'ESCENA 1 - GANCHO', time: '0-3s', text: '¿Sabes qué hace que una pizza sea verdaderamente napolitana? Mira este horneado...', visual: 'Primer plano a cámara súper lenta de la masa inflándose dentro del horno de leña, fuego brillante de fondo.' },
                                { scene: 'ESCENA 2 - CALIDAD', time: '3-12s', text: 'En Vito\'s Pizza, estiramos la masa a mano y usamos mozzarella fresca y tomates San Marzano importados.', visual: 'El pizzero estirando la masa con destreza, luego colocando salsa y albahaca fresca con movimientos rápidos.' },
                                { scene: 'ESCENA 3 - CTA', time: '12-15s', text: 'Haz clic abajo para ver el menú y pedir tu favorita hoy. ¡Te esperamos!', visual: 'Plano de la pizza saliendo caliente del horno, cortándose con crujido y mostrando el queso derretido.' }
                            ]
                        },
                        priority: 'medium'
                    },
                    {
                        title: 'Rodaje: Campaña Campo Servicios Agropecuarios',
                        client: 'Servicios Agropecurios Ecuador',
                        deadline: '2026-02-18', 
                        duration: '08:00 - 15:00',
                        assigned_role: 'FILMMAKER',
                        status: 'pending',
                        notes: 'Ubicación: Finca Agropecuaria Santo Domingo | Contacto: Ing. Agropecuario',
                        assets: {
                            equipment: ['Sony FX3', 'Drone DJI Mavic 3 Pro', 'Lente 70-200mm', 'Filtros ND'],
                            script_url: 'https://docs.google.com/document/d/3B...',
                            materials_url: 'https://drive.google.com/drive/folders/3C...',
                            description: 'Tomas de apoyo en exteriores y tomas con drone para campaña de posicionamiento.',
                            script_blocks: [
                                { scene: 'ESCENA 1 - GANCHO', time: '0-4s', text: 'El éxito de tu cosecha comienza desde el primer día con la preparación correcta del suelo.', visual: 'Toma aérea en plano general del campo verde con el drone, el sol saliendo de fondo.' },
                                { scene: 'ESCENA 2 - PROCESO', time: '4-12s', text: 'En Servicios Agropecuarios Ecuador te acompañamos con asesoría experta y fertilizantes de alta tecnología.', visual: 'Toma a nivel de suelo del ingeniero agropecuario revisando el cultivo con un agricultor local.' },
                                { scene: 'ESCENA 3 - CTA', time: '12-15s', text: 'Contáctanos ahora y maximiza el rendimiento de tu campo hoy.', visual: 'Información de contacto en pantalla, logo de la marca sobre campo cosechado.' }
                            ]
                        },
                        priority: 'high'
                    }
                ];
                
                const { data: insertedData, error: insertErr } = await supabase
                    .from('tasks')
                    .insert(seedTasks)
                    .select();
                    
                if (!insertErr && insertedData) {
                    loadedEvents = insertedData;
                } else {
                    console.warn('[Calendar] Seeding failed:', insertErr);
                }
            }
            
            setEvents(loadedEvents);
        } catch (err) {
            console.error('[Calendar] Fetch error:', err);
            toast.error('Error al cargar la agenda de rodajes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleConfirm = async (id) => {
        try {
            setAnimatingConfirmId(id);
            const { error } = await supabase
                .from('tasks')
                .update({ status: 'confirmed' })
                .eq('id', id);
                
            if (error) throw error;
            
            // Allow animation to play fully before updating state
            setTimeout(() => {
                setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'confirmed' } : e));
                setAnimatingConfirmId(null);
                toast.success('¡Rodaje confirmado, aceptado y en proceso!');
            }, 1200);
        } catch (err) {
            console.error('[Calendar] Confirm error:', err);
            setAnimatingConfirmId(null);
            toast.error('No se pudo confirmar el rodaje.');
        }
    };

    const handleCancel = async (id) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: 'cancelled' })
                .eq('id', id);
                
            if (error) throw error;
            
            toast.error('Rodaje cancelado.');
            setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'cancelled' } : e));
        } catch (err) {
            console.error('[Calendar] Cancel error:', err);
            toast.error('No se pudo cancelar el rodaje.');
        }
    };

    const openReagendaModal = (event) => {
        setSelectedEvent(event);
        setReagendaDate(event.deadline || '');
        if (event.duration) {
            const times = event.duration.split(' - ');
            setReagendaStartTime(times[0] || '12:00');
            setReagendaEndTime(times[1] || '16:00');
        } else {
            setReagendaStartTime('12:00');
            setReagendaEndTime('16:00');
        }

        const assetsData = parseAssets(event.assets);
        setReagendaDescription(assetsData.description);
        setReagendaScriptUrl(assetsData.script_url);
        setReagendaMaterialsUrl(assetsData.materials_url);

        setShowReagendaModal(true);
    };

    const saveReagenda = async () => {
        if (!reagendaDate || !reagendaStartTime || !reagendaEndTime) {
            toast.error('Por favor completa todos los campos de fecha y hora.');
            return;
        }
        
        try {
            const durationStr = `${reagendaStartTime} - ${reagendaEndTime}`;
            const updatedAssets = {
                equipment: selectedEvent.assets?.equipment || (Array.isArray(selectedEvent.assets) ? selectedEvent.assets : []),
                script_url: reagendaScriptUrl,
                materials_url: reagendaMaterialsUrl,
                description: reagendaDescription,
                script_blocks: selectedEvent.assets?.script_blocks || []
            };

            const { error } = await supabase
                .from('tasks')
                .update({
                    deadline: reagendaDate,
                    duration: durationStr,
                    assets: updatedAssets
                })
                .eq('id', selectedEvent.id);
                
            if (error) throw error;
            
            toast.success('Rodaje actualizado correctamente.');
            setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { 
                ...e, 
                deadline: reagendaDate, 
                duration: durationStr,
                assets: updatedAssets
            } : e));
            setShowReagendaModal(false);
        } catch (err) {
            console.error('[Calendar] Reagenda error:', err);
            toast.error('No se pudo reagendar el rodaje.');
        }
    };

    const openClientProfile = async (clientName) => {
        try {
            setLoadingClient(true);
            
            // Clean up name for robust matching (e.g. remove quotes, backticks, or trailing spaces)
            const cleanSearchName = clientName.replace(/['’`´]/g, '').trim();
            
            // Get the first significant word (ignoring short titles/particles)
            let firstWord = '';
            const words = clientName.split(/[\s'’`´.-]+/);
            for (const w of words) {
                const lowerW = w.toLowerCase();
                if (lowerW && lowerW !== 'dra' && lowerW !== 'dr' && lowerW !== 'ing' && lowerW !== 'lic' && lowerW !== 'sr' && lowerW !== 'sra') {
                    firstWord = w;
                    break;
                }
            }
            if (!firstWord && words[0]) {
                firstWord = words[0];
            }
            
            console.log(`[Calendar] Searching client with name: "${clientName}", cleanSearchName: "${cleanSearchName}", firstWord: "${firstWord}"`);
            
            // 1. Try exact or fuzzy match on the full name
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .or(`name.ilike.%${clientName}%,name.ilike.%${cleanSearchName}%`)
                .maybeSingle();
                
            if (error) throw error;
            
            let clientData = data;
            
            // 2. If not found, try fallback fuzzy matching on the first significant word
            if (!clientData && firstWord) {
                const { data: fallbackData } = await supabase
                    .from('clients')
                    .select('*')
                    .or(`name.ilike.%${firstWord}%,slug.ilike.%${firstWord}%`)
                    .limit(1);
                
                if (fallbackData && fallbackData[0]) {
                    clientData = fallbackData[0];
                }
            }
            
            if (clientData) {
                setSelectedClient(clientData);
            } else {
                // Self-healing fallback object in memory
                setSelectedClient({
                    name: clientName,
                    email: 'No disponible',
                    whatsapp_number: '',
                    notes: 'Este cliente no posee notas o datos adicionales de onboarding aún.',
                    onboarding_data: {
                        strategic: {
                            brandName: clientName,
                            whatItDoes: 'Empresa / socio del portafolio creativo de Zona Creativa.',
                            valueProp: 'Brindar soluciones integrales e innovadoras.',
                            tone: 'Profesional y Educativo',
                            targetAudience: 'Público general',
                            mainGoal: 'Posicionamiento y crecimiento de marca.'
                        }
                    }
                });
            }
            setShowClientModal(true);
        } catch (err) {
            console.error('[Calendar] Error opening client profile:', err);
            toast.error('No se pudo cargar el perfil del cliente.');
        } finally {
            setLoadingClient(false);
        }
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() - 1);
            return d;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() + 1);
            return d;
        });
    };

    // Filter events belonging to current active month view
    const filteredEvents = events.filter(event => {
        if (!event.deadline) return false;
        const [year, month, day] = event.deadline.split('-');
        const eventDate = new Date(year, month - 1, day);
        return eventDate.getMonth() === currentMonth.getMonth() && 
               eventDate.getFullYear() === currentMonth.getFullYear();
    });

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511] h-screen">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    // Client strategic profile data extraction
    const onboarding = selectedClient?.onboarding_data || {};
    const strategic = onboarding?.strategic || {};
    const tone = strategic?.tone || 'Profesional';
    const whatItDoes = strategic?.whatItDoes || selectedClient?.notes || 'No especificado';
    const valueProp = strategic?.valueProp || 'No especificada';
    const targetAudience = strategic?.targetAudience || 'No definido';
    const mainGoal = strategic?.mainGoal || 'No definido';
    const websiteUrl = strategic?.websiteUrl || strategic?.instagramUrl || selectedClient?.google_connected_email || '';
    const whatsapp = selectedClient?.whatsapp_number || strategic?.whatsapp_number || '';
    const email = selectedClient?.email || strategic?.email || 'No disponible';

    return (
        <div id="page-root-wrapper" className="flex-1 flex flex-col h-full overflow-hidden bg-[#050511]">
            {/* Styles injection for Print Layout ( window.print() ) */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    /* Hide sidebar, topbar and other layout non-prints */
                    aside, header, nav, button, .no-print, [role="navigation"] {
                        display: none !important;
                    }
                    
                    /* Force base pages flow for printing */
                    html, body {
                        background: white !important;
                        color: black !important;
                        height: auto !important;
                        overflow: visible !important;
                    }
                    
                    /* Ensure scrollable wrappers show all printed contents */
                    div, main {
                        display: block !important;
                        height: auto !important;
                        overflow: visible !important;
                        position: static !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    /* Hide everything inside page root wrapper except the print model */
                    #page-root-wrapper > *:not(#print-script-modal) {
                        display: none !important;
                    }
                    
                    /* Clean courier script alignment */
                    #print-script-modal {
                        display: block !important;
                        visibility: visible !important;
                        position: relative !important;
                        width: 100% !important;
                        background: white !important;
                        color: black !important;
                        padding: 30px !important;
                        font-family: 'Courier New', Courier, monospace !important;
                        font-size: 12pt !important;
                        line-height: 1.5 !important;
                    }
                    
                    #print-script-modal * {
                        color: black !important;
                        background: transparent !important;
                        border-color: #d1d5db !important;
                    }
                }
            `}} />

            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-white">Agenda de Rodajes</h1>
                    <p className="text-xs text-gray-400">Organiza tus próximas producciones.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#0E0E18] rounded-lg p-1 border border-white/10">
                    <button 
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm font-bold text-white px-2 capitalize">
                        {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                    <button 
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-hidden relative">
                <div className="h-full flex gap-6 p-8 overflow-hidden">
                    {/* Calendar Grid Container (Left) */}
                    <div className="flex-1 bg-gradient-to-br from-[#0E0E18]/90 to-[#050511] relative p-6 rounded-[2rem] border border-cyan-500/10 flex flex-col shadow-2xl overflow-hidden shadow-cyan-900/5">
                        {/* Header Legend */}
                        <div className="flex justify-end items-center mb-6 shrink-0">
                            <div className="flex gap-2">
                                {COLUMNS.map(col => {
                                    const dotColor = col.id === 'pre-pro' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]' :
                                                     col.id === 'shooting' ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                                                     col.id === 'post-pro' ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.6)]' :
                                                     col.id === 'review' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
                                                     'bg-lime-400 shadow-[0_0_8px_rgba(132,204,22,0.6)]';
                                    return (
                                        <div key={col.id} className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span> {col.label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex-1" style={{ gridTemplateRows: 'auto repeat(6, 1fr)' }}>
                            {DAYS.map(d => <div key={d} className="bg-black/40 py-2.5 text-center text-[10px] font-black text-gray-500 uppercase tracking-wider">{d}</div>)}
                            {Array(getFirstDayOfMonth(currentMonth)).fill(null).map((_, i) => <div key={`blank-${i}`} className="bg-black/20 opacity-30 border border-white/[0.02]"></div>)}
                            {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1).map(day => {
                                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayEvents = filteredEvents.filter(e => e.deadline === dateStr);
                                const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
                                const isSelected = selectedDay === day;

                                return (
                                    <div 
                                        key={day} 
                                        onClick={() => setSelectedDay(day)} 
                                        className={`relative p-2 h-full cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                                            isSelected 
                                            ? 'bg-cyan-500/10 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] z-10' 
                                            : isToday 
                                                ? 'bg-indigo-500/20 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]' 
                                                : 'bg-black/40 hover:bg-white/5 border border-white/5 hover:border-cyan-500/20'
                                        }`}
                                    >
                                        <span className={`text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full ${
                                            isToday 
                                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                                            : isSelected 
                                                ? 'text-cyan-400 font-black' 
                                                : 'text-gray-500'
                                        }`}>{day}</span>
                                        
                                        <div className="space-y-1 mt-1 max-h-[50px] overflow-hidden">
                                            {dayEvents.map(e => {
                                                const colorClass = e.status === 'pre-pro' || e.status === 'confirmed' ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)] hover:bg-cyan-500/20' :
                                                                   e.status === 'shooting' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)] hover:bg-rose-500/20' :
                                                                   e.status === 'post-pro' ? 'text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/30 shadow-[0_0_8px_rgba(232,121,249,0.2)] hover:bg-fuchsia-500/20' :
                                                                   e.status === 'review' ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.2)] hover:bg-yellow-500/20' :
                                                                   e.status === 'cancelled' ? 'text-red-400 bg-red-500/10 border border-red-500/30 line-through opacity-60' :
                                                                   'text-lime-400 bg-lime-500/10 border border-lime-500/30 shadow-[0_0_8px_rgba(132,204,22,0.2)] hover:bg-lime-500/20';
                                                return (
                                                    <div 
                                                        key={e.id} 
                                                        className={`text-[8px] font-black px-1.5 py-0.5 rounded border truncate transition-all ${colorClass}`}
                                                        title={e.title}
                                                    >
                                                        {e.title.replace('Rodaje: ', '')}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Trailing blank cells to complete the 42 day slots grid */}
                            {Array(42 - getFirstDayOfMonth(currentMonth) - getDaysInMonth(currentMonth)).fill(null).map((_, i) => (
                                <div key={`blank-trail-${i}`} className="bg-black/10 opacity-20 border border-white/[0.02]"></div>
                            ))}
                        </div>
                    </div>

                    {/* Side Notes & Day Details Panel (Right) */}
                    <div className="w-80 bg-[#0E0E18]/80 border border-white/5 rounded-[2rem] p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden backdrop-blur-md shrink-0">
                        {selectedDay ? (() => {
                            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                            const dayEvents = filteredEvents.filter(e => e.deadline === dateStr);
                            const formattedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

                            return (
                                <>
                                    {/* Panel Header */}
                                    <div className="shrink-0">
                                        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" /> Agenda Diaria
                                        </div>
                                        <h3 className="text-md font-bold text-white capitalize leading-tight">{formattedDate}</h3>
                                    </div>

                                    {/* Projects on this day */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-1">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Rodajes del Día ({dayEvents.length})</div>
                                        {dayEvents.length > 0 ? (
                                            dayEvents.map(event => {
                                                const { location, contact } = parseNotes(event.notes);
                                                const assetsData = parseAssets(event.assets);
                                                const description = assetsData.description;
                                                const materials_url = assetsData.materials_url;
                                                const equipment = assetsData.equipment;

                                                const colMatch = COLUMNS.find(c => c.id === event.status) || { label: event.status };
                                                const badgeStyle = event.status === 'confirmed' || event.status === 'confirmed' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.2)]' :
                                                                   event.status === 'shooting' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-[0_0_8px_rgba(244,63,94,0.2)]' :
                                                                   event.status === 'post-pro' ? 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_8px_rgba(232,121,249,0.2)]' :
                                                                   event.status === 'review' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                                                   event.status === 'cancelled' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                                                   'border-lime-500/30 text-lime-400 bg-lime-500/10 shadow-[0_0_8px_rgba(132,204,22,0.2)]';
                                                return (
                                                    <div 
                                                        key={event.id} 
                                                        className="p-4 bg-[#11111d] border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all space-y-4 relative group"
                                                    >
                                                        {/* Confirm Animation Overlay */}
                                                        <AnimatePresence>
                                                            {animatingConfirmId === event.id && (
                                                                <motion.div 
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="absolute inset-0 bg-[#0E0E18]/90 backdrop-blur-md flex flex-col items-center justify-center z-30 rounded-2xl"
                                                                >
                                                                    <motion.div
                                                                        initial={{ scale: 0.5, rotate: -45 }}
                                                                        animate={{ scale: [0.5, 1.2, 1], rotate: 0 }}
                                                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                                                        className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-1.5"
                                                                    >
                                                                        <CheckCircle className="w-5 h-5 fill-emerald-500/10" />
                                                                    </motion.div>
                                                                    <motion.p 
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 0.2 }}
                                                                        className="text-[8px] font-black uppercase tracking-[0.1em] text-emerald-400"
                                                                    >
                                                                        Confirmado
                                                                    </motion.p>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        <div className="flex justify-between items-start">
                                                            <span className="text-[9px] font-black uppercase text-cyan-400">{event.duration || 'Hora no definida'}</span>
                                                            <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                                                                {colMatch.label}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">{event.title}</h4>
                                                            <button 
                                                                onClick={() => openClientProfile(event.client)}
                                                                className="text-[9px] text-gray-500 uppercase font-black tracking-wider hover:text-cyan-400 transition-colors mt-1 block text-left underline decoration-dashed"
                                                            >
                                                                Socio: {event.client}
                                                            </button>
                                                        </div>

                                                        {/* Location & Contact Info */}
                                                        <div className="text-[10px] text-gray-400 space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                                                <span className="truncate">{location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                                                <span className="truncate">{contact}</span>
                                                            </div>
                                                        </div>

                                                        {/* Equipment and details */}
                                                        {equipment.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {equipment.slice(0, 3).map((item, idx) => (
                                                                    <span key={idx} className="px-1.5 py-0.5 bg-white/5 border border-white/5 rounded text-[8px] text-gray-400">{item}</span>
                                                                ))}
                                                                {equipment.length > 3 && (
                                                                    <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 rounded text-[8px] text-cyan-400 font-bold">+{equipment.length - 3}</span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Actions & Links inside Daily details */}
                                                        <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedScriptEvent(event);
                                                                    setShowScriptModal(true);
                                                                }}
                                                                className="flex-1 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-[9px] font-black uppercase tracking-wider cursor-pointer text-center"
                                                            >
                                                                Guión
                                                            </button>
                                                            
                                                            {event.status === 'pending' && (
                                                                <button 
                                                                    onClick={() => handleConfirm(event.id)}
                                                                    className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer text-center"
                                                                >
                                                                    Aceptar
                                                                </button>
                                                            )}

                                                            <button 
                                                                onClick={() => openReagendaModal(event)}
                                                                disabled={event.status === 'cancelled'}
                                                                className="flex-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer text-center disabled:opacity-40"
                                                            >
                                                                Reagendar
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-xs text-gray-600 italic bg-white/[0.01] p-4 rounded-xl border border-dashed border-white/5 text-center">No hay producciones agendadas.</div>
                                        )}

                                        {/* Daily Notes (Google Calendar style) */}
                                        <div className="pt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notas de Producción</span>
                                                <span className="text-[8px] text-cyan-400 font-mono">Autoguardado</span>
                                            </div>
                                            <textarea
                                                value={dailyNotes[dateStr] || ''}
                                                onChange={(e) => saveDailyNote(dateStr, e.target.value)}
                                                placeholder="Escribe notas operativas, recordatorios o detalles logísticos..."
                                                className="w-full h-24 bg-black/40 border border-white/5 focus:border-cyan-500/40 rounded-xl p-3 text-xs text-gray-300 placeholder-gray-600 outline-none resize-none transition-all leading-relaxed"
                                            />
                                        </div>

                                        {/* Daily Tasks / Checklist */}
                                        <div className="pt-4 border-t border-white/5 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tareas Logísticas</span>
                                                <span className="text-[8px] text-indigo-400 font-mono">Autoguardado</span>
                                            </div>
                                            
                                            {/* Task input */}
                                            <form 
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const form = e.currentTarget;
                                                    const input = form.elements.namedItem('newTask');
                                                    if (input.value.trim()) {
                                                        addDailyTask(dateStr, input.value.trim());
                                                        input.value = '';
                                                    }
                                                }}
                                                className="flex gap-2"
                                            >
                                                <input 
                                                    type="text" 
                                                    name="newTask"
                                                    placeholder="Nueva tarea logistica..." 
                                                    className="flex-1 bg-black/40 border border-white/5 focus:border-indigo-500/50 rounded-lg px-3 py-1.5 text-xs text-white outline-none placeholder-gray-600 transition-colors"
                                                />
                                                <button 
                                                    type="submit"
                                                    className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </form>

                                            {/* Task list */}
                                            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                                                {(dailyTasks[dateStr] || []).length > 0 ? (
                                                    (dailyTasks[dateStr] || []).map((t, idx) => (
                                                        <div 
                                                            key={idx}
                                                            className="flex items-center justify-between gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-lg group/task"
                                                        >
                                                            <button
                                                                onClick={() => toggleDailyTask(dateStr, idx)}
                                                                className="flex items-center gap-2 text-left flex-1 cursor-pointer"
                                                            >
                                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                                                                    t.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-600 hover:border-indigo-500'
                                                                }`}>
                                                                    {t.completed && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                                                                </div>
                                                                <span className={`text-[11px] transition-all ${t.completed ? 'text-gray-500 line-through opacity-55' : 'text-gray-300'}`}>
                                                                    {t.text}
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={() => removeDailyTask(dateStr, idx)}
                                                                className="opacity-0 group-hover/task:opacity-100 p-0.5 text-gray-500 hover:text-red-400 rounded transition-all cursor-pointer"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-[10px] text-gray-600 italic py-1">Sin tareas para hoy.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })() : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                                <CalendarIcon className="w-10 h-10 text-gray-600 mb-3 opacity-30 animate-pulse" />
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Selecciona un Día</p>
                                <p className="text-[10px] text-gray-600 mt-1">Haz clic en cualquier celda para ver el itinerario y redactar notas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Reagenda Modal */}
            <AnimatePresence>
                {showReagendaModal && selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowReagendaModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-md bg-[#0E0E18] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-6"
                        >
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-cyan-400" /> Gestionar Rodaje
                                </h3>
                                <button 
                                    onClick={() => setShowReagendaModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nueva Fecha</label>
                                    <input 
                                        type="date"
                                        value={reagendaDate}
                                        onChange={(e) => setReagendaDate(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hora Inicio</label>
                                        <input 
                                            type="time"
                                            value={reagendaStartTime}
                                            onChange={(e) => setReagendaStartTime(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hora Fin</label>
                                        <input 
                                            type="time"
                                            value={reagendaEndTime}
                                            onChange={(e) => setReagendaEndTime(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Detalle / Descripción</label>
                                    <textarea 
                                        value={reagendaDescription}
                                        onChange={(e) => setReagendaDescription(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none min-h-[80px]"
                                        placeholder="Descripción detallada de la producción..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enlace al Guión (PDF/Drive)</label>
                                    <input 
                                        type="url"
                                        value={reagendaScriptUrl}
                                        onChange={(e) => setReagendaScriptUrl(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                        placeholder="https://docs.google.com/..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enlace a Recursos / Materiales</label>
                                    <input 
                                        type="url"
                                        value={reagendaMaterialsUrl}
                                        onChange={(e) => setReagendaMaterialsUrl(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/5">
                                <button 
                                    onClick={() => setShowReagendaModal(false)}
                                    className="flex-1 py-3 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={saveReagenda}
                                    className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Script Details Modal */}
            <AnimatePresence>
                {showScriptModal && selectedScriptEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowScriptModal(false)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-3xl bg-[#0E0E18] border border-white/10 rounded-3xl p-8 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6 shrink-0 no-print">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <FileText className="w-3 h-3" /> Guión Técnico de Producción
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedScriptEvent.title}</h3>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                        Cliente: <span className="text-gray-300">{selectedScriptEvent.client}</span> • Duración: {selectedScriptEvent.duration}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <button 
                                        onClick={() => window.print()}
                                        className="px-4 py-2 bg-white text-black hover:bg-gray-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-white/5 cursor-pointer"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Exportar PDF
                                    </button>
                                    <button 
                                        onClick={() => setShowScriptModal(false)}
                                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Script Content */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 no-print">
                                {parseAssets(selectedScriptEvent.assets).script_blocks?.length > 0 ? (
                                    <div className="space-y-4">
                                        {parseAssets(selectedScriptEvent.assets).script_blocks.map((block, idx) => (
                                            <div 
                                                key={idx} 
                                                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all space-y-4"
                                            >
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        {block.scene || block.type}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-bold text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" /> {block.time}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Audio / Voiceover */}
                                                    <div className="space-y-1.5">
                                                        <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                                            🗣️ Audio / Locución
                                                        </h5>
                                                        <p className="text-xs text-gray-300 leading-relaxed bg-black/25 p-3 rounded-xl border border-white/5 font-medium whitespace-pre-wrap">
                                                            {block.text}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Video / Visuals */}
                                                    <div className="space-y-1.5">
                                                        <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                                                            🎥 Video / Visual Sugerido
                                                        </h5>
                                                        <p className="text-xs text-gray-400 leading-relaxed bg-black/25 p-3 rounded-xl border border-white/5 font-medium whitespace-pre-wrap">
                                                            {block.visual}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                        <FileText className="w-12 h-12 text-gray-600 mb-3 opacity-30" />
                                        <p className="text-sm font-bold text-gray-400">Sin guión estructurado localmente</p>
                                        <p className="text-xs text-gray-600 mt-1 mb-6 max-w-sm">Este rodaje cuenta con un enlace de guión externo para su consulta.</p>
                                        {parseAssets(selectedScriptEvent.assets).script_url && (
                                            <a 
                                                href={parseAssets(selectedScriptEvent.assets).script_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="px-6 py-2.5 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                                            >
                                                Abrir Guión en Documento Externo
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden Print Container for A4 formatting */}
            <div id="print-script-modal" className="hidden bg-white text-black p-10">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight text-black">{selectedScriptEvent?.title}</h1>
                <p className="text-sm font-bold text-gray-600 uppercase mb-8 border-b pb-2">
                    Cliente: {selectedScriptEvent?.client} • Duración: {selectedScriptEvent?.duration} • Fecha: {selectedScriptEvent?.deadline}
                </p>
                <div className="space-y-8">
                    {selectedScriptEvent && parseAssets(selectedScriptEvent.assets).script_blocks?.map((block, idx) => (
                        <div key={idx} className="border-b border-gray-200 pb-6 space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-black uppercase">{idx + 1}. {block.scene || block.type}</span>
                                <span className="text-gray-500">{block.time}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6 text-xs">
                                <div>
                                    <h4 className="font-bold text-gray-700 uppercase mb-1">🗣️ Audio / Locución:</h4>
                                    <p className="text-black leading-relaxed whitespace-pre-wrap">{block.text}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-700 uppercase mb-1">🎥 Video / Visual Sugerido:</h4>
                                    <p className="text-black leading-relaxed whitespace-pre-wrap">{block.visual}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Client Strategic Profile Modal */}
            <AnimatePresence>
                {showClientModal && selectedClient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowClientModal(false)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-4xl bg-[#0E0E18] border border-white/10 rounded-3xl p-8 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden space-y-6"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start border-b border-white/5 pb-4 shrink-0">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                                            Perfil Estratégico de Socio
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest capitalize">
                                            {selectedClient.status || 'Activo'}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                        {selectedClient.name}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                        Industria: <span className="text-gray-300">{selectedClient.industry || selectedClient.onboarding_data?.strategic?.type || 'General'}</span>
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowClientModal(false)}
                                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body Split layout */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column: Contact and Social Links */}
                                <div className="space-y-4 lg:col-span-1">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
                                            Contacto Principal
                                        </h4>
                                        <div className="space-y-3 text-xs">
                                            <div>
                                                <span className="text-gray-500 uppercase font-black text-[9px] tracking-wider block mb-0.5">Representante</span>
                                                <p className="text-white font-bold text-sm">{selectedClient.onboarding_data?.strategic?.leadership || selectedClient.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 uppercase font-black text-[9px] tracking-wider block mb-0.5">Correo Electrónico</span>
                                                <p className="text-white font-mono break-all">{email}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 uppercase font-black text-[9px] tracking-wider block mb-0.5">Ubicación</span>
                                                <p className="text-white font-medium">{selectedClient.city || 'No especificada'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Links */}
                                    <div className="space-y-2">
                                        {whatsapp && (
                                            <a 
                                                href={`https://wa.me/${whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                                Chat de WhatsApp
                                            </a>
                                        )}
                                        {selectedClient.email && (
                                            <a 
                                                href={`mailto:${selectedClient.email}`}
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                                Enviar Correo
                                            </a>
                                        )}
                                        {websiteUrl && (() => {
                                            const socialStyle = getSocialLinkStyle(websiteUrl);
                                            return (
                                                <a 
                                                    href={websiteUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`flex items-center justify-center gap-2 w-full py-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${socialStyle.color}`}
                                                >
                                                    {socialStyle.icon}
                                                    {socialStyle.label}
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Right Column: Strategic profile briefs */}
                                <div className="space-y-6 lg:col-span-2 col-span-1">
                                    {/* Qué Hace */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2">
                                        <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                            ¿Qué hace la marca?
                                        </h4>
                                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                            {whatItDoes}
                                        </p>
                                    </div>

                                    {/* Propuesta de Valor */}
                                    {valueProp && valueProp !== 'No especificada' && (
                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2">
                                            <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                                Propuesta de Valor
                                            </h4>
                                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                                {valueProp}
                                            </p>
                                        </div>
                                    )}

                                    {/* Estrategia de Comunicación & Tono */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2">
                                            <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                                Tono de Marca
                                            </h4>
                                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                                {tone}
                                            </p>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2">
                                            <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                                Público Objetivo
                                            </h4>
                                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                                {targetAudience}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Propósito Principal */}
                                    {mainGoal && mainGoal !== 'No definido' && (
                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2">
                                            <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                                Objetivo Principal de Marca
                                            </h4>
                                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                                {mainGoal}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Loading Indicator for client profile fetch */}
            {loadingClient && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
            )}
        </div>
    );
}
