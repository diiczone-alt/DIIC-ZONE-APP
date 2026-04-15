'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Clock, AlertCircle, FileText,
    UploadCloud, MessageSquare, Play, Calendar,
    Trophy, Star, Zap, Video, Clapperboard,
    Eye, Edit3, ArrowRight, User
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import FilmmakerUploader from './roles/FilmmakerUploader';
import EditingGuideBuilder from './roles/EditingGuideBuilder';
import EditorDashboard from './roles/EditorDashboard';

export default function CreatorWorkstation({ user }) {
    // Role determination (Mock for demo if not passed correctly)
    const role = user?.role?.includes('EDITOR') ? 'EDITOR'
        : user?.role?.includes('FILM') ? 'FILMMAKER'
            : 'CM';

    const [view, setView] = useState('DASHBOARD');

    // FILES/GUIDES STATE (CM)
    const [selectedProjectForGuide, setSelectedProjectForGuide] = useState(null);

    // FILMMAKER MOCK DATA
    const shoots = [
        { id: 101, title: 'Campaña Dental Confianza', location: 'Clínica Santa Ana', date: '12 Julio', status: 'CONFIRMED', type: 'SHOOT' },
        { id: 102, title: 'Testimoniales Nike', location: 'Gym Central', date: '15 Julio', status: 'PENDING', type: 'SHOOT' },
    ];

    // CM MOCK DATA (Pending Review)
    const pendingReviews = [
        { id: 101, title: 'Campaña Dental - Rodaje', type: 'RAW_FOOTAGE', filmmaker: 'Fausto', submitted: 'Hace 2h', status: 'NEEDS_GUIDE' },
        { id: 102, title: 'Reel Nike - V1', type: 'EDIT', editor: 'Ana', submitted: 'Hace 30m', status: 'NEEDS_APPROVAL' },
    ];

    return (
        <div className="min-h-screen bg-[#050511] p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">

            {/* Header: Identity & Status */}
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-widest
                            ${role === 'FILMMAKER' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                : role === 'CM' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                            {user?.role || role} WORKSTATION
                        </span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-white">
                        Hola, {user?.name?.split(' ')[0] || 'Partner'} <span className="text-gray-600">👋</span>
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {role === 'FILMMAKER' && <span className="text-indigo-400 font-bold">Modo Rodaje Activo</span>}
                        {role === 'CM' && <span className="text-blue-400 font-bold">Gestión de Producción</span>}
                        {role === 'EDITOR' && <span className="text-purple-400 font-bold">Sala de Edición</span>}
                    </p>
                </div>
            </header>

            {/* --- FILMMAKER VIEW --- */}
            {role === 'FILMMAKER' && (
                <>
                    <div className="flex gap-4 border-b border-white/5">
                        <button onClick={() => setView('DASHBOARD')} className={`pb-4 px-2 text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${view === 'DASHBOARD' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>Mis Rodajes</button>
                        <button onClick={() => setView('UPLOAD')} className={`pb-4 px-2 text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${view === 'UPLOAD' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>Subir Material</button>
                    </div>

                    <AnimatePresence mode="wait">
                        {view === 'DASHBOARD' ? (
                            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Clapperboard className="w-4 h-4 text-white" /> Rodajes Activos</h2>
                                    {shoots.map(shoot => (
                                        <div key={shoot.id} className="bg-[#0E0E18] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex justify-between items-center group">
                                            <div>
                                                <div className="text-xs font-mono text-gray-400 mb-2">{shoot.date}</div>
                                                <h3 className="text-xl font-black text-white mb-1">{shoot.title}</h3>
                                                <p className="text-gray-500 text-sm">{shoot.location}</p>
                                            </div>
                                            <button onClick={() => setView('UPLOAD')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">Subir</button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <FilmmakerUploader projectId="101" onComplete={() => setView('DASHBOARD')} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* --- COMMUNITY MANAGER VIEW --- */}
            {role === 'CM' && (
                <div className="space-y-8">
                    {!selectedProjectForGuide ? (
                        <>
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Eye className="w-4 h-4 text-white" /> Pendiente de Revisión
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingReviews.map(item => (
                                    <div key={item.id} className="bg-[#0E0E18] border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'NEEDS_GUIDE' ? 'bg-orange-500/10 text-orange-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                {item.status === 'NEEDS_GUIDE' ? 'Falta Guía' : 'Revisar Edición'}
                                            </span>
                                            <span className="text-xs text-gray-500">{item.submitted}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-white mb-1">{item.title}</h3>
                                        <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                                            <User className="w-3 h-3" /> {item.filmmaker || item.editor}
                                        </p>

                                        {item.status === 'NEEDS_GUIDE' ? (
                                            <button
                                                onClick={() => setSelectedProjectForGuide(item.id)}
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <Edit3 className="w-4 h-4" /> Crear Guía
                                            </button>
                                        ) : (
                                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">
                                                Ver Preview
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <button
                                onClick={() => setSelectedProjectForGuide(null)}
                                className="mb-4 text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" /> Volver a Pendientes
                            </button>
                            <EditingGuideBuilder
                                projectId={selectedProjectForGuide}
                                onSave={() => {
                                    setSelectedProjectForGuide(null);
                                    // In real app, update status
                                }}
                            />
                        </motion.div>
                    )}
                </div>
            )}

            {/* --- EDITOR VIEW --- */}
            {role === 'EDITOR' && (
                <EditorDashboard user={user} />
            )}
        </div>
    );
}
