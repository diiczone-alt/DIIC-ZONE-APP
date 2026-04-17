'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, MoreHorizontal, User, Calendar,
    MessageSquare, CheckCircle, Share2,
    Megaphone, Eye, ArrowRight, Clock,
    LayoutGrid, Filter, Search, ChevronRight, X
} from 'lucide-react';
import { contentService } from '@/services/contentService';

const STAGES = [
    { id: 'idea', label: 'Idea', color: 'border-blue-500/20 text-blue-400', icon: LayoutGrid },
    { id: 'produccion', label: 'Producción', color: 'border-purple-500/20 text-purple-400', icon: ArrowRight },
    { id: 'revision', label: 'Revisión CM', color: 'border-orange-500/20 text-orange-400', icon: Eye },
    { id: 'aprobado', label: 'Aprobado', color: 'border-emerald-500/20 text-emerald-400', icon: CheckCircle },
    { id: 'programado', label: 'Programado', color: 'border-indigo-500/20 text-indigo-400', icon: Calendar },
    { id: 'publicado', label: 'Publicado', color: 'border-white/10 text-gray-400', icon: Share2 },
    { id: 'ads', label: 'Ads Activo', color: 'border-pink-500/20 text-pink-400', icon: Megaphone },
];

const MOCK_DATA = [
    {
        id: '1',
        title: 'Reel: Un día en la clínica',
        type: 'Reel',
        platform: 'IG',
        mode: 'Pauta',
        stage: 'produccion',
        responsible: 'Andrés V.',
        deadline: '25 Feb',
        priority: 'Alta'
    },
    {
        id: '2',
        title: 'Post: Beneficios del blanqueamiento',
        type: 'Imagen',
        platform: 'FB',
        mode: 'Orgánico',
        stage: 'revision',
        responsible: 'Mateo G.',
        deadline: 'Hoy',
        priority: 'Media'
    },
    {
        id: '3',
        title: 'Video: Tutorial de cepillado',
        type: 'Video',
        platform: 'YT',
        mode: 'Orgánico',
        stage: 'aprobado',
        responsible: 'Kevin R.',
        deadline: 'Mañana',
        priority: 'Baja'
    }
];

