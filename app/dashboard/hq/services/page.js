'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Plus, Edit2, Trash2,
    Check, Zap, Globe, Video,
    Palette, Layers, X, User,
    Building2, MapPin, Briefcase, FileText
} from 'lucide-react';
import { MOCK_DATA } from '@/lib/mockData';

export default function HQServicesPage() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [wizardStep, setWizardStep] = useState(1); // 1: Cards, 2: Profile, 3: Agreement
    const [clientProfile, setClientProfile] = useState({
        name: '',
        company: '',
        location: '',
        businessType: ''
    });

    const toggleExtra = (extraId) => {
        setSelectedExtras(prev => 
            prev.includes(extraId) 
                ? prev.filter(id => id !== extraId) 
                : [...prev, extraId]
        );
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setWizardStep(2);
    };

    const closeWizard = () => {
        setSelectedPlan(null);
        setWizardStep(1);
        setClientProfile({ name: '', company: '', location: '', businessType: '' });
    };

    return (
        <div className="p-8 space-y-12 relative min-h-screen bg-[#050511]">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">DIIC <span className="text-indigo-500">MONETIZACIÓN</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">God Mode Dashboard v5.0 — Estrategia de Precios 2026</p>
                </div>
            </div>

            {/* Pricing Grid - Core 3 Plans */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
                {MOCK_DATA.services.map((service, index) => (
                    <PricingCard
                        key={service.id}
                        service={service}
                        index={index}
                        onSelect={() => handleSelectPlan(service)}
                    />
                ))}
            </div>

            {/* Advanced Levels - Automations & Scale */}
            <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] whitespace-nowrap">Niveles Avanzados (Opcional)</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {MOCK_DATA.automations.map((extra) => (
                        <motion.div
                            key={extra.id}
                            whileHover={{ y: -5 }}
                            onClick={() => toggleExtra(extra.id)}
                            className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex items-center justify-between ${
                                selectedExtras.includes(extra.id) 
                                    ? 'bg-orange-500/10 border-orange-500 shadow-[0_20px_40px_rgba(249,115,22,0.1)]' 
                                    : 'bg-[#0E0E18] border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl transition-all ${
                                    selectedExtras.includes(extra.id) ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-gray-500 group-hover:text-white'
                                }`}>
                                    {extra.id === 'systems' ? <Layers className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider mb-1">{extra.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{extra.price}</p>
                                </div>
                            </div>
                            
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedExtras.includes(extra.id) ? 'bg-orange-500 border-orange-500 text-black' : 'border-white/10 text-transparent'
                            }`}>
                                <Check className="w-4 h-4 font-black" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Wizard Modal */}
            <AnimatePresence>
                {wizardStep > 1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeWizard}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0E0E18] border border-white/10 rounded-[3rem] shadow-[0_100px_200px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                                        <Zap className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                                        {wizardStep === 2 ? 'Perfil Estratégico' : 'Acuerdo de Producción'}
                                    </h2>
                                </div>
                                <button onClick={closeWizard} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {wizardStep === 2 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Titular del Acuerdo</label>
                                                <div className="relative">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre y Apellido"
                                                        value={clientProfile.name}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Compañía / Marca</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ej. Nova Clínica"
                                                        value={clientProfile.company}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, company: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Territorio de Aplicación</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ciudad, País"
                                                        value={clientProfile.location}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, location: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Vertical de Negocio</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ej. Medicina / Real Estate"
                                                        value={clientProfile.businessType}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, businessType: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {wizardStep === 3 && (
                                    <div className="space-y-8">
                                        <div className="bg-indigo-600 rounded-3xl p-10 space-y-8 shadow-2xl shadow-indigo-500/20">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Entidad DIIC Strategist</p>
                                                    <h3 className="text-2xl font-black text-white italic">{selectedPlan.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Compromiso Mensual</p>
                                                    <p className="text-4xl font-black text-white">${selectedPlan.price}</p>
                                                </div>
                                            </div>

                                            <div className="h-px bg-white/10 w-full" />

                                            <div className="grid grid-cols-2 gap-8 text-white">
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Titular Confirmado</p>
                                                    <p className="text-lg font-black">{clientProfile.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Corporativo</p>
                                                    <p className="text-lg font-black">{clientProfile.company}</p>
                                                </div>
                                            </div>

                                            {selectedExtras.length > 0 && (
                                                <div className="pt-6 border-t border-white/10 space-y-4">
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Adicionales Seleccionados</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {selectedExtras.map(id => {
                                                            const extra = MOCK_DATA.automations.find(a => a.id === id);
                                                            return (
                                                                <div key={id} className="px-5 py-2 bg-black/40 border border-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                                                                    + {extra.name} (A Cotizar)
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 px-2">
                                                <FileText className="w-5 h-5 text-indigo-400" />
                                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Cláusulas de Producción</h4>
                                            </div>
                                            <div className="bg-black/40 border border-white/5 rounded-[2rem] p-10 text-xs text-gray-500 leading-loose font-medium italic">
                                                <p className="mb-6 text-white not-italic font-black text-sm uppercase tracking-widest">Base del Acuerdo:</p>
                                                "Este acuerdo establece la activación inmediata del plan seleccionado ({selectedPlan.name}), detallando la producción de reels, carruseles y la estrategia del equipo filmmaker conforme a los niveles estratégicos DIIC ZONE."
                                                <div className="mt-8 h-px bg-white/5 mb-8" />
                                                <p>
                                                    DIIC ZONE garantiza la entrega de las piezas descritas manteniendo los estándares de calidad cinemática.
                                                    El cliente asegura el acceso a locaciones y personal clave para las sesiones de rodaje programadas.
                                                </p>
                                                <div className="mt-12 flex justify-between">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-40 h-px bg-gray-800" />
                                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 pl-2">DIIC ZONE</span>
                                                    </div>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-40 h-px bg-gray-800" />
                                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 pl-2">EL CLIENTE</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-10 border-t border-white/5 bg-white/[0.02] flex gap-4">
                                {wizardStep === 2 ? (
                                    <button
                                        onClick={() => setWizardStep(3)}
                                        disabled={!clientProfile.name || !clientProfile.company}
                                        className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-[0.3em]"
                                    >
                                        Generar Acuerdo
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setWizardStep(2)}
                                            className="px-10 py-6 bg-white/5 hover:bg-white/10 text-gray-500 font-black rounded-2xl transition-all uppercase text-xs tracking-widest"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            onClick={() => {
                                                alert('Acuerdo DIIC Emitido con Éxito. Iniciando Despliegue Estratégico.');
                                                closeWizard();
                                            }}
                                            className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                                        >
                                            <Check className="w-6 h-6" /> Confirmar Cierre
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PricingCard({ service, index, onSelect }) {
    const isPopular = index === 1;
    const icons = [Shield, Zap, Crown];
    const Icon = icons[index] || Zap;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-10 rounded-[3rem] border flex flex-col h-full relative overflow-hidden group transition-all duration-500 ${isPopular ? 'bg-indigo-600 border-indigo-400 shadow-[0_40px_80px_rgba(99,102,241,0.2)]' : 'bg-[#0E0E18] border-white/5 hover:border-white/10'
                }`}
        >
            {isPopular && (
                <div className="absolute top-8 right-8 bg-white/20 text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                    PLAN CLAVE
                </div>
            )}

            {/* Header: Icon & Name */}
            <div className="flex items-start gap-5 mb-10">
                <div className={`p-4 rounded-3xl ${isPopular ? 'bg-white/20' : 'bg-white/5 text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity'}`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white italic leading-tight mb-1">{service.name}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isPopular ? 'text-white/50' : 'text-gray-600'}`}>{service.level}</p>
                </div>
            </div>

            {/* Price Main */}
            <div className="mb-8">
                <p className={`text-[8px] font-black uppercase tracking-[0.5em] mb-2 ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>Desde</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tighter">${service.price}</span>
                    <span className={`text-[10px] font-bold ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>/MES <span className="opacity-50">(+ IVA)</span></span>
                </div>
            </div>

            {/* Sub Prices Row */}
            <div className="grid grid-cols-2 gap-3 mb-10">
                <div className="p-4 bg-black/20 border border-white/5 rounded-2xl text-center">
                    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isPopular ? 'text-white/30' : 'text-gray-600'}`}>3 MESES:</p>
                    <p className="text-sm font-black text-white">${service.threeMonthPrice}</p>
                </div>
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
                    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isPopular ? 'text-white/30' : 'text-indigo-400/80'}`}>SETUP MES 1:</p>
                    <p className="text-sm font-black text-white">${service.setupFee}</p>
                </div>
            </div>

            {/* Narrative Box */}
            <div className={`p-8 rounded-[2.5rem] mb-10 min-h-[140px] flex items-center justify-center italic text-center text-sm font-medium leading-relaxed ${isPopular ? 'bg-white/10 text-white border border-white/10' : 'bg-black/40 text-gray-400 border border-white/5'}`}>
                "{service.narrative}"
            </div>

            {/* Info Row: Enfoque & Filmmaker */}
            <div className="flex justify-between items-center mb-10 px-2">
                <div>
                    <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 ${isPopular ? 'text-white/40' : 'text-gray-600'}`}>ENFOQUE</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isPopular ? 'text-emerald-300' : 'text-emerald-500'}`}>{service.enfoque}</p>
                </div>
                <div className="text-right">
                    <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 ${isPopular ? 'text-white/40' : 'text-gray-600'}`}>FILMMAKER</p>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{service.filmmaker}</p>
                </div>
            </div>

            {/* Deliverables Grid */}
            <div className="grid grid-cols-3 gap-1 mb-12 border-t border-white/5 pt-8">
                <DeliverableItem label="REELS" value={service.deliverables.reels} isPopular={isPopular} />
                <DeliverableItem label="POSTS" value={service.deliverables.posts} isPopular={isPopular} />
                <DeliverableItem label="STORIES" value={service.deliverables.stories} isPopular={isPopular} />
            </div>

            {/* Action CTA */}
            <button
                onClick={onSelect}
                className={`w-full py-6 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] transition-all ${isPopular ? 'bg-white text-black hover:bg-gray-100 shadow-2xl' : 'bg-black border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500 shadow-xl'
                    }`}
            >
                Seleccionar este plan
            </button>
        </motion.div>
    );
}

function DeliverableItem({ label, value, isPopular }) {
    return (
        <div className="text-center">
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className={`text-[8px] font-black uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>{label}</p>
        </div>
    );
}

function Shield(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}

function Crown(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
    )
}
