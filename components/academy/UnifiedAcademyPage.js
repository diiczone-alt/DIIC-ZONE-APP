'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    BookOpen, Play, CheckCircle, Lock,
    Clock, Search, ChevronLeft, Trophy, Star, Sparkles, GraduationCap, ArrowRight, ShieldCheck,
    Award, Brain, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_COURSES, FILMMAKER_ACADEMY_COURSES, DESIGNER_ACADEMY_COURSES, AUDIO_ACADEMY_COURSES } from '@/data/academyCourses';
import { toast } from 'sonner';

const getThemeColors = (role) => {
    const r = (role || '').toLowerCase();
    if (r === 'filmmaker') {
        return {
            primary: 'text-cyan-400',
            primaryBg: 'bg-cyan-500/10',
            primaryBorder: 'border-cyan-500/20',
            primarySolidBg: 'bg-cyan-600 hover:bg-cyan-500',
            primarySolidText: 'text-cyan-600',
            accentGlow: 'shadow-cyan-500/20',
            badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
            iconColor: 'text-cyan-400',
            glowClass: 'bg-cyan-600/5'
        };
    }
    if (r === 'designer') {
        return {
            primary: 'text-pink-400',
            primaryBg: 'bg-pink-500/10',
            primaryBorder: 'border-pink-500/20',
            primarySolidBg: 'bg-pink-600 hover:bg-pink-500',
            primarySolidText: 'text-pink-600',
            accentGlow: 'shadow-pink-500/20',
            badge: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
            iconColor: 'text-pink-400',
            glowClass: 'bg-pink-600/5'
        };
    }
    if (r === 'editor') {
        return {
            primary: 'text-purple-400',
            primaryBg: 'bg-purple-500/10',
            primaryBorder: 'border-purple-500/20',
            primarySolidBg: 'bg-purple-600 hover:bg-purple-500',
            primarySolidText: 'text-purple-600',
            accentGlow: 'shadow-purple-500/20',
            badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
            iconColor: 'text-purple-400',
            glowClass: 'bg-purple-600/5'
        };
    }
    if (r === 'audio') {
        return {
            primary: 'text-amber-400',
            primaryBg: 'bg-amber-500/10',
            primaryBorder: 'border-amber-500/20',
            primarySolidBg: 'bg-amber-600 hover:bg-amber-500',
            primarySolidText: 'text-amber-600',
            accentGlow: 'shadow-amber-500/20',
            badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
            iconColor: 'text-amber-400',
            glowClass: 'bg-amber-600/5'
        };
    }
    if (r === 'photography') {
        return {
            primary: 'text-yellow-400',
            primaryBg: 'bg-yellow-500/10',
            primaryBorder: 'border-yellow-500/20',
            primarySolidBg: 'bg-yellow-600 hover:bg-yellow-500',
            primarySolidText: 'text-yellow-600',
            accentGlow: 'shadow-yellow-500/20',
            badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
            iconColor: 'text-yellow-400',
            glowClass: 'bg-yellow-600/5'
        };
    }
    return {
        primary: 'text-purple-400',
        primaryBg: 'bg-purple-500/10',
        primaryBorder: 'border-purple-500/20',
        primarySolidBg: 'bg-purple-600 hover:bg-purple-500',
        primarySolidText: 'text-purple-600',
        accentGlow: 'shadow-purple-500/20',
        badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        iconColor: 'text-purple-400',
        glowClass: 'bg-purple-600/5'
    };
};

