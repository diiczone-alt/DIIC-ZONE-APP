'use client';

import { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin,
    Briefcase, Award, GraduationCap,
    TrendingUp, DollarSign, Calendar, Star,
    Edit3, Save, X, Upload, CheckCircle2, Loader2,
    Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { LevelBadge, ReputationStats, LevelProgress } from '@/components/gamification/LevelComponents';
import WorkstationTopBar from '@/components/workstation/WorkstationTopBar';

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [teamData, setTeamData] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        role: '',
        location: '',
        whatsapp: '',
        cv_url: '',
        cv_summary: '',
        skills: []
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                setLoading(true);
                
                // 1. Fetch from profiles
                const { data: profile, error: pError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (pError) throw pError;

                // 2. Fetch from team (linked by team_id or email)
                const { data: team, error: tError } = await supabase
                    .from('team')
                    .select('*')
                    .eq('email', user.email)
                    .maybeSingle();

                setProfileData(profile);
                setTeamData(team);
                
                // Sync Form
                setFormData({
                    full_name: profile.full_name || user.user_metadata?.full_name || '',
                    role: profile.role || (team?.role) || 'CREATIVE',
                    location: profile.location || team?.city || '',
                    whatsapp: profile.whatsapp || team?.whatsapp || '',
                    cv_url: profile.cv_url || team?.cv_url || '',
                    cv_summary: profile.cv_summary || team?.cv_summary || '',
                    skills: profile.skills || team?.skills || []
                });

            } catch (err) {
                console.error('[Profile] Error fetching data:', err);
                toast.error('Error al cargar perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        try {
            setSaving(true);
            
            // 1. Update Profiles
            const { error: pUpdateError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    location: formData.location,
                    whatsapp: formData.whatsapp,
                    cv_url: formData.cv_url,
                    cv_summary: formData.cv_summary,
                    skills: formData.skills
                })
                .eq('id', user.id);

            if (pUpdateError) throw pUpdateError;

            // 2. Update Team Table (HQ Synchronization)
            if (teamData?.id || user.email) {
                const { error: tUpdateError } = await supabase
                    .from('team')
                    .upsert({
                        email: user.email,
                        name: formData.full_name,
                        city: formData.location,
                        whatsapp: formData.whatsapp,
                        cv_url: formData.cv_url,
                        cv_summary: formData.cv_summary,
                        skills: formData.skills
                    }, { onConflict: 'email' });
                
                if (tUpdateError) console.warn('Sync with Team table failed:', tUpdateError);
            }

            // 3. Update Auth Metadata
            await supabase.auth.updateUser({
                data: {
                    full_name: formData.full_name,
                    location: formData.location
                }
            });

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

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
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
                                    <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] pl-1">
                                        {formData.role} • {profileData?.rank || 'Talento en Ascenso'}
                                    </p>
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

                            <div className="flex gap-4 items-center pt-4 border-t border-white/5">
                                <ReputationStats score={profileData?.xp || 0} rating={4.9} onTime={98} compact />
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
            </div>
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
