'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight,
    Instagram, Facebook, Twitter, Linkedin, Video, Image as ImageIcon,
    MoreHorizontal, Filter, Plus, Clock, CheckCircle, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import ContentModal from '@/components/calendar/modals/ContentModal';

export default function ContentCalendar() {
    const [view, setView] = useState('month'); // 'month' | 'week'
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filterPlatform, setFilterPlatform] = useState('all');

    // Fetch tasks from Supabase
    const fetchTasks = async (signal) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('publish_date', { ascending: true });
            
            if (error) {
                // Ignore abort errors which happen on unmount or refresh
                if (error.name === 'AbortError') return;
                throw error;
            }
            setTasks(data || []);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching tasks:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Calendar Helper Functions
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    // Adjust for Monday start (0: Sun to 0: Mon)
    const getAdjustedFirstDay = (date) => {
        const first = getFirstDayOfMonth(date);
        return first === 0 ? 6 : first - 1;
    };

    const monthDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getAdjustedFirstDay(currentDate);
        const prevMonthContainer = Array(firstDay).fill(null);
        const currentMonthContainer = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        
        // Fill up to 42 cells (6 rows)
        const totalCells = prevMonthContainer.length + currentMonthContainer.length;
        const nextMonthContainer = Array(totalCells > 35 ? 42 - totalCells : 35 - totalCells).fill(null);
        
        return [...prevMonthContainer, ...currentMonthContainer, ...nextMonthContainer];
    }, [currentDate]);

    const weekDays = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [currentDate]);

    const navigateMonth = (direction) => {
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
        } else {
            const d = new Date(currentDate);
            d.setDate(d.getDate() + (direction * 7));
            setCurrentDate(d);
        }
    };

    const handleOpenModal = (task = null, date = null) => {
        setSelectedTask(task);
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const filteredTasks = useMemo(() => {
        if (filterPlatform === 'all') return tasks;
        return tasks.filter(t => t.platform === filterPlatform);
    }, [tasks, filterPlatform]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-emerald-500 text-white';
            case 'scheduled': return 'bg-blue-500 text-white';
            case 'draft': return 'bg-gray-500 text-gray-300';
            case 'editing': return 'bg-amber-500 text-white';
            default: return 'bg-gray-500';
        }
    }

    const platformIcon = (platform) => {
        const p = platform?.toLowerCase();
        if (p === 'instagram') return <Instagram className="w-3.5 h-3.5" />;
        if (p === 'facebook') return <Facebook className="w-3.5 h-3.5" />;
        if (p === 'linkedin') return <Linkedin className="w-3.5 h-3.5" />;
        if (p === 'twitter' || p === 'x') return <Twitter className="w-3.5 h-3.5" />;
        if (p === 'youtube') return <Video className="w-3.5 h-3.5" />;
        return <ImageIcon className="w-3.5 h-3.5" />;
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050511]">

            {/* HEADER */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Calendario Editorial</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                                {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 ml-4">
                        <button onClick={() => navigateMonth(-1)} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
                        <button onClick={() => navigateMonth(1)} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-2"></div>

                    <div className="flex bg-[#0E0E18] rounded-lg p-1 border border-white/10">
                        <button onClick={() => setView('month')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'month' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Mes</button>
                        <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'week' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Semana</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setFilterPlatform(prev => prev === 'all' ? 'instagram' : 'all')} 
                        className={`h-9 px-3 border rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${filterPlatform !== 'all' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                    >
                        <Filter className="w-3.5 h-3.5" /> {filterPlatform === 'all' ? 'Filtrar' : 'Instagram'}
                    </button>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="h-9 px-4 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-white/10"
                    >
                        <Plus className="w-3.5 h-3.5" /> Nueva Entrada
                    </button>
                </div>
            </header>

            {/* CALENDAR GRID */}
            <div className="flex-1 overflow-y-auto p-6 bg-[url('/grid-pattern.svg')] bg-opacity-5 scrollbar-hide">
                <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Headers */}
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                        <div key={day} className="bg-[#0E0E18] p-3 text-center border-b border-white/5">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{day}</span>
                        </div>
                    ))}

                    {/* Week View */}
                    {view === 'week' ? (
                        weekDays.map((date, i) => {
                            const isToday = new Date().toDateString() === date.toDateString();
                            const dayTasks = filteredTasks.filter(t => {
                                if (!t.publish_date) return false;
                                return new Date(t.publish_date).toDateString() === date.toDateString();
                            });

                            return (
                                <div 
                                    key={i} 
                                    className={`bg-[#0A0A0E] min-h-[400px] p-2 hover:bg-[#13131f] transition-colors relative group`}
                                    onClick={() => handleOpenModal(null, date)}
                                >
                                    <span className={`text-sm font-mono font-bold absolute top-2 right-3 px-2 py-0.5 rounded ${isToday ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-600'}`}>
                                        {date.getDate()}
                                    </span>

                                    <div className="mt-8 space-y-3">
                                        {dayTasks.map(task => (
                                            <motion.div
                                                key={task.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenModal(task);
                                                }}
                                                className="bg-[#1A1A24] p-3 rounded-xl border border-white/5 hover:border-white/20 cursor-pointer shadow-lg group/card"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`p-1.5 rounded-lg bg-white/5 ${
                                                            task.platform?.toLowerCase() === 'instagram' ? 'text-pink-400' : 
                                                            task.platform?.toLowerCase() === 'linkedin' ? 'text-indigo-400' : 'text-blue-400'
                                                        }`}>
                                                            {platformIcon(task.platform)}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{task.platform}</span>
                                                    </div>
                                                </div>
                                                <h4 className="text-xs font-bold text-gray-100 leading-tight mb-3 line-clamp-3">{task.title}</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-gray-600">{new Date(task.publish_date).toTimeString().slice(0, 5)}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* Month View (Existing logic) */
                        monthDays.map((day, i) => {
                            const cellDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                            const isToday = day && 
                                          new Date().getDate() === day && 
                                          new Date().getMonth() === currentDate.getMonth() && 
                                          new Date().getFullYear() === currentDate.getFullYear();
                            
                            const dayTasks = filteredTasks.filter(t => {
                                if (!day || !t.publish_date) return false;
                                const tDate = new Date(t.publish_date);
                                return tDate.getDate() === day && 
                                       tDate.getMonth() === currentDate.getMonth() && 
                                       tDate.getFullYear() === currentDate.getFullYear();
                            });

                            return (
                                <div 
                                    key={i} 
                                    className={`bg-[#0A0A0E] min-h-[160px] p-2 hover:bg-[#13131f] transition-colors relative group ${!day ? 'opacity-20 pointer-events-none' : ''}`}
                                    onClick={() => day && handleOpenModal(null, cellDate)}
                                >
                                    {day && (
                                        <span className={`text-sm font-mono font-bold absolute top-2 right-3 px-2 py-0.5 rounded ${isToday ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-600'}`}>
                                            {day}
                                        </span>
                                    )}

                                    <div className="mt-8 space-y-2">
                                        {dayTasks.map(task => (
                                            <motion.div
                                                key={task.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenModal(task);
                                                }}
                                                className="bg-[#1A1A24] p-2.5 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer shadow-sm group/card"
                                            >
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`p-1 rounded bg-white/5 ${
                                                            task.platform?.toLowerCase() === 'instagram' ? 'text-pink-400' : 
                                                            task.platform?.toLowerCase() === 'linkedin' ? 'text-indigo-400' : 'text-blue-400'
                                                        }`}>
                                                            {platformIcon(task.platform)}
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{task.platform}</span>
                                                    </div>
                                                    <MoreHorizontal className="w-3 h-3 text-gray-600 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                                </div>

                                                <h4 className="text-xs font-bold text-gray-200 leading-snug mb-2 line-clamp-2">{task.title}</h4>

                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${getStatusColor(task.status)} tracking-tighter`}>
                                                        {task.status}
                                                    </span>
                                                    <div className="w-4 h-4 rounded-full bg-gray-700 border border-black flex items-center justify-center text-[8px] text-white font-bold shrink-0">
                                                        CM
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {day && (
                                            <button className="w-full h-8 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-white/5 hover:text-white transition-all">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal */}
            <ContentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                selectedDate={selectedDate}
                onSave={fetchTasks}
            />
        </div>
    );
}
