'use client';

import { useState } from 'react';
import {
    BookOpen, Play, CheckCircle, Lock,
    Award, Star, Filter, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AcademyPage() {
    const [activeTab, setActiveTab] = useState('all'); // all, required, completed

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            {/* Header */}
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-purple-500" /> Academia DIIC
                        <span className="text-xs font-normal bg-purple-500/10 text-purple-400 px-2 py-1 rounded-lg border border-purple-500/20">Beta</span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Sube de nivel y desbloquea mejores tarifas.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[#0E0E18] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Tu Nivel Actual</p>
                            <p className="text-sm font-bold text-white">Nivel 3 • Pro</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">3</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* Search & Tabs */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text" placeholder="Buscar curso, habilidad o rol..."
                            className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'required', 'completed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                            >
                                {tab === 'all' ? 'Todos' : tab === 'required' ? 'Para subir de nivel' : 'Completados'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* Featured / Required Course */}
                    <CourseCard
                        title="Liderazgo Creativo en Set"
                        category="Filmmaker • Soft Skills"
                        duration="2h 15m"
                        lessons={8}
                        level="Req. Nivel 4"
                        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                        status="locked"
                        progress={0}
                    />

                    <CourseCard
                        title="Técnicas Avanzadas de Color"
                        category="Editor • Técnico"
                        duration="4h 30m"
                        lessons={14}
                        level="Opcional"
                        image="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44e?auto=format&fit=crop&q=80&w=800"
                        status="in_progress"
                        progress={65}
                    />

                    <CourseCard
                        title="Protocolo DIIC ZONE"
                        category="Onboarding"
                        duration="45m"
                        lessons={4}
                        level="Básico"
                        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
                        status="completed"
                        progress={100}
                    />

                </div>

            </main>
        </div>
    );
}

function CourseCard({ title, category, duration, lessons, level, image, status, progress }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group cursor-pointer flex flex-col h-full"
        >
            <div className="h-40 relative overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase">
                    {level}
                </div>
                {status === 'completed' && (
                    <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] text-purple-400 font-bold uppercase mb-2">{category}</p>
                <h3 className="font-bold text-white mb-2 line-clamp-2">{title}</h3>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 mt-auto">
                    <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {lessons} lecciones</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duration}</span>
                </div>

                {status === 'locked' ? (
                    <button className="w-full py-2 bg-white/5 text-gray-500 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-3 h-3" /> Bloqueado (Necesitas Nivel 3)
                    </button>
                ) : (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>Progreso</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
