'use client';

import React, { useState, useEffect } from 'react';
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
    Sparkles
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

const CATEGORY_STYLES = {
    'Consulta': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Stethoscope },
    'Cirugía': { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: Scissors },
    'Tratamiento': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Activity },
    'Plan/Programa': { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: Sparkles },
    'Otros': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Tag }
};

export default function ClientServiceCatalog({ clientId }) {
    const [services, setServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            if (!clientId) return;
            try {
                const client = await agencyService.getClientById(clientId);
                if (client?.onboarding_data?.services) {
                    setServices(client.onboarding_data.services);
                }
            } catch (error) {
                console.error("Error loading services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [clientId]);

    const handleSaveService = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            let updatedServices;
            if (currentService.id) {
                updatedServices = services.map(s => s.id === currentService.id ? currentService : s);
            } else {
                const newService = { ...currentService, id: Date.now().toString() };
                updatedServices = [...services, newService];
            }

            const client = await agencyService.getClientById(clientId);
            const onboardingData = client.onboarding_data || {};
            
            await agencyService.updateClient(clientId, {
                onboarding_data: {
                    ...onboardingData,
                    services: updatedServices
                }
            });

            setServices(updatedServices);
            setIsEditing(false);
            setCurrentService(null);
            toast.success("Catálogo actualizado con éxito");
        } catch (error) {
            console.error("Error saving service:", error);
            toast.error("Error al guardar el servicio");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteService = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este servicio?")) return;
        
        try {
            const updatedServices = services.filter(s => s.id !== id);
            const client = await agencyService.getClientById(clientId);
            const onboardingData = client.onboarding_data || {};
            
            await agencyService.updateClient(clientId, {
                onboarding_data: {
                    ...onboardingData,
                    services: updatedServices
                }
            });

            setServices(updatedServices);
            toast.success("Servicio eliminado");
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Error al eliminar");
        }
    };

    const openEdit = (service = null) => {
        setCurrentService(service || {
            name: '',
            category: 'Consulta',
            price: '',
            description: '',
            aiInstructions: ''
        });
        setIsEditing(true);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cargando Oferta Estratégica...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        Catálogo de <span className="text-indigo-500">Servicios</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">
                        Define tu oferta de valor para alimentar al Bot de IA y al CRM.
                    </p>
                </div>
                <button 
                    onClick={() => openEdit()}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 uppercase tracking-widest"
                >
                    <Plus size={18} /> Agregar Servicio
                </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => {
                    const style = CATEGORY_STYLES[service.category] || CATEGORY_STYLES['Otros'];
                    const Icon = style.icon;
                    return (
                        <motion.div 
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-6 hover:border-indigo-500/30 transition-all group relative overflow-hidden shadow-xl"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${style.bg} blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2`} />
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 ${style.bg} ${style.color} rounded-2xl border ${style.border}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(service)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteService(service.id)} className="p-2 hover:bg-rose-500/10 rounded-lg text-gray-400 hover:text-rose-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${style.color}`}>{service.category}</span>
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tight truncate">{service.name}</h4>
                                </div>

                                <div className="flex items-center gap-2 py-2 px-3 bg-white/5 rounded-xl border border-white/5 w-fit">
                                    <DollarSign size={14} className="text-emerald-400" />
                                    <span className="text-sm font-black text-emerald-400 tracking-tighter">{service.price || 'Consultar'}</span>
                                </div>

                                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 italic">
                                    "{service.description || 'Sin descripción detallada...'}"
                                </p>

                                <div className="pt-4 flex items-center gap-2 border-t border-white/5">
                                    <Bot size={14} className="text-indigo-400" />
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Alimenta al Bot de IA</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {services.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                        <ShoppingBag size={48} className="text-gray-700 mx-auto mb-4 opacity-20" />
                        <h4 className="text-gray-500 font-black uppercase tracking-widest text-sm">Tu catálogo está vacío</h4>
                        <p className="text-gray-600 text-xs mt-2">Empieza a definir tus servicios para dar el salto operativo.</p>
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
                            <div className="p-8 md:p-10 space-y-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                            {currentService.id ? 'Editar' : 'Nuevo'} <span className="text-indigo-500">Servicio</span>
                                        </h3>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre del Servicio</label>
                                        <input 
                                            required
                                            value={currentService.name}
                                            onChange={e => setCurrentService({...currentService, name: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                                            placeholder="Ej: Consulta Urológica Láser"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categoría</label>
                                        <select 
                                            value={currentService.category}
                                            onChange={e => setCurrentService({...currentService, category: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                                        >
                                            {Object.keys(CATEGORY_STYLES).map(cat => (
                                                <option key={cat} value={cat} className="bg-[#0A0A0F]">{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Precio o Rango</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input 
                                                value={currentService.price}
                                                onChange={e => setCurrentService({...currentService, price: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                                                placeholder="Ej: 80 o Desde 1,500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Meta-Data IA</label>
                                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                                            <Bot size={16} className="text-indigo-400" />
                                            <span className="text-[10px] text-indigo-400/70 font-bold uppercase tracking-widest">Optimización de Respuesta Activa</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción para el Paciente/Cliente</label>
                                    <textarea 
                                        value={currentService.description}
                                        onChange={e => setCurrentService({...currentService, description: e.target.value})}
                                        className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 transition-all resize-none italic"
                                        placeholder="Breve explicación de qué incluye..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        Instrucciones Específicas para la IA <Sparkles size={12} className="text-indigo-400" />
                                    </label>
                                    <textarea 
                                        value={currentService.aiInstructions}
                                        onChange={e => setCurrentService({...currentService, aiInstructions: e.target.value})}
                                        className="w-full h-20 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl px-5 py-4 text-indigo-100 font-medium focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-sm"
                                        placeholder="Ej: Enfatizar que no incluye laboratorios. Solo se agenda con previo pago de reserva."
                                    />
                                </div>

                                <button 
                                    disabled={saving}
                                    type="submit"
                                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                                    {saving ? 'Guardando en Ecosistema...' : 'Confirmar e Integrar'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
