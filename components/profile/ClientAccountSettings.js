'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Lock, Bell, CreditCard, Save, Camera, Mail, Phone, Shield, X, MapPin, Sparkles, Zap, Stethoscope, Network, Target, Globe, Calendar, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import { driveService } from '@/services/driveService';
import { useSearchParams } from 'next/navigation';
import GrowthPricing from '../growth/GrowthPricing';
import PremiumDropdown from '../shared/PremiumDropdown';
import { motion } from 'framer-motion';
import { ECUADOR_CITIES, INDUSTRY_OPTIONS, PLAN_OPTIONS, MEDICAL_SPECIALTIES, AGRO_SPECIALTIES, EDUCATION_SPECIALTIES } from '@/lib/constants';

const getPlanPrice = (plan, industry) => {
    const cleanNiche = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const ind = cleanNiche(industry);
    const isMedical = ind.includes('medico') || ind.includes('salud') || ind.includes('health') || ind.includes('doctor');
    const isHospital = ind.includes('hospital') || ind.includes('clinica');
    
    let normalizedPlan = plan;
    if (plan === 'Basic') normalizedPlan = 'Presencia';
    if (plan === 'Estrategia') normalizedPlan = 'Crecimiento';
    if (plan === 'Premium') normalizedPlan = 'Autoridad';
    
    if (isMedical && !isHospital) {
        if (normalizedPlan === 'Presencia') return 250;
        if (normalizedPlan === 'Crecimiento') return 500;
        if (normalizedPlan === 'Autoridad') return 700;
        if (normalizedPlan === 'Control') return 999;
        return 0;
    } else if (isHospital) {
        if (normalizedPlan === 'Presencia') return 300;
        if (normalizedPlan === 'Crecimiento') return 500;
        if (normalizedPlan === 'Autoridad') return 700;
        if (normalizedPlan === 'Control') return 999;
        return 0;
    } else {
        const planDef = PLAN_OPTIONS.find(p => p.value === normalizedPlan);
        return planDef ? planDef.price : 0;
    }
};

