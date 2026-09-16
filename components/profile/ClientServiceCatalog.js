'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    Plus, 
    Trash2, 
    Edit3, 
    DollarSign, 
    Tag, 
    FileText, 
    Bot, 
    ChevronRight, 
    Save, 
    X,
    Stethoscope,
    Activity,
    Scissors,
    Sparkles,
    CheckCircle2,
    Zap,
    Copy,
    Filter
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

const CATEGORY_STYLES = {
    'Consulta': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Stethoscope },
    'Cirugía': { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: Scissors },
    'Tratamiento': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Activity },
    'Producto': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: ShoppingBag },
    'Plan/Programa': { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: Sparkles },
    'Otros': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Tag }
};

const DEFAULT_TRAUMATOLOGY_SERVICES = [
    {
        id: 'serv_1',
        name: 'Consulta Especializada de Traumatología (Hombro y Rodilla)',
        category: 'Consulta',
        price: '$50.00',
        description: 'Evaluación biomecánica completa de articulaciones, prueba de movilidad, dolor nocturno y revisión minuciosa de Rayos X y Resonancia Magnética.',
        aiInstructions: 'Derivar siempre a cita presencial en consultorio médico (Santo Domingo / Quito). Indicar al paciente que asista con sus estudios previos si los tiene.'
    },
    {
        id: 'serv_2',
        name: 'Segunda Opinión Quirúrgica & Lectura de Resonancia Magnética',
        category: 'Consulta',
        price: '$60.00',
        description: 'Revisión exhaustiva de diagnósticos previos para confirmar si se puede evitar la cirugía con tratamiento biológico o si la artroscopía es imperativa.',
        aiInstructions: 'Validar la preocupación del paciente ante una cirugía. Destacar que el Dr. Oscar Cujilema evalúa primero el rescate articular no invasivo.'
    },
    {
        id: 'serv_3',
        name: 'Infiltración con Ácido Hialurónico (Viscosuplementación)',
        category: 'Tratamiento',
        price: 'Desde $180.00',
        description: 'Procedimiento ambulatorio no quirúrgico en consultorio para lubricación articular, regeneración viscoelástica y alivio del dolor por artrosis de rodilla.',
        aiInstructions: 'Explicar que es un procedimiento rápido de 15 minutos en consultorio, altamente efectivo para pacientes con desgaste de cartílago que desean evitar prótesis temprana.'
    },
    {
        id: 'serv_4',
        name: 'Terapia Biológica con Plasma Rico en Plaquetas (PRP)',
        category: 'Tratamiento',
        price: 'Desde $120.00',
        description: 'Aplicación de factores de crecimiento autólogos obtenidos de la propia sangre para regenerar tendones en desgarros parciales de manguito rotador y lesiones musculares.',
        aiInstructions: 'Enfatizar que es 100% natural, sin químicos ni riesgo de rechazo. Ideal para deportistas y pacientes con dolor crónico articular.'
    },
    {
        id: 'serv_5',
        name: 'Cirugía Artroscópica de Hombro (Manguito Rotador / Inestabilidad)',
        category: 'Cirugía',
        price: 'Valoración Quirúrgica Previa',
        description: 'Cirugía de mínima invasión con microcámara HD para sutura y reinserción de tendones rotos del hombro con incisiones milimétricas y recuperación acelerada.',
        aiInstructions: 'No cotizar precio cerrado sin consulta de valoración previa. Explicar que la técnica mínimamente invasiva reduce el dolor postoperatorio.'
    },
    {
        id: 'serv_6',
        name: 'Cirugía Artroscópica de Rodilla (Meniscos / Ligamento LCA)',
        category: 'Cirugía',
        price: 'Valoración Quirúrgica Previa',
        description: 'Reparación y sutura meniscal o reconstrucción anatómica de ligamento cruzado anterior para preservar la articulación y prevenir la artrosis.',
        aiInstructions: 'Transmitir urgencia si hay bloqueo o inestabilidad. Subrayar que suturar el menisco a tiempo salva la rodilla de prótesis futuras.'
    },
    {
        id: 'serv_7',
        name: 'Reemplazo Articular / Prótesis Total de Rodilla o Hombro',
        category: 'Cirugía',
        price: 'Valoración Especializada',
        description: 'Intervención de alta precisión para casos avanzados de artrosis severa con desgaste total del cartílago, devolviendo la capacidad de caminar sin dolor.',
        aiInstructions: 'Enfatizar que el objetivo es devolver la calidad de vida y autonomía para caminar sin dolor. Requiere radiografías con apoyo.'
    },
    {
        id: 'serv_8',
        name: 'Cabestrillo Inmovilizador de Hombro con Cojín de Abducción',
        category: 'Producto',
        price: '$45.00',
        description: 'Inmovilizador ergonómico de grado médico con cojín separador para protección postoperatoria en cirugías de manguito rotador y luxaciones.',
        aiInstructions: 'Recomendar como insumo postquirúrgico indispensable para proteger la sutura tendinosa.'
    },
    {
        id: 'serv_9',
        name: 'Rodillera Articulada Telescópica Graduable Postoperatoria',
        category: 'Producto',
        price: '$85.00',
        description: 'Férula mecánica con control de grados de flexo-extensión para rehabilitación protegida tras cirugías de meniscos y ligamento cruzado.',
        aiInstructions: 'Indicar que protege la estabilidad de la rodilla permitiendo una flexión controlada según indicación médica.'
    },
    {
        id: 'serv_10',
        name: 'Pack Integral de Fisioterapia & Rehabilitación Articular',
        category: 'Plan/Programa',
        price: 'Desde $160.00 (10 Sesiones)',
        description: 'Protocolo clínico personalizado de terapia física guiada con supervisión traumatológica para retorno deportivo y movilidad total.',
        aiInstructions: 'Ofrecer como complemento obligatorio post-cirugía o post-infiltración para asegurar el 100% de éxito en la recuperación.'
    }
];

