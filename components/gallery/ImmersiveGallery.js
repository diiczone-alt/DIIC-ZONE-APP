'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, X, Image as ImageIcon, Film, Info, Calendar, Download, Monitor } from 'lucide-react';

export default function ImmersiveGallery() {
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Mock Data
    const screens = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        type: i % 3 === 0 ? 'video' : 'image',
        title: `Asset_Core_${100 + i}`,
        subtitle: i % 2 === 0 ? 'Campaña Nike' : 'Evento Red Bull',
        date: '14 Oct 2024',
        size: '124 MB',
        status: i % 5 === 0 ? 'processing' : 'ready',
        color: ['#6366f1', '#a855f7', '#10b981', '#ec4899', '#3b82f6'][i % 5]
    }));

    // Transform scroll into Z-depth movement
    const zProgress = useSpring(useTransform(scrollYProgress, [0, 1], [0, -2500]), {
        stiffness: 50,
        damping: 20
    });

    const activeItem = activeIndex !== null ? screens.find(s => s.id === activeIndex) : null;

    // SPACEBAR HANDLER: Auto-Scroll & Fullscreen
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent default page scroll jump

                // Toggle Fullscreen
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch((err) => {
                        console.log(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                } else {
                    // Optional: Exit fullscreen on second press? Or just toggle scroll. 
                    // User said "adjust screen" -> mostly implies entering it.
                    // Let's keep it simple: Space always toggles Scroll, and tries to Ensure Fullscreen.
                }

                // Toggle Auto Scroll
                setIsAutoScrolling(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // AUTO SCROLL ANIMATION LOOP
    useEffect(() => {
        let animationFrameId;

        const animateScroll = () => {
            if (isAutoScrolling) {
                // Scroll down by a small amount each frame
                window.scrollBy({ top: 2, behavior: 'instant' });

                // Check if we hit bottom
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
                    setIsAutoScrolling(false); // Stop at bottom
                } else {
                    animationFrameId = requestAnimationFrame(animateScroll);
                }
            }
        };

        if (isAutoScrolling) {
            animationFrameId = requestAnimationFrame(animateScroll);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isAutoScrolling]);


    return (
        <div ref={containerRef} className="h-[400vh] relative bg-[#020205]">

            {/* STICKY VIEWPORT */}
            <div className="sticky top-0 h-screen w-full overflow-hidden perspective-container">

                {/* AMBIENT LIGHTING */}
                <div className="absolute inset-0 bg-radial-gradient from-purple-900/10 via-[#020205] to-[#020205] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl pointer-events-none" />

                {/* 3D TUNNEL CONTAINER */}
                <div className="w-full h-full relative preserve-3d flex items-center justify-center">

                    <motion.div
                        style={{ z: zProgress }}
                        className="relative w-full h-full preserve-3d"
                    >
                        {screens.map((screen, i) => {
                            const zPos = i * 400;
                            const xPos = Math.sin(i * 0.5) * 400;
                            const yPos = Math.cos(i * 0.5) * 250;
                            const rotateY = Math.sin(i * 0.5) * -15;

                            return (
                                <ScreenNode
                                    key={screen.id}
                                    data={screen}
                                    x={xPos}
                                    y={yPos}
                                    z={zPos}
                                    rotateY={rotateY}
                                    isActive={activeIndex === screen.id}
                                    onClick={() => setActiveIndex(activeIndex === screen.id ? null : screen.id)}
                                />
                            );
                        })}
                    </motion.div>

                </div>

                {/* HUD OVERLAY */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-40 p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 uppercase tracking-tighter">
                                Galería Neural
                            </h1>
                            <p className="text-xs font-bold text-purple-500 uppercase tracking-[0.3em]">Visualización de Activos v4.0</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <div className="text-2xl font-black text-white">24</div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Activos Cargados</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pointer-events-auto">
                        <button
                            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                            className={`px-6 py-2 backdrop-blur-md rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all
                                ${isAutoScrolling ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}
                            `}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${isAutoScrolling ? 'bg-white animate-pulse' : 'bg-purple-500'}`} />
                            {isAutoScrolling ? 'Navegando...' : 'Presiona ESPACIO para Navegar'}
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 w-64 opacity-50">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className={`h-1 bg-white/20 rounded-full ${i === 0 ? 'bg-purple-500' : ''}`} />
                        ))}
                    </div>
                </div>

                {/* ACTIVE ITEM DETAILS PANEL */}
                <AnimatePresence>
                    {activeItem && (
                        <motion.div
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            className="absolute top-0 right-0 h-full w-96 bg-black/80 backdrop-blur-xl border-l border-white/10 z-[70] p-8 flex flex-col pointer-events-auto"
                        >
                            <button
                                onClick={() => setActiveIndex(null)}
                                className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6 mt-4">
                                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    {activeItem.type === 'video' ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                                    {activeItem.type}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-1">{activeItem.title}</h2>
                                <p className="text-gray-400 text-sm">{activeItem.subtitle}</p>
                            </div>

                            <div className="aspect-video bg-white/5 rounded-2xl mb-6 relative overflow-hidden group border border-white/10">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {activeItem.type === 'video' ? (
                                        <Play className="w-12 h-12 text-white/50 group-hover:text-white transition-colors" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-white/20 group-hover:text-white/40 transition-colors" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 right-3 text-[10px] font-mono bg-black/50 px-2 py-1 rounded text-white">
                                    PREVIEW
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span>Fecha</span>
                                    </div>
                                    <span className="text-white font-medium text-sm">{activeItem.date}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Info className="w-4 h-4 text-gray-500" />
                                        <span>Tamaño</span>
                                    </div>
                                    <span className="text-white font-medium text-sm">{activeItem.size}</span>
                                </div>
                            </div>

                            <div className="mt-auto space-y-3">
                                <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" /> Descargar
                                </button>
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/5">
                                    Compartir
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <style jsx global>{`
                .perspective-container {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .bg-radial-gradient {
                    background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
                }
            `}</style>
        </div>
    );
}

function ScreenNode({ data, x, y, z, rotateY, isActive, onClick }) {
    return (
        <motion.div
            onClick={onClick}
            className={`absolute top-1/2 left-1/2 w-[400px] h-[250px] -ml-[200px] -mt-[125px] cursor-pointer group preserve-3d`}
            style={{
                transform: `translate3d(${x}px, ${y}px, ${-z}px) rotateY(${rotateY}deg)`,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 - (z * 0.0001) }}
            viewport={{ margin: "-100px" }}
        >
            <div className={`w-full h-full relative rounded-xl border border-white/10 bg-black/80 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] ${isActive ? 'scale-110 z-50 border-purple-500 shadow-[0_0_100px_rgba(168,85,247,0.5)] bg-black' : 'scale-100'}`}>
                <div
                    className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(45deg, ${data.color}20, ${data.color}10)` }}
                />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {data.type === 'video' ? <Film className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{data.title}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="w-1 h-1 rounded-full bg-white/50" />
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                    <div className="w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <div className="text-[9px] text-gray-400 font-mono bg-black/80 px-2 py-0.5 rounded border border-white/10">
                    Z-DEPTH: {z} // ID: {data.id}
                </div>
            </div>
        </motion.div>
    );
}
