'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ChevronLeft, Play, CheckCircle, Clock, 
    ChevronDown, ChevronUp, Lock, Share2, 
    MoreVertical, ArrowLeft, ArrowRight,
    Trophy, BookOpen, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_COURSES } from '@/data/workstationData';

export default function CoursePlayerPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [activeLessonId, setActiveLessonId] = useState('l1');
    const [expandedModules, setExpandedModules] = useState(['Módulo 1: Psicología del Texto']);

    const course = ACADEMY_COURSES.find(c => c.id === id) || ACADEMY_COURSES[0];

    const toggleModule = (moduleTitle) => {
        setExpandedModules(prev => 
            prev.includes(moduleTitle) 
                ? prev.filter(t => t !== moduleTitle) 
                : [...prev, moduleTitle]
        );
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Player Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E18] shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-white/5" />
                    <div>
                        <h1 className="text-xs font-black uppercase tracking-widest text-indigo-400">Academy Player</h1>
                        <p className="text-sm font-bold text-white truncate max-w-[400px]">{course.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '20%' }} />
                        </div>
                        <span className="text-[10px] font-black text-white">20% COMPLETADO</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white"><Share2 className="w-4 h-4" /></button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Player Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Video Stage */}
                    <div className="aspect-video bg-black relative group cursor-pointer overflow-hidden">
                        <img 
                            src={course.image} 
                            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" 
                            alt="Video Thumbnail"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-indigo-500/20"
                            >
                                <Play className="w-10 h-10 text-black fill-black ml-1" />
                            </motion.div>
                        </div>
                        
                        {/* Video Controls Overlay (Mock) */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-6">
                                <Play className="w-6 h-6 text-white" />
                                <div className="w-96 h-1 bg-white/20 rounded-full relative">
                                    <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-indigo-500 rounded-full" />
                                </div>
                                <span className="text-xs font-mono text-white/70">12:34 / 45:00</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Layers className="w-5 h-5 text-white/70" />
                                <MoreVertical className="w-5 h-5 text-white/70" />
                            </div>
                        </div>
                    </div>

                    {/* Lesson Info */}
                    <div className="p-10 max-w-4xl mx-auto w-full space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded border border-indigo-500/20">Clase Actual</span>
                                <span className="text-xs text-gray-500 font-medium">• Lección 2 de 12</span>
                            </div>
                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight italic uppercase">Psychology of Motion Graphics</h2>
                            <p className="text-lg text-gray-400 leading-relaxed font-medium">
                                En esta lección exploraremos por qué el ojo humano reacciona de manera diferente a distintos ritmos de animación y cómo podemos usar esto para capturar la atención en los primeros milisegundos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                                <h4 className="text-sm font-bold text-white mb-4">Recursos de la clase</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                                        <span className="text-xs font-bold">Cheatsheet_Dynamic_Captions.pdf</span>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                                        <span className="text-xs font-bold">Project_Files.zip</span>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Recompensa VIP</h4>
                                </div>
                                <p className="text-xs text-indigo-200/60 leading-relaxed">Completa este módulo para desbloquear el preset exclusivo de "Neon Glow Titles" para Premiere.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum Sidebar */}
                <aside className="w-[400px] border-l border-white/5 bg-[#0E0E18] flex flex-col shrink-0">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-500" /> Plan de Estudios
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                            {module.lessons.map((lesson) => (
                                                <button 
                                                    key={lesson.id}
                                                    onClick={() => setActiveLessonId(lesson.id)}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeLessonId === lesson.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5 text-gray-500'}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${activeLessonId === lesson.id ? 'border-white/50' : 'border-white/10'}`}>
                                                        {lesson.completed ? <CheckCircle className="w-4 h-4" /> : <Play className="w-3 h-3" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[11px] font-bold truncate ${activeLessonId === lesson.id ? 'text-white' : 'text-gray-300'}`}>{lesson.title}</p>
                                                        <p className="text-[10px] opacity-40 font-bold">{lesson.duration}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                    {/* Navigation Buttons Footer */}
                    <div className="p-4 bg-black/20 border-t border-white/5 grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest">
                            <ArrowLeft className="w-3 h-3" /> Anterior
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest">
                            Siguiente <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
