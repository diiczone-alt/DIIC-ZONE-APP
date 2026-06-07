'use client';

import { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin,
    Briefcase, Award, GraduationCap,
    TrendingUp, DollarSign, Calendar, Star,
    Edit3, Save, X, Upload, CheckCircle2, Loader2, AlertCircle,
    Link as LinkIcon, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LevelBadge, ReputationStats, LevelProgress } from '@/components/gamification/LevelComponents';
import WorkstationTopBar from '@/components/workstation/WorkstationTopBar';

// Sidebar Imports
import FilmmakerSidebar from '@/components/workstation/filmmaker/FilmmakerSidebar';
import EditorSidebar from '@/components/workstation/editor/EditorSidebar';
import DesignerSidebar from '@/components/workstation/designer/DesignerSidebar';
import CMSidebar from '@/components/workstation/community-manager/CMSidebar';
import AudioSidebar from '@/components/workstation/audio/AudioSidebar';
import PhotoSidebar from '@/components/workstation/photography/PhotoSidebar';
import PrintSidebar from '@/components/workstation/print/PrintSidebar';
import TalentSidebar from '@/components/workstation/talent/TalentSidebar';
import WebSidebar from '@/components/workstation/web/WebSidebar';
import EventSidebar from '@/components/workstation/events/EventSidebar';

const SidebarMap = {
    FILMMAKER: FilmmakerSidebar,
    EDITOR: EditorSidebar,
    DESIGNER: DesignerSidebar,
    DESIGN: DesignerSidebar,
    COMMUNITY: CMSidebar,
    CM: CMSidebar,
    AUDIO: AudioSidebar,
    PHOTO: PhotoSidebar,
    PHOTOGRAPHY: PhotoSidebar,
    PRINT: PrintSidebar,
    TALENT: TalentSidebar,
    WEB: WebSidebar,
    EVENT: EventSidebar,
    EVENTS: EventSidebar,
};

const promiseTimeout = (promise, ms) => {
    // Pass promise through directly to disable artificial database timeouts.
    return promise;
};

