'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    BookOpen, Play, CheckCircle, Lock,
    Clock, Search, ChevronLeft, Trophy, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_COURSES } from '@/data/academyCourses';
import { toast } from 'sonner';

export default function UnifiedAcademyPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('all'); // all, Básico, Intermedio, Avanzado
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    
    // Parse role from path
    // Path looks like: /workstation/filmmaker/academy or /workstation/academy
    const pathParts = pathname.split('/');
    const isCentral = pathParts[2] === 'academy';
    const currentRole = isCentral ? 'workstation' : pathParts[2];
    
    const getBackRoute = () => {
        if (isCentral) return '/dashboard';
        return `/workstation/${currentRole}`;
    };

    const getBackLabel = () => {
        if (isCentral) return 'Ir a Dashboard';
        const roleLabels = {
            filmmaker: 'Filmmaker',
            designer: 'Diseñador',
            editor: 'Editor',
            audio: 'Audio',
            photography: 'Fotógrafo',
            talent: 'Talento'
        };
        return `Volver a ${roleLabels[currentRole] || currentRole}`;
    };

    // Load progress from localStorage on mount
    useEffect(() => {
        const loadedCourses = ACADEMY_COURSES.map(course => {
            const savedProgress = localStorage.getItem(`diic_academy_progress_${course.id}`);
            return {
                ...course,
                progress: savedProgress ? parseInt(savedProgress) : course.progress
            };
        });
        setCourses(loadedCourses);
    }, [pathname]);

    const handleCourseClick = (course) => {
        // Simple level lock check (mock requirement)
        if (course.level === 'Avanzado' && course.id === 6) {
            toast.error('Este curso requiere Nivel 3. Completa los cursos básicos primero.');
            return;
        }

        const playerPath = isCentral 
            ? `/workstation/academy/${course.id}`
            : `/workstation/${currentRole}/academy/${course.id}`;
            
        router.push(playerPath);
    };

    const filteredCourses = courses.filter(course => {
        const matchesTab = activeTab === 'all' || course.level === activeTab;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050511] text-white">
            
            {/* Header */}
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 md:px-12 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div className="flex flex-col gap-1">
                    <button 
                        onClick={() => router.push(getBackRoute())}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-left"
                    >
                        <motion.div 
                            whileHover={{ x: -3 }}
                            className="p-1 bg-white/5 rounded border border-white/5 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all"
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </motion.div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{getBackLabel()}</span>
                    </button>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter mt-1">
                        <BookOpen className="w-6 h-6 text-purple-500 animate-pulse" /> Academia DIIC
                        <span className="text-[9px] font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">OS VERSION 2.6</span>
                    </h1>
                </div>

                <div className="hidden md:flex gap-4">
                    <div className="bg-[#0E0E18]/80 border border-white/10 rounded-2xl px-5 py-2 flex items-center gap-4 shadow-xl">
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Progreso Global</p>
                            <p className="text-xs font-black text-white uppercase tracking-tighter">Nivel 2 • Creador</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">2</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 max-w-7xl mx-auto w-full">
                
                {/* Hero section */}
                <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-950/20 to-cyan-950/20 border border-white/5 p-8 overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-xl space-y-4">
                        <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 uppercase tracking-widest inline-flex items-center gap-1.5">
                            <Trophy className="w-3 h-3" /> Entrenamiento de Elite
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight">
                            Desbloquea nuevas <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">habilidades</span>
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            Completa los cursos obligatorios de tu especialidad para subir de nivel en la plataforma, aumentar tu capacidad de trabajo asignada y desbloquear mejores tarifas de cobro por entregables.
                        </p>
                    </div>
                    {/* Decorative lights */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                    <div className="relative w-full lg:flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar curso, habilidad, herramientas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0E0E18] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-[#0E0E18]/80 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
                        {['all', 'Básico', 'Intermedio', 'Avanzado'].map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => setActiveTab(lvl)}
                                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === lvl ? 'bg-white text-black border-white shadow-xl shadow-white/5' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white'}`}
                            >
                                {lvl === 'all' ? 'Todos' : lvl}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                        {filteredCourses.map((course, idx) => {
                            const isCompleted = course.progress === 100;
                            const isLocked = course.level === 'Avanzado' && course.id === 6; // Mock lock
                            
                            return (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    onClick={() => handleCourseClick(course)}
                                    className="bg-[#0E0E18]/60 border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/20 hover:bg-[#0E0E18] transition-all duration-300 group cursor-pointer flex flex-col h-full shadow-lg hover:shadow-2xl relative"
                                >
                                    {/* Icon Banner */}
                                    <div className="h-32 bg-gradient-to-br from-black/40 to-transparent p-6 relative flex justify-between items-start">
                                        <div className={`p-4 rounded-2xl ${course.bgColor || 'bg-white/5'} border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                            {/* Render lucide icon dynamically */}
                                            {course.icon && <course.icon className={`w-6 h-6 ${course.color || 'text-white'}`} />}
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-widest border ${course.borderColor || 'border-white/10'} ${course.color || 'text-white'} ${course.bgColor || 'bg-white/5'} backdrop-blur-md`}>
                                            {course.level}
                                        </span>

                                        {isCompleted && (
                                            <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center backdrop-blur-[1px]">
                                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg border border-emerald-400/20 shadow-emerald-500/20">
                                                    <CheckCircle className="w-6 h-6" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-black text-white text-base mb-2 group-hover:text-purple-400 transition-colors uppercase tracking-tight line-clamp-1 leading-snug">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6 line-clamp-2">
                                                {course.description}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Topics previews */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {course.topics?.slice(0, 2).map((topic, i) => (
                                                    <span key={i} className="text-[8px] font-black uppercase tracking-wider text-gray-600 bg-white/[0.02] border border-white/5 rounded px-2 py-0.5">
                                                        {topic}
                                                    </span>
                                                ))}
                                                {course.topics?.length > 2 && (
                                                    <span className="text-[8px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/5 rounded px-2 py-0.5">
                                                        +{course.topics.length - 2} temas
                                                    </span>
                                                )}
                                            </div>

                                            <div className="border-t border-white/5 pt-4">
                                                {isLocked ? (
                                                    <div className="flex items-center gap-2 text-gray-600 text-[10px] font-black uppercase tracking-widest bg-black/20 p-2.5 rounded-xl border border-white/5 justify-center">
                                                        <Lock className="w-3.5 h-3.5" />
                                                        Bloqueado (Req. Nivel 3)
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                            <span>Progreso</span>
                                                            <span>{course.progress}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-black rounded-full overflow-hidden shadow-inner p-[1px] border border-white/5">
                                                            <div 
                                                                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'}`} 
                                                                style={{ width: `${course.progress}%` }} 
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Hover glow line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-4">
                        <Trophy className="w-12 h-12 text-gray-600 mx-auto opacity-30 animate-pulse" />
                        <p className="text-gray-500 text-sm font-black uppercase tracking-widest">No se encontraron cursos en esta categoría</p>
                    </div>
                )}
            </main>
        </div>
    );
}
