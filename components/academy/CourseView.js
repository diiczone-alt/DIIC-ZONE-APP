'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, ChevronLeft, CheckCircle, Lock,
    FileText, Download, MessageSquare, Share2, Star
} from 'lucide-react';

export default function CourseView({ course, onBack }) {
    const [activeLesson, setActiveLesson] = useState(0);
    const [activeTab, setActiveTab] = useState('content'); // content, resources, community

    // Mock Syllabus Generator
    const lessons = course.topics.map((topic, i) => ({
        id: i,
        title: topic,
        duration: "15 min",
        completed: i < (course.progress / 20), // rough calc
        locked: i > 2
    }));

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            {/* Top Bar relative to dashboard, but sticky here */}
            <div className="sticky top-0 z-50 bg-[#050511]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h2 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Course Viewer</h2>
                        <h1 className="font-bold text-white text-lg leading-none">{course.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-gray-500 font-bold uppercase">Progress</div>
                        <div className="font-mono text-violet-400">{course.progress}% Completed</div>
                    </div>
                    {/* Share / Cert buttons could go here */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 lg:p-8 grid lg:grid-cols-3 gap-8">

                {/* Left: Player & Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden relative group">
                        <div className={`absolute inset-0 ${course.bgColor} opacity-5 bg-[url('/noise.svg')]`} />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-20 h-20 rounded-full ${course.bg} flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-2xl relative z-10 group-hover:bg-white group-hover:text-black transition-colors ${course.color}`}
                            >
                                <Play className="w-8 h-8 fill-current ml-1" />
                            </motion.button>
                        </div>

                        {/* Video Controls overlay (fake) */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                                <div className="h-full w-1/3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold">
                                <span>04:20 / 15:00</span>
                                <div>HD • 1x</div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Title & Desc */}
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{lessons[activeLesson].title}</h2>
                        <p className="text-gray-400 leading-relaxed">
                            En esta lección aprenderemos los fundamentos esenciales. Toma nota y revisa los recursos adjuntos para profundizar.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-white/5 flex gap-8">
                        {['Content', 'Resources', 'Community'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`pb-4 text-sm font-bold uppercase tracking-widest relative ${activeTab === tab.toLowerCase() ? 'text-white' : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && (
                                    <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[200px]">
                        {activeTab === 'resources' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-colors">
                                    <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-white">Workbook del Curso.pdf</div>
                                        <div className="text-xs text-gray-500">2.4 MB • PDF Document</div>
                                    </div>
                                    <Download className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-colors">
                                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-white">Plantilla de Calendario.xlsx</div>
                                        <div className="text-xs text-gray-500">1.2 MB • Excel Spreadsheet</div>
                                    </div>
                                    <Download className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                        )}
                        {activeTab === 'content' && (
                            <div className="text-gray-400 text-sm">
                                <p>Selecciona una lección para ver su contenido detallado.</p>
                            </div>
                        )}
                        {activeTab === 'community' && (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                                <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                                <p>Únete a la discusión en el canal de Discord exclusivo para alumnos.</p>
                                <button className="mt-4 px-6 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-lg transition-colors">
                                    Ir a Discord
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right: Syllabus */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0E0E18] rounded-3xl border border-white/5 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="font-bold text-white mb-1">Temario del Curso</h3>
                            <div className="text-xs text-gray-500">{activeLesson + 1} de {lessons.length} lecciones</div>

                            {/* Overall Progress */}
                            <div className="h-1 w-full bg-gray-800 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-violet-500 w-[15%]" />
                            </div>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {lessons.map((lesson, idx) => (
                                <button
                                    key={lesson.id}
                                    disabled={lesson.locked}
                                    onClick={() => setActiveLesson(idx)}
                                    className={`w-full text-left p-4 flex gap-4 transition-all border-b border-white/5 hover:bg-white/5 ${activeLesson === idx ? 'bg-white/5 border-l-2 border-l-violet-500' : 'opacity-80'
                                        } ${lesson.locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                                >
                                    <div className="mt-1">
                                        {lesson.completed ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : lesson.locked ? (
                                            <Lock className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <div className={`w-4 h-4 rounded-full border-2 ${activeLesson === idx ? 'border-violet-500' : 'border-gray-600'}`} />
                                        )}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-bold mb-1 ${activeLesson === idx ? 'text-white' : 'text-gray-400'}`}>
                                            {lesson.title}
                                        </div>
                                        <div className="text-[10px] text-gray-600 font-mono flex items-center gap-2">
                                            <Play className="w-2 h-2" /> {lesson.duration}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