export default function ContentKanban({ role = 'cm', client = null, isEmbedded = false }) {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const clientName = client?.name || 'Cliente Demo';
    const clientId = client?.id;

    const isCM = role === 'cm';
    const isClient = role === 'client';
    const isCreative = role === 'creative';

    useEffect(() => {
        if (clientId) {
            fetchContents();
        } else {
            setContents(MOCK_DATA);
            setLoading(false);
        }
    }, [clientId]);

    const fetchContents = async () => {
        setLoading(true);
        const data = await contentService.getContents(clientId);
        if (data && data.length > 0) {
            setContents(data);
        } else {
            // If no real data, show mock for now but allow creating real ones
            setContents([]);
        }
        setLoading(false);
    };

    const handleMoveStage = async (id, newStage) => {
        if (isClient && newStage !== 'aprobado') return; // Client can only approve
        
        // Optimistic update
        setContents(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));

        // DB update if it's a real item (uuid)
        if (id.length > 5) {
            await contentService.updateContentStage(id, newStage);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 overflow-hidden">
            {/* Header - Only render if not embedded inside StrategyBoard */}
            {!isEmbedded && (
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-white">Producción de Contenidos</h3>
                        <p className="text-sm text-gray-500">{clientName} • Flujo Unificado</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isCM && (
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Nuevo Contenido
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                {STAGES.map(stage => (
                    <div key={stage.id} className="w-80 shrink-0 flex flex-col gap-4">
                        {/* Column Header */}
                        <div className={`p-4 rounded-2xl border ${stage.color} bg-white/[0.02] flex items-center justify-between backdrop-blur-sm sticky top-0 z-10`}>
                            <div className="flex items-center gap-2">
                                <stage.icon className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{stage.label}</span>
                            </div>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400 font-mono">
                                {contents.filter(c => c.stage === stage.id).length}
                            </span>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 min-h-[100px]">
                            {contents.filter(c => c.stage === stage.id).map(content => (
                                <motion.div
                                    key={content.id}
                                    layoutId={content.id}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="bg-[#0E0E18] border border-white/10 rounded-[2rem] p-5 cursor-pointer hover:border-indigo-500/50 transition-all group shadow-xl relative overflow-hidden"
                                    onClick={() => setSelectedItem(content)}
                                >
                                    {/* Priority Indicator */}
                                    <div className={`absolute top-0 right-0 w-20 h-10 -mr-10 -mt-5 rotate-45 ${content.priority === 'Alta' ? 'bg-red-500/20' :
                                            content.priority === 'Media' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                                        }`} />

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">{content.type} • {content.platform}</span>
                                            <h4 className="text-sm font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{content.title}</h4>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                                        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter mb-1">Responsable</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-[8px] font-bold">{content.responsible.charAt(0)}</div>
                                                <span className="text-[10px] text-gray-300 font-bold truncate">{content.responsible}</span>
                                            </div>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter mb-1">Entrega</p>
                                            <div className="flex items-center gap-1.5 text-gray-300">
                                                <Clock className="w-3 h-3 text-indigo-400" />
                                                <span className="text-[10px] font-bold">{content.deadline}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${content.mode === 'Pauta' ? 'bg-pink-500/10 text-pink-400' : 'bg-white/5 text-gray-500'}`}>
                                            {content.mode}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-1.5 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                            </button>
                                            {isClient && stage.id === 'revision' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMoveStage(content.id, 'aprobado');
                                                    }}
                                                    className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[1000] flex justify-end overflow-hidden pointer-events-none">
                        {/* Backdrop with Blur */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#020205]/80 backdrop-blur-3xl pointer-events-auto" 
                            onClick={() => setSelectedItem(null)}
                        />
                        
                        {/* Detail Sidebar / Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-[600px] h-full bg-[#0A0A0F] border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col pointer-events-auto overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Accent Glow Background */}
                            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                            {/* Header Section */}
                            <div className="p-10 pb-6 relative z-10 flex justify-between items-start">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest shadow-lg">
                                            ID: {selectedItem.id} • {selectedItem.platform}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                                            selectedItem.priority === 'Alta' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                            selectedItem.priority === 'Media' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        }`}>
                                            Prioridad {selectedItem.priority}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight drop-shadow-2xl">
                                        {selectedItem.title}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={selectedItem.stage.charAt(0).toUpperCase() + selectedItem.stage.slice(1)} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30 animate-pulse" />
                                        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Motor_Live_V4.2</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedItem(null)}
                                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all flex items-center justify-center border border-white/5 shadow-2xl group active:scale-95"
                                >
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Scrollable Content Container */}
                            <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-10 custom-scrollbar relative z-10">
                                
                                {/* 📋 METADATA GRID */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Responsable', value: selectedItem.responsible, icon: User, color: 'text-indigo-400' },
                                        { label: 'Entrega Final', value: selectedItem.deadline, icon: Calendar, color: 'text-emerald-400' },
                                        { label: 'Formato / Hook', value: '1080x1920 (9:16)', icon: LayoutGrid, color: 'text-blue-400' },
                                        { label: 'Modo / Campaña', value: selectedItem.mode, icon: Megaphone, color: 'text-pink-400' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all shadow-inner">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${item.color} border border-white/5 shadow-lg group-hover:scale-110 transition-transform`}>
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <p className="text-sm font-black text-white px-1">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* 🎯 STRATEGIC BRIEFING SECTION */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">Briefing Estratégico</h3>
                                        <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300">EDIT_BRIEF</button>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-indigo-500/[0.03] border border-indigo-500/10 relative overflow-hidden group/brief">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-3xl rounded-full" />
                                        <p className="text-gray-300 text-sm leading-relaxed font-bold">
                                            El objetivo principal de este {selectedItem.type.toLowerCase()} es capturar la atención de la audiencia en los primeros 3 segundos mediante un "Pattern Interrupt" dinámico. 
                                            Necesitamos que los cortes sean rápidos y la música tenga un beat marcado que acompañe la acción.
                                        </p>
                                        <ul className="mt-6 space-y-3">
                                            {['Llamado a la acción (CTA) directo al perfil', 'Usar subtítulos "Alex Hormozi Style"', 'Filtro de color frío para realzar limpieza'].map((point, i) => (
                                                <li key={i} className="flex gap-3 text-xs text-gray-500 font-bold group-hover/brief:text-gray-400 transition-colors">
                                                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* 💬 INTERACTIVE FEEDBACK & ACTIVITY */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">Integración & Feedback</h3>
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black">2_MSG_LIVE</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 p-5 bg-[#151520] rounded-[1.5rem] border border-white/5 shadow-inner">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg font-black">A</div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedItem.responsible}</span>
                                                    <span className="text-[8px] text-gray-700">Hace 1 hora</span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-bold leading-relaxed">
                                                    He subido la primera versión de la edición. Falta pulir el audio del final. ¿Qué opinas?
                                                </p>
                                                <button className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-black hover:bg-indigo-500/20 transition-all">
                                                    <Eye className="w-3 h-3" /> VER_REVISIÓN
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-row-reverse gap-4 p-5 bg-white/[0.02] rounded-[1.5rem] border border-white/5 text-right opacity-80 backdrop-blur-sm">
                                            <div className="w-10 h-10 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-400 shrink-0 border border-white/5 font-black italic">CM</div>
                                            <div className="space-y-1">
                                                <div className="flex items-center flex-row-reverse gap-2">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Master CM</span>
                                                    <span className="text-[8px] text-gray-700">Hace 30 min</span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                                    Se ve muy bien, pero cambia la tipografía del hook al color de la marca.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Quick Reply Input */}
                                    <div className="relative pt-2">
                                        <input 
                                            type="text" 
                                            placeholder="Escribe un mensaje o feedback rápido..." 
                                            className="w-full bg-[#151520] border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/30 transition-all font-bold shadow-2xl"
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-[15%] w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-all shadow-lg active:scale-95 shadow-indigo-600/20">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer Actions */}
                            <div className="p-10 pt-6 border-t border-white/5 bg-gradient-to-t from-[#050511] to-[#0A0A0F]/80 backdrop-blur-2xl relative z-20">
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        className="py-4 border border-white/10 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:text-white hover:bg-white/5 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Clock className="w-4 h-4" /> Solicitar Cambios
                                    </button>
                                    <button 
                                        onClick={() => {
                                            handleMoveStage(selectedItem.id, 'aprobado');
                                            setSelectedItem(null);
                                        }}
                                        className="py-4 bg-gradient-to-br from-indigo-700 to-indigo-900 border border-indigo-500/30 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:brightness-110 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Aprobar Entrega
                                    </button>
                                </div>
                                <p className="text-center text-[9px] font-black text-gray-800 mt-6 uppercase tracking-[0.5em] opacity-40">
                                    DIICZONE CONTENT_ARCH v.2.2.1
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreateContentModal 
                        onClose={() => setIsCreateModalOpen(false)}
                        onSubmit={async (data) => {
                            const result = await contentService.createContent({
                                ...data,
                                client_id: clientId
                            });
                            if (result.data) {
                                setContents(prev => [result.data, ...prev]);
                                setIsCreateModalOpen(false);
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function CreateContentModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Reel',
        platform: 'IG',
        mode: 'Orgánico',
        priority: 'Media',
        deadline: '',
        responsible: ''
    });

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#020205]/90 backdrop-blur-xl"
                onClick={onClose}
            />
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-xl bg-[#0E0E18] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Nuevo Contenido</h2>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">Industrialización de Producción</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Título del Contenido</label>
                        <input 
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                            placeholder="Ej: Reel: Un día en la clínica"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Tipo</label>
                            <select 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="Reel">Reel</option>
                                <option value="Video">Video</option>
                                <option value="Imagen">Imagen</option>
                                <option value="Carousel">Carousel</option>
                                <option value="Story">Story</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Plataforma</label>
                            <select 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none"
                                value={formData.platform}
                                onChange={e => setFormData({...formData, platform: e.target.value})}
                            >
                                <option value="IG">Instagram</option>
                                <option value="FB">Facebook</option>
                                <option value="TT">TikTok</option>
                                <option value="YT">YouTube</option>
                                <option value="LI">LinkedIn</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Prioridad</label>
                            <select 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none"
                                value={formData.priority}
                                onChange={e => setFormData({...formData, priority: e.target.value})}
                            >
                                <option value="Alta">Alta</option>
                                <option value="Media">Media</option>
                                <option value="Baja">Baja</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Entrega</label>
                            <input 
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                placeholder="Ej: 25 Feb"
                                value={formData.deadline}
                                onChange={e => setFormData({...formData, deadline: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Responsable sugerido</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                            placeholder="Ej: Andrés Vera"
                            value={formData.responsible}
                            onChange={e => setFormData({...formData, responsible: e.target.value})}
                        />
                    </div>

                    <button 
                        disabled={!formData.title}
                        onClick={() => onSubmit(formData)}
                        className="w-full py-5 mt-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                    >
                        Activar Producción
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function StatusBadge({ status }) {
    const stage = status.toLowerCase();
    const styles = {
        'idea': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'produccion': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'revision': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'aprobado': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'programado': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        'publicado': 'bg-white/5 text-gray-500 border-white/10',
        'ads': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${styles[stage] || styles.idea}`}>
            {status}
        </span>
    );
}
