'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    BookOpen, Play, CheckCircle, Lock,
    Clock, Search, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AcademyPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('all'); 
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-8 right-8 z-[200] px-6 py-3 bg-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-gray-500 mb-1 group cursor-pointer" onClick={() => router.push('/workstation/editor')}>
                        <motion.div 
                            whileHover={{ x: -4 }}
                            className="p-1 bg-white/5 rounded border border-white/5 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all"
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </motion.div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">Volver a Bandeja</span>
                    </div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <BookOpen className="w-6 h-6 text-purple-500" /> Academia DIIC
                        <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">BETA</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[#0E0E18] border border-white/10 rounded-2xl px-5 py-2 flex items-center gap-4 shadow-xl">
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Nivel Actual</p>
                            <p className="text-xs font-black text-white uppercase tracking-tighter">Nivel 3 • Pro</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black shadow-inner border border-white/5">3</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12">

                {/* Search & Tabs */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text" placeholder="Buscar curso, habilidad o rol..."
                            className="w-full bg-[#0E0E18] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'required', 'completed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                            >
                                {tab === 'all' ? 'Todos' : tab === 'required' ? 'Retos Nivel 4' : 'Completados'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <CourseCard
                        title="Liderazgo Creativo en Set"
                        category="Filmmaker • Soft Skills"
                        duration="2h 15m"
                        lessons={8}
                        level="Req. Nivel 4"
                        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                        status="locked"
                        progress={0}
                        onAction={() => showToast('Curso bloqueado. Sube a Nivel 4.')}
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
                        onAction={() => router.push('/workstation/editor/academy/1')}
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
                        onAction={() => showToast('Curso ya completado.')}
                    />
                </div>
            </main>
        </div>
    );
}

function CourseCard({ title, category, duration, lessons, level, image, status, progress, onAction }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onAction}
            className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all group cursor-pointer flex flex-col h-full shadow-2xl relative"
        >
            <div className="h-44 relative overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-[10px] font-black text-white border border-white/10 uppercase tracking-widest">
                    {level}
                </div>
                {status === 'completed' && (
                    <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-2xl">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] mb-3">{category}</p>
                <h3 className="font-black text-white mb-4 line-clamp-2 uppercase tracking-tight text-sm group-hover:text-purple-400 transition-colors leading-relaxed">{title}</h3>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-gray-500 mb-6 mt-auto tracking-widest">
                    <span className="flex items-center gap-1.5"><Play className="w-3 h-3" /> {lessons} lecciones</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {duration}</span>
                </div>

                {status === 'locked' ? (
                    <button className="w-full py-3 bg-white/5 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed border border-white/5">
                        <Lock className="w-3 h-3" /> Bloqueado
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 tracking-widest">
                            <span>Progreso</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-black rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'}`} style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
