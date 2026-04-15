'use client';

import { useState } from 'react';
import {
    Calendar, MapPin, Clock, Users, Camera, Video,
    Music, Trophy, Briefcase, Heart, Plane, Star,
    CheckCircle, ArrowRight, ArrowLeft, Upload, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventClientWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: null, // social, corporate, sports, travel, shows
        format: [], // photo, video, drone, etc
        details: {}, // Dynamic based on type
        location: null,
        level: null, // essential, pro, premium, full
        preferences: {},
        delivery: {},
        payment: null
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const steps = [
        'Tipo de Evento', 'Formato', 'Detalles', 'Ubicación',
        'Nivel Producción', 'Preferencias', 'Entrega', 'Confirmación'
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511] relative">

            {/* Progress Bar */}
            <div className="h-1 bg-white/5 w-full fixed top-0 left-80 z-50">
                <div
                    className="h-full bg-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 8) * 100}%` }}
                />
            </div>

            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-40">
                <div>
                    <h1 className="text-2xl font-bold text-white">Nueva Cobertura</h1>
                    <p className="text-sm text-gray-400">Paso {step} de 8: {steps[step - 1]}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=ev" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
                <div className="w-full max-w-5xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && <StepType key="s1" selected={formData.type} onSelect={v => setFormData({ ...formData, type: v })} />}
                        {step === 2 && <StepFormat key="s2" selected={formData.format} onSelect={v => setFormData({ ...formData, format: v })} />}
                        {step === 3 && <StepDetails key="s3" type={formData.type} data={formData.details} onChange={v => setFormData({ ...formData, details: v })} />}
                        {step === 4 && <StepLocation key="s4" data={formData.location} onChange={v => setFormData({ ...formData, location: v })} />}
                        {step === 5 && <StepLevel key="s5" selected={formData.level} onSelect={v => setFormData({ ...formData, level: v })} />}
                        {step === 6 && <StepPreferences key="s6" data={formData.preferences} onChange={v => setFormData({ ...formData, preferences: v })} />}
                        {step === 7 && <StepDelivery key="s7" data={formData.delivery} onChange={v => setFormData({ ...formData, delivery: v })} />}
                        {step === 8 && <StepConfirm key="s8" data={formData} />}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="h-20 border-t border-white/5 bg-[#050511] px-8 flex items-center justify-between shrink-0 z-40">
                <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-xl font-bold transition-colors ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Atrás
                </button>
                <button
                    onClick={handleNext}
                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
                        }`}
                >
                    {step === 8 ? 'Confirmar Reserva' : 'Siguiente'}
                    {step !== 8 && <ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}

// --- Steps ---

function StepType({ selected, onSelect }) {
    const types = [
        { id: 'social', label: 'Social', icon: Heart, desc: 'Bodas, 15 Años, Bautizos' },
        { id: 'corporate', label: 'Corporativo', icon: Briefcase, desc: 'Conferencias, Lanzamientos' },
        { id: 'sports', label: 'Deportivo', icon: Trophy, desc: 'Torneos, Partidos, Carreras' },
        { id: 'travel', label: 'Viajes / Tours', icon: Plane, desc: 'Paseos, Camping, Turismo' },
        { id: 'shows', label: 'Shows / Nightlife', icon: Music, desc: 'Conciertos, Discotecas' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="text-3xl font-black text-white text-center">¿Qué vamos a cubrir?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {types.map(t => (
                    <button
                        key={t.id} onClick={() => onSelect(t.id)}
                        className={`p-6 rounded-3xl border text-left transition-all ${selected === t.id ? 'bg-purple-600/10 border-purple-500 ring-1 ring-purple-500' : 'bg-[#0E0E18] border-white/5 hover:border-white/20'}`}
                    >
                        <t.icon className={`w-8 h-8 mb-4 ${selected === t.id ? 'text-purple-400' : 'text-gray-500'}`} />
                        <h3 className="text-lg font-bold text-white">{t.label}</h3>
                        <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepFormat({ selected, onSelect }) {
    const formats = [
        { id: 'photo', label: 'Fotografía', icon: Camera },
        { id: 'video', label: 'Video Resumen', icon: Video },
        { id: 'drone', label: 'Tomas Aéreas (Drone)', icon: Plane }, // Reusing Plane as Drone proxy
        { id: 'reels', label: 'Content Reels / TikTok', icon: Star },
    ];

    const toggle = (id) => {
        if (selected.includes(id)) onSelect(selected.filter(i => i !== id));
        else onSelect([...selected, id]);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="text-3xl font-black text-white text-center">¿Qué formato necesitas?</h2>
            <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                {formats.map(f => (
                    <button
                        key={f.id} onClick={() => toggle(f.id)}
                        className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${selected.includes(f.id) ? 'bg-purple-600/10 border-purple-500' : 'bg-[#0E0E18] border-white/5 hover:border-white/20'}`}
                    >
                        <div className={`p-2 rounded-lg ${selected.includes(f.id) ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                            <f.icon className="w-6 h-6" />
                        </div>
                        <span className={`font-bold ${selected.includes(f.id) ? 'text-white' : 'text-gray-400'}`}>{f.label}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepDetails({ type, data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-white text-center">Detalles del Evento</h2>
            <div className="space-y-4">
                <input
                    type="text" placeholder="Nombre del Evento"
                    className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-purple-500 focus:outline-none"
                    value={data.name || ''} onChange={e => onChange({ ...data, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="date"
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-purple-500 focus:outline-none"
                        value={data.date || ''} onChange={e => onChange({ ...data, date: e.target.value })}
                    />
                    <input
                        type="time"
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-purple-500 focus:outline-none"
                        value={data.time || ''} onChange={e => onChange({ ...data, time: e.target.value })}
                    />
                </div>
                <textarea
                    placeholder="Describe brevemente la dinámica del evento..."
                    className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-purple-500 focus:outline-none h-32 resize-none"
                    value={data.desc || ''} onChange={e => onChange({ ...data, desc: e.target.value })}
                />
            </div>
        </motion.div>
    );
}

function StepLocation({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 h-full flex flex-col">
            <h2 className="text-3xl font-black text-white text-center shrink-0">Ubicación</h2>
            <div className="flex-1 bg-[#0A0A0E] relative rounded-3xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-99.1332,19.4326,12,0/800x600?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="w-12 h-12 text-purple-500 drop-shadow-xl animate-bounce" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <input
                        type="text" placeholder="Buscar dirección o lugar..."
                        className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 font-bold"
                    />
                </div>
            </div>
        </motion.div>
    );
}

function StepLevel({ selected, onSelect }) {
    const levels = [
        { id: 'esencial', label: 'Esencial', price: '$250', features: ['1 Filmmaker o Fotógrafo', 'Cobertura Básica (4h)', 'Entrega Digital'] },
        { id: 'pro', label: 'Pro', price: '$450', features: ['1 Foto + 1 Video', 'Cobertura (6h)', 'Reels Incluidos', 'Edición Avanzada'] },
        { id: 'premium', label: 'Premium', price: '$800', features: ['Equipo Completo (3 pax)', 'Drone Incluido', 'Cobertura (8h)', 'Aftermovie Cinemático'] },
        { id: 'full', label: 'Full Experience', price: '$1200+', features: ['Director + Crew Completo', 'Cobertura Total', 'Entregables Ilimitados', 'Campaña Post-Evento'] },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="text-3xl font-black text-white text-center">Nivel de Producción</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {levels.map(l => (
                    <button
                        key={l.id} onClick={() => onSelect(l.id)}
                        className={`p-6 rounded-3xl border text-left transition-all flex flex-col h-full ${selected === l.id ? 'bg-purple-600/10 border-purple-500 ring-1 ring-purple-500 relative z-10 scale-105' : 'bg-[#0E0E18] border-white/5 hover:border-white/20'}`}
                    >
                        <h3 className="text-xl font-bold text-white mb-2">{l.label}</h3>
                        <div className="text-3xl font-black text-purple-400 mb-6">{l.price}</div>
                        <ul className="space-y-3 mb-6 flex-1">
                            {l.features.map((f, i) => (
                                <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-purple-500" /> {f}
                                </li>
                            ))}
                        </ul>
                        <div className={`w-full py-2 rounded-lg text-center text-xs font-bold ${selected === l.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                            Seleccionar
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepPreferences({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black text-white">Preferencias Creativas</h2>
            <div className="space-y-6 text-left">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Estilo Visual</label>
                    <div className="flex gap-4">
                        {['Cinemático', 'Documental', 'Dinámico / Vlog', 'Elegante'].map(s => (
                            <button key={s} className="px-4 py-2 rounded-full border border-white/10 text-gray-400 text-sm hover:bg-white/5 hover:text-white transition-colors">{s}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Música / Vibe</label>
                    <div className="flex gap-4">
                        {['Emotiva', 'Energética', 'House / Party', 'Acústica'].map(s => (
                            <button key={s} className="px-4 py-2 rounded-full border border-white/10 text-gray-400 text-sm hover:bg-white/5 hover:text-white transition-colors">{s}</button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StepDelivery({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black text-white">Formatos de Entrega</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-[#0E0E18] border border-white/10 p-6 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4"><Video className="w-5 h-5" /></div>
                    <h3 className="font-bold text-white mb-1">Horizontal</h3>
                    <p className="text-xs text-gray-500">16:9 • Youtube / TV</p>
                </div>
                <div className="bg-[#0E0E18] border border-white/10 p-6 rounded-2xl border-purple-500/50 bg-purple-500/5">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4"><Star className="w-5 h-5" /></div>
                    <h3 className="font-bold text-white mb-1">Vertical</h3>
                    <p className="text-xs text-gray-500">9:16 • Reels / TikTok</p>
                </div>
                <div className="bg-[#0E0E18] border border-white/10 p-6 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4"><Camera className="w-5 h-5" /></div>
                    <h3 className="font-bold text-white mb-1">Foto Alta Res</h3>
                    <p className="text-xs text-gray-500">JPG + RAW opcional</p>
                </div>
            </div>
        </motion.div>
    );
}

function StepConfirm({ data }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-2xl mx-auto">
            <div className="bg-purple-600 rounded-2xl p-8 text-center shadow-2xl shadow-purple-600/30">
                <h2 className="text-2xl font-black text-white mb-2">¡Casi listo!</h2>
                <p className="text-purple-100 mb-6">Revisa tu cobertura antes de reservar.</p>

                <div className="bg-black/20 rounded-xl p-6 text-left space-y-4 backdrop-blur-sm">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-purple-200">Evento</span>
                        <span className="text-white font-bold">{data.details.name || 'Sin nombre'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-purple-200">Nivel</span>
                        <span className="text-white font-bold uppercase">{data.level || 'Personalizado'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg text-white font-bold">Total Estimado</span>
                        <span className="text-2xl font-black text-white">$450.00</span>
                    </div>
                </div>
                <p className="text-xs text-purple-200 mt-4">* Se requiere un pago del 50% para reservar la fecha.</p>
            </div>
        </motion.div>
    );
}
