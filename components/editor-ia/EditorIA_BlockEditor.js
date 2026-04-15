'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, ChevronDown, ChevronUp, MoreVertical, Layers, Type, Wand2, Scissors, Video, Music } from 'lucide-react';

export default function EditorIA_BlockEditor() {
    // Mock Data based on "Testimonial" structure
    const [scenes, setScenes] = useState([
        { id: 1, type: 'HOOK', label: 'Gancho Visual', duration: '3s', content: 'Clip A-Roll principal', text: '¡No vas a creer esto!', status: 'ready' },
        { id: 2, type: 'CONTEXT', label: 'Contexto / Problema', duration: '5s', content: 'Clip B-Roll Oficina', text: 'Estábamos perdiendo clientes...', status: 'ready' },
        { id: 3, type: 'SOLUTION', label: 'Solución DIIC', duration: '12s', content: 'Clip A-Roll + Pantallas', text: 'Hasta que implementamos el sistema...', status: 'ready' },
        { id: 4, type: 'CTA', label: 'Llamado a la Acción', duration: '4s', content: 'Clip Cierre', text: 'Agenda tu demo aquí', status: 'ready' },
        { id: 5, type: 'OUTRO', label: 'Logo Final', duration: '2s', content: 'Animación Logo', text: '', status: 'ready' },
    ]);

    const [activeSceneId, setActiveSceneId] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="grid grid-cols-12 gap-6 h-full">

            {/* LEFT: SCENE LIST (The new "Timeline") */}
            <div className="col-span-12 lg:col-span-4 flex flex-col h-full bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wide">Estructura Narrativa</h3>
                        <p className="text-[10px] text-gray-400">Edición por Bloques (DIIC Method)</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <Layers className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    <AnimatePresence>
                        {scenes.map((scene, index) => (
                            <SceneBlock
                                key={scene.id}
                                scene={scene}
                                isActive={activeSceneId === scene.id}
                                onClick={() => setActiveSceneId(scene.id)}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span>Duración Total</span>
                        <span className="text-white font-mono font-bold">00:26</span>
                    </div>
                </div>
            </div>

            {/* CENTER/RIGHT: PREVIEW & CONTROLS */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full">

                {/* PREVIEW PLAYER */}
                <div className="flex-1 bg-black rounded-3xl overflow-hidden relative group border border-white/5 shadow-2xl">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-black">
                        <Play className="w-16 h-16 text-white/20 fill-white/10" />
                    </div>

                    {/* Fake Player UI */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                        </button>
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                            <div className="w-1/3 h-full bg-cyan-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-white">00:08 / 00:26</span>
                    </div>

                    {/* Scene Tag Overlay */}
                    <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-wide">
                        {scenes.find(s => s.id === activeSceneId)?.label}
                    </div>
                </div>

                {/* SCENE CONTROLS (Contextual) */}
                <div className="h-48 bg-[#0E0E18] border border-white/5 rounded-3xl p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Wand2 className="w-3 h-3" /> Ajustes de Escena: <span className="text-white">{scenes.find(s => s.id === activeSceneId)?.label}</span>
                        </h3>
                        <button className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 transition-colors">
                            <RefreshCw className="w-3 h-3" /> Re-renderizar Escena
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <ControlCard icon={Scissors} label="Recortar" value="3s" />
                        <ControlCard icon={Type} label="Texto" value="Dinámico" />
                        <ControlCard icon={Video} label="B-Roll" value="Auto" />
                        <ControlCard icon={Music} label="Audio" value="100%" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function SceneBlock({ scene, isActive, onClick, index }) {
    return (
        <motion.div
            layout
            onClick={onClick}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border cursor-pointer relative group transition-all
                ${isActive
                    ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-[#1A1A24] border-white/5 hover:border-white/20'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded
                    ${isActive ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-500'}`}>
                    {scene.type}
                </span>
                <span className="text-[10px] font-mono text-gray-500">{scene.duration}</span>
            </div>

            <h4 className={`text-sm font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {scene.label}
            </h4>
            <p className="text-[10px] text-gray-500 truncate">{scene.text}</p>

            {/* Active Indicator */}
            {isActive && (
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-cyan-500 rounded-r-full" />
            )}
        </motion.div>
    );
}

function ControlCard({ icon: Icon, label, value }) {
    return (
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/20 transition-all group">
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 mb-2 transition-colors" />
            <span className="text-xs font-bold text-gray-300">{label}</span>
            <span className="text-[10px] text-gray-500">{value}</span>
        </button>
    );
}
