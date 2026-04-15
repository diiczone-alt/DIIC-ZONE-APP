import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Wifi, Cpu, Globe, ArrowRight, Mail, Lock, User, Briefcase, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { driveService } from '@/services/driveService';
import { toast } from 'sonner';

export default function AuthStep({ onNext, updateData, type = 'client' }) {
    const { register, login, signInWithGoogle } = useAuth();
    const isCreative = type === 'creative';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        brand: '',
        city: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const ecuadorCities = [
        "Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala", 
        "Durán", "Portoviejo", "Loja", "Quevedo", "Ambato", 
        "Milagro", "Ibarra", "Esmeraldas", "Babahoyo", "Manta", 
        "Sangolquí", "Latacunga", "Tulcán", "Santa Elena", "La Libertad"
    ].sort();

    const handleGoogleConnect = async () => {
        if (!formData.brand || !formData.city) {
            toast.error('Por favor, ingresa tu Marca y Ciudad antes de continuar con Google.');
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
                auth: { method: 'google', timestamp: new Date().toISOString() } 
            });

            await signInWithGoogle({
                full_name: formData.full_name || '',
                brand: formData.brand,
                city: formData.city,
                role: type === 'creative' ? 'CREATOR' : 'CLIENT'
            });
        } catch (err) {
            toast.error('Error al conectar con Google: ' + err.message);
            setLoading(false);
        }
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        if (!formData.city) {
            toast.error('Por favor, selecciona tu ciudad.');
            return;
        }
        setLoading(true);
        try {
            const result = await register(formData.email, formData.password, { 
                full_name: formData.full_name,
                brand: formData.brand,
                city: formData.city,
                role: type === 'creative' ? 'CREATOR' : 'CLIENT'
            });

            updateData({ 
                name: formData.full_name,
                brand: formData.brand,
                city: formData.city,
                auth: { method: 'email', timestamp: new Date().toISOString() } 
            });

            if (result.needsConfirmation) {
                setVerificationSent(true);
                toast.success('¡Casi listo! Protocolo de verificación enviado.');
            } else {
                toast.success('Protocolo de acceso generado.');
                onNext();
            }
        } catch (err) {
            toast.error('Error: ' + err.message);
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
                        <h3 className="text-white font-black text-xl uppercase italic">Verificación Requerida</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Hemos enviado un vínculo de confirmación a <span className="text-white font-bold">{formData.email}</span>. 
                            Haz clic en el enlace para activar tu cuenta y continuar con el almacenamiento en Google Drive.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-4">¿Ya confirmaste?</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            INICIAR SESIÓN AHORA <ArrowRight className="w-4 h-4" />
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
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5" /> {isCreative ? 'Specialty' : 'Brand'}
                        </label>
                        <input 
                            required
                            autoComplete="off"
                            name={`diic_brand_${Math.random()}`}
                            placeholder={isCreative ? "Ej: Editor Pro / Filmmaker" : "Tu Marca"}
                            value={formData.brand}
                            onChange={e => setFormData({...formData, brand: e.target.value})}
                            className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {/* Field: City Dropdown */}
                <div className="space-y-1 text-left relative z-[101]">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> Location
                    </label>
                    <div 
                        onClick={() => setIsCityOpen(!isCityOpen)}
                        className={`w-full bg-black/20 border ${isCityOpen ? 'border-indigo-500' : 'border-white/5'} rounded-2xl p-4 text-xs text-white transition-all font-bold flex items-center justify-between cursor-pointer`}
                    >
                        <span className={formData.city ? 'text-white' : 'text-gray-700'}>
                            {formData.city || "Seleccionar Ciudad"}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {isCityOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 5 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 w-full bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-40 overflow-y-auto z-[102] backdrop-blur-3xl scrollbar-hide"
                            >
                                {ecuadorCities.map((item) => (
                                    <div 
                                        key={item}
                                        onClick={() => {
                                            setFormData({...formData, city: item});
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
                        <input 
                            required
                            autoComplete="new-password"
                            name={`diic_pass_${Math.random()}`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                        />
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> Confirm
                        </label>
                        <input 
                            required
                            type="password" 
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                            className={`w-full bg-black/20 border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : 'border-white/5'} rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700`}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.email || !formData.password || !formData.confirmPassword || !formData.full_name || !formData.city || formData.password !== formData.confirmPassword}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? 'Sincronizando...' : 'Establecer Acceso Vitalicio'} <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="relative py-2 flex items-center gap-4">
                    <div className="flex-1 h-[1px] bg-white/5" />
                    <span className="text-[8px] font-mono text-gray-700 uppercase">O CONTINUA CON</span>
                    <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                {/* Google Quick Connect */}
                <button
                    type="button"
                    onClick={handleGoogleConnect}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-[9px] font-black uppercase tracking-widest text-white/80"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Fusión instantánea con Google
                </button>
            </motion.form>
            )}

            <div className="font-mono text-[7px] text-gray-700 uppercase tracking-[0.3em] font-black">
                PROTOCOL_BYPASS_ENABLED: FALSE | CHANNEL: SECURE_CORE
            </div>
        </div>
    );
}

