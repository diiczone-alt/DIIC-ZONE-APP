'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

export default function UserInfoStep({ onNext, updateData }) {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const ecuadorCities = [
        "Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala", 
        "Durán", "Portoviejo", "Loja", "Quevedo", "Ambato", 
        "Milagro", "Ibarra", "Esmeraldas", "Babahoyo", "Manta", 
        "Sangolquí", "Latacunga", "Tulcán", "Santa Elena", "La Libertad"
    ].sort();

    const handleContinue = () => {
        if (!name || !city) return;
        updateData({ name, city });
        onNext();
    };

    return (
        <div className="space-y-8 text-center max-w-md mx-auto w-full py-2">
            {/* Header Icon - More compact */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-20 h-20 mx-auto mb-4"
            >
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl">
                    <User className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#020208] flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                </div>
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">
                    Queremos <br /> <span className="text-indigo-500">Conocerte</span>
                </h2>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Identifica tu perfil para activar <br className="hidden md:block" /> tu ecosistema DIIC ZONE.
                </p>
            </div>

            <div className="space-y-4 text-left">
                {/* Name Input */}
                <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-5 group-focus-within:text-indigo-400 transition-colors">
                        Nombre Completo
                    </label>
                    <div className="relative">
                        <input 
                            type="text" 
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Fausto R."
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-lg focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 focus:shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-all font-bold pl-12 placeholder:text-gray-700"
                        />
                        <User className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                </div>

                {/* City Selection - Dropdown */}
                <div className="space-y-1.5 group relative">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-5 group-focus-within:text-indigo-400 transition-colors">
                        Ciudad Base 📍
                    </label>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full bg-white/5 border ${isDropdownOpen ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10'} p-4 rounded-2xl text-white text-lg cursor-pointer transition-all font-bold pl-12 relative flex items-center justify-between group`}
                    >
                        <MapPin className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${city ? 'text-indigo-500' : 'text-gray-500'}`} />
                        <span className={city ? 'text-white' : 'text-gray-700'}>
                            {city || "Seleccionar ciudad"}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 5 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-[100] w-full mt-1 bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar backdrop-blur-xl"
                            >
                                {ecuadorCities.map((item) => (
                                    <div 
                                        key={item}
                                        onClick={() => {
                                            setCity(item);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between group/item"
                                    >
                                        {item}
                                        {city === item && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]" />}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: (name && city) ? 1.02 : 1 }}
                whileTap={{ scale: (name && city) ? 0.98 : 1 }}
                onClick={handleContinue}
                disabled={!name || !city}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${
                    name && city 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_15px_30px_rgba(79,70,229,0.3)]' 
                    : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                }`}
            >
                Continuar
                <ArrowRight className={`w-5 h-5 transition-transform ${name && city ? 'translate-x-1' : ''}`} />
            </motion.button>
        </div>
    );
}