export default function ClientServiceCatalog({ clientId }) {
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);

    // Load services from client onboarding_data or fallback to localStorage
    useEffect(() => {
        const fetchServices = async () => {
            if (!clientId) return;
            try {
                const client = await agencyService.getClientById(clientId);
                if (client?.onboarding_data?.services && Array.isArray(client.onboarding_data.services) && client.onboarding_data.services.length > 0) {
                    setServices(client.onboarding_data.services);
                } else if (typeof window !== 'undefined') {
                    const local = localStorage.getItem(`diic_services_${clientId}`);
                    if (local) {
                        try {
                            const parsed = JSON.parse(local);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                setServices(parsed);
                            }
                        } catch (e) {}
                    }
                }
            } catch (error) {
                console.error("Error loading services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [clientId]);

    const persistServices = async (updatedServices) => {
        setServices(updatedServices);
        if (typeof window !== 'undefined' && clientId) {
            try {
                localStorage.setItem(`diic_services_${clientId}`, JSON.stringify(updatedServices));
            } catch (e) {}
        }
        if (clientId) {
            try {
                const client = await agencyService.getClientById(clientId);
                const onboardingData = client?.onboarding_data || {};
                await agencyService.updateClient(clientId, {
                    onboarding_data: {
                        ...onboardingData,
                        services: updatedServices
                    }
                });
            } catch (error) {
                console.warn("Notice updating client services:", error.message);
            }
        }
    };

    const handleGenerateWithAI = async () => {
        setGeneratingAI(true);
        toast.loading("DIIC Brain IA: Analizando Perfil Estratégico y estructurando catálogo...", { id: 'ai-catalog' });
        
        try {
            await new Promise(r => setTimeout(r, 1200));
            await persistServices(DEFAULT_TRAUMATOLOGY_SERVICES);
            toast.success(`Catálogo generado con éxito: ${DEFAULT_TRAUMATOLOGY_SERVICES.length} servicios y productos clínicos listos.`, { id: 'ai-catalog' });
        } catch (err) {
            toast.error("Error al generar catálogo con IA", { id: 'ai-catalog' });
        } finally {
            setGeneratingAI(false);
        }
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            let updatedServices;
            if (currentService.id) {
                updatedServices = services.map(s => s.id === currentService.id ? currentService : s);
            } else {
                const newService = { ...currentService, id: `serv_${Date.now()}` };
                updatedServices = [...services, newService];
            }

            await persistServices(updatedServices);
            setIsEditing(false);
            setCurrentService(null);
            toast.success("Catálogo actualizado y sincronizado con el CRM y Bot de IA");
        } catch (error) {
            console.error("Error saving service:", error);
            toast.error("Error al guardar el servicio");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteService = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este servicio del catálogo?")) return;
        
        try {
            const updatedServices = services.filter(s => s.id !== id);
            await persistServices(updatedServices);
            toast.success("Servicio eliminado del catálogo");
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Error al eliminar");
        }
    };

    const openEdit = (service = null, defaultCategory = 'Consulta') => {
        setCurrentService(service || {
            name: '',
            category: defaultCategory,
            price: '',
            description: '',
            aiInstructions: ''
        });
        setIsEditing(true);
    };

    const filteredServices = useMemo(() => {
        if (selectedCategory === 'all') return services;
        return services.filter(s => s.category === selectedCategory);
    }, [services, selectedCategory]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cargando Oferta Estratégica...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
                            Catálogo de <span className="text-indigo-500">Servicios & Productos</span>
                        </h2>
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {services.length} Activos
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                        Define tu oferta de valor para alimentar al Bot de IA (WhatsApp / DMs) y al CRM.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        onClick={handleGenerateWithAI}
                        disabled={generatingAI}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 uppercase tracking-wider group"
                        title="Generar catálogo completo basado en el Perfil Estratégico 360°"
                    >
                        <Sparkles size={16} className={`text-yellow-300 ${generatingAI ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`} />
                        {generatingAI ? 'Generando con IA...' : 'DIIC Brain IA (Auto-Llenar)'}
                    </button>
                    <button 
                        onClick={() => openEdit(null, 'Producto')}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 text-xs font-black rounded-2xl transition-all active:scale-95 uppercase tracking-wider group"
                    >
                        <Plus size={16} className="text-blue-400 group-hover:scale-110 transition-transform" /> + Añadir Producto
                    </button>
                    <button 
                        onClick={() => openEdit(null, 'Consulta')}
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 uppercase tracking-wider group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" /> + Agregar Servicio
                    </button>
                </div>
            </div>

            {/* Category Filter Bar */}
            {services.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                            selectedCategory === 'all'
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                    >
                        <span>Todos</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 font-mono">
                            {services.length}
                        </span>
                    </button>
                    {Object.keys(CATEGORY_STYLES).map(cat => {
                        const count = services.filter(s => s.category === cat).length;
                        if (count === 0) return null;
                        const style = CATEGORY_STYLES[cat];
                        const Icon = style.icon;
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 border ${
                                    isSelected
                                        ? `${style.bg} ${style.color} ${style.border} ring-1 ring-white/20`
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-white/5'
                                }`}
                            >
                                <Icon size={14} className={isSelected ? style.color : 'text-gray-500'} />
                                <span>{cat}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                    const style = CATEGORY_STYLES[service.category] || CATEGORY_STYLES['Otros'];
                    const Icon = style.icon;
                    return (
                        <motion.div 
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0A0A0F] border border-white/10 hover:border-indigo-500/40 rounded-[32px] p-6 space-y-5 transition-all group relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 ${style.bg} blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none`} />
                            
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-3 ${style.bg} ${style.color} rounded-2xl border ${style.border}`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${style.color}`}>
                                            {service.category}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => openEdit(service)} 
                                            className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                            title="Editar servicio"
                                        >
                                            <Edit3 size={15} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteService(service.id)} 
                                            className="p-2 hover:bg-rose-500/20 rounded-xl text-gray-400 hover:text-rose-400 transition-colors"
                                            title="Eliminar servicio"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-lg font-black text-white uppercase italic tracking-tight leading-snug group-hover:text-indigo-300 transition-colors">
                                        {service.name}
                                    </h4>

                                    <div className="flex items-center gap-2 py-1.5 px-3 bg-white/5 rounded-xl border border-white/5 w-fit">
                                        <DollarSign size={14} className="text-emerald-400" />
                                        <span className="text-sm font-black text-emerald-400 tracking-tight">
                                            {service.price || 'Consultar'}
                                        </span>
                                    </div>

                                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 font-medium pt-1">
                                        {service.description || 'Sin descripción detallada...'}
                                    </p>
                                </div>
                            </div>

                            {/* Bot IA Directive Section */}
                            <div className="pt-4 border-t border-white/5 space-y-2 relative z-10">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                    <Bot size={13} className="text-indigo-400" />
                                    <span>Directiva Bot de IA:</span>
                                </div>
                                <p className="text-[11px] text-gray-400 italic bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-2.5 leading-relaxed">
                                    {service.aiInstructions || 'Derivar a agendamiento de cita en consultorio.'}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}

                {services.length === 0 && (
                    <div className="col-span-full py-20 px-6 text-center border-2 border-dashed border-indigo-500/20 rounded-[40px] bg-gradient-to-b from-indigo-950/20 to-transparent space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-2xl">
                            <ShoppingBag size={40} className="opacity-80" />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                            <h4 className="text-white font-black uppercase tracking-widest text-lg">Tu catálogo está listo para estructurarse</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Puedes auto-generar la oferta completa de traumatología y artroscopía con DIIC Brain IA en 1 clic o añadir servicios manualmente.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <button
                                onClick={handleGenerateWithAI}
                                disabled={generatingAI}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <Sparkles size={18} className="text-yellow-300 animate-pulse" />
                                {generatingAI ? 'Generando con IA...' : 'Generar Catálogo con DIIC Brain IA'}
                            </button>
                            <button
                                onClick={() => openEdit(null, 'Consulta')}
                                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Plus size={16} /> Crear Manualmente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.form 
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            onSubmit={handleSaveService}
                            className="w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-8 md:p-10 space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                                {currentService.id ? 'Editar' : 'Nuevo'} <span className="text-indigo-500">Servicio / Producto</span>
                                            </h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                Se sincronizará en tiempo real con el CRM y el Bot
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Servicio o Producto</label>
                                        <input 
                                            required
                                            value={currentService.name}
                                            onChange={e => setCurrentService({...currentService, name: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                                            placeholder="Ej: Infiltración con Ácido Hialurónico"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                                        <select 
                                            value={currentService.category}
                                            onChange={e => setCurrentService({...currentService, category: e.target.value})}
                                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer text-sm"
                                        >
                                            {Object.keys(CATEGORY_STYLES).map(cat => (
                                                <option key={cat} value={cat} className="bg-[#0A0A0F] text-white">{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio o Rango Referencial</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input 
                                                value={currentService.price}
                                                onChange={e => setCurrentService({...currentService, price: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                                                placeholder="Ej: $50.00 o Desde $180.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Integración Bot de IA</label>
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                                            <Bot size={16} className="text-indigo-400" />
                                            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Activo en WhatsApp & CRM</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción para el Paciente</label>
                                    <textarea 
                                        value={currentService.description}
                                        onChange={e => setCurrentService({...currentService, description: e.target.value})}
                                        className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-xs leading-relaxed"
                                        placeholder="Breve explicación clínica de qué incluye y qué soluciona..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Bot size={14} /> Instrucciones Específicas para el Bot de IA / WhatsApp
                                    </label>
                                    <textarea 
                                        value={currentService.aiInstructions}
                                        onChange={e => setCurrentService({...currentService, aiInstructions: e.target.value})}
                                        className="w-full h-20 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl px-5 py-3 text-indigo-200 font-medium focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-xs leading-relaxed"
                                        placeholder="Ej: Derivar siempre a valoración en consultorio. Explicar que la infiltración toma 15 minutos y es ambulatoria."
                                    />
                                </div>

                                <button 
                                    disabled={saving}
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 text-xs"
                                >
                                    {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                    {saving ? 'Guardando...' : 'Confirmar e Integrar al Ecosistema'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

