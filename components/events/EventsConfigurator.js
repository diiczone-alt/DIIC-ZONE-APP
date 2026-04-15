'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check, MapPin, Calendar, Clock, ArrowRight,
    Video, Camera, Mic, DollarSign, Users, FileText,
    Settings, Zap, MonitorPlay, Film, Radio
} from 'lucide-react';

export default function EventsConfigurator({ eventType, onComplete, onBack }) {
    const [step, setStep] = useState(1);

    // Config State
    const [config, setConfig] = useState({
        technicalPackages: [],
        eventName: '',
        date: '',
        setupTime: '', // Call Time
        startTime: '',
        endTime: '',
        location: '',
        venueDetails: {
            lighting: 'indoor', // indoor, outdoor, mixed
            audioFeed: false,
            internet: 'wifi' // wifi, dedicated, none
        },
        address: '',
        contact: '',
        attendees: '',
    });

    const TECHNICAL_PACKAGES = [
        {
            id: 'cinema',
            label: 'Cobertura Cinema Line',
            description: 'Camaras Sony FX6/FX3 4K 10bit, Óptica Prime. Ideal para aftermovies cinematográficos.',
            icon: Film,
            price: 850,
            features: ['2 Cámaras 4K', 'Estabilizadores Ronin', 'Color Grading Pro']
        },
        {
            id: 'broadcast',
            label: 'Circuito Cerrado (IMAG)',
            description: 'Transmisión a pantallas del evento. Switcher Blackmagic y Cámaras PTZ/Operadas.',
            icon: MonitorPlay,
            price: 1200,
            features: ['Mixer ATEM Extreme', '4 Entradas SDI', 'Grabación PGM']
        },
        {
            id: 'streaming',
            label: 'Live Streaming Pro',
            description: 'Transmisión multiplataforma (YT/FB/LinkedIn) con enlace dedicado (Bonding 5G).',
            icon: Radio,
            price: 600,
            features: ['LiveU Solo', 'Gráficos en vivo', 'Chat overlay']
        },
        {
            id: 'photo_editorial',
            label: 'Fotografía Editorial',
            description: 'Fotógrafos senior con equipo Full Frame y set de iluminación móvil.',
            icon: Camera,
            price: 450,
            features: ['Entrega Express', 'Edición Lightroom', 'Galería Web']
        },
        {
            id: 'drone_fpv',
            label: 'Drone FPV & Aéreo',
            description: 'Vuelos interiores (FPV) y exteriores (Mavic 3 Cine). Requiere permisos.',
            icon: Zap,
            price: 350,
            features: ['Piloto Certificado', 'Seguro RC', 'Video 5.1K']
        },
    ];

    const togglePackage = (id) => {
        setConfig(prev => {
            const exists = prev.technicalPackages.includes(id);
            return {
                ...prev,
                technicalPackages: exists
                    ? prev.technicalPackages.filter(s => s !== id)
                    : [...prev.technicalPackages, id]
            };
        });
    };

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleVenueChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            venueDetails: { ...prev.venueDetails, [field]: value }
        }));
    };

    const handleNext = () => {
        if (step < 6) setStep(step + 1);
        else onComplete({ ...config, type: eventType });
    };

    // Advanced Quote Calculation
    const calculateQuote = () => {
        let equipment = 0;
        config.technicalPackages.forEach(pId => {
            const pkg = TECHNICAL_PACKAGES.find(p => p.id === pId);
            if (pkg) equipment += pkg.price;
        });

        const crew = 300; // Base crew cost
        const preProd = 150; // Management fee
        const postProd = equipment * 0.4; // Est. post cost

        return {
            equipment,
            crew,
            preProd,
            postProd,
            total: equipment + crew + preProd + postProd
        };
    };

    const quote = calculateQuote();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Steps Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <button onClick={onBack} className="text-gray-400 hover:text-white text-xs flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 rotate-180" /> Cancelar
                </button>
                <div className="flex items-center gap-2 bg-[#0E0E18] px-4 py-2 rounded-full border border-white/10">
                    <Settings className="w-3 h-3 text-lime-500 animate-spin-slow" />
                    <span className="text-[10px] font-mono text-lime-400 uppercase tracking-widest">Modo Experto</span>
                </div>
            </div>

            {/* Stepper Visual */}
            <div className="mb-8 flex justify-between relative px-6">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                {['Paquete', 'Logística', 'Plan', 'Crew', 'Cotización', 'Contrato'].map((label, idx) => {
                    const s = idx + 1;
                    return (
                        <div key={s} className="flex flex-col items-center bg-[#050511] px-2">
                            <div className={`w-2 h-2 rounded-full mb-1 transition-all ${step >= s ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]' : 'bg-white/20'}`} />
                            <span className={`text-[9px] uppercase font-bold tracking-wider ${step >= s ? 'text-white' : 'text-gray-600'}`}>{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Content Area */}
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0E0E18] border border-white/10 rounded-2xl p-6 min-h-[450px] flex flex-col relative overflow-hidden"
            >
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

                {step === 1 && (
                    <div className="flex-grow z-10">
                        <h2 className="text-3xl font-black text-white mb-2">Paquetes Técnicos de Cobertura</h2>
                        <p className="text-gray-400 mb-8 font-light">Selecciona el nivel de equipamiento requerido para la producción.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {TECHNICAL_PACKAGES.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => togglePackage(pkg.id)}
                                    className={`relative p-6 rounded-2xl border text-left transition-all group overflow-hidden ${config.technicalPackages.includes(pkg.id)
                                        ? 'bg-lime-900/10 border-lime-500'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-50">
                                        <pkg.icon className={`w-12 h-12 ${config.technicalPackages.includes(pkg.id) ? 'text-lime-500' : 'text-gray-600'}`} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-lg ${config.technicalPackages.includes(pkg.id) ? 'bg-lime-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                                                <pkg.icon className="w-5 h-5" />
                                            </div>
                                            {config.technicalPackages.includes(pkg.id) && <Check className="w-5 h-5 text-lime-500" />}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{pkg.label}</h3>
                                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{pkg.description}</p>

                                        <div className="space-y-1">
                                            {pkg.features.map(f => (
                                                <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                                                    <div className="w-1 h-1 bg-gray-500 rounded-full" /> {f}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/10 text-lime-400 font-mono text-sm">
                                            +${pkg.price} / jornada
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex-grow z-10">
                        <h2 className="text-3xl font-black text-white mb-2">Logística & Venue</h2>
                        <p className="text-gray-400 mb-8 font-light">Información técnica del lugar para el plan de rodaje.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* General Info */}
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Datos Generales</h3>
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Nombre del Proyecto / Evento"
                                            className="w-full bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-lime-500 outline-none"
                                            onChange={(e) => handleChange('eventName', e.target.value)}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="date" className="bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-lime-500 outline-none" />
                                            <input type="text" placeholder="Aforo Esperado" className="bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-lime-500 outline-none" />
                                        </div>
                                        <input
                                            placeholder="Ubicación (Google Maps link ideal)"
                                            className="w-full bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-lime-500 outline-none"
                                            onChange={(e) => handleChange('location', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Survey */}
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Survey Técnico</h3>

                                    <div className="space-y-6">
                                        {/* Lighting */}
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-2">Condiciones de Luz</label>
                                            <div className="flex gap-2">
                                                {['indoor', 'outdoor', 'mixed'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleVenueChange('lighting', opt)}
                                                        className={`flex-1 py-2 rounded-lg border text-xs uppercase font-bold ${config.venueDetails.lighting === opt
                                                            ? 'bg-lime-500 text-black border-lime-500'
                                                            : 'bg-[#050511] text-gray-500 border-white/10'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Audio */}
                                        <div className="flex items-center justify-between p-3 bg-[#050511] rounded-xl border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <Mic className="text-gray-400 w-4 h-4" />
                                                <span className="text-sm text-gray-300">¿Feed de Audio Disponible?</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={config.venueDetails.audioFeed} onChange={(e) => handleVenueChange('audioFeed', e.target.checked)} />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                                            </label>
                                        </div>

                                        {/* Internet */}
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-2">Conectividad para Live</label>
                                            <select
                                                className="w-full bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm outline-none"
                                                onChange={(e) => handleVenueChange('internet', e.target.value)}
                                            >
                                                <option value="wifi">Venue WiFi (Compartido)</option>
                                                <option value="dedicated">Línea Dedicada (Ethernet)</option>
                                                <option value="none">Sin Conexión (Requiere Mochila 4G/5G)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex-grow z-10">
                        <h2 className="text-3xl font-black text-white mb-2">Planificación</h2>
                        <p className="text-gray-400 mb-8 font-light">Definición de horarios clave para el equipo (Call Sheet preliminar).</p>

                        {/* Timeline Visualizer */}
                        <div className="relative py-12 px-4 border-l-2 border-white/10 ml-4 space-y-12">
                            {/* Call Time */}
                            <div className="relative">
                                <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 pt-1">
                                        <input type="time" className="bg-[#050511] border border-white/20 rounded p-1 text-white text-xs w-full text-center" defaultValue="16:00" />
                                        <div className="text-[10px] text-gray-500 text-center mt-1">Setup (2h antes)</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex-1">
                                        <h4 className="font-bold text-white text-sm">Call Time (Equipo Técnico)</h4>
                                        <p className="text-xs text-gray-400">Llegada, descarga de equipos, montaje de cámaras y pruebas de audio.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Event Start */}
                            <div className="relative">
                                <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.8)] animate-pulse" />
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 pt-1">
                                        <input type="time" className="bg-[#050511] border border-lime-500/50 rounded p-1 text-lime-400 text-xs w-full text-center font-bold" defaultValue="18:00" />
                                        <div className="text-[10px] text-lime-500 text-center mt-1">Inicio Evento</div>
                                    </div>
                                    <div className="bg-lime-500/10 p-4 rounded-xl border border-lime-500/30 flex-1">
                                        <h4 className="font-bold text-white text-sm">REC / Live Start</h4>
                                        <p className="text-xs text-lime-200">Inicio de grabación y transmisión. Todo el personal en posición.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Strike / Wrap */}
                            <div className="relative">
                                <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-red-500" />
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 pt-1">
                                        <input type="time" className="bg-[#050511] border border-white/20 rounded p-1 text-white text-xs w-full text-center" defaultValue="22:00" />
                                        <div className="text-[10px] text-gray-500 text-center mt-1">Wrap</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex-1">
                                        <h4 className="font-bold text-white text-sm">Fin de Cobertura & Desmontaje</h4>
                                        <p className="text-xs text-gray-400">Guardado de material (Backups), desmontaje de equipos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                                <FileText className="w-4 h-4" /> Subir Escaleta / Run of Show (PDF)
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex-grow z-10">
                        <h2 className="text-3xl font-black text-white mb-2">Crew & Staff</h2>
                        <p className="text-gray-400 mb-8 font-light">Basado en tus selecciones, asignaremos el siguiente personal:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { role: 'Productor de Campo', desc: 'Coordinación general Logística', required: true },
                                { role: 'Camarógrafo A (Jefe)', desc: 'Plano Master / Dirección de foto', required: true },
                                { role: 'Sonidista', desc: 'Monitoreo de frecuencia y mezcla', required: config.venueDetails.audioFeed },
                                { role: 'Operador de Drone', desc: 'Vuelos y tomas aéreas', required: config.technicalPackages.includes('drone_fpv') },
                                { role: 'Streaming Tech', desc: 'Codificación y gestión de señal', required: config.technicalPackages.includes('streaming') },
                            ].filter(c => c.required).map((crew, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                                        <Users className="w-4 h-4 text-gray-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{crew.role}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{crew.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex-grow z-10">
                        <h2 className="text-3xl font-black text-white mb-6">Cotización Profesional</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Breakdown */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                                    <table className="w-full text-sm">
                                        <thead className="bg-white/5 text-gray-400">
                                            <tr>
                                                <th className="p-4 text-left font-normal uppercase text-xs tracking-wider">Concepto</th>
                                                <th className="p-4 text-right font-normal uppercase text-xs tracking-wider">Costo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            <tr>
                                                <td className="p-4 text-white">
                                                    <span className="block font-bold">Equipamiento & Renta</span>
                                                    <span className="text-xs text-gray-500">Cámaras, Lentes, Audio, Iluminación</span>
                                                </td>
                                                <td className="p-4 text-right text-white font-mono">${quote.equipment}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 text-white">
                                                    <span className="block font-bold">Crew & Personal Técnico</span>
                                                    <span className="text-xs text-gray-500">Jornada de 6 horas + Comidas</span>
                                                </td>
                                                <td className="p-4 text-right text-white font-mono">${quote.crew}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 text-white">
                                                    <span className="block font-bold">Pre-Producción</span>
                                                    <span className="text-xs text-gray-500">Scouting, Planificación, Logística</span>
                                                </td>
                                                <td className="p-4 text-right text-white font-mono">${quote.preProd}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 text-white">
                                                    <span className="block font-bold">Post-Producción</span>
                                                    <span className="text-xs text-gray-500">Edición, Colorización, Renderizado</span>
                                                </td>
                                                <td className="p-4 text-right text-white font-mono">${quote.postProd}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="bg-lime-900/20">
                                            <tr>
                                                <td className="p-4 text-right font-bold text-lime-400 uppercase">Total Estimado</td>
                                                <td className="p-4 text-right font-black text-xl text-lime-400 font-mono">${quote.total}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="bg-[#050511] rounded-2xl p-6 border border-white/10 h-fit">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Condiciones Comerciales</h4>
                                <ul className="space-y-3 text-xs text-gray-500 list-disc pl-4">
                                    <li>Reserva con 50% de anticipo.</li>
                                    <li>Entrega de material en 7 días hábiles.</li>
                                    <li>Horas extra se cobran al 1.5x.</li>
                                    <li>Cancelación con 48h de aviso.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="flex-grow text-center flex flex-col items-center justify-center z-10">
                        <div className="w-24 h-24 bg-lime-500/10 rounded-full flex items-center justify-center mb-8 border border-lime-500/20 relative">
                            <div className="absolute inset-0 rounded-full animate-ping bg-lime-500/5" />
                            <DollarSign className="w-10 h-10 text-lime-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">Confirmar Producción</h2>
                        <p className="text-gray-400 max-w-lg mb-10 text-lg font-light">
                            Estás a un paso de agendar tu cobertura profesional. Bloquea la fecha y asignaremos al equipo de inmediato.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <button className="flex-1 py-4 rounded-xl bg-lime-500 text-black font-bold uppercase tracking-wider hover:bg-lime-400 shadow-lg shadow-lime-900/20">
                                Pagar Total (${quote.total})
                            </button>
                            <button className="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold uppercase tracking-wider hover:bg-white/10 border border-white/10">
                                Reservar (50%)
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-end pt-8 border-t border-white/5 mt-auto z-10">
                    <button
                        onClick={handleNext}
                        className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-all hover:scale-105"
                    >
                        {step === 6 ? 'Finalizar' : 'Siguiente Paso'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
