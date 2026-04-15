'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Palette, Clock, ChevronLeft, Download, UploadCloud,
    Layers, MessageSquare, CheckCircle, AlertCircle,
    Eye, MoreHorizontal, FileImage, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectDetailPage({ params }) {
    const { projectId } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('brief');

    // Mock Data
    const project = {
        id: projectId,
        title: 'Campaña Black Friday',
        client: 'Ecom Store',
        type: 'Redes Sociales',
        deadline: 'Mañana, 09:00',
        status: 'in_progress',
        objective: 'Generar urgencia y destacar descuentos del 50%.',
        specs: 'Post 1080x1080 (x3), Story 1080x1920 (x3)',
        style: 'Minimalista, colores neón, tipografía Bold.',
        refs: [
            'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop'
        ],
        assets: {
            colors: ['#FF00D6', '#00FFFF', '#000000'],
            fonts: ['Inter Bold', 'Roboto Mono'],
            logo: 'logo_white.png'
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">{project.title}</h1>
                        <p className="text-xs text-pink-400 font-bold uppercase tracking-wider">{project.client}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-400 animate-pulse">
                        En Diseño
                    </div>
                    <button
                        onClick={() => setActiveTab('design')}
                        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-pink-600/20 flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Subir Diseño
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-white/5 px-6 flex items-center gap-6 shrink-0 bg-[#050511]">
                {[
                    { id: 'brief', label: 'Brief Visual' },
                    { id: 'design', label: 'Diseño y Versiones' },
                    { id: 'feedback', label: 'Feedback' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 text-sm font-bold relative transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'brief' && <BriefTab key="brief" project={project} />}
                    {activeTab === 'design' && <DesignTab key="design" />}
                    {activeTab === 'feedback' && <FeedbackTab key="feedback" />}
                </AnimatePresence>
            </div>
        </div>
    );
}

function BriefTab({ project }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Left: Project Specs */}
            <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-pink-400" /> Objetivo & Especificaciones
                    </h3>
                    <div className="space-y-4 text-sm text-gray-300">
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Objetivo</span>
                            <p className="leading-relaxed">{project.objective}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Medidas</span>
                                <p>{project.specs}</p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Deadline</span>
                                <p className="text-pink-400 font-bold">{project.deadline}</p>
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Estilo Visual</span>
                            <p className="leading-relaxed">{project.style}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Referencias Visuales
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {project.refs.map((ref, i) => (
                            <div key={i} className="aspect-square rounded-xl bg-gray-800 overflow-hidden relative group cursor-pointer border border-white/5">
                                <img src={ref} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={`Ref ${i}`} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Brand Assets */}
            <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Kit de Marca
                    </h3>

                    <div className="mb-6">
                        <span className="text-xs text-gray-500 mb-2 block">Colores</span>
                        <div className="flex gap-3">
                            {project.assets.colors.map((color, i) => (
                                <div key={i} className="group relative">
                                    <div className="w-10 h-10 rounded-full border border-white/10 shadow-lg cursor-pointer transform hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{color}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <span className="text-xs text-gray-500 mb-2 block">Tipografías</span>
                        <div className="space-y-2">
                            {project.assets.fonts.map((font, i) => (
                                <div key={i} className="p-2 rounded bg-white/5 text-sm text-gray-300 font-mono border border-white/5">
                                    {font}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Descargar Todo
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function DesignTab() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto space-y-8">

            {/* Current Version Upload */}
            <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center bg-[#0E0E18] hover:bg-white/5 transition-colors cursor-pointer group text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-pink-500/20 flex items-center justify-center mb-4 transition-colors">
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Subir Nueva Versión (V2)</h3>
                <p className="text-gray-500">Arrastra tus archivos aquí o haz clic para buscar.</p>
                <div className="mt-6 flex gap-3">
                    <span className="px-3 py-1 rounded-full bg-black/40 text-xs text-gray-400 border border-white/5">PNG</span>
                    <span className="px-3 py-1 rounded-full bg-black/40 text-xs text-gray-400 border border-white/5">JPG</span>
                    <span className="px-3 py-1 rounded-full bg-black/40 text-xs text-gray-400 border border-white/5">AI</span>
                </div>
            </div>

            {/* Version History */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Historial de Versiones
                </h3>

                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg bg-gray-800 shrink-0 overflow-hidden relative group cursor-pointer border border-white/5">
                        <img src="https://images.unsplash.com/photo-1626785774573-4b7993143a26?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-white">Versión 1 (V1)</h4>
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/20">Feedback Recibido</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Subido ayer a las 16:30 • Archivo: Propuesta_v1.png</p>
                        <p className="text-sm text-gray-300 italic">"Primera propuesta, enfocado en el minimalismo como se pidió."</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function FeedbackTab() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto">
            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-400" /> Comentarios sobre V1
                    </h3>
                    <span className="text-xs text-gray-500">2 comentarios pendientes</span>
                </div>

                <div className="space-y-4">
                    {/* Comment 1 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                            CM
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-purple-300">Community Manager</span>
                                <span className="text-[10px] text-gray-500">Hace 2 horas</span>
                            </div>
                            <p className="text-sm text-gray-300">El logo se pierde un poco con ese fondo oscuro. ¿Podemos probar darle más contraste o usar la versión en blanco?</p>
                            <div className="mt-3 flex gap-2">
                                <button className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs rounded transition-colors">
                                    Marcar como resuelto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comment 2 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                            CM
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-300">Community Manager</span>
                                <span className="text-[10px] text-gray-500">Hace 2 horas</span>
                            </div>
                            <p className="text-sm text-gray-300">La tipografía del título me gusta, déjala así.</p>
                            <div className="mt-3 flex gap-2">
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Resuelto
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <textarea
                        className="w-full h-24 bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none resize-none text-sm"
                        placeholder="Responder a los comentarios..."
                    />
                    <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors">
                            Enviar Respuesta
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