const getAgeAndBirthday = (birthday) => {
    if (!birthday) return { age: '--', formatted: 'No definido' };
    try {
        const [year, month, day] = birthday.split('-');
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        const formatted = birthDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        return { age: `${age}`, formatted };
    } catch (e) {
        return { age: '--', formatted: birthday };
    }
};

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [teamData, setTeamData] = useState(null);

    // Delete flow state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        role: '',
        location: '',
        whatsapp: '',
        cv_url: '',
        cv_summary: '',
        skills: [],
        birth_date: '',
        availability: 'full-time',
        specialty: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user === null) {
                router.push('/login');
                return;
            }
            if (!user) return;

            try {
                setLoading(true);
                setError(null);
                
                let activeProfile = null;
                let team = null;

                // 1. Fetch from profiles
                try {
                    const res = await promiseTimeout(
                        supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', user.id)
                            .single(),
                        2500
                    );
                    
                    if (res.error) {
                        console.warn('[Profile] Profiles fetch error, building fallback:', res.error);
                    } else {
                        activeProfile = res.data;
                    }
                } catch (timeoutErr) {
                    console.warn('[Profile] Profiles fetch timeout/exception, using offline fallback:', timeoutErr);
                }

                // If profiles query returned null or failed/timed out, build fallback profile
                if (!activeProfile) {
                    activeProfile = {
                        id: user.id,
                        full_name: user.full_name || user.user_metadata?.full_name || 'Dicson',
                        role: user.role || user.user_metadata?.role || 'FILMMAKER',
                        location: user.location || user.user_metadata?.location || '',
                        whatsapp: user.whatsapp || '',
                        cv_url: user.cv_url || '',
                        cv_summary: user.cv_summary || '',
                        skills: user.skills || [],
                        xp: user.xp || 0,
                        level: user.level || 1,
                        rank: user.rank || 'Talento en Ascenso'
                    };
                    
                    // Try to insert in background, don't block
                    supabase.from('profiles').insert(activeProfile).then(({ error }) => {
                        if (error) console.warn('[Profile] Background profile insert skipped:', error.message);
                    }).catch(e => console.warn('[Profile] Background profile insert exception skipped:', e));
                }

                // 2. Fetch from team (linked by team_id or email or name fallback)
                try {
                    if (user.email) {
                        const res = await promiseTimeout(
                            supabase
                                .from('team')
                                .select('*')
                                .ilike('email', user.email)
                                .maybeSingle(),
                            2500
                        );
                        team = res.data;
                    }

                    if (!team && activeProfile?.full_name) {
                        const res = await promiseTimeout(
                            supabase
                                .from('team')
                                .select('*')
                                .ilike('name', activeProfile.full_name)
                                .maybeSingle(),
                            2500
                        );
                        team = res.data;
                        
                        // Auto-link email if null on team card in cloud
                        if (team && !team.email && user.email) {
                            console.log(`[Profile] Auto-linking email ${user.email} to team card ${team.id}`);
                            supabase
                                .from('team')
                                .update({ email: user.email.toLowerCase() })
                                .eq('id', team.id)
                                .then(() => {
                                    team.email = user.email.toLowerCase();
                                    console.log('[Profile] Auto-linked email successfully.');
                                })
                                .catch(err => console.warn('[Profile] Auto-link email failed:', err));
                        }
                    }

                    // Auto-provision team card if still not found
                    if (!team && user.email) {
                        console.log('[Profile] Team record not found. Auto-provisioning team card...');
                        const newId = `TEAM-${Math.floor(1000 + Math.random() * 9000)}`;
                        const newTeamMember = {
                            id: newId,
                            email: user.email.toLowerCase(),
                            name: activeProfile.full_name || 'Nuevo Talento',
                            city: activeProfile.location || '',
                            whatsapp: activeProfile.whatsapp || '',
                            cv_url: activeProfile.cv_url || '',
                            cv_summary: activeProfile.cv_summary || '',
                            skills: activeProfile.skills || [],
                            birth_date: activeProfile.birth_date || null,
                            availability: 'full-time',
                            role: activeProfile.role || 'CREATIVE',
                            status: 'activo',
                            activetasks: 0,
                            salary: 0
                        };
                        const { data: insertedData, error: insertErr } = await promiseTimeout(
                            supabase
                                .from('team')
                                .insert(newTeamMember)
                                .select(),
                            3000
                        );
                        if (!insertErr && insertedData && insertedData.length > 0) {
                            team = insertedData[0];
                            console.log('[Profile] Auto-provisioned team card successfully:', team.id);
                        } else {
                            console.warn('[Profile] Auto-provision failed, using local model:', insertErr);
                            team = newTeamMember;
                        }
                    }
                } catch (teamErr) {
                    console.warn('[Profile] Team fetch/provision timeout/exception skipped:', teamErr);
                }

                setProfileData(activeProfile);
                setTeamData(team);
                
                // Sync Form
                setFormData({
                    full_name: activeProfile.full_name || user.full_name || user.user_metadata?.full_name || '',
                    role: activeProfile.role || (team?.role) || user.role || 'CREATIVE',
                    location: activeProfile.location || team?.city || user.location || user.user_metadata?.location || '',
                    whatsapp: activeProfile.whatsapp || team?.whatsapp || user.whatsapp || '',
                    cv_url: activeProfile.cv_url || team?.cv_url || user.cv_url || '',
                    cv_summary: activeProfile.cv_summary || team?.cv_summary || user.cv_summary || '',
                    skills: activeProfile.skills || team?.skills || user.skills || [],
                    birth_date: activeProfile.birth_date || team?.birth_date || user.birth_date || user.user_metadata?.birth_date || '',
                    availability: team?.availability || user.availability || 'full-time',
                    specialty: activeProfile.specialty || user.specialty || ''
                });

            } catch (err) {
                console.error('[Profile] Error in fetchProfile handler:', err);
                setError(err.message || 'Error al cargar perfil.');
                toast.error('Error al cargar perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, router]);

    useEffect(() => {
        // Safe timeout to prevent loading hang if auth state is undefined
        const safetyTimer = setTimeout(() => {
            if (loading) {
                console.warn('[Profile] Safety timeout triggered. Auth state might be stuck.');
                setError('No se pudo establecer la sesión del usuario o cargar los datos. Intenta iniciar sesión de nuevo.');
                setLoading(false);
            }
        }, 6000);

        return () => clearTimeout(safetyTimer);
    }, [loading]);

    const handleSave = async () => {
        try {
            setSaving(true);
            
            // 1. Update Profiles
            try {
                const { error: pUpdateError } = await promiseTimeout(
                    supabase
                        .from('profiles')
                        .update({
                            full_name: formData.full_name,
                            location: formData.location,
                            whatsapp: formData.whatsapp,
                            cv_url: formData.cv_url,
                            cv_summary: formData.cv_summary,
                            skills: formData.skills,
                            birth_date: formData.birth_date || null,
                            specialty: formData.specialty
                        })
                        .eq('id', user.id),
                    3000
                );
                if (pUpdateError) throw pUpdateError;
            } catch (pUpdateErr) {
                console.warn('[Profile] Profile database update failed, saving changes in browser localStorage:', pUpdateErr);
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('mock_db_profiles') || '[]';
                    let records = [];
                    try { records = JSON.parse(stored); } catch (e) {}
                    const idx = records.findIndex(r => r.id === user.id);
                    const updatedRec = {
                        id: user.id,
                        full_name: formData.full_name,
                        role: formData.role,
                        location: formData.location,
                        whatsapp: formData.whatsapp,
                        cv_url: formData.cv_url,
                        cv_summary: formData.cv_summary,
                        skills: formData.skills,
                        birth_date: formData.birth_date,
                        specialty: formData.specialty,
                        xp: profileData?.xp || 0,
                        level: profileData?.level || 1,
                        rank: profileData?.rank || 'Talento en Ascenso'
                    };
                    if (idx !== -1) {
                        records[idx] = { ...records[idx], ...updatedRec };
                    } else {
                        records.push(updatedRec);
                    }
                    localStorage.setItem('mock_db_profiles', JSON.stringify(records));
                }
                toast.info('Perfil actualizado localmente (Modo Offline).');
            }

            // 2. Update Team Table (HQ Synchronization)
            if (user.email) {
                try {
                    // Check if there is an existing team record matching this email or name
                    let existingTeam = null;
                    try {
                        const { data: teamByEmail } = await promiseTimeout(
                            supabase
                                .from('team')
                                .select('*')
                                .ilike('email', user.email)
                                .maybeSingle(),
                            2000
                        );
                        existingTeam = teamByEmail;

                        if (!existingTeam && formData.full_name) {
                            const { data: teamByName } = await promiseTimeout(
                                supabase
                                    .from('team')
                                    .select('*')
                                    .ilike('name', formData.full_name)
                                    .maybeSingle(),
                                2000
                            );
                            existingTeam = teamByName;
                        }
                    } catch (err) {
                        console.warn('[Profile] Error checking existing team record:', err);
                    }

                    const teamUpdateData = {
                        email: user.email.toLowerCase(),
                        name: formData.full_name,
                        city: formData.location,
                        whatsapp: formData.whatsapp,
                        cv_url: formData.cv_url,
                        cv_summary: formData.cv_summary,
                        skills: formData.skills,
                        birth_date: formData.birth_date || null,
                        availability: formData.availability
                    };

                    if (existingTeam?.id) {
                        // Update existing record to preserve ID and prevent duplicate conflicts
                        const { error: tUpdateError } = await promiseTimeout(
                            supabase
                                .from('team')
                                .update(teamUpdateData)
                                .eq('id', existingTeam.id),
                            3000
                        );
                        if (tUpdateError) {
                            console.warn('Sync update with Team table failed:', tUpdateError);
                        } else {
                            setTeamData({ ...existingTeam, ...teamUpdateData });
                        }
                    } else {
                        // Insert new record
                        const newId = `TEAM-${Math.floor(1000 + Math.random() * 9000)}`;
                        const newTeamMember = {
                            id: newId,
                            ...teamUpdateData,
                            status: 'activo',
                            activetasks: 0,
                            salary: 0
                        };
                        const { error: tInsertError } = await promiseTimeout(
                            supabase
                                .from('team')
                                .insert(newTeamMember),
                            3000
                        );
                        if (tInsertError) {
                            console.warn('Sync insert with Team table failed:', tInsertError);
                        } else {
                            setTeamData(newTeamMember);
                        }
                    }
                } catch (tSyncErr) {
                    console.warn('[Profile] Team sync exception skipped:', tSyncErr);
                }
            }

            // 3. Update Auth Metadata
            try {
                await promiseTimeout(
                    supabase.auth.updateUser({
                        data: {
                            full_name: formData.full_name,
                            location: formData.location
                        }
                    }),
                    3000
                );
            } catch (authErr) {
                console.warn('[Profile] Auth metadata update skipped/failed:', authErr);
            }

            toast.success('Perfil actualizado correctamente.');
            setIsEditing(false);
            // Refresh local state
            setProfileData(prev => ({ ...prev, ...formData }));
        } catch (err) {
            console.error('[Profile] Error saving:', err);
            toast.error('Falla al guardar cambios.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmEmail.toLowerCase() !== user?.email?.toLowerCase()) {
            toast.error("El correo no coincide");
            return;
        }

        setIsDeleting(true);
        console.log("[DeleteAccount] Initiating deletion flow for user:", user?.id, user?.email);
        try {
            console.log("[DeleteAccount] Calling RPC 'delete_own_user'...");
            const { data, error } = await supabase.rpc('delete_own_user');
            
            console.log("[DeleteAccount] RPC Response - Data:", data, "Error:", error);
            if (error) {
                console.error("[DeleteAccount] RPC error object:", JSON.stringify(error, null, 2));
                throw error;
            }

            console.log("[DeleteAccount] RPC successful. Clearing local storage and session...");
            toast.success("Cuenta eliminada con éxito");
            
            // Clear local session storage manually to prevent signOut() hangs on deleted session
            if (typeof window !== 'undefined') {
                localStorage.clear();
                // Clear GoTrue session in memory/cookies locally without calling GoTrue API
                try {
                    await supabase.auth.signOut({ scope: 'local' });
                } catch (signOutErr) {
                    console.warn("[DeleteAccount] Local signout warning:", signOutErr);
                }
            }

            console.log("[DeleteAccount] Redirecting to /login...");
            window.location.href = '/login';
        } catch (err) {
            console.error("[DeleteAccount] Exception caught:", err);
            toast.error(`No se pudo eliminar la cuenta: ${err.message || 'Error desconocido'}. Contacte al soporte.`);
        } finally {
            console.log("[DeleteAccount] Deletion flow finally block executed.");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#050511]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#050511] text-white p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold uppercase tracking-widest mb-2">Error de Sincronización</h1>
                <p className="text-sm text-gray-400 mb-6 max-w-md text-center">{error}</p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                    >
                        Reintentar
                    </button>
                    <button 
                        onClick={() => router.push('/workstation/filmmaker')}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    const SidebarComponent = SidebarMap[(profileData?.role || user?.role || '').toUpperCase()];

    return (
        <div className="flex h-screen bg-[#050511] text-white w-full">
            {SidebarComponent && <SidebarComponent />}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <WorkstationTopBar 
                    title="Mi Perfil Profesional" 
                    subtitle="Gestión de identidad y reputación" 
                    role={profileData?.role || 'Talento'} 
                />

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                
                {/* Profile Master Card */}
                <div className="bg-[#0E0E18] rounded-[2.5rem] p-10 border border-white/5 mb-8 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />

                    <div className="relative flex flex-col lg:flex-row gap-12 items-start">
                        {/* Avatar Section */}
                        <div className="relative shrink-0 group">
                            <div className="w-40 h-40 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-white/10 overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02]">
                                <img 
                                    src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4">
                                <LevelBadge level={profileData?.level || 1} />
                            </div>
                            {isEditing && (
                                <button className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]">
                                    <Upload className="w-6 h-6 text-white" />
                                </button>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    {isEditing ? (
                                        <input 
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                            className="text-4xl font-black text-white bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-indigo-500 outline-none w-full max-w-lg italic tracking-tighter"
                                            placeholder="Tu Nombre Completo"
                                        />
                                    ) : (
                                        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
                                            {formData.full_name || 'Sin Nombre'}
                                        </h1>
                                    )}
                                    <div className="flex items-center gap-3 flex-wrap pl-1 mt-1">
                                        <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">
                                            {formData.role} • {profileData?.rank || 'Talento en Ascenso'}
                                        </p>
                                        <button 
                                            onClick={() => {
                                                if (teamData?.id) {
                                                    navigator.clipboard.writeText(teamData.id);
                                                    toast.success("¡Identificador copiado al portapapeles!");
                                                } else {
                                                    toast.error("No hay un identificador vinculado para copiar.");
                                                }
                                            }}
                                            className={`text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-left ${
                                                teamData?.id 
                                                    ? 'text-gray-400 bg-white/5 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10' 
                                                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse'
                                            }`}
                                            title={teamData?.id ? "Haz clic para copiar tu ID" : "Pide al administrador vincular tu correo en el Panel HQ"}
                                        >
                                            <span>ID: {teamData?.id || 'Cargando identificador...'}</span>
                                            {teamData?.id && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button 
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-3 rounded-2xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" /> Cancelar
                                            </button>
                                            <button 
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Guardar Cambios
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="px-6 py-3 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center gap-2 group"
                                        >
                                            <Edit3 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" /> 
                                            Editar Perfil
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoItem 
                                    icon={<MapPin className="w-4 h-4" />} 
                                    label="Ubicación" 
                                    value={formData.location} 
                                    isEditing={isEditing}
                                    onChange={(v) => setFormData({...formData, location: v})}
                                />
                                <InfoItem 
                                    icon={<Mail className="w-4 h-4" />} 
                                    label="Email" 
                                    value={user?.email} 
                                    isEditing={false}
                                />
                                <InfoItem 
                                    icon={<Phone className="w-4 h-4" />} 
                                    label="WhatsApp" 
                                    value={formData.whatsapp} 
                                    isEditing={isEditing}
                                    onChange={(v) => setFormData({...formData, whatsapp: v})}
                                />
                            </div>

                            <div className="flex flex-col xl:flex-row gap-6 items-stretch justify-between pt-4 border-t border-white/5 w-full">
                                {/* Left: ReputationStats */}
                                <div className="shrink-0 flex items-center">
                                    <ReputationStats score={profileData?.xp || 0} rating={4.9} onTime={98} compact />
                                </div>

                                {/* Right: Key Info Grid */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {/* Fecha de Nacimiento / Edad Card */}
                                    <div className="bg-[#0E0E18] p-2 rounded-lg border border-white/5 flex flex-col justify-between text-center min-h-[64px]">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-center gap-1">
                                            <Calendar className="w-3 h-3 text-indigo-400" /> Nacimiento
                                        </p>
                                        {isEditing ? (
                                            <div className="mt-1">
                                                <input 
                                                    type="date"
                                                    value={formData.birth_date}
                                                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                                                    className="bg-black/40 border border-white/10 rounded-md px-2 py-0.5 text-[10px] text-white focus:border-indigo-500 outline-none font-mono w-full text-center"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mt-0.5">
                                                <div className="text-white font-black text-sm tracking-tight flex items-center justify-center gap-1.5">
                                                    🎂 {getAgeAndBirthday(formData.birth_date).age !== '--' ? `${getAgeAndBirthday(formData.birth_date).age} años` : '--'}
                                                </div>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">
                                                    {getAgeAndBirthday(formData.birth_date).formatted}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Especialidad Card */}
                                    <div className="bg-[#0E0E18] p-2 rounded-lg border border-white/5 flex flex-col justify-between text-center min-h-[64px]">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-center gap-1">
                                            <Award className="w-3 h-3 text-purple-400" /> Especialidad
                                        </p>
                                        {isEditing ? (
                                            <div className="mt-1">
                                                <input 
                                                    type="text"
                                                    value={formData.specialty}
                                                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                                    className="bg-black/40 border border-white/10 rounded-md px-2 py-0.5 text-[10px] text-white focus:border-indigo-500 outline-none font-bold w-full text-center"
                                                    placeholder="Ej. Editor Senior"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mt-0.5">
                                                <div className="text-white font-black text-xs tracking-tight truncate max-w-full px-1 py-0.5">
                                                    {formData.specialty || 'Generalista Creativo'}
                                                </div>
                                                <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.2em] mt-0.5">
                                                    Enfoque Principal
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Disponibilidad Card */}
                                    <div className="bg-[#0E0E18] p-2 rounded-lg border border-white/5 flex flex-col justify-between text-center min-h-[64px]">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-center gap-1">
                                            <Briefcase className="w-3 h-3 text-emerald-400" /> Disponibilidad
                                        </p>
                                        {isEditing ? (
                                            <div className="mt-1">
                                                <select 
                                                    value={formData.availability}
                                                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                                                    className="bg-black/40 border border-white/10 rounded-md px-1.5 py-0.5 text-[10px] text-white focus:border-indigo-500 outline-none font-bold w-full text-center cursor-pointer"
                                                >
                                                    <option value="full-time">Tiempo Completo</option>
                                                    <option value="part-time">Media Jornada</option>
                                                    <option value="freelance">Freelance</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="mt-0.5 flex flex-col items-center justify-center">
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mt-0.5 bg-white/5">
                                                    {formData.availability === 'full-time' && (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-emerald-400">Jornada Completa</span>
                                                        </>
                                                    )}
                                                    {formData.availability === 'part-time' && (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                            <span className="text-amber-400">Media Jornada</span>
                                                        </>
                                                    )}
                                                    {formData.availability === 'freelance' && (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                            <span className="text-blue-400">Freelance</span>
                                                        </>
                                                    )}
                                                    {!formData.availability && (
                                                        <span className="text-gray-500">No especificada</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                    
                    {/* CV & Summary */}
                    <div className="space-y-8">
                        <div className="bg-[#0E0E18] rounded-[2rem] p-8 border border-white/5 h-full">
                            <h2 className="text-xs font-black text-white/50 mb-8 flex items-center gap-3 uppercase tracking-widest">
                                <Briefcase className="w-4 h-4" /> Trayectoria y CV
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Resumen Profesional</label>
                                    {isEditing ? (
                                        <textarea 
                                            value={formData.cv_summary}
                                            onChange={(e) => setFormData({...formData, cv_summary: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-indigo-500 outline-none min-h-[120px]"
                                            placeholder="Cuenta brevemente tu experiencia..."
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-400 leading-relaxed italic">
                                            {formData.cv_summary || 'Sin resumen profesional definido.'}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Link al CV (PDF/Drive)</label>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <input 
                                                value={formData.cv_url}
                                                onChange={(e) => setFormData({...formData, cv_url: e.target.value})}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-indigo-500 outline-none"
                                                placeholder="https://drive.google.com/..."
                                            />
                                            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400">
                                                <Upload className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        formData.cv_url ? (
                                            <a 
                                                href={formData.cv_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 transition-all group"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Ver Curriculum Vitae</span>
                                                <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ) : (
                                            <div className="p-4 rounded-2xl border border-dashed border-white/5 text-gray-700 text-center text-[10px] font-black uppercase tracking-widest">
                                                CV No Vinculado
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress & Goals */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0E0E18] rounded-[2rem] p-8 border border-white/5">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-xs font-black text-white/50 flex items-center gap-3 uppercase tracking-widest">
                                    <TrendingUp className="w-4 h-4" /> Evolución de Rango
                                </h2>
                                <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-tighter italic">Próximo: Senior Master</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <LevelProgress 
                                        currentPoints={profileData?.xp || 0} 
                                        nextLevelPoints={(profileData?.level || 1) * 2000} 
                                        nextLevelLabel={`Nivel ${(profileData?.level || 1) + 1}`} 
                                    />
                                    <p className="mt-4 text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                        Faltan {((profileData?.level || 1) * 2000) - (profileData?.xp || 0)} XP para el siguiente multiplicador de tarifa.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Checklist de Ascenso</h4>
                                    <TaskCheck label="15 Proyectos Finalizados" done={true} />
                                    <TaskCheck label="Rating Promedio > 4.8" done={true} />
                                    <TaskCheck label="Curso Academia: 'Workflow Pro'" done={false} />
                                    <TaskCheck label="Certificación Color Grading" done={false} />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <div className="bg-[#0E0E18] rounded-[2rem] p-8 border border-white/5">
                             <h2 className="text-xs font-black text-white/50 mb-8 flex items-center gap-3 uppercase tracking-widest">
                                <Calendar className="w-4 h-4" /> Actividad Reciente
                            </h2>
                            <div className="space-y-4">
                                <ActivityRow label="Entrega de 'Campaña Mayo'" date="Ayer" status="completed" />
                                <ActivityRow label="Feedback de Estratega recibido" date="Hace 2 días" status="info" />
                                <ActivityRow label="Pago quincenal procesado" date="01 Mayo" status="success" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Danger Zone */}
                <div className="bg-red-950/10 border border-red-900/30 rounded-[2rem] p-8 space-y-6 mb-8 max-w-7xl">
                    <h3 className="text-lg font-black text-red-500 uppercase italic tracking-tighter flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Zona de Peligro
                    </h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                        Si decides eliminar tu cuenta, todos tus registros de autenticación, tu expediente de talento y tu vinculación con la agencia DIIC ZONE serán destruidos permanentemente de forma irreversible.
                    </p>
                    <div className="flex">
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="px-6 py-3.5 bg-red-600/10 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                            Eliminar Cuenta Permanentemente
                        </button>
                    </div>
                </div>

                </div>
            </main>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowDeleteModal(false)} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-lg bg-[#0E0E18] border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl z-10 text-center space-y-8"
                        >
                            <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
                                <AlertTriangle className="w-10 h-10" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">¿CONFIRMAR ELIMINACIÓN?</h3>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                    Esta acción eliminará permanentemente tu acceso de autenticación y todos tus expedientes. Escribe tu correo electrónico para proceder:
                                    <br />
                                    <strong className="text-red-400 font-bold block mt-2 select-all">{user?.email}</strong>
                                </p>
                            </div>

                            <input 
                                type="text"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white text-center text-sm outline-none focus:border-red-500/50 transition-all font-mono"
                                placeholder="Escribe tu correo aquí..."
                            />

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-4 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleDeleteAccount}
                                    disabled={confirmEmail.toLowerCase() !== user?.email?.toLowerCase() || isDeleting}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        confirmEmail.toLowerCase() === user?.email?.toLowerCase() && !isDeleting
                                        ? 'bg-red-600 text-white hover:scale-105 shadow-lg shadow-red-600/20'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                    }`}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar Permanentemente'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoItem({ icon, label, value, isEditing, onChange }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 group hover:border-white/10 transition-all">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
                {icon} {label}
            </p>
            {isEditing ? (
                <input 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none font-bold"
                />
            ) : (
                <p className="text-sm font-bold text-white/90 truncate">{value || 'No definido'}</p>
            )}
        </div>
    );
}

function TaskCheck({ label, done }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${done ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 bg-white/5'}`}>
                {done && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tight ${done ? 'text-white' : 'text-gray-600'}`}>{label}</span>
        </div>
    );
}

function ActivityRow({ label, date, status }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-indigo-500' : status === 'success' ? 'bg-emerald-500' : 'bg-blue-400'}`} />
                <span className="text-xs font-bold text-white/80">{label}</span>
            </div>
            <span className="text-[9px] font-black text-gray-600 uppercase">{date}</span>
        </div>
    );
}

function ArrowUpRight({ className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>;
}
