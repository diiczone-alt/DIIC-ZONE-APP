'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Lock, Bell, CreditCard, Save, Camera, Mail, Phone, Shield, X, MapPin, Sparkles, Zap, Stethoscope, Network, Target } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import GrowthPricing from '../growth/GrowthPricing';
import PremiumDropdown from '../shared/PremiumDropdown';
import { motion } from 'framer-motion';
import { ECUADOR_CITIES, INDUSTRY_OPTIONS, PLAN_OPTIONS, MEDICAL_SPECIALTIES, AGRO_SPECIALTIES, EDUCATION_SPECIALTIES } from '@/lib/constants';

export default function ClientAccountSettings() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profile'); // profile, brand, security, billing, notifications
    const [showPlans, setShowPlans] = useState(false);
    
    // Sync State
    const [profileData, setProfileData] = useState({
        full_name: 'Servicios Agropecuarios Ecuador',
        brand_name: 'Servicios Agropecuarios Ecuador',
        phone: '+593963068478',
        email: 'serviciosagropecuariosecuador@gmail.com',
        location: 'Santo Domingo, Ecuador',
        marketing_type: 'educativo',
        specialty: 'cursos_agro',
        plan: 'Growth Engine',
        bio: 'Aprende, Emprende y Especialízate en ganadería vacuna y porcina.',
        primary_color: '#FFC823', // Yellow/Gold
        secondary_color: '#008D36', // Green
        accent_color: '#12372A', // Dark Green
        logo_url: 'https://serviciosagropecuariosecuador.com/wp-content/uploads/Logo-Agro-web.webp',
        industry_slug: 'educacion-agro'
    });

    const fileInputRef = useRef(null);

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        try {
            // Simulate upload to Supabase Storage
            await new Promise(r => setTimeout(r, 1500));
            // In a real app: const { data, error } = await supabase.storage.from('brand-assets').upload(...)
            const simulatedUrl = URL.createObjectURL(file); 
            setProfileData(prev => ({ ...prev, logo_url: simulatedUrl }));
            toast.success("Logotipo cargado exitosamente");
        } catch (error) {
            toast.error("Error al subir el logotipo");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchSyncData = async () => {
            if (!user?.id) return;
            
            try {
                // 1. Fetch Profile
                const { data: profile, error: pError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (pError) throw pError;

                // 2. Fetch Linked Client record if available
                let clientRecord = null;
                if (profile?.client_id) {
                    clientRecord = await agencyService.getClientById(profile.client_id);
                }

                setProfileData({
                    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                    brand_name: clientRecord?.name || user?.user_metadata?.brand || '',
                    phone: clientRecord?.whatsapp_number || profile?.whatsapp || '',
                    email: user?.email || '',
                    location: clientRecord?.city || profile?.location || 'Santo Domingo',
                    marketing_type: clientRecord?.industry || profile?.industry || 'agropecuario',
                    specialty: clientRecord?.specialty || profile?.specialty || '',
                    plan: clientRecord?.plan || profile?.plan || 'Basic',
                    bio: clientRecord?.notes || '',
                    primary_color: clientRecord?.onboarding_data?.brand?.primaryColor || '#6366f1',
                    secondary_color: clientRecord?.onboarding_data?.brand?.secondaryColor || '#ec4899',
                    accent_color: clientRecord?.onboarding_data?.brand?.accentColor || '#10b981',
                    logo_url: clientRecord?.onboarding_data?.brand?.logo || '',
                    industry_slug: profile?.industry_slug || ''
                });
            } catch (error) {
                console.error("Error fetching sync data:", error);
            }
        };

        fetchSyncData();
    }, [user]);

    const handleSave = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        
        try {
            // Find client_id first
            const { data: profile } = await supabase
                .from('profiles')
                .select('client_id')
                .eq('id', user.id)
                .single();

            if (profile?.client_id) {
                // Perform Bidirectional Sync
                await agencyService.syncClientProfile(profile.client_id, {
                    full_name: profileData.brand_name, // Mapping Brand Name to Profile Full Name for aesthetic parity
                    location: profileData.location,
                    whatsapp: profileData.phone,
                    marketing_type: profileData.marketing_type,
                    specialty: profileData.specialty,
                    plan: profileData.plan,
                    primary_color: profileData.primary_color,
                    secondary_color: profileData.secondary_color,
                    accent_color: profileData.accent_color,
                    logo_url: profileData.logo_url
                });
                
                // Update specific personal profile fields
                await supabase
                    .from('profiles')
                    .update({ 
                        full_name: profileData.full_name,
                        location: profileData.location,
                        whatsapp: profileData.phone,
                        industry: profileData.marketing_type,
                        specialty: profileData.specialty,
                        plan: profileData.plan
                    })
                    .eq('id', user.id);
            }

            toast.success('Perfil y Hub de Datos sincronizados');
        } catch (error) {
            console.error("Sync error:", error);
            toast.error('Error al sincronizar datos');
        } finally {
            setIsLoading(false);
        }
    };

    const initials = (profileData.full_name || 'DU').substring(0, 2).toUpperCase();

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">

            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
                <NavButton
                    id="profile"
                    label="Perfil Público"
                    icon={User}
                    isActive={activeSection === 'profile'}
                    onClick={() => setActiveSection('profile')}
                />
                <NavButton
                    id="brand"
                    label="Mi Marca"
                    icon={Sparkles}
                    isActive={activeSection === 'brand'}
                    onClick={() => setActiveSection('brand')}
                />
                <NavButton
                    id="security"
                    label="Seguridad"
                    icon={Lock}
                    isActive={activeSection === 'security'}
                    onClick={() => setActiveSection('security')}
                />
                <NavButton
                    id="notifications"
                    label="Notificaciones"
                    icon={Bell}
                    isActive={activeSection === 'notifications'}
                    onClick={() => setActiveSection('notifications')}
                />
                <NavButton
                    id="billing"
                    label="Plan y Facturación"
                    icon={CreditCard}
                    isActive={activeSection === 'billing'}
                    onClick={() => setActiveSection('billing')}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-6 md:p-10 min-h-[600px] relative backdrop-blur-sm">

                {/* Background Decor */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                {/* PROFILE SECTION */}
                {activeSection === 'profile' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Perfil Público</h2>
                            <p className="text-gray-400 text-sm">Administra tu información personal y cómo te ven los demás.</p>
                        </div>

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="relative group cursor-pointer w-20 h-20">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20 overflow-hidden">
                                    {initials}
                                </div>
                                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Foto de Perfil</h3>
                                <p className="text-xs text-gray-500 mb-3 max-w-[200px]">Recomendado: 400x400px, PNG o JPG. Máx 2MB.</p>
                                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/10 transition-colors uppercase tracking-wider">
                                    Subir Nueva
                                </button>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <InputField 
                                label="Nombre Completo" 
                                value={profileData.full_name} 
                                onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} 
                                icon={User} 
                            />
                            <InputField 
                                label="Cargo / Título" 
                                value={profileData.brand_name} 
                                onChange={(e) => setProfileData({...profileData, brand_name: e.target.value})} 
                                icon={Shield} 
                                placeholder="Ej: Dra. Jessica Rey"
                            />
                            <InputField 
                                label="Correo Electrónico" 
                                value={profileData.email} 
                                type="email" 
                                icon={Mail} 
                                readOnly={true}
                            />
                            <InputField 
                                label="Teléfono / WhatsApp" 
                                value={profileData.phone} 
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                                type="tel" 
                                icon={Phone} 
                            />
                        </div>

                        {/* Premium Selections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-4 border-t border-white/5">
                            <PremiumDropdown 
                                label="Ubicación / Ciudad"
                                value={profileData.location}
                                onChange={(val) => setProfileData({...profileData, location: val})}
                                options={ECUADOR_CITIES}
                                icon={MapPin}
                                searchable={true}
                            />
                            <PremiumDropdown 
                                label="Industria / Sector"
                                value={profileData.marketing_type}
                                onChange={(val) => setProfileData({...profileData, marketing_type: val, specialty: ''})}
                                options={INDUSTRY_OPTIONS}
                                icon={Sparkles}
                            />
                            
                            {/* Conditional Specialty field */}
                            {profileData.marketing_type === 'medico' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:col-span-2">
                                    <PremiumDropdown 
                                        label="Especialidad Médica"
                                        value={profileData.specialty}
                                        onChange={(val) => setProfileData({...profileData, specialty: val})}
                                        options={MEDICAL_SPECIALTIES}
                                        icon={Stethoscope}
                                    />
                                </motion.div>
                            )}

                            {profileData.marketing_type === 'agropecuario' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:col-span-2">
                                    <PremiumDropdown 
                                        label="Rama Agropecuaria"
                                        value={profileData.specialty}
                                        onChange={(val) => setProfileData({...profileData, specialty: val})}
                                        options={AGRO_SPECIALTIES}
                                        icon={Stethoscope}
                                    />
                                </motion.div>
                            )}

                            <div className="md:col-span-2">
                                <PremiumDropdown 
                                    label="Plan Maestro"
                                    value={profileData.plan}
                                    onChange={(val) => setProfileData({...profileData, plan: val})}
                                    options={PLAN_OPTIONS}
                                    icon={Zap}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Biografía Corta</label>
                            <textarea
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors min-h-[120px] resize-none placeholder:text-gray-600"
                                placeholder="Escribe algo sobre ti y tu empresa..."
                                value={profileData.bio}
                                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            />
                        </div>
                    </div>
                )}
                {/* BRAND SECTION */}
                {activeSection === 'brand' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Mi Marca</h2>
                            <p className="text-gray-400 text-sm">Personaliza tu ecosistema con tu identidad visual única.</p>
                        </div>

                        {/* Logo Upload (Enhanced for Brand) */}
                        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-white/5 rounded-[32px] border border-white/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
                            
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleLogoUpload} 
                            />

                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="relative group cursor-pointer w-48 h-48 shrink-0"
                            >
                                <div className="w-full h-full rounded-[40px] bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all group-hover:border-blue-500/50 overflow-hidden relative">
                                    {profileData.logo_url ? (
                                        <img src={profileData.logo_url} alt="Brand Logo" className="w-full h-full object-contain p-4" />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                                                <Camera className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest text-center px-4">Sube tu <br/> Logotipo</span>
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/60 rounded-[40px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <button className="text-white text-[10px] font-black uppercase tracking-widest">Actualizar</button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-white font-black text-2xl italic tracking-tighter uppercase">Identidad Visual</h3>
                                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Dashboard Branding v2.0</p>
                                </div>
                                <p className="text-xs text-gray-500 max-w-sm leading-relaxed font-medium">
                                    Tu logo y paleta de colores se aplicarán automáticamente en tu Dashboard, reportes comerciales y notificaciones oficiales.
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => fileInputRef.current.click()}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-2xl border border-indigo-400/20 transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-indigo-600/20"
                                    >
                                        Subir Logotipo
                                    </button>
                                    {profileData.logo_url && (
                                        <button 
                                            onClick={() => setProfileData({...profileData, logo_url: ''})}
                                            className="px-6 py-3 bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 text-[10px] font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest active:scale-95"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Brand Colors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-black/40 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full bg-indigo-500" />
                                        <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Primario</h4>
                                    </div>
                                    <div className="w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: profileData.primary_color }} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="color" 
                                        value={profileData.primary_color}
                                        onChange={(e) => setProfileData({...profileData, primary_color: e.target.value})}
                                        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer appearance-none" 
                                    />
                                    <input 
                                        type="text" 
                                        value={profileData.primary_color}
                                        onChange={(e) => setProfileData({...profileData, primary_color: e.target.value})}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-[10px] uppercase focus:outline-none focus:border-indigo-500/50" 
                                    />
                                </div>
                            </div>

                            <div className="bg-black/40 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full bg-pink-500" />
                                        <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Secundario</h4>
                                    </div>
                                    <div className="w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: profileData.secondary_color }} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="color" 
                                        value={profileData.secondary_color}
                                        onChange={(e) => setProfileData({...profileData, secondary_color: e.target.value})}
                                        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer appearance-none" 
                                    />
                                    <input 
                                        type="text" 
                                        value={profileData.secondary_color}
                                        onChange={(e) => setProfileData({...profileData, secondary_color: e.target.value})}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-[10px] uppercase focus:outline-none focus:border-pink-500/50" 
                                    />
                                </div>
                            </div>

                            <div className="bg-black/40 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full bg-emerald-500" />
                                        <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Acento</h4>
                                    </div>
                                    <div className="w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: profileData.accent_color }} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="color" 
                                        value={profileData.accent_color}
                                        onChange={(e) => setProfileData({...profileData, accent_color: e.target.value})}
                                        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer appearance-none" 
                                    />
                                    <input 
                                        type="text" 
                                        value={profileData.accent_color}
                                        onChange={(e) => setProfileData({...profileData, accent_color: e.target.value})}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-[10px] uppercase focus:outline-none focus:border-emerald-500/50" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Niche Selection (Directly from Onboarding) */}
                        <div className="bg-[#121226]/60 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] space-y-8 shadow-2xl relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm italic">Capa Estratégica</h4>
                                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Configura el contexto operativo de tu marca</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                    <Network className="w-6 h-6 text-indigo-400" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <PremiumDropdown 
                                    label="Industria de Marketing"
                                    value={profileData.marketing_type}
                                    onChange={(val) => setProfileData({...profileData, marketing_type: val, specialty: ''})}
                                    options={INDUSTRY_OPTIONS}
                                    icon={Sparkles}
                                />
                                {profileData.marketing_type === 'educativo' ? (
                                    <PremiumDropdown 
                                        label="Especialidad Educativa"
                                        value={profileData.specialty}
                                        onChange={(val) => setProfileData({...profileData, specialty: val})}
                                        options={EDUCATION_SPECIALTIES}
                                        icon={Target}
                                    />
                                ) : profileData.marketing_type === 'agropecuario' ? (
                                    <PremiumDropdown 
                                        label="Especialidad Agro"
                                        value={profileData.specialty}
                                        onChange={(val) => setProfileData({...profileData, specialty: val})}
                                        options={AGRO_SPECIALTIES}
                                        icon={Target}
                                    />
                                ) : profileData.marketing_type === 'medico' ? (
                                    <PremiumDropdown 
                                        label="Especialidad Médica"
                                        value={profileData.specialty}
                                        onChange={(val) => setProfileData({...profileData, specialty: val})}
                                        options={MEDICAL_SPECIALTIES}
                                        icon={Target}
                                    />
                                ) : (
                                    <InputField 
                                        label="Rama / Enfoque Específico"
                                        value={profileData.specialty}
                                        onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                                        placeholder="Ej: Retail, Consultoría, etc."
                                        icon={Target}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* SECURITY SECTION */}
                {activeSection === 'security' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Seguridad</h2>
                            <p className="text-gray-400 text-sm">Protege tu cuenta y gestiona tus credenciales.</p>
                        </div>

                        <div className="space-y-6 max-w-lg">
                            <InputField label="Contraseña Actual" type="password" placeholder="••••••••••••" icon={Lock} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Nueva Contraseña" type="password" placeholder="••••••••••••" icon={Lock} />
                                <InputField label="Confirmar Contraseña" type="password" placeholder="••••••••••••" icon={Lock} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <h3 className="text-white font-bold mb-4">Dispositivos Activos</h3>
                            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-white/5">
                                        <Shield className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Windows PC - Chrome</h4>
                                        <p className="text-xs text-gray-400 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Activo ahora • {user?.user_metadata?.city || 'Santo Domingo'}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-emerald-400 text-[10px] font-bold px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 uppercase tracking-wide">Actual</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS SECTION */}
                {activeSection === 'notifications' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Notificaciones</h2>
                            <p className="text-gray-400 text-sm">Elige cómo y cuándo quieres que te contactemos.</p>
                        </div>

                        <div className="space-y-4">
                            <ToggleOption title="Nuevos Proyectos" description="Recibir alertas cuando se asignen nuevos proyectos." defaultChecked />
                            <ToggleOption title="Actualizaciones de Estado" description="Cuando un creativo cambie el estado de una tarea." defaultChecked />
                            <ToggleOption title="Mensajes Directos" description="Notificaciones de chat con el equipo." defaultChecked />
                            <ToggleOption title="Marketing y Ofertas" description="Recibir noticias sobre nuevas funciones y descuentos." />
                        </div>
                    </div>
                )}

                {/* BILLING SECTION */}
                {activeSection === 'billing' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Plan y Facturación</h2>
                            <p className="text-gray-400 text-sm">Gestiona tu suscripción y métodos de pago.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 bg-blue-500 text-white text-xs font-bold rounded-bl-xl shadow-lg">PLAN ACTUAL</div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-1">Plan Business</h3>
                                <p className="text-blue-200 text-sm mb-4">$499.00 USD / mes</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowPlans(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                                        Cambiar Plan
                                    </button>
                                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-colors active:scale-95">
                                        Cancelar Suscripción
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-white font-bold text-sm">Método de Pago</h3>
                            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5 opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">•••• •••• •••• 4242</h4>
                                        <p className="text-xs text-gray-400">Expira 12/28</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Visa</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Footer Actions */}
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3 relative z-10">
                    <button className="px-6 py-2.5 text-gray-400 hover:text-white font-bold text-xs transition-colors rounded-xl hover:bg-white/5">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform"
                    >
                        {isLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            {/* Plans Modal Overlay */}
            {showPlans && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md overflow-y-auto custom-scrollbar">
                    <div className="relative w-full max-w-7xl bg-[#070710] border border-white/10 rounded-[40px] p-2 md:p-8 shadow-[0_0_100px_rgba(0,0,0,1)] my-auto animate-in fade-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setShowPlans(false)} 
                            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-gray-400 transition-colors z-50 group border border-white/5"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                        <div className="w-full h-full overflow-hidden">
                            <GrowthPricing />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-components for internal organization
function NavButton({ id, label, icon: Icon, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
        >
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
            <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="relative z-10">{label}</span>
        </button>
    );
}

function InputField({ label, placeholder, value, onChange, type = 'text', icon: Icon, readOnly = false }) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <div className="relative group">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all placeholder:text-gray-600 group-hover:border-white/20 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder={placeholder}
                />
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
        </div>
    );
}

function ToggleOption({ title, description, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div>
                <h4 className="text-white font-bold text-sm">{title}</h4>
                <p className="text-gray-400 text-xs">{description}</p>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-blue-600' : 'bg-white/10'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
    );
}
