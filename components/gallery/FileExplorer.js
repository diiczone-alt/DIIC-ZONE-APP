'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, Maximize2, Share2, Info, Grid, List, Pause, MonitorPlay } from 'lucide-react';

const MOCK_FILES = [
    { id: 1, name: 'Campaign Summer v2', type: 'video', album: 'campaigns', size: '120MB', date: '2h ago', department: 'Filmmaker', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80', description: 'Main broadcast export for Q3 Campaign.' },
    { id: 2, name: 'Moodboard Q3', type: 'design', album: 'campaigns', size: '4.5MB', date: '5h ago', department: 'Design', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'Visual direction for the upcoming season.' },
    { id: 3, name: 'Podcast Ep1 Master', type: 'audio', album: 'shoots', size: '45MB', date: '1d ago', department: 'Audio', image: 'https://images.unsplash.com/photo-1478737270239-2f52b27e90f3?w=800&q=80', description: 'Final mix with leveled vocals.' },
    { id: 4, name: 'Brand Guidelines', type: 'design', album: 'events-2024', size: '12MB', date: '2d ago', department: 'Design', image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&q=80', description: 'Updated typography and logo usage rules.' },
    { id: 5, name: 'Social Reels Batch', type: 'video', album: 'shoots', count: 12, date: '3d ago', department: 'Social', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', description: 'Vertical content ready for scheduling.' },
    { id: 6, name: 'Event Recap 2024', type: 'video', album: 'events-2024', size: '2GB', date: '1w ago', department: 'Filmmaker', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', description: 'Full coverage of the annual event.' },
    { id: 7, name: 'Personal Portfolio', type: 'photo', album: 'personal', size: '150MB', date: '2w ago', department: 'Photography', image: 'https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80', description: 'Selected shots for portfolio.' },
];

export default function FileExplorer({ category, viewMode }) {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const filteredFiles = useMemo(() => {
        if (!category || category.id === 'all') return MOCK_FILES;

        // Filter by type or album
        return MOCK_FILES.filter(file =>
            file.type === category.id || file.album === category.id
        );
    }, [category]);

    // Reset focused index when category changes
    useEffect(() => {
        if (focusedIndex >= filteredFiles.length && filteredFiles.length > 0) {
            setFocusedIndex(0);
        }
    }, [category, filteredFiles.length]);

    const nextSlide = useCallback(() => setFocusedIndex(prev => (prev + 1) % filteredFiles.length), [filteredFiles.length]);
    const prevSlide = useCallback(() => setFocusedIndex(prev => (prev - 1 + filteredFiles.length) % filteredFiles.length), [filteredFiles.length]);

    // PRESETATION MODE: Auto-Play
    useEffect(() => {
        let interval;
        if (isPlaying && filteredFiles.length > 0) {
            interval = setInterval(() => {
                nextSlide();
            }, 3000); // Change slide every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isPlaying, nextSlide, filteredFiles.length]);

    const togglePresentation = () => {
        const newState = !isPlaying;
        setIsPlaying(newState);
        if (newState) {
            // Request Fullscreen for immersive experience
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => console.log(err));
            }
        } else {
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.log(err));
            }
        }
    };

    if (filteredFiles.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Info className="w-12 h-12 mb-4 opacity-50" />
                <p>No hay archivos en esta categoría.</p>
            </div>
        );
    }

    const activeFile = filteredFiles[focusedIndex];

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-black/40 rounded-[2rem]">
            {/* Cinematic Noise Texture */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Ambient Background (Blurred Active Image) */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeFile ? activeFile.image : 'empty'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-3xl scale-125 saturate-150"
                        style={{ backgroundImage: `url(${activeFile ? activeFile.image : ''})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
                </motion.div>
            </AnimatePresence>

            {/* Cinematic Carousel */}
            <div className="flex-1 relative z-10 flex items-center justify-center perspective-1000">
                {/* Navigation Arrows (Hidden during presentation) */}
                {!isPlaying && (
                    <>
                        <button onClick={prevSlide} className="absolute left-8 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/20 hidden md:block group">
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button onClick={nextSlide} className="absolute right-8 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/20 hidden md:block group">
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </>
                )}

                {/* Cards Track */}
                <div className="flex h-[65vh] items-center justify-center">
                    {filteredFiles.map((file, idx) => {
                        const offset = idx - focusedIndex;
                        const isActive = offset === 0;

                        if (Math.abs(offset) > 2) return null;

                        return (
                            <motion.div
                                key={file.id}
                                layout
                                initial={false}
                                animate={{
                                    x: offset * 340,
                                    scale: isActive ? 1.15 : 0.85,
                                    rotateY: isActive ? 0 : offset > 0 ? -25 : 25, // Less rotation for cleaner look
                                    zIndex: isActive ? 100 : 10 - Math.abs(offset),
                                    opacity: isActive ? 1 : 0.4,
                                    filter: isActive ? 'brightness(100%)' : 'brightness(30%) blur(4px)'
                                }}
                                transition={{ type: "spring", stiffness: 180, damping: 25 }}
                                className="absolute w-[320px] md:w-[420px] aspect-[9/16] cursor-pointer origin-center perspective-origin-center group"
                                onClick={() => setFocusedIndex(idx)}
                            >
                                {/* Main Card */}
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                                    <img src={file.image} alt={file.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                                    {/* Active Overlay Content */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center"
                                        >
                                            <button className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center group hover:scale-105 transition-transform duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white"></div>
                                                    <Play className="w-6 h-6 text-black ml-1 relative z-10" fill="currentColor" />
                                                </div>
                                            </button>

                                            <div className="absolute bottom-12 px-10 text-center w-full">
                                                <motion.p
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="text-[#FDBB2F] text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
                                                >
                                                    {file.department}
                                                </motion.p>
                                                <motion.h2
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="text-4xl md:text-5xl font-black text-white uppercase leading-[0.9] mb-4 font-display tracking-tight"
                                                >
                                                    {file.name}
                                                </motion.h2>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="w-12 h-1 bg-[#FDBB2F] mx-auto mb-4 rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Reflection Effect */}
                                <div className="absolute -bottom-[100%] left-0 right-0 h-full scale-y-[-1] opacity-30 mask-linear-fade pointer-events-none">
                                    <img src={file.image} alt="" className="w-full h-full object-cover blur-sm rounded-2xl" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Controls */}
            {activeFile && (
                <div className="h-24 relative z-20 flex items-center justify-between px-12 border-t border-white/5 bg-black/20 backdrop-blur-lg">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                            <span className="text-white text-lg font-bold">0{focusedIndex + 1}</span>
                            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                                <motion.div
                                    className="absolute top-0 bottom-0 left-0 bg-[#FDBB2F] shadow-[0_0_10px_#FDBB2F]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((focusedIndex + 1) / filteredFiles.length) * 100}%` }}
                                />
                            </div>
                            <span>0{filteredFiles.length}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* PRESENTATION TOGGLE */}
                        <button
                            onClick={togglePresentation}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isPlaying ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                        >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <MonitorPlay className="w-3 h-3" />}
                            {isPlaying ? 'Pausar' : 'Presentación 3D'}
                        </button>

                        <div className="h-8 w-[1px] bg-white/10 hidden lg:block"></div>

                        <p className="text-white/60 text-xs max-w-xs text-right hidden lg:block font-medium">
                            {activeFile.description}
                        </p>
                        <div className="h-8 w-[1px] bg-white/10 hidden lg:block"></div>
                        <button className="px-8 py-3 bg-[#FDBB2F] text-black font-extrabold text-xs tracking-widest uppercase rounded-lg hover:bg-white transition-all hover:shadow-[0_0_30px_rgba(253,187,47,0.4)]">
                            Abrir Proyecto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
