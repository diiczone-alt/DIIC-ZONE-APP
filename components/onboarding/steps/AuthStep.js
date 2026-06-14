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
    const [authMode, setAuthMode] = useState('welcome'); // 'welcome' | 'email_register' | 'email_login'
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

    const GoogleIcon = () => (
        <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
    );

    useEffect(() => {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            setIsDev(true);
        }
    }, []);

    const handleGoogleConnect = async () => {
        setLoading(true);
        try {
            toast.info('Iniciando conexión segura con Google...');
            
            const newWizardData = { 
                name: formData.full_name || 'Usuario Google',
                brand: formData.brand || '',
                city: formData.city || '',
                country: formData.country || '',
                address: formData.address || '',
                birth_date: formData.birth_date || '',
                website: formData.website || '',
                auth: { method: 'google', timestamp: new Date().toISOString() } 
            };

            // Sincronizamos con el Wizard antes de salir a Google
            updateData(newWizardData);

            // Persistencia síncrona inmediata en localStorage para prevenir pérdida de datos por redirección
            try {
                const savedState = localStorage.getItem('diic_onboarding_progress');
                let parsed = savedState ? JSON.parse(savedState) : { currentStep: 1, formData: {} };
                parsed.formData = { ...parsed.formData, ...newWizardData };
                localStorage.setItem('diic_onboarding_progress', JSON.stringify(parsed));
            } catch (localErr) {
                console.warn('[AuthStep] Error guardando progreso síncrono:', localErr);
            }

            const finalRole = isCreative 
                ? 'CREATOR' 
                : 'CLIENT';

            await signInWithGoogle({
                full_name: formData.full_name || '',
                brand: formData.brand || '',
                city: formData.city || '',
                country: formData.country || '',
                address: formData.address || '',
                role: finalRole,
                birth_date: formData.birth_date || '',
                website: formData.website || ''
            });
        } catch (err) {
            toast.error('Error al conectar con Google: ' + err.message);
            setLoading(false);
        }
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            const finalRole = isCreative 
                ? 'CREATOR' 
                : 'CLIENT';

            const result = await register(formData.email, formData.password, { 
                full_name: formData.full_name,
                brand: formData.brand || '',
                city: formData.city || '',
                country: formData.country || '',
                address: formData.address || '',
                role: finalRole,
                type: type,
                birth_date: formData.birth_date || null,
                website: formData.website || ''
            });

            updateData({ 
                name: formData.full_name,
                brand: formData.brand || '',
                city: formData.city || '',
                country: formData.country || '',
                address: formData.address || '',
                birth_date: formData.birth_date || '',
                website: formData.website || '',
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

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(formData.email, formData.password);
            if (result.error) {
                toast.error('Error al iniciar sesión: ' + result.error.message);
                return;
            }
            toast.success('Sesión iniciada correctamente.');
            onNext();
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

    // Shared verification sent UI
    if (verificationSent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[550px] text-center space-y-6 max-w-lg mx-auto relative group py-2">
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
            </div>
        );
    }

    if (!isCreative) {
        // CLIENT REDESIGNED ONBOARDING STEP 1
        return (
            <div className="flex flex-col items-center justify-center min-h-[550px] w-full text-center space-y-8 max-w-lg mx-auto relative group py-2">
                <div className="absolute top-0 left-0 w-full flex justify-between px-4 opacity-20 pointer-events-none">
                    <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.2em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        DIIC_ZONE_SYSTEM_V2
                    </div>
                </div>

                {authMode === 'welcome' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 w-full"
                    >
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] leading-none">
                                Bienvenido a DIIC ZONE
                            </h2>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight italic uppercase leading-none">
                                Tu sistema operativo <br/>
                                <span className="text-indigo-500">para escalar tu marca</span>
                            </h1>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md mx-auto pt-2">
                                Conecta tu negocio, organiza tu equipo, automatiza procesos y construye una estrategia de crecimiento adaptada a tu nicho.
                            </p>
                        </div>

                        <div className="space-y-4 pt-6 w-full px-4">
                            <button
                                onClick={handleGoogleConnect}
                                disabled={loading}
                                className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50"
                            >
                                <GoogleIcon />
                                {loading ? 'Cargando...' : 'Continuar con Google'}
                            </button>

                            <button
                                onClick={() => setAuthMode('email_register')}
                                className="w-full py-5 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center"
                            >
                                <Mail className="w-5 h-5 mr-2 shrink-0 text-indigo-400" />
                                Crear cuenta con correo
                            </button>
                        </div>

                        <div className="pt-4">
                            <p className="text-xs text-gray-500">
                                ¿Ya tienes una cuenta?{' '}
                                <button
                                    onClick={() => setAuthMode('email_login')}
                                    className="text-indigo-400 hover:text-indigo-300 font-bold underline"
                                >
                                    Inicia Sesión
                                </button>
                            </p>
                        </div>
                    </motion.div>
                )}

                {authMode === 'email_register' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white uppercase italic">Crear Cuenta</h2>
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-mono">Registra tus accesos de seguridad</p>
                        </div>

                        <form onSubmit={handleEmailRegister} className="space-y-4 text-left">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                    <User className="w-2.5 h-2.5" /> Nombre Completo
                                </label>
                                <input 
                                    required
                                    placeholder="Tu Nombre"
                                    value={formData.full_name}
                                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                    <Mail className="w-2.5 h-2.5" /> Correo Electrónico
                                </label>
                                <input 
                                    required
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                        <Lock className="w-2.5 h-2.5" /> Contraseña
                                    </label>
                                    <div className="relative">
                                        <input 
                                            required
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5" /> Confirmar
                                    </label>
                                    <div className="relative">
                                        <input 
                                            required
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                            className={`w-full bg-black/20 border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : 'border-white/5'} rounded-2xl p-4 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !formData.email || !formData.password || !formData.confirmPassword || !formData.full_name || formData.password !== formData.confirmPassword}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Creando...' : 'Crear Cuenta'} <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="pt-2">
                            <button
                                onClick={() => setAuthMode('welcome')}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                ← Volver
                            </button>
                        </div>
                    </motion.div>
                )}

                {authMode === 'email_login' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white uppercase italic">Iniciar Sesión</h2>
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-mono">Ingresa a tu cuenta de DIIC ZONE</p>
                        </div>

                        <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                    <Mail className="w-2.5 h-2.5" /> Correo Electrónico
                                </label>
                                <input 
                                    required
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                    <Lock className="w-2.5 h-2.5" /> Contraseña
                                </label>
                                <div className="relative">
                                    <input 
                                        required
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !formData.email || !formData.password}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Accediendo...' : 'Iniciar Sesión'} <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="pt-2">
                            <button
                                onClick={() => setAuthMode('welcome')}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                ← Volver
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    }

    // CONSISTENT CREATIVE AUTHENTICATION FORM FLOW
    return (
        <div className="flex flex-col items-center justify-center min-h-[550px] w-full text-center space-y-8 max-w-lg mx-auto relative group py-2">
            <div className="absolute top-0 left-0 w-full flex justify-between px-4 opacity-20 pointer-events-none">
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    DIIC_ZONE_SYSTEM_V2
                </div>
            </div>

            {authMode === 'welcome' && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 w-full"
                >
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] leading-none">
                            ZONA CREATIVA
                        </h2>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight italic uppercase leading-none">
                            Únete al equipo <br/>
                            <span className="text-indigo-500">de alto rendimiento</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md mx-auto pt-2">
                            Regístrate para conectar con las mejores marcas, automatizar tu flujo creativo y trabajar de manera colaborativa.
                        </p>
                    </div>

                    <div className="space-y-4 pt-6 w-full px-4">
                        <button
                            onClick={handleGoogleConnect}
                            disabled={loading}
                            className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50"
                        >
                            <GoogleIcon />
                            {loading ? 'Cargando...' : 'Continuar con Google'}
                        </button>

                        <button
                            onClick={() => setAuthMode('email_register')}
                            className="w-full py-5 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center"
                        >
                            <Mail className="w-5 h-5 mr-2 shrink-0 text-indigo-400" />
                            Crear cuenta con correo
                        </button>
                    </div>

                    <div className="pt-4">
                        <p className="text-xs text-gray-500">
                            ¿Ya tienes una cuenta?{' '}
                            <button
                                onClick={() => setAuthMode('email_login')}
                                className="text-indigo-400 hover:text-indigo-300 font-bold underline"
                            >
                                Inicia Sesión
                            </button>
                        </p>
                    </div>
                </motion.div>
            )}

            {authMode === 'email_register' && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl"
                >
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase italic">Crear Cuenta</h2>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-mono">ÚNETE A LA RED CREATIVA</p>
                    </div>

                    <form onSubmit={handleEmailRegister} className="space-y-4 text-left">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                <User className="w-2.5 h-2.5" /> Nombre Completo
                            </label>
                            <input 
                                required
                                placeholder="Tu Nombre"
                                value={formData.full_name}
                                onChange={e => setFormData({...formData, full_name: e.target.value})}
                                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                <Mail className="w-2.5 h-2.5" /> Correo Electrónico
                            </label>
                            <input 
                                required
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                    <Lock className="w-2.5 h-2.5" /> Contraseña
                                </label>
                                <div className="relative">
                                    <input 
                                        required
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Confirmar
                                </label>
                                <div className="relative">
                                    <input 
                                        required
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                        className={`w-full bg-black/20 border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : 'border-white/5'} rounded-2xl p-4 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !formData.email || !formData.password || !formData.confirmPassword || !formData.full_name || formData.password !== formData.confirmPassword}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Creando...' : 'Crear Cuenta'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="pt-2">
                        <button
                            onClick={() => setAuthMode('welcome')}
                            className="text-xs text-gray-500 hover:text-white transition-colors"
                        >
                            ← Volver
                        </button>
                    </div>
                </motion.div>
            )}

            {authMode === 'email_login' && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl"
                >
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase italic">Iniciar Sesión</h2>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-mono">Ingresa a tu cuenta de DIIC ZONE</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                <Mail className="w-2.5 h-2.5" /> Correo Electrónico
                            </label>
                            <input 
                                required
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                            />
                        </div>

                        <div className="space-y-1 text-left">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Contraseña
                            </label>
                            <div className="relative">
                                <input 
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !formData.email || !formData.password}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Accediendo...' : 'Iniciar Sesión'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="pt-2">
                        <button
                            onClick={() => setAuthMode('welcome')}
                            className="text-xs text-gray-500 hover:text-white transition-colors"
                        >
                            ← Volver
                        </button>
                    </div>
                </motion.div>
            )}

            {isDev && (
                <div 
                    onClick={() => setBypassActive(!bypassActive)}
                    className={`font-mono text-[7px] ${bypassActive ? 'text-emerald-500' : 'text-gray-700'} uppercase tracking-[0.3em] font-black cursor-pointer hover:opacity-100 transition-opacity`}
                >
                    PROTOCOL_BYPASS_ENABLED: {bypassActive ? 'TRUE' : 'FALSE'} | CHANNEL: SECURE_CORE
                </div>
            )}
        </div>
    );
}
