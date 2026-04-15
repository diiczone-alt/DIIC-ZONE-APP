'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Clock, Star, TrendingUp, Search,
    BookOpen, Trophy, Lock
} from 'lucide-react';
import { ACADEMY_COURSES } from '@/data/academyCourses';

export default function AcademyDashboard({ onSelectCourse }) {
    const [filter, setFilter] = useState('all');

    return (
        <div className="min-h-screen bg-[#050511] text-white p-6 pb-24">
            {/* Header / Hero */}
            <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-white/10 p-8 mb-12 overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest mb-4">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span>DIIC Academy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Domina tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Potencial Creativo</span>.
                    </h1>
                    <p className="text-lg text-gray-300 font-light mb-8">
                        Cursos diseñados para creadores, agencias y emprendedores digitales. Aprende habilidades de alto valor hoy mismo.
                    </p>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#050511]/50 rounded-lg border border-white/5">
                            <Clock className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-bold">12h Aprendidas</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#050511]/50 rounded-lg border border-white/5">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-bold">3 Certificados</span>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-violet-600/20 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px]" />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['all', 'Básico', 'Intermedio', 'Avanzado'].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setFilter(lvl)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === lvl
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {lvl === 'all' ? 'Todos los Cursos' : lvl}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar curso..."
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ACADEMY_COURSES
                    .filter(c => filter === 'all' || c.level === filter)
                    .map((course, idx) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onSelectCourse(course)}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-full bg-[#0E0E18] border border-white/5 rounded-3xl p-1 overflow-hidden transition-all hover:border-white/20 hover:shadow-2xl flex flex-col">
                                {/* Inner Content */}
                                <div className="bg-[#0E0E18] rounded-[1.4rem] p-6 h-full flex flex-col relative z-10">

                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-12 h-12 rounded-xl ${course.bgColor} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                                            <course.icon className={`w-6 h-6 ${course.color}`} />
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest border ${course.borderColor} ${course.color} ${course.bgColor}`}>
                                            {course.level}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-6 font-light">
                                        {course.description}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                            <span>Progreso</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${course.progress > 0 ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : 'bg-gray-700'}`}
                                                style={{ width: `${Math.max(course.progress, 0)}%` }}
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-3 h-3 fill-current" />
                                            {course.progress > 0 ? 'CONTINUAR' : 'EMPEZAR AHORA'}
                                        </div>
                                    </div>
                                </div>

                                {/* Glow Effect */}
                                <div className={`absolute -bottom-20 -right-20 w-40 h-40 ${course.bgColor.replace('10', '20')} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </div>
                        </motion.div>
                    ))}
            </div>
        </div>
    );
}
