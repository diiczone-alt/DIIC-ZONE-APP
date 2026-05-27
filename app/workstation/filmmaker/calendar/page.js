'use client';

import { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Clock,
    User, Camera, MoreVertical, CheckCircle,
    XCircle, RefreshCw, ChevronLeft, ChevronRight, Loader2, X, FileText
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
        description: ''
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
            description: assets.description || ''
        };
    }
    return defaultVal;
};

export default function FilmmakerCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animatingConfirmId, setAnimatingConfirmId] = useState(null);
    
    // Calendar Navigation State (defaults to Feb 2026 to match screenshot context, but dynamic)
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); 
    
    // Reagenda Modal State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showReagendaModal, setShowReagendaModal] = useState(false);
    const [reagendaDate, setReagendaDate] = useState('');
    const [reagendaStartTime, setReagendaStartTime] = useState('');
    const [reagendaEndTime, setReagendaEndTime] = useState('');
    const [reagendaDescription, setReagendaDescription] = useState('');
    const [reagendaScriptUrl, setReagendaScriptUrl] = useState('');
    const [reagendaMaterialsUrl, setReagendaMaterialsUrl] = useState('');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .or('assigned_role.eq.FILMMAKER,title.ilike.%Rodaje%');
                
            if (error) throw error;
            
            let loadedEvents = data || [];

            // Clean up any old mock data from previous steps if present
            const oldMocks = loadedEvents.filter(e => e.client === 'Clínica Smith' || e.client === 'FitLife Gym');
            if (oldMocks.length > 0) {
                console.log('[Calendar] Cleaning up old mock events...');
                await supabase.from('tasks').delete().in('id', oldMocks.map(m => m.id));
                // Reload list
                const { data: refreshedData } = await supabase
                    .from('tasks')
                    .select('*')
                    .or('assigned_role.eq.FILMMAKER,title.ilike.%Rodaje%');
                loadedEvents = refreshedData || [];
            }
            
            // Auto-seed mock events in database using REAL clients from HQ
            if (loadedEvents.length === 0) {
                console.log('[Calendar] Seeding filmmaker mock events with real clients...');
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
                            description: 'Video de presentación para redes sociales sobre la infraestructura de la clínica.'
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
                            description: 'Producción de 3 reels cortos sobre la preparación de pizzas al horno de leña.'
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
                            description: 'Tomas de apoyo en exteriores y tomas con drone para campaña de posicionamiento.'
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
                description: reagendaDescription
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

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050511]">
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
            <main className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {filteredEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-[#0E0E18] border border-white/5 rounded-2xl">
                        <CalendarIcon className="w-12 h-12 text-gray-600 mb-4 opacity-40 animate-pulse" />
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">No hay rodajes agendados para este mes</p>
                        <p className="text-xs text-gray-600 mt-1">Navega a otros meses para revisar tu agenda.</p>
                    </div>
                ) : (
                    filteredEvents.map((event) => {
                        const { location, contact } = parseNotes(event.notes);
                        const assetsData = parseAssets(event.assets);
                        const equipment = assetsData.equipment;
                        const description = assetsData.description;
                        const script_url = assetsData.script_url;
                        const materials_url = assetsData.materials_url;
                        const dayLabel = getRelativeDayName(event.deadline);

                        return (
                            <div 
                                key={event.id} 
                                className={`bg-[#0E0E18] border rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all group relative ${
                                    event.status === 'confirmed' ? 'border-emerald-500/20 shadow-lg shadow-emerald-950/10' :
                                    event.status === 'cancelled' ? 'opacity-65 border-red-500/10' : 'border-white/5'
                                }`}
                            >
                                {/* Top status colored bar */}
                                {event.status === 'confirmed' && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
                                )}
                                {event.status === 'pending' && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 animate-pulse" />
                                )}
                                {event.status === 'cancelled' && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/20" />
                                )}

                                {/* Confirm Animation Overlay */}
                                <AnimatePresence>
                                    {animatingConfirmId === event.id && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-[#0E0E18]/90 backdrop-blur-md flex flex-col items-center justify-center z-30"
                                        >
                                            <motion.div
                                                initial={{ scale: 0.5, rotate: -45 }}
                                                animate={{ scale: [0.5, 1.2, 1], rotate: 0 }}
                                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                                className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-3"
                                            >
                                                <CheckCircle className="w-8 h-8 fill-emerald-500/10" />
                                            </motion.div>
                                            <motion.p 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 animate-pulse"
                                            >
                                                ¡Aceptado y en Proceso!
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex flex-col md:flex-row">
                                    {/* Date Column */}
                                    <div className="w-full md:w-48 bg-white/5 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/5 shrink-0">
                                        <span className="text-cyan-400 font-bold text-lg mb-1 capitalize">{dayLabel}</span>
                                        <span className="text-2xl font-black text-white">{event.duration ? event.duration.split(' - ')[0] : '--'}</span>
                                        <span className="text-xs text-gray-500 mt-1">{event.duration || 'Hora no definida'}</span>
                                    </div>

                                    {/* Details Column */}
                                    <div className="flex-1 p-6 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className={`text-xl font-bold transition-colors ${
                                                    event.status === 'confirmed' ? 'text-emerald-400' : event.status === 'cancelled' ? 'text-red-400 line-through' : 'text-white group-hover:text-cyan-400'
                                                }`}>
                                                    {event.title}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">
                                                    Cliente: <span className="text-gray-300">{event.client}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <MapPin className="w-4 h-4 text-cyan-400/80 shrink-0" />
                                                <span className="truncate">{location}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <User className="w-4 h-4 text-purple-400/80 shrink-0" />
                                                <span className="truncate">Contacto: {contact}</span>
                                            </div>
                                        </div>

                                        {/* Detalle / Brief de la Producción */}
                                        <div className="bg-[#0A0A0E]/60 rounded-xl p-4 border border-white/5 space-y-3">
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> Detalle de Producción
                                                </h4>
                                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                                    {description || 'No hay una descripción o briefing detallado para este rodaje.'}
                                                </p>
                                            </div>
                                            
                                            {/* Guión y Materiales Links */}
                                            {(script_url || materials_url) && (
                                                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-3">
                                                    {script_url && (
                                                        <a 
                                                            href={script_url} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-[10px] font-black uppercase tracking-wider"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" /> Ver Guión
                                                        </a>
                                                    )}
                                                    {materials_url && (
                                                        <a 
                                                            href={materials_url} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-[10px] font-black uppercase tracking-wider"
                                                        >
                                                            <CalendarIcon className="w-3.5 h-3.5" /> Materiales Adjuntos
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-[#0A0A0E] rounded-xl p-4 border border-white/5">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                                <Camera className="w-4 h-4 text-cyan-400" /> Equipo Requerido
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {equipment.length > 0 ? (
                                                    equipment.map((item, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-xs text-gray-300 font-medium">
                                                            {item}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-600 font-bold uppercase">No especificado</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Column */}
                                    <div className="w-full md:w-48 bg-[#0A0A0E] p-6 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-white/5 shrink-0">
                                        {event.status === 'confirmed' ? (
                                            <div className="w-full py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                                <CheckCircle className="w-4 h-4 fill-emerald-500/10" /> Confirmado
                                            </div>
                                        ) : event.status === 'cancelled' ? (
                                            <div className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                                <XCircle className="w-4 h-4 fill-red-500/10" /> Cancelado
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleConfirm(event.id)}
                                                className="w-full py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Confirmar
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => openReagendaModal(event)}
                                            disabled={event.status === 'cancelled'}
                                            className={`w-full py-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                                                event.status === 'cancelled' ? 'opacity-40 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            <RefreshCw className="w-4 h-4" /> Reagendar
                                        </button>

                                        {event.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleCancel(event.id)}
                                                className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                            >
                                                <XCircle className="w-4 h-4" /> Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
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
                                    className="text-gray-400 hover:text-white transition-colors"
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
                                    className="flex-1 py-3 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={saveReagenda}
                                    className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
