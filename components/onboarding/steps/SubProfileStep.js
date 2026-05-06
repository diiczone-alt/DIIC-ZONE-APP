'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export default function SubProfileStep({ onNext, updateData, profileType }) {
    // ... subNiches remain same ...
    // Definición de sub-nichos mapeados a los nuevos IDs de ProfileSelectorStep
    const subNiches = {
        personal: ['Médico', 'Coach / Mentor', 'Consultor Independiente', 'Autor / Escritor', 'Speaker / Conferencista', 'Artista', 'Político', 'Deportista de Élite', 'Influencer', 'Otro'],
        doctor: ['Medicina General', 'Especialista', 'Cirujano', 'Odontólogo', 'Pediatra', 'Psiquiatra', 'Médico Estético', 'Investigador', 'Otro'],
        creator: ['Vlogs / Lifestyle', 'Tech Reviews', 'Gaming / Streamer', 'Educativo / Tutoriales', 'Entretenimiento', 'Podcast de Entrevistas', 'Podcast de Nicho', 'Otro'],
        designer: ['Branding / Logos', 'Diseño Web / UI UX', 'Social Media Design', 'Ilustración Digital', 'Motion Graphics', 'Diseño de Impresión', 'Arquitectura / 3D', 'Otro'],
        editor: ['Reels / Shorts / TikTok', 'YouTube / Vlogs', 'Videos Musicales', 'Documentales', 'Comerciales / Ad Creative', 'Color Grading', 'Sound Design', 'Otro'],
        filmmaker: ['Bodas / Eventos Sociales', 'Corporativo / Entrevistas', 'Videos Musicales', 'Cinematografía', 'Cobertura de Eventos', 'Publicidad', 'Otro'],
        community: ['Estrategia de Contenido', 'Gestión de Comunidades', 'Pauta Digital / Ads', 'Copywriting', 'Análisis de Métricas', 'Atención al Cliente', 'Otro'],
        photo: ['Moda / Editorial', 'E-commerce / Producto', 'Eventos / Social', 'Retrato / Headshots', 'Arquitectura / Real Estate', 'Gastronomía', 'Otro'],
        model: ['Pasarela / Runway', 'Comercial / Publicidad', 'Fitting / E-commerce', 'Fitness / Sport', 'Influencer / Lifestyle', 'Hand / Part Model', 'Otro'],
        web: ['Desarrollo Frontend', 'Desarrollo Backend', 'Fullstack Developer', 'App Mobile', 'E-commerce (Shopify/Woo)', 'DevOps / Cloud', 'Otro'],
        print: ['Identidad Corporativa', 'Packaging / Empaques', 'Gran Formato / Vallas', 'Merchandising', 'Editorial / Revistas', 'Preprensa Técnica', 'Otro'],
        event: ['Producción Técnica', 'Logística de Eventos', 'Booking de Talentos', 'Dirección Artística', 'Streaming / Híbridos', 'Gestión de Patrocinios', 'Otro'],
        marketing: ['Agencia 360', 'Especialista SEO/SEM', 'Content Strategy', 'Social Media Management', 'Diseño Gráfico / Branding', 'PR / Relaciones Públicas', 'Otro'],
        ecommerce: ['Moda & Accesorios', 'Tecnología & Gadgets', 'Hogar & Decoración', 'Cosmética / Belleza', 'Suplementos / Salud', 'Productos Digitales', 'Dropshipping', 'Otro'],
        education: ['Idiomas', 'Marketing & Negocios', 'Programación / Tech', 'Finanzas Personales', 'Música / Arte', 'Academia de Oposiciones', 'Colegio / Universidad', 'Otro'],
        finance: ['Banca / Seguros', 'Inversiones / Trading', 'Contabilidad / Auditoría', 'Fintech', 'Cripto / Web3', 'Asesoría Fiscal', 'Otro'],
        health: ['Médico Especialista', 'Clínica Médica', 'Odontología', 'Psicología / Terapia', 'Nutrición / Dietética', 'Estética / Dermocosmética', 'Fisioterapia', 'Hospital / Centro de Salud', 'Otro'],
        horeca: ['Restaurante de Autor', 'Cafetería de Especialidad', 'Bar / Club Nocturno', 'Hotel / Resort', 'Catering / Eventos', 'Fast Food Premium', 'Otro'],
        tech: ['Software / SaaS', 'Ciberseguridad', 'Inteligencia Artificial', 'Hardware / IoT', 'Servicios IT / Soporte', 'Blockchain', 'Otro'],
        legal: ['Bufete de Abogados', 'Notaría', 'Asesoría Jurídica', 'Propiedad Intelectual', 'Derecho Digital', 'Otro'],
        realestate: ['Agencia Inmobiliaria', 'Promotora / Constructora', 'Inversión Inmobiliaria', 'Gestión de Alquileres', 'Arquitectura / Interiorismo', 'Otro'],
        retail: ['Tienda Física (Local)', 'Supermercado', 'Franquicia', 'Distribución / Mayorista', 'Moda Retail', 'Otro'],
        consulting: ['Estrategia de Negocio', 'Recursos Humanos', 'Operaciones / Procesos', 'Transformación Digital', 'Ventas / Comercial', 'Otro'],
        agro: ['Servicios Veterinarios', 'Insumos Agrícolas', 'Ganaderia / Bovina', 'Ecografías / Reproducción', 'Maquinaria de Campo', 'Asesoría Agropecuaria', 'Otro'],
        industrial: ['Sistemas de Riego', 'Fábrica / Manufactura', 'Logística Industrial', 'Energía / Solar', 'Mantenimiento Técnico', 'Otro'],
        other: ['Servicios Generales', 'Comercio Variado', 'Sector Industrial', 'Entorno Creativo', 'Otro']
    };

    const [selected, setSelected] = useState([]);
    const [customValue, setCustomValue] = useState('');
    const [isCustomMode, setIsCustomMode] = useState(false);
    const timeoutRef = useRef(null);

    const options = subNiches[profileType] || subNiches['other'];

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleSelect = (niche) => {
        if (niche === 'Otro') {
            setIsCustomMode(true);
            return;
        }

        setSelected(prev => {
            if (prev.includes(niche)) {
                return prev.filter(item => item !== niche);
            }
            if (prev.length >= 3) return prev; // Limit to 3
            return [...prev, niche];
        });
    };

    const handleConfirm = () => {
        if (selected.length === 0) return;
        updateData({ niches: selected }); // Usamos 'niches' en plural
        onNext();
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customValue.trim()) return;

        updateData({ niches: [...selected, customValue.trim()] });
        onNext();
    };

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto w-full text-center">
            <div className="mb-10 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                    ¿Cuál es tu <span className="text-indigo-500">Enfoque?</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium">
                    Esto nos permite configurar los módulos de estrategia <br className="hidden md:block" /> y el lenguaje de tu IA.
                </p>
            </div>

            <div className="relative flex-1 min-h-[350px]">
                <AnimatePresence mode="wait">
                    {!isCustomMode ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex flex-col h-full"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 content-start">
                                {options.map((opt, idx) => {
                                    const isSelected = selected.includes(opt);
                                    
                                    return (
                                        <motion.button
                                            key={opt}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => handleSelect(opt)}
                                            className={`p-5 rounded-2xl border transition-all text-left font-bold flex items-center justify-between group backdrop-blur-sm ${
                                                isSelected 
                                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-[0.98]' 
                                                : 'border-white/5 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08] hover:border-white/20'
                                            }`}
                                        >
                                            <span className={`${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>{opt}</span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                isSelected ? 'bg-white text-indigo-600' : 'bg-white/5 group-hover:bg-white/20'
                                            }`}>
                                                {isSelected ? <Check className="w-4 h-4" /> : <span className="opacity-0 group-hover:opacity-100">+</span>}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Confirmation Footer */}
                            <div className="mt-auto pt-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/20 p-6 rounded-[32px] border border-white/5 backdrop-blur-md">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Tu Selección ({selected.length}/3)</p>
                                    <p className="text-xs text-gray-500 font-medium italic">Selecciona hasta 3 áreas de expertiz para configurar tu nodo.</p>
                                </div>
                                <button
                                    onClick={handleConfirm}
                                    disabled={selected.length === 0}
                                    className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all ${
                                        selected.length > 0 
                                        ? 'bg-white text-black hover:scale-[1.05] shadow-xl shadow-white/10' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Confirmar Selección
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="custom"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center h-full max-w-md mx-auto space-y-8"
                        >
                            <div className="w-full space-y-4">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] block">
                                    Especifica tu área de expertiz
                                </label>
                                <form onSubmit={handleCustomSubmit} className="relative group">
                                    <input 
                                        autoFocus
                                        type="text"
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        placeholder="Tu especialidad..."
                                        className="w-full bg-white/[0.02] border-b-2 border-white/10 p-6 text-2xl font-black text-white outline-none focus:border-indigo-500 transition-all text-center rounded-t-3xl"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                                </form>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setIsCustomMode(false)}
                                    className="px-8 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Volver
                                </button>
                                <button 
                                    onClick={handleCustomSubmit}
                                    disabled={!customValue.trim()}
                                    className="px-10 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
                                >
                                    Confirmar Especialidad
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
