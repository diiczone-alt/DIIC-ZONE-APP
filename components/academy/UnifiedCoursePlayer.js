'use client';

import { use, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
    Play, CheckCircle, Clock, ChevronDown, ChevronUp, 
    Lock, Share2, MoreVertical, ArrowLeft, ArrowRight,
    Trophy, BookOpen, Layers, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_COURSES } from '@/data/academyCourses';
import { toast } from 'sonner';

export default function UnifiedCoursePlayer({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const pathname = usePathname();
    
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState([]);
    const [completedLessons, setCompletedLessons] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);

    // Get parent academy route
    const getBackRoute = () => {
        return pathname.substring(0, pathname.lastIndexOf('/'));
    };

    // Load course, modules, and progress
    useEffect(() => {
        const foundCourse = ACADEMY_COURSES.find(c => c.id === parseInt(id)) || ACADEMY_COURSES[0];
        
        // Generate modules/lessons structure if it doesn't exist
        const modules = foundCourse.modules || [
            {
                title: 'Módulo 1: Fundamentos Clave',
                lessons: (foundCourse.topics || ['Introducción a la materia']).map((topic, index) => ({
                    id: `l${index + 1}`,
                    title: topic,
                    duration: `${10 + (index * 3)}:15`,
                    completed: false
                }))
            }
        ];

        const courseWithModules = {
            ...foundCourse,
            modules
        };

        setCourse(courseWithModules);
        
        // Expand the first module by default
        if (modules.length > 0) {
            setExpandedModules([modules[0].title]);
        }

        // Load progress from localStorage
        const loadedCompletions = {};
        let firstUncompleted = null;

        modules.forEach(mod => {
            mod.lessons.forEach(les => {
                const val = localStorage.getItem(`diic_les_comp_${foundCourse.id}_${les.id}`) === 'true';
                loadedCompletions[les.id] = val;
                if (!val && !firstUncompleted) {
                    firstUncompleted = les;
                }
            });
        });

        setCompletedLessons(loadedCompletions);
        
        // Default active lesson to first uncompleted or first lesson
        if (firstUncompleted) {
            setActiveLesson(firstUncompleted);
        } else if (modules[0]?.lessons[0]) {
            setActiveLesson(modules[0].lessons[0]);
        }
    }, [id]);

    if (!course || !activeLesson) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511] h-screen">
                <BookOpen className="w-10 h-10 text-purple-500 animate-spin" />
            </div>
        );
    }

    const toggleModule = (moduleTitle) => {
        setExpandedModules(prev => 
            prev.includes(moduleTitle) 
                ? prev.filter(t => t !== moduleTitle) 
                : [...prev, moduleTitle]
        );
    };

    const handleToggleComplete = (lessonId) => {
        const newState = !completedLessons[lessonId];
        const updated = { ...completedLessons, [lessonId]: newState };
        setCompletedLessons(updated);
        
        // Save lesson progress
        localStorage.setItem(`diic_les_comp_${course.id}_${lessonId}`, String(newState));
        
        // Calculate overall course progress
        const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
        const completedCount = Object.values(updated).filter(Boolean).length;
        const progressPercentage = Math.round((completedCount / totalLessons) * 100);
        
        // Save overall progress
        localStorage.setItem(`diic_academy_progress_${course.id}`, String(progressPercentage));
        
        if (newState) {
            toast.success('¡Lección completada! Tu progreso se ha guardado.');
        }
    };

    const handleNextLesson = () => {
        // Flatten lessons list
        const allLessons = course.modules.flatMap(mod => mod.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
        
        if (currentIndex < allLessons.length - 1) {
            setActiveLesson(allLessons[currentIndex + 1]);
            setIsPlaying(false);
        } else {
            toast.success('¡Has llegado al final del curso! Excelente trabajo.');
        }
    };

    const handlePrevLesson = () => {
        const allLessons = course.modules.flatMap(mod => mod.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
        
        if (currentIndex > 0) {
            setActiveLesson(allLessons[currentIndex - 1]);
            setIsPlaying(false);
        }
    };

    const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
    const completedCount = Object.values(completedLessons).filter(Boolean).length;
    const progressPercentage = Math.round((completedCount / totalLessons) * 100);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Player Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E18] shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push(getBackRoute())}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-white/5" />
                    <div>
                        <h1 className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> REPRODUCTOR ACADÉMICO
                        </h1>
                        <p className="text-sm font-bold text-white truncate max-w-[280px] md:max-w-[400px]">{course.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-white">{progressPercentage}% COMPLETADO</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white" onClick={() => toast.success('Enlace de curso copiado al portapapeles.')}>
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Main Player Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Video Stage */}
                    <div className="aspect-video bg-black relative group cursor-pointer overflow-hidden max-h-[500px]">
                        {isPlaying ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#070713]">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
                                    className="w-20 h-20 rounded-full border-2 border-purple-500/20 border-t-purple-500 flex items-center justify-center mb-4"
                                >
                                    <Play className="w-8 h-8 text-purple-500 fill-purple-500 ml-1" />
                                </motion.div>
                                <p className="text-xs font-black uppercase tracking-widest text-purple-400">Reproduciendo Clase en Streaming...</p>
                                <p className="text-[10px] text-gray-500 mt-2">"{activeLesson.title}"</p>
                                <button 
                                    onClick={() => setIsPlaying(false)}
                                    className="mt-6 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10"
                                >
                                    Pausar Video
                                </button>
                            </div>
                        ) : (
                            <>
                                <img 
                                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44e?auto=format&fit=crop&q=80&w=1200" 
                                    className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Video Thumbnail"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => setIsPlaying(true)}
                                        className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-purple-500/20"
                                    >
                                        <Play className="w-8 h-8 text-black fill-black ml-1" />
                                    </motion.div>
                                </div>
                            </>
                        )}
                        
                        {/* Video Controls Overlay (Mock) */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-4">
                                <Play className="w-4 h-4 text-white" />
                                <div className="w-32 md:w-64 h-1 bg-white/20 rounded-full relative">
                                    <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-purple-500 rounded-full" />
                                </div>
                                <span className="text-[10px] font-mono text-white/70">04:12 / {activeLesson.duration}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Layers className="w-4 h-4 text-white/70" />
                                <MoreVertical className="w-4 h-4 text-white/70" />
                            </div>
                        </div>
                    </div>

                    {/* Lesson Info */}
                    <div className="p-8 md:p-12 max-w-4xl w-full space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded border border-purple-500/20">Clase Activa</span>
                                <span className="text-xs text-gray-500 font-medium">• {activeLesson.title}</span>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tight italic uppercase">{activeLesson.title}</h2>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                En esta clase analizaremos a fondo el tema de {activeLesson.title.toLowerCase()}. Aprenderás las metodologías prácticas utilizadas por DIIC ZONE para maximizar el rendimiento y el retorno de inversión en este pilar operativo.
                            </p>
                        </div>

                        {/* Interactive complete check */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#0E0E18]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
                            <div className="space-y-1">
                                <h4 className="text-xs font-black uppercase tracking-wider text-white">Estado de la clase</h4>
                                <p className="text-xs text-gray-500 font-medium">Marca esta lección como completada cuando termines de ver el video.</p>
                            </div>
                            <button
                                onClick={() => handleToggleComplete(activeLesson.id)}
                                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${completedLessons[activeLesson.id] ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-purple-400 border-purple-500/20 hover:bg-white/10'}`}
                            >
                                {completedLessons[activeLesson.id] ? (
                                    <>
                                        <CheckCircle className="w-3.5 h-3.5" /> Completado
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5" /> Marcar Completado
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-white">Recursos Descargables</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                                        <span className="text-xs font-bold font-mono">Guia_Operativa_Modulo.pdf</span>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                                        <span className="text-xs font-bold font-mono">Recursos_Adicionales.zip</span>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Siguiente Nivel</h4>
                                </div>
                                <p className="text-xs text-purple-200/60 leading-relaxed font-medium">Al completar todas las clases de este curso desbloquearás el certificado que te acreditará para proyectos Premium.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum Sidebar */}
                <aside className="w-full lg:w-[360px] xl:w-[400px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0E0E18] flex flex-col shrink-0">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-500 animate-pulse" /> Plan de Estudios
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] lg:max-h-none">
                        {course.modules.map((module) => (
                            <div key={module.title} className="space-y-2">
                                <button 
                                    onClick={() => toggleModule(module.title)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-all group"
                                >
                                    <span className="text-xs font-black text-gray-400 group-hover:text-white uppercase tracking-tighter transition-colors">{module.title}</span>
                                    {expandedModules.includes(module.title) ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                                </button>
                                
                                <AnimatePresence>
                                    {expandedModules.includes(module.title) && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-1 overflow-hidden"
                                        >
                                            {module.lessons.map((lesson) => {
                                                const isCompleted = completedLessons[lesson.id];
                                                const isActive = activeLesson.id === lesson.id;
                                                return (
                                                    <button 
                                                        key={lesson.id}
                                                        onClick={() => {
                                                            setActiveLesson(lesson);
                                                            setIsPlaying(false);
                                                        }}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-white/5 text-gray-500'}`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${isActive ? 'border-white/50' : 'border-white/10'}`}>
                                                            {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <Play className="w-2.5 h-2.5" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-[11px] font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>{lesson.title}</p>
                                                            <p className="text-[9px] opacity-40 font-bold">{lesson.duration}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                    {/* Navigation Buttons Footer */}
                    <div className="p-4 bg-black/20 border-t border-white/5 grid grid-cols-2 gap-3 shrink-0">
                        <button 
                            onClick={handlePrevLesson}
                            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-white/5"
                        >
                            <ArrowLeft className="w-3 h-3" /> Anterior
                        </button>
                        <button 
                            onClick={handleNextLesson}
                            className="flex items-center justify-center gap-2 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-widest"
                        >
                            Siguiente <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
