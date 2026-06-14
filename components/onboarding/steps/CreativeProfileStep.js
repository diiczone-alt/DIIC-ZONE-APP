'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Phone, MapPin, FileText, ArrowRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export default function CreativeProfileStep({ onNext, updateData, data }) {
    const [website, setWebsite] = useState(data?.website || '');
    const [whatsapp, setWhatsapp] = useState(data?.whatsapp || '');
    const [country, setCountry] = useState(data?.country || '');
    const [city, setCity] = useState(data?.city || '');
    const [cvSummary, setCvSummary] = useState(data?.cv_summary || '');

    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [customCityActive, setCustomCityActive] = useState(false);

    const countryOptions = [
        "Ecuador", "Colombia", "México", "España", "Estados Unidos", 
        "Perú", "Chile", "Argentina", "Venezuela", "Costa Rica", 
        "Panamá", "República Dominicana", "Guatemala", "Honduras", 
        "El Salvador", "Nicaragua", "Bolivia", "Paraguay", "Uruguay"
    ];

    const citiesByCountry = {
        "Ecuador": ["Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Ambato", "Portoviejo", "Manta", "Loja", "Machala", "Salinas", "Ibarra", "Riobamba", "Esmeraldas"],
        "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Santa Marta", "Manizales", "Cúcuta"],
        "México": ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Mérida", "Cancún", "Querétaro", "León", "Oaxaca"],
        "España": ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma de Mallorca", "Las Palmas", "Bilbao"],
        "Estados Unidos": ["New York", "Miami", "Los Angeles", "Chicago", "Houston", "Orlando", "San Francisco", "Austin", "Boston", "Seattle"],
        "Perú": ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Cusco", "Huancayo", "Tacna"],
        "Chile": ["Santiago", "Valparaíso", "Concepción", "Viña del Mar", "Antofagasta", "La Serena", "Temuco"],
        "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán", "Mar del Plata"],
        "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "San Cristóbal"],
        "Costa Rica": ["San José", "Alajuela", "Cartago", "Heredia", "Puntarenas", "Limón"],
        "Panamá": ["Ciudad de Panamá", "David", "Colón", "Santiago de Veraguas", "Chitré"],
        "República Dominicana": ["Santo Domingo", "Santiago de los Caballeros", "La Romana", "San Pedro de Macorís", "Punta Cana"],
        "Guatemala": ["Ciudad de Guatemala", "Quetzaltenango", "Escuintla", "Antigua Guatemala"],
        "Honduras": ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma"],
        "El Salvador": ["San Salvador", "Santa Ana", "San Miguel", "Santa Tecla"],
        "Nicaragua": ["Managua", "León", "Masaya", "Granada"],
        "Bolivia": ["La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre", "Oruro"],
        "Paraguay": ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque"],
        "Uruguay": ["Montevideo", "Salto", "Paysandú", "Maldonado"]
    };

    const handleContinue = (e) => {
        e.preventDefault();
        
        if (!website) {
            toast.error('Por favor, ingresa tu portafolio o sitio web.');
            return;
        }
        if (!whatsapp) {
            toast.error('Por favor, ingresa tu número de WhatsApp.');
            return;
        }
        if (!country) {
            toast.error('Por favor, selecciona tu país.');
            return;
        }
        if (!city) {
            toast.error('Por favor, ingresa tu ciudad.');
            return;
        }

        updateData({ 
            website,
            whatsapp,
            country,
            city,
            cv_summary: cvSummary,
            address: data?.address || `Ciudad: ${city}`
        });
        
        onNext();
    };

    return (
        <div className="space-y-8 text-left max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <Globe className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Detalles de tu Perfil</h2>
                    <p className="text-gray-400 text-sm">Completa tu información para conectarte al ecosistema DIIC ZONE.</p>
                </div>
            </div>

            <form onSubmit={handleContinue} className="space-y-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                
                {/* Field: Website / Portfolio */}
                <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Portafolio o Sitio Web
                    </label>
                    <input 
                        required
                        type="text"
                        placeholder="https://behance.net/tuperfil o tu web"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                    />
                </div>

                {/* Field: WhatsApp */}
                <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3 h-3" /> WhatsApp
                    </label>
                    <input 
                        required
                        type="tel"
                        placeholder="Ej: +593 99 999 9999"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                    />
                </div>

                {/* Fields: Country & City (2-column layout) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Country Field (Custom Dropdown) */}
                    <div className="space-y-1 text-left relative z-[103]">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> País
                        </label>
                        <div 
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className={`w-full bg-black/20 border ${isCountryOpen ? 'border-indigo-500' : 'border-white/5'} rounded-2xl p-4 text-xs text-white transition-all font-bold flex items-center justify-between cursor-pointer`}
                        >
                            <span className={country ? 'text-white' : 'text-gray-700'}>
                                {country || "Seleccionar País"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {isCountryOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 5 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 w-full bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-40 overflow-y-auto z-[104] backdrop-blur-3xl scrollbar-hide"
                                >
                                    {countryOptions.map((item) => (
                                        <div 
                                            key={item}
                                            onClick={() => {
                                                setCountry(item);
                                                setCity('');
                                                setCustomCityActive(false);
                                                setIsCountryOpen(false);
                                            }}
                                            className="px-6 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between"
                                        >
                                            {item}
                                            {country === item && <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]" />}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* City Field */}
                    {customCityActive ? (
                        <div className="space-y-1 text-left relative z-[103]">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-between">
                                <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Ciudad</span>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setCustomCityActive(false);
                                        setCity('');
                                    }}
                                    className="text-[8px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider transition-colors"
                                >
                                    Ver Lista
                                </button>
                            </label>
                            <input 
                                required
                                placeholder="Escribe tu Ciudad"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="w-full bg-black/20 border border-indigo-500/50 rounded-2xl p-4 text-xs text-white focus:outline-none transition-all font-bold placeholder:text-gray-700"
                            />
                        </div>
                    ) : (
                        <div className="space-y-1 text-left relative z-[103]">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Ciudad
                            </label>
                            <div 
                                onClick={() => {
                                    if (!country) {
                                        toast.error('Por favor, selecciona primero un país.');
                                        return;
                                    }
                                    setIsCityOpen(!isCityOpen);
                                }}
                                className={`w-full bg-black/20 border ${isCityOpen ? 'border-indigo-500' : 'border-white/5'} rounded-2xl p-4 text-xs text-white transition-all font-bold flex items-center justify-between cursor-pointer ${!country ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className={city ? 'text-white' : 'text-gray-700'}>
                                    {city || (country ? "Seleccionar Ciudad" : "Selecciona País")}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isCityOpen && country && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 5 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-0 w-full bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-40 overflow-y-auto z-[104] backdrop-blur-3xl scrollbar-hide"
                                    >
                                        {[...(citiesByCountry[country] || []), "Otra ciudad..."].map((item) => (
                                            <div 
                                                key={item}
                                                onClick={() => {
                                                    if (item === "Otra ciudad...") {
                                                        setCustomCityActive(true);
                                                        setCity('');
                                                    } else {
                                                        setCity(item);
                                                    }
                                                    setIsCityOpen(false);
                                                }}
                                                className="px-6 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between"
                                            >
                                                {item}
                                                {city === item && <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]" />}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Field: Bio / Description */}
                <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Resumen de tu Trayectoria / Bio
                    </label>
                    <textarea 
                        value={cvSummary}
                        onChange={e => setCvSummary(e.target.value)}
                        placeholder="Ej: Editor especializado en Motion Graphics con experiencia en anuncios digitales y Reels. Apasionado por el storytelling..."
                        className="w-full h-28 bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700 resize-none custom-scrollbar"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 mt-4"
                >
                    Continuar registro <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
