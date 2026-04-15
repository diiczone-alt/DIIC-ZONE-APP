'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Users, Briefcase, Activity, Shield, Zap, 
    Globe, Cpu, BarChart3, Radar, ChevronRight, Maximize2
} from 'lucide-react';
import { 
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
    Radar as ReRadar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { agencyService } from '@/services/agencyService';

const CITIES = [
    { id: 'sto', name: 'Santo Domingo', coords: { x: 100, y: 150 }, stats: { revenue: 15.2, talent: 45, clients: 12 } },
    { id: 'uio', name: 'Quito', coords: { x: 250, y: 80 }, stats: { revenue: 22.8, talent: 68, clients: 18 } },
    { id: 'gye', name: 'Guayaquil', coords: { x: 320, y: 250 }, stats: { revenue: 18.5, talent: 52, clients: 15 } },
    { id: 'cuenca', name: 'Cuenca', coords: { x: 150, y: 320 }, stats: { revenue: 8.9, talent: 22, clients: 8 } },
];

const TALENT_NODES = [
    { id: 't1', name: 'Elite Editor A', city: 'sto', type: 'video', capacity: 85 },
    { id: 't2', name: 'Senior Designer B', city: 'uio', type: 'design', capacity: 42 },
    { id: 't3', name: 'Creative Director', city: 'gye', type: 'hq', capacity: 95 },
];

const CLIENT_NODES = [
    { id: 'c1', name: 'Global Brand X', city: 'uio', satisfaction: 98 },
    { id: 'c2', name: 'Local Hero Y', city: 'sto', satisfaction: 84 },
];

const HUB_RADAR_DATA = [
  { subject: 'Visuals', A: 120, fullMark: 150 },
  { subject: 'Speed', A: 98, fullMark: 150 },
  { subject: 'AI', A: 86, fullMark: 150 },
  { subject: 'Team', A: 99, fullMark: 150 },
  { subject: 'Innovation', A: 85, fullMark: 150 },
];

export default function Strategic3DMap() {
    const [viewMode, setViewMode] = useState('global'); // 'global' or 'city'
    const [selectedCity, setSelectedCity] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [clients, setClients] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Auto-rotation simulation
    const [rotation, setRotation] = useState(-30);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsData, teamData] = await Promise.all([
                    agencyService.getClients(),
                    agencyService.getTeam()
                ]);
                setClients(clientsData || []);
                setTeam(teamData || []);
            } catch (err) {
                console.error("Error fetching map data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (viewMode === 'global') {
            const interval = setInterval(() => setRotation(r => r + 0.1), 50);
            return () => clearInterval(interval);
        }
    }, [viewMode]);

    const activeCityData = CITIES.find(c => c.id === selectedCity);

    const handleCityZoom = (cityId) => {
        setSelectedCity(cityId);
        setViewMode('city');
        setZoomLevel(3);
    };

    const resetView = () => {
        setViewMode('global');
        setSelectedCity(null);
        setZoomLevel(1);
    };

    return (
        <div className="relative w-full h-full bg-[#030308] overflow-hidden rounded-[3rem] border border-white/5 flex flex-row p-4 gap-4 select-none group/map font-sans">
            
            {/* LEFT HUD PANEL */}
            <motion.aside 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-80 flex flex-col gap-4 z-20 relative"
            >
                {/* System Core Diagnostics */}
                <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-amber-500 font-black uppercase tracking-[0.2em]">Strategy Diagnostics</span>
                            <h3 className="text-xl font-black text-white italic">COMMAND HUD</h3>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <Shield className="w-5 h-5 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                        {/* Radar Chart Widget */}
                        <div className="h-48 relative group/radar">
                            <div className="absolute inset-0 bg-amber-500/5 rounded-3xl blur-2xl group-hover/radar:bg-amber-500/10 transition-colors" />
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={HUB_RADAR_DATA}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: 'bold' }} />
                                    <ReRadar name="Capacity" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* City Rankings */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Network Expansion</h4>
                            {CITIES.map(city => (
                                <button 
                                    key={city.id} 
                                    onClick={() => handleCityZoom(city.id)}
                                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group/city ${selectedCity === city.id ? 'bg-amber-500 text-white border-amber-400' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedCity === city.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black italic">{city.name}</p>
                                            <p className="text-[8px] opacity-40 font-bold uppercase tracking-widest">{city.stats.talent} Creativos</p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 opacity-0 group-hover/city:opacity-100 transition-all ${selectedCity === city.id ? 'translate-x-1 opacity-100' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Satellite Metrics */}
                <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 h-40">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Revenue Distribution</span>
                    </div>
                    <div className="h-full pb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CITIES}>
                                <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
                                <Bar dataKey="stats.revenue" radius={[4, 4, 0, 0]}>
                                    {CITIES.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={selectedCity === entry.id ? '#10b981' : 'rgba(255,255,255,0.05)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.aside>

            {/* MAIN MAP AREA */}
            <main className="flex-1 relative flex items-center justify-center bg-[#050511] rounded-[3rem] border border-white/5 overflow-hidden">
                {/* HUD Scan-lines Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] ml-4 mr-4" />
                <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Controls */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
                    <button 
                        onClick={resetView}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${viewMode === 'global' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        Vista Global
                    </button>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <button 
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${viewMode === 'city' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-gray-500 hover:text-white opacity-40 cursor-not-allowed'}`}
                    >
                        Nivel Urbano
                    </button>
                </div>

                {/* THE 3D SCENE */}
                <div className="w-full h-full relative perspective-[1500px] flex items-center justify-center">
                    <motion.div 
                        animate={{ 
                            rotateX: viewMode === 'global' ? 55 : 0, 
                            rotateZ: viewMode === 'global' ? rotation : 0,
                            scale: zoomLevel,
                            y: viewMode === 'city' ? 100 : 0
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 60 }}
                        className="relative w-[800px] h-[800px] preserve-3d"
                    >
                        {/* Grid Floor */}
                        <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-[100px] opacity-20" />
                        <div className="absolute inset-x-[-100px] inset-y-[-100px] border-[2px] border-amber-500/10 rounded-full animate-pulse-slow" />
                        
                        {/* Global Map Markers */}
                        {CITIES.map(city => (
                            <div 
                                key={city.id}
                                style={{ position: 'absolute', left: city.coords.x * 2, top: city.coords.y * 2 }}
                                className="preserve-3d"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => handleCityZoom(city.id)}
                                    className="relative flex flex-col items-center cursor-pointer group/marker transform-style-3d"
                                >
                                    {/* Holographic Pillar */}
                                    <div className={`w-8 bg-gradient-to-t rounded-full transform-style-3d ${selectedCity === city.id ? 'h-40 from-amber-600/80 to-amber-400 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.5)]' : 'h-16 from-white/10 to-white/30 border-white/20'}`} style={{ transform: 'rotateX(-90deg) translateZ(10px)' }}>
                                        <div className="absolute inset-0 w-full h-full animate-scan" style={{ background: 'linear-gradient(transparent, rgba(255,255,255,0.4), transparent)' }} />
                                    </div>

                                    {/* Label HUD */}
                                    <div 
                                        className="absolute -top-12 flex flex-col items-center"
                                        style={{ transform: viewMode === 'global' ? `rotateZ(${-rotation}deg) rotateX(-55deg) translateZ(40px)` : 'none' }}
                                    >
                                        <div className={`px-4 py-2 rounded-xl backdrop-blur-2xl border ${selectedCity === city.id ? 'bg-amber-600/90 border-amber-400 shadow-2xl scale-125' : 'bg-black/60 border-white/10 opacity-60 group-hover/marker:opacity-100 group-hover/marker:scale-110'} transition-all`}>
                                            <p className="text-[10px] font-black text-white italic whitespace-nowrap uppercase tracking-tighter">{city.name}</p>
                                            <p className="text-[7px] text-gray-400 font-black tracking-widest mt-0.5">ESTRATEGIC HUB</p>
                                        </div>
                                        <div className="w-[1px] h-8 bg-white/20 mt-1" />
                                    </div>
                                </motion.div>
                            </div>
                        ))}

                        {/* Connection Beams Layer (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible preserve-3d" style={{ transform: 'translateZ(1px)' }}>
                            <defs>
                                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {viewMode === 'global' && CITIES.slice(0, -1).map((city, i) => {
                                const nextCity = CITIES[i+1];
                                return (
                                    <motion.line
                                        key={`beam-${i}`}
                                        x1={city.coords.x * 2}
                                        y1={city.coords.y * 2}
                                        x2={nextCity.coords.x * 2}
                                        y2={nextCity.coords.y * 2}
                                        stroke="url(#beamGrad)"
                                        strokeWidth="2"
                                        strokeDasharray="10,10"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.3, strokeDashoffset: -100 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    />
                                );
                            })}
                        </svg>

                        {/* Internal City Logic (Simulated when zoomed) */}
                        <AnimatePresence>
                            {viewMode === 'city' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    {/* Local Grid HUD */}
                                    <div className="w-[120%] h-[120%] border border-emerald-500/20 rounded-full animate-spin-slow opacity-20" />
                                    <div className="w-1/2 h-1/2 border-2 border-emerald-400/20 rounded-full flex items-center justify-center p-20">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-white rounded-full font-black text-[10px] tracking-widest uppercase shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                                            Scanning City Nucleus: {activeCityData?.name}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>

            {/* RIGHT DATA PANEL */}
            <motion.aside 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-96 flex flex-col gap-4 z-20 relative"
            >
                {/* Node Detail HUD */}
                <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 rotate-12 opacity-5 pointer-events-none">
                        <Globe className="w-40 h-40 text-amber-500" />
                    </div>

                    {!selectedCity ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 group/empty">
                            <div className="w-20 h-20 rounded-full border border-dashed border-gray-600 flex items-center justify-center mb-6 group-hover/empty:scale-110 transition-transform">
                                <Maximize2 className="w-8 h-8 text-gray-600" />
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Selecciona un Hub para<br/>Análisis de Nivel Urbano</p>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col"
                        >
                            <div className="mb-10">
                                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em]">Nivel Urbano Activo</span>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">{activeCityData.name}</h3>
                            </div>

                            <div className="space-y-8 flex-1">
                                {/* City Sub-Nodes (Creatives vs Clients) */}
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Users className="w-3 h-3" /> Creative Distribution
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {TALENT_NODES.filter(t => t.city === selectedCity).map(talent => (
                                            <div key={talent.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl group/talent cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/30 transition-all">
                                                <p className="text-[9px] font-black text-white italic group-hover/talent:text-amber-400">{talent.name}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-[8px] text-gray-500 uppercase font-bold">{talent.type}</span>
                                                    <span className="text-[8px] text-emerald-400 font-black">{talent.capacity}% OK</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase className="w-3 h-3 text-emerald-400" /> Client Hub Analysis
                                    </h4>
                                    <div className="space-y-3">
                                        {CLIENT_NODES.filter(c => c.city === selectedCity).map(client => (
                                            <div key={client.id} className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between group/client cursor-pointer hover:bg-emerald-500/10 transition-all">
                                                <div>
                                                    <p className="text-[10px] font-black text-white italic uppercase">{client.name}</p>
                                                    <p className="text-[8px] text-gray-500 uppercase font-bold">Priority Status</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-emerald-400 italic leading-none">{client.satisfaction}%</p>
                                                    <p className="text-[7px] text-gray-600 uppercase font-black">Satisfaction</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={resetView}
                                className="mt-8 w-full py-5 bg-white text-black rounded-3xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-2xl shadow-white/10"
                            >
                                Reestablecer Vista Global
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Network Status HUD */}
                <div className="bg-emerald-500/5 backdrop-blur-3xl border border-emerald-500/10 rounded-[2.5rem] p-6 h-32 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 relative overflow-hidden">
                        <Zap className="w-8 h-8 relative z-10 animate-pulse" />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl scale-150 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Authorization Layer</p>
                        <p className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Security Verified</p>
                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-amber-500" /> Secure Node Handshake // AES-256
                        </p>
                    </div>
                </div>
            </motion.aside>

            {/* PERSPECTIVE STYLES */}
            <style jsx>{`
                .preserve-3d { transform-style: preserve-3d; }
                .perspective-[1500px] { perspective: 1500px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.1; }
                    50% { transform: scale(1.05); opacity: 0.2; }
                }
                .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
                @keyframes scan {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(100%); }
                }
                .animate-scan { animation: scan 2s infinite linear; }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 20s infinite linear; }
            `}</style>
        </div>
    );
}
