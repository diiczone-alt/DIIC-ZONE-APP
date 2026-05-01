import React, { useState, useEffect, useRef } from 'react';
import { X, Type, Video, Activity, Play, Pause, Save, Upload, MonitorPlay, Maximize2, Settings2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditorWorkspace({ task, onClose }) {
    const [activeTab, setActiveTab] = useState('script');
    const [scriptText, setScriptText] = useState(task.script || 'Escribe el guion aquí para el proyecto: ' + task.title);
    const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);
    const [teleprompterSpeed, setTeleprompterSpeed] = useState(50); // 0-100
    const [scrollPosition, setScrollPosition] = useState(0);
    const teleprompterRef = useRef(null);

    // Teleprompter Auto-scroll Logic
    useEffect(() => {
        let animationFrame;
        let lastTime = performance.now();

        const scroll = (time) => {
            if (isTeleprompterPlaying && teleprompterRef.current) {
                const deltaTime = time - lastTime;
                // Velocidad base multiplicada por la velocidad del usuario
                const scrollAmount = (deltaTime * teleprompterSpeed) / 1000;
                
                teleprompterRef.current.scrollTop += scrollAmount;
                setScrollPosition(teleprompterRef.current.scrollTop);
            }
            lastTime = time;
            animationFrame = requestAnimationFrame(scroll);
        };

        if (isTeleprompterPlaying) {
            animationFrame = requestAnimationFrame(scroll);
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [isTeleprompterPlaying, teleprompterSpeed]);

    const handleSaveScript = () => {
        // En un entorno real, actualizar en la base de datos (Supabase)
        // Por ahora, simulamos el guardado
        alert('Guion guardado exitosamente.');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050511]/90 backdrop-blur-md p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#0A0A15] border border-white/10 rounded-3xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-indigo-500/10"
            >
                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Video className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{task.title}</h2>
                            <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">{task.client} • {task.type?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[#050511] p-1 rounded-xl border border-white/5">
                        <TabButton id="script" icon={Edit3} label="Guion" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton id="teleprompter" icon={MonitorPlay} label="Teleprompter" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton id="editor" icon={Video} label="Edición" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton id="analytics" icon={Activity} label="Analítica" activeTab={activeTab} onClick={setActiveTab} />
                    </div>

                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Workspace Area */}
                <div className="flex-1 overflow-hidden relative bg-[#050511]">
                    
                    {/* SCRIPT EDITOR */}
                    {activeTab === 'script' && (
                        <div className="absolute inset-0 flex flex-col">
                            <div className="h-12 border-b border-white/5 flex items-center justify-between px-6">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Asistente de Guion IA</span>
                                </div>
                                <button onClick={handleSaveScript} className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                    <Save className="w-3 h-3" /> Guardar Cambios
                                </button>
                            </div>
                            <textarea
                                value={scriptText}
                                onChange={(e) => setScriptText(e.target.value)}
                                className="flex-1 w-full bg-transparent text-gray-200 p-8 resize-none focus:outline-none text-lg leading-relaxed font-medium placeholder-gray-700"
                                placeholder="Comienza a escribir el hook de tu video..."
                            />
                        </div>
                    )}

                    {/* TELEPROMPTER */}
                    {activeTab === 'teleprompter' && (
                        <div className="absolute inset-0 flex flex-col">
                            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A15]">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setIsTeleprompterPlaying(!isTeleprompterPlaying)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isTeleprompterPlaying ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                                    >
                                        {isTeleprompterPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Velocidad</span>
                                        <input 
                                            type="range" 
                                            min="10" 
                                            max="150" 
                                            value={teleprompterSpeed} 
                                            onChange={(e) => setTeleprompterSpeed(Number(e.target.value))}
                                            className="w-32 accent-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        if (teleprompterRef.current) {
                                            teleprompterRef.current.scrollTop = 0;
                                            setScrollPosition(0);
                                        }
                                    }}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs font-bold transition-all"
                                >
                                    Reiniciar
                                </button>
                            </div>
                            <div className="flex-1 relative overflow-hidden bg-black flex justify-center">
                                {/* Zona de Enfoque */}
                                <div className="absolute top-1/3 left-0 right-0 h-32 border-y border-white/10 bg-white/[0.02] pointer-events-none z-10">
                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
                                </div>

                                <div 
                                    ref={teleprompterRef}
                                    className="w-full max-w-4xl overflow-y-auto px-12 pt-[30vh] pb-[60vh] scrollbar-none"
                                    style={{ scrollBehavior: 'auto' }}
                                >
                                    <p className="text-5xl font-black text-white leading-[1.6] text-center" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                                        {scriptText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EDICIÓN / UPLOAD MEDIA */}
                    {activeTab === 'editor' && (
                        <div className="absolute inset-0 flex flex-col lg:flex-row">
                            <div className="flex-1 p-8 flex flex-col items-center justify-center border-r border-white/5">
                                <div className="w-full max-w-md aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group">
                                    <Upload className="w-10 h-10 text-gray-600 group-hover:text-indigo-400 transition-colors mb-4" />
                                    <h3 className="text-white font-bold mb-1">Subir Material Crudo</h3>
                                    <p className="text-xs text-gray-500 text-center px-8">Arrastra los archivos MP4 o envíalos desde el móvil para iniciar el montaje.</p>
                                </div>

                                <div className="mt-12 w-full max-w-md">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-2">Archivos del Proyecto</h4>
                                    <div className="space-y-2">
                                        {[1, 2].map(i => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                        <Video className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-white">toma_principal_{i}.mp4</p>
                                                        <p className="text-[10px] text-gray-500">254 MB • Hace 2h</p>
                                                    </div>
                                                </div>
                                                <button className="text-gray-400 hover:text-white">
                                                    <Play className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-80 bg-[#0A0A15] p-6 flex flex-col gap-6">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Estado de Producción</h4>
                                    <div className="space-y-2">
                                        <StatusItem title="Guion Aprobado" done={true} />
                                        <StatusItem title="Material Grabado" done={true} />
                                        <StatusItem title="Edición B-Roll" done={false} active={true} />
                                        <StatusItem title="Efectos y Color" done={false} />
                                        <StatusItem title="Exportación" done={false} />
                                    </div>
                                </div>
                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Enviar a Revisión
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ANALÍTICA */}
                    {activeTab === 'analytics' && (
                        <div className="absolute inset-0 p-8 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-black text-white">Rendimiento Proyectado</h3>
                                <p className="text-sm text-gray-500">Estimación basada en rendimiento histórico del cliente y formato.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <MetricCard title="Alcance Estimado" value="12.5K" trend="+15%" type="up" />
                                <MetricCard title="Retención Esperada" value="68%" trend="+5%" type="up" />
                                <MetricCard title="Conversión a Leads" value="~45" trend="-2%" type="down" />
                            </div>
                            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <Activity className="w-12 h-12 text-indigo-500/50 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">Gráficos de retención estarán disponibles una vez publicado el video.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
}

function TabButton({ id, icon: Icon, label, activeTab, onClick }) {
    const isActive = activeTab === id;
    return (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
        >
            <Icon className="w-3 h-3" />
            {label}
        </button>
    );
}

function StatusItem({ title, done, active }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                done ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                active ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' :
                'bg-white/5 border-white/10 text-gray-600'
            }`}>
                {done ? <CheckCircle2 className="w-3 h-3" /> : (active ? <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" /> : null)}
            </div>
            <span className={`text-xs font-bold ${done ? 'text-gray-300' : active ? 'text-white' : 'text-gray-600'}`}>
                {title}
            </span>
        </div>
    );
}

function MetricCard({ title, value, trend, type }) {
    return (
        <div className="bg-[#0A0A15] border border-white/5 p-6 rounded-2xl">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{title}</h4>
            <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-white">{value}</span>
                <span className={`text-xs font-bold mb-1 ${type === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}
