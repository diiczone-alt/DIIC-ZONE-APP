import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Wifi, Cpu, Globe, ArrowRight, Mail, Lock, User, Briefcase, MapPin, ChevronDown, Cake, Eye, EyeOff, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { driveService } from '@/services/driveService';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AuthStep({ onNext, updateData, type = 'client' }) {
    const { register, login, signInWithGoogle } = useAuth();
    const isCreative = type === 'creative';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        brand: '',
        country: '',
        city: '',
        address: '',
        birth_date: '',
        confirmPassword: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);
    const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [customCityActive, setCustomCityActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [bypassActive, setBypassActive] = useState(false);
    const [isDev, setIsDev] = useState(false);

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

    const specialtyOptions = [
        "Community Manager",
        "Diseñador",
        "Filmmaker",
        "Editor de Video",
        "Filmmaker / Editor",
        "Estratega",
        "Ingeniería de Audio",
        "Desarrollo Web"
    ];

    const mapSpecialtyToRole = (specialty) => {
        if (!specialty) return 'CREATOR';
        const lower = specialty.toLowerCase();
        if (lower.includes('community manager') || lower.includes('estratega')) {
            return 'COMMUNITY';
        }
        if (lower.includes('diseñad')) {
            return 'DESIGNER';
        }
        if (lower.includes('filmmaker')) {
            return 'FILMMAKER';
        }
        if (lower.includes('editor')) {
            return 'EDITOR';
        }
        if (lower.includes('audio')) {
            return 'AUDIO';
        }
        if (lower.includes('programador') || lower.includes('desarrollo web') || lower.includes('web')) {
            return 'WEB';
        }
        return 'CREATOR';
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            setIsDev(true);
        }
    }, []);



    const handleGoogleConnect = async () => {
        if (!formData.brand || !formData.country || !formData.city || !formData.address || !formData.birth_date || !formData.website) {
            toast.error('Por favor, ingresa tu Marca/Especialidad, País, Ciudad, Dirección Exacta, Fecha de Nacimiento y Sitio Web antes de continuar con Google.');
            return;
        }

        setLoading(true);
        try {
            toast.info('Iniciando conexión segura con Google...');
            
            // Sincronizamos con el Wizard antes de salir a Google
            updateData({ 
                name: formData.full_name || 'Usuario Google',
                brand: formData.brand,
                city: formData.city,
                country: formData.country,
                address: formData.address,
                birth_date: formData.birth_date,
                website: formData.website,
                auth: { method: 'google', timestamp: new Date().toISOString() } 
            });

            const finalRole = type === 'creative' 
                ? mapSpecialtyToRole(formData.brand) 
                : 'CLIENT';

            await signInWithGoogle({
                full_name: formData.full_name || '',
                brand: formData.brand,
                city: formData.city,
                country: formData.country,
                address: formData.address,
                role: finalRole,
                birth_date: formData.birth_date,
                website: formData.website
            });
        } catch (err) {
            toast.error('Error al conectar con Google: ' + err.message);
            setLoading(false);
        }
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        if (!formData.country) {
            toast.error('Por favor, selecciona tu país.');
            return;
        }
        if (!formData.city) {
            toast.error('Por favor, ingresa tu ciudad.');
            return;
        }
        if (!formData.address) {
            toast.error('Por favor, ingresa tu dirección exacta.');
            return;
        }
        if (!formData.birth_date) {
            toast.error('Por favor, ingresa tu fecha de nacimiento.');
            return;
        }
        if (!formData.website) {
            toast.error('Por favor, ingresa tu sitio web.');
            return;
        }
        setLoading(true);
        try {
            // Determinar role final: si es creative y eligió 'community', usar 'COMMUNITY'
            const finalRole = type === 'creative' 
                ? mapSpecialtyToRole(formData.brand) 
                : 'CLIENT';

            const result = await register(formData.email, formData.password, { 
                full_name: formData.full_name,
                brand: formData.brand,
                city: formData.city,
                country: formData.country,
                address: formData.address,
                role: finalRole,
                type: type,
                birth_date: formData.birth_date,
                website: formData.website
            });

            updateData({ 
                name: formData.full_name,
                brand: formData.brand,
                city: formData.city,
                country: formData.country,
                address: formData.address,
                birth_date: formData.birth_date,
                website: formData.website,
                auth: { method: 'email', timestamp: new Date().toISOString() } 
            });

            if (result.needsConfirmation) {
                setVerificationSent(true);
                toast.success('¡Casi listo! Enlace de confirmación enviado.', { duration: 3000 });
            } else {
                toast.success('Protocolo de acceso generado.', { duration: 2000 });
                onNext();
            }
        } catch (err) {
            toast.error('Error: ' + err.message, { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: formData.email,
                options: {
                    emailRedirectTo: typeof window !== 'undefined' 
                        ? `${window.location.origin}/onboarding?type=${type}`
                        : undefined
                }
            });
            if (error) {
                toast.error('Error al reenviar: ' + error.message, { duration: 3000 });
            } else {
                toast.success('Enlace de confirmación reenviado a tu correo.', { duration: 3000 });
            }
        } catch (err) {
            toast.error('Error al reenviar: ' + err.message, { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAndContinue = async () => {
        setLoading(true);
        try {
            const { error: loginError } = await login(formData.email, formData.password);
            if (loginError) {
                const errMsg = loginError.message.toLowerCase();
                if (errMsg.includes('confirm') || errMsg.includes('verify') || errMsg.includes('email_not_confirmed')) {
                    toast.error('Por favor, confirma tu correo electrónico primero. Reenviando enlace...');
                    try {
                        await supabase.auth.resend({
                            type: 'signup',
                            email: formData.email,
                            options: {
                                emailRedirectTo: typeof window !== 'undefined' 
                                    ? `${window.location.origin}/onboarding?type=${type}`
                                    : undefined
                            }
                        });
                        toast.success('Enlace de confirmación reenviado a tu correo. Revisa tu bandeja de entrada.', { duration: 3500 });
                    } catch (resendErr) {
                        console.error('[AuthStep] Failed to auto-resend verification email:', resendErr);
                    }
                } else {
                    toast.error('Error de verificación: ' + loginError.message, { duration: 3000 });
                }
                return;
            }
            toast.success('¡Cuenta confirmada y activa!', { duration: 2000 });
            onNext();
        } catch (err) {
            toast.error('Error al comprobar confirmación: ' + err.message, { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[550px] text-center space-y-6 max-w-lg mx-auto relative group py-2">
            
            <div className="absolute top-0 left-0 w-full flex justify-between px-4 opacity-20 pointer-events-none">
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    IDENTITY_PROTOCOL_ACTIVE
                </div>
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.2em]">
                    PORTAL: UNI_EXT_V2
                </div>
            </div>

            <div className="space-y-4">
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-5xl font-black text-white tracking-tight italic uppercase leading-none"
                >
                    {verificationSent ? 'REVISA TU' : 'QUEREMOS'} <span className="text-indigo-500">{verificationSent ? 'CORREO' : 'CONOCERTE'}</span>
                </motion.h1>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
                    {verificationSent ? 'PROTOCOLO DE SEGURIDAD ENVIADO' : 'Estableciendo credenciales de seguridad'}
                </p>
            </div>

            {verificationSent ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-8 bg-white/5 p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl relative overflow-hidden"
                >
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-indigo-400 animate-bounce" />
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-white font-black text-xl uppercase italic">¡Acceso Registrado!</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Hemos enviado un enlace de confirmación a <span className="text-white font-bold">{formData.email}</span>. 
                            Por favor, confirma tu cuenta para activar todas las integraciones de la plataforma.
                        </p>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            onClick={handleConfirmAndContinue}
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verificando...' : 'Confirmar y Continuar'} <ArrowRight className="w-4 h-4" />
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            disabled={loading}
                            className="w-full py-4 border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.04] text-gray-500 hover:text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Reenviando...' : '¿No recibiste el correo? Reenviar'}
                        </button>
                    </div>

                    <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
                        Nota: Revisa tu carpeta de Spam si no recibes el correo en 2 minutos.
                    </p>
                </motion.div>
            ) : (
                <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleEmailRegister}
                className="w-full space-y-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl relative overflow-hidden"
            >
                {/* Field Group: Identity */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                            <User className="w-2.5 h-2.5" /> Identity
                        </label>
                        <input 
                            required
                            autoComplete="off"
                            name={`diic_identity_${Math.random()}`}
                            placeholder="Tu Nombre"
                            value={formData.full_name}
                            onChange={e => setFormData({...formData, full_name: e.target.value})}
                            className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                        />
                    </div>
                    <div className="space-y-1 text-left relative z-[105]">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5" /> {isCreative ? 'Specialty' : 'Brand'}
                        </label>
                        {isCreative ? (
                            <>
                                <div 
                                    onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
                                    className={`w-full bg-black/20 border ${isSpecialtyOpen ? 'border-indigo-500' : 'border-white/5'} rounded-2xl p-4 text-xs text-white transition-all font-bold flex items-center justify-between cursor-pointer`}
                                >
                                    <span className={formData.brand ? 'text-white' : 'text-gray-700'}>
                                        {formData.brand || "Seleccionar Especialidad"}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isSpecialtyOpen ? 'rotate-180' : ''}`} />
                                </div>

                                <AnimatePresence>
                                    {isSpecialtyOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 5 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute left-0 w-full bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-40 overflow-y-auto z-[106] backdrop-blur-3xl scrollbar-hide"
                                        >
                                            {specialtyOptions.map((item) => (
                                                <div 
                                                    key={item}
                                                    onClick={() => {
                                                        setFormData({...formData, brand: item});
                                                        setIsSpecialtyOpen(false);
                                                    }}
                                                    className="px-6 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between"
                                                >
                                                    {item}
                                                    {formData.brand === item && <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]" />}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <input 
                                required
                                autoComplete="off"
                                name={`diic_brand_${Math.random()}`}
                                placeholder="Tu Marca"
                                value={formData.brand}
                                onChange={e => setFormData({...formData, brand: e.target.value})}
                                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                            />
                        )}
                    </div>
                </div>

                {/* Fields: Country & City (2-column layout) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Country Field (Custom Dropdown) */}
                    <div className="space-y-1 text-left relative z-[103]">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5" /> País
                        </label>
                        <div 
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className={`w-full bg-black/20 border ${isCountryOpen ? 'border-indigo-500' : 'border-white/5'} rounded-2xl p-4 text-xs text-white transition-all font-bold flex items-center justify-between cursor-pointer`}
                        >
                            <span className={formData.country ? 'text-white' : 'text-gray-700'}>
                                {formData.country || "Seleccionar País"}
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
                                                setFormData({...formData, country: item, city: ''});
                                                setCustomCityActive(false);
                                                setIsCountryOpen(false);
                                            }}
                                            className="px-6 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between"
                                        >
                                            {item}
                                            {formData.country === item && <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]" />}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* City Field (Custom Dropdown with Custom Input Fallback) */}
                    {customCityActive ? (
                        <div className="space-y-1 text-left relative z-[103]">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center justify-between">
                                <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> Ciudad</span>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setCustomCityActive(false);
                                        setFormData({...formData, city: ''});
                                    }}
                                    className="text-[8px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider transition-colors"
                                >
                                    Ver Lista
                                </button>
                            </label>
                            <input 
                                required
                                autoComplete="off"
                                name={`diic_city_${Math.random()}`}
                                placeholder="Escribe tu Ciudad"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                className="w-full bg-black/20 border border-indigo-500/50 rounded-2xl p-4 text-xs text-white focus:outline-none transition-all font-bold placeholder:text-gray-700"
                            />
                        </div>
                    ) : (
                        <div className="space-y-1 text-left relative z-[103]">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" /> Ciudad
                            </label>
                            <div 
                                onClick={() => {
                                    if (!formData.country) {
                                        toast.error('Por favor, selecciona primero un país.');
                                        return;
                                    }
                                    setIsCityOpen(!isCityOpen);
                                }}
                                className={`w-full bg-black/20 border ${isCityOpen ? 'border-indigo-500' : 'border-white/5'} rounded-2xl p-4 text-xs text-white transition-all font-bold flex items-center justify-between cursor-pointer ${!formData.country ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className={formData.city ? 'text-white' : 'text-gray-700'}>
                                    {formData.city || (formData.country ? "Seleccionar Ciudad" : "Selecciona un País")}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isCityOpen && formData.country && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 5 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-0 w-full bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-40 overflow-y-auto z-[104] backdrop-blur-3xl scrollbar-hide"
                                    >
                                        {[...(citiesByCountry[formData.country] || []), "Otra ciudad..."].map((item) => (
                                            <div 
                                                key={item}
                                                onClick={() => {
                                                    if (item === "Otra ciudad...") {
                                                        setCustomCityActive(true);
                                                        setFormData({...formData, city: ''});
                                                    } else {
                                                        setFormData({...formData, city: item});
                                                    }
                                                    setIsCityOpen(false);
                                                }}
                                                className="px-6 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between"
                                            >
                                                {item}
                                                {formData.city === item && <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]" />}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Field: Exact Address */}
                <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-indigo-400" /> Dirección Exacta
                    </label>
                    <input 
                        required
                        autoComplete="off"
                        name={`diic_address_${Math.random()}`}
                        placeholder="Calle Principal, Secundaria, Nro de Casa/Apto"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                    />
                </div>

                {/* Field: Birth Date */}
                <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 animate-pulse text-green-400" /> Fecha de Nacimiento
                    </label>
                    <input 
                        required
                        type="date"
                        value={formData.birth_date}
                        onChange={e => setFormData({...formData, birth_date: e.target.value})}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700 neon-date-input"
                    />
                </div>

                {/* Field: Website */}
                <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5 text-indigo-400" /> {isCreative ? 'Portafolio o Sitio Web' : 'Sitio Web'}
                    </label>
                    <input 
                        required
                        autoComplete="off"
                        type="text"
                        placeholder="https://diiczone.com"
                        value={formData.website}
                        onChange={e => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                    />
                </div>

                <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" /> Email
                    </label>
                    <input 
                        required
                        autoComplete="new-password"
                        name={`diic_email_${Math.random()}`}
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Password
                        </label>
                        <div className="relative">
                            <input 
                                required
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                name={`diic_pass_${Math.random()}`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pr-12 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> Confirm
                        </label>
                        <div className="relative">
                            <input 
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                className={`w-full bg-black/20 border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : 'border-white/5'} rounded-2xl p-4 pr-12 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.email || !formData.password || !formData.confirmPassword || !formData.full_name || !formData.country || !formData.city || !formData.address || !formData.birth_date || !formData.website || formData.password !== formData.confirmPassword}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? 'Sincronizando...' : 'Establecer Acceso Vitalicio'} <ArrowRight className="w-4 h-4" />
                </button>

            </motion.form>
            )}

            <div 
                onClick={() => isDev && setBypassActive(!bypassActive)}
                className={`font-mono text-[7px] ${bypassActive ? 'text-emerald-500' : 'text-gray-700'} uppercase tracking-[0.3em] font-black cursor-pointer hover:opacity-100 transition-opacity`}
            >
                PROTOCOL_BYPASS_ENABLED: {bypassActive ? 'TRUE' : 'FALSE'} | CHANNEL: SECURE_CORE
            </div>
        </div>
    );
}

