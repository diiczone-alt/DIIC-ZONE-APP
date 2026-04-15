'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Calendar, Clock, ArrowRight, User, Users,
    Image as ImageIcon, DollarSign, Wand2, MapPin,
    Palette, Package, Camera, CreditCard, ChevronRight,
    Sun, Zap, Aperture, Monitor
} from 'lucide-react';

export default function PhotoConfigurator({ category, onComplete, onBack }) {
    const [step, setStep] = useState(1);

    // Config State
    const [config, setConfig] = useState({
        subType: '',
        mood: '', // style
        technical: {
            lighting: 'natural', // natural, flash, mix, continuous
            tethering: false,
        },
        date: '',
        time: '',
        duration: '1 hora', // 2h, half_day, full_day
        locationType: 'estudio',
        locationDetails: '', // address
        crew: 'photographer',
        postProduction: {
            count: 15,
            level: 'basic', // basic, high_end, creative
            format: 'digital_print' // web, print, full_res
        },
        addons: [],
        paymentType: null,
    });

    // --- Data Matrices ---
    const SUBTYPES = {
        studio: [
            { id: 'portrait_fineart', label: 'Retrato Fine Art', desc: 'Acabado pictórico y dramático.' },
            { id: 'branding', label: 'Personal Branding', desc: 'Para web y prensa.' },
            { id: 'fashion', label: 'Fashion Editorial', desc: 'Estilismo y moda.' },
            { id: 'headshot', label: 'Corporate Headshot', desc: 'Fondo neutro para LinkedIn.' }
        ],
        medical: [
            { id: 'clinic_portrait', label: 'Retrato en Consultorio', desc: 'Autoridad médica en tu espacio.' },
            { id: 'procedure', label: 'Documentación Procedimiento', desc: 'Registro técnico en quirófano.' },
            { id: 'staff', label: 'Foto de Staff Médico', desc: 'Equipo completo uniformado.' },
            { id: 'campaign', label: 'Campaña Sanitaria', desc: 'Publicidad y marketing ético.' }
        ],
        // ... defaults for others
        default: [
            { id: 'standard', label: 'Sesión Estándar', desc: 'Cobertura profesional general.' },
            { id: 'premium', label: 'Sesión Premium', desc: 'Mayor producción y equipo.' }
        ]
    };

    const MOODS = [
        { id: 'natural', label: 'Natural & Organic', color: 'bg-green-500' },
        { id: 'high_contrast', label: 'High Contrast / Dramatic', color: 'bg-gray-900' },
        { id: 'bright_airy', label: 'Bright & Airy', color: 'bg-sky-200' },
        { id: 'corporate_clean', label: 'Corporate Clean', color: 'bg-blue-600' },
    ];

    const CREW_PACKAGES = [
        { id: 'photographer', label: 'Solo Fotógrafo', items: ['Cámara Full Frame', 'Lente Prime'], price: 200 },
        { id: 'assisted', label: 'Fotógrafo + Asistente', items: ['Iluminación Móvil', 'Reflectores'], price: 350 },
        { id: 'digitech', label: 'Pro Team (DigiTech)', items: ['Tethering en vivo', 'Monitor Cliente', 'Asistente Luces'], price: 600 },
    ];

    const RETOUCHING_LEVELS = [
        { id: 'basic', label: 'Corrección de Color', pricePer: 0 },
        { id: 'skin', label: 'Retoque de Piel (High-End)', pricePer: 15 },
        { id: 'creative', label: 'Montaje Creativo', pricePer: 40 },
    ];

    const ADDONS = [
        { id: 'makeup', label: 'MUA (Maquillaje)', price: 120, icon: User },
        { id: 'stylist', label: 'Estilista de Moda', price: 150, icon: Palette },
        { id: 'scouting', label: 'Scouting de Locación', price: 80, icon: MapPin },
        { id: 'raw_delivery', label: 'Entrega RAW', price: 200, icon: ImageIcon },
    ];

    // --- Logic ---
    const getSubtypes = () => SUBTYPES[category?.id] || SUBTYPES.default;

    const toggleAddon = (id) => {
        setConfig(prev => config.addons.includes(id)
            ? { ...prev, addons: prev.addons.filter(x => x !== id) }
            : { ...prev, addons: [...prev.addons, id] }
        );
    };

    const calculateTotal = () => {
        let t = 0;
        // Crew Base
        t += CREW_PACKAGES.find(c => c.id === config.crew)?.price || 0;
        // Duration
        if (config.duration === '2h') t += 100;
        if (config.duration === 'half_day') t += 300;
        if (config.duration === 'full_day') t += 600;
        // Retouching
        const retouchPrice = RETOUCHING_LEVELS.find(r => r.id === config.postProduction.level)?.pricePer || 0;
        t += (config.postProduction.count * retouchPrice);
        // Addons
        config.addons.forEach(id => {
            const add = ADDONS.find(a => a.id === id);
            if (add) t += add.price;
        });
        return t;
    };

    const handleNext = () => {
        if (step < 8) setStep(step + 1);
        else onComplete({ ...config, category, total: calculateTotal() });
    };

    const total = calculateTotal();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header Compact */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-gray-400 hover:text-white text-xs flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 rotate-180" /> Cancelar
                </button>
                <div className="flex items-center gap-2 bg-[#0E0E18] px-3 py-1.5 rounded-full border border-white/10">
                    <Camera className="w-3 h-3 text-pink-500" />
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest">{category?.title || 'Producción'}</span>
                </div>
            </div>

            {/* Pagination Lines */}
            <div className="flex gap-1 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full text-[0px] ${step >= s ? 'bg-pink-500' : 'bg-white/10'}`}>.</div>
                ))}
            </div>

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0E0E18] border border-white/10 rounded-2xl p-6 min-h-[460px] flex flex-col relative"
            >
                {/* STEP 1: SUBTYPE */}
                {step === 1 && (
                    <div className="flex-grow">
                        <h2 className="text-2xl font-black text-white mb-2">Enfoque Visual</h2>
                        <p className="text-gray-400 text-sm mb-6">Define la dirección artística de la sesión.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {getSubtypes().map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setConfig({ ...config, subType: t.id })}
                                    className={`p-4 rounded-xl border text-left transition-all ${config.subType === t.id ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                                        }`}
                                >
                                    <div className="font-bold text-sm mb-1">{t.label}</div>
                                    <div className={`text-xs ${config.subType === t.id ? 'text-pink-100' : 'text-gray-500'}`}>{t.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: TECH SPECS */}
                {step === 2 && (
                    <div className="flex-grow">
                        <h2 className="text-2xl font-black text-white mb-2">Especificaciones Técnicas</h2>
                        <p className="text-gray-400 text-sm mb-6">Moodboard y esquema de iluminación preferido.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase mb-3 block">Mood / Vibras</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {MOODS.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setConfig({ ...config, mood: m.id })}
                                            className={`flex items-center gap-3 p-3 rounded-xl border text-left ${config.mood === m.id ? 'border-pink-500 bg-white/5' : 'border-white/10 bg-transparent'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full ${m.color} shadow-sm`} />
                                            <span className="text-xs font-bold text-white">{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Iluminación</label>
                                    <div className="space-y-2">
                                        {['natural', 'flash', 'continuous'].map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setConfig(prev => ({ ...prev, technical: { ...prev.technical, lighting: l } }))}
                                                className={`w-full py-2 px-3 rounded-lg border text-xs text-left flex justify-between ${config.technical.lighting === l ? 'bg-pink-500/20 border-pink-500 text-white' : 'border-white/10 text-gray-500'
                                                    }`}
                                            >
                                                <span className="capitalize">{l} Light</span>
                                                {l === 'flash' && <Zap className="w-3 h-3" />}
                                                {l === 'natural' && <Sun className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Tethering</label>
                                    <button
                                        onClick={() => setConfig(prev => ({ ...prev, technical: { ...prev.technical, tethering: !prev.technical.tethering } }))}
                                        className={`w-full p-3 rounded-xl border flex flex-col items-center justify-center gap-2 h-[100px] transition-colors ${config.technical.tethering ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/5 border-white/10 text-gray-500'
                                            }`}
                                    >
                                        <Monitor className="w-6 h-6" />
                                        <div className="text-[10px] uppercase font-bold text-center">
                                            {config.technical.tethering ? 'Conectado a Monitor' : 'Sin Monitor'}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: LOGISTICS */}
                {step === 3 && (
                    <div className="flex-grow">
                        <h2 className="text-2xl font-black text-white mb-4">Logística de Producción</h2>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" className="bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm outline-none" />
                                <input type="time" className="bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase">Duración (Jornada)</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: '1h', l: '1 Hora' }, { id: '2h', l: '2 Horas (+100)' },
                                        { id: 'half_day', l: 'Media (+300)' }, { id: 'full_day', l: 'Full (+600)' }
                                    ].map(d => (
                                        <button
                                            key={d.id}
                                            onClick={() => setConfig({ ...config, duration: d.id })}
                                            className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-xl border transition-all ${config.duration === d.id ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'
                                                }`}
                                        >
                                            {d.l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase">Locación</label>
                                <select className="w-full bg-[#050511] border border-white/10 rounded-xl p-3 text-white text-sm outline-none">
                                    <option value="estudio">📍 Estudio DIIC ZONE (Incluido)</option>
                                    <option value="consultorio">🏥 En Consultorio / Oficina</option>
                                    <option value="exterior">🌳 Exteriores (Luz Natural)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: CREW */}
                {step === 4 && (
                    <div className="flex-grow">
                        <h2 className="text-2xl font-black text-white mb-2">Equipo Humano (Crew)</h2>
                        <p className="text-gray-400 text-sm mb-6">Selecciona el nivel de soporte en set.</p>

                        <div className="space-y-3">
                            {CREW_PACKAGES.map(pkg => (
                                <button
                                    key={pkg.id}
                                    onClick={() => setConfig({ ...config, crew: pkg.id })}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all group ${config.crew === pkg.id ? 'bg-pink-500/10 border-pink-500' : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.crew === pkg.id ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">{pkg.label}</div>
                                            <div className="text-[10px] text-gray-400 flex gap-2 mt-1">
                                                {pkg.items.map(i => <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{i}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-pink-400 font-mono text-sm font-bold">${pkg.price}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 5: POST-PRODUCTION */}
                {step === 5 && (
                    <div className="flex-grow">
                        <h2 className="text-2xl font-black text-white mb-4">Post-Producción High-End</h2>

                        {/* Quantity Slider */}
                        <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs text-gray-400 font-bold uppercase">Fotos Editadas</span>
                                <span className="text-pink-400 font-black text-lg">{config.postProduction.count}</span>
                            </div>
                            <input
                                type="range" min="5" max="50" step="1"
                                value={config.postProduction.count}
                                onChange={(e) => setConfig(prev => ({ ...prev, postProduction: { ...prev.postProduction, count: parseInt(e.target.value) } }))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>

                        {/* Retouch Levels */}
                        <h3 className="text-xs text-gray-500 font-bold uppercase mb-3">Nivel de Retoque</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {RETOUCHING_LEVELS.map(lvl => (
                                <button
                                    key={lvl.id}
                                    onClick={() => setConfig(prev => ({ ...prev, postProduction: { ...prev.postProduction, level: lvl.id } }))}
                                    className={`p-3 rounded-lg border text-left flex justify-between items-center ${config.postProduction.level === lvl.id ? 'bg-pink-500/20 border-pink-500 text-white' : 'border-white/10 text-gray-400'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Wand2 className={`w-4 h-4 ${config.postProduction.level === lvl.id ? 'text-pink-400' : 'text-gray-600'}`} />
                                        <span className="text-sm font-bold">{lvl.label}</span>
                                    </div>
                                    <span className="text-xs font-mono">{lvl.pricePer > 0 ? `+$${lvl.pricePer}/foto` : 'Incluido'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 6: EXTRAS */}
                {step === 6 && (
                    <div className="flex-grow">
                        <h2 className="text-2xl font-black text-white mb-4">Complementos (Add-ons)</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {ADDONS.map(a => (
                                <button
                                    key={a.id}
                                    onClick={() => toggleAddon(a.id)}
                                    className={`p-4 rounded-2xl border text-left transition-all ${config.addons.includes(a.id) ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500' : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`p-2 rounded-lg ${config.addons.includes(a.id) ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                                            <a.icon className="w-4 h-4" />
                                        </div>
                                        {config.addons.includes(a.id) && <Check className="w-4 h-4 text-pink-500" />}
                                    </div>
                                    <div className="text-white font-bold text-xs">{a.label}</div>
                                    <div className="text-pink-400 font-mono text-[10px] uppercase font-bold">+${a.price}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 7: QUOTE */}
                {step === 7 && (
                    <div className="flex-grow">
                        <h2 className="text-2xl font-black text-white mb-4">Cotización Detallada</h2>
                        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 mb-6">
                            <table className="w-full text-xs">
                                <thead className="bg-[#050511] text-gray-500">
                                    <tr>
                                        <th className="p-3 text-left font-normal uppercase">Concepto</th>
                                        <th className="p-3 text-right font-normal uppercase">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300">
                                    <tr>
                                        <td className="p-3">
                                            <strong className="text-white block">Crew & Equipamiento</strong>
                                            <span className="text-[10px] text-gray-500">{CREW_PACKAGES.find(c => c.id === config.crew)?.label}</span>
                                        </td>
                                        <td className="p-3 text-right font-mono">${CREW_PACKAGES.find(c => c.id === config.crew)?.price}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">
                                            <strong className="text-white block">Post-Producción</strong>
                                            <span className="text-[10px] text-gray-500">{config.postProduction.count} fotos nivel {RETOUCHING_LEVELS.find(r => r.id === config.postProduction.level)?.label}</span>
                                        </td>
                                        <td className="p-3 text-right font-mono">
                                            ${(config.postProduction.count * (RETOUCHING_LEVELS.find(r => r.id === config.postProduction.level)?.pricePer || 0))}
                                        </td>
                                    </tr>
                                    {config.duration !== '1h' && (
                                        <tr>
                                            <td className="p-3">Extensión Jornada ({config.duration})</td>
                                            <td className="p-3 text-right font-mono">
                                                ${config.duration === '2h' ? 100 : config.duration.includes('half') ? 300 : 600}
                                            </td>
                                        </tr>
                                    )}
                                    {config.addons.map(aId => {
                                        const a = ADDONS.find(x => x.id === aId);
                                        return (
                                            <tr key={aId}>
                                                <td className="p-3 text-pink-300">+ {a.label}</td>
                                                <td className="p-3 text-right font-mono text-pink-300">${a.price}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-pink-900/10">
                                    <tr>
                                        <td className="p-4 font-bold text-white uppercase text-right">Total</td>
                                        <td className="p-4 font-black text-lg text-pink-400 text-right font-mono">${total}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* STEP 8: PAYMENT */}
                {step === 8 && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-pink-500/20">
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Reserva Profesional</h2>
                        <p className="text-gray-400 text-sm max-w-xs mb-8">
                            Bloquea la fecha y el equipo seleccionado. Se generará un contrato digital automáticamente.
                        </p>
                        <button
                            onClick={() => setConfig(prev => ({ ...prev, paymentType: 'full' }))}
                            className="w-full max-w-xs py-4 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 shadow-lg mb-3"
                        >
                            Pagar Total (${total})
                        </button>
                        <button
                            onClick={() => setConfig(prev => ({ ...prev, paymentType: 'reserve' }))}
                            className="w-full max-w-xs py-4 rounded-xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 border border-white/10"
                        >
                            Reservar con 50% (${total / 2})
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-end pt-6 border-t border-white/5 mt-auto">
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-pink-400 transition-colors"
                    >
                        {step === 8 ? 'Finalizar' : 'Siguiente Paso'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
