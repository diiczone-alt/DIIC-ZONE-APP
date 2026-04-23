'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Briefcase, MapPin, Camera, Video, Palette, 
    Share2, ArrowRight, CheckCircle2, Star, 
    Smartphone, Globe, Zap, ShieldCheck,
    Mic, Printer, Calendar, Clapperboard, FileText
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegistrationHub({ initialType = 'client' }) {
    const router = useRouter();
    const { register } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const [step, setStep] = useState(1);
    const [type, setType] = useState(initialType); // 'client' or 'creative'

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        city: 'Santo Domingo',
        email: '',
        whatsapp: '',
        brand: '',
        businessType: '',
        objective: 'Vender',
        roles: [],
        level: 'Junior',
        portfolio: '',
        priceRange: '',
        availability: 'Freelance',
        cv: ''
    });

    const roles = [
        { id: 'editor', label: 'Editor de Video', icon: Video, color: 'text-blue-400' },
        { id: 'filmmaker', label: 'Filmmaker', icon: Clapperboard, color: 'text-red-400' },
        { id: 'designer', label: 'Diseñador Gráfico', icon: Palette, color: 'text-purple-400' },
        { id: 'audio', label: 'Audio / Locución', icon: Mic, color: 'text-yellow-400' },
        { id: 'community', label: 'Community Manager', icon: Smartphone, color: 'text-emerald-400' },
        { id: 'photo', label: 'Fotografía', icon: Camera, color: 'text-orange-400' },
        { id: 'model', label: 'Modelo / Talento', icon: User, color: 'text-pink-400' },
        { id: 'developer', label: 'Desarrollo Web', icon: Globe, color: 'text-cyan-400' },
        { id: 'print', label: 'Imprenta / Merch', icon: Printer, color: 'text-indigo-400' },
        { id: 'events', label: 'Eventos / Prod', icon: Calendar, color: 'text-emerald-500' },
    ];

    const toggleRole = (role) => {
        const newRoles = formData.roles.includes(role) 
            ? formData.roles.filter(r => r !== role)
            : [...formData.roles, role];
        setFormData({ ...formData, roles: newRoles });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        const id = toast.loading('Sincronizando identidad con el CORE...');
        
        try {
            await register(formData.email, formData.whatsapp, { // Using whatsapp as temporary password or handled by AuthContext
                full_name: formData.name,
                city: formData.city,
                brand: formData.brand,
                role: type === 'client' ? 'CLIENT' : 'CREATIVE',
                metadata: {
                    roles: formData.roles,
                    businessType: formData.businessType,
                    objective: formData.objective,
                    portfolio: formData.portfolio,
                    cv: formData.cv
                }
            });

            toast.success('¡Bienvenido al ecosistema DIIC ZONE!', { id });
            
            setTimeout(() => {
                router.push(type === 'client' ? '/hub' : '/onboarding/success');
            }, 2000);
        } catch (err) {
            console.error('[RegistrationHub] Error:', err);
            toast.error('Error al registrar: ' + err.message, { id });
        }
    };

    if (!isMounted) return <div className="min-h-screen bg-[#050510] flex items-center justify-center font-black text-indigo-500 animate-pulse uppercase tracking-widest">DIIC ZONE Syncing...</div>;

    return (
        <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('/noise.svg')]" />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none transition-colors duration-1000 ${type === 'client' ? 'bg-emerald-500' : 'bg-blue-500'}`} />

            <div className="w-full max-w-2xl relative z-10">
                {/* Stepper Header */}
                <div className="flex justify-between items-center mb-12 px-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= i ? (type === 'client' ? 'bg-emerald-500 text-black' : 'bg-blue-500 text-white') : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
                            </div>
                            {i < 3 && <div className={`w-20 md:w-32 h-0.5 rounded-full ${step > i ? (type === 'client' ? 'bg-emerald-500/50' : 'bg-blue-500/50') : 'bg-white/5'}`} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl font-black italic tracking-tighter mb-4">IDENTIDAD DIIC ZONE</h1>
                                <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Paso 1: Define tu perfil en el ecosistema</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {initialType !== 'creative' && (
                                    <button 
                                        onClick={() => setType('client')}
                                        className={`p-8 rounded-[32px] border transition-all text-left flex flex-col gap-4 ${type === 'client' ? 'bg-emerald-500/10 border-emerald-500 shadow-2xl shadow-emerald-500/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'client' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400'}`}>
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl italic uppercase tracking-tighter">CLIENTE / MARCA</h3>
                                            <p className="text-xs text-gray-500 mt-1">Quiero escalar mi negocio con estrategias de alto impacto.</p>
                                        </div>
                                    </button>
                                )}
                                
                                <button 
                                    onClick={() => setType('creative')}
                                    className={`p-8 rounded-[32px] border transition-all text-left flex flex-col gap-4 ${type === 'creative' ? 'bg-blue-500/10 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'creative' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl italic uppercase tracking-tighter">ZONA CREATIVA</h3>
                                        <p className="text-xs text-gray-500 mt-1">Soy talento y quiero formar parte de la red de producción.</p>
                                    </div>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Ej: Fausto R."
                                        className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Ciudad Base 📍</label>
                                    <select 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 transition-all font-bold appearance-none"
                                    >
                                        <option value="Quito" className="bg-[#050510]">Quito</option>
                                        <option value="Santo Domingo" className="bg-[#050510]">Santo Domingo</option>
                                        <option value="Guayaquil" className="bg-[#050510]">Guayaquil</option>
                                        <option value="Manta" className="bg-[#050510]">Manta</option>
                                        <option value="Cuenca" className="bg-[#050510]">Cuenca</option>
                                    </select>
                                </div>
                            </div>

                            <button onClick={nextStep} className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${type === 'client' ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-blue-500 text-white hover:bg-blue-400'}`}>
                                Continuar <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl font-black italic tracking-tighter mb-4">PERFIL ESTRATÉGICO</h1>
                                <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Paso 2: Detalles de {type === 'client' ? 'tu Marca' : 'tu Talento'}</p>
                            </div>

                            {type === 'client' ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Nombre de Marca / Empresa</label>
                                        <input 
                                            type="text" 
                                            value={formData.brand}
                                            onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                            placeholder="Ej: Nova Clínica"
                                            className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Sector de Negocio</label>
                                            <select 
                                                value={formData.businessType}
                                                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none appearance-none font-bold"
                                            >
                                                <option value="" className="bg-[#050510]">Seleccionar Sector</option>
                                                <option value="Salud" className="bg-[#050510]">Salud / Medicina</option>
                                                <option value="Comercio" className="bg-[#050510]">Retail / Comercio</option>
                                                <option value="Educacion" className="bg-[#050510]">Educación</option>
                                                <option value="Inmobiliaria" className="bg-[#050510]">Inmobiliaria</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Objetivo Principal</label>
                                            <select 
                                                value={formData.objective}
                                                onChange={(e) => setFormData({...formData, objective: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none appearance-none font-bold"
                                            >
                                                <option value="Vender" className="bg-[#050510]">Ventas Directas</option>
                                                <option value="Marca" className="bg-[#050510]">Reconocimiento de Marca</option>
                                                <option value="Automatizar" className="bg-[#050510]">Automatizar Contenido</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {roles.map((r) => {
                                            const isActive = formData.roles.includes(r.id);
                                            return (
                                                <button 
                                                    key={r.id}
                                                    onClick={() => toggleRole(r.id)}
                                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${isActive ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                                                >
                                                    <r.icon className={`w-5 h-5 ${isActive ? r.color : ''}`} />
                                                    <span className="text-[10px] font-black uppercase text-center">{r.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Nivel de Experiencia</label>
                                            <select 
                                                value={formData.level}
                                                onChange={(e) => setFormData({...formData, level: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none appearance-none font-bold"
                                            >
                                                <option value="Junior" className="bg-[#050510]">Básico / Junior</option>
                                                <option value="Semi Pro" className="bg-[#050510]">Intermedio / Semi Pro</option>
                                                <option value="Pro" className="bg-[#050510]">Experto / Master</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Disponibilidad</label>
                                            <select 
                                                value={formData.availability}
                                                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none appearance-none font-bold"
                                            >
                                                <option value="Freelance" className="bg-[#050510]">Por Proyectos (Freelance)</option>
                                                <option value="Part-time" className="bg-[#050510]">Medio Tiempo</option>
                                                <option value="Full-time" className="bg-[#050510]">Tiempo Completo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-5 rounded-3xl bg-white/5 text-gray-400 font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Regresar</button>
                                <button onClick={nextStep} className={`flex-[2] py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl transition-all ${type === 'client' ? 'bg-emerald-500 text-black' : 'bg-blue-500 text-white'}`}>Continuar</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl font-black italic tracking-tighter mb-4">FINALIZAR CONEXIÓN</h1>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto">Estas a un paso de entrar al Operative Brain de DIIC ZONE.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">WhatsApp de Contacto</label>
                                    <input 
                                        type="tel" 
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                        placeholder="+593 ..."
                                        className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none transition-all font-bold"
                                    />
                                </div>
                                {type === 'creative' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Link a Portafolio (Behance / IG / Web)</label>
                                            <input 
                                                type="url" 
                                                value={formData.portfolio}
                                                onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                                                placeholder="https://..."
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 font-bold">Curriculum Vitae (Link a Drive / PDF)</label>
                                            <div className="relative group">
                                                <input 
                                                    type="url" 
                                                    value={formData.cv}
                                                    onChange={(e) => setFormData({...formData, cv: e.target.value})}
                                                    placeholder="https://drive.google.com/..."
                                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-all font-bold pl-12"
                                                />
                                                <FileText className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${type === 'client' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white mb-1">Verificación Inteligente</h4>
                                        <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest">Al registrarte, DIIC ZONE clasificará tu perfil para optimizar la logística y asignación de recursos geográficos.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-5 rounded-3xl bg-white/5 text-gray-400 font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Regresar</button>
                                <button onClick={handleSubmit} className={`flex-[2] py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all ${type === 'client' ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-blue-500 text-white shadow-blue-500/20'}`}>Completar Registro</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
