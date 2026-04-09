'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, Briefcase, Users, Star, Box } from 'lucide-react';

const CustomSelect = ({ label, value, options, onChange, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="space-y-1.5 group relative w-full">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-4 group-focus-within:text-indigo-400 transition-colors">
                {label}
            </label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border ${isOpen ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10'} p-4 rounded-2xl text-white text-base cursor-pointer transition-all font-bold pl-12 relative flex items-center justify-between group h-[58px]`}
            >
                <Icon className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${value ? 'text-indigo-500' : 'text-gray-500'}`} />
                <span className={value ? 'text-white' : 'text-gray-700'}>
                    {selectedOption ? selectedOption.label : "Selecciona..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[100] w-full mt-1 bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className="px-5 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between group/item"
                            >
                                {opt.label}
                                {value === opt.value && <Check className="w-4 h-4 text-indigo-500" />}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function BusinessInfoStep({ onNext, updateData }) {
    const [info, setInfo] = useState({
        services: '',
        mainService: '',
        experience: '',
        teamSize: ''
    });

    const experienceOptions = [
        { value: 'new', label: 'Menos de 1 año' },
        { value: '1-3', label: '1 - 3 años' },
        { value: '3-5', label: '3 - 5 años' },
        { value: '5+', label: 'Más de 5 años' }
    ];

    const teamOptions = [
        { value: 'solo', label: 'Solo-preneur' },
        { value: 'small', label: 'Equipo pequeño (2-5)' },
        { value: 'medium', label: 'Agencia/Empresa (5-20)' },
        { value: 'large', label: 'Gran Empresa (20+)' }
    ];

    const isComplete = info.services && info.mainService && info.experience && info.teamSize;

    return (
        <div className="flex flex-col h-full max-w-lg mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">
                    Hablemos de <br /> <span className="text-indigo-500">Tu Negocio</span>
                </h2>
                <p className="text-gray-400 text-xs font-medium tracking-wide">
                    Cuéntanos un poco más para entender tu contexto.
                </p>
            </div>

            <div className="space-y-4 flex-1">
                {/* Services Area */}
                <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-4 group-focus-within:text-indigo-400 transition-colors">
                        ¿Qué servicios ofreces?
                    </label>
                    <div className="relative">
                        <textarea
                            value={info.services}
                            onChange={e => setInfo({ ...info, services: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all font-bold pl-12 min-h-[100px] resize-none"
                            placeholder="Ej: Consultoría, Diseño, Clases..."
                        />
                        <Briefcase className="w-5 h-5 text-gray-500 absolute left-4 top-4 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                </div>

                {/* Main Product */}
                <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-4 group-focus-within:text-indigo-400 transition-colors">
                        ¿Cuál es tu producto estrella?
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={info.mainService}
                            onChange={e => setInfo({ ...info, mainService: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-base focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all font-bold pl-12 placeholder:text-gray-700"
                            placeholder="El que más vendes o quieres potenciar"
                        />
                        <Star className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                </div>

                {/* Dynamic Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect 
                        label="Tiempo en el mercado"
                        value={info.experience}
                        options={experienceOptions}
                        onChange={(val) => setInfo({...info, experience: val})}
                        icon={Box}
                    />
                    <CustomSelect 
                        label="Equipo de trabajo"
                        value={info.teamSize}
                        options={teamOptions}
                        onChange={(val) => setInfo({...info, teamSize: val})}
                        icon={Users}
                    />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: isComplete ? 1.02 : 1 }}
                whileTap={{ scale: isComplete ? 0.98 : 1 }}
                onClick={() => { updateData({ businessInfo: info }); onNext(); }}
                disabled={!isComplete}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${
                    isComplete 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_15px_30px_rgba(79,70,229,0.3)]' 
                    : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5 opacity-50'
                }`}
            >
                Continuar
                <ArrowRight className={`w-5 h-5 transition-transform ${isComplete ? 'translate-x-1' : ''}`} />
            </motion.button>

            {/* Premium Data Footer */}
            <div className="flex justify-between items-center px-4 opacity-30 pointer-events-none pb-2">
                <div className="flex items-center gap-2 font-mono text-[7px] tracking-[0.2em] uppercase">
                    <div className="w-1 h-1 rounded-full bg-indigo-500" />
                    Business_Core_Linked
                </div>
                <div className="font-mono text-[7px] tracking-[0.2em] uppercase">
                    V-INTEL: 0.98
                </div>
            </div>
        </div>
    );
}
