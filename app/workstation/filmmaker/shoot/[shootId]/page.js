'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar, MapPin, Clock, ChevronLeft, CheckSquare,
    FileText, UploadCloud, AlertTriangle, ShieldCheck,
    Mic, Camera, Sun, Battery, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShootDetailPage({ params }) {
    const { shootId } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('brief');

    // Mock Data
    const shoot = {
        id: shootId,
        title: 'Video Corporativo Institucional',
        client: 'Clínica Smith',
        type: 'Corporativo',
        date: 'Hoy, 14:00 - 18:00',
        location: 'Av. Libertador 1234, Piso 5',
        locationUrl: 'https://maps.google.com',
        objective: 'Generar confianza y mostrar tecnología de punta.',
        shots: [
            { type: 'A-Roll', desc: 'Entrevistas Doctor (Plano Medio)' },
            { type: 'B-Roll', desc: 'Consultorio y Equipos (Detalles)' },
            { type: 'B-Roll', desc: 'Recepción y Pacientes (Wide)' },
            { type: 'Drone', desc: 'Fachada Exterior (Opcional)' }
        ]
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
                        <h1 className="text-lg font-bold text-white leading-tight">{shoot.title}</h1>
                        <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{shoot.client}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                        Confirmado
                    </div>
                    <button
                        onClick={() => router.push(`/workstation/filmmaker/upload/${shootId}`)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Subir Material
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-white/5 px-6 flex items-center gap-6 shrink-0 bg-[#050511]">
                {['brief', 'checklist', 'reporte'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 text-sm font-bold relative transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                            <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'brief' && <BriefTab key="brief" shoot={shoot} />}
                    {activeTab === 'checklist' && <ChecklistTab key="checklist" />}
                    {activeTab === 'reporte' && <ReportTab key="reporte" />}
                </AnimatePresence>
            </div>
        </div>
    );
}

function BriefTab({ shoot }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-4xl mx-auto">

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Objetivo Principal</h3>
                            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{shoot.objective}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Logística</h3>
                            <div className="mt-2 space-y-2">
                                <p className="text-sm text-gray-300 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" /> {shoot.date}
                                </p>
                                <p className="text-sm text-gray-300 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" /> {shoot.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shot List */}
            <div className="p-6 rounded-2xl bg-[#0E0E18] border border-white/5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-gray-400" /> Lista de Tomas Requeridas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shoot.shots.map((shot, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <div className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-gray-700 text-gray-300">{shot.type}</div>
                            <span className="text-sm text-gray-300">{shot.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-amber-200">
                    <strong>Nota del Productor:</strong> Recuerda llevar el kit de iluminación extra, el consultorio es un poco oscuro.
                </p>
            </div>
        </motion.div>
    );
}

function ChecklistTab() {
    const [items, setItems] = useState([
        { id: 1, label: 'Baterías cargadas (Cámara + Luces)', checked: false, category: 'pre' },
        { id: 2, label: 'Tarjetas SD Formateadas', checked: false, category: 'pre' },
        { id: 3, label: 'Micrófono Lavalier probado', checked: false, category: 'pre' },
        { id: 4, label: 'Balance de Blancos seteado', checked: false, category: 'during' },
        { id: 5, label: 'Audio monitoreado (sin ruido)', checked: false, category: 'during' },
        { id: 6, label: 'B-Roll suficiente grabado', checked: false, category: 'during' },
    ]);

    const toggle = (id) => {
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto space-y-8">
            {['pre', 'during'].map((cat) => (
                <div key={cat}>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                        {cat === 'pre' ? 'Antes del Rodaje' : 'Durante el Rodaje'}
                    </h3>
                    <div className="space-y-2">
                        {items.filter(i => i.category === cat).map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggle(item.id)}
                                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${item.checked
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : 'bg-[#0E0E18] border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}>
                                    {item.checked && <CheckSquare className="w-4 h-4 text-black" />}
                                </div>
                                <span className={`font-medium ${item.checked ? 'text-emerald-400 line-through' : 'text-gray-200'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </motion.div>
    );
}

function ReportTab() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
            <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-white mb-4">Reporte de Rodaje</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">¿Objetivo Cumplido?</label>
                        <select className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none">
                            <option>Sí, totalmente</option>
                            <option>Parcialmente</option>
                            <option>No (Hubo problemas)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Calidad de Audio</label>
                        <select className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none">
                            <option>Limpio / Perfecto</option>
                            <option>Ruido leve (controlable)</option>
                            <option>Problemas graves</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Notas para Edición (Highlights)</label>
                    <textarea
                        className="w-full h-32 bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none resize-none"
                        placeholder="Ej: La toma 34 tiene la mejor sonrisa. Usar el audio del Boom en la entrevista 2..."
                    />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors">
                        Enviar Reporte al CM
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
