'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Briefcase, X, Layers, ArrowUpRight } from 'lucide-react';

// Detailed Stylized SVG Path for Ecuador
const ECUADOR_SVG_PATH = "M120,40 C140,20 180,10 210,30 C240,50 280,40 310,60 C340,80 370,120 380,160 C390,200 370,260 350,300 C330,340 280,370 230,380 C180,390 120,370 80,330 C40,290 20,220 30,150 C40,80 80,60 120,40 Z";

export default function AdminOperationalMap({ clients = [], team = [] }) {
    const [filter, setFilter] = useState('both');
    const [selectedPoint, setSelectedPoint] = useState(null);

    // Precise Coordinate Projection for Ecuador
    const projectCoords = (lat, lng) => {
        const xMin = -81.5, xMax = -75.0; 
        const yMin = -5.5, yMax = 1.8;
        const x = ((lng - xMin) / (xMax - xMin)) * 400;
        const y = 400 - (((lat - yMin) / (yMax - yMin)) * 400);
        return { x, y };
    };

    const cityWorkload = useMemo(() => {
        const counts = {};
        team.forEach(m => {
            counts[m.city] = (counts[m.city] || 0) + (m.activeTasks || 0);
        });
        return counts;
    }, [team]);

    const filteredPoints = useMemo(() => {
        let points = [];
        if (filter === 'clients' || filter === 'both') {
            points = [...points, ...clients.map(c => ({ ...c, pointType: 'client' }))];
        }
        if (filter === 'team' || filter === 'both') {
            points = [...points, ...team.map(t => ({ ...t, pointType: 'team' }))];
        }
        return points.filter(p => p.coords && Array.isArray(p.coords) && p.coords.length === 2);
    }, [filter, clients, team]);

    return (
        <div className="relative bg-[#050511] border border-white/5 rounded-[40px] overflow-hidden min-h-[600px] flex items-center justify-center p-10 group/map">
            
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/noise.svg')]" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

            {/* Filter Controls */}
            <div className="absolute top-10 left-10 z-20 flex flex-col gap-3">
                <button 
                    onClick={() => setFilter('both')}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-xl ${filter === 'both' ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                >
                    <Layers className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Vista Estratégica</span>
                </button>
                <div className="h-4" />
                <button 
                    onClick={() => setFilter('clients')}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-xl ${filter === 'clients' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> <span className="text-[10px] font-black uppercase tracking-widest">Socios ({clients.length})</span>
                </button>
                <button 
                    onClick={() => setFilter('team')}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-xl ${filter === 'team' ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                >
                    <div className="w-2 h-2 rounded-full bg-blue-400" /> <span className="text-[10px] font-black uppercase tracking-widest">Nodos ({team.length})</span>
                </button>
            </div>

            {/* Satellite Stats (Saturation) */}
            <div className="absolute top-10 right-10 z-20 space-y-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-right">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Carga Global</div>
                    <div className="text-2xl font-black text-white italic">
                        {Object.values(cityWorkload).reduce((a, b) => a + b, 0)} <span className="text-[10px] opacity-40">TASKS</span>
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center p-12">
                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                    <defs>
                        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="warningGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Ecuador Map */}
                    <path d={ECUADOR_SVG_PATH} fill="rgba(0,0,0,0.4)" transform="translate(10, 10)" className="blur-xl" />
                    <motion.path
                        d={ECUADOR_SVG_PATH}
                        fill="rgba(99,102,241,0.03)"
                        stroke="rgba(99,102,241,0.2)"
                        strokeWidth="2"
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        transition={{ duration: 2 }}
                    />

                    {/* Points Layer */}
                    {filteredPoints.map((p, i) => {
                        const coords = p.coords || [];
                        if (coords.length < 2) return null;
                        
                        const { x, y } = projectCoords(coords[0], coords[1]);
                        const isClient = p.pointType === 'client';
                        const cityName = p.city || 'Desconocido';
                        const cityLoad = cityWorkload[cityName] || 0;
                        const isSaturated = cityLoad > 8;
                        const dotColor = isClient ? '#10b981' : (isSaturated ? '#ef4444' : '#3b82f6');
                        
                        return (
                            <motion.g 
                                key={`${p.id || i}-${i}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="cursor-pointer group/pin"
                                onClick={() => setSelectedPoint(p)}
                            >
                                <circle cx={x} cy={y} r={isSaturated ? "20" : "10"} fill={dotColor} className="opacity-10 animate-ping" />
                                <circle cx={x} cy={y} r="4" fill={dotColor} stroke="white" strokeWidth="1.5" />
                                <text x={x} y={y - 12} textAnchor="middle" className="text-[7px] font-black fill-white tracking-tighter opacity-0 group-hover/pin:opacity-100 transition-opacity">
                                    {cityName.toUpperCase()}
                                </text>
                            </motion.g>
                        );
                    })}
                </svg>
            </div>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selectedPoint && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="absolute right-10 top-10 bottom-10 w-80 bg-[#0A0A1F]/95 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 z-30 flex flex-col shadow-2xl"
                    >
                        <button onClick={() => setSelectedPoint(null)} className="self-end p-2 hover:bg-white/5 rounded-full">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="mt-6 flex-1">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${selectedPoint.pointType === 'client' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {selectedPoint.pointType === 'client' ? <Briefcase className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                            </div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1">{selectedPoint.name}</h3>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-indigo-500" /> {selectedPoint.city}
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Sector</span>
                                    <span className="text-sm font-bold text-white">{selectedPoint.type || selectedPoint.role}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Estado</span>
                                    <span className={`text-sm font-bold ${selectedPoint.pointType === 'client' ? 'text-emerald-500' : 'text-blue-400'}`}>
                                        {selectedPoint.status || selectedPoint.availability}
                                    </span>
                                </div>
                                {selectedPoint.pointType === 'team' && (
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Carga Local</span>
                                        <span className={`text-sm font-black ${cityWorkload[selectedPoint.city] > 8 ? 'text-red-500' : 'text-blue-400'}`}>
                                            {cityWorkload[selectedPoint.city]} Tasks
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="mt-auto w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                            Ver Perfil Estratégico <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-10 right-10 text-right pointer-events-none opacity-40">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Global Network</div>
                <div className="text-xl font-black text-white italic tracking-tighter uppercase">DIIC ZONE HQ</div>
            </div>
        </div>
    );
}
