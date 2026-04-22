'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Shield, Star, Zap, 
    MoreHorizontal, UserPlus, Phone, 
    Mail, Briefcase, Award, Cpu,
    Activity, Layout, LayoutGrid, Plus, Check, X,
    ChevronRight, Target, Flame, Database,
    ChevronDown, Trash2, Edit, MessageSquare, Globe, ListTodo,
    MapPin, DollarSign, FileText,
    Video, Clapperboard, Palette, Mic, Camera, User, Printer, Ticket, Monitor,
    Copy
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';
import { isCloudConnected, supabase } from '@/lib/supabase';
import PremiumDropdown from '@/components/shared/PremiumDropdown';
import { ECUADOR_CITIES } from '@/lib/constants';
import SquadCanvasBoard from '@/components/team/SquadCanvasBoard';
import useRealtimeSync from '@/hooks/useRealtimeSync';

export default function HQTeamPage() {
    const [team, setTeam] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('squads');
    const [selectedMember, setSelectedMember] = useState(null);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        role: 'Editor de Video',
        email: '',
        whatsapp: '',
        city: 'Quito',
        salary: 0
    });

    const isHQLive = useRealtimeSync(['team', 'clients'], () => fetchData(true));

    const openAudit = (member) => {
        setSelectedMember(member);
        setIsAuditOpen(true);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await agencyService.createTeamMember(newMember);
            const updatedTeam = await agencyService.getTeam();
            setTeam(updatedTeam);
            setIsAddModalOpen(false);
            setNewMember({ 
                name: '', 
                role: 'Editor de Video', 
                email: '', 
                whatsapp: '', 
                city: 'Quito', 
                salary: 0 
            });
            toast.success("Talento Vinculado");
        } catch (error) {
            console.error("Error creating member:", error);
            toast.error("Error al registrar");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        try {
            console.log(`🚀 [HQ-Team] ${isBackground ? 'Background' : 'Initial'} DB Syncing...`);
            const [teamData, clientData] = await Promise.all([
                agencyService.getTeam(),
                agencyService.getClients()
            ]);
            
            setTeam(teamData || []);
            setClients(clientData || []);
        } catch (error) {
            console.error("❌ [HQ-Team] Critical Sync Failed:", error);
            if (!isBackground) toast.error("Fallo de conexión con la Central HQ");
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        // 1. Instant Load from Cache
        const loadCache = () => {
            try {
                const cachedTeam = localStorage.getItem('diic_team');
                const cachedClients = localStorage.getItem('diic_clients');
                
                if (cachedTeam && cachedClients) {
                    setTeam(JSON.parse(cachedTeam));
                    setClients(JSON.parse(cachedClients));
                    setLoading(false); // Immediate unlock
                    console.log("⚡ [HQ-Team] Loaded from Cache");
                    return true;
                }
            } catch (e) {
                console.warn("⚠️ [HQ-Team] Cache load failed");
            }
            return false;
        };

        const hasCache = loadCache();
        
        // 2. Background Re-fetch
        fetchData(hasCache);

        // 3. Auto-Revalidate on Window Focus
        const handleFocus = () => {
            console.log("📡 [HQ-Team] Re-fetching on Focus...");
            fetchData(true);
        };
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const getDepartments = () => {
        return [
            { id: 'estrategia', label: 'Estrategas', icon: Shield, color: 'from-amber-500 to-orange-600', members: team.filter(m => m.role?.toLowerCase().includes('estratega')) },
            { id: 'cms', label: 'Community Managers', icon: Users, color: 'from-indigo-500 to-blue-600', members: team.filter(m => m.role?.toLowerCase().includes('community manager')) },
            { id: 'diseno', label: 'Diseño Gráfico', icon: Palette, color: 'from-pink-500 to-rose-600', members: team.filter(m => m.role?.toLowerCase().includes('diseña')) },
            { id: 'edicion', label: 'Edición de Video', icon: Video, color: 'from-purple-500 to-indigo-600', members: team.filter(m => m.role?.toLowerCase().includes('editor')) },
            { id: 'film', label: 'Filmmakers', icon: Clapperboard, color: 'from-orange-500 to-red-600', members: team.filter(m => m.role?.toLowerCase().includes('film')) },
            { id: 'foto', label: 'Fotografía', icon: Camera, color: 'from-amber-400 to-orange-500', members: team.filter(m => m.role?.toLowerCase().includes('foto')) },
            { id: 'audio', label: 'Ingeniería de Audio', icon: Mic, color: 'from-emerald-400 to-teal-500', members: team.filter(m => m.role?.toLowerCase().includes('audio')) },
            { id: 'web', label: 'Desarrollo Web', icon: Globe, color: 'from-blue-500 to-cyan-600', members: team.filter(m => m.role?.toLowerCase().includes('web') || m.role?.toLowerCase().includes('programador')) },
            { id: 'modelos', label: 'Modelos', icon: User, color: 'from-fuchsia-500 to-pink-600', members: team.filter(m => m.role?.toLowerCase().includes('modelo')) },
            { id: 'imprenta', label: 'Imprenta / Merch', icon: Printer, color: 'from-slate-500 to-slate-700', members: team.filter(m => m.role?.toLowerCase().includes('imprenta') || m.role?.toLowerCase().includes('merch')) },
            { id: 'eventos', label: 'Eventos / Prod', icon: Ticket, color: 'from-indigo-400 to-purple-500', members: team.filter(m => m.role?.toLowerCase().includes('evento')) }
        ];
    };

    const getHierarchicalPods = () => {
        // Tier 1: Estrategas (Maestría Operativa)
        const strategists = team.filter(m => m.role?.toLowerCase().includes('estratega'));
        
        // Tier 2: CMs Independientes (Sin estratega aún)
        const independentCMs = team.filter(m => 
            (m.role?.toLowerCase().includes('community manager')) && 
            !strategists.some(s => m.squad_lead_id === s.id)
        );

        const pods = strategists.map(estratega => {
            const assignedCMs = team.filter(m => 
                m.squad_lead_id === estratega.id && 
                m.role?.toLowerCase().includes('community manager')
            );
            
            return {
                id: estratega.id,
                level: 1,
                label: `Frente Estratégico: ${estratega.name.split(' ')[0]}`,
                lead: estratega,
                color: 'from-amber-500 to-orange-600',
                cms: assignedCMs.map(cm => ({
                    ...cm,
                    creativeTeam: team.filter(m => m.squad_lead_id === cm.id)
                }))
            };
        });

        const rootPods = independentCMs.map(cm => ({
            id: cm.id,
            level: 2,
            label: `Unidad Autónoma: ${cm.name.split(' ')[0]}`,
            lead: cm,
            color: 'from-indigo-600 to-purple-800',
            creativeTeam: team.filter(m => m.squad_lead_id === cm.id)
        }));

        return [...pods, ...rootPods];
    };

    const HierarchicalPod = ({ pod }) => {
        const isStrategist = pod.level === 1;
        const saturation = isStrategist 
            ? (pod.cms.length / 7) * 100 
            : 0; // Saturación de CMs liderados

        return (
            <div className="space-y-12">
                <div className="flex items-center gap-6">
                    <div className={`p-5 bg-gradient-to-br ${pod.color} rounded-[2rem] text-white shadow-2xl ring-4 ring-white/5`}>
                        {isStrategist ? <Shield className="w-10 h-10" /> : <Flame className="w-8 h-8" />}
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-2xl">
                            {pod.label}
                        </h2>
                        <div className="flex items-center gap-6 mt-3">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                                Comando Central: {pod.lead.name}
                            </div>
                            {isStrategist && (
                                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Capacidad CMs:</span>
                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full ${saturation > 80 ? 'bg-rose-500' : 'bg-emerald-500'} transition-all`} style={{ width: `${saturation}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-white">{pod.cms.length}/7</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {isStrategist ? (
                    <div className="space-y-20 pl-12 border-l-2 border-dashed border-white/5">
                        {pod.cms.map(cm => (
                            <div key={cm.id} className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-px bg-white/10" />
                                    <h3 className="text-xl font-black text-indigo-400 uppercase italic tracking-tighter">Unidad CM: {cm.name}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                    <TeamMemberCard member={cm} team={team} allClients={clients} variant="lead" onAudit={() => openAudit(cm)} />
                                    {cm.creativeTeam.map(creative => (
                                        <TeamMemberCard key={creative.id} member={creative} team={team} allClients={clients} onAudit={() => openAudit(creative)} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <TeamMemberCard member={pod.lead} team={team} allClients={clients} variant="lead" onAudit={() => openAudit(pod.lead)} />
                        {pod.creativeTeam.map(creative => (
                            <TeamMemberCard key={creative.id} member={creative} team={team} allClients={clients} onAudit={() => openAudit(creative)} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-8 space-y-16 min-h-screen bg-[#05050A]">
            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <div className="flex items-center gap-6 mb-2">
                        <h1 className="text-6xl font-black text-white uppercase tracking-tighter italic">ZONA <span className="text-indigo-500">CREATIVA</span></h1>
                        <div className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-500 ${isHQLive ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/20 animate-pulse'}`}>
                            <div className={`w-2 h-2 rounded-full ${isHQLive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-red-500'}`} />
                            <span className={`text-[10px] font-black tracking-widest uppercase ${isHQLive ? 'text-emerald-500' : 'text-red-500'}`}>HQ {isHQLive ? 'LIVE' : 'OFFLINE'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <p className="text-gray-400 font-bold uppercase text-[12px] tracking-[0.5em] flex items-center gap-2">
                            <Target className="w-4 h-4 text-pink-500" /> Operational Mastery — HQ Dashboard 2026
                        </p>
                        {isSyncing && (
                            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Activity className="w-3 h-3 text-indigo-400" />
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Central Sync</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 h-fit">
                        <button onClick={() => setViewMode('squads')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'squads' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Escuadrones</button>
                        <button onClick={() => setViewMode('departments')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'departments' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Departamentos</button>
                    </div>
                    <InviteButton label="Invitación para Equipo" type="creative" color="indigo" icon={UserPlus} />
                </div>
            </div>

            {loading && team.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                    <Database className="w-12 h-12 text-indigo-500 mb-6 opacity-50" />
                    <div className="text-white text-center uppercase tracking-[0.5em] font-black text-sm">Sincronizando Mando Central...</div>
                    <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-[0.2em]">Conectando con la base de datos de producción</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div key={viewMode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32 pb-40">
                        {viewMode === 'squads' ? (
                            <SquadCanvasBoard team={team} allClients={clients} onAudit={openAudit} refreshTeam={() => fetchData(true)} />
                        ) : (
                            getDepartments().map((dept) => dept.members.length > 0 && (
                                <div key={dept.id} className="space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 bg-gradient-to-br ${dept.color} rounded-3xl text-white shadow-lg`}><dept.icon className="w-8 h-8" /></div>
                                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{dept.label}</h2>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                        {dept.members.map((member) => (
                                            <TeamMemberCard key={member.id} member={member} team={team} allClients={clients} onAudit={() => openAudit(member)} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Modals */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddMemberModal 
                        newMember={newMember}
                        setNewMember={setNewMember}
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={handleAddMember}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAuditOpen && selectedMember && (
                    <TeamAuditModal 
                        member={selectedMember} 
                        team={team}
                        allClients={clients}
                        onClose={() => setIsAuditOpen(false)} 
                        onSave={() => fetchData()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TeamMemberCard({ member, team = [], allClients = [], variant = 'normal', onAudit }) {
    if (!member) return null;
    const isCM = (member.role || '').toLowerCase().includes('community manager');
    const isEstratega = (member.role || '').toLowerCase().includes('estratega');
    
    // Filter brands assigned to this member
    const assignedBrands = allClients.filter(c => 
        c.cm === member.name || 
        c.editor === member.name || 
        c.filmmaker === member.name
    );

    // Saturation logic for CMs (max 6 brands)
    const brandSaturation = isCM ? (assignedBrands.length / 6) * 100 : 0;
    const isOverloaded = isCM && assignedBrands.length > 5;

    // If lead, find squad members
    const squadMembers = variant === 'lead' ? team.filter(m => m.squad_lead_id === member.id) : [];
    
    // Internal summary tags
    const skills = member.skills || (isCM ? ['Estrategia', 'Gestión', 'Brands'] : ['VFX', 'Edición', 'Ritmo']);

    return (
        <motion.div 
            whileHover={{ y: -8, scale: 1.01 }} 
            className={`relative w-full h-auto min-h-[540px] max-w-[310px] mx-auto bg-white/[0.02] backdrop-blur-3xl border ${isEstratega ? 'border-amber-500/30' : 'border-white/10'} rounded-[3rem] p-6 flex flex-col shadow-2xl group overflow-hidden`}
        >
            {/* Premium Glass Accents */}
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-${isEstratega ? 'amber' : 'white'}/20 to-transparent`} />
            <div className={`absolute -top-24 -right-24 w-48 h-48 ${isEstratega ? 'bg-amber-500/10' : 'bg-indigo-500/10'} blur-[90px] rounded-full group-hover:opacity-100 transition-all duration-1000`} />
            
            {/* Identity Header */}
            <div className="flex flex-col items-center mb-8 pt-4">
                <div className="relative mb-5">
                    <div className={`absolute inset-0 ${isEstratega ? 'bg-amber-500/30' : 'bg-indigo-500/30'} blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150`} />
                    <div className={`w-20 h-20 rounded-[1.8rem] bg-gradient-to-tr ${isEstratega ? 'from-amber-600 to-orange-600' : 'from-indigo-600 to-purple-600'} p-0.5 shadow-2xl relative z-10 transition-transform duration-500 group-hover:rotate-6`}>
                        <div className="w-full h-full rounded-[1.7rem] bg-[#050510] flex items-center justify-center text-3xl font-black text-white italic tracking-tighter shadow-inner">
                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors duration-500">
                        {member.name ? member.name.split(' ')[0] : 'Talento'}
                    </h3>
                    <p className={`text-[8px] font-black ${isEstratega ? 'text-amber-500' : 'text-gray-500'} uppercase tracking-[0.4em] mt-2 bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block`}>{member.role}</p>
                </div>
            </div>

            {/* Saturation Bar for CMs */}
            {isCM && (
                <div className="mb-6 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">Carga de Marcas</span>
                        <span className={`text-[10px] font-black ${isOverloaded ? 'text-rose-500' : 'text-emerald-500'}`}>{assignedBrands.length}/6</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={`h-full transition-all duration-1000 ${isOverloaded ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(brandSaturation, 100)}%` }} 
                        />
                    </div>
                </div>
            )}

            {/* Statistics Row (Image 2 style) */}
            <div className="grid grid-cols-3 gap-2 mb-8 relative z-10">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center group-hover:border-indigo-500/20 transition-all">
                    <p className="text-[7px] font-black text-indigo-400/50 uppercase tracking-widest mb-1.5 italic font-mono">Brands</p>
                    <div className="flex items-center justify-center gap-1.5">
                        <Activity className="w-2.5 h-2.5 text-indigo-400" />
                        <span className="text-xs font-black text-white">{assignedBrands.length}</span>
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center group-hover:border-purple-500/20 transition-all">
                    <p className="text-[7px] font-black text-purple-400/50 uppercase tracking-widest mb-1.5 italic font-mono">Squad</p>
                    <div className="flex items-center justify-center gap-1.5">
                        <Shield className="w-2.5 h-2.5 text-purple-400" />
                        <span className="text-xs font-black text-white">{variant === 'lead' ? squadMembers.length : 'OK'}</span>
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center group-hover:border-emerald-500/20 transition-all">
                    <p className="text-[7px] font-black text-emerald-400/50 uppercase tracking-widest mb-1.5 italic font-mono">Status</p>
                    <div className="flex items-center justify-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,1)]" />
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">ACT</span>
                    </div>
                </div>
            </div>

            {/* Internal Summary (6-Box Grid) */}
            <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center justify-between px-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Resumen Interno</p>
                    <Database className="w-2 h-2 text-gray-600" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <MapPin className="w-2.5 h-2.5 text-indigo-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Sede</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{member.city || '---'}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Sueldo</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">${member.salary || '0'}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <Globe className="w-2.5 h-2.5 text-blue-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Marcas</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{assignedBrands.length}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <Zap className="w-2.5 h-2.5 text-yellow-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Skills</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{skills.length}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <MessageSquare className="w-2.5 h-2.5 text-pink-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">WhatsApp</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{member.whatsapp ? 'REG' : '---'}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <FileText className="w-2.5 h-2.5 text-indigo-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Expediente</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{member.cv_url ? 'CV' : '---'}</span>
                    </div>
                </div>
            </div>

            {/* Tactical Action */}
            <button 
                onClick={onAudit}
                className="w-full py-4 rounded-2xl bg-white/[0.03] hover:bg-indigo-600 border border-white/5 hover:border-indigo-400 text-gray-500 hover:text-white font-black uppercase text-[8px] tracking-[0.4em] transition-all duration-500 shadow-xl"
            >
                Detalles Operativos
            </button>
        </motion.div>
    );
}

function TeamAuditModal({ member, team = [], allClients = [], onClose, onSave }) {
    const router = require('next/navigation').useRouter();
    const [formData, setFormData] = useState({ ...member });
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('perfil');
    const [activeTasks, setActiveTasks] = useState([]);
    const [skillsInput, setSkillsInput] = useState(Array.isArray(member.skills) ? member.skills.join(', ') : '');
    
    const eligibleLeaders = team.filter(m => (
        (m.role || '').toLowerCase().includes('estratega') || 
        (m.role || '').toLowerCase().includes('community manager')
    ) && m.id !== member.id);
    
    const isEstratega = (member.role || '').toLowerCase().includes('estratega');
    const assignedBrands = allClients.filter(c => c.cm === member.name || c.editor === member.name || c.filmmaker === member.name);
    const squadMembers = team.filter(m => m.squad_lead_id === member.id);

    useEffect(() => {
        const loadData = async () => {
            const tasks = await agencyService.getTasksByMember(member.name);
            setActiveTasks(tasks);
        };
        loadData();
    }, [member.name]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedSkills = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
            const finalData = { ...formData, skills: updatedSkills };
            await agencyService.updateTeamMember(member.id, finalData);
            toast.success("HQ Sincronizado");
            onSave();
            onClose();
        } catch (error) {
            console.error("❌ [HQ-Team] Sync Failed:", error);
            toast.error("Error de sincronización");
        } finally {
            setSaving(false);
        }
    };

    const toggleMember = async (memberId, remove = false) => {
        try {
            if (remove) {
                await agencyService.updateTeamMember(memberId, { squad_lead_id: null });
            } else {
                await agencyService.updateTeamMember(memberId, { squad_lead_id: member.id });
            }
            onSave();
            toast.success(remove ? "Retirado" : "Vinculado");
        } catch (error) { toast.error("Error"); }
    };

    const toggleBrand = async (clientId, remove = false) => {
        try {
            if (remove) {
                await agencyService.updateClient(clientId, { cm: null });
            } else {
                await agencyService.assignClientToCM(clientId, member.name);
            }
            onSave();
            toast.success("Sincronizado");
        } catch (error) { toast.error("Error"); }
    };

    const tabs = [
        { id: 'perfil', label: 'Logística', icon: Layout },
        { id: 'profesional', label: 'Expediente', icon: Award },
        { id: 'marcas', label: 'Hojas de Ruta', icon: Globe },
        { id: 'squad', label: 'Escuadra', icon: Shield },
        { id: 'tasks', label: 'Performance', icon: ListTodo }
    ];

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.9, opacity: 0, y: 40 }} 
                className="relative w-full max-w-6xl bg-[#080814] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[85vh]"
            >
                {/* LEFT SIDEBAR: Visual Branding */}
                <div className="w-full md:w-[35%] h-full relative border-r border-white/5 bg-[#05050A] flex flex-col justify-between p-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 space-y-12">
                        <div className="flex justify-between items-start">
                            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] leading-none">0.6 — Final Identity</div>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                                <Shield className="w-3.5 h-3.5 text-white/20" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="relative group mb-8">
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative w-32 h-32 rounded-[32px] bg-[#0A0A1F] border border-white/10 flex items-center justify-center text-5xl font-black text-white shadow-2xl overflow-hidden uppercase italic">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                                    <span className="relative z-10">{formData.name?.[0] || 'T'}</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter text-center leading-tight">{formData.name}</h2>
                            <div className="h-[1px] w-12 bg-indigo-500/30 my-6" />
                            <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.3em] text-center">OPERATIONAL MASTER</p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                                <span>Security Protocol</span>
                                <span className="text-indigo-400">ENCRYPTED</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Talento ID</span>
                                    <span className="text-xs font-mono font-bold text-white tracking-widest">T-{formData.id?.slice(0, 4) || 'CORE'}</span>
                                </div>
                                <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end justify-between opacity-20">
                            <div className="space-y-1">
                                <div className="w-16 h-[1px] bg-white" /><div className="w-10 h-[1px] bg-white" />
                            </div>
                            <div className="text-[8px] font-mono text-white leading-none text-right">ADMIN_HUB_V4.8<br />SYSTEMS_CORE_INIT</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 h-full flex flex-col bg-[#080814]">
                    <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-[18px]">
                            {tabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === t.id ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    <t.icon className="w-3.5 h-3.5" /> {t.label}
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-gray-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
                        {/* Summary Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <SummaryCard label="Cargo Operativo" value={formData.role} icon={Briefcase} />
                            <SummaryCard label="Salario Base" value={`$${formData.salary || 0}`} icon={DollarSign} />
                            <SummaryCard label="Sede Central" value={formData.city || 'Remoto'} icon={MapPin} />
                            <SummaryCard label="Marcas" value={assignedBrands.length} icon={Database} />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                {activeTab === 'perfil' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <CardInput label="Nombre de Talento" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} icon={Database} />
                                        <CardInput label="Cargo Oficial" value={formData.role} onChange={(v) => setFormData({...formData, role: v})} icon={Briefcase} isSelect options={['Editor de Video', 'Community Manager', 'Filmmaker', 'Diseñador', 'Estratega', 'Director General']} />
                                        <CardInput label="Salario Base (USD)" value={formData.salary || ''} onChange={(v) => setFormData({...formData, salary: v})} icon={DollarSign} type="number" />
                                        <CardInput label="WhatsApp" value={formData.whatsapp || ''} onChange={(v) => setFormData({...formData, whatsapp: v})} icon={MessageSquare} />
                                        <CardInput label="Ubicación" value={formData.city || ''} onChange={(v) => setFormData({...formData, city: v})} icon={MapPin} isSelect options={ECUADOR_CITIES.map(c => c.value)} />
                                        {!isEstratega && <CardInput label="Líder de Mando" value={formData.squad_lead_id || ''} onChange={(v) => setFormData({...formData, squad_lead_id: v})} icon={Shield} isSelect options={eligibleLeaders.map(l => ({ value: l.id, label: l.name }))} />}
                                    </div>
                                )}

                                {activeTab === 'profesional' && (
                                    <div className="space-y-8">
                                        <CardInput label="Vínculo de Expediente (URL)" value={formData.cv_url || ''} onChange={(v) => setFormData({...formData, cv_url: v})} icon={ExternalLink} />
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Resumen de Trayectoria</label>
                                            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] min-h-[200px]">
                                                <textarea className="w-full h-full min-h-[150px] bg-transparent text-gray-300 text-sm leading-relaxed outline-none resize-none font-medium" value={formData.cv_summary || ''} onChange={(e) => setFormData({...formData, cv_summary: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'marcas' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4">Marcas Designadas</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div key={b.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-400 border border-emerald-500/20">{b.name[0]}</div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[11px] font-black text-white uppercase italic">{b.name}</span>
                                                                <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">{b.type || 'ACTIVE_SLOT'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => router.push(`/dashboard/hq/strategy?client=${b.id}`)}
                                                                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg text-[8px] font-black uppercase transition-all"
                                                            >
                                                                Estrategia
                                                            </button>
                                                            <button onClick={() => toggleBrand(b.id, true)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                            </div>
                                            {assignedBrands.length === 0 && <p className="text-center py-10 text-gray-600 font-bold uppercase text-[9px] tracking-widest italic border border-dashed border-white/5 rounded-3xl">Sin marcas asignadas</p>}
                                        </div>

                                        <div className="pt-8 border-t border-white/5 space-y-4">
                                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-4">Vincular Nueva Hoja de Ruta</h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                {allClients.filter(c => !assignedBrands.find(ab => ab.id === c.id)).slice(0, 6).map(b => (
                                                    <button key={b.id} onClick={() => toggleBrand(b.id)} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-indigo-500/30 transition-all text-left flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-white uppercase truncate">{b.name}</span>
                                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Connect {'->'}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'squad' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4">Escuadrón Táctico</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {squadMembers.map(m => (
                                                    <div key={m.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-between group hover:border-purple-500/20 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center font-black text-purple-400 border border-purple-500/20">{m.name[0]}</div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[11px] font-black text-white uppercase italic">{m.name}</span>
                                                                <span className="text-[8px] font-black text-purple-500/60 uppercase tracking-widest">{m.role}</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => toggleMember(m.id, true)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                            {squadMembers.length === 0 && <p className="text-center py-10 text-gray-600 font-bold uppercase text-[9px] tracking-widest italic border border-dashed border-white/5 rounded-3xl">Sin miembros vinculados</p>}
                                        </div>

                                        <div className="pt-8 border-t border-white/5 space-y-4">
                                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-4">Desplegar Unidades</h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                {team.filter(m => !m.squad_lead_id && m.id !== member.id).slice(0, 6).map(m => (
                                                    <button key={m.id} onClick={() => toggleMember(m.id)} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-indigo-500/30 transition-all text-left flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-white uppercase truncate">{m.name}</span>
                                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{m.role}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tasks' && (
                                    <div className="space-y-4">
                                        {activeTasks.map(t => (
                                            <div key={t.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-lg font-black text-white uppercase italic">{t.title}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">{t.client}</span>
                                            </div>
                                        ))}
                                        {activeTasks.length === 0 && <p className="text-center py-20 text-gray-600 font-bold uppercase text-[10px] tracking-widest italic">Pipeline despejado</p>}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-10 border-t border-white/5 flex items-center justify-between bg-[#05050A]/50">
                        <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <button onClick={onClose} className="hover:text-white transition-colors">Discard Changes</button>
                        </div>
                        <button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="px-10 py-5 bg-white text-black font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center gap-3 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Syncing...' : 'Deploy Synchronization'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function SummaryCard({ label, value, icon: Icon }) {
    return (
        <div className="px-6 py-5 rounded-[24px] bg-white/[0.03] border border-white/5 flex flex-col gap-1 transition-all hover:border-white/10 group">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3 h-3 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-xs font-black text-white uppercase truncate">{value}</span>
        </div>
    );
}

function CardInput({ label, value, onChange, icon: Icon, isSelect, options, type = 'text' }) {
    return (
        <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">
                <Icon className="w-3 h-3 text-indigo-500/40" /> {label}
            </label>
            <div className="relative group">
                <div className="absolute -inset-[1px] bg-white/5 rounded-2xl group-hover:bg-indigo-500/20 transition-all" />
                {isSelect ? (
                    <select 
                        className="relative w-full bg-[#0F0F1A] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm appearance-none cursor-pointer"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        {options.map(opt => (
                            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                                {typeof opt === 'string' ? opt : opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input 
                        type={type} 
                        className="relative w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )}
            </div>
        </div>
    );
}
function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                active 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl translate-x-1' 
                : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'
            }`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
        </button>
    );
}


function AddMemberModal({ newMember, setNewMember, onClose, onSubmit, isSubmitting }) {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-indigo-950/20 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 30, opacity: 0 }} className="relative w-full max-w-md bg-[#0F0F1A]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-3xl">
                <h3 className="text-3xl font-black text-white uppercase italic mb-8">Nuevo Talento</h3>
                <form onSubmit={onSubmit} className="space-y-6">
                    <input required className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" placeholder="Nombre" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="email" required className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none text-sm" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                        <input className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none text-sm" placeholder="WhatsApp" value={newMember.whatsapp} onChange={(e) => setNewMember({ ...newMember, whatsapp: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none appearance-none text-sm cursor-pointer" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}>
                            <option value="Editor de Video">Editor de Video</option>
                            <option value="Community Manager">Community Manager</option>
                            <option value="Diseñador">Diseñador</option>
                            <option value="Filmmaker">Filmmaker</option>
                            <option value="Estratega">Estratega</option>
                            <option value="Ingeniería de Audio">Ingeniería de Audio</option>
                            <option value="Fotografía">Fotografía</option>
                            <option value="Modelos">Modelos</option>
                            <option value="Desarrollo Web">Desarrollo Web</option>
                            <option value="Imprenta / Merch">Imprenta / Merch</option>
                            <option value="Eventos / Prod">Eventos / Prod</option>
                        </select>
                        <PremiumDropdown 
                            label="Ciudad / Ubicación"
                            value={newMember.city} 
                            onChange={(val) => setNewMember({ ...newMember, city: val })}
                            options={ECUADOR_CITIES}
                            searchable={true}
                            icon={Globe}
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-indigo-500 transition-all opacity-100 disabled:opacity-50">
                        {isSubmitting ? 'Registrando...' : 'Confirmar Ingreso'}
                    </button>
                    <button type="button" onClick={onClose} className="w-full py-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                </form>
            </motion.div>
        </div>
    );
}

function InviteButton({ label, type, color, icon: Icon }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const url = `${window.location.origin}/onboarding?type=${type}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success(`Enlace copiado`, {
            description: `Se ha generado el link de acceso para ${type === 'client' ? 'Socio' : 'Equipo'}.`
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const colors = {
        indigo: 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20 hover:bg-indigo-600 hover:text-white',
        purple: 'bg-purple-500/5 text-purple-400 border-purple-500/20 hover:bg-purple-600 hover:text-white'
    };

    return (
        <button onClick={handleCopy} className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${colors[color]} font-black uppercase text-[10px] transition-all active:scale-95 shadow-xl`}>
            <Icon className="w-4 h-4" />
            {copied ? '¡COPIADO!' : label}
            <Copy className="w-3 h-3 opacity-30 ml-2" />
        </button>
    );
}