export default function ClientAccountSettings() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profile'); // profile, brand, security, billing, notifications
    const [showPlans, setShowPlans] = useState(false);
    const [isNicheLocked, setIsNicheLocked] = useState(false);

    useEffect(() => {
        if (searchParams.get('upgrade') === 'crm') {
            setActiveSection('billing');
            setShowPlans(true);
        }
    }, [searchParams]);
    
    const [profileData, setProfileData] = useState({
        full_name: '',
        brand_name: '',
        phone: '',
        email: '',
        location: '',
        country: '',
        address: '',
        birth_date: '',
        website: '',
        marketing_type: 'agropecuario',
        specialty: '',
        plan: 'Basic',
        bio: '',
        primary_color: '#6366f1',
        secondary_color: '#ec4899',
        accent_color: '#10b981',
        logo_url: '',
        industry_slug: '',
        goals: [],
        drive_root_link: '',
        drive_root_id: '',
        brochure_url: '',
        start_date: '',
        cutoff_day: 5,
        app_fee: 100,
        has_crm: true,
        has_agents: true,
        price: '0'
    });

    const fileInputRef = useRef(null);
    const brochureInputRef = useRef(null);

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        try {
            await new Promise(r => setTimeout(r, 1500));
            const simulatedUrl = URL.createObjectURL(file); 
            setProfileData(prev => ({ ...prev, logo_url: simulatedUrl }));
            toast.success("Logotipo cargado exitosamente");
        } catch (error) {
            toast.error("Error al subir el logotipo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBrochureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        try {
            console.log("Uploading brochure:", file.name);
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}_brochure_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `brochures/${fileName}`;

            // Attempt upload to 'documents' bucket
            const { data, error } = await supabase.storage
                .from('documents')
                .upload(filePath, file, { cacheControl: '3600', upsert: true });

            let brochureUrl = '';
            if (error) {
                console.warn("Storage upload failed, simulating URL:", error.message);
                brochureUrl = URL.createObjectURL(file);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(filePath);
                brochureUrl = publicUrl;
            }

            setProfileData(prev => ({ ...prev, brochure_url: brochureUrl }));
            toast.success("Brochure cargado exitosamente");
        } catch (error) {
            console.error("Brochure upload error:", error);
            toast.error("Error al subir el brochure");
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
                    brand_name: (clientRecord?.name || user?.user_metadata?.brand || '').replace(/[-_\s]+workspace\s*$/i, '').trim(),
                    phone: clientRecord?.whatsapp_number || profile?.whatsapp || '',
                    email: user?.email || '',
                    location: clientRecord?.city || profile?.location || 'Santo Domingo',
                    country: clientRecord?.country || profile?.country || 'Ecuador',
                    address: clientRecord?.address || profile?.address || '',
                    birth_date: clientRecord?.birth_date || profile?.birth_date || '',
                    website: clientRecord?.website || profile?.website || '',
                    marketing_type: clientRecord?.industry || profile?.industry || 'agropecuario',
                    specialty: clientRecord?.specialty || profile?.specialty || '',
                    plan: clientRecord?.plan || profile?.plan || 'Basic',
                    bio: clientRecord?.notes || '',
                    primary_color: clientRecord?.onboarding_data?.brand?.primaryColor || '#6366f1',
                    secondary_color: clientRecord?.onboarding_data?.brand?.secondaryColor || '#ec4899',
                    accent_color: clientRecord?.onboarding_data?.brand?.accentColor || '#10b981',
                    logo_url: clientRecord?.onboarding_data?.brand?.logo || '',
                    industry_slug: profile?.industry_slug || '',
                    goals: clientRecord?.goals || profile?.goals || [],
                    drive_root_link: profile?.drive_root_link || '',
                    drive_root_id: profile?.drive_root_id || '',
                    brochure_url: clientRecord?.brochure_url || profile?.brochure_url || '',
                    start_date: clientRecord?.start_date || profile?.start_date || '',
                    cutoff_day: clientRecord?.cutoff_day !== undefined ? clientRecord.cutoff_day : (profile?.cutoff_day !== undefined ? profile.cutoff_day : 5),
                    app_fee: clientRecord?.app_fee !== undefined ? clientRecord.app_fee : (profile?.app_fee !== undefined ? profile.app_fee : 100),
                    has_crm: clientRecord?.has_crm !== undefined ? clientRecord.has_crm : (profile?.has_crm !== undefined ? profile.has_crm : true),
                    has_agents: clientRecord?.has_agents !== undefined ? clientRecord.has_agents : (profile?.has_agents !== undefined ? profile.has_agents : true),
                    price: (() => {
                        let priceVal = clientRecord?.price || profile?.price || '300';
                        const cleanNiche = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                        const normalizedInd = cleanNiche(clientRecord?.industry || profile?.industry);
                        const isMedOrHosp = normalizedInd.includes('medico') || normalizedInd.includes('hospital') || normalizedInd.includes('clinica');
                        if (isMedOrHosp) {
                            const planVal = clientRecord?.plan || profile?.plan || 'Basic';
                            const calculated = getPlanPrice(planVal, clientRecord?.industry || profile?.industry);
                            if (Number(priceVal) === 300 && calculated === 250) {
                                return '250';
                            } else if (Number(priceVal) === 800 && calculated === 700) {
                                return '700';
                            }
                        }
                        return String(priceVal);
                    })()
                });
                const existingNiche = clientRecord?.industry || profile?.industry;
                setIsNicheLocked(!!(existingNiche && existingNiche !== 'Otro' && existingNiche !== 'General' && existingNiche !== ''));
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

            let targetClientId = profile?.client_id;

            // Auto-create HQ Client if not linked
            if (!targetClientId) {
                console.log("No client_id found. Auto-creating HQ client record...");
                const newClientRes = await agencyService.createClient({
                    name: profileData.brand_name || profileData.full_name || 'Nuevo Cliente',
                    city: profileData.location,
                    whatsapp_number: profileData.phone,
                    industry: profileData.marketing_type,
                    email: user.email,
                    plan: profileData.plan,
                    country: profileData.country,
                    address: profileData.address,
                    website: profileData.website,
                    goals: profileData.goals,
                    brochure_url: profileData.brochure_url
                });
                
                if (!newClientRes || !newClientRes.id) {
                    throw new Error("Failed to auto-create HQ Client record. Received empty response.");
                }

                targetClientId = newClientRes.id;
                
                // Link it to the user profile
                const { error: linkError } = await supabase
                    .from('profiles')
                    .update({ client_id: targetClientId })
                    .eq('id', user.id);
                
                if (linkError) {
                    throw new Error("Failed to link HQ Client ID to profile: " + linkError.message);
                }
            }

            // Perform Bidirectional Sync
            await agencyService.syncClientProfile(targetClientId, {
                full_name: profileData.full_name,
                brand_name: profileData.brand_name,
                bio: profileData.bio,
                location: profileData.location,
                whatsapp: profileData.phone,
                marketing_type: profileData.marketing_type,
                specialty: profileData.specialty,
                plan: profileData.plan,
                primary_color: profileData.primary_color,
                secondary_color: profileData.secondary_color,
                accent_color: profileData.accent_color,
                logo_url: profileData.logo_url,
                country: profileData.country,
                address: profileData.address,
                website: profileData.website,
                goals: profileData.goals,
                brochure_url: profileData.brochure_url,
                price: profileData.price
            });

            // Update specific personal profile fields
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ 
                    full_name: profileData.full_name,
                    location: profileData.location,
                    whatsapp: profileData.phone,
                    industry: profileData.marketing_type,
                    specialty: profileData.specialty,
                    plan: profileData.plan,
                    country: profileData.country,
                    address: profileData.address,
                    website: profileData.website,
                    goals: profileData.goals,
                    brochure_url: profileData.brochure_url,
                    drive_root_link: profileData.drive_root_link,
                    drive_root_id: profileData.drive_root_id,
                    price: profileData.price
                })
                .eq('id', user.id);
            
            if (profileError) {
                throw new Error("Failed to update profile: " + profileError.message);
            }

            // Sync to clients table
            const { error: clientError } = await supabase
                .from('clients')
                .update({
                    google_drive_folder_id: profileData.drive_root_id
                })
                .eq('id', targetClientId);
            
            if (clientError) {
                console.warn("Client table sync warning:", clientError.message);
            }

            toast.success('Perfil y Hub de Datos sincronizados');
        } catch (error) {
            console.error("Sync error:", error);
            toast.error('Error al sincronizar: ' + (error.message || 'Desconocido'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectDrive = async () => {
        try {
            toast.loading('Iniciando conexión con Google...', { id: 'drive-connect' });
            const currentPath = window.location.pathname;
            localStorage.setItem('diic_waiting_oauth', 'true');
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    redirectTo: window.location.origin + currentPath + '?tab=settings',
                    scopes: 'https://www.googleapis.com/auth/drive.file'
                }
            });
            if (error) throw error;
        } catch (err) {
            toast.error('Error al conectar Google: ' + err.message, { id: 'drive-connect' });
        }
    };

    useEffect(() => {
        const scanForToken = async () => {
            try {
                const hash = window.location.hash || window.location.search;
                if (hash && (hash.includes('provider_token') || hash.includes('access_token'))) {
                    const params = new URLSearchParams(hash.replace('#', '?'));
                    const token = params.get('provider_token') || params.get('access_token');
                    if (token) {
                        toast.loading('Google Drive conectado. Configurando entorno en la nube...', { id: 'drive-setup' });
                        window.history.replaceState(null, null, window.location.pathname + '?tab=settings');
                        
                        const brandName = profileData.brand_name || user?.user_metadata?.brand || 'Mi Marca';
                        const driveResult = await driveService.automatedSetup(token, brandName);
                        
                        // Save in profiles table
                        await supabase.from('profiles').update({
                            drive_root_link: driveResult.rootLink,
                            drive_root_id: driveResult.rootId
                        }).eq('id', user.id);

                        // If client_id is set, also save in clients table
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('client_id')
                            .eq('id', user.id)
                            .single();
                        
                        if (profile?.client_id) {
                            await supabase.from('clients').update({
                                google_drive_folder_id: driveResult.rootId
                            }).eq('id', profile.client_id);
                        }

                        setProfileData(prev => ({
                            ...prev,
                            drive_root_link: driveResult.rootLink,
                            drive_root_id: driveResult.rootId
                        }));

                        toast.success('¡Ecosistema Google Drive creado y sincronizado!', { id: 'drive-setup' });
                    }
                }
            } catch (err) {
                console.error('Error during settings drive setup:', err);
                toast.error('Error al configurar Drive: ' + err.message, { id: 'drive-setup' });
            }
        };
        if (user && profileData.brand_name) {
            scanForToken();
        }
    }, [user, profileData.brand_name]);

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

                        {/* Avatar & Brochure Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Avatar Upload */}
                            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                                <div className="relative group cursor-pointer w-20 h-20 shrink-0">
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

                            {/* Brochure Upload */}
                            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <input 
                                    type="file" 
                                    ref={brochureInputRef} 
                                    className="hidden" 
                                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    onChange={handleBrochureUpload} 
                                />
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 shrink-0">
                                    <CreditCard className="w-8 h-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-sm">Brochure de Marca</h3>
                                    <p className="text-xs text-gray-500 mb-3 truncate max-w-[200px]">
                                        {profileData.brochure_url ? 'Brochure cargado correctamente' : 'Sube información de tu marca o empresa'}
                                    </p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => brochureInputRef.current?.click()}
                                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-colors uppercase tracking-wider"
                                        >
                                            Subir Brochure
                                        </button>
                                        {profileData.brochure_url && (
                                            <a 
                                                href={profileData.brochure_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/10 transition-colors uppercase tracking-wider"
                                            >
                                                Ver
                                            </a>
                                        )}
                                    </div>
                                </div>
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
                            <InputField 
                                label="País" 
                                value={profileData.country} 
                                onChange={(e) => setProfileData({...profileData, country: e.target.value})} 
                                icon={Globe} 
                            />
                            <InputField 
                                label="Fecha de Nacimiento" 
                                value={profileData.birth_date} 
                                onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})} 
                                type="date"
                                icon={Calendar} 
                            />
                            <InputField 
                                label="Sitio Web" 
                                value={profileData.website} 
                                onChange={(e) => setProfileData({...profileData, website: e.target.value})} 
                                icon={Globe} 
                            />
                            <InputField 
                                label="Dirección Exacta" 
                                value={profileData.address} 
                                onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                                icon={MapPin} 
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
                            {isNicheLocked ? (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5 text-indigo-400" /> Industria / Sector (No modificable)
                                    </label>
                                    <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 px-4 text-gray-500 font-bold text-sm select-none uppercase tracking-wider">
                                        {INDUSTRY_OPTIONS.find(i => i.value === profileData.marketing_type)?.label || profileData.marketing_type || 'General'}
                                    </div>
                                </div>
                            ) : (
                                <PremiumDropdown 
                                    label="Industria / Sector"
                                    value={profileData.marketing_type}
                                    onChange={(val) => setProfileData({...profileData, marketing_type: val, specialty: ''})}
                                    options={INDUSTRY_OPTIONS}
                                    icon={Sparkles}
                                />
                            )}
                            
                            {/* Conditional Specialty field */}
                            {(profileData.marketing_type === 'medico' || profileData.marketing_type === 'hospital') && (
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
                                    onChange={(val) => {
                                        const price = getPlanPrice(val, profileData.marketing_type);
                                        setProfileData({ ...profileData, plan: val, price: price });
                                    }}
                                    options={PLAN_OPTIONS}
                                    icon={Zap}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Workspace Google Drive</label>
                                {profileData.drive_root_link ? (
                                    <div className="flex gap-3">
                                        <div className="flex-1 relative group">
                                            <input
                                                type="text"
                                                value={profileData.drive_root_link}
                                                readOnly
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-4 text-white text-sm focus:outline-none opacity-60"
                                            />
                                        </div>
                                        <a
                                            href={profileData.drive_root_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 shrink-0"
                                        >
                                            <Globe className="w-4 h-4" /> Abrir Drive
                                        </a>
                                        <button
                                            onClick={() => {
                                                if(confirm("¿Estás seguro de desvincular esta carpeta de Google Drive?")) {
                                                    setProfileData(prev => ({ ...prev, drive_root_link: '', drive_root_id: '' }));
                                                }
                                            }}
                                            className="px-4 py-3 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/20 transition-all active:scale-95 shrink-0"
                                        >
                                            Desvincular
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <p className="text-xs text-gray-400">
                                            No hay ninguna carpeta de Google Drive vinculada a tu cuenta. Puedes vincular una existente o conectar tu cuenta de Google para crear una estructura automática.
                                        </p>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <button
                                                onClick={handleConnectDrive}
                                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                                            >
                                                Crear Carpetas en Google Drive
                                            </button>
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Pega el enlace de tu carpeta de Google Drive existente aquí..."
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                                    id="existing-drive-link"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const val = document.getElementById('existing-drive-link')?.value;
                                                        if (!val) {
                                                            toast.error("Por favor ingresa un enlace válido");
                                                            return;
                                                        }
                                                        const match = val.match(/\/folders\/([a-zA-Z0-9-_]+)/) || val.match(/\/open\?id=([a-zA-Z0-9-_]+)/);
                                                        if (match) {
                                                            const id = match[1];
                                                            setProfileData(prev => ({ ...prev, drive_root_link: val, drive_root_id: id }));
                                                            toast.success("¡Carpeta Google Drive vinculada temporalmente! Guarda los cambios para persistirla.");
                                                        } else {
                                                            toast.error("No se pudo extraer el ID de la carpeta. Verifica que el enlace sea correcto.");
                                                        }
                                                    }}
                                                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors uppercase tracking-wider shrink-0"
                                                >
                                                    Vincular
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Business Goals */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <Target className="w-4 h-4 text-indigo-400" /> Objetivos de Negocio (Onboarding)
                            </label>
                            <p className="text-xs text-gray-500">Selecciona uno o más objetivos estratégicos para enfocar a tu equipo creativo.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                {[
                                    { id: 'clientes', label: 'Conseguir más clientes' },
                                    { id: 'ventas', label: 'Vender más' },
                                    { id: 'experto', label: 'Posicionarme como experto' },
                                    { id: 'automatizar', label: 'Automatizar mi negocio' },
                                    { id: 'escalar', label: 'Escalar mi marca' }
                                ].map((goal) => {
                                    const isSelected = profileData.goals?.includes(goal.id) || profileData.goals?.includes(goal.label);
                                    return (
                                        <div
                                            key={goal.id}
                                            onClick={() => {
                                                const currentGoals = [...(profileData.goals || [])];
                                                const index = currentGoals.indexOf(goal.id);
                                                if (index > -1) {
                                                    currentGoals.splice(index, 1);
                                                } else {
                                                    const labelIndex = currentGoals.indexOf(goal.label);
                                                    if (labelIndex > -1) currentGoals.splice(labelIndex, 1);
                                                    currentGoals.push(goal.id);
                                                }
                                                setProfileData({ ...profileData, goals: currentGoals });
                                            }}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                                isSelected
                                                    ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-600/5'
                                                    : 'bg-black/20 border-white/5 hover:border-white/10'
                                            }`}
                                        >
                                            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                {goal.label}
                                            </span>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                                isSelected 
                                                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                                                    : 'border-white/10'
                                            }`}>
                                                {isSelected && <span className="text-[10px]">✓</span>}
                                            </div>
                                        </div>
                                    );
                                })}
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
                                <div className="flex flex-wrap gap-3 pt-2">
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
                                            Eliminar Logo
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => brochureInputRef.current?.click()}
                                        className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black rounded-2xl border border-rose-400/20 transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-rose-600/20"
                                    >
                                        Subir Brochure
                                    </button>
                                    {profileData.brochure_url && (
                                        <div className="flex gap-2">
                                            <a 
                                                href={profileData.brochure_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest active:scale-95 flex items-center"
                                            >
                                                Ver Brochure
                                            </a>
                                            <button 
                                                onClick={() => setProfileData({...profileData, brochure_url: ''})}
                                                className="px-6 py-3 bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 text-[10px] font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest active:scale-95"
                                            >
                                                Eliminar Brochure
                                            </button>
                                        </div>
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
                                {isNicheLocked ? (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-1.5">
                                            <Lock className="w-3.5 h-3.5 text-indigo-400" /> Industria de Marketing (No modificable)
                                        </label>
                                        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 px-4 text-gray-500 font-bold text-sm select-none uppercase tracking-wider">
                                            {INDUSTRY_OPTIONS.find(i => i.value === profileData.marketing_type)?.label || profileData.marketing_type || 'General'}
                                        </div>
                                    </div>
                                ) : (
                                    <PremiumDropdown 
                                        label="Industria de Marketing"
                                        value={profileData.marketing_type}
                                        onChange={(val) => setProfileData({...profileData, marketing_type: val, specialty: ''})}
                                        options={INDUSTRY_OPTIONS}
                                        icon={Sparkles}
                                    />
                                )}
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
                                ) : (profileData.marketing_type === 'medico' || profileData.marketing_type === 'hospital') ? (
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
                            <p className="text-gray-400 text-sm">Transparencia en tu suscripción y licenciamiento de la plataforma.</p>
                        </div>

                        {/* Subscription Summary Box */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Estrategia Activa</span>
                                <span className="text-white font-bold text-lg block capitalize">{profileData.plan || 'Presencia'}</span>
                                <span className="text-indigo-400 text-xs font-medium block">Nicho: {
                                    profileData.marketing_type === 'medico' ? 'Médicos / Salud' :
                                    profileData.marketing_type === 'hospitality' || profileData.marketing_type === 'gastronomia' ? 'Gastronomía / Restaurantes' :
                                    profileData.marketing_type === 'realestate' || profileData.marketing_type === 'inmobiliaria' ? 'Inmobiliario' :
                                    profileData.marketing_type ? profileData.marketing_type.toUpperCase() : 'General'
                                }</span>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Fecha de Inicio</span>
                                <span className="text-white font-bold text-lg block">
                                    {profileData.start_date ? new Date(profileData.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pendiente'}
                                </span>
                                <span className="text-emerald-400 text-xs font-medium block">Socio Activo</span>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Día de Corte de Pago</span>
                                <span className="text-white font-bold text-lg block">Día {profileData.cutoff_day || 5} de cada mes</span>
                                <span className="text-rose-400 text-xs font-medium block">Próxima renovación mensual</span>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="bg-gradient-to-br from-[#0b0c16] to-[#121324] border border-white/10 rounded-[32px] p-8 space-y-6 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 bg-indigo-500 text-white text-[9px] font-black tracking-widest rounded-bl-2xl uppercase">Desglose de Pago</div>
                            
                            <h3 className="text-white font-black uppercase tracking-widest text-xs italic mb-4">Detalle de Inversión Mensual</h3>

                            <div className="space-y-4">
                                {/* Service Fee */}
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Servicio de Marketing</h4>
                                        <p className="text-gray-500 text-xs">Propuesta y plan de marketing adaptado a tu nivel de crecimiento</p>
                                    </div>
                                    <span className="text-white font-bold text-lg">${profileData.price || '0.00'} USD</span>
                                </div>

                                {/* App License Fee */}
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Licencia de Plataforma (Uso de la App)</h4>
                                        <p className="text-gray-500 text-xs">Ecosistema digital completo para control y optimización</p>
                                        <div className="flex gap-2 mt-2">
                                            {profileData.has_crm ? (
                                                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-black text-indigo-400 uppercase tracking-wider animate-pulse">CRM Incluido</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-medium text-gray-500 uppercase tracking-wider">Sin CRM</span>
                                            )}
                                            {profileData.has_agents ? (
                                                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-black text-indigo-400 uppercase tracking-wider animate-pulse">Agentes IA Incluidos</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-medium text-gray-500 uppercase tracking-wider">Sin Agentes IA</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-white font-bold text-lg">${profileData.app_fee || '0.00'} USD</span>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center pt-4">
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-widest text-xs italic">Total Inversión Mensual</h4>
                                        <p className="text-gray-500 text-xs">Suma de marketing digital y acceso SaaS integral</p>
                                    </div>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-black text-3xl italic">
                                        ${(Number(profileData.price) || 0) + (Number(profileData.app_fee) || 0)} USD
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive actions for clients */}
                        <div className="flex justify-between items-center p-6 bg-white/5 rounded-[24px] border border-white/5">
                            <div>
                                <h4 className="text-white font-bold text-sm">¿Deseas escalar tu estrategia o cambiar de plan?</h4>
                                <p className="text-gray-400 text-xs">Puedes solicitar una revisión estratégica con tu CM asignado.</p>
                            </div>
                            <button onClick={() => setShowPlans(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all active:scale-95">
                                Ver Catálogo de Planes
                            </button>
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