export default function UnifiedAcademyPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('all'); // all, Básico, Intermedio, Avanzado
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    
    // Parse role from path
    const pathParts = pathname.split('/');
    const isCentral = pathParts[2] === 'academy';
    const currentRole = isCentral ? 'workstation' : pathParts[2];
    const isFilmmakerRoute = currentRole === 'filmmaker';
    const isDesignerRoute = currentRole === 'designer';
    const isAudioRoute = currentRole === 'audio';
    
    const theme = getThemeColors(currentRole);
    
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
        try {
            const baseCourses = isFilmmakerRoute 
                ? FILMMAKER_ACADEMY_COURSES 
                : isDesignerRoute 
                    ? DESIGNER_ACADEMY_COURSES 
                    : isAudioRoute
                        ? AUDIO_ACADEMY_COURSES
                        : ACADEMY_COURSES;
            const loadedCourses = baseCourses.map(course => {
                let savedProgress = null;
                try {
                    savedProgress = localStorage.getItem(`diic_academy_progress_${course.id}`);
                } catch (e) {
                    console.warn("Storage access restricted or unavailable:", e);
                }
                return {
                    ...course,
                    progress: savedProgress ? parseInt(savedProgress) : course.progress
                };
            });
            setCourses(loadedCourses);
        } catch (err) {
            console.error("Error initializing academy courses:", err);
        }
    }, [pathname, isFilmmakerRoute, isAudioRoute]);

    const handleCourseClick = (course, isLocked) => {
        if (isLocked) {
            if (isFilmmakerRoute) {
                toast.error('Clase Bloqueada 🔒', {
                    description: 'Completa la clase anterior al 100% para desbloquear esta unidad.'
                });
            } else {
                toast.error('Nivel Requerido 🔒', {
                    description: 'Este curso requiere Nivel 3. Completa los cursos básicos primero.'
                });
            }
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

    // Calculate dynamic stats
    const totalCourses = courses.length;
    const completedCount = courses.filter(c => c.progress === 100).length;
    const academyProgress = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#020208] text-white relative overflow-hidden font-display">
            
            {/* Gods Mode Background Glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] ${theme.glowClass} rounded-full blur-[150px]`} />
                <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[180px]" />
                <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[120px]" />
                
                {/* Subtle cyber grid */}
                <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{ 
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '48px 48px' 
                    }}
                />
            </div>

            {/* Header - Only render in central / academy route, not inside workstation pages */}
            {isCentral && (
                <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 md:px-12 bg-[#020208]/80 backdrop-blur-2xl shrink-0 z-20 relative">
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    
                    <div className="flex items-center gap-6">
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
                                <span className="text-[9px] font-black uppercase tracking-[0.25em]">{getBackLabel()}</span>
                            </button>
                            <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter mt-1">
                                <GraduationCap className="w-7 h-7 text-purple-500 animate-pulse" /> Academia DIIC
                                <span className="text-[9px] font-black bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 tracking-wider">
                                    {isFilmmakerRoute ? 'FILMMAKER PORTAL' : 'HQ CORE v2.6'}
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Visual Global Progress */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-2.5 flex items-center gap-4 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-right">
                                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest font-mono">Progreso Academia</p>
                                <p className="text-[11px] font-mono font-black text-white uppercase tracking-tighter">
                                    {completedCount} / {totalCourses} Completados
                                </p>
                            </div>
                            <div className="relative flex items-center justify-center">
                                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)] text-xs font-mono">
                                    {academyProgress}%
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content - adjusted top padding when inside a workstation layout */}
            <main className={`flex-1 overflow-y-auto p-6 md:p-12 ${!isCentral ? 'pt-4 md:pt-6' : ''} space-y-12 max-w-7xl mx-auto w-full z-10 relative custom-scrollbar`}>
                
                {/* Top Cards Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                >
                    {/* Hero / Portal Card */}
                    <div className="lg:col-span-2 bg-[#0E0E18] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                            <GraduationCap className={`w-48 h-48 ${theme.primary}`} />
                        </div>
                        <div className="relative z-10">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 ${theme.primaryBg} border ${theme.primaryBorder} rounded-full mb-6`}>
                                <Zap className={`w-3 h-3 ${theme.primary} animate-pulse`} />
                                <span className={`text-[10px] font-black ${theme.primary} uppercase tracking-widest`}>
                                    {isFilmmakerRoute ? 'Filmmaker Elite v2' : `${currentRole} Portal v2`}
                                </span>
                            </div>
                            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-[0.9]">
                                Academia de <br /> <span className={theme.primary}>{isFilmmakerRoute ? 'Maestría Filmmaker' : `Maestría ${currentRole}`}</span>
                            </h2>
                            <p className="text-gray-500 italic max-w-sm font-medium text-sm">
                                {isFilmmakerRoute 
                                    ? 'Tu centro de mando para perfeccionar la iluminación, sonido, rodaje y comercialización de servicios audiovisuales de alto valor.'
                                    : 'Completa los cursos obligatorios de tu especialidad para subir de nivel en la plataforma y aumentar tu reputación.'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Level / Rank Card */}
                    <div className="bg-[#0E0E18] p-8 rounded-[3rem] border border-white/5 flex flex-col justify-center items-center text-center group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Tu Nivel Actual</p>
                        <div className="w-20 h-20 rounded-3xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                            <Award className="w-10 h-10" />
                        </div>
                        <p className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            {isFilmmakerRoute ? 'Director Creativo' : 'Creador Junior'}
                        </p>
                        <div className="mt-4 px-4 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5 font-mono">
                            0 / 1000 XP
                        </div>
                    </div>

                    {/* Modules Progress Card */}
                    <div className={`${theme.primarySolidBg} p-8 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}>
                        <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                            <Brain className="w-40 h-40 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/80 font-black uppercase tracking-widest mb-1">Módulos</p>
                            <p className="text-4xl font-black italic">
                                {completedCount} <span className="text-xl opacity-60 ml-2">/ {totalCourses}</span>
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                                if (courses.length > 0) {
                                    handleCourseClick(courses[0], false);
                                }
                            }}
                            className={`w-full py-4 bg-white ${theme.primarySolidText} font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl`}
                        >
                            Continuar Curso
                        </button>
                    </div>
                </motion.div>

                {/* Search & Filters Row - Premium Sleek Layout */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
                    {/* Pills Tabs container */}
                    <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-[2rem] border border-white/5 w-fit">
                        {['all', 'Básico', 'Intermedio', 'Avanzado'].map(lvl => {
                            const isActive = activeTab === lvl;
                            const icons = {
                                all: GraduationCap,
                                Básico: BookOpen,
                                Intermedio: Sparkles,
                                Avanzado: Trophy
                            };
                            const colors = {
                                all: theme.primary,
                                Básico: 'text-blue-400',
                                Intermedio: 'text-purple-400',
                                Avanzado: 'text-red-400'
                            };
                            const Icon = icons[lvl] || BookOpen;
                            const levelColor = colors[lvl] || theme.primary;

                            return (
                                <button
                                    key={lvl}
                                    onClick={() => setActiveTab(lvl)}
                                    className={`
                                        px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all text-xs
                                        ${isActive 
                                            ? 'bg-white text-black font-black shadow-lg' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 font-bold'}
                                    `}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : levelColor}`} />
                                    <span className="uppercase tracking-tight">{lvl === 'all' ? 'Todos' : lvl}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Bar - Compact translucid look */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar curso..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all font-semibold uppercase tracking-wider"
                        />
                    </div>
                </div>

                {/* Course Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                        {filteredCourses.map((course, idx) => {
                            const isCompleted = course.progress === 100;
                            
                            // Progressive unlock logic for Filmmaker and Designer
                            let isLocked = false;
                            if (isFilmmakerRoute) {
                                const courseIdx = FILMMAKER_ACADEMY_COURSES.findIndex(c => c.id === course.id);
                                if (courseIdx >= 3) {
                                    const prevCourse = courses.find(c => c.id === FILMMAKER_ACADEMY_COURSES[courseIdx - 1].id);
                                    isLocked = !prevCourse || prevCourse.progress < 100;
                                }
                            } else if (isDesignerRoute) {
                                isLocked = course.level === 'Avanzado' && (course.id === 209 || course.id === 210);
                            } else {
                                isLocked = course.level === 'Avanzado' && course.id === 6;
                            }
                            
                            // Color scheme mappings for premium glows
                            const levelColors = {
                                'Básico': 'from-blue-500/20 to-indigo-500/5 border-blue-500/20 text-blue-400 bg-blue-500/10',
                                'Intermedio': 'from-purple-500/20 to-pink-500/5 border-purple-500/20 text-purple-400 bg-purple-500/10',
                                'Avanzado': 'from-red-500/20 to-orange-500/5 border-red-500/20 text-red-400 bg-red-500/10'
                            };

                            const badgeStyle = levelColors[course.level] || 'from-white/10 to-transparent border-white/10 text-white';

                            return (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ y: -10 }}
                                    onClick={() => handleCourseClick(course, isLocked)}
                                    className={`relative bg-[#0E0E18] border ${isCompleted ? 'border-emerald-500/30' : isLocked ? 'border-white/5 opacity-50' : 'border-white/10'} rounded-[3rem] p-10 group hover:border-white/20 transition-all duration-500 cursor-pointer flex flex-col min-h-[460px] shadow-[0_20px_40px_rgba(0,0,0,0.5)]`}
                                >
                                    {/* Watermark background icon */}
                                    <div className={`absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 pointer-events-none ${course.color || 'text-white'}`}>
                                        {course.icon && <course.icon className="w-32 h-32" />}
                                    </div>

                                    {/* Top Row: Icon and Level Badge */}
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className={`relative w-14 h-14 rounded-[1.4rem] ${course.bgColor || 'bg-white/5'} flex items-center justify-center ${course.color || 'text-white'} shadow-xl overflow-hidden group/icon`}>
                                            {/* Normal Icon */}
                                            <div className="group-hover:scale-0 group-hover:opacity-0 transition-all duration-300 absolute">
                                                {course.icon && <course.icon className="w-7 h-7" />}
                                            </div>
                                            {/* Hover Play Icon */}
                                            {!isLocked && (
                                                <div className="scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 absolute flex items-center justify-center">
                                                    <Play className="w-6 h-6 fill-current ml-0.5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className={`px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest ${course.color || 'text-white'}`}>
                                            {course.level}
                                        </div>
                                    </div>

                                    {/* Course Title and focus */}
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter leading-tight relative z-10">
                                        {course.title}
                                    </h3>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${course.color || 'text-white'} relative z-10`}>
                                        {course.focus || (course.level === 'Básico' ? 'Módulo Fundamental' : course.level === 'Intermedio' ? 'Módulo Avanzado' : 'Especialización')}
                                    </p>

                                    {/* Description */}
                                    <p className="text-sm text-gray-500 leading-relaxed font-bold mb-8 italic relative z-10 line-clamp-3">
                                        "{course.description}"
                                    </p>

                                    {/* Bullets topics */}
                                    <div className="space-y-3 mb-10 mt-auto relative z-10">
                                        {course.topics?.slice(0, 3).map((topic, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${course.bgColor ? course.bgColor.replace('/10', '/60') : 'bg-white/60'}`} />
                                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">{topic}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progress Bar (if unlocked) */}
                                    {!isLocked && (
                                        <div className="mb-6 relative z-10 space-y-2">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500 font-mono">
                                                <span>PROGRESO</span>
                                                <span>{course.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5 relative">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]' : `bg-gradient-to-r ${course.color === 'text-blue-400' ? 'from-blue-500 to-indigo-500' : 'from-purple-500 to-indigo-500'} shadow-[0_0_10px_rgba(168,85,247,0.6)]`}`} 
                                                    style={{ width: `${course.progress}%` }} 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Command Button */}
                                    <button 
                                        onClick={() => handleCourseClick(course, isLocked)}
                                        className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${isCompleted ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : isLocked ? 'border-white/5 text-gray-600 bg-black/20' : `${course.borderColor || 'border-white/10'} ${course.color || 'text-white'}`} hover:bg-white hover:text-black hover:border-white shadow-xl relative z-10`}
                                    >
                                        {isCompleted ? 'Módulo Completado ✓' : isLocked ? 'Módulo Bloqueado 🔒' : 'Comenzar Módulo'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-6 bg-white/[0.01] border border-white/5 rounded-[2rem] max-w-md mx-auto">
                        <Trophy className="w-16 h-16 text-gray-700 mx-auto opacity-30 animate-pulse" />
                        <div className="space-y-1">
                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No se encontraron cursos</p>
                            <p className="text-[10px] text-gray-600 uppercase font-mono">Modifica tus filtros de búsqueda</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
